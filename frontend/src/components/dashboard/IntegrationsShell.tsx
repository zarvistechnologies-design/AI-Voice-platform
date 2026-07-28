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
    color: "from-cyan-500 to-cyan-400",
  },
  hubspot: {
    name: "HubSpot",
    category: "CRM",
    description: "Create callers as contacts and log completed calls as CRM notes.",
    color: "from-cyan-500 to-cyan-400",
  },
  calendly: {
    name: "Calendly",
    category: "Scheduling",
    description: "Let agents discover event types and create one-time booking links during calls.",
    color: "from-cyan-500 to-cyan-400",
  },
  slack: {
    name: "Slack",
    category: "Notifications",
    description: "Send automatic call completion notifications to a Slack channel.",
    color: "from-cyan-500 to-cyan-400",
  },
  google: {
    name: "Google Workspace",
    category: "Calendar & data",
    description: "Connect Google Calendar and Sheets, then assign selected resources to individual voice agents.",
    color: "from-cyan-500 to-cyan-400",
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
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [manageGoogle, setManageGoogle] = useState(false);
  const [calendars, setCalendars] = useState<Array<{ id: string; name: string; primary: boolean; timezone: string }>>([]);
  const [spreadsheetInput, setSpreadsheetInput] = useState("");
  const [spreadsheet, setSpreadsheet] = useState<{ id: string; name: string; sheets: string[] } | null>(null);

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
    if (!selected || selected === "google") return;
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
      if (provider === "google") await integrationsApi.disconnectGoogle();
      else await integrationsApi.disconnect(provider);
      await load();
      setNotice(`${catalog[provider].name} disconnected.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not disconnect integration.");
    } finally {
      setBusy(false);
    }
  }

  async function connectGoogle() {
    setBusy(true);
    try {
      const { url } = await integrationsApi.googleOAuthUrl();
      window.location.assign(url);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not start Google authorization.");
      setBusy(false);
    }
  }

  async function openGoogleManager() {
    setBusy(true);
    try {
      setCalendars((await integrationsApi.googleCalendars()).calendars);
      setManageGoogle(true);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load Google resources.");
    } finally {
      setBusy(false);
    }
  }

  async function inspectSpreadsheet() {
    setBusy(true);
    try {
      setSpreadsheet((await integrationsApi.inspectSpreadsheet(spreadsheetInput)).spreadsheet);
      setNotice("Spreadsheet verified. Copy its ID and tab into the agent’s Native Google tools.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not access that spreadsheet.");
    } finally {
      setBusy(false);
    }
  }

  if (!session) return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold">Loading integrations</main>;

  return (
    <main className={`grid min-h-screen bg-[#f4f7fb] text-slate-950 ${
      showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
    }`}>
      <DashboardSidebar
        activeLabel="Integrations"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => void logoutSession().then(() => router.replace("/login"))}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />
      <section className="min-w-0 p-4">
        <div className="mx-auto grid max-w-1500px gap-6">
          <header className="border-b border-[#99f6e8] bg-white pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00b8c4]">Native connections</span>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Integrations</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Connect telephony, CRM, scheduling, and notification providers. Credentials are encrypted and never displayed again.</p>
            </div>
          </header>
          {notice ? <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">{notice}</div> : null}
          <section className="grid gap-4 md:grid-cols-2">
            {providers.map((provider) => {
              const item = catalog[provider.id];
              return (
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" key={provider.id}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4"><div><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.category}</span><h2 className="mt-2 text-xl font-semibold">{item.name}</h2></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${provider.connected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{provider.connected ? "Connected" : "Available"}</span></div>
                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{item.description}</p>
                    {provider.connected ? <div className="mt-4 rounded-xl bg-slate-50 p-3"><strong className="block text-sm">{provider.accountId}</strong><span className="mt-1 block text-xs text-slate-500">Verified {provider.lastVerifiedAt ? new Date(provider.lastVerifiedAt).toLocaleString() : "recently"}</span></div> : null}
                    <div className="mt-5 flex flex-wrap gap-2">{provider.id === "vobiz" ? <Link className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white" href="/dashboard/phone-number" prefetch={false} onFocus={() => router.prefetch("/dashboard/phone-number")} onMouseEnter={() => router.prefetch("/dashboard/phone-number")} onPointerDown={() => router.prefetch("/dashboard/phone-number")}>Manage Vobiz</Link> : provider.id === "google" ? provider.connected ? <><button className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white" disabled={busy} type="button" onClick={() => void openGoogleManager()}>Manage resources</button><button className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700" disabled={busy} type="button" onClick={() => void disconnect("google")}>Disconnect</button></> : <button className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white" disabled={busy} type="button" onClick={() => void connectGoogle()}>Connect Google</button> : provider.connected ? <button className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700" disabled={busy} type="button" onClick={() => void disconnect(provider.id as Exclude<IntegrationProvider["id"], "vobiz">)}>Disconnect</button> : <button className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white" type="button" onClick={() => { setSelected(provider.id as Exclude<IntegrationProvider["id"], "vobiz">); setCredential(""); }}>Connect {item.name}</button>}</div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </section>

      {selected ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onMouseDown={() => !busy && setSelected(null)}><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><span className="text-xs font-semibold uppercase tracking-wider text-cyan-600">{catalog[selected].category}</span><h2 className="mt-2 text-xl font-semibold">Connect {catalog[selected].name}</h2></div><button className="rounded-lg px-2 py-1 text-slate-500" type="button" disabled={busy} onClick={() => setSelected(null)}>Close</button></div><p className="mt-3 text-sm leading-6 text-slate-600">{selected === "slack" ? "Create an incoming webhook in Slack and paste its URL. A verification message will be sent immediately." : selected === "hubspot" ? "Create a HubSpot private app with CRM contacts and notes permissions, then paste its access token." : "Create a Calendly personal access token and paste it here."}</p><label className="mt-5 grid gap-2 text-xs font-semibold text-slate-600">{selected === "slack" ? "Incoming webhook URL" : "Access token"}<input className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal text-slate-950" autoComplete="new-password" type="password" value={credential} onChange={(event) => setCredential(event.target.value)} placeholder={selected === "slack" ? "https://hooks.slack.com/services/..." : "Paste provider token"} /></label><button className="mt-5 w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50" type="button" disabled={busy || !credential.trim()} onClick={() => void connect()}>{busy ? "Verifying..." : "Connect and verify"}</button></div></div> : null}
      {manageGoogle ? <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4" onMouseDown={() => !busy && setManageGoogle(false)}><div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex justify-between gap-4"><div><span className="text-xs font-semibold uppercase tracking-wider text-cyan-600">Google Workspace</span><h2 className="mt-2 text-xl font-semibold">Available resources</h2></div><button type="button" onClick={() => setManageGoogle(false)}>Close</button></div><h3 className="mt-6 font-semibold">Calendars</h3><div className="mt-2 grid gap-2">{calendars.map((calendar) => <div className="rounded-xl border border-slate-200 p-3" key={calendar.id}><strong className="block text-sm">{calendar.name}{calendar.primary ? " (Primary)" : ""}</strong><code className="mt-1 block break-all text-xs text-slate-500">{calendar.id}</code><div className="mt-2 flex items-center justify-between"><span className="text-xs text-slate-500">{calendar.timezone}</span><button className="rounded-lg border border-cyan-200 px-3 py-1.5 text-xs font-semibold text-cyan-700" type="button" onClick={() => void integrationsApi.testCalendar(calendar.id, calendar.timezone).then(() => setNotice("Test appointment created successfully.")).catch((error) => setNotice(error instanceof Error ? error.message : "Calendar test failed."))}>Create test event</button></div></div>)}</div><h3 className="mt-6 font-semibold">Spreadsheet</h3><p className="mt-1 text-sm text-slate-600">Paste a spreadsheet URL or ID. The Google account must have edit access.</p><div className="mt-3 flex gap-2"><input className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm" value={spreadsheetInput} onChange={(event) => setSpreadsheetInput(event.target.value)} placeholder="https://docs.google.com/spreadsheets/d/..." /><button className="rounded-xl bg-cyan-500 px-4 text-sm font-semibold text-white" disabled={busy || !spreadsheetInput.trim()} type="button" onClick={() => void inspectSpreadsheet()}>Verify</button></div>{spreadsheet ? <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3"><strong className="block">{spreadsheet.name}</strong><code className="mt-1 block break-all text-xs">{spreadsheet.id}</code><div className="mt-2 flex flex-wrap gap-2">{spreadsheet.sheets.map((sheet) => <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold" key={sheet} type="button" onClick={() => void integrationsApi.testSheet(spreadsheet.id, sheet).then(() => setNotice(`Test row added to ${sheet}.`)).catch((error) => setNotice(error instanceof Error ? error.message : "Sheet test failed."))}>{sheet} · test row</button>)}</div></div> : null}<p className="mt-5 text-xs leading-5 text-slate-500">Next: open an agent → Tools → Native Google tools, enter the selected resource IDs, enable them, and save the agent.</p></div></div> : null}
    </main>
  );
}
