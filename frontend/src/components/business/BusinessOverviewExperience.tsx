import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { businessPages } from "@/config/site";

const outcomes = [
  { value: "24/7", label: "Always-on call coverage" },
  { value: "140+", label: "Languages supported" },
  { value: "100%", label: "Conversation visibility" },
  { value: "One", label: "Connected workspace" },
] as const;

const workflowSteps = [
  {
    number: "01",
    label: "Understand",
    title: "Know why every customer is calling.",
    body: "Detect intent, language, urgency, and customer context without forcing callers through rigid phone menus.",
  },
  {
    number: "02",
    label: "Resolve",
    title: "Complete routine work in the conversation.",
    body: "Answer questions, qualify requests, schedule appointments, update systems, and trigger the right next action.",
  },
  {
    number: "03",
    label: "Escalate",
    title: "Bring in people when judgment matters.",
    body: "Apply clear handoff rules and send the full call context to the right teammate, queue, or business workflow.",
  },
  {
    number: "04",
    label: "Improve",
    title: "Turn every call into operational insight.",
    body: "Review outcomes, summaries, sentiment, and trends so teams can continuously improve service and performance.",
  },
] as const;

const readinessItems = [
  "Role-based team workspaces",
  "Encrypted provider credentials",
  "Configurable human handoffs",
  "Complete call logs and summaries",
  "Usage controls and cost visibility",
  "Deployment and solution support",
] as const;

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
      <path d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function BusinessIcon({ index }: { index: number }) {
  const paths = [
    <path d="M5 5h14v14H5zM9 2v6M15 2v6M8 12h8M8 16h5" key="calendar" />,
    <path d="M4 6.5 12 3l8 3.5v6c0 4.1-3.2 7.1-8 8.5-4.8-1.4-8-4.4-8-8.5v-6ZM9 12l2 2 4-4" key="shield" />,
    <path d="M4 19V9m5 10V5m5 14v-7m5 7V3" key="analytics" />,
    <path d="M4 7h16v10H4zM8 17v3m8-3v3M8 11h8M7 3h10" key="desk" />,
  ];

  return (
    <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      {paths[index % paths.length]}
    </svg>
  );
}

function OperationsConsole() {
  const activeCalls = [
    { name: "Inbound support", detail: "Order status resolved", time: "01:42", tone: "text-[#75fff0] bg-[#45ddce]/10" },
    { name: "Lead qualification", detail: "Sales handoff ready", time: "02:18", tone: "text-[#c6bdff] bg-[#8f83e8]/10" },
    { name: "Appointment booking", detail: "Calendar confirmed", time: "00:56", tone: "text-[#ffbd8c] bg-[#f28d45]/10" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[600px]">
      <div className="business-hero-console overflow-visible">
        <div className="flex h-12 items-center justify-between px-0">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-[#45ddce] text-[10px] font-black text-[#03110e]">V</span>
            <span className="text-[10px] font-bold text-white/70">Voice operations</span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2.5 py-1 text-[9px] font-bold text-emerald-200">
            <span className="size-1.5 rounded-full bg-[#118778] shadow-[0_0_8px_#118778]" /> All systems live
          </span>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-3 gap-2.5">
            {[["1,284", "Calls"], ["91%", "Resolved"], ["4.7", "Quality"]].map(([value, label], index) => (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 sm:p-4" key={label}>
                <strong className={`block text-lg font-semibold sm:text-2xl ${index === 1 ? "text-[#75fff0]" : "text-white"}`}>{value}</strong>
                <span className="mt-1 block text-[9px] text-white/35">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div><strong className="block text-xs text-white/80">Live conversations</strong><span className="mt-1 block text-[9px] text-white/30">Across all business workflows</span></div>
                <span className="text-[9px] font-bold text-[#75fff0]">12 active</span>
              </div>
              <div className="mt-4 grid gap-2">
                {activeCalls.map((call, index) => (
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3" key={call.name}>
                    <span className={`grid size-8 place-items-center rounded-lg text-[9px] font-black ${call.tone}`}>0{index + 1}</span>
                    <div className="min-w-0"><strong className="block truncate text-[10px] text-white/75">{call.name}</strong><span className="mt-1 block truncate text-[8px] text-white/30">{call.detail}</span></div>
                    <span className="font-mono text-[8px] text-white/30">{call.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
              <div><strong className="block text-xs text-white/80">Outcome trend</strong><span className="mt-1 block text-[9px] text-white/30">Resolved calls, last 7 days</span></div>
              <div className="mt-6 flex h-28 items-end gap-1.5">
                {[42, 58, 49, 70, 62, 84, 93].map((height, index) => (
                  <span className={`flex-1 rounded-t-sm ${index === 6 ? "bg-[#45ddce]" : "bg-[#45ddce]/25"}`} key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[8px] text-white/20"><span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span></div>
              <div className="mt-4 rounded-lg border border-[#45ddce]/15 bg-[#45ddce]/[0.055] p-2.5 text-[9px] font-semibold text-[#75fff0]">Resolution improved 14%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BusinessOverviewExperience() {
  const useCases = businessPages.filter((page) => page.kicker === "Use Cases");
  const industries = businessPages.filter((page) => page.kicker === "Industries");

  return (
    <SiteLayout>
      <main id="explore-capabilities-page" className="overflow-hidden bg-white text-slate-950">
        <section className="relative border-b border-slate-200 bg-white px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:pb-24 lg:pt-40">
          <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700 shadow-sm">
                <span className="size-1.5 rounded-full bg-teal-500" /> Explore all capabilities
              </p>
              <h1 className="mt-7 text-[clamp(2.5rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-slate-950">
                One voice platform.<br /><span className="text-teal-600">Every customer workflow.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Build AI phone agents for sales, support, scheduling, and operations—connected to your tools, guided by your rules, and visible to your team.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800" href="/contact?request=demo">Book a demo <ArrowIcon /></Link>
                <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50" href="#use-cases">Browse solutions</Link>
              </div>
            </div>
            <OperationsConsole />
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white px-5 sm:px-8">
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 lg:grid-cols-4">
            {outcomes.map((outcome) => (
              <div className="border-b border-r border-slate-200 px-5 py-8 even:border-r-0 lg:border-b-0 lg:even:border-r lg:last:border-r-0" key={outcome.label}>
                <strong className="block text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{outcome.value}</strong>
                <span className="mt-2 block text-xs font-medium text-slate-500">{outcome.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:py-24" id="use-cases">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Solutions by workflow</p><h2 className="mt-4 text-[clamp(2.2rem,4.2vw,4rem)] font-semibold leading-[1.03] tracking-[-0.045em]">Start with the calls that matter most.</h2></div>
              <p className="max-w-2xl text-base leading-7 text-slate-600 lg:justify-self-end">Choose a focused use case, connect it to your business systems, and expand as your team learns what works.</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {useCases.map((useCase, index) => (
                <Link className="group flex min-h-[280px] flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.045)] transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-8" href={`/business/${useCase.slug}`} key={useCase.slug}>
                  <div className="flex items-start justify-between gap-5">
                    <span className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"><BusinessIcon index={index} /></span>
                    <span className="grid size-9 place-items-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white"><ArrowIcon /></span>
                  </div>
                  <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.13em] text-teal-700">{useCase.highlights[0]}</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-slate-950">{useCase.title}</h3>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">{useCase.summary}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-7">{useCase.highlights.slice(1).map((highlight) => <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-600" key={highlight}>{highlight}</span>)}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-[1280px]">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">How it works</p>
              <h2 className="mt-4 text-[clamp(2.2rem,4.2vw,4rem)] font-semibold leading-[1.03] tracking-[-0.045em]">From first hello to completed work.</h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">Each call follows a clear path, with context preserved from the opening question through resolution and reporting.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workflowSteps.map((step) => (
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7" key={step.number}>
                  <div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-slate-400">{step.number}</span><span className="h-px w-10 bg-slate-200" /></div>
                  <p className="mt-9 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700">{step.label}</p>
                  <h3 className="mt-3 text-xl font-semibold leading-tight text-slate-950">{step.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:py-24" id="industries">
          <div className="mx-auto max-w-[1280px]">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Solutions by industry</p><h2 className="mt-4 text-[clamp(2.2rem,4.2vw,4rem)] font-semibold leading-[1.03] tracking-[-0.045em]">Built around how your team operates.</h2></div>
              <p className="max-w-md text-sm leading-7 text-slate-600">Adapt language, routing, urgency, integrations, and escalation rules for your market.</p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map((industry, index) => (
                <Link className="group flex min-h-[240px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg" href={`/business/industries/${industry.slug}`} key={industry.slug}>
                  <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-700"><BusinessIcon index={index} /></span><span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-950"><ArrowIcon /></span></div>
                  <h3 className="mt-8 text-lg font-semibold text-slate-950">{industry.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{industry.summary}</p>
                  <span className="mt-auto pt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-teal-700">{industry.highlights[0]}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[1180px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Enterprise ready</p>
              <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Control the experience without slowing down the operation.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">Launch useful automation while keeping credentials, handoffs, usage, and conversation quality visible.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">{readinessItems.map((item) => <span className="flex items-center gap-3 text-sm font-medium text-slate-700" key={item}><span className="grid size-5 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700"><svg className="size-3" fill="none" viewBox="0 0 12 12"><path d="m2.5 6.2 2.1 2.1 4.9-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></svg></span>{item}</span>)}</div>
            </div>
            <div className="flex flex-col justify-between border-t border-slate-200 bg-slate-950 p-8 text-white lg:border-l lg:border-t-0 sm:p-10">
              <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-300">Plan your rollout</p><h3 className="mt-5 text-2xl font-semibold">Build the right production setup from day one.</h3><p className="mt-4 text-sm leading-7 text-slate-400">Map call volume, systems, security needs, and human escalation paths with our solutions team.</p></div>
              <Link className="mt-10 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-teal-600 px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(13,148,136,0.24)] transition hover:-translate-y-0.5 hover:bg-teal-500" href="/contact">Talk to our team <ArrowIcon /></Link>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
