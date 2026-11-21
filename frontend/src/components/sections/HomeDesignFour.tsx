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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* ========================================================
          SECTION 1: SITE HEADER (Modern Executive SaaS Glassmorphism)
          ======================================================== */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between gap-4">
          <Link href="/" className="shrink-0 flex items-center gap-2.5 group" aria-label="Vozon AI home">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-mono text-sm font-black shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              V
            </span>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Vozon<span className="text-blue-600">.</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:flex items-center gap-1 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
            <a href="#platform" className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all whitespace-nowrap">Voice Demo</a>
            <a href="#pillars" className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all whitespace-nowrap">5 Pillars</a>
            <a href="#comparison" className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all whitespace-nowrap">Comparison</a>
            <a href="#architecture" className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all whitespace-nowrap">Architecture</a>
            <a href="#agentic-in-action" className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all whitespace-nowrap">In Action</a>
            <a href="#advantage" className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all whitespace-nowrap">Indic Engine</a>
            <a href="#industries" className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all whitespace-nowrap">Industries</a>
            <a href="#integrations" className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all whitespace-nowrap">Integrations</a>
            <Link href="/pricing" className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all whitespace-nowrap">Pricing</Link>
          </nav>

          <div className="shrink-0 hidden lg:flex items-center gap-3 whitespace-nowrap">
            <Link href="/login" className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap">
              Sign in
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all whitespace-nowrap">
              <span>Start Free</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <button
            type="button"
            className="flex size-10 flex-col items-center justify-center gap-1.5 lg:hidden rounded-xl bg-white border border-slate-200 shadow-xs"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className={`block w-5 h-0.5 bg-slate-800 transition-all ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block w-5 h-0.5 bg-slate-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-slate-800 transition-all ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-20 bottom-0 overflow-y-auto bg-white/95 backdrop-blur-2xl p-6 lg:hidden border-t border-slate-200 shadow-xl">
            <nav className="flex flex-col space-y-3">
              <a href="#platform" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-3 text-lg font-bold text-slate-800">
                <span>Voice Demo</span> <span className="font-mono text-xs text-blue-600 font-bold">01</span>
              </a>
              <a href="#pillars" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-3 text-lg font-bold text-slate-800">
                <span>5 Pillars</span> <span className="font-mono text-xs text-blue-600 font-bold">02</span>
              </a>
              <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-3 text-lg font-bold text-slate-800">
                <span>Comparison</span> <span className="font-mono text-xs text-blue-600 font-bold">03</span>
              </a>
              <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-3 text-lg font-bold text-slate-800">
                <span>Architecture</span> <span className="font-mono text-xs text-blue-600 font-bold">04</span>
              </a>
              <a href="#agentic-in-action" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-3 text-lg font-bold text-slate-800">
                <span>In Action</span> <span className="font-mono text-xs text-blue-600 font-bold">05</span>
              </a>
              <a href="#advantage" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-3 text-lg font-bold text-slate-800">
                <span>Indic Engine</span> <span className="font-mono text-xs text-blue-600 font-bold">06</span>
              </a>
              <a href="#industries" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-3 text-lg font-bold text-slate-800">
                <span>Industries</span> <span className="font-mono text-xs text-blue-600 font-bold">07</span>
              </a>
              <a href="#integrations" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-3 text-lg font-bold text-slate-800">
                <span>Integrations</span> <span className="font-mono text-xs text-blue-600 font-bold">08</span>
              </a>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-3 text-lg font-bold text-slate-800">
                <span>Pricing</span> <span className="font-mono text-xs text-blue-600 font-bold">09</span>
              </Link>

              <div className="pt-4 space-y-2">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md">
                  Deploy an Agent &rarr;
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm">
                  Sign in
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* ========================================================
            SECTION 2: HERO SECTION (Modern Executive SaaS)
            ======================================================== */}
        <section className="relative pt-32 pb-16 sm:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white">
          {/* Ambient Radial Highlight */}
          <div
            className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[550px] w-[1000px] rounded-full blur-[140px] opacity-35"
            style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(37, 99, 235, 0.22) 0%, rgba(99, 102, 241, 0.12) 50%, transparent 70%)" }}
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Live Telemetry Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/90 bg-white px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-xs">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Autonomous Voice AI Platform</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-xs text-slate-700 shadow-xs">
                <span className="text-amber-500 font-bold">⚡</span>
                <span>&gt;750ms Telephony Latency</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-xs text-slate-700 shadow-xs">
                <span>🇮🇳</span>
                <span>22+ Indic &amp; 76 Global Languages</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-xs text-slate-700 shadow-xs">
                <span className="text-blue-500">📞</span>
                <span>BYOT Virtual Telephony</span>
              </span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="mt-8 text-4xl sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-slate-900 max-w-5xl leading-[1.06]">
              <span>Beyond Voice Bots:</span><br />
              <span>Autonomous AI Agents That</span><br className="hidden sm:inline" />{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">Reason, Act, and Deliver Outcomes.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl font-bold text-slate-800 max-w-4xl">
              Don&apos;t just automate answers. <span className="text-blue-600 font-bold">Automate complete business workflows over voice.</span>
            </p>

            <div className="mt-8 grid gap-8 border-t border-slate-200 pt-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7 lg:col-span-8">
                <p className="text-base leading-relaxed text-slate-600 sm:text-[17px]">
                  Traditional voice bots follow rigid scripts. Our Agentic Voice Platform deploys autonomous AI agents equipped with cognitive reasoning, dynamic planning, real-time tool execution, and long-term memory—enabling them to handle complex, non-linear human conversations from end to end.
                </p>
                <p className="mt-4 text-base font-semibold sm:text-lg text-slate-900">
                  Trusted voice platform to{" "}
                  <span className="text-blue-600 font-bold underline decoration-blue-300 underline-offset-4">{rotatingWords[rotatorIdx]}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 md:col-span-5 lg:col-span-4 md:justify-end">
                <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all">
                  <span>Get Started Free</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-all">
                  <span>Book a Demo</span>
                </Link>
              </div>
            </div>

          {/* Original Trust Bar */}
          <div className="mt-14 grid grid-cols-2 gap-4 border-t border-slate-200/80 pt-10 sm:grid-cols-4">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
              <span className="grid size-12 place-items-center rounded-xl bg-amber-50 font-mono text-lg font-bold text-amber-600 shadow-xs">⚡</span>
              <div>
                <b className="block text-base font-bold text-slate-900">&gt;750ms Latency</b>
                <span className="text-xs text-slate-500">Telephony turnaround</span>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
              <span className="grid size-12 place-items-center rounded-xl bg-emerald-50 font-mono text-lg font-bold text-emerald-600 shadow-xs">🇮🇳</span>
              <div>
                <b className="block text-base font-bold text-slate-900">22+ Indic &amp; 76 Global</b>
                <span className="text-xs text-slate-500">Native dialects &amp; accents</span>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
              <span className="grid size-12 place-items-center rounded-xl bg-blue-50 font-mono text-lg font-bold text-blue-600 shadow-xs">📊</span>
              <div>
                <b className="block text-base font-bold text-slate-900">1-Click Sheets</b>
                <span className="text-xs text-slate-500">Instant outbound dialer</span>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
              <span className="grid size-12 place-items-center rounded-xl bg-indigo-50 font-mono text-lg font-bold text-indigo-600 shadow-xs">📞</span>
              <div>
                <b className="block text-base font-bold text-slate-900">BYOT Telephony</b>
                <span className="text-xs text-slate-500">Exotel, Twilio, Tata, Airtel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* ========================================================
            SECTION 3: LIVE VOICE CALL & AUDIO DEMO (Modern Playground)
            ======================================================== */}
        <section id="platform" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-label="Featured live demo">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-12 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
                  Live Interactive Session
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Vozon: India&apos;s Complete Enterprise Voice AI Platform
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Build intelligent voice agents, connect your business systems, and automate customer conversations with Vozon.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 font-mono text-xs font-semibold text-slate-800 shadow-xs">
                  <span className={`size-2 rounded-full ${isCallActive ? "bg-emerald-500 animate-ping" : "bg-emerald-500"}`} />
                  {isCallActive ? (voiceCall.active ? "Live Call Connected" : "Dialing...") : "Telemetry: >750ms PSTN"}
                </span>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline uppercase font-semibold">WebRTC &amp; SIP Ready</span>
              </div>
            </div>

            {/* 12 Voice Languages Selector */}
            <div className="mt-7">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Select Language &amp; Accent Preview:
              </div>
              <div className="flex flex-wrap gap-2.5">
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeVoiceIdx === idx
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                        : "bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                    aria-pressed={activeVoiceIdx === idx}
                  >
                    <span>{lang.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      activeVoiceIdx === idx ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {lang.detail}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Audio & Call Stage */}
            <div className="mt-8 rounded-2xl bg-[#090d16] border border-slate-800 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
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
                  className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white hover:from-emerald-300 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/30 cursor-pointer"
                  aria-label={isCallActive ? "End live call" : isPlayingAudio ? "Pause sample" : "Play voice sample"}
                >
                  {isCallActive ? (
                    <span className="text-xl font-bold">■</span>
                  ) : isPlayingAudio ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="translate-x-0.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-white">
                      Vozon Voice ({selectedVoice.voice})
                    </span>
                    <span className="text-[10px] tracking-wider font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                      SARVAM BULBUL + ELEVENLABS
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    {isCallActive
                      ? (voiceCall.active ? `Live call active • Speaking ${voiceCall.speakingLanguage || selectedVoice.language}` : "Connecting to voice agent...")
                      : isPlayingAudio
                      ? `Playing synthesized ${selectedVoice.label} voice sample...`
                      : "Click play for sample or launch interactive call."}
                  </p>
                  {(isPlayingAudio || isCallActive) && (
                    <div className="flex items-end gap-1 mt-3 h-5">
                      {[40, 75, 100, 60, 30, 85, 95, 50, 70, 90, 45, 65, 80, 55, 35, 75, 90, 65].map((h, i) => (
                        <span
                          key={i}
                          className="w-1 rounded-full bg-emerald-400 transition-all duration-150 animate-pulse"
                          style={{ height: `${h * 0.2}px`, animationDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>
                  )}
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
                  className={`px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer ${
                    isCallActive
                      ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/25"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25"
                  }`}
                >
                  <span>{isCallActive ? "End Live Call" : `Talk to Agent (${selectedVoice.language})`}</span>
                </button>
              </div>
            </div>

            {voiceCall.error && (voiceCall.active || voiceCall.busy) && (
              <p className="mt-3 text-xs text-rose-600 font-semibold">{voiceCall.error}</p>
            )}
          </div>
        </section>

        {/* ========================================================
            SECTION 4: INFINITE CAPABILITIES MARQUEE
            ======================================================== */}
        <section className="mt-6 bg-[#090d16] border-y border-slate-800/80 py-4 text-white" aria-label="Voice capabilities marquee">
          <div className="marquee text-xs font-semibold tracking-tight sm:text-sm">
            <div className="marquee__track gap-10 items-center">
              {[1, 2].map((group) => (
                <div key={group} className="flex shrink-0 items-center gap-8">
                  <span>Inbound Customer Support</span>
                  <span className="text-emerald-400 text-base">✦</span>
                  <span>Outbound Dialer Campaigns</span>
                  <span className="text-emerald-400 text-base">✦</span>
                  <span>Hinglish &amp; 22+ Indic Languages</span>
                  <span className="text-emerald-400 text-base">✦</span>
                  <span>76 Global Languages</span>
                  <span className="text-emerald-400 text-base">✦</span>
                  <span>&gt;750ms Telephony Latency</span>
                  <span className="text-emerald-400 text-base">✦</span>
                  <span>1-Click Google Sheets Outbound</span>
                  <span className="text-emerald-400 text-base">✦</span>
                  <span>Smart Virtual Telephony &amp; BYOT</span>
                  <span className="text-emerald-400 text-base">✦</span>
                  <span>Real-Time Barge-In</span>
                  <span className="text-emerald-400 text-base">✦</span>
                  <span>TRAI Compliant Call Windows</span>
                  <span className="text-emerald-400 text-base">✦</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: CLIENT LOGOS / SOCIAL PROOF (Original Logos)
            ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20" aria-labelledby="clients-title">
          <div className="grid gap-8 md:grid-cols-12 items-center">
            <div className="md:col-span-4">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-blue-600" />
                Trusted In Production
              </span>
              <h2 id="clients-title" className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                In good company.
              </h2>
              <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
                From high-growth tech disruptors to national enterprise call operations, over 10M+ automated minutes handled with 99.9% reliability.
              </p>
            </div>
            <ul className="grid grid-cols-2 border border-slate-200 sm:grid-cols-4 md:col-span-8 rounded-2xl overflow-hidden bg-white shadow-xs divide-x divide-y divide-slate-200">
              {clientLogos.map((client, idx) => (
                <li key={idx} className="grid place-items-center min-h-[5.5rem] py-3 bg-white hover:bg-slate-50 transition-colors">
                  <span className={`text-base sm:text-lg font-bold tracking-tight text-slate-600 hover:text-slate-900 transition-colors ${client.isMono ? "font-mono" : client.isItalic ? "italic" : ""}`}>
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
            CORE PLATFORM ARCHITECTURE (The Three-Layer Agentic Engine)
            ======================================================== */}
        <CorePlatformArchitectureSection />

        {/* ========================================================
            "AGENTIC IN ACTION": REAL-WORLD SCENARIO BREAKDOWN
            ======================================================== */}
        <AgenticInActionSection />

        {/* ========================================================
            THE INDIAN VOICE ADVANTAGE (Original Content)
            ======================================================== */}
        <section id="advantage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" aria-labelledby="indic-title">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#090d16] via-[#0f172a] to-[#090d16] text-white p-8 sm:p-14 overflow-hidden relative shadow-2xl">
            {/* Ambient decorative glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 size-96 rounded-full bg-emerald-500/15 blur-3xl" />

            <div className="grid gap-10 lg:grid-cols-12 lg:items-center relative z-10">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  The Indian Voice Advantage
                </span>
                <h2 id="indic-title" className="mt-3 text-3xl sm:text-4xl lg:text-5xl leading-tight text-white font-extrabold tracking-tight">
                  Why India&apos;s leading teams switch from US tools to <strong className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">Vozon</strong>
                </h2>
                <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                  Traditional voice tools struggle with Indian accents, 080 spam flags, and rigid telecom rules. Vozon is engineered from day one for Indian telephony and local customer trust.
                </p>

                <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                  <div>
                    <span className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">22+</span>
                    <span className="block text-slate-400 text-xs mt-1.5 font-mono uppercase tracking-wider font-semibold">Indic Languages</span>
                  </div>
                  <div>
                    <span className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">&gt;750ms</span>
                    <span className="block text-slate-400 text-xs mt-1.5 font-mono uppercase tracking-wider font-semibold">PSTN Latency</span>
                  </div>
                  <div>
                    <span className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">~74%</span>
                    <span className="block text-slate-400 text-xs mt-1.5 font-mono uppercase tracking-wider font-semibold">Verified Pickup</span>
                  </div>
                </div>
              </div>

              {/* 3 Advantage Cards */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md hover:bg-white/[0.08] hover:border-white/20 transition-all shadow-md">
                  <span className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">High Pickup Telephony</span>
                  <h3 className="text-base sm:text-lg font-bold mt-1.5 text-white">Smart Virtual Telephony &amp; BYOT</h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    US platforms lock you into rigid 080 trunks that get flagged as spam. Vozon provides enterprise local virtual numbers and Bring-Your-Own-Carrier (BYOT) support across Exotel, Airtel, and Tata.
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs font-mono border-t border-white/10 pt-3 text-slate-300">
                    <span>Unverified 080: ~22%</span>
                    <span className="text-emerald-400 font-bold">Vozon Smart: ~74%</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md hover:bg-white/[0.08] hover:border-white/20 transition-all shadow-md">
                  <span className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">Native Indic Engine</span>
                  <h3 className="text-base sm:text-lg font-bold mt-1.5 text-white">Hinglish &amp; 22+ Indic Languages</h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    Powered by Sarvam Bulbul and Indic-tuned frontier models. Your agents understand colloquial phrasing, native pronunciation, and switch naturally between Hindi and English mid-sentence.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
                    {["हिन्दी", "Hinglish", "मराठी", "தமிழ்", "తెలుగు", "বাংলা"].map((tag) => (
                      <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-emerald-300 border border-white/10 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md hover:bg-white/[0.08] hover:border-white/20 transition-all shadow-md">
                  <span className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">Zero Friction</span>
                  <h3 className="text-base sm:text-lg font-bold mt-1.5 text-white">Sheets to Enterprise MCP</h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    No developers needed: paste a Google Sheet to launch outbound dialer campaigns in 60 seconds. For engineers, we provide India&apos;s only Model Context Protocol (MCP) server &amp; &gt;750ms WebRTC.
                  </p>
                  <div className="mt-4 text-xs text-slate-300 space-y-1.5 font-mono">
                    <p className="text-emerald-400">✓ Google Sheets auto-sync</p>
                    <p className="text-emerald-400">✓ Bi-directional CRM webhooks</p>
                    <p className="text-emerald-400">✓ TRAI compliant call windows</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            PITCH PUNCHLINES TO USE IN MARKETING & ADS
            ======================================================== */}
        <PitchPunchlinesSection />

        {/* ========================================================
            SECTION 9: INDUSTRY SOLUTIONS (ALL 5 ORIGINAL PICTURES & COPY)
            ======================================================== */}
        <section id="industries" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" aria-labelledby="work-title">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-blue-600 uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-blue-600" />
                Industry Solutions
              </span>
              <h2 id="work-title" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-2 leading-tight tracking-tight">
                Built for businesses that run<br />on conversations.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all">
                <span>Talk to Sales</span>
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-xs sm:text-sm shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-all">
                <span>Request A Demo</span>
              </Link>
            </div>
          </div>

          {/* Industry Tabs */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {industries.map((ind, idx) => (
              <button
                key={ind.title}
                type="button"
                onClick={() => setActiveIndustryIdx(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeIndustryIdx === idx
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                }`}
                aria-pressed={activeIndustryIdx === idx}
              >
                <span>{ind.tab}</span>
              </button>
            ))}
          </div>

          {/* Featured Industry Case Card using Original Image */}
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:h-[480px] w-full bg-slate-50 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200">
                <Image
                  src={selectedIndustry.image}
                  alt={`${selectedIndustry.title} business solutions`}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <span className="absolute top-4 left-4 rounded-full bg-slate-900/90 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-white shadow-md">
                  {selectedIndustry.badge}
                </span>
              </div>
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <span className="text-blue-600 font-mono text-xs font-bold uppercase tracking-wider">{selectedIndustry.tab}</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 leading-snug">
                    {selectedIndustry.heading}
                  </h3>
                  <p className="mt-3 text-slate-600 leading-relaxed text-sm">
                    {selectedIndustry.desc}
                  </p>
                </div>
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <span className="font-mono text-xs text-slate-400 block uppercase tracking-wider font-semibold">METRIC HIGHLIGHT</span>
                  <b className="text-lg sm:text-xl text-blue-600 font-extrabold mt-1 block">
                    {selectedIndustry.metric}
                  </b>
                  <div className="mt-5">
                    <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700 transition-all">
                      <span>Deploy for {selectedIndustry.title}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All 5 Industries Grid with Original Pictures */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, idx) => (
              <article
                key={ind.title}
                onClick={() => setActiveIndustryIdx(idx)}
                className={`group cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
                  activeIndustryIdx === idx
                    ? "border-blue-600 ring-2 ring-blue-500/20 shadow-lg"
                    : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={ind.image}
                    alt={ind.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-slate-900/90 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white">
                    {ind.badge}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-slate-400 text-xs font-mono font-semibold uppercase">{ind.tab}</span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">
                    {ind.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
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
        <div id="showcase-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <VoiceOperationsShowcase />
        </div>

        {/* ========================================================
            SECTION 11: AI INSIGHTS (Original Content)
            ======================================================== */}
        <section id="insights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24" aria-labelledby="insights-title">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-blue-600 uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-blue-600" />
                Knowledge &amp; Research
              </span>
              <h2 id="insights-title" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-2 tracking-tight">
                AI Insights
              </h2>
            </div>
            <Link href="/resources/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-all">
              <span>View More Articles</span>
              <span>→</span>
            </Link>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <Link href="/resources/blog" className="group lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 flex flex-col justify-between shadow-md hover:border-blue-400 hover:shadow-xl transition-all">
              <div>
                <span className="text-blue-600 font-semibold font-mono text-xs uppercase tracking-wider">FEATURED REPORT • MAY 15, 2026</span>
                <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  Understand what your customers are really saying.
                </h3>
                <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                  How acoustic sentiment extraction, tone recognition, and real-time semantic analysis reveal customer intent before the call ends.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider font-semibold">RESEARCH WHITE PAPER</span>
                <span className="grid size-10 place-items-center rounded-full bg-blue-50 text-blue-600 font-bold transition group-hover:bg-blue-600 group-hover:text-white">
                  ↗
                </span>
              </div>
            </Link>

            <div className="lg:col-span-5 flex flex-col gap-4">
              {insights.slice(1).map((item) => (
                <Link
                  key={item.title}
                  href="/resources/blog"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-slate-400 text-xs font-mono font-medium">{item.meta}</span>
                    <h4 className="text-base font-bold text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <span className="grid size-8 place-items-center rounded-full bg-slate-100 text-slate-600 font-bold transition group-hover:bg-blue-600 group-hover:text-white shrink-0">
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24" aria-labelledby="security-title">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-blue-600 uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-blue-600" />
                Enterprise Assurance
              </span>
              <h2 id="security-title" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Scale with security.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all">
                <span>Talk to Sales</span>
              </Link>
              <Link href="/resources/trust-center" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-xs sm:text-sm shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-all">
                <span>View Security</span>
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-blue-400 hover:shadow-lg transition-all">
              <span className="text-blue-600 font-mono text-xs font-bold uppercase tracking-wider">Information Security</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">ISO 27001</p>
              <span className="text-xs text-slate-500 font-medium block mt-1">Information Security Management</span>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">Enterprise access control, audit logging, and risk management compliance.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-blue-400 hover:shadow-lg transition-all">
              <span className="text-emerald-600 font-mono text-xs font-bold uppercase tracking-wider">Healthcare Privacy</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">HIPAA</p>
              <span className="text-xs text-slate-500 font-medium block mt-1">Compliance &amp; BAA Available</span>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">Protected Health Information (PHI) safeguards and confidential patient workflows.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-blue-400 hover:shadow-lg transition-all">
              <span className="text-indigo-600 font-mono text-xs font-bold uppercase tracking-wider">Global Privacy</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">GDPR &amp; DPDP</p>
              <span className="text-xs text-slate-500 font-medium block mt-1">European Union &amp; India</span>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">Right to be forgotten, data minimization, and localized Indian database hosting.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-blue-400 hover:shadow-lg transition-all">
              <span className="text-purple-600 font-mono text-xs font-bold uppercase tracking-wider">AICPA Assurance</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">SOC 2 Type II</p>
              <span className="text-xs text-slate-500 font-medium block mt-1">Audited &amp; Certified</span>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">Rigorous continuous penetration testing, SOC-2 compliance, and zero public model training.</p>
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
        <section id="integrations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" aria-labelledby="integrations-title">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-blue-600 uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-blue-600" />
                Ecosystem
              </span>
              <h2 id="integrations-title" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Don&apos;t replace.<br /><strong className="text-blue-600">Integrate.</strong>
              </h2>
            </div>
            <Link href="/integrations" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-all">
              <span>Explore All Integrations &rarr;</span>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {integrationPartners.map((item) => (
              <div
                key={item.name}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-400 hover:shadow-md hover:-translate-y-1"
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
                  <b className="block text-sm font-bold text-slate-900">{item.name}</b>
                  <span className="text-slate-400 text-[10px] block mt-0.5 font-mono font-semibold">{item.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 15: FAQ ACCORDION (Original Questions & Answers)
            ======================================================== */}
        <section id="faq" className="bg-slate-50 py-16 md:py-24 border-y border-slate-200" aria-labelledby="faq-title">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-blue-600 uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-blue-600" />
                Got Questions?
              </span>
              <h2 id="faq-title" className="text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900 mt-2">
                Everything you need to know.
              </h2>
            </div>

            <div className="mt-10 space-y-3">
              {faqs.map((faq, idx) => (
                <details key={idx} className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs transition-all open:shadow-md open:border-blue-300">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 list-none font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    <span>{faq.q}</span>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 text-sm font-mono group-open:rotate-45 group-open:bg-blue-600 group-open:text-white transition-all">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-600 leading-relaxed text-sm sm:text-base border-t border-slate-100 pt-4">
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
        <footer className="bg-[#090d16] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-28">
            {/* Pre-Footer CTA Banner (Original Content) */}
            <div className="grid gap-10 border-b border-white/10 pb-16 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">Ready to modernize your phone lines?</p>
                <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold leading-tight text-white tracking-tight">
                  Build your AI voice agent today.
                </h2>
                <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                  Building intelligent voice experiences that help businesses create better conversations, automate meaningful work, and connect people with outcomes.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 lg:items-end">
                <a href="mailto:hello@vozon.ai" className="text-xl sm:text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                  hello@vozon.ai
                </a>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all">
                    <span>Try for Free</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white hover:text-slate-900 transition-all">
                    <span>Get a Demo</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer Navigation Columns (All Original Product, Resources, Company & Contact Links) */}
            <div className="mt-14 grid gap-10 border-b border-white/15 pb-16 sm:grid-cols-2 lg:grid-cols-5">
              {/* Column 1: Brand & Socials */}
              <div className="lg:col-span-1">
                <span className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight">
                  <span className="grid size-8 place-items-center rounded-lg bg-emerald-500 text-slate-900 font-mono text-sm font-black">
                    V
                  </span>
                  Vozon<span className="text-emerald-400">.</span>
                </span>
                <p className="mt-4 text-xs leading-relaxed text-slate-400">
                  Building intelligent voice experiences that help businesses create better conversations, automate meaningful work, and connect people with outcomes.
                </p>

                {/* Social links */}
                <div className="mt-6 flex items-center gap-3">
                  <a
                    aria-label="Twitter / X"
                    href="https://x.com/vozonai_"
                    rel="noreferrer"
                    target="_blank"
                    className="grid size-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-emerald-400 hover:text-emerald-400"
                  >
                    <span className="font-bold text-xs">X</span>
                  </a>
                  <a
                    aria-label="LinkedIn"
                    href="https://linkedin.com/company/vozon-ai-india/"
                    rel="noreferrer"
                    target="_blank"
                    className="grid size-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-emerald-400 hover:text-emerald-400"
                  >
                    <span className="font-bold text-xs">in</span>
                  </a>
                  <a
                    aria-label="Instagram"
                    href="https://www.instagram.com/vozonai"
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-emerald-400 hover:text-emerald-400"
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
                    className="grid size-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-emerald-400 hover:text-emerald-400"
                  >
                    <span className="text-sm">☎</span>
                  </a>
                  <a
                    aria-label="Email hello@vozon.ai"
                    href="mailto:hello@vozon.ai"
                    className="grid size-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-emerald-400 hover:text-emerald-400"
                  >
                    <span className="text-sm">✉</span>
                  </a>
                </div>
              </div>

              {/* Column 2: Product (All 9 Original Links) */}
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">Product</span>
                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-300">
                  <li><Link href="/services/voice-agents" className="hover:text-white transition-colors">Voice Agents</Link></li>
                  <li><Link href="/services/voice-cloning" className="hover:text-white transition-colors">Voice Cloning</Link></li>
                  <li><Link href="/services/realtime-tts" className="hover:text-white transition-colors">Realtime TTS</Link></li>
                  <li><Link href="/services/api-access" className="hover:text-white transition-colors">API Access</Link></li>
                  <li><Link href="/services/team-workflows" className="hover:text-white transition-colors">Team Workflows</Link></li>
                  <li><Link href="/services/speech-analytics" className="hover:text-white transition-colors">Speech Analytics</Link></li>
                  <li><Link href="/services/quality-controls" className="hover:text-white transition-colors">Quality Controls</Link></li>
                  <li><Link href="/services/multilingual-speech" className="hover:text-white transition-colors">Multilingual Speech</Link></li>
                  <li><Link href="/services/conversation-insights" className="hover:text-white transition-colors">Conversation Insights</Link></li>
                </ul>
              </div>

              {/* Column 3: Resources (All 8 Original Links) */}
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">Resources</span>
                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-300">
                  <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link href="/resources/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
                  <li><Link href="/resources/help-center" className="hover:text-white transition-colors">Support</Link></li>
                  <li><Link href="/docs/api" className="hover:text-white transition-colors">Download</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy policy</Link></li>
                  <li><Link href="/partners" className="hover:text-white transition-colors">Affiliate program</Link></li>
                </ul>
              </div>

              {/* Column 4: Company & Solutions */}
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">Company</span>
                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-300">
                  <li><Link href="/career" className="hover:text-white transition-colors">We&apos;re hiring</Link></li>
                  <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/resources/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact us</Link></li>
                </ul>

                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold block mt-6">Solutions</span>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-300">
                  <li><Link href="/solutions/banking" className="hover:text-white transition-colors">Banking &amp; Collections</Link></li>
                  <li><Link href="/solutions/healthcare" className="hover:text-white transition-colors">Healthcare Intake</Link></li>
                  <li><Link href="/solutions/hospitality" className="hover:text-white transition-colors">Hospitality Concierge</Link></li>
                  <li><Link href="/solutions/education" className="hover:text-white transition-colors">EdTech Qualification</Link></li>
                  <li><Link href="/solutions/b2b" className="hover:text-white transition-colors">B2B Logistics</Link></li>
                </ul>
              </div>

              {/* Column 5: Contact US & Global Offices */}
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">Contact US</span>
                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-300">
                  <li><a href="mailto:hello@vozon.ai" className="hover:text-white transition-colors">hello@vozon.ai</a></li>
                  <li><a href="tel:+917892518414" className="hover:text-white transition-colors">+91 78925 18414</a></li>
                  <li><Link href="/contact#office-locations" className="hover:text-white transition-colors">Our Office Locations</Link></li>
                  <li><Link href="/contact" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">Book a free demo &rarr;</Link></li>
                </ul>

                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold block mt-6">Global Offices</span>
                <div className="mt-3 space-y-2.5 font-mono text-xs text-slate-300">
                  <div>
                    <div className="flex items-center justify-between">
                      <b className="text-white">Noida (HQ)</b>
                      <span className="text-emerald-400 font-bold">{clocks.noida}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">A-135, Sector 63, UP</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <b className="text-white">Bangalore</b>
                      <span className="text-emerald-400 font-bold">{clocks.bangalore}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">HSR Layout, Karnataka</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <b className="text-white">London</b>
                      <span className="text-emerald-400 font-bold">{clocks.london}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">EC2A 4NE, UK</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <b className="text-white">New York</b>
                      <span className="text-emerald-400 font-bold">{clocks.newyork}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Madison Ave, NY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Tags Ribbon (All 20+ Original Tags Preserved) */}
            <div className="border-b border-white/10 py-8">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-4">Focus Areas &amp; Capabilities</span>
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300 hover:border-emerald-400 hover:text-white transition-colors"
                  >
                    <i className="not-italic text-emerald-400 font-bold">{tag.icon}</i>
                    <span>{tag.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 font-mono text-xs text-slate-400 sm:flex-row">
              <p>&copy; {new Date().getFullYear()} Vozon AI Inc. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/resources/trust-center" className="hover:text-white transition-colors">Trust Center</Link>
                <a href="#main" className="hover:text-emerald-400 transition-colors">Back to top &uarr;</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default HomeDesignFour;
