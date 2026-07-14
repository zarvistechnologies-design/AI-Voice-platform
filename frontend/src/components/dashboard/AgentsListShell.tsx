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
  if (status === "Live") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "Paused") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
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
    return <main className="app-strong grid min-h-screen place-items-center bg-[#f6f8fc]">Loading agents</main>;
  }

  return (
    <main className="grid min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f6f8fc] text-[#111827] lg:grid-cols-[64px_minmax(0,1fr)]">
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
        <header className="border-b border-[#99f6e8] bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-1500px flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="app-label text-[#00b8c4]">{session.organization?.name ?? "Workspace"}</span>
              <h1 className="m-0 mt-1 text-xl font-semibold leading-7 text-[#0f172a] sm:text-2xl">Agents</h1>
              <p className="app-caption mt-1 mb-0 text-[#475569]">{liveCount} live / {agents.length} total</p>
            </div>
            <button
              className="app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#99f6e8] bg-[#ecfeff] px-4 text-[#008996] shadow-sm transition hover:bg-[#ccfbf1] disabled:opacity-60"
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

        <section className="mx-auto grid w-full max-w-1500px gap-4 px-4 pb-5 sm:px-6 lg:px-8">
          {notice ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
              {notice}
            </div>
          ) : null}

          <div className="flex min-h-11 items-center gap-2 rounded-lg border border-[#dfe3ea] bg-white px-3 shadow-sm">
            <span className="text-[#64748b]"><Icon icon="search" /></span>
            <input
              className="app-control-text min-h-10 flex-1 border-0 bg-transparent text-[#111827] outline-none"
              value={query}
              placeholder="Search agents"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="grid gap-3">
            {loading ? (
              <div className="rounded-lg border border-dashed border-[#d5d8df] bg-white p-8 text-center">
                <span className="app-caption">Loading agents...</span>
              </div>
            ) : null}

            {!loading && filteredAgents.map((agent) => (
              <article
                className="grid min-h-20 w-full gap-3 rounded-lg border border-[#dbe2ea] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#99f6e8] hover:shadow-md sm:grid-cols-[44px_minmax(0,1fr)_auto_auto] sm:items-center"
                key={agent._id}
              >
                <span className="grid size-11 place-items-center rounded-lg bg-[#00b8c4] text-white shadow-sm">
                  <Icon icon="agent" />
                </span>
                <Link
                  className="min-w-0 text-left"
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
                  <strong className="app-strong block truncate text-base">{agent.name}</strong>
                  <span className="app-caption block truncate">{agent.team || "Voice team"}</span>
                  <span className="app-caption block truncate">{agent.phone || "No phone number assigned"}</span>
                </Link>
                <span className={`app-label inline-flex w-fit rounded-full border px-2.5 py-1 ${statusTone(agent.status)}`}>
                  {agent.status}
                </span>
                <span className="flex items-center gap-1 sm:justify-end">
                  <button
                    className="grid size-8 place-items-center rounded-lg border border-[#d5d8df] bg-white text-[#64748b] transition hover:border-[#99f6e8] hover:bg-[#ecfeff] hover:text-[#008996] disabled:opacity-50"
                    type="button"
                    aria-label={`Edit ${agent.name}`}
                    title="Edit agent"
                    disabled={busy}
                    onClick={() => beginEditAgent(agent)}
                  >
                    <Icon icon="edit" />
                  </button>
                  <button
                    className="grid size-8 place-items-center rounded-lg border border-[#fecdd3] bg-[#fff1f2] text-[#be123c] transition hover:bg-[#ffe4e6] disabled:opacity-50"
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
              <div className="rounded-lg border border-dashed border-[#d5d8df] bg-white p-8 text-center">
                <strong className="app-strong block">No agents found</strong>
                <span className="app-caption mt-1 block">Create a new agent or clear your search.</span>
              </div>
            ) : null}
          </div>
        </section>
      </section>

      {showCreateForm ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 px-4" role="dialog" aria-modal="true" aria-labelledby="create-agent-title">
          <form
            className="grid w-full max-w-md gap-4 rounded-lg border border-[#dbe2ea] bg-white p-5 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault();
              void createAgent();
            }}
          >
            <div>
              <h2 className="app-section-title m-0" id="create-agent-title">New agent</h2>
              <p className="app-caption mt-1 mb-0 text-[#475569]">Give the agent a name before opening the builder.</p>
            </div>
            <label className="grid gap-1.5">
              <span className="app-label text-[#475569]">Agent name</span>
              <input
                autoFocus
                className="app-control-text min-h-11 rounded-lg border border-[#dfe3ea] bg-white px-3 text-[#111827] outline-none transition focus:border-[#00b8c4] focus:ring-4 focus:ring-[#00b8c4]/10"
                value={agentName}
                maxLength={80}
                placeholder="Example: Support desk"
                onChange={(event) => setAgentName(event.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="app-button-text min-h-10 rounded-lg border border-[#d5d8df] bg-white px-4 text-[#334155]"
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
                className="app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border-0 bg-[#00b8c4] px-4 text-white shadow-[0_12px_28px_rgba(0,184,196,0.28)] disabled:opacity-60"
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
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 px-4" role="dialog" aria-modal="true" aria-labelledby="edit-agent-title">
          <form
            className="grid w-full max-w-md gap-4 rounded-lg border border-[#dbe2ea] bg-white p-5 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault();
              void saveAgentName();
            }}
          >
            <div>
              <h2 className="app-section-title m-0" id="edit-agent-title">Edit agent</h2>
              <p className="app-caption mt-1 mb-0 text-[#475569]">Rename this agent from the agents page.</p>
            </div>
            <label className="grid gap-1.5">
              <span className="app-label text-[#475569]">Agent name</span>
              <input
                autoFocus
                className="app-control-text min-h-11 rounded-lg border border-[#dfe3ea] bg-white px-3 text-[#111827] outline-none transition focus:border-[#00b8c4] focus:ring-4 focus:ring-[#00b8c4]/10"
                value={editAgentName}
                maxLength={80}
                onChange={(event) => setEditAgentName(event.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="app-button-text min-h-10 rounded-lg border border-[#d5d8df] bg-white px-4 text-[#334155]"
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
                className="app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#99f6e8] bg-[#ecfeff] px-4 text-[#0e7490] shadow-sm disabled:opacity-60"
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
