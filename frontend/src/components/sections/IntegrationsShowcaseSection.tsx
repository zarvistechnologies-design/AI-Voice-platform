"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./IntegrationsShowcaseSection.css";

interface IntegrationApp {
  name: string;
  detail: string;
  icon: string;
  tone: string;
  category: string;
}

const integrationSlides: IntegrationApp[][] = [
  // Slide 1 (4 Cards)
  [
    {
      name: "Google Sheets",
      detail: "Sync live call outcomes, customer records, and leads instantly.",
      icon: "/images/integrations/google-sheets.svg",
      tone: "sheets",
      category: "Spreadsheets",
    },
    {
      name: "Salesforce",
      detail: "Automatically log calls, update pipeline stages, and sync contacts.",
      icon: "/images/integrations/salesforce.svg",
      tone: "salesforce",
      category: "Enterprise CRM",
    },
    {
      name: "WhatsApp Business",
      detail: "Seamless voice-to-WhatsApp handoff and rich interactive messages.",
      icon: "/images/integrations/whatsapp.svg",
      tone: "whatsapp",
      category: "Messaging",
    },
    {
      name: "Shopify",
      detail: "Real-time order lookup, tracking updates, and abandoned cart recovery.",
      icon: "/images/company-logos/shopify.svg",
      tone: "shopify",
      category: "E-Commerce",
    },
  ],
  // Slide 2 (4 Cards)
  [
    {
      name: "Calendly",
      detail: "Book meetings, sales demos, and consultations during live calls.",
      icon: "/images/integrations/calendly.svg",
      tone: "calendly",
      category: "Scheduling",
    },
    {
      name: "HubSpot",
      detail: "Enrich customer timelines, capture inbound leads, and trigger tasks.",
      icon: "/images/company-logos/hubspot.svg",
      tone: "hubspot",
      category: "Marketing & CRM",
    },
    {
      name: "Notion",
      detail: "Empower agents with approved company knowledge, FAQs, and policies.",
      icon: "/images/company-logos/notion.svg",
      tone: "notion",
      category: "Knowledge Base",
    },
    {
      name: "Claude",
      detail: "Audit call reasoning, trace decisions, and summarize complex chats.",
      icon: "/images/integrations/claude.svg",
      tone: "claude",
      category: "AI Reasoning",
    },
  ],
  // Slide 3 (4 Cards)
  [
    {
      name: "Slack",
      detail: "Instant alerts for hot leads, human escalations, and flagged calls.",
      icon: "/images/integrations/slack.svg",
      tone: "slack",
      category: "Team Alerts",
    },
    {
      name: "Google Calendar",
      detail: "Check advisor availability and book appointments in real time.",
      icon: "/images/integrations/google-calendar.svg",
      tone: "calendar",
      category: "Productivity",
    },
    {
      name: "Gmail",
      detail: "Dispatch post-call confirmation emails and calendar invites.",
      icon: "/images/integrations/gmail.svg",
      tone: "gmail",
      category: "Email",
    },
    {
      name: "Google Drive",
      detail: "Access product brochures, policy forms, and contracts automatically.",
      icon: "/images/integrations/googledrive.svg",
      tone: "drive",
      category: "Cloud Storage",
    },
  ],
  // Slide 4 (4 Cards)
  [
    {
      name: "Zoho CRM",
      detail: "Sync contact details, deal stages, and call transcripts seamlessly.",
      icon: "/images/integrations/zoho.svg",
      tone: "zoho",
      category: "Sales Pipeline",
    },
    {
      name: "ClickUp",
      detail: "Convert customer requests and action items into assigned tickets.",
      icon: "/images/integrations/clickup.svg",
      tone: "clickup",
      category: "Project Tasks",
    },
    {
      name: "Asana",
      detail: "Trigger automated fulfillment workflows and team task queues.",
      icon: "/images/integrations/asana.svg",
      tone: "asana",
      category: "Operations",
    },
    {
      name: "Zapier",
      detail: "Connect your custom webhooks and workflows across 5,000+ tools.",
      icon: "/images/integrations/zapier.png",
      tone: "zapier",
      category: "Automation",
    },
  ],
];

export function IntegrationsShowcaseSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  function prevSlide() {
    setCurrentSlide((curr) => (curr === 0 ? integrationSlides.length - 1 : curr - 1));
  }

  function nextSlide() {
    setCurrentSlide((curr) => (curr + 1) % integrationSlides.length);
  }

  return (
    <section className="integrations-showcase" aria-labelledby="integrations-showcase-title">
      <div className="integrations-showcase-inner">
        {/* Centered Heading */}
        <div className="integrations-showcase-heading">
          <span className="integrations-eyebrow"><i aria-hidden="true" /> CONNECTED ECOSYSTEM</span>
          <h2 id="integrations-showcase-title">
            One intelligent layer for the apps you use.
          </h2>
          <p>
            Connect Voice AI, WhatsApp, and autonomous agents to your calendars, CRMs, sheets, and APIs seamlessly.
          </p>
        </div>

        {/* 4-Card Carousel Wrapper */}
        <div className="integrations-carousel-container">
          {/* Previous Button */}
          <button
            aria-label="Previous integration slide"
            className="carousel-nav-btn is-prev"
            onClick={prevSlide}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Viewport */}
          <div className="integrations-carousel-viewport">
            <div
              className="integrations-carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {integrationSlides.map((slide, slideIdx) => (
                <div key={slideIdx} className="integrations-carousel-slide">
                  {slide.map((app) => (
                    <article key={app.name} className="integrations-app-card">
                      <div className="integrations-card-header">
                        <span className={`integrations-app-icon is-${app.tone}`}>
                          <Image alt="" height={28} src={app.icon} width={28} />
                        </span>
                        <span className="integrations-card-badge">{app.category}</span>
                      </div>
                      <h3>{app.name}</h3>
                      <p>{app.detail}</p>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            aria-label="Next integration slide"
            className="carousel-nav-btn is-next"
            onClick={nextSlide}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="integrations-carousel-dots" aria-label="Integration carousel pagination">
          {integrationSlides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to integration slide ${idx + 1}`}
              aria-current={currentSlide === idx ? "true" : undefined}
              className={`carousel-dot${currentSlide === idx ? " is-active" : ""}`}
              onClick={() => setCurrentSlide(idx)}
              type="button"
            />
          ))}
        </div>

        {/* Centered Action Link */}
        <div className="integrations-showcase-actions">
          <Link className="integrations-showcase-link" href="/integrations">
            <span>Explore 100+ Integrations</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
