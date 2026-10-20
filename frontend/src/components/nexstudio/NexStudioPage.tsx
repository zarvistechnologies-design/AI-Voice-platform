"use client";

import React, { useState } from "react";
import { NexStudioHeader } from "./NexStudioHeader";
import { NexStudioHero } from "./NexStudioHero";
import { NexStudioMarquee } from "./NexStudioMarquee";
import { NexStudioStats } from "./NexStudioStats";
import { NexStudioServices } from "./NexStudioServices";
import { NexStudioPortfolio } from "./NexStudioPortfolio";
import { NexStudioPlatform } from "./NexStudioPlatform";
import { NexStudioInsights } from "./NexStudioInsights";
import { NexStudioTestimonials } from "./NexStudioTestimonials";
import { NexStudioDiscoveryCall } from "./NexStudioDiscoveryCall";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./NexStudioTheme.css";

export function NexStudioPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <div
      data-theme={theme}
      className={`nexstudio-root min-h-screen flex flex-col transition-colors duration-300 relative ${
        isDark ? "bg-[#08080a] text-white" : "bg-white text-black"
      }`}
    >
      {/* 1. Header with Day/Night Theme Switcher */}
      <NexStudioHeader theme={theme} onToggleTheme={toggleTheme} />

      {/* 2. Main Page Content with unified Dark Background Theme */}
      <main className="flex-1 relative z-10">
        {/* Editorial Hero */}
        <NexStudioHero theme={theme} />

        {/* Client Marquee */}
        <NexStudioMarquee theme={theme} />

        {/* Dark Impact Stats Banner */}
        <NexStudioStats theme={theme} />

        {/* Core Services Grid */}
        <NexStudioServices theme={theme} />

        {/* Selected Work & Case Studies */}
        <NexStudioPortfolio theme={theme} />

        {/* Platform Architecture & FAQ */}
        <NexStudioPlatform theme={theme} />

        {/* AI Speech Intelligence & Insights Section */}
        <NexStudioInsights theme={theme} />

        {/* Customer Testimonials */}
        <NexStudioTestimonials theme={theme} />

        {/* Interactive Discovery Call Scheduler */}
        <NexStudioDiscoveryCall theme={theme} />
      </main>

      {/* 3. Custom Requested Footer with Orange V Symbol & VOZON Background Watermark */}
      <SiteFooter />
    </div>
  );
}

export default NexStudioPage;
