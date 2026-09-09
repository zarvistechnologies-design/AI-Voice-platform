"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
} from "@/lib/auth";
import { voiceApi, type AgentSummary } from "@/lib/voice";

type IconName = "agent" | "edit" | "plus" | "search" | "trash" | "grid" | "list" | "phone" | "activity" | "arrow";

const prefetchedAgentRoutes = new Set<string>();
const MAX_PREFETCHED_AGENT_ROUTES = 250;

function getInitials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function Icon({ icon }: { icon: IconName }) {
  const props = {
    className: "size-4 fill-none stroke-current stroke-[2.1]",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (icon === "grid") return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
  if (icon === "list") return <svg {...props}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
  if (icon === "phone") return <svg {...props}><path d="M8 3 5 4c-4 4 11 19 15 15l1-3-5-3-2 2a12 12 0 0 1-5-5l2-2-3-5Z"/></svg>;
  if (icon === "activity") return <svg {...props}><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>;
  if (icon === "arrow") return <svg {...props}><path d="M5 12h14m-5-5 5 5-5 5"/></svg>;
  if (icon === "edit") return <svg {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>;
  if (icon === "plus") return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
  if (icon === "search") return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  if (icon === "trash") return <svg {...props}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>;
  return (
    <svg {...props}>
      <path d="M7 10h10a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3Z" />
      <path d="M12 10V6M9 6h6M8.5 15h.01M15.5 15h.01" />
    </svg>
  );
}

export function AgentsListShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All agents");
  const [view, setView] = useState<"list" | "grid">("list");
  const dialogRef = useRef<HTMLDivElement>(null);
  const dialogTriggerRef = useRef<HTMLElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [editingAgent, setEditingAgent] = useState<AgentSummary | null>(null);
  const [editAgentName, setEditAgentName] = useState("");
  const [showUserSidebar, setShowUserSidebar] = useState(true);
  const agentDataPrefetchTimersRef = useRef(new Map<string, number>());

  function prefetchAgentRoute(agentId: string, includeData = true) {
    const href = `/dashboard/agents/${encodeURIComponent(agentId)}`;
    const prefetchKey = `${session?.id ?? ""}:${session?.signedInAt ?? ""}:${session?.organization?.id ?? ""}:${href}`;
    if (!prefetchedAgentRoutes.has(prefetchKey)) {
      if (prefetchedAgentRoutes.size >= MAX_PREFETCHED_AGENT_ROUTES) {
        prefetchedAgentRoutes.clear();
      }
      prefetchedAgentRoutes.add(prefetchKey);
      router.prefetch(href);
    }
    if (includeData) void voiceApi.agentDashboard(agentId).catch(() => undefined);
  }

  function cancelAgentDataPrefetch(agentId: string) {
    const timer = agentDataPrefetchTimersRef.current.get(agentId);
    if (timer !== undefined) window.clearTimeout(timer);
    agentDataPrefetchTimersRef.current.delete(agentId);
  }

  function scheduleAgentDataPrefetch(agentId: string) {
    prefetchAgentRoute(agentId, false);
    cancelAgentDataPrefetch(agentId);
    const timer = window.setTimeout(() => {
      agentDataPrefetchTimersRef.current.delete(agentId);
      prefetchAgentRoute(agentId);
    }, 120);
    agentDataPrefetchTimersRef.current.set(agentId, timer);
  }

  useEffect(() => () => {
    for (const timer of agentDataPrefetchTimersRef.current.values()) window.clearTimeout(timer);
    agentDataPrefetchTimersRef.current.clear();
  }, []);

  useEffect(() => {
    if (!session) {
      // The server snapshot is empty until the persisted session hydrates.
      if (getSession()) return;
      router.replace("/login?next=/dashboard/agents");
      return;
    }

    void voiceApi.agentSummaries()
      .then((result) => setAgents(result.agents))
      .catch((error: unknown) => setNotice(error instanceof Error ? error.message : "Could not load agents."))
      .finally(() => setLoading(false));
  }, [router, session]);

  const filteredAgents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return agents.filter((agent) =>
      (statusFilter === "All agents" || agent.status === statusFilter) &&
      (!normalizedQuery || [agent.name, agent.team, agent.status, agent.phone].some((value) =>
        String(value ?? "").toLowerCase().includes(normalizedQuery),
      )),
    );
  }, [agents, query, statusFilter]);

  useEffect(() => {
    if (!showCreateForm && !editingAgent) return;
    const restoreTarget = dialogTriggerRef.current;
    const dialogElement = dialogRef.current;
    function handleDialogKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) {
        setShowCreateForm(false);
        setEditingAgent(null);
        setAgentName("");
      }
      if (event.key !== "Tab") return;
      const controls = dialogElement?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", handleDialogKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleDialogKey); document.body.style.overflow = previousOverflow; if (!dialogElement?.isConnected) restoreTarget?.focus(); };
  }, [showCreateForm, editingAgent, busy]);

  const liveCount = agents.filter((agent) => agent.status === "Live").length;

  async function createAgent() {
    const name = agentName.trim();
    if (!name) {
      setNotice("Enter an agent name first.");
      return;
    }

    setBusy(true);
    setNotice("");
    try {
      const { agent } = await voiceApi.createAgent({ name });
      router.push(`/dashboard/agents/${encodeURIComponent(agent._id)}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create agent.");
    } finally {
      setBusy(false);
    }
  }

  function beginEditAgent(agent: AgentSummary) {
    dialogTriggerRef.current = document.activeElement as HTMLElement;
    setEditingAgent(agent);
    setEditAgentName(agent.name);
    setNotice("");
  }

  async function saveAgentName() {
    if (!editingAgent) return;
    const name = editAgentName.trim();
    if (!name) {
      setNotice("Enter an agent name first.");
      return;
    }

    setBusy(true);
    setNotice("");
    try {
      const { agent } = await voiceApi.saveAgent(editingAgent._id, {
        name,
        version: editingAgent.version,
      });
      setAgents((current) => current.map((item) => (
        item._id === editingAgent._id
          ? { ...item, name: agent.name, version: agent.version }
          : item
      )));
      setEditingAgent(null);
      setEditAgentName("");
      setNotice("Agent renamed.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not rename agent.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteAgent(agent: AgentSummary) {
    if (!window.confirm(`Delete ${agent.name}? This cannot be undone.`)) return;

    setBusy(true);
    setNotice("");
    try {
      await voiceApi.deleteAgent(agent._id);
      setAgents((current) => current.filter((item) => item._id !== agent._id));
      setNotice("Agent deleted.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not delete agent.");
    } finally {
      setBusy(false);
    }
  }

  if (!session) {
    return <main className="grid min-h-screen place-items-center bg-[#f7f8fc] text-sm font-semibold text-[#737587]" role="status">Loading agents</main>;
  }

  return (
    <main className={`agents-home-palette grid min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f7f8fc] text-[#242535] ${
      showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
    }`}>
      <DashboardSidebar
        activeLabel="Voice Agents"
        userInitials={getInitials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => void logoutSession().then(() => router.replace("/login"))}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />

      <section className="grid min-w-0 content-start gap-5">
        <header className="px-4 sm:px-6 lg:px-8">
          <div className="agents-page-header mx-auto w-full max-w-[1500px]">
            <div>
              <span className="saas-eyebrow">Your voice workspace</span>
              <h1>Voice agents</h1>
              <p>A great conversation starts with the right agent.</p>
            </div>
            <div className="agents-heading-actions">
              <Link className="saas-secondary" href="/dashboard/analytics"><Icon icon="activity" /> View analytics</Link>
              <button className="saas-primary" type="button" disabled={busy} onClick={(event) => {
                dialogTriggerRef.current = event.currentTarget;
                setShowCreateForm(true);
                setNotice("");
              }}><Icon icon="plus" /> Create agent</button>
            </div>
          </div>
        </header>

        <section className="agents-content mx-auto grid w-full max-w-[1500px] gap-4 px-4 pb-8 sm:px-6 lg:px-8">
          {notice && !showCreateForm && !editingAgent ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700" role="status" aria-live="polite">{notice}</div>
          ) : null}

          <div className="agents-metrics">
            {([
              { label: "Total agents", value: agents.length, detail: "Across your workspace", icon: "agent" },
              { label: "Live agents", value: liveCount, detail: "Published and ready", icon: "activity" },
              { label: "Draft agents", value: agents.filter((agent) => agent.status === "Draft").length, detail: "Ready for your next idea", icon: "edit" },
              { label: "Connected numbers", value: new Set(agents.map((agent) => agent.phone).filter((phone) => phone && !["Not assigned", "No phone number assigned"].includes(phone))).size, detail: "Assigned to your agents", icon: "phone" },
            ] as const).map((metric) => <article className="agents-metric" key={metric.label}><div><span className="agents-metric-label">{metric.label}</span><strong>{loading ? "—" : metric.value}</strong><small>{metric.detail}</small></div><span className="agents-metric-icon"><Icon icon={metric.icon} /></span></article>)}
          </div>

          <section className="agents-panel" aria-label="Your voice agents">
            <div className="agents-panel-heading"><div><h2>Your agents<span className="agents-count">{loading ? "—" : agents.length}</span></h2><p>Build, manage, and fine-tune your AI voice team.</p></div><div className="agents-view-toggle" role="group" aria-label="Agent layout"><button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><Icon icon="list" /></button><button type="button" aria-label="Card view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><Icon icon="grid" /></button></div></div>
            <div className="agents-toolbar">
              <div className="agents-tabs" role="group" aria-label="Filter agents by status">{["All agents", "Live", "Draft", "Paused"].map((status) => <button type="button" key={status} aria-pressed={statusFilter === status} onClick={() => setStatusFilter(status)}>{status}</button>)}</div>
              <label className="agents-search"><Icon icon="search" /><input aria-label="Search agents" value={query} placeholder="Search agents…" onChange={(event) => setQuery(event.target.value)} /></label>
            </div>
            {view === "list" && !loading && filteredAgents.length > 0 ? <div className="agents-table-heading" aria-hidden="true"><span>Agent name</span><span>Team</span><span>Phone number</span><span>Status</span><span>Actions</span></div> : null}
            <div className={view === "grid" && filteredAgents.length ? "agents-grid" : "agents-list"} aria-busy={loading}>
              {loading ? <div className="agents-loading" role="status"><span className="sr-only">Loading agents</span><div/><div/><div/></div> : filteredAgents.map((agent) => (
                <article className="agent-row" key={agent._id}>
                  <div className="agent-identity"><span className="agent-avatar"><Icon icon="agent" /></span><Link
                    href={`/dashboard/agents/${encodeURIComponent(agent._id)}`} prefetch={false}
                    onFocus={() => prefetchAgentRoute(agent._id)}
                    onMouseEnter={() => scheduleAgentDataPrefetch(agent._id)}
                    onMouseLeave={() => cancelAgentDataPrefetch(agent._id)}
                    onPointerDown={() => { cancelAgentDataPrefetch(agent._id); prefetchAgentRoute(agent._id); }}
                  ><strong title={agent.name}>{agent.name}</strong><small>Voice assistant</small></Link></div>
                  <span className="agent-team" title={agent.team || "Voice team"}><span className="agent-mobile-label">Team</span>{agent.team || "Voice team"}</span>
                  <span className="agent-phone" title={agent.phone || "Not assigned"}><span className="agent-mobile-label">Phone</span>{agent.phone || "Not assigned"}</span>
                  <span className="agent-status" data-status={agent.status}>{agent.status}</span>
                  <div className="agent-actions">
                    <Link href={`/dashboard/agents/${encodeURIComponent(agent._id)}`} aria-label={`Open ${agent.name}`} title="Open agent"><Icon icon="arrow" /></Link>
                    <button type="button" aria-label={`Edit ${agent.name}`} title="Rename agent" disabled={busy} onClick={() => beginEditAgent(agent)}><Icon icon="edit" /></button>
                    <button type="button" aria-label={`Delete ${agent.name}`} title="Delete agent" disabled={busy} onClick={() => void deleteAgent(agent)}><Icon icon="trash" /></button>
                  </div>
                </article>
              ))}
              {!loading && !filteredAgents.length ? <div className="agents-empty"><span className="agent-avatar"><Icon icon="agent" /></span><h3>{agents.length ? "No matching agents" : "Meet your next voice agent"}</h3><p>{agents.length ? "Try a different search or status to find the agent you need." : "Create an agent, give it a voice, and make your first conversation happen."}</p><button className="saas-primary" type="button" onClick={(event) => { if (agents.length) { setQuery(""); setStatusFilter("All agents"); } else { dialogTriggerRef.current = event.currentTarget; setShowCreateForm(true); setNotice(""); } }}>{agents.length ? "Clear filters" : "Create your first agent"}</button></div> : null}
            </div>
            <div className="agents-panel-footer" aria-live="polite"><span>{loading ? "Loading your workspace…" : `Showing ${filteredAgents.length} of ${agents.length} agents`}</span><span>Built for better conversations</span></div>
          </section>

          <div className="agents-guide"><div className="agents-guide-copy"><span className="agents-guide-symbol" aria-hidden="true">✧</span><div><h3>A voice that feels like your business.</h3><p>Explore our guides to build, test, and launch your next voice agent.</p></div></div><Link href="/docs">Explore the quickstart <span aria-hidden="true">↗</span></Link></div>
        </section>
      </section>

      {showCreateForm ? (
        <div ref={dialogRef} className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 px-4 py-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="create-agent-title" aria-describedby="create-agent-description" aria-busy={busy}>
          <form
            className="grid max-h-[calc(100dvh-2rem)] w-full max-w-md gap-4 overflow-y-auto rounded-lg border border-[#e5e7ef] bg-[#ffffff] p-5 shadow-sm"
            onSubmit={(event) => {
              event.preventDefault();
              void createAgent();
            }}
          >
            <div>
              <h2 className="app-section-title m-0" id="create-agent-title">Create a voice agent</h2>
              <p className="app-caption mt-1 mb-0 text-[#737587]" id="create-agent-description">Start with a name. Then choose a voice and teach your agent what to say.</p>
            </div>
            {notice ? <div className="rounded-lg border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-700" role="alert">{notice}</div> : null}
            <label className="grid gap-1.5">
              <span className="app-label text-[#4d54db]">Agent name</span>
              <input
                autoFocus
                required
                className="app-control-text min-h-11 rounded-lg border border-[#e5e7ef] bg-[#f8f8fc] px-3 text-[#242535] outline-none transition focus:border-[#5b63ff] focus:ring-4 focus:ring-[#5b63ff]/10"
                value={agentName}
                maxLength={80}
                placeholder="Example: Support desk"
                onChange={(event) => setAgentName(event.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="app-button-text min-h-10 rounded-lg border border-[#e5e7ef] bg-[#f8f8fc] px-4 text-[#737587] transition hover:bg-[#f6f7fb] active:translate-y-px disabled:opacity-50"
                type="button"
                disabled={busy}
                onClick={() => {
                  setShowCreateForm(false);
                  setAgentName("");
                }}
              >
                Cancel
              </button>
              <button
                className="app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border-0 bg-[#5b63ff] px-4 text-[#ffffff] shadow-sm transition hover:bg-[#4d54db] active:translate-y-px disabled:opacity-50"
                type="submit"
                disabled={busy}
              >
                <Icon icon="plus" />
                {busy ? "Creating..." : "Create agent"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {editingAgent ? (
        <div ref={dialogRef} className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 px-4 py-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="edit-agent-title" aria-describedby="edit-agent-description" aria-busy={busy}>
          <form
            className="grid max-h-[calc(100dvh-2rem)] w-full max-w-md gap-4 overflow-y-auto rounded-lg border border-[#e5e7ef] bg-[#ffffff] p-5 shadow-sm"
            onSubmit={(event) => {
              event.preventDefault();
              void saveAgentName();
            }}
          >
            <div>
              <h2 className="app-section-title m-0" id="edit-agent-title">Edit agent</h2>
              <p className="app-caption mt-1 mb-0 text-[#737587]" id="edit-agent-description">Rename this agent from the agents page.</p>
            </div>
            {notice ? <div className="rounded-lg border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-700" role="alert">{notice}</div> : null}
            <label className="grid gap-1.5">
              <span className="app-label text-[#4d54db]">Agent name</span>
              <input
                autoFocus
                required
                className="app-control-text min-h-11 rounded-lg border border-[#e5e7ef] bg-[#f8f8fc] px-3 text-[#242535] outline-none transition focus:border-[#5b63ff] focus:ring-4 focus:ring-[#5b63ff]/10"
                value={editAgentName}
                maxLength={80}
                onChange={(event) => setEditAgentName(event.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="app-button-text min-h-10 rounded-lg border border-[#e5e7ef] bg-[#f8f8fc] px-4 text-[#737587] transition hover:bg-[#f6f7fb] active:translate-y-px disabled:opacity-50"
                type="button"
                disabled={busy}
                onClick={() => {
                  setEditingAgent(null);
                  setEditAgentName("");
                }}
              >
                Cancel
              </button>
              <button
                className="app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#5b63ff]/24 bg-[#5b63ff]/[0.07] px-4 text-[#4d54db] shadow-sm transition hover:border-[#5b63ff]/40 hover:bg-[#5b63ff]/12 active:translate-y-px disabled:opacity-50"
                type="submit"
                disabled={busy}
              >
                <Icon icon="edit" />
                {busy ? "Saving..." : "Save name"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}
