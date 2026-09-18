"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./NeurixVoiceHero.module.css";

export function NeurixVoiceHero() {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      window.location.href = `/contact?inquiry=${encodeURIComponent(inputValue)}`;
    }
  };

  return (
    <section className={styles.heroWrapper} aria-labelledby="voice-hero-title">
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header Typography */}
        <div className={styles.headerContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>Next-Gen Voice AI • 40+ Languages Supported</span>
          </div>

          <h1 id="voice-hero-title" className={styles.headline}>
            Build Human-Like Voice Agents<br />
            <span className={styles.headlineGradient}>For Real-Time Conversations.</span>
          </h1>

          <p className={styles.subtitle}>
            Deploy ultra-realistic AI voice agents that answer inbound calls, qualify leads, and book appointments 24/7 across phone and web with sub-second latency.
          </p>

          {/* Interactive Input Pill */}
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.emailInput}
                placeholder="Enter phone number or email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
                aria-label="Phone number or email for live voice demo"
              />
              <button type="submit" className={styles.demoButton}>
                Test Voice Agent <span aria-hidden="true">▷</span>
              </button>
            </div>
            <div className={styles.microCopy}>
              <span><i>✓</i> Sub-380ms Latency</span>
              <span><i>✓</i> 40+ Indian & Global Languages</span>
              <span><i>✓</i> No Credit Card Required</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
