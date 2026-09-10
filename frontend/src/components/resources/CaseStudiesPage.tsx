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
    accent: "#108D82",
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
    accent: "#7a3e9d",
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
    accent: "#277b7a",
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

export function CaseStudiesPage() {
  return (
    <SiteLayout>
      <main id="case-studies-page" className="min-h-screen bg-white text-black">
        {/* Case Studies */}
        <section className="bg-white px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pb-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="max-w-[760px]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#108D82]">
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
                  className="case-study-card group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_15px_50px_rgba(20,30,60,0.07)] transition duration-300 hover:border-[#108D82]/25"
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
                          className="rounded-lg border border-black/[0.07] bg-[#fafbfe] p-2.5 transition hover:border-[#108D82]/25 hover:bg-[#f6f8ff]"
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
        <section className="case-studies-measurement bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1160px]">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#108D82]">
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
                    className="group rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_8px_30px_rgba(20,30,60,0.04)] transition duration-300 hover:border-[#108D82]/25 hover:bg-[#fafbff] hover:shadow-[0_12px_35px_rgba(16, 141, 130,0.08)]"
                    key={principle.number}
                  >
                    <p className="font-mono text-xs font-bold text-[#108D82]">
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
        <section className="bg-white px-6 pb-12 pt-4 lg:px-8">
          <div className="case-studies-contact mx-auto flex max-w-6xl flex-col items-center justify-between gap-7 overflow-hidden rounded-[24px] border border-[#d7c8e8] bg-[#f1e9fa] p-8 text-center text-black shadow-[0_18px_46px_rgba(91,54,123,0.11)] sm:p-10 md:flex-row md:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3e9d]">
                Ready to get started?
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-black md:text-3xl">
                Start with one valuable call workflow.
              </h2>

              <p className="mt-3 max-w-[640px] text-sm leading-6 text-gray-700">
                We&apos;ll help map the caller journey, define measurable
                outcomes, and plan a responsible rollout.
              </p>
            </div>

            <Link
              className="inline-flex min-h-12 shrink-0 items-center rounded-lg border border-[#7a3e9d] bg-[#7a3e9d] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#683486]"
              href="/contact"
            >
              DISCUSS YOUR CASE <span className="ml-3">&rarr;</span>
            </Link>
          </div>
        </section>

        <style>{`
          #case-studies-page .case-studies-hero {
            background: linear-gradient(180deg, #fbfbff 0%, #f5f3ff 62%, #fff 100%);
          }

          #case-studies-page .case-studies-measurement {
            background: #fff;
          }

          #case-studies-page .case-study-card {
            border-color: #e1deeb;
            box-shadow: 0 14px 38px rgba(49, 46, 90, .07);
          }

          #case-studies-page .case-study-card:hover {
            border-color: #b9b2d8;
            box-shadow: 0 18px 44px rgba(49, 46, 90, .09);
          }

          #case-studies-page .case-studies-contact {
            border-color: #d7c8e8;
            background: linear-gradient(120deg, #f1e9fa 0%, #e9e7ff 100%);
            box-shadow: 0 18px 46px rgba(91, 54, 123, .11);
          }

          #case-studies-page .case-studies-contact a {
            border-color: #7a3e9d;
            background: #7a3e9d;
            color: #fff;
          }
        `}</style>
      </main>
    </SiteLayout>
  );
}

