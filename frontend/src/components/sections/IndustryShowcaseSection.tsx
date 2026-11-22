"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./IndustryShowcaseSection.css";

type IndustryItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
  icon: () => React.ReactNode;
};

const industries: IndustryItem[] = [
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Capture leads, schedule site visits, and close more deals.",
    image: "/images/industries/real-estate.jpg",
    href: "/business/lead-qualification",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21h18M5 21V7l8-4 6 3v15M9 9v.01M9 13v.01M9 17v.01M15 9v.01M15 13v.01M15 17v.01" />
      </svg>
    ),
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Handle appointments, reminders, and patient queries efficiently.",
    image: "/images/industries/healthcare.jpg",
    href: "/business/industries/healthcare",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 9v6M9 12h6" />
      </svg>
    ),
  },
  {
    id: "insurance",
    name: "Insurance",
    description: "Qualify leads, explain policies, and support customers 24/7.",
    image: "/images/industries/insurance.jpg",
    href: "/business/industries/insurance",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "restaurants",
    name: "Restaurants",
    description: "Take reservations, answer queries, and manage orders seamlessly.",
    image: "/images/industries/restaurants.jpg",
    href: "/business/receptionists",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2M15 11v11M5 2v10a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2M7 14v8" />
      </svg>
    ),
  },
  {
    id: "finance",
    name: "Finance",
    description: "Assist with inquiries, follow-ups, and document collection.",
    image: "/images/industries/finance.jpg",
    href: "/business/industries/financial-services",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 3h12M6 8h12M6 13l7.5 8M6 13h4a4 4 0 0 0 0-8" />
      </svg>
    ),
  },
  {
    id: "education",
    name: "Education",
    description: "Generate leads, share information, and manage admissions.",
    image: "/images/industries/education.jpg",
    href: "/business/customer-support",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Support customers, process orders, and handle returns.",
    image: "/images/industries/ecommerce.jpg",
    href: "/business/industries/retail-consumer",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    ),
  },
  {
    id: "collections",
    name: "Collections",
    description: "Automate reminders, follow-ups, and payment confirmations.",
    image: "/images/industries/collections.jpg",
    href: "/business/lead-qualification",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    ),
  },
];

export function IndustryShowcaseSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section aria-labelledby="industry-showcase-title" className="industry-showcase">
      <div className="industry-showcase-inner">
        {/* Vozon Standard Section Header */}
        <div className="industry-showcase-header">
          <span className="industry-eyebrow">
            <i aria-hidden="true" /> TAILORED WORKFLOWS · MULTICHANNEL AI
          </span>
          <h2 id="industry-showcase-title">
            AI Automation for Every Industry
          </h2>
          <p>
            Deploy autonomous voice and WhatsApp agents pre-configured with industry blueprints, tool calling, and live CRM sync.
          </p>
        </div>

        {/* 4x2 Cards Bento Grid */}
        <div className="industry-grid">
          {industries.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <Link
                href={item.href}
                key={item.id}
                className={`industry-card ${isSelected ? "is-selected" : ""}`}
                onMouseEnter={() => setSelectedId(item.id)}
                onMouseLeave={() => setSelectedId(null)}
              >
                <div className="industry-card-media">
                  {/* Floating Circular Badge */}
                  <div className="industry-card-badge" aria-hidden="true">
                    {item.icon()}
                  </div>

                  {/* Photo with aspect-ratio */}
                  <div className="industry-card-img-wrap">
                    <Image
                      src={item.image}
                      alt={`${item.name} AI agent automation with Vozon`}
                      width={400}
                      height={250}
                      className="industry-card-img"
                      sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 25vw"
                    />
                  </div>
                </div>

                <div className="industry-card-content">
                  <div className="industry-card-head">
                    <h3 className="industry-card-name">{item.name}</h3>
                    <span className="industry-channel-tag">Voice &amp; WhatsApp</span>
                  </div>
                  <p className="industry-card-desc">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Vozon-Themed Filter Pills */}
        <nav aria-label="Filter industries" className="industry-pills-nav">
          {industries.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <button
                type="button"
                key={item.id}
                className={`industry-pill ${isSelected ? "is-active" : ""}`}
                onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
              >
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
