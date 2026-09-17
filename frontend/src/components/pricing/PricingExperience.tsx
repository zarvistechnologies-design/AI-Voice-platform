"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { VoiceStackCalculator } from "@/components/pricing/VoiceStackCalculator";

const MINUTE_RATE_MIN = 0.07;
const MINUTE_RATE_MAX = 0.12;

const calculatorPresets = [
  { label: "Try it", calls: 100, minutes: 2 },
  { label: "Regular use", calls: 500, minutes: 3 },
  { label: "High use", calls: 2000, minutes: 4 },
] as const;

const faqs = [
  {
    question: "Do I need to choose a pricing plan?",
    answer: "No. Vozon uses one pay-as-you-go pricing model. Add credits to your wallet and use them whenever you make calls.",
    icon: "document",
  },
  {
    question: "How am I charged?",
    answer: "You are charged for actual usage. After each call, the cost is deducted from your wallet and shown as an itemized breakdown in your billing dashboard.",
    icon: "wallet",
  },
  {
    question: "Why can the per-minute cost change?",
    answer: "The final cost depends on the carrier destination, call duration, speech provider, AI model, and voice selected. Your dashboard shows the exact cost of every completed call.",
    icon: "chart",
  },
  {
    question: "Is there a monthly fee or minimum commitment?",
    answer: "No. There is no recurring subscription, setup fee, or minimum monthly spend. You pay only for what you use.",
    icon: "shield",
  },
  {
    question: "How do wallet credits work?",
    answer: "Purchase credits whenever your balance is low. You can also enable auto-refill to keep calls running without manually topping up your wallet.",
    icon: "wallet",
  },
  {
    question: "Are telephony and AI provider costs included?",
    answer: "Yes. The call breakdown combines platform, telephony, transcription, AI model, and voice-generation costs. Premium providers and international routes may cost more.",
    icon: "settings",
  },
] as const;

const includedServices = [
  { title: "Voice agent orchestration and routing", text: "Handle inbound and outbound calls with intelligent routing.", icon: "phone" },
  { title: "Telephony and carrier usage", text: "Global coverage with reliable carriers.", icon: "tower" },
  { title: "Live speech-to-text transcription", text: "Accurate, real-time transcription.", icon: "chat" },
  { title: "AI model usage", text: "Use the latest AI models for natural conversations.", icon: "chip" },
  { title: "Text-to-speech voice generation", text: "High-quality, natural-sounding voices.", icon: "voice" },
  { title: "Call logs and itemized usage details", text: "Full transparency in your billing dashboard.", icon: "chart" },
] as const;

function ArrowIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function FaqIcon({ type }: { type: (typeof faqs)[number]["icon"] }) {
  const paths = {
    document: <><path d="M7 3.5h7l3 3v14H7v-17Z" /><path d="M14 3.5V7h3M10 11h4m-4 3h4" /></>,
    wallet: <><path d="M4.5 7h14.2a1.8 1.8 0 0 1 1.8 1.8v9.4a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8V6.1a2.1 2.1 0 0 1 2.1-2.1h12" /><path d="M15.8 12.4h4.7v3.8h-4.7a1.9 1.9 0 0 1 0-3.8Z" /></>,
    chart: <><path d="M4 20h16M6.5 17v-5h3v5m3 0V8h3v9m3 0V4h3v13" /></>,
    shield: <><path d="m12 3.4 7 2.8v5c0 4.4-2.9 7.9-7 9.7-4.1-1.8-7-5.3-7-9.7v-5l7-2.8Z" /><path d="m8.6 11.8 2.2 2.2 4.6-4.7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.8-1L14.5 3h-5l-.3 2.9a7 7 0 0 0-1.8 1l-2.4-1-2 3.4L5 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.8 1l.3 2.9h5l.3-2.9a7 7 0 0 0 1.8-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" /></>,
  } as const;

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

function ServiceIcon({ type }: { type: (typeof includedServices)[number]["icon"] | "document" }) {
  const paths = {
    phone: <><path d="m7.5 4-2 1.6c-.7.5-.9 1.5-.5 2.3 1.8 4 4.6 6.8 8.6 8.7.8.4 1.8.2 2.4-.5l1.5-1.8-3-2.1-1.5 1.2a12 12 0 0 1-3.4-3.4l1.1-1.5-2-3Z" /><path d="M14 5.5a4.5 4.5 0 0 1 3.5 3.5" /></>,
    tower: <><path d="M12 4v16M8.5 20 12 4l3.5 16M7.2 13h9.6M9 9.5h6" /><path d="M5.4 7.6a9 9 0 0 0 0 8.8M18.6 7.6a9 9 0 0 1 0 8.8" /></>,
    chat: <><path d="M5 5.5h14v10H10l-4 3v-3H5v-10Z" /><path d="M8.5 10.5h.1m3.3 0h.1m3.3 0h.1" /></>,
    chip: <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M9.5 3.5v3M14.5 3.5v3M9.5 17.5v3M14.5 17.5v3M3.5 9.5h3M3.5 14.5h3M17.5 9.5h3M17.5 14.5h3" /></>,
    voice: <><path d="M5 12h2m2-5v10m3-14v18m3-14v10m3-5h2" /></>,
    chart: <><path d="M5 19h14M7 17v-5h3v5m2 0V8h3v9m2 0v-12h3v12" /></>,
    document: <><path d="M7 3.8h7l3 3v13.4H7V3.8Z" /><path d="M14 3.8v3.5h3M10 12h4m-4 3h4" /></>,
  } as const;

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 100 ? 2 : 0,
  }).format(value);
}

export function PricingExperience() {
  const [calls, setCalls] = useState(100);
  const [minutes, setMinutes] = useState(2);

  const estimate = useMemo(() => {
    const safeCalls = Math.max(0, Math.min(1_000_000, Number.isFinite(calls) ? calls : 0));
    const safeMinutes = Math.max(0, Math.min(240, Number.isFinite(minutes) ? minutes : 0));
    const totalMinutes = safeCalls * safeMinutes;

    return {
      totalMinutes,
      minimum: totalMinutes * MINUTE_RATE_MIN,
      maximum: totalMinutes * MINUTE_RATE_MAX,
    };
  }, [calls, minutes]);

  return (
    <div className="pricing-page bg-white text-[#171719]">
      <section className="pricing-hero px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
  <div className="pricing-hero-grid">

    {/* LEFT SIDE */}
    <div className="pricing-left">

      <p className="pricing-left-subtitle">
        COST EFFECTIVE. SCALABLE. RELIABLE.
      </p>

      <h2 className="pricing-left-title">
        Smarter
        <br />
        Conversations
        <br />
        <span>Lower Costs</span>
      </h2>

      <div className="pricing-left-item">
        <span className="pricing-left-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M7.2 3.8 5.4 5.2c-.8.7-.9 1.8-.4 2.8 2.2 4.5 5.5 7.8 10 10 .9.4 2 .3 2.7-.4l1.5-1.7-3.1-2.1-1.4 1.3c-2-1.1-3.7-2.8-4.8-4.8l1.2-1.4-2-3.1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14.7 5.5a5 5 0 0 1 3.8 3.8M14.6 2.8a7.7 7.7 0 0 1 6.6 6.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
        </span>

        <div>
          <strong>Pay only for what you use</strong>
          <small>No subscription</small>
        </div>
      </div>

      <div className="pricing-left-item">
        <span className="pricing-left-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5h3.6V12H3v8.5Zm7.2 0h3.6V7.3h-3.6v13.2Zm7.2 0H21V3.5h-3.6v17Z"/></svg>
        </span>

        <div>
          <strong>Transparent pricing</strong>
          <small>No hidden fees</small>
        </div>
      </div>

      <div className="pricing-left-item">
        <span className="pricing-left-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 3.2 19 6v5.1c0 4.4-2.9 7.9-7 9.7-4.1-1.8-7-5.3-7-9.7V6l7-2.8Z" fill="currentColor" opacity=".16"/><path d="m8.3 11.8 2.3 2.3 4.9-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>

        <div>
          <strong>Built for businesses</strong>
          <small>Scale with confidence</small>
        </div>
      </div>

    </div>

    {/* CENTER */}
    <div className="pricing-center">

      <p className="pricing-badge inline-flex rounded-full border border-[#118778]/20 bg-[#118778]/[0.07] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#118778]">
        <span className="mr-2">●</span>
        Pricing
      </p>

      <h1>
        Pay only for the
        <br />
        <span>voice AI</span> you use.
      </h1>

      <p className="pricing-center-description">
        No subscription, setup fee, or monthly commitment. Add wallet
        credits and pay only for the services used during each call.
      </p>

      <nav
        className="pricing-hero-nav"
        aria-label="Pricing page sections"
      >
        {[
          ["Pricing plan", "#pricing-plan"],
          ["Voice stack", "#voice-stack"],
          ["Calculator", "#calculator"],
          ["FAQ", "#faq"],
          ["Contact", "#contact"],
        ].map(([label, href]) => (
          <a href={href} key={href}>
            {label}
          </a>
        ))}
      </nav>

    </div>

    {/* RIGHT SIDE */}
    <div className="pricing-visual">

      <div className="pricing-pay-card">

        <h3>Pay as you go</h3>

        <div className="pricing-pay-item">
          <span className="pricing-pay-check">✓</span>
          Voice Calls
        </div>

        <div className="pricing-pay-item">
          <span className="pricing-pay-check">✓</span>
          Transcription
        </div>

        <div className="pricing-pay-item">
          <span className="pricing-pay-check">✓</span>
          Analytics
        </div>

        <div className="pricing-pay-item">
          <span className="pricing-pay-check">✓</span>
          More...
        </div>

        <div className="pricing-credit-card" aria-hidden="true">
          <div className="pricing-credit-card-glow" />
          <div className="pricing-card-chip"><i /><i /><i /><i /></div>
          <div className="pricing-card-number"><span /><span /><span /><span /></div>
          <div className="pricing-card-footer"><span>VOZON</span><span>AI VOICE</span></div>
        </div>

        <div className="pricing-wallet" aria-hidden="true">
          <svg viewBox="0 0 28 28" fill="none"><path d="M4 8.3h17.3c1.5 0 2.7 1.2 2.7 2.7v9.4c0 1.5-1.2 2.7-2.7 2.7H5.8A2.8 2.8 0 0 1 3 20.4V7.1a2.2 2.2 0 0 1 2.2-2.2h14.6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M18.5 14.2h5.4v4.1h-5.4a2 2 0 0 1 0-4.1Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="19.2" cy="16.2" r=".8" fill="currentColor"/></svg>
        </div>

        <div className="pricing-rupee" aria-hidden="true">
          ₹
        </div>

        <div className="pricing-voice-icon" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span />
        </div>

      </div>

    </div>

  </div>
</section>

      <section className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8" id="pricing-plan">
        <div className="pricing-plan-wrap mx-auto max-w-[1400px]">
          <div className="mb-8 max-w-2xl">
            <p className="pricing-eyebrow text-xs font-bold uppercase tracking-[0.16em] text-[#0c756a]">Pricing plan</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#142034] sm:text-3xl">One plan for every account</h2>
            <p className="mt-2 text-sm text-[#66758a] sm:text-base">Simple, transparent, and built to scale with your business.</p>
          </div>
          <div className="pricing-plan-doodle" aria-hidden="true"><svg viewBox="0 0 180 70" fill="none"><path d="M7 43c22-34 57-33 67-14 6 11-5 20 9 26 15 7 32 1 44-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="m121 40 8 6-10 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg><span>More calls.<br />More growth.</span></div>

          <article className="pricing-plan-card">
            <div className="pricing-plan-summary">
              <span className="pricing-plan-badge"><i />Pay as you go</span>
              <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-2">
                <strong className="pricing-plan-price">$0.07 – $0.12</strong>
                <span className="pricing-plan-unit">per connected minute</span>
              </div>
              <p className="pricing-plan-copy">
                This is the typical estimated range. The exact rate depends on your carrier route, AI model, transcription provider, and voice.
              </p>

              <dl className="pricing-plan-terms">
                <div><dt><i className="calendar" />Monthly subscription</dt><dd>$0</dd></div>
                <div><dt><i className="settings" />Setup fee</dt><dd>$0</dd></div>
                <div><dt><i className="document" />Minimum commitment</dt><dd>None</dd></div>
              </dl>

              <div className="pricing-plan-actions">
                <Link className="pricing-plan-start" href="/login">Get started <ArrowIcon /></Link>
                <Link className="pricing-plan-contact" href="/contact">Contact sales</Link>
                <span className="pricing-plan-no-fee">♢ <span>No hidden fees.<br />Ever.</span></span>
              </div>
            </div>

            <div className="pricing-plan-services">
              <p className="pricing-eyebrow text-[11px] font-bold uppercase tracking-[0.16em] text-[#0a947f]">Included with usage</p>
              <h3>Everything required to run your calls</h3>
              <p className="pricing-services-intro">All the essential services are included. You only pay for what you use.</p>
              <ul>
                {includedServices.map((service) => (
                  <li key={service.title}>
                    <span className={`pricing-service-icon ${service.icon}`}><ServiceIcon type={service.icon} /></span>
                    <span><strong>{service.title}</strong><small>{service.text}</small></span>
                  </li>
                ))}
              </ul>
              <div className="pricing-transparent-billing">
                <span className="pricing-service-icon document"><ServiceIcon type="document" /></span>
                <div><h4>Transparent billing</h4><p>
                  Every completed call includes its duration, services used, and final cost in your dashboard. Prices are shown in USD unless a provider publishes its rate in INR. Taxes are excluded.
                </p></div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="pricing-model-section scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8" id="voice-stack">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-2xl">
            <p className="pricing-eyebrow text-xs font-bold uppercase tracking-[0.16em] text-[#087e70]">◉ &nbsp; Model pricing</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#122038] sm:text-3xl">Build and price your voice stack</h2>
            <p className="mt-4 text-sm leading-6 text-[#596d82]">
              Select your language model, speech-to-text provider, and text-to-speech voice to estimate the combined provider cost per connected minute.
            </p>
          </div>
          <div className="pricing-model-doodle" aria-hidden="true"><span>Mix.<br />Match.<br />Scale.</span><svg viewBox="0 0 120 58" fill="none"><path d="M4 15c22 27 55 31 84 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="m83 20 7 8-11 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <VoiceStackCalculator />
        </div>
      </section>

      <section className="pricing-calculator-section scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8" id="calculator">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 max-w-2xl">
            <p className="pricing-eyebrow text-xs font-bold uppercase tracking-[0.16em] text-[#087e70]">Usage calculator</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#132138] sm:text-3xl">Estimate your monthly cost</h2>
            <p className="mt-4 text-sm leading-6 text-[#5c7084]">Enter your expected call usage to calculate an estimated range. This is not a subscription or recurring charge.</p>
          </div>

          <div className="pricing-calculator-card">
            <div className="pricing-calculator-inputs">
              <div className="pricing-calculator-step"><b>1</b><span><strong>Choose a quick example (optional)</strong><small>Start with a preset or enter your own numbers.</small></span></div>
              <div className="pricing-calculator-presets">
                {calculatorPresets.map((preset) => {
                  const isActive = calls === preset.calls && minutes === preset.minutes;
                  return (
                    <button
                      className={isActive ? "active" : ""}
                      key={preset.label}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        setCalls(preset.calls);
                        setMinutes(preset.minutes);
                      }}
                    >
                      <strong>{preset.label}</strong><small>{preset.calls.toLocaleString()} calls · {preset.minutes} min</small>
                    </button>
                  );
                })}
              </div>

              <div className="pricing-calculator-step second"><b>2</b><span><strong>Enter your usage</strong></span></div>
              <div className="pricing-calculator-fields">
                <label>
                  <span>☎ &nbsp; Number of calls</span>
                  <input min="0" max="1000000" inputMode="numeric" type="number" value={calls} onChange={(event) => setCalls(event.target.valueAsNumber || 0)} />
                  <small>Total calls per month</small>
                </label>
                <label>
                  <span>◷ &nbsp; Average minutes per call</span>
                  <input min="0" max="240" step="0.5" inputMode="decimal" type="number" value={minutes} onChange={(event) => setMinutes(event.target.valueAsNumber || 0)} />
                  <small>Average call duration in minutes</small>
                </label>
              </div>
              <div className="pricing-calculator-actions"><button type="button">Calculate cost <ArrowIcon /></button><button type="button" onClick={() => { setCalls(100); setMinutes(2); }}>↻ &nbsp; Reset</button></div>
            </div>

            <div className="pricing-estimate-panel">
              <div className="pricing-calculator-pay" aria-hidden="true"><span><svg viewBox="0 0 28 28" fill="none"><path d="M4 8.3h17.3c1.5 0 2.7 1.2 2.7 2.7v9.4c0 1.5-1.2 2.7-2.7 2.7H5.8A2.8 2.8 0 0 1 3 20.4V7.1a2.2 2.2 0 0 1 2.2-2.2h14.6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M18.5 14.2h5.4v4.1h-5.4a2 2 0 0 1 0-4.1Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="19.2" cy="16.2" r=".8" fill="currentColor"/></svg></span><p><strong>Pay as you go</strong><small>No subscription</small></p></div>
              <div>
                <span className="pricing-estimate-label"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h16M6 17v-5h3v5m3 0V8h3v9m3 0V4h3v13" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>Estimated cost range</span>
                <strong>
                  {formatUsd(estimate.minimum)}–{formatUsd(estimate.maximum)}
                </strong>
                <span className="pricing-estimate-note">for the usage entered, before taxes</span>
              </div>
              <div className="pricing-estimate-metrics"><div><i className="minutes" aria-hidden="true">☎</i><strong>{estimate.totalMinutes.toLocaleString("en-US", { maximumFractionDigits: 1 })}</strong><span>Connected minutes<br /><small>{calls} calls × {minutes} min</small></span></div><div><i className="rate" aria-hidden="true">◉</i><strong>$0.07 – $0.12</strong><span>Estimated rate<br /><small>per minute</small></span></div><div><i className="monthly" aria-hidden="true">▤</i><strong>{formatUsd(estimate.minimum)}–{formatUsd(estimate.maximum)}</strong><span>Estimated monthly cost<br /><small>before taxes</small></span></div></div>
              <div className="pricing-estimate-how"><strong>✦ &nbsp; How it works</strong><p>Your wallet is charged only for actual usage, not this estimate. The final cost depends on your carrier route, AI model, transcription provider, and voice.</p></div>
              <div className="pricing-estimate-footer"><span>✓ &nbsp; No subscription</span><span>✓ &nbsp; No setup fee</span><span>✓ &nbsp; Transparent pricing</span></div>
            </div>
          </div>
          <div className="pricing-calculator-doodle" aria-hidden="true"><svg viewBox="0 0 100 55" fill="none"><path d="M6 42c8-24 35-31 55-20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="m55 15 7 7-10 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Plan smarter.<br />Pay only for what you use</span></div>
        </div>
      </section>

      <section className="pricing-faq-section scroll-mt-20" id="faq">
        <div className="pricing-faq-layout">
          <aside className="pricing-faq-intro">
            <p className="pricing-faq-eyebrow">FAQ</p>
            <h2>Pricing questions</h2>
            <p>Clear answers about billing, wallet credits, and usage costs.</p>
            <div className="pricing-faq-benefits" aria-label="Pricing benefits">
              <div><span><FaqIcon type="shield" /></span><p><strong>Transparent pricing</strong><small>No hidden fees</small></p></div>
              <div><span><FaqIcon type="wallet" /></span><p><strong>Pay only for what you use</strong><small>No subscription</small></p></div>
              <div><span><FaqIcon type="settings" /></span><p><strong>Here to help</strong><small>Get support when you need it</small></p></div>
            </div>
            <Link className="pricing-faq-contact" href="/contact">Contact us <ArrowIcon /></Link>
          </aside>

          <div className="pricing-faq-list">
            {faqs.map((faq) => (
              <details className="pricing-faq-card group" key={faq.question}>
                <summary>
                  <span className="pricing-faq-card-icon"><FaqIcon type={faq.icon} /></span>
                  <span className="pricing-faq-card-copy"><strong>{faq.question}</strong></span>
                  <span className="pricing-faq-toggle" aria-hidden="true"><i className="group-open:hidden">+</i><i className="hidden group-open:block">−</i></span>
                </summary>
                <p className="pricing-faq-answer">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 bg-black px-6 pb-12 pt-4 lg:px-8" id="contact">
        <div className="pricing-contact-card mx-auto flex max-w-6xl flex-col items-center justify-between gap-7 overflow-hidden rounded-[24px] border border-[#118778]/15 bg-white p-8 text-center shadow-[0_28px_80px_rgba(70,65,130,0.13)] sm:p-10 md:flex-row md:text-left">
          <div>
            <p className="pricing-eyebrow text-xs font-bold uppercase tracking-[0.14em] text-white/50">Ready to get started?</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl">Need help estimating your usage?</h2>
          </div>
          <Link className="inline-flex min-h-12 shrink-0 items-center rounded-lg bg-[#118778] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0e6f62]" href="/contact">CONTACT US <span className="ml-3">&rarr;</span></Link>
        </div>
      </section>
    </div>
  );
}
