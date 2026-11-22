"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FooterSoundWave } from "@/components/layout/FooterSoundWave";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useHomepageVoiceCall } from "@/components/sections/useHomepageVoiceCall";
import { API_URL } from "@/lib/apiBase";
import styles from "./HomeDesignFour.module.css";
import "./HomeDesignFourGrid.css";
import "./HomeDesignFourHero.css";
import "./HomeDesignFourEnding.css";
import "./AgentVoiceLandingHero.css";
import { WorkflowCanvasSection } from "./WorkflowCanvasSection";
import { IndustryShowcaseSection } from "./IndustryShowcaseSection";
import { ConversationInsightsSection } from "./ConversationInsightsSection";
import { AgentUseCasesSection } from "./AgentUseCasesSection";
import { IntegrationsShowcaseSection } from "./IntegrationsShowcaseSection";
import { PrivacyAssuranceSection } from "./PrivacyAssuranceSection";
import { GlobalVoicesMapSection } from "./GlobalVoicesMapSection";
import { HomeFaqSection } from "./HomeFaqSection";
import { EnterpriseScaleSection } from "./EnterpriseScaleSection";
import { PlatformComparisonSection } from "./PlatformComparisonSection";
import { TalkToAgentWidget } from "./TalkToAgentWidget";

const voiceLanguages = [
  { label: "English", language: "English", voice: "English", detail: "Global voice" },
  { label: "हिन्दी", language: "Hindi", voice: "Hindi", detail: "हिन्दी voice" },
  { label: "ગુજરાતી", language: "Gujarati", voice: "Gujarati", detail: "ગુજરાતી voice" },
  { label: "ಕನ್ನಡ", language: "Kannada", voice: "Kannada", detail: "ಕನ್ನಡ voice" },
  { label: "বাংলা", language: "Bengali", voice: "Bengali", detail: "বাংলা voice" },
  { label: "मराठी", language: "Marathi", voice: "Marathi", detail: "मराठी voice" },
  { label: "தமிழ்", language: "Tamil", voice: "Tamil", detail: "தமிழ் voice" },
  { label: "తెలుగు", language: "Telugu", voice: "Telugu", detail: "తెలుగు voice" },
  { label: "മലയാളം", language: "Malayalam", voice: "Malayalam", detail: "മലയാളം voice" },
  { label: "ਪੰਜਾਬੀ", language: "Punjabi", voice: "Punjabi", detail: "ਪੰਜਾਬੀ voice" },
  { label: "ଓଡ଼ିଆ", language: "Odia", voice: "Odia", detail: "ଓଡ଼ିଆ voice" },
  { label: "অসমীয়া", language: "Assamese", voice: "Assamese", detail: "অসমীয়া voice" },
] as const;

const demoScenarios = [
  { id: "vozon-general", label: "Vozon AI Representative" },
  { id: "real_estate", label: "Real Estate" },
  { id: "car_dealership", label: "Car Dealership" },
  { id: "hotel_reservation", label: "Hotel Reservation" },
  { id: "restaurant", label: "Restaurant" },
  { id: "school_admission", label: "School Admission" },
  { id: "school_franchise", label: "School Franchise" },
] as const;

export function HomeDesignFour() {
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [introVideoPlaying, setIntroVideoPlaying] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>("vozon-general");
  const [callerName, setCallerName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [callingPhone, setCallingPhone] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const voiceCall = useHomepageVoiceCall();
  const selectedVoice = voiceLanguages[activeLanguage];

  const isEngaged = voiceCall.active || voiceCall.busy;

  async function handleInstantPhoneCall(event: React.FormEvent) {
    event.preventDefault();
    const cleaned = phoneInput.trim();
    if (!cleaned || cleaned.replace(/\D/g, "").length < 8) {
      setPhoneError("Enter a valid phone number with country code (e.g. +91 9876543210).");
      setPhoneStatus("");
      return;
    }

    setCallingPhone(true);
    setPhoneError("");
    setPhoneStatus(`Calling ${cleaned} now…`);

    try {
      const response = await fetch(`${API_URL}/api/public/demo/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: callerName.trim() || undefined,
          phoneNumber: cleaned,
          language: selectedVoice.language,
          scenarioId: selectedScenario,
        }),
      });
      const data = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Could not start the call right now.");
      }
      setPhoneStatus(data?.message || `Calling ${cleaned} now! Pick up to talk with your Vozon AI agent.`);
    } catch (err) {
      setPhoneStatus("");
      setPhoneError(err instanceof Error ? err.message : "Could not place the call. Please check the number and try again.");
    } finally {
      setCallingPhone(false);
    }
  }

  return (
    <div className={`${styles.page} home-design-four`}>
      <SiteHeader />

      <main>
        <section className={`${styles.hero} home-design-four__hero agentvoice-hero`}>
          <div className="agentvoice-hero-content">
            <div className="agentvoice-channel-kicker">MULTICHANNEL AGENTIC PLATFORM</div>
            <h1>One Autonomous Brain<br />for Voice &amp; WhatsApp.</h1>
            <p>Deploy agentic workflows that call leads, chat in real time, and close every loop across both channels automatically.</p>
            <div className="agentvoice-demo-control">
              <label className="agentvoice-demo-language"><span aria-hidden="true">🇮🇳</span><select aria-label="Choose demo voice language" onChange={(event) => setActiveLanguage(Number(event.target.value))} value={activeLanguage}>{voiceLanguages.map((language, index) => <option key={language.language} value={index}>{language.language}</option>)}</select></label>
              <button aria-label={isEngaged ? "End demo call" : `Try a ${selectedVoice.language} voice agent`} className={`agentvoice-try-button${isEngaged ? " is-active" : ""}`} disabled={!voiceCall.ready && !isEngaged} onClick={() => isEngaged ? voiceCall.disconnect() : void voiceCall.start(selectedVoice.language)} type="button"><span aria-hidden="true">{isEngaged ? "■" : "☎"}</span>{isEngaged ? "End call" : voiceCall.busy ? "Connecting…" : "Try voice demo"}</button>
            </div>
            <span aria-live="polite" className="agentvoice-demo-status">
              {voiceCall.active ? `Live voice call · ${voiceCall.speakingLanguage || selectedVoice.language}` : voiceCall.busy ? "Connecting to your voice agent…" : "Try a live voice call above, or click Try a live call on the left"}
            </span>
          </div>
          <FooterSoundWave variant="hero" />
          <div aria-hidden="true" className="agentvoice-hero-tags">
            <span><i><Image alt="" src="/images/integrations/google-calendar.svg" width={21} height={21} /></i><b>Google Calendar</b></span>
            <span><i><Image alt="" src="/images/integrations/whatsapp.svg" width={21} height={21} /></i><b>WhatsApp</b></span>
            <span><i><Image alt="" src="/images/integrations/gmail.svg" width={21} height={21} /></i><b>Gmail</b></span>
            <span><i><Image alt="" src="/images/integrations/salesforce.svg" width={21} height={21} /></i><b>Salesforce</b></span>
            <span><i><Image alt="" src="/images/integrations/slack.svg" width={21} height={21} /></i><b>Slack</b></span>
            <span><i><Image alt="" src="/images/integrations/claude.svg" width={21} height={21} /></i><b>Claude</b></span>
          </div>
        </section>

        <AgentUseCasesSection />
        <WorkflowCanvasSection />

        <section aria-label="Vozon AI introduction video" className="vozon-intro-video">
          <div className="vozon-intro-video-stage">
            <div className="vozon-intro-video-header">
              <span className="vozon-intro-eyebrow"><i aria-hidden="true" /> PLATFORM DEMO</span>
              <h2>See Vozon in action.</h2>
              <p>Watch how autonomous voice and WhatsApp agents converse, trigger tools, and sync outcomes in real time.</p>
            </div>
            <div className="vozon-intro-video-card">
              <video
                aria-label="Vozon AI platform introduction"
                controls
                onPause={() => setIntroVideoPlaying(false)}
                onPlay={() => setIntroVideoPlaying(true)}
                playsInline
                preload="metadata"
                ref={introVideoRef}
              >
                <source src="/videos/vozon-home-intro.mp4" type="video/mp4" />
                Your browser does not support embedded video.
              </video>
              {!introVideoPlaying ? (
                <button
                  aria-label="Play Vozon introduction video"
                  className="vozon-intro-video-play"
                  onClick={() => void introVideoRef.current?.play()}
                  type="button"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="m8 5 12 7-12 7V5Z" />
                  </svg>
                </button>
              ) : null}
              <div className="vozon-intro-video-watermark" aria-hidden="true">
                Vozon <span>AI</span>
              </div>
            </div>
          </div>
        </section>

        <IndustryShowcaseSection />
        <ConversationInsightsSection />
        <IntegrationsShowcaseSection />
        <PrivacyAssuranceSection />
        <EnterpriseScaleSection />
        <PlatformComparisonSection />
        <GlobalVoicesMapSection />
        <HomeFaqSection />
      </main>

      <SiteFooter />

      <button
        aria-label="Try a live phone call with Vozon AI"
        className="vozon-live-call-fab"
        onClick={() => setCallModalOpen(true)}
        type="button"
      >
        <span className="vozon-live-call-fab-dot" aria-hidden="true" />
        <span>Try a live call</span>
      </button>

      {callModalOpen ? (
        <div
          aria-modal="true"
          className="agentvoice-call-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCallModalOpen(false);
          }}
          role="dialog"
          aria-label="Try a live phone call"
        >
          <div className="vozon-talk-popup">
            <button
              aria-label="Close live call popup"
              className="vozon-talk-popup-close"
              onClick={() => setCallModalOpen(false)}
              type="button"
            >
              ×
            </button>
            <TalkToAgentWidget variant="card" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
