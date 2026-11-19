"use client";

import { useState } from "react";
import { AnimatedStoryFlowShowcase } from "./ProductFloatingShowcase";

const scenarios = [
  {
    label: "Lead to booked meeting",
    purpose: "From first enquiry to confirmed calendar slot",
    step1Title: "Website Enquiry · 12-Person Team",
    step1Detail: "Prospect submits demo request · Outbound voice call initiated in 18s",
    step1Logo: "/images/company-logos/hubspot.svg",
    step2Title: "Vozon Voice Agent + MCP Calendar Check",
    step2Detail: "Qualifies next-month rollout & locks Wednesday 2:30 PM slot",
    outcome1Kicker: "CALENDAR BOOKED",
    outcome1Title: "Wed · 2:30 PM added to Google Calendar",
    outcome1Logo: "/images/integrations/google-calendar.svg",
    outcome2Kicker: "WHATSAPP & CRM",
    outcome2Title: "Written pass sent + HubSpot updated",
    outcome2Logo: "/images/integrations/whatsapp.svg",
    metricVal: "98.4%",
    metricTitle: "End-to-end journey completion",
    metricDetail: "Zero manual copy-pasting",
    stats: [
      { label: "Booked", value: "98.4%", pct: 98 },
      { label: "CRM Synced", value: "100%", pct: 100 },
    ],
    lines: [
      { speaker: "caller" as const, text: "Prospect submits an enquiry on your website." },
      { speaker: "agent" as const, text: "Voice agent calls, confirms a 12-person team, and books Wednesday at 2:30 PM." },
      { speaker: "caller" as const, text: "Customer receives the calendar pass on WhatsApp immediately." },
      { speaker: "agent" as const, text: "Sales gets the complete summary and confirmed meeting in HubSpot." },
    ],
  },
  {
    label: "Support to resolution",
    purpose: "Resolve routine issues or bring in your team with context",
    step1Title: "Customer Support Call · Order #2048",
    step1Detail: "Caller asks about delayed delivery on incoming support line",
    step1Logo: "/images/company-logos/shopify.svg",
    step2Title: "Vozon Triage Agent + Courier Lookup",
    step2Detail: "Checks Shopify shipment status & shares live tracking link",
    outcome1Kicker: "WHATSAPP TRACKING",
    outcome1Title: "Live courier link delivered in chat",
    outcome1Logo: "/images/integrations/whatsapp.svg",
    outcome2Kicker: "ZENDESK RECORD",
    outcome2Title: "Ticket updated with call summary",
    outcome2Logo: "/images/company-logos/zendesk.svg",
    metricVal: "99.1%",
    metricTitle: "Context preserved across channels",
    metricDetail: "Voice + WhatsApp + Helpdesk",
    stats: [
      { label: "First-Call Fix", value: "82%", pct: 82 },
      { label: "Context Kept", value: "99.1%", pct: 99 },
    ],
    lines: [
      { speaker: "caller" as const, text: "Customer asks about a delayed delivery on order #2048." },
      { speaker: "agent" as const, text: "Agent checks the order status and shares the updated delivery window." },
      { speaker: "caller" as const, text: "Customer asks for a written tracking link." },
      { speaker: "agent" as const, text: "WhatsApp message is sent and the support record is updated." },
    ],
  },
  {
    label: "Call to WhatsApp follow-up",
    purpose: "Carry the spoken conversation into messaging",
    step1Title: "Inbound Pricing Call · 20-Seat Quote",
    step1Detail: "Caller discusses team requirements and asks for written quote",
    step1Logo: "/images/integrations/twilio.svg",
    step2Title: "Vozon Workflow Engine · Cross-Channel Bridge",
    step2Detail: "Generates tailored quote summary & triggers WhatsApp template",
    outcome1Kicker: "WHATSAPP THREAD",
    outcome1Title: "Written quote & booking link opened",
    outcome1Logo: "/images/integrations/whatsapp.svg",
    outcome2Kicker: "SALESFORCE SYNC",
    outcome2Title: "Call + chat linked on one record",
    outcome2Logo: "/images/integrations/salesforce.svg",
    metricVal: "97.6%",
    metricTitle: "Cross-channel continuation rate",
    metricDetail: "Instant voice-to-WhatsApp bridge",
    stats: [
      { label: "Delivered", value: "99.8%", pct: 99 },
      { label: "Continued", value: "97.6%", pct: 98 },
    ],
    lines: [
      { speaker: "caller" as const, text: "Can you send me the pricing breakdown we just discussed?" },
      { speaker: "agent" as const, text: "I have sent the summary and next-step link to your WhatsApp." },
      { speaker: "caller" as const, text: "Got it—I will share this with my co-founder today." },
      { speaker: "agent" as const, text: "Your account manager has the call notes ready whenever you reply." },
    ],
  },
  {
    label: "Human oversight & handoff",
    purpose: "Keep a clear record when a specialist steps in",
    step1Title: "Enterprise Call · Custom Security Review",
    step1Detail: "Caller requests custom architecture & compliance sign-off",
    step1Logo: "/images/integrations/salesforce.svg",
    step2Title: "Vozon Human-in-the-Loop Escalation",
    step2Detail: "Packages verified caller intent, transcript & assigns account owner",
    outcome1Kicker: "SPECIALIST ALERTED",
    outcome1Title: "Assigned owner briefed in Slack",
    outcome1Logo: "/images/integrations/slack.svg",
    outcome2Kicker: "CRM TASK",
    outcome2Title: "Priority review logged in Salesforce",
    outcome2Logo: "/images/integrations/salesforce.svg",
    metricVal: "100%",
    metricTitle: "Accountable owner assigned",
    metricDetail: "Full transcript attached",
    stats: [
      { label: "Owner Assigned", value: "100%", pct: 100 },
      { label: "Brief Attached", value: "100%", pct: 100 },
    ],
    lines: [
      { speaker: "caller" as const, text: "We need a custom rollout across three regional offices." },
      { speaker: "agent" as const, text: "I have captured your requirements and assigned a solutions lead." },
      { speaker: "caller" as const, text: "When will they reach out?" },
      { speaker: "agent" as const, text: "They have the full summary now and will join your scheduled call." },
    ],
  },
];

export function EndToEndAutomationExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scenario = scenarios[activeIndex];

  return (
    <div className="vc-experience is-laptop-layout" aria-label="Interactive End-to-End Automation examples">
      <div className="vc-hero-intro">
        <span>VOZON / END-TO-END AUTOMATION</span>
        <h1>Connect the whole journey, start to finish.</h1>
      </div>

      <div className="vc-industries" role="group" aria-label="Choose an end-to-end journey">
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
        windowTitle={`END-TO-END JOURNEY · ${scenario.label}`}
        liveBadge="Unified State"
        step1={{
          kicker: "01 · ENTRY POINT",
          title: scenario.step1Title,
          detail: scenario.step1Detail,
          logo: scenario.step1Logo,
          tag: "Journey Started",
          tagTone: "amber",
        }}
        connector1Label="Carries caller context into live conversation"
        step2={{
          kicker: "02 · VOZON AI + CONNECTED TOOLS",
          title: scenario.step2Title,
          detail: scenario.step2Detail,
          icon: "layers",
          badge: "icon-badge-blue",
        }}
        connector2Label="Completes follow-up & updates system of record"
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
          <span>COMPLETE JOURNEY</span>
          <strong>{scenario.purpose}</strong>
        </div>
        {scenario.lines.map((line, index) => (
          <p className={line.speaker === "caller" ? "is-caller" : "is-agent"} key={`${index}-${line.text}`}>
            <span>{line.text}</span>
          </p>
        ))}
        <div className="vc-transcript-foot">
          <i />
          <span>Map the entry point. Connect the tools. Review every handoff.</span>
        </div>
      </div>
    </div>
  );
}
