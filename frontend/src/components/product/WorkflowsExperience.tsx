"use client";

import { useState } from "react";
import { AnimatedStoryFlowShowcase } from "./ProductFloatingShowcase";
import type { IconName } from "./VoiceAgentVisualIcon";

type WorkflowScenario = {
  label: string;
  purpose: string;
  triggerLogo: string;
  triggerName: string;
  triggerDetail: string;
  agentIcon: IconName;
  agentTitle: string;
  agentDetail: string;
  branchA: { logo: string; label: string; pct: number; action: string };
  branchB: { logo: string; label: string; pct: number; action: string };
  branchC: { label: string; pct: number };
  ringPct: number;
  ringTitle: string;
  ringDetail: string;
  lines: { speaker: "agent" | "caller"; text: string }[];
};

const scenarios: WorkflowScenario[] = [
  {
    label: "Qualify & book",
    purpose: "From new lead to confirmed meeting",
    triggerLogo: "/images/company-logos/hubspot.svg",
    triggerName: "HubSpot Lead · 12-person enquiry",
    triggerDetail: "Website form submitted · Instant outbound trigger",
    agentIcon: "phone",
    agentTitle: "Voice Qualification Agent",
    agentDetail: "Confirms team size (12 seats) and next-month rollout",
    branchA: {
      logo: "/images/integrations/google-calendar.svg",
      label: "Booked Slot",
      pct: 68,
      action: "Wednesday · 2:30 PM confirmed",
    },
    branchB: {
      logo: "/images/integrations/whatsapp.svg",
      label: "WhatsApp Pass",
      pct: 22,
      action: "Written details & link sent",
    },
    branchC: { label: "Sales Handoff", pct: 10 },
    ringPct: 96,
    ringTitle: "Leads routed automatically",
    ringDetail: "Avg routing speed: 1.1s",
    lines: [
      { speaker: "caller", text: "New lead submits an enquiry for a 12-person team." },
      { speaker: "agent", text: "Workflow starts an AI voice call to understand timing and scope." },
      { speaker: "caller", text: "Prospect confirms they want to start next month." },
      { speaker: "agent", text: "Branch books Wednesday at 2:30 PM and sends a confirmation." },
    ],
  },
  {
    label: "Commerce recovery",
    purpose: "Follow up on unfinished orders",
    triggerLogo: "/images/company-logos/shopify.svg",
    triggerName: "Shopify Checkout · Saved Cart",
    triggerDetail: "Studio Headphones left in cart · 30m trigger",
    agentIcon: "message",
    agentTitle: "WhatsApp + Voice Agent",
    agentDetail: "Answers blue color stock question & shares checkout link",
    branchA: {
      logo: "/images/integrations/whatsapp.svg",
      label: "Cart Restored",
      pct: 64,
      action: "Direct checkout link opened",
    },
    branchB: {
      logo: "/images/integrations/slack.svg",
      label: "Support Route",
      pct: 24,
      action: "Sizing question to specialist",
    },
    branchC: { label: "Scheduled Retry", pct: 12 },
    ringPct: 92,
    ringTitle: "Saved carts reached",
    ringDetail: "24h window active",
    lines: [
      { speaker: "caller", text: "Customer leaves Studio Headphones in their saved cart." },
      { speaker: "agent", text: "Workflow sends an approved reminder and answers their reply." },
      { speaker: "caller", text: "Shopper asks if the blue color is in stock." },
      { speaker: "agent", text: "Stock confirmed and direct cart link shared in chat." },
    ],
  },
  {
    label: "Support & escalate",
    purpose: "Resolve routine cases or bring in a specialist",
    triggerLogo: "/images/company-logos/zendesk.svg",
    triggerName: "Support Request · Order #2048",
    triggerDetail: "Inbound customer call regarding delayed delivery",
    agentIcon: "spark",
    agentTitle: "Triage & Lookup Agent",
    agentDetail: "Retrieves courier scan & replacement preference",
    branchA: {
      logo: "/images/integrations/whatsapp.svg",
      label: "Auto-Resolved",
      pct: 74,
      action: "Courier tracking shared",
    },
    branchB: {
      logo: "/images/integrations/slack.svg",
      label: "Warm Handoff",
      pct: 18,
      action: "Summary sent to specialist",
    },
    branchC: { label: "Callback Booked", pct: 8 },
    ringPct: 98,
    ringTitle: "Context preserved",
    ringDetail: "0 repeated customer questions",
    lines: [
      { speaker: "caller", text: "Customer asks about a damaged item on order #2048." },
      { speaker: "agent", text: "Agent gathers order reference and replacement preference." },
      { speaker: "caller", text: "Workflow branches replacement approvals to your support team." },
      { speaker: "agent", text: "Specialist receives the full summary without starting over." },
    ],
  },
  {
    label: "Appointment care",
    purpose: "Confirm or reschedule upcoming bookings",
    triggerLogo: "/images/integrations/calendly.svg",
    triggerName: "24h Pre-Visit Reminder",
    triggerDetail: "Scheduled clinic visit · Outbound attendance check",
    agentIcon: "calendar",
    agentTitle: "Attendance & Reschedule Agent",
    agentDetail: "Checks open Friday afternoon slots & locks 3:00 PM",
    branchA: {
      logo: "/images/integrations/google-calendar.svg",
      label: "Confirmed",
      pct: 78,
      action: "Attendance marked ready",
    },
    branchB: {
      logo: "/images/integrations/calendly.svg",
      label: "Rescheduled",
      pct: 16,
      action: "Moved to Friday · 3:00 PM",
    },
    branchC: { label: "Staff Notified", pct: 6 },
    ringPct: 97,
    ringTitle: "Schedules kept in sync",
    ringDetail: "Real-time calendar write",
    lines: [
      { speaker: "caller", text: "Reminder triggers 24 hours before a scheduled visit." },
      { speaker: "agent", text: "Caller asks to move the appointment to Friday afternoon." },
      { speaker: "caller", text: "Workflow checks open Friday slots and reserves 3:00 PM." },
      { speaker: "agent", text: "Updated calendar pass sent on WhatsApp automatically." },
    ],
  },
];

export function WorkflowsExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scenario = scenarios[activeIndex];

  return (
    <div className="vc-experience is-laptop-layout" aria-label="Interactive Vozon Workflows examples">
      <div className="vc-hero-intro">
        <span>VOZON / WORKFLOWS</span>
        <h1>Build a workflow around what happens next.</h1>
      </div>

      <div className="vc-industries" role="group" aria-label="Choose a workflow example">
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
        windowTitle={`WORKFLOW ENGINE · ${scenario.label}`}
        liveBadge="Active Flow"
        step1={{
          kicker: "01 · STARTING TRIGGER",
          title: scenario.triggerName,
          detail: scenario.triggerDetail,
          logo: scenario.triggerLogo,
          tag: "Event Captured",
          tagTone: "amber",
        }}
        connector1Label="Triggers live AI conversation"
        step2={{
          kicker: "02 · VOZON AI CONVERSATION",
          title: scenario.agentTitle,
          detail: scenario.agentDetail,
          icon: scenario.agentIcon,
          badge: "icon-badge-blue",
        }}
        connector2Label="Evaluates outcome & branches automatically"
        outcomes={[
          {
            kicker: `BRANCH A · ${scenario.branchA.pct}%`,
            title: scenario.branchA.action,
            logo: scenario.branchA.logo,
            isPrimary: true,
          },
          {
            kicker: `BRANCH B · ${scenario.branchB.pct}%`,
            title: scenario.branchB.action,
            logo: scenario.branchB.logo,
          },
        ]}
        footerMetricValue={`${scenario.ringPct}%`}
        footerMetricTitle={scenario.ringTitle}
        footerMetricDetail={scenario.ringDetail}
        miniStats={[
          { label: scenario.branchA.label, value: `${scenario.branchA.pct}%`, pct: scenario.branchA.pct },
          { label: scenario.branchB.label, value: `${scenario.branchB.pct}%`, pct: scenario.branchB.pct },
        ]}
      />

      <div className="vc-transcript" key={`transcript-${scenario.label}`} aria-live="polite">
        <div className="vc-transcript-heading">
          <span>WORKFLOW SEQUENCE</span>
          <strong>{scenario.purpose}</strong>
        </div>
        {scenario.lines.map((line, index) => (
          <p className={line.speaker === "caller" ? "is-caller" : "is-agent"} key={`${index}-${line.text}`}>
            <span>{line.text}</span>
          </p>
        ))}
        <div className="vc-transcript-foot">
          <i />
          <span>Start with an event. Add the conversation. Branch by outcome.</span>
        </div>
      </div>
    </div>
  );
}
