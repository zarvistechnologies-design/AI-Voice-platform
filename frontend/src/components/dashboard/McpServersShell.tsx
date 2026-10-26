"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardSidebar, getDashboardSidebarInitialState } from "@/components/dashboard/DashboardSidebar";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { getServerSession, getSession, logoutSession, subscribeToSession, validateStoredSession } from "@/lib/auth";
import { integrationsApi, type AgentSummary, type RemoteMcpConnection } from "@/lib/integrations";

const providerNames = [
  "Atlassian", "Razorpay API", "Zapier", "Zoho CRM", "Asana", "ClickUp", "Freshsales",
  "Google Calendar", "Google Docs", "Google Drive", "Google Sheets", "Gmail", "Linear",
  "monday.com", "Notion", "Prospeo", "Razorpay OAuth", "Salesforce", "Slack", "Jira",
];
const nativeProviders = new Set(["Google Calendar", "Google Sheets", "Slack"]);

export function McpServersShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [expanded, setExpanded] = useState(getDashboardSidebarInitialState);
  const [connections, setConnections] = useState<RemoteMcpConnection[]>([]);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("custom");
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Record<string, string>>({});
  const [selectedTools, setSelectedTools] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const [servers, agentList] = await Promise.all([integrationsApi.mcpServers(), integrationsApi.agentSummaries()]);
    setConnections(servers.connections);
    setAgents(agentList.agents);
  }, []);

  useEffect(() => {
    if (!session) { router.replace("/login?next=/dashboard/mcp-servers"); return; }
    void validateStoredSession();
    const timer = window.setTimeout(() => void load().catch((error) => setNotice(error instanceof Error ? error.message : "Could not load MCP servers.")), 0);
    return () => window.clearTimeout(timer);
  }, [session, router, load]);

  async function act(task: () => Promise<unknown>, success: string) {
    setBusy(true);
    setNotice("");
    try { await task(); await load(); setNotice(success); }
    catch (error) { setNotice(error instanceof Error ? error.message : "MCP request failed."); }
    finally { setBusy(false); }
  }

  async function connect(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await act(async () => {
      await integrationsApi.addMcpServer({ name, provider, url, token });
      setName(""); setProvider("custom"); setUrl(""); setToken("");
    }, "MCP server verified. Choose its tools and an agent below.");
  }

  function toggleTool(id: string, toolName: string) {
    setSelectedTools((current) => {
      const existing = current[id] ?? [];
      return { ...current, [id]: existing.includes(toolName) ? existing.filter((item) => item !== toolName) : [...existing, toolName] };
    });
  }

  if (!session) return <main className="grid min-h-screen place-items-center">Loading MCP servers</main>;

  return <main className={`dashboard-home-theme grid min-h-screen bg-[#f6f9f8] text-slate-950 ${expanded ? "lg:grid-cols-[248px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"}`}>
    <DashboardSidebar activeLabel="MCP Servers" userInitials={session.name.slice(0, 2).toUpperCase()} userName={session.name} userEmail={session.email} onLogout={() => void logoutSession().then(() => router.replace("/login"))} showUserSidebar={expanded} setShowUserSidebar={setExpanded} />
    <section className="min-w-0">
      <DashboardPageHeader eyebrow="Tools & integrations" title="MCP Servers" description="Connect a remote MCP server, inspect its tools, and attach selected tools to a voice agent." />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6">
        {notice && <div role="status" className="rounded-2xl border border-teal-200 bg-teal-50 px-5 py-3 text-sm text-teal-950">{notice}</div>}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-3xl border border-[#dce9e5] bg-white p-6 shadow-[0_18px_50px_rgba(8,67,56,.06)]">
            <div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">Your workspace</p><h2 className="mt-1 text-xl font-semibold">Connected servers</h2></div><span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-900">{connections.length}</span></div>
            {!connections.length && <p className="rounded-2xl border border-dashed border-[#cbded8] bg-[#f9fbfa] px-5 py-8 text-center text-sm text-slate-600">No remote MCP servers connected yet. Add one with its provider URL and credential.</p>}
            <div className="grid gap-4">{connections.map((connection) => <article key={connection.id} className="rounded-2xl border border-[#dce9e5] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-teal-700">{connection.provider}</p><h3 className="mt-1 text-lg font-semibold">{connection.name}</h3><p className="max-w-xl break-all text-xs text-slate-500">{connection.url}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${connection.status === "connected" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>{connection.status}</span></div>
              {connection.lastError && <p className="mt-3 text-sm text-rose-700">{connection.lastError}</p>}
              {!!connection.attachedAgents?.length && <p className="mt-3 text-xs text-slate-600">Attached to: {connection.attachedAgents.map((agent) => agent.name).join(", ")}</p>}
              <div className="mt-4 flex flex-wrap gap-2"><button disabled={busy} onClick={() => void act(() => integrationsApi.verifyMcpServer(connection.id), "Server verified and tools refreshed.")} className="rounded-xl border border-teal-200 px-3 py-2 text-xs font-semibold text-teal-800 hover:bg-teal-50 disabled:opacity-50">Verify connection</button><button disabled={busy} onClick={() => { if (window.confirm(`Remove ${connection.name} and its agent tools?`)) void act(() => integrationsApi.deleteMcpServer(connection.id), "MCP server removed."); }} className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50">Remove</button></div>
              <div className="mt-5 border-t border-[#e8efec] pt-4"><p className="mb-2 text-sm font-semibold">Available tools ({connection.tools.length})</p>{!connection.tools.length && <p className="text-xs text-slate-500">This server returned no callable tools.</p>}
                <div className="grid max-h-60 gap-2 overflow-y-auto">{connection.tools.map((tool) => <label key={tool.name} className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#f7faf9] p-3 text-sm"><input type="checkbox" checked={(selectedTools[connection.id] ?? []).includes(tool.name)} onChange={() => toggleTool(connection.id, tool.name)} className="mt-1 accent-teal-700" /><span><strong className="block break-all">{tool.name}</strong><span className="text-xs text-slate-600">{tool.description || "No description supplied by this server."}</span></span></label>)}</div>
                <div className="mt-4 flex flex-wrap gap-2"><select aria-label={`Agent for ${connection.name}`} value={selectedAgent[connection.id] ?? ""} onChange={(event) => setSelectedAgent((current) => ({ ...current, [connection.id]: event.target.value }))} className="min-w-48 flex-1 rounded-xl border border-[#cfdfd9] bg-white px-3 py-2 text-sm"><option value="">Choose an agent</option>{agents.map((agent) => <option key={agent._id} value={agent._id}>{agent.name}</option>)}</select><button disabled={busy || !selectedAgent[connection.id] || !(selectedTools[connection.id]?.length)} onClick={() => void act(() => integrationsApi.attachMcpTools(connection.id, selectedAgent[connection.id], selectedTools[connection.id]), "Selected MCP tools attached to the agent.")} className="rounded-xl bg-[#087e70] px-4 py-2 text-sm font-semibold text-white hover:bg-[#066b60] disabled:opacity-50">Attach tools</button>{connection.attachedAgents?.some((agent) => agent.id === selectedAgent[connection.id]) && <button disabled={busy} onClick={() => void act(() => integrationsApi.attachMcpTools(connection.id, selectedAgent[connection.id], []), "MCP tools removed from this agent.")} className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 disabled:opacity-50">Detach all</button>}</div>
              </div>
            </article>)}</div>
          </section>
          <form onSubmit={(event) => void connect(event)} className="h-fit rounded-3xl border border-[#dce9e5] bg-white p-6 shadow-[0_18px_50px_rgba(8,67,56,.06)]"><p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">New connection</p><h2 className="mt-1 text-xl font-semibold">Add MCP server</h2><p className="mt-2 text-sm leading-6 text-slate-600">Enter the HTTPS endpoint supplied by the provider. Vozon checks the server and lists its tools before saving the connection.</p>
            <label className="mt-5 block text-sm font-semibold">Provider<select value={provider} onChange={(event) => setProvider(event.target.value)} className="mt-2 w-full rounded-xl border border-[#cfdfd9] px-3 py-2.5 font-normal"><option value="custom">Other MCP server</option>{providerNames.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label className="mt-4 block text-sm font-semibold">Connection name<input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="My Notion workspace" className="mt-2 w-full rounded-xl border border-[#cfdfd9] px-3 py-2.5 font-normal" /></label>
            <label className="mt-4 block text-sm font-semibold">MCP server URL<input required type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://provider.example/mcp" className="mt-2 w-full rounded-xl border border-[#cfdfd9] px-3 py-2.5 font-normal" /></label>
            <label className="mt-4 block text-sm font-semibold">Bearer token <span className="font-normal text-slate-500">(if required)</span><input type="password" autoComplete="off" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Provider token" className="mt-2 w-full rounded-xl border border-[#cfdfd9] px-3 py-2.5 font-normal" /></label>
            <button disabled={busy} className="mt-5 w-full rounded-xl bg-[#087e70] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(8,126,112,.18)] hover:bg-[#066b60] disabled:opacity-50">{busy ? "Checking server…" : "Verify & connect"}</button>
            <p className="mt-4 text-xs leading-5 text-slate-500">The full server URL and token are encrypted. The panel shows only the server origin after connection. This form supports public HTTPS MCP servers with optional bearer tokens. OAuth and provider-specific API setups need separate authorization.</p>
            <Link href="/dashboard/integrations" className="mt-4 inline-block text-sm font-semibold text-teal-800 underline">View native integrations</Link>
          </form>
        </div>
        <section className="rounded-3xl border border-[#dce9e5] bg-white p-6"><h2 className="text-lg font-semibold">Providers from your list</h2><p className="mt-1 text-sm text-slate-600">Google Calendar handles appointments, Google Sheets exports call data, and Slack sends notifications through the existing Integrations page. These are limited actions. Other capabilities need a working MCP endpoint or a dedicated OAuth/API integration.</p><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{providerNames.map((item) => { const remoteConnected = connections.some((connection) => connection.provider === item && connection.status === "connected"); return <div key={item} className="flex items-center justify-between gap-2 rounded-xl border border-[#e4ece9] px-3 py-2 text-sm"><span>{item}</span><span className={`shrink-0 text-[11px] font-semibold ${remoteConnected || nativeProviders.has(item) ? "text-teal-800" : "text-slate-500"}`}>{remoteConnected ? "MCP connected" : nativeProviders.has(item) ? "Limited native" : "Setup needed"}</span></div>; })}</div></section>
      </div>
    </section>
  </main>;
}
