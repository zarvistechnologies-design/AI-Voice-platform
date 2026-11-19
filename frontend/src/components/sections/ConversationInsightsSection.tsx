"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  const call = calls[activeCall];

  return (
    <section className="conversation-insights" aria-labelledby="conversation-insights-title">
      <div className="conversation-insights-heading">
        <h2 id="conversation-insights-title">Insights on every call &amp; chat</h2>
        <p>Track voice call quality, WhatsApp replies, tool calls, and agent outcomes in one place.</p>
      </div>

      <div className="conversation-insights-visual" aria-label="Illustrative call analytics dashboard">
        <div className="conversation-insights-dashboard">
          {/* Top Row: Call Inspection & Audio Waveform Player */}
          <div className="conversation-insights-top">
            {/* Left Sidebar: Recent Calls & 7-Day Heatmap */}
            <aside className="conversation-insights-recent">
              <div className="conversation-insights-recent-heading">
                <strong>Recent calls</strong>
                <span>{calls.length}</span>
              </div>
              <div className="conversation-insights-call-list">
                {calls.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    className={`conversation-insights-call${activeCall === index ? " is-active" : ""}`}
                    aria-pressed={activeCall === index}
                    onClick={() => setActiveCall(index)}
                  >
                    <span className="conversation-insights-live-dot" aria-hidden="true" />
                    <span className="conversation-insights-call-text">
                      <strong>{item.name}</strong>
                      <small>{item.detail}</small>
                    </span>
                    <span className="conversation-insights-call-duration">{item.duration}</span>
                  </button>
                ))}
              </div>

              <div className="conversation-insights-trends">
                <div className="conversation-insights-trends-heading">
                  <div>
                    <strong>Trends · last 7 days</strong>
                    <span>Daily scores across calls</span>
                  </div>
                </div>
                <TrendHeatmap />
                <p className="conversation-insights-heatmap-note">Darker cells show higher values</p>
              </div>
            </aside>

            {/* Right Panel: Audio Recording, Metrics & Issues */}
            <div className="conversation-insights-detail">
              <div className="conversation-insights-agent">
                <span className="conversation-insights-avatar">{call.agent.charAt(0)}</span>
                <div>
                  <h3>{call.agent} <span>→</span> {call.name}</h3>
                  <p>Example call analysis</p>
                </div>
              </div>

              <div className="conversation-insights-meta">
                <div><span>Call completed</span><strong>{call.completed}</strong></div>
                <div><span>Call duration</span><strong>{call.duration}</strong></div>
                <div><span>Call status</span><strong className="conversation-insights-success">Success</strong></div>
              </div>

              {/* Recording Waveform Player */}
              <div className="conversation-insights-audio" aria-label="Illustrative audio waveform">
                <span className="conversation-insights-play" aria-hidden="true">
                  <svg viewBox="0 0 16 16"><path d="M5 3.2 12.7 8 5 12.8Z" /></svg>
                </span>
                <span className="conversation-insights-audio-time">0:00</span>
                <span className="conversation-insights-wave">
                  <i className="conversation-insights-wave-cursor" />
                  {waveform.map((height, index) => <i key={index} style={{ height }} />)}
                </span>
                <span className="conversation-insights-audio-remaining">−{call.duration}</span>
                <svg className="conversation-insights-download" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M10 2v10m0 0 3-3m-3 3L7 9M4 13v3h12v-3" />
                </svg>
              </div>

              {/* 4 Call Scores */}
              <div className="conversation-insights-scores">
                {call.score.map((value, index) => (
                  <div key={index}>
                    <strong>{value}</strong>
                    <span>{["Criteria met", "Relevance", "Tool calls", "Obedience"][index]}</span>
                  </div>
                ))}
              </div>

              {/* Issues Flagged */}
              <div className="conversation-insights-issues-heading">
                <strong>Issues across this call</strong>
                <span>1 flagged</span>
              </div>
              <div className="conversation-insights-issue">
                <div>
                  <span>{call.issueType}</span>
                  <strong>{call.issue}</strong>
                </div>
                <p>{call.issueDetail}</p>
              </div>
            </div>
          </div>

          {/* Bottom Section: Trend Analysis & Telemetry (Image 1 incorporated!) */}
          <div className="ci-analytics-zone">
            <div className="ci-section-title">
              <span className="ci-title-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </span>
              <strong>Trend Analysis</strong>
            </div>

            {/* 4 Main Trend Charts in 2x2 Grid */}
            <div className="ci-charts-grid-4">
              {/* 1. Call Volume Trend */}
              <div className="ci-chart-box">
                <div className="ci-chart-box-header">
                  <div className="ci-chart-title">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12l4-5 3 3 7-8" />
                    </svg>
                    <span>Call Volume Trend</span>
                  </div>
                  <span className="ci-badge is-teal">AREA CHART</span>
                </div>
                <div className="ci-chart-canvas">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volumeTrendData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="volTotalGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0f766e" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#0f766e" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="volCompletedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.22} />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#f1f3f5" vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fill: "#8b949e", fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 60]} />
                      <Tooltip contentStyle={tooltipBox} />
                      <Area isAnimationActive={false} type="monotone" dataKey="total" name="Total Calls" stroke="#0f766e" strokeWidth={2.2} fill="url(#volTotalGrad)" />
                      <Area isAnimationActive={false} type="monotone" dataKey="completed" name="Completed" stroke="#4f46e5" strokeWidth={2.2} fill="url(#volCompletedGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="ci-chart-legend">
                  <span><i style={{ backgroundColor: "#0f766e" }} />Total Calls</span>
                  <span><i style={{ backgroundColor: "#4f46e5" }} />Completed</span>
                </div>
              </div>

              {/* 2. Hourly Distribution */}
              <div className="ci-chart-box">
                <div className="ci-chart-box-header">
                  <div className="ci-chart-title">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="8" cy="8" r="6" />
                      <polyline points="8 4 8 8 11 9.5" />
                    </svg>
                    <span>Hourly Distribution</span>
                  </div>
                  <span className="ci-badge is-indigo">COLUMN CHART</span>
                </div>
                <div className="ci-chart-canvas">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="#f1f3f5" vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="hour" interval={2} tick={{ fill: "#8b949e", fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 45]} />
                      <Tooltip contentStyle={tooltipBox} />
                      <Bar isAnimationActive={false} dataKey="calls" name="Calls" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 3. Duration Analysis */}
              <div className="ci-chart-box">
                <div className="ci-chart-box-header">
                  <div className="ci-chart-title">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <line x1="1" y1="4" x2="15" y2="4" />
                      <line x1="1" y1="8" x2="11" y2="8" />
                      <line x1="1" y1="12" x2="8" y2="12" />
                    </svg>
                    <span>Duration Analysis</span>
                  </div>
                  <span className="ci-badge is-indigo">BAR CHART</span>
                </div>
                <div className="ci-chart-canvas">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={durationData} layout="vertical" margin={{ top: 10, right: 16, left: 6, bottom: 0 }}>
                      <CartesianGrid stroke="#f1f3f5" horizontal={false} strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fill: "#8b949e", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 80]} />
                      <YAxis type="category" dataKey="bucket" tick={{ fill: "#8b949e", fontSize: 10 }} tickLine={false} axisLine={false} width={48} />
                      <Tooltip contentStyle={tooltipBox} />
                      <Bar isAnimationActive={false} dataKey="calls" name="Calls" radius={[0, 4, 4, 0]}>
                        {durationData.map((row) => (
                          <Cell key={row.bucket} fill={row.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 4. Weekly Performance */}
              <div className="ci-chart-box">
                <div className="ci-chart-box-header">
                  <div className="ci-chart-title">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <polyline points="1 13 6 8 10 11 15 3" />
                    </svg>
                    <span>Weekly Performance</span>
                  </div>
                  <span className="ci-badge is-teal">LINE CHART</span>
                </div>
                <div className="ci-chart-canvas">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData} margin={{ top: 12, right: 16, left: -14, bottom: 0 }}>
                      <CartesianGrid stroke="#f1f3f5" vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="week" tick={{ fill: "#8b949e", fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="left" tick={{ fill: "#8b949e", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 230]} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: "#8b949e", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={tooltipBox} />
                      <Line yAxisId="left" isAnimationActive={false} type="monotone" dataKey="calls" name="Total Calls" stroke="#0f766e" strokeWidth={2.2} dot={{ r: 4, fill: "#0f766e" }} />
                      <Line yAxisId="right" isAnimationActive={false} type="monotone" dataKey="successRate" name="Success Rate %" stroke="#6366f1" strokeWidth={2.2} strokeDasharray="4 4" dot={{ r: 4, fill: "#6366f1" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="ci-chart-legend">
                  <span><i style={{ backgroundColor: "#0f766e" }} />Total Calls</span>
                  <span><i style={{ backgroundColor: "#6366f1" }} />Success Rate %</span>
                </div>
              </div>
            </div>

            {/* Sub-Section: Distribution & Breakdown */}
            <div className="ci-section-title is-sub">
              <span className="ci-title-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a10 10 0 0 1 10 10h-10z" />
                </svg>
              </span>
              <strong>Distribution &amp; Breakdown</strong>
            </div>

            <div className="ci-breakdown-grid">
              {/* Call Status Distribution Donut */}
              <div className="ci-chart-box ci-donut-box">
                <div className="ci-chart-box-header">
                  <div className="ci-chart-title">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="8" cy="8" r="6" />
                      <circle cx="8" cy="8" r="2.5" />
                    </svg>
                    <span>Call Status Distribution</span>
                  </div>
                  <span className="ci-badge is-teal">DONUT CHART</span>
                </div>

                <div className="ci-donut-wrap">
                  <div className="ci-donut-canvas">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          isAnimationActive={false}
                          data={statusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={56}
                          outerRadius={84}
                          paddingAngle={3}
                        >
                          {statusData.map((row) => (
                            <Cell key={row.name} fill={row.fill} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipBox} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="ci-donut-labels">
                    <span className="ci-slice is-user"><i />user ended: 171</span>
                    <span className="ci-slice is-timeout"><i />timeout: 36</span>
                    <span className="ci-slice is-error"><i />error: 4</span>
                  </div>
                  <div className="ci-donut-total">
                    <strong>211</strong>
                    <span>TOTAL CALLS</span>
                  </div>
                </div>
              </div>

              {/* Call Direction Breakdown */}
              <div className="ci-chart-box ci-direction-box">
                <div className="ci-chart-box-header">
                  <div className="ci-chart-title">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="3" width="12" height="10" rx="2" />
                      <line x1="5" y1="7" x2="11" y2="7" />
                      <line x1="5" y1="10" x2="9" y2="10" />
                    </svg>
                    <span>Call Direction Breakdown</span>
                  </div>
                  <span className="ci-badge is-indigo">PROGRESS</span>
                </div>

                <div className="ci-direction-content">
                  <div className="ci-direction-card is-inbound">
                    <div className="ci-dir-meta">
                      <div className="ci-dir-type">
                        <span className="ci-dir-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            <polyline points="18 4 12 10 6 4" />
                          </svg>
                        </span>
                        <strong>Inbound</strong>
                      </div>
                      <div className="ci-dir-stat">
                        <strong>211</strong>
                        <span>100.0%</span>
                      </div>
                    </div>
                  </div>

                  <div className="ci-direction-card is-outbound">
                    <div className="ci-dir-meta">
                      <div className="ci-dir-type">
                        <span className="ci-dir-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            <polyline points="6 10 12 4 18 10" />
                          </svg>
                        </span>
                        <strong>Outbound</strong>
                      </div>
                      <div className="ci-dir-stat">
                        <strong>0</strong>
                        <span>0.0%</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress lines */}
                  <div className="ci-dir-bars">
                    <div className="ci-dir-bar-row">
                      <span>Inbound</span>
                      <div className="ci-progress-track">
                        <div className="ci-progress-fill is-blue" style={{ width: "100%" }} />
                      </div>
                      <small>100.0%</small>
                    </div>
                    <div className="ci-dir-bar-row">
                      <span>Outbound</span>
                      <div className="ci-progress-track">
                        <div className="ci-progress-fill is-purple" style={{ width: "0%" }} />
                      </div>
                      <small>0.0%</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
