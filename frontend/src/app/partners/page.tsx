"use client";

import Link from "next/link";
import { useState } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "@/app/business/industries/healthcare/healthcare.css";
import "@/components/company/CompanyEditorial.css";

const steps = [
  {
    number: "01",
    title: "Shape your offer",
    body: "Choose the customer segment, voice & WhatsApp use cases, and support model you want to bring to market.",
  },
  {
    number: "02",
    title: "Brand your workspaces",
    body: "Configure a white-labeled client experience with isolated workspaces, custom domains, and dedicated API keys.",
  },
  {
    number: "03",
    title: "Scale with visibility",
    body: "Monitor call minutes, agent performance, and client billing across your entire portfolio from one partner console.",
  },
];

const partnerFaqs = [
  {
    question: "Who is the Vozon partner & affiliate program for?",
    answer:
      "It is designed for AI agencies, system integrators, telecom resellers, and BPOs that want to offer autonomous voice and WhatsApp automation to their clients—either as a referral affiliate or under their own white-label brand.",
  },
  {
    question: "Can each client have an isolated workspace?",
    answer:
      "Yes. Every client account receives its own isolated workspace with separate telephony trunks, voice clones, CRM credentials, and usage logs.",
  },
  {
    question: "What margins and support do partners receive?",
    answer:
      "Partners receive wholesale per-minute voice pricing, recurring revenue share on referrals, a dedicated testing sandbox, and direct onboarding support from our solutions engineering team.",
  },
  {
    question: "How quickly can we launch our first client?",
    answer:
      "Once your partner workspace is provisioned, you can deploy pre-built industry templates for healthcare, logistics, or lead qualification in under 15 minutes.",
  },
];

export default function PartnersPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="hcr-site sln-site">
      <SiteHeader />

      <main className="hcr-page cmp-page">
        {/* ==================================================================
            1. 2-COLUMN EDITORIAL HERO (Compact Headings + Partner Ledger)
            ================================================================== */}
        <section className="cmp-hero hcr-wrap">
          <div className="hcr-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Partners &amp; Affiliate Program</span>
          </div>

          <div className="cmp-hero-stage">
            <div className="cmp-hero-grid">
              <div className="cmp-hero-left">
                <p className="hcr-kicker">PARTNERS &amp; AFFILIATE PROGRAM</p>
                <h1>Build a conversational AI offer with your name on it.</h1>
                <p className="cmp-hero-lead">
                  Bring sub-88ms voice agents and WhatsApp automation to your clients through
                  isolated workspaces, white-label controls, and predictable wholesale economics.
                </p>
                <div className="cmp-hero-actions">
                  <Link
                    href="/contact?topic=white-label-partnership"
                    className="cmp-btn-primary"
                  >
                    Apply to partner <span aria-hidden="true">&#8599;</span>
                  </Link>
                  <a href="#partner-tracks" className="cmp-btn-secondary">
                    Explore tracks <span aria-hidden="true">&#8595;</span>
                  </a>
                </div>
              </div>

              <div className="cmp-ledger" aria-label="Partner program overview">
                <div className="cmp-ledger-head">
                  <span>PARTNER PROGRAM</span>
                  <span className="cmp-ledger-badge">
                    <i aria-hidden="true" /> Applications Open
                  </span>
                </div>
                <div className="cmp-ledger-row">
                  <span>Program Tracks</span>
                  <strong>White-Label · Agency · Affiliate</strong>
                </div>
                <div className="cmp-ledger-row">
                  <span>Client Isolation</span>
                  <strong>Dedicated Workspaces &amp; Trunks</strong>
                </div>
                <div className="cmp-ledger-row">
                  <span>Telephony Support</span>
                  <strong>Twilio, Exotel, Plivo &amp; Custom SIP</strong>
                </div>
                <div className="cmp-ledger-row">
                  <span>Onboarding SLA</span>
                  <strong>Sandbox Ready in 24 Hours</strong>
                </div>
                <div className="cmp-ledger-row">
                  <span>Partner Enablement</span>
                  <strong>Dedicated Solutions Architect</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            2. HOW IT WORKS (3-Column Bordered Grid)
            ================================================================== */}
        <section className="sln-audiences hcr-wrap">
          <p className="hcr-kicker">HOW IT COMES TOGETHER</p>
          <h2>A clear path from client pitch to live deployment.</h2>
          <div className="sln-audience-grid">
            {steps.map((step) => (
              <div key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
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
                <span>Languages &amp; Indic dialects ready</span>
              </div>
              <div>
                <strong>99.98%</strong>
                <span>Multi-carrier SIP uptime SLA</span>
              </div>
              <div>
                <strong>15 min</strong>
                <span>Template-to-live client setup</span>
              </div>
            </div>

            <div className="hcr-proof-tools">
              <span>BUILT FOR AGENCIES &amp; INTEGRATORS</span>
              <b>Custom Domains</b>
              <b>Client Billing</b>
              <b>Isolated Keys</b>
              <b>Zoho &amp; Salesforce</b>
              <b>WhatsApp Cloud</b>
            </div>
          </div>
        </section>

        {/* ==================================================================
            4. PARTNER TRACKS (3-Column Clean Cards)
            ================================================================== */}
        <section className="hcr-platform hcr-wrap" id="partner-tracks">
          <p className="hcr-kicker">PARTNERSHIP TRACKS</p>
          <h2>Choose the model that fits your business.</h2>

          <div className="hcr-platform-grid">
            <div>
              <span>01 · WHITE-LABEL</span>
              <h3>AI Agencies &amp; Consultancies</h3>
              <p>
                Deliver voice and WhatsApp agents under your own brand, custom domain, and pricing
                tiers while Vozon powers the real-time infrastructure underneath.
              </p>
              <strong>CUSTOM BRANDING · WHOLESALE RATES</strong>
            </div>

            <div>
              <span>02 · INTEGRATORS</span>
              <h3>System Integrators &amp; BPOs</h3>
              <p>
                Embed sub-88ms conversational voice directly into enterprise Salesforce, Zoho, ERP,
                and contact center deployments with private VPC support.
              </p>
              <strong>CO-SELL ENGINEERING · SLA BACKED</strong>
            </div>

            <div>
              <span>03 · AFFILIATE</span>
              <h3>Referral &amp; Technology Partners</h3>
              <p>
                Introduce businesses looking to automate inbound support or outbound qualification
                and earn recurring revenue share on every active workspace.
              </p>
              <strong>RECURRING REV SHARE · ZERO OVERHEAD</strong>
            </div>
          </div>
        </section>

        {/* ==================================================================
            5. LAUNCH SPLIT
            ================================================================== */}
        <section className="hcr-launch hcr-wrap">
          <div>
            <p className="hcr-kicker">PARTNER WITH VOZON</p>
            <h2>Tell us what you want to build for your clients.</h2>
          </div>
          <div className="hcr-launch-options">
            <div>
              <span>WHITE-LABEL &amp; AGENCY</span>
              <h3>Request a partner sandbox</h3>
              <p>
                Get access to multi-workspace management, wholesale minute pricing, and live
                industry voice templates to demo to your clients.
              </p>
              <Link href="/contact?topic=white-label-partnership">
                Start a conversation <span aria-hidden="true">&#8599;</span>
              </Link>
            </div>
            <div>
              <span>TECHNICAL EVALUATION</span>
              <h3>Review the voice platform</h3>
              <p>
                Test our sub-88ms voice agents, voice cloning studio, and WhatsApp Cloud API
                workflows before pitching your next client.
              </p>
              <Link href="/product/ai-voice-agent">
                Explore AI Voice Agent <span aria-hidden="true">&#8599;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ==================================================================
            6. PARTNER FAQ
            ================================================================== */}
        <section className="hcr-faq hcr-wrap">
          <p className="hcr-kicker">PARTNER FAQ</p>
          <h2>What partners ask first.</h2>

          <div className="hcr-faq-list">
            {partnerFaqs.map((faq, idx) => (
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
