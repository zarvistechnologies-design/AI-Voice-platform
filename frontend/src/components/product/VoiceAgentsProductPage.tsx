import Link from "next/link";
import type { ReactNode } from "react";

import { SiteLayout } from "@/components/layout/SiteLayout";

const layers = [
  {
    number: "01",
    title: "Identity",
    heading: "How it represents your brand",
    body: "Name, voice, tone, and greeting — set once and applied consistently across every call, in every language you support.",
    accent: "text-[#5eead4]",
    iconBackground: "bg-[#2dd4bf]/12",
    icon: "voice",
  },
  {
    number: "02",
    title: "Knowledge",
    heading: "What it's authorized to say",
    body: "Product information, policies, FAQs, and internal documentation. The agent answers only from approved sources, reducing the risk of inconsistent or inaccurate responses at scale.",
    accent: "text-[#b8a9ff]",
    iconBackground: "bg-[#9d8cff]/12",
    icon: "knowledge",
  },
  {
    number: "03",
    title: "Actions",
    heading: "What it's authorized to do",
    body: "Scoped access to your CRM, calendar, help desk, or internal tools, so the agent can complete tasks — not just answer questions — within the boundaries your team defines.",
    accent: "text-[#ffb37d]",
    iconBackground: "bg-[#ff9a62]/12",
    icon: "actions",
  },
] as const;

const buildSteps = [
  {
    title: "Define the agent",
    body: "Set identity, tone, and communication style aligned to your brand.",
    color: "#5eead4",
  },
  {
    title: "Add its knowledge",
    body: "Connect approved documentation, policies, and FAQs.",
    color: "#8dd7ff",
  },
  {
    title: "Connect its actions",
    body: "Integrate CRM, calendar, help desk, or custom webhooks.",
    color: "#b8a9ff",
  },
  {
    title: "Test real paths",
    body: "Review common requests, edge cases, and escalation logic before launch.",
    color: "#ff9fb7",
  },
  {
    title: "Deploy",
    body: "Route to a phone number, embed on your site, or connect through the API.",
    color: "#ffb37d",
  },
  {
    title: "Monitor and refine",
    body: "Use transcripts, outcomes, and analytics to improve performance over time.",
    color: "#f6db75",
  },
] as const;

const configuration = [
  {
    label: "Identity",
    detail: "Name, voice, tone, and greeting",
    icon: "identity",
    color: "text-[#5eead4] bg-[#2dd4bf]/10 border-[#2dd4bf]/18",
  },
  {
    label: "Supported languages",
    detail: "40+, including cloned voice for brand consistency",
    icon: "language",
    color: "text-[#8dd7ff] bg-[#38bdf8]/10 border-[#38bdf8]/18",
  },
  {
    label: "Knowledge sources",
    detail: "Documents, FAQs, policies, and product data",
    icon: "knowledge",
    color: "text-[#b8a9ff] bg-[#9d8cff]/10 border-[#9d8cff]/18",
  },
  {
    label: "Integrations",
    detail: "CRM, calendar, help desk, telephony, and webhooks",
    icon: "integrations",
    color: "text-[#ff9fb7] bg-[#fb7185]/10 border-[#fb7185]/18",
  },
  {
    label: "Escalation rules",
    detail: "By intent, confidence, urgency, or explicit request",
    icon: "escalation",
    color: "text-[#ffb37d] bg-[#fb923c]/10 border-[#fb923c]/18",
  },
  {
    label: "Human handoff",
    detail: "Routing, department, and context passed to the receiving teammate",
    icon: "handoff",
    color: "text-[#f6db75] bg-[#facc15]/10 border-[#facc15]/18",
  },
  {
    label: "Deployment targets",
    detail: "Phone number, web widget, mobile/desktop SDK, or API",
    icon: "deploy",
    color: "text-[#71efc2] bg-[#34d399]/10 border-[#34d399]/18",
  },
  {
    label: "Access and permissions",
    detail: "Control configuration rights across team members",
    icon: "permissions",
    color: "text-[#c4b5fd] bg-[#a78bfa]/10 border-[#a78bfa]/18",
  },
] as const;

const faqs = [
  {
    question: "Does building an agent require engineering resources?",
    answer:
      "No. Configuration is handled through guided setup — engineering involvement is only needed for custom integrations beyond standard connectors.",
  },
  {
    question: "Can multiple team members work on the same agent?",
    answer:
      "Yes. Configuration can be divided by role, with each team owning the sections relevant to their function.",
  },
  {
    question: "How are edge cases and difficult calls handled?",
    answer:
      "You define escalation rules and handoff destinations. Receiving teammates get the caller's intent and a conversation summary.",
  },
  {
    question: "Can the agent integrate with our existing systems?",
    answer:
      "Yes. Standard integrations cover common CRM, calendar, help desk, and telephony providers, with webhooks available for custom workflows.",
  },
] as const;

const waveform = [10, 18, 13, 25, 17, 30, 12, 22, 28, 16, 24, 11, 19, 27, 14, 21];

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 flex items-center gap-2.5 text-[11px] font-bold tracking-[0.16em] text-[#72f2df] uppercase">
      <span className="size-1.5 rounded-full bg-[#5eead4] shadow-[0_0_14px_rgba(94,234,212,0.75)]" />
      {children}
    </p>
  );
}

function LayerIcon({ name }: { name: (typeof layers)[number]["icon"] }) {
  if (name === "knowledge") {
    return (
      <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
        <path d="M5 4.8A2.8 2.8 0 0 1 7.8 2H19v16H7.8A2.8 2.8 0 0 0 5 20.8V4.8Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5 20.8A2.8 2.8 0 0 1 7.8 18H19v4H7.8A2.8 2.8 0 0 1 5 20.8ZM9 6h6M9 10h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      </svg>
    );
  }

  if (name === "actions") {
    return (
      <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
        <path d="m13.4 2-1 4.5a2.2 2.2 0 0 1-1.7 1.7L6.2 9.3l4.3 1.3a2.2 2.2 0 0 1 1.5 1.6l1.2 4.6 1.1-4.5a2.2 2.2 0 0 1 1.6-1.6l4.4-1.2-4.4-1.2a2.2 2.2 0 0 1-1.6-1.7L13.4 2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="m6 15-.5 2.1a1.5 1.5 0 0 1-1.1 1.1l-2.1.6 2.1.6a1.5 1.5 0 0 1 1.1 1.1L6 22.7l.6-2.2a1.5 1.5 0 0 1 1.1-1.1l2.1-.6-2.1-.6a1.5 1.5 0 0 1-1.1-1.1L6 15Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
      <path d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3a3.5 3.5 0 0 1-7 0Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 10a6.5 6.5 0 0 0 13 0M12 16.5V20M9.5 20h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function ConfigIcon({ name }: { name: (typeof configuration)[number]["icon"] }) {
  const common = "stroke-current";

  if (name === "identity") {
    return <path className={common} d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3a3.5 3.5 0 0 1-7 0Zm-3 0a6.5 6.5 0 0 0 13 0M12 16.5V20M9.5 20h5" strokeLinecap="round" strokeWidth="1.6" />;
  }

  if (name === "language") {
    return <path className={common} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.2-2.4 3.3-5.4 3.3-9S14.2 5.4 12 3m0 18c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3M3.5 9h17M3.5 15h17" strokeWidth="1.5" />;
  }

  if (name === "knowledge") {
    return <path className={common} d="M5 5a2 2 0 0 1 2-2h12v16H7a2 2 0 0 0-2 2V5Zm0 16a2 2 0 0 1 2-2h12v3H7a2 2 0 0 1-2-1ZM9 7h6M9 11h6" strokeLinecap="round" strokeWidth="1.5" />;
  }

  if (name === "integrations") {
    return <path className={common} d="M9 8H5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-4m1-9h5v5M10 14 20 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />;
  }

  if (name === "escalation") {
    return <path className={common} d="M12 3v12m0-12L7.5 7.5M12 3l4.5 4.5M4 13v5a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />;
  }

  if (name === "handoff") {
    return <path className={common} d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8.5 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 21v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2m1-5h1.5a4.5 4.5 0 0 1 4.5 4.5V21" strokeLinecap="round" strokeWidth="1.5" />;
  }

  if (name === "deploy") {
    return <path className={common} d="M14 3h7v7M21 3l-9 9M10 5H6a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />;
  }

  return <path className={common} d="M12 3 5 6v5c0 4.8 2.8 8.3 7 10 4.2-1.7 7-5.2 7-10V6l-7-3Zm-2.7 9 1.8 1.8 3.8-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />;
}

export function VoiceAgentsProductPage() {
  return (
    <SiteLayout>
      <div className="voice-build-page overflow-hidden bg-[#07101c] text-white">
        <section className="relative px-[clamp(1.25rem,5vw,4.75rem)] pt-24 pb-20 sm:pt-28 lg:pt-32 lg:pb-28">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#07101c_0%,#081321_100%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />

          <div className="relative mx-auto max-w-[1380px]">
            <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-white/40 uppercase">
              <Link className="transition hover:text-[#72f2df]" href="/product">Build</Link>
              <span aria-hidden="true" className="text-white/20">/</span>
              <span className="text-[#72f2df]">Voice Agents</span>
            </nav>

            <div className="voice-hero-grid grid min-w-0 items-center gap-14 xl:grid-cols-[minmax(0,0.98fr)_minmax(510px,0.82fr)] xl:gap-20">
              <div className="voice-hero-copy min-w-0 max-w-[760px]">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#5eead4]/20 bg-[#5eead4]/7 px-3.5 py-2 text-[11px] font-bold tracking-[0.12em] text-[#72f2df] uppercase">
                  <span className="voice-live-dot size-1.5 rounded-full bg-[#5eead4]" />
                  Built for real call volume
                </div>

                <h1 className="mt-7 text-[clamp(2rem,3.1vw,3.1rem)] leading-[0.98] font-semibold tracking-[-0.055em]">
                  <span className="block">Build Intelligent</span>
                  <span className="block bg-[linear-gradient(100deg,#5eead4_4%,#8dd7ff_36%,#b8a9ff_68%,#ff9fb7_100%)] bg-clip-text text-transparent">
                    Voice Agents
                  </span>
                </h1>

                <p className="mt-7 max-w-[680px] text-base leading-8 text-white/62 sm:text-lg sm:leading-9">
                  Configure identity, knowledge, and actions in one workspace, then deploy an agent that handles real call volume across your support, sales, or operations workflows.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link className="inline-flex min-h-13 items-center justify-center rounded-xl bg-[#5eead4] px-6 text-sm font-bold text-[#06201c] shadow-[0_14px_40px_rgba(45,212,191,0.18)] transition hover:-translate-y-0.5 hover:bg-white" href="/dashboard/agents">
                    Start building <span className="ml-3" aria-hidden="true">→</span>
                  </Link>
                  <a className="inline-flex min-h-13 items-center justify-center rounded-xl border border-white/13 bg-white/[0.045] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-[#b8a9ff]/45 hover:bg-[#9d8cff]/10" href="mailto:hello@vozon.ai">
                    Talk to sales
                  </a>
                </div>

                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-white/44">
                  {["No-code configuration", "Enterprise integrations", "Team-ready deployment"].map((tag, index) => (
                    <span className="flex items-center gap-2" key={tag}>
                      <span className={`size-1.5 rounded-full ${index === 0 ? "bg-[#5eead4]" : index === 1 ? "bg-[#b8a9ff]" : "bg-[#ffb37d]"}`} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="voice-call-stage relative mx-auto w-full min-w-0 max-w-[620px]">
                <div className="relative min-w-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b1422]/95 shadow-[0_36px_100px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#5eead4,#b8a9ff,transparent)] opacity-70" />
                  <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#5eead4]/20 bg-[#5eead4]/10 text-[#72f2df]">
                        <LayerIcon name="voice" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white/90">Scheduling agent</p>
                        <p className="mt-0.5 text-[10px] text-white/36">Customer care · Inbound</p>
                      </div>
                    </div>
                    <div className="ml-3 flex shrink-0 items-center gap-2 rounded-full border border-[#5eead4]/15 bg-[#5eead4]/7 px-2.5 py-1.5">
                      <span className="voice-live-dot size-1.5 rounded-full bg-[#5eead4]" />
                      <span className="font-mono text-[9px] font-semibold tracking-[0.08em] text-[#72f2df]">LIVE · 02:14</span>
                    </div>
                  </div>

                  <div className="px-5 py-6 sm:px-7 sm:py-7">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold tracking-[0.16em] text-white/28 uppercase">Live call</p>
                      <p className="flex items-center gap-1.5 text-[10px] text-white/32"><span className="size-1 rounded-full bg-[#5eead4]" /> 184 ms latency</p>
                    </div>

                    <div className="mt-6 space-y-5">
                      <div className="flex gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/[0.07] text-[9px] font-bold text-white/48">C</span>
                        <div>
                          <p className="text-[10px] font-semibold text-white/38">Caller <span className="ml-1 font-normal">02:08</span></p>
                          <p className="mt-1.5 max-w-[390px] text-[13px] leading-6 text-white/70">Can you move my site visit to Friday afternoon?</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#9d8cff]/14 text-[9px] font-black text-[#c4b8ff]">AI</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold text-[#c4b8ff]/70">Agent <span className="ml-1 font-normal text-white/28">Now</span></p>
                          <p className="mt-1.5 max-w-[410px] text-[13px] leading-6 text-white/90">Friday at 2:30 PM is available. I&apos;ve moved the visit and sent a confirmation.</p>
                          <div aria-hidden="true" className="mt-3 flex h-7 items-center gap-[3px]">
                            {waveform.map((height, index) => (
                              <span className="voice-wave w-[2px] rounded-full bg-[#b8a9ff]" key={`${height}-${index}`} style={{ animationDelay: `${index * -55}ms`, height }} />
                            ))}
                            <span className="ml-2 text-[8px] font-bold tracking-[0.12em] text-[#b8a9ff]/65 uppercase">Speaking</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-[#5eead4]/16 bg-[linear-gradient(135deg,rgba(45,212,191,0.10),rgba(157,140,255,0.06))]">
                      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
                        <span className="grid size-8 place-items-center rounded-lg bg-[#5eead4]/12 text-[#72f2df]">
                          <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
                            <path d="m7 12 3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </span>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[11px] font-bold text-[#72f2df]">Booking updated</p>
                            <span className="rounded-full bg-[#5eead4]/10 px-2 py-1 text-[8px] font-bold tracking-[0.1em] text-[#72f2df] uppercase">Action complete</span>
                          </div>
                          <p className="mt-1 text-[10px] text-white/42">Field service calendar · Fri, 2:30 PM</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 divide-x divide-white/[0.06] px-3 py-3 text-center">
                        {[
                          ["Intent", "Reschedule"],
                          ["Confidence", "98%"],
                          ["System", "Calendar"],
                        ].map(([label, value]) => (
                          <div className="px-2" key={label}>
                            <p className="text-[8px] font-bold tracking-[0.1em] text-white/25 uppercase">{label}</p>
                            <p className="mt-1 text-[10px] font-semibold text-white/65">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-3 -bottom-7 hidden w-[190px] rounded-2xl border border-[#ffb37d]/18 bg-[#151522]/92 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:block">
                  <p className="text-[9px] font-bold tracking-[0.12em] text-[#ffb37d] uppercase">Workflow</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#5eead4]" />
                    <span className="h-px flex-1 bg-[linear-gradient(90deg,#5eead4,#b8a9ff)]" />
                    <span className="size-2 rounded-full bg-[#b8a9ff]" />
                    <span className="h-px flex-1 bg-[linear-gradient(90deg,#b8a9ff,#ffb37d)]" />
                    <span className="size-2 rounded-full bg-[#ffb37d]" />
                  </div>
                  <p className="mt-2 text-[9px] text-white/35">Listen · Decide · Complete</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-white/[0.06] bg-[#0a1421] px-[clamp(1.25rem,5vw,4.75rem)] py-20 sm:py-24 lg:py-28">
          <div className="pointer-events-none absolute top-0 left-0 h-72 w-72 bg-[#2dd4bf]/6 blur-[120px]" />
          <div className="pointer-events-none absolute right-[-6rem] bottom-[-8rem] size-80 rounded-full bg-[#9d8cff]/5 blur-[130px]" />
          <div className="relative mx-auto max-w-[1380px]">
            <div className="grid gap-6 lg:grid-cols-[minmax(210px,0.38fr)_minmax(0,1fr)] lg:gap-16">
              <div className="pt-1">
                <Eyebrow>What you&apos;re building</Eyebrow>
              </div>
              <div className="max-w-[880px]">
                <h2 className="text-[clamp(2rem,3.2vw,3.4rem)] leading-[1.08] font-semibold tracking-[-0.045em]">
                  Every agent is made of three things.
                </h2>
                <p className="mt-5 max-w-[760px] text-[15px] leading-7 text-white/52 sm:text-base sm:leading-8">
                  Together, they define how your agent represents the business, what it knows, and what it can do. Update each one independently without redeploying.
                </p>
              </div>
            </div>

            <div className="mt-12 grid border-y border-white/10 md:grid-cols-3">
              {layers.map((layer, index) => (
                <article
                  className={`relative py-9 md:min-h-[330px] md:py-10 ${index > 0 ? "border-t border-white/10 md:border-t-0 md:border-l" : ""} ${index === 0 ? "md:pr-9" : index === 1 ? "md:px-9" : "md:pl-9"}`}
                  key={layer.title}
                >
                  <div className="flex items-center justify-between">
                    <span className={`grid size-11 place-items-center rounded-full ${layer.iconBackground} ${layer.accent}`}>
                      <LayerIcon name={layer.icon} />
                    </span>
                    <span className={`font-mono text-[11px] font-semibold tracking-[0.12em] ${layer.accent}`}>{layer.number}</span>
                  </div>
                  <h3 className={`mt-8 text-[clamp(1.65rem,2.2vw,2.15rem)] leading-none font-semibold tracking-[-0.035em] ${layer.accent}`}>
                    {layer.title}
                  </h3>
                  <p className="mt-4 text-base leading-6 font-medium text-white/86">{layer.heading}</p>
                  <p className="mt-4 max-w-[390px] text-sm leading-7 text-white/48">{layer.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-[#07101c] px-[clamp(1.25rem,5vw,4.75rem)] py-24 sm:py-28 lg:py-32">
          <div className="pointer-events-none absolute top-[20%] right-[-10%] size-[28rem] rounded-full bg-[#9d8cff]/7 blur-[130px]" />
          <div className="relative mx-auto max-w-[1380px]">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
              <div>
                <Eyebrow>How you build it</Eyebrow>
                <h2 className="mt-5 max-w-[700px] text-[clamp(2.5rem,4.3vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.055em]">
                  A structured setup process, designed for team ownership.
                </h2>
              </div>
              <p className="max-w-[650px] text-base leading-8 text-white/54 lg:justify-self-end">
                Each stage below maps to a step in the builder. Configuration can be owned by one team or split across roles — for example, ops defines actions while support defines knowledge.
              </p>
            </div>

            <div className="relative mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="pointer-events-none absolute top-9 right-[10%] left-[10%] hidden h-px bg-[linear-gradient(90deg,#5eead4,#8dd7ff,#b8a9ff,#ff9fb7,#ffb37d,#f6db75)] opacity-30 xl:block" />
              {buildSteps.map((step, index) => (
                <article className="group relative rounded-2xl border border-white/[0.075] bg-white/[0.026] p-6 transition hover:border-white/15 hover:bg-white/[0.04] sm:p-7" key={step.title}>
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-full border bg-[#07101c] font-mono text-[11px] font-bold" style={{ borderColor: `${step.color}55`, color: step.color }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="size-1.5 rounded-full" style={{ background: step.color, boxShadow: `0 0 16px ${step.color}` }} />
                  </div>
                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.025em] text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/48">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative border-y border-white/[0.06] bg-[#0b1523] px-[clamp(1.25rem,5vw,4.75rem)] py-24 sm:py-28 lg:py-32">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_right,black,transparent_20%,transparent_80%,black)]" />
          <div className="relative mx-auto grid max-w-[1380px] gap-14 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
            <div>
              <div className="lg:sticky lg:top-32">
                <Eyebrow>What you can configure</Eyebrow>
                <h2 className="mt-5 text-[clamp(2.5rem,4vw,4.3rem)] leading-[1.02] font-semibold tracking-[-0.055em]">
                  Granular control, built for production use.
                </h2>
                <p className="mt-6 max-w-[480px] text-base leading-8 text-white/52">
                  Give every owner the controls they need while keeping the agent&apos;s behavior governed, reviewable, and consistent.
                </p>
                <div className="mt-9 inline-flex items-center gap-3 rounded-xl border border-[#5eead4]/15 bg-[#5eead4]/6 px-4 py-3 text-xs font-semibold text-[#72f2df]">
                  <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
                    <path d="M12 3 5 6v5c0 4.8 2.8 8.3 7 10 4.2-1.7 7-5.2 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="1.6" />
                    <path d="m9 12 2 2 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                  </svg>
                  Controlled by your team
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.6rem] border border-white/[0.085] bg-[#08111e]/72 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
              {configuration.map((item, index) => (
                <div className="group grid gap-4 border-b border-white/[0.065] px-5 py-5 last:border-b-0 sm:grid-cols-[48px_0.75fr_1.25fr_24px] sm:items-center sm:px-7 sm:py-6" key={item.label}>
                  <span className={`grid size-11 place-items-center rounded-xl border ${item.color}`}>
                    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                      <ConfigIcon name={item.icon} />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.12em] text-white/22 uppercase">Control {String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 text-sm font-semibold text-white/88">{item.label}</h3>
                  </div>
                  <p className="text-sm leading-6 text-white/45">{item.detail}</p>
                  <svg aria-hidden="true" className="hidden size-4 text-white/17 transition group-hover:translate-x-0.5 group-hover:text-white/42 sm:block" fill="none" viewBox="0 0 24 24">
                    <path d="m9 5 7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-[#07101c] px-[clamp(1.25rem,5vw,4.75rem)] py-24 sm:py-28 lg:py-32">
          <div className="pointer-events-none absolute bottom-0 left-[15%] h-72 w-72 bg-[#2dd4bf]/6 blur-[110px]" />
          <div className="relative mx-auto grid max-w-[1380px] gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div>
              <Eyebrow>F.A.Q.</Eyebrow>
              <h2 className="mt-5 text-[clamp(2.5rem,4vw,4.2rem)] leading-[1.02] font-semibold tracking-[-0.055em]">
                Common questions from teams evaluating the build process.
              </h2>
              <p className="mt-6 text-sm leading-7 text-white/44">
                Need to map this to your systems?{" "}
                <a className="font-semibold text-[#72f2df] underline decoration-[#72f2df]/30 underline-offset-4 transition hover:text-white" href="mailto:hello@vozon.ai">
                  Talk with our team.
                </a>
              </p>
            </div>

            <div className="border-t border-white/10">
              {faqs.map((faq, index) => (
                <details className="voice-faq group border-b border-white/10" key={faq.question} open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left sm:py-7 [&::-webkit-details-marker]:hidden">
                    <span className="text-base font-semibold tracking-[-0.015em] text-white/88 sm:text-lg">{faq.question}</span>
                    <span className="relative grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.035] text-[#72f2df]">
                      <span className="h-px w-3.5 bg-current" />
                      <span className="voice-faq-plus absolute h-3.5 w-px bg-current transition-transform duration-200" />
                    </span>
                  </summary>
                  <div className="max-w-[720px] pb-7 pr-12">
                    <p className="text-sm leading-7 text-white/50 sm:text-base sm:leading-8">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-[clamp(1.25rem,5vw,4.75rem)] pb-8">
          <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(120deg,#102a2d_0%,#182447_48%,#30203e_100%)] px-6 py-16 text-center shadow-[0_30px_90px_rgba(0,0,0,0.26)] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
            <div className="pointer-events-none absolute -top-36 -left-16 size-80 rounded-full bg-[#2dd4bf]/24 blur-[90px]" />
            <div className="pointer-events-none absolute -right-10 -bottom-48 size-96 rounded-full bg-[#fb7185]/22 blur-[110px]" />
            <div className="pointer-events-none absolute top-0 right-[28%] size-72 rounded-full bg-[#9d8cff]/17 blur-[90px]" />
            <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(circle_at_center,black,transparent_76%)]" />
            <div className="relative mx-auto max-w-[970px]">
              <div className="flex justify-center"><Eyebrow>Ready to build</Eyebrow></div>
              <h2 className="mt-6 text-[clamp(2.5rem,5vw,5.2rem)] leading-[1.01] font-semibold tracking-[-0.06em]">
                Put a voice agent to work on one real workflow, then scale from there.
              </h2>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link className="inline-flex min-h-13 items-center rounded-xl bg-white px-6 text-sm font-bold text-[#0b1720] transition hover:-translate-y-0.5 hover:bg-[#5eead4]" href="/dashboard/agents">
                  Start building <span className="ml-3" aria-hidden="true">→</span>
                </Link>
                <a className="inline-flex min-h-13 items-center rounded-xl border border-white/18 bg-white/[0.06] px-6 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/12" href="mailto:hello@vozon.ai">
                  Talk to sales
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="px-[clamp(1.25rem,5vw,4.75rem)] py-20 sm:py-24" id="team-contact">
          <div className="mx-auto flex max-w-[1380px] flex-col gap-8 border-t border-white/10 pt-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[820px]">
              <p className="text-[11px] font-bold tracking-[0.16em] text-[#ffb37d] uppercase">Plan your rollout</p>
              <h2 className="mt-4 text-[clamp(2rem,3.6vw,3.8rem)] leading-[1.06] font-semibold tracking-[-0.05em]">
                Evaluating this for your team? <span className="text-white/42">Our team can help you plan the rollout.</span>
              </h2>
            </div>
            <a className="group inline-flex shrink-0 items-center gap-4 text-lg font-semibold text-[#72f2df] transition hover:text-white" href="mailto:hello@vozon.ai">
              hello@vozon.ai
              <span className="grid size-11 place-items-center rounded-full border border-[#5eead4]/20 bg-[#5eead4]/8 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
                  <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                </svg>
              </span>
            </a>
          </div>
        </section>

        <style>{`
          @keyframes voice-wave {
            from { transform: scaleY(0.42); opacity: 0.45; }
            to { transform: scaleY(1); opacity: 1; }
          }

          @keyframes voice-live {
            0%, 100% { opacity: 0.5; box-shadow: 0 0 0 rgba(94,234,212,0); }
            50% { opacity: 1; box-shadow: 0 0 14px rgba(94,234,212,0.75); }
          }

          .voice-wave {
            animation: voice-wave 0.72s ease-in-out infinite alternate;
            transform-origin: center;
          }

          .voice-live-dot {
            animation: voice-live 1.5s ease-in-out infinite;
          }

          .voice-faq[open] .voice-faq-plus {
            transform: rotate(90deg) scaleY(0);
          }

          @media (max-width: 639px) {
            .voice-build-page {
              width: 100%;
              max-width: 100vw;
              overflow-x: clip;
            }

            .voice-hero-grid,
            .voice-hero-copy,
            .voice-call-stage {
              width: 100%;
              min-width: 0;
              max-width: calc(100vw - 2.5rem);
            }

            .voice-hero-copy h1 {
              max-width: 100%;
              font-size: clamp(2.3rem, 10vw, 2.7rem);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .voice-build-page *,
            .voice-build-page *::before,
            .voice-build-page *::after {
              animation: none !important;
              scroll-behavior: auto !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
    </SiteLayout>
  );
}
