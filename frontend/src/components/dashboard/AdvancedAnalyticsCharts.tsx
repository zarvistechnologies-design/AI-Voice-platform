"use client";

import type { ReactNode } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Funnel, FunnelChart,
  LabelList, Legend, Line, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart,
  ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis,
} from "recharts";

import type { AnalyticsOverview } from "@/lib/voice";

const COLORS = ["#36e1d0", "#7182ff", "#ae64ff", "#ffb84d", "#ff6384", "#2ca9ff"];
const tooltipStyle = { background: "rgba(8,18,16,.96)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, boxShadow: "0 18px 50px rgba(0,0,0,.45)", fontSize: 12 };
const axis = { fill: "rgba(255,255,255,.34)", fontSize: 10 };

function Card({ title, subtitle, children, wide = false }: { title: string; subtitle: string; children: ReactNode; wide?: boolean }) {
  return <article className={`min-w-0 rounded-[22px] border border-white/[.08] bg-[linear-gradient(145deg,rgba(13,24,22,.95),rgba(7,13,12,.92))] p-5 shadow-[0_20px_70px_rgba(0,0,0,.22)] transition hover:border-[#36e1d0]/20 ${wide ? "xl:col-span-2" : ""}`}><div className="mb-5"><h2 className="text-sm font-semibold tracking-tight text-white">{title}</h2><p className="mt-1 text-[11px] text-white/35">{subtitle}</p></div>{children}</article>;
}

function EmptyChart() { return <div className="grid h-[270px] place-items-center rounded-xl border border-dashed border-white/[.08] text-xs text-white/25">Data appears after your first calls</div>; }

export function AdvancedAnalyticsCharts({ data }: { data: AnalyticsOverview }) {
  const hasCalls = data.summary.totalCalls > 0;
  const timeline = data.timeSeries.map((row) => ({ ...row, label: new Date(`${row.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }) }));
  const outcome = data.statusBreakdown.map((row) => ({ name: row.label, value: row.value }));
  const channels = data.directionBreakdown.map((row) => ({ name: row.label, calls: row.value, share: Math.round((row.value / Math.max(1, data.summary.totalCalls)) * 100) }));
  const durationData = data.durationBreakdown.map((row) => ({ name: row.label, calls: row.value }));
  const sentiment = data.sentimentBreakdown.map((row) => ({ name: row.label, calls: row.value }));
  const costData = Object.entries(data.summary.costBreakdown).map(([name, value], index) => ({ name, value, fill: COLORS[index] }));
  const agentBubbles = data.agentPerformance.map((agent, index) => ({ name: agent.name, calls: agent.calls, talkMinutes: Math.round(agent.durationSeconds / 60), completion: agent.calls ? Math.round((agent.completed / agent.calls) * 100) : 0, size: Math.max(80, agent.calls * 55), fill: COLORS[index % COLORS.length] }));
  const maxAgent = Math.max(1, ...data.agentPerformance.map((agent) => agent.calls));
  const radarData = data.agentPerformance.slice(0, 5).map((agent) => ({ agent: agent.name.length > 12 ? `${agent.name.slice(0, 12)}…` : agent.name, volume: Math.round((agent.calls / maxAgent) * 100), completion: agent.calls ? Math.round((agent.completed / agent.calls) * 100) : 0, engagement: Math.min(100, Math.round((agent.durationSeconds / Math.max(1, agent.calls) / 300) * 100)) }));
  const funnelData = [
    { name: "Total calls", value: data.summary.totalCalls, fill: COLORS[1] },
    { name: "Connected", value: Math.max(0, data.summary.totalCalls - data.summary.failedCalls), fill: COLORS[2] },
    { name: "Completed", value: data.summary.completedCalls, fill: COLORS[0] },
  ];

  return <section className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
    <Card title="Conversation momentum" subtitle="Interactive calls, completions and cost trend" wide>
      {!timeline.length ? <EmptyChart /> : <div className="h-[330px]"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={timeline} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="callsArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#36e1d0" stopOpacity={.4}/><stop offset="1" stopColor="#36e1d0" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,.055)" vertical={false}/><XAxis dataKey="label" tick={axis} tickLine={false} axisLine={false}/><YAxis tick={axis} tickLine={false} axisLine={false}/><Tooltip contentStyle={tooltipStyle}/><Legend wrapperStyle={{ fontSize: 11, opacity: .7 }}/><Area type="monotone" dataKey="calls" name="Total calls" stroke="#36e1d0" strokeWidth={2.5} fill="url(#callsArea)"/><Line type="monotone" dataKey="completed" name="Completed" stroke="#8290ff" strokeWidth={2.2} dot={false}/><Bar dataKey="cost" name="Cost ($)" fill="#ae64ff" opacity={.3} radius={[4,4,0,0]}/></ComposedChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Outcome intelligence" subtitle="Pie chart of every call ending">
      {!hasCalls ? <EmptyChart /> : <div className="h-[330px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={outcome} dataKey="value" nameKey="name" cx="50%" cy="48%" innerRadius={65} outerRadius={105} paddingAngle={4} cornerRadius={6}>{outcome.map((row, index) => <Cell key={row.name} fill={COLORS[index % COLORS.length]}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/><Legend iconType="circle" wrapperStyle={{ fontSize: 11, textTransform: "capitalize" }}/></PieChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Agent opportunity map" subtitle="Bubble size = volume · position = engagement and completion" wide>
      {!agentBubbles.length ? <EmptyChart /> : <div className="h-[330px]"><ResponsiveContainer width="100%" height="100%"><ScatterChart margin={{ top: 15, right: 20, bottom: 15, left: -10 }}><CartesianGrid stroke="rgba(255,255,255,.06)"/><XAxis type="number" dataKey="talkMinutes" name="Talk time" unit="m" tick={axis} tickLine={false}/><YAxis type="number" dataKey="completion" name="Completion" unit="%" domain={[0,100]} tick={axis} tickLine={false}/><ZAxis type="number" dataKey="size" range={[90,650]}/><Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={tooltipStyle}/><Scatter data={agentBubbles}>{agentBubbles.map((row) => <Cell key={row.name} fill={row.fill} fillOpacity={.76}/>)}</Scatter></ScatterChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Call journey funnel" subtitle="From attempted calls to completed conversations">
      {!hasCalls ? <EmptyChart /> : <div className="h-[330px]"><ResponsiveContainer width="100%" height="100%"><FunnelChart><Tooltip contentStyle={tooltipStyle}/><Funnel dataKey="value" data={funnelData} isAnimationActive><LabelList position="right" fill="rgba(255,255,255,.75)" stroke="none" dataKey="name" fontSize={11}/></Funnel></FunnelChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Channel distribution" subtitle="Compare inbound, outbound and web demand">
      {!channels.length ? <EmptyChart /> : <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={channels} layout="vertical" margin={{ left: 5, right: 25 }}><CartesianGrid stroke="rgba(255,255,255,.055)" horizontal={false}/><XAxis type="number" tick={axis} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" tick={axis} axisLine={false} tickLine={false} width={65}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="calls" name="Calls" radius={[0,8,8,0]}>{channels.map((row, index) => <Cell key={row.name} fill={COLORS[index % COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Conversation length" subtitle="Distribution reveals quick drop-offs and deep engagement">
      {!durationData.length ? <EmptyChart /> : <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={durationData} margin={{ left: -20, right: 10 }}><defs><linearGradient id="durationArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ae64ff" stopOpacity={.55}/><stop offset="1" stopColor="#ae64ff" stopOpacity={.03}/></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,.055)" vertical={false}/><XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false}/><YAxis tick={axis} axisLine={false} tickLine={false}/><Tooltip contentStyle={tooltipStyle}/><Area type="monotone" dataKey="calls" stroke="#ae64ff" strokeWidth={2.5} fill="url(#durationArea)"/></AreaChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Customer sentiment" subtitle="Positive, neutral and negative conversation tone">
      {!sentiment.length ? <EmptyChart /> : <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={sentiment} margin={{ left: -18, right: 10 }}><CartesianGrid stroke="rgba(255,255,255,.055)" vertical={false}/><XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false}/><YAxis tick={axis} axisLine={false} tickLine={false}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="calls" radius={[9,9,0,0]}>{sentiment.map((row) => <Cell key={row.name} fill={row.name === "positive" ? "#36e1a0" : row.name === "negative" ? "#ff6384" : "#8290ff"}/>)}</Bar></BarChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Cost architecture" subtitle="Pie chart of the complete voice-agent stack">
      {!costData.some((row) => row.value) ? <EmptyChart /> : <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={costData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={98} stroke="#09100f" strokeWidth={4}>{costData.map((row) => <Cell key={row.name} fill={row.fill}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/><Legend iconType="circle" wrapperStyle={{ fontSize: 10, textTransform: "capitalize" }}/></PieChart></ResponsiveContainer></div>}
    </Card>

    <Card title="Agent capability radar" subtitle="Normalized comparison across three useful dimensions">
      {!radarData.length ? <EmptyChart /> : <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radarData} outerRadius="70%"><PolarGrid stroke="rgba(255,255,255,.12)"/><PolarAngleAxis dataKey="agent" tick={{ ...axis, fill: "rgba(255,255,255,.5)" }}/><Radar name="Volume" dataKey="volume" stroke="#36e1d0" fill="#36e1d0" fillOpacity={.2}/><Radar name="Completion" dataKey="completion" stroke="#8290ff" fill="#8290ff" fillOpacity={.18}/><Radar name="Engagement" dataKey="engagement" stroke="#ae64ff" fill="#ae64ff" fillOpacity={.14}/><Tooltip contentStyle={tooltipStyle}/><Legend wrapperStyle={{ fontSize: 10 }}/></RadarChart></ResponsiveContainer></div>}
    </Card>
  </section>;
}
