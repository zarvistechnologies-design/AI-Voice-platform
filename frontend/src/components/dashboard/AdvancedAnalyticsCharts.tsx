"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  Area as ReArea, AreaChart, Bar as ReBar, BarChart, CartesianGrid, Cell, ComposedChart, Funnel as ReFunnel, FunnelChart,
  LabelList, Legend, Line as ReLine, Pie as RePie, PieChart, PolarAngleAxis, PolarGrid, Radar as ReRadar, RadarChart,
  ResponsiveContainer, Scatter as ReScatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis,
} from "recharts";

import type { AnalyticsOverview } from "@/lib/voice";

const COLORS = ["#108D82", "#108D82", "#ae64ff", "#ffb84d", "#ff6384", "#108D82"];
const tooltipStyle = { background: "#ffffff", border: "1px solid #e5e7ef", borderRadius: 8, boxShadow: "0 18px 50px rgba(35,38,72,.10)", color: "#242535", fontSize: 12 };
const axis = { fill: "#737587", fontSize: 10, fontWeight: 500 };

function Area(props: ComponentProps<typeof ReArea>) { return <ReArea {...props} isAnimationActive={false} />; }
function Bar(props: ComponentProps<typeof ReBar>) { return <ReBar {...props} isAnimationActive={false} />; }
function Funnel(props: ComponentProps<typeof ReFunnel>) { return <ReFunnel {...props} isAnimationActive={false} />; }
function Line(props: ComponentProps<typeof ReLine>) { return <ReLine {...props} isAnimationActive={false} />; }
function Pie(props: ComponentProps<typeof RePie>) { return <RePie {...props} isAnimationActive={false} />; }
function Radar(props: ComponentProps<typeof ReRadar>) { return <ReRadar {...props} isAnimationActive={false} />; }
function Scatter(props: ComponentProps<typeof ReScatter>) { return <ReScatter {...props} isAnimationActive={false} />; }

function Card({ title, subtitle, children, wide = false }: { title: string; subtitle: string; children: ReactNode; wide?: boolean }) {
  return <article className={`min-w-0 overflow-hidden rounded-xl border border-[#e5e7ef] bg-white p-5 shadow-sm [contain-intrinsic-size:auto_380px] [content-visibility:auto] transition hover:border-[#108D82]/45 ${wide ? "xl:col-span-2" : ""}`}><div className="mb-5 border-b border-[#e5e7ef] pb-4"><h2 className="text-[15px] font-semibold tracking-[-.01em] text-[#242535]">{title}</h2><p className="mt-1.5 text-[11px] leading-5 text-[#737587]">{subtitle}</p></div>{children}</article>;
}

function EmptyChart() { return <div className="grid h-[270px] place-items-center rounded-xl border border-dashed border-[#e5e7ef] text-xs text-[#737587]">Data appears after your first calls</div>; }

export function AdvancedAnalyticsCharts({ data }: { data: AnalyticsOverview }) {
  const hasCalls = data.summary.totalCalls > 0;
  const timeline = data.timeSeries.map((row) => ({ ...row, label: new Date(`${row.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }) }));
  const outcome = data.statusBreakdown.map((row) => ({ name: row.label, value: row.value }));
  const channels = data.directionBreakdown.map((row) => ({ name: row.label, calls: row.value, share: Math.round((row.value / Math.max(1, data.summary.totalCalls)) * 100) }));
  const durationData = data.durationBreakdown.map((row) => ({ name: row.label, calls: row.value }));
  const sentiment = data.sentimentBreakdown.map((row) => ({ name: row.label, calls: row.value }));
  const hourlyData = data.hourlyActivity.map((row) => ({ ...row, label: `${String(row.hour).padStart(2, "0")}:00` }));
  const agentBubbles = data.agentPerformance.map((agent, index) => ({ name: agent.name, calls: agent.calls, talkMinutes: Math.round(agent.durationSeconds / 60), completion: agent.calls ? Math.round((agent.completed / agent.calls) * 100) : 0, size: Math.max(80, agent.calls * 55), fill: COLORS[index % COLORS.length] }));
  const maxAgent = Math.max(1, ...data.agentPerformance.map((agent) => agent.calls));
  const radarData = data.agentPerformance.slice(0, 5).map((agent) => ({ agent: agent.name.length > 12 ? `${agent.name.slice(0, 12)}…` : agent.name, volumeIndex: Math.round((agent.calls / maxAgent) * 100), completionRate: agent.calls ? Math.round((agent.completed / agent.calls) * 100) : 0, durationIndex: Math.min(100, Math.round((agent.durationSeconds / Math.max(1, agent.calls) / 300) * 100)) }));
  const funnelData = [
    { name: "Total calls", value: data.summary.totalCalls, fill: COLORS[1] },
    { name: "Not failed", value: Math.max(0, data.summary.totalCalls - data.summary.failedCalls), fill: COLORS[2] },
    { name: "Completed", value: data.summary.completedCalls, fill: COLORS[0] },
  ];

  return <section className="mt-5 grid auto-flow-dense gap-5 text-[#242535] [&_.recharts-cartesian-axis-tick-value]:fill-[#737587] [&_.recharts-default-tooltip]:!bg-[#ffffff] [&_.recharts-legend-item-text]:!text-[#737587] [&_.recharts-tooltip-item]:!text-[#242535] [&_.recharts-tooltip-label]:!text-[#242535] lg:grid-cols-2 xl:grid-cols-3">
    <Card title="Conversation momentum" subtitle="Call volume and completed conversations over time" wide>
      {!timeline.length ? <EmptyChart /> : <div className="h-[330px]"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={timeline} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="callsArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#108D82" stopOpacity={.4}/><stop offset="1" stopColor="#108D82" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#e6e8f0" vertical={false}/><XAxis dataKey="label" tick={axis} tickLine={false} axisLine={false}/><YAxis tick={axis} tickLine={false} axisLine={false}/><Tooltip contentStyle={tooltipStyle}/><Legend wrapperStyle={{ fontSize: 11, opacity: .7 }}/><Area type="monotone" dataKey="calls" name="Total calls" stroke="#108D82" strokeWidth={2.5} fill="url(#callsArea)"/><Line type="monotone" dataKey="completed" name="Completed" stroke="#108D82" strokeWidth={2.2} dot={false}/></ComposedChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Outcome intelligence" subtitle="How your conversations ended">
      {!hasCalls ? <EmptyChart /> : <div className="h-[330px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={outcome} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={65} outerRadius={105} paddingAngle={4} cornerRadius={6}>{outcome.map((row, index) => <Cell key={row.name} fill={COLORS[index % COLORS.length]}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/><Legend iconType="circle" wrapperStyle={{ fontSize: 11, textTransform: "capitalize" }}/></PieChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Agent opportunity map" subtitle="Bubble size = volume · position = engagement and completion" wide>
      {!agentBubbles.length ? <EmptyChart /> : <div className="h-[330px]"><ResponsiveContainer width="100%" height="100%"><ScatterChart margin={{ top: 15, right: 20, bottom: 15, left: -10 }}><CartesianGrid stroke="#e6e8f0"/><XAxis type="number" dataKey="talkMinutes" name="Talk time" unit="m" tick={axis} tickLine={false}/><YAxis type="number" dataKey="completion" name="Completion" unit="%" domain={[0,100]} tick={axis} tickLine={false}/><ZAxis type="number" dataKey="size" range={[90,650]}/><Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={tooltipStyle}/><Scatter data={agentBubbles}>{agentBubbles.map((row) => <Cell key={row.name} fill={row.fill} fillOpacity={.76}/>)}</Scatter></ScatterChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Call journey funnel" subtitle="From attempted calls to completed conversations">
      {!hasCalls ? <EmptyChart /> : <div className="h-[330px]"><ResponsiveContainer width="100%" height="100%"><FunnelChart><Tooltip contentStyle={tooltipStyle}/><Funnel dataKey="value" data={funnelData} isAnimationActive><LabelList position="right" fill="#e6e8f0" stroke="none" dataKey="name" fontSize={11}/></Funnel></FunnelChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Channel distribution" subtitle="Compare inbound, outbound and web demand">
      {!channels.length ? <EmptyChart /> : <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={channels} layout="vertical" margin={{ left: 5, right: 25 }}><CartesianGrid stroke="#e6e8f0" horizontal={false}/><XAxis type="number" tick={axis} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" tick={axis} axisLine={false} tickLine={false} width={65}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="calls" name="Calls" radius={[0,8,8,0]}>{channels.map((row, index) => <Cell key={row.name} fill={COLORS[index % COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Conversation length" subtitle="Duration distribution from the latest recorded calls">
      {!durationData.length ? <EmptyChart /> : <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={durationData} margin={{ left: -20, right: 10 }}><defs><linearGradient id="durationArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ae64ff" stopOpacity={.55}/><stop offset="1" stopColor="#ae64ff" stopOpacity={.03}/></linearGradient></defs><CartesianGrid stroke="#e6e8f0" vertical={false}/><XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false}/><YAxis tick={axis} axisLine={false} tickLine={false}/><Tooltip contentStyle={tooltipStyle}/><Area type="monotone" dataKey="calls" stroke="#ae64ff" strokeWidth={2.5} fill="url(#durationArea)"/></AreaChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Customer sentiment" subtitle="Detected tone from the latest recorded calls">
      {!sentiment.length ? <EmptyChart /> : <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={sentiment} margin={{ left: -18, right: 10 }}><CartesianGrid stroke="#e6e8f0" vertical={false}/><XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false}/><YAxis tick={axis} axisLine={false} tickLine={false}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="calls" minPointSize={3} radius={[9,9,0,0]}>{sentiment.map((row) => <Cell key={row.name} fill={row.name === "positive" ? "#36e1a0" : row.name === "negative" ? "#ff6384" : "#108D82"}/>)}</Bar></BarChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Hourly demand pattern" subtitle="Call timing from the latest recorded calls">
      {!hourlyData.some((row) => row.calls) ? <EmptyChart /> : <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={hourlyData} margin={{ left: -20, right: 10 }}><CartesianGrid stroke="#e6e8f0" vertical={false}/><XAxis dataKey="label" interval={2} tick={axis} axisLine={false} tickLine={false}/><YAxis tick={axis} axisLine={false} tickLine={false}/><Tooltip contentStyle={tooltipStyle}/><Legend wrapperStyle={{ fontSize: 10 }}/><Bar dataKey="calls" name="Calls" fill="#108D82" radius={[5,5,0,0]}/><Line type="monotone" dataKey="completed" name="Completed" stroke="#108D82" strokeWidth={2.4} dot={false}/></ComposedChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Agent capability radar" subtitle="Indexes calculated only from real volume, completion and average duration" wide>
      {!radarData.length ? <EmptyChart /> : <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radarData} outerRadius="70%"><PolarGrid stroke="#e6e8f0"/><PolarAngleAxis dataKey="agent" tick={{ ...axis, fill: "#e6e8f0" }}/><Radar name="Relative volume" dataKey="volumeIndex" stroke="#108D82" fill="#108D82" fillOpacity={.2}/><Radar name="Completion rate" dataKey="completionRate" stroke="#108D82" fill="#108D82" fillOpacity={.18}/><Radar name="Avg duration index" dataKey="durationIndex" stroke="#ae64ff" fill="#ae64ff" fillOpacity={.14}/><Tooltip contentStyle={tooltipStyle}/><Legend wrapperStyle={{ fontSize: 10 }}/></RadarChart></ResponsiveContainer></div>}
    </Card>
  </section>;
}
