"use client";

import { useEffect, useState } from "react";
import type { WhatsAppConversation, WhatsAppMessage, WhatsAppTemplate } from "@/lib/whatsapp";
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

  useEffect(() => {
    if (!selectedConversation?._id) return;
    let cancelled = false;
    setLoadingMessages(true);

    whatsappApi
      .getMessages(selectedConversation._id)
      .then((res) => {
        if (!cancelled && res.ok) {
          setMessages(res.messages || []);
        }
      })
      .catch((err) => console.warn("Failed to load messages:", err))
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });

    return () => {
      cancelled = true;
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
    if (!messageInput.trim() || !selectedConversation?._id) return;

    const content = messageInput.trim();
    setMessageInput("");
    setSending(true);

    try {
      const res = await whatsappApi.sendChatMessage(selectedConversation._id, content);
      if (res.ok && res.message) {
        setMessages((prev) => [...prev, res.message]);
        onRefresh();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send message");
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

  return (
    <div className="whatsapp-live-chat">
      {/* Main 3-Column Monochrome Inbox */}
      <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-[#eaeaea] bg-white lg:grid-cols-12 min-h-[600px]">
        {/* Left Column: Conversations List */}
        <div className="border-r border-[#eaeaea] lg:col-span-4 flex flex-col bg-white">
          {/* Top Search & Filter Bar */}
          <div className="border-b border-[#eaeaea] p-3 space-y-2 bg-white">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#a1a1aa]"
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
                className="h-8 w-full rounded-md border border-[#eaeaea] bg-white pl-8 pr-3 text-[12px] text-[#171717] placeholder-[#a1a1aa] focus:border-[#171717] focus:outline-none"
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
                      ? "bg-[#171717] text-white"
                      : "bg-[#f4f4f5] text-[#52525b] hover:bg-[#e4e4e7]"
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
          <div className="flex-1 overflow-y-auto divide-y divide-[#eaeaea]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-[12px] text-[#71717a]">
                No conversations match your filter.
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
                        ? "bg-[#f0f2f5] border-l-2 border-l-[#00a884]"
                        : "hover:bg-[#f5f6f6]"
                    }`}
                  >
                    <div className="relative size-8 shrink-0 rounded-full border border-[#00a884]/25 bg-[#d9fdd3] text-[#008069] font-semibold text-[11px] grid place-items-center">
                      {conv.contactName.slice(0, 2).toUpperCase()}
                      <span className="absolute bottom-0 right-0 size-2 rounded-full border border-white bg-[#25D366]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-[12.5px] font-semibold text-[#171717]">
                          {conv.contactName}
                        </span>
                        <span className="text-[10.5px] text-[#71717a]">
                          {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="truncate text-[11.5px] text-[#52525b]">
                          {conv.lastMessageText || "No messages yet"}
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded border border-[#eaeaea] bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#52525b]">
                          <span
                            className={`size-1.5 rounded-full ${
                              conv.mode === "ai" ? "bg-[#171717]" : "bg-[#a1a1aa]"
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
        <div className="flex flex-col lg:col-span-5 border-r border-[#eaeaea] bg-[#efeae2]">
          {selectedConversation ? (
            <>
              {/* Top Chat Bar */}
              <div className="flex items-center justify-between border-b border-[#e2e5e8] bg-[#f0f2f5] px-4 py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-8 rounded-full border border-[#00a884]/25 bg-[#d9fdd3] text-[#008069] font-semibold text-[11px] grid place-items-center">
                    {selectedConversation.contactName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-[13px] font-semibold text-[#111b21]">
                      {selectedConversation.contactName}
                    </h3>
                    <span className="block text-[11px] font-mono text-[#667781]">
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
                      ? "border-[#d1d7db] bg-white text-[#111b21] hover:bg-[#fafafa]"
                      : "border-[#00a884] bg-[#00a884] text-white hover:bg-[#008069]"
                  }`}
                >
                  {selectedConversation.mode === "ai" ? "Take Over from AI" : "Hand Back to AI"}
                </button>
              </div>

              {/* Message Stream */}
              <div
                className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2.5"
                style={{
                  backgroundColor: "#efeae2",
                  backgroundImage:
                    "radial-gradient(rgba(17, 27, 33, 0.045) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              >
                {loadingMessages ? (
                  <div className="grid h-full place-items-center text-[12px] text-[#667781]">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="grid h-full place-items-center">
                    <span className="rounded-lg bg-white/90 px-3.5 py-2 text-[12px] text-[#54656f] shadow-2xs">
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
                            ? "self-end rounded-tr-none bg-[#d9fdd3] text-[#111b21]"
                            : "self-start rounded-tl-none bg-white text-[#111b21]"
                        }`}
                      >
                        <div className="whitespace-pre-line">{msg.content}</div>
                        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#667781]">
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
                <div className="border-t border-[#e2e5e8] bg-white p-3">
                  <div className="mb-2 flex items-center justify-between text-[11.5px] font-semibold text-[#111b21]">
                    <span>Insert Pre-approved Template</span>
                    <button
                      type="button"
                      onClick={() => setShowTemplatePicker(false)}
                      className="text-[#667781] hover:text-[#111b21]"
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
                        className="w-full text-left rounded-md px-2.5 py-1.5 text-[12px] hover:bg-[#f0f2f5] flex justify-between items-center"
                      >
                        <span className="font-medium text-[#111b21]">{t.name}</span>
                        <span className="text-[10.5px] text-[#667781]">{t.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Composer */}
              <div className="border-t border-[#e2e5e8] bg-[#f0f2f5] p-2.5">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTemplatePicker((p) => !p)}
                    title="Insert WhatsApp Template"
                    className="grid size-8.5 shrink-0 place-items-center rounded-md border border-[#d1d7db] bg-white text-[#54656f] hover:bg-[#fafafa] hover:text-[#008069]"
                  >
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>

                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      selectedConversation.mode === "ai"
                        ? "AI is handling this chat. Type to reply directly..."
                        : "Type a message..."
                    }
                    className="h-9 flex-1 rounded-lg border border-[#e2e5e8] bg-white px-3 text-[12.5px] text-[#111b21] placeholder-[#667781] focus:border-[#00a884] focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={sending || !messageInput.trim()}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-[#00a884] px-3.5 text-[12px] font-medium text-white transition hover:bg-[#008069] disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="grid h-full place-items-center text-[12px] text-[#667781]">
              Select a conversation to start chatting.
            </div>
          )}
        </div>

        {/* Right Column: Contact Profile & Actions */}
        <div className="lg:col-span-3 p-4 bg-white flex flex-col space-y-4">
          {selectedConversation ? (
            <>
              <div className="text-center pb-3.5 border-b border-[#eaeaea]">
                <div className="mx-auto size-12 rounded-full border border-[#eaeaea] bg-[#f4f4f5] text-[#171717] font-semibold text-[14px] grid place-items-center">
                  {selectedConversation.contactName.slice(0, 2).toUpperCase()}
                </div>
                <h4 className="mt-2.5 text-[13.5px] font-semibold text-[#171717]">
                  {selectedConversation.contactName}
                </h4>
                <span className="font-mono text-[11.5px] text-[#71717a]">
                  +{selectedConversation.contactPhone}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="space-y-1.5">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#71717a]">
                  Quick Actions
                </span>
                <button
                  type="button"
                  onClick={() =>
                    alert(`Initiating Vozon AI voice call to +${selectedConversation.contactPhone}...`)
                  }
                  className="h-8 w-full flex items-center justify-center gap-1.5 rounded-md bg-[#171717] px-3 text-[12px] font-medium text-white hover:bg-black"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Contact (Voice Bot)
                </button>
              </div>

              {/* Conversation Tags */}
              <div className="space-y-1.5">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#71717a]">
                  Conversation Tags
                </span>
                <div className="flex flex-wrap gap-1">
                  {(selectedConversation.tags || ["Patient", "Inquiry"]).map((tag, i) => (
                    <span
                      key={i}
                      className="rounded border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-[11px] text-[#52525b]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-[#eaeaea] bg-[#fafafa] p-3 text-[11.5px] space-y-1">
                <div className="text-[10.5px] font-semibold text-[#71717a] uppercase">
                  Session Status
                </div>
                <div className="flex items-center gap-1.5 text-[#171717] font-medium">
                  <span className="size-1.5 rounded-full bg-[#171717]" />
                  24-Hour Service Window Active
                </div>
                <div className="text-[11px] text-[#71717a]">
                  Customer service messaging window open.
                </div>
              </div>
            </>
          ) : (
            <div className="text-[12px] text-[#71717a]">Select a chat to view contact details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
