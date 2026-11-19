"use client";

import { useState } from "react";
import { AnimatedStoryFlowShowcase } from "./ProductFloatingShowcase";

const scenarios = [
  {
    label: "Calendar lookup",
    purpose: "Check real availability during the call",
    step1Title: "Live Caller Request · “Any slots Wednesday?”",
    step1Detail: "Agent invokes `calendar.check_availability(day: 'Wed')`",
    step1Logo: "/images/integrations/google-calendar.svg",
    step2Title: "Vozon MCP Server · Scoped Tool Execution",
    step2Detail: "Verifies read/write permission & queries Google Calendar in 28ms",
    outcome1Kicker: "SLOT RESERVED",
    outcome1Title: "Wednesday · 2:30 PM locked on calendar",
    outcome1Logo: "/images/integrations/google-calendar.svg",
    outcome2Kicker: "CONFIRMATION",
    outcome2Title: "WhatsApp calendar pass dispatched",
    outcome2Logo: "/images/integrations/whatsapp.svg",
    metricVal: "28ms",
    metricTitle: "MCP tool round-trip latency",
    metricDetail: "100% schema validated",
    stats: [
      { label: "Schema Valid", value: "100%", pct: 100 },
      { label: "Speed", value: "28ms", pct: 96 },
    ],
    lines: [
      { speaker: "caller" as const, text: "Do you have any slots open this Wednesday afternoon?" },
      { speaker: "agent" as const, text: "Checking the calendar now—2:30 PM and 4:00 PM are open." },
      { speaker: "caller" as const, text: "2:30 PM works for me." },
      { speaker: "agent" as const, text: "Booked for Wednesday at 2:30 PM and added to the schedule." },
    ],
  },
  {
    label: "CRM record update",
    purpose: "Save structured call outcomes to your CRM",
    step1Title: "Qualified Call · 12 Seats · Next Month",
    step1Detail: "Agent invokes `crm.update_lead(seats: 12, stage: 'Qualified')`",
    step1Logo: "/images/integrations/salesforce.svg",
    step2Title: "Vozon MCP Server · Field-Level Guardrail",
    step2Detail: "Validates allowed CRM fields & writes summary to Salesforce",
    outcome1Kicker: "CRM UPDATED",
    outcome1Title: "Salesforce Lead #SF-904 updated",
    outcome1Logo: "/images/integrations/salesforce.svg",
    outcome2Kicker: "REP NOTIFIED",
    outcome2Title: "Account owner alerted in Slack",
    outcome2Logo: "/images/integrations/slack.svg",
    metricVal: "34ms",
    metricTitle: "CRM write execution time",
    metricDetail: "Field-scoped permissions",
    stats: [
      { label: "Fields Synced", value: "100%", pct: 100 },
      { label: "Write Speed", value: "34ms", pct: 95 },
    ],
    lines: [
      { speaker: "caller" as const, text: "We are a 12-person team looking to launch next month." },
      { speaker: "agent" as const, text: "I have noted 12 seats and a next-month timeline on your record." },
      { speaker: "caller" as const, text: "Can someone send over the onboarding checklist?" },
      { speaker: "agent" as const, text: "Our account specialist has been assigned and will send it today." },
    ],
  },
  {
    label: "Order status check",
    purpose: "Retrieve live order details before answering",
    step1Title: "Caller Inquiry · “Where is Order #2048?”",
    step1Detail: "Agent invokes `orders.get_shipment(order_id: '2048')`",
    step1Logo: "/images/company-logos/shopify.svg",
    step2Title: "Vozon MCP Server · Read-Only Store Query",
    step2Detail: "Fetches live courier scan & ETA from Shopify in 24ms",
    outcome1Kicker: "LIVE ETA SHARED",
    outcome1Title: "In transit · Arriving Thursday",
    outcome1Logo: "/images/company-logos/shopify.svg",
    outcome2Kicker: "TRACKING LINK",
    outcome2Title: "Courier map sent on WhatsApp",
    outcome2Logo: "/images/integrations/whatsapp.svg",
    metricVal: "24ms",
    metricTitle: "Store lookup response time",
    metricDetail: "Read-only token scope",
    stats: [
      { label: "Read Scope", value: "100%", pct: 100 },
      { label: "Lookup", value: "24ms", pct: 97 },
    ],
    lines: [
      { speaker: "caller" as const, text: "Could you check the status of order #2048?" },
      { speaker: "agent" as const, text: "Order #2048 is in transit and scheduled for delivery on Thursday." },
      { speaker: "caller" as const, text: "Can you text me the tracking link?" },
      { speaker: "agent" as const, text: "Done—I have sent the live tracking link to your WhatsApp." },
    ],
  },
  {
    label: "Escalation & ticket",
    purpose: "Create a structured ticket when a person is needed",
    step1Title: "Complex Request · Billing Entity Change",
    step1Detail: "Agent invokes `helpdesk.create_handoff(priority: 'High')`",
    step1Logo: "/images/company-logos/zendesk.svg",
    step2Title: "Vozon MCP Server · Human-in-the-Loop Gate",
    step2Detail: "Requires specialist approval for billing changes · Bundles transcript",
    outcome1Kicker: "TICKET #ZD-410",
    outcome1Title: "Created in Zendesk with transcript",
    outcome1Logo: "/images/company-logos/zendesk.svg",
    outcome2Kicker: "SLACK TRIAGE",
    outcome2Title: "Finance specialist alerted live",
    outcome2Logo: "/images/integrations/slack.svg",
    metricVal: "100%",
    metricTitle: "Permission boundary enforcement",
    metricDetail: "Zero unauthorized actions",
    stats: [
      { label: "Guardrail", value: "100%", pct: 100 },
      { label: "Context", value: "100%", pct: 100 },
    ],
    lines: [
      { speaker: "caller" as const, text: "I need to request a custom billing adjustment on our invoice." },
      { speaker: "agent" as const, text: "Billing adjustments are handled by our finance team—I have opened a priority ticket." },
      { speaker: "caller" as const, text: "Do I need to explain the details again?" },
      { speaker: "agent" as const, text: "No, your account reference and summary are already attached." },
    ],
  },
];

export function VozonMcpExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scenario = scenarios[activeIndex];

  return (
    <div className="vc-experience is-laptop-layout" aria-label="Interactive Vozon MCP examples">
      <div className="vc-hero-intro">
        <span>VOZON / MODEL CONTEXT PROTOCOL</span>
        <h1>Connect live business tools to every call.</h1>
      </div>

      <div className="vc-industries" role="group" aria-label="Choose a Vozon MCP example">
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
        windowTitle={`VOZON MCP PROTOCOL · ${scenario.label}`}
        liveBadge="Scoped Access"
        step1={{
          kicker: "01 · AGENT TOOL CALL",
          title: scenario.step1Title,
          detail: scenario.step1Detail,
          logo: scenario.step1Logo,
          tag: "JSON-RPC 2.0",
          tagTone: "blue",
        }}
        connector1Label="Validates schema & access permissions"
        step2={{
          kicker: "02 · VOZON MCP SERVER",
          title: scenario.step2Title,
          detail: scenario.step2Detail,
          icon: "cpu",
          badge: "icon-badge-violet",
        }}
        connector2Label="Returns structured payload to live call"
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
          <span>TOOL INTERACTION</span>
          <strong>{scenario.purpose}</strong>
        </div>
        {scenario.lines.map((line, index) => (
          <p className={line.speaker === "caller" ? "is-caller" : "is-agent"} key={`${index}-${line.text}`}>
            <span>{line.text}</span>
          </p>
        ))}
        <div className="vc-transcript-foot">
          <i />
          <span>Choose the tool. Set the boundaries. Use the result in real time.</span>
        </div>
      </div>
    </div>
  );
}
