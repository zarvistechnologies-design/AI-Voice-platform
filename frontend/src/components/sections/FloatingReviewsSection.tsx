"use client";

import React, { useState } from "react";
import { customerReviews } from "@/config/customerReviews";

// Compute initials for avatar (e.g. "Sri Sambhaji Skin Care Clinic" -> "SS")
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

interface ReviewCardProps {
  review: (typeof customerReviews)[number];
  index: number;
  floatVariation?: number;
}

function ReviewCard({ review, index, floatVariation = 1 }: ReviewCardProps) {
  const numStr = String(index + 1).padStart(2, "0");
  const initials = getInitials(review.name);

  return (
    <article
      className="group relative flex w-[320px] sm:w-[380px] flex-shrink-0 flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]"
      style={{
        animation: `float-card-${floatVariation} ${5 + (index % 3)}s ease-in-out infinite alternate`,
      }}
    >
      <div>
        {/* Top Header: Quote Icon & Number */}
        <div className="flex items-center justify-between">
          <span
            className="grid size-8 place-items-center rounded-lg bg-[#E6F4F1] font-serif text-base font-bold text-[#0F6F5C]"
            aria-hidden="true"
          >
            ❝
          </span>
          <span className="font-mono text-xs font-semibold text-slate-400">
            {numStr}
          </span>
        </div>

        {/* Review Quote Body */}
        <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
          &ldquo;{review.quote}&rdquo;
        </p>
      </div>

      {/* Reviewer Details */}
      <div className="mt-6 flex items-center gap-3.5 border-t border-slate-100 pt-4">
        <span
          className="grid size-10 flex-shrink-0 place-items-center rounded-full bg-[#0F3E36] font-mono text-xs font-bold text-white shadow-sm"
          aria-hidden="true"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <h4 className="truncate text-xs sm:text-sm font-semibold text-slate-900">
            {review.name}
          </h4>
          <p className="truncate text-[11px] text-slate-500">
            {review.role}
          </p>
        </div>
      </div>
    </article>
  );
}

export function FloatingReviewsSection() {
  const [viewMode, setViewMode] = useState<"floating" | "grid">("floating");

  // Split reviews into two streams for the floating marquee
  const rowOne = customerReviews.slice(0, 5);
  const rowTwo = customerReviews.slice(4);

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-[#FAF9F5] py-20 md:py-28 text-slate-900 border-t border-slate-200/60"
      aria-labelledby="floating-reviews-title"
    >
      {/* Subtle Ambient Radial Highlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(244, 219, 227, 0.45) 0%, rgba(250, 249, 245, 0) 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50/80 px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase text-rose-800">
            CUSTOMER STORIES
          </span>

          <h2
            id="floating-reviews-title"
            className="mt-4 font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            What our customers say
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Real businesses. Different conversations. A better way to be there for every customer.
          </p>

          {/* View Mode Toggle: Floating vs Grid */}
          <div className="mt-8 inline-flex items-center rounded-full bg-slate-200/70 p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode("floating")}
              className={`rounded-full px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                viewMode === "floating"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Floating Messages
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-full px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Reviews (Grid)
            </button>
          </div>
        </div>

        {/* View Mode 1: Floating Continuous Stream */}
        {viewMode === "floating" && (
          <div className="mt-14 space-y-6 overflow-hidden">
            {/* Stream 1 (Moves Left) */}
            <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex shrink-0 gap-6 animate-marquee-left hover:[animation-play-state:paused] py-2">
                {rowOne.concat(rowOne).concat(rowOne).map((rev, i) => (
                  <ReviewCard
                    key={`stream1-${rev.name}-${i}`}
                    review={rev}
                    index={i % rowOne.length}
                    floatVariation={(i % 3) + 1}
                  />
                ))}
              </div>
            </div>

            {/* Stream 2 (Moves Right / Offset) */}
            <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex shrink-0 gap-6 animate-marquee-right hover:[animation-play-state:paused] py-2">
                {rowTwo.concat(rowTwo).concat(rowTwo).map((rev, i) => (
                  <ReviewCard
                    key={`stream2-${rev.name}-${i}`}
                    review={rev}
                    index={(i % rowTwo.length) + 4}
                    floatVariation={((i + 1) % 3) + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Full Grid (All 9 Reviews) */}
        {viewMode === "grid" && (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {customerReviews.map((rev, idx) => (
              <ReviewCard
                key={`grid-${rev.name}`}
                review={rev}
                index={idx}
                floatVariation={(idx % 3) + 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FloatingReviewsSection;
