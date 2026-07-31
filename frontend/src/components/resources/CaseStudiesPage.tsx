import Image from "next/image";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

const caseStudies = [
  {
    industry: "Healthcare",
    title: "A regional care network made appointment access available around the clock.",
    summary:
      "A multilingual scheduling agent now handles routine appointment requests, captures complete caller details, and transfers urgent or complex needs to the right team.",
    image: "/images/healthcare/marquee-frontdesk.jpg",
    imageAlt: "Healthcare front-desk team supporting patient appointment calls",
    accent: "#45ddce",
    challenge:
      "Peak-hour scheduling calls competed with the team's in-person patient support.",
    solution:
      "A multilingual agent verifies callers, captures requests, and escalates clinical needs.",
    outcomes: [
      { value: "24/7", label: "appointment intake" },
      { value: "4", label: "languages configured" },
      { value: "1", label: "structured call record" },
    ],
    capabilities: ["Scheduling", "Multilingual voice", "Human handoff"],
  },
  {
    industry: "Home services",
    title: "A multi-location service team turned missed calls into dispatch-ready requests.",
    summary:
      "The AI voice agent identifies the service need, checks the location, captures urgency, and routes each request using the team's existing dispatch rules.",
    image: "/images/voice-agents/real-customer-support.jpg",
    imageAlt: "Customer support specialist coordinating home-service requests",
    accent: "#8b7cff",
    challenge:
      "Technicians missed calls while working, and after-hours requests were inconsistently qualified.",
    solution:
      "The agent captures service, location, and urgency, then routes each request with context.",
    outcomes: [
      { value: "3", label: "call paths unified" },
      { value: "24/7", label: "request capture" },
      { value: "Live", label: "urgent escalation" },
    ],
    capabilities: ["Lead qualification", "Dispatch routing", "After-hours calls"],
  },
  {
    industry: "Customer operations",
    title: "A support team created one consistent path for repetitive service calls.",
    summary:
      "Routine requests are resolved through connected tools, while policy-sensitive or unresolved conversations reach a specialist with the transcript and attempted actions.",
    image: "/service-images/conversation-insights.jpg",
    imageAlt: "Operations team reviewing customer conversation insights",
    accent: "#ffb25b",
    challenge:
      "Routine status and account calls limited time for complex customer cases.",
    solution:
      "Approved requests use connected tools; unresolved calls transfer with a full action record.",
    outcomes: [
      { value: "6", label: "core intents covered" },
      { value: "1", label: "analytics workspace" },
      { value: "Full", label: "handoff context" },
    ],
    capabilities: ["Tool actions", "Conversation analytics", "Quality review"],
  },
] as const;

const measurementPrinciples = [
  {
    number: "01",
    title: "Start with the caller outcome",
    body: "Define whether the call should resolve, schedule, qualify, update, or reach a person before measuring automation.",
    color: "text-[#75fff0]",
  },
  {
    number: "02",
    title: "Measure the complete workflow",
    body: "Review transfers, tool completion, data quality, retries, and follow-up work—not call duration alone.",
    color: "text-[#b8adff]",
  },
  {
    number: "03",
    title: "Keep human review in the loop",
    body: "Use transcripts, outcomes, and quality signals to inspect important calls and improve agent instructions.",
    color: "text-[#ffc982]",
  },
  {
    number: "04",
    title: "Publish verified evidence",
    body: "Separate configured capabilities from measured business results and approve customer data before publication.",
    color: "text-[#91c2ff]",
  },
] as const;

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
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
    <div className="relative min-h-[310px] overflow-hidden rounded-2xl border border-[#45ddce]/16 bg-[#030706] p-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(69,221,206,0.13),transparent_34%),linear-gradient(rgba(69,221,206,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(69,221,206,0.028)_1px,transparent_1px)] [background-size:auto,42px_42px,42px_42px]"
      />
      <div className="relative flex h-full min-h-[260px] flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-[#45ddce]/20 bg-[#45ddce]/[0.07] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#75fff0]">
            Call journey
          </span>
          <span className="flex items-center gap-2 text-[10px] text-white/34">
            <span className="size-2 rounded-full bg-[#45ddce] shadow-[0_0_12px_rgba(69,221,206,0.7)]" />
            Live workflow
          </span>
        </div>

        <div className="relative my-8">
          <div
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-5 h-px bg-gradient-to-r from-[#45ddce] via-[#8b7cff] to-[#ffb25b]"
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
                  className={`mx-auto grid size-10 place-items-center rounded-xl border bg-[#07100e] font-mono text-[10px] ${
                    index === 0
                      ? "border-[#45ddce]/35 text-[#75fff0]"
                      : index === 1
                        ? "border-[#8b7cff]/35 text-[#b8adff]"
                        : index === 2
                          ? "border-[#65a8ff]/35 text-[#91c2ff]"
                          : "border-[#ffb25b]/35 text-[#ffc982]"
                  }`}
                >
                  {number}
                </span>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white/40">
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
          ].map(([value, label]) => (
            <div className="rounded-xl border border-white/[0.08] bg-black/35 p-3" key={label}>
              <p className="text-sm font-semibold text-white/86">{value}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/28">{label}</p>
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
      <main className="min-h-screen bg-black text-white">
        <section className="relative overflow-hidden bg-black px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pb-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_76%_24%,rgba(69,221,206,0.12),transparent_28%),radial-gradient(circle_at_16%_74%,rgba(139,124,255,0.08),transparent_27%),linear-gradient(rgba(69,221,206,0.023)_1px,transparent_1px),linear-gradient(90deg,rgba(69,221,206,0.023)_1px,transparent_1px)] [background-size:auto,auto,64px_64px,64px_64px]"
          />
          <div className="relative mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.72fr)] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#75fff0]">
                Customer stories
              </p>
              <h1 className="mt-4 max-w-[760px] text-4xl font-semibold tracking-[-0.052em] sm:text-6xl">
                Proof is built into the outcome.
              </h1>
              <p className="mt-6 max-w-[680px] text-base leading-8 text-white/48">
                See how teams turn high-volume calls into clear workflows, reliable actions, and
                customer experiences they can measure.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                {["Healthcare", "Home services", "Customer operations"].map((industry) => (
                  <span
                    className="rounded-full border border-white/10 bg-white/[0.025] px-3.5 py-2 text-xs font-semibold text-white/48"
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

        <section className="bg-[#020403] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="max-w-[760px]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                Deployment stories
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Real workflows. Clear operating results.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/42">
                Customer identities and commercially sensitive details are withheld. The outcomes
                below describe the scope and operation of each deployed workflow.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {caseStudies.map((study) => (
                <article
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-[#050706] shadow-[0_20px_60px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_75px_rgba(0,0,0,0.36)]"
                  key={study.industry}
                  style={{
                    borderColor: `${study.accent}35`,
                    background: `radial-gradient(circle at 92% 0%, ${study.accent}12, transparent 35%), #050706`,
                  }}
                >
                  <div className="relative h-48 shrink-0 overflow-hidden">
                    <Image
                      alt={study.imageAlt}
                      className="object-cover opacity-72 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-88"
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      src={study.image}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-black/15"
                    />
                    <span
                      className="absolute left-4 top-4 rounded-full border bg-black/75 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] backdrop-blur"
                      style={{ borderColor: `${study.accent}55`, color: study.accent }}
                    >
                      {study.industry}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-white/92">
                      {study.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/43">{study.summary}</p>

                    <div className="mt-5 rounded-xl border border-white/[0.075] bg-black/25 p-4">
                      <div>
                        <p
                          className="text-[8px] font-bold uppercase tracking-[0.15em]"
                          style={{ color: study.accent }}
                        >
                          Challenge
                        </p>
                        <p className="mt-1.5 text-[11px] leading-5 text-white/43">{study.challenge}</p>
                      </div>
                      <div className="mt-3 border-t border-white/[0.07] pt-3">
                        <p
                          className="text-[8px] font-bold uppercase tracking-[0.15em]"
                          style={{ color: study.accent }}
                        >
                          Voice workflow
                        </p>
                        <p className="mt-1.5 text-[11px] leading-5 text-white/43">{study.solution}</p>
                      </div>
                    </div>

                    <div className="mt-auto grid grid-cols-3 gap-2 pt-5">
                      {study.outcomes.map((outcome) => (
                        <div className="rounded-lg border border-white/[0.075] bg-black/30 p-2.5" key={outcome.label}>
                          <p className="text-lg font-semibold tracking-[-0.03em]" style={{ color: study.accent }}>
                            {outcome.value}
                          </p>
                          <p className="mt-1 text-[8px] leading-3 uppercase tracking-[0.07em] text-white/28">
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

        <section className="bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1160px]">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                  Evidence that matters
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  How we evaluate success.
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/42">
                  Strong case studies connect platform activity to a clearly defined customer and
                  operational outcome.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {measurementPrinciples.map((principle) => (
                  <article
                    className="rounded-2xl border border-white/[0.085] bg-white/[0.018] p-6"
                    key={principle.number}
                  >
                    <p className={`font-mono text-xs font-bold ${principle.color}`}>{principle.number}</p>
                    <h3 className="mt-5 text-lg font-semibold text-white/86">{principle.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/40">{principle.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#020403] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto flex max-w-[1080px] flex-col items-start justify-between gap-8 rounded-2xl border border-[#45ddce]/20 bg-[linear-gradient(115deg,rgba(69,221,206,0.11),rgba(139,124,255,0.045)_52%,transparent)] p-7 sm:p-10 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                Build your story
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Start with one valuable call workflow.
              </h2>
              <p className="mt-3 max-w-[640px] text-sm leading-7 text-white/46">
                We&apos;ll help map the caller journey, define measurable outcomes, and plan a
                responsible rollout.
              </p>
            </div>
            <Link
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-lg bg-[#45ddce] px-6 text-sm font-bold text-[#02110e] transition hover:bg-[#75fff0]"
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
