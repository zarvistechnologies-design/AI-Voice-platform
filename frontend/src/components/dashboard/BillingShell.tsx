"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { DashboardSidebar, getDashboardSidebarInitialState } from "@/components/dashboard/DashboardSidebar";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { getServerSession, getSession, logoutSession, subscribeToSession, validateStoredSession } from "@/lib/auth";
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

export function BillingShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [data, setData] = useState<BillingSummary | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<"" | "topup" | "cancel" | "enterprise" | `invoice:${string}`>("");
  const [selectedTopUp, setSelectedTopUp] = useState(10);
  const [showUserSidebar, setShowUserSidebar] = useState(getDashboardSidebarInitialState);

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
  const latestPayment = data?.transactions.find((item) => item.type === "topup" || item.type === "auto_reload");
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
      setNotice(`$${verified.credits.toFixed(2)} in USD credits was added successfully.`);
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

  async function downloadInvoice(invoiceId: string, invoiceNumber: string) {
    setBusy(`invoice:${invoiceId}`);
    try {
      const blob = await billingApi.downloadInvoice(invoiceId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${invoiceNumber || `Vozon-invoice-${invoiceId}`}.html`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
      setNotice("Invoice downloaded. Open it and select Print / Save PDF for a PDF copy.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not download invoice.");
    } finally {
      setBusy("");
    }
  }

  if (!session) return <main className="grid min-h-screen place-items-center bg-[#f7f9f8] text-sm font-semibold text-[#71817d]">Loading billing</main>;

  return (
    <main className={`dashboard-home-theme grid min-h-screen bg-[#f7f9f8] text-[#14231f] ${showUserSidebar ? "lg:grid-cols-[248px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"}`}>
      <DashboardSidebar activeLabel="Billing" userInitials={initials(session.name)} userName={session.name} userEmail={session.email} onLogout={() => void logoutSession().then(() => router.replace("/login"))} showUserSidebar={showUserSidebar} setShowUserSidebar={setShowUserSidebar} />

      <section className="min-w-0 overflow-y-auto">
        <DashboardPageHeader
          eyebrow="Pay per use"
          title="Billing"
          description="Manage credits, usage, payments, and invoices."
          actions={
            <button className="rounded-lg border border-[#c6d4d0] bg-white px-4 py-2.5 text-sm font-semibold text-[#52645f] hover:border-[#118778] hover:text-[#0e6f62]" type="button" onClick={() => void load()} disabled={Boolean(busy)}>Refresh</button>
          }
        />

        <div className="grid w-full gap-5 px-4 py-4 sm:px-5 lg:px-6">
          {notice ? <div className="rounded-lg border border-[#b8c8c3] bg-[#edf7f4] px-4 py-3 text-sm font-semibold text-[#123d35]">{notice}</div> : null}

          {data?.paymentReadiness ? (
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#dbe4e1] bg-white px-5 py-4">
              <div className="flex items-center gap-3"><span className={`size-2.5 rounded-full ${data.configured ? "bg-emerald-500" : "bg-amber-500"}`} /><div><h2 className="app-section-title m-0">Payment setup</h2><p className="app-caption mt-1 mb-0">{data.configured ? "Checkout is ready" : "Checkout configuration is incomplete"}</p></div></div>
              <dl className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                <div><dt className="text-[#71817d]">Mode</dt><dd className="m-0 mt-0.5 font-semibold capitalize">{data.paymentReadiness.mode}</dd></div>
                <div><dt className="text-[#71817d]">Credentials</dt><dd className="m-0 mt-0.5 font-semibold">{data.paymentReadiness.credentialsConfigured ? "Ready" : "Missing"}</dd></div>
                <div><dt className="text-[#71817d]">Webhook</dt><dd className="m-0 mt-0.5 font-semibold">{data.paymentReadiness.webhookConfigured ? "Ready" : "Missing"}</dd></div>
              </dl>
            </section>
          ) : null}

          <section className="overflow-hidden rounded-xl border border-[#dbe4e1] bg-white">
            <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_320px] md:p-6">
              <div><span className="app-label text-[#0e6f62]">Available balance</span><h2 className="mt-2 mb-0 text-4xl font-semibold tracking-tight text-slate-950">{money(balance, currency)}</h2><p className="app-caption mt-2 mb-0">{money(lifetime, currency)} lifetime credits purchased</p></div>
              <div className="grid gap-3 border-t border-[#dbe4e1] pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                <span className="app-label">Add credits</span>
                <div className="grid grid-cols-4 gap-2">
                  {topUpOptions.map((amount) => <button className={`min-h-10 rounded-lg border text-sm font-semibold ${selectedTopUp === amount ? "border-[#118778] bg-[#edf7f4] text-[#0e6f62]" : "border-[#dbe4e1] bg-white text-[#52645f] hover:border-[#118778]/60"}`} key={amount} type="button" aria-pressed={selectedTopUp === amount} onClick={() => setSelectedTopUp(amount)}>${amount}</button>)}
                </div>
                <button className="min-h-11 rounded-lg bg-[#118778] px-4 text-sm font-semibold text-white hover:bg-[#0e6f62] disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => void purchaseCredits()} disabled={busy === "topup" || !data?.configured}>{busy === "topup" ? "Opening checkout..." : `Add $${selectedTopUp} credits`}</button>
              </div>
            </div>
            <dl className="grid border-t border-[#dbe4e1] sm:grid-cols-2 lg:grid-cols-4">
              {[["This month", money(data?.usage.chargedCredits ?? 0, currency)], ["Provider spend", money(data?.usage.providerCost ?? 0, currency)], ["Minimum to call", money(data?.creditSettings.minimumCallStartCredits ?? 0, currency)], ["Recent top-ups", `${totals.topUps} (${money(totals.net, currency)})`]].map(([label, value], index) => <div className={`px-5 py-4 ${index ? "border-t border-[#dbe4e1] sm:border-t-0 sm:border-l" : ""}`} key={label}><dt className="app-caption">{label}</dt><dd className="m-0 mt-1 text-lg font-semibold">{value}</dd></div>)}
            </dl>
          </section>

          <section className="overflow-hidden rounded-xl border border-[#dbe4e1] bg-white">
            <div className="border-b border-[#dbe4e1] px-5 py-4"><h2 className="app-section-title m-0">Billing details</h2></div>
            <div className="grid md:grid-cols-2">
              <div className="p-5">
                <div className="flex items-center justify-between gap-3"><h3 className="m-0 text-sm font-semibold">Monthly Autopay</h3><span className="rounded-full bg-[#f6f6f8] px-2.5 py-1 text-xs font-semibold capitalize text-[#52645f]">{data?.subscription.status?.replace("_", " ") ?? "inactive"}</span></div>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Plan</dt><dd className="m-0 font-semibold capitalize">{data?.subscription.plan ?? "free"}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Monthly charge</dt><dd className="m-0 font-semibold">{money(data?.enterpriseMonthlyUsd ?? 500, "USD")}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Next renewal</dt><dd className="m-0 text-right font-semibold">{dateTime(data?.subscription.currentPeriodEnd)}</dd></div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  {data?.subscription.provider !== "razorpay" || data.subscription.status === "cancelled" ? <button className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62] disabled:opacity-50" type="button" onClick={() => void upgradeEnterprise()} disabled={busy === "enterprise" || !data?.configured}>Start Autopay</button> : null}
                  {data?.subscription.provider === "razorpay" && !data.subscription.cancelAtPeriodEnd && data.subscription.status !== "cancelled" ? <button className="rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50" type="button" onClick={() => void cancelAutopay()} disabled={busy === "cancel"}>{busy === "cancel" ? "Cancelling..." : "Cancel Autopay"}</button> : null}
                </div>
                {data?.subscription.cancelAtPeriodEnd ? <p className="mt-3 mb-0 text-sm font-semibold text-amber-700">Cancellation is scheduled for the end of this billing cycle.</p> : null}
              </div>
              <div className="border-t border-[#dbe4e1] p-5 md:border-t-0 md:border-l">
                <div className="flex items-center justify-between gap-3"><div><h3 className="m-0 text-sm font-semibold">Payment method</h3><p className="app-caption mt-1 mb-0">{session.email}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${wallet?.lastPaymentStatus === "success" ? "bg-emerald-50 text-emerald-700" : "bg-[#f6f6f8] text-[#52645f]"}`}>{wallet?.lastPaymentStatus ?? "none"}</span></div>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Provider</dt><dd className="m-0 font-semibold">{wallet?.paymentProvider === "razorpay" ? "Razorpay" : "Not linked"}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Last payment</dt><dd className="m-0 font-semibold">{latestPayment ? money(latestPayment.amountCredits, currency) : money(wallet?.lastPaymentAmountCredits ?? 0, currency)}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Last checked</dt><dd className="m-0 text-right font-semibold">{dateTime(wallet?.lastCheckedAt)}</dd></div>
                </dl>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-[#dbe4e1] bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-[#dbe4e1] px-5 py-4"><div><h2 className="app-section-title m-0">Invoices</h2><p className="app-caption mt-1 mb-0">Wallet top-ups and monthly charges</p></div><span className="app-caption">{data?.invoices.length ?? 0} invoices</span></div>
            {data?.invoices.length ? <div className="divide-y divide-[#dbe4e1]">{data.invoices.map((invoice) => {
              const amount = (invoice.amountPaid ?? invoice.amountDue ?? 0) / 100;
              const isDownloading = busy === `invoice:${invoice._id}`;
              return <div className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center" key={invoice._id}><div className="min-w-0"><strong className="block truncate text-sm">{invoice.invoiceNumber || "Vozon payment invoice"}</strong><span className="app-caption mt-1 block">{invoice.description || dateTime(invoice.createdAt)}</span></div><div className="sm:text-right"><strong className="block text-sm">{money(amount, invoice.currency.toUpperCase())}</strong><span className="app-caption mt-1 block capitalize">{invoice.status || "paid"} · {dateTime(invoice.createdAt)}</span></div><button className="rounded-lg border border-[#b8c8c3] px-3 py-2 text-sm font-semibold text-[#0e6f62] hover:bg-[#edf7f4] disabled:opacity-50" type="button" onClick={() => void downloadInvoice(invoice._id, invoice.invoiceNumber)} disabled={Boolean(busy)}>{isDownloading ? "Downloading..." : "Download"}</button></div>;
            })}</div> : <div className="px-5 py-8 text-center text-sm text-[#71817d]">No invoices yet.</div>}
          </section>
        </div>
      </section>
    </main>
  );
}
