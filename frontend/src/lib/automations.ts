import { API_URL } from "@/lib/apiBase";
import { getAuthHeaders, getSession } from "@/lib/auth";

export type BlockType = "trigger" | "call" | "whatsapp" | "decision" | "condition" | "wait" | "end" | "sms" | "crm" | "calendar" | "payment" | "case";
export type Branch = "default" | "interested" | "callback" | "not_interested" | "unknown" | "yes" | "no" | "failed";
export type FlowNode = { id: string; type: BlockType; title: string; x: number; y: number; config: Record<string, string> };
export type FlowEdge = { id: string; source: string; target: string; sourceHandle: Branch };
export type FlowGraph = { schemaVersion: 1; nodes: FlowNode[]; edges: FlowEdge[] };
export type FlowIssue = { nodeId: string; message: string };
export type Automation = {
  _id: string; name: string; description: string; status: "draft" | "live" | "paused";
  revision: number; publishedVersion: number; draft: FlowGraph; published: FlowGraph | null;
  webhookSecret?: string;
  createdAt: string; updatedAt: string; publishedAt: string | null;
};
export type AutomationSummary = Pick<Automation, "_id" | "name" | "description" | "status" | "revision" | "publishedVersion" | "updatedAt" | "createdAt">;
export type RunStep = { nodeId: string; title: string; type: string; status: string; detail: string; at: string };
export type AutomationRun = { _id: string; version: number; eventId: string; contactName: string; contactPhone: string; status: string; currentNodeId: string; steps: RunStep[]; error: string; createdAt: string; finishedAt: string | null };
export type AutomationVersion = { _id: string; version: number; name: string; publishedBy: string; createdAt: string };

export function normalizeFlowGraph(graph: FlowGraph): FlowGraph {
  return { ...graph, nodes: graph.nodes.map((node) => ({ ...node, config: node.config ?? {} })) };
}

function normalizeFlowResponse(response: { flow: Automation }) {
  return { flow: { ...response.flow, draft: normalizeFlowGraph(response.flow.draft), published: response.flow.published ? normalizeFlowGraph(response.flow.published) : null } };
}

async function request<T>(path: string, init: RequestInit = {}) {
  if (!getSession()) throw new Error("Sign in to manage workflows.");
  const response = await fetch(`${API_URL}/api/voice/automations${path}`, {
    ...init, credentials: "include",
    headers: { "Content-Type": "application/json", ...getAuthHeaders(), ...init.headers },
  });
  if (response.status === 204) return {} as T;
  const body = await response.json().catch(() => null) as (T & { message?: string; issues?: FlowIssue[] }) | null;
  if (!response.ok) {
    const error = new Error(body?.message ?? "The workflow request failed.") as Error & { issues?: FlowIssue[] };
    error.issues = body?.issues;
    throw error;
  }
  if (!body) throw new Error("The workflow service returned an empty response.");
  return body;
}

export const automationsApi = {
  list: () => request<{ flows: AutomationSummary[] }>(""),
  get: (id: string) => request<{ flow: Automation }>(`/${encodeURIComponent(id)}`).then(normalizeFlowResponse),
  create: (draft: { name: string; description: string; graph: FlowGraph }) => request<{ flow: Automation }>("", { method: "POST", body: JSON.stringify(draft) }).then(normalizeFlowResponse),
  save: (id: string, draft: { name: string; description: string; graph: FlowGraph; revision: number }) => request<{ flow: Automation }>(`/${encodeURIComponent(id)}/draft`, { method: "PUT", body: JSON.stringify(draft) }).then(normalizeFlowResponse),
  remove: (id: string) => request<void>(`/${encodeURIComponent(id)}`, { method: "DELETE" }),
  validate: (id: string, graph: FlowGraph) => request<{ issues: FlowIssue[] }>(`/${encodeURIComponent(id)}/validate`, { method: "POST", body: JSON.stringify({ graph }) }),
  test: (id: string, outcome: string) => request<{ mode: "dry_run"; steps: Array<{ nodeId: string; title: string; type: string; detail: string }> }>(`/${encodeURIComponent(id)}/test`, { method: "POST", body: JSON.stringify({ outcome }) }),
  publish: (id: string) => request<{ flow: Automation }>(`/${encodeURIComponent(id)}/publish`, { method: "POST" }).then(normalizeFlowResponse),
  setStatus: (id: string, status: "live" | "paused") => request<{ flow: Automation }>(`/${encodeURIComponent(id)}/status`, { method: "POST", body: JSON.stringify({ status }) }).then(normalizeFlowResponse),
  runs: (id: string) => request<{ runs: AutomationRun[] }>(`/${encodeURIComponent(id)}/runs`),
  versions: (id: string) => request<{ versions: AutomationVersion[] }>(`/${encodeURIComponent(id)}/versions`),
  restore: (id: string, version: number) => request<{ flow: Automation }>(`/${encodeURIComponent(id)}/versions/${version}/restore`, { method: "POST" }).then(normalizeFlowResponse),
  start: (id: string, phone: string, name: string, eventId: string) => request<{ run: AutomationRun }>(`/${encodeURIComponent(id)}/runs`, { method: "POST", body: JSON.stringify({ phone, name, eventId, consentConfirmed: true }) }),
  startBulk: (id: string, payload: { groupId?: string; rawText?: string; consentConfirmed: true }) =>
    request<{ ok: boolean; queued: number; skippedDuplicates: number; skippedDnc: number; skippedInvalid: number; capped: number; automationName: string }>(
      `/${encodeURIComponent(id)}/runs/bulk`,
      { method: "POST", body: JSON.stringify(payload) },
    ),
  cancelRun: (id: string, runId: string) => request<{ run: AutomationRun }>(`/${encodeURIComponent(id)}/runs/${encodeURIComponent(runId)}/cancel`, { method: "POST" }),
  rotateWebhookSecret: (id: string) => request<{ flow: Automation }>(`/${encodeURIComponent(id)}/webhook-secret/rotate`, { method: "POST" }).then(normalizeFlowResponse),
  generate: (prompt: string) => request<{ draft: { name: string; description: string; graph: FlowGraph }; issues: FlowIssue[] }>("/generate", { method: "POST", body: JSON.stringify({ prompt }) }),
};
