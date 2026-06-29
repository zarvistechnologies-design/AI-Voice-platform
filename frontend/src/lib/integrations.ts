import { getAuthHeaders, getSession } from "@/lib/auth";
import { cachedApiRequest, invalidateApiCache } from "@/lib/apiCache";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type IntegrationProvider = {
  id: "vobiz" | "hubspot" | "calendly" | "slack";
  connected: boolean;
  accountId: string;
  status: "connected" | "error" | "disconnected";
  lastVerifiedAt: string | null;
  metadata: Record<string, unknown>;
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
    const result = await request<IntegrationProvider>(`/${provider}`, { method: "PUT", body: JSON.stringify({ credential }) });
    invalidateApiCache("integrations");
    return result;
  },
  disconnect: async (provider: Exclude<IntegrationProvider["id"], "vobiz">) => {
    const result = await request<Record<string, never>>(`/${provider}`, { method: "DELETE" });
    invalidateApiCache("integrations");
    return result;
  },
};
