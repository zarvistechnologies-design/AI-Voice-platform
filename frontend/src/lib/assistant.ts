import { API_URL } from "@/lib/apiBase";
import { clearSession, getAuthHeaders, getSession } from "@/lib/auth";

export type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
  pendingAction?: AssistantPendingAction;
};

export type AssistantPendingAction = {
  id: string;
  title: string;
  description: string;
  fields: Array<{ label: string; value: string }>;
  expiresAt: string;
};

export type AssistantReply = { answer: string; pendingAction?: AssistantPendingAction };

export type McpConnection = {
  clientId: string;
  clientName: string;
  connectedAt: string;
};

async function assistantRequest<T>(path: string, init: RequestInit = {}) {
  if (!getSession()) throw new Error("Sign in before managing a Vozon assistant connection.");
  const response = await fetch(`${API_URL}/api/assistant${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...init.headers,
    },
  });
  const data = await response.json().catch(() => null) as (T & { message?: string }) | null;
  if (!response.ok) {
    if (response.status === 401) clearSession();
    throw new Error(data?.message || `Vozon could not complete that request (HTTP ${response.status}).`);
  }
  return data as T;
}

export async function sendAssistantMessage(messages: AssistantMessage[]) {
  const data = await assistantRequest<AssistantReply>("/chat", {
    method: "POST",
    body: JSON.stringify({ messages: messages.map(({ role, content }) => ({ role, content })) }),
  });
  if (!data?.answer) throw new Error("Vozon returned an empty response. Please try again.");
  return data;
}

export function reviewAssistantAction(actionId: string, approved: boolean) {
  return assistantRequest<{ answer: string }>(`/chat/actions/${encodeURIComponent(actionId)}`, {
    method: "POST",
    body: JSON.stringify({ approved }),
  });
}

export function getMcpConnectionSetup() {
  return assistantRequest<{ serverUrl: string; staticClientId?: string; connections: McpConnection[] }>("/mcp/connections");
}

export function getMcpConsent(requestId: string) {
  return assistantRequest<{ clientName: string; workspaceName: string; scopes: string[] }>(`/mcp/consent?request_id=${encodeURIComponent(requestId)}`);
}

export function respondToMcpConsent(requestId: string, approved: boolean) {
  return assistantRequest<{ redirectUrl: string }>("/mcp/consent", {
    method: "POST",
    body: JSON.stringify({ requestId, approved }),
  });
}

export function disconnectMcpClient(clientId: string) {
  return assistantRequest<void>(`/mcp/connections/${encodeURIComponent(clientId)}`, { method: "DELETE" });
}
