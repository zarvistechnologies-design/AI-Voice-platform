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
    metrics: {
      label: string;
      value: string;
      pass: boolean;
    }[];
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
    accentColor: "text-purple-600",
    badgeStyle: "bg-purple-50 text-purple-900 border-purple-200",
    bgGlow: "rgba(159, 61, 168, 0.05)",
    points: [
      {
        title: "Real-Time Full-Duplex WebSockets with LiveKit audio pipelines",
        details: "Ultra-low overhead bi-directional streaming of raw 24kHz PCM audio frames. Eliminates buffer bloat and packet jitter so agent and human can converse naturally without turn-taking delays.",
        meta: "LiveKit RTC Engine • 24kHz HD Audio",
      },
      {
        title: "Voice Activity Detection (VAD) tuned to filter out background office noise, speaker echo, and coughs",
        details: "Deep acoustic neural classification isolates genuine human speech phonemes from keyboard clatter, coffee shop chatter, HVAC hum, acoustic feedback, and accidental vocal ticks.",
        meta: "Neural Acoustic Classifier • -48dB SNR",
      },
      {
        title: "Instant barge-in: Stops generating audio in <120ms when the user speaks",
        details: "Sub-120ms acoustic reflex loop instantly terminates downstream TTS packet transmission the moment caller speech onset is detected. Zero clumsy talking over callers.",
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
    accentColor: "text-[#9F3DA8]",
    badgeStyle: "bg-purple-100 text-purple-950 border-purple-300",
    bgGlow: "rgba(159, 61, 168, 0.05)",
    points: [
      {
        title: "Low-latency LLM orchestration (Gemini 2.0 Flash, GPT-4o, Claude 3.5 Sonnet, Sarvam Indic)",
        details: "Dynamic model routing engine selects the optimal reasoning model based on query intent, language nuances, and latency budgets—balancing sub-300ms reflex responses with complex multi-turn logic.",
        meta: "Dynamic Model Router • Sub-300ms TTFT",
      },
      {
        title: "Multi-step function calling with strict schema enforcement",
        details: "Deterministic ReAct planning cycle inspects and validates API payloads against strict Pydantic/JSON schemas before execution, eliminating malformed tool calls and broken transactions.",
        meta: "Pydantic Schema Validation • Zero Tool Failures",
      },
      {
        title: "Guardrails to prevent hallucinations, policy violations, or prompt injections",
        details: "Real-time semantic safety gateway verifies prompt boundaries, checks regulatory compliance thresholds (RBI, HIPAA, TRAI), and prevents adversarial jailbreaks mid-dialogue.",
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
    accentColor: "text-purple-700",
    badgeStyle: "bg-purple-50 text-purple-900 border-purple-200",
    bgGlow: "rgba(159, 61, 168, 0.05)",
    points: [
      {
        title: "Native RFC 3261 Custom SIP Trunking (BYOC: Telnyx, Twilio, Plivo, Asterisk, VICIdial)",
        details: "Carrier-agnostic SIP integration allows enterprises to plug in their existing telecom contracts, local DID numbers, and on-premise PBX deployments with zero vendor lock-in.",
        meta: "RFC 3261 Compliant • BYOC Carrier Agnostic",
      },
      {
        title: "Automated event-driven webhooks and bidirectional CRM synchronization",
        details: "Instant webhook dispatch updates deal stages, notes, and call recordings in Salesforce, HubSpot, or Zoho CRM during the call, plus pushes real-time actions via WhatsApp or SMS.",
        meta: "Bidirectional CRM Sync • Sub-second Webhooks",
      },
      {
        title: "Complete Multi-Tenant White-Labeling with isolated data per client",
        details: "Built for agencies and enterprise divisions with logically isolated tenant partitions, dedicated cryptographic encryption keys, custom SIP credentials, and branded customer portals.",
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
    <section id="architecture" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold mb-3">
              <span className="size-2 rounded-full bg-[#9F3DA8]" />
              Core Platform Architecture // For Enterprise CTOs &amp; Product Heads
            </span>
            <h2 className="zippee-title-underline-left text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1D1D1F] tracking-tight mt-2">
              The Three-Layer <span className="text-[#9F3DA8]">Agentic Engine</span>.
            </h2>
            <p className="mt-4 text-base text-gray-600 max-w-3xl leading-relaxed">
              When speaking to CTOs, Product Heads, or Agency Founders, highlight the Three-Layer Agentic Engine: isolated acoustic perception, autonomous cognitive planning, and carrier-grade RFC 3261 telephony execution.
            </p>
          </div>

          {/* Quick SLA Badges */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <span className="zippee-pill bg-purple-50 text-purple-900 font-bold">⚡ &lt;120ms Barge-In</span>
            <span className="zippee-pill bg-purple-50 text-purple-900 font-bold">📞 RFC 3261 SIP (BYOC)</span>
            <span className="zippee-pill bg-purple-50 text-purple-900 font-bold">🔒 Multi-Tenant Isolated</span>
          </div>
        </div>

        {/* Layer View Mode Switcher Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/90 p-1.5 shadow-xs">
            <span className="px-3 font-mono text-xs uppercase font-bold text-gray-400">View:</span>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "all" ? "bg-[#9F3DA8] text-white shadow-xs" : "text-gray-700 hover:text-[#9F3DA8]"
              }`}
            >
              ✦ Full 3-Layer Stack
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("perception")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "perception" ? "bg-[#9F3DA8] text-white shadow-xs" : "text-gray-700 hover:text-[#9F3DA8]"
              }`}
            >
              1. Perception
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cognitive")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "cognitive" ? "bg-[#9F3DA8] text-white shadow-xs" : "text-gray-700 hover:text-[#9F3DA8]"
              }`}
            >
              2. Cognitive
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("execution")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "execution" ? "bg-[#9F3DA8] text-white shadow-xs" : "text-gray-700 hover:text-[#9F3DA8]"
              }`}
            >
              3. Execution
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-gray-400">
            <span>RFC 3261</span>
            <span>•</span>
            <span>LiveKit WebSockets</span>
            <span>•</span>
            <span>Strict Pydantic</span>
          </div>
        </div>

        {/* Architecture Stack Cards */}
        <div className="space-y-10">
          {architectureLayers
            .filter((layer) => activeTab === "all" || activeTab === layer.id)
            .map((layer) => (
              <div key={layer.id} className="zippee-card p-6 sm:p-10 shadow-xl border border-gray-200">
                {/* Top Bar with Badges */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="size-8 rounded-lg bg-[#9F3DA8] text-white font-mono text-xs font-bold grid place-items-center">
                      {layer.layerNumber.slice(-2)}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-[#1D1D1F]">
                        {layer.name}
                        <span className="text-sm font-medium text-gray-500 ml-2">({layer.tagline})</span>
                      </h3>
                    </div>
                  </div>
                  <span className="zippee-pill bg-purple-100 text-purple-900 border-purple-200 font-bold text-xs">
                    {layer.badge}
                  </span>
                </div>

                {/* Main Content Grid: 3 Bullet Points on Left, Live Technical Telemetry Card on Right */}
                <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
                  {/* Left Column: 3 Verbatim Architecture Pillars */}
                  <div className="lg:col-span-6 space-y-6">
                    {layer.points.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                        <span className="size-7 rounded-lg bg-[#FDF4FF] text-[#9F3DA8] font-mono text-xs font-bold grid place-items-center shrink-0 border border-purple-200">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-[#1D1D1F]">{point.title}</h4>
                          <p className="mt-2 text-xs text-gray-600 leading-relaxed">{point.details}</p>
                          <span className="mt-2 inline-block font-mono text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
                            {point.meta}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Live Technical Telemetry Console (Zippee Deep Plum Obsidian) */}
                  <div className="lg:col-span-6 zippee-dark-card p-6 space-y-5 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-300 font-bold">{layer.telemetry.status}</span>
                      </div>
                      <span className="text-purple-300">latency: {layer.telemetry.latency}</span>
                    </div>

                    <div className="font-mono text-xs text-purple-200">
                      {layer.telemetry.protocol}
                    </div>

                    {/* Interactive Telemetry Widget based on Layer */}
                    {layer.id === "perception" && (
                      <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                        <div className="flex justify-between text-[11px] text-purple-300 font-mono">
                          <span>Live Full-Duplex VAD Visualizer</span>
                          <span className="text-emerald-400 font-bold">24kHz PCM</span>
                        </div>
                        {/* Audio Wave Sim */}
                        <div className="flex items-center justify-between h-8 gap-1">
                          {[30, 60, 45, 80, 95, 40, 70, 85, 100, 75, 45, 60, 90, 65, 50, 85, 95, 70, 40, 60].map((h, i) => (
                            <div
                              key={i}
                              className="w-1 bg-gradient-to-t from-[#9F3DA8] to-pink-300 rounded-full"
                              style={{
                                height: `${h}%`,
                                opacity: i > 12 ? 0.35 : 0.85,
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                          <span>Office Noise: Filtered (-48dB)</span>
                          <span className="text-purple-300">Barge-in: &lt;120ms</span>
                        </div>
                      </div>
                    )}

                    {layer.id === "cognitive" && (
                      <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                        <div className="flex justify-between text-[11px] text-purple-300 font-mono">
                          <span>Model Orchestrator</span>
                          <span className="text-emerald-400 font-bold">Sub-300ms</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(["Gemini 2.0 Flash", "GPT-4o", "Claude 3.5 Sonnet", "Sarvam Indic"] as const).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setSelectedModel(m)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                                selectedModel === m
                                  ? "bg-[#9F3DA8] text-white font-bold"
                                  : "bg-white/5 text-gray-300 hover:bg-white/10"
                              }`}
                            >
                              ● {m}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                          <span>Pydantic Schema: Strict</span>
                          <span className="text-emerald-400">Guardrails: 0 Leaks</span>
                        </div>
                      </div>
                    )}

                    {layer.id === "execution" && (
                      <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                        <div className="flex justify-between text-[11px] text-purple-300 font-mono">
                          <span>Carrier BYOC Switchboard</span>
                          <span className="text-emerald-400 font-bold">RFC 3261</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(["Telnyx", "Twilio", "Plivo", "Asterisk", "VICIdial"] as const).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setSelectedCarrier(c)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                                selectedCarrier === c
                                  ? "bg-[#9F3DA8] text-white font-bold"
                                  : "bg-white/5 text-gray-300 hover:bg-white/10"
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                          <span>Active Carrier: {selectedCarrier}</span>
                          <span className="text-purple-300">Webhook Bus: Synced</span>
                        </div>
                      </div>
                    )}

                    {/* Metrics List */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                      {layer.telemetry.metrics.map((m, mi) => (
                        <div key={mi} className="flex justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-gray-400">{m.label}:</span>
                          <span className="text-emerald-400 font-bold">{m.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Code Snippet Box */}
                    <div className="rounded-xl bg-black/60 p-3 font-mono text-[11px] text-purple-200 overflow-x-auto border border-white/10">
                      <pre><code>{layer.telemetry.codeSnippet}</code></pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Enterprise Bottom Banner / Handoff */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-[#9F3DA8] to-[#1A0920] p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-wider text-purple-200 font-bold block mb-1">Architecture Ready For Production</span>
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to plug our Three-Layer Engine into your custom SIP trunks or CRM?
            </h4>
            <p className="mt-3 text-sm text-purple-100/90 leading-relaxed">
              We provide direct engineering onboarding for CTOs, including custom BYOC peering, VPC hosting, and dedicated SLA contracts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a href="/contact" className="zippee-btn-secondary bg-white text-[#9F3DA8] border-white hover:bg-purple-50">
              <span>Talk to Infrastructure Team</span>
            </a>
            <a href="#agentic-in-action" className="zippee-btn-primary bg-[#150719] text-white hover:bg-black">
              <span>See Agentic in Action ↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CorePlatformArchitectureSection;