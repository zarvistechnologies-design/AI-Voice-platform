"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./EnterpriseDarkHero.module.css";

const demoConversations = [
  {
    lang: "English",
    flag: "🇺🇸",
    customer: "“I need to reschedule my consultation to tomorrow afternoon.”",
    agent: "“Certainly! I have 2:30 PM or 4:15 PM available with Dr. Miller. Which one works better for you?”",
    intent: "Appointment Rescheduling",
    latency: "382ms",
  },
  {
    lang: "Hindi",
    flag: "🇮🇳",
    customer: "“नमस्ते, मुझे अपने लोन एप्लिकेशन का करंट स्टेटस जानना है।”",
    agent: "“नमस्ते! आपकी एप्लिकेशन वेरिफाई हो चुकी है और फाइनल अप्रूवल स्टेज में है। क्या मैं आपके रजिस्टर्ड नंबर पर अपडेट एसएमएस भेज दूँ?”",
    intent: "Loan Status Verification",
    latency: "395ms",
  },
  {
    lang: "Tamil",
    flag: "🇮🇳",
    customer: "“வணக்கம், எனது ஆர்டர் எப்போது டெலிவரி செய்யப்படும்?”",
    agent: "“வணக்கம்! உங்கள் ஆர்டர் இன்று மாலை 5 மணிக்குள் உங்கள் முகவரிக்கு வந்துசேரும்.”",
    intent: "Order Tracking",
    latency: "410ms",
  },
  {
    lang: "Gujarati",
    flag: "🇮🇳",
    customer: "“નમસ્તે, મારે બુકિંગ કેન્સલ કરાવવું છે.”",
    agent: "“ચોક્કસ, હું તમારી બુકિંગ કેન્સલ કરી આપું છું અને રિફંડ 24 કલાકમાં જમા થઈ જશે.”",
    intent: "Cancellation & Refund",
    latency: "390ms",
  },
];

export function EnterpriseDarkHero() {
  const [activeLangIndex, setActiveLangIndex] = useState(0);
  const activeConversation = demoConversations[activeLangIndex];

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.heroSection} aria-labelledby="enterprise-hero-title">
      <div className={styles.ambientGlowPrimary} aria-hidden="true" />
      <div className={styles.ambientGlowSecondary} aria-hidden="true" />
      <div className={styles.gridPattern} aria-hidden="true" />

      <div className={styles.container}>
        {/* Status Badge */}
        <div className={styles.statusBadge}>
          <div className={styles.pulsingBeacon}>
            <span />
            <span />
          </div>
          <span>Enterprise Real-Time Voice AI • Sub-450ms Latency</span>
        </div>

        {/* Main Headline */}
        <h1 id="enterprise-hero-title" className={styles.headline}>
          AI Voice Agents That Answer,<br />
          <span className={styles.gradientText}>Qualify, &amp; Act In Real Time.</span>
        </h1>

        {/* Subtitle */}
        <p className={styles.subheadline}>
          Deploy production-grade conversational AI that sounds indistinguishable from humans. 
          Automate thousands of inbound support calls and outbound campaigns simultaneously across 40+ languages with enterprise telephony sync.
        </p>

        {/* Dual CTAs */}
        <div className={styles.ctaRow}>
          <Link href="/dashboard" className={styles.primaryButton}>
            <span>Deploy Enterprise Agent</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
            </svg>
          </Link>

          <a 
            href="#enterprise-architecture" 
            onClick={(e) => handleScrollToSection(e, "enterprise-architecture")}
            className={styles.secondaryButton}
          >
            <span>Platform Architecture &amp; Latency ▷</span>
          </a>
        </div>

        {/* Live Latency & Interactive Dialogue Card */}
        <div className={styles.playgroundCard}>
          <div className={styles.playgroundHeader}>
            <div className={styles.playgroundTitle}>
              <span className={styles.signalDot} />
              <span>Live Conversation Simulation • {activeConversation.intent}</span>
            </div>
            <div className={styles.latencyTicker}>
              <span>⚡ Latency: {activeConversation.latency}</span>
            </div>
          </div>

          <div className={styles.playgroundBody}>
            <div className={styles.transcriptBox}>
              <div className={styles.chatBubbleCustomer}>
                <span className={styles.bubbleLabel}>Caller ({activeConversation.lang})</span>
                <p>{activeConversation.customer}</p>
              </div>

              <div className={styles.chatBubbleAgent}>
                <span className={styles.agentLabel}>Vozon Voice Agent</span>
                <p>{activeConversation.agent}</p>
              </div>
            </div>

            <div className={styles.audioCard}>
              <div className={styles.waveVisualizer} aria-hidden="true">
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
              </div>

              <div className={styles.languageChips}>
                {demoConversations.map((item, idx) => (
                  <button
                    key={item.lang}
                    type="button"
                    onClick={() => setActiveLangIndex(idx)}
                    className={`${styles.langChip} ${idx === activeLangIndex ? styles.langChipActive : ""}`}
                  >
                    <span>{item.flag} {item.lang}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Compliance & Security Ribbon */}
        <div className={styles.securityRibbon}>
          <div className={styles.securityItem}>
            <span className={styles.securityIcon}>🔒</span>
            <span>SOC-2 Type II Certified</span>
          </div>
          <div className={styles.securityItem}>
            <span className={styles.securityIcon}>🛡️</span>
            <span>HIPAA &amp; GDPR Compliant</span>
          </div>
          <div className={styles.securityItem}>
            <span className={styles.securityIcon}>⚡</span>
            <span>99.99% Enterprise SLA</span>
          </div>
          <div className={styles.securityItem}>
            <span className={styles.securityIcon}>🔐</span>
            <span>End-to-End TLS 1.3 Encryption</span>
          </div>
        </div>
      </div>

      <div className={styles.bottomTransition} aria-hidden="true" />
    </section>
  );
}
