"use client";

import React, { useState } from "react";

export interface ComparisonRow {
  id: string;
  capability: string;
  category: "all" | "intelligence" | "telephony" | "workflow";
  categoryLabel: string;
  legacy: string;
  vozon: string;
  highlightBadge?: string;
  metricBadge?: string;
}

export const comparisonData: ComparisonRow[] = [
  {
    id: "operational-model",
    capability: "Operational Model",
    category: "intelligence",
    categoryLabel: "Reasoning & Logic",
    legacy: "Static decision trees & keyword matching",
    vozon: "Autonomous Goal-Oriented Reasoning",
    highlightBadge: "ReAct & Cognitive Planning",
  },
  {
    id: "action-capability",
    capability: "Action Capability",
    category: "workflow",
    categoryLabel: "Execution & APIs",
    legacy: "Read-only FAQs",
    vozon: "Read/Write Execution via Live Tool Calling",
    highlightBadge: "Mid-Sentence Tool Calling",
  },
  {
    id: "adaptability",
    capability: "Adaptability",
    category: "intelligence",
    categoryLabel: "Context & Objections",
    legacy: "Breaches immediately on non-linear questions",
    vozon: "Adapts strategy dynamically to caller tone & objections",
    highlightBadge: "Dynamic Resilience",
  },
  {
    id: "telephony-integration",
    capability: "Telephony Integration",
    category: "telephony",
    categoryLabel: "SIP & Infrastructure",
    legacy: "Proprietary locked cloud numbers",
    vozon: "Enterprise Custom SIP (BYOC) & Carrier Agnostic",
    highlightBadge: "Zero Lock-in (BYOC)",
  },
  {
    id: "conversational-latency",
    capability: "Conversational Latency",
    category: "telephony",
    categoryLabel: "Speed & Real-Time Reflexes",
    legacy: "2,000ms – 4,000ms (Awkward pauses)",
    vozon: "<500ms Human Reflex Response Time",
    metricBadge: "4x–8x Faster Response",
  },
  {
    id: "interruption-handling",
    capability: "Interruption Handling",
    category: "telephony",
    categoryLabel: "Barge-in & Acoustics",
    legacy: "Deaf while talking (talks over the caller)",
    vozon: "Intelligent Acoustic VAD & Natural Barge-In",
    highlightBadge: "True Fluid Duplex",
  },
  {
    id: "post-call-processing",
    capability: "Post-Call Processing",
    category: "workflow",
    categoryLabel: "CRM & Data Pipeline",
    legacy: "Raw recording audio file",
    vozon: "Autonomous Structured Data Extraction & CRM Sync",
    highlightBadge: "Zero-Touch CRM Sync",
  },
];

export function ArchitecturalComparisonSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredData =
    selectedCategory === "all"
      ? comparisonData
      : comparisonData.filter((item) => item.category === selectedCategory);

  return (
    <section
      id="comparison"
      className="relative overflow-hidden bg-paper-2/90 py-20 md:py-28 border-t border-line text-ink scroll-mt-24"
      aria-labelledby="comparison-title"
    >
      {/* Subtle Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          background:
            "radial-gradient(ellipse at 50% 10%, rgba(129, 161, 11, 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="eyebrow text-cobalt font-semibold tracking-wider uppercase">
            Direct Architectural Comparison Table
          </p>

          <h2
            id="comparison-title"
            className="display-lg mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            Built for <span className="text-cobalt">outcomes</span>, not dead ends.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base font-normal">
            Put this comparison table on your website to instantly establish authority over competitors. See how legacy conversational IVRs compare against Vozon&apos;s autonomous AI voice platform across critical production dimensions.
          </p>

          {/* Category Filter Chips */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`chip ${selectedCategory === "all" ? "is-active" : ""}`}
              aria-pressed={selectedCategory === "all"}
            >
              <span>All 7 Capabilities</span>
              <span className="count">07</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("intelligence")}
              className={`chip ${selectedCategory === "intelligence" ? "is-active" : ""}`}
              aria-pressed={selectedCategory === "intelligence"}
            >
              <span>Reasoning &amp; Adaptability</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("telephony")}
              className={`chip ${selectedCategory === "telephony" ? "is-active" : ""}`}
              aria-pressed={selectedCategory === "telephony"}
            >
              <span>Telephony &amp; Latency</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("workflow")}
              className={`chip ${selectedCategory === "workflow" ? "is-active" : ""}`}
              aria-pressed={selectedCategory === "workflow"}
            >
              <span>Tool Execution &amp; CRM</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            DESKTOP COMPARISON TABLE (MD & LG SCREENS)
            ======================================================== */}
        <div className="mt-12 hidden md:block overflow-hidden rounded-3xl border border-line bg-paper shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-paper-2/60">
                <th
                  scope="col"
                  className="w-[28%] py-5 px-6 font-mono text-xs font-bold uppercase tracking-wider text-muted"
                >
                  Capability / Dimension
                </th>
                <th
                  scope="col"
                  className="w-[36%] py-5 px-6 font-mono text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50/50 border-x border-line"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid size-4 place-items-center rounded-full bg-rose-200 text-rose-800 text-[10px]">
                      ✕
                    </span>
                    <span>Legacy Conversational IVR / Simple Bot</span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="w-[36%] py-5 px-6 font-mono text-xs font-bold uppercase tracking-wider text-[#d4ff3f] bg-[#0e0e0c]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid size-4 place-items-center rounded-full bg-white/10 text-[#d4ff3f] text-[10px]">
                        ✦
                      </span>
                      <span>Vozon Agentic AI Voice Platform</span>
                    </div>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#d4ff3f]">
                      ENTERPRISE READY
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredData.map((row) => (
                <tr
                  key={row.id}
                  className="group transition-colors duration-150 hover:bg-paper-2/40"
                >
                  {/* Column 1: Capability */}
                  <td className="py-5 px-6 align-middle">
                    <div className="flex flex-col">
                      <span className="font-display text-sm lg:text-base font-bold text-ink">
                        {row.capability}
                      </span>
                      <span className="font-mono text-[11px] text-muted mt-0.5">
                        {row.categoryLabel}
                      </span>
                    </div>
                  </td>

                  {/* Column 2: Legacy Bot */}
                  <td className="py-5 px-6 align-middle bg-rose-50/20 border-x border-line text-xs lg:text-[13.5px] leading-relaxed text-rose-950 font-normal">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-rose-500 font-bold text-sm shrink-0">
                        ✕
                      </span>
                      <span>{row.legacy}</span>
                    </div>
                  </td>

                  {/* Column 3: Vozon Agentic Platform */}
                  <td className="py-5 px-6 align-middle bg-[#0e0e0c]/[0.02] group-hover:bg-[#0e0e0c]/[0.04] transition-colors">
                    <div className="rounded-2xl border border-white/10 bg-[#0e0e0c] p-4 text-xs lg:text-[13.5px] leading-relaxed text-zinc-100 shadow-sm flex flex-col justify-between">
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 text-[#d4ff3f] font-bold text-sm shrink-0">
                          ✦
                        </span>
                        <span className="font-medium text-white">
                          {row.vozon}
                        </span>
                      </div>

                      {(row.highlightBadge || row.metricBadge) && (
                        <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-white/10">
                          {row.highlightBadge && (
                            <span className="inline-block rounded-md bg-white/10 px-2 py-0.5 font-mono text-[10.5px] font-semibold text-[#d4ff3f]">
                              {row.highlightBadge}
                            </span>
                          )}
                          {row.metricBadge && (
                            <span className="inline-block rounded-md bg-emerald-500/20 px-2 py-0.5 font-mono text-[10.5px] font-semibold text-emerald-400">
                              {row.metricBadge}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ========================================================
            MOBILE COMPARISON CARDS (SM & XS SCREENS)
            ======================================================== */}
        <div className="mt-10 space-y-5 md:hidden">
          {filteredData.map((row, idx) => (
            <article
              key={row.id}
              className="rounded-3xl border border-line bg-paper p-5 sm:p-6 shadow-sm flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-lg bg-ink text-[#d4ff3f] font-mono text-xs font-bold">
                    0{idx + 1}
                  </span>
                  <h3 className="font-display text-base font-bold text-ink">
                    {row.capability}
                  </h3>
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-muted">
                  {row.categoryLabel}
                </span>
              </div>

              {/* Comparisons Stack */}
              <div className="mt-4 space-y-3">
                {/* Legacy simple bot box */}
                <div className="rounded-2xl border border-rose-200/90 bg-rose-50/70 p-4 text-xs leading-relaxed text-rose-950">
                  <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-rose-800">
                    <span className="grid size-3.5 place-items-center rounded-full bg-rose-200 text-[9px]">
                      ✕
                    </span>
                    <span>Legacy Simple Bot / IVR</span>
                  </div>
                  <p className="mt-2 text-rose-950 font-normal leading-relaxed text-[12.5px]">
                    {row.legacy}
                  </p>
                </div>

                {/* Vozon Agentic platform box */}
                <div className="rounded-2xl border border-white/10 bg-[#0e0e0c] p-4 text-xs leading-relaxed text-zinc-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#d4ff3f]">
                      <span className="grid size-3.5 place-items-center rounded-full bg-white/10 text-[9px]">
                        ✦
                      </span>
                      <span>Vozon Agentic Platform</span>
                    </div>
                    {row.metricBadge && (
                      <span className="font-mono text-[10px] text-emerald-400 font-bold">
                        {row.metricBadge}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-white font-medium leading-relaxed text-[13px]">
                    {row.vozon}
                  </p>

                  {row.highlightBadge && (
                    <div className="mt-2.5 pt-2 border-t border-white/10">
                      <span className="inline-block rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#d4ff3f]">
                        {row.highlightBadge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Section Bottom Action Banner */}
        <div className="mt-12 rounded-3xl border border-line bg-paper p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display text-lg sm:text-xl font-bold text-ink">
              Ready to replace rigid decision trees with autonomous agents?
            </h4>
            <p className="font-mono text-xs text-muted">
              Deploy your custom voice agent across your existing SIP trunks or web applications in minutes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#platform"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-display text-xs font-semibold text-[#d4ff3f] shadow-sm hover:bg-ink/90 cursor-pointer"
            >
              <span>Test Live Voice Call</span>
              <span className="font-mono text-sm">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArchitecturalComparisonSection;
