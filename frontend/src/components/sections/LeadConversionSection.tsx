"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import "./LeadConversionSection.css";

const ivrMenuOptions = [
  "Welcome to your bank.",
  "For account balance, press 1.",
  "For loan details, press 2.",
  "For more options, press 3.",
  "To repeat, press 4.",
];

const dialpadKeys = [
  "1", "2", "3",
  "4", "5", "6",
  "7", "8", "9",
  "*", "0", "#",
];

const ivrDrawbacks = [
  "Long wait times",
  "Complex navigation",
  "High drop-off",
];

const chatbotDrawbacks = [
  "Can't handle complex queries",
  "No real-time context",
  "Feels transactional",
];

const agentCustomerData = [
  { label: "Name", value: "Rajesh Kumar", icon: "user" },
  { label: "Account", value: "1234 •••• 5678", icon: "card" },
  { label: "Product", value: "Home Loan", icon: "tag" },
  { label: "Query", value: "Loan Status", icon: "chat" },
];

const agentActions = [
  "Checks loan status",
  "Updates application",
  "Triggers SMS & WhatsApp",
  "Logs interaction in CRM",
];

const enterprisePillars = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="21" x2="21" y2="21" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <polyline points="5 6 12 3 19 6" />
        <line x1="4" y1="10" x2="4" y2="21" />
        <line x1="20" y1="10" x2="20" y2="21" />
        <line x1="8" y1="14" x2="8" y2="17" />
        <line x1="12" y1="14" x2="12" y2="17" />
        <line x1="16" y1="14" x2="16" y2="17" />
      </svg>
    ),
    label: "Core Banking",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    label: "Loan Origination System",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "CRM",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    label: "Knowledge Base",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    label: "Notification Engine",
  },
];

export function LeadConversionSection() {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="customer-evolution" aria-labelledby="customer-evolution-title">
      <div className="customer-evolution-inner">
        {/* Section Header */}
        <div className="customer-evolution-header">
          <h2 id="customer-evolution-title">Customer Support, Reimagined</h2>
          <p>From Rigid Menus and Text Chats to Intelligent Conversations</p>
          <div className="customer-evolution-divider" aria-hidden="true" />
        </div>

        {/* 3 Evolution Pillars Grid */}
        <div className="customer-evolution-grid">
          {/* Column 1: Traditional IVR */}
          <div className="evolution-card is-ivr">
            <div className="evolution-card-heading">
              <h3>Traditional IVR</h3>
              <p>Rigid. Menu-driven. Time-consuming.</p>
            </div>

            <div className="evolution-card-body">
              {/* IVR Device & Flowchart Side by Side */}
              <div className="ivr-showcase-wrap">
                {/* Dark IVR Mobile Mockup */}
                <div className="ivr-device">
                  <div className="ivr-device-screen">
                    <div className="ivr-prompt-box">
                      {ivrMenuOptions.map((line, idx) => (
                        <p key={idx} className={idx === 0 ? "is-lead" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>

                    <div className="ivr-wave-indicator" aria-hidden="true">
                      {[10, 18, 28, 14, 22, 10, 24, 18, 12].map((h, i) => (
                        <span key={i} style={{ height: `${h}px` }} />
                      ))}
                    </div>

                    <div className="ivr-dialpad" aria-hidden="true">
                      {dialpadKeys.map((k) => (
                        <span key={k} className="ivr-key">
                          {k}
                        </span>
                      ))}
                    </div>

                    <div className="ivr-call-bar" aria-hidden="true">
                      <span className="ivr-end-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                          <line x1="23" y1="1" x2="1" y2="23" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Call Flow Diagram */}
                <div className="ivr-flowchart" aria-label="Traditional IVR Call Flow">
                  <span className="ivr-flow-title">Call Flow</span>

                  <div className="ivr-flow-node">
                    <strong>Start</strong>
                    <small>Press 1</small>
                  </div>
                  <span className="ivr-flow-arrow" aria-hidden="true">↓</span>

                  <div className="ivr-flow-node">
                    <strong>Account Info</strong>
                    <small>Press 1</small>
                    <small>Press 2</small>
                  </div>
                  <span className="ivr-flow-arrow" aria-hidden="true">↓</span>

                  <div className="ivr-flow-node">
                    <strong>More Options</strong>
                    <small>Press 1</small>
                    <small>Press 2</small>
                  </div>
                  <span className="ivr-flow-arrow" aria-hidden="true">↓</span>

                  <div className="ivr-flow-node is-end">
                    <strong>Repeat Menu</strong>
                    <small>Press 4</small>
                  </div>
                </div>
              </div>

              {/* Drawbacks */}
              <div className="evolution-drawbacks">
                {ivrDrawbacks.map((item) => (
                  <div key={item} className="drawback-item">
                    <span className="drawback-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Chatbot */}
          <div className="evolution-card is-chatbot">
            <div className="evolution-card-heading">
              <h3>Chatbot</h3>
              <p>Text-based. Limited understanding.</p>
            </div>

            <div className="evolution-card-body">
              {/* White Chatbot Phone Mockup */}
              <div className="chatbot-device">
                <div className="chatbot-header">
                  <div className="chatbot-avatar-pill">
                    <span className="chatbot-bot-icon" aria-hidden="true">🤖</span>
                  </div>
                  <span className="chatbot-status-dots" aria-hidden="true">•••</span>
                </div>

                <div className="chatbot-thread">
                  <div className="chat-msg is-bot">
                    <span className="chat-bot-icon" aria-hidden="true">🤖</span>
                    <div className="chat-bubble">
                      <p>Hi! How can I help you today?</p>
                      <time>10:30 AM</time>
                    </div>
                  </div>

                  <div className="chat-msg is-user">
                    <div className="chat-bubble">
                      <p>I want to check my loan status</p>
                      <time>10:30 AM ✓✓</time>
                    </div>
                  </div>

                  <div className="chat-msg is-bot">
                    <span className="chat-bot-icon" aria-hidden="true">🤖</span>
                    <div className="chat-bubble">
                      <p>Sure, please share your application number.</p>
                      <time>10:30 AM</time>
                    </div>
                  </div>

                  <div className="chat-msg is-user">
                    <div className="chat-bubble">
                      <p>LN12345678</p>
                      <time>10:31 AM ✓✓</time>
                    </div>
                  </div>

                  <div className="chat-msg is-bot">
                    <span className="chat-bot-icon" aria-hidden="true">🤖</span>
                    <div className="chat-bubble">
                      <p>Your loan is under review. You will receive an update via SMS.</p>
                      <time>10:31 AM</time>
                    </div>
                  </div>
                </div>

                <div className="chatbot-input-bar">
                  <span>Type a message...</span>
                  <span className="chat-send-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Drawbacks */}
              <div className="evolution-drawbacks">
                {chatbotDrawbacks.map((item) => (
                  <div key={item} className="drawback-item">
                    <span className="drawback-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: AI Voice Agent (Most Capable) */}
          <div className="evolution-card is-agent">
            {/* Most Capable Gold Ribbon Badge */}
            <div className="most-capable-ribbon" aria-label="Most Capable Solution">
              <span>Most Capable</span>
            </div>

            <div className="evolution-card-heading">
              <h3>AI Voice Agent</h3>
              <p>Conversational. Contextual. Outcome-driven.</p>
            </div>

            <div className="evolution-card-body is-agent-layout">
              {/* Voice Call Screen Mockup */}
              <div className="voice-agent-device">
                <div className="va-device-header">
                  <span className="va-header-arrow" aria-hidden="true">‹</span>
                  <span className="va-header-dots" aria-hidden="true">•••</span>
                </div>

                {/* Conversational Audio Wave Thread */}
                <div className="va-wave-thread">
                  {/* Customer Turn 1 */}
                  <div className="va-wave-row is-customer">
                    <div className="va-speaker-avatar">
                      <Image
                        alt="Rajesh Kumar"
                        className="va-avatar-img"
                        height={40}
                        src="/images/speaker-1.jpg"
                        width={40}
                      />
                    </div>
                    <div className="va-wave-bubble">
                      <div className="va-bars" aria-hidden="true">
                        {[8, 14, 20, 26, 18, 12, 22, 16, 8, 14, 24, 18, 10, 16, 20, 12, 6].map((h, i) => (
                          <span key={i} style={{ height: `${h}px` }} />
                        ))}
                      </div>
                      <time>10:30 AM</time>
                    </div>
                  </div>

                  {/* Agent Turn 1 */}
                  <div className="va-wave-row is-agent">
                    <div className="va-wave-bubble is-agent-bubble">
                      <time>10:30 AM</time>
                      <div className="va-bars is-agent-bars" aria-hidden="true">
                        {[10, 18, 28, 22, 14, 24, 30, 18, 12, 22, 26, 16, 12, 20, 14, 8].map((h, i) => (
                          <span key={i} style={{ height: `${h}px` }} />
                        ))}
                      </div>
                    </div>
                    <div className="va-speaker-avatar is-agent-avatar">
                      <Image
                        alt="Voice AI Agent"
                        className="va-avatar-img"
                        height={40}
                        src="/images/speaker-2.jpg"
                        width={40}
                      />
                    </div>
                  </div>

                  {/* Customer Turn 2 */}
                  <div className="va-wave-row is-customer">
                    <div className="va-speaker-avatar">
                      <Image
                        alt="Rajesh Kumar"
                        className="va-avatar-img"
                        height={40}
                        src="/images/speaker-1.jpg"
                        width={40}
                      />
                    </div>
                    <div className="va-wave-bubble">
                      <div className="va-bars" aria-hidden="true">
                        {[6, 12, 18, 22, 14, 10, 16, 20, 12, 8, 14, 10, 6].map((h, i) => (
                          <span key={i} style={{ height: `${h}px` }} />
                        ))}
                      </div>
                      <time>10:30 AM</time>
                    </div>
                  </div>

                  {/* Agent Turn 2 */}
                  <div className="va-wave-row is-agent">
                    <div className="va-wave-bubble is-agent-bubble">
                      <time>10:31 AM</time>
                      <div className="va-bars is-agent-bars" aria-hidden="true">
                        {[8, 16, 24, 30, 20, 14, 22, 28, 16, 10, 18, 22, 14, 8].map((h, i) => (
                          <span key={i} style={{ height: `${h}px` }} />
                        ))}
                      </div>
                    </div>
                    <div className="va-speaker-avatar is-agent-avatar">
                      <Image
                        alt="Voice AI Agent"
                        className="va-avatar-img"
                        height={40}
                        src="/images/speaker-2.jpg"
                        width={40}
                      />
                    </div>
                  </div>
                </div>

                {/* Call Control Buttons */}
                <div className="va-call-actions" aria-hidden="true">
                  <span className="va-action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </span>
                  <span className="va-action-btn is-end">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                      <line x1="23" y1="1" x2="1" y2="23" />
                    </svg>
                  </span>
                  <span className="va-action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Side Intelligence Panels: Memory & Live Tools */}
              <div className="va-intelligence-col">
                {/* 1. Understands & Remembers */}
                <div className="va-intel-card is-memory">
                  <h4>Understands &amp; Remembers</h4>
                  <div className="va-memory-rows">
                    {agentCustomerData.map((item) => (
                      <div key={item.label} className="va-mem-row">
                        <span className="va-mem-icon" aria-hidden="true">
                          {item.icon === "user" ? "👤" : item.icon === "card" ? "💳" : item.icon === "tag" ? "🏷️" : "💬"}
                        </span>
                        <div className="va-mem-text">
                          <span className="va-mem-label">{item.label}:</span>
                          <strong className="va-mem-val">{item.value}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Takes Action */}
                <div className="va-intel-card is-action">
                  <h4>Takes Action</h4>
                  <ul className="va-action-list">
                    {agentActions.map((action) => (
                      <li key={action}>
                        <span className="va-check-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="16 8 10 14 8 12" />
                          </svg>
                        </span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Golden Footer Highlight Pill */}
            <div className="va-hero-footer-pill">
              <span className="va-star" aria-hidden="true">⭐</span>
              <span>Faster Resolution</span>
              <span className="va-dot">•</span>
              <span>Higher CSAT</span>
              <span className="va-dot">•</span>
              <span>Better Outcomes</span>
            </div>
          </div>
        </div>

        {/* Video Player that was on the homepage */}
        <div className="customer-evolution-video-wrap" aria-label="Vozon AI Platform Demo Video">
          <div className="vozon-intro-video-card">
            <video
              aria-label="Vozon AI platform introduction"
              controls
              onPause={() => setVideoPlaying(false)}
              onPlay={() => setVideoPlaying(true)}
              playsInline
              preload="metadata"
              ref={videoRef}
            >
              <source src="/videos/vozon-home-intro.mp4" type="video/mp4" />
              Your browser does not support embedded video.
            </video>
            {!videoPlaying && (
              <button
                aria-label="Play Vozon introduction video"
                className="vozon-intro-video-play"
                onClick={() => void videoRef.current?.play()}
                type="button"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m8 5 12 7-12 7V5Z" />
                </svg>
              </button>
            )}
            <div className="vozon-intro-video-watermark" aria-hidden="true">
              Vozon <span>AI</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Built for Enterprise & BFSI */}
        <div className="enterprise-foundation-bar">
          <div className="foundation-brand">
            <span className="foundation-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="3" y1="21" x2="21" y2="21" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <polyline points="5 6 12 3 19 6" />
                <line x1="4" y1="10" x2="4" y2="21" />
                <line x1="20" y1="10" x2="20" y2="21" />
              </svg>
            </span>
            <div className="foundation-text">
              <strong>Built for BFSI &amp; Enterprise</strong>
              <small>Secure. Compliant. Integrated.</small>
            </div>
          </div>

          <div className="foundation-pillars">
            {enterprisePillars.map((pillar, idx) => (
              <div key={pillar.label} className="foundation-step">
                <div className="foundation-pill">
                  <span className="pillar-svg" aria-hidden="true">{pillar.icon}</span>
                  <span>{pillar.label}</span>
                </div>
                {idx < enterprisePillars.length - 1 && (
                  <span className="foundation-dash-connector" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
