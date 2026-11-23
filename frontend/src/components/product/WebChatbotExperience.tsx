"use client";

import { useState } from "react";
import { AnimatedStoryFlowShowcase } from "./ProductFloatingShowcase";

const scenarios = [
  {
    label: "Product discovery",
    purpose: "Help visitors find the right option on your site",
    step1Title: "Visitor on /pricing · Multi-Channel Question",
    step1Detail: "“Which plan works best if we want voice calls and WhatsApp?”",
    step1Logo: "/images/company-logos/notion.svg",
    step2Title: "Vozon Web Chatbot · Grounded Lookup",
    step2Detail: "Matches approved Pricing & Channels Guide · Asks team size",
    outcome1Kicker: "RECOMMENDED PLAN",
    outcome1Title: "Connected Growth Plan shared in chat",
    outcome1Logo: "/images/company-logos/notion.svg",
    outcome2Kicker: "NEXT ACTION",
    outcome2Title: "Visitor clicks direct comparison link",
    outcome2Logo: "/images/integrations/slack.svg",
    metricVal: "94%",
    metricTitle: "Questions answered from approved docs",
    metricDetail: "0.6s response time",
    stats: [
      { label: "Grounded Match", value: "94%", pct: 94 },
      { label: "Engaged", value: "88%", pct: 88 },
    ],
    lines: [
      { speaker: "caller" as const, text: "Which plan works best if we want both voice calls and WhatsApp?" },
      { speaker: "agent" as const, text: "Our connected plans support both. How many teammates will handle follow-ups?" },
      { speaker: "caller" as const, text: "Around ten people across sales and support." },
      { speaker: "agent" as const, text: "Here is the recommended setup and a direct link to compare features." },
    ],
  },
  {
    label: "Demo qualification",
    purpose: "Capture requirements and book a walkthrough",
    step1Title: "Visitor on /product · Demo Request",
    step1Detail: "“Can we book a walkthrough for our 15-person support team?”",
    step1Logo: "/images/integrations/google-calendar.svg",
    step2Title: "In-Chat Qualification & Calendar Check",
    step2Detail: "Captures 15-seat scope & checks live Wednesday afternoon slots",
    outcome1Kicker: "MEETING BOOKED",
    outcome1Title: "Wednesday · 2:30 PM walkthrough locked",
    outcome1Logo: "/images/integrations/google-calendar.svg",
    outcome2Kicker: "CRM BRIEF",
    outcome2Title: "HubSpot lead & chat notes saved",
    outcome2Logo: "/images/company-logos/hubspot.svg",
    metricVal: "3.1x",
    metricTitle: "Higher chat-to-demo conversion",
    metricDetail: "Booked directly in widget",
    stats: [
      { label: "Slot Booked", value: "92%", pct: 92 },
      { label: "CRM Synced", value: "100%", pct: 100 },
    ],
    lines: [
      { speaker: "caller" as const, text: "Can we book a quick walkthrough for our clinic?" },
      { speaker: "agent" as const, text: "Of course. What kind of calls or messages do you want to automate first?" },
      { speaker: "caller" as const, text: "Appointment booking and reminder follow-ups." },
      { speaker: "agent" as const, text: "Wednesday at 2:30 PM is open—I have reserved it and shared the summary." },
    ],
  },
  {
    label: "Support answers",
    purpose: "Resolve common questions from approved help content",
    step1Title: "Visitor on /integrations · Setup Question",
    step1Detail: "“Can we keep our existing business phone number with Vozon?”",
    step1Logo: "/images/integrations/googledocs.svg",
    step2Title: "Verified Help Center Retrieval",
    step2Detail: "Retrieves Telephony & SIP Trunking Guide · Zero hallucination",
    outcome1Kicker: "INSTANT ANSWER",
    outcome1Title: "SIP & forwarding steps explained",
    outcome1Logo: "/images/integrations/twilio.svg",
    outcome2Kicker: "GUIDE SHARED",
    outcome2Title: "Direct setup checklist opened",
    outcome2Logo: "/images/integrations/googledocs.svg",
    metricVal: "98%",
    metricTitle: "Policy & doc accuracy",
    metricDetail: "24/7 instant coverage",
    stats: [
      { label: "Deflected", value: "81%", pct: 81 },
      { label: "Accuracy", value: "98%", pct: 98 },
    ],
    lines: [
      { speaker: "caller" as const, text: "Can we keep our existing business phone number?" },
      { speaker: "agent" as const, text: "Yes—you can connect an existing number through SIP or supported providers." },
      { speaker: "caller" as const, text: "Where can I see the setup steps?" },
      { speaker: "agent" as const, text: "I have opened the telephony guide and can connect our team if needed." },
    ],
  },
  {
    label: "Team handoff",
    purpose: "Pass the visitor and chat summary to your team",
    step1Title: "Visitor on /enterprise · Custom Security Query",
    step1Detail: "“We need a custom CRM integration and security review.”",
    step1Logo: "/images/integrations/slack.svg",
    step2Title: "Context Collector & Specialist Router",
    step2Detail: "Captures work email, company size & attaches full chat log",
    outcome1Kicker: "TEAM NOTIFIED",
    outcome1Title: "Solutions engineer alerted in Slack",
    outcome1Logo: "/images/integrations/slack.svg",
    outcome2Kicker: "CRM RECORD",
    outcome2Title: "Salesforce opportunity created",
    outcome2Logo: "/images/integrations/salesforce.svg",
    metricVal: "100%",
    metricTitle: "Chat context attached on handoff",
    metricDetail: "No repeated visitor questions",
    stats: [
      { label: "Context Attached", value: "100%", pct: 100 },
      { label: "Team Alert", value: "0.5s", pct: 97 },
    ],
    lines: [
      { speaker: "caller" as const, text: "We have a custom CRM and need advice on connecting it." },
      { speaker: "agent" as const, text: "I can connect you with a solutions specialist. What is the best email to reach you?" },
      { speaker: "caller" as const, text: "alex@northstar.io" },
      { speaker: "agent" as const, text: "Sent—our team has your question and chat transcript ready." },
    ],
  },
];

export function WebChatbotExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scenario = scenarios[activeIndex];

  return (
    <div className="vc-experience is-laptop-layout" aria-label="Interactive Web Chatbot examples">
      <div className="vc-hero-intro">
        <span>VOZON / WEB CHATBOT</span>
        <h1>Turn website questions into conversations.</h1>
      </div>

      <div className="vc-industries" role="group" aria-label="Choose a Web Chatbot example">
        {scenarios.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={activeIndex === index}
            className={activeIndex === index ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <AnimatedStoryFlowShowcase
        key={`stage-${scenario.label}`}
        windowTitle={`WEB CHAT ASSISTANT · ${scenario.label}`}
        liveBadge="Online 24/7"
        step1={{
          kicker: "01 · VISITOR QUESTION",
          title: scenario.step1Title,
          detail: scenario.step1Detail,
          logo: scenario.step1Logo,
          tag: "Live Visitor",
          tagTone: "blue",
        }}
        connector1Label="Checks approved website & help content"
        step2={{
          kicker: "02 · VOZON WEB CHATBOT",
          title: scenario.step2Title,
          detail: scenario.step2Detail,
          icon: "spark",
          badge: "icon-badge-blue",
        }}
        connector2Label="Delivers grounded answer & next step"
        outcomes={[
          {
            kicker: scenario.outcome1Kicker,
            title: scenario.outcome1Title,
            logo: scenario.outcome1Logo,
            isPrimary: true,
          },
          {
            kicker: scenario.outcome2Kicker,
            title: scenario.outcome2Title,
            logo: scenario.outcome2Logo,
          },
        ]}
        footerMetricValue={scenario.metricVal}
        footerMetricTitle={scenario.metricTitle}
        footerMetricDetail={scenario.metricDetail}
        miniStats={scenario.stats}
      />

      <div className="vc-transcript" key={`transcript-${scenario.label}`} aria-live="polite">
        <div className="vc-transcript-heading">
          <span>EXAMPLE CONVERSATION</span>
          <strong>{scenario.purpose}</strong>
        </div>
        {scenario.lines.map((line, index) => (
          <p className={line.speaker === "caller" ? "is-caller" : "is-agent"} key={`${index}-${line.text}`}>
            <span>{line.text}</span>
          </p>
        ))}
        <div className="vc-transcript-foot">
          <i />
          <span>Answer from approved content. Capture intent. Connect your team.</span>
        </div>
      </div>
    </div>
  );
}
