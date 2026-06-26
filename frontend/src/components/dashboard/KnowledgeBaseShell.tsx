"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import { voiceApi, type BackendAgent, type KnowledgeDocument } from "@/lib/voice";

type IconName = "check" | "close" | "edit" | "file" | "plus" | "search" | "trash" | "upload" | "user";
type DocumentWithIndex = { document: KnowledgeDocument; index: number };

const maxKnowledgeFiles = 20;
const maxUploadBytes = 300 * 1024;
const buttonClass =
  "app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 transition disabled:cursor-not-allowed disabled:opacity-50";
const controlClass =
  "app-control-text min-h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10";
const documentTones = [
  "border-[#a5f3fc] bg-[#ecfeff] text-[#0891b2]",
  "border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1]",
  "border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1]",
  "border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1]",
  "border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1]",
];

function Icon({ icon, className = "size-4" }: { icon: IconName; className?: string }) {
  const props = {
    className: `${className} fill-none stroke-current stroke-2`,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  if (icon === "check") return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  if (icon === "close") return <svg {...props}><path d="M6 6 18 18M18 6 6 18" /></svg>;
  if (icon === "edit") return <svg {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>;
  if (icon === "file") return <svg {...props}><path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M8 13h8M8 17h5" /></svg>;
  if (icon === "plus") return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
  if (icon === "search") return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
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

function previewText(content: string) {
  const clean = content.replace(/\s+/g, " ").trim();
  return clean.length > 160 ? `${clean.slice(0, 160)}...` : clean;
}

function fileNameToTitle(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
}

function characterCount(content: string) {
  return content.trim().length.toLocaleString("en-IN");
}

export function KnowledgeBaseShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [agents, setAgents] = useState<BackendAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/knowledge");
      return;
    }

    let cancelled = false;
    void (async () => {
      const validatedSession = await validateStoredSession();
      if (!validatedSession) {
        if (!cancelled) router.replace("/login?next=/dashboard/knowledge");
        return;
      }
      const result = await voiceApi.agents();
      if (cancelled) return;
      setAgents(result.agents);
      setSelectedAgentId((current) => current || result.agents[0]?._id || "");
      setError("");
    })()
      .catch((caught) => {
        if (!cancelled) setError(errorMessage(caught));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [router, session]);

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent._id === selectedAgentId) ?? agents[0] ?? null,
    [agents, selectedAgentId],
  );
  const documents = useMemo(
    () => selectedAgent?.knowledgeDocuments ?? [],
    [selectedAgent?.knowledgeDocuments],
  );
  const filteredDocuments = useMemo<DocumentWithIndex[]>(() => {
    const search = query.trim().toLowerCase();
    return documents
      .map((document, index) => ({ document, index }))
      .filter(({ document }) => !search || `${document.name} ${document.content}`.toLowerCase().includes(search));
  }, [documents, query]);
  const readyCount = documents.filter((document) => document.status === "ready").length;
  const disabledCount = Math.max(0, documents.length - readyCount);
  const totalCharacters = documents.reduce((total, document) => total + document.content.trim().length, 0);
  const knowledgeLimitReached = documents.length >= maxKnowledgeFiles;
  const selectedAgentName = selectedAgent?.name ?? "Selected agent";
  const libraryStatTone = "border-[#bae6fd] bg-[#f0f9ff] text-[#0369a1]";
  const libraryStats = [
    { label: "Items", value: `${documents.length}/${maxKnowledgeFiles}`, tone: libraryStatTone },
    { label: "Active", value: readyCount.toLocaleString("en-IN"), tone: libraryStatTone },
    { label: "Off", value: disabledCount.toLocaleString("en-IN"), tone: libraryStatTone },
    { label: "Characters", value: totalCharacters.toLocaleString("en-IN"), tone: libraryStatTone },
  ];

  function clearEditor() {
    setDocumentName("");
    setDocumentContent("");
    setUploadedFileName("");
    setEditingIndex(null);
  }

  function openNewDocument() {
    clearEditor();
    setEditorOpen(true);
    setError("");
    setNotice("");
  }

  function openEditDocument(index: number) {
    const document = documents[index];
    if (!document) return;
    setDocumentName(document.name);
    setDocumentContent(document.content);
    setUploadedFileName("");
    setEditingIndex(index);
    setEditorOpen(true);
    setError("");
    setNotice("");
  }

  function closeEditor() {
    setEditorOpen(false);
    clearEditor();
  }

  async function saveDocuments(nextDocuments: KnowledgeDocument[], message: string) {
    if (!selectedAgent) return false;
    setSaving(true);
    setNotice("");
    setError("");
    try {
      const { agent } = await voiceApi.saveAgent(selectedAgent._id, { knowledgeDocuments: nextDocuments });
      setAgents((current) => current.map((item) => (item._id === agent._id ? agent : item)));
      setNotice(message);
      return true;
    } catch (caught) {
      setError(errorMessage(caught));
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function saveEditor() {
    if (!selectedAgent) return;
    const name = documentName.trim();
    const content = documentContent.trim();
    if (!name || !content) {
      setError("Add a title and the knowledge text.");
      return;
    }
    if (editingIndex === null && documents.length >= maxKnowledgeFiles) {
      setError(`This agent already has ${maxKnowledgeFiles} knowledge items.`);
      return;
    }

    const nextDocument: KnowledgeDocument = {
      name,
      content,
      status: editingIndex === null ? "ready" : documents[editingIndex]?.status ?? "ready",
    };
    const nextDocuments =
      editingIndex === null
        ? [...documents, nextDocument]
        : documents.map((document, index) => (index === editingIndex ? nextDocument : document));
    const saved = await saveDocuments(nextDocuments, editingIndex === null ? "Knowledge added." : "Knowledge updated.");
    if (saved) closeEditor();
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (file.size > maxUploadBytes) {
      setError("File is too large. Upload a plain text file under 300KB.");
      return;
    }
    const allowed = /\.(txt|md|csv|json)$/i.test(file.name);
    if (!allowed) {
      setError("Upload a .txt, .md, .csv, or .json file.");
      return;
    }
    try {
      const text = await file.text();
      if (!text.trim()) {
        setError("This file is empty.");
        return;
      }
      setUploadedFileName(file.name);
      setDocumentName((current) => current || fileNameToTitle(file.name));
      setDocumentContent(text);
    } catch {
      setError("Could not read this file.");
    }
  }

  async function openUploadEditor(file: File | undefined) {
    if (!file) return;
    clearEditor();
    setEditorOpen(true);
    await handleFile(file);
  }

  function removeDocument(index: number) {
    const document = documents[index];
    if (!document) return;
    if (!window.confirm(`Remove "${document.name}" from ${selectedAgentName}?`)) return;
    void saveDocuments(documents.filter((_, documentIndex) => documentIndex !== index), "Knowledge removed.");
  }

  function toggleDocument(index: number) {
    void saveDocuments(
      documents.map((document, documentIndex) =>
        documentIndex === index
          ? { ...document, status: document.status === "ready" ? "disabled" : "ready" }
          : document,
      ),
      "Knowledge updated.",
    );
  }

  if (!session) {
    return <main className="app-strong grid min-h-screen place-items-center bg-[#f6f8fc]">Loading knowledge base</main>;
  }

  return (
    <main className="grid min-h-screen bg-[#f6f8fc] text-[#111827] lg:h-screen lg:grid-cols-[64px_minmax(0,1fr)] lg:overflow-hidden">
      <DashboardSidebar
        activeLabel="Knowledge Base"
        userInitials={initials(session.name)}
        onLogout={() => { void logoutSession().then(() => router.replace("/login")); }}
      />

      <section className="min-w-0 overflow-y-auto">
        <header className="border-b border-[#dbeafe] bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-4">
            <div>
              <span className="app-label text-[#0284c7]">Knowledge Base</span>
              <h1 className="m-0 text-xl font-semibold leading-7 text-[#0f172a]">Knowledge studio</h1>
              <p className="app-caption mt-1 mb-0 text-[#475569]">Agent facts, files, and searchable answers.</p>
            </div>
            <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-4">
              {libraryStats.map((stat) => (
                <div className={`rounded-lg border px-3 py-2 ${stat.tone}`} key={stat.label}>
                  <span className="app-caption block text-current">{stat.label}</span>
                  <strong className="block text-sm font-semibold leading-5">{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1500px] gap-5 p-4 sm:p-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:p-8">
          <div className="grid gap-3 lg:col-span-2">
            {notice ? <Notice tone="success" message={notice} onClose={() => setNotice("")} /> : null}
            {error && !editorOpen ? <Notice tone="error" message={error} onClose={() => setError("")} /> : null}
          </div>

          <aside className="min-w-0">
            <section className="overflow-hidden rounded-lg border border-[#dbe2ea] bg-white shadow-sm lg:sticky lg:top-6">
              <div className="border-b border-[#edf0f4] bg-[#fbfdff] p-4">
                <h2 className="app-section-title m-0">Agent source</h2>
                <p className="app-caption mt-1 mb-0">Choose the assistant memory to edit.</p>
              </div>

              <div className="grid gap-4 border-b border-[#edf0f4] p-4">
                <label className="app-label grid gap-2">
                  Agent
                  <select
                    className={controlClass}
                    disabled={loading || saving}
                    value={selectedAgentId}
                    onChange={(event) => {
                      setSelectedAgentId(event.target.value);
                      setQuery("");
                    }}
                  >
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="app-caption">Capacity</span>
                    <span className="app-strong">{documents.length}/{maxKnowledgeFiles}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                    <div
                      className="h-full rounded-full bg-[#1438f5]"
                      style={{ width: `${Math.min(100, (documents.length / maxKnowledgeFiles) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 p-4">
                <button
                  className={`${buttonClass} bg-[#1438f5] text-white shadow-sm hover:bg-[#102fcf]`}
                  disabled={!selectedAgent || loading || saving || knowledgeLimitReached}
                  onClick={openNewDocument}
                  type="button"
                >
                  <Icon icon="plus" />
                  Add text
                </button>
                <label className={`${buttonClass} relative cursor-pointer border border-[#c7d2fe] bg-[#eef2ff] text-[#1438f5] hover:bg-[#e0e7ff] ${!selectedAgent || loading || saving || knowledgeLimitReached ? "pointer-events-none opacity-50" : ""}`}>
                  <input
                    className="absolute inset-0 cursor-pointer opacity-0"
                    type="file"
                    accept=".txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json"
                    disabled={!selectedAgent || loading || saving || knowledgeLimitReached}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      void openUploadEditor(file);
                    }}
                  />
                  <Icon icon="upload" />
                  Upload file
                </label>
                <p className="app-caption m-0 rounded-lg bg-[#f8fafc] px-3 py-2 text-[#475569]">
                  .txt, .md, .csv, .json under 300KB.
                </p>
              </div>
            </section>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-lg border border-[#dbe2ea] bg-white shadow-sm">
            <div className="grid gap-4 border-b border-[#edf0f4] p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,360px)] lg:items-end">
              <div>
                <h2 className="app-section-title m-0">{selectedAgentName}</h2>
                <p className="app-caption mt-1 mb-0">{filteredDocuments.length.toLocaleString("en-IN")} shown / {documents.length.toLocaleString("en-IN")} total</p>
              </div>
              <label className="app-label grid gap-2">
                Search
                <span className="relative">
                  <span className="absolute inset-y-0 left-3 grid place-items-center text-[#94a3b8]"><Icon icon="search" /></span>
                  <input
                    className={`${controlClass} pl-10`}
                    placeholder="Search title or text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </span>
              </label>
            </div>

            {loading ? (
              <div className="grid min-h-52 place-items-center px-5 py-10">
                <span className="app-caption">Loading knowledge...</span>
              </div>
            ) : documents.length === 0 ? (
              <div className="mx-auto grid max-w-xl place-items-center gap-4 px-5 py-14 text-center">
                <span className="grid size-12 place-items-center rounded-lg bg-[#eef2ff] text-[#4f46e5]">
                  <Icon icon="file" className="size-5" />
                </span>
                <div>
                  <strong className="app-strong block">No knowledge added yet</strong>
                  <p className="app-caption mt-1 mb-0">
                    Add approved facts, policies, pricing, FAQs, and call answers for this assistant.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    className={`${buttonClass} bg-[#1438f5] text-white hover:bg-[#102fcf]`}
                    disabled={!selectedAgent || saving}
                    onClick={openNewDocument}
                    type="button"
                  >
                    <Icon icon="plus" />
                    Add text
                  </button>
                  <label className={`${buttonClass} relative cursor-pointer border border-[#d5d8df] bg-white text-[#334155] hover:bg-[#f8fafc]`}>
                    <input
                      className="absolute inset-0 cursor-pointer opacity-0"
                      type="file"
                      accept=".txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json"
                      disabled={!selectedAgent || saving}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        void openUploadEditor(file);
                      }}
                    />
                    <Icon icon="upload" />
                    Upload file
                  </label>
                </div>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="grid min-h-52 place-items-center px-5 py-10 text-center">
                <div>
                  <strong className="app-strong block">No matching knowledge found</strong>
                  <span className="app-caption mt-1 block">Try a different search.</span>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-[#edf0f4]">
                {filteredDocuments.map(({ document, index }) => {
                  const tone = documentTones[index % documentTones.length];
                  return (
                    <li className="grid gap-3 p-4 transition hover:bg-[#fbfdff] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5" key={document._id ?? `${document.name}-${index}`}>
                      <div className="flex min-w-0 gap-3">
                        <span className={`mt-0.5 grid size-10 shrink-0 place-items-center rounded-lg border ${tone}`}>
                          <Icon icon="file" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <strong className="app-strong truncate">{document.name}</strong>
                            <span className={`app-label rounded-lg px-2.5 py-1 ${document.status === "ready" ? "bg-[#ecfdf5] text-[#047857]" : "bg-[#f1f5f9] text-[#64748b]"}`}>
                              {document.status === "ready" ? "Used in calls" : "Off"}
                            </span>
                            <span className="app-label rounded-lg bg-[#f8fafc] px-2.5 py-1 text-[#64748b]">
                              {characterCount(document.content)} chars
                            </span>
                          </div>
                          <p className="app-caption mt-1 mb-0 max-w-4xl text-[#64748b]">
                            {previewText(document.content)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <button
                          className={`app-label min-h-9 rounded-lg px-3 transition ${
                            document.status === "ready"
                              ? "bg-[#ecfdf5] text-[#047857] hover:bg-[#d1fae5]"
                              : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                          }`}
                          disabled={saving}
                          onClick={() => toggleDocument(index)}
                          type="button"
                        >
                          {document.status === "ready" ? "Turn off" : "Turn on"}
                        </button>
                        <button
                          className="grid size-9 place-items-center rounded-lg border border-[#d5d8df] bg-white text-[#475569] transition hover:bg-[#f8fafc] hover:text-[#111827]"
                          disabled={saving}
                          onClick={() => openEditDocument(index)}
                          type="button"
                          aria-label={`Edit ${document.name}`}
                        >
                          <Icon icon="edit" />
                        </button>
                        <button
                          className="grid size-9 place-items-center rounded-lg border border-[#fecaca] bg-white text-[#dc2626] transition hover:bg-[#fff1f2]"
                          disabled={saving}
                          onClick={() => removeDocument(index)}
                          type="button"
                          aria-label={`Remove ${document.name}`}
                        >
                          <Icon icon="trash" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </section>

      {editorOpen ? (
        <EditorModal
          busy={saving}
          content={documentContent}
          error={error}
          fileName={uploadedFileName}
          isEditing={editingIndex !== null}
          name={documentName}
          onClose={closeEditor}
          onContentChange={setDocumentContent}
          onFile={handleFile}
          onNameChange={setDocumentName}
          onSave={() => void saveEditor()}
        />
      ) : null}
    </main>
  );
}

function EditorModal({
  busy,
  content,
  error,
  fileName,
  isEditing,
  name,
  onClose,
  onContentChange,
  onFile,
  onNameChange,
  onSave,
}: {
  busy: boolean;
  content: string;
  error: string;
  fileName: string;
  isEditing: boolean;
  name: string;
  onClose: () => void;
  onContentChange: (value: string) => void;
  onFile: (file: File | undefined) => Promise<void>;
  onNameChange: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#0f172a]/45 p-3 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? "Edit knowledge" : "Add knowledge"}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="grid max-h-[calc(100vh-24px)] w-full max-w-2xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-white/70 bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-[#e5e7eb] px-5 py-4 sm:px-6">
          <div>
            <h2 className="app-page-title m-0">{isEditing ? "Edit knowledge" : "Add knowledge"}</h2>
            <p className="app-caption mt-1 mb-0">Paste text or upload a small file.</p>
          </div>
          <button className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#e5e7eb] bg-white text-[#64748b] transition hover:bg-[#f8fafc] hover:text-[#111827]" onClick={onClose} type="button" aria-label="Close">
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
            <input className={controlClass} maxLength={80} placeholder="Pricing FAQ" value={name} onChange={(event) => onNameChange(event.target.value)} />
          </label>

          <label className="app-label grid gap-2">
            Upload file <span className="font-normal text-[#94a3b8]">(.txt, .md, .csv, .json under 300KB)</span>
            <span className="flex flex-wrap items-center gap-2">
              <span className="relative">
                <input
                  className="absolute inset-0 cursor-pointer opacity-0"
                  type="file"
                  accept=".txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    void onFile(file);
                  }}
                />
                <span className={`${buttonClass} border border-[#c7d2fe] bg-white text-[#1438f5] hover:bg-[#eef2ff]`}>
                  <Icon icon="upload" />
                  Choose file
                </span>
              </span>
              {fileName ? <span className="app-caption rounded-lg bg-[#f1f5f9] px-2.5 py-1 text-[#475569]">{fileName}</span> : null}
            </span>
          </label>

          <label className="app-label grid gap-2">
            Knowledge text
            <textarea
              className="app-control-text min-h-64 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
              placeholder="Example: We are open Monday to Saturday, 10 AM to 6 PM. Refunds are available within 7 days..."
              value={content}
              onChange={(event) => onContentChange(event.target.value)}
            />
          </label>
        </div>

        <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-[#e5e7eb] px-5 py-4 sm:px-6">
          <button className={`${buttonClass} border border-[#d5d8df] bg-white text-[#334155] hover:bg-[#f8fafc]`} disabled={busy} onClick={onClose} type="button">
            Cancel
          </button>
          <button className={`${buttonClass} bg-[#1438f5] text-white hover:bg-[#102fcf]`} disabled={busy || !name.trim() || !content.trim()} onClick={onSave} type="button">
            <Icon icon="check" />
            {busy ? "Saving..." : "Save"}
          </button>
        </footer>
      </section>
    </div>
  );
}

function Notice({ message, onClose, tone }: { message: string; onClose: () => void; tone: "error" | "success" }) {
  const success = tone === "success";
  return (
    <div className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 ${success ? "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]" : "border-[#fecaca] bg-[#fff1f2] text-[#b91c1c]"}`}>
      <span className="app-body">{message}</span>
      <button className="grid size-6 shrink-0 place-items-center rounded-md hover:bg-black/5" onClick={onClose} type="button" aria-label="Dismiss">
        <Icon icon="close" className="size-3.5" />
      </button>
    </div>
  );
}
