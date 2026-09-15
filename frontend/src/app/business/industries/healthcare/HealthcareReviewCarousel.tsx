"use client";

import { useEffect, useState } from "react";

const benefits = [
  {
    title: "Less front-desk pressure",
    description:
      "Routine requests are handled consistently, giving staff more time for patients who need personal attention.",
  },
  {
    title: "A natural patient experience",
    description:
      "Clear, focused conversations help callers reach the right next step without navigating a complicated phone menu.",
  },
  {
    title: "Smooth human handoff",
    description:
      "Calls move to the right team with useful context whenever a request needs human judgment.",
  },
] as const;

const workflows = [
  {
    number: "01",
    eyebrow: "Appointment support",
    quote:
      "Patients can request or change appointments without waiting for the front desk, while every step follows the configured scheduling rules.",
    name: "Appointment workflow",
    role: "Representative healthcare experience",
    initials: "AP",
  },
  {
    number: "02",
    eyebrow: "Call summaries",
    quote:
      "Staff receive the important details from each call, so patients do not need to repeat the same information during follow-up.",
    name: "Follow-up workflow",
    role: "Representative healthcare experience",
    initials: "FU",
  },
  {
    number: "03",
    eyebrow: "Human handoff",
    quote:
      "Sensitive or uncertain requests reach the appropriate staff member with context, keeping the experience calm and connected.",
    name: "Escalation workflow",
    role: "Representative healthcare experience",
    initials: "HH",
  },
] as const;

function CheckIcon() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-teal-700 shadow-sm">
      <svg
        aria-hidden="true"
        className="size-4"
        fill="none"
        viewBox="0 0 16 16"
      >
        <path
          d="m3.5 8 2.8 2.8 6.2-6.1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
      </svg>
    </span>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d={direction === "left" ? "M16 10H4m5-5-5 5 5 5" : "M4 10h12m-5-5 5 5-5 5"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function HealthcareReviewCarousel() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const workflow = workflows[active];

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % workflows.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const next = () => {
    setActive((current) => (current + 1) % workflows.length);
  };

  const previous = () => {
    setActive(
      (current) => (current - 1 + workflows.length) % workflows.length,
    );
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14">
      <div className="max-w-[500px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700">
          Healthcare experiences
        </p>

        <h2 className="mt-4 text-[clamp(2rem,2.8vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-slate-950">
          Healthcare calls that feel simpler for everyone.
        </h2>

        <p className="mt-5 max-w-md text-[15px] leading-7 text-slate-900">
          Focused voice workflows make routine calls simpler while keeping your
          staff in control of every exception.
        </p>

        <div className="mt-8 space-y-5">
          {benefits.map((benefit) => (
            <div className="flex gap-4" key={benefit.title}>
              <CheckIcon />

              <div>
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
                  {benefit.title}
                </h3>

                <p className="mt-1.5 text-sm leading-6 text-slate-800">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="min-w-0"
        onBlurCapture={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div>
          <article
            aria-live="polite"
            className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[28px] border border-teal-900 bg-[linear-gradient(145deg,#0f766e_0%,#082f2b_100%)] p-7 text-white shadow-[0_24px_65px_rgba(15,118,110,0.16)] sm:p-9"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-teal-400/70 to-transparent"
            />
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-200 ring-1 ring-inset ring-white/10">
                  {workflow.eyebrow}
                </span>
              </div>

              <blockquote className="mt-8 max-w-xl text-xl font-medium leading-[1.55] tracking-[-0.025em] text-slate-50 sm:text-2xl">
                &ldquo;{workflow.quote}&rdquo;
              </blockquote>
            </div>

            <div className="relative z-10 mt-10 flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-teal-50 text-xs font-black text-teal-700 shadow-sm ring-1 ring-inset ring-teal-900/10">
                  {workflow.initials}
                </span>

                <div>
                  <strong className="block text-sm font-semibold text-white">
                    {workflow.name}
                  </strong>
                  <span className="mt-1 block text-xs text-slate-400">
                    {workflow.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  aria-label="Previous healthcare experience"
                  className="grid size-10 place-items-center rounded-full border border-white/15 text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  onClick={previous}
                  type="button"
                >
                  <ArrowIcon direction="left" />
                </button>

                <button
                  aria-label="Next healthcare experience"
                  className="grid size-10 place-items-center rounded-full bg-teal-500 text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/60"
                  onClick={next}
                  type="button"
                >
                  <ArrowIcon direction="right" />
                </button>
              </div>
            </div>
          </article>

        </div>

        <div className="mt-5 flex items-center gap-2" aria-label="Experience slides">
          {workflows.map((item, index) => (
            <button
              aria-label={`Show experience ${index + 1}`}
              aria-pressed={active === index}
              className={`h-1.5 rounded-full transition-all ${
                active === index
                  ? "w-10 bg-teal-700"
                  : "w-5 bg-slate-200 hover:bg-slate-300"
              }`}
              key={item.number}
              onClick={() => setActive(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
