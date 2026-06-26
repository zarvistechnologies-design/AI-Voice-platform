"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { getServerSession, getSession, logoutSession, subscribeToSession, validateStoredSession } from "@/lib/auth";
import { integrationsApi, type IntegrationProvider } from "@/lib/integrations";

const catalog = {
  vobiz: {
    name: "Vobiz",
    category: "Telephony",
    description: "Buy, import, and route phone numbers to your voice agents.",
    color: "from-blue-600 to-cyan-500",
  },
  hubspot: {
    name: "HubSpot",
    category: "CRM",
    description: "Create callers as contacts and log completed calls as CRM notes.",
    color: "from-orange-500 to-amber-400",
  },
  calendly: {
    name: "Calendly",
    category: "Scheduling",
    description: "Let agents discover event types and create one-time booking links during calls.",
    color: "from-blue-700 to-indigo-500",
  },
  slack: {
    name: "Slack",
    category: "Notifications",
    description: "Send automatic call completion notifications to a Slack channel.",
    color: "from-violet-600 to-fuchsia-500",
  },
} as const;

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export function IntegrationsShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [providers, setProviders] = useState<IntegrationProvider[]>([]);
  const [selected, setSelected] = useState<Exclude<IntegrationProvider["id"], "vobiz"> | null>(null);
  const [credential, setCredential] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setProviders((await integrationsApi.list()).providers);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load integrations.");
    }
  }, []);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/integrations");
      return;
    }
    void validateStoredSession();
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load, router, session]);

  async function connect() {
    if (!selected) return;
    setBusy(true);
    try {
      await integrationsApi.connect(selected, credential);
      setCredential("");
      setSelected(null);
      await load();
      setNotice(`${catalog[selected].name} connected and verified.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not connect integration.");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect(provider: Exclude<IntegrationProvider["id"], "vobiz">) {
    if (!window.confirm(`Disconnect ${catalog[provider].name}?`)) return;
    setBusy(true);
    try {
      await integrationsApi.disconnect(provider);
      await load();
      setNotice(`${catalog[provider].name} disconnected.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not disconnect integration.");
    } finally {
      setBusy(false);
    }
  }

  if (!session) return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold">Loading integrations</main>;

  return (
    <main className="grid min-h-screen bg-[#f4f7fb] text-slate-950 lg:grid-cols-[64px_minmax(0,1fr)]">
      <DashboardSidebar activeLabel="Integrations" userInitials={initials(session.name)} onLogout={() => void logoutSession().then(() => router.replace("/login"))} />
      <section className="min-w-0 p-4">
        <div className="mx-auto grid max-w-[1500px] gap-6">
          <header className="overflow-hidden rounded-2xl border border-[#0f172a] bg-[#111827] text-white shadow-[0_14px_36px_rgba(15,23,42,0.12)]">
            <div className="grid h-1 grid-cols-5" aria-hidden="true">
              <span className="bg-indigo-400" />
              <span className="bg-violet-400" />
              <span className="bg-sky-400" />
              <span className="bg-emerald-400" />
              <span className="bg-amber-400" />
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Native connections</span>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Integrations</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Connect telephony, CRM, scheduling, and notification providers. Credentials are encrypted and never displayed again.</p>
            </div>
          </header>
          {notice ? <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}</div> : null}
          <section className="grid gap-4 md:grid-cols-2">
            {providers.map((provider) => {
              const item = catalog[provider.id];
              return (
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" key={provider.id}>
                  <div className={`h-2 bg-gradient-to-r ${item.color}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4"><div><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.category}</span><h2 className="mt-2 text-xl font-semibold">{item.name}</h2></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${provider.connected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{provider.connected ? "Connected" : "Available"}</span></div>
                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{item.description}</p>
                    {provider.connected ? <div className="mt-4 rounded-xl bg-slate-50 p-3"><strong className="block text-sm">{provider.accountId}</strong><span className="mt-1 block text-xs text-slate-500">Verified {provider.lastVerifiedAt ? new Date(provider.lastVerifiedAt).toLocaleString() : "recently"}</span></div> : null}
                    <div className="mt-5 flex gap-2">{provider.id === "vobiz" ? <Link className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" href="/dashboard/phone-number">Manage Vobiz</Link> : provider.connected ? <button className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700" disabled={busy} type="button" onClick={() => void disconnect(provider.id as Exclude<IntegrationProvider["id"], "vobiz">)}>Disconnect</button> : <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" type="button" onClick={() => { setSelected(provider.id as Exclude<IntegrationProvider["id"], "vobiz">); setCredential(""); }}>Connect {item.name}</button>}</div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </section>

      {selected ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onMouseDown={() => !busy && setSelected(null)}><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><span className="text-xs font-semibold uppercase tracking-wider text-blue-600">{catalog[selected].category}</span><h2 className="mt-2 text-xl font-semibold">Connect {catalog[selected].name}</h2></div><button className="rounded-lg px-2 py-1 text-slate-500" type="button" disabled={busy} onClick={() => setSelected(null)}>Close</button></div><p className="mt-3 text-sm leading-6 text-slate-600">{selected === "slack" ? "Create an incoming webhook in Slack and paste its URL. A verification message will be sent immediately." : selected === "hubspot" ? "Create a HubSpot private app with CRM contacts and notes permissions, then paste its access token." : "Create a Calendly personal access token and paste it here."}</p><label className="mt-5 grid gap-2 text-xs font-semibold text-slate-600">{selected === "slack" ? "Incoming webhook URL" : "Access token"}<input className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal text-slate-950" autoComplete="new-password" type="password" value={credential} onChange={(event) => setCredential(event.target.value)} placeholder={selected === "slack" ? "https://hooks.slack.com/services/..." : "Paste provider token"} /></label><button className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50" type="button" disabled={busy || !credential.trim()} onClick={() => void connect()}>{busy ? "Verifying..." : "Connect and verify"}</button></div></div> : null}
    </main>
  );
}
