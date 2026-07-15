"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import {
  voiceApi,
  type BackendAgent,
  type KnowledgeSearchResult,
  type KnowledgeSource,
} from "@/lib/voice";

type IconName = "check" | "close" | "edit" | "file" | "link" | "plus" | "refresh" | "search" | "spark" | "trash" | "upload" | "user";

const buttonClass = "app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 transition disabled:cursor-not-allowed disabled:opacity-50";
const controlClass = "app-control-text min-h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#00b8c4] focus:ring-4 focus:ring-[#00b8c4]/10";
const acceptedFiles = ".pdf,.docx,.txt,.md,.csv,.json,.html,.htm,.xml,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,text/csv,application/json,text/html,application/xml";

function Icon({ icon, className = "size-4" }: { icon: IconName; className?: string }) {
  const props = { className: `${className} fill-none stroke-current stroke-2`, viewBox: "0 0 24 24", "aria-hidden": true };
  if (icon === "check") return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  if (icon === "close") return <svg {...props}><path d="M6 6 18 18M18 6 6 18" /></svg>;
  if (icon === "edit") return <svg {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>;
  if (icon === "file") return <svg {...props}><path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M8 13h8M8 17h5" /></svg>;
  if (icon === "link") return <svg {...props}><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" /></svg>;
  if (icon === "plus") return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
  if (icon === "refresh") return <svg {...props}><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 9a7 7 0 0 1 11.5-2L20 9M4 15l2.4 2A7 7 0 0 0 18 15" /></svg>;
  if (icon === "search") return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  if (icon === "spark") return <svg {...props}><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z" /></svg>;
  if (icon === "trash") return <svg {...props}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>;
  if (icon === "upload") return <svg {...props}><path d="M12 15V3m0 0 4 4m-4-4-4 4" /><path d="M4 17v3h16v-3" /></svg>;
  return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The request could not be completed.";
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

export function KnowledgeBaseShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [agents, setAgents] = useState<BackendAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [maximumSources, setMaximumSources] = useState(50);
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState<{ sourceId: string; name: string; content: string } | null>(null);
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [testQuestion, setTestQuestion] = useState("");
  const [testResults, setTestResults] = useState<KnowledgeSearchResult[] | null>(null);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/knowledge");
      return;
    }
    let cancelled = false;
    void Promise.all([validateStoredSession(), voiceApi.agents()])
      .then(([validated, result]) => {
        if (cancelled) return;
        if (!validated) {
          router.replace("/login?next=/dashboard/knowledge");
          return;
        }
        setAgents(result.agents);
        setSelectedAgentId((current) => current || result.agents[0]?._id || "");
      })
      .catch((caught) => !cancelled && setError(errorMessage(caught)));
    return () => { cancelled = true; };
  }, [router, session]);

  const loadSources = useCallback(async (agentId: string) => {
    if (!agentId) {
      setSources([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await voiceApi.knowledgeSources(agentId);
      setSources(result.sources);
      setMaximumSources(result.maximumSources);
      setError("");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedAgentId) return;
    let cancelled = false;
    void voiceApi.knowledgeSources(selectedAgentId)
      .then((result) => {
        if (cancelled) return;
        setSources(result.sources);
        setMaximumSources(result.maximumSources);
        setError("");
      })
      .catch((caught) => !cancelled && setError(errorMessage(caught)))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [selectedAgentId]);

  const selectedAgent = agents.find((agent) => agent._id === selectedAgentId) ?? null;
  const filteredSources = useMemo(() => {
    const term = query.trim().toLowerCase();
    return !term ? sources : sources.filter((source) =>
      `${source.name} ${source.preview} ${source.url} ${source.originalFileName}`.toLowerCase().includes(term),
    );
  }, [query, sources]);
  const readyCount = sources.filter((source) => source.status === "ready").length;
  const issueCount = sources.filter((source) => source.status === "failed").length;
  const totalChunks = sources.reduce((total, source) => total + source.chunkCount, 0);
  const atCapacity = sources.length >= maximumSources;

  async function mutate(action: () => Promise<unknown>, message: string) {
    if (!selectedAgentId) return false;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      await loadSources(selectedAgentId);
      setNotice(message);
      return true;
    } catch (caught) {
      const message = errorMessage(caught);
      await loadSources(selectedAgentId);
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
    await mutate(() => voiceApi.addKnowledgeFile(selectedAgentId, file), `${file.name} was indexed.`);
  }

  async function addWebsite(event: FormEvent) {
    event.preventDefault();
    const value = url.trim();
    if (!value || !selectedAgentId) return;
    const saved = await mutate(() => voiceApi.addKnowledgeUrl(selectedAgentId, { url: value }), "Website content was indexed.");
    if (saved) setUrl("");
  }

  async function openEdit(source: KnowledgeSource) {
    if (!selectedAgentId) return;
    setBusy(true);
    setError("");
    try {
      const result = await voiceApi.knowledgeSource(selectedAgentId, source._id);
      setEditor({ sourceId: source._id, name: result.source.name, content: result.source.content ?? "" });
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  async function saveEditor() {
    if (!editor || !selectedAgentId) return;
    const name = editor.name.trim();
    const content = editor.content.trim();
    if (!name || !content) return;
    const sourceId = editor.sourceId;
    const saved = await mutate(
      () => sourceId
        ? voiceApi.updateKnowledgeSource(selectedAgentId, sourceId, { name, content })
        : voiceApi.addKnowledgeText(selectedAgentId, { name, content }),
      sourceId ? "Knowledge source was updated and re-indexed." : "Knowledge text was indexed.",
    );
    if (saved) setEditor(null);
  }

  async function removeSource(source: KnowledgeSource) {
    if (!selectedAgentId || !window.confirm(`Remove “${source.name}” from this agent?`)) return;
    await mutate(() => voiceApi.deleteKnowledgeSource(selectedAgentId, source._id), "Knowledge source removed.");
  }

  async function testRetrieval(event: FormEvent) {
    event.preventDefault();
    const question = testQuestion.trim();
    if (!question || !selectedAgentId) return;
    setBusy(true);
    setError("");
    try {
      const result = await voiceApi.testKnowledgeSearch(selectedAgentId, question);
      setTestResults(result.results);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  if (!session) {
    return <main className="app-strong grid min-h-screen place-items-center bg-[#f6f8fc]">Loading knowledge base</main>;
  }

  return (
    <main className={`grid min-h-screen bg-[#f6f8fc] text-[#111827] lg:h-screen lg:overflow-hidden ${showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"}`}>
      <DashboardSidebar
        activeLabel="Knowledge Base"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => { void logoutSession().then(() => router.replace("/login")); }}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />

      <section className="min-w-0 overflow-y-auto">
        <header className="border-b border-[#99f6e8] bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-1500px flex-wrap items-center justify-between gap-4">
            <div>
              <span className="app-label text-[#00b8c4]">Knowledge Base</span>
              <h1 className="m-0 text-xl font-semibold leading-7 text-[#0f172a]">Retrieval studio</h1>
              <p className="app-caption mt-1 mb-0 text-[#475569]">Indexed sources retrieved automatically for every caller question.</p>
            </div>
            <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-4">
              {[
                ["Sources", `${sources.length}/${maximumSources}`],
                ["Ready", readyCount.toLocaleString("en-IN")],
                ["Issues", issueCount.toLocaleString("en-IN")],
                ["Chunks", totalChunks.toLocaleString("en-IN")],
              ].map(([label, value]) => (
                <div className="rounded-lg border border-[#99f6e8] bg-[#ecfeff] px-3 py-2 text-[#008996]" key={label}>
                  <span className="app-caption block text-current">{label}</span>
                  <strong className="block text-sm font-semibold leading-5">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-1500px gap-5 p-4 sm:p-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:p-8">
          <div className="grid gap-3 lg:col-span-2">
            {notice ? <Notice tone="success" message={notice} onClose={() => setNotice("")} /> : null}
            {error && !editor ? <Notice tone="error" message={error} onClose={() => setError("")} /> : null}
          </div>

          <aside className="grid content-start gap-5">
            <section className="overflow-hidden rounded-lg border border-[#dbe2ea] bg-white shadow-sm">
              <div className="border-b border-[#edf0f4] bg-[#fbfdff] p-4">
                <h2 className="app-section-title m-0">Add knowledge</h2>
                <p className="app-caption mt-1 mb-0">Content is chunked and indexed after upload.</p>
              </div>
              <div className="grid gap-4 p-4">
                <label className="app-label grid gap-2">
                  Agent
                  <select className={controlClass} disabled={busy || loading} value={selectedAgentId} onChange={(event) => { setLoading(true); setQuery(""); setTestResults(null); setSelectedAgentId(event.target.value); }}>
                    {agents.map((agent) => <option key={agent._id} value={agent._id}>{agent.name}</option>)}
                  </select>
                </label>
                <button className={`${buttonClass} bg-[#00b8c4] text-white hover:bg-[#008996]`} disabled={!selectedAgent || busy || atCapacity} onClick={() => setEditor({ sourceId: "", name: "", content: "" })} type="button">
                  <Icon icon="plus" /> Add text
                </button>
                <label className={`${buttonClass} relative cursor-pointer border border-[#99f6e8] bg-[#ecfeff] text-[#008996] hover:bg-[#ccfbf1] ${busy || atCapacity ? "pointer-events-none opacity-50" : ""}`}>
                  <input className="absolute inset-0 cursor-pointer opacity-0" type="file" accept={acceptedFiles} disabled={busy || atCapacity} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void uploadFile(file); }} />
                  <Icon icon="upload" /> Upload file
                </label>
                <p className="app-caption m-0 rounded-lg bg-[#f8fafc] px-3 py-2 text-[#475569]">PDF, DOCX, TXT, Markdown, CSV, JSON, HTML or XML up to 20MB.</p>
                <form className="grid gap-2 border-t border-[#edf0f4] pt-4" onSubmit={(event) => void addWebsite(event)}>
                  <label className="app-label grid gap-2">Website URL<input className={controlClass} placeholder="https://example.com/help" type="url" value={url} onChange={(event) => setUrl(event.target.value)} /></label>
                  <button className={`${buttonClass} border border-[#d5d8df] bg-white text-[#334155] hover:bg-[#f8fafc]`} disabled={busy || atCapacity || !url.trim()} type="submit"><Icon icon="link" /> Index website</button>
                </form>
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-[#dbe2ea] bg-white shadow-sm">
              <div className="border-b border-[#edf0f4] bg-[#fbfdff] p-4">
                <h2 className="app-section-title m-0">Test retrieval</h2>
                <p className="app-caption mt-1 mb-0">See the excerpts the voice agent receives.</p>
              </div>
              <form className="grid gap-3 p-4" onSubmit={(event) => void testRetrieval(event)}>
                <textarea className="app-control-text min-h-24 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 outline-none focus:border-[#00b8c4] focus:ring-4 focus:ring-[#00b8c4]/10" placeholder="What is our refund policy?" value={testQuestion} onChange={(event) => setTestQuestion(event.target.value)} />
                <button className={`${buttonClass} bg-[#0f172a] text-white hover:bg-[#1e293b]`} disabled={busy || !testQuestion.trim() || readyCount === 0} type="submit"><Icon icon="spark" /> Search knowledge</button>
              </form>
              {testResults ? (
                <div className="grid gap-2 border-t border-[#edf0f4] p-4">
                  {testResults.length ? testResults.map((result, index) => (
                    <div className="rounded-lg border border-[#dbe2ea] bg-[#f8fafc] p-3" key={`${result.sourceId}-${index}`}>
                      <div className="flex items-center justify-between gap-2"><strong className="app-label text-[#0f172a]">{result.sourceName}</strong><span className="app-caption">{Math.round(result.score * 100)}% match</span></div>
                      <p className="app-caption mt-2 mb-0 text-[#475569]">{preview(result.content)}</p>
                    </div>
                  )) : <p className="app-caption m-0 rounded-lg bg-[#fff7ed] p-3 text-[#9a3412]">No relevant source was found. The agent will avoid guessing.</p>}
                </div>
              ) : null}
            </section>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-lg border border-[#dbe2ea] bg-white shadow-sm">
            <div className="grid gap-4 border-b border-[#edf0f4] p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,360px)] lg:items-end">
              <div><h2 className="app-section-title m-0">{selectedAgent?.name ?? "Knowledge sources"}</h2><p className="app-caption mt-1 mb-0">{filteredSources.length} shown / {sources.length} total</p></div>
              <label className="app-label grid gap-2">Filter sources<span className="relative"><span className="absolute inset-y-0 left-3 grid place-items-center text-[#94a3b8]"><Icon icon="search" /></span><input className={`${controlClass} pl-10`} placeholder="Search sources" value={query} onChange={(event) => setQuery(event.target.value)} /></span></label>
            </div>

            {loading ? (
              <div className="grid min-h-52 place-items-center p-10"><span className="app-caption">Loading indexed knowledge…</span></div>
            ) : sources.length === 0 ? (
              <div className="mx-auto grid max-w-xl place-items-center gap-4 px-5 py-14 text-center"><span className="grid size-12 place-items-center rounded-lg bg-[#ecfeff] text-[#00b8c4]"><Icon icon="file" className="size-5" /></span><div><strong className="app-strong block">No indexed knowledge yet</strong><p className="app-caption mt-1 mb-0">Add approved text, a document, or a website. The agent retrieves only relevant excerpts during calls.</p></div></div>
            ) : filteredSources.length === 0 ? (
              <div className="grid min-h-52 place-items-center p-10 text-center"><div><strong className="app-strong block">No matching source</strong><span className="app-caption mt-1 block">Try a different filter.</span></div></div>
            ) : (
              <ul className="divide-y divide-[#edf0f4]">
                {filteredSources.map((source) => (
                  <li className="grid gap-3 p-4 transition hover:bg-[#fbfdff] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5" key={source._id}>
                    <div className="flex min-w-0 gap-3">
                      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-lg border border-[#99f6e8] bg-[#ecfeff] text-[#008996]"><Icon icon={source.sourceType === "url" ? "link" : "file"} /></span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2"><strong className="app-strong truncate">{source.name}</strong><span className={`app-label rounded-lg px-2.5 py-1 ${statusStyle(source.status)}`}>{source.status}</span><span className="app-label rounded-lg bg-[#f8fafc] px-2.5 py-1 text-[#64748b]">{sourceTypeLabel(source)}</span><span className="app-label rounded-lg bg-[#f8fafc] px-2.5 py-1 text-[#64748b]">{source.chunkCount} chunks</span></div>
                        <p className="app-caption mt-1 mb-0 max-w-4xl text-[#64748b]">{source.error || preview(source.preview) || source.url || source.originalFileName}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <button className={`app-label min-h-9 rounded-lg px-3 transition ${source.status === "ready" ? "bg-[#ecfdf5] text-[#047857] hover:bg-[#d1fae5]" : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"}`} disabled={busy || source.status === "processing"} onClick={() => void mutate(() => voiceApi.updateKnowledgeSource(selectedAgentId, source._id, { status: source.status === "ready" ? "disabled" : "ready" }), source.status === "ready" ? "Knowledge source disabled." : "Knowledge source indexed and enabled.")} type="button">{source.status === "ready" ? "Turn off" : "Turn on"}</button>
                      {(source.sourceType === "url" || source.status === "failed") ? <ActionButton label={`Re-index ${source.name}`} icon="refresh" busy={busy} onClick={() => void mutate(() => voiceApi.reindexKnowledgeSource(selectedAgentId, source._id), "Knowledge source was re-indexed.")} /> : null}
                      {(["text", "legacy"].includes(source.sourceType)) ? <ActionButton label={`Edit ${source.name}`} icon="edit" busy={busy} onClick={() => void openEdit(source)} /> : null}
                      <ActionButton label={`Remove ${source.name}`} icon="trash" busy={busy} danger onClick={() => void removeSource(source)} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>

      {editor ? <TextEditorModal editor={editor} busy={busy} error={error} onChange={setEditor} onClose={() => { setEditor(null); setError(""); }} onSave={() => void saveEditor()} /> : null}
    </main>
  );
}

function ActionButton({ busy, danger = false, icon, label, onClick }: { busy: boolean; danger?: boolean; icon: IconName; label: string; onClick: () => void }) {
  return <button className={`grid size-9 place-items-center rounded-lg border bg-white transition ${danger ? "border-[#fecaca] text-[#dc2626] hover:bg-[#fff1f2]" : "border-[#d5d8df] text-[#475569] hover:bg-[#f8fafc] hover:text-[#111827]"}`} disabled={busy} onClick={onClick} type="button" aria-label={label}><Icon icon={icon} /></button>;
}

function TextEditorModal({ busy, editor, error, onChange, onClose, onSave }: { busy: boolean; editor: { sourceId: string; name: string; content: string }; error: string; onChange: (value: { sourceId: string; name: string; content: string }) => void; onClose: () => void; onSave: () => void }) {
  return (
    <div className="dashboard-home-theme fixed inset-0 z-50 grid place-items-center bg-black/80 p-3 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label={editor.sourceId ? "Edit knowledge" : "Add knowledge"} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="grid max-h-[calc(100vh-24px)] w-full max-w-2xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-white/10 bg-[#07110f] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-white/10 bg-[#061b18] px-5 py-4 sm:px-6"><div><h2 className="app-page-title m-0">{editor.sourceId ? "Edit knowledge" : "Add text knowledge"}</h2><p className="app-caption mt-1 mb-0">Saving creates fresh searchable chunks and embeddings.</p></div><button className="grid size-9 place-items-center rounded-lg border border-white/10 text-white/60 hover:bg-white/[0.08] hover:text-white" onClick={onClose} type="button" aria-label="Close"><Icon icon="close" /></button></header>
        <div className="grid gap-4 overflow-y-auto px-5 py-5 sm:px-6">
          {error ? <div className="app-body rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-[#b91c1c]">{error}</div> : null}
          <label className="app-label grid gap-2">Title<input className={controlClass} maxLength={200} placeholder="Pricing and refunds" value={editor.name} onChange={(event) => onChange({ ...editor, name: event.target.value })} /></label>
          <label className="app-label grid gap-2">Knowledge text<textarea className="app-control-text min-h-80 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 outline-none focus:border-[#00b8c4] focus:ring-4 focus:ring-[#00b8c4]/10" placeholder="Add approved facts, policies, FAQs, and procedures…" value={editor.content} onChange={(event) => onChange({ ...editor, content: event.target.value })} /></label>
        </div>
        <footer className="flex justify-end gap-2 border-t border-[#e5e7eb] px-5 py-4 sm:px-6"><button className={`${buttonClass} border border-[#d5d8df] bg-white text-[#334155] hover:bg-[#f8fafc]`} disabled={busy} onClick={onClose} type="button">Cancel</button><button className={`${buttonClass} bg-[#00b8c4] text-white hover:bg-[#008996]`} disabled={busy || !editor.name.trim() || !editor.content.trim()} onClick={onSave} type="button"><Icon icon="check" />{busy ? "Indexing…" : "Save and index"}</button></footer>
      </section>
    </div>
  );
}

function Notice({ message, onClose, tone }: { message: string; onClose: () => void; tone: "error" | "success" }) {
  const success = tone === "success";
  return <div className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 ${success ? "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]" : "border-[#fecaca] bg-[#fff1f2] text-[#b91c1c]"}`}><span className="app-body">{message}</span><button className="grid size-6 place-items-center rounded-md hover:bg-black/5" onClick={onClose} type="button" aria-label="Dismiss"><Icon icon="close" className="size-3.5" /></button></div>;
}
