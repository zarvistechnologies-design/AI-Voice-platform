import { getAuthHeaders, getSession } from "@/lib/auth";
import { cachedApiRequest, invalidateApiCache } from "@/lib/apiCache";
import { API_URL } from "@/lib/apiBase";

export type WebhookEvent = "call.started" | "call.ended" | "call.failed" | "transcript.ready";
export type ApiKeyScope = "read" | "agents:write" | "calls:trigger" | "full-access";

export type WebhookEndpoint = {
  _id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  enabled: boolean;
  createdAt: string;
};

export type WebhookDelivery = {
  _id: string;
  webhookId: string;
  event: string;
  status: "pending" | "delivered" | "retrying" | "failed";
  attempts: number;
  responseStatus: number;
  durationMs: number;
  errorMessage: string;
  createdAt: string;
};

export type ApiKeyRecord = {
  _id: string;
  name: string;
  prefix: string;
  scopes: ApiKeyScope[];
  expiresAt?: string;
  lastUsedAt?: string;
  revokedAt?: string;
  createdAt: string;
};

async function request<T>(path: string, init: RequestInit = {}) {
  if (!getSession()) throw new Error("Sign in before managing developer tools.");
  const response = await fetch(`${API_URL}/api/developer${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...getAuthHeaders(), ...init.headers },
  });
  const data = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!response.ok) throw new Error(data?.message ?? "Developer tools request failed.");
  return (data ?? {}) as T;
}

export const developerApi = {
  webhooks: () => cachedApiRequest("developer", "/webhooks", 10_000, () =>
    request<{ webhooks: WebhookEndpoint[]; deliveries: WebhookDelivery[]; eventCatalog: WebhookEvent[] }>("/webhooks")),
  createWebhook: async (input: { name: string; url: string; events: WebhookEvent[] }) => {
    const result = await request<{ webhook: WebhookEndpoint; secret: string }>("/webhooks", { method: "POST", body: JSON.stringify(input) });
    invalidateApiCache("developer", "/webhooks");
    return result;
  },
  updateWebhook: async (id: string, input: Partial<Pick<WebhookEndpoint, "name" | "url" | "events" | "enabled">>) => {
    const result = await request<{ webhook: WebhookEndpoint }>(`/webhooks/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    invalidateApiCache("developer", "/webhooks");
    return result;
  },
  deleteWebhook: async (id: string) => {
    const result = await request<Record<string, never>>(`/webhooks/${id}`, { method: "DELETE" });
    invalidateApiCache("developer", "/webhooks");
    return result;
  },
  testWebhook: async (id: string) => {
    const result = await request<{ delivery: WebhookDelivery }>(`/webhooks/${id}/test`, { method: "POST" });
    invalidateApiCache("developer", "/webhooks");
    return result;
  },
  apiKeys: () => cachedApiRequest("developer", "/api-keys", 10_000, () =>
    request<{ apiKeys: ApiKeyRecord[]; scopeCatalog: ApiKeyScope[] }>("/api-keys")),
  createApiKey: async (input: { name: string; scopes: ApiKeyScope[]; expiresAt?: string }) => {
    const result = await request<{ apiKey: ApiKeyRecord; key: string }>("/api-keys", { method: "POST", body: JSON.stringify(input) });
    invalidateApiCache("developer", "/api-keys");
    return result;
  },
  revokeApiKey: async (id: string) => {
    const result = await request<Record<string, never>>(`/api-keys/${id}`, { method: "DELETE" });
    invalidateApiCache("developer", "/api-keys");
    return result;
  },
};
