"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  Area as ReArea,
  AreaChart,
  Bar as ReBar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line as ReLine,
  Pie as RePie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AgentSummary, AnalyticsOverview } from "@/lib/voice";

const COLORS = [
  "#6468ff",
  "#5057e5",
  "#a855f7",
  "#f59e0b",
  "#ef5d7a",
  "#2ca9ff",
];
const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #dfe1ef",
  borderRadius: 12,
  boxShadow: "0 18px 48px rgba(39,45,94,.16)",
  color: "#111827",
  fontSize: 12,
};
const axis = { fill: "#676773", fontSize: 10, fontWeight: 500 };

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
function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`min-w-0 overflow-hidden bg-white p-5 sm:p-6 ${className}`}
    >
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold tracking-[-.01em] text-[#171923]">
          {title}
        </h2>
        <p className="mt-1 text-xs leading-5 text-[#676773]">{subtitle}</p>
      </div>
      {children}
    </article>
  );
}

function EmptyChart() {
  return (
    <div className="grid h-[260px] place-items-center rounded-xl border border-dashed border-[#dfe1ef] bg-[#fafaff] text-xs text-[#8a8da0]">
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
    <div className="min-w-56 rounded-xl border border-[#dfe1ef] bg-white p-3 shadow-[0_18px_48px_rgba(39,45,94,.16)]">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-sm">{row.fullName}</strong>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${row.active ? "bg-[#eff0ff] text-[#454bd3]" : row.status === "Live" ? "bg-emerald-50 text-emerald-700" : row.status === "Paused" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}
        >
          {row.active ? "On a call" : row.status}
        </span>
      </div>
      <span className="mt-1 block text-xs text-[#8a8da0]">
        {row.phone || "No phone route"}
      </span>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <span className="rounded-lg bg-[#fbfbff] p-2 text-[#686c7e]">
          Total<strong className="mt-1 block text-sm">{row.calls}</strong>
        </span>
        <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
          Completed
          <strong className="mt-1 block text-sm">{row.completed}</strong>
        </span>
        <span className="rounded-lg bg-rose-50 p-2 text-rose-700">
          Not completed
          <strong className="mt-1 block text-sm">{row.incomplete}</strong>
        </span>
        <span className="rounded-lg bg-[#eff0ff] p-2 text-[#454bd3]">
          Success rate
          <strong className="mt-1 block text-sm">{row.completion}%</strong>
        </span>
      </div>
      <span className="mt-3 block text-xs text-[#676773]">
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
  const chartHeight = Math.max(360, chartRows.length * 43);
  const liveCount = agents.filter((agent) => agent.status === "Live").length;
  const routedCount = agents.filter((agent) => Boolean(agent.phone)).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#dfe1ef] bg-white shadow-[0_14px_38px_rgba(52,58,116,.07)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e7ef] px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#6468ff] shadow-[0_0_0_4px_rgba(100,104,255,.12)]" />
            <h2 className="text-[15px] font-semibold">Agent performance</h2>
          </div>
          <p className="mt-1 text-xs text-[#676773]">
            Compare every agent by completed conversations, volume, routing, and
            live availability.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
            {liveCount} live
          </span>
          <span className="rounded-full bg-[#eff0ff] px-3 py-1.5 text-[#454bd3]">
            {activeAgentIds.length} on calls
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">
            {routedCount}/{agents.length} routed
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-5 border-b border-[#ececf3] bg-[#fafaff] px-5 py-3 text-xs text-[#686c7e]">
        <span className="inline-flex items-center gap-2">
          <i className="size-2.5 rounded-sm bg-gradient-to-r from-[#6468ff] via-[#a855f7] to-[#22c98f]" />
          Completed · unique agent colour
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="size-2.5 rounded-sm bg-[#ef5d7a]" />
          Not completed
        </span>
        <span className="ml-auto hidden text-[#8a8da0] sm:block">
          Sorted by active call, then call volume
        </span>
      </div>
      {!chartRows.length ? (
        <div className="grid h-80 place-items-center text-sm text-[#8a8da0]">
          Agent performance appears when the workspace is ready.
        </div>
      ) : (
        <div className="max-h-[680px] overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-5">
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartRows}
                layout="vertical"
                margin={{ top: 4, right: 28, bottom: 8, left: 20 }}
                barCategoryGap="28%"
              >
                <CartesianGrid stroke="#ececf4" horizontal={false} />
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
                  width={164}
                  tick={{ ...axis, fill: "#454958", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={<AgentPerformanceTooltip />}
                  cursor={{ fill: "rgba(100,104,255,.045)" }}
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  stackId="calls"
                  radius={[7, 0, 0, 7]}
                >
                  {chartRows.map((row) => (
                    <Cell key={row.id} fill={row.color} />
                  ))}
                </Bar>
                <Bar
                  dataKey="incomplete"
                  name="Not completed"
                  stackId="calls"
                  fill="#ef5d7a"
                  radius={[0, 7, 7, 0]}
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
  const sentiment = data.sentimentBreakdown.map((row) => ({
    name: row.label,
    calls: row.value,
  }));
  const hourlyData = data.hourlyActivity.map((row) => ({
    ...row,
    label: `${String(row.hour).padStart(2, "0")}:00`,
  }));
  const focus = !hasCalls
    ? {
        label: "Getting started",
        title: "Your performance view is ready for the first calls",
        body: "Run a test call or launch a campaign. Trends and agent comparisons will populate automatically.",
      }
    : data.summary.completionRate >= 85
      ? {
          label: "Strong signal",
          title: `${data.summary.completionRate}% completion across this period`,
          body: "Delivery is healthy. Compare agents below to find the scripts and routes worth scaling.",
        }
      : {
          label: "Focus next",
          title: `${data.summary.failedCalls} conversations need review`,
          body: "Open Call Logs and start with the largest failed-call group to improve completion fastest.",
        };
  const averageDuration =
    data.summary.averageDurationSeconds ||
    data.summary.totalDurationSeconds / Math.max(1, data.summary.totalCalls);
  const periodMetrics = [
    {
      label: "Total calls",
      value: Math.round(data.summary.totalCalls).toLocaleString("en-IN"),
      tone: "text-[#171923]",
    },
    {
      label: "Completion",
      value: `${data.summary.completionRate}%`,
      tone: "text-[#5057e5]",
    },
    {
      label: "Talk time",
      value: periodDuration(data.summary.totalDurationSeconds),
      detail: `${periodDuration(averageDuration)} avg`,
      tone: "text-[#171923]",
    },
    {
      label: "Active now",
      value: Math.round(data.summary.activeCalls).toLocaleString("en-IN"),
      tone: "text-emerald-600",
    },
    {
      label: "Needs review",
      value: Math.round(data.summary.failedCalls).toLocaleString("en-IN"),
      tone: "text-[#d94f6d]",
    },
    {
      label: days === 1 ? "Today average" : "Daily average",
      value: Math.round(
        data.summary.totalCalls / Math.max(1, days),
      ).toLocaleString("en-IN"),
      tone: "text-[#171923]",
    },
  ];

  return (
    <section className="mt-5 space-y-5 text-[#171923]">
      <section className="overflow-hidden rounded-2xl border border-[#dfe1ef] bg-white shadow-[0_14px_38px_rgba(52,58,116,.07)]">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#5057e5]">
              Conversation intelligence
            </span>
            <h2 className="mt-1 text-lg font-semibold tracking-[-.02em]">
              Performance overview
            </h2>
            <p className="mt-1 text-xs leading-5 text-[#676773]">
              Follow demand, outcomes, customer behaviour, and operating
              patterns from one connected view.
            </p>
          </div>
          <span className="rounded-full bg-[#eff0ff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#5057e5]">
            Live workspace data
          </span>
        </div>

        <div className="grid grid-cols-2 border-t border-[#e5e7ef] bg-[#fafaff] sm:grid-cols-3 xl:grid-cols-6">
          {periodMetrics.map((metric, index) => (
            <div
              className={`px-5 py-3.5 ${index % 2 ? "border-l" : ""} border-b border-[#e5e7ef] sm:border-l sm:[&:nth-child(3n+1)]:border-l-0 xl:border-b-0 xl:[&:nth-child(3n+1)]:border-l xl:first:border-l-0`}
              key={metric.label}
            >
              <span className="block text-[10px] font-semibold uppercase tracking-[.12em] text-[#676773]">
                {metric.label}
              </span>
              <strong
                className={`mt-1 block text-lg font-semibold tracking-[-.025em] ${metric.tone}`}
              >
                {loading ? "—" : metric.value}
              </strong>
              {"detail" in metric && metric.detail ? (
                <span className="mt-0.5 block text-[10px] text-[#8a8da0]">
                  {metric.detail}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="grid gap-px border-t border-[#e5e7ef] bg-[#e5e7ef] xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,.75fr)]">
          <ChartCard
            title="Conversation momentum"
            subtitle="Total demand compared with completed calls"
          >
            {!timeline.length ? (
              <EmptyChart />
            ) : (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={timeline}
                    margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="callsArea"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0"
                          stopColor="#6468ff"
                          stopOpacity={0.32}
                        />
                        <stop
                          offset="1"
                          stopColor="#6468ff"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#ececf4" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={axis}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={axis} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#6b6f82" }} />
                    <Area
                      type="monotone"
                      dataKey="calls"
                      name="Total calls"
                      stroke="#6468ff"
                      strokeWidth={2.5}
                      fill="url(#callsArea)"
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      name="Completed"
                      stroke="#5057e5"
                      strokeWidth={2.2}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
          <ChartCard title="Call outcomes" subtitle="How conversations ended">
            {!hasCalls ? (
              <EmptyChart />
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={outcomes}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="48%"
                      innerRadius={56}
                      outerRadius={88}
                      paddingAngle={4}
                      cornerRadius={6}
                    >
                      {outcomes.map((row, index) => (
                        <Cell
                          key={row.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: 11,
                        textTransform: "capitalize",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-3 rounded-xl border border-[#dfe1ef] bg-[#f8f8fe] p-4">
              <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5057e5]">
                {focus.label}
              </span>
              <strong className="mt-2 block text-sm leading-5">
                {focus.title}
              </strong>
              <p className="mt-1 text-xs leading-5 text-[#6f7284]">
                {focus.body}
              </p>
            </div>
          </ChartCard>
        </div>

        <details open className="group border-t border-[#e5e7ef] bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden">
            <div>
              <h2 className="text-[15px] font-semibold">Advanced analysis</h2>
              <p className="mt-1 text-xs text-[#676773]">
                Channels, timing, sentiment, and conversation duration
              </p>
            </div>
            <span className="grid size-9 place-items-center rounded-lg border border-[#dfe1ef] text-lg text-[#5057e5] transition group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="grid gap-px border-t border-[#e5e7ef] bg-[#e5e7ef] lg:grid-cols-2">
            <ChartCard
              title="Channel distribution"
              subtitle="Inbound, outbound, and web demand"
            >
              {!channels.length ? (
                <EmptyChart />
              ) : (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={channels}
                      layout="vertical"
                      margin={{ left: 5, right: 25 }}
                    >
                      <CartesianGrid stroke="#ececf4" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={axis}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={axis}
                        axisLine={false}
                        tickLine={false}
                        width={65}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="calls" radius={[0, 8, 8, 0]}>
                        {channels.map((row, index) => (
                          <Cell
                            key={row.name}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
            <ChartCard
              title="Conversation length"
              subtitle="Duration distribution from recorded calls"
            >
              {!durationData.length ? (
                <EmptyChart />
              ) : (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={durationData}
                      margin={{ left: -20, right: 10 }}
                    >
                      <CartesianGrid stroke="#ececf4" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={axis}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis tick={axis} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area
                        type="monotone"
                        dataKey="calls"
                        stroke="#a855f7"
                        strokeWidth={2.5}
                        fill="#a855f7"
                        fillOpacity={0.13}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
            <ChartCard
              title="Customer sentiment"
              subtitle="Detected tone across analyzed calls"
            >
              {!sentiment.length ? (
                <EmptyChart />
              ) : (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sentiment}
                      margin={{ left: -18, right: 10 }}
                    >
                      <CartesianGrid stroke="#ececf4" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={axis}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis tick={axis} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="calls" radius={[9, 9, 0, 0]}>
                        {sentiment.map((row) => (
                          <Cell
                            key={row.name}
                            fill={
                              row.name === "positive"
                                ? "#22c98f"
                                : row.name === "negative"
                                  ? "#ef5d7a"
                                  : "#6468ff"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
            <ChartCard
              title="Hourly demand"
              subtitle="When customers reach your agents"
            >
              {!hourlyData.some((row) => row.calls) ? (
                <EmptyChart />
              ) : (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={hourlyData}
                      margin={{ left: -20, right: 10 }}
                    >
                      <CartesianGrid stroke="#ececf4" vertical={false} />
                      <XAxis
                        dataKey="label"
                        interval={2}
                        tick={axis}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis tick={axis} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar
                        dataKey="calls"
                        fill="#6468ff"
                        radius={[5, 5, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#5057e5"
                        strokeWidth={2.4}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
          </div>
        </details>
      </section>

      <AgentPerformanceCommandCenter
        data={data}
        agents={agents}
        activeAgentIds={activeAgentIds}
      />
    </section>
  );
}
