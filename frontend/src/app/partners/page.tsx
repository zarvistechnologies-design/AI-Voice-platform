import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "DigitalBot Partnership | Vozon",
  description:
    "Explore DigitalBot's connected platform for WhatsApp automation, customer support, CRM operations, bookings, campaigns, dashboards, and analytics.",
  alternates: { canonical: "/partners" },
};

const digitalBotCapabilities = [
  {
    number: "01",
    title: "Omnichannel customer engagement",
    body: "Bring WhatsApp, calls, and chat into a responsive customer experience that can answer enquiries and support customers around the clock.",
  },
  {
    number: "02",
    title: "CRM and client dashboards",
    body: "Manage contacts, leads, calls, chats, transcripts, tickets, documents, campaigns, and performance in one client-ready business dashboard.",
  },
  {
    number: "03",
    title: "Customer query handling",
    body: "Answer common questions, create tickets for complex issues, track complaints, assign an owner, and hand important conversations to the team with context.",
  },
  {
    number: "04",
    title: "Bookings and approval workflows",
    body: "Coordinate appointments, reminders, and client requests while moving internal decisions through clear pending, reviewed, approved, or rejected stages.",
  },
  {
    number: "05",
    title: "Leads, campaigns, and follow-ups",
    body: "Capture and qualify leads, schedule next steps, and automate reminders, promotions, payment nudges, and re-engagement campaigns across channels.",
  },
  {
    number: "06",
    title: "Integrations, knowledge, and analytics",
    body: "Connect CRMs, calendars, forms, spreadsheets, documents, APIs, and business tools while keeping knowledge, customer data, and performance insights organized.",
  },
] as const;

const workflow = [
  "A customer connects through WhatsApp, voice, or chat",
  "DigitalBot understands the request and handles routine needs",
  "The contact, lead, ticket, or booking is created and updated",
  "Queries and approvals move to the right team member",
  "Dashboards, follow-ups, and analytics stay current",
] as const;

export default function PartnersPage() {
  return (
    <SiteLayout>
      <div id="partners-page" className="min-h-screen bg-white text-black">
        {/* =========================================================
            HERO
        ========================================================== */}
        <section className="relative isolate overflow-hidden bg-white px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:pb-24">
          <div className="mx-auto max-w-[1240px]">
            <header className="mx-auto max-w-[1240px] text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#3e75ff]/20 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#3e75ff] shadow-sm">
                <i className="size-1.5 rounded-full bg-[#3e75ff]" />
                Partner spotlight
              </span>

              <h1 className="mt-7 text-balance text-[clamp(2.25rem,4.4vw,4.25rem)] font-medium leading-[0.98] tracking-[-0.055em] text-black">
                <span className="block">Connected by innovation.</span>

                <span className="block text-black lg:whitespace-nowrap">
                  Committed to customer success.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
                DigitalBot brings WhatsApp automation, calls, chat, CRM
                operations, bookings, customer support, campaigns, and
                analytics into one connected business platform.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-2.5">
                {[
                  "Voice automation",
                  "WhatsApp workflows",
                  "CRM & dashboards",
                  "Bookings",
                  "Customer support",
                  "Analytics",
                ].map((item) => (
                  <span
                    className="rounded-full border border-[#D9D9D9] bg-white px-3.5 py-1.5 text-[10px] font-bold tracking-[0.04em] text-black transition duration-300 hover:border-black"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </header>

            {/* =====================================================
                PARTNERSHIP VISUAL
            ====================================================== */}
            <div className="relative mx-auto mt-14 max-w-[1060px] overflow-hidden rounded-[28px] border border-[#E2E2E2] bg-white p-4 shadow-[0_28px_90px_rgba(0,0,0,0.07)] sm:mt-16 sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[12%] top-0 h-px bg-[#D8D8D8]"
              />

              <div className="grid items-center gap-4 md:grid-cols-[1fr_150px_1fr]">
                {/* VOZON */}
                <div className="flex min-h-40 items-center justify-center rounded-2xl border border-[#E8E8E8] bg-white p-7 sm:min-h-44">
                  <span
                    aria-label="Vozon"
                    className="block aspect-[1160/350] w-[min(250px,76%)] bg-[#3e75ff]"
                    role="img"
                    style={{
                      WebkitMaskImage: "url('/images/logo_2.svg')",
                      WebkitMaskPosition: "center",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskSize: "contain",
                      maskImage: "url('/images/logo_2.svg')",
                      maskPosition: "center",
                      maskRepeat: "no-repeat",
                      maskSize: "contain",
                    }}
                  />
                </div>

                {/* PARTNERSHIP CONNECTOR */}
                <div className="flex flex-col items-center gap-3 py-2">
                  <span className="text-center text-[9px] font-bold uppercase tracking-[0.17em] text-black">
                    Strategic partnership
                  </span>

                  <div className="flex w-full items-center gap-3">
                    <i className="h-px flex-1 bg-[#D8D8D8]" />

                    <span
                      className="grid size-24 place-items-center rounded-full border-2 border-black bg-white text-black shadow-[0_0_30px_rgba(0,0,0,0.06)]"
                      aria-label="Vozon and DigitalBot partnership"
                    >
                      <svg
                        aria-hidden="true"
                        className="size-14"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="m11 17 2 2a1 1 0 1 0 3-3"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                        <path
                          d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 0 1-3-3l2.81-2.81a5.8 5.8 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                        <path
                          d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>

                    <i className="h-px flex-1 bg-[#D8D8D8]" />
                  </div>
                </div>

                {/* DIGITALBOT */}
                <div className="flex min-h-40 items-center justify-center rounded-2xl border border-[#E8E8E8] bg-white p-7 sm:min-h-44">
                  <Image
                    alt="DigitalBot"
                    className="h-auto w-[min(330px,92%)]"
                    height={520}
                    src="/images/digitalbot_orbit.png"
                    width={2048}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            INSIDE DIGITALBOT
        ========================================================== */}
        <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 sm:py-24">
          <div className="relative mx-auto max-w-[1240px]">
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#3e75ff]">
                  Inside DigitalBot
                </span>

                <h2 className="mt-4 text-balance text-[clamp(1.9rem,3.4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.045em] text-black">
                  Every customer interaction, connected in one place.
                </h2>
              </div>

              <p className="max-w-2xl text-base leading-8 text-gray-600 lg:justify-self-end">
                DigitalBot helps businesses manage conversations and the work
                behind them—from customer questions and CRM records to
                bookings, approvals, campaigns, follow-ups, and client-ready
                reporting.
              </p>
            </div>

            {/* =====================================================
                CAPABILITY CARDS
            ====================================================== */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {digitalBotCapabilities.map((capability) => (
                <article
                  className="partners-capability-card group relative min-h-60 overflow-hidden rounded-[22px] border border-[#E3E3E3] bg-white p-7 shadow-[0_10px_35px_rgba(0,0,0,0.035)] transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-[0_22px_60px_rgba(0,0,0,0.08)]"
                  key={capability.number}
                >
                  <div className="relative flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.12em] text-[#3e75ff]">
                      DIGITALBOT / {capability.number}
                    </span>

                    <i className="size-2 rounded-full bg-[#3e75ff]" />
                  </div>

                  <h3 className="relative mt-7 text-xl font-semibold tracking-[-0.03em] text-black">
                    {capability.title}
                  </h3>

                  <p className="relative mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                    {capability.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            WORKFLOW
        ========================================================== */}
        <section className="bg-white px-5 py-20 sm:px-8 sm:py-24">
          <div className="partners-workflow-card relative mx-auto max-w-[1240px] overflow-hidden rounded-[28px] border border-[#E2E2E2] bg-white p-6 shadow-[0_18px_55px_rgba(0,0,0,0.055)] sm:p-10 lg:p-14">
            <div className="relative grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#3e75ff]">
                  DigitalBot workflow
                </span>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-black sm:text-4xl">
                  From first message to finished work
                </h2>

                <p className="mt-5 text-base leading-8 text-gray-600">
                  DigitalBot connects each customer interaction with the
                  record, owner, workflow, and next step it needs—without
                  losing context along the way.
                </p>
              </div>

              <ol className="relative grid gap-3">
                {workflow.map((step, index) => (
                  <li
                    className="flex items-center gap-4 border-b border-[#E5E5E5] px-1 py-4 last:border-b-0 sm:py-5"
                    key={step}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-base font-semibold leading-7 text-gray-800 sm:text-lg">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================== */}
        <section className="bg-white px-6 pb-12 pt-4 lg:px-8">
          <div className="partners-contact mx-auto max-w-6xl overflow-hidden rounded-[24px] border border-[#d7c8e8] bg-[#f1e9fa] p-8 text-center text-black shadow-[0_18px_46px_rgba(91,54,123,0.11)] sm:p-10">
            <div className="mx-auto grid gap-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:text-left">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3e9d]">
                  Ready to get started?
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-black md:text-3xl">
                  See how DigitalBot can simplify your customer operations.
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-700 md:mx-0">
                  Explore DigitalBot&apos;s connected platform for customer
                  conversations, CRM workflows, support, bookings, campaigns,
                  and analytics.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 md:justify-end">
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#7a3e9d] bg-[#7a3e9d] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#683486]"
                  href="/contact"
                >
                  CONTACT US
                  <span className="ml-3" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
