import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "About vozon.ai | Turning Conversations into Action",
  description:
    "Learn how vozon.ai turns live phone conversations into connected, trackable business workflows with AI voice agents.",
};

const workflowSteps = [
  {
    number: "01",
    title: "Listen and understand",
    body: "The platform processes speech as it happens, follows the flow of the conversation, and identifies what the caller is trying to accomplish.",
    accent: "#45ddce",
  },
  {
    number: "02",
    title: "Apply business context",
    body: "It combines the caller's intent with approved knowledge, workflow instructions, and relevant information from connected systems.",
    accent: "#67e8f9",
  },
  {
    number: "03",
    title: "Respond and take action",
    body: "The agent replies in a natural voice and, within its permissions, can update a system, trigger a workflow, or bring in a person.",
    accent: "#a78bfa",
  },
  {
    number: "04",
    title: "Capture the outcome",
    body: "Each conversation becomes a structured record with its transcript, summary, actions, result, and operational signals available for review.",
    accent: "#f6c76e",
  },
] as const;

const operatingStandards = [
  {
    label: "Conversation intelligence",
    title: "Understands every conversation",
    body: "vozon.ai follows intent and context across turns, interruptions, corrections, and follow-up questions while using approved business knowledge.",
    accent: "#45ddce",
  },
  {
    label: "Governed action",
    title: "Acts within clear permissions",
    body: "Agents connect with approved business tools to complete useful actions while staying inside the roles and access rules defined by your team.",
    accent: "#67e8f9",
  },
  {
    label: "Human handoff",
    title: "Escalates with full context",
    body: "When human judgment is needed, defined handoff rules transfer the caller's intent, conversation summary, and next step to the right person.",
    accent: "#a78bfa",
  },
  {
    label: "Operational insight",
    title: "Keeps every outcome visible",
    body: "Transcripts, actions, handoffs, and results remain available for teams to review performance, improve workflows, and maintain accountability.",
    accent: "#f6c76e",
  },
] as const;

const platformLayers = [
  {
    title: "Conversation",
    body: "Manages listening, speaking, turn-taking, interruptions, and the pace of a live phone call.",
    outcome: "Natural interaction",
    color: "#45ddce",
  },
  {
    title: "Intelligence",
    body: "Uses instructions, approved knowledge, and live context to decide what to say or do next.",
    outcome: "Context-aware decisions",
    color: "#67e8f9",
  },
  {
    title: "Execution",
    body: "Connects the conversation to business systems so the agent can complete approved actions.",
    outcome: "Work completed",
    color: "#a78bfa",
  },
  {
    title: "Operations",
    body: "Turns every call into searchable records, outcomes, and signals that teams can monitor and refine.",
    outcome: "Continuous visibility",
    color: "#f6c76e",
  },
] as const;

const whatVozonDoesCards = [
  {
    number: "01",
    label: "Natural conversation",
    title: "Understand callers and respond in the moment.",
    body: "vozon.ai handles natural turn-taking, interruptions, corrections, and follow-up questions while using your approved knowledge, tone, and instructions to keep every call on track.",
    cardClass: "about-vozon-card--teal",
    accent: "#75fff0",
    badgeBackground: "rgba(69, 221, 206, 0.2)",
  },
  {
    number: "02",
    label: "Connected action",
    title: "Turn spoken requests into completed work.",
    body: "Connect CRM, calendars, help desks, knowledge bases, telephony, and webhooks so agents can check live information, update records, schedule next steps, or hand off with context.",
    cardClass: "about-vozon-card--purple",
    accent: "#cbbdff",
    badgeBackground: "rgba(167, 139, 250, 0.2)",
  },
  {
    number: "03",
    label: "Visible outcomes",
    title: "Learn from every call and improve the workflow.",
    body: "Each conversation becomes a searchable record with its transcript, summary, actions, handoff, and outcome—giving teams the signals they need to monitor quality and improve performance.",
    cardClass: "about-vozon-card--amber",
    accent: "#f6c76e",
    badgeBackground: "rgba(246, 199, 110, 0.2)",
  },
] as const;

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
      <path d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <SiteLayout>
      <div className="overflow-hidden bg-black text-white">
        <section className="relative bg-black px-5 pb-8 pt-36 sm:px-8 sm:pt-40 lg:px-10">
          <div className="relative mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center xl:gap-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#45ddce]/20 bg-[#45ddce]/[0.07] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_10px_#45ddce]" aria-hidden="true" />
                About vozon.ai
              </span>
              <h1 className="mt-7 max-w-4xl text-[clamp(1.5rem,4.2vw,3.7rem)] font-medium leading-[1.04] tracking-[-0.045em]">
                <span className="block whitespace-nowrap">
                  <span className="bg-gradient-to-r from-[#75fff0] to-[#67e8f9] bg-clip-text text-transparent">
                    Vozon
                  </span>{" "}
                  turns conversations
                </span>
                <span className="block whitespace-nowrap">
                  into business results.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
                vozon.ai turns live phone conversations into connected, trackable workflows. It listens, understands intent, responds naturally, acts across approved business systems, and records the outcome—so a call can move work forward from start to finish.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#45ddce] to-[#67e8f9] px-6 text-sm font-bold text-[#02110d] shadow-[0_14px_40px_rgba(69,221,206,0.18)] transition hover:-translate-y-0.5" href="/product">
                  Explore the platform <ArrowIcon />
                </Link>
                <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.035] px-6 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/[0.07]" href="/contact">
                  Contact us <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="relative isolate mx-auto w-full max-w-[720px] lg:translate-x-4 lg:justify-self-end">
              <Image
                alt="Intelligent voice agents that understand, engage, resolve, automate, analyze, and scale"
                className="relative z-10 h-auto w-full"
                height={1024}
                priority
                sizes="(max-width: 1024px) 100vw, 720px"
                src="/images/about_us.png"
                width={1536}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20"
                style={{
                  background:
                    "linear-gradient(to right, #000 0%, transparent 4%, transparent 96%, #000 100%), linear-gradient(to bottom, #000 0%, transparent 4%, transparent 96%, #000 100%)",
                }}
              />
            </div>
          </div>

        </section>

        <section className="bg-black px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pb-28">
          <div className="mx-auto max-w-[1380px]">
            <div className="max-w-3xl lg:mx-auto lg:text-center">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#75fff0]">What vozon.ai does</p>
              <h2 className="mt-5 text-[1.75rem] font-semibold tracking-[-0.04em] sm:whitespace-nowrap sm:text-[2.75rem]">
                Conversations that drive results.
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {whatVozonDoesCards.map((card) => (
                <article
                  className={`about-vozon-card group flex min-h-80 flex-col rounded-[24px] border p-6 transition duration-300 hover:-translate-y-2 sm:p-7 ${card.cardClass}`}
                  key={card.number}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ backgroundColor: card.badgeBackground, color: card.accent }}
                    >
                      {card.label}
                    </span>
                    <span className="text-xs font-bold" style={{ color: card.accent }}>{card.number}</span>
                  </div>
                  <h3 className="mt-14 text-2xl font-semibold leading-tight tracking-[-0.03em] text-white">{card.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-white/50 transition group-hover:text-white/70">{card.body}</p>
                  <span className="mt-auto block h-px w-12 transition-all duration-300 group-hover:w-24" style={{ backgroundColor: card.accent }} aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pb-28 lg:pt-10">
          <div className="mx-auto max-w-[1380px]">
            <div className="max-w-4xl">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#b9a5ff]">How the platform works</p>
              <h2 className="mt-5 text-[1.75rem] font-semibold tracking-[-0.04em] sm:text-[2.75rem] lg:whitespace-nowrap">From every conversation to measurable outcomes.</h2>
            </div>

            <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-start">
              <div className="relative h-[300px] w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#050807] shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:h-[400px] lg:h-[460px]">
                  <Image
                    alt="AI voice platform workflow"
                    className="h-full w-full object-cover object-center"
                    height={1069}
                    sizes="(max-width: 1024px) 100vw, 560px"
                    src="/images/about_us_2.png"
                    width={992}
                  />
              </div>

              <div className="grid auto-rows-fr gap-x-10 gap-y-8 sm:-translate-y-4 sm:grid-cols-2 lg:pl-6">
                {workflowSteps.map((step, index) => (
                  <article className={`group flex min-h-56 flex-col bg-black px-2 py-5 sm:px-4 sm:py-6 ${index >= 2 ? "sm:-translate-y-4" : ""}`} key={step.title}>
                    <span className="text-5xl font-light leading-none tracking-[-0.06em] opacity-55 transition duration-300 group-hover:opacity-100" style={{ color: step.accent }}>
                      {step.number}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white">{step.title}</h3>
                    <p className="mt-2 text-justify text-sm leading-6 text-white/45 transition duration-300 group-hover:text-white/70">{step.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pb-28 lg:pt-10">
          <div className="mx-auto max-w-[1380px]">
            <div className="max-w-3xl lg:mx-auto lg:text-center">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#f6c76e]">vozon.ai for real operations</p>
              <h2 className="mt-5 text-[1.75rem] font-semibold tracking-[-0.04em] sm:whitespace-nowrap sm:text-[2.75rem]">Accountable automation.</h2>
            </div>
            <ul className="mt-12 grid max-w-5xl gap-8 lg:translate-x-4">
              {operatingStandards.map((standard, index) => (
                <li className="group flex items-center gap-5 transition duration-300 hover:translate-x-2 sm:gap-7" key={standard.title}>
                  <span
                    className="w-12 shrink-0 text-4xl font-light leading-none tracking-[-0.06em] opacity-40 transition duration-300 group-hover:opacity-100 sm:w-16 sm:text-5xl"
                    style={{ color: standard.accent }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: standard.accent }}>
                      {standard.label}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl">{standard.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/45 transition duration-300 group-hover:text-white/70 sm:text-base sm:leading-7">
                      {standard.body}
                    </p>
                  </div>
                  <div className="hidden h-12 w-20 shrink-0 items-center justify-end gap-1 sm:flex" aria-hidden="true">
                    {[12, 25, 17, 34, 22, 10].map((height, barIndex) => (
                      <span
                        className="w-1 origin-center rounded-full opacity-45 transition duration-300 group-hover:scale-y-125 group-hover:opacity-90"
                        key={`${standard.title}-${barIndex}`}
                        style={{ backgroundColor: standard.accent, height: `${height}px` }}
                      />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-black px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pb-24 lg:pt-10">
          <div className="mx-auto max-w-[1380px]">
            <div className="max-w-3xl lg:mx-auto lg:text-center">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#f58bc1]">One connected platform</p>
              <h2 className="mt-5 text-[1.75rem] font-semibold tracking-[-0.04em] sm:text-[2.75rem]">The complete journey of a business conversation.</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 lg:mx-auto">vozon.ai coordinates four layers that would otherwise be split across separate voice, AI, integration, and analytics tools.</p>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:flex lg:gap-0">
              {platformLayers.map((layer, index) => (
                <article
                  className="platform-chevron group flex min-h-72 flex-col px-10 py-8 transition duration-300 lg:flex-1"
                  key={layer.title}
                  style={{
                    background: `linear-gradient(145deg, ${layer.color}38, ${layer.color}12 64%, rgba(0,0,0,0.96))`,
                    clipPath:
                      index === 0
                        ? "polygon(0 0, calc(100% - 22px) 0, 100% 50%, calc(100% - 22px) 100%, 0 100%)"
                        : "polygon(0 0, calc(100% - 22px) 0, 100% 50%, calc(100% - 22px) 100%, 0 100%, 22px 50%)",
                  }}
                >
                  <span className="text-xs font-bold" style={{ color: layer.color }}>
                    0{index + 1}
                  </span>
                  <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-white">{layer.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/50 transition group-hover:text-white/75">{layer.body}</p>
                  <span className="mt-auto pt-6 text-xs font-bold uppercase tracking-[0.12em]" style={{ color: layer.color }}>
                    {layer.outcome}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black px-5 pb-16 pt-4 sm:px-8 lg:px-10">
          <div className="relative mx-auto flex max-w-[1380px] flex-col items-center justify-between gap-7 overflow-hidden rounded-[24px] border border-[#35fbe0]/35 bg-[#07100d] p-8 text-center shadow-[0_24px_70px_rgba(53,251,224,0.08)] sm:p-10 md:flex-row md:text-left">
            <div
              className="pointer-events-none absolute right-[18%] top-1/2 hidden size-56 -translate-y-1/2 rounded-full border border-[#35fbe0]/15 shadow-[0_0_0_24px_rgba(53,251,224,0.025),0_0_0_54px_rgba(103,232,249,0.025)] lg:block"
              aria-hidden="true"
            />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#75fff0]">See vozon.ai in action</p>
              <h2 className="mt-3 text-[1.375rem] font-semibold tracking-[-0.02em] md:text-[1.75rem]">
                Turn the next conversation into a completed outcome.
              </h2>
            </div>
            <Link
              className="relative inline-flex min-h-12 shrink-0 items-center rounded-lg bg-[#35fbe0] px-7 text-sm font-bold text-[#031310] transition hover:-translate-y-0.5 hover:bg-[#75fff0]"
              href="/contact"
            >
              CONTACT US <span className="ml-3">&rarr;</span>
            </Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
