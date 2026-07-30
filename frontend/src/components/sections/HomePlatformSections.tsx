"use client";

import { useState } from "react";
import Image from "next/image";
import { AudioWaveHero } from "./AudioWaveHero";
import { IndiaVoiceExperience } from "./IndiaVoiceExperience";

const companyLogos = [
  { name: "Google", src: "/images/company-logos/google.svg" },
  { name: "HubSpot", src: "/images/company-logos/hubspot.svg" },
  { name: "Shopify", src: "/images/company-logos/shopify.svg" },
  { name: "Zendesk", src: "/images/company-logos/zendesk.svg" },
  { name: "Notion", src: "/images/company-logos/notion.svg" },
  { name: "Intercom", src: "/images/company-logos/intercom.svg" },
  { name: "GitHub", src: "/images/company-logos/github.svg" },
  { name: "Zoom", src: "/images/company-logos/zoom.svg" },
  { name: "Dropbox", src: "/images/company-logos/dropbox.svg" },
  { name: "Figma", src: "/images/company-logos/figma.svg" },
  { name: "Spotify", src: "/images/company-logos/spotify.svg" },
];

const integrationSteps = [
  {
    number: "01",
    title: "Configure the agent",
    icon: "list",
    bullets: [
      { before: "Build call flows with a ", strong: "no-code editor", after: " and clean handoff paths." },
      { before: "Set rules for when a ", strong: "human should take over", after: "." },
      { before: "Sync knowledge from your ", strong: "CRM, calendar, and docs", after: "." },
    ],
    tags: ["Flow builder", "Knowledge base"],
    src: "/images/stt1.png"
  },
  {
    number: "02",
    title: "Choose the model",
    icon: "chip",
    bullets: [
      { before: "Reason with ", strong: "GPT, Claude, or open-source", after: " models." },
      { before: "Bring your own fine-tuned or ", strong: "self-hosted LLM", after: "." },
    ],
    tags: ["Bring your own model"],
    src: "/images/st2.png"
  },
  {
    number: "03",
    title: "Pick the voice",
    icon: "wave",
    bullets: [
      { before: "Natural voices across ", strong: "40+ languages", after: " tuned for phone audio." },
      { before: "Clone your own voice for a ", strong: "consistent brand sound", after: "." },
    ],
    tags: ["Voice cloning", "Multilingual"],
     src: "/images/st3.png"
  },
  {
    number: "04",
    title: "Deploy everywhere",
    icon: "globe",
    bullets: [
      { before: "Route ", strong: "inbound and outbound calls", after: " to real phone numbers." },
      { before: "Ship to web, mobile, and desktop with ", strong: "one SDK", after: "." },
    ],
    tags: ["Phone", "SDK", "Widget"],
     src: "/images/st4.png"
  },
];

const fitSections = [
  {
    key: "support",
    label: "Customer support & sales",
    columns: [
      {
        title: "Customer support",
        body: "Handle routine questions around the clock and free your human agents for the conversations that need judgment.",
      },
      {
        title: "Lead qualification",
        body: "Qualify callers, capture details, and book follow-ups while your sales team keeps momentum.",
      },
      {
        title: "Surveys and feedback",
        body: "Run outbound surveys and collect structured feedback without adding more manual calling work.",
      },
    ],
    src: "/images/voice_healthcare_3.avif"
  },
  {
    key: "assistants",
    label: "Virtual assistants",
    columns: [
      {
        title: "Appointment scheduling",
        body: "Schedule, reschedule, and confirm meetings with natural conversations connected to your calendar.",
      },
      {
        title: "Task follow-through",
        body: "Turn spoken requests into CRM updates, reminders, notes, and workflow actions automatically.",
      },
      {
        title: "Human handoff",
        body: "Escalate sensitive or complex calls with context, transcript, and caller intent already captured.",
      },
    ],
     src: "/images/virtualAssistance1.png"
  },
  {
    key: "devices",
    label: "Voice-enabled devices",
    columns: [
      {
        title: "Embedded voice control",
        body: "Bring conversational control to kiosks, connected hardware, apps, and in-product assistant surfaces.",
      },
      {
        title: "Realtime responses",
        body: "Keep latency low with speech, reasoning, and action routing tuned for live device interactions.",
      },
      {
        title: "Cross-channel memory",
        body: "Let customers continue from device to phone or web while preserving the same conversation context.",
      },
    ],
     src: "/images/voice_healthcare.avif"
  },
  {
    key: "healthcare",
    label: "Healthcare appointments",
    columns: [
      {
        title: "Patient appointment booking",
        body: "Schedule, reschedule, or cancel patient visits against live availability without keeping callers on hold.",
      },
      {
        title: "Reminders and follow-ups",
        body: "Confirm upcoming visits, share preparation guidance, and follow up after appointments automatically.",
      },
      {
        title: "After-hours patient routing",
        body: "Capture patient needs after hours and route urgent or sensitive requests to the right care team.",
      },
    ],
     src: "/images/healthcare.avif"
   
  },
  {
    key: "hospitality",
    label: "Travel & hospitality",
    columns: [
      {
        title: "Reservation support",
        body: "Handle booking questions, confirm reservations, and help guests make changes through natural phone conversations.",
      },
      {
        title: "Guest assistance",
        body: "Answer common stay and travel questions while routing urgent or high-touch requests to the right team.",
      },
      {
        title: "Multilingual service",
        body: "Support travelers across languages and time zones with consistent information and clear human handoffs.",
      },
    ],
      src: "/images/travelAndHos.png"
  },
];

const voiceOperationSteps = [
  {
    number: "01",
    title: "Shape voice agents",
    icon: "agent",
    body: "Create each assistant's personality, voice, opening message, language, and conversation rules.",
  },
  {
    number: "02",
    title: "Ground every reply",
    icon: "knowledge",
    body: "Give assistants trusted access to your product information, policies, FAQs, and internal resources.",
  },
  {
    number: "03",
    title: "Automate call actions",
    icon: "tools",
    body: "Let conversations update records, book appointments, route callers, and activate business workflows.",
  },
  {
    number: "04",
    title: "Go live at scale",
    icon: "launch",
    body: "Handle inbound demand or run outbound programs with flexible timing, retries, and capacity controls.",
  },
  {
    number: "05",
    title: "Learn from conversations",
    icon: "outcomes",
    body: "Turn transcripts, summaries, sentiment, and call results into practical performance insights.",
  },
  {
    number: "06",
    title: "Keep systems updated",
    icon: "sync",
    body: "Move clean conversation data into the CRMs, calendars, support tools, and apps your team relies on.",
  },
];

const agentIndustries = [
  {
    key: "ecommerce",
    label: "Ecommerce",
    agents: [
      { title: "Customer Support Agent", tags: ["Customer support", "English"], body: "Answers customer questions, resolves order issues, and routes complex requests to your team." },
      { title: "Cart Recovery Agent", tags: ["Cart recovery", "English + Hindi"], body: "Reconnects with shoppers who left items behind and helps recover sales through natural calls." },
      { title: "COD Confirmation Agent", tags: ["Order confirmation", "English + Hindi"], body: "Confirms cash-on-delivery orders and reduces failed deliveries before dispatch." },
      { title: "Returns Assistant", tags: ["Returns", "English"], body: "Guides customers through return requests and keeps every update clear and timely." },
    ],
  },
  {
    key: "edtech",
    label: "EdTech",
    agents: [
      { title: "Course Advisor", tags: ["Admissions", "English + Hindi"], body: "Matches learners to the right course and answers enrollment questions instantly." },
      { title: "Class Reminder Agent", tags: ["Engagement", "English"], body: "Keeps learners on track with timely class, assignment, and renewal reminders." },
      { title: "Lead Nurture Agent", tags: ["Sales", "English + Hindi"], body: "Qualifies prospective learners and books counselor follow-ups automatically." },
      { title: "Student Support Agent", tags: ["Support", "English"], body: "Handles common academic and account questions around the clock." },
    ],
  },
  {
    key: "healthtech",
    label: "HealthTech",
    agents: [
      { title: "Appointment Agent", tags: ["Scheduling", "English + Hindi"], body: "Books, changes, and confirms appointments from live calendar availability." },
      { title: "Patient Follow-up Agent", tags: ["Care", "English"], body: "Checks in after visits and shares the next steps patients need." },
      { title: "Reminder Agent", tags: ["Reminders", "English + Hindi"], body: "Reduces no-shows with friendly reminders and preparation guidance." },
      { title: "Care Routing Agent", tags: ["Triage", "English"], body: "Captures patient needs and routes urgent concerns to the right team." },
    ],
  },
  {
    key: "bfsi",
    label: "BFSI",
    agents: [
      { title: "Loan Follow-up Agent", tags: ["Loans", "English + Hindi"], body: "Follows up on applications and gathers missing details with clear conversations." },
      { title: "Payment Reminder Agent", tags: ["Collections", "English"], body: "Delivers respectful payment reminders and captures a preferred action." },
      { title: "Policy Support Agent", tags: ["Insurance", "English + Hindi"], body: "Answers policy questions and helps customers take the next step." },
      { title: "KYC Assistant", tags: ["Verification", "English"], body: "Guides customers through verification tasks and status updates." },
    ],
  },
  {
    key: "hospitality",
    label: "Hospitality",
    agents: [
      { title: "Reservation Agent", tags: ["Bookings", "English + Hindi"], body: "Handles booking questions, changes, and confirmations at any hour." },
      { title: "Guest Concierge", tags: ["Guest service", "English"], body: "Answers common guest questions before and during their stay." },
      { title: "Feedback Agent", tags: ["Reviews", "English"], body: "Collects structured feedback while the guest experience is still fresh." },
      { title: "Travel Support Agent", tags: ["Support", "English + Hindi"], body: "Keeps travellers informed when plans, times, or reservations change." },
    ],
  },
];

function IntegrationIcon({ icon }: { icon: string }) {
  if (icon === "chip") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M4 9h3M4 15h3M17 9h3M17 15h3M9 4v3M15 4v3M9 17v3M15 17v3" />
      </svg>
    );
  }

  if (icon === "wave") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 14v-4M9 17V7M13 15V9M17 18V6M21 14v-4" />
      </svg>
    );
  }

  if (icon === "globe") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.4 2.4 3.6 5.4 3.6 9S14.4 18.6 12 21M12 3C9.6 5.4 8.4 8.4 8.4 12s1.2 6.6 3.6 9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 7h8M8 12h8M8 17h5" />
    </svg>
  );
}

function VoiceOperationIcon({ icon }: { icon: string }) {
  if (icon === "agent") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M10 13a6 6 0 0 1 12 0v5a6 6 0 0 1-12 0v-5Z" />
        <path d="M7 17v1a9 9 0 0 0 18 0v-1M16 27v3M12 30h8M13 14h.01M19 14h.01M13.5 19a4 4 0 0 0 5 0" />
      </svg>
    );
  }

  if (icon === "knowledge") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 7.5A3.5 3.5 0 0 1 8.5 4H15v22H8.5A3.5 3.5 0 0 0 5 29.5v-22ZM27 7.5A3.5 3.5 0 0 0 23.5 4H17v22h6.5a3.5 3.5 0 0 1 3.5 3.5v-22Z" />
        <path d="M8.5 9H12M20 9h3.5M8.5 14H12M20 14h3.5" />
      </svg>
    );
  }

  if (icon === "tools") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m18.5 9.5 4-4a6 6 0 0 0-7.7 7.7L5.5 22.5a2.8 2.8 0 1 0 4 4l9.3-9.3a6 6 0 0 0 7.7-7.7l-4 4-4-1-1-4Z" />
        <circle cx="7.5" cy="24.5" r=".8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (icon === "launch") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M19 5c4.5-2 8-1 8-1s1 3.5-1 8l-6.5 6.5-6-6L19 5Z" />
        <path d="m14 13-5.5 1.5-3 3 6.5 1M19 18l-1 6.5 6.5-6.5-1.5-4.5M10.5 23.5C8 23 5 24 4 28c4 0 7-1 6.5-4.5Z" />
        <circle cx="22" cy="9" r="2" />
      </svg>
    );
  }

  if (icon === "outcomes") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 27V16M12 27V10M19 27V18M26 27V5" />
        <path d="m5 11 7-5 7 5 7-7M22 4h4v4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M25.5 11A11 11 0 0 0 7 7.5L4 11M6.5 21A11 11 0 0 0 25 24.5l3-3.5" />
      <path d="M4 5v6h6M28 27v-6h-6" />
      <path d="M11 13h10M11 17h10M11 21h6" />
    </svg>
  );
}

function GlowButton({ children, href }: { children: string; href: string }) {
  return (
    <a
      className="vozon-glow-button inline-flex min-h-12 items-center justify-center rounded-[14px] px-7 text-sm font-black text-[#02110d]"
      href={href}
    >
      {children}
    </a>
  );
}

export function HomePlatformSections() {
  const [selectedAgentIndustryKey, setSelectedAgentIndustryKey] = useState("ecommerce");
  const selectedAgentIndustry =
    agentIndustries.find((industry) => industry.key === selectedAgentIndustryKey) ?? agentIndustries[0];

  return (
    <div className="vozon-home relative isolate overflow-hidden bg-black text-white">
      <section
        id="product"
        className="relative mx-auto flex min-h-screen max-w-[1600px] items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-8 lg:pt-32"
      >
        <AudioWaveHero />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,.16)_60%,rgba(0,0,0,.86)_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-[1280px]">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/30 px-4 py-2 text-xs font-semibold text-white/80 shadow-[inset_0_0_22px_rgba(255,255,255,0.04)] backdrop-blur">
            <span className="size-2 rounded-full bg-[#22f4d2] shadow-[0_0_14px_#22f4d2]" />
            Voice Agents Live Now
          </div>
          <h1 className="mx-auto m-0 max-w-5xl text-[clamp(1.75rem,8vw,2.1rem)] font-black leading-[1.02] tracking-[-0.025em] text-white [overflow-wrap:anywhere] sm:text-[clamp(2.1rem,5.6vw,4.7rem)] sm:leading-[0.98] sm:tracking-[-0.03em]">
            Launch enterprise-ready <span>AI voice agents</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-white/56 sm:text-base">
            vozon.ai helps teams answer every call, qualify every lead, book
            every next step, and turn conversations into clean workflows for
            sales, support, and operations.
          </p>
          <div className="mt-8 flex justify-center">
            <GlowButton href="/dashboard">Deploy Now</GlowButton>
          </div>
        </div>
      </section>

      <section className="vozon-company-marquee-section relative mt-8 overflow-hidden py-10 sm:mt-12 sm:py-12">
        <div className="relative z-10 mx-auto mb-9 max-w-4xl px-5 text-center sm:px-8">
          <h4 className="vozon-company-heading m-0 whitespace-nowrap text-white">
            Trusted by Developers &amp; Businesses Worldwide
          </h4>
        </div>

        <div className="vozon-company-marquee relative z-10 flex overflow-hidden py-3">
          {[0, 1].map((track) => (
            <div
              className="vozon-company-track flex min-w-full shrink-0 items-center gap-16 px-8"
              key={track}
            >
              {companyLogos.map((company) => (
                <div
                  className="vozon-company-logo inline-flex min-w-[180px] items-center justify-center gap-3"
                  key={`${track}-${company.name}`}
                >
                  <Image
                    alt={`${company.name} logo`}
                    className="vozon-company-logo-image h-9 w-9 object-contain"
                    height={40}
                    src={company.src}
                    width={40}
                  />
                  <span className="vozon-company-name whitespace-nowrap text-[1.55rem] font-black leading-none">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <IndiaVoiceExperience />

      <section className="relative mx-auto max-w-[1240px] px-5 pb-4 pt-2 sm:px-8 sm:pb-5 lg:pb-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-[#75fff0]">
            One Platform
          </div>
          <h2 className="vozon-platform-heading mx-auto m-0 max-w-5xl text-white lg:whitespace-nowrap">
            Every AI voice layer connected in one place
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/54">
            LLMs, speech, realtime, vision, and external tools stay coordinated
            through the Vozon agent layer.
          </p>
        </div>

        <div className="vozon-platform-map relative overflow-hidden">
          <Image
            alt="Vozon AI platform connected to LLM, realtime, speech, vision, and external services"
            className="relative z-10 block aspect-[16/9] w-full object-cover"
            height={788}
            priority={false}
            src="/images/one_platform.png"
            width={1400}
          />
        </div>
      </section>

      <section className="vozon-operations-section relative overflow-hidden px-5 py-4 sm:px-8 sm:py-5 lg:py-6">
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#45ddce]/24 bg-[#45ddce]/[0.07] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#75fff0]">
              <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_12px_#45ddce]" />
              Voice Operations
            </div>
            <h2 className="vozon-platform-heading m-0 text-white">
              Build, launch, and improve every conversation.
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-white/56 sm:text-base">
              Vozon gives your team the building blocks to create agents,
              connect business knowledge, launch calls, monitor outcomes, and
              move conversation data into the systems you already use.
            </p>
          </div>

          <div
            className="vozon-operations-viewport mt-10 overflow-x-auto pb-4 sm:mt-14"
            role="region"
            aria-label="AI voice operations workflow"
            tabIndex={0}
          >
            <div className="vozon-operations-map relative mx-auto min-w-[1080px]">
              <svg
                className="vozon-operations-connector absolute inset-x-0 top-0 h-[180px] w-full"
                viewBox="0 0 1200 180"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="vozonOperationsLine"
                    x1="0"
                    x2="1200"
                    y1="0"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#1acfff" stopOpacity="0.18" />
                    <stop
                      offset="0.22"
                      stopColor="#2be3e1"
                      stopOpacity="0.78"
                    />
                    <stop offset="0.52" stopColor="#75fff0" stopOpacity="0.9" />
                    <stop offset="0.8" stopColor="#48db8b" stopOpacity="0.78" />
                    <stop offset="1" stopColor="#48db8b" stopOpacity="0.18" />
                  </linearGradient>
                </defs>
                <path
                  d="M100 78 L300 118 L500 78 L700 118 L900 78 L1100 118"
                  fill="none"
                  stroke="url(#vozonOperationsLine)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>

              <div className="relative grid grid-cols-6">
                {voiceOperationSteps.map((step, index) => (
                  <article
                    className={`vozon-operation-step relative flex min-w-0 flex-col items-center px-3 text-center ${index % 2 === 1 ? "vozon-operation-step-lower" : ""}`}
                    key={step.number}
                  >
                    <div
                      className="vozon-operation-hex relative grid h-[108px] w-[116px] place-items-center"
                      aria-hidden="true"
                    >
                      <div className="vozon-operation-hex-inner absolute inset-[3px]" />
                      <VoiceOperationIcon icon={step.icon} />
                      <span className="vozon-operation-number absolute -right-2 -top-1 grid size-7 place-items-center rounded-full border border-[#75fff0]/30 bg-[#061b18] text-[9px] font-black text-[#8afff2]">
                        {step.number}
                      </span>
                    </div>

                    <span
                      className="vozon-operation-stem block h-8 w-px"
                      aria-hidden="true"
                    />
                    <span
                      className="vozon-operation-dot block size-3 rounded-full bg-[#45ddce]"
                      aria-hidden="true"
                    />
                    <h3 className="mb-0 mt-5 text-base font-black leading-tight text-white">
                      {step.title}
                    </h3>
                    <p className="mb-0 mt-3 max-w-[180px] text-xs leading-5 text-white/48">
                      {step.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <p className="vozon-operations-scroll-hint mb-0 mt-1 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
            Scroll to explore the workflow
          </p>
        </div>
      </section>

      <section className="vozon-agents-section relative overflow-hidden px-5 py-16 sm:px-8 lg:py-20">
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#45ddce]/24 bg-[#45ddce]/[0.07] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#75fff0]">
              <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_12px_#45ddce]" />
              Our agents
            </div>
            <h2 className="vozon-platform-heading m-0 text-white">Agents that do more than just talk.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-white/56 sm:text-base">
              Explore voice agents designed for your industry. They understand context, take action, and help your team move faster.
            </p>
          </div>

          <div aria-label="Agent industries" className="vozon-agent-tabs mx-auto mt-10 flex max-w-4xl overflow-x-auto p-1.5" role="tablist">
            {agentIndustries.map((industry) => (
              <button
                aria-controls={`vozon-agent-panel-${industry.key}`}
                aria-selected={selectedAgentIndustry.key === industry.key}
                className={`vozon-agent-tab ${selectedAgentIndustry.key === industry.key ? "is-active" : ""}`}
                id={`vozon-agent-tab-${industry.key}`}
                key={industry.key}
                onClick={() => setSelectedAgentIndustryKey(industry.key)}
                role="tab"
                type="button"
              >
                {industry.label}
              </button>
            ))}
          </div>

          <div
            aria-labelledby={`vozon-agent-tab-${selectedAgentIndustry.key}`}
            className="mt-8 grid gap-5 md:grid-cols-2"
            id={`vozon-agent-panel-${selectedAgentIndustry.key}`}
            role="tabpanel"
          >
            {selectedAgentIndustry.agents.map((agent) => (
              <article className="vozon-agent-card flex flex-col p-6 sm:p-7" key={agent.title}>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="m-0 text-xl font-black leading-tight text-white">{agent.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {agent.tags.map((tag) => (
                        <span className="rounded-md bg-white/[0.08] px-2.5 py-1 text-xs font-bold text-white/58" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="vozon-agent-card-status mt-1 size-2 shrink-0 rounded-full" aria-label="Available" />
                </div>
                <p className="mb-0 mt-5 max-w-xl text-sm leading-6 text-white/55">{agent.body}</p>
                <div className="mt-7 flex flex-wrap gap-3 border-t border-white/[0.09] pt-5">
                  <button className="vozon-agent-play-button" type="button">
                    <span aria-hidden="true">▶</span>
                    Play demo
                  </button>
                  <button className="vozon-agent-clone-button" type="button">
                    <span aria-hidden="true">↗</span>
                    Clone agent
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="vozon-fit-section relative overflow-hidden px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#45ddce]/24 bg-[#45ddce]/[0.07] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#75fff0]">
            <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_12px_#45ddce]" />
            Where Vozon Fits
          </div>
          <h2 className="vozon-platform-heading m-0 max-w-3xl text-white">
            One voice agent, every industry
            <span className="block text-white/42">that answers a phone</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
            Support, virtual assistants, or voice-enabled hardware. The same
            agent adapts to how your business actually talks to people.
          </p>
        </div>

        <div className="relative z-10 mx-auto max-w-[1240px]">
          <div className="mt-10 space-y-6 lg:hidden">
            {fitSections.map((section, index) => (
              <article className="vozon-fit-mobile-item overflow-hidden" key={section.key}>
                <div className="flex items-center gap-3 px-5 py-4">
                  <span className="vozon-fit-compact-number">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="m-0 text-base font-black text-white">{section.label}</h3>
                </div>
                <div className="relative min-h-[250px]">
                  <Image
                    src={section.src}
                    alt={section.label}
                    fill
                    className="object-cover object-top"
                    sizes="100vw"
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="vozon-fit-compact mt-10 hidden gap-6 lg:grid lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] lg:gap-10">
            <div aria-label="Vozon industry use cases" className="order-2 space-y-2 lg:order-1" role="tablist">
              {fitSections.map((section, index) => (
                <button
                  aria-controls={`vozon-fit-panel-${section.key}`}
                  aria-selected={selectedFit.key === section.key}
                  className={`vozon-fit-compact-tab w-full text-left ${selectedFit.key === section.key ? "is-active" : ""}`}
                  id={`vozon-fit-tab-${section.key}`}
                  key={section.key}
                  onClick={() => setSelectedFitKey(section.key)}
                  role="tab"
                  type="button"
                >
                  <span className="vozon-fit-compact-number">{String(index + 1).padStart(2, "0")}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </div>

            <div
              aria-labelledby={`vozon-fit-tab-${selectedFit.key}`}
              className="vozon-fit-compact-image relative order-1 min-h-[300px] overflow-hidden sm:min-h-[420px] lg:order-2"
              id={`vozon-fit-panel-${selectedFit.key}`}
              role="tabpanel"
            >
              <Image
                src={selectedFit.src}
                alt={selectedFit.label}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
              <div className="vozon-fit-compact-image-label">
                <span>Industry solution</span>
                <strong>{selectedFit.label}</strong>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section
        id="integrations"
        className="vozon-integrations-section relative overflow-hidden px-5 py-14 sm:px-8 lg:py-[72px]"
      >
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#45ddce]/24 bg-[#45ddce]/[0.07] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#75fff0]">
              <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_12px_#45ddce]" />
              Integrations
            </div>

            <h2 className="vozon-platform-heading m-0 max-w-3xl text-white">
              From script to spoken word, <span>wired end to end.</span>
            </h2>

            <p className="mt-6 mx-auto  max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              Vozon routes every call through one continuous signal path -
              configure, connect, voice, deploy - so your agent goes live
              without stitching tools together yourself.
            </p>
          </div>

          <div className="vozon-integration-flow relative mt-12">
            <div className="vozon-integration-rail relative z-10 space-y-6 lg:space-y-8">
              {integrationSteps.map((step, index) => (
                <article
                  className="vozon-integration-card relative grid overflow-hidden lg:grid-cols-[0.9fr_1.1fr]"
                  key={step.number}
                >
                  <div
                    className={`vozon-integration-copy relative flex flex-col justify-center px-6 py-8 sm:px-9 lg:px-12 lg:py-10 ${
                      index % 2 !== 0 ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                  {/* <span className="vozon-integration-step-number text-[2.35rem] font-black leading-none text-white/[0.13]">
                    {step.number}
                  </span> */}

                  <div className="mb-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#75fff0]">
                    <span className="h-px w-7 bg-[#45ddce]" />
                    Step {step.number}
                  </div>

                  {/* <div className="vozon-integration-icon grid size-[52px] place-items-center rounded-[15px] border border-[#45ddce]/28 bg-[#45ddce]/10 text-[#9dfff4]">
                    <IntegrationIcon icon={step.icon} />
                  </div> */}

                  <div className="flex items-center gap-4">
                    <div className="vozon-integration-icon grid size-[52px] shrink-0 place-items-center rounded-[15px] border border-[#45ddce]/28 bg-[#45ddce]/10 text-[#9dfff4]">
                      <IntegrationIcon icon={step.icon} />
                    </div>
                    <h3 className="m-0 text-xl font-black leading-tight text-white sm:text-2xl">{step.title}</h3>
                  </div>

                  <ul className="mt-5 space-y-3.5 p-0 text-sm leading-6 text-white/55 sm:text-base">
                    {step.bullets.map((bullet) => (
                      <li
                        className="flex gap-3"
                        key={`${step.number}-${bullet.strong}`}
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#45ddce]" />
                        <span>
                          {bullet.before}
                          <strong className="font-black text-white/88">
                            {bullet.strong}
                          </strong>
                          {bullet.after}
                        </span>
                      </li>
                    ))}
                  </ul>


                   <div className="mt-8 flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span className="rounded-full border border-white/12 px-3 py-1 text-xs font-bold text-white/42" key={tag}>
                          {tag}
                        </span>
                      ))}
                     </div>
                    </div>

                  <div className={`vozon-integration-image relative min-h-[260px] sm:min-h-[320px] lg:min-h-[360px] ${
                    index % 2 !== 0 ? "vozon-integration-image-left lg:order-1" : "vozon-integration-image-right lg:order-2"
                  }`}>
                    <div className="vozon-integration-image-placeholder absolute inset-0 grid place-items-center">
                      {index === 0 ? (
                        <div className="vozon-agent-config-card w-[82%] rounded-2xl p-5 sm:p-6">
                          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                            <div>
                              <p className="m-0 text-[10px] font-black uppercase tracking-[0.18em] text-[#75fff0]">Agent setup</p>
                              <h4 className="mt-1 mb-0 text-base font-black text-white">Support assistant</h4>
                            </div>
                            <span className="rounded-full bg-[#45ddce]/15 px-2.5 py-1 text-[10px] font-black text-[#75fff0]">Ready</span>
                          </div>
                          <div className="mt-5 space-y-3">
                            <div className="vozon-agent-config-row"><span>Voice</span><strong>Natural English</strong></div>
                            <div className="vozon-agent-config-row"><span>Knowledge</span><strong>Connected</strong></div>
                            <div className="vozon-agent-config-row"><span>Handoff</span><strong>Human team</strong></div>
                          </div>
                          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><span className="block h-full w-[78%] rounded-full bg-[#45ddce]" /></div>
                        </div>
                      ) : (
                        <Image
                          src={step.src}
                          alt={`Step ${step.number}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .vozon-home {
          font-family: var(--font-site-sans), ui-sans-serif, system-ui, sans-serif;
          background: #000;
        }

        .vozon-company-heading {
          font-size: 0.95rem;
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: 0;
        }

        .vozon-platform-heading {
          font-size: 1.55rem;
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: 0;
        }

        @media (min-width: 640px) {
          .vozon-company-heading {
            font-size: 1.25rem;
          }

          .vozon-platform-heading {
            font-size: 2.15rem;
          }
        }

        @media (min-width: 1024px) {
          .vozon-company-heading {
            font-size: 1.5rem;
          }

          .vozon-platform-heading {
            font-size: 2.5rem;
          }
        }

        .vozon-integrations-section {
          background: transparent;
        }

        .vozon-integration-flow {
          min-width: 0;
        }

        .vozon-integration-rail {
         min-width: 0;
        position: relative;
        }

       .vozon-integration-rail::before {
          content: "";
          position: absolute;
          top: 4rem;
          bottom: 4rem;
          left: 45%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(69,221,206,0.34) 8%, rgba(69,221,206,0.34) 92%, transparent);
          transform: translateX(-50%);
        }

        .vozon-integration-card {
           border: 1px solid rgba(117,255,240,0.14);
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.018), 0 18px 45px rgba(0,0,0,0.12);
          transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
        }

       .vozon-integration-card:hover {
          border-color: rgba(117,255,240,0.3);
          transform: translateY(-3px);
          box-shadow: inset 0 0 0 1px rgba(117,255,240,0.05), 0 24px 54px rgba(0,0,0,0.2);
        }
        
         .vozon-integration-image {
          border-bottom: 1px solid rgba(117,255,240,0.14);
          background:
            radial-gradient(circle at 22% 18%, rgba(69,221,206,0.13), transparent 35%),
            linear-gradient(135deg, rgba(13,36,38,0.92), rgba(5,14,19,0.96));
        }

        .vozon-integration-image-placeholder::after {
          margin: 1rem;
          overflow: hidden;
          border: 1px solid rgba(117,255,240,0.16);
          border-radius: 15px;
           background: radial-gradient(circle at 18% 0%, rgba(117,255,240,0.1), transparent 38%);
          opacity: 0.68;
          // background: #071512;
        }

        .vozon-agent-config-card {
          position: relative;
          z-index: 1;
          border: 1px solid rgba(117,255,240,0.2);
          background:
            radial-gradient(circle at 100% 0%, rgba(69,221,206,0.14), transparent 38%),
            rgba(3,18,20,0.9);
          box-shadow: 0 18px 45px rgba(0,0,0,0.28), inset 0 0 28px rgba(69,221,206,0.04);
        }

        .vozon-agent-config-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem 0.85rem;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.55rem;
          background: rgba(255,255,255,0.025);
          color: rgba(255,255,255,0.52);
          font-size: 0.75rem;
        }

        .vozon-agent-config-row strong {
          color: rgba(255,255,255,0.86);
          font-size: 0.72rem;
        }

        .vozon-integration-copy::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 12px;
          height: 12px;
          border: 2px solid #071512;
          border-radius: 999px;
          background: #45ddce;
          box-shadow: 0 0 0 5px rgba(69,221,206,0.12), 0 0 20px rgba(69,221,206,0.45);
          transform: translateY(-50%);
        }

        .vozon-integration-step-number {
          right: 2rem;
          top: 1.7rem;
          pointer-events: none;
        }

        // .vozon-integration-card:hover {
        //   transform: translateY(-4px);
        //   background: radial-gradient(circle at 18% 0%, rgba(117,255,240,0.07), transparent 60%);
        // }

        .vozon-integration-icon {
          background:
            linear-gradient(135deg, rgba(72,219,139,0.18), rgba(32,244,208,0.12)),
            rgba(255,255,255,0.045);
          box-shadow:
            inset 0 0 18px rgba(117,255,240,0.07),
            0 0 28px rgba(32,244,208,0.12);
        }

          @media (min-width: 1024px) {
          .vozon-integration-image-right {
            border-right: 1px solid rgba(117,255,240,0.14);
            border-bottom: 0;
          }

          .vozon-integration-image-left {
            border-right: 0;
            border-bottom: 0;
            border-left: 1px solid rgba(117,255,240,0.14);
          }

          .vozon-integration-copy::after {
            right: -6px;
            z-index: 2;
          }

          .vozon-integration-card:nth-child(even) .vozon-integration-copy::after {
            right: auto;
            left: -6px;
          }
        }

          @media (max-width: 1023px) {
          .vozon-integration-rail::before,
          .vozon-integration-copy::after {
            display: none;
          }
        }

        .vozon-integration-icon svg {
          width: 28px;
          height: 28px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 2.2;
        }

        .vozon-agents-section {
          background:
            radial-gradient(circle at 50% 16%, rgba(69,221,206,0.08), transparent 25%),
            linear-gradient(180deg, #000, #030a0a 52%, #000);
        }

        .vozon-agent-tabs {
          gap: 0.35rem;
          border: 1px solid rgba(117,255,240,0.16);
          border-radius: 0.9rem;
          background: rgba(255,255,255,0.025);
          scrollbar-width: none;
        }

        .vozon-agent-tabs::-webkit-scrollbar {
          display: none;
        }

        .vozon-agent-tab {
          min-width: max-content;
          flex: 1;
          padding: 0.9rem 1.2rem;
          border-radius: 0.65rem;
          color: rgba(255,255,255,0.52);
          font-size: 0.9rem;
          font-weight: 800;
          transition: background 180ms ease, color 180ms ease, box-shadow 180ms ease;
        }

        .vozon-agent-tab:hover,
        .vozon-agent-tab.is-active {
          background: rgba(69,221,206,0.2);
          color: #9dfff4;
          box-shadow: inset 0 0 0 1px rgba(117,255,240,0.14);
        }

        .vozon-agent-card {
          min-height: 230px;
          border: 1px solid rgba(117,255,240,0.15);
          border-radius: 1rem;
          background:
            radial-gradient(circle at 100% 0%, rgba(69,221,206,0.08), transparent 34%),
            rgba(2,10,12,0.8);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.018);
          transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
        }

        .vozon-agent-card:hover {
          border-color: rgba(117,255,240,0.32);
          transform: translateY(-3px);
          box-shadow: inset 0 0 0 1px rgba(117,255,240,0.04), 0 18px 44px rgba(0,0,0,0.2);
        }

        .vozon-agent-card-status {
          background: #45ddce;
          box-shadow: 0 0 14px rgba(69,221,206,0.8);
        }

        .vozon-agent-play-button,
        .vozon-agent-clone-button {
          display: inline-flex;
          min-height: 2.6rem;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          padding: 0.65rem 1rem;
          border-radius: 0.6rem;
          font-size: 0.82rem;
          font-weight: 900;
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .vozon-agent-play-button {
          background: #75d4df;
          color: #031315;
          box-shadow: 0 8px 20px rgba(117,212,223,0.16);
        }

        .vozon-agent-clone-button {
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: #fff;
        }

        .vozon-agent-play-button:hover,
        .vozon-agent-clone-button:hover {
          transform: translateY(-2px);
        }

        .vozon-agent-play-button:hover {
          box-shadow: 0 12px 24px rgba(117,212,223,0.27);
        }

        .vozon-agent-clone-button:hover {
          background: rgba(255,255,255,0.13);
        }

        .vozon-fit-section {
          background: transparent;
        }

        .vozon-fit-compact-tab {
          display: flex;
          min-height: 3.8rem;
          align-items: center;
          gap: 0.9rem;
          padding: 0.75rem 0.9rem;
          border: 1px solid transparent;
          border-radius: 0.8rem;
          color: rgba(255,255,255,0.55);
          font-size: 0.95rem;
          font-weight: 800;
          line-height: 1.3;
          transition: border-color 180ms ease, background 180ms ease, color 180ms ease;
        }

        .vozon-fit-compact-tab:hover,
        .vozon-fit-compact-tab.is-active {
          border-color: rgba(69,221,206,0.3);
          background: rgba(69,221,206,0.07);
          color: #fff;
        }

        .vozon-fit-compact-number {
          display: grid;
          width: 2rem;
          height: 2rem;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid rgba(69,221,206,0.28);
          border-radius: 0.55rem;
          color: #75fff0;
          font-size: 0.65rem;
          font-weight: 900;
        }

        .vozon-fit-mobile-item {
          border: 1px solid rgba(69,221,206,0.18);
          border-radius: 0.9rem;
          background: rgba(255,255,255,0.02);
        }

        .vozon-fit-compact-tab.is-active .vozon-fit-compact-number {
          background: #45ddce;
          color: #031411;
          box-shadow: 0 0 18px rgba(69,221,206,0.24);
        }

        .vozon-fit-compact-image {
          border: 1px solid rgba(69,221,206,0.18);
          border-radius: 1rem;
          background: #071512;
          box-shadow: 0 24px 70px rgba(0,0,0,0.24);
        }

        .vozon-fit-compact-image::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(to top, rgba(2,10,8,0.78), transparent 48%);
        }

        .vozon-fit-compact-image-label {
          position: absolute;
          z-index: 1;
          right: 1.5rem;
          bottom: 1.5rem;
          left: 1.5rem;
        }

        .vozon-fit-compact-image-label span,
        .vozon-fit-compact-image-label strong {
          display: block;
        }

        .vozon-fit-compact-image-label span {
          color: #75fff0;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .vozon-fit-compact-image-label strong {
          margin-top: 0.35rem;
          color: #fff;
          font-size: 1.35rem;
          line-height: 1.2;
        }

        .vozon-fit-panel {
          position: relative;
          overflow: hidden;
            border: 1px solid rgba(69,221,206,0.18);
          border-radius: 20px;
          background:
            radial-gradient(circle at 85% 88%, rgba(242,141,69,0.2), transparent 30%),
            linear-gradient(145deg, rgba(69,221,206,0.08), transparent 42%),
            #071512;
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.025),
            0 26px 90px rgba(0,0,0,0.28);
        }

        // .vozon-fit-panel::before {
        //   content: "";
        //   position: absolute;
        //   top: 0;
        //   right: 8%;
        //   left: 8%;
        //   height: 1px;
        //   background: linear-gradient(90deg, transparent, rgba(117,255,240,0.7), transparent);
        // }

        // .vozon-fit-tabs,
        // .vozon-fit-content {
        //   position: relative;
        //   z-index: 1;
        // }

        // .vozon-fit-tabs {
        //   display: grid;
        //   grid-template-columns: repeat(5, minmax(0, 1fr));
        //   gap: 0.45rem;
        //   padding: 0.5rem;
        //   border-bottom: 1px solid rgba(255,255,255,0.08);
        //   background: rgba(0,5,3,0.35);
        // }

        .vozon-fit-tab {
          position: relative;
          min-height: 7.75rem;
          padding: 0.85rem 0.9rem 0.85rem 4rem;
          border: 1px solid transparent;
          border-radius: 0.9rem;
          color: rgba(255,255,255,0.62);
          transition: border-color 180ms ease, background 180ms ease, color 180ms ease;
        }

        .vozon-fit-tab-tone-2 { --vozon-fit-tab-accent: 143, 131, 232; }
        .vozon-fit-tab-tone-3 { --vozon-fit-tab-accent: 71, 170, 255; }
        .vozon-fit-tab-tone-4 { --vozon-fit-tab-accent: 242, 141, 69; }
        .vozon-fit-tab-tone-5 { --vozon-fit-tab-accent: 242, 210, 75; }

        .vozon-fit-tab::after {
          content: "";
          position: absolute;
          right: 0.75rem;
          bottom: 0;
          left: 0.75rem;
          height: 2px;
          border-radius: 999px;
          background: rgb(var(--vozon-fit-tab-accent));
          opacity: 0.3;
          transition: opacity 180ms ease, box-shadow 180ms ease;
        }

        .vozon-fit-tab:hover , 
        .vozon-fit-tab-active {
          color: #fff;
          border-color: rgba(69,221,206,0.38);
          background: rgba(69,221,206,0.055);
          box-shadow: inset 0 0 0 5px rgba(69,221,206,0.025);
        }

        .vozon-fit-tab-icon {
          position: absolute;
          top: 0.85rem;
          left: 0.9rem;
          width: 2.2rem;
          height: 2.2rem;
          place-items: center;
          border: 1px solid rgba(69,221,206,0.38);
          border-radius: 0.7rem;
          background: rgba(69,221,206,0.08);
          color: #75fff0;
          font-size: 0.65rem;
            font-weight: 900;
          transition: background 180ms ease, box-shadow 180ms ease;
        }

        // .vozon-fit-tab-label {
        //   min-width: 0;
        //   font-size: 0.92rem;
        //   line-height: 1.3;
        // }

        // .vozon-fit-tab-active {
        //   background:
        //     linear-gradient(110deg, rgba(var(--vozon-fit-tab-accent), 0.16), rgba(var(--vozon-fit-tab-accent), 0.055)),
        //     rgba(255,255,255,0.035);
        //   border-color: rgba(var(--vozon-fit-tab-accent), 0.3);
        //   box-shadow: inset 0 0 32px rgba(var(--vozon-fit-tab-accent), 0.055);
        // }

        // .vozon-fit-tab-active::after {
        //   opacity: 1;
        //   box-shadow: 0 0 12px rgba(var(--vozon-fit-tab-accent), 0.52);
        // }

       .vozon-fit-tab-active .vozon-fit-tab-icon {
          background: #45ddce;
          color: #02110d;
          box-shadow: 0 0 22px rgba(69,221,206,0.22);
        }

        // .vozon-fit-content {
        //   border-right: 1px solid rgba(255,255,255,0.08);
        //   border-top: 2px solid rgba(var(--vozon-fit-accent), 0.68);
        //   background:
        //     radial-gradient(circle at 12% 0%, rgba(var(--vozon-fit-accent), 0.1), transparent 34%),
        //     linear-gradient(150deg, rgba(255,255,255,0.035), rgba(255,255,255,0.008)),
        //     rgba(2,12,10,0.34);
        //   transition: background 180ms ease, box-shadow 180ms ease;
        // }

         .vozon-fit-tab-label,
        .vozon-fit-tab-description {
          display: block;
        }

        .vozon-fit-content-grid {
          --vozon-fit-accent: 69, 221, 206;
          background: rgba(0,5,3,0.12);
        }

        // .vozon-fit-theme-2 { --vozon-fit-accent: 143, 131, 232; }
        // .vozon-fit-theme-3 { --vozon-fit-accent: 71, 170, 255; }
        // .vozon-fit-theme-4 { --vozon-fit-accent: 242, 141, 69; }
        // .vozon-fit-theme-5 { --vozon-fit-accent: 242, 210, 75; }

        // .vozon-fit-content:last-child {
        //   border-right: 0;
        // }

        // .vozon-fit-content:hover {
        //   background:
        //     radial-gradient(circle at 12% 0%, rgba(var(--vozon-fit-accent), 0.16), transparent 38%),
        //     linear-gradient(150deg, rgba(var(--vozon-fit-accent), 0.07), rgba(255,255,255,0.012)),
        //     rgba(2,12,10,0.48);
        //   box-shadow: inset 0 1px 0 rgba(var(--vozon-fit-accent), 0.18);
        // }

        .vozon-fit-panel-top {
          background: linear-gradient(110deg, #45ddce, #27ab9f);
          color: #031411;
        }

          .vozon-fit-tab-description {
          margin-top: 0.6rem;
          color: rgba(255,255,255,0.5);
          font-size: 0.87rem;
          line-height: 1.65;
        }

        // .vozon-fit-index {
        //   border: 1px solid rgba(var(--vozon-fit-accent), 0.34);
        //   background: rgba(var(--vozon-fit-accent), 0.1);
        //   color: rgb(var(--vozon-fit-accent));
        //   box-shadow: inset 0 0 18px rgba(var(--vozon-fit-accent), 0.05);
        // }

        .vozon-fit-panel-body {
          background: rgba(5,20,18,0.88);
        }

        .vozon-fit-workflow-row {
          border: 1px solid rgba(117,255,240,0.13);
          border-radius: 0.55rem;
          background: rgba(255,255,255,0.025);
        }

        // .vozon-fit-kicker {
        //   color: rgba(var(--vozon-fit-accent), 0.82);
        // }

        .vozon-company-marquee-section {
          background: transparent;
        }

        .vozon-company-marquee {
          mask-image: linear-gradient(90deg, transparent 0%, black 9%, black 91%, transparent 100%);
        }

        .vozon-company-marquee::before {
          content: none;
        }

        @media (min-width: 721px) and (max-width: 1024px) {
          .vozon-fit-tabs {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .vozon-platform-map {
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          mask-image: linear-gradient(to bottom, transparent 0%, black 7%, black 91%, transparent 100%);
        }

        .vozon-company-track {
          animation: vozonCompanyMarquee 36s linear infinite;
        }

        .vozon-company-logo {
          opacity: 0.84;
          transition: opacity 180ms ease, transform 180ms ease;
        }

        .vozon-company-logo-image {
          filter: saturate(0.9) brightness(0.88);
          opacity: 0.72;
        }

        .vozon-company-name {
          background: linear-gradient(90deg, rgba(255,255,255,0.72), rgba(117,255,240,0.62), rgba(255,178,52,0.48));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          opacity: 0.78;
          text-shadow: 0 0 18px rgba(69,221,206,0.08);
        }

        .vozon-company-logo:hover {
          opacity: 1;
          transform: translateY(-2px);
        }

        .vozon-company-logo:hover .vozon-company-logo-image {
          filter: saturate(1.15) brightness(1);
          opacity: 0.92;
        }

        .vozon-company-logo:hover .vozon-company-name {
          opacity: 0.95;
        }

        .vozon-glow-button {
          background: linear-gradient(135deg, #1acfff 0%, #20f4d0 48%, #48db8b 100%);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.28), 0 16px 38px rgba(31,244,208,0.22);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .vozon-glow-button:hover,
        .vozon-small-button:hover {
          transform: translateY(-2px);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.34), 0 20px 46px rgba(31,244,208,0.28);
        }

        .vozon-small-button {
          background: linear-gradient(135deg, rgba(11,109,132,0.82), rgba(29,244,203,0.22), rgba(43,219,141,0.7));
          box-shadow: inset 0 0 0 1px rgba(54,255,222,0.24), 0 14px 34px rgba(29,244,203,0.12);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .vozon-card {
          position: relative;
          overflow: hidden;
        }

        .vozon-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(135deg, rgba(37,244,210,0.14), transparent 32%),
            repeating-linear-gradient(135deg, transparent 0 14px, rgba(37,244,210,0.08) 15px 16px, transparent 17px 30px);
          mask-image: linear-gradient(135deg, transparent 0%, black 65%, transparent 100%);
          opacity: 0.48;
        }

        .vozon-card > * {
          position: relative;
          z-index: 1;
        }

        .vozon-language-section {
          background: transparent;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 700ms cubic-bezier(.22,1,.36,1), transform 700ms cubic-bezier(.22,1,.36,1);
        }

        .vozon-language-section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .vozon-india-voice-grid {
          background: transparent;
        }

        .vozon-india-voice-grid::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.34;
          background-image:
            radial-gradient(circle, rgba(54,246,134,0.7) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(41,203,255,0.58) 0 1px, transparent 1.4px);
          background-position: 20% 63%, 45% 54%;
          background-size: 79px 73px, 113px 97px;
          mask-image: linear-gradient(90deg, transparent, black 16%, black 66%, transparent 78%);
          animation: vozonIndiaParticles 18s linear infinite;
        }

        .vozon-india-showcase {
          background: radial-gradient(ellipse at 36% 52%, rgba(27,238,114,0.055), transparent 52%);
        }

        .vozon-language-center-title {
          white-space: nowrap;
          font-size: clamp(0.85rem, 3.5vw, 2.8rem);
          font-weight: 850;
          line-height: 1.04;
          letter-spacing: -0.055em;
          color: #ffffff;
        }

        .vozon-language-center-title span {
          color: inherit;
        }

        .vozon-language-poster img {
          filter: saturate(0.92) contrast(1.03);
          mask-image: radial-gradient(ellipse at center, black 44%, transparent 83%);
        }

        .vozon-language-poster::after {
          content: "";
          position: absolute;
          inset: 15% 8%;
          pointer-events: none;
          border-radius: 50%;
          box-shadow: 0 0 90px rgba(30,235,128,0.075);
        }

        .vozon-live-language-demo::before {
          content: "";
          position: absolute;
          inset: 6% 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 22% 50%, rgba(46,235,128,0.1), transparent 28%),
            radial-gradient(circle at 72% 50%, rgba(31,210,201,0.055), transparent 34%);
          filter: blur(12px);
        }

        .vozon-story-rail {
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255,255,255,0.055);
          border-radius: 16px;
          background: rgba(255,255,255,0.018);
          box-shadow: inset 0 1px rgba(255,255,255,0.025);
        }

        .vozon-overview-button {
          border-color: rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.025);
          color: rgba(255,255,255,0.38);
          transition: border-color 180ms ease, background 180ms ease, color 180ms ease, transform 180ms ease;
        }

        .vozon-overview-button:hover {
          border-color: rgba(95,246,165,0.24);
          background: rgba(55,225,135,0.055);
          color: rgba(126,255,190,0.78);
          transform: translateX(-2px);
        }

        .vozon-story-step {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 0.55rem;
        }

        .vozon-story-step span {
          display: grid;
          width: 1.55rem;
          height: 1.55rem;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          color: rgba(255,255,255,0.3);
          font-size: 8px;
          font-weight: 900;
        }

        .vozon-story-step strong {
          overflow: hidden;
          color: rgba(255,255,255,0.44);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .vozon-story-step.is-active span {
          border-color: rgba(83,246,157,0.3);
          color: #78f7ae;
          background: rgba(52,226,134,0.07);
          box-shadow: 0 0 14px rgba(52,236,139,0.09);
        }

        .vozon-story-step.is-active strong {
          color: rgba(124,255,192,0.76);
        }

        .vozon-story-arrow {
          color: rgba(92,248,166,0.24);
          font-size: 12px;
          font-style: normal;
        }

        .vozon-microphone-stage {
          color: #78ffc0;
          outline: none;
        }

        .vozon-mic-pulse {
          border: 1px solid rgba(82,246,156,0.12);
          background: radial-gradient(circle, rgba(43,221,125,0.075), transparent 66%);
          box-shadow: inset 0 0 38px rgba(42,236,132,0.025);
        }

        .vozon-mic-pulse-two {
          border-style: dashed;
          animation: vozonBotRadar 18s linear infinite;
        }

        .vozon-mic-orbit-label {
          z-index: 3;
          padding: 0.28rem 0.48rem;
          border: 1px solid rgba(105,255,184,0.16);
          border-radius: 999px;
          background: rgba(3,25,15,0.84);
          color: rgba(125,255,191,0.58);
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.12em;
          line-height: 1;
          text-transform: uppercase;
          box-shadow: 0 0 14px rgba(65,238,143,0.055);
          backdrop-filter: blur(8px);
        }

        .vozon-mic-label-top {
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
        }

        .vozon-mic-label-right {
          top: 50%;
          right: -2px;
          transform: translateY(-50%);
        }

        .vozon-mic-label-left {
          top: 50%;
          left: 5px;
          transform: translateY(-50%);
        }

        .vozon-mic-core {
          border-color: rgba(104,255,183,0.46);
          background:
            radial-gradient(circle at 38% 28%, rgba(133,255,202,0.16), transparent 28%),
            linear-gradient(145deg, rgba(11,81,48,0.92), rgba(2,25,16,0.98));
          box-shadow:
            inset 0 0 30px rgba(91,255,174,0.08),
            0 0 30px rgba(51,235,134,0.18),
            0 18px 40px rgba(0,0,0,0.42);
          transition: transform 200ms ease, box-shadow 200ms ease;
        }

        .vozon-mic-core svg {
          stroke: currentColor;
          stroke-width: 2.6;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 0 7px rgba(94,255,175,0.52));
        }

        .vozon-mic-detail {
          opacity: 0.4;
          stroke-width: 1.4;
        }

        .vozon-mic-energy {
          padding-inline: 0.55rem;
          border: 1px solid rgba(107,255,185,0.2);
          border-radius: 999px;
          background: rgba(2,24,14,0.92);
          box-shadow: 0 0 16px rgba(62,238,143,0.11);
        }

        .vozon-mic-energy i,
        .vozon-voice-signature i {
          display: block;
          width: 2px;
          border-radius: 99px;
          background: linear-gradient(180deg, #8affca, #36dc86);
          opacity: 0.62;
          transform-origin: center;
        }

        .vozon-microphone-stage.is-speaking .vozon-mic-energy i,
        .vozon-live-language-demo.is-speaking .vozon-voice-signature i {
          animation: vozonIndiaWave 0.66s ease-in-out infinite alternate;
        }

        .vozon-mic-caption {
          color: rgba(114,255,184,0.56);
        }

        .vozon-microphone-stage:hover .vozon-mic-core {
          transform: scale(1.045);
          box-shadow: inset 0 0 34px rgba(91,255,174,0.11), 0 0 42px rgba(51,235,134,0.25), 0 20px 44px rgba(0,0,0,0.46);
        }

        .vozon-microphone-stage.is-speaking .vozon-mic-pulse-one {
          animation: vozonMicPulse 1.7s ease-out infinite;
        }

        .vozon-microphone-stage.is-speaking .vozon-mic-core {
          animation: vozonMicCore 1.05s ease-in-out infinite;
        }

        .vozon-hero-wave-bridge {
          pointer-events: none;
          opacity: 0.72;
          mask-image: linear-gradient(90deg, transparent 0, black 8%, black 87%, transparent 100%);
        }

        .vozon-hero-wave-bridge svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .vozon-hero-wave-bridge path {
          fill: none;
          vector-effect: non-scaling-stroke;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .vozon-hero-wave-soft {
          stroke: url(#vozonHeroSignal);
          stroke-width: 1;
          opacity: 0.2;
        }

        .vozon-hero-wave-main {
          stroke: url(#vozonHeroSignal);
          stroke-width: 2;
          opacity: 0.88;
          filter: url(#vozonHeroGlow);
          stroke-dasharray: 10 6;
        }

        .vozon-live-language-demo.is-speaking .vozon-hero-wave-main {
          animation: vozonHeroSignalFlow 2.3s linear infinite;
        }

        .vozon-live-conversation-card {
          border-color: rgba(107,255,187,0.12);
          background:
            radial-gradient(circle at 100% 100%, rgba(36,219,124,0.065), transparent 34%),
            linear-gradient(145deg, rgba(8,28,21,0.9), rgba(2,10,8,0.94));
          box-shadow: inset 0 1px rgba(255,255,255,0.045), 0 28px 68px rgba(0,0,0,0.42), 0 0 46px rgba(41,229,132,0.035);
          backdrop-filter: blur(20px);
        }

        .vozon-conversation-row {
          background: rgba(255,255,255,0.012);
        }

        .vozon-ai-response-row {
          background: linear-gradient(90deg, rgba(50,221,129,0.055), rgba(50,221,129,0.012));
        }

        .vozon-processing-strip {
          background: rgba(48,221,128,0.025);
        }

        .vozon-voice-signature {
          opacity: 0.72;
        }

        .vozon-processing-wave i {
          display: block;
          width: 2px;
          border-radius: 99px;
          background: linear-gradient(180deg, #78ffc0, #31dc82);
          opacity: 0.48;
          transform: scaleY(0.5);
          transform-origin: center;
        }

        .vozon-live-language-demo.is-speaking .vozon-processing-wave i {
          animation: vozonIndiaWave 0.68s ease-in-out infinite alternate;
        }

        .vozon-intent-chip {
          border: 1px solid rgba(94,247,167,0.12);
          background: rgba(52,224,134,0.05);
          color: rgba(120,255,184,0.52);
        }

        .vozon-response-meta {
          display: inline-flex;
          align-items: center;
          min-height: 1.35rem;
          padding-inline: 0.48rem;
          border: 1px solid rgba(112,255,187,0.1);
          border-radius: 999px;
          background: rgba(70,238,148,0.035);
          color: rgba(128,255,195,0.42);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .vozon-avatar-kicker {
          border-color: rgba(117,255,208,0.18);
          background: rgba(54,238,129,0.045);
          color: rgba(131,255,213,0.72);
          box-shadow: inset 0 1px rgba(255,255,255,0.035);
        }

        .vozon-avatar-stage {
          filter: drop-shadow(0 20px 34px rgba(0,0,0,0.42));
        }

        .vozon-avatar-orbit {
          border: 1px solid rgba(93,255,171,0.12);
          background: radial-gradient(circle, rgba(55,235,125,0.07), transparent 62%);
          box-shadow: inset 0 0 38px rgba(50,238,119,0.025);
        }

        .vozon-avatar-orbit::before,
        .vozon-avatar-orbit::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          background: #72ffc0;
          box-shadow: 0 0 12px #55f59f;
        }

        .vozon-avatar-orbit::before {
          top: 20%;
          right: 8%;
          width: 4px;
          height: 4px;
        }

        .vozon-avatar-orbit::after {
          bottom: 13%;
          left: 17%;
          width: 3px;
          height: 3px;
          opacity: 0.55;
        }

        .vozon-avatar-orbit-inner {
          border-style: dashed;
          animation: vozonBotRadar 22s linear infinite;
        }

        .vozon-conversation-flow {
          overflow: hidden;
          padding: 1.25rem;
          border: 1px solid rgba(255,255,255,0.065);
          border-radius: 24px;
          background:
            radial-gradient(circle at 92% 82%, rgba(43,232,143,0.065), transparent 26%),
            linear-gradient(145deg, rgba(8,24,19,0.62), rgba(2,8,7,0.38));
          box-shadow: inset 0 1px rgba(255,255,255,0.04), 0 24px 58px rgba(0,0,0,0.28);
          backdrop-filter: blur(16px);
        }

        .vozon-conversation-flow::before {
          content: "";
          position: absolute;
          top: 0;
          left: 12%;
          width: 76%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(104,255,192,0.48), transparent);
          box-shadow: 0 0 14px rgba(83,245,168,0.34);
        }

        .vozon-conversation-flow::after {
          content: "";
          position: absolute;
          top: -55px;
          right: -55px;
          width: 120px;
          height: 120px;
          pointer-events: none;
          border: 1px solid rgba(96,255,184,0.06);
          border-radius: 50%;
          box-shadow: 0 0 0 18px rgba(96,255,184,0.018), 0 0 0 38px rgba(96,255,184,0.01);
        }

        .vozon-conversation-live {
          border-color: rgba(99,255,184,0.16);
          background: rgba(55,232,139,0.055);
          color: rgba(126,255,199,0.58);
        }

        .vozon-conversation-live i {
          background: #59f5a3;
          box-shadow: 0 0 8px #59f5a3;
          animation: vozonBotStatus 1.3s ease-in-out infinite;
        }

        .vozon-dialogue-card {
          transition: border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
        }

        .vozon-dialogue-card:hover {
          transform: translateY(-2px);
        }

        .vozon-turn-number {
          border: 1px solid rgba(255,255,255,0.1);
          background: #0b1512;
          color: rgba(255,255,255,0.38);
          box-shadow: 0 0 0 4px #020706;
        }

        .vozon-turn-number-ai {
          border-color: rgba(93,250,171,0.24);
          background: #062015;
          color: #74f7b0;
        }

        .vozon-signal-node {
          border: 1px solid rgba(76,244,150,0.18);
          background: rgba(50,219,127,0.065);
          box-shadow: 0 0 16px rgba(52,236,139,0.09);
        }

        .vozon-signal-node i {
          box-shadow: 0 0 9px #4af59a;
        }

        .vozon-mini-flow-wave i {
          display: block;
          width: 2px;
          border-radius: 99px;
          background: linear-gradient(180deg, #61ffc1, #31dca2);
          opacity: 0.5;
          transform: scaleY(0.45);
          transform-origin: center;
        }

        .vozon-live-language-demo.is-speaking .vozon-mini-flow-wave i {
          animation: vozonIndiaWave 0.7s ease-in-out infinite alternate;
        }

        .vozon-live-language-demo.is-speaking .vozon-india-reply {
          border-color: rgba(93,250,171,0.38);
          box-shadow: inset 0 1px rgba(130,255,204,0.065), 0 18px 46px rgba(0,0,0,0.34), 0 0 34px rgba(50,238,119,0.075);
        }

        .vozon-live-language-demo.is-speaking .vozon-india-reply > div:last-child i {
          animation: vozonIndiaWave 0.62s ease-in-out infinite alternate;
          transform-origin: center;
        }

        .vozon-india-title {
          display: grid;
          gap: 0.1em;
          font-size: clamp(2.15rem, 3.65vw, 3.55rem);
          font-weight: 850;
          line-height: 1.05;
          letter-spacing: -0.055em;
        }

        .vozon-india-title span:last-child {
          background: linear-gradient(90deg, #40f583, #25d2a6 72%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 18px rgba(51,238,120,0.12));
        }

        .vozon-brand-wave i {
          display: block;
          width: 2px;
          border-radius: 99px;
          background: #32ee77;
          box-shadow: 0 0 6px rgba(50,238,119,0.65);
          animation: vozonBrandWave 0.82s ease-in-out infinite alternate;
        }

        .vozon-india-bot {
          position: relative;
          z-index: 2;
          border-color: rgba(66,246,132,0.5);
          background: radial-gradient(circle, rgba(34,172,91,0.23), rgba(2,18,11,0.96) 67%);
          box-shadow:
            inset 0 0 30px rgba(50,238,119,0.1),
            0 0 28px rgba(50,238,119,0.2),
            0 0 90px rgba(50,238,119,0.11);
        }

        .vozon-india-bot::before,
        .vozon-india-bot::after {
          content: "";
          position: absolute;
          border: 1px solid rgba(50,238,119,0.12);
          border-radius: 50%;
          pointer-events: none;
        }

        .vozon-india-bot::before { inset: -23px; }
        .vozon-india-bot::after {
          inset: -48px;
          border-style: dashed;
          animation: vozonBotRadar 24s linear infinite;
        }

        .vozon-india-wave-line::before {
          content: "";
          position: absolute;
          right: 0;
          left: 0;
          height: 1px;
          background: linear-gradient(90deg, #35f17b, #3dffd4 55%, rgba(27,189,255,0.08));
          box-shadow: 0 0 12px rgba(54,246,145,0.7);
        }

        .vozon-india-wave-line span {
          z-index: 1;
          display: block;
          width: 2px;
          max-height: 70px;
          border-radius: 99px;
          background: linear-gradient(180deg, #23dfff, #4aff91 55%, #28e873);
          box-shadow: 0 0 7px rgba(50,238,119,0.65);
          transform: scaleY(0.35);
          transform-origin: center;
          opacity: 0.68;
        }

        .vozon-india-voice-stage.is-speaking .vozon-india-wave-line span,
        .vozon-live-language-demo.is-speaking .vozon-india-wave-line span {
          animation: vozonIndiaWave 0.7s ease-in-out infinite alternate;
        }

        .vozon-smooth-wave svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .vozon-smooth-wave path {
          fill: none;
          vector-effect: non-scaling-stroke;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .vozon-wave-ambient {
          stroke: url(#vozonWaveGradient);
          stroke-width: 1;
          opacity: 0.2;
        }

        .vozon-wave-main {
          stroke: url(#vozonWaveGradient);
          stroke-width: 2;
          opacity: 0.82;
          filter: url(#vozonWaveGlow);
          stroke-dasharray: 12 5;
        }

        .vozon-wave-detail {
          stroke: url(#vozonWaveGradient);
          stroke-width: 1.15;
          opacity: 0.48;
          stroke-dasharray: 4 5;
        }

        .vozon-live-language-demo.is-speaking .vozon-wave-main {
          animation: vozonSmoothWave 2.8s linear infinite;
        }

        .vozon-live-language-demo.is-speaking .vozon-wave-detail {
          animation: vozonSmoothWaveReverse 2.1s linear infinite;
        }

        .vozon-india-reply {
          z-index: 3;
          border-color: rgba(73,245,142,0.22);
          background: linear-gradient(135deg, rgba(40,215,126,0.115), rgba(2,20,14,0.76));
          box-shadow: inset 0 1px rgba(130,255,204,0.05), 0 16px 42px rgba(0,0,0,0.3), 0 0 30px rgba(50,238,119,0.045);
          backdrop-filter: blur(14px);
        }

        .vozon-india-voice-stage.is-speaking .vozon-bot-eye,
        .vozon-live-language-demo.is-speaking .vozon-bot-eye {
          animation: vozonBotEyes 2.6s ease-in-out infinite;
        }

        .vozon-india-voice-stage.is-speaking .vozon-bot-mouth,
        .vozon-live-language-demo.is-speaking .vozon-bot-mouth {
          animation: vozonBotTalk 0.48s ease-in-out infinite alternate;
        }

        .vozon-customer-dialogue {
          z-index: 3;
          border-color: rgba(255,255,255,0.09);
          background: linear-gradient(135deg, rgba(255,255,255,0.065), rgba(255,255,255,0.025));
          box-shadow: inset 0 1px rgba(255,255,255,0.045), 0 18px 48px rgba(0,0,0,0.4);
          backdrop-filter: blur(18px);
        }

        .vozon-india-talk {
          border-color: rgba(50,238,119,0.72);
          background: rgba(3,26,14,0.78);
          box-shadow: inset 0 0 24px rgba(50,238,119,0.06), 0 0 24px rgba(50,238,119,0.12);
          transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        .vozon-india-talk:hover,
        .vozon-india-talk.is-speaking {
          transform: translateY(-2px);
          background: rgba(8,55,29,0.88);
          box-shadow: inset 0 0 28px rgba(50,238,119,0.1), 0 0 34px rgba(50,238,119,0.2);
        }

        .vozon-india-stats > div + div {
          border-left: 1px solid rgba(255,255,255,0.09);
        }

        .vozon-language-library {
          background: transparent;
        }

        .vozon-language-row {
          --language-tone: #32ee77;
          border-color: color-mix(in srgb, var(--language-tone) 19%, rgba(255,255,255,0.07));
          background: linear-gradient(100deg, color-mix(in srgb, var(--language-tone) 3%, transparent), rgba(255,255,255,0.012));
          box-shadow: inset 0 1px rgba(255,255,255,0.02);
        }

        .vozon-language-row::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          background: linear-gradient(90deg, color-mix(in srgb, var(--language-tone) 14%, transparent), transparent 70%);
          transition: opacity 180ms ease;
        }

        .vozon-language-row:hover,
        .vozon-language-row.is-active {
          z-index: 2;
          border-color: color-mix(in srgb, var(--language-tone) 65%, white 5%);
          transform: translateX(-3px) scale(1.018);
          box-shadow: 0 12px 30px rgba(0,0,0,0.28), 0 0 28px color-mix(in srgb, var(--language-tone) 14%, transparent);
        }

        .vozon-language-row:hover::before,
        .vozon-language-row.is-active::before {
          opacity: 1;
        }

        .vozon-language-glyph {
          position: relative;
          z-index: 1;
          color: var(--language-tone);
          background: color-mix(in srgb, var(--language-tone) 9%, #020706);
          border: 1px solid var(--language-tone);
          border-radius: 38% 62% 58% 42% / 48% 38% 62% 52%;
          box-shadow: inset 0 0 18px color-mix(in srgb, var(--language-tone) 10%, transparent), 0 0 13px color-mix(in srgb, var(--language-tone) 10%, transparent);
          transition: transform 220ms ease;
        }

        .vozon-language-row:hover .vozon-language-glyph,
        .vozon-language-row.is-active .vozon-language-glyph {
          transform: rotate(-4deg) scale(1.04);
        }

        .vozon-row-wave i {
          display: block;
          width: 2px;
          border-radius: 99px;
          background: var(--language-tone);
          box-shadow: 0 0 5px color-mix(in srgb, var(--language-tone) 40%, transparent);
          opacity: 0.66;
          transform-origin: center;
        }

        .vozon-row-wave.is-speaking i {
          animation: vozonIndiaWave 0.64s ease-in-out infinite alternate;
        }

        .vozon-row-play {
          position: relative;
          z-index: 1;
          border-color: color-mix(in srgb, var(--language-tone) 30%, rgba(255,255,255,0.08));
          background: color-mix(in srgb, var(--language-tone) 7%, transparent);
          color: var(--language-tone);
          transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        .vozon-language-row:hover .vozon-row-play,
        .vozon-language-row.is-active .vozon-row-play {
          transform: scale(1.06);
          background: color-mix(in srgb, var(--language-tone) 15%, transparent);
          box-shadow: 0 0 16px color-mix(in srgb, var(--language-tone) 18%, transparent);
        }

        .vozon-row-play i {
          display: block;
          width: 2px;
          border-radius: 99px;
          background: currentColor;
          transform-origin: center;
          animation: vozonIndiaWave 0.58s ease-in-out infinite alternate;
        }

        .vozon-language-pill:hover {
          border-color: rgba(69,221,206,0.7);
          background: rgba(69,221,206,0.1);
          transform: translateY(-2px);
        }

        .vozon-bot-conversation {
          border-color: rgba(131,255,242,0.18);
          background:
            radial-gradient(circle at 50% 30%, rgba(51,235,167,0.13), transparent 30%),
            linear-gradient(145deg, rgba(5,25,20,0.94), rgba(1,8,7,0.98) 58%, rgba(3,20,16,0.96));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.06),
            0 28px 80px rgba(0,0,0,0.48),
            0 0 70px rgba(69,221,206,0.06);
          transition: border-color 220ms ease, box-shadow 220ms ease;
        }

        .vozon-bot-conversation::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.34;
          background-image:
            linear-gradient(rgba(131,255,242,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(131,255,242,0.035) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(circle at 50% 32%, black, transparent 68%);
        }

        .vozon-bot-conversation.is-speaking {
          border-color: rgba(131,255,242,0.44);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 28px 80px rgba(0,0,0,0.54),
            0 0 90px rgba(69,221,206,0.13);
        }

        .vozon-bot-status {
          box-shadow: 0 0 12px #75ffd0;
          animation: vozonBotStatus 1.5s ease-in-out infinite;
        }

        .vozon-bot-radar {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 210px;
          height: 210px;
          transform: translate(-50%, -50%);
        }

        .vozon-bot-radar span {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(117,255,208,0.12);
          border-radius: 50%;
        }

        .vozon-bot-radar span:nth-child(2) {
          inset: 18px;
          border-style: dashed;
          animation: vozonBotRadar 18s linear infinite;
        }

        .vozon-bot-radar span:nth-child(3) {
          inset: 38px;
          border-color: rgba(117,255,208,0.2);
        }

        .vozon-bot-avatar-glow {
          background: radial-gradient(circle, rgba(75,255,177,0.24), rgba(13,130,85,0.08) 48%, transparent 70%);
          filter: blur(5px);
          animation: vozonBotGlow 3s ease-in-out infinite;
        }

        .vozon-bot-avatar {
          border-color: rgba(131,255,213,0.44);
          background:
            radial-gradient(circle at 42% 30%, rgba(131,255,213,0.18), transparent 34%),
            linear-gradient(145deg, rgba(13,77,53,0.86), rgba(3,28,21,0.96));
          color: #83ffd5;
          box-shadow:
            inset 0 0 30px rgba(85,255,182,0.09),
            0 0 32px rgba(69,221,206,0.18);
        }

        .vozon-bot-avatar svg {
          overflow: visible;
          stroke: currentColor;
          stroke-width: 2.4;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 0 7px rgba(117,255,208,0.45));
        }

        .vozon-bot-eye {
          fill: currentColor;
          stroke: none;
          transform-origin: center;
        }

        .vozon-bot-conversation.is-speaking .vozon-bot-eye {
          animation: vozonBotEyes 2.6s ease-in-out infinite;
        }

        .vozon-bot-mouth {
          transform-origin: 48px 59px;
        }

        .vozon-bot-conversation.is-speaking .vozon-bot-mouth {
          animation: vozonBotTalk 0.48s ease-in-out infinite alternate;
        }

        .vozon-conversation-wave span {
          display: block;
          width: 3px;
          max-height: 42px;
          border-radius: 99px;
          background: linear-gradient(180deg, rgba(131,255,242,0.28), #83fff2 50%, rgba(69,221,206,0.22));
          opacity: 0.42;
          transform: scaleY(0.34);
          transform-origin: center;
          box-shadow: 0 0 7px rgba(69,221,206,0.28);
        }

        .vozon-conversation-wave.is-speaking span {
          opacity: 1;
          animation: vozonConversationWave 0.76s ease-in-out infinite alternate;
        }

        .vozon-customer-message {
          border-color: rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
        }

        .vozon-bot-message {
          border-color: rgba(131,255,213,0.2);
          background: linear-gradient(115deg, rgba(69,221,206,0.12), rgba(69,221,206,0.045));
          box-shadow: 0 12px 30px rgba(0,0,0,0.16);
        }

        .vozon-language-cta {
          background: linear-gradient(135deg, #24d8be 0%, #72f0d0 100%);
          box-shadow: 0 18px 42px rgba(36,216,190,0.24);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .vozon-language-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 52px rgba(36,216,190,0.3);
        }

        .vozon-platform-map {
          background: transparent;
        }

        .vozon-platform-map img {
          filter: none;
        }

        .vozon-operations-section {
          background:
            radial-gradient(circle at 50% 34%, rgba(26,207,255,0.09), transparent 24%),
            radial-gradient(circle at 64% 58%, rgba(72,219,139,0.07), transparent 30%),
            linear-gradient(180deg, #000 0%, #020b09 52%, #000 100%);
        }

        .vozon-operations-section::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(69,221,206,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(69,221,206,0.022) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at 50% 48%, black, transparent 72%);
        }

        .vozon-operations-viewport {
          scrollbar-width: none;
          mask-image: linear-gradient(90deg, transparent 0, black 2.5%, black 97.5%, transparent 100%);
        }

        .vozon-operations-viewport::-webkit-scrollbar {
          display: none;
        }

        .vozon-operations-map {
          padding: 24px 0 18px;
        }

        .vozon-operations-connector {
          filter: drop-shadow(0 0 8px rgba(69,221,206,0.32));
        }

        .vozon-operation-step {
          --operation-angle: 135deg;
          --operation-primary: #1acfff;
          --operation-secondary: #4f7cff;
          --operation-ink: #d8f8ff;
          --operation-glow: rgba(26,207,255,0.34);
          --operation-surface: rgba(26,207,255,0.24);
          --operation-surface-soft: rgba(79,124,255,0.18);
          z-index: 1;
          scroll-snap-align: center;
        }

        .vozon-operation-step:nth-child(2) {
          --operation-angle: 165deg;
          --operation-primary: #8f83e8;
          --operation-secondary: #c46cff;
          --operation-ink: #f0eaff;
          --operation-glow: rgba(143,131,232,0.36);
          --operation-surface: rgba(143,131,232,0.25);
          --operation-surface-soft: rgba(196,108,255,0.17);
        }

        .vozon-operation-step:nth-child(3) {
          --operation-angle: 205deg;
          --operation-primary: #f2d24b;
          --operation-secondary: #f28d45;
          --operation-ink: #fff6c7;
          --operation-glow: rgba(242,180,69,0.35);
          --operation-surface: rgba(242,210,75,0.23);
          --operation-surface-soft: rgba(242,141,69,0.17);
        }

        .vozon-operation-step:nth-child(4) {
          --operation-angle: 315deg;
          --operation-primary: #ec6f8b;
          --operation-secondary: #d958bd;
          --operation-ink: #ffe1ec;
          --operation-glow: rgba(236,111,139,0.35);
          --operation-surface: rgba(236,111,139,0.24);
          --operation-surface-soft: rgba(217,88,189,0.17);
        }

        .vozon-operation-step:nth-child(5) {
          --operation-angle: 35deg;
          --operation-primary: #48db8b;
          --operation-secondary: #9be15d;
          --operation-ink: #dcffe9;
          --operation-glow: rgba(72,219,139,0.34);
          --operation-surface: rgba(72,219,139,0.23);
          --operation-surface-soft: rgba(155,225,93,0.16);
        }

        .vozon-operation-step:nth-child(6) {
          --operation-angle: 105deg;
          --operation-primary: #2be3e1;
          --operation-secondary: #45bde8;
          --operation-ink: #d5ffff;
          --operation-glow: rgba(43,227,225,0.34);
          --operation-surface: rgba(43,227,225,0.23);
          --operation-surface-soft: rgba(69,189,232,0.17);
        }

        .vozon-operation-step-lower {
          padding-top: 40px;
        }

        .vozon-operation-hex {
          clip-path: polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%);
          background: linear-gradient(
            var(--operation-angle),
            var(--operation-primary),
            var(--operation-secondary)
          );
          filter: drop-shadow(0 0 17px var(--operation-glow));
          transition: filter 180ms ease, transform 180ms ease;
        }

        .vozon-operation-hex::before {
          content: "";
          position: absolute;
          inset: 7px;
          z-index: 1;
          clip-path: inherit;
          border: 1px solid color-mix(in srgb, var(--operation-primary) 40%, transparent);
          background: transparent;
        }

        .vozon-operation-hex-inner {
          clip-path: inherit;
          background:
            radial-gradient(circle at 18% 18%, var(--operation-surface), transparent 46%),
            radial-gradient(circle at 84% 82%, var(--operation-surface-soft), transparent 48%),
            linear-gradient(145deg, rgba(10,20,25,0.98), rgba(2,8,12,0.99));
        }

        .vozon-operation-hex svg {
          position: relative;
          z-index: 2;
          width: 39px;
          height: 39px;
          fill: none;
          stroke: var(--operation-ink);
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.7;
          filter: drop-shadow(0 0 7px var(--operation-glow));
        }

        .vozon-operation-number {
          z-index: 3;
          border-color: color-mix(in srgb, var(--operation-primary) 52%, transparent);
          background: color-mix(in srgb, var(--operation-primary) 14%, #061017);
          color: var(--operation-ink);
          box-shadow: 0 0 16px var(--operation-glow);
        }

        .vozon-operation-stem {
          background: linear-gradient(to bottom, var(--operation-primary), transparent);
        }

        .vozon-operation-dot {
          background: var(--operation-primary);
          box-shadow:
            0 0 0 4px color-mix(in srgb, var(--operation-primary) 12%, transparent),
            0 0 18px var(--operation-glow);
        }

        .vozon-operation-step:hover .vozon-operation-hex {
          transform: translateY(-4px);
          filter: drop-shadow(0 0 22px var(--operation-glow));
        }

        @media (min-width: 1200px) {
          .vozon-operations-scroll-hint {
            display: none;
          }
        }

        .vozon-infinite-panel {
          background:
            linear-gradient(135deg, rgba(255,255,255,0.06), transparent 32%),
            linear-gradient(160deg, rgba(69,221,206,0.08), rgba(242,141,69,0.045) 46%, rgba(143,131,232,0.08)),
            rgba(3,19,15,0.9);
        }

        .vozon-infinite-panel::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          pointer-events: none;
          background:
            radial-gradient(circle at 16% 20%, rgba(114,255,240,0.12), transparent 24%),
            radial-gradient(circle at 88% 12%, rgba(242,210,75,0.11), transparent 26%),
            linear-gradient(145deg, rgba(31,244,208,0.08), transparent 52%);
          opacity: 0.86;
        }

        .vozon-command-panel {
          background:
            radial-gradient(circle at 50% 38%, rgba(37,244,210,0.22), transparent 31%),
            radial-gradient(circle at 48% 74%, rgba(37,244,210,0.18), transparent 28%),
            radial-gradient(circle at 12% 16%, rgba(39,214,255,0.09), transparent 28%),
            radial-gradient(circle at 88% 18%, rgba(72,219,139,0.1), transparent 28%),
            linear-gradient(180deg, rgba(72,219,139,0.05), transparent 42%),
            linear-gradient(180deg, #010b0a 0%, #020d0b 100%);
          box-shadow:
            inset 0 0 0 1px rgba(95,255,237,0.04),
            inset 0 0 92px rgba(37,244,210,0.06),
            0 28px 120px rgba(29,244,203,0.15);
        }

        .vozon-command-room {
          background:
            radial-gradient(ellipse at 50% 98%, rgba(46,255,224,0.26), transparent 43%),
            radial-gradient(ellipse at 50% 17%, rgba(22,201,189,0.16), transparent 42%),
            linear-gradient(90deg, rgba(37,244,210,0.11), transparent 19%, transparent 81%, rgba(37,244,210,0.11)),
            linear-gradient(rgba(67,255,225,0.038) 1px, transparent 1px),
            linear-gradient(90deg, rgba(67,255,225,0.032) 1px, transparent 1px);
          background-size: auto, auto, auto, 58px 58px, 58px 58px;
          mask-image: linear-gradient(to bottom, black 0%, black 72%, transparent 100%);
        }

        .vozon-command-aurora {
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 42%, rgba(123,255,244,0.22), transparent 23%),
            radial-gradient(circle at 50% 56%, rgba(37,244,210,0.12), transparent 30%),
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.08) 58%, rgba(0,0,0,0.48) 100%);
          mix-blend-mode: screen;
          opacity: 0.76;
        }

        .vozon-command-dashboard {
          position: absolute;
          z-index: 2;
          display: grid;
          gap: 0.5rem;
          min-height: 84px;
          padding: 0.9rem;
          border: 1px solid rgba(37,244,210,0.28);
          border-radius: 10px;
          background:
            linear-gradient(135deg, rgba(37,244,210,0.14), transparent 48%),
            linear-gradient(rgba(37,244,210,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,244,210,0.035) 1px, transparent 1px),
            rgba(3,25,22,0.58);
          background-size: auto, 100% 24px, auto;
          box-shadow:
            inset 0 0 28px rgba(37,244,210,0.075),
            0 0 22px rgba(37,244,210,0.07),
            0 14px 34px rgba(0,0,0,0.18);
          opacity: 0.64;
          backdrop-filter: blur(10px);
        }

        .vozon-command-dashboard i {
          display: block;
          width: 22px;
          height: 3px;
          border-radius: 999px;
          background: rgba(114,255,240,0.56);
          box-shadow: 0 0 12px rgba(114,255,240,0.34);
        }

        .vozon-command-dashboard i:nth-child(2) {
          width: 7px;
          height: 7px;
          background: #5effeb;
        }

        .vozon-command-dashboard span {
          display: block;
          height: 6px;
          align-self: end;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(37,244,210,0.8), rgba(242,210,75,0.34));
          box-shadow: 0 0 12px rgba(37,244,210,0.24);
        }

        .vozon-command-bars {
          display: flex;
          align-items: end;
          justify-content: center;
          gap: 0.42rem;
          min-height: 62px;
        }

        .vozon-command-bars span {
          min-width: 8px;
          border-radius: 999px 999px 3px 3px;
          background: linear-gradient(180deg, #6ffff0, rgba(37,244,210,0.64) 62%, rgba(242,141,69,0.42));
          box-shadow: 0 0 16px rgba(95,255,237,0.35);
        }

        .vozon-command-room::before,
        .vozon-command-room::after {
          content: "";
          position: absolute;
          bottom: 108px;
          width: 42%;
          height: 305px;
          border: 1px solid rgba(37,244,210,0.16);
          background:
            linear-gradient(rgba(37,244,210,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,244,210,0.05) 1px, transparent 1px),
            rgba(3,25,22,0.38);
          background-size: 100% 34px, 42px 100%, auto;
          box-shadow: inset 0 0 34px rgba(37,244,210,0.04);
          opacity: 0.36;
        }

        .vozon-command-room::before {
          left: -4%;
          transform: perspective(500px) rotateY(16deg);
          border-radius: 0 18px 18px 0;
        }

        .vozon-command-room::after {
          right: -4%;
          transform: perspective(500px) rotateY(-16deg);
          border-radius: 18px 0 0 18px;
        }

        .vozon-holo-screen {
          box-shadow:
            inset 0 0 22px rgba(37,244,210,0.04),
            0 10px 26px rgba(0,0,0,0.16);
        }

        .vozon-infinite-orbit {
          animation: vozonInfiniteOrbit 42s linear infinite;
          box-shadow:
            0 0 42px rgba(37,244,210,0.12),
            inset 0 0 48px rgba(37,244,210,0.08);
        }

        .vozon-infinite-orbit::before,
        .vozon-infinite-orbit::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          background: #77fff1;
          box-shadow: 0 0 20px rgba(119,255,241,0.9);
        }

        .vozon-infinite-orbit::before {
          left: 18%;
          top: 12%;
          width: 8px;
          height: 8px;
        }

        .vozon-infinite-orbit::after {
          right: 19%;
          bottom: 11%;
          width: 6px;
          height: 6px;
          opacity: 0.76;
        }

        .vozon-code-ai-sphere {
          animation: vozonInfiniteFloat 7s ease-in-out infinite;
          overflow: hidden;
          background:
            radial-gradient(circle at 44% 32%, rgba(255,255,255,0.38), transparent 16%),
            radial-gradient(circle at 50% 48%, rgba(126,255,245,0.42), rgba(37,244,210,0.2) 38%, rgba(4,27,24,0.88) 67%, rgba(0,8,6,0.98) 100%);
          backdrop-filter: blur(10px);
        }

        .vozon-code-ai-sphere::before,
        .vozon-code-ai-sphere::after {
          content: "";
          position: absolute;
          inset: -6%;
          border-radius: inherit;
          pointer-events: none;
        }

        .vozon-code-ai-sphere::before {
          background:
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22), transparent 17%),
            radial-gradient(circle at 50% 50%, transparent 41%, rgba(95,255,237,0.56) 44%, transparent 48%),
            radial-gradient(circle at 50% 50%, transparent 66%, rgba(95,255,237,0.72) 69%, transparent 73%);
          filter: drop-shadow(0 0 42px rgba(95,255,237,0.84));
        }

        .vozon-code-ai-sphere::after {
          border: 1px solid rgba(95,255,237,0.2);
          box-shadow:
            inset 0 0 52px rgba(95,255,237,0.2),
            0 0 76px rgba(37,244,210,0.34);
        }

        .vozon-code-ai-rotate {
          animation: vozonReferenceAiMotion 22s linear infinite;
          background:
            conic-gradient(from 0deg, transparent 0deg, rgba(108,255,241,0.72) 18deg, transparent 54deg, transparent 142deg, rgba(36,244,208,0.5) 168deg, transparent 212deg, transparent 360deg);
          opacity: 0.66;
          mix-blend-mode: screen;
          mask-image: radial-gradient(circle, transparent 52%, black 57%, black 70%, transparent 74%);
        }

        .vozon-code-ai-particles {
          background-image:
            radial-gradient(circle, rgba(172,255,248,0.82) 0 1.15px, transparent 1.7px),
            radial-gradient(circle, rgba(53,244,215,0.42) 0 0.9px, transparent 1.6px);
          background-position: 0 0, 18px 12px;
          background-size: 42px 42px, 58px 58px;
          mask-image: radial-gradient(circle, black 0%, black 68%, transparent 78%);
          opacity: 0.3;
          animation: vozonAiParticles 12s linear infinite;
        }

        .vozon-code-ai-network {
          filter: drop-shadow(0 0 14px rgba(111,255,240,0.64));
          mask-image: radial-gradient(circle, black 0%, black 72%, transparent 84%);
        }

        .vozon-command-node {
          animation: vozonCommandNodeFloat 7.4s ease-in-out infinite;
          background:
            radial-gradient(circle at 50% 34%, rgba(205,255,252,0.3), transparent 34%),
            linear-gradient(180deg, rgba(16,87,74,0.92), rgba(4,31,26,0.94));
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.2),
            inset 0 0 22px rgba(114,255,240,0.13),
            0 0 30px rgba(37,244,210,0.42),
            0 0 62px rgba(37,244,210,0.16);
          backdrop-filter: blur(8px);
        }

        .vozon-command-node:nth-of-type(2) {
          animation-delay: -0.9s;
        }

        .vozon-command-node:nth-of-type(3) {
          animation-delay: -1.8s;
        }

        .vozon-command-node:nth-of-type(4) {
          animation-delay: -2.7s;
        }

        .vozon-command-node:nth-of-type(5) {
          animation-delay: -3.6s;
        }

        .vozon-command-node svg {
          width: 34px;
          height: 34px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 3.4;
          filter: drop-shadow(0 0 10px rgba(125,255,244,0.58));
        }

        .vozon-code-beams {
          pointer-events: none;
          mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 74%, transparent 100%);
        }

        .vozon-command-particles {
          pointer-events: none;
          mask-image: radial-gradient(ellipse at 50% 48%, black 0%, black 62%, transparent 82%);
        }

        .vozon-command-particles span {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: #83fff3;
          box-shadow: 0 0 12px rgba(131,255,243,0.92);
          animation: vozonParticleDrift 5.8s ease-in-out infinite;
        }

        .vozon-command-connections {
          filter: drop-shadow(0 0 8px rgba(95,255,237,0.5));
        }

        .vozon-infinite-scan {
          background:
            linear-gradient(90deg, transparent 42%, rgba(125,255,244,0.34) 50%, transparent 58%),
            radial-gradient(circle, transparent 54%, rgba(72,219,139,0.15) 56%, transparent 58%);
          animation: vozonInfiniteScan 8s linear infinite;
          opacity: 0.74;
        }

        .vozon-code-platform {
          border-radius: 999px;
          background:
            radial-gradient(ellipse at 50% 44%, rgba(225,255,253,0.78), rgba(111,255,240,0.42) 15%, rgba(37,244,210,0.18) 32%, transparent 66%),
            radial-gradient(ellipse at 50% 50%, transparent 0 25%, rgba(117,255,240,0.62) 25.6% 26.4%, transparent 27% 43%, rgba(117,255,240,0.42) 43.6% 44.4%, transparent 45% 62%, rgba(117,255,240,0.28) 62.6% 63.4%, transparent 64%),
            linear-gradient(90deg, transparent 0%, rgba(95,255,237,0.28) 50%, transparent 100%);
          box-shadow:
            0 0 76px rgba(37,244,210,0.34),
            inset 0 0 42px rgba(37,244,210,0.28);
        }

        .vozon-code-platform::before,
        .vozon-code-platform::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 999px;
          border: 1px solid rgba(117,255,240,0.45);
          transform: translate(-50%, -50%);
        }

        .vozon-code-platform::before {
          width: 72%;
          height: 54%;
          box-shadow:
            0 0 28px rgba(37,244,210,0.2),
            0 0 0 18px rgba(37,244,210,0.045);
        }

        .vozon-code-platform::after {
          width: 46%;
          height: 32%;
          border-color: rgba(95,255,237,0.68);
          box-shadow:
            0 0 24px rgba(95,255,237,0.28),
            inset 0 0 22px rgba(95,255,237,0.12);
        }

        .vozon-infinite-compass {
          animation: vozonCompassPulse 3.8s ease-in-out infinite;
        }

        .vozon-platform-tile {
          color: var(--tile-accent, #66fff0);
          background:
            linear-gradient(145deg, color-mix(in srgb, var(--tile-accent, #66fff0) 14%, transparent), rgba(255,255,255,0.035) 62%),
            rgba(255,255,255,0.035);
          border-color: color-mix(in srgb, var(--tile-accent, #66fff0) 38%, transparent);
          box-shadow:
            inset 0 0 34px color-mix(in srgb, var(--tile-accent, #66fff0) 10%, transparent),
            0 16px 36px rgba(0,0,0,0.14);
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        .vozon-platform-tile:hover {
          transform: translateY(-3px);
          border-color: color-mix(in srgb, var(--tile-accent, #66fff0) 72%, transparent);
          background:
            linear-gradient(145deg, color-mix(in srgb, var(--tile-accent, #66fff0) 22%, transparent), rgba(255,255,255,0.05) 68%),
            rgba(69,221,206,0.045);
          box-shadow:
            inset 0 0 38px color-mix(in srgb, var(--tile-accent, #66fff0) 15%, transparent),
            0 18px 42px color-mix(in srgb, var(--tile-accent, #66fff0) 14%, transparent);
        }

        .vozon-platform-tile-icon {
          display: grid;
          place-items: center;
          color: var(--tile-accent, #66fff0);
          filter: drop-shadow(0 0 14px color-mix(in srgb, var(--tile-accent, #66fff0) 48%, transparent));
        }

        .vozon-platform-tile svg {
          width: 38px;
          height: 38px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 3.2;
          filter: drop-shadow(0 0 12px rgba(102,255,240,0.36));
        }

        .vozon-spectrum-panel {
          border-color: rgba(101,139,255,0.2);
          background:
            linear-gradient(150deg, rgba(7,18,30,0.94), rgba(11,6,27,0.96) 58%, rgba(25,3,24,0.94)),
            #05050a;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.07),
            -22px 10px 80px rgba(0,197,255,0.08),
            24px 18px 90px rgba(240,0,126,0.08),
            0 30px 90px rgba(0,0,0,0.48);
        }

        .vozon-spectrum-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
        }

        .vozon-spectrum-ambient {
          background:
            radial-gradient(circle at 14% 45%, rgba(0,216,255,0.15), transparent 35%),
            radial-gradient(circle at 84% 54%, rgba(255,0,132,0.16), transparent 38%),
            radial-gradient(circle at 52% 56%, rgba(99,52,255,0.14), transparent 44%);
          animation: vozonSpectrumAmbient 7s ease-in-out infinite alternate;
        }

        .vozon-spectrum-status {
          background: #46ebff;
          box-shadow: 0 0 14px rgba(70,235,255,0.8);
          animation: vozonSpectrumStatus 2.4s ease-in-out infinite;
        }

        .vozon-spectrum-status.is-speaking {
          background: #ff4aa5;
          box-shadow: 0 0 18px rgba(255,74,165,0.9);
          animation-duration: 0.72s;
        }

        .vozon-spectrum-stage::before,
        .vozon-spectrum-stage::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,225,255,0.18), rgba(194,66,255,0.2), transparent);
        }

        .vozon-spectrum-stage::after {
          transform: translateY(24px);
          opacity: 0.55;
        }

        .vozon-spectrum-glow {
          background: linear-gradient(90deg, rgba(0,210,255,0.22), rgba(100,47,255,0.2), rgba(255,0,132,0.22));
          filter: blur(30px);
          animation: vozonSpectrumGlow 3.6s ease-in-out infinite;
        }

        .vozon-spectrum-bar {
          background: linear-gradient(to top, #00cce8 0%, #5d63ff 52%, #f20a95 100%);
          box-shadow: 0 0 10px rgba(60,174,255,0.16);
          opacity: 0.56;
          transform-origin: center;
          animation: vozonSpectrumIdle ease-in-out infinite alternate;
        }

        .vozon-spectrum-panel.is-speaking .vozon-spectrum-bar {
          opacity: 0.94;
          animation-name: vozonSpectrumSpeak;
          animation-duration: 0.52s !important;
          box-shadow: 0 0 12px rgba(100,109,255,0.32);
        }

        .vozon-spectrum-action {
          border-color: rgba(101,166,255,0.25);
          background:
            linear-gradient(100deg, rgba(0,190,222,0.18), rgba(91,49,211,0.25) 52%, rgba(227,0,121,0.2)),
            rgba(255,255,255,0.025);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);
        }

        .vozon-spectrum-action:hover {
          border-color: rgba(111,224,255,0.52);
          transform: translateY(-2px);
          box-shadow: -8px 0 24px rgba(0,205,255,0.1), 8px 0 28px rgba(255,0,145,0.1);
        }

        .vozon-spectrum-mic {
          background: linear-gradient(135deg, #13d8e8, #6e55ed 55%, #ef248f);
          box-shadow: 0 0 18px rgba(92,86,239,0.35);
          animation: vozonSpectrumMic 2s ease-in-out infinite;
        }

        .vozon-spectrum-panel.is-speaking .vozon-spectrum-mic {
          animation-duration: 0.68s;
        }
        .vozon-iphone::before,
        .vozon-iphone::after {
          content: "";
          position: absolute;
          z-index: 40;
          width: 4px;
          border-radius: 999px;
          background: #202a26;
        }

        .vozon-iphone::before {
          left: -17px;
          top: 160px;
          height: 96px;
          box-shadow: 0 118px 0 #202a26;
        }

        .vozon-iphone::after {
          right: -17px;
          top: 210px;
          height: 82px;
        }

        .vozon-voice-orb {
          isolation: isolate;
          filter: drop-shadow(0 24px 42px rgba(23,255,144,0.12));
          transition: filter 350ms ease, transform 350ms ease;
        }

        .vozon-orb-halo {
          background:
            radial-gradient(circle at 50% 48%, rgba(54,255,164,0.2) 0 27%, rgba(15,174,104,0.13) 48%, transparent 69%);
          box-shadow:
            inset 0 0 38px rgba(70,255,176,0.14),
            0 0 45px rgba(21,221,128,0.14);
          opacity: 0.78;
          transition: opacity 300ms ease;
        }

        .vozon-orb-shell {
          background:
            radial-gradient(circle at 34% 27%, rgba(200,255,226,0.88), transparent 8%),
            radial-gradient(circle at 46% 38%, #47f0a6 0%, #10a966 35%, #063e2a 68%, #01150e 100%);
          border: 1px solid rgba(151,255,208,0.54);
          box-shadow:
            inset -18px -24px 38px rgba(0,19,12,0.8),
            inset 12px 12px 28px rgba(157,255,212,0.19),
            0 0 28px rgba(36,243,147,0.28);
          transform: translateZ(0);
        }

        .vozon-orb-shell::before {
          content: "";
          position: absolute;
          inset: 16%;
          z-index: 1;
          border-radius: 38% 62% 58% 42% / 48% 38% 62% 52%;
          border: 5px solid rgba(128,255,190,0.48);
          background:
            linear-gradient(135deg, rgba(128,255,190,0.18), transparent 44%, rgba(19,175,102,0.26)),
            radial-gradient(circle at 34% 28%, rgba(196,255,223,0.3), transparent 34%);
          box-shadow:
            inset 8px -7px 18px rgba(0,54,31,0.5),
            0 0 16px rgba(66,255,159,0.34);
          filter: blur(0.4px);
          animation: vozonOrbMembrane 4.8s ease-in-out infinite alternate;
        }

        .vozon-orb-shell::after {
          content: "";
          position: absolute;
          inset: 5%;
          border-radius: 999px;
          background: linear-gradient(140deg, rgba(255,255,255,0.2), transparent 28%, transparent 65%, rgba(0,0,0,0.28));
          mix-blend-mode: screen;
        }

        .vozon-orb-band {
          left: -20%;
          width: 140%;
          height: 42%;
          border: 8px solid rgba(156,255,211,0.48);
          border-left-color: rgba(23,126,82,0.42);
          border-bottom-color: rgba(2,52,33,0.68);
          border-radius: 50%;
          filter: drop-shadow(0 0 7px rgba(80,255,170,0.45));
        }

        .vozon-orb-band-one {
          top: 11%;
          transform: rotate(-30deg);
        }

        .vozon-orb-band-two {
          bottom: 11%;
          transform: rotate(28deg) scaleX(0.92);
          border-color: rgba(73,232,151,0.52);
          border-top-color: rgba(188,255,219,0.74);
        }

        .vozon-orb-band-three {
          left: 17%;
          top: -16%;
          width: 64%;
          height: 132%;
          transform: rotate(22deg);
          border-width: 5px;
          border-color: rgba(8,74,46,0.68);
          border-right-color: rgba(135,255,196,0.58);
        }

        .vozon-orb-shine {
          left: 29%;
          top: 19%;
          width: 16%;
          height: 7%;
          background: rgba(224,255,239,0.8);
          filter: blur(3px);
          transform: rotate(-24deg);
        }

        .vozon-voice-orb.is-speaking {
          filter: drop-shadow(0 24px 50px rgba(23,255,144,0.28));
          animation: vozonOrbBreathe 1.2s ease-in-out infinite;
        }

        .vozon-voice-orb.is-speaking .vozon-orb-halo {
          opacity: 1;
          animation: vozonOrbHalo 1.2s ease-in-out infinite;
        }

        .vozon-voice-orb.is-speaking .vozon-orb-shell {
          animation: vozonOrbTurn 3.8s linear infinite;
        }

        .vozon-voice-orb.is-speaking .vozon-orb-band-one {
          animation-duration: 1.55s;
        }

        .vozon-voice-orb.is-speaking .vozon-orb-band-two {
          animation-duration: 1.3s;
        }

        .vozon-voice-orb.is-speaking .vozon-orb-band-three,
        .vozon-voice-orb.is-speaking .vozon-orb-shell::before {
          animation-duration: 1.55s;
        }

        .vozon-voice-input {
          border-color: rgba(125,255,196,0.24);
          color: rgba(255,255,255,0.7);
          background: linear-gradient(100deg, rgba(20,93,62,0.52), rgba(13,48,34,0.72));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 14px 38px rgba(0,0,0,0.28);
          backdrop-filter: blur(18px);
        }

        .vozon-voice-input:hover,
        .vozon-voice-input.is-speaking {
          border-color: rgba(111,255,185,0.52);
          background: linear-gradient(100deg, rgba(28,124,81,0.62), rgba(13,66,43,0.82));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 0 30px rgba(29,218,128,0.13);
        }

        .vozon-orb-voice-bar {
          background: #8dffd0;
          transform-origin: center;
        }

        .vozon-voice-input.is-speaking .vozon-orb-voice-bar {
          animation: vozonOrbVoiceBar 0.72s ease-in-out infinite alternate;
        }
        .vozon-mini-avatar::after {
          content: "";
          position: absolute;
          left: 11px;
          top: 19px;
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: #101715;
          box-shadow: 13px 0 0 #101715, 6px 9px 0 -1px #8b4b32;
        }

        .vozon-call-orbit {
          background:
            radial-gradient(circle, rgba(69,221,206,0.2), transparent 42%),
            radial-gradient(circle, rgba(69,221,206,0.05), transparent 68%);
        }

        .vozon-agent-avatar {
          filter: drop-shadow(0 0 0 rgba(69,221,206,0.34)) drop-shadow(0 0 34px rgba(69,221,206,0.28));
          transition: filter 180ms ease, transform 180ms ease;
        }

        .vozon-agent-avatar.is-speaking {
          filter: drop-shadow(0 0 8px rgba(69,221,206,0.5)) drop-shadow(0 0 34px rgba(69,221,206,0.38));
        }

        .vozon-avatar-mouth {
          position: absolute;
          left: 50%;
          top: 55.2%;
          z-index: 2;
          width: 24px;
          height: 10px;
          border-radius: 48%;
          background: #efb17f;
          transform: translateX(-50%);
        }

        .vozon-avatar-mouth::before,
        .vozon-avatar-mouth::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 4px;
          width: 14px;
          height: 1.5px;
          border-radius: 999px;
          transform: translateX(-50%);
          transform-origin: center;
        }

        .vozon-avatar-mouth::before {
          background: #6f303f;
        }

        .vozon-avatar-mouth::after {
          top: 4.6px;
          width: 12px;
          background: #a84f62;
          animation: vozonAvatarTalk 0.42s ease-in-out infinite;
        }

        .vozon-call-wave {
          opacity: 0.24;
          transform: scaleY(0.42);
          transform-origin: center;
          transition: opacity 180ms ease, transform 180ms ease;
        }

        .vozon-call-wave.is-speaking {
          animation: vozonCallWave 0.82s ease-in-out infinite;
          opacity: 0.72;
        }

        .vozon-media-dots {
          background-image:
            radial-gradient(circle, rgba(114,255,240,0.62) 0 2px, transparent 2.8px),
            radial-gradient(circle, rgba(37,244,210,0.26) 0 1.5px, transparent 2.4px);
          background-size: 42px 42px, 68px 68px;
          background-position: 0 0, 20px 18px;
          mask-image: radial-gradient(circle at 50% 52%, black 0%, black 46%, transparent 76%);
          opacity: 0.48;
          animation: vozonMediaDots 9s linear infinite;
        }

        .vozon-media-dots::after {
          content: "";
          position: absolute;
          inset: 16%;
          border-radius: 999px;
          border: 1px solid rgba(94,255,235,0.16);
          box-shadow:
            0 0 32px rgba(37,244,210,0.12),
            inset 0 0 28px rgba(37,244,210,0.08);
          animation: vozonMediaPulse 2.8s ease-in-out infinite;
        }

        .vozon-feature-card {
          transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
        }

        .vozon-feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(84,255,229,0.62);
          box-shadow: 0 26px 90px rgba(29,244,203,0.14);
        }

        .vozon-workflow-card {
          transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
        }

        .vozon-workflow-card:hover {
          transform: translateY(-5px);
          border-color: rgba(84,255,229,0.6);
          box-shadow: 0 28px 94px rgba(29,244,203,0.13);
        }

        .vozon-team-member {
          min-height: 335px;
        }

        .vozon-ai-portrait {
          clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
          animation: vozonAgentFloat 6.8s ease-in-out infinite;
        }

        .vozon-team-member:nth-child(2) .vozon-ai-portrait {
          animation-delay: -1.2s;
        }

        .vozon-team-member:nth-child(3) .vozon-ai-portrait {
          animation-delay: -2.4s;
        }

        .vozon-verified {
          box-shadow: 0 0 18px rgba(36,87,255,0.45);
        }

        .vozon-partner-logo {
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        .vozon-partner-logo:hover {
          transform: translateY(-4px);
          border-color: rgba(84,255,229,0.26);
          background: rgba(255,255,255,0.055);
          box-shadow: 0 18px 48px rgba(29,244,203,0.08);
        }

        .vozon-partner-mark {
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border-radius: 14px;
          background: rgba(255,255,255,0.055);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
        }

        .vozon-partner-mark svg {
          width: 30px;
          height: 30px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 3;
        }

        .vozon-slack-mark svg path:nth-child(1) {
          stroke: #36c5f0;
        }

        .vozon-slack-mark svg path:nth-child(2) {
          stroke: #2eb67d;
        }

        .vozon-slack-mark svg path:nth-child(3) {
          stroke: #ecb22e;
        }

        .vozon-slack-mark svg path:nth-child(4) {
          stroke: #e01e5a;
        }

        .vozon-avatar-wave {
          animation: vozonAvatarWave 1.4s ease-in-out infinite;
          transform-origin: bottom;
        }

        .vozon-feature-visual {
          box-shadow: inset 0 0 46px rgba(37,244,210,0.045), 0 18px 48px rgba(0,0,0,0.2);
        }

        .vozon-workflow-visual {
          box-shadow: inset 0 0 52px rgba(37,244,210,0.05), 0 18px 52px rgba(0,0,0,0.22);
        }

        .vozon-voice-bar {
          animation: vozonVoiceBars 1.2s ease-in-out infinite;
          opacity: 0.68;
          transform-origin: bottom;
        }




        .vozon-orbit-flow::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 5% 8% 10%;
          pointer-events: none;
          border-radius: 50%;
          background:
            radial-gradient(circle at 50% 48%, rgba(69,221,206,0.23), transparent 39%),
            radial-gradient(circle at 73% 48%, rgba(29,207,255,0.07), transparent 26%);
          filter: blur(28px);
        }

        .vozon-orbit-input-glow {
          opacity: 0.13;
          filter: blur(7px);
          animation: vozonOrbitInputGlow 2.2s ease-in-out infinite;
        }

        .vozon-orbit-input {
          stroke-dasharray: 7 7;
          filter: drop-shadow(0 0 5px rgba(126,255,239,0.7));
          animation: vozonOrbitInput 4.5s linear infinite;
        }

        .vozon-orbit-output {
          filter: drop-shadow(0 0 5px rgba(69,221,206,0.42));
        }

        .vozon-orbit-pulse {
          fill: none;
          stroke-dasharray: 0.035 0.965;
          stroke-dashoffset: 1;
          filter: drop-shadow(0 0 7px rgba(192,255,249,0.96));
          animation: vozonOrbitPulse 3.2s linear infinite;
        }

        .vozon-orbit-pulse-out {
          animation-delay: 1.35s;
        }

        .vozon-orbit-caller {
          position: absolute;
          top: 50%;
          left: 1%;
          width: 235px;
          transform: translateY(-50%);
        }

        .vozon-orbit-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .vozon-orbit-outcomes {
          position: absolute;
          top: 50%;
          right: 1%;
          width: 290px;
          transform: translateY(-50%);
        }

        .vozon-orbit-phone {
          box-shadow: inset 0 0 24px rgba(69,221,206,0.08), 0 0 30px rgba(69,221,206,0.1);
        }

        .vozon-orbit-phone::before,
        .vozon-orbit-phone::after {
          content: "";
          position: absolute;
          inset: -1px;
          border: 1px solid rgba(69,221,206,0.34);
          border-radius: inherit;
          animation: vozonOrbitPhone 2.5s ease-out infinite;
        }

        .vozon-orbit-phone::after {
          animation-delay: 1.25s;
        }

        .vozon-orbit-speech {
          background: linear-gradient(145deg, rgba(255,255,255,0.12), rgba(69,221,206,0.055));
          box-shadow: inset 0 1px rgba(255,255,255,0.07), 0 16px 38px rgba(0,0,0,0.2), 0 0 24px rgba(69,221,206,0.055);
          animation: vozonOrbitSpeech 6s ease-in-out infinite;
        }

        .vozon-orbit-core-inner {
          background:
            radial-gradient(circle at 50% 40%, rgba(69,221,206,0.3), transparent 36%),
            radial-gradient(circle at 70% 65%, rgba(29,207,255,0.08), transparent 32%),
            radial-gradient(circle, rgba(5,34,28,0.98), rgba(1,12,10,0.99) 72%);
          box-shadow: inset 0 0 60px rgba(69,221,206,0.12), 0 0 76px rgba(69,221,206,0.2);
          animation: vozonOrbitCore 3.8s ease-in-out infinite;
        }

        .vozon-orbit-core-inner::before {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: inherit;
          background: conic-gradient(from 20deg, transparent 0 78%, rgba(126,255,239,0.22) 85%, transparent 92%);
          mask: radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 1px));
          animation: vozonOrbitRotate 7s linear infinite;
        }

        .vozon-orbit-ring {
          animation: vozonOrbitRotate 16s linear infinite;
        }

        .vozon-orbit-ring-two {
          animation-direction: reverse;
          animation-duration: 22s;
        }

        .vozon-orbit-ring::before {
          content: "";
          position: absolute;
          top: -3px;
          left: 50%;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #86fff3;
          box-shadow: 0 0 12px rgba(134,255,243,0.9);
        }

        .vozon-orbit-wave {
          transform-origin: center;
          animation: vozonOrbitWave 0.88s ease-in-out infinite alternate;
        }

        .vozon-orbit-live span {
          box-shadow: 0 0 10px rgba(69,221,206,0.9);
          animation: vozonOrbitLive 1.8s ease-out infinite;
        }

        .vozon-orbit-intent {
          box-shadow: inset 0 0 18px rgba(69,221,206,0.05), 0 0 20px rgba(69,221,206,0.05);
          animation: vozonOrbitIntent 2.8s ease-in-out infinite;
        }

        .vozon-orbit-outcome {
          opacity: 0;
          background: linear-gradient(100deg, rgba(9,43,36,0.98), rgba(3,24,20,0.96));
          box-shadow: inset 0 0 30px rgba(69,221,206,0.055), 0 16px 40px rgba(0,0,0,0.25), 0 0 22px rgba(69,221,206,0.045);
          animation-duration: 8s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
        }

        .vozon-orbit-outcome:nth-of-type(1) {
          animation-name: vozonOrbitOutcomeOne;
        }

        .vozon-orbit-outcome:nth-of-type(2) {
          animation-name: vozonOrbitOutcomeTwo;
        }

        .vozon-orbit-outcome:nth-of-type(3) {
          animation-name: vozonOrbitOutcomeThree;
        }

        .vozon-orbit-outcomes-title {
          text-shadow: 0 0 14px rgba(69,221,206,0.28);
        }

        .vozon-orbit-check {
          box-shadow: 0 0 14px rgba(69,221,206,0.08);
        }

        .vozon-orbit-benefit span:first-child {
          background: transparent;
          filter: drop-shadow(0 0 10px rgba(69,221,206,0.28));
        }

        @keyframes vozonOrbitInputGlow {
          0%, 100% { opacity: 0.1; stroke-width: 8px; }
          50% { opacity: 0.22; stroke-width: 13px; }
        }

        @keyframes vozonOrbitInput {
          to { stroke-dashoffset: -84; }
        }

        @keyframes vozonOrbitPulse {
          to { stroke-dashoffset: 0; }
        }

        @keyframes vozonOrbitPhone {
          0% { opacity: 0.65; transform: scale(1); }
          76%, 100% { opacity: 0; transform: scale(1.55); }
        }

        @keyframes vozonOrbitSpeech {
          0%, 100% { border-color: rgba(255,255,255,0.1); transform: translateY(0); }
          16%, 40% { border-color: rgba(69,221,206,0.26); transform: translateY(-2px); }
        }

        @keyframes vozonOrbitCore {
          0%, 100% { box-shadow: inset 0 0 58px rgba(69,221,206,0.11), 0 0 62px rgba(69,221,206,0.16); }
          50% { box-shadow: inset 0 0 66px rgba(69,221,206,0.16), 0 0 92px rgba(69,221,206,0.27); }
        }

        @keyframes vozonOrbitRotate {
          to { transform: rotate(360deg); }
        }

        @keyframes vozonOrbitWave {
          from { opacity: 0.4; transform: scaleY(0.4); }
          to { opacity: 1; transform: scaleY(1); }
        }

        @keyframes vozonOrbitLive {
          0%, 100% { box-shadow: 0 0 0 0 rgba(69,221,206,0.28), 0 0 10px rgba(69,221,206,0.9); }
          50% { box-shadow: 0 0 0 5px rgba(69,221,206,0), 0 0 14px rgba(69,221,206,1); }
        }

        @keyframes vozonOrbitIntent {
          0%, 100% { border-color: rgba(69,221,206,0.18); filter: brightness(0.9); }
          50% { border-color: rgba(69,221,206,0.42); filter: brightness(1.12); }
        }

        @keyframes vozonOrbitOutcomeOne {
          0%, 4% { opacity: 0; border-color: rgba(69,221,206,0.18); transform: translateX(-14px) scale(0.98); }
          11%, 88% { opacity: 1; border-color: rgba(126,255,239,0.5); transform: translateX(0) scale(1); }
          96%, 100% { opacity: 0; border-color: rgba(69,221,206,0.18); transform: translateX(4px) scale(0.99); }
        }

        @keyframes vozonOrbitOutcomeTwo {
          0%, 23% { opacity: 0; border-color: rgba(69,221,206,0.18); transform: translateX(-14px) scale(0.98); }
          31%, 88% { opacity: 1; border-color: rgba(126,255,239,0.5); transform: translateX(0) scale(1); }
          96%, 100% { opacity: 0; border-color: rgba(69,221,206,0.18); transform: translateX(4px) scale(0.99); }
        }

        @keyframes vozonOrbitOutcomeThree {
          0%, 42% { opacity: 0; border-color: rgba(69,221,206,0.18); transform: translateX(-14px) scale(0.98); }
          50%, 88% { opacity: 1; border-color: rgba(126,255,239,0.5); transform: translateX(0) scale(1); }
          96%, 100% { opacity: 0; border-color: rgba(69,221,206,0.18); transform: translateX(4px) scale(0.99); }
        }

        @keyframes vozonOrbitMobileFlow {
          to { background-position: 0 -120%; }
        }

        @keyframes vozonCompanyMarquee {
          to {
            transform: translateX(-100%);
          }
        }

        @keyframes vozonInfiniteOrbit {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes vozonReferenceAiMotion {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes vozonReferenceAiPulse {
          0%, 100% {
            opacity: 0.42;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.78;
            transform: scale(1.04);
          }
        }

        @keyframes vozonInfiniteFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }

          50% {
            transform: translateY(-8px) scale(1.015);
          }
        }

        @keyframes vozonAiParticles {
          to {
            background-position: 34px 34px, -28px 58px;
          }
        }

        @keyframes vozonParticleDrift {
          0%, 100% {
            opacity: 0.28;
            transform: translate3d(0, 0, 0) scale(0.8);
          }

          50% {
            opacity: 1;
            transform: translate3d(0, -12px, 0) scale(1.12);
          }
        }

        @keyframes vozonCommandNodeFloat {
          0%, 100% {
            translate: 0 0;
          }

          50% {
            translate: 0 -6px;
          }
        }

        @keyframes vozonInfiniteScan {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes vozonCompassPulse {
          0%, 100% {
            box-shadow: 0 0 26px rgba(37,244,210,0.16);
          }

          50% {
            box-shadow: 0 0 38px rgba(37,244,210,0.3);
          }
        }

        @keyframes vozonVoiceBars {
          0%, 100% {
            transform: scaleY(0.52);
            opacity: 0.52;
          }

          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes vozonMediaDots {
          to {
            background-position: 42px 42px, -48px 86px;
          }
        }

        @keyframes vozonMediaPulse {
          0%, 100% {
            transform: scale(0.96);
            opacity: 0.42;
          }

          50% {
            transform: scale(1.04);
            opacity: 0.82;
          }
        }

        @keyframes vozonSpectrumAmbient {
          from { transform: translate3d(-2%, -1%, 0) scale(1); }
          to { transform: translate3d(2%, 2%, 0) scale(1.08); }
        }

        @keyframes vozonSpectrumStatus {
          0%, 100% { transform: scale(0.82); opacity: 0.58; }
          50% { transform: scale(1.12); opacity: 1; }
        }

        @keyframes vozonSpectrumGlow {
          0%, 100% { transform: scaleX(0.82); opacity: 0.55; }
          50% { transform: scaleX(1.08); opacity: 0.92; }
        }

        @keyframes vozonSpectrumIdle {
          from { transform: scaleY(0.22); opacity: 0.34; }
          to { transform: scaleY(0.54); opacity: 0.66; }
        }

        @keyframes vozonSpectrumSpeak {
          0%, 100% { transform: scaleY(0.3); }
          45% { transform: scaleY(1); }
          72% { transform: scaleY(0.62); }
        }

        @keyframes vozonSpectrumMic {
          0%, 100% { transform: scale(0.92); }
          50% { transform: scale(1.06); }
        }
        @keyframes vozonBloomFloat {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-7px) rotate(1.5deg); }
        }

        @keyframes vozonBloomHalo {
          0%, 100% { transform: scale(0.9) rotate(0deg); opacity: 0.58; }
          50% { transform: scale(1.08) rotate(90deg); opacity: 1; }
          100% { transform: scale(0.9) rotate(180deg); opacity: 0.58; }
        }

        @keyframes vozonBloomCore {
          to { transform: rotate(360deg); }
        }

        @keyframes vozonBloomMorph {
          0% { border-radius: 42% 58% 54% 46%; transform: scale(0.82) rotate(-8deg); }
          50% { border-radius: 58% 42% 45% 55%; transform: scale(1.03) rotate(6deg); }
          100% { border-radius: 48% 52% 62% 38%; transform: scale(0.88) rotate(14deg); }
        }

        @keyframes vozonBloomBandOne {
          from { transform: rotate(-31deg) translateY(-3px) scaleX(0.92); }
          to { transform: rotate(-17deg) translateY(7px) scaleX(1.06); }
        }

        @keyframes vozonBloomBandTwo {
          from { transform: rotate(27deg) translateY(3px) scaleX(0.9); }
          to { transform: rotate(42deg) translateY(-7px) scaleX(1.04); }
        }

        @keyframes vozonBloomBandThree {
          from { transform: rotate(17deg) scaleY(0.92); }
          to { transform: rotate(34deg) scaleY(1.06); }
        }

        @keyframes vozonBloomSpeak {
          0%, 100% { transform: translateY(-2px) scale(1); }
          45% { transform: translateY(-7px) scale(1.07); }
          70% { transform: translateY(-4px) scale(1.025); }
        }
        @keyframes vozonOrbBreathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.035); }
        }

        @keyframes vozonOrbHalo {
          0%, 100% { transform: scale(0.92); opacity: 0.68; }
          50% { transform: scale(1.12); opacity: 1; }
        }

        @keyframes vozonOrbTurn {
          to { transform: rotate(360deg); }
        }

        @keyframes vozonOrbBandOne {
          from { transform: rotate(-30deg) translateY(-3px) scaleX(0.94); }
          to { transform: rotate(-18deg) translateY(6px) scaleX(1.05); }
        }

        @keyframes vozonOrbBandTwo {
          from { transform: rotate(28deg) translateY(3px) scaleX(0.9); }
          to { transform: rotate(38deg) translateY(-5px) scaleX(1.03); }
        }

        @keyframes vozonOrbMembrane {
          0% {
            border-radius: 38% 62% 58% 42% / 48% 38% 62% 52%;
            transform: rotate(-18deg) scale(0.82) skewX(-7deg);
          }
          50% {
            border-radius: 61% 39% 43% 57% / 36% 58% 42% 64%;
            transform: rotate(22deg) scale(1.08) skewY(8deg);
          }
          100% {
            border-radius: 47% 53% 65% 35% / 61% 43% 57% 39%;
            transform: rotate(58deg) scale(0.9) skewX(6deg);
          }
        }

        @keyframes vozonOrbBandThree {
          from { transform: rotate(15deg) scaleY(0.86) translateX(-4px); }
          to { transform: rotate(38deg) scaleY(1.08) translateX(5px); }
        }
        @keyframes vozonOrbVoiceBar {
          from { transform: scaleY(0.42); opacity: 0.55; }
          to { transform: scaleY(1.12); opacity: 1; }
        }
        @keyframes vozonBotStatus {
          0%, 100% { opacity: 0.5; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.14); }
        }

        @keyframes vozonIndiaParticles {
          to { background-position: 99px 136px, -113px 194px; }
        }

        @keyframes vozonBrandWave {
          from { transform: scaleY(0.4); opacity: 0.55; }
          to { transform: scaleY(1.08); opacity: 1; }
        }

        @keyframes vozonIndiaWave {
          0% { transform: scaleY(0.22); opacity: 0.36; }
          46% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0.48); opacity: 0.64; }
        }

        @keyframes vozonMicPulse {
          0% { transform: scale(0.88); opacity: 0.72; }
          75%, 100% { transform: scale(1.18); opacity: 0; }
        }

        @keyframes vozonMicCore {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.035); }
        }

        @keyframes vozonHeroSignalFlow {
          to { stroke-dashoffset: -64; }
        }

        @keyframes vozonSmoothWave {
          to { stroke-dashoffset: -68; }
        }

        @keyframes vozonSmoothWaveReverse {
          to { stroke-dashoffset: 54; }
        }

        @keyframes vozonBotRadar {
          to { transform: rotate(360deg); }
        }

        @keyframes vozonBotGlow {
          0%, 100% { opacity: 0.6; transform: scale(0.92); }
          50% { opacity: 1; transform: scale(1.08); }
        }

        @keyframes vozonBotEyes {
          0%, 44%, 52%, 100% { transform: scaleY(1); }
          48% { transform: scaleY(0.12); }
        }

        @keyframes vozonBotTalk {
          from { transform: scaleY(0.7) translateY(-1px); }
          to { transform: scaleY(1.3) translateY(1px); }
        }

        @keyframes vozonConversationWave {
          0% { transform: scaleY(0.28); opacity: 0.4; }
          48% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0.56); opacity: 0.7; }
        }
        @keyframes vozonCallWave {
          0%, 100% {
            transform: scaleY(0.58);
            opacity: 0.54;
          }

          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes vozonAvatarTalk {
          0%, 100% {
            transform: translateX(-50%) translateY(-0.35px) scaleX(0.9);
            opacity: 0.92;
          }

          45% {
            transform: translateX(-50%) translateY(0.7px) scaleX(1.02);
            opacity: 1;
          }

          70% {
            transform: translateX(-50%) translateY(0.1px) scaleX(0.96);
            opacity: 0.96;
          }
        }

        @keyframes vozonAgentFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes vozonAvatarWave {
          0%, 100% {
            transform: scaleY(0.62);
            opacity: 0.56;
          }

          50% {
            transform: scaleY(1);
            opacity: 0.92;
          }
        }


        @media (max-width: 720px) {
          .vozon-india-showcase {
            min-height: 520px;
          }

          .vozon-language-center-title {
            font-size: clamp(0.85rem, 3.5vw, 1.55rem);
          }

          .vozon-language-poster {
            min-height: 540px;
          }

          .vozon-language-poster img {
            min-height: 490px;
          }

          .vozon-live-language-demo {
            min-height: 720px;
          }

          .vozon-live-demo-grid {
            min-height: 0;
            gap: 2rem;
            padding-block: 1rem;
          }

          .vozon-avatar-column {
            padding-top: 0.5rem;
          }

          .vozon-conversation-flow {
            padding: 1rem;
            border-radius: 20px;
          }

          .vozon-story-rail {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .vozon-story-arrow {
            display: none;
          }

          .vozon-story-step {
            flex-direction: column;
            justify-content: center;
            gap: 0.4rem;
            text-align: center;
          }

          .vozon-story-step strong {
            font-size: 7px;
          }

          .vozon-signal-experience {
            min-height: 635px;
          }

          .vozon-microphone-stage {
            top: 130px;
            left: 50%;
            width: 164px;
            height: 164px;
          }

          .vozon-mic-core {
            width: 106px;
            height: 106px;
          }

          .vozon-hero-wave-bridge {
            top: 235px;
            right: -5%;
            left: -5%;
            height: 120px;
          }

          .vozon-live-conversation-card {
            top: 320px;
            right: 0;
            width: 100%;
            transform: none;
          }

          .vozon-conversation-row {
            grid-template-columns: 78px 1fr;
          }

          .vozon-language-row {
            grid-template-columns: 46px minmax(60px, 1fr) 86px 30px;
            min-height: 60px;
            padding-inline: 0.65rem;
          }

          .vozon-language-glyph {
            width: 2.75rem;
            height: 2.75rem;
          }

          .vozon-row-wave {
            gap: 1px;
          }
        }

        @media (max-width: 960px) {
          .vozon-orbit-stage {
            display: flex;
            min-height: 0;
            flex-direction: column;
            align-items: center;
            gap: 4.75rem;
            padding-block: 1rem;
          }

          .vozon-orbit-stage::before {
            content: "";
            position: absolute;
            z-index: 0;
            top: 5%;
            bottom: 5%;
            left: 50%;
            width: 1px;
            background: linear-gradient(transparent, rgba(69,221,206,0.14), #83fff2, rgba(69,221,206,0.14), transparent);
            background-position: 0 100%;
            background-size: 100% 220%;
            box-shadow: 0 0 8px rgba(69,221,206,0.28);
            animation: vozonOrbitMobileFlow 3.4s linear infinite;
          }

          .vozon-orbit-paths {
            display: none;
          }

          .vozon-orbit-caller,
          .vozon-orbit-core,
          .vozon-orbit-outcomes {
            position: relative;
            top: auto;
            right: auto;
            left: auto;
            transform: none;
          }

          .vozon-orbit-caller {
            width: min(100%, 300px);
          }

          .vozon-orbit-core {
            flex: 0 0 auto;
          }

          .vozon-orbit-outcomes {
            width: min(100%, 360px);
          }

        }

        @media (max-width: 480px) {
          .vozon-india-showcase {
            min-height: 500px;
          }

          .vozon-language-center-title {
            font-size: clamp(0.82rem, 3.45vw, 1.05rem);
          }

          .vozon-language-row {
            grid-template-columns: 44px minmax(50px, 1fr) 74px 30px;
            gap: 0.5rem;
            min-height: 58px;
          }

          .vozon-language-row strong {
            font-size: 0.85rem;
          }

          .vozon-language-row .vozon-row-wave i:nth-child(n + 9) {
            display: none;
          }

          .vozon-orbit-stage {
            gap: 4.25rem;
            padding-top: 0.5rem;
          }

          .vozon-orbit-caller,
          .vozon-orbit-outcomes {
            width: 100%;
          }

          .vozon-orbit-core {
            width: 13.75rem;
            height: 13.75rem;
          }

          .vozon-orbit-ring-one {
            inset: -0.8rem;
          }

          .vozon-orbit-ring-two {
            inset: -1.55rem;
          }

          .vozon-orbit-speech {
            padding: 0.85rem 1rem;
            font-size: 0.7rem;
          }

          .vozon-orbit-benefits {
            gap: 0.2rem;
          }
        }

        @media (min-width: 721px) and (max-width: 1024px) {
          .vozon-fit-tabs {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .vozon-circuit {
            margin-top: 2rem;
          }

            .vozon-fit-section {
            padding-top: 3.5rem;
            padding-bottom: 3.5rem;
          }

          .vozon-fit-tabs {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .vozon-fit-tab {
             min-height: 7.1rem;
            padding: 0.8rem 0.9rem 0.8rem 4rem;
            border-color: rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.018);
          }

          .vozon-fit-tab-icon {
            top: 0.8rem;
            left: 0.9rem;
          }

          .vozon-fit-tab-active {
            border-color: rgba(69,221,206,0.42);
            box-shadow: inset 0 0 0 4px rgba(69,221,206,0.03);          }

          // .vozon-fit-content {
          //   min-height: auto;
          //   border-right: 0;
          //   border-top: 1px solid rgba(255,255,255,0.08);
          //   padding: 1.4rem 1.25rem;
          // }


           .vozon-fit-tab-description {
            margin-top: 0.4rem;
            font-size: 0.8rem;
            line-height: 1.5;
          }

          .vozon-fit-panel {
            border-radius: 16px;
          }

          .vozon-fit-panel-top {
            padding: 1rem 1.1rem;
          }

          .vozon-fit-panel-body {
            padding: 1.25rem 1.1rem;
          }

          .vozon-fit-workflow-row {
            padding: 0.75rem;
          }

          .vozon-company-logo {
            min-width: 142px;
            gap: 0.65rem;
          }

          .vozon-company-logo span {
            font-size: 1.18rem;
          }

          .vozon-company-logo-image {
            width: 1.75rem;
            height: 1.75rem;
          }
        }


        @media (prefers-reduced-motion: reduce) {
          .vozon-language-section {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .vozon-india-voice-grid::before,
          .vozon-brand-wave i,
          .vozon-india-bot::after,
          .vozon-india-voice-stage.is-speaking .vozon-india-wave-line span,
          .vozon-live-language-demo.is-speaking .vozon-india-wave-line span,
          .vozon-live-language-demo.is-speaking .vozon-wave-main,
          .vozon-live-language-demo.is-speaking .vozon-wave-detail,
          .vozon-avatar-orbit-inner,
          .vozon-live-language-demo.is-speaking .vozon-mini-flow-wave i,
          .vozon-conversation-live i,
          .vozon-live-language-demo.is-speaking .vozon-india-reply > div:last-child i,
          .vozon-mic-pulse-two,
          .vozon-microphone-stage.is-speaking .vozon-mic-pulse-one,
          .vozon-microphone-stage.is-speaking .vozon-mic-core,
          .vozon-microphone-stage.is-speaking .vozon-mic-energy i,
          .vozon-live-language-demo.is-speaking .vozon-voice-signature i,
          .vozon-live-language-demo.is-speaking .vozon-hero-wave-main,
          .vozon-live-language-demo.is-speaking .vozon-processing-wave i,
          .vozon-row-wave.is-speaking i {
            animation: none;
          }

          .vozon-bot-status,
          .vozon-bot-radar span,
          .vozon-bot-avatar-glow,
          .vozon-bot-eye,
          .vozon-bot-mouth,
          .vozon-conversation-wave.is-speaking span {
            animation: none;
          }

          .vozon-company-track {
            animation-duration: 80s;
          }

          .vozon-orbit-input-glow,
          .vozon-orbit-input,
          .vozon-orbit-pulse,
          .vozon-orbit-phone::before,
          .vozon-orbit-phone::after,
          .vozon-orbit-speech,
          .vozon-orbit-core-inner,
          .vozon-orbit-core-inner::before,
          .vozon-orbit-ring,
          .vozon-orbit-wave,
          .vozon-orbit-live span,
          .vozon-orbit-intent,
          .vozon-orbit-outcome,
          .vozon-orbit-stage::before {
            animation: none;
          }

          .vozon-orbit-outcome {
            opacity: 1;
          }

        }
      `}</style>
    </div>
  );
}
