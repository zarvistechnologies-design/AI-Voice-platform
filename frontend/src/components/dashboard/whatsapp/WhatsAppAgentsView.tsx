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
    config.welcomeMessage || "👋 Hello! Welcome to Vozon AI. How can I assist you with your health appointments today?",
  );
  const [fallbackMessage, setFallbackMessage] = useState(
    config.fallbackMessage || "Connecting you with our medical coordinator. Please stay on the line.",
  );
  const [keywords, setKeywords] = useState(
    config.transferKeywords?.join(", ") || "human, agent, doctor, help, appointment",
  );
  const [businessHoursOnly, setBusinessHoursOnly] = useState(config.businessHoursOnly ?? false);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState("");

  // Live Simulator state
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
      setSavedNotice("WhatsApp Agent settings saved successfully!");
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
        reply = "Our plans start at ₹999/mo for up to 5,000 monthly voice minutes. Would you like a live walkthrough with our enterprise specialist?";
      } else if (lower.includes("appointment") || lower.includes("book") || lower.includes("schedule")) {
        reply = "📅 I can help book your clinic visit! We have slots open tomorrow at 10:30 AM or 4:00 PM. Which works best for you?";
      } else if (lower.includes("time") || lower.includes("hours")) {
        reply = "Our clinic is open Monday through Saturday from 9:00 AM to 7:00 PM.";
      } else {
        reply = "Thank you for reaching out! Our autonomous voice bot can also give you an instant callback if you'd like to talk directly over the phone.";
      }

      setSimMessages([...newMsgList, { sender: "bot", text: reply, time: botTime }]);
    }, 700);
  }

  return (
    <div className="whatsapp-agents space-y-5">
      {/* Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dbe4e1] bg-white p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#14231f]">Assistant settings</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${enabled ? "bg-emerald-50 text-emerald-700" : "bg-[#f0f3f1] text-[#61756d]"}`}>
            <span className={`size-2 rounded-full ${enabled ? "bg-emerald-500" : "bg-[#9aaba4]"}`} />
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Configuration Form */}
        <div className="space-y-4 lg:col-span-7">
          <form onSubmit={handleSaveSettings} className="rounded-3xl border border-[#dbe4e1] bg-white p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-[#14231f] border-b border-[#e5e7ef] pb-3">
              Automated Response & Handover Policies
            </h3>

            {savedNotice && (
              <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold">
                ✓ {savedNotice}
              </div>
            )}

            {/* Toggle Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-[#dbe4e1] bg-[#f9fbfa] p-3.5">
                <div>
                  <span className="block text-xs font-bold text-[#14231f]">Enable WhatsApp Agent</span>
                  <span className="text-[11px] text-[#60716c]">Allow the AI engine to listen and reply to incoming chats.</span>
                </div>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="size-4 accent-[#118778]"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#dbe4e1] bg-[#f9fbfa] p-3.5">
                <div>
                  <span className="block text-xs font-bold text-[#14231f]">Auto-Reply Mode</span>
                  <span className="text-[11px] text-[#60716c]">Automatically respond to new customer inquiries instantly.</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReply}
                  onChange={(e) => setAutoReply(e.target.checked)}
                  className="size-4 accent-[#118778]"
                />
              </div>
            </div>

            {/* Welcome Greeting */}
            <div>
              <label className="block text-xs font-semibold text-[#445550]">
                Welcome Greeting Message
              </label>
              <textarea
                rows={3}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] p-3 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-[#84938f]">Sent whenever a new customer initiates a conversation.</span>
            </div>

            {/* Human Handover Keywords */}
            <div>
              <label className="block text-xs font-semibold text-[#445550]">
                Human Handover Trigger Keywords (comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="human, agent, representative, emergency"
                className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-[#84938f]">
                When any of these keywords are detected, the AI will pause and switch the conversation to human agent takeover.
              </span>
            </div>

            {/* Handover Fallback Message */}
            <div>
              <label className="block text-xs font-semibold text-[#445550]">
                Handover Notice Message
              </label>
              <input
                type="text"
                value={fallbackMessage}
                onChange={(e) => setFallbackMessage(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end border-t border-[#e5e7ef] pt-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#118778] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0e7467] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Agent Configuration"}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Chat Simulator Console */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 rounded-3xl border border-[#dbe4e1] bg-white p-5 shadow-xs flex flex-col">
            <div className="mb-3 flex items-center justify-between border-b border-[#edf2f0] pb-3">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-xl bg-[#118778]/10 text-sm">
                  🤖
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#14231f]">Live Agent Testing Console</h4>
                  <span className="text-[10px] text-[#71817d]">Real-time auto-pilot response simulation</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSimMessages([{ sender: "bot", text: welcomeMessage, time: "Just now" }])}
                className="rounded-lg px-2 py-1 text-[11px] font-semibold text-[#71817d] hover:bg-[#f4f7f6] hover:text-[#14231f]"
              >
                Reset Chat
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex flex-col h-[380px] rounded-2xl border border-[#e5ece8] bg-[#f9fbfa] p-3 overflow-y-auto space-y-2.5">
              {simMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === "bot"
                      ? "self-start rounded-tl-none border border-[#d6ebe3] bg-white text-[#14231f]"
                      : "self-end rounded-tr-none bg-[#118778] text-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold opacity-75">
                    <span>{msg.sender === "bot" ? "🤖 AI Assistant" : "👤 Customer"}</span>
                  </div>
                  <div>{msg.text}</div>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                      msg.sender === "bot" ? "text-[#71817d]" : "text-white/80"
                    }`}
                  >
                    <span>{msg.time}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="self-start rounded-2xl rounded-tl-none border border-[#d6ebe3] bg-white px-3 py-2 text-[10px] text-[#71817d] italic">
                  AI Assistant is thinking...
                </div>
              )}
            </div>

            {/* Quick Prompt Pills */}
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 text-[10px]">
              <button
                type="button"
                onClick={() => handleSimSend("What are your plans and pricing?")}
                className="rounded-xl border border-[#dbe4e1] bg-white px-2.5 py-1 text-[#118778] font-semibold hover:bg-[#f0f8f5] whitespace-nowrap"
              >
                Pricing Inquiry
              </button>
              <button
                type="button"
                onClick={() => handleSimSend("I need to book an appointment")}
                className="rounded-xl border border-[#dbe4e1] bg-white px-2.5 py-1 text-[#118778] font-semibold hover:bg-[#f0f8f5] whitespace-nowrap"
              >
                Book Appointment
              </button>
              <button
                type="button"
                onClick={() => handleSimSend("Can I speak with a live human representative?")}
                className="rounded-xl border border-[#dbe4e1] bg-white px-2.5 py-1 text-[#118778] font-semibold hover:bg-[#f0f8f5] whitespace-nowrap"
              >
                Human Handover
              </button>
            </div>

            {/* Chat Input */}
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={simInput}
                onChange={(e) => setSimInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSimSend()}
                placeholder="Type customer reply to test agent..."
                className="flex-1 rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSimSend()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#118778] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0e7467]"
              >
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

