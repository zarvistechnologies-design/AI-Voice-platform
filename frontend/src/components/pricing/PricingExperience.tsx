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
  },
  {
    question: "How am I charged?",
    answer: "You are charged for actual usage. After each call, the cost is deducted from your wallet and shown as an itemized breakdown in your billing dashboard.",
  },
  {
    question: "Why can the per-minute cost change?",
    answer: "The final cost depends on the carrier destination, call duration, speech provider, AI model, and voice selected. Your dashboard shows the exact cost of every completed call.",
  },
  {
    question: "Is there a monthly fee or minimum commitment?",
    answer: "No. There is no recurring subscription, setup fee, or minimum monthly spend. You pay only for what you use.",
  },
  {
    question: "How do wallet credits work?",
    answer: "Purchase credits whenever your balance is low. You can also enable auto-refill to keep calls running without manually topping up your wallet.",
  },
  {
    question: "Are telephony and AI provider costs included?",
    answer: "Yes. The call breakdown combines platform, telephony, transcription, AI model, and voice-generation costs. Premium providers and international routes may cost more.",
  },
] as const;

const includedServices = [
  "Voice agent orchestration and routing",
  "Telephony and carrier usage",
  "Live speech-to-text transcription",
  "AI model usage",
  "Text-to-speech voice generation",
  "Call logs and itemized usage details",
] as const;

function ArrowIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 100 ? 2 : 0,
  }).format(value);
}

export function PricingExperience() {
  const [calls, setCalls] = useState(500);
  const [minutes, setMinutes] = useState(3);

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
    <div className="bg-black text-white">
      <section className="relative overflow-hidden bg-black px-4 pb-12 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center text-center">
          <p className="inline-flex rounded-full border border-[#45ddce]/20 bg-[#45ddce]/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9ffaf1]">Pricing</p>
          <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4vw,3.35rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-white">
            Pay only for the voice AI you use.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            No subscription, setup fee, or monthly commitment. Add wallet credits and pay only for the services used during each call.
          </p>
          <nav className="mt-7 flex flex-wrap justify-center gap-2" aria-label="Pricing page sections">
            {[
              ["Pricing plan", "#pricing-plan"],
              ["Voice stack", "#voice-stack"],
              ["Calculator", "#calculator"],
              ["FAQ", "#faq"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-semibold text-white/60 transition hover:border-[#45ddce]/30 hover:text-white" href={href} key={href}>{label}</a>
            ))}
          </nav>
        </div>
      </section>

      <section className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8" id="pricing-plan">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Pricing plan</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">One plan for every account</h2>
          </div>

          <article className="relative grid overflow-hidden rounded-3xl border border-[#45ddce]/15 bg-[#07100e] shadow-[0_28px_80px_rgba(0,0,0,0.3)] lg:grid-cols-[0.85fr_1.15fr]">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#45ddce]/80 to-transparent" aria-hidden="true" />
            <div className="border-b border-white/10 bg-[linear-gradient(145deg,rgba(69,221,206,0.07),transparent_52%)] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-9">
              <span className="inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-semibold text-white/65">Pay as you go</span>
              <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-2">
                <strong className="text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-none tracking-[-0.05em] text-white">$0.07–$0.12</strong>
                <span className="pb-2 text-sm text-white/50">per connected minute</span>
              </div>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/55">
                This is the typical estimated range. The exact rate depends on your carrier route, AI model, transcription provider, and voice.
              </p>

              <dl className="mt-8 divide-y divide-white/[0.08] rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm">
                <div className="flex items-center justify-between gap-4 py-4"><dt className="text-white/55">Monthly subscription</dt><dd className="font-semibold text-white">$0</dd></div>
                <div className="flex items-center justify-between gap-4 py-4"><dt className="text-white/55">Setup fee</dt><dd className="font-semibold text-white">$0</dd></div>
                <div className="flex items-center justify-between gap-4 py-4"><dt className="text-white/55">Minimum commitment</dt><dd className="font-semibold text-white">None</dd></div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#45ddce] px-5 text-sm font-bold text-[#02110d] transition hover:bg-[#75fff0]" href="/login">Get started <ArrowIcon /></Link>
                <Link className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.025] px-5 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/[0.06]" href="/contact">Contact sales</Link>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-9">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#75fff0]">Included with usage</p>
              <h3 className="mt-2 text-lg font-semibold text-white">Everything required to run your calls</h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {includedServices.map((service) => (
                  <li className="flex min-h-12 items-center gap-3 rounded-xl border border-white/[0.07] bg-black/15 px-4 py-3 text-sm leading-5 text-white/65" key={service}>
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#45ddce]/10 text-[10px] font-black text-[#75fff0]" aria-hidden="true">✓</span>
                    {service}
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="text-[13px] font-semibold text-white">Transparent billing</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                  Every completed call includes its duration, services used, and final cost in your dashboard. Prices are shown in USD unless a provider publishes its rate in INR. Taxes are excluded.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="scroll-mt-20 bg-black px-4 py-14 sm:px-6 sm:py-16 lg:px-8" id="voice-stack">
        <div className="mx-auto max-w-[1320px]">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Model pricing</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">Build and price your voice stack</h2>
            <p className="mt-4 text-sm leading-6 text-white/50">
              Select your language model, speech-to-text provider, and text-to-speech voice to estimate the combined provider cost per connected minute.
            </p>
          </div>
          <VoiceStackCalculator />
        </div>
      </section>

      <section className="scroll-mt-20 bg-black px-4 py-14 sm:px-6 sm:py-16 lg:px-8" id="calculator">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Usage calculator</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">Estimate your monthly cost</h2>
            <p className="mt-4 text-sm leading-6 text-white/50">Enter your expected call usage to calculate an estimated range. This is not a subscription or recurring charge.</p>
          </div>

          <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#07100e] shadow-[0_28px_80px_rgba(0,0,0,0.28)] lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-9">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Quick examples</span>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {calculatorPresets.map((preset) => {
                  const isActive = calls === preset.calls && minutes === preset.minutes;
                  return (
                    <button
                      className={`min-h-10 rounded-xl border px-3 text-xs font-semibold transition ${isActive ? "border-[#45ddce]/60 bg-[#45ddce]/10 text-white" : "border-white/10 bg-black/20 text-white/55 hover:border-white/25 hover:text-white"}`}
                      key={preset.label}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        setCalls(preset.calls);
                        setMinutes(preset.minutes);
                      }}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-white/70">
                  Number of calls
                  <input className="h-12 rounded-xl border border-white/10 bg-black/50 px-4 text-white outline-none transition focus:border-[#45ddce]/60 focus:ring-2 focus:ring-[#45ddce]/10" min="0" max="1000000" inputMode="numeric" type="number" value={calls} onChange={(event) => setCalls(event.target.valueAsNumber || 0)} />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-white/70">
                  Average minutes per call
                  <input className="h-12 rounded-xl border border-white/10 bg-black/50 px-4 text-white outline-none transition focus:border-[#45ddce]/60 focus:ring-2 focus:ring-[#45ddce]/10" min="0" max="240" step="0.5" inputMode="decimal" type="number" value={minutes} onChange={(event) => setMinutes(event.target.valueAsNumber || 0)} />
                </label>
              </div>
            </div>

            <div className="flex flex-col justify-between bg-[linear-gradient(145deg,rgba(69,221,206,0.08),rgba(9,21,18,1)_55%)] p-6 sm:p-8 lg:p-9">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Estimated cost range</span>
                <strong className="mt-4 block text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-none tracking-[-0.045em] text-white">
                  {formatUsd(estimate.minimum)}–{formatUsd(estimate.maximum)}
                </strong>
                <span className="mt-3 block text-sm text-white/45">for the usage entered, before taxes</span>
              </div>
              <dl className="mt-10 divide-y divide-white/10 border-y border-white/10 text-sm">
                <div className="flex justify-between gap-5 py-4"><dt className="text-white/50">Connected minutes</dt><dd className="font-semibold text-white">{estimate.totalMinutes.toLocaleString("en-US", { maximumFractionDigits: 1 })}</dd></div>
                <div className="flex justify-between gap-5 py-4"><dt className="text-white/50">Estimated rate</dt><dd className="font-semibold text-white">$0.07–$0.12/min</dd></div>
              </dl>
              <p className="mt-4 text-xs leading-5 text-white/45">Your wallet is charged only for actual usage, not this estimate.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 bg-black px-4 py-14 sm:px-6 sm:py-16 lg:px-8" id="faq">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.55fr_1.45fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">FAQ</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">Pricing questions</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/50">Clear answers about billing, wallet credits, and usage costs.</p>
          </div>

          <div className="grid gap-3">
            {faqs.map((faq) => (
              <details className="group rounded-2xl border border-white/[0.08] bg-[#07100e] px-5 transition open:border-[#45ddce]/20 open:bg-[#091512]" key={faq.question}>
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-3 text-[15px] font-semibold text-white marker:content-none">
                  {faq.question}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-black/20 text-lg font-normal text-[#75fff0] group-open:hidden" aria-hidden="true">+</span>
                  <span className="hidden size-8 shrink-0 place-items-center rounded-full border border-[#45ddce]/20 bg-[#45ddce]/10 text-lg font-normal text-[#75fff0] group-open:grid" aria-hidden="true">−</span>
                </summary>
                <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-white/55">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 bg-black px-4 py-14 sm:px-6 sm:py-16 lg:px-8" id="contact">
        <div className="relative mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-7 overflow-hidden rounded-3xl border border-[#45ddce]/15 bg-[linear-gradient(120deg,rgba(69,221,206,0.09),rgba(7,16,14,1)_45%)] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-8 lg:flex-row lg:items-center lg:p-9">
          <span className="absolute inset-y-6 left-0 w-px bg-gradient-to-b from-transparent via-[#45ddce] to-transparent" aria-hidden="true" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Contact</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">Need help estimating your usage?</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">Tell us about your call volume and requirements. Our team will help you understand the expected cost.</p>
          </div>
          <Link className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#45ddce] px-5 text-sm font-bold text-[#02110d] transition hover:bg-[#75fff0]" href="/contact">Contact us <ArrowIcon /></Link>
        </div>
      </section>
    </div>
  );
}
