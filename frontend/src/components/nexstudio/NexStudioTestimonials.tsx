"use client";

import React from "react";
import { customerReviews } from "@/config/customerReviews";

interface NexStudioTestimonialsProps {
  theme?: "dark" | "light";
}

export function NexStudioTestimonials({ theme = "dark" }: NexStudioTestimonialsProps) {
  const reviews = customerReviews.slice(0, 3);
  const isDark = theme !== "light";

  return (
    <section
      id="testimonials"
      className={`py-20 lg:py-28 transition-colors duration-300 border-t ${
        isDark ? "bg-[#09090d]/80 border-white/5" : "bg-gray-50/50 border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs nexstudio-mono uppercase tracking-widest text-[#FF5500] block mb-3 font-semibold">
              CLIENT TESTIMONIALS
            </span>
            <h2
              className={`text-4xl sm:text-5xl font-normal tracking-tight leading-tight ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              What Our{" "}
              <span className={`nexstudio-italic-serif italic font-serif ${isDark ? "text-white" : "text-black"}`}>
                Partners
              </span>{" "}
              Say.
            </h2>
          </div>
          <p className={`text-sm max-w-md -tracking-[0.2px] leading-relaxed ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
            Real feedback from engineering leaders and operations directors automating phone conversations.
          </p>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div
              key={rev.name}
              className={`nexstudio-card flex flex-col justify-between transition-all duration-300 ${
                isDark
                  ? "bg-[#0e0e14]/80 border-white/10 hover:border-[#FF5500]/50 hover:bg-[#12121a] shadow-xl"
                  : "bg-white border-gray-200"
              }`}
            >
              <div>
                {/* Quote Mark & Index */}
                <div
                  className={`flex items-center justify-between pb-4 border-b mb-6 ${
                    isDark ? "border-white/10" : "border-gray-100"
                  }`}
                >
                  <span className={`text-3xl font-serif leading-none ${isDark ? "text-neutral-600" : "text-gray-300"}`}>“</span>
                  <span className={`text-xs nexstudio-mono ${isDark ? "text-neutral-500" : "text-gray-400"}`}>0{i + 1}</span>
                </div>

                <p className={`text-base leading-relaxed mb-8 ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                  {rev.quote}
                </p>
              </div>

              {/* Author Info */}
              <div
                className={`flex items-center gap-3 pt-4 border-t ${
                  isDark ? "border-white/10" : "border-gray-100"
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-full text-xs nexstudio-mono font-bold flex items-center justify-center ${
                    isDark ? "bg-white/10 text-white border border-white/10" : "bg-neutral-900 text-white"
                  }`}
                >
                  {rev.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </span>
                <div>
                  <h4 className={`text-sm font-semibold ${isDark ? "text-white" : "text-black"}`}>{rev.name}</h4>
                  <p className={`text-xs ${isDark ? "text-neutral-400" : "text-gray-500"}`}>{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NexStudioTestimonials;
