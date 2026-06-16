import { getAuthHeaders, getSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type ProviderModel = "openai-realtime" | "gemini-live" | "sarvam-gemini";
export type PipelineMode = "realtime" | "pipeline";
export type RealtimeProvider = "openai" | "gemini";
export type PipelineProvider = "openai" | "gemini" | "sarvam";
export type SttProvider = "openai" | "sarvam";

export type AgentBehavior = {
  interruptions: boolean;
  userStartsFirst: boolean;
  autoFillResponses: boolean;
  agentCanTerminate: boolean;
  voicemailHandling: boolean;
  dtmfDial: boolean;
  responseDelayMs: number;
  maxCallDurationSeconds: number;
  maxIdleSeconds: number;
  transferPhone: string;
  timezone: string;
  voicemailMessage: string;
};

export type AgentCallSettings = {
  recordingEnabled: boolean;
  doNotCallDetection: boolean;
  sessionContinuation: boolean;
  memoryEnabled: boolean;
};

export type AgentTool = {
  _id?: string;
  name: string;
  description: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  timeoutSeconds: number;
  enabled: boolean;
};

export type KnowledgeDocument = {
  _id?: string;
  name: string;
  content: string;
  status: "ready" | "disabled";
};

export type AgentWidget = {
  enabled: boolean;
  publicKey: string;
  allowedDomains: string[];
  theme: "light" | "dark" | "auto";
  position: "bottom-right" | "bottom-left" | "inline";
  buttonText: string;
  accentColor: string;
};

export type BusinessHoursDay = {
  day: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
  enabled: boolean;
  start: string;
  end: string;
};

export type AgentBusinessHours = {
  timezone: string;
  schedule: BusinessHoursDay[];
};

export type AgentTemplate = {
  id: string;
  name: string;
  team: string;
  prompt: string;
  firstMessage: string;
};

export type ModelProvider = {
  provider: string;
  label: string;
  configured: boolean;
  models: readonly string[];
  voices?: readonly string[];
  voicesByModel?: Readonly<Record<string, readonly string[]>>;
  languages?: readonly VoiceLanguageOption[];
};

export type ModelCatalog = {
  realtime: readonly ModelProvider[];
  llm: readonly ModelProvider[];
  stt: readonly ModelProvider[];
  tts: readonly ModelProvider[];
};

export type VoiceLanguageOption = {
  value: string;
  label: string;
  code: string;
  sarvamStt: boolean;
  sarvamTts: boolean;
};

export type VoicePreviewRequest = {
  mode: PipelineMode;
  provider: RealtimeProvider | PipelineProvider;
  model: string;
  voice: string;
  language: string;
  text?: string;
  voiceSpeed?: number;
};

export type BackendAgent = {
  _id: string;
  name: string;
  team: string;
  status: "Live" | "Draft" | "Paused";
  phone: string;
  language: string;
  voice: string;
  providerModel: ProviderModel;
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
  interruptionSensitivity: "low" | "medium" | "high";
  backgroundNoise: "none" | "office" | "cafe" | "street";
  callbackEmail: string;
  businessHoursEnabled: boolean;
  businessHours: AgentBusinessHours;
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
  latencyMetrics?: {
    latestMs?: number;
    averageMs?: number;
    sampleCount?: number;
    lastMeasuredAt?: string;
  };
};

export type BackendPhoneNumber = {
  _id: string;
  number: string;
  label: string;
  direction: "Inbound" | "Outbound" | "Both";
  region: string;
  status: "Ready" | "Pending" | "Needs setup";
  inboundTrunkId: string;
  outboundTrunkId: string;
  dispatchRuleId: string;
  provider: string;
  providerNumberId: string;
  monthlyFee: number;
  currency: string;
  updatedAt: string;
  agentId: BackendAgent;
};

export type VobizNumber = {
  id: string;
  e164: string;
  country: string;
  region?: string;
  status: string;
  setup_fee?: number;
  monthly_fee?: number;
  currency?: string;
  capabilities?: {
    voice?: boolean;
    sms?: boolean;
    mms?: boolean;
    fax?: boolean;
  };
  voice_enabled?: boolean;
};

export type VobizNumberList = {
  items: VobizNumber[];
  page: number;
  per_page: number;
  total: number;
};

export type VobizIntegration = {
  connected: boolean;
  accountId: string;
  status: string;
  ownedNumberCount: number;
  lastVerifiedAt: string | null;
};

export type CallTranscriptItem = {
  itemId: string;
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  interrupted: boolean;
};

export type CallRecord = {
  _id: string;
  agentId: BackendAgent | { _id: string; name: string; team?: string };
  direction: "web" | "inbound" | "outbound";
  status: "initiated" | "ringing" | "active" | "completed" | "failed" | "cancelled";
  callerNumber: string;
  calledNumber: string;
  livekitRoomName: string;
  startedAt?: string;
  endedAt?: string;
  durationSeconds: number;
  transcript: CallTranscriptItem[];
  avgResponseLatencyMs: number;
  llmProvider: string;
  llmTokens: number;
  sttProvider: string;
  sttSeconds: number;
  ttsProvider: string;
  ttsCharacters: number;
  costBreakdown: { llm: number; stt: number; tts: number; telephony: number; total: number; currency: string };
  billing?: {
    chargedCredits: number;
    estimatedChargeCredits: number;
    providerCost: number;
    currency: string;
    balanceAfterCredits: number | null;
    breakdown: {
      llm: number;
      stt: number;
      tts: number;
      telephony: number;
      total: number;
      chargedLlm: number;
      chargedStt: number;
      chargedTts: number;
      chargedTelephony: number;
    };
  };
  sentimentScore?: number;
  sentimentLabel: "positive" | "neutral" | "negative" | "";
  endReason: string;
  errorMessage: string;
  tags: string[];
  createdAt: string;
};

export type CallsResponse = {
  calls: CallRecord[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export type AnalyticsOverview = {
  range: { from: string; to: string };
  summary: {
    totalCalls: number;
    completedCalls: number;
    failedCalls: number;
    activeCalls: number;
    completionRate: number;
    totalDurationSeconds: number;
    averageDurationSeconds: number;
    averageLatencyMs: number;
    llmTokens: number;
    sttSeconds: number;
    ttsCharacters: number;
    totalCost: number;
  };
  timeSeries: { date: string; calls: number; completed: number; durationSeconds: number }[];
  statusBreakdown: { label: string; value: number }[];
  directionBreakdown: { label: string; value: number }[];
  agentPerformance: {
    agentId: string;
    name: string;
    calls: number;
    completed: number;
    durationSeconds: number;
    averageLatencyMs: number;
  }[];
  providerUsage: {
    providers: { llm: string; stt: string; tts: string };
    calls: number;
    llmTokens: number;
    sttSeconds: number;
    ttsCharacters: number;
  }[];
};

async function request<T>(path: string, init: RequestInit = {}) {
  const session = getSession();
  if (!session) {
    throw new Error("Sign in before using voice services.");
  }

  const response = await fetch(`${API_URL}/api/voice${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...init.headers,
    },
  });
  const data = (await response.json().catch(() => null)) as
    | (T & { message?: string })
    | null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Voice service request failed.");
  }
  if (response.status === 204) {
    return {} as T;
  }
  if (!data) {
    throw new Error("Voice service returned an empty response.");
  }
  return data;
}

export const voiceApi = {
  config: () =>
    request<{
      configured: boolean;
      agentName: string;
      providers: { id: string; label: string; detail: string; configured: boolean }[];
      languageCatalog: VoiceLanguageOption[];
      modelCatalog: ModelCatalog;
      sip: { inboundConfigured: boolean; outboundConfigured: boolean; callerId: string };
      vobiz: {
        configured: boolean;
        accountId: string;
        status: string;
        ownedNumberCount: number;
      };
    }>("/config"),
  agents: () => request<{ agents: BackendAgent[] }>("/agents"),
  agentTemplates: () => request<{ templates: AgentTemplate[] }>("/agent-templates"),
  createAgent: () =>
    request<{ agent: BackendAgent }>("/agents", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  createAgentFromTemplate: (templateId: string) =>
    request<{ agent: BackendAgent }>(`/agent-templates/${templateId}`, { method: "POST" }),
  saveAgent: (agentId: string, changes: Partial<BackendAgent>) =>
    request<{ agent: BackendAgent }>(`/agents/${agentId}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    }),
  cloneAgent: (agentId: string) =>
    request<{ agent: BackendAgent }>(`/agents/${agentId}/clone`, { method: "POST" }),
  deleteAgent: (agentId: string) =>
    request<Record<string, never>>(`/agents/${agentId}`, { method: "DELETE" }),
  voicePreview: async (input: VoicePreviewRequest) => {
    if (!getSession()) throw new Error("Sign in before previewing voices.");
    const response = await fetch(`${API_URL}/api/voice/voice-preview`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(data?.message ?? "Could not play this voice preview.");
    }
    return response.blob();
  },
  webCallToken: (agentId: string) =>
    request<{ callId: string; roomName: string; serverUrl: string; participantToken: string }>(
      "/web-call-token",
      {
        method: "POST",
        body: JSON.stringify({ agentId }),
      },
    ),
  outboundCall: (agentId: string, phoneNumber: string) =>
    request<{ callId: string; roomName: string; participantId: string }>("/outbound-calls", {
      method: "POST",
      body: JSON.stringify({ agentId, phoneNumber }),
    }),
  phoneNumbers: () => request<{ numbers: BackendPhoneNumber[] }>("/phone-numbers"),
  vobizNumbers: () => request<VobizNumberList>("/vobiz/numbers"),
  vobizIntegration: () => request<VobizIntegration>("/integrations/vobiz"),
  connectVobiz: (authId: string, authToken: string) =>
    request<VobizIntegration>("/integrations/vobiz", {
      method: "PUT",
      body: JSON.stringify({ authId, authToken }),
    }),
  disconnectVobiz: () =>
    request<Record<string, never>>("/integrations/vobiz", { method: "DELETE" }),
  vobizInventory: (input: { country?: string; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (input.country) query.set("country", input.country);
    if (input.search) query.set("search", input.search);
    return request<VobizNumberList>(`/vobiz/inventory?${query.toString()}`);
  },
  importPhoneNumber: (input: {
    agentId: string;
    phoneNumber: string;
    label: string;
    direction: BackendPhoneNumber["direction"];
    region: string;
  }) =>
    request<{ number: BackendPhoneNumber }>("/phone-numbers/import", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  purchasePhoneNumber: (input: {
    agentId: string;
    phoneNumber: string;
    label: string;
    direction: BackendPhoneNumber["direction"];
    currency?: string;
  }) =>
    request<{ number: BackendPhoneNumber }>("/phone-numbers/purchase", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  syncPhoneNumbers: () =>
    request<{
      vobiz: VobizNumberList;
      routes: { total: number };
    }>("/phone-numbers/sync", { method: "POST" }),
  calls: (
    input: {
      agentId?: string;
      status?: CallRecord["status"] | "";
      direction?: CallRecord["direction"] | "";
      sentiment?: CallRecord["sentimentLabel"];
      search?: string;
      minDuration?: number;
      maxDuration?: number;
      page?: number;
      limit?: number;
    } = {},
  ) => {
    const query = new URLSearchParams();
    if (input.agentId) query.set("agentId", input.agentId);
    if (input.status) query.set("status", input.status);
    if (input.direction) query.set("direction", input.direction);
    if (input.sentiment) query.set("sentiment", input.sentiment);
    if (input.search) query.set("search", input.search);
    if (input.minDuration) query.set("minDuration", String(input.minDuration));
    if (input.maxDuration) query.set("maxDuration", String(input.maxDuration));
    query.set("page", String(input.page ?? 1));
    query.set("limit", String(input.limit ?? 20));
    return request<CallsResponse>(`/calls?${query.toString()}`);
  },
  call: (callId: string) => request<{ call: CallRecord }>(`/calls/${callId}`),
  exportCallsCsv: async () => {
    if (!getSession()) throw new Error("Sign in before exporting calls.");
    const response = await fetch(`${API_URL}/api/voice/calls/export.csv`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Could not export call records.");
    return response.blob();
  },
  analytics: (input: { days?: number; agentId?: string } = {}) => {
    const query = new URLSearchParams();
    query.set("days", String(input.days ?? 30));
    if (input.agentId) query.set("agentId", input.agentId);
    return request<AnalyticsOverview>(`/analytics/overview?${query.toString()}`);
  },
};
