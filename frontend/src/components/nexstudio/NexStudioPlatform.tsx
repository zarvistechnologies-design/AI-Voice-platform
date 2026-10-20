"use client";

import Link from "next/link";
import React from "react";
import { AttractiveFaqSection } from "@/components/sections/AttractiveFaqSection";

const steps = [
  {
    number: "01",
    subtitle: "AGENT STUDIO",
    title: "Configure agent persona & knowledge",
    copy: "Define custom system prompts, sync PDF documentation, product manuals, and establish intelligent human-operator transfer rules.",
  },
  {
    number: "02",
    subtitle: "INTELLIGENCE STACK",
    title: "Select low-latency frontier models",
    copy: "Run on OpenAI GPT-4o Realtime, Google Gemini 2.0 Flash, or Sarvam Indic LLM for sub-300ms speech response times.",
  },
  {
    number: "03",
    subtitle: "MULTILINGUAL SPEECH",
    title: "Pick authentic voices & languages",
    copy: "Hyper-realistic voice synthesis across English, 22+ Indic languages and 76 global languages powered by Sarvam Bulbul and ElevenLabs.",
  },
  {
    number: "04",
    subtitle: "OMNICHANNEL TELEPHONY",
    title: "Deploy on phone numbers & web widget",
    copy: "Connect virtual DID numbers, run high-volume outbound dialer campaigns from Google Sheets, or embed the LiveKit WebRTC browser widget.",
  },
];

interface NexStudioPlatformProps {
  theme?: "dark" | "light";
}

export function NexStudioPlatform({ theme = "dark" }: NexStudioPlatformProps) {
  const isDark = theme !== "light";

  return (
    <section
      id="platform"
      className={`py-20 lg:py-28 transition-colors duration-300 border-t ${
        isDark ? "bg-transparent border-white/5" : "bg-white border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs nexstudio-mono uppercase tracking-widest text-[#FF5500] block mb-3 font-semibold">
              PLATFORM ARCHITECTURE
            </span>
            <h2
              className={`text-4xl sm:text-5xl font-normal tracking-tight leading-tight ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Go Live in{" "}
              <span className={`nexstudio-italic-serif italic font-serif ${isDark ? "text-white" : "text-black"}`}>
                Four
              </span>{" "}
              Clear Steps.
            </h2>
          </div>
          <Link
            href="/docs"
            className={`inline-flex items-center gap-2 text-xs nexstudio-mono uppercase font-semibold transition-colors ${
              isDark ? "text-white hover:text-[#FF5500]" : "text-black hover:text-[#FF5500]"
            }`}
          >
            <span>EXPLORE DEVELOPER DOCS</span>
            <span>→</span>
          </Link>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((st) => (
            <div
              key={st.number}
              className={`nexstudio-card flex flex-col justify-between group transition-all duration-300 ${
                isDark
                  ? "bg-[#0e0e14]/80 border-white/10 hover:border-[#FF5500]/50 hover:bg-[#12121a]"
                  : "bg-white border-gray-200 hover:border-black/30"
              }`}
            >
              <div>
                <div
                  className={`flex items-center justify-between pb-4 border-b mb-6 ${
                    isDark ? "border-white/10" : "border-gray-100"
                  }`}
                >
                  <span className={`text-xs nexstudio-mono uppercase tracking-wider ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
                    {st.subtitle}
                  </span>
                  <span
                    className={`text-xl nexstudio-mono font-bold transition-colors ${
                      isDark ? "text-neutral-600 group-hover:text-white" : "text-gray-300 group-hover:text-black"
                    }`}
                  >
                    {st.number}
                  </span>
                </div>
                <h3 className={`text-xl font-normal mb-3 leading-snug ${isDark ? "text-white" : "text-black"}`}>
                  {st.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                  {st.copy}
                </p>
              </div>

              <div
                className={`pt-6 border-t mt-6 flex items-center gap-2 text-xs nexstudio-mono ${
                  isDark ? "border-white/10 text-neutral-400" : "border-gray-100 text-gray-400"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>STEP READY</span>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Compliance Banner */}
        <div
          className={`rounded-3xl p-8 sm:p-12 mb-20 transition-all duration-300 ${
            isDark
              ? "bg-[#0e0e14]/80 border border-white/10 text-white backdrop-blur-xl shadow-2xl"
              : "bg-gray-50 border border-gray-200/80 text-black shadow-sm"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs nexstudio-mono uppercase tracking-widest text-[#FF5500] block mb-2 font-semibold">
                SECURITY &amp; COMPLIANCE
              </span>
              <h3 className={`text-2xl sm:text-3xl font-normal mb-3 ${isDark ? "text-white" : "text-black"}`}>
                Built for Enterprise Telecom Reliability
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                Bank-grade TLS 1.3 audio encryption, DLT registration compliance, TRAI calling window adherence, and zero data retention models for regulated industries.
              </p>
            </div>

            {/* Certifications Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                className={`rounded-2xl p-4 text-center transition-all ${
                  isDark
                    ? "bg-white/5 border border-white/10 text-white"
                    : "bg-white border border-gray-200 text-black"
                }`}
              >
                <span className="block text-xl font-bold mb-1">ISO</span>
                <span className={`text-[11px] nexstudio-mono uppercase ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
                  27001 Certified
                </span>
              </div>
              <div
                className={`rounded-2xl p-4 text-center transition-all ${
                  isDark
                    ? "bg-white/5 border border-white/10 text-white"
                    : "bg-white border border-gray-200 text-black"
                }`}
              >
                <span className="block text-xl font-bold mb-1">HIPAA</span>
                <span className={`text-[11px] nexstudio-mono uppercase ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
                  Compliant
                </span>
              </div>
              <div
                className={`rounded-2xl p-4 text-center transition-all ${
                  isDark
                    ? "bg-white/5 border border-white/10 text-white"
                    : "bg-white border border-gray-200 text-black"
                }`}
              >
                <span className="block text-xl font-bold mb-1">GDPR</span>
                <span className={`text-[11px] nexstudio-mono uppercase ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
                  Ready
                </span>
              </div>
              <div
                className={`rounded-2xl p-4 text-center transition-all ${
                  isDark
                    ? "bg-white/5 border border-white/10 text-white"
                    : "bg-white border border-gray-200 text-black"
                }`}
              >
                <span className="block text-xl font-bold mb-1">SOC 2</span>
                <span className={`text-[11px] nexstudio-mono uppercase ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
                  Type II
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive FAQ */}
        <AttractiveFaqSection />
      </div>
    </section>
  );
}

export default NexStudioPlatform;
