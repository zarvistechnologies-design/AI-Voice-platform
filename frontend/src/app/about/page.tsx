import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "About vozon.ai | AI Voice Agents for Business",
  description:
    "vozon.ai is a platform for building, deploying, and improving AI voice agents for support, sales, scheduling, and business operations.",
};

const workflowSteps = [
  {
    number: "01",
    title: "Define the job",
    body: "Choose the calls the agent should handle, the outcome it should reach, its speaking style, and the situations it must escalate.",
    accent: "#45ddce",
  },
  {
    number: "02",
    title: "Connect knowledge and tools",
    body: "Ground responses in approved information and connect the systems needed to check availability, create records, or trigger follow-up.",
    accent: "#67e8f9",
  },
  {
    number: "03",
    title: "Test real call paths",
    body: "Review common requests, interruptions, unclear answers, integration failures, and human handoffs before sending calls live.",
    accent: "#a78bfa",
  },
  {
    number: "04",
    title: "Launch and improve",
    body: "Monitor outcomes, transcripts, summaries, latency, and usage so the workflow can improve from real conversations.",
    accent: "#f6c76e",
  },
] as const;

const operatingStandards = [
  {
    title: "Grounded responses",
    body: "Agents answer from the knowledge and instructions approved for that workflow.",
    accent: "#45ddce",
  },
  {
    title: "Scoped actions",
    body: "Tool access can be limited to the specific data and actions required for the call.",
    accent: "#67e8f9",
  },
  {
    title: "Human escalation",
    body: "Transfer rules can use intent, urgency, confidence, or a direct request from the caller.",
    accent: "#a78bfa",
  },
  {
    title: "Call-level visibility",
    body: "Teams can review what happened, what the agent did, and what each call cost.",
    accent: "#f6c76e",
  },
] as const;

const workflows = [
  {
    title: "Customer support",
    body: "Answer routine questions, look up requests, and route complex issues with context.",
    outcome: "Shorter queues",
    color: "#45ddce",
  },
  {
    title: "Lead qualification",
    body: "Capture intent, fit, timing, and the next step before a sales follow-up.",
    outcome: "Cleaner handoffs",
    color: "#67e8f9",
  },
  {
    title: "Scheduling",
    body: "Book, reschedule, or cancel appointments using live availability.",
    outcome: "Fewer missed calls",
    color: "#a78bfa",
  },
  {
    title: "Follow-up operations",
    body: "Run reminders, status updates, confirmations, and structured outbound calls.",
    outcome: "Consistent follow-through",
    color: "#f6c76e",
  },
] as const;

const waveform = [18, 31, 48, 28, 64, 88, 54, 76, 38, 92, 61, 42, 72, 35, 58, 26, 46, 22];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
      <path d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-full" style={{ backgroundColor: `${color}18`, color }} aria-hidden="true">
      <svg className="size-3.5" fill="none" viewBox="0 0 14 14">
        <path d="m3 7.2 2.4 2.4L11 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    </span>
  );
}

export default function AboutPage() {
  return (
    <SiteLayout>
      <div className="overflow-hidden bg-black text-white">
        <section className="relative border-b border-white/[0.08] bg-black px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:px-12 lg:pb-28">
          <div className="pointer-events-none absolute left-1/2 top-28 h-px w-[min(1040px,86vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#45ddce]/35 to-transparent" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#45ddce]/20 bg-[#45ddce]/[0.07] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_10px_#45ddce]" aria-hidden="true" />
                About vozon.ai
              </span>
              <h1 className="mt-7 max-w-4xl text-[clamp(3rem,6.6vw,5.7rem)] font-medium leading-[0.98] tracking-[-0.055em]">
                AI voice agents for work that <span className="bg-gradient-to-r from-[#75fff0] via-[#67e8f9] to-[#b9a5ff] bg-clip-text text-transparent">starts with a call.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
                vozon.ai is a platform for building, deploying, and improving AI agents that handle inbound and outbound calls, use approved business tools, and transfer to people with context.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#45ddce] to-[#67e8f9] px-6 text-sm font-bold text-[#02110d] shadow-[0_14px_40px_rgba(69,221,206,0.18)] transition hover:-translate-y-0.5" href="/product">
                  Explore the platform <ArrowIcon />
                </Link>
                <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.035] px-6 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/[0.07]" href="/#contact">
                  Contact us <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[500px] lg:mx-0 lg:justify-self-end">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black p-5 shadow-[0_32px_100px_rgba(0,0,0,0.48)] sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-[#45ddce]/10 text-[#75fff0]">
                      <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
                        <path d="M10 3.5v13M6.5 6v8M13.5 6v8M3 8.5v3M17 8.5v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
                      </svg>
                    </span>
                    <div>
                      <strong className="block text-sm">Appointment agent</strong>
                      <span className="mt-0.5 block text-[10px] text-white/35">Call in progress</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-200">
                    <span className="size-1.5 rounded-full bg-emerald-300" /> Live
                  </span>
                </div>

                <div className="my-9 flex h-28 items-center justify-center gap-1.5" aria-label="Decorative voice waveform">
                  {waveform.map((height, index) => (
                    <span className="w-1.5 rounded-full bg-gradient-to-t from-[#45ddce] to-[#b9a5ff] opacity-80" key={`${height}-${index}`} style={{ height: `${height}%` }} />
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Intent", "Reschedule"],
                    ["Tool", "Calendar"],
                    ["Action", "Slot checked"],
                  ].map(([label, value], index) => (
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3" key={label}>
                      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/30">{label}</span>
                      <strong className={`mt-1.5 block text-xs ${index === 0 ? "text-[#75fff0]" : index === 1 ? "text-[#8deaff]" : "text-[#c6b7ff]"}`}>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-16 grid max-w-[1180px] grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-black/40 sm:grid-cols-4">
            {[
              ["Inbound + outbound", "Call coverage", "#45ddce"],
              ["Live", "Tool actions", "#67e8f9"],
              ["Contextual", "Human handoffs", "#a78bfa"],
              ["Per call", "Usage visibility", "#f6c76e"],
            ].map(([value, label, color]) => (
              <div className="relative border-white/10 px-5 py-5 odd:border-r sm:border-r sm:last:border-r-0" style={{ backgroundImage: `linear-gradient(145deg, ${color}12, transparent 60%)` }} key={label}>
                <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} aria-hidden="true" />
                <strong className="block text-lg font-semibold" style={{ color }}>{value}</strong>
                <span className="mt-1 block text-xs text-white/35">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="relative min-h-[500px] overflow-hidden rounded-[28px] border border-white/10">
              <Image alt="Voice recording equipment in a studio" className="object-cover" fill sizes="(max-width: 1024px) 100vw, 46vw" src="/service-images/voice-studio.jpg" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-5 bottom-5 grid gap-2 sm:inset-x-7 sm:bottom-7 sm:grid-cols-3">
                {[
                  ["01", "Understand intent"],
                  ["02", "Complete an action"],
                  ["03", "Return the outcome"],
                ].map(([number, label]) => (
                  <div className="rounded-xl border border-white/10 bg-black/70 p-3 backdrop-blur-md" key={number}>
                    <span className="text-[9px] font-bold text-[#75fff0]">{number}</span>
                    <strong className="mt-1.5 block text-xs">{label}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pl-8">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#75fff0]">Why vozon.ai exists</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Routine calls create real operational work.</h2>
              <div className="mt-7 grid gap-5 text-sm leading-7 text-white/50 sm:text-base sm:leading-8">
                <p>Scheduling an appointment, qualifying a lead, checking a status, or answering a policy question may be repetitive for a business, but each call still matters to the person making it.</p>
                <p>Handling that work manually creates missed calls, long queues, and inconsistent follow-up. Using separate tools for telephony, speech, AI, and analytics makes the workflow harder to operate and improve.</p>
                <p className="font-medium text-white/80">vozon.ai brings those parts together so teams can automate a defined call workflow while keeping knowledge, actions, handoffs, quality, and usage visible.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.08] bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#b9a5ff]">How the platform works</p>
                <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">A controlled path from workflow design to live calls.</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/45 lg:justify-self-end">Start with one repeatable call type, define the expected outcome, and expand only after the workflow performs reliably.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {workflowSteps.map((step) => (
                <article className="relative min-h-72 overflow-hidden rounded-[22px] border p-6 transition duration-300 hover:-translate-y-1" key={step.title} style={{ borderColor: `${step.accent}30`, background: `radial-gradient(circle at 90% 0%, ${step.accent}18, transparent 42%), #000` }}>
                  <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundColor: `${step.accent}16`, color: step.accent }}>{step.number}</span>
                  <h3 className="mt-14 text-xl font-semibold tracking-[-0.025em]">{step.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/45">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#f6c76e]">Accountable automation</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Teams remain responsible and in control.</h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/45">Voice agents should operate inside clear boundaries, expose what happened, and involve a person when the workflow requires judgment.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {operatingStandards.map((standard) => (
                <article className="rounded-[20px] border p-6" style={{ borderColor: `${standard.accent}28`, background: `linear-gradient(145deg, ${standard.accent}0d, #000 62%)` }} key={standard.title}>
                  <CheckIcon color={standard.accent} />
                  <h3 className="mt-8 text-xl font-semibold">{standard.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/45">{standard.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.08] bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#f58bc1]">Where voice agents fit</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Focused workflows with a clear outcome.</h2>
            </div>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {workflows.map((workflow) => (
                <article className="flex min-h-64 flex-col rounded-[20px] border p-6" style={{ borderColor: `${workflow.color}28`, background: `linear-gradient(155deg, ${workflow.color}0d, #000 58%)` }} key={workflow.title}>
                  <span className="size-2 rounded-full" style={{ backgroundColor: workflow.color, boxShadow: `0 0 14px ${workflow.color}` }} aria-hidden="true" />
                  <h3 className="mt-8 text-xl font-semibold">{workflow.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/45">{workflow.body}</p>
                  <span className="mt-auto border-t border-white/10 pt-4 text-xs font-semibold" style={{ color: workflow.color }}>{workflow.outcome}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black px-5 py-20 sm:px-8 lg:px-12">
          <div className="relative mx-auto overflow-hidden rounded-[28px] border border-[#67e8f9]/15 bg-black px-6 py-14 shadow-[0_32px_100px_rgba(0,0,0,0.35)] sm:px-10 lg:px-14 lg:py-16">
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#75fff0]">Start with one workflow</p>
                <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Choose a repeatable call. Define the outcome. Build from there.</h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50">Explore the platform or contact us to discuss the calls, systems, and handoff requirements involved.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#45ddce] to-[#67e8f9] px-6 text-sm font-bold text-[#02110d] transition hover:-translate-y-0.5" href="/login">Start building <ArrowIcon /></Link>
                <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-bold text-white transition hover:bg-white/[0.08]" href="/#contact">Contact us <ArrowIcon /></Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
