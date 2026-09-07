import Image from "next/image";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

const caseStudies = [
  {
    industry: "Healthcare",
    title:
      "A regional care network made appointment access available around the clock.",
    summary:
      "A multilingual scheduling agent now handles routine appointment requests, captures complete caller details, and transfers urgent or complex needs to the right team.",
    image: "/images/healthcare/marquee-frontdesk.jpg",
    imageAlt:
      "Healthcare front-desk team supporting patient appointment calls",
    accent: "#3e75ff",
    challenge:
      "Peak-hour scheduling calls competed with the team's in-person patient support.",
    solution:
      "A multilingual agent verifies callers, captures requests, and escalates clinical needs.",
    outcomes: [
      { value: "24/7", label: "appointment intake" },
      { value: "4", label: "languages configured" },
      { value: "1", label: "structured call record" },
    ],
    capabilities: [
      "Scheduling",
      "Multilingual voice",
      "Human handoff",
    ],
  },
  {
    industry: "Home services",
    title:
      "A multi-location service team turned missed calls into dispatch-ready requests.",
    summary:
      "The AI voice agent identifies the service need, checks the location, captures urgency, and routes each request using the team's existing dispatch rules.",
    image: "/images/voice-agents/real-customer-support.jpg",
    imageAlt:
      "Customer support specialist coordinating home-service requests",
    accent: "#3e75ff",
    challenge:
      "Technicians missed calls while working, and after-hours requests were inconsistently qualified.",
    solution:
      "The agent captures service, location, and urgency, then routes each request with context.",
    outcomes: [
      { value: "3", label: "call paths unified" },
      { value: "24/7", label: "request capture" },
      { value: "Live", label: "urgent escalation" },
    ],
    capabilities: [
      "Lead qualification",
      "Dispatch routing",
      "After-hours calls",
    ],
  },
  {
    industry: "Customer operations",
    title:
      "A support team created one consistent path for repetitive service calls.",
    summary:
      "Routine requests are resolved through connected tools, while policy-sensitive or unresolved conversations reach a specialist with the transcript and attempted actions.",
    image: "/service-images/conversation-insights.jpg",
    imageAlt:
      "Operations team reviewing customer conversation insights",
    accent: "#3e75ff",
    challenge:
      "Routine status and account calls limited time for complex customer cases.",
    solution:
      "Approved requests use connected tools; unresolved calls transfer with a full action record.",
    outcomes: [
      { value: "6", label: "core intents covered" },
      { value: "1", label: "analytics workspace" },
      { value: "Full", label: "handoff context" },
    ],
    capabilities: [
      "Tool actions",
      "Conversation analytics",
      "Quality review",
    ],
  },
] as const;

const measurementPrinciples = [
  {
    number: "01",
    title: "Start with the caller outcome",
    body: "Define whether the call should resolve, schedule, qualify, update, or reach a person before measuring automation.",
  },
  {
    number: "02",
    title: "Measure the complete workflow",
    body: "Review transfers, tool completion, data quality, retries, and follow-up work—not call duration alone.",
  },
  {
    number: "03",
    title: "Keep human review in the loop",
    body: "Use transcripts, outcomes, and quality signals to inspect important calls and improve agent instructions.",
  },
  {
    number: "04",
    title: "Publish verified evidence",
    body: "Separate configured capabilities from measured business results and approve customer data before publication.",
  },
] as const;

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
function OutcomeFlow() {
  return (
    <div className="relative min-h-[310px] overflow-hidden rounded-2xl border border-[#3e75ff]/15 bg-white p-6 shadow-[0_20px_60px_rgba(20,40,80,0.08)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(62,117,255,0.10),transparent_38%),linear-gradient(rgba(62,117,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(62,117,255,0.025)_1px,transparent_1px)] [background-size:auto,42px_42px,42px_42px]"
      />

      <div className="relative flex h-full min-h-[260px] flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-[#3e75ff]/20 bg-[#3e75ff]/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#3e75ff]">
            Call journey
          </span>

          <span className="flex items-center gap-2 text-[10px] text-black/40">
            <span className="size-2 rounded-full bg-[#3e75ff] shadow-[0_0_10px_rgba(62,117,255,0.45)]" />
            Live workflow
          </span>
        </div>

        <div className="relative my-8">
          <div
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-5 h-px bg-gradient-to-r from-[#3e75ff]/25 via-[#3e75ff] to-black/20"
          />

          <div className="relative grid grid-cols-4 gap-2">
            {[
              ["01", "Intent"],
              ["02", "Context"],
              ["03", "Action"],
              ["04", "Outcome"],
            ].map(([number, label], index) => (
              <div className="text-center" key={number}>
                <span
                  className={`mx-auto grid size-10 place-items-center rounded-xl border bg-white font-mono text-[10px] ${
                    index === 0
                      ? "border-[#3e75ff]/40 text-[#3e75ff]"
                      : index === 1
                        ? "border-[#3e75ff]/30 text-[#4e7fff]"
                        : index === 2
                          ? "border-black/10 text-black/60"
                          : "border-black/15 text-black/75"
                  }`}
                >
                  {number}
                </span>

                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-black/40">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            ["Clear", "resolution"],
            ["Safe", "handoff"],
            ["Useful", "insight"],
          ].map(([value, label], index) => (
            <div
              className="rounded-xl border border-black/[0.07] bg-[#f8faff] p-3 transition hover:border-[#3e75ff]/25 hover:bg-[#f4f7ff]"
              key={label}
            >
              <p
                className={`text-sm font-semibold ${
                  index === 0
                    ? "text-black/85"
                    : index === 1
                      ? "text-black/75"
                      : "text-[#3e75ff]"
                }`}
              >
                {value}
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-black/35">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CaseStudiesPage() {
  return (
    <SiteLayout>
      <main className="min-h-screen bg-white text-black">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pb-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(62,117,255,0.09),transparent_28%),radial-gradient(circle_at_12%_75%,rgba(62,117,255,0.045),transparent_25%),linear-gradient(rgba(62,117,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(62,117,255,0.015)_1px,transparent_1px)] [background-size:auto,auto,64px_64px,64px_64px]"
          />

          <div className="relative mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.72fr)] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3e75ff]">
                Customer stories
              </p>

              <h1 className="mt-4 max-w-[760px] text-4xl font-semibold tracking-[-0.052em] text-black sm:text-6xl">
                Proof is built into the outcome.
              </h1>

              <p className="mt-6 max-w-[680px] text-base leading-8 text-black/55">
                See how teams turn high-volume calls into clear workflows,
                reliable actions, and customer experiences they can measure.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                {[
                  "Healthcare",
                  "Home services",
                  "Customer operations",
                ].map((industry) => (
                  <span
                    className="rounded-full border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-black/55 shadow-[0_3px_12px_rgba(0,0,0,0.03)] transition hover:border-[#3e75ff]/30 hover:text-[#3e75ff]"
                    key={industry}
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            <OutcomeFlow />
          </div>
        </section>

        {/* Case Studies */}
        <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="max-w-[760px]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3e75ff]">
                Deployment stories
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
                Real workflows. Clear operating results.
              </h2>

              <p className="mt-4 text-sm leading-7 text-black/50">
                Customer identities and commercially sensitive details are
                withheld. The outcomes below describe the scope and operation
                of each deployed workflow.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {caseStudies.map((study) => (
                <article
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_15px_50px_rgba(20,30,60,0.07)] transition duration-300 hover:-translate-y-1.5 hover:border-[#3e75ff]/25 hover:shadow-[0_24px_65px_rgba(62,117,255,0.12)]"
                  key={study.industry}
                  style={{
                    background: `radial-gradient(circle at 92% 0%, ${study.accent}08, transparent 34%), #ffffff`,
                  }}
                >
                  <div className="relative h-48 shrink-0 overflow-hidden">
                    <Image
                      alt={study.imageAlt}
                      className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      src={study.image}
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5"
                    />

                    <span
                      className="absolute left-4 top-4 rounded-full border bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] shadow-sm backdrop-blur"
                      style={{
                        borderColor: `${study.accent}45`,
                        color: study.accent,
                      }}
                    >
                      {study.industry}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-black/90">
                      {study.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-black/52">
                      {study.summary}
                    </p>

                    <div className="mt-5 rounded-xl border border-black/[0.07] bg-[#fafbfe] p-4">
                      <div>
                        <p
                          className="text-[8px] font-bold uppercase tracking-[0.15em]"
                          style={{ color: study.accent }}
                        >
                          Challenge
                        </p>

                        <p className="mt-1.5 text-[11px] leading-5 text-black/50">
                          {study.challenge}
                        </p>
                      </div>

                      <div className="mt-3 border-t border-black/[0.07] pt-3">
                        <p
                          className="text-[8px] font-bold uppercase tracking-[0.15em]"
                          style={{ color: study.accent }}
                        >
                          Voice workflow
                        </p>

                        <p className="mt-1.5 text-[11px] leading-5 text-black/50">
                          {study.solution}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto grid grid-cols-3 gap-2 pt-5">
                      {study.outcomes.map((outcome) => (
                        <div
                          className="rounded-lg border border-black/[0.07] bg-[#fafbfe] p-2.5 transition hover:border-[#3e75ff]/25 hover:bg-[#f6f8ff]"
                          key={outcome.label}
                        >
                          <p
                            className="text-lg font-semibold tracking-[-0.03em]"
                            style={{ color: study.accent }}
                          >
                            {outcome.value}
                          </p>

                          <p className="mt-1 text-[8px] leading-3 uppercase tracking-[0.07em] text-black/35">
                            {outcome.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Measurement */}
        <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1160px]">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3e75ff]">
                  Evidence that matters
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
                  How we evaluate success.
                </h2>

                <p className="mt-4 text-sm leading-7 text-black/50">
                  Strong case studies connect platform activity to a clearly
                  defined customer and operational outcome.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {measurementPrinciples.map((principle) => (
                  <article
                    className="group rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_8px_30px_rgba(20,30,60,0.04)] transition duration-300 hover:border-[#3e75ff]/25 hover:bg-[#fafbff] hover:shadow-[0_12px_35px_rgba(62,117,255,0.08)]"
                    key={principle.number}
                  >
                    <p className="font-mono text-xs font-bold text-[#3e75ff]">
                      {principle.number}
                    </p>

                    <h3 className="mt-5 text-lg font-semibold text-black/85">
                      {principle.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-black/50">
                      {principle.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto flex max-w-[1080px] flex-col items-start justify-between gap-8 rounded-2xl border border-[#3e75ff]/20 bg-gradient-to-br from-[#f5f8ff] via-white to-[#f9fbff] p-7 shadow-[0_15px_50px_rgba(62,117,255,0.08)] sm:p-10 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3e75ff]">
                Build your story
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
                Start with one valuable call workflow.
              </h2>

              <p className="mt-3 max-w-[640px] text-sm leading-7 text-black/50">
                We&apos;ll help map the caller journey, define measurable
                outcomes, and plan a responsible rollout.
              </p>
            </div>

            <Link
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-lg bg-[#3e75ff] px-6 text-sm font-bold text-white shadow-[0_8px_25px_rgba(62,117,255,0.22)] transition hover:bg-[#3267ed] hover:shadow-[0_10px_30px_rgba(62,117,255,0.30)]"
              href="/contact"
            >
              Discuss your use case
              <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}

