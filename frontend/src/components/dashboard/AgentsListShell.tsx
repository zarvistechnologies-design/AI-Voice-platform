"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DashboardSidebar, getDashboardSidebarInitialState } from "@/components/dashboard/DashboardSidebar";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
} from "@/lib/auth";
import { voiceApi, type AgentSummary } from "@/lib/voice";

type IconName = "agent" | "chevron" | "clone" | "edit" | "more" | "phone" | "plus" | "search" | "trash";
type AgentStatusFilter = "All" | AgentSummary["status"];
type AgentSort = "name-asc" | "name-desc" | "status";

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
  if (icon === "chevron") return <svg {...props}><path d="m7 10 5 5 5-5" /></svg>;
  if (icon === "clone") return <svg {...props}><rect x="9" y="9" width="10" height="10" rx="2" /><path d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /></svg>;
  if (icon === "more") return <svg {...props}><circle cx="5" cy="12" r="1" className="fill-current stroke-none" /><circle cx="12" cy="12" r="1" className="fill-current stroke-none" /><circle cx="19" cy="12" r="1" className="fill-current stroke-none" /></svg>;
  if (icon === "phone") return <svg {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" /></svg>;
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
  return "border-[#dfe1ef] bg-[#f7f7fc] text-[#6b6f80]";
}

export function AgentsListShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AgentStatusFilter>("All");
  const [sortBy, setSortBy] = useState<AgentSort>("name-asc");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [editingAgent, setEditingAgent] = useState<AgentSummary | null>(null);
  const [editAgentName, setEditAgentName] = useState("");
  const [showUserSidebar, setShowUserSidebar] = useState(getDashboardSidebarInitialState);
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
    if (!openMenuId) return;
    const closeMenu = () => setOpenMenuId(null);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openMenuId]);

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
    const statusPriority: Record<AgentSummary["status"], number> = { Live: 0, Paused: 1, Draft: 2 };
    return agents
      .filter((agent) => statusFilter === "All" || agent.status === statusFilter)
      .filter((agent) => !normalizedQuery || [agent.name, agent.team, agent.status, agent.phone].some((value) =>
        String(value ?? "").toLowerCase().includes(normalizedQuery),
      ))
      .sort((left, right) => {
        if (sortBy === "name-desc") return right.name.localeCompare(left.name);
        if (sortBy === "status") return statusPriority[left.status] - statusPriority[right.status] || left.name.localeCompare(right.name);
        return left.name.localeCompare(right.name);
      });
  }, [agents, query, sortBy, statusFilter]);

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
    setOpenMenuId(null);
    setEditingAgent(agent);
    setEditAgentName(agent.name);
    setNotice("");
  }

  async function cloneAgent(agent: AgentSummary) {
    setOpenMenuId(null);
    setBusy(true);
    setNotice("");
    try {
      const { agent: clonedAgent } = await voiceApi.cloneAgent(agent._id);
      setAgents((current) => [...current, clonedAgent]);
      setNotice(`${agent.name} cloned.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not clone agent.");
    } finally {
      setBusy(false);
    }
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
    setOpenMenuId(null);
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
    return <main className="grid min-h-screen place-items-center bg-[#f7f7fc] text-sm font-semibold text-[#7a7d8e]" role="status">Loading agents</main>;
  }

  return (
    <main className={`agents-home-palette grid min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f7f7fc] text-[#1b1b22] ${
      showUserSidebar ? "lg:grid-cols-[240px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
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

      <section className="grid min-w-0 content-start">
        <DashboardPageHeader
          eyebrow="Voice agents"
          title="Agents"
          description="Create, configure, and monitor every voice agent from one place."
          actions={
            <button
              className="app-button-text inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#737ccf] bg-[#737ccf] px-4 text-white shadow-[0_8px_18px_rgba(115,124,207,0.20)] transition hover:border-[#5963b8] hover:bg-[#5963b8] active:translate-y-px disabled:opacity-50 sm:w-auto"
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
          }
        />

        <section className="mx-auto grid w-full max-w-[1500px] gap-3 px-4 py-5 sm:px-6 lg:px-8">
          {notice && !showCreateForm && !editingAgent ? (
            <div className="rounded-lg border border-[#dfe1ef] bg-white px-4 py-3 text-sm font-medium text-[#505261] shadow-sm" role="status" aria-live="polite">
              {notice}
            </div>
          ) : null}

          <div className="rounded-xl border border-[#dfe1ef] bg-white shadow-[0_10px_30px_rgba(34,38,74,0.05)]">
            <div className="flex flex-col gap-3 border-b border-[#e6e7ef] p-3 lg:flex-row lg:items-center">
              <div className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#dfe1ef] bg-white px-3 transition focus-within:border-[#737ccf] focus-within:ring-4 focus-within:ring-[#737ccf]/10">
                <span className="shrink-0 text-[#8b8e9f]"><Icon icon="search" /></span>
                <input
                  className="app-control-text min-h-9 min-w-0 flex-1 border-0 bg-transparent p-0 text-[#1b1b22] outline-none"
                  aria-label="Search agents"
                  value={query}
                  placeholder="Search by agent, team, or phone number"
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query ? <button className="text-xs font-semibold text-[#737ccf] hover:text-[#5963b8]" type="button" onClick={() => setQuery("")}>Clear</button> : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="relative min-w-[132px] flex-1 lg:flex-none">
                  <span className="sr-only">Filter by status</span>
                  <select
                    className="app-control-text min-h-10 w-full appearance-none rounded-lg border border-[#dfe1ef] bg-white py-0 pr-9 pl-3 text-sm font-semibold text-[#3b3e4e] outline-none transition hover:border-[#bfc3ea]"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as AgentStatusFilter)}
                  >
                    <option value="All">All statuses</option>
                    <option value="Live">Live</option>
                    <option value="Paused">Paused</option>
                    <option value="Draft">Draft</option>
                  </select>
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#7a7d8e]"><Icon icon="chevron" /></span>
                </label>
                <label className="relative min-w-[148px] flex-1 lg:flex-none">
                  <span className="sr-only">Sort agents</span>
                  <select
                    className="app-control-text min-h-10 w-full appearance-none rounded-lg border border-[#dfe1ef] bg-white py-0 pr-9 pl-3 text-sm font-semibold text-[#3b3e4e] outline-none transition hover:border-[#bfc3ea]"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as AgentSort)}
                  >
                    <option value="name-asc">Name A–Z</option>
                    <option value="name-desc">Name Z–A</option>
                    <option value="status">Status</option>
                  </select>
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#7a7d8e]"><Icon icon="chevron" /></span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-[#e6e7ef] px-4 py-2.5">
              <p className="m-0 text-sm font-semibold text-[#272936]">{filteredAgents.length} {filteredAgents.length === 1 ? "agent" : "agents"}</p>
              <p className="m-0 flex items-center gap-2 text-xs font-medium text-[#7a7d8e]"><span className="size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />{liveCount} live</p>
            </div>

            <div className="hidden grid-cols-[minmax(260px,1.6fr)_minmax(190px,0.9fr)_120px_48px] items-center gap-5 border-b border-[#e6e7ef] bg-[#fafafe] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a7d8e] md:grid">
              <span>Agent</span>
              <span>Phone route</span>
              <span>Status</span>
              <span className="sr-only">Actions</span>
            </div>

            <div className="divide-y divide-[#e6e7ef]">
            {loading ? (
              <div className="grid gap-0 divide-y divide-[#ececf3]" aria-label="Loading agents" role="status">
                {[0, 1, 2, 3].map((item) => <div className="grid min-h-[76px] grid-cols-[44px_1fr] items-center gap-3 px-4" key={item}><span className="size-10 animate-pulse rounded-lg bg-[#eff0fb]" /><span className="grid gap-2"><span className="h-3 w-44 animate-pulse rounded bg-[#eff0fb]" /><span className="h-2.5 w-28 animate-pulse rounded bg-[#f0f1f9]" /></span></div>)}
              </div>
            ) : null}

            {!loading && filteredAgents.map((agent) => (
              <article
                className="relative flex min-h-[76px] w-full items-center gap-2 px-3 text-left transition hover:bg-[#fafafe] focus-within:z-10 focus-within:bg-[#fafafe] sm:px-4"
                key={agent._id}
              >
                <Link
                  className="group grid min-w-0 flex-1 grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-md text-left outline-none md:grid-cols-[44px_minmax(190px,1.6fr)_minmax(170px,0.9fr)_120px] md:gap-5"
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
                  <span className="grid size-10 place-items-center rounded-lg bg-[#eff0fb] text-[#5963b8] ring-1 ring-[#737ccf]/10 transition group-hover:bg-[#e6e8fa]">
                    <Icon icon="agent" />
                  </span>
                  <span className="min-w-0">
                    <strong className="block truncate text-sm font-semibold text-[#20212b] transition group-hover:text-[#515bb4] sm:text-[15px]">{agent.name}</strong>
                    <span className="mt-0.5 block truncate text-xs text-[#7a7d8e]">{agent.team || "Voice team"}<span className="md:hidden"> · {agent.phone || "No phone assigned"}</span></span>
                  </span>
                  <span className="hidden min-w-0 items-center gap-2 text-sm text-[#505261] md:flex">
                    <span className="text-[#8b8e9f]"><Icon icon="phone" /></span>
                    <span className="truncate">{agent.phone || "Not assigned"}</span>
                  </span>
                  <span className={`hidden w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold md:inline-flex ${statusTone(agent.status)}`}>
                    <span className={`size-1.5 rounded-full ${agent.status === "Live" ? "bg-emerald-500" : agent.status === "Paused" ? "bg-amber-500" : "bg-[#9a9dac]"}`} />
                    {agent.status}
                  </span>
                </Link>
                <span className="relative shrink-0">
                  <button
                    className="grid size-9 place-items-center rounded-lg border border-transparent text-[#7a7d8e] transition hover:border-[#dfe1ef] hover:bg-white hover:text-[#515bb4] active:translate-y-px disabled:opacity-50"
                    type="button"
                    aria-label={`Actions for ${agent.name}`}
                    aria-haspopup="menu"
                    aria-expanded={openMenuId === agent._id}
                    disabled={busy}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => setOpenMenuId((current) => current === agent._id ? null : agent._id)}
                  >
                    <Icon icon="more" />
                  </button>
                  {openMenuId === agent._id ? (
                    <span className="absolute top-10 right-0 z-40 grid w-44 overflow-hidden rounded-xl border border-[#dfe1ef] bg-white p-1.5 shadow-[0_18px_45px_rgba(34,38,74,0.16)]" role="menu" onPointerDown={(event) => event.stopPropagation()}>
                      <button className="flex min-h-9 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-[#3b3e4e] hover:bg-[#f0f1f9] hover:text-[#515bb4]" role="menuitem" type="button" onClick={() => beginEditAgent(agent)}><Icon icon="edit" />Edit name</button>
                      <button className="flex min-h-9 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-[#3b3e4e] hover:bg-[#f0f1f9] hover:text-[#515bb4]" role="menuitem" type="button" onClick={() => void cloneAgent(agent)}><Icon icon="clone" />Clone agent</button>
                      <span className="my-1 h-px bg-[#e6e7ef]" />
                      <button className="flex min-h-9 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-rose-600 hover:bg-rose-50" role="menuitem" type="button" onClick={() => void deleteAgent(agent)}><Icon icon="trash" />Delete agent</button>
                    </span>
                  ) : null}
                </span>
              </article>
            ))}

            {!loading && !filteredAgents.length ? (
              <div className="grid min-h-56 place-items-center p-8 text-center">
                <div>
                  <span className="mx-auto grid size-12 place-items-center rounded-xl bg-[#eff0fb] text-[#5963b8]"><Icon icon="agent" /></span>
                  <strong className="mt-4 block text-base font-semibold text-[#20212b]">No agents found</strong>
                  <span className="mt-1 block text-sm text-[#7a7d8e]">Try another search or status filter.</span>
                  {(query || statusFilter !== "All") ? <button className="mt-4 text-sm font-semibold text-[#5963b8] hover:text-[#515bb4]" type="button" onClick={() => { setQuery(""); setStatusFilter("All"); }}>Clear filters</button> : null}
                </div>
              </div>
            ) : null}
            </div>
          </div>
        </section>
      </section>

      {showCreateForm ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#1b1b22]/35 px-4 py-4 backdrop-blur-[6px]" role="dialog" aria-modal="true" aria-labelledby="create-agent-title" aria-describedby="create-agent-description" aria-busy={busy}>
          <form
            className="grid max-h-[calc(100dvh-2rem)] w-full max-w-md gap-5 overflow-y-auto rounded-2xl border border-[#dfe1ef] bg-white p-6 shadow-[0_28px_80px_rgba(34,38,74,0.24)]"
            onSubmit={(event) => {
              event.preventDefault();
              void createAgent();
            }}
          >
            <div>
              <h2 className="app-section-title m-0" id="create-agent-title">New agent</h2>
              <p className="mt-1 mb-0 text-sm text-[#7a7d8e]" id="create-agent-description">Give the agent a clear name. You can configure its voice and behavior next.</p>
            </div>
            {notice ? <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700" role="alert">{notice}</div> : null}
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-[#505261]">Agent name</span>
              <input
                autoFocus
                required
                className="app-control-text min-h-11 rounded-lg border border-[#dfe1ef] bg-white px-3 text-[#1b1b22] outline-none transition focus:border-[#737ccf] focus:ring-4 focus:ring-[#737ccf]/10"
                value={agentName}
                maxLength={80}
                placeholder="Example: Support desk"
                onChange={(event) => setAgentName(event.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="app-button-text min-h-10 rounded-lg border border-[#dfe1ef] bg-white px-4 text-[#505261] transition hover:bg-[#f7f7fc] active:translate-y-px disabled:opacity-50"
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
                className="app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border-0 bg-[#737ccf] px-4 text-[#ffffff] shadow-[0_12px_28px_rgba(115,124,207,0.20)] transition hover:bg-[#5963b8] active:translate-y-px disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#1b1b22]/35 px-4 py-4 backdrop-blur-[6px]" role="dialog" aria-modal="true" aria-labelledby="edit-agent-title" aria-describedby="edit-agent-description" aria-busy={busy}>
          <form
            className="grid max-h-[calc(100dvh-2rem)] w-full max-w-md gap-5 overflow-y-auto rounded-2xl border border-[#dfe1ef] bg-white p-6 shadow-[0_28px_80px_rgba(34,38,74,0.24)]"
            onSubmit={(event) => {
              event.preventDefault();
              void saveAgentName();
            }}
          >
            <div>
              <h2 className="app-section-title m-0" id="edit-agent-title">Edit agent</h2>
              <p className="mt-1 mb-0 text-sm text-[#7a7d8e]" id="edit-agent-description">Update the name shown throughout this workspace.</p>
            </div>
            {notice ? <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700" role="alert">{notice}</div> : null}
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-[#505261]">Agent name</span>
              <input
                autoFocus
                required
                className="app-control-text min-h-11 rounded-lg border border-[#dfe1ef] bg-white px-3 text-[#1b1b22] outline-none transition focus:border-[#737ccf] focus:ring-4 focus:ring-[#737ccf]/10"
                value={editAgentName}
                maxLength={80}
                onChange={(event) => setEditAgentName(event.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="app-button-text min-h-10 rounded-lg border border-[#dfe1ef] bg-white px-4 text-[#505261] transition hover:bg-[#f7f7fc] active:translate-y-px disabled:opacity-50"
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
                className="app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#737ccf] bg-[#737ccf] px-4 text-white shadow-sm transition hover:border-[#5963b8] hover:bg-[#5963b8] active:translate-y-px disabled:opacity-50"
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
