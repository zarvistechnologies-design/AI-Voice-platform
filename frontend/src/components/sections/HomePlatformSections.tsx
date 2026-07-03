"use client";

import { useState } from "react";
import Image from "next/image";
import { IndianLanguageVoiceSection } from "./IndianLanguageVoiceSection";

const agentUseCases = [
  "Lead Qualification Calls",
  "AI Receptionist",
  "Appointment Booking",
  "Inbound Support",
  "Outbound Follow-ups",
  "Call Summaries",
  "Sentiment Detection",
  "CRM Updates",
  "Dispatch Routing",
  "Payment Reminders",
  "Patient Intake",
  "Sales Handoffs",
];

const platformCards = [
  {
    title: "Orchestrate voice workflows from one workspace",
    body: "Turn every call into a structured workflow with transcripts, summaries, intent, routing, and follow-up actions.",
    large: true,
  },
  {
    title: "Blend AI agents with human handoffs",
    body: "Let agents handle routine conversations 24/7 while escalating sensitive or high-value calls with full context.",
  },
  {
    title: "Personalize every call with customer context",
    body: "Use caller history, funnel stage, and intent signals so each voice conversation feels relevant and useful.",
  },
  {
    title: "Convert more leads with automated callbacks",
    body: "Trigger follow-ups, reminders, booking flows, and sales notifications based on conversation outcomes.",
  },
  {
    title: "Turn voice conversations into insights",
    body: "Capture topics, objections, action items, and sentiment so teams learn from every customer call.",
  },
  {
    title: "Connect calls to the tools your team uses",
    body: "Send summaries and next steps into CRM, helpdesk, calendar, notification, and analytics workflows.",
  },
];

const cardStyles = [
  "bg-[linear-gradient(135deg,#00FFFF,#d9f99d)]",
  "bg-[linear-gradient(135deg,#fef3c7,#fed7aa)]",
  "bg-[linear-gradient(135deg,#dbeafe,#c7d2fe)]",
  "bg-[linear-gradient(135deg,#fce7f3,#e9d5ff)]",
  "bg-[linear-gradient(135deg,#dcfce7,#ccfbf1)]",
  "bg-[linear-gradient(135deg,#fee2e2,#cffafe)]",
];

const roleCards = [
  {
    title: "Sales Teams",
    body: "Qualify inbound leads, book meetings, and send clear call notes to your CRM without manual follow-up.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Support Teams",
    body: "Resolve repetitive calls, detect urgency, and hand off complex issues with transcripts and summaries.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Operations",
    body: "Route dispatch, booking, reminders, and status calls into the right workflow as soon as customers speak.",
    image:
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Customer Experience",
    body: "Keep every caller heard with natural responses, multilingual support, and consistent escalation rules.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
  },
];

const resources = [
  {
    title: "From Call Scripts to AI Voice Agents",
    body: "Explore how voice agents transform real customer calls into useful actions and insights.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "How AI Agents Improve Support Operations",
    body: "Discover how AI voice agents reduce missed calls, speed up triage, and improve team efficiency.",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "What Makes a Voice Agent Feel Natural?",
    body: "Learn the patterns behind helpful voice workflows, clean handoffs, and better customer experiences.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
  },
];

const voiceAgentUseCases = [
  {
    title: "Buyer Requirement",
    subtitle: "Gathering",
    recording: "Buyer requirement call",
    duration: "01:24",
    icon: "users",
    accent: "cyan",
    position: "left-[8%] top-[12%]",
  },
  {
    title: "Customer Support",
    subtitle: "Support",
    recording: "Customer support call",
    duration: "02:08",
    icon: "headset",
    accent: "emerald",
    position: "left-[4%] top-[36%]",
  },
  {
    title: "Lead Qualification",
    subtitle: "Qualification",
    recording: "Lead qualification call",
    duration: "01:46",
    icon: "funnel",
    accent: "orange",
    position: "left-[6%] top-[60%]",
  },
  {
    title: "Appointment Booking",
    subtitle: "Booking",
    recording: "Appointment booking call",
    duration: "01:32",
    icon: "calendar",
    accent: "cyan",
    position: "left-[24%] top-[76%]",
  },
  {
    title: "Insurance Renewal",
    subtitle: "Renewal",
    recording: "Insurance renewal call",
    duration: "01:37",
    icon: "shield",
    accent: "lime",
    position: "right-[8%] top-[12%]",
  },
  {
    title: "Demat Account Opening",
    subtitle: "Opening",
    recording: "Demat account opening call",
    duration: "02:14",
    icon: "file",
    accent: "orange",
    position: "right-[4%] top-[36%]",
  },
  {
    title: "Loan Qualification",
    subtitle: "Qualification",
    recording: "Loan qualification call",
    duration: "01:58",
    icon: "file-check",
    accent: "emerald",
    position: "right-[6%] top-[60%]",
  },
  {
    title: "Delivery Rider Hiring",
    subtitle: "Hiring",
    recording: "Delivery rider hiring call",
    duration: "01:41",
    icon: "scooter",
    accent: "cyan",
    position: "right-[21%] top-[76%]",
  },
];

const useCaseAccentStyles = {
  cyan: {
    icon: "bg-cyan-100 text-cyan-700",
    dot: "bg-cyan-500 shadow-[0_0_0_6px_rgba(0,184,196,0.12)]",
    active: "border-cyan-200 bg-cyan-50/70 shadow-[0_12px_28px_rgba(0,184,196,0.12)]",
  },
  emerald: {
    icon: "bg-teal-100 text-teal-700",
    dot: "bg-teal-500 shadow-[0_0_0_6px_rgba(20,184,166,0.12)]",
    active: "border-teal-200 bg-teal-50/70 shadow-[0_12px_28px_rgba(20,184,166,0.12)]",
  },
  orange: {
    icon: "bg-orange-100 text-orange-600",
    dot: "bg-orange-500 shadow-[0_0_0_6px_rgba(249,115,22,0.12)]",
    active: "border-orange-200 bg-orange-50/70 shadow-[0_12px_28px_rgba(249,115,22,0.12)]",
  },
  lime: {
    icon: "bg-lime-100 text-lime-700",
    dot: "bg-lime-500 shadow-[0_0_0_6px_rgba(132,204,22,0.12)]",
    active: "border-lime-200 bg-lime-50/70 shadow-[0_12px_28px_rgba(132,204,22,0.12)]",
  },
};

function AgentUseCaseIcon({ name }: { name: string }) {
  const common = {
    className: "size-6",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  if (name === "headset") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M4 13a8 8 0 0 1 16 0" />
        <path d="M5 13h3v6H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2Z" />
        <path d="M19 13h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2Z" />
        <path d="M16 19c-.7 1.2-2 2-4 2h-1" />
      </svg>
    );
  }

  if (name === "funnel") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M4 5h16l-6.5 7.2V19l-3 1.5v-8.3L4 5Z" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M4.5 8.5h15" />
        <rect x="4" y="5" width="16" height="16" rx="2.5" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    );
  }

  if (name === "id") {
    return (
      <svg aria-hidden="true" {...common}>
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M9 8h6" />
        <circle cx="12" cy="12.5" r="2" />
        <path d="M8.5 18a3.5 3.5 0 0 1 7 0" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M12 3.5 19 6v5.5c0 4.1-2.7 7.8-7 9.5-4.3-1.7-7-5.4-7-9.5V6l7-2.5Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  if (name === "file") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M7 3.5h7l3 3V20.5H7z" />
        <path d="M14 3.5v4h4" />
        <path d="M10 12h5" />
        <path d="M10 16h5" />
      </svg>
    );
  }

  if (name === "file-check") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M6.5 3.5h7l3 3V13" />
        <path d="M13.5 3.5v4h4" />
        <path d="M6.5 3.5v17h6" />
        <path d="m15.5 18.2 1.6 1.6 3.4-3.6" />
        <circle cx="18" cy="18" r="4" />
        <path d="M9.5 11.5h4" />
        <path d="M9.5 15h2" />
      </svg>
    );
  }

  if (name === "scooter") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M6 17.5h7.5L16 9h-3" />
        <path d="M16 9h2.5a2 2 0 0 1 2 2v2.5" />
        <path d="M10 7h4" />
        <path d="M11 7v3" />
        <circle cx="6" cy="18" r="2.2" />
        <circle cx="18" cy="18" r="2.2" />
      </svg>
    );
  }

  if (name === "briefcase") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
        <rect x="4" y="7" width="16" height="13" rx="2" />
        <path d="M4 12h16" />
        <path d="M10 12v2h4v-2" />
      </svg>
    );
  }

  if (name === "truck") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M4 6h10v10H4z" />
        <path d="M14 10h3l3 3v3h-6" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
        <path d="M9 18h6" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" {...common}>
      <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M3.5 20a4.5 4.5 0 0 1 9 0" />
      <path d="M11.5 20a4.5 4.5 0 0 1 9 0" />
    </svg>
  );
}

function CentralVoiceOrb({ isListening }: { isListening: boolean }) {
  return (
    <div className="relative grid size-[260px] place-items-center sm:size-[280px]">
      <div className="absolute size-[254px] rounded-full border border-cyan-100 sm:size-[274px]" />
      <div className="absolute size-[204px] rounded-full border border-cyan-100 sm:size-[224px]" />
      <div className="absolute size-[158px] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.98),rgba(247,254,255,0.94))] shadow-[inset_0_0_34px_rgba(0,184,196,0.08)] sm:size-[170px]" />
      <div className="voice-agent-spectrum absolute top-[46px] h-[66px] w-[166px] sm:top-[50px]" aria-hidden="true">
        {Array.from({ length: 25 }, (_, index) => {
          const distance = Math.abs(index - 12);
          const height = 8 + Math.max(0, 42 - distance * 4) + ((index * 7) % 10);
          return (
            <span
              className="voice-spectrum-dot absolute rounded-full bg-cyan-500"
              key={index}
              style={{
                left: `${index * 6.4}px`,
                top: `${33 - height / 2}px`,
                height: `${height}px`,
                animationDelay: `${index * 35}ms`,
              }}
            />
          );
        })}
      </div>
      <div className="relative z-10 grid size-[112px] place-items-center rounded-full bg-white text-cyan-700 sm:size-[124px]">
        <svg
          aria-hidden="true"
          className="size-24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          viewBox="0 0 24 24"
        >
          <path d="M12 4a2.8 2.8 0 0 0-2.8 2.8V12a2.8 2.8 0 0 0 5.6 0V6.8A2.8 2.8 0 0 0 12 4Z" />
          <path d="M6.2 10.5V12a5.8 5.8 0 0 0 11.6 0v-1.5" />
          <path d="M12 17.8V21" />
          <path d="M8.8 21h6.4" />
          <path className={isListening ? "voice-agent-fingerprint-line" : ""} d="M10.5 8v5" />
          <path className={isListening ? "voice-agent-fingerprint-line voice-agent-fingerprint-delay" : ""} d="M12 6.8v7.2" />
          <path className={isListening ? "voice-agent-fingerprint-line" : ""} d="M13.5 8v5" />
        </svg>
      </div>
    </div>
  );
}

function HumanLikeAgentsSection() {
  const [selectedRecording, setSelectedRecording] = useState(0);
  const [isListening, setIsListening] = useState(true);

  function selectRecording(index: number) {
    setSelectedRecording(index);
    setIsListening(true);
  }

  function renderRecordingButton(item: (typeof voiceAgentUseCases)[number], index: number, layout: "radial" | "grid" = "grid") {
    const isActive = index === selectedRecording;
    const accent = useCaseAccentStyles[item.accent as keyof typeof useCaseAccentStyles];

    return (
      <button
        className={`group flex items-center gap-3 rounded-2xl border border-cyan-100 bg-white/94 p-3 text-left text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.07)] backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-200 ${isActive ? accent.active : ""} ${layout === "radial" ? `absolute z-20 w-[230px] ${item.position}` : "w-full"}`}
        key={`${item.title}-${item.subtitle}`}
        onClick={() => selectRecording(index)}
        type="button"
      >
        <span className={`grid size-11 shrink-0 place-items-center rounded-full transition ${accent.icon}`}>
          <AgentUseCaseIcon name={item.icon} />
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block text-sm font-black leading-5 text-slate-950">{item.title}</strong>
          <span className="block text-xs leading-5 font-bold text-cyan-700">{item.subtitle}</span>
        </span>
        {layout === "radial" ? null : <span className={`size-2.5 shrink-0 rounded-full ${isActive ? accent.dot : "bg-slate-200"}`} aria-hidden="true" />}
      </button>
    );
  }

  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 text-slate-950 sm:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(0,255,255,0.10),transparent_31%),linear-gradient(180deg,#ffffff_0%,#f7ffff_54%,#ffffff_100%)]" />
      <div className="relative mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-3 rounded-full border border-cyan-100 bg-white px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-cyan-700 shadow-sm">
            <span className="flex h-4 items-center gap-1 text-cyan-500" aria-hidden="true">
              {[8, 14, 20, 12].map((height, index) => (
                <span className="w-1 rounded-full bg-current" key={index} style={{ height }} />
              ))}
            </span>
            Voice AI Platform
          </span>
          <h2 className="mt-5 mb-0 text-[clamp(2rem,4.2vw,3.55rem)] leading-[1.05] font-black text-slate-950">
            Every Voice. <span className="bg-[linear-gradient(90deg,#0891b2,#0f766e,#84cc16)] bg-clip-text text-transparent">Every Need. AI That Delivers.</span>
          </h2>
          <p className="mx-auto mt-3 mb-0 max-w-2xl text-base leading-7 font-semibold text-slate-600">
            Voice AI that listens, understands and gets things done.
          </p>
        </div>

        <div className="relative mx-auto mt-6 hidden h-[560px] max-w-[1080px] lg:block">
          <svg className="pointer-events-none absolute inset-0 z-0 size-full" fill="none" viewBox="0 0 1080 560" aria-hidden="true">
            <g stroke="#a5f3fc" strokeDasharray="7 8" strokeLinecap="round" strokeWidth="1.8">
              <path d="M285 86 C380 86 370 188 468 196" />
              <path d="M252 236 C360 236 360 246 468 246" />
              <path d="M260 382 C366 382 362 306 470 300" />
              <path d="M420 472 C468 462 462 374 505 354" />
              <path d="M795 86 C700 86 710 188 612 196" />
              <path d="M828 236 C720 236 720 246 612 246" />
              <path d="M820 382 C714 382 718 306 610 300" />
              <path d="M660 472 C612 462 618 374 575 354" />
            </g>
          </svg>

          <div className="absolute left-1/2 top-[45%] z-10 -translate-x-1/2 -translate-y-1/2">
            <CentralVoiceOrb isListening={isListening} />
          </div>

          {voiceAgentUseCases.map((item, index) => {
            const accent = useCaseAccentStyles[item.accent as keyof typeof useCaseAccentStyles];

            return (
              <div key={item.title}>
                {renderRecordingButton(item, index, "radial")}
                <span
                  className={`pointer-events-none absolute z-10 size-4 rounded-full ring-4 ring-white ${accent.dot}`}
                  style={{
                    left: `${[40.8, 38.1, 39.1, 47.3, 58.4, 60.9, 59.9, 52.7][index]}%`,
                    top: `${[33.1, 49.2, 65.1, 80.2, 33.1, 49.2, 65.1, 80.2][index]}%`,
                  }}
                />
              </div>
            );
          })}

          <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2">
            <button
              className={`inline-flex min-h-12 min-w-[250px] items-center justify-center gap-3 rounded-full bg-[linear-gradient(90deg,#00FFFF,#06b6d4,#0f766e)] px-7 text-base font-black text-slate-950 shadow-[0_14px_32px_rgba(0,184,196,0.24)] transition hover:-translate-y-0.5 ${isListening ? "recording-control-active" : ""}`}
              onClick={() => setIsListening((current) => !current)}
              type="button"
            >
              <span className={`flex h-7 items-center gap-1 ${isListening ? "" : "voice-agent-paused"}`} aria-hidden="true">
                {[12, 20, 26, 18, 23].map((height, index) => (
                  <span className="voice-agent-button-bar w-1 rounded-full bg-current" key={index} style={{ height, animationDelay: `${index * 80}ms` }} />
                ))}
              </span>
              Listen to the Call
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:hidden">
          <div className="mx-auto my-2 size-[280px] max-w-full">
            <CentralVoiceOrb isListening={isListening} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {voiceAgentUseCases.map((item, index) => renderRecordingButton(item, index))}
          </div>
          <button
            className={`mt-3 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(90deg,#00FFFF,#06b6d4,#0f766e)] px-6 text-base font-black text-slate-950 shadow-[0_18px_38px_rgba(0,184,196,0.26)] ${isListening ? "recording-control-active" : ""}`}
            onClick={() => setIsListening((current) => !current)}
            type="button"
          >
            <span className={`flex h-7 items-center gap-1 ${isListening ? "" : "voice-agent-paused"}`} aria-hidden="true">
              {[14, 24, 32, 21, 29].map((height, index) => (
                <span className="voice-agent-button-bar w-1.5 rounded-full bg-current" key={index} style={{ height, animationDelay: `${index * 80}ms` }} />
              ))}
            </span>
            Listen to the Call
          </button>
        </div>
      </div>
    </section>
  );
}

function AutomateAgents() {
  return (
    <section className="overflow-hidden bg-white py-16 text-center">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto mb-6 flex w-fit gap-1 text-4xl font-black text-cyan-500">...</div>
        <h2 className="m-0 text-[clamp(1.9rem,4vw,3.15rem)] leading-tight font-black text-slate-950">
          <span className="bg-cyan-100 px-4 text-cyan-700">Automate every customer interaction</span>
          <br />
          with AI Voice Platform agents
        </h2>
        <p className="mx-auto mt-4 mb-0 max-w-3xl text-base leading-7 text-slate-700">
          Turn everyday phone conversations into helpful, measurable workflows for sales,
          support, operations, and service teams.
        </p>
        <div className="relative mx-auto mt-14 h-32 max-w-md">
          <div className="absolute left-0 top-8 h-24 w-[45%] rounded-tl-[36px] border-t-8 border-l-8 border-cyan-200" />
          <div className="absolute right-0 top-8 h-24 w-[45%] rounded-tr-[36px] border-t-8 border-r-8 border-cyan-200" />
          <span className="absolute left-1/2 top-0 grid size-20 -translate-x-1/2 place-items-center rounded-full border-8 border-white bg-[#00FFFF] text-4xl text-slate-950 shadow-[0_20px_42px_rgba(0,180,190,0.28)]">
            <svg
              aria-hidden="true"
              className="size-10"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.9"
              viewBox="0 0 24 24"
            >
              <path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
              <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
              <path d="M12 18v3" />
              <path d="M9 21h6" />
              <path d="M3 8v6" />
              <path d="M21 8v6" />
            </svg>
          </span>
        </div>
      </div>
      <div className="mt-6 grid gap-6 bg-[linear-gradient(180deg,transparent,#eaffff_35%,#ffffff)] py-8">
        <div className="home-chip-row flex w-max gap-4">
          {[...agentUseCases, ...agentUseCases].map((item, index) => (
            <span className="rounded-full border border-cyan-100 bg-white px-6 py-4 text-base font-medium text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.08)]" key={`${item}-${index}`}>
              AI {item}
            </span>
          ))}
        </div>
        <div className="home-chip-row-reverse flex w-max gap-4">
          {[...agentUseCases.slice().reverse(), ...agentUseCases.slice().reverse()].map((item, index) => (
            <span className="rounded-full border border-cyan-100 bg-white px-6 py-4 text-base font-medium text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.08)]" key={`${item}-${index}`}>
              AI {item}
            </span>
          ))}
        </div>
      </div>
      <a className="mt-4 inline-flex rounded-full bg-slate-950 px-7 py-4 text-base font-black text-white" href="#platform">
        Explore AI Agents -&gt;
      </a>
    </section>
  );
}

function ChannelAccess() {
  return (
    <section className="mx-auto max-w-[1220px] px-4 py-12">
      <div className="relative min-h-[430px] overflow-hidden rounded-[30px] bg-[#f2ffff] p-8 shadow-[0_18px_52px_rgba(0,180,190,0.12)] ring-1 ring-cyan-100">
        <span className="absolute top-10 left-0 h-12 w-1.5 rounded-r-full bg-[#00FFFF]" />
        <h2 className="relative z-10 max-w-sm text-3xl leading-tight font-black text-slate-950">
          <span className="text-cyan-700">24/7 Voice Access</span> Across Every Call Channel
        </h2>
        <div className="absolute left-14 right-14 top-1/2 h-4 rounded-full bg-[linear-gradient(90deg,#00FFFF,#94f7ff,#00FFFF)]" />
        <div className="absolute left-[16%] top-[46%] grid size-28 place-items-center rounded-full border-8 border-white bg-cyan-100 text-3xl shadow-xl">
          AI
        </div>
        <div className="absolute right-[10%] top-[38%] grid size-24 place-items-center rounded-full border-8 border-white bg-cyan-400 text-white shadow-xl">
          CX
        </div>
        {["Phone", "Web", "CRM", "IVR", "SMS"].map((channel, index) => (
          <div
            className="absolute grid size-16 place-items-center rounded-2xl bg-white text-sm font-black text-cyan-700 shadow-[0_14px_32px_rgba(15,23,42,0.14)]"
            key={channel}
            style={{
              left: `${44 + (index % 2) * 9}%`,
              top: `${18 + index * 13}%`,
            }}
          >
            {channel.slice(0, 2)}
          </div>
        ))}
        <div className="absolute left-[26%] top-[28%] rounded-lg bg-white px-5 py-4 text-slate-700 shadow-lg">
          Can you help me book an appointment?
        </div>
        <div className="absolute left-[32%] bottom-[12%] max-w-xs rounded-lg bg-white px-5 py-4 text-slate-700 shadow-lg">
          I need to speak with the right support team.
        </div>
        <div className="absolute right-[14%] bottom-[24%] rounded-lg bg-white px-5 py-4 text-slate-700 shadow-lg">
          I found your account and created a summary.
        </div>
      </div>
    </section>
  );
}

function PlatformCards() {
  return (
    <section className="mx-auto max-w-[1220px] px-4 py-16" id="platform">
      <div className="text-center">
        <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-bold text-cyan-800">
          AI Voice Platform
        </span>
        <h2 className="mx-auto mt-8 mb-0 max-w-4xl text-[clamp(1.9rem,4vw,3.15rem)] leading-tight font-black text-slate-950">
          The purpose-built platform for the voice AI era
        </h2>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {platformCards.map((card, index) => (
          <article
            className={`relative flex min-h-[280px] flex-col overflow-hidden rounded-[20px] p-8 text-slate-950 shadow-[0_18px_48px_rgba(15,23,42,0.10)] ring-1 ring-white/70 ${cardStyles[index]}`}
            key={card.title}
          >
            <div className="relative z-10">
              <h3 className="m-0 max-w-lg text-2xl leading-tight font-black">
                {card.title}
              </h3>
              <p className="mt-5 mb-0 max-w-xl text-base leading-7 text-slate-700">
                {card.body}
              </p>
            </div>

            <div className="relative z-10 mt-auto pt-8">
              <div className="h-20 rounded-t-[44px] border-t-8 border-cyan-200/80" />
              <div className="relative -mt-14 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white/95 px-5 py-4 text-sm font-bold text-slate-700 shadow-[0_14px_30px_rgba(15,23,42,0.12)] ring-1 ring-white/80">
                  {index % 2 === 0 ? "Customer intent found" : "Send call summary"}
                </div>
                <div className="rounded-lg bg-white/95 px-5 py-4 text-sm font-bold text-slate-700 shadow-[0_14px_30px_rgba(15,23,42,0.12)] ring-1 ring-white/80">
                  {index % 2 === 0 ? "AI Powered Action" : "Call Trigger"}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function GlobalProof() {
  return (
    <section className="relative mt-10 bg-[#00FFFF] py-20 text-slate-950">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-cyan-800">
            Leading Conversations Globally
          </span>
          <h2 className="mt-8 mb-0 text-[clamp(1.9rem,4vw,3.15rem)] leading-tight font-black">
            A voice AI engine for teams that want every call answered, understood, and actioned.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-7 rounded-[28px] bg-white/55 p-8 text-center shadow-[0_20px_56px_rgba(15,23,42,0.12)]">
          {[
            ["24/7", "AI voice coverage"],
            ["5 min", "to create an agent"],
            ["140+", "languages supported"],
            ["100%", "call summaries captured"],
          ].map(([value, label]) => (
            <div className="grid gap-2" key={label}>
              <strong className="text-5xl font-black">{value}</strong>
              <span className="text-lg leading-6 text-slate-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-[900px] gap-6 px-4 md:grid-cols-2">
        <div className="rounded-[24px] border-8 border-white bg-cyan-50 p-8 shadow-xl">
          <p className="m-0 leading-7 text-slate-700">
            By leveraging AI voice agents, teams reduce missed calls, improve follow-ups, and keep every conversation visible.
          </p>
          <div className="mt-12 rounded-lg bg-white p-5 font-black">AI Voice Platform - Customer Team</div>
        </div>
        <div className="rounded-[24px] bg-white p-8 shadow-xl">
          <div className="grid grid-cols-2 gap-8 text-center">
            {["Meta", "Juniper", "Gartner", "Everest"].map((award) => (
              <strong className="text-2xl text-slate-700" key={award}>{award}</strong>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleSection() {
  return (
    <section className="mx-auto max-w-[1160px] px-4 py-20 text-center" id="business">
      <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-bold text-cyan-800">
        Built for every team
      </span>
      <h2 className="mx-auto mt-8 mb-0 max-w-4xl text-[clamp(1.9rem,4vw,3.15rem)] leading-tight font-black text-slate-950">
        <span className="text-cyan-700">Teams use voice agents</span> to answer faster and follow up with more context
      </h2>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {roleCards.map((role) => (
          <article className="overflow-hidden rounded-lg border border-cyan-100 bg-white text-left shadow-[0_14px_34px_rgba(15,23,42,0.08)]" key={role.title}>
            <div className="relative h-36">
              <Image src={role.image} alt={role.title} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="min-h-44 p-5">
              <h3 className="m-0 text-xl font-black text-slate-950">{role.title}</h3>
              <p className="mt-4 mb-0 leading-6 text-slate-600">{role.body}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mx-auto mt-14 max-w-xl text-base leading-7 text-slate-700">
        <strong>Didn&apos;t see your workflow here?</strong> Get connected to our team to find out how voice automation can support your customer calls.
      </p>
      <a className="mt-8 inline-flex rounded-full border border-cyan-500 px-7 py-4 font-black text-cyan-800" href="#contact">
        Talk to an expert -&gt;
      </a>
    </section>
  );
}

function ResourcesSection() {
  return (
    <section className="mx-auto max-w-[980px] px-4 py-16 text-center" id="resources">
      <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-bold text-cyan-800">
        Resources
      </span>
      <h2 className="mx-auto mt-8 mb-0 max-w-4xl text-[clamp(1.9rem,4vw,3.15rem)] leading-tight font-black text-slate-950">
        Learn how teams design better voice agents and customer call workflows
      </h2>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {resources.map((resource) => (
          <article className="overflow-hidden rounded-lg border border-cyan-100 bg-white text-left shadow-[0_14px_34px_rgba(15,23,42,0.08)]" key={resource.title}>
            <div className="relative h-44">
              <Image src={resource.image} alt={resource.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="p-6">
              <span className="rounded-full border border-cyan-500 px-3 py-1 text-xs font-bold text-cyan-700">
                Blog
              </span>
              <h3 className="mt-5 mb-0 text-xl leading-7 font-black text-slate-950">{resource.title}</h3>
              <p className="mt-4 mb-0 leading-6 text-slate-600">{resource.body}</p>
              <a className="mt-8 inline-flex font-bold text-cyan-700" href="#">
                Find out more
              </a>
            </div>
          </article>
        ))}
        <article className="grid content-center gap-8 rounded-lg border border-cyan-100 bg-white p-8 text-left shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
          {[
            ["10", "Webinars"],
            ["12", "PDF guides"],
            ["40", "Customer stories"],
          ].map(([value, label]) => (
            <div className="flex items-center gap-6" key={label}>
              <span className="grid size-16 place-items-center rounded-xl bg-cyan-100 text-2xl font-black text-cyan-800">
                {value}
              </span>
              <span className="text-lg font-bold text-slate-950">{label}</span>
            </div>
          ))}
          <a className="w-fit rounded-full border border-cyan-500 px-6 py-3 font-black text-cyan-800" href="#">
            View all resources -&gt;
          </a>
        </article>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-[1080px] px-4 py-20" id="contact">
      <div className="relative overflow-hidden rounded-[28px] bg-[#00FFFF] px-6 py-24 text-center text-slate-950 shadow-[0_24px_70px_rgba(0,180,190,0.22)]">
        <div className="absolute top-0 left-1/2 h-8 w-32 -translate-x-1/2 rounded-b-[28px] bg-white" />
        <h2 className="m-0 text-[clamp(1.9rem,4vw,3.15rem)] font-black">Ready to start a smarter voice conversation?</h2>
        <p className="mx-auto mt-5 mb-0 max-w-xl text-base leading-7 text-slate-700">
          Get connected to see how AI Voice Platform can support your calls, agents, analytics, and customer workflows.
        </p>
        <a className="mt-10 inline-flex rounded-full bg-white px-7 py-4 font-black text-cyan-800 shadow-lg" href="mailto:hello@aivoiceplatform.com">
          Let&apos;s talk -&gt;
        </a>
      </div>
    </section>
  );
}

export function HomePlatformSections() {
  return (
    <div className="bg-white">
      <AutomateAgents />
      <ChannelAccess />
      <IndianLanguageVoiceSection />
      <HumanLikeAgentsSection />
      <PlatformCards />
      <GlobalProof />
      <RoleSection />
      <ResourcesSection />
      <FinalCta />
      <style>{`
        @keyframes home-chip-row {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes home-chip-row-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        .home-chip-row {
          animation: home-chip-row 34s linear infinite;
        }

        .home-chip-row-reverse {
          animation: home-chip-row-reverse 38s linear infinite;
        }

        @keyframes voice-agent-drift {
          0%, 100% { transform: translate3d(0, 0, 0) scaleX(1); opacity: 0.7; }
          50% { transform: translate3d(0, -7px, 0) scaleX(1.06); opacity: 1; }
        }

        @keyframes voice-agent-bars {
          0%, 100% { transform: scaleY(0.55); opacity: 0.58; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        @keyframes voice-agent-fingerprint {
          0%, 100% { opacity: 0.42; transform: scaleY(0.72); }
          50% { opacity: 1; transform: scaleY(1); }
        }

        @keyframes recording-control-pulse {
          0%, 100% { box-shadow: 0 10px 22px rgba(0,184,196,0.14), 0 0 0 0 rgba(0,255,255,0.26); }
          50% { box-shadow: 0 12px 28px rgba(0,184,196,0.20), 0 0 0 7px rgba(0,255,255,0); }
        }

        @keyframes voice-listen-orb-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 14px 34px rgba(0,184,196,0.24), 0 0 0 0 rgba(0,255,255,0.34); }
          50% { transform: scale(1.04); box-shadow: 0 18px 42px rgba(0,184,196,0.30), 0 0 0 10px rgba(0,255,255,0); }
        }

        .voice-agent-contours {
          background:
            repeating-radial-gradient(ellipse at 8% 100%, transparent 0 27px, rgba(0,184,196,0.14) 28px 29px, transparent 30px 52px),
            repeating-radial-gradient(ellipse at 92% 100%, transparent 0 27px, rgba(217,249,157,0.24) 28px 29px, transparent 30px 52px);
          mask-image: linear-gradient(to top, black 0%, transparent 78%);
        }

        .voice-agent-core::before,
        .voice-agent-core::after {
          content: "";
          position: absolute;
          inset: -22px;
          border-radius: 9999px;
          border: 1px solid rgba(0, 184, 196, 0.14);
        }

        .voice-agent-core::after {
          inset: -44px;
          border-color: rgba(103, 232, 249, 0.18);
        }

        .voice-agent-wave {
          position: absolute;
          left: 16%;
          right: 16%;
          height: 28px;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, rgba(0,184,196,0.82), rgba(217,249,157,0.76), rgba(103,232,249,0.72), transparent);
          filter: blur(1px);
          transform-origin: center;
          animation: voice-agent-drift 3.8s ease-in-out infinite;
        }

        .voice-agent-wave-one {
          top: 40%;
          rotate: -13deg;
        }

        .voice-agent-wave-two {
          top: 48%;
          rotate: 9deg;
          animation-delay: -1.3s;
          opacity: 0.75;
        }

        .voice-agent-wave-three {
          top: 55%;
          rotate: -7deg;
          animation-delay: -2.1s;
          opacity: 0.42;
        }

        .voice-agent-node::before {
          content: "";
          position: absolute;
          left: 50%;
          top: -18px;
          height: 18px;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(0,255,255,0.42));
        }

        .voice-agent-button-bar {
          animation: voice-agent-bars 1.05s ease-in-out infinite;
          transform-origin: center;
        }

        .voice-spectrum-dot {
          width: 4px;
          animation: voice-agent-bars 1.18s ease-in-out infinite;
          transform-origin: center;
          box-shadow: 0 0 14px rgba(37, 99, 235, 0.28);
        }

        .voice-agent-fingerprint-line {
          animation: voice-agent-fingerprint 1.08s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }

        .voice-agent-fingerprint-delay {
          animation-delay: -0.28s;
        }

        .recording-control-active {
          animation: recording-control-pulse 1.55s ease-in-out infinite;
        }

        .voice-listen-orb {
          animation: voice-listen-orb-pulse 1.8s ease-in-out infinite;
        }

        .voice-agent-paused,
        .voice-agent-paused .voice-agent-button-bar {
          animation-play-state: paused;
        }

        @media (min-width: 1024px) {
          .voice-agent-node::before {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
