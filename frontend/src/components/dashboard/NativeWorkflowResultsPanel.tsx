"use client";

import { useEffect, useState } from "react";

import { publicVoiceMessage, voiceApi, type NativeWorkflowResult } from "@/lib/voice";

const label = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export function NativeWorkflowResultsPanel({ agentId }: { agentId: string }) {
  const [result, setResult] = useState<{ agentId: string; items: NativeWorkflowResult[]; error: string } | null>(null);

  useEffect(() => {
    let active = true;
    void voiceApi.nativeWorkflowResults(agentId)
      .then((response) => { if (active) setResult({ agentId, items: response.results, error: "" }); })
      .catch((reason: unknown) => { if (active) setResult({ agentId, items: [], error: publicVoiceMessage(reason, "Could not load workflow results.") }); });
    return () => { active = false; };
  }, [agentId]);

  const current = result?.agentId === agentId ? result : null;
  const items = current?.items ?? [];

  return (
    <section className="overflow-hidden rounded-xl border border-[#c5ded5] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce7e3] bg-[#f1f9f6] px-4 py-3.5">
        <div><h3 className="app-section-title m-0">Vozon workflow results</h3><span className="app-caption">Requests and outcomes created by this agent. API: GET /agents/{agentId}/native-results</span></div>
        <span className="app-label rounded-full border border-[#b8c8c3] bg-white px-2.5 py-1 text-[#0e6f62]">{items.length} results</span>
      </div>
      {!current ? <p className="p-4 text-sm text-[#71817d]">Loading results…</p> : null}
      {current?.error ? <p className="p-4 text-sm text-rose-700">{current.error}</p> : null}
      {current && !current.error && !items.length ? <p className="p-4 text-sm leading-6 text-[#71817d]">No results yet. Run a test conversation to verify the managed tools.</p> : null}
      {items.length ? (
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-[#e6ecea] bg-[#fafcfb] text-xs uppercase tracking-wide text-[#71817d]"><tr><th className="px-4 py-3">Type</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Requested time</th><th className="px-4 py-3">Reference</th><th className="px-4 py-3">Status</th></tr></thead>
          <tbody className="divide-y divide-[#edf0f4]">{items.map((item) => <tr key={item._id}>
            <td className="px-4 py-3"><strong className="block text-[#14231f]">{label(item.kind)}</strong><span className="text-xs text-[#71817d]">{item.summary}</span></td>
            <td className="px-4 py-3"><strong className="block text-[#14231f]">{item.contactName || "—"}</strong><span className="text-xs text-[#71817d]">{item.contactPhone}</span></td>
            <td className="px-4 py-3 text-[#40564f]">{item.scheduledForText || "—"}</td>
            <td className="px-4 py-3 font-mono text-xs text-[#40564f]">{item.reference}</td>
            <td className="px-4 py-3"><span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">{label(item.status)}</span></td>
          </tr>)}</tbody>
        </table></div>
      ) : null}
    </section>
  );
}
