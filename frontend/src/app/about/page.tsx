"use client";

import Link from "next/link";
import { useState } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "@/app/business/industries/healthcare/healthcare.css";
import "@/components/company/CompanyEditorial.css";

const milestones = [
  {
    year: "01 · THE PROBLEM",
    title: "30 years of broken phone trees",
    detail:
      "Every day, hundreds of millions of callers wait 15+ minutes on hold, fight rigid touch-tone IVR menus, and repeat their account details to multiple agents.",
  },
  {
    year: "02 · THE BREAKTHROUGH",
    title: "Sub-88ms integrated voice engine",
    detail:
      "Instead of stitching slow third-party STT, LLM, and TTS APIs with 2-second gaps, we built an integrated streaming speech architecture from the ground up.",
  },
  {
    year: "03 · TODAY",
    title: "Enterprise scale across 50+ languages",
    detail:
      "Powering autonomous inbound and outbound calls across healthcare, logistics, financial services, and customer operations with 99.98% SIP uptime.",
  },
];

const aboutFaqs = [
  {
    question: "What is Vozon AI and what problem does the company solve?",
    answer:
      "Vozon AI is an enterprise conversational voice infrastructure company. We replace traditional, rigid touch-tone phone trees (IVR) and overloaded call queues with autonomous AI agents that answer phone calls on ring zero, understand everyday conversational speech in 50+ languages, and execute two-way actions in your CRM and scheduling tools in under 88 milliseconds.",
  },
  {
    question: "How does Vozon achieve sub-88ms response latency?",
    answer:
      "Instead of daisy-chaining three separate third-party APIs (Speech-to-Text, LLM completion, and Text-to-Speech), which typically introduces 1,200ms–2,500ms of awkward lag, Vozon built an integrated, streaming audio-to-audio architecture deployed on localized global edge nodes in Bengaluru, Mumbai, Singapore, Frankfurt, and the US.",
  },
  {
    question: "What languages and regional dialects does Vozon support?",
    answer:
      "Vozon supports over 50 languages and regional accents out of the box. For Indian enterprises, this includes fluent English (Indian accent), Hindi, Tamil, Telugu, Marathi, Bengali, Kannada, and Gujarati. For global operations, we support US/UK English, Spanish, French, German, and Arabic, with seamless mid-sentence language switching.",
  },
  {
    question: "How does Vozon ensure enterprise data privacy and security?",
    answer:
      "Vozon operates under strict Zero Data Retention (ZDR) principles: customer audio packets and transcripts are processed transiently in memory and are never stored or used to train shared public models. We are SOC 2 Type II audited, ISO 27001 certified, HIPAA compliant, and offer dedicated private VPC deployments with customer-managed KMS encryption keys.",
  },
  {
    question: "Can Vozon connect to our existing telephony and CRM systems?",
    answer:
      "Yes. Vozon connects directly to your existing SIP trunks, cloud PBX, or carrier numbers from Twilio, Exotel, Plivo, or Tata Telephony with zero hardware changes. On the software side, it triggers real-time two-way actions with Salesforce, Zoho, HubSpot, Zendesk, Google Calendar, and Meta WhatsApp Business Cloud APIs.",
  },
];

export default function AboutPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="hcr-site sln-site">
      <SiteHeader />

      <main className="hcr-page cmp-page">
        {/* ==================================================================
            1. 2-COLUMN EDITORIAL HERO (Compact Solution-Scale Headings + Company Ledger)
            ================================================================== */}
        <section className="cmp-hero hcr-wrap">
          <div className="hcr-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>About Us</span>
          </div>

          <div className="cmp-hero-stage">
            <div className="cmp-hero-grid">
              <div className="cmp-hero-left">
                <p className="hcr-kicker">ABOUT VOZON AI · MISSION &amp; STORY</p>
                <h1>Rebuilding the voice layer for the next billion conversations.</h1>
                <p className="cmp-hero-lead">
                  We founded Vozon AI to replace 15-minute hold times and rigid touch-tone phone
                  trees with sub-88ms, multilingual voice intelligence that listens naturally and
                  executes real operational work on ring zero.
                </p>
                <div className="cmp-hero-actions">
                  <Link href="/contact" className="cmp-btn-primary">
                    Talk to leadership <span aria-hidden="true">&#8599;</span>
                  </Link>
                  <Link href="/career" className="cmp-btn-secondary">
                    Join our team <span aria-hidden="true">&#8599;</span>
                  </Link>
                </div>
              </div>

              <div className="cmp-ledger" aria-label="Vozon AI company overview">
                <div className="cmp-ledger-head">
                  <span>COMPANY FACT SHEET</span>
                  <span className="cmp-ledger-badge">
                    <i aria-hidden="true" /> Global Edge Active
                  </span>
                </div>
                <div className="cmp-ledger-row">
                  <span>Founded</span>
                  <strong>2024</strong>
                </div>
                <div className="cmp-ledger-row">
                  <span>Engineering &amp; GTM Hubs</span>
                  <strong>Bengaluru &amp; San Francisco</strong>
                </div>
                <div className="cmp-ledger-row">
                  <span>Voice Latency Standard</span>
                  <strong>&lt; 88ms First-Audio</strong>
                </div>
                <div className="cmp-ledger-row">
                  <span>Language Coverage</span>
                  <strong>50+ Global &amp; Indic Dialects</strong>
                </div>
                <div className="cmp-ledger-row">
                  <span>Security &amp; Privacy</span>
                  <strong>SOC 2 Type II · Zero Data Retention</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            2. CORE BELIEFS (3-Column Bordered Editorial Grid)
            ================================================================== */}
        <section className="sln-audiences hcr-wrap">
          <p className="hcr-kicker">WHAT WE BELIEVE</p>
          <h2>Three convictions that guide every line of code we ship.</h2>
          <div className="sln-audience-grid">
            <div>
              <span>01</span>
              <h3>Speed is conversational empathy</h3>
              <p>
                Natural human dialogue breaks down when latency crosses 200 milliseconds. We
                engineered an integrated streaming speech pipeline to achieve sub-88ms first-audio
                response and instant caller barge-in.
              </p>
            </div>
            <div>
              <span>02</span>
              <h3>Fluency across every dialect</h3>
              <p>
                Real customers do not speak in clean studio scripts. Vozon natively understands 50+
                regional and global languages—including Hindi, Tamil, Telugu, Marathi, and regional
                accents—with seamless mid-call switching.
              </p>
            </div>
            <div>
              <span>03</span>
              <h3>Deterministic enterprise action</h3>
              <p>
                A great conversation must produce a verified outcome. Vozon couples neural voice
                comprehension with strict tool execution across Salesforce, Zoho, Google Calendar,
                and WhatsApp Business with zero hallucinations.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            3. HIGH-IMPACT PROOF METRICS (Dark Band)
            ================================================================== */}
        <section className="hcr-proof">
          <div className="hcr-wrap">
            <div className="hcr-proof-grid">
              <div>
                <strong>88ms</strong>
                <span>First-audio synthesis latency</span>
              </div>
              <div>
                <strong>50+</strong>
                <span>Languages &amp; regional Indic accents</span>
              </div>
              <div>
                <strong>99.98%</strong>
                <span>Multi-carrier SIP telephony uptime</span>
              </div>
              <div>
                <strong>0%</strong>
                <span>Speech data retention (ZDR guarantee)</span>
              </div>
            </div>

            <div className="hcr-proof-tools">
              <span>TRUSTED ACROSS ENTERPRISE ECOSYSTEMS</span>
              <b>Twilio SIP</b>
              <b>Exotel</b>
              <b>Salesforce</b>
              <b>Zoho CRM</b>
              <b>Meta WhatsApp</b>
              <b>Google Calendar</b>
            </div>
          </div>
        </section>

        {/* ==================================================================
            4. OUR FOUNDING STORY & TIMELINE (Dedicated About Layout)
            ================================================================== */}
        <section className="hcr-launch hcr-wrap">
          <div>
            <p className="hcr-kicker">OUR FOUNDING STORY</p>
            <h2>Why we started Vozon AI.</h2>
            <p style={{ color: "#656970", fontSize: "15px", lineHeight: 1.7, marginTop: "16px" }}>
              For over three decades, business telephony remained locked in touch-tone phone trees.
              Early AI voice wrappers failed to fix it because daisy-chaining separate STT, LLM,
              and TTS APIs created 2-second pauses and robotic cadence.
            </p>
            <p style={{ color: "#656970", fontSize: "15px", lineHeight: 1.7, marginTop: "14px" }}>
              Operating from Bengaluru and San Francisco, our team of acoustic researchers and
              telecom engineers built an integrated voice operating layer from the ground up—so
              enterprises can deploy agents that sound human, act reliably, and scale infinitely.
            </p>
          </div>
          <div className="hcr-launch-options">
            {milestones.map((item) => (
              <div key={item.year}>
                <span>{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            5. COMPANY VALUES & GLOBAL PRESENCE (Clean Typographic Cards)
            ================================================================== */}
        <section className="hcr-platform hcr-wrap">
          <p className="hcr-kicker">OUR PRINCIPLES &amp; FOOTPRINT</p>
          <h2>Built by engineers who care about real-world reliability.</h2>

          <div className="hcr-platform-grid">
            <div>
              <span>01 · ENGINEERING</span>
              <h3>Latency &amp; acoustic precision</h3>
              <p>
                Every millisecond of delay degrades trust. We co-locate our streaming inference nodes
                next to Tier-1 telecom exchanges for crisp, natural turn-taking.
              </p>
              <strong>SUB-88MS STANDARD</strong>
            </div>

            <div>
              <span>02 · SECURITY</span>
              <h3>Zero Data Retention (ZDR)</h3>
              <p>
                Customer voice streams are processed transiently in memory and never used to train
                shared public models. SOC 2 Type II, ISO 27001, and HIPAA ready.
              </p>
              <strong>ENTERPRISE GOVERNANCE</strong>
            </div>

            <div>
              <span>03 · GLOBAL HUBS</span>
              <h3>Bengaluru &amp; San Francisco</h3>
              <p>
                Core acoustic research and SIP infrastructure in Bengaluru, paired with North America
                enterprise engineering and edge nodes in Mumbai, Singapore, and Frankfurt.
              </p>
              <strong>BLR · SFO · GLOBAL EDGE</strong>
            </div>
          </div>
        </section>

        {/* ==================================================================
            6. NEXT STEPS (2-Column Launch Split)
            ================================================================== */}
        <section className="hcr-launch hcr-wrap">
          <div>
            <p className="hcr-kicker">WORK WITH US</p>
            <h2>Build with the voice platform teams trust.</h2>
          </div>
          <div className="hcr-launch-options">
            <div>
              <span>FOR ENTERPRISES</span>
              <h3>Schedule an architecture review</h3>
              <p>
                Work directly with our solutions architects to connect your SIP trunks, test
                multilingual call flows, and deploy into your private VPC.
              </p>
              <Link href="/contact">
                Talk to our team <span aria-hidden="true">&#8599;</span>
              </Link>
            </div>
            <div>
              <span>FOR BUILDERS</span>
              <h3>Join the team shaping voice AI</h3>
              <p>
                We are hiring across real-time audio DSP, distributed telephony, and conversational
                product design in Bengaluru and San Francisco.
              </p>
              <Link href="/career">
                Explore open roles <span aria-hidden="true">&#8599;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ==================================================================
            7. COMPANY FAQ ACCORDION
            ================================================================== */}
        <section className="hcr-faq hcr-wrap">
          <p className="hcr-kicker">FREQUENTLY ASKED QUESTIONS</p>
          <h2>Everything you need to know about Vozon AI.</h2>

          <div className="hcr-faq-list">
            {aboutFaqs.map((faq, idx) => (
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
