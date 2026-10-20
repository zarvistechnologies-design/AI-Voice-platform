"use client";

import Link from "next/link";
import React from "react";

const services = [
  {
    num: "01",
    tag: "AGENT STUDIO",
    title: "Persona Engineering & Vector RAG",
    desc: "We configure domain-specific voice agents that pull directly from your knowledge base (PDFs, docs, and CRM). Agents understand caller context, handle interruptions, and execute warm call transfers to human managers.",
    features: ["Custom System Prompts", "Document Vector RAG", "Smart Live Handoff"],
    link: "/services/voice-agents",
  },
  {
    num: "02",
    tag: "MULTILINGUAL ENGINE",
    title: "Native Indic & 76 Global Languages",
    desc: "Powered by Sarvam Bulbul and Indic-tuned frontier speech models. Your agents understand colloquial phrasing, native regional pronunciation, and switch effortlessly between Hindi and English mid-sentence.",
    features: ["Hinglish Fluency", "22+ Indic Regional Accents", "24kHz Ultra-HD Synthesis"],
    link: "/services/multilingual-speech",
  },
  {
    num: "03",
    tag: "1-CLICK AUTOMATION",
    title: "Google Sheets Outbound Campaigns",
    desc: "No developers required: simply connect a Google Sheet to launch automated outbound phone campaigns. Vozon respects TRAI calling windows, qualifies leads, logs outcomes, and updates CRM records in real-time.",
    features: ["Google Sheets Auto-Sync", "TRAI Calling Window Guard", "Bi-directional Webhooks"],
    link: "/services/team-workflows",
  },
  {
    num: "04",
    tag: "DEVELOPER INFRASTRUCTURE",
    title: "MCP Server & BYOT Telephony",
    desc: "Connect your voice agents directly to Claude, Cursor, and enterprise backends through India's first Voice AI Model Context Protocol (MCP) server. Built on LiveKit WebRTC with support for Exotel, Airtel, and Tata SIP.",
    features: ["Model Context Protocol (MCP)", "WebRTC Browser Widget", "Direct Carrier BYOT"],
    link: "/docs/api",
  },
];

interface NexStudioServicesProps {
  theme?: "dark" | "light";
}

export function NexStudioServices({ theme = "dark" }: NexStudioServicesProps) {
  const isDark = theme !== "light";

  return (
    <section
      id="services"
      className={`py-20 lg:py-28 transition-colors duration-300 border-t ${
        isDark ? "bg-transparent border-white/5" : "bg-gray-50/60 border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs nexstudio-mono uppercase tracking-widest text-[#FF5500] block mb-3 font-semibold">
              OUR EXPERTISE, YOUR GROWTH.
            </span>
            <h2
              className={`text-4xl sm:text-5xl font-normal tracking-tight leading-tight ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Comprehensive{" "}
              <span className={`nexstudio-italic-serif italic font-serif ${isDark ? "text-white" : "text-black"}`}>
                Voice AI
              </span>{" "}
              Solutions.
            </h2>
          </div>
          <p className={`text-sm max-w-md -tracking-[0.2px] leading-relaxed ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
            Everything your business needs to transition from manual call centers to automated, hyper-realistic voice workflows.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((item) => (
            <div
              key={item.num}
              className={`nexstudio-card flex flex-col justify-between group transition-all duration-300 ${
                isDark
                  ? "bg-[#0e0e14]/80 border-white/10 hover:border-[#FF5500]/50 hover:bg-[#12121a]"
                  : "bg-white border-gray-200 hover:border-black/20"
              }`}
            >
              <div>
                <div
                  className={`flex items-center justify-between pb-6 border-b mb-6 ${
                    isDark ? "border-white/10" : "border-gray-100"
                  }`}
                >
                  <span className={`text-xs nexstudio-mono uppercase tracking-wider ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
                    {item.tag}
                  </span>
                  <span
                    className={`text-sm nexstudio-mono font-bold transition-colors ${
                      isDark ? "text-neutral-500 group-hover:text-white" : "text-gray-400 group-hover:text-black"
                    }`}
                  >
                    ({item.num})
                  </span>
                </div>

                <h3
                  className={`text-2xl font-normal mb-3 transition-colors ${
                    isDark ? "text-white group-hover:text-[#FF5500]" : "text-black group-hover:text-[#FF5500]"
                  }`}
                >
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                  {item.desc}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {item.features.map((feat) => (
                    <span
                      key={feat}
                      className={`px-2.5 py-1 rounded-md text-xs nexstudio-mono ${
                        isDark ? "bg-white/5 border border-white/10 text-neutral-300" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Link CTA */}
              <Link
                href={item.link}
                className={`inline-flex items-center gap-2 text-xs nexstudio-mono uppercase font-semibold group-hover:translate-x-1 transition-transform ${
                  isDark ? "text-white hover:text-[#FF5500]" : "text-black hover:text-[#FF5500]"
                }`}
              >
                <span>EXPLORE CAPABILITIES</span>
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NexStudioServices;
