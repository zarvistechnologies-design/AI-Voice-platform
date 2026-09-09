"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";

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
import {
  voiceApi,
  type KnowledgeAgentSummary,
  type KnowledgeSource,
  type WorkspaceKnowledgeSource,
} from "@/lib/voice";

type IconName =
  | "check"
  | "close"
  | "edit"
  | "file"
  | "link"
  | "plus"
  | "refresh"
  | "search"
  | "trash"
  | "upload"
  | "user";
type DisplayKnowledgeSource = KnowledgeSource & {
  agentId: string;
  agentName: string;
  attachedLegacy?: boolean;
};
type KnowledgeEditor = {
  sourceId: string;
  agentId: string;
  name: string;
  content: string;
};

const buttonClass =
  "app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 transition disabled:cursor-not-allowed disabled:opacity-50";
const controlClass =
  "app-control-text min-h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#6468ff] focus:ring-4 focus:ring-[#6468ff]/10";
const acceptedFiles =
  ".pdf,.docx,.txt,.md,.csv,.json,.html,.htm,.xml,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,text/csv,application/json,text/html,application/xml";

function Icon({
  icon,
  className = "size-4",
}: {
  icon: IconName;
  className?: string;
}) {
  const props = {
    className: `${className} fill-none stroke-current stroke-2`,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  if (icon === "check")
    return (
      <svg {...props}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  if (icon === "close")
    return (
      <svg {...props}>
        <path d="M6 6 18 18M18 6 6 18" />
      </svg>
    );
  if (icon === "edit")
    return (
      <svg {...props}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </svg>
    );
  if (icon === "file")
    return (
      <svg {...props}>
        <path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5M8 13h8M8 17h5" />
      </svg>
    );
  if (icon === "link")
    return (
      <svg {...props}>
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
        <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
      </svg>
    );
  if (icon === "plus")
    return (
      <svg {...props}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  if (icon === "refresh")
    return (
      <svg {...props}>
        <path d="M20 7v5h-5M4 17v-5h5" />
        <path d="M6.1 9a7 7 0 0 1 11.5-2L20 9M4 15l2.4 2A7 7 0 0 0 18 15" />
      </svg>
    );
  if (icon === "search")
    return (
      <svg {...props}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    );
  if (icon === "trash")
    return (
      <svg {...props}>
        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
      </svg>
    );
  if (icon === "upload")
    return (
      <svg {...props}>
        <path d="M12 15V3m0 0 4 4m-4-4-4 4" />
        <path d="M4 17v3h16v-3" />
      </svg>
    );
  return (
    <svg {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "The request could not be completed.";
}

function sourceTypeLabel(source: KnowledgeSource) {
  if (source.sourceType === "url") return "Website";
  if (source.sourceType === "file") return "File";
  return "Text";
}

function statusStyle(status: KnowledgeSource["status"]) {
  if (status === "ready") return "bg-[#ecfdf5] text-[#047857]";
  if (status === "failed") return "bg-[#fff1f2] text-[#b91c1c]";
  if (status === "processing") return "bg-[#eff6ff] text-[#1d4ed8]";
  return "bg-[#f1f5f9] text-[#64748b]";
}

function preview(value: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > 180 ? `${clean.slice(0, 180)}…` : clean;
}

function includeAttachedKnowledge(
  agent: KnowledgeAgentSummary,
  indexedSources: KnowledgeSource[],
): DisplayKnowledgeSource[] {
  const ownedSources = indexedSources.map((source): DisplayKnowledgeSource => ({
    ...source,
    agentId: agent._id,
    agentName: agent.name,
  }));
  if (!agent.knowledgeDocuments.length) return ownedSources;
  const indexedNames = new Set(
    indexedSources.map((source) => source.name.trim().toLowerCase()),
  );
  const attached = agent.knowledgeDocuments
    .filter((document) => !indexedNames.has(document.name.trim().toLowerCase()))
    .map((document, index): DisplayKnowledgeSource => ({
      _id: `attached-${document._id || index}`,
      name: document.name,
      sourceType: "legacy",
      status: document.status,
      originalFileName: "",
      mimeType: "text/plain",
      url: "",
      characterCount: document.content.length,
      chunkCount: 0,
      embeddingModel: "",
      error: "",
      preview: document.content,
      createdAt: "",
      updatedAt: "",
      agentId: agent._id,
      agentName: agent.name,
      attachedLegacy: true,
    }));
  return [...ownedSources, ...attached];
}

function mergeWorkspaceKnowledge(
  agentList: KnowledgeAgentSummary[],
  indexedSources: WorkspaceKnowledgeSource[],
) {
  return agentList.flatMap((agent) =>
    includeAttachedKnowledge(
      agent,
      indexedSources.filter((source) => source.agentId === agent._id),
    ),
  );
}

export function KnowledgeBaseShell() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );
  const [agents, setAgents] = useState<KnowledgeAgentSummary[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [sources, setSources] = useState<DisplayKnowledgeSource[]>([]);
  const [maximumSources, setMaximumSources] = useState(50);
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);
  const [editor, setEditor] = useState<KnowledgeEditor | null>(null);
  const [showUserSidebar, setShowUserSidebar] = useState(
    getDashboardSidebarInitialState,
  );

  const applyWorkspaceKnowledge = useCallback(
    (result: Awaited<ReturnType<typeof voiceApi.workspaceKnowledge>>) => {
      setAgents(result.agents);
      setSources(mergeWorkspaceKnowledge(result.agents, result.sources));
      setMaximumSources(result.maximumSources);
      setSelectedAgentId(
        (current) =>
          current ||
          result.agents.find(
            (agent) =>
              (agent.knowledgeSourceCount ?? 0) > 0 ||
              agent.knowledgeDocuments.length > 0,
          )?._id ||
          result.agents[0]?._id ||
          "",
      );
    },
    [],
  );

  const refreshKnowledge = useCallback(async () => {
    const result = await voiceApi.workspaceKnowledge();
    applyWorkspaceKnowledge(result);
    setError("");
  }, [applyWorkspaceKnowledge]);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/knowledge");
      return;
    }
    let cancelled = false;
    void Promise.all([validateStoredSession(), voiceApi.workspaceKnowledge()])
      .then(([validated, result]) => {
        if (cancelled) return;
        if (!validated) {
          router.replace("/login?next=/dashboard/knowledge");
          return;
        }
        applyWorkspaceKnowledge(result);
        setLoading(false);
      })
      .catch((caught) => {
        if (cancelled) return;
        setError(errorMessage(caught));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applyWorkspaceKnowledge, router, session]);

  const selectedAgent =
    agents.find((agent) => agent._id === selectedAgentId) ?? null;
  const filteredSources = useMemo(() => {
    const term = query.trim().toLowerCase();
    return !term
      ? sources
      : sources.filter((source) =>
          `${source.name} ${source.agentName} ${source.preview} ${source.url} ${source.originalFileName}`
            .toLowerCase()
            .includes(term),
        );
  }, [query, sources]);
  const readyCount = sources.filter(
    (source) => source.status === "ready",
  ).length;
  const issueCount = sources.filter(
    (source) => source.status === "failed",
  ).length;
  const totalChunks = sources.reduce(
    (total, source) => total + source.chunkCount,
    0,
  );
  const selectedAgentSourceCount = sources.filter(
    (source) => source.agentId === selectedAgentId,
  ).length;
  const atCapacity = selectedAgentSourceCount >= maximumSources;

  async function mutate(
    agentId: string,
    action: () => Promise<unknown>,
    message: string,
  ) {
    if (!agentId) return false;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      await refreshKnowledge();
      setNotice(message);
      return true;
    } catch (caught) {
      const message = errorMessage(caught);
      await refreshKnowledge();
      setError(message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function uploadFile(file: File | undefined) {
    if (!file || !selectedAgentId) return;
    if (file.size > 20 * 1024 * 1024) {
      setError("Knowledge files must be 20MB or smaller.");
      return;
    }
    const saved = await mutate(
      selectedAgentId,
      () => voiceApi.addKnowledgeFile(selectedAgentId, file),
      `${file.name} was indexed.`,
    );
    if (saved) setShowAddKnowledge(false);
  }

  async function addWebsite(event: FormEvent) {
    event.preventDefault();
    const value = url.trim();
    if (!value || !selectedAgentId) return;
    const saved = await mutate(
      selectedAgentId,
      () => voiceApi.addKnowledgeUrl(selectedAgentId, { url: value }),
      "Website content was indexed.",
    );
    if (saved) {
      setUrl("");
      setShowAddKnowledge(false);
    }
  }

  async function openEdit(source: KnowledgeSource) {
    const ownedSource = source as DisplayKnowledgeSource;
    if (!ownedSource.agentId) return;
    setBusy(true);
    setError("");
    try {
      const result = await voiceApi.knowledgeSource(
        ownedSource.agentId,
        source._id,
      );
      setEditor({
        sourceId: source._id,
        agentId: ownedSource.agentId,
        name: result.source.name,
        content: result.source.content ?? "",
      });
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  async function saveEditor() {
    if (!editor || !editor.agentId) return;
    const name = editor.name.trim();
    const content = editor.content.trim();
    if (!name || !content) return;
    const sourceId = editor.sourceId;
    const saved = await mutate(
      editor.agentId,
      () =>
        sourceId
          ? voiceApi.updateKnowledgeSource(editor.agentId, sourceId, {
              name,
              content,
            })
          : voiceApi.addKnowledgeText(editor.agentId, { name, content }),
      sourceId
        ? "Knowledge source was updated and re-indexed."
        : "Knowledge text was indexed.",
    );
    if (saved) setEditor(null);
  }

  async function removeSource(source: KnowledgeSource) {
    const ownedSource = source as DisplayKnowledgeSource;
    if (
      !ownedSource.agentId ||
      !window.confirm(`Remove “${source.name}” from ${ownedSource.agentName}?`)
    )
      return;
    await mutate(
      ownedSource.agentId,
      () => voiceApi.deleteKnowledgeSource(ownedSource.agentId, source._id),
      "Knowledge source removed.",
    );
  }

  if (!session) {
    return (
      <main className="app-strong grid min-h-screen place-items-center bg-[#f6f8fc]">
        Loading knowledge base
      </main>
    );
  }

  return (
    <main
      className={`grid min-h-screen bg-[#f6f8fc] text-[#111827] lg:h-screen lg:overflow-hidden ${showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"}`}
    >
      <DashboardSidebar
        activeLabel="Knowledge Base"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => {
          void logoutSession().then(() => router.replace("/login"));
        }}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />

      <section className="min-w-0 overflow-y-auto">
        <DashboardPageHeader
          eyebrow="Retrieval and context"
          title="Knowledge Base"
          description="Manage the indexed sources your voice agents use to answer caller questions."
          actions={
            <button
              className={`${buttonClass} bg-[#6468ff] text-white hover:bg-[#5057e5]`}
              disabled={!selectedAgent || atCapacity}
              onClick={() => {
                setError("");
                setShowAddKnowledge(true);
              }}
              type="button"
            >
              <Icon icon="plus" /> Add knowledge
            </button>
          }
        />

        <div className="mx-auto grid w-full max-w-[1500px] gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid gap-3">
            {notice ? (
              <Notice
                tone="success"
                message={notice}
                onClose={() => setNotice("")}
              />
            ) : null}
            {error && !editor && !showAddKnowledge ? (
              <Notice
                tone="error"
                message={error}
                onClose={() => setError("")}
              />
            ) : null}
          </div>

          <section className="min-w-0 overflow-hidden rounded-lg border border-[#dbe2ea] bg-white shadow-sm">
            <div className="grid gap-4 border-b border-[#edf0f4] p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div>
                <h2 className="app-section-title m-0">All knowledge</h2>
                <p className="app-caption mt-1 mb-0">
                  Every knowledge source added to any voice agent in this
                  workspace.
                </p>
              </div>
              <label className="app-label grid gap-2">
                Search
                <span className="relative">
                  <span className="absolute inset-y-0 left-3 grid place-items-center text-[#94a3b8]">
                    <Icon icon="search" />
                  </span>
                  <input
                    className={`${controlClass} pl-10`}
                    placeholder="Search knowledge or agent"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </span>
              </label>
            </div>

            {!loading && sources.length ? (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#edf0f4] bg-[#fafafe] px-4 py-2.5 sm:px-5">
                <span className="app-caption">
                  <strong className="text-[#111113]">{sources.length}</strong>{" "}
                  total sources
                </span>
                <span className="app-caption">
                  <strong className="text-emerald-700">{readyCount}</strong>{" "}
                  ready
                </span>
                <span className="app-caption">
                  <strong
                    className={issueCount ? "text-rose-600" : "text-[#111113]"}
                  >
                    {issueCount}
                  </strong>{" "}
                  issues
                </span>
                <span className="app-caption">
                  <strong className="text-[#111113]">{totalChunks}</strong>{" "}
                  chunks
                </span>
              </div>
            ) : null}

            {loading ? (
              <div className="grid min-h-52 place-items-center p-10">
                <span className="app-caption">Loading indexed knowledge…</span>
              </div>
            ) : sources.length === 0 ? (
              <div className="mx-auto grid min-h-[360px] max-w-xl place-items-center px-5 py-14 text-center">
                <div className="grid place-items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-lg bg-[#eff0ff] text-[#6468ff]">
                    <Icon icon="file" className="size-5" />
                  </span>
                  <div>
                    <strong className="app-strong block">
                      No knowledge added
                    </strong>
                    <p className="app-caption mt-1 mb-0">
                      Add approved text, a document, or a website to start your
                      workspace library.
                    </p>
                  </div>
                  <button
                    className={`${buttonClass} bg-[#6468ff] text-white hover:bg-[#5057e5]`}
                    disabled={!selectedAgent || atCapacity}
                    onClick={() => setShowAddKnowledge(true)}
                    type="button"
                  >
                    <Icon icon="plus" /> Add knowledge
                  </button>
                </div>
              </div>
            ) : filteredSources.length === 0 ? (
              <div className="grid min-h-52 place-items-center p-10 text-center">
                <div>
                  <strong className="app-strong block">
                    No matching source
                  </strong>
                  <span className="app-caption mt-1 block">
                    Try a different filter.
                  </span>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-[#edf0f4]">
                {filteredSources.map((source) => (
                  <li
                    className="grid gap-3 p-4 transition hover:bg-[#fbfdff] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5"
                    key={`${source.agentId}-${source._id}`}
                  >
                    <div className="flex min-w-0 gap-3">
                      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-lg border border-[#c9ccef] bg-[#eff0ff] text-[#5057e5]">
                        <Icon
                          icon={source.sourceType === "url" ? "link" : "file"}
                        />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <strong className="app-strong truncate">
                            {source.name}
                          </strong>
                          <span
                            className={`app-label rounded-lg px-2.5 py-1 ${statusStyle(source.status)}`}
                          >
                            {source.status}
                          </span>
                          <span className="app-label inline-flex items-center gap-1.5 rounded-lg bg-[#eff0ff] px-2.5 py-1 text-[#5057e5]">
                            <Icon icon="user" className="size-3.5" />
                            {source.agentName}
                          </span>
                          <span className="app-label rounded-lg bg-[#f8fafc] px-2.5 py-1 text-[#64748b]">
                            {sourceTypeLabel(source)}
                          </span>
                          <span className="app-label rounded-lg bg-[#f8fafc] px-2.5 py-1 text-[#64748b]">
                            {source.chunkCount} chunks
                          </span>
                        </div>
                        <p className="app-caption mt-1 mb-0 max-w-4xl text-[#64748b]">
                          {source.error ||
                            preview(source.preview) ||
                            source.url ||
                            source.originalFileName}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      {source.attachedLegacy ? (
                        <span className="app-label inline-flex min-h-9 items-center rounded-lg bg-[#eff0ff] px-3 text-[#5057e5]">
                          Attached to agent
                        </span>
                      ) : (
                        <>
                          <button
                            className={`app-label min-h-9 rounded-lg px-3 transition ${source.status === "ready" ? "bg-[#ecfdf5] text-[#047857] hover:bg-[#d1fae5]" : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"}`}
                            disabled={busy || source.status === "processing"}
                            onClick={() =>
                              void mutate(
                                source.agentId,
                                () =>
                                  voiceApi.updateKnowledgeSource(
                                    source.agentId,
                                    source._id,
                                    {
                                      status:
                                        source.status === "ready"
                                          ? "disabled"
                                          : "ready",
                                    },
                                  ),
                                source.status === "ready"
                                  ? "Knowledge source disabled."
                                  : "Knowledge source indexed and enabled.",
                              )
                            }
                            type="button"
                          >
                            {source.status === "ready" ? "Turn off" : "Turn on"}
                          </button>
                          {source.sourceType === "url" ||
                          source.status === "failed" ? (
                            <ActionButton
                              label={`Re-index ${source.name}`}
                              icon="refresh"
                              busy={busy}
                              onClick={() =>
                                void mutate(
                                  source.agentId,
                                  () =>
                                    voiceApi.reindexKnowledgeSource(
                                      source.agentId,
                                      source._id,
                                    ),
                                  "Knowledge source was re-indexed.",
                                )
                              }
                            />
                          ) : null}
                          {["text", "legacy"].includes(source.sourceType) ? (
                            <ActionButton
                              label={`Edit ${source.name}`}
                              icon="edit"
                              busy={busy}
                              onClick={() => void openEdit(source)}
                            />
                          ) : null}
                          <ActionButton
                            label={`Remove ${source.name}`}
                            icon="trash"
                            busy={busy}
                            danger
                            onClick={() => void removeSource(source)}
                          />
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>

      {showAddKnowledge ? (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/35 p-3 backdrop-blur-[6px] sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-knowledge-title"
          onMouseDown={() => {
            if (!busy) {
              setShowAddKnowledge(false);
              setError("");
            }
          }}
        >
          <section
            className="grid max-h-[calc(100dvh-2rem)] w-full max-w-[640px] overflow-y-auto rounded-xl border border-[#dedee8] bg-white"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#dedee8] px-5 py-4 sm:px-6">
              <div>
                <span className="app-label text-[#5057e5]">Knowledge base</span>
                <h2
                  className="app-page-title mt-1 mb-0"
                  id="add-knowledge-title"
                >
                  Add knowledge
                </h2>
                <p className="app-caption mt-1 mb-0">
                  Choose one source type. Content is indexed automatically.
                </p>
              </div>
              <button
                className="grid size-9 place-items-center rounded-lg border border-[#dedee8] bg-white text-[#6b6f80] hover:border-[#6468ff] hover:text-[#5057e5]"
                disabled={busy}
                onClick={() => {
                  setShowAddKnowledge(false);
                  setError("");
                }}
                type="button"
                aria-label="Close"
              >
                <Icon icon="close" />
              </button>
            </header>
            <div className="grid gap-4 p-5 sm:p-6">
              {error ? (
                <Notice
                  tone="error"
                  message={error}
                  onClose={() => setError("")}
                />
              ) : null}
              <label className="app-label grid gap-2">
                Use with voice agent
                <select
                  className={controlClass}
                  disabled={busy || loading}
                  value={selectedAgentId}
                  onChange={(event) => {
                    setError("");
                    setSelectedAgentId(event.target.value);
                  }}
                >
                  {agents.map((agent) => {
                    const count = sources.filter(
                      (source) => source.agentId === agent._id,
                    ).length;
                    return (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                        {count ? ` (${count} connected)` : ""}
                      </option>
                    );
                  })}
                </select>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  className="flex min-h-24 items-center gap-3 rounded-lg border border-[#dedee8] bg-white p-4 text-left transition hover:border-[#6468ff] hover:bg-[#fafafe]"
                  disabled={!selectedAgent || busy || atCapacity}
                  onClick={() => {
                    setShowAddKnowledge(false);
                    setEditor({
                      sourceId: "",
                      agentId: selectedAgentId,
                      name: "",
                      content: "",
                    });
                  }}
                  type="button"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eff0ff] text-[#5057e5]">
                    <Icon icon="plus" />
                  </span>
                  <span>
                    <strong className="app-strong block">Add text</strong>
                    <span className="app-caption mt-1 block">
                      Policies, FAQs, and approved answers
                    </span>
                  </span>
                </button>
                <label
                  className={`flex min-h-24 items-center gap-3 rounded-lg border border-[#dedee8] bg-white p-4 text-left transition hover:border-[#6468ff] hover:bg-[#fafafe] ${busy || atCapacity ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                >
                  <input
                    className="sr-only"
                    type="file"
                    accept={acceptedFiles}
                    disabled={busy || atCapacity}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      void uploadFile(file);
                    }}
                  />
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eff0ff] text-[#5057e5]">
                    <Icon icon="upload" />
                  </span>
                  <span>
                    <strong className="app-strong block">Upload file</strong>
                    <span className="app-caption mt-1 block">
                      PDF, DOCX, TXT, CSV, JSON, HTML, or XML
                    </span>
                  </span>
                </label>
              </div>

              <form
                className="grid gap-3 rounded-lg border border-[#dedee8] bg-[#fafafe] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
                onSubmit={(event) => void addWebsite(event)}
              >
                <label className="app-label grid gap-2">
                  Website URL
                  <input
                    className={controlClass}
                    placeholder="https://example.com/help"
                    type="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                  />
                </label>
                <button
                  className={`${buttonClass} border border-[#c9ccef] bg-white text-[#5057e5] hover:bg-[#eff0ff]`}
                  disabled={busy || atCapacity || !url.trim()}
                  type="submit"
                >
                  <Icon icon="link" /> Index website
                </button>
              </form>
              <p className="app-caption m-0 text-center">
                Files can be up to 20MB. You can edit, disable, re-index, or
                remove sources later.
              </p>
            </div>
          </section>
        </div>
      ) : null}
      {editor ? (
        <TextEditorModal
          editor={editor}
          busy={busy}
          error={error}
          onChange={setEditor}
          onClose={() => {
            setEditor(null);
            setError("");
          }}
          onSave={() => void saveEditor()}
        />
      ) : null}
    </main>
  );
}

function ActionButton({
  busy,
  danger = false,
  icon,
  label,
  onClick,
}: {
  busy: boolean;
  danger?: boolean;
  icon: IconName;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`grid size-9 place-items-center rounded-lg border bg-white transition ${danger ? "border-[#fecaca] text-[#dc2626] hover:bg-[#fff1f2]" : "border-[#d5d8df] text-[#475569] hover:bg-[#f8fafc] hover:text-[#111827]"}`}
      disabled={busy}
      onClick={onClick}
      type="button"
      aria-label={label}
    >
      <Icon icon={icon} />
    </button>
  );
}

function TextEditorModal({
  busy,
  editor,
  error,
  onChange,
  onClose,
  onSave,
}: {
  busy: boolean;
  editor: KnowledgeEditor;
  error: string;
  onChange: (value: KnowledgeEditor) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className="dashboard-home-theme fixed inset-0 z-50 grid place-items-center bg-black/80 p-3 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={editor.sourceId ? "Edit knowledge" : "Add knowledge"}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="grid max-h-[calc(100vh-24px)] w-full max-w-2xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-white/10 bg-[#ffffff] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-white/10 bg-[#ffffff] px-5 py-4 sm:px-6">
          <div>
            <h2 className="app-page-title m-0">
              {editor.sourceId ? "Edit knowledge" : "Add text knowledge"}
            </h2>
            <p className="app-caption mt-1 mb-0">
              Saving creates fresh searchable chunks and embeddings.
            </p>
          </div>
          <button
            className="grid size-9 place-items-center rounded-lg border border-white/10 text-white/60 hover:bg-white/[0.08] hover:text-white"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <Icon icon="close" />
          </button>
        </header>
        <div className="grid gap-4 overflow-y-auto px-5 py-5 sm:px-6">
          {error ? (
            <div className="app-body rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-[#b91c1c]">
              {error}
            </div>
          ) : null}
          <label className="app-label grid gap-2">
            Title
            <input
              className={controlClass}
              maxLength={200}
              placeholder="Pricing and refunds"
              value={editor.name}
              onChange={(event) =>
                onChange({ ...editor, name: event.target.value })
              }
            />
          </label>
          <label className="app-label grid gap-2">
            Knowledge text
            <textarea
              className="app-control-text min-h-80 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 outline-none focus:border-[#6468ff] focus:ring-4 focus:ring-[#6468ff]/10"
              placeholder="Add approved facts, policies, FAQs, and procedures…"
              value={editor.content}
              onChange={(event) =>
                onChange({ ...editor, content: event.target.value })
              }
            />
          </label>
        </div>
        <footer className="flex justify-end gap-2 border-t border-[#e5e7eb] px-5 py-4 sm:px-6">
          <button
            className={`${buttonClass} border border-[#d5d8df] bg-white text-[#334155] hover:bg-[#f8fafc]`}
            disabled={busy}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`${buttonClass} bg-[#6468ff] text-white hover:bg-[#5057e5]`}
            disabled={busy || !editor.name.trim() || !editor.content.trim()}
            onClick={onSave}
            type="button"
          >
            <Icon icon="check" />
            {busy ? "Indexing…" : "Save and index"}
          </button>
        </footer>
      </section>
    </div>
  );
}

function Notice({
  message,
  onClose,
  tone,
}: {
  message: string;
  onClose: () => void;
  tone: "error" | "success";
}) {
  const success = tone === "success";
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 ${success ? "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]" : "border-[#fecaca] bg-[#fff1f2] text-[#b91c1c]"}`}
    >
      <span className="app-body">{message}</span>
      <button
        className="grid size-6 place-items-center rounded-md hover:bg-black/5"
        onClick={onClose}
        type="button"
        aria-label="Dismiss"
      >
        <Icon icon="close" className="size-3.5" />
      </button>
    </div>
  );
}
