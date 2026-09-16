import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { ConnectedOperations } from "./ConnectedOperations";
import { HealthcareJourneyCards } from "./HealthcareJourneyCards";
import { HealthcareReviewCarousel } from "./HealthcareReviewCarousel";

export const metadata: Metadata = {
  title: "AI Voice Agents for Healthcare | vozon.ai",
  description:
    "AI voice agents for healthcare teams handling appointments, routine questions, reminders, call routing, and structured human handoffs.",
  alternates: { canonical: "/business/industries/healthcare" },
};

type IconName =
  | "calendar" | "chat" | "bell" | "route" | "note" | "moon"
  | "shield" | "person" | "database" | "pulse" | "phone" | "webhook";

const careSettings = [
  { title: "Hospitals", detail: "Departments and switchboards", icon: "pulse" },
  { title: "Clinics", detail: "Appointments and enquiries", icon: "calendar" },
  { title: "Diagnostic centres", detail: "Preparation and scheduling", icon: "database" },
  { title: "Care networks", detail: "Routing across locations", icon: "route" },
  { title: "Specialist practices", detail: "Structured patient intake", icon: "note" },
] satisfies { title: string; detail: string; icon: IconName }[];

const useCases = [
  { number: "01", icon: "calendar", title: "Appointments", description: "Book, confirm, reschedule, or cancel within your configured scheduling rules.", outcome: "Calendar updated", featured: false },
  { number: "02", icon: "chat", title: "Patient FAQs", description: "Answer approved questions about services, timings, locations, and preparation.", outcome: "Instant answer" },
  { number: "03", icon: "bell", title: "Reminders", description: "Support confirmations and follow-up workflows before and after appointments.", outcome: "Patient confirmed" },
  { number: "04", icon: "route", title: "Intelligent routing", description: "Understand intent and direct each caller to the appropriate team or department.", outcome: "Correct team reached" },
  { number: "05", icon: "note", title: "Message capture", description: "Collect the reason for the call and useful details for a contextual follow-up.", outcome: "Summary delivered" },
  { number: "06", icon: "moon", title: "After-hours support", description: "Handle approved routine requests outside front-desk hours and clarify next steps.", outcome: "Always available" },
] satisfies { number: string; icon: IconName; title: string; description: string; outcome: string; featured?: boolean }[];

const trustControls = [
  { icon: "person", title: "Role-based access", detail: "Keep workspace and patient-data access limited to the right people." },
  { icon: "database", title: "Protected data", detail: "Use encrypted conversations, scoped integrations, and retention controls." },
  { icon: "note", title: "Traceable activity", detail: "Review call outcomes, handoffs, and configured actions in one clear record." },
] satisfies { icon: IconName; title: string; detail: string }[];

const proofMetrics = [
  { value: "99.9%", label: "Platform uptime" },
  { value: "<500ms", label: "Average latency" },
  { value: "24/7", label: "Call availability" },
] as const;

const faqs = [
  { question: "Which healthcare calls should we automate first?", answer: "Start with a frequent administrative workflow with clear rules, such as appointment requests, office information, confirmations, message capture, or call routing." },
  { question: "Can patients book or change appointments by phone?", answer: "Yes, when the agent is connected to a supported scheduling workflow. Your team controls appointment types, availability, required details, and exceptions." },
  { question: "Can the agent transfer a patient to a staff member?", answer: "Yes. A workflow can include a human handoff when the caller needs staff attention or the request falls outside the agent's configured boundaries." },
  { question: "How is patient information handled?", answer: "Workflows should collect only necessary information and use appropriate access, retention, consent, and security controls. Each organization should review its deployment against applicable requirements." },
] as const;

const headingClass = "text-[clamp(2rem,2.8vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.04em]";
const runningCopyClass = "text-[15px] leading-7";

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18M8 14h3M8 17h7" /></>,
    chat: <><path d="M20 15a4 4 0 0 1-4 4H9l-5 3v-7a4 4 0 0 1-2-3.5V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /><path d="M7 9h10M7 13h6" /></>,
    bell: <><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 22h4" /></>,
    route: <><circle cx="5" cy="5" r="2" /><circle cx="19" cy="19" r="2" /><path d="M7 5h4a4 4 0 0 1 4 4v6a4 4 0 0 0 4 4M9 15l-4 4m0-4 4 4" /></>,
    note: <><path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M8 13h8M8 17h6" /></>,
    moon: <path d="M21 15.5A9 9 0 0 1 8.5 3 9 9 0 1 0 21 15.5Z" />,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    person: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
    pulse: <path d="M3 12h4l2-5 4 10 2-5h6" />,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" />,
    webhook: <><path d="M18 16.5a4 4 0 0 1-6.5 3M6 7.5A4 4 0 0 1 12.5 4M8 19H5a3 3 0 0 1-2.6-4.5l4.5-8" /><path d="m14 13 4.5 7.5M10 11h9a3 3 0 0 0 2.6-4.5L20 4" /></>,
  };
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">{paths[name]}</svg>;
}

function Arrow() {
  return <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20"><path d="M3.5 10h13m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>;
}

function Check({ lavender = false }: { lavender?: boolean } = {}) {
  return <span className={`grid size-5 shrink-0 place-items-center rounded-full ${lavender ? "bg-[#e8e2f1] text-[#625b7d]" : "bg-teal-100 text-teal-800"}`}><svg aria-hidden="true" className="size-3" fill="none" viewBox="0 0 12 12"><path d="m2.5 6 2.1 2.1L9.5 3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></svg></span>;
}

function Label({ children, dark = false }: { children: string; dark?: boolean }) {
  return <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${dark ? "text-teal-300" : "text-teal-700"}`}>{children}</p>;
}

export default function HealthcarePage() {
  return (
    <SiteLayout>
      <main className="overflow-hidden bg-white text-slate-950" id="healthcare-solution-page">
        <section className="relative overflow-hidden bg-white px-5 pb-8 pt-[72px] sm:px-8 sm:pb-10 sm:pt-20 lg:pb-12 lg:pt-24">
          <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
            <div className="max-w-[610px] healthcare-reveal">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d8d0e5] bg-[#faf8fc]/90 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#625b7d] shadow-sm backdrop-blur-sm">
                <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-500 opacity-50" /><span className="relative size-2 rounded-full bg-teal-600" /></span>
                AI voice agents for healthcare
              </div>
              <h1 className="mt-6 text-[clamp(2.5rem,4.5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-slate-950">Every patient call, <span className="block text-teal-700">cared for.</span></h1>
              <p className={`${runningCopyClass} mt-6 max-w-[560px] text-slate-900`}>Give patients a natural way to book, ask, confirm, and connect—while your care team stays focused on the people in front of them.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center gap-2 rounded-full bg-teal-600 px-6 text-sm font-bold text-white shadow-[0_15px_35px_rgba(13,148,136,.2)] transition hover:-translate-y-0.5 hover:bg-teal-700" href="/contact?industry=healthcare">Plan your workflow <Arrow /></Link>
                <Link className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#d8d0e5] bg-[#faf8fc]/90 px-6 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-[#a89bbb] hover:bg-white" href="/login?mode=register">See how it works</Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-600">{["24/7 call handling", "Configured boundaries", "Human handoff"].map((item) => <span className="flex items-center gap-2" key={item}><Check />{item}</span>)}</div>
            </div>
            <div className="relative mx-auto w-full max-w-[640px] healthcare-reveal healthcare-delay">
              <div className="relative h-[430px] sm:h-[530px]">
                <Image alt="Healthcare professional supporting a patient" className="healthcare-hero-image object-contain object-right-bottom" fill priority sizes="(max-width: 1024px) 100vw, 700px" src="/images/healthcare/voice-agent-hero-navy-white.png" />
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Healthcare settings" className="border-y border-slate-200/80 bg-white py-8 sm:py-10 lg:py-12">
          <p className="mb-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Built for the rhythm of modern care teams</p>
          <div className="healthcare-marquee flex w-max items-center gap-4 px-2">{[...careSettings, ...careSettings].map((item, index) => <article aria-hidden={index >= careSettings.length} className="flex h-[86px] w-72 shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_8px_24px_rgba(15,23,42,.035)]" key={`${item.title}-${index}`}><span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700"><Icon name={item.icon} /></span><div><h2 className="text-sm font-semibold text-slate-900">{item.title}</h2><p className="mt-1 line-clamp-1 text-xs text-slate-500">{item.detail}</p></div></article>)}</div>
        </section>

        <section className="border-y border-[#eee9f5] bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14" id="healthcare-use-cases">
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-3xl text-center">
              <Label>Everyday workflows</Label>
              <h2 className={`${headingClass} mt-4 text-slate-950`}>
                One calm voice for the calls that fill your day.
              </h2>
              <p className={`${runningCopyClass} mx-auto mt-5 max-w-2xl text-slate-900`}>
                Start with one high-volume administrative workflow, then expand
                using the same voice, connected tools, and operational rules.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                {["Available 24/7", "Rules-based actions", "Connected outcomes"].map(
                  (item) => (
                    <span
                      className="rounded-full border border-[#d8d0e5] bg-[#f7f4fb] px-3.5 py-2 text-[11px] font-semibold text-[#625b7d]"
                      key={item}
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((item) => (
                <article
                  className={`group flex min-h-[250px] flex-col rounded-[24px] border bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_16px_38px_rgba(13,148,136,.10)] ${
                    item.featured
                      ? "border-[#cfc7df] bg-gradient-to-br from-white to-[#f7f4fb] shadow-[0_14px_36px_rgba(109,106,156,.12)] ring-1 ring-[#e8e2f1]"
                      : "border-slate-200 shadow-[0_8px_24px_rgba(15,23,42,.04)]"
                  }`}
                  key={item.number}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid size-11 place-items-center rounded-xl ${
                        item.featured
                          ? "bg-[#e8e2f1] text-[#625b7d]"
                          : "bg-teal-50 text-teal-700"
                      }`}
                    >
                      <Icon name={item.icon} />
                    </span>

                    <span className="font-mono text-[11px] font-semibold text-slate-500">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {item.description}
                  </p>

                  <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-5 text-xs font-semibold text-teal-800">
                    <Check />
                    {item.outcome}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden bg-white px-5 py-12 sm:px-8 sm:py-14 lg:py-16"
          id="healthcare-call-journey"
        >
          <div className="relative mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-2xl text-center">
              <div>
                <Label>A call, end to end</Label>
                <h2 className={`${headingClass} mt-3 text-slate-950`}>
                  From hello to a confirmed outcome.
                </h2>
                <p className={`${runningCopyClass} mt-3 text-slate-900`}>
                  The agent listens, follows your approved workflow, and records
                  a clear result for your team.
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-semibold">
                  <span className="flex items-center gap-2 rounded-full bg-[#faf8fc] px-3.5 py-2 text-[#49435f] ring-1 ring-[#d8d0e5]">
                    <Check lavender /> Natural conversation
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-[#faf8fc] px-3.5 py-2 text-[#49435f] ring-1 ring-[#d8d0e5]">
                    <Check lavender /> Clear outcome
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[.88fr_1.12fr] lg:items-stretch">
              <div className="relative min-h-[380px] self-stretch overflow-hidden bg-white lg:min-h-0">
                <div className="absolute left-1/2 top-1/2 aspect-[1693/933] w-[126%] -translate-x-1/2 -translate-y-1/2 sm:w-[116%] lg:w-[112%]">
                  <Image
                    alt="Healthcare professional helping a patient through an appointment workflow"
                    className="healthcare-feature-image object-contain object-bottom"
                    fill
                    sizes="(max-width: 640px) 126vw, (max-width: 1024px) 116vw, 640px"
                    src="/images/healthcare/feature-appointment-support-plain.png"
                  />
                </div>
              </div>

              <HealthcareJourneyCards>
              <article className="healthcare-journey-card flex flex-col rounded-[16px] border border-teal-200 bg-white p-3.5 shadow-[0_6px_18px_rgba(15,118,110,.05)]">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-lg bg-teal-100 text-teal-800">
                    <Icon name="chat" className="size-4" />
                  </span>
                  <span className="rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-teal-800">
                    Listen · 01
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-slate-950">
                  Understand the request
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-700">
                  The caller explains what they need in their own words.
                </p>
                <div className="mt-2 grid gap-2 border-t border-slate-100 pt-2 sm:grid-cols-2">
                  <p className="w-fit max-w-[92%] rounded-xl rounded-bl-sm bg-slate-100 px-3.5 py-2.5 text-xs leading-5 text-slate-900">
                    I need to move tomorrow&apos;s appointment.
                  </p>
                  <p className="w-fit rounded-xl rounded-br-sm bg-teal-100 px-3.5 py-2.5 text-xs leading-5 text-teal-950 sm:ml-auto">
                    What day works better for you?
                  </p>
                </div>
              </article>

              <article className="healthcare-journey-card flex flex-col rounded-[16px] border border-teal-200 bg-white p-3.5 shadow-[0_6px_18px_rgba(15,118,110,.05)]">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-lg bg-teal-100 text-teal-800">
                    <Icon name="calendar" className="size-4" />
                  </span>
                  <span className="rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-teal-800">
                    Act · 02
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-slate-950">
                  Follow approved rules
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-700">
                  The agent checks the connected schedule and available options.
                </p>
                <div className="mt-2 rounded-xl border border-slate-200 bg-[#fafcfb] p-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-xs text-slate-950">Thursday, 18 Sep</strong>
                    <span className="text-[10px] font-bold text-teal-800">3 slots</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {["9:30", "10:15", "11:00"].map((time, index) => (
                      <span
                        className={`rounded-lg py-2 text-center text-[11px] font-semibold ${
                          index === 1
                            ? "border border-teal-300 bg-teal-100 text-teal-900"
                            : "border border-slate-200 bg-white text-slate-800"
                        }`}
                        key={time}
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </article>

              <article className="healthcare-journey-card flex flex-col rounded-[16px] border border-teal-200 bg-white p-3.5 shadow-[0_6px_18px_rgba(15,118,110,.05)]">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-lg bg-teal-100 text-teal-800">
                    <Icon name="note" className="size-4" />
                  </span>
                  <span className="rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-teal-800">
                    Complete · 03
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-slate-950">
                  Resolve or hand off
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-700">
                  The action is completed or transferred with useful context.
                </p>
                <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <Check /> Appointment rescheduled
                  </div>
                  <dl className="mt-2.5 grid grid-cols-2 gap-y-1.5 text-xs">
                    <dt className="text-slate-700">New time</dt>
                    <dd className="text-right font-semibold text-slate-950">Thu · 10:15</dd>
                    <dt className="text-slate-700">Summary</dt>
                    <dd className="text-right font-semibold text-slate-950">Sent to staff</dd>
                  </dl>
                </div>
              </article>
              </HealthcareJourneyCards>
            </div>
          </div>
        </section>

        <section className="border-y border-[#eee9f5] bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14" id="healthcare-reviews"><div className="mx-auto max-w-[1280px]"><HealthcareReviewCarousel /></div></section>

        <section className="border-y border-teal-100 bg-white px-5 py-10 text-slate-950 sm:px-8 sm:py-12 lg:py-14" id="healthcare-safety"><div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.18fr_.82fr] lg:items-center lg:gap-14">
          <div className="lg:order-2"><Label>Safety & human control</Label><h2 className={`${headingClass} mt-4 text-slate-950`}>Clear boundaries. Human judgment where it matters.</h2><p className={`${runningCopyClass} mt-5 max-w-xl text-slate-800`}>Your team defines the information an agent can use, the actions it can take, and the situations that always need a person.</p><ul className="mt-8 space-y-3">{["Only approved information and connected systems", "Explicit permissions for every action", "Documented escalation paths for exceptions"].map((item) => <li className="flex items-center gap-3 rounded-xl border border-teal-100 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm" key={item}><Check />{item}</li>)}</ul></div>
          <div className="rounded-[30px] border border-teal-200 bg-white p-5 shadow-[0_20px_55px_rgba(15,118,110,.12)] sm:p-7 lg:order-1"><div className="flex items-center justify-between border-b border-slate-200 pb-5"><div><p className="text-sm font-semibold text-slate-950">Conversation boundary map</p><p className="mt-1 text-xs text-slate-700">Configured by your team</p></div><span className="grid size-10 place-items-center rounded-xl bg-teal-100 text-teal-800"><Icon name="shield" /></span></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center"><div className="rounded-2xl border border-teal-200 bg-teal-50 p-5"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-950">Routine & approved</span><div className="mt-5 space-y-3">{["Office hours", "Appointment change", "Directions"].map((x) => <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-white px-3 py-2.5 text-xs font-medium text-slate-950" key={x}><Check />{x}</div>)}</div><p className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-950"><Icon name="pulse" className="size-4 text-teal-700" /> AI completes workflow</p></div><div className="hidden text-teal-700 sm:block"><Arrow /></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-950">Sensitive or uncertain</span><div className="mt-5 space-y-3">{["Clinical question", "Urgent language", "Outside permissions"].map((x) => <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-white px-3 py-2.5 text-xs font-medium text-slate-950" key={x}><span className="grid size-5 place-items-center rounded-full bg-amber-100 text-slate-950">!</span>{x}</div>)}</div><p className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-950"><Icon name="person" className="size-4 text-amber-700" /> Human takes over</p></div></div>
            <p className="mt-5 text-xs leading-5 text-slate-700">Deployment controls should be reviewed against your organization’s policies and applicable requirements.</p>
          </div>
        </div></section>

        <section className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14" id="healthcare-integrations">
          <div className="relative mx-auto max-w-[1280px]">
            <ConnectedOperations />
          </div>
        </section>

        <section className="border-y border-[#eee9f5] bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14" id="healthcare-trust">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
              <div className="max-w-xl">
                <Label>Security, compliance & proof</Label>
                <h2 className={`${headingClass} mt-4 text-slate-950`}>
                  Built for trusted healthcare operations.
                </h2>
                <p className={`${runningCopyClass} mt-5 text-slate-800`}>
                  Protect sensitive workflows with practical controls, clear oversight, and infrastructure designed for dependable patient conversations.
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5" aria-label="Compliance standards">
                  {["HIPAA", "SOC 2 Type II", "GDPR ready"].map((standard) => (
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#d8d0e5] bg-[#faf8fc] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#625b7d]" key={standard}>
                      <Icon name="shield" className="size-4 text-teal-700" />
                      {standard}
                    </span>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-[#d8d0e5] bg-white shadow-[0_18px_46px_rgba(109,106,156,.11)]">
                <div className="grid divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {proofMetrics.map((metric) => (
                    <div className="px-5 py-6 text-center" key={metric.label}>
                      <strong className="block text-3xl font-semibold tracking-[-0.04em] text-teal-700">{metric.value}</strong>
                      <span className="mt-1.5 block text-xs font-medium text-slate-600">{metric.label}</span>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 border-t border-slate-200 p-5 sm:grid-cols-3 sm:p-6">
                  {trustControls.map((control) => (
                    <article className="flex gap-3 rounded-2xl border border-[#eee9f5] bg-[#faf8fc] p-4" key={control.title}>
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-800">
                        <Icon name={control.icon} className="size-[18px]" />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-950">{control.title}</h3>
                        <p className="mt-1.5 text-xs leading-5 text-slate-600">{control.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-5 text-[11px] leading-5 text-slate-500 lg:text-right">
              Compliance depends on your configuration and operating policies; review each deployment against applicable requirements.
            </p>
          </div>
        </section>

        <section className="bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14" id="healthcare-faq">
          <div className="mx-auto max-w-[1100px]">
            <div className="mx-auto max-w-3xl text-center">
              <Label>Questions, answered</Label>
              <h2 className={`${headingClass} mt-4 text-slate-950`}>What care teams ask us first.</h2>
              <p className={`${runningCopyClass} mt-5 text-slate-900`}>The practical details to consider before introducing voice automation.</p>
            </div>
            <div className="mx-auto mt-10 max-w-[900px] space-y-3">
              {faqs.map((faq, index) => <details className="group rounded-2xl border border-[#e8e2f1] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(109,106,156,.07)] transition open:border-[#a89bbb] open:shadow-[0_12px_30px_rgba(109,106,156,.11)] sm:px-6" key={faq.question} open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold text-slate-950"><span>{faq.question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eee9f5] text-lg text-[#625b7d] transition group-open:rotate-45">+</span></summary><p className="mt-4 border-t border-[#eee9f5] pt-4 text-sm leading-7 text-slate-800">{faq.answer}</p></details>)}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14"><div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[24px] border border-[#cfc7df] bg-white px-6 py-8 text-slate-950 shadow-[0_16px_42px_rgba(109,106,156,.12)] sm:px-9 lg:px-11 lg:py-9"><div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center"><div className="max-w-3xl"><Label>Ready when you are</Label><h2 className="mt-2.5 text-[clamp(1.6rem,2.3vw,2.1rem)] font-semibold leading-[1.12] tracking-[-0.04em] text-slate-950">Bring us the call you want to improve.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">We’ll map the workflow, integrations, boundaries, and human handoff with your team.</p><p className="mt-3 flex items-center gap-2 text-xs text-slate-600"><Check />Start with a focused workflow · expand at your pace</p></div><Link className="inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-teal-600 px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(15,118,110,.18)] transition hover:-translate-y-0.5 hover:bg-teal-700" href="/contact?industry=healthcare">Contact us</Link></div></div></section>

      </main>

      <style>{`
        #healthcare-solution-page > section:not(:first-child):not(:last-child) { padding-block: 2rem; }
        @media (min-width:640px) { #healthcare-solution-page > section:not(:first-child):not(:last-child) { padding-block: 2.5rem; } }
        @media (min-width:1024px) { #healthcare-solution-page > section:not(:first-child):not(:last-child) { padding-block: 3rem; } }
        .marketing-site:has(#healthcare-solution-page) .site-pre-footer-cta {
          margin-top: 165px;
          overflow: visible;
        }
        .marketing-site:has(#healthcare-solution-page) .site-pre-footer-cta::before {
          content: "";
          position: absolute;
          z-index: 1;
          left: 50%;
          top: -165px;
          width: 540px;
          height: 540px;
          border-radius: 50%;
          background: #000;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .marketing-site:has(#healthcare-solution-page) .site-pre-footer-cta::after {
          content: "↓";
          position: absolute;
          z-index: 2;
          left: 50%;
          top: -125px;
          color: #fff;
          font-size: 64px;
          font-weight: 300;
          line-height: 1;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .marketing-site:has(#healthcare-solution-page) .site-pre-footer-cta > * {
          position: relative;
          z-index: 3;
        }
        .marketing-site:has(#healthcare-solution-page) .site-pre-footer-cta > div {
          position: static;
        }
        .marketing-site:has(#healthcare-solution-page) .site-pre-footer-cta > div::after {
          content: "";
          position: absolute;
          z-index: 4;
          right: 0;
          bottom: 0;
          left: 0;
          height: 1px;
          background: #3a3a3a;
          pointer-events: none;
        }
        .marketing-site:has(#healthcare-solution-page) .site-pre-footer-cta > div > * {
          position: relative;
          z-index: 3;
        }
        .healthcare-hero-image {
          opacity: .98;
          filter: saturate(.96) contrast(.98) drop-shadow(0 24px 34px rgba(15,118,110,.12));
          transform: scale(1.08) translate(3%, -1.5%);
          transform-origin: right bottom;
          mask-image: radial-gradient(ellipse 82% 90% at 62% 50%, #000 66%, rgba(0,0,0,.9) 76%, rgba(0,0,0,.45) 86%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 82% 90% at 62% 50%, #000 66%, rgba(0,0,0,.9) 76%, rgba(0,0,0,.45) 86%, transparent 100%);
        }
        .healthcare-feature-image {
          opacity: .98;
          filter: saturate(.96) contrast(.98) drop-shadow(0 24px 34px rgba(15,118,110,.12));
          transform: scale(1.02);
          transform-origin: center bottom;
          mask-image: linear-gradient(to bottom, #000 0%, #000 80%, rgba(0,0,0,.92) 87%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 80%, rgba(0,0,0,.92) 87%, transparent 100%);
        }
        .healthcare-marquee { animation: healthcare-marquee 30s linear infinite; will-change: transform; }
        .healthcare-marquee:hover { animation-play-state: paused; }
        .healthcare-reveal { animation: healthcare-rise .7s cubic-bezier(.2,.75,.3,1) both; }
        .healthcare-delay { animation-delay: .12s; }
        .healthcare-journey-card { opacity: 0; transform: translate3d(48px, 14px, 0) scale(.98); transition: border-color .3s ease, box-shadow .3s ease; will-change: opacity, transform; }
        .healthcare-journey-card:hover { border-color: rgba(13,148,136,.45); box-shadow: 0 12px 30px rgba(13,148,136,.10); }
        .healthcare-journey-cards.is-visible .healthcare-journey-card { animation: healthcare-journey-rise .75s cubic-bezier(.2,.75,.3,1) forwards; }
        .healthcare-journey-cards.is-visible .healthcare-journey-card:nth-child(2) { animation-delay: .18s; }
        .healthcare-journey-cards.is-visible .healthcare-journey-card:nth-child(3) { animation-delay: .36s; }
        @keyframes healthcare-marquee { from { transform: translateX(0); } to { transform: translateX(calc(-50% - .5rem)); } }
        @keyframes healthcare-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes healthcare-journey-rise { from { opacity: 0; transform: translate3d(48px, 14px, 0) scale(.98); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } }
        @media (max-width: 640px) {
          .marketing-site:has(#healthcare-solution-page) .site-pre-footer-cta { margin-top: 155px; }
          .marketing-site:has(#healthcare-solution-page) .site-pre-footer-cta::before { top: -155px; width: 540px; height: 540px; border-radius: 50%; }
          .marketing-site:has(#healthcare-solution-page) .site-pre-footer-cta::after { top: -115px; }
           .healthcare-hero-image { transform: scale(1.04) translate(2%, -2%); transform-origin: center bottom; }
          .healthcare-marquee { width: auto; overflow-x: auto; padding-inline: 1.25rem; animation: none; }
          .healthcare-marquee > :nth-child(n+6) { display: none; }
        }
        @media (prefers-reduced-motion: reduce) { .healthcare-marquee, .healthcare-reveal, .healthcare-journey-card { opacity: 1; transform: none; animation: none; transition: none; } }
      `}</style>
    </SiteLayout>
  );
}
