"use client";

import { useEffect, useState } from "react";

import { DashboardAuthBoundary } from "@/components/dashboard/DashboardAuthBoundary";
import { getMcpConsent, respondToMcpConsent } from "@/lib/assistant";

export function ClaudeConsentPage() {
  const [requestId, setRequestId] = useState("");
  const [clientName, setClientName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [scopes, setScopes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("request_id") ?? "";
    setRequestId(value);
    if (!value) {
      setError("The Claude connection request is missing. Go back to Claude and start connecting again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!requestId) return;
    let cancelled = false;
    void getMcpConsent(requestId)
      .then((result) => {
        if (cancelled) return;
        setClientName(result.clientName);
        setWorkspaceName(result.workspaceName);
        setScopes(result.scopes);
      })
      .catch((caught: unknown) => {
        if (!cancelled) setError(caught instanceof Error ? caught.message : "Could not load the connection request.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [requestId]);

  async function decide(approved: boolean) {
    if (!requestId || busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await respondToMcpConsent(requestId, approved);
      window.location.assign(result.redirectUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not complete the connection request.");
      setBusy(false);
    }
  }

  return (
    <DashboardAuthBoundary>
      <main className="grid min-h-screen place-items-center bg-[#f4f8f6] px-4 py-10 text-[#18362e]">
        <section className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#dce9e4] bg-white shadow-[0_24px_70px_rgba(20,75,62,.11)]">
          <div className="border-b border-[#edf2ef] bg-gradient-to-br from-[#f0faf6] via-white to-[#f2f5ff] px-6 py-7 sm:px-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#eaf0ff] text-[#4e5bb8]">
              <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 3.2c-1.5 3.2-3 6.4-3 9.2a3 3 0 0 0 6 0c0-2.8-1.5-6-3-9.2Z" /><path d="M9 14.5c-2.7.1-4.2 1.5-4.2 3.1 0 1.8 2 2.8 4.6 2.8M15 14.5c2.7.1 4.2 1.5 4.2 3.1 0 1.8-2 2.8-4.6 2.8" /></svg>
            </span>
            <p className="mb-1 mt-5 text-[10px] font-bold uppercase tracking-[.16em] text-[#0e6f62]">Vozon workspace connection</p>
            <h1 className="m-0 text-2xl font-semibold tracking-[-.035em]">Connect {clientName || "Claude"}?</h1>
            <p className="mb-0 mt-2 text-sm leading-6 text-[#687b74]">Review what this Claude client will be able to access in <strong className="font-semibold text-[#34534a]">{workspaceName || "your current Vozon workspace"}</strong>.</p>
          </div>
          <div className="p-6 sm:p-8">
            {loading ? <p className="m-0 text-sm text-[#71817d]" role="status">Loading connection details…</p> : null}
            {!loading && !error ? <>
              <p className="mb-3 text-xs font-bold uppercase tracking-[.1em] text-[#70817b]">Granted workspace permissions</p>
              <ul className="m-0 space-y-3 p-0">
                {scopes.includes("vozon:read") ? <>
                  <li className="flex gap-3 text-sm leading-6 text-[#34534a]"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#eaf7f1] text-[#0e806c]" aria-hidden="true">✓</span>Inspect voice agents, prompts, greetings, and active phone routing.</li>
                  <li className="flex gap-3 text-sm leading-6 text-[#34534a]"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#eaf7f1] text-[#0e806c]" aria-hidden="true">✓</span>Retrieve call summaries, verbatim transcripts, and diagnostics.</li>
                  <li className="flex gap-3 text-sm leading-6 text-[#34534a]"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#eaf7f1] text-[#0e806c]" aria-hidden="true">✓</span>Create and configure voice agents directly through Claude conversations.</li>
                </> : <li className="text-sm text-[#a1533c]">This request contains permissions Vozon does not recognize.</li>}
              </ul>
              <p className="mb-0 mt-5 rounded-xl bg-[#f7f9f8] px-4 py-3 text-xs leading-5 text-[#71817d]">You can revoke or disconnect Claude at any time under Vozon Integrations. Access is restricted to this workspace.</p>
            </> : null}
            {error ? <p className="rounded-xl border border-[#f1d6ca] bg-[#fff8f5] px-4 py-3 text-sm leading-5 text-[#8c4d36]" role="alert">{error}</p> : null}
            <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#dce7e3] px-4 text-sm font-semibold text-[#536a62] hover:bg-[#f7f9f8] disabled:opacity-50" type="button" disabled={loading || busy || Boolean(error)} onClick={() => void decide(false)}>Deny</button>
              <button className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#126f62] px-5 text-sm font-semibold text-white transition hover:bg-[#0e5c52] disabled:cursor-not-allowed disabled:opacity-50" type="button" disabled={loading || busy || Boolean(error) || !scopes.includes("vozon:read")} onClick={() => void decide(true)}>{busy ? "Connecting…" : "Authorize workspace access"}</button>
            </div>
          </div>
        </section>
      </main>
    </DashboardAuthBoundary>
  );
}
