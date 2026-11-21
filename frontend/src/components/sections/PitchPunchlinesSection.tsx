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
    context: "When enterprise prospects ask why conversational AI chatbots fail to move the revenue needle, this line immediately shifts the conversation from superficial chatter to transactional outcome delivery.",
    targetChannels: ["Hero H1 Headline", "LinkedIn Enterprise Ads", "Sales Deck Slide 1"],
    accentColor: "text-[#9F3DA8]",
    badgeStyle: "bg-purple-50 text-purple-900 border-purple-200",
  },
  {
    id: "autonomous",
    category: "COGNITIVE ARCHITECTURE // ZERO SCRIPTS",
    quote: "Zero scripts. 100% autonomous execution.",
    context: "Legacy voice bots break the moment a customer diverges from an IVR flowchart. Vozon gives the agent high-level goals and dynamic ReAct reasoning—allowing complete conversational resilience.",
    targetChannels: ["Product Subheader", "Competitor Battlecards", "Twitter / X Hook"],
    accentColor: "text-[#7e22ce]",
    badgeStyle: "bg-purple-100 text-purple-950 border-purple-300",
  },
  {
    id: "front-office",
    category: "WORKFLOW AUTOMATION // END-TO-END CLOSURE",
    quote: "Your front office on autopilot: Voice agents that reason, negotiate, and take action in real-time.",
    context: "Positions Vozon as an autonomous operational workforce—connecting empathetic human-sounding voice negotiation directly to live database writes, WhatsApp confirmations, and CRM sync.",
    targetChannels: ["Enterprise Proposals", "Agency Client Pitches", "Sales One-Pagers"],
    accentColor: "text-[#c084fc]",
    badgeStyle: "bg-pink-50 text-pink-900 border-pink-200",
  },
  {
    id: "warmth-velocity",
    category: "PERCEPTUAL REALISM // ACOUSTIC EXCELLENCE",
    quote: "Human warmth. Machine velocity. Sub-500ms latency.",
    context: "Targets the visceral human conversational reflex standard. Eliminates awkward pauses with sub-500ms response times, authentic multilingual nuance, and sub-120ms instant barge-in.",
    targetChannels: ["Audio Demo Badges", "Performance Retargeting", "Founder Keynotes"],
    accentColor: "text-emerald-600",
    badgeStyle: "bg-emerald-50 text-emerald-900 border-emerald-200",
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
    <section id="punchlines" className="relative py-20 bg-[#FDF4FF]/50 border-y border-gray-100 overflow-hidden">
      {/* Kinetic Infinite Marquee */}
      <div className="overflow-hidden border-b border-gray-200/60 pb-6 mb-12">
        <div className="animate-marquee gap-8 py-2">
          {[...punchlines, ...punchlines, ...punchlines].map((p, idx) => (
            <span key={idx} className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-gray-700 font-semibold shrink-0">
              <span className="text-[#9F3DA8]">✦</span>
              <span>&ldquo;{p.quote}&rdquo;</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold mb-2">
              <span className="size-2 rounded-full bg-[#9F3DA8]" />
              Strategic Value Narrative
            </span>
            <h2 className="zippee-title-underline-left text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] mt-2">
              Why the future belongs to Voice Agents.
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCopyAll}
            className="zippee-btn-secondary text-xs px-4 py-2 cursor-pointer"
          >
            {copiedAll ? "✓ Copied All Quotes" : "Copy All Punchlines"}
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {punchlines.map((p) => (
            <article key={p.id} className="zippee-card p-6 flex flex-col justify-between hover:border-purple-300">
              <div>
                <span className={`zippee-pill text-[10px] font-bold ${p.badgeStyle}`}>
                  {p.category}
                </span>
                <blockquote className="mt-4 text-base font-bold text-[#1D1D1F] leading-snug">
                  &ldquo;{p.quote}&rdquo;
                </blockquote>
                <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                  {p.context}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-400">
                  {p.targetChannels[0]}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyQuote(p.id, p.quote)}
                  className="text-xs font-bold text-[#9F3DA8] hover:underline cursor-pointer"
                >
                  {copiedId === p.id ? "✓ Copied" : "Copy Quote"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PitchPunchlinesSection;