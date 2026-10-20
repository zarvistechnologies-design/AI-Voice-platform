"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useAurael } from "@/components/aurael/AuraelContext";
import { AuraelSceneToggle } from "@/components/aurael/AuraelSceneToggle";
import { useHomepageVoiceCall } from "@/components/sections/useHomepageVoiceCall";
import "@/components/aurael/AuraelTheme.css";
import styles from "./SaaSHero3D.module.css";

const demoLanguages = [
  { label: "English", code: "English", flag: "🇬🇧" },
  { label: "हिन्दी", code: "Hindi", flag: "🇮🇳" },
  { label: "தமிழ்", code: "Tamil", flag: "🇮🇳" },
  { label: "తెలుగు", code: "Telugu", flag: "🇮🇳" },
  { label: "ગુજરાતી", code: "Gujarati", flag: "🇮🇳" },
  { label: "বাংলা", code: "Bengali", flag: "🇮🇳" },
  { label: "मराठी", code: "Marathi", flag: "🇮🇳" },
] as const;

export function SaaSHero3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>("English");
  const { scene } = useAurael();
  const voiceCall = useHomepageVoiceCall();
  const isPlaying = voiceCall.active || voiceCall.busy;

  // 3D Canvas Kinetic Sculpture with Pointer Drag Interaction and Aurael Color Adaptation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Generate 3D Torus Knot Geometry
    const vertices: { x0: number; y0: number; z0: number; u: number; v: number }[] = [];
    const stepsU = 32;
    const stepsV = 24;
    const R = 72;
    const r = 32;

    for (let i = 0; i < stepsU; i++) {
      const u = (i / stepsU) * Math.PI * 2;
      for (let j = 0; j < stepsV; j++) {
        const v = (j / stepsV) * Math.PI * 2;
        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u);
        const z = r * Math.sin(v) + Math.sin(u * 2) * 8;
        vertices.push({ x0: x, y0: y, z0: z, u, v });
      }
    }

    // Interactive Drag Physics
    let rotX = 0.45;
    let rotY = 0.6;
    let velX = 0;
    let velY = 0.007;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - prevMouseX;
      const dy = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;
      velY = dx * 0.005;
      velX = dy * 0.005;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      if (!isDragging) {
        velY = velY * 0.95 + 0.006 * 0.05;
        velX *= 0.94;
      }
      rotY += velY;
      rotX += velX;

      const cx = width / 2;
      const cy = height / 2;
      const fov = 340;
      const audioPulse = isPlaying ? Math.sin(time * 5) * 6 : 0;
      const isMorning = scene === "morning";

      // Project vertices with 3D rotation
      const projected = vertices.map((p) => {
        const radialBump = Math.sin(p.u * 3 + time) * 3 + audioPulse;
        const x0 = p.x0 + (p.x0 / R) * radialBump;
        const y0 = p.y0 + (p.y0 / R) * radialBump;
        const z0 = p.z0 + Math.cos(p.v * 2 + time) * 2;

        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x0 * cosY - z0 * sinY;
        const z1 = z0 * cosY + x0 * sinY;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = y0 * cosX - z1 * sinX;
        const z2 = z1 * cosX + y0 * sinX;

        const scale = fov / (fov + z2 + 160);
        return {
          x: cx + x1 * scale * 2.2,
          y: cy + y2 * scale * 2.2,
          z: z2,
          scale,
        };
      });

      const sortedIndices = projected
        .map((p, idx) => ({ idx, z: p.z }))
        .sort((a, b) => a.z - b.z)
        .map((item) => item.idx);

      // Wireframe mesh lines
      ctx.lineWidth = 0.85;
      for (let i = 0; i < vertices.length; i++) {
        const p = projected[i];
        const nextU = (i + stepsV) % vertices.length;
        const pU = projected[nextU];

        const alpha = Math.max(0.05, Math.min(0.5, (p.z + 80) / 160));
        if (isPlaying) {
          ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 0.7})`;
        } else if (isMorning) {
          ctx.strokeStyle = `rgba(180, 83, 9, ${alpha * 0.35})`;
        } else {
          ctx.strokeStyle = `rgba(248, 161, 68, ${alpha * 0.35})`;
        }

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(pU.x, pU.y);
        ctx.stroke();

        if (i % stepsV !== stepsV - 1) {
          const nextV = i + 1;
          const pV = projected[nextV];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pV.x, pV.y);
          ctx.stroke();
        }
      }

      // Luminous vertex nodes
      for (const idx of sortedIndices) {
        const p = projected[idx];
        const depthAlpha = Math.max(0.15, Math.min(0.95, (p.z + 80) / 160));
        const radius = Math.max(1.1, p.scale * 2.6);

        if (isPlaying) {
          ctx.fillStyle = `rgba(52, 211, 153, ${depthAlpha})`;
        } else if (isMorning) {
          ctx.fillStyle = `rgba(217, 119, 6, ${depthAlpha})`;
        } else {
          ctx.fillStyle = `rgba(248, 161, 68, ${depthAlpha})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (p.z > 20) {
          ctx.fillStyle = isMorning
            ? `rgba(255, 255, 255, ${depthAlpha * 0.9})`
            : `rgba(255, 237, 213, ${depthAlpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      canvas.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      canvas.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, scene]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    if (isPlaying) {
      void voiceCall.start(lang);
    }
  };

  const handleToggleVoice = () => {
    if (isPlaying) {
      voiceCall.disconnect();
    } else {
      void voiceCall.start(selectedLang);
    }
  };

  return (
    <section className={styles.heroWrapper} aria-label="Hero Section">
      {/* Ambient Radial Lights */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowLeft} aria-hidden="true" />
      <div className={styles.ambientGlowRight} aria-hidden="true" />
      <div className={styles.gridBackdrop} aria-hidden="true" />

      <div className={styles.heroContainer}>
        {/* Left Column: SaaS Value Proposition */}
        <div className={styles.heroLeft}>
          {/* Top Bar with Announcement Pill & Aurael Day/Night Switcher */}
          <div className={styles.heroTopBar}>
            <div className={styles.versionPill}>
              <span className={styles.pillSparkle}>✦</span>
              <span>Introducing Vozon 2.0 • Telephony AI Platform</span>
              <span className={styles.pillArrow}>→</span>
            </div>

            {/* Aurael Signature Day/Night Scene Switcher */}
            <AuraelSceneToggle />
          </div>

          {/* High-Impact Headline */}
          <h1 className={styles.heroTitle}>
            AI Voice Agents That<br />
            <span className={styles.gradientHighlight}>Actually Sound Human.</span>
          </h1>

          {/* Subtitle */}
          <p className={styles.heroSubtitle}>
            Automate customer support, inbound inquiries, and high-conversion outbound calls with hyper-realistic voice AI.
            Zero robotic lag, human-like barge-in, and natural fluency in <strong>Hindi, Hinglish, 22+ Indic languages</strong> &amp; <strong>76 global languages</strong>.
          </p>

          {/* Action CTAs */}
          <div className={styles.ctaGroup}>
            <Link href="/login" className={styles.primaryCta}>
              <span>Start Free Trial</span>
              <span className={styles.primaryCtaArrow}>→</span>
            </Link>

            <Link href="/contact" className={styles.secondaryCta}>
              <span>Book a Live Demo</span>
            </Link>
          </div>

          {/* Trust Metrics Micro-Strip */}
          <div className={styles.trustBar}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>⚡</span>
              <span><strong>&lt;300ms</strong> Telephony Latency</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🇮🇳</span>
              <span><strong>22+ Indic &amp; 76 Global</strong> Languages</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>📊</span>
              <span><strong>1-Click</strong> Google Sheets Outbound</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>📞</span>
              <span><strong>BYOT</strong> Virtual Telephony</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Canvas Sculpture with Live Voice HUD */}
        <div className={styles.heroRight}>
          <div className={styles.sculptureCard}>
            {/* Top Floating Badge */}
            <div className={styles.hudTopBadge}>
              <span className={styles.hudPulseDot} />
              <span>Neural Voice Matrix Online</span>
            </div>

            <div className={styles.hudHint}>
              <span>Drag to rotate</span>
            </div>

            {/* The 3D Canvas */}
            <canvas ref={canvasRef} className={styles.sculptureCanvas} />

            {/* Interactive Voice Demo Overlay */}
            <div className={styles.voiceDemoPanel}>
              <div className={styles.voicePanelHeader}>
                <div className={styles.voicePanelTitle}>
                  <span>🔊</span>
                  <span>Interactive Voice Studio</span>
                </div>
                <span className={styles.voicePipelineTag}>Sarvam &amp; ElevenLabs</span>
              </div>

              {/* Language Chips */}
              <div className={styles.langChipsRow} role="tablist" aria-label="Voice languages">
                {demoLanguages.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    role="tab"
                    aria-selected={selectedLang === item.code}
                    className={`${styles.langChipBtn} ${selectedLang === item.code ? styles.langChipBtnActive : ""}`}
                    onClick={() => handleLanguageChange(item.code)}
                  >
                    <span>{item.flag}</span> {item.label}
                  </button>
                ))}
              </div>

              {/* Player Row with Dynamic Audio Waveform */}
              <div className={styles.voicePlayerRow}>
                <button
                  type="button"
                  className={`${styles.playPauseBtn} ${isPlaying ? styles.playPauseBtnPlaying : ""}`}
                  onClick={handleToggleVoice}
                  disabled={!voiceCall.ready}
                  aria-label={isPlaying ? "Stop conversation" : `Test agent in ${selectedLang}`}
                  title={isPlaying ? "Stop call" : `Speak with agent in ${selectedLang}`}
                >
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="5" width="14" height="14" rx="2" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                  )}
                </button>

                <div className={styles.waveformContainer} aria-hidden="true">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.waveBar} ${isPlaying ? styles.waveBarActive : ""}`}
                      style={{ animationDelay: `${(i * 0.08).toFixed(2)}s` }}
                    />
                  ))}
                </div>

                <div className={styles.liveCallStatus}>
                  {voiceCall.active ? (
                    <span>Live call in {voiceCall.speakingLanguage || selectedLang}</span>
                  ) : voiceCall.busy ? (
                    <span>Connecting…</span>
                  ) : (
                    <span style={{ color: "var(--aurael-muted-fg, #94a3b8)" }}>Ready ({selectedLang})</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SaaSHero3D;
