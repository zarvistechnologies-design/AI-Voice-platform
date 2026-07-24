"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AudioWaveHero } from "./AudioWaveHero";
import { GreenVoiceOrb } from "./GreenVoiceOrb";

const languageOptions = [
  {
    code: "EN",
    name: "English",
    locale: "en-US",
    tone: "#45ddce",
    patient: "Can I book an appointment with the doctor?",
    reply: "Yes! Dr. Patel has an opening tomorrow at 4 PM. Shall I book it?",
    translated: "translated live - English",
    cta: "Try Vozon in English",
  },
  {
    code: "ES",
    name: "Spanish",
    locale: "es-ES",
    tone: "#f28d45",
    patient: "¿Puedo reservar una cita con el doctor?",
    reply: "Sí. El Dr. Patel tiene un espacio mañana a las 4 p. m. ¿Lo reservo?",
    translated: "translated live - Spanish",
    cta: "Try Vozon in Spanish",
  },
  {
    code: "FR",
    name: "French",
    locale: "fr-FR",
    tone: "#f28d45",
    patient: "Puis-je prendre rendez-vous avec le docteur ?",
    reply: "Oui. Le Dr Patel est disponible demain à 16 h. Je réserve ?",
    translated: "translated live - French",
    cta: "Try Vozon in French",
  },
  {
    code: "DE",
    name: "German",
    locale: "de-DE",
    tone: "#8f83e8",
    patient: "Kann ich einen Termin beim Arzt buchen?",
    reply: "Ja. Dr. Patel hat morgen um 16 Uhr Zeit. Soll ich buchen?",
    translated: "translated live - German",
    cta: "Try Vozon in German",
  },
  {
    code: "PT",
    name: "Portuguese",
    locale: "pt-PT",
    tone: "#f2d24b",
    patient: "Posso marcar uma consulta com o médico?",
    reply: "Sim. O Dr. Patel tem horário amanhã às 16h. Posso marcar?",
    translated: "translated live - Portuguese",
    cta: "Try Vozon in Portuguese",
  },
  {
    code: "HI",
    name: "Hindi",
    locale: "hi-IN",
    tone: "#f28d45",
    patient: "क्या मैं डॉक्टर से अपॉइंटमेंट बुक कर सकती हूँ?",
    reply: "हाँ। डॉ. पटेल के पास कल शाम 4 बजे समय है। क्या मैं बुक कर दूँ?",
    translated: "translated live - Hindi",
    cta: "Try Vozon in Hindi",
  },
  {
    code: "AR",
    name: "Arabic",
    locale: "ar-SA",
    tone: "#8bc5ec",
    patient: "هل يمكنني حجز موعد مع الطبيب؟",
    reply: "نعم. لدى الدكتور باتيل موعد غدًا الساعة 4 مساءً. هل أحجزه؟",
    translated: "translated live - Arabic",
    cta: "Try Vozon in Arabic",
  },
  {
    code: "ZH",
    name: "Mandarin",
    locale: "zh-CN",
    tone: "#45ddce",
    patient: "我可以预约医生吗？",
    reply: "可以。帕特尔医生明天下午4点有空。要我帮您预约吗？",
    translated: "translated live - Mandarin",
    cta: "Try Vozon in Mandarin",
  },
];

const femaleVoiceHints: Record<string, string[]> = {
  en: ["aria", "ava", "fiona", "hazel", "jenny", "karen", "moira", "samantha", "susan", "tessa", "victoria", "zira"],
  es: ["conchita", "dalia", "elvira", "helena", "luciana", "monica", "paloma", "paulina", "sabina"],
  fr: ["amelie", "audrey", "celine", "denise", "hortense", "julie"],
  de: ["anna", "heda", "hedda", "katja", "petra", "vicki"],
  pt: ["fernanda", "francisca", "helia", "joana", "luciana", "maria"],
  hi: ["heera", "kalpana", "lekha", "swara", "veena"],
  ar: ["hoda", "laila", "salma", "zeina"],
  zh: ["huihui", "mei-jia", "sin-ji", "tingting", "xiaoxiao", "xiaoyi", "yaoyao"],
};

const maleVoiceHints = [
  "david",
  "daniel",
  "george",
  "guy",
  "hemant",
  "kangkang",
  "mark",
  "naayf",
  "pablo",
  "paul",
  "stefan",
  "thomas",
];

function findFemaleVoice(voices: SpeechSynthesisVoice[], locale: string) {
  const languagePrefix = locale.split("-")[0].toLowerCase();
  const matchingVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(languagePrefix));
  const hints = femaleVoiceHints[languagePrefix] ?? [];

  return (
    matchingVoices.find((voice) => {
      const voiceName = `${voice.name} ${voice.voiceURI}`.toLowerCase();
      return voiceName.includes("female") || hints.some((hint) => voiceName.includes(hint));
    }) ??
    matchingVoices.find((voice) => {
      const voiceName = `${voice.name} ${voice.voiceURI}`.toLowerCase();
      return !maleVoiceHints.some((hint) => voiceName.includes(hint));
    }) ??
    null
  );
}

const languageStats = [
  ["8+", "Languages"],
  ["95%", "Sounds native"],
  ["0.8s", "Avg. reply time"],
];

const companyLogos = [
  { name: "Google", src: "/images/company-logos/google.svg" },
  { name: "HubSpot", src: "/images/company-logos/hubspot.svg" },
  { name: "Shopify", src: "/images/company-logos/shopify.svg" },
  { name: "Stripe", src: "/images/company-logos/stripe.svg" },
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
  const [selectedLanguageCode, setSelectedLanguageCode] = useState("EN");
  const [selectedFitKey, setSelectedFitKey] = useState("support");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRunRef = useRef(0);
  const speechFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedLanguage =
    languageOptions.find((language) => language.code === selectedLanguageCode) ?? languageOptions[0];
  const selectedFit = fitSections.find((section) => section.key === selectedFitKey) ?? fitSections[0];
  const selectedFitIndex = Math.max(0, fitSections.findIndex((section) => section.key === selectedFit.key));

  useEffect(() => {
    return () => {
      speechRunRef.current += 1;
      if (speechFallbackRef.current) clearTimeout(speechFallbackRef.current);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speakLanguageReply = (language: (typeof languageOptions)[number]) => {
    setSelectedLanguageCode(language.code);
    speechRunRef.current += 1;
    const speechRun = speechRunRef.current;

    if (speechFallbackRef.current) clearTimeout(speechFallbackRef.current);
    setIsSpeaking(true);

    const finishSpeaking = () => {
      if (speechRun === speechRunRef.current) setIsSpeaking(false);
    };

    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      speechFallbackRef.current = setTimeout(finishSpeaking, 4000);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(language.reply);
    utterance.lang = language.locale;
    utterance.rate = 0.94;
    utterance.pitch = 1.08;
    utterance.voice = findFemaleVoice(window.speechSynthesis.getVoices(), language.locale);
    utterance.onend = finishSpeaking;
    utterance.onerror = finishSpeaking;
    window.speechSynthesis.speak(utterance);

    speechFallbackRef.current = setTimeout(finishSpeaking, 15000);
  };

  return (
    <div className="vozon-home relative isolate overflow-hidden bg-black text-white">
      <section id="product" className="relative mx-auto flex min-h-screen max-w-[1600px] items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-8 lg:pt-32">
        <AudioWaveHero />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,.16)_60%,rgba(0,0,0,.86)_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-[1280px]">
        <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/30 px-4 py-2 text-xs font-semibold text-white/80 shadow-[inset_0_0_22px_rgba(255,255,255,0.04)] backdrop-blur">
          <span className="size-2 rounded-full bg-[#22f4d2] shadow-[0_0_14px_#22f4d2]" />
          Voice Agents Live Now
        </div>
        <h1 className="mx-auto m-0 max-w-5xl text-[clamp(1.75rem,8vw,2.1rem)] font-black leading-[1.02] tracking-[-0.025em] text-white [overflow-wrap:anywhere] sm:text-[clamp(2.1rem,5.6vw,4.7rem)] sm:leading-[0.98] sm:tracking-[-0.03em]">
          Launch enterprise-ready{" "}
          <span>AI voice agents</span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-white/56 sm:text-base">
          vozon.ai helps teams answer every call, qualify every lead, book every next step, and turn conversations into clean workflows for sales, support, and operations.
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
            <div className="vozon-company-track flex min-w-full shrink-0 items-center gap-16 px-8" key={track}>
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

      <section className="vozon-language-section relative mx-auto mt-8 max-w-[1280px] px-5 pb-16 pt-4 sm:mt-12 sm:px-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#f28d45]/38 bg-[#f28d45]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-[#ff9e49]">
            <span className="size-1.5 rounded-full bg-[#ff9e49]" />
            Multilingual Voice AI
          </div>

          <h2 className="vozon-platform-heading mx-auto m-0 max-w-5xl text-white lg:whitespace-nowrap">
            Sounds like home <span>wherever home is.</span>
          </h2>
        </div>

        <div className="grid items-stretch gap-12 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-16">
        <div className="relative flex flex-col py-5">
          <p className="m-0 max-w-[600px] text-base leading-7 text-[#c9fff7]/84">
            Vozon picks up in whatever language your customer is already speaking, with natural replies, live translation, and human handoff when it matters.
          </p>

          <div className="mt-9 flex max-w-[720px] flex-wrap gap-3">
            {languageOptions.map((language) => (
              <button
                aria-pressed={selectedLanguage.code === language.code}
                className={`vozon-language-pill inline-flex min-h-11 items-center gap-3 rounded-full border px-4 pr-5 text-[13px] font-black text-white transition ${
                  selectedLanguage.code === language.code
                    ? "border-[#45ddce] bg-[#45ddce]/12 shadow-[0_0_24px_rgba(69,221,206,0.2)]"
                    : "border-white/10 bg-white/[0.045]"
                }`}
                key={language.code}
                onClick={() => speakLanguageReply(language)}
                type="button"
              >
                <span
                  className="grid size-7 place-items-center rounded-full text-[10px] font-black text-[#02110d]"
                  style={{ backgroundColor: language.tone }}
                >
                  {language.code}
                </span>
                {language.name}
              </button>
            ))}
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-6">
            {languageStats.map(([value, label]) => (
              <div key={label}>
                <strong className="block text-[1.7rem] font-black text-[#22f4d2]">{value}</strong>
                <span className="mt-2 block text-[11px] font-black uppercase tracking-[0.12em] text-white/42">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-black/20 px-5 py-3 text-[13px] text-white/78">
            <span className="font-black tracking-[0.16em] text-[#ffb234]">*****</span>
            <span>4.9 from 12,000+ people who have talked to Vozon</span>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a className="vozon-language-cta inline-flex min-h-14 min-w-[260px] items-center justify-center rounded-full px-7 text-[15px] font-black text-[#02110d]" href="#platform">
              {selectedLanguage.cta}
              <span className="ml-3" aria-hidden="true">-&gt;</span>
            </a>
            <span className="text-sm text-white/42">No card needed</span>
          </div>
        </div>

        <div className="relative flex w-full items-center justify-center lg:justify-end">
          <div className="relative flex min-h-[500px] w-full max-w-[430px] flex-col sm:min-h-[540px]">
            <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center px-2 pb-2 pt-2 text-center sm:px-6">
              <GreenVoiceOrb isSpeaking={isSpeaking} language={selectedLanguage.name} />

              <p aria-live="polite" className="mt-7 mb-0 text-sm font-medium text-white/48">
                {isSpeaking ? `Speaking in ${selectedLanguage.name}` : `Hello, I'm Vozon`}
              </p>
              <h3 className="mt-3 mb-0 max-w-[310px] text-[2rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white">
                {isSpeaking ? "Here’s what I found for you." : "How can I help you today?"}
              </h3>

              <div className="mt-auto w-full">
                <button
                  aria-label={`Speak with Vozon in ${selectedLanguage.name}`}
                  className={`vozon-voice-input flex min-h-[68px] w-full items-center justify-between rounded-full border px-7 text-left text-sm font-semibold transition ${isSpeaking ? "is-speaking" : ""}`}
                  onClick={() => speakLanguageReply(selectedLanguage)}
                  type="button"
                >
                  <span>{isSpeaking ? "Speaking now…" : "Start voice demo"}</span>
                  <span className="flex h-7 items-center gap-[3px]" aria-hidden="true">
                    {[9, 16, 23, 13, 19].map((height, index) => (
                      <span
                        className="vozon-orb-voice-bar block w-[2px] rounded-full"
                        key={height}
                        style={{ height, animationDelay: `${index * 85}ms` }}
                      />
                    ))}
                  </span>
                </button>
                <p className="mt-4 text-[11px] font-medium text-white/32">
                  {selectedLanguage.translated}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1240px] px-5 pb-4 pt-2 sm:px-8 sm:pb-5 lg:pb-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-[#75fff0]">
            One Platform
          </div>
          <h2 className="vozon-platform-heading mx-auto m-0 max-w-5xl text-white lg:whitespace-nowrap">
            Every AI voice layer connected in one place
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/54">
            LLMs, speech, realtime, vision, and external tools stay coordinated through the Vozon agent layer.
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
              Vozon gives your team the building blocks to create agents, connect business knowledge, launch calls, monitor outcomes, and move conversation data into the systems you already use.
            </p>
          </div>

          <div className="vozon-operations-viewport mt-10 overflow-x-auto pb-4 sm:mt-14" role="region" aria-label="AI voice operations workflow" tabIndex={0}>
            <div className="vozon-operations-map relative mx-auto min-w-[1080px]">
              <svg className="vozon-operations-connector absolute inset-x-0 top-0 h-[180px] w-full" viewBox="0 0 1200 180" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="vozonOperationsLine" x1="0" x2="1200" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1acfff" stopOpacity="0.18" />
                    <stop offset="0.22" stopColor="#2be3e1" stopOpacity="0.78" />
                    <stop offset="0.52" stopColor="#75fff0" stopOpacity="0.9" />
                    <stop offset="0.8" stopColor="#48db8b" stopOpacity="0.78" />
                    <stop offset="1" stopColor="#48db8b" stopOpacity="0.18" />
                  </linearGradient>
                </defs>
                <path d="M100 78 L300 118 L500 78 L700 118 L900 78 L1100 118" fill="none" stroke="url(#vozonOperationsLine)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>

              <div className="relative grid grid-cols-6">
                {voiceOperationSteps.map((step, index) => (
                  <article
                    className={`vozon-operation-step relative flex min-w-0 flex-col items-center px-3 text-center ${index % 2 === 1 ? "vozon-operation-step-lower" : ""}`}
                    key={step.number}
                  >
                    <div className="vozon-operation-hex relative grid h-[108px] w-[116px] place-items-center" aria-hidden="true">
                      <div className="vozon-operation-hex-inner absolute inset-[3px]" />
                      <VoiceOperationIcon icon={step.icon} />
                      <span className="vozon-operation-number absolute -right-2 -top-1 grid size-7 place-items-center rounded-full border border-[#75fff0]/30 bg-[#061b18] text-[9px] font-black text-[#8afff2]">
                        {step.number}
                      </span>
                    </div>

                    <span className="vozon-operation-stem block h-8 w-px" aria-hidden="true" />
                    <span className="vozon-operation-dot block size-3 rounded-full bg-[#45ddce]" aria-hidden="true" />
                    <h3 className="mb-0 mt-5 text-base font-black leading-tight text-white">{step.title}</h3>
                    <p className="mb-0 mt-3 max-w-[180px] text-xs leading-5 text-white/48">{step.body}</p>
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

      <section className="vozon-fit-section relative overflow-hidden px-5 py-16 sm:px-8 lg:py-20">
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#45ddce]/24 bg-[#45ddce]/[0.07] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#75fff0]">
              <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_12px_#45ddce]" />
              Where Vozon Fits
            </div>
            <h2 className="mx-auto m-0 max-w-3xl text-[2rem] font-black leading-[1.12] text-white sm:text-[2.55rem] lg:text-[3.15rem]">
              One voice agent, every industry
              <span className="block text-white/42">that answers a phone</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/56 sm:text-base">
              Support, virtual assistants, or voice-enabled hardware. The same agent adapts to how your business actually talks to people.
            </p>
          </div>

          <div className="vozon-fit-panel mt-12">
            <div aria-label="Vozon use cases" className="vozon-fit-tabs" role="tablist">
              {fitSections.map((section, index) => (
                <button
                  aria-controls={`vozon-fit-panel-${section.key}`}
                  aria-selected={selectedFit.key === section.key}
                  className={`vozon-fit-tab vozon-fit-tab-tone-${index + 1} min-w-0 px-4 py-4 text-left font-bold transition ${
                    selectedFit.key === section.key ? "vozon-fit-tab-active text-white" : "text-white/55 hover:text-white/78"
                  }`}
                  id={`vozon-fit-tab-${section.key}`}
                  key={section.key}
                  onClick={() => setSelectedFitKey(section.key)}
                  role="tab"
                  type="button"
                >
                  <span className="vozon-fit-tab-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="vozon-fit-tab-label">{section.label}</span>
                </button>
              ))}
            </div>

            <div
              aria-labelledby={`vozon-fit-tab-${selectedFit.key}`}
              className={`vozon-fit-content-grid vozon-fit-theme-${selectedFitIndex + 1} grid lg:grid-cols-3`}
              id={`vozon-fit-panel-${selectedFit.key}`}
              role="tabpanel"
            >
              {selectedFit.columns.map((column, index) => (
                <article
                  className="vozon-fit-content min-h-[250px] px-7 py-8 sm:px-8 sm:py-9"
                  key={column.title}
                >
                  <div className="vozon-fit-card-meta mb-7 flex items-center gap-3">
                    <span className="vozon-fit-index grid size-10 place-items-center rounded-lg text-xs font-black">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="vozon-fit-kicker text-[10px] font-black uppercase tracking-[0.18em]">
                      Use case
                    </span>
                  </div>
                  <h3 className="m-0 text-xl font-black leading-tight text-white">{column.title}</h3>
                  <p className="mt-4 mb-0 text-sm leading-7 text-white/58 sm:text-base">{column.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="integrations" className="vozon-integrations-section relative overflow-hidden px-5 py-14 sm:px-8 lg:py-[72px]">
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#45ddce]">
              <span className="h-px w-8 bg-[#45ddce]" />
              Integrations
            </div>

            <h2 className="vozon-platform-heading m-0 max-w-3xl text-white">
              From script to spoken word,{" "}
              <span>wired end to end.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              Vozon routes every call through one continuous signal path - configure, connect, voice, deploy - so your agent goes live without stitching tools together yourself.
            </p>
          </div>

          <div className="vozon-integration-flow relative mt-12">
            <div className="vozon-integration-rail relative z-10 grid auto-cols-[minmax(268px,1fr)] grid-flow-col items-stretch gap-4 overflow-x-auto pb-4 lg:grid-flow-row lg:grid-cols-4 lg:overflow-visible lg:pb-0">
              {integrationSteps.map((step) => (
                <article className="vozon-integration-card relative flex min-h-[332px] flex-col p-6" key={step.number}>
                  <span className="vozon-integration-step-number text-[2.35rem] font-black leading-none text-white/[0.13]">
                    {step.number}
                  </span>

                  <div className="vozon-integration-icon grid size-[52px] place-items-center rounded-[15px] border border-[#45ddce]/28 bg-[#45ddce]/10 text-[#9dfff4]">
                    <IntegrationIcon icon={step.icon} />
                  </div>

                  <h3 className="mt-7 mb-0 text-xl font-black leading-tight text-white">{step.title}</h3>

                  <ul className="mt-5 space-y-3.5 p-0 text-sm leading-6 text-white/55">
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

                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    {step.tags.map((tag) => (
                      <span className="rounded-full border border-white/12 px-3 py-1 text-xs font-bold text-white/42" key={tag}>
                        {tag}
                      </span>
                    ))}
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
        }

        .vozon-language-pill:hover {
          border-color: rgba(69,221,206,0.7);
          background: rgba(69,221,206,0.1);
          transform: translateY(-2px);
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
