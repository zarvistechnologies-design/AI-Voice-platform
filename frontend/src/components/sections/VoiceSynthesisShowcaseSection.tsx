"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./VoiceSynthesisShowcaseSection.css";

const funnelWords = [
  { text: "everyone", left: "14%", top: "4%", size: "0.78rem", color: "#a1a1aa", weight: 400, delay: "0s" },
  { text: "today", left: "30%", top: "12%", size: "0.82rem", color: "#a1a1aa", weight: 400, delay: "0.5s" },
  { text: "today", left: "6%", top: "18%", size: "1rem", color: "#27272a", weight: 500, delay: "0.9s" },
  { text: "talking", left: "42%", top: "18%", size: "1rem", color: "#27272a", weight: 500, delay: "0.3s" },
  { text: "voice", left: "26%", top: "27%", size: "0.76rem", color: "#a1a1aa", weight: 400, delay: "1.1s" },
  { text: "we're", left: "41%", top: "30%", size: "0.92rem", color: "#52525b", weight: 500, delay: "0.7s" },
  { text: "today", left: "63%", top: "29%", size: "0.76rem", color: "#a1a1aa", weight: 400, delay: "1.4s" },
  { text: "Hey", left: "8%", top: "40%", size: "1rem", color: "#27272a", weight: 500, delay: "0.2s" },
  { text: "so", left: "25%", top: "38%", size: "0.82rem", color: "#71717a", weight: 500, delay: "1.2s" },
  { text: "about", left: "32%", top: "42%", size: "1rem", color: "#27272a", weight: 500, delay: "0.6s" },
  { text: "can", left: "51%", top: "37%", size: "1rem", color: "#27272a", weight: 500, delay: "0.8s" },
  { text: "easier", left: "81%", top: "42%", size: "0.95rem", color: "#27272a", weight: 500, delay: "0.4s" },
  { text: "and", left: "19%", top: "49%", size: "0.8rem", color: "#71717a", weight: 400, delay: "1.3s" },
  { text: "make", left: "38%", top: "51%", size: "1rem", color: "#27272a", weight: 500, delay: "0.1s" },
  { text: "AI", left: "69%", top: "49%", size: "1rem", color: "#27272a", weight: 500, delay: "1s" },
  { text: "content", left: "3%", top: "57%", size: "1rem", color: "#27272a", weight: 500, delay: "0.7s" },
  { text: "easier", left: "54%", top: "57%", size: "0.85rem", color: "#71717a", weight: 400, delay: "0.5s" },
  { text: "how", left: "87%", top: "55%", size: "0.78rem", color: "#71717a", weight: 400, delay: "1.2s" },
  { text: "more", left: "14%", top: "67%", size: "0.76rem", color: "#a1a1aa", weight: 400, delay: "0.9s" },
  { text: "creation", left: "29%", top: "64%", size: "1rem", color: "#3f3f46", weight: 500, delay: "0.3s" },
  { text: "more", left: "49%", top: "67%", size: "0.95rem", color: "#27272a", weight: 500, delay: "1.1s" },
  { text: "content", left: "73%", top: "65%", size: "0.98rem", color: "#27272a", weight: 500, delay: "0.4s" },
  { text: "accessible", left: "18%", top: "76%", size: "0.95rem", color: "#3f3f46", weight: 500, delay: "0.8s" },
  { text: "for", left: "64%", top: "77%", size: "0.95rem", color: "#27272a", weight: 500, delay: "0.2s" },
  { text: "how", left: "49%", top: "84%", size: "0.78rem", color: "#71717a", weight: 400, delay: "1.3s" },
  { text: "everyone", left: "32%", top: "91%", size: "1rem", color: "#27272a", weight: 500, delay: "0.6s" },
] as const;

const waveformHeights = [
  2, 2, 3, 2, 4, 8, 5, 11, 7, 15, 9, 20, 13, 24, 10, 18, 26, 12, 22, 16,
  9, 24, 15, 28, 12, 19, 25, 14, 21, 10, 23, 17, 26, 13, 20, 11, 16, 8, 12, 6, 4, 3, 2, 2,
];

function SpeakerPortrait({ variant }: { variant: "main" | "left" | "right" }) {
  const src =
    variant === "main"
      ? "/images/speaker-1.jpg"
      : variant === "left"
        ? "/images/speaker-2.jpg"
        : "/images/speaker-3.jpg";
  const size = variant === "main" ? 78 : 56;
  return (
    <Image
      alt=""
      aria-hidden="true"
      height={size}
      src={src}
      width={size}
    />
  );
}

export function VoiceSynthesisShowcaseSection() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0.36);
  const [durationLabel, setDurationLabel] = useState("00:48");

  useEffect(() => {
    if (!playing) return;
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setProgress(Math.min(1, Math.max(0, audio.currentTime / audio.duration)));
        const remaining = Math.max(0, Math.round(audio.duration - audio.currentTime));
        const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
        const secs = String(remaining % 60).padStart(2, "0");
        setDurationLabel(`${mins}:${secs}`);
      }
    };
    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, [playing]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  const activeBars = Math.round(progress * waveformHeights.length);

  return (
    <section aria-label="AI Voice synthesis showcase" className="voice-synth-stage">
      <svg className="voice-synth-funnel-svg" viewBox="0 0 1440 460" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="funnelTopGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path d="M 0 0 L 1440 0 L 1440 165 C 1080 165, 860 110, 720 110 C 560 110, 320 0, 0 0 Z" fill="url(#funnelTopGrad)" />
        <path d="M 0 460 L 1440 460 L 1440 295 C 1080 295, 860 350, 720 350 C 560 350, 320 460, 0 460 Z" fill="url(#funnelTopGrad)" />
      </svg>

      <div className="voice-synth-inner">
        <div className="voice-synth-words" aria-hidden="true">
          {funnelWords.map((word, index) => (
            <span
              className="voice-synth-word"
              key={`${word.text}-${index}`}
              style={{
                left: word.left,
                top: word.top,
                fontSize: word.size,
                color: word.color,
                fontWeight: word.weight,
                animationDelay: word.delay,
              }}
            >
              {word.text}
            </span>
          ))}
        </div>

        <div className="voice-synth-analyzer">
          <div className="voice-synth-analyzer-top">
            <span className="voice-synth-orb" aria-hidden="true">
              <i />
              <i />
            </span>
            <div className="voice-synth-analyzing">
              Analy<span>zing.....</span>
            </div>
          </div>

          <div className="voice-synth-avatars" aria-hidden="true">
            <span className="voice-synth-avatar is-main">
              <SpeakerPortrait variant="main" />
            </span>
            <span className="voice-synth-eq-badge">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span className="voice-synth-avatar is-left">
              <SpeakerPortrait variant="left" />
            </span>
            <span className="voice-synth-avatar is-right">
              <SpeakerPortrait variant="right" />
            </span>
          </div>
        </div>

        <div className="voice-synth-player">
          <div className="voice-synth-player-head">
            <strong>Your AI voice is ready</strong>
            <span>{durationLabel}</span>
          </div>
          <div className="voice-synth-player-pill">
            <button
              aria-label={playing ? "Pause AI voice sample" : "Play AI voice sample"}
              className="voice-synth-play-btn"
              onClick={togglePlay}
              type="button"
            >
              {playing ? (
                <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <rect x="4" y="3" width="2.8" height="10" rx="0.8" />
                  <rect x="9.2" y="3" width="2.8" height="10" rx="0.8" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5.2 3.2 12.6 8l-7.4 4.8V3.2Z" />
                </svg>
              )}
            </button>
            <div className="voice-synth-bars" aria-hidden="true">
              {waveformHeights.map((h, i) => (
                <span
                  className={`voice-synth-bar${i < activeBars ? " is-active" : ""}`}
                  key={i}
                  style={{ height: h }}
                />
              ))}
            </div>
          </div>
          <audio
            onEnded={() => {
              setPlaying(false);
              setProgress(0.36);
              setDurationLabel("00:48");
            }}
            preload="metadata"
            ref={audioRef}
            src="/audio/vozon-appointment-preview-v2.mp3"
          />
        </div>
      </div>
    </section>
  );
}

