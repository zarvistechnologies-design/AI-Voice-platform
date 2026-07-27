"use client";

import { useEffect, useRef, useState } from "react";
import { API_URL } from "@/lib/apiBase";

const languages = [
  { code: "hi", glyph: "हि", native: "हिन्दी", name: "Hindi", locale: "hi-IN", reply: "नमस्ते! मैं आपकी कैसे मदद कर सकती हूँ?" },
  { code: "en", glyph: "A", native: "English", name: "English", locale: "en-IN", reply: "Hello! How can I help you today?" },
  { code: "ta", glyph: "த", native: "தமிழ்", name: "Tamil", locale: "ta-IN", reply: "வணக்கம்! நான் உங்களுக்கு எப்படி உதவலாம்?" },
  { code: "te", glyph: "తె", native: "తెలుగు", name: "Telugu", locale: "te-IN", reply: "నమస్తే! నేను మీకు ఎలా సహాయం చేయగలను?" },
  { code: "kn", glyph: "ಕ", native: "ಕನ್ನಡ", name: "Kannada", locale: "kn-IN", reply: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" },
  { code: "mr", glyph: "म", native: "मराठी", name: "Marathi", locale: "mr-IN", reply: "नमस्कार! मी तुम्हाला कशी मदत करू शकते?" },
  { code: "bn", glyph: "ব", native: "বাংলা", name: "Bengali", locale: "bn-IN", reply: "নমস্কার! আমি আপনাকে কীভাবে সাহায্য করতে পারি?" },
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
    <div className="india-globe-wrap" aria-label="Animated globe focused on India" role="img">
      <span className="india-globe-aura" />
      <span className="india-globe-orbit india-globe-orbit-one"><i /></span>
      <span className="india-globe-orbit india-globe-orbit-two"><i /></span>
      <span className="india-globe-orbit india-globe-orbit-three"><i /></span>
      <div className="india-globe">
        <span className="india-globe-shine" />
        <svg className="india-globe-map" viewBox="0 0 420 420" aria-hidden="true">
          <defs>
            <clipPath id="indiaGlobeClip"><circle cx="210" cy="210" r="196" /></clipPath>
            <filter id="indiaMapGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <pattern id="indiaMapDots" width="5" height="5" patternUnits="userSpaceOnUse">
              <circle cx="1.3" cy="1.3" r="0.85" fill="#75fff0" opacity=".72" />
            </pattern>
            <radialGradient id="indiaFocusGlow">
              <stop stopColor="#b6ff76" stopOpacity=".65" />
              <stop offset="1" stopColor="#45ddce" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g clipPath="url(#indiaGlobeClip)">
            <g className="india-globe-graticule">
              <ellipse cx="210" cy="210" rx="72" ry="194" />
              <ellipse cx="210" cy="210" rx="139" ry="194" />
              <ellipse cx="210" cy="210" rx="194" ry="58" />
              <ellipse cx="210" cy="210" rx="194" ry="119" />
              <path d="M16 210h388" />
              <path d="M210 16v388" />
            </g>
            <g className="india-globe-land">
              <path d="M45 91 72 63l40-18 30 5 22 19 5 19-17 15-28 1-13 15-25-4-14 13-22-12Z" />
              <path d="m109 133 24-10 28 13 20 32-6 38 13 29-12 44-18 45-23 32-16-24-2-39-19-37-4-43 14-30-8-27Z" />
              <path d="m142 88 18-23 39-18 41-6 42 10 30-4 42 20 27 31-5 24-28 7-18 20-27 3-18 21-23-9-22 12-22-13-15 9-19-17-22-3-5-20-29-11 7-18-8-12Z" />
              <path d="m286 180 17-17 20 4 8 20 16 12-7 18-19-4-9-18-17-2Z" />
              <path d="m325 219 13-6 10 13-7 17-9-7Z" />
              <path d="m340 255 27-18 30 6 18 25-8 34-25 25-37-6-16-26Z" />
              <path d="m306 202 6-4 7 8-3 12-7-5Z" />
            </g>
            <circle className="india-globe-focus-pulse" cx="210" cy="210" r="112" />
            <image className="india-globe-focus" href="/images/india-outline.svg" x="140" y="128" width="140" height="164" preserveAspectRatio="xMidYMid meet" />
            <g className="india-globe-routes">
              <path d="M207 183Q172 153 137 148" />
              <path d="M220 190Q282 151 337 169" />
              <path d="M213 223Q270 258 320 302" />
              <circle cx="137" cy="148" r="3" />
              <circle cx="337" cy="169" r="3" />
              <circle cx="320" cy="302" r="3" />
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
      `/audio/india-voices/${language.code}.wav`,
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
      <div className="india-voice-layout">
        <div className="india-voice-copy">
          <div className="india-voice-eyebrow"><WaveMark /> Voice AI that speaks India</div>
          <h2 id="india-voice-title">
            <span className="india-heading-line">Every Language.</span>
            <span className="india-heading-line">Every Conversation<span className="india-heading-dot">.</span></span>
          </h2>
          <p>Our voice AI understands Indian languages and dialects naturally. Talk to your customers in the language they are most comfortable with.</p>
          <span className="india-language-label">Choose language</span>
          <div className="india-language-list">
            {languages.map((language) => (
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
          <div className="india-more-languages">
            <span>◎</span> + More Languages
          </div>
        </div>

        <div className="india-agent">
          <div className="india-agent-heading"><WaveMark /> Talk to agent</div>
          <p>Start speaking in your preferred language</p>
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
          <strong aria-live="polite">{isSpeaking ? `Speaking ${active.name}...` : "Listening..."}</strong>
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
            <div><FeatureIcon name="chat" /><span><strong>Understands India</strong><small>30+ languages &amp; dialects</small></span></div>
            <div><FeatureIcon name="bolt" /><span><strong>Real-time Conversations</strong><small>Natural, human-like interactions</small></span></div>
            <div><FeatureIcon name="shield" /><span><strong>Secure &amp; Reliable</strong><small>Enterprise grade security</small></span></div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .india-voice-experience{--iv-accent:#45ddce;--iv-bright:#75fff0;position:relative;box-sizing:border-box;width:calc(100% - 2.5rem);max-width:1240px;margin:2.5rem auto 1rem;padding:4.75rem 0 5rem;overflow:hidden;border-block:1px solid rgba(69,221,206,.1);background:#000;color:#fff}
        .india-voice-experience:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 84% 32%,rgba(69,221,206,.09),transparent 29%),radial-gradient(circle at 49% 56%,rgba(69,221,206,.05),transparent 23%);pointer-events:none}
        .india-voice-layout{position:relative;display:grid;grid-template-columns:minmax(300px,.96fr) minmax(330px,1.08fr) minmax(280px,.86fr);align-items:center;gap:2rem}
        .india-voice-eyebrow,.india-agent-heading{display:flex;align-items:center;gap:.75rem;color:var(--iv-bright);font-size:.68rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
        .india-voice-wave-mark{display:inline-flex;height:25px;align-items:center;gap:3px}.india-voice-wave-mark i{display:block;width:2px;border-radius:4px;background:var(--iv-accent);animation:iv-wave .75s ease-in-out infinite alternate}
        .india-voice-copy h2{margin:1.75rem 0 1.15rem;font-size:clamp(2.55rem,3.3vw,3rem);font-weight:900;line-height:1.03;letter-spacing:-.052em}.india-heading-line{display:block;color:#fff;white-space:nowrap}.india-heading-line .india-heading-dot{color:var(--iv-accent)}
        .india-voice-copy>p{max-width:380px;margin:0;color:rgba(255,255,255,.56);font-size:.9rem;line-height:1.75}
        .india-language-label{display:block;margin-top:2rem;color:var(--iv-bright);font-size:.68rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
        .india-language-list{display:grid;grid-template-columns:1fr 1fr;gap:.35rem .7rem;margin-top:.8rem}
        .india-language-list button{position:relative;display:grid;min-width:0;grid-template-columns:36px minmax(0,1fr);grid-template-rows:auto auto;align-items:center;column-gap:.6rem;row-gap:.05rem;min-height:50px;padding:.35rem 1.75rem .35rem .3rem;border:1px solid transparent;border-radius:14px;background:transparent;color:#fff;text-align:left;cursor:pointer;transition:.2s}
        .india-language-list button:hover{background:rgba(69,221,206,.055);border-color:rgba(69,221,206,.17)}.india-language-list button.is-active{border-color:rgba(69,221,206,.72);background:rgba(69,221,206,.075);box-shadow:0 0 24px rgba(69,221,206,.11)}
        .india-language-glyph{display:grid;grid-row:1/3;width:34px;height:34px;place-items:center;border:1px solid rgba(255,255,255,.1);border-radius:10px;font-size:.9rem}.is-active .india-language-glyph{color:var(--iv-bright);border-color:rgba(69,221,206,.32);background:rgba(69,221,206,.08);box-shadow:inset 0 0 14px rgba(69,221,206,.1)}
        .india-language-native{min-width:0;overflow:hidden;color:rgba(255,255,255,.92);font-size:.82rem;line-height:1.1;text-overflow:ellipsis;white-space:nowrap}.india-language-name{color:rgba(255,255,255,.38);font-size:.63rem;line-height:1.1;white-space:nowrap}.india-language-check{position:absolute;right:.55rem;top:50%;display:grid;width:16px;height:16px;place-items:center;border-radius:50%;background:var(--iv-accent);color:#03110f;font-size:.65rem;font-weight:900;transform:translateY(-50%)}
        .india-more-languages{display:flex;align-items:center;gap:.65rem;margin-top:.75rem;color:var(--iv-bright);font-size:.7rem;font-weight:700}.india-more-languages span{display:grid;width:34px;height:34px;place-items:center;border:1px solid rgba(69,221,206,.22);border-radius:10px;font-size:1.35rem}
        .india-agent{align-self:center;text-align:center}.india-agent-heading{justify-content:center}.india-agent>p{margin:.75rem 0 0;color:rgba(255,255,255,.42);font-size:.72rem}
        .india-mic-stage{position:relative;display:grid;height:310px;place-items:center}.india-mic-wave{position:absolute;right:-5%;left:-5%;display:flex;height:78px;align-items:center;justify-content:center;gap:4px;filter:drop-shadow(0 0 7px rgba(69,221,206,.45))}
        .india-mic-wave:after,.india-mic-wave:before{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,var(--iv-accent))}.india-mic-wave:after{background:linear-gradient(90deg,var(--iv-accent),transparent)}
        .india-mic-wave i{width:2px;border-radius:4px;background:var(--iv-bright);opacity:.8;animation:iv-wave 1s ease-in-out infinite alternate}.india-mic-stage:not(.is-speaking) .india-mic-wave i{animation-duration:2.3s;opacity:.4}
        .india-mic-stage button{position:relative;display:grid;width:154px;height:154px;place-items:center;border:1px solid rgba(69,221,206,.52);border-radius:50%;background:radial-gradient(circle,#0c3431 0,#061916 58%,#020706 100%);box-shadow:0 0 28px rgba(69,221,206,.16),inset 0 0 35px rgba(69,221,206,.12);cursor:pointer}
        .india-mic-stage button:before,.india-mic-stage button:after{content:"";position:absolute;border:1px solid rgba(69,221,206,.12);border-radius:50%}.india-mic-stage button:before{inset:-38px}.india-mic-stage button:after{inset:-72px}
        .india-mic-ring{position:absolute;border:1px solid rgba(69,221,206,.28);border-radius:50%}.india-mic-ring-one{inset:-22px;border-style:dashed;animation:iv-spin 15s linear infinite}.india-mic-ring-two{inset:15px;box-shadow:0 0 20px rgba(69,221,206,.18)}
        .india-mic-core{display:grid;width:86px;height:86px;place-items:center;border-radius:50%;background:rgba(69,221,206,.08);box-shadow:0 0 24px rgba(69,221,206,.16)}.india-mic-core svg{width:47px;fill:none;stroke:var(--iv-bright);stroke-width:3;stroke-linecap:round}
        .is-speaking .india-mic-core{animation:iv-pulse 1s ease-in-out infinite}.india-agent>strong{display:block;color:rgba(255,255,255,.68);font-size:.76rem;font-weight:600}.india-listening-dots{display:flex;justify-content:center;gap:.5rem;margin-top:.9rem}.india-listening-dots i{width:5px;height:5px;border-radius:50%;background:#123531}.india-listening-dots .is-lit{background:var(--iv-accent);box-shadow:0 0 8px var(--iv-accent)}
        .india-agent-reply{max-width:360px;margin:1.15rem auto 0;padding:.8rem 1rem;border:1px solid rgba(69,221,206,.12);border-radius:14px;background:rgba(69,221,206,.025);opacity:.68;transition:border-color .2s,background .2s,opacity .2s,transform .2s}.india-agent-reply.is-speaking{border-color:rgba(69,221,206,.38);background:rgba(69,221,206,.07);box-shadow:0 0 24px rgba(69,221,206,.08);opacity:1;transform:translateY(-2px)}.india-agent-reply span{display:block;color:var(--iv-bright);font-size:.57rem;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.india-agent-reply p{margin:.4rem 0 0;color:rgba(255,255,255,.68);font-size:.7rem;line-height:1.5}
        .india-world{display:flex;flex-direction:column;align-items:center}.india-globe-wrap{position:relative;width:min(100%,340px);aspect-ratio:1;display:grid;place-items:center}.india-globe-aura{position:absolute;inset:12%;border-radius:50%;background:var(--iv-accent);filter:blur(44px);opacity:.12}
        .india-globe{position:relative;width:78%;height:78%;overflow:hidden;border:1px solid rgba(117,255,240,.58);border-radius:50%;background:radial-gradient(circle at 34% 28%,#123b37 0,#061714 48%,#010403 73%);box-shadow:0 0 22px rgba(69,221,206,.38),inset -25px -18px 42px #000,inset 8px 4px 24px rgba(117,255,240,.17)}
        .india-globe-shine{position:absolute;z-index:4;inset:0;border-radius:50%;background:linear-gradient(115deg,rgba(161,255,245,.13),transparent 34%,transparent 70%,rgba(0,0,0,.58));pointer-events:none}
        .india-globe-map{position:absolute;z-index:2;inset:0;width:100%;height:100%}.india-globe-graticule{fill:none;stroke:rgba(117,255,240,.15);stroke-width:1}.india-globe-land{fill:url(#indiaMapDots);stroke:var(--iv-accent);stroke-width:1.35;stroke-linejoin:round;opacity:.72;filter:url(#indiaMapGlow)}.india-globe-focus-pulse{fill:url(#indiaFocusGlow);transform-box:fill-box;transform-origin:center;animation:iv-india-pulse 2.8s ease-in-out infinite}.india-globe-focus{filter:drop-shadow(0 0 5px rgba(182,255,118,.85))}.india-globe-routes{fill:none;stroke:rgba(117,255,240,.58);stroke-width:1.15;stroke-linecap:round;stroke-dasharray:4 5}.india-globe-routes circle{fill:var(--iv-bright);stroke:none;filter:drop-shadow(0 0 3px var(--iv-accent))}
        .india-globe-orbit{position:absolute;z-index:6;width:98%;height:35%;border:1px solid rgba(69,221,206,.32);border-radius:50%;transform:rotate(-17deg);animation:iv-orbit 9s linear infinite}.india-globe-orbit-two{width:105%;height:28%;transform:rotate(30deg);animation-duration:13s;animation-direction:reverse}.india-globe-orbit-three{width:90%;height:50%;transform:rotate(72deg);animation-duration:17s}.india-globe-orbit i{position:absolute;left:20%;top:-4px;width:7px;height:7px;border-radius:50%;background:var(--iv-bright);box-shadow:0 0 12px var(--iv-bright)}
        .india-world-features{width:100%;margin-top:.25rem;padding-left:1.1rem;border-left:1px solid rgba(69,221,206,.12)}.india-world-features>div{display:flex;align-items:center;gap:.9rem;padding:.55rem 0}.india-world-features svg{width:27px;fill:none;stroke:var(--iv-accent);stroke-width:2}.india-world-features span{display:flex;flex-direction:column;gap:.2rem}.india-world-features strong{font-size:.76rem}.india-world-features small{color:rgba(255,255,255,.38);font-size:.64rem}
        @keyframes iv-wave{from{transform:scaleY(.5);opacity:.45}to{transform:scaleY(1.12);opacity:1}}@keyframes iv-spin{to{transform:rotate(360deg)}}@keyframes iv-pulse{50%{transform:scale(1.08);box-shadow:0 0 35px rgba(69,221,206,.3)}}@keyframes iv-india-pulse{50%{transform:scale(1.18);opacity:.5}}@keyframes iv-orbit{to{rotate:360deg}}
        @media(max-width:1050px){.india-voice-experience{width:calc(100% - 3rem);padding-inline:.5rem}.india-voice-layout{grid-template-columns:1fr 1fr}.india-world{grid-column:1/-1;display:grid;grid-template-columns:minmax(280px,400px) 280px;justify-content:center}.india-globe-wrap{width:340px}.india-world-features{margin:0;align-self:center}}
        @media(max-width:720px){.india-voice-experience{width:calc(100% - 2rem);margin-top:1.5rem;padding:3.5rem 0 4rem}.india-voice-layout{grid-template-columns:minmax(0,1fr);gap:3.25rem}.india-voice-copy{text-align:center}.india-voice-copy>p{margin-inline:auto}.india-voice-eyebrow{justify-content:center}.india-language-list{text-align:left}.india-agent{padding-top:.5rem}.india-world{grid-column:auto;display:flex}.india-globe-wrap{width:min(100%,340px)}.india-world-features{max-width:300px}.india-mic-stage{height:300px}}
        @media(max-width:540px){.india-voice-copy{width:100%;min-width:0;max-width:100%;overflow:hidden}.india-language-list{box-sizing:border-box;width:100%;max-width:100%;grid-template-columns:minmax(0,1fr)}.india-language-list button{box-sizing:border-box;width:100%;max-width:100%;grid-template-columns:36px minmax(0,1fr);overflow:hidden}.india-language-native{overflow:hidden;text-overflow:ellipsis}.india-voice-copy h2{font-size:2.15rem;overflow-wrap:anywhere}.india-mic-wave{right:-8%;left:-8%}}
        @media(prefers-reduced-motion:reduce){.india-voice-experience *{animation:none!important}}
      `}</style>
    </section>
  );
}
