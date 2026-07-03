"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useRef } from "react";

const evolutionCards = [
  {
    title: "Missed calls become lost revenue",
    copy: "Customers wait, teams repeat the same answers, and promising leads lose interest before anyone can respond.",
  },
  {
    title: "AI agents answer in the moment",
    copy: "Voice agents understand intent, answer naturally, qualify callers, book slots, and update your systems in real time.",
  },
  {
    title: "Humans focus on high-value work",
    copy: "Your team gets clean summaries, better handoffs, fewer repetitive calls, and more time for conversations that matter.",
  },
];

const featureStackCards = [
  {
    title: "Lead Qualification",
    tag: "Revenue conversations",
    copy: "Ask the right questions, detect buying intent, capture requirements, and route hot prospects to sales instantly.",
    accent: "#0891b2",
    visual: "lead",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Autonomous Voice Agents",
    tag: "Natural conversation",
    copy: "Human-like agents handle interruptions, remember context, switch flows, and escalate with the full call summary.",
    accent: "#00ADB5",
    visual: "agent",
    imageUrl:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Connected Follow-Ups",
    tag: "Omnichannel journeys",
    copy: "Continue every call through WhatsApp, SMS, email, CRM tasks, and team notifications without losing context.",
    accent: "#f59e0b",
    visual: "omni",
    imageUrl:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Conversation Quality",
    tag: "Control and review",
    copy: "Track sentiment, compliance signals, escalations, and agent quality before small issues affect customer trust.",
    accent: "#7c3aed",
    visual: "quality",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Performance Dashboard",
    tag: "Revenue clarity",
    copy: "Measure answered calls, booked meetings, saved hours, conversions, and campaign outcomes from one dashboard.",
    accent: "#0f766e",
    visual: "roi",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Voice Of Customer",
    tag: "Customer intelligence",
    copy: "Turn calls into searchable themes, objections, questions, intent signals, and action items your teams can use.",
    accent: "#38bdf8",
    visual: "insights",
    imageUrl:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Agent Control Tower",
    tag: "Operations hub",
    copy: "Manage call flows, routing, escalation rules, agent behavior, and connected workflows from one command center.",
    accent: "#06b6d4",
    visual: "control",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
];

const voiceAgentUseCards = [
  {
    title: "Catch caller intent in real time",
    copy: "Voice agents listen for urgency, lead quality, appointment needs, and service requests while the conversation is still happening.",
    stat: "Live",
    label: "intent signals",
    accent: "#00ADB5",
    layout: "xl:col-span-2",
    visual: "intent",
    chips: ["New lead", "Needs callback", "High priority"],
    background:
      "radial-gradient(circle_at_18%_18%,rgba(94,234,212,0.44),transparent_28%),linear-gradient(135deg,#ecfeff_0%,#f8fafc_48%,#e0f2fe_100%)",
    darkBackground:
      "radial-gradient(circle_at_18%_18%,rgba(94,234,212,0.28),transparent_31%),linear-gradient(135deg,rgba(8,47,73,0.94),rgba(15,23,42,0.96))",
  },
  {
    title: "Make conversations feel natural",
    copy: "Agents handle interruptions, ask follow-up questions, and respond with the right tone for support, sales, and scheduling calls.",
    stat: "Human",
    label: "style",
    accent: "#0e7490",
    layout: "xl:col-span-2",
    visual: "conversation",
    chips: ["Understands context", "Speaks naturally", "Confirms details"],
    background:
      "radial-gradient(circle_at_82%_18%,rgba(196,181,253,0.52),transparent_30%),linear-gradient(135deg,#f5f3ff_0%,#ffffff_48%,#eef2ff_100%)",
    darkBackground:
      "radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.30),transparent_30%),linear-gradient(135deg,rgba(46,16,101,0.92),rgba(15,23,42,0.96))",
  },
  {
    title: "Convert calls into tasks",
    copy: "Appointments, tickets, CRM updates, and reminders are created from the call so your team does not chase notes.",
    stat: "CRM",
    label: "sync",
    accent: "#f59e0b",
    layout: "",
    visual: "actions",
    chips: ["Book slot", "Create ticket", "Send SMS"],
    background:
      "radial-gradient(circle_at_24%_82%,rgba(251,191,36,0.36),transparent_32%),linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fef3c7_100%)",
    darkBackground:
      "radial-gradient(circle_at_24%_82%,rgba(245,158,11,0.25),transparent_32%),linear-gradient(135deg,rgba(69,26,3,0.88),rgba(15,23,42,0.96))",
  },
  {
    title: "Bring humans in smoothly",
    copy: "When a call needs care, sales judgment, or approval, your team receives the summary, sentiment, and next step.",
    stat: "Warm",
    label: "handoff",
    accent: "#ec4899",
    layout: "",
    visual: "handoff",
    chips: ["Summary ready", "Priority marked", "Owner assigned"],
    background:
      "radial-gradient(circle_at_78%_78%,rgba(244,114,182,0.34),transparent_32%),linear-gradient(135deg,#fdf2f8_0%,#ffffff_54%,#fae8ff_100%)",
    darkBackground:
      "radial-gradient(circle_at_78%_78%,rgba(236,72,153,0.24),transparent_32%),linear-gradient(135deg,rgba(80,7,36,0.88),rgba(15,23,42,0.96))",
  },
  {
    title: "Stay available across every rush",
    copy: "Campaign spikes, after-hours callers, and weekend inquiries are covered without making customers wait.",
    stat: "24/7",
    label: "coverage",
    accent: "#38bdf8",
    layout: "",
    visual: "coverage",
    chips: ["After hours", "Peak demand", "No missed calls"],
    background:
      "radial-gradient(circle_at_82%_22%,rgba(56,189,248,0.34),transparent_30%),linear-gradient(135deg,#eff6ff_0%,#ffffff_54%,#cffafe_100%)",
    darkBackground:
      "radial-gradient(circle_at_82%_22%,rgba(56,189,248,0.24),transparent_30%),linear-gradient(135deg,rgba(12,74,110,0.88),rgba(15,23,42,0.96))",
  },
  {
    title: "Improve every next call",
    copy: "Call themes, objections, and quality signals become insights your sales and support teams can act on.",
    stat: "VOC",
    label: "insights",
    accent: "#10b981",
    layout: "",
    visual: "insights",
    chips: ["Sentiment", "Objections", "Trends"],
    background:
      "radial-gradient(circle_at_20%_24%,rgba(16,185,129,0.34),transparent_30%),linear-gradient(135deg,#ecfdf5_0%,#ffffff_54%,#d1fae5_100%)",
    darkBackground:
      "radial-gradient(circle_at_20%_24%,rgba(16,185,129,0.24),transparent_30%),linear-gradient(135deg,rgba(6,78,59,0.88),rgba(15,23,42,0.96))",
  },
];

const industryCards = [
  {
    title: "Healthcare",
    tag: "Clinics and care teams",
    copy: "Answer appointment calls, route urgent questions, confirm visits, and reduce missed patient follow-ups.",
    signal: "Patient flow",
    pulse: "92%",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Real Estate",
    tag: "Agents and property teams",
    copy: "Qualify buyer leads, schedule property visits, capture requirements, and follow up while interest is fresh.",
    signal: "Visit intent",
    pulse: "3.8x",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Education",
    tag: "Admissions and support",
    copy: "Handle admission queries, share program details, book counseling calls, and keep student conversations moving.",
    signal: "Inquiry match",
    pulse: "24h",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Financial Services",
    tag: "Banks and advisors",
    copy: "Respond to service requests, collect lead details, schedule advisor callbacks, and support secure handoffs.",
    signal: "Secure handoff",
    pulse: "<2s",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Retail",
    tag: "Stores and commerce",
    copy: "Answer product questions, support order updates, collect feedback, and recover missed customer calls.",
    signal: "Order assist",
    pulse: "Live",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Logistics",
    tag: "Delivery and operations",
    copy: "Share delivery updates, manage pickup requests, confirm details, and escalate exceptions to the right team.",
    signal: "Route clarity",
    pulse: "360",
    imageUrl:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80",
  },
];

function VoiceAgentCardVisual({
  accent,
  chips,
  visual,
}: {
  accent: string;
  chips: string[];
  visual: string;
}) {
  if (visual === "conversation") {
    return (
      <div className="mt-7 grid gap-3" aria-hidden="true">
        <div className="ml-auto max-w-[82%] rounded-lg bg-white/85 px-4 py-3 text-sm font-bold leading-5 text-slate-800 shadow-[0_14px_34px_rgba(15,23,42,0.10)] ring-1 ring-white/70 dark:bg-white/[0.10] dark:text-white dark:ring-white/10">
          Hi, I need to reschedule my service visit.
        </div>
        <div className="max-w-[88%] rounded-lg px-4 py-3 text-sm font-bold leading-5 text-white shadow-[0_16px_38px_rgba(15,23,42,0.16)]" style={{ backgroundColor: accent }}>
          Sure. I found your booking and can move it to Friday morning.
        </div>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span className="rounded-full bg-white/78 px-3 py-1 text-[0.68rem] font-black uppercase text-slate-600 shadow-sm dark:bg-white/[0.08] dark:text-slate-300" key={chip}>
              {chip}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (visual === "intent") {
    return (
      <div className="mt-7 grid gap-3" aria-hidden="true">
        {chips.map((chip, index) => (
          <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg bg-white/78 px-4 py-3 shadow-[0_14px_34px_rgba(15,23,42,0.09)] ring-1 ring-white/70 dark:bg-white/[0.08] dark:ring-white/10" key={chip}>
            <span className="text-sm font-black text-slate-800 dark:text-white">{chip}</span>
            <span className="h-2 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-white/15">
              <span
                className="block h-full rounded-full"
                style={{
                  backgroundColor: accent,
                  width: `${88 - index * 16}%`,
                }}
              />
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-7 grid gap-2" aria-hidden="true">
      {chips.map((chip, index) => (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-white/74 px-3.5 py-3 text-sm font-bold text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 dark:bg-white/[0.08] dark:text-slate-200 dark:ring-white/10" key={chip}>
          <span className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md text-[0.68rem] font-black text-white" style={{ backgroundColor: accent }}>
              {index + 1}
            </span>
            {chip}
          </span>
          <span className="size-2 rounded-full" style={{ backgroundColor: accent }} />
        </div>
      ))}
    </div>
  );
}

function FeaturePhoto({
  accent,
  imageUrl,
  title,
  visual,
}: {
  accent: string;
  imageUrl: string;
  title: string;
  visual: string;
}) {
  const signalLabel: Record<string, string> = {
    lead: "Lead scored",
    agent: "Agent live",
    omni: "Channels synced",
    quality: "Quality checked",
    roi: "Revenue tracked",
    insights: "Insights ready",
    control: "Rules active",
  };

  return (
    <div className="relative min-h-[190px] overflow-hidden bg-slate-950">
      <Image
        src={imageUrl}
        alt={`${title} feature`}
        fill
        sizes="(min-width: 1280px) 440px, (min-width: 768px) 44vw, 88vw"
        className="object-cover transition duration-700 group-hover:scale-[1.06] group-hover:brightness-105"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.24)_54%,rgba(15,23,42,0.72)_100%)]" />
      <div
        className="absolute inset-x-0 bottom-0 h-24 opacity-70"
        style={{
          background: `linear-gradient(180deg, transparent, ${accent}55)`,
        }}
      />

      <div className="absolute left-4 top-4 rounded-md border border-white/20 bg-slate-950/48 px-3 py-1.5 text-[0.68rem] font-black uppercase text-white shadow-[0_12px_35px_rgba(15,23,42,0.22)] backdrop-blur-md transition duration-500 group-hover:-translate-y-0.5 group-hover:border-white/35 group-hover:bg-slate-950/62">
        {signalLabel[visual] ?? "Workflow live"}
      </div>
    </div>
  );
}

export function WhoWeAreSection() {
  const featureTrackRef = useRef<HTMLDivElement>(null);

  const scrollFeatureCards = (direction: "previous" | "next") => {
    const track = featureTrackRef.current;

    if (!track) {
      return;
    }

    const firstCard = track.querySelector("article");
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 420;
    const gap = 16;

    track.scrollBy({
      left: direction === "next" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto w-full max-w-[1360px] px-4 pt-14 pb-20 sm:px-6 lg:px-8" id="company">
      <div className="grid gap-16">
        <div className="grid gap-7">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.62fr)] lg:items-end">
            <div>
              <p className="m-0 w-fit rounded-full bg-white/75 px-4 py-2 text-[0.68rem] font-black uppercase text-[#0f766e] shadow-[0_12px_35px_rgba(15,23,42,0.07)] ring-1 ring-[#00ADB5]/15 dark:bg-white/[0.07] dark:text-[#5eead4] dark:ring-white/10">
                Voice agents for sales, support, and operations
              </p>
              <h2 className="mt-4 mb-0 max-w-4xl text-[clamp(1.85rem,3.4vw,3rem)] leading-tight font-black text-slate-950 dark:text-white">
                Put customer calls on autopilot with voice agents that listen, act, and hand off.
              </h2>
            </div>
            <p className="m-0 text-sm leading-7 font-medium text-slate-600 sm:text-base dark:text-slate-300">
              Use AI voice agents to answer routine questions, qualify callers, schedule follow-ups,
              and keep your team focused on the conversations that need a human touch.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {voiceAgentUseCards.map((card) => (
              <article
                className={`group relative grid min-h-[330px] overflow-hidden rounded-lg border border-white/70 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_28px_74px_rgba(15,23,42,0.14)] dark:border-white/10 dark:[background:var(--card-bg-dark)] sm:p-6 ${card.layout}`}
                key={card.title}
                style={
                  {
                    "--card-bg": card.background,
                    "--card-bg-dark": card.darkBackground,
                    "--card-accent": card.accent,
                    background: "var(--card-bg)",
                  } as CSSProperties
                }
              >
                <div
                  className="absolute inset-x-0 top-0 h-1.5 bg-[var(--card-accent)] transition duration-500 group-hover:h-2"
                  aria-hidden="true"
                />
                <div className="pointer-events-none absolute -right-16 -bottom-16 size-48 rounded-full bg-[var(--card-accent)]/15 blur-2xl transition duration-500 group-hover:scale-125" />
                <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-[linear-gradient(90deg,transparent,var(--card-accent),transparent)] opacity-55" />

                <div className="relative z-10 grid min-h-[280px] content-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-white/80 text-[var(--card-accent)] shadow-[0_14px_35px_rgba(15,23,42,0.10)] ring-1 ring-white/80 dark:bg-white/[0.10] dark:ring-white/10">
                        <svg
                          aria-hidden="true"
                          className="size-6"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 3v18" />
                          <path d="M8 7v10" />
                          <path d="M16 7v10" />
                          <path d="M4 10v4" />
                          <path d="M20 10v4" />
                        </svg>
                      </span>
                      <div className="rounded-lg bg-white/78 px-3 py-2 text-right shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 dark:bg-white/[0.08] dark:ring-white/10">
                        <strong className="block text-lg leading-none font-black text-slate-950 dark:text-white">
                          {card.stat}
                        </strong>
                        <span className="text-[0.62rem] font-black uppercase text-slate-500 dark:text-slate-300">
                          {card.label}
                        </span>
                      </div>
                    </div>

                    <div className="mt-7">
                      <h3 className="m-0 text-xl leading-7 font-black text-slate-950 transition duration-500 group-hover:text-[var(--card-accent)] dark:text-white">
                        {card.title}
                      </h3>
                      <p className="mt-3 mb-0 text-sm leading-6 font-medium text-slate-600 dark:text-slate-300">
                        {card.copy}
                      </p>
                    </div>

                    <VoiceAgentCardVisual
                      accent={card.accent}
                      chips={card.chips}
                      visual={card.visual}
                    />
                  </div>

                  <div className="mt-7 flex items-center gap-2 text-[0.68rem] font-black uppercase text-slate-500 dark:text-slate-300">
                    <span className="size-2 rounded-full bg-[var(--card-accent)] shadow-[0_0_18px_var(--card-accent)]" />
                    Built for voice calls
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <section
          className="grid gap-8 py-12"
          aria-labelledby="industries-heading"
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <p className="m-0 text-xs font-black uppercase text-[#0f766e] dark:text-[#5eead4]">
                Industries we serve
              </p>
              <h2
                className="mt-3 mb-0 text-[clamp(1.85rem,3.4vw,3rem)] leading-tight font-black text-slate-950 dark:text-white"
                id="industries-heading"
              >
                Voice agents built for real business conversations.
              </h2>
            </div>
            <p className="m-0 max-w-2xl text-sm leading-7 font-medium text-slate-600 sm:text-base dark:text-slate-300">
              From appointment-heavy teams to fast-moving operations, AI voice agents help
              businesses answer faster, capture better details, and hand off important moments
              with context.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {industryCards.map((industry) => (
              <article
                className="group overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-500 hover:-translate-y-2 hover:border-[#00ADB5]/35 hover:shadow-[0_30px_76px_rgba(0,173,181,0.16)] dark:border-white/10 dark:bg-slate-950 dark:hover:border-[#5eead4]/35"
                key={industry.title}
              >
                <div className="relative min-h-[220px] overflow-hidden">
                  <Image
                    src={industry.imageUrl}
                    alt={`${industry.title} industry`}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.06] group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_0%,rgba(15,23,42,0.42)_100%)]" />
                  <div className="absolute bottom-4 left-4 rounded-md border border-white/20 bg-slate-950/52 px-3 py-1.5 text-[0.68rem] font-black uppercase text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)] backdrop-blur transition duration-500 group-hover:-translate-y-0.5 group-hover:border-white/35 group-hover:bg-slate-950/66">
                    {industry.signal}
                  </div>
                </div>
                <div className="grid min-h-[215px] content-between gap-5 p-5">
                  <div>
                    <p className="m-0 text-xs font-black uppercase text-[#0f766e]">
                      {industry.tag}
                    </p>
                    <h3 className="mt-3 mb-0 text-xl leading-7 font-black text-slate-950 transition duration-500 group-hover:text-[#0f766e] dark:text-white dark:group-hover:text-[#5eead4]">
                      {industry.title}
                    </h3>
                    <p className="mt-3 mb-0 text-sm leading-6 font-medium text-slate-600 dark:text-slate-300">
                      {industry.copy}
                    </p>
                  </div>
                  <div className="rounded-md bg-slate-950/[0.035] px-3 py-3 dark:bg-white/[0.05]">
                    <span className="text-xs font-bold text-slate-500 transition duration-500 group-hover:text-slate-800 dark:text-slate-300 dark:group-hover:text-white">
                      24/7 voice coverage
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(430px,1.15fr)]">
          <div className="text-slate-950 dark:text-white">
            <p className="m-0 text-xs font-black uppercase text-[#00ADB5]">Evolution</p>
            <h2 className="mt-3 mb-6 text-[clamp(1.65rem,3vw,2.5rem)] leading-tight font-black">
              AI Voice Technology changed how businesses handle calls.
            </h2>

            <div className="grid gap-3" aria-label="Voice technology stages">
              {evolutionCards.map((card) => (
                <article
                  className="group overflow-hidden rounded-lg border border-slate-200/80 bg-white px-5 py-5 shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition duration-500 hover:-translate-y-1 hover:border-[#00ADB5]/30 hover:shadow-[0_20px_52px_rgba(0,173,181,0.12)] dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-[#5eead4]/35 dark:hover:bg-white/[0.07]"
                  key={card.title}
                >
                  <h3 className="m-0 text-lg font-black transition duration-500 group-hover:text-[#0f766e] dark:group-hover:text-[#5eead4]">{card.title}</h3>
                  <p className="m-0 mt-2 leading-6 text-slate-600 dark:text-slate-300">{card.copy}</p>
                </article>
              ))}
            </div>
          </div>

          <div
            className="relative grid min-h-[540px] content-end overflow-hidden rounded-lg border border-slate-200 bg-white/70 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-8 dark:border-white/10 dark:bg-black/15 dark:shadow-none"
            aria-label="Evolution of AI voice technology"
          >
            <Image
              src="/images/ai_voice2.gif"
              className="absolute inset-x-1/2 top-1/2 w-[600px] max-w-none -translate-x-1/2 -translate-y-[58%] scale-[1.55] mix-blend-multiply dark:mix-blend-lighten"
              alt="AI voice platform preview"
              width={600}
              height={600}
              unoptimized
            />
            <div className="relative z-10 mb-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="rounded-full bg-white/80 px-2 py-2 shadow-sm dark:bg-black/40 dark:shadow-none">Manual calls</span>
              <span className="rounded-full bg-white/80 px-2 py-2 shadow-sm dark:bg-black/40 dark:shadow-none">Rigid IVR</span>
              <span className="rounded-full border border-[#00ADB5]/30 bg-[#00ADB5]/15 px-2 py-2 text-slate-950 dark:text-white">
                AI voice agents
              </span>
            </div>
            <strong className="relative z-10 text-2xl font-black text-slate-950 dark:text-white">Voice AI Evolution</strong>
            <p className="relative z-10 mt-2 mb-0 leading-7 text-slate-600 dark:text-slate-300">
              From missed calls and manual updates to always-on intelligent conversations.
            </p>
          </div>
        </div>

        <section
          className="relative -mx-4 overflow-hidden bg-[linear-gradient(135deg,rgba(248,250,252,0.96),rgba(240,253,250,0.82)_42%,rgba(238,242,255,0.92))] px-4 py-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(17,24,39,0.92)_48%,rgba(20,30,46,0.96))]"
          id="features"
          aria-labelledby="feature-stack-heading"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(0,173,181,0.13),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(124,58,237,0.12),transparent_28%)]" />

          <div className="relative grid gap-7">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_auto] lg:items-end">
              <div className="max-w-2xl">
                <p className="m-0 text-[0.68rem] font-black uppercase text-[#0f766e] dark:text-[#5eead4]">
                  Feature stack
                </p>
                <h2
                  className="mt-2 mb-0 text-[clamp(1.55rem,3vw,2.35rem)] leading-tight font-black text-slate-950 dark:text-white"
                  id="feature-stack-heading"
                >
                  A smarter control layer for every customer call.
                </h2>
                <p className="mt-3 mb-0 max-w-xl text-xs leading-6 font-medium text-slate-600 sm:text-sm dark:text-slate-300">
                  A compact set of AI voice capabilities for lead capture, live assistance,
                  quality review, revenue tracking, and operations control.
                </p>
              </div>

              <div className="grid gap-3 justify-self-start lg:justify-self-end">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    ["7", "modules"],
                    ["24/7", "coverage"],
                    ["Live", "handoff"],
                  ].map(([value, label]) => (
                    <div
                      className="grid min-w-16 gap-0.5 rounded-md bg-white/65 px-2.5 py-2 shadow-[0_10px_28px_rgba(15,23,42,0.06)] dark:bg-white/[0.06]"
                      key={label}
                    >
                      <strong className="text-sm font-black text-slate-950 dark:text-white">
                        {value}
                      </strong>
                      <span className="text-[0.6rem] font-bold uppercase text-slate-500 dark:text-slate-300">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    aria-label="Previous feature"
                    className="grid size-9 place-items-center rounded-full border border-slate-300 bg-white/80 text-slate-950 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[#00ADB5]/45 hover:text-[#0f766e] dark:border-white/10 dark:bg-white/[0.08] dark:text-white dark:hover:text-[#5eead4]"
                    onClick={() => scrollFeatureCards("previous")}
                    type="button"
                  >
                    <svg
                      aria-hidden="true"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    aria-label="Next feature"
                    className="grid size-9 place-items-center rounded-full border border-[#00ADB5]/30 bg-slate-950 text-white shadow-[0_12px_32px_rgba(0,173,181,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0f766e] dark:border-[#5eead4]/30 dark:bg-[#00ADB5]/18"
                    onClick={() => scrollFeatureCards("next")}
                    type="button"
                  >
                    <svg
                      aria-hidden="true"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Feature cards"
              ref={featureTrackRef}
            >
              {featureStackCards.map((feature, index) => (
                <article
                  className="group min-w-[min(84vw,350px)] snap-start overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.09)] transition duration-500 hover:-translate-y-2 hover:border-[#00ADB5]/35 hover:shadow-[0_30px_78px_rgba(0,173,181,0.16)] dark:border-white/10 dark:bg-slate-950 dark:hover:border-[#5eead4]/35"
                  id={`feature-card-${index + 1}`}
                  key={feature.title}
                >
                  <FeaturePhoto
                    accent={feature.accent}
                    imageUrl={feature.imageUrl}
                    title={feature.title}
                    visual={feature.visual}
                  />
                  <div className="grid min-h-[205px] content-between gap-4 p-5">
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <p
                          className="m-0 text-[0.68rem] font-black uppercase"
                          style={{ color: feature.accent }}
                        >
                          {feature.tag}
                        </p>
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[0.65rem] font-black uppercase text-slate-500 transition duration-500 group-hover:bg-[#00ADB5]/10 group-hover:text-[#0f766e] dark:bg-white/[0.07] dark:text-slate-300 dark:group-hover:text-[#5eead4]">
                          Ready
                        </span>
                      </div>
                      <h3 className="mt-2 mb-0 text-lg leading-6 font-black text-slate-950 transition duration-500 group-hover:text-[#0f766e] dark:text-white dark:group-hover:text-[#5eead4]">
                        {feature.title}
                      </h3>
                      <p className="mt-3 mb-0 text-xs leading-5 font-medium text-slate-600 sm:text-sm sm:leading-6 dark:text-slate-300">
                        {feature.copy}
                      </p>
                    </div>
                    <div className="rounded-md bg-slate-950/[0.035] px-3 py-3 dark:bg-white/[0.05]">
                      <span className="text-[0.68rem] font-bold text-slate-500 transition duration-500 group-hover:text-slate-800 dark:text-slate-300 dark:group-hover:text-white">
                        Workflow ready
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
