"use client";

import Link from "next/link";
import { useState } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "@/app/business/industries/healthcare/healthcare.css";
import "@/components/company/CompanyEditorial.css";

type UpdateType = "New" | "Improved" | "Fixed";

type Release = {
  date: string;
  version: string;
  category: string;
  title: string;
  summary: string;
  updates: Array<{
    type: UpdateType;
    text: string;
  }>;
};

const releases: Release[] = [
  {
    date: "July 24, 2026",
    version: "v1.8.0",
    category: "VOICE AGENTS",
    title: "More natural conversations and cleaner handoffs",
    summary:
      "This release gives teams finer control over interruptions, recovery prompts, and the context passed to a person when a call needs help.",
    updates: [
      {
        type: "New",
        text: "Configure interruption sensitivity for each agent and call environment.",
      },
      {
        type: "Improved",
        text: "Human handoffs now include the detected intent, collected details, and actions already attempted.",
      },
      {
        type: "Fixed",
        text: "Reduced repeated prompts after silence, corrections, or a brief network delay.",
      },
    ],
  },
  {
    date: "July 10, 2026",
    version: "v1.7.2",
    category: "ANALYTICS",
    title: "Conversation outcomes that are easier to act on",
    summary:
      "Teams can now review call quality by outcome and quickly locate the conversations that need attention.",
    updates: [
      {
        type: "New",
        text: "Filter conversations by resolution, transfer, failed action, sentiment shift, and custom outcome.",
      },
      {
        type: "Improved",
        text: "Analytics summaries now separate caller intent from the final call result.",
      },
      {
        type: "Improved",
        text: "CSV exports preserve filters and include agent, language, duration, and outcome fields.",
      },
    ],
  },
  {
    date: "June 26, 2026",
    version: "v1.7.0",
    category: "INTEGRATIONS",
    title: "Safer tool actions and more reliable webhooks",
    summary:
      "Integration controls now make it simpler to protect sensitive actions and diagnose failures across connected systems.",
    updates: [
      {
        type: "New",
        text: "Require caller confirmation before an agent completes selected tool actions.",
      },
      {
        type: "New",
        text: "Inspect webhook attempts, response status, processing time, and retry history in one view.",
      },
      {
        type: "Fixed",
        text: "Improved retry handling for duplicate events and temporary provider timeouts.",
      },
    ],
  },
  {
    date: "June 12, 2026",
    version: "v1.6.4",
    category: "VOICES & LANGUAGES",
    title: "Consistent pronunciation across multilingual calls",
    summary:
      "New language-level controls help agents pronounce business terms, names, and abbreviations more consistently.",
    updates: [
      {
        type: "New",
        text: "Create reusable pronunciation rules for each supported language.",
      },
      {
        type: "Improved",
        text: "Voice previews now use the selected language, pace, and pronunciation settings.",
      },
      {
        type: "Fixed",
        text: "Smoother language switching when a workflow routes callers between regional agents.",
      },
    ],
  },
  {
    date: "May 29, 2026",
    version: "v1.6.0",
    category: "PLATFORM",
    title: "Stronger workspace access and audit visibility",
    summary:
      "Workspace owners have clearer control over who can edit agents, access recordings, and manage production integrations.",
    updates: [
      {
        type: "New",
        text: "Assign workspace roles for agent editing, analytics review, integrations, and administration.",
      },
      {
        type: "New",
        text: "Audit history records important agent, permission, and integration changes.",
      },
      {
        type: "Improved",
        text: "Production agents now show the published version and the teammate responsible for the change.",
      },
    ],
  },
];

export function ChangelogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", "VOICE AGENTS", "ANALYTICS", "INTEGRATIONS", "VOICES & LANGUAGES", "PLATFORM"];
  const visibleReleases =
    selectedCategory === "ALL"
      ? releases
      : releases.filter((r) => r.category === selectedCategory);

  return (
    <div className="hcr-site sln-site">
      <SiteHeader />

      <main className="hcr-page cmp-page">
        {/* ==================================================================
            1. 2-COLUMN EDITORIAL HERO (Compact Headings + Release Ledger)
            ================================================================== */}
        <section className="cmp-hero hcr-wrap">
          <div className="hcr-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Changelog</span>
          </div>

          <div className="cmp-hero-stage">
            <div className="cmp-hero-grid">
              <div className="cmp-hero-left">
                <p className="hcr-kicker">PRODUCT UPDATES · CHANGELOG</p>
                <h1>What&apos;s new at Vozon AI.</h1>
                <p className="cmp-hero-lead">
                  A transparent engineering record of improvements to our sub-88ms voice engine,
                  SIP telephony, analytics, and platform integrations.
                </p>
                <div className="cmp-hero-actions">
                  <a href="#release-archive" className="cmp-btn-primary">
                    Browse releases <span aria-hidden="true">&#8595;</span>
                  </a>
                  <Link href="/docs/api" className="cmp-btn-secondary">
                    API reference <span aria-hidden="true">&#8599;</span>
                  </Link>
                </div>
              </div>

              <div className="cmp-ledger" aria-label="Recent releases">
                <div className="cmp-ledger-head">
                  <span>RECENT RELEASES</span>
                  <span className="cmp-ledger-badge">
                    <i aria-hidden="true" /> Latest: {releases[0].version}
                  </span>
                </div>
                {releases.slice(0, 4).map((rel) => (
                  <a
                    key={rel.version}
                    href={`#release-${rel.version}`}
                    className="cmp-ledger-link"
                  >
                    <div>
                      <strong>{rel.title}</strong>
                      <small>{rel.date} · {rel.category}</small>
                    </div>
                    <span>{rel.version}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            2. RELEASE ARCHIVE (Clean Editorial Cards with Filter)
            ================================================================== */}
        <section className="hcr-launch hcr-wrap" id="release-archive" style={{ paddingTop: "24px" }}>
          <div>
            <p className="hcr-kicker">RELEASE ARCHIVE</p>
            <h2>Every ship, documented clearly.</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "22px" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    border: "1px solid #d7d9db",
                    background: selectedCategory === cat ? "#17191d" : "#ffffff",
                    color: selectedCategory === cat ? "#ffffff" : "#525866",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="hcr-launch-options">
            {visibleReleases.map((release) => (
              <div key={release.version} id={`release-${release.version}`}>
                <span>
                  {release.version} · {release.date.toUpperCase()} · {release.category}
                </span>
                <h3>{release.title}</h3>
                <p style={{ marginBottom: "14px" }}>{release.summary}</p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "18px",
                    display: "grid",
                    gap: "8px",
                    color: "#525866",
                    fontSize: "13px",
                    lineHeight: 1.55,
                  }}
                >
                  {release.updates.map((u) => (
                    <li key={u.text}>
                      <strong style={{ color: "#17191d", fontWeight: 600 }}>{u.type}:</strong>{" "}
                      {u.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
