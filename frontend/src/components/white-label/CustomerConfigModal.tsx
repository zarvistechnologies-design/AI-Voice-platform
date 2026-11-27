"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { ModelAccessPicker } from "@/components/white-label/ModelAccessPicker";
import {
  documentId,
  partnerWhiteLabelApi,
  type CustomerBillingMode,
  type PartnerCustomerBilling,
  type PartnerOverview,
  type WhiteLabelCustomer,
  type WhiteLabelModelAccess,
  type WhiteLabelPaymentGateway,
  type WhiteLabelPlan,
} from "@/lib/whiteLabel";

type Props = {
  open: boolean;
  mode: "add" | "edit";
  overview: PartnerOverview;
  gateway: WhiteLabelPaymentGateway | null;
  customerRow: WhiteLabelCustomer | null;
  customerDetails: PartnerCustomerBilling | null;
  loadingDetails: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: "brand" | "domains" | "plans") => void;
  onSuccess: (
    message: string,
    extra?: { activationUrl?: string; emailDeliveryStatus?: string; existingAccount?: boolean; organizationName?: string },
  ) => Promise<void>;
  onError: (message: string) => void;
};

const fieldClass = "wl-field min-h-9 w-full rounded-lg border border-[#d8e2df] bg-white px-3 text-sm text-[#20342e] shadow-sm outline-none transition placeholder:text-[#9aa7a3] focus:border-[#168a78] focus:ring-4 focus:ring-[#168a78]/10 disabled:bg-[#f1f4f3] disabled:text-[#8b9894]";
const labelClass = "wl-label grid gap-1.5 text-xs font-semibold text-[#52645f]";
const primaryBtn = "wl-primary inline-flex min-h-8 items-center justify-center rounded-lg bg-[#126f62] px-3.5 text-xs font-bold !text-white shadow-xs transition hover:bg-[#0d5c52] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap";
const secondaryBtn = "wl-secondary inline-flex min-h-8 items-center justify-center rounded-lg border border-[#d8e2df] bg-white px-3 text-xs font-semibold text-[#40564f] shadow-xs transition hover:border-[#b8cbc5] hover:bg-[#f7faf9] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap";

function money(minor: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(minor / 100);
}

function toDatetimeLocalValue(iso?: string) {
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  const offsetMs = parsed.getTimezoneOffset() * 60_000;
  return new Date(parsed.getTime() - offsetMs).toISOString().slice(0, 16);
}

function defaultAccountModels(overview: PartnerOverview): WhiteLabelModelAccess {
  return overview.account.modelAccess ?? {
    stt: overview.modelAccessCatalog.stt.map((item) => item.key),
    llm: overview.modelAccessCatalog.llm.map((item) => item.key),
    tts: overview.modelAccessCatalog.tts.map((item) => item.key),
  };
}

function defaultAccountBillingMode(overview: PartnerOverview, gateway: WhiteLabelPaymentGateway | null): "manual" | "recharge" | "retail" {
  if (overview.account.retailBilling?.enabled) return "retail";
  const hasPacks = (overview.account.rechargePackages ?? []).some((pkg) => pkg.active);
  if ((gateway?.gatewayMode === "custom" || overview.account.retailBilling?.gatewayMode === "custom") && hasPacks) {
    return "recharge";
  }
  return "manual";
}

function snapshotFormFromPlan(plan: WhiteLabelPlan | undefined, overview: PartnerOverview) {
  const models = plan?.modelAccess ?? defaultAccountModels(overview);
  return {
    currency: (plan?.price.currency ?? "INR") as "INR" | "USD",
    billingType: (plan?.price.billingType ?? "subscription") as "subscription" | "permanent",
    interval: (plan?.price.interval ?? "month") as "month" | "year",
    recurringPrice: String((plan?.price.recurringAmountMinor ?? 0) / 100),
    setupFee: String((plan?.price.setupFeeMinor ?? 0) / 100),
    trialDays: String(plan?.price.trialDays ?? 0),
    taxBehavior: plan?.price.taxBehavior ?? "exclusive",
    usageMode: (plan?.usagePricing.mode ?? "cost_markup") as "cost_markup" | "fixed_per_minute" | "included_only",
    markupPercent: String((plan?.usagePricing.markupBps ?? 0) / 100),
    perMinutePrice: String((plan?.usagePricing.perMinuteAmountMinor ?? 0) / 100),
    minimumCall: String((plan?.usagePricing.minimumCallAmountMinor ?? 0) / 100),
    overageEnabled: plan?.usagePricing.overageEnabled ?? true,
    includedCredits: String(plan?.allowances.includedCredits ?? 0),
    includedMinutes: String(plan?.allowances.includedMinutes ?? 0),
    agents: String(Math.min(plan?.limits.agents ?? 10, overview.account.limits.agentsPerCustomer)),
    members: String(Math.min(plan?.limits.members ?? 10, overview.account.limits.membersPerCustomer)),
    phoneNumbers: String(Math.min(plan?.limits.phoneNumbers ?? 5, overview.account.limits.phoneNumbersPerCustomer)),
    concurrentCalls: String(Math.min(plan?.limits.concurrentCalls ?? 5, overview.account.limits.concurrentCallsPerCustomer)),
    monthlyMinutes: String(Math.min(plan?.limits.monthlyMinutes ?? 1000, overview.account.limits.monthlyMinutesPerCustomer)),
    knowledgeSources: String(plan?.limits.knowledgeSources ?? 50),
    apiKeys: String(plan?.limits.apiKeys ?? 5),
    features: {
      campaigns: plan?.features?.campaigns ?? true,
      inboundCalling: plan?.features?.inboundCalling ?? true,
      outboundCalling: plan?.features?.outboundCalling ?? true,
      callRecording: plan?.features?.callRecording ?? false,
      knowledgeBase: plan?.features?.knowledgeBase ?? true,
      integrations: plan?.features?.integrations ?? true,
      teamAccess: plan?.features?.teamAccess ?? true,
      advancedAnalytics: Boolean(plan?.features?.advancedAnalytics) && overview.account.entitlements.advancedAnalytics,
      developerApi: Boolean(plan?.features?.developerApi) && overview.account.entitlements.developerApi,
    } as Record<string, boolean>,
    modelAccess: models,
  };
}

function buildInitialFormState(
  mode: "add" | "edit",
  overview: PartnerOverview,
  publishedBrands: PartnerOverview["brands"],
  publishedPlans: WhiteLabelPlan[],
  customerRow: WhiteLabelCustomer | null,
  customerDetails: PartnerCustomerBilling | null,
) {
  if (mode === "add") {
    const firstBrand = publishedBrands[0];
    const firstPlan = publishedPlans[0];
    return {
      organizationName: "",
      ownerName: "",
      ownerEmail: "",
      externalCustomerId: "",
      brandId: firstBrand ? documentId(firstBrand) : "",
      planId: firstPlan ? documentId(firstPlan) : "",
      billingMode: "inherit" as CustomerBillingMode,
      lifecycleStatus: "active" as "active" | "suspended",
      subscriptionStatus: "active",
      currentPeriodEnd: "",
      initialCredits: firstPlan ? String(firstPlan.allowances.includedCredits) : "0",
      config: snapshotFormFromPlan(firstPlan, overview),
    };
  }

  if (customerDetails) {
    const s = customerDetails.subscription;
    return {
      organizationName: customerDetails.customer.name,
      ownerName: customerRow?.ownerUserId?.name ?? "",
      ownerEmail: customerRow?.ownerUserId?.email ?? "",
      externalCustomerId: customerDetails.customer.externalCustomerId ?? customerRow?.externalCustomerId ?? "",
      brandId: customerDetails.customer.brandId ?? "",
      planId: s.planId ?? customerRow?.subscription?.planId ?? "",
      billingMode: (s.billingMode ?? customerRow?.subscription?.billingMode ?? "inherit") as CustomerBillingMode,
      lifecycleStatus: (customerDetails.customer.lifecycleStatus === "suspended" ? "suspended" : "active") as "active" | "suspended",
      subscriptionStatus: s.status || "active",
      currentPeriodEnd: toDatetimeLocalValue(s.currentPeriodEnd),
      initialCredits: "",
      config: {
        currency: (s.price?.currency ?? customerDetails.wallet.currency ?? "INR") as "INR" | "USD",
        billingType: (s.price?.billingType ?? "subscription") as "subscription" | "permanent",
        interval: (s.price?.interval ?? "month") as "month" | "year",
        recurringPrice: String((s.price?.recurringAmountMinor ?? 0) / 100),
        setupFee: String((s.price?.setupFeeMinor ?? 0) / 100),
        trialDays: String(s.price?.trialDays ?? 0),
        taxBehavior: s.price?.taxBehavior ?? "exclusive",
        usageMode: (s.usagePricing?.mode ?? "cost_markup") as "cost_markup" | "fixed_per_minute" | "included_only",
        markupPercent: String((s.usagePricing?.markupBps ?? 0) / 100),
        perMinutePrice: String((s.usagePricing?.perMinuteAmountMinor ?? 0) / 100),
        minimumCall: String((s.usagePricing?.minimumCallAmountMinor ?? 0) / 100),
        overageEnabled: s.usagePricing?.overageEnabled ?? true,
        includedCredits: String(s.allowances?.includedCredits ?? 0),
        includedMinutes: String(s.allowances?.includedMinutes ?? 0),
        agents: String(s.limits?.agents ?? 10),
        members: String(s.limits?.members ?? 10),
        phoneNumbers: String(s.limits?.phoneNumbers ?? 5),
        concurrentCalls: String(s.limits?.concurrentCalls ?? 5),
        monthlyMinutes: String(s.limits?.monthlyMinutes ?? 1000),
        knowledgeSources: String(s.limits?.knowledgeSources ?? 50),
        apiKeys: String(s.limits?.apiKeys ?? 5),
        features: {
          campaigns: s.features?.campaigns ?? true,
          inboundCalling: s.features?.inboundCalling ?? true,
          outboundCalling: s.features?.outboundCalling ?? true,
          callRecording: s.features?.callRecording ?? false,
          knowledgeBase: s.features?.knowledgeBase ?? true,
          integrations: s.features?.integrations ?? true,
          teamAccess: s.features?.teamAccess ?? true,
          advancedAnalytics: Boolean(s.features?.advancedAnalytics) && overview.account.entitlements.advancedAnalytics,
          developerApi: Boolean(s.features?.developerApi) && overview.account.entitlements.developerApi,
        } as Record<string, boolean>,
        modelAccess: s.modelAccess ?? defaultAccountModels(overview),
      },
    };
  }

  const rowPlan = publishedPlans.find((item) => documentId(item) === customerRow?.subscription?.planId);
  return {
    organizationName: customerRow?.name ?? "",
    ownerName: customerRow?.ownerUserId?.name ?? "",
    ownerEmail: customerRow?.ownerUserId?.email ?? "",
    externalCustomerId: customerRow?.externalCustomerId ?? "",
    brandId: "",
    planId: customerRow?.subscription?.planId ?? "",
    billingMode: (customerRow?.subscription?.billingMode ?? "inherit") as CustomerBillingMode,
    lifecycleStatus: (customerRow?.lifecycleStatus === "suspended" ? "suspended" : "active") as "active" | "suspended",
    subscriptionStatus: customerRow?.subscription?.status ?? "active",
    currentPeriodEnd: toDatetimeLocalValue(customerRow?.subscription?.currentPeriodEnd),
    initialCredits: "",
    config: snapshotFormFromPlan(rowPlan, overview),
  };
}

function CustomerConfigForm({
  mode,
  overview,
  gateway,
  customerRow,
  customerDetails,
  submitting,
  setSubmitting,
  onClose,
  onNavigateTab,
  onSuccess,
  onError,
}: Omit<Props, "open" | "loadingDetails"> & {
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
}) {
  const publishedPlans = useMemo(() => overview.plans.filter((p) => p.status === "published"), [overview.plans]);
  const publishedBrands = useMemo(() => overview.brands.filter((b) => b.status === "published"), [overview.brands]);
  const fallbackMode = useMemo(() => defaultAccountBillingMode(overview, gateway), [overview, gateway]);
  const activePacksCount = useMemo(
    () => (overview.account.rechargePackages ?? []).filter((pkg) => pkg.active).length,
    [overview.account.rechargePackages],
  );
  const razorpayReady = gateway?.gatewayMode === "custom" && gateway.hasCustomKeySecret;

  const initial = useMemo(
    () => buildInitialFormState(mode, overview, publishedBrands, publishedPlans, customerRow, customerDetails),
    [mode, overview, publishedBrands, publishedPlans, customerRow, customerDetails],
  );

  const [localError, setLocalError] = useState("");
  const [organizationName, setOrganizationName] = useState(initial.organizationName);
  const [ownerName, setOwnerName] = useState(initial.ownerName);
  const [ownerEmail, setOwnerEmail] = useState(initial.ownerEmail);
  const [externalCustomerId, setExternalCustomerId] = useState(initial.externalCustomerId);
  const [brandId, setBrandId] = useState(initial.brandId);
  const [planId, setPlanId] = useState(initial.planId);
  const [billingMode, setBillingMode] = useState<CustomerBillingMode>(initial.billingMode);
  const [lifecycleStatus, setLifecycleStatus] = useState<"active" | "suspended">(initial.lifecycleStatus);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>(initial.subscriptionStatus);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState(initial.currentPeriodEnd);
  const [initialCredits, setInitialCredits] = useState(initial.initialCredits);
  const [walletMode, setWalletMode] = useState<"none" | "set" | "add">("none");
  const [walletAmount, setWalletAmount] = useState("");
  const [migrateCurrencyConfirmed, setMigrateCurrencyConfirmed] = useState(false);
  const [reason, setReason] = useState("");
  const [config, setConfig] = useState(initial.config);

  function handlePlanSelection(nextPlanId: string) {
    setPlanId(nextPlanId);
    const chosen = publishedPlans.find((item) => documentId(item) === nextPlanId);
    if (!chosen) return;
    setConfig(snapshotFormFromPlan(chosen, overview));
    if (mode === "add") {
      setInitialCredits(String(chosen.allowances.includedCredits));
    }
  }

  const effectiveBillingMode = billingMode === "inherit" ? fallbackMode : billingMode;
  const activeBrandDomain = useMemo(
    () => overview.domains.some((item) => item.brandId === brandId && item.kind === "app" && item.status === "active"),
    [overview.domains, brandId],
  );
  const addPrerequisites = mode === "add"
    ? [
        ...(overview.account.status !== "active"
          ? [{ label: `Partner account must be active (currently ${overview.account.status}).`, tab: undefined }]
          : []),
        ...(!publishedBrands.length
          ? [{ label: "Publish a brand in the Branding tab before adding clients.", tab: "brand" as const }]
          : []),
        ...(publishedBrands.length && !activeBrandDomain
          ? [{ label: "Verify and activate an app domain for the selected brand in Domains.", tab: "domains" as const }]
          : []),
        ...(!publishedPlans.length
          ? [{ label: "Create and publish at least one pricing plan in Pricing plans.", tab: "plans" as const }]
          : []),
      ]
    : [];
  const currentWalletCurrency = String(
    customerDetails?.wallet.currency ?? customerRow?.wallet?.currency ?? customerRow?.subscription?.priceSnapshot?.currency ?? config.currency,
  ).toUpperCase();
  const nextPlanCurrency = config.currency.toUpperCase();
  const currencyWillChange = mode === "edit" && currentWalletCurrency !== nextPlanCurrency;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLocalError("");
    if (addPrerequisites.length > 0) {
      setLocalError(addPrerequisites[0].label);
      return;
    }
    if (effectiveBillingMode === "retail" && overview.account.retailBilling?.transferMode === "full_amount" && nextPlanCurrency !== "INR") {
      setLocalError("Razorpay Route full-amount settlement supports INR customer plans only. Choose an INR plan or switch billing mode.");
      return;
    }
    if (currencyWillChange && !migrateCurrencyConfirmed) {
      setLocalError(`Confirm converting the customer's wallet currency from ${currentWalletCurrency} to ${nextPlanCurrency} before saving.`);
      return;
    }

    const customPricingPayload = overview.account.entitlements.customCustomerPricing
      ? {
          price: {
            currency: config.currency,
            billingType: config.billingType,
            recurringAmountMinor: Math.round(Number(config.recurringPrice || 0) * 100),
            interval: config.interval,
            setupFeeMinor: Math.round(Number(config.setupFee || 0) * 100),
            trialDays: config.billingType === "permanent" ? 0 : Math.max(0, Math.round(Number(config.trialDays || 0))),
            taxBehavior: config.taxBehavior,
          },
          usagePricing: {
            mode: config.usageMode,
            markupBps: Math.round(Number(config.markupPercent || 0) * 100),
            perMinuteAmountMinor: Math.round(Number(config.perMinutePrice || 0) * 100),
            minimumCallAmountMinor: Math.round(Number(config.minimumCall || 0) * 100),
            overageEnabled: config.overageEnabled,
          },
          allowances: {
            includedCredits: Number(config.includedCredits || 0),
            includedMinutes: Math.round(Number(config.includedMinutes || 0)),
          },
        }
      : {};

    const snapshotPayload = {
      ...customPricingPayload,
      limits: {
        agents: Number(config.agents || 0),
        members: Math.max(1, Number(config.members || 1)),
        phoneNumbers: Number(config.phoneNumbers || 0),
        concurrentCalls: Number(config.concurrentCalls || 0),
        monthlyMinutes: Number(config.monthlyMinutes || 0),
        knowledgeSources: Number(config.knowledgeSources || 0),
        apiKeys: Number(config.apiKeys || 0),
      },
      features: config.features,
      modelAccess: config.modelAccess,
    };

    setSubmitting(true);
    try {
      if (mode === "add") {
        const result = await partnerWhiteLabelApi.provisionCustomer({
          organizationName: organizationName.trim(),
          ownerName: ownerName.trim(),
          ownerEmail: ownerEmail.trim(),
          externalCustomerId: externalCustomerId.trim(),
          brandId,
          planId,
          billingMode,
          initialCredits: initialCredits === "" ? undefined : Number(initialCredits),
          ...snapshotPayload,
        });
        if (result.activationUrl) {
          await navigator.clipboard.writeText(result.activationUrl).catch(() => undefined);
        }
        await onSuccess(
          `Client "${organizationName.trim()}" added (${effectiveBillingMode} billing). Changes are live for their workspace immediately.`,
          {
            activationUrl: result.activationUrl,
            emailDeliveryStatus: result.emailDeliveryStatus,
            existingAccount: result.existingAccount,
            organizationName: organizationName.trim(),
          },
        );
      } else if (customerRow) {
        const orgId = documentId(customerRow);
        const walletAdjustment = walletMode !== "none" && walletAmount !== ""
          ? { mode: walletMode, amountCredits: Number(walletAmount), reason: reason.trim() || undefined }
          : undefined;
        await partnerWhiteLabelApi.updateCustomerConfig(orgId, {
          organizationName: organizationName.trim(),
          externalCustomerId: externalCustomerId.trim(),
          lifecycleStatus,
          billingMode,
          planId: planId || undefined,
          migrateWalletCurrency: currencyWillChange ? migrateCurrencyConfirmed : false,
          subscriptionStatus,
          currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd).toISOString() : undefined,
          walletAdjustment,
          reason: reason.trim() || undefined,
          ...snapshotPayload,
        });
        await onSuccess(`Saved configuration for "${organizationName.trim()}". End-client dashboard & limits update immediately.`);
      }
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to save client configuration.";
      setLocalError(msg);
      onError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const featureItems = [
    ["campaigns", "Campaigns"],
    ["inboundCalling", "Inbound calling"],
    ["outboundCalling", "Outbound calling"],
    ["callRecording", "Call recording"],
    ["knowledgeBase", "Knowledge base"],
    ["integrations", "Integrations"],
    ["teamAccess", "Team access"],
    ["advancedAnalytics", "Advanced analytics"],
    ["developerApi", "Developer API"],
  ] as const;

  return (
    <form className="grid gap-5 p-6" onSubmit={(event) => void handleSubmit(event)}>
      {addPrerequisites.length > 0 ? (
        <div className="grid gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950" role="alert">
          <strong className="text-sm">Complete setup before provisioning this client</strong>
          <ul className="m-0 grid list-disc gap-1.5 pl-4">
            {addPrerequisites.map((item) => (
              <li className="flex flex-wrap items-center justify-between gap-2" key={item.label}>
                <span>{item.label}</span>
                {item.tab && onNavigateTab ? (
                  <button
                    className="rounded-md border border-amber-400 bg-white px-2.5 py-1 text-[11px] font-semibold text-amber-950 hover:bg-amber-100"
                    onClick={() => {
                      onClose();
                      onNavigateTab(item.tab!);
                    }}
                    type="button"
                  >
                    Open {item.tab === "brand" ? "Branding" : item.tab === "domains" ? "Domains" : "Pricing plans"}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {localError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800" role="alert">
          {localError}
        </div>
      ) : null}

      <section className="grid gap-4 rounded-xl border border-[#dce5e2] bg-[#f9fbfa] p-4">
        <h2 className="text-sm font-bold text-[#1d342e]">1. Identity &amp; Workspace Status</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className={labelClass}>
            <span>Organization name</span>
            <input autoFocus className={fieldClass} required value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} />
          </label>
          <label className={labelClass}>
            <span>Owner name</span>
            <input className={fieldClass} disabled={mode === "edit"} required={mode === "add"} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
          </label>
          <label className={labelClass}>
            <span>Owner email</span>
            <input className={fieldClass} disabled={mode === "edit"} required={mode === "add"} type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} />
          </label>
          <label className={labelClass}>
            <span>External customer ID</span>
            <input className={fieldClass} placeholder="Optional CRM ID" value={externalCustomerId} onChange={(e) => setExternalCustomerId(e.target.value)} />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mode === "add" ? (
            <label className={labelClass}>
              <span>Published brand</span>
              <select className={fieldClass} required value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                {publishedBrands.map((b) => (
                  <option key={documentId(b)} value={documentId(b)}>{b.branding.productName}</option>
                ))}
              </select>
            </label>
          ) : (
            <>
              <label className={labelClass}>
                <span>Workspace status</span>
                <select className={fieldClass} disabled={customerRow?.lifecycleStatus === "archived"} value={lifecycleStatus} onChange={(e) => setLifecycleStatus(e.target.value as "active" | "suspended")}>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </label>
              <label className={labelClass}>
                <span>Subscription status</span>
                <select className={fieldClass} value={subscriptionStatus} onChange={(e) => setSubscriptionStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="trialing">Trialing</option>
                  <option value="past_due">Past due</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              <label className={labelClass}>
                <span>Current period ends</span>
                <input className={fieldClass} type="datetime-local" value={currentPeriodEnd} onChange={(e) => setCurrentPeriodEnd(e.target.value)} />
              </label>
            </>
          )}
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-[#dce5e2] bg-[#f9fbfa] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-[#1d342e]">2. Assign Billing Mode &amp; Plan</h2>
          <span className="rounded-full bg-[#e6f4f1] px-2.5 py-1 text-[11px] font-bold uppercase text-[#11695c]">
            Client sees: {effectiveBillingMode === "manual" ? "Manual credits only (no Razorpay box)" : effectiveBillingMode === "recharge" ? "Plan + Partner Razorpay recharge packs" : "Full Razorpay checkout + recharge packs"}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            <span>Billing assignment for this client</span>
            <select className={fieldClass} value={billingMode} onChange={(e) => setBillingMode(e.target.value as CustomerBillingMode)}>
              <option value="manual">Manual / Offline credits (Partner assigns plan &amp; credits manually)</option>
              <option value="recharge">Plan + Client Razorpay Self-Serve Recharge (Uses your Razorpay &amp; packs)</option>
              <option value="retail">Full Razorpay Retail Checkout (Invoices + Razorpay recharge)</option>
              <option value="inherit">Auto / Inherit account default (currently {fallbackMode})</option>
            </select>
          </label>
          <label className={labelClass}>
            <span>Assigned plan</span>
            <select className={fieldClass} required={mode === "add"} value={planId} onChange={(e) => handlePlanSelection(e.target.value)}>
              {publishedPlans.map((p) => (
                <option key={documentId(p)} value={documentId(p)}>
                  {p.name} v{p.version} · {money(p.price.billingType === "permanent" ? p.price.setupFeeMinor : p.price.recurringAmountMinor, p.price.currency)} / {p.price.billingType === "permanent" ? "one-time" : p.price.interval}
                </option>
              ))}
            </select>
          </label>
        </div>
        {effectiveBillingMode === "recharge" && (!razorpayReady || activePacksCount === 0) ? (
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-950">
            <strong>Heads up:</strong> This client is assigned self-serve Razorpay recharge, and right now you have{" "}
            {razorpayReady ? "your Razorpay gateway connected" : "no custom Razorpay keys saved"} and{" "}
            <strong>{activePacksCount} active recharge pack{activePacksCount === 1 ? "" : "s"}</strong> in the Billing tab. Configure both in <strong>Billing</strong> so the client can complete online payments.
          </div>
        ) : null}
        {currencyWillChange ? (
          <label className="flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">
            <input checked={migrateCurrencyConfirmed} className="mt-0.5 size-4 accent-[#168a78]" onChange={(e) => setMigrateCurrencyConfirmed(e.target.checked)} type="checkbox" />
            <span>
              Convert this client&apos;s wallet currency from <strong>{currentWalletCurrency}</strong> to <strong>{nextPlanCurrency}</strong> at the platform exchange rate and disable auto-reload.
            </span>
          </label>
        ) : null}
      </section>

      <section className="grid gap-4 rounded-xl border border-[#dce5e2] bg-[#f9fbfa] p-4">
        <h2 className="text-sm font-bold text-[#1d342e]">
          3. {mode === "add" ? "Starting Wallet Credits & Pricing" : "Wallet Credits, Usage Pricing & Allowances"}
        </h2>
        {mode === "add" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <label className={labelClass}>
              <span>Starting wallet credits ({config.currency})</span>
              <input className={fieldClass} min="0" placeholder={config.includedCredits} step="0.01" type="number" value={initialCredits} onChange={(e) => setInitialCredits(e.target.value)} />
            </label>
            <label className={labelClass}>
              <span>Plan included credits ({config.currency})</span>
              <input className={fieldClass} disabled={!overview.account.entitlements.customCustomerPricing} min="0" step="0.01" type="number" value={config.includedCredits} onChange={(e) => setConfig((c) => ({ ...c, includedCredits: e.target.value }))} />
            </label>
            <label className={labelClass}>
              <span>Included minutes</span>
              <input className={fieldClass} disabled={!overview.account.entitlements.customCustomerPricing} min="0" type="number" value={config.includedMinutes} onChange={(e) => setConfig((c) => ({ ...c, includedMinutes: e.target.value }))} />
            </label>
          </div>
        ) : (
          <div className="grid gap-4 rounded-lg border border-[#e3ebe9] bg-white p-3.5 sm:grid-cols-4 sm:items-end">
            <div>
              <span className="block text-[11px] text-[#71817d]">Current wallet</span>
              <strong className="mt-0.5 block text-base text-[#1d342e]">
                {money(Number(customerDetails?.wallet.balanceCredits ?? customerRow?.wallet?.balanceCredits ?? 0) * 100, currentWalletCurrency)}
              </strong>
            </div>
            <label className={labelClass}>
              <span>Wallet action</span>
              <select className={fieldClass} value={walletMode} onChange={(e) => setWalletMode(e.target.value as "none" | "set" | "add")}>
                <option value="none">No wallet adjustment</option>
                <option value="set">Set exact wallet balance</option>
                <option value="add">Add credits to wallet</option>
              </select>
            </label>
            <label className={labelClass}>
              <span>Credit amount ({currencyWillChange ? nextPlanCurrency : currentWalletCurrency})</span>
              <input className={fieldClass} disabled={walletMode === "none"} min={walletMode === "set" ? "0" : "0.01"} placeholder="e.g. 2000" step="0.01" type="number" value={walletAmount} onChange={(e) => setWalletAmount(e.target.value)} />
              {currencyWillChange && walletMode !== "none" ? (
                <span className="text-[10px] font-medium text-amber-800">Applied in {nextPlanCurrency} after currency conversion</span>
              ) : null}
            </label>
            <label className={labelClass}>
              <span>Plan included credits ({config.currency})</span>
              <input className={fieldClass} disabled={!overview.account.entitlements.customCustomerPricing} min="0" step="0.01" type="number" value={config.includedCredits} onChange={(e) => setConfig((c) => ({ ...c, includedCredits: e.target.value }))} />
            </label>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className={labelClass}>
            <span>Plan currency</span>
            <select className={fieldClass} disabled={!overview.account.entitlements.customCustomerPricing} value={config.currency} onChange={(e) => setConfig((c) => ({ ...c, currency: e.target.value as "INR" | "USD" }))}>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <label className={labelClass}>
            <span>Billing cycle</span>
            <select
              className={fieldClass}
              disabled={!overview.account.entitlements.customCustomerPricing}
              value={config.billingType === "permanent" ? "permanent" : config.interval}
              onChange={(e) => {
                const val = e.target.value;
                setConfig((c) => val === "permanent" ? { ...c, billingType: "permanent" } : { ...c, billingType: "subscription", interval: val as "month" | "year" });
              }}
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
              <option value="permanent">One-time / Permanent</option>
            </select>
          </label>
          <label className={labelClass}>
            <span>{config.billingType === "permanent" ? "One-time price" : config.interval === "year" ? "Yearly price" : "Monthly price"} ({config.currency})</span>
            <input className={fieldClass} disabled={!overview.account.entitlements.customCustomerPricing} min="0" step="0.01" type="number" value={config.billingType === "permanent" ? config.setupFee : config.recurringPrice} onChange={(e) => setConfig((c) => c.billingType === "permanent" ? { ...c, setupFee: e.target.value } : { ...c, recurringPrice: e.target.value })} />
          </label>
          <label className={labelClass}>
            <span>Included minutes</span>
            <input className={fieldClass} disabled={!overview.account.entitlements.customCustomerPricing} min="0" type="number" value={config.includedMinutes} onChange={(e) => setConfig((c) => ({ ...c, includedMinutes: e.target.value }))} />
          </label>
          <label className={labelClass}>
            <span>Usage charging</span>
            <select className={fieldClass} disabled={!overview.account.entitlements.customCustomerPricing} value={config.usageMode} onChange={(e) => setConfig((c) => ({ ...c, usageMode: e.target.value as "cost_markup" | "fixed_per_minute" | "included_only" }))}>
              <option value="cost_markup">Provider cost + markup</option>
              <option value="fixed_per_minute">Fixed per minute</option>
              <option value="included_only">Included minutes only</option>
            </select>
          </label>
          <label className={labelClass}>
            <span>{config.usageMode === "fixed_per_minute" ? `Price per minute (${config.currency})` : "Usage markup %"}</span>
            <input
              className={fieldClass}
              disabled={!overview.account.entitlements.customCustomerPricing || config.usageMode === "included_only"}
              min="0"
              step="0.01"
              type="number"
              value={config.usageMode === "fixed_per_minute" ? config.perMinutePrice : config.markupPercent}
              onChange={(e) => setConfig((c) => c.usageMode === "fixed_per_minute" ? { ...c, perMinutePrice: e.target.value } : { ...c, markupPercent: e.target.value })}
            />
          </label>
          <label className={labelClass}>
            <span>Min charge per call ({config.currency})</span>
            <input className={fieldClass} disabled={!overview.account.entitlements.customCustomerPricing} min="0" step="0.01" type="number" value={config.minimumCall} onChange={(e) => setConfig((c) => ({ ...c, minimumCall: e.target.value }))} />
          </label>
          <label className="flex items-center gap-2 self-end rounded-lg border border-[#d8e2df] bg-white px-3 py-2.5 text-xs font-semibold text-[#344b45]">
            <input checked={config.overageEnabled} className="size-4 accent-[#168a78]" disabled={!overview.account.entitlements.customCustomerPricing} onChange={(e) => setConfig((c) => ({ ...c, overageEnabled: e.target.checked }))} type="checkbox" />
            <span>Allow wallet overage after included minutes</span>
          </label>
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-[#dce5e2] bg-[#f9fbfa] p-4">
        <h2 className="text-sm font-bold text-[#1d342e]">4. Quotas, Features &amp; Allowed AI Models</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className={labelClass}>
            <span>Agent limit (max {overview.account.limits.agentsPerCustomer})</span>
            <input className={fieldClass} max={overview.account.limits.agentsPerCustomer} min="0" type="number" value={config.agents} onChange={(e) => setConfig((c) => ({ ...c, agents: e.target.value }))} />
          </label>
          <label className={labelClass}>
            <span>Member limit (max {overview.account.limits.membersPerCustomer})</span>
            <input className={fieldClass} max={overview.account.limits.membersPerCustomer} min="1" type="number" value={config.members} onChange={(e) => setConfig((c) => ({ ...c, members: e.target.value }))} />
          </label>
          <label className={labelClass}>
            <span>Phone numbers (max {overview.account.limits.phoneNumbersPerCustomer})</span>
            <input className={fieldClass} max={overview.account.limits.phoneNumbersPerCustomer} min="0" type="number" value={config.phoneNumbers} onChange={(e) => setConfig((c) => ({ ...c, phoneNumbers: e.target.value }))} />
          </label>
          <label className={labelClass}>
            <span>Concurrent calls (max {overview.account.limits.concurrentCallsPerCustomer})</span>
            <input className={fieldClass} max={overview.account.limits.concurrentCallsPerCustomer} min="0" type="number" value={config.concurrentCalls} onChange={(e) => setConfig((c) => ({ ...c, concurrentCalls: e.target.value }))} />
          </label>
          <label className={labelClass}>
            <span>Monthly minutes (max {overview.account.limits.monthlyMinutesPerCustomer})</span>
            <input className={fieldClass} max={overview.account.limits.monthlyMinutesPerCustomer} min="0" type="number" value={config.monthlyMinutes} onChange={(e) => setConfig((c) => ({ ...c, monthlyMinutes: e.target.value }))} />
          </label>
          <label className={labelClass}>
            <span>Knowledge sources</span>
            <input className={fieldClass} min="0" type="number" value={config.knowledgeSources} onChange={(e) => setConfig((c) => ({ ...c, knowledgeSources: e.target.value }))} />
          </label>
          <label className={labelClass}>
            <span>API keys</span>
            <input className={fieldClass} min="0" type="number" value={config.apiKeys} onChange={(e) => setConfig((c) => ({ ...c, apiKeys: e.target.value }))} />
          </label>
        </div>

        <fieldset className="rounded-lg border border-[#e3ebe9] bg-white p-3.5">
          <legend className="px-1 text-xs font-bold text-[#1d342e]">Workspace features (immediately enforced for client)</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {featureItems.map(([key, label]) => {
              const blocked = (key === "developerApi" && !overview.account.entitlements.developerApi)
                || (key === "advancedAnalytics" && !overview.account.entitlements.advancedAnalytics);
              const checked = Boolean(config.features[key]) && !blocked;
              return (
                <label
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${blocked ? "cursor-not-allowed border-[#e6ecea] bg-[#f1f4f3] text-[#8b9894]" : checked ? "cursor-pointer border-[#b9ddd4] bg-[#eff8f5] text-[#215e51]" : "cursor-pointer border-[#e0e7e5] bg-white text-[#647771]"}`}
                  key={key}
                >
                  <input
                    checked={checked}
                    className="size-4 accent-[#168a78]"
                    disabled={submitting || blocked}
                    onChange={(e) => setConfig((c) => ({ ...c, features: { ...c.features, [key]: e.target.checked } }))}
                    type="checkbox"
                  />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <ModelAccessPicker
          catalog={overview.modelAccessCatalog}
          disabled={submitting}
          onChange={(modelAccess) => setConfig((c) => ({ ...c, modelAccess }))}
          value={config.modelAccess}
        />
      </section>

      {mode === "edit" ? (
        <label className={labelClass}>
          <span>Audit note (optional)</span>
          <input className={fieldClass} placeholder="Reason for configuration update" value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
      ) : null}

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-3 border-t border-[#e7edeb] bg-white pt-4">
        <button className={secondaryBtn} disabled={submitting} onClick={onClose} type="button">
          Cancel
        </button>
        <button className={primaryBtn} disabled={submitting} type="submit">
          {submitting ? "Saving…" : mode === "add" ? "Add client & sync workspace" : "Save changes & sync client"}
        </button>
      </div>
    </form>
  );
}

export function CustomerConfigModal({
  open,
  mode,
  overview,
  gateway,
  customerRow,
  customerDetails,
  loadingDetails,
  onClose,
  onNavigateTab,
  onSuccess,
  onError,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync open prop with top-layer native <dialog> element
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  const formKey = mode === "add"
    ? `add-${open ? "open" : "closed"}`
    : `edit-${customerRow ? documentId(customerRow) : "none"}-${customerDetails ? `hydrated-${customerDetails.subscription?.planVersion ?? 0}-${customerDetails.subscription?.billingMode ?? "inherit"}-${customerDetails.wallet.balanceCredits}-${customerDetails.wallet.currency}` : "row"}-${open ? "open" : "closed"}`;

  return (
    <dialog
      aria-labelledby="customer-config-dialog-title"
      className="m-auto w-[min(96vw,920px)] max-h-[90vh] overflow-y-auto rounded-2xl border border-[#d8e2df] bg-white p-0 text-left shadow-2xl"
      onCancel={(event) => {
        event.preventDefault();
        if (!submitting) onClose();
      }}
      ref={dialogRef}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#e7edeb] bg-white px-6 py-4">
        <div>
          <span className="inline-flex rounded-full bg-[#eef7f5] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#118778]">
            {mode === "add" ? "New client tenant" : "Live client configuration"}
          </span>
          <h1 className="mt-1 text-lg font-bold text-[#1d342e]" id="customer-config-dialog-title">
            {mode === "add" ? "Add client & assign billing" : `Edit ${customerRow?.name || "client"}`}
          </h1>
        </div>
        <button className={secondaryBtn} disabled={submitting} onClick={onClose} type="button">
          Close
        </button>
      </div>

      {open ? (
        mode === "edit" && loadingDetails && !customerDetails ? (
          <div className="p-8 text-sm text-[#52645f]">Loading complete client configuration…</div>
        ) : (
          <CustomerConfigForm
            customerDetails={customerDetails}
            customerRow={customerRow}
            gateway={gateway}
            key={formKey}
            mode={mode}
            onClose={onClose}
            onError={onError}
            onNavigateTab={onNavigateTab}
            onSuccess={onSuccess}
            overview={overview}
            setSubmitting={setSubmitting}
            submitting={submitting}
          />
        )
      ) : null}
    </dialog>
  );
}
