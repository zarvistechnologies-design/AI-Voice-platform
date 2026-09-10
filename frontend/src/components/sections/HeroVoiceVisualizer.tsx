"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroVoiceVisualizer.module.css";

interface Persona {
  id: string;
  name: string;
  role: string;
  language: string;
  model: string;
  sampleText: string;
  sampleAudioPitch: number;
  avatar: string;
  badgeColor: string;
}

const personas: Persona[] = [
  {
    id: "healthcare",
    name: "Dr. Ananya",
    role: "Clinical Appointment Concierge",
    language: "Hindi & English",
    model: "Gemini 3.1 Flash Live",
    sampleText: "Namaste! Main Apollo Clinic se bol rahi hoon. Dr. Sharma kal shaam 4 baje available hain. Kya main aapka appointment confirm kar doon?",
    sampleAudioPitch: 1.1,
    avatar: "👩‍⚕️",
    badgeColor: "#108D82",
  },
  {
    id: "fintech",
    name: "Rahul",
    role: "Instant Loan Verification",
    language: "Hinglish",
    model: "OpenAI Realtime 2.1",
    sampleText: "Hello! Aapka pre-approved ₹5,00,000 loan request verify ho gaya hai. Kya aap Instant KYC process aage badhana chahte hain?",
    sampleAudioPitch: 0.95,
    avatar: "💼",
    badgeColor: "#0284c7",
  },
  {
    id: "hospitality",
    name: "Maya",
    role: "Luxury Hotel & Dining Concierge",
    language: "English (Global)",
    model: "Gemini 3.1 Flash Live",
    sampleText: "Good evening! I've reserved a rooftop sunset table for two tomorrow at 7:30 PM with your preferred seating. Shall I send the pass to WhatsApp?",
    sampleAudioPitch: 1.15,
    avatar: "🏨",
    badgeColor: "#7c3aed",
  },
  {
    id: "ecommerce",
    name: "Vikram",
    role: "Dispatch & Return Assistant",
    language: "Tamil & English",
    model: "Sarvam 105B Conversations",
    sampleText: "Vanakkam! Your package has arrived in Bangalore dispatch hub and is scheduled for priority delivery today by 2 PM.",
    sampleAudioPitch: 0.9,
    avatar: "📦",
    badgeColor: "#ea580c",
  },
];

export function HeroVoiceVisualizer() {
  const [selectedPersona, setSelectedPersona] = useState<Persona>(personas[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeechSnippet, setActiveSpeechSnippet] = useState<string>(personas[0].sampleText);
  const [liveLatency, setLiveLatency] = useState<number>(380);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Animate canvas waves
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let step = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      step += isPlaying ? 0.08 : 0.02;

      // Draw 3 layers of harmonic fluid sound waves
      const layers = isPlaying
        ? [
            { color: "rgba(16, 141, 130, 0.5)", amp: 28, freq: 0.025, speed: 1.2 },
            { color: "rgba(69, 221, 206, 0.7)", amp: 20, freq: 0.035, speed: 1.6 },
            { color: "rgba(14, 165, 233, 0.4)", amp: 35, freq: 0.018, speed: 0.9 },
          ]
        : [
            { color: "rgba(16, 141, 130, 0.25)", amp: 8, freq: 0.015, speed: 0.8 },
            { color: "rgba(69, 221, 206, 0.35)", amp: 6, freq: 0.02, speed: 1 },
            { color: "rgba(14, 165, 233, 0.2)", amp: 10, freq: 0.01, speed: 0.6 },
          ];

      layers.forEach((layer) => {
        ctx.beginPath();
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = isPlaying ? 3 : 2;
        ctx.lineCap = "round";

        for (let x = 0; x < width; x += 3) {
          const y =
            centerY +
            Math.sin(x * layer.freq + step * layer.speed) *
              layer.amp *
              Math.sin((x / width) * Math.PI); // Envelope fade at edges
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  // Handle Play audio preview with Web Speech Synthesis
  const handleTogglePlay = () => {
    if (typeof window === "undefined") return;

    if (isPlaying) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    // Simulate dynamic latency jitter
    setLiveLatency(Math.floor(340 + Math.random() * 80));

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedPersona.sampleText);
      utterance.pitch = selectedPersona.sampleAudioPitch;
      utterance.rate = 1.05;
      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer
      setTimeout(() => setIsPlaying(false), 4500);
    }
  };

  const handleSelectPersona = (persona: Persona) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setSelectedPersona(persona);
    setActiveSpeechSnippet(persona.sampleText);
    setLiveLatency(Math.floor(340 + Math.random() * 80));
  };

  return (
    <div className={styles.container}>
      {/* Persona Tabs */}
      <div className={styles.personaBar}>
        <span className={styles.personaBarLabel}>Live Agent Demo:</span>
        <div className={styles.personaPills}>
          {personas.map((p) => (
            <button
              key={p.id}
              className={`${styles.personaPill} ${selectedPersona.id === p.id ? styles.activePersona : ""}`}
              onClick={() => handleSelectPersona(p)}
              type="button"
            >
              <span className={styles.personaAvatar}>{p.avatar}</span>
              <span className={styles.personaName}>{p.name}</span>
              <span className={styles.personaRole}>{p.role}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Glass Visualizer Card */}
      <div className={styles.visualizerCard}>
        <div className={styles.cardHeader}>
          <div className={styles.agentMeta}>
            <div className={styles.pulseOrb} style={{ borderColor: selectedPersona.badgeColor }}>
              <span className={styles.avatarLarge}>{selectedPersona.avatar}</span>
              {isPlaying && <span className={styles.liveRing} />}
            </div>
            <div>
              <div className={styles.agentTitleRow}>
                <h3>{selectedPersona.name}</h3>
                <span className={styles.liveBadge}>
                  <span className={styles.liveDot} /> {isPlaying ? "Transmitting Audio" : "Ready"}
                </span>
              </div>
              <p className={styles.agentSub}>
                {selectedPersona.role} • <strong>{selectedPersona.language}</strong>
              </p>
            </div>
          </div>

          <div className={styles.techPills}>
            <span className={styles.modelTag}>⚡ {selectedPersona.model}</span>
            <span className={styles.latencyTag}>
              <i className={styles.latencyIndicator} /> {liveLatency}ms latency
            </span>
          </div>
        </div>

        {/* Audio Waveform Canvas */}
        <div className={styles.canvasWrapper}>
          <canvas
            ref={canvasRef}
            width={640}
            height={110}
            className={styles.canvas}
          />
          <div className={styles.canvasGlow} />
        </div>

        {/* Live Spoken Transcript Bubble */}
        <div className={styles.transcriptBubble}>
          <div className={styles.transcriptHeader}>
            <span className={styles.transcriptTag}>Real-Time Agent Response</span>
            <span className={styles.subText}>Full Multimodal Duplex</span>
          </div>
          <p className={styles.transcriptText}>&ldquo;{activeSpeechSnippet}&rdquo;</p>
        </div>

        {/* Bottom Play & Metrics Row */}
        <div className={styles.cardFooter}>
          <button
            className={`${styles.playButton} ${isPlaying ? styles.isPlaying : ""}`}
            onClick={handleTogglePlay}
            type="button"
          >
            <span className={styles.playIcon}>{isPlaying ? "⏸" : "▶"}</span>
            <span>{isPlaying ? "Pause Voice Stream" : "Listen to Agent Live"}</span>
          </button>

          <div className={styles.hardwareMetrics}>
            <div className={styles.metricItem}>
              <strong>0.4s</strong>
              <small>Time-To-First-Audio</small>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <strong>99.9%</strong>
              <small>Intent Accuracy</small>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <strong>SIP / WebRTC</strong>
              <small>Lossless HD</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
