"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { VoiceStackCalculator } from "@/components/pricing/VoiceStackCalculator";
import {
  estimatedModelCostPerMinute,
  formatEstimatedMinuteCost,
  modelPricingCategories,
  type ModelPriceCategory,
} from "@/config/modelPricing";

const MINUTE_RATE_MIN = 0.07;
const MINUTE_RATE_MAX = 0.12;

const proofPoints = [
  { value: "No plans", label: "One simple pricing model", accent: "#45ddce" },
  { value: "$0", label: "Monthly subscription", accent: "#67e8f9" },
  { value: "$0", label: "Setup fee", accent: "#a78bfa" },
  { value: "Per use", label: "Pay for actual usage", accent: "#f6c76e" },
] as const;

const steps = [
  {
    number: "01",
    title: "Add credits",
    body: "Top up your wallet with the amount you want to use. There is no monthly plan to purchase.",
    accent: "#45ddce",
  },
  {
    number: "02",
    title: "Make calls",
    body: "Build your voice agent and use it whenever you need it. Your balance is used only while the service is running.",
    accent: "#67e8f9",
  },
  {
    number: "03",
    title: "Pay for usage",
    body: "Each call is itemized so you can see the duration, services used, and final cost in your dashboard.",
    accent: "#a78bfa",
  },
] as const;

const costComponents = [
  { label: "Platform", value: "$0.025", note: "Orchestration, routing, and analytics", share: 36, color: "#45ddce" },
  { label: "Telephony", value: "$0.010", note: "Carrier cost; destination can affect the rate", share: 14, color: "#67e8f9" },
  { label: "Speech-to-text", value: "$0.006", note: "Live transcription during the call", share: 9, color: "#a7f3d0" },
  { label: "AI model", value: "$0.004", note: "Language model usage for the conversation", share: 6, color: "#c4b5fd" },
  { label: "Text-to-speech", value: "$0.025", note: "Natural voice generation", share: 35, color: "#39db8d" },
] as const;

const calculatorPresets = [
  { label: "Try it", calls: 100, minutes: 2 },
  { label: "Regular use", calls: 500, minutes: 3 },
  { label: "High use", calls: 2000, minutes: 4 },
] as const;

const faqs = [
  {
    question: "Do I need to choose a pricing plan?",
    answer:
      "No. There are no pricing tiers or monthly subscription plans. Add credits to your wallet and use the platform whenever you need it.",
  },
  {
    question: "How am I charged?",
    answer:
      "You are charged for actual usage. After each call, the cost is deducted from your wallet and shown as an itemized breakdown in your billing dashboard.",
  },
  {
    question: "Why can the per-minute cost change?",
    answer:
      "The exact cost depends on the carrier destination, call duration, speech provider, AI model, and voice selected. A typical connected minute is estimated at $0.07 to $0.12, but your dashboard shows the final cost for every call.",
  },
  {
    question: "Is there a monthly fee or minimum commitment?",
    answer:
      "No. There is no recurring subscription, setup fee, or minimum monthly spend. Your cost depends only on how much you use.",
  },
  {
    question: "How do wallet credits work?",
    answer:
      "Purchase credits whenever your balance is low. You can also enable auto-refill to keep calls running without manually topping up your wallet.",
  },
  {
    question: "Are telephony and AI provider costs included?",
    answer:
      "Yes. Your call breakdown combines platform, telephony, transcription, AI model, and voice-generation costs. Premium providers and international routes may cost more.",
  },
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
  const [activePricingCategory, setActivePricingCategory] = useState<ModelPriceCategory["id"]>("llm");

  const activeModelPricing =
    modelPricingCategories.find((category) => category.id === activePricingCategory) ?? modelPricingCategories[0];

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
    <div className="overflow-hidden bg-black text-white">
      <section className="relative border-b border-white/[0.07] bg-black px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:px-12 lg:pb-28">
        <div className="pointer-events-none absolute left-1/2 top-28 h-px w-[min(920px,82vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#45ddce]/35 to-transparent" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1180px] text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#67e8f9]/20 bg-gradient-to-r from-[#45ddce]/10 to-[#8b5cf6]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9ffaf1] shadow-[0_0_30px_rgba(69,221,206,0.08)]">
            <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_10px_#45ddce]" aria-hidden="true" />
            Simple pay-as-you-go pricing
          </span>
          <h1 className="mx-auto mt-7 max-w-5xl text-[clamp(2.8rem,7vw,5.7rem)] font-medium leading-[0.98] tracking-[-0.055em]">
            Power every conversation. <span className="bg-gradient-to-r from-[#75fff0] via-[#67e8f9] to-[#b9a5ff] bg-clip-text text-transparent">Pay as you go.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
            No plans, no subscription, and no monthly commitment. Add credits to your wallet and pay only for the actual usage of each call.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#45ddce] to-[#67e8f9] px-6 text-sm font-bold text-[#02110d] shadow-[0_14px_40px_rgba(69,221,206,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(69,221,206,0.25)]" href="/login">
              Get started <ArrowIcon />
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-bold text-white hover:border-white/25 hover:bg-white/[0.08]" href="#calculator">
              Estimate your cost <ArrowIcon />
            </Link>
          </div>
          <p className="mt-4 text-[11px] font-medium text-white/35">Prices are shown in USD unless a provider publishes its rate in INR. Taxes are excluded.</p>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-[#07110f]/75 text-left shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:grid-cols-4">
            {proofPoints.map((point) => (
              <div className="relative border-white/10 px-5 py-5 odd:border-r sm:border-r sm:last:border-r-0" style={{ backgroundImage: `linear-gradient(145deg, ${point.accent}12, transparent 55%)` }} key={point.label}>
                <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${point.accent}, transparent)` }} aria-hidden="true" />
                <strong className="block text-xl font-semibold tracking-[-0.025em] text-white">{point.value}</strong>
                <span className="mt-1 block text-xs" style={{ color: `${point.accent}aa` }}>{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#75fff0]">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">One account. One wallet. <span className="bg-gradient-to-r from-[#75fff0] to-[#b9a5ff] bg-clip-text text-transparent">No plans.</span></h2>
            <p className="mt-5 leading-7 text-white/55">Use the platform when you need it and stay in control of every dollar you spend.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article className="rounded-[22px] border p-6 shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-1 sm:p-7" style={{ borderColor: `${step.accent}40`, background: `radial-gradient(circle at 92% 0%, ${step.accent}28, transparent 45%), linear-gradient(145deg, ${step.accent}0d, #07110f 62%)` }} key={step.number}>
                <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: `${step.accent}16`, color: step.accent }}>{step.number}</span>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.025em]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{step.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-5 rounded-[24px] border border-[#67e8f9]/20 bg-[radial-gradient(circle_at_85%_10%,rgba(139,92,246,0.14),transparent_32%),linear-gradient(120deg,rgba(69,221,206,0.10),rgba(103,232,249,0.035))] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] md:grid-cols-[1fr_auto] md:items-center sm:p-8">
            <div>
              <p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-[#75fff0]">Typical connected-call cost</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em]">Approximately $0.07-$0.12 per minute.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">The final price depends on the carrier route, speech provider, AI model, and voice you use. Every call shows its exact cost after completion.</p>
            </div>
            <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f6c76e] to-[#ff9f7a] px-5 text-sm font-bold text-[#201304] shadow-[0_12px_32px_rgba(246,199,110,0.15)] transition hover:-translate-y-0.5" href="/login">Add credits and start<ArrowIcon /></Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#020504] px-5 py-20 sm:px-8 lg:px-12" id="model-pricing">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(520px,1.2fr)] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#75fff0]">Model provider costs</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Pricing for <span className="bg-gradient-to-r from-[#75fff0] via-[#67e8f9] to-[#b9a5ff] bg-clip-text text-transparent">every model.</span>
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-white/55">
                Compare the published usage rate for each model available in your agent stack. Your call log itemizes the exact model and usage after every conversation.
              </p>
            </div>

            <div className="overflow-x-auto pb-1" role="tablist" aria-label="Model pricing categories">
              <div className="grid min-w-[600px] grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-white/[0.035] p-1.5">
                {modelPricingCategories.map((category) => {
                  const active = activePricingCategory === category.id;
                  const modelCount = category.providers.reduce((total, provider) => total + provider.models.length, 0);

                  return (
                    <button
                      className={`rounded-xl px-3 py-3 text-left transition ${active ? "bg-white text-[#06110e] shadow-[0_10px_28px_rgba(0,0,0,0.26)]" : "text-white/45 hover:bg-white/[0.05] hover:text-white/75"}`}
                      id={`model-pricing-tab-${category.id}`}
                      key={category.id}
                      type="button"
                      role="tab"
                      aria-controls="model-pricing-panel"
                      aria-selected={active}
                      onClick={() => setActivePricingCategory(category.id)}
                    >
                      <span className="block text-xs font-bold">{category.label}</span>
                      <span className={`mt-1 block text-[10px] ${active ? "text-[#475569]" : "text-white/30"}`}>{modelCount} models</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <VoiceStackCalculator />

          <div
            className="mt-10"
            id="model-pricing-panel"
            role="tabpanel"
            aria-labelledby={`model-pricing-tab-${activeModelPricing.id}`}
          >
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b9a5ff]">{activeModelPricing.eyebrow}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.025em]">{activeModelPricing.label}</h3>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-white/45">{activeModelPricing.description}</p>
            </div>

            <div className="grid gap-4">
              {activeModelPricing.providers.map((provider, providerIndex) => (
                <details
                  className="group overflow-hidden rounded-[20px] border border-white/10 bg-[#07110f] shadow-[0_16px_50px_rgba(0,0,0,0.18)]"
                  key={provider.name}
                  open={providerIndex === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-white/[0.025] px-4 py-4 marker:content-none sm:px-5">
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-xl border text-[11px] font-black"
                        style={{ borderColor: `${provider.accent}45`, backgroundColor: `${provider.accent}12`, color: provider.accent }}
                        aria-hidden="true"
                      >
                        {provider.shortName}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{provider.name}</span>
                        <span className="mt-0.5 block text-[11px] text-white/35">Click to view {provider.models.length} {provider.models.length === 1 ? "model" : "models"}</span>
                      </span>
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 text-white/40 transition group-open:rotate-180 group-open:border-[#45ddce]/25 group-open:text-[#75fff0]" aria-hidden="true">
                      <svg className="size-4" fill="none" viewBox="0 0 16 16">
                        <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </svg>
                    </span>
                  </summary>

                  <div className="border-t border-white/10">
                    <div className="flex justify-end border-b border-white/[0.07] px-4 py-2.5 sm:px-5">
                      <a
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/40 transition hover:text-[#75fff0]"
                        href={provider.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View published provider pricing
                        <svg className="size-3.5" fill="none" viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M6 3h7v7M13 3 5.5 10.5M11 9.5V13H3V5h3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                        </svg>
                      </a>
                    </div>
                    <div className="hidden grid-cols-[minmax(0,1.05fr)_minmax(200px,0.85fr)_minmax(150px,0.62fr)_minmax(105px,0.35fr)] gap-4 border-b border-white/[0.07] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-white/30 md:grid">
                      <span>Model</span>
                      <span>Provider rate</span>
                      <span>Billing unit</span>
                      <span>Est. / min</span>
                    </div>
                    <div className="divide-y divide-white/[0.07]">
                      {provider.models.map((model) => {
                        const minuteEstimate = estimatedModelCostPerMinute(activeModelPricing.id, model);
                        return (
                          <div className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1.05fr)_minmax(200px,0.85fr)_minmax(150px,0.62fr)_minmax(105px,0.35fr)] md:items-center md:gap-4 md:px-5" key={model.name}>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <code className="break-all font-sans text-[13px] font-semibold text-white/85">{model.name}</code>
                                {model.badge ? (
                                  <span
                                    className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${
                                      model.badge === "Recommended"
                                        ? "border-[#45ddce]/20 bg-[#45ddce]/10 text-[#75fff0]"
                                        : model.badge === "Preview"
                                          ? "border-[#a78bfa]/20 bg-[#a78bfa]/10 text-[#c4b5fd]"
                                          : "border-white/10 bg-white/[0.04] text-white/35"
                                    }`}
                                  >
                                    {model.badge}
                                  </span>
                                ) : null}
                              </div>
                              {model.detail ? <p className="mt-1.5 text-[11px] leading-4 text-white/30">{model.detail}</p> : null}
                            </div>
                            <strong className="text-sm font-semibold text-[#9ffaf1]">{model.rate}</strong>
                            <span className="text-xs leading-5 text-white/40">{model.unit}</span>
                            <span className="w-fit rounded-full border border-[#45ddce]/15 bg-[#45ddce]/[0.06] px-2.5 py-1 text-xs font-bold text-[#75fff0]">
                              {formatEstimatedMinuteCost(minuteEstimate)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-5 grid gap-3 rounded-xl border border-[#f6c76e]/15 bg-[#f6c76e]/[0.045] px-4 py-4 text-xs leading-5 text-white/45 sm:grid-cols-[auto_1fr] sm:items-start sm:px-5">
              <span className="inline-flex w-fit rounded-full bg-[#f6c76e]/10 px-2.5 py-1 font-bold uppercase tracking-[0.1em] text-[#f6c76e]">Good to know</span>
              <p>
                These are indicative provider list rates, excluding Vozon platform and telephony usage. Cached tokens, long contexts, regional processing, multilingual audio, add-ons, and currency conversion can change the final amount. The itemized call record is the source of truth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-black px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#b9a5ff]">Transparent usage costs</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">See where <span className="bg-gradient-to-r from-[#b9a5ff] to-[#67e8f9] bg-clip-text text-transparent">every cent</span> goes.</h2>
            <p className="mt-5 leading-7 text-white/55">This sample shows how a $0.070 connected minute may be calculated. Your actual usage is itemized per call and can vary by provider, model, voice, and carrier route.</p>
          </div>
          <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-5 text-xs">
              <span className="font-semibold uppercase tracking-[0.13em] text-white/40">Example: $0.070 per minute</span>
              <span className="text-white/35">100% itemized</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full bg-white/5" aria-label="Example cost composition">
              {costComponents.map((component) => (
                <span
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  key={component.label}
                  style={{ backgroundColor: component.color, width: `${component.share}%` }}
                  title={`${component.label}: ${component.value} per minute`}
                />
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {costComponents.map((component) => (
                <span className="inline-flex items-center gap-2 text-[11px] text-white/45" key={component.label}>
                  <span className="size-2 rounded-full" style={{ backgroundColor: component.color }} aria-hidden="true" />
                  {component.label}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-10 grid overflow-hidden rounded-[22px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {costComponents.map((component, index) => (
              <article className="relative bg-[#07110f] p-6 lg:min-h-52" style={{ backgroundImage: `linear-gradient(160deg, ${component.color}1a, transparent 48%)` }} key={component.label}>
                <span className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: component.color }} aria-hidden="true" />
                <span className="text-xs font-semibold" style={{ color: `${component.color}aa` }}>0{index + 1}</span>
                <h3 className="mt-8 text-sm font-semibold text-white/65">{component.label}</h3>
                <strong className="mt-2 block text-2xl font-semibold text-[#75fff0]">{component.value}<span className="text-xs font-medium text-white/35">/min</span></strong>
                <p className="mt-3 text-xs leading-5 text-white/40">{component.note}</p>
              </article>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-sm">
            <span className="text-white/50">Example blended total</span>
            <strong className="text-lg text-white">$0.070/min</strong>
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 sm:px-8 lg:px-12" id="calculator">
        <div className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[28px] border border-[#67e8f9]/15 bg-[#07110f] shadow-[0_32px_90px_rgba(0,0,0,0.28)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[radial-gradient(circle_at_0%_0%,rgba(69,221,206,0.08),transparent_34%)] p-6 sm:p-9 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#f6c76e]">Usage calculator</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Estimate <span className="bg-gradient-to-r from-[#f6c76e] to-[#ff9f7a] bg-clip-text text-transparent">what you may spend.</span></h2>
            <p className="mt-4 text-sm leading-6 text-white/50">Enter your expected usage to see an estimated monthly range. This is not a plan or a recurring charge.</p>

            <div className="mt-8 grid gap-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">Quick examples</span>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {calculatorPresets.map((preset) => {
                    const isActive = calls === preset.calls && minutes === preset.minutes;
                    return (
                      <button
                        className={`min-h-10 rounded-lg border px-3 text-xs font-semibold transition ${isActive ? "border-[#45ddce]/45 bg-[#45ddce]/10 text-[#75fff0]" : "border-white/10 bg-white/[0.025] text-white/45 hover:border-white/20 hover:text-white/75"}`}
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
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-white/70">
                  Calls
                  <input className="h-12 rounded-xl border border-white/10 bg-[#020b09] px-4 text-white outline-none" min="0" max="1000000" inputMode="numeric" type="number" value={calls} onChange={(event) => setCalls(event.target.valueAsNumber || 0)} />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-white/70">
                  Average call length (minutes)
                  <input className="h-12 rounded-xl border border-white/10 bg-[#020b09] px-4 text-white outline-none" min="0" max="240" step="0.5" inputMode="decimal" type="number" value={minutes} onChange={(event) => setMinutes(event.target.valueAsNumber || 0)} />
                </label>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col justify-between bg-[radial-gradient(circle_at_85%_8%,rgba(139,92,246,0.26),transparent_35%),radial-gradient(circle_at_8%_90%,rgba(69,221,206,0.18),transparent_35%),linear-gradient(145deg,#0b211a,#09101b)] p-6 sm:p-9 lg:p-12">
            <span className="absolute right-7 top-7 rounded-full border border-[#75fff0]/20 bg-[#75fff0]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#75fff0]">Usage estimate</span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/45">Estimated cost range</span>
              <strong className="mt-4 block text-[clamp(2.6rem,6vw,5rem)] font-medium leading-none tracking-[-0.06em]">{formatUsd(estimate.minimum)} - {formatUsd(estimate.maximum)}</strong>
              <span className="mt-3 block text-sm text-white/45">for the usage entered, before taxes</span>
            </div>
            <div className="mt-12 grid gap-3 border-t border-white/10 pt-6 text-sm">
              <div className="flex justify-between gap-5"><span className="text-white/45">Total connected minutes</span><strong>{estimate.totalMinutes.toLocaleString("en-US", { maximumFractionDigits: 1 })}</strong></div>
              <div className="flex justify-between gap-5"><span className="text-white/45">Estimated rate</span><strong>$0.07-$0.12/min</strong></div>
              <p className="mt-2 text-xs leading-5 text-[#75fff0]">You are not charged this estimate upfront. Your wallet is charged only for actual usage.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 sm:px-8 lg:px-12" id="faq">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#f58bc1]">FAQ</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">Straightforward <span className="bg-gradient-to-r from-[#f58bc1] to-[#b9a5ff] bg-clip-text text-transparent">answers.</span></h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/50">Everything you need to know about paying only for the voice services you use.</p>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map((faq) => (
              <details className="group rounded-xl px-3 py-2 transition open:bg-white/[0.025]" key={faq.question}>
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-3 text-base font-semibold marker:content-none">
                  {faq.question}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 text-[#75fff0] transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-3xl pb-6 pr-12 text-sm leading-7 text-white/50">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.07] bg-black px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center rounded-[28px] border border-[#67e8f9]/15 bg-[radial-gradient(circle_at_18%_110%,rgba(69,221,206,0.26),transparent_40%),radial-gradient(circle_at_86%_-10%,rgba(139,92,246,0.22),transparent_38%),#07110f] px-6 py-16 text-center shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#f6c76e]">Start whenever you are ready</p>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Add credits. Make calls. <span className="bg-gradient-to-r from-[#75fff0] via-[#67e8f9] to-[#b9a5ff] bg-clip-text text-transparent">Pay only for your usage.</span></h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/50">Create your voice agent with no subscription and no monthly commitment.</p>
          <Link className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#45ddce] to-[#67e8f9] px-6 text-sm font-bold text-[#02110d] shadow-[0_14px_40px_rgba(69,221,206,0.18)] transition hover:-translate-y-0.5" href="/login">Get started<ArrowIcon /></Link>
        </div>
      </section>
    </div>
  );
}
