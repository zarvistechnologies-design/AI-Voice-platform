"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import { API_URL } from "@/lib/apiBase";
import {
  developerApi,
  type ApiKeyRecord,
  type ApiKeyScope,
  type WebhookDelivery,
  type WebhookEndpoint,
  type WebhookEvent,
} from "@/lib/developer";

const defaultScopes: ApiKeyScope[] = ["read", "calls:trigger"];
const defaultEvents: WebhookEvent[] = ["call.ended", "transcript.ready"];

const scopeLabels: Record<ApiKeyScope, string> = {
  read: "Read calls and agents",
  "agents:write": "Manage agents",
  "calls:trigger": "Start outbound calls",
  "full-access": "Full access",
};

const eventLabels: Record<WebhookEvent, string> = {
  "call.started": "Call started",
  "call.ended": "Call ended",
  "call.failed": "Call failed",
  "transcript.ready": "Transcript ready",
};

type DeveloperView = "overview" | "keys" | "webhooks" | "activity";
type InspectorView = "request" | "response" | "webhook";

const panelClass = "border border-[#dce3ea] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.045)]";
const controlClass = "h-10 rounded-md border border-[#cfd8e3] bg-white px-3 text-sm font-medium text-[#172033] outline-none transition placeholder:text-[#8a96a8] focus:border-[#087f8c] focus:ring-3 focus:ring-[#087f8c]/10";
const primaryButtonClass = "inline-flex h-10 items-center justify-center rounded-md bg-[#087f8c] px-4 text-sm font-semibold text-white transition hover:bg-[#066a75] disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass = "inline-flex h-9 items-center justify-center rounded-md border border-[#cfd8e3] bg-white px-3 text-sm font-semibold text-[#334155] transition hover:border-[#9aacbd] hover:bg-[#f4f7fa]";
const dangerButtonClass = "inline-flex h-9 items-center justify-center rounded-md border border-[#fecdd3] bg-white px-3 text-sm font-semibold text-[#be123c] transition hover:bg-[#fff1f2]";
const includedFields = ["recording_url", "chat", "transcription_text", "providers", "usage", "billing", "structuredOutput"];
const endpointRows = [
  ["GET", "/api/v1/agents"],
  ["GET", "/api/v1/calls"],
  ["GET", "/api/v1/call-logs"],
  ["GET", "/api/v1/calls/{callId}"],
  ["GET", "/api/v1/calls/{callId}/recording"],
  ["GET", "/api/v1/calls/stream"],
  ["POST", "/api/v1/calls/outbound"],
] as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value?: string) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function deliveryTone(status: WebhookDelivery["status"]) {
  if (status === "delivered") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "failed") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (status === "retrying") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function DeliveryDot({ status }: { status: WebhookDelivery["status"] }) {
  const tone = status === "delivered"
    ? "bg-emerald-500"
    : status === "failed"
      ? "bg-rose-500"
      : status === "retrying"
        ? "bg-amber-500"
        : "bg-slate-400";
  return <span className={`size-2 rounded-full ${tone}`} aria-hidden="true" />;
}

function FieldLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function EndpointRow({ method, path }: { method: "GET" | "POST"; path: string }) {
  const methodClass = method === "POST" ? "bg-[#f3e8ff] text-[#7e22ce]" : "bg-[#dcfce7] text-[#15803d]";
  return (
    <div className="grid grid-cols-[54px_minmax(0,1fr)] items-center gap-2 border-b border-[#e8edf2] px-3 py-2.5 last:border-b-0">
      <span className={`rounded px-2 py-1 text-center text-[10px] font-black ${methodClass}`}>{method}</span>
      <code className="min-w-0 truncate text-xs font-semibold text-[#475569]">{path}</code>
    </div>
  );
}

function sampleCurl(baseUrl: string) {
  return `curl "${baseUrl}/calls?limit=20" \\
  -H "Authorization: Bearer avp_your_api_key"`;
}

function sampleOutboundCurl(baseUrl: string) {
  return `curl -X POST "${baseUrl}/calls/outbound" \\
  -H "Authorization: Bearer avp_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"agentId":"agent_id","phoneNumber":"+919999999999"}'`;
}

function sampleCallResponse() {
  return `{
  "call": {
    "id": "call_id",
    "session_id": "inbound-918071578947-_07300655336",
    "call_status": "completed",
    "direction": "inbound",
    "duration": 90,
    "voip": {
      "from": "+919999999999",
      "to": "+918047280782",
      "direction": "inbound"
    },
    "recording_url": "https://www.vozon.ai/api/v1/calls/call_id/recording",
    "recording": {
      "key": "recordings/inbound-...mp3",
      "url": "https://www.vozon.ai/api/v1/calls/call_id/recording",
      "status": "completed"
    },
    "chat": [
      {
        "role": "user",
        "content": "Hello",
        "timestamp": "2026-07-01T12:00:10.000Z"
      }
    ],
    "transcription_text": "Customer: Hello\\nAgent: Hi, how can I help?",
    "providers": {
      "llm": { "provider": "sarvam", "model": "sarvam-m" },
      "stt": { "provider": "sarvam" },
      "tts": { "provider": "sarvam" }
    },
    "usage": {
      "llmTokens": 1200,
      "sttSeconds": 90,
      "ttsCharacters": 600
    },
    "billing": {
      "chargedCredits": 1.25
    },
    "structuredOutput": {},
    "metadata": {
      "source": "ai_voice_platform",
      "apiVersion": "v1"
    }
  }
}`;
}

function sampleWebhookPayload() {
  return `{
  "id": "call.ended:call_id",
  "event": "call.ended",
  "createdAt": "2026-07-01T12:00:00.000Z",
  "data": {
    "id": "call_id",
    "session_id": "inbound-918071578947-_07300655336",
    "direction": "inbound",
    "call_status": "completed",
    "voip": {
      "from": "+919999999999",
      "to": "+918047280782",
      "direction": "inbound"
    },
    "recording_url": "https://www.vozon.ai/api/v1/calls/call_id/recording",
    "chat": [],
    "transcription_text": "Customer: Hello\\nAgent: Hi, how can I help?",
    "providers": {
      "llm": { "provider": "sarvam", "model": "sarvam-m" },
      "stt": { "provider": "sarvam" },
      "tts": { "provider": "sarvam" }
    },
    "usage": {
      "llmTokens": 1200,
      "sttSeconds": 90,
      "ttsCharacters": 600
    },
    "billing": {
      "chargedCredits": 1.25
    }
  }
}`;
}

export function DeveloperShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [scopeCatalog, setScopeCatalog] = useState<ApiKeyScope[]>(defaultScopes);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [eventCatalog, setEventCatalog] = useState<WebhookEvent[]>(defaultEvents);
  const [keyName, setKeyName] = useState("External platform key");
  const [keyScopes, setKeyScopes] = useState<ApiKeyScope[]>(defaultScopes);
  const [keyExpiry, setKeyExpiry] = useState("");
  const [createdKey, setCreatedKey] = useState("");
  const [webhookName, setWebhookName] = useState("Call events");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>(defaultEvents);
  const [createdSecret, setCreatedSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [activeView, setActiveView] = useState<DeveloperView>("overview");
  const [inspectorView, setInspectorView] = useState<InspectorView>("request");
  const baseUrl = useMemo(() => `${API_URL}/api/v1`, []);
  const activeKeys = useMemo(() => apiKeys.filter((apiKey) => !apiKey.revokedAt).length, [apiKeys]);
  const enabledWebhooks = useMemo(() => webhooks.filter((webhook) => webhook.enabled).length, [webhooks]);
  const deliveredCount = useMemo(() => deliveries.filter((delivery) => delivery.status === "delivered").length, [deliveries]);
  const lastDelivery = deliveries[0];

  const loadDeveloperData = useCallback(async () => {
    setLoading(true);
    try {
      const [keys, hooks] = await Promise.all([
        developerApi.apiKeys(),
        developerApi.webhooks(),
      ]);
      setApiKeys(keys.apiKeys);
      setScopeCatalog(keys.scopeCatalog.length ? keys.scopeCatalog : defaultScopes);
      setWebhooks(hooks.webhooks);
      setDeliveries(hooks.deliveries);
      setEventCatalog(hooks.eventCatalog.length ? hooks.eventCatalog : defaultEvents);
      setNotice("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load developer settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/developers");
      return;
    }
    const timer = window.setTimeout(() => {
      void validateStoredSession();
      void loadDeveloperData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDeveloperData, router, session]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(`${label} copied.`);
    } catch {
      setNotice(`Could not copy ${label.toLowerCase()}.`);
    }
  }

  async function createKey() {
    try {
      const result = await developerApi.createApiKey({
        name: keyName,
        scopes: keyScopes,
        expiresAt: keyExpiry || undefined,
      });
      setCreatedKey(result.key);
      setKeyName("External platform key");
      setKeyExpiry("");
      await loadDeveloperData();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create API key.");
    }
  }

  async function revokeKey(apiKey: ApiKeyRecord) {
    try {
      await developerApi.revokeApiKey(apiKey._id);
      await loadDeveloperData();
      setNotice(`${apiKey.name} revoked.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not revoke API key.");
    }
  }

  async function createWebhook() {
    try {
      const result = await developerApi.createWebhook({
        name: webhookName,
        url: webhookUrl,
        events: webhookEvents,
      });
      setCreatedSecret(result.secret);
      setWebhookName("Call events");
      setWebhookUrl("");
      await loadDeveloperData();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create webhook.");
    }
  }

  async function toggleWebhook(webhook: WebhookEndpoint) {
    try {
      await developerApi.updateWebhook(webhook._id, { enabled: !webhook.enabled });
      await loadDeveloperData();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not update webhook.");
    }
  }

  async function deleteWebhook(webhook: WebhookEndpoint) {
    try {
      await developerApi.deleteWebhook(webhook._id);
      await loadDeveloperData();
      setNotice(`${webhook.name} deleted.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not delete webhook.");
    }
  }

  async function testWebhook(webhook: WebhookEndpoint) {
    try {
      await developerApi.testWebhook(webhook._id);
      await loadDeveloperData();
      setNotice(`Test sent to ${webhook.name}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not send test webhook.");
    }
  }

  const inspectorContent = inspectorView === "request"
    ? sampleCurl(baseUrl)
    : inspectorView === "response"
      ? sampleCallResponse()
      : sampleWebhookPayload();
  const inspectorLabel = inspectorView === "request"
    ? "List calls request"
    : inspectorView === "response"
      ? "Call response"
      : "Webhook event";

  if (!session) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-700">Loading developer tools</main>;
  }

  return (
    <main className={`grid min-h-screen bg-[#f4f6f8] text-[#172033] ${
      showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
    }`}>
      <DashboardSidebar
        activeLabel="Developers"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => void logoutSession().then(() => router.replace("/login"))}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />

      <section className="min-w-0">
        <header className="border-b border-[#dce3ea] bg-white px-4 py-4 lg:px-6">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#16a34a] shadow-[0_0_0_4px_rgba(22,163,74,0.12)]" aria-hidden="true" />
                <span className="text-xs font-bold uppercase text-[#15803d]">Production API online</span>
              </div>
              <h1 className="mt-1 text-xl font-semibold text-[#101827] sm:text-2xl">Developer workspace</h1>
            </div>
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex h-10 min-w-0 items-center border border-[#d3dce6] bg-[#f8fafc] pl-3">
                <span className="shrink-0 text-[10px] font-black uppercase text-[#78869a]">API v1</span>
                <code className="min-w-0 truncate px-3 text-xs font-semibold text-[#334155]">{baseUrl}</code>
                <button className="h-full shrink-0 border-l border-[#d3dce6] bg-white px-3 text-xs font-bold text-[#087f8c] hover:bg-[#eefbfb]" type="button" onClick={() => void copyText(baseUrl, "Base URL")}>Copy</button>
              </div>
              <button className={secondaryButtonClass} type="button" onClick={() => void loadDeveloperData()}>{loading ? "Refreshing..." : "Refresh data"}</button>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1600px] gap-4 p-4 lg:p-6 xl:grid-cols-[190px_minmax(0,1fr)_380px] xl:gap-5">
          <nav className="flex overflow-x-auto border border-[#dce3ea] bg-white p-1.5 xl:block xl:self-start xl:p-2" aria-label="Developer workspace sections">
            {([
              ["overview", "Overview", "API health"],
              ["keys", "API keys", `${activeKeys} active`],
              ["webhooks", "Webhooks", `${enabledWebhooks} enabled`],
              ["activity", "Event activity", `${deliveries.length} recent`],
            ] as const).map(([value, label, detail], index) => (
              <button
                className={`min-w-36 border-l-2 px-3 py-2.5 text-left transition xl:mb-1 xl:block xl:w-full ${
                  activeView === value
                    ? "border-[#087f8c] bg-[#edf8f8] text-[#065f68]"
                    : "border-transparent text-[#64748b] hover:bg-[#f5f7f9] hover:text-[#172033]"
                }`}
                key={value}
                type="button"
                onClick={() => setActiveView(value)}
              >
                <span className="flex items-center gap-2 text-sm font-semibold"><span className="w-4 text-[10px] text-[#94a3b8]">0{index + 1}</span>{label}</span>
                <span className="ml-6 mt-0.5 block text-xs opacity-75">{detail}</span>
              </button>
            ))}
            <div className="mt-4 hidden border-t border-[#e4e9ef] px-3 pt-4 xl:block">
              <span className="text-[10px] font-black uppercase text-[#8a96a8]">Authentication</span>
              <code className="mt-2 block break-all text-[11px] leading-5 text-[#475569]">Bearer avp_...</code>
            </div>
          </nav>

          <div className="min-w-0">
            {activeView === "overview" ? (
              <section className={`${panelClass} min-h-[720px]`}>
                <div className="flex flex-col gap-3 border-b border-[#dce3ea] px-5 py-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase text-[#087f8c]">Connection map</span>
                    <h2 className="mt-1 text-xl font-semibold text-[#101827]">Your API at a glance</h2>
                  </div>
                  <span className="text-xs font-medium text-[#64748b]">Last synced {loading ? "now" : "just now"}</span>
                </div>

                <div className="grid border-b border-[#dce3ea] sm:grid-cols-4">
                  {[
                    ["01", "Authenticate", `${activeKeys} active keys`, "#087f8c"],
                    ["02", "Create call", "POST outbound", "#7c3aed"],
                    ["03", "Receive event", `${enabledWebhooks} webhooks`, "#e05252"],
                    ["04", "Fetch result", "Recording + transcript", "#15803d"],
                  ].map(([number, label, detail, color], index) => (
                    <div className={`relative min-h-32 px-4 py-5 ${index ? "border-t border-[#e4e9ef] sm:border-l sm:border-t-0" : ""}`} key={label}>
                      <span className="text-[10px] font-black" style={{ color }}>{number}</span>
                      <strong className="mt-5 block text-sm text-[#172033]">{label}</strong>
                      <span className="mt-1 block text-xs text-[#718096]">{detail}</span>
                      <span className="absolute bottom-0 left-0 h-1 w-full" style={{ backgroundColor: color }} aria-hidden="true" />
                    </div>
                  ))}
                </div>

                <div className="grid border-b border-[#dce3ea] sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["Active keys", activeKeys, `${apiKeys.length} total`],
                    ["Live webhooks", enabledWebhooks, `${webhooks.length} configured`],
                    ["Delivered", deliveredCount, `${deliveries.length} attempts`],
                    ["Latest event", lastDelivery?.event ?? "None", lastDelivery ? formatDate(lastDelivery.createdAt) : "Waiting for events"],
                  ].map(([label, value, detail], index) => (
                    <div className={`px-5 py-4 ${index ? "border-t border-[#e4e9ef] sm:border-l sm:border-t-0 sm:[&:nth-child(3)]:border-l-0 sm:[&:nth-child(3)]:border-t lg:[&:nth-child(3)]:border-l lg:[&:nth-child(3)]:border-t-0" : ""}`} key={label}>
                      <span className="text-xs font-semibold text-[#718096]">{label}</span>
                      <strong className="mt-1 block truncate text-xl font-semibold text-[#101827]">{value}</strong>
                      <span className="mt-1 block truncate text-xs text-[#8a96a8]">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-[minmax(0,1fr)_270px]">
                  <div className="border-b border-[#dce3ea] p-5 lg:border-b-0 lg:border-r">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-[#172033]">Available endpoints</h3>
                        <p className="mt-1 text-xs text-[#718096]">Stable REST routes under /api/v1</p>
                      </div>
                      <span className="rounded bg-[#e7f7f7] px-2 py-1 text-xs font-bold text-[#087f8c]">{endpointRows.length} routes</span>
                    </div>
                    <div className="border border-[#dce3ea]">
                      {endpointRows.map(([method, path]) => <EndpointRow key={`${method}-${path}`} method={method} path={path} />)}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-semibold text-[#172033]">Call object</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {includedFields.map((item, index) => (
                        <code className={`border-l-2 bg-[#f5f7f9] px-2 py-1.5 text-[11px] font-semibold ${index % 3 === 0 ? "border-[#087f8c]" : index % 3 === 1 ? "border-[#e05252]" : "border-[#7c3aed]"}`} key={item}>{item}</code>
                      ))}
                    </div>
                    <button className="mt-5 text-sm font-semibold text-[#087f8c] hover:text-[#065f68]" type="button" onClick={() => setInspectorView("response")}>Inspect response</button>
                  </div>
                </div>
              </section>
            ) : null}

            {activeView === "keys" ? (
              <section className={`${panelClass} min-h-[720px]`}>
                <div className="flex items-center justify-between gap-4 border-b border-[#dce3ea] px-5 py-5">
                  <div><h2 className="text-xl font-semibold text-[#101827]">API keys</h2><p className="mt-1 text-xs text-[#718096]">Production credentials and access scopes</p></div>
                  <span className="rounded bg-[#e7f7f7] px-2.5 py-1 text-xs font-bold text-[#087f8c]">{activeKeys} active</span>
                </div>
                {createdKey ? (
                  <div className="border-b border-[#86c9a4] bg-[#effbf3] px-5 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0"><strong className="block text-sm text-[#166534]">New key created. Copy it now.</strong><code className="mt-2 block truncate bg-white px-3 py-2 text-xs text-[#334155]">{createdKey}</code></div>
                      <button className="h-9 shrink-0 rounded-md bg-[#15803d] px-3 text-sm font-semibold text-white" type="button" onClick={() => void copyText(createdKey, "API key")}>Copy key</button>
                    </div>
                  </div>
                ) : null}
                <div className="border-b border-[#dce3ea] bg-[#f8fafc] p-5">
                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                    <FieldLabel label="Key name"><input className={controlClass} value={keyName} onChange={(event) => setKeyName(event.target.value)} placeholder="External platform key" /></FieldLabel>
                    <FieldLabel label="Optional expiry"><input className={controlClass} value={keyExpiry} onChange={(event) => setKeyExpiry(event.target.value)} type="datetime-local" /></FieldLabel>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {scopeCatalog.map((scope) => (
                      <label className={`flex cursor-pointer items-center gap-3 border px-3 py-2.5 text-sm font-semibold transition ${keyScopes.includes(scope) ? "border-[#6bb7bd] bg-[#edf8f8] text-[#065f68]" : "border-[#d7dfe8] bg-white text-[#526174]"}`} key={scope}>
                        <input checked={keyScopes.includes(scope)} onChange={() => setKeyScopes((current) => toggleValue(current, scope))} type="checkbox" />
                        {scopeLabels[scope] ?? scope}
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end"><button className={primaryButtonClass} disabled={!keyName.trim() || !keyScopes.length} type="button" onClick={() => void createKey()}>Create API key</button></div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="border-b border-[#dce3ea] bg-white text-[10px] font-black uppercase text-[#78869a]"><tr>{["Name", "Prefix", "Scopes", "Last used", "Status", ""].map((item) => <th className="px-4 py-3" key={item}>{item}</th>)}</tr></thead>
                    <tbody className="divide-y divide-[#e8edf2]">
                      {apiKeys.map((apiKey) => (
                        <tr className="hover:bg-[#fafbfc]" key={apiKey._id}>
                          <td className="px-4 py-3 font-semibold text-[#172033]">{apiKey.name}</td><td className="px-4 py-3 font-mono text-xs text-[#64748b]">{apiKey.prefix}...</td><td className="px-4 py-3 text-xs text-[#526174]">{apiKey.scopes.join(", ")}</td><td className="px-4 py-3 text-xs text-[#64748b]">{formatDate(apiKey.lastUsedAt)}</td>
                          <td className="px-4 py-3"><span className={`rounded px-2 py-1 text-xs font-semibold ${apiKey.revokedAt ? "bg-[#fff1f2] text-[#be123c]" : "bg-[#ecfdf5] text-[#15803d]"}`}>{apiKey.revokedAt ? "Revoked" : "Active"}</span></td>
                          <td className="px-4 py-3 text-right">{!apiKey.revokedAt ? <button className="text-sm font-semibold text-[#be123c]" type="button" onClick={() => void revokeKey(apiKey)}>Revoke</button> : null}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!apiKeys.length ? <div className="p-10 text-center text-sm text-[#718096]">No API keys yet.</div> : null}
                </div>
              </section>
            ) : null}

            {activeView === "webhooks" ? (
              <section className={`${panelClass} min-h-[720px]`}>
                <div className="flex items-center justify-between gap-4 border-b border-[#dce3ea] px-5 py-5">
                  <div><h2 className="text-xl font-semibold text-[#101827]">Webhooks</h2><p className="mt-1 text-xs text-[#718096]">Signed call lifecycle events</p></div>
                  <span className="rounded bg-[#fff1ee] px-2.5 py-1 text-xs font-bold text-[#c24134]">{enabledWebhooks} listening</span>
                </div>
                {createdSecret ? (
                  <div className="border-b border-[#86c9a4] bg-[#effbf3] px-5 py-4"><strong className="block text-sm text-[#166534]">Signing secret created. Copy it now.</strong><div className="mt-2 flex gap-2"><code className="min-w-0 flex-1 truncate bg-white px-3 py-2 text-xs">{createdSecret}</code><button className="rounded-md bg-[#15803d] px-3 text-sm font-semibold text-white" type="button" onClick={() => void copyText(createdSecret, "Webhook secret")}>Copy</button></div></div>
                ) : null}
                <div className="border-b border-[#dce3ea] bg-[#f8fafc] p-5">
                  <div className="grid gap-3 lg:grid-cols-[210px_minmax(0,1fr)]">
                    <FieldLabel label="Endpoint name"><input className={controlClass} value={webhookName} onChange={(event) => setWebhookName(event.target.value)} placeholder="Call events" /></FieldLabel>
                    <FieldLabel label="Destination URL"><input className={controlClass} value={webhookUrl} onChange={(event) => setWebhookUrl(event.target.value)} placeholder="https://your-platform.com/webhooks/calls" /></FieldLabel>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {eventCatalog.map((event) => (
                      <label className={`flex cursor-pointer items-center gap-3 border px-3 py-2.5 text-sm font-semibold transition ${webhookEvents.includes(event) ? "border-[#ef9b91] bg-[#fff5f3] text-[#9f342a]" : "border-[#d7dfe8] bg-white text-[#526174]"}`} key={event}>
                        <input checked={webhookEvents.includes(event)} onChange={() => setWebhookEvents((current) => toggleValue(current, event))} type="checkbox" />{eventLabels[event] ?? event}
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3"><code className="text-[11px] text-[#718096]">X-AI-Voice-Signature</code><button className={primaryButtonClass} disabled={!webhookName.trim() || !webhookUrl.trim() || !webhookEvents.length} type="button" onClick={() => void createWebhook()}>Create webhook</button></div>
                </div>
                <div className="divide-y divide-[#e8edf2]">
                  {webhooks.map((webhook) => (
                    <article className="p-4 hover:bg-[#fafbfc]" key={webhook._id}>
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0"><div className="flex items-center gap-2"><DeliveryDot status={webhook.enabled ? "delivered" : "pending"} /><strong className="text-sm text-[#172033]">{webhook.name}</strong><span className="text-xs text-[#718096]">{webhook.enabled ? "Enabled" : "Disabled"}</span></div><p className="mt-1 truncate font-mono text-xs text-[#526174]">{webhook.url}</p><p className="mt-1 text-xs text-[#8a96a8]">{webhook.events.join(" / ")}</p></div>
                        <div className="flex flex-wrap gap-2"><button className={secondaryButtonClass} type="button" onClick={() => void testWebhook(webhook)}>Send test</button><button className={secondaryButtonClass} type="button" onClick={() => void toggleWebhook(webhook)}>{webhook.enabled ? "Disable" : "Enable"}</button><button className={dangerButtonClass} type="button" onClick={() => void deleteWebhook(webhook)}>Delete</button></div>
                      </div>
                    </article>
                  ))}
                  {!webhooks.length ? <div className="p-10 text-center text-sm text-[#718096]">No webhook endpoints yet.</div> : null}
                </div>
              </section>
            ) : null}

            {activeView === "activity" ? (
              <section className={`${panelClass} min-h-[720px]`}>
                <div className="flex items-center justify-between gap-4 border-b border-[#dce3ea] px-5 py-5"><div><h2 className="text-xl font-semibold text-[#101827]">Event activity</h2><p className="mt-1 text-xs text-[#718096]">Recent webhook delivery attempts</p></div><span className="text-xs font-semibold text-[#64748b]">{deliveredCount} delivered</span></div>
                <div className="divide-y divide-[#e8edf2]">
                  {deliveries.map((delivery) => (
                    <div className="grid gap-3 px-5 py-4 hover:bg-[#fafbfc] sm:grid-cols-[minmax(0,1fr)_130px_100px] sm:items-center" key={delivery._id}>
                      <div className="min-w-0"><span className="flex items-center gap-2 text-sm font-semibold text-[#172033]"><DeliveryDot status={delivery.status} />{delivery.event}</span>{delivery.errorMessage ? <p className="mt-1 line-clamp-2 text-xs text-[#be123c]">{delivery.errorMessage}</p> : <p className="mt-1 text-xs text-[#718096]">Delivery completed without an error message</p>}</div>
                      <span className="text-xs text-[#64748b]">{formatDate(delivery.createdAt)}</span>
                      <div className="sm:text-right"><span className={`rounded px-2 py-1 text-[11px] font-semibold ring-1 ${deliveryTone(delivery.status)}`}>{delivery.responseStatus || delivery.status}</span></div>
                    </div>
                  ))}
                  {!deliveries.length ? <div className="p-12 text-center text-sm text-[#718096]">No delivery activity yet.</div> : null}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="min-w-0 self-start bg-[#101827] text-white shadow-[0_18px_48px_rgba(15,23,42,0.18)] xl:sticky xl:top-5">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div><span className="block text-[10px] font-black uppercase text-[#70d1d8]">API inspector</span><strong className="mt-0.5 block text-sm">{inspectorLabel}</strong></div>
              <button className="rounded border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10" type="button" onClick={() => void copyText(inspectorContent, inspectorLabel)}>Copy</button>
            </div>
            <div className="grid grid-cols-3 border-b border-white/10 bg-[#0b1220] p-1.5">
              {(["request", "response", "webhook"] as const).map((view) => (
                <button className={`h-8 rounded text-xs font-semibold capitalize transition ${inspectorView === view ? "bg-white text-[#101827]" : "text-[#9facbd] hover:text-white"}`} key={view} type="button" onClick={() => setInspectorView(view)}>{view}</button>
              ))}
            </div>
            <pre className="max-h-[520px] min-h-80 overflow-auto p-4 text-xs leading-5 text-[#d7e2ef]">{inspectorContent}</pre>
            <div className="border-t border-white/10 bg-[#0b1220] p-4">
              <span className="text-[10px] font-black uppercase text-[#8fa0b4]">Outbound call</span>
              <pre className="mt-2 max-h-44 overflow-auto whitespace-pre-wrap text-[11px] leading-5 text-[#b7c6d8]">{sampleOutboundCurl(baseUrl)}</pre>
              <button className="mt-3 text-xs font-bold text-[#70d1d8] hover:text-white" type="button" onClick={() => void copyText(sampleOutboundCurl(baseUrl), "Outbound call example")}>Copy outbound request</button>
            </div>
          </aside>
        </div>
      </section>

      {notice ? (
        <div className="fixed bottom-4 right-4 z-50 grid w-[min(380px,calc(100vw-32px))] grid-cols-[4px_minmax(0,1fr)_28px] overflow-hidden border border-[#cfd8e3] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.2)]" role="status" aria-live="polite">
          <span className="bg-[#087f8c]" aria-hidden="true" />
          <span className="px-4 py-3 text-sm font-semibold text-[#334155]">{notice}</span>
          <button className="mr-2 mt-2 grid size-7 place-items-center rounded text-[#78869a] hover:bg-[#f1f5f9]" type="button" aria-label="Dismiss notification" onClick={() => setNotice("")}>x</button>
        </div>
      ) : null}
    </main>
  );
}
