"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const caseStudies = [
  {
    category: "BANKING & FINANCE",
    title: "Automated EMI Reminders & Payment Assistance",
    desc: "How a leading NBFC increased debt collection recovery rates by 42% while lowering operational call center costs with conversational Hindi & Hinglish agents.",
    stats: "42% Recovery Lift",
    subStat: "12,000+ Calls/Day",
    image: "/images/1.png",
  },
  {
    category: "HEALTHCARE & CLINICS",
    title: "24/7 Multilingual Patient Receptionist",
    desc: "Connecting hospitals with patients across 8 regional Indic languages to handle appointment bookings, doctor availability inquiries, and post-discharge follow-ups.",
    stats: "88% First-Call Resolution",
    subStat: "<2s Response Time",
    image: "/images/2.png",
  },
  {
    category: "HOSPITALITY & TRAVEL",
    title: "Autonomous Front-Desk & Booking Desk",
    desc: "Enabling premium hotel chains to manage peak-season guest reservation inquiries, dining bookings, and concierge services with human-level conversational warmth.",
    stats: "3.4x Booking Speed",
    subStat: "Zero Missed Calls",
    image: "/images/3.png",
  },
  {
    category: "B2B COMMERCE & SAAS",
    title: "High-Intent Outbound Lead Qualification",
    desc: "Syncing Google Sheets with inbound web leads to trigger instantaneous outbound qualification phone calls within 60 seconds of form submission.",
    stats: "68% Meeting Conversion",
    subStat: "60s Instant Callback",
    image: "/images/5.png",
  },
];

interface NexStudioPortfolioProps {
  theme?: "dark" | "light";
}

export function NexStudioPortfolio({ theme = "dark" }: NexStudioPortfolioProps) {
  const [activeTab, setActiveTab] = useState(0);
  const activeCase = caseStudies[activeTab];
  const isDark = theme !== "light";

  return (
    <section
      id="cases"
      className={`py-20 lg:py-28 transition-colors duration-300 border-t ${
        isDark ? "bg-transparent border-white/5" : "bg-white border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs nexstudio-mono uppercase tracking-widest text-[#FF5500] block mb-3 font-semibold">
              SELECTED DEPLOYMENTS
            </span>
            <h2
              className={`text-4xl sm:text-5xl font-normal tracking-tight leading-tight ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Real Impact.{" "}
              <span className={`nexstudio-italic-serif italic font-serif ${isDark ? "text-white" : "text-black"}`}>
                Verified
              </span>{" "}
              Results.
            </h2>
          </div>
          <p className={`text-sm max-w-md -tracking-[0.2px] leading-relaxed ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
            See how enterprise organizations transform phone interactions into revenue with Vozon Voice AI.
          </p>
        </div>

        {/* Industry Case Study Tabs */}
        <div
          className={`flex flex-wrap gap-2 mb-10 pb-4 border-b ${
            isDark ? "border-white/10" : "border-gray-100"
          }`}
        >
          {caseStudies.map((item, idx) => (
            <button
              key={item.category}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-full text-xs nexstudio-mono uppercase tracking-wider transition-all duration-200 ${
                activeTab === idx
                  ? isDark
                    ? "bg-white text-black font-semibold shadow"
                    : "bg-black text-white font-semibold"
                  : isDark
                  ? "bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.category}
            </button>
          ))}
        </div>

        {/* Featured Case Card */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl p-6 sm:p-12 transition-all duration-300 ${
            isDark
              ? "bg-[#0e0e14]/80 border border-white/10 text-white backdrop-blur-xl shadow-2xl"
              : "bg-gray-50/70 border border-gray-200/80 text-black shadow-sm"
          }`}
        >
          {/* Left Details */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span
                className={`inline-block px-3 py-1 rounded text-xs nexstudio-mono uppercase tracking-wider mb-6 ${
                  isDark ? "bg-white/10 text-neutral-300 border border-white/10" : "bg-black text-white"
                }`}
              >
                CASE STUDY
              </span>
              <h3 className={`text-2xl sm:text-4xl font-normal mb-4 leading-tight ${isDark ? "text-white" : "text-black"}`}>
                {activeCase.title}
              </h3>
              <p className={`text-base leading-relaxed mb-8 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                {activeCase.desc}
              </p>
            </div>

            {/* Impact Highlights */}
            <div
              className={`grid grid-cols-2 gap-6 pt-6 border-t mb-8 ${
                isDark ? "border-white/10" : "border-gray-200"
              }`}
            >
              <div>
                <p className={`text-2xl sm:text-3xl font-medium tracking-tight ${isDark ? "text-white" : "text-black"}`}>
                  {activeCase.stats}
                </p>
                <p className={`text-xs nexstudio-mono uppercase tracking-wider mt-1 ${isDark ? "text-neutral-500" : "text-gray-500"}`}>
                  Core Metric Lift
                </p>
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-medium tracking-tight ${isDark ? "text-white" : "text-black"}`}>
                  {activeCase.subStat}
                </p>
                <p className={`text-xs nexstudio-mono uppercase tracking-wider mt-1 ${isDark ? "text-neutral-500" : "text-gray-500"}`}>
                  Operational Scale
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className={`inline-flex items-center gap-2 text-xs nexstudio-mono uppercase font-semibold transition-colors ${
                isDark ? "text-white hover:text-[#FF5500]" : "text-black hover:text-[#FF5500]"
              }`}
            >
              <span>DISCUSS YOUR INDUSTRY USE CASE</span>
              <span>→</span>
            </Link>
          </div>

          {/* Right Image Artwork */}
          <div
            className={`lg:col-span-6 relative aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ${
              isDark ? "border border-white/10" : "border border-gray-200"
            }`}
          >
            <Image
              src={activeCase.image}
              alt={activeCase.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default NexStudioPortfolio;
