"use client";

import Link from "next/link";
import { useState } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "@/app/business/industries/healthcare/healthcare.css";
import "@/components/company/CompanyEditorial.css";

const helpTopics = [
  {
    number: "01",
    title: "Getting started",
    description: "Set up your workspace, create an agent, and prepare your first test call.",
    guides: "5 GUIDES",
    href: "/product/ai-voice-agent",
  },
  {
    number: "02",
    title: "Voice agents",
    description:
      "Configure instructions, voices, languages, tools, and conversation behaviour.",
    guides: "8 GUIDES",
    href: "/product/voice-cloning",
  },
  {
    number: "03",
    title: "Calls & conversations",
    description: "Understand phone numbers, transfers, recordings, transcripts, and outcomes.",
    guides: "7 GUIDES",
    href: "/product/workflows",
  },
  {
    number: "04",
    title: "Integrations & API",
    description: "Connect business tools, configure webhooks, and troubleshoot API requests.",
    guides: "9 GUIDES",
    href: "/docs/api",
  },
  {
    number: "05",
    title: "Analytics & quality",
    description: "Review transcripts, call outcomes, trends, quality signals, and exports.",
    guides: "6 GUIDES",
    href: "/product/end-to-end-automation",
  },
  {
    number: "06",
    title: "Workspace & security",
    description: "Manage teammates, permissions, usage, invoices, and ZDR compliance.",
    guides: "6 GUIDES",
    href: "/privacy",
  },
];

const popularGuides = [
  {
    category: "GETTING STARTED",
    title: "Create and test your first voice agent",
    description: "Move from a blank workspace to a complete sub-88ms test conversation.",
    href: "/product/ai-voice-agent",
  },
  {
    category: "VOICE AGENTS",
    title: "Write clear instructions for natural calls",
    description: "Structure the agent's role, boundaries, questions, and recovery behaviour.",
    href: "/resources/blog",
  },
  {
    category: "INTEGRATIONS & API",
    title: "Connect an agent to your business tools",
    description: "Use scoped access, confirmations, webhooks, and observable tool actions.",
    href: "/docs/api",
  },
  {
    category: "WHATSAPP & OMNICHANNEL",
    title: "Trigger post-call WhatsApp cards automatically",
    description: "Send booking passes, dispatch links, and CRM updates right after a call.",
    href: "/product/whatsapp-api",
  },
];

const supportFaqs = [
  {
    question: "How do I create my first AI voice agent?",
    answer:
      "Start by defining the agent's purpose, caller goals, and boundaries. Choose a voice and language, add the information or tools it needs, then test common paths and edge cases before publishing.",
  },
  {
    question: "Can a voice agent transfer a call to a person?",
    answer:
      "Yes. You can define handoff conditions for complex, sensitive, or high-value calls. A good handoff includes the caller's intent, collected details, transcript context, and actions already attempted.",
  },
  {
    question: "How should integrations access business data?",
    answer:
      "Grant only the permissions needed for the workflow, validate identifiers before updating records, require caller confirmation for sensitive actions, and log every webhook attempt.",
  },
  {
    question: "How can I contact Vozon technical support?",
    answer:
      "Reach our engineering support team directly via the Contact page or email hello@vozon.ai with your workspace ID and call trace ID for rapid troubleshooting.",
  },
];

export function HelpCenterPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="hcr-site sln-site">
      <SiteHeader />

      <main className="hcr-page cmp-page">
        {/* ==================================================================
            1. 2-COLUMN EDITORIAL HERO (Compact Headings + Support Ledger)
            ================================================================== */}
        <section className="cmp-hero hcr-wrap">
          <div className="hcr-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Support &amp; Help Center</span>
          </div>

          <div className="cmp-hero-stage">
            <div className="cmp-hero-grid">
              <div className="cmp-hero-left">
                <p className="hcr-kicker">VOZON SUPPORT · HELP CENTER</p>
                <h1>Your guide to better voice experiences.</h1>
                <p className="cmp-hero-lead">
                  Find practical answers for building, launching, and troubleshooting reliable AI
                  voice agents, SIP trunks, and CRM integrations.
                </p>
                <div className="cmp-hero-actions">
                  <Link href="/docs/api" className="cmp-btn-primary">
                    Explore API docs <span aria-hidden="true">&#8599;</span>
                  </Link>
                  <Link href="/contact" className="cmp-btn-secondary">
                    Contact support <span aria-hidden="true">&#8599;</span>
                  </Link>
                </div>
              </div>

              <div className="cmp-ledger" aria-label="Support channels">
                <div className="cmp-ledger-head">
                  <span>SUPPORT CHANNELS</span>
                  <span className="cmp-ledger-badge">
                    <i aria-hidden="true" /> Systems Operational
                  </span>
                </div>
                <Link href="/docs/api" className="cmp-ledger-link">
                  <div>
                    <strong>REST &amp; Streaming API Reference</strong>
                    <small>Endpoints, webhooks &amp; SSE call events</small>
                  </div>
                  <span>Docs &rarr;</span>
                </Link>
                <Link href="/resources/changelog" className="cmp-ledger-link">
                  <div>
                    <strong>Platform Changelog</strong>
                    <small>Latest voice engine &amp; SDK updates</small>
                  </div>
                  <span>View &rarr;</span>
                </Link>
                <Link href="/resources/blog" className="cmp-ledger-link">
                  <div>
                    <strong>Implementation Field Guides</strong>
                    <small>Best practices for low-latency call design</small>
                  </div>
                  <span>Guides &rarr;</span>
                </Link>
                <Link href="/contact" className="cmp-ledger-link">
                  <div>
                    <strong>Direct Engineering Support</strong>
                    <small>hello@vozon.ai · &lt; 4h response SLA</small>
                  </div>
                  <span>Ticket &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            2. TOPIC CATEGORIES (3-Column Clean Cards)
            ================================================================== */}
        <section className="hcr-platform hcr-wrap" style={{ paddingTop: "24px" }}>
          <p className="hcr-kicker">BROWSE HELP</p>
          <h2>Find the right starting point.</h2>

          <div className="hcr-platform-grid">
            {helpTopics.map((topic) => (
              <Link key={topic.title} href={topic.href}>
                <span>{topic.number}</span>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <strong>{topic.guides}</strong>
              </Link>
            ))}
          </div>
        </section>

        {/* ==================================================================
            3. POPULAR GUIDES (2-Column Launch Split)
            ================================================================== */}
        <section className="hcr-launch hcr-wrap">
          <div>
            <p className="hcr-kicker">POPULAR GUIDES</p>
            <h2>Step-by-step answers for production teams.</h2>
          </div>
          <div className="hcr-launch-options">
            {popularGuides.map((guide) => (
              <div key={guide.title}>
                <span>{guide.category}</span>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
                <Link href={guide.href}>
                  Open guide <span aria-hidden="true">&#8599;</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            4. SUPPORT FAQ ACCORDION
            ================================================================== */}
        <section className="hcr-faq hcr-wrap">
          <p className="hcr-kicker">COMMON QUESTIONS</p>
          <h2>Quick answers from our engineering team.</h2>

          <div className="hcr-faq-list">
            {supportFaqs.map((faq, idx) => (
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
