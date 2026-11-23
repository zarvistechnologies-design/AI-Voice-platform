"use client";

import { useEffect, useState } from "react";
import type { WhatsAppConversation, WhatsAppMessage, WhatsAppSupportCase, WhatsAppTemplate } from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";

interface WhatsAppLiveChatViewProps {
  conversations: WhatsAppConversation[];
  templates: WhatsAppTemplate[];
  onRefresh: () => void;
}

export function WhatsAppLiveChatView({
  conversations,
  templates,
  onRefresh,
}: WhatsAppLiveChatViewProps) {
  const [selectedConversation, setSelectedConversation] = useState<WhatsAppConversation | null>(
    conversations[0] || null,
  );
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "UNREAD" | "AI" | "HUMAN">("ALL");
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [activeToolPanel, setActiveToolPanel] = useState<"razorpay" | "calendar" | null>(null);
  const [razorpayAmount, setRazorpayAmount] = useState("999");
  const [razorpayCurrency, setRazorpayCurrency] = useState("INR");
  const [razorpayDesc, setRazorpayDesc] = useState("Booking / Order Payment");
  const [calendarTitle, setCalendarTitle] = useState("Consultation Call");
  const [actionNotice, setActionNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [showMediaComposer, setShowMediaComposer] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "document">("document");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaFilename, setMediaFilename] = useState("");
  const [cases, setCases] = useState<WhatsAppSupportCase[]>([]);
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [caseSubject, setCaseSubject] = useState("");
  const [caseCategory, setCaseCategory] = useState("Support");

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    } else if (selectedConversation && conversations.length > 0) {
      const updated = conversations.find((c) => c._id === selectedConversation._id);
      if (
        updated &&
        (updated.mode !== selectedConversation.mode ||
          updated.unreadCount !== selectedConversation.unreadCount ||
          updated.lastMessageText !== selectedConversation.lastMessageText)
      ) {
        setSelectedConversation(updated);
      }
    }
  }, [conversations, selectedConversation]);

  // Load message history & support cases when selected conversation changes
  useEffect(() => {
    if (!selectedConversation?._id) return;
    let cancelled = false;
    setLoadingMessages(true);

    Promise.all([
      whatsappApi.getMessages(selectedConversation._id),
      whatsappApi.listConversationCases(selectedConversation._id).catch(() => ({ ok: false, cases: [] })),
    ])
      .then(([msgRes, caseRes]) => {
        if (!cancelled && msgRes.ok) {
          setMessages(msgRes.messages || []);
        }
        if (!cancelled && caseRes.ok) {
          setCases(caseRes.cases || []);
        }
      })
      .catch((err) => console.warn("Failed to load messages:", err))
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });

    // The webhook writes inbound messages to the database. Refresh the open
    // transcript periodically so agents see those messages in the active chat.
    const refreshInterval = window.setInterval(() => {
      void whatsappApi
        .getMessages(selectedConversation._id)
        .then((msgRes) => {
          if (!cancelled && msgRes.ok) setMessages(msgRes.messages || []);
        })
        .catch((err) => console.warn("Failed to refresh messages:", err));
    }, 8_000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshInterval);
    };
  }, [selectedConversation?._id]);

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPhone.includes(search) ||
      c.lastMessageText.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === "UNREAD") return c.unreadCount > 0;
    if (filterMode === "AI") return c.mode === "ai";
    if (filterMode === "HUMAN") return c.mode === "human";
    return true;
  });

  async function handleSendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!selectedConversation?._id) return;
    const trimmedContent = messageInput.trim();
    const trimmedMedia = showMediaComposer ? mediaUrl.trim() : "";
    if (!trimmedContent && !trimmedMedia) return;

    setMessageInput("");
    setSending(true);

    try {
      const res = await whatsappApi.sendChatMessage(
        selectedConversation._id,
        trimmedContent,
        trimmedMedia ? mediaType : "text",
        undefined,
        trimmedMedia || undefined,
        trimmedMedia && mediaType === "document" ? mediaFilename.trim() || "document.pdf" : undefined,
      );
      if (res.ok && res.message) {
        setMessages((prev) => [...prev, res.message]);
        if (trimmedMedia) {
          setMediaUrl("");
          setMediaFilename("");
          setShowMediaComposer(false);
        }
        onRefresh();
      }
    } catch (err) {
      setActionNotice({ ok: false, text: err instanceof Error ? err.message : "Failed to send message" });
    } finally {
      setSending(false);
    }
  }

  async function handleCreateCase(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedConversation?._id || !caseSubject.trim()) return;
    setSending(true);
    setActionNotice(null);
    try {
      const res = await whatsappApi.createConversationCase(selectedConversation._id, {
        subject: caseSubject.trim(),
        category: caseCategory,
      });
      if (res.supportCase) setCases((prev) => [res.supportCase, ...prev]);
      if (res.message) setMessages((prev) => [...prev, res.message!]);
      setCaseSubject("");
      setShowCaseForm(false);
      setActionNotice({ ok: true, text: `Support Case ${res.supportCase.caseNumber} created & sent.` });
      onRefresh();
    } catch (err) {
      setActionNotice({ ok: false, text: err instanceof Error ? err.message : "Failed to create support case" });
    } finally {
      setSending(false);
    }
  }

  async function handleUpdateCaseStatus(caseId: string, status: "open" | "in_progress" | "resolved") {
    setSending(true);
    try {
      const res = await whatsappApi.updateSupportCaseStatus(caseId, status);
      if (res.supportCase) {
        setCases((prev) => prev.map((c) => (c._id === caseId ? res.supportCase : c)));
      }
      if (res.message) setMessages((prev) => [...prev, res.message!]);
      setActionNotice({ ok: true, text: `Updated ${res.supportCase.caseNumber} -> ${status}` });
      onRefresh();
    } catch (err) {
      setActionNotice({ ok: false, text: err instanceof Error ? err.message : "Failed to update case" });
    } finally {
      setSending(false);
    }
  }

  async function handleToggleMode() {
    if (!selectedConversation?._id) return;
    const nextMode = selectedConversation.mode === "ai" ? "human" : "ai";
    try {
      const res = await whatsappApi.toggleMode(selectedConversation._id, nextMode);
      if (res.ok && res.conversation) {
        setSelectedConversation(res.conversation);
        onRefresh();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not toggle mode");
    }
  }

  function handleInsertTemplate(bodyText: string) {
    setMessageInput(bodyText);
    setShowTemplatePicker(false);
  }

  async function handleIntegrationAction(
    action: "razorpay_payment_link" | "calendar_booking" | "crm_sync" | "slack_alert",
    override?: { amount?: number; currency?: string; description?: string; title?: string; stage?: string },
  ) {
    if (!selectedConversation?._id) return;
    let payload: {
      action: "razorpay_payment_link" | "calendar_booking" | "crm_sync" | "slack_alert";
      amount?: number;
      currency?: string;
      description?: string;
      title?: string;
      stage?: string;
    } = { action, ...override };

    if (action === "razorpay_payment_link" && !override?.amount) {
      const amount = Number(razorpayAmount);
      if (!Number.isFinite(amount) || amount < 1) {
        setActionNotice({ ok: false, text: "Enter a valid Razorpay amount (minimum 1)." });
        return;
      }
      payload = {
        action,
        amount,
        currency: razorpayCurrency,
        description: razorpayDesc.trim() || "Booking / Order Payment",
      };
    } else if (action === "calendar_booking" && !override?.title) {
      payload = { action, title: calendarTitle.trim() || "Consultation Call" };
    }

    setSending(true);
    setActionNotice(null);
    try {
      const res = await whatsappApi.triggerIntegrationAction(selectedConversation._id, payload);
      if (res.message) {
        setMessages((prev) => [...prev, res.message!]);
      }
      setActiveToolPanel(null);
      setActionNotice({ ok: true, text: res.summary || "Integration executed successfully." });
      onRefresh();
    } catch (err) {
      setActionNotice({ ok: false, text: err instanceof Error ? err.message : "Integration action failed" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="whatsapp-live-chat">
      {/* Main 3-Column Monochrome Inbox */}
      <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-[#eaeaea] bg-white lg:grid-cols-12 min-h-[600px] dark:border-zinc-800 dark:bg-[#121215]">
        {/* Left Column: Conversations List */}
        <div className="border-r border-[#eaeaea] lg:col-span-4 flex flex-col bg-white dark:border-zinc-800 dark:bg-[#121215]">
          {/* Top Search & Filter Bar */}
          <div className="border-b border-[#eaeaea] p-3 space-y-2 bg-white dark:border-zinc-800 dark:bg-[#121215]">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#a1a1aa] dark:text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats by name or phone..."
                className="h-8 w-full rounded-md border border-[#eaeaea] bg-white pl-8 pr-3 text-[12px] text-[#171717] placeholder-[#a1a1aa] focus:border-[#171717] focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-600"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto text-[11px]">
              {(["ALL", "UNREAD", "AI", "HUMAN"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilterMode(mode)}
                  className={`rounded-md px-2.5 py-1 font-medium transition ${
                    filterMode === mode
                      ? "bg-[#171717] text-white dark:bg-white dark:text-black"
                      : "bg-[#f4f4f5] text-[#52525b] hover:bg-[#e4e4e7] dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                  }`}
                >
                  {mode === "ALL"
                    ? "All Chats"
                    : mode === "UNREAD"
                      ? "Unread"
                      : mode === "AI"
                        ? "AI Auto"
                        : "Human"}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#eaeaea] dark:divide-zinc-800">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-[12px] text-[#71717a] dark:text-zinc-400">
                {conversations.length === 0 && !search && filterMode === "ALL"
                  ? "No WhatsApp chats have reached this inbox yet. New messages appear here after Meta delivers them to the webhook."
                  : "No conversations match your filter."}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedConversation?._id === conv._id;
                return (
                  <div
                    key={conv._id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`flex items-start gap-2.5 px-3.5 py-3 cursor-pointer transition ${
                      isSelected
                        ? "bg-[#f0f2f5] border-l-2 border-l-[#00a884] dark:bg-zinc-900 dark:border-l-[#25D366]"
                        : "hover:bg-[#f5f6f6] dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <div className="relative size-8 shrink-0 rounded-full border border-[#00a884]/25 bg-[#d9fdd3] text-[#008069] font-semibold text-[11px] grid place-items-center dark:border-emerald-600/30 dark:bg-emerald-950/70 dark:text-emerald-400">
                      {conv.contactName.slice(0, 2).toUpperCase()}
                      <span className="absolute bottom-0 right-0 size-2 rounded-full border border-white dark:border-zinc-900 bg-[#25D366]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-[12.5px] font-semibold text-[#171717] dark:text-white">
                          {conv.contactName}
                        </span>
                        <span className="text-[10.5px] text-[#71717a] dark:text-zinc-400">
                          {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="truncate text-[11.5px] text-[#52525b] dark:text-zinc-400">
                          {conv.lastMessageText || "No messages yet"}
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded border border-[#eaeaea] bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#52525b] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                          <span
                            className={`size-1.5 rounded-full ${
                              conv.mode === "ai" ? "bg-[#171717] dark:bg-emerald-400" : "bg-[#a1a1aa] dark:bg-zinc-500"
                            }`}
                          />
                          {conv.mode === "ai" ? "AI Active" : "Human Takeover"}
                        </span>

                        {conv.unreadCount > 0 && (
                          <span className="grid size-4 place-items-center rounded-full bg-[#25D366] text-[9px] font-semibold text-white">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Middle Column: Real WhatsApp Inbox Chat Window */}
        <div className="flex flex-col lg:col-span-5 border-r border-[#eaeaea] bg-[#efeae2] dark:border-zinc-800 dark:bg-[#0b141a]">
          {selectedConversation ? (
            <>
              {/* Top Chat Bar */}
              <div className="flex items-center justify-between border-b border-[#e2e5e8] bg-[#f0f2f5] px-4 py-2.5 dark:border-zinc-800 dark:bg-[#121215]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-8 rounded-full border border-[#00a884]/25 bg-[#d9fdd3] text-[#008069] font-semibold text-[11px] grid place-items-center dark:border-emerald-600/30 dark:bg-emerald-950/70 dark:text-emerald-400">
                    {selectedConversation.contactName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-[13px] font-semibold text-[#111b21] dark:text-white">
                      {selectedConversation.contactName}
                    </h3>
                    <span className="block text-[11px] font-mono text-[#667781] dark:text-zinc-400">
                      +{selectedConversation.contactPhone}
                    </span>
                  </div>
                </div>

                {/* Handover Toggle Button */}
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[11.5px] font-medium transition ${
                    selectedConversation.mode === "ai"
                      ? "border-[#d1d7db] bg-white text-[#111b21] hover:bg-[#fafafa] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750"
                      : "border-[#00a884] bg-[#00a884] text-white hover:bg-[#008069] dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  }`}
                >
                  {selectedConversation.mode === "ai" ? "Take Over from AI" : "Hand Back to AI"}
                </button>
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2.5 bg-[#efeae2] dark:bg-[#0b141a]">
                {loadingMessages ? (
                  <div className="grid h-full place-items-center text-[12px] text-[#667781] dark:text-zinc-400">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="grid h-full place-items-center">
                    <span className="rounded-lg bg-white/90 px-3.5 py-2 text-[12px] text-[#54656f] shadow-2xs dark:border dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                      No messages yet in this conversation.
                    </span>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOutbound = msg.direction === "outbound";
                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col max-w-[82%] rounded-lg px-3 py-2 text-[12.5px] leading-relaxed shadow-2xs ${
                          isOutbound
                            ? "self-end rounded-tr-none bg-[#d9fdd3] text-[#111b21] dark:bg-[#005c4b] dark:text-white"
                            : "self-start rounded-tl-none bg-white text-[#111b21] dark:border dark:border-zinc-800 dark:bg-[#202c33] dark:text-zinc-100"
                        }`}
                      >
                        <div className="whitespace-pre-line">{msg.content}</div>
                        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#667781] dark:text-zinc-400">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isOutbound && <span className="font-semibold text-[#53bdeb]">✓✓</span>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Template Picker Menu */}
              {showTemplatePicker && (
                <div className="border-t border-[#e2e5e8] bg-white p-3 dark:border-zinc-800 dark:bg-[#121215]">
                  <div className="mb-2 flex items-center justify-between text-[11.5px] font-semibold text-[#111b21] dark:text-white">
                    <span>Insert Pre-approved Template</span>
                    <button
                      type="button"
                      onClick={() => setShowTemplatePicker(false)}
                      className="text-[#667781] hover:text-[#111b21] dark:text-zinc-400 dark:hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1">
                    {templates.map((t) => (
                      <button
                        key={t._id}
                        type="button"
                        onClick={() => handleInsertTemplate(t.bodyText)}
                        className="w-full text-left rounded-md px-2.5 py-1.5 text-[12px] hover:bg-[#f0f2f5] flex justify-between items-center dark:hover:bg-zinc-800/60"
                      >
                        <span className="font-medium text-[#111b21] dark:text-zinc-200">{t.name}</span>
                        <span className="text-[10.5px] text-[#667781] dark:text-zinc-400">{t.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Attachment Composer */}
              {showMediaComposer && (
                <div className="border-t border-[#dbe4e1] bg-[#f8fbfa] px-3 py-2.5 space-y-2 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center justify-between font-bold text-[#14231f] dark:text-white">
                    <span>Send Image or PDF Document via Meta Cloud API</span>
                    <button type="button" onClick={() => setShowMediaComposer(false)} className="text-[#84938f] dark:text-zinc-400">✕</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value as "image" | "document")}
                      className="rounded-lg border border-[#c6d4d0] bg-white px-2.5 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    >
                      <option value="document">📄 PDF / Document</option>
                      <option value="image">🖼️ Image</option>
                    </select>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://... public image or PDF URL"
                      className="flex-1 min-w-[200px] rounded-lg border border-[#c6d4d0] bg-white px-2.5 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                    />
                    {mediaType === "document" && (
                      <input
                        type="text"
                        value={mediaFilename}
                        onChange={(e) => setMediaFilename(e.target.value)}
                        placeholder="brochure.pdf"
                        className="w-32 rounded-lg border border-[#c6d4d0] bg-white px-2.5 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Message Composer */}
              <div className="border-t border-[#e2e5e8] bg-[#f0f2f5] p-2.5 dark:border-zinc-800 dark:bg-[#121215]">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTemplatePicker((p) => !p)}
                    title="Insert WhatsApp Template"
                    className="grid size-8.5 shrink-0 place-items-center rounded-md border border-[#d1d7db] bg-white text-[#54656f] hover:bg-[#fafafa] hover:text-[#008069] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750"
                  >
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMediaComposer((p) => !p)}
                    title="Attach Image or PDF URL"
                    className={`rounded-xl border p-2 transition ${
                      showMediaComposer
                        ? "border-[#118778] bg-[#e9f5f2] text-[#0d6e62] dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "border-[#dbe4e1] bg-white text-[#52645f] hover:bg-[#f7f9f8] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750"
                    }`}
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>

                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      showMediaComposer
                        ? "Optional caption for your image/PDF..."
                        : selectedConversation.mode === "ai"
                          ? "AI is handling this chat. Type to reply directly..."
                          : "Type a message..."
                    }
                    className="h-9 flex-1 rounded-lg border border-[#e2e5e8] bg-white px-3 text-[12.5px] text-[#111b21] placeholder-[#667781] focus:border-[#00a884] focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500"
                  />

                  <button
                    type="submit"
                    disabled={sending || (!messageInput.trim() && !(showMediaComposer && mediaUrl.trim()))}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-[#00a884] px-3.5 text-[12px] font-medium text-white transition hover:bg-[#008069] dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="grid h-full place-items-center text-[12px] text-[#667781] dark:text-zinc-400">
              Select a conversation to start chatting.
            </div>
          )}
        </div>

        {/* Right Column: Contact Profile & Actions */}
        <div className="lg:col-span-3 p-4 bg-white flex flex-col space-y-4 dark:border-zinc-800 dark:bg-[#121215]">
          {selectedConversation ? (
            <>
              <div className="text-center pb-3.5 border-b border-[#eaeaea] dark:border-zinc-800">
                <div className="mx-auto size-12 rounded-full border border-[#eaeaea] bg-[#f4f4f5] text-[#171717] font-semibold text-[14px] grid place-items-center dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                  {selectedConversation.contactName.slice(0, 2).toUpperCase()}
                </div>
                <h4 className="mt-2.5 text-[13.5px] font-semibold text-[#171717] dark:text-white">
                  {selectedConversation.contactName}
                </h4>
                <span className="font-mono text-[11.5px] text-[#71717a] dark:text-zinc-400">
                  +{selectedConversation.contactPhone}
                </span>
              </div>

              {/* Quick Actions & Integrations */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#71717a] dark:text-zinc-400">
                  Quick Actions & Integrations
                </span>
                <button
                  type="button"
                  disabled={sending}
                  onClick={async () => {
                    if (!selectedConversation?._id) return;
                    setSending(true);
                    setActionNotice(null);
                    try {
                      const res = await whatsappApi.callConversationContact(selectedConversation._id);
                      if (res.message) setMessages((prev) => [...prev, res.message!]);
                      setActionNotice({
                        ok: true,
                        text: `Voice call started with ${res.agentName} (${res.callId})`,
                      });
                      onRefresh();
                    } catch (err) {
                      setActionNotice({
                        ok: false,
                        text: err instanceof Error ? err.message : "Could not initiate voice call",
                      });
                    } finally {
                      setSending(false);
                    }
                  }}
                  className="h-8 w-full flex items-center justify-center gap-1.5 rounded-md bg-[#171717] px-3 text-[12px] font-medium text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Contact (Voice Bot)
                </button>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    disabled={sending}
                    onClick={() => setActiveToolPanel((prev) => (prev === "razorpay" ? null : "razorpay"))}
                    className={`rounded-xl border px-2.5 py-2 text-[11px] font-semibold transition disabled:opacity-50 ${
                      activeToolPanel === "razorpay"
                        ? "border-[#118778] bg-[#e9f5f2] text-[#0d6e62] dark:border-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : "border-[#dbe4e1] bg-[#f9fbfa] text-[#14231f] hover:bg-[#edf6f4] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
                    }`}
                  >
                    ₹ Razorpay Link
                  </button>
                  <button
                    type="button"
                    disabled={sending}
                    onClick={() => setActiveToolPanel((prev) => (prev === "calendar" ? null : "calendar"))}
                    className={`rounded-xl border px-2.5 py-2 text-[11px] font-semibold transition disabled:opacity-50 ${
                      activeToolPanel === "calendar"
                        ? "border-[#118778] bg-[#e9f5f2] text-[#0d6e62] dark:border-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : "border-[#dbe4e1] bg-[#f9fbfa] text-[#14231f] hover:bg-[#edf6f4] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
                    }`}
                  >
                    📅 Calendar / Calendly
                  </button>
                  <button
                    type="button"
                    disabled={sending}
                    onClick={() => void handleIntegrationAction("crm_sync")}
                    className="rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-2.5 py-2 text-[11px] font-semibold text-[#14231f] hover:bg-[#edf6f4] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white disabled:opacity-50"
                  >
                    📊 Sync CRM / Sheet
                  </button>
                  <button
                    type="button"
                    disabled={sending}
                    onClick={() => void handleIntegrationAction("slack_alert")}
                    className="rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-2.5 py-2 text-[11px] font-semibold text-[#14231f] hover:bg-[#edf6f4] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white disabled:opacity-50"
                  >
                    🔔 Notify Slack
                  </button>
                </div>

                {activeToolPanel === "razorpay" && (
                  <div className="rounded-2xl border border-[#cde0dc] bg-[#f6fbf9] p-3 space-y-2 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="font-bold text-[#0d6e62] dark:text-emerald-400">Send Live Razorpay Payment Link</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <input
                        type="number"
                        min="1"
                        value={razorpayAmount}
                        onChange={(e) => setRazorpayAmount(e.target.value)}
                        placeholder="999"
                        className="col-span-2 rounded-lg border border-[#c6d4d0] bg-white px-2.5 py-1.5 text-xs text-[#14231f] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                      <select
                        value={razorpayCurrency}
                        onChange={(e) => setRazorpayCurrency(e.target.value)}
                        className="rounded-lg border border-[#c6d4d0] bg-white px-2 py-1.5 text-xs text-[#14231f] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={razorpayDesc}
                      onChange={(e) => setRazorpayDesc(e.target.value)}
                      placeholder="Order / booking description"
                      className="w-full rounded-lg border border-[#c6d4d0] bg-white px-2.5 py-1.5 text-xs text-[#14231f] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                    <button
                      type="button"
                      disabled={sending}
                      onClick={() => void handleIntegrationAction("razorpay_payment_link")}
                      className="w-full rounded-xl bg-[#118778] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0d6e62] dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
                    >
                      {sending ? "Creating..." : `Generate & Send (${razorpayCurrency} ${razorpayAmount || "0"})`}
                    </button>
                  </div>
                )}

                {activeToolPanel === "calendar" && (
                  <div className="rounded-2xl border border-[#cde0dc] bg-[#f6fbf9] p-3 space-y-2 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="font-bold text-[#0d6e62] dark:text-emerald-400">Book Google Calendar / Calendly</div>
                    <input
                      type="text"
                      value={calendarTitle}
                      onChange={(e) => setCalendarTitle(e.target.value)}
                      placeholder="Meeting / Consultation title"
                      className="w-full rounded-lg border border-[#c6d4d0] bg-white px-2.5 py-1.5 text-xs text-[#14231f] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                    <button
                      type="button"
                      disabled={sending}
                      onClick={() => void handleIntegrationAction("calendar_booking")}
                      className="w-full rounded-xl bg-[#118778] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0d6e62] dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
                    >
                      {sending ? "Booking..." : "Book & Share Link on WhatsApp"}
                    </button>
                  </div>
                )}

                {actionNotice && (
                  <div
                    className={`rounded-xl px-2.5 py-2 text-[11px] font-medium ${
                      actionNotice.ok
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                    }`}
                  >
                    {actionNotice.text}
                  </div>
                )}
              </div>

              {/* Support Cases */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#84938f] dark:text-zinc-400">
                    Support Cases ({cases.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCaseForm((p) => !p)}
                    className="text-[11px] font-bold text-[#118778] hover:underline dark:text-emerald-400"
                  >
                    {showCaseForm ? "Cancel" : "+ Open Case"}
                  </button>
                </div>

                {showCaseForm && (
                  <form onSubmit={handleCreateCase} className="rounded-xl border border-[#cde0dc] bg-[#f6fbf9] p-2.5 space-y-2 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <input
                      type="text"
                      required
                      value={caseSubject}
                      onChange={(e) => setCaseSubject(e.target.value)}
                      placeholder="Issue / Case subject..."
                      className="w-full rounded-lg border border-[#c6d4d0] bg-white px-2.5 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                    <select
                      value={caseCategory}
                      onChange={(e) => setCaseCategory(e.target.value)}
                      className="w-full rounded-lg border border-[#c6d4d0] bg-white px-2.5 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    >
                      <option value="Support">General Support</option>
                      <option value="Billing">Billing / Refund</option>
                      <option value="Technical">Technical Issue</option>
                      <option value="Booking">Appointment / Order</option>
                    </select>
                    <button
                      type="submit"
                      disabled={sending || !caseSubject.trim()}
                      className="w-full rounded-lg bg-[#118778] py-1.5 text-xs font-bold text-white hover:bg-[#0d6e62] dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
                    >
                      Create Case &amp; Notify Customer
                    </button>
                  </form>
                )}

                {cases.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {cases.map((c) => (
                      <div key={c._id} className="rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] p-2 text-[11px] space-y-1 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-bold text-[#0d6e62] dark:text-emerald-400">{c.caseNumber}</span>
                          <select
                            value={c.status}
                            disabled={sending}
                            onChange={(e) => void handleUpdateCaseStatus(c._id, e.target.value as "open" | "in_progress" | "resolved")}
                            className="rounded-md border border-[#c6d4d0] bg-white px-1.5 py-0.5 text-[10px] font-semibold dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                        <div className="text-[#324640] truncate dark:text-zinc-300">{c.subject}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Conversation Tags */}
              <div className="space-y-1.5">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#71717a] dark:text-zinc-400">
                  Conversation Tags
                </span>
                <div className="flex flex-wrap gap-1">
                  {(selectedConversation.tags || ["Patient", "Inquiry"]).map((tag, i) => (
                    <span
                      key={i}
                      className="rounded border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-[11px] text-[#52525b] dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-[#eaeaea] bg-[#fafafa] p-3 text-[11.5px] space-y-1 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="text-[10.5px] font-semibold text-[#71717a] uppercase dark:text-zinc-400">
                  Session Status
                </div>
                <div className="flex items-center gap-1.5 text-[#171717] font-medium dark:text-white">
                  <span className="size-1.5 rounded-full bg-[#171717] dark:bg-emerald-400" />
                  24-Hour Service Window Active
                </div>
                <div className="text-[11px] text-[#71717a] dark:text-zinc-400">
                  Customer service messaging window open.
                </div>
              </div>
            </>
          ) : (
            <div className="text-[12px] text-[#71717a] dark:text-zinc-400">Select a chat to view contact details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
