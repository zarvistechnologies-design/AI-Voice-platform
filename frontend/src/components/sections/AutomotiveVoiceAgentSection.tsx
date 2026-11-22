"use client";

import Image from "next/image";
import "./AutomotiveVoiceAgentSection.css";

export function AutomotiveVoiceAgentSection() {
  return (
    <section className="automotive-voice-agent-section" aria-labelledby="auto-agent-heading">
      <div className="auto-agent-container">

        {/* Section Header: Matching Vozon theme in Image 2 */}
        <div className="auto-agent-section-header">
          <div className="auto-agent-kicker-row">
            <span className="auto-agent-kicker">VOICE AUTOMATION, SIMPLIFIED</span>
            <span className="auto-agent-pill-badge">AI VOICE PLATFORM</span>
          </div>
          <h2 id="auto-agent-heading">
            AI Voice Agents that <span className="auto-heading-accent">move work forward.</span>
          </h2>
          <p className="auto-agent-subhead">
            Automate inbound test-drive bookings, inventory queries, and service reminders with sub-88ms conversational voice intelligence.
          </p>
        </div>

        {/* Scaler Wrapper: Centers and smoothly scales the unified stage */}
        <div className="auto-stage-scaler">
          
          {/* ========================================================
             UNIFIED 2.5D INTERACTIVE SHOWCASE STAGE (1040 x 560 px)
             ======================================================== */}
          <div className="auto-unified-stage">

            {/* SVG Connecting Flow Lines */}
            <svg
              className="auto-connector-svg"
              viewBox="0 0 1040 560"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="arrowBwLeft"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" className="auto-svg-arrow" />
                </marker>
              </defs>

              {/* Line 1: From Support Call Card (x:450, y:286) to Calendar Card right edge (x:396, y:286) */}
              <path
                d="M 450 286 L 396 286"
                className="auto-flow-line"
                strokeDasharray="5 5"
                strokeWidth="2.2"
                markerEnd="url(#arrowBwLeft)"
              />

              {/* Line 2: From Support Card bottom center (x:557, y:430) down to y:440, bending right into Phone at y:452 */}
              <path
                d="M 557 430 L 557 440 Q 557 452 571 452 L 702 452"
                className="auto-flow-line"
                strokeDasharray="5 5"
                strokeWidth="2.2"
              />
            </svg>

            {/* 1. Feature Badge (Mid-Left): Handle Inbound & Outbound Calls */}
            <div className="auto-feature-badge badge-inbound-outbound">
              <span className="auto-badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  <polyline points="18 4 12 10 6 4" />
                </svg>
              </span>
              <div className="auto-badge-text">
                <strong>Handle Inbound &amp; Outbound Calls</strong>
                <p>Manages calls efficiently 24/7, so you never miss a customer.</p>
              </div>
            </div>

            {/* 2. Feature Badge (Top-Center): Answers Questions Instantly */}
            <div className="auto-feature-badge badge-answers-instantly">
              <span className="auto-badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <line x1="8" y1="9" x2="16" y2="9" />
                  <line x1="8" y1="13" x2="13" y2="13" />
                </svg>
              </span>
              <div className="auto-badge-text">
                <strong>Answers Questions Instantly</strong>
                <p>Provides accurate answers to customer queries in real-time.</p>
              </div>
            </div>

            {/* 3. Main Calendar Booking Card */}
            <div className="auto-calendar-card">
              <div className="auto-cal-confirm-banner">
                <span className="auto-check-circle" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.6">
                    <polyline points="4 8 7 11 12 5" />
                  </svg>
                </span>
                <div>
                  <strong>Booking Confirmed</strong>
                  <span>Appointment scheduled successfully</span>
                </div>
              </div>

              <div className="auto-cal-body">
                <div className="auto-cal-month-nav">
                  <strong>May 2026</strong>
                  <div className="auto-cal-arrows">
                    <button type="button" aria-label="Previous month">&lsaquo;</button>
                    <button type="button" aria-label="Next month">&rsaquo;</button>
                  </div>
                </div>

                <div className="auto-cal-weekdays">
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                </div>

                <div className="auto-cal-days">
                  <span className="is-muted">29</span>
                  <span className="is-muted">30</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                  <span>10</span>
                  <span>11</span>
                  <span>12</span>
                  <span>13</span>
                  <span>14</span>
                  <span>15</span>
                  <span className="is-active-day">16</span>
                  <span>17</span>
                  <span>18</span>
                  <span>19</span>
                  <span>20</span>
                  <span>21</span>
                  <span>22</span>
                  <span>23</span>
                  <span>24</span>
                  <span>25</span>
                  <span>26</span>
                  <span>27</span>
                  <span>28</span>
                  <span>29</span>
                  <span>30</span>
                  <span>31</span>
                </div>

                <div className="auto-cal-slot">
                  <span className="auto-clock-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </span>
                  <div>
                    <strong>Friday, May 16, 2026</strong>
                    <span>10:00 AM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Support Live Call Card (Center, connected via lines) */}
            <div className="auto-caller-card">
              <span className="auto-caller-tag">Support</span>
              <div className="auto-caller-profile">
                <div className="auto-caller-avatar">
                  <Image
                    alt="Anglo-Norman"
                    src="/images/agents/caller-avatar.png"
                    width={52}
                    height={52}
                    onError={(e) => {
                      e.currentTarget.src = "/images/avatar.png";
                    }}
                  />
                </div>
                <strong>Anglo-Norman</strong>
                <span className="auto-caller-number">+1 1165-6893-1688</span>
                <span className="auto-caller-time">
                  <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="8" cy="8" r="7" />
                    <polyline points="8 4 8 8 11 9.5" />
                  </svg>
                  00:34
                </span>
              </div>

              <div className="auto-caller-actions">
                <button type="button" className="auto-call-btn is-decline" aria-label="Decline call">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </button>
                <button type="button" className="auto-call-btn is-accept" aria-label="Accept call">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 5. Feature Badge (Bottom-Center): Set Appointments Automatically */}
            <div className="auto-feature-badge badge-set-appointments">
              <span className="auto-badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <polyline points="9 16 11 18 15 14" />
                </svg>
              </span>
              <div className="auto-badge-text">
                <strong>Set Appointments Automatically</strong>
                <p>Books, confirms, and manages appointments seamlessly.</p>
              </div>
            </div>

            {/* 6. Realistic Smartphone Frame with Live AI Agent (Vini) */}
            <div className="auto-phone-frame" aria-label="Smartphone running Vozon AI Agent Vini">
              <div className="auto-phone-body">

                {/* Status Bar */}
                <div className="auto-phone-status-bar">
                  <span className="auto-phone-time">11:11</span>
                  <div className="auto-phone-dynamic-island">
                    <span className="auto-island-dot" />
                  </div>
                  <div className="auto-phone-status-icons">
                    <svg width="15" height="11" viewBox="0 0 17 12" fill="currentColor">
                      <rect x="0" y="8" width="2.5" height="4" rx="0.5" />
                      <rect x="4.5" y="5.5" width="2.5" height="6.5" rx="0.5" />
                      <rect x="9" y="3" width="2.5" height="9" rx="0.5" />
                      <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" />
                    </svg>
                    <span className="auto-phone-network">5G</span>
                    <svg width="20" height="11" viewBox="0 0 22 12" fill="currentColor">
                      <rect x="0" y="1" width="18" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="2" y="3" width="14" height="6" rx="1.5" />
                      <path d="M19 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* Main Phone Screen */}
                <div className="auto-phone-screen">
                  {/* Agent Header with generous spacing */}
                  <div className="auto-phone-agent-header">
                    <span className="auto-phone-agent-role">AI Agent</span>
                    <h3 className="auto-phone-agent-name">Vini</h3>
                  </div>

                  {/* Vini Full Head Silhouette Cutout (Cache-busted, 30px transparent headroom) */}
                  <div className="auto-phone-portrait-wrap">
                    <Image
                      alt="Vini - AI Voice Agent"
                      src="/images/agents/vini-portrait-full.png"
                      width={270}
                      height={290}
                      style={{ width: "auto", height: "auto" }}
                      className="auto-phone-portrait-cutout"
                      priority
                      onError={(e) => {
                        e.currentTarget.src = "/images/agents/vini-ai-agent.png";
                      }}
                    />
                  </div>

                  {/* Active Call Controls */}
                  <div className="auto-phone-call-actions">
                    <div className="auto-phone-call-pill">
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 13.5v-2a10 10 0 0 1 2.2-6.2A10 10 0 0 1 10.4 3h2" />
                        <polyline points="9 1 13 3 9 5" />
                      </svg>
                      <span>00:34</span>
                    </div>

                    <button type="button" className="auto-phone-end-call-btn" aria-label="End call">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                      <span>End</span>
                    </button>
                  </div>

                  {/* Animated Audio Equalizer Waveform */}
                  <div className="auto-phone-soundwave" aria-hidden="true">
                    {[12, 22, 16, 28, 40, 26, 44, 34, 22, 36, 48, 42, 28, 18, 32, 46, 38, 20, 14, 26, 38, 28, 16, 10].map((height, i) => (
                      <span
                        key={i}
                        className="auto-soundwave-bar"
                        style={{
                          height: `${height}px`,
                          animationDelay: `${(i * 0.07) % 1.2}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* iOS Home Indicator Bar */}
                  <div className="auto-phone-home-indicator" aria-hidden="true" />
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Stats Bar matching Image 2 reference */}
        <div className="auto-agent-stats-bar">
          <div className="auto-stat-item">
            <strong>0.8s</strong>
            <span>AVERAGE RESPONSE</span>
          </div>
          <div className="auto-stat-divider" aria-hidden="true" />
          <div className="auto-stat-item">
            <strong>24/7</strong>
            <span>ALWAYS AVAILABLE</span>
          </div>
          <div className="auto-stat-divider" aria-hidden="true" />
          <div className="auto-stat-item">
            <strong>99.9%</strong>
            <span>PLATFORM UPTIME</span>
          </div>
        </div>

      </div>
    </section>
  );
}
