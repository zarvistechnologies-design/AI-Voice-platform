"use client";

import Link from "next/link";
import React from "react";

const insightArticles = [
  {
    category: "SPEECH ANALYTICS",
    date: "MAY 15, 2026",
    readTime: "8 MIN READ",
    title: "Customer Sentiment & Acoustic Emotion Analysis",
    excerpt: "Detect customer frustration, hesitation, and satisfaction directly from pitch and speech modulation before they hang up.",
    tone: "border-l-rose-500",
    badgeBgDark: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    badgeBgLight: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    category: "QUALITY AUDITING",
    date: "FEBRUARY 20, 2026",
    readTime: "6 MIN READ",
    title: "Automated Call Scorecards & Compliance Tracking",
    excerpt: "Evaluate 100% of calls instead of 2% manual sampling. Automate QA grading, script adherence, and regulatory compliance.",
    tone: "border-l-blue-500",
    badgeBgDark: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    badgeBgLight: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    category: "NATURAL LANGUAGE",
    date: "JANUARY 16, 2026",
    readTime: "5 MIN READ",
    title: "Real-Time Intent Detection & Smart Routing",
    excerpt: "How low-latency embedding pipelines identify caller purpose within the first 3 seconds of a conversation.",
    tone: "border-l-emerald-500",
    badgeBgDark: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    badgeBgLight: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    category: "CHURN PREVENTION",
    date: "JANUARY 12, 2026",
    readTime: "7 MIN READ",
    title: "Conversation Trends & Proactive Retention",
    excerpt: "Correlate customer complaints across regional dialects to predict churn patterns and auto-trigger retention workflows.",
    tone: "border-l-amber-500",
    badgeBgDark: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    badgeBgLight: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

interface NexStudioInsightsProps {
  theme?: "dark" | "light";
}

export function NexStudioInsights({ theme = "dark" }: NexStudioInsightsProps) {
  const isDark = theme !== "light";

  return (
    <section
      id="insights"
      className={`py-20 lg:py-28 transition-colors duration-300 border-t ${
        isDark ? "bg-transparent border-white/5" : "bg-white border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs nexstudio-mono uppercase tracking-widest text-[#FF5500] block mb-3 font-semibold">
              AI SPEECH INTELLIGENCE
            </span>
            <h2
              className={`text-4xl sm:text-5xl font-normal tracking-tight leading-tight ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Latest{" "}
              <span className={`nexstudio-italic-serif italic font-serif ${isDark ? "text-white" : "text-black"}`}>
                Voice AI
              </span>{" "}
              Insights.
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/resources/blog"
              className={`group px-6 py-3.5 flex items-center gap-2 text-xs nexstudio-mono font-medium tracking-wider rounded-full transition-all duration-300 ${
                isDark
                  ? "bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:border-white/30"
                  : "bg-white border border-gray-300 text-black hover:bg-gray-100 hover:border-black"
              }`}
            >
              <span>VIEW ALL ARTICLES</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Insights Grid: Featured Article + List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured Large Card (Left) */}
          <div
            className={`lg:col-span-5 text-white rounded-3xl p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden group shadow-2xl transition-all duration-300 ${
              isDark
                ? "bg-[#0b0b10] border border-white/10"
                : "bg-neutral-950 border border-neutral-900"
            }`}
          >
            {/* Ambient Lighting */}
            <div
              className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FF5500]/25 via-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full text-xs nexstudio-mono bg-[#FF5500] text-white uppercase tracking-wider font-semibold shadow-sm">
                  FEATURED RESEARCH
                </span>
                <span className="text-xs nexstudio-mono text-neutral-400">
                  MAY 15, 2026 • 10 MIN READ
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-normal text-white mb-4 leading-tight group-hover:text-amber-300 transition-colors">
                Understand What Your Customers Are Truly Saying.
              </h3>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8">
                Beyond speech-to-text: how acoustic intelligence, micro-pause detection, and tone sentiment tracking empower businesses to resolve inquiries before escalations occur.
              </p>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-white/10 text-white text-xs nexstudio-mono font-bold flex items-center justify-center">
                  VZ
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Vozon AI Research</p>
                  <p className="text-[11px] text-neutral-400">Speech Science Team</p>
                </div>
              </div>

              <Link
                href="/resources/blog"
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-[#FF5500] group-hover:text-white transition-all duration-300"
                aria-label="Read full article"
              >
                <span>↗</span>
              </Link>
            </div>
          </div>

          {/* List Cards (Right) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {insightArticles.map((art) => (
              <Link
                key={art.title}
                href="/resources/blog"
                className={`nexstudio-card flex flex-col justify-between group border-l-4 ${art.tone} transition-all duration-300 ${
                  isDark
                    ? "bg-[#0e0e14]/80 border-white/10 hover:border-[#FF5500]/50 hover:bg-[#12121a]"
                    : "bg-white border-gray-200 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] nexstudio-mono font-medium border ${
                        isDark ? art.badgeBgDark : art.badgeBgLight
                      }`}
                    >
                      {art.category}
                    </span>
                    <span className="text-[11px] nexstudio-mono text-neutral-400">
                      {art.readTime}
                    </span>
                  </div>

                  <h4
                    className={`text-lg font-normal mb-2.5 transition-colors leading-snug ${
                      isDark ? "text-white group-hover:text-[#FF5500]" : "text-black group-hover:text-[#FF5500]"
                    }`}
                  >
                    {art.title}
                  </h4>

                  <p className={`text-xs leading-relaxed mb-6 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                    {art.excerpt}
                  </p>
                </div>

                <div
                  className={`pt-4 border-t flex items-center justify-between text-xs nexstudio-mono ${
                    isDark ? "border-white/10 text-neutral-500" : "border-gray-100 text-gray-500"
                  }`}
                >
                  <span>{art.date}</span>
                  <span
                    className={`group-hover:translate-x-1 transition-transform font-semibold ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    READ ARTICLE →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NexStudioInsights;
