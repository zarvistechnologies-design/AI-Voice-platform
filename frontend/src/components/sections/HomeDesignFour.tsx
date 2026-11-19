"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FooterSoundWave } from "@/components/layout/FooterSoundWave";
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
import { ConversationInsightsSection } from "./ConversationInsightsSection";
import { AgentUseCasesSection } from "./AgentUseCasesSection";
import { IntegrationsShowcaseSection } from "./IntegrationsShowcaseSection";
import { PrivacyAssuranceSection } from "./PrivacyAssuranceSection";
import { GlobalVoicesMapSection } from "./GlobalVoicesMapSection";
import { HomeFaqSection } from "./HomeFaqSection";
import { EnterpriseScaleSection } from "./EnterpriseScaleSection";
import { PlatformComparisonSection } from "./PlatformComparisonSection";

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
            <div className="agentvoice-channel-kicker">MULTICHANNEL AGENTIC PLATFORM</div>
            <h1>One agentic core<br />built to act</h1>
            <p>Autonomous agents for voice calls, WhatsApp, and web chat—built to reason, call tools, and complete workflows.</p>
            <div className="agentvoice-demo-control">
              <label className="agentvoice-demo-language"><span aria-hidden="true">🇮🇳</span><select aria-label="Choose demo voice language" onChange={(event) => setActiveLanguage(Number(event.target.value))} value={activeLanguage}>{voiceLanguages.map((language, index) => <option key={language.language} value={index}>{language.language}</option>)}</select></label>
              <button aria-label={isEngaged ? "End demo call" : `Try a ${selectedVoice.language} voice agent`} className={`agentvoice-try-button${isEngaged ? " is-active" : ""}`} disabled={!voiceCall.ready && !isEngaged} onClick={() => isEngaged ? voiceCall.disconnect() : void voiceCall.start(selectedVoice.language)} type="button"><span aria-hidden="true">{isEngaged ? "■" : "☎"}</span>{isEngaged ? "End call" : voiceCall.busy ? "Connecting…" : "Try voice demo"}</button>
            </div>
            <span aria-live="polite" className="agentvoice-demo-status">{voiceCall.active ? `Live voice call · ${voiceCall.speakingLanguage || selectedVoice.language}` : voiceCall.busy ? "Connecting to your voice agent…" : "Try a live voice call above, then explore Voice, WhatsApp & workflows below"}</span>
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
        <LeadConversionSection />

        <section aria-label="Vozon AI introduction video" className="vozon-intro-video">
          <div className="vozon-intro-video-stage">
            <div className="vozon-intro-video-card">
              <video aria-label="Vozon AI platform introduction" controls onPause={() => setIntroVideoPlaying(false)} onPlay={() => setIntroVideoPlaying(true)} playsInline preload="metadata" ref={introVideoRef}>
                <source src="/videos/vozon-home-intro.mp4" type="video/mp4" />
                Your browser does not support embedded video.
              </video>
              {!introVideoPlaying ? <button aria-label="Play Vozon introduction video" className="vozon-intro-video-play" onClick={() => void introVideoRef.current?.play()} type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m8 5 12 7-12 7V5Z" /></svg></button> : null}
              <div className="vozon-intro-video-watermark" aria-hidden="true">Vozon <span>AI</span></div>
            </div>
          </div>
        </section>

        <ConversationInsightsSection />
        <WorkflowCanvasSection />
        <IntegrationsShowcaseSection />
        <PrivacyAssuranceSection />
        <EnterpriseScaleSection />
        <PlatformComparisonSection />
        <GlobalVoicesMapSection />
        <HomeFaqSection />
      </main>

      <SiteFooter />
    </div>
  );
}
