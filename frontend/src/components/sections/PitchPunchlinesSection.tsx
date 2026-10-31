"use client";

import { useState } from "react";

interface PunchlineItem {
  id: string;
  category: string;
  quote: string;
  context: string;
  targetChannels: string[];
  accentColor: string;
  badgeBg: string;
}

const punchlines: PunchlineItem[] = [
  {
    id: "outcomes",
    category: "PARADIGM SHIFT // THE BOT ERA IS OVER",
    quote: "Stop deploying bots that talk. Start deploying agents that get work done.",
    context:
      "When enterprise prospects ask why conversational AI chatbots fail to move the revenue needle, this line immediately shifts the conversation from superficial chatter to transactional outcome delivery.",
    targetChannels: ["Hero H1 Headline", "LinkedIn Enterprise Ads", "Sales Deck Slide 1"],
    accentColor: "text-[#d4ff3f]",
    badgeBg: "bg-[#d4ff3f]/10 border-[#d4ff3f]/30",
  },
  {
    id: "autonomous",
    category: "COGNITIVE ARCHITECTURE // ZERO SCRIPTS",
    quote: "Zero scripts. 100% autonomous execution.",
    context:
      "Legacy voice bots break the moment a customer diverges from an IVR flowchart. Vozon gives the agent high-level goals and dynamic ReAct reasoning—allowing complete conversational resilience.",
    targetChannels: ["Product Subheader", "Competitor Battlecards", "Twitter / X Hook"],
    accentColor: "text-[#38bdf8]",
    badgeBg: "bg-[#38bdf8]/10 border-[#38bdf8]/30",
  },
  {
    id: "front-office",
    category: "WORKFLOW AUTOMATION // END-TO-END CLOSURE",
    quote: "Your front office on autopilot: Voice agents that reason, negotiate, and take action in real-time.",
    context:
      "Positions Vozon as an autonomous operational workforce—connecting empathetic human-sounding voice negotiation directly to live database writes, WhatsApp confirmations, and CRM sync.",
    targetChannels: ["Enterprise Proposals", "Agency Client Pitches", "Sales One-Pagers"],
    accentColor: "text-[#c084fc]",
    badgeBg: "bg-[#c084fc]/10 border-[#c084fc]/30",
  },
  {
    id: "warmth-velocity",
    category: "PERCEPTUAL REALISM // ACOUSTIC EXCELLENCE",
    quote: "Human warmth. Machine velocity. Sub-500ms latency.",
    context:
      "Targets the visceral human conversational reflex standard. Eliminates awkward pauses with sub-500ms response times, authentic multilingual nuance, and sub-120ms instant barge-in.",
    targetChannels: ["Audio Demo Badges", "Performance Retargeting", "Founder Keynotes"],
    accentColor: "text-[#f43f5e]",
    badgeBg: "bg-[#f43f5e]/10 border-[#f43f5e]/30",
  },
];

export function PitchPunchlinesSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyQuote = (id: string, text: string) => {
    navigator.clipboard.writeText(`"${text}"`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleCopyAll = () => {
    const allText = punchlines.map((p, i) => `${i + 1}. "${p.quote}"`).join("\n\n");
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2400);
  };

  return (
    <section id="punchlines" className="relative bg-[#090908] py-20 text-white md:py-28 overflow-hidden border-b border-[#22221f]">
      {/* Background Ambience */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full blur-[160px] opacity-10"
        style={{ background: "radial-gradient(circle, #d4ff3f 0%, #38bdf8 50%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Kinetic Infinite Marquee Running Across Full Width */}
      <div className="relative w-full overflow-hidden border-t border-b border-[#22221f] bg-[#0e0e0c]/80 py-4 backdrop-blur-md mb-14">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap text-xs font-mono uppercase tracking-widest text-white/70">
          {[...punchlines, ...punchlines, ...punchlines].map((p, idx) => (
            <span key={idx} className="flex items-center gap-6">
              <span className="text-[#d4ff3f] text-sm">✦</span>
              <span className="font-bold text-white tracking-wider">&ldquo;{p.quote}&rdquo;</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-x relative">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#22221f] pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
              <span className="inline-block size-2 rounded-full bg-[#d4ff3f]" />
              Strategic Positioning // Pitch Punchlines For Marketing &amp; Ads
            </div>
            <h2 className="display-lg mt-4 text-[clamp(1.85rem,3.4vw,3.25rem)] font-bold leading-tight tracking-tight text-white">
              Pitch punchlines that <span className="text-[#d4ff3f]">close enterprise deals</span>.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed">
              When speaking to prospective clients, investors, or enterprise executives, use these four positioning statements to instantly establish authority over legacy voice bots.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-2 rounded-lg border border-[#d4ff3f]/40 bg-[#d4ff3f]/10 px-4 py-2 font-mono text-xs font-semibold text-[#d4ff3f] transition-all hover:bg-[#d4ff3f] hover:text-[#0e0e0c]"
            >
              {copiedAll ? (
                <>
                  <span>✓</span> Copied All 4 Punchlines!
                </>
              ) : (
                <>
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy All For Pitch Deck</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Heroic Editorial Punchline Bento Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {punchlines.map((p, idx) => (
            <div
              key={p.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-[#232320] bg-[#141412] p-7 sm:p-9 transition-all hover:border-[#383832] hover:bg-[#161614]"
            >
              {/* Card Top Category & Copy Button */}
              <div>
                <div className="flex items-center justify-between border-b border-[#20201d] pb-4">
                  <span className={`inline-block rounded-md border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${p.badgeBg} ${p.accentColor}`}>
                    {p.category}
                  </span>
                  <span className="font-mono text-xs text-white/40">0{idx + 1} / 04</span>
                </div>

                {/* Big Display Punchline Quote */}
                <div className="relative mt-6">
                  <span className="pointer-events-none absolute -top-5 -left-3 font-serif text-6xl text-white/10 select-none">
                    &ldquo;
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl lg:text-[1.7rem] font-bold leading-tight text-white tracking-tight relative z-10">
                    &ldquo;{p.quote}&rdquo;
                  </h3>
                </div>

                {/* Context & Breakdown */}
                <p className="mt-4 text-xs sm:text-sm text-white/60 leading-relaxed border-t border-[#1e1e1b] pt-4">
                  {p.context}
                </p>
              </div>

              {/* Card Bottom Meta & Quick Copy */}
              <div className="mt-8 pt-4 border-t border-[#1e1e1b] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-white/50">
                  <span className="text-white/30 mr-1">Best Channels:</span>
                  {p.targetChannels.map((ch, ci) => (
                    <span key={ci} className="rounded bg-[#1b1b19] px-2 py-0.5 text-white/70">
                      {ch}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyQuote(p.id, p.quote)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[11px] font-medium transition-all ${
                    copiedId === p.id
                      ? "bg-emerald-500 text-black font-bold"
                      : "border border-white/15 bg-white/[0.03] text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                  aria-label={`Copy punchline: ${p.quote}`}
                >
                  {copiedId === p.id ? (
                    <>
                      <span>✓</span> Copied
                    </>
                  ) : (
                    <>
                      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
