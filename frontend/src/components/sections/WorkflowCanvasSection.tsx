"use client";

import Image from "next/image";
import { useState } from "react";
import "./WorkflowCanvasSection.css";

type WorkflowScenario = {
  key: string;
  label: string;
  triggerTag: string;
  liveBadge: string;
  title: string;
  subtitle: string;
  channel: string;
  event: string;
  metric: string;
  connectorLabel: string;
  agentTitle: string;
  agentStep: string;
  agentQuote: string;
  outcomes: {
    tone: "green" | "blue" | "violet";
    step: string;
    title: string;
    detail: string;
    status: string;
    icon: string;
  }[];
};

const scenarios: WorkflowScenario[] = [
  {
    key: "booking",
    label: "Appointment Booking",
    triggerTag: "01 · CALL / TRIGGER",
    liveBadge: "LIVE CALL · 01:14",
    title: "Ananya Sharma · Enquiry verified",
    subtitle: "01 · VERIFY",
    channel: "Voice Call · SIP",
    event: "Inbound booking request",
    metric: "98.6% · Slot Sync Accuracy",
    connectorLabel: "Live Call",
    agentTitle: "Thursday · 10:30 AM reserved",
    agentStep: "02 · SCHEDULE",
    agentQuote:
      '"Confirmed for Thursday at 10:30 AM. I’ve sent your calendar invite and WhatsApp pass."',
    outcomes: [
      {
        tone: "green",
        step: "03A · WHATSAPP FOLLOW-UP",
        title: "WhatsApp Confirmation",
        detail: "Instant booking pass delivered",
        status: "Delivered",
        icon: "/images/integrations/whatsapp.svg",
      },
      {
        tone: "blue",
        step: "03B · CALENDAR",
        title: "Google Calendar Sync",
        detail: "Real-time slot locked & notified",
        status: "Confirmed",
        icon: "/images/integrations/google-calendar.svg",
      },
      {
        tone: "violet",
        step: "03C · CRM SYNC",
        title: "HubSpot & Zoho Record",
        detail: "Call summary & transcript saved",
        status: "Synced",
        icon: "/images/integrations/zoho.svg",
      },
    ],
  },
  {
    key: "commerce",
    label: "Cart Recovery",
    triggerTag: "01 · SHOPIFY / TRIGGER",
    liveBadge: "WHATSAPP · 00:48",
    title: "Order #4821 · Checkout abandoned",
    subtitle: "01 · DETECT",
    channel: "WhatsApp + Voice",
    event: "Cart idle for 15 mins",
    metric: "94.2% · Recovery Confidence",
    connectorLabel: "Agent Run",
    agentTitle: "10% discount link shared",
    agentStep: "02 · RECOVER",
    agentQuote:
      '"Hi! Your items are still reserved. Want me to apply your priority checkout link on WhatsApp?"',
    outcomes: [
      {
        tone: "green",
        step: "03A · WHATSAPP CHECKOUT",
        title: "One-Tap Payment Link",
        detail: "Cart link sent in chat",
        status: "Delivered",
        icon: "/images/integrations/whatsapp.svg",
      },
      {
        tone: "blue",
        step: "03B · ORDER UPDATE",
        title: "Shopify Order Sync",
        detail: "Discount & status updated",
        status: "Updated",
        icon: "/images/company-logos/shopify.svg",
      },
      {
        tone: "violet",
        step: "03C · TEAM ALERT",
        title: "Slack Revenue Feed",
        detail: "Recovered order logged",
        status: "Synced",
        icon: "/images/integrations/slack.svg",
      },
    ],
  },
  {
    key: "sales",
    label: "Lead Qualification",
    triggerTag: "01 · LEAD / TRIGGER",
    liveBadge: "LIVE CALL · 01:42",
    title: "Rohan Verma · Enterprise Demo",
    subtitle: "01 · QUALIFY",
    channel: "Outbound Voice AI",
    event: "Web form submitted",
    metric: "96.4% · Lead Score Match",
    connectorLabel: "Live Call",
    agentTitle: "Demo qualified · Score 92/100",
    agentStep: "02 · QUALIFY",
    agentQuote:
      '"Got it—50 seats across Voice and WhatsApp. I’ve booked your team demo for Friday at 3 PM."',
    outcomes: [
      {
        tone: "green",
        step: "03A · WHATSAPP BRIEF",
        title: "WhatsApp Intro Sent",
        detail: "Meeting link & deck shared",
        status: "Delivered",
        icon: "/images/integrations/whatsapp.svg",
      },
      {
        tone: "blue",
        step: "03B · DEMO BOOKED",
        title: "Calendly Slot Locked",
        detail: "Assigned to Account Exec",
        status: "Confirmed",
        icon: "/images/integrations/calendly.svg",
      },
      {
        tone: "violet",
        step: "03C · CRM PIPELINE",
        title: "Salesforce Opportunity",
        detail: "Qualification notes attached",
        status: "Synced",
        icon: "/images/integrations/salesforce.svg",
      },
    ],
  },
  {
    key: "support",
    label: "Support & Handoff",
    triggerTag: "01 · SUPPORT / TRIGGER",
    liveBadge: "MULTICHANNEL · LIVE",
    title: "Ticket #9104 · Priority Escalation",
    subtitle: "01 · TRIAGE",
    channel: "Voice + WhatsApp",
    event: "Urgent billing query",
    metric: "99.1% · Context Accuracy",
    connectorLabel: "Handoff",
    agentTitle: "Resolved & routed with context",
    agentStep: "02 · RESOLVE",
    agentQuote:
      '"I’ve verified your invoice #9104 and attached the full call transcript for our specialist team."',
    outcomes: [
      {
        tone: "green",
        step: "03A · CUSTOMER UPDATE",
        title: "WhatsApp Ticket Status",
        detail: "Live resolution ETA shared",
        status: "Delivered",
        icon: "/images/integrations/whatsapp.svg",
      },
      {
        tone: "blue",
        step: "03B · TEAM ALERT",
        title: "Slack Escalation Channel",
        detail: "Priority summary posted",
        status: "Notified",
        icon: "/images/integrations/slack.svg",
      },
      {
        tone: "violet",
        step: "03C · AUDIT LOG",
        title: "Google Sheets & CRM",
        detail: "SLA & transcript archived",
        status: "Synced",
        icon: "/images/integrations/google-sheets.svg",
      },
    ],
  },
];

export function WorkflowCanvasSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = scenarios[activeIndex];

  return (
    <section className="wf-showcase" aria-labelledby="workflow-canvas-title">
      <div className="wf-showcase-inner">
        <div className="wf-showcase-header">
          <span className="wf-showcase-eyebrow">AGENTIC WORKFLOWS</span>
          <h2 id="workflow-canvas-title">One workflow. Every outcome.</h2>
          <p>
            From an incoming voice call or WhatsApp trigger to autonomous agent action and live CRM sync.
          </p>
        </div>

        <div className="wf-stage-layout">
          <div className="wf-tabs" role="tablist" aria-label="Workflow scenarios">
            {scenarios.map((item, idx) => (
              <button
                aria-selected={activeIndex === idx}
                className={`wf-tab-btn${activeIndex === idx ? " is-active" : ""}`}
                key={item.key}
                onClick={() => setActiveIndex(idx)}
                role="tab"
                type="button"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="wf-diagram" key={active.key}>
            {/* Stage 1: Trigger */}
            <article className="wf-card-trigger">
              <div className="wf-card-top">
                <span className="wf-step-tag">
                  <i className="wf-step-dot" aria-hidden="true" />
                  {active.triggerTag}
                </span>
                <span className="wf-live-pill">{active.liveBadge}</span>
              </div>

              <div className="wf-identity-row">
                <span className="wf-trigger-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3v3m0 12v3M3 12h3m12 0h3M6.3 6.3l2.1 2.1m7.2 7.2 2.1 2.1M17.7 6.3l-2.1 2.1M8.4 15.6l-2.1 2.1" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <strong>{active.title}</strong>
                  <small>{active.subtitle}</small>
                </div>
              </div>

              <div className="wf-meta-rows">
                <div className="wf-meta-row">
                  <span>CHANNEL</span>
                  <strong>{active.channel}</strong>
                </div>
                <div className="wf-meta-row">
                  <span>EVENT</span>
                  <strong>{active.event}</strong>
                </div>
                <div className="wf-meta-row">
                  <span>METRIC</span>
                  <strong className="is-accent">{active.metric}</strong>
                </div>
              </div>
            </article>

            {/* Connector 1 -> 2 */}
            <div className="wf-connector-mid" aria-hidden="true">
              <span className="wf-connector-pill">{active.connectorLabel}</span>
              <span className="wf-connector-line" />
            </div>

            {/* Stage 2: Vozon AI Agent */}
            <article className="wf-card-agent">
              <div className="wf-agent-top">
                <span className="wf-agent-tag">
                  <i aria-hidden="true" />
                  02 · VOZON AI AGENT
                </span>
                <span className="wf-agent-wave-badge" aria-hidden="true">
                  <span style={{ height: 6 }} />
                  <span style={{ height: 11 }} />
                  <span style={{ height: 14 }} />
                  <span style={{ height: 9 }} />
                  <span style={{ height: 12 }} />
                  <span style={{ height: 6 }} />
                </span>
              </div>

              <div className="wf-agent-main">
                <span className="wf-agent-logo" aria-hidden="true">
                  <Image alt="" height={17} src="/images/vozon-footer-v.svg" width={17} />
                </span>
                <div>
                  <strong>{active.agentTitle}</strong>
                  <small>{active.agentStep}</small>
                </div>
              </div>

              <p className="wf-agent-quote">{active.agentQuote}</p>

              <div className="wf-agent-pills">
                <span><b>✓</b> Intent Verified</span>
                <span><b>✓</b> Context Captured</span>
              </div>
            </article>

            {/* Animated Branching Connectors 2 -> 3 */}
            <svg className="wf-branches-svg" viewBox="0 0 70 220" preserveAspectRatio="none" aria-hidden="true">
              <path className="wf-branch-path" d="M 0 110 C 32 110, 32 32, 70 32" stroke="#10b981" />
              <path className="wf-branch-path" d="M 0 110 L 70 110" stroke="#3b82f6" />
              <path className="wf-branch-path" d="M 0 110 C 32 110, 32 188, 70 188" stroke="#8b5cf6" />
            </svg>

            {/* Stage 3: Outcomes */}
            <div className="wf-outcomes">
              {active.outcomes.map((out) => (
                <article className={`wf-outcome-card is-${out.tone}`} key={out.step}>
                  <span className="wf-outcome-icon">
                    <Image alt={out.title} height={17} src={out.icon} width={17} />
                  </span>
                  <div className="wf-outcome-body">
                    <small>{out.step}</small>
                    <strong>{out.title}</strong>
                    <span>{out.detail}</span>
                  </div>
                  <span className="wf-outcome-status">{out.status}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
