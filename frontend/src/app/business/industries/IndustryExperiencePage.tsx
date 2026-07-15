/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

type Industry = {
  title: string;
  summary: string;
  highlights: readonly string[];
  sections: ReadonlyArray<{ readonly title: string; readonly body: string }>;
};

export type IndustryExperiencePreset = {
  accent: string;
  accentSoft: string;
  logos: string[];
  photoCards: Array<{ title: string; image: string }>;
  workflows: Array<{
    eyebrow: string;
    title: string;
    button: string;
    visual: "routing" | "ivr" | "calendar";
    image?: string;
    reverse?: boolean;
    points: Array<{ title: string; body: string }>;
  }>;
  integrations: string[];
  faqs: string[];
  reviewBenefits: Array<{ title: string; body: string }>;
  quote: {
    primary: string;
    primaryName: string;
    primaryRole: string;
    secondary: string;
    secondaryName: string;
    secondaryRole: string;
  };
};

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[var(--industry-accent)]/25 bg-[var(--industry-accent)]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--industry-accent-soft)]">
      {children}
    </span>
  );
}

function CheckIcon({ tone = "accent" }: { tone?: "accent" | "purple" | "orange" }) {
  const color =
    tone === "purple"
      ? "border-[#8f83e8]/25 bg-[#8f83e8]/10 text-[#c5bdff]"
      : tone === "orange"
        ? "border-[#ff9655]/25 bg-[#ff9655]/10 text-[#ffb17e]"
        : "border-[var(--industry-accent)]/25 bg-[var(--industry-accent)]/10 text-[var(--industry-accent-soft)]";

  return (
    <span className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold ${color}`}>
      &#10003;
    </span>
  );
}

function faqAnswer(question: string, industry: Industry) {
  const sector = industry.title.toLowerCase();
  const normalized = question.toLowerCase();

  if (normalized.includes("integrat") || normalized.includes("crm") || normalized.includes("support tools")) {
    return `Yes. Supported integrations, APIs, and webhooks can send call summaries, outcomes, and follow-up tasks into the systems your ${sector} team already uses.`;
  }

  if (normalized.includes("route") || normalized.includes("department") || normalized.includes("advisor")) {
    return "Routing rules can use the caller's request, availability, location, or account context to reach the right person. Human handoffs can include a concise conversation summary.";
  }

  if (normalized.includes("sensitive") || normalized.includes("compliance") || normalized.includes("approved")) {
    return `You control the approved scripts, data collected, escalation rules, and review workflow. Your team should validate the final setup against the privacy and compliance requirements that apply to its ${sector} operations.`;
  }

  if (normalized.includes("language") || normalized.includes("multilingual")) {
    return "Agents can be configured for multilingual conversations with consistent prompts, routing, and summaries, helping teams serve callers across regions and time zones.";
  }

  if (normalized.includes("schedule") || normalized.includes("book")) {
    return "The agent can check connected availability, collect the details needed for the request, confirm the next step during the call, and write the result back to the appropriate workflow.";
  }

  if (normalized.includes("outbound") || normalized.includes("reminder")) {
    return "Outbound workflows can follow approved timing, scripts, retry rules, and opt-out handling while recording each disposition for staff review and follow-up.";
  }

  if (normalized.includes("urgent") || normalized.includes("emergency") || normalized.includes("exception")) {
    return "You can define priority signals and escalation paths so urgent or complex calls reach an available teammate with the relevant details already captured.";
  }

  return `AI voice agents can handle repeatable ${sector} calls, collect structured context, answer approved questions, and transfer conversations that need human judgment.`;
}

export function IndustryExperiencePage({
  industry,
  preset,
}: {
  industry: Industry;
  preset: IndustryExperiencePreset;
}) {
  const heroCard = preset.photoCards[0];
  const companyColors = [
    "var(--industry-accent-soft)",
    "#c5bdff",
    "#ffb17e",
    "#8dd7ff",
    "#b8f65b",
    "#ff8fb1",
  ];
  const reviews = [
    {
      metric: preset.reviewBenefits[0]?.title ?? "Faster calls",
      quote: preset.quote.primary,
      name: preset.quote.primaryName,
      role: preset.quote.primaryRole,
      tone: "accent" as const,
    },
    {
      metric: preset.reviewBenefits[1]?.title ?? "Clear handoffs",
      quote: preset.quote.secondary,
      name: preset.quote.secondaryName,
      role: preset.quote.secondaryRole,
      tone: "purple" as const,
    },
  ];
  const style = {
    "--industry-accent": preset.accent,
    "--industry-accent-soft": preset.accentSoft,
  } as CSSProperties;

  return (
    <SiteLayout>
      <div className="industry-experience min-h-screen bg-black text-slate-50" style={style}>
        <section className="industry-hero-grid relative mx-auto min-h-[82vh] max-w-7xl items-center gap-12 px-6 pb-14 pt-32 lg:px-8">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              <span className="size-2 rounded-full bg-[var(--industry-accent)] shadow-[0_0_12px_var(--industry-accent)]" />
              Built for modern {industry.title.toLowerCase()} teams
            </div>
            <h1 className="industry-hero-heading max-w-3xl font-semibold text-white">
              AI Voice Agents for{" "}
              <span className="block text-[var(--industry-accent)]">{industry.title}</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 md:text-lg md:leading-8">
              {industry.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {industry.highlights.map((highlight) => (
                <span
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300"
                  key={highlight}
                >
                  {highlight}
                </span>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-12 items-center rounded-lg border border-[var(--industry-accent)]/50 bg-[var(--industry-accent)] px-7 text-sm font-black text-[#031310] shadow-[0_14px_35px_color-mix(in_srgb,var(--industry-accent)_20%,transparent)] transition hover:-translate-y-0.5 hover:brightness-110"
                href="/#demo"
              >
                BOOK A FREE DEMO
              </Link>
              <Link
                className="inline-flex min-h-12 items-center rounded-lg border border-white/15 bg-white/[0.05] px-6 text-sm font-bold text-slate-50 transition hover:-translate-y-0.5 hover:bg-white/10"
                href="/#contact"
              >
                CONTACT SALES
              </Link>
            </div>
          </div>

          <div className="industry-hero-card relative overflow-hidden rounded-2xl border border-white/10 bg-[#07100d] shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
            <img
              alt={`${industry.title} voice agent workflow`}
              className="industry-hero-image block w-full object-cover object-center"
              decoding="sync"
              loading="eager"
              src={heroCard.image}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(0,0,0,0.92)_100%)]" />
            <div className="absolute left-5 top-5 flex items-center gap-3 rounded-full border border-white/20 bg-black/80 px-4 py-2.5 backdrop-blur-md">
              <span className="size-2.5 rounded-full bg-[var(--industry-accent)] shadow-[0_0_12px_var(--industry-accent)]" />
              <span className="text-xs font-bold uppercase tracking-[0.12em]">Voice agent active</span>
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-black py-8" aria-label={`${industry.title} platforms`}>
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 lg:px-8">
            <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              Connect with the tools powering leading {industry.title.toLowerCase()} teams
            </p>
            <div className="industry-marquee-fade w-full overflow-hidden">
              <div className="industry-company-marquee flex w-max items-center gap-14 py-1">
                {[...preset.logos, ...preset.logos].map((logo, index) => (
                  <span
                    aria-hidden={index >= preset.logos.length}
                    className="shrink-0 text-xl font-bold tracking-[-0.02em] md:text-2xl"
                    key={`${logo}-${index}`}
                    style={{ color: companyColors[(index % preset.logos.length) % companyColors.length] }}
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-black py-14" aria-label={`${industry.title} use cases`}>
          <div className="industry-photo-marquee flex w-max gap-5">
            {[...preset.photoCards, ...preset.photoCards].map((card, index) => (
              <article
                aria-hidden={index >= preset.photoCards.length}
                className="relative h-52 w-[380px] overflow-hidden rounded-xl border border-white/10 bg-slate-900 sm:h-56 sm:w-[430px]"
                key={`${card.title}-${index}`}
              >
                <img alt={card.title} className="absolute inset-0 size-full object-cover" loading="lazy" src={card.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <h2 className="absolute bottom-5 left-5 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                  {card.title}
                </h2>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-black">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <Pill>Reviews</Pill>
            <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">
                Better conversations for customers and teams
              </h2>
              <p className="max-w-lg text-base leading-7 text-slate-300">
                Built to move routine calls forward while keeping your people in control of nuanced conversations.
              </p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {reviews.map((review) => (
                <article
                  className={`flex min-h-[275px] flex-col justify-between rounded-xl border p-6 transition duration-300 hover:-translate-y-1 ${
                    review.tone === "accent"
                      ? "border-[var(--industry-accent)]/25 bg-[var(--industry-accent)]/[0.045]"
                      : "border-[#8f83e8]/25 bg-[#8f83e8]/[0.045]"
                  }`}
                  key={review.name}
                >
                  <div>
                    <span className="inline-flex rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-bold text-white/75">
                      {review.metric}
                    </span>
                    <p className="mt-6 text-base font-medium leading-7 text-slate-100">&quot;{review.quote}&quot;</p>
                  </div>
                  <div className="mt-7 border-t border-white/10 pt-4">
                    <h3 className="font-bold text-white">{review.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{review.role}</p>
                  </div>
                </article>
              ))}
              <article className="flex min-h-[275px] flex-col justify-between rounded-xl border border-[#ff9655]/25 bg-[#ff9655]/[0.045] p-6 transition duration-300 hover:-translate-y-1">
                <div>
                  <span className="inline-flex rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-bold text-white/75">
                    Operational impact
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {preset.reviewBenefits[2]?.title ?? "A clear next step from every call"}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-300">
                    {preset.reviewBenefits[2]?.body ?? industry.sections[1]?.body}
                  </p>
                </div>
                <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-4 text-sm font-semibold text-[#ffb17e]">
                  <CheckIcon tone="orange" /> Designed for daily operations
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="relative border-t border-white/[0.06] bg-black">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <Pill>{industry.title} features</Pill>
            <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">
              Support every {industry.title.toLowerCase()} call with a clear next step
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              {industry.sections[0]?.body}
            </p>
            <div className="mt-12 grid gap-12">
              {preset.workflows.map((workflow, index) => {
                const photoCard = preset.photoCards[(index + 1) % preset.photoCards.length];
                const image = {
                  title: photoCard.title,
                  image: workflow.image ?? photoCard.image,
                };
                const tone = workflow.visual === "routing" ? "accent" : workflow.visual === "ivr" ? "orange" : "purple";
                const toneClasses =
                  tone === "accent"
                    ? "text-[var(--industry-accent-soft)]"
                    : tone === "orange"
                      ? "text-[#ffb17e]"
                      : "text-[#c5bdff]";
                const buttonClasses =
                  tone === "accent"
                    ? "border-[var(--industry-accent)]/25 bg-[var(--industry-accent)]/[0.06] text-[var(--industry-accent-soft)] hover:bg-[var(--industry-accent)]/10"
                    : tone === "orange"
                      ? "border-[#ff9655]/25 bg-[#ff9655]/[0.06] text-[#ffb17e] hover:bg-[#ff9655]/10"
                      : "border-[#8f83e8]/25 bg-[#8f83e8]/[0.06] text-[#c5bdff] hover:bg-[#8f83e8]/10";

                return (
                  <div
                    className={`industry-feature-row items-center gap-10 lg:gap-14 ${index % 2 === 0 ? "feature-content-left" : "feature-image-left"}`}
                    key={workflow.title}
                  >
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#07100d]">
                      <img
                        alt={`${workflow.title} workflow`}
                        className="block h-[390px] w-full object-cover transition duration-700 group-hover:scale-[1.025] sm:h-[410px]"
                        loading="lazy"
                        src={image.image}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.82)_100%)]" />
                      <div className="absolute inset-x-5 bottom-5 rounded-xl border border-white/10 bg-black/85 p-4 backdrop-blur-md">
                        <div className="flex items-center justify-between gap-5">
                          <div>
                            <p className={`text-xs font-bold uppercase tracking-[0.14em] ${toneClasses}`}>{workflow.eyebrow}</p>
                            <p className="mt-2 text-base font-semibold text-white sm:text-lg">{image.title}</p>
                          </div>
                          <CheckIcon tone={tone} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-[0.14em] ${toneClasses}`}>{workflow.eyebrow}</p>
                      <h3 className="mt-4 max-w-xl text-2xl font-semibold leading-snug md:text-3xl">{workflow.title}</h3>
                      <div className="mt-7 border-t border-white/10 pt-7">
                        <div className="grid gap-6">
                          {workflow.points.map((point) => (
                            <div className="flex gap-4" key={point.title}>
                              <CheckIcon tone={tone} />
                              <div>
                                <h4 className="text-base font-bold leading-snug">{point.title}</h4>
                                <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-300">{point.body}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Link
                        className={`mt-8 inline-flex min-h-11 items-center justify-center rounded-lg border px-6 text-sm font-bold transition ${buttonClasses}`}
                        href="/#demo"
                      >
                        {workflow.button}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="overflow-hidden border-t border-white/[0.06] bg-black">
          <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-20 lg:px-8">
            <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)] md:items-end">
              <div>
                <Pill>Integrations</Pill>
                <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">
                  Your {industry.title.toLowerCase()} stack, connected
                </h2>
              </div>
              <p className="text-base leading-7 text-slate-300 md:pb-1">{industry.sections[1]?.body}</p>
            </div>

            <div className="mt-9 grid gap-3 md:grid-cols-3">
              {industry.highlights.map((highlight, index) => (
                <article className="rounded-xl border border-white/10 bg-white/[0.025] p-5" key={highlight}>
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid size-9 place-items-center rounded-lg border text-[11px] font-extrabold ${
                        index === 0
                          ? "border-[var(--industry-accent)]/20 bg-[var(--industry-accent)]/10 text-[var(--industry-accent-soft)]"
                          : index === 1
                            ? "border-[#8f83e8]/20 bg-[#8f83e8]/10 text-[#c5bdff]"
                            : "border-[#ff9655]/20 bg-[#ff9655]/10 text-[#ffb17e]"
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Workflow</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">{highlight}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Connect call context, outcomes, and next steps to the tools your team already checks.
                  </p>
                </article>
              ))}
            </div>

            <div className="industry-marquee-fade mt-9 overflow-hidden py-1">
              <div className="industry-integration-marquee flex w-max gap-4">
                {[...preset.integrations, ...preset.integrations].map((integration, index) => (
                  <div
                    aria-hidden={index >= preset.integrations.length}
                    className="industry-integration-card flex h-20 w-60 shrink-0 items-center gap-3 rounded-xl border border-[var(--industry-accent)]/20 bg-black/80 px-4"
                    key={`${integration}-${index}`}
                  >
                    <span className="industry-integration-icon grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--industry-accent)]/10 text-xs font-extrabold uppercase text-[var(--industry-accent-soft)]">
                      {integration.slice(0, 2)}
                    </span>
                    <strong className="text-base leading-tight text-slate-100">{integration}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-11 grid items-center gap-6 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(115deg,rgba(53,251,224,0.12),rgba(143,131,232,0.08)_55%,rgba(255,150,85,0.09))] p-6 sm:p-8 md:grid-cols-[auto_1fr_auto]">
              <span className="grid size-12 place-items-center rounded-xl border border-[var(--industry-accent)]/25 bg-black text-xl text-[var(--industry-accent-soft)]">
                &#8644;
              </span>
              <div>
                <h3 className="text-xl font-semibold leading-tight text-white">Need help connecting your systems?</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">Work with a certified partner for setup, migration, and workflow design.</p>
              </div>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--industry-accent)] px-6 text-sm font-extrabold text-[#031310] transition hover:-translate-y-0.5 hover:brightness-110"
                href="/#contact"
              >
                Find a partner <span className="ml-2">&#8594;</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-black">
          <div className="mx-auto max-w-6xl px-6 pt-16 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Pill>Pricing</Pill>
              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">Simple plans that scale with your calls</h2>
              <p className="mt-4 text-base leading-7 text-slate-300">Start with usage-based pricing, then move to a tailored plan as your call volume and deployment needs grow.</p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              <article className="relative overflow-hidden rounded-2xl border border-[var(--industry-accent)]/25 bg-[#07100d] p-6 sm:p-7">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--industry-accent)] to-transparent" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--industry-accent-soft)]">Start small</span>
                    <h3 className="mt-2 text-xl font-bold">Pay as you go</h3>
                  </div>
                  <span className="rounded-full border border-[var(--industry-accent)]/20 bg-[var(--industry-accent)]/10 px-3 py-1.5 text-xs font-bold text-[var(--industry-accent-soft)]">No setup fee</span>
                </div>
                <div className="mt-5 flex items-end gap-2 border-b border-white/10 pb-5">
                  <strong className="text-3xl font-semibold tracking-[-0.04em] text-white">$0.07–$0.12</strong>
                  <span className="pb-1 text-sm text-slate-400">per minute</span>
                </div>
                <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-200">
                  {["$0 to start and pay only for usage.", "60 minutes of free access.", "20 concurrent calls.", "10 free Knowledge Bases."].map((item) => (
                    <li className="flex items-start gap-3" key={item}><CheckIcon />{item}</li>
                  ))}
                </ul>
                <Link className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[var(--industry-accent)]/30 bg-[var(--industry-accent)]/10 text-sm font-bold text-[var(--industry-accent-soft)] transition hover:bg-[var(--industry-accent)]/15" href="/#demo">Get started</Link>
              </article>

              <article className="relative overflow-hidden rounded-2xl border border-[#8f83e8]/30 bg-[radial-gradient(circle_at_95%_0%,rgba(143,131,232,0.22),transparent_42%),#0a0b0d] p-6 sm:p-7">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8f83e8] to-transparent" />
                <div className="flex items-start justify-between gap-4">
                  <div><span className="text-xs font-bold uppercase tracking-[0.14em] text-[#c5bdff]">For growing teams</span><h3 className="mt-2 text-xl font-bold">Enterprise</h3></div>
                  <span className="rounded-full border border-[#ff9655]/25 bg-[#ff9655]/10 px-3 py-1.5 text-xs font-bold text-[#ffb17e]">Custom plan</span>
                </div>
                <div className="mt-5 border-b border-white/10 pb-5"><strong className="text-3xl font-semibold tracking-[-0.04em] text-white">Let&apos;s talk</strong><p className="mt-1 text-sm text-slate-400">Built around your volume and deployment.</p></div>
                <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-200">
                  {["White-glove setup for your use case.", "Dedicated solutions and premium support.", "Custom concurrency, pricing, and workflows.", `Deployment guidance for ${industry.title.toLowerCase()} teams.`].map((item) => (
                    <li className="flex items-start gap-3" key={item}><CheckIcon tone="purple" />{item}</li>
                  ))}
                </ul>
                <Link className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[linear-gradient(90deg,var(--industry-accent),#8f83e8)] text-sm font-extrabold text-[#031310] transition hover:brightness-110" href="/#contact">Talk to sales</Link>
              </article>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-black">
          <div className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center lg:px-8">
            <div className="mx-auto max-w-2xl">
              <Pill>F.A.Q</Pill>
              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">Questions &amp; answers</h2>
              <p className="mt-3 text-slate-300">Practical answers for planning your {industry.title.toLowerCase()} voice agent.</p>
            </div>
            <div className="mt-7 grid gap-2 text-left">
              {preset.faqs.map((question) => (
                <details className="group rounded-xl border border-white/10 bg-black px-5 py-4 transition hover:bg-white/[0.02] open:border-[var(--industry-accent)]/25 open:bg-[var(--industry-accent)]/[0.025]" key={question}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">{question}<span className="text-[var(--industry-accent-soft)] transition group-open:rotate-180">&#8964;</span></summary>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{faqAnswer(question, industry)}</p>
                </details>
              ))}
              <p className="mt-5 text-center text-sm text-slate-300">More questions? Visit our <Link className="rounded-md bg-black px-2 py-1 font-bold text-[var(--industry-accent-soft)]" href="/#resources">docs</Link></p>
            </div>
          </div>
        </section>

        <section className="bg-black px-6 pb-16 pt-4 lg:px-8">
          <div className="industry-contact mx-auto flex max-w-6xl flex-col items-center justify-between gap-7 overflow-hidden rounded-[24px] border border-[var(--industry-accent)]/35 bg-[#07100d] p-8 text-center sm:p-10 md:flex-row md:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--industry-accent-soft)]">Ready to get started?</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">Let&apos;s improve every {industry.title.toLowerCase()} call.</h2>
            </div>
            <Link className="inline-flex min-h-12 shrink-0 items-center rounded-lg bg-[var(--industry-accent)] px-7 text-sm font-bold text-[#031310] transition hover:-translate-y-0.5 hover:brightness-110" href="/#contact">CONTACT US <span className="ml-3">&rarr;</span></Link>
          </div>
        </section>
      </div>

      <style>{`
        .industry-hero-grid,
        .industry-feature-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
        }

        .industry-hero-heading {
          font-size: clamp(3.25rem, 5.6vw, 5.2rem);
          line-height: 0.98;
          letter-spacing: -0.05em;
        }

        .industry-hero-card {
          width: min(100%, 560px);
          justify-self: center;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45), 0 0 0 1px color-mix(in srgb, var(--industry-accent) 8%, transparent);
        }

        .industry-hero-image { height: clamp(360px, 44vw, 440px); }

        .industry-marquee-fade {
          -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
        }

        .industry-integration-card:nth-child(3n + 2) { border-color: rgba(143, 131, 232, 0.3); }
        .industry-integration-card:nth-child(3n + 2) .industry-integration-icon { background: rgba(143, 131, 232, 0.12); color: #c5bdff; }
        .industry-integration-card:nth-child(3n) { border-color: rgba(255, 150, 85, 0.28); }
        .industry-integration-card:nth-child(3n) .industry-integration-icon { background: rgba(255, 150, 85, 0.11); color: #ffb17e; }

        .industry-contact {
          background: radial-gradient(circle at 8% 0%, color-mix(in srgb, var(--industry-accent) 22%, transparent), transparent 38%), radial-gradient(circle at 92% 100%, rgba(143, 131, 232, 0.16), transparent 38%), #07100d;
        }

        @media (min-width: 1024px) {
          .industry-hero-grid { grid-template-columns: minmax(0, 1fr) minmax(380px, 0.82fr); }
          .industry-hero-card { justify-self: end; }
          .industry-feature-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .industry-feature-row.feature-content-left > :first-child { order: 2; }
          .industry-feature-row.feature-content-left > :nth-child(2) { order: 1; }
        }

        @keyframes industry-experience-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .industry-photo-marquee { animation: industry-experience-marquee 26s linear infinite; will-change: transform; }
        .industry-company-marquee { animation: industry-experience-marquee 28s linear infinite; }
        .industry-integration-marquee { animation: industry-experience-marquee 38s linear infinite; }
        .industry-photo-marquee:hover,
        .industry-company-marquee:hover,
        .industry-integration-marquee:hover { animation-play-state: paused; }

        @media (prefers-reduced-motion: reduce) {
          .industry-photo-marquee,
          .industry-company-marquee,
          .industry-integration-marquee { animation: none; }
        }
      `}</style>
    </SiteLayout>
  );
}
