"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { docsTopics } from "@/lib/docsContent";

type DocSection = {
  id: string;
  group: string;
  title: string;
  summary: string;
  keywords: string;
};

const sections: DocSection[] = [
  { id: "overview", group: "Start here", title: "Overview", summary: "Understand the Vozon platform and the fastest path to a live call.", keywords: "introduction concepts voice agent" },
  { id: "quickstart", group: "Start here", title: "Quickstart", summary: "Create an agent, connect a number, and place your first call.", keywords: "setup first call launch" },
  { id: "agents", group: "Build", title: "Configure an agent", summary: "Define language, voice, instructions, behavior, and tools.", keywords: "prompt llm tts stt language hindi voice" },
  { id: "knowledge", group: "Build", title: "Knowledge bases", summary: "Ground answers in approved text, files, and web pages.", keywords: "rag sources documents url upload search" },
  { id: "phone-numbers", group: "Deploy", title: "Phone numbers", summary: "Connect numbers for inbound and outbound calling.", keywords: "import buy inbound outbound telephony" },
  { id: "campaigns", group: "Deploy", title: "Campaign operations", summary: "Launch campaigns, automate callbacks, and understand every result.", keywords: "csv leads start launch results callback outcome qa cost rupees inr pause resume suppression" },
  { id: "call-logs", group: "Observe", title: "Call logs", summary: "Review transcripts, recordings, outcomes, latency, and cost.", keywords: "analytics transcript recording billing latency" },
  { id: "billing", group: "Observe", title: "Billing", summary: "Understand credits, call charges, top-ups, and invoices.", keywords: "wallet platform fee invoice cost payment" },
  { id: "authentication", group: "API reference", title: "Authentication", summary: "Create scoped API keys and authenticate requests.", keywords: "bearer key scopes security" },
  { id: "api-calls", group: "API reference", title: "Calls API", summary: "Trigger calls and retrieve call records programmatically.", keywords: "rest curl endpoint outbound get list" },
  { id: "webhooks", group: "API reference", title: "Webhooks", summary: "Receive signed call lifecycle events reliably.", keywords: "events signature retry endpoint" },
  { id: "errors", group: "API reference", title: "Errors", summary: "Handle status codes, validation failures, and retries.", keywords: "400 401 403 409 429 500 troubleshooting" },
  { id: "security", group: "Operations", title: "Security checklist", summary: "Protect credentials, customer data, recordings, and access.", keywords: "privacy secrets compliance production" },
];

const codeSamples = {
  create: `curl -X POST "https://api.vozon.ai/api/v1/calls/outbound" \\
  -H "Authorization: Bearer avp_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentId": "agent_id",
    "phoneNumber": "+919876543210",
    "metadata": {
      "customerId": "customer_123",
      "source": "crm"
    }
  }'`,
  response: `{
  "call": {
    "id": "call_id",
    "call_status": "completed",
    "direction": "outbound",
    "duration": 92,
    "transcription_text": "Customer: Hello...",
    "usage": {
      "llmTokens": 1240,
      "sttSeconds": 92,
      "ttsCharacters": 680
    },
    "billing": {
      "chargedCredits": 0.0842
    },
    "metadata": {
      "customerId": "customer_123"
    }
  }
}`,
  webhook: `{
  "id": "call.ended:call_id",
  "event": "call.ended",
  "createdAt": "2026-07-30T12:00:00.000Z",
  "data": {
    "id": "call_id",
    "call_status": "completed",
    "direction": "outbound",
    "duration": 92,
    "transcription_text": "Customer: Hello...",
    "billing": { "chargedCredits": 0.0842 }
  }
}`,
};

function CodeBlock({ children, label = "Shell" }: { children: string; label?: string }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard access is unavailable");
      await navigator.clipboard.writeText(children);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    window.setTimeout(() => setCopyState("idle"), 2_000);
  }
  return (
    <div className="docs-code-block my-4 overflow-hidden rounded-2xl border border-[#24334d] bg-[#10182d] shadow-[0_5px_12px_rgba(15,23,42,0.18)]">
      <div className="flex items-center justify-between border-b border-[#24334d] bg-[#10182d] px-4 py-2.5 text-xs text-[#78a3d2]">
        <span className="font-mono text-[11px] font-semibold">{label}</span>
        <button
          className="cursor-pointer font-bold text-[#32dcc8] transition hover:text-[#76f7e7]"
          onClick={() => void copy()}
          type="button"
        >
          {copyState === "copied" ? "✓ Copied" : copyState === "error" ? "Copy unavailable" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-6 text-[#45f4df]">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Callout({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warning" | "success" }) {
  const styles = {
    info: "border-sky-200 bg-sky-50/80 text-sky-900",
    warning: "border-amber-200 bg-amber-50/80 text-amber-900",
    success: "border-emerald-200 bg-emerald-50/80 text-emerald-900",
  };
  const icons = {
    info: "💡",
    warning: "⚠️",
    success: "✓",
  };
  return (
    <div className={`my-4 flex items-start gap-3 rounded-2xl border p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${styles[tone]}`}>
      <span className="text-base select-none mt-0.5">{icons[tone]}</span>
      <div className="min-w-0 font-medium">{children}</div>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-3.5 pb-8 last:pb-0">
      <span className="docs-step-number relative z-10 grid size-10 place-items-center rounded-xl bg-teal-600 text-white font-bold text-sm shadow-xs">
        {number}
      </span>
      <div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <div className="mt-1 text-sm leading-relaxed text-slate-600">{children}</div>
      </div>
      <span className="absolute bottom-0 left-[19px] top-10 w-0.5 bg-slate-200 last:hidden" />
    </div>
  );
}

function AnnotatedAgentVisual() {
  return (
    <figure className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <svg aria-labelledby="agent-visual-title" className="h-auto w-full" role="img" viewBox="0 0 760 390">
        <title id="agent-visual-title">Annotated agent configuration interface</title>
        <defs>
          <marker id="arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#108D82" />
          </marker>
        </defs>
        <rect fill="#f8fafc" height="350" rx="18" stroke="#e2e8f0" strokeWidth="2" width="540" x="15" y="20" />
        <rect fill="#ffffff" height="48" rx="18" stroke="#e2e8f0" strokeWidth="1" width="540" x="15" y="20" />
        <circle cx="42" cy="44" fill="#108D82" r="7" />
        <text fill="#0f172a" fontSize="14" fontWeight="700" x="60" y="49">Customer support agent</text>
        <rect fill="#ffffff" height="68" rx="10" stroke="#e2e8f0" width="220" x="40" y="92" />
        <text fill="#64748b" fontSize="11" fontWeight="700" x="55" y="114">LANGUAGE</text>
        <text fill="#0f172a" fontSize="14" fontWeight="700" x="55" y="141">Hindi + English</text>
        <rect fill="#ffffff" height="68" rx="10" stroke="#e2e8f0" width="220" x="285" y="92" />
        <text fill="#64748b" fontSize="11" fontWeight="700" x="300" y="114">VOICE</text>
        <text fill="#0f172a" fontSize="14" fontWeight="700" x="300" y="141">Natural · Warm</text>
        <rect fill="#ffffff" height="116" rx="10" stroke="#e2e8f0" width="465" x="40" y="180" />
        <text fill="#64748b" fontSize="11" fontWeight="700" x="55" y="203">AGENT INSTRUCTIONS</text>
        <text fill="#334155" fontSize="12" x="55" y="229">Greet the caller, identify their request,</text>
        <text fill="#334155" fontSize="12" x="55" y="250">use approved knowledge, and confirm the</text>
        <text fill="#334155" fontSize="12" x="55" y="271">next action before ending the call.</text>
        <rect fill="#108D82" height="36" rx="8" width="92" x="413" y="316" />
        <text fill="#ffffff" fontSize="12" fontWeight="800" x="443" y="339">Save</text>
        <path d="M680 85 C625 85 603 105 512 120" fill="none" markerEnd="url(#arrow)" stroke="#108D82" strokeWidth="2" />
        <circle cx="696" cy="84" fill="#108D82" r="16" />
        <text fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle" x="696" y="89">1</text>
        <path d="M680 205 C620 205 605 220 510 225" fill="none" markerEnd="url(#arrow)" stroke="#108D82" strokeWidth="2" />
        <circle cx="696" cy="204" fill="#108D82" r="16" />
        <text fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle" x="696" y="209">2</text>
        <path d="M680 325 C615 325 590 333 510 334" fill="none" markerEnd="url(#arrow)" stroke="#108D82" strokeWidth="2" />
        <circle cx="696" cy="324" fill="#108D82" r="16" />
        <text fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle" x="696" y="329">3</text>
      </svg>
      <figcaption className="grid gap-2 border-t border-slate-200 pt-4 text-xs text-slate-600 sm:grid-cols-3">
        <span className="flex items-center gap-2">
          <b className="inline-grid size-5 shrink-0 place-items-center rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">1</b>
          Select language and voice
        </span>
        <span className="flex items-center gap-2">
          <b className="inline-grid size-5 shrink-0 place-items-center rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">2</b>
          Write precise instructions
        </span>
        <span className="flex items-center gap-2">
          <b className="inline-grid size-5 shrink-0 place-items-center rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">3</b>
          Save before testing
        </span>
      </figcaption>
    </figure>
  );
}

function ArchitectureVisual() {
  const nodes = ["Your application", "Vozon API", "Voice agent", "Customer", "Call events"];
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-5 shadow-xs">
      {nodes.map((node, index) => (
        <div className="relative" key={node}>
          <div
            className={`grid min-h-20 place-items-center rounded-xl border p-3 text-center text-xs font-bold transition ${
              index === 1 || index === 2
                ? "border-teal-300 bg-teal-50/80 text-teal-900 shadow-xs"
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            {node}
          </div>
          {index < nodes.length - 1 ? (
            <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-teal-600 font-bold sm:block">
              →
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

const endpointRows = [
  ["GET", "/agents", "List agents available to the organization"],
  ["POST", "/calls/outbound", "Start an outbound call"],
  ["GET", "/calls", "List call records with filters and pagination"],
  ["GET", "/calls/{callId}", "Retrieve one normalized call record"],
  ["GET", "/calls/{callId}/recording", "Download an authorized recording"],
  ["GET", "/calls/export.csv", "Export matching call records"],
] as const;

export function DocsExperience() {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const groups = [...new Set(sections.map((item) => item.group))];
  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    const pageResults = sections.map((item) => ({
      id: `section-${item.id}`,
      href: `#${item.id}`,
      label: "On this page",
      summary: item.summary,
      title: item.title,
      terms: `${item.title} ${item.summary} ${item.keywords}`,
    }));
    const guideResults = docsTopics.map((topic) => ({
      id: `guide-${topic.slug}`,
      href: `/docs/${topic.slug}`,
      label: topic.group,
      summary: topic.description,
      title: topic.title,
      terms: `${topic.title} ${topic.description} ${topic.group}`,
    }));

    return [...pageResults, ...guideResults]
      .filter((item) => item.terms.toLowerCase().includes(normalizedQuery))
      .slice(0, 7);
  }, [query]);

  useEffect(() => {
    let frameId: number | null = null;
    const updateActiveSection = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        const readingLine = 112;
        const current = sections.reduce((selected, item) => {
          const element = document.getElementById(item.id);
          return element && element.getBoundingClientRect().top <= readingLine ? item.id : selected;
        }, "overview");
        setActiveSection((previous) => (previous === current ? previous : current));
        frameId = null;
      });
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="docs-experience min-h-screen bg-[#f8fafc] pt-[76px] text-slate-900 selection:bg-teal-500/20 font-sans">
      {/* Clean Light Developer Portal Header */}
      <header
        className="isolate sticky top-[76px] z-40 h-16 border-b border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,.06)]"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="mx-auto flex h-full max-w-[1720px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-bold text-[#0e6f62]">
                <svg aria-hidden="true" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5.5A2.5 2.5 0 016.5 3H20v15.5A2.5 2.5 0 0017.5 16H4V5.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2.5A2.5 2.5 0 006.5 21H20" />
                </svg>
                Docs &amp; Guides
              </span>
              <span className="hidden md:inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                v1.0.0 Stable
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-1 border-l border-slate-200 pl-4">
              <Link
                href="/docs"
                className="rounded-lg bg-teal-50 border border-teal-200/80 px-3 py-1.5 text-xs font-bold text-[#0e6f62]"
              >
                Guides & Concepts
              </Link>
              <Link
                href="/docs/api"
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                API Reference
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/docs/api"
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50/70 px-3 py-1.5 text-xs font-bold text-teal-900 transition hover:bg-teal-100 shadow-xs"
            >
              <span className="size-2 rounded-full bg-[#108D82] animate-pulse" />
              <span>Open API Sandbox</span>
            </Link>

            <a
              href="/openapi.yaml"
              download="vozon-openapi.yaml"
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[#108D82] hover:text-[#108D82] shadow-xs cursor-pointer"
            >
              <span>↓</span> Download OpenAPI
            </a>

            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-xl bg-[#108D82] hover:bg-[#0e756c] text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition cursor-pointer"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Main 2-Column Clean Light Layout */}
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Navigation Sidebar */}
        <aside className="border-r border-slate-200/90 bg-white p-4 lg:sticky lg:top-[140px] lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:p-5">
          <div className="mb-5">
            <Link
              href="/docs/api"
              className="group flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/70 p-3 text-xs font-bold text-teal-900 transition hover:bg-teal-100 shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#108D82] animate-pulse" />
                <span>API Reference & Sandbox</span>
              </div>
              <span className="text-[#108D82] group-hover:translate-x-0.5 transition font-bold">→</span>
            </Link>
          </div>

          <label className="relative block">
            <span className="sr-only">Search documentation</span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#108D82] focus:ring-2 focus:ring-teal-500/10 transition shadow-xs"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search guides…"
              value={query}
            />
            <svg
              className="absolute left-3 top-2.5 size-3.5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </label>

          {query.trim() ? (
            <div aria-live="polite" className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              {searchResults.length ? (
                <div className="divide-y divide-slate-100">
                  {searchResults.map((item) => (
                    <Link
                      className="block px-3 py-2.5 transition hover:bg-teal-50"
                      href={item.href}
                      key={item.id}
                      onClick={() => {
                        setQuery("");
                        if (item.href.startsWith("#")) setActiveSection(item.href.slice(1));
                      }}
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-[#108D82]">{item.label}</span>
                      <span className="mt-0.5 block text-xs font-bold text-slate-800">{item.title}</span>
                      <span className="mt-0.5 line-clamp-2 block text-[11px] leading-relaxed text-slate-500">{item.summary}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-3 text-xs text-slate-500">No guides or sections match “{query}”.</p>
              )}
            </div>
          ) : null}

          <nav aria-label="Documentation" className="mt-6 grid gap-5">
            {groups.map((group) => {
              const items = sections.filter((item) => item.group === group);
              return (
                <div key={group}>
                  <span className="px-2.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                    {group}
                  </span>
                  <div className="grid gap-1">
                    {items.map((item) => (
                      <a
                        aria-current={activeSection === item.id ? "location" : undefined}
                        className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                          activeSection === item.id
                            ? "bg-teal-50 text-[#0e6f62]"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                        href={`#${item.id}`}
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Documentation Content */}
        <article className="min-w-0 bg-white px-6 py-10 sm:px-10 lg:px-14 lg:py-12 xl:px-16">
          <div className="max-w-4xl">
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-24">
              <span className="inline-flex items-center rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-bold text-[#0e6f62]">
                Vozon Developer Documentation
              </span>
              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                Build voice agents that move work forward.
              </h1>
              <p className="mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-600">
                Create multilingual agents, connect business knowledge and phone numbers, launch calls, and observe every outcome from one unified developer platform and API.
              </p>

              {/* Featured API Explorer Card */}
              <div className="mt-8 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50/90 to-emerald-50/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#108D82] text-white px-2 py-0.5 text-[10px] font-mono font-bold">
                      INTERACTIVE
                    </span>
                    <h3 className="font-bold text-teal-950 text-base">Vozon API Reference & Live Sandbox</h3>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                    Live browser request runner, multi-language code snippets (cURL, Node.js, Python, Go, PHP), parameter trees, and instant HMAC webhook signature testing.
                  </p>
                </div>
                <Link
                  href="/docs/api"
                  className="shrink-0 rounded-xl bg-[#108D82] hover:bg-[#0e756c] text-white px-4 py-2.5 text-xs font-bold transition shadow-xs"
                >
                  Open Interactive API Explorer →
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["01", "Build", "Configure behavior, voice, language, and custom business tools."],
                  ["02", "Deploy", "Connect a phone number or trigger calls dynamically via external API."],
                  ["03", "Improve", "Analyze transcripts, outcomes, latency, and cost telemetry."],
                ].map(([number, title, body]) => (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-xs" key={number}>
                    <span className="text-xs font-black text-[#108D82] font-mono">{number}</span>
                    <h2 className="mt-2 text-sm font-bold text-slate-900">{title}</h2>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <ArchitectureVisual />
              </div>
            </section>

            {/* Quickstart */}
            <section id="quickstart" className="scroll-mt-24 border-t border-slate-200 pt-16 mt-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">Start here</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Quickstart</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">A production-ready voice agent deployment has four straightforward parts.</p>
              <div className="mt-8">
                <Step number={1} title="Create an agent">
                  Open Agents, select New agent, choose a starting template, and give your agent a descriptive name.
                </Step>
                <Step number={2} title="Configure the conversation">
                  Select the caller’s language and natural voice. Add a first greeting message and system prompt instructions describing goals, boundaries, and escalation.
                </Step>
                <Step number={3} title="Test before deployment">
                  Use the browser test call playground. Verify pronunciation, natural interruptions, tool calling, and structured data outputs.
                </Step>
                <Step number={4} title="Connect a phone number">
                  Import or purchase a dedicated phone number, assign the agent, choose inbound/outbound permissions, and place a live test call.
                </Step>
              </div>
              <Callout tone="success">
                Start with one narrow outcome. A focused appointment-booking or lead qualification agent is easier to test and optimize than an agent trying to handle every business workflow at once.
              </Callout>
            </section>

            {/* Agents */}
            <section id="agents" className="scroll-mt-24 border-t border-slate-200 pt-16 mt-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">Build</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Configure an agent</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                Agent configuration controls what the agent says, how it sounds, which knowledge it retrieves, and which custom API actions it can take.
              </p>
              <div className="mt-7">
                <AnnotatedAgentVisual />
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  ["First message", "Set context immediately. Identify the business and explain clearly why the agent is calling."],
                  ["Instructions", "Write goals in priority order. Include explicit rules for confirmation, transfer, and graceful call wrap-up."],
                  ["Language and voice", "Match the voice model to the selected language. Test names, numbers, dates, and mixed-language phrases."],
                  ["Tools", "Give each action a clear description, required schema inputs, success response, and failure fallback."],
                ].map(([title, body]) => (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-xs" key={title}>
                    <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Knowledge Bases */}
            <section id="knowledge" className="scroll-mt-24 border-t border-slate-200 pt-16 mt-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">Build</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Knowledge bases</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                Attach approved text, PDF/DOCX files, or public website URLs to an agent. Keep each source current, specific, and free of unnecessary sensitive credentials.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <b className="text-slate-900 block text-sm font-bold">1. Add a source</b>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">Choose raw text, public website URL crawling, or file upload.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <b className="text-slate-900 block text-sm font-bold">2. Indexing & Vectorization</b>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">The source automatically parses and indexes until status shows Ready.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <b className="text-slate-900 block text-sm font-bold">3. Grounded Retrieval</b>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">Agents retrieve approved snippets during conversations. Test responses and define a fallback for missing or outdated information.</p>
                </div>
              </div>
            </section>

            {/* Phone Numbers */}
            <section id="phone-numbers" className="scroll-mt-24 border-t border-slate-200 pt-16 mt-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">Deploy</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Phone numbers</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                A number must be Ready, assigned to an agent, and configured for the intended direction before placing or receiving live telephony calls.
              </p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
                <div className="grid grid-cols-3 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-600 border-b border-slate-200">
                  <span>Direction</span>
                  <span>Accepts inbound</span>
                  <span>Places outbound</span>
                </div>
                {[
                  ["Inbound", "Yes", "No"],
                  ["Outbound", "No", "Yes"],
                  ["Both", "Yes", "Yes"],
                ].map((row) => (
                  <div className="grid grid-cols-3 border-b border-slate-100 last:border-0 px-5 py-3.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-50/50" key={row[0]}>
                    <span className="font-bold text-slate-900">{row[0]}</span>
                    <span>{row[1]}</span>
                    <span>{row[2]}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Campaigns */}
            <section id="campaigns" className="scroll-mt-24 border-t border-slate-200 pt-16 mt-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">Deploy</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Campaigns</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                Campaigns coordinate outbound calling across approved contact lists with controlled pacing, retry rules, suppression handling, automatic callbacks, and evidence based results.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {["1. Select route", "2. Upload contacts", "3. Set pacing", "4. Set safeguards", "5. Launch & monitor"].map((label) => (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs font-bold text-slate-800 shadow-xs" key={label}>
                    {label}
                  </div>
                ))}
              </div>
              <Callout tone="warning">
                Pausing stops new outbound calls from being dispatched. It does not interrupt phone calls currently in progress.
              </Callout>
              <Link
                className="mt-5 inline-flex items-center rounded-xl bg-[#108D82] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#0e756c]"
                href="/docs/campaigns"
              >
                Open the complete campaign operations guide →
              </Link>
            </section>

            {/* Call Logs & Observability */}
            <section id="call-logs" className="scroll-mt-24 border-t border-slate-200 pt-16 mt-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">Observe</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Call logs & analytics</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                Review complete operational records for status, duration, full transcripts, audio recordings, structured schema outputs, turn latency, and credit billing.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ["Conversation", "Full turns, stereo recordings, speech-to-text accuracy, sentiment."],
                  ["Performance", "Turn-by-turn latency (ms), speech recognition delay, completion state."],
                  ["Business Results", "Custom schema extraction, sentiment, appointment booked, CRM sync status."],
                ].map(([title, body]) => (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-xs" key={title}>
                    <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Billing */}
            <section id="billing" className="scroll-mt-24 border-t border-slate-200 pt-16 mt-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">Observe</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Billing & wallet credits</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                Completed call costs are deducted seamlessly from your organization wallet. Real-time billing calculates exact audio duration and AI tokens used.
              </p>
              <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50/70 p-5 shadow-xs">
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                  <span className="rounded-xl bg-white border border-slate-200 px-3.5 py-2 shadow-xs">Metered Telephony & AI</span>
                  <span className="text-teal-700 font-bold">+</span>
                  <span className="rounded-xl bg-white border border-slate-200 px-3.5 py-2 shadow-xs">Platform Fee</span>
                  <span className="text-teal-700 font-bold">=</span>
                  <span className="rounded-xl bg-[#108D82] px-3.5 py-2 text-white shadow-xs">Transparent Total</span>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="scroll-mt-24 border-t border-slate-200 pt-16 mt-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">API Reference</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Authentication</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                Generate an API key in Dashboard → Developers. Provide it as a Bearer token in the Authorization header on every request.
              </p>
              <div className="mt-4">
                <CodeBlock>{`Authorization: Bearer avp_your_production_api_key`}</CodeBlock>
              </div>
              <Callout tone="warning">
                API keys are sensitive credentials. Store them in environment variables or a secrets manager. Never commit them to client-side code.
              </Callout>
            </section>

            {/* Calls API Overview */}
            <section id="api-calls" className="scroll-mt-24 border-t border-slate-200 pt-16 mt-16">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">API Reference</span>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">Calls API</h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    Base URL: <code className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 font-mono text-[#0e6f62] font-bold">https://api.vozon.ai/api/v1</code>
                  </p>
                </div>
                <Link
                  href="/docs/api"
                  className="rounded-xl bg-[#108D82] hover:bg-[#0e756c] text-white px-4 py-2 text-xs font-bold shadow-xs transition"
                >
                  Open Interactive Playground →
                </Link>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
                {endpointRows.map(([method, path, description]) => (
                  <div
                    className="grid gap-2 border-b border-slate-100 p-4 last:border-0 sm:grid-cols-[70px_240px_minmax(0,1fr)] sm:items-center hover:bg-slate-50/50 transition"
                    key={path}
                  >
                    <span
                      className={`w-fit rounded px-2 py-0.5 text-[10px] font-mono font-black uppercase ${
                        method === "POST"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}
                    >
                      {method}
                    </span>
                    <code className="text-xs sm:text-sm font-bold text-slate-900 font-mono">{path}</code>
                    <span className="text-xs sm:text-sm text-slate-600">{description}</span>
                  </div>
                ))}
              </div>

              <h3 className="mt-8 text-base font-bold text-slate-900">Dispatch an outbound AI phone call</h3>
              <CodeBlock>{codeSamples.create}</CodeBlock>

              <h3 className="mt-8 text-base font-bold text-slate-900">Normalized call response</h3>
              <CodeBlock label="JSON">{codeSamples.response}</CodeBlock>
            </section>

            {/* Webhooks */}
            <section id="webhooks" className="scroll-mt-24 border-t border-slate-200 pt-16 mt-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">Integration</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Webhooks</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                Register an HTTPS webhook in the Developer portal to receive real-time events for <code>call.started</code>, <code>call.ended</code>, and <code>transcript.ready</code>.
              </p>
              <CodeBlock label="JSON">{codeSamples.webhook}</CodeBlock>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["Verify HMAC", "Compute HMAC SHA-256 using your endpoint secret and compare with the signature header."],
                  ["Fast 200 Acknowledge", "Return an HTTP 200 response immediately before performing asynchronous database work."],
                  ["Idempotency", "Store the event ID and safely ignore repeated deliveries."],
                ].map(([title, body]) => (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-xs" key={title}>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{title}</h3>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Errors */}
            <section id="errors" className="scroll-mt-24 border-t border-slate-200 pt-16 mt-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">Reference</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Status codes & errors</h2>
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
                {[
                  ["400", "Invalid request", "Correct missing payload fields or formatting; do not retry unchanged."],
                  ["401", "Authentication required", "Check the API key in the Bearer Authorization header."],
                  ["403", "Insufficient permission", "Key lacks the required scope (e.g. calls:write) or role."],
                  ["404", "Resource not found", "Confirm the ID belongs to your active organization."],
                  ["409", "Resource conflict", "Refresh state and resolve the conflict before retrying."],
                  ["429", "Rate limited", "Too many requests. Retry with exponential backoff and jitter."],
                  ["5xx", "Temporary service error", "Retry idempotent operations with bounded backoff."],
                ].map((row) => (
                  <div className="grid gap-2 border-b border-slate-100 p-4 last:border-0 sm:grid-cols-[60px_180px_1fr] hover:bg-slate-50/50 transition" key={row[0]}>
                    <code className="text-xs font-mono font-bold text-[#108D82]">{row[0]}</code>
                    <b className="text-xs sm:text-sm font-bold text-slate-900">{row[1]}</b>
                    <span className="text-xs sm:text-sm text-slate-600">{row[2]}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Production Security Checklist */}
            <section id="security" className="scroll-mt-24 border-t border-slate-200 pt-16 mt-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">Operations</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Production security checklist</h2>
              <div className="mt-6 grid gap-3">
                {[
                  "Keep API credentials in a secure secrets manager and rotate them periodically.",
                  "Use least-privilege API scopes and separate keys by development and production environments.",
                  "Enforce 2FA and role-based access control across team members in your organization.",
                  "Collect only caller data strictly necessary for the designated agent task.",
                  "Verify incoming webhook HMAC SHA-256 signatures to prevent unauthorized event spoofing.",
                  "Respect local telecommunications regulations, calling hour restrictions, and suppression lists.",
                ].map((item) => (
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs sm:text-sm text-slate-700 shadow-xs" key={item}>
                    <span className="text-[#108D82] font-bold text-base select-none">✓</span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* All Guides */}
            <section className="mt-16 scroll-mt-24 border-t border-slate-200 pt-16" id="all-guides">
              <span className="text-xs font-bold uppercase tracking-wider text-[#108D82]">Documentation library</span>
              <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Explore every guide</h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600">Detailed workflows, field schemas, code samples, and best practices.</p>
                </div>
                <a
                  className="text-xs sm:text-sm font-bold text-[#108D82] hover:underline"
                  href="/openapi.yaml"
                  download="vozon-openapi.yaml"
                >
                  Download OpenAPI spec →
                </a>
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {docsTopics.map((topic) => (
                  <Link
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-teal-300 hover:shadow-sm"
                    href={`/docs/${topic.slug}`}
                    key={topic.slug}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#108D82]">
                      {topic.group}
                    </span>
                    <h3 className="mt-1.5 font-bold text-slate-900 group-hover:text-[#108D82] transition text-base">
                      {topic.title} <span aria-hidden="true">→</span>
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{topic.description}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Clean Light Footer */}
            <footer className="mt-12 border-t border-slate-200 py-8 text-xs sm:text-sm text-slate-500">
              <p>
                Need help with an enterprise production rollout?{" "}
                <Link className="font-bold text-[#108D82] hover:underline" href="/contact">
                  Contact the Vozon engineering team
                </Link>
                .
              </p>
              <p className="mt-2">
                Sample code uses fictional identifiers and test numbers. Always use your designated API keys in production.
              </p>
            </footer>
          </div>
        </article>
      </div>
    </div>
  );
}
