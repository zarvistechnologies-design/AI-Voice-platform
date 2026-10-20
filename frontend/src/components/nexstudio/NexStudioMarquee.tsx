"use client";

import React from "react";

const clientLogos = [
  { name: "Deloitte.", isAccent: true },
  { name: "appsmith_", isMono: true },
  { name: "Vigilant" },
  { name: "ed.is.on" },
  { name: "Kobe Creations" },
  { name: "Simplamo®" },
  { name: "SOULPAGE" },
  { name: "zendesk" },
  { name: "DigitalBot" },
];

interface NexStudioMarqueeProps {
  theme?: "dark" | "light";
}

export function NexStudioMarquee({ theme = "dark" }: NexStudioMarqueeProps) {
  const isDark = theme !== "light";

  return (
    <section
      className={`py-12 border-y transition-colors duration-300 overflow-hidden ${
        isDark ? "bg-[#09090d]/80 border-white/5" : "bg-gray-50/50 border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
        <p className={`text-xs nexstudio-mono uppercase tracking-widest ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
          TRUSTED BY MODERN ENTERPRISES &amp; FAST-GROWING PRODUCT TEAMS
        </p>
      </div>

      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)]">
        <div className="nexstudio-marquee-track flex items-center gap-12 sm:gap-20">
          {/* First loop */}
          {clientLogos.map((client, i) => (
            <div
              key={`logo-1-${i}`}
              className={`text-lg sm:text-xl font-medium tracking-tight transition-colors duration-200 whitespace-nowrap select-none ${
                isDark ? "text-neutral-400 hover:text-white" : "text-gray-400 hover:text-black"
              }`}
            >
              {client.name}
            </div>
          ))}

          {/* Duplicated for seamless infinite loop */}
          {clientLogos.map((client, i) => (
            <div
              key={`logo-2-${i}`}
              className={`text-lg sm:text-xl font-medium tracking-tight transition-colors duration-200 whitespace-nowrap select-none ${
                isDark ? "text-neutral-400 hover:text-white" : "text-gray-400 hover:text-black"
              }`}
            >
              {client.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NexStudioMarquee;
