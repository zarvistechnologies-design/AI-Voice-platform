import Link from "next/link";

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
    accent: "border-[#45ddce]/28 bg-[#45ddce]/[0.055]",
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
    accent: "border-[#8b7cff]/28 bg-[#8b7cff]/[0.055]",
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
    accent: "border-[#ffb25b]/28 bg-[#ffb25b]/[0.05]",
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
    accent: "border-[#ff6ca8]/28 bg-[#ff6ca8]/[0.05]",
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
    accent: "border-[#65a8ff]/28 bg-[#65a8ff]/[0.05]",
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
  New: "border-[#45ddce]/28 bg-[#45ddce]/10 text-[#75fff0]",
  Improved: "border-[#8b7cff]/28 bg-[#8b7cff]/10 text-[#b8adff]",
  Fixed: "border-[#ffb25b]/28 bg-[#ffb25b]/10 text-[#ffc982]",
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
  return (
    <SiteLayout>
      <main className="min-h-screen bg-black text-white">
        <section className="relative overflow-hidden bg-black px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pt-32">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_76%_20%,rgba(69,221,206,0.13),transparent_30%),radial-gradient(circle_at_18%_72%,rgba(139,124,255,0.08),transparent_28%),linear-gradient(rgba(69,221,206,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(69,221,206,0.025)_1px,transparent_1px)] [background-size:auto,auto,64px_64px,64px_64px]"
          />

          <div className="relative mx-auto max-w-[1240px]">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#75fff0]">
                  Product updates
                </p>
                <h1 className="mt-4 max-w-[820px] text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
                  What&apos;s new at vozon
                </h1>
              </div>
              <p className="border-l border-[#45ddce]/35 pl-6 text-base leading-8 text-white/48">
                A clear record of improvements to voice agents, analytics, integrations, and
                platform controls.
              </p>
            </div>

            <div className="mt-14 overflow-hidden rounded-2xl border border-[#45ddce]/22 bg-[#050807]/90 shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur">
              <div className="grid lg:grid-cols-[210px_minmax(0,1fr)_170px]">
                <div className="flex items-center gap-3 border-b border-white/[0.07] p-6 lg:border-b-0 lg:border-r">
                  <span className="relative flex size-3">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#45ddce] opacity-45" />
                    <span className="relative inline-flex size-3 rounded-full bg-[#45ddce]" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/32">
                      Latest release
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/82">{releases[0].date}</p>
                  </div>
                </div>
                <div className="border-b border-white/[0.07] p-6 lg:border-b-0 lg:border-r">
                  <p className="text-sm font-semibold text-[#75fff0]">{releases[0].category}</p>
                  <p className="mt-1 text-lg font-semibold text-white/90">{releases[0].title}</p>
                </div>
                <div className="flex items-center justify-between p-6 lg:justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                    Version
                  </span>
                  <span className="rounded-full border border-[#45ddce]/25 bg-[#45ddce]/[0.08] px-3 py-1.5 font-mono text-xs text-[#75fff0]">
                    {releases[0].version}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#020403] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#75fff0]">
                Release archive
              </p>
              <nav aria-label="Changelog releases" className="mt-5">
                <ul className="m-0 list-none space-y-1 p-0">
                  {releases.map((release, index) => (
                    <li key={release.version}>
                      <a
                        className={`flex items-center justify-between rounded-lg border px-3.5 py-3 text-sm transition ${
                          index === 0
                            ? "border-[#45ddce]/20 bg-[#45ddce]/[0.07] text-white/90"
                            : "border-transparent text-white/42 hover:border-white/10 hover:bg-white/[0.025] hover:text-white/72"
                        }`}
                        href={`#release-${release.version.slice(1).replaceAll(".", "-")}`}
                      >
                        <span>{release.date.replace(", 2026", "")}</span>
                        <span className="font-mono text-[10px] text-white/28">{release.version}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.018] p-5">
                <p className="text-xs font-semibold text-white/72">How to read this log</p>
                <p className="mt-3 text-xs leading-6 text-white/38">
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

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute bottom-10 left-[19px] top-7 w-px bg-gradient-to-b from-[#45ddce]/55 via-[#8b7cff]/25 to-transparent sm:left-[23px]"
              />

              <div className="space-y-8">
                {releases.map((release) => (
                  <article
                    className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-6"
                    id={`release-${release.version.slice(1).replaceAll(".", "-")}`}
                    key={release.version}
                  >
                    <div className="relative z-10 flex justify-center pt-7">
                      <span className="grid size-10 place-items-center rounded-xl border border-[#45ddce]/20 bg-[#07100e] text-[#75fff0] shadow-[0_0_28px_rgba(0,0,0,0.8)]">
                        <ReleaseMark />
                      </span>
                    </div>

                    <div
                      className={`overflow-hidden rounded-2xl border p-6 shadow-[0_22px_70px_rgba(0,0,0,0.24)] sm:p-8 ${release.accent}`}
                    >
                      <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75fff0]">
                              {release.category}
                            </span>
                            <span aria-hidden="true" className="size-1 rounded-full bg-white/20" />
                            <time className="text-xs text-white/34">{release.date}</time>
                          </div>
                          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white/92 sm:text-3xl">
                            {release.title}
                          </h2>
                        </div>
                        <span className="w-fit shrink-0 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 font-mono text-[10px] text-white/48">
                          {release.version}
                        </span>
                      </div>

                      <p className="mt-6 max-w-[760px] text-sm leading-7 text-white/48">
                        {release.summary}
                      </p>

                      <ul className="mt-7 m-0 list-none space-y-4 p-0">
                        {release.updates.map((update) => (
                          <li
                            className="grid gap-2.5 sm:grid-cols-[82px_minmax(0,1fr)] sm:items-start"
                            key={`${update.type}-${update.text}`}
                          >
                            <span
                              className={`mt-0.5 w-fit rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${updateTypeStyles[update.type]}`}
                            >
                              {update.type}
                            </span>
                            <p className="text-sm leading-6 text-white/64">{update.text}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto flex max-w-[1040px] flex-col items-start justify-between gap-8 rounded-2xl border border-[#45ddce]/20 bg-[linear-gradient(115deg,rgba(69,221,206,0.1),rgba(139,124,255,0.035)_52%,transparent)] p-7 sm:p-10 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                Need more detail?
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                Plan your next voice workflow update.
              </h2>
              <p className="mt-3 max-w-[620px] text-sm leading-7 text-white/46">
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
