"use client";

import { useRef, useState } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useHomepageVoiceCall } from "@/components/sections/useHomepageVoiceCall";
import styles from "./HomeDesignFour.module.css";
import "./HomeDesignFourGrid.css";
import "./HomeDesignFourHero.css";
import "./HomeDesignFourEnding.css";
import "./AgentVoiceLandingHero.css";
import { LeadConversionSection } from "./LeadConversionSection";
import { WorkflowCanvasSection } from "./WorkflowCanvasSection";
import { AgentUseCasesSection } from "./AgentUseCasesSection";
import { IntegrationsShowcaseSection } from "./IntegrationsShowcaseSection";
import { PrivacyAssuranceSection } from "./PrivacyAssuranceSection";
import { GlobalVoicesMapSection } from "./GlobalVoicesMapSection";
import { HomeFaqSection } from "./HomeFaqSection";
import { EnterpriseScaleSection } from "./EnterpriseScaleSection";

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

export function HomeDesignFour() {
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [introVideoPlaying, setIntroVideoPlaying] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const voiceCall = useHomepageVoiceCall();
  const selectedVoice = voiceLanguages[activeLanguage];

  const isEngaged = voiceCall.active || voiceCall.busy;

  return (
    <div className={`${styles.page} home-design-four`}>
      <SiteHeader />

      <main>
        <section className={`${styles.hero} home-design-four__hero agentvoice-hero`}>
          <div className="agentvoice-hero-content">
            <div className="agentvoice-channel-kicker">ONE AI PLATFORM · EVERY CHANNEL</div>
            <h1>AI agents that turn<br />conversations into outcomes</h1>
            <p>Qualify more leads and resolve support requests across voice, WhatsApp, text messages, and web chat—with every conversation moving your business forward.</p>
            <div className="agentvoice-demo-control">
              <label className="agentvoice-demo-language"><span aria-hidden="true">🇮🇳</span><select aria-label="Choose demo voice language" onChange={(event) => setActiveLanguage(Number(event.target.value))} value={activeLanguage}>{voiceLanguages.map((language, index) => <option key={language.language} value={index}>{language.language}</option>)}</select></label>
              <button aria-label={isEngaged ? "End demo call" : `Try a ${selectedVoice.language} voice agent`} className={`agentvoice-try-button${isEngaged ? " is-active" : ""}`} disabled={!voiceCall.ready && !isEngaged} onClick={() => isEngaged ? voiceCall.disconnect() : void voiceCall.start(selectedVoice.language)} type="button"><span aria-hidden="true">{isEngaged ? "■" : "☎"}</span>{isEngaged ? "End call" : voiceCall.busy ? "Connecting…" : "Try an agent"}</button>
            </div>
            <span aria-live="polite" className="agentvoice-demo-status">{voiceCall.active ? `Live demo · ${voiceCall.speakingLanguage || selectedVoice.language}` : voiceCall.busy ? "Connecting to your demo agent…" : "Choose a voice and try a live demo"}</span>
          </div>
          <div aria-hidden="true" className="agentvoice-wave">{[100, 72, 54, 42, 36, 42, 54, 72, 100].map((height, index) => <span key={index} style={{ "--wave-height": `${height}%` } as React.CSSProperties} />)}</div>
        </section>

        <AgentUseCasesSection />

        <section aria-label="Vozon AI introduction video" className="vozon-intro-video">
          <div className="vozon-intro-video-stage">
            <div className="vozon-intro-video-card">
              <video aria-label="Vozon AI voice agent introduction" controls onPause={() => setIntroVideoPlaying(false)} onPlay={() => setIntroVideoPlaying(true)} playsInline preload="metadata" ref={introVideoRef}>
                <source src="/videos/vozon-ai-intro.mp4?v=6" type="video/mp4" />
                Your browser does not support embedded video.
              </video>
              {!introVideoPlaying ? <button aria-label="Play Vozon introduction video" className="vozon-intro-video-play" onClick={() => void introVideoRef.current?.play()} type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m8 5 12 7-12 7V5Z" /></svg></button> : null}
              <div className="vozon-intro-video-watermark" aria-hidden="true">Vozon <span>AI</span></div>
            </div>
          </div>
        </section>

        <LeadConversionSection />
        <WorkflowCanvasSection />
        <IntegrationsShowcaseSection />
        <PrivacyAssuranceSection />
        <EnterpriseScaleSection />
        <GlobalVoicesMapSection />
        <HomeFaqSection />
      </main>

      <SiteFooter />
    </div>
  );
}
