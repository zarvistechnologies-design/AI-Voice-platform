"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
    getServerSession,
    getSession,
    logoutSession,
    subscribeToSession,
    validateStoredSession,
} from "@/lib/auth";
import { billingApi, type BillingSummary } from "@/lib/billing";
import { openRazorpayCheckout } from "@/lib/razorpayCheckout";

const topUpOptions = [5, 10, 50, 100];

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function money(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Math.abs(value) < 1 ? 4 : 2,
    maximumFractionDigits: Math.abs(value) < 1 ? 4 : 2,
  }).format(value);
}

function dateTime(value?: string) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`rounded-2xl border border-white/10 bg-[#07110f] shadow-[0_16px_38px_rgba(0,0,0,0.28)] ${className}`}>{children}</article>;
}

function Metric({ label, value, detail, tone = "sky" }: { label: string; value: string; detail: string; tone?: "sky" | "emerald" | "amber" | "slate" }) {
  const tones = {
    sky: "bg-cyan-50 text-cyan-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <Card className="p-4">
      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{label}</span>
      <strong className="mt-3 block text-2xl font-semibold tracking-tight text-slate-950">{value}</strong>
      <span className="mt-1 block text-xs leading-5 text-slate-500">{detail}</span>
    </Card>
  );
}

export function BillingShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [data, setData] = useState<BillingSummary | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<"" | "topup" | "cancel" | "enterprise">("");
  const [selectedTopUp, setSelectedTopUp] = useState(10);
  const [showUserSidebar, setShowUserSidebar] = useState(false);

  const load = useCallback(async () => {
    try {
      const summary = await billingApi.summary();
      setData(summary);
      setNotice("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load billing.");
    }
  }, []);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/billing");
      return;
    }
    void validateStoredSession();
    const credits = new URLSearchParams(window.location.search).get("credits");
    const timer = window.setTimeout(async () => {
      await load();
      if (credits === "success") setNotice("Payment received. Credits appear after payment confirmation.");
      if (credits === "cancelled") setNotice("Credit purchase was cancelled.");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load, router, session]);

  const wallet = data?.wallet;
  const currency = wallet?.currency || "USD";
  const balance = wallet?.balanceCredits ?? 0;
  const lifetime = Math.max(wallet?.lifetimePurchasedCredits ?? 0, balance, 0);
  const progress = lifetime > 0 ? Math.min(100, Math.max(0, (balance / lifetime) * 100)) : 0;
  const latestPayment = data?.transactions.find((transaction) => transaction.type === "topup" || transaction.type === "auto_reload");

  const totals = useMemo(() => {
    const transactions = data?.transactions ?? [];
    return {
      topUps: transactions.filter((item) => item.type === "topup" || item.type === "auto_reload").length,
      net: transactions.reduce((sum, item) => sum + item.amountCredits, 0),
    };
  }, [data]);

  async function purchaseCredits() {
    if (!data?.configured) {
      setNotice("USD checkout is unavailable until Razorpay API keys are configured.");
      return;
    }
    setBusy("topup");
    try {
      const checkout = await billingApi.topUp(selectedTopUp);
      const payment = await openRazorpayCheckout(checkout);
      const verified = await billingApi.verifyTopUp(payment);
      await load();
      setNotice("$" + verified.credits.toFixed(2) + " in USD credits was added successfully.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not complete credit purchase.");
    } finally {
      setBusy("");
    }
  }

  async function cancelAutopay() {
    if (!window.confirm("Cancel monthly Autopay at the end of the current billing cycle?")) return;
    setBusy("cancel");
    try {
      await billingApi.cancelSubscription(false);
      await load();
      setNotice("Monthly Autopay will cancel at the end of the current billing cycle.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not cancel Autopay.");
    } finally {
      setBusy("");
    }
  }
  async function upgradeEnterprise() {
    if (!data?.configured) {
      setNotice("USD Autopay is unavailable until Razorpay API keys are configured.");
      return;
    }
    setBusy("enterprise");
    try {
      const checkout = await billingApi.checkout("enterprise");
      const payment = await openRazorpayCheckout(checkout);
      await billingApi.verifySubscription(payment);
      await load();
      setNotice(`Your $${checkout.amount / 100} USD monthly Razorpay subscription is active.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not complete enterprise checkout.");
    } finally {
      setBusy("");
    }
  }

  if (!session) return <main className="grid min-h-screen place-items-center bg-black text-sm font-semibold text-white/60">Loading billing</main>;

  return (
    <main className={`dashboard-home-theme grid min-h-screen bg-black text-white ${
      showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
    }`}>
      <DashboardSidebar
        activeLabel="Billing"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => void logoutSession().then(() => router.replace("/login"))}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />
      <section className="min-w-0 p-4">
        <div className="mx-auto grid max-w-[1500px] gap-6">
          <header className="border-b border-[#45ddce]/24 bg-[#07110f] pb-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00b8c4]">Pay per use</span>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Credit command center</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Top up once and run calls. Per-call provider costs are available in Call Logs.</p>
              </div>
              <div className="flex gap-2">
              <button className="rounded-xl border border-white/10 bg-[#061b18] px-4 py-2.5 text-sm font-semibold text-white/70 shadow-sm hover:bg-white/[0.08] hover:text-white" type="button" onClick={() => void load()} disabled={Boolean(busy)}>
                Refresh
              </button>
              <button className="rounded-xl bg-[#45ddce] px-4 py-2.5 text-sm font-semibold text-[#02110d] shadow-[0_12px_28px_rgba(69,221,206,0.20)] hover:bg-[#75fff0] disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => void purchaseCredits()} disabled={busy === "topup" || !data?.configured}>
                Buy ${selectedTopUp}
              </button>
              </div>
            </div>
          </header>

          {notice ? <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">{notice}</div> : null}
          {!data?.configured ? <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-200">Razorpay USD checkout is offline. Add live API credentials and the webhook secret to the production environment, then enable international payments in Razorpay.</div> : null}
          {data?.paymentReadiness ? (
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#07110f] p-4 sm:grid-cols-3">
              {[
                ["Checkout mode", data.paymentReadiness.mode],
                ["API credentials", data.paymentReadiness.credentialsConfigured ? "configured" : "missing"],
                ["Webhook signing", data.paymentReadiness.webhookConfigured ? "configured" : "missing"],
              ].map(([label, value]) => (
                <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3" key={label}>
                  <span className="block text-xs text-white/45">{label}</span>
                  <strong className={`mt-1 block capitalize ${value === "live" || value === "configured" ? "text-emerald-300" : "text-amber-300"}`}>{value}</strong>
                </div>
              ))}
            </div>
          ) : null}

          <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
            <Card className="overflow-hidden">
              <div className="grid gap-6 bg-[radial-gradient(circle_at_8%_0%,rgba(69,221,206,0.11),transparent_40%),linear-gradient(135deg,#07110f_0%,#061b18_100%)] p-5 md:grid-cols-[minmax(0,1fr)_320px] md:p-6">
                <div className="grid content-between gap-6">
                  <div>
                    <span className="inline-flex rounded-full bg-[#45ddce]/10 px-3 py-1 text-xs font-semibold text-[#75fff0] shadow-sm ring-1 ring-[#45ddce]/24">Wallet balance</span>
                    <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{money(balance, currency)}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Calls start only when the wallet has the minimum required balance. Completed-call costs are deducted automatically and shown in Call Logs.</p>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                      <span>{money(balance, currency)} available</span>
                      <span>{money(lifetime, currency)} lifetime credits</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10 shadow-inner ring-1 ring-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-400" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 shadow-sm backdrop-blur">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quick top-up</span>
                  <div className="grid grid-cols-2 gap-2">
                    {topUpOptions.map((amount) => (
                      <button
                        className={`min-h-12 rounded-xl border px-3 text-sm font-semibold transition ${selectedTopUp === amount ? "border-[#45ddce]/35 bg-[#45ddce] text-[#02110d] shadow-[0_10px_24px_rgba(69,221,206,0.18)]" : "border-white/10 bg-[#07110f] text-white/70 hover:border-[#45ddce]/35 hover:bg-[#45ddce]/10 hover:text-white"}`}
                        key={amount}
                        type="button"
                        aria-pressed={selectedTopUp === amount}
                        onClick={() => setSelectedTopUp(amount)}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <button className="min-h-12 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => void purchaseCredits()} disabled={busy === "topup" || !data?.configured}>
                    {busy === "topup" ? "Opening checkout..." : "Purchase credits"}
                  </button>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <Metric label="This month charged" value={money(data?.usage.chargedCredits ?? 0, currency)} detail="Provider cost debited from calls" tone="emerald" />
              <Metric label="Provider spend" value={money(data?.usage.providerCost ?? 0, currency)} detail="LLM/STT/TTS cost only" tone="sky" />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <Metric label="Minimum to call" value={money(data?.creditSettings.minimumCallStartCredits ?? 0, currency)} detail="Pre-call wallet guard" tone="amber" />
            <Metric label="Recent top-ups" value={String(totals.topUps)} detail={`${money(totals.net, currency)} across recent payment rows`} tone="sky" />
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
            <Card>
              <div className="border-b border-slate-200 p-5">
                <h2 className="m-0 text-lg font-semibold">Monthly Autopay</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">Your card mandate and recurring Enterprise billing status.</p>
              </div>
              <div className="grid gap-5 p-5">
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Plan</span><strong className="capitalize text-slate-950">{data?.subscription.plan ?? "free"}</strong></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Status</span><strong className="capitalize text-slate-950">{data?.subscription.status?.replace("_", " ") ?? "inactive"}</strong></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Monthly charge</span><strong className="text-slate-950">{money(data?.enterpriseMonthlyUsd ?? 500, "USD")}</strong></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Next renewal</span><strong className="text-right text-slate-950">{dateTime(data?.subscription.currentPeriodEnd)}</strong></div>
                </div>
                {data?.subscription.provider === "razorpay" && !data.subscription.cancelAtPeriodEnd && data.subscription.status !== "cancelled" ? (
                  <button className="w-fit rounded-xl border border-rose-400/30 px-4 py-2.5 text-sm font-semibold text-rose-300 hover:bg-rose-400/10 disabled:opacity-60" type="button" onClick={() => void cancelAutopay()} disabled={busy === "cancel"}>
                    {busy === "cancel" ? "Cancelling..." : "Cancel at period end"}
                  </button>
                ) : null}
                {data?.subscription.cancelAtPeriodEnd ? <p className="m-0 text-sm font-semibold text-amber-300">Cancellation is scheduled for the end of this billing cycle.</p> : null}
              </div>
            </Card>

            <div className="grid gap-4">
              <Card className="">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="m-0 text-lg font-semibold">Payment status</h2>
                    <p className="mt-1 text-sm text-slate-500">{session.email}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${wallet?.lastPaymentStatus === "success" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{wallet?.lastPaymentStatus ?? "none"}</span>
                </div>
                <div className="mt-5 grid gap-3 text-sm">
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Provider</span><strong className="text-slate-950">{wallet?.paymentProvider === "razorpay" ? "Razorpay" : "Internal / not linked"}</strong></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Last payment</span><strong className="text-slate-950">{latestPayment ? money(latestPayment.amountCredits, currency) : money(wallet?.lastPaymentAmountCredits ?? 0, currency)}</strong></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Last checked</span><strong className="text-right text-slate-950">{dateTime(wallet?.lastCheckedAt)}</strong></div>
                </div>
              </Card>

              <Card className="overflow-hidden">
                <div className="bg-slate-950 p-5 text-white">
                  <h2 className="m-0 text-lg font-semibold">Enterprise credits</h2>
                  <p className="mt-2 text-sm leading-6 text-white/65">${data?.enterpriseMonthlyUsd ?? 500} in wallet credits added after each successful monthly Razorpay charge.</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-[#9ff8ee]">
                    <span className="rounded-full border border-[#45ddce]/30 bg-[#45ddce]/10 px-2.5 py-1">Monthly Autopay</span>
                    <span className="rounded-full border border-[#45ddce]/30 bg-[#45ddce]/10 px-2.5 py-1">Indian cards</span>
                    <span className="rounded-full border border-[#45ddce]/30 bg-[#45ddce]/10 px-2.5 py-1">International cards</span>
                  </div>
                  {data?.subscription.provider !== "razorpay" || data.subscription.status === "cancelled" ? <button className="mt-5 rounded-xl bg-[#45ddce] px-4 py-2.5 text-sm font-semibold text-[#02110d] hover:bg-[#75fff0] disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => void upgradeEnterprise()} disabled={busy === "enterprise" || !data?.configured}>Start monthly Autopay</button> : null}
                </div>
              </Card>
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}



