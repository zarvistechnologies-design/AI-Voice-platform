"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { getServerSession, getSession, logoutSession, subscribeToSession, validateStoredSession } from "@/lib/auth";
import { publicVoiceMessage, voiceApi, type AnalyticsOverview } from "@/lib/voice";

const AdvancedAnalyticsCharts = dynamic(
  () => import("@/components/dashboard/AdvancedAnalyticsCharts").then((module) => module.AdvancedAnalyticsCharts),
  { ssr: false, loading: () => <div className="mt-5 h-[360px] animate-pulse rounded-xl border border-[#29433e] bg-white/[.025]" aria-label="Loading analytics charts" /> },
);

const EMPTY: AnalyticsOverview = {
  range: { from: "", to: "" },
  summary: { totalCalls: 0, completedCalls: 0, failedCalls: 0, activeCalls: 0, completionRate: 0, totalDurationSeconds: 0, averageDurationSeconds: 0, averageLatencyMs: 0, llmTokens: 0, sttSeconds: 0, ttsCharacters: 0, totalCost: 0, costBreakdown: { llm: 0, stt: 0, tts: 0, telephony: 0, platform: 0 } },
  timeSeries: [], statusBreakdown: [], directionBreakdown: [], sentimentBreakdown: [], hourlyActivity: [], durationBreakdown: [], agentPerformance: [], providerUsage: [],
};

const palette = ["#22d3c5", "#5267f7", "#a855f7", "#f59e0b", "#ef5d7a"];

function initials(name: string) { return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
function number(value: number) { return new Intl.NumberFormat("en-US", { notation: value > 9999 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value); }
function money(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value < 10 ? 2 : 0 }).format(value); }
function duration(seconds: number) { const hours = Math.floor(seconds / 3600); const minutes = Math.floor((seconds % 3600) / 60); return hours ? `${hours}h ${minutes}m` : `${minutes}m`; }
function title(value: string) { return value ? value[0].toUpperCase() + value.slice(1) : "Other"; }

function TrendChart({ rows }: { rows: AnalyticsOverview["timeSeries"] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const data = rows.length ? rows : Array.from({ length: 14 }, (_, i) => ({ date: `Day ${i + 1}`, calls: 0, completed: 0, durationSeconds: 0, cost: 0 }));
  const max = Math.max(1, ...data.map((row) => row.calls));
  const points = data.map((row, i) => `${(i / Math.max(1, data.length - 1)) * 100},${92 - (row.calls / max) * 72}`).join(" ");
  const completePoints = data.map((row, i) => `${(i / Math.max(1, data.length - 1)) * 100},${92 - (row.completed / max) * 72}`).join(" ");
  const area = `0,100 ${points} 100,100`;
  return (
    <div className="relative mt-5">
      {hovered !== null ? <div className="pointer-events-none absolute z-20 min-w-36 -translate-x-1/2 rounded-xl border border-white/10 bg-[#101a18]/95 p-3 shadow-2xl backdrop-blur-xl" style={{ left: `${(hovered / Math.max(1, data.length - 1)) * 100}%`, top: 4 }}><span className="block text-[10px] font-bold uppercase tracking-wider text-white/35">{data[hovered].date}</span><strong className="mt-2 block text-sm text-[#61efe1]">{data[hovered].calls} total calls</strong><span className="mt-1 block text-xs text-white/55">{data[hovered].completed} completed</span><span className="mt-1 block text-xs text-white/35">{duration(data[hovered].durationSeconds)} talk time</span><span className="mt-1 block text-xs text-white/35">{money(data[hovered].cost)} cost</span></div> : null}
      <svg className="h-72 w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Interactive call volume and completed calls trend" onPointerLeave={() => setHovered(null)} onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)); setHovered(Math.round(ratio * (data.length - 1))); }}>
        <defs><linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#22d3c5" stopOpacity=".34"/><stop offset="1" stopColor="#22d3c5" stopOpacity="0"/></linearGradient></defs>
        {[20, 40, 60, 80, 100].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(255,255,255,.07)" strokeWidth=".35" />)}
        <polygon points={area} fill="url(#trend-fill)" />
        <polyline points={points} fill="none" stroke="#22d3c5" strokeWidth="1.7" vectorEffect="non-scaling-stroke" />
        <polyline points={completePoints} fill="none" stroke="#7c8cff" strokeWidth="1.4" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
        {hovered !== null ? <><line x1={(hovered / Math.max(1, data.length - 1)) * 100} x2={(hovered / Math.max(1, data.length - 1)) * 100} y1="12" y2="100" stroke="rgba(255,255,255,.35)" strokeWidth=".5" strokeDasharray="2 2"/><circle cx={(hovered / Math.max(1, data.length - 1)) * 100} cy={92 - (data[hovered].calls / max) * 72} r="1.4" fill="#07110f" stroke="#61efe1" strokeWidth=".8" vectorEffect="non-scaling-stroke"/></> : null}
        {data.map((_, index) => <rect key={index} x={(index / data.length) * 100} y="0" width={100 / data.length} height="100" fill="transparent" />)}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-white/35"><span>{data[0]?.date}</span><span>{data[data.length - 1]?.date}</span></div>
    </div>
  );
}

function Donut({ rows, total }: { rows: { label: string; value: number }[]; total: number }) {
  const safeRows = rows.length ? rows : [{ label: "No calls", value: 1 }];
  const safeTotal = total || 1;
  const segments = safeRows.map((row, index) => ({
    ...row,
    index,
    valuePercent: (row.value / safeTotal) * 100,
    offset: safeRows.slice(0, index).reduce((sum, item) => sum + (item.value / safeTotal) * 100, 0),
  }));
  return (
    <div className="grid items-center gap-6 sm:grid-cols-[180px_1fr]">
      <div className="relative mx-auto size-44">
        <svg className="size-full -rotate-90" viewBox="0 0 42 42" role="img" aria-label="Call outcome distribution">
          <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="5" />
          {segments.map((row) => <circle key={row.label} cx="21" cy="21" r="15.9" fill="none" stroke={total ? palette[row.index % palette.length] : "#23332f"} strokeWidth="5" strokeDasharray={`${row.valuePercent} ${100 - row.valuePercent}`} strokeDashoffset={-row.offset} />)}
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center"><strong className="text-3xl font-semibold">{number(total)}</strong><span className="text-[10px] uppercase tracking-widest text-white/35">calls</span></div>
      </div>
      <div className="grid gap-3">{rows.length ? rows.map((row, index) => <div className="flex items-center gap-3" key={row.label}><span className="size-2.5 rounded-full" style={{ background: palette[index % palette.length] }} /><span className="flex-1 text-sm text-white/55">{title(row.label)}</span><strong className="text-sm">{row.value}</strong><span className="w-10 text-right text-xs text-white/30">{Math.round((row.value / safeTotal) * 100)}%</span></div>) : <p className="text-sm text-white/35">Outcome distribution appears after your first call.</p>}</div>
    </div>
  );
}

function WaveActivity({ rows }: { rows: AnalyticsOverview["timeSeries"] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const values = rows.slice(-24).map((row) => row.durationSeconds || row.calls * 60);
  const bars = values.length ? values : Array(24).fill(0);
  const max = Math.max(1, ...bars);
  return <div className="relative"><div className="flex h-20 items-center gap-1" aria-label="Conversation activity wave">{bars.map((value, i) => <button type="button" aria-label={`${duration(value)} talk time`} onPointerEnter={() => setHovered(i)} onPointerLeave={() => setHovered(null)} key={i} className="relative flex-1 rounded-full bg-gradient-to-t from-[#5267f7] to-[#22d3c5] opacity-80 transition hover:scale-x-125 hover:opacity-100" style={{ height: `${Math.max(6, (value / max) * 100)}%` }} />)}</div>{hovered !== null ? <div className="pointer-events-none absolute -top-12 z-10 -translate-x-1/2 rounded-lg border border-white/10 bg-[#101a18] px-3 py-2 text-xs shadow-xl" style={{ left: `${((hovered + .5) / bars.length) * 100}%` }}>{rows.slice(-24)[hovered]?.date ?? `Period ${hovered + 1}`} · {duration(bars[hovered])}</div> : null}</div>;
}

function ActivityHeatmap({ rows }: { rows: AnalyticsOverview["hourlyActivity"] }) {
  const max = Math.max(1, ...rows.map((row) => row.calls));
  return <div className="mt-5 grid grid-cols-8 gap-2 sm:grid-cols-12 xl:grid-cols-8">{(rows.length ? rows : Array.from({ length: 24 }, (_, hour) => ({ hour, calls: 0, completed: 0 }))).map((row) => <div className="group relative" key={row.hour}><div className="aspect-square rounded-md border border-white/[.06] transition group-hover:scale-110 group-hover:border-[#61efe1]/50" style={{ background: row.calls ? `rgba(34,211,197,${.12 + (row.calls / max) * .76})` : "rgba(255,255,255,.025)" }} /><div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 hidden min-w-max -translate-x-1/2 rounded-lg border border-white/10 bg-[#101a18] px-3 py-2 text-xs shadow-xl group-hover:block"><strong>{String(row.hour).padStart(2, "0")}:00</strong><span className="mt-1 block text-white/45">{row.calls} calls · {row.completed} completed</span></div><span className="mt-1 block text-center text-[8px] text-white/25">{row.hour % 3 === 0 ? `${row.hour}:00` : ""}</span></div>)}</div>;
}

function BreakdownBars({ rows, total, colors = palette }: { rows: { label: string; value: number }[]; total: number; colors?: string[] }) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return <div className="mt-5 grid gap-4">{rows.length ? rows.map((row, index) => <div className="group" key={row.label}><div className="mb-2 flex items-center justify-between text-xs"><span className="text-white/50 group-hover:text-white">{title(row.label)}</span><span><strong>{row.value}</strong><i className="ml-2 not-italic text-white/30">{Math.round((row.value / Math.max(1, total)) * 100)}%</i></span></div><div className="h-2.5 overflow-hidden rounded-full bg-white/[.055]"><div className="h-full rounded-full transition-all duration-700 group-hover:brightness-125" style={{ width: `${(row.value / max) * 100}%`, background: `linear-gradient(90deg, ${colors[index % colors.length]}, ${colors[(index + 1) % colors.length]})` }} /></div></div>) : <p className="py-8 text-center text-sm text-white/30">Data appears after analyzed calls.</p>}</div>;
}

function CostComposition({ costs }: { costs: AnalyticsOverview["summary"]["costBreakdown"] }) {
  const rows = Object.entries(costs).map(([label, value]) => ({ label, value }));
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return <><div className="mt-6 flex h-3 overflow-hidden rounded-full bg-white/[.05]">{rows.map((row, index) => <div className="group relative h-full transition hover:brightness-150" key={row.label} style={{ width: `${total ? (row.value / total) * 100 : 0}%`, background: palette[index % palette.length] }} title={`${title(row.label)}: ${money(row.value)}`} />)}</div><div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3">{rows.map((row, index) => <div className="flex items-center gap-2" key={row.label}><span className="size-2 rounded-full" style={{ background: palette[index % palette.length] }}/><span className="flex-1 text-xs text-white/40">{title(row.label)}</span><strong className="text-xs">{money(row.value)}</strong></div>)}</div></>;
}

export function AnalyticsShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsOverview>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [showUserSidebar, setShowUserSidebar] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const from = new Date(Date.now() - (days - 1) * 86400000).toISOString();
      const overview = await voiceApi.analytics({ days });
      const quickData: AnalyticsOverview = {
        ...overview,
        summary: { ...overview.summary, costBreakdown: overview.summary.costBreakdown ?? EMPTY.summary.costBreakdown },
        timeSeries: overview.timeSeries.map((row) => ({ ...row, cost: row.cost ?? 0 })),
        sentimentBreakdown: overview.sentimentBreakdown ?? [],
        hourlyActivity: overview.hourlyActivity ?? [],
        durationBreakdown: overview.durationBreakdown ?? [],
      };
      setData(quickData);
      setLoading(false);
      const callResult = await voiceApi.calls({ from, limit: 20 });
      const calls = callResult.calls;
      const countBy = (labels: string[]) => labels.map((label) => ({ label, value: calls.filter((call) => call.sentimentLabel === label).length }));
      const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
        const matches = calls.filter((call) => new Date(call.createdAt).getHours() === hour);
        return { hour, calls: matches.length, completed: matches.filter((call) => call.status === "completed").length };
      });
      const durationRanges = [
        { label: "Under 30s", min: 0, max: 30 }, { label: "30–60s", min: 30, max: 60 },
        { label: "1–3m", min: 60, max: 180 }, { label: "3–5m", min: 180, max: 300 },
        { label: "5–15m", min: 300, max: 900 }, { label: "15m+", min: 900, max: Infinity },
      ];
      const sumCost = (key: "llm" | "stt" | "tts" | "telephony" | "platformFee") => calls.reduce((sum, call) => sum + (call.costBreakdown?.[key] ?? 0), 0);
      const dailyCost = new Map<string, number>();
      calls.forEach((call) => { const date = call.createdAt.slice(0, 10); dailyCost.set(date, (dailyCost.get(date) ?? 0) + (call.costBreakdown?.total ?? 0)); });
      setData({
        ...quickData,
        summary: { ...quickData.summary, costBreakdown: { llm: sumCost("llm"), stt: sumCost("stt"), tts: sumCost("tts"), telephony: sumCost("telephony"), platform: sumCost("platformFee") } },
        timeSeries: quickData.timeSeries.map((row) => ({ ...row, cost: dailyCost.get(row.date) ?? 0 })),
        sentimentBreakdown: countBy(["positive", "neutral", "negative"]),
        hourlyActivity,
        durationBreakdown: durationRanges.map((range) => ({ label: range.label, value: calls.filter((call) => call.durationSeconds >= range.min && call.durationSeconds < range.max).length })).filter((row) => row.value),
      });
      setNotice("");
    } catch (error) { setNotice(publicVoiceMessage(error, "Could not load analytics.")); }
    finally { setLoading(false); }
  }, [days]);
  useEffect(() => {
    if (!session) { router.replace("/login?next=/dashboard/analytics"); return undefined; }
    void validateStoredSession();
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load, router, session]);

  const insight = useMemo(() => {
    if (!data.summary.totalCalls) return { tone: "Start here", headline: "Your analytics will become useful after the first calls", body: "Run a test call or launch a campaign. Vozon will turn the results into trends, outcomes and agent comparisons here." };
    if (data.summary.completionRate >= 85) return { tone: "Strong performance", headline: `${data.summary.completionRate}% of calls completed successfully`, body: "Call delivery is healthy. Review your highest-volume agent and connect outcome fields to measure bookings or qualified leads next." };
    const failed = data.statusBreakdown.find((item) => item.label === "failed")?.value ?? 0;
    return { tone: "Opportunity", headline: `${failed} calls need attention in this period`, body: "Review failed calls by agent and direction. Fixing the largest failure group is the fastest way to improve completed conversations." };
  }, [data]);

  if (!session) return <main className="grid min-h-screen place-items-center bg-[#050908] text-sm text-white/60">Loading analytics…</main>;
  const s = data.summary;
  return (
    <main className={`grid min-h-screen bg-[#050908] text-white ${showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"}`}>
      <DashboardSidebar activeLabel="Analytics" userInitials={initials(session.name)} userName={session.name} userEmail={session.email} onLogout={() => void logoutSession().then(() => router.replace("/login"))} showUserSidebar={showUserSidebar} setShowUserSidebar={setShowUserSidebar} />
      <section className="min-w-0 overflow-hidden bg-[radial-gradient(circle_at_82%_3%,rgba(82,103,247,.14),transparent_28%),radial-gradient(circle_at_18%_0%,rgba(34,211,197,.09),transparent_24%)] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1540px]">
          <header className="flex flex-col justify-between gap-5 border-b border-white/[.08] pb-6 sm:flex-row sm:items-end">
            <div><span className="text-[10px] font-bold uppercase tracking-[.22em] text-[#5aeadc]">Performance intelligence</span><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Analytics that lead to action</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">Understand demand, completed conversations, costs and which agents drive the strongest results.</p></div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] p-1">{[1, 7, 30, 90].map((value) => <button key={value} type="button" onClick={() => setDays(value)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${days === value ? "bg-[#22d3c5] text-[#03110e]" : "text-white/50 hover:text-white"}`}>{value === 1 ? "Today" : `${value} days`}</button>)}</div>
          </header>
          {notice ? <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">{notice}</div> : null}
          <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {[
              ["Total calls", number(s.totalCalls), "Conversation demand", "↗"],
              ["Completion rate", `${s.completionRate}%`, `${number(s.completedCalls)} completed`, "✓"],
              ["Talk time", duration(s.totalDurationSeconds), `${duration(s.averageDurationSeconds)} average`, "◉"],
              ["Daily call average", number(s.totalCalls / Math.max(1, days)), `Across this ${days === 1 ? "day" : `${days}-day period`}`, "↗"],
              ["Needs review", number(s.failedCalls), "Failed conversations", "!"],
              ["Active now", number(s.activeCalls), "Live conversations", "●"],
            ].map(([label, value, detail, icon]) => <article key={label} className="group rounded-2xl border border-white/[.08] bg-white/[.035] p-5 shadow-[0_16px_60px_rgba(0,0,0,.18)] transition hover:border-[#22d3c5]/25 hover:bg-white/[.05]"><div className="flex items-center justify-between"><span className="text-xs font-medium text-white/40">{label}</span><span className="grid size-8 place-items-center rounded-lg bg-[#22d3c5]/10 text-sm text-[#5aeadc]">{icon}</span></div><strong className="mt-5 block text-3xl font-semibold tracking-[-.04em]">{loading ? "—" : value}</strong><span className="mt-1 block text-xs text-white/35">{detail}</span></article>)}
          </section>
          <AdvancedAnalyticsCharts data={data} />
          <section className="hidden">
            <article className="rounded-2xl border border-white/[.08] bg-[#09100f]/85 p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-base font-semibold">Conversation trend</h2><p className="mt-1 text-xs text-white/35">Total demand versus completed calls</p></div><div className="flex gap-4 text-[11px] text-white/45"><span><i className="mr-2 inline-block size-2 rounded-full bg-[#22d3c5]"/>All calls</span><span><i className="mr-2 inline-block size-2 rounded-full bg-[#7c8cff]"/>Completed</span></div></div><TrendChart rows={data.timeSeries} /></article>
            <article className="rounded-2xl border border-white/[.08] bg-[#09100f]/85 p-5 sm:p-6"><h2 className="text-base font-semibold">Call outcomes</h2><p className="mt-1 mb-6 text-xs text-white/35">Where conversations finished</p><Donut rows={data.statusBreakdown} total={s.totalCalls} /></article>
          </section>
          <section className="hidden">
            <article className="rounded-2xl border border-[#22d3c5]/20 bg-[linear-gradient(135deg,rgba(34,211,197,.10),rgba(82,103,247,.06))] p-5 sm:p-6"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#5aeadc]">{insight.tone}</span><h2 className="mt-3 text-xl font-semibold leading-7">{insight.headline}</h2><p className="mt-3 text-sm leading-6 text-white/45">{insight.body}</p><button className="mt-5 rounded-lg border border-[#22d3c5]/20 bg-[#22d3c5]/10 px-3 py-2 text-xs font-semibold text-[#73f4e7]" type="button" onClick={() => router.push("/dashboard/calls")}>Review relevant calls →</button></article>
            <article className="rounded-2xl border border-white/[.08] bg-[#09100f]/85 p-5 sm:p-6"><h2 className="text-base font-semibold">Channel mix</h2><p className="mt-1 text-xs text-white/35">How customers reach your agents</p><div className="mt-6 grid gap-5">{data.directionBreakdown.length ? data.directionBreakdown.map((row, i) => <div key={row.label}><div className="mb-2 flex justify-between text-xs"><span className="text-white/55">{title(row.label)}</span><strong>{Math.round((row.value / Math.max(1, s.totalCalls)) * 100)}%</strong></div><div className="h-2 overflow-hidden rounded-full bg-white/[.06]"><div className="h-full rounded-full" style={{ width: `${(row.value / Math.max(1, s.totalCalls)) * 100}%`, background: palette[i % palette.length] }}/></div></div>) : <p className="text-sm text-white/35">Channel data appears after your first call.</p>}</div></article>
            <article className="rounded-2xl border border-white/[.08] bg-[#09100f]/85 p-5 sm:p-6"><h2 className="text-base font-semibold">Conversation activity</h2><p className="mt-1 text-xs text-white/35">Talk-time intensity across the period</p><div className="mt-7"><WaveActivity rows={data.timeSeries} /></div><div className="mt-6 flex justify-between border-t border-white/[.07] pt-4"><span className="text-xs text-white/35">Average call</span><strong className="text-sm">{duration(s.averageDurationSeconds)}</strong></div></article>
          </section>
          <section className="hidden">
            <article className="rounded-2xl border border-white/[.08] bg-[#09100f]/85 p-5 sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-base font-semibold">Best time to reach customers</h2><p className="mt-1 text-xs text-white/35">Call activity by hour of day · hover any cell</p></div><span className="rounded-lg bg-[#22d3c5]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#61efe1]">24-hour map</span></div><ActivityHeatmap rows={data.hourlyActivity} /></article>
            <article className="rounded-2xl border border-white/[.08] bg-[#09100f]/85 p-5 sm:p-6"><div><h2 className="text-base font-semibold">Cost composition</h2><p className="mt-1 text-xs text-white/35">Where voice-agent usage spend is going</p></div><CostComposition costs={s.costBreakdown} /></article>
          </section>
          <section className="hidden">
            <article className="rounded-2xl border border-white/[.08] bg-[#09100f]/85 p-5 sm:p-6"><h2 className="text-base font-semibold">Customer sentiment</h2><p className="mt-1 text-xs text-white/35">Tone detected across analyzed conversations</p><BreakdownBars rows={data.sentimentBreakdown} total={data.sentimentBreakdown.reduce((sum, row) => sum + row.value, 0)} colors={["#22c98f", "#7c8cff", "#ef5d7a"]} /></article>
            <article className="rounded-2xl border border-white/[.08] bg-[#09100f]/85 p-5 sm:p-6"><h2 className="text-base font-semibold">Conversation length</h2><p className="mt-1 text-xs text-white/35">How long customers stay in conversation</p><BreakdownBars rows={data.durationBreakdown} total={s.totalCalls} /></article>
            <article className="rounded-2xl border border-white/[.08] bg-[#09100f]/85 p-5 sm:p-6"><h2 className="text-base font-semibold">AI usage footprint</h2><p className="mt-1 text-xs text-white/35">Real consumption powering your conversations</p><div className="mt-6 grid gap-4"><div className="rounded-xl border border-white/[.06] bg-white/[.025] p-4"><span className="text-xs text-white/35">Language-model tokens</span><strong className="mt-1 block text-xl">{number(s.llmTokens)}</strong></div><div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-white/[.06] bg-white/[.025] p-4"><span className="text-[10px] text-white/35">Speech processed</span><strong className="mt-1 block text-base">{duration(s.sttSeconds)}</strong></div><div className="rounded-xl border border-white/[.06] bg-white/[.025] p-4"><span className="text-[10px] text-white/35">Voice characters</span><strong className="mt-1 block text-base">{number(s.ttsCharacters)}</strong></div></div></div></article>
          </section>
          <section className="mt-4 rounded-2xl border border-white/[.08] bg-[#09100f]/85 p-5 sm:p-6"><div className="flex items-end justify-between"><div><h2 className="text-base font-semibold">Agent performance</h2><p className="mt-1 text-xs text-white/35">Compare volume and completed conversations</p></div><span className="text-xs text-white/30">Completion is shown only from real calls</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="border-b border-white/[.07] text-[10px] uppercase tracking-[.16em] text-white/30"><tr><th className="pb-3 font-semibold">Agent</th><th className="pb-3 font-semibold">Calls</th><th className="pb-3 font-semibold">Completed</th><th className="pb-3 font-semibold">Completion</th><th className="pb-3 font-semibold">Talk time</th></tr></thead><tbody className="divide-y divide-white/[.06]">{data.agentPerformance.length ? data.agentPerformance.slice(0, 6).map((agent) => { const rate = agent.calls ? Math.round((agent.completed / agent.calls) * 100) : 0; return <tr key={agent.agentId}><td className="py-4 text-sm font-semibold">{agent.name}</td><td className="py-4 text-sm text-white/55">{agent.calls}</td><td className="py-4 text-sm text-white/55">{agent.completed}</td><td className="py-4"><div className="flex items-center gap-3"><div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/[.07]"><div className="h-full rounded-full bg-[#22d3c5]" style={{ width: `${rate}%` }}/></div><span className="text-xs font-semibold">{rate}%</span></div></td><td className="py-4 text-sm text-white/55">{duration(agent.durationSeconds)}</td></tr>; }) : <tr><td colSpan={5} className="py-10 text-center text-sm text-white/35">Agent comparisons appear when calls are available.</td></tr>}</tbody></table></div></section>
        </div>
      </section>
    </main>
  );
}
