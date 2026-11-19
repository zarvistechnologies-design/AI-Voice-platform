"use client";

import { useState } from "react";

import "./VoiceAgentCallExperience.css";

type CallLine = { speaker: "agent" | "caller"; text: string };
type CallScenario = { label: string; purpose: string; lines: CallLine[] };

const scenarios: CallScenario[] = [
  {
    label: "Sales",
    purpose: "Lead qualification",
    lines: [
      { speaker: "agent", text: "Good morning. You have reached the Vozon sales desk. How can I help?" },
      { speaker: "caller", text: "I am looking for a plan for my team." },
      { speaker: "agent", text: "Of course. How many people will use it, and when would you like to start?" },
      { speaker: "caller", text: "Twelve people, ideally next month." },
      { speaker: "agent", text: "Thanks. I will share those details with the team so they can recommend the right option." },
    ],
  },
  {
    label: "Fintech",
    purpose: "Account assistance",
    lines: [
      { speaker: "agent", text: "Hello, this is the Vozon account assistant. What can I help you with?" },
      { speaker: "caller", text: "I need an update on my payment request." },
      { speaker: "agent", text: "I can help check the next step. Could you share the request reference?" },
      { speaker: "caller", text: "It is in the message I received this morning." },
      { speaker: "agent", text: "Thank you. I will note the request and connect you with the right team." },
    ],
  },
  {
    label: "E-Commerce",
    purpose: "Order support",
    lines: [
      { speaker: "agent", text: "Hi, thanks for calling. How can I help with your order?" },
      { speaker: "caller", text: "I want to know when my package will arrive." },
      { speaker: "agent", text: "I can help with that. Do you have your order number nearby?" },
      { speaker: "caller", text: "Yes, it ends in 2048." },
      { speaker: "agent", text: "Got it. I will check the delivery update and explain the next step." },
    ],
  },
  {
    label: "Insurance",
    purpose: "Policy enquiries",
    lines: [
      { speaker: "agent", text: "Welcome. What would you like to know about your cover?" },
      { speaker: "caller", text: "I have a question about adding a family member." },
      { speaker: "agent", text: "I can guide you through the information we need to review that change." },
      { speaker: "caller", text: "Could someone follow up with me today?" },
      { speaker: "agent", text: "Certainly. I will pass your request and a short summary to the team." },
    ],
  },
  {
    label: "Education",
    purpose: "Course enquiries",
    lines: [
      { speaker: "agent", text: "Hi, this is the course information desk. What are you interested in studying?" },
      { speaker: "caller", text: "I want to know about the next data analytics cohort." },
      { speaker: "agent", text: "I can help. Are you looking for weekday or weekend sessions?" },
      { speaker: "caller", text: "Weekend sessions would work best." },
      { speaker: "agent", text: "Thanks. I will send the available options and help arrange a conversation with an advisor." },
    ],
  },
];

function CallIcon({ name }: { name: "speaker" | "video" | "mute" | "more" | "end" | "keypad" }) {
  if (name === "speaker") return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4V9Z" fill="currentColor"/><path d="M16 8c2 2 2 6 0 8m2-11c4 4 4 10 0 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
  if (name === "video") return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="6" width="12" height="12" rx="2" fill="currentColor"/><path d="m16 10 5-3v10l-5-3v-4Z" fill="currentColor"/></svg>;
  if (name === "mute") return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 9v3a3 3 0 0 0 5.5 1.7M15 9V6a3 3 0 0 0-5.7-1.3M5 10v2a7 7 0 0 0 12 4.9M19 10v2c0 .8-.1 1.5-.4 2.2M12 19v3m-4 0h8M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "more") return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>;
  if (name === "end") return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 14.7c5.4-4.2 11.6-4.2 17 0l-2.4 3.4-3.5-1.1v-2.1a13 13 0 0 0-5.2 0V17l-3.5 1.1-2.4-3.4Z" fill="currentColor"/></svg>;
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{[6, 12, 18].flatMap((x) => [6, 12, 18].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />))}</svg>;
}

export function VoiceAgentCallExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scenario = scenarios[activeIndex];

  return <div className="vc-experience" aria-label="Example AI voice agent conversations">
    <div className="vc-hero-intro"><span>VOZON / AI VOICE AGENT</span><h1>Every call deserves a better conversation.</h1></div>
    <div className="vc-industries" role="group" aria-label="Choose a call example">
      {scenarios.map((item, index) => <button key={item.label} type="button" aria-pressed={activeIndex === index} className={activeIndex === index ? "is-active" : ""} onClick={() => setActiveIndex(index)}>{item.label}</button>)}
    </div>

    <div className="vc-phone-wrap">
      <div className="vc-phone" role="img" aria-label={`Illustrative Vozon AI ${scenario.label} voice call screen`}>
        <div className="vc-phone-screen">
          <div className="vc-status"><span>9:41</span><span className="vc-island" /><span className="vc-status-icons"><i /><i /><b /></span></div>
          <div className="vc-call-identity"><span>00:00</span><strong>Vozon AI</strong><small>{scenario.label}</small></div>
          <div className="vc-call-controls" aria-hidden="true">
            {(["speaker", "video", "mute", "more", "end", "keypad"] as const).map((name) => <div key={name}><span className={name === "end" ? "is-end" : ""}><CallIcon name={name} /></span><small>{name === "video" ? "Video" : name === "end" ? "End" : name.charAt(0).toUpperCase() + name.slice(1)}</small></div>)}
          </div>
          <div className="vc-home-indicator" />
        </div>
      </div>
    </div>

    <div className="vc-transcript" key={scenario.label} aria-live="polite">
      <div className="vc-transcript-heading"><span>EXAMPLE CONVERSATION</span><strong>{scenario.purpose}</strong></div>
      {scenario.lines.map((line, index) => <p className={line.speaker === "caller" ? "is-caller" : "is-agent"} key={`${index}-${line.text}`}><span>{line.text}</span></p>)}
      <div className="vc-transcript-foot"><i /><span>Listen. Understand. Move forward.</span></div>
    </div>
  </div>;
}
