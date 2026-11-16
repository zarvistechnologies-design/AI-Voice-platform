"use client";

import { useState } from "react";
import "./ConversationInsightsSection.css";

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
        <h2 id="conversation-insights-title">Insights on every conversation</h2>
        <p>See how each call performs and find clear ways to improve every agent.</p>
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
          </div>
        </div>

        <div className="conversation-insights-trends">
          <div className="conversation-insights-trends-heading"><div><strong>Trends · last 7 days</strong><span>Daily scores across calls</span></div></div>
          <TrendHeatmap />
          <p className="conversation-insights-heatmap-note">Darker cells show higher values</p>
        </div>
      </div>
    </section>
  );
}
