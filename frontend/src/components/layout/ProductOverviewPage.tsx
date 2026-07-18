import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { servicePages } from "@/config/site";

const productStages = [
  {
    key: "Build",
    eyebrow: "Design the conversation",
    title: "Build agents around the way your business works.",
    description:
      "Shape the voice, knowledge, behavior, and boundaries for every caller journey from one focused workspace.",
  },
  {
    key: "Deploy",
    eyebrow: "Connect every action",
    title: "Move from a tested agent to live calls with confidence.",
    description:
      "Connect phone numbers, business tools, team workflows, and real-time actions without rebuilding your existing stack.",
  },
  {
    key: "Monitor",
    eyebrow: "Improve with evidence",
    title: "See what happened on every call—and what to improve next.",
    description:
      "Turn conversations into searchable outcomes, quality signals, and clear follow-up work for your team.",
  },
] as const;

const stageAccents = [
  {
    number: "text-[#75fff0] border-[#45ddce]/30 bg-[#45ddce]/10",
    line: "from-[#45ddce]",
    glow: "bg-[#45ddce]/15",
  },
  {
    number: "text-[#c6bdff] border-[#8f83e8]/30 bg-[#8f83e8]/10",
    line: "from-[#8f83e8]",
    glow: "bg-[#8f83e8]/15",
  },
  {
    number: "text-[#ffbd8c] border-[#f28d45]/30 bg-[#f28d45]/10",
    line: "from-[#f28d45]",
    glow: "bg-[#f28d45]/15",
  },
] as const;

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function ProductGlyph({ type }: { type: "voice" | "workflow" | "signal" }) {
  if (type === "voice") {
    return (
      <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M5 9v6M9 6v12M13 3v18M17 7v10M21 10v4" />
      </svg>
    );
  }

  if (type === "workflow") {
    return (
      <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect height="6" rx="2" width="7" x="2" y="3" />
        <rect height="6" rx="2" width="7" x="15" y="15" />
        <path d="M9 6h4a4 4 0 0 1 4 4v5M15 18h-4a4 4 0 0 1-4-4V9" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" />
      <path d="m3 7 6-4 6 6 7-7" />
    </svg>
  );
}

function HeroConsole() {
  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <div className="absolute -inset-12 -z-10 rounded-full bg-[#45ddce]/12 blur-[90px]" />
      <div className="overflow-hidden rounded-[22px] border border-white/12 bg-[#06110f] shadow-[0_36px_100px_rgba(0,0,0,0.52)]">
        <div className="flex h-11 items-center justify-between border-b border-white/[0.08] bg-white/[0.025] px-4">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-[#ff786c]" />
            <span className="size-2 rounded-full bg-[#f4ca55]" />
            <span className="size-2 rounded-full bg-[#57d99a]" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">Vozon agent studio</span>
          <span className="flex items-center gap-1.5 text-[9px] font-black text-[#75fff0]">
            <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_8px_#45ddce]" /> Live
          </span>
        </div>

        <div className="grid min-h-[430px] sm:grid-cols-[150px_minmax(0,1fr)]">
          <aside className="hidden border-r border-white/[0.07] bg-black/20 p-3 sm:block">
            <div className="mb-5 flex items-center gap-2 px-2 py-2">
              <span className="grid size-7 place-items-center rounded-lg bg-[#45ddce] text-[10px] font-black text-[#03110e]">V</span>
              <span className="text-[11px] font-black text-white/85">Nova Reception</span>
            </div>
            {[
              ["Agent", true],
              ["Knowledge", false],
              ["Functions", false],
              ["Phone", false],
              ["Testing", false],
            ].map(([label, active]) => (
              <div className={`mt-1 rounded-lg px-3 py-2.5 text-[10px] font-bold ${active ? "bg-[#45ddce]/10 text-[#8afff2]" : "text-white/35"}`} key={String(label)}>
                {label}
              </div>
            ))}
          </aside>

          <div className="relative overflow-hidden p-4 sm:p-5">
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(69,221,206,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(69,221,206,0.08)_1px,transparent_1px)] [background-size:30px_30px]" />
            <div className="relative flex items-center justify-between gap-3">
              <div>
                <strong className="block text-sm text-white">Inbound appointment agent</strong>
                <span className="mt-1 block text-[9px] text-white/38">Production workflow · Version 12</span>
              </div>
              <button className="rounded-lg border border-[#45ddce]/30 bg-[#45ddce]/10 px-3 py-2 text-[9px] font-black text-[#8afff2]" type="button">
                Test agent
              </button>
            </div>

            <div className="relative mt-7 grid gap-3 md:grid-cols-[1fr_168px]">
              <div className="relative min-h-[285px] rounded-xl border border-white/[0.08] bg-black/25 p-4">
                <div className="absolute left-[33px] top-[55px] h-[165px] w-px bg-gradient-to-b from-[#45ddce]/70 via-[#45ddce]/30 to-[#8f83e8]/60" />
                {[
                  ["01", "Welcome caller", "Natural greeting + intent"],
                  ["02", "Check availability", "Calendar function"],
                  ["03", "Confirm next step", "Book or warm transfer"],
                ].map(([number, title, meta], index) => (
                  <div className={`relative flex items-center gap-3 rounded-xl border px-3 py-3 ${index === 1 ? "ml-5 border-[#8f83e8]/28 bg-[#8f83e8]/[0.08]" : "border-[#45ddce]/20 bg-[#45ddce]/[0.055]"} ${index > 0 ? "mt-4" : ""}`} key={title}>
                    <span className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-lg text-[9px] font-black ${index === 1 ? "bg-[#8f83e8] text-white" : "bg-[#45ddce] text-[#03110e]"}`}>{number}</span>
                    <div className="min-w-0">
                      <strong className="block truncate text-[11px] text-white/90">{title}</strong>
                      <span className="mt-1 block truncate text-[8px] text-white/35">{meta}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/[0.09] bg-[#0a1815]/95 p-3">
                <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
                  <span className="text-[9px] font-black text-white/70">Live test call</span>
                  <span className="font-mono text-[8px] text-[#75fff0]">00:38</span>
                </div>
                <div className="mt-3 rounded-lg bg-white/[0.04] p-2.5 text-[8px] leading-4 text-white/45">
                  <strong className="block text-[#75fff0]">Agent</strong>
                  How can I help with your appointment today?
                </div>
                <div className="mt-2 rounded-lg bg-[#8f83e8]/10 p-2.5 text-[8px] leading-4 text-white/45">
                  <strong className="block text-[#c6bdff]">Caller</strong>
                  I need to move it to Friday afternoon.
                </div>
                <div className="mt-5 flex h-9 items-center justify-center gap-1" aria-label="Live voice activity">
                  {[9, 19, 13, 25, 16, 29, 12, 22, 8].map((height, index) => (
                    <span className="w-1 rounded-full bg-[#45ddce]" key={index} style={{ height }} />
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-[#45ddce]/18 bg-[#45ddce]/[0.06] px-2 py-2 text-center text-[8px] font-bold text-[#75fff0]">
                  Calendar checked · 3 slots found
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="relative min-h-[390px] overflow-hidden rounded-[22px] border border-[#45ddce]/18 bg-[#06110f] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-7">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_center,rgba(69,221,206,0.13)_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-black text-white">Conversation canvas</span>
          <span className="rounded-full border border-[#45ddce]/20 bg-[#45ddce]/[0.07] px-3 py-1.5 text-[9px] font-bold text-[#75fff0]">Auto-saved</span>
        </div>
        <div className="relative mx-auto mt-10 max-w-md">
          <div className="absolute left-8 top-12 h-[190px] w-px bg-gradient-to-b from-[#45ddce] via-[#45ddce]/30 to-[#8f83e8]" />
          {[
            ["Greeting", "Understand intent and caller context"],
            ["Business knowledge", "Use approved answers and live data"],
            ["Take action", "Book, update, notify, or transfer"],
          ].map(([title, body], itemIndex) => (
            <div className={`relative flex gap-4 rounded-2xl border bg-[#091a16]/95 p-4 ${itemIndex === 1 ? "ml-12 border-[#8f83e8]/30" : "border-[#45ddce]/25"} ${itemIndex > 0 ? "mt-5" : ""}`} key={title}>
              <span className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-xl text-[10px] font-black ${itemIndex === 1 ? "bg-[#8f83e8]" : "bg-[#45ddce] text-[#03110e]"}`}>0{itemIndex + 1}</span>
              <div><strong className="text-sm text-white">{title}</strong><p className="mb-0 mt-1 text-[11px] leading-5 text-white/40">{body}</p></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="relative min-h-[390px] overflow-hidden rounded-[22px] border border-[#8f83e8]/20 bg-[#080d17] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-7">
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-[#8f83e8]/15 blur-[70px]" />
        <div className="relative flex items-center justify-between border-b border-white/[0.08] pb-5">
          <div><span className="text-xs font-black text-white">Deployment center</span><span className="mt-1 block text-[9px] text-white/35">All production channels</span></div>
          <span className="flex items-center gap-2 text-[9px] font-bold text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-300" /> Healthy</span>
        </div>
        <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["Phone numbers", "+1 (415) 555-0182", "Connected"],
            ["CRM workflow", "HubSpot contacts", "Syncing"],
            ["Calendar action", "Live availability", "Ready"],
            ["Human handoff", "Support queue", "Ready"],
          ].map(([title, detail, status], itemIndex) => (
            <div className="rounded-2xl border border-white/[0.09] bg-white/[0.035] p-4" key={title}>
              <div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-xl bg-[#8f83e8]/14 text-[#c6bdff]"><ProductGlyph type={itemIndex % 2 ? "workflow" : "voice"} /></span><span className="rounded-full bg-emerald-300/10 px-2 py-1 text-[8px] font-bold text-emerald-300">{status}</span></div>
              <strong className="mt-5 block text-sm text-white">{title}</strong>
              <span className="mt-1 block text-[10px] text-white/36">{detail}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-4 flex items-center justify-between rounded-xl border border-[#8f83e8]/20 bg-[#8f83e8]/[0.07] px-4 py-3">
          <span className="text-[10px] font-bold text-white/60">Production agent</span><span className="rounded-lg bg-[#8f83e8] px-3 py-2 text-[9px] font-black text-white">Deployed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[390px] overflow-hidden rounded-[22px] border border-[#f28d45]/20 bg-[#130d08] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-7">
      <div className="absolute -left-20 -top-20 size-64 rounded-full bg-[#f28d45]/12 blur-[75px]" />
      <div className="relative flex items-center justify-between"><div><span className="text-xs font-black text-white">Call intelligence</span><span className="mt-1 block text-[9px] text-white/35">Last 7 days</span></div><span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[9px] text-white/50">All agents</span></div>
      <div className="relative mt-5 grid grid-cols-3 gap-2.5">
        {[["1,284", "Calls"], ["91%", "Resolved"], ["4.7", "Quality"]].map(([value, label]) => (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3 sm:p-4" key={label}><strong className="block text-lg text-white sm:text-2xl">{value}</strong><span className="mt-1 block text-[8px] text-white/35 sm:text-[9px]">{label}</span></div>
        ))}
      </div>
      <div className="relative mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
        <div className="flex h-28 items-end gap-2">
          {[38, 56, 45, 72, 63, 88, 77, 94, 71, 84].map((height, index) => (
            <span className={`flex-1 rounded-t-sm ${index > 6 ? "bg-[#f28d45]" : "bg-[#f28d45]/35"}`} key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[8px] text-white/25"><span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span></div>
      </div>
      <div className="relative mt-3 grid gap-2 sm:grid-cols-2">
        {["Appointment intent increased", "Support handoffs improved"].map((signal, index) => (
          <div className="flex items-center gap-3 rounded-xl border border-[#f28d45]/14 bg-[#f28d45]/[0.045] p-3" key={signal}><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#f28d45]/12 text-[#ffbd8c]"><ProductGlyph type="signal" /></span><span className="text-[10px] font-bold leading-4 text-white/55">{signal}</span><span className="ml-auto text-[9px] font-black text-emerald-300">+{index ? 8 : 14}%</span></div>
        ))}
      </div>
    </div>
  );
}

export function ProductOverviewPage() {
  return (
    <SiteLayout>
      <div className="overflow-hidden bg-[#020504] text-white">
        <section className="relative px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:pb-28 lg:pt-44">
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(69,221,206,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(69,221,206,0.055)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent_86%)]" />
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#45ddce]/[0.07] blur-[130px]" />
          <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#45ddce]/22 bg-[#45ddce]/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.17em] text-[#75fff0]">
                <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_10px_#45ddce]" /> Vozon product platform
              </div>
              <h1 className="m-0 mt-7 text-[clamp(2.6rem,5.7vw,5.3rem)] font-black leading-[0.96] tracking-[-0.045em] text-white">
                Every voice workflow, <span className="text-[#75fff0]">one platform.</span>
              </h1>
              <p className="mb-0 mt-7 max-w-xl text-base leading-8 text-white/56 sm:text-lg">
                Build natural AI phone agents, connect them to real business actions, and improve every conversation from one production-ready workspace.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#45ddce] px-6 text-sm font-black text-[#03110e] shadow-[0_18px_48px_rgba(69,221,206,0.2)] transition hover:-translate-y-0.5 hover:bg-[#75fff0]" href="/dashboard">Start building <ArrowIcon /></Link>
                <Link className="inline-flex min-h-12 items-center rounded-full border border-white/14 bg-white/[0.045] px-6 text-sm font-black text-white transition hover:border-[#45ddce]/35 hover:bg-[#45ddce]/[0.07]" href="/#contact">Talk to our team</Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-bold text-white/38">
                {["Natural real-time voice", "Business tool actions", "Human handoff controls"].map((item) => (
                  <span className="flex items-center gap-2" key={item}><span className="text-[#45ddce]">✓</span>{item}</span>
                ))}
              </div>
            </div>
            <HeroConsole />
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-white/[0.018] px-5 sm:px-8">
          <div className="mx-auto grid max-w-[1280px] sm:grid-cols-2 lg:grid-cols-4">
            {[["<500ms", "responsive conversations"], ["140+", "supported languages"], ["24/7", "inbound and outbound"], ["One", "connected workspace"]].map(([value, label], index) => (
              <div className="border-b border-white/[0.07] px-6 py-7 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0" key={label}>
                <strong className={`block text-2xl font-black ${index === 1 ? "text-[#c6bdff]" : index === 2 ? "text-[#ffbd8c]" : "text-[#75fff0]"}`}>{value}</strong>
                <span className="mt-1.5 block text-[11px] font-bold text-white/36">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-[1280px]">
            <div className="mx-auto max-w-3xl text-center">
              <p className="m-0 text-[10px] font-black uppercase tracking-[0.2em] text-[#75fff0]">The complete operating layer</p>
              <h2 className="m-0 mt-5 text-[clamp(2.1rem,4.5vw,4rem)] font-black leading-[1.02] tracking-[-0.035em]">From first prompt to every live outcome.</h2>
              <p className="mx-auto mb-0 mt-6 max-w-2xl text-sm leading-7 text-white/48 sm:text-base">Design the experience, connect the workflow, and learn from real calls without stitching together disconnected tools.</p>
            </div>

            <div className="mt-16 space-y-24 lg:mt-24 lg:space-y-32">
              {productStages.map((stage, stageIndex) => {
                const services = servicePages.filter((service) => service.kicker === stage.key);
                const accent = stageAccents[stageIndex];
                return (
                  <article className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20" key={stage.key}>
                    <div className={`pointer-events-none absolute -z-10 size-80 rounded-full blur-[100px] ${accent.glow} ${stageIndex % 2 ? "right-0" : "left-0"}`} />
                    <div className={stageIndex % 2 ? "lg:order-2" : ""}>
                      <div className="flex items-center gap-3">
                        <span className={`grid size-10 place-items-center rounded-xl border text-xs font-black ${accent.number}`}>0{stageIndex + 1}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.17em] text-white/38">{stage.eyebrow}</span>
                      </div>
                      <h2 className="m-0 mt-6 max-w-xl text-3xl font-black leading-[1.08] tracking-[-0.025em] sm:text-4xl lg:text-[2.8rem]">{stage.title}</h2>
                      <p className="mb-0 mt-5 max-w-xl text-sm leading-7 text-white/48 sm:text-base">{stage.description}</p>
                      <div className="mt-8 grid gap-2">
                        {services.map((service) => (
                          <Link className="group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 transition hover:border-white/16 hover:bg-white/[0.05]" href={`/services/${service.slug}`} key={service.slug}>
                            <span className={`h-8 w-0.5 rounded-full bg-gradient-to-b ${accent.line} to-transparent`} />
                            <span className="min-w-0 flex-1"><strong className="block text-sm text-white/88">{service.title}</strong><span className="mt-1 block truncate text-[10px] text-white/32">{service.highlights[0]}</span></span>
                            <span className="text-white/25 transition group-hover:translate-x-1 group-hover:text-white/70"><ArrowIcon /></span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className={stageIndex % 2 ? "lg:order-1" : ""}><StageVisual index={stageIndex} /></div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-[#050b09] px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div><p className="m-0 text-[10px] font-black uppercase tracking-[0.18em] text-[#75fff0]">One continuous system</p><h2 className="m-0 mt-4 text-3xl font-black leading-tight sm:text-4xl">A call becomes completed work.</h2></div>
              <p className="m-0 max-w-2xl text-sm leading-7 text-white/45 lg:justify-self-end">Vozon carries context from the first hello through reasoning, action, handoff, and reporting—so every team sees the same outcome.</p>
            </div>
            <div className="mt-12 grid overflow-hidden rounded-2xl border border-white/[0.09] md:grid-cols-4">
              {[["01", "Understand", "Intent, language, and urgency"], ["02", "Respond", "Natural, grounded conversation"], ["03", "Act", "Bookings, updates, and routing"], ["04", "Learn", "Outcomes, quality, and trends"]].map(([number, title, body], index) => (
                <div className="relative border-b border-white/[0.08] bg-white/[0.025] p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0" key={number}><span className={`text-[10px] font-black ${index === 1 ? "text-[#c6bdff]" : index === 2 ? "text-[#ffbd8c]" : "text-[#75fff0]"}`}>{number}</span><strong className="mt-8 block text-lg">{title}</strong><p className="mb-0 mt-2 text-xs leading-5 text-white/36">{body}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[28px] border border-[#45ddce]/20 bg-[linear-gradient(125deg,rgba(69,221,206,0.16),rgba(143,131,232,0.08)_55%,rgba(242,141,69,0.1))] p-8 text-center shadow-[0_36px_100px_rgba(0,0,0,0.34)] sm:p-12 lg:p-16">
            <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#75fff0] to-transparent" />
            <p className="m-0 text-[10px] font-black uppercase tracking-[0.18em] text-[#75fff0]">Ready when your callers are</p>
            <h2 className="mx-auto m-0 mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">Launch your first production voice workflow.</h2>
            <p className="mx-auto mb-0 mt-5 max-w-2xl text-sm leading-7 text-white/52 sm:text-base">Start with one high-value call journey, connect the actions it needs, and expand from real results.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3"><Link className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#45ddce] px-6 text-sm font-black text-[#03110e]" href="/dashboard">Start building <ArrowIcon /></Link><Link className="inline-flex min-h-12 items-center rounded-full border border-white/14 bg-black/20 px-6 text-sm font-black text-white" href="/#contact">Contact sales</Link></div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
