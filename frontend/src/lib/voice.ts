import { getSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type ProviderModel = "openai-realtime" | "gemini-live" | "sarvam-gemini";
export type PipelineMode = "realtime" | "pipeline";
export type RealtimeProvider = "openai" | "gemini";
export type PipelineProvider = "openai" | "gemini" | "sarvam";
export type SttProvider = "openai" | "sarvam";

export type ModelProvider = {
  provider: string;
  label: string;
  configured: boolean;
  models: readonly string[];
  voices?: readonly string[];
  voicesByModel?: Readonly<Record<string, readonly string[]>>;
};

export type ModelCatalog = {
  realtime: readonly ModelProvider[];
  llm: readonly ModelProvider[];
  stt: readonly ModelProvider[];
  tts: readonly ModelProvider[];
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
  prompt: string;
  firstMessage: string;
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

async function request<T>(path: string, init: RequestInit = {}) {
  const session = getSession();
  if (!session) {
    throw new Error("Sign in before using voice services.");
  }

  const response = await fetch(`${API_URL}/api/voice${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
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
  createAgent: () =>
    request<{ agent: BackendAgent }>("/agents", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  saveAgent: (agentId: string, changes: Partial<BackendAgent>) =>
    request<{ agent: BackendAgent }>(`/agents/${agentId}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    }),
  webCallToken: (agentId: string) =>
    request<{ roomName: string; serverUrl: string; participantToken: string }>(
      "/web-call-token",
      {
        method: "POST",
        body: JSON.stringify({ agentId }),
      },
    ),
  outboundCall: (agentId: string, phoneNumber: string) =>
    request<{ roomName: string; participantId: string }>("/outbound-calls", {
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
};
