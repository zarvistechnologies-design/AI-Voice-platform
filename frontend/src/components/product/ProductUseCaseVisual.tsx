"use client";

import Image from "next/image";
import { VoiceAgentVisualIcon as Icon, type IconName } from "./VoiceAgentVisualIcon";
import "./ProductUseCaseVisual.css";

type Props = {
  productSlug: string;
  index: number;
  storyTitle: string;
  storyBody: string;
};

type SceneConfig = {
  topIcon: IconName;
  topBadge: string;
  topLabel: string;
  topTitle: string;
  logo?: string;
  partnerName?: string;
  steps: { icon: IconName; badge: string; title: string; detail: string }[];
  outcomeText: string;
};

const productScenes: Record<string, SceneConfig[]> = {
  "whatsapp-api": [
    {
      topIcon: "phone",
      topBadge: "icon-badge-blue",
      topLabel: "VOICE CALL OUTCOME",
      topTitle: "“Wednesday · 2:30 PM confirmed on the call”",
      logo: "/images/integrations/whatsapp.svg",
      partnerName: "WhatsApp Cloud",
      steps: [
        { icon: "webhook", badge: "icon-badge-amber", title: "Call Event", detail: "Outcome captured" },
        { icon: "message", badge: "icon-badge-emerald", title: "WhatsApp API", detail: "Template sent" },
        { icon: "calendar", badge: "icon-badge-violet", title: "Calendar Pass", detail: "Link delivered" },
      ],
      outcomeText: "Written confirmation delivered in 68ms",
    },
    {
      topIcon: "message",
      topBadge: "icon-badge-emerald",
      topLabel: "INBOUND WHATSAPP MESSAGE",
      topTitle: "“We need a plan for a 15-person support team.”",
      logo: "/images/integrations/whatsapp.svg",
      partnerName: "WhatsApp Cloud",
      steps: [
        { icon: "webhook", badge: "icon-badge-amber", title: "Webhook Event", detail: "Message received" },
        { icon: "spark", badge: "icon-badge-blue", title: "Vozon Agent", detail: "Qualifies scope" },
        { icon: "database", badge: "icon-badge-violet", title: "CRM Record", detail: "Lead updated" },
      ],
      outcomeText: "Enquiry answered and logged in your CRM",
    },
    {
      topIcon: "file",
      topBadge: "icon-badge-violet",
      topLabel: "STORE SHIPPING EVENT",
      topTitle: "“Order #2048 dispatched via express courier”",
      logo: "/images/company-logos/shopify.svg",
      partnerName: "Shopify Store",
      steps: [
        { icon: "bolt", badge: "icon-badge-amber", title: "Store Trigger", detail: "Order shipped" },
        { icon: "message", badge: "icon-badge-emerald", title: "Utility Template", detail: "Tracking link" },
        { icon: "headset", badge: "icon-badge-rose", title: "Reply Route", detail: "Support ready" },
      ],
      outcomeText: "Customer can reply in the same WhatsApp thread",
    },
    {
      topIcon: "shield",
      topBadge: "icon-badge-emerald",
      topLabel: "OFFICIAL BUSINESS ACCOUNT",
      topTitle: "“Link your eligible WhatsApp Business number”",
      logo: "/images/company-logos/meta.svg",
      partnerName: "Meta Business",
      steps: [
        { icon: "phone", badge: "icon-badge-blue", title: "Business Number", detail: "Verified sender" },
        { icon: "file", badge: "icon-badge-violet", title: "Templates", detail: "Approved formats" },
        { icon: "shield", badge: "icon-badge-emerald", title: "24h Window", detail: "Policy governed" },
      ],
      outcomeText: "Permissions and message rules stay aligned",
    },
    {
      topIcon: "webhook",
      topBadge: "icon-badge-amber",
      topLabel: "EVENT-DRIVEN MESSAGING",
      topTitle: "“Connect calls, bookings, and store updates”",
      logo: "/images/integrations/whatsapp.svg",
      partnerName: "WhatsApp Cloud",
      steps: [
        { icon: "phone", badge: "icon-badge-blue", title: "Voice Call", detail: "Spoken outcome" },
        { icon: "branch", badge: "icon-badge-violet", title: "Workflow Rule", detail: "Selects template" },
        { icon: "users", badge: "icon-badge-emerald", title: "Your Team", detail: "Shared record" },
      ],
      outcomeText: "Every message stays tied to the customer record",
    },
  ],
  "web-chatbot": [
    {
      topIcon: "globe",
      topBadge: "icon-badge-blue",
      topLabel: "VISITOR QUESTION ON WEBSITE",
      topTitle: "“Which plan works best for voice and WhatsApp?”",
      logo: "/images/company-logos/notion.svg",
      partnerName: "Notion Docs",
      steps: [
        { icon: "file", badge: "icon-badge-violet", title: "Approved Docs", detail: "Product guide" },
        { icon: "spark", badge: "icon-badge-blue", title: "Clear Answer", detail: "Compares options" },
        { icon: "arrow", badge: "icon-badge-emerald", title: "Next Step", detail: "Direct page link" },
      ],
      outcomeText: "Visitors find the right option immediately",
    },
    {
      topIcon: "calendar",
      topBadge: "icon-badge-emerald",
      topLabel: "QUALIFY & BOOK IN CHAT",
      topTitle: "“Can we book a walkthrough for our 15-person team?”",
      logo: "/images/integrations/google-calendar.svg",
      partnerName: "Google Calendar",
      steps: [
        { icon: "users", badge: "icon-badge-blue", title: "15 Teammates", detail: "Scope captured" },
        { icon: "calendar", badge: "icon-badge-emerald", title: "Wed · 2:30 PM", detail: "Slot selected" },
        { icon: "database", badge: "icon-badge-violet", title: "Sales Summary", detail: "Sent to CRM" },
      ],
      outcomeText: "Walkthrough booked and shared with sales",
    },
    {
      topIcon: "file",
      topBadge: "icon-badge-violet",
      topLabel: "GROUNDED HELP ARTICLES",
      topTitle: "“Answer common questions outside office hours”",
      logo: "/images/integrations/googledocs.svg",
      partnerName: "Google Docs",
      steps: [
        { icon: "file", badge: "icon-badge-blue", title: "Help Center", detail: "Verified articles" },
        { icon: "shield", badge: "icon-badge-violet", title: "Policy Rules", detail: "Approved scope" },
        { icon: "check", badge: "icon-badge-emerald", title: "Instant Reply", detail: "24/7 coverage" },
      ],
      outcomeText: "Answers stay grounded in approved content",
    },
    {
      topIcon: "database",
      topBadge: "icon-badge-amber",
      topLabel: "CURATED SOURCES",
      topTitle: "“Choose the pages and documents the bot relies on”",
      logo: "/images/company-logos/notion.svg",
      partnerName: "Knowledge Base",
      steps: [
        { icon: "globe", badge: "icon-badge-blue", title: "Site Pages", detail: "Pricing & features" },
        { icon: "file", badge: "icon-badge-emerald", title: "PDF & Docs", detail: "Service guides" },
        { icon: "sliders", badge: "icon-badge-violet", title: "Role Rules", detail: "Clear boundaries" },
      ],
      outcomeText: "Knowledge updates whenever your offer changes",
    },
    {
      topIcon: "headset",
      topBadge: "icon-badge-rose",
      topLabel: "TEAM HANDOFF WITH CONTEXT",
      topTitle: "“Pass qualified enquiries and chat history to your team”",
      logo: "/images/integrations/slack.svg",
      partnerName: "Slack Inbox",
      steps: [
        { icon: "message", badge: "icon-badge-blue", title: "Visitor Chat", detail: "Details collected" },
        { icon: "branch", badge: "icon-badge-violet", title: "Route Rule", detail: "Matches specialist" },
        { icon: "users", badge: "icon-badge-emerald", title: "Team Inbox", detail: "Summary attached" },
      ],
      outcomeText: "Your team sees what the visitor asked before replying",
    },
  ],
  "voice-cloning": [
    {
      topIcon: "mic",
      topBadge: "icon-badge-violet",
      topLabel: "AUTHORIZED BRAND VOICE",
      topTitle: "“Keep a recognizable tone across every customer call”",
      logo: "/images/integrations/elevenlabs.png",
      partnerName: "Voice Engine",
      steps: [
        { icon: "mic", badge: "icon-badge-blue", title: "Studio Sample", detail: "48kHz recording" },
        { icon: "waveform", badge: "icon-badge-violet", title: "99.4% Match", detail: "Natural timbre" },
        { icon: "phone", badge: "icon-badge-emerald", title: "Live Calls", detail: "92ms streaming" },
      ],
      outcomeText: "Greetings and follow-ups sound like one brand",
    },
    {
      topIcon: "globe",
      topBadge: "icon-badge-emerald",
      topLabel: "MULTILINGUAL VOICE PROFILE",
      topTitle: "“Review how your chosen voice works across languages”",
      logo: "/images/integrations/sarvam.png",
      partnerName: "Multilingual AI",
      steps: [
        { icon: "globe", badge: "icon-badge-blue", title: "English & Indic", detail: "हिन्दी, தமிழ், मराठी" },
        { icon: "sliders", badge: "icon-badge-violet", title: "Natural Cadence", detail: "Local phrasing" },
        { icon: "check", badge: "icon-badge-emerald", title: "Reviewed Output", detail: "Approved pre-launch" },
      ],
      outcomeText: "Consistent voice identity across every market",
    },
    {
      topIcon: "sliders",
      topBadge: "icon-badge-amber",
      topLabel: "PRONUNCIATION & PACING",
      topTitle: "“Test pronunciation of product names and key terms”",
      logo: "/images/integrations/cartesia.png",
      partnerName: "Phonetic Lexicon",
      steps: [
        { icon: "file", badge: "icon-badge-blue", title: "Custom Terms", detail: "Brand & SKU names" },
        { icon: "sliders", badge: "icon-badge-amber", title: "Phonetic Guide", detail: "Exact reading" },
        { icon: "play", badge: "icon-badge-emerald", title: "Audio Preview", detail: "Verified by team" },
      ],
      outcomeText: "Important terms are read clearly on every call",
    },
    {
      topIcon: "shield",
      topBadge: "icon-badge-emerald",
      topLabel: "CONSENT & PERMISSIONS",
      topTitle: "“Use voice material only with verified speaker permission”",
      logo: "/images/integrations/twilio.svg",
      partnerName: "Verified Rights",
      steps: [
        { icon: "mic", badge: "icon-badge-blue", title: "Source Audio", detail: "Authorized speaker" },
        { icon: "shield", badge: "icon-badge-emerald", title: "Signed Consent", detail: "Rights verified" },
        { icon: "lock", badge: "icon-badge-violet", title: "Scoped Usage", detail: "Workspace governed" },
      ],
      outcomeText: "Every cloned voice stays tied to approved consent",
    },
    {
      topIcon: "phone",
      topBadge: "icon-badge-blue",
      topLabel: "DEPLOY ACROSS CALL FLOWS",
      topTitle: "“Assign the approved voice to your voice agents”",
      logo: "/images/integrations/twilio.svg",
      partnerName: "Twilio & SIP",
      steps: [
        { icon: "mic", badge: "icon-badge-violet", title: "Approved Voice", detail: "Studio profile" },
        { icon: "spark", badge: "icon-badge-blue", title: "Vozon Agent", detail: "Assigned in 1 click" },
        { icon: "phone", badge: "icon-badge-emerald", title: "Phone Lines", detail: "Twilio, Exotel, SIP" },
      ],
      outcomeText: "Ready for inbound and outbound customer calls",
    },
  ],
  "vozon-mcp": [
    {
      topIcon: "database",
      topBadge: "icon-badge-blue",
      topLabel: "REAL-TIME TOOL LOOKUP",
      topTitle: "“Retrieve approved customer or booking details on the call”",
      logo: "/images/integrations/google-calendar.svg",
      partnerName: "Google Calendar",
      steps: [
        { icon: "phone", badge: "icon-badge-blue", title: "Caller Asks", detail: "Wednesday slots" },
        { icon: "cpu", badge: "icon-badge-violet", title: "Vozon MCP", detail: "Queries calendar" },
        { icon: "check", badge: "icon-badge-emerald", title: "2:30 PM Open", detail: "Returned to call" },
      ],
      outcomeText: "Agent answers with live context in 28ms",
    },
    {
      topIcon: "file",
      topBadge: "icon-badge-emerald",
      topLabel: "CONNECTED SYSTEM WRITE",
      topTitle: "“Send the conversation outcome to your CRM or helpdesk”",
      logo: "/images/integrations/salesforce.svg",
      partnerName: "Salesforce CRM",
      steps: [
        { icon: "spark", badge: "icon-badge-blue", title: "Call Summary", detail: "12 seats · Next month" },
        { icon: "shield", badge: "icon-badge-violet", title: "Access Rule", detail: "Approved CRM fields" },
        { icon: "database", badge: "icon-badge-emerald", title: "Record Saved", detail: "Salesforce updated" },
      ],
      outcomeText: "Sales and support receive structured records",
    },
    {
      topIcon: "branch",
      topBadge: "icon-badge-violet",
      topLabel: "TOOL-DRIVEN ROUTING",
      topTitle: "“Use a tool result to route a request or prepare follow-up”",
      logo: "/images/integrations/slack.svg",
      partnerName: "Slack Triage",
      steps: [
        { icon: "cpu", badge: "icon-badge-amber", title: "Tool Result", detail: "Order #2048 delayed" },
        { icon: "branch", badge: "icon-badge-violet", title: "Escalation Rule", detail: "Priority case" },
        { icon: "users", badge: "icon-badge-rose", title: "Notify Team", detail: "Slack & Zendesk" },
      ],
      outcomeText: "Tool responses immediately guide what happens next",
    },
    {
      topIcon: "shield",
      topBadge: "icon-badge-emerald",
      topLabel: "SCOPED PERMISSIONS",
      topTitle: "“Define what the agent may access and when a person is needed”",
      logo: "/images/company-logos/hubspot.svg",
      partnerName: "HubSpot CRM",
      steps: [
        { icon: "lock", badge: "icon-badge-blue", title: "Read Scope", detail: "Approved tables only" },
        { icon: "sliders", badge: "icon-badge-amber", title: "Action Limits", detail: "Narrow tool rules" },
        { icon: "users", badge: "icon-badge-rose", title: "Human Gate", detail: "Sensitive requests" },
      ],
      outcomeText: "Every tool action stays inside your team's boundaries",
    },
    {
      topIcon: "cpu",
      topBadge: "icon-badge-blue",
      topLabel: "MODEL CONTEXT PROTOCOL",
      topTitle: "“Bring tool responses back into the call or workflow”",
      logo: "/images/integrations/salesforce.svg",
      partnerName: "Connected Stack",
      steps: [
        { icon: "phone", badge: "icon-badge-blue", title: "Live Agent", detail: "Voice or chat" },
        { icon: "cpu", badge: "icon-badge-violet", title: "Vozon MCP", detail: "Standard interface" },
        { icon: "check", badge: "icon-badge-emerald", title: "Your Stack", detail: "Calendars & CRMs" },
      ],
      outcomeText: "One structured protocol across all business tools",
    },
  ],
  workflows: [
    {
      topIcon: "phone",
      topBadge: "icon-badge-blue",
      topLabel: "FROM LEAD TO CONFIRMED SLOT",
      topTitle: "“Speak to a lead, check interest, and send a booking path”",
      logo: "/images/integrations/google-calendar.svg",
      partnerName: "Google Calendar",
      steps: [
        { icon: "bolt", badge: "icon-badge-amber", title: "New Lead", detail: "Enquiry arrives" },
        { icon: "phone", badge: "icon-badge-blue", title: "Voice Call", detail: "Qualifies 12 seats" },
        { icon: "calendar", badge: "icon-badge-emerald", title: "Wed · 2:30 PM", detail: "Slot confirmed" },
      ],
      outcomeText: "Sales receives a confirmed meeting and summary",
    },
    {
      topIcon: "headset",
      topBadge: "icon-badge-rose",
      topLabel: "TRIAGE & HUMAN HANDOFF",
      topTitle: "“Resolve a routine request or pass a complex issue with context”",
      logo: "/images/integrations/slack.svg",
      partnerName: "Slack Escalation",
      steps: [
        { icon: "message", badge: "icon-badge-blue", title: "Support Call", detail: "Order #2048 check" },
        { icon: "branch", badge: "icon-badge-violet", title: "Outcome Rule", detail: "Needs specialist" },
        { icon: "headset", badge: "icon-badge-rose", title: "Team Handoff", detail: "Summary attached" },
      ],
      outcomeText: "Specialists pick up right where the agent left off",
    },
    {
      topIcon: "message",
      topBadge: "icon-badge-emerald",
      topLabel: "CROSS-CHANNEL CONTINUATION",
      topTitle: "“Use the call result to decide what message happens next”",
      logo: "/images/integrations/whatsapp.svg",
      partnerName: "WhatsApp Cloud",
      steps: [
        { icon: "phone", badge: "icon-badge-blue", title: "Call Ends", detail: "Quote requested" },
        { icon: "message", badge: "icon-badge-emerald", title: "WhatsApp", detail: "Sends written quote" },
        { icon: "database", badge: "icon-badge-violet", title: "CRM Task", detail: "Follow-up logged" },
      ],
      outcomeText: "Conversation continues cleanly on WhatsApp",
    },
    {
      topIcon: "bolt",
      topBadge: "icon-badge-amber",
      topLabel: "WORKFLOW TRIGGERS",
      topTitle: "“Choose the lead, message, call, or event that starts the flow”",
      logo: "/images/company-logos/hubspot.svg",
      partnerName: "HubSpot Events",
      steps: [
        { icon: "globe", badge: "icon-badge-blue", title: "Form Lead", detail: "Website enquiry" },
        { icon: "phone", badge: "icon-badge-emerald", title: "Inbound Call", detail: "Customer rings" },
        { icon: "webhook", badge: "icon-badge-amber", title: "Store Event", detail: "Order or cart" },
      ],
      outcomeText: "Every trigger starts a defined, repeatable process",
    },
    {
      topIcon: "branch",
      topBadge: "icon-badge-violet",
      topLabel: "DECISION PATHS",
      topTitle: "“Route different results to a booking, a message, or a person”",
      logo: "/images/integrations/calendly.svg",
      partnerName: "Calendly & CRM",
      steps: [
        { icon: "calendar", badge: "icon-badge-emerald", title: "Booked", detail: "Send calendar pass" },
        { icon: "clock", badge: "icon-badge-amber", title: "Callback", detail: "Schedule retry" },
        { icon: "headset", badge: "icon-badge-rose", title: "Unresolved", detail: "Alert specialist" },
      ],
      outcomeText: "Every call result follows its own tailored path",
    },
  ],
  "create-workflows": [
    {
      topIcon: "grid",
      topBadge: "icon-badge-blue",
      topLabel: "VISUAL LEAD QUALIFICATION CANVAS",
      topTitle: "“Start a call, understand what the prospect needs, and route”",
      logo: "/images/company-logos/hubspot.svg",
      partnerName: "HubSpot CRM",
      steps: [
        { icon: "bolt", badge: "icon-badge-amber", title: "Trigger Node", detail: "New lead created" },
        { icon: "phone", badge: "icon-badge-blue", title: "Agent Node", detail: "Qualifies scope" },
        { icon: "calendar", badge: "icon-badge-emerald", title: "Outcome Node", detail: "Books walkthrough" },
      ],
      outcomeText: "Sales and operations see every step on one canvas",
    },
    {
      topIcon: "clock",
      topBadge: "icon-badge-amber",
      topLabel: "FALLBACK & FOLLOW-UP PATH",
      topTitle: "“Set a follow-up path when the first attempt goes unanswered”",
      logo: "/images/integrations/whatsapp.svg",
      partnerName: "WhatsApp Cloud",
      steps: [
        { icon: "phone", badge: "icon-badge-blue", title: "Call Unanswered", detail: "Voicemail branch" },
        { icon: "message", badge: "icon-badge-emerald", title: "WhatsApp Step", detail: "Offer callback slot" },
        { icon: "calendar", badge: "icon-badge-violet", title: "Slot Picked", detail: "Retry scheduled" },
      ],
      outcomeText: "Missed calls follow a clear recovery path",
    },
    {
      topIcon: "headset",
      topBadge: "icon-badge-rose",
      topLabel: "SUPPORT TRIAGE CANVAS",
      topTitle: "“Answer a routine question or send a complex case to staff”",
      logo: "/images/integrations/slack.svg",
      partnerName: "Slack Specialist",
      steps: [
        { icon: "file", badge: "icon-badge-blue", title: "Routine Question", detail: "Answered from FAQ" },
        { icon: "branch", badge: "icon-badge-violet", title: "Branch Rule", detail: "Checks complexity" },
        { icon: "headset", badge: "icon-badge-rose", title: "Complex Case", detail: "Routes to specialist" },
      ],
      outcomeText: "Everyone knows what routes to a specialist",
    },
    {
      topIcon: "sliders",
      topBadge: "icon-badge-violet",
      topLabel: "CONFIGURABLE CANVAS NODES",
      topTitle: "“Add the agent step and define the details it collects”",
      logo: "/images/integrations/google-calendar.svg",
      partnerName: "Google Calendar",
      steps: [
        { icon: "spark", badge: "icon-badge-blue", title: "Agent Role", detail: "Greeting & tone" },
        { icon: "file", badge: "icon-badge-emerald", title: "Key Questions", detail: "Team size & date" },
        { icon: "branch", badge: "icon-badge-violet", title: "Exit Rules", detail: "When to transfer" },
      ],
      outcomeText: "Walk through every branch before launch",
    },
    {
      topIcon: "branch",
      topBadge: "icon-badge-emerald",
      topLabel: "OUTCOME INTEGRATIONS",
      topTitle: "“Create separate paths for booking, follow-up, and escalation”",
      logo: "/images/integrations/salesforce.svg",
      partnerName: "Salesforce CRM",
      steps: [
        { icon: "calendar", badge: "icon-badge-emerald", title: "Booking Path", detail: "Google Calendar" },
        { icon: "message", badge: "icon-badge-blue", title: "Follow-Up Path", detail: "WhatsApp template" },
        { icon: "users", badge: "icon-badge-rose", title: "Escalation Path", detail: "Team notification" },
      ],
      outcomeText: "Every outcome on the canvas connects to a real tool",
    },
  ],
  "end-to-end-automation": [
    {
      topIcon: "layers",
      topBadge: "icon-badge-blue",
      topLabel: "COMPLETE QUALIFICATION JOURNEY",
      topTitle: "“Respond to interest, qualify, and prepare a booked slot”",
      logo: "/images/integrations/google-calendar.svg",
      partnerName: "Google Calendar",
      steps: [
        { icon: "globe", badge: "icon-badge-amber", title: "01 · Enquiry", detail: "Website or ad lead" },
        { icon: "phone", badge: "icon-badge-blue", title: "02 · Voice Call", detail: "Qualifies 12 seats" },
        { icon: "calendar", badge: "icon-badge-emerald", title: "03 · Booked", detail: "Wed · 2:30 PM pass" },
      ],
      outcomeText: "From first enquiry to confirmed meeting in one flow",
    },
    {
      topIcon: "database",
      topBadge: "icon-badge-violet",
      topLabel: "UNIFIED SUPPORT JOURNEY",
      topTitle: "“Answer routine questions or direct complex issues to staff”",
      logo: "/images/company-logos/shopify.svg",
      partnerName: "Shopify & CRM",
      steps: [
        { icon: "message", badge: "icon-badge-emerald", title: "01 · Customer Chat", detail: "Order #2048 query" },
        { icon: "cpu", badge: "icon-badge-blue", title: "02 · MCP Check", detail: "Fetches courier data" },
        { icon: "headset", badge: "icon-badge-rose", title: "03 · Specialist", detail: "Receives full thread" },
      ],
      outcomeText: "Your team steps in with the complete record attached",
    },
    {
      topIcon: "phone",
      topBadge: "icon-badge-emerald",
      topLabel: "VOICE TO MESSAGING CONTINUITY",
      topTitle: "“Carry the conversation result into a message or tool”",
      logo: "/images/integrations/whatsapp.svg",
      partnerName: "WhatsApp Cloud",
      steps: [
        { icon: "phone", badge: "icon-badge-blue", title: "01 · Voice Call", detail: "Requirements shared" },
        { icon: "file", badge: "icon-badge-amber", title: "02 · Summary", detail: "Intent & next action" },
        { icon: "message", badge: "icon-badge-emerald", title: "03 · WhatsApp", detail: "Written confirmation" },
      ],
      outcomeText: "Customers continue on WhatsApp without losing context",
    },
    {
      topIcon: "branch",
      topBadge: "icon-badge-amber",
      topLabel: "REPEATABLE CUSTOMER OPERATIONS",
      topTitle: "“List your common entry points and what a useful outcome looks like”",
      logo: "/images/integrations/salesforce.svg",
      partnerName: "Salesforce CRM",
      steps: [
        { icon: "globe", badge: "icon-badge-blue", title: "Entry Points", detail: "Calls, chat, leads" },
        { icon: "spark", badge: "icon-badge-violet", title: "Agent Scope", detail: "Questions & answers" },
        { icon: "check", badge: "icon-badge-emerald", title: "Clear Record", detail: "Saved in your CRM" },
      ],
      outcomeText: "Less time copying details between channels and tools",
    },
    {
      topIcon: "shield",
      topBadge: "icon-badge-rose",
      topLabel: "HUMAN OVERSIGHT & RESPONSIBILITY",
      topTitle: "“Make sure an unresolved request always reaches a person”",
      logo: "/images/integrations/slack.svg",
      partnerName: "Slack Escalation",
      steps: [
        { icon: "shield", badge: "icon-badge-violet", title: "Boundary Check", detail: "Needs judgment" },
        { icon: "file", badge: "icon-badge-blue", title: "Context Bundle", detail: "Transcript & intent" },
        { icon: "users", badge: "icon-badge-emerald", title: "Assigned Owner", detail: "Right team alerted" },
      ],
      outcomeText: "Clear responsibility when a person steps in",
    },
  ],
};

export function ProductUseCaseVisual({ productSlug, index }: Props) {
  const list = productScenes[productSlug] ?? productScenes["end-to-end-automation"];
  const scene = list[index % list.length];
  const sceneKind = index % 5;

  // SCENE 1 (Dark Navy Connected Multi-Step Flow Card)
  if (sceneKind === 1) {
    return (
      <div
        className="hcr-story-visual prod-scene is-dark-card"
        role="img"
        aria-label={`${scene.topLabel} connected flow`}
      >
        <div className="prod-scene-kicker">
          <span>{scene.topLabel}</span>
          <span className="prod-scene-kicker-badge">
            <Icon name="bolt" /> Live Flow
          </span>
        </div>

        <div className="prod-dark-header">
          <span className={`prod-entry-icon ${scene.topBadge}`}>
            <Icon name={scene.topIcon} />
          </span>
          <div className="prod-dark-header-copy">
            <small>INCOMING EVENT</small>
            <strong>{scene.topTitle}</strong>
          </div>
          {scene.logo ? (
            <span className="prod-dark-logo">
              <Image src={scene.logo} alt="" width={19} height={19} />
            </span>
          ) : null}
        </div>

        <div className="prod-dark-flow-row">
          {scene.steps.map((step, i) => (
            <div key={step.title} style={{ display: "contents" }}>
              {i > 0 ? <i className="prod-dark-flow-line" aria-hidden="true" /> : null}
              <div className="prod-dark-step-card">
                <div className="prod-dark-step-top">
                  <span className={`prod-flow-icon ${step.badge}`}>
                    <Icon name={step.icon} />
                  </span>
                  <span className="prod-dark-step-num">0{i + 1}</span>
                </div>
                <strong>{step.title}</strong>
                <small>{step.detail}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="prod-dark-answer">
          <span className="prod-entry-icon icon-badge-blue">
            <Icon name="spark" />
          </span>
          <div className="prod-dark-answer-copy">
            <small>RIGHT PATH SELECTED</small>
            <strong>{scene.outcomeText}</strong>
          </div>
          <span className="prod-dark-answer-tag">Verified</span>
        </div>
      </div>
    );
  }

  // SCENE 2 (Light Soft-Blue Two-Way Exchange + Connected Pill Bridge + Handoff Card)
  if (sceneKind === 2) {
    const firstStep = scene.steps[0];
    const secondStep = scene.steps[1];
    const thirdStep = scene.steps[2];

    return (
      <div
        className="hcr-story-visual prod-scene"
        role="img"
        aria-label={`${scene.topLabel} continuous flow`}
      >
        <div className="prod-scene-kicker">
          <span>{scene.topLabel}</span>
          <span className="prod-scene-kicker-badge">Continuous Thread</span>
        </div>

        <div className="prod-exchange-stack">
          <div className="prod-exchange-row">
            <div className="prod-exchange-bubble">
              <span className={`prod-entry-icon ${scene.topBadge}`}>
                <Icon name={scene.topIcon} />
              </span>
              <div className="prod-exchange-text">
                <small>{ firstStep.title }</small>
                <strong>{scene.topTitle}</strong>
              </div>
              {scene.logo ? (
                <span className="prod-entry-logo">
                  <Image src={scene.logo} alt="" width={18} height={18} />
                </span>
              ) : null}
            </div>
          </div>

          <div className="prod-exchange-row is-agent">
            <div className="prod-exchange-bubble">
              <span className={`prod-entry-icon ${secondStep.badge}`}>
                <Icon name={secondStep.icon} />
              </span>
              <div className="prod-exchange-text">
                <small>VOZON AI · {secondStep.title}</small>
                <strong>{secondStep.detail} · Context verified</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="prod-bridge-row">
          <span className="prod-bridge-pill">
            <span className={`prod-bridge-pill-dot ${firstStep.badge}`}>
              <Icon name={firstStep.icon} />
            </span>
            {firstStep.detail}
          </span>
          <i className="prod-flow-line" style={{ flex: 1 }} aria-hidden="true" />
          <span className="prod-bridge-pill">
            <span className={`prod-bridge-pill-dot ${thirdStep.badge}`}>
              <Icon name={thirdStep.icon} />
            </span>
            {thirdStep.title}
          </span>
        </div>

        <div className="prod-handoff-card">
          <span className={`prod-entry-icon ${thirdStep.badge}`}>
            <Icon name={thirdStep.icon} />
          </span>
          <div className="prod-handoff-copy">
            <small>CONNECTED OUTCOME</small>
            <strong>{scene.outcomeText}</strong>
            <span>{firstStep.title} · {secondStep.title} · {thirdStep.detail}</span>
          </div>
          {scene.logo ? (
            <span className="prod-entry-logo">
              <Image src={scene.logo} alt="" width={18} height={18} />
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  // SCENE 3 (Dark Navy Branching Decision Tree Flow)
  if (sceneKind === 3) {
    return (
      <div
        className="hcr-story-visual prod-scene is-dark-card"
        role="img"
        aria-label={`${scene.topLabel} branching tree`}
      >
        <div className="prod-scene-kicker">
          <span>{scene.topLabel}</span>
          <span className="prod-scene-kicker-badge">Structured Rules</span>
        </div>

        <div className="prod-tree-root">
          <span className={`prod-entry-icon ${scene.topBadge}`}>
            <Icon name={scene.topIcon} />
          </span>
          <div className="prod-tree-root-copy">
            <small>{scene.topLabel}</small>
            <strong>{scene.topTitle}</strong>
          </div>
          {scene.logo ? (
            <span className="prod-dark-logo">
              <Image src={scene.logo} alt="" width={18} height={18} />
            </span>
          ) : null}
        </div>

        <div className="prod-tree-stem" aria-hidden="true" />

        <div className="prod-tree-branches">
          {scene.steps.map((step, i) => (
            <div key={step.title} className="prod-tree-node">
              <div className="prod-dark-step-top">
                <span className={`prod-flow-icon ${step.badge}`}>
                  <Icon name={step.icon} />
                </span>
                <span className="prod-dark-step-num">0{i + 1}</span>
              </div>
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
            </div>
          ))}
        </div>

        <div className="prod-dark-answer">
          <span className="prod-entry-icon icon-badge-emerald">
            <Icon name="check" />
          </span>
          <div className="prod-dark-answer-copy">
            <small>RIGHT PATH SELECTED</small>
            <strong>{scene.outcomeText}</strong>
          </div>
          <span className="prod-dark-answer-tag">Active</span>
        </div>
      </div>
    );
  }

  // SCENE 4 (Light Soft-Blue Radial Connected Hub-and-Spoke Map)
  if (sceneKind === 4) {
    return (
      <div
        className="hcr-story-visual prod-scene"
        role="img"
        aria-label={`${scene.topLabel} connected hub map`}
      >
        <div className="prod-scene-kicker">
          <span>{scene.topLabel}</span>
          <span className="prod-scene-kicker-badge">Connected Ecosystem</span>
        </div>

        <div className="prod-hub-map">
          {scene.steps.map((step) => (
            <div key={step.title} className="prod-hub-node">
              <span className={`prod-hub-node-icon ${step.badge}`}>
                <Icon name={step.icon} />
              </span>
              <div className="prod-hub-node-copy">
                <strong>{step.title}</strong>
                <small>{step.detail}</small>
              </div>
            </div>
          ))}

          <div className="prod-hub-node">
            <span className="prod-hub-node-icon" style={{ background: "#f4f7fd", border: "1px solid #e1e8f5" }}>
              {scene.logo ? (
                <Image src={scene.logo} alt="" width={18} height={18} />
              ) : (
                <Icon name="spark" />
              )}
            </span>
            <div className="prod-hub-node-copy">
              <strong>{scene.partnerName ?? "Connected Tool"}</strong>
              <small>Synced in real time</small>
            </div>
          </div>

          <div className="prod-hub-center">
            <span className="prod-hub-center-logo">
              <Icon name={scene.topIcon} />
            </span>
            <strong>Vozon AI</strong>
            <small>Live Orchestrator</small>
          </div>
        </div>

        <div className="prod-outcome-pill" style={{ alignSelf: "center" }}>
          <Icon name="check" />
          <span>{scene.outcomeText}</span>
        </div>
      </div>
    );
  }

  // SCENE 0 (Light Soft-Blue 3-Step Connected Flow with Brand Logo & Step Path)
  return (
    <div
      className="hcr-story-visual prod-scene"
      role="img"
      aria-label={`${scene.topLabel} visual flow`}
    >
      <div className="prod-scene-kicker">
        <span>{scene.topLabel}</span>
        <span className="prod-scene-kicker-badge">Automated Flow</span>
      </div>

      <div className="prod-entry-card">
        <span className={`prod-entry-icon ${scene.topBadge}`}>
          <Icon name={scene.topIcon} />
        </span>
        <div className="prod-entry-copy">
          <small>{scene.topLabel}</small>
          <strong>{scene.topTitle}</strong>
        </div>
        {scene.logo ? (
          <span className="prod-entry-logo">
            <Image src={scene.logo} alt="" width={19} height={19} />
          </span>
        ) : null}
      </div>

      <div className="prod-step-path" aria-hidden="true">
        {scene.steps.map((step, i) => (
          <div key={step.title} style={{ display: "contents" }}>
            {i > 0 ? <i /> : null}
            <span>
              0{i + 1} <b>{step.title}</b>
            </span>
          </div>
        ))}
      </div>

      <div className="prod-flow-row">
        {scene.steps.map((step, i) => (
          <div key={step.title} style={{ display: "contents" }}>
            {i > 0 ? <i className="prod-flow-line" aria-hidden="true" /> : null}
            <div className="prod-flow-card">
              <span className={`prod-flow-icon ${step.badge}`}>
                <Icon name={step.icon} />
              </span>
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="prod-outcome-pill">
        <Icon name="check" />
        <span>{scene.outcomeText}</span>
      </div>
    </div>
  );
}
