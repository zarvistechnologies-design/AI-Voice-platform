"use client";

import { useEffect, useRef, useState } from "react";
import { API_URL } from "@/lib/apiBase";

type VoiceLanguage = {
  code: string;
  glyph: string;
  native: string;
  name: string;
  locale: string;
  reply: string;
  audio?: string;
};

const languages: VoiceLanguage[] = [
  { code: "hi", glyph: "हि", native: "हिन्दी", name: "Hindi", locale: "hi-IN", reply: "नमस्ते! मैं आपकी कैसे मदद कर सकती हूँ?" },
  { code: "en", glyph: "A", native: "English", name: "English", locale: "en-IN", reply: "Hello! How can I help you today?" },
  { code: "es", glyph: "Ñ", native: "Español", name: "Spanish", locale: "es-ES", reply: "¡Hola! ¿Cómo puedo ayudarte hoy?", audio: "/audio/india-voices/es.mp3" },
  { code: "de", glyph: "DE", native: "Deutsch", name: "German", locale: "de-DE", reply: "Hallo! Wie kann ich Ihnen heute helfen?", audio: "/audio/india-voices/de.mp3" },
  { code: "zh", glyph: "中", native: "中文", name: "Chinese", locale: "zh-CN", reply: "您好！今天我能为您做些什么？", audio: "/audio/india-voices/zh.mp3" },
  { code: "fr", glyph: "FR", native: "Français", name: "French", locale: "fr-FR", reply: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", audio: "/audio/india-voices/fr.mp3" },
  { code: "ta", glyph: "த", native: "தமிழ்", name: "Tamil", locale: "ta-IN", reply: "வணக்கம்! நான் உங்களுக்கு எப்படி உதவலாம்?" },
  { code: "te", glyph: "తె", native: "తెలుగు", name: "Telugu", locale: "te-IN", reply: "నమస్తే! నేను మీకు ఎలా సహాయం చేయగలను?" },
  { code: "kn", glyph: "ಕ", native: "ಕನ್ನಡ", name: "Kannada", locale: "kn-IN", reply: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" },
  { code: "mr", glyph: "म", native: "मराठी", name: "Marathi", locale: "mr-IN", reply: "नमस्कार! मी तुम्हाला कशी मदत करू शकते?" },
  { code: "bn", glyph: "ব", native: "বাংলা", name: "Bengali", locale: "bn-IN", reply: "নমস্কার! আমি আপনাকে কীভাবে সাহায্য করতে পারি?" },
  { code: "or", glyph: "ଓ", native: "ଓଡ଼ିଆ", name: "Odia", locale: "or-IN", reply: "ନମସ୍କାର! ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?", audio: "/audio/india-voices/or.wav" },
  { code: "gu", glyph: "ગુ", native: "ગુજરાતી", name: "Gujarati", locale: "gu-IN", reply: "નમસ્તે! હું તમને કેવી રીતે મદદ કરી શકું?" },
  { code: "pa", glyph: "ਪ", native: "ਪੰਜਾਬੀ", name: "Punjabi", locale: "pa-IN", reply: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੀ ਹਾਂ?" },
  { code: "ml", glyph: "മ", native: "മലയാളം", name: "Malayalam", locale: "ml-IN", reply: "നമസ്കാരം! എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?" },
];

const waveBars = [12, 23, 38, 18, 31, 52, 25, 44, 17, 34, 58, 28, 42, 20, 48, 26, 36, 16, 31, 45, 22, 35, 14];

function WaveMark() {
  return (
    <span className="india-voice-wave-mark" aria-hidden="true">
      {[8, 15, 22, 12, 18, 9].map((height, index) => (
        <i key={index} style={{ height, animationDelay: `${index * -90}ms` }} />
      ))}
    </span>
  );
}

function MicrophoneIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="22" y="8" width="20" height="34" rx="10" />
      <path d="M14 31v2a18 18 0 0 0 36 0v-2M32 51v8M24 59h16" />
    </svg>
  );
}

function RotatingGlobe() {
  return (
    <div className="india-globe-wrap" aria-label="Photorealistic Earth rotating in space" role="img">
      <div className="india-globe">
        <span className="india-globe-surface-photo" />
        <svg className="india-globe-map" viewBox="0 0 420 420" aria-hidden="true">
          <defs>
            <clipPath id="indiaGlobeClip"><circle cx="210" cy="210" r="196" /></clipPath>
            <pattern id="indiaGlobeDots" width="7" height="7" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.35" fill="#80fff6" />
              <circle cx="5.5" cy="5.5" r=".55" fill="#37cfc9" opacity=".72" />
            </pattern>
            <filter id="indiaGlobeLandGlow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="indiaOceanTexture" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence baseFrequency=".065" numOctaves="2" seed="7" type="fractalNoise" />
              <feColorMatrix values="0 0 0 0 0.16 0 0 0 0 0.88 0 0 0 0 0.84 0 0 0 .13 0" />
            </filter>
            <g id="indiaWorldLand">
              <path className="india-region india-region-north-america" d="M22 105 31 82 49 66 67 56 85 49 105 54 117 65 134 69 153 84 158 98 149 110 133 113 124 126 111 129 103 142 91 151 76 145 66 132 50 125 40 111Z" />
              <path className="india-region india-region-north-america" d="m96 142 11-7 12 6 2 12 13 7-3 12-11-5-8-10-10-4Z" />
              <path className="india-region india-region-south-america" d="m119 165 18-5 20 11 13 21-2 25 10 23-8 28-10 31-14 31-14 12-9-19 2-25-11-24-8-27 5-22-7-19 9-18-5-14Z" />
              <path className="india-region india-region-eurasia" d="m169 91 12-17 18-5 15-14 26-9 27 4 21-5 24 8 19-2 21 10 25 4 17 14 18 7 13 18-7 13-20 2-13 12-20-1-13 11-19-2-13 12-15-2-9 13-20-1-13 10-20-8-15 7-17-8-14 5-14-13-18-3-7-14-15-8 5-13-10-9Z" />
              <path className="india-region india-region-africa" d="m214 157 17-7 20 6 15 15 15 4 5 20-9 18-5 25-12 24-9 27-14 13-10-17 1-25-11-23-2-23-12-17 5-17-8-13Z" />
              <path className="india-region india-region-islands" d="m176 116 7-7 8 3-1 11-9 3Z" />
              <path className="india-region india-region-islands" d="m347 151 7-11 6 5-2 17-7 5Z" />
              <path className="india-region india-region-islands" d="m322 206 8-7 7 8-3 13-8 4Z" />
              <path className="india-region india-region-islands" d="m275 263 6-8 5 5-2 19-7 7Z" />
              <path className="india-region india-region-oceania" d="m331 259 18-13 24-1 23 14 8 20-7 24-19 17-26-3-17-17-11-22Z" />
              <path className="india-region india-region-islands" d="m398 302 8-8 5 5-4 16-7 5Z" />
              <path className="india-region india-region-antarctica" d="M23 370 48 362l24 4 25-7 28 8 24-6 29 8 26-7 31 8 26-7 29 8 28-7 29 8 27-6 25 10-13 15-34 5-36-3-38 5-36-4-38 5-37-4-35 4-34-6-30 3-27-9Z" />
              <path className="india-region india-region-antarctica" d="m145 53 11-18 20-9 22 4 12 15-9 15-24 5-22-4Z" />
            </g>
          </defs>
          <g clipPath="url(#indiaGlobeClip)">
            <circle className="india-ocean-texture" cx="210" cy="210" r="196" filter="url(#indiaOceanTexture)" />
            <g className="india-globe-surface">
              <use className="india-globe-land" href="#indiaWorldLand" />
              <use className="india-globe-land" href="#indiaWorldLand" x="420" />
            </g>
            <g className="india-globe-data-lines">
              <path d="M-10 279C88 321 181 299 267 228S384 124 438 159" />
              <path d="M14 84c82-70 180-74 275-34 47 20 83 20 119-4" />
              <path d="M61 359c91-1 165-43 222-113 51-63 92-81 153-85" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function FeatureIcon({ name }: { name: "chat" | "bolt" | "shield" }) {
  if (name === "bolt") return <svg viewBox="0 0 32 32"><path d="m18 2-12 17h9l-1 11 12-18h-9Z" /></svg>;
  if (name === "shield") return <svg viewBox="0 0 32 32"><path d="M16 2 27 6v8c0 8-4.5 13-11 16C9.5 27 5 22 5 14V6Z" /><path d="m11 15 3 3 7-7" /></svg>;
  return <svg viewBox="0 0 32 32"><path d="M5 6h17a5 5 0 0 1 5 5v7a5 5 0 0 1-5 5h-9l-6 5v-5H5a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4Z" /><path d="M9 14h.01M14 14h.01M19 14h.01" /></svg>;
}

export function IndiaVoiceExperience() {
  const [activeCode, setActiveCode] = useState("hi");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const runRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const active = languages.find((language) => language.code === activeCode) ?? languages[0];

  useEffect(() => () => {
    runRef.current += 1;
    audioRef.current?.pause();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const speak = (language = active) => {
    setActiveCode(language.code);
    runRef.current += 1;
    const currentRun = runRef.current;
    audioRef.current?.pause();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(true);
    let fallbackStarted = false;

    const finish = () => {
      if (runRef.current === currentRun) setIsSpeaking(false);
    };
    const browserSpeech = () => {
      if (fallbackStarted || runRef.current !== currentRun) return;
      fallbackStarted = true;
      if (!("speechSynthesis" in window)) return finish();
      const utterance = new SpeechSynthesisUtterance(language.reply);
      utterance.lang = language.locale;
      utterance.rate = 0.94;
      const languagePrefix = language.locale.split("-")[0].toLowerCase();
      utterance.voice =
        window.speechSynthesis
          .getVoices()
          .find((voice) => voice.lang.toLowerCase().startsWith(languagePrefix)) ?? null;
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
    };

    const sources = [
      language.audio ?? `/audio/india-voices/${language.code}.wav`,
      `${API_URL}/api/voice/marketing-preview/${language.code}`,
    ];
    const playSource = (sourceIndex: number) => {
      if (runRef.current !== currentRun) return;
      const source = sources[sourceIndex];
      if (!source) return browserSpeech();

      const audio = new Audio(source);
      audioRef.current = audio;
      audio.onended = finish;
      audio.onerror = () => playSource(sourceIndex + 1);
      void audio.play().catch(() => playSource(sourceIndex + 1));
    };
    playSource(0);
  };

  return (
    <section className="india-voice-experience" id="india-voice" aria-labelledby="india-voice-title">
      <div className="india-voice-intro">
        <div className="india-voice-eyebrow"><WaveMark /> Voice AI for global conversations</div>
        <h2 id="india-voice-title">
          <span className="india-heading-line">Speak every customer&apos;s</span>
          <span className="india-heading-line">language<span className="india-heading-dot">.</span></span>
        </h2>
        <p>Deploy natural AI phone agents across 140+ languages and dialects while keeping the same workflows, integrations, and human handoffs.</p>
      </div>

      <div className="india-voice-layout">
        <div className="india-voice-copy">
          <span className="india-language-label">Choose language</span>
          <div className="india-language-list">
            {(showAllLanguages ? languages : languages.slice(0, 8)).map((language) => (
              <button
                aria-pressed={active.code === language.code}
                className={active.code === language.code ? "is-active" : ""}
                key={language.code}
                onClick={() => speak(language)}
                type="button"
              >
                <span className="india-language-glyph">{language.glyph}</span>
                <span className="india-language-native">{language.native}</span>
                <span className="india-language-name">{language.name}</span>
                {active.code === language.code ? <span className="india-language-check">✓</span> : null}
              </button>
            ))}
          </div>
          <button className="india-more-languages" onClick={() => setShowAllLanguages((current) => !current)} type="button">
            <span>{showAllLanguages ? "−" : "+"}</span>
            {showAllLanguages ? "Show fewer languages" : `View all ${languages.length} languages`}
          </button>
        </div>

        <div className="india-agent">
          <div className="india-agent-heading"><WaveMark /> Try Vozon in your language</div>
          <p>Select a language, then tap the microphone to hear the agent.</p>
          <div className={`india-mic-stage ${isSpeaking ? "is-speaking" : ""}`}>
            <div className="india-mic-wave">
              {waveBars.map((height, index) => <i key={index} style={{ height, animationDelay: `${index * -54}ms` }} />)}
            </div>
            <button aria-label={`Talk to agent in ${active.name}`} onClick={() => speak()} type="button">
              <span className="india-mic-ring india-mic-ring-one" />
              <span className="india-mic-ring india-mic-ring-two" />
              <span className="india-mic-core"><MicrophoneIcon /></span>
            </button>
          </div>
          <strong aria-live="polite">{isSpeaking ? `Speaking ${active.name}...` : `Tap to start in ${active.name}`}</strong>
          <div className="india-listening-dots" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((dot) => <i className={dot === 0 || dot === 1 || dot === 5 ? "is-lit" : ""} key={dot} />)}
          </div>
          <div className={`india-agent-reply ${isSpeaking ? "is-speaking" : ""}`} aria-live="polite">
            <span>AI agent · {active.native}</span>
            <p>{active.reply}</p>
          </div>
        </div>

        <div className="india-world">
          <RotatingGlobe />
          <div className="india-world-features">
            <div><FeatureIcon name="chat" /><span><strong>Global language support</strong><small>140+ languages &amp; dialects</small></span></div>
            <div><FeatureIcon name="bolt" /><span><strong>Real-time Conversations</strong><small>Natural, human-like interactions</small></span></div>
            <div><FeatureIcon name="shield" /><span><strong>Secure &amp; Reliable</strong><small>Enterprise grade security</small></span></div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .india-voice-experience{--iv-accent:#45ddce;--iv-bright:#75fff0;position:relative;box-sizing:border-box;width:calc(100% - 2rem);max-width:1560px;margin:2rem auto;padding:3.25rem 2.25rem 2.5rem;overflow:hidden;scroll-margin-top:88px;border:1px solid transparent;border-radius:20px;background:linear-gradient(#000,#000) padding-box,linear-gradient(118deg,rgba(69,221,206,.88),rgba(24,104,202,.45) 35%,rgba(118,48,190,.58) 67%,rgba(236,0,151,.76)) border-box;box-shadow:0 0 0 1px rgba(255,255,255,.025),0 20px 70px rgba(0,0,0,.48),0 0 34px rgba(69,221,206,.07),0 0 48px rgba(190,0,151,.045);color:#fff}
        .india-voice-experience:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 84% 32%,rgba(40,118,255,.11),transparent 29%),radial-gradient(circle at 49% 56%,rgba(69,221,206,.075),transparent 23%),radial-gradient(circle at 8% 72%,rgba(223,0,154,.07),transparent 26%);pointer-events:none}
        .india-voice-experience:after{content:"";position:absolute;inset:0;border-radius:19px;box-shadow:inset 0 1px 0 rgba(255,255,255,.07),inset 0 0 42px rgba(69,221,206,.025);pointer-events:none}
        .india-voice-intro{position:relative;z-index:1;max-width:900px;margin:0 auto 2rem;text-align:center}.india-voice-intro .india-voice-eyebrow{justify-content:center}
        .india-voice-layout{position:relative;z-index:1;display:grid;grid-template-columns:minmax(300px,.96fr) minmax(320px,1.02fr) minmax(250px,.76fr);align-items:center;gap:1.75rem}
        .india-voice-eyebrow,.india-agent-heading{display:flex;align-items:center;gap:.75rem;color:var(--iv-bright);font-size:.68rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
        .india-voice-wave-mark{display:inline-flex;height:25px;align-items:center;gap:3px}.india-voice-wave-mark i{display:block;width:2px;border-radius:4px;background:var(--iv-accent);animation:iv-wave .75s ease-in-out infinite alternate}
        .india-voice-intro h2{margin:.85rem 0 .7rem;font-size:clamp(2.5rem,4.25vw,4.35rem);font-weight:900;line-height:.92;letter-spacing:-.055em}.india-heading-line{display:block;color:#fff;white-space:nowrap}.india-heading-line .india-heading-dot{color:var(--iv-accent)}
        .india-voice-intro>p{max-width:720px;margin:0 auto;color:rgba(255,255,255,.72);font-size:.9rem;line-height:1.6}
        .india-language-label{display:block;margin-top:0;color:var(--iv-bright);font-size:.68rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
        .india-language-list{display:grid;grid-template-columns:1fr 1fr;gap:.35rem .7rem;margin-top:.8rem}
        .india-language-list button{position:relative;display:grid;min-width:0;grid-template-columns:34px minmax(0,1fr);grid-template-rows:auto auto;align-items:center;column-gap:.55rem;row-gap:.05rem;min-height:44px;padding:.25rem 1.75rem .25rem .25rem;border:1px solid transparent;border-radius:12px;background:transparent;color:#fff;text-align:left;cursor:pointer;transition:.2s}
        .india-language-list button:hover{background:rgba(69,221,206,.055);border-color:rgba(69,221,206,.17)}.india-language-list button.is-active{border-color:rgba(69,221,206,.72);background:rgba(69,221,206,.075);box-shadow:0 0 24px rgba(69,221,206,.11)}
        .india-language-glyph{display:grid;grid-row:1/3;width:34px;height:34px;place-items:center;border:1px solid rgba(255,255,255,.1);border-radius:10px;font-size:.9rem}.is-active .india-language-glyph{color:var(--iv-bright);border-color:rgba(69,221,206,.32);background:rgba(69,221,206,.08);box-shadow:inset 0 0 14px rgba(69,221,206,.1)}
        .india-language-native{min-width:0;overflow:hidden;color:rgba(255,255,255,.92);font-size:.82rem;line-height:1.1;text-overflow:ellipsis;white-space:nowrap}.india-language-name{color:rgba(255,255,255,.38);font-size:.63rem;line-height:1.1;white-space:nowrap}.india-language-check{position:absolute;right:.55rem;top:50%;display:grid;width:16px;height:16px;place-items:center;border-radius:50%;background:var(--iv-accent);color:#03110f;font-size:.65rem;font-weight:900;transform:translateY(-50%)}
        .india-more-languages{display:flex;align-items:center;gap:.65rem;margin-top:.85rem;padding:0;border:0;background:transparent;color:var(--iv-bright);font-size:.7rem;font-weight:800;cursor:pointer}.india-more-languages span{display:grid;width:34px;height:34px;place-items:center;border:1px solid rgba(69,221,206,.28);border-radius:10px;background:rgba(69,221,206,.04);font-size:1.15rem}.india-more-languages:hover span{border-color:rgba(69,221,206,.62);box-shadow:0 0 20px rgba(69,221,206,.12)}
        .india-agent{align-self:center;text-align:center}.india-agent-heading{justify-content:center}.india-agent>p{max-width:300px;margin:.75rem auto 0;color:rgba(255,255,255,.58);font-size:.74rem;line-height:1.55}
        .india-mic-stage{position:relative;display:grid;height:245px;place-items:center}.india-mic-wave{position:absolute;right:-3%;left:-3%;display:flex;height:68px;align-items:center;justify-content:center;gap:4px;filter:drop-shadow(0 0 7px rgba(69,221,206,.45))}
        .india-mic-wave:after,.india-mic-wave:before{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,var(--iv-accent))}.india-mic-wave:after{background:linear-gradient(90deg,var(--iv-accent),transparent)}
        .india-mic-wave i{width:2px;border-radius:4px;background:var(--iv-bright);opacity:.8;animation:iv-wave 1s ease-in-out infinite alternate}.india-mic-stage:not(.is-speaking) .india-mic-wave i{animation-duration:2.3s;opacity:.4}
        .india-mic-stage button{position:relative;display:grid;width:132px;height:132px;place-items:center;border:1px solid rgba(69,221,206,.52);border-radius:50%;background:radial-gradient(circle,#0c3431 0,#061916 58%,#020706 100%);box-shadow:0 0 28px rgba(69,221,206,.16),inset 0 0 35px rgba(69,221,206,.12);cursor:pointer}
        .india-mic-stage button:before,.india-mic-stage button:after{content:"";position:absolute;border:1px solid rgba(69,221,206,.12);border-radius:50%}.india-mic-stage button:before{inset:-28px}.india-mic-stage button:after{inset:-52px}
        .india-mic-ring{position:absolute;border:1px solid rgba(69,221,206,.28);border-radius:50%}.india-mic-ring-one{inset:-22px;border-style:dashed;animation:iv-spin 15s linear infinite}.india-mic-ring-two{inset:15px;box-shadow:0 0 20px rgba(69,221,206,.18)}
        .india-mic-core{display:grid;width:86px;height:86px;place-items:center;border-radius:50%;background:rgba(69,221,206,.08);box-shadow:0 0 24px rgba(69,221,206,.16)}.india-mic-core svg{width:47px;fill:none;stroke:var(--iv-bright);stroke-width:3;stroke-linecap:round}
        .is-speaking .india-mic-core{animation:iv-pulse 1s ease-in-out infinite}.india-agent>strong{display:block;color:rgba(255,255,255,.68);font-size:.76rem;font-weight:600}.india-listening-dots{display:flex;justify-content:center;gap:.5rem;margin-top:.9rem}.india-listening-dots i{width:5px;height:5px;border-radius:50%;background:#123531}.india-listening-dots .is-lit{background:var(--iv-accent);box-shadow:0 0 8px var(--iv-accent)}
        .india-agent-reply{max-width:360px;margin:1.15rem auto 0;padding:.8rem 1rem;border:1px solid rgba(69,221,206,.12);border-radius:14px;background:rgba(69,221,206,.025);opacity:.68;transition:border-color .2s,background .2s,opacity .2s,transform .2s}.india-agent-reply.is-speaking{border-color:rgba(69,221,206,.38);background:rgba(69,221,206,.07);box-shadow:0 0 24px rgba(69,221,206,.08);opacity:1;transform:translateY(-2px)}.india-agent-reply span{display:block;color:var(--iv-bright);font-size:.57rem;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.india-agent-reply p{margin:.4rem 0 0;color:rgba(255,255,255,.68);font-size:.7rem;line-height:1.5}
        .india-world{display:flex;flex-direction:column;align-items:center}.india-globe-wrap{position:relative;display:grid;width:min(100%,350px);aspect-ratio:1;place-items:center;isolation:isolate}.india-globe-wrap:before{content:"";position:absolute;inset:0;background-image:radial-gradient(circle at 14% 19%,rgba(255,255,255,.95) 0 1px,transparent 1.8px),radial-gradient(circle at 72% 12%,rgba(126,198,255,.9) 0 1px,transparent 1.7px),radial-gradient(circle at 84% 72%,rgba(255,255,255,.8) 0 1px,transparent 1.7px),radial-gradient(circle at 24% 76%,rgba(126,198,255,.75) 0 1px,transparent 1.8px),radial-gradient(circle at 50% 48%,rgba(255,255,255,.52) 0 .8px,transparent 1.5px);background-size:41px 47px,67px 61px,83px 79px,97px 89px,29px 31px;-webkit-mask-image:radial-gradient(circle,#000 34%,rgba(0,0,0,.84) 56%,transparent 78%);mask-image:radial-gradient(circle,#000 34%,rgba(0,0,0,.84) 56%,transparent 78%);opacity:.86}.india-globe-wrap:after{content:"";position:absolute;inset:8%;z-index:1;border-radius:50%;box-shadow:0 0 18px rgba(112,213,255,.9),0 0 42px rgba(28,113,255,.65)}
        .india-globe{position:relative;z-index:3;width:82%;aspect-ratio:1;overflow:hidden;border:2px solid rgba(190,238,255,.95);border-radius:50%;background:#063b7c;box-shadow:0 0 5px #fff,0 0 15px #6bd6ff,0 0 34px rgba(33,117,255,.95),0 0 62px rgba(0,104,255,.5),inset 0 0 20px rgba(108,222,255,.5),inset -38px -10px 52px rgba(0,0,15,.78)}.india-globe:before{content:"";position:absolute;z-index:4;inset:0;border-radius:50%;background:radial-gradient(circle at 29% 22%,rgba(255,255,255,.24),transparent 25%),linear-gradient(96deg,rgba(0,0,18,.64) 0,transparent 28%,transparent 67%,rgba(0,0,20,.58) 100%);pointer-events:none}.india-globe:after{content:"";position:absolute;z-index:5;inset:0;border-radius:50%;box-shadow:inset 12px 0 22px rgba(0,5,25,.65),inset -18px -5px 30px rgba(0,0,12,.74),inset 0 0 10px rgba(197,245,255,.82);pointer-events:none}
        .india-globe-surface-photo{position:absolute;z-index:2;inset:0;border-radius:50%;background-image:url("/earth-surface-v2.webp");background-repeat:repeat-x;background-position:52% 50%;background-size:auto 100%;filter:saturate(1.08) contrast(1.04);animation:iv-earth-rotate 28s linear infinite;will-change:background-position}.india-globe-map{display:none}
        .india-world-features{width:calc(100% - 1.4rem);margin:.45rem 0 0 1.4rem;padding-left:1.15rem;border-left:1px solid rgba(69,221,206,.12)}.india-world-features>div{display:flex;align-items:center;gap:.9rem;padding:.55rem 0}.india-world-features svg{width:27px;fill:none;stroke:var(--iv-accent);stroke-width:2}.india-world-features span{display:flex;flex-direction:column;gap:.2rem}.india-world-features strong{font-size:.76rem}.india-world-features small{color:rgba(255,255,255,.38);font-size:.64rem}
        .india-world .india-globe-wrap{width:min(100%,280px)}.india-world-features>div{padding:.4rem 0}.india-agent-reply{margin-top:.8rem}
        @keyframes iv-wave{from{transform:scaleY(.5);opacity:.45}to{transform:scaleY(1.12);opacity:1}}@keyframes iv-spin{to{transform:rotate(360deg)}}@keyframes iv-pulse{50%{transform:scale(1.08);box-shadow:0 0 35px rgba(69,221,206,.3)}}@keyframes iv-earth-rotate{from{background-position:52% 50%}to{background-position:-148% 50%}}
        @media(max-width:1050px){.india-voice-experience{width:calc(100% - 2rem);padding:4.75rem 1.5rem 3.5rem}.india-voice-layout{grid-template-columns:1fr 1fr}.india-world{grid-column:1/-1;display:grid;grid-template-columns:minmax(260px,360px) 280px;justify-content:center}.india-globe-wrap{width:310px}.india-world-features{width:100%;margin:0;align-self:center}}
        @media(max-width:720px){.india-voice-experience{width:calc(100% - 1rem);margin:2rem auto;padding:4rem 1rem 2.75rem;border-radius:24px}.india-voice-intro{margin-bottom:2.5rem}.india-voice-layout{grid-template-columns:minmax(0,1fr);gap:3.25rem}.india-voice-copy{text-align:center}.india-voice-eyebrow{justify-content:center}.india-language-list{text-align:left}.india-more-languages{justify-content:center}.india-agent{padding-top:.5rem}.india-world{grid-column:auto;display:flex}.india-globe-wrap{width:min(100%,300px)}.india-world-features{max-width:300px;margin:.5rem auto 0}.india-mic-stage{height:300px}}
        @media(max-width:540px){.india-voice-copy{width:100%;min-width:0;max-width:100%;overflow:hidden}.india-language-list{box-sizing:border-box;width:100%;max-width:100%;grid-template-columns:minmax(0,1fr)}.india-language-list button{box-sizing:border-box;width:100%;max-width:100%;grid-template-columns:36px minmax(0,1fr);overflow:hidden}.india-language-native{overflow:hidden;text-overflow:ellipsis}.india-voice-intro h2{font-size:2.15rem;overflow-wrap:anywhere}.india-heading-line{white-space:normal}.india-mic-wave{right:-8%;left:-8%}}
        @media(prefers-reduced-motion:reduce){.india-voice-experience *{animation:none!important}}
      `}</style>
    </section>
  );
}
