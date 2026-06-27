"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import { billingApi, type BillingSummary, type BillingTransaction } from "@/lib/billing";

const topUpOptions = [5, 10, 50, 100];
const refillOptions = [5, 10, 50, 100, 500, 1000];

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

function signedMoney(value: number, currency = "USD") {
  return `${value < 0 ? "-" : "+"}${money(Math.abs(value), currency)}`;
}

function dateTime(value?: string) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function txLabel(transaction: BillingTransaction) {
  if (transaction.description) return transaction.description;
  if (transaction.category === "call") return `Call ${transaction.callId}`;
  return transaction.type === "topup" ? "Credit purchase" : "Billing adjustment";
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</article>;
}

function Metric({ label, value, detail, tone = "sky" }: { label: string; value: string; detail: string; tone?: "sky" | "emerald" | "amber" | "slate" }) {
  const tones = {
    sky: "bg-sky-50 text-sky-700",
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
  const [busy, setBusy] = useState<"" | "topup" | "reload" | "portal" | "enterprise">("");
  const [selectedTopUp, setSelectedTopUp] = useState(10);
  const [threshold, setThreshold] = useState("5");
  const [reloadAmount, setReloadAmount] = useState(10);
  const [showUserSidebar, setShowUserSidebar] = useState(false);

  const load = useCallback(async () => {
    try {
      const summary = await billingApi.summary();
      setData(summary);
      setThreshold(String(summary.wallet.reloadThresholdCredits));
      setReloadAmount(summary.wallet.reloadAmountCredits);
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
      if (credits === "success") setNotice("Payment received. Credits appear after Stripe webhook confirmation.");
      if (credits === "cancelled") setNotice("Credit purchase was cancelled.");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load, router, session]);

  const wallet = data?.wallet;
  const currency = wallet?.currency || "USD";
  const balance = wallet?.balanceCredits ?? 0;
  const lifetime = Math.max(wallet?.lifetimePurchasedCredits ?? 0, balance, 1);
  const progress = Math.min(100, Math.max(4, (balance / lifetime) * 100));
  const latestPayment = data?.transactions.find((transaction) => transaction.type === "topup" || transaction.type === "auto_reload");

  const totals = useMemo(() => {
    const transactions = data?.transactions ?? [];
    return {
      debits: transactions.filter((item) => item.category === "call").length,
      topUps: transactions.filter((item) => item.type === "topup" || item.type === "auto_reload").length,
      net: transactions.reduce((sum, item) => sum + item.amountCredits, 0),
    };
  }, [data]);

  async function purchaseCredits() {
    setBusy("topup");
    try {
      const result = await billingApi.topUp(selectedTopUp);
      window.location.assign(result.url);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not start credit purchase.");
      setBusy("");
    }
  }

  async function saveReload(enabled: boolean) {
    setBusy("reload");
    try {
      const result = await billingApi.updateAutoReload({
        enabled,
        thresholdCredits: Number(threshold) || 0,
        reloadAmountCredits: reloadAmount,
      });
      setData((current) => current ? { ...current, wallet: result.wallet } : current);
      setNotice(enabled ? "Auto-refill settings saved." : "Auto-refill removed.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save auto-refill.");
    } finally {
      setBusy("");
    }
  }

  async function openPortal() {
    setBusy("portal");
    try {
      const result = await billingApi.portal();
      window.location.assign(result.url);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not open billing portal.");
      setBusy("");
    }
  }

  async function upgradeEnterprise() {
    setBusy("enterprise");
    try {
      const result = await billingApi.checkout("enterprise");
      window.location.assign(result.url);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not start enterprise checkout.");
      setBusy("");
    }
  }

  if (!session) return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold">Loading billing</main>;

  return (
    <main className={`grid min-h-screen bg-[#f4f7fb] text-slate-950 ${
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
          <header className="border-b border-[#bae6fd] bg-white pb-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0284c7]">Pay per use</span>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Credit command center</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Top up once, run calls, and see every provider charge broken down by LLM, STT, TTS, and carrier usage.</p>
              </div>
              <div className="flex gap-2">
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50" type="button" onClick={() => void load()} disabled={Boolean(busy)}>
                Refresh
              </button>
              <button className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-700" type="button" onClick={() => void purchaseCredits()} disabled={busy === "topup"}>
                Buy ${selectedTopUp}
              </button>
              </div>
            </div>
          </header>

          {notice ? <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800">{notice}</div> : null}
          {!data?.configured ? <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">Stripe is not configured yet. Credits can be granted internally, but checkout needs Stripe keys and webhook secret.</div> : null}

          <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
            <Card className="overflow-hidden">
              <div className="grid gap-6 bg-gradient-to-br from-white via-sky-50 to-sky-50 p-5 md:grid-cols-[minmax(0,1fr)_320px] md:p-6">
                <div className="grid content-between gap-6">
                  <div>
                    <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm ring-1 ring-sky-100">Wallet balance</span>
                    <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{money(balance, currency)}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Calls start only when the wallet has the minimum required balance. Each completed call writes a ledger debit with provider-level detail.</p>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                      <span>{money(balance, currency)} available</span>
                      <span>{money(lifetime, currency)} lifetime credits</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white shadow-inner ring-1 ring-slate-200">
                      <div className="h-full rounded-full bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quick top-up</span>
                  <div className="grid grid-cols-2 gap-2">
                    {topUpOptions.map((amount) => (
                      <button
                        className={`min-h-12 rounded-xl border px-3 text-sm font-semibold transition ${selectedTopUp === amount ? "border-sky-500 bg-sky-600 text-white shadow-lg shadow-sky-600/20" : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50"}`}
                        key={amount}
                        type="button"
                        onClick={() => setSelectedTopUp(amount)}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <button className="min-h-12 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-60" type="button" onClick={() => void purchaseCredits()} disabled={busy === "topup"}>
                    {busy === "topup" ? "Opening checkout..." : "Purchase credits"}
                  </button>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <Metric label="This month charged" value={money(data?.usage.chargedCredits ?? 0, currency)} detail="Total wallet debit from calls" tone="emerald" />
              <Metric label="Provider spend" value={money(data?.usage.providerCost ?? 0, currency)} detail="Raw LLM/STT/TTS/carrier cost" tone="sky" />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric label="Minimum to call" value={money(data?.creditSettings.minimumCallStartCredits ?? 0, currency)} detail="Pre-call wallet guard" tone="amber" />
            <Metric label="Markup" value={`${data?.creditSettings.markupMultiplier ?? 2.5}x`} detail="Applied to provider cost" tone="slate" />
            <Metric label="Top-ups" value={String(totals.topUps)} detail={`${money(totals.net, currency)} net ledger movement`} tone="sky" />
            <Metric label="Call debits" value={String(totals.debits)} detail="Recent call charge rows" tone="emerald" />
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
            <Card>
              <div className="border-b border-slate-200 p-5">
                <h2 className="m-0 text-lg font-semibold">Auto-refill</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">Keep browser and phone calls from stopping because the wallet gets too low.</p>
              </div>
              <div className="grid gap-5 p-5">
                <label className="grid gap-2 text-sm font-semibold text-slate-700 md:grid-cols-[140px_minmax(0,1fr)] md:items-center">
                  <span>Threshold</span>
                  <span className="flex h-12 items-center rounded-xl border border-slate-200 bg-white px-4">
                    <span className="mr-3 text-slate-500">$</span>
                    <input className="w-full bg-transparent text-slate-950 outline-none" inputMode="decimal" value={threshold} onChange={(event) => setThreshold(event.target.value)} />
                  </span>
                </label>
                <div className="grid gap-3 text-sm font-semibold text-slate-700 md:grid-cols-[140px_minmax(0,1fr)] md:items-center">
                  <span>Refill amount</span>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {refillOptions.map((amount) => (
                      <button className={`h-11 rounded-xl border text-sm font-semibold ${reloadAmount === amount ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`} key={amount} type="button" onClick={() => setReloadAmount(amount)}>
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2 text-sm font-semibold md:grid-cols-[140px_minmax(0,1fr)]">
                  <span className="text-slate-700">Status</span>
                  <span className={wallet?.autoReloadEnabled ? "text-emerald-700" : "text-slate-500"}>
                    <span className={`mr-2 inline-block size-2 rounded-full ${wallet?.autoReloadEnabled ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {wallet?.autoReloadEnabled ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 md:pl-[140px]">
                  <button className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-60" type="button" onClick={() => void saveReload(true)} disabled={busy === "reload"}>
                    Activate auto-refill
                  </button>
                  {wallet?.autoReloadEnabled ? <button className="rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50" type="button" onClick={() => void saveReload(false)} disabled={busy === "reload"}>Remove</button> : null}
                </div>
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
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Provider</span><strong className="text-slate-950">{wallet?.paymentProvider === "stripe" ? "Stripe" : "Internal / not linked"}</strong></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Last payment</span><strong className="text-slate-950">{latestPayment ? money(latestPayment.amountCredits, currency) : money(wallet?.lastPaymentAmountCredits ?? 0, currency)}</strong></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Last checked</span><strong className="text-right text-slate-950">{dateTime(wallet?.lastCheckedAt)}</strong></div>
                </div>
                <button className="mt-5 min-h-11 w-full rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60" type="button" onClick={() => void openPortal()} disabled={busy === "portal"}>
                  Open invoices
                </button>
              </Card>

              <Card className="overflow-hidden">
                <div className="bg-slate-950 p-5 text-white">
                  <h2 className="m-0 text-lg font-semibold">Enterprise credits</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">$500/month credit, priority support, and higher call concurrency.</p>
                  <button className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-50 disabled:opacity-60" type="button" onClick={() => void upgradeEnterprise()} disabled={busy === "enterprise"}>
                    Upgrade
                  </button>
                </div>
              </Card>
            </div>
          </section>

          <Card className="overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="m-0 text-lg font-semibold">Transactions</h2>
                <p className="mt-1 text-sm text-slate-500">Every top-up, call debit, refund, and auto-refill lands here.</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">{data?.transactions.length ?? 0} recent rows</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>{["ID", "Transaction", "Category", "Amount", "Type", "Timestamp"].map((heading) => <th className="px-5 py-3" key={heading}>{heading}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.transactions.length ? data.transactions.map((transaction) => (
                    <tr className="hover:bg-sky-50/50" key={transaction._id}>
                      <td className="max-w-[180px] truncate px-5 py-4 font-mono text-xs text-slate-500">{transaction._id}</td>
                      <td className="px-5 py-4 font-semibold text-slate-950">{txLabel(transaction)}</td>
                      <td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{transaction.category}</span></td>
                      <td className={`px-5 py-4 font-semibold ${transaction.amountCredits < 0 ? "text-rose-700" : "text-emerald-700"}`}>{signedMoney(transaction.amountCredits, transaction.currency)}</td>
                      <td className="px-5 py-4 font-medium text-slate-700">{transaction.type}</td>
                      <td className="px-5 py-4 text-slate-600">{dateTime(transaction.createdAt)}</td>
                    </tr>
                  )) : (
                    <tr><td className="px-5 py-10 text-center text-slate-500" colSpan={6}>No credit transactions yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
