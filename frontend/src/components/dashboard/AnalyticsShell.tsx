"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import { voiceApi, type AnalyticsOverview, type BackendAgent } from "@/lib/voice";

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function duration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function number(value: number) {
  return new Intl.NumberFormat("en-US", { notation: value >= 10000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}

function Breakdown({
  title,
  items,
  total,
}: {
  title: string;
  items: { label: string; value: number }[];
  total: number;
}) {
  const colors = ["bg-blue-600", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-slate-500"];
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="m-0 text-sm font-semibold text-slate-950">{title}</h2>
      <div className="mt-5 grid gap-4">
        {items.length ? items.map((item, index) => {
          const percent = total ? Math.round((item.value / total) * 100) : 0;
          return (
            <div className="grid gap-2" key={item.label}>
              <div className="flex items-center justify-between gap-3 text-xs"><span className="font-medium capitalize text-slate-600">{item.label}</span><strong className="text-slate-950">{item.value} / {percent}%</strong></div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${colors[index % colors.length]}`} style={{ width: `${percent}%` }} /></div>
            </div>
          );
        }) : <p className="m-0 text-sm text-slate-500">No calls in this range.</p>}
      </div>
    </article>
  );
}

export function AnalyticsShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [days, setDays] = useState(30);
  const [agentId, setAgentId] = useState("");
  const [agents, setAgents] = useState<BackendAgent[]>([]);
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [analytics, agentResult] = await Promise.all([
        voiceApi.analytics({ days, agentId }),
        voiceApi.agents(),
      ]);
      setData(analytics);
      setAgents(agentResult.agents);
      setNotice("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load analytics.");
    } finally {
      setLoading(false);
    }
  }, [agentId, days]);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/analytics");
      return;
    }
    void validateStoredSession();
    const initial = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(), 30000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [load, router, session]);

  const maxCalls = useMemo(() => Math.max(1, ...(data?.timeSeries.map((item) => item.calls) ?? [1])), [data]);

  if (!session) return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold">Loading analytics</main>;

  const summary = data?.summary;
  return (
    <main className="grid min-h-screen bg-[#f4f7fb] text-slate-950 lg:grid-cols-[64px_minmax(0,1fr)]">
      <DashboardSidebar activeLabel="Analytics" userInitials={initials(session.name)} onLogout={() => void logoutSession().then(() => router.replace("/login"))} />
      <section className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto grid max-w-7xl gap-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Live call intelligence</span><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Analytics</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Tenant-scoped performance and provider usage calculated from real call records.</p></div>
            <div className="flex flex-wrap gap-2">
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold" value={agentId} onChange={(event) => setAgentId(event.target.value)}><option value="">All agents</option>{agents.map((agent) => <option key={agent._id} value={agent._id}>{agent.name}</option>)}</select>
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold" value={days} onChange={(event) => setDays(Number(event.target.value))}>{[7, 30, 90, 365].map((value) => <option key={value} value={value}>Last {value} days</option>)}</select>
              <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" type="button" onClick={() => void load()}>{loading ? "Updating..." : "Refresh"}</button>
            </div>
          </header>
          {notice ? <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{notice}</div> : null}

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Total calls", number(summary?.totalCalls ?? 0), `${summary?.activeCalls ?? 0} active now`],
              ["Completion rate", `${summary?.completionRate ?? 0}%`, `${summary?.completedCalls ?? 0} completed`],
              ["Talk time", duration(summary?.totalDurationSeconds ?? 0), `${duration(summary?.averageDurationSeconds ?? 0)} average`],
              ["Response latency", `${summary?.averageLatencyMs ?? 0} ms`, "Average across responses"],
              ["LLM tokens", number(summary?.llmTokens ?? 0), "Captured by agent worker"],
              ["STT audio", duration(Math.round(summary?.sttSeconds ?? 0)), "Processed caller audio"],
              ["TTS characters", number(summary?.ttsCharacters ?? 0), "Synthesized speech"],
              ["Recorded cost", `$${(summary?.totalCost ?? 0).toFixed(2)}`, "Provider cost records"],
            ].map(([label, value, detail]) => (
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={label}><span className="text-xs font-medium text-slate-500">{label}</span><strong className="mt-2 block text-2xl font-semibold tracking-tight">{value}</strong><span className="mt-1 block text-xs text-slate-500">{detail}</span></article>
            ))}
          </section>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3"><div><h2 className="m-0 text-sm font-semibold">Call volume</h2><p className="mt-1 text-xs text-slate-500">Daily total and completed conversations</p></div><span className="text-xs font-medium text-slate-500">{data?.timeSeries.length ?? 0} active days</span></div>
            <div className="mt-6 flex min-h-64 items-end gap-1 overflow-x-auto border-b border-slate-200 px-1">
              {data?.timeSeries.length ? data.timeSeries.map((item) => (
                <div className="group grid min-w-8 flex-1 place-items-end gap-2" key={item.date} title={`${item.date}: ${item.calls} calls, ${item.completed} completed`}>
                  <div className="relative flex h-52 w-full max-w-12 items-end overflow-hidden rounded-t-lg bg-blue-100"><div className="w-full rounded-t-lg bg-blue-600 transition group-hover:bg-violet-600" style={{ height: `${Math.max(4, (item.calls / maxCalls) * 100)}%` }} /></div>
                  <span className="w-12 -rotate-45 truncate text-[10px] text-slate-500">{item.date.slice(5)}</span>
                </div>
              )) : <div className="grid h-64 w-full place-items-center text-sm text-slate-500">Start calls to populate the timeline.</div>}
            </div>
          </article>

          <section className="grid gap-4 lg:grid-cols-2">
            <Breakdown title="Call status" items={data?.statusBreakdown ?? []} total={summary?.totalCalls ?? 0} />
            <Breakdown title="Call direction" items={data?.directionBreakdown ?? []} total={summary?.totalCalls ?? 0} />
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5"><h2 className="m-0 text-sm font-semibold">Agent performance</h2></div>
              <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr>{["Agent", "Calls", "Completed", "Rate", "Talk time", "Latency"].map((item) => <th className="px-4 py-3" key={item}>{item}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{data?.agentPerformance.map((agent) => <tr key={agent.agentId}><td className="px-4 py-4 text-sm font-semibold">{agent.name}</td><td className="px-4 py-4 text-sm">{agent.calls}</td><td className="px-4 py-4 text-sm">{agent.completed}</td><td className="px-4 py-4 text-sm">{agent.calls ? Math.round(agent.completed / agent.calls * 100) : 0}%</td><td className="px-4 py-4 text-sm">{duration(agent.durationSeconds)}</td><td className="px-4 py-4 text-sm">{agent.averageLatencyMs} ms</td></tr>)}</tbody></table></div>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="m-0 text-sm font-semibold">Provider usage</h2>
              <div className="mt-4 grid gap-3">{data?.providerUsage.length ? data.providerUsage.map((usage, index) => <div className="rounded-xl border border-slate-200 bg-slate-50 p-4" key={`${usage.providers.llm}-${usage.providers.stt}-${index}`}><strong className="block text-sm">{usage.providers.llm || "No LLM usage"} / {usage.providers.stt || "No STT usage"} / {usage.providers.tts || "No TTS usage"}</strong><span className="mt-2 block text-xs leading-5 text-slate-500">{number(usage.llmTokens)} tokens / {duration(Math.round(usage.sttSeconds))} STT / {number(usage.ttsCharacters)} TTS chars</span></div>) : <p className="text-sm text-slate-500">Provider usage appears after an agent call.</p>}</div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
