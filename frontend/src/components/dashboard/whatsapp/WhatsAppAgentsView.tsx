"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  WhatsAppAccountItem,
  WhatsAppAgentConfig,
  WhatsAppAgentHandoffRule,
  WhatsAppCustomAgent,
} from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";
import { automationsApi, type AutomationSummary } from "@/lib/automations";
import { voiceApi, type AgentSummary } from "@/lib/voice";

interface WhatsAppAgentsViewProps {
  config: WhatsAppAgentConfig;
  accounts?: WhatsAppAccountItem[];
  onRefresh: () => void;
}

type EditorTab = "identity" | "connections" | "knowledge" | "admin";

interface SimMessage {
  sender: "user" | "bot";
  text: string;
  time: string;
  tag?: string;
}

interface AgentBlueprint {
  id: string;
  title: string;
  role: string;
  badge: string;
  tone: WhatsAppCustomAgent["tone"];
  language: string;
  welcomeMessage: string;
  systemPrompt: string;
  knowledgeText: string;
  triggerKeywords: string[];
  transferKeywords: string[];
  fallbackMessage: string;
}

const AGENT_BLUEPRINTS: AgentBlueprint[] = [
  {
    id: "sales",
    title: "Sales & Lead Qualifier",
    role: "Sales",
    badge: "Best for Inbound Leads",
    tone: "consultative",
    language: "English + Hinglish",
    welcomeMessage:
      "👋 Hi! Welcome to our team. Tell me what you're looking for and I'll share the best plan or book a quick demo for you.",
    systemPrompt:
      "You are a warm, high-converting WhatsApp Sales Specialist. Qualify leads by understanding their business need, team size, and timeline. Share clear value, answer pricing questions from the Knowledge Sheet, and invite qualified leads to book a demo or reply 'call me' for an instant AI voice callback.",
    knowledgeText:
      "Plans: Starter (₹2,999/mo), Growth (₹7,999/mo), Enterprise (Custom).\nDemo slots: Mon–Sat, 10 AM – 7 PM IST.\nFree onboarding included on Growth & Enterprise plans.",
    triggerKeywords: ["pricing", "price", "demo", "buy", "plan", "quote"],
    transferKeywords: ["manager", "human", "sales rep", "negotiate"],
    fallbackMessage: "Connecting you with a senior sales advisor right now. They'll reply shortly!",
  },
  {
    id: "support",
    title: "24/7 Support Desk AI",
    role: "Support",
    badge: "Fast Ticket Resolution",
    tone: "friendly",
    language: "English + Hinglish",
    welcomeMessage:
      "Hi! I'm your 24/7 Support Assistant. Share your issue or CASE number and I'll help resolve it right away.",
    systemPrompt:
      "You are an empathetic WhatsApp Customer Support Agent. Troubleshoot issues step-by-step using the Knowledge Sheet. Keep replies calm, clear, and under 80 words. If the user has an urgent billing/outage issue or asks for a human, escalate immediately.",
    knowledgeText:
      "Support Hours: 24/7 AI, Live human desk 9 AM – 8 PM IST.\nRefund Policy: Eligible within 7 days of purchase.\nTo check ticket status, customers can send their CASE-xxxx number anytime.",
    triggerKeywords: ["issue", "problem", "refund", "complaint", "broken", "not working"],
    transferKeywords: ["human", "agent", "supervisor", "escalate", "urgent"],
    fallbackMessage: "I'm escalating your chat to a live support specialist now. Please stay with us!",
  },
  {
    id: "booking",
    title: "Clinic / Appointment Booker",
    role: "Booking",
    badge: "Clinics, Salons & Consultants",
    tone: "friendly",
    language: "English + Hinglish",
    welcomeMessage:
      "Hello! Welcome to our Appointment Desk. Share the service you need and your preferred day/time to lock in your slot.",
    systemPrompt:
      "You are a polite Reception & Appointment Booking Assistant on WhatsApp. Collect the customer's full name, preferred service/doctor, and preferred date & time. Confirm clearly and share clinic timings from the Knowledge Sheet.",
    knowledgeText:
      "Timings: Mon–Sat, 9:30 AM – 7:30 PM (Lunch 1:30–2:30 PM).\nConsultation Fee: ₹500 (payable at clinic or via Razorpay link).\nSame-day slots available subject to confirmation.",
    triggerKeywords: ["appointment", "book", "slot", "visit", "doctor", "schedule"],
    transferKeywords: ["doctor", "emergency", "human", "reception"],
    fallbackMessage: "Passing you directly to our front desk coordinator right away.",
  },
  {
    id: "orders",
    title: "Order & Payment Helper",
    role: "Follow-up",
    badge: "E-Commerce & Billing",
    tone: "concise",
    language: "English + Hinglish",
    welcomeMessage:
      "Hi! Need help with an order, invoice, or payment link? Share your order ID or question below.",
    systemPrompt:
      "You are an efficient Order & Billing WhatsApp Assistant. Help customers confirm COD orders, share payment instructions, answer shipping timelines from the Knowledge Sheet, and capture delivery updates accurately.",
    knowledgeText:
      "Standard Delivery: 3–5 business days across India.\nCOD & UPI/Razorpay accepted.\nOrder cancellation allowed before dispatch.",
    triggerKeywords: ["order", "track", "delivery", "payment", "invoice", "cod"],
    transferKeywords: ["human", "billing", "refund", "agent"],
    fallbackMessage: "Routing your request to our billing & dispatch desk. Someone will reply shortly.",
  },
  {
    id: "custom",
    title: "Blank Custom Agent",
    role: "Custom",
    badge: "Start From Scratch",
    tone: "professional",
    language: "English",
    welcomeMessage: "Hello! How can I assist you today?",
    systemPrompt:
      "You are a helpful WhatsApp Business AI assistant. Answer clearly, accurately, and concisely.",
    knowledgeText: "",
    triggerKeywords: [],
    transferKeywords: ["human", "agent", "help"],
    fallbackMessage: "Connecting you with a human teammate. Please wait a moment.",
  },
];

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 ${
        checked ? "border-[#2563eb] bg-[#2563eb]" : "border-[#d4d4d8] bg-[#e4e4e7]"
      }`}
    >
      <span
        className={`inline-block size-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export function WhatsAppAgentsView({
  config,
  accounts = [],
  onRefresh,
}: WhatsAppAgentsViewProps) {
  // Multi-agent roster state
  const [agents, setAgents] = useState<WhatsAppCustomAgent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [editorTab, setEditorTab] = useState<EditorTab>("identity");

  // Draft fields for selected custom agent
  const [draftName, setDraftName] = useState("");
  const [draftRole, setDraftRole] = useState("Sales");
  const [draftStatus, setDraftStatus] = useState<WhatsAppCustomAgent["status"]>("live");
  const [draftIsDefault, setDraftIsDefault] = useState(false);
  const [draftPhoneNumberId, setDraftPhoneNumberId] = useState("");
  const [draftLanguage, setDraftLanguage] = useState("English + Hinglish");
  const [draftTone, setDraftTone] = useState<WhatsAppCustomAgent["tone"]>("friendly");
  const [draftWelcome, setDraftWelcome] = useState("");
  const [draftPrompt, setDraftPrompt] = useState("");
  const [draftKnowledge, setDraftKnowledge] = useState("");
  const [draftVoiceAgentId, setDraftVoiceAgentId] = useState("");
  const [draftAutoReply, setDraftAutoReply] = useState(true);
  const [draftAllowCallback, setDraftAllowCallback] = useState(true);
  const [draftTriggerKeywords, setDraftTriggerKeywords] = useState<string[]>([]);
  const [triggerKwInput, setTriggerKwInput] = useState("");
  const [draftHandoffRules, setDraftHandoffRules] = useState<WhatsAppAgentHandoffRule[]>([]);
  const [newRuleTargetId, setNewRuleTargetId] = useState("");
  const [newRuleKeywords, setNewRuleKeywords] = useState("");
  const [newRuleCondition, setNewRuleCondition] = useState("");
  const [newRuleAnnounce, setNewRuleAnnounce] = useState("");
  const [draftTransferKeywords, setDraftTransferKeywords] = useState<string[]>([]);
  const [transferKwInput, setTransferKwInput] = useState("");
  const [draftFallback, setDraftFallback] = useState("");

  // Workspace-level Guardrails + Admin Bulk Dispatch state
  const [masterEnabled, setMasterEnabled] = useState(config.enabled ?? true);
  const [businessHoursOnly, setBusinessHoursOnly] = useState(config.businessHoursOnly ?? false);
  const [adminPhones, setAdminPhones] = useState<string[]>(
    config.adminDispatchPhones?.filter(Boolean) || [],
  );
  const [adminPhoneInput, setAdminPhoneInput] = useState("");
  const [adminAutomationId, setAdminAutomationId] = useState(config.adminDispatchAutomationId || "");
  const [adminMaxBatch, setAdminMaxBatch] = useState(String(config.adminDispatchMaxBatch ?? 200));

  // Linked workspace resources
  const [automations, setAutomations] = useState<AutomationSummary[]>([]);
  const [voiceAgents, setVoiceAgents] = useState<AgentSummary[]>([]);

  // Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createBlueprintId, setCreateBlueprintId] = useState("sales");
  const [createName, setCreateName] = useState("Sales & Lead Qualifier");
  const [createRole, setCreateRole] = useState("Sales");
  const [createPhoneId, setCreatePhoneId] = useState("");
  const [createLanguage, setCreateLanguage] = useState("English + Hinglish");
  const [createTone, setCreateTone] = useState<WhatsAppCustomAgent["tone"]>("consultative");
  const [createWelcome, setCreateWelcome] = useState(AGENT_BLUEPRINTS[0].welcomeMessage);
  const [createPrompt, setCreatePrompt] = useState(AGENT_BLUEPRINTS[0].systemPrompt);
  const [createKnowledge, setCreateKnowledge] = useState(AGENT_BLUEPRINTS[0].knowledgeText);
  const [creating, setCreating] = useState(false);

  // Action feedback
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");

  // Live Simulator state
  const [simMessages, setSimMessages] = useState<SimMessage[]>([]);
  const [simInput, setSimInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [simActiveAgentId, setSimActiveAgentId] = useState<string>("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const selectedAgent = useMemo(
    () => agents.find((a) => a._id === selectedId) || agents[0] || null,
    [agents, selectedId],
  );

  const otherAgents = useMemo(
    () => agents.filter((a) => a._id !== selectedAgent?._id),
    [agents, selectedAgent],
  );

  const simActiveAgent = useMemo(
    () => agents.find((a) => a._id === simActiveAgentId) || null,
    [agents, simActiveAgentId],
  );

  function loadAgentIntoForm(agent: WhatsAppCustomAgent) {
    setSelectedId(agent._id);
    setSimActiveAgentId("");
    setDraftName(agent.name || "");
    setDraftRole(agent.role || "General");
    setDraftStatus(agent.status || "live");
    setDraftIsDefault(Boolean(agent.isDefault));
    setDraftPhoneNumberId(agent.phoneNumberId || "");
    setDraftLanguage(agent.language || "English + Hinglish");
    setDraftTone(agent.tone || "friendly");
    setDraftWelcome(agent.welcomeMessage || "");
    setDraftPrompt(agent.systemPrompt || "");
    setDraftKnowledge(agent.knowledgeText || "");
    setDraftVoiceAgentId(agent.voiceAgentId || "");
    setDraftAutoReply(agent.autoReply !== false);
    setDraftAllowCallback(agent.allowCallback !== false);
    setDraftTriggerKeywords(agent.triggerKeywords || []);
    setDraftHandoffRules(agent.handoffRules || []);
    setNewRuleTargetId("");
    setNewRuleKeywords("");
    setNewRuleCondition("");
    setNewRuleAnnounce("");
    setDraftTransferKeywords(agent.transferKeywords || ["agent", "human", "help"]);
    setDraftFallback(agent.fallbackMessage || "");
    setTriggerKwInput("");
    setTransferKwInput("");
    setSimMessages([
      {
        sender: "bot",
        text: agent.welcomeMessage || "👋 Welcome! How can I help you today?",
        time: "Now",
        tag: "Greeting",
      },
    ]);
  }

  function handleAddHandoffRule() {
    if (!newRuleTargetId) return;
    const target = otherAgents.find((a) => a._id === newRuleTargetId);
    if (!target) return;
    const keywords = newRuleKeywords
      .split(/[,\n]+/)
      .map((k) => k.trim())
      .filter(Boolean);
    const condition = newRuleCondition.trim();
    if (!keywords.length && !condition) {
      setErrorNotice("Enter at least one trigger keyword or handoff condition.");
      return;
    }
    setErrorNotice("");
    setDraftHandoffRules((prev) => [
      ...prev,
      {
        targetAgentId: target._id,
        targetAgentName: target.name,
        keywords,
        condition,
        announceMessage: newRuleAnnounce.trim(),
      },
    ]);
    setNewRuleTargetId("");
    setNewRuleKeywords("");
    setNewRuleCondition("");
    setNewRuleAnnounce("");
  }

  async function fetchRoster(preserveSelectionId?: string) {
    setLoadingAgents(true);
    try {
      const { agents: list } = await whatsappApi.listCustomAgents();
      setAgents(list);
      const target =
        (preserveSelectionId && list.find((a) => a._id === preserveSelectionId)) ||
        list[0];
      if (target) {
        loadAgentIntoForm(target);
      }
    } catch (err) {
      setErrorNotice(err instanceof Error ? err.message : "Could not load WhatsApp agents.");
    } finally {
      setLoadingAgents(false);
    }
  }

  useEffect(() => {
    void fetchRoster();
    let active = true;
    void automationsApi
      .list()
      .then(({ flows }) => {
        if (active) setAutomations(flows);
      })
      .catch(() => undefined);
    void voiceApi
      .agentSummaries()
      .then(({ agents: vAgents }) => {
        if (active) setVoiceAgents(vAgents);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMasterEnabled(config.enabled ?? true);
    setBusinessHoursOnly(config.businessHoursOnly ?? false);
    setAdminPhones(config.adminDispatchPhones?.filter(Boolean) || []);
    setAdminAutomationId(config.adminDispatchAutomationId || "");
    setAdminMaxBatch(String(config.adminDispatchMaxBatch ?? 200));
  }, [config]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [simMessages, isTyping]);

  function applyBlueprint(bp: AgentBlueprint) {
    setCreateBlueprintId(bp.id);
    setCreateName(bp.title);
    setCreateRole(bp.role);
    setCreateTone(bp.tone);
    setCreateLanguage(bp.language);
    setCreateWelcome(bp.welcomeMessage);
    setCreatePrompt(bp.systemPrompt);
    setCreateKnowledge(bp.knowledgeText);
  }

  function addTagToList(
    raw: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    clearInput: () => void,
  ) {
    const items = raw
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!items.length) return;
    setter((prev) => {
      const seen = new Set(prev.map((x) => x.toLowerCase()));
      const next = [...prev];
      for (const item of items) {
        if (!seen.has(item.toLowerCase())) {
          seen.add(item.toLowerCase());
          next.push(item);
        }
      }
      return next;
    });
    clearInput();
  }

  function addAdminPhonesFromText(raw: string) {
    const items = raw
      .split(/[,\n;\s]+/)
      .map((p) => p.replace(/[^\d+]/g, "").trim())
      .filter((p) => p.replace(/\D/g, "").length >= 10);
    if (!items.length) return;
    setAdminPhones((prev) => {
      const existing = new Set(prev.map((p) => p.replace(/\D/g, "")));
      const merged = [...prev];
      for (const item of items) {
        const digits = item.replace(/\D/g, "");
        const normalized = digits.length === 10 ? `91${digits}` : digits;
        if (!existing.has(normalized) && merged.length < 25) {
          existing.add(normalized);
          merged.push(normalized);
        }
      }
      return merged;
    });
    setAdminPhoneInput("");
  }

  async function handleCreateAgent(e: React.FormEvent) {
    e.preventDefault();
    if (!createName.trim()) return;
    setCreating(true);
    setErrorNotice("");
    const bp = AGENT_BLUEPRINTS.find((b) => b.id === createBlueprintId);
    const matchedAcc = accounts.find((a) => a.phoneNumberId === createPhoneId || a.accountId === createPhoneId);
    try {
      const { agent } = await whatsappApi.createCustomAgent({
        name: createName.trim(),
        role: createRole.trim() || "Custom",
        status: "live",
        phoneNumberId: matchedAcc?.phoneNumberId || createPhoneId || "",
        displayPhoneNumber: matchedAcc?.displayPhoneNumber || "",
        language: createLanguage.trim() || "English + Hinglish",
        tone: createTone,
        welcomeMessage: createWelcome.trim(),
        systemPrompt: createPrompt.trim(),
        knowledgeText: createKnowledge.trim(),
        triggerKeywords: bp?.triggerKeywords || [],
        transferKeywords: bp?.transferKeywords || ["human", "agent", "help"],
        fallbackMessage:
          bp?.fallbackMessage || "I'm passing your conversation to a live specialist. They'll be with you shortly.",
        autoReply: true,
        allowCallback: true,
      });
      setShowCreateModal(false);
      setAgents((prev) => [...prev, agent]);
      loadAgentIntoForm(agent);
      setEditorTab("identity");
      setSavedNotice(`Created "${agent.name}" and set it Live.`);
      setTimeout(() => setSavedNotice(""), 3500);
    } catch (err) {
      setErrorNotice(err instanceof Error ? err.message : "Could not create WhatsApp agent.");
    } finally {
      setCreating(false);
    }
  }

  async function handleSaveSelectedAgent() {
    if (!selectedAgent) return;
    setSaving(true);
    setSavedNotice("");
    setErrorNotice("");

    const finalTriggers = triggerKwInput.trim()
      ? [...draftTriggerKeywords, ...triggerKwInput.split(",").map((k) => k.trim()).filter(Boolean)]
      : draftTriggerKeywords;
    const finalTransfers = transferKwInput.trim()
      ? [...draftTransferKeywords, ...transferKwInput.split(",").map((k) => k.trim()).filter(Boolean)]
      : draftTransferKeywords;

    const matchedAcc = accounts.find(
      (a) => a.phoneNumberId === draftPhoneNumberId || a.accountId === draftPhoneNumberId,
    );

    try {
      const { agent } = await whatsappApi.updateCustomAgent(selectedAgent._id, {
        name: draftName.trim(),
        role: draftRole.trim() || "Custom",
        status: draftStatus,
        isDefault: draftIsDefault,
        phoneNumberId: matchedAcc?.phoneNumberId || draftPhoneNumberId || "",
        displayPhoneNumber: matchedAcc?.displayPhoneNumber || "",
        language: draftLanguage.trim(),
        tone: draftTone,
        welcomeMessage: draftWelcome,
        systemPrompt: draftPrompt,
        knowledgeText: draftKnowledge,
        voiceAgentId: draftVoiceAgentId,
        autoReply: draftAutoReply,
        allowCallback: draftAllowCallback,
        triggerKeywords: Array.from(new Set(finalTriggers)),
        handoffRules: draftHandoffRules,
        transferKeywords: Array.from(new Set(finalTransfers)),
        fallbackMessage: draftFallback,
      });
      setAgents((prev) =>
        prev.map((item) => {
          if (item._id === agent._id) return agent;
          return agent.isDefault ? { ...item, isDefault: false } : item;
        }),
      );
      if (triggerKwInput.trim()) addTagToList(triggerKwInput, setDraftTriggerKeywords, () => setTriggerKwInput(""));
      if (transferKwInput.trim()) addTagToList(transferKwInput, setDraftTransferKeywords, () => setTransferKwInput(""));
      setSavedNotice(`Saved "${agent.name}" changes.`);
      setTimeout(() => setSavedNotice(""), 3500);
    } catch (err) {
      setErrorNotice(err instanceof Error ? err.message : "Failed to save WhatsApp agent.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAdminGuardrails() {
    setSaving(true);
    setSavedNotice("");
    setErrorNotice("");
    const finalAdminPhones = adminPhoneInput.trim()
      ? [
          ...adminPhones,
          ...adminPhoneInput
            .split(/[,\n;\s]+/)
            .map((p) => p.replace(/\D/g, ""))
            .filter((p) => p.length >= 10),
        ]
      : adminPhones;

    try {
      await whatsappApi.updateAgentConfig({
        enabled: masterEnabled,
        businessHoursOnly,
        adminDispatchPhones: Array.from(new Set(finalAdminPhones)),
        adminDispatchAutomationId: adminAutomationId,
        adminDispatchMaxBatch: Math.min(500, Math.max(1, Number(adminMaxBatch) || 200)),
      });
      if (adminPhoneInput.trim()) addAdminPhonesFromText(adminPhoneInput);
      setSavedNotice("Workspace guardrails & Admin Bulk Dispatch saved.");
      onRefresh();
      setTimeout(() => setSavedNotice(""), 3500);
    } catch (err) {
      setErrorNotice(err instanceof Error ? err.message : "Failed to save workspace guardrails.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAgent(agent: WhatsAppCustomAgent) {
    if (!window.confirm(`Delete WhatsApp AI Agent "${agent.name}"?`)) return;
    setErrorNotice("");
    try {
      await whatsappApi.deleteCustomAgent(agent._id);
      const remaining = agents.filter((a) => a._id !== agent._id);
      setAgents(remaining);
      if (remaining.length > 0) {
        loadAgentIntoForm(remaining[0]);
      } else {
        void fetchRoster();
      }
      setSavedNotice(`Deleted "${agent.name}".`);
      setTimeout(() => setSavedNotice(""), 3000);
    } catch (err) {
      setErrorNotice(err instanceof Error ? err.message : "Could not delete agent.");
    }
  }

  async function handleSimSend(textToSend?: string) {
    const text = (textToSend || simInput).trim();
    if (!text || isTyping) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const nextHistory: SimMessage[] = [...simMessages, { sender: "user", text, time: userTime }];
    setSimMessages(nextHistory);
    setSimInput("");
    setIsTyping(true);

    const botTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Local preview for Admin Bulk Dispatch command
    const phoneMatches = text.match(/(?:\+?\d[\d\s-]{8,14}\d)/g) || [];
    if (phoneMatches.length >= 2 || /^call\s+\+?\d/i.test(text)) {
      setTimeout(() => {
        setIsTyping(false);
        const wfName =
          automations.find((f) => f._id === adminAutomationId)?.name || "Latest Live Workflow";
        const reply =
          adminPhones.length > 0
            ? `🔒 Admin Bulk Dispatch Ready (${phoneMatches.length} numbers) → Workflow "${wfName}". Reply CONFIRM 4821 within 10 minutes to start calling, or CANCEL.`
            : "Bulk dispatch is strictly restricted to Authorized Admin numbers. Add your admin number in the Admin Bulk Call tab to enable.";
        setSimMessages((prev) => [
          ...prev,
          { sender: "bot", text: reply, time: botTime(), tag: adminPhones.length > 0 ? "Admin 2-Step Gate" : "Blocked" },
        ]);
      }, 350);
      return;
    }

    if (!masterEnabled || draftStatus !== "live") {
      setTimeout(() => {
        setIsTyping(false);
        setSimMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: !masterEnabled
              ? "(Workspace WhatsApp AI is paused under Admin & Guardrails.)"
              : `("${draftName}" is currently ${draftStatus} — switch status to Live to reply automatically.)`,
            time: botTime(),
            tag: "Paused",
          },
        ]);
      }, 300);
      return;
    }

    try {
      const targetSimId = simActiveAgentId || selectedAgent?._id || "preview";
      const isHandedOffMode = Boolean(simActiveAgentId && simActiveAgentId !== selectedAgent?._id);
      const res = await whatsappApi.simulateCustomAgent(targetSimId, {
        message: text,
        contactName: "Test Customer",
        history: simMessages.slice(-6).map((m) => ({
          role: m.sender === "bot" ? "assistant" : "user",
          content: m.text,
        })),
        draft: isHandedOffMode
          ? undefined
          : {
              name: draftName,
              role: draftRole,
              language: draftLanguage,
              tone: draftTone,
              welcomeMessage: draftWelcome,
              systemPrompt: draftPrompt,
              knowledgeText: draftKnowledge,
              voiceAgentId: draftVoiceAgentId,
              allowCallback: draftAllowCallback,
              handoffRules: draftHandoffRules,
              transferKeywords: draftTransferKeywords,
              fallbackMessage: draftFallback,
            },
      });
      if (res.handedOffToAgentId) {
        setSimActiveAgentId(res.handedOffToAgentId);
      }
      setSimMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.reply, time: botTime(), tag: res.tag || "Live AI Reply" },
      ]);
    } catch (err) {
      setSimMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: err instanceof Error ? err.message : "Could not simulate reply right now.",
          time: botTime(),
          tag: "Notice",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  const liveAgentCount = agents.filter((a) => a.status === "live").length;

  return (
    <div className="whatsapp-agents space-y-5">
      {/* Top Studio Header + Roster Strip */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">
        <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#2563eb] text-white shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="m-0 text-[15px] font-semibold tracking-tight text-[#111827]">
                  WhatsApp AI Agents Studio
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-2.5 py-0.5 text-[11px] font-medium text-[#1d4ed8]">
                  {liveAgentCount} Live · {agents.length} Total
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    masterEnabled
                      ? "border border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]"
                      : "border border-[#e4e4e7] bg-[#f4f4f5] text-[#52525b]"
                  }`}
                >
                  <span className={`size-1.5 rounded-full ${masterEnabled ? "bg-[#16a34a]" : "bg-[#a1a1aa]"}`} />
                  {masterEnabled ? "Engine Active" : "Engine Paused"}
                </span>
              </div>
              <p className="m-0 mt-1 text-[12px] text-[#6b7280]">
                Create specialized WhatsApp AI agents for Sales, Support, or Bookings — bind each to a WhatsApp line, custom prompt, knowledge sheet, and Voice Agent.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {savedNotice && (
              <span className="inline-flex items-center gap-1 rounded-md border border-[#bfdbfe] bg-[#eff6ff] px-2.5 py-1.5 text-[12px] font-medium text-[#1d4ed8]">
                ✓ {savedNotice}
              </span>
            )}
            {errorNotice && (
              <span className="inline-flex items-center rounded-md border border-[#fecaca] bg-[#fef2f2] px-2.5 py-1.5 text-[12px] font-medium text-[#dc2626]">
                {errorNotice}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                applyBlueprint(AGENT_BLUEPRINTS[0]);
                setCreatePhoneId("");
                setShowCreateModal(true);
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#2563eb] px-4 text-[12.5px] font-medium text-white shadow-xs transition hover:bg-[#1d4ed8]"
            >
              <span>+</span>
              <span>Create WhatsApp Agent</span>
            </button>
          </div>
        </div>

        {/* Multi-Agent Roster Cards */}
        <div className="mt-4 border-t border-[#f1f5f9] pt-4">
          {loadingAgents ? (
            <div className="py-4 text-[12.5px] text-[#6b7280]">Loading WhatsApp AI agents...</div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {agents.map((agent) => {
                const isSelected = selectedAgent?._id === agent._id;
                const statusDot =
                  agent.status === "live"
                    ? "bg-[#16a34a]"
                    : agent.status === "draft"
                    ? "bg-[#f59e0b]"
                    : "bg-[#9ca3af]";
                return (
                  <button
                    key={agent._id}
                    type="button"
                    onClick={() => {
                      loadAgentIntoForm(agent);
                      if (editorTab === "admin") setEditorTab("identity");
                    }}
                    className={`whatsapp-agent-card group flex flex-col justify-between rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? "border-[#2563eb] bg-[#eff6ff]/50 ring-2 ring-[#2563eb]/15"
                        : "border-[#e5e7eb] bg-[#fafafa] hover:border-[#93c5fd] hover:bg-white"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold ${
                            isSelected
                              ? "bg-[#2563eb] text-white"
                              : "bg-[#e5e7eb] text-[#111827]"
                          }`}
                        >
                          {agent.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-semibold text-[#111827]">
                            {agent.name}
                          </div>
                          <div className="whatsapp-agent-muted flex items-center gap-1.5 text-[11px] text-[#6b7280]">
                            <span>{agent.role || "General"}</span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1 capitalize">
                              <span className={`size-1.5 rounded-full ${statusDot}`} />
                              {agent.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      {agent.isDefault && (
                        <span className="whatsapp-agent-default shrink-0 rounded-full border border-[#bfdbfe] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#1d4ed8]">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="whatsapp-agent-muted mt-2.5 flex w-full items-center justify-between gap-2 border-t border-[#e5e7eb]/70 pt-2 text-[11px] text-[#6b7280]">
                      <span className="truncate font-mono">
                        {agent.displayPhoneNumber || "All WhatsApp Lines"}
                      </span>
                      <div className="flex shrink-0 items-center gap-1">
                        {(agent.handoffRules?.length ?? 0) > 0 && (
                          <span className="rounded border border-[#bfdbfe] bg-[#eff6ff] px-1.5 py-0.5 text-[10px] font-medium text-[#1d4ed8]">
                            ⇄ {agent.handoffRules?.length} linked
                          </span>
                        )}
                        {agent.triggerKeywords?.length > 0 && (
                          <span className="rounded bg-white px-1.5 py-0.5 text-[10px] text-[#4b5563] border border-[#e5e7eb]">
                            {agent.triggerKeywords.length} triggers
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Quick "+ Add Agent" Card */}
              <button
                type="button"
                onClick={() => {
                  applyBlueprint(AGENT_BLUEPRINTS[0]);
                  setCreatePhoneId("");
                  setShowCreateModal(true);
                }}
                className="flex min-h-[92px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#cbd5e1] bg-white p-3 text-[12px] font-medium text-[#2563eb] transition hover:border-[#2563eb] hover:bg-[#eff6ff]/40"
              >
                <span className="text-[18px] leading-none">+</span>
                <span>New WhatsApp Agent</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Split Workspace: Left Selected Agent Studio | Right Live AI Phone Simulator */}
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Left: Selected Agent Editor & Admin Bulk Dispatch */}
        <div className="rounded-xl border border-[#e5e7eb] bg-white">
          {/* Editor Sub-Navigation & Save Bar */}
          <div className="flex flex-col gap-3 border-b border-[#f1f5f9] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-fit flex-wrap rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-1">
              {(
                [
                  { id: "identity", label: "Identity & Prompt" },
                  { id: "connections", label: `⇄ Connected Agents (${draftHandoffRules.length})` },
                  { id: "knowledge", label: "Knowledge & Handover" },
                  { id: "admin", label: `🔒 Admin Bulk (${adminPhones.length})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEditorTab(tab.id)}
                  className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition ${
                    editorTab === tab.id
                      ? "bg-[#2563eb] text-white shadow-xs"
                      : "text-[#4b5563] hover:text-[#111827]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {editorTab !== "admin" && selectedAgent && agents.length > 1 && (
                <button
                  type="button"
                  onClick={() => void handleDeleteAgent(selectedAgent)}
                  className="inline-flex h-8 items-center rounded-lg border border-[#fecaca] bg-white px-3 text-[12px] font-medium text-[#dc2626] hover:bg-[#fef2f2]"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  void (editorTab === "admin"
                    ? handleSaveAdminGuardrails()
                    : handleSaveSelectedAgent())
                }
                className="inline-flex h-8 items-center rounded-lg bg-[#2563eb] px-3.5 text-[12px] font-medium text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editorTab === "admin"
                  ? "Save Guardrails"
                  : "Save Agent"}
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {editorTab === "identity" && selectedAgent && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[12px] font-medium text-[#111827]">
                      Agent Name
                    </label>
                    <input
                      type="text"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      placeholder="e.g. Sales Closer AI"
                      className="mt-1.5 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#111827]">
                      Department / Role
                    </label>
                    <select
                      value={draftRole}
                      onChange={(e) => setDraftRole(e.target.value)}
                      className="mt-1.5 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-2.5 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                    >
                      <option value="Sales">Sales</option>
                      <option value="Support">Support</option>
                      <option value="Booking">Booking / Reception</option>
                      <option value="Follow-up">Follow-up &amp; Billing</option>
                      <option value="General">General Assistant</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#111827]">
                      Status
                    </label>
                    <select
                      value={draftStatus}
                      onChange={(e) => setDraftStatus(e.target.value as WhatsAppCustomAgent["status"])}
                      className="mt-1.5 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-2.5 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                    >
                      <option value="live">● Live (Active)</option>
                      <option value="draft">● Draft</option>
                      <option value="paused">● Paused</option>
                    </select>
                  </div>
                </div>

                {/* Channel Binding + Voice Agent Link + Language/Tone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[12px] font-medium text-[#111827]">
                      Assigned WhatsApp Business Line
                    </label>
                    <select
                      value={draftPhoneNumberId}
                      onChange={(e) => setDraftPhoneNumberId(e.target.value)}
                      className="mt-1.5 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-2.5 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                    >
                      <option value="">All Connected WhatsApp Numbers</option>
                      {accounts.map((acc) => (
                        <option key={acc.phoneNumberId} value={acc.phoneNumberId}>
                          {acc.displayPhoneNumber} — {acc.label || acc.verifiedName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#111827]">
                      Linked Voice AI Agent (Shared KB &amp; Callbacks)
                    </label>
                    <select
                      value={draftVoiceAgentId}
                      onChange={(e) => setDraftVoiceAgentId(e.target.value)}
                      className="mt-1.5 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-2.5 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                    >
                      <option value="">Auto — Primary Live Voice Agent</option>
                      {voiceAgents.map((va) => (
                        <option key={va._id} value={va._id}>
                          {va.name} ({va.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#111827]">
                      Language Style
                    </label>
                    <input
                      type="text"
                      value={draftLanguage}
                      onChange={(e) => setDraftLanguage(e.target.value)}
                      placeholder="English + Hinglish"
                      className="mt-1.5 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#111827]">
                      Conversation Tone
                    </label>
                    <select
                      value={draftTone}
                      onChange={(e) => setDraftTone(e.target.value as WhatsAppCustomAgent["tone"])}
                      className="mt-1.5 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-2.5 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                    >
                      <option value="friendly">Friendly &amp; Warm</option>
                      <option value="professional">Professional &amp; Formal</option>
                      <option value="consultative">Consultative (Sales)</option>
                      <option value="concise">Short &amp; Concise</option>
                    </select>
                  </div>
                </div>

                {/* Behavior Toggles */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-3.5 py-2.5">
                    <div>
                      <div className="text-[12px] font-semibold text-[#111827]">Default Agent</div>
                      <div className="text-[11px] text-[#6b7280]">Handles unmatched chats</div>
                    </div>
                    <ToggleSwitch
                      checked={draftIsDefault}
                      onChange={setDraftIsDefault}
                      label="Default fallback agent"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-3.5 py-2.5">
                    <div>
                      <div className="text-[12px] font-semibold text-[#111827]">Auto-Reply</div>
                      <div className="text-[11px] text-[#6b7280]">Reply automatically 24/7</div>
                    </div>
                    <ToggleSwitch
                      checked={draftAutoReply}
                      onChange={setDraftAutoReply}
                      label="Auto-reply enabled"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-3.5 py-2.5">
                    <div>
                      <div className="text-[12px] font-semibold text-[#111827]">Voice Callback</div>
                      <div className="text-[11px] text-[#6b7280]">Offer &quot;call me&quot; option</div>
                    </div>
                    <ToggleSwitch
                      checked={draftAllowCallback}
                      onChange={setDraftAllowCallback}
                      label="Allow customer callback"
                    />
                  </div>
                </div>

                {/* Welcome Message */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-[12px] font-medium text-[#111827]">
                      Welcome Greeting Message
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setSimMessages([
                          { sender: "bot", text: draftWelcome, time: "Now", tag: "Greeting" },
                        ])
                      }
                      className="text-[11.5px] font-medium text-[#2563eb] hover:underline"
                    >
                      Preview in Simulator →
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={draftWelcome}
                    onChange={(e) => setDraftWelcome(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#d1d5db] bg-white p-3 text-[12.5px] leading-relaxed text-[#111827] focus:border-[#2563eb] focus:outline-none"
                  />
                </div>

                {/* System Prompt / Persona */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-[12px] font-medium text-[#111827]">
                      AI System Prompt &amp; Instructions
                    </label>
                    <span className="font-mono text-[11px] text-[#6b7280]">
                      {draftPrompt.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={draftPrompt}
                    onChange={(e) => setDraftPrompt(e.target.value)}
                    placeholder="Describe who this WhatsApp agent is, what questions it should ask, and how it should reply..."
                    className="mt-1.5 w-full rounded-lg border border-[#d1d5db] bg-white p-3 text-[12.5px] leading-relaxed text-[#111827] focus:border-[#2563eb] focus:outline-none"
                  />
                </div>
              </>
            )}

            {editorTab === "connections" && selectedAgent && (
              <div className="space-y-5">
                <div className="rounded-xl border border-[#bfdbfe] bg-[#eff6ff]/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-[13px] font-semibold text-[#1d4ed8]">
                        ⇄ Connect WhatsApp Agents Together (Agent-to-Agent Handoff)
                      </div>
                      <p className="m-0 mt-0.5 text-[12px] text-[#4b5563]">
                        When a customer chatting with <strong>{draftName || "this agent"}</strong> mentions a topic or keyword below, the chat seamlessly transfers to the connected specialist WhatsApp AI agent with full conversation history.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Existing Connected Agents List */}
                <div className="space-y-2.5">
                  <div className="text-[12px] font-semibold text-[#111827]">
                    Active Connections ({draftHandoffRules.length})
                  </div>

                  {draftHandoffRules.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#fafafa] p-5 text-center">
                      <p className="m-0 text-[12.5px] font-medium text-[#374151]">
                        No connected WhatsApp agents yet
                      </p>
                      <p className="m-0 mt-1 text-[11.5px] text-[#6b7280]">
                        Connect <strong>{draftName}</strong> to another specialist agent below (for example: Reception → Sales Closer, or Sales → Support Desk).
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {draftHandoffRules.map((rule, idx) => {
                        const targetObj = agents.find((a) => a._id === rule.targetAgentId);
                        const targetLabel = targetObj?.name || rule.targetAgentName || "WhatsApp Agent";
                        return (
                          <div
                            key={`${rule.targetAgentId}-${idx}`}
                            className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-3.5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold text-[#111827]">
                                <span className="rounded-md bg-white px-2 py-0.5 border border-[#e5e7eb]">
                                  {draftName || "Current Agent"}
                                </span>
                                <span className="text-[#2563eb]">──►</span>
                                <span className="rounded-md border border-[#bfdbfe] bg-[#eff6ff] px-2.5 py-0.5 text-[#1d4ed8]">
                                  {targetLabel} {targetObj?.role ? `(${targetObj.role})` : ""}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {rule.keywords[0] && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSimActiveAgentId("");
                                      void handleSimSend(`Hi, I need help with ${rule.keywords[0]}`);
                                    }}
                                    className="rounded-md border border-[#bfdbfe] bg-white px-2.5 py-1 text-[11px] font-medium text-[#2563eb] hover:bg-[#eff6ff]"
                                  >
                                    Test Handoff →
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDraftHandoffRules((prev) => prev.filter((_, i) => i !== idx))
                                  }
                                  className="rounded-md border border-[#fecaca] bg-white px-2 py-1 text-[11px] font-medium text-[#dc2626] hover:bg-[#fef2f2]"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>

                            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                              {rule.keywords.map((kw) => (
                                <span
                                  key={kw}
                                  className="rounded-full border border-[#e5e7eb] bg-white px-2 py-0.5 text-[11px] text-[#374151]"
                                >
                                  {kw}
                                </span>
                              ))}
                              {rule.condition && (
                                <span className="text-[11.5px] text-[#6b7280]">
                                  · Condition: <em>{rule.condition}</em>
                                </span>
                              )}
                            </div>
                            {rule.announceMessage && (
                              <div className="mt-2 rounded-md border border-[#e5e7eb] bg-white px-2.5 py-1.5 text-[11.5px] text-[#4b5563]">
                                Transition note: &quot;{rule.announceMessage}&quot;
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Add New Agent-to-Agent Connection Form */}
                <div className="rounded-xl border border-[#e5e7eb] bg-white p-4 space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[12.5px] font-semibold text-[#111827]">
                      + Connect Another WhatsApp Agent
                    </div>
                    {otherAgents.length === 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          applyBlueprint(AGENT_BLUEPRINTS[1]);
                          setCreatePhoneId("");
                          setShowCreateModal(true);
                        }}
                        className="text-[11.5px] font-medium text-[#2563eb] hover:underline"
                      >
                        + Create a 2nd WhatsApp Agent first →
                      </button>
                    )}
                  </div>

                  {otherAgents.length === 0 ? (
                    <p className="m-0 text-[12px] text-[#6b7280]">
                      You currently have 1 WhatsApp AI Agent. Create a second specialist agent (like Support Desk or Clinic Booker), then connect them together right here!
                    </p>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11.5px] font-medium text-[#111827]">
                            Transfer Chat To Agent *
                          </label>
                          <select
                            value={newRuleTargetId}
                            onChange={(e) => setNewRuleTargetId(e.target.value)}
                            className="mt-1 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-2.5 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                          >
                            <option value="">Choose target WhatsApp agent...</option>
                            {otherAgents.map((a) => (
                              <option key={a._id} value={a._id}>
                                {a.name} ({a.role} · {a.status})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11.5px] font-medium text-[#111827]">
                            Trigger Keywords (comma separated)
                          </label>
                          <input
                            type="text"
                            value={newRuleKeywords}
                            onChange={(e) => setNewRuleKeywords(e.target.value)}
                            placeholder="e.g. refund, issue, complaint, support"
                            className="mt-1 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11.5px] font-medium text-[#111827]">
                            Or Natural Condition (Optional)
                          </label>
                          <input
                            type="text"
                            value={newRuleCondition}
                            onChange={(e) => setNewRuleCondition(e.target.value)}
                            placeholder="e.g. Customer asks for pricing or booking"
                            className="mt-1 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11.5px] font-medium text-[#111827]">
                            Optional Handoff Message (Leave blank for silent)
                          </label>
                          <input
                            type="text"
                            value={newRuleAnnounce}
                            onChange={(e) => setNewRuleAnnounce(e.target.value)}
                            placeholder="e.g. Passing you to our Support Specialist!"
                            className="mt-1 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-[#6b7280]">
                          Click <strong>Save Agent</strong> after adding connections to apply live.
                        </span>
                        <button
                          type="button"
                          disabled={!newRuleTargetId}
                          onClick={handleAddHandoffRule}
                          className="inline-flex h-8 items-center rounded-lg bg-[#2563eb] px-3.5 text-[12px] font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
                        >
                          + Add Connection
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {editorTab === "knowledge" && selectedAgent && (
              <>
                {/* Inline Knowledge / FAQ Sheet */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-[12.5px] font-semibold text-[#111827]">
                      Business Knowledge, Pricing &amp; FAQ Sheet
                    </label>
                    <span className="text-[11px] text-[#6b7280]">
                      Combined automatically with linked Voice Agent KB
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={draftKnowledge}
                    onChange={(e) => setDraftKnowledge(e.target.value)}
                    placeholder="Paste pricing plans, clinic timings, address, refund policy, or product FAQs here..."
                    className="mt-2 w-full rounded-lg border border-[#d1d5db] bg-white p-3 text-[12.5px] leading-relaxed text-[#111827] focus:border-[#2563eb] focus:outline-none"
                  />
                </div>

                {/* Auto-Route Trigger Keywords */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#111827]">
                    Specialist Auto-Route Trigger Keywords (Optional)
                  </label>
                  <p className="m-0 mt-0.5 text-[11.5px] text-[#6b7280]">
                    If an incoming chat contains any of these words (e.g. <code>pricing</code>, <code>refund</code>), automatically route the conversation to <strong>{draftName}</strong>.
                  </p>
                  <div className="mt-2 flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-[#d1d5db] bg-[#fafafa] p-2">
                    {draftTriggerKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-2.5 py-0.5 text-[12px] font-medium text-[#1d4ed8]"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() =>
                            setDraftTriggerKeywords((prev) => prev.filter((item) => item !== kw))
                          }
                          className="text-[#1d4ed8]/70 hover:text-[#1d4ed8]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={triggerKwInput}
                      onChange={(e) => setTriggerKwInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addTagToList(triggerKwInput, setDraftTriggerKeywords, () => setTriggerKwInput(""));
                        }
                      }}
                      onBlur={() =>
                        addTagToList(triggerKwInput, setDraftTriggerKeywords, () => setTriggerKwInput(""))
                      }
                      placeholder="Type trigger keyword & press Enter..."
                      className="min-w-[180px] flex-1 bg-transparent px-2 py-1 text-[12.5px] text-[#111827] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Human Handover Keywords */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#111827]">
                    Human Handover Trigger Keywords
                  </label>
                  <div className="mt-2 flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-[#d1d5db] bg-[#fafafa] p-2">
                    {draftTransferKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-white px-2.5 py-0.5 text-[12px] font-medium text-[#111827]"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() =>
                            setDraftTransferKeywords((prev) => prev.filter((item) => item !== kw))
                          }
                          className="text-[#6b7280] hover:text-[#dc2626]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={transferKwInput}
                      onChange={(e) => setTransferKwInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addTagToList(transferKwInput, setDraftTransferKeywords, () => setTransferKwInput(""));
                        }
                      }}
                      onBlur={() =>
                        addTagToList(transferKwInput, setDraftTransferKeywords, () => setTransferKwInput(""))
                      }
                      placeholder="Add handover keyword (e.g. human, manager)..."
                      className="min-w-[180px] flex-1 bg-transparent px-2 py-1 text-[12.5px] text-[#111827] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Handover Notice */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#111827]">
                    Handover Notice Message
                  </label>
                  <textarea
                    rows={2}
                    value={draftFallback}
                    onChange={(e) => setDraftFallback(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#d1d5db] bg-white p-3 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                  />
                </div>
              </>
            )}

            {editorTab === "admin" && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-3.5">
                    <div>
                      <div className="text-[12.5px] font-semibold text-[#111827]">
                        Workspace WhatsApp AI Engine
                      </div>
                      <div className="text-[11.5px] text-[#6b7280]">
                        Master switch for all WhatsApp AI Agents
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={masterEnabled}
                      onChange={setMasterEnabled}
                      label="Master WhatsApp AI Engine"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-3.5">
                    <div>
                      <div className="text-[12.5px] font-semibold text-[#111827]">
                        Business Hours Only
                      </div>
                      <div className="text-[11.5px] text-[#6b7280]">
                        Pause automated replies outside office hours
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={businessHoursOnly}
                      onChange={setBusinessHoursOnly}
                      label="Business Hours Only"
                    />
                  </div>
                </div>

                <div className="border-t border-[#f1f5f9] pt-4 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#1d4ed8]">
                      🔒 Admin-Only Security Allowlist
                    </div>
                    <h3 className="m-0 mt-1.5 text-[14px] font-semibold text-[#111827]">
                      Admin-Only WhatsApp Bulk Call &amp; Follow-up Dispatch
                    </h3>
                    <p className="m-0 mt-0.5 text-[12px] text-[#6b7280]">
                      Only these verified Admin numbers can message a list of phone numbers on WhatsApp to trigger bulk AI calls (gated by 2-step <code>CONFIRM</code>).
                    </p>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#111827]">
                      Authorized Admin WhatsApp Numbers
                    </label>
                    <div className="mt-1.5 flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-lg border border-[#d1d5db] bg-[#fafafa] p-2">
                      {adminPhones.map((num) => (
                        <span
                          key={num}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#bfdbfe] bg-white px-2.5 py-1 font-mono text-[12px] font-medium text-[#111827]"
                        >
                          +{num}
                          <button
                            type="button"
                            onClick={() => setAdminPhones((prev) => prev.filter((p) => p !== num))}
                            className="text-[#6b7280] hover:text-[#dc2626]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={adminPhoneInput}
                        onChange={(e) => setAdminPhoneInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addAdminPhonesFromText(adminPhoneInput);
                          }
                        }}
                        onBlur={() => addAdminPhonesFromText(adminPhoneInput)}
                        placeholder="Add admin number e.g. 919876543210 & press Enter..."
                        className="min-w-[220px] flex-1 bg-transparent px-2 py-1 font-mono text-[12.5px] text-[#111827] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[12px] font-medium text-[#111827]">
                        Target Live Automation Workflow
                      </label>
                      <select
                        value={adminAutomationId}
                        onChange={(e) => setAdminAutomationId(e.target.value)}
                        className="mt-1.5 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                      >
                        <option value="">Auto — Latest Live Workflow</option>
                        {automations.map((f) => (
                          <option key={f._id} value={f._id}>
                            {f.name} ({f.status})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-[12px] font-medium text-[#111827]">
                          Max Numbers per Batch
                        </label>
                        <span className="font-mono text-[11.5px] font-semibold text-[#2563eb]">
                          {adminMaxBatch} / 500
                        </span>
                      </div>
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={adminMaxBatch}
                        onChange={(e) => setAdminMaxBatch(e.target.value)}
                        className="mt-1.5 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-3.5 sm:grid-cols-3">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#2563eb]">
                        1. Send List
                      </div>
                      <p className="m-0 mt-1 text-[11.5px] text-[#4b5563]">
                        Send 2+ numbers (or <code>CALL +91...</code>) from an Admin WhatsApp.
                      </p>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#2563eb]">
                        2. 2-Step Confirm
                      </div>
                      <p className="m-0 mt-1 text-[11.5px] text-[#4b5563]">
                        Reply <code>CONFIRM 1234</code> within 10 mins to start calls.
                      </p>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#dc2626]">
                        3. Kill Switch
                      </div>
                      <p className="m-0 mt-1 text-[11.5px] text-[#4b5563]">
                        Reply <code>STOP BATCH</code> anytime to cancel remaining queued calls.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Sticky Live AI WhatsApp Phone Simulator */}
        <aside className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm xl:sticky xl:top-4">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] bg-[#111827] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-[12px] font-semibold text-white">
                {((simActiveAgent?.name || draftName) || "WA").slice(0, 2).toUpperCase()}
                <span
                  className={`absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-[#111827] ${
                    masterEnabled && draftStatus === "live" ? "bg-[#22c55e]" : "bg-[#9ca3af]"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[12.5px] font-semibold leading-tight text-white">
                  {simActiveAgent?.name || draftName || "WhatsApp AI Agent"}
                </div>
                <div className="truncate text-[10.5px] text-white/70">
                  {simActiveAgent
                    ? `⇄ Handed off (${simActiveAgent.role})`
                    : `${draftRole} · Live LLM Simulator`}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSimActiveAgentId("");
                setSimMessages([
                  {
                    sender: "bot",
                    text: draftWelcome || "👋 Welcome! How can I help you today?",
                    time: "Now",
                    tag: "Greeting",
                  },
                ]);
              }}
              className="shrink-0 rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-white/20"
            >
              Reset
            </button>
          </div>

          <div
            ref={chatScrollRef}
            className="wa-sim-feed flex h-[340px] flex-col space-y-2.5 overflow-y-auto p-3.5"
          >
            {simMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex max-w-[86%] flex-col rounded-2xl px-3.5 py-2 text-[12.5px] leading-relaxed shadow-2xs ${
                  msg.sender === "bot"
                    ? "self-start rounded-tl-sm border border-[#e5e7eb] bg-white text-[#111827]"
                    : "self-end rounded-tr-sm bg-[#2563eb] text-white"
                }`}
              >
                {msg.tag && msg.sender === "bot" && (
                  <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#2563eb]">
                    {msg.tag}
                  </span>
                )}
                <div>{msg.text}</div>
                <span
                  className={`mt-1 self-end text-[10px] ${
                    msg.sender === "bot" ? "text-[#9ca3af]" : "text-white/75"
                  }`}
                >
                  {msg.time} {msg.sender === "user" ? "✓✓" : ""}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="inline-flex items-center gap-1 self-start rounded-2xl rounded-tl-sm border border-[#e5e7eb] bg-white px-3.5 py-2 text-[11.5px] text-[#6b7280]">
                <span className="size-1.5 animate-bounce rounded-full bg-[#2563eb]" />
                <span className="size-1.5 animate-bounce rounded-full bg-[#2563eb] [animation-delay:120ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-[#2563eb] [animation-delay:240ms]" />
              </div>
            )}
          </div>

          <div className="border-t border-[#f1f5f9] bg-white px-3.5 pt-2.5 pb-1.5">
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Pricing", text: "What are your plans and pricing?" },
                { label: "Book Slot", text: "I want to book an appointment tomorrow" },
                { label: "Handover", text: "Can I speak with a human agent?" },
                { label: "Test Bulk Call", text: "CALL +919876543210, +919811223344" },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => void handleSimSend(p.text)}
                  className="rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-2.5 py-1 text-[11px] font-medium text-[#4b5563] transition hover:border-[#2563eb] hover:bg-[#eff6ff] hover:text-[#2563eb]"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 pt-1.5 pb-3.5">
            <input
              type="text"
              value={simInput}
              onChange={(e) => setSimInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void handleSimSend()}
              placeholder={`Test ${draftName || "agent"} live...`}
              className="h-9 flex-1 rounded-full border border-[#d1d5db] bg-[#f9fafb] px-3.5 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:bg-white focus:outline-none"
            />
            <button
              type="button"
              disabled={isTyping}
              onClick={() => void handleSimSend()}
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#2563eb] px-4 text-[12.5px] font-medium text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </aside>
      </div>

      {/* Create WhatsApp AI Agent Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#f1f5f9] pb-4">
              <div>
                <h3 className="m-0 text-[16px] font-semibold text-[#111827]">
                  Create New WhatsApp AI Agent
                </h3>
                <p className="m-0 mt-0.5 text-[12.5px] text-[#6b7280]">
                  Pick a ready-made blueprint or customize your own persona, prompt, and WhatsApp line.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-[#e5e7eb] px-2.5 py-1 text-[12px] text-[#6b7280] hover:text-[#111827]"
              >
                ✕
              </button>
            </div>

            {/* Blueprint Picker */}
            <div className="mt-4">
              <div className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6b7280]">
                1. Choose a Blueprint
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {AGENT_BLUEPRINTS.map((bp) => {
                  const active = createBlueprintId === bp.id;
                  return (
                    <button
                      key={bp.id}
                      type="button"
                      onClick={() => applyBlueprint(bp)}
                      className={`rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-[#2563eb] bg-[#eff6ff] ring-2 ring-[#2563eb]/15"
                          : "border-[#e5e7eb] bg-[#fafafa] hover:border-[#93c5fd]"
                      }`}
                    >
                      <div className="text-[12.5px] font-semibold text-[#111827]">{bp.title}</div>
                      <div className="mt-0.5 text-[11px] text-[#6b7280]">{bp.badge}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleCreateAgent} className="mt-5 space-y-4">
              <div className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6b7280]">
                2. Customize Agent Details
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[12px] font-medium text-[#111827]">
                    Agent Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="e.g. Sales Closer AI"
                    className="mt-1 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#111827]">
                    Role / Department
                  </label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-2.5 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                  >
                    <option value="Sales">Sales</option>
                    <option value="Support">Support</option>
                    <option value="Booking">Booking / Reception</option>
                    <option value="Follow-up">Follow-up &amp; Billing</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#111827]">
                    Assign WhatsApp Number (Optional)
                  </label>
                  <select
                    value={createPhoneId}
                    onChange={(e) => setCreatePhoneId(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-2.5 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                  >
                    <option value="">All Connected WhatsApp Numbers</option>
                    {accounts.map((acc) => (
                      <option key={acc.phoneNumberId} value={acc.phoneNumberId}>
                        {acc.displayPhoneNumber} — {acc.label || acc.verifiedName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#111827]">
                    Language
                  </label>
                  <input
                    type="text"
                    value={createLanguage}
                    onChange={(e) => setCreateLanguage(e.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#111827]">
                  Welcome Greeting Message
                </label>
                <textarea
                  rows={2}
                  value={createWelcome}
                  onChange={(e) => setCreateWelcome(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d1d5db] bg-white p-2.5 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#111827]">
                  System Prompt / Instructions
                </label>
                <textarea
                  rows={3}
                  value={createPrompt}
                  onChange={(e) => setCreatePrompt(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d1d5db] bg-white p-2.5 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#111827]">
                  Quick Business Facts / Pricing / FAQ (Optional)
                </label>
                <textarea
                  rows={2}
                  value={createKnowledge}
                  onChange={(e) => setCreateKnowledge(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d1d5db] bg-white p-2.5 text-[12.5px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#f1f5f9] pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="h-9 rounded-lg border border-[#d1d5db] bg-white px-4 text-[12.5px] font-medium text-[#374151] hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !createName.trim()}
                  className="h-9 rounded-lg bg-[#2563eb] px-4 text-[12.5px] font-medium text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create & Launch Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
