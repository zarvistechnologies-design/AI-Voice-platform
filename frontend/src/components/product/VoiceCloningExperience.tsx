"use client";

import { useState } from "react";
import "./VoiceCloningExperience.css";

interface VoiceScenario {
  label: string;
  purpose: string;
  fileName: string;
  fileSize: string;
  fileDuration: string;
  sampleRate: string;
  voiceName: string;
  voiceRole: string;
  styles: string[];
  languages: string[];
  consentStatus: string;
  engineStatus: string;
  timbreMatch: string;
  latency: string;
  retention: string;
  speechTranscript: string;
  audioSampleDuration: string;
  targetAgents: string;
}

const scenarios: VoiceScenario[] = [
  {
    label: "Brand welcome",
    purpose: "Consistent corporate voice across every greeting",
    fileName: "ananya_brand_master_48khz.wav",
    fileSize: "4.2 MB",
    fileDuration: "0:48s",
    sampleRate: "48kHz Studio Master",
    voiceName: "Ananya Kapoor",
    voiceRole: "Executive Brand Voice",
    styles: ["Warm & Welcoming", "Executive Tone", "High Cadence"],
    languages: ["English (US/UK)", "Hindi (Fluent)"],
    consentStatus: "Biometric Speaker Consent Verified",
    engineStatus: "Zero-Shot Acoustic Embeddings",
    timbreMatch: "99.4%",
    latency: "88ms",
    retention: "99.2%",
    speechTranscript:
      "“Good morning, and welcome to Vozon Health. How may I assist your booking or specialist inquiry today?”",
    audioSampleDuration: "0:04 / 0:48",
    targetAgents: "Assigned to Inbound Welcome Desk",
  },
  {
    label: "Customer care",
    purpose: "Empathetic, clear delivery for high-volume support",
    fileName: "rohan_support_calm_raw.wav",
    fileSize: "3.8 MB",
    fileDuration: "0:42s",
    sampleRate: "48kHz Lossless FLAC",
    voiceName: "Rohan Mehta",
    voiceRole: "Patient Support Specialist",
    styles: ["Empathetic", "Calm Pacing", "Zero Rush"],
    languages: ["English", "Hindi", "Marathi"],
    consentStatus: "Enterprise Voice License Verified",
    engineStatus: "Phonetic SKU Lexicon Locked",
    timbreMatch: "99.1%",
    latency: "92ms",
    retention: "98.9%",
    speechTranscript:
      "“Hi! I have your order #2048 open. Your courier is dispatched and scheduled between 2:00 PM and 4:00 PM today.”",
    audioSampleDuration: "0:05 / 0:42",
    targetAgents: "Deployed on 24/7 Support Queue",
  },
  {
    label: "Multilingual reach",
    purpose: "One recognizable voice across global & regional languages",
    fileName: "priya_global_indic_sample.wav",
    fileSize: "5.1 MB",
    fileDuration: "1:02s",
    sampleRate: "48kHz Studio Stereo",
    voiceName: "Priya Sharma",
    voiceRole: "Multilingual Omnichannel Voice",
    styles: ["Natural Cadence", "Regional Dialect", "Friendly"],
    languages: ["English", "Hindi", "Tamil", "Bengali"],
    consentStatus: "Legal Actor Waiver on File",
    engineStatus: "Zero-Loss Prosody Retention",
    timbreMatch: "98.9%",
    latency: "94ms",
    retention: "99.5%",
    speechTranscript:
      "“नमस्ते, वोज़ोन सहायता केंद्र में आपका स्वागत है। क्या मैं आपकी कल की अपॉइंटमेंट कन्फर्म कर दूँ?”",
    audioSampleDuration: "0:06 / 1:02",
    targetAgents: "Active Across 8 Regional Lines",
  },
  {
    label: "Appointment reminders",
    purpose: "Authoritative yet reassuring voice for proactive follow-ups",
    fileName: "vikram_warm_advisory.wav",
    fileSize: "3.4 MB",
    fileDuration: "0:36s",
    sampleRate: "48kHz Studio Mono",
    voiceName: "Vikram Malhotra",
    voiceRole: "Senior Advisory Concierge",
    styles: ["Authoritative", "Reassuring", "Clear Articulation"],
    languages: ["English (Global)", "Hindi"],
    consentStatus: "Biometric Speaker Consent Verified",
    engineStatus: "Low-Latency Turn Synthesis",
    timbreMatch: "98.7%",
    latency: "86ms",
    retention: "99.1%",
    speechTranscript:
      "“Hello Vikram, quick reminder for your portfolio consultation tomorrow at 11:00 AM. I have sent the details to your WhatsApp.”",
    audioSampleDuration: "0:05 / 0:36",
    targetAgents: "Assigned to Outbound Care Campaigns",
  },
];

const EQUALIZER_BARS = [
  35, 60, 80, 45, 90, 100, 65, 50, 85, 95, 70, 55, 75, 60, 95, 85, 45, 60, 90, 75, 55, 85, 98, 70, 50, 40, 65, 80,
  90, 65, 45, 70, 85, 90, 60, 75, 50, 35,
];

export function VoiceCloningExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const scenario = scenarios[activeIndex];

  return (
    <div className="vc-experience is-laptop-layout" aria-label="Interactive Voice Cloning Studio Experience">
      <div className="vc-hero-intro">
        <span>VOZON / VOICE CLONING</span>
        <h1>Upload master audio. Name your voice. Deploy in seconds.</h1>
      </div>

      {/* Scenario Selector on Left */}
      <div className="vc-industries" role="group" aria-label="Choose a cloned voice example">
        {scenarios.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={activeIndex === index}
            className={activeIndex === index ? "is-active" : ""}
            onClick={() => {
              setActiveIndex(index);
              setIsPlaying(false);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Elegant, Non-Boxy Studio Surface */}
      <div className="vcl-studio-board" key={`studio-${scenario.label}`}>
        {/* Clean Pipeline Steps Header */}
        <div className="vcl-pipeline-steps" aria-hidden="true">
          <div className="vcl-pipe-step is-active">
            <span className="vcl-pipe-num">1</span>
            <span>Upload Master Audio</span>
          </div>
          <span className="vcl-pipe-arrow">➔</span>
          <div className="vcl-pipe-step is-active">
            <span className="vcl-pipe-num">2</span>
            <span>Name &amp; Voice Profile</span>
          </div>
          <span className="vcl-pipe-arrow">➔</span>
          <div className="vcl-pipe-step is-active">
            <span className="vcl-pipe-num">3</span>
            <span>Neural Acoustic Synthesis</span>
          </div>
          <span className="vcl-pipe-arrow">➔</span>
          <div className="vcl-pipe-step is-active">
            <span className="vcl-pipe-num">4</span>
            <span>Live Agent Sync</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="vcl-studio-grid">
          {/* Left: Audio Source & Identity */}
          <div className="vcl-identity-col">
            <div>
              <span className="vcl-section-eyebrow">01 · Reference Audio</span>
              <div className="vcl-source-strip">
                <div className="vcl-source-info">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                  <div>
                    <strong>{scenario.fileName}</strong>
                    <small>{scenario.fileSize} · {scenario.fileDuration} · {scenario.sampleRate}</small>
                  </div>
                </div>
                <span className="vcl-source-tag">✓ De-noised</span>
              </div>
            </div>

            <div className="vcl-persona-block">
              <span className="vcl-section-eyebrow">02 · Voice Persona &amp; Tone</span>
              <h3 className="vcl-persona-title">{scenario.voiceName}</h3>
              <p className="vcl-persona-subtitle">{scenario.voiceRole}</p>
              
              <div className="vcl-pills-row">
                {scenario.styles.map((style, i) => (
                  <span key={i} className={`vcl-simple-pill ${i === 0 ? "is-primary" : ""}`}>
                    {style}
                  </span>
                ))}
                {scenario.languages.map((lang, i) => (
                  <span key={`lang-${i}`} className="vcl-simple-pill">
                    🌐 {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="vcl-consent-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>{scenario.consentStatus}</span>
            </div>
          </div>

          {/* Right: Audio Player & Destination */}
          <div className="vcl-player-col">
            <span className="vcl-section-eyebrow">03 · Instant Acoustic Clone</span>
            
            {/* Sleek Dark Console */}
            <div className="vcl-dark-console">
              <div className="vcl-console-top">
                <div className="vcl-console-status">
                  <i />
                  <span>SYNTHESIZER READY</span>
                </div>
                <span className="vcl-console-engine">{scenario.engineStatus}</span>
              </div>

              {/* Live soundwave */}
              <div className="vcl-console-wave">
                {EQUALIZER_BARS.map((baseH, i) => (
                  <div
                    key={i}
                    className="vcl-wave-bar"
                    style={{
                      height: `${baseH}%`,
                      animationDelay: `${(i % 10) * 0.09}s`,
                      animationPlayState: isPlaying ? "running" : "paused",
                      opacity: isPlaying ? 1 : 0.6,
                    }}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="vcl-console-controls">
                <button
                  type="button"
                  className="vcl-console-play-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? "Pause audio sample" : "Play cloned audio sample"}
                >
                  {isPlaying ? (
                    <>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>Play Voice Sample</span>
                    </>
                  )}
                </button>
                <span className="vcl-console-timer">
                  {isPlaying ? "0:12 / 0:48" : scenario.audioSampleDuration}
                </span>
              </div>
            </div>

            {/* Spoken Quote */}
            <p className="vcl-speech-quote">{scenario.speechTranscript}</p>

            {/* Clean Inline Stats */}
            <div className="vcl-inline-metrics">
              <div className="vcl-inline-stat">
                <small>Timbre Match</small>
                <strong>{scenario.timbreMatch}</strong>
              </div>
              <div className="vcl-inline-stat">
                <small>Latency</small>
                <strong style={{ color: "#059669" }}>{scenario.latency}</strong>
              </div>
              <div className="vcl-inline-stat">
                <small>Cross-Lingual</small>
                <strong style={{ color: "#2563eb" }}>{scenario.retention}</strong>
              </div>
            </div>

            {/* Target Strip */}
            <div className="vcl-target-strip">
              <div className="vcl-target-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{scenario.targetAgents}</span>
              </div>
              <a href="/contact" className="vcl-deploy-link">
                Deploy Voice &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
