import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { ProductServiceHeroPhoto } from "@/components/layout/ProductServiceHeroPhoto";
import { SiteLayout } from "@/components/layout/SiteLayout";
import {
  VoiceAgentConfigExplorer,
  type ProductConfigurationItem,
} from "@/components/layout/VoiceAgentConfigExplorer";
import { productPageDesigns } from "@/config/productPageDesigns";
import type { ProductServiceExperience } from "@/config/productServiceExperiences";

type ServiceOverview = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  highlights: readonly string[];
};

type ProductServicePageProps = {
  service: ServiceOverview;
  experience: ProductServiceExperience;
};

const waveform = [16, 26, 42, 22, 54, 34, 66, 28, 48, 72, 38, 58, 24, 46, 30, 62, 36, 20, 44, 28];
const serviceMarks: Record<string, string> = {};

const pageThemes = {
  Build: {
    "--service-accent": "#35fbe0",
    "--service-accent-soft": "#75fff0",
    "--service-accent-rgb": "53, 251, 224",
    "--service-secondary": "#8f83e8",
    "--service-secondary-rgb": "143, 131, 232",
    "--service-tertiary": "#ffad73",
    "--service-tertiary-rgb": "255, 173, 115",
  },
  Deploy: {
    "--service-accent": "#a99cff",
    "--service-accent-soft": "#d3ccff",
    "--service-accent-rgb": "169, 156, 255",
    "--service-secondary": "#35fbe0",
    "--service-secondary-rgb": "53, 251, 224",
    "--service-tertiary": "#ffad73",
    "--service-tertiary-rgb": "255, 173, 115",
  },
  Monitor: {
    "--service-accent": "#ffad73",
    "--service-accent-soft": "#ffd0ae",
    "--service-accent-rgb": "255, 173, 115",
    "--service-secondary": "#35fbe0",
    "--service-secondary-rgb": "53, 251, 224",
    "--service-tertiary": "#8f83e8",
    "--service-tertiary-rgb": "143, 131, 232",
  },
} as const;

const agentBuildingLayers = [
  {
    number: "01",
    name: "Identity",
    title: "How it sounds and speaks",
    body: "Its name, voice, personality, and greeting. This is what a caller experiences in the first few seconds.",
    className: "agent-layer-identity",
  },
  {
    number: "02",
    name: "Knowledge",
    title: "What it's allowed to say",
    body: "FAQs, pricing, policies, and business details. The agent only answers from what you've given it — nothing invented.",
    className: "agent-layer-knowledge",
  },
  {
    number: "03",
    name: "Actions",
    title: "What it can actually do",
    body: "Calendar bookings, CRM updates, call transfers. This is what turns a conversation into a completed task.",
    className: "agent-layer-actions",
  },
] as const;

const voiceAgentBuildSteps = [
  {
    title: "Define the agent",
    body: "Set its name, voice, tone, and opening message.",
  },
  {
    title: "Add its knowledge",
    body: "Upload FAQs, pricing, and policies it should answer from.",
  },
  {
    title: "Connect its actions",
    body: "Link your calendar, CRM, or other tools it should use.",
  },
  {
    title: "Test it yourself",
    body: "Preview real conversations and adjust before anyone else calls in.",
  },
  {
    title: "Deploy it",
    body: "Publish to your phone number, website widget, or app.",
  },
  {
    title: "Monitor and refine",
    body: "Review transcripts and outcomes, and adjust the agent as needed.",
  },
] as const;

const voiceAgentCapabilities = [
  {
    title: "Answer every call",
    body: "Handle customer calls around the clock, even during your busiest hours.",
    icon: "call",
    color: "#35fbe0",
  },
  {
    title: "Understand naturally",
    body: "Follow language, interruptions, follow-up questions, and changing requests.",
    icon: "conversation",
    color: "#75baff",
  },
  {
    title: "Complete tasks",
    body: "Book appointments, update CRMs, create tickets, and capture qualified details.",
    icon: "checklist",
    color: "#a99cff",
  },
  {
    title: "Access knowledge",
    body: "Give accurate answers from approved FAQs, documents, policies, and data.",
    icon: "knowledge",
    color: "#ffb37d",
  },
  {
    title: "Handoff to humans",
    body: "Transfer calls with the full context and conversation history when needed.",
    icon: "handoff",
    color: "#ff9fb7",
  },
  {
    title: "Learn and improve",
    body: "Use transcripts, summaries, outcomes, and analytics to improve over time.",
    icon: "insights",
    color: "#f6db75",
  },
] as const;

const everythingIncludedCapabilities = [
  {
    title: "Voice Personalities",
    body: "Create voices that match your brand with custom tone, style, and speaking behavior.",
    icon: "personality",
  },
  {
    title: "Multilingual Conversations",
    body: "Speak naturally across 40+ languages and connect with customers worldwide.",
    icon: "languages",
  },
  {
    title: "Knowledge Base",
    body: "Ground responses using your documents, PDFs, websites, FAQs, and internal resources.",
    icon: "knowledge",
  },
  {
    title: "Function Calling",
    body: "Trigger APIs, update CRMs, schedule appointments, send emails, create tickets, and automate workflows.",
    icon: "workflow",
  },
  {
    title: "Analytics Dashboard",
    body: "Track call outcomes, success rates, caller satisfaction, and conversation quality in real time.",
    icon: "dashboard",
  },
  {
    title: "Enterprise Security",
    body: "Role-based access, encrypted conversations, secure infrastructure, and enterprise-ready deployment.",
    icon: "security",
  },
] as const;

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="service-pill inline-flex rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em]">
      {children}
    </span>
  );
}

type VoiceAgentCapabilityIconName = "call" | "conversation" | "checklist" | "knowledge" | "handoff" | "insights" | "security";

function VoiceAgentCapabilityIcon({ name }: { name: VoiceAgentCapabilityIconName }) {
  const common = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 1.6 };

  if (name === "call") {
    return (
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" {...common}>
        <path d="M6.5 5.5c1.9-.6 3.8 0 5.1 1.3l1 1c.6.6.8 1.4.4 2.1l-1.2 2c-.4.7-.2 1.5.4 2.1l1 1c1.3 1.3 1.9 3.2 1.3 5.1-.5 1.6-1.8 2.9-3.4 3.4-2.9.9-6-.1-8.1-2.2C3.1 13.9 2.2 9.9 3.1 7c.5-1.6 1.8-2.9 3.4-3.4Z" />
      </svg>
    );
  }

  if (name === "conversation") {
    return (
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" {...common}>
        <path d="M5 6h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8l-3 3V7a1 1 0 0 1 1-1Z" />
        <path d="M7 9h10M7 13h6" />
      </svg>
    );
  }

  if (name === "checklist") {
    return (
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" {...common}>
        <path d="M5 5.5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z" />
        <path d="M8.5 11.5 10.5 13.5 15.5 8.5" />
        <path d="M8.5 16.5h3M14.5 12.5h2" />
      </svg>
    );
  }

  if (name === "knowledge") {
    return (
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" {...common}>
        <path d="M6 4.5h12a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z" />
        <path d="M6 7.5h12M6 11.5h12" />
      </svg>
    );
  }

  if (name === "handoff") {
    return (
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" {...common}>
        <path d="M8 7h8M8 7l4-4m0 4-4 4" />
        <path d="M8 17h8M16 17l-4 4m4-4-4-4" />
      </svg>
    );
  }

  if (name === "insights") {
    return (
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" {...common}>
        <path d="M6 16.5V11l3-3 2 2 4-4 4 4v8.5H6Z" />
        <path d="M14 12.5h4" />
      </svg>
    );
  }

  if (name === "security") {
    return (
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" {...common}>
        <path d="M12 3 5 6v5c0 5.25 3.75 9.75 7 10 3.25-.25 7-4.75 7-10V6l-7-3Z" />
        <path d="M9.5 12.5 11 14l3-3" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" {...common}>
      <path d="M6 16.5V11l3-3 2 2 4-4 4 4v8.5H6Z" />
      <path d="M14 12.5h4" />
    </svg>
  );
}

type EverythingIncludedIconName =
  | "personality"
  | "languages"
  | "knowledge"
  | "workflow"
  | "dashboard"
  | "security";

function EverythingIncludedIcon({
  name,
}: {
  name: EverythingIncludedIconName;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };

  if (name === "personality") {
    return (
      <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" {...common}>
        <path d="M6 4v16" />
        <circle cx="6" cy="8" r="1.8" />
        <path d="M12 4v16" />
        <circle cx="12" cy="15" r="1.8" />
        <path d="M18 4v16" />
        <circle cx="18" cy="11" r="1.8" />
      </svg>
    );
  }

  if (name === "languages") {
    return (
      <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16" />
        <path d="M12 4c2.8 2.5 4 5.2 4 8s-1.2 5.5-4 8" />
        <path d="M12 4c-2.8 2.5-4 5.2-4 8s1.2 5.5 4 8" />
      </svg>
    );
  }

  if (name === "knowledge") {
    return (
      <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" {...common}>
        <path d="M6 6h10a2 2 0 0 1 2 2v10H8a2 2 0 0 0-2 2V6Z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    );
  }

  if (name === "workflow") {
    return (
      <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" {...common}>
        <circle cx="6" cy="12" r="1.5" />
        <circle cx="12" cy="6" r="1.5" />
        <circle cx="18" cy="12" r="1.5" />
        <circle cx="12" cy="18" r="1.5" />
        <path d="M7.5 12h9" />
        <path d="M12 7.5v9" />
      </svg>
    );
  }

  if (name === "dashboard") {
    return (
      <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" {...common}>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M4 9h16" />
        <path d="M8 15v2" />
        <path d="M12 12v5" />
        <path d="M16 10v7" />
      </svg>
    );
  }

  if (name === "security") {
    return (
      <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" {...common}>
        <path d="M12 3 5 6v5c0 4.5 3.2 8.3 7 9 3.8-.7 7-4.5 7-9V6l-7-3Z" />
        <rect x="10" y="11" width="4" height="4" rx=".7" />
        <path d="M11 11V9.8a1 1 0 0 1 2 0V11" />
      </svg>
    );
  }

  return null;
}

function BuildProcessIcon({ index }: { index: number }) {
  const common = "fill-none stroke-current";

  if (index === 0) {
    return (
      <svg aria-hidden="true" className="size-8" viewBox="0 0 24 24">
        <circle className={common} cx="12" cy="8" r="3.25" strokeWidth="1.5" />
        <path className={common} d="M5.5 19c.8-3.3 3-5 6.5-5s5.7 1.7 6.5 5" strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg aria-hidden="true" className="size-8" viewBox="0 0 24 24">
        <path className={common} d="M7 3.75h7l3 3V20.25H7zM14 3.75v3h3M9.5 11h5M9.5 14.5h5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg aria-hidden="true" className="size-8" viewBox="0 0 24 24">
        <path className={common} d="M9.2 14.8 7.5 16.5a3.54 3.54 0 0 1-5-5l3-3a3.54 3.54 0 0 1 5 0M14.8 9.2l1.7-1.7a3.54 3.54 0 0 1 5 5l-3 3a3.54 3.54 0 0 1-5 0M8.5 15.5l7-7" strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    );
  }

  if (index === 3) {
    return (
      <svg aria-hidden="true" className="size-8" viewBox="0 0 24 24">
        <path className={common} d="M4 12h2.2l1.4-4 2.4 8 2.2-7 1.8 5 1.5-2H20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <circle className={common} cx="12" cy="12" r="9" strokeWidth="1.25" />
      </svg>
    );
  }

  if (index === 4) {
    return (
      <svg aria-hidden="true" className="size-8" viewBox="0 0 24 24">
        <path className={common} d="M12 16V4M7.5 8.5 12 4l4.5 4.5M5 14v5h14v-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-8" viewBox="0 0 24 24">
      <path className={common} d="M5 19V9M10 19V5M15 19v-7M20 19V3M3.5 19.5h18" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

// Kept temporarily for the existing service-console styles below.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ProductDemo({ experience, service }: { experience: ProductServiceExperience; service: ServiceOverview }) {
  const mark = serviceMarks[service.slug] ?? "AI";

  return (
    <div className="product-service-visual relative mx-auto w-full max-w-[600px] py-5 sm:px-6 sm:py-8">
      {service.slug !== "voice-agents" && (
        <>
          <div className="product-orbit product-orbit-one absolute left-1/2 top-1/2 size-[108%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div className="product-orbit product-orbit-two absolute left-1/2 top-1/2 size-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </>
      )}
      <div className="service-float-chip service-float-chip-one absolute -left-2 top-0 z-20 hidden items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] sm:flex">
        <span className="service-live-dot size-1.5 rounded-full" /> Listen
      </div>
      <div className="service-float-chip service-float-chip-two absolute -right-2 bottom-2 z-20 hidden items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] sm:flex">
        Act <span aria-hidden="true">↗</span>
      </div>

      <div className="product-service-console relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
      <div className="flex items-center justify-between gap-5 border-b border-white/[0.08] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="service-mark grid size-9 place-items-center rounded-lg text-[11px] font-black" aria-hidden="true">{mark}</span>
          <div>
            <strong className="block text-xs font-bold text-white">{service.title}</strong>
            <span className="mt-0.5 block text-[10px] text-slate-500">Live workflow canvas</span>
          </div>
        </div>
        <span className="service-status inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] sm:text-[11px]">
          <span className="service-live-dot size-1.5 rounded-full" />
          {experience.demo.status}
        </span>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex h-24 items-center justify-center gap-1" aria-label="Voice activity waveform">
          {waveform.map((height, index) => (
            <span
              className="service-waveform-bar w-1 rounded-full opacity-90"
              key={`${height}-${index}`}
              style={{ animationDelay: `${index * -70}ms`, height }}
            />
          ))}
        </div>

        <div className="mt-3 grid gap-3">
          <div className="mr-8 rounded-xl rounded-tl-sm border border-white/[0.08] bg-white/[0.04] p-4 sm:mr-14">
            <span className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-500">Input</span>
            <p className="mt-2 text-sm leading-6 text-slate-200">{experience.demo.caller}</p>
          </div>
          <div className="service-response ml-8 rounded-xl rounded-tr-sm p-4 sm:ml-14">
            <span className="service-accent-text text-[10px] font-black uppercase tracking-[0.13em]">vozon.ai</span>
            <p className="mt-2 text-sm leading-6 text-white">{experience.demo.agent}</p>
          </div>
        </div>

        <div className="service-event mt-5 flex items-center justify-between gap-4 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="service-solid grid size-8 shrink-0 place-items-center rounded-lg text-sm font-black">&#10003;</span>
            <div>
              <span className="service-accent-text block text-[10px] font-black uppercase tracking-[0.12em]">Latest event</span>
              <strong className="mt-1 block text-xs font-semibold text-white sm:text-sm">{experience.demo.action}</strong>
            </div>
          </div>
          <span className="service-accent-text hidden text-lg sm:block">&rarr;</span>
        </div>
      </div>
      </div>
    </div>
  );
}

export function ProductServicePage({ service, experience }: ProductServicePageProps) {
  const design = productPageDesigns[service.slug];
  const isVoiceAgents = service.slug === "voice-agents";
  const buildingLayers = isVoiceAgents
    ? agentBuildingLayers
    : experience.capabilities.map((capability, index) => ({
        number: String(index + 1).padStart(2, "0"),
        name: capability.eyebrow,
        title: capability.title,
        body: capability.body,
        className: ["agent-layer-identity", "agent-layer-knowledge", "agent-layer-actions"][index % 3],
      }));
  const buildSteps = isVoiceAgents ? voiceAgentBuildSteps : experience.workflow;
  const configurationExplorerItems: readonly ProductConfigurationItem[] | undefined = isVoiceAgents
    ? undefined
    : experience.capabilities.map((capability) => ({
        title: capability.title,
        shortTitle: capability.eyebrow,
        microcopy: capability.points.slice(0, 2).join(" · "),
        description: capability.body,
        options: capability.points,
      }));
  const theme = design
    ? {
        "--service-accent": design.accent,
        "--service-accent-soft": design.accentSoft,
        "--service-accent-rgb": design.accentRgb,
        "--service-secondary": design.secondary,
        "--service-secondary-rgb": design.secondaryRgb,
        "--service-tertiary": design.tertiary,
        "--service-tertiary-rgb": design.tertiaryRgb,
      }
    : pageThemes[service.kicker as keyof typeof pageThemes] ?? pageThemes.Build;

  return (
    <SiteLayout>
      <div
        className={`product-service-page product-page-${service.slug} voice-agent-page bg-black text-white`}
        style={theme as CSSProperties}
      >
        <section className="product-service-hero relative overflow-hidden px-5 pb-8 pt-32 sm:px-8 sm:pb-10 sm:pt-36 lg:pt-40">
          <div
            className={`voice-agent-container relative mx-auto grid w-full min-w-0 max-w-[1240px] gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.88fr)] lg:items-center ${service.slug === "voice-agents" ? "voice-agent-hero-container" : ""}`}
          >
            <div className="min-w-0 max-w-3xl">
              <Pill>
                {service.kicker} / {experience.label}
              </Pill>
              <h1 className="voice-agents-hero-heading mt-7 font-semibold leading-[0.98] tracking-[-0.055em]">
                <span className="product-service-heading-primary block">
                  {experience.heroTitle}
                </span>{" "}
                <span className="product-service-heading-accent block">
                  {experience.heroAccent}
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-[0.95rem] leading-7 text-slate-300 sm:text-[1.05rem] sm:leading-8">
                {service.summary}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  className="service-primary-button inline-flex min-h-12 items-center rounded-lg px-6 text-sm font-extrabold transition hover:-translate-y-0.5"
                  href="/#demo"
                >
                  Try a demo <span className="ml-3">&rarr;</span>
                </Link>
                <Link
                  className="service-secondary-button inline-flex min-h-12 items-center rounded-lg border border-white/15 bg-white/[0.04] px-6 text-sm font-extrabold text-white transition"
                  href="/contact"
                >
                  Contact sales
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
                {service.highlights.map((highlight) => (
                  <span
                    className="inline-flex items-center gap-2"
                    key={highlight}
                  >
                    <span className="service-live-dot size-1.5 rounded-full" />
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            <ProductServiceHeroPhoto
              slug={service.slug}
              title={service.title}
            />
          </div>
        </section>

        {isVoiceAgents && (
          <>
            <section className="voice-capabilities-section relative overflow-hidden border-b border-white/[0.06] bg-black px-5 py-20 sm:px-8 sm:py-24">
              <div className="voice-agent-container relative mx-auto max-w-[1240px]">
                <div className="voice-capabilities-intro mx-auto max-w-4xl text-center">
                  <div className="flex justify-center">
                    <Pill>Voice agent capabilities</Pill>
                  </div>
                  <h2 className="voice-blueprint-heading mt-6 font-semibold leading-tight tracking-[-0.045em]">
                    What your voice agent can do.
                  </h2>
                  <p className="voice-capabilities-copy mx-auto mt-6 max-w-3xl">
                    Built for natural conversations and useful work, with a
                    human handoff whenever it matters.
                  </p>
                </div>

                <div className="voice-capabilities-grid mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {voiceAgentCapabilities.map((capability) => (
                    <article
                      key={capability.title}
                      className="voice-capability-card voice-agent-action-card rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"
                    >
                      <div
                        className="voice-capability-icon flex size-12 shrink-0 items-center justify-center rounded-xl border"
                        style={{
                          color: capability.color,
                          borderColor: `${capability.color}33`,
                          backgroundColor: `${capability.color}12`,
                          boxShadow: `0 0 20px ${capability.color}20`,
                        }}
                      >
                        <VoiceAgentCapabilityIcon name={capability.icon} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-white">
                          {capability.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {capability.body}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="everything-included-section relative overflow-hidden border-b border-white/[0.06] px-5 py-20 sm:px-8 sm:py-24">
              <div className="voice-agent-container mx-auto max-w-[1320px]">
                <div className="mx-auto max-w-4xl text-center">
                  <div className="flex justify-center">
                    <Pill>Everything included</Pill>
                  </div>

                  <h2 className="voice-capabilities-heading mt-6 font-semibold leading-tight tracking-[-0.045em]">
                    Everything included in your{" "}
                    <span className="text-[var(--service-accent)]">
                      voice agent.
                    </span>
                  </h2>

                  <p className="voice-capabilities-copy mx-auto mt-6 max-w-3xl">
                    All the building blocks you need to create secure, capable
                    voice experiences that represent your business well.
                  </p>
                </div>

                <div className="everything-vertical-list mt-20">
                  {everythingIncludedCapabilities.map((item) => (
                    <article
                      className="everything-vertical-item"
                      key={item.title}
                    >
                      <div className="everything-icon-circle" >
                        <EverythingIncludedIcon name={item.icon} />
                      </div>

                      <div className="everything-line">
                        <span />
                      </div>

                      <h3>{item.title}</h3>

                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <section className="agent-anatomy-section relative overflow-hidden border-b border-white/[0.06] bg-black px-5 py-20 sm:px-8 sm:py-24">
          <div className="voice-agent-container relative mx-auto max-w-[1240px]">
            <div className="voice-blueprint-intro mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <Pill>{design?.blueprintLabel ?? "What you're building"}</Pill>
              </div>
              <h2 className="voice-blueprint-heading mt-6 font-semibold leading-tight tracking-[-0.045em]">
                {design?.blueprintTitle ??
                  "Every agent is made of three things."}
              </h2>
              <p className="voice-blueprint-copy mx-auto mt-6 max-w-3xl">
                {design?.blueprintIntro ??
                  "Together, they define how your agent represents the business, what it knows, and what it can do. Update each one independently as your needs evolve."}
              </p>
            </div>

            <div className="voice-blueprint-panel mt-14 grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)] lg:gap-12 lg:p-10">
              <div className="voice-blueprint-core flex flex-col justify-between rounded-2xl p-7 sm:p-8">
                <div>
                  <p className="text-[10px] font-black tracking-[0.16em] text-[#8dd7ff] uppercase">
                    Agent blueprint
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] text-white">
                    Built to listen, decide, and act.
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/55">
                    Every capability is governed independently, then connected
                    to create one consistent call experience.
                  </p>
                </div>
                <div className="mx-auto mt-10 grid size-36 place-items-center rounded-full border border-[#a99cff]/35 bg-[#a99cff]/10 text-center shadow-[0_0_55px_rgba(169,156,255,0.16)]">
                  <span className="text-xs font-black tracking-[0.2em] text-[#d3ccff] uppercase">
                    Agent
                    <br />
                    core
                  </span>
                </div>
              </div>

              <ol className="voice-blueprint-list">
                {buildingLayers.map((layer, index) => (
                  <li
                    className={`voice-blueprint-layer ${layer.className}`}
                    key={layer.name}
                    tabIndex={0}
                  >
                    <span className="voice-blueprint-number">
                      {layer.number}
                    </span>
                    <div>
                      <p className="voice-blueprint-system">System</p>
                      <h3>{layer.name}</h3>
                      <p className="voice-blueprint-title">{layer.title}</p>
                    </div>
                    <p className="voice-blueprint-body">{layer.body}</p>
                    {index < buildingLayers.length - 1 && (
                      <span
                        className="voice-blueprint-connector"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <>
          <section className="voice-build-process relative overflow-hidden bg-black px-5 py-20 sm:px-8 sm:py-24">
            <div className="voice-agent-container relative mx-auto max-w-[1360px]">
              <div className="voice-build-redesign-intro mx-auto max-w-4xl text-center">
                <div className="flex justify-center">
                  <Pill>{design?.workflowLabel ?? "How you build it"}</Pill>
                </div>
                <h2 className="voice-build-redesign-heading mt-6 font-semibold leading-tight tracking-[-0.045em] text-white">
                  {design?.workflowTitle ??
                    "A guided process, from first setup to going live."}
                </h2>
                <p className="voice-build-redesign-copy mx-auto mt-6 max-w-3xl">
                  {design?.workflowIntro ??
                    "Move through each stage in order, or return to any step whenever your workflow changes. The builder keeps every decision clear and easy to refine."}
                </p>
              </div>

              <div className="voice-build-redesign-panel mt-14">
                <div className="voice-build-redesign-panel-head flex flex-wrap items-center justify-between gap-3">
                  <span>Guided setup workflow</span>
                  <span>{buildSteps.length} stages to launch</span>
                </div>
                <ol
                  className="voice-build-redesign-grid"
                  aria-label={`${service.title} build process`}
                >
                  {buildSteps.map((step, index) => (
                    <li
                      className={`voice-build-redesign-step voice-build-tone-${index + 1}`}
                      key={step.title}
                    >
                      <div className="voice-build-redesign-step-top">
                        <span className="voice-build-redesign-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <BuildProcessIcon index={index} />
                      </div>
                      <span className="voice-build-redesign-label">
                        Stage {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="voice-config-section relative overflow-hidden bg-black px-5 py-16 sm:px-8 sm:py-20">
            <div
              className="voice-config-wash pointer-events-none absolute inset-0"
              aria-hidden="true"
            />

            <div className="voice-agent-container relative mx-auto max-w-[1240px]">
              <div className="voice-config-intro mx-auto max-w-4xl text-center">
                <Pill>{design?.visualLabel ?? "What you can configure"}</Pill>
                <h2
                  className={`voice-config-heading mt-6 font-semibold leading-tight tracking-[-0.04em] text-white ${service.slug === "team-workflows" ? "team-workflow-config-heading" : ""}`}
                >
                  {isVoiceAgents
                    ? "Comprehensive Control Over Agent Behavior."
                    : design.visualTitle}
                </h2>
                <p className="voice-section-copy mx-auto mt-6 max-w-4xl">
                  {isVoiceAgents
                    ? "Fine-tune every detail that shapes a conversation—from voice and knowledge to handoff rules and deployment. Every control stays visible, reviewable, and easy to update."
                    : design.integrationsTitle}
                </p>
              </div>

              <VoiceAgentConfigExplorer
                items={configurationExplorerItems}
                label={`${service.title} configuration explorer`}
              />
            </div>
          </section>
        </>

        <section className="voice-faq-section px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <Pill>F.A.Q.</Pill>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
                {design.faqTitle}
              </h2>
            </div>
            <div className="mt-10 grid gap-2">
              {experience.faqs.map((faq) => (
                <details
                  className="service-faq group rounded-xl border border-white/[0.09] bg-black px-5 py-4 transition sm:px-6"
                  key={faq.question}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-semibold sm:text-base">
                    {faq.question}
                    <span className="service-accent-text grid size-7 shrink-0 place-items-center rounded-full border border-white/10 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-3xl border-t border-white/[0.07] pt-4 text-sm leading-6 text-slate-400">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="voice-agent-contact-section bg-black px-6 pb-16 pt-4 lg:px-8">
          <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-7 overflow-hidden rounded-[24px] border border-[rgba(var(--service-accent-rgb),0.35)] bg-[#07100d] p-8 text-center shadow-[0_24px_70px_rgba(var(--service-accent-rgb),0.08)] sm:p-10 md:flex-row md:text-left">
            <div
              className="pointer-events-none absolute right-[18%] top-1/2 hidden size-56 -translate-y-1/2 rounded-full border border-[rgba(var(--service-accent-rgb),0.15)] shadow-[0_0_0_24px_rgba(var(--service-accent-rgb),0.025),0_0_0_54px_rgba(var(--service-secondary-rgb),0.025)] lg:block"
              aria-hidden="true"
            />
            <div className="relative">
              <p className="service-accent-text text-xs font-bold uppercase tracking-[0.14em]">
                Ready to get started?
              </p>
              <h2 className="mt-3 text-[1.375rem] font-semibold tracking-[-0.02em] md:text-[1.75rem]">
                {design.ctaTitle}
              </h2>
            </div>
            <Link
              className="service-primary-button relative inline-flex min-h-12 shrink-0 items-center rounded-lg px-7 text-sm font-bold transition hover:-translate-y-0.5"
              href="/contact"
            >
              CONTACT US <span className="ml-3">&rarr;</span>
            </Link>
          </div>
        </section>
      </div>

      <style>{`
        .product-service-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
          -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 88%);
          mask-image: linear-gradient(to bottom, black 0%, transparent 88%);
        }

        .product-service-page {
          --service-accent: #35fbe0;
          --service-accent-soft: #75fff0;
          --service-accent-rgb: 53, 251, 224;
          --service-secondary: #8f83e8;
          --service-secondary-rgb: 143, 131, 232;
          --service-tertiary: #ffad73;
          --service-tertiary-rgb: 255, 173, 115;
        }

        .product-story-page {
          width: 100%;
          max-width: 100vw;
          overflow-x: clip;
          background:
            radial-gradient(circle at 84% 8%, rgba(var(--service-accent-rgb), 0.055), transparent 23rem),
            #050608;
        }

        .product-story-page .product-service-hero .voice-agent-container,
        .product-story-page .product-service-hero .voice-agent-container > * {
          min-width: 0;
          max-width: 100%;
        }

        .product-story-page .product-service-hero {
          background:
            radial-gradient(circle at 78% 38%, rgba(var(--service-accent-rgb), 0.075), transparent 28rem),
            radial-gradient(circle at 12% 72%, rgba(var(--service-secondary-rgb), 0.045), transparent 24rem),
            #050608;
        }

        .product-blueprint-section {
          background:
            linear-gradient(120deg, rgba(var(--service-accent-rgb), 0.028), transparent 34%),
            linear-gradient(300deg, rgba(var(--service-secondary-rgb), 0.025), transparent 34%),
            #07090d;
        }

        .product-blueprint-glow {
          background: rgba(var(--service-accent-rgb), 0.055);
        }

        .product-blueprint-card {
          transition: background-color 220ms ease;
        }

        .product-blueprint-card:hover {
          background: linear-gradient(180deg, rgba(var(--service-accent-rgb), 0.045), transparent 72%);
        }

        .product-blueprint-icon {
          border-color: rgba(var(--service-accent-rgb), 0.22);
          background: rgba(var(--service-accent-rgb), 0.075);
          color: var(--service-accent-soft);
          box-shadow: inset 0 0 18px rgba(var(--service-accent-rgb), 0.035);
        }

        .service-accent-text {
          color: var(--service-accent-soft);
        }

        .product-service-heading-primary {
          color: #f7fbff;
        }

        .product-service-heading-accent {
          color: #75fff0;
        }

        .voice-agents-hero-heading {
          font-size: clamp(3.5rem, 7vw, 6rem);
        }

        .voice-agent-hero-art {
          position: relative;
          isolation: isolate;
          width: 100%;
          max-width: 45rem;
          margin: 0 auto;
        }

        .voice-agent-hero-art::before {
          position: absolute;
          z-index: -1;
          inset: 10% 5%;
          border-radius: 50%;
          background: linear-gradient(120deg, rgba(54, 90, 255, 0.2), rgba(176, 73, 255, 0.14));
          content: "";
          filter: blur(4rem);
        }

        .voice-agent-hero-art-image {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 1.25rem;
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
        }

        .agent-anatomy-section {
          background:
            linear-gradient(90deg, rgba(53, 251, 224, 0.025), transparent 28%),
            linear-gradient(270deg, rgba(169, 156, 255, 0.025), transparent 30%),
            #000;
        }

        .voice-capabilities-section {
          background:
            radial-gradient(circle at 12% 18%, rgba(var(--service-accent-rgb), 0.11), transparent 27rem),
            radial-gradient(circle at 88% 88%, rgba(var(--service-secondary-rgb), 0.09), transparent 25rem),
            #000;
        }

        .voice-capabilities-intro {
          text-align: center;
        }

        .voice-capabilities-intro .service-pill {
          border-color: rgba(var(--service-accent-rgb), 0.28);
          background: rgba(var(--service-accent-rgb), 0.08);
          color: var(--service-accent-soft);
        }

        .voice-capabilities-heading {
          // max-width: 14ch;
          font-size: clamp(2.25rem, 4.4vw, 4.6rem);
          line-height: 1.02;
          margin-left: auto;
          margin-right: auto;
        }

        .everything-vertical-list {
            display: grid;
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 1.5rem;
          }

          .everything-vertical-item {
            border-right: 1px solid rgba(255,255,255,.08);
            position: relative;
            text-align: center;
            padding: 0 12px;
            transition: all .35s ease;
          }

          .everything-vertical-item:hover {
            transform: translateY(-8px);
          }

          .everything-icon-circle {
            width: 90px;
            height: 90px;
            margin-inline: auto;
            border-radius: 999px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--service-accent);
            border: 1px solid rgba(var(--service-accent-rgb), .25);

            background:
              radial-gradient(circle,
                rgba(var(--service-accent-rgb), .18),
                rgba(var(--service-accent-rgb), .05));

            box-shadow:
              inset 0 0 0 1px rgba(255,255,255,.05),
              0 0 40px rgba(var(--service-accent-rgb), .12);
          }

          .everything-icon-circle svg{
              width:42px;
              height:42px;
          }

          .everything-line{
              position:relative;
              width:2px;
              height:72px;
              margin:18px auto 26px;
              background:rgba(255,255,255,.08);
          }

          .everything-line span{
              position:absolute;
              left:50%;
              top:50%;
              width:10px;
              height:10px;
              transform:translate(-50%,-50%);
              border-radius:50%;
              background:var(--service-accent);
              box-shadow:
                  0 0 0 6px rgba(var(--service-accent-rgb),.12),
                  0 0 18px rgba(var(--service-accent-rgb),.45);
          }

          .everything-vertical-item h3{
              color:#fff;
              font-size:22px;
              font-weight:600;
              line-height:1.3;
              margin-bottom:18px;
          }

          .everything-vertical-item p{
              color:#9CA3AF;
              font-size:15px;
              line-height:1.9;
              max-width:220px;
              margin-inline:auto;
          }

          .everything-vertical-item:hover .everything-icon-circle{
              border-color:rgba(var(--service-accent-rgb),.55);
              box-shadow:
                0 0 60px rgba(var(--service-accent-rgb),.2);

              transform:scale(1.05);
          }

          @media (max-width:1200px){

          .everything-vertical-list{
              grid-template-columns:repeat(3,1fr);
              row-gap:70px;
          }
          }

          @media (max-width:768px){

          .everything-vertical-list{
              grid-template-columns:1fr;
              row-gap:60px;
          }

          .everything-icon-circle{
              width:74px;
              height:74px;
          }

          .everything-line{
             height:48px;
          }

          .everything-vertical-item h3{
              font-size:20px;
          }

          .everything-vertical-item p{
              max-width:300px;
          }

          }
        .voice-capabilities-copy {
          color: rgba(255, 255, 255, 0.58);
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          line-height: 1.8;
        }

        .voice-capabilities-grid {
          display: grid;
        }

        .voice-capability-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          min-height: 10.25rem;
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.035);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        .voice-agent-action-card {
          display: block;
          min-height: 12.5rem;
        }

        .voice-agent-action-card .voice-capability-icon {
          margin-bottom: 1.25rem;
        }

        .voice-capability-card:hover {
          border-color: rgba(var(--service-accent-rgb), 0.42);
          background: rgba(var(--service-accent-rgb), 0.075);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .voice-capability-icon {
          color: var(--service-accent);
          border-color: rgba(var(--service-accent-rgb), 0.26);
          background: rgba(var(--service-accent-rgb), 0.1);
          box-shadow: 0 0 28px rgba(var(--service-accent-rgb), 0.1);
        }

        .voice-capability-card:hover .voice-capability-icon {
          background: rgba(var(--service-accent-rgb), 0.16);
        }

        .everything-included-section {
          background:
            linear-gradient(180deg, rgba(var(--service-secondary-rgb), 0.07), transparent 38%),
            #050609;
        }

        .everything-included-grid {
          display: grid;
        }

        .everything-included-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          min-height: 10.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.025));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
          transition: transform 220ms ease, border-color 220ms ease, background 220ms ease;
        }

        .everything-included-card:hover {
          transform: translateY(-0.25rem);
          border-color: rgba(var(--service-accent-rgb), 0.48);
          background: linear-gradient(135deg, rgba(var(--service-accent-rgb), 0.14), rgba(255, 255, 255, 0.04));
        }

        .everything-included-icon {
          color: var(--service-accent);
          border-color: rgba(var(--service-accent-rgb), 0.34);
          background: rgba(var(--service-accent-rgb), 0.1);
          box-shadow: 0 0 26px rgba(var(--service-accent-rgb), 0.12);
        }

        .agent-anatomy-list {
          display: grid;
          gap: 1.25rem;
        }

        .agent-anatomy-layer {
          --layer-color: #35fbe0;
          --layer-rgb: 53, 251, 224;
          isolation: isolate;
          padding: 1.5rem 0;
          outline: none;
          transition: transform 240ms ease;
        }

        .agent-layer-knowledge {
          --layer-color: #a99cff;
          --layer-rgb: 169, 156, 255;
        }

        .agent-layer-actions {
          --layer-color: #ffad73;
          --layer-rgb: 255, 173, 115;
        }

        .agent-anatomy-layer::before {
          position: absolute;
          z-index: 0;
          inset: -1rem;
          background: radial-gradient(circle at 24% 38%, rgba(var(--layer-rgb), 0.13), transparent 64%);
          content: "";
          opacity: 0;
          pointer-events: none;
          transition: opacity 240ms ease;
        }

        .agent-layer-number {
          color: rgba(var(--layer-rgb), 0.72);
          transition: color 240ms ease, text-shadow 240ms ease;
        }

        .agent-layer-name {
          color: var(--layer-color);
          text-shadow: 0 0 18px rgba(var(--layer-rgb), 0.2);
          transition: text-shadow 240ms ease;
        }

        .agent-layer-side {
          position: relative;
          z-index: 1;
        }

        .agent-layer-label {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.75rem;
        }

        .agent-layer-copy {
          margin-top: 1rem;
        }

        .agent-layer-title,
        .agent-layer-body {
          transition: color 240ms ease;
        }

        .agent-anatomy-layer:is(:hover, :focus) {
          transform: translateY(-4px);
        }

        .agent-anatomy-layer:is(:hover, :focus)::before {
          opacity: 1;
        }

        .agent-anatomy-layer:is(:hover, :focus) .agent-layer-number {
          color: var(--layer-color);
          text-shadow: 0 0 16px rgba(var(--layer-rgb), 0.48);
        }

        .agent-anatomy-layer:is(:hover, :focus) .agent-layer-name {
          text-shadow: 0 0 28px rgba(var(--layer-rgb), 0.5);
        }

        .agent-anatomy-layer:is(:hover, :focus) .agent-layer-title {
          color: var(--layer-color);
        }

        .agent-anatomy-layer:is(:hover, :focus) .agent-layer-body {
          color: rgba(var(--layer-rgb), 0.76);
        }

        @media (min-width: 768px) {
          .agent-anatomy-list {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            column-gap: clamp(2rem, 5vw, 5rem);
          }

          .agent-anatomy-layer {
            min-height: 22rem;
            padding: 2.5rem 0;
          }
        }

        .voice-build-process {
          background:
            linear-gradient(125deg, rgba(53, 251, 224, 0.035), transparent 28%),
            linear-gradient(305deg, rgba(169, 156, 255, 0.04), transparent 32%),
            #000;
        }

        .voice-build-process-word {
          color: rgba(255, 255, 255, 0.018);
          font-size: clamp(8rem, 20vw, 18rem);
          letter-spacing: -0.09em;
        }

        .voice-section-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .voice-section-eyebrow > span {
          font-size: 0.62rem;
          letter-spacing: 0.05em;
          opacity: 0.52;
        }

        .voice-process-eyebrow {
          color: #75fff0;
        }

        .voice-process-heading-accent {
          background: linear-gradient(100deg, #75fff0, #8dd7ff 48%, #a99cff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .voice-build-flow {
          display: grid;
          gap: 2.25rem 3rem;
        }

        .voice-build-step {
          --step-color: #35fbe0;
          --step-rgb: 53, 251, 224;
          min-height: 155px;
          padding: 1.25rem 0 1.5rem 4.4rem;
          isolation: isolate;
        }

        .voice-build-step:nth-child(2) {
          --step-color: #75baff;
          --step-rgb: 117, 186, 255;
        }

        .voice-build-step:nth-child(3) {
          --step-color: #a99cff;
          --step-rgb: 169, 156, 255;
        }

        .voice-build-step:nth-child(4) {
          --step-color: #f58bd6;
          --step-rgb: 245, 139, 214;
        }

        .voice-build-step:nth-child(5) {
          --step-color: #ffad73;
          --step-rgb: 255, 173, 115;
        }

        .voice-build-step:nth-child(6) {
          --step-color: #8fe388;
          --step-rgb: 143, 227, 136;
        }

        .voice-build-step::after {
          content: "";
          position: absolute;
          left: 4.4rem;
          right: 0;
          bottom: 0;
          height: 1px;
          background: linear-gradient(90deg, rgba(var(--step-rgb), 0.72), rgba(var(--step-rgb), 0));
          transform-origin: left;
          transition:
            opacity 260ms ease,
            transform 260ms ease;
          opacity: 0.48;
          transform: scaleX(0.72);
        }

        .voice-build-step-number {
          position: absolute;
          left: 0;
          top: 0.55rem;
          z-index: -1;
          color: rgba(var(--step-rgb), 0.14);
          font-size: 4.25rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.08em;
          transition:
            color 260ms ease,
            transform 260ms ease;
        }

        .voice-build-stage-label {
          color: var(--step-color);
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .voice-build-step-copy {
          transition: transform 260ms ease;
        }

        .voice-build-step:hover::after {
          opacity: 0.9;
          transform: scaleX(1);
        }

        .voice-build-step:hover .voice-build-step-number {
          color: rgba(var(--step-rgb), 0.28);
          transform: translateY(-5px);
        }

        .voice-build-step:hover .voice-build-step-copy {
          transform: translateY(-6px);
        }

        .voice-build-step:hover h3 {
          color: var(--step-color);
        }

        .voice-build-step h3 {
          transition: color 260ms ease;
        }

        @media (min-width: 640px) {
          .voice-build-flow {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .voice-build-flow {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            row-gap: 2.75rem;
          }

          .voice-build-step:nth-child(2),
          .voice-build-step:nth-child(5) {
            transform: translateY(1.75rem);
          }
        }

        .voice-config-wash {
          background:
            linear-gradient(110deg, rgba(245, 139, 214, 0.035), transparent 34%),
            linear-gradient(290deg, rgba(255, 173, 115, 0.04), transparent 32%);
        }

        .voice-config-eyebrow {
          color: #f0a0dc;
        }

        .voice-config-heading-accent {
          background: linear-gradient(100deg, #f58bd6, #a99cff 48%, #75fff0);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .voice-config-list {
          display: grid;
          gap: 0.25rem 4rem;
        }

        .voice-config-item {
          --config-color: #35fbe0;
          --config-rgb: 53, 251, 224;
          display: grid;
          grid-template-columns: 2.5rem minmax(0, 1fr) 12px;
          align-items: center;
          gap: 1rem;
          min-height: 72px;
          padding: 0.75rem 0;
          isolation: isolate;
          transition:
            padding 260ms ease,
            transform 260ms ease;
        }

        .voice-config-item:nth-child(2) {
          --config-color: #75baff;
          --config-rgb: 117, 186, 255;
        }

        .voice-config-item:nth-child(3) {
          --config-color: #a99cff;
          --config-rgb: 169, 156, 255;
        }

        .voice-config-item:nth-child(4) {
          --config-color: #f58bd6;
          --config-rgb: 245, 139, 214;
        }

        .voice-config-item:nth-child(5) {
          --config-color: #ffad73;
          --config-rgb: 255, 173, 115;
        }

        .voice-config-item:nth-child(6) {
          --config-color: #8fe388;
          --config-rgb: 143, 227, 136;
        }

        .voice-config-item:nth-child(7) {
          --config-color: #75fff0;
          --config-rgb: 117, 255, 240;
        }

        .voice-config-item:nth-child(8) {
          --config-color: #c4baff;
          --config-rgb: 196, 186, 255;
        }

        .voice-config-number {
          color: rgba(var(--config-rgb), 0.42);
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          transition: color 260ms ease;
        }

        .voice-config-label {
          color: #cbd5e1;
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.5;
          transition: color 260ms ease;
        }

        .voice-config-pulse {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--config-color);
          box-shadow: 0 0 16px rgba(var(--config-rgb), 0.48);
          transition:
            box-shadow 260ms ease,
            transform 260ms ease;
        }

        .voice-config-item::before {
          content: "";
          position: absolute;
          inset: 0 -1.25rem;
          z-index: -1;
          background: linear-gradient(90deg, rgba(var(--config-rgb), 0.075), transparent 72%);
          opacity: 0;
          transform: scaleX(0.82);
          transform-origin: left;
          transition:
            opacity 260ms ease,
            transform 260ms ease;
        }

        .voice-config-item:hover {
          padding-left: 0.45rem;
        }

        .voice-config-item:hover::before {
          opacity: 1;
          transform: scaleX(1);
        }

        .voice-config-item:hover .voice-config-number,
        .voice-config-item:hover .voice-config-label {
          color: var(--config-color);
        }

        .voice-config-item:hover .voice-config-pulse {
          transform: scale(1.35);
          box-shadow: 0 0 26px rgba(var(--config-rgb), 0.8);
        }

        @media (min-width: 768px) {
          .voice-config-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .voice-config-item:nth-child(even) {
            margin-left: 1.5rem;
            transform: translateY(1.1rem);
          }

          .voice-config-item:nth-child(odd) {
            margin-right: 1.5rem;
          }

          .voice-config-item:nth-child(even):hover {
            transform: translate(0.45rem, 1.1rem);
          }

          .voice-config-item:nth-child(odd):hover {
            transform: translateX(0.45rem);
          }
        }

        .voice-build-flow {
          position: relative;
          display: grid;
          grid-template-columns: none;
          grid-auto-flow: column;
          grid-auto-columns: minmax(230px, 1fr);
          gap: 0;
          overflow-x: auto;
          padding-bottom: 0.75rem;
          overscroll-behavior-inline: contain;
          scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
          scrollbar-width: thin;
        }

        .voice-build-flow::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: linear-gradient(90deg, #35fbe0, #75baff 20%, #a99cff 40%, #f58bd6 60%, #ffad73 80%, #8fe388);
          opacity: 0.48;
        }

        .voice-build-step {
          display: grid;
          grid-template-rows: minmax(150px, 1fr) 54px minmax(150px, 1fr);
          min-height: 370px;
          padding: 0 1rem;
          isolation: isolate;
          transform: none;
        }

        .voice-build-step::after {
          display: none;
        }

        .voice-build-step-number {
          position: relative;
          left: auto;
          top: auto;
          z-index: 2;
          grid-row: 2;
          align-self: center;
          justify-self: center;
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border: 1px solid rgba(var(--step-rgb), 0.7);
          border-radius: 999px;
          background: #000;
          color: var(--step-color);
          font-size: 0.72rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.08em;
          box-shadow:
            0 0 0 6px #000,
            0 0 24px rgba(var(--step-rgb), 0.28);
        }

        .voice-build-step-copy {
          grid-row: 1;
          align-self: end;
          padding-bottom: 1.5rem;
          text-align: center;
        }

        .voice-build-step:nth-child(even) .voice-build-step-copy {
          grid-row: 3;
          align-self: start;
          padding-top: 1.5rem;
          padding-bottom: 0;
        }

        .voice-build-step:hover .voice-build-step-number {
          color: #000;
          background: var(--step-color);
          transform: scale(1.12);
          box-shadow:
            0 0 0 6px #000,
            0 0 34px rgba(var(--step-rgb), 0.72);
        }

        .voice-build-step:hover .voice-build-step-copy {
          transform: translateY(-5px);
        }

        .voice-build-step:nth-child(even):hover .voice-build-step-copy {
          transform: translateY(5px);
        }

        @media (min-width: 1180px) {
          .voice-build-flow {
            grid-template-columns: repeat(6, minmax(0, 1fr));
            grid-auto-columns: auto;
            overflow-x: visible;
          }

          .voice-build-step:nth-child(2),
          .voice-build-step:nth-child(5) {
            transform: none;
          }
        }

        .voice-config-list {
          position: relative;
          gap: 0.35rem;
        }

        .voice-config-item {
          min-height: 76px;
          padding: 0.8rem 0;
          background: transparent;
        }

        .voice-config-item::before {
          display: none;
        }

        .voice-config-item:hover {
          padding-left: 0;
        }

        @media (min-width: 768px) {
          .voice-config-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: clamp(5rem, 10vw, 9rem);
          }

          .voice-config-list::before {
            content: "";
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 1px;
            background: linear-gradient(to bottom, #35fbe0, #a99cff 45%, #f58bd6 68%, #ffad73);
            opacity: 0.45;
          }

          .voice-config-item:nth-child(odd),
          .voice-config-item:nth-child(even) {
            margin: 0;
            transform: none;
          }

          .voice-config-item:nth-child(odd) {
            grid-template-columns: minmax(0, 1fr) 2.5rem 12px;
            text-align: right;
          }

          .voice-config-item:nth-child(even) {
            grid-template-columns: 12px 2.5rem minmax(0, 1fr);
            text-align: left;
          }

          .voice-config-item:nth-child(odd) .voice-config-label {
            grid-column: 1;
            grid-row: 1;
          }

          .voice-config-item:nth-child(odd) .voice-config-number {
            grid-column: 2;
            grid-row: 1;
          }

          .voice-config-item:nth-child(odd) .voice-config-pulse {
            grid-column: 3;
            grid-row: 1;
          }

          .voice-config-item:nth-child(even) .voice-config-pulse {
            grid-column: 1;
            grid-row: 1;
          }

          .voice-config-item:nth-child(even) .voice-config-number {
            grid-column: 2;
            grid-row: 1;
          }

          .voice-config-item:nth-child(even) .voice-config-label {
            grid-column: 3;
            grid-row: 1;
          }

          .voice-config-item:nth-child(odd)::after,
          .voice-config-item:nth-child(even)::after {
            content: "";
            position: absolute;
            top: 50%;
            width: calc(clamp(5rem, 10vw, 9rem) / 2);
            height: 1px;
            background: linear-gradient(90deg, rgba(var(--config-rgb), 0.65), rgba(var(--config-rgb), 0.05));
            opacity: 0.4;
            transition:
              opacity 260ms ease,
              transform 260ms ease;
          }

          .voice-config-item:nth-child(odd)::after {
            left: 100%;
            transform-origin: left;
          }

          .voice-config-item:nth-child(even)::after {
            right: 100%;
            background: linear-gradient(90deg, rgba(var(--config-rgb), 0.05), rgba(var(--config-rgb), 0.65));
            transform-origin: right;
          }

          .voice-config-item:nth-child(odd):hover {
            transform: translateX(0.5rem);
          }

          .voice-config-item:nth-child(even):hover {
            transform: translateX(-0.5rem);
          }

          .voice-config-item:hover::after {
            opacity: 0.9;
            transform: scaleX(1.08);
          }
        }

        .voice-build-process {
          background: linear-gradient(90deg, rgba(53, 251, 224, 0.025), transparent 38%), #000;
        }

        .voice-build-flow {
          display: block;
          overflow: visible;
          padding: 0;
        }

        .voice-build-flow::before {
          display: none;
        }

        .voice-build-step {
          display: grid;
          grid-template-columns: 3.5rem minmax(0, 1fr) 1.75rem;
          grid-template-rows: auto;
          align-items: start;
          min-height: 0;
          padding: 1.65rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.09);
          transform: none;
          transition: background 260ms ease;
        }

        .voice-build-step:last-child {
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
        }

        .voice-build-step::after {
          display: none;
        }

        .voice-build-step-number {
          position: static;
          grid-column: 1;
          grid-row: 1;
          align-self: start;
          justify-self: start;
          display: block;
          width: auto;
          height: auto;
          margin-top: 0.2rem;
          border: 0;
          border-radius: 0;
          background: transparent;
          color: var(--step-color);
          font-size: 0.68rem;
          line-height: 1.5;
          box-shadow: none;
        }

        .voice-build-step-copy,
        .voice-build-step:nth-child(even) .voice-build-step-copy {
          grid-column: 2;
          grid-row: 1;
          align-self: start;
          padding: 0;
          text-align: left;
          transform: none;
        }

        .voice-build-stage-label {
          display: none;
        }

        .voice-build-step-copy h3 {
          margin-top: 0;
        }

        .voice-build-step-arrow {
          grid-column: 3;
          grid-row: 1;
          color: var(--step-color);
          font-size: 1.1rem;
          opacity: 0.38;
          transition:
            opacity 260ms ease,
            transform 260ms ease;
        }

        .voice-build-step:hover {
          background: linear-gradient(90deg, rgba(var(--step-rgb), 0.065), transparent 82%);
        }

        .voice-build-step:hover .voice-build-step-number {
          background: transparent;
          color: var(--step-color);
          box-shadow: none;
          transform: translateX(0.35rem);
        }

        .voice-build-step:hover .voice-build-step-copy,
        .voice-build-step:nth-child(even):hover .voice-build-step-copy {
          transform: translateX(0.3rem);
        }

        .voice-build-step:hover .voice-build-step-arrow {
          opacity: 1;
          transform: translateX(0.35rem);
        }

        @media (min-width: 1180px) {
          .voice-build-flow {
            display: block;
            grid-template-columns: none;
          }

          .voice-build-step:nth-child(2),
          .voice-build-step:nth-child(5) {
            transform: none;
          }
        }

        .voice-config-wash {
          background: linear-gradient(270deg, rgba(169, 156, 255, 0.035), transparent 42%);
        }

        .voice-config-list {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 0;
        }

        .voice-config-list::before {
          display: none;
        }

        .voice-config-item,
        .voice-config-item:nth-child(odd),
        .voice-config-item:nth-child(even) {
          display: grid;
          grid-template-columns: 2.5rem minmax(0, 1fr) 12px;
          align-items: center;
          min-height: 76px;
          margin: 0;
          padding: 1rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.09);
          text-align: left;
          transform: none;
        }

        .voice-config-item:last-child {
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
        }

        .voice-config-item:nth-child(odd) .voice-config-number,
        .voice-config-item:nth-child(even) .voice-config-number {
          grid-column: 1;
          grid-row: 1;
        }

        .voice-config-item:nth-child(odd) .voice-config-label,
        .voice-config-item:nth-child(even) .voice-config-label {
          grid-column: 2;
          grid-row: 1;
        }

        .voice-config-item:nth-child(odd) .voice-config-pulse,
        .voice-config-item:nth-child(even) .voice-config-pulse {
          grid-column: 3;
          grid-row: 1;
        }

        .voice-config-item:nth-child(odd)::after,
        .voice-config-item:nth-child(even)::after {
          display: none;
        }

        .voice-config-item:nth-child(odd):hover,
        .voice-config-item:nth-child(even):hover {
          padding-left: 0.45rem;
          transform: none;
          background: linear-gradient(90deg, rgba(var(--config-rgb), 0.055), transparent 82%);
        }

        @media (min-width: 768px) {
          .voice-config-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: 3rem;
          }
        }

        .voice-build-process {
          background:
            linear-gradient(135deg, rgba(53, 251, 224, 0.028), transparent 30%),
            linear-gradient(315deg, rgba(169, 156, 255, 0.032), transparent 34%),
            #000;
        }

        .voice-build-flow {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          grid-auto-flow: row;
          grid-auto-columns: auto;
          gap: 0.55rem;
          overflow: visible;
          padding: 0;
        }

        .voice-build-flow::before {
          display: none;
        }

        .voice-build-step {
          display: grid;
          grid-template-columns: 2.75rem minmax(0, 1fr) 1.5rem;
          grid-template-rows: auto;
          align-items: center;
          min-height: 92px;
          width: 100%;
          padding: 1.15rem 1.75rem 1.15rem 1.4rem;
          border: 0;
          background: linear-gradient(90deg, rgba(var(--step-rgb), 0.115), rgba(var(--step-rgb), 0.025) 58%, rgba(255, 255, 255, 0.012));
          clip-path: polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          transform: none;
          transition:
            background 260ms ease,
            transform 260ms ease;
        }

        .voice-build-step:last-child {
          border: 0;
        }

        .voice-build-step::before {
          content: "";
          position: absolute;
          left: 5px;
          top: 18%;
          bottom: 18%;
          width: 2px;
          background: var(--step-color);
          box-shadow: 0 0 16px rgba(var(--step-rgb), 0.48);
          opacity: 0.72;
        }

        .voice-build-step-number {
          grid-column: 1;
          grid-row: 1;
          margin: 0;
          color: var(--step-color);
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .voice-build-step-copy,
        .voice-build-step:nth-child(even) .voice-build-step-copy {
          display: grid;
          grid-column: 2;
          grid-row: 1;
          grid-template-columns: minmax(150px, 0.42fr) minmax(0, 1fr);
          align-items: center;
          gap: 0 2rem;
          padding: 0;
          text-align: left;
          transform: none;
        }

        .voice-build-stage-label {
          display: block;
          grid-column: 1;
          grid-row: 1;
        }

        .voice-build-step-copy h3 {
          grid-column: 1;
          grid-row: 2;
          margin-top: 0.3rem;
        }

        .voice-build-step-copy p {
          grid-column: 2;
          grid-row: 1 / span 2;
          max-width: none;
          margin-top: 0;
        }

        .voice-build-step-arrow {
          grid-column: 3;
          grid-row: 1;
          align-self: center;
          color: var(--step-color);
          opacity: 0.46;
        }

        .voice-build-step:hover {
          background: linear-gradient(90deg, rgba(var(--step-rgb), 0.18), rgba(var(--step-rgb), 0.045) 62%, rgba(255, 255, 255, 0.018));
          transform: translateX(0.45rem);
        }

        .voice-build-step:hover .voice-build-step-number,
        .voice-build-step:hover .voice-build-step-copy,
        .voice-build-step:nth-child(even):hover .voice-build-step-copy {
          background: transparent;
          box-shadow: none;
          transform: none;
        }

        .voice-build-step:hover .voice-build-step-arrow {
          opacity: 1;
          transform: translateX(0.3rem);
        }

        @media (max-width: 639px) {
          .voice-build-step-copy,
          .voice-build-step:nth-child(even) .voice-build-step-copy {
            display: block;
          }

          .voice-build-step-copy p {
            margin-top: 0.65rem;
          }
        }

        @media (min-width: 900px) {
          .voice-build-step:nth-child(1),
          .voice-build-step:nth-child(6) {
            width: 92%;
            margin-left: 0;
          }

          .voice-build-step:nth-child(2),
          .voice-build-step:nth-child(5) {
            width: 92%;
            margin-left: 4%;
            transform: none;
          }

          .voice-build-step:nth-child(3),
          .voice-build-step:nth-child(4) {
            width: 92%;
            margin-left: 8%;
          }

          .voice-build-step:nth-child(1):hover,
          .voice-build-step:nth-child(6):hover {
            transform: translateX(0.45rem);
          }

          .voice-build-step:nth-child(2):hover,
          .voice-build-step:nth-child(5):hover {
            transform: translateX(0.45rem);
          }
        }

        @media (min-width: 1180px) {
          .voice-build-flow {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
          }

          .voice-build-step:nth-child(2),
          .voice-build-step:nth-child(5) {
            transform: none;
          }
        }

        .voice-build-clean-grid {
          display: grid;
          gap: 0.5rem 2.5rem;
        }

        .voice-build-clean-step {
          --clean-step-color: #35fbe0;
          --clean-step-rgb: 53, 251, 224;
          display: grid;
          grid-template-columns: 4.25rem minmax(0, 1fr) 1.5rem;
          align-items: start;
          min-height: 190px;
          padding: 2.1rem 0;
          isolation: isolate;
        }

        .voice-build-clean-step:nth-child(2) {
          --clean-step-color: #75baff;
          --clean-step-rgb: 117, 186, 255;
        }

        .voice-build-clean-step:nth-child(3) {
          --clean-step-color: #a99cff;
          --clean-step-rgb: 169, 156, 255;
        }

        .voice-build-clean-step:nth-child(4) {
          --clean-step-color: #f58bd6;
          --clean-step-rgb: 245, 139, 214;
        }

        .voice-build-clean-step:nth-child(5) {
          --clean-step-color: #ffad73;
          --clean-step-rgb: 255, 173, 115;
        }

        .voice-build-clean-step:nth-child(6) {
          --clean-step-color: #8fe388;
          --clean-step-rgb: 143, 227, 136;
        }

        .voice-build-clean-step::before {
          content: "";
          position: absolute;
          left: 4.25rem;
          top: 1.2rem;
          width: 2.5rem;
          height: 2px;
          background: var(--clean-step-color);
          box-shadow: 0 0 14px rgba(var(--clean-step-rgb), 0.38);
          transform-origin: left;
          transition: transform 260ms ease;
        }

        .voice-build-clean-step::after {
          content: "";
          position: absolute;
          inset: 0 -1.25rem;
          z-index: -1;
          background: linear-gradient(110deg, rgba(var(--clean-step-rgb), 0.07), transparent 62%);
          opacity: 0;
          transition: opacity 260ms ease;
        }

        .voice-build-clean-number {
          color: rgba(var(--clean-step-rgb), 0.18);
          font-size: 3.4rem;
          font-weight: 700;
          line-height: 0.9;
          letter-spacing: -0.08em;
          transition:
            color 260ms ease,
            transform 260ms ease;
        }

        .voice-build-clean-copy {
          padding-top: 0.9rem;
          transition: transform 260ms ease;
        }

        .voice-build-clean-stage {
          color: var(--clean-step-color);
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .voice-build-clean-copy h3 {
          transition: color 260ms ease;
        }

        .voice-build-clean-arrow {
          margin-top: 1rem;
          color: var(--clean-step-color);
          opacity: 0;
          transition:
            opacity 260ms ease,
            transform 260ms ease;
        }

        .voice-build-clean-step:hover::before {
          transform: scaleX(1.75);
        }

        .voice-build-clean-step:hover::after {
          opacity: 1;
        }

        .voice-build-clean-step:hover .voice-build-clean-number {
          color: rgba(var(--clean-step-rgb), 0.42);
          transform: translateY(-4px);
        }

        .voice-build-clean-step:hover .voice-build-clean-copy {
          transform: translateY(-4px);
        }

        .voice-build-clean-step:hover .voice-build-clean-copy h3 {
          color: var(--clean-step-color);
        }

        .voice-build-clean-step:hover .voice-build-clean-arrow {
          opacity: 0.9;
          transform: translateX(0.35rem);
        }

        @media (min-width: 700px) {
          .voice-build-clean-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1100px) {
          .voice-build-clean-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            column-gap: 3.5rem;
          }
        }

        .voice-build-process {
          background: #020504;
        }

        .voice-build-process::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(69, 221, 206, 0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(69, 221, 206, 0.022) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at 50% 55%, black, transparent 72%);
        }

        .voice-build-orbit-viewport {
          scrollbar-color: rgba(117, 255, 240, 0.24) transparent;
          scrollbar-width: thin;
        }

        .voice-build-orbit-list {
          --orbit-size: 82px;
          position: relative;
          display: grid;
          grid-template-columns: repeat(6, minmax(160px, 1fr));
          min-width: 1000px;
        }

        .voice-build-orbit-list::before {
          position: absolute;
          top: calc(var(--orbit-size) / 2);
          right: 8.333%;
          left: 8.333%;
          height: 1px;
          background: linear-gradient(
            to right,
            rgba(53, 251, 224, 0.75),
            rgba(169, 156, 255, 0.7) 42%,
            rgba(255, 173, 115, 0.72) 78%,
            rgba(143, 227, 136, 0.5)
          );
          box-shadow: 0 0 12px rgba(117, 255, 240, 0.18);
          content: "";
        }

        .voice-build-orbit-list-compact {
          width: min(100%, 920px);
          min-width: 720px;
          grid-template-columns: repeat(4, minmax(160px, 1fr));
          margin-inline: auto;
        }

        .voice-build-orbit-list-compact::before {
          right: 12.5%;
          left: 12.5%;
        }

        .voice-build-orbit-step {
          --build-primary: #35fbe0;
          --build-rgb: 53, 251, 224;
          --build-ink: #cffff8;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1rem;
          text-align: center;
          cursor: pointer;
          outline: none;
        }

        .voice-build-tone-2 {
          --build-primary: #75baff;
          --build-rgb: 117, 186, 255;
          --build-ink: #d9ecff;
        }

        .voice-build-tone-3 {
          --build-primary: #a99cff;
          --build-rgb: 169, 156, 255;
          --build-ink: #eeeaff;
        }

        .voice-build-tone-4 {
          --build-primary: #f58bd6;
          --build-rgb: 245, 139, 214;
          --build-ink: #ffe4f7;
        }

        .voice-build-tone-5 {
          --build-primary: #ffad73;
          --build-rgb: 255, 173, 115;
          --build-ink: #ffe8d8;
        }

        .voice-build-tone-6 {
          --build-primary: #8fe388;
          --build-rgb: 143, 227, 136;
          --build-ink: #e3ffdf;
        }

        .voice-build-orbit-node {
          position: relative;
          z-index: 1;
          display: grid;
          width: var(--orbit-size);
          height: var(--orbit-size);
          place-items: center;
          border: 1px solid rgba(var(--build-rgb), 0.48);
          border-radius: 999px;
          background:
            radial-gradient(circle at 32% 24%, rgba(var(--build-rgb), 0.18), transparent 48%),
            #050b0c;
          color: var(--build-ink);
          box-shadow:
            0 0 0 7px #020504,
            0 0 30px rgba(var(--build-rgb), 0.12);
          transition:
            border-color 240ms ease,
            box-shadow 240ms ease,
            transform 240ms ease;
        }

        .voice-build-orbit-ring {
          position: absolute;
          inset: 8px;
          border: 1px dashed rgba(var(--build-rgb), 0.28);
          border-radius: inherit;
          transition: transform 500ms ease;
        }

        .voice-build-orbit-node svg {
          position: relative;
          z-index: 1;
          width: 30px;
          height: 30px;
          stroke: currentColor;
        }

        .voice-build-orbit-number {
          position: absolute;
          top: -4px;
          right: -4px;
          display: grid;
          width: 26px;
          height: 26px;
          place-items: center;
          border: 1px solid rgba(var(--build-rgb), 0.5);
          border-radius: 999px;
          background: #07100f;
          color: var(--build-primary);
          font-size: 0.58rem;
          font-weight: 900;
          box-shadow: 0 0 15px rgba(var(--build-rgb), 0.25);
        }

        .voice-build-orbit-copy {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: flex-start;
          margin-top: 2rem;
          text-align: left;
          transition: transform 240ms ease;
        }

        .voice-build-orbit-copy h3 {
          display: flex;
          width: 100%;
          min-height: 3.25rem;
          align-items: flex-start;
        }

        .voice-build-orbit-copy p {
          width: 100%;
          max-width: none;
          hyphens: auto;
          text-align: justify;
          text-align-last: left;
          text-wrap: pretty;
        }

        .voice-build-orbit-label {
          color: var(--build-primary);
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .voice-build-orbit-step h3,
        .voice-build-orbit-step p {
          transition: color 240ms ease;
        }

        .voice-build-orbit-step:is(:hover, :focus) .voice-build-orbit-node {
          border-color: var(--build-primary);
          box-shadow:
            0 0 0 7px #020504,
            0 0 34px rgba(var(--build-rgb), 0.32);
          transform: scale(1.06);
        }

        .voice-build-orbit-step:is(:hover, :focus) .voice-build-orbit-ring {
          transform: rotate(35deg);
        }

        .voice-build-orbit-step:is(:hover, :focus) .voice-build-orbit-copy {
          transform: translateY(-3px);
        }

        .voice-build-orbit-step:is(:hover, :focus) h3 {
          color: var(--build-ink);
        }

        .voice-build-orbit-step:is(:hover, :focus) p {
          color: rgba(var(--build-rgb), 0.76);
        }

        .voice-build-orbit-step:active h3,
        .voice-build-orbit-step:focus-visible h3 {
          animation: voice-build-name-bounce 420ms cubic-bezier(0.22, 0.8, 0.3, 1);
        }

        .voice-build-orbit-step:active .voice-build-orbit-node {
          transform: scale(0.98);
        }

        @keyframes voice-build-name-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          38% {
            transform: translateY(-7px);
          }
          68% {
            transform: translateY(2px);
          }
        }

        @media (min-width: 640px) {
          .voice-build-orbit-list {
            --orbit-size: 96px;
            grid-template-columns: repeat(6, minmax(180px, 1fr));
            min-width: 1120px;
          }

          .voice-build-orbit-list-compact {
            width: min(100%, 920px);
            min-width: 800px;
            grid-template-columns: repeat(4, minmax(180px, 1fr));
          }

          .voice-build-orbit-node svg {
            width: 36px;
            height: 36px;
          }
        }

        .voice-config-section {
          background:
            radial-gradient(circle at 8% 18%, rgba(169, 156, 255, 0.07), transparent 30%),
            radial-gradient(circle at 92% 84%, rgba(53, 251, 224, 0.055), transparent 28%),
            #020403;
        }

        .voice-config-wash {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse at 68% 50%, black, transparent 70%);
        }

        .voice-config-console {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          background: rgba(5, 10, 12, 0.78);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(14px);
        }

        .voice-config-console::before {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #35fbe0, #a99cff 52%, #ffad73, transparent);
          content: "";
          opacity: 0.75;
        }

        .voice-config-console-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.018);
        }

        .voice-config-console-title,
        .voice-config-console-count {
          font-size: 0.67rem;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .voice-config-console-title {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          color: rgba(255, 255, 255, 0.74);
        }

        .voice-config-console-count {
          color: rgba(255, 255, 255, 0.3);
        }

        .voice-config-console-signal {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #35fbe0;
          box-shadow: 0 0 14px rgba(53, 251, 224, 0.68);
        }

        .voice-config-list {
          position: relative;
          display: block;
          grid-template-columns: none;
          gap: 0;
        }

        .voice-config-list::before {
          display: none;
        }

        .voice-config-item,
        .voice-config-item:nth-child(odd),
        .voice-config-item:nth-child(even) {
          position: relative;
          isolation: isolate;
          display: grid;
          grid-template-columns: 2.75rem minmax(0, 1fr);
          align-items: center;
          min-height: 104px;
          margin: 0;
          padding: 1.4rem 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          border-bottom: 0;
          background: transparent;
          text-align: left;
          transform: none;
          outline: none;
          transition:
            background 240ms ease,
            padding 240ms ease,
            transform 240ms ease;
        }

        .voice-config-item:first-child {
          border-top: 0;
        }

        .voice-config-item:last-child {
          border-bottom: 0;
        }

        .voice-config-item::before {
          position: absolute;
          z-index: -1;
          inset: 0;
          display: block;
          background: linear-gradient(90deg, rgba(var(--config-rgb), 0.1), transparent 72%);
          content: "";
          opacity: 0;
          transform: scaleX(0.78);
          transform-origin: left;
          transition:
            opacity 240ms ease,
            transform 240ms ease;
        }

        .voice-config-item:nth-child(odd)::after,
        .voice-config-item:nth-child(even)::after {
          display: none;
        }

        .voice-config-number,
        .voice-config-item:nth-child(odd) .voice-config-number,
        .voice-config-item:nth-child(even) .voice-config-number {
          grid-column: 1;
          grid-row: 1;
          align-self: start;
          padding-top: 0.2rem;
          color: rgba(var(--config-rgb), 0.56);
          font-family: monospace;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .voice-config-content {
          grid-column: 2;
          grid-row: 1;
          display: block;
          min-width: 0;
        }

        .voice-config-label,
        .voice-config-item:nth-child(odd) .voice-config-label,
        .voice-config-item:nth-child(even) .voice-config-label {
          display: block;
          color: rgba(255, 255, 255, 0.86);
          font-size: 1.08rem;
          font-weight: 600;
          line-height: 1.45;
          letter-spacing: -0.015em;
          transition: color 240ms ease;
        }

        .voice-config-meter {
          display: block;
          width: 100%;
          height: 2px;
          margin-top: 1rem;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.07);
        }

        .voice-config-meter > span {
          display: block;
          width: 68%;
          height: 100%;
          background: linear-gradient(90deg, var(--config-color), rgba(var(--config-rgb), 0.15));
          box-shadow: 0 0 12px rgba(var(--config-rgb), 0.35);
          transition: width 320ms ease;
        }

        .voice-config-item:nth-child(2) .voice-config-meter > span { width: 84%; }
        .voice-config-item:nth-child(3) .voice-config-meter > span { width: 74%; }
        .voice-config-item:nth-child(4) .voice-config-meter > span { width: 92%; }
        .voice-config-item:nth-child(5) .voice-config-meter > span { width: 79%; }
        .voice-config-item:nth-child(6) .voice-config-meter > span { width: 87%; }
        .voice-config-item:nth-child(7) .voice-config-meter > span { width: 71%; }
        .voice-config-item:nth-child(8) .voice-config-meter > span { width: 82%; }

        .voice-config-state {
          grid-column: 2;
          grid-row: 2;
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 0.45rem;
          margin-top: 0.8rem;
          color: rgba(var(--config-rgb), 0.62);
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .voice-config-state .voice-config-pulse {
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--config-color);
          box-shadow: 0 0 12px rgba(var(--config-rgb), 0.5);
        }

        .voice-config-item:is(:hover, :focus),
        .voice-config-item:nth-child(odd):is(:hover, :focus),
        .voice-config-item:nth-child(even):is(:hover, :focus) {
          padding-left: 1.6rem;
          background: rgba(var(--config-rgb), 0.025);
          transform: none;
        }

        .voice-config-item:is(:hover, :focus)::before {
          opacity: 1;
          transform: scaleX(1);
        }

        .voice-config-item:is(:hover, :focus) .voice-config-label,
        .voice-config-item:is(:hover, :focus) .voice-config-number {
          color: var(--config-color);
        }

        .voice-config-item:is(:hover, :focus) .voice-config-meter > span {
          width: 100%;
        }

        .voice-config-item:is(:hover, :focus) .voice-config-pulse {
          transform: scale(1.35);
          box-shadow: 0 0 22px rgba(var(--config-rgb), 0.82);
        }

        @media (min-width: 640px) {
          .voice-config-item,
          .voice-config-item:nth-child(odd),
          .voice-config-item:nth-child(even) {
            grid-template-columns: 3rem minmax(0, 1fr) auto;
            min-height: 112px;
            padding: 1.5rem 1.75rem;
          }

          .voice-config-label,
          .voice-config-item:nth-child(odd) .voice-config-label,
          .voice-config-item:nth-child(even) .voice-config-label {
            font-size: 1.22rem;
          }

          .voice-config-state {
            grid-column: 3;
            grid-row: 1;
            margin-top: 0;
            margin-left: 1.5rem;
          }

          .voice-config-item:is(:hover, :focus),
          .voice-config-item:nth-child(odd):is(:hover, :focus),
          .voice-config-item:nth-child(even):is(:hover, :focus) {
            padding-left: 2.1rem;
          }
        }

        .voice-config-list-viewport {
          overflow-x: auto;
          scrollbar-color: rgba(169, 156, 255, 0.28) transparent;
          scrollbar-width: thin;
        }

        .voice-config-list {
          display: grid;
          width: max-content;
          grid-template-columns: none;
          grid-auto-flow: column;
          grid-auto-columns: 220px;
        }

        .voice-config-item,
        .voice-config-item:nth-child(odd),
        .voice-config-item:nth-child(even) {
          display: grid;
          width: 220px;
          min-height: 190px;
          grid-template-columns: minmax(0, 1fr) auto;
          grid-template-rows: auto minmax(0, 1fr);
          align-items: start;
          padding: 1.3rem;
          border-top: 0;
          border-left: 1px solid rgba(255, 255, 255, 0.075);
          scroll-snap-align: start;
        }

        .voice-config-item:first-child {
          border-left: 0;
        }

        .voice-config-number,
        .voice-config-item:nth-child(odd) .voice-config-number,
        .voice-config-item:nth-child(even) .voice-config-number {
          grid-column: 1;
          grid-row: 1;
          align-self: center;
          padding-top: 0;
        }

        .voice-config-state {
          grid-column: 2;
          grid-row: 1;
          align-self: center;
          margin: 0 0 0 0.75rem;
        }

        .voice-config-content {
          grid-column: 1 / -1;
          grid-row: 2;
          display: flex;
          height: 100%;
          flex-direction: column;
          justify-content: flex-end;
          padding-top: 1.25rem;
        }

        .voice-config-label,
        .voice-config-item:nth-child(odd) .voice-config-label,
        .voice-config-item:nth-child(even) .voice-config-label {
          min-height: 4.8rem;
          font-size: 1.08rem;
          line-height: 1.42;
        }

        .voice-config-item:is(:hover, :focus),
        .voice-config-item:nth-child(odd):is(:hover, :focus),
        .voice-config-item:nth-child(even):is(:hover, :focus) {
          padding: 1.3rem;
          transform: translateY(-3px);
        }

        @media (min-width: 1024px) {
          .voice-config-list-viewport {
            overflow: visible;
          }

          .voice-config-list {
            width: 100%;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            grid-template-rows: repeat(2, minmax(0, 1fr));
            grid-auto-flow: row;
            grid-auto-columns: auto;
          }

          .voice-config-item,
          .voice-config-item:nth-child(odd),
          .voice-config-item:nth-child(even) {
            width: auto;
            min-height: 188px;
          }

          .voice-config-item:nth-child(-n + 4) {
            border-top: 0;
          }

          .voice-config-item:nth-child(n + 5) {
            border-top: 1px solid rgba(255, 255, 255, 0.075);
          }

          .voice-config-item:nth-child(4n + 1) {
            border-left: 0;
          }

          .voice-config-label,
          .voice-config-item:nth-child(odd) .voice-config-label,
          .voice-config-item:nth-child(even) .voice-config-label {
            min-height: 5.4rem;
            font-size: 1.12rem;
          }
        }

        .voice-config-wash {
          background:
            radial-gradient(circle at 72% 20%, rgba(169, 156, 255, 0.065), transparent 34%),
            radial-gradient(circle at 88% 78%, rgba(53, 251, 224, 0.045), transparent 30%);
          mask-image: none;
        }

        .voice-config-console {
          border: 0;
          background:
            radial-gradient(circle at 18% 0%, rgba(169, 156, 255, 0.05), transparent 34%),
            rgba(5, 10, 12, 0.58);
          box-shadow: 0 28px 72px rgba(0, 0, 0, 0.22);
        }

        .voice-config-console::before {
          display: none;
        }

        .voice-config-console-header {
          padding-bottom: 0.8rem;
          border-bottom: 0;
          background: transparent;
        }

        .voice-config-list-viewport {
          padding: 0 0.5rem 0.75rem;
        }

        .voice-config-item,
        .voice-config-item:nth-child(odd),
        .voice-config-item:nth-child(even),
        .voice-config-item:nth-child(-n + 4),
        .voice-config-item:nth-child(n + 5),
        .voice-config-item:nth-child(4n + 1) {
          border: 0;
        }

        .voice-config-item::before {
          inset: 0.35rem;
          border-radius: 1rem;
          background: radial-gradient(circle at 20% 35%, rgba(var(--config-rgb), 0.105), transparent 72%);
        }

        .voice-config-meter {
          width: 44px;
          height: 5px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.055);
        }

        .voice-config-meter > span {
          border-radius: inherit;
        }

        @media (min-width: 1024px) {
          .voice-config-list {
            gap: 0.35rem 0.75rem;
          }
        }

        .voice-config-list-viewport {
          overflow-x: auto;
          padding: 0 0 0.75rem;
          background: transparent;
          scrollbar-color: rgba(117, 255, 240, 0.22) transparent;
          scrollbar-width: thin;
        }

        .voice-config-list {
          display: grid;
          width: max-content;
          grid-template-columns: none;
          grid-auto-flow: column;
          grid-auto-columns: 260px;
          gap: 1rem;
        }

        .voice-config-item,
        .voice-config-item:nth-child(odd),
        .voice-config-item:nth-child(even),
        .voice-config-item:nth-child(-n + 4),
        .voice-config-item:nth-child(n + 5),
        .voice-config-item:nth-child(4n + 1) {
          display: grid;
          width: 260px;
          min-height: 132px;
          grid-template-columns: 3.5rem minmax(0, 1fr);
          grid-template-rows: auto;
          align-items: center;
          gap: 1rem;
          margin: 0;
          padding: 1rem 0.75rem;
          border: 0;
          background: transparent;
          text-align: left;
          transform: none;
          scroll-snap-align: start;
        }

        .voice-config-item::before {
          inset: 0;
          border-radius: 1.15rem;
          background: radial-gradient(circle at 18% 50%, rgba(var(--config-rgb), 0.1), transparent 70%);
          opacity: 0;
        }

        .voice-config-number,
        .voice-config-item:nth-child(odd) .voice-config-number,
        .voice-config-item:nth-child(even) .voice-config-number {
          grid-column: 1;
          grid-row: 1;
          display: grid;
          width: 3rem;
          height: 3rem;
          place-items: center;
          align-self: center;
          padding: 0;
          border: 1px solid rgba(var(--config-rgb), 0.28);
          border-radius: 999px;
          background: rgba(var(--config-rgb), 0.07);
          color: var(--config-color);
          box-shadow: 0 0 22px rgba(var(--config-rgb), 0.08);
          transition:
            box-shadow 240ms ease,
            transform 240ms ease;
        }

        .voice-config-content {
          grid-column: 2;
          grid-row: 1;
          display: block;
          height: auto;
          padding: 0;
        }

        .voice-config-label,
        .voice-config-item:nth-child(odd) .voice-config-label,
        .voice-config-item:nth-child(even) .voice-config-label {
          min-height: 0;
          color: rgba(255, 255, 255, 0.88);
          font-size: 1.08rem;
          font-weight: 600;
          line-height: 1.42;
        }

        .voice-config-state {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin: 0.75rem 0 0;
          color: rgba(var(--config-rgb), 0.58);
          font-size: 0.6rem;
        }

        .voice-config-item:is(:hover, :focus),
        .voice-config-item:nth-child(odd):is(:hover, :focus),
        .voice-config-item:nth-child(even):is(:hover, :focus) {
          padding: 1rem 0.75rem;
          background: transparent;
          transform: translateY(-4px);
        }

        .voice-config-item:is(:hover, :focus) .voice-config-number {
          box-shadow: 0 0 28px rgba(var(--config-rgb), 0.3);
          transform: scale(1.08);
        }

        @media (min-width: 768px) {
          .voice-config-list-viewport {
            overflow: visible;
          }

          .voice-config-list {
            width: 100%;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-auto-flow: row;
            grid-auto-columns: auto;
            gap: 1.25rem 2rem;
          }

          .voice-config-item,
          .voice-config-item:nth-child(odd),
          .voice-config-item:nth-child(even) {
            width: auto;
          }
        }

        @media (min-width: 1024px) {
          .voice-config-list {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            grid-template-rows: repeat(2, minmax(0, 1fr));
            gap: 1.5rem 2rem;
          }

          .voice-config-label,
          .voice-config-item:nth-child(odd) .voice-config-label,
          .voice-config-item:nth-child(even) .voice-config-label {
            font-size: 1.12rem;
          }
        }

        .service-pill,
        .service-check,
        .service-status,
        .service-float-chip {
          border: 1px solid rgba(var(--service-accent-rgb), 0.24);
          background: rgba(var(--service-accent-rgb), 0.08);
          color: var(--service-accent-soft);
        }

        .service-live-dot,
        .service-integration-dot {
          background: var(--service-accent);
          box-shadow: 0 0 10px rgba(var(--service-accent-rgb), 0.42);
        }

        .service-primary-button,
        .service-solid {
          background: var(--service-accent);
          color: #07100d;
        }

        .service-primary-button {
          box-shadow: 0 12px 32px rgba(var(--service-accent-rgb), 0.12);
        }

        .service-primary-button:hover {
          background: var(--service-accent-soft);
          box-shadow: 0 15px 38px rgba(var(--service-accent-rgb), 0.18);
        }

        .service-secondary-button:hover {
          border-color: rgba(var(--service-accent-rgb), 0.42);
          background: rgba(var(--service-accent-rgb), 0.07);
        }

        .service-ambient-one {
          background: rgba(var(--service-accent-rgb), 0.065);
        }

        .service-ambient-two {
          background: rgba(var(--service-secondary-rgb), 0.07);
        }

        .product-service-visual {
          isolation: isolate;
          perspective: 1200px;
        }

        .product-orbit {
          pointer-events: none;
          border: 1px dashed rgba(var(--service-accent-rgb), 0.12);
          animation: service-orbit 38s linear infinite;
        }

        .product-orbit::after {
          content: "";
          position: absolute;
          left: 50%;
          top: -4px;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--service-accent);
          box-shadow: 0 0 12px rgba(var(--service-accent-rgb), 0.48);
        }

        .product-orbit-two {
          border-color: rgba(var(--service-secondary-rgb), 0.11);
          animation-direction: reverse;
          animation-duration: 29s;
        }

        .product-orbit-two::after {
          background: var(--service-secondary);
          box-shadow: 0 0 12px rgba(var(--service-secondary-rgb), 0.42);
        }

        .service-float-chip {
          background: rgba(5, 8, 7, 0.88);
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.38);
          backdrop-filter: blur(12px);
        }

        .product-service-console {
          transition: transform 500ms ease, border-color 500ms ease;
        }

        .product-service-visual:hover .product-service-console {
          border-color: rgba(var(--service-accent-rgb), 0.28);
          transform: translateY(-2px);
        }

        .product-service-console::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(110deg, transparent 20%, rgba(var(--service-accent-rgb), 0.035) 44%, transparent 66%),
            radial-gradient(circle at 80% 0%, rgba(var(--service-secondary-rgb), 0.13), transparent 38%);
        }

        .service-mark {
          border: 1px solid rgba(var(--service-accent-rgb), 0.24);
          background: linear-gradient(135deg, rgba(var(--service-accent-rgb), 0.18), rgba(var(--service-secondary-rgb), 0.12));
          color: var(--service-accent-soft);
        }

        .service-waveform-bar {
          background: linear-gradient(180deg, var(--service-accent-soft), var(--service-secondary));
          transform-origin: center;
          animation: service-wave 1.15s ease-in-out infinite alternate;
        }

        .service-response {
          border: 1px solid rgba(var(--service-secondary-rgb), 0.23);
          background: linear-gradient(135deg, rgba(var(--service-secondary-rgb), 0.11), rgba(var(--service-accent-rgb), 0.035));
        }

        .service-event {
          border: 1px solid rgba(var(--service-accent-rgb), 0.22);
          background: rgba(var(--service-accent-rgb), 0.06);
        }

        .product-service-capability:hover {
          border-color: rgba(var(--service-accent-rgb), 0.28);
          box-shadow: 0 22px 55px rgba(var(--service-accent-rgb), 0.055);
        }

        .service-card-line {
          background-image: linear-gradient(to right, transparent, rgba(var(--service-accent-rgb), 0.72), transparent);
        }

        .service-capability-mark {
          border: 1px solid rgba(var(--service-accent-rgb), 0.18);
          background: rgba(var(--service-accent-rgb), 0.075);
          color: var(--service-accent-soft);
        }

        .product-service-capability:nth-child(2) .service-card-line {
          background-image: linear-gradient(to right, transparent, rgba(var(--service-secondary-rgb), 0.72), transparent);
        }

        .product-service-capability:nth-child(2) .service-accent-text,
        .product-service-capability:nth-child(2) .service-capability-mark {
          color: var(--service-secondary);
        }

        .product-service-capability:nth-child(2) .service-capability-mark {
          border-color: rgba(var(--service-secondary-rgb), 0.18);
          background: rgba(var(--service-secondary-rgb), 0.07);
        }

        .product-service-capability:nth-child(3) .service-card-line {
          background-image: linear-gradient(to right, transparent, rgba(var(--service-tertiary-rgb), 0.72), transparent);
        }

        .product-service-capability:nth-child(3) .service-accent-text,
        .product-service-capability:nth-child(3) .service-capability-mark {
          color: var(--service-tertiary);
        }

        .product-service-capability:nth-child(3) .service-capability-mark {
          border-color: rgba(var(--service-tertiary-rgb), 0.18);
          background: rgba(var(--service-tertiary-rgb), 0.07);
        }

        .service-workflow-step:hover {
          border-color: rgba(var(--service-secondary-rgb), 0.34);
          background: #000;
          transform: translateX(4px);
        }

        .service-step-number {
          border: 1px solid rgba(var(--service-secondary-rgb), 0.25);
          background: rgba(var(--service-secondary-rgb), 0.10);
          color: var(--service-secondary);
        }

        .service-workflow-step:hover .service-step-number {
          background: var(--service-secondary);
          color: #080b0a;
          box-shadow: 0 10px 30px rgba(var(--service-secondary-rgb), 0.16);
        }

        .service-use-case {
          background: #000;
        }

        .service-use-case:hover {
          border-color: rgba(var(--service-accent-rgb), 0.24);
        }

        .service-use-case:nth-child(2) .service-capability-mark,
        .service-use-case:nth-child(2) .service-accent-text {
          color: var(--service-secondary);
        }

        .service-use-case:nth-child(2) .service-use-case-orb {
          border-color: rgba(var(--service-secondary-rgb), 0.12);
          background: radial-gradient(circle at 35% 35%, rgba(var(--service-secondary-rgb), 0.15), transparent 68%);
        }

        .service-use-case:nth-child(3) .service-capability-mark,
        .service-use-case:nth-child(3) .service-accent-text {
          color: var(--service-tertiary);
        }

        .service-use-case:nth-child(3) .service-use-case-orb {
          border-color: rgba(var(--service-tertiary-rgb), 0.12);
          background: radial-gradient(circle at 35% 35%, rgba(var(--service-tertiary-rgb), 0.15), transparent 68%);
        }

        .service-use-case-orb {
          border: 1px solid rgba(var(--service-accent-rgb), 0.12);
          background: radial-gradient(circle at 35% 35%, rgba(var(--service-accent-rgb), 0.18), transparent 68%);
          box-shadow: inset 0 0 30px rgba(var(--service-secondary-rgb), 0.05);
        }

        .service-integration-card:hover {
          border-color: rgba(var(--service-accent-rgb), 0.32);
          background: rgba(var(--service-accent-rgb), 0.04);
          transform: translateY(-2px);
        }

        .service-integration-card:nth-child(3n + 2) .service-integration-dot {
          background: var(--service-secondary);
          box-shadow: none;
        }

        .service-integration-card:nth-child(3n) .service-integration-dot {
          background: var(--service-tertiary);
          box-shadow: none;
        }

        .service-proof-item:nth-child(2) .service-accent-text {
          color: var(--service-secondary);
        }

        .service-proof-item:nth-child(3) .service-accent-text {
          color: var(--service-tertiary);
        }

        .service-faq[open] {
          border-color: rgba(var(--service-accent-rgb), 0.27);
          background: rgba(var(--service-accent-rgb), 0.028);
        }

        .product-service-cta {
          border: 1px solid rgba(var(--service-accent-rgb), 0.28);
          background: #000;
        }

        .product-cta-rings {
          border: 1px solid rgba(var(--service-accent-rgb), 0.12);
          box-shadow:
            0 0 0 24px rgba(var(--service-accent-rgb), 0.025),
            0 0 0 54px rgba(var(--service-secondary-rgb), 0.025);
        }

        .voice-agent-page {
          background: #000;
          overflow-x: clip;
        }

        .voice-agent-page > section {
          width: 100%;
          padding-right: clamp(1rem, 2.5vw, 2rem);
          padding-left: clamp(1rem, 2.5vw, 2rem);
        }

        .voice-agent-page .voice-agent-container {
          width: 100%;
          max-width: 82.5rem;
          min-width: 0;
        }

        .voice-agent-page .voice-agent-container > * {
          min-width: 0;
        }

        .voice-agent-page h1,
        .voice-agent-page h2 {
          text-wrap: balance;
        }

        .voice-agent-page > section:not(.product-service-hero) {
          padding-top: 2.5rem;
          padding-bottom: 2.5rem;
          border-color: transparent;
          background: #000;
        }

        .voice-agent-page .product-service-hero {
          padding-top: 6.5rem;
        }

        .voice-agent-page .agent-anatomy-section,
        .voice-agent-page .voice-build-process,
        .voice-agent-page .voice-config-section {
          background: #000;
        }

        .voice-agent-page .voice-build-process::before,
        .voice-agent-page .voice-config-wash {
          display: none;
        }

        .voice-agent-page .agent-anatomy-layer {
          min-height: 0;
          padding-top: 1.75rem;
          padding-bottom: 1.75rem;
        }

        .voice-agent-page .agent-anatomy-intro,
        .voice-agent-page .agent-layer-body {
          hyphens: auto;
          text-align: justify;
          text-align-last: left;
          text-wrap: pretty;
        }

        .voice-agent-page .voice-section-copy {
          color: #94a3b8;
          font-size: 0.925rem;
          font-weight: 400;
          line-height: 1.65rem;
        }

        .voice-agent-page .voice-config-section .voice-section-copy {
          font-size: 0.975rem;
          line-height: 1.72rem;
        }

        .voice-agent-page .voice-agents-hero-heading {
          font-size: clamp(2.55rem, 5.3vw, 4.6rem);
          line-height: 0.98;
        }

        .voice-agent-page .voice-agents-hero-heading > span {
          white-space: nowrap;
        }

        .voice-agent-page > section:not(.product-service-hero):not(.voice-agent-contact-section) h2 {
          font-size: clamp(1.75rem, 3.6vw, 2.7rem);
        }

        .voice-agent-page > section.voice-config-section h2.voice-config-heading {
          max-width: none;
          font-size: clamp(1rem, 3.6vw, 2.7rem);
          white-space: nowrap;
        }

        .voice-agent-page > section.voice-config-section h2.team-workflow-config-heading {
          max-width: 46rem;
          margin-inline: auto;
          font-size: clamp(1.55rem, 3vw, 2.25rem);
          white-space: normal;
        }

        .voice-agent-page .voice-config-intro-grid {
          display: grid;
          gap: 1.5rem;
        }

        .voice-agent-page .voice-config-intro-grid .voice-config-heading {
          max-width: 38rem;
          white-space: normal;
        }

        .voice-agent-page > section.voice-build-process h2.voice-build-heading {
          max-width: none;
          font-size: clamp(0.875rem, 3.2vw, 2.7rem);
          white-space: nowrap;
        }

        .voice-agent-page .agent-anatomy-list {
          gap: 1rem;
          margin-top: 2.25rem;
        }

        .voice-agent-page .agent-anatomy-layer {
          overflow: visible;
          min-height: 0;
          padding: 1.4rem 0;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          transition: transform 240ms ease;
        }

        .voice-agent-page > section:not(.product-service-hero):not(.voice-agent-contact-section) {
          padding-top: 2.25rem;
          padding-bottom: 2.25rem;
        }

        .voice-agent-page .agent-anatomy-layer::before {
          inset: -0.75rem;
          border-radius: 1rem;
          background: radial-gradient(circle at 20% 22%, rgba(var(--layer-rgb), 0.16), transparent 60%);
        }

        .voice-agent-page .agent-layer-label {
          gap: 1rem;
        }

        .voice-agent-page .agent-layer-copy {
          margin-top: 1.5rem;
        }

        .voice-agent-page .agent-anatomy-intro,
        .voice-agent-page .agent-layer-body,
        .voice-agent-page .voice-build-orbit-copy p,
        .voice-agent-page .voice-section-copy {
          hyphens: none;
          text-align: left;
          text-align-last: auto;
          text-wrap: pretty;
        }

        .voice-agent-page .agent-layer-body,
        .voice-agent-page .voice-build-orbit-copy p {
          font-size: 0.925rem;
          line-height: 1.65rem;
        }

        .voice-agent-page .agent-layer-number,
        .voice-agent-page .voice-build-orbit-label {
          font-size: 0.72rem;
        }

        .voice-agent-page .voice-build-orbit-number {
          width: 28px;
          height: 28px;
          font-size: 0.65rem;
        }

        .voice-agent-page .voice-build-orbit-viewport {
          margin-top: 2.75rem;
          overscroll-behavior-inline: contain;
          scroll-padding-inline: 1rem;
          scroll-snap-type: x proximity;
          touch-action: pan-x;
        }

        .voice-agent-page .voice-build-orbit-step {
          scroll-snap-align: start;
        }

        .voice-agent-page .voice-config-list-viewport {
          margin-top: 2.5rem;
        }

        .voice-agent-page .voice-config-list {
          scroll-snap-type: x proximity;
        }

        .voice-agent-page .voice-config-item,
        .voice-agent-page .voice-config-item:nth-child(odd),
        .voice-agent-page .voice-config-item:nth-child(even) {
          min-height: 118px;
          padding: 1rem;
          border: 1px solid rgba(var(--config-rgb), 0.14);
          border-radius: 1rem;
          background:
            radial-gradient(circle at 8% 8%, rgba(var(--config-rgb), 0.09), transparent 52%),
            rgba(4, 10, 11, 0.7);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025);
          scroll-snap-align: start;
          transition:
            border-color 220ms ease,
            box-shadow 220ms ease,
            transform 220ms ease;
        }

        .voice-agent-page .voice-config-item:nth-child(1),
        .voice-agent-page .voice-config-item:nth-child(2) {
          --config-color: #35fbe0;
          --config-rgb: 53, 251, 224;
        }

        .voice-agent-page .voice-config-item:nth-child(3),
        .voice-agent-page .voice-config-item:nth-child(4) {
          --config-color: #75baff;
          --config-rgb: 117, 186, 255;
        }

        .voice-agent-page .voice-config-item:nth-child(5),
        .voice-agent-page .voice-config-item:nth-child(6) {
          --config-color: #a99cff;
          --config-rgb: 169, 156, 255;
        }

        .voice-agent-page .voice-config-item:nth-child(7),
        .voice-agent-page .voice-config-item:nth-child(8) {
          --config-color: #ffad73;
          --config-rgb: 255, 173, 115;
        }

        .voice-agent-page .voice-config-item::before {
          inset: 0;
          border-radius: inherit;
        }

        .voice-agent-page .voice-config-item:is(:hover, :focus) {
          padding: 1rem;
          border-color: rgba(var(--config-rgb), 0.36);
          background:
            radial-gradient(circle at 8% 8%, rgba(var(--config-rgb), 0.14), transparent 55%),
            rgba(4, 10, 11, 0.88);
          box-shadow: 0 18px 46px rgba(var(--config-rgb), 0.07);
          transform: translateY(-3px);
        }

        .voice-agent-page .voice-config-label,
        .voice-agent-page .voice-config-item:nth-child(odd) .voice-config-label,
        .voice-agent-page .voice-config-item:nth-child(even) .voice-config-label {
          font-size: 0.95rem;
        }

        .voice-agent-page .voice-faq-section {
          position: relative;
          background:
            radial-gradient(circle at 50% 0%, rgba(53, 251, 224, 0.055), transparent 34%),
            #000;
        }

        .voice-agent-page .service-faq {
          transition:
            border-color 220ms ease,
            background-color 220ms ease,
            transform 220ms ease;
        }

        .voice-agent-page .service-faq:hover {
          border-color: rgba(53, 251, 224, 0.2);
          background: rgba(53, 251, 224, 0.018);
          transform: translateY(-1px);
        }

        .voice-agent-page :is(
          a,
          summary,
          .agent-anatomy-layer,
          .voice-build-orbit-step,
          .voice-config-item
        ):focus-visible {
          outline: 2px solid rgba(117, 255, 240, 0.92);
          outline-offset: 4px;
        }

        @media (max-width: 639px) {
          .voice-agent-page > section:not(.product-service-hero) {
            padding-top: 2.25rem;
            padding-bottom: 2.25rem;
          }

          .voice-agent-page > section.voice-build-process h2.voice-build-heading,
          .voice-agent-page > section.voice-config-section h2.voice-config-heading {
            font-size: clamp(1.7rem, 8vw, 2.2rem);
            white-space: normal;
          }

          .voice-agent-page .voice-build-orbit-viewport {
            padding-right: 1.5rem;
            mask-image: linear-gradient(to right, black 0%, black 88%, transparent 100%);
          }

          .voice-agent-page .voice-config-list-viewport {
            padding-right: 1.5rem;
            mask-image: linear-gradient(to right, black 0%, black 88%, transparent 100%);
          }
        }

        @media (min-width: 640px) {
          .voice-agent-page .product-service-hero {
            padding-top: 7rem;
          }

          .voice-agent-page .voice-section-copy {
            font-size: 1.025rem;
            line-height: 1.8rem;
          }

          .voice-agent-page .voice-config-section .voice-section-copy {
            font-size: 1.075rem;
            line-height: 1.85rem;
          }

          .voice-agent-page .agent-layer-body,
          .voice-agent-page .voice-build-orbit-copy p {
            font-size: 1rem;
            line-height: 1.75rem;
          }

          .voice-agent-page .voice-config-label,
          .voice-agent-page .voice-config-item:nth-child(odd) .voice-config-label,
          .voice-agent-page .voice-config-item:nth-child(even) .voice-config-label {
            font-size: 1rem;
          }
        }

        @media (min-width: 1024px) {
          .voice-agent-page .product-service-hero {
            padding-top: 7.5rem;
          }

          .voice-agent-page .voice-agent-hero-container {
            grid-template-columns: minmax(0, 0.9fr) minmax(540px, 1.1fr);
            gap: 3rem;
          }

          .voice-agent-page .voice-agent-hero-art {
            justify-self: end;
          }

          .voice-agent-page .voice-config-list {
            grid-auto-flow: column;
            gap: 0.7rem 1.25rem;
          }
        }

        .voice-agent-page .voice-config-stage {
          position: relative;
          isolation: isolate;
          margin-top: 2.75rem;
        }

        .voice-agent-page .voice-config-stage::before {
          content: "";
          position: absolute;
          z-index: -2;
          top: 50%;
          left: 50%;
          width: min(82vw, 760px);
          height: 72%;
          border-radius: 999px;
          background: rgba(53, 251, 224, 0.075);
          filter: blur(90px);
          transform: translate(-50%, -50%);
        }

        .voice-agent-page .voice-config-radar {
          position: absolute;
          z-index: -1;
          top: 50%;
          left: 50%;
          width: min(74vw, 570px);
          aspect-ratio: 1;
          border: 1px solid rgba(117, 255, 240, 0.14);
          border-radius: 50%;
          background:
            linear-gradient(90deg, transparent 49.85%, rgba(117, 255, 240, 0.1) 50%, transparent 50.15%),
            linear-gradient(transparent 49.85%, rgba(117, 255, 240, 0.1) 50%, transparent 50.15%),
            radial-gradient(circle, rgba(53, 251, 224, 0.08) 0 2px, transparent 3px),
            radial-gradient(circle, rgba(169, 156, 255, 0.075), transparent 67%);
          box-shadow:
            inset 0 0 80px rgba(53, 251, 224, 0.035),
            0 0 90px rgba(53, 251, 224, 0.03);
          opacity: 0.9;
          transform: translate(-50%, -50%);
        }

        .voice-agent-page .voice-config-radar::before,
        .voice-agent-page .voice-config-radar::after,
        .voice-agent-page .voice-config-radar > span {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .voice-agent-page .voice-config-radar::before {
          width: 72%;
          height: 72%;
        }

        .voice-agent-page .voice-config-radar::after {
          width: 42%;
          height: 42%;
          border-color: rgba(169, 156, 255, 0.18);
          box-shadow: 0 0 45px rgba(169, 156, 255, 0.08);
        }

        .voice-agent-page .voice-config-radar > span:nth-child(1) {
          width: 8px;
          height: 8px;
          border: 0;
          background: #75fff0;
          box-shadow:
            0 0 18px rgba(117, 255, 240, 0.92),
            0 0 42px rgba(117, 255, 240, 0.45);
        }

        .voice-agent-page .voice-config-radar > span:nth-child(2) {
          width: 57%;
          height: 57%;
          border-color: rgba(117, 186, 255, 0.11);
        }

        .voice-agent-page .voice-config-radar > span:nth-child(3) {
          width: 87%;
          height: 87%;
          border-style: dashed;
          border-color: rgba(169, 156, 255, 0.1);
        }

        .voice-agent-page .voice-config-list-viewport {
          position: relative;
          z-index: 2;
          margin-top: 0;
          margin-inline: -1rem;
          overflow-x: auto;
          padding: 1rem 1rem 2rem;
          mask-image: linear-gradient(to right, transparent, black 1rem, black calc(100% - 2.5rem), transparent);
          overscroll-behavior-inline: contain;
          scroll-padding-inline: 1rem;
          scrollbar-width: thin;
        }

        .voice-agent-page .voice-config-list {
          display: grid;
          width: max-content;
          grid-template-columns: none;
          grid-template-rows: none;
          grid-auto-flow: column;
          grid-auto-columns: minmax(235px, 78vw);
          gap: 0.8rem;
          padding: 0.5rem 0 1rem;
          scroll-snap-type: x proximity;
        }

        .voice-agent-page .voice-config-item,
        .voice-agent-page .voice-config-item:nth-child(odd),
        .voice-agent-page .voice-config-item:nth-child(even),
        .voice-agent-page .voice-config-item:nth-child(-n + 4),
        .voice-agent-page .voice-config-item:nth-child(n + 5),
        .voice-agent-page .voice-config-item:nth-child(4n + 1) {
          position: relative;
          isolation: isolate;
          display: grid;
          width: auto;
          min-height: 145px;
          grid-template-columns: 42px minmax(0, 1fr);
          grid-template-rows: 1fr;
          align-items: start;
          gap: 1rem;
          margin: 0;
          padding: 1.1rem;
          overflow: hidden;
          border: 1px solid rgba(var(--config-rgb), 0.2);
          border-radius: 1.15rem;
          background:
            linear-gradient(145deg, rgba(var(--config-rgb), 0.105), rgba(6, 12, 14, 0.92) 42%),
            rgba(3, 8, 9, 0.92);
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.36),
            inset 0 1px 0 rgba(255, 255, 255, 0.07);
          transform: none;
          backdrop-filter: blur(18px);
          scroll-snap-align: start;
          transition:
            border-color 240ms ease,
            box-shadow 240ms ease,
            transform 240ms ease;
        }

        .voice-agent-page .voice-config-item::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 0;
          border-radius: inherit;
          background:
            radial-gradient(circle at 0 0, rgba(var(--config-rgb), 0.16), transparent 48%),
            linear-gradient(110deg, transparent 42%, rgba(255, 255, 255, 0.035), transparent 58%);
          opacity: 0.72;
          transform: none;
        }

        .voice-agent-page .voice-config-number,
        .voice-agent-page .voice-config-item:nth-child(odd) .voice-config-number,
        .voice-agent-page .voice-config-item:nth-child(even) .voice-config-number {
          grid-column: 1;
          grid-row: 1;
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          align-self: start;
          padding: 0;
          border: 1px solid rgba(var(--config-rgb), 0.28);
          border-radius: 0.8rem;
          background: rgba(var(--config-rgb), 0.1);
          color: var(--config-color);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          box-shadow: 0 0 22px rgba(var(--config-rgb), 0.08);
        }

        .voice-agent-page .voice-config-content {
          grid-column: 2;
          grid-row: 1;
          display: flex;
          min-width: 0;
          height: 100%;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.4rem;
          padding: 0.1rem 0 0;
        }

        .voice-agent-page .voice-config-label,
        .voice-agent-page .voice-config-item:nth-child(odd) .voice-config-label,
        .voice-agent-page .voice-config-item:nth-child(even) .voice-config-label {
          min-height: 0;
          color: rgba(255, 255, 255, 0.91);
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.42;
          text-align: left;
        }

        .voice-agent-page .voice-config-chart {
          display: flex;
          height: 24px;
          align-items: end;
          gap: 4px;
        }

        .voice-agent-page .voice-config-chart > span {
          width: 4px;
          height: 38%;
          border-radius: 999px;
          background: var(--config-color);
          box-shadow: 0 0 10px rgba(var(--config-rgb), 0.3);
          opacity: 0.34;
          transition:
            height 260ms ease,
            opacity 260ms ease;
        }

        .voice-agent-page .voice-config-chart > span:nth-child(2) { height: 68%; }
        .voice-agent-page .voice-config-chart > span:nth-child(3) { height: 100%; }
        .voice-agent-page .voice-config-chart > span:nth-child(4) { height: 54%; }
        .voice-agent-page .voice-config-chart > span:nth-child(5) { height: 82%; }

        .voice-agent-page .voice-config-item:nth-child(even) .voice-config-chart > span:nth-child(1) { height: 72%; }
        .voice-agent-page .voice-config-item:nth-child(even) .voice-config-chart > span:nth-child(2) { height: 44%; }
        .voice-agent-page .voice-config-item:nth-child(even) .voice-config-chart > span:nth-child(4) { height: 88%; }

        .voice-agent-page .voice-config-item:is(:hover, :focus),
        .voice-agent-page .voice-config-item:nth-child(odd):is(:hover, :focus),
        .voice-agent-page .voice-config-item:nth-child(even):is(:hover, :focus) {
          z-index: 8;
          padding: 1.1rem;
          border-color: rgba(var(--config-rgb), 0.52);
          background:
            linear-gradient(145deg, rgba(var(--config-rgb), 0.16), rgba(6, 12, 14, 0.95) 46%),
            rgba(3, 8, 9, 0.96);
          box-shadow:
            0 30px 75px rgba(0, 0, 0, 0.5),
            0 0 38px rgba(var(--config-rgb), 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(-7px) rotate(0deg) scale(1.015);
        }

        .voice-agent-page .voice-config-item:is(:hover, :focus) .voice-config-chart > span {
          opacity: 0.9;
        }

        @media (min-width: 768px) {
          .voice-agent-page .voice-config-stage {
            margin-top: 3.25rem;
          }

          .voice-agent-page .voice-config-list-viewport {
            margin-inline: 0;
            overflow: visible;
            padding: 1.5rem 0 2rem;
            mask-image: none;
          }

          .voice-agent-page .voice-config-list {
            width: 100%;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-rows: none;
            grid-auto-flow: row;
            grid-auto-columns: auto;
            gap: 0.6rem;
          }

          .voice-agent-page .voice-config-item,
          .voice-agent-page .voice-config-item:nth-child(odd),
          .voice-agent-page .voice-config-item:nth-child(even) {
            min-height: 138px;
          }

          .voice-agent-page .voice-config-item:nth-child(4n + 1) {
            transform: translate(8px, 7px) rotate(-0.7deg);
          }

          .voice-agent-page .voice-config-item:nth-child(4n + 2) {
            transform: translate(-8px, -5px) rotate(0.7deg);
          }

          .voice-agent-page .voice-config-item:nth-child(4n + 3) {
            transform: translate(4px, -5px) rotate(0.55deg);
          }

          .voice-agent-page .voice-config-item:nth-child(4n + 4) {
            transform: translate(-4px, 7px) rotate(-0.55deg);
          }

          .voice-agent-page .voice-config-label,
          .voice-agent-page .voice-config-item:nth-child(odd) .voice-config-label,
          .voice-agent-page .voice-config-item:nth-child(even) .voice-config-label {
            font-size: 0.94rem;
          }
        }

        @media (min-width: 1024px) {
          .voice-agent-page .voice-config-list {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            grid-template-rows: repeat(2, minmax(0, 1fr));
            gap: 0;
          }

          .voice-agent-page .voice-config-item,
          .voice-agent-page .voice-config-item:nth-child(odd),
          .voice-agent-page .voice-config-item:nth-child(even) {
            min-height: 150px;
          }

          .voice-agent-page .voice-config-item:nth-child(1) {
            z-index: 2;
            transform: translate(14px, 16px) rotate(-1.5deg);
          }

          .voice-agent-page .voice-config-item:nth-child(2) {
            z-index: 4;
            transform: translate(5px, -3px) rotate(0.8deg);
          }

          .voice-agent-page .voice-config-item:nth-child(3) {
            z-index: 3;
            transform: translate(-5px, 5px) rotate(-0.6deg);
          }

          .voice-agent-page .voice-config-item:nth-child(4) {
            z-index: 2;
            transform: translate(-14px, 18px) rotate(1.4deg);
          }

          .voice-agent-page .voice-config-item:nth-child(5) {
            z-index: 3;
            transform: translate(18px, -12px) rotate(1deg);
          }

          .voice-agent-page .voice-config-item:nth-child(6) {
            z-index: 5;
            transform: translate(7px, 8px) rotate(-0.9deg);
          }

          .voice-agent-page .voice-config-item:nth-child(7) {
            z-index: 4;
            transform: translate(-7px, 2px) rotate(0.7deg);
          }

          .voice-agent-page .voice-config-item:nth-child(8) {
            z-index: 3;
            transform: translate(-18px, -12px) rotate(-1.2deg);
          }

          .voice-agent-page .voice-config-label,
          .voice-agent-page .voice-config-item:nth-child(odd) .voice-config-label,
          .voice-agent-page .voice-config-item:nth-child(even) .voice-config-label {
            font-size: 0.96rem;
          }
        }

        .voice-agent-page .voice-config-list-viewport {
          position: relative;
          z-index: auto;
          margin-top: 2.5rem;
          margin-inline: 0;
          overflow-x: auto;
          padding: 0 0 0.75rem;
          mask-image: none;
          scroll-padding-inline: 0;
        }

        .voice-agent-page .voice-config-list {
          display: grid;
          width: max-content;
          grid-template-columns: none;
          grid-template-rows: none;
          grid-auto-flow: column;
          grid-auto-columns: 260px;
          gap: 1rem;
          padding: 0;
          scroll-snap-type: x proximity;
        }

        .voice-agent-page .voice-config-list .voice-config-item {
          z-index: auto;
          display: grid;
          width: 260px;
          min-height: 118px;
          grid-template-columns: 3.5rem minmax(0, 1fr);
          grid-template-rows: auto;
          align-items: center;
          gap: 1rem;
          margin: 0;
          padding: 1rem;
          overflow: visible;
          border: 1px solid rgba(var(--config-rgb), 0.14);
          border-radius: 1rem;
          background:
            radial-gradient(circle at 8% 8%, rgba(var(--config-rgb), 0.09), transparent 52%),
            rgba(4, 10, 11, 0.7);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025);
          text-align: left;
          transform: none;
          backdrop-filter: none;
          scroll-snap-align: start;
          transition:
            border-color 220ms ease,
            box-shadow 220ms ease,
            transform 220ms ease;
        }

        .voice-agent-page .voice-config-item::before {
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at 18% 50%, rgba(var(--config-rgb), 0.1), transparent 70%);
          opacity: 0;
        }

        .voice-agent-page .voice-config-number,
        .voice-agent-page .voice-config-item:nth-child(odd) .voice-config-number,
        .voice-agent-page .voice-config-item:nth-child(even) .voice-config-number {
          grid-column: 1;
          grid-row: 1;
          display: grid;
          width: 3rem;
          height: 3rem;
          place-items: center;
          align-self: center;
          padding: 0;
          border: 1px solid rgba(var(--config-rgb), 0.28);
          border-radius: 999px;
          background: rgba(var(--config-rgb), 0.07);
          color: var(--config-color);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          box-shadow: 0 0 22px rgba(var(--config-rgb), 0.08);
        }

        .voice-agent-page .voice-config-content {
          grid-column: 2;
          grid-row: 1;
          display: block;
          min-width: 0;
          height: auto;
          padding: 0;
        }

        .voice-agent-page .voice-config-label,
        .voice-agent-page .voice-config-item:nth-child(odd) .voice-config-label,
        .voice-agent-page .voice-config-item:nth-child(even) .voice-config-label {
          min-height: 0;
          color: rgba(255, 255, 255, 0.88);
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.42;
          text-align: left;
        }

        .voice-agent-page .voice-config-list .voice-config-item:is(:hover, :focus) {
          z-index: 2;
          padding: 1rem;
          border-color: rgba(var(--config-rgb), 0.36);
          background:
            radial-gradient(circle at 8% 8%, rgba(var(--config-rgb), 0.14), transparent 55%),
            rgba(4, 10, 11, 0.88);
          box-shadow: 0 18px 46px rgba(var(--config-rgb), 0.07);
          transform: translateY(-3px);
        }

        @media (min-width: 640px) {
          .voice-agent-page .voice-config-label,
          .voice-agent-page .voice-config-item:nth-child(odd) .voice-config-label,
          .voice-agent-page .voice-config-item:nth-child(even) .voice-config-label {
            font-size: 1rem;
          }
        }

        @media (min-width: 768px) {
          .voice-agent-page .voice-config-intro-grid {
            grid-template-columns: minmax(0, 1fr) minmax(320px, 0.82fr);
            align-items: end;
            gap: clamp(2.5rem, 7vw, 7rem);
          }

          .voice-agent-page .voice-config-list-viewport {
            overflow: visible;
          }

          .voice-agent-page .voice-config-list {
            width: 100%;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-rows: none;
            grid-auto-flow: row;
            grid-auto-columns: auto;
            gap: 1.25rem 2rem;
          }

          .voice-agent-page .voice-config-list .voice-config-item {
            width: auto;
          }
        }

        @media (min-width: 1024px) {
          .voice-agent-page .voice-config-list {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            grid-template-rows: repeat(2, minmax(0, 1fr));
            grid-auto-flow: column;
            gap: 0.7rem 1.25rem;
          }
        }

        .voice-agent-page > section.voice-agent-contact-section {
          padding-top: 1rem;
          padding-bottom: 4rem;
        }

        .voice-blueprint-intro .service-pill {
          border-color: rgba(141, 215, 255, 0.28);
          background: rgba(141, 215, 255, 0.1);
          color: #bfe7ff;
        }

        .voice-blueprint-heading {
          font-size: clamp(2.25rem, 4.4vw, 4.6rem);
        }

        .voice-blueprint-copy {
          color: rgba(255, 255, 255, 0.58);
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          line-height: 1.8;
        }

        .voice-blueprint-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(141, 215, 255, 0.16);
          border-radius: 1.5rem;
          background:
            radial-gradient(circle at 8% 10%, rgba(117, 186, 255, 0.12), transparent 33%),
            radial-gradient(circle at 92% 90%, rgba(255, 173, 115, 0.1), transparent 34%),
            #040a0b;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.018), 0 28px 80px rgba(0, 0, 0, 0.22);
        }

        .voice-blueprint-core {
          min-height: 320px;
          border: 1px solid rgba(169, 156, 255, 0.18);
          background: linear-gradient(145deg, rgba(169, 156, 255, 0.12), rgba(117, 186, 255, 0.045));
        }

        .voice-blueprint-list {
          display: grid;
          gap: 0.85rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .voice-blueprint-layer {
          --blueprint-primary: #75baff;
          --blueprint-rgb: 117, 186, 255;
          position: relative;
          display: grid;
          grid-template-columns: 3rem minmax(0, 1fr);
          gap: 1rem;
          padding: 1.35rem;
          border: 1px solid rgba(var(--blueprint-rgb), 0.2);
          border-radius: 1rem;
          background: linear-gradient(135deg, rgba(var(--blueprint-rgb), 0.1), rgba(255, 255, 255, 0.018) 65%);
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }

        .voice-blueprint-layer.agent-layer-knowledge { --blueprint-primary: #a99cff; --blueprint-rgb: 169, 156, 255; }
        .voice-blueprint-layer.agent-layer-actions { --blueprint-primary: #ffad73; --blueprint-rgb: 255, 173, 115; }

        .voice-blueprint-layer:hover,
        .voice-blueprint-layer:focus {
          border-color: rgba(var(--blueprint-rgb), 0.5);
          box-shadow: 0 16px 38px rgba(var(--blueprint-rgb), 0.1);
          outline: none;
          transform: translateX(4px);
        }

        .voice-blueprint-number {
          display: grid;
          width: 3rem;
          height: 3rem;
          place-items: center;
          border: 1px solid rgba(var(--blueprint-rgb), 0.38);
          border-radius: 0.8rem;
          background: rgba(var(--blueprint-rgb), 0.1);
          color: var(--blueprint-primary);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .voice-blueprint-system {
          margin: 0;
          color: var(--blueprint-primary);
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .voice-blueprint-layer h3 {
          margin: 0.35rem 0 0;
          color: #fff;
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .voice-blueprint-title {
          margin: 0.35rem 0 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .voice-blueprint-body {
          grid-column: 1 / -1;
          margin: 0;
          padding-top: 0.95rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.52);
          font-size: 0.9rem;
          line-height: 1.65;
        }

        @media (min-width: 640px) {
          .voice-blueprint-layer {
            grid-template-columns: 3rem minmax(180px, 0.65fr) minmax(0, 1fr);
            align-items: center;
            gap: 1.35rem;
          }

          .voice-blueprint-body {
            grid-column: auto;
            padding-top: 0;
            padding-left: 1.35rem;
            border-top: 0;
            border-left: 1px solid rgba(255, 255, 255, 0.08);
          }
        }

        .voice-build-redesign-heading {
          font-size: clamp(2.25rem, 4.4vw, 4.6rem);
        }

        .voice-build-redesign-intro .service-pill {
          border-color: rgba(169, 156, 255, 0.28);
          background: rgba(169, 156, 255, 0.1);
          color: #d3ccff;
        }

        .voice-build-redesign-copy {
          color: rgba(255, 255, 255, 0.58);
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          line-height: 1.8;
        }

        .voice-build-redesign-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(117, 255, 240, 0.16);
          border-radius: 1.5rem;
          padding: 1.25rem;
          background:
            radial-gradient(circle at 6% 5%, rgba(117, 186, 255, 0.12), transparent 32%),
            radial-gradient(circle at 94% 95%, rgba(255, 173, 115, 0.1), transparent 34%),
            #040a0b;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.018), 0 28px 80px rgba(0, 0, 0, 0.22);
        }

        .voice-build-redesign-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.3;
          background-image: linear-gradient(rgba(117, 186, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(169, 156, 255, 0.07) 1px, transparent 1px);
          background-size: 38px 38px;
          mask-image: radial-gradient(ellipse at center, black, transparent 78%);
        }

        .voice-build-redesign-panel-head,
        .voice-build-redesign-grid {
          position: relative;
          z-index: 1;
        }

        .voice-build-redesign-panel-head {
          padding: 0.25rem 0.25rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.42);
          font-size: 0.67rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .voice-build-redesign-panel-head span:last-child {
          color: #d3ccff;
        }

        .voice-build-redesign-grid {
          display: grid;
          gap: 0.85rem;
          margin: 1rem 0 0;
          padding: 0;
          list-style: none;
        }

        .voice-build-redesign-step {
          --build-primary: #75baff;
          --build-rgb: 117, 186, 255;
          position: relative;
          min-height: 210px;
          overflow: hidden;
          padding: 1.35rem;
          border: 1px solid rgba(var(--build-rgb), 0.18);
          border-radius: 1rem;
          background: linear-gradient(145deg, rgba(var(--build-rgb), 0.1), rgba(255, 255, 255, 0.018) 52%);
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }

        .voice-build-redesign-step.voice-build-tone-1 { --build-primary: #75baff; --build-rgb: 117, 186, 255; }
        .voice-build-redesign-step.voice-build-tone-2 { --build-primary: #a99cff; --build-rgb: 169, 156, 255; }
        .voice-build-redesign-step.voice-build-tone-3 { --build-primary: #f58bd6; --build-rgb: 245, 139, 214; }
        .voice-build-redesign-step.voice-build-tone-4 { --build-primary: #ffad73; --build-rgb: 255, 173, 115; }
        .voice-build-redesign-step.voice-build-tone-5 { --build-primary: #8dd7ff; --build-rgb: 141, 215, 255; }
        .voice-build-redesign-step.voice-build-tone-6 { --build-primary: #d3ccff; --build-rgb: 211, 204, 255; }

        .voice-build-redesign-step::before {
          content: "";
          position: absolute;
          top: 0;
          right: 1.25rem;
          left: 1.25rem;
          height: 2px;
          border-radius: 999px;
          background: var(--build-primary);
          opacity: 0.78;
        }

        .voice-build-redesign-step:hover {
          border-color: rgba(var(--build-rgb), 0.48);
          box-shadow: 0 18px 44px rgba(var(--build-rgb), 0.1);
          transform: translateY(-4px);
        }

        .voice-build-redesign-step-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--build-primary);
        }

        .voice-build-redesign-step-top svg {
          width: 2rem;
          height: 2rem;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.7;
        }

        .voice-build-redesign-number {
          display: grid;
          width: 2.3rem;
          height: 2.3rem;
          place-items: center;
          border: 1px solid rgba(var(--build-rgb), 0.38);
          border-radius: 0.7rem;
          background: rgba(var(--build-rgb), 0.1);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.68rem;
          font-weight: 800;
        }

        .voice-build-redesign-label {
          display: block;
          margin-top: 2rem;
          color: var(--build-primary);
          font-size: 0.64rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .voice-build-redesign-step h3 {
          margin: 0.55rem 0 0;
          color: #fff;
          font-size: 1.25rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.025em;
        }

        .voice-build-redesign-step p {
          margin: 0.75rem 0 0;
          color: rgba(255, 255, 255, 0.54);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        @media (min-width: 640px) {
          .voice-build-redesign-panel {
            padding: 1.75rem;
          }

          .voice-build-redesign-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1rem;
          }
        }

        @media (min-width: 1024px) {
          .voice-build-redesign-panel {
            padding: 2.25rem;
          }

          .voice-build-redesign-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1.15rem;
          }
        }

        @keyframes service-orbit {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes service-wave {
          from { transform: scaleY(0.58); opacity: 0.55; }
          to { transform: scaleY(1); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-service-page *,
          .product-service-page *::before,
          .product-service-page *::after {
            animation: none !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </SiteLayout>
  );
}