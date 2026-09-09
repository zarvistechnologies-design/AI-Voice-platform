"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { AdvancedAnalyticsCharts } from "@/components/dashboard/AdvancedAnalyticsCharts";
import { useBrand } from "@/components/branding/BrandProvider";
import { getServerSession, getSession, logoutSession, subscribeToSession, validateStoredSession } from "@/lib/auth";
import { publicVoiceMessage, voiceApi, type AnalyticsOverview } from "@/lib/voice";

const EMPTY: AnalyticsOverview = {
  range: { from: "", to: "" },
  summary: { totalCalls: 0, completedCalls: 0, failedCalls: 0, activeCalls: 0, completionRate: 0, totalDurationSeconds: 0, averageDurationSeconds: 0, averageLatencyMs: 0, llmTokens: 0, sttSeconds: 0, ttsCharacters: 0, totalCost: 0, costBreakdown: { llm: 0, stt: 0, tts: 0, telephony: 0, platform: 0 } },
  timeSeries: [], statusBreakdown: [], directionBreakdown: [], sentimentBreakdown: [], hourlyActivity: [], durationBreakdown: [], agentPerformance: [], providerUsage: [],
};

const palette = ["#5b63ff", "#5267f7", "#a855f7", "#f59e0b", "#ef5d7a"];

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
      {hovered !== null ? <div className="pointer-events-none absolute z-20 min-w-36 -translate-x-1/2 rounded-xl border border-[#e5e7ef] bg-[#ffffff]/95 p-3 shadow-2xl backdrop-blur-xl" style={{ left: `${(hovered / Math.max(1, data.length - 1)) * 100}%`, top: 4 }}><span className="block text-[10px] font-bold uppercase tracking-wider text-[#737587]">{data[hovered].date}</span><strong className="mt-2 block text-sm text-[#4d54db]">{data[hovered].calls} total calls</strong><span className="mt-1 block text-xs text-[#737587]">{data[hovered].completed} completed</span><span className="mt-1 block text-xs text-[#737587]">{duration(data[hovered].durationSeconds)} talk time</span><span className="mt-1 block text-xs text-[#737587]">{money(data[hovered].cost)} cost</span></div> : null}
      <svg className="h-72 w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Interactive call volume and completed calls trend" onPointerLeave={() => setHovered(null)} onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)); setHovered(Math.round(ratio * (data.length - 1))); }}>
        <defs><linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5b63ff" stopOpacity=".34"/><stop offset="1" stopColor="#5b63ff" stopOpacity="0"/></linearGradient></defs>
        {[20, 40, 60, 80, 100].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(255,255,255,.07)" strokeWidth=".35" />)}
        <polygon points={area} fill="url(#trend-fill)" />
        <polyline points={points} fill="none" stroke="#5b63ff" strokeWidth="1.7" vectorEffect="non-scaling-stroke" />
        <polyline points={completePoints} fill="none" stroke="#7c8cff" strokeWidth="1.4" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
        {hovered !== null ? <><line x1={(hovered / Math.max(1, data.length - 1)) * 100} x2={(hovered / Math.max(1, data.length - 1)) * 100} y1="12" y2="100" stroke="rgba(255,255,255,.35)" strokeWidth=".5" strokeDasharray="2 2"/><circle cx={(hovered / Math.max(1, data.length - 1)) * 100} cy={92 - (data[hovered].calls / max) * 72} r="1.4" fill="#ffffff" stroke="#4d54db" strokeWidth=".8" vectorEffect="non-scaling-stroke"/></> : null}
        {data.map((_, index) => <rect key={index} x={(index / data.length) * 100} y="0" width={100 / data.length} height="100" fill="transparent" />)}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-[#737587]"><span>{data[0]?.date}</span><span>{data[data.length - 1]?.date}</span></div>
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
        <div className="absolute inset-0 grid place-content-center text-center"><strong className="text-3xl font-semibold">{number(total)}</strong><span className="text-[10px] uppercase tracking-widest text-[#737587]">calls</span></div>
      </div>
      <div className="grid gap-3">{rows.length ? rows.map((row, index) => <div className="flex items-center gap-3" key={row.label}><span className="size-2.5 rounded-full" style={{ background: palette[index % palette.length] }} /><span className="flex-1 text-sm text-[#737587]">{title(row.label)}</span><strong className="text-sm">{row.value}</strong><span className="w-10 text-right text-xs text-[#737587]">{Math.round((row.value / safeTotal) * 100)}%</span></div>) : <p className="text-sm text-[#737587]">Outcome distribution appears after your first call.</p>}</div>
    </div>
  );
}

function WaveActivity({ rows }: { rows: AnalyticsOverview["timeSeries"] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const values = rows.slice(-24).map((row) => row.durationSeconds || row.calls * 60);
  const bars = values.length ? values : Array(24).fill(0);
  const max = Math.max(1, ...bars);
  return <div className="relative"><div className="flex h-20 items-center gap-1" aria-label="Conversation activity wave">{bars.map((value, i) => <button type="button" aria-label={`${duration(value)} talk time`} onPointerEnter={() => setHovered(i)} onPointerLeave={() => setHovered(null)} key={i} className="relative flex-1 rounded-full bg-gradient-to-t from-[#5267f7] to-[#5b63ff] opacity-80 transition hover:scale-x-125 hover:opacity-100" style={{ height: `${Math.max(6, (value / max) * 100)}%` }} />)}</div>{hovered !== null ? <div className="pointer-events-none absolute -top-12 z-10 -translate-x-1/2 rounded-lg border border-[#e5e7ef] bg-[#ffffff] px-3 py-2 text-xs shadow-xl" style={{ left: `${((hovered + .5) / bars.length) * 100}%` }}>{rows.slice(-24)[hovered]?.date ?? `Period ${hovered + 1}`} · {duration(bars[hovered])}</div> : null}</div>;
}

function ActivityHeatmap({ rows }: { rows: AnalyticsOverview["hourlyActivity"] }) {
  const max = Math.max(1, ...rows.map((row) => row.calls));
  return <div className="mt-5 grid grid-cols-8 gap-2 sm:grid-cols-12 xl:grid-cols-8">{(rows.length ? rows : Array.from({ length: 24 }, (_, hour) => ({ hour, calls: 0, completed: 0 }))).map((row) => <div className="group relative" key={row.hour}><div className="aspect-square rounded-md border border-[#e5e7ef] transition group-hover:scale-110 group-hover:border-[#4d54db]/50" style={{ background: row.calls ? `rgba(91,99,255,${.12 + (row.calls / max) * .76})` : "rgba(255,255,255,.025)" }} /><div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 hidden min-w-max -translate-x-1/2 rounded-lg border border-[#e5e7ef] bg-[#ffffff] px-3 py-2 text-xs shadow-xl group-hover:block"><strong>{String(row.hour).padStart(2, "0")}:00</strong><span className="mt-1 block text-[#737587]">{row.calls} calls · {row.completed} completed</span></div><span className="mt-1 block text-center text-[8px] text-[#737587]">{row.hour % 3 === 0 ? `${row.hour}:00` : ""}</span></div>)}</div>;
}

function BreakdownBars({ rows, total, colors = palette }: { rows: { label: string; value: number }[]; total: number; colors?: string[] }) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return <div className="mt-5 grid gap-4">{rows.length ? rows.map((row, index) => <div className="group" key={row.label}><div className="mb-2 flex items-center justify-between text-xs"><span className="text-[#737587] group-hover:text-[#242535]">{title(row.label)}</span><span><strong>{row.value}</strong><i className="ml-2 not-italic text-[#737587]">{Math.round((row.value / Math.max(1, total)) * 100)}%</i></span></div><div className="h-2.5 overflow-hidden rounded-full bg-[#f6f7fb]"><div className="h-full rounded-full transition-all duration-700 group-hover:brightness-125" style={{ width: `${(row.value / max) * 100}%`, background: `linear-gradient(90deg, ${colors[index % colors.length]}, ${colors[(index + 1) % colors.length]})` }} /></div></div>) : <p className="py-8 text-center text-sm text-[#737587]">Data appears after analyzed calls.</p>}</div>;
}

function CostComposition({ costs }: { costs: AnalyticsOverview["summary"]["costBreakdown"] }) {
  const rows = Object.entries(costs).map(([label, value]) => ({ label, value }));
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return <><div className="mt-6 flex h-3 overflow-hidden rounded-full bg-[#f6f7fb]">{rows.map((row, index) => <div className="group relative h-full transition hover:brightness-150" key={row.label} style={{ width: `${total ? (row.value / total) * 100 : 0}%`, background: palette[index % palette.length] }} title={`${title(row.label)}: ${money(row.value)}`} />)}</div><div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3">{rows.map((row, index) => <div className="flex items-center gap-2" key={row.label}><span className="size-2 rounded-full" style={{ background: palette[index % palette.length] }}/><span className="flex-1 text-xs text-[#737587]">{title(row.label)}</span><strong className="text-xs">{money(row.value)}</strong></div>)}</div></>;
}

export function AnalyticsShell() {
  const brand = useBrand();
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsOverview>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [showUserSidebar, setShowUserSidebar] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const sessionIdentity = session?.organization?.id ?? session?.id ?? "signed-in";
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
      const detailCacheKey = `vozon:analytics:${sessionIdentity}:${days}`;
      try {
        const cached = sessionStorage.getItem(detailCacheKey);
        if (cached) {
          const entry = JSON.parse(cached) as { expiresAt: number; data: AnalyticsOverview };
          if (entry.expiresAt > Date.now()) {
            setData(entry.data);
            setNotice("");
            return;
          }
          sessionStorage.removeItem(detailCacheKey);
        }
      } catch {
        /* analytics still loads normally when browser storage is unavailable */
      }
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
      const detailedData: AnalyticsOverview = {
        ...quickData,
        summary: { ...quickData.summary, costBreakdown: { llm: sumCost("llm"), stt: sumCost("stt"), tts: sumCost("tts"), telephony: sumCost("telephony"), platform: sumCost("platformFee") } },
        timeSeries: quickData.timeSeries.map((row) => ({ ...row, cost: dailyCost.get(row.date) ?? 0 })),
        sentimentBreakdown: countBy(["positive", "neutral", "negative"]),
        hourlyActivity,
        durationBreakdown: durationRanges.map((range) => ({ label: range.label, value: calls.filter((call) => call.durationSeconds >= range.min && call.durationSeconds < range.max).length })).filter((row) => row.value),
      };
      setData(detailedData);
      try {
        sessionStorage.setItem(detailCacheKey, JSON.stringify({ expiresAt: Date.now() + 60_000, data: detailedData }));
      } catch {
        /* ignore storage quota and privacy-mode errors */
      }
      setNotice("");
    } catch (error) { setNotice(publicVoiceMessage(error, "Could not load analytics.")); }
    finally { setLoading(false); }
  }, [days, session]);
  useEffect(() => {
    if (!session) {
      // The server snapshot is empty until the persisted session hydrates.
      if (getSession()) return;
      router.replace("/login?next=/dashboard/analytics");
      return;
    }
    void validateStoredSession();
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load, router, session]);

  const insight = useMemo(() => {
    if (!data.summary.totalCalls) return { tone: "Start here", headline: "Your analytics will become useful after the first calls", body: `Run a test call or launch a campaign. ${brand.productName} will turn the results into trends, outcomes and agent comparisons here.` };
    if (data.summary.completionRate >= 85) return { tone: "Strong performance", headline: `${data.summary.completionRate}% of calls completed successfully`, body: "Call delivery is healthy. Review your highest-volume agent and connect outcome fields to measure bookings or qualified leads next." };
    const failed = data.statusBreakdown.find((item) => item.label === "failed")?.value ?? 0;
    return { tone: "Opportunity", headline: `${failed} calls need attention in this period`, body: "Review failed calls by agent and direction. Fixing the largest failure group is the fastest way to improve completed conversations." };
  }, [brand.productName, data]);

  if (!session) return <main className="grid min-h-screen place-items-center bg-[#f7f8fc] text-sm text-[#737587]">Loading analytics…</main>;
  const s = data.summary;
  return (
    <main className={`grid min-h-screen bg-[#f7f8fc] text-[#242535] ${showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"}`}>
      <DashboardSidebar activeLabel="Analytics" userInitials={initials(session.name)} userName={session.name} userEmail={session.email} onLogout={() => void logoutSession().then(() => router.replace("/login"))} showUserSidebar={showUserSidebar} setShowUserSidebar={setShowUserSidebar} />
      <section className="min-w-0 overflow-hidden bg-white p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1540px]">
          <header className="flex flex-col justify-between gap-5 border-b border-[#e5e7ef] pb-6 sm:flex-row sm:items-end">
            <div><span className="text-[10px] font-bold uppercase tracking-[.22em] text-[#4d54db]">Workspace analytics</span><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Analytics</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#737587]">Understand demand, completed conversations, costs and which agents drive the strongest results.</p></div>
            <div className="flex items-center gap-2 rounded-xl border border-[#e5e7ef] bg-[#f6f7fb] p-1">{[1, 7, 30, 90].map((value) => <button key={value} type="button" onClick={() => setDays(value)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${days === value ? "bg-[#5b63ff] text-[#ffffff]" : "text-[#737587] hover:text-[#242535]"}`}>{value === 1 ? "Today" : `${value} days`}</button>)}</div>
          </header>
          {notice ? <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-700">{notice}</div> : null}
          <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {[
              ["Total calls", number(s.totalCalls), "Conversation demand", "↗"],
              ["Completion rate", `${s.completionRate}%`, `${number(s.completedCalls)} completed`, "✓"],
              ["Talk time", duration(s.totalDurationSeconds), `${duration(s.averageDurationSeconds)} average`, "◉"],
              ["Daily call average", number(s.totalCalls / Math.max(1, days)), `Across this ${days === 1 ? "day" : `${days}-day period`}`, "↗"],
              ["Needs review", number(s.failedCalls), "Failed conversations", "!"],
              ["Active now", number(s.activeCalls), "Live conversations", "●"],
            ].map(([label, value, detail, icon]) => <article key={label} className="group rounded-2xl border border-[#e5e7ef] bg-[#f6f7fb] p-5 shadow-sm transition hover:border-[#5b63ff]/25 hover:bg-[#f6f7fb]"><div className="flex items-center justify-between"><span className="text-xs font-medium text-[#737587]">{label}</span><span className="grid size-8 place-items-center rounded-lg bg-[#5b63ff]/10 text-sm text-[#4d54db]">{icon}</span></div><strong className="mt-5 block text-3xl font-semibold tracking-[-.04em]">{loading ? "—" : value}</strong><span className="mt-1 block text-xs text-[#737587]">{detail}</span></article>)}
          </section>
          <AdvancedAnalyticsCharts data={data} />
          <section className="hidden">
            <article className="rounded-2xl border border-[#e5e7ef] bg-[#ffffff]/85 p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-base font-semibold">Conversation trend</h2><p className="mt-1 text-xs text-[#737587]">Total demand versus completed calls</p></div><div className="flex gap-4 text-[11px] text-[#737587]"><span><i className="mr-2 inline-block size-2 rounded-full bg-[#5b63ff]"/>All calls</span><span><i className="mr-2 inline-block size-2 rounded-full bg-[#7c8cff]"/>Completed</span></div></div><TrendChart rows={data.timeSeries} /></article>
            <article className="rounded-2xl border border-[#e5e7ef] bg-[#ffffff]/85 p-5 sm:p-6"><h2 className="text-base font-semibold">Call outcomes</h2><p className="mt-1 mb-6 text-xs text-[#737587]">Where conversations finished</p><Donut rows={data.statusBreakdown} total={s.totalCalls} /></article>
          </section>
          <section className="hidden">
            <article className="rounded-2xl border border-[#5b63ff]/20 bg-white p-5 sm:p-6"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#4d54db]">{insight.tone}</span><h2 className="mt-3 text-xl font-semibold leading-7">{insight.headline}</h2><p className="mt-3 text-sm leading-6 text-[#737587]">{insight.body}</p><button className="mt-5 rounded-lg border border-[#5b63ff]/20 bg-[#5b63ff]/10 px-3 py-2 text-xs font-semibold text-[#4d54db]" type="button" onClick={() => router.push("/dashboard/calls")}>Review relevant calls →</button></article>
            <article className="rounded-2xl border border-[#e5e7ef] bg-[#ffffff]/85 p-5 sm:p-6"><h2 className="text-base font-semibold">Channel mix</h2><p className="mt-1 text-xs text-[#737587]">How customers reach your agents</p><div className="mt-6 grid gap-5">{data.directionBreakdown.length ? data.directionBreakdown.map((row, i) => <div key={row.label}><div className="mb-2 flex justify-between text-xs"><span className="text-[#737587]">{title(row.label)}</span><strong>{Math.round((row.value / Math.max(1, s.totalCalls)) * 100)}%</strong></div><div className="h-2 overflow-hidden rounded-full bg-[#f6f7fb]"><div className="h-full rounded-full" style={{ width: `${(row.value / Math.max(1, s.totalCalls)) * 100}%`, background: palette[i % palette.length] }}/></div></div>) : <p className="text-sm text-[#737587]">Channel data appears after your first call.</p>}</div></article>
            <article className="rounded-2xl border border-[#e5e7ef] bg-[#ffffff]/85 p-5 sm:p-6"><h2 className="text-base font-semibold">Conversation activity</h2><p className="mt-1 text-xs text-[#737587]">Talk-time intensity across the period</p><div className="mt-7"><WaveActivity rows={data.timeSeries} /></div><div className="mt-6 flex justify-between border-t border-[#e5e7ef] pt-4"><span className="text-xs text-[#737587]">Average call</span><strong className="text-sm">{duration(s.averageDurationSeconds)}</strong></div></article>
          </section>
          <section className="hidden">
            <article className="rounded-2xl border border-[#e5e7ef] bg-[#ffffff]/85 p-5 sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-base font-semibold">Best time to reach customers</h2><p className="mt-1 text-xs text-[#737587]">Call activity by hour of day · hover any cell</p></div><span className="rounded-lg bg-[#5b63ff]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4d54db]">24-hour map</span></div><ActivityHeatmap rows={data.hourlyActivity} /></article>
            <article className="rounded-2xl border border-[#e5e7ef] bg-[#ffffff]/85 p-5 sm:p-6"><div><h2 className="text-base font-semibold">Cost composition</h2><p className="mt-1 text-xs text-[#737587]">Where voice-agent usage spend is going</p></div><CostComposition costs={s.costBreakdown} /></article>
          </section>
          <section className="hidden">
            <article className="rounded-2xl border border-[#e5e7ef] bg-[#ffffff]/85 p-5 sm:p-6"><h2 className="text-base font-semibold">Customer sentiment</h2><p className="mt-1 text-xs text-[#737587]">Tone detected across analyzed conversations</p><BreakdownBars rows={data.sentimentBreakdown} total={data.sentimentBreakdown.reduce((sum, row) => sum + row.value, 0)} colors={["#22c98f", "#7c8cff", "#ef5d7a"]} /></article>
            <article className="rounded-2xl border border-[#e5e7ef] bg-[#ffffff]/85 p-5 sm:p-6"><h2 className="text-base font-semibold">Conversation length</h2><p className="mt-1 text-xs text-[#737587]">How long customers stay in conversation</p><BreakdownBars rows={data.durationBreakdown} total={s.totalCalls} /></article>
            <article className="rounded-2xl border border-[#e5e7ef] bg-[#ffffff]/85 p-5 sm:p-6"><h2 className="text-base font-semibold">AI usage footprint</h2><p className="mt-1 text-xs text-[#737587]">Real consumption powering your conversations</p><div className="mt-6 grid gap-4"><div className="rounded-xl border border-[#e5e7ef] bg-[#f6f7fb] p-4"><span className="text-xs text-[#737587]">Language-model tokens</span><strong className="mt-1 block text-xl">{number(s.llmTokens)}</strong></div><div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-[#e5e7ef] bg-[#f6f7fb] p-4"><span className="text-[10px] text-[#737587]">Speech processed</span><strong className="mt-1 block text-base">{duration(s.sttSeconds)}</strong></div><div className="rounded-xl border border-[#e5e7ef] bg-[#f6f7fb] p-4"><span className="text-[10px] text-[#737587]">Voice characters</span><strong className="mt-1 block text-base">{number(s.ttsCharacters)}</strong></div></div></div></article>
          </section>
          <section className="mt-4 rounded-2xl border border-[#e5e7ef] bg-[#ffffff]/85 p-5 sm:p-6"><div className="flex items-end justify-between"><div><h2 className="text-base font-semibold">Agent performance</h2><p className="mt-1 text-xs text-[#737587]">Compare volume and completed conversations</p></div><span className="text-xs text-[#737587]">Completion is shown only from real calls</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="border-b border-[#e5e7ef] text-[10px] uppercase tracking-[.16em] text-[#737587]"><tr><th className="pb-3 font-semibold">Agent</th><th className="pb-3 font-semibold">Calls</th><th className="pb-3 font-semibold">Completed</th><th className="pb-3 font-semibold">Completion</th><th className="pb-3 font-semibold">Talk time</th></tr></thead><tbody className="divide-y divide-[#e5e7ef]">{data.agentPerformance.length ? data.agentPerformance.slice(0, 6).map((agent) => { const rate = agent.calls ? Math.round((agent.completed / agent.calls) * 100) : 0; return <tr key={agent.agentId}><td className="py-4 text-sm font-semibold">{agent.name}</td><td className="py-4 text-sm text-[#737587]">{agent.calls}</td><td className="py-4 text-sm text-[#737587]">{agent.completed}</td><td className="py-4"><div className="flex items-center gap-3"><div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#f6f7fb]"><div className="h-full rounded-full bg-[#5b63ff]" style={{ width: `${rate}%` }}/></div><span className="text-xs font-semibold">{rate}%</span></div></td><td className="py-4 text-sm text-[#737587]">{duration(agent.durationSeconds)}</td></tr>; }) : <tr><td colSpan={5} className="py-10 text-center text-sm text-[#737587]">Agent comparisons appear when calls are available.</td></tr>}</tbody></table></div></section>
        </div>
      </section>
    </main>
  );
}
