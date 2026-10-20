"use client";

import Link from "next/link";
import styles from "./BentoFeaturesSection.module.css";

export function BentoFeaturesSection() {
  return (
    <section className={styles.bentoSection} aria-label="Core Platform Architecture">
      <div className={styles.bentoContainer}>
        {/* Section Header */}
        <div className={styles.bentoHeader}>
          <div className={styles.pillBadge}>
            <span>✦ Platform Capabilities</span>
          </div>
          <h2 className={styles.bentoTitle}>
            Engineered for High-Stakes<br />
            <span className={styles.bentoTitleHighlight}>Telephony &amp; AI Conversations</span>
          </h2>
          <p className={styles.bentoSubtitle}>
            Designed from the ground up for low-latency phone calls, localized accents, CRM automation, and enterprise carrier interconnects.
          </p>
        </div>

        {/* Bento Grid */}
        <div className={styles.bentoGrid}>
          {/* Card 1: High Pickup Telephony & BYOT (Wide Left) */}
          <article className={`${styles.bentoCard} ${styles.cardWideLeft}`}>
            <div>
              <span className={styles.cardTag}>
                <span>📱</span> Carrier Infrastructure
              </span>
              <h3 className={styles.cardHeading}>
                Smart Virtual Telephony &amp; BYOT
              </h3>
              <p className={styles.cardDescription}>
                US voice platforms lock you into rigid 080 trunks that get flagged as spam by Truecaller. Vozon provides verified local virtual numbers and Bring-Your-Own-Carrier (BYOT) support across Exotel, Airtel, and Tata.
              </p>
            </div>

            <div className={styles.telephonyStatBox}>
              <div className={styles.statRow}>
                <div className={styles.statRowHeader}>
                  <span className={styles.statLabel}>Unverified 080 Numbers (US Bots)</span>
                  <span className={styles.statValue}>~24% Pickup Rate</span>
                </div>
                <div className={styles.statBarTrack}>
                  <div className={styles.statBarFillLow} />
                </div>
              </div>

              <div className={styles.statRow}>
                <div className={styles.statRowHeader}>
                  <span className={styles.statLabel}>Vozon Verified Smart Telephony</span>
                  <span className={`${styles.statValue} ${styles.statValueHighlight}`}>~76% Pickup Rate</span>
                </div>
                <div className={styles.statBarTrack}>
                  <div className={styles.statBarFillHigh} />
                </div>
              </div>
            </div>
          </article>

          {/* Card 2: Native Indic Engine (Wide Right) */}
          <article className={`${styles.bentoCard} ${styles.cardWideRight}`}>
            <div>
              <span className={styles.cardTag}>
                <span>🇮🇳</span> Native Indic Engine
              </span>
              <h3 className={styles.cardHeading}>
                Hinglish &amp; 22+ Indic Languages
              </h3>
              <p className={styles.cardDescription}>
                Powered by Sarvam Bulbul and Indic-tuned frontier models. Understands regional accents, local phrasing, and switches between Hindi and English mid-sentence.
              </p>
            </div>

            <div className={styles.langTagsGrid}>
              <span className={`${styles.langPill} ${styles.langPillActive}`}>हिन्दी (Hindi)</span>
              <span className={styles.langPill}>Hinglish</span>
              <span className={styles.langPill}>தமிழ் (Tamil)</span>
              <span className={styles.langPill}>తెలుగు (Telugu)</span>
              <span className={styles.langPill}>ગુજરાતી (Gujarati)</span>
              <span className={styles.langPill}>বাংলা (Bengali)</span>
              <span className={styles.langPill}>मराठी (Marathi)</span>
              <span className={styles.langPill}>+76 Global</span>
            </div>
          </article>

          {/* Card 3: Google Sheets Outbound Auto-Dialer (Mid Left) */}
          <article className={`${styles.bentoCard} ${styles.cardMidLeft}`}>
            <div>
              <span className={styles.cardTag}>
                <span>📊</span> 1-Click Automation
              </span>
              <h3 className={styles.cardHeading}>
                Google Sheets to Outbound Dialer
              </h3>
              <p className={styles.cardDescription}>
                Paste a Google Sheet URL with your leads. Vozon automatically provisions callers, complies with TRAI calling windows, and records transcripts in real time.
              </p>
            </div>

            <div className={styles.sheetsPreviewBox}>
              <div className={styles.sheetsHeader}>
                <span>Q4_Inbound_Leads.xlsx</span>
                <span>Auto-Sync Active</span>
              </div>
              <div className={styles.sheetsRows}>
                <div className={styles.sheetRowItem}>
                  <span className={styles.leadName}>Rohan Sharma</span>
                  <span className={styles.leadPhone}>+91 98201 ••••</span>
                  <span className={styles.statusPillCompleted}>✓ Booked (4m 12s)</span>
                </div>
                <div className={styles.sheetRowItem}>
                  <span className={styles.leadName}>Priya Patel</span>
                  <span className={styles.leadPhone}>+91 97405 ••••</span>
                  <span className={styles.statusPillActive}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8" }} />
                    In Call (1m 45s)
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* Card 4: Developer MCP Server & LiveKit WebRTC (Mid Right) */}
          <article className={`${styles.bentoCard} ${styles.cardMidRight}`}>
            <div>
              <span className={styles.cardTag}>
                <span>⚡</span> Developer Infrastructure
              </span>
              <h3 className={styles.cardHeading}>
                India&apos;s First Voice AI MCP Server
              </h3>
              <p className={styles.cardDescription}>
                Connect Vozon agents directly with Claude, Cursor, and custom backend tools via the Model Context Protocol (MCP). Built on LiveKit WebRTC with sub-300ms glass-to-glass latency.
              </p>
            </div>

            <div className={styles.terminalBox}>
              <div className={styles.terminalTop}>
                <span className={`${styles.terminalDot} ${styles.dotRed}`} />
                <span className={`${styles.terminalDot} ${styles.dotYellow}`} />
                <span className={`${styles.terminalDot} ${styles.dotGreen}`} />
                <span style={{ marginLeft: 8, color: "#64748b", fontSize: "0.72rem" }}>vozon-mcp-server • v2.4</span>
              </div>
              <p className={styles.terminalComment}>// Connect Vozon to your custom tool stack</p>
              <p className={styles.terminalCode}>
                $ npx @vozon/mcp-server --token=vzn_live_94a7e2
              </p>
              <div className={styles.terminalOutput}>
                <span>●</span>
                <span>MCP Server Connected (Tools: initiate_call, check_calendar, book_appointment)</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default BentoFeaturesSection;
