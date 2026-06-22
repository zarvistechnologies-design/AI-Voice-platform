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
  return clean.length > 150 ? `${clean.slice(0, 150)}...` : clean;
}

function fileNameToTitle(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
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
  const selectedAgentName = selectedAgent?.name ?? "Selected agent";

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
    if (!selectedAgent) return;
    setSaving(true);
    setNotice("");
    setError("");
    try {
      const { agent } = await voiceApi.saveAgent(selectedAgent._id, { knowledgeDocuments: nextDocuments });
      setAgents((current) => current.map((item) => (item._id === agent._id ? agent : item)));
      setNotice(message);
    } catch (caught) {
      setError(errorMessage(caught));
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
    await saveDocuments(nextDocuments, editingIndex === null ? "Knowledge added." : "Knowledge updated.");
    closeEditor();
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
    return <main className="app-strong grid min-h-screen place-items-center bg-[#f7f8fb]">Loading knowledge base</main>;
  }

  return (
    <main className="grid min-h-screen bg-[#f7f8fb] text-[#111827] lg:h-screen lg:grid-cols-[64px_minmax(0,1fr)] lg:overflow-hidden">
      <DashboardSidebar
        activeLabel="Knowledge Base"
        userInitials={initials(session.name)}
        onLogout={() => { void logoutSession().then(() => router.replace("/login")); }}
      />

      <section className="min-w-0 overflow-y-auto">
        <header className="border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="app-page-title m-0">Knowledge base</h1>
              <p className="app-caption mt-1 mb-0">Add the facts, FAQs, prices, rules, or policies your agent should use in calls.</p>
            </div>
            <button
              className={`${buttonClass} bg-[#1438f5] text-white shadow-sm hover:bg-[#102fcf]`}
              disabled={!selectedAgent || loading}
              onClick={openNewDocument}
              type="button"
            >
              <Icon icon="plus" />
              Add knowledge
            </button>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1180px] gap-4 p-4 sm:p-6 lg:p-8">
          {notice ? <Notice tone="success" message={notice} onClose={() => setNotice("")} /> : null}
          {error ? <Notice tone="error" message={error} onClose={() => setError("")} /> : null}

          <section className="rounded-xl border border-[#dfe3ea] bg-white shadow-sm">
            <div className="grid gap-3 border-b border-[#e5e7eb] p-4 lg:grid-cols-[minmax(220px,320px)_minmax(220px,1fr)_auto] lg:items-end">
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

              <label className="app-label grid gap-2">
                Search
                <span className="relative">
                  <span className="absolute inset-y-0 left-3 grid place-items-center text-[#94a3b8]"><Icon icon="search" /></span>
                  <input
                    className={`${controlClass} pl-10`}
                    placeholder="Search saved knowledge"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </span>
              </label>

              <div className="app-caption rounded-lg bg-[#f8fafc] px-3 py-2 text-[#475569]">
                {documents.length}/{maxKnowledgeFiles} items · {readyCount} on
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#f8fafc]">
                  <tr className="app-label text-[#64748b]">
                    <th className="px-4 py-3 font-medium">Knowledge</th>
                    <th className="w-28 px-4 py-3 font-medium">Use in calls</th>
                    <th className="w-44 px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f4]">
                  {loading ? (
                    <tr>
                      <td className="app-caption px-4 py-12 text-center" colSpan={3}>Loading knowledge...</td>
                    </tr>
                  ) : filteredDocuments.length ? (
                    filteredDocuments.map(({ document, index }) => (
                      <tr className="align-top transition hover:bg-[#fbfcfe]" key={document._id ?? `${document.name}-${index}`}>
                        <td className="px-4 py-4">
                          <div className="flex gap-3">
                            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef2ff] text-[#4f46e5]">
                              <Icon icon="file" />
                            </span>
                            <span className="min-w-0">
                              <strong className="app-strong block">{document.name}</strong>
                              <span className="app-caption mt-1 block max-w-3xl whitespace-normal text-[#64748b]">
                                {previewText(document.content)}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            className={`app-label min-h-9 rounded-full px-3 transition ${
                              document.status === "ready"
                                ? "bg-[#ecfdf5] text-[#047857] hover:bg-[#d1fae5]"
                                : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                            }`}
                            disabled={saving}
                            onClick={() => toggleDocument(index)}
                            type="button"
                          >
                            {document.status === "ready" ? "On" : "Off"}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
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
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-14 text-center" colSpan={3}>
                        <span className="mx-auto mb-3 grid size-11 place-items-center rounded-lg bg-[#eef2ff] text-[#4f46e5]">
                          <Icon icon="file" />
                        </span>
                        <strong className="app-strong block">{query ? "No matching knowledge found" : "No knowledge added yet"}</strong>
                        <span className="app-caption mt-1 block">
                          {query ? "Try a different search." : "Click Add knowledge to add text or upload a small text file."}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>

      {editorOpen ? (
        <EditorModal
          busy={saving}
          content={documentContent}
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
      <section className="grid max-h-[calc(100vh-24px)] w-full max-w-2xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-[#e5e7eb] px-5 py-4 sm:px-6">
          <div>
            <h2 className="app-page-title m-0">{isEditing ? "Edit knowledge" : "Add knowledge"}</h2>
            <p className="app-caption mt-1 mb-0">Paste text, or upload a small text file. Keep it clear and approved.</p>
          </div>
          <button className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#e5e7eb] bg-white text-[#64748b] transition hover:bg-[#f8fafc] hover:text-[#111827]" onClick={onClose} type="button" aria-label="Close">
            <Icon icon="close" />
          </button>
        </header>

        <div className="grid gap-4 overflow-y-auto px-5 py-5 sm:px-6">
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
                  onChange={(event) => void onFile(event.target.files?.[0])}
                />
                <span className={`${buttonClass} border border-[#c7d2fe] bg-white text-[#1438f5] hover:bg-[#eef2ff]`}>
                  <Icon icon="upload" />
                  Choose file
                </span>
              </span>
              {fileName ? <span className="app-caption rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[#475569]">{fileName}</span> : null}
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
