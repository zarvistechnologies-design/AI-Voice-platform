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

type IconName = "agent" | "edit" | "plus" | "search" | "trash";

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

function statusTone(status: AgentSummary["status"]) {
  if (status === "Live") return "border-[#45ddce]/24 bg-[#45ddce]/[0.07] text-[#75fff0]";
  if (status === "Paused") return "border-amber-300/20 bg-amber-400/10 text-amber-200";
  return "border-white/10 bg-white/[0.06] text-white/55";
}

export function AgentsListShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [editingAgent, setEditingAgent] = useState<AgentSummary | null>(null);
  const [editAgentName, setEditAgentName] = useState("");
  const [showUserSidebar, setShowUserSidebar] = useState(false);
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
    if (!normalizedQuery) return agents;
    return agents.filter((agent) =>
      [agent.name, agent.team, agent.status, agent.phone].some((value) =>
        String(value ?? "").toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [agents, query]);

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
    return <main className="grid min-h-screen place-items-center bg-black text-sm font-semibold text-white/60" role="status">Loading agents</main>;
  }

  return (
    <main className={`agents-home-palette grid min-h-screen w-full min-w-0 overflow-x-hidden bg-black text-white ${
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
        <header className="border-b border-white/10 bg-[#07110f] px-4 py-4 shadow-[0_12px_32px_rgba(0,0,0,0.32)] sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="app-label text-[#75fff0]">{session.organization?.name ?? "Workspace"}</span>
              <h1 className="m-0 mt-1 text-xl font-semibold leading-7 text-white sm:text-2xl">Agents</h1>
              <p className="app-caption mt-1 mb-0 text-white/60">{liveCount} live / {agents.length} total</p>
            </div>
            <button
              className="app-button-text inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#45ddce]/24 bg-[#45ddce]/[0.07] px-4 text-[#75fff0] shadow-sm transition hover:border-[#45ddce]/40 hover:bg-[#45ddce]/12 active:translate-y-px disabled:opacity-50 sm:w-auto"
              type="button"
              disabled={busy}
              onClick={() => {
                setShowCreateForm(true);
                setNotice("");
              }}
            >
              <Icon icon="plus" />
              New agent
            </button>
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-[1500px] gap-4 px-4 pb-5 sm:px-6 lg:px-8">
          {notice && !showCreateForm && !editingAgent ? (
            <div className="rounded-lg border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-200" role="status" aria-live="polite">
              {notice}
            </div>
          ) : null}

          <div className="flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-[#07110f] px-3 shadow-sm transition focus-within:border-[#45ddce]/50 focus-within:ring-4 focus-within:ring-[#45ddce]/10">
            <span className="text-white/42"><Icon icon="search" /></span>
            <input
              className="app-control-text min-h-10 flex-1 border-0 bg-transparent text-white outline-none"
              aria-label="Search agents"
              value={query}
              placeholder="Search agents"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="grid gap-3">
            {loading ? (
              <div className="rounded-lg border border-dashed border-white/10 bg-[#07110f] p-8 text-center">
                <span className="app-caption">Loading agents...</span>
              </div>
            ) : null}

            {!loading && filteredAgents.map((agent) => (
              <article
                className="grid min-h-20 w-full gap-3 rounded-lg border border-white/10 bg-[#07110f] p-4 text-left shadow-sm transition focus-within:border-[#45ddce]/50 focus-within:ring-2 focus-within:ring-[#45ddce]/10 hover:-translate-y-0.5 hover:border-[#45ddce]/38 hover:bg-[#0a1d19] hover:shadow-[0_14px_32px_rgba(69,221,206,0.08)] sm:grid-cols-[44px_minmax(0,1fr)_auto_auto] sm:items-center"
                key={agent._id}
              >
                <span className="grid size-11 place-items-center rounded-lg bg-[#45ddce]/10 text-[#82fff2] shadow-sm ring-1 ring-[#45ddce]/20">
                  <Icon icon="agent" />
                </span>
                <Link
                  className="group min-w-0 rounded-md text-left outline-none"
                  href={`/dashboard/agents/${encodeURIComponent(agent._id)}`}
                  prefetch={false}
                  onFocus={() => prefetchAgentRoute(agent._id)}
                  onMouseEnter={() => scheduleAgentDataPrefetch(agent._id)}
                  onMouseLeave={() => cancelAgentDataPrefetch(agent._id)}
                  onPointerDown={() => {
                    cancelAgentDataPrefetch(agent._id);
                    prefetchAgentRoute(agent._id);
                  }}
                >
                  <strong className="app-strong block truncate text-base transition group-hover:text-[#82fff2]">{agent.name}</strong>
                  <span className="app-caption block truncate">{agent.team || "Voice team"}</span>
                  <span className="app-caption block truncate">{agent.phone || "No phone number assigned"}</span>
                </Link>
                <span className={`app-label inline-flex w-fit rounded-full border px-2.5 py-1 ${statusTone(agent.status)}`}>
                  {agent.status}
                </span>
                <span className="flex items-center gap-1 sm:justify-end">
                  <button
                    className="grid size-10 place-items-center rounded-lg border border-white/10 bg-[#061b18] text-white/56 transition hover:border-[#45ddce]/38 hover:bg-[#45ddce]/10 hover:text-[#75fff0] active:translate-y-px disabled:opacity-50 sm:size-8"
                    type="button"
                    aria-label={`Edit ${agent.name}`}
                    title="Edit agent"
                    disabled={busy}
                    onClick={() => beginEditAgent(agent)}
                  >
                    <Icon icon="edit" />
                  </button>
                  <button
                    className="grid size-10 place-items-center rounded-lg border border-rose-300/20 bg-rose-400/10 text-rose-200 transition hover:bg-rose-400/15 active:translate-y-px disabled:opacity-50 sm:size-8"
                    type="button"
                    aria-label={`Delete ${agent.name}`}
                    title="Delete agent"
                    disabled={busy}
                    onClick={() => void deleteAgent(agent)}
                  >
                    <Icon icon="trash" />
                  </button>
                </span>
              </article>
            ))}

            {!loading && !filteredAgents.length ? (
              <div className="rounded-lg border border-dashed border-white/10 bg-[#07110f] p-8 text-center">
                <strong className="app-strong block">No agents found</strong>
                <span className="app-caption mt-1 block">Create a new agent or clear your search.</span>
              </div>
            ) : null}
          </div>
        </section>
      </section>

      {showCreateForm ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 px-4 py-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="create-agent-title" aria-describedby="create-agent-description" aria-busy={busy}>
          <form
            className="grid max-h-[calc(100dvh-2rem)] w-full max-w-md gap-4 overflow-y-auto rounded-lg border border-white/12 bg-[#07110f] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.52)]"
            onSubmit={(event) => {
              event.preventDefault();
              void createAgent();
            }}
          >
            <div>
              <h2 className="app-section-title m-0" id="create-agent-title">New agent</h2>
              <p className="app-caption mt-1 mb-0 text-white/56" id="create-agent-description">Give the agent a name before opening the builder.</p>
            </div>
            {notice ? <div className="rounded-lg border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200" role="alert">{notice}</div> : null}
            <label className="grid gap-1.5">
              <span className="app-label text-[#75fff0]">Agent name</span>
              <input
                autoFocus
                required
                className="app-control-text min-h-11 rounded-lg border border-white/10 bg-[#061b18] px-3 text-white outline-none transition focus:border-[#45ddce] focus:ring-4 focus:ring-[#45ddce]/10"
                value={agentName}
                maxLength={80}
                placeholder="Example: Support desk"
                onChange={(event) => setAgentName(event.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="app-button-text min-h-10 rounded-lg border border-white/10 bg-[#061b18] px-4 text-white/78 transition hover:bg-white/[0.08] active:translate-y-px disabled:opacity-50"
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
                className="app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border-0 bg-[#45ddce] px-4 text-[#04231f] shadow-[0_12px_28px_rgba(69,221,206,0.20)] transition hover:bg-[#75fff0] active:translate-y-px disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 px-4 py-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="edit-agent-title" aria-describedby="edit-agent-description" aria-busy={busy}>
          <form
            className="grid max-h-[calc(100dvh-2rem)] w-full max-w-md gap-4 overflow-y-auto rounded-lg border border-white/12 bg-[#07110f] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.52)]"
            onSubmit={(event) => {
              event.preventDefault();
              void saveAgentName();
            }}
          >
            <div>
              <h2 className="app-section-title m-0" id="edit-agent-title">Edit agent</h2>
              <p className="app-caption mt-1 mb-0 text-white/56" id="edit-agent-description">Rename this agent from the agents page.</p>
            </div>
            {notice ? <div className="rounded-lg border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200" role="alert">{notice}</div> : null}
            <label className="grid gap-1.5">
              <span className="app-label text-[#75fff0]">Agent name</span>
              <input
                autoFocus
                required
                className="app-control-text min-h-11 rounded-lg border border-white/10 bg-[#061b18] px-3 text-white outline-none transition focus:border-[#45ddce] focus:ring-4 focus:ring-[#45ddce]/10"
                value={editAgentName}
                maxLength={80}
                onChange={(event) => setEditAgentName(event.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="app-button-text min-h-10 rounded-lg border border-white/10 bg-[#061b18] px-4 text-white/78 transition hover:bg-white/[0.08] active:translate-y-px disabled:opacity-50"
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
                className="app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#45ddce]/24 bg-[#45ddce]/[0.07] px-4 text-[#75fff0] shadow-sm transition hover:border-[#45ddce]/40 hover:bg-[#45ddce]/12 active:translate-y-px disabled:opacity-50"
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
