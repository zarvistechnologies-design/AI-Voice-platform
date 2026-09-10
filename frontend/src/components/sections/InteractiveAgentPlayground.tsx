"use client";

import { useState } from "react";
import styles from "./InteractiveAgentPlayground.module.css";

interface Scenario {
  id: string;
  title: string;
  category: string;
  userPrompt: string;
  agentResponse: string;
  toolExecuted: string;
  toolResult: string;
  latencyMs: number;
}

const scenarios: Scenario[] = [
  {
    id: "appointment",
    title: "Healthcare Booking",
    category: "Hospital & Clinic",
    userPrompt: "Hi, I need an urgent consultation with Dr. Mehta for fever tomorrow evening.",
    agentResponse: "Namaste! Dr. Mehta has an opening tomorrow at 5:15 PM at Indiranagar branch. I have reserved your slot and sent the booking token to your SMS.",
    toolExecuted: "calendar.check_availability({ doctor: 'Dr. Mehta', date: 'tomorrow' })",
    toolResult: "SLOT_RESERVED: 17:15_IST #APT-9821",
    latencyMs: 375,
  },
  {
    id: "banking",
    title: "Instant Loan KYC",
    category: "Fintech & Banking",
    userPrompt: "Is my business loan application for 10 Lakhs approved?",
    agentResponse: "Checking your application status right now. Yes, Mr. Sharma, your ₹10,00,000 working capital loan is approved at 10.5% ROI! Would you like me to dispatch the e-agreement link to WhatsApp?",
    toolExecuted: "core_banking.query_application({ app_id: 'LN-7740', pan_auth: true })",
    toolResult: "STATUS_APPROVED: DISBURSAL_READY",
    latencyMs: 340,
  },
  {
    id: "dining",
    title: "VIP Restaurant Table",
    category: "Hospitality & Dining",
    userPrompt: "Can I reserve a quiet booth for 4 people tonight at 8:30 PM?",
    agentResponse: "Absolutely! I have locked in Table #12 in our private balcony dining area for 4 guests tonight at 8:30 PM under your name. Looking forward to hosting you!",
    toolExecuted: "pos.reserve_table({ guests: 4, time: '20:30', section: 'balcony_vip' })",
    toolResult: "TABLE_CONFIRMED: RES_8832",
    latencyMs: 390,
  },
  {
    id: "logistics",
    title: "Real-Time Tracking",
    category: "E-Commerce Logistics",
    userPrompt: "Where is my parcel #TRK-9023?",
    agentResponse: "Your parcel is currently out for delivery with our courier partner in Mumbai Central. The delivery executive will arrive before 2:30 PM today.",
    toolExecuted: "shipment.live_gps_telemetry({ tracking_id: 'TRK-9023' })",
    toolResult: "OUT_FOR_DELIVERY: ETA_14:30",
    latencyMs: 310,
  },
];

export function InteractiveAgentPlayground() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3.1-flash");
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [speechActive, setSpeechActive] = useState<boolean>(false);

  const handleRunSimulation = (sc: Scenario) => {
    setSelectedScenario(sc);
    setIsSimulating(true);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeechActive(true);
      const utterance = new SpeechSynthesisUtterance(sc.agentResponse);
      utterance.rate = voiceSpeed;
      utterance.pitch = 1.05;
      utterance.onend = () => {
        setSpeechActive(false);
        setIsSimulating(false);
      };
      utterance.onerror = () => {
        setSpeechActive(false);
        setIsSimulating(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSimulating(false), 3000);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.badge}>Live Agent Testbench</span>
        <h2>Experience Real-Time Autonomous Tool Execution</h2>
        <p>See how Vozon voice agents seamlessly query APIs, verify databases, and speak answers in sub-400ms.</p>
      </div>

      <div className={styles.playgroundCard}>
        {/* Left: Configuration Sidebar */}
        <div className={styles.configSidebar}>
          <div className={styles.configGroup}>
            <span className={styles.configLabel}>1. Select Realtime Engine</span>
            <div className={styles.modelOptions}>
              <button
                type="button"
                className={`${styles.modelBtn} ${selectedModel === "gemini-3.1-flash" ? styles.modelBtnActive : ""}`}
                onClick={() => setSelectedModel("gemini-3.1-flash")}
              >
                <strong>Gemini 3.1 Flash Live</strong>
                <small>Native Multimodal · 340ms</small>
              </button>
              <button
                type="button"
                className={`${styles.modelBtn} ${selectedModel === "gpt-realtime-2.1" ? styles.modelBtnActive : ""}`}
                onClick={() => setSelectedModel("gpt-realtime-2.1")}
              >
                <strong>OpenAI Realtime 2.1</strong>
                <small>High Expressive Speech · 390ms</small>
              </button>
              <button
                type="button"
                className={`${styles.modelBtn} ${selectedModel === "sarvam-105b" ? styles.modelBtnActive : ""}`}
                onClick={() => setSelectedModel("sarvam-105b")}
              >
                <strong>Sarvam 105B</strong>
                <small>10+ Indian Languages · 380ms</small>
              </button>
            </div>
          </div>

          <div className={styles.configGroup}>
            <div className={styles.sliderHeader}>
              <span className={styles.configLabel}>2. Speech Cadence</span>
              <span className={styles.speedBadge}>{voiceSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.05"
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(Number(e.target.value))}
              className={styles.speedSlider}
            />
            <div className={styles.speedTicks}>
              <span>Deliberate (0.8x)</span>
              <span>Natural (1.0x)</span>
              <span>Fast (1.3x)</span>
            </div>
          </div>

          <div className={styles.configGroup}>
            <span className={styles.configLabel}>3. Test Conversation Scenario</span>
            <div className={styles.scenarioList}>
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  className={`${styles.scenarioItem} ${selectedScenario.id === sc.id ? styles.scenarioActive : ""}`}
                  onClick={() => handleRunSimulation(sc)}
                >
                  <span className={styles.scenarioTitle}>{sc.title}</span>
                  <span className={styles.scenarioCat}>{sc.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Terminal & Audio Stream */}
        <div className={styles.terminalPanel}>
          <div className={styles.terminalHeader}>
            <div className={styles.terminalDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <span className={styles.terminalTitle}>VOZON REALTIME WEBRTC STREAM // LIVE SESSION</span>
            <span className={styles.latencyPill}>⚡ {selectedScenario.latencyMs}ms end-to-end</span>
          </div>

          <div className={styles.dialogueStream}>
            {/* User Message */}
            <div className={styles.chatMessageUser}>
              <div className={styles.messageMeta}>
                <span className={styles.callerIcon}>👤</span>
                <strong>Customer Audio Stream</strong>
              </div>
              <p>&ldquo;{selectedScenario.userPrompt}&rdquo;</p>
            </div>

            {/* Tool Execution Box */}
            <div className={styles.toolExecutionCard}>
              <div className={styles.toolHead}>
                <span className={styles.toolPulse} />
                <strong>Autonomous Function Calling</strong>
                <span className={styles.toolTag}>200 OK</span>
              </div>
              <code className={styles.toolCode}>{selectedScenario.toolExecuted}</code>
              <div className={styles.toolOutput}>
                <span>Output Payload:</span> <code>{selectedScenario.toolResult}</code>
              </div>
            </div>

            {/* AI Agent Spoken Response */}
            <div className={styles.chatMessageAi}>
              <div className={styles.messageMetaAi}>
                <span className={styles.agentIcon}>⚡</span>
                <strong>Vozon Voice Agent</strong>
                {speechActive && <span className={styles.speakingWave}>Transmitting Audio...</span>}
              </div>
              <p>&ldquo;{selectedScenario.agentResponse}&rdquo;</p>
            </div>
          </div>

          {/* Action Footer */}
          <div className={styles.terminalFooter}>
            <button
              type="button"
              className={`${styles.simulateBtn} ${speechActive ? styles.activeSim : ""}`}
              onClick={() => handleRunSimulation(selectedScenario)}
            >
              {speechActive ? "⏸ Playing Synthesized Speech..." : "▶ Trigger Scenario & Speak Response"}
            </button>
            <span className={styles.footerNote}>Zero hallucination • Instant live tool invocation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
