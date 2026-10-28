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
      className="group relative flex w-[320px] sm:w-[380px] flex-shrink-0 flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-ink/40 hover:shadow-md"
      style={{
        animation: `float-card-${floatVariation} ${5 + (index % 3)}s ease-in-out infinite alternate`,
      }}
    >
      <div>
        {/* Top Header: Quote Badge & Index Number */}
        <div className="flex items-center justify-between">
          <span
            className="grid size-8 place-items-center rounded-lg bg-paper-2 font-mono text-xs font-bold text-cobalt"
            aria-hidden="true"
          >
            ❝
          </span>
          <span className="font-mono text-xs font-semibold text-muted">
            {numStr}
          </span>
        </div>

        {/* Review Quote Body */}
        <p className="mt-4 text-xs sm:text-[13.5px] leading-relaxed text-ink/80 font-normal">
          &ldquo;{review.quote}&rdquo;
        </p>
      </div>

      {/* Reviewer Details */}
      <div className="mt-6 flex items-center gap-3.5 border-t border-line pt-4">
        <span
          className="grid size-10 flex-shrink-0 place-items-center rounded-full bg-ink font-mono text-xs font-bold text-white shadow-sm"
          aria-hidden="true"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <h4 className="truncate font-display text-xs sm:text-sm font-bold text-ink">
            {review.name}
          </h4>
          <p className="truncate font-mono text-[11px] text-muted">
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
      className="relative overflow-hidden bg-paper/60 pt-24 pb-20 md:pt-28 md:pb-28 border-t border-line text-ink scroll-mt-24"
      aria-labelledby="floating-reviews-title"
    >
      {/* Subtle Ambient Radial Highlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(43, 54, 245, 0.05) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="eyebrow text-cobalt font-semibold tracking-wider">
            Customer Stories
          </p>

          <h2
            id="floating-reviews-title"
            className="display-lg mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            What our <span className="text-cobalt">customers</span> say
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base font-normal">
            Real businesses. Different conversations. A better way to be there for every customer.
          </p>

          {/* View Mode Toggle: Floating vs Grid */}
          <div className="mt-8 inline-flex items-center rounded-full bg-paper-2 border border-line p-1">
            <button
              type="button"
              onClick={() => setViewMode("floating")}
              className={`rounded-full px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                viewMode === "floating"
                  ? "bg-ink text-white shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
              aria-pressed={viewMode === "floating"}
            >
              Floating Messages
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-full px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-ink text-white shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
              aria-pressed={viewMode === "grid"}
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
