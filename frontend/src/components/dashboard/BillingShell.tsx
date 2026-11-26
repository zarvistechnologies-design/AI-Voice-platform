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
    minimumFractionDigits: value !== 0 && Math.abs(value) < 1 ? 4 : 2,
    maximumFractionDigits: value !== 0 && Math.abs(value) < 1 ? 4 : 2,
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
  const [billingCheckedAt, setBillingCheckedAt] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<"" | "topup" | "cancel" | "enterprise" | "whiteLabelCheckout" | "profile" | `invoice:${string}`>("");
  const [selectedTopUp, setSelectedTopUp] = useState(2_000);
  const [gstin, setGstin] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingExtra, setBillingExtra] = useState({ companyName: "", phone: "", country: "", state: "", postalCode: "" });
  const [showBillingDetails, setShowBillingDetails] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(getDashboardSidebarInitialState);
  const [successData, setSuccessData] = useState<PaymentSuccessData | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<"AUTO" | "INR" | "USD">("AUTO");

  const load = useCallback(async (force = false) => {
    try {
      const summary = await billingApi.summary(force);
      setData(summary);
      setBillingCheckedAt(Date.now());
      setGstin(summary.billingProfile?.gstin ?? "");
      setBillingAddress(summary.billingProfile?.address ?? "");
      setBillingExtra({ companyName: summary.billingProfile?.companyName ?? "", phone: summary.billingProfile?.phone ?? "", country: summary.billingProfile?.country ?? "", state: summary.billingProfile?.state ?? "", postalCode: summary.billingProfile?.postalCode ?? "" });
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
  }, [load, router, session]);

  const wallet = data?.wallet;
  const inrPerUsd = data?.inrPerUsd && data.inrPerUsd > 0 ? data.inrPerUsd : 96.5;
  const walletCurrency = wallet?.currency?.toUpperCase() || "USD";
  const activeCurrency = displayCurrency === "AUTO" ? (data?.whiteLabel ? walletCurrency : "INR") : displayCurrency;
  const convertCurrency = useCallback((value: number, sourceCurrency = walletCurrency, targetCurrency = activeCurrency) => {
    const src = sourceCurrency.toUpperCase();
    const dst = targetCurrency.toUpperCase();
    if (src === dst) return value;
    if (src === "USD" && dst === "INR") return value * inrPerUsd;
    if (src === "INR" && dst === "USD") return value / inrPerUsd;
    return value;
  }, [activeCurrency, inrPerUsd, walletCurrency]);
  const toInr = useCallback((value: number, sourceCurrency = walletCurrency) => (
    sourceCurrency.toUpperCase() === "INR" ? value : value * inrPerUsd
  ), [inrPerUsd, walletCurrency]);
  const creditMoney = (value: number, sourceCurrency = walletCurrency) => data?.whiteLabel
    ? money(convertCurrency(value, sourceCurrency, activeCurrency), activeCurrency)
    : money(toInr(value, sourceCurrency), "INR");
  const balance = wallet?.balanceCredits ?? 0;
  const whiteLabelIncludedMinutes = data?.currentPlan?.includedMinutes ?? 0;
  const whiteLabelIncludedCredits = data?.currentPlan?.includedCredits ?? 0;
  const whiteLabelPaymentDue = Boolean(
    data?.whiteLabel && !data.whiteLabel.managedByPartner
    && data.currentInvoice
    && ["open", "past_due"].includes(data.currentInvoice.status)
    && billingCheckedAt !== null
    && new Date(data.currentInvoice.dueAt).getTime() <= billingCheckedAt,
  );
  const lifetime = Math.max(wallet?.lifetimePurchasedCredits ?? 0, balance, 0);
  const latestPayment = data?.transactions.find((item) => item.type === "topup" || item.type === "auto_reload");
  const totals = useMemo(() => {
    const transactions = data?.transactions ?? [];
    return {
      topUps: transactions.filter((item) => item.type === "topup" || item.type === "auto_reload").length,
      net: transactions.filter((item) => item.type === "topup" || item.type === "auto_reload").reduce((sum, item) => sum + toInr(item.amountCredits, item.currency), 0),
    };
  }, [data, toInr]);

  async function purchaseCredits() {
    if (!data?.configured) {
      setNotice("INR checkout is unavailable until Razorpay API keys are configured.");
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
        creditsAdded: verification?.credits !== undefined
          ? toInr(verification.credits)
          : updated?.wallet ? Math.max(0, toInr(updated.wallet.balanceCredits, updated.wallet.currency) - toInr(balance)) : 0,
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

  async function payWhiteLabelInvoice() {
    setBusy("whiteLabelCheckout");
    try {
      const checkout = await billingApi.whiteLabelCheckout();
      let message: string;
      if (checkout.settled) {
        message = "This invoice is already paid. Your balance has been refreshed.";
      } else {
        const payment = await openRazorpayCheckout({ ...checkout, displayMode: "all" });
        await billingApi.verifyWhiteLabelCheckout(payment);
        message = "Payment verified. Your plan credits have been added to the wallet.";
      }
      await load(true);
      setNotice(message);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not complete the subscription payment.");
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
        creditsAdded: updated?.wallet ? Math.max(0, toInr(updated.wallet.balanceCredits, updated.wallet.currency) - toInr(balance)) : 0,
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
      const blob = data?.whiteLabel && !data.whiteLabel.managedByPartner
        ? await billingApi.downloadWhiteLabelInvoice(invoiceId)
        : await billingApi.downloadInvoice(invoiceId);
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
      const result = await billingApi.updateBillingProfile({ gstin, address: billingAddress, ...billingExtra });
      setGstin(result.billingProfile.gstin);
      setBillingAddress(result.billingProfile.address);
      setBillingExtra({ companyName: result.billingProfile.companyName, phone: result.billingProfile.phone, country: result.billingProfile.country, state: result.billingProfile.state, postalCode: result.billingProfile.postalCode });
      setData((current) => current ? { ...current, billingProfile: result.billingProfile } : current);
      setShowBillingDetails(false);
      setNotice("Billing details saved for future invoices.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save the billing details.");
    } finally {
      setBusy("");
    }
  }

  function closeBillingDetails() {
    setGstin(data?.billingProfile?.gstin ?? "");
    setBillingAddress(data?.billingProfile?.address ?? "");
    setBillingExtra({ companyName: data?.billingProfile?.companyName ?? "", phone: data?.billingProfile?.phone ?? "", country: data?.billingProfile?.country ?? "", state: data?.billingProfile?.state ?? "", postalCode: data?.billingProfile?.postalCode ?? "" });
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
            <div className="flex items-center gap-2">
              {data?.whiteLabel ? (
                <div className="inline-flex rounded-md border border-[#eaeaea] bg-white p-0.5 text-[11px] font-medium">
                  {(["INR", "USD"] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setDisplayCurrency(curr)}
                      className={`rounded px-2 py-1 transition ${activeCurrency === curr ? "bg-[#171717] text-white" : "text-[#71717a] hover:text-[#171717]"}`}
                    >
                      {curr === "INR" ? "INR (₹)" : "USD ($)"}
                    </button>
                  ))}
                </div>
              ) : null}
              <button className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12px] font-medium text-[#171717] hover:bg-[#f4f4f5]" type="button" onClick={() => void load(true)} disabled={Boolean(busy)}>Refresh</button>
            </div>
          }
        />

        <div className="grid w-full gap-4 px-4 py-4 sm:px-5 lg:px-6">
          {notice ? <div className="rounded-md border border-[#eaeaea] bg-white px-3 py-2 text-xs font-medium text-[#171717]">{notice}</div> : null}

          {!data ? <div className="rounded-xl border border-[#eaeaea] bg-white p-6 text-sm text-[#71717a]">{notice ? "Billing data is unavailable. Use Refresh to try again." : "Loading your billing details..."}</div> : null}
          {data ? <>
          {data?.whiteLabel ? (
            <section className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white shadow-xs">
              <div className="border-b border-[#eaeaea] px-5 py-4">
                <span className="app-label text-[#71717a]">Plan, credits &amp; deductions</span>
                <p className="mt-1 text-xs text-[#71717a]">{whiteLabelIncludedMinutes > 0 ? "Included minutes are used first; once used, each call deducts from your wallet." : "Every call deducts directly from your granted wallet credits based on usage."} Amounts are shown in {activeCurrency}.</p>
              </div>
              <dl className="grid sm:grid-cols-2 lg:grid-cols-4">
                <div className="border-b border-[#eaeaea] p-4 lg:border-b-0"><dt className="text-xs text-[#71717a]">Plan bought</dt><dd className="mt-1 text-xl font-bold text-[#171717]">{data.currentPlan?.name ?? "Active Plan"}</dd><p className="mt-1 text-[11px] text-[#71717a]">{whiteLabelIncludedMinutes > 0 ? `${(data.periodUsage?.minutesRemaining ?? whiteLabelIncludedMinutes).toLocaleString()} of ${whiteLabelIncludedMinutes.toLocaleString()} included min left` : "Pay-per-call from wallet credits"}</p></div>
                <div className="border-b border-[#eaeaea] p-4 sm:border-l lg:border-b-0"><dt className="text-xs text-[#71717a]">Credits granted</dt><dd className="mt-1 text-xl font-bold text-[#171717]">{creditMoney(lifetime, walletCurrency)}</dd><p className="mt-1 text-[11px] text-[#71717a]">Plan allowance: {creditMoney(whiteLabelIncludedCredits, data.currentPlan?.currency ?? walletCurrency)}</p></div>
                <div className="border-b border-[#eaeaea] p-4 lg:border-l lg:border-b-0"><dt className="text-xs text-[#71717a]">Available wallet balance</dt><dd className="mt-1 text-xl font-bold text-[#171717]">{creditMoney(wallet?.balanceCredits ?? 0, walletCurrency)}</dd><p className="mt-1 text-[11px] text-[#71717a]">Spendable balance remaining</p></div>
                <div className="p-4 sm:border-l"><dt className="text-xs text-[#71717a]">Deducted this month</dt><dd className="mt-1 text-xl font-bold text-[#171717]">{creditMoney(data.usage?.chargedCredits ?? 0, walletCurrency)}</dd><p className="mt-1 text-[11px] text-[#71717a]">{data.usage?.calls ?? 0} calls · {Math.round(data.usage?.minutes ?? 0)} min used</p></div>
              </dl>
              <div className="border-t border-[#eaeaea] bg-[#fafafa] px-5 py-4 text-xs text-[#52525b]">
                <strong className="text-[#171717]">Call pricing: </strong>
                {data.currentPlan?.usagePricing?.mode === "fixed_per_minute"
                  ? `${creditMoney((data.currentPlan.usagePricing.perMinuteAmountMinor ?? 0) / 100, data.currentPlan.currency ?? walletCurrency)} per billable minute${whiteLabelIncludedMinutes > 0 ? " after included minutes" : ""}.`
                  : data.currentPlan?.usagePricing?.mode === "included_only"
                    ? whiteLabelIncludedMinutes > 0 ? "Calls use the included minutes; no overage charge is configured." : "No per-minute charge is configured on this plan."
                    : `Provider usage cost plus ${((data.currentPlan?.usagePricing?.markupBps ?? 0) / 100).toFixed(2)}% markup${whiteLabelIncludedMinutes > 0 ? " after included minutes" : ""}. The final charge varies by the AI models used.`}
                {data.currentPlan?.usagePricing?.minimumCallAmountMinor ? ` Minimum billable call: ${creditMoney(data.currentPlan.usagePricing.minimumCallAmountMinor / 100, data.currentPlan.currency ?? walletCurrency)}.` : ""}
              </div>
            </section>
          ) : null}

          {data?.whiteLabel && data.currentPlan?.models ? (
            <section className="rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xs">
              <h2 className="m-0 text-sm font-semibold text-[#171717]">Models available on your plan</h2>
              <p className="mt-1 text-xs text-[#71717a]">These are the configured models your agents can use. Realtime models appear under Intelligence.</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {([ ["stt", "Speech recognition"], ["llm", "Intelligence"], ["tts", "Voice output"] ] as const).map(([category, title]) => (
                  <div className="rounded-lg border border-[#eaeaea] bg-[#fafafa] p-3" key={category}>
                    <h3 className="m-0 text-xs font-semibold text-[#171717]">{title}</h3>
                    <ul className="mt-2 space-y-1 text-xs text-[#52525b]">
                      {data.currentPlan.models?.[category].length
                        ? data.currentPlan.models[category].map((model) => <li key={model.key}>{model.label}{model.kind === "realtime" ? " · realtime" : ""}</li>)
                        : <li>No models available</li>}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {data?.whiteLabel?.managedByPartner ? (
            <section className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xs">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="app-label text-[#71717a]">Subscription & Plan</span>
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-[#171717]">
                    {data.currentPlan?.name ?? (data.subscription?.plan ? data.subscription.plan.replaceAll("_", " ") : "Active Plan")}
                  </h2>
                  <p className="mt-1 text-xs text-[#71717a]">
                    Your workspace is provided and managed directly by <strong className="text-[#171717]">{data.whiteLabel.productName}</strong>.
                  </p>
                  {data.subscription?.priceSnapshot?.recurringAmountMinor !== undefined ? (
                    <p className="mt-1 text-xs font-medium text-[#52525b]">
                      {creditMoney(data.subscription.priceSnapshot.recurringAmountMinor / 100, data.subscription.priceSnapshot.currency ?? walletCurrency)} / {data.subscription.priceSnapshot.interval ?? "month"}
                      {data.subscription.planVersion ? ` · Version ${data.subscription.planVersion}` : ""}
                      {data.subscription.currentPeriodEnd ? ` · Ends ${dateTime(data.subscription.currentPeriodEnd)}` : ""}
                    </p>
                  ) : null}
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eaeaea] bg-[#fafafa] px-2.5 py-0.5 text-xs font-medium text-[#171717]">
                  <span className="size-1.5 rounded-full bg-[#171717]" />
                  {data.subscription?.status?.replaceAll("_", " ") ?? "Active"}
                </span>
              </div>

              <div className="mt-5 grid gap-3 border-t border-[#eaeaea] pt-5 sm:grid-cols-3">
                <div className="rounded-md border border-[#eaeaea] bg-[#fafafa] p-3.5">
                  <p className="text-[11px] font-medium text-[#71717a]">Calls Handled</p>
                  <p className="mt-0.5 text-lg font-bold text-[#171717]">
                    {data.usage?.calls ?? 0}
                  </p>
                </div>
                <div className="rounded-md border border-[#eaeaea] bg-[#fafafa] p-3.5">
                  <p className="text-[11px] font-medium text-[#71717a]">Minutes Used</p>
                  <p className="mt-0.5 text-lg font-bold text-[#171717]">
                    {Math.round(data.usage?.minutes ?? 0)} min
                  </p>
                </div>
                <div className="rounded-md border border-[#eaeaea] bg-[#fafafa] p-3.5">
                  <p className="text-[11px] font-medium text-[#71717a]">Support & Upgrades</p>
                  {data.whiteLabel.supportEmail ? (
                    <a
                      href={`mailto:${data.whiteLabel.supportEmail}`}
                      className="mt-0.5 block truncate text-xs font-medium text-[#171717] hover:underline"
                    >
                      {data.whiteLabel.supportEmail}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-xs font-medium text-[#171717]">Contact Provider</p>
                  )}
                </div>
              </div>

              {data.currentPlan?.limits ? (
                <div className="mt-5 border-t border-[#eaeaea] pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">Assigned plan limits</p>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      ["Voice agents", `${data.usage?.agents ?? 0} / ${data.currentPlan.limits.agents ?? "∞"}`],
                      ["Team members", `${data.usage?.members ?? 0} / ${data.currentPlan.limits.members ?? "∞"}`],
                      ["Phone numbers", `${data.usage?.phoneNumbers ?? 0} / ${data.currentPlan.limits.phoneNumbers ?? "∞"}`],
                      ["Concurrent calls", String(data.currentPlan.limits.concurrentCalls ?? "—")],
                      ["Monthly minutes cap", data.currentPlan.limits.monthlyMinutes != null ? `${data.currentPlan.limits.monthlyMinutes.toLocaleString()} min` : "Unlimited"],
                      ["Knowledge sources", String(data.currentPlan.limits.knowledgeSources ?? "—")],
                      ["API keys", String(data.currentPlan.limits.apiKeys ?? "—")],
                      ["Billing cycle ends", data.subscription?.currentPeriodEnd ? dateTime(data.subscription.currentPeriodEnd) : "—"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-md border border-[#eaeaea] bg-[#fafafa] px-3.5 py-2.5">
                        <p className="text-[11px] text-[#71717a]">{label}</p>
                        <p className="mt-0.5 text-sm font-semibold text-[#171717]">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {data.subscription?.featuresSnapshot ? (
                <div className="mt-5 border-t border-[#eaeaea] pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">Enabled plan features</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {Object.entries(data.subscription.featuresSnapshot)
                      .filter(([, enabled]) => Boolean(enabled))
                      .map(([feature]) => (
                        <span
                          key={feature}
                          className="rounded-full border border-[#eaeaea] bg-[#fafafa] px-2.5 py-1 text-[11px] font-medium capitalize text-[#171717]"
                        >
                          {feature.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      ))}
                  </div>
                </div>
              ) : null}
            </section>
          ) : (
            <>
              {data?.whiteLabel && !data.whiteLabel.managedByPartner ? (
                <section className="rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xs">
                  <span className="app-label text-[#71717a]">Your subscription plan</span>
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-[#171717]">{data.currentPlan?.name ?? "Active Plan"}</h2>
                  <p className="mt-1 text-xs text-[#71717a]">Plan provided by {data.whiteLabel.productName}.</p>
                  <dl className="mt-4 grid gap-3 border-t border-[#eaeaea] pt-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div><dt className="text-[11px] text-[#71717a]">Plan price</dt><dd className="m-0 mt-1 text-sm font-semibold text-[#171717]">{data.subscription?.priceSnapshot?.recurringAmountMinor !== undefined ? `${money(data.subscription.priceSnapshot.recurringAmountMinor / 100, data.subscription.priceSnapshot.currency)} / ${data.subscription.priceSnapshot.interval ?? "month"}` : "Managed by provider"}</dd></div>
                    <div><dt className="text-[11px] text-[#71717a]">Included minutes</dt><dd className="m-0 mt-1 text-sm font-semibold text-[#171717]">{whiteLabelIncludedMinutes.toLocaleString()} min</dd></div>
                    {whiteLabelIncludedCredits > 0 ? <div><dt className="text-[11px] text-[#71717a]">Wallet credit allowance</dt><dd className="m-0 mt-1 text-sm font-semibold text-[#171717]">{creditMoney(whiteLabelIncludedCredits, data.currentPlan?.currency ?? walletCurrency)}</dd></div> : null}
                    <div><dt className="text-[11px] text-[#71717a]">Monthly minute limit</dt><dd className="m-0 mt-1 text-sm font-semibold text-[#171717]">{data.currentPlan?.limits?.monthlyMinutes?.toLocaleString() ?? "—"} min</dd></div>
                    <div><dt className="text-[11px] text-[#71717a]">Status</dt><dd className="m-0 mt-1 text-sm font-semibold capitalize text-[#171717]">{data.subscription?.status?.replaceAll("_", " ") ?? "Active"}</dd></div>
                  </dl>
                  {whiteLabelPaymentDue ? (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#eaeaea] bg-[#fafafa] p-4">
                      <div><strong className="text-sm text-[#171717]">Payment needed for plan credits</strong><p className="mt-1 text-xs text-[#71717a]">Your allowance is added to the wallet after payment is verified.</p></div>
                      <button className="rounded-md bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50" type="button" onClick={() => void payWhiteLabelInvoice()} disabled={Boolean(busy) || !data.configured}>{busy === "whiteLabelCheckout" ? "Opening payment…" : "Pay subscription"}</button>
                      {!data.configured ? <p className="w-full text-xs text-[#71717a]">Checkout is not configured. Contact your provider.</p> : null}
                    </div>
                  ) : null}
                </section>
              ) : null}
              {!data?.whiteLabel ? <section className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white">
                <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_320px] md:p-5">
                  <div><span className="app-label text-[#71717a]">Available balance</span><h2 className="mt-1 mb-0 text-3xl font-semibold tracking-tight text-[#171717]">{creditMoney(balance)}</h2><p className="app-caption mt-1.5 mb-0 text-xs text-[#71717a]">{creditMoney(lifetime)} lifetime credits purchased</p><p className="app-caption mt-0.5 mb-0 text-xs text-[#a1a1aa]">{data?.whiteLabel ? `Balances and usage are shown in ${walletCurrency}.` : "All balances and usage are shown in Indian rupees."}</p></div>
                  {(!data?.whiteLabel || data.configured) ? <div className="grid gap-2.5 border-t border-[#eaeaea] pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-5">
                    <span className="app-label text-xs font-semibold text-[#71717a]">Add credits</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {topUpOptions.map((amount) => <button className={`h-8 rounded-md border text-xs font-medium transition ${selectedTopUp === amount ? "border-black bg-[#171717] text-white" : "border-[#eaeaea] bg-white text-[#52525b] hover:border-black hover:text-[#171717]"}`} key={amount} type="button" aria-pressed={selectedTopUp === amount} onClick={() => setSelectedTopUp(amount)}>{money(amount)}</button>)}
                    </div>
                    <button className="h-8 rounded-md bg-[#2563eb] px-3 text-xs font-medium text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => void purchaseCredits()} disabled={busy === "topup" || !data?.configured}>{busy === "topup" ? "Opening checkout..." : `Add ${money(selectedTopUp)} credits`}</button>
                    <p className="app-caption m-0 text-[11px] text-[#a1a1aa]">The checkout shows the final amount, including applicable tax.</p>
                  </div> : null}
                </div>
                <dl className="grid border-t border-[#dbe4e1] sm:grid-cols-2 lg:grid-cols-4">
                  {[["This month", money(toInr(data.usage.chargedCredits))], ["Calls handled", data.usage.calls.toLocaleString()], ["Minimum to call", money(toInr(data.creditSettings.minimumCallStartCredits, data.creditSettings.currency ?? walletCurrency))], ["Recent top-ups", `${totals.topUps} (${money(totals.net)})`]].map(([label, value], index) => <div className={`px-5 py-4 ${index ? "border-t border-[#dbe4e1] sm:border-t-0 sm:border-l" : ""}`} key={label}><dt className="app-caption">{label}</dt><dd className="m-0 mt-1 text-lg font-semibold">{value}</dd></div>)}
                </dl>
              </section> : null}

              {!data?.whiteLabel ? <section className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white">
                <div className="border-b border-[#eaeaea] px-5 py-3.5"><h2 className="app-section-title m-0 text-sm font-semibold text-[#171717]">Billing details</h2></div>
                <div className="grid md:grid-cols-2">
                  {data?.canManageBillingProfile ? <div className="flex flex-col gap-4 border-b border-[#eaeaea] p-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0"><h3 className="m-0 text-sm font-semibold text-[#171717]">Invoice information</h3><p className="app-caption mt-0.5 mb-0 text-xs text-[#71717a]">Billing address and GSTIN used in the billed-to section of your invoices.</p>
                      {data.billingProfile?.address || data.billingProfile?.gstin ? <dl className="mt-2.5 grid gap-2 text-xs sm:grid-cols-2"><div><dt className="text-[11px] text-[#71717a]">Billing address</dt><dd className="m-0 mt-0.5 whitespace-pre-line font-medium text-[#171717]">{data.billingProfile?.address || "Not added"}</dd></div><div><dt className="text-[11px] text-[#71717a]">GSTIN</dt><dd className="m-0 mt-0.5 font-semibold tracking-[0.06em] text-[#171717]">{data.billingProfile?.gstin || "Not added"}</dd></div></dl> : <p className="mt-2 mb-0 text-xs text-[#71717a]">No billing details added yet.</p>}
                    </div>
                    <button className="shrink-0 rounded-md border border-[#eaeaea] bg-white px-3 py-1.5 text-xs font-medium text-[#171717] hover:bg-[#f4f4f5]" type="button" onClick={() => setShowBillingDetails(true)}>{data.billingProfile?.address || data.billingProfile?.gstin ? "Edit billing details" : "Add billing details"}</button>
                  </div> : null}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3"><h3 className="m-0 text-sm font-semibold text-[#171717]">Monthly Autopay</h3><span className="rounded-md border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-xs font-medium capitalize text-[#52525b]">{data?.subscription.status?.replace("_", " ") ?? "inactive"}</span></div>
                    <dl className="mt-3.5 grid gap-2.5 text-xs">
                      <div className="flex justify-between gap-4"><dt className="text-[#71717a]">Plan</dt><dd className="m-0 font-medium capitalize text-[#171717]">{data?.subscription.plan ?? "free"}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-[#71717a]">Monthly charge</dt><dd className="m-0 font-medium text-[#171717]">{data?.enterpriseMonthlyInr !== undefined ? money(data.enterpriseMonthlyInr) : "Unavailable"}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-[#71717a]">Next renewal</dt><dd className="m-0 text-right font-medium text-[#171717]">{dateTime(data?.subscription.currentPeriodEnd)}</dd></div>
                    </dl>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {data?.subscription.provider !== "razorpay" || data.subscription.status === "cancelled" ? <button className="h-8 rounded-md bg-[#2563eb] px-3 text-xs font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50" type="button" onClick={() => void upgradeEnterprise()} disabled={busy === "enterprise" || !data?.configured}>Start Autopay</button> : null}
                      {data?.subscription.provider === "razorpay" && !data.subscription.cancelAtPeriodEnd && data.subscription.status !== "cancelled" ? <button className="h-8 rounded-md border border-rose-200 px-3 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50" type="button" onClick={() => void cancelAutopay()} disabled={busy === "cancel"}>{busy === "cancel" ? "Cancelling..." : "Cancel Autopay"}</button> : null}
                    </div>
                    {data?.subscription.cancelAtPeriodEnd ? <p className="mt-2 mb-0 text-xs font-medium text-amber-700">Cancellation is scheduled for the end of this billing cycle.</p> : null}
                  </div>
                  <div className="border-t border-[#eaeaea] p-5 md:border-t-0 md:border-l">
                    <div className="flex items-center justify-between gap-3"><div><h3 className="m-0 text-sm font-semibold text-[#171717]">Payment method</h3><p className="app-caption mt-0.5 mb-0 text-xs text-[#71717a]">{session.email}</p></div><span className={`rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${wallet?.lastPaymentStatus === "success" ? "border-[#eaeaea] bg-[#fafafa] text-[#171717]" : "border-[#eaeaea] bg-[#f4f4f5] text-[#71717a]"}`}>{wallet?.lastPaymentStatus ?? "none"}</span></div>
                    <dl className="mt-3.5 grid gap-2.5 text-xs">
                      <div className="flex justify-between gap-4"><dt className="text-[#71717a]">Provider</dt><dd className="m-0 font-medium text-[#171717]">{wallet?.paymentProvider === "razorpay" ? "Razorpay" : "Not linked"}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-[#71717a]">Last payment</dt><dd className="m-0 font-medium text-[#171717]">{latestPayment ? money(toInr(latestPayment.amountCredits, latestPayment.currency)) : wallet?.lastPaymentAt ? money(toInr(wallet.lastPaymentAmountCredits)) : "No payments yet"}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-[#71717a]">Last checked</dt><dd className="m-0 text-right font-medium text-[#171717]">{dateTime(wallet?.lastCheckedAt)}</dd></div>
                    </dl>
                  </div>
                </div>
              </section> : null}
            </>
          )}

          <section className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-[#eaeaea] px-5 py-3.5"><div><h2 className="app-section-title m-0 text-sm font-semibold text-[#171717]">Credit &amp; usage history</h2><p className="app-caption mt-0.5 mb-0 text-xs text-[#71717a]">Grants, payments, call deductions, and refunds in {data?.whiteLabel ? walletCurrency : "INR"}</p></div><span className="app-caption text-xs text-[#71717a]">Latest {data?.transactions.length ?? 0} entries</span></div>
            {data?.transactions.length ? <div className="divide-y divide-[#eaeaea]">{data.transactions.map((tx) => {
              const isCredit = tx.amountCredits >= 0;
              return <div className="flex items-center justify-between gap-4 px-5 py-3 text-xs" key={tx._id}><div className="min-w-0"><strong className="block truncate font-semibold text-[#171717]">{tx.description || tx.type}</strong><span className="mt-0.5 block text-[11px] text-[#71717a]">{dateTime(tx.createdAt)}{tx.callId ? ` · Call ${tx.callId.slice(-8)}` : ""}</span></div><div className="shrink-0 text-right"><strong className={`block font-semibold ${isCredit ? "text-emerald-700" : "text-[#171717]"}`}>{isCredit ? "+" : ""}{creditMoney(tx.amountCredits, tx.currency || walletCurrency)}</strong><span className="mt-0.5 block text-[11px] text-[#71717a]">Balance: {creditMoney(tx.balanceAfterCredits, tx.currency || walletCurrency)}</span></div></div>;
            })}</div> : <div className="px-5 py-8 text-center text-xs text-[#71717a]">No credit transactions yet.</div>}
          </section>

          <section className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-[#eaeaea] px-5 py-3.5"><div><h2 className="app-section-title m-0 text-sm font-semibold text-[#171717]">Invoices</h2><p className="app-caption mt-0.5 mb-0 text-xs text-[#71717a]">Wallet top-ups and monthly charges</p></div><span className="app-caption text-xs text-[#71717a]">{data?.invoices.length ?? 0} invoices</span></div>
            {data?.invoices.length ? <div className="divide-y divide-[#eaeaea]">{data.invoices.map((invoice) => {
              const amount = ((invoice.amountPaid && invoice.amountPaid > 0 ? invoice.amountPaid : undefined) ?? invoice.amountDue ?? invoice.totalMinor ?? 0) / 100;
              const isDownloading = busy === `invoice:${invoice._id}`;
              const invoiceCurrency = invoice.currency.toUpperCase();
              const invoiceFallbackTitle = data?.whiteLabel ? `${data.whiteLabel.productName} payment invoice` : "Vozon payment invoice";
              return <div className="grid gap-3 px-5 py-3.5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center" key={invoice._id}><div className="min-w-0"><strong className="block truncate text-xs font-semibold text-[#171717]">{invoice.invoiceNumber || invoiceFallbackTitle}</strong><span className="app-caption mt-0.5 block text-[11px] text-[#71717a]">{invoiceCurrency === "INR" && invoice.description ? invoice.description : dateTime(invoice.createdAt)}</span></div><div className="sm:text-right"><strong className="block text-xs font-semibold text-[#171717]">{creditMoney(amount, invoiceCurrency)}</strong><span className="app-caption mt-0.5 block capitalize text-[11px] text-[#71717a]">{invoice.status || "Status unavailable"} · {dateTime(invoice.createdAt)}{!data?.whiteLabel && invoiceCurrency !== "INR" ? " · converted for display" : ""}</span></div><button className="h-7 rounded-md border border-[#eaeaea] bg-white px-2.5 text-xs font-medium text-[#171717] hover:bg-[#f4f4f5] disabled:opacity-50" type="button" onClick={() => void downloadInvoice(invoice._id, invoice.invoiceNumber)} disabled={Boolean(busy)}>{isDownloading ? "Downloading..." : "Download"}</button></div>;
            })}</div> : <div className="px-5 py-8 text-center text-xs text-[#71717a]">No invoices yet.</div>}
          </section>
          </> : null}
        </div>
      </section>

      {showBillingDetails ? <div className="fixed inset-0 z-[80] grid place-items-center bg-black/40 p-4" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target && busy !== "profile") closeBillingDetails(); }}>
        <section className="w-full max-w-xl overflow-hidden rounded-xl border border-[#eaeaea] bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="billing-details-title">
          <div className="flex items-start justify-between gap-4 border-b border-[#eaeaea] px-5 py-4"><div><h2 className="m-0 text-base font-semibold text-[#171717]" id="billing-details-title">Billing details</h2><p className="app-caption mt-0.5 mb-0 text-xs text-[#71717a]">These details are optional and will appear on your tax invoices.</p></div><button className="grid size-7 shrink-0 place-items-center rounded-md text-lg text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#171717]" type="button" aria-label="Close billing details" onClick={closeBillingDetails} disabled={busy === "profile"}>×</button></div>
          <form className="grid gap-3.5 p-5" onSubmit={saveBillingDetails}>
            {([["companyName", "Company name"], ["phone", "Business phone"], ["country", "Country"], ["state", "State / Province"], ["postalCode", "Postal code"]] as const).map(([key, label]) => <label className="grid gap-1 text-xs font-semibold text-[#52525b]" key={key}>{label}<input className="h-8 rounded-md border border-[#eaeaea] bg-white px-2.5 text-xs text-[#171717] outline-none focus:border-black" maxLength={key === "companyName" ? 100 : key === "phone" ? 30 : 100} onChange={(event) => setBillingExtra((current) => ({ ...current, [key]: event.target.value }))} value={billingExtra[key]} /></label>)}
            <label className="grid gap-1 text-xs font-semibold text-[#52525b]" htmlFor="billing-address">Billing address (optional)<textarea className="min-h-20 resize-y rounded-md border border-[#eaeaea] bg-white px-2.5 py-2 text-xs font-medium text-[#171717] outline-none placeholder:font-normal focus:border-black" id="billing-address" name="billingAddress" value={billingAddress} maxLength={500} rows={3} placeholder="Street address and city" autoComplete="billing street-address" onChange={(event) => setBillingAddress(event.target.value)} /></label>
            <label className="grid gap-1 text-xs font-semibold text-[#52525b]" htmlFor="billing-gstin">GST number (optional)<input className="h-8 rounded-md border border-[#eaeaea] bg-white px-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#171717] outline-none placeholder:font-normal placeholder:tracking-normal focus:border-black" id="billing-gstin" name="gstin" value={gstin} maxLength={15} pattern="[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z][1-9A-Za-z]Z[0-9A-Za-z]" placeholder="29ABCDE1234F1Z5" autoComplete="off" onChange={(event) => setGstin(event.target.value.toUpperCase().replace(/\s/g, ""))} /></label>
            <div className="mt-1 flex justify-end gap-2"><button className="h-8 rounded-md border border-[#eaeaea] px-3 text-xs font-medium text-[#52525b] hover:bg-[#f4f4f5]" type="button" onClick={closeBillingDetails} disabled={busy === "profile"}>Cancel</button><button className="h-8 rounded-md bg-[#171717] px-4 text-xs font-medium text-white hover:bg-black disabled:opacity-50" type="submit" disabled={Boolean(busy)}>{busy === "profile" ? "Saving..." : "Save details"}</button></div>
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
