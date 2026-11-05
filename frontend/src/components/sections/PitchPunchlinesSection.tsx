"use client";

import { useState } from "react";

interface PunchlineItem {
  id: string;
  category: string;
  quote: string;
  context: string;
  targetChannels: string[];
  accentColor: string;
  badgeStyle: string;
}

const punchlines: PunchlineItem[] = [
  {
    id: "outcomes",
    category: "PARADIGM SHIFT // THE BOT ERA IS OVER",
    quote: "Stop deploying bots that talk. Start deploying agents that get work done.",
    context:
      "When enterprise prospects ask why conversational AI chatbots fail to move the revenue needle, this line immediately shifts the conversation from superficial chatter to transactional outcome delivery.",
    targetChannels: ["Hero H1 Headline", "LinkedIn Enterprise Ads", "Sales Deck Slide 1"],
    accentColor: "text-[#658206]",
    badgeStyle: "bg-lime-50 text-lime-900 border-lime-200",
  },
  {
    id: "autonomous",
    category: "COGNITIVE ARCHITECTURE // ZERO SCRIPTS",
    quote: "Zero scripts. 100% autonomous execution.",
    context:
      "Legacy voice bots break the moment a customer diverges from an IVR flowchart. Vozon gives the agent high-level goals and dynamic ReAct reasoning—allowing complete conversational resilience.",
    targetChannels: ["Product Subheader", "Competitor Battlecards", "Twitter / X Hook"],
    accentColor: "text-[#0284c7]",
    badgeStyle: "bg-sky-50 text-sky-900 border-sky-200",
  },
  {
    id: "front-office",
    category: "WORKFLOW AUTOMATION // END-TO-END CLOSURE",
    quote: "Your front office on autopilot: Voice agents that reason, negotiate, and take action in real-time.",
    context:
      "Positions Vozon as an autonomous operational workforce—connecting empathetic human-sounding voice negotiation directly to live database writes, WhatsApp confirmations, and CRM sync.",
    targetChannels: ["Enterprise Proposals", "Agency Client Pitches", "Sales One-Pagers"],
    accentColor: "text-[#7e22ce]",
    badgeStyle: "bg-purple-50 text-purple-900 border-purple-200",
  },
  {
    id: "warmth-velocity",
    category: "PERCEPTUAL REALISM // ACOUSTIC EXCELLENCE",
    quote: "Human warmth. Machine velocity. Sub-500ms latency.",
    context:
      "Targets the visceral human conversational reflex standard. Eliminates awkward pauses with sub-500ms response times, authentic multilingual nuance, and sub-120ms instant barge-in.",
    targetChannels: ["Audio Demo Badges", "Performance Retargeting", "Founder Keynotes"],
    accentColor: "text-[#be123c]",
    badgeStyle: "bg-rose-50 text-rose-900 border-rose-200",
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
    <section id="punchlines" className="relative bg-white py-20 text-ink md:py-28 overflow-hidden border-b border-line">
      {/* Background Ambience */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full blur-[160px] opacity-20"
        style={{ background: "radial-gradient(circle, rgba(129, 161, 11, 0.15) 0%, rgba(56, 189, 248, 0.12) 50%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Kinetic Infinite Marquee Running Across Full Width */}
      <div className="relative w-full overflow-hidden border-t border-b border-line bg-paper-2 py-4 mb-14">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap text-xs font-mono uppercase tracking-widest text-ink/80">
          {[...punchlines, ...punchlines, ...punchlines].map((p, idx) => (
            <span key={idx} className="flex items-center gap-6">
              <span className="text-[#81a10b] text-sm">✦</span>
              <span className="font-bold text-ink tracking-wider">&ldquo;{p.quote}&rdquo;</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-x relative z-10">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#81a10b]/30 bg-[#81a10b]/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[#658206]">
              <span className="inline-block size-2 rounded-full bg-[#81a10b]" />
              Strategic Positioning // Pitch Punchlines For Marketing &amp; Ads
            </div>
            <h2 className="display-lg mt-4 text-[clamp(1.85rem,3.4vw,3.25rem)] font-bold leading-tight tracking-tight text-ink">
              Pitch punchlines that <span className="text-[#658206]">close enterprise deals</span>.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
              When speaking to prospective clients, investors, or enterprise executives, use these four positioning statements to instantly establish authority over legacy voice bots.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-paper px-4 py-2 font-mono text-xs font-semibold text-ink shadow-xs transition-all hover:border-ink hover:bg-paper-2 cursor-pointer"
            >
              {copiedAll ? (
                <>
                  <span className="text-emerald-600 font-bold">✓</span> Copied All 4 Punchlines!
                </>
              ) : (
                <>
                  <svg className="size-3.5 text-[#658206]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="group relative flex flex-col justify-between rounded-3xl border border-line bg-paper p-7 sm:p-9 shadow-xs transition-all hover:border-ink/30 hover:shadow-sm"
            >
              {/* Card Top Category & Index */}
              <div>
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <span className={`inline-block rounded-md border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${p.badgeStyle}`}>
                    {p.category}
                  </span>
                  <span className="font-mono text-xs text-muted">0{idx + 1} / 04</span>
                </div>

                {/* Big Display Punchline Quote */}
                <div className="relative mt-6">
                  <span className="pointer-events-none absolute -top-5 -left-3 font-serif text-6xl text-ink/[0.07] select-none">
                    &ldquo;
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl lg:text-[1.7rem] font-bold leading-tight text-ink tracking-tight relative z-10">
                    &ldquo;{p.quote}&rdquo;
                  </h3>
                </div>

                {/* Context & Breakdown */}
                <p className="mt-4 text-xs sm:text-sm text-muted leading-relaxed border-t border-line pt-4">
                  {p.context}
                </p>
              </div>

              {/* Card Bottom Meta & Quick Copy */}
              <div className="mt-8 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-muted">
                  <span className="text-muted/70 mr-1">Best Channels:</span>
                  {p.targetChannels.map((ch, ci) => (
                    <span key={ci} className="rounded bg-paper-2 border border-line px-2 py-0.5 text-ink/80 font-medium">
                      {ch}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyQuote(p.id, p.quote)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                    copiedId === p.id
                      ? "bg-emerald-600 text-white font-bold"
                      : "border border-line bg-paper text-ink hover:border-ink hover:bg-paper-2"
                  }`}
                  aria-label={`Copy punchline: ${p.quote}`}
                >
                  {copiedId === p.id ? (
                    <>
                      <span>✓</span> Copied
                    </>
                  ) : (
                    <>
                      <svg className="size-3 text-[#658206]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
