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
    <section id="comparison" aria-labelledby="comparison-title" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold mb-3">
            <span className="size-2 rounded-full bg-[#9F3DA8]" />
            Side-by-Side Architectural Contrast
          </span>
          <h2 id="comparison-title" className="zippee-title-underline text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1D1D1F] tracking-tight mt-2">
            Why traditional voice bots fail.
          </h2>
          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            Compare legacy IVR systems and basic speech wrappers with our enterprise autonomous agentic architecture.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { id: "all", label: "All Capabilities" },
              { id: "intelligence", label: "Reasoning & Context" },
              { id: "telephony", label: "Telephony & Latency" },
              { id: "workflow", label: "APIs & Execution" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`zippee-pill text-xs font-bold cursor-pointer ${
                  selectedCategory === cat.id ? "zippee-pill-active" : ""
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table for Desktop */}
        <div className="mt-12 hidden md:block zippee-card overflow-hidden shadow-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 font-mono text-xs uppercase tracking-wider text-gray-500">
                <th className="p-5 font-bold">Dimension</th>
                <th className="p-5 font-bold text-red-700">Legacy Voice Bot</th>
                <th className="p-5 font-bold text-[#9F3DA8] bg-[#FDF4FF]/80">Vozon Agentic Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="p-5 font-bold text-[#1D1D1F]">
                    <div>{row.capability}</div>
                    <span className="font-mono text-[11px] text-gray-400 font-normal">
                      {row.categoryLabel}
                    </span>
                  </td>
                  <td className="p-5 text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>{row.legacy}</span>
                    </div>
                  </td>
                  <td className="p-5 bg-[#FDF4FF]/50 font-semibold text-purple-950">
                    <div className="flex items-start gap-2">
                      <span className="text-[#9F3DA8] font-bold">✦</span>
                      <div>
                        <span>{row.vozon}</span>
                        {row.highlightBadge && (
                          <span className="ml-2 zippee-pill text-[10px] bg-purple-100 text-[#9F3DA8] border-purple-200">
                            {row.highlightBadge}
                          </span>
                        )}
                        {row.metricBadge && (
                          <span className="ml-2 zippee-pill text-[10px] bg-emerald-100 text-emerald-800 border-emerald-200">
                            {row.metricBadge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comparison Cards for Mobile */}
        <div className="mt-8 grid gap-4 md:hidden">
          {filteredData.map((row) => (
            <article key={row.id} className="zippee-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="font-bold text-sm text-[#1D1D1F]">{row.capability}</h3>
                <span className="text-[10px] font-mono text-gray-400">{row.categoryLabel}</span>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 text-xs text-red-900">
                <b className="block text-red-700 font-bold mb-1">✕ Legacy Bot</b>
                <p>{row.legacy}</p>
              </div>
              <div className="rounded-xl border border-purple-200 bg-[#FDF4FF] p-3 text-xs text-purple-950">
                <b className="block text-[#9F3DA8] font-bold mb-1">✦ Vozon Platform</b>
                <p>{row.vozon}</p>
                {row.highlightBadge && (
                  <span className="inline-block mt-2 zippee-pill text-[10px] bg-purple-100 text-[#9F3DA8]">
                    {row.highlightBadge}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArchitecturalComparisonSection;