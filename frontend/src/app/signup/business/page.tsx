"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { billingApi } from "@/lib/billing";
import { getSession, validateStoredSession } from "@/lib/auth";

type BusinessField = "companyName" | "phone" | "country" | "address" | "state" | "postalCode" | "gstin";
const fields: Array<{ key: BusinessField; label: string; required: boolean }> = [
  { key: "companyName", label: "Company name", required: true },
  { key: "phone", label: "Phone number", required: true },
  { key: "country", label: "Country", required: true },
  { key: "address", label: "Billing address", required: true },
  { key: "state", label: "State / Province", required: true },
  { key: "postalCode", label: "Postal code", required: true },
  { key: "gstin", label: "GSTIN (optional, India)", required: false },
];

function BusinessSignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("next");
  const next = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard/agents";
  const [business, setBusiness] = useState({ companyName: "", phone: "", country: "India", address: "", state: "", postalCode: "", gstin: "" });
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getSession()) { router.replace(`/login?mode=register&next=${encodeURIComponent(next)}`); return; }
    void validateStoredSession().then((session) => {
      if (!session) { router.replace(`/login?mode=register&next=${encodeURIComponent(next)}`); return; }
      if (!session.organization?.businessDetailsRequired) { router.replace(next); return; }
      void billingApi.summary()
        .then((summary) => setBusiness((current) => ({ ...current, ...summary.billingProfile, country: summary.billingProfile?.country || current.country, companyName: summary.billingProfile?.companyName || session.organization?.name || "" })))
        .catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load billing details."));
    }).catch((caught) => setError(caught instanceof Error ? caught.message : "Could not verify your session."));
  }, [next, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accepted) { setError("Agree to the Terms of Service and Privacy Policy to continue."); return; }
    setBusy(true); setError("");
    try {
      await billingApi.updateBillingProfile({ ...business, completeOnboarding: true, termsAccepted: true });
      await validateStoredSession({ force: true });
      router.replace(next);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save business details."); setBusy(false); }
  }

  return <main className="min-h-screen bg-[#f7f9f8] p-5 text-[#14231f]"><div className="mx-auto max-w-lg rounded-2xl border border-[#dce7e3] bg-white p-6 shadow-sm sm:mt-10 sm:p-9"><p className="text-xs font-bold uppercase tracking-wider text-teal-700">Account details</p><h1 className="mt-3 text-2xl font-bold">Tell us about your business</h1><p className="mt-2 text-sm text-slate-600">We use these details for your account and future invoices.</p><form className="mt-7 grid gap-4" onSubmit={submit}>{fields.map(({ key, label, required }) => <label className="grid gap-1.5 text-xs font-semibold text-slate-700" key={key}>{label}{required ? " *" : ""}<input className="min-h-12 rounded-xl border border-slate-200 px-4 text-sm" autoComplete={key === "country" ? "country-name" : undefined} maxLength={key === "address" ? 500 : key === "companyName" || key === "state" ? 100 : key === "country" ? 80 : key === "phone" ? 30 : key === "postalCode" ? 20 : 15} onChange={(event) => setBusiness((current) => ({ ...current, [key]: event.target.value }))} required={required} type={key === "phone" ? "tel" : "text"} value={business[key]} /></label>)}<label className="mt-2 flex items-start gap-2 text-xs text-slate-600"><input checked={accepted} className="mt-0.5 size-4 accent-teal-700" onChange={(event) => setAccepted(event.target.checked)} type="checkbox" /><span>I agree to the <Link className="text-teal-700 underline" href="/terms" target="_blank">Terms of Service</Link> and <Link className="text-teal-700 underline" href="/privacy" target="_blank">Privacy Policy</Link>.</span></label>{error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}<button className="min-h-12 rounded-xl bg-teal-700 font-semibold text-white disabled:opacity-60" disabled={busy} type="submit">{busy ? "Saving…" : "Continue"}</button></form></div></main>;
}

export default function BusinessSignupPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center">Loading signup…</main>}><BusinessSignupForm /></Suspense>;
}
