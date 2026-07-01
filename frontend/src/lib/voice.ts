import { getAuthHeaders, getSession } from "@/lib/auth";
import { API_URL } from "@/lib/apiBase";

export type ProviderModel = "openai-realtime" | "gemini-live" | "sarvam-gemini";
export type PipelineMode = "realtime" | "pipeline";
export type RealtimeProvider = "openai" | "gemini";
export type PipelineProvider = "openai" | "gemini" | "sarvam" | "elevenlabs";
export type SttProvider = "openai" | "sarvam" | "elevenlabs" | "deepgram";
export type FirstMessageMode = "assistant-speaks-first" | "user-speaks-first" | "model-generated";

export type AgentBehavior = {
  interruptions: boolean;
  userStartsFirst: boolean;
  autoFillResponses: boolean;
  agentCanTerminate: boolean;
  voicemailHandling: boolean;
  voicemailAction: "leave-message" | "hangup";
  dtmfDial: boolean;
  dtmfSequence: string;
  endpointingMode: "fast" | "balanced" | "patient";
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

export type AgentToolParameter = {
  _id?: string;
  name: string;
  type: "string" | "number" | "boolean" | "object";
  description: string;
  required: boolean;
};

export type AgentTool = {
  _id?: string;
  name: string;
  description: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  timeoutSeconds: number;
  enabled: boolean;
  parameters?: AgentToolParameter[];
  runAfterCall?: boolean;
  executeAfterMessage?: boolean;
  excludeSessionId?: boolean;
  messages?: string[];
};

export type AgentToolRunResult = {
  ok: boolean;
  status: number;
  elapsedMs: number;
  responseText: string;
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
  voiceProfiles?: readonly VoiceProfile[];
  voicesByModel?: Readonly<Record<string, readonly string[]>>;
  voicesByLanguage?: Readonly<Record<string, readonly string[]>>;
  languages?: readonly VoiceLanguageOption[];
  showAllVoicesWithLanguageOrder?: boolean;
};

export type ModelCatalog = {
  realtime: readonly ModelProvider[];
  llm: readonly ModelProvider[];
  stt: readonly ModelProvider[];
  tts: readonly ModelProvider[];
};

export type PricingGuide = {
  currency: string;
  llmPerMillionTokens: number;
  sttPerMinute: number;
  ttsPerMillionCharacters: number;
  telephonyPerMinute: number;
  markupMultiplier: number;
};

export type LatencyGuide = {
  realtime: Partial<Record<RealtimeProvider, number>>;
  llm: Partial<Record<PipelineProvider, number>>;
  stt: Partial<Record<SttProvider, number>>;
  tts: Partial<Record<PipelineProvider, number>>;
  telephony: number;
};

export type VoiceConfigResponse = {
  configured: boolean;
  agentName: string;
  providers: { id: string; label: string; detail: string; configured: boolean }[];
  languageCatalog: VoiceLanguageOption[];
  modelCatalog: ModelCatalog;
  pricing: PricingGuide;
  latencyGuide: LatencyGuide;
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

export type VoiceLanguageOption = {
  value: string;
  label: string;
  code: string;
  sarvamStt: boolean;
  sarvamTts: boolean;
};

export type VoiceProfile = {
  value: string;
  label: string;
  gender?: "male" | "female";
  model?: string;
  useCase?: string;
  tone?: string;
  qualityTier?: string;
  note?: string;
  accent?: string;
  category?: string;
  languages?: readonly string[];
  languageCodes?: readonly string[];
  languageLabels?: readonly string[];
};

export type VoicePreviewRequest = {
  mode: PipelineMode;
  provider: RealtimeProvider | PipelineProvider;
  model: string;
  voice: string;
  language: string;
  text?: string;
  voiceSpeed?: number;
  voicePitch?: number;
};

export type BackendAgent = {
  _id: string;
  name: string;
  team: string;
  status: "Live" | "Draft" | "Paused";
  phone: string;
  language: string;
  multilingualEnabled?: boolean;
  languageSwitchingEnabled?: boolean;
  supportedLanguages?: string[];
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
  firstMessageMode?: FirstMessageMode;
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
  agentId: BackendAgent | null;
  createdAt: string;
};

export type TelephonyProvider = "Twilio" | "Exotel" | "Vobiz";

export type PhoneNumberImportInput =
  | {
      provider: "Twilio";
      phoneNumber: string;
      label: string;
      direction?: BackendPhoneNumber["direction"];
      accountSid: string;
      apiKeySid: string;
      apiKeySecret: string;
      apiRegion: "us1" | "au1" | "ie1";
    }
  | {
      provider: "Exotel";
      phoneNumber: string;
      label: string;
      direction?: BackendPhoneNumber["direction"];
      accountSid: string;
      apiKey: string;
      apiToken: string;
      dataCenter: "mumbai" | "singapore";
    }
  | {
      provider: "Vobiz";
      phoneNumber: string;
      label: string;
      direction?: BackendPhoneNumber["direction"];
      authId: string;
      authToken: string;
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

export type CostPricingDetail = {
  source?: "catalog" | "override" | "account" | "fallback" | "mixed";
  key?: string;
  unit?: string;
  provider?: string;
  model?: string;
  inputPerMillionTokens?: number;
  cachedInputPerMillionTokens?: number;
  outputPerMillionTokens?: number;
  inputAudioPerMillionTokens?: number;
  cachedInputAudioPerMillionTokens?: number;
  outputAudioPerMillionTokens?: number;
  inputImagePerMillionTokens?: number;
  cachedInputImagePerMillionTokens?: number;
  perMinute?: number;
  perMillionCharacters?: number;
  perMillionAudioTokens?: number;
  audioTokensPerSecond?: number;
  voiceMultiplier?: number;
  estimated?: boolean;
  note?: string;
  models?: CostPricingDetail[];
};

export type CallRecord = {
  _id: string;
  agentId: BackendAgent | { _id: string; name: string; team?: string };
  direction: "web" | "inbound" | "outbound";
  status: "initiated" | "ringing" | "active" | "completed" | "failed" | "cancelled";
  callerNumber: string;
  callerNumberSource?: "recorded" | "room_name" | "missing";
  calledNumber: string;
  calledNumberSource?: "recorded" | "room_name" | "missing";
  livekitRoomName: string;
  startedAt?: string;
  endedAt?: string;
  durationSeconds: number;
  transcript: CallTranscriptItem[];
  recordingKey: string;
  recordingUrl: string;
  recordingEgressId: string;
  recordingStatus: "" | "starting" | "active" | "completed" | "failed";
  recordingError: string;
  recordingDuration: number;
  avgResponseLatencyMs: number;
  llmProvider: string;
  llmModel: string;
  llmInputTokens: number;
  llmOutputTokens: number;
  llmTokens: number;
  sttProvider: string;
  sttModel: string;
  sttInputTokens: number;
  sttOutputTokens: number;
  sttSeconds: number;
  ttsProvider: string;
  ttsModel: string;
  ttsVoice: string;
  ttsInputTokens: number;
  ttsOutputTokens: number;
  ttsAudioSeconds: number;
  ttsCharacters: number;
  costBreakdown: {
    llm: number;
    stt: number;
    tts: number;
    telephony: number;
    total: number;
    currency: string;
    pricing?: {
      llm?: CostPricingDetail;
      stt?: CostPricingDetail;
      tts?: CostPricingDetail;
      telephony?: CostPricingDetail;
    };
  };
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

export type AgentDispatchHealth = {
  configured: boolean;
  roomName: string;
  dispatchId: string;
  agentName: string;
  region: string;
  state: "missing" | "waiting" | "pending" | "running" | "completed" | "failed" | "unknown";
  message: string;
  jobs: {
    id: string;
    status: "pending" | "running" | "success" | "failed" | "unknown";
    error: string;
    workerId: string;
    participantIdentity: string;
  }[];
};

export type AgentRuntimeSnapshot = {
  agentId: string;
  agentStatus: "Live" | "Draft" | "Paused";
  observedAt: string;
  dispatch: {
    state: AgentDispatchHealth["state"] | "idle";
    message: string;
    roomName: string;
    dispatchId: string;
    workerId: string;
  };
  region: string;
  activeCalls: number;
  maxConcurrentCalls: number;
  pipeline: {
    mode: PipelineMode;
    label: string;
    stt: string;
  };
  latency: {
    latestMs: number | null;
    averageMs: number | null;
    sampleCount: number;
    measuredAt: string;
  };
  businessHours: {
    enabled: boolean;
    open: boolean;
    timezone: string;
  };
  phoneRoute: {
    number: string;
    provider: string;
    direction: "Inbound" | "Outbound" | "Both" | "";
    status: "Ready" | "Pending" | "Needs setup" | "Unassigned";
    inboundReady: boolean;
    outboundReady: boolean;
    totalCalls: number;
    activeCalls: number;
    completionRate: number | null;
  };
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

type VoiceRequestCacheEntry = {
  path: string;
  expiresAt: number;
  promise: Promise<unknown>;
};

export type AgentSummary = Pick<BackendAgent, "_id" | "name" | "team" | "status" | "phone">;

const voiceRequestCache = new Map<string, VoiceRequestCacheEntry>();

function voiceCacheKey(path: string) {
  const session = getSession();
  return session ? `${session.id}:${session.organization?.id ?? ""}:${path}` : "";
}

function seedVoiceCache<T>(path: string, value: T, ttlMs: number) {
  const key = voiceCacheKey(path);
  if (!key) return;
  voiceRequestCache.set(key, {
    path,
    expiresAt: Date.now() + ttlMs,
    promise: Promise.resolve(value),
  });
}

function cachedRequest<T>(path: string, ttlMs: number) {
  const key = voiceCacheKey(path);
  if (!key) return request<T>(path);
  const existing = voiceRequestCache.get(key);
  if (existing && existing.expiresAt > Date.now()) {
    return existing.promise as Promise<T>;
  }

  const promise = request<T>(path).catch((error) => {
    voiceRequestCache.delete(key);
    throw error;
  });
  voiceRequestCache.set(key, { path, expiresAt: Date.now() + ttlMs, promise });
  return promise;
}

function invalidateVoiceCache(...pathPrefixes: string[]) {
  for (const [key, entry] of voiceRequestCache) {
    if (pathPrefixes.some((prefix) => entry.path.startsWith(prefix))) {
      voiceRequestCache.delete(key);
    }
  }
}

async function mutation<T>(
  path: string,
  init: RequestInit,
  invalidates: string[] = [],
) {
  const result = await request<T>(path, init);
  if (invalidates.length) invalidateVoiceCache(...invalidates);
  return result;
}

export const voiceApi = {
  config: () =>
    cachedRequest<VoiceConfigResponse>("/config", 5 * 60_000),
  bootstrap: () =>
    cachedRequest<{
      agents: BackendAgent[];
      config: VoiceConfigResponse;
      templates: AgentTemplate[];
    }>("/bootstrap", 15_000).then((result) => {
      seedVoiceCache("/agents", { agents: result.agents }, 15_000);
      seedVoiceCache(
        "/agents?view=summary",
        { agents: result.agents.map(({ _id, name, team, status, phone }) => ({ _id, name, team, status, phone })) },
        15_000,
      );
      seedVoiceCache("/config", result.config, 5 * 60_000);
      seedVoiceCache("/agent-templates", { templates: result.templates }, 60 * 60_000);
      return result;
    }),
  agents: () => cachedRequest<{ agents: BackendAgent[] }>("/agents", 15_000),
  agentSummaries: () => cachedRequest<{ agents: AgentSummary[] }>("/agents?view=summary", 15_000),
  agentTemplates: () => cachedRequest<{ templates: AgentTemplate[] }>("/agent-templates", 60 * 60_000),
  createAgent: () =>
    mutation<{ agent: BackendAgent }>("/agents", {
      method: "POST",
      body: JSON.stringify({}),
    }, ["/agents"]),
  createAgentFromTemplate: (templateId: string) =>
    mutation<{ agent: BackendAgent }>(`/agent-templates/${templateId}`, { method: "POST" }, ["/agents"]),
  saveAgent: (agentId: string, changes: Partial<BackendAgent>) =>
    mutation<{ agent: BackendAgent; routingWarning: string }>(`/agents/${agentId}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    }, ["/agents"]),
  cloneAgent: (agentId: string) =>
    mutation<{ agent: BackendAgent }>(`/agents/${agentId}/clone`, { method: "POST" }, ["/agents"]),
  deleteAgent: (agentId: string) =>
    mutation<Record<string, never>>(`/agents/${agentId}`, { method: "DELETE" }, ["/agents", "/phone-numbers"]),
  testAgentTool: (
    agentId: string,
    input: { toolId?: string; tool?: AgentTool; args?: Record<string, unknown> },
  ) =>
    request<{
      tool: { name: string; method: AgentTool["method"]; url: string };
      result: AgentToolRunResult;
    }>(`/agents/${agentId}/tools/test`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
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
    request<{
      callId: string;
      roomName: string;
      dispatchId: string;
      dispatch: AgentDispatchHealth;
      serverUrl: string;
      participantToken: string;
    }>(
      "/web-call-token",
      {
        method: "POST",
        body: JSON.stringify({ agentId }),
      },
    ),
  agentDispatchStatus: (input: { roomName: string; dispatchId?: string }) => {
    const query = new URLSearchParams({ roomName: input.roomName });
    if (input.dispatchId) query.set("dispatchId", input.dispatchId);
    return request<AgentDispatchHealth>(`/agent-dispatch-status?${query.toString()}`);
  },
  agentRuntimeStream: (agentId: string) =>
    new EventSource(
      `${API_URL}/api/voice/agents/${encodeURIComponent(agentId)}/runtime/stream`,
      { withCredentials: true },
    ),
  outboundCall: (
    agentId: string,
    phoneNumber: string,
    options: { phoneNumberId?: string; metadata?: Record<string, string | number | boolean> } = {},
  ) =>
    request<{
      callId: string;
      roomName: string;
      dispatchId: string;
      dispatch: AgentDispatchHealth;
      participantId: string;
    }>("/outbound-calls", {
      method: "POST",
      body: JSON.stringify({
        agentId,
        phoneNumber,
        ...(options.phoneNumberId ? { phoneNumberId: options.phoneNumberId } : {}),
        ...(options.metadata ? { metadata: options.metadata } : {}),
      }),
    }),
  phoneNumbers: () => cachedRequest<{ numbers: BackendPhoneNumber[] }>("/phone-numbers", 15_000),
  createPhoneNumber: (input: PhoneNumberImportInput) =>
    mutation<{ number: BackendPhoneNumber }>("/phone-numbers", {
      method: "POST",
      body: JSON.stringify(input),
    }, ["/phone-numbers", "/agents"]),
  assignPhoneNumberAgent: (phoneNumberId: string, agentId: string | null) =>
    mutation<{ number: BackendPhoneNumber; routingWarning: string }>(
      `/phone-numbers/${phoneNumberId}/agent`,
      {
        method: "PUT",
        body: JSON.stringify({ agentId }),
      },
      ["/phone-numbers", "/agents"],
    ),
  deletePhoneNumber: (phoneNumberId: string) =>
    mutation<{ deleted: boolean; routingWarning: string }>(
      `/phone-numbers/${phoneNumberId}`,
      { method: "DELETE" },
      ["/phone-numbers", "/agents"],
    ),
  vobizNumbers: () => request<VobizNumberList>("/vobiz/numbers"),
  vobizIntegration: () => request<VobizIntegration>("/integrations/vobiz"),
  connectVobiz: (authId: string, authToken: string) =>
    mutation<VobizIntegration>("/integrations/vobiz", {
      method: "PUT",
      body: JSON.stringify({ authId, authToken }),
    }, ["/config"]),
  disconnectVobiz: () =>
    mutation<Record<string, never>>("/integrations/vobiz", { method: "DELETE" }, ["/config"]),
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
    mutation<{ number: BackendPhoneNumber }>("/phone-numbers/import", {
      method: "POST",
      body: JSON.stringify(input),
    }, ["/phone-numbers", "/agents"]),
  purchasePhoneNumber: (input: {
    agentId?: string;
    phoneNumber: string;
    label: string;
    direction: BackendPhoneNumber["direction"];
    currency?: string;
  }) =>
    mutation<{ number: BackendPhoneNumber }>("/phone-numbers/purchase", {
      method: "POST",
      body: JSON.stringify(input),
    }, ["/phone-numbers", "/agents"]),
  syncPhoneNumbers: () =>
    mutation<{
      vobiz: VobizNumberList;
      routes: {
        total: number;
        repaired: number;
        needsSetup: number;
        errors: { number: string; message: string }[];
      };
    }>("/phone-numbers/sync", { method: "POST" }, ["/phone-numbers", "/agents", "/config"]),
  calls: (
    input: {
      agentId?: string;
      status?: CallRecord["status"] | "";
      direction?: CallRecord["direction"] | "";
      sentiment?: CallRecord["sentimentLabel"];
      search?: string;
      phoneNumber?: string;
      from?: string;
      to?: string;
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
    if (input.phoneNumber) query.set("phoneNumber", input.phoneNumber);
    if (input.from) query.set("from", input.from);
    if (input.to) query.set("to", input.to);
    if (input.minDuration) query.set("minDuration", String(input.minDuration));
    if (input.maxDuration) query.set("maxDuration", String(input.maxDuration));
    query.set("page", String(input.page ?? 1));
    query.set("limit", String(input.limit ?? 20));
    return request<CallsResponse>(`/calls?${query.toString()}`);
  },
  call: (callId: string) => request<{ call: CallRecord }>(`/calls/${callId}`),
  callRecordingBlob: async (callId: string) => {
    if (!getSession()) throw new Error("Sign in before playing call recordings.");
    const response = await fetch(`${API_URL}/api/voice/calls/${encodeURIComponent(callId)}/recording-file`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(data?.message ?? "Could not load the call recording.");
    }
    return response.blob();
  },
  uploadWebCallRecording: async (callId: string, recording: Blob, durationMs: number) => {
    if (!getSession()) throw new Error("Sign in before uploading call recordings.");
    const response = await fetch(`${API_URL}/api/voice/calls/${encodeURIComponent(callId)}/recording`, {
      method: "POST",
      credentials: "include",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": recording.type || "application/octet-stream",
        "X-Recording-Duration-Ms": String(Math.max(0, Math.round(durationMs))),
      },
      body: recording,
    });
    const data = (await response.json().catch(() => null)) as ({ call: CallRecord; message?: string }) | null;
    if (!response.ok) throw new Error(data?.message ?? "Could not upload the web call recording.");
    if (!data?.call) throw new Error("Voice service returned an empty recording response.");
    return data;
  },
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
