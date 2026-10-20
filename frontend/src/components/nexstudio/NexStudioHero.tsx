"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useHomepageVoiceCall } from "@/components/sections/useHomepageVoiceCall";

const demoLanguages = [
  { label: "English", code: "English", flag: "🇬🇧" },
  { label: "हिन्दी (Hindi)", code: "Hindi", flag: "🇮🇳" },
  { label: "தமிழ் (Tamil)", code: "Tamil", flag: "🇮🇳" },
  { label: "తెలుగు (Telugu)", code: "Telugu", flag: "🇮🇳" },
  { label: "ગુજરાતી (Gujarati)", code: "Gujarati", flag: "🇮🇳" },
  { label: "मराठी (Marathi)", code: "Marathi", flag: "🇮🇳" },
] as const;

interface NexStudioHeroProps {
  theme?: "dark" | "light";
}

export function NexStudioHero({ theme = "dark" }: NexStudioHeroProps) {
  const [selectedLang, setSelectedLang] = useState<string>("English");
  const voiceCall = useHomepageVoiceCall();
  const isPlaying = voiceCall.active || voiceCall.busy;
  const isDark = theme !== "light";

  const handleToggleVoice = () => {
    if (isPlaying) {
      voiceCall.disconnect();
    } else {
      void voiceCall.start(selectedLang);
    }
  };

  return (
    <section className={`relative pt-16 pb-16 lg:pt-24 lg:pb-20 overflow-hidden transition-colors duration-300 ${isDark ? "bg-transparent text-white" : "bg-white text-black"}`}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main Hero Header */}
        <div className="max-w-4xl text-center mx-auto mb-12">
          {/* Subtle Mono Eyebrow */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs nexstudio-mono uppercase tracking-wider mb-6 ${
              isDark ? "bg-white/5 border border-white/10 text-neutral-300" : "bg-gray-100 text-gray-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
            <span>VOZON 2.0 • CARRIER-GRADE VOICE AI INFRASTRUCTURE</span>
          </div>

          {/* Editorial Headline matching TailGrids NexStudio style */}
          <h1
            className={`text-4xl sm:text-6xl lg:text-7xl font-normal tracking-[-2px] mb-6 leading-[1.08] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            We Build <span className={`nexstudio-italic-serif font-serif italic font-normal ${isDark ? "text-white" : "text-black"}`}>Voice AI Agents</span> That Drive Growth.
          </h1>

          <p
            className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10 -tracking-[0.2px] ${
              isDark ? "text-neutral-400" : "text-gray-600"
            }`}
          >
            From high-growth teams to enterprise call centers — we design, deploy, and scale hyper-realistic phone agents with zero robotic lag, natural barge-in, and native fluency in <strong className={isDark ? "text-neutral-200" : "text-black"}>Hindi, Hinglish, 22+ Indic languages &amp; 76 global languages</strong>.
          </p>

          {/* Action Button Pills */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-14">
            <Link
              href="#platform"
              className="group px-7 py-4 flex gap-2.5 items-center bg-[#FF5500] hover:bg-[#ff6a1a] text-xs nexstudio-mono font-medium tracking-wider leading-5 text-white rounded-full transition-all duration-300 shadow-lg shadow-[#FF5500]/25 hover:shadow-xl hover:shadow-[#FF5500]/40"
            >
              <span>EXPLORE PLATFORM</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/contact"
              className={`group px-7 py-4 flex gap-2 items-center text-xs nexstudio-mono font-medium tracking-wider leading-5 rounded-full transition-all duration-300 ${
                isDark
                  ? "bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:border-white/30"
                  : "bg-white border border-gray-300 text-black hover:bg-gray-50 hover:border-black"
              }`}
            >
              <span>SCHEDULE A CALL</span>
            </Link>
          </div>
        </div>

        {/* Hero Media Stage: High-Fidelity Voice Demonstration Console */}
        <div className="max-w-5xl mx-auto">
          <div
            className={`rounded-3xl p-6 sm:p-10 relative overflow-hidden transition-all duration-300 ${
              isDark
                ? "border border-white/10 bg-[#0e0e14]/90 backdrop-blur-xl text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
                : "border border-gray-200 bg-neutral-950 text-white shadow-2xl"
            }`}
          >
            {/* Top Console Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs nexstudio-mono uppercase tracking-wider text-gray-300">
                  LIVE TELEPHONY STREAM • 60 FPS • WEBRTC &amp; SIP
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs nexstudio-mono bg-white/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE PIPELINE: SARVAM &amp; ELEVENLABS
              </span>
            </div>

            {/* Console Content: Language Matrix + Voice Player */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Interactive Call Engine */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-normal text-white mb-2">
                    Test Live Multilingual Voice Synthesis
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Select a language and initiate an instant live voice conversation. Experience under 300ms speech-to-speech latency with intelligent context retention.
                  </p>
                </div>

                {/* Language Switcher Chips */}
                <div className="flex flex-wrap gap-2">
                  {demoLanguages.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setSelectedLang(item.code);
                        if (isPlaying) void voiceCall.start(item.code);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs nexstudio-mono transition-all duration-200 ${
                        selectedLang === item.code
                          ? "bg-white text-black font-semibold shadow"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span className="mr-1.5">{item.flag}</span>
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Live Controls */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    disabled={!voiceCall.ready}
                    className={`px-6 py-3.5 rounded-full flex items-center gap-3 font-semibold text-xs nexstudio-mono uppercase tracking-wider transition-all duration-300 ${
                      isPlaying
                        ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30"
                        : "bg-emerald-500 text-neutral-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/30"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-sm bg-white" />
                        <span>DISCONNECT CALL</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="6 4 20 12 6 20 6 4" />
                        </svg>
                        <span>START CALL IN {selectedLang.toUpperCase()}</span>
                      </>
                    )}
                  </button>

                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                    <span>
                      {voiceCall.active
                        ? `Connected in ${voiceCall.speakingLanguage || selectedLang}`
                        : voiceCall.busy
                        ? "Establishing WebRTC..."
                        : "Ready for conversation"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Audio Waveform Equalizer Display */}
              <div className="lg:col-span-5 bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full min-h-[220px]">
                <div className="flex items-center justify-between text-xs nexstudio-mono text-gray-400">
                  <span>TELEPHONY HUD</span>
                  <span className="text-emerald-400">LATENCY &lt;280MS</span>
                </div>

                {/* Animated Waveform Visualizer */}
                <div className="flex items-end justify-center gap-1.5 h-24 py-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isPlaying ? "bg-emerald-400" : "bg-white/20"
                      }`}
                      style={{
                        height: isPlaying ? `${Math.max(12, ((i * 19) % 80) + 10)}%` : "16%",
                        animation: isPlaying
                          ? `waveAnim 1.2s ease-in-out infinite alternate ${i * 0.05}s`
                          : "none",
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs nexstudio-mono text-gray-400 pt-3 border-t border-white/10">
                  <span>AUDIO CODEC: OPUS 48KHZ</span>
                  <span>JITTER BUFFER: 12MS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Micro-Bar */}
        <div
          className={`mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-xs nexstudio-mono uppercase tracking-wider ${
            isDark ? "text-neutral-400" : "text-gray-500"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={isDark ? "text-white font-semibold" : "text-black font-semibold"}>⚡ &lt;300MS</span>
            <span>TELEPHONY LATENCY</span>
          </div>
          <span className={isDark ? "hidden sm:inline text-neutral-700" : "hidden sm:inline text-gray-300"}>•</span>
          <div className="flex items-center gap-2">
            <span className={isDark ? "text-white font-semibold" : "text-black font-semibold"}>🇮🇳 22+ INDIC</span>
            <span>&amp; 76 GLOBAL LANGUAGES</span>
          </div>
          <span className={isDark ? "hidden sm:inline text-neutral-700" : "hidden sm:inline text-gray-300"}>•</span>
          <div className="flex items-center gap-2">
            <span className={isDark ? "text-white font-semibold" : "text-black font-semibold"}>📊 1-CLICK</span>
            <span>GOOGLE SHEETS OUTBOUND</span>
          </div>
          <span className={isDark ? "hidden sm:inline text-neutral-700" : "hidden sm:inline text-gray-300"}>•</span>
          <div className="flex items-center gap-2">
            <span className={isDark ? "text-white font-semibold" : "text-black font-semibold"}>📞 BYOT</span>
            <span>EXOTEL / TWILIO / SIP</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NexStudioHero;
