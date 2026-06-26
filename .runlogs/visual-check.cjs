const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, ".runlogs", "screens");
fs.mkdirSync(outDir, { recursive: true });

const session = {
  id: "visual-user",
  email: "sumit@example.com",
  name: "Sumit",
  signedInAt: new Date().toISOString(),
  emailVerified: true,
  twoFactorEnabled: false,
  token: "visual-token",
  organization: {
    id: "visual-org",
    name: "sumit's workspace",
    slug: "sumits-workspace",
    role: "owner",
  },
};

const baseBehavior = {
  interruptions: true,
  userStartsFirst: false,
  autoFillResponses: true,
  agentCanTerminate: true,
  voicemailHandling: true,
  voicemailAction: "leave-message",
  dtmfDial: false,
  dtmfSequence: "",
  endpointingMode: "balanced",
  responseDelayMs: 250,
  maxCallDurationSeconds: 900,
  maxIdleSeconds: 30,
  transferPhone: "",
  timezone: "Asia/Kolkata",
  voicemailMessage: "Please call us back when available.",
};

const baseAgent = {
  _id: "agent-1",
  name: "Maya",
  team: "Growth Desk",
  status: "Live",
  phone: "+918001234567",
  language: "hi-IN",
  voice: "shubh",
  providerModel: "sarvam-gemini",
  pipelineMode: "pipeline",
  realtimeProvider: "openai",
  realtimeModel: "gpt-realtime",
  llmProvider: "openai",
  llmModel: "gpt-5.4",
  sttProvider: "sarvam",
  sttModel: "saaras:v3",
  ttsProvider: "sarvam",
  ttsModel: "bulbul:v3",
  temperature: 0.35,
  maxConcurrentCalls: 5,
  voiceSpeed: 1,
  voicePitch: 0,
  interruptionSensitivity: "medium",
  backgroundNoise: "none",
  callbackEmail: "ops@example.com",
  businessHoursEnabled: false,
  businessHours: { timezone: "Asia/Kolkata", schedule: [] },
  prompt: "# Ashish Nursing Home\n\nYou are Riya, a helpful voice agent.",
  firstMessage: "Namaste, main Riya bol rahi hoon. Aapko kaise madad kar sakti hoon?",
  firstMessageMode: "assistant-speaks-first",
  behavior: baseBehavior,
  callSettings: {
    recordingEnabled: true,
    doNotCallDetection: true,
    sessionContinuation: true,
    memoryEnabled: false,
  },
  tools: [
    {
      _id: "tool-1",
      name: "check_availability",
      description: "Check available slots",
      method: "GET",
      url: "https://example.com/slots",
      timeoutSeconds: 12,
      enabled: true,
      parameters: [],
    },
  ],
  knowledgeDocuments: [
    {
      _id: "doc-1",
      name: "Clinic FAQ",
      content: "Timings, appointment flow, doctor availability, and billing rules.",
      status: "ready",
    },
  ],
  dynamicVariables: ["FromPhone", "ToPhone", "LeadName"],
  prefetchWebhook: "",
  endOfCallWebhook: "",
  widget: {
    enabled: true,
    publicKey: "demo-widget",
    allowedDomains: ["localhost"],
    theme: "light",
    position: "bottom-right",
  },
  version: 3,
  latencyMetrics: {
    latestMs: 3411,
    averageMs: 2800,
    sampleCount: 8,
    lastMeasuredAt: new Date().toISOString(),
  },
};

const agents = [
  baseAgent,
  { ...baseAgent, _id: "agent-2", name: "Customer Support", team: "Support", status: "Paused", tools: [], knowledgeDocuments: [] },
  { ...baseAgent, _id: "agent-3", name: "FAQ Assistant", team: "Information", status: "Draft", tools: [], knowledgeDocuments: [] },
];

const numbers = [
  {
    _id: "number-1",
    number: "+918001234567",
    label: "Main line",
    direction: "Both",
    region: "IN",
    status: "Ready",
    inboundTrunkId: "inbound",
    outboundTrunkId: "outbound",
    dispatchRuleId: "rule-1",
    provider: "Vobiz",
    providerNumberId: "vn-1",
    monthlyFee: 0,
    currency: "INR",
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    agentId: baseAgent,
  },
];

const config = {
  configured: true,
  agentName: "voice-platform-agent",
  providers: [],
  languageCatalog: [
    { code: "hi-IN", label: "Hindi (India)" },
    { code: "en-IN", label: "English (India)" },
  ],
  modelCatalog: {
    realtime: {
      openai: [{ id: "gpt-realtime", label: "gpt-realtime" }],
      gemini: [{ id: "gemini-live-2.5-flash-preview", label: "gemini-live" }],
    },
    llm: {
      openai: [{ id: "gpt-5.4", label: "gpt-5.4" }],
      gemini: [{ id: "gemini-2.5-flash", label: "gemini-2.5-flash" }],
      sarvam: [{ id: "sarvam-m", label: "sarvam-m" }],
      elevenlabs: [{ id: "elevenlabs", label: "elevenlabs" }],
    },
    stt: {
      openai: [{ id: "gpt-4o-mini-transcribe", label: "openai STT" }],
      sarvam: [{ id: "saaras:v3", label: "sarvam STT" }],
      elevenlabs: [{ id: "scribe_v1", label: "elevenlabs STT" }],
    },
    tts: {
      openai: [{ id: "gpt-4o-mini-tts", label: "openai TTS", voices: [{ id: "alloy", label: "Alloy" }] }],
      gemini: [{ id: "gemini-tts", label: "gemini TTS", voices: [{ id: "kore", label: "Kore" }] }],
      sarvam: [{ id: "bulbul:v3", label: "sarvam TTS", voices: [{ id: "shubh", label: "Shubh" }] }],
      elevenlabs: [{ id: "eleven_multilingual_v2", label: "elevenlabs TTS", voices: [{ id: "aria", label: "Aria" }] }],
    },
  },
  pricing: { currency: "USD", llm: [], stt: [], tts: [], telephony: [] },
  latencyGuide: { realtime: [], pipeline: [] },
  sip: {
    inboundConfigured: true,
    outboundConfigured: true,
    inboundDestinationConfigured: true,
    callerId: "+918001234567",
  },
  vobiz: {
    configured: true,
    accountId: "visual-account",
    status: "connected",
    ownedNumberCount: 1,
  },
};

function json(route, body, status = 200) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function setupPage(page) {
  await page.addInitScript((storedSession) => {
    window.localStorage.setItem("ai_voice_platform_session", JSON.stringify(storedSession));
  }, session);

  await page.route("http://localhost:5000/api/auth/me", (route) =>
    json(route, {
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        emailVerified: true,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
      },
      organization: session.organization,
    }),
  );

  await page.route("http://localhost:5000/api/voice/**", (route) => {
    const url = new URL(route.request().url());
    const endpoint = url.pathname.replace("/api/voice", "");

    if (endpoint === "/agents") return json(route, { agents });
    if (endpoint === "/config") return json(route, config);
    if (endpoint === "/agent-templates") return json(route, { templates: [] });
    if (endpoint === "/phone-numbers") return json(route, { numbers });
    if (endpoint === "/calls") return json(route, { calls: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } });
    if (endpoint.includes("/runtime/stream")) return route.abort();
    return json(route, {});
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await setupPage(page);

  for (const item of [
    ["dashboard", "http://localhost:3000/dashboard"],
    ["campaign", "http://localhost:3000/dashboard/campaign"],
    ["knowledge", "http://localhost:3000/dashboard/knowledge"],
    ["phone-number", "http://localhost:3000/dashboard/phone-number"],
  ]) {
    const [name, url] = item;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: false });
    console.log(`${name}: ${page.url()}`);
  }

  await browser.close();
})();
