"use client";

import { FormEvent, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { getServerSession, getSession, logoutSession, subscribeToSession, validateStoredSession } from "@/lib/auth";
import {
  developerApi,
  type ApiKeyRecord,
  type ApiKeyScope,
  type WebhookDelivery,
  type WebhookEndpoint,
  type WebhookEvent,
} from "@/lib/developer";

const webhookEvents: WebhookEvent[] = ["call.started", "call.ended", "call.failed", "transcript.ready"];
const apiScopes: ApiKeyScope[] = ["read", "agents:write", "calls:trigger", "full-access"];

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function statusTone(status: WebhookDelivery["status"]) {
  if (status === "delivered") return "bg-emerald-50 text-emerald-700";
  if (status === "failed") return "bg-rose-50 text-rose-700";
  if (status === "retrying") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

export function DeveloperShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [tab, setTab] = useState<"webhooks" | "keys">("webhooks");
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [webhookName, setWebhookName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [events, setEvents] = useState<WebhookEvent[]>(["call.ended", "call.failed"]);
  const [keyName, setKeyName] = useState("");
  const [scopes, setScopes] = useState<ApiKeyScope[]>(["read"]);
  const [revealed, setRevealed] = useState<{ label: string; value: string } | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [webhookResult, keyResult] = await Promise.all([developerApi.webhooks(), developerApi.apiKeys()]);
      setWebhooks(webhookResult.webhooks);
      setDeliveries(webhookResult.deliveries);
      setApiKeys(keyResult.apiKeys);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load developer tools.");
    }
  }, []);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/developer");
      return;
    }
    void validateStoredSession();
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load, router, session]);

  function toggleEvent(event: WebhookEvent) {
    setEvents((current) => current.includes(event) ? current.filter((item) => item !== event) : [...current, event]);
  }

  function toggleScope(scope: ApiKeyScope) {
    setScopes((current) => current.includes(scope) ? current.filter((item) => item !== scope) : [...current, scope]);
  }

  async function createWebhook(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await developerApi.createWebhook({ name: webhookName, url: webhookUrl, events });
      setRevealed({ label: "Webhook signing secret", value: result.secret });
      setWebhookName("");
      setWebhookUrl("");
      await load();
      setNotice("Webhook created. Store the signing secret now; it will not be displayed again.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create webhook.");
    } finally {
      setBusy(false);
    }
  }

  async function createKey(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await developerApi.createApiKey({ name: keyName, scopes });
      setRevealed({ label: "API key", value: result.key });
      setKeyName("");
      await load();
      setNotice("API key created. Store it securely; only its prefix will remain visible.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create API key.");
    } finally {
      setBusy(false);
    }
  }

  async function action(task: () => Promise<unknown>, success: string) {
    setBusy(true);
    try {
      await task();
      await load();
      setNotice(success);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  }

  async function copyRevealed() {
    if (!revealed) return;
    await navigator.clipboard.writeText(revealed.value);
    setNotice(`${revealed.label} copied.`);
  }

  if (!session) return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold">Loading developer tools</main>;

  return (
    <main className="grid min-h-screen bg-[#f4f7fb] text-slate-950 lg:grid-cols-[64px_minmax(0,1fr)]">
      <DashboardSidebar activeLabel="Developer" userInitials={initials(session.name)} onLogout={() => void logoutSession().then(() => router.replace("/login"))} />
      <section className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto grid max-w-7xl gap-6">
          <header><span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Connect your stack</span><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Developer tools</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Signed event delivery and scoped external API access, with credentials shown only once.</p></header>
          {notice ? <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}</div> : null}
          {revealed ? <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><strong className="text-sm text-amber-950">{revealed.label} - shown once</strong><code className="mt-2 block break-all rounded-lg bg-white p-3 text-xs text-slate-800">{revealed.value}</code></div><button className="rounded-xl bg-amber-950 px-4 py-2.5 text-sm font-semibold text-white" type="button" onClick={() => void copyRevealed()}>Copy secret</button></div></div> : null}

          <div className="flex w-fit rounded-xl border border-slate-200 bg-white p-1 shadow-sm">{(["webhooks", "keys"] as const).map((item) => <button className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${tab === item ? "bg-slate-950 text-white" : "text-slate-600"}`} type="button" key={item} onClick={() => setTab(item)}>{item === "keys" ? "API keys" : "Webhooks"}</button>)}</div>

          {tab === "webhooks" ? <>
            <section className="grid gap-4 xl:grid-cols-[minmax(300px,0.75fr)_minmax(0,1.25fr)]">
              <form className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={createWebhook}><div><h2 className="m-0 text-sm font-semibold">Add endpoint</h2><p className="mt-1 text-xs text-slate-500">Requests are signed with HMAC-SHA256.</p></div><label className="grid gap-1.5 text-xs font-semibold text-slate-600">Name<input className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-950" required value={webhookName} onChange={(event) => setWebhookName(event.target.value)} placeholder="Production event receiver" /></label><label className="grid gap-1.5 text-xs font-semibold text-slate-600">Endpoint URL<input className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-950" required type="url" value={webhookUrl} onChange={(event) => setWebhookUrl(event.target.value)} placeholder="https://example.com/webhooks/voice" /></label><div className="grid gap-2"><span className="text-xs font-semibold text-slate-600">Subscribed events</span>{webhookEvents.map((item) => <label className="flex items-center gap-2 text-sm text-slate-700" key={item}><input type="checkbox" checked={events.includes(item)} onChange={() => toggleEvent(item)} />{item}</label>)}</div><button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50" disabled={busy || !events.length} type="submit">Create webhook</button></form>
              <div className="grid content-start gap-3">{webhooks.length ? webhooks.map((webhook) => <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={webhook._id}><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2"><strong>{webhook.name}</strong><span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${webhook.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{webhook.enabled ? "Enabled" : "Paused"}</span></div><span className="mt-2 block break-all text-xs text-slate-500">{webhook.url}</span><div className="mt-3 flex flex-wrap gap-1.5">{webhook.events.map((item) => <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700" key={item}>{item}</span>)}</div></div><div className="flex gap-2"><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold" disabled={busy} type="button" onClick={() => void action(() => developerApi.testWebhook(webhook._id), "Test webhook delivered.")}>Test</button><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold" disabled={busy} type="button" onClick={() => void action(() => developerApi.updateWebhook(webhook._id, { enabled: !webhook.enabled }), webhook.enabled ? "Webhook paused." : "Webhook enabled.")}>{webhook.enabled ? "Pause" : "Enable"}</button><button className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700" disabled={busy} type="button" onClick={() => window.confirm("Delete this webhook and all delivery logs?") && void action(() => developerApi.deleteWebhook(webhook._id), "Webhook deleted.")}>Delete</button></div></div></article>) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">Create your first webhook endpoint.</div>}</div>
            </section>
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 p-5"><h2 className="m-0 text-sm font-semibold">Recent deliveries</h2><p className="mt-1 text-xs text-slate-500">Failed attempts retry after 1m, 5m, 30m, 2h, and 12h.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr>{["Event", "Status", "HTTP", "Attempts", "Duration", "Created"].map((item) => <th className="px-5 py-3" key={item}>{item}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{deliveries.length ? deliveries.map((delivery) => <tr key={delivery._id}><td className="px-5 py-4 text-sm font-medium">{delivery.event}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusTone(delivery.status)}`}>{delivery.status}</span></td><td className="px-5 py-4 text-sm">{delivery.responseStatus || "-"}</td><td className="px-5 py-4 text-sm">{delivery.attempts}</td><td className="px-5 py-4 text-sm">{delivery.durationMs} ms</td><td className="px-5 py-4 text-sm text-slate-500">{new Date(delivery.createdAt).toLocaleString()}</td></tr>) : <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">No deliveries yet.</td></tr>}</tbody></table></div></article>
          </> : <>
            <section className="grid gap-4 xl:grid-cols-[minmax(300px,0.75fr)_minmax(0,1.25fr)]">
              <form className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={createKey}><div><h2 className="m-0 text-sm font-semibold">Create API key</h2><p className="mt-1 text-xs text-slate-500">Use as <code>X-API-Key</code> or a Bearer token.</p></div><label className="grid gap-1.5 text-xs font-semibold text-slate-600">Key name<input className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-950" required value={keyName} onChange={(event) => setKeyName(event.target.value)} placeholder="Production integration" /></label><div className="grid gap-2"><span className="text-xs font-semibold text-slate-600">Scopes</span>{apiScopes.map((item) => <label className="flex items-center gap-2 text-sm text-slate-700" key={item}><input type="checkbox" checked={scopes.includes(item)} onChange={() => toggleScope(item)} />{item}</label>)}</div><button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50" disabled={busy || !scopes.length} type="submit">Create API key</button></form>
              <div className="grid content-start gap-3">{apiKeys.length ? apiKeys.map((key) => <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={key._id}><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2"><strong>{key.name}</strong>{key.revokedAt ? <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-semibold uppercase text-rose-700">Revoked</span> : null}</div><code className="mt-2 block text-xs text-slate-500">{key.prefix}...</code><div className="mt-3 flex flex-wrap gap-1.5">{key.scopes.map((scope) => <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-700" key={scope}>{scope}</span>)}</div><span className="mt-3 block text-xs text-slate-500">Last used: {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : "Never"}</span></div>{!key.revokedAt ? <button className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700" disabled={busy} type="button" onClick={() => window.confirm("Revoke this API key?") && void action(() => developerApi.revokeApiKey(key._id), "API key revoked.")}>Revoke</button> : null}</div></article>) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">Create an API key for external access.</div>}</div>
            </section>
          </>}
        </div>
      </section>
    </main>
  );
}
