"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
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
  type AgentTemplate,
  type AgentTool,
  type AgentWidget,
  type BusinessHoursDay,
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

const defaultBehavior: AgentBehavior = {
  interruptions: true,
  userStartsFirst: false,
  autoFillResponses: true,
  agentCanTerminate: true,
  voicemailHandling: true,
  dtmfDial: false,
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

const fallbackCatalog: ModelCatalog = {
  realtime: [
    { provider: "openai", label: "OpenAI Realtime", configured: true, models: ["gpt-realtime"], voices: ["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse", "marin", "cedar"] },
    { provider: "gemini", label: "Gemini Live", configured: true, models: ["gemini-live-2.5-flash-native-audio"], voices: ["Aoede"] },
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
  ],
  tts: [
    { provider: "openai", label: "OpenAI", configured: true, models: ["gpt-4o-mini-tts"], voices: ["alloy"] },
    { provider: "gemini", label: "Gemini", configured: true, models: ["gemini-2.5-flash-tts"], voices: ["Aoede"] },
    {
      provider: "sarvam",
      label: "Sarvam",
      configured: true,
      models: ["bulbul:v3"],
      voices: ["shubh"],
      languages: fallbackLanguageCatalog.filter((language) => language.sarvamTts),
    },
  ],
};

function getProvider(catalog: ModelCatalog, layer: keyof ModelCatalog, provider: string) {
  return catalog[layer].find((item) => item.provider === provider) ?? catalog[layer][0];
}

function getVoices(
  catalog: ModelCatalog,
  layer: "realtime" | "tts",
  provider: string,
  model: string,
) {
  const item = getProvider(catalog, layer, provider);
  return item.voicesByModel?.[model] ?? item.voices ?? [];
}

type SelectOption = string | { value: string; label: string };

function getSelectOptionValue(option: SelectOption) {
  return typeof option === "string" ? option : option.value;
}

function getSelectOptionLabel(option: SelectOption) {
  return typeof option === "string" ? option : option.label;
}

function getProviderLanguages(
  catalog: ModelCatalog,
  layer: "stt" | "tts",
  provider: string,
  languageCatalog: VoiceLanguageOption[],
) {
  const providerLanguages = getProvider(catalog, layer, provider).languages;
  if (providerLanguages?.length) return [...providerLanguages];
  if (provider === "sarvam") {
    return languageCatalog.filter((language) => (layer === "tts" ? language.sarvamTts : language.sarvamStt));
  }
  return languageCatalog.filter((language) => !language.value.includes("Auto"));
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
  if (agent.pipelineMode === "pipeline" && agent.ttsProvider === "sarvam") {
    options = getProviderLanguages(catalog, "tts", "sarvam", languageCatalog);
  } else if (agent.pipelineMode === "pipeline" && agent.sttProvider === "sarvam") {
    options = getProviderLanguages(catalog, "stt", "sarvam", languageCatalog);
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

const runtimeItems = [
  { label: "Dispatch", value: "Ready", tone: "text-[#059669]" },
  { label: "Model", value: "Balanced", tone: "text-[#2563eb]" },
  { label: "Region", value: "US West", tone: "text-[#111827]" },
];

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

const deployChecklist = [
  "Prompt and first message ready",
  "Voice, STT, and LLM selected",
  "Tools have params and webhook URLs",
  "Knowledge files attached",
  "Phone route assigned",
  "Privacy and recording reviewed",
];

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
    <label className="flex items-start justify-between gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3">
      <span>
        <span className="app-strong block">{title}</span>
        <span className="app-caption block">{detail}</span>
      </span>
      <input
        className="mt-1 size-4 accent-[#2563eb]"
        type="checkbox"
        checked={enabled}
        onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
      />
    </label>
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
  return (
    <label className="app-label grid gap-2">
      <span>{label}</span>
      <span className="grid grid-cols-[minmax(0,1fr)_40px] gap-2">
        <select
          className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] bg-white px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
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
  const [agentTemplates, setAgentTemplates] = useState<AgentTemplate[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallRecord[]>([]);
  const [toolDraft, setToolDraft] = useState<AgentTool>({
    name: "",
    description: "",
    method: "POST",
    url: "",
    timeoutSeconds: 8,
    enabled: true,
  });
  const [knowledgeName, setKnowledgeName] = useState("");
  const [knowledgeContent, setKnowledgeContent] = useState("");
  const [variableDraft, setVariableDraft] = useState("");
  const [previewingVoice, setPreviewingVoice] = useState("");
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
  const widgetUrl = `https://app.your-voice-platform.com/agents/embedded?id=${selectedAgent.id}&k=${selectedAgent.widget.publicKey || "not-configured"}`;
  const widgetEmbedCode = `<div id="voice-agent-widget"></div>
<script
  src="https://app.your-voice-platform.com/widget.js"
  data-agent-id="${selectedAgent.id}"
   data-public-key="${selectedAgent.widget.publicKey}"
   data-theme="${selectedAgent.widget.theme}"
   data-position="${selectedAgent.widget.position}"
   data-accent="${selectedAgent.widget.accentColor}"
   data-metadata="${selectedAgent.dynamicVariables.join(",")}"
></script>`;

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
    if (!session || activeTab !== "calls" || !selectedAgentId || selectedAgentId === "loading" || selectedAgentId === "maya") return;
    void voiceApi
      .calls({ agentId: selectedAgentId, limit: 5 })
      .then((result) => setRecentCalls(result.calls))
      .catch(() => setRecentCalls([]));
  }, [activeTab, selectedAgentId, session]);

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
        behavior: selectedAgent.behavior,
        callSettings: selectedAgent.callSettings,
        tools: selectedAgent.tools,
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

  function addTool() {
    if (!toolDraft.name.trim() || !toolDraft.url.trim()) {
      setNotice("Enter a function name and webhook URL.");
      return;
    }
    updateSelectedAgent({ tools: [...selectedAgent.tools, { ...toolDraft, name: toolDraft.name.trim(), url: toolDraft.url.trim() }] });
    setToolDraft({ name: "", description: "", method: "POST", url: "", timeoutSeconds: 8, enabled: true });
  }

  function addKnowledgeDocument() {
    if (!knowledgeName.trim() || !knowledgeContent.trim()) {
      setNotice("Enter a knowledge document name and content.");
      return;
    }
    updateSelectedAgent({
      knowledgeDocuments: [
        ...selectedAgent.knowledgeDocuments,
        { name: knowledgeName.trim(), content: knowledgeContent.trim(), status: "ready" },
      ],
    });
    setKnowledgeName("");
    setKnowledgeContent("");
  }

  function addVariable() {
    const value = variableDraft.trim().replace(/[{}]/g, "");
    if (!value || selectedAgent.dynamicVariables.includes(value)) return;
    updateSelectedAgent({ dynamicVariables: [...selectedAgent.dynamicVariables, value] });
    setVariableDraft("");
  }

  async function handleCopyWidgetCode() {
    try {
      await navigator.clipboard.writeText(widgetEmbedCode);
      setNotice("Widget embed code copied.");
    } catch {
      setNotice("Could not copy automatically. Select the code and copy it manually.");
    }
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
    <main className="grid min-h-screen bg-[#f7f8fb] text-[#111827] lg:grid-cols-[64px_minmax(0,1fr)]">
      <DashboardSidebar
        activeLabel="Voice Agents"
        userInitials={getInitials(session.name)}
        onLogout={handleLogout}
      />

      <section className="grid content-start gap-4 p-3 sm:p-4">
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
              onClick={() => {
                void handleSave().then((saved) => {
                  if (saved) setShowTestCall(true);
                });
              }}
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

        {notice ? (
          <p className="app-control-text m-0 rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-3 py-2 text-[#1d4ed8]">
            {notice}
          </p>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
          <aside className="overflow-hidden rounded-lg border border-[#dfe3ea] bg-white">
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

          <section className="grid content-start gap-4">
            <article className="overflow-hidden rounded-lg border border-[#dfe3ea] bg-white">
              <div className="flex flex-col gap-3 border-b border-[#e5e7eb] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="app-section-title m-0">Agent builder</h2>
                  <span className="app-caption">
                    {selectedAgent.name} / {selectedAgent.team}
                  </span>
                </div>
                <div className="flex gap-1 rounded-lg border border-[#dfe3ea] bg-[#f8fafc] p-1">
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
                        onChange={(language) => updateSelectedAgent({ language })}
                        options={languageOptions}
                      />
                      <SelectField
                        label="Voice architecture"
                        defaultValue={selectedAgent.pipelineMode}
                        value={selectedAgent.pipelineMode}
                        onChange={(pipelineMode) => {
                          const nextMode = pipelineMode as PipelineMode;
                          const nextVoices =
                            nextMode === "realtime"
                              ? getVoices(modelCatalog, "realtime", selectedAgent.realtimeProvider, selectedAgent.realtimeModel)
                              : getVoices(modelCatalog, "tts", selectedAgent.ttsProvider, selectedAgent.ttsModel);
                          const nextLanguage =
                            nextMode === "pipeline" && selectedAgent.ttsProvider === "sarvam"
                              ? coerceLanguage(
                                  selectedAgent.language,
                                  getProviderLanguages(modelCatalog, "tts", "sarvam", languageCatalog),
                                )
                              : selectedAgent.language;
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
                              updateSelectedAgent({
                                realtimeProvider: provider as RealtimeProvider,
                                realtimeModel: next.models[0],
                                voice: getVoices(modelCatalog, "realtime", provider, next.models[0])[0] ?? selectedAgent.voice,
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
                            options={[...getVoices(modelCatalog, "realtime", selectedAgent.realtimeProvider, selectedAgent.realtimeModel)]}
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
                              const nextLanguage =
                                provider === "sarvam" && selectedAgent.ttsProvider !== "sarvam"
                                  ? coerceLanguage(
                                      selectedAgent.language,
                                      getProviderLanguages(modelCatalog, "stt", provider, languageCatalog),
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
                                provider === "sarvam"
                                  ? coerceLanguage(
                                      selectedAgent.language,
                                      getProviderLanguages(modelCatalog, "tts", provider, languageCatalog),
                                    )
                                  : selectedAgent.language;
                              updateSelectedAgent({
                                ttsProvider: provider as PipelineProvider,
                                ttsModel: next.models[0],
                                language: nextLanguage,
                                voice: getVoices(modelCatalog, "tts", provider, next.models[0])[0] ?? selectedAgent.voice,
                              });
                            }}
                            options={modelCatalog.tts.map((item) => item.provider)}
                          />
                          <SelectField
                            label="Text-to-speech model"
                            defaultValue={selectedAgent.ttsModel}
                            value={selectedAgent.ttsModel}
                            onChange={(ttsModel) => {
                              const voices = getVoices(modelCatalog, "tts", selectedAgent.ttsProvider, ttsModel);
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
                            options={[...getVoices(modelCatalog, "tts", selectedAgent.ttsProvider, selectedAgent.ttsModel)]}
                          />
                        </div>
                      </section>
                    )}

                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                      <div className="rounded-lg border border-[#e5e7eb] bg-white p-3">
                        <span className="app-label block">Active runtime</span>
                        <strong className="app-strong">
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
                    <div className="grid gap-3 lg:grid-cols-2">
                      {flowSettings.map((setting) => (
                        <ToggleRow
                          key={setting.title}
                          title={setting.title}
                          detail={setting.detail}
                          enabled={Boolean(selectedAgent.behavior[setting.field])}
                          onChange={(enabled) =>
                            updateSelectedAgent({
                              behavior: { ...selectedAgent.behavior, [setting.field]: enabled },
                            })
                          }
                        />
                      ))}
                    </div>

                    <div className="grid gap-3 lg:grid-cols-3">
                      <InputField
                        label="Response delay (ms)"
                        value={String(selectedAgent.behavior.responseDelayMs)}
                        onChange={(value) => updateSelectedAgent({ behavior: { ...selectedAgent.behavior, responseDelayMs: Number(value) || 0 } })}
                      />
                      <InputField
                        label="Max call duration (seconds)"
                        value={String(selectedAgent.behavior.maxCallDurationSeconds)}
                        onChange={(value) => updateSelectedAgent({ behavior: { ...selectedAgent.behavior, maxCallDurationSeconds: Number(value) || 30 } })}
                      />
                      <InputField
                        label="Max idle time (seconds)"
                        value={String(selectedAgent.behavior.maxIdleSeconds)}
                        onChange={(value) => updateSelectedAgent({ behavior: { ...selectedAgent.behavior, maxIdleSeconds: Number(value) || 5 } })}
                      />
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                      <InputField label="Transfer phone" value={selectedAgent.behavior.transferPhone} placeholder="+14155550123" onChange={(value) => updateSelectedAgent({ behavior: { ...selectedAgent.behavior, transferPhone: value } })} />
                      <InputField label="Timezone" value={selectedAgent.behavior.timezone} onChange={(value) => updateSelectedAgent({ behavior: { ...selectedAgent.behavior, timezone: value } })} />
                    </div>

                    <section className="grid gap-3 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
                      <ToggleRow
                        title="Business hours guard"
                        detail="Block browser and phone calls outside the schedule below."
                        enabled={selectedAgent.businessHoursEnabled}
                        onChange={(businessHoursEnabled) => updateSelectedAgent({ businessHoursEnabled })}
                      />
                      <InputField
                        label="Business-hours timezone"
                        value={selectedAgent.businessHours.timezone}
                        placeholder="Asia/Kolkata"
                        onChange={(timezone) => updateBusinessHours({ timezone })}
                      />
                      <div className="grid gap-2">
                        {selectedSchedule.map((item) => (
                          <div
                            className="grid gap-2 rounded-lg border border-[#e5e7eb] bg-white p-3 sm:grid-cols-[64px_88px_1fr_1fr]"
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
                    </section>

                    <label className="app-label grid gap-2">
                      <span>Voicemail message</span>
                      <textarea
                        className="app-control-text min-h-20 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                        value={selectedAgent.behavior.voicemailMessage}
                        onChange={(event) => updateSelectedAgent({ behavior: { ...selectedAgent.behavior, voicemailMessage: event.target.value } })}
                      />
                    </label>
                  </div>
                ) : null}

                {activeTab === "tools" ? (
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      {selectedAgent.tools.map((tool, index) => (
                        <article
                          className="grid gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3 md:grid-cols-[36px_minmax(0,1fr)_80px_70px]"
                          key={tool._id ?? `${tool.name}-${index}`}
                        >
                          <span className="grid size-9 place-items-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                            <Icon icon="tool" />
                          </span>
                          <span className="min-w-0">
                            <strong className="app-strong block truncate">{tool.name}</strong>
                            <span className="app-caption block truncate">{tool.url}</span>
                          </span>
                          <span className="app-label self-center rounded-full bg-[#f8fafc] px-2 py-1 text-center">
                            {tool.method}
                          </span>
                          <button className="app-label text-rose-600" type="button" onClick={() => updateSelectedAgent({ tools: selectedAgent.tools.filter((_, toolIndex) => toolIndex !== index) })}>Remove</button>
                        </article>
                      ))}
                      {!selectedAgent.tools.length ? <span className="app-caption rounded-lg border border-dashed border-[#d5d8df] p-4 text-center">No webhook tools configured.</span> : null}
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                      <InputField label="Function name" value={toolDraft.name} placeholder="check_availability" onChange={(value) => setToolDraft((current) => ({ ...current, name: value }))} />
                      <InputField label="Webhook URL" value={toolDraft.url} placeholder="https://api.company.com/availability" onChange={(value) => setToolDraft((current) => ({ ...current, url: value }))} />
                      <SelectField label="Method" defaultValue="POST" value={toolDraft.method} options={["GET", "POST", "PUT", "PATCH", "DELETE"]} onChange={(value) => setToolDraft((current) => ({ ...current, method: value as AgentTool["method"] }))} />
                      <InputField label="Timeout (seconds)" value={String(toolDraft.timeoutSeconds)} onChange={(value) => setToolDraft((current) => ({ ...current, timeoutSeconds: Number(value) || 8 }))} />
                      <InputField label="Description" value={toolDraft.description} placeholder="What the agent should use this tool for" onChange={(value) => setToolDraft((current) => ({ ...current, description: value }))} />
                      <button className="app-button-text min-h-10 self-end rounded-lg bg-[#1438f5] px-3 text-white" type="button" onClick={addTool}>Add webhook tool</button>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                      <InputField label="Prefetch data webhook" value={selectedAgent.prefetchWebhook} placeholder="https://api.company.com/prefetch" onChange={(value) => updateSelectedAgent({ prefetchWebhook: value })} />
                      <InputField label="End-of-call webhook" value={selectedAgent.endOfCallWebhook} placeholder="https://api.company.com/calls/end" onChange={(value) => updateSelectedAgent({ endOfCallWebhook: value })} />
                    </div>

                    <div className="grid gap-3 rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-3">
                      <span className="app-strong">Dynamic variables</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.dynamicVariables.map((variable) => (
                          <button
                            className="app-label rounded-full border border-[#dbeafe] bg-white px-2.5 py-1 text-[#2563eb]"
                            key={variable}
                            type="button"
                            title="Remove variable"
                            onClick={() => updateSelectedAgent({ dynamicVariables: selectedAgent.dynamicVariables.filter((item) => item !== variable) })}
                          >
                            {`{${variable}}`} x
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input className="app-control-text min-h-10 flex-1 rounded-lg border border-[#dfe3ea] bg-white px-3 outline-none" value={variableDraft} placeholder="customerID" onChange={(event) => setVariableDraft(event.target.value)} />
                        <button className="app-button-text rounded-lg border border-[#d5d8df] bg-white px-3" type="button" onClick={addVariable}>Add</button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {activeTab === "calls" ? (
                  <div className="grid gap-4">
                    <div className="grid gap-3 lg:grid-cols-3">
                      <InputField label="Assigned phone" defaultValue={selectedAgent.phone} />
                      <SelectField label="Route mode" defaultValue="Inbound and outbound" options={["Inbound and outbound", "Inbound only", "Outbound only"]} />
                      <InputField label="Test destination" placeholder="+14155550123" />
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
                      detail="Allow the configured domains to start browser voice sessions."
                      enabled={selectedAgent.widget.enabled}
                      onChange={(enabled) => updateSelectedAgent({ widget: { ...selectedAgent.widget, enabled } })}
                    />
                    <div className="grid gap-3 lg:grid-cols-2">
                      <InputField label="Public widget key" value={selectedAgent.widget.publicKey} onChange={(value) => updateSelectedAgent({ widget: { ...selectedAgent.widget, publicKey: value } })} />
                      <InputField label="Allowed domains (comma separated)" value={selectedAgent.widget.allowedDomains.join(", ")} onChange={(value) => updateSelectedAgent({ widget: { ...selectedAgent.widget, allowedDomains: value.split(",").map((item) => item.trim()).filter(Boolean) } })} />
                    </div>

                    <div className="grid gap-3 lg:grid-cols-3">
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
                    </div>

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
                              <span className="grid size-8 place-items-center rounded-full bg-[#1438f5] text-white">
                                <Icon icon="phone" />
                              </span>
                              <span>
                                <strong className="app-strong block">{selectedAgent.name}</strong>
                                <span className="app-caption">Voice assistant</span>
                              </span>
                            </div>
                            <button
                              className="app-button-text inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#1438f5] px-3 text-white"
                              type="button"
                            >
                              <Icon icon="phone" />
                              {selectedAgent.widget.buttonText}
                            </button>
                          </div>
                        </div>
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

            <article className="rounded-lg border border-[#dfe3ea] bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="app-section-title m-0">Knowledge base</h2>
                  <span className="app-caption">Persisted context injected into live conversations</span>
                </div>
                <span className="grid size-9 place-items-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                  <Icon icon="book" />
                </span>
              </div>
              <div className="grid gap-2">
                {selectedAgent.knowledgeDocuments.map((document, index) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-lg border border-[#e5e7eb] px-3 py-2"
                    key={document._id ?? `${document.name}-${index}`}
                  >
                    <span className="min-w-0">
                      <span className="app-strong block truncate">{document.name}</span>
                      <span className="app-caption block truncate">{document.content}</span>
                    </span>
                    <button className="app-label text-rose-600" type="button" onClick={() => updateSelectedAgent({ knowledgeDocuments: selectedAgent.knowledgeDocuments.filter((_, documentIndex) => documentIndex !== index) })}>Remove</button>
                  </div>
                ))}
                {!selectedAgent.knowledgeDocuments.length ? <span className="app-caption rounded-lg border border-dashed border-[#d5d8df] p-4 text-center">No knowledge documents added.</span> : null}
                <InputField label="Document name" value={knowledgeName} placeholder="pricing-faq" onChange={setKnowledgeName} />
                <label className="app-label grid gap-2">
                  <span>Knowledge content</span>
                  <textarea className="app-control-text min-h-24 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 text-black outline-none focus:border-[#2563eb]" value={knowledgeContent} onChange={(event) => setKnowledgeContent(event.target.value)} placeholder="Paste approved facts, policies, FAQs, or procedures." />
                </label>
                <button className="app-button-text min-h-10 rounded-lg border border-[#d5d8df] bg-white px-3 text-[#2563eb]" type="button" onClick={addKnowledgeDocument}>Add knowledge document</button>
              </div>
            </article>
          </section>

          <aside className="grid content-start gap-4">
            <article className="rounded-lg border border-[#dfe3ea] bg-white">
              <div className="flex min-h-[58px] items-center justify-between border-b border-[#e5e7eb] px-4">
                <div>
                  <h2 className="app-section-title m-0">Runtime</h2>
                  <span className="app-caption">{selectedAgent.name} status</span>
                </div>
                <span className={`app-label rounded-full px-2.5 py-1 ${selectedTone.badge}`}>
                  {selectedAgent.status}
                </span>
              </div>

              <div className="grid gap-4 p-4">
                <div className="grid grid-cols-3 gap-3">
                  {runtimeItems.map((item) => (
                    <span key={item.label}>
                      <span className="app-label block">{item.label}</span>
                      <strong className={`app-strong ${item.tone}`}>{item.value}</strong>
                    </span>
                  ))}
                </div>

                <div className="grid gap-2">
                  <span className="flex justify-between gap-3">
                    <span className="app-caption">Worker</span>
                    <strong className="app-strong truncate">{selectedAgent.id}-agent</strong>
                  </span>
                  <span className="flex justify-between gap-3">
                    <span className="app-caption">STT</span>
                    <strong className="app-strong truncate">
                      {selectedAgent.pipelineMode === "realtime"
                        ? "Native realtime"
                        : `${selectedAgent.sttProvider}/${selectedAgent.sttModel}`}
                    </strong>
                  </span>
                  <span className="flex justify-between gap-3">
                    <span className="app-caption">Latency</span>
                    <strong className={`app-strong ${selectedTone.text}`}>{selectedAgent.latency}</strong>
                  </span>
                  <span className="flex justify-between gap-3">
                    <span className="app-caption">Concurrency</span>
                    <strong className="app-strong">{selectedAgent.maxConcurrentCalls} calls</strong>
                  </span>
                  <span className="flex justify-between gap-3">
                    <span className="app-caption">Hours guard</span>
                    <strong className="app-strong">{selectedAgent.businessHoursEnabled ? "Enabled" : "Off"}</strong>
                  </span>
                </div>
              </div>
            </article>

            <article className="rounded-lg border border-[#dfe3ea] bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="app-section-title m-0">Phone route</h2>
                  <span className="app-caption">Inbound and outbound line</span>
                </div>
                <span className="grid size-8 place-items-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                  <Icon icon="route" />
                </span>
              </div>

              <div className="grid gap-3">
                <div>
                  <span className="app-label block">Number</span>
                  <strong className="app-value block">{selectedAgent.phone}</strong>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <span>
                    <span className="app-label block">Calls</span>
                    <strong className="app-strong">{selectedAgent.calls}</strong>
                  </span>
                  <span>
                    <span className="app-label block">Success</span>
                    <strong className="app-strong text-[#059669]">{selectedAgent.success}</strong>
                  </span>
                </div>
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
          onClose={() => setShowTestCall(false)}
        />
      ) : null}
    </main>
  );
}

function mapBackendAgent(agent: BackendAgent): VoiceAgent {
  return {
    id: agent._id,
    name: agent.name,
    team: agent.team,
    status: agent.status,
    phone: agent.phone || "Not assigned",
    language: agent.language,
    voice: agent.voice,
    pipelineMode: agent.pipelineMode ?? "realtime",
    realtimeProvider: agent.realtimeProvider ?? "openai",
    realtimeModel: agent.realtimeModel ?? "gpt-realtime",
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
    behavior: { ...defaultBehavior, ...agent.behavior },
    callSettings: { ...defaultCallSettings, ...agent.callSettings },
    tools: agent.tools ?? [],
    knowledgeDocuments: agent.knowledgeDocuments ?? [],
    dynamicVariables: agent.dynamicVariables ?? ["FromPhone", "ToPhone"],
    prefetchWebhook: agent.prefetchWebhook ?? "",
    endOfCallWebhook: agent.endOfCallWebhook ?? "",
    widget: { ...defaultWidget, ...agent.widget },
    version: agent.version ?? 1,
  };
}
