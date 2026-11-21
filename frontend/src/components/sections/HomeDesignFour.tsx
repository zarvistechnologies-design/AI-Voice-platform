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
  { label: "ଓଡ଼ିଆ", language: "Odia", voice: "Odia", detail: "ଓଡ଼ିଆ voice", file: "/audio/india-voices/hi.wav" },
  { label: "অসমীয়া", language: "Assamese", voice: "Assamese", detail: "অসমীয়া voice", file: "/audio/india-voices/bn.wav" },
];

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

// Original Industry Solutions with Pictures & Copy
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
];

// Original AI Insights
const insights = [
  { title: "Understand what your customers are really saying.", meta: "MAY 15, 2026 • FEATURED", tone: "purple", isFeatured: true },
  { title: "Customer Sentiment", meta: "MAY 15, 2026 • 5 MIN READ", tone: "purple" },
  { title: "Conversation Quality", meta: "FEBRUARY 20, 2026 • 8 MIN READ", tone: "blue" },
  { title: "Intent Detection", meta: "JANUARY 16, 2026 • 6 MIN READ", tone: "cyan" },
  { title: "Conversation Trends", meta: "JANUARY 12, 2026 • 4 MIN READ", tone: "amber" },
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
      setHeaderScrolled(window.scrollY > 25);
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
    const interval = setInterval(updateClocks, 10000);
    return () => clearInterval(interval);
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
    <div className="zippee-page bg-white min-h-screen text-[#1D1D1F] selection:bg-purple-100 selection:text-purple-900">
      {/* ========================================================
          SECTION 1: SITE HEADER (Zippee-Style Sticky Glassmorphic Navbar)
          ======================================================== */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          headerScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-100 py-3"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo with Electric Purple Gradient Mark */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="Vozon AI home">
            <span className="size-8 rounded-xl bg-gradient-to-tr from-[#9F3DA8] to-[#c084fc] flex items-center justify-center text-white font-mono font-bold text-sm shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              V
            </span>
            <span className="text-xl font-extrabold text-[#1D1D1F] tracking-tight">
              Vozon<span className="text-[#9F3DA8]">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links (Pill Container) */}
          <nav aria-label="Main" className="hidden lg:flex items-center gap-1 bg-gray-50/90 p-1.5 rounded-full border border-gray-200/70 shadow-xs">
            <a href="#platform" className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#9F3DA8] hover:bg-white rounded-full transition-all">Voice Demo</a>
            <a href="#pillars" className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#9F3DA8] hover:bg-white rounded-full transition-all">5 Pillars</a>
            <a href="#comparison" className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#9F3DA8] hover:bg-white rounded-full transition-all">Comparison</a>
            <a href="#architecture" className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#9F3DA8] hover:bg-white rounded-full transition-all">Architecture</a>
            <a href="#agentic-in-action" className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#9F3DA8] hover:bg-white rounded-full transition-all">In Action</a>
            <a href="#advantage" className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#9F3DA8] hover:bg-white rounded-full transition-all">Indic Engine</a>
            <a href="#industries" className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#9F3DA8] hover:bg-white rounded-full transition-all">Industries</a>
            <a href="#integrations" className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#9F3DA8] hover:bg-white rounded-full transition-all">Integrations</a>
            <Link href="/pricing" className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#9F3DA8] hover:bg-white rounded-full transition-all">Pricing</Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link href="/login" className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-[#9F3DA8] transition-colors">
              Sign in
            </Link>
            <Link href="/contact" className="zippee-btn-primary">
              <span>Start Free</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="flex size-10 flex-col items-center justify-center gap-1.5 lg:hidden rounded-xl bg-white border border-gray-200 shadow-xs"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-18 bottom-0 overflow-y-auto bg-white/98 backdrop-blur-2xl p-6 lg:hidden border-t border-gray-100 shadow-2xl z-40">
            <nav className="flex flex-col space-y-3">
              <a href="#platform" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-bold text-gray-800">
                <span>Voice Demo</span> <span className="font-mono text-xs text-[#9F3DA8] font-bold">01</span>
              </a>
              <a href="#pillars" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-bold text-gray-800">
                <span>5 Pillars</span> <span className="font-mono text-xs text-[#9F3DA8] font-bold">02</span>
              </a>
              <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-bold text-gray-800">
                <span>Comparison</span> <span className="font-mono text-xs text-[#9F3DA8] font-bold">03</span>
              </a>
              <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-bold text-gray-800">
                <span>Architecture</span> <span className="font-mono text-xs text-[#9F3DA8] font-bold">04</span>
              </a>
              <a href="#agentic-in-action" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-bold text-gray-800">
                <span>In Action</span> <span className="font-mono text-xs text-[#9F3DA8] font-bold">05</span>
              </a>
              <a href="#advantage" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-bold text-gray-800">
                <span>Indic Engine</span> <span className="font-mono text-xs text-[#9F3DA8] font-bold">06</span>
              </a>
              <a href="#industries" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-bold text-gray-800">
                <span>Industries</span> <span className="font-mono text-xs text-[#9F3DA8] font-bold">07</span>
              </a>
              <a href="#integrations" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-bold text-gray-800">
                <span>Integrations</span> <span className="font-mono text-xs text-[#9F3DA8] font-bold">08</span>
              </a>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-gray-100 py-3 text-base font-bold text-gray-800">
                <span>Pricing</span> <span className="font-mono text-xs text-[#9F3DA8] font-bold">09</span>
              </Link>

              <div className="pt-4 space-y-2">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="zippee-btn-primary w-full text-center py-3">
                  Deploy an Agent &rarr;
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                  Sign in
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* ========================================================
            SECTION 2: HERO SECTION (Zippee-Inspired Luminous Lilac Canvas)
            ======================================================== */}
        <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden bg-gradient-to-b from-[#FDF4FF] via-white to-white">
          {/* Ambient Radial Highlight */}
          <div
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[1100px] rounded-full blur-[140px] opacity-40 bg-[radial-gradient(circle,#9F3DA8_0%,#FDF4FF_60%,transparent_100%)]"
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Live Telemetry Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="zippee-pill border-purple-200/90 text-purple-900 font-semibold shadow-xs">
                <span className="size-2 rounded-full bg-[#9F3DA8] animate-pulse" />
                <span>Autonomous Voice AI Platform</span>
              </span>
              <span className="zippee-pill">
                <span className="text-amber-500 font-bold">⚡</span>
                <span>&gt;750ms Telephony Latency</span>
              </span>
              <span className="zippee-pill">
                <span>🇮🇳</span>
                <span>22+ Indic &amp; 76 Global Languages</span>
              </span>
              <span className="zippee-pill">
                <span className="text-purple-600 font-bold">📞</span>
                <span>BYOT Virtual Telephony</span>
              </span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="mt-8 text-4xl sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-[#1D1D1F] max-w-5xl leading-[1.08]">
              <span>Beyond Voice Bots:</span><br />
              <span>Autonomous AI Agents That</span><br className="hidden sm:inline" />{" "}
              <span className="bg-gradient-to-r from-[#9F3DA8] via-purple-700 to-[#6228d7] bg-clip-text text-transparent">
                Reason, Act, and Deliver Outcomes.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl font-bold text-[#1D1D1F] max-w-4xl">
              Don&apos;t just automate answers. <span className="text-[#9F3DA8] font-bold">Automate complete business workflows over voice.</span>
            </p>

            <div className="mt-8 grid gap-8 border-t border-gray-100 pt-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7 lg:col-span-8">
                <p className="text-base leading-relaxed text-gray-600 sm:text-[17px]">
                  Traditional voice bots follow rigid scripts. Our Agentic Voice Platform deploys autonomous AI agents equipped with cognitive reasoning, dynamic planning, real-time tool execution, and long-term memory—enabling them to handle complex, non-linear human conversations from end to end.
                </p>
                <p className="mt-4 text-base font-semibold sm:text-lg text-[#1D1D1F]">
                  Trusted voice platform to{" "}
                  <span className="text-[#9F3DA8] font-bold underline decoration-purple-300 underline-offset-4">
                    {rotatingWords[rotatorIdx]}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 md:col-span-5 lg:col-span-4 md:justify-end">
                <Link href="/login" className="zippee-btn-primary px-6 py-3.5 shadow-lg shadow-purple-500/25">
                  <span>Get Started Free</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/contact" className="zippee-btn-secondary px-6 py-3.5">
                  <span>Book a Demo</span>
                </Link>
              </div>
            </div>

            {/* Original Trust Bar */}
            <div className="mt-14 grid grid-cols-2 gap-4 border-t border-gray-100 pt-10 sm:grid-cols-4">
              <div className="zippee-card p-4 sm:p-5 flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 font-mono text-lg font-bold shadow-xs">⚡</span>
                <div>
                  <b className="block text-base font-bold text-[#1D1D1F]">&gt;750ms Latency</b>
                  <span className="text-xs text-gray-500">Telephony turnaround</span>
                </div>
              </div>
              <div className="zippee-card p-4 sm:p-5 flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-purple-50 text-[#9F3DA8] font-mono text-lg font-bold shadow-xs">🇮🇳</span>
                <div>
                  <b className="block text-base font-bold text-[#1D1D1F]">22+ Indic &amp; 76 Global</b>
                  <span className="text-xs text-gray-500">Native dialects &amp; accents</span>
                </div>
              </div>
              <div className="zippee-card p-4 sm:p-5 flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-pink-50 text-pink-600 font-mono text-lg font-bold shadow-xs">📊</span>
                <div>
                  <b className="block text-base font-bold text-[#1D1D1F]">1-Click Sheets</b>
                  <span className="text-xs text-gray-500">Instant outbound dialer</span>
                </div>
              </div>
              <div className="zippee-card p-4 sm:p-5 flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 font-mono text-lg font-bold shadow-xs">📞</span>
                <div>
                  <b className="block text-base font-bold text-[#1D1D1F]">BYOT Telephony</b>
                  <span className="text-xs text-gray-500">Exotel, Twilio, Tata, Airtel</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: LIVE VOICE CALL & AUDIO DEMO (Modern Playground)
            ======================================================== */}
        <section id="platform" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-label="Featured live demo">
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold">
                  <span className="size-2 rounded-full bg-[#9F3DA8] animate-pulse" />
                  Live Interactive Session
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] mt-2">
                  Vozon: India&apos;s Complete Enterprise Voice AI Platform
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Build intelligent voice agents, connect your business systems, and automate customer conversations with Vozon.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-xs font-semibold text-gray-700">
                  <span className={`size-2 rounded-full ${isCallActive ? "bg-emerald-500 animate-pulse" : "bg-purple-500"}`} />
                  {isCallActive ? voiceCall.active ? "Live Call Connected" : "Dialing..." : "Telemetry: >750ms PSTN"}
                </span>
                <span className="hidden sm:inline-block font-mono text-xs text-gray-400">WebRTC &amp; SIP Ready</span>
              </div>
            </div>

            {/* 12 Voice Languages Selector */}
            <div className="mt-8">
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Select Language &amp; Accent Preview:
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {voiceLanguages.map((lang, idx) => {
                  const isActive = activeVoiceIdx === idx;
                  return (
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
                      className={
                        isActive
                          ? "rounded-full bg-gradient-to-r from-[#9F3DA8] to-[#862B8E] text-white px-4 py-2 text-xs font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer"
                          : "zippee-pill px-4 py-2 hover:border-[#9F3DA8]/40 hover:bg-[#FDF4FF] transition-all flex items-center gap-2 cursor-pointer"
                      }
                      aria-pressed={isActive}
                    >
                      <span className="font-bold">{lang.label}</span>
                      <span className={`text-[11px] ${isActive ? "text-purple-100" : "text-gray-400"}`}>
                        {lang.detail}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Audio & Call Stage (Zippee-styled Obsidian plum console) */}
            <div className="zippee-dark-card p-6 sm:p-8 mt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
                    className={`grid size-16 shrink-0 place-items-center rounded-2xl transition-all shadow-lg cursor-pointer ${
                      isCallActive
                        ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/30"
                        : isPlayingAudio
                        ? "bg-gradient-to-r from-[#9F3DA8] to-purple-600 text-white shadow-purple-500/40"
                        : "bg-gradient-to-r from-[#9F3DA8] to-purple-600 text-white hover:scale-105 shadow-purple-500/30"
                    }`}
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
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">
                        Vozon Voice ({selectedVoice.voice})
                      </span>
                      <span className="rounded-full bg-purple-500/20 px-2 py-0.5 font-mono text-[10px] text-purple-200 border border-purple-500/30">
                        SARVAM BULBUL + ELEVENLABS
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-purple-200/80">
                      {isCallActive
                        ? voiceCall.active
                          ? `Live call active • Speaking ${voiceCall.speakingLanguage || selectedVoice.language}`
                          : "Connecting to voice agent..."
                        : isPlayingAudio
                        ? `Playing synthesized ${selectedVoice.label} voice sample...`
                        : "Click play for sample or launch interactive call."}
                    </p>

                    {/* Equalizer animation */}
                    {(isPlayingAudio || isCallActive) && (
                      <div className="mt-3 flex items-center gap-1.5 h-6">
                        {[40, 75, 100, 60, 30, 85, 95, 50, 70, 90, 45, 65, 80, 55, 35, 75, 90, 65].map((h, i) => (
                          <span
                            key={i}
                            className="w-1 bg-gradient-to-t from-purple-500 to-pink-300 rounded-full animate-equalizer"
                            style={{
                              height: `${h * 0.22}px`,
                              animationDelay: `${i * 55}ms`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button for Live Call vs Sample */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCallActive) {
                        voiceCall.disconnect();
                      } else {
                        void voiceCall.start(selectedVoice.language);
                      }
                    }}
                    className={`w-full sm:w-auto px-6 py-3.5 rounded-full font-semibold text-xs transition-all shadow-md cursor-pointer ${
                      isCallActive
                        ? "bg-red-500/20 border border-red-500/40 text-red-200 hover:bg-red-500/30"
                        : "bg-white text-[#1D1D1F] hover:bg-purple-50 hover:text-[#9F3DA8]"
                    }`}
                  >
                    <span>{isCallActive ? "End Live Call" : `Talk to Agent (${selectedVoice.language})`}</span>
                  </button>
                </div>
              </div>

              {voiceCall.error && (voiceCall.active || voiceCall.busy) && (
                <p className="mt-4 text-xs text-red-300 font-mono bg-red-950/50 p-2.5 rounded-xl border border-red-800">
                  {voiceCall.error}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: INFINITE CAPABILITIES MARQUEE
            ======================================================== */}
        <section aria-label="Voice capabilities marquee" className="border-y border-gray-100 bg-[#FDF4FF]/60 py-4 overflow-hidden">
          <div className="relative overflow-hidden w-full">
            <div className="animate-marquee gap-3 py-1">
              {[1, 2].map((group) => (
                <div key={group} className="flex items-center gap-4 shrink-0 font-mono text-xs text-gray-700">
                  <span className="zippee-pill bg-white shadow-xs">Inbound Customer Support</span>
                  <span className="text-[#9F3DA8] font-bold">✦</span>
                  <span className="zippee-pill bg-white shadow-xs">Outbound Dialer Campaigns</span>
                  <span className="text-[#9F3DA8] font-bold">✦</span>
                  <span className="zippee-pill bg-white shadow-xs">Hinglish &amp; 22+ Indic Languages</span>
                  <span className="text-[#9F3DA8] font-bold">✦</span>
                  <span className="zippee-pill bg-white shadow-xs">76 Global Languages</span>
                  <span className="text-[#9F3DA8] font-bold">✦</span>
                  <span className="zippee-pill bg-white shadow-xs">&gt;750ms Telephony Latency</span>
                  <span className="text-[#9F3DA8] font-bold">✦</span>
                  <span className="zippee-pill bg-white shadow-xs">1-Click Google Sheets Outbound</span>
                  <span className="text-[#9F3DA8] font-bold">✦</span>
                  <span className="zippee-pill bg-white shadow-xs">Smart Virtual Telephony &amp; BYOT</span>
                  <span className="text-[#9F3DA8] font-bold">✦</span>
                  <span className="zippee-pill bg-white shadow-xs">Real-Time Barge-In</span>
                  <span className="text-[#9F3DA8] font-bold">✦</span>
                  <span className="zippee-pill bg-white shadow-xs">TRAI Compliant Call Windows</span>
                  <span className="text-[#9F3DA8] font-bold">✦</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: CLIENT LOGOS / SOCIAL PROOF (Original Logos)
            ======================================================== */}
        <section aria-labelledby="clients-title" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-8 md:grid-cols-12 items-center">
            <div className="md:col-span-4">
              <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold mb-2">
                <span className="size-2 rounded-full bg-[#9F3DA8]" />
                Trusted In Production
              </span>
              <h2 id="clients-title" className="zippee-title-underline-left text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] mt-2">
                In good company.
              </h2>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-sm">
                From high-growth tech disruptors to national enterprise call operations, over 10M+ automated minutes handled with 99.9% reliability.
              </p>
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-3 md:col-span-8 gap-3">
              {clientLogos.map((client, idx) => (
                <li
                  key={idx}
                  className="zippee-card p-4 sm:p-5 flex items-center justify-center text-center hover:border-purple-300 transition-all min-h-[4.5rem]"
                >
                  <span
                    className={`text-base sm:text-lg font-bold tracking-tight text-[#1D1D1F] ${
                      client.isMono ? "font-mono" : client.isItalic ? "italic" : "font-sans"
                    }`}
                  >
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
        <section id="advantage" aria-labelledby="indic-title" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative rounded-3xl border border-gray-200 bg-gradient-to-br from-[#FDF4FF] via-white to-white p-8 sm:p-14 shadow-xl">
            <div className="max-w-3xl">
              <span className="zippee-pill bg-purple-100 text-purple-900 border-purple-300 font-semibold mb-3">
                <span className="size-2 rounded-full bg-[#9F3DA8]" />
                The Indian Voice Advantage
              </span>
              <h2 id="indic-title" className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight mt-3">
                Why India&apos;s leading teams switch from US tools to <strong className="text-[#9F3DA8]">Vozon</strong>
              </h2>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Traditional voice tools struggle with Indian accents, 080 spam flags, and rigid telecom rules. Vozon is engineered from day one for Indian telephony and local customer trust.
              </p>

              {/* 3 Metric Pills */}
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="zippee-card p-4 rounded-2xl flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-[#9F3DA8]">22+</span>
                  <span className="text-xs font-semibold text-gray-600">Indic Languages</span>
                </div>
                <div className="zippee-card p-4 rounded-2xl flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-[#9F3DA8]">&gt;750ms</span>
                  <span className="text-xs font-semibold text-gray-600">PSTN Latency</span>
                </div>
                <div className="zippee-card p-4 rounded-2xl flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-[#9F3DA8]">~74%</span>
                  <span className="text-xs font-semibold text-gray-600">Verified Pickup</span>
                </div>
              </div>
            </div>

            {/* 3 Advantage Cards */}
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <div className="zippee-card p-6 flex flex-col justify-between">
                <div>
                  <span className="zippee-pill mb-3">High Pickup Telephony</span>
                  <h3 className="text-lg font-bold text-[#1D1D1F] mt-2">Smart Virtual Telephony &amp; BYOT</h3>
                  <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                    US platforms lock you into rigid 080 trunks that get flagged as spam. Vozon provides enterprise local virtual numbers and Bring-Your-Own-Carrier (BYOT) support across Exotel, Airtel, and Tata.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-mono font-semibold">
                  <span className="text-gray-400">Unverified 080: ~22%</span>
                  <span className="text-[#9F3DA8]">Vozon Smart: ~74%</span>
                </div>
              </div>

              <div className="zippee-card p-6 flex flex-col justify-between">
                <div>
                  <span className="zippee-pill mb-3">Native Indic Engine</span>
                  <h3 className="text-lg font-bold text-[#1D1D1F] mt-2">Hinglish &amp; 22+ Indic Languages</h3>
                  <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                    Powered by Sarvam Bulbul and Indic-tuned frontier models. Your agents understand colloquial phrasing, native pronunciation, and switch naturally between Hindi and English mid-sentence.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-1.5 font-mono text-xs">
                  {["हिन्दी", "Hinglish", "मराठी", "தமிழ்", "తెలుగు", "বাংলা"].map((tag) => (
                    <span key={tag} className="zippee-pill bg-purple-50 text-purple-900">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="zippee-card p-6 flex flex-col justify-between">
                <div>
                  <span className="zippee-pill mb-3">Zero Friction</span>
                  <h3 className="text-lg font-bold text-[#1D1D1F] mt-2">Sheets to Enterprise MCP</h3>
                  <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                    No developers needed: paste a Google Sheet to launch outbound dialer campaigns in 60 seconds. For engineers, we provide India&apos;s only Model Context Protocol (MCP) server &amp; &gt;750ms WebRTC.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-1.5 text-xs text-gray-700 font-medium">
                  <p className="flex items-center gap-1.5 text-emerald-600">✓ Google Sheets auto-sync</p>
                  <p className="flex items-center gap-1.5 text-emerald-600">✓ Bi-directional CRM webhooks</p>
                  <p className="flex items-center gap-1.5 text-emerald-600">✓ TRAI compliant call windows</p>
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
        <section id="industries" aria-labelledby="work-title" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold mb-2">
                <span className="size-2 rounded-full bg-[#9F3DA8]" />
                Industry Solutions
              </span>
              <h2 id="work-title" className="zippee-title-underline-left text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] mt-2">
                Built for businesses that run<br />on conversations.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/contact" className="zippee-btn-secondary">
                <span>Talk to Sales</span>
              </Link>
              <Link href="/contact" className="zippee-btn-primary">
                <span>Request A Demo</span>
              </Link>
            </div>
          </div>

          {/* Industry Tabs */}
          <div className="flex flex-wrap gap-2 pb-6 border-b border-gray-100">
            {industries.map((ind, idx) => {
              const isActive = activeIndustryIdx === idx;
              return (
                <button
                  key={ind.title}
                  type="button"
                  onClick={() => setActiveIndustryIdx(idx)}
                  className={
                    isActive
                      ? "rounded-full bg-[#9F3DA8] text-white px-5 py-2 text-xs font-bold shadow-md transition-all cursor-pointer"
                      : "zippee-pill px-5 py-2 hover:bg-[#FDF4FF] hover:border-purple-300 transition-all cursor-pointer font-semibold"
                  }
                  aria-pressed={isActive}
                >
                  <span>{ind.tab}</span>
                </button>
              );
            })}
          </div>

          {/* Featured Industry Case Card */}
          <div className="mt-8 zippee-card overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
              <div className="lg:col-span-6 relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={selectedIndustry.image}
                  alt={`${selectedIndustry.title} business solutions`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <span className="absolute top-4 left-4 zippee-pill bg-white/95 backdrop-blur-md shadow-md text-[#9F3DA8] font-bold">
                  {selectedIndustry.badge}
                </span>
              </div>
              <div className="lg:col-span-6 space-y-4">
                <span className="zippee-pill text-[#9F3DA8] bg-purple-50 font-bold">{selectedIndustry.tab}</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] leading-tight">
                  {selectedIndustry.heading}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedIndustry.desc}
                </p>
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] text-gray-400 block uppercase tracking-wider">METRIC HIGHLIGHT</span>
                    <b className="text-xl font-extrabold text-[#9F3DA8]">
                      {selectedIndustry.metric}
                    </b>
                  </div>
                  <Link href="/contact" className="zippee-btn-primary">
                    <span>Deploy for {selectedIndustry.title}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* All 5 Industries Grid with Original Pictures */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((ind, idx) => (
              <article
                key={ind.title}
                onClick={() => setActiveIndustryIdx(idx)}
                className={`zippee-card p-4 cursor-pointer transition-all ${
                  activeIndustryIdx === idx ? "ring-2 ring-[#9F3DA8] bg-purple-50/40" : ""
                }`}
              >
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3">
                  <Image src={ind.image} alt={ind.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 20vw" />
                  <span className="absolute bottom-2 left-2 zippee-pill text-[10px] bg-white/90 py-0.5 px-2 font-bold">
                    {ind.badge}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#9F3DA8] font-bold uppercase">{ind.tab}</span>
                  <h4 className="text-sm font-bold text-[#1D1D1F] mt-1 line-clamp-1">{ind.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ind.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 10: VOICE OPERATIONS SHOWCASE (Original Component)
            ======================================================== */}
        <div id="showcase-section">
          <VoiceOperationsShowcase />
        </div>

        {/* ========================================================
            SECTION 11: AI INSIGHTS (Original Content)
            ======================================================== */}
        <section id="insights" aria-labelledby="insights-title" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold mb-2">
                <span className="size-2 rounded-full bg-[#9F3DA8]" />
                Knowledge &amp; Research
              </span>
              <h2 id="insights-title" className="zippee-title-underline-left text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] mt-2">
                AI Insights
              </h2>
            </div>
            <Link href="/resources/blog" className="zippee-btn-secondary">
              <span>View More Articles</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <Link href="/resources/blog" className="lg:col-span-7 zippee-card p-8 flex flex-col justify-between group">
              <div>
                <span className="zippee-pill bg-purple-100 text-purple-900 border-purple-200 font-bold mb-4">FEATURED REPORT • MAY 15, 2026</span>
                <h3 className="text-2xl font-extrabold text-[#1D1D1F] group-hover:text-[#9F3DA8] transition-colors mt-2">
                  Understand what your customers are really saying.
                </h3>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  How acoustic sentiment extraction, tone recognition, and real-time semantic analysis reveal customer intent before the call ends.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs font-mono font-bold text-[#9F3DA8]">
                <span>RESEARCH WHITE PAPER</span>
                <span className="size-8 rounded-full bg-purple-50 grid place-items-center group-hover:bg-[#9F3DA8] group-hover:text-white transition-all">↗</span>
              </div>
            </Link>

            <div className="lg:col-span-5 grid gap-4">
              {insights.slice(1).map((item) => (
                <Link key={item.title} href="/resources/blog" className="zippee-card p-5 flex items-center justify-between group">
                  <div>
                    <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block">{item.meta}</span>
                    <h4 className="text-sm font-bold text-[#1D1D1F] group-hover:text-[#9F3DA8] transition-colors mt-1">
                      {item.title}
                    </h4>
                  </div>
                  <span className="size-7 rounded-full bg-gray-50 text-gray-400 grid place-items-center group-hover:bg-[#9F3DA8] group-hover:text-white transition-all shrink-0 ml-3">
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
        <section aria-labelledby="security-title" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold mb-2">
                <span className="size-2 rounded-full bg-[#9F3DA8]" />
                Enterprise Assurance
              </span>
              <h2 id="security-title" className="zippee-title-underline-left text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] mt-2">
                Scale with security.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/contact" className="zippee-btn-secondary">
                <span>Talk to Sales</span>
              </Link>
              <Link href="/resources/trust-center" className="zippee-btn-primary">
                <span>View Security</span>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="zippee-card p-6">
              <span className="zippee-pill text-emerald-700 bg-emerald-50 border-emerald-200">Information Security</span>
              <p className="text-2xl font-black text-[#1D1D1F] mt-3">ISO 27001</p>
              <span className="text-xs font-bold text-gray-500 block mt-1">Information Security Management</span>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">Enterprise access control, audit logging, and risk management compliance.</p>
            </div>
            <div className="zippee-card p-6">
              <span className="zippee-pill text-purple-700 bg-purple-50 border-purple-200">Healthcare Privacy</span>
              <p className="text-2xl font-black text-[#1D1D1F] mt-3">HIPAA</p>
              <span className="text-xs font-bold text-gray-500 block mt-1">Compliance &amp; BAA Available</span>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">Protected Health Information (PHI) safeguards and confidential patient workflows.</p>
            </div>
            <div className="zippee-card p-6">
              <span className="zippee-pill text-indigo-700 bg-indigo-50 border-indigo-200">Global Privacy</span>
              <p className="text-2xl font-black text-[#1D1D1F] mt-3">GDPR &amp; DPDP</p>
              <span className="text-xs font-bold text-gray-500 block mt-1">European Union &amp; India</span>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">Right to be forgotten, data minimization, and localized Indian database hosting.</p>
            </div>
            <div className="zippee-card p-6">
              <span className="zippee-pill text-pink-700 bg-pink-50 border-pink-200">AICPA Assurance</span>
              <p className="text-2xl font-black text-[#1D1D1F] mt-3">SOC 2 Type II</p>
              <span className="text-xs font-bold text-gray-500 block mt-1">Audited &amp; Certified</span>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">Rigorous continuous penetration testing, SOC-2 compliance, and zero public model training.</p>
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
        <section id="integrations" aria-labelledby="integrations-title" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold mb-2">
                <span className="size-2 rounded-full bg-[#9F3DA8]" />
                Ecosystem
              </span>
              <h2 id="integrations-title" className="zippee-title-underline-left text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] mt-2">
                Don&apos;t replace.<br /><strong className="text-[#9F3DA8]">Integrate.</strong>
              </h2>
            </div>
            <Link href="/integrations" className="zippee-btn-secondary">
              <span>Explore All Integrations &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {integrationPartners.map((item) => (
              <div key={item.name} className="zippee-card p-4 sm:p-5 flex items-center gap-4">
                <div className="relative size-10 shrink-0">
                  <Image src={item.icon} alt={item.name} fill className="object-contain" />
                </div>
                <div>
                  <b className="block text-sm font-bold text-[#1D1D1F]">{item.name}</b>
                  <span className="text-[10px] font-mono text-purple-600 font-bold">{item.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 15: FAQ ACCORDION (Original Questions & Answers)
            ======================================================== */}
        <section id="faq" aria-labelledby="faq-title" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold mb-3">
              <span className="size-2 rounded-full bg-[#9F3DA8]" />
              Got Questions?
            </span>
            <h2 id="faq-title" className="zippee-title-underline text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] mt-2">
              Everything you need to know.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="zippee-card group p-6 [&_svg]:open:rotate-45">
                <summary className="flex items-center justify-between gap-4 font-bold text-base text-[#1D1D1F] cursor-pointer list-none">
                  <span>{faq.q}</span>
                  <span className="size-8 rounded-full bg-purple-50 text-[#9F3DA8] grid place-items-center shrink-0 font-bold text-lg group-open:bg-[#9F3DA8] group-open:text-white transition-all">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed pt-4 border-t border-gray-100">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 16: SITE FOOTER (Zippee-Inspired Deep Plum Obsidian)
            ======================================================== */}
        <footer className="bg-[#150719] text-white border-t border-white/10 pt-16 pb-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Pre-Footer CTA Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-[#9F3DA8] to-[#3A153E] p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
              <div className="max-w-2xl">
                <p className="font-mono text-xs uppercase tracking-wider text-purple-200 font-bold mb-2">Ready to modernize your phone lines?</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Build your AI voice agent today.
                </h2>
                <p className="mt-3 text-sm text-purple-100/90 leading-relaxed">
                  Building intelligent voice experiences that help businesses create better conversations, automate meaningful work, and connect people with outcomes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <a href="mailto:hello@vozon.ai" className="zippee-btn-secondary bg-white text-[#9F3DA8] border-white hover:bg-purple-50">
                  hello@vozon.ai
                </a>
                <Link href="/dashboard" className="zippee-btn-primary bg-[#150719] text-white hover:bg-black shadow-lg">
                  <span>Try for Free</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/contact" className="zippee-btn-secondary text-white border-white/40 hover:bg-white/10">
                  <span>Get a Demo</span>
                </Link>
              </div>
            </div>

            {/* Footer Navigation Columns */}
            <div className="grid gap-10 border-b border-white/10 pb-16 sm:grid-cols-2 lg:grid-cols-5">
              {/* Column 1: Brand & Socials */}
              <div className="lg:col-span-1">
                <span className="flex items-center gap-2 text-2xl font-extrabold text-white">
                  <span className="size-7 rounded-lg bg-[#9F3DA8] text-white font-mono text-xs font-black grid place-items-center">
                    V
                  </span>
                  Vozon<span className="text-[#9F3DA8]">.</span>
                </span>
                <p className="mt-4 text-xs leading-relaxed text-purple-200/70">
                  Building intelligent voice experiences that help businesses create better conversations, automate meaningful work, and connect people with outcomes.
                </p>

                {/* Social links */}
                <div className="mt-6 flex items-center gap-2">
                  <a aria-label="Twitter / X" href="https://x.com/vozonai_" rel="noreferrer" target="_blank" className="size-8 rounded-full border border-white/20 text-white/80 grid place-items-center hover:border-[#9F3DA8] hover:text-[#9F3DA8] transition-colors text-xs font-bold">
                    <span>X</span>
                  </a>
                  <a aria-label="LinkedIn" href="https://linkedin.com/company/vozon-ai-india/" rel="noreferrer" target="_blank" className="size-8 rounded-full border border-white/20 text-white/80 grid place-items-center hover:border-[#9F3DA8] hover:text-[#9F3DA8] transition-colors text-xs font-bold">
                    <span>in</span>
                  </a>
                  <a aria-label="Instagram" href="https://www.instagram.com/vozonai" target="_blank" rel="noreferrer" className="size-8 rounded-full border border-white/20 text-white/80 grid place-items-center hover:border-[#9F3DA8] hover:text-[#9F3DA8] transition-colors text-xs">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="2" />
                      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
                    </svg>
                  </a>
                  <a aria-label="Call +91 78925 18414" href="tel:+917892518414" className="size-8 rounded-full border border-white/20 text-white/80 grid place-items-center hover:border-[#9F3DA8] hover:text-[#9F3DA8] transition-colors text-xs">
                    <span>☎</span>
                  </a>
                  <a aria-label="Email hello@vozon.ai" href="mailto:hello@vozon.ai" className="size-8 rounded-full border border-white/20 text-white/80 grid place-items-center hover:border-[#9F3DA8] hover:text-[#9F3DA8] transition-colors text-xs">
                    <span>✉</span>
                  </a>
                </div>
              </div>

              {/* Column 2: Product */}
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#9F3DA8] font-bold">Product</span>
                <ul className="mt-4 space-y-2 text-xs text-purple-200/80">
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

              {/* Column 3: Resources */}
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#9F3DA8] font-bold">Resources</span>
                <ul className="mt-4 space-y-2 text-xs text-purple-200/80">
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
                <span className="font-mono text-xs uppercase tracking-wider text-[#9F3DA8] font-bold">Company</span>
                <ul className="mt-4 space-y-2 text-xs text-purple-200/80">
                  <li><Link href="/career" className="hover:text-white transition-colors">We&apos;re hiring</Link></li>
                  <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/resources/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact us</Link></li>
                </ul>

                <span className="font-mono text-xs uppercase tracking-wider text-[#9F3DA8] font-bold block mt-6">Solutions</span>
                <ul className="mt-4 space-y-2 text-xs text-purple-200/80">
                  <li><Link href="/solutions/banking" className="hover:text-white transition-colors">Banking &amp; Collections</Link></li>
                  <li><Link href="/solutions/healthcare" className="hover:text-white transition-colors">Healthcare Intake</Link></li>
                  <li><Link href="/solutions/hospitality" className="hover:text-white transition-colors">Hospitality Concierge</Link></li>
                  <li><Link href="/solutions/education" className="hover:text-white transition-colors">EdTech Qualification</Link></li>
                  <li><Link href="/solutions/b2b" className="hover:text-white transition-colors">B2B Logistics</Link></li>
                </ul>
              </div>

              {/* Column 5: Contact US & Global Offices */}
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#9F3DA8] font-bold">Contact US</span>
                <ul className="mt-4 space-y-2 text-xs text-purple-200/80">
                  <li><a href="mailto:hello@vozon.ai" className="hover:text-white transition-colors">hello@vozon.ai</a></li>
                  <li><a href="tel:+917892518414" className="hover:text-white transition-colors">+91 78925 18414</a></li>
                  <li><Link href="/contact#office-locations" className="hover:text-white transition-colors">Our Office Locations</Link></li>
                  <li><Link href="/contact" className="font-bold text-[#c084fc] hover:text-white transition-colors">Book a free demo &rarr;</Link></li>
                </ul>

                <span className="font-mono text-xs uppercase tracking-wider text-[#9F3DA8] font-bold block mt-6">Global Offices</span>
                <div className="mt-3 space-y-2 font-mono text-xs text-purple-200/80">
                  <div>
                    <div className="flex items-center justify-between">
                      <b className="text-white">Noida (HQ)</b>
                      <span className="text-emerald-400 font-bold">{clocks.noida}</span>
                    </div>
                    <span className="text-[11px] text-purple-300/60">A-135, Sector 63, UP</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <b className="text-white">Bangalore</b>
                      <span className="text-emerald-400 font-bold">{clocks.bangalore}</span>
                    </div>
                    <span className="text-[11px] text-purple-300/60">HSR Layout, Karnataka</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <b className="text-white">London</b>
                      <span className="text-emerald-400 font-bold">{clocks.london}</span>
                    </div>
                    <span className="text-[11px] text-purple-300/60">EC2A 4NE, UK</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <b className="text-white">New York</b>
                      <span className="text-emerald-400 font-bold">{clocks.newyork}</span>
                    </div>
                    <span className="text-[11px] text-purple-300/60">Madison Ave, NY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Tags Ribbon (All 20+ Original Tags Preserved) */}
            <div className="border-b border-white/10 py-8">
              <span className="font-mono text-xs uppercase tracking-wider text-purple-300/60 font-semibold block mb-4">Focus Areas &amp; Capabilities</span>
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-purple-200/80 hover:border-[#9F3DA8] hover:text-white transition-colors"
                  >
                    <i className="not-italic text-[#c084fc] font-bold">{tag.icon}</i>
                    <span>{tag.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 font-mono text-xs text-purple-300/60 sm:flex-row">
              <p>&copy; {new Date().getFullYear()} Vozon AI Inc. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/resources/trust-center" className="hover:text-white transition-colors">Trust Center</Link>
                <a href="#main" className="hover:text-[#c084fc] transition-colors">Back to top &uarr;</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default HomeDesignFour;