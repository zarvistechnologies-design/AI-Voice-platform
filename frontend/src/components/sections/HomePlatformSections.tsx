"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
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
  {
    name: "DigitalBot",
    src: "/images/digitalbot_orbit.png",
    logoClassName: "vozon-company-logo-image--digitalbot",
  },
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
    src: "/images/step01.png",
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
    src: "/images/step02.png",
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
    src: "/images/step03.png",
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
    src: "/images/step04.png",
  },
];

const codeExamples = {
  javascript: {
    label: "JavaScript",
    code: `const response = await fetch("https://api.vozon.ai/api/voice/outbound-calls", {
  method: "POST",
  headers: {
    Authorization: "Bearer <api_key>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    agentId: "your_agent_id",
    phoneNumber: "+919876543210",
  }),
});

console.log(await response.json());`,
  },
  api: {
    label: "API",
    code: `const response = await fetch(
  "https://api.vozon.ai/api/voice/outbound-calls",
  {
    method: "POST",
    headers: {
      Authorization: "Bearer <api_key>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agentId: "your_agent_id",
      phoneNumber: "+919876543210",
    }),
  }
);

const call = await response.json();`,
  },
  curl: {
    label: "cURL",
    code: `curl --request POST \\
  --url https://api.vozon.ai/api/voice/outbound-calls \\
  --header 'Authorization: Bearer <api_key>' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "agentId": "your_agent_id",
    "phoneNumber": "+919876543210"
  }'`,
  },
} as const;

type CodeTab = keyof typeof codeExamples;

const featureTabs = ["Conversations", "Automation", "Enterprise"] as const;
type FeatureTab = (typeof featureTabs)[number];

const featureTabMeta = {
  Conversations: { number: "01", hint: "Listen & respond" },
  Automation: { number: "02", hint: "Act & integrate" },
  Enterprise: { number: "03", hint: "Control & scale" },
} as const;

const featuresByTab = {
  Conversations: {
    label: "Natural by design",
    title: "Every call feels responsive, clear, and human.",
    body: "Give callers a fluid experience across languages without losing context when they pause, interrupt, or change direction.",
    icon: "language",
    metric: "500 ms",
    metricLabel: "response latency",
    items: [
      { icon: "latency", title: "Natural conversations", body: "Low-latency replies with interruption-aware turn taking." },
      { icon: "language", title: "Multilingual speech", body: "Converse naturally across Indian and global languages." },
      { icon: "models", title: "Flexible voice stack", body: "Match each use case with the right ASR, LLM, and voice." },
    ],
  },
  Automation: {
    label: "Action oriented",
    title: "Turn conversations into completed workflows.",
    body: "Move beyond answering questions. Let agents qualify, schedule, update systems, and bring in a person when needed.",
    icon: "workflow",
    metric: "24/7",
    metricLabel: "workflow coverage",
    items: [
      { icon: "calls", title: "Campaigns at scale", body: "Coordinate high-volume outbound calling from one workspace." },
      { icon: "api", title: "Live API actions", body: "Use approved APIs and tools while the conversation is active." },
      { icon: "handoff", title: "Contextual handoff", body: "Transfer complex calls to a human with the full context." },
    ],
  },
  Enterprise: {
    label: "Built for control",
    title: "Deploy with the flexibility your operations need.",
    body: "Choose how models, data, and environments are managed while maintaining visibility across every production call.",
    icon: "security",
    metric: "India + USA",
    metricLabel: "residency options",
    items: [
      { icon: "switching", title: "Model routing", body: "Select the most suitable model for every agent and call." },
      { icon: "security", title: "Data controls", body: "Configure residency, retention, and protected access." },
      { icon: "enterprise", title: "Deployment choice", body: "Support secure cloud and private deployment requirements." },
    ],
  },
} as const;

const demoLanguages = {
  English: {
    greeting: "Hi, I’m calling to confirm your appointment for tomorrow at 10:30 AM.",
    reply: "Yes, that works for me. Can you send the details by message?",
    action: "Appointment confirmed · SMS scheduled",
  },
  Hindi: {
    greeting: "Namaste, main kal subah 10:30 baje ki appointment confirm karne ke liye call kar raha hoon.",
    reply: "Haan, yeh samay theek hai. Kripya details message kar dijiye.",
    action: "Appointment confirmed · SMS scheduled",
  },
  Kannada: {
    greeting: "Namaskara, naale belagge 10:30ra appointment confirm maadalu kare maadiddene.",
    reply: "Haudu, aa samaya sari ide. Dayavittu vivaragalannu message maadi.",
    action: "Appointment confirmed · SMS scheduled",
  },
} as const;
type DemoLanguage = keyof typeof demoLanguages;

const customerOutcomes = [
  { icon: "calls", title: "Capture every request", body: "Collect the details your team needs from inbound calls, even when your office is busy.", label: "Call intake", accent: "teal" },
  { icon: "workflow", title: "Move work forward", body: "Trigger bookings, updates, and follow-ups with clearly defined next steps for each call.", label: "Workflow actions", accent: "violet" },
  { icon: "handoff", title: "Escalate with context", body: "Route complex conversations to the right person with the caller's intent and collected details.", label: "Human handoff", accent: "amber" },
] as const;

const trustHighlights = [
  { icon: "security", title: "Data controls", body: "Set clear rules for recordings, transcripts, knowledge, and connected-service data." },
  { icon: "enterprise", title: "Workspace permissions", body: "Give each teammate the level of access they need to operate and improve workflows." },
  { icon: "handoff", title: "Human review paths", body: "Define when an agent should transfer, pause, or bring a person into the conversation." },
] as const;

const appIntegrations = [
  { key: "hubspot", name: "HubSpot", position: "outer-left", orbit: "outer", delay: -2 },
  { key: "salesforce", name: "Salesforce", position: "outer-right", orbit: "outer", delay: -15 },
  { key: "calendar", name: "Google Calendar", position: "top-center", orbit: "outer", delay: -28 },
  { key: "twilio", name: "Twilio", position: "middle-right", orbit: "outer", delay: -41 },
  { key: "zoho", name: "Zoho", position: "upper-left", orbit: "middle", delay: -3 },
  { key: "crm", name: "CRM", position: "upper-right", orbit: "middle", delay: -15 },
  { key: "calendly", name: "Calendly", position: "middle-left", orbit: "middle", delay: -27 },
  { key: "exotel", name: "Exotel", position: "lower-right", orbit: "middle", delay: -39 },
  { key: "digitalbot", name: "DigitalBot.ai", position: "lower-center", orbit: "core", delay: -3 },
  { key: "gmail", name: "Gmail", position: "middle-center", orbit: "inner", delay: -5 },
] as const;

const appOrbitMotion = {
  outer: { path: "M85 430 A510 470 0 0 1 1035 430", duration: "54s" },
  middle: { path: "M196 420 A415 385 0 0 1 924 420", duration: "48s" },
  inner: { path: "M296 430 A320 300 0 0 1 824 430", duration: "42s" },
  core: { path: "M330 600 A230 220 0 0 1 790 600", duration: "36s" },
} as const;

const agentIndustries = ["Ecommerce", "EdTech", "HealthTech", "BFSI", "Hospitality"] as const;

const agentsByIndustry = {
  Ecommerce: [
    {
      title: "Customer Support Agent",
      tags: ["Customer Support", "English"],
      description: "Provides 24/7 inbound call answering for FAQs and customer triage",
    },
    {
      title: "Cart Abandonment Agent",
      tags: ["Cart Abandonment", "English + Hindi"],
      description: "Calls customers with abandoned items in carts, recovering sales",
    },
    {
      title: "COD Confirmation Agent",
      tags: ["COD Confirmation", "English + Hindi"],
      description: "Handles a variety of last mile logistics tasks, saving human effort",
    },
    {
      title: "Recruitment Agent",
      tags: ["Recruitment", "English"],
      description: "AI agents that screen, interview, and onboard candidates at scale",
    },
  ],
  EdTech: [
    {
      title: "Recruitment Agent",
      tags: ["Recruitment", "English"],
      description: "AI agents that screen, interview, and onboard candidates at scale",
    },
    {
      title: "Lead Qualification Agent",
      tags: ["Lead Qualification", "Multilingual"],
      description: "Handles routine questions about classes, schedules, access, and learning resources",
    },
    {
      title: "Onboarding Agent",
      tags: ["Student Onboarding", "English + Hindi"],
      description: "Sends timely payment reminders and guides students through the next payment step",
    },
    {
      title: "Announcements Agent",
      tags: ["Announcements", "English"],
      description: "Collects structured student feedback after lessons, courses, and learning milestones",
    },
  ],
  HealthTech: [
    {
      title: "Onboarding Agent",
      tags: ["Patient Onboarding", "Multilingual"],
      description: "Books, reschedules, and cancels patient appointments against available time slots",
    },
    {
      title: "Customer Support Agent",
      tags: ["Customer Support", "English + Hindi"],
      description: "Answers common service questions and routes sensitive requests to the right care team",
    },
    {
      title: "Reminders Agent",
      tags: ["Appointment Reminders", "English + Hindi"],
      description: "Confirms upcoming visits and shares preparation instructions before appointments",
    },
    {
      title: "Front Desk Agent",
      tags: ["Front Desk", "English"],
      description: "",
    },
  ],
  BFSI: [
    {
      title: "Reminders Agent",
      tags: ["Payment Reminders", "English + Hindi"],
      description: "Automates all reminders, from EMIs and collections to form filling deadlines",
    },
    {
      title: "Customer Support Agent",
      tags: ["Customer Support", "Multilingual"],
      description: "Automates all reminders, from EMIs and collections to form filling deadlines",
    },
    {
      title: "Lead Qualification Agent",
      tags: ["Lead Qualification", "English + Hindi"],
      description: "Calls every lead to ask qualifying questions, answer FAQs, and warmly introduces the business",
    },
    {
      title: "Announcements Agent",
      tags: ["Product Announcements", "English"],
      description: "Keeps users engaged with all feature upgrades and product launches",
    },
  ],
  Hospitality: [
    {
      title: "Front Desk Agent",
      tags: ["Front Desk", "Multilingual"],
      description: "Answers every call to handle clinic, hotel, and office scheduling",
    },
    {
      title: "Surveys Agent",
      tags: ["Guest Surveys", "English + Hindi"],
      description: "Automated NPS, feedback & product surveys with detailed personalised questioning",
    },
    {
      title: "Onboarding Agent",
      tags: ["Guest Onboarding", "English"],
      description: "Conducts personalized guidance calls to warmly onboard users",
    },
    {
      title: "Announcements Agent",
      tags: ["Guest Announcements", "Multilingual"],
      description: "Keeps users engaged with all feature upgrades and product launches",
    },
  ],
} as const satisfies Record<(typeof agentIndustries)[number], readonly {
  title: string;
  tags: readonly string[];
  description: string;
}[]>;

function AgentTypeIcon({ title }: { title: string }) {
  if (title.includes("Announcement")) {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 14 11-5v10L4 14Zm11-3 4-2v10l-4-2M7 15l1 5h3l-1-4" /></svg>;
  }

  if (title.includes("Survey")) {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2h6v2M9 9h6M9 13h6M9 17h3" /></svg>;
  }

  if (title.includes("Front Desk")) {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17h14M7 17v-3a5 5 0 0 1 10 0v3M12 9V6M10 6h4M4 20h16" /></svg>;
  }

  if (title.includes("Cart") || title.includes("COD")) {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h2l2 10h10l3-7H6M9 20h.01M17 20h.01" /></svg>;
  }

  if (title.includes("Reminder")) {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="7" /><path d="M12 9v4l3 2M9 3h6" /></svg>;
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.9-4.2 3.2-6 7-6s6.1 1.8 7 6" /></svg>;
}

function AgentIndustryIcon({ industry }: { industry: (typeof agentIndustries)[number] }) {
  if (industry === "Ecommerce") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h2l2 10h10l3-7H6M9 20h.01M17 20h.01" /></svg>;
  }

  if (industry === "EdTech") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 9 9-5 9 5-9 5-9-5Z" /><path d="M7 12v5c3 2 7 2 10 0v-5M21 9v6" /></svg>;
  }

  if (industry === "HealthTech") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20S4 15.2 4 9.2A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 8 2.2C20 15.2 12 20 12 20Z" /><path d="M8 12h2l1-2 2 4 1-2h2" /></svg>;
  }

  if (industry === "BFSI") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 9 9-5 9 5M5 10v7M9 10v7M15 10v7M19 10v7M3 20h18M2 8h20" /></svg>;
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19v-8M19 19v-8M5 15h14M7 11V7h5a4 4 0 0 1 4 4M4 19h16" /></svg>;
}

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

function PlatformFeatureIcon({ icon }: { icon: string }) {
  if (icon === "calls") return <svg viewBox="0 0 32 32"><path d="M8 5h5l2 6-3 2c1.8 4 3.2 5.4 7 7l2-3 6 2v5c0 2-1.5 3-3.5 3C13 26 6 19 5 8.5 5 6.5 6 5 8 5Z" /><path d="M20 7h7M24 3l4 4-4 4" /></svg>;
  if (icon === "api") return <svg viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="20" rx="5" /><path d="m10 19 3-3-3-3M16 20h6" /></svg>;
  if (icon === "handoff") return <svg viewBox="0 0 32 32"><path d="M11 15a5 5 0 1 1 10 0v3a5 5 0 0 1-10 0v-3Z" /><path d="M7 17v1a9 9 0 0 0 18 0v-1M16 27v3M5 9h5M5 9l3-3M5 9l3 3" /></svg>;
  if (icon === "workflow") return <svg viewBox="0 0 32 32"><rect x="12" y="3" width="8" height="7" rx="2" /><rect x="3" y="22" width="8" height="7" rx="2" /><rect x="21" y="22" width="8" height="7" rx="2" /><path d="M16 10v6M7 22v-6h18v6" /></svg>;
  if (icon === "language") return <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" /><path d="M4 16h24M16 4c4 4 6 8 6 12s-2 8-6 12M16 4c-4 4-6 8-6 12s2 8 6 12" /></svg>;
  if (icon === "latency") return <svg viewBox="0 0 32 32"><path d="M4 17h4l3-8 5 16 4-11 3 6h5" /><path d="M5 6h5M22 6h5" /></svg>;
  if (icon === "models") return <svg viewBox="0 0 32 32"><circle cx="10" cy="10" r="5" /><circle cx="22" cy="10" r="5" /><circle cx="16" cy="22" r="5" /><path d="m13 13 1.5 4M19 13l-1.5 4" /></svg>;
  if (icon === "enterprise") return <svg viewBox="0 0 32 32"><path d="M8 28V6h16v22M12 11h3M18 11h3M12 16h3M18 16h3M12 21h3M18 21h3M4 28h24" /></svg>;
  if (icon === "switching") return <svg viewBox="0 0 32 32"><path d="M7 10h17M20 6l4 4-4 4M25 22H8M12 18l-4 4 4 4" /></svg>;
  return <svg viewBox="0 0 32 32"><path d="M16 3 27 7v8c0 7-4 12-11 15C9 27 5 22 5 15V7Z" /><path d="M12 15v-2a4 4 0 0 1 8 0v2M11 15h10v7H11Z" /></svg>;
}

function PlatformSystemIcon({ icon }: { icon: "function" | "api" | "mcp" | "complete" | "llm" | "realtime" | "vision" }) {
  if (icon === "function") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h5M14 20h5M5 12h14M8 7l-3 5 3 5M16 7l3 5-3 5" /></svg>;
  if (icon === "api") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m9 10-3 2 3 2M14 15h4" /></svg>;
  if (icon === "mcp") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="6" height="6" rx="1.5" /><rect x="15" y="14" width="6" height="6" rx="1.5" /><path d="M9 7h3a3 3 0 0 1 3 3v4M9 17h3a3 3 0 0 0 3-3V10" /></svg>;
  if (icon === "complete") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="m8.5 12 2.3 2.3 4.8-5" /></svg>;
  if (icon === "llm") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7.5A3.5 3.5 0 0 1 8.5 4h7A3.5 3.5 0 0 1 19 7.5v5a3.5 3.5 0 0 1-3.5 3.5H11l-4 3v-3.6A3.5 3.5 0 0 1 5 12.5v-5Z" /><path d="M9 9h6M9 12h4" /></svg>;
  if (icon === "realtime") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h3l2-5 3 10 3-8 2 3h5" /><path d="M18 5h3v3" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h4l2-3h4l2 3h4v10H4V8Z" /><circle cx="12" cy="13" r="3" /></svg>;
}

function ArrowIcon() {
  return <svg className="vozon-inline-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5" /></svg>;
}

function IntegrationAppLogo({ app }: { app: (typeof appIntegrations)[number] }) {
  if (app.key === "hubspot") {
    return <Image alt="" height={38} src="/images/company-logos/hubspot.svg" width={38} />;
  }

  if (app.key === "salesforce") return <span className="vozon-app-salesforce">salesforce</span>;

  if (app.key === "zoho") return <Image alt="" height={42} src="/images/integrations/zoho.svg" width={42} />;
  if (app.key === "calendar") return <Image alt="" height={40} src="/images/integrations/google-calendar.svg" width={40} />;
  if (app.key === "calendly") return <Image alt="" height={40} src="/images/integrations/calendly.svg" width={40} />;
  if (app.key === "digitalbot") return <Image alt="" className="vozon-app-digitalbot" height={18} src="/images/digitalbot_orbit.png" width={72} />;
  if (app.key === "gmail") return <Image alt="" height={38} src="/images/integrations/gmail.svg" width={38} />;

  if (app.key === "twilio") {
    return <span className="vozon-app-twilio" aria-hidden="true">{[0, 1, 2, 3].map((dot) => <i key={dot} />)}</span>;
  }

  if (app.key === "exotel") return <span className="vozon-app-exotel">exo</span>;
  return <span className="vozon-app-crm">CRM</span>;
}

function GlowButton({ children, href }: { children: string; href: string }) {
  return (
    <Link
      className="vozon-glow-button inline-flex min-h-12 items-center justify-center rounded-[14px] px-7 text-sm font-black text-[#02110d]"
      href={href}
    >
      {children}
    </Link>
  );
}

export function HomePlatformSections() {
  const [selectedCodeTab, setSelectedCodeTab] = useState<CodeTab>("javascript");
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedAgentIndustry, setSelectedAgentIndustry] = useState<(typeof agentIndustries)[number]>("Ecommerce");
  const [activePlatformCard, setActivePlatformCard] = useState<number | null>(null);
  const [selectedFeatureTab, setSelectedFeatureTab] = useState<FeatureTab>("Conversations");
  const [demoLanguage, setDemoLanguage] = useState<DemoLanguage>("English");
  const [demoActive, setDemoActive] = useState(false);

  const selectedFeature = featuresByTab[selectedFeatureTab];
  const selectedDemo = demoLanguages[demoLanguage];

  return (
    <div className="vozon-home relative isolate overflow-x-clip bg-black text-white">
      <section id="product" className="relative flex min-h-[680px] w-full items-start justify-center overflow-hidden px-5 pb-12 pt-32 text-center sm:min-h-[700px] sm:px-8 sm:pt-36 lg:min-h-[720px] lg:pt-36">
        <AudioWaveHero />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(0,0,0,.76)_0%,rgba(0,0,0,.48)_34%,transparent_64%),radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,.2)_60%,rgba(0,0,0,.9)_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-[1180px]">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/45 px-4 py-2 text-xs font-semibold text-white/85 shadow-[inset_0_0_22px_rgba(255,255,255,0.04)] backdrop-blur">
          <span className="size-2 rounded-full bg-[#22f4d2] shadow-[0_0_14px_#22f4d2]" />
          Multilingual AI Phone Agents
        </div>
        <h1 className="mx-auto m-0 max-w-none text-[clamp(2.25rem,3.4vw,3.35rem)] font-black leading-[1.04] tracking-[-0.035em] text-white sm:leading-[0.98] lg:whitespace-nowrap">
          AI phone agents that{" "}
          <span className="bg-gradient-to-r from-white via-cyan-100 to-[#75fff0] bg-clip-text text-transparent">answer, act, and convert.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[760px] text-base leading-7 font-medium text-white/78 drop-shadow-[0_2px_12px_rgba(0,0,0,.9)] sm:text-lg sm:leading-8">
          Automate inbound and outbound calls, qualify leads, book appointments, and update your business systems—in every language, 24/7.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <GlowButton href="/dashboard">Build Your First Agent</GlowButton>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-[14px] border border-white/20 bg-black/45 px-7 text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur transition hover:border-[#75fff0]/55 hover:bg-white/10" href="/contact">
            Book a Live Demo
          </Link>
        </div>
        </div>
      </section>

      <section className="vozon-company-marquee-section relative overflow-hidden py-6 sm:py-8">
        <div className="relative z-10 mx-auto mb-9 max-w-4xl px-5 text-center sm:px-8">
          <h4 className="vozon-company-heading m-0 whitespace-nowrap text-white">
            Built to work with the tools teams use
          </h4>
        </div>

        <div className="vozon-company-marquee relative z-10 flex overflow-hidden py-3">
          {[0, 1].map((track) => (
            <div className="vozon-company-track flex min-w-full shrink-0 items-center gap-16 px-8" key={track}>
              {companyLogos.map((company) => (
                <div
                  className="vozon-company-logo inline-flex min-w-[180px] items-center justify-center gap-3"
                  key={`${track}-${company.name}`}
                >
                  <Image
                    alt={`${company.name} logo`}
                    className={`vozon-company-logo-image h-9 w-9 object-contain ${company.logoClassName ?? ""}`}
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

      <section
        aria-labelledby="vozon-platform-system-title"
        className="vozon-one-section relative w-full px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
      >
        <div className="vozon-one-glow" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <header className="vozon-one-heading">
            <span className="vozon-one-kicker"><i /> All-in-One Voice System</span>
            <h2 id="vozon-platform-system-title">
              Everything Your AI Agent Needs. <span>One Smart Platform.</span>
            </h2>
            <p>
              From speech understanding and AI reasoning to realtime responses and external tools,
              Vozon brings every voice layer together in one connected platform.
            </p>
          </header>

          <div
            className={`vozon-one-grid${activePlatformCard !== null ? " has-active-card" : ""}`}
            onMouseLeave={() => setActivePlatformCard(null)}
          >
            <article
              aria-pressed={activePlatformCard === 0}
              className={`vozon-one-card vozon-one-speech-card${activePlatformCard === 0 ? " is-active" : ""}${activePlatformCard !== null && activePlatformCard !== 0 ? " is-muted" : ""}`}
              onClick={() => setActivePlatformCard(activePlatformCard === 0 ? null : 0)}
              onFocus={() => setActivePlatformCard(0)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActivePlatformCard(activePlatformCard === 0 ? null : 0);
                }
              }}
              onMouseEnter={() => setActivePlatformCard(0)}
              role="button"
              tabIndex={0}
            >
              <header>
                <span>01 · SPEECH <i className="vozon-one-live-label">LIVE</i></span>
                <h3>Connected Speech Pipeline</h3>
                <p>Listen, understand intent, handle interruptions, and reply naturally across every customer conversation.</p>
                <div className="vozon-one-speech-points" aria-label="Voice platform capabilities">
                  <span>Natural turn-taking</span>
                  <span>12+ languages</span>
                  <span>24/7 ready</span>
                </div>
              </header>
              <div className="vozon-one-speech-map" aria-label="Turn detection, voice activity detection, speech-to-text, and text-to-speech connect to Vozon">
                <span className="vozon-one-call-status"><i /> Live conversation <b>00:42</b></span>
                <span className="vozon-one-speech-line vozon-one-line-a" aria-hidden="true" />
                <span className="vozon-one-speech-line vozon-one-line-b" aria-hidden="true" />
                <span className="vozon-one-speech-line vozon-one-line-c" aria-hidden="true" />
                <span className="vozon-one-speech-line vozon-one-line-d" aria-hidden="true" />
                <span className="vozon-one-node vozon-one-node-td"><i>TD</i><b>Turn Detection</b></span>
                <span className="vozon-one-node vozon-one-node-vad"><i>VAD</i><b>Voice Activity</b></span>
                <span className="vozon-one-node vozon-one-node-stt"><i>STT</i><b>Speech-to-Text</b></span>
                <span className="vozon-one-node vozon-one-node-tts"><i>TTS</i><b>Text-to-Speech</b></span>
                <span className="vozon-one-speech-core">
                  <i aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm-6 9a6 6 0 0 0 12 0M12 18v3M9 21h6" /></svg>
                  </i>
                  <b>Vozon Voice</b>
                  <span className="vozon-one-core-wave" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((bar) => <i key={bar} />)}
                  </span>
                </span>
              </div>
              <footer><span><i /> Noise-aware · interruption ready</span><b>Voice in → action out</b></footer>
            </article>

            <article
              aria-pressed={activePlatformCard === 1}
              className={`vozon-one-card vozon-one-brain-card${activePlatformCard === 1 ? " is-active" : ""}${activePlatformCard !== null && activePlatformCard !== 1 ? " is-muted" : ""}`}
              onClick={() => setActivePlatformCard(activePlatformCard === 1 ? null : 1)}
              onFocus={() => setActivePlatformCard(1)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActivePlatformCard(activePlatformCard === 1 ? null : 1);
                }
              }}
              onMouseEnter={() => setActivePlatformCard(1)}
              role="button"
              tabIndex={0}
            >
              <header>
                <span>02 · INTELLIGENCE</span>
                <h3>Centralized AI Intelligence</h3>
                <p>One agent layer coordinates your models, context, and every realtime decision.</p>
                <div className="vozon-one-card-points" aria-label="AI intelligence capabilities">
                  <span>Context memory</span>
                  <span>Model routing</span>
                  <span>Intent reasoning</span>
                </div>
              </header>
              <div className="vozon-one-console">
                <div className="vozon-one-console-bar"><span><i /> Live orchestration</span><b>•••</b></div>
                <div className="vozon-one-agent">
                  <span className="vozon-one-agent-brand">
                    <Image
                      alt=""
                      height={350}
                      src="/images/logo_2.svg"
                      style={{ height: "auto", width: 108 }}
                      width={1160}
                    />
                    <small>Integrated AI Solutions</small>
                  </span>
                  <span className="vozon-one-agent-copy"><b>Agent Layer</b><small>Voice · Text · Vision</small></span>
                  <em>Connected</em>
                </div>
                <div className="vozon-one-model-list">
                  <span><i><PlatformSystemIcon icon="llm" /></i><b>LLM</b><small>Language reasoning</small><em>Ready</em></span>
                  <span><i><PlatformSystemIcon icon="realtime" /></i><b>Realtime</b><small>Streaming response</small><em>Live</em></span>
                  <span><i><PlatformSystemIcon icon="vision" /></i><b>Vision AI</b><small>Visual understanding</small><em>Ready</em></span>
                </div>
              </div>
              <footer><span><i /> Models stay synchronized</span><b>Agent layer</b></footer>
            </article>

            <article
              aria-pressed={activePlatformCard === 2}
              className={`vozon-one-card vozon-one-tools-card${activePlatformCard === 2 ? " is-active" : ""}${activePlatformCard !== null && activePlatformCard !== 2 ? " is-muted" : ""}`}
              onClick={() => setActivePlatformCard(activePlatformCard === 2 ? null : 2)}
              onFocus={() => setActivePlatformCard(2)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActivePlatformCard(activePlatformCard === 2 ? null : 2);
                }
              }}
              onMouseEnter={() => setActivePlatformCard(2)}
              role="button"
              tabIndex={0}
            >
              <header>
                <span>03 · ACTIONS</span>
                <h3>External Services &amp; Tools</h3>
                <p>Connect approved tools so every conversation can complete real business tasks.</p>
                <div className="vozon-one-card-points" aria-label="External action capabilities">
                  <span>CRM updates</span>
                  <span>Bookings</span>
                  <span>Webhooks</span>
                </div>
              </header>
              <div className="vozon-one-tool-map" aria-label="Function calling, MCP, APIs, and GitHub connect Vozon to external services">
                <span className="vozon-one-tool-tile tile-function"><i><PlatformSystemIcon icon="function" /></i><b>Function</b></span>
                <span className="vozon-one-tool-tile tile-api"><i><PlatformSystemIcon icon="api" /></i><b>APIs</b></span>
                <span className="vozon-one-tool-tile tile-mcp"><i><PlatformSystemIcon icon="mcp" /></i><b>MCP</b></span>
                <span className="vozon-one-tool-tile tile-github">
                  <i aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.5.1.6-.2.6-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.5 9.5 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.6 4.9.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.2 9.2 0 0 0 12 2.8Z" /></svg>
                  </i>
                  <b>GitHub</b>
                </span>
                <span className="vozon-one-tool-core"><i><PlatformSystemIcon icon="complete" /></i><b>Task complete</b><small>External services</small></span>
              </div>
              <footer><span><i /> Secure tool calling</span><b>Action out</b></footer>
            </article>
          </div>
        </div>
      </section>

      <section className="vozon-how-section relative px-5 pb-4 pt-8 sm:px-8 sm:pb-5 sm:pt-10 lg:pb-6 lg:pt-12" aria-labelledby="vozon-how-title">
        <div className="vozon-how-shell relative z-10 mx-auto max-w-[1240px] overflow-hidden">
          <div className="vozon-how-intro">
            <div>
              <span className="vozon-how-kicker">How it works</span>
              <h3 className="vozon-platform-heading" id="vozon-how-title">
                Built for Developers Easy for Everyone
              </h3>
            </div>
            <p>
              Start with a guided visual workflow, or connect directly through the API when your team needs more control.
            </p>
          </div>

          <div className="vozon-how-column-headings" aria-hidden="true">
            <strong><span>Visual</span> No-code playground <i><ArrowIcon /></i></strong>
            <strong><span>Code</span> Developer APIs <i><ArrowIcon /></i></strong>
          </div>

          <div className="vozon-how-grid">
            <div className="vozon-how-flow">
              <article className="vozon-how-step vozon-how-step-one">
                <header><span><small>Step one</small><strong>Connect account</strong></span><b>1</b></header>
                <p>Sign in to your Vozon dashboard</p>
              </article>
              <article className="vozon-how-step vozon-how-step-two">
                <header><span><small>Step two</small><strong>Configure agent</strong></span><b>2</b></header>
                <p>Choose a template or build your agent from scratch</p>
              </article>
              <article className="vozon-how-step vozon-how-step-three">
                <header><span><small>Step three</small><strong>Start conversations</strong></span><b>3</b></header>
                <p>Launch calls, campaigns, or connect your phone number</p>
              </article>
            </div>

            <div className="vozon-code-area">
              <div className="vozon-code-window">
                <div className="vozon-code-toolbar">
                  <span className="vozon-code-lights" aria-hidden="true"><i /><i /><i /></span>
                  <span className="vozon-code-file">api-integration</span>
                  <div className="vozon-code-tabs" role="tablist" aria-label="API code examples">
                    {(Object.keys(codeExamples) as CodeTab[]).map((tab) => (
                      <button
                        aria-selected={selectedCodeTab === tab}
                        className={selectedCodeTab === tab ? "is-active" : ""}
                        key={tab}
                        onClick={() => {
                          setSelectedCodeTab(tab);
                          setCopiedCode(false);
                        }}
                        role="tab"
                        type="button"
                      >
                        {codeExamples[tab].label}
                      </button>
                    ))}
                  </div>
                  <button
                    className="vozon-code-copy"
                    onClick={() => {
                      void navigator.clipboard?.writeText(codeExamples[selectedCodeTab].code);
                      setCopiedCode(true);
                    }}
                    type="button"
                  >
                    {copiedCode ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="vozon-code-body" role="tabpanel">
                  <div className="vozon-code-context">
                    <span><i /> POST</span>
                    <code>/api/voice/outbound-calls</code>
                    <small>Secure endpoint</small>
                  </div>
                  <pre>
                    {codeExamples[selectedCodeTab].code.split("\n").map((line, index) => (
                      <span className="vozon-code-line" key={`${selectedCodeTab}-${index}`}>
                        <i>{index + 1}</i><code>{line || " "}</code>
                      </span>
                    ))}
                  </pre>
                </div>
              </div>
              <p className="vozon-code-note"><span>●</span> Production-ready API · Secure authentication · Fast setup</p>
            </div>
          </div>
        </div>
      </section>

      <section className="vozon-feature-suite relative overflow-hidden px-5 pb-4 pt-6 sm:px-8 sm:pb-5 sm:pt-8 lg:pb-6 lg:pt-10" aria-labelledby="vozon-feature-title">
        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#45ddce]/24 bg-[#45ddce]/[0.07] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#75fff0]">
              <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_12px_#45ddce]" />
              Features
            </div>
            <h2 className="vozon-platform-heading mx-auto m-0 max-w-4xl text-white" id="vozon-feature-title">
              Everything your voice agents need
              <span className="block text-white">to perform in the real world.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/56 sm:text-base">
              With integrated speech, telephony, and APIs, vozon.ai provides everything you need to take your idea into secure, production-ready deployment.
            </p>
          </div>

          <div className="vozon-feature-tabs" role="tablist" aria-label="Platform feature categories">
            {featureTabs.map((tab) => (
              <button
                aria-controls={`feature-panel-${tab.toLowerCase()}`}
                aria-selected={selectedFeatureTab === tab}
                className={selectedFeatureTab === tab ? "is-active" : ""}
                id={`feature-tab-${tab.toLowerCase()}`}
                key={tab}
                onClick={() => setSelectedFeatureTab(tab)}
                role="tab"
                type="button"
              >
                <small>{featureTabMeta[tab].number}</small>
                <span><PlatformFeatureIcon icon={featuresByTab[tab].icon} /></span>
                <strong>{tab}<i>{featureTabMeta[tab].hint}</i></strong>
              </button>
            ))}
          </div>

          <div
            aria-labelledby={`feature-tab-${selectedFeatureTab.toLowerCase()}`}
            className={`vozon-feature-panel is-${selectedFeatureTab.toLowerCase()}`}
            id={`feature-panel-${selectedFeatureTab.toLowerCase()}`}
            key={selectedFeatureTab}
            role="tabpanel"
          >
            <div className="vozon-feature-panel-copy">
              <span className="vozon-feature-panel-label"><i /> {selectedFeature.label}</span>
              <h3>{selectedFeature.title}</h3>
              <p>{selectedFeature.body}</p>
              <Link href="/dashboard">Explore in the platform</Link>
            </div>

            <div className="vozon-feature-panel-list">
              {selectedFeature.items.map((feature) => (
                <article key={feature.title}>
                  <span className="vozon-feature-item-icon"><PlatformFeatureIcon icon={feature.icon} /></span>
                  <div><h4>{feature.title}</h4><p>{feature.body}</p></div>
                </article>
              ))}
            </div>

            <aside className="vozon-feature-panel-metric">
              <header className="vozon-feature-animation-head">
                <span>Live capability flow</span>
                <b>Live</b>
              </header>

              <div className="vozon-feature-card-stage" aria-hidden="true">
                <span className="vozon-feature-card-rail"><i /></span>
                {selectedFeature.items.map((feature, index) => (
                  <article className={`vozon-feature-motion-card is-card-${index + 1}`} key={feature.title}>
                    <div>
                      <small>Step {String(index + 1).padStart(2, "0")}</small>
                      <h5>{feature.title}</h5>
                    </div>
                  </article>
                ))}
              </div>

              <footer className="vozon-feature-metric-strip">
                <div><strong>{selectedFeature.metric}</strong><small>{selectedFeature.metricLabel}</small></div>
                <span>Optimized</span>
              </footer>
            </aside>
          </div>
        </div>
      </section>


      <section
        id="integrations"
        className="vozon-integrations-section relative overflow-hidden px-5 py-14 sm:px-8 lg:py-[72px]"
      >
        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#45ddce]/24 bg-[#45ddce]/[0.07] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#75fff0]">
              <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_12px_#45ddce]" />
              Launch workflow
            </div>

            <h2 className="vozon-platform-heading m-0 max-w-3xl text-white">
              Go live in four clear <span>implementation steps.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              Configure your agent, choose the right model and voice, then deploy it across your preferred channels.
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
                    <div className="mb-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#75fff0]">
                      <span className="h-px w-7 bg-[#45ddce]" />
                      Step {step.number}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="vozon-integration-icon grid size-[52px] shrink-0 place-items-center rounded-[15px] border border-[#45ddce]/28 bg-[#45ddce]/10 text-[#9dfff4]">
                        <IntegrationIcon icon={step.icon} />
                      </div>
                      <h3 className="m-0 text-xl font-black leading-tight text-white sm:text-2xl">{step.title}</h3>
                    </div>

                    <ul className="mt-5 space-y-3.5 p-0 text-sm leading-6 text-white/55 sm:text-base">
                      {step.bullets.map((bullet) => (
                        <li className="flex gap-3" key={`${step.number}-${bullet.strong}`}>
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#45ddce]" />
                          <span>
                            {bullet.before}
                            <strong className="font-black text-white/88">{bullet.strong}</strong>
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

                  <div
                    className={`vozon-integration-image relative min-h-[260px] sm:min-h-[320px] lg:min-h-[360px] ${
                      index === 0 ? "vozon-integration-image-flow " : ""
                    }${
                      index % 2 !== 0
                        ? "vozon-integration-image-left lg:order-1"
                        : "vozon-integration-image-right lg:order-2"
                    }`}
                  >
                    <div className="vozon-integration-image-placeholder absolute inset-0 grid place-items-center">
                      <Image
                        src={step.src}
                        alt={`${step.title} workflow`}
                        fill
                        className="object-contain object-center"
                        loading={index === 0 ? "eager" : "lazy"}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="vozon-agent-showcase relative overflow-hidden px-5 py-16 sm:px-8 lg:py-20"
        aria-labelledby="vozon-agent-showcase-title"
      >
        <div className="vozon-agent-showcase-glow" aria-hidden="true" />
        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-3xl text-center">
            <div className="vozon-agent-showcase-eyebrow">Agent gallery</div>
            <h2 className="vozon-platform-heading m-0 text-white" id="vozon-agent-showcase-title">
              AI agents that turn <span>every call into action.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
              Meet ready-to-call Vozon agents built for the conversations that keep Indian businesses moving.
            </p>
          </div>

          <div className="vozon-agent-tabs" aria-label="Agent industries" role="tablist">
            {agentIndustries.map((industry) => (
              <button
                aria-selected={selectedAgentIndustry === industry}
                className={selectedAgentIndustry === industry ? "is-active" : ""}
                key={industry}
                onClick={() => setSelectedAgentIndustry(industry)}
                role="tab"
                type="button"
              >
                <AgentIndustryIcon industry={industry} />
                <span>{industry}</span>
              </button>
            ))}
          </div>

          <div className="vozon-agent-grid" role="tabpanel">
            {agentsByIndustry[selectedAgentIndustry].map((agent) => (
              <article className="vozon-agent-card" key={agent.title}>
                <div className="vozon-agent-card-main">
                  <div className="vozon-agent-identity">
                    <span className="vozon-agent-type-icon"><AgentTypeIcon title={agent.title} /></span>
                    <div className="min-w-0">
                    <h3>{agent.title}</h3>
                    <div className="vozon-agent-tags">
                      {agent.tags.map((tag) => <span key={`${agent.title}-${tag}`}>{tag}</span>)}
                    </div>
                    <p>{agent.description}</p>
                  </div>
                  </div>

                  <Link aria-label={`Explore ${agent.title}`} className="vozon-agent-explore" href="/dashboard/agents">
                    <span>
                      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 6 9 6-9 6V6Z" /></svg>
                    </span>
                    <strong>Explore Agent</strong>
                    <i><ArrowIcon /></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vozon-apps-section relative overflow-hidden px-5 pb-0 pt-8 sm:px-8 sm:pb-0 sm:pt-10 lg:pb-0 lg:pt-12" id="app-integrations" aria-labelledby="vozon-apps-title">
        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-4xl text-center">
            <div className="vozon-apps-eyebrow"><span /> Integrations</div>
            <h2 className="vozon-platform-heading mx-auto m-0 max-w-4xl text-white" id="vozon-apps-title">
              Integrations across your favorite platforms
            </h2>
            <Link className="vozon-apps-cta" href="/integrations">Explore integrations <span><ArrowIcon /></span></Link>
          </div>

          <div className="vozon-app-orbit mt-8" aria-label="Vozon app integration network">
            <span className="vozon-app-orbit-glow" aria-hidden="true" />
            <svg className="vozon-app-connections" viewBox="0 0 1120 590" preserveAspectRatio="none" aria-hidden="true">
              <ellipse className="vozon-app-track-base" cx="560" cy="600" rx="510" ry="470" />
              <ellipse className="vozon-app-track-base" cx="560" cy="600" rx="415" ry="385" />
              <ellipse className="vozon-app-track-base" cx="560" cy="600" rx="320" ry="300" />
              <ellipse className="vozon-app-track-flow" cx="560" cy="600" rx="510" ry="470" />
              <ellipse className="vozon-app-track-flow" cx="560" cy="600" rx="415" ry="385" />
              <ellipse className="vozon-app-track-flow" cx="560" cy="600" rx="320" ry="300" />
              <ellipse className="vozon-app-track-base vozon-app-track-core" cx="560" cy="600" rx="230" ry="220" />
              <ellipse className="vozon-app-track-flow vozon-app-track-core" cx="560" cy="600" rx="230" ry="220" />
            </svg>

            <svg className="vozon-app-moving-nodes" viewBox="0 0 1120 590" preserveAspectRatio="none" aria-hidden="true">
              {appIntegrations.map((app) => {
                const motion = appOrbitMotion[app.orbit];
                const isDigitalBot = app.key === "digitalbot";

                return (
                  <g key={`moving-${app.key}`}>
                    <animateMotion
                      begin={`${app.delay}s`}
                      calcMode="linear"
                      dur={motion.duration}
                      keyPoints="0;1"
                      keyTimes="0;1"
                      path={motion.path}
                      repeatCount="indefinite"
                    />
                    <foreignObject
                      height={isDigitalBot ? 80 : 90}
                      width={isDigitalBot ? 200 : 90}
                      x={isDigitalBot ? -100 : -45}
                      y={isDigitalBot ? -40 : -45}
                    >
                      <div className={`vozon-app-moving-item ${isDigitalBot ? "vozon-app-moving-item-digitalbot" : ""}`}>
                        <div className="vozon-app-moving-icon">
                          <IntegrationAppLogo app={app} />
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>

            {appIntegrations.map((app) => (
              <article
                className={`vozon-app-node vozon-app-node-${app.position} vozon-app-orbit-${app.orbit} ${app.key === "digitalbot" ? "vozon-app-node-digitalbot" : ""}`}
                key={app.key}
                style={{ "--app-delay": `${app.delay}s` } as CSSProperties}
              >
                <div className="vozon-app-node-icon"><IntegrationAppLogo app={app} /></div>
                <span className="vozon-app-node-name">{app.name}</span>
              </article>
            ))}

            <div className="vozon-app-hub">
              <span className="vozon-app-hub-symbol" aria-hidden="true">
                <Image
                  alt=""
                  className="vozon-app-hub-logo"
                  height={350}
                  src="/images/logo_2.svg"
                  width={1160}
                />
              </span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .vozon-home {
          font-family: var(--font-site-sans), ui-sans-serif, system-ui, sans-serif;
          background: #000;
          background-color: #000;
        }

        .vozon-inline-arrow {
          display: block;
          width: 16px;
          height: 16px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 2;
        }

        .vozon-agent-showcase {
          background: #000 !important;
        }

        .vozon-agent-showcase-glow {
          display: none;
        }

        .vozon-agent-showcase-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          min-height: 26px;
          margin-bottom: 1.1rem;
          border: 1px solid rgba(29,225,188,0.46);
          border-radius: 999px;
          background: #000;
          padding: 0.4rem 0.9rem;
          color: #9dfff4;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.66rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .vozon-agent-showcase-eyebrow::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #20e0bc;
        }

        .vozon-agent-tabs {
          display: flex;
          width: min(100%, 1040px);
          max-width: 100%;
          margin: 2.25rem auto 0;
          overflow-x: auto;
          border: 1px solid rgba(54,117,122,0.38);
          border-radius: 999px;
          background: #010405;
          padding: 0 1rem;
          scrollbar-width: none;
        }

        .vozon-agent-tabs::-webkit-scrollbar {
          display: none;
        }

        .vozon-agent-tabs button {
          position: relative;
          display: inline-flex;
          min-width: 150px;
          min-height: 52px;
          flex: 1 0 auto;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          color: rgba(255,255,255,0.68);
          font-size: 0.78rem;
          font-weight: 800;
          outline: none;
        }

        .vozon-agent-tabs button > svg {
          width: 22px;
          height: 22px;
          flex: 0 0 auto;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.6;
        }

        .vozon-agent-tabs button:hover {
          color: rgba(255,255,255,0.82);
        }

        .vozon-agent-tabs button.is-active {
          background: transparent;
          box-shadow: none;
          color: #75fff0;
        }

        .vozon-agent-tabs button:focus,
        .vozon-agent-tabs button:focus-visible {
          background: transparent;
          box-shadow: none;
          color: #75fff0;
          outline: none;
        }

        .vozon-agent-grid {
          max-width: 1240px;
          margin: 2.25rem auto 0;
          overflow: hidden;
          border: 1px solid rgba(75,173,166,0.3);
          border-radius: 24px;
          background: #000;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.018),
            0 24px 80px rgba(0,0,0,0.34),
            0 0 34px rgba(32,224,188,0.045);
        }

        .vozon-agent-card {
          --agent-row-accent: #20e0bc;
          position: relative;
          min-width: 0;
          overflow: hidden;
          border-bottom: 1px solid rgba(82,154,157,0.18);
          background: #000;
          padding: 1.25rem 1.35rem;
        }

        .vozon-agent-card:last-child {
          border-bottom: 0;
        }

        .vozon-agent-card:nth-child(2) {
          --agent-row-accent: #29bfff;
        }

        .vozon-agent-card:nth-child(3) {
          --agent-row-accent: #42df9b;
        }

        .vozon-agent-card:nth-child(4) {
          --agent-row-accent: #a98bff;
        }

        .vozon-agent-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 3% 50%, color-mix(in srgb, var(--agent-row-accent) 8%, transparent), transparent 24%),
            linear-gradient(90deg, color-mix(in srgb, var(--agent-row-accent) 3%, transparent), transparent 42%);
          pointer-events: none;
        }

        .vozon-agent-card::after {
          content: "";
          position: absolute;
          top: 24px;
          bottom: 24px;
          left: 0;
          width: 2px;
          border-radius: 999px;
          background: var(--agent-row-accent);
          box-shadow: 0 0 14px color-mix(in srgb, var(--agent-row-accent) 55%, transparent);
        }

        .vozon-agent-card-main {
          position: relative;
          z-index: 1;
          display: grid;
          min-height: 106px;
          grid-template-columns: minmax(300px, 1fr) 140px;
          align-items: center;
          gap: 1.5rem;
        }

        .vozon-agent-identity {
          display: grid;
          min-width: 0;
          grid-template-columns: 56px minmax(0, 1fr);
          align-items: center;
          gap: 1rem;
        }

        .vozon-agent-type-icon {
          display: grid;
          width: 50px;
          height: 50px;
          place-items: center;
          border: 1px solid var(--agent-row-accent);
          border-radius: 50%;
          background:
            radial-gradient(circle, color-mix(in srgb, var(--agent-row-accent) 10%, transparent), transparent 70%);
          color: color-mix(in srgb, var(--agent-row-accent) 76%, white);
          box-shadow:
            inset 0 0 0 5px rgba(0,0,0,0.72),
            0 0 18px color-mix(in srgb, var(--agent-row-accent) 10%, transparent);
        }

        .vozon-agent-type-icon svg {
          width: 24px;
          height: 24px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.6;
        }

        .vozon-agent-card h3 {
          margin: 0;
          color: #fff;
          font-size: 1.15rem;
          font-weight: 850;
          letter-spacing: -0.02em;
        }

        .vozon-agent-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-top: 0.6rem;
        }

        .vozon-agent-tags span {
          border-radius: 4px;
          background: #111922;
          padding: 0.3rem 0.55rem;
          color: rgba(255,255,255,0.75);
          font-size: 0.62rem;
          font-weight: 700;
          line-height: 1;
        }

        .vozon-agent-card p {
          max-width: 370px;
          margin: 0.6rem 0 0;
          color: rgba(220,230,235,0.62);
          font-size: 0.78rem;
          line-height: 1.6;
        }

        .vozon-agent-explore {
          display: grid;
          min-height: 94px;
          place-items: center;
          align-content: center;
          gap: 0.55rem;
          border-left: 1px solid rgba(82,154,157,0.2);
          color: color-mix(in srgb, var(--agent-row-accent) 80%, white);
          text-align: center;
        }

        .vozon-agent-explore > span {
          display: grid;
          width: 46px;
          height: 46px;
          place-items: center;
          border: 1px solid var(--agent-row-accent);
          border-radius: 50%;
          background: color-mix(in srgb, var(--agent-row-accent) 7%, transparent);
          box-shadow: 0 0 20px color-mix(in srgb, var(--agent-row-accent) 10%, transparent);
        }

        .vozon-agent-explore svg {
          width: 22px;
          height: 22px;
          fill: currentColor;
          stroke: none;
        }

        .vozon-agent-explore strong {
          font-size: 0.7rem;
        }

        .vozon-agent-explore i {
          font-size: 0.9rem;
          font-style: normal;
        }

        .vozon-apps-section {
          background: #000;
        }

        .vozon-apps-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 1.25rem;
          color: #75fff0;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .vozon-apps-eyebrow span {
          width: 8px;
          height: 8px;
          border-radius: 2px 8px 2px 8px;
          background: #45ddce;
          box-shadow: 0 0 11px rgba(69,221,206,0.7);
        }

        .vozon-apps-cta {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          gap: 0.8rem;
          margin-top: 1.7rem;
          border: 1px solid rgba(255,255,255,0.24);
          border-radius: 12px;
          background: rgba(255,255,255,0.035);
          padding: 0 0.75rem 0 1.2rem;
          color: #fff;
          font-size: 0.78rem;
          font-weight: 800;
          transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .vozon-apps-cta span {
          display: grid;
          width: 32px;
          height: 32px;
          place-items: center;
          border-radius: 8px;
          background: #45ddce;
          color: #03120f;
          font-size: 0.9rem;
        }

        .vozon-apps-cta:hover {
          border-color: rgba(117,255,240,0.42);
          background: rgba(69,221,206,0.06);
          transform: translateY(-2px);
        }

        .vozon-app-orbit {
          position: relative;
          width: min(100%, 1040px);
          height: 500px;
          margin-inline: auto;
          overflow: hidden;
          isolation: isolate;
        }

        .vozon-app-orbit::before {
          content: "";
          position: absolute;
          right: 5%;
          bottom: 0;
          left: 5%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(117,255,240,0.42), transparent);
          box-shadow: 0 0 22px rgba(69,221,206,0.3);
        }

        .vozon-app-ring {
          position: absolute;
          z-index: 0;
          bottom: -215px;
          left: 50%;
          border: 1px solid rgba(69,221,206,0.16);
          border-radius: 50%;
          transform: translateX(-50%);
          box-shadow: inset 0 0 28px rgba(69,221,206,0.018);
        }

        .vozon-app-ring-one {
          width: 96%;
          height: 650px;
        }

        .vozon-app-ring-two {
          bottom: -158px;
          width: 72%;
          height: 500px;
          border-color: rgba(105,200,255,0.16);
        }

        .vozon-app-ring-three {
          bottom: -98px;
          width: 47%;
          height: 350px;
          border-color: rgba(169,155,255,0.15);
        }

        .vozon-app-orbit-glow {
          position: absolute;
          z-index: 0;
          bottom: -95px;
          left: 50%;
          width: 360px;
          height: 200px;
          border-radius: 50%;
          background: rgba(69,221,206,0.18);
          filter: blur(60px);
          transform: translateX(-50%);
          opacity: 0.7;
        }

        .vozon-app-connections {
          position: absolute;
          inset: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
        }

        .vozon-app-moving-nodes {
          position: absolute;
          inset: 0;
          z-index: 3;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
        }

        .vozon-app-moving-nodes foreignObject {
          overflow: visible;
        }

        .vozon-app-moving-item {
          display: grid;
          width: 90px;
          justify-items: center;
          gap: 0.45rem;
          padding-top: 7px;
        }

        .vozon-app-moving-item-digitalbot {
          width: 200px;
          height: 80px;
          align-items: center;
          padding-top: 0;
        }

        .vozon-app-moving-item-digitalbot .vozon-app-moving-icon {
          width: 200px;
          height: 80px;
        }

        .vozon-app-moving-icon {
          display: grid;
          width: 76px;
          height: 76px;
          place-items: center;
          overflow: visible;
          border: 0;
          background: transparent;
          box-shadow: none;
        }

        .vozon-app-moving-icon img {
          width: 38px;
          height: auto;
          max-height: 38px;
          object-fit: contain;
        }

        .vozon-app-moving-icon > *,
        .vozon-app-node-icon > * {
          transform: scale(1.28);
          transform-origin: center;
        }

        .vozon-app-moving-icon img.vozon-app-digitalbot,
        .vozon-app-node-icon img.vozon-app-digitalbot {
          width: 150px;
          height: auto;
          max-width: none;
          max-height: 58px;
          filter: drop-shadow(0 0 6px rgba(241,94,45,.28));
          transform: none;
        }

        .vozon-app-track-base {
          fill: none;
          stroke: rgba(69,221,206,0.25);
          stroke-width: 1.25;
          filter: drop-shadow(0 0 3px rgba(69,221,206,0.18));
        }

        .vozon-app-track-base:nth-child(2) {
          stroke: rgba(105,200,255,0.2);
        }

        .vozon-app-track-base:nth-child(3) {
          stroke: rgba(169,155,255,0.19);
        }

        .vozon-app-track-flow {
          fill: none;
          stroke: rgba(117,255,240,0.65);
          stroke-width: 1.65;
          stroke-linecap: round;
          stroke-dasharray: 150 2600;
          filter: drop-shadow(0 0 4px rgba(69,221,206,0.55));
          opacity: 0.72;
          animation: vozonAppConnectionMove 5.8s linear infinite;
        }

        .vozon-app-track-flow:nth-child(5) {
          stroke: rgba(105,200,255,0.58);
          animation-duration: 4.2s;
        }

        .vozon-app-track-flow:nth-child(6) {
          stroke: rgba(169,155,255,0.56);
          animation-duration: 4.8s;
        }

        .vozon-app-track-base.vozon-app-track-core {
          stroke: rgba(241,94,45,0.2);
        }

        .vozon-app-track-flow.vozon-app-track-core {
          stroke: rgba(255,126,72,0.52);
          animation-duration: 4.2s;
        }

        .vozon-app-node {
          --app-delay: 0s;
          --orbit-duration: 28s;
          position: absolute;
          z-index: 3;
          display: none;
          width: 94px;
          justify-items: center;
          gap: 0.55rem;
          transform: translate(-50%, -50%);
          animation: vozonAppFloat 4.8s ease-in-out var(--app-delay) infinite;
        }

        @supports (offset-path: ellipse(40% 80% at 50% 120%)) {
          .vozon-app-node {
            top: 0;
            left: 0;
            offset-anchor: center;
            offset-rotate: 0deg;
            transform: none;
            animation: vozonAppTravel var(--orbit-duration) ease-in-out var(--app-delay) infinite alternate;
          }

          .vozon-app-orbit-outer {
            --orbit-duration: 54s;
            offset-path: ellipse(45.5% 98% at 50% 125%);
          }

          .vozon-app-orbit-middle {
            --orbit-duration: 48s;
            offset-path: ellipse(37% 80.2% at 50% 125%);
          }

          .vozon-app-orbit-inner {
            --orbit-duration: 42s;
            offset-path: ellipse(28.5% 62.5% at 50% 125%);
          }

          .vozon-app-node:hover {
            animation-play-state: paused;
          }
        }

        .vozon-app-node-name {
          display: none;
          color: rgba(255,255,255,0.56);
          font-size: 0.65rem;
          font-weight: 800;
          text-align: center;
        }

        .vozon-app-node-icon {
          display: grid;
          width: 64px;
          height: 64px;
          place-items: center;
          overflow: visible;
          border: 0;
          background: transparent;
          box-shadow: none;
          transition: transform 180ms ease;
        }

        .vozon-app-node:hover .vozon-app-node-icon {
          transform: translateY(-3px);
        }

        .vozon-app-node-icon img {
          width: 36px;
          height: auto;
          max-height: 36px;
        }

        .vozon-app-node-outer-left { top: 58%; left: 9%; }
        .vozon-app-node-outer-right { top: 58%; left: 91%; }
        .vozon-app-node-upper-left { top: 31%; left: 23%; }
        .vozon-app-node-upper-right { top: 31%; left: 77%; }
        .vozon-app-node-top-center { top: 17%; left: 50%; }
        .vozon-app-node-middle-left { top: 54%; left: 32%; }
        .vozon-app-node-middle-center { top: 46%; left: 50%; }
        .vozon-app-node-middle-right { top: 54%; left: 68%; }
        .vozon-app-node-lower-right { top: 70%; left: 78%; }

        .vozon-app-salesforce {
          display: grid;
          width: 53px;
          height: 34px;
          place-items: center;
          border-radius: 50%;
          background: #20a7df;
          color: #fff !important;
          font-size: 0.46rem !important;
          font-weight: 900 !important;
          letter-spacing: -0.04em;
        }

        .vozon-app-zoho {
          display: flex;
          gap: 1px;
          transform: rotate(-3deg);
        }

        .vozon-app-zoho i {
          display: grid;
          width: 14px;
          height: 20px;
          place-items: center;
          border-radius: 2px;
          background: #e84343;
          color: #fff;
          font-size: 0.48rem;
          font-style: normal;
          font-weight: 900;
        }

        .vozon-app-zoho i:nth-child(2) { background: #2e7adf; }
        .vozon-app-zoho i:nth-child(3) { background: #e9b329; }
        .vozon-app-zoho i:nth-child(4) { background: #2cad61; }

        .vozon-app-crm {
          display: grid;
          width: 49px;
          height: 37px;
          place-items: center;
          border: 1px solid rgba(117,255,240,0.34);
          border-radius: 10px;
          background: rgba(69,221,206,0.1);
          color: #75fff0 !important;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.63rem !important;
          font-weight: 900 !important;
        }

        .vozon-app-calendar {
          position: relative;
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border-radius: 7px;
          background: linear-gradient(135deg, #4285f4 0 48%, #34a853 48% 65%, #fbbc04 65% 80%, #ea4335 80%);
          padding: 5px;
        }

        .vozon-app-calendar i {
          display: grid;
          width: 100%;
          height: 100%;
          place-items: center;
          border-radius: 4px;
          background: #fff;
          color: #4285f4;
          font-size: 0.7rem;
          font-style: normal;
          font-weight: 900;
        }

        .vozon-app-calendly {
          color: #15b8dc !important;
          font-family: Georgia, serif;
          font-size: 2.45rem !important;
          font-weight: 900 !important;
          line-height: 1;
        }

        .vozon-app-gmail {
          background: linear-gradient(135deg, #ea4335 0 44%, #fbbc04 44% 56%, #4285f4 56% 72%, #34a853 72%);
          background-clip: text;
          color: transparent !important;
          font-family: Arial, sans-serif;
          font-size: 2.1rem !important;
          font-weight: 900 !important;
          line-height: 1;
        }

        .vozon-app-twilio {
          display: grid;
          width: 43px;
          height: 43px;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          place-content: center;
          border: 3px solid #f22f46;
          border-radius: 50%;
          padding: 7px;
        }

        .vozon-app-twilio i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f22f46;
        }

        .vozon-app-exotel {
          color: #ff8b37 !important;
          font-family: var(--font-geist-mono), monospace;
          font-size: 1.1rem !important;
          font-weight: 900 !important;
          letter-spacing: -0.08em;
        }

        .vozon-app-hub {
          position: absolute;
          z-index: 4;
          bottom: -20px;
          left: 50%;
          display: grid;
          width: 112px;
          height: 112px;
          place-items: center;
          border: 1px solid rgba(117,255,240,0.42);
          border-radius: 50%;
          background:
            radial-gradient(circle at 38% 24%, rgba(172,255,247,0.2), transparent 30%),
            radial-gradient(circle at 50% 50%, #123b34, #061713 68%);
          box-shadow:
            0 0 34px rgba(69,221,206,0.28),
            0 0 76px rgba(69,221,206,0.16),
            inset 0 1px rgba(255,255,255,0.12),
            inset 0 0 28px rgba(69,221,206,0.08);
          transform: translateX(-50%);
        }

        .vozon-app-hub::before,
        .vozon-app-hub::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .vozon-app-hub::before {
          inset: -10px;
          border: 1px solid rgba(117,255,240,0.16);
          box-shadow: 0 0 24px rgba(69,221,206,0.18);
        }

        .vozon-app-hub::after {
          inset: 8px;
          border: 1px solid rgba(255,255,255,0.07);
        }

        .vozon-app-hub-symbol {
          position: relative;
          display: block;
          width: 73px;
          height: 66px;
          overflow: hidden;
          filter: drop-shadow(0 0 14px rgba(97,255,240,0.42));
        }

        .vozon-app-hub-logo {
          position: absolute;
          top: 0;
          left: 0;
          width: auto;
          max-width: none;
          height: 66px;
          object-fit: none;
        }

        @keyframes vozonAppFloat {
          0%, 100% { margin-top: 0; }
          50% { margin-top: -7px; }
        }

        @keyframes vozonAppTravel {
          from { offset-distance: 58%; }
          to { offset-distance: 92%; }
        }

        @keyframes vozonAppConnectionMove {
          to { stroke-dashoffset: -2750; }
        }

        @media (max-width: 1050px) {
          .vozon-agent-card-main {
            grid-template-columns: minmax(0, 1fr) 120px;
          }
        }

        @media (max-width: 760px) {
          .vozon-agent-card {
            padding: 1.35rem 1.15rem;
          }

          .vozon-agent-card-main {
            grid-template-columns: 1fr;
          }

          .vozon-agent-explore {
            min-height: 56px;
            grid-template-columns: auto auto auto;
            justify-content: start;
            border-top: 1px solid rgba(82,154,157,0.18);
            border-left: 0;
            padding: 0.85rem 0 0 72px;
          }

          .vozon-agent-explore > span {
            width: 40px;
            height: 40px;
          }

          .vozon-agent-tabs {
            width: 100%;
            justify-content: flex-start;
          }

          .vozon-agent-tabs button {
            min-width: 104px;
          }

          .vozon-app-orbit {
            display: grid;
            height: auto;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1.4rem 0.5rem;
            overflow: visible;
            padding: 1rem 0 0;
          }

          .vozon-app-orbit::before,
          .vozon-app-ring,
          .vozon-app-orbit-glow,
          .vozon-app-connections,
          .vozon-app-moving-nodes {
            display: none;
          }

          .vozon-app-node {
            display: grid;
            position: static;
            width: auto;
            offset-path: none;
            transform: none;
            animation: none;
          }

          .vozon-app-node-icon {
            width: 60px;
            height: 60px;
            border-radius: 15px;
          }

          .vozon-app-node-digitalbot {
            grid-column: 1 / -1;
            margin-block: 0.35rem;
          }

          .vozon-app-node-digitalbot .vozon-app-node-icon {
            width: 170px;
            height: 58px;
          }

          .vozon-app-hub {
            position: static;
            grid-column: 1 / -1;
            grid-row: 1;
            width: 112px;
            height: 112px;
            margin: 0 auto 1.3rem;
            transform: none;
          }
        }

        @media (max-width: 420px) {
          .vozon-agent-grid {
            border-radius: 18px;
          }

          .vozon-agent-card {
            padding: 1.25rem 0.9rem;
          }

          .vozon-agent-identity {
            grid-template-columns: 48px minmax(0, 1fr);
            gap: 0.85rem;
          }

          .vozon-agent-type-icon {
            width: 46px;
            height: 46px;
          }

          .vozon-agent-explore {
            padding-left: 0;
          }

          .vozon-app-orbit {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vozon-app-moving-nodes {
            display: none;
          }

          .vozon-app-node {
            display: grid;
            offset-path: none;
            animation: none;
          }

          .vozon-app-track-flow {
            animation: none;
          }
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
          scrollbar-width: none;
        }

        .vozon-integration-rail::-webkit-scrollbar {
          display: none;
        }

        .vozon-integration-card {
          overflow: visible;
          border-left: 1px solid rgba(117,255,240,0.12);
          background: transparent;
          box-shadow: none;
          transition: transform 200ms ease, background 200ms ease;
        }

        .vozon-integration-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 18% 0%, rgba(117,255,240,0.1), transparent 38%);
          opacity: 0.68;
        }

        .vozon-integration-card > :not(.vozon-integration-step-number) {
          position: relative;
          z-index: 1;
        }

        .vozon-integration-step-number {
          position: absolute;
          right: 1.25rem;
          top: 1.25rem;
          z-index: 2;
          pointer-events: none;
        }

        .vozon-integration-card:hover {
          transform: translateY(-4px);
          background: radial-gradient(circle at 18% 0%, rgba(117,255,240,0.07), transparent 60%);
        }

        .vozon-integration-icon {
          background:
            linear-gradient(135deg, rgba(72,219,139,0.18), rgba(32,244,208,0.12)),
            rgba(255,255,255,0.045);
          box-shadow:
            inset 0 0 18px rgba(117,255,240,0.07),
            0 0 28px rgba(32,244,208,0.12);
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

        .vozon-fit-section {
          background: transparent;
        }

        .vozon-fit-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(69,221,206,0.2);
          border-radius: 18px;
          background:
            linear-gradient(145deg, rgba(69,221,206,0.07), transparent 36%),
            rgba(2,12,10,0.82);
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.025),
            0 26px 90px rgba(0,0,0,0.28);
          backdrop-filter: blur(10px);
        }

        .vozon-fit-panel::before {
          content: "";
          position: absolute;
          top: 0;
          right: 8%;
          left: 8%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(117,255,240,0.7), transparent);
        }

        .vozon-fit-tabs,
        .vozon-fit-content {
          position: relative;
          z-index: 1;
        }

        .vozon-fit-tabs {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0.45rem;
          padding: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,5,3,0.35);
        }

        .vozon-fit-tab {
          --vozon-fit-tab-accent: 69, 221, 206;
          position: relative;
          display: flex;
          min-height: 66px;
          align-items: center;
          gap: 0.85rem;
          overflow: hidden;
          border: 1px solid rgba(var(--vozon-fit-tab-accent), 0.16);
          border-radius: 10px;
          background: rgba(var(--vozon-fit-tab-accent), 0.025);
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

        .vozon-fit-tab:hover {
          border-color: rgba(var(--vozon-fit-tab-accent), 0.34);
          background: rgba(var(--vozon-fit-tab-accent), 0.055);
        }

        .vozon-fit-tab-number {
          display: grid;
          width: 2rem;
          height: 2rem;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          background: rgba(var(--vozon-fit-tab-accent), 0.07);
          color: rgba(var(--vozon-fit-tab-accent), 0.76);
          font-size: 0.65rem;
          transition: border-color 180ms ease, background 180ms ease, color 180ms ease;
        }

        .vozon-fit-tab-label {
          min-width: 0;
          font-size: 0.92rem;
          line-height: 1.3;
        }

        .vozon-fit-tab-active {
          background:
            linear-gradient(110deg, rgba(var(--vozon-fit-tab-accent), 0.16), rgba(var(--vozon-fit-tab-accent), 0.055)),
            rgba(255,255,255,0.035);
          border-color: rgba(var(--vozon-fit-tab-accent), 0.3);
          box-shadow: inset 0 0 32px rgba(var(--vozon-fit-tab-accent), 0.055);
        }

        .vozon-fit-tab-active::after {
          opacity: 1;
          box-shadow: 0 0 12px rgba(var(--vozon-fit-tab-accent), 0.52);
        }

        .vozon-fit-tab-active .vozon-fit-tab-number {
          border-color: rgba(var(--vozon-fit-tab-accent), 0.44);
          background: rgb(var(--vozon-fit-tab-accent));
          color: #02110d;
          box-shadow: 0 0 20px rgba(var(--vozon-fit-tab-accent), 0.2);
        }

        .vozon-fit-content {
          border-right: 1px solid rgba(255,255,255,0.08);
          border-top: 2px solid rgba(var(--vozon-fit-accent), 0.68);
          background:
            radial-gradient(circle at 12% 0%, rgba(var(--vozon-fit-accent), 0.1), transparent 34%),
            linear-gradient(150deg, rgba(255,255,255,0.035), rgba(255,255,255,0.008)),
            rgba(2,12,10,0.34);
          transition: background 180ms ease, box-shadow 180ms ease;
        }

        .vozon-fit-content-grid {
          --vozon-fit-accent: 69, 221, 206;
          background: rgba(0,5,3,0.12);
        }

        .vozon-fit-theme-2 { --vozon-fit-accent: 143, 131, 232; }
        .vozon-fit-theme-3 { --vozon-fit-accent: 71, 170, 255; }
        .vozon-fit-theme-4 { --vozon-fit-accent: 242, 141, 69; }
        .vozon-fit-theme-5 { --vozon-fit-accent: 242, 210, 75; }

        .vozon-fit-content:last-child {
          border-right: 0;
        }

        .vozon-fit-content:hover {
          background:
            radial-gradient(circle at 12% 0%, rgba(var(--vozon-fit-accent), 0.16), transparent 38%),
            linear-gradient(150deg, rgba(var(--vozon-fit-accent), 0.07), rgba(255,255,255,0.012)),
            rgba(2,12,10,0.48);
          box-shadow: inset 0 1px 0 rgba(var(--vozon-fit-accent), 0.18);
        }

        .vozon-fit-index {
          border: 1px solid rgba(var(--vozon-fit-accent), 0.34);
          background: rgba(var(--vozon-fit-accent), 0.1);
          color: rgb(var(--vozon-fit-accent));
          box-shadow: inset 0 0 18px rgba(var(--vozon-fit-accent), 0.05);
        }

        .vozon-fit-kicker {
          color: rgba(var(--vozon-fit-accent), 0.82);
        }

        /* Restored image-based fit and integration layouts. */
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

        .vozon-integration-rail {
          position: relative;
          min-width: 0;
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
          overflow: hidden;
          border: 1px solid rgba(117,255,240,0.14);
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.018), 0 18px 45px rgba(0,0,0,0.12);
          transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
        }

        .vozon-integration-card::before {
          display: none;
        }

        .vozon-integration-card:hover {
          border-color: rgba(117,255,240,0.3);
          transform: translateY(-3px);
          background: linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012));
          box-shadow: inset 0 0 0 1px rgba(117,255,240,0.05), 0 24px 54px rgba(0,0,0,0.2);
        }

        .vozon-integration-image {
          border-bottom: 1px solid rgba(117,255,240,0.14);
          background:
            radial-gradient(circle at 22% 18%, rgba(69,221,206,0.13), transparent 35%),
            linear-gradient(135deg, rgba(13,36,38,0.92), rgba(5,14,19,0.96));
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

        .vozon-company-marquee-section {
          background: transparent;
        }

        .vozon-company-marquee {
          mask-image: linear-gradient(90deg, transparent 0%, black 9%, black 91%, transparent 100%);
        }

        .vozon-company-marquee::before {
          content: none;
        }

        .vozon-platform-map {
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          mask-image: linear-gradient(to bottom, transparent 0%, black 7%, black 91%, transparent 100%);
        }

        .vozon-one-section {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background: #000;
          font-family: var(--font-site-sans), ui-sans-serif, system-ui, sans-serif;
        }

        .vozon-one-section::before {
          content: none;
        }

        .vozon-one-glow {
          display: none;
        }

        .vozon-one-heading {
          max-width: 900px;
          margin: 0 auto 72px;
          text-align: center;
        }

        .vozon-one-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 24px;
          padding: 9px 13px;
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 7px;
          color: rgba(255, 255, 255, .82);
          font-size: 12px;
          font-weight: 750;
          letter-spacing: .015em;
          background: rgba(255, 255, 255, .035);
          box-shadow: inset 0 1px rgba(255, 255, 255, .035);
        }

        .vozon-one-kicker i,
        .vozon-one-card footer span i,
        .vozon-one-console-bar i {
          display: block;
          width: 8px;
          height: 8px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #45ddce;
          box-shadow: 0 0 12px rgba(69, 221, 206, .72);
        }

        .vozon-one-heading h2 {
          margin: 0;
          color: #fff;
          font-size: 1.55rem;
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: 0;
          text-wrap: balance;
        }

        .vozon-one-heading h2 span {
          color: #fff;
        }

        .vozon-one-heading p {
          max-width: 760px;
          margin: 20px auto 0;
          color: rgba(255, 255, 255, .56);
          font-size: .875rem;
          line-height: 1.75;
          text-wrap: balance;
        }

        @media (min-width: 640px) {
          .vozon-one-heading h2 {
            font-size: 2.15rem;
          }

          .vozon-one-heading p {
            font-size: 1rem;
          }
        }

        @media (min-width: 1024px) {
          .vozon-one-heading h2 {
            font-size: 2.5rem;
          }
        }

        .vozon-one-grid {
          display: flex;
          align-items: stretch;
          gap: 20px;
          perspective: 1200px;
        }

        .vozon-one-card {
          position: relative;
          isolation: isolate;
          display: flex;
          min-width: 0;
          min-height: 470px;
          flex: .96 1 0;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(139, 159, 175, .19);
          border-radius: 16px;
          background:
            radial-gradient(circle at 80% 0%, rgba(69, 221, 206, .14), transparent 38%),
            linear-gradient(145deg, rgba(8, 20, 25, .96), rgba(5, 10, 14, .98));
          box-shadow: inset 0 1px rgba(255, 255, 255, .025), 0 24px 65px rgba(0, 0, 0, .2);
          cursor: pointer;
          outline: none;
          transition:
            flex-grow 320ms ease,
            opacity 260ms ease,
            border-color 240ms ease,
            transform 260ms ease,
            box-shadow 260ms ease;
        }

        .vozon-one-card::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 0;
          opacity: .47;
          background-image: radial-gradient(rgba(255, 255, 255, .12) .7px, transparent .7px);
          background-size: 19px 19px;
          mask-image: linear-gradient(to bottom, transparent 7%, black 28%, black 91%, transparent);
        }

        .vozon-one-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          background: linear-gradient(90deg, transparent, rgba(111, 255, 239, .36), transparent) top / 64% 1px no-repeat;
        }

        .vozon-one-card:hover {
          border-color: rgba(255, 255, 255, .24);
          box-shadow: inset 0 1px rgba(255, 255, 255, .04), 0 28px 72px rgba(0, 0, 0, .34);
          transform: translateY(-2px);
        }

        .vozon-one-card:focus-visible {
          border-color: rgba(117, 255, 240, .72);
          box-shadow: 0 0 0 3px rgba(69, 221, 206, .13), 0 25px 72px rgba(0, 0, 0, .34);
        }

        .vozon-one-speech-card {
          flex-grow: 1.08;
          border-color: rgba(255, 255, 255, .14);
          background:
            radial-gradient(circle at 18% 0%, rgba(69, 221, 206, .18), transparent 42%),
            linear-gradient(150deg, #10201f 0%, #090f12 52%, #050607 100%);
          box-shadow: inset 0 1px rgba(255, 255, 255, .045), 0 24px 65px rgba(0, 0, 0, .3);
        }

        .vozon-one-speech-card::after {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .34), transparent) top / 72% 1px no-repeat;
        }

        .vozon-one-brain-card {
          flex-grow: 1.38;
          border-color: rgba(255, 255, 255, .14);
          background:
            radial-gradient(circle at 82% 0%, rgba(169, 156, 255, .2), transparent 42%),
            linear-gradient(150deg, #15132a 0%, #0d0c18 52%, #050607 100%);
          box-shadow: inset 0 1px rgba(255, 255, 255, .045), 0 24px 65px rgba(0, 0, 0, .3);
        }

        .vozon-one-tools-card {
          border-color: rgba(255, 255, 255, .14);
          background:
            radial-gradient(circle at 18% 0%, rgba(255, 189, 112, .18), transparent 42%),
            linear-gradient(150deg, #21170f 0%, #120d09 52%, #050607 100%);
          box-shadow: inset 0 1px rgba(255, 255, 255, .045), 0 24px 65px rgba(0, 0, 0, .3);
        }

        .vozon-one-brain-card::after {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .34), transparent) top / 72% 1px no-repeat;
        }

        .vozon-one-tools-card::after {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .34), transparent) top / 72% 1px no-repeat;
        }

        .vozon-one-brain-card > header > span {
          color: rgba(255, 255, 255, .64);
        }

        .vozon-one-tools-card > header > span {
          color: rgba(255, 255, 255, .64);
        }

        .vozon-one-speech-card > header {
          background: linear-gradient(180deg, rgba(255, 255, 255, .035), transparent);
        }

        .vozon-one-brain-card > header {
          background: linear-gradient(180deg, rgba(255, 255, 255, .035), transparent);
        }

        .vozon-one-tools-card > header {
          background: linear-gradient(180deg, rgba(255, 255, 255, .035), transparent);
        }

        .vozon-one-speech-card > footer {
          background: rgba(3, 4, 6, .8);
        }

        .vozon-one-brain-card > footer {
          background: rgba(3, 4, 6, .8);
        }

        .vozon-one-tools-card > footer {
          background: rgba(3, 4, 6, .8);
        }

        .vozon-one-brain-card > footer span i {
          background: rgba(255, 255, 255, .68);
          box-shadow: 0 0 10px rgba(255, 255, 255, .24);
        }

        .vozon-one-brain-card > footer > b {
          color: rgba(255, 255, 255, .56);
        }

        .vozon-one-tools-card > footer span i {
          background: rgba(255, 255, 255, .68);
          box-shadow: 0 0 10px rgba(255, 255, 255, .24);
        }

        .vozon-one-tools-card > footer > b {
          color: rgba(255, 255, 255, .56);
        }

        .vozon-one-brain-card .vozon-one-console {
          border-color: rgba(255, 255, 255, .12);
          background: linear-gradient(155deg, rgba(23, 26, 30, .94), rgba(9, 11, 14, .96));
        }

        .vozon-one-brain-card .vozon-one-agent {
          border-color: rgba(255, 255, 255, .13);
          background: linear-gradient(110deg, rgba(255, 255, 255, .07), rgba(255, 255, 255, .02));
        }

        .vozon-one-brain-card .vozon-one-model-list i {
          color: rgba(255, 255, 255, .78);
          background: rgba(255, 255, 255, .08);
          box-shadow: none;
        }

        .vozon-one-brain-card .vozon-one-agent > em,
        .vozon-one-brain-card .vozon-one-model-list em {
          color: rgba(255, 255, 255, .66);
          background: rgba(255, 255, 255, .07);
        }

        .vozon-one-tools-card .vozon-one-tool-tile:nth-of-type(2) i {
          background: linear-gradient(145deg, #f4f4f5, #a1a1aa);
        }

        .vozon-one-tools-card .vozon-one-tool-tile:nth-of-type(3) i {
          background: linear-gradient(145deg, #f4f4f5, #a1a1aa);
        }

        .vozon-one-tools-card .vozon-one-tool-tile:nth-of-type(4) i {
          background: linear-gradient(145deg, #f4f4f5, #a1a1aa);
          box-shadow: 0 0 14px rgba(255, 255, 255, .1);
        }

        .vozon-one-tools-card .vozon-one-tool-tile:nth-of-type(2) {
          background: linear-gradient(145deg, rgba(35, 38, 43, .96), rgba(11, 13, 16, .98));
        }

        .vozon-one-tools-card .vozon-one-tool-tile:nth-of-type(3) {
          background: linear-gradient(145deg, rgba(35, 38, 43, .96), rgba(11, 13, 16, .98));
        }

        .vozon-one-tools-card .vozon-one-tool-tile:nth-of-type(4) {
          background: linear-gradient(145deg, rgba(35, 38, 43, .96), rgba(11, 13, 16, .98));
        }

        .vozon-one-speech-card:hover {
          border-color: rgba(255, 255, 255, .25);
          box-shadow: inset 0 1px rgba(255, 255, 255, .05), 0 30px 78px rgba(0, 0, 0, .36);
        }

        @media (min-width: 1051px) {
          .vozon-one-grid.has-active-card .vozon-one-card.is-muted {
            flex-grow: .92;
            opacity: .9;
            transform: scale(.995);
          }

          .vozon-one-grid.has-active-card .vozon-one-card.is-active {
            z-index: 6;
            flex-grow: 1.2;
            opacity: 1;
            border-color: rgba(255, 255, 255, .26);
            transform: translateY(-4px) scale(1.006);
            box-shadow: inset 0 1px rgba(255, 255, 255, .055), 0 34px 86px rgba(0, 0, 0, .42), 0 0 52px rgba(69, 221, 206, .08);
          }

          .vozon-one-grid.has-active-card .vozon-one-brain-card.is-active {
            flex-grow: 1.5;
            border-color: rgba(255, 255, 255, .28);
            box-shadow: inset 0 1px rgba(255, 255, 255, .055), 0 28px 70px rgba(0, 0, 0, .4);
          }

          .vozon-one-grid.has-active-card .vozon-one-tools-card.is-active {
            border-color: rgba(255, 255, 255, .28);
            box-shadow: inset 0 1px rgba(255, 255, 255, .055), 0 28px 70px rgba(0, 0, 0, .4);
          }

          .vozon-one-card.is-active > header,
          .vozon-one-card.is-active > footer,
          .vozon-one-card.is-active > .vozon-one-speech-map,
          .vozon-one-card.is-active > .vozon-one-console,
          .vozon-one-card.is-active > .vozon-one-tool-map {
            animation: vozonOneCardContentResolve 280ms ease both;
          }
        }

        @keyframes vozonOneCardContentResolve {
          0% { opacity: .72; }
          100% { opacity: 1; }
        }

        .vozon-one-card > header {
          min-height: 158px;
          padding: 25px 22px 16px;
          text-align: center;
        }

        .vozon-one-card > header > span {
          display: block;
          margin-bottom: 7px;
          color: rgba(255, 255, 255, .64);
          font-family: var(--font-commit-mono), monospace;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: .13em;
        }

        .vozon-one-live-label {
          display: inline-flex;
          align-items: center;
          margin-left: 5px;
          padding: 3px 5px 2px;
          border: 1px solid rgba(105, 255, 237, .2);
          border-radius: 999px;
          color: #9efff3;
          font-size: 6px;
          font-style: normal;
          letter-spacing: .1em;
          background: rgba(69, 221, 206, .09);
          box-shadow: 0 0 14px rgba(69, 221, 206, .08);
          vertical-align: 1px;
        }

        .vozon-one-card h3 {
          margin: 0;
          color: rgba(255, 255, 255, .94);
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          font-weight: 780;
          line-height: 1.25;
          letter-spacing: -.016em;
        }

        .vozon-one-card header p {
          max-width: 440px;
          margin: 9px auto 0;
          color: rgba(227, 235, 239, .62);
          font-size: 10.5px;
          line-height: 1.5;
        }

        .vozon-one-speech-points {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 7px;
          margin-top: 13px;
        }

        .vozon-one-speech-points span {
          position: relative;
          padding: 4px 7px 4px 15px;
          border: 1px solid rgba(117, 255, 240, .13);
          border-radius: 999px;
          color: rgba(211, 255, 249, .7);
          font-family: var(--font-commit-mono), monospace;
          font-size: 6.5px;
          letter-spacing: .015em;
          background: rgba(25, 72, 67, .16);
        }

        .vozon-one-speech-points span::before {
          content: "";
          position: absolute;
          left: 7px;
          top: 50%;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #66f0df;
          box-shadow: 0 0 6px rgba(69, 221, 206, .7);
          transform: translateY(-50%);
        }

        .vozon-one-card-points {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 7px;
          margin-top: 13px;
        }

        .vozon-one-card-points span {
          padding: 4px 7px;
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 999px;
          font-family: var(--font-commit-mono), monospace;
          font-size: 6.5px;
          letter-spacing: .015em;
        }

        .vozon-one-brain-card .vozon-one-card-points span {
          border-color: rgba(255, 255, 255, .12);
          color: rgba(255, 255, 255, .62);
          background: rgba(255, 255, 255, .045);
        }

        .vozon-one-tools-card .vozon-one-card-points span {
          border-color: rgba(255, 255, 255, .12);
          color: rgba(255, 255, 255, .62);
          background: rgba(255, 255, 255, .045);
        }

        .vozon-one-card > footer {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 50px;
          margin-top: auto;
          padding: 12px 18px;
          border-top: 1px solid rgba(255, 255, 255, .065);
          color: rgba(226, 235, 239, .55);
          font-family: var(--font-commit-mono), monospace;
          font-size: 8.5px;
          background: rgba(3, 7, 10, .6);
        }

        .vozon-one-card > footer span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .vozon-one-card > footer span i {
          width: 5px;
          height: 5px;
        }

        .vozon-one-card > footer > b {
          color: rgba(117, 255, 240, .56);
          font-weight: 700;
        }

        .vozon-one-speech-map {
          position: relative;
          flex: 1;
          min-height: 250px;
          margin: 4px 18px 18px;
        }

        .vozon-one-call-status {
          position: absolute;
          z-index: 4;
          left: 50%;
          top: -2px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          border: 1px solid rgba(105, 255, 237, .16);
          border-radius: 999px;
          color: rgba(177, 255, 246, .74);
          font-family: var(--font-commit-mono), monospace;
          font-size: 7px;
          letter-spacing: .04em;
          white-space: nowrap;
          background: rgba(5, 24, 22, .86);
          transform: translateX(-50%);
        }

        .vozon-one-call-status b {
          margin-left: 2px;
          color: rgba(255, 255, 255, .42);
          font-size: 6px;
          font-weight: 650;
          letter-spacing: .06em;
        }

        .vozon-one-call-status i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #68f5e3;
          box-shadow: 0 0 9px rgba(69, 221, 206, .9);
          animation: vozonOneStatusPulse 1.5s ease-in-out infinite;
        }

        .vozon-one-speech-map::before,
        .vozon-one-speech-map::after {
          content: "";
          position: absolute;
          z-index: 0;
          background: rgba(69, 221, 206, .54);
          box-shadow: 0 0 10px rgba(69, 221, 206, .18);
        }

        .vozon-one-speech-map::before {
          left: 50%;
          top: 45px;
          bottom: 45px;
          width: 1px;
        }

        .vozon-one-speech-map::after {
          left: 44px;
          right: 44px;
          top: 50%;
          height: 1px;
        }

        .vozon-one-speech-line {
          position: absolute;
          z-index: 0;
          width: 34px;
          height: 34px;
          border-color: rgba(69, 221, 206, .54);
          border-style: dashed;
          animation: vozonOneSignalGlow 1.8s ease-in-out infinite alternate;
        }

        .vozon-one-line-a { left: 29%; top: 25%; border-width: 1px 0 0 1px; }
        .vozon-one-line-b { right: 29%; top: 25%; border-width: 1px 1px 0 0; }
        .vozon-one-line-c { left: 29%; bottom: 24%; border-width: 0 0 1px 1px; }
        .vozon-one-line-d { right: 29%; bottom: 24%; border-width: 0 1px 1px 0; }

        .vozon-one-node {
          position: absolute;
          z-index: 2;
          display: flex;
          width: 76px;
          align-items: center;
          flex-direction: column;
          gap: 5px;
          color: rgba(229, 240, 242, .66);
          font-size: 8px;
          text-align: center;
        }

        .vozon-one-node i {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 1px solid rgba(144, 166, 178, .22);
          border-radius: 7px;
          color: #aafff4;
          font-family: var(--font-commit-mono), monospace;
          font-size: 8px;
          font-style: normal;
          font-weight: 850;
          background: linear-gradient(145deg, rgba(24, 58, 57, .98), rgba(8, 19, 22, .98));
          box-shadow: inset 0 1px rgba(255, 255, 255, .055), 0 8px 18px rgba(0, 0, 0, .25), 0 0 16px rgba(69, 221, 206, .055);
          transition: transform 260ms ease, border-color 260ms ease, box-shadow 260ms ease;
        }

        .vozon-one-speech-card:hover .vozon-one-node i {
          border-color: rgba(117, 255, 240, .34);
          box-shadow: inset 0 1px rgba(255, 255, 255, .07), 0 9px 22px rgba(0, 0, 0, .3), 0 0 19px rgba(69, 221, 206, .13);
          transform: translateY(-2px);
        }

        .vozon-one-node b {
          font-weight: 650;
          line-height: 1.2;
        }

        .vozon-one-node-td { left: 2px; top: 30px; }
        .vozon-one-node-vad { right: 2px; top: 30px; }
        .vozon-one-node-stt { left: 2px; bottom: 12px; }
        .vozon-one-node-tts { right: 2px; bottom: 12px; }

        .vozon-one-speech-core {
          position: absolute;
          z-index: 3;
          left: 50%;
          top: 50%;
          display: flex;
          width: 88px;
          height: 96px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 7px;
          border: 1px solid rgba(104, 255, 237, .3);
          border-radius: 14px;
          color: #e8fffc;
          font-size: 10px;
          background: radial-gradient(circle at 50% 20%, rgba(69, 221, 206, .3), rgba(8, 29, 27, .97) 68%);
          box-shadow: 0 0 36px rgba(69, 221, 206, .14), inset 0 1px rgba(255, 255, 255, .08);
          transform: translate(-50%, -50%);
        }

        .vozon-one-speech-core::before,
        .vozon-one-speech-core::after {
          content: "";
          position: absolute;
          inset: -9px;
          z-index: -1;
          border: 1px solid rgba(104, 255, 237, .18);
          border-radius: 19px;
          animation: vozonOneCoreRing 2.4s ease-out infinite;
        }

        .vozon-one-speech-core::after {
          animation-delay: 1.2s;
        }

        .vozon-one-speech-core i {
          display: grid;
          width: 32px;
          height: 32px;
          place-items: center;
          border-radius: 9px;
          background: #57ead8;
          box-shadow: 0 0 18px rgba(69, 221, 206, .35);
        }

        .vozon-one-speech-core svg {
          width: 18px;
          fill: none;
          stroke: #03120f;
          stroke-width: 1.8;
          stroke-linecap: round;
        }

        .vozon-one-core-wave {
          display: flex;
          height: 11px;
          align-items: center;
          gap: 2px;
        }

        .vozon-one-core-wave i {
          display: block;
          width: 2px;
          height: 5px;
          border-radius: 4px;
          background: #7affef;
          animation: vozonOneWave .65s ease-in-out infinite alternate;
        }

        .vozon-one-core-wave i:nth-child(2),
        .vozon-one-core-wave i:nth-child(4) { height: 10px; animation-delay: -.34s; }
        .vozon-one-core-wave i:nth-child(3) { height: 7px; animation-delay: -.18s; }

        @keyframes vozonOneStatusPulse {
          0%, 100% { opacity: .45; transform: scale(.78); }
          50% { opacity: 1; transform: scale(1.12); }
        }

        @keyframes vozonOneSignalGlow {
          from { border-color: rgba(69, 221, 206, .28); filter: drop-shadow(0 0 0 rgba(69, 221, 206, 0)); }
          to { border-color: rgba(105, 255, 237, .72); filter: drop-shadow(0 0 4px rgba(69, 221, 206, .3)); }
        }

        @keyframes vozonOneCoreRing {
          0% { opacity: .58; transform: scale(.88); }
          75%, 100% { opacity: 0; transform: scale(1.18); }
        }

        @keyframes vozonOneWave {
          from { transform: scaleY(.5); }
          to { transform: scaleY(1); }
        }

        .vozon-one-console {
          position: relative;
          flex: 1;
          min-height: 250px;
          margin: 4px 18px 18px;
          padding: 14px;
          border: 1px solid rgba(142, 165, 178, .18);
          border-radius: 11px;
          background: rgba(17, 24, 28, .88);
          box-shadow: inset 0 1px rgba(255, 255, 255, .035), 0 18px 42px rgba(0, 0, 0, .24);
        }

        .vozon-one-console-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2px 9px;
          color: rgba(229, 237, 240, .55);
          font-family: var(--font-commit-mono), monospace;
          font-size: 8px;
        }

        .vozon-one-console-bar span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .vozon-one-console-bar i {
          width: 5px;
          height: 5px;
        }

        .vozon-one-console-bar b {
          color: rgba(255, 255, 255, .2);
          letter-spacing: 2px;
        }

        .vozon-one-agent {
          display: grid;
          grid-template-columns: minmax(108px, .85fr) minmax(90px, 1fr) auto;
          align-items: center;
          gap: 11px;
          min-height: 72px;
          padding: 10px 11px;
          border: 1px solid rgba(103, 244, 225, .15);
          border-radius: 9px;
          background: linear-gradient(110deg, rgba(69, 221, 206, .1), rgba(255, 255, 255, .025));
        }

        .vozon-one-agent-brand,
        .vozon-one-agent-copy {
          display: flex;
          min-width: 0;
          flex-direction: column;
        }

        .vozon-one-agent-brand {
          gap: 3px;
        }

        .vozon-one-agent-brand small {
          color: rgba(216, 231, 234, .45);
          font-size: 7px;
          letter-spacing: .04em;
        }

        .vozon-one-agent-copy {
          gap: 3px;
          padding-left: 12px;
          border-left: 1px solid rgba(255, 255, 255, .1);
        }

        .vozon-one-agent-copy b {
          color: rgba(255, 255, 255, .92);
          font-size: 13px;
        }

        .vozon-one-agent-copy small {
          color: rgba(227, 236, 239, .58);
          font-size: 8px;
        }

        .vozon-one-agent > em,
        .vozon-one-model-list em {
          padding: 4px 6px;
          border-radius: 5px;
          color: #81fbed;
          font-family: var(--font-commit-mono), monospace;
          font-size: 7px;
          font-style: normal;
          background: rgba(69, 221, 206, .1);
        }

        .vozon-one-model-list {
          display: grid;
          gap: 6px;
          margin-top: 8px;
        }

        .vozon-one-model-list > span {
          display: grid;
          grid-template-columns: 30px minmax(64px, .7fr) 1fr auto;
          align-items: center;
          gap: 8px;
          min-height: 42px;
          padding: 6px 9px;
          border: 1px solid rgba(255, 255, 255, .065);
          border-radius: 7px;
          background: rgba(255, 255, 255, .025);
        }

        .vozon-one-model-list i {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
          border-radius: 7px;
          color: #75fff0;
          font-size: 12px;
          font-style: normal;
          background: rgba(69, 221, 206, .1);
        }

        .vozon-one-model-list i svg,
        .vozon-one-tool-core i svg {
          width: 15px;
          height: 15px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.8;
        }

        .vozon-one-model-list b {
          color: rgba(255, 255, 255, .86);
          font-size: 10px;
        }

        .vozon-one-model-list small {
          color: rgba(224, 234, 237, .5);
          font-size: 8px;
        }

        .vozon-one-tool-map {
          position: relative;
          display: grid;
          flex: 1;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-template-rows: repeat(3, minmax(0, 1fr));
          gap: 10px;
          min-height: 250px;
          margin: 4px 18px 18px;
          padding: 10px;
        }

        .vozon-one-tool-map::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 72%;
          height: 66%;
          border: 1px dashed rgba(69, 221, 206, .25);
          border-radius: 22px;
          transform: translate(-50%, -50%);
        }

        .vozon-one-tool-tile {
          position: relative;
          z-index: 2;
          display: flex;
          min-width: 0;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          border: 1px solid rgba(132, 153, 166, .17);
          border-radius: 7px;
          color: rgba(229, 239, 242, .63);
          font-size: 8px;
          background: linear-gradient(145deg, rgba(27, 36, 40, .96), rgba(10, 16, 19, .97));
          box-shadow: 0 9px 22px rgba(0, 0, 0, .23);
        }

        .vozon-one-tool-tile i {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
          border-radius: 7px;
          color: #061512;
          font-size: 14px;
          font-style: normal;
          font-weight: 900;
          background: linear-gradient(145deg, #9cfff3, #45ddce);
          box-shadow: 0 0 17px rgba(69, 221, 206, .25);
        }

        .vozon-one-tool-tile svg {
          width: 17px;
          fill: none;
          stroke: #061512;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.8;
        }

        .tile-github svg {
          fill: #061512;
          stroke: none;
        }

        .tile-function { grid-column: 1; grid-row: 1; }
        .tile-api { grid-column: 3; grid-row: 1; }
        .tile-mcp { grid-column: 1; grid-row: 3; }
        .tile-github { grid-column: 3; grid-row: 3; }

        .vozon-one-tool-core {
          position: relative;
          z-index: 3;
          display: flex;
          grid-column: 2;
          grid-row: 2;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 3px;
          border: 1px solid rgba(107, 255, 238, .3);
          border-radius: 10px;
          color: rgba(255, 255, 255, .9);
          font-size: 9px;
          text-align: center;
          background: radial-gradient(circle at 50% 10%, rgba(69, 221, 206, .27), rgba(8, 27, 25, .98) 70%);
          box-shadow: 0 0 30px rgba(69, 221, 206, .15);
        }

        .vozon-one-tool-core i {
          display: grid;
          width: 27px;
          height: 27px;
          place-items: center;
          border-radius: 50%;
          color: #04120f;
          font-size: 12px;
          font-style: normal;
          background: #62ebda;
        }

        .vozon-one-tool-core small {
          color: rgba(219, 235, 236, .48);
          font-size: 6.5px;
        }

        @media (max-width: 1050px) {
          .vozon-one-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }

          .vozon-one-brain-card {
            grid-column: 1 / -1;
            grid-row: 1;
          }

          .vozon-one-card {
            flex: none;
            min-height: 460px;
          }
        }

        @media (max-width: 680px) {
          .vozon-one-section {
            padding-inline: 16px;
          }

          .vozon-one-heading {
            margin-bottom: 38px;
          }

          .vozon-one-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 16px;
          }

          .vozon-one-brain-card {
            grid-column: auto;
            grid-row: auto;
          }

          .vozon-one-card {
            min-height: 450px;
          }

          .vozon-one-card > header {
            min-height: 148px;
            padding: 22px 18px 14px;
          }

          .vozon-one-agent {
            grid-template-columns: minmax(102px, .9fr) minmax(82px, 1fr);
          }

          .vozon-one-agent > em {
            display: none;
          }

          .vozon-one-model-list > span {
            grid-template-columns: 30px minmax(58px, .8fr) 1fr auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vozon-one-card {
            transition: none;
          }

          .vozon-one-call-status i,
          .vozon-one-speech-line,
          .vozon-one-speech-core::before,
          .vozon-one-speech-core::after,
          .vozon-one-core-wave i,
          .vozon-one-card.is-active > header,
          .vozon-one-card.is-active > footer,
          .vozon-one-card.is-active > .vozon-one-speech-map,
          .vozon-one-card.is-active > .vozon-one-console,
          .vozon-one-card.is-active > .vozon-one-tool-map {
            animation: none;
          }
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

        .vozon-company-logo-image.vozon-company-logo-image--digitalbot {
          width: 9.375rem;
          height: auto;
          max-width: none;
          max-height: 3.625rem;
          object-fit: contain;
          filter: drop-shadow(0 0 6px rgba(241,94,45,.28));
          opacity: 1;
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

        .vozon-company-logo:hover .vozon-company-logo-image--digitalbot {
          filter: drop-shadow(0 0 8px rgba(241,94,45,.42));
          opacity: 1;
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

        .vozon-how-section {
          overflow: hidden;
          background: #000;
        }

        .vozon-how-section::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 18% 48%, rgba(69,221,206,0.075), transparent 25%),
            radial-gradient(circle at 79% 54%, rgba(69,221,206,0.055), transparent 27%);
          opacity: 0.9;
        }

        .vozon-how-shell {
          border: 0;
          background: transparent;
          box-shadow: none;
        }

        .vozon-how-intro {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 1.5rem;
          text-align: center;
        }

        .vozon-how-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          border: 1px solid rgba(117,255,240,0.34);
          border-radius: 999px;
          background: rgba(69,221,206,0.1);
          padding: 0.55rem 0.9rem;
          color: #9afff5;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          box-shadow: inset 0 0 18px rgba(69,221,206,0.08), 0 0 22px rgba(69,221,206,0.07);
          text-transform: uppercase;
        }

        .vozon-how-kicker::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #45ddce;
          box-shadow: 0 0 10px #45ddce;
        }

        .vozon-how-intro h2 {
          max-width: 800px;
          margin: 1.35rem auto 0;
        }

        .vozon-how-intro h2 span {
          display: block;
        }

        .vozon-how-intro h2 span:last-child {
          color: #fff;
        }

        .vozon-how-intro p {
          max-width: 680px;
          margin: 1.25rem auto 0;
          color: rgba(255,255,255,0.56);
          font-size: 1rem;
          line-height: 1.7;
        }

        .vozon-how-column-headings {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-top: 3.25rem;
          border-block: 1px solid rgba(117,255,240,0.13);
          border-radius: 14px;
          background: rgba(13,27,36,0.64);
          overflow: hidden;
        }

        .vozon-how-column-headings::before {
          content: "";
          position: absolute;
          top: -1px;
          left: 0;
          width: 34%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #45ddce, transparent);
          box-shadow: 0 0 9px #45ddce;
        }

        .vozon-how-column-headings strong {
          display: flex;
          min-height: 52px;
          align-items: center;
          gap: 0.65rem;
          padding: 0 1.4rem;
          font-size: 0.82rem;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        .vozon-how-column-headings strong + strong {
          border-left: 0;
        }

        .vozon-how-column-headings span,
        .vozon-how-column-headings i {
          color: #75fff0;
          font-style: normal;
        }

        .vozon-how-grid {
          display: grid;
          min-height: 590px;
          grid-template-columns: 1fr 1fr;
        }

        .vozon-how-flow {
          --vozon-how-gap: 1.25rem;
          position: relative;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 230px));
          grid-template-rows: repeat(2, auto);
          align-content: center;
          align-items: center;
          justify-content: center;
          gap: 2.5rem var(--vozon-how-gap);
          overflow: hidden;
          border-right: 0;
          background-color: #000;
          background-image: none;
          padding: 3rem 1.25rem;
        }

        .vozon-how-flow::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 42%, rgba(69,221,206,0.055), transparent 42%);
          pointer-events: none;
        }

        .vozon-how-connectors {
          position: absolute;
          inset: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          fill: none;
          stroke: rgba(117,255,240,0.34);
          stroke-width: 3;
          stroke-dasharray: 9 9;
          stroke-linecap: round;
          filter: drop-shadow(0 0 4px rgba(69,221,206,0.25));
          animation: vozonHowSignal 8s linear infinite;
        }

        .vozon-how-step {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 154px;
          justify-self: center;
          border: 1px solid color-mix(in srgb, var(--step-color) 52%, transparent);
          border-radius: 16px;
          background: color-mix(in srgb, var(--step-color) 22%, #07110f);
          overflow: hidden;
          box-shadow: 0 18px 36px rgba(0,0,0,0.24), 0 0 24px color-mix(in srgb, var(--step-color) 12%, transparent);
          transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
        }

        .vozon-how-step:hover {
          border-color: color-mix(in srgb, var(--step-color) 78%, white);
          box-shadow: 0 22px 46px rgba(0,0,0,0.32), 0 0 34px color-mix(in srgb, var(--step-color) 20%, transparent);
          transform: translateY(-4px);
        }

        .vozon-how-step header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin: 0.75rem;
          padding: 0.8rem 0.9rem;
          border: 1px solid color-mix(in srgb, var(--step-color) 35%, transparent);
          border-radius: 11px;
          background: rgba(0,0,0,0.36);
        }

        .vozon-how-step header span,
        .vozon-how-step header small,
        .vozon-how-step header strong {
          display: block;
        }

        .vozon-how-step header small {
          margin-bottom: 0.35rem;
          color: color-mix(in srgb, var(--step-color) 74%, white);
          font-size: 0.58rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .vozon-how-step header strong {
          font-size: 0.82rem;
          text-transform: capitalize;
        }

        .vozon-how-step header b {
          color: var(--step-color);
          font-family: var(--font-geist-mono), monospace;
          font-size: 1.35rem;
        }

        .vozon-how-step p {
          margin: 0;
          padding: 0 0.85rem 0.9rem;
          color: rgba(255,255,255,0.72);
          font-size: 0.7rem;
          line-height: 1.45;
        }

        .vozon-how-step-one {
          --step-color: #45ddce;
          grid-column: 1;
          grid-row: 1;
        }

        .vozon-how-step-two {
          --step-color: #72a7ff;
          grid-column: 2;
          grid-row: 1;
        }

        .vozon-how-step-three {
          --step-color: #de6aa8;
          grid-column: 1 / -1;
          grid-row: 2;
          width: min(230px, calc((100% - var(--vozon-how-gap)) / 2));
        }

        .vozon-code-area {
          display: flex;
          min-width: 0;
          flex-direction: column;
          justify-content: center;
          padding: 2.5rem 1.25rem;
          background: #000;
        }

        .vozon-code-window {
          position: relative;
          width: 100%;
          overflow: hidden;
          border: 1px solid rgba(117,255,240,0.24);
          border-radius: 20px;
          background:
            radial-gradient(circle at 92% 8%, rgba(69,221,206,0.09), transparent 27%),
            linear-gradient(145deg, #0b1724, #07101b 62%, #07131a);
          box-shadow:
            0 28px 70px rgba(0,0,0,0.48),
            0 0 42px rgba(69,221,206,0.075),
            inset 0 1px rgba(255,255,255,0.045);
          transition: border-color 180ms ease, box-shadow 180ms ease;
        }

        .vozon-code-window:hover {
          border-color: rgba(117,255,240,0.3);
          box-shadow: 0 26px 64px rgba(0,0,0,0.45), 0 0 42px rgba(69,221,206,0.1);
        }

        .vozon-code-toolbar {
          display: flex;
          min-height: 52px;
          align-items: center;
          gap: 0.7rem;
          border-bottom: 1px solid rgba(117,255,240,0.14);
          background: rgba(20,34,49,0.88);
          padding: 0.45rem 0.55rem 0.45rem 1rem;
          backdrop-filter: blur(16px);
        }

        .vozon-code-lights {
          display: flex;
          gap: 0.4rem;
        }

        .vozon-code-lights i {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #ff5f57;
        }

        .vozon-code-lights i:nth-child(2) { background: #febc2e; }
        .vozon-code-lights i:nth-child(3) { background: #28c840; }

        .vozon-code-file {
          display: inline-flex;
          align-items: center;
          gap: 0.42rem;
          color: #8ee7df;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.62rem;
        }

        .vozon-code-file::before {
          content: "</>";
          color: #45ddce;
          font-size: 0.58rem;
          font-weight: 900;
        }

        .vozon-code-tabs {
          display: flex;
          align-self: stretch;
          margin-left: auto;
        }

        .vozon-code-tabs button,
        .vozon-code-copy {
          border: 0;
          background: transparent;
          color: rgba(255,255,255,0.52);
          cursor: pointer;
          font-size: 0.66rem;
          font-weight: 700;
          padding: 0 0.8rem;
          transition: background 160ms ease, color 160ms ease;
        }

        .vozon-code-tabs button:hover,
        .vozon-code-tabs button.is-active {
          border-radius: 9px;
          background: rgba(255,255,255,0.075);
          color: #fff;
        }

        .vozon-code-tabs button.is-active {
          background: linear-gradient(135deg, rgba(69,221,206,0.2), rgba(69,221,206,0.08));
          color: #a8fff6;
          box-shadow: inset 0 0 0 1px rgba(117,255,240,0.16), 0 0 18px rgba(69,221,206,0.08);
        }

        .vozon-code-copy {
          min-width: 62px;
          margin: 0.55rem;
          border: 1px solid rgba(117,255,240,0.13);
          border-radius: 9px;
          background: rgba(117,255,240,0.075);
          color: #9afff5;
          padding: 0 0.55rem;
        }

        .vozon-code-copy:hover {
          border-color: rgba(117,255,240,0.3);
          background: rgba(117,255,240,0.12);
        }

        .vozon-code-body {
          min-height: 370px;
          overflow: auto;
          padding: 1rem 0 1.35rem;
          scrollbar-color: rgba(117,255,240,0.25) transparent;
        }

        .vozon-code-context {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin: 0 1rem 0.9rem;
          border-radius: 10px;
          background: rgba(0,0,0,0.24);
          padding: 0.6rem 0.75rem;
          font-family: var(--font-geist-mono), monospace;
        }

        .vozon-code-context span {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          border-radius: 6px;
          background: rgba(69,221,206,0.12);
          padding: 0.28rem 0.48rem;
          color: #75fff0;
          font-size: 0.56rem;
          font-weight: 900;
        }

        .vozon-code-context span i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #45ddce;
          box-shadow: 0 0 7px #45ddce;
        }

        .vozon-code-context code {
          min-width: 0;
          overflow: hidden;
          color: rgba(255,255,255,0.72);
          font-size: 0.58rem;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vozon-code-context small {
          margin-left: auto;
          color: rgba(255,255,255,0.3);
          font-size: 0.52rem;
          white-space: nowrap;
        }

        .vozon-code-body pre {
          min-width: 490px;
          margin: 0;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.66rem;
          line-height: 1.72;
        }

        .vozon-code-line {
          display: grid;
          grid-template-columns: 2.7rem 1fr;
          padding-right: 1rem;
        }

        .vozon-code-line:hover {
          background: rgba(117,255,240,0.035);
        }

        .vozon-code-line i {
          padding-right: 0.8rem;
          color: rgba(117,255,240,0.42);
          font-style: normal;
          text-align: right;
          user-select: none;
        }

        .vozon-code-line code {
          color: #d8e8f6;
          white-space: pre;
        }

        .vozon-code-note {
          margin: 1rem 0 0;
          color: rgba(255,255,255,0.34);
          font-size: 0.6rem;
          text-align: center;
        }

        .vozon-code-note span {
          margin-right: 0.45rem;
          color: #45ddce;
          text-shadow: 0 0 8px #45ddce;
        }

        @keyframes vozonHowSignal {
          to { stroke-dashoffset: -72; }
        }

        @media (max-width: 900px) {
          .vozon-how-intro {
            max-width: 720px;
          }

          .vozon-how-grid,
          .vozon-how-column-headings {
            grid-template-columns: 1fr;
          }

          .vozon-how-column-headings strong + strong {
            display: none;
          }

          .vozon-how-flow {
            min-height: 570px;
            border-right: 0;
            border-bottom: 1px solid rgba(117,255,240,0.13);
          }

          .vozon-code-area::before {
            content: "Developer APIs";
            margin: -2.5rem -1.25rem 2rem;
            border-bottom: 1px solid rgba(117,255,240,0.13);
            background: rgba(13,27,36,0.88);
            padding: 1.1rem 1.4rem;
            font-size: 0.82rem;
            font-weight: 900;
            text-transform: uppercase;
          }
        }

        @media (max-width: 560px) {
          .vozon-how-section {
            padding-inline: 1rem;
          }

          .vozon-how-intro {
            padding-inline: 0.25rem;
          }

          .vozon-how-flow {
            --vozon-how-gap: 0.75rem;
            min-height: 520px;
            gap: 2rem var(--vozon-how-gap);
            padding: 2.25rem 0.5rem;
          }

          .vozon-how-step {
            width: 100%;
          }

          .vozon-how-step-three {
            width: calc((100% - var(--vozon-how-gap)) / 2);
          }

          .vozon-code-toolbar {
            flex-wrap: wrap;
            padding: 0.7rem;
          }

          .vozon-code-file {
            margin-right: auto;
          }

          .vozon-code-tabs {
            order: 3;
            width: 100%;
            min-height: 40px;
          }

          .vozon-code-tabs button {
            flex: 1;
          }

          .vozon-code-body {
            min-height: 340px;
          }

          .vozon-code-note {
            padding-inline: 0.75rem;
            line-height: 1.6;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vozon-how-connectors {
            animation: none;
          }

          .vozon-how-step,
          .vozon-code-window {
            transition: none;
          }
        }

        .vozon-feature-suite {
          background: radial-gradient(circle at 50% 72%, rgba(69,221,206,.075), transparent 34%), #000;
        }

        .vozon-feature-tabs {
          display: grid;
          width: min(100%, 670px);
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin: 38px auto 0;
          padding: 6px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 16px;
          background: rgba(255,255,255,.035);
          box-shadow: inset 0 1px rgba(255,255,255,.035);
        }

        .vozon-feature-tabs button {
          position: relative;
          display: flex;
          min-height: 66px;
          align-items: center;
          justify-content: flex-start;
          gap: 11px;
          overflow: hidden;
          padding: 0 15px;
          border: 1px solid transparent;
          border-radius: 11px;
          color: rgba(255,255,255,.48);
          font-size: .82rem;
          font-weight: 800;
          background: transparent;
          cursor: pointer;
          transition: color .2s ease, background .2s ease, border-color .2s ease, transform .2s ease;
        }

        .vozon-feature-tabs button:hover { color: #fff; }
        .vozon-feature-tabs button.is-active {
          border-color: rgba(117,255,240,.24);
          color: #effffc;
          background: linear-gradient(135deg, rgba(69,221,206,.15), rgba(69,221,206,.055));
          box-shadow: inset 0 1px rgba(255,255,255,.07), 0 8px 24px rgba(0,0,0,.18);
        }

        .vozon-feature-tabs button.is-active::after { content: ""; position: absolute; right: 14%; bottom: 0; left: 14%; height: 1px; background: linear-gradient(90deg,transparent,#75fff0,transparent); box-shadow: 0 0 8px #45ddce; }
        .vozon-feature-tabs button > small { color: rgba(255,255,255,.2); font: 800 .56rem var(--font-geist-mono),monospace; }
        .vozon-feature-tabs button > span { display: grid; width: 27px; height: 27px; flex: 0 0 auto; place-items: center; padding: 4px; color: #75fff0; }
        .vozon-feature-tabs button > strong { display: flex; min-width: 0; flex-direction: column; gap: 3px; color: inherit; font-size: .78rem; line-height: 1; text-align: left; }
        .vozon-feature-tabs button > strong i { overflow: hidden; color: rgba(255,255,255,.28); font-size: .54rem; font-style: normal; font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }
        .vozon-feature-tabs svg,
        .vozon-feature-item-icon svg,
        .vozon-trust-grid article > span svg {
          width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round;
        }

        .vozon-feature-panel {
          --feature-panel-accent: #45ddce;
          position: relative;
          display: grid;
          width: min(100%, 1240px);
          min-height: 390px;
          grid-template-columns: minmax(250px,.85fr) minmax(340px,1.12fr) minmax(280px,.78fr);
          gap: 18px;
          margin: 18px auto 0;
          padding: 18px;
          border: 1px solid rgba(255,255,255,.11);
          border-radius: 24px;
          background: radial-gradient(circle at 83% 32%,color-mix(in srgb,var(--feature-panel-accent) 9%,transparent),transparent 30%),linear-gradient(145deg, rgba(11,24,22,.96), rgba(3,7,7,.98));
          box-shadow: inset 0 1px rgba(255,255,255,.05), 0 30px 80px rgba(0,0,0,.32);
          overflow: hidden;
          animation: vozonFeaturePanelIn .32s ease both;
        }
        .vozon-feature-panel.is-automation { --feature-panel-accent:#72b8ff; }
        .vozon-feature-panel.is-enterprise { --feature-panel-accent:#b59cff; }
        .vozon-feature-panel::before { content: ""; position: absolute; pointer-events: none; top: 0; right: 8%; left: 8%; height: 1px; background: linear-gradient(90deg,transparent,var(--feature-panel-accent),transparent); opacity: .55; }

        .vozon-feature-panel-copy { display: flex; flex-direction: column; justify-content: center; padding: 26px; }
        .vozon-feature-panel-label, .vozon-section-kicker { display: inline-flex; width: fit-content; align-items: center; gap: 8px; color: #75fff0; font-size: .66rem; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; }
        .vozon-feature-panel-label i, .vozon-section-kicker i { width: 7px; height: 7px; border-radius: 50%; background: #45ddce; box-shadow: 0 0 12px #45ddce; }
        .vozon-feature-panel-copy h3 { margin: 18px 0 0; color: #fff; font-size: clamp(1.65rem,2.4vw,2.35rem); font-weight: 900; line-height: 1.1; letter-spacing: -.045em; }
        .vozon-feature-panel-copy p { margin: 16px 0 0; color: rgba(255,255,255,.54); font-size: .9rem; line-height: 1.75; }
        .vozon-feature-panel-copy a, .vozon-outcomes-heading a, .vozon-trust-copy a { display: inline-flex; width: fit-content; align-items: center; gap: 9px; margin-top: 22px; color: #9dfff4; font-size: .78rem; font-weight: 850; text-decoration: none; }
        .vozon-feature-panel-copy a span, .vozon-outcomes-heading a span, .vozon-trust-copy a span { transition: transform .2s ease; }
        .vozon-feature-panel-copy a:hover span, .vozon-outcomes-heading a:hover span, .vozon-trust-copy a:hover span { transform: translate(2px,-2px); }

        .vozon-feature-panel-list { display: grid; align-content: center; gap: 10px; }
        .vozon-feature-panel-list article { display: grid; grid-template-columns: 46px minmax(0,1fr); align-items: center; gap: 14px; min-height: 96px; padding: 17px; border: 1px solid rgba(255,255,255,.09); border-radius: 15px; background: rgba(255,255,255,.035); transition: transform .2s ease, border-color .2s ease, background .2s ease; }
        .vozon-feature-panel-list article:hover { transform: translateX(3px); border-color: rgba(117,255,240,.2); background: rgba(69,221,206,.055); }
        .vozon-feature-item-icon { display: grid; width: 46px; height: 46px; place-items: center; padding: 11px; border: 1px solid color-mix(in srgb,var(--feature-panel-accent) 24%,transparent); border-radius: 13px; color: color-mix(in srgb,var(--feature-panel-accent) 78%,white); background: color-mix(in srgb,var(--feature-panel-accent) 8%,transparent); }
        .vozon-feature-panel-list h4 { margin: 0; color: #fff; font-size: .9rem; font-weight: 850; }
        .vozon-feature-panel-list p { margin: 6px 0 0; color: rgba(255,255,255,.47); font-size: .76rem; line-height: 1.5; }

        .vozon-feature-panel-metric {
          position: relative;
          display: grid;
          min-height: 100%;
          grid-template-rows: auto 1fr auto;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.11);
          border-radius: 17px;
          background: radial-gradient(circle at 20% 15%,rgba(69,221,206,.09),transparent 32%),radial-gradient(circle at 92% 48%,rgba(181,156,255,.08),transparent 34%),linear-gradient(155deg,#08100f,#020706 74%);
          box-shadow: inset 0 1px rgba(255,255,255,.04),0 18px 42px rgba(0,0,0,.2);
        }
        .vozon-feature-panel-metric::before { content: ""; position: absolute; top: 0; right: 10%; left: 10%; height: 1px; background: linear-gradient(90deg,transparent,#45ddce,#b59cff,#ffbd66,transparent); opacity: .75; }

        .vozon-feature-animation-head { position: relative; z-index: 2; display: flex; min-height: 48px; align-items: center; justify-content: space-between; padding: 0 15px; border-bottom: 1px solid rgba(255,255,255,.07); color: rgba(255,255,255,.58); font-size: .62rem; font-weight: 850; letter-spacing: .07em; text-transform: uppercase; }
        .vozon-feature-animation-head span { display: flex; align-items: center; }
        .vozon-feature-animation-head b { padding: 4px 7px; border: 1px solid color-mix(in srgb,var(--feature-panel-accent) 20%,transparent); border-radius: 999px; color: color-mix(in srgb,var(--feature-panel-accent) 72%,white); font-size: .5rem; background: color-mix(in srgb,var(--feature-panel-accent) 7%,transparent); }

        .vozon-feature-card-stage { position: relative; z-index: 1; display: flex; min-height: 252px; flex-direction: column; justify-content: center; gap: 9px; padding: 22px 15px 20px 30px; }
        .vozon-feature-card-rail { position: absolute; z-index: 0; top: 40px; bottom: 40px; left: 15px; width: 2px; border-radius: 99px; background: linear-gradient(#45ddce,#72b8ff 50%,#b59cff 72%,#ffbd66); opacity: .55; }
        .vozon-feature-card-rail > i { position: absolute; top: 0; left: -2px; width: 6px; height: 34px; border-radius: 99px; background: linear-gradient(transparent,#fff,transparent); filter: drop-shadow(0 0 6px #72b8ff); animation: vozonFeatureRail 6s ease-in-out infinite; }

        .vozon-feature-motion-card { --motion-card-accent:#45ddce; position: relative; z-index: 1; min-height: 60px; padding: 11px 14px; border: 1px solid color-mix(in srgb,var(--motion-card-accent) 18%,rgba(255,255,255,.06)); border-left: 2px solid color-mix(in srgb,var(--motion-card-accent) 72%,transparent); border-radius: 10px; background: linear-gradient(90deg,color-mix(in srgb,var(--motion-card-accent) 7%,transparent),rgba(255,255,255,.02)); box-shadow: inset 0 1px rgba(255,255,255,.035); animation: vozonFeatureFlowCard 6s ease-in-out infinite; }
        .vozon-feature-motion-card.is-card-2 { --motion-card-accent:#b59cff; animation-delay: -4s; }
        .vozon-feature-motion-card.is-card-3 { --motion-card-accent:#ffbd66; animation-delay: -2s; }
        .vozon-feature-motion-card small { display: block; color: color-mix(in srgb,var(--motion-card-accent) 68%,rgba(255,255,255,.45)); font-size: .48rem; font-weight: 850; letter-spacing: .1em; text-transform: uppercase; }
        .vozon-feature-motion-card h5 { overflow: hidden; margin: 4px 0 0; color: rgba(255,255,255,.92); font-size: .72rem; font-weight: 820; line-height: 1.2; text-overflow: ellipsis; white-space: nowrap; }

        .vozon-feature-metric-strip { position: relative; z-index: 2; display: flex; min-height: 62px; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 15px; border-top: 1px solid rgba(255,255,255,.07); background: rgba(0,0,0,.22); }
        .vozon-feature-metric-strip div { display: flex; flex-direction: column; gap: 2px; }
        .vozon-feature-metric-strip small { color: rgba(255,255,255,.34); font-size: .47rem; font-weight: 850; letter-spacing: .1em; text-transform: uppercase; }
        .vozon-feature-metric-strip strong { color: #fff; font-size: 1.18rem; font-weight: 900; line-height: 1; letter-spacing: -.045em; }
        .vozon-feature-metric-strip > span { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,.47); font-size: .51rem; font-weight: 750; text-align: right; }

        @keyframes vozonFeaturePanelIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes vozonFeatureStatus { 0%,100% { opacity: .55; transform: scale(.86); } 50% { opacity: 1; transform: scale(1.08); } }
        @keyframes vozonFeatureRail { 0% { top: 0; opacity: 0; } 10%,90% { opacity: 1; } 100% { top: calc(100% - 34px); opacity: 0; } }
        @keyframes vozonFeatureFlowCard { 0%,22%,100% { transform: none; filter: saturate(.8); } 8%,14% { transform: translateX(3px); border-color: color-mix(in srgb,var(--motion-card-accent) 48%,transparent); filter: saturate(1.2); box-shadow: inset 0 1px rgba(255,255,255,.05),0 0 20px color-mix(in srgb,var(--motion-card-accent) 10%,transparent); } }

        .vozon-demo-section { background: radial-gradient(circle at 78% 50%, rgba(83,108,255,.08), transparent 27%), linear-gradient(180deg,#000,#030706,#000); }
        .vozon-demo-shell { display: grid; max-width: 1240px; grid-template-columns: minmax(280px,.8fr) minmax(480px,1.2fr); align-items: center; gap: clamp(35px,6vw,90px); margin: 0 auto; }
        .vozon-demo-copy h2 { max-width: 650px; margin: 18px 0 0; color: #fff; font-size: clamp(2rem,3.6vw,3.45rem); font-weight: 900; line-height: 1.03; letter-spacing: -.055em; }
        .vozon-outcomes-heading h2, .vozon-trust-copy h2 { max-width: 560px; margin: 16px 0 0; color: #fff; font-size: clamp(1.55rem,2.5vw,2.5rem); font-weight: 900; line-height: 1.12; letter-spacing: -.045em; }
        .vozon-demo-copy h2 span, .vozon-outcomes-heading h2 span, .vozon-trust-copy h2 span { color: #75fff0; }
        .vozon-demo-copy > p, .vozon-trust-copy > p { max-width: 560px; margin: 20px 0 0; color: rgba(255,255,255,.54); font-size: .92rem; line-height: 1.75; }
        .vozon-demo-language { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 26px; }
        .vozon-demo-language button { min-height: 36px; padding: 0 14px; border: 1px solid rgba(255,255,255,.1); border-radius: 999px; color: rgba(255,255,255,.48); font-size: .72rem; font-weight: 800; background: rgba(255,255,255,.03); cursor: pointer; }
        .vozon-demo-language button.is-active { border-color: rgba(117,255,240,.28); color: #9dfff4; background: rgba(69,221,206,.08); }
        .vozon-demo-trigger { display: inline-flex; min-height: 48px; align-items: center; gap: 10px; margin-top: 18px; padding: 0 20px; border: 1px solid rgba(117,255,240,.32); border-radius: 12px; color: #03110e; font-size: .78rem; font-weight: 900; background: #45ddce; box-shadow: 0 12px 30px rgba(69,221,206,.14); cursor: pointer; }
        .vozon-demo-trigger.is-active { color: #9dfff4; background: rgba(69,221,206,.08); }
        .vozon-demo-trigger span { font-size: .68rem; }

        .vozon-demo-console { overflow: hidden; border: 1px solid rgba(255,255,255,.12); border-radius: 22px; background: radial-gradient(circle at 50% 38%,rgba(69,221,206,.09),transparent 40%),#030807; box-shadow: inset 0 1px rgba(255,255,255,.055),0 32px 90px rgba(0,0,0,.38); }
        .vozon-demo-console > header { display: flex; min-height: 52px; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid rgba(255,255,255,.08); color: rgba(255,255,255,.56); font-size: .7rem; font-weight: 800; }
        .vozon-demo-console > header span { display: flex; align-items: center; gap: 8px; }
        .vozon-demo-console > header i { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,.25); }
        .vozon-demo-console.is-active > header i { background: #45ddce; box-shadow: 0 0 10px #45ddce; }
        .vozon-demo-console > header b { font-family: var(--font-geist-mono),monospace; font-size: .68rem; }
        .vozon-demo-wave { display: flex; height: 84px; align-items: center; justify-content: center; gap: 5px; padding: 0 20px; border-bottom: 1px solid rgba(255,255,255,.06); }
        .vozon-demo-wave i { width: 3px; height: calc(8px + (var(--wave-height, 1) * 1px)); border-radius: 999px; background: rgba(117,255,240,.22); }
        .vozon-demo-wave i:nth-child(3n) { height: 28px; } .vozon-demo-wave i:nth-child(4n) { height: 42px; } .vozon-demo-wave i:nth-child(5n) { height: 20px; }
        .vozon-demo-console.is-active .vozon-demo-wave i { background: linear-gradient(#a5fff6,#45ddce); box-shadow: 0 0 7px rgba(69,221,206,.28); animation: vozonDemoWave .8s ease-in-out infinite alternate; }
        .vozon-demo-console.is-active .vozon-demo-wave i:nth-child(2n) { animation-delay: -.35s; } .vozon-demo-console.is-active .vozon-demo-wave i:nth-child(3n) { animation-delay: -.62s; }
        .vozon-demo-transcript { display: grid; min-height: 190px; gap: 14px; align-content: center; padding: 24px; }
        .vozon-demo-transcript article { display: grid; grid-template-columns: 34px 1fr; gap: 11px; opacity: .25; transform: translateY(5px); transition: opacity .35s ease, transform .35s ease; }
        .vozon-demo-transcript article.is-visible { opacity: 1; transform: none; }
        .vozon-demo-transcript article:nth-child(2) { transition-delay: .18s; }
        .vozon-demo-transcript article span { display: grid; width: 32px; height: 32px; place-items: center; border: 1px solid rgba(117,255,240,.18); border-radius: 50%; color: #75fff0; font-size: .55rem; font-weight: 900; background: rgba(69,221,206,.065); }
        .vozon-demo-transcript article:nth-child(2) span { border-color: rgba(169,155,255,.2); color: #c5bbff; background: rgba(169,155,255,.07); }
        .vozon-demo-transcript p { margin: 0; padding: 11px 14px; border: 1px solid rgba(255,255,255,.075); border-radius: 4px 13px 13px 13px; color: rgba(255,255,255,.72); font-size: .78rem; line-height: 1.6; background: rgba(255,255,255,.035); }
        .vozon-demo-console > footer { display: flex; align-items: center; gap: 11px; padding: 14px 20px; border-top: 1px solid rgba(255,255,255,.07); opacity: .28; background: rgba(255,255,255,.025); transition: opacity .35s ease, background .35s ease; }
        .vozon-demo-console > footer.is-complete { opacity: 1; background: rgba(69,221,206,.045); }
        .vozon-demo-console > footer > span { display: grid; width: 29px; height: 29px; place-items: center; border-radius: 50%; color: #03110e; font-size: .7rem; font-weight: 900; background: #45ddce; }
        .vozon-demo-console > footer div { display: flex; flex-direction: column; gap: 2px; } .vozon-demo-console > footer small { color: rgba(255,255,255,.38); font-size: .58rem; font-weight: 800; text-transform: uppercase; } .vozon-demo-console > footer strong { color: #dffffa; font-size: .72rem; }
        @keyframes vozonDemoWave { from { transform: scaleY(.35); opacity: .55; } to { transform: scaleY(1); opacity: 1; } }

        .vozon-outcomes-section { background: radial-gradient(circle at 15% 45%,rgba(69,221,206,.065),transparent 25%),#000; }
        .vozon-outcomes-heading { display: grid; grid-template-columns: minmax(0,1fr) minmax(280px,.55fr); align-items: end; gap: clamp(28px,5vw,50px); padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,.08); }
        .vozon-outcomes-heading > div:last-child { max-width: 410px; padding-bottom: 4px; }
        .vozon-outcomes-heading > div:last-child > p { margin: 0; color: rgba(255,255,255,.58); font-size: .9rem; line-height: 1.75; }
        .vozon-outcomes-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; margin-top: 32px; }
        .vozon-outcomes-grid article { --outcome-accent:#45ddce; position: relative; display: flex; min-height: 248px; flex-direction: column; padding: 24px; overflow: hidden; border: 1px solid color-mix(in srgb,var(--outcome-accent) 20%,rgba(255,255,255,.08)); border-radius: 18px; background: radial-gradient(circle at 100% 0%,color-mix(in srgb,var(--outcome-accent) 13%,transparent),transparent 42%),linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.018)); box-shadow: inset 0 1px rgba(255,255,255,.035); transition: transform .2s ease,border-color .2s ease,background .2s ease; }
        .vozon-outcomes-grid article:hover { transform: translateY(-3px); border-color: color-mix(in srgb,var(--outcome-accent) 42%,transparent); background: radial-gradient(circle at 100% 0%,color-mix(in srgb,var(--outcome-accent) 17%,transparent),transparent 46%),rgba(255,255,255,.045); }
        .vozon-outcomes-grid article.is-violet { --outcome-accent:#a99bff; } .vozon-outcomes-grid article.is-amber { --outcome-accent:#ffbd70; }
        .vozon-outcome-number { position: absolute; top: 22px; right: 23px; color: rgba(255,255,255,.18); font: 800 .68rem var(--font-geist-mono),monospace; }
        .vozon-outcome-icon { display: grid; width: 44px; height: 44px; place-items: center; padding: 10px; border: 1px solid color-mix(in srgb,var(--outcome-accent) 30%,transparent); border-radius: 12px; color: var(--outcome-accent); background: color-mix(in srgb,var(--outcome-accent) 8%,transparent); }
        .vozon-outcome-icon svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.8; }
        .vozon-outcome-copy { margin-top: 20px; }
        .vozon-outcomes-grid small { display: block; color: var(--outcome-accent); font-size: .62rem; font-weight: 900; letter-spacing: .13em; text-transform: uppercase; }
        .vozon-outcomes-grid h3 { margin: 7px 0 0; color: rgba(255,255,255,.94); font-size: 1.05rem; font-weight: 850; letter-spacing: -.02em; }
        .vozon-outcomes-grid p { margin: 12px 0 0; color: rgba(255,255,255,.52); font-size: .78rem; line-height: 1.65; }
        .vozon-outcomes-quote { position: relative; display: grid; grid-template-columns: auto 1fr; gap: 16px; margin: 12px 0 0; padding: 18px 22px; border: 1px solid rgba(255,255,255,.09); border-radius: 16px; background: rgba(255,255,255,.025); }
        .vozon-outcomes-quote > span { color: #45ddce; font: 900 3.2rem/1 Georgia,serif; opacity: .65; }
        .vozon-outcomes-quote p { max-width: 900px; margin: 2px 0 0; color: rgba(255,255,255,.68); font-size: .9rem; line-height: 1.7; }
        .vozon-outcomes-quote footer { grid-column: 2; display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,.35); font-size: .65rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
        .vozon-outcomes-quote footer i { width: 22px; height: 1px; background: #45ddce; }

        .vozon-trust-section { background: linear-gradient(180deg,#000,#020908); }
        .vozon-trust-shell { display: grid; max-width: 1240px; grid-template-columns: minmax(280px,.72fr) minmax(520px,1.28fr); gap: clamp(26px,4vw,48px); margin: 0 auto; padding: clamp(26px,3.4vw,40px); border: 1px solid rgba(117,255,240,.13); border-radius: 22px; background: radial-gradient(circle at 0% 0%,rgba(69,221,206,.1),transparent 38%),rgba(5,13,12,.92); box-shadow: inset 0 1px rgba(255,255,255,.045),0 26px 70px rgba(0,0,0,.24); }
        .vozon-trust-copy { display: flex; flex-direction: column; justify-content: center; padding: 10px; }
        .vozon-trust-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
        .vozon-trust-grid article { min-width: 0; min-height: 216px; padding: 20px; border: 1px solid rgba(117,255,240,.14); border-radius: 15px; background: linear-gradient(145deg,rgba(69,221,206,.09),rgba(255,255,255,.02) 62%); transition: transform .2s ease,border-color .2s ease,background .2s ease; }
        .vozon-trust-grid article:nth-child(2) { border-color: rgba(169,156,255,.18); background: linear-gradient(145deg,rgba(169,156,255,.1),rgba(255,255,255,.02) 62%); }
        .vozon-trust-grid article:nth-child(3) { border-color: rgba(255,189,112,.18); background: linear-gradient(145deg,rgba(255,189,112,.1),rgba(255,255,255,.02) 62%); }
        .vozon-trust-grid article:hover { transform: translateY(-3px); border-color: rgba(117,255,240,.42); background: rgba(69,221,206,.1); }
        .vozon-trust-grid article > span { display: grid; width: 42px; height: 42px; place-items: center; padding: 10px; border: 1px solid rgba(117,255,240,.19); border-radius: 12px; color: #75fff0; background: rgba(69,221,206,.065); }
        .vozon-trust-grid h3 { margin: 22px 0 0; color: #fff; font-size: .92rem; font-weight: 850; letter-spacing: -.015em; }
        .vozon-trust-grid p { margin: 10px 0 0; color: rgba(255,255,255,.5); font-size: .75rem; line-height: 1.65; }

        @media (max-width: 980px) {
          .vozon-feature-panel { grid-template-columns: 1fr 1.2fr; }
          .vozon-feature-panel-metric { grid-column: 1 / -1; min-height: 170px; }
          .vozon-demo-shell, .vozon-trust-shell { grid-template-columns: 1fr; }
          .vozon-demo-copy { max-width: 680px; }
        }

        @media (max-width: 720px) {
          .vozon-feature-panel, .vozon-outcomes-heading { grid-template-columns: 1fr; }
          .vozon-feature-panel-copy { padding: 10px 8px 18px; }
          .vozon-feature-panel-list { order: 2; }
          .vozon-feature-panel-metric { grid-column: auto; order: 3; }
          .vozon-outcomes-grid, .vozon-trust-grid { grid-template-columns: 1fr; }
          .vozon-outcomes-grid article { min-height: 0; }
          .vozon-trust-shell { gap: 22px; padding: 22px; }
          .vozon-trust-grid article { min-height: 176px; }
        }

        @media (max-width: 520px) {
          .vozon-feature-tabs { gap: 3px; padding: 4px; }
          .vozon-feature-tabs button { min-height: 53px; justify-content:center; gap: 5px; padding:0 7px; font-size: .68rem; }
          .vozon-feature-tabs button > small, .vozon-feature-tabs button > strong i { display:none; }
          .vozon-feature-tabs button > span { width: 18px; height: 18px; }
          .vozon-feature-panel { padding: 12px; border-radius: 18px; }
          .vozon-feature-panel-list article { grid-template-columns: 40px 1fr; }
          .vozon-feature-item-icon { width: 40px; height: 40px; }
          .vozon-demo-console { border-radius: 17px; }
          .vozon-demo-transcript { padding: 18px 14px; }
          .vozon-outcomes-quote { grid-template-columns: 1fr; padding: 21px; }
          .vozon-outcomes-quote > span { display: none; }
          .vozon-outcomes-quote footer { grid-column: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .vozon-feature-panel,
          .vozon-feature-animation-head span i,
          .vozon-feature-card-rail > i,
          .vozon-feature-motion-card,
          .vozon-demo-console.is-active .vozon-demo-wave i { animation: none; }
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

        .vozon-operations-connector {
          filter: drop-shadow(0 0 8px rgba(69,221,206,0.32));
        }

        .vozon-operation-tone-1 {
          --operation-angle: 135deg;
          --operation-primary: #1acfff;
          --operation-secondary: #2be3e1;
          --operation-ink: #d8f8ff;
          --operation-glow: rgba(26,207,255,0.34);
          --operation-surface: rgba(26,207,255,0.2);
          --operation-surface-soft: rgba(43,227,225,0.15);
        }

        .vozon-operation-tone-2 {
          --operation-angle: 165deg;
          --operation-primary: #2be3e1;
          --operation-secondary: #45ddce;
          --operation-ink: #dbfffd;
          --operation-glow: rgba(43,227,225,0.34);
          --operation-surface: rgba(43,227,225,0.2);
          --operation-surface-soft: rgba(69,221,206,0.15);
        }

        .vozon-operation-tone-3 {
          --operation-angle: 205deg;
          --operation-primary: #45ddce;
          --operation-secondary: #58e6b7;
          --operation-ink: #e0fff8;
          --operation-glow: rgba(69,221,206,0.34);
          --operation-surface: rgba(69,221,206,0.2);
          --operation-surface-soft: rgba(88,230,183,0.15);
        }

        .vozon-operation-tone-4 {
          --operation-angle: 315deg;
          --operation-primary: #58e6b7;
          --operation-secondary: #48db8b;
          --operation-ink: #e4fff0;
          --operation-glow: rgba(88,230,183,0.34);
          --operation-surface: rgba(88,230,183,0.2);
          --operation-surface-soft: rgba(72,219,139,0.15);
        }

        .vozon-operation-tone-5 {
          --operation-angle: 35deg;
          --operation-primary: #48db8b;
          --operation-secondary: #75e77c;
          --operation-ink: #dcffe9;
          --operation-glow: rgba(72,219,139,0.34);
          --operation-surface: rgba(72,219,139,0.2);
          --operation-surface-soft: rgba(117,231,124,0.15);
        }

        .vozon-operation-tone-6 {
          --operation-angle: 105deg;
          --operation-primary: #75e77c;
          --operation-secondary: #a4ef80;
          --operation-ink: #efffe7;
          --operation-glow: rgba(117,231,124,0.32);
          --operation-surface: rgba(117,231,124,0.19);
          --operation-surface-soft: rgba(164,239,128,0.14);
        }

        .vozon-operation-step {
          position: relative;
          z-index: 1;
          border: 1px solid transparent;
          background: transparent;
          color: inherit;
          cursor: pointer;
          transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .vozon-operation-step:hover,
        .vozon-operation-step.is-active {
          border-color: color-mix(in srgb, var(--operation-primary) 24%, transparent);
          background: linear-gradient(180deg, color-mix(in srgb, var(--operation-primary) 8%, transparent), transparent);
        }

        .vozon-operation-step:focus-visible,
        .vozon-operation-mobile-trigger:focus-visible {
          outline: 2px solid #75fff0;
          outline-offset: 3px;
        }

        .vozon-operation-step.is-active {
          transform: translateY(-4px);
        }

        .vozon-operation-kicker {
          color: color-mix(in srgb, var(--operation-primary) 82%, white);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
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
          width: 34px;
          height: 34px;
          fill: none;
          stroke: var(--operation-ink);
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.7;
          filter: drop-shadow(0 0 7px var(--operation-glow));
        }

        .vozon-operation-number {
          z-index: 3;
          border: 1px solid color-mix(in srgb, var(--operation-primary) 52%, transparent);
          border-color: color-mix(in srgb, var(--operation-primary) 52%, transparent);
          background: color-mix(in srgb, var(--operation-primary) 14%, #061017);
          color: var(--operation-ink);
          font-size: 9px;
          font-weight: 900;
          box-shadow: 0 0 16px var(--operation-glow);
        }

        .vozon-operation-node {
          position: relative;
          display: block;
          width: 12px;
          height: 12px;
          border: 2px solid #03110f;
          border-radius: 50%;
          background: var(--operation-primary);
          box-shadow:
            0 0 0 4px color-mix(in srgb, var(--operation-primary) 12%, transparent),
            0 0 18px var(--operation-glow);
        }

        .vozon-operation-step:hover .vozon-operation-hex,
        .vozon-operation-step.is-active .vozon-operation-hex {
          transform: translateY(-4px);
          filter: drop-shadow(0 0 22px var(--operation-glow));
        }

        .vozon-operation-detail {
          border: 1px solid color-mix(in srgb, var(--operation-primary) 22%, rgba(255,255,255,0.06));
          border-radius: 28px;
          background:
            radial-gradient(circle at 82% 42%, color-mix(in srgb, var(--operation-primary) 10%, transparent), transparent 34%),
            linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012)),
            rgba(2,12,11,0.9);
          box-shadow: inset 0 1px rgba(255,255,255,0.045), 0 28px 80px rgba(0,0,0,0.34);
        }

        .vozon-operation-detail-copy {
          align-self: center;
        }

        .vozon-operation-detail-index {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 1px solid color-mix(in srgb, var(--operation-primary) 36%, transparent);
          border-radius: 11px;
          background: color-mix(in srgb, var(--operation-primary) 10%, transparent);
          color: var(--operation-ink);
          font-size: 10px;
          font-weight: 900;
        }

        .vozon-operation-cta {
          transition: color 180ms ease, transform 180ms ease;
        }

        .vozon-operation-cta:hover {
          color: #fff;
          transform: translateX(3px);
        }

        .vozon-operation-preview {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 22px;
          background:
            linear-gradient(rgba(69,221,206,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(69,221,206,0.025) 1px, transparent 1px),
            rgba(0,7,7,0.76);
          background-size: 28px 28px;
          box-shadow: inset 0 1px rgba(255,255,255,0.035);
        }

        .vozon-operation-preview-header {
          border-bottom: 1px solid rgba(255,255,255,0.065);
        }

        .vozon-operation-preview-icon,
        .vozon-operation-row-index {
          border: 1px solid color-mix(in srgb, var(--operation-primary) 24%, transparent);
          background: color-mix(in srgb, var(--operation-primary) 9%, rgba(255,255,255,0.02));
          color: var(--operation-ink);
        }

        .vozon-operation-preview-icon svg {
          width: 23px;
          height: 23px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.7;
        }

        .vozon-operation-live {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 9px;
          border: 1px solid rgba(72,219,139,0.2);
          border-radius: 999px;
          color: rgba(190,255,216,0.75);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .vozon-operation-live i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #48db8b;
          box-shadow: 0 0 9px #48db8b;
        }

        .vozon-operation-preview-row {
          border: 1px solid rgba(255,255,255,0.055);
          border-radius: 13px;
          background: rgba(255,255,255,0.025);
          transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .vozon-operation-preview-row:hover {
          border-color: color-mix(in srgb, var(--operation-primary) 22%, transparent);
          background: color-mix(in srgb, var(--operation-primary) 5%, rgba(255,255,255,0.025));
          transform: translateX(3px);
        }

        .vozon-operation-row-index {
          font-size: 9px;
          font-weight: 900;
        }

        .vozon-operation-row-status {
          padding: 5px 8px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--operation-primary) 9%, transparent);
          color: color-mix(in srgb, var(--operation-primary) 76%, white);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .vozon-operation-metric {
          border: 1px solid color-mix(in srgb, var(--operation-primary) 16%, transparent);
          border-radius: 14px;
          background: linear-gradient(90deg, color-mix(in srgb, var(--operation-primary) 7%, transparent), transparent);
        }

        .vozon-operation-signal {
          display: flex;
          height: 40px;
          align-items: center;
          gap: 3px;
        }

        .vozon-operation-signal i {
          display: block;
          width: 3px;
          border-radius: 4px;
          background: linear-gradient(to top, var(--operation-primary), var(--operation-secondary));
          box-shadow: 0 0 7px var(--operation-glow);
          animation: vozonOperationSignal 1.2s ease-in-out infinite alternate;
        }

        .vozon-operation-signal i:nth-child(2n) {
          animation-delay: -0.45s;
        }

        .vozon-operation-signal i:nth-child(3n) {
          animation-delay: -0.8s;
        }

        .vozon-operations-mobile::before {
          content: "";
          position: absolute;
          top: 24px;
          bottom: 24px;
          left: 17px;
          width: 1px;
          background: linear-gradient(#1acfff, #45ddce 48%, #75e77c);
          box-shadow: 0 0 10px rgba(69,221,206,0.28);
        }

        .vozon-operation-mobile-step {
          padding-bottom: 12px;
        }

        .vozon-operation-mobile-node {
          z-index: 1;
          border: 1px solid color-mix(in srgb, var(--operation-primary) 45%, transparent);
          background: #03110f;
          color: var(--operation-ink);
          font-size: 9px;
          font-weight: 900;
          box-shadow: 0 0 14px var(--operation-glow);
        }

        .vozon-operation-mobile-trigger {
          border: 1px solid rgba(255,255,255,0.065);
          background: rgba(255,255,255,0.025);
          color: inherit;
        }

        .vozon-operation-mobile-step.is-active .vozon-operation-mobile-trigger {
          border-color: color-mix(in srgb, var(--operation-primary) 28%, transparent);
          border-bottom-right-radius: 8px;
          border-bottom-left-radius: 8px;
          background: color-mix(in srgb, var(--operation-primary) 6%, rgba(255,255,255,0.025));
        }

        .vozon-operation-mobile-icon {
          border: 1px solid color-mix(in srgb, var(--operation-primary) 22%, transparent);
          background: color-mix(in srgb, var(--operation-primary) 8%, transparent);
          color: var(--operation-ink);
        }

        .vozon-operation-mobile-icon svg {
          width: 23px;
          height: 23px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.7;
        }

        .vozon-operation-mobile-content {
          border: 1px solid color-mix(in srgb, var(--operation-primary) 18%, transparent);
          border-top: 0;
          border-radius: 0 0 18px 18px;
          background: rgba(1,13,11,0.86);
          animation: vozonOperationReveal 220ms ease both;
        }

        .vozon-operation-mobile-bullet {
          display: flex;
          align-items: center;
          gap: 9px;
          color: rgba(255,255,255,0.66);
          font-size: 12px;
          font-weight: 700;
        }

        .vozon-operation-mobile-bullet i {
          width: 5px;
          height: 5px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: var(--operation-primary);
          box-shadow: 0 0 8px var(--operation-glow);
        }

        @keyframes vozonOperationSignal {
          to {
            transform: scaleY(0.58);
            opacity: 0.48;
          }
        }

        @keyframes vozonOperationReveal {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
        }

        @media (max-width: 900px) and (min-width: 768px) {
          .vozon-operation-step {
            padding-inline: 3px;
          }

          .vozon-operation-hex {
            width: 78px;
            height: 74px;
          }

          .vozon-operation-hex svg {
            width: 29px;
            height: 29px;
          }
        }

        .vozon-operation-stage-inner {
          overflow: hidden;
          padding: 1.4rem;
          border: 1px solid rgba(117,255,240,0.13);
          border-radius: 30px;
          background:
            radial-gradient(circle at 50% 36%, color-mix(in srgb, var(--operation-primary) 13%, transparent), transparent 37%),
            linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01)),
            rgba(1,12,11,0.9);
          box-shadow: inset 0 1px rgba(255,255,255,0.05), 0 30px 90px rgba(0,0,0,0.38);
          transition: border-color 300ms ease, background 300ms ease;
        }

        .vozon-operation-stage-meta {
          color: color-mix(in srgb, var(--operation-primary) 78%, white);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .vozon-operation-core-aura {
          position: absolute;
          inset: 19%;
          border-radius: 50%;
          background: var(--operation-primary);
          filter: blur(48px);
          opacity: 0.13;
        }

        .vozon-operation-core-ring {
          position: absolute;
          border: 1px solid color-mix(in srgb, var(--operation-primary) 28%, transparent);
          border-radius: 50%;
        }

        .vozon-operation-core-ring-one {
          inset: 11%;
          border-style: dashed;
          animation: vozonOperationCoreSpin 18s linear infinite;
        }

        .vozon-operation-core-ring-two {
          inset: 22%;
          border-color: color-mix(in srgb, var(--operation-secondary) 34%, transparent);
          animation: vozonOperationCoreSpinReverse 13s linear infinite;
        }

        .vozon-operation-core-ring-three {
          inset: 32%;
          border-style: dotted;
          animation: vozonOperationCoreSpin 9s linear infinite;
        }

        .vozon-operation-core-ring i {
          position: absolute;
          top: -4px;
          left: 23%;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--operation-primary);
          box-shadow: 0 0 13px var(--operation-primary);
        }

        .vozon-operation-core-wave {
          position: absolute;
          right: 4%;
          left: 4%;
          display: flex;
          height: 82px;
          align-items: center;
          justify-content: center;
          gap: 5px;
          opacity: 0.58;
          mask-image: linear-gradient(90deg, transparent, black 18%, black 82%, transparent);
        }

        .vozon-operation-core-wave::before,
        .vozon-operation-core-wave::after {
          content: "";
          height: 1px;
          flex: 1;
          background: linear-gradient(90deg, transparent, var(--operation-primary));
        }

        .vozon-operation-core-wave::after {
          background: linear-gradient(90deg, var(--operation-primary), transparent);
        }

        .vozon-operation-core-wave i {
          width: 3px;
          border-radius: 4px;
          background: linear-gradient(to top, var(--operation-primary), var(--operation-secondary));
          box-shadow: 0 0 8px var(--operation-glow);
          animation: vozonOperationCoreWave 850ms ease-in-out infinite alternate;
        }

        .vozon-operation-core-icon {
          position: relative;
          z-index: 2;
          width: 126px;
          height: 126px;
          border: 1px solid color-mix(in srgb, var(--operation-primary) 42%, transparent);
          border-radius: 34px;
          background:
            radial-gradient(circle at 25% 18%, color-mix(in srgb, var(--operation-primary) 20%, transparent), transparent 46%),
            linear-gradient(145deg, rgba(8,30,27,0.96), rgba(1,11,10,0.98));
          color: var(--operation-ink);
          box-shadow: inset 0 1px rgba(255,255,255,0.09), 0 0 34px var(--operation-glow);
          clip-path: polygon(24% 3%,76% 3%,97% 24%,97% 76%,76% 97%,24% 97%,3% 76%,3% 24%);
        }

        .vozon-operation-core-icon svg {
          width: 54px;
          height: 54px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.55;
        }

        .vozon-operation-core-number {
          position: absolute;
          z-index: 3;
          right: 26%;
          bottom: 26%;
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border: 1px solid color-mix(in srgb, var(--operation-primary) 46%, transparent);
          border-radius: 50%;
          background: #03110f;
          color: var(--operation-ink);
          font-size: 10px;
          font-weight: 900;
          box-shadow: 0 0 16px var(--operation-glow);
        }

        .vozon-operation-stage-footer {
          padding: 1rem;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 15px;
          background: rgba(255,255,255,0.025);
        }

        .vozon-operation-stage-footer small,
        .vozon-operation-card-outcome small {
          display: block;
          color: rgba(255,255,255,0.34);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .vozon-operation-stage-footer strong,
        .vozon-operation-card-outcome strong {
          display: block;
          margin-top: 4px;
          color: #fff;
          font-size: 13px;
        }

        .vozon-operation-progress {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vozon-operation-progress i {
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          transition: width 240ms ease, background 240ms ease, box-shadow 240ms ease;
        }

        .vozon-operation-progress i.is-active {
          width: 24px;
          background: var(--operation-primary);
          box-shadow: 0 0 10px var(--operation-glow);
        }

        .vozon-operation-story-list {
          display: grid;
          gap: 1.35rem;
        }

        .vozon-operation-story-card {
          overflow: hidden;
          padding: 1.5rem;
          border: 1px solid rgba(255,255,255,0.065);
          border-radius: 25px;
          outline: none;
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--operation-primary) 5%, transparent), transparent 42%),
            rgba(255,255,255,0.022);
          box-shadow: inset 0 1px rgba(255,255,255,0.035);
          opacity: 0.72;
          transform: scale(0.985);
          transition: opacity 280ms ease, transform 280ms ease, border-color 280ms ease, background 280ms ease, box-shadow 280ms ease;
        }

        .vozon-operation-story-card.is-active,
        .vozon-operation-story-card:focus-visible,
        .vozon-operation-story-card:hover {
          border-color: color-mix(in srgb, var(--operation-primary) 32%, transparent);
          background:
            radial-gradient(circle at 92% 8%, color-mix(in srgb, var(--operation-primary) 11%, transparent), transparent 32%),
            linear-gradient(135deg, color-mix(in srgb, var(--operation-primary) 7%, transparent), transparent 46%),
            rgba(255,255,255,0.03);
          box-shadow: inset 0 1px rgba(255,255,255,0.055), 0 24px 65px rgba(0,0,0,0.28), 0 0 32px color-mix(in srgb, var(--operation-glow) 34%, transparent);
          opacity: 1;
          transform: scale(1);
        }

        .vozon-operation-card-topline {
          position: absolute;
          inset: 0 0 auto;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--operation-primary), var(--operation-secondary), transparent);
          opacity: 0.72;
        }

        .vozon-operation-card-icon {
          border: 1px solid color-mix(in srgb, var(--operation-primary) 27%, transparent);
          border-radius: 16px;
          background: color-mix(in srgb, var(--operation-primary) 8%, rgba(255,255,255,0.02));
          color: var(--operation-ink);
          box-shadow: inset 0 1px rgba(255,255,255,0.06), 0 0 18px color-mix(in srgb, var(--operation-glow) 48%, transparent);
        }

        .vozon-operation-card-icon svg {
          width: 30px;
          height: 30px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.65;
        }

        .vozon-operation-card-header small {
          color: color-mix(in srgb, var(--operation-primary) 78%, white);
        }

        .vozon-operation-card-number {
          color: color-mix(in srgb, var(--operation-primary) 25%, rgba(255,255,255,0.1));
          font-size: clamp(2rem,4vw,3.3rem);
          font-weight: 950;
          line-height: 0.9;
        }

        .vozon-operation-card-features span {
          display: flex;
          min-height: 42px;
          align-items: center;
          gap: 8px;
          padding: 9px 10px;
          border: 1px solid rgba(255,255,255,0.055);
          border-radius: 11px;
          background: rgba(255,255,255,0.022);
          color: rgba(255,255,255,0.58);
          font-size: 10px;
          font-weight: 800;
        }

        .vozon-operation-card-features i {
          width: 5px;
          height: 5px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: var(--operation-primary);
          box-shadow: 0 0 8px var(--operation-glow);
        }

        .vozon-operation-card-outcome {
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .vozon-operation-card-signal {
          display: flex;
          height: 42px;
          align-items: center;
          gap: 3px;
        }

        .vozon-operation-card-signal i {
          display: block;
          width: 3px;
          border-radius: 3px;
          background: linear-gradient(to top, var(--operation-primary), var(--operation-secondary));
          box-shadow: 0 0 6px var(--operation-glow);
          animation: vozonOperationCoreWave 1.1s ease-in-out infinite alternate;
        }

        .vozon-operation-story-node,
        .vozon-operation-story-line {
          display: none;
        }

        .vozon-operation-scroll-cta {
          border: 1px solid rgba(117,255,240,0.24);
          background: linear-gradient(135deg, rgba(26,207,255,0.15), rgba(43,227,225,0.18), rgba(72,219,139,0.16));
          color: #dffffa;
          box-shadow: inset 0 1px rgba(255,255,255,0.08), 0 16px 38px rgba(29,244,203,0.1);
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }

        .vozon-operation-scroll-cta:hover {
          border-color: rgba(117,255,240,0.44);
          box-shadow: inset 0 1px rgba(255,255,255,0.1), 0 20px 45px rgba(29,244,203,0.16);
          transform: translateY(-2px);
        }

        .vozon-operation-horizontal-sticky {
          transition: color 240ms ease;
        }

        .vozon-operation-horizontal-status {
          min-height: 62px;
        }

        .vozon-operation-horizontal-label,
        .vozon-operation-horizontal-count {
          color: color-mix(in srgb, var(--operation-primary) 78%, white);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .vozon-operation-horizontal-viewport {
          position: relative;
          overflow-x: auto;
          overflow-y: hidden;
          padding-block: 3rem 1rem;
          scrollbar-width: none;
          scroll-snap-type: x mandatory;
          mask-image: linear-gradient(90deg, transparent, black 3%, black 97%, transparent);
        }

        .vozon-operation-horizontal-viewport::-webkit-scrollbar {
          display: none;
        }

        .vozon-operation-horizontal-track {
          position: relative;
          display: flex;
          width: max-content;
          gap: 1rem;
          padding-inline: 0.75rem;
          will-change: transform;
        }

        .vozon-operation-horizontal-line {
          position: absolute;
          top: -1.45rem;
          right: 1rem;
          left: 1rem;
          height: 1px;
          background: linear-gradient(90deg, #1acfff, #2be3e1 32%, #45ddce 58%, #75e77c);
          box-shadow: 0 0 11px rgba(69,221,206,0.3);
        }

        .vozon-operation-horizontal-card {
          display: flex;
          width: min(84vw, 360px);
          min-height: 470px;
          flex: 0 0 auto;
          flex-direction: column;
          overflow: visible;
          scroll-snap-align: center;
        }

        .vozon-operation-horizontal-card::before {
          content: "";
          position: absolute;
          inset: 1px;
          z-index: -1;
          border-radius: inherit;
          background:
            radial-gradient(circle at 90% 7%, color-mix(in srgb, var(--operation-primary) 10%, transparent), transparent 28%),
            linear-gradient(155deg, rgba(8,31,27,0.98), rgba(1,12,11,0.98));
        }

        .vozon-operation-horizontal-node {
          position: absolute;
          top: -3.3rem;
          left: 1.4rem;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--operation-ink);
          font-size: 9px;
          font-weight: 900;
        }

        .vozon-operation-horizontal-node i {
          display: block;
          width: 12px;
          height: 12px;
          border: 2px solid #03110f;
          border-radius: 50%;
          background: var(--operation-primary);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--operation-primary) 10%, transparent), 0 0 15px var(--operation-glow);
        }

        @media (min-width: 1024px) {
          .vozon-operation-horizontal-shell {
            min-height: 100vh;
          }

          .vozon-operation-horizontal-sticky {
            position: sticky;
            top: 0;
            display: flex;
            min-height: 100vh;
            flex-direction: column;
            justify-content: center;
            padding-block: 5.5rem 2rem;
          }

          .vozon-operation-horizontal-viewport {
            overflow: hidden;
            padding-bottom: 1.25rem;
          }

          .vozon-operation-horizontal-track {
            gap: 1.25rem;
            transition: transform 90ms linear;
          }

          .vozon-operation-horizontal-card {
            width: 390px;
            min-height: 490px;
            padding: 1.85rem;
          }
        }

        @media (max-width: 1023px) {
          .vozon-operation-horizontal-status {
            padding-inline: 0.3rem;
          }

          .vozon-operation-horizontal-track {
            transform: none !important;
          }
        }

        @keyframes vozonOperationCoreSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes vozonOperationCoreSpinReverse {
          to { transform: rotate(-360deg); }
        }

        @keyframes vozonOperationCoreWave {
          to { transform: scaleY(0.48); opacity: 0.5; }
        }

        @media (min-width: 1024px) {
          .vozon-operation-story-list {
            gap: 5rem;
            padding-block: 1.5rem 5rem;
          }

          .vozon-operation-story-card {
            min-height: 430px;
            padding: 2rem;
          }

          .vozon-operation-story-line {
            position: absolute;
            top: 2rem;
            bottom: 5rem;
            left: -2.05rem;
            display: block;
            width: 1px;
            background: linear-gradient(#1acfff, #45ddce 48%, #75e77c);
            box-shadow: 0 0 10px rgba(69,221,206,0.24);
          }

          .vozon-operation-story-node {
            top: 2.1rem;
            left: -3.15rem;
            z-index: 2;
            display: grid;
            width: 34px;
            height: 34px;
            place-items: center;
            border: 1px solid color-mix(in srgb, var(--operation-primary) 42%, transparent);
            border-radius: 50%;
            background: #03110f;
            color: var(--operation-ink);
            font-size: 9px;
            font-weight: 900;
            box-shadow: 0 0 14px var(--operation-glow);
          }
        }

        @media (max-width: 639px) {
          .vozon-operation-story-card {
            padding: 1.15rem;
            border-radius: 20px;
          }

          .vozon-operation-card-icon {
            width: 46px;
            height: 46px;
          }

          .vozon-operation-card-number {
            display: none;
          }

          .vozon-operation-card-features {
            grid-template-columns: 1fr;
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

          .vozon-fit-tabs {
            grid-template-columns: 1fr;
            gap: 0.35rem;
          }

          .vozon-fit-tab {
            min-height: 54px;
            padding: 0.65rem 0.8rem;
          }

          .vozon-fit-tab-active {
            box-shadow: inset 0 0 28px rgba(69,221,206,0.06);
          }

          .vozon-fit-content {
            min-height: auto;
            border-right: 0;
            border-top: 1px solid rgba(255,255,255,0.08);
            padding: 1.4rem 1.25rem;
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
            animation: none;
            transform: none;
          }

          .vozon-operation-signal i,
          .vozon-operation-mobile-content,
          .vozon-operation-core-ring,
          .vozon-operation-core-wave i,
          .vozon-operation-card-signal i {
            animation: none;
          }

          .vozon-operation-horizontal-shell {
            height: auto;
          }

          .vozon-operation-horizontal-sticky {
            position: static;
            min-height: auto;
          }

          .vozon-operation-horizontal-viewport {
            overflow-x: auto;
          }

          .vozon-operation-horizontal-track {
            transform: none !important;
            transition: none;
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

