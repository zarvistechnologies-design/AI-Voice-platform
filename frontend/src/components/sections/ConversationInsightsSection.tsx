"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./ConversationInsightsSection.css";

const volumeTrendData = [
  { day: "Fri, Nov 13", total: 42, completed: 31 },
  { day: "Sat, Nov 14", total: 22, completed: 16 },
  { day: "Sun, Nov 15", total: 6, completed: 5 },
  { day: "Mon, Nov 16", total: 58, completed: 48 },
  { day: "Tue, Nov 17", total: 29, completed: 24 },
  { day: "Wed, Nov 18", total: 25, completed: 20 },
  { day: "Thu, Nov 19", total: 24, completed: 19 },
];

const hourlyData = [
  { hour: "07:00", calls: 3 },
  { hour: "08:00", calls: 4 },
  { hour: "09:00", calls: 41 },
  { hour: "10:00", calls: 31 },
  { hour: "11:00", calls: 29 },
  { hour: "12:00", calls: 26 },
  { hour: "13:00", calls: 15 },
  { hour: "14:00", calls: 5 },
  { hour: "15:00", calls: 11 },
  { hour: "16:00", calls: 4 },
  { hour: "17:00", calls: 5 },
  { hour: "18:00", calls: 6 },
  { hour: "19:00", calls: 8 },
  { hour: "20:00", calls: 3 },
  { hour: "21:00", calls: 5 },
  { hour: "22:00", calls: 2 },
  { hour: "23:00", calls: 3 },
];

const durationData = [
  { bucket: "0-30s", calls: 66, fill: "#0d9488" },
  { bucket: "30s-1m", calls: 45, fill: "#0284c7" },
  { bucket: "1-2m", calls: 68, fill: "#f59e0b" },
  { bucket: "2-5m", calls: 32, fill: "#e11d48" },
  { bucket: "5-10m", calls: 0, fill: "#7c3aed" },
  { bucket: "10m+", calls: 0, fill: "#4f46e5" },
];

const weeklyData = [
  { week: "Week 4", calls: 0, successRate: 0 },
  { week: "Week 3", calls: 0, successRate: 0 },
  { week: "Week 2", calls: 0, successRate: 0 },
  { week: "Week 1", calls: 211, successRate: 81 },
];

const statusData = [
  { name: "user-ended", value: 171, fill: "#0284c7" },
  { name: "timeout", value: 36, fill: "#f59e0b" },
  { name: "error", value: 4, fill: "#0f766e" },
];

const axisTick = { fill: "#71717a", fontSize: 10, fontWeight: 500 };
const tooltipBox = {
  background: "#ffffff",
  border: "1px solid #e4e4e7",
  borderRadius: 8,
  boxShadow: "0 8px 24px rgba(0,0,0,.08)",
  color: "#18181b",
  fontSize: 12,
};

const calls = [
  {
    name: "Insurance",
    detail: "Motor insurance policy",
    duration: "3m 58s",
    agent: "Aarav",
    completed: "April 27, 8:42am",
    score: ["1/1", "98%", "100%", "95%"],
    issue: "Follow-up opportunity",
    issueDetail: "The caller asked for renewal options. A follow-up with the available plans can help them choose.",
    issueType: "FOLLOW-UP",
  },
  {
    name: "E-Commerce",
    detail: "Cart abandoned",
    duration: "5m 29s",
    agent: "Mira",
    completed: "April 27, 9:02am",
    score: ["1/1", "100%", "96%", "94%"],
    issue: "Checkout question",
    issueDetail: "The customer asked about delivery timing. Add the estimated arrival date to the follow-up message.",
    issueType: "CUSTOMER INTENT",
  },
  {
    name: "Customer Support",
    detail: "Wallet support",
    duration: "2m 07s",
    agent: "Vikram",
    completed: "April 27, 9:11am",
    score: ["1/1", "100%", "100%", "92%"],
    issue: "High latency",
    issueDetail: "Tool calls for transaction details and customer rating added delays to this conversation.",
    issueType: "TOOL CALLS",
  },
] as const;

const waveform = Array.from({ length: 92 }, (_, index) =>
  8 + Math.round(Math.abs(Math.sin(index * 1.63) * Math.cos(index * 0.31)) * 26),
);

const trends = [
  { name: "Relevance", color: "#00b987", values: [70, 78, 64, 74, 57, 55, 64] },
  { name: "Obedience", color: "#6262ff", values: [83, 87, 81, 89, 85, 89, 89] },
  { name: "Latency", color: "#ff741f", values: [40, 51, 43, 62, 54, 67, 70] },
] as const;

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function TrendHeatmap() {
  return (
    <div className="conversation-insights-heatmap" role="table" aria-label="Example daily scores for relevance, obedience, and latency over the last seven days">
      <div className="conversation-insights-heatmap-row is-heading" role="row">
        <span role="columnheader">Metric</span>
        {days.map((day) => <span key={day} role="columnheader">{day.slice(0, 2)}</span>)}
      </div>
      {trends.map((trend) => (
        <div className="conversation-insights-heatmap-row" role="row" key={trend.name}>
          <span className="conversation-insights-heatmap-label" role="rowheader"><i style={{ backgroundColor: trend.color }} />{trend.name}</span>
          {trend.values.map((value, index) => (
            <span className="conversation-insights-heatmap-cell" role="cell" aria-label={`${days[index]}: ${value}`} key={index} style={{ backgroundColor: `${trend.color}${Math.round(20 + value * 1.2).toString(16).padStart(2, "0")}` }}>{value}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ConversationInsightsSection() {
  const [activeCall, setActiveCall] = useState(2);
  const [chartTab, setChartTab] = useState<"trends" | "breakdown">("trends");
  const call = calls[activeCall];

  return (
    <section className="conversation-insights" aria-labelledby="conversation-insights-title">
      <div className="conversation-insights-heading">
        <h2 id="conversation-insights-title">Insights on every call &amp; chat</h2>
        <p>Track voice call quality, WhatsApp replies, tool calls, and agent outcomes in one place.</p>
      </div>

      <div className="conversation-insights-visual" aria-label="Illustrative call analytics dashboard">
        <div className="conversation-insights-dashboard">
          <div className="conversation-insights-recent">
            <div className="conversation-insights-recent-heading"><strong>Recent calls</strong><span>{calls.length}</span></div>
            <div className="conversation-insights-call-list">
              {calls.map((item, index) => (
                <button key={item.name} type="button" className={`conversation-insights-call${activeCall === index ? " is-active" : ""}`} aria-pressed={activeCall === index} onClick={() => setActiveCall(index)}>
                  <span className="conversation-insights-live-dot" aria-hidden="true" />
                  <span className="conversation-insights-call-text"><strong>{item.name}</strong><small>{item.detail}</small></span>
                  <span className="conversation-insights-call-duration">{item.duration}</span>
                </button>
              ))}
            </div>

            <div className="ci-sidebar-card">
              <div className="ci-inline-card-head">
                <span>Call Status · 211 calls</span>
                <b className="ci-pill is-teal">DONUT</b>
              </div>
              <div className="ci-sidebar-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      isAnimationActive={false}
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="46%"
                      innerRadius={32}
                      outerRadius={50}
                      paddingAngle={3}
                    >
                      {statusData.map((row) => (
                        <Cell key={row.name} fill={row.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipBox} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="conversation-insights-trends">
              <div className="conversation-insights-trends-heading"><div><strong>Trends · last 7 days</strong><span>Daily scores across calls</span></div></div>
              <TrendHeatmap />
              <p className="conversation-insights-heatmap-note">Darker cells show higher values</p>
            </div>
          </div>

          <div className="conversation-insights-detail">
            <div className="conversation-insights-agent"><span className="conversation-insights-avatar">{call.agent.charAt(0)}</span><div><h3>{call.agent} <span>→</span> {call.name}</h3><p>Example call analysis</p></div></div>
            <div className="conversation-insights-meta"><div><span>Call completed</span><strong>{call.completed}</strong></div><div><span>Call duration</span><strong>{call.duration}</strong></div><div><span>Call status</span><strong className="conversation-insights-success">Success</strong></div></div>
            <div className="conversation-insights-audio" aria-label="Illustrative audio waveform">
              <span className="conversation-insights-play" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M5 3.2 12.7 8 5 12.8Z" /></svg></span>
              <span className="conversation-insights-audio-time">0:00</span>
              <span className="conversation-insights-wave"><i className="conversation-insights-wave-cursor" />{waveform.map((height, index) => <i key={index} style={{ height }} />)}</span>
              <span className="conversation-insights-audio-remaining">−{call.duration}</span>
              <svg className="conversation-insights-download" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v10m0 0 3-3m-3 3L7 9M4 13v3h12v-3" /></svg>
            </div>
            <div className="conversation-insights-scores">
              {call.score.map((value, index) => <div key={index}><strong>{value}</strong><span>{["Criteria met", "Relevance", "Tool calls", "Obedience"][index]}</span></div>)}
            </div>
            <div className="conversation-insights-issues-heading"><strong>Issues across this call</strong><span>1 flagged</span></div>
            <div className="conversation-insights-issue"><div><span>{call.issueType}</span><strong>{call.issue}</strong></div><p>{call.issueDetail}</p></div>

            {/* Incorporated Recharts inside the single dashboard card */}
            <div className="ci-inline-analytics">
              <div className="ci-inline-header">
                <strong>Trend &amp; Distribution</strong>
                <div className="ci-inline-tabs" role="tablist" aria-label="Chart views">
                  <button
                    aria-selected={chartTab === "trends"}
                    className={chartTab === "trends" ? "is-active" : ""}
                    onClick={() => setChartTab("trends")}
                    role="tab"
                    type="button"
                  >
                    Volume &amp; Hourly
                  </button>
                  <button
                    aria-selected={chartTab === "breakdown"}
                    className={chartTab === "breakdown" ? "is-active" : ""}
                    onClick={() => setChartTab("breakdown")}
                    role="tab"
                    type="button"
                  >
                    Duration &amp; Status
                  </button>
                </div>
              </div>

              {chartTab === "trends" ? (
                <div className="ci-inline-grid">
                  <div className="ci-inline-card">
                    <div className="ci-inline-card-head">
                      <span>Call Volume Trend</span>
                      <b className="ci-pill is-teal">AREA</b>
                    </div>
                    <div className="ci-inline-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={volumeTrendData} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
                          <defs>
                            <linearGradient id="ciTotalGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0f766e" stopOpacity={0.22} />
                              <stop offset="100%" stopColor="#0f766e" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="ciCompletedGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.18} />
                              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.01} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="#eaeaea" vertical={false} strokeDasharray="3 3" />
                          <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 9 }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fill: "#71717a", fontSize: 9 }} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={tooltipBox} />
                          <Area isAnimationActive={false} type="monotone" dataKey="total" name="Total Calls" stroke="#0f766e" strokeWidth={2} fill="url(#ciTotalGrad)" />
                          <Area isAnimationActive={false} type="monotone" dataKey="completed" name="Completed" stroke="#4f46e5" strokeWidth={2} fill="url(#ciCompletedGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="ci-inline-card">
                    <div className="ci-inline-card-head">
                      <span>Hourly Distribution</span>
                      <b className="ci-pill is-indigo">COLUMN</b>
                    </div>
                    <div className="ci-inline-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hourlyData} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
                          <CartesianGrid stroke="#eaeaea" vertical={false} strokeDasharray="3 3" />
                          <XAxis dataKey="hour" interval={3} tick={{ fill: "#71717a", fontSize: 9 }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fill: "#71717a", fontSize: 9 }} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={tooltipBox} />
                          <Bar isAnimationActive={false} dataKey="calls" name="Calls" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="ci-inline-grid">
                  <div className="ci-inline-card">
                    <div className="ci-inline-card-head">
                      <span>Duration Analysis</span>
                      <b className="ci-pill is-indigo">BAR</b>
                    </div>
                    <div className="ci-inline-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={durationData} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                          <CartesianGrid stroke="#eaeaea" horizontal={false} strokeDasharray="3 3" />
                          <XAxis type="number" tick={{ fill: "#71717a", fontSize: 9 }} tickLine={false} axisLine={false} />
                          <YAxis type="category" dataKey="bucket" tick={{ fill: "#71717a", fontSize: 9 }} tickLine={false} axisLine={false} width={44} />
                          <Tooltip contentStyle={tooltipBox} />
                          <Bar isAnimationActive={false} dataKey="calls" name="Calls" radius={[0, 3, 3, 0]}>
                            {durationData.map((row) => (
                              <Cell key={row.bucket} fill={row.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="ci-inline-card">
                    <div className="ci-inline-card-head">
                      <span>Call Status (211 total)</span>
                      <b className="ci-pill is-teal">DONUT</b>
                    </div>
                    <div className="ci-inline-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            isAnimationActive={false}
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={36}
                            outerRadius={56}
                            paddingAngle={3}
                          >
                            {statusData.map((row) => (
                              <Cell key={row.name} fill={row.fill} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={tooltipBox} />
                          <Legend wrapperStyle={{ fontSize: 10 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
