import { getAuthHeaders, getSession } from "@/lib/auth";
import { cachedApiRequest, invalidateApiCache } from "@/lib/apiCache";
import { API_URL } from "@/lib/apiBase";
import { invalidateVoiceCache } from "@/lib/voiceCache";

export type IntegrationProvider = {
  id: "vobiz" | "hubspot" | "calendly" | "slack" | "google" | "digitalbot";
  connected: boolean;
  accountId: string;
  status: "connected" | "error" | "disconnected";
  toolsActive: boolean;
  lastVerifiedAt: string | null;
  metadata: Record<string, unknown>;
  delivery: {
    status: "staged" | "pending" | "processing" | "delivered" | "retrying" | "failed";
    attempts: number;
    errorMessage: string;
    deliveredAt: string | null;
    updatedAt: string;
  } | null;
};

export type DigitalBotConnection = {
  id: "digitalbot";
  connectionId: string;
  connected: boolean;
  displayName: string;
  targetAgentId: string;
  targetAgentName: string;
  accountId: string;
  status: "connected" | "error" | "disconnected";
  lastVerifiedAt: string | null;
  metadata: {
    connectionId: string;
    workspaceId: string;
    workspaceName: string;
    branchId: string;
    branchName: string;
    permissions: string[];
    tokenPrefix: string;
  };
};

export type AgentSummary = {
  _id: string;
  name: string;
  team: string;
  status: "Live" | "Draft" | "Paused";
  phone: string;
  version: number;
};

async function request<T>(path: string, init: RequestInit = {}) {
  if (!getSession()) throw new Error("Sign in before managing integrations.");
  const response = await fetch(`${API_URL}/api/integrations${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...getAuthHeaders(), ...init.headers },
  });
  const data = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!response.ok) throw new Error(data?.message ?? "Integration request failed.");
  return (data ?? {}) as T;
}

export const integrationsApi = {
  list: () => cachedApiRequest("integrations", "/", 15_000, () => request<{ providers: IntegrationProvider[] }>("/")),
  connect: async (provider: Exclude<IntegrationProvider["id"], "vobiz">, credential: string) => {
    const result = await request<IntegrationProvider>(`/${provider}`, {
      method: "PUT",
      body: JSON.stringify(provider === "digitalbot" ? { connectorToken: credential } : { credential }),
    });
    invalidateApiCache("integrations");
    return result;
  },
  connectDigitalBot: async (payload: { agentId: string; connectorToken: string; name?: string }) => {
    const result = await request<{ connection: DigitalBotConnection; attachedTools: string[] }>("/digitalbot/connections", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    invalidateApiCache("integrations");
    invalidateVoiceCache("/agents");
    return result;
  },
  disconnect: async (provider: Exclude<IntegrationProvider["id"], "vobiz">) => {
    const result = await request<Record<string, never>>(`/${provider}`, { method: "DELETE" });
    invalidateApiCache("integrations");
    return result;
  },
  googleOAuthUrl: () => request<{ url: string }>("/google/oauth/start"),
  disconnectGoogle: async () => {
    const result = await request<Record<string, never>>("/google", { method: "DELETE" });
    invalidateApiCache("integrations");
    return result;
  },
  googleCalendars: () => request<{ calendars: Array<{ id: string; name: string; primary: boolean; timezone: string }> }>("/google/calendars"),
  inspectSpreadsheet: (spreadsheetId: string) => request<{ spreadsheet: { id: string; name: string; sheets: string[] } }>("/google/spreadsheet", {
    method: "POST", body: JSON.stringify({ spreadsheetId }),
  }),
  testCalendar: (calendarId: string, timezone: string) => request<{ event: Record<string, unknown> }>("/google/calendar/test", {
    method: "POST", body: JSON.stringify({ calendarId, timezone }),
  }),
  testSheet: (spreadsheetId: string, sheetName: string) => request<{ result: Record<string, unknown> }>("/google/sheets/test", {
    method: "POST", body: JSON.stringify({ spreadsheetId, sheetName }),
  }),
  verifyDigitalBot: async (agentId: string) => {
    const result = await request<DigitalBotConnection>(`/digitalbot/connections/${encodeURIComponent(agentId)}/verify`, { method: "POST" });
    invalidateApiCache("integrations");
    return result;
  },
  disconnectDigitalBot: async (agentId: string) => {
    const result = await request<Record<string, never>>(`/digitalbot/connections/${encodeURIComponent(agentId)}`, { method: "DELETE" });
    invalidateApiCache("integrations");
    invalidateVoiceCache("/agents");
    return result;
  },
  attachDigitalBotTools: async (agentId: string) => {
    const result = await request<{ agent: AgentSummary; attachedTools: string[] }>("/digitalbot/attach-tools", {
      method: "POST",
      body: JSON.stringify({ agentId }),
    });
    invalidateApiCache("integrations");
    invalidateVoiceCache("/agents");
    return result;
  },
  setDigitalBotTools: async (agentId: string, enabled: boolean) => {
    const result = await request<{ active: boolean; attachedTools: string[]; addedTools: string[] }>(
      `/digitalbot/connections/${encodeURIComponent(agentId)}/tools`,
      { method: "PUT", body: JSON.stringify({ enabled }) },
    );
    invalidateApiCache("integrations");
    invalidateVoiceCache("/agents");
    return result;
  },
  agentSummaries: async () => {
    if (!getSession()) throw new Error("Sign in before loading agents.");
    const response = await fetch(`${API_URL}/api/voice/agents?view=summary`, {
      credentials: "include",
      headers: { ...getAuthHeaders() },
    });
    const data = (await response.json().catch(() => null)) as { agents?: AgentSummary[]; message?: string } | null;
    if (!response.ok) throw new Error(data?.message ?? "Could not load agents.");
    return { agents: data?.agents ?? [] };
  },
};
