"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export interface PillarItem {
  id: string;
  number: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  simpleBots: {
    label: string;
    description: string;
  };
  agenticPlatform: {
    label: string;
    summary: string;
    bullets?: string[];
  };
}

export const agenticPillars: PillarItem[] = [
  {
    id: "cognitive-planning",
    number: "01",
    tag: "Cognitive Planning",
    title: "Objective-Driven, Not Script-Driven",
    subtitle: "Dynamic reasoning replaces fragile decision trees",
    image: "/images/pillars/pillar-1-cognitive-planning.png",
    imageAlt: "Script-driven bot dead end vs Objective-driven agent reasoning path",
    imageCaption: "Reasoning picks the fastest, most empathetic path to the objective.",
    simpleBots: {
      label: "What simple bots do",
      description:
        'If a customer says something off-script, the bot says: "Sorry, I didn\'t get that. Please choose from the menu."',
    },
    agenticPlatform: {
      label: "What our Agentic Platform does",
      summary:
        'You give the agent a high-level objective (e.g., "Negotiate a payment plan within a 15% discount threshold while keeping customer goodwill"). The agent uses dynamic reasoning (ReAct / Chain-of-Thought) to figure out the fastest, most empathetic path to achieve that objective.',
    },
  },
  {
    id: "tool-execution",
    number: "02",
    tag: "Real-World Action",
    title: "Autonomous Tool Execution in the Real World",
    subtitle: "Live external systems integration mid-sentence",
    image: "/images/pillars/pillar-2-real-world-action.png",
    imageAlt: "Voice agent interacting with backend database, WhatsApp, booking engine, and CRM in real time",
    imageCaption: "All actions happen mid-conversation, in real time.",
    simpleBots: {
      label: "What simple bots do",
      description: "Read static text from a knowledge base.",
    },
    agenticPlatform: {
      label: "What our Agentic Platform does",
      summary:
        "While conversing with the caller, the agent interacts with external systems in real-time:",
      bullets: [
        "Queries your backend database mid-sentence (GET /user/policy-status).",
        "Checks live seat availability on your booking engine.",
        "Generates and dispatches a dynamic payment link via WhatsApp during the conversation.",
        "Updates lead stage and custom deal values in Zoho or Salesforce before the call finishes.",
      ],
    },
  },
  {
    id: "episodic-memory",
    number: "03",
    tag: "State & Memory",
    title: "Dynamic State & Episodic Memory",
    subtitle: "Contextual recall across calls and timeline variables",
    image: "/images/pillars/pillar-3-state-memory.png",
    imageAlt: "Episodic memory across past calls and live conversation state tracking",
    imageCaption: "Callers are recognized, not restarted from scratch.",
    simpleBots: {
      label: "What simple bots do",
      description:
        "Stateless. If the customer calls back 5 minutes later, it starts from scratch.",
    },
    agenticPlatform: {
      label: "What our Agentic Platform does",
      summary: "Maintains persistent memory across interactions:",
      bullets: [
        "Remembers caller history, preferences, and open tickets from 2 weeks ago.",
        "Tracks conversational state variables on the fly (intent, sentiment, objections raised, agreed terms).",
      ],
    },
  },
  {
    id: "self-correction",
    number: "04",
    tag: "Resilience",
    title: "Self-Correction & Ambiguity Resolution",
    subtitle: "Graceful recovery from contradictions and API timeouts",
    image: "/images/pillars/pillar-4-self-correction.png",
    imageAlt: "Recovery workflow from API timeouts, contradictory caller input, and dynamic fallback",
    imageCaption: "Graceful self-correction without dropped calls or loops.",
    simpleBots: {
      label: "What simple bots do",
      description:
        "Crash or loop repeatedly when faced with contradictory information.",
    },
    agenticPlatform: {
      label: "What our Agentic Platform does",
      summary:
        "Detects ambiguity, asks clarifying questions, adjusts its internal plan, and recovers gracefully from API timeouts or incomplete user responses without breaking the conversation flow.",
    },
  },
  {
    id: "multi-agent-swarms",
    number: "05",
    tag: "Swarm Delegation",
    title: "Multi-Agent Orchestration & Swarm Delegation",
    subtitle: "Specialized cognitive agents working in unison",
    image: "/images/pillars/pillar-5-swarm-delegation.png",
    imageAlt: "Multi-agent swarm handoff between triage agent, technical agent, billing agent, and human warm transfer",
    imageCaption: "Specialized sub-agent swarm with context-aware warm transfer to human reps.",
    simpleBots: {
      label: "What simple bots do",
      description: "One giant prompt trying to handle everything poorly.",
    },
    agenticPlatform: {
      label: "What our Agentic Platform does",
      summary: "Employs specialized sub-agents working together:",
      bullets: [
        "Triage Agent authenticates caller and detects core intent.",
        "Hands off context dynamically to a Technical Troubleshooting Agent or Billing Specialist Agent.",
        "If human intervention is needed, performs a Context-Aware Warm Transfer where the human rep receives a 3-bullet live summary before picking up.",
      ],
    },
  },
];

interface PillarStreamCardProps {
  pillar: PillarItem;
  index: number;
}

function PillarStreamCard({ pillar, index }: PillarStreamCardProps) {
  return (
    <article
      className="group relative flex w-[340px] sm:w-[450px] md:w-[490px] shrink-0 flex-col justify-between rounded-3xl border border-line bg-paper p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ink/50 hover:shadow-xl"
    >
      <div>
        {/* Top Header Badge */}
        <div className="flex items-center justify-between border-b border-line pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-xl bg-ink text-[#d4ff3f] font-mono text-xs font-bold shadow-sm">
              {pillar.number}
            </span>
            <span className="font-mono text-xs font-bold tracking-wider uppercase text-cobalt">
              Pillar {pillar.number}
            </span>
          </div>
          <span className="eyebrow text-muted text-[11px] font-semibold">
            {pillar.tag}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-display text-base sm:text-lg font-bold text-ink mt-3.5 leading-snug break-words">
          {pillar.title}
        </h3>
        <p className="mt-1 font-mono text-[11px] text-muted">
          {pillar.subtitle}
        </p>

        {/* Architectural Diagram Illustration */}
        <div className="mt-3.5 overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e0c] p-2.5 shadow-inner">
          <div className="flex items-center justify-between pb-1.5 px-1 border-b border-white/10">
            <span className="font-mono text-[10px] uppercase font-bold text-[#d4ff3f] flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#d4ff3f] animate-pulse" />
              Architecture Map
            </span>
            <span className="font-mono text-[10px] text-zinc-400">Pillar {pillar.number}</span>
          </div>
          <div className="relative mt-2 w-full aspect-[16/9] bg-black/50 rounded-xl overflow-hidden flex items-center justify-center">
            <Image
              src={pillar.image}
              alt={pillar.imageAlt}
              fill
              sizes="(max-width: 640px) 320px, 480px"
              className="object-contain p-1"
              loading="eager"
            />
          </div>
          <p className="mt-2 text-center font-mono text-[10.5px] text-zinc-300 px-1 truncate">
            {pillar.imageCaption}
          </p>
        </div>

        {/* Stacked Comparisons */}
        <div className="mt-3.5 space-y-3">
          {/* Simple Bots Box */}
          <div className="rounded-2xl border border-rose-200/90 bg-rose-50/70 p-3.5 text-xs leading-relaxed">
            <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-rose-800">
              <span className="grid size-3.5 place-items-center rounded-full bg-rose-200 text-[9px]">✕</span>
              <span>What simple bots do</span>
            </div>
            <p className="mt-2 text-rose-950 font-normal leading-relaxed text-[12px]">
              {pillar.simpleBots.description}
            </p>
          </div>

          {/* Agentic Platform Box */}
          <div className="rounded-2xl border border-white/10 bg-[#0e0e0c] p-4 text-xs leading-relaxed text-zinc-100 shadow-sm">
            <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#d4ff3f]">
              <span className="grid size-3.5 place-items-center rounded-full bg-white/10 text-[9px]">✦</span>
              <span>What our Agentic Platform does</span>
            </div>
            <p className="mt-2 text-zinc-100 font-normal leading-relaxed text-[12px]">
              {pillar.agenticPlatform.summary}
            </p>

            {pillar.agenticPlatform.bullets && pillar.agenticPlatform.bullets.length > 0 && (
              <ul className="mt-3 space-y-1.5 border-t border-white/10 pt-2.5">
                {pillar.agenticPlatform.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2 text-zinc-300 text-[11.5px]">
                    <span className="text-[#d4ff3f] font-bold text-xs shrink-0">↳</span>
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-line pt-3.5 text-xs">
        <span className="font-mono text-muted text-[11px]">
          Pillar {pillar.number} • {pillar.tag}
        </span>
        <a
          href="#platform"
          className="inline-flex items-center gap-1 font-semibold text-cobalt hover:underline cursor-pointer text-xs"
        >
          <span>Live Demo</span>
          <span className="font-mono text-sm">→</span>
        </a>
      </div>
    </article>
  );
}

export function AgenticPillarsSection() {
  // View mode: "stream" (continuous marquee) | "carousel" (auto-slide carousel) | "grid" (static grid)
  const [viewMode, setViewMode] = useState<"stream" | "carousel" | "grid">("stream");
  const [selectedPillarId, setSelectedPillarId] = useState<string>("all");

  // Stream play/pause state
  const [isStreamPlaying, setIsStreamPlaying] = useState(true);

  // Carousel slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);
  const [carouselProgress, setCarouselProgress] = useState(0);

  // Auto-advance carousel slide every 7 seconds with progress bar
  useEffect(() => {
    if (viewMode !== "carousel" || !isCarouselPlaying) {
      setCarouselProgress(0);
      return;
    }

    const intervalTime = 7000;
    const stepTime = 70;
    const increment = (stepTime / intervalTime) * 100;

    const progressTimer = setInterval(() => {
      setCarouselProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % agenticPillars.length);
          return 0;
        }
        return prev + increment;
      });
    }, stepTime);

    return () => clearInterval(progressTimer);
  }, [viewMode, isCarouselPlaying, currentSlide]);

  const handlePrevSlide = () => {
    setCarouselProgress(0);
    setCurrentSlide((prev) => (prev - 1 + agenticPillars.length) % agenticPillars.length);
  };

  const handleNextSlide = () => {
    setCarouselProgress(0);
    setCurrentSlide((prev) => (prev + 1) % agenticPillars.length);
  };

  const handleJumpToSlide = (index: number) => {
    setCarouselProgress(0);
    setCurrentSlide(index);
    if (viewMode !== "carousel") {
      setViewMode("carousel");
    }
  };

  const filteredPillars =
    selectedPillarId === "all"
      ? agenticPillars
      : agenticPillars.filter((p) => p.id === selectedPillarId);

  // Triple set for seamless marquee loop
  const streamPillars = [...agenticPillars, ...agenticPillars, ...agenticPillars];

  return (
    <section
      id="pillars"
      className="relative overflow-hidden bg-paper-2/70 py-20 md:py-28 border-t border-line text-ink scroll-mt-24"
      aria-labelledby="pillars-title"
    >
      {/* Subtle Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 15%, rgba(129, 161, 11, 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="eyebrow text-cobalt font-semibold tracking-wider">
            THE 5 PILLARS OF AGENTIC VOICE
          </p>

          <h2
            id="pillars-title"
            className="display-lg mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            Architected for <span className="text-cobalt">outcomes</span>, not scripts.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base font-normal">
            Traditional voice bots follow rigid decision trees and break on surprises. Our Agentic Voice Platform deploys autonomous AI agents built on five foundational cognitive capabilities.
          </p>

          {/* Mode Switcher */}
          <div className="mt-8 inline-flex items-center rounded-full bg-paper border border-line p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("stream")}
              className={`rounded-full px-4 sm:px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                viewMode === "stream"
                  ? "bg-ink text-[#d4ff3f] shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
              aria-pressed={viewMode === "stream"}
            >
              <span>⇄</span>
              <span>Sliding Stream</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("carousel")}
              className={`rounded-full px-4 sm:px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                viewMode === "carousel"
                  ? "bg-ink text-[#d4ff3f] shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
              aria-pressed={viewMode === "carousel"}
            >
              <span>✦</span>
              <span>Slide Carousel</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-full px-4 sm:px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-ink text-[#d4ff3f] shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
              aria-pressed={viewMode === "grid"}
            >
              <span>⊞</span>
              <span>All 5 Grid</span>
            </button>
          </div>

          {/* Quick Pillar Jump Chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {agenticPillars.map((pillar, idx) => {
              const isActive =
                (viewMode === "carousel" && currentSlide === idx) ||
                (viewMode === "grid" && selectedPillarId === pillar.id);

              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => {
                    if (viewMode === "grid") {
                      setSelectedPillarId(selectedPillarId === pillar.id ? "all" : pillar.id);
                    } else {
                      handleJumpToSlide(idx);
                    }
                  }}
                  className={`chip ${isActive ? "is-active" : ""}`}
                  aria-pressed={isActive}
                >
                  <span className="font-mono text-xs font-semibold">{pillar.number}</span>
                  <span>{pillar.tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            VIEW 1: SLIDING STREAM (CONTINUOUS MARQUEE ANIMATION)
            ======================================================== */}
        {viewMode === "stream" && (
          <div className="mt-12 space-y-4">
            {/* Stream Container with edge gradient masks */}
            <div className="relative overflow-hidden reviews-stream-mask py-3">
              <div
                className="animate-pillars-marquee hover:[animation-play-state:paused] flex shrink-0 gap-6 py-2"
                style={{
                  animationPlayState: isStreamPlaying ? undefined : "paused",
                }}
              >
                {streamPillars.map((pillar, i) => (
                  <PillarStreamCard
                    key={`stream-${pillar.id}-${i}`}
                    pillar={pillar}
                    index={i % agenticPillars.length}
                  />
                ))}
              </div>
            </div>

            {/* Stream Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4 px-2 text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsStreamPlaying(!isStreamPlaying)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 font-mono text-[11px] font-semibold text-ink hover:border-ink cursor-pointer"
                >
                  <span>{isStreamPlaying ? "⏸ Pause Stream" : "▶ Resume Stream"}</span>
                </button>
                <span className="hidden sm:inline font-mono text-muted text-[11px]">
                  Hover over any pillar card to pause and inspect diagrams &amp; code
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-muted text-[11px]">
                  5 Illustrated Pillars in continuous motion
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode("carousel")}
                  className="font-semibold text-cobalt hover:underline cursor-pointer text-xs"
                >
                  Switch to Carousel →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 2: INTERACTIVE SLIDE CAROUSEL (EXPANDED ILLUSTRATION VIEW)
            ======================================================== */}
        {viewMode === "carousel" && (
          <div
            className="mt-12 mx-auto max-w-6xl"
            onMouseEnter={() => setIsCarouselPlaying(false)}
            onMouseLeave={() => setIsCarouselPlaying(true)}
          >
            {/* Carousel Container */}
            <div className="relative overflow-hidden rounded-3xl border border-line bg-paper shadow-md">
              {/* Sliding Track */}
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {agenticPillars.map((pillar) => (
                  <div
                    key={`slide-${pillar.id}`}
                    className="w-full shrink-0 p-6 sm:p-10 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between border-b border-line pb-4">
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 place-items-center rounded-xl bg-ink text-[#d4ff3f] font-mono text-xs font-bold shadow-sm">
                            {pillar.number}
                          </span>
                          <span className="font-mono text-xs font-bold tracking-wider uppercase text-cobalt">
                            Pillar {pillar.number} of 05
                          </span>
                        </div>
                        <span className="eyebrow text-muted text-[11px] font-semibold">
                          {pillar.tag}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-5 leading-snug">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-muted">
                        {pillar.subtitle}
                      </p>

                      {/* Side-by-Side: Comparisons (Left) & Architectural Diagram Illustration (Right) */}
                      <div className="mt-7 grid gap-6 lg:grid-cols-12 items-stretch">
                        {/* Left Column: Comparisons */}
                        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                          {/* What Simple Bots Do Box */}
                          <div className="rounded-2xl border border-rose-200/90 bg-rose-50/70 p-5 text-xs sm:text-[13px] leading-relaxed flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-rose-800">
                                <span className="grid size-4 place-items-center rounded-full bg-rose-200 text-[10px]">✕</span>
                                <span>What simple bots do</span>
                              </div>
                              <p className="mt-3 text-rose-950 font-normal leading-relaxed text-sm">
                                {pillar.simpleBots.description}
                              </p>
                            </div>
                            <span className="mt-4 inline-block font-mono text-[10px] uppercase font-bold text-rose-600/80">
                              Rigid • Scripted • Fragile
                            </span>
                          </div>

                          {/* What Our Agentic Platform Does Box */}
                          <div className="rounded-2xl border border-white/10 bg-[#0e0e0c] p-5 sm:p-6 text-xs sm:text-[13px] leading-relaxed text-zinc-100 shadow-md flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#d4ff3f]">
                                <span className="grid size-4 place-items-center rounded-full bg-white/10 text-[10px]">✦</span>
                                <span>What our Agentic Platform does</span>
                              </div>

                              <p className="mt-3 text-zinc-100 font-normal leading-relaxed text-sm">
                                {pillar.agenticPlatform.summary}
                              </p>

                              {pillar.agenticPlatform.bullets && pillar.agenticPlatform.bullets.length > 0 && (
                                <ul className="mt-3.5 space-y-2 border-t border-white/10 pt-3">
                                  {pillar.agenticPlatform.bullets.map((bullet, bIdx) => (
                                    <li key={bIdx} className="flex items-start gap-2 text-zinc-300 text-xs">
                                      <span className="text-[#d4ff3f] font-bold text-sm shrink-0">↳</span>
                                      <span className="leading-relaxed">{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Architectural Diagram Illustration */}
                        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#0e0e0c] p-4 sm:p-6 text-zinc-100 shadow-xl flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#d4ff3f] flex items-center gap-2">
                                <span className="size-2 rounded-full bg-[#d4ff3f] animate-pulse" />
                                Architecture Diagram
                              </span>
                              <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-zinc-300">
                                Pillar {pillar.number}
                              </span>
                            </div>

                            <div className="relative mt-4 w-full aspect-[16/10] bg-black/60 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                              <Image
                                src={pillar.image}
                                alt={pillar.imageAlt}
                                fill
                                sizes="(max-width: 1024px) 100vw, 550px"
                                className="object-contain p-2"
                                priority
                              />
                            </div>
                          </div>

                          <p className="mt-4 font-mono text-xs text-zinc-300 text-center border-t border-white/10 pt-3">
                            {pillar.imageCaption}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Slide Footer */}
                    <div className="mt-8 flex flex-wrap items-center justify-between border-t border-line pt-4 text-xs">
                      <span className="font-mono text-muted text-[11px]">
                        Autonomous Voice Architecture • Pillar {pillar.number} ({pillar.tag})
                      </span>
                      <a
                        href="#platform"
                        className="inline-flex items-center gap-1 font-semibold text-cobalt hover:underline cursor-pointer"
                      >
                        <span>Test this pillar in Live Demo</span>
                        <span className="font-mono text-sm">→</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Countdown Progress Bar for Auto-Slide */}
              <div className="h-1.5 w-full bg-line/60 overflow-hidden">
                <div
                  className="h-full bg-[#81a10b] transition-all duration-75"
                  style={{ width: `${carouselProgress}%` }}
                />
              </div>
            </div>

            {/* Carousel Navigation Toolbar */}
            <div className="mt-5 flex items-center justify-between">
              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrevSlide}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 font-display text-xs font-semibold text-ink shadow-xs hover:border-ink cursor-pointer"
                aria-label="Previous Pillar"
              >
                <span>←</span>
                <span>Previous Pillar</span>
              </button>

              {/* Slide Counter & Dots */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-ink">
                  {agenticPillars[currentSlide].number}
                </span>
                <span className="font-mono text-xs text-muted">/</span>
                <span className="font-mono text-xs text-muted">05</span>

                <div className="ml-2 flex items-center gap-1.5">
                  {agenticPillars.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleJumpToSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentSlide === idx ? "w-6 bg-ink" : "w-2 bg-line hover:bg-muted"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextSlide}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 font-display text-xs font-semibold text-ink shadow-xs hover:border-ink cursor-pointer"
                aria-label="Next Pillar"
              >
                <span>Next Pillar</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 3: STATIC GRID (ALL 5 PILLARS AT ONCE WITH DIAGRAMS)
            ======================================================== */}
        {viewMode === "grid" && (
          <div
            className={`mt-12 grid gap-6 ${
              selectedPillarId === "all"
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {filteredPillars.map((pillar) => {
              const isFullWidthAnchor = selectedPillarId === "all" && pillar.number === "05";

              return (
                <div
                  key={pillar.id}
                  className={`case-card flex flex-col justify-between rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-ink/40 hover:shadow-md ${
                    isFullWidthAnchor ? "lg:col-span-2" : ""
                  }`}
                >
                  <div>
                    {/* Top Header */}
                    <div className="flex items-center justify-between border-b border-line pb-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-xl bg-ink text-[#d4ff3f] font-mono text-xs font-bold shadow-sm">
                          {pillar.number}
                        </span>
                        <span className="font-mono text-xs font-bold tracking-wider uppercase text-cobalt">
                          Pillar {pillar.number}
                        </span>
                      </div>
                      <span className="eyebrow text-muted text-[11px]">
                        {pillar.tag}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-ink mt-4 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {pillar.subtitle}
                    </p>

                    {/* Architectural Diagram Box in Grid */}
                    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e0c] p-3 shadow-inner">
                      <div className="flex items-center justify-between pb-1.5 px-1 border-b border-white/10">
                        <span className="font-mono text-[10.5px] uppercase font-bold text-[#d4ff3f] flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-[#d4ff3f] animate-pulse" />
                          Architecture Diagram
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400">Pillar {pillar.number}</span>
                      </div>
                      <div
                        className={`relative mt-2 w-full bg-black/50 rounded-xl overflow-hidden flex items-center justify-center ${
                          isFullWidthAnchor ? "aspect-[16/8] max-h-[380px]" : "aspect-[16/9]"
                        }`}
                      >
                        <Image
                          src={pillar.image}
                          alt={pillar.imageAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 600px"
                          className="object-contain p-2"
                          loading="eager"
                        />
                      </div>
                      <p className="mt-2 text-center font-mono text-[11px] text-zinc-300">
                        {pillar.imageCaption}
                      </p>
                    </div>

                    {/* Comparisons */}
                    <div
                      className={`mt-5 ${
                        isFullWidthAnchor
                          ? "grid gap-4 md:grid-cols-12 items-stretch"
                          : "space-y-4"
                      }`}
                    >
                      {/* What Simple Bots Do Box */}
                      <div
                        className={`rounded-2xl border border-rose-200/80 bg-rose-50/60 p-5 text-xs sm:text-[13px] leading-relaxed flex flex-col justify-between ${
                          isFullWidthAnchor ? "md:col-span-5" : ""
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-rose-800">
                            <span className="grid size-4 place-items-center rounded-full bg-rose-200 text-[10px]">✕</span>
                            <span>What simple bots do</span>
                          </div>
                          <p className="mt-3 text-rose-950 font-normal leading-relaxed">
                            {pillar.simpleBots.description}
                          </p>
                        </div>
                        <span className="mt-4 inline-block font-mono text-[10px] uppercase font-bold text-rose-600/80">
                          Rigid • Fragile • Static
                        </span>
                      </div>

                      {/* What Our Agentic Platform Does Box */}
                      <div
                        className={`rounded-2xl border border-white/10 bg-[#0e0e0c] p-6 text-xs sm:text-[13.5px] leading-relaxed text-zinc-100 shadow-md ${
                          isFullWidthAnchor ? "md:col-span-7" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#d4ff3f]">
                          <span className="grid size-4 place-items-center rounded-full bg-white/10 text-[10px]">✦</span>
                          <span>What our Agentic Platform does</span>
                        </div>

                        <p className="mt-3 text-zinc-100 font-normal leading-relaxed">
                          {pillar.agenticPlatform.summary}
                        </p>

                        {pillar.agenticPlatform.bullets && pillar.agenticPlatform.bullets.length > 0 && (
                          <ul className="mt-4 space-y-2.5 border-t border-white/10 pt-3.5">
                            {pillar.agenticPlatform.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2.5 text-zinc-300">
                                <span className="text-[#d4ff3f] font-bold text-sm shrink-0">↳</span>
                                <span className="leading-relaxed">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs">
                    <span className="font-mono text-muted text-[11px]">
                      Autonomous Voice Architecture • Pillar {pillar.number}
                    </span>
                    <a
                      href="#platform"
                      className="inline-flex items-center gap-1 font-semibold text-cobalt hover:underline cursor-pointer"
                    >
                      <span>Test in Live Demo</span>
                      <span className="font-mono text-sm">→</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default AgenticPillarsSection;
