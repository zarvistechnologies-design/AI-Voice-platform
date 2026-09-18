"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { VoiceStackCalculator } from "@/components/pricing/VoiceStackCalculator";
import styles from "./PricingExperience.module.css";

const MINUTE_RATE_MIN = 0.07;
const MINUTE_RATE_MAX = 0.12;

const calculatorPresets = [
  { label: "Starter", calls: 100, minutes: 2 },
  { label: "Growing", calls: 500, minutes: 3 },
  { label: "Scale", calls: 2000, minutes: 4 },
] as const;

const includedServices = [
  { title: "Voice orchestration", text: "Inbound and outbound call routing.", icon: "phone" },
  { title: "Global telephony", text: "Reliable carrier coverage.", icon: "tower" },
  { title: "Live transcription", text: "Real-time speech recognition.", icon: "chat" },
  { title: "AI model usage", text: "Natural, context-aware conversations.", icon: "chip" },
  { title: "Voice generation", text: "High-quality, natural speech.", icon: "voice" },
  { title: "Usage analytics", text: "Itemized call and cost details.", icon: "chart" },
] as const;

const faqs = [
  { question: "Do I need to choose a pricing plan?", answer: "No. Vozon uses one pay-as-you-go model. Add credits to your wallet and use them whenever you make calls." },
  { question: "How am I charged?", answer: "You are charged for actual usage. After each call, the cost is deducted from your wallet and shown as an itemized breakdown in your billing dashboard." },
  { question: "Why can the per-minute cost change?", answer: "The final cost depends on the carrier destination, call duration, speech provider, AI model, and voice selected. Your dashboard shows the exact cost of every completed call." },
  { question: "Is there a monthly fee or minimum commitment?", answer: "No. There is no recurring subscription, setup fee, or minimum monthly spend. You pay only for what you use." },
  { question: "How do wallet credits work?", answer: "Purchase credits whenever your balance is low. You can also enable auto-refill to keep calls running without manually topping up your wallet." },
  { question: "Are telephony and AI provider costs included?", answer: "Yes. The call breakdown combines platform, telephony, transcription, AI model, and voice-generation costs. Premium providers and international routes may cost more." },
] as const;

function ArrowIcon() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 20 20"><path d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>;
}

function CheckIcon() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 20 20"><path d="m5 10.2 3.1 3.1L15.5 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}

function ServiceIcon({ type }: { type: (typeof includedServices)[number]["icon"] }) {
  const paths = {
    phone: <><path d="m7.5 4-2 1.6c-.7.5-.9 1.5-.5 2.3 1.8 4 4.6 6.8 8.6 8.7.8.4 1.8.2 2.4-.5l1.5-1.8-3-2.1-1.5 1.2a12 12 0 0 1-3.4-3.4l1.1-1.5-2-3Z" /><path d="M14 5.5a4.5 4.5 0 0 1 3.5 3.5" /></>,
    tower: <><path d="M12 4v16M8.5 20 12 4l3.5 16M7.2 13h9.6M9 9.5h6" /><path d="M5.4 7.6a9 9 0 0 0 0 8.8M18.6 7.6a9 9 0 0 1 0 8.8" /></>,
    chat: <><path d="M5 5.5h14v10H10l-4 3v-3H5v-10Z" /><path d="M8.5 10.5h.1m3.3 0h.1m3.3 0h.1" /></>,
    chip: <><rect height="10" rx="1.5" width="10" x="7" y="7" /><path d="M9.5 3.5v3M14.5 3.5v3M9.5 17.5v3M14.5 17.5v3M3.5 9.5h3M3.5 14.5h3M17.5 9.5h3M17.5 14.5h3" /></>,
    voice: <path d="M5 12h2m2-5v10m3-14v18m3-14v10m3-5h2" />,
    chart: <path d="M5 19h14M7 17v-5h3v5m2 0V8h3v9m2 0V5h3v12" />,
  } as const;
  return <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">{paths[type]}</svg>;
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value < 100 ? 2 : 0 }).format(value);
}

export function PricingExperience() {
  const [calls, setCalls] = useState(100);
  const [minutes, setMinutes] = useState(2);
  const [calculatedUsage, setCalculatedUsage] = useState({ calls: 100, minutes: 2 });

  const estimate = useMemo(() => {
    const safeCalls = Math.max(0, Math.min(1_000_000, Number.isFinite(calculatedUsage.calls) ? calculatedUsage.calls : 0));
    const safeMinutes = Math.max(0, Math.min(240, Number.isFinite(calculatedUsage.minutes) ? calculatedUsage.minutes : 0));
    const totalMinutes = safeCalls * safeMinutes;
    return { calls: safeCalls, minutes: safeMinutes, totalMinutes, minimum: totalMinutes * MINUTE_RATE_MIN, maximum: totalMinutes * MINUTE_RATE_MAX };
  }, [calculatedUsage]);

  function calculateCost() {
    setCalculatedUsage({ calls, minutes });
    window.requestAnimationFrame(() => document.getElementById("pricing-estimate")?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }

  function resetCalculator() {
    setCalls(100);
    setMinutes(2);
    setCalculatedUsage({ calls: 100, minutes: 2 });
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.shell}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}><i /> Simple, transparent pricing</span>
              <h1>Voice AI pricing<br />that scales with <em>you.</em></h1>
              <p>One flexible pay-as-you-go model. No subscriptions, setup fees, or long-term commitments—just the voice AI you actually use.</p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} href="/login?mode=register">Start building free <ArrowIcon /></Link>
                <a className={styles.secondaryButton} href="#calculator">Calculate your cost</a>
              </div>
              <div className={styles.trustRow}>
                <span><CheckIcon /> No monthly fee</span><span><CheckIcon /> No setup fee</span><span><CheckIcon /> Cancel anytime</span>
              </div>
            </div>

            <div className={styles.heroCard}>
              <div className={styles.cardTopline}><span>Pay as you go</span><span className={styles.liveBadge}><i /> Live pricing</span></div>
              <div className={styles.priceRow}><strong>$0.07–$0.12</strong><span>per connected<br />minute</span></div>
              <p>Your typical all-in estimate. The final rate reflects the exact providers and carrier route used.</p>
              <div className={styles.miniBreakdown}>
                <div><span>Platform fee</span><strong>$0</strong></div><div><span>Minimum spend</span><strong>None</strong></div><div><span>Billing</span><strong>Per use</strong></div>
              </div>
              <div className={styles.cardFooter}><span className={styles.wave} aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span><span>Built for calls of every size</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.includedSection}`} id="pricing-plan">
        <div className={styles.shell}>
          <header className={styles.sectionHeading}><span className={styles.kicker}>Everything you need</span><h2>One plan. Every capability.</h2><p>Build, launch, and improve voice agents without navigating tiers or feature gates.</p></header>
          <div className={styles.includedGrid}>
            {includedServices.map((service, index) => <article className={styles.featureCard} key={service.title}><span className={styles.featureNumber}>0{index + 1}</span><span className={styles.featureIcon}><ServiceIcon type={service.icon} /></span><h3>{service.title}</h3><p>{service.text}</p></article>)}
          </div>
          <div className={styles.billingNote}><span><CheckIcon /></span><div><strong>Clear down to every call.</strong><p>Your dashboard shows duration, services used, and the final cost for each completed call. Prices are shown in USD and taxes are excluded.</p></div><Link href="/login?mode=register">Explore the dashboard <ArrowIcon /></Link></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tintedSection} ${styles.stackSection}`} id="voice-stack">
        <div className={styles.shell}>
          <header className={styles.sectionHeading}><span className={styles.kicker}>Make it yours</span><h2>Build your ideal voice stack.</h2><p>Mix and match language, transcription, and voice models. Your estimate updates as you choose.</p></header>
          <div className={styles.stackWrapper}><VoiceStackCalculator /></div>
        </div>
      </section>

      <section className={styles.section} id="calculator">
        <div className={styles.shell}>
          <header className={styles.sectionHeading}><span className={styles.kicker}>Plan with confidence</span><h2>Estimate your monthly usage.</h2><p>Use a quick scenario or enter your own call volume. You will only be billed for actual usage.</p></header>
          <div className={styles.calculator}>
            <div className={styles.calculatorForm}>
              <div className={styles.formHeader}><span>01</span><div><strong>Choose a starting point</strong><small>Use a preset or enter custom numbers below.</small></div></div>
              <div className={styles.presets}>
                {calculatorPresets.map((preset) => {
                  const isActive = calls === preset.calls && minutes === preset.minutes;
                  return <button aria-pressed={isActive} className={isActive ? styles.activePreset : ""} key={preset.label} onClick={() => { setCalls(preset.calls); setMinutes(preset.minutes); }} type="button"><strong>{preset.label}</strong><span>{preset.calls.toLocaleString()} calls · {preset.minutes} min</span></button>;
                })}
              </div>
              <div className={styles.formHeader}><span>02</span><div><strong>Enter your usage</strong><small>Adjust these values to match your forecast.</small></div></div>
              <div className={styles.fields}>
                <label><span>Calls per month</span><input inputMode="numeric" max="1000000" min="0" onChange={(event) => setCalls(event.target.valueAsNumber || 0)} type="number" value={calls} /></label>
                <label><span>Minutes per call</span><input inputMode="decimal" max="240" min="0" onChange={(event) => setMinutes(event.target.valueAsNumber || 0)} step="0.5" type="number" value={minutes} /></label>
              </div>
              <div className={styles.calculatorActions}><button onClick={calculateCost} type="button">Update estimate <ArrowIcon /></button><button onClick={resetCalculator} type="button">Reset</button></div>
            </div>

            <aside className={styles.estimate} id="pricing-estimate" aria-live="polite">
              <span className={styles.estimateLabel}>Estimated monthly cost</span><strong>{formatUsd(estimate.minimum)}<i>–</i>{formatUsd(estimate.maximum)}</strong><p>before taxes, with no recurring platform fee</p>
              <div className={styles.estimateStats}><div><span>Connected minutes</span><strong>{estimate.totalMinutes.toLocaleString("en-US", { maximumFractionDigits: 1 })}</strong></div><div><span>Estimated rate</span><strong>$0.07–$0.12</strong></div></div>
              <div className={styles.equation}><span>{estimate.calls.toLocaleString()} calls</span><b>×</b><span>{estimate.minutes} min</span><b>=</b><span>{estimate.totalMinutes.toLocaleString()} min</span></div>
              <small>Actual cost varies with your carrier route, AI model, transcription provider, and voice.</small>
            </aside>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.faqSection}`} id="faq">
        <div className={`${styles.shell} ${styles.faqLayout}`}>
          <div className={styles.faqIntro}><span className={styles.kicker}>Questions, answered</span><h2>Pricing without the fine print.</h2><p>Everything you need to know about usage, credits, and billing.</p><Link className={styles.textLink} href="/contact">Talk to our team <ArrowIcon /></Link></div>
          <div className={styles.faqList}>{faqs.map((faq, index) => <details className={styles.faqItem} key={faq.question} open={index === 0}><summary><span>0{index + 1}</span><strong>{faq.question}</strong><i aria-hidden="true">+</i></summary><p>{faq.answer}</p></details>)}</div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={`${styles.shell} ${styles.cta}`}><div><span>Start today</span><h2>Turn every call into progress.</h2><p>Create your first voice agent in minutes, or talk with our team about a custom rollout.</p></div><div><Link href="/login?mode=register">Get started <ArrowIcon /></Link><Link href="/contact">Contact sales</Link></div></div>
      </section>
    </div>
  );
}
