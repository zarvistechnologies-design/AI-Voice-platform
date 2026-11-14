"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const firstName = session.name.split(/\s+/)[0] || "there";

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <main
      className={`dashboard-home-theme ask-vozon-stage grid min-h-screen text-[#202020] ${
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

      <section className="flex h-screen min-h-0 min-w-0 flex-col overflow-hidden">
        {/* Workspace Breadcrumbs & Credits Bar (Clean, no redundant headers) */}
        <DashboardPageHeader workspaceBarOnly />

        <div className="relative flex min-h-0 flex-1">
          <aside id="ask-vozon-history" className={`${historyOpen ? "flex" : "hidden"} absolute inset-y-0 right-0 z-30 w-[min(88vw,300px)] flex-col border-l border-[#e6e6e6] bg-[#f8f8f8] shadow-[-16px_0_40px_rgba(0,0,0,.13)] md:static md:order-2 ${historyVisible ? "md:flex" : "md:hidden"} md:w-[248px] md:shrink-0 md:shadow-none`} aria-label="Chat history">
            <div className="flex items-center justify-between border-b border-[#e8e8e8] px-4 py-4">
              <div><p className="m-0 text-[10px] font-bold uppercase tracking-[.18em] text-[#868686]">Your workspace</p><h2 className="m-0 mt-1 text-base font-semibold text-[#343434]">Chat history</h2></div>
              <button type="button" className="rounded-lg px-2 py-1 text-xl text-[#747474] md:hidden" onClick={() => setHistoryOpen(false)} aria-label="Close chat history">×</button>
              <button type="button" className="hidden rounded-lg border border-[#e0e0e0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#5e5e5e] transition hover:bg-[#f0f0f0] md:inline-flex" onClick={toggleDesktopHistory} aria-label="Hide chat history" aria-controls="ask-vozon-history" aria-expanded="true">Hide</button>
            </div>
            <button type="button" onClick={startNewChat} disabled={busy || Boolean(loadingChatId)} className="mx-3 mt-3 flex items-center justify-center gap-2 rounded-xl border border-[#d9d9d9] bg-white px-3 py-2.5 text-sm font-semibold text-[#4b4b4b] shadow-sm transition hover:border-[#b5b5b5] hover:bg-[#f8f8f8] disabled:opacity-50"><span className="text-lg leading-none">+</span> New chat</button>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 pt-4">
              <p className="m-0 px-2 pb-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#999999]">Recent conversations</p>
              {historyLoading && conversations.length === 0 ? <p className="px-2 text-xs text-[#838383]">Loading chats…</p> : null}
              {!historyLoading && conversations.length === 0 && !historyError ? <p className="px-2 text-xs leading-5 text-[#838383]">Your conversations will appear here.</p> : null}
              {historyError ? <p className="mx-2 mb-3 rounded-lg bg-neutral-100 px-2 py-2 text-xs text-neutral-800" role="alert">{historyError}</p> : null}
              <div className="space-y-1">
                {conversations.map((chat) => (
                  <div key={chat.id} className={`group flex items-center gap-1 rounded-xl px-1 transition ${conversationId === chat.id ? "bg-[#ececec]" : "hover:bg-[#f1f1f1]"}`}>
                    <button type="button" onClick={() => void openChat(chat.id)} disabled={busy || Boolean(loadingChatId)} className="min-w-0 flex-1 px-2 py-2.5 text-left disabled:opacity-50" aria-current={conversationId === chat.id ? "page" : undefined}>
                      <span className="block truncate text-xs font-semibold text-[#404040]">{chat.title}</span>
                      <span className="mt-1 block text-[10px] text-[#909090]">{new Date(chat.updatedAt).toLocaleDateString()}</span>
                    </button>
                    <button type="button" onClick={() => void removeChat(chat.id)} disabled={busy || Boolean(loadingChatId)} className="rounded-lg px-2 py-1 text-xs text-[#989898] opacity-60 transition hover:bg-white hover:text-neutral-900 focus:opacity-100 group-hover:opacity-100 disabled:opacity-30" aria-label={`Delete chat: ${chat.title}`} title="Delete chat">×</button>
                  </div>
                ))}
              </div>
              {hasMoreHistory ? <button type="button" onClick={() => void loadMoreHistory()} disabled={historyLoading} className="mt-3 w-full rounded-lg px-3 py-2 text-xs font-semibold text-[#5d5d5d] hover:bg-[#eeeeee] disabled:opacity-50">{historyLoading ? "Loading…" : "Load more chats"}</button> : null}
            </div>
          </aside>

        {/* Main Conversation Container */}
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col px-4 pb-3 pt-3 sm:px-6 md:order-1 lg:px-8">
          <button type="button" className="mb-2 self-start rounded-lg border border-[#e3e3e3] bg-white px-3 py-1.5 text-xs font-semibold text-[#535353] md:hidden" onClick={() => setHistoryOpen(true)}>☰ &nbsp; Chat history</button>
          {!historyVisible ? <button type="button" className="mb-2 hidden self-end rounded-lg border border-[#e0e0e0] bg-white px-3 py-1.5 text-xs font-semibold text-[#585858] shadow-sm transition hover:bg-[#f0f0f0] md:inline-flex" onClick={toggleDesktopHistory} aria-controls="ask-vozon-history" aria-expanded="false">Show chat history</button> : null}
          {messages.length > 0 ? (
            <div className="mb-3 flex items-center justify-between gap-4 border-b border-[#e9e9e9] pb-3">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-[#343434] text-[#e6e6e6] shadow-[0_9px_22px_rgba(0,0,0,.2)]"><SparkIcon className="size-5" /></span>
                <div><p className="m-0 text-[10px] font-bold uppercase tracking-[.2em] text-[#7c7c7c]">Workspace intelligence</p><h1 className="m-0 text-lg font-semibold tracking-tight text-[#323232]">Ask Vozon</h1></div>
              </div>
              <button
                className="inline-flex items-center gap-1.5 rounded-full border border-[#dcdcdc] bg-white/90 px-3.5 py-2 text-xs font-semibold text-[#404040] shadow-[0_8px_22px_rgba(0,0,0,.08)] transition hover:-translate-y-0.5 hover:border-[#6d6d6d] hover:bg-[#f5f5f5]"
                type="button"
                onClick={startNewChat}
                disabled={busy || Boolean(loadingChatId)}
              >
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New chat
              </button>
            </div>
          ) : null}
          {messages.length === 0 ? (
            <div className="flex min-h-0 flex-1 flex-col justify-start gap-4 overflow-y-auto pb-5 pt-1 sm:gap-5">
              <div className="ask-vozon-hero relative isolate shrink-0 overflow-hidden rounded-[26px] px-6 py-5 text-white sm:px-9 sm:py-7">
                <div className="ask-vozon-orb ask-vozon-orb-one" aria-hidden="true" />
                <div className="ask-vozon-orb ask-vozon-orb-two" aria-hidden="true" />
                <div className="relative z-10 max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.18em] text-neutral-100 backdrop-blur-xl">
                    <span className="ask-vozon-live-dot size-1.5 rounded-full bg-[#e3e3e3]" /> Workspace intelligence
                  </div>
                  <p className="mb-2 text-sm font-medium text-[#d0d0d0]">{greeting}, {firstName}</p>
                  <h1 className="m-0 max-w-xl text-3xl font-semibold leading-[1.1] tracking-[-.045em] sm:text-4xl">Turn every conversation<br /><span className="text-[#dddddd]">into a better next move.</span></h1>
                  <p className="mb-0 mt-3 max-w-xl text-sm leading-6 text-[#d9d9d9]">Explore campaign results, discover who needs attention, and improve your agents with evidence from real calls.</p>
                </div>
                <span className="ask-vozon-hero-mark absolute -bottom-14 right-5 hidden select-none text-[240px] font-light leading-none text-white/[.04] sm:block" aria-hidden="true">✳</span>
              </div>

              <div className="shrink-0">
                <div className="mb-3 flex flex-wrap items-end justify-between gap-2 px-1">
                  <div><p className="m-0 text-[10px] font-bold uppercase tracking-[.2em] text-[#888888]">Start with a question</p><h2 className="m-0 mt-1 text-xl font-semibold tracking-tight text-[#323232]">Make your workspace clearer</h2></div>
                  <span className="text-xs text-[#8a8a8a]">Grounded in your Vozon data</span>
                </div>
                <div className="grid gap-2.5 text-left sm:grid-cols-2 xl:grid-cols-3">
                  {suggestions.map((item) => (
                    <button
                      className="ask-vozon-suggestion group relative min-h-[116px] overflow-hidden rounded-[18px] border border-[#e6e6e6] bg-white/95 p-3.5 text-left disabled:opacity-60"
                      type="button"
                      key={item.title}
                      disabled={busy}
                      onClick={() => void submitMessage(undefined, item.prompt)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="grid size-8 place-items-center rounded-xl bg-[#f4f4f4] text-lg font-semibold text-[#5a5a5a] transition duration-300 group-hover:rotate-6 group-hover:scale-110" aria-hidden="true">
                          {item.icon}
                        </span>
                        <svg
                          className="size-4 text-[#b2b2b2] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#6d6d6d]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                      <span className="mt-2.5 block text-[9px] font-bold uppercase tracking-[.15em] text-[#8e8e8e]">{item.eyebrow}</span>
                      <span className="mt-0.5 block text-sm font-semibold tracking-tight text-[#353535] transition-colors group-hover:text-[#595959]">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-4 text-[#828282]">
                        {item.detail}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Active Message Thread */
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pb-5 pt-2" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  className={`animate-ai-message flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  key={`${index}-${message.role}`}
                >
                  {message.role === "assistant" ? (
                    <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-2xl bg-[#343434] text-[#e7e7e7] shadow-[0_8px_20px_rgba(0,0,0,.2)]">
                      <SparkIcon className="size-4" />
                    </span>
                  ) : null}

                  <div
                    className={`min-w-0 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "max-w-[min(90%,42rem)] rounded-2xl rounded-br-sm bg-[#f0f0f0] px-4 py-2.5 text-[#404040]"
                        : "group flex-1 py-1 pr-2 text-slate-800"
                    }`}
                  >
                    {message.role === "user" ? (
                      <p className="m-0 whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <>
                        <FormattedContent content={message.content} />
                        {message.pendingAction ? (
                          <div className="mt-5 overflow-hidden rounded-2xl border border-[#d9d9d9] bg-[#f9f9f9]">
                            <div className="border-b border-[#e6e6e6] bg-[#f3f3f3] px-4 py-3">
                              <p className="m-0 text-[10px] font-bold uppercase tracking-[.17em] text-[#6d6d6d]">Approval required</p>
                              <h3 className="m-0 mt-1 text-base font-semibold text-[#343434]">{message.pendingAction.title}</h3>
                              <p className="m-0 mt-1 text-xs text-[#717171]">{message.pendingAction.description}</p>
                            </div>
                            <dl className="m-0 grid gap-3 px-4 py-4 sm:grid-cols-2">
                              {message.pendingAction.fields.map((field) => (
                                <div className={field.label === "Instructions" ? "sm:col-span-2" : ""} key={field.label}>
                                  <dt className="text-[10px] font-bold uppercase tracking-[.13em] text-[#838383]">{field.label}</dt>
                                  <dd className="m-0 mt-1 max-h-36 overflow-auto whitespace-pre-wrap text-xs leading-5 text-[#404040]">{field.value}</dd>
                                </div>
                              ))}
                            </dl>
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e6e6e6] px-4 py-3">
                              <span className="text-[11px] text-[#7e7e7e]">Nothing changes until you approve.</span>
                              <div className="flex gap-2">
                                <button className="rounded-xl border border-[#d8d8d8] bg-white px-3 py-2 text-xs font-semibold text-[#585858] transition hover:bg-[#f3f3f3] disabled:opacity-50" type="button" disabled={Boolean(reviewingActionId)} onClick={() => void decideAction(message.pendingAction!.id, false)}>Cancel</button>
                                <button className="rounded-xl bg-[#575757] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_6px_15px_rgba(0,0,0,.22)] transition hover:-translate-y-0.5 hover:bg-[#474747] disabled:opacity-50" type="button" disabled={Boolean(reviewingActionId)} onClick={() => void decideAction(message.pendingAction!.id, true)}>{reviewingActionId === message.pendingAction.id ? "Saving…" : "Approve change"}</button>
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
                  <span className="animate-ai-glow mt-1 grid size-8 shrink-0 place-items-center rounded-xl border border-[#cccccc] bg-gradient-to-tr from-[#f4f4f4] to-[#eaeaea] text-[#6d6d6d] shadow-xs">
                    <SparkIcon className="size-4" />
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl rounded-tl-xs border border-[#e5e5e5] bg-white px-4 py-3 text-xs font-medium text-slate-600 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="animate-ai-dot-1 size-2 rounded-full bg-[#6d6d6d]" />
                      <span className="animate-ai-dot-2 size-2 rounded-full bg-[#6d6d6d]" />
                      <span className="animate-ai-dot-3 size-2 rounded-full bg-[#6d6d6d]" />
                    </div>
                    <span>Searching workspace data & generating response…</span>
                  </div>
                </div>
              ) : null}

              {error ? (
                <div className="animate-ai-message ml-11 rounded-xl border border-neutral-300 bg-neutral-100 px-4 py-3 text-xs font-medium text-neutral-800 shadow-xs" role="alert">
                  {error}
                </div>
              ) : null}

              <div ref={bottomRef} />
            </div>
          )}

          {/* Floating Prompt Area with Claude/ChatGPT Style Seamless Design & Shadow */}
          <div className="z-20 w-full shrink-0 border-t border-[#e7e7e7] bg-[#f9f9f9]/95 pt-3">
            <form
              className="ai-prompt-container ask-vozon-prompt relative rounded-[20px] border border-[#e3e3e3] bg-white/95 px-3.5 py-2.5 backdrop-blur-xl sm:px-4"
              onSubmit={(event) => void submitMessage(event)}
            >
              <label className="sr-only" htmlFor="ask-vozon-input">
                Ask your personal AI assistant
              </label>

              {/* Completely borderless, seamless textarea */}
              <textarea
                ref={textareaRef}
                className="ai-prompt-textarea block max-h-32 min-h-[36px] w-full text-[15px] leading-relaxed text-[#202020] placeholder:text-[#9c9c9c] sm:text-base"
                id="ask-vozon-input"
                maxLength={2000}
                placeholder="Ask about campaigns, follow ups, calls, or an agent…"
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

              {/* Seamless Action Bar with Claude-style Round Send Button */}
              <div className="mt-1 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f4f4] px-3 py-1 text-xs font-semibold text-[#606060]">
                    <SparkIcon className="size-3 text-[#6d6d6d]" />
                    Connected to your workspace
                  </span>
                  <span className="hidden text-xs text-[#9b9b9b] sm:inline">
                    Press ↵ to send · Shift+↵ for newline
                  </span>
                </div>

                <button
                  className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                    draft.trim() && !busy
                      ? "bg-[#6d6d6d] text-white shadow-md shadow-[#6d6d6d]/30 hover:scale-105 hover:bg-[#595959] active:scale-95 cursor-pointer"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                  }`}
                  type="submit"
                  disabled={busy || !draft.trim()}
                  title={draft.trim() ? "Send message (Enter)" : "Type a message to send"}
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </form>

            <p className="mx-auto mb-0 mt-1 text-center text-[10px] leading-4 text-[#969696]">
              Grounded in workspace data · Agent changes require your approval
            </p>
          </div>
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
