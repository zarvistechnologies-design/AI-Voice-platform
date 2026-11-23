"use client";

import { useState } from "react";
import Image from "next/image";
import "./WhatsAppApiExperience.css";

type Scenario = {
  label: string;
  tagline: string;
  customerName: string;
  customerRole: string;
  customerPhone: string;
  customerAvatar: string;
  crmTag: string;
  phoneChat: {
    sender: "customer" | "bot";
    text: string;
    time: string;
    card?: {
      badge: string;
      title: string;
      detail: string;
      buttons: string[];
    };
  }[];
  inboxPreview: string;
  inboxTimestamp: string;
  inboxTag: string;
  inboxTagType: "bot" | "human" | "sync";
  webhookEvent: string;
  webhookStatus: string;
  webhookLatency: string;
  crmRecord: string;
};

const scenarios: Scenario[] = [
  {
    label: "Post-call confirmation",
    tagline: "Instant automated WhatsApp confirmation right after a voice call",
    customerName: "David Kapoor",
    customerRole: "VP Tech · Acme Financial",
    customerPhone: "+1 (415) 882-9014",
    customerAvatar: "DK",
    crmTag: "HubSpot Deal #H-3029 · Demo Booked",
    phoneChat: [
      {
        sender: "customer",
        text: "Yes, 2:30 PM Wednesday works great for the team consultation.",
        time: "14:30",
      },
      {
        sender: "bot",
        text: "Confirmed! I've sent your official booking pass below:",
        time: "14:30",
        card: {
          badge: "CALENDAR BOOKING PASS",
          title: "Executive Demo · Wed, Oct 28 at 2:30 PM EST",
          detail: "Senior Solutions Architect Meera Kapoor assigned. Google Meet link generated.",
          buttons: ["📅 Add to Google Calendar", "🔄 Reschedule Window"],
        },
      },
      {
        sender: "customer",
        text: "Added to calendar. Does this invite our London VP as well?",
        time: "14:31",
      },
      {
        sender: "bot",
        text: "Yes, an invite has also been dispatched to london-team@acmefin.com.",
        time: "14:31",
      },
    ],
    inboxPreview: "Added to calendar. Does this invite our London VP as well?",
    inboxTimestamp: "Just now",
    inboxTag: "Slot Confirmed",
    inboxTagType: "bot",
    webhookEvent: "messages.template_delivered",
    webhookStatus: "200 OK (ACK)",
    webhookLatency: "38ms",
    crmRecord: "HubSpot Contact Updated · Calendar Event Synced",
  },
  {
    label: "Inbound enquiry",
    tagline: "Qualify inbound prospects instantly within the 24-hour care window",
    customerName: "Sarah Jenkins",
    customerRole: "Head of Operations · Velocity Logistics",
    customerPhone: "+44 20 7946 0912",
    customerAvatar: "SJ",
    crmTag: "Salesforce Opportunity · 20-Seat Enterprise",
    phoneChat: [
      {
        sender: "customer",
        text: "Hi, we need an automated voice & WhatsApp setup for our 20-person dispatch desk.",
        time: "10:14",
      },
      {
        sender: "bot",
        text: "Welcome to Vozon! We support omnichannel phone + WhatsApp dispatch. Are you connecting an existing CRM like Salesforce or Zoho?",
        time: "10:14",
      },
      {
        sender: "customer",
        text: "We use Salesforce Service Cloud and need after-hours call answering.",
        time: "10:15",
      },
      {
        sender: "bot",
        text: "Understood! I've pre-configured our 24/7 Dispatch blueprint with Salesforce sync.",
        time: "10:15",
        card: {
          badge: "SALESFORCE BLUEPRINT READY",
          title: "Dispatch AI + WhatsApp Team Care",
          detail: "Zero-latency two-way webhook sync with Salesforce Service Cloud.",
          buttons: ["🚀 Book Live Product Demo", "📑 View Developer API Docs"],
        },
      },
    ],
    inboxPreview: "We use Salesforce Service Cloud and need after-hours...",
    inboxTimestamp: "2m ago",
    inboxTag: "Qualified Lead",
    inboxTagType: "bot",
    webhookEvent: "webhook.inbound_qualified",
    webhookStatus: "200 OK",
    webhookLatency: "44ms",
    crmRecord: "Salesforce Lead #SF-9041 Created · Routing: High Priority",
  },
  {
    label: "Order & service updates",
    tagline: "Send transactional updates with two-way reply and delivery notes",
    customerName: "Carlos Mendes",
    customerRole: "Shopper · Order #SH-4092",
    customerPhone: "+1 (305) 551-2890",
    customerAvatar: "CM",
    crmTag: "Shopify Store · Courier Transit Active",
    phoneChat: [
      {
        sender: "bot",
        text: "Your order has been dispatched!",
        time: "11:20",
        card: {
          badge: "ORDER #SH-4092 DISPATCHED",
          title: "Studio Headphones (Obsidian Black)",
          detail: "Courier: FedEx Express · Estimated delivery Tomorrow between 2:00–4:00 PM.",
          buttons: ["📦 Track Courier Live", "📍 Change Delivery Instructions"],
        },
      },
      {
        sender: "customer",
        text: "Can the driver leave it at the side porch behind the gate?",
        time: "11:22",
      },
      {
        sender: "bot",
        text: "Delivery instruction saved: 'Side porch behind gate'. Courier acknowledged.",
        time: "11:22",
      },
    ],
    inboxPreview: "Can the driver leave it at the side porch behind the gate?",
    inboxTimestamp: "5m ago",
    inboxTag: "Shopify Sync",
    inboxTagType: "sync",
    webhookEvent: "shopify.order_fulfillment_update",
    webhookStatus: "200 OK",
    webhookLatency: "32ms",
    crmRecord: "Shopify Order #SH-4092 Note Added · FedEx Alert Dispatched",
  },
  {
    label: "Team handoff",
    tagline: "Transfer complex inquiries to human specialists with full chat history",
    customerName: "Marcus Vance",
    customerRole: "Chief Financial Officer · Omnia Corp",
    customerPhone: "+49 89 2018 3390",
    customerAvatar: "MV",
    crmTag: "Zendesk VIP Ticket #ZD-4491 · Assigned",
    phoneChat: [
      {
        sender: "customer",
        text: "I need custom payment terms and VAT invoice schedule for our Munich HQ.",
        time: "16:45",
      },
      {
        sender: "bot",
        text: "Packaging your account history. Connecting you with Senior Finance Specialist Alex...",
        time: "16:45",
      },
      {
        sender: "bot",
        text: "Alex has joined this WhatsApp conversation with full context.",
        time: "16:46",
        card: {
          badge: "HUMAN AGENT JOINED",
          title: "Alex G. · Senior Commercial Desk",
          detail: "Caller verified via voice line earlier today. Prior consultation attached.",
          buttons: ["💬 Chat with Alex", "📞 Request Direct Phone Call"],
        },
      },
      {
        sender: "customer",
        text: "Thanks Alex, will Net-45 invoice terms work?",
        time: "16:47",
      },
    ],
    inboxPreview: "Thanks Alex, will Net-45 invoice terms work?",
    inboxTimestamp: "8m ago",
    inboxTag: "Human Handoff",
    inboxTagType: "human",
    webhookEvent: "inbox.agent_assigned",
    webhookStatus: "200 OK",
    webhookLatency: "29ms",
    crmRecord: "Zendesk Ticket #ZD-4491 Assigned to Finance Desk · Slack Alert Sent",
  },
];

const mockOtherChats = [
  {
    name: "Dr. Vikram Malhotra",
    preview: "Pre-Op surgery checklist completed on WhatsApp",
    time: "12m ago",
    badge: "Healthcare Bot",
    badgeType: "bot" as const,
  },
  {
    name: "Elena Rostova",
    preview: "Rescheduled flight confirmation pass delivered",
    time: "19m ago",
    badge: "Travel Concierge",
    badgeType: "sync" as const,
  },
  {
    name: "Liam Chen",
    preview: "Enterprise SLA contract link opened in chat",
    time: "28m ago",
    badge: "Sales Handoff",
    badgeType: "human" as const,
  },
];

export function WhatsAppApiExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scenario = scenarios[activeIndex];

  return (
    <div className="vc-experience is-laptop-layout" aria-label="Interactive WhatsApp API examples">
      <div className="vc-hero-intro">
        <span>VOZON / WHATSAPP CLOUD API</span>
        <h1>Connect WhatsApp to your customer journey.</h1>
      </div>

      {/* Scenario Pills Selector */}
      <div className="vc-industries" role="group" aria-label="Choose a WhatsApp API scenario">
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

      {/* =========================================================================
          Dual Hero: Realistic Mobile Phone + Multi-Agent Team Inbox Dashboard
          ========================================================================= */}
      <div className="wa-api-dual-hero">
        {/* Panel 1: Mobile Phone (Customer's Real WhatsApp View) */}
        <div className="wa-api-phone">
          <div className="wa-api-phone-screen">
            {/* WhatsApp Green Top Bar */}
            <div className="wa-phone-top-bar">
              <div className="wa-phone-contact-info">
                <span className="wa-phone-avatar">V</span>
                <div className="wa-phone-title">
                  <strong>
                    Vozon AI <span className="wa-green-tick">✓</span>
                  </strong>
                  <small>Official Business Account</small>
                </div>
              </div>
              <div className="wa-phone-actions">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
            </div>

            {/* Chat Body */}
            <div className="wa-phone-chat-body">
              <span className="wa-date-pill">TODAY</span>

              {scenario.phoneChat.map((msg, idx) => (
                <div
                  key={`${scenario.label}-phone-${idx}`}
                  className={`wa-bubble ${msg.sender === "customer" ? "is-customer" : "is-bot"}`}
                >
                  <p>{msg.text}</p>

                  {msg.card ? (
                    <div className="wa-card-template">
                      <div className="wa-card-template-head">{msg.card.badge}</div>
                      <div className="wa-card-template-body">
                        <strong>{msg.card.title}</strong>
                        <p style={{ margin: "4px 0 0", color: "#64748b" }}>{msg.card.detail}</p>
                      </div>
                      <div className="wa-card-template-buttons">
                        {msg.card.buttons.map((btn, btnIdx) => (
                          <div className="wa-card-template-btn" key={btnIdx}>
                            {btn}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="wa-bubble-time">
                    <span>{msg.time}</span>
                    <span className="wa-blue-ticks">✓✓</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Compose Bar */}
            <div className="wa-phone-compose">
              <div className="wa-phone-compose-input">
                <span>Message</span>
                <span style={{ color: "#94a3b8" }}>📎</span>
              </div>
              <div className="wa-phone-compose-mic">
                <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: WhatsApp Business Multi-Agent Inbox Dashboard */}
        <div className="wa-api-inbox">
          {/* Dashboard Header */}
          <div className="wa-inbox-top-bar">
            <div className="wa-inbox-title-group">
              <span className="wa-inbox-logo-badge">
                <Image src="/images/integrations/whatsapp.svg" alt="WhatsApp" width={18} height={18} />
              </span>
              <div>
                <strong>VOZON CLOUD API · SHARED TEAM INBOX</strong>
                <small>Meta WABA: +1 (800) 869-6624 (Verified Official Account)</small>
              </div>
            </div>

            <div className="wa-inbox-metrics">
              <div className="wa-inbox-metric-pill">
                <span className="pulse-dot" />
                <span>API Response: {scenario.webhookLatency}</span>
              </div>
              <div className="wa-inbox-metric-pill" style={{ color: "#60a5fa", borderColor: "rgba(96,165,250,0.3)", background: "rgba(96,165,250,0.1)" }}>
                <span>24h Care Window Active</span>
              </div>
            </div>
          </div>

          {/* Inbox 2-Column Body */}
          <div className="wa-inbox-body-grid">
            {/* Left Thread List */}
            <div className="wa-inbox-threads-col">
              <div className="wa-inbox-search-bar">
                <span>🔍</span>
                <span>Search customer chats...</span>
              </div>

              <div className="wa-inbox-threads-list">
                {/* Active Current Chat */}
                <div className="wa-inbox-thread-item is-selected">
                  <div className="wa-thread-avatar">{scenario.customerAvatar}</div>
                  <div className="wa-thread-details">
                    <div className="wa-thread-head">
                      <strong>{scenario.customerName}</strong>
                      <small>{scenario.inboxTimestamp}</small>
                    </div>
                    <div className="wa-thread-preview">{scenario.inboxPreview}</div>
                    <span className={`wa-thread-badge is-${scenario.inboxTagType}`}>
                      {scenario.inboxTag}
                    </span>
                  </div>
                </div>

                {/* Other Real Live Chats */}
                {mockOtherChats.map((c) => (
                  <div className="wa-inbox-thread-item" key={c.name}>
                    <div className="wa-thread-avatar">{c.name.slice(0, 2)}</div>
                    <div className="wa-thread-details">
                      <div className="wa-thread-head">
                        <strong>{c.name}</strong>
                        <small>{c.time}</small>
                      </div>
                      <div className="wa-thread-preview">{c.preview}</div>
                      <span className={`wa-thread-badge is-${c.badgeType}`}>
                        {c.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Active Conversation Pane */}
            <div className="wa-inbox-main-col">
              {/* Active Conversation Top Bar */}
              <div className="wa-inbox-active-head">
                <div className="wa-inbox-contact-meta">
                  <div>
                    <strong>
                      {scenario.customerName} <span className="wa-green-tick">✓</span>
                    </strong>
                    <small>{scenario.customerRole} · {scenario.customerPhone}</small>
                  </div>
                </div>

                <div className="wa-inbox-head-actions">
                  <button type="button" className="wa-inbox-action-pill">
                    📞 Call Lead
                  </button>
                  <button type="button" className="wa-inbox-action-pill" style={{ background: "#2457d6", color: "#fff", borderColor: "#2457d6" }}>
                    CRM Sync
                  </button>
                </div>
              </div>

              {/* Message Transcript */}
              <div className="wa-inbox-transcript">
                {scenario.phoneChat.map((msg, idx) => (
                  <div
                    key={`inbox-msg-${idx}`}
                    className={`wa-inbox-msg ${msg.sender === "customer" ? "is-customer" : "is-agent"}`}
                  >
                    <div>
                      <div className="wa-inbox-msg-bubble">
                        {msg.text}
                        {msg.card ? (
                          <div style={{ marginTop: 6, padding: "6px 8px", background: "rgba(0,0,0,0.04)", borderRadius: 6, fontSize: 10 }}>
                            <strong style={{ display: "block" }}>{msg.card.title}</strong>
                            <span style={{ fontSize: 9.5, opacity: 0.85 }}>{msg.card.detail}</span>
                          </div>
                        ) : null}
                      </div>
                      <div className="wa-inbox-msg-meta">
                        <span>{msg.sender === "customer" ? scenario.customerName : "Vozon AI Agent"}</span>
                        <span>·</span>
                        <span>{msg.time}</span>
                        <span>· Delivered</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom API & Webhook Telemetry Bar */}
              <div className="wa-inbox-telemetry-bar">
                <div className="wa-telemetry-item">
                  <span>EVENT:</span> <b>{scenario.webhookEvent}</b>
                </div>
                <div className="wa-telemetry-item">
                  <span>STATUS:</span> <b>{scenario.webhookStatus}</b>
                </div>
                <div className="wa-telemetry-item hidden sm:flex">
                  <span>SYNC:</span> <b>{scenario.crmRecord}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
