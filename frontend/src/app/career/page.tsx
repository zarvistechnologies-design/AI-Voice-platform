"use client";

import Link from "next/link";
import { useState } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "@/app/business/industries/healthcare/healthcare.css";
import "@/components/company/CompanyEditorial.css";

const heroDepartments = [
  {
    name: "Voice AI & Speech ML",
    detail: "Streaming ASR, neural turn-taking & synthesis",
    count: "2 roles →",
  },
  {
    name: "Distributed SIP & Telephony",
    detail: "Low-latency WebRTC, media relays & carriers",
    count: "1 role →",
  },
  {
    name: "Product & Full-Stack",
    detail: "Agent studio, Next.js console & workflow engine",
    count: "1 role →",
  },
  {
    name: "Conversational Design",
    detail: "Multilingual personas & domain guardrails",
    count: "1 role →",
  },
  {
    name: "Solutions & Enterprise GTM",
    detail: "Forward-deployed architects & account leads",
    count: "2 roles →",
  },
];

const openRoles = [
  {
    team: "VOICE AI & RESEARCH",
    title: "Real-Time Audio & Speech ML Engineer",
    summary:
      "Optimize streaming ASR, neural turn-taking, barge-in detection, and sub-88ms voice synthesis across 50+ regional languages.",
    meta: "BENGALURU / SAN FRANCISCO · FULL-TIME",
    href: "mailto:careers@vozon.ai?subject=Application:%20Real-Time%20Audio%20%26%20Speech%20ML%20Engineer",
  },
  {
    team: "TELEPHONY INFRASTRUCTURE",
    title: "Distributed SIP & Media Systems Engineer",
    summary:
      "Architect ultra-low-latency WebRTC and SIP trunking pipelines across Twilio, Exotel, Plivo, and direct Tier-1 telecom interconnects.",
    meta: "BENGALURU · FULL-TIME",
    href: "mailto:careers@vozon.ai?subject=Application:%20Distributed%20SIP%20%26%20Media%20Systems%20Engineer",
  },
  {
    team: "PRODUCT ENGINEERING",
    title: "Senior Full-Stack Product Engineer",
    summary:
      "Build the agent studio, live call monitoring console, and deterministic CRM workflow builders in Next.js, TypeScript, and Python.",
    meta: "BENGALURU / HYBRID · FULL-TIME",
    href: "mailto:careers@vozon.ai?subject=Application:%20Senior%20Full-Stack%20Product%20Engineer",
  },
  {
    team: "CONVERSATIONAL DESIGN",
    title: "Staff Conversational AI & Prompt Architect",
    summary:
      "Design empathetic, domain-specific voice personas, guardrails, and multilingual dialogue flows for healthcare, logistics, and fintech.",
    meta: "BENGALURU / REMOTE · FULL-TIME",
    href: "mailto:careers@vozon.ai?subject=Application:%20Staff%20Conversational%20AI%20Architect",
  },
  {
    team: "SOLUTIONS ENGINEERING",
    title: "Forward-Deployed Solutions Architect",
    summary:
      "Partner directly with enterprise engineering teams to integrate Vozon into Salesforce, Zoho, custom ERPs, and private VPC environments.",
    meta: "BENGALURU / SAN FRANCISCO · FULL-TIME",
    href: "mailto:careers@vozon.ai?subject=Application:%20Forward-Deployed%20Solutions%20Architect",
  },
  {
    team: "GROWTH & GTM",
    title: "Enterprise Account Executive",
    summary:
      "Lead strategic enterprise deployments across healthcare, financial services, and high-volume customer operations teams.",
    meta: "BENGALURU / SAN FRANCISCO · FULL-TIME",
    href: "mailto:careers@vozon.ai?subject=Application:%20Enterprise%20Account%20Executive",
  },
];

const careerFaqs = [
  {
    question: "What does the interview process at Vozon look like?",
    answer:
      "Our process is fast, practical, and respectful of your time. It starts with a 25-minute intro conversation, followed by a hands-on technical or design deep-dive focused on real-world voice/systems problems (no trick whiteboard puzzles), and concludes with a founder and team alignment session.",
  },
  {
    question: "Where are Vozon's offices located and do you support hybrid work?",
    answer:
      "Our primary engineering hub is in Bengaluru, with our North America GTM and research presence in San Francisco. Most engineering and product roles operate in a high-trust hybrid cadence so teams can collaborate closely on latency-critical systems.",
  },
  {
    question: "What kind of engineering problems will I work on?",
    answer:
      "You will tackle some of the hardest latency and reliability problems in applied AI: sub-88ms audio streaming, noisy-environment barge-in detection, regional Indic code-switching, deterministic LLM tool calling, and multi-carrier SIP failover at 99.98% uptime.",
  },
  {
    question: "What if I don't see an exact role match for my background?",
    answer:
      "We always make room for exceptional builders. Send a short note to careers@vozon.ai with links to what you have built, deployed, or researched, and tell us where you think you can make the biggest impact.",
  },
];

export default function CareerPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="hcr-site sln-site">
      <SiteHeader />

      <main className="hcr-page cmp-page">
        {/* ==================================================================
            1. 2-COLUMN EDITORIAL HERO (Compact Headings + Open Teams Index)
            ================================================================== */}
        <section className="cmp-hero hcr-wrap">
          <div className="hcr-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Careers</span>
          </div>

          <div className="cmp-hero-stage">
            <div className="cmp-hero-grid">
              <div className="cmp-hero-left">
                <p className="hcr-kicker">CAREERS AT VOZON AI</p>
                <h1>Build the voice engine behind millions of conversations.</h1>
                <p className="cmp-hero-lead">
                  We bring together acoustic researchers, distributed systems engineers, and product
                  builders to replace broken phone trees with sub-88ms conversational intelligence.
                </p>
                <div className="cmp-hero-actions">
                  <a href="#open-roles" className="cmp-btn-primary">
                    Explore open roles <span aria-hidden="true">&#8595;</span>
                  </a>
                  <Link href="/about" className="cmp-btn-secondary">
                    Our founding story <span aria-hidden="true">&#8599;</span>
                  </Link>
                </div>
              </div>

              <div className="cmp-ledger" aria-label="Hiring teams overview">
                <div className="cmp-ledger-head">
                  <span>HIRING TEAMS</span>
                  <span className="cmp-ledger-badge">
                    <i aria-hidden="true" /> 6 Open Roles
                  </span>
                </div>
                {heroDepartments.map((dept) => (
                  <a key={dept.name} href="#open-roles" className="cmp-ledger-link">
                    <div>
                      <strong>{dept.name}</strong>
                      <small>{dept.detail}</small>
                    </div>
                    <span>{dept.count}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            2. HIGH-IMPACT PROOF METRICS (Dark Band)
            ================================================================== */}
        <section className="hcr-proof">
          <div className="hcr-wrap">
            <div className="hcr-proof-grid">
              <div>
                <strong>88ms</strong>
                <span>Latency standard we engineer for</span>
              </div>
              <div>
                <strong>50+</strong>
                <span>Languages &amp; Indic dialects in production</span>
              </div>
              <div>
                <strong>2</strong>
                <span>Engineering &amp; GTM hubs (BLR &amp; SF)</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Builder-led ownership &amp; direct impact</span>
              </div>
            </div>

            <div className="hcr-proof-tools">
              <span>OUR CORE STACK</span>
              <b>Rust &amp; Go Media</b>
              <b>WebRTC / SIP</b>
              <b>Python &amp; PyTorch</b>
              <b>Next.js &amp; TypeScript</b>
              <b>Kubernetes</b>
            </div>
          </div>
        </section>

        {/* ==================================================================
            3. HOW WE WORK / CULTURE PRINCIPLES
            ================================================================== */}
        <section className="sln-audiences hcr-wrap">
          <p className="hcr-kicker">HOW WE WORK</p>
          <h2>Small teams, hard infrastructure problems, zero bureaucracy.</h2>
          <div className="sln-audience-grid">
            <div>
              <span>01</span>
              <h3>High-agency ownership</h3>
              <p>
                Every engineer and designer owns end-to-end outcomes—from acoustic benchmarks and
                SIP trunking architecture to how a caller feels on their first interaction.
              </p>
            </div>
            <div>
              <span>02</span>
              <h3>Obsess over every millisecond</h3>
              <p>
                In real-time voice, 200ms is the difference between magic and frustration. We
                measure, profile, and optimize every layer from codec framing to token streaming.
              </p>
            </div>
            <div>
              <span>03</span>
              <h3>Ship directly to production</h3>
              <p>
                We avoid endless committees. We listen closely to enterprise deployments, ship
                improvements daily, and iterate based on real call outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            4. OPEN POSITIONS GRID
            ================================================================== */}
        <section className="hcr-platform hcr-wrap" id="open-roles">
          <p className="hcr-kicker">OPEN POSITIONS</p>
          <h2>Find where your craft makes the biggest impact.</h2>

          <div className="hcr-platform-grid">
            {openRoles.map((role) => (
              <a key={role.title} href={role.href}>
                <span>{role.team}</span>
                <h3>{role.title}</h3>
                <p>{role.summary}</p>
                <strong>{role.meta}</strong>
              </a>
            ))}
          </div>
        </section>

        {/* ==================================================================
            5. BENEFITS & GENERAL APPLICATION
            ================================================================== */}
        <section className="hcr-launch hcr-wrap">
          <div>
            <p className="hcr-kicker">LIFE &amp; BENEFITS</p>
            <h2>Built so you can do your best work.</h2>
          </div>
          <div className="hcr-launch-options">
            <div>
              <span>COMPENSATION &amp; WELLBEING</span>
              <h3>Competitive salary, meaningful equity &amp; full health cover</h3>
              <p>
                Top-of-market compensation with meaningful early-stage equity, comprehensive
                medical insurance for you and your family, and a dedicated home-office &amp;
                studio audio stipend.
              </p>
              <Link href="/about">
                Learn about our company <span aria-hidden="true">&#8599;</span>
              </Link>
            </div>
            <div>
              <span>OPEN APPLICATION</span>
              <h3>Don&apos;t see your exact role listed?</h3>
              <p>
                Share what you have built, the hardest technical or design problem you have
                solved, and where you want to contribute. We review every thoughtful note directly.
              </p>
              <a href="mailto:careers@vozon.ai?subject=Open%20Application%20-%20Vozon%20AI">
                Email careers@vozon.ai <span aria-hidden="true">&#8599;</span>
              </a>
            </div>
          </div>
        </section>

        {/* ==================================================================
            6. HIRING PROCESS FAQ
            ================================================================== */}
        <section className="hcr-faq hcr-wrap">
          <p className="hcr-kicker">HIRING FAQ</p>
          <h2>Questions about joining Vozon AI.</h2>

          <div className="hcr-faq-list">
            {careerFaqs.map((faq, idx) => (
              <details
                key={faq.question}
                open={activeFaq === idx}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveFaq(activeFaq === idx ? null : idx);
                }}
              >
                <summary>
                  {faq.question}
                  <span>+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
