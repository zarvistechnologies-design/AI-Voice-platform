"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { customerReviews } from "@/config/customerReviews";
import { useHomepageVoiceCall } from "@/components/sections/useHomepageVoiceCall";
import { VoiceOperationsShowcase } from "@/components/sections/VoiceOperationsShowcase";
import { FloatingReviewsSection } from "@/components/sections/FloatingReviewsSection";
import { AgenticPillarsSection } from "@/components/sections/AgenticPillarsSection";
import { ArchitecturalComparisonSection } from "@/components/sections/ArchitecturalComparisonSection";
import { AgenticInActionSection } from "@/components/sections/AgenticInActionSection";
import { CorePlatformArchitectureSection } from "@/components/sections/CorePlatformArchitectureSection";
import { PitchPunchlinesSection } from "@/components/sections/PitchPunchlinesSection";

/* ------------------------------------------------------------------
   ORIGINAL DATA & CONTENT PRESERVED (NO TEXT OR PICTURE CHANGES)
   ------------------------------------------------------------------ */

// 12 Native Indic & Global Voice Languages with Audio Files
const voiceLanguages = [
  { label: "English", language: "English", voice: "English", detail: "Global voice", file: "/audio/india-voices/en.wav" },
  { label: "हिन्दी", language: "Hindi", voice: "Hindi", detail: "हिन्दी voice", file: "/audio/india-voices/hi.wav" },
  { label: "ગુજરાતી", language: "Gujarati", voice: "Gujarati", detail: "ગુજરાતી voice", file: "/audio/india-voices/gu.wav" },
  { label: "ಕನ್ನಡ", language: "Kannada", voice: "Kannada", detail: "ಕನ್ನಡ voice", file: "/audio/india-voices/kn.wav" },
  { label: "বাংলা", language: "Bengali", voice: "Bengali", detail: "বাংলা voice", file: "/audio/india-voices/bn.wav" },
  { label: "मराठी", language: "Marathi", voice: "Marathi", detail: "मराठी voice", file: "/audio/india-voices/mr.wav" },
  { label: "தமிழ்", language: "Tamil", voice: "Tamil", detail: "தமிழ் voice", file: "/audio/india-voices/ta.wav" },
  { label: "తెలుగు", language: "Telugu", voice: "Telugu", detail: "తెలుగు voice", file: "/audio/india-voices/te.wav" },
  { label: "മലയാളം", language: "Malayalam", voice: "Malayalam", detail: "മലയാളം voice", file: "/audio/india-voices/en.wav" },
  { label: "ਪੰਜਾਬੀ", language: "Punjabi", voice: "Punjabi", detail: "ਪੰਜਾਬੀ voice", file: "/audio/india-voices/hi.wav" },
  { label: "ଓଡ଼ିଆ", language: "Odia", voice: "Odia", detail: "ଓଡ଼ିଆ voice", file: "/audio/india-voices/en.wav" },
  { label: "অসমীয়া", language: "Assamese", voice: "Assamese", detail: "অসমীয়া voice", file: "/audio/india-voices/en.wav" },
] as const;

// 4 Implementation Steps
const steps = [
  {
    number: "01",
    stepTag: "STEP 01",
    subtitle: "Agent Studio",
    title: "Configure agent & knowledge",
    copy: "Define persona prompt, sync business knowledge (PDF/docs), and set smart phone transfer rules.",
  },
  {
    number: "02",
    stepTag: "STEP 02",
    subtitle: "Intelligence Stack",
    title: "Select low-latency models",
    copy: "Choose from OpenAI GPT-4o, Google Gemini 2.0 Flash, or Sarvam Indic LLM for real-time speech.",
  },
  {
    number: "03",
    stepTag: "STEP 03",
    subtitle: "Multilingual Speech",
    title: "Pick voice & languages",
    copy: "Natural voices across English, 22+ Indic languages & 76 global languages powered by Sarvam Bulbul and ElevenLabs.",
  },
  {
    number: "04",
    stepTag: "STEP 04",
    subtitle: "Omnichannel Telephony",
    title: "Deploy on phone & web",
    copy: "Connect virtual phone numbers (DID/SIP), run outbound campaigns, or embed the WebRTC browser widget.",
  },
] as const;

// Original 5 Industries with Original Images
const industries = [
  {
    title: "Banking & Finance",
    tab: "Banking & Finance",
    badge: "Fintech & Lending",
    image: "/images/1.png",
    heading: "Automate EMI reminders, KYC checks & payment assistance",
    desc: "Handle payment collections with respectful native language dialogue, instant payment link dispatch, and zero human agent burnout.",
    metric: "~74% pickup rate with local caller ID",
  },
  {
    title: "Healthcare",
    tab: "Healthcare",
    badge: "Hospitals & Clinics",
    image: "/images/2.png",
    heading: "24/7 clinic appointment booking and triage support",
    desc: "Patients schedule visits, check report availability, and ask pre-consultation questions in their comfortable regional language.",
    metric: "Sub-750ms latency for urgent patient inquiries",
  },
  {
    title: "Hospitality",
    tab: "Hospitality",
    badge: "Hotels & Experiences",
    image: "/images/3.png",
    heading: "Guest concierge, itinerary updates & booking confirmations",
    desc: "Deliver personalized concierge assistance, handle room service requests, and confirm check-in details automatically.",
    metric: "Zero missed calls during peak holiday check-ins",
  },
  {
    title: "Education & EdTech",
    tab: "Education & EdTech",
    badge: "Admissions & Counseling",
    image: "/images/4.png",
    heading: "Instant student inquiry qualification & counselor handoff",
    desc: "Engage prospective students the second they register an inquiry, answering fee details and booking counselor meetings.",
    metric: "3.4x faster speed-to-lead response",
  },
  {
    title: "B2B Goods and Services",
    tab: "B2B Goods & Services",
    badge: "Supply Chain & B2B",
    image: "/images/5.png",
    heading: "Automated vendor follow-ups, order tracking & client management",
    desc: "Coordinate delivery status, dispatch logistics updates, and capture customer satisfaction scores in real time.",
    metric: "10M+ automated minutes handled with 99.9% uptime",
  },
] as const;

// Original Client Logos
const clientLogos = [
  { name: "Deloitte.", isDisplay: true },
  { name: "appsmith_", isMono: true },
  { name: "Vigilant", isDisplay: true },
  { name: "ed.is.on", isItalic: true },
  { name: "Kobe Creations", isDisplay: true },
  { name: "Simplamo®", isDisplay: true },
  { name: "SOULPAGE", isMono: true },
  { name: "Zendesk", isDisplay: true },
  { name: "DigitalBot", isMono: true },
];

// Original AI Insights
const insights = [
  { title: "Understand what your customers are really saying.", meta: "MAY 15, 2026 • FEATURED", tone: "coral", isFeatured: true },
  { title: "Customer Sentiment", meta: "MAY 15, 2026 • 5 MIN READ", tone: "coral" },
  { title: "Conversation Quality", meta: "FEBRUARY 20, 2026 • 8 MIN READ", tone: "blue" },
  { title: "Intent Detection", meta: "JANUARY 16, 2026 • 6 MIN READ", tone: "aqua" },
  { title: "Conversation Trends", meta: "JANUARY 12, 2026 • 4 MIN READ", tone: "peach" },
] as const;

// Original Integrations with Authentic Assets
const integrationPartners = [
  { name: "Google Sheets", cat: "DATA & LEADS", icon: "/images/integrations/google-sheets.svg" },
  { name: "Twilio Telephony", cat: "CARRIER", icon: "/images/integrations/twilio.svg" },
  { name: "Exotel Telephony", cat: "CARRIER", icon: "/images/integrations/exotel.png" },
  { name: "Salesforce CRM", cat: "CRM SYNC", icon: "/images/integrations/salesforce.svg" },
  { name: "Slack", cat: "COLLABORATION", icon: "/images/integrations/slack.svg" },
  { name: "Google Calendar", cat: "SCHEDULING", icon: "/images/integrations/google-calendar.svg" },
  { name: "Gmail", cat: "NOTIFICATION", icon: "/images/integrations/gmail.svg" },
  { name: "Calendly", cat: "SCHEDULING", icon: "/images/integrations/calendly.svg" },
  { name: "WhatsApp Business", cat: "MESSAGING", icon: "/images/integrations/whatsapp.svg" },
  { name: "Sarvam Indic", cat: "SPEECH AI", icon: "/images/integrations/sarvam.png" },
  { name: "ElevenLabs", cat: "VOICES", icon: "/images/integrations/elevenlabs.png" },
  { name: "Webhooks API", cat: "CUSTOM CODE", icon: "/images/integrations/webhooks.svg" },
];

// Original FAQs
const faqs = [
  {
    q: "Can I test Vozon for free?",
    a: "Yes! You can sign up immediately with zero credit card required. We provide complimentary starter minutes and access to test voice agents, custom knowledge base uploads, and web-based audio calling so you can evaluate conversational quality before picking a production tier.",
  },
  {
    q: "How does Vozon achieve natural, ultra-low latency voice conversations?",
    a: "Vozon orchestrates a proprietary high-speed WebRTC streaming pipeline. We combine continuous streaming speech recognition (Sarvam, Deepgram), sub-second LLM reasoning (OpenAI GPT-4o, Google Gemini 2.0 Flash, Sarvam Indic), and neural voice synthesis (ElevenLabs & Sarvam Bulbul) to deliver natural turn-taking with >750ms latency and real-time user interruption handling.",
  },
  {
    q: "Which Indian and global languages and accents are supported?",
    a: "We support English (with US, UK, and Indian accents) as well as 22+ Indian languages including Hindi (हिन्दी), Hinglish, Gujarati, Kannada, Bengali, Marathi, Tamil, Telugu, Malayalam, Punjabi, Odia, and Assamese, plus 76 global languages. Our acoustic models accurately handle colloquial phrasing and code-switching.",
  },
  {
    q: "Can human agents take over a live conversation?",
    a: "Absolutely. You can define intent triggers (e.g., 'speak to an agent' or high customer frustration) that instantly transfer the ongoing call with full context to your human team via SIP transfer or PSTN forward.",
  },
  {
    q: "Can Vozon connect to our existing CRM and Google Sheets?",
    a: "Yes! Vozon natively integrates with Google Sheets, HubSpot, Salesforce, Zoho, and custom REST Webhooks to read lead lists and push call recordings, transcriptions, and structured summaries in real time.",
  },
  {
    q: "How does Vozon prevent 080 spam flags on outbound calls?",
    a: "Unlike rigid US platforms, Vozon provides enterprise local virtual numbers and Bring-Your-Own-Carrier (BYOT) support across Exotel, Airtel, and Tata. With TRAI-compliant calling windows and verified caller identity, pickup rates increase from ~22% to ~74%.",
  },
];

export function HomeDesignFour() {
  // Rotator state
  const [rotatorIdx, setRotatorIdx] = useState(0);
  const rotatingWords = [
    "ambitious founders.",
    "support leaders.",
    "growing enterprises.",
    "BFSI & healthcare teams.",
  ];

  // Active voice & audio preview state
  const [activeVoiceIdx, setActiveVoiceIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // LiveKit WebRTC Voice Call hook
  const voiceCall = useHomepageVoiceCall();
  const selectedVoice = voiceLanguages[activeVoiceIdx];

  // Active Industry filter
  const [activeIndustryIdx, setActiveIndustryIdx] = useState(0);
  const selectedIndustry = industries[activeIndustryIdx];

  // Step 2 model preview state (Platform Architecture - commented out)
  // const [selectedModel, setSelectedModel] = useState<"openai" | "gemini" | "sarvam">("openai");

  // Reviews carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);

  // Mobile menu & scroll state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  // Office Clocks
  const [clocks, setClocks] = useState({
    noida: "15:30",
    bangalore: "15:30",
    london: "10:00",
    newyork: "05:00",
  });

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Rotator timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRotatorIdx((prev) => (prev + 1) % rotatingWords.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [rotatingWords.length]);

  // Office Clocks
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const formatTime = (timeZone: string) => {
        try {
          return new Intl.DateTimeFormat("en-GB", {
            timeZone,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(now);
        } catch {
          return "12:00";
        }
      };
      setClocks({
        noida: formatTime("Asia/Kolkata"),
        bangalore: formatTime("Asia/Kolkata"),
        london: formatTime("Europe/London"),
        newyork: formatTime("America/New_York"),
      });
    };
    updateClocks();
    const clockTimer = setInterval(updateClocks, 10000);
    return () => clearInterval(clockTimer);
  }, []);

  // Customer Reviews auto-scroll
  useEffect(() => {
    if (!isCarouselPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % customerReviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isCarouselPlaying]);

  // Play audio sample
  const playSample = (idx: number) => {
    setActiveVoiceIdx(idx);
    const item = voiceLanguages[idx];
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    const audio = new Audio(item.file);
    audioPlayerRef.current = audio;
    setIsPlayingAudio(true);
    audio.play().catch(() => setIsPlayingAudio(false));
    audio.onended = () => setIsPlayingAudio(false);
  };

  const toggleSample = () => {
    if (isPlayingAudio && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      playSample(activeVoiceIdx);
    }
  };

  const isCallActive = voiceCall.active || voiceCall.busy;

  return (
    <div className="agency-page min-h-screen">
      {/* ========================================================
          SECTION 1: SITE HEADER (Agency Clean Navigation)
          ======================================================== */}
      <header className={`site-header fixed inset-x-0 top-0 z-50 ${headerScrolled ? "is-scrolled" : ""}`}>
        <div className="container-x flex h-20 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-ink" aria-label="Vozon AI home">
            <span className="grid size-8 place-items-center rounded-lg bg-ink text-white font-mono text-sm font-black">
              V
            </span>
            <span>
              Vozon<span className="text-cobalt">.</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.95rem] font-medium text-ink">
              <li><a href="#platform" className="link-u">Voice Demo</a></li>
              <li><a href="#pillars" className="link-u">5 Pillars</a></li>
              <li><a href="#comparison" className="link-u">Comparison</a></li>
              <li><a href="#architecture" className="link-u">Architecture</a></li>
              <li><a href="#agentic-in-action" className="link-u">In Action</a></li>
              <li><a href="#punchlines" className="link-u">Punchlines</a></li>
              <li><a href="#advantage" className="link-u">Indic Engine</a></li>
              <li><a href="#industries" className="link-u">Industries</a></li>
              <li><a href="#integrations" className="link-u">Integrations</a></li>
              <li><Link href="/pricing" className="link-u">Pricing</Link></li>
            </ul>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-[0.95rem] font-medium text-muted hover:text-ink transition-colors">
              Sign in
            </Link>
            <Link href="/contact" className="btn btn-primary">
              <span>Start Free</span>
              <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <button
            type="button"
            className="menu-btn -mr-2 flex size-11 flex-col items-center justify-center gap-[6px] lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-20 bottom-0 overflow-y-auto bg-paper p-6 lg:hidden border-t border-line">
            <nav className="flex flex-col space-y-4">
              <a href="#platform" onClick={() => setMobileMenuOpen(false)} className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-semibold text-ink">
                Voice Demo <span className="eyebrow text-muted">01</span>
              </a>
              <a href="#pillars" onClick={() => setMobileMenuOpen(false)} className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-semibold text-ink">
                5 Pillars <span className="eyebrow text-muted">02</span>
              </a>
              <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-semibold text-ink">
                Comparison <span className="eyebrow text-muted">03</span>
              </a>
              <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-semibold text-ink">
                Architecture <span className="eyebrow text-muted">04</span>
              </a>
              <a href="#agentic-in-action" onClick={() => setMobileMenuOpen(false)} className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-semibold text-ink">
                In Action <span className="eyebrow text-muted">05</span>
              </a>
              <a href="#punchlines" onClick={() => setMobileMenuOpen(false)} className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-semibold text-ink">
                Punchlines <span className="eyebrow text-muted">06</span>
              </a>
              <a href="#advantage" onClick={() => setMobileMenuOpen(false)} className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-semibold text-ink">
                Indic Engine <span className="eyebrow text-muted">07</span>
              </a>
              <a href="#industries" onClick={() => setMobileMenuOpen(false)} className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-semibold text-ink">
                Industries <span className="eyebrow text-muted">08</span>
              </a>
              <a href="#integrations" onClick={() => setMobileMenuOpen(false)} className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-semibold text-ink">
                Integrations <span className="eyebrow text-muted">09</span>
              </a>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-semibold text-ink">
                Pricing <span className="eyebrow text-muted">10</span>
              </Link>

              <div className="pt-6">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary w-full">
                  Deploy an Agent &rarr;
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* ========================================================
            SECTION 2: HERO SECTION (Original Content + Big Type Agency)
            ======================================================== */}
        <section className="container-x pt-32 pb-12 sm:pt-36 md:pb-16">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <p className="eyebrow text-ink">Autonomous Voice AI Platform</p>
            <p className="eyebrow text-muted">&gt;750ms Telephony Latency</p>
            <p className="eyebrow text-muted">22+ Indic &amp; 76 Global Languages</p>
            <p className="eyebrow text-muted">BYOT Virtual Telephony</p>
          </div>

          <h1 className="display-xl mt-6 text-[clamp(1.85rem,3.4vw,3.5rem)] leading-[1.06] text-ink max-w-5xl">
            <span>Beyond Voice Bots:</span><br />
            <span>Autonomous AI Agents That</span><br className="hidden sm:inline" />{" "}
            <span className="text-cobalt">Reason, Act, and Deliver Outcomes.</span>
          </h1>

          <p className="mt-4 font-display text-base sm:text-lg md:text-xl font-bold text-ink max-w-4xl">
            Don&apos;t just automate answers. <span className="text-cobalt">Automate complete business workflows over voice.</span>
          </p>

          <div className="mt-8 grid gap-8 border-t border-line pt-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7 lg:col-span-8">
              <p className="text-sm leading-relaxed text-muted sm:text-base">
                Traditional voice bots follow rigid scripts. Our Agentic Voice Platform deploys autonomous AI agents equipped with cognitive reasoning, dynamic planning, real-time tool execution, and long-term memory—enabling them to handle complex, non-linear human conversations from end to end.
              </p>
              <p className="mt-3 font-display text-sm font-semibold sm:text-base text-ink">
                Trusted voice platform to{" "}
                <span className="text-cobalt">{rotatingWords[rotatorIdx]}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:col-span-5 lg:col-span-4 md:justify-end">
              <Link href="/login" className="btn btn-primary">
                <span>Get Started Free</span>
                <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/contact" className="btn btn-outline">
                <span>Book a Demo</span>
              </Link>
            </div>
          </div>

          {/* Original Trust Bar */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-line pt-8 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-paper-2 font-mono text-xs font-bold text-ink">⚡</span>
              <div>
                <b className="block text-sm font-bold text-ink">&gt;750ms Latency</b>
                <span className="text-xs text-muted">Telephony turn-around</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-paper-2 font-mono text-xs font-bold text-ink">🇮🇳</span>
              <div>
                <b className="block text-sm font-bold text-ink">22+ Indic &amp; 76 Global</b>
                <span className="text-xs text-muted">Native dialects &amp; accents</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-paper-2 font-mono text-xs font-bold text-ink">📊</span>
              <div>
                <b className="block text-sm font-bold text-ink">1-Click Sheets</b>
                <span className="text-xs text-muted">Instant outbound dialer</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-paper-2 font-mono text-xs font-bold text-ink">📞</span>
              <div>
                <b className="block text-sm font-bold text-ink">BYOT Telephony</b>
                <span className="text-xs text-muted">Exotel, Twilio, Tata, Airtel</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: LIVE VOICE CALL & AUDIO DEMO (Original Content)
            ======================================================== */}
        <section id="platform" className="container-x pb-20" aria-label="Featured live demo">
          <div className="case-card rounded-3xl border border-line bg-paper-2 p-8 sm:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
              <div>
                <span className="eyebrow text-cobalt">Live Interactive Session</span>
                <h2 className="font-display text-lg sm:text-xl font-bold text-ink mt-1">
                  Vozon: India&apos;s Complete Enterprise Voice AI Platform
                </h2>
                <p className="mt-1 text-xs sm:text-[13px] text-muted">
                  Build intelligent voice agents, connect your business systems, and automate customer conversations with Vozon.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 font-mono text-xs font-semibold text-ink">
                  <span className={`size-2 rounded-full ${isCallActive ? "bg-emerald-500 animate-ping" : "bg-emerald-500"}`} />
                  {isCallActive ? (voiceCall.active ? "Live Call Connected" : "Dialing...") : "Telemetry: >750ms PSTN"}
                </span>
                <span className="eyebrow text-muted hidden sm:inline">WebRTC &amp; SIP Ready</span>
              </div>
            </div>

            {/* 12 Voice Languages Selector */}
            <div className="mt-6 flex flex-wrap gap-2">
              {voiceLanguages.map((lang, idx) => (
                <button
                  key={lang.label}
                  type="button"
                  onClick={() => {
                    setActiveVoiceIdx(idx);
                    if (isCallActive) {
                      void voiceCall.start(lang.language);
                    } else {
                      playSample(idx);
                    }
                  }}
                  className={`chip ${activeVoiceIdx === idx ? "is-active" : ""}`}
                  aria-pressed={activeVoiceIdx === idx}
                >
                  <span>{lang.label}</span>
                  <span className="count text-xs">{lang.detail}</span>
                </button>
              ))}
            </div>

            {/* Live Audio & Call Stage */}
            <div className="mt-8 rounded-2xl bg-ink text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 w-full md:w-auto">
                {/* Dual Play/Call Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (isCallActive) {
                      voiceCall.disconnect();
                    } else {
                      toggleSample();
                    }
                  }}
                  className="grid size-14 shrink-0 place-items-center rounded-full bg-lime text-ink hover:bg-white transition-all shadow-lg cursor-pointer"
                  aria-label={isCallActive ? "End live call" : isPlayingAudio ? "Pause sample" : "Play voice sample"}
                >
                  {isCallActive ? (
                    <span className="text-xl font-bold">■</span>
                  ) : isPlayingAudio ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm sm:text-base font-bold">
                      Vozon Voice ({selectedVoice.voice})
                    </span>
                    <span className="eyebrow text-lime text-[10px]">SARVAM BULBUL + ELEVENLABS</span>
                  </div>
                  <p className="text-xs text-white/70 mt-0.5">
                    {isCallActive
                      ? (voiceCall.active ? `Live call active • Speaking ${voiceCall.speakingLanguage || selectedVoice.language}` : "Connecting to voice agent...")
                      : isPlayingAudio
                      ? `Playing synthesized ${selectedVoice.label} voice sample...`
                      : "Click play for sample or launch interactive call."}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Live Call vs Sample */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (isCallActive) {
                      voiceCall.disconnect();
                    } else {
                      void voiceCall.start(selectedVoice.language);
                    }
                  }}
                  className={`btn text-xs sm:text-sm py-2 px-4 sm:px-5 ${isCallActive ? "btn-lime" : "btn-ghost-dark border border-white/30"}`}
                >
                  <span>{isCallActive ? "End Live Call" : `Talk to Agent (${selectedVoice.language})`}</span>
                </button>
              </div>
            </div>

            {voiceCall.error && (voiceCall.active || voiceCall.busy) && (
              <p className="mt-3 text-xs text-red-600 font-semibold">{voiceCall.error}</p>
            )}
          </div>
        </section>

        {/* ========================================================
            SECTION 4: INFINITE CAPABILITIES MARQUEE
            ======================================================== */}
        <section className="on-dark mt-10 bg-ink py-4 text-white" aria-label="Voice capabilities marquee">
          <div className="marquee font-display text-xs font-semibold tracking-tight sm:text-sm">
            <div className="marquee__track gap-10 items-center">
              {[1, 2].map((group) => (
                <div key={group} className="flex shrink-0 items-center gap-8">
                  <span>Inbound Customer Support</span>
                  <span className="text-lime text-base">✦</span>
                  <span>Outbound Dialer Campaigns</span>
                  <span className="text-lime text-base">✦</span>
                  <span>Hinglish &amp; 22+ Indic Languages</span>
                  <span className="text-lime text-base">✦</span>
                  <span>76 Global Languages</span>
                  <span className="text-lime text-base">✦</span>
                  <span>&gt;750ms Telephony Latency</span>
                  <span className="text-lime text-base">✦</span>
                  <span>1-Click Google Sheets Outbound</span>
                  <span className="text-lime text-base">✦</span>
                  <span>Smart Virtual Telephony &amp; BYOT</span>
                  <span className="text-lime text-base">✦</span>
                  <span>Real-Time Barge-In</span>
                  <span className="text-lime text-base">✦</span>
                  <span>TRAI Compliant Call Windows</span>
                  <span className="text-lime text-base">✦</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: CLIENT LOGOS / SOCIAL PROOF (Original Logos)
            ======================================================== */}
        <section className="container-x py-16 md:py-20" aria-labelledby="clients-title">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="eyebrow text-muted">Trusted In Production</p>
              <h2 id="clients-title" className="display-lg mt-2 text-xl sm:text-2xl md:text-3xl text-ink">
                In good company.
              </h2>
              <p className="mt-2 max-w-sm text-xs sm:text-sm text-muted">
                From high-growth tech disruptors to national enterprise call operations, over 10M+ automated minutes handled with 99.9% reliability.
              </p>
            </div>
            <ul className="grid grid-cols-2 border-t border-l border-line sm:grid-cols-4 md:col-span-8">
              {clientLogos.map((client, idx) => (
                <li key={idx} className="logo-cell border-line border-b border-r !min-h-[5rem] !py-3">
                  <span className={`text-base sm:text-lg font-bold tracking-tight text-ink ${client.isMono ? "font-mono" : client.isItalic ? "italic" : "font-display"}`}>
                    {client.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ========================================================
            THE 5 PILLARS OF AGENTIC VOICE AI
            ======================================================== */}
        <AgenticPillarsSection />

        {/* ========================================================
            DIRECT ARCHITECTURAL COMPARISON TABLE
            ======================================================== */}
        <ArchitecturalComparisonSection />

        {/* ========================================================
            SECTION 6: THE INDIAN VOICE ADVANTAGE (Original Content)
            ======================================================== */}
        <section id="advantage" className="container-x pb-16 md:pb-24" aria-labelledby="indic-title">
          <div className="case-card rounded-3xl border border-line bg-ink text-white p-8 sm:p-12 overflow-hidden relative">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <span className="eyebrow text-lime">The Indian Voice Advantage</span>
                <h2 id="indic-title" className="display-lg mt-3 text-[clamp(1.5rem,2.6vw,2.5rem)] leading-tight">
                  Why India&apos;s leading teams switch from US tools to <strong>Vozon</strong>
                </h2>
                <p className="mt-3 text-white/80 text-xs sm:text-sm leading-relaxed max-w-xl">
                  Traditional voice tools struggle with Indian accents, 080 spam flags, and rigid telecom rules. Vozon is engineered from day one for Indian telephony and local customer trust.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-6 border-t border-white/20 pt-6">
                  <div>
                    <span className="font-display text-2xl sm:text-3xl font-bold text-lime">22+</span>
                    <span className="block eyebrow text-white/60 text-[11px] mt-1">Indic Languages</span>
                  </div>
                  <div>
                    <span className="font-display text-2xl sm:text-3xl font-bold text-lime">&gt;750ms</span>
                    <span className="block eyebrow text-white/60 text-[11px] mt-1">PSTN Latency</span>
                  </div>
                  <div>
                    <span className="font-display text-2xl sm:text-3xl font-bold text-lime">~74%</span>
                    <span className="block eyebrow text-white/60 text-[11px] mt-1">Verified Pickup</span>
                  </div>
                </div>
              </div>

              {/* 3 Advantage Cards */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
                  <span className="eyebrow text-lime text-[11px]">High Pickup Telephony</span>
                  <h3 className="font-display text-base sm:text-lg font-bold mt-1 text-white">Smart Virtual Telephony &amp; BYOT</h3>
                  <p className="text-white/70 text-xs sm:text-[13px] mt-2">
                    US platforms lock you into rigid 080 trunks that get flagged as spam. Vozon provides enterprise local virtual numbers and Bring-Your-Own-Carrier (BYOT) support across Exotel, Airtel, and Tata.
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs font-mono border-t border-white/10 pt-3 text-white/80">
                    <span>Unverified 080: ~22%</span>
                    <span className="text-lime font-bold">Vozon Smart: ~74%</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
                  <span className="eyebrow text-lime text-[11px]">Native Indic Engine</span>
                  <h3 className="font-display text-base sm:text-lg font-bold mt-1 text-white">Hinglish &amp; 22+ Indic Languages</h3>
                  <p className="text-white/70 text-xs sm:text-[13px] mt-2">
                    Powered by Sarvam Bulbul and Indic-tuned frontier models. Your agents understand colloquial phrasing, native pronunciation, and switch naturally between Hindi and English mid-sentence.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
                    {["हिन्दी", "Hinglish", "मराठी", "தமிழ்", "తెలుగు", "বাংলা"].map((tag) => (
                      <span key={tag} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-lime">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
                  <span className="eyebrow text-lime text-[11px]">Zero Friction</span>
                  <h3 className="font-display text-base sm:text-lg font-bold mt-1 text-white">Sheets to Enterprise MCP</h3>
                  <p className="text-white/70 text-xs sm:text-[13px] mt-2">
                    No developers needed: paste a Google Sheet to launch outbound dialer campaigns in 60 seconds. For engineers, we provide India&apos;s only Model Context Protocol (MCP) server &amp; &gt;750ms WebRTC.
                  </p>
                  <div className="mt-3 text-xs text-white/80 space-y-1 font-mono">
                    <p className="text-lime">✓ Google Sheets auto-sync</p>
                    <p className="text-lime">✓ Bi-directional CRM webhooks</p>
                    <p className="text-lime">✓ TRAI compliant call windows</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 7: CORE PLATFORM ARCHITECTURE (The Three-Layer Agentic Engine)
            ======================================================== */}
        <CorePlatformArchitectureSection />

        {/* ========================================================
            SECTION 8: BY THE NUMBERS / EVERYDAY CALLS (Original Content)
            ======================================================== */}
        <section className="on-dark bg-ink py-16 text-white md:py-20" aria-labelledby="numbers-title">
          <div className="container-x">
            <p className="eyebrow text-lime">Everyday Calls. Extraordinary Outcomes.</p>
            <h2 id="numbers-title" className="display-lg mt-3 text-[clamp(1.5rem,2.6vw,2.5rem)] leading-tight">
              Proven scale across high-volume phone operations.
            </h2>

            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/20 pt-10 md:grid-cols-5">
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-white/60">Daily Volume</span>
                <p className="display-xl mt-2 text-[clamp(1.75rem,2.8vw,2.75rem)] font-bold text-white">1 Lakh+</p>
                <span className="text-xs text-white/60">Calling minutes</span>
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-white/60">Resolution</span>
                <p className="display-xl mt-2 text-[clamp(1.75rem,2.8vw,2.75rem)] font-bold text-white">75%+</p>
                <span className="text-xs text-white/60">First-call resolution</span>
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-white/60">Latency</span>
                <p className="display-xl mt-2 text-[clamp(1.75rem,2.8vw,2.75rem)] font-bold text-white">&gt;750ms</p>
                <span className="text-xs text-white/60">Telephony voice latency</span>
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-white/60">Coverage</span>
                <p className="display-xl mt-2 text-[clamp(1.75rem,2.8vw,2.75rem)] font-bold text-white">22+ &amp; 76</p>
                <span className="text-xs text-white/60">Indic &amp; global languages</span>
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-white/60">Availability</span>
                <p className="display-xl mt-2 text-[clamp(1.75rem,2.8vw,2.75rem)] font-bold text-white">99.9%</p>
                <span className="text-xs text-white/60">Enterprise uptime SLA</span>
              </div>
            </div>

            {/* Platform Banner */}
            <div className="mt-12 rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="eyebrow text-lime">The Vozon Voice AI Agent Platform</span>
                <h3 className="font-display text-lg sm:text-xl font-bold mt-1 text-white">Vozon Voice Agents</h3>
                <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-2xl">
                  From the first hello to the final action, Vozon agents understand conversations, access your systems, and complete workflows in real time.
                </p>
              </div>
              <Link href="/services/voice-agents" className="btn btn-lime shrink-0">
                <span>Explore Voice Agents</span>
                <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            "AGENTIC IN ACTION": REAL-WORLD SCENARIO BREAKDOWN
            ======================================================== */}
        <AgenticInActionSection />

        {/* ========================================================
            PITCH PUNCHLINES TO USE IN MARKETING & ADS
            ======================================================== */}
        <PitchPunchlinesSection />

        {/* ========================================================
            SECTION 9: INDUSTRY SOLUTIONS (ALL 5 ORIGINAL PICTURES & COPY)
            ======================================================== */}
        <section id="industries" className="container-x py-16 md:py-20" aria-labelledby="work-title">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <div>
              <p className="eyebrow text-muted">Industry Solutions</p>
              <h2 id="work-title" className="display-lg mt-3 text-[clamp(1.5rem,2.6vw,2.5rem)] leading-tight text-ink">
                Built for businesses that run<br />on conversations.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/contact" className="btn btn-primary">
                <span>Talk to Sales</span>
              </Link>
              <Link href="/contact" className="btn btn-outline">
                <span>Request A Demo</span>
              </Link>
            </div>
          </div>

          {/* Industry Tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {industries.map((ind, idx) => (
              <button
                key={ind.title}
                type="button"
                onClick={() => setActiveIndustryIdx(idx)}
                className={`chip ${activeIndustryIdx === idx ? "is-active" : ""}`}
                aria-pressed={activeIndustryIdx === idx}
              >
                <span>{ind.tab}</span>
              </button>
            ))}
          </div>

          {/* Featured Industry Case Card using Original Image */}
          <div className="mt-8 case-card rounded-3xl border border-line bg-paper overflow-hidden">
            <div className="grid lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:h-[450px] w-full bg-paper-2 overflow-hidden border-b lg:border-b-0 lg:border-r border-line">
                <Image
                  src={selectedIndustry.image}
                  alt={`${selectedIndustry.title} business solutions`}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <span className="absolute top-4 left-4 rounded-full bg-ink/80 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white">
                  {selectedIndustry.badge}
                </span>
              </div>
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <span className="eyebrow text-cobalt">{selectedIndustry.tab}</span>
                  <h3 className="display-lg text-xl sm:text-2xl font-bold text-ink mt-1.5">
                    {selectedIndustry.heading}
                  </h3>
                  <p className="mt-3 text-muted leading-relaxed text-xs sm:text-sm">
                    {selectedIndustry.desc}
                  </p>
                </div>
                <div className="mt-6 border-t border-line pt-6">
                  <span className="font-mono text-xs text-muted block">METRIC HIGHLIGHT</span>
                  <b className="font-display text-base text-ink font-semibold mt-1 block">
                    {selectedIndustry.metric}
                  </b>
                  <div className="mt-4">
                    <Link href="/contact" className="btn btn-outline text-xs py-2 px-4">
                      <span>Deploy for {selectedIndustry.title}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All 5 Industries Grid with Original Pictures */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, idx) => (
              <article
                key={ind.title}
                onClick={() => setActiveIndustryIdx(idx)}
                className={`case-card group cursor-pointer overflow-hidden rounded-2xl border bg-paper transition-all ${activeIndustryIdx === idx ? "border-cobalt ring-2 ring-cobalt/20" : "border-line"}`}
              >
                <div className="case-media relative aspect-[16/10] overflow-hidden bg-paper-2">
                  <Image
                    src={ind.image}
                    alt={ind.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-ink/80 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    {ind.badge}
                  </span>
                </div>
                <div className="p-6">
                  <span className="eyebrow text-muted text-[11px]">{ind.tab}</span>
                  <h4 className="font-display text-base sm:text-lg font-bold text-ink mt-1 group-hover:text-cobalt transition-colors">
                    {ind.title}
                  </h4>
                  <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
                    {ind.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 10: VOICE OPERATIONS SHOWCASE (Original Component)
            ======================================================== */}
        <div id="showcase-section" className="container-x pb-24">
          <VoiceOperationsShowcase />
        </div>

        {/* ========================================================
            SECTION 11: AI INSIGHTS (Original Content)
            ======================================================== */}
        <section id="insights" className="container-x pb-16 md:pb-20" aria-labelledby="insights-title">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <div>
              <p className="eyebrow text-muted">Knowledge &amp; Research</p>
              <h2 id="insights-title" className="display-lg mt-3 text-[clamp(1.5rem,2.6vw,2.5rem)] leading-tight text-ink">
                AI Insights
              </h2>
            </div>
            <Link href="/resources/blog" className="btn btn-outline">
              <span>View More Articles</span>
            </Link>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <Link href="/resources/blog" className="case-card group lg:col-span-7 rounded-3xl border border-line bg-paper-2 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <span className="eyebrow text-cobalt">FEATURED REPORT • MAY 15, 2026</span>
                <h3 className="display-lg mt-3 text-xl sm:text-2xl font-bold text-ink group-hover:text-cobalt transition-colors">
                  Understand what your customers are really saying.
                </h3>
                <p className="mt-3 text-muted text-xs sm:text-sm leading-relaxed">
                  How acoustic sentiment extraction, tone recognition, and real-time semantic analysis reveal customer intent before the call ends.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
                <span className="font-mono text-xs text-muted">RESEARCH WHITE PAPER</span>
                <span className="case-arrow grid size-9 place-items-center rounded-full border border-ink text-ink transition">
                  ↗
                </span>
              </div>
            </Link>

            <div className="lg:col-span-5 flex flex-col gap-4">
              {insights.slice(1).map((item) => (
                <Link
                  key={item.title}
                  href="/resources/blog"
                  className="group rounded-2xl border border-line bg-paper p-5 sm:p-6 hover:bg-paper-2 transition flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="eyebrow text-muted text-[10px]">{item.meta}</span>
                    <h4 className="font-display text-sm sm:text-base font-bold text-ink mt-1 group-hover:text-cobalt transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <span className="grid size-8 place-items-center rounded-full border border-line text-ink transition group-hover:bg-ink group-hover:text-white shrink-0">
                    ↗
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 12: SCALE WITH SECURITY & COMPLIANCE (Original Content)
            ======================================================== */}
        <section className="container-x pb-16 md:pb-20" aria-labelledby="security-title">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <div>
              <p className="eyebrow text-muted">Enterprise Assurance</p>
              <h2 id="security-title" className="display-lg mt-3 text-[clamp(1.5rem,2.6vw,2.5rem)] leading-tight text-ink">
                Scale with security.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/contact" className="btn btn-primary">
                <span>Talk to Sales</span>
              </Link>
              <Link href="/resources/trust-center" className="btn btn-outline">
                <span>View Security</span>
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="case-card rounded-2xl border border-line bg-paper p-6 sm:p-8">
              <span className="eyebrow text-muted">Information Security</span>
              <p className="font-display text-xl sm:text-2xl font-bold text-ink mt-2">ISO 27001</p>
              <span className="text-[11px] text-muted block mt-1">Information Security Management</span>
              <p className="text-xs sm:text-[13px] text-muted mt-3">Enterprise access control, audit logging, and risk management compliance.</p>
            </div>
            <div className="case-card rounded-2xl border border-line bg-paper p-6 sm:p-8">
              <span className="eyebrow text-muted">Healthcare Privacy</span>
              <p className="font-display text-xl sm:text-2xl font-bold text-ink mt-2">HIPAA</p>
              <span className="text-[11px] text-muted block mt-1">Compliance &amp; BAA Available</span>
              <p className="text-xs sm:text-[13px] text-muted mt-3">Protected Health Information (PHI) safeguards and confidential patient workflows.</p>
            </div>
            <div className="case-card rounded-2xl border border-line bg-paper p-6 sm:p-8">
              <span className="eyebrow text-muted">Global Privacy</span>
              <p className="font-display text-xl sm:text-2xl font-bold text-ink mt-2">GDPR &amp; DPDP</p>
              <span className="text-[11px] text-muted block mt-1">European Union &amp; India</span>
              <p className="text-xs sm:text-[13px] text-muted mt-3">Right to be forgotten, data minimization, and localized Indian database hosting.</p>
            </div>
            <div className="case-card rounded-2xl border border-line bg-paper p-6 sm:p-8">
              <span className="eyebrow text-muted">AICPA Assurance</span>
              <p className="font-display text-xl sm:text-2xl font-bold text-ink mt-2">SOC 2 Type II</p>
              <span className="text-[11px] text-muted block mt-1">Audited &amp; Certified</span>
              <p className="text-xs sm:text-[13px] text-muted mt-3">Rigorous continuous penetration testing, SOC-2 compliance, and zero public model training.</p>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 13: CUSTOMER STORIES / FLOATING REVIEWS (White Theme)
            ======================================================== */}
        <FloatingReviewsSection />

        {/* ========================================================
            SECTION 14: INTEGRATIONS (ORIGINAL IMAGES & LOGOS)
            ======================================================== */}
        <section id="integrations" className="container-x py-16 md:py-20" aria-labelledby="integrations-title">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <div>
              <p className="eyebrow text-muted">Ecosystem</p>
              <h2 id="integrations-title" className="display-lg mt-3 text-[clamp(1.5rem,2.6vw,2.5rem)] leading-tight text-ink">
                Don&apos;t replace.<br /><strong>Integrate.</strong>
              </h2>
            </div>
            <Link href="/integrations" className="btn btn-outline">
              <span>Explore All Integrations &rarr;</span>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {integrationPartners.map((item) => (
              <div
                key={item.name}
                className="case-card flex flex-col justify-between rounded-2xl border border-line bg-paper p-5 transition hover:border-ink hover:bg-paper-2"
              >
                <div className="relative size-12 mb-4">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <b className="block text-sm font-bold text-ink">{item.name}</b>
                  <span className="eyebrow text-muted text-[10px] block mt-0.5">{item.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 15: FAQ ACCORDION (Original Questions & Answers)
            ======================================================== */}
        <section id="faq" className="bg-paper-2 py-16 md:py-20" aria-labelledby="faq-title">
          <div className="container-x">
            <div>
              <p className="eyebrow text-muted">Got Questions?</p>
              <h2 id="faq-title" className="display-lg mt-3 text-[clamp(1.5rem,2.6vw,2.5rem)] leading-tight text-ink">
                Everything you need to know.
              </h2>
            </div>

            <div className="mt-12 divide-y divide-line border-y border-line max-w-4xl">
              {faqs.map((faq, idx) => (
                <details key={idx} className="role group py-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
                    <span className="font-display text-base sm:text-lg font-semibold text-ink group-hover:text-cobalt transition-colors">
                      {faq.q}
                    </span>
                    <span className="plus grid size-8 shrink-0 place-items-center rounded-full border border-line text-base font-mono">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-muted leading-relaxed text-xs sm:text-sm pr-6">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 16: SITE FOOTER (All Original Content + Agency Aesthetic)
            ======================================================== */}
        <footer className="on-dark bg-ink text-white">
          <div className="container-x pt-24 pb-12 sm:pt-28">
            {/* Pre-Footer CTA Banner (Original Content) */}
            <div className="grid gap-10 border-b border-white/15 pb-14 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <p className="eyebrow text-lime">Ready to modernize your phone lines?</p>
                <h2 className="display-lg mt-3 text-[clamp(1.75rem,3.2vw,3rem)] leading-tight text-white">
                  Build your AI voice agent.
                </h2>
                <p className="mt-3 text-white/70 text-xs sm:text-sm max-w-xl leading-relaxed">
                  Building intelligent voice experiences that help businesses create better conversations, automate meaningful work, and connect people with outcomes.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 lg:items-end">
                <a href="mailto:hello@vozon.ai" className="link-u font-display text-lg sm:text-xl font-semibold text-white">
                  hello@vozon.ai
                </a>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/dashboard" className="btn btn-lime">
                    <span>Try for Free</span>
                    <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <Link href="/contact" className="btn btn-ghost-dark border border-white/30 text-white hover:bg-white hover:text-ink">
                    <span>Get a Demo</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer Navigation Columns (All Original Product, Resources, Company & Contact Links) */}
            <div className="mt-14 grid gap-10 border-b border-white/15 pb-16 sm:grid-cols-2 lg:grid-cols-5">
              {/* Column 1: Brand & Socials */}
              <div className="lg:col-span-1">
                <span className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight">
                  <span className="grid size-7 place-items-center rounded-md bg-lime text-ink font-mono text-xs font-black">
                    V
                  </span>
                  Vozon<span className="text-lime">.</span>
                </span>
                <p className="mt-4 text-xs leading-relaxed text-white/70">
                  Building intelligent voice experiences that help businesses create better conversations, automate meaningful work, and connect people with outcomes.
                </p>

                {/* Social links */}
                <div className="mt-6 flex items-center gap-3">
                  <a
                    aria-label="Twitter / X"
                    href="https://x.com/vozonai_"
                    rel="noreferrer"
                    target="_blank"
                    className="grid size-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-lime hover:text-lime"
                  >
                    <span className="font-bold text-xs">X</span>
                  </a>
                  <a
                    aria-label="LinkedIn"
                    href="https://linkedin.com/company/vozon-ai-india/"
                    rel="noreferrer"
                    target="_blank"
                    className="grid size-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-lime hover:text-lime"
                  >
                    <span className="font-bold text-xs">in</span>
                  </a>
                  <a
                    aria-label="Instagram"
                    href="https://www.instagram.com/vozonai"
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-lime hover:text-lime"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="2" />
                      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
                    </svg>
                  </a>
                  <a
                    aria-label="Call +91 78925 18414"
                    href="tel:+917892518414"
                    className="grid size-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-lime hover:text-lime"
                  >
                    <span className="text-sm">☎</span>
                  </a>
                  <a
                    aria-label="Email hello@vozon.ai"
                    href="mailto:hello@vozon.ai"
                    className="grid size-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-lime hover:text-lime"
                  >
                    <span className="text-sm">✉</span>
                  </a>
                </div>
              </div>

              {/* Column 2: Product (All 9 Original Links) */}
              <div>
                <span className="eyebrow text-lime">Product</span>
                <ul className="mt-4 space-y-1.5 text-xs sm:text-[13px] text-white/80">
                  <li><Link href="/services/voice-agents" className="link-u">Voice Agents</Link></li>
                  <li><Link href="/services/voice-cloning" className="link-u">Voice Cloning</Link></li>
                  <li><Link href="/services/realtime-tts" className="link-u">Realtime TTS</Link></li>
                  <li><Link href="/services/api-access" className="link-u">API Access</Link></li>
                  <li><Link href="/services/team-workflows" className="link-u">Team Workflows</Link></li>
                  <li><Link href="/services/speech-analytics" className="link-u">Speech Analytics</Link></li>
                  <li><Link href="/services/quality-controls" className="link-u">Quality Controls</Link></li>
                  <li><Link href="/services/multilingual-speech" className="link-u">Multilingual Speech</Link></li>
                  <li><Link href="/services/conversation-insights" className="link-u">Conversation Insights</Link></li>
                </ul>
              </div>

              {/* Column 3: Resources (All 8 Original Links) */}
              <div>
                <span className="eyebrow text-lime">Resources</span>
                <ul className="mt-4 space-y-1.5 text-xs sm:text-[13px] text-white/80">
                  <li><Link href="/#faq" className="link-u">FAQ</Link></li>
                  <li><Link href="/resources/blog" className="link-u">Blog</Link></li>
                  <li><Link href="/about" className="link-u">About us</Link></li>
                  <li><Link href="/resources/help-center" className="link-u">Support</Link></li>
                  <li><Link href="/docs/api" className="link-u">Download</Link></li>
                  <li><Link href="/terms" className="link-u">Terms &amp; Conditions</Link></li>
                  <li><Link href="/privacy" className="link-u">Privacy policy</Link></li>
                  <li><Link href="/partners" className="link-u">Affiliate program</Link></li>
                </ul>
              </div>

              {/* Column 4: Company & Solutions */}
              <div>
                <span className="eyebrow text-lime">Company</span>
                <ul className="mt-4 space-y-1.5 text-xs sm:text-[13px] text-white/80">
                  <li><Link href="/career" className="link-u">We&apos;re hiring</Link></li>
                  <li><Link href="/pricing" className="link-u">Pricing</Link></li>
                  <li><Link href="/resources/changelog" className="link-u">Changelog</Link></li>
                  <li><Link href="/contact" className="link-u">Contact us</Link></li>
                </ul>

                <span className="eyebrow text-lime block mt-6">Solutions</span>
                <ul className="mt-3 space-y-1.5 text-xs sm:text-[13px] text-white/80">
                  <li><Link href="/solutions/banking" className="link-u">Banking &amp; Collections</Link></li>
                  <li><Link href="/solutions/healthcare" className="link-u">Healthcare Intake</Link></li>
                  <li><Link href="/solutions/hospitality" className="link-u">Hospitality Concierge</Link></li>
                  <li><Link href="/solutions/education" className="link-u">EdTech Qualification</Link></li>
                  <li><Link href="/solutions/b2b" className="link-u">B2B Logistics</Link></li>
                </ul>
              </div>

              {/* Column 5: Contact US & Global Offices */}
              <div>
                <span className="eyebrow text-lime">Contact US</span>
                <ul className="mt-4 space-y-1.5 text-xs sm:text-[13px] text-white/80">
                  <li><a href="mailto:hello@vozon.ai" className="link-u">hello@vozon.ai</a></li>
                  <li><a href="tel:+917892518414" className="link-u">+91 78925 18414</a></li>
                  <li><Link href="/contact#office-locations" className="link-u">Our Office Locations</Link></li>
                  <li><Link href="/contact" className="link-u font-semibold text-lime">Book a free demo &rarr;</Link></li>
                </ul>

                <span className="eyebrow text-lime block mt-6">Global Offices</span>
                <div className="mt-3 space-y-2 font-mono text-xs text-white/80">
                  <div>
                    <div className="flex items-center justify-between">
                      <b className="text-white">Noida (HQ)</b>
                      <span className="text-lime">{clocks.noida}</span>
                    </div>
                    <span className="text-[11px] text-white/50">A-135, Sector 63, UP</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <b className="text-white">Bangalore</b>
                      <span className="text-lime">{clocks.bangalore}</span>
                    </div>
                    <span className="text-[11px] text-white/50">HSR Layout, Karnataka</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <b className="text-white">London</b>
                      <span className="text-lime">{clocks.london}</span>
                    </div>
                    <span className="text-[11px] text-white/50">EC2A 4NE, UK</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <b className="text-white">New York</b>
                      <span className="text-lime">{clocks.newyork}</span>
                    </div>
                    <span className="text-[11px] text-white/50">Madison Ave, NY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Tags Ribbon (All 20+ Original Tags Preserved) */}
            <div className="border-b border-white/15 py-8">
              <span className="eyebrow text-white/40 block mb-4">Focus Areas &amp; Capabilities</span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: "Media", icon: "◆" },
                  { label: "Freelancing", icon: "⚡" },
                  { label: "Podcast", icon: "▥" },
                  { label: "Investing", icon: "$" },
                  { label: "Partnership", icon: "◈" },
                  { label: "Deal", icon: "$" },
                  { label: "Agencies", icon: "▦" },
                  { label: "Contractors", icon: "▦" },
                  { label: "VCs", icon: "▰" },
                  { label: "Sales", icon: "◆" },
                  { label: "Real Estate", icon: "▥" },
                  { label: "Recruiting", icon: "▣" },
                  { label: "Fundraisings", icon: "◈" },
                  { label: "Consulting", icon: "▥" },
                  { label: "CRM", icon: "▦" },
                  { label: "Leads", icon: "≋" },
                  { label: "Voice AI", icon: "AI" },
                  { label: "Automation", icon: "+" },
                  { label: "Customer Support", icon: "*" },
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-white/80 hover:border-lime hover:text-white transition-colors"
                  >
                    <i className="not-italic text-lime font-bold">{tag.icon}</i>
                    <span>{tag.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 font-mono text-xs text-white/50 sm:flex-row">
              <p>&copy; {new Date().getFullYear()} Vozon AI Inc. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/resources/trust-center" className="hover:text-white transition-colors">Trust Center</Link>
                <a href="#main" className="hover:text-lime transition-colors">Back to top &uarr;</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
