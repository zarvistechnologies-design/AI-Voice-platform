"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { DashboardAuthBoundary } from "@/components/dashboard/DashboardAuthBoundary";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSidebar, getDashboardSidebarInitialState } from "@/components/dashboard/DashboardSidebar";
import { getServerSession, getSession, logoutSession, subscribeToSession } from "@/lib/auth";
import { sendAssistantMessage, type AssistantMessage } from "@/lib/assistant";

const suggestions = [
  {
    icon: "🎙️",
    title: "Latest Call Transcript",
    detail: "View verbatim dialog, turn-by-turn speech & caller sentiment",
    prompt: "Show me the verbatim transcript of my latest call, who spoke, and what was said.",
  },
  {
    icon: "📊",
    title: "Summarize Recent Calls",
    detail: "Review statuses, durations, SIP failure diagnostics & outcomes",
    prompt: "Summarize my last 15 calls and tell me their statuses, failure reasons, and key outcomes.",
  },
  {
    icon: "🤖",
    title: "Inspect & Edit Agents",
    detail: "Review system prompts, first greetings, voices & phone routing",
    prompt: "List all voice agents in my workspace and inspect their prompts and current statuses.",
  },
  {
    icon: "⚡",
    title: "What Can You Do?",
    detail: "Explore your copilot's full platform abilities and actions",
    prompt: "What can you answer and do as my personal voice workspace copilot?",
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

function SendIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="m5 12 14-7-5 14-2-6-7-1Z" />
      <path d="m12 13 7-8" />
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
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0e6f62]"
      title="Copy message"
    >
      {copied ? (
        <>
          <svg className="size-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span className="font-semibold text-emerald-600">Copied</span>
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

function FormattedContent({ content }: { content: string }) {
  // Simple paragraph & bold parser to avoid displaying raw markdown asterisks
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-3">
      {paragraphs.map((p, idx) => {
        const lines = p.split(/\n/);
        return (
          <div key={idx} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
              const isNumbered = /^\d+\.\s/.test(line.trim());
              const isHeading = line.trim().startsWith("### ") || line.trim().startsWith("## ");

              const cleanLine = isHeading
                ? line.replace(/^#{2,3}\s*/, "")
                : isBullet
                ? line.replace(/^[-*]\s*/, "")
                : isNumbered
                ? line.replace(/^\d+\.\s*/, "")
                : line;

              // Parse bold segments
              const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g);

              const formattedText = parts.map((part, partIdx) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return <strong key={partIdx} className="font-semibold text-slate-950">{part.slice(2, -2)}</strong>;
                }
                return part;
              });

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
                    <span className="select-none text-[#118778]">{isNumbered ? "•" : "—"}</span>
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
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

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
      const answer = await sendAssistantMessage(nextMessages.slice(-12));
      setMessages((current) => [...current, { role: "assistant", content: answer }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Vozon could not answer right now.");
    } finally {
      setBusy(false);
      window.requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
    }
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f9f8] text-sm font-semibold text-[#71817d]">
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
      className={`dashboard-home-theme grid min-h-screen bg-[#FBFDFB] text-[#14231f] ${
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

      <section className="flex min-h-screen min-w-0 flex-col">
        {/* Workspace Breadcrumbs & Credits Bar (Clean, no redundant headers) */}
        <DashboardPageHeader workspaceBarOnly />

        {/* Main Conversation Container */}
        <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-4 pt-3 sm:px-6">
          {messages.length > 0 ? (
            <div className="flex items-center justify-end pb-2 pt-1">
              <button
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e5e0] bg-white px-3 py-1 text-xs font-semibold text-[#1f4a40] shadow-xs transition hover:border-[#118778] hover:bg-[#edf7f4]"
                type="button"
                onClick={() => {
                  setMessages([]);
                  setError("");
                  setDraft("");
                  textareaRef.current?.focus();
                }}
              >
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New chat
              </button>
            </div>
          ) : null}
          {messages.length === 0 ? (
            /* Empty State: Personal AI Welcome Screen */
            <div className="flex flex-1 flex-col justify-center py-6 sm:py-10">
              <div className="w-full text-center">
                {/* Glowing AI Avatar with Aura */}
                <div className="relative mx-auto mb-5 flex size-16 items-center justify-center">
                  <div className="animate-ai-aura absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#118778]/25 via-emerald-200/40 to-teal-100/30 blur-sm" />
                  <div className="animate-ai-glow relative grid size-14 place-items-center rounded-2xl border border-[#b2dcd2] bg-white text-[#118778] shadow-md shadow-[#118778]/15">
                    <SparkIcon className="size-7" />
                  </div>
                </div>

                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#0d786b]">
                  Personal Workspace Assistant
                </p>
                <h2 className="m-0 text-2xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-3xl">
                  {greeting}, {firstName}
                </h2>
                <p className="mx-auto mb-8 mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
                  How can I help you today? Ask about your recent calls, summarize agent performance, or ask me to draft a new voice agent.
                </p>

                {/* Modern 2x2 Suggestion Cards */}
                <div className="grid gap-3 text-left sm:grid-cols-2">
                  {suggestions.map((item) => (
                    <button
                      className="ai-suggestion-card group relative rounded-2xl border border-[#dfe8e4] bg-white p-4 disabled:opacity-60"
                      type="button"
                      key={item.title}
                      disabled={busy}
                      onClick={() => void submitMessage(undefined, item.prompt)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xl" role="img" aria-hidden="true">
                          {item.icon}
                        </span>
                        <svg
                          className="size-4 text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#118778]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                      <span className="mt-2.5 block text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#0e6f62]">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {item.detail}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Active Message Thread */
            <div className="flex-1 space-y-6 pb-6 pt-2" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  className={`animate-ai-message flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  key={`${index}-${message.role}`}
                >
                  {message.role === "assistant" ? (
                    <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl border border-[#a8d7cb] bg-gradient-to-tr from-[#e8f7f3] to-[#d6f0ea] text-[#118778] shadow-xs">
                      <SparkIcon className="size-4" />
                    </span>
                  ) : null}

                  <div
                    className={`max-w-[min(90%,44rem)] rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "rounded-br-xs bg-gradient-to-r from-[#118778] to-[#0c6b5e] text-white shadow-md shadow-[#118778]/15"
                        : "group rounded-tl-xs border border-[#dfe7e4] bg-white text-slate-800 shadow-[0_2px_10px_rgba(20,40,35,0.03)]"
                    }`}
                  >
                    {message.role === "user" ? (
                      <p className="m-0 whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <>
                        <FormattedContent content={message.content} />
                        <div className="mt-3 flex items-center justify-end border-t border-slate-100 pt-2 opacity-80 transition group-hover:opacity-100">
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
                  <span className="animate-ai-glow mt-1 grid size-8 shrink-0 place-items-center rounded-xl border border-[#a8d7cb] bg-gradient-to-tr from-[#e8f7f3] to-[#d6f0ea] text-[#118778] shadow-xs">
                    <SparkIcon className="size-4" />
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl rounded-tl-xs border border-[#dce8e4] bg-white px-4 py-3 text-xs font-medium text-slate-600 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="animate-ai-dot-1 size-2 rounded-full bg-[#118778]" />
                      <span className="animate-ai-dot-2 size-2 rounded-full bg-[#118778]" />
                      <span className="animate-ai-dot-3 size-2 rounded-full bg-[#118778]" />
                    </div>
                    <span>Searching workspace data & generating response…</span>
                  </div>
                </div>
              ) : null}

              {error ? (
                <div className="animate-ai-message ml-11 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800 shadow-xs" role="alert">
                  {error}
                </div>
              ) : null}

              <div ref={bottomRef} />
            </div>
          )}

          {/* Floating Prompt Area with Claude/ChatGPT Style Seamless Design & Shadow */}
          <div className="sticky bottom-4 z-20 mx-auto w-full max-w-3xl pt-2">
            <form
              className="ai-prompt-container relative rounded-[26px] border border-[#d8e6e2] bg-white p-3.5 sm:p-4"
              onSubmit={(event) => void submitMessage(event)}
            >
              <label className="sr-only" htmlFor="ask-vozon-input">
                Ask your personal AI assistant
              </label>

              {/* Completely borderless, seamless textarea */}
              <textarea
                ref={textareaRef}
                className="ai-prompt-textarea block max-h-48 min-h-[58px] w-full text-[15px] leading-relaxed text-[#14231f] placeholder:text-[#8ea09a] sm:text-base"
                id="ask-vozon-input"
                maxLength={2000}
                placeholder="Ask for call transcripts, summarize recent calls, inspect agent prompts, or draft an agent…"
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

              {/* Seamless Action Bar with Claude-style Round Send Button */}
              <div className="mt-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf6f3] px-3 py-1 text-xs font-semibold text-[#0d786b]">
                    <SparkIcon className="size-3 text-[#118778]" />
                    Voice & Workspace AI
                  </span>
                  <span className="hidden text-xs text-[#8e9f9a] sm:inline">
                    Press ↵ to send · Shift+↵ for newline
                  </span>
                </div>

                <button
                  className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                    draft.trim() && !busy
                      ? "bg-[#118778] text-white shadow-md shadow-[#118778]/30 hover:scale-105 hover:bg-[#0d6e62] active:scale-95 cursor-pointer"
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

            <p className="mx-auto mb-0 mt-2 text-center text-[10px] leading-4 text-[#8b9994]">
              Vozon AI reads workspace data and can draft voice agents · Check important details in your dashboard
            </p>
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
