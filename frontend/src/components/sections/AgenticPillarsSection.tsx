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
      description: 'If a customer says something off-script, the bot says: "Sorry, I didn\'t get that. Please choose from the menu."',
    },
    agenticPlatform: {
      label: "What our Agentic Platform does",
      summary: 'You give the agent a high-level objective (e.g., "Negotiate a payment plan within a 15% discount threshold while keeping customer goodwill"). The agent uses dynamic reasoning (ReAct / Chain-of-Thought) to figure out the fastest, most empathetic path to achieve that objective.',
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
      summary: "While conversing with the caller, the agent interacts with external systems in real-time:",
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
      description: "Stateless. If the customer calls back 5 minutes later, it starts from scratch.",
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
      description: "Crash or loop repeatedly when faced with contradictory information.",
    },
    agenticPlatform: {
      label: "What our Agentic Platform does",
      summary: "Detects ambiguity, asks clarifying questions, adjusts its internal plan, and recovers gracefully from API timeouts or incomplete user responses without breaking the conversation flow.",
    },
  },
  {
    id: "multi-agent-swarms",
    number: "05",
    tag: "Swarm Delegation",
    title: "Multi-Agent Orchestration & Swarm Delegation",
    subtitle: "Specialized cognitive agents working in unison",
    image: "/images/pillars/pillar-5-swarm-delegation.png",
    imageAlt: "Front triage agent handing off to specialist agent and returning without hanging up",
    imageCaption: "Zero dead-end transfers. Specialized agents collaborate mid-call.",
    simpleBots: {
      label: "What simple bots do",
      description: "One giant prompt trying to do everything, failing when complexity increases.",
    },
    agenticPlatform: {
      label: "What our Agentic Platform does",
      summary: "A Front-Desk Triage Agent delegates sub-tasks to specialized sub-agents (e.g., an EMI Negotiation Agent, a Multilingual Sentiment Analyzer, or a Technical Support Specialist) and reclaims the call seamlessly.",
    },
  },
];

interface PillarStreamCardProps {
  pillar: PillarItem;
  index: number;
}

function PillarStreamCard({ pillar, index }: PillarStreamCardProps) {
  return (
    <article className="zippee-card p-6 flex flex-col justify-between w-[380px] sm:w-[440px] shrink-0 bg-white border border-gray-200/80 shadow-md hover:shadow-xl hover:border-purple-300 transition-all">
      <div>
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-md bg-[#9F3DA8] text-white font-mono text-xs font-bold grid place-items-center">
              {pillar.number}
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-gray-500 font-semibold">
              Pillar {pillar.number}
            </span>
          </div>
          <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 text-[11px] font-bold">
            {pillar.tag}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="mt-4 text-lg font-bold text-[#1D1D1F] leading-snug">
          {pillar.title}
        </h3>
        <p className="mt-1 text-xs text-purple-700 font-medium">
          {pillar.subtitle}
        </p>

        {/* Architectural Diagram Illustration */}
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/70 p-3 overflow-hidden">
          <div className="flex items-center justify-between font-mono text-[11px] text-gray-400 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#9F3DA8]" />
              Architecture Map
            </span>
            <span>Pillar {pillar.number}</span>
          </div>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-white shadow-inner">
            <Image
              src={pillar.image}
              alt={pillar.imageAlt}
              fill
              className="object-contain p-2"
              sizes="(max-width: 640px) 320px, 480px"
              loading="eager"
            />
          </div>
          <p className="mt-2 text-[11px] text-gray-500 italic text-center">
            {pillar.imageCaption}
          </p>
        </div>

        {/* Stacked Comparisons */}
        <div className="mt-4 space-y-3">
          {/* Simple Bots Box */}
          <div className="rounded-xl border border-red-200/80 bg-red-50/50 p-3 text-xs text-red-950">
            <div className="flex items-center gap-1.5 font-bold text-red-700 mb-1">
              <span>✕</span>
              <span>What simple bots do</span>
            </div>
            <p className="text-[11px] text-red-900/80 leading-relaxed">
              {pillar.simpleBots.description}
            </p>
          </div>

          {/* Agentic Platform Box */}
          <div className="rounded-xl border border-purple-200/80 bg-[#FDF4FF] p-3 text-xs text-purple-950">
            <div className="flex items-center gap-1.5 font-bold text-[#9F3DA8] mb-1">
              <span>✦</span>
              <span>What our Agentic Platform does</span>
            </div>
            <p className="text-[11px] text-purple-900/90 leading-relaxed">
              {pillar.agenticPlatform.summary}
            </p>

            {pillar.agenticPlatform.bullets && pillar.agenticPlatform.bullets.length > 0 && (
              <ul className="mt-2 space-y-1 text-[11px] text-purple-900/80">
                {pillar.agenticPlatform.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-1.5">
                    <span className="text-[#9F3DA8] font-bold">↳</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-mono">
        <span className="text-gray-400">
          Pillar {pillar.number} • {pillar.tag}
        </span>
        <a href="#platform" className="inline-flex items-center gap-1 text-[#9F3DA8] font-bold hover:underline">
          <span>Live Demo</span>
          <span>→</span>
        </a>
      </div>
    </article>
  );
}

export function AgenticPillarsSection() {
  const [viewMode, setViewMode] = useState<"stream" | "carousel" | "grid">("stream");
  const [selectedPillarId, setSelectedPillarId] = useState<string>("all");
  const [isStreamPlaying, setIsStreamPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);
  const [carouselProgress, setCarouselProgress] = useState(0);

  // Auto-advance carousel slide every 7 seconds
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

  const streamPillars = [...agenticPillars, ...agenticPillars, ...agenticPillars];

  return (
    <section id="pillars" aria-labelledby="pillars-title" className="relative py-24 bg-white overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold mb-3">
            <span className="size-2 rounded-full bg-[#9F3DA8]" />
            THE 5 PILLARS OF AGENTIC VOICE
          </span>

          <h2 id="pillars-title" className="zippee-title-underline text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1D1D1F] tracking-tight mt-2">
            Architected for <span className="text-[#9F3DA8]">outcomes</span>, not scripts.
          </h2>

          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            Traditional voice bots follow rigid decision trees and break on surprises. Our Agentic Voice Platform deploys autonomous AI agents built on five foundational cognitive capabilities.
          </p>

          {/* Mode Switcher */}
          <div className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/90 p-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("stream")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "stream"
                  ? "bg-[#9F3DA8] text-white shadow-sm"
                  : "text-gray-700 hover:text-[#9F3DA8] hover:bg-white"
              }`}
              aria-pressed={viewMode === "stream"}
            >
              <span>⇄</span>
              <span>Sliding Stream</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("carousel")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "carousel"
                  ? "bg-[#9F3DA8] text-white shadow-sm"
                  : "text-gray-700 hover:text-[#9F3DA8] hover:bg-white"
              }`}
              aria-pressed={viewMode === "carousel"}
            >
              <span>✦</span>
              <span>Slide Carousel</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-[#9F3DA8] text-white shadow-sm"
                  : "text-gray-700 hover:text-[#9F3DA8] hover:bg-white"
              }`}
              aria-pressed={viewMode === "grid"}
            >
              <span>⊞</span>
              <span>All 5 Grid</span>
            </button>
          </div>

          {/* Quick Pillar Jump Chips */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
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
                  className={`zippee-pill cursor-pointer font-mono text-xs ${
                    isActive ? "zippee-pill-active" : ""
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="font-bold">{pillar.number}</span>
                  <span>{pillar.tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* VIEW 1: SLIDING STREAM */}
        {viewMode === "stream" && (
          <div className="mt-12">
            <div className="overflow-hidden w-full relative">
              <div
                className="animate-marquee gap-6 py-4"
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
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsStreamPlaying(!isStreamPlaying)}
                  className="zippee-pill cursor-pointer font-bold text-gray-700 hover:text-[#9F3DA8]"
                >
                  <span>{isStreamPlaying ? "⏸ Pause Stream" : "▶ Resume Stream"}</span>
                </button>
                <span>Hover over any pillar card to pause and inspect diagrams &amp; code</span>
              </div>

              <div className="flex items-center gap-4">
                <span>5 Illustrated Pillars in continuous motion</span>
                <button
                  type="button"
                  onClick={() => setViewMode("carousel")}
                  className="text-[#9F3DA8] font-bold hover:underline cursor-pointer"
                >
                  Switch to Carousel →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE SLIDE CAROUSEL */}
        {viewMode === "carousel" && (
          <div
            className="mt-12"
            onMouseEnter={() => setIsCarouselPlaying(false)}
            onMouseLeave={() => setIsCarouselPlaying(true)}
          >
            <div className="overflow-hidden rounded-3xl zippee-card p-6 sm:p-10">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {agenticPillars.map((pillar) => (
                  <div key={`slide-${pillar.id}`} className="w-full shrink-0">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-2">
                          <span className="size-8 rounded-lg bg-[#9F3DA8] text-white font-mono text-xs font-bold grid place-items-center">
                            {pillar.number}
                          </span>
                          <span className="font-mono text-xs font-bold text-gray-500 uppercase">
                            Pillar {pillar.number} of 05
                          </span>
                        </div>
                        <span className="zippee-pill bg-purple-50 text-purple-900 font-bold">
                          {pillar.tag}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F]">
                        {pillar.title}
                      </h3>
                      <p className="text-sm font-semibold text-purple-700">
                        {pillar.subtitle}
                      </p>

                      <div className="grid gap-8 lg:grid-cols-12 items-center">
                        <div className="lg:col-span-6 space-y-4">
                          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 text-xs text-red-950">
                            <div className="flex items-center gap-1.5 font-bold text-red-700 mb-1">
                              <span>✕</span>
                              <span>What simple bots do</span>
                            </div>
                            <p className="text-xs text-red-900 leading-relaxed">
                              {pillar.simpleBots.description}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-purple-200 bg-[#FDF4FF] p-4 text-xs text-purple-950">
                            <div className="flex items-center gap-1.5 font-bold text-[#9F3DA8] mb-1">
                              <span>✦</span>
                              <span>What our Agentic Platform does</span>
                            </div>
                            <p className="text-xs text-purple-900 leading-relaxed font-medium">
                              {pillar.agenticPlatform.summary}
                            </p>

                            {pillar.agenticPlatform.bullets && (
                              <ul className="mt-3 space-y-1.5 text-xs text-purple-900/90">
                                {pillar.agenticPlatform.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="flex items-start gap-1.5">
                                    <span className="text-[#9F3DA8] font-bold">↳</span>
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>

                        <div className="lg:col-span-6">
                          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-white shadow-sm">
                              <Image
                                src={pillar.image}
                                alt={pillar.imageAlt}
                                fill
                                className="object-contain p-3"
                                sizes="(max-width: 1024px) 100vw, 550px"
                                priority
                              />
                            </div>
                            <p className="mt-3 text-xs text-gray-500 italic text-center">
                              {pillar.imageCaption}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="size-9 rounded-full border border-gray-200 grid place-items-center text-gray-700 hover:border-[#9F3DA8] hover:text-[#9F3DA8] transition-colors cursor-pointer"
                    aria-label="Previous slide"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="size-9 rounded-full border border-gray-200 grid place-items-center text-gray-700 hover:border-[#9F3DA8] hover:text-[#9F3DA8] transition-colors cursor-pointer"
                    aria-label="Next slide"
                  >
                    →
                  </button>
                  <span className="font-mono text-xs text-gray-500 ml-2">
                    {currentSlide + 1} / {agenticPillars.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#9F3DA8] transition-all duration-75"
                    style={{ width: `${carouselProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ALL 5 GRID */}
        {viewMode === "grid" && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPillars.map((pillar, idx) => (
              <PillarStreamCard key={pillar.id} pillar={pillar} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AgenticPillarsSection;