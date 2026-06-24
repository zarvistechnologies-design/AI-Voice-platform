"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import {
  voiceApi,
  type BackendAgent,
  type CallRecord,
  type AgentBehavior,
  type AgentBusinessHours,
  type AgentCallSettings,
  type AgentRuntimeSnapshot,
  type AgentTemplate,
  type AgentTool,
  type AgentToolParameter,
  type AgentWidget,
  type BusinessHoursDay,
  type FirstMessageMode,
  type KnowledgeDocument,
  type ModelCatalog,
  type PipelineMode,
  type PipelineProvider,
  type RealtimeProvider,
  type SttProvider,
  type VoicePreviewRequest,
  type VoiceLanguageOption,
} from "@/lib/voice";

type AgentStatus = "Live" | "Draft" | "Paused";
type AgentTab = "builder" | "behavior" | "tools" | "calls" | "widget";

const TestCallPanel = dynamic(
  () => import("@/components/dashboard/TestCallPanel").then((module) => module.TestCallPanel),
  { ssr: false },
);

type VoiceAgent = {
  id: string;
  name: string;
  team: string;
  status: AgentStatus;
  phone: string;
  language: string;
  voice: string;
  pipelineMode: PipelineMode;
  realtimeProvider: RealtimeProvider;
  realtimeModel: string;
  llmProvider: PipelineProvider;
  llmModel: string;
  sttProvider: SttProvider;
  sttModel: string;
  ttsProvider: PipelineProvider;
  ttsModel: string;
  temperature: number;
  maxConcurrentCalls: number;
  voiceSpeed: number;
  voicePitch: number;
  interruptionSensitivity: BackendAgent["interruptionSensitivity"];
  backgroundNoise: BackendAgent["backgroundNoise"];
  callbackEmail: string;
  businessHoursEnabled: boolean;
  businessHours: AgentBusinessHours;
  latency: string;
  calls: number;
  success: string;
  prompt: string;
  firstMessage: string;
  firstMessageMode: FirstMessageMode;
  behavior: AgentBehavior;
  callSettings: AgentCallSettings;
  tools: AgentTool[];
  knowledgeDocuments: KnowledgeDocument[];
  dynamicVariables: string[];
  prefetchWebhook: string;
  endOfCallWebhook: string;
  widget: AgentWidget;
  version: number;
};

type DashboardVoiceConfig = {
  configured: boolean;
  agentName: string;
  sip: {
    inboundConfigured: boolean;
    outboundConfigured: boolean;
    inboundDestinationConfigured: boolean;
    callerId: string;
  };
  vobiz: {
    configured: boolean;
    accountId: string;
    status: string;
    ownedNumberCount: number;
  };
};

const defaultBehavior: AgentBehavior = {
  interruptions: true,
  userStartsFirst: false,
  autoFillResponses: true,
  agentCanTerminate: true,
  voicemailHandling: true,
  voicemailAction: "leave-message",
  dtmfDial: false,
  dtmfSequence: "",
  endpointingMode: "balanced",
  responseDelayMs: 180,
  maxCallDurationSeconds: 1200,
  maxIdleSeconds: 18,
  transferPhone: "",
  timezone: "UTC",
  voicemailMessage: "Sorry we missed you. Please leave a message after the tone.",
};

const defaultCallSettings: AgentCallSettings = {
  recordingEnabled: false,
  doNotCallDetection: true,
  sessionContinuation: true,
  memoryEnabled: true,
};

const defaultWidget: AgentWidget = {
  enabled: false,
  publicKey: "",
  allowedDomains: [],
  theme: "auto",
  position: "bottom-right",
  buttonText: "Talk to us",
  accentColor: "#1438f5",
};

const defaultBusinessHours: AgentBusinessHours = {
  timezone: "UTC",
  schedule: [
    { day: "sun", enabled: false, start: "09:00", end: "17:00" },
    { day: "mon", enabled: true, start: "09:00", end: "17:00" },
    { day: "tue", enabled: true, start: "09:00", end: "17:00" },
    { day: "wed", enabled: true, start: "09:00", end: "17:00" },
    { day: "thu", enabled: true, start: "09:00", end: "17:00" },
    { day: "fri", enabled: true, start: "09:00", end: "17:00" },
    { day: "sat", enabled: false, start: "09:00", end: "17:00" },
  ],
};

const businessDayLabels: Record<BusinessHoursDay["day"], string> = {
  sun: "Sun",
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
};

const agents: VoiceAgent[] = [{
  id: "loading",
  name: "Loading agent",
  team: "Voice team",
  status: "Draft",
  phone: "Not assigned",
  language: "English",
  voice: "alloy",
  pipelineMode: "realtime",
  realtimeProvider: "openai",
  realtimeModel: "gpt-realtime",
  llmProvider: "openai",
  llmModel: "gpt-4.1-mini",
  sttProvider: "openai",
  sttModel: "gpt-4o-mini-transcribe",
  ttsProvider: "openai",
  ttsModel: "gpt-4o-mini-tts",
  temperature: 0.35,
  maxConcurrentCalls: 5,
  voiceSpeed: 1,
  voicePitch: 0,
  interruptionSensitivity: "medium",
  backgroundNoise: "none",
  callbackEmail: "",
  businessHoursEnabled: false,
  businessHours: defaultBusinessHours,
  latency: "No data",
  calls: 0,
  success: "-",
  prompt: "",
  firstMessage: "",
  firstMessageMode: "assistant-speaks-first",
  behavior: defaultBehavior,
  callSettings: defaultCallSettings,
  tools: [],
  knowledgeDocuments: [],
  dynamicVariables: ["FromPhone", "ToPhone"],
  prefetchWebhook: "",
  endOfCallWebhook: "",
  widget: defaultWidget,
  version: 1,
}];

const fallbackLanguageCatalog: VoiceLanguageOption[] = [
  { value: "Multilingual", label: "Auto detect", code: "unknown", sarvamStt: true, sarvamTts: false },
  { value: "English", label: "English (India)", code: "en-IN", sarvamStt: true, sarvamTts: true },
  { value: "English UK", label: "English (UK)", code: "en-GB", sarvamStt: false, sarvamTts: false },
  { value: "Hindi", label: "Hindi", code: "hi-IN", sarvamStt: true, sarvamTts: true },
  { value: "Bengali", label: "Bengali", code: "bn-IN", sarvamStt: true, sarvamTts: true },
  { value: "Tamil", label: "Tamil", code: "ta-IN", sarvamStt: true, sarvamTts: true },
  { value: "Telugu", label: "Telugu", code: "te-IN", sarvamStt: true, sarvamTts: true },
  { value: "Kannada", label: "Kannada", code: "kn-IN", sarvamStt: true, sarvamTts: true },
  { value: "Malayalam", label: "Malayalam", code: "ml-IN", sarvamStt: true, sarvamTts: true },
  { value: "Marathi", label: "Marathi", code: "mr-IN", sarvamStt: true, sarvamTts: true },
  { value: "Gujarati", label: "Gujarati", code: "gu-IN", sarvamStt: true, sarvamTts: true },
  { value: "Punjabi", label: "Punjabi", code: "pa-IN", sarvamStt: true, sarvamTts: true },
  { value: "Odia", label: "Odia", code: "od-IN", sarvamStt: true, sarvamTts: true },
  { value: "Assamese", label: "Assamese", code: "as-IN", sarvamStt: true, sarvamTts: false },
  { value: "Urdu", label: "Urdu", code: "ur-IN", sarvamStt: true, sarvamTts: false },
  { value: "Nepali", label: "Nepali", code: "ne-IN", sarvamStt: true, sarvamTts: false },
  { value: "Konkani", label: "Konkani", code: "kok-IN", sarvamStt: true, sarvamTts: false },
  { value: "Kashmiri", label: "Kashmiri", code: "ks-IN", sarvamStt: true, sarvamTts: false },
  { value: "Sindhi", label: "Sindhi", code: "sd-IN", sarvamStt: true, sarvamTts: false },
  { value: "Sanskrit", label: "Sanskrit", code: "sa-IN", sarvamStt: true, sarvamTts: false },
  { value: "Santali", label: "Santali", code: "sat-IN", sarvamStt: true, sarvamTts: false },
  { value: "Manipuri", label: "Manipuri", code: "mni-IN", sarvamStt: true, sarvamTts: false },
  { value: "Bodo", label: "Bodo", code: "brx-IN", sarvamStt: true, sarvamTts: false },
  { value: "Maithili", label: "Maithili", code: "mai-IN", sarvamStt: true, sarvamTts: false },
  { value: "Dogri", label: "Dogri", code: "doi-IN", sarvamStt: true, sarvamTts: false },
  { value: "Spanish", label: "Spanish", code: "es-ES", sarvamStt: false, sarvamTts: false },
  { value: "French", label: "French", code: "fr-FR", sarvamStt: false, sarvamTts: false },
];

const fallbackSarvamV3Voices = [
  "shubh",
  "aditya",
  "ritu",
  "priya",
  "neha",
  "rahul",
  "pooja",
  "rohan",
  "simran",
  "kavya",
  "amit",
  "dev",
  "ishita",
  "shreya",
  "ratan",
  "varun",
  "manan",
  "sumit",
  "roopa",
  "kabir",
  "aayan",
  "ashutosh",
  "advait",
  "amelia",
  "sophia",
  "anand",
  "tanya",
  "tarun",
  "sunny",
  "mani",
  "gokul",
  "vijay",
  "shruti",
  "suhani",
  "mohit",
  "kavitha",
  "rehan",
  "soham",
  "rupali",
];

const fallbackSarvamV2Voices = [
  "anushka",
  "manisha",
  "vidya",
  "arya",
  "abhilash",
  "karun",
  "hitesh",
];

const fallbackSarvamVoices = [...fallbackSarvamV3Voices, ...fallbackSarvamV2Voices];
const fallbackElevenLabsVoices = [
  "bIHbv24MWmeRgasZH58o",
];
const defaultGeminiRealtimeModel = "gemini-2.5-flash-native-audio-preview-12-2025";

function normalizeRealtimeModel(provider: RealtimeProvider, model: string) {
  if (provider !== "gemini") return model;
  return model === defaultGeminiRealtimeModel ? model : defaultGeminiRealtimeModel;
}

function voicesByLanguage(
  languages: readonly VoiceLanguageOption[],
  voices: readonly string[],
) {
  return Object.fromEntries(
    languages.flatMap((language) => [
      [language.value, voices],
      [language.label, voices],
      [language.code, voices],
    ]),
  );
}

const fallbackCatalog: ModelCatalog = {
  realtime: [
    { provider: "openai", label: "OpenAI Realtime", configured: true, models: ["gpt-realtime"], voices: ["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse", "marin", "cedar"] },
    { provider: "gemini", label: "Gemini Live", configured: true, models: [defaultGeminiRealtimeModel], voices: ["Aoede"] },
  ],
  llm: [
    { provider: "openai", label: "OpenAI", configured: true, models: ["gpt-4.1-mini"] },
    { provider: "gemini", label: "Gemini", configured: true, models: ["gemini-2.5-flash"] },
    { provider: "sarvam", label: "Sarvam", configured: true, models: ["sarvam-30b"] },
  ],
  stt: [
    { provider: "openai", label: "OpenAI", configured: true, models: ["gpt-4o-mini-transcribe"] },
    {
      provider: "sarvam",
      label: "Sarvam",
      configured: true,
      models: ["saaras:v3"],
      languages: fallbackLanguageCatalog.filter((language) => language.sarvamStt),
    },
    {
      provider: "elevenlabs",
      label: "ElevenLabs",
      configured: true,
      models: ["scribe_v2_realtime", "scribe_v2", "scribe_v1"],
      languages: fallbackLanguageCatalog,
    },
  ],
  tts: [
    { provider: "openai", label: "OpenAI", configured: true, models: ["gpt-4o-mini-tts"], voices: ["alloy"] },
    { provider: "gemini", label: "Gemini", configured: true, models: ["gemini-2.5-flash-tts"], voices: ["Aoede"] },
    {
      provider: "sarvam",
      label: "Sarvam",
      configured: true,
      models: ["bulbul:v3"],
      voices: fallbackSarvamVoices,
      languages: fallbackLanguageCatalog.filter((language) => language.sarvamTts),
      voicesByLanguage: voicesByLanguage(
        fallbackLanguageCatalog.filter((language) => language.sarvamTts),
        fallbackSarvamVoices,
      ),
      voicesByModel: {
        "bulbul:v3": fallbackSarvamV3Voices,
        "bulbul:v2": fallbackSarvamV2Voices,
      },
    },
    {
      provider: "elevenlabs",
      label: "ElevenLabs",
      configured: true,
      models: ["eleven_multilingual_v2", "eleven_flash_v2_5", "eleven_turbo_v2_5"],
      voices: fallbackElevenLabsVoices,
      languages: fallbackLanguageCatalog.filter((language) => language.code !== "unknown"),
      voicesByLanguage: voicesByLanguage(
        fallbackLanguageCatalog.filter((language) => language.code !== "unknown"),
        fallbackElevenLabsVoices,
      ),
    },
  ],
};

function getProvider(catalog: ModelCatalog, layer: keyof ModelCatalog, provider: string) {
  return catalog[layer].find((item) => item.provider === provider) ?? catalog[layer][0];
}

function languageKeys(language: string, languageCatalog: readonly VoiceLanguageOption[]) {
  const normalized = language.trim().toLowerCase();
  const matched = languageCatalog.find((item) =>
    [item.value, item.label, item.code].some((candidate) => candidate.toLowerCase() === normalized),
  );
  return [...new Set([language, matched?.value, matched?.label, matched?.code].filter(Boolean) as string[])];
}

function getVoices(
  catalog: ModelCatalog,
  layer: "realtime" | "tts",
  provider: string,
  model: string,
  language = "",
  languageCatalog: readonly VoiceLanguageOption[] = [],
) {
  const item = getProvider(catalog, layer, provider);
  const modelVoices = item.voicesByModel?.[model] ?? item.voices ?? [];
  const languageVoices = language
    ? languageKeys(language, languageCatalog)
        .map((key) => item.voicesByLanguage?.[key])
        .find((voices) => voices && voices.length)
    : undefined;

  if (languageVoices?.length && modelVoices.length) {
    const allowed = new Set(languageVoices);
    const filtered = modelVoices.filter((voice) => allowed.has(voice));
    return filtered.length ? filtered : [...languageVoices];
  }

  return languageVoices ? [...languageVoices] : [...modelVoices];
}

type SelectOption = string | { value: string; label: string };

function getSelectOptionValue(option: SelectOption) {
  return typeof option === "string" ? option : option.value;
}

function getSelectOptionLabel(option: SelectOption) {
  return typeof option === "string" ? option : option.label;
}

function getOptionLabel(options: SelectOption[], value: string) {
  return getSelectOptionLabel(options.find((option) => getSelectOptionValue(option) === value) ?? value);
}

function formatCompactDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0s";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = seconds / 60;
  return `${minutes % 1 === 0 ? minutes.toFixed(0) : minutes.toFixed(1)}m`;
}

const voiceLabels: Record<string, string> = {
  bIHbv24MWmeRgasZH58o: "Will - ElevenLabs default",
  "21m00Tcm4TlvDq8ikWAM": "Rachel - female",
  EXAVITQu4vr4xnSDxMaL: "Bella - female",
  MF3mGyEYCl7XYWbV9V6O: "Elli - female",
  pNInz6obpgDQGcFmaJgB: "Adam - male",
  ErXwobaYiN019PkySvjV: "Antoni - male",
  TxGEqnHWrfWFTfGW9XjX: "Josh - male",
};

function voiceSelectOptions(voices: readonly string[]): SelectOption[] {
  return voices.map((voice) => ({
    value: voice,
    label: voiceLabels[voice] ? `${voiceLabels[voice]} (${voice})` : voice,
  }));
}

function coerceLanguage(
  language: string,
  options: readonly VoiceLanguageOption[],
  fallback = "English",
) {
  return options.some((option) => option.value === language) ? language : options[0]?.value ?? fallback;
}

function coerceVoice(voice: string, options: readonly string[], fallback = "alloy") {
  return options.includes(voice) ? voice : options[0] ?? fallback;
}

function getLanguageOptions(
  catalog: ModelCatalog,
  agent: VoiceAgent,
  languageCatalog: VoiceLanguageOption[],
): SelectOption[] {
  let options = languageCatalog;
  if (agent.pipelineMode === "pipeline") {
    const ttsLanguages = getProvider(catalog, "tts", agent.ttsProvider).languages;
    const sttLanguages = getProvider(catalog, "stt", agent.sttProvider).languages;
    if (ttsLanguages?.length) {
      options = [...ttsLanguages];
    } else if (sttLanguages?.length) {
      options = [...sttLanguages];
    }
  }

  const mapped = options.map((language) => ({
    value: language.value,
    label: language.code === "unknown" ? language.label : `${language.label} (${language.code})`,
  }));
  return mapped.some((option) => option.value === agent.language)
    ? mapped
    : [{ value: agent.language, label: agent.language }, ...mapped];
}

const tabs: { id: AgentTab; label: string }[] = [
  { id: "builder", label: "Builder" },
  { id: "behavior", label: "Behavior" },
  { id: "tools", label: "Tools" },
  { id: "calls", label: "Calls" },
  { id: "widget", label: "Widget" },
];

function dispatchLabel(state: AgentRuntimeSnapshot["dispatch"]["state"] | undefined) {
  if (!state) return "Connecting";
  return state.charAt(0).toUpperCase() + state.slice(1);
}

function dispatchTone(state: AgentRuntimeSnapshot["dispatch"]["state"] | undefined) {
  if (state === "running") return "text-[#059669]";
  if (state === "failed" || state === "missing") return "text-[#dc2626]";
  if (state === "pending" || state === "waiting") return "text-[#d97706]";
  return "text-[#64748b]";
}

function dispatchBadge(state: AgentRuntimeSnapshot["dispatch"]["state"] | undefined) {
  if (state === "running") return "bg-[#dcfce7] text-[#047857]";
  if (state === "failed" || state === "missing") return "bg-[#fee2e2] text-[#b91c1c]";
  if (state === "pending" || state === "waiting") return "bg-[#fef3c7] text-[#b45309]";
  return "bg-[#e2e8f0] text-[#475569]";
}

function formatLiveKitRegion(region: string) {
  if (!region) return "Connect to detect";
  return region
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.length <= 3 ? part.toUpperCase() : `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

const flowSettings = [
  {
    field: "interruptions",
    title: "Interruptions",
    detail: "Allow callers to interrupt and keep the interruption message.",
  },
  {
    field: "userStartsFirst",
    title: "User starts first",
    detail: "Wait for caller speech before the agent opens.",
  },
  {
    field: "autoFillResponses",
    title: "Auto fill responses",
    detail: "Send short filler phrases when response generation is slow.",
  },
  {
    field: "agentCanTerminate",
    title: "Agent terminate call",
    detail: "Let the agent end a call after completion or repeated silence.",
  },
  {
    field: "voicemailHandling",
    title: "Voicemail handling",
    detail: "Leave a configured voicemail and continue on voice activity.",
  },
  {
    field: "dtmfDial",
    title: "DTMF dial",
    detail: "Allow keypad dialing instructions for IVR navigation.",
  },
] satisfies { field: keyof AgentBehavior; title: string; detail: string }[];

const firstMessageModeOptions: SelectOption[] = [
  { value: "assistant-speaks-first", label: "Assistant speaks first" },
  { value: "user-speaks-first", label: "User speaks first" },
  { value: "model-generated", label: "Model generated" },
];

const endpointingModeOptions: SelectOption[] = [
  { value: "fast", label: "Fast" },
  { value: "balanced", label: "Balanced" },
  { value: "patient", label: "Patient" },
];

const voicemailActionOptions: SelectOption[] = [
  { value: "leave-message", label: "Leave message" },
  { value: "hangup", label: "Hang up" },
];

const deployChecklist = [
  "Prompt and first message ready",
  "Voice, STT, and LLM selected",
  "Tools have params and webhook URLs",
  "Knowledge files attached",
  "Phone route assigned",
  "Privacy and recording reviewed",
];

const commonTimezoneOptions: SelectOption[] = [
  { value: "UTC", label: "UTC" },
  { value: "Asia/Kolkata", label: "IST - India (Asia/Kolkata)" },
  { value: "America/New_York", label: "Eastern Time (America/New_York)" },
  { value: "America/Chicago", label: "Central Time (America/Chicago)" },
  { value: "America/Denver", label: "Mountain Time (America/Denver)" },
  { value: "America/Los_Angeles", label: "Pacific Time (America/Los_Angeles)" },
  { value: "Europe/London", label: "UK (Europe/London)" },
  { value: "Europe/Berlin", label: "Central Europe (Europe/Berlin)" },
  { value: "Asia/Dubai", label: "Gulf (Asia/Dubai)" },
  { value: "Asia/Singapore", label: "Singapore (Asia/Singapore)" },
  { value: "Australia/Sydney", label: "Sydney (Australia/Sydney)" },
];

const systemDynamicVariables = [
  "FromPhone",
  "ToPhone",
  "CallId",
  "SessionId",
  "AgentName",
  "CallDirection",
  "CurrentDate",
  "CurrentISODate",
  "CurrentTime",
  "CurrentHour",
  "CurrentDay",
  "CurrentMonth",
  "CurrentYear",
  "CurrentDateTime",
  "Timezone",
  "now",
  "date",
  "iso_date",
  "time",
  "current_hour",
  "day",
  "month",
  "year",
  "timezone",
  "current_time",
  "current_calendar",
];

const dateTimeVariableExamples = [
  "{{date}}",
  "{{time}}",
  "{{now}}",
  "{{current_time}}",
  "{{current_hour}}",
  "{{current_calendar}}",
  "{{current_time_Asia/Kolkata}}",
  "{{current_calendar_America/Los_Angeles}}",
  "{CurrentTime_Asia_Kolkata}",
];

const toolMethodOptions: AgentTool["method"][] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const toolParameterTypeOptions: AgentToolParameter["type"][] = ["string", "number", "boolean", "object"];
const toolNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{1,79}$/;
const keyNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{0,79}$/;
const headerNamePattern = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

type HeaderDraft = { name: string; value: string };

function createEmptyToolDraft(): AgentTool {
  return {
    name: "",
    description: "",
    method: "POST",
    url: "",
    headers: {},
    timeoutSeconds: 8,
    enabled: true,
    parameters: [],
    runAfterCall: false,
    executeAfterMessage: false,
    excludeSessionId: true,
    messages: ["Let me check that for you."],
  };
}

function createEmptyToolParameter(name = "param_1"): AgentToolParameter {
  return {
    name,
    type: "string",
    description: "",
    required: true,
  };
}

function nextParameterName(parameters: readonly AgentToolParameter[] = []) {
  let index = parameters.length + 1;
  while (parameters.some((parameter) => parameter.name === `param_${index}`)) {
    index += 1;
  }
  return `param_${index}`;
}

function headersToDrafts(headers: Record<string, string> = {}): HeaderDraft[] {
  return Object.entries(headers).map(([name, value]) => ({ name, value }));
}

function draftsToHeaders(drafts: readonly HeaderDraft[], keepIncomplete = false) {
  return Object.fromEntries(
    drafts
      .map((header) => [header.name.trim(), header.value.trim()] as const)
      .filter(([name, value]) => keepIncomplete ? name || value : name && value),
  );
}

function isHttpUrl(value: string) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function sampleValueForParameter(parameter: AgentToolParameter) {
  if (parameter.type === "number") return 123;
  if (parameter.type === "boolean") return true;
  if (parameter.type === "object") return { sample: true };
  return `sample_${parameter.name || "value"}`;
}

function sampleArgsForTool(tool: AgentTool) {
  return Object.fromEntries(
    (tool.parameters ?? [])
      .filter((parameter) => keyNamePattern.test(parameter.name))
      .map((parameter) => [parameter.name, sampleValueForParameter(parameter)]),
  );
}

function normalizeTool(tool: AgentTool): AgentTool {
  return {
    ...tool,
    name: tool.name.trim(),
    description: tool.description.trim(),
    url: tool.url.trim(),
    headers: draftsToHeaders(headersToDrafts(tool.headers)),
    timeoutSeconds: Math.min(30, Math.max(1, Number(tool.timeoutSeconds) || 8)),
    enabled: tool.enabled !== false,
    parameters: (tool.parameters ?? []).map((parameter) => ({
      ...parameter,
      name: parameter.name.trim(),
      description: parameter.description.trim(),
      type: toolParameterTypeOptions.includes(parameter.type) ? parameter.type : "string",
      required: parameter.required === true,
    })),
    runAfterCall: tool.runAfterCall === true,
    executeAfterMessage: tool.executeAfterMessage === true,
    excludeSessionId: tool.excludeSessionId !== false,
    messages: (tool.messages ?? []).map((message) => message.trim()).filter(Boolean).slice(0, 5),
  };
}

function createWidgetPublicKey() {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replace(/-/g, "")
    : Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  return `wpk_${random}`;
}

function getTimezoneOptions(timezone: string): SelectOption[] {
  const selected = timezone || "UTC";
  return commonTimezoneOptions.some((option) => getSelectOptionValue(option) === selected)
    ? commonTimezoneOptions
    : [{ value: selected, label: `Custom (${selected})` }, ...commonTimezoneOptions];
}

type IconName =
  | "agent"
  | "plus"
  | "save"
  | "phone"
  | "play"
  | "route"
  | "tool"
  | "book"
  | "shield"
  | "code"
  | "copy"
  | "widget";

function Icon({ icon }: { icon: IconName }) {
  const iconClass = "size-4 fill-none stroke-current stroke-2";

  if (icon === "plus") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  if (icon === "save") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 3h12l2 2v16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M8 3v6h8V3M8 21v-7h8v7" />
      </svg>
    );
  }

  if (icon === "phone") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.6 4.8 9 7.2a2 2 0 0 1 .4 2.2l-.8 1.7a12 12 0 0 0 5.3 5.3l1.7-.8a2 2 0 0 1 2.2.4l2.4 2.4a1.8 1.8 0 0 1-.2 2.7c-1 .7-2.2 1-3.6.8C9.4 20.7 3.3 14.6 2.1 7.6 1.9 6.2 2.2 5 2.9 4a1.8 1.8 0 0 1 2.7-.2Z" />
      </svg>
    );
  }

  if (icon === "play") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8 5 11 7L8 19V5Z" />
      </svg>
    );
  }

  if (icon === "route") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 5a3 3 0 1 0 0 6h12a3 3 0 1 1 0 6H8" />
        <path d="M8 15 5 18l3 3" />
      </svg>
    );
  }

  if (icon === "tool") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.7 6.3a4 4 0 0 0-5 5L4 17v3h3l5.7-5.7a4 4 0 0 0 5-5l-2.5 2.5-3-3 2.5-2.5Z" />
      </svg>
    );
  }

  if (icon === "book") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V5a1 1 0 0 1 1-1Z" />
        <path d="M7 17h12M8 8h7M8 12h5" />
      </svg>
    );
  }

  if (icon === "shield") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 5 6v5c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  }

  if (icon === "code") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
      </svg>
    );
  }

  if (icon === "copy") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 8h10v12H8z" />
        <path d="M6 16H4V4h12v2" />
      </svg>
    );
  }

  if (icon === "widget") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5h14v10H5z" />
        <path d="M8 19h8M12 15v4" />
        <path d="M9 10h.01M12 10h.01M15 10h.01" />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 10h10a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3Z" />
      <path d="M12 10V6M9 6h6M8.5 15h.01M15.5 15h.01" />
    </svg>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusTone(status: AgentStatus) {
  if (status === "Live") {
    return {
      dot: "bg-[#059669]",
      badge: "bg-[#ecfdf5] text-[#047857]",
      text: "text-[#059669]",
    };
  }

  if (status === "Draft") {
    return {
      dot: "bg-[#d97706]",
      badge: "bg-[#fff7ed] text-[#c2410c]",
      text: "text-[#d97706]",
    };
  }

  return {
    dot: "bg-[#64748b]",
    badge: "bg-[#f1f5f9] text-[#475569]",
    text: "text-[#64748b]",
  };
}

function formatLatency(metrics: BackendAgent["latencyMetrics"]) {
  const latestMs = metrics?.latestMs;
  if (typeof latestMs !== "number" || !Number.isFinite(latestMs)) {
    return "No data";
  }
  return `${Math.round(latestMs)}ms`;
}

function ToggleRow({
  title,
  detail,
  enabled,
  onChange,
}: {
  title: string;
  detail: string;
  enabled: boolean;
  onChange?: (enabled: boolean) => void;
}) {
  return (
    <label className="group grid cursor-pointer grid-cols-[minmax(0,1fr)_44px] items-start gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3 transition hover:border-[#c7d2fe] hover:bg-[#f8fbff]">
      <span className="min-w-0">
        <span className="app-strong block">{title}</span>
        <span className="app-caption block">{detail}</span>
      </span>
      <input
        className="sr-only"
        type="checkbox"
        checked={enabled}
        onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
      />
      <span
        aria-hidden="true"
        className={`relative mt-0.5 h-6 w-11 rounded-full transition ${
          enabled ? "bg-[#2563eb]" : "bg-[#cbd5e1]"
        }`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </span>
    </label>
  );
}

function BehaviorPanel({
  title,
  detail,
  icon,
  children,
}: {
  title: string;
  detail: string;
  icon: IconName;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#dfe3ea] bg-white">
      <div className="flex items-start justify-between gap-3 border-b border-[#edf0f5] bg-[#f8fafc] px-4 py-3">
        <div className="min-w-0">
          <h3 className="app-section-title m-0">{title}</h3>
          <span className="app-caption">{detail}</span>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-[#2563eb] shadow-sm">
          <Icon icon={icon} />
        </span>
      </div>
      <div className="grid gap-4 p-4">{children}</div>
    </section>
  );
}

function BehaviorMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "green" | "amber" | "slate";
}) {
  const toneClass = {
    blue: "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]",
    green: "border-[#bbf7d0] bg-[#ecfdf5] text-[#047857]",
    amber: "border-[#fde68a] bg-[#fffbeb] text-[#b45309]",
    slate: "border-[#e2e8f0] bg-[#f8fafc] text-[#334155]",
  }[tone];

  return (
    <div className={`rounded-lg border px-3 py-2.5 ${toneClass}`}>
      <span className="app-label block opacity-80">{label}</span>
      <strong className="app-strong mt-0.5 block truncate text-current">{value}</strong>
    </div>
  );
}

function SelectField({
  label,
  defaultValue,
  options,
  value,
  onChange,
}: {
  label: string;
  defaultValue: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="app-label grid gap-2">
      <span>{label}</span>
      <select
        className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] bg-white px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
        {...(value === undefined ? { defaultValue } : { value })}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      >
        {options.map((option) => (
          <option key={getSelectOptionValue(option)} value={getSelectOptionValue(option)}>
            {getSelectOptionLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function VoiceSelectField({
  label,
  options,
  value,
  onChange,
  onPreview,
  previewing,
}: {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  onPreview: () => void;
  previewing: boolean;
}) {
  const displayedOptions = options.some((option) => getSelectOptionValue(option) === value)
    ? options
    : [value, ...options].filter(Boolean);

  return (
    <label className="app-label grid gap-2">
      <span>{label}</span>
      <span className="grid grid-cols-[minmax(0,1fr)_40px] gap-2">
        <select
          className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] bg-white px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {displayedOptions.map((option) => (
            <option key={getSelectOptionValue(option)} value={getSelectOptionValue(option)}>
              {getSelectOptionLabel(option)}
            </option>
          ))}
        </select>
        <button
          aria-label={`Preview ${value} voice`}
          className="grid size-10 place-items-center rounded-lg border border-[#c7d2fe] bg-white text-[#2563eb] transition hover:bg-[#eef2ff] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={previewing || options.length === 0}
          title={previewing ? "Loading voice preview" : "Preview voice"}
          type="button"
          onClick={onPreview}
        >
          <Icon icon="play" />
        </button>
      </span>
    </label>
  );
}

function InputField({
  label,
  defaultValue,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="app-label grid gap-2">
      <span>{label}</span>
      <input
        className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] bg-white px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
        {...(value === undefined ? { defaultValue } : { value })}
        placeholder={placeholder}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      />
    </label>
  );
}

function ToolParameterEditor({
  parameter,
  onChange,
  onRemove,
}: {
  parameter: AgentToolParameter;
  onChange: (changes: Partial<AgentToolParameter>) => void;
  onRemove: () => void;
}) {
  return (
    <article className="grid gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3 lg:grid-cols-[minmax(0,1fr)_150px_118px_88px]">
      <InputField label="Name" value={parameter.name} placeholder="email" onChange={(name) => onChange({ name })} />
      <SelectField
        label="Type"
        defaultValue="string"
        value={parameter.type}
        options={toolParameterTypeOptions}
        onChange={(type) => onChange({ type: type as AgentToolParameter["type"] })}
      />
      <label className="app-label flex min-h-10 items-center gap-2 self-end rounded-lg border border-[#e5e7eb] bg-[#f8fafc] px-3">
        <input
          className="size-4 accent-[#2563eb]"
          type="checkbox"
          checked={parameter.required}
          onChange={(event) => onChange({ required: event.target.checked })}
        />
        Required
      </label>
      <button
        className="app-button-text min-h-10 self-end rounded-lg border border-rose-200 bg-white px-3 text-rose-600 transition hover:bg-rose-50"
        type="button"
        onClick={onRemove}
      >
        Remove
      </button>
      <label className="app-label grid gap-2 lg:col-span-4">
        <span>Description</span>
        <input
          className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] bg-white px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
          value={parameter.description}
          placeholder="What value should the agent collect before calling this tool?"
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </label>
    </article>
  );
}

function HeaderEditor({
  header,
  onChange,
  onRemove,
}: {
  header: HeaderDraft;
  onChange: (changes: Partial<HeaderDraft>) => void;
  onRemove: () => void;
}) {
  return (
    <article className="grid gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_88px]">
      <InputField label="Header" value={header.name} placeholder="Authorization" onChange={(name) => onChange({ name })} />
      <InputField label="Value" value={header.value} placeholder="Bearer token" onChange={(value) => onChange({ value })} />
      <button
        className="app-button-text min-h-10 self-end rounded-lg border border-rose-200 bg-white px-3 text-rose-600 transition hover:bg-rose-50"
        type="button"
        onClick={onRemove}
      >
        Remove
      </button>
    </article>
  );
}

export function DashboardShell() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );
  const [agentList, setAgentList] = useState(agents);
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0].id);
  const [activeTab, setActiveTab] = useState<AgentTab>("builder");
  const [notice, setNotice] = useState("");
  const [showTestCall, setShowTestCall] = useState(false);
  const [modelCatalog, setModelCatalog] = useState<ModelCatalog>(fallbackCatalog);
  const [languageCatalog, setLanguageCatalog] = useState<VoiceLanguageOption[]>(fallbackLanguageCatalog);
  const [voiceConfig, setVoiceConfig] = useState<DashboardVoiceConfig | null>(null);
  const [agentTemplates, setAgentTemplates] = useState<AgentTemplate[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallRecord[]>([]);
  const [toolDraft, setToolDraft] = useState<AgentTool>(() => createEmptyToolDraft());
  const [variableDraft, setVariableDraft] = useState("");
  const [previewingVoice, setPreviewingVoice] = useState("");
  const [testingToolKey, setTestingToolKey] = useState("");
  const [runtimeRegions, setRuntimeRegions] = useState<Record<string, string>>({});
  const [runtimeSnapshot, setRuntimeSnapshot] = useState<AgentRuntimeSnapshot | null>(null);
  const [runtimeStreamState, setRuntimeStreamState] = useState<"connecting" | "live" | "reconnecting">("connecting");
  const [appOrigin, setAppOrigin] = useState("http://localhost:3000");
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewUrlRef = useRef("");
  const unsavedChangesRef = useRef(false);

  const selectedAgent = useMemo(
    () => agentList.find((agent) => agent.id === selectedAgentId) ?? agentList[0] ?? agents[0],
    [agentList, selectedAgentId],
  );
  const languageOptions = getLanguageOptions(modelCatalog, selectedAgent, languageCatalog);
  const selectedSchedule = selectedAgent.businessHours.schedule.length
    ? selectedAgent.businessHours.schedule
    : defaultBusinessHours.schedule;
  const selectedTone = getStatusTone(selectedAgent.status);
  const selectedRuntimeSnapshot = runtimeSnapshot?.agentId === selectedAgent.id ? runtimeSnapshot : null;
  const selectedRuntimeStreamState = selectedRuntimeSnapshot ? runtimeStreamState : "connecting";
  const selectedRuntimeRegion = selectedRuntimeSnapshot?.region || runtimeRegions[selectedAgent.id] || "";
  const selectedRuntimeItems = [
    {
      label: "Dispatch",
      value: dispatchLabel(selectedRuntimeSnapshot?.dispatch.state),
      tone: dispatchTone(selectedRuntimeSnapshot?.dispatch.state),
    },
    {
      label: "Model",
      value: selectedRuntimeSnapshot?.pipeline.label ?? (selectedAgent.pipelineMode === "realtime"
        ? `${selectedAgent.realtimeProvider}/${selectedAgent.realtimeModel}`
        : `${selectedAgent.sttProvider} → ${selectedAgent.llmProvider} → ${selectedAgent.ttsProvider}`),
      tone: "text-[#2563eb]",
    },
    {
      label: "Region",
      value: selectedRuntimeRegion ? formatLiveKitRegion(selectedRuntimeRegion) : "No active room",
      tone: selectedRuntimeRegion ? "text-[#111827]" : "text-[#64748b]",
    },
  ];
  const phoneAssigned = Boolean(selectedAgent.phone && selectedAgent.phone !== "Not assigned");
  const liveCallsEnabled = selectedAgent.status === "Live";
  const testCallsEnabled = selectedAgent.status !== "Paused" && selectedAgent.id !== "loading";
  const inboundReady = Boolean(
    selectedRuntimeSnapshot?.phoneRoute.inboundReady
      ?? (phoneAssigned && voiceConfig?.sip.inboundConfigured && voiceConfig?.sip.inboundDestinationConfigured),
  );
  const outboundReady = Boolean(
    selectedRuntimeSnapshot?.phoneRoute.outboundReady
      ?? (phoneAssigned && voiceConfig?.sip.outboundConfigured && voiceConfig?.vobiz.configured),
  );
  const browserTestReady = testCallsEnabled && Boolean(voiceConfig?.agentName);
  const hoursGuardLabel = !selectedAgent.businessHoursEnabled
    ? "Off"
    : selectedRuntimeSnapshot
      ? selectedRuntimeSnapshot.businessHours.open ? "Open" : "Closed"
      : "Checking";
  const callReadiness = [
    {
      label: "Browser test",
      ready: browserTestReady,
      value: browserTestReady ? "Ready" : selectedAgent.status === "Paused" ? "Paused" : "Needs agent",
    },
    {
      label: "Inbound calls",
      ready: liveCallsEnabled && inboundReady,
      value: !liveCallsEnabled ? "Disabled" : inboundReady ? "Ready" : "Needs route",
    },
    {
      label: "Outbound calls",
      ready: liveCallsEnabled && outboundReady,
      value: !liveCallsEnabled ? "Disabled" : outboundReady ? "Ready" : "Needs route",
    },
    {
      label: "Hours guard",
      ready: !selectedAgent.businessHoursEnabled || hoursGuardLabel === "Open",
      value: hoursGuardLabel,
    },
  ];
  const behaviorMetrics = [
    {
      label: "Opening",
      value: getOptionLabel(firstMessageModeOptions, selectedAgent.firstMessageMode),
      tone: "blue" as const,
    },
    {
      label: "Endpointing",
      value: getOptionLabel(endpointingModeOptions, selectedAgent.behavior.endpointingMode),
      tone: "green" as const,
    },
    {
      label: "Idle limit",
      value: formatCompactDuration(selectedAgent.behavior.maxIdleSeconds),
      tone: "amber" as const,
    },
    {
      label: "Call cap",
      value: formatCompactDuration(selectedAgent.behavior.maxCallDurationSeconds),
      tone: "slate" as const,
    },
  ];
  const widgetUrl = `${appOrigin}/agents/embedded?id=${selectedAgent.id}&k=${selectedAgent.widget.publicKey || "not-configured"}&position=inline`;
  const widgetEmbedCode = `<div id="voice-agent-widget"></div>
<script
  src="${appOrigin}/widget.js"
  data-agent-id="${selectedAgent.id}"
  data-public-key="${selectedAgent.widget.publicKey}"
  data-theme="${selectedAgent.widget.theme}"
  data-position="${selectedAgent.widget.position}"
  data-accent="${selectedAgent.widget.accentColor}"
  data-metadata="${selectedAgent.dynamicVariables.join(",")}"
></script>`;

  useEffect(() => {
    setAppOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    return () => {
      previewAudioRef.current?.pause();
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard");
      return;
    }

    const applyBackendAgents = (backendAgents: BackendAgent[]) => {
      const mapped = backendAgents.map(mapBackendAgent);
      setAgentList(mapped);
      setSelectedAgentId((current) =>
        mapped.some((agent) => agent.id === current) ? current : mapped[0]?.id ?? current,
      );
    };

    const refreshAgents = async () => {
      if (
        cancelled ||
        unsavedChangesRef.current ||
        document.visibilityState !== "visible"
      ) {
        return;
      }
      const { agents: backendAgents } = await voiceApi.agents();
      if (cancelled || unsavedChangesRef.current) return;
      applyBackendAgents(backendAgents);
    };

    let cancelled = false;

    void (async () => {
      const validatedSession = await validateStoredSession();
      if (!validatedSession) {
        if (!cancelled) router.replace("/login?next=/dashboard");
        return;
      }
      if (
        validatedSession.id !== session.id ||
        validatedSession.organization?.id !== session.organization?.id
      ) {
        return;
      }

      const [{ agents: backendAgents }, config, templateResult] = await Promise.all([
        voiceApi.agents(),
        voiceApi.config(),
        voiceApi.agentTemplates(),
      ]);
      if (cancelled) return;
      applyBackendAgents(backendAgents);
      setVoiceConfig(config);
      setModelCatalog(config.modelCatalog);
      setLanguageCatalog(config.languageCatalog ?? fallbackLanguageCatalog);
      setAgentTemplates(templateResult.templates);
    })()
      .catch((error) => {
        if (cancelled) return;
        setNotice(error instanceof Error ? error.message : "Could not load agents.");
      });

    const refreshTimer = window.setInterval(() => {
      void refreshAgents().catch(() => undefined);
    }, 60000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, [router, session]);

  useEffect(() => {
    if (!session || !selectedAgentId || selectedAgentId === "loading" || selectedAgentId === "maya") {
      return;
    }

    const stream = voiceApi.agentRuntimeStream(selectedAgentId);

    const handleRuntime = (event: Event) => {
      try {
        const snapshot = JSON.parse((event as MessageEvent<string>).data) as AgentRuntimeSnapshot;
        setRuntimeSnapshot(snapshot);
        setRuntimeStreamState("live");
        if (snapshot.region) {
          setRuntimeRegions((current) => ({ ...current, [snapshot.agentId]: snapshot.region }));
        }
      } catch {
        setRuntimeStreamState("reconnecting");
      }
    };

    stream.addEventListener("runtime", handleRuntime);
    stream.onopen = () => setRuntimeStreamState("live");
    stream.onerror = () => setRuntimeStreamState("reconnecting");

    return () => {
      stream.removeEventListener("runtime", handleRuntime);
      stream.close();
    };
  }, [selectedAgentId, session]);

  useEffect(() => {
    if (!session || activeTab !== "calls" || !selectedAgentId || selectedAgentId === "loading" || selectedAgentId === "maya") return;
    void voiceApi
      .calls({ agentId: selectedAgentId, limit: 5 })
      .then((result) => setRecentCalls(result.calls))
      .catch(() => setRecentCalls([]));
  }, [activeTab, selectedAgentId, session]);

  async function handleSyncPhoneRoutes() {
    try {
      setNotice("Syncing phone routes...");
      const response = await voiceApi.syncPhoneNumbers();
      const [{ agents: backendAgents }, config] = await Promise.all([
        voiceApi.agents(),
        voiceApi.config(),
      ]);
      setAgentList(backendAgents.map(mapBackendAgent));
      setVoiceConfig(config);
      setNotice(
        `Synced ${response.vobiz.total} Vobiz numbers, checked ${response.routes.total} routes, repaired ${response.routes.repaired}, needs setup ${response.routes.needsSetup}.`,
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not sync phone routes.");
    }
  }

  async function handleSave(changes: Partial<BackendAgent> = {}) {
    try {
      const { agent } = await voiceApi.saveAgent(selectedAgent.id, {
        name: selectedAgent.name,
        team: selectedAgent.team,
        status: selectedAgent.status,
        phone: selectedAgent.phone,
        language: selectedAgent.language,
        voice: selectedAgent.voice,
        pipelineMode: selectedAgent.pipelineMode,
        realtimeProvider: selectedAgent.realtimeProvider,
        realtimeModel: selectedAgent.realtimeModel,
        llmProvider: selectedAgent.llmProvider,
        llmModel: selectedAgent.llmModel,
        sttProvider: selectedAgent.sttProvider,
        sttModel: selectedAgent.sttModel,
        ttsProvider: selectedAgent.ttsProvider,
        ttsModel: selectedAgent.ttsModel,
        temperature: selectedAgent.temperature,
        maxConcurrentCalls: selectedAgent.maxConcurrentCalls,
        voiceSpeed: selectedAgent.voiceSpeed,
        voicePitch: selectedAgent.voicePitch,
        interruptionSensitivity: selectedAgent.interruptionSensitivity,
        backgroundNoise: selectedAgent.backgroundNoise,
        callbackEmail: selectedAgent.callbackEmail,
        businessHoursEnabled: selectedAgent.businessHoursEnabled,
        businessHours: selectedAgent.businessHours,
        prompt: selectedAgent.prompt,
        firstMessage: selectedAgent.firstMessage,
        firstMessageMode: selectedAgent.firstMessageMode,
        behavior: selectedAgent.behavior,
        callSettings: selectedAgent.callSettings,
        tools: selectedAgent.tools.map(normalizeTool),
        knowledgeDocuments: selectedAgent.knowledgeDocuments,
        dynamicVariables: selectedAgent.dynamicVariables,
        prefetchWebhook: selectedAgent.prefetchWebhook,
        endOfCallWebhook: selectedAgent.endOfCallWebhook,
        widget: selectedAgent.widget,
        ...changes,
      });
      const mapped = mapBackendAgent(agent);
      setAgentList((current) => current.map((item) => (item.id === mapped.id ? mapped : item)));
      unsavedChangesRef.current = false;
      setNotice("Agent saved to the backend.");
      return true;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save agent.");
      return false;
    }
  }

  async function handlePreviewVoice(input: Pick<VoicePreviewRequest, "mode" | "provider" | "model">) {
    const request: VoicePreviewRequest = {
      ...input,
      voice: selectedAgent.voice,
      language: selectedAgent.language,
      text: selectedAgent.firstMessage,
      voiceSpeed: selectedAgent.voiceSpeed,
    };
    const key = [
      selectedAgent.id,
      request.mode,
      request.provider,
      request.model,
      request.voice,
      request.language,
      request.voiceSpeed,
    ].join(":");
    setPreviewingVoice(key);
    setNotice("");
    try {
      const blob = await voiceApi.voicePreview(request);
      previewAudioRef.current?.pause();
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      previewUrlRef.current = url;
      previewAudioRef.current = audio;
      audio.addEventListener("ended", () => {
        if (previewUrlRef.current === url) {
          URL.revokeObjectURL(url);
          previewUrlRef.current = "";
        }
      }, { once: true });
      audio.addEventListener("error", () => {
        if (previewUrlRef.current === url) {
          URL.revokeObjectURL(url);
          previewUrlRef.current = "";
        }
      }, { once: true });
      await audio.play();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not play this voice preview.");
    } finally {
      setPreviewingVoice("");
    }
  }

  async function handleCreateAgent() {
    try {
      const { agent } = await voiceApi.createAgent();
      const mapped = mapBackendAgent(agent);
      unsavedChangesRef.current = false;
      setAgentList((current) => [...current, mapped]);
      setSelectedAgentId(mapped.id);
      setNotice("New backend agent created.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create agent.");
    }
  }

  async function handleCreateFromTemplate(templateId: string) {
    try {
      const { agent } = await voiceApi.createAgentFromTemplate(templateId);
      const mapped = mapBackendAgent(agent);
      unsavedChangesRef.current = false;
      setAgentList((current) => [...current, mapped]);
      setSelectedAgentId(mapped.id);
      setNotice("Template agent created as a draft.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create template agent.");
    }
  }

  function updateSelectedAgent(changes: Partial<VoiceAgent>) {
    unsavedChangesRef.current = true;
    setAgentList((current) =>
      current.map((agent) => (agent.id === selectedAgent.id ? { ...agent, ...changes } : agent)),
    );
  }

  function updateBehavior(changes: Partial<AgentBehavior>, agentChanges: Partial<VoiceAgent> = {}) {
    updateSelectedAgent({
      ...agentChanges,
      behavior: { ...selectedAgent.behavior, ...changes },
    });
  }

  function updateFirstMessageMode(firstMessageMode: FirstMessageMode) {
    updateBehavior(
      { userStartsFirst: firstMessageMode === "user-speaks-first" },
      { firstMessageMode },
    );
  }

  function renderBehaviorToggle(setting: (typeof flowSettings)[number]) {
    return (
      <ToggleRow
        key={setting.title}
        title={setting.title}
        detail={setting.detail}
        enabled={Boolean(selectedAgent.behavior[setting.field])}
        onChange={(enabled) => {
          if (setting.field === "userStartsFirst") {
            updateBehavior(
              { userStartsFirst: enabled },
              { firstMessageMode: enabled ? "user-speaks-first" : "assistant-speaks-first" },
            );
            return;
          }
          updateBehavior({ [setting.field]: enabled } as Partial<AgentBehavior>);
        }}
      />
    );
  }

  function updateBusinessHours(changes: Partial<AgentBusinessHours>) {
    updateSelectedAgent({
      businessHours: {
        ...selectedAgent.businessHours,
        schedule: selectedSchedule,
        ...changes,
      },
    });
  }

  function updateBusinessDay(day: BusinessHoursDay["day"], changes: Partial<BusinessHoursDay>) {
    updateBusinessHours({
      schedule: selectedSchedule.map((item) => (item.day === day ? { ...item, ...changes } : item)),
    });
  }

  async function handleLogout() {
    await logoutSession();
    router.replace("/login");
  }

  async function handleCloneAgent() {
    try {
      const { agent } = await voiceApi.cloneAgent(selectedAgent.id);
      const mapped = mapBackendAgent(agent);
      unsavedChangesRef.current = false;
      setAgentList((current) => [...current, mapped]);
      setSelectedAgentId(mapped.id);
      setNotice("Agent cloned as a new draft.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not clone agent.");
    }
  }

  async function handleDeleteAgent() {
    if (!window.confirm(`Delete ${selectedAgent.name}? This cannot be undone.`)) return;
    try {
      await voiceApi.deleteAgent(selectedAgent.id);
      unsavedChangesRef.current = false;
      setAgentList((current) => {
        const next = current.filter((agent) => agent.id !== selectedAgent.id);
        setSelectedAgentId(next[0]?.id ?? "");
        return next;
      });
      setNotice("Agent deleted.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not delete agent.");
    }
  }

  function validateTool(tool: AgentTool) {
    const normalized = normalizeTool(tool);
    if (!toolNamePattern.test(normalized.name)) {
      setNotice("Tool names must start with a letter and use letters, numbers, or underscores.");
      return null;
    }
    if (!isHttpUrl(normalized.url)) {
      setNotice("Webhook URL must start with http:// or https://.");
      return null;
    }
    const parameters = normalized.parameters ?? [];
    if (parameters.some((parameter) => !keyNamePattern.test(parameter.name))) {
      setNotice("Parameter names must start with a letter and use letters, numbers, or underscores.");
      return null;
    }
    const duplicateParameter = parameters.find((parameter, index) =>
      parameters.findIndex((item) => item.name === parameter.name) !== index,
    );
    if (duplicateParameter) {
      setNotice(`Parameter "${duplicateParameter.name}" is duplicated.`);
      return null;
    }
    if (Object.keys(normalized.headers ?? {}).some((name) => !headerNamePattern.test(name))) {
      setNotice("Header names must be valid HTTP header names.");
      return null;
    }
    return normalized;
  }

  function addTool() {
    if (selectedAgent.tools.length >= 20) {
      setNotice("An agent can have at most 20 tools.");
      return;
    }
    const tool = validateTool(toolDraft);
    if (!tool) return;
    updateSelectedAgent({ tools: [...selectedAgent.tools, tool] });
    setToolDraft(createEmptyToolDraft());
    setNotice("Webhook tool added. Save to deploy it.");
  }

  function updateTool(index: number, changes: Partial<AgentTool>) {
    updateSelectedAgent({
      tools: selectedAgent.tools.map((tool, toolIndex) =>
        toolIndex === index ? { ...tool, ...changes } : tool,
      ),
    });
  }

  function removeTool(index: number) {
    updateSelectedAgent({ tools: selectedAgent.tools.filter((_, toolIndex) => toolIndex !== index) });
  }

  function duplicateTool(index: number) {
    const source = selectedAgent.tools[index];
    if (!source || selectedAgent.tools.length >= 20) {
      setNotice("An agent can have at most 20 tools.");
      return;
    }
    updateSelectedAgent({
      tools: [
        ...selectedAgent.tools,
        normalizeTool({
          ...source,
          _id: undefined,
          name: `${source.name}_copy`.slice(0, 80),
          enabled: false,
          parameters: (source.parameters ?? []).map((parameter) => ({ ...parameter, _id: undefined })),
        }),
      ],
    });
    setNotice("Tool duplicated as disabled. Review it before saving.");
  }

  function addToolParameter(index: number) {
    const tool = selectedAgent.tools[index];
    if (!tool) return;
    const parameters = tool.parameters ?? [];
    if (parameters.length >= 20) {
      setNotice("A tool can have at most 20 parameters.");
      return;
    }
    updateTool(index, { parameters: [...parameters, createEmptyToolParameter(nextParameterName(parameters))] });
  }

  function updateToolParameter(toolIndex: number, parameterIndex: number, changes: Partial<AgentToolParameter>) {
    const tool = selectedAgent.tools[toolIndex];
    if (!tool) return;
    updateTool(toolIndex, {
      parameters: (tool.parameters ?? []).map((parameter, index) =>
        index === parameterIndex ? { ...parameter, ...changes } : parameter,
      ),
    });
  }

  function removeToolParameter(toolIndex: number, parameterIndex: number) {
    const tool = selectedAgent.tools[toolIndex];
    if (!tool) return;
    updateTool(toolIndex, { parameters: (tool.parameters ?? []).filter((_, index) => index !== parameterIndex) });
  }

  function updateToolHeader(toolIndex: number, headerIndex: number, changes: Partial<HeaderDraft>) {
    const tool = selectedAgent.tools[toolIndex];
    if (!tool) return;
    const drafts = headersToDrafts(tool.headers);
    updateTool(toolIndex, {
      headers: draftsToHeaders(drafts.map((header, index) => index === headerIndex ? { ...header, ...changes } : header), true),
    });
  }

  function addToolHeader(index: number) {
    const tool = selectedAgent.tools[index];
    if (!tool) return;
    updateTool(index, { headers: { ...(tool.headers ?? {}), "": "" } });
  }

  function removeToolHeader(toolIndex: number, headerIndex: number) {
    const tool = selectedAgent.tools[toolIndex];
    if (!tool) return;
    updateTool(toolIndex, {
      headers: draftsToHeaders(headersToDrafts(tool.headers).filter((_, index) => index !== headerIndex)),
    });
  }

  function addDraftParameter() {
    const parameters = toolDraft.parameters ?? [];
    if (parameters.length >= 20) {
      setNotice("A tool can have at most 20 parameters.");
      return;
    }
    setToolDraft((current) => ({
      ...current,
      parameters: [...(current.parameters ?? []), createEmptyToolParameter(nextParameterName(current.parameters ?? []))],
    }));
  }

  function updateDraftParameter(index: number, changes: Partial<AgentToolParameter>) {
    setToolDraft((current) => ({
      ...current,
      parameters: (current.parameters ?? []).map((parameter, parameterIndex) =>
        parameterIndex === index ? { ...parameter, ...changes } : parameter,
      ),
    }));
  }

  function removeDraftParameter(index: number) {
    setToolDraft((current) => ({
      ...current,
      parameters: (current.parameters ?? []).filter((_, parameterIndex) => parameterIndex !== index),
    }));
  }

  function updateDraftHeader(headerIndex: number, changes: Partial<HeaderDraft>) {
    setToolDraft((current) => {
      const drafts = headersToDrafts(current.headers);
      return {
        ...current,
        headers: draftsToHeaders(drafts.map((header, index) => index === headerIndex ? { ...header, ...changes } : header), true),
      };
    });
  }

  async function handleStartTestCall() {
    if (!testCallsEnabled) {
      setNotice("Paused agents cannot start test calls. Enable calls or switch the agent back to Draft/Live first.");
      return;
    }
    const saved = await handleSave();
    if (saved) setShowTestCall(true);
  }

  function handleSetLiveCalls(enabled: boolean) {
    const status: AgentStatus = enabled ? "Live" : "Paused";
    updateSelectedAgent({ status });
    void handleSave({ status });
  }

  function addDraftHeader() {
    setToolDraft((current) => ({ ...current, headers: { ...(current.headers ?? {}), "": "" } }));
  }

  function removeDraftHeader(headerIndex: number) {
    setToolDraft((current) => ({
      ...current,
      headers: draftsToHeaders(headersToDrafts(current.headers).filter((_, index) => index !== headerIndex)),
    }));
  }

  async function handleTestTool(index: number) {
    const tool = selectedAgent.tools[index];
    if (!tool) return;
    const normalized = validateTool(tool);
    if (!normalized) return;
    const key = normalized._id ?? `${normalized.name}-${index}`;
    setTestingToolKey(key);
    setNotice(`Testing ${normalized.name}...`);
    try {
      const { result } = await voiceApi.testAgentTool(selectedAgent.id, {
        tool: normalized,
        args: sampleArgsForTool(normalized),
      });
      setNotice(`Tool ${normalized.name} returned HTTP ${result.status} in ${result.elapsedMs}ms.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Tool test failed.");
    } finally {
      setTestingToolKey("");
    }
  }

  function addVariable() {
    const value = variableDraft.trim().replace(/[{}]/g, "");
    if (!value || selectedAgent.dynamicVariables.includes(value)) return;
    updateSelectedAgent({ dynamicVariables: [...selectedAgent.dynamicVariables, value] });
    setVariableDraft("");
  }

  function copyVariableSnippet(snippet: string) {
    if (!navigator.clipboard) {
      setVariableDraft(snippet.replace(/[{}]/g, ""));
      setNotice(`Added ${snippet} to the variable box.`);
      return;
    }
    void navigator.clipboard.writeText(snippet).then(
      () => setNotice(`Copied ${snippet}.`),
      () => {
        setVariableDraft(snippet.replace(/[{}]/g, ""));
        setNotice(`Added ${snippet} to the variable box.`);
      },
    );
  }

  async function handleCopyWidgetCode() {
    try {
      await navigator.clipboard.writeText(widgetEmbedCode);
      setNotice("Widget embed code copied.");
    } catch {
      setNotice("Could not copy automatically. Select the code and copy it manually.");
    }
  }

  function handleGenerateWidgetKey() {
    updateSelectedAgent({
      widget: {
        ...selectedAgent.widget,
        enabled: true,
        publicKey: createWidgetPublicKey(),
      },
    });
    setNotice("Widget key generated. Save the agent before using the embed code.");
  }

  if (!session) {
    return (
      <main className="app-strong grid min-h-screen place-items-center gap-3 bg-[#f8f6ff]">
        <span className="size-9 animate-spin rounded-full border-3 border-[#ded6f2] border-t-[#6b35e8]" />
        Loading voice agents
      </main>
    );
  }

  return (
    <main className="grid min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f7f8fb] text-[#111827] lg:grid-cols-[64px_minmax(0,1fr)]">
      <DashboardSidebar
        activeLabel="Voice Agents"
        userInitials={getInitials(session.name)}
        onLogout={handleLogout}
      />

      <section className="grid min-w-0 content-start gap-4 p-3 sm:p-4">
        <header className="-mx-3 -mt-3 flex flex-col items-stretch justify-between gap-4 border-b border-[#e5e7eb] bg-white px-4 py-4 sm:-mx-4 sm:-mt-4 sm:px-6 lg:flex-row lg:items-center">
          <div>
            <span className="app-kicker">Voice Platform</span>
            <h1 className="app-page-title mt-1 mb-0">Voice Agents</h1>
            <p className="app-caption mt-1 mb-0">
              {session.organization?.name ?? "Workspace"} / {session.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="app-button-text inline-flex min-h-9 items-center justify-center rounded-lg border border-[#d5d8df] bg-white px-3 text-[#475569]"
              type="button"
              onClick={() => void handleCloneAgent()}
            >
              Clone
            </button>
            <button
              className="app-button-text inline-flex min-h-9 items-center justify-center rounded-lg border border-rose-200 bg-white px-3 text-rose-600"
              type="button"
              onClick={() => void handleDeleteAgent()}
            >
              Delete
            </button>
            <button
              className="app-button-text inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-[#d5d8df] bg-white px-3 text-[#111827] shadow-sm"
              type="button"
              onClick={() => void handleSave()}
            >
              <Icon icon="save" />
              Save
            </button>
            <button
              className="app-button-text inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-[#dbeafe] bg-[#eff6ff] px-3 text-[#2563eb] shadow-sm"
              type="button"
              disabled={!testCallsEnabled}
              title={testCallsEnabled ? "Start browser test call" : "Paused agents cannot start test calls"}
              onClick={() => void handleStartTestCall()}
            >
              <Icon icon="phone" />
              Test call
            </button>
            <button
              className="app-button-text inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border-0 bg-[#1438f5] px-3 text-white shadow-sm"
              type="button"
              onClick={() => {
                updateSelectedAgent({ status: "Live" });
                void handleSave({ status: "Live" });
              }}
            >
              <Icon icon="play" />
              Publish
            </button>
          </div>
        </header>

        <section className="grid min-w-0 gap-4 xl:grid-cols-[280px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)_300px]">
          <aside className="min-w-0 overflow-hidden rounded-lg border border-[#dfe3ea] bg-white">
            <div className="flex min-h-[58px] items-center justify-between border-b border-[#e5e7eb] px-4">
              <div>
                <h2 className="app-section-title m-0">Agents</h2>
                <span className="app-caption">Build, test, and deploy</span>
              </div>
              <button
                className="grid size-8 place-items-center rounded-lg bg-[#eff6ff] text-[#2563eb]"
                type="button"
                aria-label="Create agent"
                title="Create agent"
                onClick={() => void handleCreateAgent()}
              >
                <Icon icon="plus" />
              </button>
            </div>

            <div className="grid gap-1.5 p-2">
              {agentList.map((agent) => {
                const isActive = agent.id === selectedAgent.id;
                const tone = getStatusTone(agent.status);

                return (
                  <button
                    className={`grid w-full grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg p-2.5 text-left transition ${
                      isActive ? "bg-[#eef4ff]" : "hover:bg-[#f8fafc]"
                    }`}
                    key={agent.id}
                    type="button"
                    onClick={() => setSelectedAgentId(agent.id)}
                  >
                    <span className="grid size-9 place-items-center rounded-lg bg-white text-[#2563eb] shadow-sm">
                      <Icon icon="agent" />
                    </span>
                    <span className="min-w-0">
                      <strong className="app-strong block truncate">{agent.name}</strong>
                      <span className="app-caption block truncate">{agent.team}</span>
                    </span>
                    <span className={`size-2.5 rounded-full ${tone.dot}`} />
                  </button>
                );
              })}
            </div>

            <div className="grid gap-2 border-t border-[#e5e7eb] bg-[#f8fafc] p-3">
              <div>
                <strong className="app-strong block">Start from template</strong>
                <span className="app-caption">Support, scheduling, sales, and FAQ presets</span>
              </div>
              {agentTemplates.map((template) => (
                <button
                  className="app-button-text flex min-h-9 items-center justify-between gap-2 rounded-lg border border-[#d5d8df] bg-white px-3 text-left text-[#111827]"
                  key={template.id}
                  type="button"
                  onClick={() => void handleCreateFromTemplate(template.id)}
                >
                  <span className="truncate">{template.name}</span>
                  <Icon icon="plus" />
                </button>
              ))}
              {!agentTemplates.length ? <span className="app-caption">Templates loading...</span> : null}
            </div>
          </aside>

          <section className="grid min-w-0 content-start gap-4">
            <article className="min-w-0 overflow-hidden rounded-lg border border-[#dfe3ea] bg-white">
              <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="app-section-title m-0">Agent builder</h2>
                  <span className="app-caption">
                    {selectedAgent.name} / {selectedAgent.team}
                  </span>
                </div>
                <div className="flex max-w-full gap-1 overflow-x-auto rounded-lg border border-[#dfe3ea] bg-[#f8fafc] p-1">
                  {tabs.map((tab) => (
                    <button
                      className={`app-button-text rounded-md px-3 py-1.5 transition ${
                        activeTab === tab.id
                          ? "bg-[#111827] text-white"
                          : "text-[#64748b] hover:bg-white hover:text-[#111827]"
                      }`}
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4">
                {activeTab === "builder" ? (
                  <div className="grid gap-4">
                    <div className="grid gap-3 lg:grid-cols-2">
                      <InputField
                        label="Agent name"
                        value={selectedAgent.name}
                        onChange={(name) => updateSelectedAgent({ name })}
                      />
                      <InputField
                        label="Business / team"
                        value={selectedAgent.team}
                        onChange={(team) => updateSelectedAgent({ team })}
                      />
                    </div>

                    <label className="app-label grid gap-2">
                      <span>Opening message</span>
                      <input
                        className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] bg-white px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                        value={selectedAgent.firstMessage}
                        onChange={(event) => updateSelectedAgent({ firstMessage: event.target.value })}
                      />
                    </label>

                    <label className="app-label grid gap-2">
                      <span>Instructions / prompt</span>
                      <textarea
                        className="app-control-text min-h-[132px] resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                        value={selectedAgent.prompt}
                        onChange={(event) => updateSelectedAgent({ prompt: event.target.value })}
                      />
                    </label>

                    <div className="grid gap-3 lg:grid-cols-2">
                      <SelectField
                        label="Language"
                        defaultValue={selectedAgent.language}
                        value={selectedAgent.language}
                        onChange={(language) => {
                          const voices =
                            selectedAgent.pipelineMode === "realtime"
                              ? getVoices(
                                  modelCatalog,
                                  "realtime",
                                  selectedAgent.realtimeProvider,
                                  selectedAgent.realtimeModel,
                                  language,
                                  languageCatalog,
                                )
                              : getVoices(
                                  modelCatalog,
                                  "tts",
                                  selectedAgent.ttsProvider,
                                  selectedAgent.ttsModel,
                                  language,
                                  languageCatalog,
                                );
                          updateSelectedAgent({
                            language,
                            voice: coerceVoice(selectedAgent.voice, voices, selectedAgent.voice),
                          });
                        }}
                        options={languageOptions}
                      />
                      <SelectField
                        label="Voice architecture"
                        defaultValue={selectedAgent.pipelineMode}
                        value={selectedAgent.pipelineMode}
                        onChange={(pipelineMode) => {
                          const nextMode = pipelineMode as PipelineMode;
                          const ttsLanguages = getProvider(modelCatalog, "tts", selectedAgent.ttsProvider).languages;
                          const nextLanguage =
                            nextMode === "pipeline" && ttsLanguages?.length
                              ? coerceLanguage(
                                  selectedAgent.language,
                                  [...ttsLanguages],
                                )
                              : selectedAgent.language;
                          const nextVoices =
                            nextMode === "realtime"
                              ? getVoices(
                                  modelCatalog,
                                  "realtime",
                                  selectedAgent.realtimeProvider,
                                  selectedAgent.realtimeModel,
                                  nextLanguage,
                                  languageCatalog,
                                )
                              : getVoices(
                                  modelCatalog,
                                  "tts",
                                  selectedAgent.ttsProvider,
                                  selectedAgent.ttsModel,
                                  nextLanguage,
                                  languageCatalog,
                                );
                          updateSelectedAgent({
                            pipelineMode: nextMode,
                            language: nextLanguage,
                            voice: coerceVoice(selectedAgent.voice, nextVoices, selectedAgent.voice),
                          });
                        }}
                        options={["realtime", "pipeline"]}
                      />
                    </div>

                    {selectedAgent.pipelineMode === "realtime" ? (
                      <section className="grid gap-3 rounded-xl border border-[#dbeafe] bg-[#f8fbff] p-4">
                        <div>
                          <h3 className="app-section-title m-0">Native realtime speech-to-speech</h3>
                          <span className="app-caption">Lowest latency. The selected model handles listening, reasoning, and speaking.</span>
                        </div>
                        <div className="grid gap-3 lg:grid-cols-3">
                          <SelectField
                            label="Realtime provider"
                            defaultValue={selectedAgent.realtimeProvider}
                            value={selectedAgent.realtimeProvider}
                            onChange={(provider) => {
                              const next = getProvider(modelCatalog, "realtime", provider);
                              const voices = getVoices(
                                modelCatalog,
                                "realtime",
                                provider,
                                next.models[0],
                                selectedAgent.language,
                                languageCatalog,
                              );
                              updateSelectedAgent({
                                realtimeProvider: provider as RealtimeProvider,
                                realtimeModel: next.models[0],
                                voice: voices[0] ?? selectedAgent.voice,
                              });
                            }}
                            options={modelCatalog.realtime.map((item) => item.provider)}
                          />
                          <SelectField
                            label="Realtime model"
                            defaultValue={selectedAgent.realtimeModel}
                            value={selectedAgent.realtimeModel}
                            onChange={(realtimeModel) => updateSelectedAgent({ realtimeModel })}
                            options={[...getProvider(modelCatalog, "realtime", selectedAgent.realtimeProvider).models]}
                          />
                          <VoiceSelectField
                            label="Realtime voice"
                            value={selectedAgent.voice}
                            onChange={(voice) => updateSelectedAgent({ voice })}
                            onPreview={() => void handlePreviewVoice({
                              mode: "realtime",
                              provider: selectedAgent.realtimeProvider,
                              model: selectedAgent.realtimeModel,
                            })}
                            previewing={previewingVoice === [
                              selectedAgent.id,
                              "realtime",
                              selectedAgent.realtimeProvider,
                              selectedAgent.realtimeModel,
                              selectedAgent.voice,
                              selectedAgent.language,
                              selectedAgent.voiceSpeed,
                            ].join(":")}
                            options={voiceSelectOptions(
                              getVoices(
                                modelCatalog,
                                "realtime",
                                selectedAgent.realtimeProvider,
                                selectedAgent.realtimeModel,
                                selectedAgent.language,
                                languageCatalog,
                              ),
                            )}
                          />
                        </div>
                      </section>
                    ) : (
                      <section className="grid gap-4 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
                        <div>
                          <h3 className="app-section-title m-0">Custom voice pipeline</h3>
                          <span className="app-caption">Mix providers independently, like Vapi: STT → LLM → TTS.</span>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-2">
                          <SelectField
                            label="LLM provider"
                            defaultValue={selectedAgent.llmProvider}
                            value={selectedAgent.llmProvider}
                            onChange={(provider) => {
                              const next = getProvider(modelCatalog, "llm", provider);
                              updateSelectedAgent({
                                llmProvider: provider as PipelineProvider,
                                llmModel: next.models[0],
                              });
                            }}
                            options={modelCatalog.llm.map((item) => item.provider)}
                          />
                          <SelectField
                            label="LLM model"
                            defaultValue={selectedAgent.llmModel}
                            value={selectedAgent.llmModel}
                            onChange={(llmModel) => updateSelectedAgent({ llmModel })}
                            options={[...getProvider(modelCatalog, "llm", selectedAgent.llmProvider).models]}
                          />
                        </div>

                        <div className="grid gap-3 lg:grid-cols-2">
                          <SelectField
                            label="Speech-to-text provider"
                            defaultValue={selectedAgent.sttProvider}
                            value={selectedAgent.sttProvider}
                            onChange={(provider) => {
                              const next = getProvider(modelCatalog, "stt", provider);
                              const ttsLanguages = getProvider(modelCatalog, "tts", selectedAgent.ttsProvider).languages;
                              const nextLanguage =
                                next.languages?.length && !ttsLanguages?.length
                                  ? coerceLanguage(
                                      selectedAgent.language,
                                      [...next.languages],
                                    )
                                  : selectedAgent.language;
                              updateSelectedAgent({
                                sttProvider: provider as SttProvider,
                                sttModel: next.models[0],
                                language: nextLanguage,
                              });
                            }}
                            options={modelCatalog.stt.map((item) => item.provider)}
                          />
                          <SelectField
                            label="Speech-to-text model"
                            defaultValue={selectedAgent.sttModel}
                            value={selectedAgent.sttModel}
                            onChange={(sttModel) => updateSelectedAgent({ sttModel })}
                            options={[...getProvider(modelCatalog, "stt", selectedAgent.sttProvider).models]}
                          />
                        </div>

                        <div className="grid gap-3 lg:grid-cols-3">
                          <SelectField
                            label="Text-to-speech provider"
                            defaultValue={selectedAgent.ttsProvider}
                            value={selectedAgent.ttsProvider}
                            onChange={(provider) => {
                              const next = getProvider(modelCatalog, "tts", provider);
                              const nextLanguage =
                                next.languages?.length
                                  ? coerceLanguage(
                                      selectedAgent.language,
                                      [...next.languages],
                                    )
                                  : selectedAgent.language;
                              const voices = getVoices(
                                modelCatalog,
                                "tts",
                                provider,
                                next.models[0],
                                nextLanguage,
                                languageCatalog,
                              );
                              updateSelectedAgent({
                                ttsProvider: provider as PipelineProvider,
                                ttsModel: next.models[0],
                                language: nextLanguage,
                                voice: voices[0] ?? selectedAgent.voice,
                              });
                            }}
                            options={modelCatalog.tts.map((item) => item.provider)}
                          />
                          <SelectField
                            label="Text-to-speech model"
                            defaultValue={selectedAgent.ttsModel}
                            value={selectedAgent.ttsModel}
                            onChange={(ttsModel) => {
                              const voices = getVoices(
                                modelCatalog,
                                "tts",
                                selectedAgent.ttsProvider,
                                ttsModel,
                                selectedAgent.language,
                                languageCatalog,
                              );
                              updateSelectedAgent({
                                ttsModel,
                                voice: voices.includes(selectedAgent.voice) ? selectedAgent.voice : voices[0],
                              });
                            }}
                            options={[...getProvider(modelCatalog, "tts", selectedAgent.ttsProvider).models]}
                          />
                          <VoiceSelectField
                            label="Voice / speaker"
                            value={selectedAgent.voice}
                            onChange={(voice) => updateSelectedAgent({ voice })}
                            onPreview={() => void handlePreviewVoice({
                              mode: "pipeline",
                              provider: selectedAgent.ttsProvider,
                              model: selectedAgent.ttsModel,
                            })}
                            previewing={previewingVoice === [
                              selectedAgent.id,
                              "pipeline",
                              selectedAgent.ttsProvider,
                              selectedAgent.ttsModel,
                              selectedAgent.voice,
                              selectedAgent.language,
                              selectedAgent.voiceSpeed,
                            ].join(":")}
                            options={voiceSelectOptions(
                              getVoices(
                                modelCatalog,
                                "tts",
                                selectedAgent.ttsProvider,
                                selectedAgent.ttsModel,
                                selectedAgent.language,
                                languageCatalog,
                              ),
                            )}
                          />
                        </div>
                      </section>
                    )}

                    <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                      <div className="min-w-0 rounded-lg border border-[#e5e7eb] bg-white p-3">
                        <span className="app-label block">Active runtime</span>
                        <strong className="app-strong block break-words">
                          {selectedAgent.pipelineMode === "realtime"
                            ? `${selectedAgent.realtimeProvider} / ${selectedAgent.realtimeModel}`
                            : `${selectedAgent.sttProvider} → ${selectedAgent.llmProvider} → ${selectedAgent.ttsProvider}`}
                        </strong>
                      </div>
                      <label className="app-label grid gap-2">
                        <span>Creativity</span>
                        <input
                          className="accent-[#2563eb]"
                          type="range"
                          min="0"
                          max="2"
                          step="0.05"
                          value={selectedAgent.temperature}
                          onChange={(event) =>
                            updateSelectedAgent({ temperature: Number(event.target.value) })
                          }
                        />
                      </label>
                    </div>

                    <section className="grid gap-3 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
                      <div>
                        <h3 className="app-section-title m-0">Voice tuning</h3>
                        <span className="app-caption">Control how quickly, clearly, and aggressively the live agent responds.</span>
                      </div>
                      <div className="grid gap-3 lg:grid-cols-3">
                        <InputField
                          label="Voice speed"
                          value={String(selectedAgent.voiceSpeed)}
                          onChange={(value) => updateSelectedAgent({ voiceSpeed: Number(value) || 1 })}
                        />
                        <InputField
                          label="Voice pitch"
                          value={String(selectedAgent.voicePitch)}
                          onChange={(value) => updateSelectedAgent({ voicePitch: Number(value) || 0 })}
                        />
                        <InputField
                          label="Concurrent calls"
                          value={String(selectedAgent.maxConcurrentCalls)}
                          onChange={(value) => updateSelectedAgent({ maxConcurrentCalls: Number(value) || 1 })}
                        />
                        <SelectField
                          label="Interruption sensitivity"
                          defaultValue="medium"
                          value={selectedAgent.interruptionSensitivity}
                          options={["low", "medium", "high"]}
                          onChange={(value) => updateSelectedAgent({ interruptionSensitivity: value as BackendAgent["interruptionSensitivity"] })}
                        />
                        <SelectField
                          label="Background profile"
                          defaultValue="none"
                          value={selectedAgent.backgroundNoise}
                          options={["none", "office", "cafe", "street"]}
                          onChange={(value) => updateSelectedAgent({ backgroundNoise: value as BackendAgent["backgroundNoise"] })}
                        />
                        <InputField
                          label="Callback email"
                          value={selectedAgent.callbackEmail}
                          placeholder="ops@example.com"
                          onChange={(callbackEmail) => updateSelectedAgent({ callbackEmail })}
                        />
                      </div>
                    </section>
                  </div>
                ) : null}

                {activeTab === "behavior" ? (
                  <div className="grid gap-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {behaviorMetrics.map((metric) => (
                        <BehaviorMetric
                          key={metric.label}
                          label={metric.label}
                          value={metric.value}
                          tone={metric.tone}
                        />
                      ))}
                    </div>

                    <BehaviorPanel
                      title="Conversation Flow"
                      detail="Opening behavior, turn taking, and caller control"
                      icon="agent"
                    >
                      <div className="grid gap-3 lg:grid-cols-2">
                        <SelectField
                          label="Opening mode"
                          defaultValue="assistant-speaks-first"
                          value={selectedAgent.firstMessageMode}
                          options={firstMessageModeOptions}
                          onChange={(value) => updateFirstMessageMode(value as FirstMessageMode)}
                        />
                        <SelectField
                          label="Endpointing mode"
                          defaultValue="balanced"
                          value={selectedAgent.behavior.endpointingMode}
                          options={endpointingModeOptions}
                          onChange={(value) => updateBehavior({ endpointingMode: value as AgentBehavior["endpointingMode"] })}
                        />
                      </div>

                      <div className="grid gap-3 lg:grid-cols-2">
                        {flowSettings
                          .filter((setting) =>
                            setting.field === "interruptions" ||
                            setting.field === "userStartsFirst" ||
                            setting.field === "autoFillResponses" ||
                            setting.field === "agentCanTerminate"
                          )
                          .map(renderBehaviorToggle)}
                      </div>
                    </BehaviorPanel>

                    <div className="grid gap-4 xl:grid-cols-2">
                      <BehaviorPanel
                        title="Timing Limits"
                        detail="Response delay, silence handling, and call duration"
                        icon="code"
                      >
                        <div className="grid gap-3">
                          <InputField
                            label="Response delay (ms)"
                            value={String(selectedAgent.behavior.responseDelayMs)}
                            onChange={(value) => updateBehavior({ responseDelayMs: Number(value) || 0 })}
                          />
                          <InputField
                            label="Max idle time (seconds)"
                            value={String(selectedAgent.behavior.maxIdleSeconds)}
                            onChange={(value) => updateBehavior({ maxIdleSeconds: Number(value) || 5 })}
                          />
                          <InputField
                            label="Max call duration (seconds)"
                            value={String(selectedAgent.behavior.maxCallDurationSeconds)}
                            onChange={(value) => updateBehavior({ maxCallDurationSeconds: Number(value) || 30 })}
                          />
                        </div>
                      </BehaviorPanel>

                      <BehaviorPanel
                        title="Handoff And Keypad"
                        detail="Human transfer target and IVR keypad sequence"
                        icon="route"
                      >
                        <div className="grid gap-3">
                          {flowSettings
                            .filter((setting) => setting.field === "dtmfDial")
                            .map(renderBehaviorToggle)}
                          <InputField
                            label="Transfer phone"
                            value={selectedAgent.behavior.transferPhone}
                            placeholder="+14155550123"
                            onChange={(value) => updateBehavior({ transferPhone: value })}
                          />
                          <InputField
                            label="DTMF sequence"
                            value={selectedAgent.behavior.dtmfSequence}
                            placeholder="1234,w,#"
                            onChange={(value) => updateBehavior({ dtmfSequence: value })}
                          />
                        </div>
                      </BehaviorPanel>
                    </div>

                    <BehaviorPanel
                      title="Availability"
                      detail="Timezone and daily call window"
                      icon="shield"
                    >
                      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
                        <ToggleRow
                          title="Business hours guard"
                          detail="Block browser and phone calls outside the schedule below."
                          enabled={selectedAgent.businessHoursEnabled}
                          onChange={(businessHoursEnabled) => updateSelectedAgent({ businessHoursEnabled })}
                        />
                        <SelectField
                          label="Agent timezone"
                          defaultValue="UTC"
                          value={selectedAgent.businessHours.timezone || "UTC"}
                          options={getTimezoneOptions(selectedAgent.businessHours.timezone)}
                          onChange={(timezone) => updateBusinessHours({ timezone })}
                        />
                      </div>

                      <div className="overflow-hidden rounded-lg border border-[#e5e7eb]">
                        {selectedSchedule.map((item) => (
                          <div
                            className="grid gap-2 border-b border-[#edf0f5] bg-white p-3 last:border-b-0 sm:grid-cols-[64px_92px_minmax(0,1fr)_minmax(0,1fr)]"
                            key={item.day}
                          >
                            <span className="app-strong self-center">{businessDayLabels[item.day]}</span>
                            <label className="app-label flex items-center gap-2">
                              <input
                                className="size-4 accent-[#2563eb]"
                                type="checkbox"
                                checked={item.enabled}
                                onChange={(event) => updateBusinessDay(item.day, { enabled: event.target.checked })}
                              />
                              Open
                            </label>
                            <label className="app-label grid gap-1">
                              <span>Start</span>
                              <input
                                className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] bg-white px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                                type="time"
                                value={item.start}
                                onChange={(event) => updateBusinessDay(item.day, { start: event.target.value })}
                              />
                            </label>
                            <label className="app-label grid gap-1">
                              <span>End</span>
                              <input
                                className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] bg-white px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                                type="time"
                                value={item.end}
                                onChange={(event) => updateBusinessDay(item.day, { end: event.target.value })}
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                    </BehaviorPanel>

                    <BehaviorPanel
                      title="Voicemail"
                      detail="Detection policy and message"
                      icon="phone"
                    >
                      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
                        {flowSettings
                          .filter((setting) => setting.field === "voicemailHandling")
                          .map(renderBehaviorToggle)}
                        <SelectField
                          label="Voicemail action"
                          defaultValue="leave-message"
                          value={selectedAgent.behavior.voicemailAction}
                          options={voicemailActionOptions}
                          onChange={(value) => updateBehavior({ voicemailAction: value as AgentBehavior["voicemailAction"] })}
                        />
                      </div>

                      <label className="app-label grid gap-2">
                        <span>Voicemail message</span>
                        <textarea
                          className="app-control-text min-h-24 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                          value={selectedAgent.behavior.voicemailMessage}
                          onChange={(event) => updateBehavior({ voicemailMessage: event.target.value })}
                        />
                      </label>
                    </BehaviorPanel>
                  </div>
                ) : null}

                {activeTab === "tools" ? (
                  <div className="grid gap-4">
                    <section className="grid gap-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <h3 className="app-section-title m-0">Webhook tools</h3>
                          <span className="app-caption">
                            Millis-style functions with webhook URL, headers, params, method, timeout, and execution options.
                          </span>
                        </div>
                        <span className="app-label w-fit rounded-full border border-[#dbeafe] bg-[#eff6ff] px-2.5 py-1 text-[#2563eb]">
                          {selectedAgent.tools.length} / 20 configured
                        </span>
                      </div>

                      {selectedAgent.tools.map((tool, index) => {
                        const parameters = tool.parameters ?? [];
                        const headers = headersToDrafts(tool.headers);
                        const toolKey = tool._id ?? `${tool.name}-${index}`;
                        const isTesting = testingToolKey === toolKey;

                        return (
                          <article
                            className="overflow-hidden rounded-xl border border-[#dfe3ea] bg-white shadow-[0_10px_26px_rgba(15,23,42,0.05)]"
                            key={toolKey}
                          >
                            <div className="flex flex-col gap-3 border-b border-[#edf0f5] bg-[#f8fafc] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                              <div className="flex min-w-0 items-center gap-3">
                                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                                  <Icon icon="tool" />
                                </span>
                                <div className="min-w-0">
                                  <strong className="app-strong block truncate">{tool.name || `Tool ${index + 1}`}</strong>
                                  <span className="app-caption block truncate">{tool.url || "Webhook URL required"}</span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <label className="app-label flex min-h-9 items-center gap-2 rounded-lg border border-[#dfe3ea] bg-white px-3">
                                  <input
                                    className="size-4 accent-[#2563eb]"
                                    type="checkbox"
                                    checked={tool.enabled !== false}
                                    onChange={(event) => updateTool(index, { enabled: event.target.checked })}
                                  />
                                  Enabled
                                </label>
                                <button
                                  className="app-button-text min-h-9 rounded-lg border border-[#dbeafe] bg-white px-3 text-[#2563eb] transition hover:bg-[#eff6ff] disabled:cursor-not-allowed disabled:opacity-60"
                                  type="button"
                                  disabled={isTesting}
                                  onClick={() => void handleTestTool(index)}
                                >
                                  {isTesting ? "Testing..." : "Test"}
                                </button>
                                <button
                                  className="app-button-text min-h-9 rounded-lg border border-[#d5d8df] bg-white px-3 text-[#475569] transition hover:bg-[#f8fafc]"
                                  type="button"
                                  onClick={() => duplicateTool(index)}
                                >
                                  Duplicate
                                </button>
                                <button
                                  className="app-button-text min-h-9 rounded-lg border border-rose-200 bg-white px-3 text-rose-600 transition hover:bg-rose-50"
                                  type="button"
                                  onClick={() => removeTool(index)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>

                            <div className="grid gap-4 p-4">
                              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_150px_160px]">
                                <InputField label="Function name" value={tool.name} placeholder="getUserInfo" onChange={(name) => updateTool(index, { name })} />
                                <SelectField label="Method" defaultValue="POST" value={tool.method} options={toolMethodOptions} onChange={(method) => updateTool(index, { method: method as AgentTool["method"] })} />
                                <InputField label="Timeout seconds" value={String(tool.timeoutSeconds)} onChange={(timeoutSeconds) => updateTool(index, { timeoutSeconds: Number(timeoutSeconds) || 8 })} />
                              </div>

                              <InputField label="Webhook URL" value={tool.url} placeholder="https://api.company.com/user" onChange={(url) => updateTool(index, { url })} />

                              <label className="app-label grid gap-2">
                                <span>Description</span>
                                <textarea
                                  className="app-control-text min-h-20 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                                  value={tool.description}
                                  placeholder="Tell the agent exactly when to use this function."
                                  onChange={(event) => updateTool(index, { description: event.target.value })}
                                />
                              </label>

                              <div className="grid gap-3 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-3">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <strong className="app-strong block">Headers</strong>
                                    <span className="app-caption">Authorization, API keys, content type overrides, or tenant headers.</span>
                                  </div>
                                  <button className="app-button-text min-h-9 rounded-lg border border-[#d5d8df] bg-white px-3 text-[#2563eb]" type="button" onClick={() => addToolHeader(index)}>
                                    Add header
                                  </button>
                                </div>
                                {headers.length ? (
                                  <div className="grid gap-2">
                                    {headers.map((header, headerIndex) => (
                                      <HeaderEditor
                                        key={`${toolKey}-header-${headerIndex}`}
                                        header={header}
                                        onChange={(changes) => updateToolHeader(index, headerIndex, changes)}
                                        onRemove={() => removeToolHeader(index, headerIndex)}
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <span className="app-caption rounded-lg border border-dashed border-[#cbd5e1] bg-white p-3 text-center">No custom headers.</span>
                                )}
                              </div>

                              <div className="grid gap-3 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-3">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <strong className="app-strong block">Parameters</strong>
                                    <span className="app-caption">These become the JSON fields the agent sends to your webhook.</span>
                                  </div>
                                  <button className="app-button-text min-h-9 rounded-lg border border-[#d5d8df] bg-white px-3 text-[#2563eb]" type="button" onClick={() => addToolParameter(index)}>
                                    Add parameter
                                  </button>
                                </div>
                                {parameters.length ? (
                                  <div className="grid gap-2">
                                    {parameters.map((parameter, parameterIndex) => (
                                      <ToolParameterEditor
                                        key={parameter._id ?? `${toolKey}-parameter-${parameterIndex}`}
                                        parameter={parameter}
                                        onChange={(changes) => updateToolParameter(index, parameterIndex, changes)}
                                        onRemove={() => removeToolParameter(index, parameterIndex)}
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <span className="app-caption rounded-lg border border-dashed border-[#cbd5e1] bg-white p-3 text-center">No parameters yet.</span>
                                )}
                              </div>

                              <div className="grid gap-3 rounded-xl border border-[#e5e7eb] bg-white p-3">
                                <strong className="app-strong block">Execution and filler</strong>
                                <div className="grid gap-3 lg:grid-cols-3">
                                  <ToggleRow
                                    title="Run after call"
                                    detail="Execute this webhook after the session closes."
                                    enabled={tool.runAfterCall === true}
                                    onChange={(runAfterCall) => updateTool(index, { runAfterCall })}
                                  />
                                  <ToggleRow
                                    title="Wait for filler"
                                    detail="Speak filler first, then call the webhook."
                                    enabled={tool.executeAfterMessage === true}
                                    onChange={(executeAfterMessage) => updateTool(index, { executeAfterMessage })}
                                  />
                                  <ToggleRow
                                    title="Exclude session id"
                                    detail="Do not add call/session metadata to webhook args."
                                    enabled={tool.excludeSessionId !== false}
                                    onChange={(excludeSessionId) => updateTool(index, { excludeSessionId })}
                                  />
                                </div>
                                <label className="app-label grid gap-2">
                                  <span>Filler messages while calling tool</span>
                                  <textarea
                                    className="app-control-text min-h-24 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                                    value={(tool.messages ?? []).join("\n")}
                                    placeholder={"Let me check that for you.\nOne moment while I look that up."}
                                    onChange={(event) => updateTool(index, {
                                      messages: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                                    })}
                                  />
                                  <span className="app-caption">
                                    One line is picked at random. If wait is off, the webhook starts while the agent says it.
                                  </span>
                                </label>
                              </div>
                            </div>
                          </article>
                        );
                      })}

                      {!selectedAgent.tools.length ? (
                        <span className="app-caption rounded-xl border border-dashed border-[#cbd5e1] bg-white p-5 text-center">No webhook tools configured yet.</span>
                      ) : null}
                    </section>

                    <section className="grid gap-4 rounded-xl border border-[#bfdbfe] bg-[#f8fbff] p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="app-section-title m-0">Add webhook tool</h3>
                          <span className="app-caption">Same shape as Millis: name, description, webhook, header, params, method, timeout.</span>
                        </div>
                        <button className="app-button-text min-h-10 rounded-lg bg-[#1438f5] px-4 text-white shadow-sm" type="button" onClick={addTool}>
                          Add tool
                        </button>
                      </div>

                      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_150px_160px]">
                        <InputField label="Function name" value={toolDraft.name} placeholder="getUserInfo" onChange={(name) => setToolDraft((current) => ({ ...current, name }))} />
                        <SelectField label="Method" defaultValue="POST" value={toolDraft.method} options={toolMethodOptions} onChange={(method) => setToolDraft((current) => ({ ...current, method: method as AgentTool["method"] }))} />
                        <InputField label="Timeout seconds" value={String(toolDraft.timeoutSeconds)} onChange={(timeoutSeconds) => setToolDraft((current) => ({ ...current, timeoutSeconds: Number(timeoutSeconds) || 8 }))} />
                      </div>
                      <InputField label="Webhook URL" value={toolDraft.url} placeholder="https://api.company.com/user" onChange={(url) => setToolDraft((current) => ({ ...current, url }))} />
                      <InputField label="Description" value={toolDraft.description} placeholder="Retrieves user information using their email." onChange={(description) => setToolDraft((current) => ({ ...current, description }))} />

                      <div className="grid gap-3 rounded-xl border border-[#dbeafe] bg-white p-3">
                        <div>
                          <strong className="app-strong block">Filler while tool runs</strong>
                          <span className="app-caption">Millis-style messages the agent can say while calling this webhook.</span>
                        </div>
                        <ToggleRow
                          title="Wait for filler"
                          detail="Speak filler first, then call the webhook."
                          enabled={toolDraft.executeAfterMessage === true}
                          onChange={(executeAfterMessage) => setToolDraft((current) => ({ ...current, executeAfterMessage }))}
                        />
                        <label className="app-label grid gap-2">
                          <span>Filler messages</span>
                          <textarea
                            className="app-control-text min-h-24 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                            value={(toolDraft.messages ?? []).join("\n")}
                            placeholder={"Let me check that for you.\nOne moment while I look that up."}
                            onChange={(event) => setToolDraft((current) => ({
                              ...current,
                              messages: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                            }))}
                          />
                        </label>
                      </div>

                      <div className="grid gap-3 rounded-xl border border-[#dbeafe] bg-white p-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <strong className="app-strong block">Headers</strong>
                            <span className="app-caption">Example: Authorization: Bearer token.</span>
                          </div>
                          <button className="app-button-text min-h-9 rounded-lg border border-[#d5d8df] bg-white px-3 text-[#2563eb]" type="button" onClick={addDraftHeader}>
                            Add header
                          </button>
                        </div>
                        {headersToDrafts(toolDraft.headers).length ? (
                          <div className="grid gap-2">
                            {headersToDrafts(toolDraft.headers).map((header, headerIndex) => (
                              <HeaderEditor
                                key={`draft-header-${headerIndex}`}
                                header={header}
                                onChange={(changes) => updateDraftHeader(headerIndex, changes)}
                                onRemove={() => removeDraftHeader(headerIndex)}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="app-caption rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-3 text-center">No custom headers.</span>
                        )}
                      </div>

                      <div className="grid gap-3 rounded-xl border border-[#dbeafe] bg-white p-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <strong className="app-strong block">Parameters</strong>
                            <span className="app-caption">Fields the agent should collect and send.</span>
                          </div>
                          <button className="app-button-text min-h-9 rounded-lg border border-[#d5d8df] bg-white px-3 text-[#2563eb]" type="button" onClick={addDraftParameter}>
                            Add parameter
                          </button>
                        </div>
                        {(toolDraft.parameters ?? []).length ? (
                          <div className="grid gap-2">
                            {(toolDraft.parameters ?? []).map((parameter, parameterIndex) => (
                              <ToolParameterEditor
                                key={`draft-parameter-${parameterIndex}`}
                                parameter={parameter}
                                onChange={(changes) => updateDraftParameter(parameterIndex, changes)}
                                onRemove={() => removeDraftParameter(parameterIndex)}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="app-caption rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-3 text-center">No parameters added.</span>
                        )}
                      </div>
                    </section>

                    <section className="grid gap-3 rounded-xl border border-[#e5e7eb] bg-white p-4">
                      <div>
                        <h3 className="app-section-title m-0">Lifecycle webhooks</h3>
                        <span className="app-caption">Send context before a call or receive call results after completion.</span>
                      </div>
                      <div className="grid gap-3 lg:grid-cols-2">
                        <InputField label="Prefetch data webhook" value={selectedAgent.prefetchWebhook} placeholder="https://api.company.com/prefetch" onChange={(value) => updateSelectedAgent({ prefetchWebhook: value })} />
                        <InputField label="End-of-call webhook" value={selectedAgent.endOfCallWebhook} placeholder="https://api.company.com/calls/end" onChange={(value) => updateSelectedAgent({ endOfCallWebhook: value })} />
                      </div>
                    </section>

                    <section className="grid gap-3 rounded-xl border border-[#e5e7eb] bg-white p-4">
                      <div>
                        <h3 className="app-section-title m-0">Dynamic variables</h3>
                        <span className="app-caption">Reusable values for prompts, widgets, and webhooks.</span>
                      </div>
                      <div className="grid gap-2 rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-3">
                        <strong className="app-strong block">System variables</strong>
                        <div className="flex flex-wrap gap-2">
                          {systemDynamicVariables.map((variable) => (
                            <button
                              className="app-label rounded-full border border-[#dbeafe] bg-white px-2.5 py-1 text-[#2563eb] transition hover:border-[#bfdbfe] hover:bg-[#eff6ff]"
                              key={variable}
                              type="button"
                              title="Copy variable"
                              onClick={() => copyVariableSnippet(`{${variable}}`)}
                            >
                              {`{${variable}}`}
                            </button>
                          ))}
                        </div>
                        <strong className="app-strong block pt-2">Vapi / Retell date-time aliases</strong>
                        <div className="flex flex-wrap gap-2">
                          {dateTimeVariableExamples.map((snippet) => (
                            <button
                              className="app-label rounded-full border border-[#dcfce7] bg-white px-2.5 py-1 text-[#047857] transition hover:border-[#bbf7d0] hover:bg-[#ecfdf5]"
                              key={snippet}
                              type="button"
                              title="Copy variable"
                              onClick={() => copyVariableSnippet(snippet)}
                            >
                              {snippet}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.dynamicVariables.map((variable) => (
                          <button
                            className="app-label rounded-full border border-[#dbeafe] bg-[#eff6ff] px-2.5 py-1 text-[#2563eb] transition hover:border-[#bfdbfe] hover:bg-white"
                            key={variable}
                            type="button"
                            title="Remove variable"
                            onClick={() => updateSelectedAgent({ dynamicVariables: selectedAgent.dynamicVariables.filter((item) => item !== variable) })}
                          >
                            {`{${variable}}`} x
                          </button>
                        ))}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_84px]">
                        <input className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] bg-white px-3 outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10" value={variableDraft} placeholder="customerID" onChange={(event) => setVariableDraft(event.target.value)} />
                        <button className="app-button-text rounded-lg border border-[#d5d8df] bg-white px-3 text-[#2563eb]" type="button" onClick={addVariable}>Add</button>
                      </div>
                    </section>
                  </div>
                ) : null}

                {activeTab === "calls" ? (
                  <div className="grid gap-4">
                    <section className="grid gap-3 rounded-xl border border-[#dbeafe] bg-[#f8fbff] p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h3 className="app-section-title m-0">Call enablement</h3>
                          <span className="app-caption">
                            Live phone traffic requires a Live agent and ready phone route. Dashboard test calls work for Draft agents.
                          </span>
                        </div>
                        <button
                          className="app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#dbeafe] bg-white px-3 text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
                          type="button"
                          disabled={!testCallsEnabled}
                          onClick={() => void handleStartTestCall()}
                        >
                          <Icon icon="phone" />
                          Test call
                        </button>
                      </div>

                      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
                        <ToggleRow
                          title="Enable live phone calls"
                          detail="Allow inbound and outbound phone calls for this agent."
                          enabled={liveCallsEnabled}
                          onChange={handleSetLiveCalls}
                        />
                        <div className="rounded-lg border border-[#dbeafe] bg-white p-3">
                          <span className="app-label block">Agent status</span>
                          <strong className={`app-strong block ${selectedTone.text}`}>{selectedAgent.status}</strong>
                          <span className="app-caption">Save happens automatically when toggled.</span>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {callReadiness.map((item) => (
                          <div
                            className={`rounded-lg border p-3 ${
                              item.ready
                                ? "border-[#bbf7d0] bg-[#ecfdf5] text-[#047857]"
                                : "border-[#fde68a] bg-[#fffbeb] text-[#b45309]"
                            }`}
                            key={item.label}
                          >
                            <span className="app-label block opacity-80">{item.label}</span>
                            <strong className="app-strong block text-current">{item.value}</strong>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="grid gap-3 lg:grid-cols-4">
                      <div className="rounded-lg border border-[#e5e7eb] bg-white p-3">
                        <span className="app-label block">Assigned phone</span>
                        <strong className="app-strong block truncate">{selectedAgent.phone}</strong>
                      </div>
                      <div className="rounded-lg border border-[#e5e7eb] bg-white p-3">
                        <span className="app-label block">LiveKit inbound trunk</span>
                        <strong className={`app-strong ${voiceConfig?.sip.inboundConfigured ? "text-[#059669]" : "text-[#dc2626]"}`}>
                          {voiceConfig?.sip.inboundConfigured ? "Configured" : "Missing"}
                        </strong>
                      </div>
                      <div className="rounded-lg border border-[#e5e7eb] bg-white p-3">
                        <span className="app-label block">LiveKit agent</span>
                        <strong className={`app-strong ${voiceConfig?.agentName ? "text-[#059669]" : "text-[#dc2626]"}`}>
                          {voiceConfig?.agentName || "Missing"}
                        </strong>
                      </div>
                      <div className="rounded-lg border border-[#e5e7eb] bg-white p-3">
                        <span className="app-label block">Vobiz connection</span>
                        <strong className={`app-strong ${voiceConfig?.vobiz.configured ? "text-[#059669]" : "text-[#dc2626]"}`}>
                          {voiceConfig?.vobiz.configured ? "Connected" : "Missing"}
                        </strong>
                      </div>
                    </div>

                    {!voiceConfig?.sip.inboundConfigured ? (
                      <p className="app-caption m-0 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-3 text-[#b91c1c]">
                        LIVEKIT_SIP_INBOUND_TRUNK_ID is missing. Set your LiveKit inbound trunk, then sync phone routes.
                      </p>
                    ) : null}

                    {!voiceConfig?.sip.inboundDestinationConfigured ? (
                      <p className="app-caption m-0 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-3 text-[#b91c1c]">
                        LIVEKIT_SIP_URI is missing. Set it to your LiveKit SIP host, then sync phone routes so Vobiz can hand inbound calls to LiveKit.
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      <button
                        className="app-button-text min-h-10 rounded-lg border border-[#d5d8df] bg-white px-3 text-[#2563eb]"
                        type="button"
                        onClick={() => void handleSyncPhoneRoutes()}
                      >
                        Sync phone routes
                      </button>
                      <button
                        className="app-button-text min-h-10 rounded-lg border border-[#d5d8df] bg-white px-3 text-[#111827]"
                        type="button"
                        onClick={() => router.push("/dashboard/phone-number")}
                      >
                        Manage numbers
                      </button>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                      <ToggleRow
                        title="Enable recording"
                        detail="Store recording URL in end-of-call webhook payload."
                        enabled={selectedAgent.callSettings.recordingEnabled}
                        onChange={(enabled) => updateSelectedAgent({ callSettings: { ...selectedAgent.callSettings, recordingEnabled: enabled } })}
                      />
                      <ToggleRow
                        title="Do-not-call detection"
                        detail="Detect opt-out intent and mark session metadata."
                        enabled={selectedAgent.callSettings.doNotCallDetection}
                        onChange={(enabled) => updateSelectedAgent({ callSettings: { ...selectedAgent.callSettings, doNotCallDetection: enabled } })}
                      />
                      <ToggleRow
                        title="Session continuation"
                        detail="Continue conversations by session or caller identifier."
                        enabled={selectedAgent.callSettings.sessionContinuation}
                        onChange={(enabled) => updateSelectedAgent({ callSettings: { ...selectedAgent.callSettings, sessionContinuation: enabled } })}
                      />
                      <ToggleRow
                        title="Memory"
                        detail="Use a caller identifier key for repeat interactions."
                        enabled={selectedAgent.callSettings.memoryEnabled}
                        onChange={(enabled) => updateSelectedAgent({ callSettings: { ...selectedAgent.callSettings, memoryEnabled: enabled } })}
                      />
                    </div>

                    <div className="grid gap-2">
                      {recentCalls.map((call) => (
                        <article
                          className="grid gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3 md:grid-cols-[minmax(0,1fr)_120px_90px]"
                          key={call._id}
                        >
                          <strong className="app-strong truncate">
                            {call.callerNumber || call.calledNumber || "Browser caller"}
                          </strong>
                          <span className="app-caption capitalize">{call.status}</span>
                          <span className="app-caption md:text-right">
                            {Math.floor(call.durationSeconds / 60)}:{String(call.durationSeconds % 60).padStart(2, "0")}
                          </span>
                        </article>
                      ))}
                      {!recentCalls.length ? (
                        <div className="rounded-lg border border-dashed border-[#d5d8df] bg-[#f8fafc] p-5 text-center">
                          <span className="app-caption">No real calls recorded for this agent yet.</span>
                        </div>
                      ) : null}
                      <button
                        className="app-button-text min-h-10 rounded-lg border border-[#d5d8df] bg-white px-3 text-[#2563eb]"
                        type="button"
                        onClick={() => router.push("/dashboard/calls")}
                      >
                        Open all call logs
                      </button>
                    </div>
                  </div>
                ) : null}

                {activeTab === "widget" ? (
                  <div className="grid gap-4">
                    <ToggleRow
                      title="Enable public widget"
                      detail="Allow website visitors to start browser voice sessions."
                      enabled={selectedAgent.widget.enabled}
                      onChange={(enabled) => updateSelectedAgent({ widget: { ...selectedAgent.widget, enabled } })}
                    />
                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_120px]">
                        <InputField label="Public widget key" value={selectedAgent.widget.publicKey} onChange={(value) => updateSelectedAgent({ widget: { ...selectedAgent.widget, publicKey: value } })} />
                        <button
                          className="app-button-text min-h-10 self-end rounded-lg border border-[#d5d8df] bg-white px-3 text-[#2563eb]"
                          type="button"
                          onClick={handleGenerateWidgetKey}
                        >
                          Generate
                        </button>
                      </div>
                      <InputField
                        label="Allowed domains (comma separated)"
                        value={selectedAgent.widget.allowedDomains.join(", ")}
                        placeholder="example.com, app.example.com"
                        onChange={(value) => updateSelectedAgent({ widget: { ...selectedAgent.widget, allowedDomains: value.split(",").map((item) => item.trim()).filter(Boolean) } })}
                      />
                    </div>

                    <div className="grid gap-3 lg:grid-cols-4">
                      <SelectField
                        label="Widget theme"
                        defaultValue="auto"
                        value={selectedAgent.widget.theme}
                        options={["light", "dark", "auto"]}
                        onChange={(value) => updateSelectedAgent({ widget: { ...selectedAgent.widget, theme: value as AgentWidget["theme"] } })}
                      />
                      <SelectField
                        label="Position"
                        defaultValue="bottom-right"
                        value={selectedAgent.widget.position}
                        options={["bottom-right", "bottom-left", "inline"]}
                        onChange={(value) => updateSelectedAgent({ widget: { ...selectedAgent.widget, position: value as AgentWidget["position"] } })}
                      />
                      <InputField label="Button text" value={selectedAgent.widget.buttonText} onChange={(value) => updateSelectedAgent({ widget: { ...selectedAgent.widget, buttonText: value } })} />
                      <label className="app-label grid gap-2">
                        <span>Accent color</span>
                        <span className="grid grid-cols-[44px_minmax(0,1fr)] gap-2">
                          <input
                            aria-label="Widget accent color"
                            className="h-10 w-11 rounded-lg border border-[#dfe3ea] bg-white p-1"
                            type="color"
                            value={selectedAgent.widget.accentColor}
                            onChange={(event) => updateSelectedAgent({ widget: { ...selectedAgent.widget, accentColor: event.target.value } })}
                          />
                          <input
                            className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] bg-white px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                            value={selectedAgent.widget.accentColor}
                            onChange={(event) => updateSelectedAgent({ widget: { ...selectedAgent.widget, accentColor: event.target.value } })}
                          />
                        </span>
                      </label>
                    </div>

                    {selectedAgent.status !== "Live" || !selectedAgent.widget.publicKey ? (
                      <p className="app-caption m-0 rounded-lg border border-[#fde68a] bg-[#fffbeb] p-3 text-[#92400e]">
                        Public widgets require a Live agent and a saved widget key.
                      </p>
                    ) : null}

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                      <article className="rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="app-section-title m-0">Embed code</h3>
                            <span className="app-caption">
                              Paste this before the closing body tag on another website.
                            </span>
                          </div>
                          <button
                            className="app-button-text inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-[#d5d8df] bg-white px-3 text-[#111827]"
                            type="button"
                            onClick={handleCopyWidgetCode}
                          >
                            <Icon icon="copy" />
                            Copy
                          </button>
                        </div>

                        <pre className="m-0 max-h-[220px] overflow-auto rounded-lg bg-[#111827] p-3 text-xs leading-5 text-[#cbd5e1]">
                          {widgetEmbedCode}
                        </pre>
                      </article>

                      <article className="rounded-lg border border-[#e5e7eb] bg-white p-3">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="app-section-title m-0">Preview</h3>
                            <span className="app-caption">Public site widget</span>
                          </div>
                          <span className="grid size-8 place-items-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                            <Icon icon="widget" />
                          </span>
                        </div>

                        <div className="grid min-h-[170px] content-end rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-3">
                          <div className="justify-self-end rounded-lg border border-[#dbeafe] bg-white p-3 shadow-sm">
                            <div className="mb-3 flex items-center gap-2">
                              <span
                                className="grid size-8 place-items-center rounded-full text-white"
                                style={{ backgroundColor: selectedAgent.widget.accentColor }}
                              >
                                <Icon icon="phone" />
                              </span>
                              <span>
                                <strong className="app-strong block">{selectedAgent.name}</strong>
                                <span className="app-caption">Voice assistant</span>
                              </span>
                            </div>
                            <button
                              className="app-button-text inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg px-3 text-white"
                              style={{ backgroundColor: selectedAgent.widget.accentColor }}
                              type="button"
                            >
                              <Icon icon="phone" />
                              {selectedAgent.widget.buttonText}
                            </button>
                          </div>
                        </div>
                        <button
                          className="app-button-text mt-3 min-h-9 w-full rounded-lg border border-[#d5d8df] bg-white px-3 text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
                          type="button"
                          disabled={!selectedAgent.widget.publicKey}
                          onClick={() => window.open(widgetUrl, "_blank", "noopener,noreferrer")}
                        >
                          Open widget page
                        </button>
                      </article>
                    </div>

                    <div className="grid gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3">
                      <div>
                        <h3 className="app-section-title m-0">Metadata parameters</h3>
                        <span className="app-caption">
                          These query values can become session metadata for prompt variables and webhooks.
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.dynamicVariables.map((item) => (
                          <span
                            className="app-label rounded-full border border-[#dbeafe] bg-[#eff6ff] px-2.5 py-1 text-[#2563eb]"
                            key={item}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      <code className="app-caption block rounded-lg bg-[#f8fafc] p-3 text-[#334155]">
                        {widgetUrl}
                      </code>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>

          </section>

          <aside className="grid min-w-0 content-start gap-4 xl:col-span-2 xl:grid-cols-2 2xl:col-span-1 2xl:grid-cols-1">
            <article className="min-w-0 overflow-hidden rounded-xl border border-[#dbe4f0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <div className="flex min-h-[68px] items-center justify-between gap-3 border-b border-[#dbeafe] bg-gradient-to-r from-[#eff6ff] via-white to-[#ecfeff] px-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2.5 shrink-0">
                      {selectedRuntimeStreamState === "live" ? <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" /> : null}
                      <span className={`relative inline-flex size-2.5 rounded-full ${selectedRuntimeStreamState === "live" ? "bg-emerald-500" : "bg-amber-400"}`} />
                    </span>
                    <h2 className="app-section-title m-0">Runtime health</h2>
                  </div>
                  <span className="app-caption block truncate">
                    {selectedRuntimeStreamState === "live"
                      ? `Live stream${selectedRuntimeSnapshot?.observedAt ? ` · ${new Date(selectedRuntimeSnapshot.observedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : ""}`
                      : selectedRuntimeStreamState === "connecting" ? "Connecting live stream…" : "Reconnecting live stream…"}
                  </span>
                </div>
                <span className={`app-label shrink-0 rounded-full px-2.5 py-1 ${dispatchBadge(selectedRuntimeSnapshot?.dispatch.state)}`} title={selectedRuntimeSnapshot?.dispatch.message}>
                  {dispatchLabel(selectedRuntimeSnapshot?.dispatch.state)}
                </span>
              </div>

              <div className="grid gap-4 p-4">
                <div className="grid grid-cols-3 gap-2">
                  {selectedRuntimeItems.map((item) => (
                    <span className="min-w-0 rounded-lg border border-[#edf2f7] bg-[#f8fafc] p-2.5" key={item.label} title={item.label === "Region" && selectedRuntimeRegion ? selectedRuntimeRegion : undefined}>
                      <span className="app-label block truncate">{item.label}</span>
                      <strong className={`app-strong block truncate ${item.tone}`}>{item.value}</strong>
                    </span>
                  ))}
                </div>

                <div className="grid min-w-0 divide-y divide-[#eef2f7] rounded-lg border border-[#edf2f7] px-3">
                  <span className="flex min-w-0 items-center justify-between gap-3 py-2.5">
                    <span className="app-caption shrink-0">Worker</span>
                    <strong className="app-strong min-w-0 truncate text-right" title={selectedRuntimeSnapshot?.dispatch.workerId || "No active worker"}>
                      {selectedRuntimeSnapshot?.dispatch.workerId || "No active worker"}
                    </strong>
                  </span>
                  <span className="flex min-w-0 items-center justify-between gap-3 py-2.5">
                    <span className="app-caption shrink-0">STT</span>
                    <strong className="app-strong min-w-0 truncate text-right" title={selectedRuntimeSnapshot?.pipeline.stt}>
                      {selectedRuntimeSnapshot?.pipeline.stt ?? (selectedAgent.pipelineMode === "realtime" ? "Native realtime" : `${selectedAgent.sttProvider}/${selectedAgent.sttModel}`)}
                    </strong>
                  </span>
                  <span className="flex items-center justify-between gap-3 py-2.5">
                    <span className="app-caption">Latency</span>
                    <strong className={`app-strong ${selectedRuntimeSnapshot?.latency.latestMs !== null && selectedRuntimeSnapshot?.latency.latestMs !== undefined ? selectedTone.text : "text-[#64748b]"}`}>
                      {selectedRuntimeSnapshot?.latency.latestMs !== null && selectedRuntimeSnapshot?.latency.latestMs !== undefined
                        ? `${selectedRuntimeSnapshot.latency.latestMs} ms`
                        : "No samples"}
                    </strong>
                  </span>
                  <span className="flex items-center justify-between gap-3 py-2.5">
                    <span className="app-caption">Concurrency</span>
                    <strong className="app-strong">
                      {selectedRuntimeSnapshot ? `${selectedRuntimeSnapshot.activeCalls} / ${selectedRuntimeSnapshot.maxConcurrentCalls} active` : "Connecting…"}
                    </strong>
                  </span>
                  <span className="flex items-center justify-between gap-3 py-2.5">
                    <span className="app-caption">Hours guard</span>
                    <strong className="app-strong" title={selectedRuntimeSnapshot?.businessHours.timezone}>
                      {!selectedRuntimeSnapshot
                        ? "Connecting…"
                        : !selectedRuntimeSnapshot.businessHours.enabled
                          ? "Off"
                          : selectedRuntimeSnapshot.businessHours.open ? "Open" : "Closed"}
                    </strong>
                  </span>
                </div>
              </div>
            </article>

            <article className="rounded-lg border border-[#dfe3ea] bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="app-section-title m-0">Phone route</h2>
                  <span className="app-caption block truncate">
                    {selectedRuntimeSnapshot
                      ? [selectedRuntimeSnapshot.phoneRoute.provider, selectedRuntimeSnapshot.phoneRoute.direction].filter(Boolean).join(" · ") || "No route assigned"
                      : "Connecting live stream…"}
                  </span>
                </div>
                <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${selectedRuntimeSnapshot?.phoneRoute.status === "Ready" ? "bg-[#ecfdf5] text-[#059669]" : "bg-[#fff7ed] text-[#d97706]"}`}>
                  <Icon icon="route" />
                </span>
              </div>

              <div className="grid gap-3">
                <div className="min-w-0">
                  <span className="app-label block">Number</span>
                  <strong className="app-value block truncate" title={selectedRuntimeSnapshot?.phoneRoute.number || selectedAgent.phone}>
                    {selectedRuntimeSnapshot?.phoneRoute.number || selectedAgent.phone || "Not assigned"}
                  </strong>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <span>
                    <span className="app-label block">Calls</span>
                    <strong className="app-strong block">{selectedRuntimeSnapshot?.phoneRoute.totalCalls ?? "—"}</strong>
                    <span className="app-caption">{selectedRuntimeSnapshot ? `${selectedRuntimeSnapshot.phoneRoute.activeCalls} active` : "Connecting…"}</span>
                  </span>
                  <span>
                    <span className="app-label block">Completion</span>
                    <strong className="app-strong text-[#059669]">
                      {selectedRuntimeSnapshot?.phoneRoute.completionRate === null || selectedRuntimeSnapshot?.phoneRoute.completionRate === undefined
                        ? "—"
                        : `${selectedRuntimeSnapshot.phoneRoute.completionRate}%`}
                    </strong>
                  </span>
                </div>
                {selectedRuntimeSnapshot ? (
                  <div className="flex flex-wrap gap-2 border-t border-[#eef2f7] pt-3">
                    {selectedRuntimeSnapshot.phoneRoute.direction !== "Outbound" && selectedRuntimeSnapshot.phoneRoute.direction ? (
                      <span className={`app-label rounded-full px-2.5 py-1 ${selectedRuntimeSnapshot.phoneRoute.inboundReady ? "bg-[#dcfce7] text-[#047857]" : "bg-[#fee2e2] text-[#b91c1c]"}`}>
                        Inbound {selectedRuntimeSnapshot.phoneRoute.inboundReady ? "ready" : "not ready"}
                      </span>
                    ) : null}
                    {selectedRuntimeSnapshot.phoneRoute.direction !== "Inbound" && selectedRuntimeSnapshot.phoneRoute.direction ? (
                      <span className={`app-label rounded-full px-2.5 py-1 ${selectedRuntimeSnapshot.phoneRoute.outboundReady ? "bg-[#dcfce7] text-[#047857]" : "bg-[#fee2e2] text-[#b91c1c]"}`}>
                        Outbound {selectedRuntimeSnapshot.phoneRoute.outboundReady ? "ready" : "not ready"}
                      </span>
                    ) : null}
                    {!selectedRuntimeSnapshot.phoneRoute.direction ? (
                      <span className="app-label rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[#64748b]">Unassigned</span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>

            <article className="rounded-lg border border-[#dfe3ea] bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="app-section-title m-0">Deploy checklist</h2>
                  <span className="app-caption">Required before live traffic</span>
                </div>
                <span className="grid size-8 place-items-center rounded-lg bg-[#ecfdf5] text-[#059669]">
                  <Icon icon="shield" />
                </span>
              </div>

              <div className="grid gap-3">
                {deployChecklist.map((item) => (
                  <div className="flex items-center gap-3" key={item}>
                    <span className="size-2 rounded-full bg-[#059669]" />
                    <span className="app-body">{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-[#dfe3ea] bg-[#111827] p-4 text-white">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="app-section-title m-0 text-white">Config preview</h2>
                <Icon icon="code" />
              </div>
              <pre className="m-0 overflow-hidden text-xs leading-5 text-[#cbd5e1]">
{`{
  "architecture": "${selectedAgent.pipelineMode}",
  "language": "${selectedAgent.language}",
  "voice": "${selectedAgent.voice}",
  "realtime": "${selectedAgent.realtimeProvider}/${selectedAgent.realtimeModel}",
  "stt": "${selectedAgent.sttProvider}/${selectedAgent.sttModel}",
  "llm": "${selectedAgent.llmProvider}/${selectedAgent.llmModel}",
  "tts": "${selectedAgent.ttsProvider}/${selectedAgent.ttsModel}",
  "opening_mode": "${selectedAgent.firstMessageMode}",
  "endpointing": "${selectedAgent.behavior.endpointingMode}",
  "timezone": "${selectedAgent.businessHours.timezone}",
  "voice_speed": ${selectedAgent.voiceSpeed},
  "voice_pitch": ${selectedAgent.voicePitch},
  "concurrent_calls": ${selectedAgent.maxConcurrentCalls},
  "business_hours": ${selectedAgent.businessHoursEnabled},
  "tools": ${selectedAgent.tools.length},
  "knowledge_base": ${selectedAgent.knowledgeDocuments.length},
  "version": ${selectedAgent.version}
}`}
              </pre>
            </article>
          </aside>
        </section>
      </section>
      {showTestCall ? (
        <TestCallPanel
          agentId={selectedAgent.id}
          agentName={selectedAgent.name}
          onRegionChange={(region) => setRuntimeRegions((current) => ({ ...current, [selectedAgent.id]: region }))}
          onClose={() => setShowTestCall(false)}
        />
      ) : null}
      {notice ? (
        <div className="fixed right-4 top-4 z-50 flex w-[min(380px,calc(100vw-32px))] items-start gap-3 rounded-xl border border-[#dbeafe] bg-white p-4 text-[#111827] shadow-[0_18px_48px_rgba(15,23,42,0.18)]">
          <span className="mt-1 size-2.5 shrink-0 rounded-full bg-[#2563eb]" />
          <p className="app-control-text m-0 min-w-0 flex-1 text-[#334155]">{notice}</p>
          <button
            aria-label="Dismiss notification"
            className="grid size-7 shrink-0 place-items-center rounded-lg text-[#64748b] transition hover:bg-[#f1f5f9] hover:text-[#111827]"
            type="button"
            onClick={() => setNotice("")}
          >
            x
          </button>
        </div>
      ) : null}
    </main>
  );
}

function mapBackendAgent(agent: BackendAgent): VoiceAgent {
  const firstMessageMode: FirstMessageMode = agent.behavior?.userStartsFirst
    ? "user-speaks-first"
    : agent.firstMessageMode ?? "assistant-speaks-first";
  const realtimeProvider = agent.realtimeProvider ?? "openai";

  return {
    id: agent._id,
    name: agent.name,
    team: agent.team,
    status: agent.status,
    phone: agent.phone || "Not assigned",
    language: agent.language,
    voice: agent.voice,
    pipelineMode: agent.pipelineMode ?? "realtime",
    realtimeProvider,
    realtimeModel: normalizeRealtimeModel(realtimeProvider, agent.realtimeModel ?? "gpt-realtime"),
    llmProvider: agent.llmProvider ?? "openai",
    llmModel: agent.llmModel ?? "gpt-4.1-mini",
    sttProvider: agent.sttProvider ?? "openai",
    sttModel: agent.sttModel ?? "gpt-4o-mini-transcribe",
    ttsProvider: agent.ttsProvider ?? "openai",
    ttsModel: agent.ttsModel ?? "gpt-4o-mini-tts",
    temperature: agent.temperature ?? 0.35,
    maxConcurrentCalls: agent.maxConcurrentCalls ?? 5,
    voiceSpeed: agent.voiceSpeed ?? 1,
    voicePitch: agent.voicePitch ?? 0,
    interruptionSensitivity: agent.interruptionSensitivity ?? "medium",
    backgroundNoise: agent.backgroundNoise ?? "none",
    callbackEmail: agent.callbackEmail ?? "",
    businessHoursEnabled: agent.businessHoursEnabled ?? false,
    businessHours: {
      ...defaultBusinessHours,
      ...agent.businessHours,
      schedule: agent.businessHours?.schedule?.length ? agent.businessHours.schedule : defaultBusinessHours.schedule,
    },
    latency: formatLatency(agent.latencyMetrics),
    calls: 0,
    success: "-",
    prompt: agent.prompt,
    firstMessage: agent.firstMessage,
    firstMessageMode,
    behavior: {
      ...defaultBehavior,
      ...agent.behavior,
      userStartsFirst: firstMessageMode === "user-speaks-first",
    },
    callSettings: { ...defaultCallSettings, ...agent.callSettings },
    tools: (agent.tools ?? []).map(normalizeTool),
    knowledgeDocuments: agent.knowledgeDocuments ?? [],
    dynamicVariables: agent.dynamicVariables ?? ["FromPhone", "ToPhone"],
    prefetchWebhook: agent.prefetchWebhook ?? "",
    endOfCallWebhook: agent.endOfCallWebhook ?? "",
    widget: { ...defaultWidget, ...agent.widget },
    version: agent.version ?? 1,
  };
}
