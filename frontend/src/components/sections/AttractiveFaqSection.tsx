"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import styles from "./AttractiveFaqSection.module.css";

export type FaqCategory =
  | "all"
  | "voice-ai"
  | "telephony-kyc"
  | "integrations"
  | "security"
  | "pricing";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
  link?: {
    text: string;
    href: string;
  };
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "free-trial",
    category: "pricing",
    categoryLabel: "Pricing & Trials",
    question: "Can I test Vozon for free?",
    answer:
      "Yes! You can sign up immediately with zero credit card required. We provide complimentary starter minutes and access to test voice agents, custom knowledge base uploads, and web-based audio calling so you can evaluate conversational quality before picking a production tier.",
    highlights: ["No credit card required", "Instant starter minutes", "Full web testbench"],
    link: {
      text: "Start Free Trial",
      href: "/dashboard",
    },
  },
  {
    id: "how-voice-works",
    category: "voice-ai",
    categoryLabel: "Voice AI",
    question: "How does Vozon achieve natural, ultra-low latency voice conversations?",
    answer:
      "Vozon orchestrates a proprietary high-speed WebRTC streaming pipeline. We combine continuous streaming speech recognition (Sarvam, Deepgram), sub-second LLM reasoning (OpenAI GPT-4o, Google Gemini 2.0 Flash, Sarvam Indic), and neural voice synthesis (ElevenLabs & Sarvam Bulbul) to deliver natural turn-taking with sub-400ms latency and real-time user interruption handling.",
    highlights: ["< 400ms turn-around latency", "Ultra-fast WebRTC audio", "Real-time barge-in & interruption"],
  },
  {
    id: "languages-supported",
    category: "voice-ai",
    categoryLabel: "Voice AI",
    question: "Which Indian and global languages and accents are supported?",
    answer:
      "We support English (with US, UK, and Indian accents) as well as 12+ Indian languages including Hindi (हिन्दी), Hinglish, Gujarati, Kannada, Bengali, Marathi, Tamil, Telugu, Malayalam, Punjabi, Odia, and Assamese. Our acoustic and pronunciation models accurately handle colloquial phrasing and code-switching.",
    highlights: ["12+ Indian regional languages", "Fluent Hinglish & code-switching", "Natural local accents"],
  },
  {
    id: "human-handoff",
    category: "voice-ai",
    categoryLabel: "Voice AI",
    question: "What happens if a caller asks to speak with a human agent?",
    answer:
      "Vozon handles zero-drop warm call transfers. The AI smoothly pauses the caller, dials your human agent or SIP PBX queue, passes the live transcript, customer sentiment, and intent summary to the representative, and steps aside once connected.",
    highlights: ["Zero-drop warm transfers", "Live sentiment & transcript pass", "SIP PBX & phone compatibility"],
  },
  {
    id: "kyc-telephony",
    category: "telephony-kyc",
    categoryLabel: "Telephony & KYC",
    question: "How do Indian phone numbers and e-KYC compliance work on Vozon?",
    answer:
      "In strict compliance with Department of Telecommunications (DoT) and TRAI TCCCPR 2018 regulations, Indian 10-digit virtual and toll-free numbers require verified business identification. Vozon integrates free instant DigiLocker & Aadhaar OTP e-KYC directly within your dashboard, enabling fully automated identity verification without manual paperwork.",
    highlights: ["Instant DigiLocker e-KYC", "TRAI & DoT compliant", "Free automated verification"],
    link: {
      text: "View Telephony Setup",
      href: "/dashboard/phone-numbers",
    },
  },
  {
    id: "crm-integrations",
    category: "integrations",
    categoryLabel: "Integrations",
    question: "Can Vozon connect with our existing CRM, calendar, and databases?",
    answer:
      "Absolutely. Vozon features native bi-directional integrations with Salesforce, HubSpot, Google Calendar, WhatsApp, Slack, and Zapier. Additionally, you can define custom Webhook tools and REST endpoints that the AI agent calls dynamically during a conversation to book appointments, check order status, or update CRM records.",
    highlights: ["HubSpot, Salesforce & Zapier", "Google Calendar auto-booking", "Real-time Webhook tool execution"],
    link: {
      text: "Explore Integrations",
      href: "/dashboard",
    },
  },
  {
    id: "bring-your-own-trunk",
    category: "telephony-kyc",
    categoryLabel: "Telephony & KYC",
    question: "Can I bring my own existing SIP trunk or phone numbers (BYOT)?",
    answer:
      "Yes. If your organization already has carrier relationships with Twilio, Vobiz, Tata Tele, Airtel, Exotel, or any standard RFC-compliant SIP provider, you can connect your existing credentials directly in the Telephony settings to route calls through your preferred trunks.",
    highlights: ["BYOT / SIP trunk support", "Twilio, Tata, Airtel & Exotel", "Custom auth credentials"],
  },
  {
    id: "enterprise-security",
    category: "security",
    categoryLabel: "Enterprise & Security",
    question: "How does Vozon protect our customer data and maintain privacy?",
    answer:
      "Security and data sovereignty are fundamental to Vozon. All media streams and transcripts are encrypted in transit (TLS 1.3, SRTP) and at rest (AES-256). We are ISO 27001 certified, SOC 2 Type II compliant, GDPR-ready, and fully compliant with India's Digital Personal Data Protection (DPDP) Act 2023. We offer customizable data retention and PII redaction out of the box.",
    highlights: ["DPDP Act 2023 & GDPR ready", "SOC 2 Type II & ISO 27001", "Automatic PII redaction"],
    link: {
      text: "Visit Trust Center",
      href: "/resources/trust-center",
    },
  },
  {
    id: "deployment-speed",
    category: "pricing",
    categoryLabel: "Pricing & Trials",
    question: "How fast can we deploy an AI voice agent into production?",
    answer:
      "Most teams deploy their first operational agent in under 15 minutes. You select an industry template (e.g. Healthcare triage, Real Estate lead qualification, E-commerce support), upload your company FAQs or knowledge documents, assign a phone number, and test the agent live immediately.",
    highlights: ["Under 15 minutes go-live", "One-click knowledge upload", "Pre-built industry templates"],
  },
];

const CATEGORIES: { id: FaqCategory; label: string; icon: string }[] = [
  { id: "all", label: "All Questions", icon: "✦" },
  { id: "voice-ai", label: "Voice AI", icon: "🎙️" },
  { id: "telephony-kyc", label: "Telephony & KYC", icon: "📞" },
  { id: "integrations", label: "Integrations", icon: "⚡" },
  { id: "security", label: "Security & Trust", icon: "🛡️" },
  { id: "pricing", label: "Pricing & Setup", icon: "💳" },
];

export function AttractiveFaqSection() {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllInAllCategory, setShowAllInAllCategory] = useState(false);
  const [openItemIds, setOpenItemIds] = useState<Record<string, boolean>>({
    "free-trial": true, // open first item by default for inviting engagement
  });

  const searchInputId = useId();

  // Filter items based on active category and search input
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!q) return true;

      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(q)))
      );
    });
  }, [selectedCategory, searchQuery]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: FAQ_DATA.length };
    FAQ_DATA.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Determine visible items (shows 6 questions properly in "all" to match right side height)
  const visibleFaqs = useMemo(() => {
    if (selectedCategory === "all" && !searchQuery && !showAllInAllCategory) {
      return filteredFaqs.slice(0, 6);
    }
    return filteredFaqs;
  }, [filteredFaqs, selectedCategory, searchQuery, showAllInAllCategory]);

  const toggleItem = (id: string) => {
    setOpenItemIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    setShowAllInAllCategory(true);
    const allOpen: Record<string, boolean> = {};
    filteredFaqs.forEach((item) => {
      allOpen[item.id] = true;
    });
    setOpenItemIds(allOpen);
  };

  const collapseAll = () => {
    setOpenItemIds({});
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return (
    <section className={styles.faqContainer} id="faq" aria-label="Frequently Asked Questions">
      {/* Header Area */}
      <div className={styles.headerArea}>
        <div className={styles.eyebrowBadge}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          KNOWLEDGE &amp; ANSWERS
        </div>
        <h2 className={styles.mainHeading}>
          Frequently Asked <strong>Questions</strong>
        </h2>
        <p className={styles.headerSubtitle}>
          Everything you need to know about Vozon conversational AI agents, compliant Indian telephony,
          enterprise security, and workflow integrations.
        </p>
      </div>

      {/* Interactive Controls Bar */}
      <div className={styles.controlsBar}>
        {/* Search Bar & Action Toggles */}
        <div className={styles.searchAndToggles}>
          <div className={styles.searchBox}>
            <svg
              className={styles.searchIcon}
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id={searchInputId}
              type="text"
              className={styles.searchInput}
              placeholder="Search questions (e.g. KYC, latency, DigiLocker, BYOT, transfer)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search frequently asked questions"
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery("")}
                aria-label="Clear search text"
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.actionToggles}>
            <button
              type="button"
              className={styles.toggleAllBtn}
              onClick={expandAll}
              title="Expand all currently visible questions"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              Expand All
            </button>
            <button
              type="button"
              className={styles.toggleAllBtn}
              onClick={collapseAll}
              title="Collapse all questions"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              Collapse All
            </button>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className={styles.categoryPills} role="tablist" aria-label="Filter FAQ by topic">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                className={`${styles.pillButton} ${isActive ? styles.activePill : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className={styles.pillIcon} aria-hidden="true">{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={styles.pillCount}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main FAQ Layout: Accordions + Sidebar */}
      <div className={styles.faqLayoutGrid}>
        {/* Accordions Column */}
        <div className={styles.accordionColumn}>
          <div className={styles.accordionList}>
            {filteredFaqs.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>
                  <svg viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3>No matching questions found</h3>
                <p>
                  We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;.
                  Try adjusting your search terms or browse all categories.
                </p>
                <button type="button" className={styles.resetBtn} onClick={resetFilters}>
                  Reset Search &amp; Filters
                </button>
              </div>
            ) : (
              visibleFaqs.map((faq) => {
                const isOpen = !!openItemIds[faq.id];
                const contentId = `faq-answer-${faq.id}`;
                const triggerId = `faq-trigger-${faq.id}`;

                return (
                  <div
                    key={faq.id}
                    className={`${styles.faqCard} ${isOpen ? styles.cardOpen : ""}`}
                  >
                    <button
                      id={triggerId}
                      type="button"
                      className={styles.cardHeader}
                      onClick={() => toggleItem(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                    >
                      <div className={styles.cardHeaderLeft}>
                        <span className={styles.itemCategoryTag}>
                          <span>•</span> {faq.categoryLabel}
                        </span>
                        <h3 className={styles.cardQuestion}>{faq.question}</h3>
                      </div>

                      <div className={styles.toggleCircle} aria-hidden="true">
                        <svg className={styles.toggleIcon} viewBox="0 0 24 24">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </button>

                    {isOpen && (
                      <div
                        id={contentId}
                        role="region"
                        aria-labelledby={triggerId}
                        className={styles.cardBody}
                      >
                        <div className={styles.answerDivider} />
                        <p className={styles.answerText}>{faq.answer}</p>

                        {faq.highlights && faq.highlights.length > 0 && (
                          <div className={styles.answerHighlights}>
                            {faq.highlights.map((highlight, idx) => (
                              <span key={idx} className={styles.highlightPill}>
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {highlight}
                              </span>
                            ))}
                          </div>
                        )}

                        {faq.link && (
                          <div style={{ marginTop: "14px" }}>
                            <Link
                              href={faq.link.href}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "13.5px",
                                fontWeight: 700,
                                color: "#0e6f62",
                                textDecoration: "underline",
                                textUnderlineOffset: "4px",
                              }}
                            >
                              {faq.link.text} →
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {selectedCategory === "all" && !searchQuery && filteredFaqs.length > 6 && (
            <button
              type="button"
              className={styles.viewMoreBtn}
              onClick={() => setShowAllInAllCategory((prev) => !prev)}
            >
              <span className={styles.viewMoreIcon}>
                {showAllInAllCategory ? "▲" : "▼"}
              </span>
              <span>
                {showAllInAllCategory
                  ? "Show Fewer Questions"
                  : `Show All ${filteredFaqs.length} Questions (${filteredFaqs.length - 6} More)`}
              </span>
            </button>
          )}
        </div>

        {/* Support Aside Card */}
        <aside className={styles.supportAside}>
          <div className={styles.supportCard}>
            <div className={styles.supportGlow} aria-hidden="true" />
            <div className={styles.supportIconRing}>
              <svg viewBox="0 0 24 24">
                <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
                <path d="M6 12H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1v-6ZM18 12h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v-6Z" />
                <path d="M19 18v.25A2.75 2.75 0 0 1 16.25 21H14" />
                <circle cx="13" cy="21" r="1" />
              </svg>
            </div>
            <h3>Still have questions?</h3>
            <p>
              Can&apos;t find what you&apos;re looking for? Our voice AI engineers and telecom compliance
              specialists are here to help you get answers.
            </p>

            <div className={styles.supportActions}>
              <Link href="/contact" className={styles.primarySupportBtn}>
                Talk to Team
              </Link>
              <Link href="/dashboard" className={styles.secondarySupportBtn}>
                Test Voice Agent Live
              </Link>
            </div>

            <div className={styles.liveBadge}>
              <span className={styles.liveDot} aria-hidden="true" />
              <span>Average response time: &lt; 15 mins</span>
            </div>
          </div>

          <div className={styles.quickInfoCard}>
            <h4>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#108d82" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Quick Highlights
            </h4>
            <ul className={styles.quickInfoList}>
              <li>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Free instant DigiLocker e-KYC for India numbers</span>
              </li>
              <li>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Ultra-low latency sub-400ms conversational turn</span>
              </li>
              <li>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>ISO 27001 &amp; DPDP Act 2023 compliant</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
