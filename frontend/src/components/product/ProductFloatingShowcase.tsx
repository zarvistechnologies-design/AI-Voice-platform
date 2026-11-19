"use client";

import Image from "next/image";
import { VoiceAgentVisualIcon as Icon, type IconName } from "./VoiceAgentVisualIcon";

export type StoryFlowStep = {
  kicker: string;
  title: string;
  detail: string;
  icon?: IconName;
  badge?: string;
  logo?: string;
  tag?: string;
  tagTone?: "blue" | "emerald" | "amber" | "violet";
};

export type StoryFlowOutcome = {
  kicker: string;
  title: string;
  logo?: string;
  icon?: IconName;
  badge?: string;
  isPrimary?: boolean;
};

export type FlowDiagramVariant =
  | "branch-right"
  | "dual-entry"
  | "pipeline-split"
  | "hub-orchestrator";

export type AnimatedStoryFlowProps = {
  variant?: FlowDiagramVariant;
  windowTitle: string;
  liveBadge: string;
  step1: StoryFlowStep;
  connector1Label?: string;
  step2: StoryFlowStep;
  connector2Label?: string;
  outcomes: [StoryFlowOutcome, StoryFlowOutcome];
  footerMetricValue: string;
  footerMetricTitle: string;
  footerMetricDetail?: string;
  miniStats?: { label: string; value: string; pct: number }[];
};

export function AnimatedStoryFlowShowcase({
  variant = "branch-right",
  liveBadge,
  step1,
  step2,
  outcomes,
  footerMetricValue,
  footerMetricTitle,
}: AnimatedStoryFlowProps) {
  const primaryOutcome = outcomes[0];
  const secondaryOutcome = outcomes[1];
  const actionLogo =
    primaryOutcome.logo && primaryOutcome.logo !== "/images/integrations/whatsapp.svg"
      ? primaryOutcome.logo
      : "/images/integrations/google-calendar.svg";

  // =========================================================================
  // TOPOLOGY 2: "dual-entry" (2 Converging Channels on Left -> AI Hub -> 2 Outputs)
  // =========================================================================
  if (variant === "dual-entry") {
    return (
      <div className="rflow-stage">
        <div className="rflow-diagram is-dual-entry">
          {/* LEFT: 2 Parallel Entry Channels */}
          <div className="rflow-dual-col">
            <article className="rflow-node">
              <div className="rflow-node-head">
                <span className="rflow-node-head-dot">
                  <i /> 01A · VOICE CALL LINE
                </span>
                <span className="rflow-node-badge is-live">{liveBadge}</span>
              </div>
              <div className="rflow-node-body">
                <div className="rflow-app-row">
                  <span className="rflow-app-icon">
                    <Image src="/images/integrations/twilio.svg" alt="Phone Call" width={20} height={20} />
                  </span>
                  <div className="rflow-app-copy">
                    <strong>{step1.title}</strong>
                    <small>{step1.detail}</small>
                  </div>
                </div>
              </div>
            </article>

            <article className="rflow-node">
              <div className="rflow-node-head">
                <span className="rflow-node-head-dot">
                  <i style={{ background: "#10b981" }} /> 01B · WHATSAPP / STORE
                </span>
                <span className="rflow-node-badge">Synced</span>
              </div>
              <div className="rflow-node-body">
                <div className="rflow-app-row">
                  <span className="rflow-dest-logo is-dual">
                    <Image src="/images/integrations/whatsapp.svg" alt="WhatsApp" width={18} height={18} />
                    <Image src={actionLogo} alt="" width={18} height={18} />
                  </span>
                  <div className="rflow-app-copy">
                    <strong>Omnichannel Context</strong>
                    <small>{footerMetricValue} · {footerMetricTitle}</small>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* CONVERGING SVG CURVES (2 -> 1) */}
          <div className="rflow-branch-Wrap is-two-way" aria-hidden="true">
            <svg className="rflow-branch-svg" viewBox="0 0 68 210" preserveAspectRatio="none">
              <path d="M 0 48 C 34 48, 34 105, 68 105" className="rflow-edge-bg" />
              <path d="M 0 162 C 34 162, 34 105, 68 105" className="rflow-edge-bg" />
              <path d="M 0 48 C 34 48, 34 105, 68 105" className="rflow-edge-anim" />
              <path d="M 0 162 C 34 162, 34 105, 68 105" className="rflow-edge-anim is-whatsapp" />
              <circle cx="3" cy="48" r="3.5" fill="#2457d6" />
              <circle cx="3" cy="162" r="3.5" fill="#10b981" />
              <circle cx="65" cy="105" r="4" fill="#2457d6" />
            </svg>
          </div>

          {/* CENTER: Vozon AI Omnichannel Hub */}
          <article className="rflow-node is-ai-hub">
            <div className="rflow-node-head">
              <span className="rflow-node-head-dot">
                <i style={{ background: "#60a5fa" }} /> 02 · VOZON AI ENGINE
              </span>
              <div className="rflow-ai-wave" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="rflow-node-body">
              <div className="rflow-app-row">
                <span className="rflow-app-icon">
                  <Image src="/images/integrations/vozon.svg" alt="" width={20} height={20} />
                </span>
                <div className="rflow-app-copy">
                  <strong>{step2.title}</strong>
                  <small>{step2.kicker}</small>
                </div>
              </div>
              <div className="rflow-ai-speech">{step2.detail}</div>
              <div className="rflow-ai-tags">
                <span className="rflow-ai-tag">
                  <b>✓</b> Live Lookup
                </span>
                <span className="rflow-ai-tag">
                  <b>✓</b> Instant Action
                </span>
              </div>
            </div>
          </article>

          {/* DIVERGING SVG CURVES (1 -> 2) */}
          <div className="rflow-branch-Wrap is-two-way" aria-hidden="true">
            <svg className="rflow-branch-svg" viewBox="0 0 68 210" preserveAspectRatio="none">
              <path d="M 0 105 C 34 105, 34 48, 68 48" className="rflow-edge-bg" />
              <path d="M 0 105 C 34 105, 34 162, 68 162" className="rflow-edge-bg" />
              <path d="M 0 105 C 34 105, 34 48, 68 48" className="rflow-edge-anim is-whatsapp" />
              <path d="M 0 105 C 34 105, 34 162, 68 162" className="rflow-edge-anim is-crm" />
              <circle cx="3" cy="105" r="4" fill="#2457d6" />
              <circle cx="65" cy="48" r="3.5" fill="#10b981" />
              <circle cx="65" cy="162" r="3.5" fill="#7c3aed" />
            </svg>
          </div>

          {/* RIGHT: 2 Rich Destination Cards */}
          <div className="rflow-dual-col">
            <div className="rflow-dest-card is-wa">
              <span className="rflow-dest-logo is-dual">
                <Image src="/images/integrations/whatsapp.svg" alt="WhatsApp" width={19} height={19} />
                <Image src={actionLogo} alt="" width={18} height={18} />
              </span>
              <div className="rflow-dest-copy">
                <div className="rflow-dest-top">
                  <small>03A · WHATSAPP & ACTION</small>
                  <span className="rflow-dest-status">Delivered</span>
                </div>
                <strong>{primaryOutcome.title}</strong>
                <span>{secondaryOutcome.title} · Sent in chat</span>
              </div>
            </div>

            <div className="rflow-dest-card is-crm">
              <span className="rflow-dest-logo is-dual">
                <Image src="/images/integrations/zoho.svg" alt="Zoho CRM" width={22} height={22} />
                <Image src="/images/integrations/salesforce.svg" alt="Salesforce" width={18} height={18} />
              </span>
              <div className="rflow-dest-copy">
                <div className="rflow-dest-top">
                  <small>03B · ZOHO & CRM RECORD</small>
                  <span className="rflow-dest-status">Synced</span>
                </div>
                <strong>Zoho CRM & Helpdesk Sync</strong>
                <span>Full call & chat history attached</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPOLOGY 3: "pipeline-split" (Call -> Vozon AI -> Decision Router -> 3 Tools)
  // =========================================================================
  if (variant === "pipeline-split") {
    return (
      <div className="rflow-stage">
        <div className="rflow-diagram is-pipeline-split">
          {/* STAGE 1: Call & Verification */}
          <article className="rflow-node">
            <div className="rflow-node-head">
              <span className="rflow-node-head-dot">
                <i /> 01 · CALL LINE
              </span>
              <span className="rflow-node-badge is-live">Verified</span>
            </div>
            <div className="rflow-node-body">
              <div className="rflow-app-row">
                <span className="rflow-app-icon">
                  <Image src="/images/integrations/twilio.svg" alt="Call" width={20} height={20} />
                </span>
                <div className="rflow-app-copy">
                  <strong>{step1.title}</strong>
                  <small>{step1.kicker}</small>
                </div>
              </div>
              <div className="rflow-meta-list">
                <div className="rflow-meta-item">
                  <span>EVENT</span>
                  <strong>{step1.detail}</strong>
                </div>
              </div>
            </div>
          </article>

          {/* Connector 1 */}
          <div className="rflow-conn-horizontal" aria-hidden="true">
            <svg viewBox="0 0 36 24">
              <line x1="0" y1="12" x2="36" y2="12" className="rflow-edge-bg" />
              <line x1="0" y1="12" x2="36" y2="12" className="rflow-edge-anim" />
            </svg>
          </div>

          {/* STAGE 2: Vozon AI Voice Agent */}
          <article className="rflow-node is-ai-hub">
            <div className="rflow-node-head">
              <span className="rflow-node-head-dot">
                <i style={{ background: "#60a5fa" }} /> 02 · VOZON AI
              </span>
              <div className="rflow-ai-wave" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="rflow-node-body">
              <div className="rflow-app-row">
                <span className="rflow-app-icon">
                  <Image src="/images/integrations/vozon.svg" alt="" width={19} height={19} />
                </span>
                <div className="rflow-app-copy">
                  <strong>{step2.title}</strong>
                  <small>Policy & Guardrail Active</small>
                </div>
              </div>
              <div className="rflow-ai-speech">{step2.detail}</div>
            </div>
          </article>

          {/* Connector 2 */}
          <div className="rflow-conn-horizontal" aria-hidden="true">
            <svg viewBox="0 0 36 24">
              <line x1="0" y1="12" x2="36" y2="12" className="rflow-edge-bg" />
              <line x1="0" y1="12" x2="36" y2="12" className="rflow-edge-anim is-crm" />
            </svg>
          </div>

          {/* STAGE 3: Smart Decision Router Node */}
          <div className="rflow-router-node">
            <div className="rflow-router-head">
              <Icon name="branch" /> 03 · OUTCOME ROUTER
            </div>
            <div className="rflow-router-rule">
              <span>WhatsApp Pass</span>
              <b>Send</b>
            </div>
            <div className="rflow-router-rule">
              <span>{secondaryOutcome.title}</span>
              <b>Lock</b>
            </div>
            <div className="rflow-router-rule">
              <span>Zoho / CRM</span>
              <b>Log</b>
            </div>
          </div>

          {/* Branching SVG Curves */}
          <div className="rflow-branch-Wrap" aria-hidden="true">
            <svg className="rflow-branch-svg" viewBox="0 0 56 270" preserveAspectRatio="none">
              <path d="M 0 135 C 26 135, 28 42, 56 42" className="rflow-edge-bg" />
              <path d="M 0 135 L 56 135" className="rflow-edge-bg" />
              <path d="M 0 135 C 26 135, 28 228, 56 228" className="rflow-edge-bg" />
              <path d="M 0 135 C 26 135, 28 42, 56 42" className="rflow-edge-anim is-whatsapp" />
              <path d="M 0 135 L 56 135" className="rflow-edge-anim" />
              <path d="M 0 135 C 26 135, 28 228, 56 228" className="rflow-edge-anim is-crm" />
            </svg>
          </div>

          {/* STAGE 4: 3 Destination Nodes */}
          <div className="rflow-destinations">
            <div className="rflow-dest-card is-wa">
              <span className="rflow-dest-logo">
                <Image src="/images/integrations/whatsapp.svg" alt="WhatsApp" width={19} height={19} />
              </span>
              <div className="rflow-dest-copy">
                <div className="rflow-dest-top">
                  <small>WHATSAPP LINK</small>
                  <span className="rflow-dest-status">Sent</span>
                </div>
                <strong>{primaryOutcome.title}</strong>
              </div>
            </div>

            <div className="rflow-dest-card is-cal">
              <span className="rflow-dest-logo">
                <Image src={actionLogo} alt="" width={19} height={19} />
              </span>
              <div className="rflow-dest-copy">
                <div className="rflow-dest-top">
                  <small>{primaryOutcome.kicker}</small>
                  <span className="rflow-dest-status">Verified</span>
                </div>
                <strong>{secondaryOutcome.title}</strong>
              </div>
            </div>

            <div className="rflow-dest-card is-crm">
              <span className="rflow-dest-logo is-dual">
                <Image src="/images/integrations/zoho.svg" alt="Zoho CRM" width={20} height={20} />
                <Image src="/images/integrations/salesforce.svg" alt="Salesforce" width={17} height={17} />
              </span>
              <div className="rflow-dest-copy">
                <div className="rflow-dest-top">
                  <small>ZOHO & CRM AUDIT</small>
                  <span className="rflow-dest-status">Saved</span>
                </div>
                <strong>Zoho CRM & Ledger Record</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPOLOGY 4: "hub-orchestrator" (Call -> [AI Triage + Live Lookup Stack] -> 2 Outputs)
  // =========================================================================
  if (variant === "hub-orchestrator") {
    return (
      <div className="rflow-stage">
        <div className="rflow-diagram is-hub-orchestrator">
          {/* LEFT: Urgent Call / Dispatch Trigger */}
          <article className="rflow-node">
            <div className="rflow-node-head">
              <span className="rflow-node-head-dot">
                <i style={{ background: "#e11d48" }} /> 01 · DISPATCH CALL
              </span>
              <span className="rflow-node-badge is-live">{liveBadge}</span>
            </div>
            <div className="rflow-node-body">
              <div className="rflow-app-row">
                <span className="rflow-app-icon">
                  <Image src="/images/integrations/twilio.svg" alt="Call" width={20} height={20} />
                </span>
                <div className="rflow-app-copy">
                  <strong>{step1.title}</strong>
                  <small>{step1.kicker}</small>
                </div>
              </div>
              <div className="rflow-meta-list">
                <div className="rflow-meta-item">
                  <span>DETAILS</span>
                  <strong>{step1.detail}</strong>
                </div>
                <div className="rflow-meta-item">
                  <span>SLA METRIC</span>
                  <strong style={{ color: "#059669" }}>
                    {footerMetricValue} · {footerMetricTitle}
                  </strong>
                </div>
              </div>
            </div>
          </article>

          {/* Horizontal Connector */}
          <div className="rflow-conn-horizontal" aria-hidden="true">
            <span className="rflow-conn-pill">Triage</span>
            <svg viewBox="0 0 56 24">
              <line x1="0" y1="12" x2="56" y2="12" className="rflow-edge-bg" />
              <line x1="0" y1="12" x2="56" y2="12" className="rflow-edge-anim" />
              <circle cx="52" cy="12" r="3.5" fill="#2457d6" />
            </svg>
          </div>

          {/* CENTER STACK: AI Hub + Vertically Connected Live Tool Lookup */}
          <div className="rflow-center-stack">
            <article className="rflow-node is-ai-hub">
              <div className="rflow-node-head">
                <span className="rflow-node-head-dot">
                  <i style={{ background: "#60a5fa" }} /> 02A · VOZON AI TRIAGE
                </span>
                <div className="rflow-ai-wave" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="rflow-node-body">
                <div className="rflow-app-row">
                  <span className="rflow-app-icon">
                    <Image src="/images/integrations/vozon.svg" alt="" width={19} height={19} />
                  </span>
                  <div className="rflow-app-copy">
                    <strong>{step2.title}</strong>
                    <small>{step2.kicker}</small>
                  </div>
                </div>
                <div className="rflow-ai-speech">{step2.detail}</div>
              </div>
            </article>

            <div className="rflow-vert-bridge" aria-hidden="true">
              <i className="rflow-vert-line" />
              <span className="rflow-vert-pill">↕ Live Schedule & Roster Sync</span>
            </div>

            <article className="rflow-node">
              <div className="rflow-node-body" style={{ padding: "10px 13px" }}>
                <div className="rflow-app-row">
                  <span className="rflow-dest-logo">
                    <Image src="/images/integrations/google-calendar.svg" alt="Calendar" width={18} height={18} />
                  </span>
                  <div className="rflow-app-copy">
                    <strong>02B · {secondaryOutcome.title}</strong>
                    <small>Verified territory, slot & crew availability</small>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Diverging SVG Curves to Right */}
          <div className="rflow-branch-Wrap is-two-way" aria-hidden="true">
            <svg className="rflow-branch-svg" viewBox="0 0 68 210" preserveAspectRatio="none">
              <path d="M 0 90 C 34 90, 34 48, 68 48" className="rflow-edge-bg" />
              <path d="M 0 120 C 34 120, 34 162, 68 162" className="rflow-edge-bg" />
              <path d="M 0 90 C 34 90, 34 48, 68 48" className="rflow-edge-anim is-whatsapp" />
              <path d="M 0 120 C 34 120, 34 162, 68 162" className="rflow-edge-anim is-crm" />
              <circle cx="3" cy="90" r="3.5" fill="#2457d6" />
              <circle cx="3" cy="120" r="3.5" fill="#10b981" />
              <circle cx="65" cy="48" r="3.5" fill="#10b981" />
              <circle cx="65" cy="162" r="3.5" fill="#7c3aed" />
            </svg>
          </div>

          {/* RIGHT: WhatsApp ETA Pass + Zoho CRM & Dispatch Board */}
          <div className="rflow-dual-col">
            <div className="rflow-dest-card is-wa">
              <span className="rflow-dest-logo">
                <Image src="/images/integrations/whatsapp.svg" alt="WhatsApp" width={20} height={20} />
              </span>
              <div className="rflow-dest-copy">
                <div className="rflow-dest-top">
                  <small>03A · WHATSAPP ETA PASS</small>
                  <span className="rflow-dest-status">Delivered</span>
                </div>
                <strong>{primaryOutcome.title}</strong>
                <span>Live tracking & confirmation sent on WhatsApp</span>
              </div>
            </div>

            <div className="rflow-dest-card is-crm">
              <span className="rflow-dest-logo is-dual">
                <Image src="/images/integrations/zoho.svg" alt="Zoho CRM" width={21} height={21} />
                <Image src="/images/integrations/slack.svg" alt="Slack" width={17} height={17} />
              </span>
              <div className="rflow-dest-copy">
                <div className="rflow-dest-top">
                  <small>03B · ZOHO CRM & DISPATCH</small>
                  <span className="rflow-dest-status">Dispatched</span>
                </div>
                <strong>Zoho CRM & Crew Alerted</strong>
                <span>Work order, address & gate code synced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPOLOGY 1 (Default): "branch-right" (1 Call -> Vozon AI Hub -> 3 Tools)
  // =========================================================================
  return (
    <div className="rflow-stage">
      <div className="rflow-diagram">
        {/* STAGE 1 (Left): Phone Call / Trigger Node */}
        <article className="rflow-node">
          <div className="rflow-node-head">
            <span className="rflow-node-head-dot">
              <i /> 01 · CALL / TRIGGER
            </span>
            <span className="rflow-node-badge is-live">{liveBadge}</span>
          </div>

          <div className="rflow-node-body">
            <div className="rflow-app-row">
              <span className="rflow-app-icon">
                <Image
                  src={step1.logo ?? "/images/integrations/twilio.svg"}
                  alt=""
                  width={20}
                  height={20}
                />
              </span>
              <div className="rflow-app-copy">
                <strong>{step1.title}</strong>
                <small>{step1.kicker}</small>
              </div>
            </div>

            <div className="rflow-meta-list">
              <div className="rflow-meta-item">
                <span>CHANNEL</span>
                <strong>Voice Call · SIP</strong>
              </div>
              <div className="rflow-meta-item">
                <span>EVENT</span>
                <strong>{step1.detail}</strong>
              </div>
              <div className="rflow-meta-item">
                <span>METRIC</span>
                <strong style={{ color: "#2457d6" }}>
                  {footerMetricValue} · {footerMetricTitle}
                </strong>
              </div>
            </div>
          </div>
        </article>

        {/* ANIMATED CONNECTOR 1: Call Trigger -> Vozon AI Hub */}
        <div className="rflow-conn-horizontal" aria-hidden="true">
          <span className="rflow-conn-pill">Live Call</span>
          <svg viewBox="0 0 54 24">
            <line x1="0" y1="12" x2="54" y2="12" className="rflow-edge-bg" />
            <line x1="0" y1="12" x2="54" y2="12" className="rflow-edge-anim" />
            <circle cx="50" cy="12" r="3.5" fill="#2457d6" />
          </svg>
        </div>

        {/* STAGE 2 (Center): Vozon AI Voice Agent Hub Node */}
        <article className="rflow-node is-ai-hub">
          <div className="rflow-node-head">
            <span className="rflow-node-head-dot">
              <i style={{ background: "#60a5fa" }} /> 02 · VOZON AI AGENT
            </span>
            <div className="rflow-ai-wave" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>

          <div className="rflow-node-body">
            <div className="rflow-app-row">
              <span className="rflow-app-icon">
                <Image src="/images/integrations/vozon.svg" alt="" width={20} height={20} />
              </span>
              <div className="rflow-app-copy">
                <strong>{step2.title}</strong>
                <small>{step2.kicker}</small>
              </div>
            </div>

            <div className="rflow-ai-speech">{step2.detail}</div>

            <div className="rflow-ai-tags">
              <span className="rflow-ai-tag">
                <b>✓</b> Intent Verified
              </span>
              <span className="rflow-ai-tag">
                <b>✓</b> Context Captured
              </span>
            </div>
          </div>
        </article>

        {/* ANIMATED CONNECTOR 2: Branching SVG Bezier Curves to 3 Real Tools */}
        <div className="rflow-branch-Wrap" aria-hidden="true">
          <svg className="rflow-branch-svg" viewBox="0 0 74 270" preserveAspectRatio="none">
            <path d="M 0 135 C 34 135, 36 42, 74 42" className="rflow-edge-bg" />
            <path d="M 0 135 L 74 135" className="rflow-edge-bg" />
            <path d="M 0 135 C 34 135, 36 228, 74 228" className="rflow-edge-bg" />

            <path d="M 0 135 C 34 135, 36 42, 74 42" className="rflow-edge-anim is-whatsapp" />
            <path d="M 0 135 L 74 135" className="rflow-edge-anim" />
            <path d="M 0 135 C 34 135, 36 228, 74 228" className="rflow-edge-anim is-crm" />

            <circle cx="3" cy="135" r="4" fill="#2457d6" />
            <circle cx="71" cy="42" r="3.5" fill="#10b981" />
            <circle cx="71" cy="135" r="3.5" fill="#2457d6" />
            <circle cx="71" cy="228" r="3.5" fill="#7c3aed" />
          </svg>
        </div>

        {/* STAGE 3 (Right): 3 Connected Tool Nodes (WhatsApp + Calendar/Action + Zoho/Salesforce CRM) */}
        <div className="rflow-destinations">
          {/* Destination 1: WhatsApp Business */}
          <div className="rflow-dest-card is-wa">
            <span className="rflow-dest-logo">
              <Image src="/images/integrations/whatsapp.svg" alt="WhatsApp" width={20} height={20} />
            </span>
            <div className="rflow-dest-copy">
              <div className="rflow-dest-top">
                <small>03A · WHATSAPP FOLLOW-UP</small>
                <span className="rflow-dest-status">Delivered</span>
              </div>
              <strong>WhatsApp Business Pass</strong>
              <span>{primaryOutcome.title}</span>
            </div>
          </div>

          {/* Destination 2: Calendar / Action System */}
          <div className="rflow-dest-card is-cal">
            <span className="rflow-dest-logo">
              <Image src={actionLogo} alt="Calendar & Action" width={20} height={20} />
            </span>
            <div className="rflow-dest-copy">
              <div className="rflow-dest-top">
                <small>03B · {primaryOutcome.kicker}</small>
                <span className="rflow-dest-status">Confirmed</span>
              </div>
              <strong>{secondaryOutcome.title}</strong>
              <span>Real-time schedule & action sync</span>
            </div>
          </div>

          {/* Destination 3: Zoho CRM / Salesforce / HubSpot */}
          <div className="rflow-dest-card is-crm">
            <span className="rflow-dest-logo is-dual">
              <Image src="/images/integrations/zoho.svg" alt="Zoho CRM" width={22} height={22} />
              <Image src="/images/integrations/salesforce.svg" alt="Salesforce" width={18} height={18} />
            </span>
            <div className="rflow-dest-copy">
              <div className="rflow-dest-top">
                <small>03C · ZOHO & CRM SYNC</small>
                <span className="rflow-dest-status">Synced</span>
              </div>
              <strong>Zoho CRM & Salesforce Record</strong>
              <span>Call summary, transcript & next task saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FloatingRingBadge({
  percent,
  color = "#2457d6",
  trackColor = "#dbe7ff",
  kicker,
  title,
  detail,
}: {
  percent: number;
  color?: string;
  trackColor?: string;
  kicker: string;
  title: string;
  detail: string;
}) {
  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="fshow-pop-bottom-left">
      <div className="fshow-ring-wrap">
        <svg viewBox="0 0 56 56" aria-hidden="true">
          <circle
            className="fshow-ring-bg"
            cx="28"
            cy="28"
            r={radius}
            style={{ stroke: trackColor }}
          />
          <circle
            className="fshow-ring-fill"
            cx="28"
            cy="28"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ stroke: color }}
          />
        </svg>
        <span className="fshow-ring-value">{percent}%</span>
      </div>
      <div className="fshow-ring-meta">
        <small style={{ color }}>{kicker}</small>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}
