"use client";

import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./ConversationInsightsSection.css";

const tooltipLightStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  color: "#0f172a",
  fontSize: 12,
};

const tooltipDarkStyle = {
  background: "#18181b",
  border: "1px solid #27272a",
  borderRadius: 8,
  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
  color: "#ffffff",
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

// Call Volume Trend data matching the exact screenshot (Aug 24 to Nov 19)
const volumeTrendData = [
  { date: "Aug 24", totalCalls: 0, completed: 0 },
  { date: "Aug 27", totalCalls: 142, completed: 140 },
  { date: "Aug 30", totalCalls: 146, completed: 118 },
  { date: "Sep 2", totalCalls: 162, completed: 135 },
  { date: "Sep 5", totalCalls: 154, completed: 142 },
  { date: "Sep 8", totalCalls: 208, completed: 198 },
  { date: "Sep 11", totalCalls: 158, completed: 138 },
  { date: "Sep 14", totalCalls: 172, completed: 144 },
  { date: "Sep 17", totalCalls: 248, completed: 242 },
  { date: "Sep 20", totalCalls: 194, completed: 184 },
  { date: "Sep 23", totalCalls: 238, completed: 232 },
  { date: "Sep 26", totalCalls: 190, completed: 168 },
  { date: "Nov 19", totalCalls: 8, completed: 4 },
];

// Hourly Distribution data matching the exact screenshot (00:00 to 21:00)
const hourlyDistributionData = [
  { hour: "00:00", calls: 0 },
  { hour: "03:00", calls: 0 },
  { hour: "06:00", calls: 0 },
  { hour: "09:00", calls: 0 },
  { hour: "12:00", calls: 1 },
  { hour: "13:00", calls: 2 },
  { hour: "15:00", calls: 1 },
  { hour: "17:00", calls: 1 },
  { hour: "18:00", calls: 5 },
  { hour: "19:00", calls: 8 },
  { hour: "21:00", calls: 2 },
];

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
  const [viewTab, setViewTab] = useState<"inspection" | "charts">("inspection");
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDark = () => {
      const html = document.documentElement;
      setIsDark(html.classList.contains("dark") || html.getAttribute("data-dashboard-theme") === "dark");
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-dashboard-theme"] });
    return () => observer.disconnect();
  }, []);

  const call = calls[activeCall];
  const activeTooltip = isDark ? tooltipDarkStyle : tooltipLightStyle;
  const gridStroke = isDark ? "#27272a" : "#f1f5f9";
  const axisColor = isDark ? "#71717a" : "#64748b";

  return (
    <section className="conversation-insights" aria-labelledby="conversation-insights-title">
      <div className="conversation-insights-heading">
        <span className="conversation-insights-eyebrow"><i aria-hidden="true" /> REAL-TIME TELEMETRY</span>
        <h2 id="conversation-insights-title">Insights on every call &amp; chat.</h2>
        <p>Track voice call quality, WhatsApp replies, tool calls, and agent outcomes in one place.</p>
      </div>

      <div className="conversation-insights-visual" aria-label="Illustrative call analytics dashboard">
        <div className="conversation-insights-dashboard">
          {/* Header Bar with Segmented Toggle (keeps exact same width and height footprint) */}
          <div className="ci-dashboard-control-bar">
            <div className="ci-control-title">
              <span className="ci-control-pulse-icon" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </span>
              <strong>{viewTab === "charts" ? "Trend Analysis" : "CALL TELEMETRY & INTELLIGENCE"}</strong>
            </div>

            <div className="ci-view-segmented" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={viewTab === "inspection"}
                className={`ci-segmented-btn ${viewTab === "inspection" ? "is-active" : ""}`}
                onClick={() => setViewTab("inspection")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Call Inspection &amp; Audio</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={viewTab === "charts"}
                className={`ci-segmented-btn ${viewTab === "charts" ? "is-active" : ""}`}
                onClick={() => setViewTab("charts")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M18 9l-5 5-4-4-6 6" />
                </svg>
                <span>Volume Trends &amp; Hourly</span>
              </button>
            </div>
          </div>

          {viewTab === "inspection" ? (
            /* VIEW 1: Call Inspection & Audio Waveform Player (Matches Image 2 in light theme) */
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

                {/* Live Performance & Real-time Channel Analytics */}
                <div className="ci-sidebar-analytics-card">
                  <div className="ci-sidebar-analytics-head">
                    <div>
                      <strong>Live Performance</strong>
                      <span>Today across channels</span>
                    </div>
                    <span className="ci-sidebar-live-pill">
                      <i className="ci-pulse-dot" /> LIVE
                    </span>
                  </div>

                  <div className="ci-sidebar-stats-grid">
                    <div className="ci-sidebar-stat-item">
                      <div className="ci-sidebar-stat-icon is-green">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div className="ci-sidebar-stat-info">
                        <strong>98.4%</strong>
                        <span>Resolution</span>
                      </div>
                    </div>

                    <div className="ci-sidebar-stat-item">
                      <div className="ci-sidebar-stat-icon is-blue">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      </div>
                      <div className="ci-sidebar-stat-info">
                        <strong>640ms</strong>
                        <span>Avg Latency</span>
                      </div>
                    </div>

                    <div className="ci-sidebar-stat-item">
                      <div className="ci-sidebar-stat-icon is-purple">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div className="ci-sidebar-stat-info">
                        <strong>1,482</strong>
                        <span>Total Calls</span>
                      </div>
                    </div>

                    <div className="ci-sidebar-stat-item">
                      <div className="ci-sidebar-stat-icon is-teal">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <div className="ci-sidebar-stat-info">
                        <strong>4.9 / 5</strong>
                        <span>CSAT Score</span>
                      </div>
                    </div>
                  </div>

                  <div className="ci-sidebar-progress-block">
                    <div className="ci-sidebar-progress-label">
                      <span>Voice (78%)</span>
                      <span>WhatsApp (22%)</span>
                    </div>
                    <div className="ci-sidebar-progress-track">
                      <div className="ci-sidebar-progress-fill is-voice" style={{ width: "78%" }} />
                      <div className="ci-sidebar-progress-fill is-wa" style={{ width: "22%" }} />
                    </div>
                  </div>
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

                {/* Embedded Line Graph & Bar Chart Inside This Box (Maintains shape & size) */}
                <div className="ci-embedded-charts-row">
                  {/* Line / Area Graph */}
                  <div className="ci-embedded-chart-card">
                    <div className="ci-embedded-chart-head">
                      <strong>Call Volume Trend</strong>
                      <span className="ci-chart-badge ci-badge-area">AREA CHART</span>
                    </div>

                    <div className="ci-embedded-chart-canvas">
                      {mounted && (
                        <ResponsiveContainer width="100%" height={130}>
                          <AreaChart data={volumeTrendData} margin={{ top: 8, right: 10, left: -24, bottom: 0 }}>
                            <defs>
                              <linearGradient id="embTotalCallsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00b987" stopOpacity={isDark ? 0.3 : 0.22} />
                                <stop offset="100%" stopColor="#00b987" stopOpacity={0.01} />
                              </linearGradient>
                              <linearGradient id="embCompletedGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6262ff" stopOpacity={isDark ? 0.35 : 0.22} />
                                <stop offset="100%" stopColor="#6262ff" stopOpacity={0.02} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke={gridStroke} vertical={false} strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tick={{ fill: axisColor, fontSize: 10 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              ticks={[0, 65, 130, 195, 260]}
                              domain={[0, 260]}
                              tick={{ fill: axisColor, fontSize: 10 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip contentStyle={activeTooltip} />
                            <Area
                              type="monotone"
                              dataKey="totalCalls"
                              name="Total Calls"
                              stroke="#00b987"
                              strokeWidth={2}
                              fill="url(#embTotalCallsGrad)"
                              isAnimationActive={false}
                            />
                            <Area
                              type="monotone"
                              dataKey="completed"
                              name="Completed"
                              stroke="#6262ff"
                              strokeWidth={2}
                              fill="url(#embCompletedGrad)"
                              isAnimationActive={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    <div className="ci-chart-custom-legend ci-legend-compact">
                      <span className="ci-legend-item">
                        <span className="ci-legend-line ci-line-purple" />
                        <span className="ci-legend-dot ci-dot-purple" />
                        <span className="ci-legend-text">Completed</span>
                      </span>
                      <span className="ci-legend-item">
                        <span className="ci-legend-line ci-line-teal" />
                        <span className="ci-legend-dot ci-dot-teal" />
                        <span className="ci-legend-text">Total Calls</span>
                      </span>
                    </div>
                  </div>

                  {/* Column / Bar Chart */}
                  <div className="ci-embedded-chart-card">
                    <div className="ci-embedded-chart-head">
                      <strong>Hourly Distribution</strong>
                      <span className="ci-chart-badge ci-badge-column">COLUMN CHART</span>
                    </div>

                    <div className="ci-embedded-chart-canvas">
                      {mounted && (
                        <ResponsiveContainer width="100%" height={130}>
                          <BarChart data={hourlyDistributionData} margin={{ top: 8, right: 10, left: -26, bottom: 0 }}>
                            <CartesianGrid stroke={gridStroke} vertical={false} strokeDasharray="3 3" />
                            <XAxis
                              dataKey="hour"
                              tick={{ fill: axisColor, fontSize: 10 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              ticks={[0, 2, 4, 6, 8]}
                              domain={[0, 8]}
                              tick={{ fill: axisColor, fontSize: 10 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip contentStyle={activeTooltip} />
                            <Bar
                              dataKey="calls"
                              name="Calls"
                              fill="#6262ff"
                              radius={[2, 2, 0, 0]}
                              isAnimationActive={false}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <div className="ci-embedded-chart-foot">
                      <span>Peak: 19:00 (8 calls)</span>
                    </div>
                  </div>
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
          ) : (
            /* VIEW 2: The Two Charts Side-By-Side (Matches Image 1, styled for both light and dark theme) */
            <div className="ci-charts-panel">
              <div className="ci-charts-grid-2">
                {/* Chart 1: Call Volume Trend (Area Chart) */}
                <div className="ci-chart-card">
                  <div className="ci-chart-card-header">
                    <h3 className="ci-chart-card-title">Call Volume Trend</h3>
                    <span className="ci-chart-badge ci-badge-area">AREA CHART</span>
                  </div>

                  <div className="ci-chart-body">
                    {mounted && (
                      <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={volumeTrendData} margin={{ top: 12, right: 16, left: -15, bottom: 0 }}>
                          <defs>
                            <linearGradient id="totalCallsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00b987" stopOpacity={isDark ? 0.25 : 0.2} />
                              <stop offset="100%" stopColor="#00b987" stopOpacity={0.01} />
                            </linearGradient>
                            <linearGradient id="completedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6262ff" stopOpacity={isDark ? 0.3 : 0.18} />
                              <stop offset="100%" stopColor="#6262ff" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke={gridStroke} vertical={false} strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: axisColor, fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            ticks={[0, 65, 130, 195, 260]}
                            domain={[0, 260]}
                            tick={{ fill: axisColor, fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip contentStyle={activeTooltip} />
                          <Area
                            type="monotone"
                            dataKey="totalCalls"
                            name="Total Calls"
                            stroke="#00b987"
                            strokeWidth={2}
                            fill="url(#totalCallsAreaGrad)"
                            isAnimationActive={false}
                          />
                          <Area
                            type="monotone"
                            dataKey="completed"
                            name="Completed"
                            stroke="#6262ff"
                            strokeWidth={2}
                            fill="url(#completedAreaGrad)"
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div className="ci-chart-custom-legend">
                    <span className="ci-legend-item">
                      <span className="ci-legend-line ci-line-purple" />
                      <span className="ci-legend-dot ci-dot-purple" />
                      <span className="ci-legend-text">Completed</span>
                    </span>
                    <span className="ci-legend-item">
                      <span className="ci-legend-line ci-line-teal" />
                      <span className="ci-legend-dot ci-dot-teal" />
                      <span className="ci-legend-text">Total Calls</span>
                    </span>
                  </div>
                </div>

                {/* Chart 2: Hourly Distribution (Column Chart) */}
                <div className="ci-chart-card">
                  <div className="ci-chart-card-header">
                    <h3 className="ci-chart-card-title">Hourly Distribution</h3>
                    <span className="ci-chart-badge ci-badge-column">COLUMN CHART</span>
                  </div>

                  <div className="ci-chart-body">
                    {mounted && (
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={hourlyDistributionData} margin={{ top: 12, right: 16, left: -20, bottom: 0 }}>
                          <CartesianGrid stroke={gridStroke} vertical={false} strokeDasharray="3 3" />
                          <XAxis
                            dataKey="hour"
                            tick={{ fill: axisColor, fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            ticks={[0, 2, 4, 6, 8]}
                            domain={[0, 8]}
                            tick={{ fill: axisColor, fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip contentStyle={activeTooltip} />
                          <Bar
                            dataKey="calls"
                            name="Calls"
                            fill="#6262ff"
                            radius={[3, 3, 0, 0]}
                            isAnimationActive={false}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="ci-chart-card-foot-space" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
