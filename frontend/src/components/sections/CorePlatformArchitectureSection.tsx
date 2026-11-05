"use client";

import { useState } from "react";

type ArchitectureLayer = "all" | "perception" | "cognitive" | "execution";

interface LayerData {
  id: "perception" | "cognitive" | "execution";
  layerNumber: string;
  name: string;
  tagline: string;
  badge: string;
  accentColor: string;
  badgeStyle: string;
  bgGlow: string;
  points: {
    title: string;
    details: string;
    meta: string;
  }[];
  telemetry: {
    protocol: string;
    latency: string;
    status: string;
    metrics: { label: string; value: string; pass: boolean }[];
    codeSnippet: string;
  };
}

const architectureLayers: LayerData[] = [
  {
    id: "perception",
    layerNumber: "LAYER 01",
    name: "The Perception Layer",
    tagline: "Acoustic & Sensory Intelligence",
    badge: "<120ms Barge-In • Full-Duplex",
    accentColor: "text-[#0284c7]",
    badgeStyle: "bg-sky-50 text-sky-800 border-sky-200",
    bgGlow: "rgba(2, 132, 199, 0.05)",
    points: [
      {
        title: "Real-Time Full-Duplex WebSockets with LiveKit audio pipelines",
        details:
          "Ultra-low overhead bi-directional streaming of raw 24kHz PCM audio frames. Eliminates buffer bloat and packet jitter so agent and human can converse naturally without turn-taking delays.",
        meta: "LiveKit RTC Engine • 24kHz HD Audio",
      },
      {
        title: "Voice Activity Detection (VAD) tuned to filter out background office noise, speaker echo, and coughs",
        details:
          "Deep acoustic neural classification isolates genuine human speech phonemes from keyboard clatter, coffee shop chatter, HVAC hum, acoustic feedback, and accidental vocal ticks.",
        meta: "Neural Acoustic Classifier • -48dB SNR",
      },
      {
        title: "Instant barge-in: Stops generating audio in <120ms when the user speaks",
        details:
          "Sub-120ms acoustic reflex loop instantly terminates downstream TTS packet transmission the moment caller speech onset is detected. Zero clumsy talking over callers.",
        meta: "Acoustic Reflex < 120ms • Zero Audio Overlap",
      },
    ],
    telemetry: {
      protocol: "WSS // RFC 6455 + LiveKit WebRTC Audio Track",
      latency: "82ms",
      status: "FULL_DUPLEX_STREAMING",
      metrics: [
        { label: "Barge-in Cutoff", value: "98ms (<120ms target)", pass: true },
        { label: "VAD Speech Confidence", value: "99.4%", pass: true },
        { label: "Acoustic Echo Suppression", value: "-46 dB", pass: true },
        { label: "Packet Loss Concealment", value: "Opus 24kHz Active", pass: true },
      ],
      codeSnippet: `// Perception Pipeline: LiveKit Audio Frame Ingestion
const audioStream = new LiveKit.AudioReceiver({
  sampleRate: 24000,
  channels: 1,
  vadSensitivity: 0.85,
  bargeInCutoffMs: 110,
  noiseSuppression: "deep_acoustic_rnn",
  onSpeechDetected: (chunk) => {
    orchestrator.interruptTTS(); // <120ms hard stop
    pipeline.routeToCognitiveLayer(chunk);
  }
});`,
    },
  },
  {
    id: "cognitive",
    layerNumber: "LAYER 02",
    name: "The Cognitive Layer",
    tagline: "Autonomous Planning & Reasoning",
    badge: "Multi-LLM ReAct • Strict Schema",
    accentColor: "text-cobalt",
    badgeStyle: "bg-blue-50 text-blue-900 border-blue-200",
    bgGlow: "rgba(37, 99, 235, 0.05)",
    points: [
      {
        title: "Low-latency LLM orchestration (Gemini 2.0 Flash, GPT-4o, Claude 3.5 Sonnet, Sarvam Indic)",
        details:
          "Dynamic model routing engine selects the optimal reasoning model based on query intent, language nuances, and latency budgets—balancing sub-300ms reflex responses with complex multi-turn logic.",
        meta: "Dynamic Model Router • Sub-300ms TTFT",
      },
      {
        title: "Multi-step function calling with strict schema enforcement",
        details:
          "Deterministic ReAct planning cycle inspects and validates API payloads against strict Pydantic/JSON schemas before execution, eliminating malformed tool calls and broken transactions.",
        meta: "Pydantic Schema Validation • Zero Tool Failures",
      },
      {
        title: "Guardrails to prevent hallucinations, policy violations, or prompt injections",
        details:
          "Real-time semantic safety gateway verifies prompt boundaries, checks regulatory compliance thresholds (RBI, HIPAA, TRAI), and prevents adversarial jailbreaks mid-dialogue.",
        meta: "Real-time Semantic Firewall • Policy Compliant",
      },
    ],
    telemetry: {
      protocol: "ReAct Multi-Agent Dynamic Planner",
      latency: "240ms",
      status: "SCHEMA_VALIDATED",
      metrics: [
        { label: "Active Model", value: "Gemini 2.0 Flash / Sarvam", pass: true },
        { label: "TTFT (First Token)", value: "215ms", pass: true },
        { label: "Schema Enforcement", value: "Strict Pydantic JSON", pass: true },
        { label: "Adversarial Guardrail", value: "Pass (0 Violations)", pass: true },
      ],
      codeSnippet: `// Cognitive Planner: Dynamic ReAct Orchestration
const cognitiveAgent = new AgenticReasoningCore({
  models: ["gemini-2.0-flash", "gpt-4o", "sarvam-indic-2b"],
  schemaValidation: "STRICT_PYDANTIC_V2",
  guardrails: {
    preventHallucination: true,
    policyComplianceCheck: ["RBI_LENDING", "TRAI_CALL_RULES"],
    injectionFilter: "heuristic_plus_embedding"
  },
  maxReasoningSteps: 4
});`,
    },
  },
  {
    id: "execution",
    layerNumber: "LAYER 03",
    name: "The Execution Layer",
    tagline: "Telephony & Business Infrastructure",
    badge: "Native RFC 3261 • BYOC Carriers",
    accentColor: "text-[#7e22ce]",
    badgeStyle: "bg-purple-50 text-purple-900 border-purple-200",
    bgGlow: "rgba(126, 34, 206, 0.05)",
    points: [
      {
        title: "Native RFC 3261 Custom SIP Trunking (BYOC: Telnyx, Twilio, Plivo, Asterisk, VICIdial)",
        details:
          "Carrier-agnostic SIP integration allows enterprises to plug in their existing telecom contracts, local DID numbers, and on-premise PBX deployments with zero vendor lock-in.",
        meta: "RFC 3261 Compliant • BYOC Carrier Agnostic",
      },
      {
        title: "Automated event-driven webhooks and bidirectional CRM synchronization",
        details:
          "Instant webhook dispatch updates deal stages, notes, and call recordings in Salesforce, HubSpot, or Zoho CRM during the call, plus pushes real-time actions via WhatsApp or SMS.",
        meta: "Bidirectional CRM Sync • Sub-second Webhooks",
      },
      {
        title: "Complete Multi-Tenant White-Labeling with isolated data per client",
        details:
          "Built for agencies and enterprise divisions with logically isolated tenant partitions, dedicated cryptographic encryption keys, custom SIP credentials, and branded customer portals.",
        meta: "Multi-Tenant Isolation • AES-256 Per Tenant",
      },
    ],
    telemetry: {
      protocol: "SIP / RFC 3261 + HTTPS Event Webhook Bus",
      latency: "45ms",
      status: "CARRIER_CONNECTED",
      metrics: [
        { label: "SIP Trunk Status", value: "BYOC (Telnyx/Twilio/Asterisk)", pass: true },
        { label: "CRM Sync Status", value: "Salesforce / Zoho Active", pass: true },
        { label: "Tenant Isolation", value: "Logical Partition AES-256", pass: true },
        { label: "Carrier Jitter", value: "<1.2ms Jitter Buffer", pass: true },
      ],
      codeSnippet: `// Execution Layer: Native RFC 3261 SIP & Webhook Bus
const trunk = new SIPTrunkBridge({
  carrier: "BYOC_TELNYX_EXOTEL_ASTERISK",
  rfcProtocol: "RFC_3261",
  codecs: ["PCMU", "PCMA", "OPUS"],
  crmSync: {
    provider: "salesforce_enterprise",
    eventDriven: true,
    writeOnDisposition: true
  },
  tenantIsolationKey: process.env.TENANT_KEY
});`,
    },
  },
];

export function CorePlatformArchitectureSection() {
  const [activeTab, setActiveTab] = useState<ArchitectureLayer>("all");
  const [selectedCarrier, setSelectedCarrier] = useState<"Telnyx" | "Twilio" | "Plivo" | "Asterisk" | "VICIdial">("Telnyx");
  const [selectedModel, setSelectedModel] = useState<"Gemini 2.0 Flash" | "GPT-4o" | "Claude 3.5 Sonnet" | "Sarvam Indic">("Gemini 2.0 Flash");

  return (
    <section id="architecture" className="relative bg-white py-20 text-ink md:py-28 overflow-hidden border-t border-line">
      {/* Subtle Background Glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full blur-[140px] opacity-25"
        style={{ background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full blur-[140px] opacity-25"
        style={{ background: "radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="container-x relative z-10">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cobalt/30 bg-cobalt/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-cobalt">
              <span className="inline-block size-2 rounded-full bg-cobalt animate-pulse" />
              Core Platform Architecture // For Enterprise CTOs &amp; Product Heads
            </div>
            <h2 className="display-lg mt-4 text-[clamp(1.85rem,3.4vw,3.25rem)] font-bold leading-tight tracking-tight text-ink">
              The Three-Layer <span className="text-cobalt">Agentic Engine</span>.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
              When speaking to CTOs, Product Heads, or Agency Founders, highlight the Three-Layer Agentic Engine: isolated acoustic perception, autonomous cognitive planning, and carrier-grade RFC 3261 telephony execution.
            </p>
          </div>

          {/* Quick Technical SLA Badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="rounded-md border border-line bg-paper px-2.5 py-1 text-ink/80 shadow-xs">
              ⚡ &lt;120ms Barge-In
            </span>
            <span className="rounded-md border border-line bg-paper px-2.5 py-1 text-ink/80 shadow-xs">
              📞 RFC 3261 SIP (BYOC)
            </span>
            <span className="rounded-md border border-line bg-paper px-2.5 py-1 text-ink/80 shadow-xs">
              🔒 Multi-Tenant Isolated
            </span>
          </div>
        </div>

        {/* Layer View Mode Switcher Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted mr-2">Layer View:</span>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-ink text-white font-bold shadow-xs"
                  : "bg-paper border border-line text-muted hover:bg-paper-2 hover:text-ink"
              }`}
            >
              ✦ Full 3-Layer Stack
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("perception")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "perception"
                  ? "bg-[#0284c7] text-white font-bold shadow-xs"
                  : "bg-paper border border-line text-muted hover:bg-paper-2 hover:text-ink"
              }`}
            >
              1. Perception Layer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cognitive")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "cognitive"
                  ? "bg-cobalt text-white font-bold shadow-xs"
                  : "bg-paper border border-line text-muted hover:bg-paper-2 hover:text-ink"
              }`}
            >
              2. Cognitive Layer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("execution")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "execution"
                  ? "bg-[#7e22ce] text-white font-bold shadow-xs"
                  : "bg-paper border border-line text-muted hover:bg-paper-2 hover:text-ink"
              }`}
            >
              3. Execution Layer
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-muted">
            <span>RFC 3261</span>
            <span>•</span>
            <span>LiveKit WebSockets</span>
            <span>•</span>
            <span>Strict Pydantic</span>
          </div>
        </div>

        {/* Architecture Stack Cards */}
        <div className="mt-10 space-y-8">
          {architectureLayers
            .filter((layer) => activeTab === "all" || activeTab === layer.id)
            .map((layer) => (
              <div
                key={layer.id}
                className="group relative rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-xs transition-all hover:border-ink/20 hover:shadow-sm"
              >
                {/* Top Bar with Badges */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-ink px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider text-[#d4ff3f]">
                      {layer.layerNumber}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-ink flex items-center gap-2">
                      {layer.name}
                      <span className={`text-xs font-mono font-medium ${layer.accentColor}`}>
                        ({layer.tagline})
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 font-mono text-[11px] font-semibold ${layer.badgeStyle}`}>
                      {layer.badge}
                    </span>
                  </div>
                </div>

                {/* Main Content Grid: 3 Bullet Points on Left, Live Technical Telemetry Card on Right */}
                <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
                  {/* Left Column: 3 Verbatim Architecture Pillars */}
                  <div className="lg:col-span-7 space-y-6">
                    {layer.points.map((point, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-line bg-paper-2/60 p-4 sm:p-5 transition-colors hover:bg-paper-2 hover:border-ink/20"
                      >
                        <div className="flex items-start gap-3">
                          <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-paper border border-line font-mono text-[11px] font-bold ${layer.accentColor}`}>
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="font-display text-sm sm:text-base font-bold text-ink leading-snug">
                              {point.title}
                            </h4>
                            <p className="mt-2 text-xs sm:text-[13px] text-muted leading-relaxed">
                              {point.details}
                            </p>
                            <span className="mt-3 inline-block rounded bg-paper border border-line px-2 py-0.5 font-mono text-[10px] text-muted font-medium">
                              {point.meta}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Live Technical Telemetry Console (Dark Contrast for Technical Clarity) */}
                  <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-[#0e0e0c] p-5 font-mono text-zinc-100 shadow-md">
                    <div className="flex items-center justify-between border-b border-[#1c1c1a] pb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-white/90 font-bold">{layer.telemetry.status}</span>
                      </div>
                      <span className="text-white/50 text-[11px]">latency: {layer.telemetry.latency}</span>
                    </div>

                    <div className="mt-3 text-[11px] text-white/60 truncate">
                      {layer.telemetry.protocol}
                    </div>

                    {/* Interactive Telemetry Widget based on Layer */}
                    {layer.id === "perception" && (
                      <div className="mt-4 rounded-xl bg-[#141412] p-3 border border-[#20201d]">
                        <div className="flex items-center justify-between text-[11px] text-white/70 mb-2">
                          <span>Live Full-Duplex VAD Visualizer</span>
                          <span className="text-[#38bdf8]">24kHz PCM</span>
                        </div>
                        {/* Audio Wave Sim */}
                        <div className="flex items-end justify-between h-10 gap-1 px-1">
                          {[30, 60, 45, 80, 95, 40, 70, 85, 100, 75, 45, 60, 90, 65, 50, 85, 95, 70, 40, 60].map((h, i) => (
                            <div
                              key={i}
                              className="w-1 bg-[#38bdf8] rounded-full transition-all duration-300"
                              style={{
                                height: `${h}%`,
                                opacity: i > 12 ? 0.35 : 0.85,
                              }}
                            />
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[10px] text-white/50 border-t border-[#1e1e1b] pt-2">
                          <span>Office Noise &amp; Coughs: Filtered (-48dB)</span>
                          <span className="text-emerald-400 font-bold">Barge-in: &lt;120ms</span>
                        </div>
                      </div>
                    )}

                    {layer.id === "cognitive" && (
                      <div className="mt-4 rounded-xl bg-[#141412] p-3 border border-[#20201d]">
                        <div className="text-[11px] text-white/70 mb-2 flex justify-between">
                          <span>Model Orchestrator</span>
                          <span className="text-[#d4ff3f]">Sub-300ms</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          {(["Gemini 2.0 Flash", "GPT-4o", "Claude 3.5 Sonnet", "Sarvam Indic"] as const).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setSelectedModel(m)}
                              className={`rounded p-1.5 text-left border transition-all ${
                                selectedModel === m
                                  ? "border-[#d4ff3f] bg-[#d4ff3f]/10 text-white font-bold"
                                  : "border-[#22221f] text-white/50 hover:border-white/20"
                              }`}
                            >
                              ● {m}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 text-[10px] text-white/50 border-t border-[#1e1e1b] pt-2 flex justify-between">
                          <span>Pydantic Schema: Strict</span>
                          <span className="text-emerald-400">Guardrails: 0 Leaks</span>
                        </div>
                      </div>
                    )}

                    {layer.id === "execution" && (
                      <div className="mt-4 rounded-xl bg-[#141412] p-3 border border-[#20201d]">
                        <div className="text-[11px] text-white/70 mb-2 flex justify-between">
                          <span>Carrier BYOC Switchboard</span>
                          <span className="text-[#c084fc]">RFC 3261</span>
                        </div>
                        <div className="flex flex-wrap gap-1 text-[10px]">
                          {(["Telnyx", "Twilio", "Plivo", "Asterisk", "VICIdial"] as const).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setSelectedCarrier(c)}
                              className={`rounded px-2 py-1 border transition-all ${
                                selectedCarrier === c
                                  ? "border-[#c084fc] bg-[#c084fc]/10 text-white font-bold"
                                  : "border-[#22221f] text-white/50 hover:border-white/20"
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 text-[10px] text-white/50 border-t border-[#1e1e1b] pt-2 flex justify-between">
                          <span>Active Carrier: {selectedCarrier}</span>
                          <span className="text-emerald-400">Webhook Bus: Synced</span>
                        </div>
                      </div>
                    )}

                    {/* Metrics List */}
                    <div className="mt-4 space-y-1.5 border-t border-[#1c1c1a] pt-3 text-[11px]">
                      {layer.telemetry.metrics.map((m, mi) => (
                        <div key={mi} className="flex items-center justify-between">
                          <span className="text-white/60">{m.label}</span>
                          <span className="text-white font-medium">{m.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Code Snippet Box */}
                    <div className="mt-4">
                      <div className="rounded-xl bg-[#050504] p-3 text-[10px] text-white/70 overflow-x-auto border border-[#1b1b19] font-mono leading-relaxed">
                        <pre><code>{layer.telemetry.codeSnippet}</code></pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Enterprise Bottom Banner / Handoff */}
        <div className="mt-12 rounded-3xl border border-line bg-paper-2 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-xs">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-cobalt font-bold">Architecture Ready For Production</span>
            <h4 className="font-display text-lg sm:text-xl font-bold text-ink mt-1">
              Ready to plug our Three-Layer Engine into your custom SIP trunks or CRM?
            </h4>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl">
              We provide direct engineering onboarding for CTOs, including custom BYOC peering, VPC hosting, and dedicated SLA contracts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/contact" className="btn btn-primary">
              <span>Talk to Infrastructure Team</span>
            </a>
            <a href="#agentic-in-action" className="btn btn-outline border-line text-ink hover:border-ink">
              <span>See Agentic in Action ↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
