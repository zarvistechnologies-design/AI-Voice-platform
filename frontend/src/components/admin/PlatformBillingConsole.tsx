"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/apiBase";
import { getAuthHeaders, getSession, validateStoredSession } from "@/lib/auth";

type Invoice = { _id: string; invoiceNumber: string; status: string; description: string; amountDue: number; amountPaid: number; currency: string; createdAt: string; razorpayPaymentId?: string };
type Account = { _id: string; name: string; slug: string; referralCode?: string; billingProfile?: { address?: string; phone?: string; country?: string; state?: string; postalCode?: string; gstin?: string }; owner?: { name: string; email: string } | null; wallet?: { balanceCredits: number; currency: string; lastPaymentStatus: string } | null; invoiceCount: number; lastInvoice?: Invoice | null };
type Detail = { organization: Account; owner: Account["owner"]; wallet: Account["wallet"]; invoices: Invoice[]; transactions: Array<{ _id: string; description: string; amountCredits: number; currency: string; razorpayPaymentId?: string; createdAt: string }> };

async function api<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}/api/platform/billing${path}`, { credentials: "include", headers: getAuthHeaders() });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Could not load billing data.");
  }
  return response.json() as Promise<T>;
}

function money(minor: number, currency: string) {
  try { return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR" }).format(minor / 100); }
  catch { return `${currency} ${(minor / 100).toFixed(2)}`; }
}

export function PlatformBillingConsole() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<{ accounts: Account[]; total: number; limit: number } | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);

  useEffect(() => {
    if (!getSession()) { router.replace("/login?next=/admin"); return; }
    void validateStoredSession({ force: true }).then((session) => {
      setAuthorized(session?.platformRole === "super_admin");
      setLoading(false);
    }).catch((caught) => { setError(caught instanceof Error ? caught.message : "Could not verify access."); setLoading(false); });
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    let active = true;
    void api<{ accounts: Account[]; total: number; limit: number }>(`/accounts?page=${page}&q=${encodeURIComponent(search)}`)
      .then((data) => { if (active) { setResult(data); setError(""); } })
      .catch((caught) => { if (active) setError(caught instanceof Error ? caught.message : "Could not load accounts."); });
    return () => { active = false; };
  }, [authorized, page, search]);

  async function selectAccount(id: string) {
    setError("");
    try { setDetail(await api<Detail>(`/accounts/${encodeURIComponent(id)}`)); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load account."); }
  }

  async function openInvoice(invoiceId: string) {
    if (!detail) return;
    try {
      const response = await fetch(`${API_URL}/api/platform/billing/accounts/${encodeURIComponent(detail.organization._id)}/invoices/${encodeURIComponent(invoiceId)}`, { credentials: "include", headers: getAuthHeaders() });
      if (!response.ok) throw new Error("Could not open invoice.");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoiceId}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not open invoice."); }
  }

  if (loading) return <main className="grid min-h-screen place-items-center text-slate-600">Checking platform access…</main>;
  if (!authorized) return <main className="grid min-h-screen place-items-center p-6"><div className="rounded-2xl border border-slate-200 p-8 text-center"><h1 className="text-xl font-bold">Platform access required</h1><p className="mt-2 text-sm text-slate-600">A verified super admin account with two factor authentication is required.</p><Link className="mt-4 block text-teal-700 underline" href="/dashboard/agents">Return to dashboard</Link></div></main>;

  return <main className="min-h-screen bg-[#f4f7f6] p-5 text-[#14231f] md:p-10">
    <div className="mx-auto max-w-7xl">
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-teal-700">Platform administration</p><h1 className="mt-2 text-3xl font-bold">Accounts and payments</h1><p className="mt-2 text-sm text-slate-600">Direct Vozon customers, their payment history and automatically issued invoices.</p></div><div className="flex gap-4 text-sm"><Link className="text-teal-700 underline" href="/platform-admin/white-label">White label accounts</Link><Link className="text-teal-700 underline" href="/dashboard/agents">Dashboard</Link></div></header>
      {error && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <form className="mb-5 flex gap-2" onSubmit={(event: FormEvent) => { event.preventDefault(); setPage(1); setSearch(query.trim()); setDetail(null); }}><input aria-label="Search accounts" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm" onChange={(event) => setQuery(event.target.value)} placeholder="Search company, workspace or owner email" value={query} /><button className="rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white">Search</button></form>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,.85fr)]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 p-5"><h2 className="font-bold">Customer accounts <span className="text-sm font-normal text-slate-500">({result?.total ?? 0})</span></h2></div><div className="divide-y divide-slate-100">{result?.accounts.map((account) => <button className={`w-full p-5 text-left hover:bg-teal-50 ${detail?.organization._id === account._id ? "bg-teal-50" : ""}`} key={account._id} onClick={() => void selectAccount(account._id)}><div className="flex justify-between gap-4"><div><h3 className="font-semibold">{account.name}</h3><p className="mt-1 text-xs text-slate-500">{account.owner?.email || account.slug}</p></div><span className="text-xs text-slate-500">{account.invoiceCount} invoices</span></div><div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600"><span>Wallet: {account.wallet?.balanceCredits?.toFixed(2) ?? "—"} credits</span><span>Last invoice: {account.lastInvoice ? `${account.lastInvoice.status} · ${money(account.lastInvoice.amountPaid || account.lastInvoice.amountDue, account.lastInvoice.currency.toUpperCase())}` : "None"}</span></div></button>)}{result?.accounts.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No matching accounts.</p>}</div><div className="flex items-center justify-between border-t border-slate-200 p-4 text-sm"><button className="text-teal-700 disabled:text-slate-300" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page}</span><button className="text-teal-700 disabled:text-slate-300" disabled={!result || page * result.limit >= result.total} onClick={() => setPage(page + 1)}>Next</button></div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">{detail ? <><h2 className="text-xl font-bold">{detail.organization.name}</h2><p className="mt-1 text-sm text-slate-500">{detail.owner?.name} · {detail.owner?.email}</p><div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm"><h3 className="font-semibold">Billing details</h3><p className="mt-2 whitespace-pre-wrap text-slate-600">{[detail.organization.billingProfile?.address, detail.organization.billingProfile?.state, detail.organization.billingProfile?.postalCode, detail.organization.billingProfile?.country].filter(Boolean).join(", ") || "No billing address saved"}</p><p className="mt-2 text-slate-600">Phone: {detail.organization.billingProfile?.phone || "—"}</p><p className="mt-1 text-slate-600">GSTIN: {detail.organization.billingProfile?.gstin || "—"}</p></div><h3 className="mt-6 font-bold">Invoices</h3><div className="mt-2 max-h-80 divide-y divide-slate-100 overflow-auto">{detail.invoices.map((invoice) => <div className="flex items-center justify-between gap-3 py-3 text-sm" key={invoice._id}><div><p className="font-semibold">{invoice.invoiceNumber || invoice._id}</p><p className="text-xs text-slate-500">{new Date(invoice.createdAt).toLocaleDateString()} · {invoice.status} · {money(invoice.amountPaid || invoice.amountDue, invoice.currency.toUpperCase())}</p></div><button className="text-xs font-semibold text-teal-700 underline" onClick={() => void openInvoice(invoice._id)}>Download invoice</button></div>)}{detail.invoices.length === 0 && <p className="py-4 text-sm text-slate-500">No invoices yet. Invoices are created after verified payments.</p>}</div><h3 className="mt-6 font-bold">Payment ledger</h3><div className="mt-2 max-h-60 divide-y divide-slate-100 overflow-auto">{detail.transactions.map((transaction) => <div className="py-3 text-xs" key={transaction._id}><p className="font-semibold">{transaction.description}</p><p className="mt-1 text-slate-500">{new Date(transaction.createdAt).toLocaleString()} · {transaction.amountCredits} credits · {transaction.razorpayPaymentId || "Internal"}</p></div>)}{detail.transactions.length === 0 && <p className="py-4 text-sm text-slate-500">No payment transactions yet.</p>}</div></> : <div className="grid min-h-80 place-items-center text-center text-sm text-slate-500">Select an account to see its billing details and payments.</div>}</section>
      </div>
    </div>
  </main>;
}
