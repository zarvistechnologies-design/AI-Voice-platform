"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  DashboardSidebar,
  getDashboardSidebarInitialState,
} from "@/components/dashboard/DashboardSidebar";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
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

const panelClass =
  "overflow-hidden rounded-2xl border border-[#dde7e3] bg-white shadow-[0_10px_30px_rgba(28,64,55,0.055)]";
const controlClass =
  "h-11 rounded-xl border border-[#d7e2de] bg-white px-3.5 text-sm font-medium text-[#20342e] outline-none transition placeholder:text-[#9aa8a4] focus:border-[#118778] focus:ring-3 focus:ring-[#118778]/10";
const primaryButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#118778] px-4 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(17,135,120,0.18)] transition hover:bg-[#0e7568] disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#d7e2de] bg-white px-3.5 text-sm font-semibold text-[#40534e] transition hover:border-[#b8ccc5] hover:bg-[#f6f9f8]";
const dangerButtonClass =
  "inline-flex h-10 items-center justify-center rounded-xl border border-[#ffd3d9] bg-white px-3.5 text-sm font-semibold text-[#d64b62] transition hover:bg-[#fff4f5]";
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
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function deliveryTone(status: WebhookDelivery["status"]) {
  if (status === "delivered")
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "failed") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (status === "retrying") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (status === "processing") return "bg-sky-50 text-sky-700 ring-sky-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function deliveryEventLabel(event: string) {
  return (eventLabels[event as WebhookEvent] ?? event.replaceAll(".", " ")) || "Webhook event";
}

function deliverySummary(delivery: WebhookDelivery) {
  if (delivery.errorMessage) return delivery.errorMessage;
  if (delivery.status === "processing") return "Delivery is currently in progress";
  if (delivery.status === "staged") return "Event is staged and waiting to be delivered";
  if (delivery.status === "pending") return "Event is queued for delivery";
  if (delivery.status === "retrying") {
    return `Retry scheduled after ${delivery.attempts} ${delivery.attempts === 1 ? "attempt" : "attempts"}`;
  }
  const attempts = `${delivery.attempts} ${delivery.attempts === 1 ? "attempt" : "attempts"}`;
  const duration = delivery.durationMs ? ` · ${delivery.durationMs} ms` : "";
  return `Delivered in ${attempts}${duration}`;
}

function DeliveryDot({ status }: { status: WebhookDelivery["status"] }) {
  const tone =
    status === "delivered"
      ? "bg-emerald-500"
      : status === "failed"
        ? "bg-rose-500"
        : status === "retrying"
          ? "bg-amber-500"
          : status === "processing"
            ? "bg-sky-500"
            : "bg-slate-400";
  return <span className={`size-2 rounded-full ${tone}`} aria-hidden="true" />;
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
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
    "recording_url": "https://www.vozon.ai/api/public/recordings/call_id?expires=1780000000&signature=signed_value",
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
    "recording_url": "https://www.vozon.ai/api/public/recordings/call_id?expires=1780000000&signature=signed_value",
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

function DeveloperOverview({
  activeKeys,
  totalKeys,
  enabledWebhooks,
  totalWebhooks,
  deliveredCount,
  deliveries,
  baseUrl,
  loading,
  onCopyBaseUrl,
  onNavigate,
  onOpenInspector,
}: {
  activeKeys: number;
  totalKeys: number;
  enabledWebhooks: number;
  totalWebhooks: number;
  deliveredCount: number;
  deliveries: WebhookDelivery[];
  baseUrl: string;
  loading: boolean;
  onCopyBaseUrl: () => void;
  onNavigate: (view: DeveloperView) => void;
  onOpenInspector: (view: InspectorView) => void;
}) {
  const lastDelivery = deliveries[0];
  const setupItems = [
    {
      label: "Create an API key",
      detail: "Authenticate requests from your application",
      done: activeKeys > 0,
      action: () => onNavigate("keys"),
    },
    {
      label: "Make your first request",
      detail: "Use a ready-to-copy request example",
      done: deliveredCount > 0,
      action: () => onOpenInspector("request"),
    },
    {
      label: "Configure a webhook",
      detail: "Receive call and transcript events",
      done: enabledWebhooks > 0,
      action: () => onNavigate("webhooks"),
    },
  ];
  const completedItems = setupItems.filter((item) => item.done).length;

  return (
    <div className="grid gap-5">
      <section className="grid overflow-hidden rounded-3xl border border-[#d8e5e0] bg-white shadow-[0_14px_38px_rgba(25,67,57,0.06)] xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <div className="relative overflow-hidden p-6 sm:p-7 lg:p-8">
          <span className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-[#118778]/[0.07] blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e9f7f3] px-3 py-1.5 text-xs font-bold text-[#0e6f62]">
                <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                All systems operational
              </span>
              <span className="text-xs font-medium text-[#80908c]">
                {loading ? "Syncing workspace…" : "Updated just now"}
              </span>
            </div>
            <h2 className="mt-6 max-w-2xl text-2xl font-semibold tracking-[-0.03em] text-[#14231f] sm:text-3xl">
              Your API workspace is ready.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#667873]">
              Create secure credentials, connect your first request, and receive real-time call events from one place.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ["Active keys", activeKeys, `${totalKeys} total`],
                ["Live webhooks", enabledWebhooks, `${totalWebhooks} configured`],
                ["Events delivered", deliveredCount, `${deliveries.length} attempts`],
              ].map(([label, value, detail]) => (
                <div className="rounded-2xl border border-[#e2ebe8] bg-[#f8faf9] p-4" key={label}>
                  <span className="text-xs font-semibold text-[#71817d]">{label}</span>
                  <div className="mt-2 flex items-end gap-2">
                    <strong className="text-2xl font-semibold tracking-tight text-[#18302a]">{value}</strong>
                    <span className="mb-0.5 text-[11px] text-[#91a09c]">{detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#e1e9e6] bg-[#fbfcfc] p-6 sm:p-7 xl:border-l xl:border-t-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#77908a]">Getting started</p>
              <h3 className="mt-1 text-lg font-semibold text-[#18302a]">Connect in three steps</h3>
            </div>
            <span className="rounded-full bg-[#e7f4f0] px-2.5 py-1 text-xs font-bold text-[#0e6f62]">
              {completedItems}/3
            </span>
          </div>
          <div className="mt-5 grid gap-2">
            {setupItems.map((item, index) => (
              <button
                className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-white hover:shadow-sm"
                key={item.label}
                type="button"
                onClick={item.action}
              >
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${item.done ? "bg-[#118778] text-white" : "border border-[#d8e3df] bg-white text-[#7f908b]"}`}>
                  {item.done ? "✓" : index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#29413b]">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-[#81908c]">{item.detail}</span>
                </span>
                <span className="text-[#9aaba6] transition group-hover:translate-x-0.5 group-hover:text-[#118778]" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(330px,0.75fr)]">
        <div className={panelClass}>
          <div className="flex flex-col gap-4 border-b border-[#e1e9e6] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="text-base font-semibold text-[#18302a]">Production base URL</h3>
              <p className="mt-1 text-xs text-[#80908c]">Use this URL for every API v1 request.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#edf7f4] px-2.5 py-1 text-[11px] font-bold text-[#0e6f62]">
              <span className="size-1.5 rounded-full bg-emerald-500" /> Live
            </span>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex min-w-0 items-center overflow-hidden rounded-xl border border-[#d7e2de] bg-[#f7f9f8]">
              <code className="min-w-0 flex-1 truncate px-4 py-3 text-xs font-semibold text-[#40534e] sm:text-sm">{baseUrl}</code>
              <button className="h-11 shrink-0 border-l border-[#d7e2de] bg-white px-4 text-xs font-bold text-[#0e6f62] transition hover:bg-[#edf7f4]" type="button" onClick={onCopyBaseUrl}>Copy</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className={primaryButtonClass} type="button" onClick={() => onOpenInspector("request")}>View request example</button>
              <Link className={secondaryButtonClass} href="/docs/api" target="_blank" rel="noreferrer">Open API docs <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </div>

        <div className={panelClass}>
          <div className="flex items-center justify-between border-b border-[#e1e9e6] px-5 py-4 sm:px-6">
            <div>
              <h3 className="text-base font-semibold text-[#18302a]">Recent activity</h3>
              <p className="mt-1 text-xs text-[#80908c]">Latest webhook deliveries</p>
            </div>
            <button className="text-xs font-bold text-[#0e6f62] hover:text-[#0a5e53]" type="button" onClick={() => onNavigate("activity")}>View all</button>
          </div>
          <div className="divide-y divide-[#edf1f0]">
            {deliveries.slice(0, 3).map((delivery) => (
              <button className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-[#f8faf9] sm:px-6" key={delivery._id} type="button" onClick={() => onNavigate("activity")}>
                <span className={`size-2 shrink-0 rounded-full ${delivery.status === "delivered" ? "bg-emerald-500" : delivery.status === "failed" ? "bg-rose-500" : "bg-amber-500"}`} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[#29413b]">{deliveryEventLabel(delivery.event)}</span>
                  <span className="mt-0.5 block text-[11px] text-[#8a9995]">{formatDate(delivery.createdAt)}</span>
                </span>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ring-1 ${deliveryTone(delivery.status)}`}>{delivery.responseStatus || delivery.status}</span>
              </button>
            ))}
            {!deliveries.length ? (
              <div className="px-6 py-8 text-center">
                <span className="mx-auto grid size-10 place-items-center rounded-full bg-[#edf4f1] text-[#6f837d]">↗</span>
                <p className="mt-3 text-sm font-semibold text-[#40534e]">No events yet</p>
                <p className="mt-1 text-xs text-[#8a9995]">Webhook deliveries will appear here.</p>
              </div>
            ) : null}
          </div>
          {lastDelivery ? <div className="border-t border-[#edf1f0] bg-[#f8faf9] px-6 py-2.5 text-[11px] text-[#879691]">Latest event: {deliveryEventLabel(lastDelivery.event)}</div> : null}
        </div>
      </section>

      <section className={panelClass}>
        <div className="flex flex-col gap-3 border-b border-[#e1e9e6] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="text-base font-semibold text-[#18302a]">Available endpoints</h3>
            <p className="mt-1 text-xs text-[#80908c]">Stable REST routes available under /api/v1</p>
          </div>
          <span className="w-fit rounded-full bg-[#edf7f4] px-2.5 py-1 text-xs font-bold text-[#0e6f62]">{endpointRows.length} routes</span>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3">
          {endpointRows.map(([method, path], index) => (
            <button className={`flex min-w-0 items-center gap-3 px-5 py-4 text-left transition hover:bg-[#f8faf9] sm:px-6 ${index ? "border-t border-[#edf1f0] md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(even)]:border-l xl:[&:nth-child(3)]:border-t-0 xl:[&:nth-child(3)]:border-l xl:[&:nth-child(even)]:border-l-0 xl:[&:nth-child(3n+2)]:border-l xl:[&:nth-child(3n)]:border-l" : ""}`} key={`${method}-${path}`} type="button" onClick={() => onOpenInspector(method === "POST" ? "request" : "response")}>
              <span className={`rounded-md px-2 py-1 text-[10px] font-black ${method === "POST" ? "bg-[#fff3e8] text-[#b65e17]" : "bg-[#eaf6f2] text-[#0e6f62]"}`}>{method}</span>
              <code className="min-w-0 flex-1 truncate text-xs font-semibold text-[#50615c]">{path}</code>
              <span className="text-[#9aaba6]" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export function DeveloperShell() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [scopeCatalog, setScopeCatalog] =
    useState<ApiKeyScope[]>(defaultScopes);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [eventCatalog, setEventCatalog] =
    useState<WebhookEvent[]>(defaultEvents);
  const [keyName, setKeyName] = useState("External platform key");
  const [keyScopes, setKeyScopes] = useState<ApiKeyScope[]>(defaultScopes);
  const [keyExpiry, setKeyExpiry] = useState("");
  const [createdKey, setCreatedKey] = useState("");
  const [webhookName, setWebhookName] = useState("Call events");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] =
    useState<WebhookEvent[]>(defaultEvents);
  const [createdSecret, setCreatedSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [showUserSidebar, setShowUserSidebar] = useState(
    getDashboardSidebarInitialState,
  );
  const [activeView, setActiveView] = useState<DeveloperView>("overview");
  const [inspectorView, setInspectorView] = useState<InspectorView>("request");
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [keyComposerOpen, setKeyComposerOpen] = useState(false);
  const [webhookComposerOpen, setWebhookComposerOpen] = useState(false);
  const baseUrl = useMemo(() => `${API_URL}/api/v1`, []);
  const activeKeys = useMemo(
    () => apiKeys.filter((apiKey) => !apiKey.revokedAt).length,
    [apiKeys],
  );
  const enabledWebhooks = useMemo(
    () => webhooks.filter((webhook) => webhook.enabled).length,
    [webhooks],
  );
  const deliveredCount = useMemo(
    () =>
      deliveries.filter((delivery) => delivery.status === "delivered").length,
    [deliveries],
  );

  const loadDeveloperData = useCallback(async () => {
    setLoading(true);
    try {
      const [keys, hooks] = await Promise.all([
        developerApi.apiKeys(),
        developerApi.webhooks(),
      ]);
      setApiKeys(keys.apiKeys);
      setScopeCatalog(
        keys.scopeCatalog.length ? keys.scopeCatalog : defaultScopes,
      );
      setWebhooks(hooks.webhooks);
      setDeliveries(hooks.deliveries);
      setEventCatalog(
        hooks.eventCatalog.length ? hooks.eventCatalog : defaultEvents,
      );
      setNotice("");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not load developer settings.",
      );
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

  useEffect(() => {
    if (!inspectorOpen) return;
    function closeInspector(event: KeyboardEvent) {
      if (event.key === "Escape") setInspectorOpen(false);
    }
    document.addEventListener("keydown", closeInspector);
    return () => document.removeEventListener("keydown", closeInspector);
  }, [inspectorOpen]);

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
      setKeyComposerOpen(false);
      await loadDeveloperData();
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not create API key.",
      );
    }
  }

  async function revokeKey(apiKey: ApiKeyRecord) {
    try {
      await developerApi.revokeApiKey(apiKey._id);
      await loadDeveloperData();
      setNotice(`${apiKey.name} revoked.`);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not revoke API key.",
      );
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
      setWebhookComposerOpen(false);
      await loadDeveloperData();
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not create webhook.",
      );
    }
  }

  async function toggleWebhook(webhook: WebhookEndpoint) {
    try {
      await developerApi.updateWebhook(webhook._id, {
        enabled: !webhook.enabled,
      });
      await loadDeveloperData();
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not update webhook.",
      );
    }
  }

  async function deleteWebhook(webhook: WebhookEndpoint) {
    try {
      await developerApi.deleteWebhook(webhook._id);
      await loadDeveloperData();
      setNotice(`${webhook.name} deleted.`);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not delete webhook.",
      );
    }
  }

  async function testWebhook(webhook: WebhookEndpoint) {
    try {
      await developerApi.testWebhook(webhook._id);
      await loadDeveloperData();
      setNotice(`Test sent to ${webhook.name}.`);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not send test webhook.",
      );
    }
  }

  const inspectorContent =
    inspectorView === "request"
      ? sampleCurl(baseUrl)
      : inspectorView === "response"
        ? sampleCallResponse()
        : sampleWebhookPayload();
  const inspectorLabel =
    inspectorView === "request"
      ? "List calls request"
      : inspectorView === "response"
        ? "Call response"
        : "Webhook event";

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-700">
        Loading developer tools
      </main>
    );
  }

  return (
    <main
      className={`dashboard-home-theme grid min-h-screen bg-[#f6f9f8] text-[#14231f] ${
        showUserSidebar
          ? "lg:grid-cols-[248px_minmax(0,1fr)]"
          : "lg:grid-cols-[64px_minmax(0,1fr)]"
      }`}
    >
      <DashboardSidebar
        activeLabel="Developers"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() =>
          void logoutSession().then(() => router.replace("/login"))
        }
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />

      <section className="min-w-0">
        <DashboardPageHeader
          eyebrow={
            <span className="inline-flex items-center gap-2">
              <span
                className="size-2 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              Production API online
            </span>
          }
          title="Developers"
          description="Connect your apps, manage credentials, and monitor API activity."
          actions={
            <>
              <Link
                href="/docs/api"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#d7e2de] bg-white px-3.5 text-xs font-semibold text-[#294740] transition hover:border-[#b8ccc5] hover:bg-[#f6f9f8]"
              >
                API documentation <span aria-hidden="true">↗</span>
              </Link>
              <button
                className={secondaryButtonClass}
                type="button"
                onClick={() => void loadDeveloperData()}
              >
                {loading ? "Refreshing..." : "Refresh data"}
              </button>
            </>
          }
        />

        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-5 lg:px-7 lg:py-7">
          <nav
            className="flex gap-1 overflow-x-auto border-b border-[#d9e4e0] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Developer workspace sections"
          >
            {(
              [
                ["overview", "Overview", "API health"],
                ["keys", "API keys", `${activeKeys} active`],
                ["webhooks", "Webhooks", `${enabledWebhooks} enabled`],
                ["activity", "Event activity", `${deliveries.length} recent`],
              ] as const
            ).map(([value, label, detail]) => (
              <button
                className={`relative flex h-12 shrink-0 items-center gap-2.5 px-3 text-sm font-semibold transition ${
                  activeView === value
                    ? "text-[#0e6f62] after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[#118778]"
                    : "text-[#687b76] hover:text-[#20342e]"
                }`}
                key={value}
                type="button"
                onClick={() => setActiveView(value)}
              >
                <span>{label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  activeView === value
                    ? "bg-[#e5f4f0] text-[#0e6f62]"
                    : "bg-[#eaf0ee] text-[#71817d]"
                }`}>
                  {detail}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-6 min-w-0">
            <div className="min-w-0">
              {activeView === "overview" ? (
                <>
                  <DeveloperOverview
                    activeKeys={activeKeys}
                    totalKeys={apiKeys.length}
                    enabledWebhooks={enabledWebhooks}
                    totalWebhooks={webhooks.length}
                    deliveredCount={deliveredCount}
                    deliveries={deliveries}
                    baseUrl={baseUrl}
                    loading={loading}
                    onCopyBaseUrl={() => void copyText(baseUrl, "Base URL")}
                    onNavigate={setActiveView}
                    onOpenInspector={(view) => {
                      setInspectorView(view);
                      setInspectorOpen(true);
                    }}
                  />
                </>
              ) : null}

              {activeView === "keys" ? (
                <section className={panelClass}>
                  <div className="flex items-center justify-between gap-4 border-b border-[#dce3ea] px-5 py-5">
                    <div>
                      <h2 className="text-xl font-semibold text-[#14231f]">
                        API keys
                      </h2>
                      <p className="mt-1 text-xs text-[#71817d]">
                        Production credentials and access scopes
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden rounded-full bg-[#edf7f4] px-2.5 py-1 text-xs font-bold text-[#0e6f62] sm:inline-flex">
                        {activeKeys} active
                      </span>
                      <button className={primaryButtonClass} type="button" onClick={() => setKeyComposerOpen((current) => !current)}>
                        <span aria-hidden="true">+</span> {keyComposerOpen ? "Close" : "Create key"}
                      </button>
                    </div>
                  </div>
                  {createdKey ? (
                    <div className="border-b border-[#86c9a4] bg-[#effbf3] px-5 py-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <strong className="block text-sm text-[#166534]">
                            New key created. Copy it now.
                          </strong>
                          <code className="mt-2 block truncate bg-white px-3 py-2 text-xs text-[#334155]">
                            {createdKey}
                          </code>
                        </div>
                        <button
                          className="h-9 shrink-0 rounded-md bg-[#15803d] px-3 text-sm font-semibold text-white"
                          type="button"
                          onClick={() => void copyText(createdKey, "API key")}
                        >
                          Copy key
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {keyComposerOpen ? (
                  <div className="border-b border-[#dce3ea] bg-[#f8fafc] p-5">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-[#20342e]">Create a new API key</h3>
                        <p className="mt-1 text-xs text-[#71817d]">Choose the minimum permissions this integration needs.</p>
                      </div>
                      <button className="text-xl leading-none text-[#84938f] hover:text-[#20342e]" type="button" aria-label="Close key form" onClick={() => setKeyComposerOpen(false)}>×</button>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                      <FieldLabel label="Key name">
                        <input
                          className={controlClass}
                          value={keyName}
                          onChange={(event) => setKeyName(event.target.value)}
                          placeholder="External platform key"
                        />
                      </FieldLabel>
                      <FieldLabel label="Optional expiry">
                        <input
                          className={controlClass}
                          value={keyExpiry}
                          onChange={(event) => setKeyExpiry(event.target.value)}
                          type="datetime-local"
                        />
                      </FieldLabel>
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {scopeCatalog.map((scope) => (
                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${keyScopes.includes(scope) ? "border-[#c4c8ec] bg-[#edf7f4] text-[#123d35]" : "border-[#dfe1ed] bg-white text-[#5f6374] hover:bg-[#f7f9f8]"}`}
                          key={scope}
                        >
                          <input
                            checked={keyScopes.includes(scope)}
                            onChange={() =>
                              setKeyScopes((current) =>
                                toggleValue(current, scope),
                              )
                            }
                            className="accent-[#118778]"
                            type="checkbox"
                          />
                          {scopeLabels[scope] ?? scope}
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        className={primaryButtonClass}
                        disabled={!keyName.trim() || !keyScopes.length}
                        type="button"
                        onClick={() => void createKey()}
                      >
                        Create API key
                      </button>
                    </div>
                  </div>
                  ) : null}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="border-b border-[#dce3ea] bg-white text-[10px] font-black uppercase text-[#84938f]">
                        <tr>
                          {[
                            "Name",
                            "Prefix",
                            "Scopes",
                            "Last used",
                            "Status",
                            "",
                          ].map((item) => (
                            <th className="px-4 py-3" key={item}>
                              {item}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e8edf2]">
                        {apiKeys.map((apiKey) => (
                          <tr className="hover:bg-[#fafbfc]" key={apiKey._id}>
                            <td className="px-4 py-3 font-semibold text-[#20342e]">
                              {apiKey.name}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-[#64748b]">
                              {apiKey.prefix}...
                            </td>
                            <td className="px-4 py-3 text-xs text-[#52645f]">
                              {apiKey.scopes.join(", ")}
                            </td>
                            <td className="px-4 py-3 text-xs text-[#64748b]">
                              {formatDate(apiKey.lastUsedAt)}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded px-2 py-1 text-xs font-semibold ${apiKey.revokedAt ? "bg-[#fff1f2] text-[#be123c]" : "bg-[#ecfdf5] text-[#15803d]"}`}
                              >
                                {apiKey.revokedAt ? "Revoked" : "Active"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              {!apiKey.revokedAt ? (
                                <button
                                  className="text-sm font-semibold text-[#be123c]"
                                  type="button"
                                  onClick={() => void revokeKey(apiKey)}
                                >
                                  Revoke
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!apiKeys.length ? (
                      <div className="p-10 text-center text-sm text-[#71817d]">
                        No API keys yet.
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {activeView === "webhooks" ? (
                <section className={panelClass}>
                  <div className="flex items-center justify-between gap-4 border-b border-[#dce3ea] px-5 py-5">
                    <div>
                      <h2 className="text-xl font-semibold text-[#14231f]">
                        Webhooks
                      </h2>
                      <p className="mt-1 text-xs text-[#71817d]">
                        Signed call lifecycle events
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden rounded-full bg-[#edf7f4] px-2.5 py-1 text-xs font-bold text-[#0e6f62] sm:inline-flex">
                        {enabledWebhooks} listening
                      </span>
                      <button className={primaryButtonClass} type="button" onClick={() => setWebhookComposerOpen((current) => !current)}>
                        <span aria-hidden="true">+</span> {webhookComposerOpen ? "Close" : "Add endpoint"}
                      </button>
                    </div>
                  </div>
                  {createdSecret ? (
                    <div className="border-b border-[#86c9a4] bg-[#effbf3] px-5 py-4">
                      <strong className="block text-sm text-[#166534]">
                        Signing secret created. Copy it now.
                      </strong>
                      <div className="mt-2 flex gap-2">
                        <code className="min-w-0 flex-1 truncate bg-white px-3 py-2 text-xs">
                          {createdSecret}
                        </code>
                        <button
                          className="rounded-md bg-[#15803d] px-3 text-sm font-semibold text-white"
                          type="button"
                          onClick={() =>
                            void copyText(createdSecret, "Webhook secret")
                          }
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {webhookComposerOpen ? (
                  <div className="border-b border-[#dce3ea] bg-[#f8fafc] p-5">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-[#20342e]">Add a webhook endpoint</h3>
                        <p className="mt-1 text-xs text-[#71817d]">Choose where Vozon should send signed lifecycle events.</p>
                      </div>
                      <button className="text-xl leading-none text-[#84938f] hover:text-[#20342e]" type="button" aria-label="Close webhook form" onClick={() => setWebhookComposerOpen(false)}>×</button>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-[210px_minmax(0,1fr)]">
                      <FieldLabel label="Endpoint name">
                        <input
                          className={controlClass}
                          value={webhookName}
                          onChange={(event) =>
                            setWebhookName(event.target.value)
                          }
                          placeholder="Call events"
                        />
                      </FieldLabel>
                      <FieldLabel label="Destination URL">
                        <input
                          className={controlClass}
                          value={webhookUrl}
                          onChange={(event) =>
                            setWebhookUrl(event.target.value)
                          }
                          placeholder="https://your-platform.com/webhooks/calls"
                        />
                      </FieldLabel>
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {eventCatalog.map((event) => (
                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${webhookEvents.includes(event) ? "border-[#c4c8ec] bg-[#edf7f4] text-[#123d35]" : "border-[#dfe1ed] bg-white text-[#5f6374] hover:bg-[#f7f9f8]"}`}
                          key={event}
                        >
                          <input
                            checked={webhookEvents.includes(event)}
                            onChange={() =>
                              setWebhookEvents((current) =>
                                toggleValue(current, event),
                              )
                            }
                            className="accent-[#118778]"
                            type="checkbox"
                          />
                          {eventLabels[event] ?? event}
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <code className="text-[11px] text-[#71817d]">
                        X-AI-Voice-Signature
                      </code>
                      <button
                        className={primaryButtonClass}
                        disabled={
                          !webhookName.trim() ||
                          !webhookUrl.trim() ||
                          !webhookEvents.length
                        }
                        type="button"
                        onClick={() => void createWebhook()}
                      >
                        Create webhook
                      </button>
                    </div>
                  </div>
                  ) : null}
                  <div className="divide-y divide-[#e8edf2]">
                    {webhooks.map((webhook) => (
                      <article
                        className="p-4 hover:bg-[#fafbfc]"
                        key={webhook._id}
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <DeliveryDot
                                status={
                                  webhook.enabled ? "delivered" : "pending"
                                }
                              />
                              <strong className="text-sm text-[#20342e]">
                                {webhook.name}
                              </strong>
                              <span className="text-xs text-[#71817d]">
                                {webhook.enabled ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                            <p className="mt-1 truncate font-mono text-xs text-[#52645f]">
                              {webhook.url}
                            </p>
                            <p className="mt-1 text-xs text-[#84938f]">
                              {webhook.events.join(" / ")}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              className={secondaryButtonClass}
                              type="button"
                              onClick={() => void testWebhook(webhook)}
                            >
                              Send test
                            </button>
                            <button
                              className={secondaryButtonClass}
                              type="button"
                              onClick={() => void toggleWebhook(webhook)}
                            >
                              {webhook.enabled ? "Disable" : "Enable"}
                            </button>
                            <button
                              className={dangerButtonClass}
                              type="button"
                              onClick={() => void deleteWebhook(webhook)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                    {!webhooks.length ? (
                      <div className="p-10 text-center text-sm text-[#71817d]">
                        No webhook endpoints yet.
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {activeView === "activity" ? (
                <section className={panelClass}>
                  <div className="flex items-center justify-between gap-4 border-b border-[#dce3ea] px-5 py-5">
                    <div>
                      <h2 className="text-xl font-semibold text-[#14231f]">
                        Event activity
                      </h2>
                      <p className="mt-1 text-xs text-[#71817d]">
                        Recent webhook delivery attempts
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#64748b]">
                      {deliveredCount} delivered
                    </span>
                  </div>
                  <div className="divide-y divide-[#e8edf2]">
                    {deliveries.map((delivery) => (
                      <div
                        className="grid gap-3 px-5 py-4 hover:bg-[#fafbfc] sm:grid-cols-[minmax(0,1fr)_130px_100px] sm:items-center"
                        key={delivery._id}
                      >
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <DeliveryDot status={delivery.status} />
                            <strong className="truncate text-sm font-semibold text-[#20342e]">
                              {deliveryEventLabel(delivery.event)}
                            </strong>
                            <code className="hidden shrink-0 rounded-md bg-[#f1f5f3] px-1.5 py-0.5 text-[10px] font-semibold text-[#52645f] md:inline">
                              {delivery.event || "unknown"}
                            </code>
                          </div>
                          <p
                            className={`mt-1 line-clamp-2 pl-4 text-xs ${delivery.errorMessage ? "text-[#b4233b]" : "text-[#71817d]"}`}
                          >
                            {deliverySummary(delivery)}
                          </p>
                        </div>
                        <span className="text-xs text-[#64748b]">
                          {formatDate(delivery.createdAt)}
                        </span>
                        <div className="sm:text-right">
                          <span
                            className={`rounded px-2 py-1 text-[11px] font-semibold ring-1 ${deliveryTone(delivery.status)}`}
                          >
                            {delivery.responseStatus || delivery.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {!deliveries.length ? (
                      <div className="p-12 text-center text-sm text-[#71817d]">
                        No delivery activity yet.
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}
            </div>

            {inspectorOpen ? (
              <>
                <button
                  className="fixed inset-0 z-[80] bg-[#0c1714]/35 backdrop-blur-[2px]"
                  type="button"
                  aria-label="Close API inspector"
                  onClick={() => setInspectorOpen(false)}
                />
            <aside
              className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-[620px] flex-col overflow-hidden bg-[#101a25] text-white shadow-[-24px_0_80px_rgba(9,20,17,0.25)]"
              role="dialog"
              aria-modal="true"
              aria-label="API request inspector"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#aeb4ff]">
                    API inspector
                  </span>
                  <strong className="mt-0.5 block text-sm text-white">
                    {inspectorLabel}
                  </strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
                    type="button"
                    onClick={() => void copyText(inspectorContent, inspectorLabel)}
                  >
                    Copy
                  </button>
                  <button
                    className="grid size-8 place-items-center rounded-lg text-lg text-[#aeb6c7] transition hover:bg-white/10 hover:text-white"
                    type="button"
                    aria-label="Close inspector"
                    onClick={() => setInspectorOpen(false)}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 border-b border-white/10 bg-[#0b1220] p-1.5">
                {(["request", "response", "webhook"] as const).map((view) => (
                  <button
                    className={`h-8 rounded-lg text-xs font-semibold capitalize transition ${inspectorView === view ? "bg-[#118778] text-white" : "text-[#aeb6c7] hover:text-white"}`}
                    key={view}
                    type="button"
                    onClick={() => setInspectorView(view)}
                  >
                    {view}
                  </button>
                ))}
              </div>
              <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words p-5 text-xs leading-6 text-[#d7e2ef] sm:p-6">
                {inspectorContent}
              </pre>
              <div className="border-t border-white/10 bg-[#0b1220] p-4">
                <span className="text-[10px] font-black uppercase text-[#8fa0b4]">
                  Outbound call
                </span>
                <pre className="mt-2 max-h-44 overflow-auto whitespace-pre-wrap text-[11px] leading-5 text-[#b7c6d8]">
                  {sampleOutboundCurl(baseUrl)}
                </pre>
                <button
                  className="mt-3 text-xs font-bold text-[#aeb4ff] hover:text-white"
                  type="button"
                  onClick={() =>
                    void copyText(
                      sampleOutboundCurl(baseUrl),
                      "Outbound call example",
                    )
                  }
                >
                  Copy outbound request
                </button>
              </div>
            </aside>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {notice ? (
        <div
          className="fixed bottom-4 right-4 z-50 grid w-[min(380px,calc(100vw-32px))] grid-cols-[4px_minmax(0,1fr)_28px] overflow-hidden border border-[#cfd8e3] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.2)]"
          role="status"
          aria-live="polite"
        >
          <span className="bg-[#118778]" aria-hidden="true" />
          <span className="px-4 py-3 text-sm font-semibold text-[#334155]">
            {notice}
          </span>
          <button
            className="mr-2 mt-2 grid size-7 place-items-center rounded text-[#84938f] hover:bg-[#f1f5f9]"
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            x
          </button>
        </div>
      ) : null}
    </main>
  );
}
