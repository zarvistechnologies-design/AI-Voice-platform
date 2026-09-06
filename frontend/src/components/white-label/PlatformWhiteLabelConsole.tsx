"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { ModelAccessPicker } from "@/components/white-label/ModelAccessPicker";
import { getServerSession, getSession, logoutSession, subscribeToSession, validateStoredSession } from "@/lib/auth";
import { documentId, platformWhiteLabelApi, type PartnerOverview, type WhiteLabelAccount, type WhiteLabelModelAccess } from "@/lib/whiteLabel";

const field = "min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[color:var(--brand-primary)]/10";
const label = "grid gap-2 text-xs font-bold text-white/55";
const primary = "inline-flex min-h-10 items-center justify-center rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-black text-black hover:brightness-110 disabled:opacity-45";
const secondary = "inline-flex min-h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white/70 hover:bg-white/[0.08] hover:text-white disabled:opacity-45";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`rounded-2xl border border-white/10 bg-[#07110f] shadow-[0_18px_45px_rgba(0,0,0,0.3)] ${className}`}>{children}</article>;
}

function Input({ title, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { title: string }) {
  return <label className={label}><span>{title}</span><input {...props} className={field} /></label>;
}

function Select({ title, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { title: string; children: ReactNode }) {
  return <label className={label}><span>{title}</span><select {...props} className={field}>{children}</select></label>;
}

function Badge({ value }: { value: string }) {
  const good = value === "active" || value === "trialing" || value === "published";
  const bad = ["suspended", "terminated", "cancelled", "past_due"].includes(value);
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.11em] ring-1 ${good ? "bg-emerald-400/10 text-emerald-300 ring-emerald-300/20" : bad ? "bg-rose-400/10 text-rose-300 ring-rose-300/20" : "bg-amber-300/10 text-amber-200 ring-amber-200/20"}`}>{value.replaceAll("_", " ")}</span>;
}

function formatMinor(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value / 100);
}

export function PlatformWhiteLabelConsole() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [accounts, setAccounts] = useState<WhiteLabelAccount[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<(PartnerOverview & { customerCount: number; subscriptions: Array<{ _id: string; count: number }> }) | null>(null);
  const [organizations, setOrganizations] = useState<Array<{ _id: string; id?: string; name: string; slug: string; ownerUserId?: { name: string; email: string; emailVerified: boolean; twoFactorEnabled: boolean } }>>([]);
  const [audits, setAudits] = useState<Array<{ _id: string; action: string; actorEmail: string; reason?: string; createdAt: string; resource: string }>>([]);
  const [notice, setNotice] = useState<{ error?: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [create, setCreate] = useState({ ownerOrgId: "", name: "", slug: "", currency: "USD", platformFee: "499", minimumCommitment: "0", wholesaleMarkup: "10", includedCredits: "0", customerOrganizations: "100", agentsPerCustomer: "25", membersPerCustomer: "25", phoneNumbersPerCustomer: "10", concurrentCallsPerCustomer: "10", monthlyMinutesPerCustomer: "10000", productName: "", companyName: "", primaryColor: "#45ddce", secondaryColor: "#071b18", accentColor: "#75fff0", surfaceColor: "#020807", supportEmail: "" });
  const [lifecycle, setLifecycle] = useState({ status: "", billingStatus: "", reason: "" });
  const [commercial, setCommercial] = useState({ platformFee: "", minimumCommitment: "", wholesaleMarkup: "", customerOrganizations: "", agentsPerCustomer: "", concurrentCallsPerCustomer: "", retailBillingEnabled: false, linkedAccountId: "", transferMode: "disabled", taxRate: "0", taxLabel: "Tax", taxRegistrationId: "", graceDays: "3", reason: "" });
  const [commercialEntitlements, setCommercialEntitlements] = useState<Record<string, boolean>>({});
  const [commercialModelAccess, setCommercialModelAccess] = useState<WhiteLabelModelAccess>({ stt: [], llm: [], tts: [] });

  const loadAccounts = useCallback(async () => {
    const result = await platformWhiteLabelApi.accounts();
    setAccounts(result.accounts);
    setSelectedId((current) => current || (result.accounts[0] ? documentId(result.accounts[0]) : ""));
  }, []);

  const loadDetail = useCallback(async (accountId: string) => {
    if (!accountId) { setDetail(null); setAudits([]); return; }
    const [result, auditResult] = await Promise.all([platformWhiteLabelApi.account(accountId), platformWhiteLabelApi.audit(accountId)]);
    setDetail(result);
    setAudits(auditResult.auditLogs);
    setLifecycle({ status: result.account.status, billingStatus: result.account.billingStatus, reason: "" });
    setCommercial({ platformFee: String(result.account.contract.platformFeeMinor / 100), minimumCommitment: String(result.account.contract.minimumCommitmentMinor / 100), wholesaleMarkup: String(result.account.contract.wholesaleMarkupBps / 100), customerOrganizations: String(result.account.limits.customerOrganizations), agentsPerCustomer: String(result.account.limits.agentsPerCustomer), concurrentCallsPerCustomer: String(result.account.limits.concurrentCallsPerCustomer), retailBillingEnabled: result.account.retailBilling?.enabled ?? false, linkedAccountId: result.account.retailBilling?.razorpayLinkedAccountId ?? "", transferMode: result.account.retailBilling?.transferMode ?? "disabled", taxRate: String((result.account.retailBilling?.taxRateBps ?? 0) / 100), taxLabel: result.account.retailBilling?.taxLabel ?? "Tax", taxRegistrationId: result.account.retailBilling?.taxRegistrationId ?? "", graceDays: String(result.account.retailBilling?.gracePeriodDays ?? 3), reason: "" });
    setCommercialEntitlements(result.account.entitlements);
    setCommercialModelAccess(result.account.modelAccess ?? {
      stt: result.modelAccessCatalog.stt.map((item) => item.key),
      llm: result.modelAccessCatalog.llm.map((item) => item.key),
      tts: result.modelAccessCatalog.tts.map((item) => item.key),
    });
  }, []);

  useEffect(() => {
    if (!session) { router.replace("/login?next=/platform-admin/white-label"); return; }
    void (async () => {
      const checked = await validateStoredSession({ force: true });
      if (!checked || checked.platformRole !== "super_admin") { setLoading(false); return; }
      try {
        const [orgResult] = await Promise.all([platformWhiteLabelApi.eligibleOrganizations(), loadAccounts()]);
        setOrganizations(orgResult.organizations);
      } catch (error) {
        setNotice({ error: true, text: error instanceof Error ? error.message : "Could not load platform controls." });
      } finally { setLoading(false); }
    })();
  }, [loadAccounts, router, session]);

  useEffect(() => {
    if (!selectedId || session?.platformRole !== "super_admin") return;
    const timer = window.setTimeout(() => {
      void loadDetail(selectedId).catch((error) => setNotice({ error: true, text: error instanceof Error ? error.message : "Could not load account." }));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDetail, selectedId, session?.platformRole]);

  async function run(action: () => Promise<unknown>, message: string, refreshOrganizations = false) {
    setBusy(true); setNotice(null);
    try {
      await action();
      await loadAccounts();
      if (selectedId) await loadDetail(selectedId);
      if (refreshOrganizations) setOrganizations((await platformWhiteLabelApi.eligibleOrganizations()).organizations);
      setNotice({ text: message });
    } catch (error) { setNotice({ error: true, text: error instanceof Error ? error.message : "Operation failed." }); }
    finally { setBusy(false); }
  }

  async function createAccount(event: FormEvent) {
    event.preventDefault();
    let newId = "";
    await run(async () => {
      const result = await platformWhiteLabelApi.createAccount({
        ownerOrgId: create.ownerOrgId,
        name: create.name,
        slug: create.slug,
        reason: "Initial production white-label account approval",
        contract: { currency: create.currency, billingInterval: "month", platformFeeMinor: Math.round(Number(create.platformFee) * 100), minimumCommitmentMinor: Math.round(Number(create.minimumCommitment) * 100), includedCredits: Number(create.includedCredits), wholesaleMarkupBps: Math.round(Number(create.wholesaleMarkup) * 100), platformFeePerMinuteCredits: 0, paymentTermsDays: 15, creditLimitCredits: 0, autoSuspendOnPastDue: true },
        limits: { brands: 1, customerOrganizations: Number(create.customerOrganizations), agentsPerCustomer: Number(create.agentsPerCustomer), membersPerCustomer: Number(create.membersPerCustomer), phoneNumbersPerCustomer: Number(create.phoneNumbersPerCustomer), concurrentCallsPerCustomer: Number(create.concurrentCallsPerCustomer), monthlyMinutesPerCustomer: Number(create.monthlyMinutesPerCustomer) },
        entitlements: { customDomains: true, customApiDomains: false, customEmailBranding: true, removePoweredBy: true, customCustomerPricing: true, multipleBrands: false, bringYourOwnProviders: false, advancedAnalytics: true, developerApi: true },
        defaultBrand: { productName: create.productName || create.name, companyName: create.companyName || create.name, primaryColor: create.primaryColor, secondaryColor: create.secondaryColor, accentColor: create.accentColor, surfaceColor: create.surfaceColor, supportEmail: create.supportEmail, legalBusinessName: create.companyName || create.name },
      });
      newId = documentId(result.account);
      setSelectedId(newId);
      setCreateOpen(false);
    }, "White-label account approved in onboarding state. The partner can now complete and publish its brand.", true);
    if (newId) await loadDetail(newId);
  }

  async function updateLifecycle(event: FormEvent) {
    event.preventDefault();
    if (!detail) return;
    await run(() => platformWhiteLabelApi.updateStatus(documentId(detail.account), lifecycle), "Lifecycle and billing controls updated with an immutable audit reason.");
  }

  async function updateCommercial(event: FormEvent) {
    event.preventDefault();
    if (!detail) return;
    const account = detail.account;
    await run(() => platformWhiteLabelApi.updateCommercials(documentId(account), {
      reason: commercial.reason,
      contract: { ...account.contract, platformFeeMinor: Math.round(Number(commercial.platformFee) * 100), minimumCommitmentMinor: Math.round(Number(commercial.minimumCommitment) * 100), wholesaleMarkupBps: Math.round(Number(commercial.wholesaleMarkup) * 100) },
      limits: { ...account.limits, customerOrganizations: Number(commercial.customerOrganizations), agentsPerCustomer: Number(commercial.agentsPerCustomer), concurrentCallsPerCustomer: Number(commercial.concurrentCallsPerCustomer) },
      entitlements: commercialEntitlements,
      retailBilling: { enabled: commercial.retailBillingEnabled, provider: "razorpay", razorpayLinkedAccountId: commercial.linkedAccountId, transferMode: commercial.transferMode, taxRateBps: Math.round(Number(commercial.taxRate) * 100), taxLabel: commercial.taxLabel, taxRegistrationId: commercial.taxRegistrationId, gracePeriodDays: Number(commercial.graceDays) },
      modelAccess: commercialModelAccess,
    }), "Commercial terms and hard ceilings updated with an audit reason.");
  }

  if (!session || loading) return <main className="grid min-h-screen place-items-center bg-black text-sm font-bold text-white/45">Loading platform administration…</main>;
  if (session.platformRole !== "super_admin") return <main className="grid min-h-screen place-items-center bg-black p-6 text-white"><Card className="max-w-lg p-7 text-center"><h1 className="text-xl font-black">Platform authorization required</h1><p className="mt-3 text-sm leading-6 text-white/50">This area requires the database-backed super-admin role. Production access also requires verified email and two-factor authentication.</p><button className={`${secondary} mt-5`} onClick={() => router.replace("/dashboard/agents")}>Return to dashboard</button></Card></main>;

  return <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050a09]/95 px-4 py-3 backdrop-blur-xl"><div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4"><BrandLogo showWebsiteLogo /><div className="flex items-center gap-3"><span className="hidden text-right sm:block"><strong className="block text-xs">{session.name}</strong><span className="block text-[10px] text-white/35">Super administrator</span></span><button className={secondary} onClick={() => void logoutSession().then(() => router.replace("/login"))}>Sign out</button></div></div></header>
    <section className="mx-auto grid max-w-[1600px] gap-5 p-4 sm:p-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-[var(--brand-primary)]/20 bg-[radial-gradient(circle_at_5%_0%,rgba(69,221,206,0.13),transparent_34%),#07110f] p-6 sm:flex-row sm:items-end sm:justify-between"><div><span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--brand-accent)]">Platform control plane</span><h1 className="mt-2 text-3xl font-black">White-label partners</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">Approve contracts, enforce ceilings, control lifecycle and billing states, and inspect operator audit history.</p></div><button className={primary} onClick={() => setCreateOpen((value) => !value)}>{createOpen ? "Close approval form" : "Approve new partner"}</button></div>
      {notice ? <div className={`rounded-xl border px-4 py-3 text-sm font-bold ${notice.error ? "border-rose-300/20 bg-rose-300/10 text-rose-200" : "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"}`}>{notice.text}</div> : null}

      {createOpen ? <Card><div className="border-b border-white/[0.08] p-5"><h2 className="font-black">Approve white-label contract</h2><p className="mt-1 text-xs text-white/40">The owner organization must be active and cannot be another partner’s customer.</p></div><form className="grid gap-5 p-5" onSubmit={createAccount}><div className="grid gap-4 md:grid-cols-3"><Select title="Eligible owner organization" required value={create.ownerOrgId} onChange={(event) => { const org = organizations.find((item) => documentId(item) === event.target.value); setCreate((value) => ({ ...value, ownerOrgId: event.target.value, name: value.name || org?.name || "", companyName: value.companyName || org?.name || "" })); }}><option value="">Select organization</option>{organizations.map((item) => <option key={documentId(item)} value={documentId(item)}>{item.name} · {item.ownerUserId?.email}</option>)}</Select><Input title="Partner account name" required value={create.name} onChange={(event) => setCreate((value) => ({ ...value, name: event.target.value }))} /><Input title="Account slug" placeholder="generated from name when blank" value={create.slug} onChange={(event) => setCreate((value) => ({ ...value, slug: event.target.value }))} /></div><div className="grid gap-4 md:grid-cols-4"><Select title="Contract currency" value={create.currency} onChange={(event) => setCreate((value) => ({ ...value, currency: event.target.value }))}><option>USD</option><option>INR</option></Select><Input title="Platform fee / month" min="0" step="0.01" type="number" value={create.platformFee} onChange={(event) => setCreate((value) => ({ ...value, platformFee: event.target.value }))} /><Input title="Minimum commitment" min="0" step="0.01" type="number" value={create.minimumCommitment} onChange={(event) => setCreate((value) => ({ ...value, minimumCommitment: event.target.value }))} /><Input title="Wholesale markup %" min="0" step="0.01" type="number" value={create.wholesaleMarkup} onChange={(event) => setCreate((value) => ({ ...value, wholesaleMarkup: event.target.value }))} /></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6"><Input title="Customer tenants" min="1" type="number" value={create.customerOrganizations} onChange={(event) => setCreate((value) => ({ ...value, customerOrganizations: event.target.value }))} /><Input title="Agents/customer" min="1" type="number" value={create.agentsPerCustomer} onChange={(event) => setCreate((value) => ({ ...value, agentsPerCustomer: event.target.value }))} /><Input title="Members/customer" min="1" type="number" value={create.membersPerCustomer} onChange={(event) => setCreate((value) => ({ ...value, membersPerCustomer: event.target.value }))} /><Input title="Numbers/customer" min="0" type="number" value={create.phoneNumbersPerCustomer} onChange={(event) => setCreate((value) => ({ ...value, phoneNumbersPerCustomer: event.target.value }))} /><Input title="Concurrent calls" min="1" type="number" value={create.concurrentCallsPerCustomer} onChange={(event) => setCreate((value) => ({ ...value, concurrentCallsPerCustomer: event.target.value }))} /><Input title="Monthly minutes" min="0" type="number" value={create.monthlyMinutesPerCustomer} onChange={(event) => setCreate((value) => ({ ...value, monthlyMinutesPerCustomer: event.target.value }))} /></div><div className="grid gap-4 md:grid-cols-3"><Input title="Initial product name" required value={create.productName} onChange={(event) => setCreate((value) => ({ ...value, productName: event.target.value }))} /><Input title="Legal company name" required value={create.companyName} onChange={(event) => setCreate((value) => ({ ...value, companyName: event.target.value }))} /><Input title="Support email" type="email" value={create.supportEmail} onChange={(event) => setCreate((value) => ({ ...value, supportEmail: event.target.value }))} /></div><div className="flex justify-end"><button className={primary} disabled={busy}>Create onboarding account</button></div></form></Card> : null}

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]"><Card className="h-fit overflow-hidden"><div className="border-b border-white/[0.08] p-5"><h2 className="font-black">Partner accounts</h2><p className="mt-1 text-xs text-white/35">{accounts.length} approved records</p></div><div className="max-h-[70vh] overflow-y-auto p-2">{accounts.map((item) => <button className={`mb-1 w-full rounded-xl border p-3 text-left transition ${selectedId === documentId(item) ? "border-[var(--brand-primary)]/25 bg-[var(--brand-primary)]/10" : "border-transparent hover:bg-white/[0.05]"}`} key={documentId(item)} onClick={() => setSelectedId(documentId(item))}><span className="flex items-center justify-between gap-2"><strong className="truncate text-sm">{item.name}</strong><Badge value={item.status} /></span><span className="mt-2 flex items-center justify-between text-[10px] text-white/35"><span>{item.slug}</span><span>{item.usage?.customerOrganizations ?? 0}/{item.limits.customerOrganizations} tenants</span></span></button>)}{!accounts.length ? <p className="p-6 text-center text-xs text-white/35">No partner accounts yet.</p> : null}</div></Card>
        {detail ? <div className="grid min-w-0 gap-5"><Card><div className="flex flex-col gap-3 border-b border-white/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-black">{detail.account.name}</h2><p className="mt-1 text-xs text-white/35">{detail.account.slug} · {typeof detail.account.ownerOrgId === "object" ? detail.account.ownerOrgId.name : detail.account.ownerOrgId}</p></div><div className="flex gap-2"><Badge value={detail.account.status} /><Badge value={detail.account.billingStatus} /></div></div><div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">{[["Customers", detail.customerCount], ["Brands", detail.brands.length], ["Domains", detail.domains.length], ["Plan versions", detail.plans.length]].map(([key, value]) => <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4" key={String(key)}><span className="text-xs text-white/35">{key}</span><strong className="mt-1 block text-2xl">{value}</strong></div>)}</div></Card>
          <div className="grid gap-5 lg:grid-cols-2"><Card><div className="border-b border-white/[0.08] p-5"><h3 className="font-black">Lifecycle and billing state</h3><p className="mt-1 text-xs text-white/35">Same-state updates can change billing status. Lifecycle transitions remain validated.</p></div><form className="grid gap-4 p-5" onSubmit={updateLifecycle}><div className="grid grid-cols-2 gap-4"><Select title="Lifecycle" value={lifecycle.status} onChange={(event) => setLifecycle((value) => ({ ...value, status: event.target.value }))}>{["draft", "onboarding", "active", "suspended", "terminated"].map((item) => <option key={item}>{item}</option>)}</Select><Select title="Billing" value={lifecycle.billingStatus} onChange={(event) => setLifecycle((value) => ({ ...value, billingStatus: event.target.value }))}>{["not_configured", "trialing", "active", "past_due", "suspended", "cancelled"].map((item) => <option key={item}>{item}</option>)}</Select></div><Input title="Required audit reason" minLength={8} required value={lifecycle.reason} onChange={(event) => setLifecycle((value) => ({ ...value, reason: event.target.value }))} /><button className={primary} disabled={busy}>Apply controlled change</button></form></Card>
          <Card className="lg:col-span-2"><div className="border-b border-white/[0.08] p-5"><h3 className="font-black">Commercial, retail billing, and entitlement controls</h3><p className="mt-1 text-xs text-white/35">Prices, ceilings, customer checkout, settlement, entitlements, and the maximum model catalog are audit logged.</p></div><form className="grid gap-5 p-5" onSubmit={updateCommercial}><div className="grid grid-cols-3 gap-3"><Input title="Platform fee" min="0" step="0.01" type="number" value={commercial.platformFee} onChange={(event) => setCommercial((value) => ({ ...value, platformFee: event.target.value }))} /><Input title="Minimum" min="0" step="0.01" type="number" value={commercial.minimumCommitment} onChange={(event) => setCommercial((value) => ({ ...value, minimumCommitment: event.target.value }))} /><Input title="Wholesale %" min="0" step="0.01" type="number" value={commercial.wholesaleMarkup} onChange={(event) => setCommercial((value) => ({ ...value, wholesaleMarkup: event.target.value }))} /></div><div className="grid grid-cols-3 gap-3"><Input title="Tenant limit" min="1" type="number" value={commercial.customerOrganizations} onChange={(event) => setCommercial((value) => ({ ...value, customerOrganizations: event.target.value }))} /><Input title="Agents/customer" min="1" type="number" value={commercial.agentsPerCustomer} onChange={(event) => setCommercial((value) => ({ ...value, agentsPerCustomer: event.target.value }))} /><Input title="Concurrency" min="1" type="number" value={commercial.concurrentCallsPerCustomer} onChange={(event) => setCommercial((value) => ({ ...value, concurrentCallsPerCustomer: event.target.value }))} /></div><div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4"><label className="flex items-center gap-3 text-sm font-black"><input checked={commercial.retailBillingEnabled} className="size-4 accent-[var(--brand-primary)]" onChange={(event) => setCommercial((value) => ({ ...value, retailBillingEnabled: event.target.checked }))} type="checkbox" />Enable verified customer retail checkout</label><p className="mt-2 text-xs text-white/35">When enabled, partner operators cannot manually activate a retail-billed subscription. Only exact verified payments or zero-value invoices renew access.</p><div className="mt-4 grid gap-3 md:grid-cols-3"><Input title="Razorpay linked account" placeholder="acc_... (optional)" value={commercial.linkedAccountId} onChange={(event) => setCommercial((value) => ({ ...value, linkedAccountId: event.target.value }))} /><Select title="Settlement mode" value={commercial.transferMode} onChange={(event) => setCommercial((value) => ({ ...value, transferMode: event.target.value }))}><option value="disabled">Platform settlement</option><option value="full_amount">Full amount via Route (INR)</option></Select><Input title="Payment grace days" min="0" max="90" type="number" value={commercial.graceDays} onChange={(event) => setCommercial((value) => ({ ...value, graceDays: event.target.value }))} /><Input title="Tax rate %" min="0" step="0.01" type="number" value={commercial.taxRate} onChange={(event) => setCommercial((value) => ({ ...value, taxRate: event.target.value }))} /><Input title="Tax label" value={commercial.taxLabel} onChange={(event) => setCommercial((value) => ({ ...value, taxLabel: event.target.value }))} /><Input title="Tax registration ID" value={commercial.taxRegistrationId} onChange={(event) => setCommercial((value) => ({ ...value, taxRegistrationId: event.target.value }))} /></div></div><div><h4 className="text-xs font-black uppercase tracking-[0.14em] text-white/45">Account entitlements</h4><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(commercialEntitlements).map(([key, enabled]) => <label className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-3 text-xs font-bold text-white/65" key={key}><input checked={enabled} className="size-4 accent-[var(--brand-primary)]" onChange={(event) => setCommercialEntitlements((value) => ({ ...value, [key]: event.target.checked }))} type="checkbox" /><span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span></label>)}</div></div><ModelAccessPicker catalog={detail.modelAccessCatalog} disabled={busy} onChange={setCommercialModelAccess} value={commercialModelAccess} /><Input title="Required audit reason" minLength={8} required value={commercial.reason} onChange={(event) => setCommercial((value) => ({ ...value, reason: event.target.value }))} /><button className={primary} disabled={busy}>Save commercial, billing, entitlements, and model access</button></form></Card></div>
          <Card><div className="border-b border-white/[0.08] p-5"><h3 className="font-black">Economics snapshot</h3><p className="mt-1 text-xs text-white/35">Current wholesale contract and partner resale catalog.</p></div><div className="grid gap-3 p-5 sm:grid-cols-3">{[["Platform fee", formatMinor(detail.account.contract.platformFeeMinor, detail.account.contract.currency)], ["Minimum commitment", formatMinor(detail.account.contract.minimumCommitmentMinor, detail.account.contract.currency)], ["Wholesale markup", `${detail.account.contract.wholesaleMarkupBps / 100}%`]].map(([key, value]) => <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4" key={String(key)}><span className="text-xs text-white/35">{key}</span><strong className="mt-1 block">{value}</strong></div>)}</div><div className="overflow-x-auto border-t border-white/[0.08]"><table className="w-full min-w-[700px] text-left text-xs"><thead className="text-white/35"><tr><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Version</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Retail price</th><th className="px-5 py-3">Usage</th></tr></thead><tbody>{detail.plans.map((item) => <tr className="border-t border-white/[0.06]" key={documentId(item)}><td className="px-5 py-3 font-bold">{item.name}</td><td className="px-5 py-3">v{item.version}</td><td className="px-5 py-3"><Badge value={item.status} /></td><td className="px-5 py-3">{formatMinor(item.price.recurringAmountMinor, item.price.currency)}/{item.price.interval}</td><td className="px-5 py-3 capitalize text-white/50">{item.usagePricing.mode.replaceAll("_", " ")}</td></tr>)}</tbody></table></div></Card>
          <Card><div className="border-b border-white/[0.08] p-5"><h3 className="font-black">Platform audit trail</h3><p className="mt-1 text-xs text-white/35">Latest {audits.length} privileged operations for this partner.</p></div><div className="divide-y divide-white/[0.07]">{audits.map((item) => <div className="grid gap-2 p-4 sm:grid-cols-[1fr_170px]" key={item._id}><div><strong className="block text-xs">{item.action.replaceAll("_", " ")}</strong><span className="mt-1 block text-[11px] text-white/35">{item.actorEmail} · {item.resource}{item.reason ? ` · ${item.reason}` : ""}</span></div><time className="text-[11px] text-white/30 sm:text-right">{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</time></div>)}{!audits.length ? <p className="p-6 text-center text-xs text-white/35">No audit records yet.</p> : null}</div></Card>
        </div> : <Card className="grid min-h-[420px] place-items-center p-8 text-center text-sm text-white/35">Select a partner account to inspect controls.</Card>}
      </div>
    </section>
  </main>;
}
