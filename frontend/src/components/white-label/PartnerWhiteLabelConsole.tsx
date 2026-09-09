"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ModelAccessPicker } from "@/components/white-label/ModelAccessPicker";
import { getServerSession, getSession, logoutSession, subscribeToSession, validateStoredSession } from "@/lib/auth";
import { openRazorpayCheckout, type RazorpayCheckoutPayload } from "@/lib/razorpayCheckout";
import {
  documentId,
  partnerWhiteLabelApi,
  type PartnerBilling,
  type PartnerOverview,
  type PartnerEconomics,
  type WhiteLabelBrand,
  type WhiteLabelCustomer,
  type WhiteLabelModelAccess,
  type WhiteLabelPlan,
} from "@/lib/whiteLabel";

type Tab = "launch" | "brand" | "domains" | "plans" | "customers" | "billing" | "contract";
type Notice = { tone: "success" | "error" | "info"; message: string } | null;

const fieldClass = "min-h-11 w-full rounded-lg border border-[#d8e2df] bg-white px-3 text-sm text-[#20342e] shadow-sm outline-none transition placeholder:text-[#9aa7a3] focus:border-[#168a78] focus:ring-4 focus:ring-[#168a78]/10 disabled:bg-[#f1f4f3] disabled:text-[#8b9894]";
const labelClass = "grid gap-2 text-xs font-semibold text-[#52645f]";
const buttonClass = "inline-flex min-h-10 items-center justify-center rounded-lg bg-[#126f62] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#0d5c52] disabled:cursor-not-allowed disabled:opacity-45";
const secondaryButtonClass = "inline-flex min-h-10 items-center justify-center rounded-lg border border-[#d8e2df] bg-white px-4 text-sm font-semibold text-[#40564f] shadow-sm transition hover:border-[#b8cbc5] hover:bg-[#f7faf9] disabled:cursor-not-allowed disabled:opacity-45";

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function money(minor: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(minor / 100);
}

function date(value?: string) {
  return value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
}

function Status({ value }: { value: string }) {
  const positive = value === "active" || value === "published" || value === "trialing";
  const negative = value === "failed" || value === "suspended" || value === "terminated" || value === "past_due";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ring-1 ${positive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : negative ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-amber-50 text-amber-700 ring-amber-200"}`}>{value.replaceAll("_", " ")}</span>;
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`rounded-xl border border-[#dde6e3] bg-white shadow-[0_8px_24px_rgba(28,55,47,0.06)] ${className}`}>{children}</article>;
}

function SectionTitle({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col gap-3 border-b border-[#e7edeb] p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold text-[#1d342e]">{title}</h2><p className="mt-1 text-sm leading-6 text-[#71817d]">{description}</p></div>{action}</div>;
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className={labelClass}><span>{label}</span><input {...props} className={fieldClass} /></label>;
}

function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  return <label className={labelClass}><span>{label}</span><select {...props} className={fieldClass}>{children}</select></label>;
}

function BrandEditor({ brand, busy, onSaved }: { brand: WhiteLabelBrand; busy: boolean; onSaved(message: string): Promise<void> }) {
  const [uploading, setUploading] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [form, setForm] = useState(() => ({
    productName: brand.branding.productName,
    companyName: brand.branding.companyName,
    logoUrl: brand.branding.logoUrl,
    logoDarkUrl: brand.branding.logoDarkUrl,
    iconUrl: brand.branding.iconUrl,
    primaryColor: brand.branding.primaryColor,
    secondaryColor: brand.branding.secondaryColor,
    accentColor: brand.branding.accentColor,
    surfaceColor: brand.branding.surfaceColor,
    supportEmail: brand.support.email,
    websiteUrl: brand.support.websiteUrl,
    helpCenterUrl: brand.support.helpCenterUrl,
    termsUrl: brand.legal.termsUrl,
    privacyUrl: brand.legal.privacyUrl,
    legalBusinessName: brand.legal.legalBusinessName,
    emailFromName: brand.email.fromName,
    emailFromAddress: brand.email.fromAddress,
    replyTo: brand.email.replyTo,
  }));

  function set(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    await partnerWhiteLabelApi.updateBrand(documentId(brand), {
      branding: {
        productName: form.productName,
        companyName: form.companyName,
        logoUrl: form.logoUrl,
        logoDarkUrl: form.logoDarkUrl,
        iconUrl: form.iconUrl,
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        accentColor: form.accentColor,
        surfaceColor: form.surfaceColor,
        defaultTheme: brand.branding.defaultTheme,
        poweredByText: brand.branding.poweredByText,
      },
      support: { ...brand.support, email: form.supportEmail, websiteUrl: form.websiteUrl, helpCenterUrl: form.helpCenterUrl },
      legal: { ...brand.legal, termsUrl: form.termsUrl, privacyUrl: form.privacyUrl, legalBusinessName: form.legalBusinessName },
      email: { ...brand.email, fromName: form.emailFromName, fromAddress: form.emailFromAddress, replyTo: form.replyTo },
    });
    await onSaved("Brand settings saved.");
  }

  async function publish() {
    await partnerWhiteLabelApi.publishBrand(documentId(brand));
    await onSaved("Brand published. Published settings are now eligible for active custom domains.");
  }

  async function verifyEmailDomain() {
    await partnerWhiteLabelApi.verifyEmailDomain(documentId(brand));
    await onSaved("Branded email sending domain verified.");
  }

  async function uploadAsset(role: "logo" | "logoDark" | "icon", file?: File) {
    if (!file) return;
    setUploading(role);
    setUploadError("");
    try {
      const result = await partnerWhiteLabelApi.uploadBrandAsset(documentId(brand), role, file);
      set(role === "logo" ? "logoUrl" : role === "logoDark" ? "logoDarkUrl" : "iconUrl", result.assetUrl);
      await onSaved("Brand asset uploaded to managed storage and applied.");
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Brand asset upload failed.");
    } finally {
      setUploading("");
    }
  }

  return <form className="grid gap-5 p-5" onSubmit={save}>
    {uploadError ? <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">{uploadError}</div> : null}
    <div className="grid gap-4 md:grid-cols-2"><Input label="Product name" required value={form.productName} onChange={(event) => set("productName", event.target.value)} /><Input label="Legal/company display name" required value={form.companyName} onChange={(event) => set("companyName", event.target.value)} /></div>
    <div className="grid gap-4 md:grid-cols-3">{([['logo', 'Logo URL (HTTPS)', 'logoUrl'], ['logoDark', 'Dark logo URL (HTTPS)', 'logoDarkUrl'], ['icon', 'Square icon URL (HTTPS)', 'iconUrl']] as const).map(([role, label, key]) => <div className="grid gap-2" key={role}><Input label={label} required={role !== "logoDark"} type="url" value={form[key]} onChange={(event) => set(key, event.target.value)} /><label className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-[#d8e2df] bg-[#f8faf9] px-3 text-xs font-semibold text-[#40564f] transition hover:border-[#b8cbc5] hover:bg-[#f1f6f4]"><input accept="image/avif,image/gif,image/jpeg,image/png,image/webp,image/x-icon" className="sr-only" disabled={busy || Boolean(uploading)} type="file" onChange={(event) => void uploadAsset(role, event.target.files?.[0])} />{uploading === role ? "Uploading…" : "Upload managed image"}</label></div>)}</div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{(["primaryColor", "secondaryColor", "accentColor", "surfaceColor"] as const).map((key) => <label className={labelClass} key={key}><span>{key.replace("Color", " color")}</span><span className="flex gap-2"><input aria-label={`${key} picker`} className="h-11 w-12 rounded-lg border border-[#d8e2df] bg-white p-1" type="color" value={form[key].slice(0, 7)} onChange={(event) => set(key, event.target.value)} /><input className={fieldClass} pattern="#[0-9a-fA-F]{6}" value={form[key]} onChange={(event) => set(key, event.target.value)} /></span></label>)}</div>
    <div className="grid gap-4 md:grid-cols-3"><Input label="Support email" required type="email" value={form.supportEmail} onChange={(event) => set("supportEmail", event.target.value)} /><Input label="Website URL" type="url" value={form.websiteUrl} onChange={(event) => set("websiteUrl", event.target.value)} /><Input label="Help center URL" type="url" value={form.helpCenterUrl} onChange={(event) => set("helpCenterUrl", event.target.value)} /></div>
    <div className="grid gap-4 md:grid-cols-3"><Input label="Terms URL" required type="url" value={form.termsUrl} onChange={(event) => set("termsUrl", event.target.value)} /><Input label="Privacy URL" required type="url" value={form.privacyUrl} onChange={(event) => set("privacyUrl", event.target.value)} /><Input label="Legal business name" required value={form.legalBusinessName} onChange={(event) => set("legalBusinessName", event.target.value)} /></div>
    <div className="grid gap-4 md:grid-cols-3"><Input label="Email sender name" value={form.emailFromName} onChange={(event) => set("emailFromName", event.target.value)} /><Input label="Verified sender address" type="email" value={form.emailFromAddress} onChange={(event) => set("emailFromAddress", event.target.value)} /><Input label="Email reply-to" type="email" value={form.replyTo} onChange={(event) => set("replyTo", event.target.value)} /></div>
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7edeb] pt-5"><span className="text-xs text-[#71817d]">Sending domain: <strong className="capitalize text-[#344b45]">{brand.email.sendingDomainStatus.replaceAll("_", " ")}</strong></span><div className="flex flex-wrap justify-end gap-3"><button className={secondaryButtonClass} disabled={busy || !form.emailFromAddress || form.emailFromAddress !== brand.email.fromAddress || brand.email.sendingDomainStatus === "verified"} onClick={() => void verifyEmailDomain()} type="button">{form.emailFromAddress !== brand.email.fromAddress ? "Save before verification" : brand.email.sendingDomainStatus === "verified" ? "Email domain verified" : "Verify email domain"}</button><button className={secondaryButtonClass} disabled={busy || brand.status === "published"} onClick={() => void publish()} type="button">{brand.status === "published" ? "Published" : "Publish brand"}</button><button className={buttonClass} disabled={busy} type="submit">Save brand</button></div></div>
  </form>;
}

export function PartnerWhiteLabelConsole() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [overview, setOverview] = useState<PartnerOverview | null>(null);
  const [customers, setCustomers] = useState<WhiteLabelCustomer[]>([]);
  const [economics, setEconomics] = useState<PartnerEconomics | null>(null);
  const [billing, setBilling] = useState<PartnerBilling | null>(null);
  const [tab, setTab] = useState<Tab>("launch");
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [domain, setDomain] = useState("");
  const [domainBrandId, setDomainBrandId] = useState("");
  const [domainKind, setDomainKind] = useState<"app" | "api" | "link">("app");
  const [plan, setPlan] = useState({ name: "Growth", key: "growth", currency: "USD", monthlyPrice: "99", setupFee: "0", trialDays: "7", usageMode: "cost_markup", markupPercent: "40", perMinute: "0", includedMinutes: "100", includedCredits: "0", agents: "10", members: "10", phoneNumbers: "5", concurrentCalls: "5", monthlyMinutes: "1000", modelAccess: { stt: [], llm: [], tts: [] } as WhiteLabelModelAccess });
  const [editingPlanId, setEditingPlanId] = useState("");
  const planModelsInitialized = useRef(false);
  const [customer, setCustomer] = useState({ organizationName: "", ownerName: "", ownerEmail: "", externalCustomerId: "", brandId: "", planId: "" });

  const load = useCallback(async () => {
    try {
      const [nextOverview, customerResult, economicsResult, billingResult] = await Promise.all([partnerWhiteLabelApi.overview(), partnerWhiteLabelApi.customers(), partnerWhiteLabelApi.economics(), partnerWhiteLabelApi.billing()]);
      setOverview(nextOverview);
      setCustomers(customerResult.customers);
      setEconomics(economicsResult);
      setBilling(billingResult);
      if (!planModelsInitialized.current) {
        planModelsInitialized.current = true;
        setPlan((value) => ({ ...value, modelAccess: {
          stt: nextOverview.modelAccessCatalog.stt.map((item) => item.key),
          llm: nextOverview.modelAccessCatalog.llm.map((item) => item.key),
          tts: nextOverview.modelAccessCatalog.tts.map((item) => item.key),
        } }));
      }
      setDomainBrandId((value) => value || (nextOverview.brands[0] ? documentId(nextOverview.brands[0]) : ""));
      setCustomer((value) => ({ ...value, brandId: value.brandId || (nextOverview.brands[0] ? documentId(nextOverview.brands[0]) : ""), planId: value.planId || (nextOverview.plans.find((item) => item.status === "published") ? documentId(nextOverview.plans.find((item) => item.status === "published")!) : "") }));
    } catch (error) {
      setNotice({ tone: "error", message: error instanceof Error ? error.message : "Could not load white-label operations." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) { router.replace("/login?next=/dashboard/white-label"); return; }
    void validateStoredSession({ force: true });
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load, router, session]);

  const defaultBrand = overview?.brands.find((item) => item.isDefault) ?? overview?.brands[0];
  const publishedPlans = useMemo(() => overview?.plans.filter((item) => item.status === "published") ?? [], [overview]);
  const activeDomains = overview?.domains.filter((item) => item.status === "active").length ?? 0;
  const readiness = [
    { label: "Brand published", ready: defaultBrand?.status === "published", tab: "brand" as Tab },
    { label: "Custom domain active", ready: activeDomains > 0, tab: "domains" as Tab },
    { label: "Customer plan published", ready: publishedPlans.length > 0, tab: "plans" as Tab },
    { label: "Platform contract active", ready: overview?.account.status === "active" && ["active", "trialing"].includes(overview.account.billingStatus), tab: "contract" as Tab },
  ];

  async function perform(action: () => Promise<unknown>, success: string) {
    setBusy(true); setNotice(null);
    try { await action(); await load(); setNotice({ tone: "success", message: success }); }
    catch (error) { setNotice({ tone: "error", message: error instanceof Error ? error.message : "The operation failed." }); }
    finally { setBusy(false); }
  }

  async function addDomain(event: FormEvent) {
    event.preventDefault();
    await perform(() => partnerWhiteLabelApi.addDomain({ brandId: domainBrandId, hostname: domain, kind: domainKind }), "Domain reserved. Add every displayed DNS record, then run verification.");
    setDomain("");
  }

  async function savePlan(event: FormEvent) {
    event.preventDefault();
    const editingPlan = overview?.plans.find((item) => documentId(item) === editingPlanId);
    let saved = false;
    const body = {
      key: plan.key, name: plan.name, description: `${plan.name} customer plan`, isPublic: true,
      price: { currency: plan.currency, recurringAmountMinor: Math.round(Number(plan.monthlyPrice) * 100), interval: "month", setupFeeMinor: Math.round(Number(plan.setupFee) * 100), trialDays: Number(plan.trialDays), taxBehavior: "exclusive" },
      usagePricing: { mode: plan.usageMode, markupBps: Math.round(Number(plan.markupPercent) * 100), perMinuteAmountMinor: Math.round(Number(plan.perMinute) * 100), minimumCallAmountMinor: 0, overageEnabled: plan.usageMode !== "included_only" },
      allowances: { includedCredits: Number(plan.includedCredits), includedMinutes: Number(plan.includedMinutes) },
      limits: { agents: Number(plan.agents), members: Number(plan.members), phoneNumbers: Number(plan.phoneNumbers), concurrentCalls: Number(plan.concurrentCalls), monthlyMinutes: Number(plan.monthlyMinutes), knowledgeSources: editingPlan?.limits.knowledgeSources ?? 50, apiKeys: editingPlan?.limits.apiKeys ?? 5 },
      features: editingPlan?.features ?? { campaigns: true, inboundCalling: true, outboundCalling: true, callRecording: true, knowledgeBase: true, integrations: true, developerApi: false, advancedAnalytics: true, teamAccess: true },
      modelAccess: plan.modelAccess,
    };
    await perform(async () => {
      if (editingPlanId) await partnerWhiteLabelApi.updatePlan(editingPlanId, body);
      else await partnerWhiteLabelApi.createPlan(body);
      saved = true;
    }, editingPlanId ? "Draft plan and model access updated." : "Draft plan created. Review the economics before publishing; published versions are immutable.");
    if (saved) setEditingPlanId("");
  }

  function editPlan(item: WhiteLabelPlan) {
    const inheritedModels = overview?.account.modelAccess ?? {
      stt: overview?.modelAccessCatalog.stt.map((model) => model.key) ?? [],
      llm: overview?.modelAccessCatalog.llm.map((model) => model.key) ?? [],
      tts: overview?.modelAccessCatalog.tts.map((model) => model.key) ?? [],
    };
    setPlan({
      name: item.name,
      key: item.key,
      currency: item.price.currency,
      monthlyPrice: String(item.price.recurringAmountMinor / 100),
      setupFee: String(item.price.setupFeeMinor / 100),
      trialDays: String(item.price.trialDays),
      usageMode: item.usagePricing.mode,
      markupPercent: String(item.usagePricing.markupBps / 100),
      perMinute: String(item.usagePricing.perMinuteAmountMinor / 100),
      includedMinutes: String(item.allowances.includedMinutes),
      includedCredits: String(item.allowances.includedCredits),
      agents: String(item.limits.agents),
      members: String(item.limits.members),
      phoneNumbers: String(item.limits.phoneNumbers),
      concurrentCalls: String(item.limits.concurrentCalls),
      monthlyMinutes: String(item.limits.monthlyMinutes),
      modelAccess: item.modelAccess ?? inheritedModels,
    });
    setEditingPlanId(documentId(item));
  }

  async function provision(event: FormEvent) {
    event.preventDefault();
    await perform(async () => {
      const result = await partnerWhiteLabelApi.provisionCustomer(customer);
      if (result.activationUrl) await navigator.clipboard.writeText(result.activationUrl).catch(() => undefined);
    }, "Customer workspace provisioned and activation delivery started. A preview activation URL was copied when email preview mode was active.");
    setCustomer((value) => ({ ...value, organizationName: "", ownerName: "", ownerEmail: "", externalCustomerId: "" }));
  }

  async function payPartnerInvoice() {
    if (!billing?.currentInvoice) return;
    setBusy(true);
    setNotice(null);
    try {
      const checkout = await partnerWhiteLabelApi.createBillingCheckout(documentId(billing.currentInvoice));
      if (checkout.settled) {
        await load();
        setNotice({ tone: "success", message: "This partner invoice is already settled." });
        return;
      }
      if (!checkout.keyId || !checkout.orderId || !checkout.currency || checkout.amount === undefined) {
        throw new Error("The partner checkout response is incomplete.");
      }
      const result = await openRazorpayCheckout({
        provider: "razorpay",
        kind: "order",
        keyId: checkout.keyId,
        orderId: checkout.orderId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: checkout.name ?? "Vozon white-label platform",
        description: checkout.description ?? `Partner invoice ${checkout.invoice.invoiceNumber}`,
        prefill: checkout.prefill ?? {},
        displayMode: "all",
      } satisfies RazorpayCheckoutPayload);
      await partnerWhiteLabelApi.verifyBillingCheckout(result);
      await load();
      setNotice({ tone: "success", message: "Payment verified. Your white-label platform billing is active." });
    } catch (error) {
      setNotice({ tone: "error", message: error instanceof Error ? error.message : "Partner payment failed." });
    } finally {
      setBusy(false);
    }
  }

  if (!session || loading) return <main className="grid min-h-screen place-items-center bg-[#f3f6f5] text-sm font-semibold text-[#71817d]">Loading white-label operations…</main>;
  if (!overview) return <main className="grid min-h-screen place-items-center bg-[#f3f6f5] p-6 text-[#1d342e]"><Card className="max-w-lg p-7 text-center"><h1 className="text-xl font-bold">White-label access is not enabled</h1><p className="mt-3 text-sm leading-6 text-[#71817d]">A platform super administrator must approve a contract for this organization first.</p><button className={`${secondaryButtonClass} mt-5`} onClick={() => router.push("/dashboard/agents")}>Return to dashboard</button></Card></main>;

  const tabs: Array<{ id: Tab; label: string }> = [{ id: "launch", label: "Launch control" }, { id: "brand", label: "Brand" }, { id: "domains", label: "Domains" }, { id: "plans", label: "Pricing plans" }, { id: "customers", label: "Customers" }, { id: "billing", label: "Billing" }, { id: "contract", label: "Contract" }];
  return <main className={`grid min-h-screen bg-[#f3f6f5] text-[#1d342e] ${showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"}`}>
    <DashboardSidebar activeLabel="White label" userInitials={initials(session.name)} userName={session.name} userEmail={session.email} onLogout={() => void logoutSession().then(() => router.replace("/login"))} showUserSidebar={showUserSidebar} setShowUserSidebar={setShowUserSidebar} />
    <section className="min-w-0 p-4 sm:p-6"><div className="mx-auto grid max-w-[1500px] gap-5">
      <header className="overflow-hidden rounded-2xl border border-[#dce7e3] bg-[linear-gradient(120deg,#ffffff_0%,#f4faf8_70%,#eaf6f2_100%)] p-6 shadow-[0_10px_30px_rgba(28,55,47,0.06)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><span className="text-xs font-bold uppercase tracking-[0.18em] text-[#118778]">Partner workspace</span><h1 className="mt-2 text-3xl font-bold tracking-tight text-[#14231f] sm:text-4xl">{overview.account.name}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#647771]">Manage your brand, domains, pricing, customers and platform contract from one secure workspace.</p></div><div className="flex gap-2"><Status value={overview.account.status} /><Status value={overview.account.billingStatus} /></div></div>
      </header>
      {notice ? <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${notice.tone === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : notice.tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-sky-200 bg-sky-50 text-sky-700"}`}>{notice.message}</div> : null}
      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-[#dde6e3] bg-white p-1.5 shadow-[0_6px_18px_rgba(28,55,47,0.04)]" aria-label="White-label administration">{tabs.map((item) => <button className={`shrink-0 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${tab === item.id ? "bg-[#126f62] text-white shadow-sm" : "text-[#647771] hover:bg-[#f1f6f4] hover:text-[#29423b]"}`} key={item.id} onClick={() => setTab(item.id)}>{item.label}</button>)}</nav>

      {tab === "launch" ? <div className="grid gap-5 xl:grid-cols-[1fr_0.7fr]">
        <Card><SectionTitle title="Production launch gates" description="Complete these four steps before onboarding customers." /><div className="grid gap-3 p-5">{readiness.map((item) => <button className="flex items-center justify-between rounded-lg border border-[#e1e8e6] bg-[#fafcfb] p-4 text-left transition hover:border-[#c8d8d3] hover:bg-[#f3f8f6]" key={item.label} onClick={() => setTab(item.tab)}><span><strong className="block text-sm font-semibold text-[#29423b]">{item.label}</strong><span className="mt-1 block text-xs text-[#7b8b86]">{item.ready ? "Gate passed" : "Action required"}</span></span><span className={`grid size-8 place-items-center rounded-full text-sm font-bold ${item.ready ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{item.ready ? "✓" : "!"}</span></button>)}</div></Card>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">{[["Customers", overview.metrics.customerCount, `${overview.account.usage?.customerOrganizations ?? overview.metrics.customerCount} / ${overview.account.limits.customerOrganizations} capacity`], ["Active subscriptions", overview.metrics.activeSubscriptions, "Trialing, active, past due, or paused"], ["Active domains", activeDomains, `${overview.domains.length} total domain records`], ["Published plans", publishedPlans.length, `${overview.plans.length} immutable versions`]].map(([label, value, detail]) => <Card className="p-5" key={String(label)}><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7b8b86]">{label}</span><strong className="mt-2 block text-3xl font-bold text-[#1d342e]">{value}</strong><span className="mt-1 block text-xs text-[#71817d]">{detail}</span></Card>)}</div>
        {economics?.economics.length ? <Card className="xl:col-span-2"><SectionTitle title="Partner economics" description={`Usage economics since ${date(economics.from)}. Negative margin includes plan allowances absorbed by the partner.`} /><div className="grid gap-4 p-5 md:grid-cols-2">{economics.economics.map((row) => <div className="rounded-xl border border-[#e1e8e6] bg-[#fafcfb] p-5" key={row.currency}><div className="flex items-center justify-between"><strong className="text-[#29423b]">{row.currency}</strong><span className="text-xs text-[#7b8b86]">{row.calls.toLocaleString()} calls</span></div><dl className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><dt className="text-[#7b8b86]">Projected monthly recurring</dt><dd className="mt-1 text-base font-bold text-[#29423b]">{money(row.projectedMonthlyRecurringMinor, row.currency)}</dd></div><div><dt className="text-[#7b8b86]">Customer usage charges</dt><dd className="mt-1 text-base font-bold text-[#29423b]">{money(row.customerUsageCharges * 100, row.currency)}</dd></div><div><dt className="text-[#7b8b86]">Wholesale usage cost</dt><dd className="mt-1 text-base font-bold text-[#29423b]">{money(row.wholesaleCost * 100, row.currency)}</dd></div><div><dt className="text-[#7b8b86]">Usage contribution</dt><dd className={`mt-1 text-base font-bold ${row.partnerMargin < 0 ? "text-rose-700" : "text-emerald-700"}`}>{money(row.partnerMargin * 100, row.currency)}</dd></div></dl></div>)}</div></Card> : null}
      </div> : null}

      {tab === "brand" && defaultBrand ? <Card><SectionTitle title="Customer-facing brand" description="These settings drive metadata, authentication, navigation, support, legal links, and transactional email content." action={<Status value={defaultBrand.status} />} /><BrandEditor brand={defaultBrand} busy={busy} onSaved={async (message) => { await load(); setNotice({ tone: "success", message }); }} /></Card> : null}

      {tab === "domains" ? <div className="grid gap-5"><Card><SectionTitle title="Add custom domain" description="The domain stays fail-closed until ownership, routing, edge, and TLS validations all pass." /><form className="grid gap-4 p-5 md:grid-cols-[180px_220px_minmax(0,1fr)_auto] md:items-end" onSubmit={addDomain}><Select label="Domain purpose" value={domainKind} onChange={(event) => setDomainKind(event.target.value as "app" | "api" | "link")}><option value="app">Customer app</option><option value="link">Public links</option>{overview.account.entitlements.customApiDomains ? <option value="api">Developer API</option> : null}</Select><Select label="Brand" required value={domainBrandId} onChange={(event) => setDomainBrandId(event.target.value)}>{overview.brands.map((item) => <option key={documentId(item)} value={documentId(item)}>{item.branding.productName}</option>)}</Select><Input label="Hostname only" placeholder={domainKind === "api" ? "api.customerbrand.com" : domainKind === "link" ? "links.customerbrand.com" : "app.customerbrand.com"} required value={domain} onChange={(event) => setDomain(event.target.value)} /><button className={buttonClass} disabled={busy} type="submit">Reserve domain</button></form></Card>
        {overview.domains.map((item) => <Card key={documentId(item)}><div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><strong className="text-[#29423b]">{item.hostname}</strong><Status value={item.status} /><span className="rounded-full bg-[#f0f4f3] px-2 py-1 text-[10px] font-semibold uppercase text-[#647771]">{item.kind}</span><span className="rounded-full bg-[#f0f4f3] px-2 py-1 text-[10px] font-semibold uppercase text-[#647771]">TLS {item.tls?.status ?? "not started"}</span></div><p className="mt-2 text-xs text-[#71817d]">Last checked {date(item.lastCheckedAt)}{item.failureReason ? ` · ${item.failureReason}` : ""}</p></div><div className="flex gap-2"><button className={secondaryButtonClass} disabled={busy || item.status === "active" || item.status === "disabled"} onClick={() => void perform(() => partnerWhiteLabelApi.verifyDomain(documentId(item)), "Domain verification refreshed.")}>Verify now</button>{item.status === "disabled" ? <button className={buttonClass} disabled={busy} onClick={() => void perform(() => partnerWhiteLabelApi.reactivateDomain(documentId(item)), "Domain reactivated. Add the displayed DNS records, then verify it.")}>Reactivate</button> : <button className="inline-flex min-h-10 items-center justify-center rounded-lg border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-45" disabled={busy} onClick={() => { const reason = window.prompt("Reason for disabling this domain:"); if (reason) void perform(() => partnerWhiteLabelApi.disableDomain(documentId(item), reason), "Domain disabled and removed from branded request resolution."); }}>Disable</button>}</div></div><div className="overflow-x-auto border-t border-[#e7edeb]"><table className="w-full min-w-[720px] text-left text-xs"><thead className="bg-[#f7f9f8] text-[#71817d]"><tr><th className="px-5 py-3">Type</th><th className="px-5 py-3">DNS name</th><th className="px-5 py-3">Value</th><th className="px-5 py-3">Purpose</th></tr></thead><tbody>{item.requiredRecords.map((record, index) => <tr className="border-t border-[#e7edeb]" key={`${record.name}-${index}`}><td className="px-5 py-3 font-bold text-[#118778]">{record.type}</td><td className="px-5 py-3 font-mono text-[#40564f]">{record.name}</td><td className="max-w-md break-all px-5 py-3 font-mono text-[#40564f]">{record.value}</td><td className="px-5 py-3 capitalize text-[#71817d]">{record.purpose}</td></tr>)}</tbody></table></div></Card>)}
      </div> : null}

      {tab === "plans" ? <div className="grid gap-5"><Card><SectionTitle title={editingPlanId ? "Edit draft price version" : "Create customer price version"} description="Enter selling prices and choose a model subset within the super-admin contract ceiling. Published versions are immutable." /><form className="grid gap-4 p-5" onSubmit={savePlan}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Input label="Plan name" required value={plan.name} onChange={(event) => setPlan((value) => ({ ...value, name: event.target.value }))} /><Input disabled={Boolean(editingPlanId)} label="Stable key" required value={plan.key} onChange={(event) => setPlan((value) => ({ ...value, key: event.target.value }))} /><Select label="Currency" value={plan.currency} onChange={(event) => setPlan((value) => ({ ...value, currency: event.target.value }))}><option>USD</option><option>INR</option></Select><Input label="Monthly price" min="0" required step="0.01" type="number" value={plan.monthlyPrice} onChange={(event) => setPlan((value) => ({ ...value, monthlyPrice: event.target.value }))} /></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Input label="Setup fee" min="0" step="0.01" type="number" value={plan.setupFee} onChange={(event) => setPlan((value) => ({ ...value, setupFee: event.target.value }))} /><Input label="Trial days" min="0" type="number" value={plan.trialDays} onChange={(event) => setPlan((value) => ({ ...value, trialDays: event.target.value }))} /><Select label="Usage charging" value={plan.usageMode} onChange={(event) => setPlan((value) => ({ ...value, usageMode: event.target.value }))}><option value="cost_markup">Provider cost + markup</option><option value="fixed_per_minute">Fixed per minute</option><option value="included_only">Included minutes only</option></Select><Input label={plan.usageMode === "fixed_per_minute" ? "Price per minute" : "Usage markup %"} min="0" step="0.01" type="number" value={plan.usageMode === "fixed_per_minute" ? plan.perMinute : plan.markupPercent} onChange={(event) => setPlan((value) => plan.usageMode === "fixed_per_minute" ? ({ ...value, perMinute: event.target.value }) : ({ ...value, markupPercent: event.target.value }))} /></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Input label="Included minutes" min="0" type="number" value={plan.includedMinutes} onChange={(event) => setPlan((value) => ({ ...value, includedMinutes: event.target.value }))} /><Input label="Agent limit" min="0" type="number" value={plan.agents} onChange={(event) => setPlan((value) => ({ ...value, agents: event.target.value }))} /><Input label="Member limit" min="1" type="number" value={plan.members} onChange={(event) => setPlan((value) => ({ ...value, members: event.target.value }))} /><Input label="Monthly-minute ceiling" min="0" type="number" value={plan.monthlyMinutes} onChange={(event) => setPlan((value) => ({ ...value, monthlyMinutes: event.target.value }))} /></div><ModelAccessPicker catalog={overview.modelAccessCatalog} disabled={busy} onChange={(modelAccess) => setPlan((value) => ({ ...value, modelAccess }))} value={plan.modelAccess} /><div className="flex justify-end gap-2">{editingPlanId ? <button className={secondaryButtonClass} disabled={busy} onClick={() => setEditingPlanId("")} type="button">Cancel editing</button> : null}<button className={buttonClass} disabled={busy}>{editingPlanId ? "Save draft changes" : "Create draft version"}</button></div></form></Card>
        <div className="grid gap-4 lg:grid-cols-2">{overview.plans.map((item) => <Card className="p-5" key={documentId(item)}><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><h3 className="font-bold text-[#29423b]">{item.name}</h3><Status value={item.status} /></div><p className="mt-1 text-xs text-[#7b8b86]">{item.key} · version {item.version}</p></div><strong className="text-xl text-[#1d342e]">{money(item.price.recurringAmountMinor, item.price.currency)}<span className="text-xs font-medium text-[#7b8b86]">/{item.price.interval}</span></strong></div><div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#647771]"><span>{item.allowances.includedMinutes.toLocaleString()} included min</span><span>{item.limits.agents} agents</span><span>{item.limits.concurrentCalls} concurrent calls</span><span>{item.usagePricing.mode.replaceAll("_", " ")}</span><span>{item.modelAccess?.stt.length ?? "Inherited"} STT models</span><span>{item.modelAccess?.llm.length ?? "Inherited"} LLM/realtime models</span><span>{item.modelAccess?.tts.length ?? "Inherited"} TTS models</span></div><div className="mt-5 flex flex-wrap gap-2">{item.status === "draft" ? <><button className={secondaryButtonClass} disabled={busy} onClick={() => editPlan(item)}>Edit draft</button><button className={buttonClass} disabled={busy} onClick={() => void perform(() => partnerWhiteLabelApi.publishPlan(documentId(item)), `${item.name} version ${item.version} published.`)}>Publish immutable version</button></> : null}{item.status === "published" ? <><button className={secondaryButtonClass} disabled={busy} onClick={() => void perform(() => partnerWhiteLabelApi.revisePlan(documentId(item)), "Draft revision created from the published snapshot.")}>Create revision</button><button className={secondaryButtonClass} disabled={busy} onClick={() => void perform(() => partnerWhiteLabelApi.archivePlan(documentId(item)), "Plan archived for new sales; existing subscriptions retain their snapshot.")}>Archive</button></> : null}</div></Card>)}</div>
      </div> : null}

      {tab === "customers" ? <div className="grid gap-5"><Card><SectionTitle title="Provision customer organization" description="Creates an isolated tenant, immutable subscription snapshot, wallet, owner activation, and branded email delivery." /><form className="grid gap-4 p-5" onSubmit={provision}><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Input label="Organization" required value={customer.organizationName} onChange={(event) => setCustomer((value) => ({ ...value, organizationName: event.target.value }))} /><Input label="Owner name" required value={customer.ownerName} onChange={(event) => setCustomer((value) => ({ ...value, ownerName: event.target.value }))} /><Input label="Owner email" required type="email" value={customer.ownerEmail} onChange={(event) => setCustomer((value) => ({ ...value, ownerEmail: event.target.value }))} /><Input label="External customer ID" value={customer.externalCustomerId} onChange={(event) => setCustomer((value) => ({ ...value, externalCustomerId: event.target.value }))} /></div><div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end"><Select label="Published brand" required value={customer.brandId} onChange={(event) => setCustomer((value) => ({ ...value, brandId: event.target.value }))}>{overview.brands.filter((item) => item.status === "published").map((item) => <option key={documentId(item)} value={documentId(item)}>{item.branding.productName}</option>)}</Select><Select label="Published plan" required value={customer.planId} onChange={(event) => setCustomer((value) => ({ ...value, planId: event.target.value }))}>{publishedPlans.map((item) => <option key={documentId(item)} value={documentId(item)}>{item.name} v{item.version} · {money(item.price.recurringAmountMinor, item.price.currency)}</option>)}</Select><button className={buttonClass} disabled={busy || !publishedPlans.length}>Provision securely</button></div></form></Card>
        <Card><SectionTitle title="Customer organizations" description={`${customers.length} isolated customer tenants`} /><div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-xs"><thead className="bg-[#f7f9f8] text-[#71817d]"><tr><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Owner</th><th className="px-5 py-3">Brand</th><th className="px-5 py-3">Plan snapshot</th><th className="px-5 py-3">Tenant</th><th className="px-5 py-3">Subscription</th><th className="px-5 py-3">Actions</th></tr></thead><tbody>{customers.map((item) => <tr className="border-t border-[#e7edeb] transition hover:bg-[#fafcfb]" key={documentId(item)}><td className="px-5 py-4"><strong className="block text-sm text-[#29423b]">{item.name}</strong><span className="mt-1 block text-[#8a9894]">{item.externalCustomerId || item.slug}</span></td><td className="px-5 py-4"><span className="block text-[#40564f]">{item.ownerUserId?.name}</span><span className="mt-1 block text-[#8a9894]">{item.ownerUserId?.email}</span></td><td className="px-5 py-4 text-[#536963]">{item.whiteLabelBrandId?.branding?.productName ?? item.whiteLabelBrandId?.key}</td><td className="px-5 py-4 text-[#536963]">{item.subscription ? <><span className="block">{item.subscription.planKey} v{item.subscription.planVersion}</span><span className="mt-1 block text-[#8a9894]">Ends {date(item.subscription.currentPeriodEnd)}</span></> : "Missing"}</td><td className="px-5 py-4"><Status value={item.lifecycleStatus} /></td><td className="px-5 py-4"><Status value={item.subscription?.status ?? "missing"} /></td><td className="px-5 py-4"><div className="flex gap-2"><button className={secondaryButtonClass} disabled={busy || item.lifecycleStatus === "archived"} onClick={() => { const next = item.lifecycleStatus === "active" ? "suspended" : "active"; const reason = window.prompt(`Reason for marking this customer ${next}:`); if (reason) void perform(() => partnerWhiteLabelApi.updateCustomerStatus(documentId(item), next, reason), `Customer marked ${next}.`); }}>{item.lifecycleStatus === "active" ? "Suspend" : "Reactivate"}</button>{item.subscription && item.subscription.status !== "active" && item.subscription.status !== "trialing" ? <button className={buttonClass} disabled={busy} onClick={() => { const reason = window.prompt("Renewal/payment reference and reason:"); if (reason) void perform(() => partnerWhiteLabelApi.updateCustomerSubscription(documentId(item), "active", reason), "Subscription renewed for the next snapshotted billing period."); }}>Renew</button> : null}</div></td></tr>)}</tbody></table></div></Card>
      </div> : null}

      {tab === "billing" && billing ? <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionTitle title="Partner platform invoice" description="Pay your platform contract securely. The backend and webhook verify the Razorpay signature and exact amount." action={<Status value={billing.currentInvoice.status} />} />
          <div className="grid gap-5 p-5">
            <div><span className="text-xs font-bold uppercase tracking-[0.14em] text-[#7b8b86]">Amount due</span><strong className="mt-2 block text-4xl font-bold text-[#1d342e]">{money(billing.currentInvoice.totalMinor, billing.currentInvoice.currency)}</strong><span className="mt-2 block text-xs text-[#71817d]">{billing.currentInvoice.invoiceNumber} · due {date(billing.currentInvoice.dueAt)}</span></div>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Platform fee</dt><dd className="font-semibold text-[#29423b]">{money(billing.currentInvoice.platformFeeMinor, billing.currentInvoice.currency)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Wholesale usage</dt><dd className="font-semibold text-[#29423b]">{money(billing.currentInvoice.usageWholesaleMinor, billing.currentInvoice.currency)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Included-credit discount</dt><dd className="font-semibold text-emerald-700">−{money(billing.currentInvoice.includedCreditDiscountMinor, billing.currentInvoice.currency)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#71817d]">Wholesale markup</dt><dd className="font-semibold text-[#29423b]">{money(billing.currentInvoice.usageMarkupMinor, billing.currentInvoice.currency)}</dd></div>
              <div className="flex justify-between gap-4 border-t border-[#e7edeb] pt-3"><dt className="text-[#71817d]">Minimum/usage commitment</dt><dd className="font-semibold text-[#29423b]">{money(billing.currentInvoice.committedUsageMinor, billing.currentInvoice.currency)}</dd></div>
            </dl>
            {billing.currentInvoice.status === "paid" ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Paid and verified {billing.currentInvoice.paidAt ? date(billing.currentInvoice.paidAt) : ""}</div> : <button className={buttonClass} disabled={busy || !billing.paymentReadiness.ready} onClick={() => void payPartnerInvoice()}>{busy ? "Opening secure payment…" : `Pay ${money(billing.currentInvoice.totalMinor, billing.currentInvoice.currency)}`}</button>}
            {!billing.paymentReadiness.ready ? <p className="text-xs text-rose-700">{billing.paymentReadiness.reason}</p> : null}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Invoice history" description="Partner invoices are stored separately from normal platform-customer billing." />
          <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs"><thead className="bg-[#f7f9f8] text-[#71817d]"><tr><th className="px-5 py-3">Invoice</th><th className="px-5 py-3">Period</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Payment</th></tr></thead><tbody>{billing.invoices.map((invoice) => <tr className="border-t border-[#e7edeb] transition hover:bg-[#fafcfb]" key={documentId(invoice)}><td className="px-5 py-4 font-semibold text-[#29423b]">{invoice.invoiceNumber}</td><td className="px-5 py-4 text-[#647771]">{date(invoice.periodStart)} – {date(invoice.periodEnd)}</td><td className="px-5 py-4 font-semibold text-[#29423b]">{money(invoice.totalMinor, invoice.currency)}</td><td className="px-5 py-4"><Status value={invoice.status} /></td><td className="px-5 py-4 text-[#71817d]">{invoice.razorpayPaymentId || (invoice.provider === "internal" ? "No payment required" : "Awaiting payment")}</td></tr>)}</tbody></table></div>
        </Card>
      </div> : null}

      {tab === "contract" ? <div className="grid gap-5 lg:grid-cols-2"><Card><SectionTitle title="Platform commercial terms" description="Only a platform super administrator can change these audited wholesale terms." /><dl className="grid grid-cols-2 gap-4 p-5 text-sm">{[["Platform fee", money(overview.account.contract.platformFeeMinor, overview.account.contract.currency)], ["Minimum commitment", money(overview.account.contract.minimumCommitmentMinor, overview.account.contract.currency)], ["Included credits", overview.account.contract.includedCredits], ["Wholesale markup", `${overview.account.contract.wholesaleMarkupBps / 100}%`], ["Payment terms", `${overview.account.contract.paymentTermsDays} days`], ["Credit limit", overview.account.contract.creditLimitCredits]].map(([key, value]) => <div className="rounded-lg border border-[#e1e8e6] bg-[#fafcfb] p-4" key={String(key)}><dt className="text-xs text-[#7b8b86]">{key}</dt><dd className="mt-1 font-bold text-[#29423b]">{value}</dd></div>)}</dl></Card><Card><SectionTitle title="Hard tenant ceilings" description="Customer plans cannot exceed the platform contract." /><dl className="grid grid-cols-2 gap-4 p-5 text-sm">{Object.entries(overview.account.limits).map(([key, value]) => <div className="rounded-lg border border-[#e1e8e6] bg-[#fafcfb] p-4" key={key}><dt className="text-xs capitalize text-[#7b8b86]">{key.replace(/([A-Z])/g, " $1")}</dt><dd className="mt-1 font-bold text-[#29423b]">{Number(value).toLocaleString()}</dd></div>)}</dl></Card></div> : null}
    </div></section>
  </main>;
}
