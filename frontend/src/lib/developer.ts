import { getAuthHeaders, getSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

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
  webhooks: () => request<{ webhooks: WebhookEndpoint[]; deliveries: WebhookDelivery[]; eventCatalog: WebhookEvent[] }>("/webhooks"),
  createWebhook: (input: { name: string; url: string; events: WebhookEvent[] }) =>
    request<{ webhook: WebhookEndpoint; secret: string }>("/webhooks", { method: "POST", body: JSON.stringify(input) }),
  updateWebhook: (id: string, input: Partial<Pick<WebhookEndpoint, "name" | "url" | "events" | "enabled">>) =>
    request<{ webhook: WebhookEndpoint }>(`/webhooks/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  deleteWebhook: (id: string) => request<Record<string, never>>(`/webhooks/${id}`, { method: "DELETE" }),
  testWebhook: (id: string) => request<{ delivery: WebhookDelivery }>(`/webhooks/${id}/test`, { method: "POST" }),
  apiKeys: () => request<{ apiKeys: ApiKeyRecord[]; scopeCatalog: ApiKeyScope[] }>("/api-keys"),
  createApiKey: (input: { name: string; scopes: ApiKeyScope[]; expiresAt?: string }) =>
    request<{ apiKey: ApiKeyRecord; key: string }>("/api-keys", { method: "POST", body: JSON.stringify(input) }),
  revokeApiKey: (id: string) => request<Record<string, never>>(`/api-keys/${id}`, { method: "DELETE" }),
};
