"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { SiteLayout } from "@/components/layout/SiteLayout";

const blogPosts = [
  {
    group: "Voice AI",
    category: "Conversation design",
    title: "How to design an AI voice agent callers can trust",
    summary:
      "Structure greetings, questions, confirmations, and fallbacks so conversations feel clear from the first hello.",
    image: "/service-images/team-workflow.jpg",
    imageAlt: "Team designing a clear AI voice conversation workflow",
    readTime: "6 min read",
  },
  {
    group: "Workflows",
    category: "Operations",
    title: "Where voice automation should hand off to a person",
    summary:
      "Define practical transfer conditions for sensitive, complex, or high-value calls without breaking the caller journey.",
    image: "/service-images/quality-review.jpg",
    imageAlt: "Specialist reviewing a customer call before a human handoff",
    readTime: "5 min read",
  },
  {
    group: "Analytics",
    category: "Analytics",
    title: "Turn call transcripts into useful operational insight",
    summary:
      "Move beyond summaries by organizing recurring needs, objections, outcomes, and follow-up work.",
    image: "/service-images/voice-analytics.jpg",
    imageAlt: "Voice analytics dashboard revealing patterns across calls",
    readTime: "7 min read",
  },
  {
    group: "Voice AI",
    category: "Multilingual AI",
    title: "Plan multilingual voice workflows with confidence",
    summary:
      "Review language coverage, pronunciation, local context, routing, and quality before expanding to a new market.",
    image: "/service-images/multilingual-team.jpg",
    imageAlt:
      "Multilingual team planning voice experiences for global customers",
    readTime: "6 min read",
  },
  {
    group: "Workflows",
    category: "Reliability",
    title: "A practical checklist for testing voice agents",
    summary:
      "Test interruptions, silence, noisy audio, tool failures, unexpected questions, and escalation paths before launch.",
    image: "/service-images/sentiment-support.jpg",
    imageAlt:
      "Quality specialist testing call sentiment and voice-agent responses",
    readTime: "8 min read",
  },
  {
    group: "Developers",
    category: "Developers",
    title: "Connect voice agents to business tools safely",
    summary:
      "Use narrow permissions, confirmation steps, observable actions, and clear failure handling across integrations.",
    image: "/service-images/developer-api.jpg",
    imageAlt: "Developer connecting a voice agent to secure business APIs",
    readTime: "7 min read",
  },
  {
    group: "Analytics",
    category: "Performance",
    title: "Measure voice-agent performance beyond call duration",
    summary:
      "Track resolution, transfer quality, intent coverage, action completion, and recurring failure patterns across customer calls.",
    image: "/blog-images/performance-metrics.webp",
    imageAlt: "Voice waveform branching into multiple performance metrics",
    readTime: "6 min read",
  },
  {
    group: "Developers",
    category: "Architecture",
    title: "Design reliable webhook-driven call workflows",
    summary:
      "Plan idempotent events, retries, timeouts, verification, and observability when calls trigger actions across your stack.",
    image: "/blog-images/webhook-workflow.webp",
    imageAlt: "Voice event moving through a reliable webhook workflow",
    readTime: "8 min read",
  },
  {
    group: "Voice AI",
    category: "Voice experience",
    title: "Choose a voice that fits the customer experience",
    summary:
      "Evaluate clarity, pace, pronunciation, tone, language coverage, and consistency before selecting a production voice.",
    image: "/service-images/voice-studio.jpg",
    imageAlt: "Voice studio interface used to select an AI voice",
    readTime: "5 min read",
  },
  {
    group: "Voice AI",
    category: "Conversation design",
    title: "Design natural interruption and recovery behaviour",
    summary:
      "Help agents handle barge-in, silence, corrections, and misunderstood requests without forcing callers back to the beginning.",
    image: "/blog-images/interruption-recovery.webp",
    imageAlt: "Caller and AI waveforms crossing and recovering naturally",
    readTime: "7 min read",
  },
  {
    group: "Workflows",
    category: "Workflow design",
    title: "Map a customer call from intent to completed action",
    summary:
      "Connect each common request to the information, business rules, tools, confirmation, and outcome the workflow needs.",
    image: "/blog-images/intent-to-action.webp",
    imageAlt:
      "Customer voice intent progressing through a completed workflow",
    readTime: "6 min read",
  },
  {
    group: "Workflows",
    category: "Escalation",
    title: "Build escalation paths that preserve call context",
    summary:
      "Transfer the reason, details, transcript, and actions already attempted so a teammate can continue without repetition.",
    image: "/blog-images/context-handoff.webp",
    imageAlt:
      "AI voice agent passing complete conversation context to a person",
    readTime: "5 min read",
  },
  {
    group: "Analytics",
    category: "Quality review",
    title: "Create focused review queues from call signals",
    summary:
      "Use outcomes, sentiment shifts, failed actions, transfers, and policy flags to prioritize the calls worth human review.",
    image: "/blog-images/review-queue.webp",
    imageAlt:
      "Call signals being filtered into focused quality-review queues",
    readTime: "6 min read",
  },
  {
    group: "Analytics",
    category: "Conversation insights",
    title: "Use conversation trends to improve agent instructions",
    summary:
      "Find repeated questions, confusion, objections, and unresolved intents, then turn those patterns into targeted updates.",
    image: "/blog-images/conversation-trends.webp",
    imageAlt:
      "Many conversation trends forming an improved voice response",
    readTime: "7 min read",
  },
  {
    group: "Developers",
    category: "Tool security",
    title: "Protect agent tools with narrowly scoped permissions",
    summary:
      "Limit each integration to the records and actions it needs, then require confirmation for sensitive changes.",
    image: "/blog-images/scoped-permissions.webp",
    imageAlt:
      "Protected voice agent connected only to authorized tools",
    readTime: "6 min read",
  },
  {
    group: "Developers",
    category: "Observability",
    title: "Trace a voice workflow across APIs and providers",
    summary:
      "Correlate call events, model activity, tool requests, retries, and errors so production issues are easier to diagnose.",
    image: "/blog-images/api-observability.webp",
    imageAlt:
      "Voice trace traveling across APIs and infrastructure providers",
    readTime: "8 min read",
  },
] as const;

const categories = [
  "All insights",
  "Voice AI",
  "Workflows",
  "Analytics",
  "Developers",
] as const;

export function BlogPage() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("All insights");

  const visiblePosts =
    activeCategory === "All insights"
      ? blogPosts.slice(0, 6)
      : blogPosts.filter((post) => post.group === activeCategory);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-white text-[#111111]">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-white px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pb-20 lg:pt-36">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(16,141,130,0.055),transparent_30%)]"
          />

          <div className="relative mx-auto max-w-[1320px]">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black/35"
            >
              <Link
                className="transition hover:text-[#108D82]"
                href="/"
              >
                Home
              </Link>

              <span aria-hidden="true">/</span>

              <span className="text-[#108D82]">Blog</span>
            </nav>

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#108D82]">
                  Vozon ideas
                </p>

                <h1 className="mt-4 max-w-[780px] text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#111111] sm:text-5xl lg:text-[58px]">
                  Better thinking for better conversations.
                </h1>
              </div>

              <p className="border-l border-[#108D82]/25 pl-6 text-base leading-8 text-black/55">
                Practical guidance for teams designing, launching, and
                improving AI voice agents in real customer workflows.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURED ARTICLE */}
        <section className="bg-white px-5 pb-16 sm:px-8 lg:px-12 lg:pb-20">
          <div className="mx-auto max-w-[1320px]">
            <article className="group grid overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_18px_55px_rgba(0,0,0,0.08)] lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative min-h-[300px] overflow-hidden lg:min-h-[450px]">
                <Image
                  alt="Team reviewing customer conversation insights"
                  className="object-cover transition duration-700 group-hover:scale-[1.025]"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  src="/service-images/conversation-insights.jpg"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"
                />
              </div>

              <div className="relative flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <span className="inline-flex w-fit rounded-full border border-[#108D82]/20 bg-[#108D82]/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#108D82]">
                  Featured perspective
                </span>

                <h2 className="mt-6 text-2xl font-semibold tracking-[-0.035em] text-[#111111] sm:text-3xl">
                  Build voice agents around the conversation—not the script.
                </h2>

                <p className="mt-5 text-base leading-8 text-black/55">
                  A strong voice workflow listens, confirms, recovers, and
                  knows when a person should step in. Start with the caller&apos;s
                  real path through the conversation.
                </p>

                <div className="mt-7 flex items-center gap-4 text-xs text-black/40">
                  <span className="font-semibold text-[#108D82]">
                    Voice AI strategy
                  </span>

                  <span
                    aria-hidden="true"
                    className="h-3 w-px bg-black/15"
                  />

                  <span>8 min read</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* BLOG CARDS SECTION */}
        <section className="bg-[#fafafa] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#108D82]">
                  Latest thinking
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#111111] sm:text-4xl">
                  Ideas your team can put to work.
                </h2>
              </div>

              <div
                className="flex flex-wrap gap-2"
                aria-label="Blog categories"
              >
                {categories.map((category) => (
                  <button
                    aria-pressed={activeCategory === category}
                    className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                      activeCategory === category
                        ? "border-[#108D82]/30 bg-[#108D82]/[0.07] text-[#108D82]"
                        : "border-black/10 bg-white text-black/45 hover:border-black/20 hover:text-black/75"
                    }`}
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div
              aria-live="polite"
              className={`mt-9 grid gap-5 sm:grid-cols-2 ${
                activeCategory === "All insights"
                  ? "lg:grid-cols-3"
                  : "lg:grid-cols-2"
              }`}
            >
              {visiblePosts.map((post, index) => (
                <article
                  className="group overflow-hidden rounded-xl border border-black/[0.08] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#108D82]/25 hover:shadow-[0_18px_45px_rgba(0,0,0,0.09)]"
                  key={post.title}
                >
                  <div className="relative aspect-[2/1] overflow-hidden">
                    <Image
                      alt={post.imageAlt}
                      className="object-cover transition duration-500 group-hover:scale-[1.035]"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={post.image}
                    />

                    <span className="absolute left-4 top-4 grid size-9 place-items-center rounded-lg border border-white/60 bg-white/90 font-mono text-[10px] text-[#108D82] shadow-sm backdrop-blur">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.13em]">
                      <span className="text-[#108D82]">
                        {post.category}
                      </span>

                      <span className="text-black/35">
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#111111]">
                      {post.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-black/55">
                      {post.summary}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-white px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto flex max-w-[1120px] flex-col items-start justify-between gap-8 rounded-2xl border border-[#108D82]/15 bg-[#f8fbfa] p-7 sm:p-10 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#108D82]">
                Build with clarity
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#111111] sm:text-4xl">
                Turn an idea into a working voice experience.
              </h2>

              <p className="mt-3 max-w-[650px] text-sm leading-7 text-black/55">
                Talk with our team about your calls, workflows,
                integrations, and rollout plan.
              </p>
            </div>

            <Link
              className="inline-flex min-h-12 shrink-0 items-center rounded-lg bg-[#108D82] px-6 text-sm font-bold text-white transition hover:bg-[#0c756c]"
              href="/contact"
            >
              Contact our team
            </Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
