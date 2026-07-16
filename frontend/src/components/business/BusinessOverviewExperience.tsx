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

function CheckIcon() {
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#45ddce]/12 text-[#75fff0]" aria-hidden="true">
      <svg className="size-3" fill="none" viewBox="0 0 12 12">
        <path d="m2.5 6.2 2.1 2.1 4.9-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      </svg>
    </span>
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
    <div className="relative mx-auto w-full max-w-[650px]">
      <div className="absolute -inset-12 -z-10 rounded-full bg-[#45ddce]/10 blur-[90px]" aria-hidden="true" />
      <div className="overflow-hidden rounded-[24px] border border-white/12 bg-[#06110f] shadow-[0_36px_110px_rgba(0,0,0,0.55)]">
        <div className="flex h-12 items-center justify-between border-b border-white/[0.08] bg-white/[0.025] px-4">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-[#45ddce] text-[10px] font-black text-[#03110e]">V</span>
            <span className="text-[10px] font-bold text-white/70">Voice operations</span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2.5 py-1 text-[9px] font-bold text-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" /> All systems live
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
      <div className="overflow-hidden bg-[#020504] text-white">
        <section className="relative px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:pb-28 lg:pt-44">
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(69,221,206,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(69,221,206,0.055)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" aria-hidden="true" />
          <div className="absolute left-1/2 top-0 h-[520px] w-[940px] -translate-x-1/2 rounded-full bg-[#45ddce]/[0.07] blur-[135px]" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#45ddce]/22 bg-[#45ddce]/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.17em] text-[#75fff0]">
                <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_10px_#45ddce]" /> AI voice for business
              </div>
              <h1 className="mt-7 text-[clamp(2.7rem,5.7vw,5.4rem)] leading-[0.96] font-black tracking-[-0.05em]">
                Every customer call, <span className="text-[#75fff0]">handled with purpose.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-white/56 sm:text-lg">
                Give sales, support, and operations teams AI phone agents that answer naturally, complete real work, and know exactly when to involve a person.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#45ddce] px-6 text-sm font-black text-[#03110e] shadow-[0_18px_48px_rgba(69,221,206,0.20)] hover:bg-[#75fff0]" href="/login">Start building <ArrowIcon /></Link>
                <Link className="inline-flex min-h-12 items-center rounded-full border border-white/14 bg-white/[0.045] px-6 text-sm font-black text-white hover:border-[#45ddce]/35 hover:bg-[#45ddce]/[0.07]" href="#contact">Talk to our team</Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[11px] font-bold text-white/38">
                {["Inbound and outbound", "Human handoffs", "Call-level analytics"].map((item) => <span className="flex items-center gap-2" key={item}><CheckIcon />{item}</span>)}
              </div>
            </div>
            <OperationsConsole />
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-white/[0.018] px-5 sm:px-8">
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 lg:grid-cols-4">
            {outcomes.map((outcome, index) => (
              <div className="border-b border-r border-white/[0.07] px-5 py-7 even:border-r-0 lg:border-b-0 lg:even:border-r lg:last:border-r-0" key={outcome.label}>
                <strong className={`block text-2xl font-black ${index === 1 ? "text-[#c6bdff]" : index === 2 ? "text-[#ffbd8c]" : "text-[#75fff0]"}`}>{outcome.value}</strong>
                <span className="mt-1.5 block text-[11px] font-bold text-white/36">{outcome.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28" id="use-cases">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div><p className="text-[10px] font-black uppercase tracking-[0.19em] text-[#75fff0]">High-value workflows</p><h2 className="mt-5 text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.02] font-black tracking-[-0.04em]">Start where calls create the most work.</h2></div>
              <p className="max-w-2xl text-sm leading-7 text-white/48 lg:justify-self-end sm:text-base">Deploy one focused workflow first, connect it to a measurable business outcome, and expand from what your team learns in production.</p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {useCases.map((useCase, index) => (
                <Link className="group relative min-h-[300px] overflow-hidden rounded-[22px] border border-white/[0.09] bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.045] sm:p-8" href={`/business/${useCase.slug}`} key={useCase.slug}>
                  <div className={`absolute -right-20 -top-20 size-56 rounded-full blur-[70px] ${index === 1 ? "bg-[#8f83e8]/12" : index === 2 ? "bg-[#f28d45]/10" : "bg-[#45ddce]/10"}`} aria-hidden="true" />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-5">
                      <span className={`grid size-11 place-items-center rounded-xl border ${index === 1 ? "border-[#8f83e8]/25 bg-[#8f83e8]/10 text-[#c6bdff]" : index === 2 ? "border-[#f28d45]/25 bg-[#f28d45]/10 text-[#ffbd8c]" : "border-[#45ddce]/25 bg-[#45ddce]/10 text-[#75fff0]"}`}><BusinessIcon index={index} /></span>
                      <span className="text-white/25 transition group-hover:translate-x-1 group-hover:text-white/70"><ArrowIcon /></span>
                    </div>
                    <p className="mt-8 text-[10px] font-black uppercase tracking-[0.14em] text-white/32">{useCase.highlights[0]}</p>
                    <h3 className="mt-3 text-2xl font-black tracking-[-0.025em]">{useCase.title}</h3>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">{useCase.summary}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-7">{useCase.highlights.slice(1).map((highlight) => <span className="rounded-full border border-white/[0.08] bg-black/20 px-3 py-1.5 text-[9px] font-bold text-white/35" key={highlight}>{highlight}</span>)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-[#050b09] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-[1280px]">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.19em] text-[#75fff0]">One continuous operation</p>
              <h2 className="mt-5 text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.02] font-black tracking-[-0.04em]">From first hello to completed work.</h2>
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/48 sm:text-base">Vozon carries context through the entire conversation so customers get answers and teams get clean, actionable outcomes.</p>
            </div>
            <div className="mt-14 grid overflow-hidden rounded-[22px] border border-white/[0.09] md:grid-cols-2 lg:grid-cols-4">
              {workflowSteps.map((step, index) => (
                <article className="group relative min-h-[300px] border-b border-white/[0.08] bg-white/[0.02] p-6 last:border-b-0 md:border-r md:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0 sm:p-7" key={step.number}>
                  <div className={`absolute inset-x-0 top-0 h-px ${index === 1 ? "bg-[#8f83e8]" : index === 2 ? "bg-[#f28d45]" : "bg-[#45ddce]"}`} />
                  <div className="flex items-center justify-between"><span className="text-[10px] font-black text-white/28">{step.number}</span><span className={`size-2 rounded-full ${index === 1 ? "bg-[#8f83e8]" : index === 2 ? "bg-[#f28d45]" : "bg-[#45ddce]"}`} /></div>
                  <p className="mt-10 text-[10px] font-black uppercase tracking-[0.15em] text-white/35">{step.label}</p>
                  <h3 className="mt-4 text-xl font-black leading-tight">{step.title}</h3>
                  <p className="mt-4 text-xs leading-6 text-white/38">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28" id="industries">
          <div className="mx-auto max-w-[1280px]">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div className="max-w-3xl"><p className="text-[10px] font-black uppercase tracking-[0.19em] text-[#75fff0]">Built for your operating reality</p><h2 className="mt-5 text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.02] font-black tracking-[-0.04em]">Voice workflows shaped for every industry.</h2></div>
              <p className="max-w-md text-sm leading-7 text-white/45">Adapt language, routing, urgency, integrations, and escalation rules to the way your market serves customers.</p>
            </div>

            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map((industry, index) => (
                <Link className="group flex min-h-[230px] flex-col rounded-[18px] border border-white/[0.09] bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-[#45ddce]/25 hover:bg-[#45ddce]/[0.04]" href={`/business/industries/${industry.slug}`} key={industry.slug}>
                  <div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg border border-[#45ddce]/18 bg-[#45ddce]/[0.07] text-[#75fff0]"><BusinessIcon index={index} /></span><span className="text-white/20 transition group-hover:translate-x-1 group-hover:text-[#75fff0]"><ArrowIcon /></span></div>
                  <h3 className="mt-8 text-lg font-black">{industry.title}</h3>
                  <p className="mt-3 line-clamp-3 text-xs leading-5 text-white/38">{industry.summary}</p>
                  <span className="mt-auto pt-5 text-[9px] font-black uppercase tracking-[0.12em] text-[#75fff0]">{industry.highlights[0]}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-[#050b09] px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#07110f] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-[10px] font-black uppercase tracking-[0.19em] text-[#75fff0]">Enterprise ready</p>
              <h2 className="mt-5 max-w-xl text-3xl leading-tight font-black tracking-[-0.035em] sm:text-4xl">Control the experience without slowing down the operation.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/45">Give teams the freedom to launch useful automation while keeping credentials, handoffs, usage, and conversation quality visible.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {readinessItems.map((item) => <span className="flex items-center gap-3 text-xs font-semibold text-white/60" key={item}><CheckIcon />{item}</span>)}
              </div>
            </div>
            <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden border-t border-white/[0.08] bg-[radial-gradient(circle_at_80%_15%,rgba(69,221,206,0.2),transparent_38%),linear-gradient(145deg,#0b211a,#06110e)] p-7 lg:border-l lg:border-t-0 sm:p-10">
              <div className="absolute right-[-70px] top-[-70px] size-64 rounded-full border border-[#45ddce]/15" aria-hidden="true" />
              <div className="relative"><span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-1.5 text-[9px] font-bold text-emerald-200"><span className="size-1.5 rounded-full bg-emerald-300" /> Production ready</span><h3 className="mt-6 text-2xl font-black">Plan your rollout with our solutions team.</h3><p className="mt-4 text-sm leading-6 text-white/45">Map call volume, systems, security needs, and human escalation paths before going live.</p></div>
              <div className="relative mt-12 grid grid-cols-2 gap-3">{[["Custom", "Concurrency"], ["Priority", "Support"], ["Tailored", "Workflows"], ["Visible", "Usage"]].map(([value, label]) => <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4" key={label}><strong className="block text-sm text-[#75fff0]">{value}</strong><span className="mt-1 block text-[9px] text-white/30">{label}</span></div>)}</div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[28px] border border-[#45ddce]/20 bg-[linear-gradient(125deg,rgba(69,221,206,0.16),rgba(143,131,232,0.08)_55%,rgba(242,141,69,0.1))] p-8 text-center shadow-[0_36px_100px_rgba(0,0,0,0.34)] sm:p-12 lg:p-16">
            <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#75fff0] to-transparent" />
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#75fff0]">Ready for better conversations?</p>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl leading-tight font-black tracking-[-0.04em] sm:text-5xl">Put your next customer workflow on voice.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/52 sm:text-base">Start with free usage, or work with our team to design a production rollout around your call volume and systems.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3"><Link className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#45ddce] px-6 text-sm font-black text-[#03110e]" href="/login">Start building <ArrowIcon /></Link><Link className="inline-flex min-h-12 items-center rounded-full border border-white/14 bg-black/20 px-6 text-sm font-black text-white" href="/pricing">View pricing</Link><Link className="inline-flex min-h-12 items-center rounded-full border border-white/14 bg-black/20 px-6 text-sm font-black text-white" href="#contact">Contact sales</Link></div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
