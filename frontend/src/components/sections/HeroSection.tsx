"use client";

import { useState } from "react";

const companyNames = [
  "CAPSULE",
  "doxy.me",
  "gifthealth",
  "PINE PARK HEALTH",
  "waymark",
  "NOVA BANK",
  "RoutePeak",
  "PolicyWorks",
  "STAY",
  "CollectIQ",
];

const carouselSlides = [
  {
    kicker: "Introducing Super Agents",
    title: "Build AI voice agents that answer, qualify, and act.",
    body: "Launch production-ready voice agents for sales, support, scheduling, dispatch, reminders, and customer follow-ups.",
    cta: "Explore agents",
    theme: "cyan",
  },
  {
    kicker: "Shopify + WhatsApp",
    title: "Grow your Shopify store with WhatsApp and AI voice follow-ups.",
    body: "Recover carts, confirm orders, answer questions, and route high-intent shoppers from WhatsApp chats into helpful voice workflows.",
    cta: "Connect workflows",
    theme: "cyan",
  },
  {
    kicker: "Drive Business Growth",
    title: "Turn every customer conversation into a next step.",
    body: "Use autonomous agents to qualify leads, summarize calls, detect sentiment, update your CRM, and hand off urgent conversations.",
    cta: "Start growing",
    theme: "lime",
  },
];

const metrics = [
  ["24/7", "agent coverage"],
  ["140+", "languages"],
  ["<2s", "handoff"],
  ["100%", "call summaries"],
];

function VoicePanel() {
  const bars = [26, 42, 58, 74, 52, 84, 64, 92, 72, 54, 66, 48, 34];

  return (
    <div className="relative mx-auto w-full max-w-[430px] rounded-lg border border-white/15 bg-black/25 p-5 text-left shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-white/85">
          <span className="size-2 rounded-full bg-emerald-400" />
          Live voice session
        </span>
        <span className="text-sm font-black text-white">00:42</span>
      </div>
      <div className="grid h-32 place-items-center rounded-lg border border-white/10 bg-black/20">
        <div className="flex h-24 items-center gap-1.5">
          {bars.map((height, index) => (
            <span
              className="w-2 rounded-full bg-gradient-to-t from-cyan-300 to-fuchsia-300"
              key={index}
              style={{ height }}
            />
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {["Aria - Warm", "English", "1.0x"].map((label) => (
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80" key={label}>
            {label}
          </span>
        ))}
      </div>
      <div className="mt-5 grid gap-3 text-sm leading-5">
        <p className="m-0 rounded-md bg-white/10 px-4 py-3 text-white/85">
          <strong>Customer:</strong> Can I reschedule my appointment?
        </p>
        <p className="m-0 rounded-md bg-cyan-300/20 px-4 py-3 text-white">
          <strong>AI Agent:</strong> Absolutely, I found three open times for you today.
        </p>
      </div>
    </div>
  );
}

function ShopifyPanel() {
  return (
    <div className="mx-auto grid w-full max-w-[500px] gap-4 rounded-[28px] border-[12px] border-white bg-white p-4 text-left shadow-[0_28px_70px_rgba(15,23,42,0.20)]">
      <div className="rounded-2xl bg-emerald-600 px-4 py-3 font-black text-white">Shopify Store</div>
      <div className="grid gap-4 rounded-2xl bg-cyan-50 p-5">
        <div className="h-24 rounded-lg bg-[linear-gradient(135deg,#111827,#00FFFF)]" />
        <p className="m-0 text-base leading-7 text-slate-700">
          Hi Rahul, your cart is ready. Want help choosing the right size?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-md bg-slate-950 px-4 py-3 font-black text-white" type="button">
            Pay Now
          </button>
          <button className="rounded-md border border-cyan-200 bg-white px-4 py-3 font-black text-cyan-800" type="button">
            Talk to agent
          </button>
        </div>
      </div>
      <div className="grid gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-cyan-100">
        {["Cart recovered", "WhatsApp reply sent", "Voice follow-up ready"].map((item) => (
          <span className="rounded-lg bg-cyan-50 px-4 py-3 text-sm font-bold text-slate-700" key={item}>
            OK {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function GrowthPanel() {
  return (
    <div className="mx-auto grid w-full max-w-[520px] gap-5 text-left">
      <div className="rounded-[24px] bg-white p-5 shadow-[0_24px_64px_rgba(15,23,42,0.16)] ring-1 ring-cyan-100">
        <div className="mb-4 text-sm font-black text-cyan-700">Pre-built AI Agent</div>
        <div className="grid gap-3 rounded-xl bg-cyan-50 p-5">
          <strong className="text-xl text-slate-950">Voice Growth Agent</strong>
          <span className="rounded-md bg-white px-3 py-2 text-sm text-slate-600">Objective: qualify and route callers</span>
          <span className="rounded-md bg-white px-3 py-2 text-sm text-slate-600">Action: create CRM summary</span>
          <span className="rounded-md bg-white px-3 py-2 text-sm text-slate-600">Tone: warm and professional</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["Leads", "Sales", "Support"].map((label) => (
          <span className="rounded-xl bg-white/80 px-4 py-4 text-center text-sm font-black text-slate-800 shadow-sm" key={label}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function SuperAgentsSlide() {
  return (
    <article className="grid min-w-full content-center justify-items-center bg-white px-6 py-16 text-center sm:px-10 lg:min-h-[570px] lg:px-16 xl:px-20">
      <span className="text-sm font-black uppercase text-cyan-700">
        Introducing Super Agents
      </span>
      <h1 className="mt-6 mb-0 max-w-6xl text-[clamp(1.95rem,3.7vw,3.35rem)] leading-[1.1] font-black text-slate-950">
        Put your customer engagement on autopilot
        <br />
        With Conversational AI Agents
      </h1>
      <p className="mt-5 mb-0 max-w-4xl text-sm leading-6 text-slate-700 sm:text-base">
        Deliver seamless, real-time customer interactions with speed, relevance, and precision
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg"
          href="#platform"
        >
          Explore agents
        </a>
        <a
          className="rounded-full border border-cyan-300 px-6 py-3 text-sm font-black text-cyan-800"
          href="#contact"
        >
          Contact sales
        </a>
      </div>
    </article>
  );
}

function SlideVisual({ index }: { index: number }) {
  if (index === 1) {
    return <ShopifyPanel />;
  }

  if (index === 2) {
    return <GrowthPanel />;
  }

  return <VoicePanel />;
}

function LandingCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  const goToSlide = (direction: "previous" | "next") => {
    setActiveSlide((current) =>
      direction === "next"
        ? (current + 1) % carouselSlides.length
        : (current - 1 + carouselSlides.length) % carouselSlides.length,
    );
  };

  return (
    <div className="relative overflow-hidden rounded-[26px] shadow-[0_28px_90px_rgba(15,23,42,0.20)] ring-1 ring-cyan-100">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {carouselSlides.map((slide, index) => (
          index === 0 ? (
            <SuperAgentsSlide key={slide.title} />
          ) : (
            <article
              className={`grid min-w-full items-center gap-10 px-6 py-12 sm:px-10 lg:min-h-[570px] lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)] lg:px-16 xl:px-20 ${
                slide.theme === "cyan"
                  ? "bg-[linear-gradient(135deg,#ffffff_0%,#eaffff_40%,#00FFFF_100%)] text-slate-950"
                  : "bg-[linear-gradient(135deg,#ffffff_0%,#ecfccb_42%,#67e8f9_100%)] text-slate-950"
              }`}
              key={slide.title}
            >
              <div className="max-w-2xl">
                <p className="m-0 text-sm font-black uppercase text-cyan-700">
                  {slide.kicker}
                </p>
                <h1 className="mt-5 mb-0 text-[clamp(1.95rem,4vw,3.6rem)] leading-[1.05] font-black">
                  {slide.title}
                </h1>
                <p className="mt-5 mb-0 max-w-xl text-sm leading-6 text-slate-700 sm:text-base">
                  {slide.body}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    className="rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg"
                    href="#platform"
                  >
                    {slide.cta}
                  </a>
                  <a
                    className="rounded-full border border-cyan-300 px-6 py-3 text-sm font-black text-cyan-800"
                    href="#contact"
                  >
                    Contact sales
                  </a>
                </div>
              </div>
              <SlideVisual index={index} />
            </article>
          )
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
        <button
          aria-label="Show previous landing topic"
          className="pointer-events-auto grid size-9 place-items-center rounded-full bg-white/95 text-lg font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/70 transition hover:-translate-x-0.5 hover:bg-cyan-50 hover:text-slate-950"
          onClick={() => goToSlide("previous")}
          type="button"
        >
          {"<"}
        </button>
        <button
          aria-label="Show next landing topic"
          className="pointer-events-auto grid size-9 place-items-center rounded-full bg-white/95 text-lg font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/70 transition hover:translate-x-0.5 hover:bg-cyan-50 hover:text-slate-950"
          onClick={() => goToSlide("next")}
          type="button"
        >
          {">"}
        </button>
      </div>

      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
        {carouselSlides.map((slide, index) => (
          <button
            aria-label={`Show ${slide.kicker}`}
            className={`h-2.5 rounded-full transition-all ${index === activeSlide ? "w-10 bg-cyan-400" : "w-2.5 bg-white/65"}`}
            key={slide.kicker}
            onClick={() => setActiveSlide(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}

function MetricsStrip() {
  return (
    <div className="grid overflow-hidden rounded-lg border border-cyan-100 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.08)] sm:grid-cols-4">
      {metrics.map(([value, label]) => (
        <div className="border-b border-cyan-100 px-5 py-5 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0" key={label}>
          <strong className="block text-2xl font-black text-slate-950">{value}</strong>
          <span className="text-sm font-bold text-slate-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

function CompanyStrip() {
  return (
    <section className="overflow-hidden py-10 text-center" aria-label="Companies using AI Voice Platform">
      <h2 className="m-0 text-2xl font-black text-slate-950">
        Trusted by teams building better customer conversations
      </h2>
      <div className="mt-8 overflow-hidden">
        <div className="home-company-marquee flex w-max items-center gap-4">
          {[...companyNames, ...companyNames].map((company, index) => (
            <span
              className="inline-flex min-h-12 min-w-max items-center rounded-full border border-cyan-100 bg-white px-6 text-sm font-black uppercase text-slate-700 shadow-sm"
              key={`${company}-${index}`}
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HeroSection() {
  return (
    <section id="product" className="mx-auto grid w-full max-w-[1540px] gap-8 px-4 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1320px] gap-8">
        <LandingCarousel />
        <MetricsStrip />
        <CompanyStrip />
      </div>

      <style>{`
        @keyframes home-company-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .home-company-marquee {
          animation: home-company-marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
