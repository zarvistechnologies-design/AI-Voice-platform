"use client";

import Link from "next/link";
import styles from "./NewLandingHero.module.css";

export function NewLandingHero() {
  const handleScrollToDemo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const showcase = document.getElementById("showcase-section") || document.getElementById("platform");
    if (showcase) {
      showcase.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.heroWrapper} aria-labelledby="landing-hero-headline">
      <div className={styles.ambientGlow} aria-hidden="true" />
      
      <div className={styles.container}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>Next-Gen Voice AI • 40+ Languages Supported</span>
        </div>

        <h1 id="landing-hero-headline" className={styles.title}>
          Human-Like Voice Agents.<br />
          <span className={styles.titleHighlight}>Built for Real Business Conversations.</span>
        </h1>

        <p className={styles.subtitle}>
          Deploy ultra-realistic AI phone agents that answer instantly, qualify leads, and automate workflows in seconds. Speaks 40+ languages with human-grade warmth and sub-500ms latency.
        </p>

        <div className={styles.ctaGroup}>
          <Link href="/dashboard" className={styles.primaryCta}>
            <span>Build your voice agent</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
            </svg>
          </Link>

          <a href="#showcase-section" onClick={handleScrollToDemo} className={styles.secondaryCta}>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            <span>See live phone demo</span>
          </a>
        </div>

        <div className={styles.metricsBar} aria-label="Platform Highlights">
          <div className={styles.metricItem}>
            <span className={styles.metricIcon}>⚡</span>
            <span>&lt;450ms Latency</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricIcon}>🌐</span>
            <span>40+ Indian & Global Languages</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricIcon}>📞</span>
            <span>Inbound & Outbound Phone Ready</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricIcon}>🔗</span>
            <span>100+ CRM & Telephony Integrations</span>
          </div>
        </div>
      </div>
    </section>
  );
}
