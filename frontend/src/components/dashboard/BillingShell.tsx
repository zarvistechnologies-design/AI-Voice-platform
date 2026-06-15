"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import { billingApi, type BillingPlan, type BillingSummary, type PlanId } from "@/lib/billing";

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function compact(value: number) {
  return new Intl.NumberFormat("en-US", { notation: value >= 10000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}

function money(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

function limitText(limit: number | null, suffix: string) {
  return limit === null ? `Unlimited ${suffix}` : `${limit.toLocaleString("en-US")} ${suffix}`;
}

function UsageMeter({ label, value, limit }: { label: string; value: number; limit: number | null }) {
  const percent = limit === null ? 0 : Math.min(100, Math.round((value / Math.max(1, limit)) * 100));
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <strong>{compact(value)} / {limit === null ? "Unlimited" : compact(limit)}</strong>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all ${percent >= 90 ? "bg-rose-500" : percent >= 70 ? "bg-amber-500" : "bg-blue-600"}`} style={{ width: limit === null ? "4%" : `${Math.max(2, percent)}%` }} />
      </div>
    </div>
  );
}

function PlanCard({ plan, current, busy, onChoose }: { plan: BillingPlan; current: PlanId; busy: boolean; onChoose: (plan: PlanId) => void }) {
  const selected = plan.id === current;
  return (
    <article className={`relative grid gap-5 rounded-2xl border bg-white p-5 shadow-sm ${selected ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"}`}>
      {selected ? <span className="absolute right-4 top-4 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700">Current</span> : null}
      <div>
        <h3 className="m-0 text-lg font-semibold">{plan.name}</h3>
        <strong className="mt-3 block text-3xl tracking-tight">{plan.monthlyPrice === null ? "Custom" : `$${plan.monthlyPrice}`}<span className="text-sm font-medium text-slate-500">{plan.monthlyPrice ? "/mo" : ""}</span></strong>
      </div>
      <div className="grid gap-2 text-sm text-slate-600">
        <span>{limitText(plan.limits.agents, "voice agents")}</span>
        <span>{limitText(plan.limits.monthlyMinutes, "minutes / month")}</span>
        <span>{limitText(plan.limits.phoneNumbers, "phone numbers")}</span>
        <span>{limitText(plan.limits.members, "team members")}</span>
      </div>
      <button className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${selected ? "cursor-default bg-slate-100 text-slate-500" : "bg-slate-950 text-white hover:bg-blue-700"}`} type="button" disabled={selected || busy || plan.id === "free"} onClick={() => onChoose(plan.id)}>
        {selected ? "Active plan" : plan.id === "enterprise" ? "Choose Enterprise" : plan.id === "free" ? "Included" : `Upgrade to ${plan.name}`}
      </button>
    </article>
  );
}

export function BillingShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [data, setData] = useState<BillingSummary | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await billingApi.summary());
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
    const checkout = new URLSearchParams(window.location.search).get("checkout");
    const timer = window.setTimeout(async () => {
      await load();
      if (checkout === "success") setNotice("Checkout completed. Your plan will update as soon as Stripe confirms it.");
      if (checkout === "cancelled") setNotice("Checkout was cancelled. Your current plan is unchanged.");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load, router, session]);

  async function choosePlan(plan: PlanId) {
    if (plan === "free") return;
    setBusy(true);
    try {
      const result = await billingApi.checkout(plan);
      window.location.assign(result.url);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not start checkout.");
      setBusy(false);
    }
  }

  async function openPortal() {
    setBusy(true);
    try {
      const result = await billingApi.portal();
      window.location.assign(result.url);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not open billing portal.");
      setBusy(false);
    }
  }

  if (!session) return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold">Loading billing</main>;

  const plan = data?.currentPlan;
  const usage = data?.usage;
  return (
    <main className="grid min-h-screen bg-[#f4f7fb] text-slate-950 lg:grid-cols-[64px_minmax(0,1fr)]">
      <DashboardSidebar activeLabel="Billing" userInitials={initials(session.name)} onLogout={() => void logoutSession().then(() => router.replace("/login"))} />
      <section className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto grid max-w-7xl gap-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Usage and subscription</span><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Billing</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Live organization usage, plan limits, Stripe checkout, and invoice history in one place.</p></div>
            <div className="flex gap-2"><button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold" type="button" disabled={busy} onClick={() => void load()}>Refresh usage</button>{data?.subscription.stripeCustomerId ? <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" type="button" disabled={busy} onClick={() => void openPortal()}>Manage subscription</button> : null}</div>
          </header>

          {notice ? <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}</div> : null}
          {!data?.configured ? <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Usage metering is active. Add Stripe keys and plan price IDs on the backend to enable paid checkout.</div> : null}

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4"><div><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current plan</span><h2 className="mt-2 text-2xl font-semibold">{plan?.name ?? "Loading"}</h2><p className="mt-1 text-sm capitalize text-slate-500">{data?.subscription.status ?? "active"} subscription</p></div><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">{data?.subscription.provider === "stripe" ? "Stripe managed" : "Internal billing"}</span></div>
              <div className="mt-6 grid gap-5">
                <UsageMeter label="Voice agents" value={usage?.agents ?? 0} limit={plan?.limits.agents ?? null} />
                <UsageMeter label="Team members" value={usage?.members ?? 0} limit={plan?.limits.members ?? null} />
                <UsageMeter label="Phone numbers" value={usage?.phoneNumbers ?? 0} limit={plan?.limits.phoneNumbers ?? null} />
                <UsageMeter label="Monthly call minutes" value={usage?.minutes ?? 0} limit={plan?.limits.monthlyMinutes ?? null} />
              </div>
            </article>
            <article className="rounded-2xl bg-slate-950 p-5 text-white shadow-lg">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">This month</span>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[["Calls", compact(usage?.calls ?? 0)], ["Provider cost", `$${(usage?.providerCost ?? 0).toFixed(2)}`], ["LLM tokens", compact(usage?.llmTokens ?? 0)], ["STT audio", `${compact(Math.round(usage?.sttSeconds ?? 0))}s`], ["TTS chars", compact(usage?.ttsCharacters ?? 0)], ["Minutes", compact(usage?.minutes ?? 0)]].map(([label, value]) => <div className="rounded-xl bg-white/10 p-3" key={label}><span className="block text-xs text-slate-300">{label}</span><strong className="mt-1 block text-lg">{value}</strong></div>)}
              </div>
            </article>
          </section>

          <section><div className="mb-4"><h2 className="m-0 text-lg font-semibold">Plans</h2><p className="mt-1 text-sm text-slate-500">Capacity checks are enforced by the API before resources or calls are created.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{data?.plans.map((item) => <PlanCard key={item.id} plan={item} current={data.subscription.plan} busy={busy} onChoose={(selected) => void choosePlan(selected)} />)}</div></section>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5"><h2 className="m-0 text-sm font-semibold">Invoices</h2><p className="mt-1 text-xs text-slate-500">Synced from signed Stripe invoice webhooks.</p></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr>{["Date", "Status", "Amount due", "Amount paid", "Documents"].map((item) => <th className="px-5 py-3" key={item}>{item}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{data?.invoices.length ? data.invoices.map((invoice) => <tr key={invoice._id}><td className="px-5 py-4 text-sm">{new Date(invoice.createdAt).toLocaleDateString()}</td><td className="px-5 py-4 text-sm capitalize">{invoice.status}</td><td className="px-5 py-4 text-sm">{money(invoice.amountDue, invoice.currency)}</td><td className="px-5 py-4 text-sm">{money(invoice.amountPaid, invoice.currency)}</td><td className="px-5 py-4 text-sm">{invoice.hostedInvoiceUrl ? <a className="font-semibold text-blue-600 hover:underline" href={invoice.hostedInvoiceUrl} target="_blank" rel="noreferrer">View invoice</a> : "Unavailable"}</td></tr>) : <tr><td className="px-5 py-8 text-center text-sm text-slate-500" colSpan={5}>No invoices yet.</td></tr>}</tbody></table></div>
          </article>
        </div>
      </section>
    </main>
  );
}
