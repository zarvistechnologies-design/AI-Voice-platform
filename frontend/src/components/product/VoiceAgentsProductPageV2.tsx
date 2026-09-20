"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { SiteLayout } from "@/components/layout/SiteLayout";

const steps = [
  [
    "01",
    "Define your agent",
    "Set its purpose, instructions, voice, language, and escalation rules.",
  ],
  [
    "02",
    "Connect your knowledge",
    "Add approved FAQs, documents, and the business systems it can use.",
  ],
  [
    "03",
    "Deploy where calls happen",
    "Assign a phone number, embed the widget, or connect through the API.",
  ],
  [
    "04",
    "Review and improve",
    "Use transcripts, outcomes, and call analytics to refine each workflow.",
  ],
] as const;

const features = [
  [
    "bolt",
    "Responsive conversations",
    "Stream speech as a reply is generated to keep conversations moving naturally.",
  ],
  [
    "turn",
    "Interruption handling",
    "Let callers change direction, clarify a request, or speak over the agent naturally.",
  ],
  [
    "voice",
    "Voice and persona control",
    "Choose the agent’s voice, tone, greeting, and communication style for each workflow.",
  ],
  [
    "globe",
    "Multilingual support",
    "Configure language-aware experiences for the customers and markets you serve.",
  ],
  [
    "tools",
    "Connected actions",
    "Use approved tools to check availability, update records, create tickets, and more.",
  ],
  [
    "handoff",
    "Human handoff",
    "Transfer the call with collected context when a teammate needs to take over.",
  ],
] as const;

const useCases = [
  [
    "support",
    "Customer support",
    "Answer routine questions, look up requests, and route complex cases to the right team.",
  ],
  [
    "sales",
    "Lead qualification",
    "Capture intent, fit, and timing before connecting a qualified prospect with sales.",
  ],
  [
    "phone",
    "IVR modernization",
    "Replace rigid phone menus with a natural conversation that understands customer intent.",
  ],
  [
    "calendar",
    "Scheduling and booking",
    "Book, confirm, reschedule, or cancel appointments against your available calendar.",
  ],
] as const;

const metrics = [
  ["<500ms", "Average latency", "Designed for responsive, live conversations"],
  ["99.9%", "Platform uptime", "Reliable infrastructure for customer workflows"],
  ["24/7", "Call coverage", "Always available for approved call types"],
  ["40+", "Languages", "Language-ready voice experiences"],
] as const;

function Icon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
  };

  const paths: Record<string, ReactNode> = {
    bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7V2Z" {...common} />,

    turn: (
      <>
        <path d="M4 7h10a4 4 0 0 1 4 4v1" {...common} />
        <path d="m15 9 3-2 2 3" {...common} />
        <path d="M20 17H10a4 4 0 0 1-4-4v-1" {...common} />
        <path d="m9 15-3 2-3-3" {...common} />
      </>
    ),

    voice: (
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" {...common} />
        <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" {...common} />
      </>
    ),

    globe: (
      <>
        <circle cx="12" cy="12" r="9" {...common} />
        <path
          d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21c-2.2-2.5-3.3-5.5-3.3-9S9.8 5.5 12 3Z"
          {...common}
        />
      </>
    ),

    tools: (
      <path
        d="M14.5 6.5a4.5 4.5 0 0 0-5.9 5.9L3 18l3 3 5.6-5.6a4.5 4.5 0 0 0 5.9-5.9l-3 3-2.5-2.5 2.5-3.5Z"
        {...common}
      />
    ),

    handoff: (
      <>
        <path d="M4 7h11M12 3l4 4-4 4M20 17H9M12 13l-4 4 4 4" {...common} />
      </>
    ),

    support: (
      <>
        <path
          d="M4 18v-6a8 8 0 0 1 16 0v6M4 16h3v4H5a1 1 0 0 1-1-1v-3Zm16 0h-3v4h2a1 1 0 0 1 1 1v-3Z"
          {...common}
        />
      </>
    ),

    sales: (
      <>
        <path d="M4 20V10l8-5 8 5v10H4Z" {...common} />
        <path d="M9 20v-5h6v5M8 10h.01M12 10h.01M16 10h.01" {...common} />
      </>
    ),

    phone: (
      <path
        d="M8 3h3l1.5 4-2.3 1.8a15 15 0 0 0 5 5L17 11.5l4 1.5v3c0 1.1-.9 2-2 2C10.2 18 6 13.8 6 5a2 2 0 0 1 2-2Z"
        {...common}
      />
    ),

    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" {...common} />
        <path d="M7 3v4M17 3v4M3 10h18M8 14h3M8 17h6" {...common} />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="size-5"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="voice-agent-eyebrow text-xs font-bold uppercase tracking-[0.16em] text-[#0f8777]">
      {children}
    </p>
  );
}

const section = "px-5 py-14 sm:px-8 sm:py-16";

const heading =
  "text-3xl font-semibold leading-tight tracking-[-0.02em] text-[#111312] md:text-4xl";

export function VoiceAgentsProductPageV2() {
  useEffect(() => {
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>(".voice-agent-section-reveal")
    );

    if (!revealItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const integrations = [
    "Telephony",
    "CRM",
    "Calendars",
    "Help desks",
    "Knowledge bases",
    "Webhooks",
  ];

  return (
    <SiteLayout>
      <main
        className="overflow-hidden bg-white text-[#111312]"
        id="voice-agents-solution-page"
      >
        {/* HERO */}
        <section className="voice-agent-hero relative min-h-[72vh] overflow-hidden border-b border-[#e3ebe8] bg-white px-5 pb-10 pt-28 sm:px-8 sm:pt-32">
          <div className="relative z-10 mx-auto grid w-full max-w-[1360px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(380px,.82fr)]">
            {/* HERO CONTENT */}
            <div className="max-w-[620px] voice-agent-reveal">
              <div className="mb-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                <span className="relative flex size-2">
                  <span className="voice-agent-ping absolute inline-flex size-full rounded-full bg-[#0f8777] opacity-30" />
                  <span className="relative size-2 rounded-full bg-[#0f8777]" />
                </span>
                Conversational AI voice agents
              </div>

              <h1 className="max-w-[620px] text-[clamp(1.85rem,3.8vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[#111312]">
                Turn every call into a{" "}
                <span className="block text-[#0f8777]">
                  clear next step.
                </span>
              </h1>

              <p className="mt-7 max-w-[570px] text-[15px] leading-7 text-[#53605d] sm:text-base">
                Conversational AI agents for support, sales, scheduling, and
                phone workflows — configured in your workspace and connected
                through approved tools.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#118778] bg-[#118778] px-6 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(17,135,120,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0e6f62]"
                  href="/dashboard/developers"
                >
                  Build your first agent
                  <span className="ml-2">→</span>
                </Link>

                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#118778] bg-[#118778] px-6 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(17,135,120,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0e6f62]"
                  href="/contact"
                >
                  See a demo
                </Link>
              </div>

              <p className="mt-5 text-xs font-medium text-[#66736f]">
                Create scoped keys in Dashboard → Developers. Keep them
                server-side.
              </p>
            </div>

            {/* HERO IMAGE */}
            <div className="voice-agent-reveal voice-agent-delay relative mx-auto flex w-full max-w-[620px] items-center justify-center bg-white">
              <div className="relative z-10 aspect-[770/523] w-full bg-white">
                <Image
                  alt="Voice agent support specialist ready to help a customer"
                  className="voice-agent-hero-image object-contain object-center mix-blend-multiply"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 620px"
                  src="/images/voice_healthcare_1.png"
                />
              </div>
            </div>
          </div>
        </section>

        {/* INTEGRATIONS */}
        <section aria-labelledby="voice-agent-integrations-title" className="overflow-hidden border-b border-[#e3ebe8] bg-[#f7f9f8] py-5 sm:py-6">
          <div className="mx-auto w-full max-w-[1360px]">
            <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[.16em] text-[#60706a]" id="voice-agent-integrations-title">
              Connect the tools your team already uses
            </p>
            <div className="voice-agent-integrations-window overflow-hidden">
              <div className="voice-agent-marquee flex w-max items-center gap-3 px-1">
                {[...integrations, ...integrations].map((item, index) => (
                  <article
                    aria-hidden={index >= integrations.length}
                    className="flex min-h-14 w-48 shrink-0 items-center justify-center rounded-xl border border-[#dfe7e4] bg-white px-3 text-center text-sm font-semibold text-[#40514c] shadow-[0_6px_18px_rgba(15,23,42,.025)]"
                    key={`${item}-${index}`}
                  >
                    <span className="mr-2 size-2 rounded-full bg-[#0f8777]" />
                    {item}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-5 py-14 sm:px-8 sm:py-16" id="voice-agent-workflow">
          <div className="mx-auto w-full max-w-[1360px]">
            <div className="max-w-[650px]">
              <Eyebrow>How it works</Eyebrow>

              <h2 className={`${heading} mt-4`}>
                From an idea to a production-ready voice workflow.
              </h2>

              <p className="mt-4 text-[15px] leading-7 text-[#5b6964]">
                Set the rules once, connect the right information and tools,
                then keep improving from real conversations.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 voice-agent-stagger-grid">
              {steps.map(([number, title, body], index) => (
                <article
                  className="rounded-2xl border border-[#d8d0e5] border-t-2 bg-white p-6 shadow-[0_8px_24px_rgba(109,106,156,.05)] voice-agent-hover-lift voice-agent-section-reveal"
                  key={number}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <p className="font-mono text-xs font-bold text-[#625b7d]">
                    {number}
                  </p>

                  <h3 className="mt-5 text-lg font-semibold tracking-[-.02em]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#60706a]">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* KEY CAPABILITIES */}
        <section
          className={`${section} border-y border-[#e8e2f1] bg-[#faf8fc]/60`}
          id="voice-agent-capabilities"
        >
          <div className="mx-auto w-full max-w-[1360px]">
            <Eyebrow>Key capabilities</Eyebrow>

            <h2 className={`${heading} mt-4 max-w-[720px]`}>
              Designed for conversations that need to get work done.
            </h2>

            <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 lg:grid-cols-3 voice-agent-stagger-grid">
              {features.map(([icon, title, body], index) => (
                <article
                  className="flex min-h-[152px] gap-4 rounded-2xl border border-transparent bg-white p-5 voice-agent-hover-lift voice-agent-section-reveal"
                  key={title}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-[#c9ddd8] text-[#0f8777]">
                    <Icon name={icon} />
                  </span>

                  <div>
                    <h3 className="text-base font-bold">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#60706a]">
                      {body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* API */}
        <section className={section} id="voice-agent-api">
          <div className="mx-auto grid w-full max-w-[1360px] gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-10">
            <div>
              <Eyebrow>API and integrations</Eyebrow>

              <h2 className={`${heading} mt-4`}>
                Connect your application with scoped access.
              </h2>

              <p className="mt-5 max-w-[500px] text-[15px] leading-7 text-[#5b6964]">
                Create API keys in the Developer dashboard, grant only the
                scopes a workflow requires, and authenticate server-side
                requests with a Bearer token.
              </p>

              <Link
                className="mt-7 inline-flex items-center text-sm font-bold text-[#0f8777] underline decoration-[#9b8acd] underline-offset-4"
                href="/docs#authentication"
              >
                Read the API documentation
                <span className="ml-2">→</span>
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#d8d0e5] bg-[#faf8fc] p-5 shadow-[0_18px_42px_rgba(109,106,156,.09)] sm:p-6">
              <div className="flex items-center justify-between border-b border-[#d8d0e5] pb-4">
                <span className="text-xs font-bold uppercase tracking-[.14em] text-[#625b7d]">
                  Example workflow
                </span>

                <span className="rounded-full bg-[#e8e2f1] px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#625b7d]">
                  Live call
                </span>
              </div>

              <ol className="mt-5 space-y-3">
                {[
                  ["Caller", "I need to reschedule my appointment."],
                  [
                    "Agent",
                    "I can help with that. Let me check available times.",
                  ],
                  [
                    "Connected calendar",
                    "Availability found and appointment updated.",
                  ],
                ].map(([speaker, message], index) => (
                  <li className="flex gap-3" key={speaker}>
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e8e2f1] text-[11px] font-bold text-[#625b7d]">
                      {index + 1}
                    </span>

                    <div className="rounded-xl border border-[#e8e2f1] bg-white px-4 py-3 text-sm leading-6 text-[#40514c]">
                      <strong className="mr-2 text-[#173b35]">
                        {speaker}
                      </strong>
                      {message}
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-5 border-t border-[#d8d0e5] pt-4 text-xs leading-5 text-[#60706a]">
                Connect approved tools with scoped API keys, webhooks, and
                server-side authentication.
              </p>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section
          className={`${section} border-y border-[#e8e2f1] bg-white`}
          id="voice-agent-use-cases"
        >
          <div className="mx-auto w-full max-w-[1360px]">
            <Eyebrow>Use cases</Eyebrow>

            <h2 className={`${heading} mt-4 max-w-[680px]`}>
              One agent platform for the calls your team handles most.
            </h2>

            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 voice-agent-stagger-grid">
              {useCases.map(([icon, title, body], index) => (
                <article
                  className="flex min-h-[235px] flex-col rounded-2xl border border-[#d8d0e5] bg-white p-5 shadow-[0_8px_24px_rgba(109,106,156,.05)] sm:p-6 voice-agent-hover-lift voice-agent-section-reveal"
                  key={title}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <span className="grid size-10 place-items-center rounded-xl border border-[#d1e2dd] text-[#0f8777]">
                    <Icon name={icon} />
                  </span>

                  <h3 className="mt-6 text-lg font-semibold">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#60706a]">
                    {body}
                  </p>

                  <Link
                    className="voice-agent-workflow-link mt-auto inline-flex pt-6 text-sm font-bold text-[#118778] transition hover:text-[#0e6f62]"
                    href="/contact"
                  >
                    Plan this workflow →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PERFORMANCE */}
        <section className={section}>
          <div className="mx-auto w-full max-w-[1360px]">
            <div className="text-center">
              <Eyebrow>Built for live conversations</Eyebrow>

              <h2 className={`${heading} mt-4`}>
                Performance details your team can evaluate.
              </h2>
            </div>

            <div className="mt-8 grid gap-4 py-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 voice-agent-stagger-grid">
              {metrics.map(([value, label, body], index) => (
                <article
                  className="rounded-2xl border border-black/20 bg-white p-5 text-center shadow-[0_8px_24px_rgba(20,35,31,.04)] sm:p-6 voice-agent-hover-lift voice-agent-section-reveal voice-agent-metric-reveal"
                  key={label}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <p className="text-3xl font-semibold tracking-[-.05em] text-[#0f8777]">
                    {value}
                  </p>

                  <h3 className="mt-4 text-sm font-bold">
                    {label}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#66736f]">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* OPERATIONAL VISIBILITY */}
        <section
          className={`${section} border-y border-[#e8e2f1] bg-[#faf8fc]/60`}
          id="voice-agent-control"
        >
          <div className="mx-auto grid w-full max-w-[1360px] gap-8 lg:grid-cols-2 voice-agent-stagger-grid">
            <article className="border-l-4 border-[#0f8777] bg-white pl-6 voice-agent-section-reveal">
              <Eyebrow>Control and human handoff</Eyebrow>

              <h2 className="mt-4 text-[clamp(1.75rem,2.5vw,2.4rem)] font-semibold leading-[1.1] tracking-[-.04em]">
                Keep every call within your team&apos;s boundaries.
              </h2>

              <p className="mt-5 max-w-[480px] text-[15px] leading-7 text-[#5b6964]">
                Review transcripts, outcomes, handoffs, and configured actions
                so teams can improve the workflow with evidence — not
                guesswork.
              </p>
            </article>

            <article className="rounded-2xl border border-[#d8d0e5] bg-white p-7 shadow-[0_12px_30px_rgba(109,106,156,.07)] voice-agent-section-reveal voice-agent-delay">
              <p className="text-3xl leading-none text-[#625b7d]">
                “
              </p>

              <blockquote className="mt-3 text-lg font-medium leading-8 tracking-[-.02em] text-[#183b35]">
                Start with a focused call type, define the handoff, and use
                real outcomes to decide what to automate next.
              </blockquote>

              <p className="mt-6 text-sm font-bold text-[#0f8777]">
                A controlled rollout approach
              </p>

              <p className="mt-1 text-sm text-[#6a7772]">
                Voice agent deployment guidance
              </p>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="border-t border-[#e3ebe8] px-5 py-14 sm:px-8 sm:py-16"
          id="voice-agent-faq"
        >
          <div className="mx-auto grid w-full max-w-[1360px] gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-14">
            <div>
              <Eyebrow>Frequently asked questions</Eyebrow>

              <h2 className="mt-4 text-[clamp(1.5rem,2.15vw,2.1rem)] font-semibold leading-[1.12] tracking-[-.035em]">
                What teams ask before they launch.
              </h2>

              <p className="mt-4 max-w-[440px] text-[15px] leading-7 text-[#5b6964]">
                A practical overview of setup, integrations, and how your
                team stays in control.
              </p>
            </div>

            <div className="divide-y divide-[#dce6e3] border-y border-[#dce6e3]">
              <details className="group py-5" open>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-bold text-[#173b35]">
                  <span>
                    Can a voice agent work with our existing systems?
                  </span>

                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[#c9ddd8] text-lg font-normal text-[#0f8777] transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="max-w-[650px] pt-4 text-sm leading-7 text-[#60706a]">
                  Yes. Connect approved calendars, CRM tools, help desks,
                  knowledge sources, and custom workflows through the available
                  integration and webhook options.
                </p>
              </details>

              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-bold text-[#173b35]">
                  <span>
                    How are calls transferred to a teammate?
                  </span>

                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[#c9ddd8] text-lg font-normal text-[#0f8777] transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="max-w-[650px] pt-4 text-sm leading-7 text-[#60706a]">
                  Set transfer rules by caller intent, confidence, urgency, or
                  a caller request. The receiving teammate can receive the
                  conversation context and collected details.
                </p>
              </details>

              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-bold text-[#173b35]">
                  <span>
                    Do we need engineering support to get started?
                  </span>

                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[#c9ddd8] text-lg font-normal text-[#0f8777] transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="max-w-[650px] pt-4 text-sm leading-7 text-[#60706a]">
                  You can configure the core conversation, knowledge, and
                  routing in the workspace. Engineering support is useful when
                  you need a custom integration or application-specific
                  workflow.
                </p>
              </details>

              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-bold text-[#173b35]">
                  <span>
                    How do we improve the agent after launch?
                  </span>

                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[#c9ddd8] text-lg font-normal text-[#0f8777] transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="max-w-[650px] pt-4 text-sm leading-7 text-[#60706a]">
                  Review transcripts, summaries, outcomes, and transfer
                  patterns. Use those findings to refine the knowledge,
                  instructions, actions, and escalation rules.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* BUILD YOUR WORKFLOW TODAY */}
        <section
          className="relative w-full overflow-hidden border-t border-[#e3ebe8] bg-white px-5 py-14 sm:px-8 sm:py-16"
          id="build-workflow-today"
        >
          <div className="relative mx-auto w-full max-w-[850px] text-center voice-agent-section-reveal">
            <div className="mx-auto inline-flex items-center rounded-full border border-[#c9ddd8] bg-[#f7fdfb] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0f8777]">
              Start building
            </div>

            <h2 className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-.055em] text-[#111312]">
              Build your workflow{" "}
              <span className="text-[#0f8777]">
                today.
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-[650px] text-[15px] leading-7 text-[#5b6964] sm:text-base">
              Turn your most important phone workflows into intelligent voice
              experiences. Start with one use case, connect the tools you need,
              and scale when you’re ready.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#118778] bg-[#118778] px-7 text-sm font-bold text-white shadow-[0_12px_28px_rgba(17,135,120,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0e6f62]"
                href="/dashboard/developers"
              >
                Build your workflow
                <span className="ml-2">→</span>
              </Link>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#118778] bg-[#118778] px-7 text-sm font-bold text-white shadow-[0_12px_28px_rgba(17,135,120,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0e6f62]"
                href="/contact"
              >
                Talk to our team
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
              <span>✓ Start with one workflow</span>
              <span>✓ Connect your existing tools</span>
              <span>✓ Scale when ready</span>
            </div>
          </div>
        </section>

        <style>{`
          /* Match the industry-page visual system on a white canvas. */

          #voice-agents-solution-page {
            background: #fff;
            color: #111312;
          }

          #voice-agents-solution-page#voice-agents-solution-page > section {
            background: #fff !important;
            background-image: none !important;
            border-color: #e3ebe8 !important;
          }

          #voice-agents-solution-page#voice-agents-solution-page article.rounded-2xl {
            background: #fff !important;
            border-color: rgba(17, 19, 18, .2) !important;
            box-shadow: 0 8px 24px rgba(20, 35, 31, .05);
          }

          .marketing-site:has(#voice-agents-solution-page) .site-pre-footer-cta {
            margin-top: 165px;
            overflow: visible;
            position: relative;
          }

          .marketing-site:has(#voice-agents-solution-page) .site-pre-footer-cta::before {
            content: "";
            position: absolute;
            z-index: 1;
            left: 50%;
            top: -165px;
            width: 540px;
            height: 540px;
            border-radius: 50%;
            background: #000;
            transform: translateX(-50%);
            pointer-events: none;
          }

          .marketing-site:has(#voice-agents-solution-page) .site-pre-footer-cta::after {
            content: "↓";
            position: absolute;
            z-index: 2;
            left: 50%;
            top: -125px;
            color: #fff;
            font-size: 46px;
            font-weight: 300;
            line-height: 1;
            transform: translateX(-50%);
            pointer-events: none;
          }

          .marketing-site:has(#voice-agents-solution-page) .site-pre-footer-cta > * {
            position: relative;
            z-index: 3;
          }

          .marketing-site:has(#voice-agents-solution-page) .site-pre-footer-cta > div {
            position: static;
          }

          .marketing-site:has(#voice-agents-solution-page) .site-pre-footer-cta > div::after {
            content: "";
            position: absolute;
            z-index: 4;
            right: 0;
            bottom: 0;
            left: 0;
            height: 1px;
            background: #3a3a3a;
            pointer-events: none;
          }

          .marketing-site:has(#voice-agents-solution-page) .site-pre-footer-cta > div > * {
            position: relative;
            z-index: 3;
          }

          @media (max-width: 640px) {
            .marketing-site:has(#voice-agents-solution-page) .site-pre-footer-cta {
              margin-top: 155px;
            }

            .marketing-site:has(#voice-agents-solution-page) .site-pre-footer-cta::before {
              top: -155px;
              width: 540px;
              height: 540px;
              border-radius: 50%;
            }

            .marketing-site:has(#voice-agents-solution-page) .site-pre-footer-cta::after {
              top: -115px;
              font-size: 46px;
            }
          }

          #voice-agents-solution-page h1,
          #voice-agents-solution-page h2,
          #voice-agents-solution-page h3,
          #voice-agents-solution-page strong,
          #voice-agents-solution-page blockquote,
          #voice-agents-solution-page summary {
            color: #173b35;
          }

          #voice-agents-solution-page p:not(.voice-agent-eyebrow) {
            color: #5b6964;
          }

          #voice-agents-solution-page .voice-agent-eyebrow {
            color: #0f8777;
          }

          #voice-agents-solution-page .voice-agent-workflow-link {
            color: #118778 !important;
          }

          #voice-agents-solution-page .voice-agent-workflow-link:hover {
            color: #0e6f62 !important;
          }

          #voice-agents-solution-page .voice-agent-integrations-window article {
            background: #fff;
            border-color: #dfe7e4;
            color: #40514c;
          }

          #voice-agent-api > div > div:last-child,
          #voice-agent-api li > div {
            background: #fff;
            border-color: #d8d0e5;
            color: #40514c;
          }

          #voice-agent-api > div > div:last-child > div,
          #voice-agent-api > div > div:last-child > p,
          #voice-agent-faq details,
          #voice-agent-faq > div > div:last-child {
            border-color: #dce6e3;
          }

          #voice-agent-faq details span:last-child {
            border-color: #c9ddd8;
            color: #0f8777;
          }

          #voice-agent-api li > span,
          #voice-agent-api > div > div:last-child > div span:last-child {
            background: #e8e2f1;
            color: #625b7d;
          }

          #voice-agent-control article {
            background: #fff;
            border-color: #0f8777;
          }

          #voice-agents-solution-page .voice-agent-metric-reveal > p:first-child {
            color: #0f8777;
          }

          #build-workflow-today > div > div:first-child {
            background: #f7fdfb;
            border-color: #c9ddd8;
            color: #0f8777;
          }

          .voice-agent-reveal {
            animation: voice-agent-rise .7s cubic-bezier(.2,.75,.3,1) both;
          }

          .voice-agent-delay {
            animation-delay: .12s;
          }

          .voice-agent-ping {
            animation: voice-agent-pulse 1.7s ease-out infinite;
          }

          .voice-agent-integrations-window {
            mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent);
          }

          .voice-agent-marquee {
            animation: voice-agent-marquee 28s linear infinite;
            will-change: transform;
          }

          .voice-agent-marquee:hover {
            animation-play-state: paused;
          }

          .voice-agent-section-reveal {
            opacity: 0;
            translate: 0 14px;
          }

          .voice-agent-section-reveal.is-visible {
            animation: voice-agent-section-in .56s cubic-bezier(.22,1,.36,1) both;
          }

          .voice-agent-hover-lift {
            transition:
              transform .22s ease,
              border-color .22s ease,
              box-shadow .22s ease;
          }

          @media (hover: hover) and (pointer: fine) {
            .voice-agent-hover-lift:hover {
              transform: translateY(-3px);
              border-color: #c4d8d3;
              box-shadow: 0 12px 28px rgba(24, 70, 62, .08);
            }
          }

          .voice-agent-metric-reveal {
            transform-origin: center bottom;
          }

          @keyframes voice-agent-section-in {
            from {
              opacity: 0;
              translate: 0 14px;
            }

            to {
              opacity: 1;
              translate: 0 0;
            }
          }

          @keyframes voice-agent-rise {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes voice-agent-pulse {
            from {
              transform: scale(1);
              opacity: .45;
            }

            to {
              transform: scale(2.8);
              opacity: 0;
            }
          }

          @keyframes voice-agent-marquee {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(calc(-50% - .375rem));
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .voice-agent-reveal,
            .voice-agent-ping,
            .voice-agent-marquee,
            .voice-agent-section-reveal {
              animation: none;
              opacity: 1;
              translate: none;
              transform: none;
            }
          }
        `}</style>
      </main>
    </SiteLayout>
  );
}
