"use client";

import type { ComponentProps } from "react";
import {
  Area as ReArea,
  AreaChart,
  Bar as ReBar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line as ReLine,
  LineChart,
  Pie as RePie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AgentSummary, AnalyticsOverview } from "@/lib/voice";

const COLORS = [
  "#2563eb",
  "#059669",
  "#7c3aed",
  "#d97706",
  "#e11d48",
  "#0891b2",
];
const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #eaeaea",
  borderRadius: 8,
  boxShadow: "0 8px 24px rgba(0,0,0,.08)",
  color: "#171717",
  fontSize: 12,
};
const axis = { fill: "#71717a", fontSize: 10, fontWeight: 500 };

function Area(props: ComponentProps<typeof ReArea>) {
  return <ReArea {...props} isAnimationActive={false} />;
}
function Bar(props: ComponentProps<typeof ReBar>) {
  return <ReBar {...props} isAnimationActive={false} />;
}
function Line(props: ComponentProps<typeof ReLine>) {
  return <ReLine {...props} isAnimationActive={false} />;
}
function Pie(props: ComponentProps<typeof RePie>) {
  return <RePie {...props} isAnimationActive={false} />;
}
function EmptyChart() {
  return (
    <div className="grid h-[240px] place-items-center rounded-lg border border-dashed border-[#eaeaea] bg-[#fafafa] text-[12px] text-[#71717a]">
      Data appears after your first calls
    </div>
  );
}
function minutes(seconds: number) {
  return seconds < 60
    ? `${Math.round(seconds)}s`
    : `${Math.round(seconds / 60)}m`;
}

function periodDuration(seconds: number) {
  const totalSeconds = Math.max(0, Math.round(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  if (hours) return `${hours}h ${mins}m`;
  if (mins) return `${mins}m`;
  return `${totalSeconds}s`;
}

type AgentChartRow = {
  id: string;
  name: string;
  fullName: string;
  completed: number;
  incomplete: number;
  calls: number;
  completion: number;
  talkTime: string;
  status: AgentSummary["status"];
  active: boolean;
  phone: string;
  color: string;
};

function AgentPerformanceTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: AgentChartRow }>;
}) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className="min-w-52 rounded-lg border border-[#eaeaea] bg-white p-3 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-[12.5px] text-[#171717]">{row.fullName}</strong>
        <span className="rounded-full border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-[10px] font-medium text-[#171717]">
          {row.active ? "On a call" : row.status}
        </span>
      </div>
      <span className="mt-1 block text-[11px] text-[#71717a]">
        {row.phone || "No phone route"}
      </span>
      <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px]">
        <span className="rounded border border-[#eaeaea] bg-[#fafafa] p-2 text-[#52525b]">
          Total<strong className="mt-0.5 block text-[13px] text-[#171717]">{row.calls}</strong>
        </span>
        <span className="rounded border border-[#eaeaea] bg-[#fafafa] p-2 text-[#52525b]">
          Completed
          <strong className="mt-0.5 block text-[13px] text-[#171717]">{row.completed}</strong>
        </span>
        <span className="rounded border border-[#eaeaea] bg-[#fafafa] p-2 text-[#52525b]">
          Not completed
          <strong className="mt-0.5 block text-[13px] text-[#171717]">{row.incomplete}</strong>
        </span>
        <span className="rounded border border-[#eaeaea] bg-[#fafafa] p-2 text-[#52525b]">
          Success rate
          <strong className="mt-0.5 block text-[13px] text-[#171717]">{row.completion}%</strong>
        </span>
      </div>
      <span className="mt-2 block text-[11px] text-[#71717a]">
        Talk time: {row.talkTime}
      </span>
    </div>
  );
}

function AgentPerformanceCommandCenter({
  data,
  agents,
  activeAgentIds,
}: {
  data: AnalyticsOverview;
  agents: AgentSummary[];
  activeAgentIds: string[];
}) {
  const performance = new Map(
    data.agentPerformance.map((agent) => [agent.agentId, agent]),
  );
  const chartRows: AgentChartRow[] = agents
    .map((agent, index) => {
      const metrics = performance.get(agent._id);
      const calls = metrics?.calls ?? 0;
      const completed = metrics?.completed ?? 0;
      return {
        id: agent._id,
        name:
          agent.name.length > 22 ? `${agent.name.slice(0, 22)}…` : agent.name,
        fullName: agent.name,
        completed,
        incomplete: Math.max(0, calls - completed),
        calls,
        completion: calls ? Math.round((completed / calls) * 100) : 0,
        talkTime: minutes(metrics?.durationSeconds ?? 0),
        status: agent.status,
        active: activeAgentIds.includes(agent._id),
        phone: agent.phone,
        color: COLORS[index % COLORS.length],
      };
    })
    .sort(
      (left, right) =>
        Number(right.active) - Number(left.active) ||
        right.calls - left.calls ||
        left.fullName.localeCompare(right.fullName),
    );
  const chartHeight = Math.max(320, chartRows.length * 40);
  const liveCount = agents.filter((agent) => agent.status === "Live").length;
  const routedCount = agents.filter((agent) => Boolean(agent.phone)).length;

  return (
    <section className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eaeaea] px-4 py-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#2563eb]" />
            <h2 className="text-[13.5px] font-semibold text-[#171717]">Agent performance</h2>
          </div>
          <p className="mt-0.5 text-[11.5px] text-[#71717a]">
            Compare every agent by completed conversations, volume, routing, and live availability.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-[11px] font-medium">
          <span className="rounded-full border border-[#eaeaea] bg-[#fafafa] px-2.5 py-1 text-[#171717]">
            {liveCount} live
          </span>
          <span className="rounded-full border border-[#eaeaea] bg-[#fafafa] px-2.5 py-1 text-[#52525b]">
            {activeAgentIds.length} on calls
          </span>
          <span className="rounded-full border border-[#eaeaea] bg-[#fafafa] px-2.5 py-1 text-[#52525b]">
            {routedCount}/{agents.length} routed
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-5 border-b border-[#eaeaea] bg-[#fafafa] px-4 py-2.5 text-[11.5px] text-[#52525b]">
        <span className="inline-flex items-center gap-1.5">
          <i className="size-2.5 rounded-xs bg-[#2563eb]" />
          Completed
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="size-2.5 rounded-xs bg-[#cbd5e1]" />
          Not completed
        </span>
        <span className="ml-auto hidden text-[#71717a] sm:block">
          Sorted by active call, then call volume
        </span>
      </div>
      {!chartRows.length ? (
        <div className="grid h-64 place-items-center text-[12px] text-[#71717a]">
          Agent performance appears when the workspace is ready.
        </div>
      ) : (
        <div className="max-h-[600px] overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-4">
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartRows}
                layout="vertical"
                margin={{ top: 4, right: 24, bottom: 8, left: 16 }}
                barCategoryGap="28%"
              >
                <CartesianGrid stroke="#eaeaea" horizontal={false} />
                <XAxis
                  type="number"
                  tick={axis}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={160}
                  tick={{ ...axis, fill: "#171717", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={<AgentPerformanceTooltip />}
                  cursor={{ fill: "#f4f4f5" }}
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  stackId="calls"
                  fill="#2563eb"
                  radius={[4, 0, 0, 4]}
                />
                <Bar
                  dataKey="incomplete"
                  name="Not completed"
                  stackId="calls"
                  fill="#cbd5e1"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}

export function AdvancedAnalyticsCharts({
  data,
  agents,
  activeAgentIds,
  days,
  loading = false,
}: {
  data: AnalyticsOverview;
  agents: AgentSummary[];
  activeAgentIds: string[];
  days: number;
  loading?: boolean;
}) {
  const hasCalls = data.summary.totalCalls > 0;
  const timeline = data.timeSeries.map((row) => ({
    ...row,
    label: new Date(`${row.date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));
  const outcomes = data.statusBreakdown.map((row) => ({
    name: row.label,
    value: row.value,
  }));
  const channels = data.directionBreakdown.map((row) => ({
    name: row.label,
    calls: row.value,
  }));
  const durationData = data.durationBreakdown.map((row) => ({
    name: row.label,
    calls: row.value,
  }));
  const hourlyData = data.hourlyActivity.map((row) => ({
    ...row,
    label: `${String(row.hour).padStart(2, "0")}:00`,
  }));
  const weeklyBuckets = Array.from({ length: 4 }, (_, index) => {
    const start = Math.floor((index * timeline.length) / 4);
    const end = Math.floor(((index + 1) * timeline.length) / 4);
    const slice = timeline.slice(start, Math.max(start, end));
    const calls = slice.reduce((sum, item) => sum + item.calls, 0);
    const completed = slice.reduce((sum, item) => sum + item.completed, 0);
    return {
      label: `Week ${4 - index}`,
      calls,
      successRate: calls > 0 ? Math.round((completed / calls) * 100) : 0,
    };
  });
  const totalDirCalls = Math.max(
    1,
    channels.reduce((sum, item) => sum + item.calls, 0) || data.summary.totalCalls,
  );
  const inboundCount =
    channels.find((c) => c.name.toLowerCase().includes("in"))?.calls ?? 0;
  const outboundCount =
    channels.find((c) => c.name.toLowerCase().includes("out"))?.calls ?? 0;
  const inboundPct = ((inboundCount / totalDirCalls) * 100).toFixed(1);
  const outboundPct = ((outboundCount / totalDirCalls) * 100).toFixed(1);
  const durationColors = ["#0d9488", "#0284c7", "#f59e0b", "#e11d48", "#7c3aed", "#4f46e5"];
  const statusColors = ["#0284c7", "#f59e0b", "#0f766e", "#e11d48", "#7c3aed"];
  const averageDuration =
    data.summary.averageDurationSeconds ||
    data.summary.totalDurationSeconds / Math.max(1, data.summary.totalCalls);
  const periodMetrics = [
    {
      label: "Total calls",
      value: Math.round(data.summary.totalCalls).toLocaleString("en-IN"),
      accent: "#2563eb",
    },
    {
      label: "Completion",
      value: `${data.summary.completionRate}%`,
      accent: "#059669",
    },
    {
      label: "Talk time",
      value: periodDuration(data.summary.totalDurationSeconds),
      detail: `${periodDuration(averageDuration)} avg`,
      accent: "#7c3aed",
    },
    {
      label: "Active now",
      value: Math.round(data.summary.activeCalls).toLocaleString("en-IN"),
      accent: "#0891b2",
    },
    {
      label: "Needs review",
      value: Math.round(data.summary.failedCalls).toLocaleString("en-IN"),
      accent: "#d97706",
    },
    {
      label: days === 1 ? "Today average" : "Daily average",
      value: Math.round(
        data.summary.totalCalls / Math.max(1, days),
      ).toLocaleString("en-IN"),
      accent: "#4f46e5",
    },
  ];

  return (
    <section className="space-y-4 text-[#171717]">
      <section className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white">
        <div className="grid grid-cols-2 gap-2.5 px-4 py-3.5 sm:grid-cols-3 xl:grid-cols-6">
          {periodMetrics.map((metric) => (
            <div
              className="rounded-md border border-[#eaeaea] bg-[#fafafa] px-3.5 py-3"
              key={metric.label}
              style={{ borderTop: `2px solid ${metric.accent}` }}
            >
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#71717a]">
                <span className="size-1.5 rounded-full" style={{ background: metric.accent }} />
                {metric.label}
              </span>
              <strong className="mt-1 block text-[16px] font-semibold tracking-[-0.02em] text-[#171717]">
                {loading ? "—" : metric.value}
              </strong>
              {"detail" in metric && metric.detail ? (
                <span className="mt-0.5 block text-[10px] text-[#71717a]">
                  {metric.detail}
                </span>
              ) : null}
            </div>
          ))}
        </div>


      </section>

      {/* Trend Analysis (2x2 Grid) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-[#171717] text-white">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 12h4l3-7 4 14 3-7h4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className="text-[14px] font-semibold text-[#171717]">Trend Analysis</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-xl border border-[#eaeaea] bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-[13px] font-semibold text-[#171717]">Call Volume Trend</h3>
              <span className="rounded-full border border-[#d1fae5] bg-[#ecfdf5] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0f766e]">
                AREA CHART
              </span>
            </div>
            {!timeline.length ? (
              <EmptyChart />
            ) : (
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeline} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="totalCallsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0f766e" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="#0f766e" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="completedCallsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.18} />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#eaeaea" vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={axis} tickLine={false} axisLine={false} />
                    <YAxis tick={axis} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="calls" name="Total Calls" stroke="#0f766e" strokeWidth={2} fill="url(#totalCallsGrad)" />
                    <Area type="monotone" dataKey="completed" name="Completed" stroke="#4f46e5" strokeWidth={2} fill="url(#completedCallsGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </article>

          <article className="rounded-xl border border-[#eaeaea] bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-[13px] font-semibold text-[#171717]">Hourly Distribution</h3>
              <span className="rounded-full border border-[#e0e7ff] bg-[#eef2ff] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#4f46e5]">
                COLUMN CHART
              </span>
            </div>
            {!hourlyData.some((row) => row.calls) ? (
              <EmptyChart />
            ) : (
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#eaeaea" vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="label" interval={2} tick={axis} tickLine={false} axisLine={false} />
                    <YAxis tick={axis} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="calls" name="Calls" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </article>

          <article className="rounded-xl border border-[#eaeaea] bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-[13px] font-semibold text-[#171717]">Duration Analysis</h3>
              <span className="rounded-full border border-[#e0e7ff] bg-[#eef2ff] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#4f46e5]">
                BAR CHART
              </span>
            </div>
            {!durationData.length ? (
              <EmptyChart />
            ) : (
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={durationData} layout="vertical" margin={{ top: 4, right: 18, left: 4, bottom: 0 }}>
                    <CartesianGrid stroke="#eaeaea" horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" tick={axis} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" tick={axis} tickLine={false} axisLine={false} width={54} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="calls" name="Calls" radius={[0, 4, 4, 0]}>
                      {durationData.map((row, index) => (
                        <Cell key={row.name} fill={durationColors[index % durationColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </article>

          <article className="rounded-xl border border-[#eaeaea] bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-[13px] font-semibold text-[#171717]">Weekly Performance</h3>
              <span className="rounded-full border border-[#d1fae5] bg-[#ecfdf5] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0f766e]">
                LINE CHART
              </span>
            </div>
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyBuckets} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#eaeaea" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={axis} tickLine={false} axisLine={false} />
                  <YAxis tick={axis} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="calls" name="Total Calls" stroke="#0f766e" strokeWidth={2} dot={{ r: 3.5 }} />
                  <Line type="monotone" dataKey="successRate" name="Success Rate %" stroke="#4f46e5" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
        </div>
      </section>

      {/* Distribution & Breakdown */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-[#171717] text-white">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v9l6 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className="text-[14px] font-semibold text-[#171717]">Distribution &amp; Breakdown</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="flex flex-col justify-between rounded-xl border border-[#eaeaea] bg-white p-5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-[13px] font-semibold text-[#171717]">Call Status Distribution</h3>
              <span className="rounded-full border border-[#d1fae5] bg-[#ecfdf5] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0f766e]">
                DONUT CHART
              </span>
            </div>
            {!hasCalls ? (
              <EmptyChart />
            ) : (
              <div className="h-[190px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={outcomes}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={3}
                    >
                      {outcomes.map((row, index) => (
                        <Cell key={row.name} fill={statusColors[index % statusColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            {hasCalls ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-[#eaeaea] py-3 sm:grid-cols-2">
                {outcomes.map((row, index) => (
                  <div className="flex min-w-0 items-center justify-between gap-2 text-[11px]" key={row.name}>
                    <span className="flex min-w-0 items-center gap-2 text-[#52525b]">
                      <i
                        aria-hidden="true"
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: statusColors[index % statusColors.length] }}
                      />
                      <span className="truncate">{row.name}</span>
                    </span>
                    <strong className="shrink-0 font-semibold tabular-nums text-[#171717]">
                      {Math.round(row.value).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="mt-3 border-t border-[#eaeaea] pt-3 text-center">
              <strong className="block text-xl font-bold tracking-tight text-[#171717]">
                {loading ? "—" : Math.round(data.summary.totalCalls).toLocaleString("en-IN")}
              </strong>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#71717a]">
                TOTAL CALLS
              </span>
            </div>
          </article>

          <article className="rounded-xl border border-[#eaeaea] bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="text-[13px] font-semibold text-[#171717]">Call Direction Breakdown</h3>
              <span className="rounded-full border border-[#eaeaea] bg-[#fafafa] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#52525b]">
                PROGRESS
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-[#bae6fd] bg-[#f0f9ff] px-4 py-3">
                <span className="text-[13px] font-semibold text-[#0369a1]">Inbound</span>
                <div className="text-right">
                  <strong className="block text-base font-bold text-[#171717]">
                    {inboundCount.toLocaleString("en-IN")}
                  </strong>
                  <span className="text-[11px] font-medium text-[#71717a]">{inboundPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#ddd6fe] bg-[#f5f3ff] px-4 py-3">
                <span className="text-[13px] font-semibold text-[#6d28d9]">Outbound</span>
                <div className="text-right">
                  <strong className="block text-base font-bold text-[#171717]">
                    {outboundCount.toLocaleString("en-IN")}
                  </strong>
                  <span className="text-[11px] font-medium text-[#71717a]">{outboundPct}%</span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-[11px] font-semibold">
                  <span className="text-[#0284c7]">Inbound</span>
                  <span className="text-[#171717]">{inboundPct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#f4f4f5]">
                  <div className="h-full rounded-full bg-[#0284c7]" style={{ width: `${inboundPct}%` }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-[11px] font-semibold">
                  <span className="text-[#7c3aed]">Outbound</span>
                  <span className="text-[#171717]">{outboundPct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#f4f4f5]">
                  <div className="h-full rounded-full bg-[#7c3aed]" style={{ width: `${outboundPct}%` }} />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <AgentPerformanceCommandCenter
        data={data}
        agents={agents}
        activeAgentIds={activeAgentIds}
      />
    </section>
  );
}
