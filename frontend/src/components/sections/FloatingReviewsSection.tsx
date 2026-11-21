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

function ReviewCard({
  review,
  index,
  floatVariation = 1,
}: ReviewCardProps) {
  const numStr = String(index + 1).padStart(2, "0");
  const initials = getInitials(review.name);

  return (
    <article className="zippee-card p-6 sm:p-7 flex flex-col justify-between w-[350px] sm:w-[420px] shrink-0 bg-white border border-gray-200/80 shadow-md hover:shadow-xl hover:border-purple-300 transition-all">
      <div>
        {/* Top Header: Quote Icon & Number Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-2xl text-[#9F3DA8] leading-none" aria-hidden="true">
            ❝
          </span>
          <span className="zippee-pill font-mono text-[11px] font-bold text-[#9F3DA8] bg-purple-50">
            {numStr}
          </span>
        </div>

        {/* Review Quote Body */}
        <p className="mt-4 text-sm font-medium text-[#1D1D1F] leading-relaxed">
          &ldquo;{review.quote}&rdquo;
        </p>
      </div>

      {/* Reviewer Details */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
        <span
          className="size-10 rounded-full bg-gradient-to-tr from-[#9F3DA8] to-[#c084fc] text-white font-bold grid place-items-center text-xs shadow-xs shrink-0"
          aria-hidden="true"
        >
          {initials}
        </span>
        <div>
          <h4 className="text-sm font-bold text-[#1D1D1F]">
            {review.name}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-1">
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
    <section id="reviews" aria-labelledby="floating-reviews-title" className="py-24 bg-[#FDF4FF]/40 border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold mb-3">
            <span className="size-2 rounded-full bg-[#9F3DA8]" />
            Enterprise Testimonials
          </span>

          <h2 id="floating-reviews-title" className="zippee-title-underline text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1D1D1F] tracking-tight mt-2">
            Don&apos;t hear us. <span className="text-[#9F3DA8]">Hear Them.</span>
          </h2>

          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            Real customer stories from healthcare leaders, founders, and call center directors who automated millions of calls with Vozon.
          </p>

          {/* Mode Switcher */}
          <div className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white p-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("floating")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "floating"
                  ? "bg-[#9F3DA8] text-white shadow-xs"
                  : "text-gray-700 hover:text-[#9F3DA8]"
              }`}
              aria-pressed={viewMode === "floating"}
            >
              <span>≋</span>
              <span>Floating Stream</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-[#9F3DA8] text-white shadow-xs"
                  : "text-gray-700 hover:text-[#9F3DA8]"
              }`}
              aria-pressed={viewMode === "grid"}
            >
              <span>⊞</span>
              <span>All Reviews Grid</span>
            </button>
          </div>
        </div>

        {/* Floating Stream Mode */}
        {viewMode === "floating" && (
          <div className="mt-12 space-y-6">
            <div className="overflow-hidden w-full relative">
              <div className="animate-marquee gap-6 py-2">
                {[...rowOne, ...rowOne].map((review, idx) => (
                  <ReviewCard key={`row1-${review.name}-${idx}`} review={review} index={idx % rowOne.length} />
                ))}
              </div>
            </div>
            <div className="overflow-hidden w-full relative">
              <div className="animate-marquee gap-6 py-2" style={{ animationDirection: "reverse", animationDuration: "38s" }}>
                {[...rowTwo, ...rowTwo].map((review, idx) => (
                  <ReviewCard key={`row2-${review.name}-${idx}`} review={review} index={(idx % rowTwo.length) + 4} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All Reviews Grid Mode */}
        {viewMode === "grid" && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {customerReviews.map((review, idx) => (
              <ReviewCard key={`grid-${review.name}-${idx}`} review={review} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FloatingReviewsSection;