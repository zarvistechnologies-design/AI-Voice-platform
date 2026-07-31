import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

type TopicIconName = "launch" | "voice" | "calls" | "code" | "analytics" | "workspace";

const helpTopics = [
  {
    title: "Getting started",
    description: "Set up your workspace, create an agent, and prepare your first test call.",
    guides: "5 guides",
    icon: "launch" as TopicIconName,
    accent: "border-[#45ddce]/24 bg-[#45ddce]/[0.055]",
    iconStyle: "border-[#45ddce]/25 bg-[#45ddce]/10 text-[#75fff0]",
  },
  {
    title: "Voice agents",
    description: "Configure instructions, voices, languages, tools, and conversation behaviour.",
    guides: "8 guides",
    icon: "voice" as TopicIconName,
    accent: "border-[#8b7cff]/24 bg-[#8b7cff]/[0.05]",
    iconStyle: "border-[#8b7cff]/25 bg-[#8b7cff]/10 text-[#b8adff]",
  },
  {
    title: "Calls & conversations",
    description: "Understand phone numbers, transfers, recordings, transcripts, and outcomes.",
    guides: "7 guides",
    icon: "calls" as TopicIconName,
    accent: "border-[#ffb25b]/24 bg-[#ffb25b]/[0.045]",
    iconStyle: "border-[#ffb25b]/25 bg-[#ffb25b]/10 text-[#ffc982]",
  },
  {
    title: "Integrations & API",
    description: "Connect business tools, configure webhooks, and troubleshoot API requests.",
    guides: "9 guides",
    icon: "code" as TopicIconName,
    accent: "border-[#65a8ff]/24 bg-[#65a8ff]/[0.045]",
    iconStyle: "border-[#65a8ff]/25 bg-[#65a8ff]/10 text-[#91c2ff]",
  },
  {
    title: "Analytics",
    description: "Review transcripts, call outcomes, trends, quality signals, and exports.",
    guides: "6 guides",
    icon: "analytics" as TopicIconName,
    accent: "border-[#ff6ca8]/24 bg-[#ff6ca8]/[0.045]",
    iconStyle: "border-[#ff6ca8]/25 bg-[#ff6ca8]/10 text-[#ff9bc4]",
  },
  {
    title: "Workspace & billing",
    description: "Manage teammates, permissions, usage, invoices, and subscription settings.",
    guides: "6 guides",
    icon: "workspace" as TopicIconName,
    accent: "border-[#8ee06f]/24 bg-[#8ee06f]/[0.045]",
    iconStyle: "border-[#8ee06f]/25 bg-[#8ee06f]/10 text-[#b3ef9c]",
  },
] as const;

const popularGuides = [
  {
    category: "Getting started",
    title: "Create and test your first voice agent",
    description: "Move from a blank workspace to a complete test conversation.",
    href: "/services/voice-agents",
  },
  {
    category: "Voice agents",
    title: "Write clear instructions for natural conversations",
    description: "Structure the agent's role, boundaries, questions, and recovery behaviour.",
    href: "/resources/blog",
  },
  {
    category: "Calls & conversations",
    title: "Configure human handoffs without losing context",
    description: "Choose transfer conditions and pass the information a teammate needs.",
    href: "/services/voice-agents",
  },
  {
    category: "Integrations & API",
    title: "Connect an agent to your business tools",
    description: "Use scoped access, confirmations, webhooks, and observable tool actions.",
    href: "/dashboard/developers",
  },
  {
    category: "Analytics",
    title: "Review transcripts, outcomes, and call quality",
    description: "Find conversations that need attention and understand recurring patterns.",
    href: "/services/speech-analytics",
  },
  {
    category: "Workspace & billing",
    title: "Manage workspace access and production permissions",
    description: "Give each teammate the access they need without exposing sensitive controls.",
    href: "/resources/trust-center",
  },
] as const;

const faqs = [
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
      "Use the narrowest permissions possible, validate every request, and require confirmation before sensitive actions. Keep tool activity observable so your team can review failures and unusual behaviour.",
  },
  {
    question: "Where can I review transcripts and call outcomes?",
    answer:
      "Conversation analytics should provide transcripts, detected intent, call outcome, transfer details, tool activity, and quality signals. Access may depend on your workspace role and retention settings.",
  },
  {
    question: "What should I test before launching an agent?",
    answer:
      "Test normal requests as well as silence, interruptions, corrections, noisy audio, unexpected questions, tool failures, and human escalation. Confirm that every call ends with a clear outcome.",
  },
] as const;

function TopicIcon({ name }: { name: TopicIconName }) {
  if (name === "launch") {
    return (
      <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path d="m7 17-2 2m5-1 1 3 3-4m-8-7-3 1 4 3m3-4 4 4c4-3 5-7 5-9-2 0-6 1-9 5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        <circle cx="15.5" cy="8.5" fill="currentColor" r="1.2" />
      </svg>
    );
  }

  if (name === "voice") {
    return (
      <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path d="M4 12h2l1.5-4 3 8 3-9 2.5 6H20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    );
  }

  if (name === "calls") {
    return (
      <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path d="M8.1 4.5 5.8 6c.4 5.8 6.4 11.8 12.2 12.2l1.5-2.3-3.8-2.3-1.6 1.4a12.4 12.4 0 0 1-5-5l1.3-1.7-2.3-3.8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    );
  }

  if (name === "code") {
    return (
      <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path d="m8.5 7-5 5 5 5m7-10 5 5-5 5m-2-12-3 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    );
  }

  if (name === "analytics") {
    return (
      <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path d="M5 19V9m7 10V5m7 14v-7M3 19h18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 19c.5-3.3 2.3-5 5.5-5s5 1.7 5.5 5M15 8h5m-2.5-2.5v5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function HelpCenterPage() {
  return (
    <SiteLayout>
      <main className="min-h-screen bg-black text-white">
        <section className="relative overflow-hidden bg-black px-5 pb-0 pt-28 sm:px-8 sm:pt-32 lg:px-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(69,221,206,0.14),transparent_31%),radial-gradient(circle_at_82%_66%,rgba(139,124,255,0.07),transparent_26%),linear-gradient(rgba(69,221,206,0.024)_1px,transparent_1px),linear-gradient(90deg,rgba(69,221,206,0.024)_1px,transparent_1px)] [background-size:auto,auto,64px_64px,64px_64px]"
          />

          <div className="relative mx-auto max-w-[1080px] text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#75fff0]">
              Help center
            </p>
            <h1 className="mx-auto mt-4 max-w-[820px] text-4xl font-semibold tracking-[-0.052em] sm:text-6xl">
              Your guide to better voice experiences.
            </h1>
            <p className="mx-auto mt-5 max-w-[680px] text-base leading-8 text-white/48">
              Find practical answers for building, launching, and managing reliable AI voice
              experiences.
            </p>
          </div>
        </section>

        <section className="bg-[#020403] px-5 pb-6 pt-0 sm:px-8 lg:px-12 lg:pb-8">
          <div className="mx-auto max-w-[1240px]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                Browse help
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Find the right starting point.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {helpTopics.map((topic) => (
                <article
                  className={`group rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 ${topic.accent}`}
                  key={topic.title}
                >
                  <div className={`grid size-11 place-items-center rounded-xl border ${topic.iconStyle}`}>
                    <TopicIcon name={topic.icon} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.025em] text-white/90">
                    {topic.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/44">{topic.description}</p>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/28">
                    {topic.guides}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                  Popular guides
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  Step-by-step help for common tasks.
                </h2>
              </div>
              <div className="mt-9 grid overflow-hidden rounded-2xl border border-white/[0.09] bg-[#050706] md:grid-cols-2">
                {popularGuides.map((guide) => (
                  <Link
                    className="group flex min-h-[170px] flex-col justify-between border-b border-white/[0.08] p-6 transition hover:bg-[#45ddce]/[0.035] md:nth-[odd]:border-r"
                    href={guide.href}
                    key={guide.title}
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#75fff0]">
                        {guide.category}
                      </p>
                      <h3 className="mt-3 text-lg font-semibold text-white/86">{guide.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/40">{guide.description}</p>
                    </div>
                    <span className="mt-5 flex items-center gap-2 text-xs font-semibold text-white/42 transition group-hover:gap-3 group-hover:text-[#75fff0]">
                      Read guide
                      <ArrowIcon />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
          <div className="mx-auto grid max-w-[1160px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                Common questions
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Quick answers, clearly explained.
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/44">
                Start here for the questions teams ask most often while designing and operating
                AI voice agents.
              </p>
            </div>

            <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {faqs.map((faq) => (
                <details className="group py-1" key={faq.question}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-base font-semibold text-white/82 marker:hidden">
                    {faq.question}
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 text-[#75fff0] transition group-open:rotate-45 group-open:border-[#45ddce]/30">
                      <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                      </svg>
                    </span>
                  </summary>
                  <p className="max-w-[740px] pb-6 pr-12 text-sm leading-7 text-white/46">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#020403] px-5 pb-20 pt-6 sm:px-8 lg:px-12 lg:pb-24 lg:pt-8">
          <div className="mx-auto max-w-[1160px]">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                Contact support
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Still need a hand?
              </h2>
              <p className="mx-auto mt-4 max-w-[600px] text-sm leading-7 text-white/44">
                Choose the support path that best matches your question.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <a
                className="group rounded-2xl border border-[#45ddce]/20 bg-[#45ddce]/[0.045] p-6 transition hover:-translate-y-1 hover:border-[#45ddce]/38"
                href="mailto:hello@vozon.ai"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#75fff0]">Email</p>
                <h3 className="mt-4 text-xl font-semibold">Email our support team</h3>
                <p className="mt-3 text-sm leading-6 text-white/42">Send details, screenshots, or call references to hello@vozon.ai.</p>
                <span className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#75fff0] transition group-hover:gap-3">
                  Send an email
                  <ArrowIcon />
                </span>
              </a>

              <Link
                className="group rounded-2xl border border-[#8b7cff]/20 bg-[#8b7cff]/[0.045] p-6 transition hover:-translate-y-1 hover:border-[#8b7cff]/38"
                href="/contact"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#b8adff]">General help</p>
                <h3 className="mt-4 text-xl font-semibold">Contact our team</h3>
                <p className="mt-3 text-sm leading-6 text-white/42">Get help with setup, workflows, account questions, or production planning.</p>
                <span className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#b8adff] transition group-hover:gap-3">
                  Contact support
                  <ArrowIcon />
                </span>
              </Link>

              <Link
                className="group rounded-2xl border border-[#65a8ff]/20 bg-[#65a8ff]/[0.045] p-6 transition hover:-translate-y-1 hover:border-[#65a8ff]/38"
                href="/dashboard/developers"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#91c2ff]">Technical help</p>
                <h3 className="mt-4 text-xl font-semibold">Visit the developer portal</h3>
                <p className="mt-3 text-sm leading-6 text-white/42">Review API access, integrations, webhook setup, and developer tools.</p>
                <span className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#91c2ff] transition group-hover:gap-3">
                  Open developer portal
                  <ArrowIcon />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
