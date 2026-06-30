"use client";

import { useState } from "react";

const languageOptions = [
  {
    name: "Hindi",
    symbol: "ह",
    script: "हिन्दी",
    nativeGreeting: "नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?",
    greeting: "Namaste! Main aapki kaise madad kar sakta hoon?",
    coverage: "340M+",
    region: "North India",
    useCase: "Support, sales, appointment calls",
  },
  {
    name: "Hinglish",
    symbol: "H",
    script: "Hindi + English",
    nativeGreeting: "Hi! Main aapki request abhi handle kar sakta hoon.",
    greeting: "Hi! Main aapki request abhi handle kar sakta hoon.",
    coverage: "500M+",
    region: "Urban India",
    useCase: "D2C, fintech, ecommerce calls",
  },
  {
    name: "Tamil",
    symbol: "த",
    script: "தமிழ்",
    nativeGreeting: "வணக்கம்! இன்று நான் உங்களுக்கு எப்படி உதவலாம்?",
    greeting: "Vanakkam! Indru naan ungalukku eppadi udhavalam?",
    coverage: "78M+",
    region: "Tamil Nadu",
    useCase: "Healthcare, banking, service calls",
  },
  {
    name: "Telugu",
    symbol: "తె",
    script: "తెలుగు",
    nativeGreeting: "నమస్తే! ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?",
    greeting: "Namaste! Ee roju nenu meeku ela sahayam cheyagalanu?",
    coverage: "96M+",
    region: "Andhra & Telangana",
    useCase: "Lead follow-up and support",
  },
  {
    name: "Kannada",
    symbol: "ಕ",
    script: "ಕನ್ನಡ",
    nativeGreeting: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    greeting: "Namaskara! Naanu nimage hege sahaya madali?",
    coverage: "64M+",
    region: "Karnataka",
    useCase: "Bookings and local support",
  },
  {
    name: "Marathi",
    symbol: "म",
    script: "मराठी",
    nativeGreeting: "नमस्कार! आज मी तुम्हाला कशी मदत करू शकतो?",
    greeting: "Namaskar! Aaj mi tumhala kashi madat karu shakto?",
    coverage: "83M+",
    region: "Maharashtra",
    useCase: "Collections and reminders",
  },
  {
    name: "Bengali",
    symbol: "ব",
    script: "বাংলা",
    nativeGreeting: "নমস্কার! আজ আমি কীভাবে আপনাকে সাহায্য করতে পারি?",
    greeting: "Nomoskar! Aaj ami kivabe apnake sahajyo korte pari?",
    coverage: "97M+",
    region: "East India",
    useCase: "Customer care and onboarding",
  },
  {
    name: "Gujarati",
    symbol: "ગુ",
    script: "ગુજરાતી",
    nativeGreeting: "નમસ્તે! આજે હું તમને કેવી રીતે મદદ કરી શકું?",
    greeting: "Namaste! Aaje hu tamne kevi rite madad kari shaku?",
    coverage: "56M+",
    region: "Gujarat",
    useCase: "Retail and business calls",
  },
  {
    name: "Punjabi",
    symbol: "ਪ",
    script: "ਪੰਜਾਬੀ",
    nativeGreeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    greeting: "Sat sri akal! Main tuhadi kiven madad kar sakda haan?",
    coverage: "33M+",
    region: "Punjab",
    useCase: "Local services and follow-ups",
  },
  {
    name: "Malayalam",
    symbol: "മ",
    script: "മലയാളം",
    nativeGreeting: "നമസ്കാരം! ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?",
    greeting: "Namaskaram! Innu njan ningale engane sahayikkam?",
    coverage: "38M+",
    region: "Kerala",
    useCase: "Support and appointment calls",
  },
  {
    name: "English",
    symbol: "E",
    script: "English",
    nativeGreeting: "Hello! How can I help you today?",
    greeting: "Hello! How can I help you today?",
    coverage: "900M+",
    region: "Global",
    useCase: "Every team and workflow",
  },
];

export function IndianLanguageVoiceSection() {
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);

  return (
    <section className="mx-auto max-w-[1220px] px-4 py-10">
      <div className="relative overflow-hidden rounded-[24px] border border-cyan-100 bg-white shadow-[0_20px_58px_rgba(15,23,42,0.10)]">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#00FFFF,#67e8f9,#d9f99d)]" />
        <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[0.88fr_1.12fr] lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="m-0 rounded-full bg-cyan-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-cyan-800">
                Indian language voice AI
              </p>
              <span className="rounded-full border border-cyan-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                11 local modes
              </span>
            </div>
            <h2 className="mt-3 mb-0 max-w-xl text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.12] font-extrabold text-slate-950">
              Speak naturally with customers across India.
            </h2>
            <p className="mt-4 mb-0 max-w-xl text-sm leading-7 text-slate-600">
              Support Hindi, Hinglish, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Punjabi, Malayalam, English, and more from one voice workflow.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {languageOptions.map((language) => {
                const active = language.name === selectedLanguage.name;

                return (
                  <button
                    aria-pressed={active}
                    className={`group flex min-h-14 items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
                      active
                        ? "border-cyan-300 bg-white text-slate-950 shadow-[0_12px_30px_rgba(6,182,212,0.14)]"
                        : "border-slate-200 bg-white/80 text-slate-600 hover:border-cyan-200 hover:bg-white hover:text-slate-950"
                    }`}
                    key={language.name}
                    onClick={() => setSelectedLanguage(language)}
                    type="button"
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-md text-base font-bold transition ${
                        active ? "bg-[#00FFFF] text-slate-950" : "bg-slate-950 text-white group-hover:bg-cyan-100 group-hover:text-cyan-900"
                      }`}
                    >
                      {language.symbol}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-bold uppercase">{language.name}</span>
                      <span className="mt-0.5 block truncate text-[0.68rem] font-bold text-slate-500">
                        {language.script}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-cyan-100 bg-[linear-gradient(135deg,#f8ffff_0%,#ffffff_52%,#effdf5_100%)] p-5 sm:p-7 lg:p-8">
            <span className="pointer-events-none absolute -right-5 top-1 text-[10rem] leading-none font-black text-cyan-100/70">
              {selectedLanguage.symbol}
            </span>

            <div className="relative grid h-full gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold uppercase text-white">
                  <span className="grid size-6 place-items-center rounded-full bg-[#00FFFF] text-sm font-semibold text-slate-950">
                    {selectedLanguage.symbol}
                  </span>
                  {selectedLanguage.name}
                </span>
                <span className="text-xs font-bold uppercase text-slate-500">{selectedLanguage.region}</span>
              </div>

              <div className="h-[285px] overflow-hidden rounded-[18px] border border-cyan-100 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.09)] sm:h-[300px]">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">AI agent online</span>
                  </div>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
                    {selectedLanguage.script}
                  </span>
                </div>
                <div className="grid h-[226px] content-between gap-4 p-5 sm:h-[241px]">
                  <div className="max-w-[78%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
                    Can you help me with my request?
                  </div>
                  <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[linear-gradient(135deg,#00FFFF,#bffcff)] px-5 py-4 text-right shadow-[0_12px_28px_rgba(6,182,212,0.16)]">
                    <p className="m-0 overflow-hidden text-[clamp(1.05rem,1.7vw,1.35rem)] leading-[1.45] font-medium text-slate-900 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                      {selectedLanguage.nativeGreeting}
                    </p>
                    <p className="mt-3 mb-0 overflow-hidden text-xs font-normal leading-5 text-slate-700 sm:text-sm [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {selectedLanguage.greeting}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-white/90 p-4 shadow-sm ring-1 ring-cyan-100">
                  <span className="text-xs font-bold uppercase text-slate-500">Reach</span>
                  <strong className="mt-2 block text-2xl font-extrabold text-slate-950">
                    {selectedLanguage.coverage}
                  </strong>
                </div>
                <div className="rounded-lg bg-white/90 p-4 shadow-sm ring-1 ring-cyan-100 sm:col-span-2">
                  <span className="text-xs font-bold uppercase text-slate-500">Best fit</span>
                  <p className="mt-2 mb-0 text-sm font-medium leading-6 text-slate-700">
                    {selectedLanguage.useCase}
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-1">
                <button
                  className="group inline-flex min-h-13 w-full items-center justify-between gap-4 rounded-full bg-slate-950 py-2 pr-2 pl-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.20)] transition hover:-translate-y-0.5 hover:bg-cyan-700 sm:w-fit"
                  type="button"
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-full bg-[#00FFFF] text-base font-semibold text-slate-950">
                      {selectedLanguage.symbol}
                    </span>
                    Talk to agent in {selectedLanguage.name}
                  </span>
                  <span className="grid size-9 place-items-center rounded-full bg-white text-base text-slate-950 transition group-hover:translate-x-0.5">
                    -&gt;
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
