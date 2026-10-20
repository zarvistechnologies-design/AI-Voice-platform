"use client";

import React from "react";

interface NexStudioStatsProps {
  theme?: "dark" | "light";
}

export function NexStudioStats({ theme = "dark" }: NexStudioStatsProps) {
  const isDark = theme !== "light";

  return (
    <section className={`py-20 lg:py-28 transition-colors duration-300 ${isDark ? "bg-transparent" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="nexstudio-dark-banner relative overflow-hidden">
          {/* Subtle Ambient Background Flare */}
          <div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#FF5500]/20 to-transparent rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Value Narrative */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <span className="text-xs nexstudio-mono uppercase tracking-widest text-emerald-400">
                PROVEN SCALE &amp; IMPACT
              </span>
              <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
                Everyday Calls. <span className="nexstudio-italic-serif italic font-serif">Extraordinary</span> Outcomes.
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mt-2">
                We combine frontier conversational AI models with robust Indian telephony infrastructure to ensure your callers never hear robotic lag, awkward silences, or dropped connections.
              </p>
            </div>

            {/* Right: 4 High-Impact Numbers */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-8 sm:gap-12">
              <div className="border-l border-white/10 pl-6">
                <h3 className="text-4xl sm:text-5xl font-normal text-white mb-2 tracking-tight">
                  1 Lakh<span className="text-[#FF5500]">+</span>
                </h3>
                <p className="text-xs sm:text-sm nexstudio-mono text-neutral-400 uppercase tracking-wider">
                  Daily Calling Minutes
                </p>
              </div>

              <div className="border-l border-white/10 pl-6">
                <h3 className="text-4xl sm:text-5xl font-normal text-white mb-2 tracking-tight">
                  76<span className="text-emerald-400">%</span>
                </h3>
                <p className="text-xs sm:text-sm nexstudio-mono text-neutral-400 uppercase tracking-wider">
                  First-Call Resolution
                </p>
              </div>

              <div className="border-l border-white/10 pl-6">
                <h3 className="text-4xl sm:text-5xl font-normal text-white mb-2 tracking-tight">
                  &lt;300<span className="text-[#FF5500]">ms</span>
                </h3>
                <p className="text-xs sm:text-sm nexstudio-mono text-neutral-400 uppercase tracking-wider">
                  Speech Response Latency
                </p>
              </div>

              <div className="border-l border-white/10 pl-6">
                <h3 className="text-4xl sm:text-5xl font-normal text-white mb-2 tracking-tight">
                  99.9<span className="text-emerald-400">%</span>
                </h3>
                <p className="text-xs sm:text-sm nexstudio-mono text-neutral-400 uppercase tracking-wider">
                  Enterprise Telecom Uptime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NexStudioStats;
