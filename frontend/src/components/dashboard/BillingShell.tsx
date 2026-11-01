"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { DashboardSidebar, getDashboardSidebarInitialState } from "@/components/dashboard/DashboardSidebar";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { getServerSession, getSession, logoutSession, subscribeToSession, validateStoredSession } from "@/lib/auth";
import { billingApi, type BillingSummary } from "@/lib/billing";
import { openRazorpayCheckout } from "@/lib/razorpayCheckout";
import { PaymentSuccessModal, type PaymentSuccessData } from "./PaymentSuccessModal";

const topUpOptions = [2_000, 3_000, 5_000, 10_000, 20_000, 50_000];

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function money(value: number, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
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
  const [busy, setBusy] = useState<"" | "topup" | "cancel" | "enterprise" | "profile" | `invoice:${string}`>("");
  const [selectedTopUp, setSelectedTopUp] = useState(2_000);
  const [gstin, setGstin] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [showBillingDetails, setShowBillingDetails] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(getDashboardSidebarInitialState);
  const [successData, setSuccessData] = useState<PaymentSuccessData | null>(null);

  const load = useCallback(async () => {
    try {
      const summary = await billingApi.summary();
      setData(summary);
      setGstin(summary.billingProfile?.gstin ?? "");
      setBillingAddress(summary.billingProfile?.address ?? "");
      setNotice("");
      return summary;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load billing.");
      return null;
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
      if (credits === "success") {
        setNotice("Payment return received. Check the wallet balance and invoice to confirm your credits were added.");
      }
      if (credits === "cancelled") setNotice("Credit purchase was cancelled.");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load, router, session?.id, session?.organization?.id]);

  const wallet = data?.wallet;
  const inrPerUsd = data?.inrPerUsd && data.inrPerUsd > 0 ? data.inrPerUsd : 96.5;
  const walletCurrency = wallet?.currency?.toUpperCase() || "USD";
  const toInr = useCallback((value: number, sourceCurrency = walletCurrency) => (
    sourceCurrency.toUpperCase() === "INR" ? value : value * inrPerUsd
  ), [inrPerUsd, walletCurrency]);
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
      setNotice("INR checkout is unavailable until Razorpay API keys are configured.");
      return;
    }
    if (!selectedTopUp || selectedTopUp < 2_000 || selectedTopUp > 1_000_000) {
      setNotice("Please choose or enter a recharge amount between ₹2,000 and ₹10,00,000.");
      return;
    }
    setBusy("topup");
    try {
      const checkout = await billingApi.topUp(selectedTopUp);
      const payment = await openRazorpayCheckout({ ...checkout, displayMode: "all" });
      const verification = await billingApi.verifyTopUp(payment);
      const updated = await load();
      setNotice(`${money(checkout.amount / 100)} payment received and credits added successfully.`);
      setSuccessData({
        isOpen: true,
        type: "topup",
        amountInr: checkout.amount / 100,
        creditsAdded: (verification?.credits ?? checkout.credits ?? selectedTopUp / inrPerUsd) * inrPerUsd,
        paymentId: payment.razorpay_payment_id,
        invoiceId: verification?.invoiceId,
        newBalanceCredits: updated?.wallet ? toInr(updated.wallet.balanceCredits, updated.wallet.currency) : undefined,
      });
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
      setNotice("INR Autopay is unavailable until Razorpay API keys are configured.");
      return;
    }
    setBusy("enterprise");
    try {
      const checkout = await billingApi.checkout("enterprise");
      const payment = await openRazorpayCheckout({ ...checkout, displayMode: "all" });
      await billingApi.verifySubscription(payment);
      const updated = await load();
      setNotice(`Your ${money(checkout.amount / 100)} monthly Razorpay subscription is active.`);
      setSuccessData({
        isOpen: true,
        type: "subscription",
        amountInr: checkout.amount / 100,
        creditsAdded: toInr(500),
        paymentId: payment.razorpay_payment_id,
        newBalanceCredits: updated?.wallet ? toInr(updated.wallet.balanceCredits, updated.wallet.currency) : undefined,
      });
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
      const baseInvoiceName = data?.whiteLabel?.productName ? `${data.whiteLabel.productName}-invoice-${invoiceId}` : `Vozon-invoice-${invoiceId}`;
      anchor.download = `${invoiceNumber || baseInvoiceName}.html`;
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

  async function saveBillingDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("profile");
    try {
      const result = await billingApi.updateBillingProfile({ gstin, address: billingAddress });
      setGstin(result.billingProfile.gstin);
      setBillingAddress(result.billingProfile.address);
      setData((current) => current ? { ...current, billingProfile: result.billingProfile } : current);
      setShowBillingDetails(false);
      setNotice("Billing details saved. The address and GSTIN will appear on invoices when provided.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save the billing details.");
    } finally {
      setBusy("");
    }
  }

  function closeBillingDetails() {
    setGstin(data?.billingProfile?.gstin ?? "");
    setBillingAddress(data?.billingProfile?.address ?? "");
    setShowBillingDetails(false);
  }

  if (!session) return <main className="grid min-h-screen place-items-center bg-[#f7f9f8] text-sm font-semibold text-[#71817d]">Loading billing</main>;

  return (
    <main className={`dashboard-home-theme grid min-h-screen bg-[#f7f9f8] text-[#14231f] ${showUserSidebar ? "lg:grid-cols-[248px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"}`}>
      <DashboardSidebar activeLabel="Billing" userInitials={initials(session.name)} userName={session.name} userEmail={session.email} onLogout={() => void logoutSession().then(() => router.replace("/login"))} showUserSidebar={showUserSidebar} setShowUserSidebar={setShowUserSidebar} />

      <section className="min-w-0 overflow-y-auto">
        <DashboardPageHeader
          eyebrow={data?.whiteLabel ? "Account & Usage" : "Pay per use"}
          title="Billing"
          description={data?.whiteLabel ? `Subscription and usage details for ${data.whiteLabel.productName}.` : "Manage rupee credits, usage, payments, and invoices."}
          actions={
            <button className="rounded-lg border border-[#c6d4d0] bg-white px-4 py-2.5 text-sm font-semibold text-[#52645f] hover:border-[#118778] hover:text-[#0e6f62]" type="button" onClick={() => void load()} disabled={Boolean(busy)}>Refresh</button>
          }
        />

        <div className="grid w-full gap-5 px-4 py-4 sm:px-5 lg:px-6">
          {notice ? <div className="rounded-lg border border-[#b8c8c3] bg-[#edf7f4] px-4 py-3 text-sm font-semibold text-[#123d35]">{notice}</div> : null}

          {data?.whiteLabel?.managedByPartner ? (() => {
            const planLimits = (data.currentPlan?.limits ?? {}) as Record<string, number | undefined>;
            const minutesUsed = Math.round(data.usage?.minutes ?? 0);
            const minutesLimit = Number(planLimits.monthlyMinutes ?? 0);
            const minutesPercent = minutesLimit > 0 ? Math.min(100, Math.round((minutesUsed / minutesLimit) * 100)) : 0;

            const agentsUsed = Number(data.usage?.agents ?? 0);
            const agentsLimit = Number(planLimits.agents ?? 0);
            const agentsPercent = agentsLimit > 0 ? Math.min(100, Math.round((agentsUsed / agentsLimit) * 100)) : 0;

            const callsCount = Number(data.usage?.calls ?? 0);
            const concurrentLines = Number(planLimits.concurrentCalls ?? 1);

            return (
              <section className="overflow-hidden rounded-xl border border-[#dbe4e1] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="app-label text-[#0e6f62]">Subscription & Plan</span>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#14231f]">
                      {data.currentPlan?.name ?? (data.subscription?.plan ? data.subscription.plan.replaceAll("_", " ") : "Active Plan")}
                    </h2>
                    <p className="mt-1 text-sm text-[#71817d]">
                      Your workspace is provided and managed directly by <strong className="text-[#14231f]">{data.whiteLabel.productName}</strong>.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
                    <span className="size-1.5 rounded-full bg-emerald-600" />
                    {data.subscription?.status?.replaceAll("_", " ") ?? "Active"}
                  </span>
                </div>

                {minutesLimit > 0 && minutesPercent >= 80 ? (
                  <div className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-xs ${
                    minutesPercent >= 90
                      ? "border-rose-200 bg-rose-50 text-rose-900"
                      : "border-amber-200 bg-amber-50 text-amber-900"
                  }`}>
                    <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      minutesPercent >= 90 ? "bg-rose-200 text-rose-800" : "bg-amber-200 text-amber-800"
                    }`}>
                      !
                    </span>
                    <div className="flex-1">
                      <strong className="block font-bold">
                        {minutesPercent >= 100
                          ? `Monthly voice minutes limit reached (${minutesUsed} / ${minutesLimit} min)`
                          : `Approaching voice minutes limit: ${minutesPercent}% used (${minutesUsed} / ${minutesLimit} min)`}
                      </strong>
                      <p className="mt-1 leading-5">
                        To ensure uninterrupted service for your live voice agents, reach out to your provider
                        {data.whiteLabel.supportEmail ? (
                          <> at <a href={`mailto:${data.whiteLabel.supportEmail}?subject=Voice%20Minutes%20Upgrade%20Request`} className="font-semibold underline hover:opacity-80">{data.whiteLabel.supportEmail}</a></>
                        ) : null}{" "}
                        to add more minutes.
                      </p>
                    </div>
                    {data.whiteLabel.supportEmail ? (
                      <a
                        href={`mailto:${data.whiteLabel.supportEmail}?subject=Voice%20Minutes%20Upgrade%20Request`}
                        className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
                          minutesPercent >= 90
                            ? "bg-rose-700 text-white hover:bg-rose-800"
                            : "bg-amber-700 text-white hover:bg-amber-800"
                        }`}
                      >
                        Request Upgrade
                      </a>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-6 grid gap-4 border-t border-[#dbe4e1] pt-6 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Card 1: Monthly Minutes Quota */}
                  <div className="flex flex-col justify-between rounded-xl border border-[#e1e8e6] bg-[#f8fbfa] p-4">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#647771]">Voice Minutes</span>
                        {minutesLimit > 0 ? (
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            minutesPercent >= 90
                              ? "bg-rose-100 text-rose-700"
                              : minutesPercent >= 75
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {minutesPercent}% used
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-2xl font-bold text-[#14231f]">
                        {minutesUsed.toLocaleString()} <span className="text-xs font-normal text-[#71817d]">{minutesLimit > 0 ? `/ ${minutesLimit.toLocaleString()} min` : "min"}</span>
                      </p>
                    </div>
                    {minutesLimit > 0 ? (
                      <div className="mt-3">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#e3ece9]">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              minutesPercent >= 90
                                ? "bg-gradient-to-r from-rose-500 to-rose-600"
                                : minutesPercent >= 75
                                ? "bg-gradient-to-r from-amber-500 to-amber-600"
                                : "bg-gradient-to-r from-[#118778] to-[#1bb5a2]"
                            }`}
                            style={{ width: `${minutesPercent}%` }}
                          />
                        </div>
                        <div className="mt-1 flex justify-between text-[10px] text-[#71817d]">
                          <span>{minutesUsed} used</span>
                          <span>{Math.max(0, minutesLimit - minutesUsed)} left</span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Card 2: AI Voice Agents Quota */}
                  <div className="flex flex-col justify-between rounded-xl border border-[#e1e8e6] bg-[#f8fbfa] p-4">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#647771]">AI Voice Agents</span>
                        {agentsLimit > 0 ? (
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            agentsPercent >= 90 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {agentsPercent}% quota
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-2xl font-bold text-[#14231f]">
                        {agentsUsed} <span className="text-xs font-normal text-[#71817d]">{agentsLimit > 0 ? `/ ${agentsLimit} allowed` : "active"}</span>
                      </p>
                    </div>
                    {agentsLimit > 0 ? (
                      <div className="mt-3">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#e3ece9]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#118778] to-[#1bb5a2] transition-all duration-500"
                            style={{ width: `${agentsPercent}%` }}
                          />
                        </div>
                        <div className="mt-1 flex justify-between text-[10px] text-[#71817d]">
                          <span>{agentsUsed} deployed</span>
                          <span>{Math.max(0, agentsLimit - agentsUsed)} available</span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Card 3: Calls & Concurrency */}
                  <div className="flex flex-col justify-between rounded-xl border border-[#e1e8e6] bg-[#f8fbfa] p-4">
                    <div>
                      <span className="text-xs font-semibold text-[#647771]">Calls Handled</span>
                      <p className="mt-2 text-2xl font-bold text-[#14231f]">
                        {callsCount.toLocaleString()} <span className="text-xs font-normal text-[#71817d]">calls</span>
                      </p>
                    </div>
                    <div className="mt-3 rounded-lg border border-[#e1ece8] bg-white px-3 py-1.5 text-[11px] text-[#52645f]">
                      Concurrency limit: <strong className="text-[#14231f]">{concurrentLines} line{concurrentLines > 1 ? "s" : ""}</strong>
                    </div>
                  </div>

                  {/* Card 4: Support & Upgrades */}
                  <div className="flex flex-col justify-between rounded-xl border border-[#e1e8e6] bg-[#f8fbfa] p-4">
                    <div>
                      <span className="text-xs font-semibold text-[#647771]">Plan & Upgrades</span>
                      <p className="mt-1 text-[11px] text-[#71817d]">
                        Managed by {data.whiteLabel.productName}. Need more capacity or minutes?
                      </p>
                    </div>
                    <div className="mt-3">
                      {data.whiteLabel.supportEmail ? (
                        <a
                          href={`mailto:${data.whiteLabel.supportEmail}?subject=Plan%20Upgrade%20Inquiry%20-${encodeURIComponent(session?.organization?.name || "Customer")}`}
                          className="inline-flex w-full items-center justify-center rounded-lg bg-[#118778] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0e7467]"
                        >
                          Contact Support
                        </a>
                      ) : (
                        <span className="text-xs font-semibold text-[#14231f]">Contact provider administrator</span>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          })() : (
            <>
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
                  <div><span className="app-label text-[#0e6f62]">Available balance</span><h2 className="mt-2 mb-0 text-4xl font-semibold tracking-tight text-slate-950">{money(toInr(balance))}</h2><p className="app-caption mt-2 mb-0">{money(toInr(lifetime))} lifetime credits purchased</p><p className="app-caption mt-1 mb-0">All balances and usage are shown in Indian rupees.</p></div>
                  <div className="grid gap-3 border-t border-[#dbe4e1] pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                    <span className="app-label">Add credits</span>
                    <div className="grid grid-cols-3 gap-2">
                      {topUpOptions.map((amount) => (
                        <button
                          className={`min-h-10 rounded-lg border text-sm font-semibold transition ${
                            selectedTopUp === amount
                              ? "border-[#118778] bg-[#edf7f4] text-[#0e6f62] shadow-sm font-bold"
                              : "border-[#dbe4e1] bg-white text-[#52645f] hover:border-[#118778]/60"
                          }`}
                          key={amount}
                          type="button"
                          aria-pressed={selectedTopUp === amount}
                          onClick={() => setSelectedTopUp(amount)}
                        >
                          {money(amount)}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <label htmlFor="custom-topup-input" className="block text-[11px] font-semibold text-[#647771] mb-1">
                        Or enter manual amount (₹2,000 – ₹10,00,000)
                      </label>
                      <div className="relative flex items-center">
                        <span className="pointer-events-none absolute left-3 text-sm font-bold text-[#71817d]">₹</span>
                        <input
                          id="custom-topup-input"
                          type="number"
                          min={2000}
                          max={1000000}
                          step={500}
                          value={selectedTopUp || ""}
                          onChange={(e) => setSelectedTopUp(Number(e.target.value))}
                          placeholder="Enter manual top-up amount"
                          className="w-full rounded-lg border border-[#c6d4d0] bg-white py-2 pl-7 pr-3 text-sm font-semibold text-[#14231f] outline-none transition focus:border-[#118778] focus:ring-1 focus:ring-[#118778]"
                        />
                      </div>
                    </div>
                    <button
                      className="min-h-11 rounded-lg bg-[#118778] px-4 text-sm font-semibold text-white transition hover:bg-[#0e6f62] disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                      type="button"
                      onClick={() => void purchaseCredits()}
                      disabled={busy === "topup" || !data?.configured || selectedTopUp < 2000 || selectedTopUp > 1000000}
                    >
                      {busy === "topup"
                        ? "Opening checkout..."
                        : selectedTopUp < 2000
                        ? "Min recharge is ₹2,000"
                        : selectedTopUp > 1000000
                        ? "Max recharge is ₹10,00,000"
                        : `Add ${money(selectedTopUp)} credits`}
                    </button>
                    <p className="app-caption m-0">18% GST is added securely at checkout via Razorpay.</p>
                  </div>
                </div>
                <dl className="grid border-t border-[#dbe4e1] sm:grid-cols-2 lg:grid-cols-4">
                  {[["This month", money(toInr(data?.usage.chargedCredits ?? 0))], ["Provider spend", money(toInr(data?.usage.providerCost ?? 0, "USD"))], ["Minimum to call", money(toInr(data?.creditSettings.minimumCallStartCredits ?? 0, data?.creditSettings.currency ?? walletCurrency))], ["Recent top-ups", `${totals.topUps} (${money(toInr(totals.net))})`]].map(([label, value], index) => <div className={`px-5 py-4 ${index ? "border-t border-[#dbe4e1] sm:border-t-0 sm:border-l" : ""}`} key={label}><dt className="app-caption">{label}</dt><dd className="m-0 mt-1 text-lg font-semibold">{value}</dd></div>)}
                </dl>
              </section>

              <section className="overflow-hidden rounded-xl border border-[#dbe4e1] bg-white">
                <div className="border-b border-[#dbe4e1] px-5 py-4"><h2 className="app-section-title m-0">Billing details</h2></div>
                <div className="grid md:grid-cols-2">
                  {data?.canManageBillingProfile ? <div className="flex flex-col gap-4 border-b border-[#dbe4e1] p-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0"><h3 className="m-0 text-sm font-semibold">Invoice information</h3><p className="app-caption mt-1 mb-0">Billing address and GSTIN used in the billed-to section of your invoices.</p>
                      {data.billingProfile?.address || data.billingProfile?.gstin ? <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2"><div><dt className="text-xs text-[#71817d]">Billing address</dt><dd className="m-0 mt-0.5 whitespace-pre-line font-medium">{data.billingProfile?.address || "Not added"}</dd></div><div><dt className="text-xs text-[#71817d]">GSTIN</dt><dd className="m-0 mt-0.5 font-semibold tracking-[0.06em]">{data.billingProfile?.gstin || "Not added"}</dd></div></dl> : <p className="mt-3 mb-0 text-sm font-medium text-[#71817d]">No billing details added yet.</p>}
                    </div>
                    <button className="shrink-0 rounded-lg border border-[#118778] px-4 py-2.5 text-sm font-semibold text-[#0e6f62] hover:bg-[#edf7f4]" type="button" onClick={() => setShowBillingDetails(true)}>{data.billingProfile?.address || data.billingProfile?.gstin ? "Edit billing details" : "Add billing details"}</button>
                  </div> : null}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3"><h3 className="m-0 text-sm font-semibold">Monthly Autopay</h3><span className="rounded-full bg-[#f6f6f8] px-2.5 py-1 text-xs font-semibold capitalize text-[#52645f]">{data?.subscription.status?.replace("_", " ") ?? "inactive"}</span></div>
                    <dl className="mt-4 grid gap-3 text-sm">
                      <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Plan</dt><dd className="m-0 font-semibold capitalize">{data?.subscription.plan ?? "free"}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Monthly charge</dt><dd className="m-0 font-semibold">{money(data?.enterpriseMonthlyInr ?? toInr(data?.enterpriseMonthlyUsd ?? 500, "USD"))}</dd></div>
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
                      <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Last payment</dt><dd className="m-0 font-semibold">{latestPayment ? money(toInr(latestPayment.amountCredits, latestPayment.currency)) : money(toInr(wallet?.lastPaymentAmountCredits ?? 0))}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Last checked</dt><dd className="m-0 text-right font-semibold">{dateTime(wallet?.lastCheckedAt)}</dd></div>
                    </dl>
                  </div>
                </div>
              </section>
            </>
          )}

          <section className="overflow-hidden rounded-xl border border-[#dbe4e1] bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-[#dbe4e1] px-5 py-4"><div><h2 className="app-section-title m-0">Invoices</h2><p className="app-caption mt-1 mb-0">Wallet top-ups and monthly charges</p></div><span className="app-caption">{data?.invoices.length ?? 0} invoices</span></div>
            {data?.invoices.length ? <div className="divide-y divide-[#dbe4e1]">{data.invoices.map((invoice) => {
              const amount = (invoice.amountPaid ?? invoice.amountDue ?? 0) / 100;
              const isDownloading = busy === `invoice:${invoice._id}`;
              const invoiceCurrency = invoice.currency.toUpperCase();
              const invoiceFallbackTitle = data?.whiteLabel ? `${data.whiteLabel.productName} payment invoice` : "Vozon payment invoice";
              return <div className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center" key={invoice._id}><div className="min-w-0"><strong className="block truncate text-sm">{invoice.invoiceNumber || invoiceFallbackTitle}</strong><span className="app-caption mt-1 block">{invoiceCurrency === "INR" && invoice.description ? invoice.description : dateTime(invoice.createdAt)}</span></div><div className="sm:text-right"><strong className="block text-sm">{money(toInr(amount, invoiceCurrency))}</strong><span className="app-caption mt-1 block capitalize">{invoice.status || "paid"} · {dateTime(invoice.createdAt)}{invoiceCurrency !== "INR" ? " · converted for display" : ""}</span></div><button className="rounded-lg border border-[#b8c8c3] px-3 py-2 text-sm font-semibold text-[#0e6f62] hover:bg-[#edf7f4] disabled:opacity-50" type="button" onClick={() => void downloadInvoice(invoice._id, invoice.invoiceNumber)} disabled={Boolean(busy)}>{isDownloading ? "Downloading..." : "Download"}</button></div>;
            })}</div> : <div className="px-5 py-8 text-center text-sm text-[#71817d]">No invoices yet.</div>}
          </section>
        </div>
      </section>

      {showBillingDetails ? <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-4" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target && busy !== "profile") closeBillingDetails(); }}>
        <section className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#dbe4e1] bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="billing-details-title">
          <div className="flex items-start justify-between gap-4 border-b border-[#dbe4e1] px-5 py-4"><div><h2 className="m-0 text-lg font-semibold" id="billing-details-title">Billing details</h2><p className="app-caption mt-1 mb-0">These details are optional and will appear on your tax invoices.</p></div><button className="grid size-9 shrink-0 place-items-center rounded-lg text-xl text-[#71817d] hover:bg-[#f1f5f4] hover:text-[#14231f]" type="button" aria-label="Close billing details" onClick={closeBillingDetails} disabled={busy === "profile"}>×</button></div>
          <form className="grid gap-4 p-5" onSubmit={saveBillingDetails}>
            <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]" htmlFor="billing-address">Billing address (optional)<textarea className="min-h-28 resize-y rounded-lg border border-[#c6d4d0] bg-white px-3 py-2.5 text-sm font-medium leading-5 text-[#14231f] outline-none placeholder:font-normal focus:border-[#118778]" id="billing-address" name="billingAddress" value={billingAddress} maxLength={500} rows={4} placeholder="Company address, city, state, postal code, country" autoComplete="billing street-address" onChange={(event) => setBillingAddress(event.target.value)} /></label>
            <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]" htmlFor="billing-gstin">GST number (optional)<input className="h-11 rounded-lg border border-[#c6d4d0] bg-white px-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#14231f] outline-none placeholder:font-normal placeholder:tracking-normal focus:border-[#118778]" id="billing-gstin" name="gstin" value={gstin} maxLength={15} pattern="[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z][1-9A-Za-z]Z[0-9A-Za-z]" placeholder="29ABCDE1234F1Z5" autoComplete="off" onChange={(event) => setGstin(event.target.value.toUpperCase().replace(/\s/g, ""))} /></label>
            <div className="mt-1 flex justify-end gap-2"><button className="h-11 rounded-lg border border-[#c6d4d0] px-4 text-sm font-semibold text-[#52645f] hover:bg-[#f7f9f8]" type="button" onClick={closeBillingDetails} disabled={busy === "profile"}>Cancel</button><button className="h-11 rounded-lg bg-[#118778] px-5 text-sm font-semibold text-white hover:bg-[#0e6f62] disabled:opacity-50" type="submit" disabled={Boolean(busy)}>{busy === "profile" ? "Saving..." : "Save details"}</button></div>
          </form>
        </section>
      </div> : null}

      <PaymentSuccessModal
        data={successData}
        money={money}
        onClose={() => setSuccessData(null)}
        onDownloadInvoice={(invoiceId) => void downloadInvoice(invoiceId, "")}
      />
    </main>
  );
}
