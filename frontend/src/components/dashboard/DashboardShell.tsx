"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { TestCallPanel } from "@/components/dashboard/TestCallPanel";
import {
  clearSession,
  getServerSession,
  getSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import {
  voiceApi,
  type BackendAgent,
  type ModelCatalog,
  type PipelineMode,
  type PipelineProvider,
  type RealtimeProvider,
  type SttProvider,
} from "@/lib/voice";

type AgentStatus = "Live" | "Draft" | "Paused";
type AgentTab = "builder" | "behavior" | "tools" | "calls" | "widget";

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
  latency: string;
  calls: number;
  success: string;
  prompt: string;
  firstMessage: string;
};

const agents: VoiceAgent[] = [
  {
    id: "maya",
    name: "Maya",
    team: "Sales team",
    status: "Live",
    phone: "+1 415 555 0198",
    language: "Multilingual",
    voice: "Clear female",
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
    latency: "620ms",
    calls: 248,
    success: "91%",
    prompt:
      "Qualify leads, understand their timeline and budget, answer pricing questions at a high level, and book a follow-up when the caller is ready.",
    firstMessage: "Hi, this is Maya from Growth Desk. How can I help today?",
  },
  {
    id: "ava",
    name: "Ava",
    team: "Human support",
    status: "Draft",
    phone: "+1 212 555 0144",
    language: "English",
    voice: "Warm support",
    pipelineMode: "pipeline",
    realtimeProvider: "openai",
    realtimeModel: "gpt-realtime",
    llmProvider: "gemini",
    llmModel: "gemini-2.5-flash",
    sttProvider: "sarvam",
    sttModel: "saaras:v3",
    ttsProvider: "sarvam",
    ttsModel: "bulbul:v3",
    temperature: 0.35,
    latency: "710ms",
    calls: 86,
    success: "84%",
    prompt:
      "Help customers with account questions, collect issue details, check knowledge base answers, and transfer urgent billing or security problems.",
    firstMessage: "Thanks for calling support. Tell me what is going on.",
  },
  {
    id: "noah",
    name: "Noah",
    team: "Front desk",
    status: "Paused",
    phone: "+44 20 7946 0182",
    language: "English UK",
    voice: "Calm male",
    pipelineMode: "pipeline",
    realtimeProvider: "gemini",
    realtimeModel: "gemini-live-2.5-flash-native-audio",
    llmProvider: "sarvam",
    llmModel: "sarvam-30b",
    sttProvider: "sarvam",
    sttModel: "saaras:v3",
    ttsProvider: "sarvam",
    ttsModel: "bulbul:v3",
    temperature: 0.35,
    latency: "840ms",
    calls: 54,
    success: "79%",
    prompt:
      "Greet callers, collect appointment needs, verify phone number, and route complex requests to a human receptionist.",
    firstMessage: "Hello, you have reached the front desk. How may I help?",
  },
];

const fallbackCatalog: ModelCatalog = {
  realtime: [
    { provider: "openai", label: "OpenAI Realtime", configured: true, models: ["gpt-realtime"], voices: ["alloy"] },
    { provider: "gemini", label: "Gemini Live", configured: true, models: ["gemini-live-2.5-flash-native-audio"], voices: ["Aoede"] },
  ],
  llm: [
    { provider: "openai", label: "OpenAI", configured: true, models: ["gpt-4.1-mini"] },
    { provider: "gemini", label: "Gemini", configured: true, models: ["gemini-2.5-flash"] },
    { provider: "sarvam", label: "Sarvam", configured: true, models: ["sarvam-30b"] },
  ],
  stt: [
    { provider: "openai", label: "OpenAI", configured: true, models: ["gpt-4o-mini-transcribe"] },
    { provider: "sarvam", label: "Sarvam", configured: true, models: ["saaras:v3"] },
  ],
  tts: [
    { provider: "openai", label: "OpenAI", configured: true, models: ["gpt-4o-mini-tts"], voices: ["alloy"] },
    { provider: "gemini", label: "Gemini", configured: true, models: ["gemini-2.5-flash-tts"], voices: ["Aoede"] },
    { provider: "sarvam", label: "Sarvam", configured: true, models: ["bulbul:v3"], voices: ["shubh"] },
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
    title: "Interruptions",
    detail: "Allow callers to interrupt and keep the interruption message.",
    enabled: true,
  },
  {
    title: "User starts first",
    detail: "Wait for caller speech before the agent opens.",
    enabled: false,
  },
  {
    title: "Auto fill responses",
    detail: "Send short filler phrases when response generation is slow.",
    enabled: true,
  },
  {
    title: "Agent terminate call",
    detail: "Let the agent end a call after completion or repeated silence.",
    enabled: true,
  },
  {
    title: "Voicemail handling",
    detail: "Leave a configured voicemail and continue on voice activity.",
    enabled: true,
  },
  {
    title: "DTMF dial",
    detail: "Allow keypad dialing instructions for IVR navigation.",
    enabled: false,
  },
];

const tools = [
  {
    name: "lookup_customer",
    type: "Webhook",
    detail: "Find CRM profile by {FromPhone}",
    method: "GET",
  },
  {
    name: "book_demo",
    type: "Webhook",
    detail: "Create a calendar hold after qualification",
    method: "POST",
  },
  {
    name: "open_email_form",
    type: "Web form",
    detail: "Collect email when voice spelling is unclear",
    method: "FORM",
  },
];

const knowledgeFiles = [
  "pricing-faq.pdf",
  "sales-playbook.md",
  "security-responses.docx",
];

const variables = ["{FromPhone}", "{ToPhone}", "{userName}", "{customerID}", "{appointmentTime}"];

const widgetMetadata = ["userName", "userType", "page", "customerID"];

const recentCalls = [
  { caller: "+1 415 555 7788", result: "Booked demo", duration: "4m 18s" },
  { caller: "+1 650 555 1290", result: "Transferred", duration: "2m 44s" },
  { caller: "+1 408 555 7721", result: "Answered FAQ", duration: "3m 02s" },
];

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

function ToggleRow({
  title,
  detail,
  enabled,
}: {
  title: string;
  detail: string;
  enabled: boolean;
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
        defaultChecked={enabled}
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
  options: string[];
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
          <option key={option}>{option}</option>
        ))}
      </select>
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

  const selectedAgent = useMemo(
    () => agentList.find((agent) => agent.id === selectedAgentId) ?? agentList[0] ?? agents[0],
    [agentList, selectedAgentId],
  );
  const selectedTone = getStatusTone(selectedAgent.status);
  const widgetUrl = `https://app.your-voice-platform.com/agents/embedded?id=${selectedAgent.id}&k=pk_live_demo&userName=John&page=pricing`;
  const widgetEmbedCode = `<div id="voice-agent-widget"></div>
<script
  src="https://app.your-voice-platform.com/widget.js"
  data-agent-id="${selectedAgent.id}"
  data-public-key="pk_live_demo"
  data-theme="light"
  data-position="bottom-right"
  data-accent="#1438f5"
  data-metadata="userName,userType,page,customerID"
></script>`;

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard");
      return;
    }

    void validateStoredSession();
    void Promise.all([voiceApi.agents(), voiceApi.config()])
      .then(([{ agents: backendAgents }, config]) => {
        const mapped = backendAgents.map(mapBackendAgent);
        setAgentList(mapped);
        setModelCatalog(config.modelCatalog);
        setSelectedAgentId((current) =>
          mapped.some((agent) => agent.id === current) ? current : mapped[0]?.id ?? current,
        );
      })
      .catch((error) => setNotice(error instanceof Error ? error.message : "Could not load agents."));
  }, [router, session]);

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
        prompt: selectedAgent.prompt,
        firstMessage: selectedAgent.firstMessage,
        ...changes,
      });
      const mapped = mapBackendAgent(agent);
      setAgentList((current) => current.map((item) => (item.id === mapped.id ? mapped : item)));
      setNotice("Agent saved to the backend.");
      return true;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save agent.");
      return false;
    }
  }

  async function handleCreateAgent() {
    try {
      const { agent } = await voiceApi.createAgent();
      const mapped = mapBackendAgent(agent);
      setAgentList((current) => [...current, mapped]);
      setSelectedAgentId(mapped.id);
      setNotice("New backend agent created.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create agent.");
    }
  }

  function updateSelectedAgent(changes: Partial<VoiceAgent>) {
    setAgentList((current) =>
      current.map((agent) => (agent.id === selectedAgent.id ? { ...agent, ...changes } : agent)),
    );
  }

  function handleLogout() {
    clearSession();
    router.replace("/login");
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
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
                        options={["Multilingual", "English", "English UK", "Hindi", "Spanish", "French"]}
                      />
                      <SelectField
                        label="Voice architecture"
                        defaultValue={selectedAgent.pipelineMode}
                        value={selectedAgent.pipelineMode}
                        onChange={(pipelineMode) =>
                          updateSelectedAgent({ pipelineMode: pipelineMode as PipelineMode })
                        }
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
                          <SelectField
                            label="Realtime voice"
                            defaultValue={selectedAgent.voice}
                            value={selectedAgent.voice}
                            onChange={(voice) => updateSelectedAgent({ voice })}
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
                              updateSelectedAgent({
                                sttProvider: provider as SttProvider,
                                sttModel: next.models[0],
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
                              updateSelectedAgent({
                                ttsProvider: provider as PipelineProvider,
                                ttsModel: next.models[0],
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
                          <SelectField
                            label="Voice / speaker"
                            defaultValue={selectedAgent.voice}
                            value={selectedAgent.voice}
                            onChange={(voice) => updateSelectedAgent({ voice })}
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
                          enabled={setting.enabled}
                        />
                      ))}
                    </div>

                    <div className="grid gap-3 lg:grid-cols-3">
                      <InputField label="Response delay" defaultValue="350ms" />
                      <InputField label="Max call duration" defaultValue="20 min" />
                      <InputField label="Max idle time" defaultValue="18 sec" />
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                      <InputField label="Transfer phone" defaultValue="+1 415 555 0123" />
                      <InputField label="Timezone" defaultValue="America/Los_Angeles" />
                    </div>

                    <label className="app-label grid gap-2">
                      <span>Voicemail message</span>
                      <textarea
                        className="app-control-text min-h-20 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                        defaultValue="Sorry we missed you. Please call us back or leave a message after the tone."
                      />
                    </label>
                  </div>
                ) : null}

                {activeTab === "tools" ? (
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      {tools.map((tool) => (
                        <article
                          className="grid gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3 md:grid-cols-[36px_minmax(0,1fr)_80px]"
                          key={tool.name}
                        >
                          <span className="grid size-9 place-items-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                            <Icon icon={tool.type === "Web form" ? "code" : "tool"} />
                          </span>
                          <span className="min-w-0">
                            <strong className="app-strong block truncate">{tool.name}</strong>
                            <span className="app-caption block truncate">{tool.detail}</span>
                          </span>
                          <span className="app-label self-center rounded-full bg-[#f8fafc] px-2 py-1 text-center">
                            {tool.method}
                          </span>
                        </article>
                      ))}
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                      <InputField label="Function name" defaultValue="check_availability" />
                      <InputField label="Webhook URL" defaultValue="https://api.company.com/availability" />
                      <SelectField label="Method" defaultValue="POST" options={["GET", "POST", "PUT", "PATCH"]} />
                      <InputField label="Timeout" defaultValue="8 seconds" />
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                      <InputField label="Prefetch data webhook" placeholder="https://api.company.com/prefetch" />
                      <InputField label="End-of-call webhook" placeholder="https://api.company.com/calls/end" />
                    </div>

                    <div className="grid gap-3 rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-3">
                      <span className="app-strong">Dynamic variables</span>
                      <div className="flex flex-wrap gap-2">
                        {variables.map((variable) => (
                          <span
                            className="app-label rounded-full border border-[#dbeafe] bg-white px-2.5 py-1 text-[#2563eb]"
                            key={variable}
                          >
                            {variable}
                          </span>
                        ))}
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
                        enabled={false}
                      />
                      <ToggleRow
                        title="Do-not-call detection"
                        detail="Detect opt-out intent and mark session metadata."
                        enabled={true}
                      />
                      <ToggleRow
                        title="Session continuation"
                        detail="Continue conversations by session or caller identifier."
                        enabled={true}
                      />
                      <ToggleRow
                        title="Memory"
                        detail="Use a caller identifier key for repeat interactions."
                        enabled={true}
                      />
                    </div>

                    <div className="grid gap-2">
                      {recentCalls.map((call) => (
                        <article
                          className="grid gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3 md:grid-cols-[minmax(0,1fr)_120px_90px]"
                          key={`${call.caller}-${call.duration}`}
                        >
                          <strong className="app-strong truncate">{call.caller}</strong>
                          <span className="app-caption">{call.result}</span>
                          <span className="app-caption md:text-right">{call.duration}</span>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {activeTab === "widget" ? (
                  <div className="grid gap-4">
                    <div className="grid gap-3 lg:grid-cols-2">
                      <InputField label="Public widget key" defaultValue="pk_live_demo" />
                      <InputField label="Allowed domain" defaultValue="https://example.com" />
                    </div>

                    <div className="grid gap-3 lg:grid-cols-3">
                      <SelectField
                        label="Widget theme"
                        defaultValue="Light"
                        options={["Light", "Dark", "Auto"]}
                      />
                      <SelectField
                        label="Position"
                        defaultValue="Bottom right"
                        options={["Bottom right", "Bottom left", "Inline"]}
                      />
                      <InputField label="Button text" defaultValue="Talk to us" />
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
                              Talk to us
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
                        {widgetMetadata.map((item) => (
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
                  <span className="app-caption">Files used for grounded answers</span>
                </div>
                <span className="grid size-9 place-items-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                  <Icon icon="book" />
                </span>
              </div>
              <div className="grid gap-2">
                {knowledgeFiles.map((file) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-lg border border-[#e5e7eb] px-3 py-2"
                    key={file}
                  >
                    <span className="app-strong truncate">{file}</span>
                    <span className="app-caption">Indexed</span>
                  </div>
                ))}
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
  "tools": ${tools.length},
  "knowledge_base": ${knowledgeFiles.length}
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
    latency: agent.pipelineMode === "pipeline" ? "~650ms" : "~450ms",
    calls: 0,
    success: "-",
    prompt: agent.prompt,
    firstMessage: agent.firstMessage,
  };
}
