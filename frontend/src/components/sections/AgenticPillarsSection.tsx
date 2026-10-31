"use client";

import React, { useState } from "react";

interface PillarItem {
  id: string;
  number: string;
  tag: string;
  title: string;
  subtitle: string;
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

export function AgenticPillarsSection() {
  const [selectedPillarId, setSelectedPillarId] = useState<string>("all");

  const filteredPillars =
    selectedPillarId === "all"
      ? agenticPillars
      : agenticPillars.filter((p) => p.id === selectedPillarId);

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

          {/* Interactive Filter Chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedPillarId("all")}
              className={`chip ${selectedPillarId === "all" ? "is-active" : ""}`}
              aria-pressed={selectedPillarId === "all"}
            >
              <span>All 5 Pillars</span>
              <span className="count">05</span>
            </button>
            {agenticPillars.map((pillar) => (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`chip ${selectedPillarId === pillar.id ? "is-active" : ""}`}
                aria-pressed={selectedPillarId === pillar.id}
              >
                <span className="font-mono text-xs font-semibold">{pillar.number}</span>
                <span>{pillar.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pillars Cards Grid */}
        <div
          className={`mt-14 grid gap-6 ${
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
                  {/* Top Header: Number Badge & Tag */}
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

                  {/* Comparisons: Side-by-Side if anchor card, Stacked otherwise */}
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

                {/* Bottom Card Footer */}
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
      </div>
    </section>
  );
}

export default AgenticPillarsSection;
