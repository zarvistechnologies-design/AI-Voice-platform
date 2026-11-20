"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DashboardAuthBoundary } from "@/components/dashboard/DashboardAuthBoundary";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSidebar, getDashboardSidebarInitialState } from "@/components/dashboard/DashboardSidebar";
import { getServerSession, getSession, logoutSession, subscribeToSession } from "@/lib/auth";
import {
  deleteAssistantConversation, getAssistantConversation, listAssistantConversations,
  reviewAssistantAction, sendAssistantMessage, type AssistantConversationSummary, type AssistantMessage,
} from "@/lib/assistant";

const suggestions = [
  {
    icon: "◈",
    eyebrow: "Campaign intelligence",
    title: "What happened in my campaign?",
    detail: "Outcomes, failed calls, and reasons behind the numbers.",
    prompt: "Analyze my latest campaign. Show lead outcomes, call statuses, failure reasons, and what I should look at next. Link to the campaign.",
  },
  {
    icon: "↗",
    eyebrow: "Next best action",
    title: "Who needs a follow up?",
    detail: "Find contacts that still need a human decision.",
    prompt: "Find campaign contacts who need a follow-up and have no active callback or scheduled follow-up. Explain why each is a candidate and link to the campaign. Do not schedule calls.",
  },
  {
    icon: "✳",
    eyebrow: "Agent quality",
    title: "What should I improve?",
    detail: "Use call evidence to suggest practical agent changes.",
    prompt: "List my voice agents, then analyze the performance of the most recently created agent over the last 30 days. Suggest improvements grounded in actual call evidence. Do not change the agent yet.",
  },
  {
    icon: "⌁",
    eyebrow: "Call review",
    title: "Read the latest conversation",
    detail: "Transcript, caller intent, outcome, and next step.",
    prompt: "Show the latest call transcript, summarize what the caller needed, and identify any follow-up mentioned.",
  },
  {
    icon: "▧",
    eyebrow: "Agent knowledge",
    title: "Find a source-backed answer",
    detail: "Search an agent's indexed documents and cite sources.",
    prompt: "Help me search an agent's knowledge documents. First ask which agent and what question I want answered.",
  },
  {
    icon: "+",
    eyebrow: "Agent studio",
    title: "Draft a new voice agent",
    detail: "Review every detail before it is saved.",
    prompt: "Prepare a draft customer support voice agent with a clear professional prompt and friendly greeting. Show me the changes for approval before saving.",
  },
];

function SparkIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m12 3 2.1 6.2L20 11l-5.9 2-2.1 6-2.1-6L4 11l5.9-1.8L12 3Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#595959]"
      title="Copy message"
    >
      {copied ? (
        <>
          <svg className="size-3 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span className="font-semibold text-neutral-700">Copied</span>
        </>
      ) : (
        <>
          <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function renderAssistantInline(value: string) {
  return value.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-[#343434]">{part.slice(2, -2)}</strong>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const href = link[2];
      const internal = href.startsWith("/dashboard/");
      if (internal || /^https:\/\/[^\s<>]+$/i.test(href)) {
        return <a key={index} href={href} target={internal ? undefined : "_blank"} rel={internal ? undefined : "noopener noreferrer"} className="font-semibold text-[#676767] underline decoration-[#c7c7c7] underline-offset-2 hover:text-[#4b4b4b]">{link[1]}</a>;
      }
    }
    return part;
  });
}

function FormattedContent({ content }: { content: string }) {
  // Simple paragraph & bold parser to avoid displaying raw markdown asterisks
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-2.5 break-words">
      {paragraphs.map((p, idx) => {
        const lines = p.split(/\n/);
        return (
          <div key={idx} className="space-y-0.5">
            {lines.map((line, lineIdx) => {
              const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
              const isNumbered = /^\d+\.\s/.test(line.trim());
              const isHeading = line.trim().startsWith("### ") || line.trim().startsWith("## ");
              if (/^---+$/.test(line.trim())) return <hr key={lineIdx} className="my-3 border-[#e8e8e8]" />;

              const cleanLine = isHeading
                ? line.replace(/^#{2,3}\s*/, "")
                : isBullet
                ? line.replace(/^[-*]\s*/, "")
                : isNumbered
                ? line.replace(/^\d+\.\s*/, "")
                : line;

              const formattedText = renderAssistantInline(cleanLine);

              if (isHeading) {
                return (
                  <h4 key={lineIdx} className="m-0 pt-1 text-sm font-bold tracking-tight text-slate-900">
                    {formattedText}
                  </h4>
                );
              }

              if (isBullet || isNumbered) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                    <span className="select-none text-[#6d6d6d]">{isNumbered ? "•" : "—"}</span>
                    <span className="flex-1">{formattedText}</span>
                  </div>
                );
              }

              return (
                <p key={lineIdx} className="m-0 text-sm leading-relaxed text-slate-800">
                  {formattedText}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function AssistantChat() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [showUserSidebar, setShowUserSidebar] = useState(getDashboardSidebarInitialState);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [conversationId, setConversationId] = useState<string>();
  const [conversations, setConversations] = useState<AssistantConversationSummary[]>([]);
  const [historyPage, setHistoryPage] = useState(0);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(() =>
    typeof window === "undefined" || window.localStorage.getItem("askVozonHistoryVisible") !== "0");
  const [loadingChatId, setLoadingChatId] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [reviewingActionId, setReviewingActionId] = useState("");
  const [error, setError] = useState("");
  const [activeMode, setActiveMode] = useState<"Manual" | "Auto" | "Grounded">("Manual");
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function toggleListening() {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is supported in modern browsers like Chrome, Edge, and Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setDraft((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  }

  function toggleDesktopHistory() {
    setHistoryVisible((visible) => {
      window.localStorage.setItem("askVozonHistoryVisible", visible ? "0" : "1");
      return !visible;
    });
  }

  useEffect(() => {
    if (!session?.id || !session.organization?.id) return;
    let active = true;
    listAssistantConversations().then((result) => {
      if (!active) return;
      setConversations(result.conversations);
      setHasMoreHistory(result.hasMore);
      setHistoryError("");
    }).catch(() => {
      if (active) setHistoryError("Chats could not be loaded. Refresh to try again.");
    }).finally(() => {
      if (active) setHistoryLoading(false);
    });
    return () => { active = false; };
  }, [session?.id, session?.organization?.id]);

  // Auto-scroll when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  function startNewChat() {
    if (busy || loadingChatId) return;
    setConversationId(undefined);
    setMessages([]);
    setDraft("");
    setError("");
    setHistoryOpen(false);
    textareaRef.current?.focus();
  }

  async function openChat(id: string) {
    if (busy || loadingChatId || id === conversationId) return;
    setLoadingChatId(id);
    setError("");
    try {
      const chat = await getAssistantConversation(id);
      setConversationId(chat.id);
      setMessages(chat.messages);
      setDraft("");
      setHistoryOpen(false);
    } catch (caught) {
      setHistoryError(caught instanceof Error ? caught.message : "That chat could not be opened.");
    } finally {
      setLoadingChatId("");
    }
  }

  async function loadMoreHistory() {
    if (historyLoading || !hasMoreHistory) return;
    setHistoryLoading(true);
    try {
      const result = await listAssistantConversations(historyPage + 1);
      setConversations((current) => [...current, ...result.conversations.filter((item) => !current.some((old) => old.id === item.id))]);
      setHistoryPage((page) => page + 1);
      setHasMoreHistory(result.hasMore);
    } catch (caught) {
      setHistoryError(caught instanceof Error ? caught.message : "More chats could not be loaded.");
    } finally {
      setHistoryLoading(false);
    }
  }

  async function removeChat(id: string) {
    if (busy || loadingChatId || !window.confirm("Delete this chat permanently?")) return;
    setLoadingChatId(id);
    try {
      await deleteAssistantConversation(id);
      setConversations((current) => current.filter((chat) => chat.id !== id));
      if (conversationId === id) {
        setConversationId(undefined);
        setMessages([]);
      }
    } catch (caught) {
      setHistoryError(caught instanceof Error ? caught.message : "The chat could not be deleted.");
    } finally {
      setLoadingChatId("");
    }
  }

  async function submitMessage(event?: FormEvent, suppliedPrompt?: string) {
    event?.preventDefault();
    const content = (suppliedPrompt ?? draft).trim();
    if (!content || busy) return;
    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setDraft("");
    setError("");
    setBusy(true);

    try {
      const reply = await sendAssistantMessage(nextMessages.slice(-12), conversationId);
      setConversationId(reply.conversationId);
      setMessages((current) => [...current, { role: "assistant", content: reply.answer, pendingAction: reply.pendingAction }]);
      try {
        const latest = await listAssistantConversations();
        setConversations(latest.conversations);
        setHasMoreHistory(latest.hasMore);
        setHistoryPage(0);
      } catch {
        setHistoryError("Chat saved, but the history list could not refresh.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Vozon could not answer right now.");
      setMessages((current) => current.slice(0, -1));
      setDraft(content);
    } finally {
      setBusy(false);
      window.requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
    }
  }

  async function decideAction(actionId: string, approved: boolean) {
    if (reviewingActionId) return;
    setReviewingActionId(actionId);
    setError("");
    try {
      const result = await reviewAssistantAction(actionId, approved);
      setMessages((current) => current.map((message) => message.pendingAction?.id === actionId
        ? { ...message, content: result.answer, pendingAction: undefined }
        : message));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The action could not be reviewed. Try again.");
    } finally {
      setReviewingActionId("");
    }
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f9f9f9] text-sm font-semibold text-[#7d7d7d]">
        Loading your workspace…
      </main>
    );
  }

  const initials = session.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const rawName = session?.name?.trim() || "";
  const firstName = (rawName ? rawName.split(/\s+/)[0] : "Sumit") || "Sumit";

  const formattedDate = (() => {
    try {
      return (
        new Intl.DateTimeFormat("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }).format(new Date()) + "."
      );
    } catch {
      return "Today";
    }
  })();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <main
      className={`dashboard-home-theme ask-vozon-stage grid min-h-screen bg-[#fafafa] text-[#171717] dark:bg-[#09090b] dark:text-white ${
        showUserSidebar ? "lg:grid-cols-[248px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
      }`}
    >
      <DashboardSidebar
        activeLabel="Ask Vozon"
        userInitials={initials}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => void logoutSession().then(() => router.replace("/login"))}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />

      <section className="flex h-screen min-h-0 min-w-0 flex-col overflow-hidden bg-[#fafafa] dark:bg-[#09090b]">
        {/* Workspace Breadcrumbs & Credits Bar */}
        <DashboardPageHeader workspaceBarOnly />

        <div className="relative flex min-h-0 flex-1 bg-[#fafafa] dark:bg-[#09090b]">
          <aside id="ask-vozon-history" className={`${historyOpen ? "flex" : "hidden"} absolute inset-y-0 right-0 z-30 w-[min(88vw,300px)] flex-col border-l border-slate-200 bg-white shadow-lg md:static md:order-2 ${historyVisible ? "md:flex" : "md:hidden"} md:w-[248px] md:shrink-0 md:shadow-none dark:border-zinc-800 dark:bg-[#121215]`} aria-label="Chat history">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 dark:border-zinc-800">
              <div><p className="m-0 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-zinc-400">Your workspace</p><h2 className="m-0 mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">Chat history</h2></div>
              <button type="button" className="rounded-md px-2 py-1 text-lg text-slate-400 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white md:hidden" onClick={() => setHistoryOpen(false)} aria-label="Close chat history">×</button>
              <button type="button" className="hidden rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200 hover:text-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750 dark:hover:text-white md:inline-flex" onClick={toggleDesktopHistory} aria-label="Hide chat history" aria-controls="ask-vozon-history" aria-expanded="true">Hide</button>
            </div>
            <button type="button" onClick={startNewChat} disabled={busy || Boolean(loadingChatId)} className="mx-3 mt-3 flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-100 hover:text-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 disabled:opacity-50"><span className="text-base leading-none">+</span> New chat</button>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 pt-3">
              <p className="m-0 px-2 pb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-zinc-400">Recent conversations</p>
              {historyLoading && conversations.length === 0 ? <p className="px-2 text-xs text-slate-500 dark:text-zinc-400">Loading chats…</p> : null}
              {!historyLoading && conversations.length === 0 && !historyError ? <p className="px-2 text-xs leading-5 text-slate-500 dark:text-zinc-400">Your conversations will appear here.</p> : null}
              {historyError ? <p className="mx-2 mb-3 rounded-md bg-rose-50 px-2 py-2 text-xs text-rose-700 dark:bg-zinc-800 dark:text-zinc-200" role="alert">{historyError}</p> : null}
              <div className="space-y-0.5">
                {conversations.map((chat) => (
                  <div key={chat.id} className={`group flex items-center gap-1 rounded-md px-1 transition ${conversationId === chat.id ? "bg-slate-100 dark:bg-zinc-800" : "hover:bg-slate-50 dark:hover:bg-zinc-800/60"}`}>
                    <button type="button" onClick={() => void openChat(chat.id)} disabled={busy || Boolean(loadingChatId)} className="min-w-0 flex-1 px-2 py-2 text-left disabled:opacity-50" aria-current={conversationId === chat.id ? "page" : undefined}>
                      <span className="block truncate text-xs font-medium text-slate-800 dark:text-zinc-200">{chat.title}</span>
                      <span className="mt-0.5 block text-[10px] text-slate-400 dark:text-zinc-400">{new Date(chat.updatedAt).toLocaleDateString()}</span>
                    </button>
                    <button type="button" onClick={() => void removeChat(chat.id)} disabled={busy || Boolean(loadingChatId)} className="rounded px-1.5 py-1 text-xs text-[#a1a1aa] opacity-60 transition hover:bg-slate-200 hover:text-black dark:hover:bg-zinc-700 dark:hover:text-white focus:opacity-100 group-hover:opacity-100 disabled:opacity-30" aria-label={`Delete chat: ${chat.title}`} title="Delete chat">×</button>
                  </div>
                ))}
              </div>
              {hasMoreHistory ? <button type="button" onClick={() => void loadMoreHistory()} disabled={historyLoading} className="mt-3 w-full rounded-md px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:opacity-50">{historyLoading ? "Loading…" : "Load more chats"}</button> : null}
            </div>
          </aside>

        {/* Main Conversation Container */}
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col px-4 pb-4 pt-3 sm:px-6 md:order-1 lg:px-8 bg-[#fafafa] text-[#171717] dark:bg-[#09090b] dark:text-white">
          <div className="flex items-center justify-between gap-2">
            <button type="button" className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 md:hidden" onClick={() => setHistoryOpen(true)}>Chat history</button>
            <div className="ml-auto flex items-center gap-2">
              {messages.length > 0 ? (
                <button
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750"
                  type="button"
                  onClick={startNewChat}
                  disabled={busy || Boolean(loadingChatId)}
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  New chat
                </button>
              ) : null}
              {!historyVisible ? (
                <button
                  type="button"
                  className="hidden h-8 items-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 md:inline-flex"
                  onClick={toggleDesktopHistory}
                  aria-controls="ask-vozon-history"
                  aria-expanded="false"
                >
                  Show chat history
                </button>
              ) : null}
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-2 pb-12">
              <div className="w-full max-w-[700px]">
                {/* Greeting & Date Matching Dashboard Theme */}
                <div className="mb-8 text-center">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                    {greeting}, {firstName}.
                  </h1>
                  <p className="mt-2 text-[13px] font-normal text-slate-500 dark:text-zinc-400">
                    {formattedDate}
                  </p>
                </div>

                {/* Sleek Prompt Card Matching Screenshot */}
                <form
                  className="rounded-[22px] border border-slate-200 bg-white px-5 pt-4 pb-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all focus-within:border-slate-400 focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.1)] dark:border-zinc-800 dark:bg-[#121215] dark:shadow-[0_12px_42px_rgba(0,0,0,0.5)] dark:focus-within:border-zinc-700"
                  onSubmit={(event) => void submitMessage(event)}
                >
                  <label className="sr-only" htmlFor="ask-vozon-input">
                    Ask Vozon
                  </label>
                  <textarea
                    ref={textareaRef}
                    style={{ outline: "none", boxShadow: "none", border: "none", background: "transparent" }}
                    className="ai-prompt-textarea block max-h-40 min-h-[52px] w-full resize-none border-0 bg-transparent p-0 text-[15px] leading-relaxed text-slate-900 placeholder:text-slate-400 !outline-none !shadow-none !ring-0 focus:!outline-none focus:!shadow-none focus:!ring-0 dark:text-white dark:placeholder:text-zinc-500"
                    id="ask-vozon-input"
                    maxLength={2000}
                    placeholder="Ask Vozon..."
                    rows={2}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void submitMessage();
                      }
                    }}
                  />

                  {/* Toolbar inside prompt box: + | Manual ▾ | @ ... 🎙️ | ↑ */}
                  <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => textareaRef.current?.focus()}
                        className="flex size-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                        title="Attach context or file"
                      >
                        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setModeDropdownOpen((v) => !v)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 cursor-pointer"
                        >
                          <svg className="size-3.5 text-slate-500 dark:text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                          <span>{activeMode}</span>
                          <svg className={`size-3 text-slate-400 transition-transform ${modeDropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                        {modeDropdownOpen && (
                          <div className="absolute left-0 bottom-full mb-2 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg z-30 dark:border-zinc-700 dark:bg-zinc-800">
                            <button
                              type="button"
                              onClick={() => { setActiveMode("Manual"); setModeDropdownOpen(false); }}
                              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-left cursor-pointer ${activeMode === "Manual" ? "bg-slate-100 font-semibold text-slate-900 dark:bg-zinc-700 dark:text-white" : "text-slate-600 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-750"}`}
                            >
                              <span>🛡️</span>
                              <span>Manual Mode</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => { setActiveMode("Auto"); setModeDropdownOpen(false); }}
                              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-left cursor-pointer ${activeMode === "Auto" ? "bg-slate-100 font-semibold text-slate-900 dark:bg-zinc-700 dark:text-white" : "text-slate-600 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-750"}`}
                            >
                              <span>⚡</span>
                              <span>Autonomous</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => { setActiveMode("Grounded"); setModeDropdownOpen(false); }}
                              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-left cursor-pointer ${activeMode === "Grounded" ? "bg-slate-100 font-semibold text-slate-900 dark:bg-zinc-700 dark:text-white" : "text-slate-600 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-750"}`}
                            >
                              <span>📚</span>
                              <span>Grounded Only</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setDraft((prev) => (prev ? `${prev} @` : "@"));
                          textareaRef.current?.focus();
                        }}
                        className="flex size-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 text-sm font-medium cursor-pointer"
                        title="Mention agent or knowledge base"
                      >
                        @
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`flex size-8 items-center justify-center rounded-lg transition cursor-pointer ${
                          isListening
                            ? "bg-red-50 text-red-600 animate-pulse dark:bg-red-950/40 dark:text-red-400"
                            : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                        }`}
                        title={isListening ? "Listening... click to stop" : "Voice dictation"}
                      >
                        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" x2="12" y1="19" y2="22" />
                        </svg>
                      </button>

                      <button
                        className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition ${
                          draft.trim() && !busy
                            ? "bg-black text-white hover:bg-zinc-800 shadow-sm cursor-pointer dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                            : "bg-slate-100 text-slate-300 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
                        }`}
                        type="submit"
                        disabled={busy || !draft.trim()}
                        title={draft.trim() ? "Send message (Enter)" : "Type a message to send"}
                      >
                        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Status Bar Underneath Prompt Card */}
                <div className="mt-3.5 flex items-center justify-between px-2 text-xs text-slate-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-slate-400 dark:text-zinc-500" aria-hidden="true">
                      <i className="h-2.5 w-0.5 rounded-full bg-slate-400 dark:bg-zinc-600" />
                      <i className="h-3.5 w-0.5 rounded-full bg-slate-500 dark:bg-zinc-500" />
                      <i className="h-2 w-0.5 rounded-full bg-slate-400 dark:bg-zinc-600" />
                    </span>
                    <span className="text-slate-600 dark:text-zinc-300 font-normal">
                      Your voice agents are active
                    </span>
                  </div>
                  <Link
                    href="/dashboard/agents"
                    className="font-medium text-slate-600 hover:text-black dark:text-zinc-300 dark:hover:text-white transition"
                  >
                    Manage
                  </Link>
                </div>

                {/* Quick Action Suggestion Pills */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  {suggestions.slice(0, 4).map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => void submitMessage(undefined, item.prompt)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
                    >
                      <span className="text-slate-400 dark:text-zinc-500">{item.icon}</span>
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Active Message Thread */}
              <div className="mx-auto min-h-0 w-full max-w-[740px] flex-1 space-y-5 overflow-y-auto pb-5 pt-4" aria-live="polite">
                {messages.map((message, index) => (
                  <div
                    className={`animate-ai-message flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                    key={`${index}-${message.role}`}
                  >
                    {message.role === "assistant" ? (
                      <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-[#171717] text-white">
                        <SparkIcon className="size-4" />
                      </span>
                    ) : null}

                    <div
                      className={`min-w-0 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "max-w-[min(90%,42rem)] rounded-2xl rounded-br-sm bg-[#171717] px-4 py-2.5 text-white dark:bg-white dark:text-black"
                          : "group flex-1 py-1 pr-2 text-[#171717] dark:text-zinc-100"
                      }`}
                    >
                      {message.role === "user" ? (
                        <p className="m-0 whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <>
                          <FormattedContent content={message.content} />
                          {message.pendingAction ? (
                            <div className="mt-5 overflow-hidden rounded-lg border border-[#eaeaea] bg-white dark:border-zinc-800 dark:bg-zinc-900">
                              <div className="border-b border-[#eaeaea] bg-[#fafafa] px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
                                <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#71717a] dark:text-zinc-400">Approval required</p>
                                <h3 className="m-0 mt-1 text-base font-semibold text-[#171717] dark:text-white">{message.pendingAction.title}</h3>
                                <p className="m-0 mt-1 text-xs text-[#71717a] dark:text-zinc-400">{message.pendingAction.description}</p>
                              </div>
                              <dl className="m-0 grid gap-3 px-4 py-4 sm:grid-cols-2">
                                {message.pendingAction.fields.map((field) => (
                                  <div className={field.label === "Instructions" ? "sm:col-span-2" : ""} key={field.label}>
                                    <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#71717a] dark:text-zinc-400">{field.label}</dt>
                                    <dd className="m-0 mt-1 max-h-36 overflow-auto whitespace-pre-wrap text-xs leading-5 text-[#171717] dark:text-zinc-200">{field.value}</dd>
                                  </div>
                                ))}
                              </dl>
                              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#eaeaea] px-4 py-3 dark:border-zinc-800">
                                <span className="text-[11px] text-[#71717a] dark:text-zinc-400">Nothing changes until you approve.</span>
                                <div className="flex gap-2">
                                  <button className="h-8 rounded-md border border-[#eaeaea] bg-white px-3 text-xs font-medium text-[#171717] transition hover:bg-[#f4f4f5] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50" type="button" disabled={Boolean(reviewingActionId)} onClick={() => void decideAction(message.pendingAction!.id, false)}>Cancel</button>
                                  <button className="h-8 rounded-md bg-[#171717] px-3.5 text-xs font-medium text-white transition hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50" type="button" disabled={Boolean(reviewingActionId)} onClick={() => void decideAction(message.pendingAction!.id, true)}>{reviewingActionId === message.pendingAction.id ? "Saving…" : "Approve change"}</button>
                                </div>
                              </div>
                            </div>
                          ) : null}
                          <div className="mt-2 flex items-center justify-end opacity-60 transition group-hover:opacity-100">
                            <CopyButton text={message.content} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {/* Live Thinking / Workspace Query Indicator */}
                {busy ? (
                  <div className="animate-ai-message flex items-start gap-3" role="status">
                    <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg border border-[#eaeaea] bg-white text-[#171717]">
                      <SparkIcon className="size-4" />
                    </span>
                    <div className="flex items-center gap-3 rounded-xl border border-[#eaeaea] bg-white px-4 py-3 text-xs font-medium text-[#52525b]">
                      <div className="flex items-center gap-1.5">
                        <span className="animate-ai-dot-1 size-1.5 rounded-full bg-[#171717]" />
                        <span className="animate-ai-dot-2 size-1.5 rounded-full bg-[#171717]" />
                        <span className="animate-ai-dot-3 size-1.5 rounded-full bg-[#171717]" />
                      </div>
                      <span>Searching workspace data & generating response…</span>
                    </div>
                  </div>
                ) : null}

                {error ? (
                  <div className="animate-ai-message ml-11 rounded-lg border border-[#eaeaea] bg-white px-4 py-3 text-xs font-medium text-[#171717] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200" role="alert">
                    {error}
                  </div>
                ) : null}

                <div ref={bottomRef} />
              </div>

              {/* Anchored Prompt Box during active chat */}
              <div className="z-20 mx-auto w-full max-w-[740px] shrink-0 pt-2">
                <form
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus-within:border-slate-400 transition-all dark:border-zinc-800 dark:bg-[#121215] dark:shadow-[0_14px_38px_rgba(0,0,0,0.5)] dark:focus-within:border-zinc-700"
                  onSubmit={(event) => void submitMessage(event)}
                >
                  <label className="sr-only" htmlFor="ask-vozon-input">
                    Ask your personal AI assistant
                  </label>
                  <textarea
                    ref={textareaRef}
                    style={{ outline: "none", boxShadow: "none", border: "none", background: "transparent" }}
                    className="ai-prompt-textarea block max-h-32 min-h-[36px] w-full resize-none border-0 bg-transparent p-0 text-[15px] leading-relaxed text-slate-900 placeholder:text-slate-400 !outline-none !shadow-none !ring-0 focus:!outline-none focus:!shadow-none focus:!ring-0 dark:text-white dark:placeholder:text-zinc-500"
                    id="ask-vozon-input"
                    maxLength={2000}
                    placeholder="Reply to Ask Vozon…"
                    rows={1}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void submitMessage();
                      }
                    }}
                  />
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                      Press ↵ to send · Shift+↵ for newline
                    </span>
                    <button
                      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full transition ${
                        draft.trim() && !busy
                          ? "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 cursor-pointer shadow-sm"
                          : "bg-slate-100 text-slate-300 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
                      }`}
                      type="submit"
                      disabled={busy || !draft.trim()}
                      title={draft.trim() ? "Send message (Enter)" : "Type a message to send"}
                    >
                      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
        </div>
      </section>
    </main>
  );
}

export function AskVozonShell() {
  return (
    <DashboardAuthBoundary>
      <AssistantChat />
    </DashboardAuthBoundary>
  );
}
