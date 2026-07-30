"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { BrandLogo } from "@/components/ui/BrandLogo";
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
  { id: "campaigns", group: "Deploy", title: "Campaigns", summary: "Upload leads and control high-volume outbound calling.", keywords: "csv leads pause resume suppression" },
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
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#07110f] shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-xs text-white/45">
        <span>{label}</span>
        <button className="font-semibold text-[#75fff0] hover:text-white" onClick={() => void copy()} type="button">{copied ? "Copied" : "Copy"}</button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-6 text-[#c7f9f2]"><code>{children}</code></pre>
    </div>
  );
}

function Callout({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warning" | "success" }) {
  const styles = {
    info: "border-cyan-300/25 bg-cyan-300/[0.07] text-cyan-50",
    warning: "border-amber-300/25 bg-amber-300/[0.07] text-amber-50",
    success: "border-emerald-300/25 bg-emerald-300/[0.07] text-emerald-50",
  };
  return <div className={`rounded-xl border px-4 py-3 text-sm leading-6 ${styles[tone]}`}>{children}</div>;
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="relative grid grid-cols-[36px_minmax(0,1fr)] gap-3 pb-7 last:pb-0">
      <span className="relative z-10 grid size-9 place-items-center rounded-full bg-[#45ddce] text-sm font-black text-[#02110d]">{number}</span>
      <div><h3 className="text-base font-semibold text-white">{title}</h3><div className="mt-1 text-sm leading-6 text-white/58">{children}</div></div>
      <span className="absolute bottom-0 left-[17px] top-9 w-px bg-gradient-to-b from-[#45ddce]/50 to-transparent last:hidden" />
    </div>
  );
}

function AnnotatedAgentVisual() {
  return (
    <figure className="rounded-2xl border border-white/10 bg-[#07110f] p-4">
      <svg aria-labelledby="agent-visual-title" className="h-auto w-full" role="img" viewBox="0 0 760 390">
        <title id="agent-visual-title">Annotated agent configuration interface</title>
        <defs><marker id="arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0 8 4 0 8Z" fill="#45ddce" /></marker></defs>
        <rect fill="#020907" height="350" rx="18" width="540" x="15" y="20" />
        <rect fill="#0b1916" height="48" rx="18" width="540" x="15" y="20" />
        <circle cx="42" cy="44" fill="#45ddce" r="7" /><text fill="#fff" fontSize="14" fontWeight="700" x="60" y="49">Customer support agent</text>
        <rect fill="#10231f" height="68" rx="10" width="220" x="40" y="92" /><text fill="#8ba29e" fontSize="11" x="55" y="114">LANGUAGE</text><text fill="#fff" fontSize="14" fontWeight="700" x="55" y="141">Hindi + English</text>
        <rect fill="#10231f" height="68" rx="10" width="220" x="285" y="92" /><text fill="#8ba29e" fontSize="11" x="300" y="114">VOICE</text><text fill="#fff" fontSize="14" fontWeight="700" x="300" y="141">Natural · Warm</text>
        <rect fill="#10231f" height="116" rx="10" width="465" x="40" y="180" /><text fill="#8ba29e" fontSize="11" x="55" y="203">AGENT INSTRUCTIONS</text><text fill="#dbe8e5" fontSize="12" x="55" y="229">Greet the caller, identify their request,</text><text fill="#dbe8e5" fontSize="12" x="55" y="250">use approved knowledge, and confirm the</text><text fill="#dbe8e5" fontSize="12" x="55" y="271">next action before ending the call.</text>
        <rect fill="#45ddce" height="36" rx="8" width="92" x="413" y="316" /><text fill="#02110d" fontSize="12" fontWeight="800" x="441" y="339">Save</text>
        <path d="M680 85 C625 85 603 105 512 120" fill="none" markerEnd="url(#arrow)" stroke="#45ddce" strokeWidth="2" /><circle cx="696" cy="84" fill="#45ddce" r="17" /><text fill="#02110d" fontSize="13" fontWeight="900" textAnchor="middle" x="696" y="89">1</text>
        <path d="M680 205 C620 205 605 220 510 225" fill="none" markerEnd="url(#arrow)" stroke="#45ddce" strokeWidth="2" /><circle cx="696" cy="204" fill="#45ddce" r="17" /><text fill="#02110d" fontSize="13" fontWeight="900" textAnchor="middle" x="696" y="209">2</text>
        <path d="M680 325 C615 325 590 333 510 334" fill="none" markerEnd="url(#arrow)" stroke="#45ddce" strokeWidth="2" /><circle cx="696" cy="324" fill="#45ddce" r="17" /><text fill="#02110d" fontSize="13" fontWeight="900" textAnchor="middle" x="696" y="329">3</text>
      </svg>
      <figcaption className="grid gap-2 border-t border-white/10 pt-4 text-xs text-white/55 sm:grid-cols-3"><span><b className="text-[#75fff0]">1.</b> Select language and voice</span><span><b className="text-[#75fff0]">2.</b> Write precise instructions</span><span><b className="text-[#75fff0]">3.</b> Save before testing</span></figcaption>
    </figure>
  );
}

function ArchitectureVisual() {
  const nodes = ["Your application", "Vozon API", "Voice agent", "Customer", "Call events"];
  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#07110f] p-5 sm:grid-cols-5">
      {nodes.map((node, index) => <div className="relative" key={node}><div className={`grid min-h-20 place-items-center rounded-xl border p-3 text-center text-xs font-bold ${index === 1 || index === 2 ? "border-[#45ddce]/40 bg-[#45ddce]/10 text-[#9ff8ee]" : "border-white/10 bg-white/[0.035] text-white/65"}`}>{node}</div>{index < nodes.length - 1 ? <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-[#45ddce] sm:block">→</span> : null}</div>)}
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
  const filtered = useMemo(() => sections.filter((item) => `${item.title} ${item.summary} ${item.keywords}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const groups = [...new Set(sections.map((item) => item.group))];

  return (
    <main className="min-h-screen bg-[#020706] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020706]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-5 px-4 lg:px-7">
          <BrandLogo showWebsiteLogo />
          <span className="hidden h-6 w-px bg-white/15 sm:block" /><span className="hidden text-sm font-semibold text-white/55 sm:block">Documentation</span>
          <div className="ml-auto flex items-center gap-2"><Link className="rounded-lg px-3 py-2 text-sm font-semibold text-white/60 hover:text-white" href="/dashboard/developers">Developer portal</Link><Link className="rounded-lg bg-[#45ddce] px-3 py-2 text-sm font-bold text-[#02110d]" href="/login">Sign in</Link></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-r border-white/10 p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:overflow-y-auto lg:p-6">
          <label className="relative block"><span className="sr-only">Search documentation</span><input className="w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2.5 text-sm outline-none placeholder:text-white/30 focus:border-[#45ddce]/50" onChange={(event) => setQuery(event.target.value)} placeholder="Search docs…" value={query} /></label>
          <nav aria-label="Documentation" className="mt-5 grid gap-5">
            {groups.map((group) => {
              const items = filtered.filter((item) => item.group === group);
              return items.length ? <div key={group}><span className="px-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">{group}</span><div className="mt-2 grid gap-0.5">{items.map((item) => <a className="rounded-lg px-2 py-2 text-sm text-white/58 hover:bg-white/[0.06] hover:text-[#9ff8ee]" href={`#${item.id}`} key={item.id}>{item.title}</a>)}</div></div> : null;
            })}
            {!filtered.length ? <p className="px-2 text-sm text-white/40">No documentation matches “{query}”.</p> : null}
          </nav>
        </aside>

        <article className="min-w-0 px-5 py-12 sm:px-8 lg:px-14 lg:py-16 xl:px-20">
          <div className="max-w-4xl">
            <section id="overview" className="scroll-mt-24">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#45ddce]">Vozon documentation</span>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Build voice agents that move work forward.</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/58">Create multilingual agents, connect business knowledge and phone numbers, launch calls, and observe every outcome from one platform or API.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">{[["01", "Build", "Configure behavior, voice, language, and tools."], ["02", "Deploy", "Connect a number or start calls through the API."], ["03", "Improve", "Use transcripts, outcomes, and cost data to iterate."]].map(([number, title, body]) => <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4" key={number}><span className="text-xs font-black text-[#45ddce]">{number}</span><h2 className="mt-3 font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-white/45">{body}</p></div>)}</div>
              <div className="mt-8"><ArchitectureVisual /></div>
            </section>

            <section id="quickstart" className="scroll-mt-24 border-t border-white/10 pt-16 mt-16">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#45ddce]">Start here</p><h2 className="mt-3 text-3xl font-semibold">Quickstart</h2><p className="mt-3 text-white/55">A production-ready first call has four parts.</p>
              <div className="mt-8"><Step number={1} title="Create an agent">Open Agents, select New agent, choose a starting template, and give the agent a clear name.</Step><Step number={2} title="Configure the conversation">Select the caller’s language and voice. Add a first message and instructions describing goals, boundaries, escalation, and completion criteria.</Step><Step number={3} title="Test before deployment">Use the browser test call. Verify pronunciation, interruptions, tool behavior, and the final outcome with realistic conversations.</Step><Step number={4} title="Connect a phone number">Import or purchase a number, assign the agent, choose the permitted direction, and place a controlled live call.</Step></div>
              <Callout tone="success">Start with one narrow outcome. A focused appointment-booking or qualification agent is easier to test and improve than a single agent responsible for every business process.</Callout>
            </section>

            <section id="agents" className="scroll-mt-24 border-t border-white/10 pt-16 mt-16">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#45ddce]">Build</p><h2 className="mt-3 text-3xl font-semibold">Configure an agent</h2><p className="mt-3 leading-7 text-white/55">Agent configuration controls what the agent says, how it sounds, which information it can use, and which actions it can take.</p>
              <div className="mt-7"><AnnotatedAgentVisual /></div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">{[["First message", "Set context immediately. Identify the business and explain why the agent is calling."], ["Instructions", "Write goals in priority order. Include explicit rules for confirmation, transfer, and ending."], ["Language and voice", "Match the voice and script to the selected language. Test names, numbers, dates, and mixed-language phrases."], ["Tools", "Give each action a clear trigger, required inputs, success response, and failure fallback."]].map(([title, body]) => <div className="rounded-xl border border-white/10 p-4" key={title}><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/50">{body}</p></div>)}</div>
            </section>

            <section id="knowledge" className="scroll-mt-24 border-t border-white/10 pt-16 mt-16"><h2 className="text-3xl font-semibold">Knowledge bases</h2><p className="mt-3 leading-7 text-white/55">Attach approved text, files, or public pages to an agent. Keep each source current, specific, and free of credentials or unnecessary personal information.</p><ol className="mt-6 grid gap-3 text-sm text-white/58"><li className="rounded-xl border border-white/10 p-4"><b className="text-white">1. Add a source.</b> Choose text, URL, or file upload.</li><li className="rounded-xl border border-white/10 p-4"><b className="text-white">2. Wait for indexing.</b> The source must show Ready before calls use it.</li><li className="rounded-xl border border-white/10 p-4"><b className="text-white">3. Test retrieval.</b> Search for representative customer questions and verify the returned passages.</li></ol></section>

            <section id="phone-numbers" className="scroll-mt-24 border-t border-white/10 pt-16 mt-16"><h2 className="text-3xl font-semibold">Phone numbers</h2><p className="mt-3 leading-7 text-white/55">A number must be Ready, assigned to an agent, and enabled for the intended direction before it can accept or place calls.</p><div className="mt-6 overflow-hidden rounded-xl border border-white/10"><div className="grid grid-cols-3 bg-white/[0.05] px-4 py-3 text-xs font-bold text-white/45"><span>Direction</span><span>Accepts inbound</span><span>Places outbound</span></div>{[["Inbound", "Yes", "No"], ["Outbound", "No", "Yes"], ["Both", "Yes", "Yes"]].map((row) => <div className="grid grid-cols-3 border-t border-white/10 px-4 py-3 text-sm text-white/60" key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}</div></section>

            <section id="campaigns" className="scroll-mt-24 border-t border-white/10 pt-16 mt-16"><h2 className="text-3xl font-semibold">Campaigns</h2><p className="mt-3 leading-7 text-white/55">Campaigns coordinate outbound calls across a lead list. Validate consent, calling hours, number formatting, and suppression rules before launch.</p><div className="mt-6 grid gap-3 sm:grid-cols-4">{["Create campaign", "Upload leads", "Review & launch", "Monitor outcomes"].map((label, index) => <div className="rounded-xl border border-white/10 p-4 text-sm font-semibold" key={label}><span className="mr-2 text-[#45ddce]">{index + 1} →</span>{label}</div>)}</div><Callout tone="warning">Pause stops new calls from starting. It does not interrupt a call already in progress. Cancel only when the campaign should not resume.</Callout></section>

            <section id="call-logs" className="scroll-mt-24 border-t border-white/10 pt-16 mt-16"><h2 className="text-3xl font-semibold">Call logs</h2><p className="mt-3 leading-7 text-white/55">Use call logs as the operational record for status, duration, transcript, recording, structured output, latency, usage, and customer charges.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{[["Conversation", "Transcript, recording, direction, participants"], ["Performance", "End-to-end latency, duration, completion state"], ["Business result", "Extracted data, disposition, campaign and metadata"]].map(([title, body]) => <div className="rounded-xl border border-white/10 p-4" key={title}><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/48">{body}</p></div>)}</div></section>

            <section id="billing" className="scroll-mt-24 border-t border-white/10 pt-16 mt-16"><h2 className="text-3xl font-semibold">Billing</h2><p className="mt-3 leading-7 text-white/55">Completed-call charges are deducted from the organization wallet. The customer total combines metered call usage with the Vozon platform fee. Billing displays the wallet balance, monthly charges, payments, and downloadable invoices.</p><div className="mt-6 rounded-2xl border border-[#45ddce]/25 bg-[#45ddce]/[0.06] p-5"><div className="flex flex-wrap items-center gap-3 text-sm font-bold"><span className="rounded-lg bg-white/10 px-3 py-2">Metered call usage</span><span className="text-[#45ddce]">+</span><span className="rounded-lg bg-white/10 px-3 py-2">Vozon platform fee</span><span className="text-[#45ddce]">=</span><span className="rounded-lg bg-[#45ddce] px-3 py-2 text-[#02110d]">Customer total</span></div></div></section>

            <section id="authentication" className="scroll-mt-24 border-t border-white/10 pt-16 mt-16"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#45ddce]">API reference</p><h2 className="mt-3 text-3xl font-semibold">Authentication</h2><p className="mt-3 leading-7 text-white/55">Create an API key in Dashboard → Developers. Send it as a Bearer token on every API request.</p><div className="mt-6"><CodeBlock>{`Authorization: Bearer avp_your_api_key`}</CodeBlock></div><Callout tone="warning">API keys are secrets. Show a key only once, store it in a secrets manager, restrict its scopes, and revoke it immediately if exposed. Never put a key in browser code or public documentation.</Callout></section>

            <section id="api-calls" className="scroll-mt-24 border-t border-white/10 pt-16 mt-16"><h2 className="text-3xl font-semibold">Calls API</h2><p className="mt-3 text-white/55">Base URL: <code className="rounded bg-white/10 px-2 py-1 text-[#9ff8ee]">https://api.vozon.ai/api/v1</code></p><div className="mt-6 overflow-hidden rounded-xl border border-white/10">{endpointRows.map(([method, path, description]) => <div className="grid gap-2 border-b border-white/10 p-4 last:border-0 sm:grid-cols-[64px_260px_minmax(0,1fr)] sm:items-center" key={path}><span className={`w-fit rounded px-2 py-1 text-[10px] font-black ${method === "POST" ? "bg-violet-400/15 text-violet-200" : "bg-emerald-400/15 text-emerald-200"}`}>{method}</span><code className="text-sm text-white">{path}</code><span className="text-sm text-white/45">{description}</span></div>)}</div><h3 className="mt-8 text-lg font-semibold">Create an outbound call</h3><div className="mt-3"><CodeBlock>{codeSamples.create}</CodeBlock></div><h3 className="mt-8 text-lg font-semibold">Normalized call response</h3><div className="mt-3"><CodeBlock label="JSON">{codeSamples.response}</CodeBlock></div></section>

            <section id="webhooks" className="scroll-mt-24 border-t border-white/10 pt-16 mt-16"><h2 className="text-3xl font-semibold">Webhooks</h2><p className="mt-3 leading-7 text-white/55">Register an HTTPS endpoint in the Developer portal and subscribe to <code>call.started</code>, <code>call.ended</code>, <code>call.failed</code>, or <code>transcript.ready</code>.</p><div className="mt-6"><CodeBlock label="JSON">{codeSamples.webhook}</CodeBlock></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["Verify", "Validate the request signature using the endpoint secret."], ["Acknowledge", "Return a 2xx response quickly before doing slow work."], ["Deduplicate", "Store the event id and safely ignore repeated deliveries."]].map(([title, body]) => <div className="rounded-xl border border-white/10 p-4" key={title}><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/48">{body}</p></div>)}</div></section>

            <section id="errors" className="scroll-mt-24 border-t border-white/10 pt-16 mt-16"><h2 className="text-3xl font-semibold">Errors</h2><div className="mt-6 overflow-hidden rounded-xl border border-white/10">{[["400", "Invalid request", "Correct fields or formatting; do not retry unchanged."], ["401", "Authentication required", "Check the API key and Authorization header."], ["403", "Insufficient permission", "Use a key with the required scope and organization role."], ["404", "Resource not found", "Confirm the id belongs to the active organization."], ["409", "Resource conflict", "Refresh state, resolve the conflict, then retry."], ["429", "Rate limited", "Retry with exponential backoff and jitter."], ["5xx", "Temporary service error", "Retry idempotent operations with bounded backoff."]].map((row) => <div className="grid gap-2 border-b border-white/10 p-4 last:border-0 sm:grid-cols-[60px_180px_1fr]" key={row[0]}><code className="text-[#9ff8ee]">{row[0]}</code><b className="text-sm">{row[1]}</b><span className="text-sm text-white/48">{row[2]}</span></div>)}</div></section>

            <section id="security" className="scroll-mt-24 border-t border-white/10 pt-16 mt-16"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#45ddce]">Operations</p><h2 className="mt-3 text-3xl font-semibold">Production security checklist</h2><div className="mt-6 grid gap-3">{["Keep credentials in a secrets manager and rotate them on a defined schedule.", "Use least-privilege API scopes and separate keys by environment.", "Restrict dashboard roles and remove members who no longer need access.", "Collect only the customer data required for the stated call purpose.", "Define retention and access rules for transcripts, recordings, and exports.", "Verify webhook signatures and reject stale or replayed deliveries.", "Test consent, disclosure, calling hours, suppression, and escalation requirements for every market."].map((item) => <div className="flex gap-3 rounded-xl border border-white/10 p-4 text-sm text-white/58" key={item}><span className="text-[#45ddce]">✓</span><span>{item}</span></div>)}</div></section>

            <section className="mt-16 scroll-mt-24 border-t border-white/10 pt-16" id="all-guides">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#45ddce]">Documentation library</p>
              <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-3xl font-semibold">Explore every guide</h2><p className="mt-2 text-white/50">Detailed workflows, field references, code samples, and production checklists.</p></div><a className="text-sm font-semibold text-[#75fff0]" href="/openapi.yaml">Download OpenAPI →</a></div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {docsTopics.map((topic) => <Link className="group rounded-xl border border-white/10 p-4 transition hover:border-[#45ddce]/35 hover:bg-[#45ddce]/[0.05]" href={`/docs/${topic.slug}`} key={topic.slug}><span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#45ddce]">{topic.group}</span><h3 className="mt-2 font-semibold group-hover:text-[#9ff8ee]">{topic.title} <span aria-hidden="true">→</span></h3><p className="mt-2 text-sm leading-6 text-white/45">{topic.description}</p></Link>)}
              </div>
            </section>

            <footer className="mt-20 border-t border-white/10 py-10 text-sm text-white/40"><p>Need help with a production rollout? <Link className="font-semibold text-[#75fff0]" href="/contact">Contact the Vozon team</Link>.</p><p className="mt-2">Examples use fictional identifiers and phone numbers. Never paste real credentials into sample code.</p></footer>
          </div>
        </article>
      </div>
    </main>
  );
}
