"use client";

import { useState } from "react";
import Image from "next/image";

const voiceCapabilities = [
  "Lead Qualification",
  "AI Receptionist",
  "Appointment Booking",
  "Inbound Support",
  "Outbound Follow-ups",
  "CRM Updates",
  "Payment Reminders",
  "Call Summaries",
];

const languageOptions = [
  {
    code: "EN",
    name: "English",
    tone: "#45ddce",
    patient: "Can I book an appointment with the doctor?",
    reply: "Yes! Dr. Patel has an opening tomorrow at 4 PM. Shall I book it?",
    translated: "translated live - English",
    cta: "Try Vozon in English",
  },
  {
    code: "ES",
    name: "Spanish",
    tone: "#f28d45",
    patient: "¿Puedo reservar una cita con el doctor?",
    reply: "Si. El Dr. Patel tiene un espacio manana a las 4 PM. ¿Lo reservo?",
    translated: "translated live - Spanish",
    cta: "Try Vozon in Spanish",
  },
  {
    code: "FR",
    name: "French",
    tone: "#f28d45",
    patient: "Puis-je prendre rendez-vous avec le docteur ?",
    reply: "Oui. Le Dr Patel est disponible demain a 16 h. Je reserve ?",
    translated: "translated live - French",
    cta: "Try Vozon in French",
  },
  {
    code: "DE",
    name: "German",
    tone: "#8f83e8",
    patient: "Kann ich einen Termin beim Arzt buchen?",
    reply: "Ja. Dr. Patel hat morgen um 16 Uhr Zeit. Soll ich buchen?",
    translated: "translated live - German",
    cta: "Try Vozon in German",
  },
  {
    code: "PT",
    name: "Portuguese",
    tone: "#f2d24b",
    patient: "Posso marcar uma consulta com o medico?",
    reply: "Sim. O Dr. Patel tem horario amanha as 16h. Posso marcar?",
    translated: "translated live - Portuguese",
    cta: "Try Vozon in Portuguese",
  },
  {
    code: "HI",
    name: "Hindi",
    tone: "#f28d45",
    patient: "क्या मैं डॉक्टर से अपॉइंटमेंट बुक कर सकती हूं?",
    reply: "हां. डॉ. पटेल के पास कल शाम 4 बजे समय है. क्या मैं बुक कर दूं?",
    translated: "translated live - Hindi",
    cta: "Try Vozon in Hindi",
  },
  {
    code: "AR",
    name: "Arabic",
    tone: "#8bc5ec",
    patient: "هل يمكنني حجز موعد مع الطبيب؟",
    reply: "نعم. لدى الدكتور باتيل موعد غدا الساعة 4 مساء. هل احجزه؟",
    translated: "translated live - Arabic",
    cta: "Try Vozon in Arabic",
  },
  {
    code: "ZH",
    name: "Mandarin",
    tone: "#45ddce",
    patient: "我可以预约医生吗？",
    reply: "可以。Patel 医生明天下午 4 点有空。要我帮您预约吗？",
    translated: "translated live - Mandarin",
    cta: "Try Vozon in Mandarin",
  },
];

const languageStats = [
  ["8+", "Languages"],
  ["95%", "Sounds native"],
  ["0.8s", "Avg. reply time"],
];

const circuitNodes = [
  ["Conversation AI", "left-[5%] top-[16%]"],
  ["CRM Intelligence", "left-[7%] bottom-[15%]"],
  ["Voice Operations", "right-[5%] top-[16%]"],
  ["Workflow Engine", "right-[7%] bottom-[15%]"],
];

function GlowButton({ children, href }: { children: string; href: string }) {
  return (
    <a
      className="vozon-glow-button inline-flex min-h-12 items-center justify-center rounded-[14px] px-7 text-sm font-black text-[#02110d]"
      href={href}
    >
      {children}
    </a>
  );
}

function CircuitHero() {
  return (
    <div className="vozon-circuit relative mx-auto mt-14 h-[380px] w-full max-w-[1040px] overflow-hidden max-lg:h-[330px] max-sm:h-[270px]">
      <div className="vozon-dust absolute left-1/2 top-1/2 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full max-sm:size-[250px]" />
      <div className="vozon-orbit absolute left-1/2 top-1/2 z-10 size-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#27f4d2]/12 max-sm:size-[220px]" />
      <div className="vozon-orbit vozon-orbit-reverse absolute left-1/2 top-1/2 z-10 size-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8afff2]/10 max-sm:size-[168px]" />

      <svg
        className="absolute inset-x-0 top-1/2 z-10 mx-auto h-[250px] w-full max-w-[980px] -translate-y-1/2 overflow-visible max-sm:h-[190px]"
        fill="none"
        viewBox="0 0 980 250"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="vozonCircuitLine" x1="110" x2="870" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0d4743" stopOpacity="0" />
            <stop offset="0.24" stopColor="#22f4d2" stopOpacity="0.74" />
            <stop offset="0.5" stopColor="#59fff0" stopOpacity="0.48" />
            <stop offset="0.76" stopColor="#22f4d2" stopOpacity="0.74" />
            <stop offset="1" stopColor="#0d4743" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="url(#vozonCircuitLine)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
          <path d="M120 58H250L318 104H414" />
          <path d="M120 192H250L318 146H414" />
          <path d="M860 58H730L662 104H566" />
          <path d="M860 192H730L662 146H566" />
          <path d="M304 125H414" opacity="0.72" />
          <path d="M566 125H676" opacity="0.72" />
        </g>
        <g fill="#22f4d2">
          {[318, 414, 566, 662].map((cx, index) => (
            <circle className="vozon-circuit-dot" cx={cx} cy={index % 2 === 0 ? 104 : 146} key={index} r="3.5" />
          ))}
        </g>
      </svg>

      <div className="absolute left-1/2 top-1/2 z-20 grid size-56 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#1df7cf]/45 bg-[radial-gradient(circle_at_50%_38%,rgba(46,255,224,0.22),rgba(2,17,14,0.88)_54%,rgba(0,0,0,0.72)_100%)] shadow-[0_0_90px_rgba(26,244,205,0.2)] max-sm:size-40">
        <div className="absolute inset-4 rounded-full border border-[#1fcfb4]/28" />
        <div className="absolute inset-10 rounded-full border border-[#25e6cb]/36 max-sm:inset-7" />
        <div className="absolute inset-16 rounded-full border border-[#25e6cb]/30 max-sm:inset-11" />
        <div className="relative z-10 grid min-h-24 w-28 place-items-center rounded-[24px] border border-[#22e7ca]/60 bg-[#061b18]/92 px-3 text-center shadow-[0_0_38px_rgba(33,244,207,0.32)] max-sm:min-h-16 max-sm:w-20 max-sm:rounded-[18px]">
          <span className="text-[11px] font-semibold uppercase text-white/50 max-sm:text-[8px]">Vozon</span>
          <span className="text-lg font-black leading-tight text-[#69fff0] max-sm:text-xs">Core Hub</span>
        </div>
      </div>

      {circuitNodes.map(([label, position]) => (
        <div
          className={`vozon-node-chip absolute z-30 grid min-h-16 w-[168px] place-items-center rounded-2xl border border-[#1cf4c8]/38 bg-[#06201c]/88 px-4 text-center text-sm font-black leading-tight text-[#d9fff9] shadow-[0_0_26px_rgba(30,245,207,0.16)] backdrop-blur max-lg:w-[150px] max-sm:min-h-11 max-sm:w-[104px] max-sm:rounded-xl max-sm:px-2 max-sm:text-[10px] ${position}`}
          key={label}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export function HomePlatformSections() {
  const [selectedLanguageCode, setSelectedLanguageCode] = useState("EN");
  const selectedLanguage =
    languageOptions.find((language) => language.code === selectedLanguageCode) ?? languageOptions[0];

  return (
    <div className="vozon-home relative isolate overflow-hidden bg-[#000503] text-white">
      <div className="vozon-stars absolute inset-0 -z-10" />
      <div className="vozon-grid absolute inset-0 -z-10" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[760px] bg-[radial-gradient(circle_at_50%_0%,rgba(36,255,207,0.26),transparent_35%),radial-gradient(circle_at_3%_4%,rgba(24,216,184,0.27),transparent_26%),radial-gradient(circle_at_95%_4%,rgba(0,117,109,0.34),transparent_28%)]" />

      <section id="product" className="relative mx-auto min-h-screen max-w-[1280px] px-5 pb-10 pt-28 text-center sm:px-8 lg:pt-32">
        <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/8 px-4 py-2 text-xs font-semibold text-white/80 shadow-[inset_0_0_22px_rgba(255,255,255,0.04)] backdrop-blur">
          <span className="size-2 rounded-full bg-[#22f4d2] shadow-[0_0_14px_#22f4d2]" />
          Voice Agents Live Now
        </div>
        <h1 className="mx-auto m-0 max-w-5xl text-[clamp(2.45rem,7vw,5.7rem)] font-black leading-[0.98] tracking-[-0.03em] text-[#dbfff8]">
          Launch enterprise-ready{" "}
          <span className="vozon-gradient-text">AI voice agents</span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-white/56 sm:text-base">
          vozon.ai helps teams answer every call, qualify every lead, book every next step, and turn conversations into clean workflows for sales, support, and operations.
        </p>
        <div className="mt-8 flex justify-center">
          <GlowButton href="/dashboard">Deploy Now</GlowButton>
        </div>
        <CircuitHero />
        <div className="mx-auto -mt-8 flex max-w-5xl flex-wrap justify-center gap-3 max-sm:mt-3">
          {voiceCapabilities.map((capability) => (
            <span
              className="rounded-full border border-[#1beac7]/25 bg-white/[0.06] px-4 py-2 text-xs font-bold text-white/70 backdrop-blur"
              key={capability}
            >
              {capability}
            </span>
          ))}
        </div>
      </section>

      <section className="vozon-language-section relative mx-auto grid max-w-[1280px] items-stretch gap-12 px-5 pb-16 pt-4 sm:px-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-16">
        <div className="relative flex min-h-[640px] flex-col justify-center py-10 max-lg:min-h-0">
          <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-[#f28d45]/38 bg-[#f28d45]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-[#ff9e49]">
            <span className="size-1.5 rounded-full bg-[#ff9e49]" />
            Multilingual Voice AI
          </div>

          <h2 className="m-0 max-w-[720px] text-[clamp(2.55rem,5.3vw,4.75rem)] font-black leading-[1] tracking-[-0.03em] text-[#f4fff9]">
            Sounds like <span className="text-[#45ddce]">home</span>, wherever home is.
          </h2>

          <p className="mt-7 max-w-[600px] text-base leading-7 text-[#c9fff7]/84">
            Vozon picks up in whatever language your customer is already speaking, with natural replies, live translation, and human handoff when it matters.
          </p>

          <div className="mt-9 flex max-w-[720px] flex-wrap gap-3">
            {languageOptions.map((language) => (
              <button
                aria-pressed={selectedLanguage.code === language.code}
                className={`vozon-language-pill inline-flex min-h-11 items-center gap-3 rounded-full border px-4 pr-5 text-[13px] font-black text-white transition ${
                  selectedLanguage.code === language.code
                    ? "border-[#45ddce] bg-[#45ddce]/12 shadow-[0_0_24px_rgba(69,221,206,0.2)]"
                    : "border-white/10 bg-white/[0.045]"
                }`}
                key={language.code}
                onClick={() => setSelectedLanguageCode(language.code)}
                type="button"
              >
                <span
                  className="grid size-7 place-items-center rounded-full text-[10px] font-black text-[#02110d]"
                  style={{ backgroundColor: language.tone }}
                >
                  {language.code}
                </span>
                {language.name}
              </button>
            ))}
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-6">
            {languageStats.map(([value, label]) => (
              <div key={label}>
                <strong className="block text-[1.7rem] font-black text-[#22f4d2]">{value}</strong>
                <span className="mt-2 block text-[11px] font-black uppercase tracking-[0.12em] text-white/42">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-black/20 px-5 py-3 text-[13px] text-white/78">
            <span className="font-black tracking-[0.16em] text-[#ffb234]">*****</span>
            <span>4.9 from 12,000+ people who have talked to Vozon</span>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a className="vozon-language-cta inline-flex min-h-14 min-w-[260px] items-center justify-center rounded-full px-7 text-[15px] font-black text-[#02110d]" href="#platform">
              {selectedLanguage.cta}
              <span className="ml-3" aria-hidden="true">-&gt;</span>
            </a>
            <span className="text-sm text-white/42">No card needed</span>
          </div>
        </div>

        <div className="relative flex min-h-[640px] items-stretch justify-center py-6 max-lg:min-h-[620px]">
          <div className="vozon-iphone relative flex h-full min-h-[620px] w-full max-w-[430px] flex-col overflow-hidden rounded-[58px] border-[14px] border-[#202a26] bg-[#020806] shadow-[0_34px_120px_rgba(0,0,0,0.58),0_0_80px_rgba(69,221,206,0.09)]">
            <div className="absolute left-1/2 top-4 z-30 h-10 w-32 -translate-x-1/2 rounded-full bg-black" />
            <div className="absolute left-8 right-8 top-7 z-30 flex items-center justify-between text-xs font-black text-white">
              <span>9:41</span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-5 rounded-[4px] border border-white/90" />
                <span className="h-2 w-1 rounded-full bg-white/90" />
              </span>
            </div>

            <div className="relative z-10 flex items-center gap-4 border-b border-white/8 px-7 pb-5 pt-16">
              <div className="grid size-14 place-items-center rounded-full bg-[#45ddce] shadow-[0_0_0_5px_rgba(69,221,206,0.18)]">
                <div className="vozon-mini-avatar relative size-10 overflow-hidden rounded-full bg-[#ffd3a2]" />
              </div>
              <div>
                <h3 className="m-0 text-lg font-black text-white">Vozon Clinic</h3>
                <p className="mt-1 text-xs font-bold text-[#45ddce]">Active now <span className="text-white/55">- {selectedLanguage.name}</span></p>
              </div>
            </div>

            <div className="relative z-10 flex flex-1 flex-col items-center px-8 py-6 text-center">
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-white/42">Patient said</p>
              <p className="m-0 text-sm font-black leading-6 text-white/90">&quot;{selectedLanguage.patient}&quot;</p>

              <div className="vozon-call-orbit relative mt-8 grid size-[245px] place-items-center rounded-full">
                <span className="absolute inset-0 rounded-full border border-[#45ddce]/13" />
                <span className="absolute inset-5 rounded-full border border-[#45ddce]/20" />
                <span className="absolute inset-10 rounded-full border border-[#45ddce]/36" />
                <svg className="vozon-agent-avatar relative z-10 size-40 overflow-visible" viewBox="0 0 180 180" aria-hidden="true">
                  <defs>
                    <linearGradient id="vozonAvatarShell" x1="47" x2="135" y1="33" y2="151" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f8fffb" />
                      <stop offset="0.58" stopColor="#9df6e7" />
                      <stop offset="1" stopColor="#11897b" />
                    </linearGradient>
                    <linearGradient id="vozonAvatarVisor" x1="54" x2="126" y1="74" y2="112" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#061412" />
                      <stop offset="1" stopColor="#0f3d37" />
                    </linearGradient>
                    <linearGradient id="vozonAvatarGlow" x1="56" x2="124" y1="122" y2="167" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#45ddce" />
                      <stop offset="1" stopColor="#246bff" />
                    </linearGradient>
                  </defs>
                  <circle cx="90" cy="92" r="72" fill="#123832" opacity="0.42" />
                  <circle cx="90" cy="92" r="61" fill="none" stroke="#45ddce" strokeOpacity="0.28" strokeWidth="3" />
                  <path d="M45 86c0-31 20-53 45-53s45 22 45 53v20c0 30-20 52-45 52s-45-22-45-52V86Z" fill="url(#vozonAvatarShell)" />
                  <path d="M56 78c5-14 18-23 34-23s29 9 34 23c-11-4-22-6-34-6s-23 2-34 6Z" fill="#ffffff" opacity="0.5" />
                  <rect x="52" y="75" width="76" height="44" rx="22" fill="url(#vozonAvatarVisor)" stroke="#45ddce" strokeOpacity="0.65" strokeWidth="3" />
                  <circle cx="75" cy="96" r="7" fill="#45ddce" />
                  <circle cx="105" cy="96" r="7" fill="#45ddce" />
                  <circle cx="77" cy="94" r="2" fill="#eafffb" />
                  <circle cx="107" cy="94" r="2" fill="#eafffb" />
                  <rect className="vozon-avatar-mouth" x="78" y="110" width="24" height="5" rx="3" fill="#80fff1" />
                  <path d="M62 137c8 10 17 15 28 15s20-5 28-15" stroke="#0c4d45" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.62" />
                  <path d="M57 144c8-14 19-21 33-21s25 7 33 21c-8 13-19 20-33 20s-25-7-33-20Z" fill="url(#vozonAvatarGlow)" opacity="0.92" />
                  <path d="M68 143h44" stroke="#eafffb" strokeOpacity="0.52" strokeWidth="3" strokeLinecap="round" />
                  <path d="M44 91c-11 4-17 14-17 28 0 13 7 23 19 27" stroke="#45ddce" strokeOpacity="0.88" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M136 91c11 4 17 14 17 28 0 13-7 23-19 27" stroke="#45ddce" strokeOpacity="0.88" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <circle cx="45" cy="119" r="10" fill="#081a17" stroke="#45ddce" strokeWidth="4" />
                  <circle cx="135" cy="119" r="10" fill="#081a17" stroke="#45ddce" strokeWidth="4" />
                  <path d="M134 145c-8 9-19 14-32 14" stroke="#45ddce" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="99" cy="159" r="4" fill="#45ddce" />
                  <path d="M88 29v-12" stroke="#45ddce" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="88" cy="12" r="7" fill="#45ddce" />
                </svg>
                <span className="absolute bottom-11 right-10 z-20 grid size-10 place-items-center rounded-full bg-[#20d7c4] text-lg font-black text-[#02110d] shadow-[0_0_24px_rgba(32,215,196,0.4)]">m</span>
              </div>

              <div className="mt-1 flex h-5 items-center gap-1">
                {Array.from({ length: 30 }).map((_, index) => (
                  <span
                    className="vozon-call-wave block w-1 rounded-full bg-[#45ddce]"
                    key={index}
                    style={{ height: `${4 + (index % 5) * 2}px`, animationDelay: `${index * 35}ms` }}
                  />
                ))}
              </div>

              <p className="mt-7 mb-0 max-w-xs text-base font-black leading-7 text-white/88">
                {selectedLanguage.reply}
              </p>
              <p className="mt-2 text-xs italic text-white/38">{selectedLanguage.translated}</p>
            </div>

            <div className="relative z-10 grid grid-cols-4 gap-5 border-t border-white/8 px-12 py-7">
              {["mic", "play", "vol", "call"].map((control) => (
                <button
                  aria-label={control}
                  className={`grid size-14 place-items-center rounded-full border text-sm font-black ${
                    control === "call"
                      ? "border-[#ff5b4f] bg-[#ff5b4f] text-white"
                      : "border-white/10 bg-white/[0.06] text-white"
                  }`}
                  key={control}
                  type="button"
                >
                  {control === "mic" ? "m" : control === "play" ? ">" : control === "vol" ? "<" : "~"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1240px] px-5 pb-12 pt-2 sm:px-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-[#75fff0]">
            One Platform
          </div>
          <h2 className="m-0 text-[clamp(1.85rem,3.8vw,3rem)] font-black leading-tight tracking-[-0.03em] text-white">
            Every AI voice layer connected in one place
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/54">
            LLMs, speech, realtime, vision, and external tools stay coordinated through the Vozon agent layer.
          </p>
        </div>

        <div className="vozon-platform-map relative overflow-hidden rounded-[28px] border border-[#48db8b]/30 bg-[#020b0a] shadow-[0_28px_110px_rgba(72,219,139,0.13)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(72,219,139,0.28),transparent_34%),radial-gradient(circle_at_12%_0%,rgba(142,255,217,0.1),transparent_30%),linear-gradient(180deg,rgba(0,5,3,0.1),rgba(0,5,3,0.58))]" />
          <Image
            alt="Vozon AI platform connected to LLM, realtime, speech, vision, and external services"
            className="relative z-10 block aspect-[16/9] w-full object-cover opacity-[0.92] mix-blend-screen"
            height={788}
            priority={false}
            src="/images/one_platform.jpeg"
            width={1400}
          />
          <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(0,5,3,0.34)_0%,transparent_18%,transparent_68%,rgba(72,219,139,0.32)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-28 bg-[radial-gradient(ellipse_at_50%_100%,rgba(142,255,217,0.5),rgba(72,219,139,0.24)_38%,transparent_72%)]" />
        </div>
      </section>


      <style>{`
        .vozon-home {
          font-family: var(--font-site-sans), ui-sans-serif, system-ui, sans-serif;
        }

        .vozon-gradient-text {
          background: linear-gradient(90deg, #eafffb 0%, #62fff0 45%, #1de8b9 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 38px rgba(38, 244, 210, 0.16);
        }

        .vozon-stars {
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.75) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(33,244,207,0.42) 0 1px, transparent 1.5px);
          background-size: 190px 190px, 310px 310px;
          background-position: 28px 40px, 120px 90px;
          opacity: 0.72;
        }

        .vozon-grid {
          background:
            linear-gradient(rgba(55,255,217,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(55,255,217,0.035) 1px, transparent 1px);
          background-size: 100% 110px, 110px 100%;
          mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 92%, transparent 100%);
        }

        .vozon-glow-button {
          background: linear-gradient(135deg, #1acfff 0%, #20f4d0 48%, #48db8b 100%);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.28), 0 16px 38px rgba(31,244,208,0.22);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .vozon-glow-button:hover,
        .vozon-small-button:hover {
          transform: translateY(-2px);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.34), 0 20px 46px rgba(31,244,208,0.28);
        }

        .vozon-small-button {
          background: linear-gradient(135deg, rgba(11,109,132,0.82), rgba(29,244,203,0.22), rgba(43,219,141,0.7));
          box-shadow: inset 0 0 0 1px rgba(54,255,222,0.24), 0 14px 34px rgba(29,244,203,0.12);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .vozon-card {
          position: relative;
          overflow: hidden;
        }

        .vozon-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(135deg, rgba(37,244,210,0.14), transparent 32%),
            repeating-linear-gradient(135deg, transparent 0 14px, rgba(37,244,210,0.08) 15px 16px, transparent 17px 30px);
          mask-image: linear-gradient(135deg, transparent 0%, black 65%, transparent 100%);
          opacity: 0.48;
        }

        .vozon-card > * {
          position: relative;
          z-index: 1;
        }

        .vozon-language-section {
          background:
            radial-gradient(circle at 82% 52%, rgba(69,221,206,0.1), transparent 34%),
            radial-gradient(circle at 12% 20%, rgba(72,219,139,0.08), transparent 28%);
        }

        .vozon-language-pill:hover {
          border-color: rgba(69,221,206,0.7);
          background: rgba(69,221,206,0.1);
          transform: translateY(-2px);
        }

        .vozon-language-cta {
          background: linear-gradient(135deg, #24d8be 0%, #72f0d0 100%);
          box-shadow: 0 18px 42px rgba(36,216,190,0.24);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .vozon-language-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 52px rgba(36,216,190,0.3);
        }

        .vozon-platform-map {
          background:
            radial-gradient(circle at 50% 100%, rgba(72,219,139,0.26), transparent 36%),
            linear-gradient(180deg, #000503 0%, #02110d 100%);
        }

        .vozon-platform-map img {
          filter: saturate(0.95) hue-rotate(-64deg) contrast(1.06);
        }

        .vozon-infinite-panel {
          background:
            linear-gradient(135deg, rgba(255,255,255,0.06), transparent 32%),
            linear-gradient(160deg, rgba(69,221,206,0.08), rgba(242,141,69,0.045) 46%, rgba(143,131,232,0.08)),
            rgba(3,19,15,0.9);
        }

        .vozon-infinite-panel::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          pointer-events: none;
          background:
            radial-gradient(circle at 16% 20%, rgba(114,255,240,0.12), transparent 24%),
            radial-gradient(circle at 88% 12%, rgba(242,210,75,0.11), transparent 26%),
            linear-gradient(145deg, rgba(31,244,208,0.08), transparent 52%);
          opacity: 0.86;
        }

        .vozon-command-panel {
          background:
            radial-gradient(circle at 50% 38%, rgba(37,244,210,0.22), transparent 31%),
            radial-gradient(circle at 48% 74%, rgba(37,244,210,0.18), transparent 28%),
            radial-gradient(circle at 12% 16%, rgba(39,214,255,0.09), transparent 28%),
            radial-gradient(circle at 88% 18%, rgba(72,219,139,0.1), transparent 28%),
            linear-gradient(180deg, rgba(72,219,139,0.05), transparent 42%),
            linear-gradient(180deg, #010b0a 0%, #020d0b 100%);
          box-shadow:
            inset 0 0 0 1px rgba(95,255,237,0.04),
            inset 0 0 92px rgba(37,244,210,0.06),
            0 28px 120px rgba(29,244,203,0.15);
        }

        .vozon-command-room {
          background:
            radial-gradient(ellipse at 50% 98%, rgba(46,255,224,0.26), transparent 43%),
            radial-gradient(ellipse at 50% 17%, rgba(22,201,189,0.16), transparent 42%),
            linear-gradient(90deg, rgba(37,244,210,0.11), transparent 19%, transparent 81%, rgba(37,244,210,0.11)),
            linear-gradient(rgba(67,255,225,0.038) 1px, transparent 1px),
            linear-gradient(90deg, rgba(67,255,225,0.032) 1px, transparent 1px);
          background-size: auto, auto, auto, 58px 58px, 58px 58px;
          mask-image: linear-gradient(to bottom, black 0%, black 72%, transparent 100%);
        }

        .vozon-command-aurora {
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 42%, rgba(123,255,244,0.22), transparent 23%),
            radial-gradient(circle at 50% 56%, rgba(37,244,210,0.12), transparent 30%),
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.08) 58%, rgba(0,0,0,0.48) 100%);
          mix-blend-mode: screen;
          opacity: 0.76;
        }

        .vozon-command-dashboard {
          position: absolute;
          z-index: 2;
          display: grid;
          gap: 0.5rem;
          min-height: 84px;
          padding: 0.9rem;
          border: 1px solid rgba(37,244,210,0.28);
          border-radius: 10px;
          background:
            linear-gradient(135deg, rgba(37,244,210,0.14), transparent 48%),
            linear-gradient(rgba(37,244,210,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,244,210,0.035) 1px, transparent 1px),
            rgba(3,25,22,0.58);
          background-size: auto, 100% 24px, auto;
          box-shadow:
            inset 0 0 28px rgba(37,244,210,0.075),
            0 0 22px rgba(37,244,210,0.07),
            0 14px 34px rgba(0,0,0,0.18);
          opacity: 0.64;
          backdrop-filter: blur(10px);
        }

        .vozon-command-dashboard i {
          display: block;
          width: 22px;
          height: 3px;
          border-radius: 999px;
          background: rgba(114,255,240,0.56);
          box-shadow: 0 0 12px rgba(114,255,240,0.34);
        }

        .vozon-command-dashboard i:nth-child(2) {
          width: 7px;
          height: 7px;
          background: #5effeb;
        }

        .vozon-command-dashboard span {
          display: block;
          height: 6px;
          align-self: end;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(37,244,210,0.8), rgba(242,210,75,0.34));
          box-shadow: 0 0 12px rgba(37,244,210,0.24);
        }

        .vozon-command-bars {
          display: flex;
          align-items: end;
          justify-content: center;
          gap: 0.42rem;
          min-height: 62px;
        }

        .vozon-command-bars span {
          min-width: 8px;
          border-radius: 999px 999px 3px 3px;
          background: linear-gradient(180deg, #6ffff0, rgba(37,244,210,0.64) 62%, rgba(242,141,69,0.42));
          box-shadow: 0 0 16px rgba(95,255,237,0.35);
        }

        .vozon-command-room::before,
        .vozon-command-room::after {
          content: "";
          position: absolute;
          bottom: 108px;
          width: 42%;
          height: 305px;
          border: 1px solid rgba(37,244,210,0.16);
          background:
            linear-gradient(rgba(37,244,210,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,244,210,0.05) 1px, transparent 1px),
            rgba(3,25,22,0.38);
          background-size: 100% 34px, 42px 100%, auto;
          box-shadow: inset 0 0 34px rgba(37,244,210,0.04);
          opacity: 0.36;
        }

        .vozon-command-room::before {
          left: -4%;
          transform: perspective(500px) rotateY(16deg);
          border-radius: 0 18px 18px 0;
        }

        .vozon-command-room::after {
          right: -4%;
          transform: perspective(500px) rotateY(-16deg);
          border-radius: 18px 0 0 18px;
        }

        .vozon-holo-screen {
          box-shadow:
            inset 0 0 22px rgba(37,244,210,0.04),
            0 10px 26px rgba(0,0,0,0.16);
        }

        .vozon-infinite-orbit {
          animation: vozonInfiniteOrbit 42s linear infinite;
          box-shadow:
            0 0 42px rgba(37,244,210,0.12),
            inset 0 0 48px rgba(37,244,210,0.08);
        }

        .vozon-infinite-orbit::before,
        .vozon-infinite-orbit::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          background: #77fff1;
          box-shadow: 0 0 20px rgba(119,255,241,0.9);
        }

        .vozon-infinite-orbit::before {
          left: 18%;
          top: 12%;
          width: 8px;
          height: 8px;
        }

        .vozon-infinite-orbit::after {
          right: 19%;
          bottom: 11%;
          width: 6px;
          height: 6px;
          opacity: 0.76;
        }

        .vozon-code-ai-sphere {
          animation: vozonInfiniteFloat 7s ease-in-out infinite;
          overflow: hidden;
          background:
            radial-gradient(circle at 44% 32%, rgba(255,255,255,0.38), transparent 16%),
            radial-gradient(circle at 50% 48%, rgba(126,255,245,0.42), rgba(37,244,210,0.2) 38%, rgba(4,27,24,0.88) 67%, rgba(0,8,6,0.98) 100%);
          backdrop-filter: blur(10px);
        }

        .vozon-code-ai-sphere::before,
        .vozon-code-ai-sphere::after {
          content: "";
          position: absolute;
          inset: -6%;
          border-radius: inherit;
          pointer-events: none;
        }

        .vozon-code-ai-sphere::before {
          background:
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22), transparent 17%),
            radial-gradient(circle at 50% 50%, transparent 41%, rgba(95,255,237,0.56) 44%, transparent 48%),
            radial-gradient(circle at 50% 50%, transparent 66%, rgba(95,255,237,0.72) 69%, transparent 73%);
          filter: drop-shadow(0 0 42px rgba(95,255,237,0.84));
        }

        .vozon-code-ai-sphere::after {
          border: 1px solid rgba(95,255,237,0.2);
          box-shadow:
            inset 0 0 52px rgba(95,255,237,0.2),
            0 0 76px rgba(37,244,210,0.34);
        }

        .vozon-code-ai-rotate {
          animation: vozonReferenceAiMotion 22s linear infinite;
          background:
            conic-gradient(from 0deg, transparent 0deg, rgba(108,255,241,0.72) 18deg, transparent 54deg, transparent 142deg, rgba(36,244,208,0.5) 168deg, transparent 212deg, transparent 360deg);
          opacity: 0.66;
          mix-blend-mode: screen;
          mask-image: radial-gradient(circle, transparent 52%, black 57%, black 70%, transparent 74%);
        }

        .vozon-code-ai-particles {
          background-image:
            radial-gradient(circle, rgba(172,255,248,0.82) 0 1.15px, transparent 1.7px),
            radial-gradient(circle, rgba(53,244,215,0.42) 0 0.9px, transparent 1.6px);
          background-position: 0 0, 18px 12px;
          background-size: 42px 42px, 58px 58px;
          mask-image: radial-gradient(circle, black 0%, black 68%, transparent 78%);
          opacity: 0.3;
          animation: vozonAiParticles 12s linear infinite;
        }

        .vozon-code-ai-network {
          filter: drop-shadow(0 0 14px rgba(111,255,240,0.64));
          mask-image: radial-gradient(circle, black 0%, black 72%, transparent 84%);
        }

        .vozon-command-node {
          animation: vozonCommandNodeFloat 7.4s ease-in-out infinite;
          background:
            radial-gradient(circle at 50% 34%, rgba(205,255,252,0.3), transparent 34%),
            linear-gradient(180deg, rgba(16,87,74,0.92), rgba(4,31,26,0.94));
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.2),
            inset 0 0 22px rgba(114,255,240,0.13),
            0 0 30px rgba(37,244,210,0.42),
            0 0 62px rgba(37,244,210,0.16);
          backdrop-filter: blur(8px);
        }

        .vozon-command-node:nth-of-type(2) {
          animation-delay: -0.9s;
        }

        .vozon-command-node:nth-of-type(3) {
          animation-delay: -1.8s;
        }

        .vozon-command-node:nth-of-type(4) {
          animation-delay: -2.7s;
        }

        .vozon-command-node:nth-of-type(5) {
          animation-delay: -3.6s;
        }

        .vozon-command-node svg {
          width: 34px;
          height: 34px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 3.4;
          filter: drop-shadow(0 0 10px rgba(125,255,244,0.58));
        }

        .vozon-code-beams {
          pointer-events: none;
          mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 74%, transparent 100%);
        }

        .vozon-command-particles {
          pointer-events: none;
          mask-image: radial-gradient(ellipse at 50% 48%, black 0%, black 62%, transparent 82%);
        }

        .vozon-command-particles span {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: #83fff3;
          box-shadow: 0 0 12px rgba(131,255,243,0.92);
          animation: vozonParticleDrift 5.8s ease-in-out infinite;
        }

        .vozon-command-connections {
          filter: drop-shadow(0 0 8px rgba(95,255,237,0.5));
        }

        .vozon-infinite-scan {
          background:
            linear-gradient(90deg, transparent 42%, rgba(125,255,244,0.34) 50%, transparent 58%),
            radial-gradient(circle, transparent 54%, rgba(72,219,139,0.15) 56%, transparent 58%);
          animation: vozonInfiniteScan 8s linear infinite;
          opacity: 0.74;
        }

        .vozon-code-platform {
          border-radius: 999px;
          background:
            radial-gradient(ellipse at 50% 44%, rgba(225,255,253,0.78), rgba(111,255,240,0.42) 15%, rgba(37,244,210,0.18) 32%, transparent 66%),
            radial-gradient(ellipse at 50% 50%, transparent 0 25%, rgba(117,255,240,0.62) 25.6% 26.4%, transparent 27% 43%, rgba(117,255,240,0.42) 43.6% 44.4%, transparent 45% 62%, rgba(117,255,240,0.28) 62.6% 63.4%, transparent 64%),
            linear-gradient(90deg, transparent 0%, rgba(95,255,237,0.28) 50%, transparent 100%);
          box-shadow:
            0 0 76px rgba(37,244,210,0.34),
            inset 0 0 42px rgba(37,244,210,0.28);
        }

        .vozon-code-platform::before,
        .vozon-code-platform::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 999px;
          border: 1px solid rgba(117,255,240,0.45);
          transform: translate(-50%, -50%);
        }

        .vozon-code-platform::before {
          width: 72%;
          height: 54%;
          box-shadow:
            0 0 28px rgba(37,244,210,0.2),
            0 0 0 18px rgba(37,244,210,0.045);
        }

        .vozon-code-platform::after {
          width: 46%;
          height: 32%;
          border-color: rgba(95,255,237,0.68);
          box-shadow:
            0 0 24px rgba(95,255,237,0.28),
            inset 0 0 22px rgba(95,255,237,0.12);
        }

        .vozon-infinite-compass {
          animation: vozonCompassPulse 3.8s ease-in-out infinite;
        }

        .vozon-platform-tile {
          color: var(--tile-accent, #66fff0);
          background:
            linear-gradient(145deg, color-mix(in srgb, var(--tile-accent, #66fff0) 14%, transparent), rgba(255,255,255,0.035) 62%),
            rgba(255,255,255,0.035);
          border-color: color-mix(in srgb, var(--tile-accent, #66fff0) 38%, transparent);
          box-shadow:
            inset 0 0 34px color-mix(in srgb, var(--tile-accent, #66fff0) 10%, transparent),
            0 16px 36px rgba(0,0,0,0.14);
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        .vozon-platform-tile:hover {
          transform: translateY(-3px);
          border-color: color-mix(in srgb, var(--tile-accent, #66fff0) 72%, transparent);
          background:
            linear-gradient(145deg, color-mix(in srgb, var(--tile-accent, #66fff0) 22%, transparent), rgba(255,255,255,0.05) 68%),
            rgba(69,221,206,0.045);
          box-shadow:
            inset 0 0 38px color-mix(in srgb, var(--tile-accent, #66fff0) 15%, transparent),
            0 18px 42px color-mix(in srgb, var(--tile-accent, #66fff0) 14%, transparent);
        }

        .vozon-platform-tile-icon {
          display: grid;
          place-items: center;
          color: var(--tile-accent, #66fff0);
          filter: drop-shadow(0 0 14px color-mix(in srgb, var(--tile-accent, #66fff0) 48%, transparent));
        }

        .vozon-platform-tile svg {
          width: 38px;
          height: 38px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 3.2;
          filter: drop-shadow(0 0 12px rgba(102,255,240,0.36));
        }

        .vozon-iphone::before,
        .vozon-iphone::after {
          content: "";
          position: absolute;
          z-index: 40;
          width: 4px;
          border-radius: 999px;
          background: #202a26;
        }

        .vozon-iphone::before {
          left: -17px;
          top: 160px;
          height: 96px;
          box-shadow: 0 118px 0 #202a26;
        }

        .vozon-iphone::after {
          right: -17px;
          top: 210px;
          height: 82px;
        }

        .vozon-mini-avatar::before {
          content: "";
          position: absolute;
          inset: 7px 5px auto;
          height: 15px;
          border-radius: 999px 999px 12px 12px;
          background: #573016;
        }

        .vozon-mini-avatar::after {
          content: "";
          position: absolute;
          left: 11px;
          top: 19px;
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: #101715;
          box-shadow: 13px 0 0 #101715, 6px 9px 0 -1px #8b4b32;
        }

        .vozon-call-orbit {
          background:
            radial-gradient(circle, rgba(69,221,206,0.2), transparent 42%),
            radial-gradient(circle, rgba(69,221,206,0.05), transparent 68%);
        }

        .vozon-agent-avatar {
          filter: drop-shadow(0 0 0 rgba(69,221,206,0.34)) drop-shadow(0 0 34px rgba(69,221,206,0.28));
        }

        .vozon-avatar-mouth {
          animation: vozonAvatarTalk 0.72s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }

        .vozon-call-wave {
          animation: vozonCallWave 1.1s ease-in-out infinite;
          opacity: 0.72;
          transform-origin: center;
        }

        .vozon-media-dots {
          background-image:
            radial-gradient(circle, rgba(114,255,240,0.62) 0 2px, transparent 2.8px),
            radial-gradient(circle, rgba(37,244,210,0.26) 0 1.5px, transparent 2.4px);
          background-size: 42px 42px, 68px 68px;
          background-position: 0 0, 20px 18px;
          mask-image: radial-gradient(circle at 50% 52%, black 0%, black 46%, transparent 76%);
          opacity: 0.48;
          animation: vozonMediaDots 9s linear infinite;
        }

        .vozon-media-dots::after {
          content: "";
          position: absolute;
          inset: 16%;
          border-radius: 999px;
          border: 1px solid rgba(94,255,235,0.16);
          box-shadow:
            0 0 32px rgba(37,244,210,0.12),
            inset 0 0 28px rgba(37,244,210,0.08);
          animation: vozonMediaPulse 2.8s ease-in-out infinite;
        }

        .vozon-feature-card {
          transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
        }

        .vozon-feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(84,255,229,0.62);
          box-shadow: 0 26px 90px rgba(29,244,203,0.14);
        }

        .vozon-workflow-card {
          transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
        }

        .vozon-workflow-card:hover {
          transform: translateY(-5px);
          border-color: rgba(84,255,229,0.6);
          box-shadow: 0 28px 94px rgba(29,244,203,0.13);
        }

        .vozon-team-member {
          min-height: 335px;
        }

        .vozon-ai-portrait {
          clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
          animation: vozonAgentFloat 6.8s ease-in-out infinite;
        }

        .vozon-team-member:nth-child(2) .vozon-ai-portrait {
          animation-delay: -1.2s;
        }

        .vozon-team-member:nth-child(3) .vozon-ai-portrait {
          animation-delay: -2.4s;
        }

        .vozon-verified {
          box-shadow: 0 0 18px rgba(36,87,255,0.45);
        }

        .vozon-partner-logo {
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        .vozon-partner-logo:hover {
          transform: translateY(-4px);
          border-color: rgba(84,255,229,0.26);
          background: rgba(255,255,255,0.055);
          box-shadow: 0 18px 48px rgba(29,244,203,0.08);
        }

        .vozon-partner-mark {
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border-radius: 14px;
          background: rgba(255,255,255,0.055);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
        }

        .vozon-partner-mark svg {
          width: 30px;
          height: 30px;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 3;
        }

        .vozon-slack-mark svg path:nth-child(1) {
          stroke: #36c5f0;
        }

        .vozon-slack-mark svg path:nth-child(2) {
          stroke: #2eb67d;
        }

        .vozon-slack-mark svg path:nth-child(3) {
          stroke: #ecb22e;
        }

        .vozon-slack-mark svg path:nth-child(4) {
          stroke: #e01e5a;
        }

        .vozon-avatar-wave {
          animation: vozonAvatarWave 1.4s ease-in-out infinite;
          transform-origin: bottom;
        }

        .vozon-feature-visual {
          box-shadow: inset 0 0 46px rgba(37,244,210,0.045), 0 18px 48px rgba(0,0,0,0.2);
        }

        .vozon-workflow-visual {
          box-shadow: inset 0 0 52px rgba(37,244,210,0.05), 0 18px 52px rgba(0,0,0,0.22);
        }

        .vozon-voice-bar {
          animation: vozonVoiceBars 1.2s ease-in-out infinite;
          opacity: 0.68;
          transform-origin: bottom;
        }

        .vozon-dust {
          background:
            radial-gradient(circle at 50% 50%, rgba(240,255,252,0.2), transparent 18%),
            radial-gradient(circle, rgba(47,255,224,0.2), transparent 66%);
          box-shadow: 0 0 115px rgba(47,255,224,0.14);
        }

        .vozon-orbit {
          animation: vozonOrbit 18s linear infinite;
          box-shadow: inset 0 0 42px rgba(37,244,210,0.08);
        }

        .vozon-orbit-reverse {
          animation-direction: reverse;
          animation-duration: 24s;
        }

        .vozon-orbit::before,
        .vozon-orbit::after {
          content: "";
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #77fff1;
          box-shadow: 0 0 18px rgba(119,255,241,0.9);
        }

        .vozon-orbit::before {
          left: 50%;
          top: -4px;
        }

        .vozon-orbit::after {
          bottom: -4px;
          left: 28%;
          opacity: 0.72;
        }

        .vozon-node-chip {
          background:
            linear-gradient(135deg, rgba(255,255,255,0.09), transparent 34%),
            rgba(6,32,28,0.88);
        }

        .vozon-node-chip::before {
          content: "";
          position: absolute;
          inset: 6px;
          border-radius: 12px;
          border: 1px solid rgba(117,255,240,0.08);
          pointer-events: none;
        }

        .vozon-circuit-dot {
          filter: drop-shadow(0 0 9px rgba(34,244,210,0.88));
        }

        @keyframes vozonOrbit {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes vozonInfiniteOrbit {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes vozonReferenceAiMotion {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes vozonReferenceAiPulse {
          0%, 100% {
            opacity: 0.42;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.78;
            transform: scale(1.04);
          }
        }

        @keyframes vozonInfiniteFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }

          50% {
            transform: translateY(-8px) scale(1.015);
          }
        }

        @keyframes vozonAiParticles {
          to {
            background-position: 34px 34px, -28px 58px;
          }
        }

        @keyframes vozonParticleDrift {
          0%, 100% {
            opacity: 0.28;
            transform: translate3d(0, 0, 0) scale(0.8);
          }

          50% {
            opacity: 1;
            transform: translate3d(0, -12px, 0) scale(1.12);
          }
        }

        @keyframes vozonCommandNodeFloat {
          0%, 100% {
            translate: 0 0;
          }

          50% {
            translate: 0 -6px;
          }
        }

        @keyframes vozonInfiniteScan {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes vozonCompassPulse {
          0%, 100% {
            box-shadow: 0 0 26px rgba(37,244,210,0.16);
          }

          50% {
            box-shadow: 0 0 38px rgba(37,244,210,0.3);
          }
        }

        @keyframes vozonVoiceBars {
          0%, 100% {
            transform: scaleY(0.52);
            opacity: 0.52;
          }

          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes vozonMediaDots {
          to {
            background-position: 42px 42px, -48px 86px;
          }
        }

        @keyframes vozonMediaPulse {
          0%, 100% {
            transform: scale(0.96);
            opacity: 0.42;
          }

          50% {
            transform: scale(1.04);
            opacity: 0.82;
          }
        }

        @keyframes vozonCallWave {
          0%, 100% {
            transform: scaleY(0.58);
            opacity: 0.54;
          }

          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes vozonAvatarTalk {
          0%, 100% {
            transform: scaleY(0.45) scaleX(0.82);
            opacity: 0.82;
          }

          45% {
            transform: scaleY(1.45) scaleX(1.05);
            opacity: 1;
          }

          70% {
            transform: scaleY(0.82) scaleX(1);
            opacity: 0.9;
          }
        }

        @keyframes vozonAgentFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes vozonAvatarWave {
          0%, 100% {
            transform: scaleY(0.62);
            opacity: 0.56;
          }

          50% {
            transform: scaleY(1);
            opacity: 0.92;
          }
        }

        @media (max-width: 720px) {
          .vozon-circuit {
            margin-top: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
