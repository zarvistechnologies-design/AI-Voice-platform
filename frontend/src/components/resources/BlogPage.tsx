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
    summary: "Structure greetings, questions, confirmations, and fallbacks so conversations feel clear from the first hello.",
    image: "/service-images/team-workflow.jpg",
    imageAlt: "Team designing a clear AI voice conversation workflow",
    readTime: "6 min read",
  },
  {
    group: "Workflows",
    category: "Operations",
    title: "Where voice automation should hand off to a person",
    summary: "Define practical transfer conditions for sensitive, complex, or high-value calls without breaking the caller journey.",
    image: "/service-images/quality-review.jpg",
    imageAlt: "Specialist reviewing a customer call before a human handoff",
    readTime: "5 min read",
  },
  {
    group: "Analytics",
    category: "Analytics",
    title: "Turn call transcripts into useful operational insight",
    summary: "Move beyond summaries by organizing recurring needs, objections, outcomes, and follow-up work.",
    image: "/service-images/voice-analytics.jpg",
    imageAlt: "Voice analytics dashboard revealing patterns across calls",
    readTime: "7 min read",
  },
  {
    group: "Voice AI",
    category: "Multilingual AI",
    title: "Plan multilingual voice workflows with confidence",
    summary: "Review language coverage, pronunciation, local context, routing, and quality before expanding to a new market.",
    image: "/service-images/multilingual-team.jpg",
    imageAlt: "Multilingual team planning voice experiences for global customers",
    readTime: "6 min read",
  },
  {
    group: "Workflows",
    category: "Reliability",
    title: "A practical checklist for testing voice agents",
    summary: "Test interruptions, silence, noisy audio, tool failures, unexpected questions, and escalation paths before launch.",
    image: "/service-images/sentiment-support.jpg",
    imageAlt: "Quality specialist testing call sentiment and voice-agent responses",
    readTime: "8 min read",
  },
  {
    group: "Developers",
    category: "Developers",
    title: "Connect voice agents to business tools safely",
    summary: "Use narrow permissions, confirmation steps, observable actions, and clear failure handling across integrations.",
    image: "/service-images/developer-api.jpg",
    imageAlt: "Developer connecting a voice agent to secure business APIs",
    readTime: "7 min read",
  },
  {
    group: "Analytics",
    category: "Performance",
    title: "Measure voice-agent performance beyond call duration",
    summary: "Track resolution, transfer quality, intent coverage, action completion, and recurring failure patterns across customer calls.",
    image: "/blog-images/performance-metrics.webp",
    imageAlt: "Voice waveform branching into multiple performance metrics",
    readTime: "6 min read",
  },
  {
    group: "Developers",
    category: "Architecture",
    title: "Design reliable webhook-driven call workflows",
    summary: "Plan idempotent events, retries, timeouts, verification, and observability when calls trigger actions across your stack.",
    image: "/blog-images/webhook-workflow.webp",
    imageAlt: "Voice event moving through a reliable webhook workflow",
    readTime: "8 min read",
  },
  {
    group: "Voice AI",
    category: "Voice experience",
    title: "Choose a voice that fits the customer experience",
    summary: "Evaluate clarity, pace, pronunciation, tone, language coverage, and consistency before selecting a production voice.",
    image: "/service-images/voice-studio.jpg",
    imageAlt: "Voice studio interface used to select an AI voice",
    readTime: "5 min read",
  },
  {
    group: "Voice AI",
    category: "Conversation design",
    title: "Design natural interruption and recovery behaviour",
    summary: "Help agents handle barge-in, silence, corrections, and misunderstood requests without forcing callers back to the beginning.",
    image: "/blog-images/interruption-recovery.webp",
    imageAlt: "Caller and AI waveforms crossing and recovering naturally",
    readTime: "7 min read",
  },
  {
    group: "Workflows",
    category: "Workflow design",
    title: "Map a customer call from intent to completed action",
    summary: "Connect each common request to the information, business rules, tools, confirmation, and outcome the workflow needs.",
    image: "/blog-images/intent-to-action.webp",
    imageAlt: "Customer voice intent progressing through a completed workflow",
    readTime: "6 min read",
  },
  {
    group: "Workflows",
    category: "Escalation",
    title: "Build escalation paths that preserve call context",
    summary: "Transfer the reason, details, transcript, and actions already attempted so a teammate can continue without repetition.",
    image: "/blog-images/context-handoff.webp",
    imageAlt: "AI voice agent passing complete conversation context to a person",
    readTime: "5 min read",
  },
  {
    group: "Analytics",
    category: "Quality review",
    title: "Create focused review queues from call signals",
    summary: "Use outcomes, sentiment shifts, failed actions, transfers, and policy flags to prioritize the calls worth human review.",
    image: "/blog-images/review-queue.webp",
    imageAlt: "Call signals being filtered into focused quality-review queues",
    readTime: "6 min read",
  },
  {
    group: "Analytics",
    category: "Conversation insights",
    title: "Use conversation trends to improve agent instructions",
    summary: "Find repeated questions, confusion, objections, and unresolved intents, then turn those patterns into targeted updates.",
    image: "/blog-images/conversation-trends.webp",
    imageAlt: "Many conversation trends forming an improved voice response",
    readTime: "7 min read",
  },
  {
    group: "Developers",
    category: "Tool security",
    title: "Protect agent tools with narrowly scoped permissions",
    summary: "Limit each integration to the records and actions it needs, then require confirmation for sensitive changes.",
    image: "/blog-images/scoped-permissions.webp",
    imageAlt: "Protected voice agent connected only to authorized tools",
    readTime: "6 min read",
  },
  {
    group: "Developers",
    category: "Observability",
    title: "Trace a voice workflow across APIs and providers",
    summary: "Correlate call events, model activity, tool requests, retries, and errors so production issues are easier to diagnose.",
    image: "/blog-images/api-observability.webp",
    imageAlt: "Voice trace traveling across APIs and infrastructure providers",
    readTime: "8 min read",
  },
] as const;

const categories = ["All insights", "Voice AI", "Workflows", "Analytics", "Developers"] as const;

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All insights");
  const visiblePosts =
    activeCategory === "All insights"
      ? blogPosts.slice(0, 6)
      : blogPosts.filter((post) => post.group === activeCategory);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-black text-white">
        <section className="relative overflow-hidden bg-black px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pb-24 lg:pt-40">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(69,221,206,0.11),transparent_29%),linear-gradient(rgba(69,221,206,0.023)_1px,transparent_1px),linear-gradient(90deg,rgba(69,221,206,0.023)_1px,transparent_1px)] [background-size:auto,60px_60px,60px_60px]" />
          <div className="relative mx-auto max-w-[1320px]">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/34">
              <Link className="transition hover:text-[#75fff0]" href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#75fff0]">Blog</span>
            </nav>
            <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#75fff0]">Vozon ideas</p>
                <h1 className="mt-4 max-w-[850px] text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
                  Better thinking for better conversations.
                </h1>
              </div>
              <p className="border-l border-[#45ddce]/35 pl-6 text-base leading-8 text-white/48">
                Practical guidance for teams designing, launching, and improving AI voice agents
                in real customer workflows.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-black px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
          <div className="mx-auto max-w-[1320px]">
            <article className="group grid overflow-hidden rounded-2xl border border-[#45ddce]/18 bg-[#050807] shadow-[0_28px_80px_rgba(0,0,0,0.38)] lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative min-h-[330px] overflow-hidden lg:min-h-[500px]">
                <Image
                  alt="Team reviewing customer conversation insights"
                  className="object-cover opacity-80 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-90"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  src="/service-images/conversation-insights.jpg"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050807]/65 lg:block" />
              </div>
              <div className="relative flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <span className="inline-flex w-fit rounded-full border border-[#45ddce]/25 bg-[#45ddce]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#75fff0]">
                  Featured perspective
                </span>
                <h2 className="mt-7 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Build voice agents around the conversation—not the script.
                </h2>
                <p className="mt-5 text-base leading-8 text-white/48">
                  A strong voice workflow listens, confirms, recovers, and knows when a person
                  should step in. Start with the caller&apos;s real path through the conversation.
                </p>
                <div className="mt-8 flex items-center gap-4 text-xs text-white/34">
                  <span className="font-semibold text-[#75fff0]">Voice AI strategy</span>
                  <span aria-hidden="true" className="h-3 w-px bg-white/15" />
                  <span>8 min read</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-[#020403] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">Latest thinking</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Ideas your team can put to work.</h2>
              </div>
              <div className="flex flex-wrap gap-2" aria-label="Blog categories">
                {categories.map((category) => (
                  <button
                    aria-pressed={activeCategory === category}
                    className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                      activeCategory === category
                        ? "border-[#45ddce]/35 bg-[#45ddce]/10 text-[#75fff0] shadow-[0_0_18px_rgba(69,221,206,0.08)]"
                        : "border-white/10 bg-white/[0.025] text-white/40 hover:border-white/20 hover:text-white/70"
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

            <div aria-live="polite" className={`mt-10 grid gap-4 sm:grid-cols-2 ${activeCategory === "All insights" ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
              {visiblePosts.map((post, index) => (
                <article className="group overflow-hidden rounded-xl border border-white/[0.1] bg-[#050706] transition duration-300 hover:-translate-y-1 hover:border-[#45ddce]/30 hover:shadow-[0_24px_65px_rgba(0,0,0,0.36)]" key={post.title}>
                  <div className="relative aspect-[2/1] overflow-hidden">
                    <Image
                      alt={post.imageAlt}
                      className="object-cover opacity-70 transition duration-500 group-hover:scale-[1.035] group-hover:opacity-85"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={post.image}
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 grid size-9 place-items-center rounded-lg border border-white/15 bg-black/70 font-mono text-[10px] text-[#75fff0] backdrop-blur">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.13em]">
                      <span className="text-[#75fff0]">{post.category}</span>
                      <span className="text-white/26">{post.readTime}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-white/90">{post.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/44">{post.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto flex max-w-[1120px] flex-col items-start justify-between gap-8 rounded-2xl border border-[#45ddce]/20 bg-[linear-gradient(115deg,rgba(69,221,206,0.11),rgba(69,221,206,0.025)_46%,transparent)] p-7 sm:p-10 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">Build with clarity</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Turn an idea into a working voice experience.</h2>
              <p className="mt-3 max-w-[650px] text-sm leading-7 text-white/46">Talk with our team about your calls, workflows, integrations, and rollout plan.</p>
            </div>
            <Link className="inline-flex min-h-12 shrink-0 items-center rounded-lg bg-[#45ddce] px-6 text-sm font-bold text-[#02110e] transition hover:bg-[#75fff0]" href="/contact">
              Contact our team
            </Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
