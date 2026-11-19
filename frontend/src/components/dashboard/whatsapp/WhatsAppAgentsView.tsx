"use client";

import { useState } from "react";
import type { WhatsAppAgentConfig } from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";

interface WhatsAppAgentsViewProps {
  config: WhatsAppAgentConfig;
  onRefresh: () => void;
}

export function WhatsAppAgentsView({ config, onRefresh }: WhatsAppAgentsViewProps) {
  const [enabled, setEnabled] = useState(config.enabled ?? true);
  const [autoReply, setAutoReply] = useState(config.autoReply ?? true);
  const [welcomeMessage, setWelcomeMessage] = useState(
    config.welcomeMessage || "Hello! Welcome to Vozon AI. How can I assist you today?",
  );
  const [fallbackMessage, setFallbackMessage] = useState(
    config.fallbackMessage || "Connecting you with our specialist. Please stay on the line.",
  );
  const [keywords, setKeywords] = useState(
    config.transferKeywords?.join(", ") || "human, agent, doctor, help, appointment",
  );
  const [businessHoursOnly, setBusinessHoursOnly] = useState(config.businessHoursOnly ?? false);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState("");

  const [simMessages, setSimMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    {
      sender: "bot",
      text: welcomeMessage,
      time: "10:30 AM",
    },
  ]);
  const [simInput, setSimInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedNotice("");
    try {
      await whatsappApi.updateAgentConfig({
        enabled,
        autoReply,
        welcomeMessage,
        fallbackMessage,
        transferKeywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
        businessHoursOnly,
      });
      setSavedNotice("WhatsApp Agent settings saved.");
      onRefresh();
      setTimeout(() => setSavedNotice(""), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function handleSimSend(textToSend?: string) {
    const text = (textToSend || simInput).trim();
    if (!text) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsgList = [...simMessages, { sender: "user" as const, text, time: userTime }];
    setSimMessages(newMsgList);
    setSimInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = text.toLowerCase();
      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      let reply = "";

      const transferList = keywords.split(",").map((k) => k.trim().toLowerCase());
      const hasTransfer = transferList.some((kw) => lower.includes(kw));

      if (hasTransfer) {
        reply = fallbackMessage;
      } else if (lower.includes("pricing") || lower.includes("cost") || lower.includes("rate")) {
        reply = "Our plans use transparent pay-as-you-go pricing. Would you like a walkthrough with our team?";
      } else if (lower.includes("appointment") || lower.includes("book") || lower.includes("schedule")) {
        reply = "I can help book your visit. We have slots open tomorrow at 10:30 AM or 4:00 PM. Which works best for you?";
      } else if (lower.includes("time") || lower.includes("hours")) {
        reply = "We are open Monday through Saturday from 9:00 AM to 7:00 PM.";
      } else {
        reply = "Thank you for reaching out. Our voice agent can also place an instant callback if you prefer to speak by phone.";
      }

      setSimMessages([...newMsgList, { sender: "bot", text: reply, time: botTime }]);
    }, 500);
  }

  return (
    <div className="whatsapp-agents grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* Left: Configuration Form */}
      <form
        onSubmit={handleSaveSettings}
        className="rounded-lg border border-[#eaeaea] bg-white p-5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3">
          <div>
            <h3 className="m-0 text-[13px] font-semibold text-[#171717]">
              Automated Response & Handover Policies
            </h3>
            <p className="mt-0.5 text-[12px] text-[#71717a]">
              Configure how your WhatsApp AI agent greets customers and escalates to a teammate.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eaeaea] bg-[#fafafa] px-2.5 py-0.5 text-[11px] font-medium text-[#171717]">
            <span className={`size-1.5 rounded-full ${enabled ? "bg-[#171717]" : "bg-[#a1a1aa]"}`} />
            {enabled ? "Active" : "Paused"}
          </span>
        </div>

        {savedNotice && (
          <div className="rounded-md border border-[#eaeaea] bg-[#fafafa] px-3 py-2 text-[12px] font-medium text-[#171717]">
            {savedNotice}
          </div>
        )}

        <div className="divide-y divide-[#eaeaea] rounded-md border border-[#eaeaea]">
          <label className="flex cursor-pointer items-center justify-between px-3.5 py-3">
            <div>
              <span className="block text-[12.5px] font-medium text-[#171717]">Enable WhatsApp Agent</span>
              <span className="text-[11.5px] text-[#71717a]">Allow the AI engine to listen and reply to incoming chats.</span>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="size-4 accent-[#171717]"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between px-3.5 py-3">
            <div>
              <span className="block text-[12.5px] font-medium text-[#171717]">Auto-Reply Mode</span>
              <span className="text-[11.5px] text-[#71717a]">Automatically respond to new customer inquiries immediately.</span>
            </div>
            <input
              type="checkbox"
              checked={autoReply}
              onChange={(e) => setAutoReply(e.target.checked)}
              className="size-4 accent-[#171717]"
            />
          </label>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#171717]">
            Welcome Greeting Message
          </label>
          <textarea
            rows={3}
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            className="mt-1 w-full rounded-md border border-[#eaeaea] bg-white p-3 text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
          />
          <span className="mt-0.5 block text-[11px] text-[#71717a]">
            Sent when a new customer starts a conversation.
          </span>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#171717]">
            Human Handover Trigger Keywords (comma separated)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="human, agent, representative, emergency"
            className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#171717]">
            Handover Notice Message
          </label>
          <input
            type="text"
            value={fallbackMessage}
            onChange={(e) => setFallbackMessage(e.target.value)}
            className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
          />
        </div>

        <div className="flex justify-end border-t border-[#eaeaea] pt-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-8 items-center rounded-md bg-[#171717] px-3.5 text-[12.5px] font-medium text-white hover:bg-black disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>

      {/* Right: Clean Simulator Console */}
      <aside className="rounded-lg border border-[#eaeaea] bg-white p-4 flex flex-col space-y-3">
        <div className="flex items-center justify-between border-b border-[#eaeaea] pb-2.5">
          <div>
            <h4 className="m-0 text-[13px] font-semibold text-[#171717]">Simulator</h4>
            <span className="text-[11px] text-[#71717a]">Test auto-reply and keyword handoffs</span>
          </div>
          <button
            type="button"
            onClick={() => setSimMessages([{ sender: "bot", text: welcomeMessage, time: "Just now" }])}
            className="rounded border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-[11px] font-medium text-[#52525b] hover:text-[#171717]"
          >
            Reset
          </button>
        </div>

        <div className="flex h-[320px] flex-col space-y-2 overflow-y-auto rounded-md border border-[#eaeaea] bg-[#fafafa] p-3">
          {simMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex max-w-[85%] flex-col rounded-lg px-3 py-2 text-[12px] leading-relaxed ${
                msg.sender === "bot"
                  ? "self-start border border-[#eaeaea] bg-white text-[#171717]"
                  : "self-end bg-[#171717] text-white"
              }`}
            >
              <div>{msg.text}</div>
              <span
                className={`mt-1 self-end text-[10px] ${
                  msg.sender === "bot" ? "text-[#71717a]" : "text-white/70"
                }`}
              >
                {msg.time}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="self-start rounded-lg border border-[#eaeaea] bg-white px-3 py-1.5 text-[11px] text-[#71717a]">
              Typing...
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "Pricing", text: "What are your plans and pricing?" },
            { label: "Book Slot", text: "I need to book an appointment" },
            { label: "Human Handover", text: "Can I speak with a live human representative?" },
          ].map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handleSimSend(p.text)}
              className="rounded border border-[#eaeaea] bg-white px-2 py-1 text-[11px] font-medium text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#171717]"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={simInput}
            onChange={(e) => setSimInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSimSend()}
            placeholder="Type a message..."
            className="h-8 flex-1 rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleSimSend()}
            className="inline-flex h-8 items-center rounded-md bg-[#171717] px-3 text-[12.5px] font-medium text-white hover:bg-black"
          >
            Send
          </button>
        </div>
      </aside>
    </div>
  );
}
