import type { Metadata } from "next";
import Image from "next/image";

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
    accent: "text-[#75fff0]",
    dot: "bg-[#45ddce] shadow-[0_0_10px_rgba(69,221,206,0.55)]",
    border: "hover:border-[#45ddce]/45",
    wash: "from-[#45ddce]/[0.11]",
  },
  {
    number: "02",
    title: "CRM and client dashboards",
    body: "Manage contacts, leads, calls, chats, transcripts, tickets, documents, campaigns, and performance in one client-ready business dashboard.",
    accent: "text-[#7dd3fc]",
    dot: "bg-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.55)]",
    border: "hover:border-[#38bdf8]/45",
    wash: "from-[#38bdf8]/[0.11]",
  },
  {
    number: "03",
    title: "Customer query handling",
    body: "Answer common questions, create tickets for complex issues, track complaints, assign an owner, and hand important conversations to the team with context.",
    accent: "text-[#c4b5fd]",
    dot: "bg-[#a78bfa] shadow-[0_0_10px_rgba(167,139,250,0.55)]",
    border: "hover:border-[#a78bfa]/45",
    wash: "from-[#a78bfa]/[0.11]",
  },
  {
    number: "04",
    title: "Bookings and approval workflows",
    body: "Coordinate appointments, reminders, and client requests while moving internal decisions through clear pending, reviewed, approved, or rejected stages.",
    accent: "text-[#fcd34d]",
    dot: "bg-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.55)]",
    border: "hover:border-[#f59e0b]/45",
    wash: "from-white/[0.035]",
  },
  {
    number: "05",
    title: "Leads, campaigns, and follow-ups",
    body: "Capture and qualify leads, schedule next steps, and automate reminders, promotions, payment nudges, and re-engagement campaigns across channels.",
    accent: "text-[#fb7185]",
    dot: "bg-[#f43f5e] shadow-[0_0_10px_rgba(244,63,94,0.55)]",
    border: "hover:border-[#f43f5e]/45",
    wash: "from-white/[0.035]",
  },
  {
    number: "06",
    title: "Integrations, knowledge, and analytics",
    body: "Connect CRMs, calendars, forms, spreadsheets, documents, APIs, and business tools while keeping knowledge, customer data, and performance insights organized.",
    accent: "text-[#86efac]",
    dot: "bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.55)]",
    border: "hover:border-[#22c55e]/45",
    wash: "from-[#22c55e]/[0.11]",
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
      <div className="min-h-screen bg-black text-white">
        <section className="relative isolate overflow-hidden px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:pb-24">
          <div className="mx-auto max-w-[1240px]">
            <header className="mx-auto max-w-[1240px] text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-4 py-2 text-[11px] font-extrabold tracking-[0.14em] text-white/70 uppercase">
                <i className="size-2 rounded-full bg-[#45ddce] shadow-[0_0_12px_rgba(69,221,206,0.8)]" />
                Partner spotlight
              </span>
              <h1 className="mt-7 text-[clamp(2.55rem,5vw,4.5rem)] leading-[1.01] font-black tracking-[-0.052em] text-balance">
                <span className="block">Connected by innovation.</span>
                <span className="block text-white lg:whitespace-nowrap">Committed to customer success.</span>
              </h1>
              <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-white/62 sm:text-xl sm:leading-9">
                DigitalBot brings WhatsApp automation, calls, chat, CRM operations, bookings, customer support, campaigns, and analytics into one connected business platform.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-2.5">
                {["Voice automation", "WhatsApp workflows", "CRM & dashboards", "Bookings", "Customer support", "Analytics"].map((item, index) => (
                  <span className={`rounded-full border px-3.5 py-1.5 text-[10px] font-bold tracking-[0.04em] ${index % 3 === 0 ? "border-[#45ddce]/20 bg-[#45ddce]/[0.055] text-[#9afff3]" : index % 3 === 1 ? "border-white/15 bg-white/[0.035] text-white/75" : "border-[#a78bfa]/20 bg-[#a78bfa]/[0.055] text-[#d8ccff]"}`} key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </header>

            <div className="relative mx-auto mt-14 max-w-[1060px] overflow-hidden rounded-[28px] border border-white/10 bg-black p-4 shadow-[0_28px_90px_rgba(0,0,0,0.32),inset_0_1px_rgba(255,255,255,0.045)] sm:mt-16 sm:p-6">
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              <div className="grid items-center gap-4 md:grid-cols-[1fr_150px_1fr]">
                <div className="flex min-h-40 items-center justify-center rounded-2xl bg-[#45ddce]/[0.035] p-7 sm:min-h-44">
                  <Image alt="Vozon" className="h-auto w-[min(250px,76%)]" height={350} src="/images/logo_2.svg" width={1160} />
                </div>

                <div className="flex flex-col items-center gap-3 py-2">
                  <span className="text-center text-[9px] font-bold tracking-[0.17em] text-white/42 uppercase">Strategic partnership</span>
                  <div className="flex w-full items-center gap-3">
                    <i className="h-px flex-1 bg-gradient-to-r from-transparent to-[#45ddce]/70" />
                    <span className="grid size-24 place-items-center rounded-full border-2 border-white/35 bg-black text-[#f3fffd] shadow-[0_0_48px_rgba(69,221,206,0.26),inset_0_1px_rgba(255,255,255,0.2)]" aria-label="Vozon and DigitalBot partnership">
                      <svg aria-hidden="true" className="size-14 drop-shadow-[0_0_8px_rgba(117,255,240,0.7)]" fill="none" viewBox="0 0 24 24">
                        <path d="m11 17 2 2a1 1 0 1 0 3-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 0 1-3-3l2.81-2.81a5.8 5.8 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </span>
                    <i className="h-px flex-1 bg-gradient-to-r from-white/35 to-transparent" />
                  </div>
                </div>

                <div className="flex min-h-40 items-center justify-center rounded-2xl bg-white/[0.025] p-7 sm:min-h-44">
                  <Image alt="DigitalBot" className="h-auto w-[min(330px,92%)]" height={520} src="/images/digitalbot_orbit.png" width={2048} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-black px-5 py-20 sm:px-8 sm:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_65%,rgba(69,221,206,0.08),transparent_28%)]" />
          <div className="relative mx-auto max-w-[1240px]">
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div>
                <span className="text-xs font-black tracking-[0.18em] text-[#ff9a75] uppercase">Inside DigitalBot</span>
                <h2 className="mt-4 text-3xl leading-tight font-black tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl">
                  Every customer interaction, connected in one place.
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-white/60 lg:justify-self-end">
                DigitalBot helps businesses manage conversations and the work behind them—from customer questions and CRM records to bookings, approvals, campaigns, follow-ups, and client-ready reporting.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {digitalBotCapabilities.map((capability) => (
                <article className={`group relative min-h-60 overflow-hidden rounded-[22px] border border-white/8 bg-gradient-to-br ${capability.wash} to-transparent p-7 shadow-[inset_0_1px_rgba(255,255,255,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(0,0,0,0.3),inset_0_1px_rgba(255,255,255,0.06)] ${capability.border}`} key={capability.number}>
                  <i aria-hidden="true" className={`absolute -right-14 -top-14 size-36 rounded-full bg-current opacity-[0.055] blur-2xl ${capability.accent}`} />
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[10px] font-bold tracking-[0.12em] ${capability.accent}`}>DIGITALBOT / {capability.number}</span>
                    <i className={`size-2 rounded-full ${capability.dot}`} />
                  </div>
                  <h3 className="mt-7 text-xl font-extrabold text-white/94">{capability.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-white/58 sm:text-base">{capability.body}</p>
                </article>
              ))}
            </div>

          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[28px] border border-white/9 bg-black p-6 sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
              <div>
                <span className="text-xs font-black tracking-[0.18em] text-[#ff9a75] uppercase">DigitalBot workflow</span>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] sm:text-4xl">From first message to finished work</h2>
                <p className="mt-5 text-base leading-8 text-white/60 sm:text-lg">
                  DigitalBot connects each customer interaction with the record, owner, workflow, and next step it needs—without losing context along the way.
                </p>
              </div>

              <ol className="grid gap-3">
                {workflow.map((step, index) => (
                  <li className="flex items-center gap-4 border-b border-white/8 px-1 py-4 last:border-b-0 sm:py-5" key={step}>
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#45ddce]/20 bg-[#45ddce]/8 font-mono text-[10px] font-bold text-[#75fff0]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base font-semibold leading-7 text-white/78 sm:text-lg">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="px-[clamp(1.25rem,5vw,4.75rem)] pb-8 pt-8 text-center">
          <div className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[1.5rem] border border-[#8affed]/20 bg-[linear-gradient(120deg,#17443f_0%,#1d4050_50%,#45364d_100%)] px-6 py-8 shadow-[0_22px_64px_rgba(0,0,0,0.24),inset_0_1px_rgba(255,255,255,0.08)] sm:px-8 sm:py-10 lg:px-10 lg:py-11">
            <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-32 size-64 rounded-full bg-[#45ddce]/32 blur-[80px]" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 -right-12 size-72 rounded-full bg-[#fb7185]/22 blur-[90px]" />
            <div aria-hidden="true" className="pointer-events-none absolute right-[30%] top-0 size-52 rounded-full bg-[#9d8cff]/20 blur-[75px]" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(circle_at_center,black,transparent_76%)]" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-[18%] top-0 h-px bg-gradient-to-r from-transparent via-[#75fff0]/55 to-transparent" />
            <div className="relative mx-auto grid max-w-[1080px] gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:text-left">
            <div>
            <h2 className="text-[clamp(1.35rem,2vw,2.1rem)] leading-[1.12] font-semibold tracking-[-0.035em]">See how DigitalBot can simplify your customer operations.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs leading-5 text-white/62 sm:text-sm sm:leading-6 lg:mx-0">
              Explore DigitalBot&apos;s connected platform for customer conversations, CRM workflows, support, bookings, campaigns, and analytics.
            </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
              <a className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 text-xs font-bold text-[#0b1720] transition hover:-translate-y-0.5 hover:bg-white/90" href="https://digitalbot.ai" rel="noreferrer" target="_blank">
                Visit DigitalBot.ai <span className="ml-3" aria-hidden="true">↗</span>
              </a>
            </div>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
