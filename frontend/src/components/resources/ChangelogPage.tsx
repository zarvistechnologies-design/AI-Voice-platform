"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { SiteLayout } from "@/components/layout/SiteLayout";

type UpdateType = "New" | "Improved" | "Fixed";

type Release = {
  date: string;
  version: string;
  category: string;
  title: string;
  summary: string;
  accent: string;
  updates: Array<{
    type: UpdateType;
    text: string;
  }>;
};

const releases: Release[] = [
  {
    date: "July 24, 2026",
    version: "v1.8.0",
    category: "Voice agents",
    title: "More natural conversations and cleaner handoffs",
    summary:
      "This release gives teams finer control over interruptions, recovery prompts, and the context passed to a person when a call needs help.",
    accent: "border-[#dfe7e3] bg-white",
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
    category: "Analytics",
    title: "Conversation outcomes that are easier to act on",
    summary:
      "Teams can now review call quality by outcome and quickly locate the conversations that need attention.",
    accent: "border-[#dfe7e3] bg-white",
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
    category: "Integrations",
    title: "Safer tool actions and more reliable webhooks",
    summary:
      "Integration controls now make it simpler to protect sensitive actions and diagnose failures across connected systems.",
    accent: "border-[#dfe7e3] bg-white",
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
    category: "Voices & languages",
    title: "Consistent pronunciation across multilingual calls",
    summary:
      "New language-level controls help agents pronounce business terms, names, and abbreviations more consistently.",
    accent: "border-[#dfe7e3] bg-white",
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
    category: "Platform",
    title: "Stronger workspace access and audit visibility",
    summary:
      "Workspace owners have clearer control over who can edit agents, access recordings, and manage production integrations.",
    accent: "border-[#dfe7e3] bg-white",
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

const updateTypeStyles: Record<UpdateType, string> = {
  New: "border-[#b8d9d1] bg-[#edf8f5] text-[#0d6f61]",
  Improved: "border-[#d8d0ef] bg-[#f5f2ff] text-[#6551a8]",
  Fixed: "border-[#ead7bc] bg-[#fff8ec] text-[#946114]",
};

function ReleaseMark() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 12h3l2-5 4 10 2-5h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ChangelogPage() {
  const [activeVersion, setActiveVersion] = useState(releases[0].version);
  const releasePanelRef = useRef<HTMLDivElement>(null);

  function selectRelease(version: string) {
    setActiveVersion(version);
    const panel = releasePanelRef.current;
    const release = panel?.querySelector<HTMLElement>(`[data-release-version="${version}"]`);
    if (panel && release) panel.scrollTo({ top: release.offsetTop - 8, behavior: "smooth" });
  }

  return (
    <SiteLayout>
      <main className="changelog-page min-h-screen bg-white text-[#14231f]">
        <section className="changelog-hero border-b border-[#e5ebe8] bg-white px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pt-32">

          <div className="relative mx-auto max-w-[1240px]">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#75fff0]">
                  Product updates
                </p>
                <h1 className="mt-4 max-w-[820px] text-4xl font-semibold tracking-[-0.05em] text-[#14231f] sm:text-6xl">
                  What&apos;s new at vozon
                </h1>
              </div>
              <p className="border-l border-[#45ddce] pl-6 text-base leading-8 text-[#5d6c67]">
                A clear record of improvements to voice agents, analytics, integrations, and
                platform controls.
              </p>
            </div>

            <div className="changelog-latest mt-14 overflow-hidden rounded-2xl border border-[#dfe7e3] bg-white shadow-[0_18px_48px_rgba(20,35,31,0.07)]">
              <div className="grid lg:grid-cols-[210px_minmax(0,1fr)_170px]">
                <div className="flex items-center gap-3 border-b border-[#e5ebe8] p-6 lg:border-b-0 lg:border-r">
                  <span className="relative flex size-3">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#45ddce] opacity-45" />
                    <span className="relative inline-flex size-3 rounded-full bg-[#45ddce]" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#73807c]">
                      Latest release
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#263a34]">{releases[0].date}</p>
                  </div>
                </div>
                <div className="border-b border-[#e5ebe8] p-6 lg:border-b-0 lg:border-r">
                  <p className="text-sm font-semibold text-[#0d806e]">{releases[0].category}</p>
                  <p className="mt-1 text-lg font-semibold text-[#14231f]">{releases[0].title}</p>
                </div>
                <div className="flex items-center justify-between p-6 lg:justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#73807c]">
                    Version
                  </span>
                  <span className="rounded-full border border-[#b8d9d1] bg-[#edf8f5] px-3 py-1.5 font-mono text-xs text-[#0d6f61]">
                    {releases[0].version}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="changelog-archive bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#75fff0]">
                Release archive
              </p>
              <nav aria-label="Changelog releases" className="mt-5">
                <ul className="m-0 list-none space-y-1 p-0">
                  {releases.map((release) => (
                    <li key={release.version}>
                      <button
                        aria-pressed={activeVersion === release.version}
                        className={`flex items-center justify-between rounded-lg border px-3.5 py-3 text-sm transition ${
                          activeVersion === release.version
                            ? "border-[#b8d9d1] bg-[#edf8f5] text-[#14231f]"
                            : "border-transparent text-[#66736f] hover:border-[#dfe7e3] hover:bg-[#f7f9f8] hover:text-[#14231f]"
                        } w-full`}
                        onClick={() => selectRelease(release.version)}
                        type="button"
                      >
                        <span>{release.date.replace(", 2026", "")}</span>
                        <span className="font-mono text-[10px] text-[#7a8782]">{release.version}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="changelog-guide mt-8 rounded-xl border border-[#dfe7e3] bg-white p-5 shadow-[0_12px_32px_rgba(20,35,31,0.05)]">
                <p className="text-xs font-semibold text-[#263a34]">How to read this log</p>
                <p className="mt-3 text-xs leading-6 text-[#66736f]">
                  New introduces a capability. Improved refines existing behaviour. Fixed resolves
                  an issue affecting reliability or usability.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(Object.keys(updateTypeStyles) as UpdateType[]).map((type) => (
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${updateTypeStyles[type]}`}
                      key={type}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

            <div
              aria-label="Release details"
              className="relative space-y-8 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-3"
              ref={releasePanelRef}
              role="region"
            >
              {releases.map((release) => (
                <article
                  className="relative grid scroll-mt-4 grid-cols-[40px_minmax(0,1fr)] gap-4 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-6"
                  data-release-version={release.version}
                  key={release.version}
                >
                  <div className="relative z-10 flex justify-center pt-7">
                    <span className={`changelog-release-mark grid size-10 place-items-center rounded-xl border bg-white text-[#0d806e] transition ${activeVersion === release.version ? "border-[#58b9a7] shadow-[0_0_0_6px_rgba(21,150,127,0.12)]" : "border-[#9ccfc4] shadow-[0_0_0_6px_rgba(21,150,127,0.07)]"}`}>
                      <ReleaseMark />
                    </span>
                  </div>

                  <div className={`changelog-release-card overflow-hidden rounded-2xl border p-6 shadow-[0_18px_48px_rgba(20,35,31,0.07)] sm:p-8 ${release.accent} ${activeVersion === release.version ? "ring-2 ring-[#15967f]/15" : ""}`}>
                    <div className="flex flex-col gap-4 border-b border-[#e5ebe8] pb-6 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0d806e]">{release.category}</span>
                          <span aria-hidden="true" className="size-1 rounded-full bg-[#9aa7a2]" />
                          <time className="text-xs text-[#73807c]">{release.date}</time>
                        </div>
                        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#14231f] sm:text-3xl">{release.title}</h2>
                      </div>
                      <span className="w-fit shrink-0 rounded-full border border-[#dfe7e3] bg-[#f7f9f8] px-3 py-1.5 font-mono text-[10px] text-[#5d6c67]">{release.version}</span>
                    </div>

                    <p className="mt-6 max-w-[760px] text-sm leading-7 text-[#5d6c67]">{release.summary}</p>

                    <ul className="mt-7 m-0 list-none space-y-4 p-0">
                      {release.updates.map((update) => (
                        <li className="grid gap-2.5 sm:grid-cols-[82px_minmax(0,1fr)] sm:items-start" key={`${update.type}-${update.text}`}>
                          <span className={`changelog-update-pill mt-0.5 w-fit rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${updateTypeStyles[update.type]}`}>{update.type}</span>
                          <p className="text-sm leading-6 text-[#52625d]">{update.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="changelog-contact-section bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-16">
          <div className="changelog-contact mx-auto flex max-w-[1040px] flex-col items-start justify-between gap-8 rounded-2xl border border-[#dfe7e3] bg-white p-7 shadow-[0_18px_48px_rgba(20,35,31,0.07)] sm:p-10 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                Need more detail?
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#14231f]">
                Plan your next voice workflow update.
              </h2>
              <p className="mt-3 max-w-[620px] text-sm leading-7 text-[#5d6c67]">
                Talk with our team about release readiness, integrations, or changes to your
                production agents.
              </p>
            </div>
            <Link
              className="inline-flex min-h-12 shrink-0 items-center rounded-lg bg-[#45ddce] px-6 text-sm font-bold text-[#02110e] transition hover:bg-[#75fff0]"
              href="/contact"
            >
              Contact our team
            </Link>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
