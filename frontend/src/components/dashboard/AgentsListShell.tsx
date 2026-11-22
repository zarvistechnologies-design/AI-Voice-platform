"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DashboardSidebar, getDashboardSidebarInitialState } from "@/components/dashboard/DashboardSidebar";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { GuidedAgentCreateDialog } from "@/components/dashboard/GuidedAgentCreateDialog";
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

function getGreeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

function subscribeToGreeting(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(timer);
}

function Icon({ icon }: { icon: IconName }) {
  const props = {
    className: "size-3.5 fill-none stroke-current stroke-[1.9]",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (icon === "edit") return <svg {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>;
  if (icon === "chevron") return <svg {...props}><path d="m7 10 5 5 5-5" /></svg>;
  if (icon === "clone") return <svg {...props}><rect x="9" y="9" width="10" height="10" rx="2" /><path d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /></svg>;
  if (icon === "more") return <svg {...props}><circle cx="5" cy="12" r="1.1" className="fill-current stroke-none" /><circle cx="12" cy="12" r="1.1" className="fill-current stroke-none" /><circle cx="19" cy="12" r="1.1" className="fill-current stroke-none" /></svg>;
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
  if (status === "Live") return "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:!text-blue-300";
  if (status === "Paused") return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:!text-amber-300";
  return "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:!text-zinc-300";
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
  const [editingAgent, setEditingAgent] = useState<AgentSummary | null>(null);
  const [deleteBlockedAgent, setDeleteBlockedAgent] = useState<AgentSummary | null>(null);
  const [editAgentName, setEditAgentName] = useState("");
  const [showUserSidebar, setShowUserSidebar] = useState(getDashboardSidebarInitialState);
  const greeting = useSyncExternalStore(subscribeToGreeting, getGreeting, () => "Welcome back");
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
    if (agent.phone?.trim()) {
      setNotice("");
      setDeleteBlockedAgent(agent);
      return;
    }
    if (!window.confirm(`Delete ${agent.name}? This cannot be undone.`)) return;

    setBusy(true);
    setNotice("");
    try {
      await voiceApi.deleteAgent(agent._id);
      setAgents((current) => current.filter((item) => item._id !== agent._id));
      setNotice("Agent deleted.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not delete agent.";
      if (/phone numbers/i.test(message)) setDeleteBlockedAgent(agent);
      else setNotice(message);
    } finally {
      setBusy(false);
    }
  }

  if (!session) {
    return <main className="grid min-h-screen place-items-center bg-[#fafafa] text-[12.5px] font-medium text-[#666666]" role="status">Loading agents...</main>;
  }

  const liveCount = agents.filter((a) => a.status === "Live").length;
  const routedCount = agents.filter((a) => Boolean(a.phone)).length;

  return (
    <main className={`agents-home-palette dashboard-home-theme grid min-h-screen w-full min-w-0 overflow-x-hidden bg-[#fafafa] dark:bg-[#09090b] text-[#171717] dark:text-white ${
      showUserSidebar ? "lg:grid-cols-[248px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
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

      <section className="grid min-w-0 content-start bg-[#fafafa] dark:bg-[#09090b]">
        <DashboardPageHeader
          eyebrow="Overview"
          title="Agents"
          description="Monitor usage, configure voice agents, and route live calls."
          actions={
            <button
              className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3.5 text-[12.5px] font-medium text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 active:translate-y-px disabled:opacity-50"
              type="button"
              disabled={busy}
              onClick={() => {
                setShowCreateForm(true);
                setNotice("");
              }}
            >
              <Icon icon="plus" />
              New Agent
            </button>
          }
        />

        <section className="grid w-full gap-5 px-5 py-5 sm:px-6 lg:px-7">
          {notice && !showCreateForm && !editingAgent ? (
            <div className="rounded-md border border-[#e5e5e5] bg-white px-3.5 py-2 text-[12.5px] text-[#171717] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" role="alert" aria-live="polite">
              {notice}
            </div>
          ) : null}

          {/* Compact White & Black Search & Controls Bar */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md border border-[#e5e5e5] bg-white px-2.5 transition focus-within:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/90 dark:focus-within:border-blue-400">
              <span className="shrink-0 text-blue-600 dark:text-blue-400"><Icon icon="search" /></span>
              <input
                className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[12.5px] text-[#171717] placeholder-[#888888] outline-none dark:text-white dark:placeholder-zinc-500"
                aria-label="Search agents"
                value={query}
                placeholder="Search Agents..."
                onChange={(event) => setQuery(event.target.value)}
              />
              {query ? (
                <button className="text-[11.5px] font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" type="button" onClick={() => setQuery("")}>Clear</button>
              ) : (
                <kbd className="hidden rounded border border-[#e5e5e5] bg-[#fafafa] px-1.5 py-0.5 text-[10px] font-medium text-[#666666] sm:inline-block dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">/</kbd>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="relative min-w-[118px] flex-1 sm:flex-none">
                <span className="sr-only">Filter by status</span>
                <select
                  className="h-8 w-full appearance-none rounded-md border border-[#e5e5e5] bg-white pr-7 pl-2.5 text-[12.5px] font-medium text-[#171717] outline-none transition hover:border-blue-300 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-blue-600"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as AgentStatusFilter)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Live">Live</option>
                  <option value="Paused">Paused</option>
                  <option value="Draft">Draft</option>
                </select>
              </label>

              <label className="relative min-w-[122px] flex-1 sm:flex-none">
                <span className="sr-only">Sort agents</span>
                <select
                  className="h-8 w-full appearance-none rounded-md border border-[#e5e5e5] bg-white pr-7 pl-2.5 text-[12.5px] font-medium text-[#171717] outline-none transition hover:border-blue-300 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-blue-600"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as AgentSort)}
                >
                  <option value="name-asc">Name A–Z</option>
                  <option value="name-desc">Name Z–A</option>
                  <option value="status">Status</option>
                </select>
              </label>
            </div>
          </div>

          {/* Full-width Agents List */}
          <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[12.5px] font-semibold text-[#171717] dark:text-white">
                Agents <span className="ml-1 text-[11.5px] font-normal tabular-nums text-[#888888] dark:text-zinc-400">{filteredAgents.length}</span>
              </h2>
            </div>

            {loading ? (
              <div className="grid gap-2.5" aria-label="Loading agents" role="status">
                {[0, 1, 2, 3, 4, 5].map((item) => (
                  <div className="flex min-h-[64px] flex-col justify-between gap-2 rounded-xl border border-[#eaeaea] bg-white p-3 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900/60" key={item}>
                    <div className="flex items-center gap-3">
                      <span className="size-9 animate-pulse rounded-lg bg-[#f4f4f5] dark:bg-zinc-800" />
                      <span className="grid gap-1.5">
                        <span className="h-3 w-36 animate-pulse rounded bg-[#f0f0f0] dark:bg-zinc-800" />
                        <span className="h-2.5 w-20 animate-pulse rounded bg-[#f4f4f5] dark:bg-zinc-800/60" />
                      </span>
                    </div>
                    <span className="h-2.5 w-28 animate-pulse rounded bg-[#f4f4f5] dark:bg-zinc-800/60" />
                  </div>
                ))}
              </div>
            ) : null}

            {!loading && filteredAgents.length ? (
              <div className="grid gap-2.5">
                {filteredAgents.map((agent) => (
                  <article
                    className="group relative flex flex-col justify-between gap-2 rounded-xl border border-[#eaeaea] bg-white p-3 text-left transition hover:border-blue-300 hover:shadow-xs sm:min-h-[64px] sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-blue-600 dark:hover:bg-zinc-900 focus-within:z-10"
                    key={agent._id}
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3 sm:flex-1 sm:items-center">
                      <Link
                        className="flex min-w-0 flex-1 items-center gap-3 rounded outline-none"
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
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 group-hover:border-blue-300 dark:group-hover:border-blue-500">
                          <Icon icon="agent" />
                        </span>
                        <span className="min-w-0">
                          <strong className="block truncate text-[13.5px] font-semibold text-[#171717] transition dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">
                            {agent.name}
                          </strong>
                          <span className="mt-0.5 block truncate text-[11.5px] text-zinc-500 dark:text-zinc-300 font-medium">
                            {agent.team || "Voice team"}
                          </span>
                        </span>
                      </Link>

                      <span className="relative shrink-0">
                        <button
                          className="grid size-7 place-items-center rounded-md border border-transparent text-[#888888] transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:text-zinc-400 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-300 disabled:opacity-50"
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
                          <span className="absolute top-8 right-0 z-40 grid w-36 overflow-hidden rounded-lg border border-[#eaeaea] bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" role="menu" onPointerDown={(event) => event.stopPropagation()}>
                            <button className="flex h-7 items-center gap-2 rounded px-2 text-left text-[12px] font-medium text-[#171717] hover:bg-blue-50 hover:text-blue-700 dark:text-zinc-200 dark:hover:bg-blue-500/10 dark:hover:text-blue-300" role="menuitem" type="button" onClick={() => beginEditAgent(agent)}><Icon icon="edit" />Edit name</button>
                            <button className="flex h-7 items-center gap-2 rounded px-2 text-left text-[12px] font-medium text-[#171717] hover:bg-blue-50 hover:text-blue-700 dark:text-zinc-200 dark:hover:bg-blue-500/10 dark:hover:text-blue-300" role="menuitem" type="button" onClick={() => void cloneAgent(agent)}><Icon icon="clone" />Clone agent</button>
                            <span className="my-1 h-px bg-[#eaeaea] dark:bg-zinc-800" />
                            <button className="flex h-7 items-center gap-2 rounded px-2 text-left text-[12px] font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30" role="menuitem" type="button" onClick={() => void deleteAgent(agent)}><Icon icon="trash" />Delete agent</button>
                          </span>
                        ) : null}
                      </span>
                    </div>

                    <Link
                      className="flex items-center justify-between gap-2 border-t border-[#f4f4f5] pt-3 text-[11.5px] outline-none sm:w-[280px] sm:shrink-0 sm:border-t-0 sm:border-l sm:py-1 sm:pl-4 dark:border-zinc-800"
                      href={`/dashboard/agents/${encodeURIComponent(agent._id)}`}
                      prefetch={false}
                    >
                      <span className="truncate font-mono text-zinc-600 dark:text-zinc-200 font-medium">
                        {agent.phone || "No route assigned"}
                      </span>
                      <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusTone(agent.status)}`}>
                        <span className={`size-1.5 rounded-full ${agent.status === "Live" ? "bg-blue-500 dark:bg-blue-400" : agent.status === "Paused" ? "bg-amber-500 dark:bg-amber-400" : "bg-zinc-400 dark:bg-zinc-500"}`} />
                        {agent.status}
                      </span>
                    </Link>
                  </article>
                ))}
              </div>
            ) : null}

            {!loading && !filteredAgents.length ? (
              <div className="grid min-h-44 place-items-center rounded-xl border border-[#eaeaea] bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <div>
                  <span className="mx-auto grid size-9 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"><Icon icon="agent" /></span>
                  <strong className="mt-2.5 block text-[13px] font-medium text-[#171717] dark:text-white">No agents found</strong>
                  <span className="mt-0.5 block text-[11.5px] text-[#71717a] dark:text-zinc-400">Try another search or status filter.</span>
                  {(query || statusFilter !== "All") ? (
                    <button className="mt-2.5 text-[11.5px] font-medium text-blue-600 dark:text-blue-400 underline underline-offset-4" type="button" onClick={() => { setQuery(""); setStatusFilter("All"); }}>
                      Clear filters
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
            </div>
        </section>
      </section>

      {showCreateForm ? (
        <GuidedAgentCreateDialog
          onClose={() => setShowCreateForm(false)}
          onCreated={(agentId) => router.push(`/dashboard/agents/${encodeURIComponent(agentId)}`)}
        />
      ) : null}

      {editingAgent ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/45 px-4 py-4 backdrop-blur-[4px]" role="dialog" aria-modal="true" aria-labelledby="edit-agent-title" aria-describedby="edit-agent-description" aria-busy={busy}>
          <form
            className="grid max-h-[calc(100dvh-2rem)] w-full max-w-md gap-4 overflow-y-auto rounded-xl border border-[#e5e5e5] bg-white p-5 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault();
              void saveAgentName();
            }}
          >
            <div>
              <h2 className="m-0 text-[15px] font-semibold text-black" id="edit-agent-title">Edit agent</h2>
              <p className="mt-1 mb-0 text-[12.5px] text-[#666666]" id="edit-agent-description">Update the name shown throughout this workspace.</p>
            </div>
            {notice ? <div className="rounded border border-[#e5e5e5] bg-[#fafafa] px-3 py-2 text-[12px] font-medium text-black" role="alert">{notice}</div> : null}
            <label className="grid gap-1.5">
              <span className="text-[11.5px] font-medium text-[#444444]">Agent name</span>
              <input
                autoFocus
                required
                className="h-9 rounded-md border border-[#e5e5e5] bg-white px-3 text-[13px] text-black outline-none transition focus:border-blue-500"
                value={editAgentName}
                maxLength={80}
                onChange={(event) => setEditAgentName(event.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="h-8 rounded-md border border-[#e5e5e5] bg-white px-3 text-[12.5px] font-medium text-[#171717] transition hover:bg-[#fafafa] disabled:opacity-50"
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
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3.5 text-[12.5px] font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
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

      {deleteBlockedAgent ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-[4px]" role="dialog" aria-modal="true" aria-labelledby="delete-agent-phone-title">
          <div className="w-full max-w-md rounded-xl border border-[#e5e5e5] bg-white p-5 shadow-xl">
            <h2 className="m-0 text-[15px] font-semibold text-black" id="delete-agent-phone-title">Unlink the phone number first</h2>
            <p className="mt-2 text-[12.5px] leading-5 text-[#666666]">
              {deleteBlockedAgent.name} has a phone route assigned. Move or unlink that number in Phone Numbers, then return here to delete the agent.
            </p>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button className="h-8 rounded-md border border-[#e5e5e5] bg-white px-3 text-[12.5px] font-medium text-[#171717]" type="button" onClick={() => setDeleteBlockedAgent(null)}>Close</button>
              <Link className="inline-flex h-8 items-center rounded-md bg-blue-600 px-3.5 text-[12.5px] font-medium text-white hover:bg-blue-700" href="/dashboard/phone-number" onClick={() => setDeleteBlockedAgent(null)}>Manage phone route</Link>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
