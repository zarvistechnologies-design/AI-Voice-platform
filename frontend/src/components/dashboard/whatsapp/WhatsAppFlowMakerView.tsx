"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { WhatsAppFlow, WhatsAppFlowNode, WhatsAppFlowEdge } from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";

interface WhatsAppFlowMakerViewProps {
  flows: WhatsAppFlow[];
  onRefresh: () => void;
}

// Node Type Palette Categories
const NODE_PALETTE = [
  {
    category: "Messaging",
    items: [
      {
        type: "message" as const,
        title: "Send WhatsApp Message",
        icon: "💬",
        desc: "Text message with dynamic variables & media",
        color: "from-[#118778] to-[#0a5c51]",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      },
      {
        type: "message" as const,
        title: "Interactive Buttons",
        icon: "🔘",
        desc: "Quick replies and call-to-action link buttons",
        color: "from-teal-600 to-emerald-700",
        badge: "bg-teal-50 text-teal-800 border-teal-200",
      },
      {
        type: "form" as const,
        title: "Meta In-Chat Form",
        icon: "📄",
        desc: "Native lead capture form without leaving chat",
        color: "from-sky-500 to-blue-600",
        badge: "bg-sky-50 text-sky-800 border-sky-200",
      },
    ],
  },
  {
    category: "Logic & Branching",
    items: [
      {
        type: "condition" as const,
        title: "Decision / Branch",
        icon: "🔀",
        desc: "Split flow based on customer reply or tag",
        color: "from-amber-500 to-orange-600",
        badge: "bg-amber-50 text-amber-800 border-amber-200",
      },
      {
        type: "condition" as const,
        title: "Smart Wait & Delay",
        icon: "⏳",
        desc: "Pause execution for minutes, hours, or days",
        color: "from-amber-600 to-yellow-600",
        badge: "bg-amber-50 text-amber-800 border-amber-200",
      },
    ],
  },
  {
    category: "Actions & Automations",
    items: [
      {
        type: "action" as const,
        title: "Trigger Voice AI Agent Call",
        icon: "📞",
        desc: "Initiate instant AI voice call to customer",
        color: "from-rose-500 to-pink-600",
        badge: "bg-rose-50 text-rose-800 border-rose-200",
      },
      {
        type: "action" as const,
        title: "Live Agent Handover",
        icon: "👤",
        desc: "Switch conversation to human specialist inbox",
        color: "from-indigo-500 to-purple-600",
        badge: "bg-indigo-50 text-indigo-800 border-indigo-200",
      },
      {
        type: "action" as const,
        title: "CRM Tag & Webhook",
        icon: "⚡",
        desc: "Sync lead data to CRM or trigger webhook API",
        color: "from-violet-500 to-indigo-600",
        badge: "bg-violet-50 text-violet-800 border-violet-200",
      },
    ],
  },
];

// Rich Preset Workflows
const PRESET_WORKFLOWS = [
  {
    name: "General Business Inbound & AI Welcome (Universal)",
    description: "Universal customer welcome flow for any business: auto-greets on keyword (HI, HELLO, MENU, START) or first message, presents interactive options, answers with AI, captures leads, and escalates to human live chat.",
    triggerKeyword: "HELLO",
    nodes: [
      {
        id: "node-1",
        type: "trigger" as const,
        title: "Inbound Trigger: 'HELLO' / 'START' / Any Message",
        description: 'Runs automatically when customer texts "HELLO", "HI", "START", "MENU", or sends their first inbound message.',
      },
      {
        id: "node-2",
        type: "message" as const,
        title: "Interactive Welcome & Main Menu",
        description: "Welcome to our business! 👋 How can we assist you today?\n1️⃣ Explore Services & Pricing\n2️⃣ Speak with a Live Team Member\n3️⃣ Office Hours & Location\n4️⃣ Ask a Question (AI Assistant)",
      },
      {
        id: "node-3",
        type: "condition" as const,
        title: "Customer Intent & Choice Router",
        description: "Option 1 ➔ Services details; Option 2 ➔ Live agent escalation; Option 3 ➔ Hours & address; Option 4 / Freeform text ➔ Smart AI assistant.",
      },
      {
        id: "node-4",
        type: "form" as const,
        title: "Contact & Lead Details Form",
        description: "Quick 2-question capture: Full name & email address to personalize future responses and follow-ups.",
      },
      {
        id: "node-5",
        type: "action" as const,
        title: "Live Chat Handover & CRM Sync",
        description: "Instantly logs inquiry into CRM, tags contact as 'Inbound Lead', and alerts the team in WhatsApp Live Chat.",
      },
    ],
    edges: [
      { from: "node-1", to: "node-2" },
      { from: "node-2", to: "node-3" },
      { from: "node-3", to: "node-4" },
      { from: "node-4", to: "node-5" },
    ],
  },
  {
    name: "Clinic Patient Inbound & Voice AI Booking",
    description: "Inbound triage that greets patients, offers clinical departments, collects appointment timing, and triggers an automated AI voice confirmation call.",
    triggerKeyword: "CLINIC",
    nodes: [
      {
        id: "node-1",
        type: "trigger" as const,
        title: "Inbound Trigger: 'CLINIC'",
        description: 'Runs automatically when customer texts "CLINIC" or "DOCTOR"',
      },
      {
        id: "node-2",
        type: "message" as const,
        title: "Department Selection Menu",
        description: "Welcome to City Clinic AI Care. Please select your clinical department to check doctor availability.",
      },
      {
        id: "node-3",
        type: "condition" as const,
        title: "Urgent vs Routine Triage",
        description: "If patient selects Emergency ➔ Route to on-duty specialist; If Routine ➔ Show appointment calendar slots.",
      },
      {
        id: "node-4",
        type: "form" as const,
        title: "Patient Medical Intake Form",
        description: "Collects full name, date of birth, insurance provider, and medical history inside WhatsApp.",
      },
      {
        id: "node-5",
        type: "action" as const,
        title: "Voice AI Call Dispatch",
        description: "Triggers outbound Voice AI Agent call within 30 seconds to confirm appointment and answer questions.",
      },
    ],
    edges: [
      { from: "node-1", to: "node-2" },
      { from: "node-2", to: "node-3" },
      { from: "node-3", to: "node-4" },
      { from: "node-4", to: "node-5" },
    ],
  },
  {
    name: "VIP E-Commerce Discount & Instant Purchase",
    description: "Broadcast click journey with exclusive 25% discount, interactive catalog, and WhatsApp checkout.",
    triggerKeyword: "VIP",
    nodes: [
      {
        id: "node-1",
        type: "trigger" as const,
        title: "VIP Broadcast Click Trigger",
        description: 'Customer clicks link in WhatsApp broadcast or texts "VIP"',
      },
      {
        id: "node-2",
        type: "message" as const,
        title: "Personalized VIP Offer",
        description: "Hi {{name}}, your VIP access is active! Use code VIP25 for 25% off all premium bundles today.",
      },
      {
        id: "node-3",
        type: "condition" as const,
        title: "Customer Intent Branch",
        description: "If customer clicks 'Claim Offer' ➔ Send checkout link; If 'Speak to Stylist' ➔ Route to Live Chat.",
      },
      {
        id: "node-4",
        type: "action" as const,
        title: "CRM Tag 'VIP-Purchaser'",
        description: "Tags contact in CRM database and updates customer lifetime value segment.",
      },
    ],
    edges: [
      { from: "node-1", to: "node-2" },
      { from: "node-2", to: "node-3" },
      { from: "node-3", to: "node-4" },
    ],
  },
  {
    name: "24/7 Support Bot & Live Human Handover",
    description: "Conversational FAQ bot with automated order lookups and instant takeover by live support agents.",
    triggerKeyword: "HELP",
    nodes: [
      {
        id: "node-1",
        type: "trigger" as const,
        title: "Support Trigger: 'HELP'",
        description: 'Customer texts "HELP", "SUPPORT", or "AGENT"',
      },
      {
        id: "node-2",
        type: "message" as const,
        title: "AI Resolution Menu",
        description: "How can our team assist you today? 1. Track Order, 2. Billing & Refund, 3. Talk to Live Agent.",
      },
      {
        id: "node-3",
        type: "condition" as const,
        title: "Route Request",
        description: "If 'Talk to Live Agent' ➔ Trigger Handover; Else ➔ Provide automated instant answer.",
      },
      {
        id: "node-4",
        type: "action" as const,
        title: "Live Chat Takeover & Slack Alert",
        description: "Switches chat mode to 'Human' and notifies support team via Slack webhook.",
      },
    ],
    edges: [
      { from: "node-1", to: "node-2" },
      { from: "node-2", to: "node-3" },
      { from: "node-3", to: "node-4" },
    ],
  },
];

export function WhatsAppFlowMakerView({ flows, onRefresh }: WhatsAppFlowMakerViewProps) {
  const [selectedFlow, setSelectedFlow] = useState<WhatsAppFlow | null>(flows[0] || null);

  // Sync selected flow
  useEffect(() => {
    if (!selectedFlow && flows.length > 0) {
      setSelectedFlow(flows[0]);
    } else if (selectedFlow && flows.length > 0) {
      const updated = flows.find((f) => f._id === selectedFlow._id);
      if (updated && updated.nodes?.length !== selectedFlow.nodes?.length) {
        setSelectedFlow(updated);
      }
    }
  }, [flows, selectedFlow]);

  // Flow Switcher Menu State
  const [flowMenuOpen, setFlowMenuOpen] = useState<boolean>(false);
  const flowMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (flowMenuRef.current && !flowMenuRef.current.contains(e.target as Node)) {
        setFlowMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Canvas State
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);
  const [filterQuery, setFilterQuery] = useState<string>("");

  // Modals
  const [showCreateFlowModal, setShowCreateFlowModal] = useState<boolean>(false);
  const [showTestPhoneModal, setShowTestPhoneModal] = useState<boolean>(false);
  const [testPhone, setTestPhone] = useState<string>("");
  const [testNotice, setTestNotice] = useState<{ ok: boolean; msg: string } | null>(null);

  // Saving State
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveBanner, setSaveBanner] = useState<string>("");

  // Node Edit State (Inspector)
  const activeNodes: WhatsAppFlowNode[] = selectedFlow?.nodes || [];
  const selectedNode = activeNodes.find((n) => n.id === selectedNodeId) || activeNodes[0] || null;

  const [editTitle, setEditTitle] = useState<string>("");
  const [editDesc, setEditDesc] = useState<string>("");
  const [editType, setEditType] = useState<WhatsAppFlowNode["type"]>("message");

  // Keep inspector in sync when selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      setEditTitle(selectedNode.title || "");
      setEditDesc(selectedNode.description || "");
      setEditType(selectedNode.type || "message");
    }
  }, [selectedNode?.id]);

  // Create Flow Form State
  const [newFlowName, setNewFlowName] = useState("");
  const [newFlowDesc, setNewFlowDesc] = useState("");
  const [newFlowKeyword, setNewFlowKeyword] = useState("START");
  const [presetIndex, setPresetIndex] = useState<number | null>(null);

  // Save Node Edits from Inspector
  function handleSaveNodeEdits() {
    if (!selectedFlow || !selectedNode) return;
    const updatedNodes = activeNodes.map((n) =>
      n.id === selectedNode.id
        ? {
            ...n,
            title: editTitle.trim() || n.title,
            description: editDesc.trim() || n.description,
            type: editType,
          }
        : n,
    );

    saveFlowData({ nodes: updatedNodes });
  }

  // Add Step from Palette or Toolbar
  function handleAddNode(type: WhatsAppFlowNode["type"], title?: string, desc?: string) {
    if (!selectedFlow) return;
    const newId = `node-${Date.now().toString().slice(-4)}`;
    const newNode: WhatsAppFlowNode = {
      id: newId,
      type,
      title: title || `New ${type.charAt(0).toUpperCase() + type.slice(1)} Step`,
      description: desc || "Configure step details in the right inspector panel.",
    };

    const updatedNodes = [...activeNodes, newNode];
    const updatedEdges = [...(selectedFlow.edges || [])];
    if (activeNodes.length > 0) {
      updatedEdges.push({
        from: activeNodes[activeNodes.length - 1].id,
        to: newId,
      });
    }

    saveFlowData({ nodes: updatedNodes, edges: updatedEdges }, newId);
  }

  // Delete Node
  function handleDeleteNode(nodeId: string) {
    if (!selectedFlow || activeNodes.length <= 1) {
      alert("A workflow must have at least one step.");
      return;
    }
    const updatedNodes = activeNodes.filter((n) => n.id !== nodeId);
    const updatedEdges = (selectedFlow.edges || []).filter((e) => e.from !== nodeId && e.to !== nodeId);
    saveFlowData({ nodes: updatedNodes, edges: updatedEdges }, updatedNodes[0]?.id);
  }

  // Duplicate Node
  function handleDuplicateNode(node: WhatsAppFlowNode) {
    if (!selectedFlow) return;
    const newId = `node-${Date.now().toString().slice(-4)}`;
    const duplicate: WhatsAppFlowNode = {
      ...node,
      id: newId,
      title: `${node.title} (Copy)`,
    };
    const updatedNodes = [...activeNodes, duplicate];
    saveFlowData({ nodes: updatedNodes }, newId);
  }

  // Core Save Helper
  async function saveFlowData(data: Partial<WhatsAppFlow>, selectNodeIdAfter?: string) {
    if (!selectedFlow) return;
    setIsSaving(true);
    setSaveBanner("");

    try {
      const payload: Partial<WhatsAppFlow> = {
        _id: selectedFlow._id,
        name: selectedFlow.name,
        description: selectedFlow.description,
        triggerType: selectedFlow.triggerType,
        triggerKeyword: selectedFlow.triggerKeyword,
        status: selectedFlow.status,
        nodes: data.nodes || activeNodes,
        edges: data.edges || selectedFlow.edges || [],
        ...data,
      };

      const res = await whatsappApi.saveFlow(payload);
      if (res.ok && res.flow) {
        setSelectedFlow(res.flow);
        if (selectNodeIdAfter) setSelectedNodeId(selectNodeIdAfter);
        setSaveBanner("Workflow saved & deployed to Meta Cloud API!");
        setTimeout(() => setSaveBanner(""), 3000);
        onRefresh();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update workflow");
    } finally {
      setIsSaving(false);
    }
  }

  // Handle Create New Flow
  async function handleCreateNewFlow(e: React.FormEvent) {
    e.preventDefault();
    if (!newFlowName.trim()) return;

    setIsSaving(true);
    try {
      const preset = presetIndex !== null ? PRESET_WORKFLOWS[presetIndex] : null;

      const res = await whatsappApi.saveFlow({
        name: newFlowName.trim(),
        description: newFlowDesc.trim() || preset?.description || "Automated WhatsApp conversation flow",
        triggerType: "keyword",
        triggerKeyword: newFlowKeyword.trim().toUpperCase() || "START",
        status: "active",
        nodes: preset?.nodes || [
          {
            id: "node-1",
            type: "trigger",
            title: `Trigger on "${newFlowKeyword.trim().toUpperCase()}"`,
            description: `Runs when customer texts "${newFlowKeyword.trim().toUpperCase()}"`,
          },
          {
            id: "node-2",
            type: "message",
            title: "Welcome Greeting & Options",
            description: "Thanks for reaching out! How can our automated assistant help you today?",
          },
        ],
        edges: preset?.edges || [{ from: "node-1", to: "node-2" }],
      });

      if (res.ok && res.flow) {
        setSelectedFlow(res.flow);
        setSelectedNodeId(res.flow.nodes?.[0]?.id || null);
        setShowCreateFlowModal(false);
        setNewFlowName("");
        setNewFlowDesc("");
        setPresetIndex(null);
        onRefresh();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not create flow");
    } finally {
      setIsSaving(false);
    }
  }

  // Test Flow on Phone
  async function handleTestFlowOnPhone(e: React.FormEvent) {
    e.preventDefault();
    if (!testPhone.trim() || !selectedFlow) return;
    setIsSaving(true);
    setTestNotice(null);

    try {
      const firstMsg = activeNodes[1]?.description || activeNodes[0]?.description || "Welcome to our WhatsApp Flow!";
      const text = `[Meta Flow Test: ${selectedFlow.name}]\nTrigger: "${selectedFlow.triggerKeyword || "START"}"\n\n${firstMsg}`;
      const res = await whatsappApi.sendTestMessage(testPhone.trim(), text);
      if (res.ok) {
        setTestNotice({ ok: true, msg: "Test message delivered to phone via Meta Cloud API!" });
      } else {
        setTestNotice({ ok: false, msg: res.error || "Failed to trigger test flow." });
      }
    } catch (err) {
      setTestNotice({ ok: false, msg: err instanceof Error ? err.message : "Network error" });
    } finally {
      setIsSaving(false);
    }
  }

  // Visual Node Color Map
  function getNodeStyle(type: WhatsAppFlowNode["type"]) {
    switch (type) {
      case "trigger":
        return {
          gradient: "from-violet-600 to-indigo-700",
          border: "border-violet-200",
          text: "text-violet-700",
          badge: "bg-violet-50 text-violet-800 border-violet-200",
          icon: "⚡",
        };
      case "message":
        return {
          gradient: "from-[#118778] to-[#0a5c51]",
          border: "border-emerald-200",
          text: "text-[#118778]",
          badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
          icon: "💬",
        };
      case "condition":
        return {
          gradient: "from-amber-500 to-orange-600",
          border: "border-amber-200",
          text: "text-amber-700",
          badge: "bg-amber-50 text-amber-800 border-amber-200",
          icon: "🔀",
        };
      case "form":
        return {
          gradient: "from-sky-500 to-blue-600",
          border: "border-sky-200",
          text: "text-sky-700",
          badge: "bg-sky-50 text-sky-800 border-sky-200",
          icon: "📄",
        };
      case "action":
        return {
          gradient: "from-rose-500 to-pink-600",
          border: "border-rose-200",
          text: "text-rose-700",
          badge: "bg-rose-50 text-rose-800 border-rose-200",
          icon: "🚀",
        };
      default:
        return {
          gradient: "from-slate-600 to-slate-700",
          border: "border-slate-200",
          text: "text-slate-700",
          badge: "bg-slate-50 text-slate-800 border-slate-200",
          icon: "⚙️",
        };
    }
  }

  return (
    <div className="whatsapp-flows space-y-4">
      {/* Top Studio Control Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#dfe7e4] bg-white p-3.5 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Flow Switcher & Status */}
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#118778] to-[#0d6e62] text-white shadow-2xs">
              <svg className="size-4 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                <circle cx="6" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <circle cx="18" cy="12" r="3" />
                <path d="M6 9v6M6 12h6a3 3 0 0 0 3-3V9" />
              </svg>
            </span>
            <div ref={flowMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setFlowMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3 py-1.5 text-xs font-bold text-[#14231f] hover:bg-white hover:border-[#118778] transition shadow-2xs focus:outline-none"
              >
                <span className="truncate max-w-[200px] sm:max-w-[280px]">
                  {selectedFlow?.name || "Select Flow"}
                </span>
                <span className="shrink-0 rounded-md bg-[#e4eeec] px-1.5 py-0.5 text-[10px] font-semibold text-[#118778]">
                  {selectedFlow?.nodes?.length || 0} {(selectedFlow?.nodes?.length || 0) === 1 ? "step" : "steps"}
                </span>
                <svg
                  className={`size-3.5 text-[#52645f] transition-transform duration-200 ${
                    flowMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </button>

              {/* Custom Popover Dropdown (Never renders native OS select arrows) */}
              {flowMenuOpen && (
                <div className="absolute left-0 top-full z-40 mt-1.5 w-80 rounded-2xl border border-[#dfe7e4] bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#71817d]">
                    Switch Conversation Flow
                  </div>
                  <div className="mt-1 max-h-64 space-y-1 overflow-y-auto">
                    {flows.map((flow) => {
                      const isSelected = flow._id === selectedFlow?._id;
                      const nodeCount = flow.nodes?.length || 0;
                      return (
                        <button
                          key={flow._id}
                          type="button"
                          onClick={() => {
                            setSelectedFlow(flow);
                            setSelectedNodeId(flow.nodes?.[0]?.id || null);
                            setFlowMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left transition ${
                            isSelected
                              ? "bg-[#edf7f4] text-[#0d6e62] font-bold"
                              : "text-[#14231f] hover:bg-[#f6f9f8]"
                          }`}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-xs">{flow.name}</span>
                              {isSelected && (
                                <span className="text-xs text-[#118778]">✓</span>
                              )}
                            </div>
                            <div className="mt-0.5 flex items-center gap-2 text-[10px] text-[#71817d]">
                              <span>
                                {nodeCount} {nodeCount === 1 ? "step" : "steps"}
                              </span>
                              <span>•</span>
                              <span className="font-mono text-[#118778]">
                                {flow.triggerKeyword ? `"${flow.triggerKeyword}"` : flow.triggerType}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                              flow.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {flow.status}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-1 border-t border-[#edf2f0] pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setFlowMenuOpen(false);
                        setShowCreateFlowModal(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-[#118778] hover:bg-[#edf7f4] transition"
                    >
                      <span>＋</span>
                      <span>Create New WhatsApp Flow</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedFlow && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  saveFlowData({ status: selectedFlow.status === "active" ? "draft" : "active" })
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 ring-1 ring-emerald-600/20 hover:bg-emerald-100 transition"
              >
                <span
                  className={`size-1.5 rounded-full ${selectedFlow.status === "active" ? "bg-[#25D366] animate-pulse" : "bg-slate-400"}`}
                />
                {selectedFlow.status.toUpperCase()}
              </button>

              <span className="rounded-md bg-[#f0f5f3] px-2 py-0.5 text-[10px] font-mono text-[#52645f]">
                Trigger: {selectedFlow.triggerKeyword ? `"${selectedFlow.triggerKeyword}"` : selectedFlow.triggerType}
              </span>

              <span className="text-[11px] text-[#71817d]">
                {selectedFlow.executionCount || 0} Executions
              </span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 rounded-xl border border-[#dfe7e4] bg-[#f9fbfa] px-2 py-1 text-xs">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="rounded px-1.5 py-0.5 font-bold text-[#60716c] hover:bg-white"
            >
              −
            </button>
            <span className="font-mono text-[11px] font-bold text-[#14231f]">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="rounded px-1.5 py-0.5 font-bold text-[#60716c] hover:bg-white"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="ml-1 text-[10px] font-bold text-[#118778] hover:underline"
            >
              Fit
            </button>
          </div>

          {/* Toggle Inspector Drawer */}
          <button
            type="button"
            onClick={() => setInspectorOpen((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              inspectorOpen
                ? "border-[#118778] bg-[#f0f8f5] text-[#118778]"
                : "border-[#c6d4d0] bg-white text-[#52645f] hover:bg-[#f4f7f6]"
            }`}
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span>{inspectorOpen ? "Hide Inspector" : "Show Inspector"}</span>
          </button>

          {/* Test Trigger on Phone */}
          <button
            type="button"
            onClick={() => setShowTestPhoneModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#c6d4d0] bg-white px-3 py-1.5 text-xs font-semibold text-[#20342e] shadow-2xs transition hover:border-[#118778] hover:text-[#118778]"
          >
            <svg className="size-3.5 text-[#118778]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Test on Phone</span>
          </button>

          {/* New Flow */}
          <button
            type="button"
            onClick={() => setShowCreateFlowModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#c6d4d0] bg-white px-3 py-1.5 text-xs font-bold text-[#52645f] transition hover:bg-[#f4f7f6] hover:text-[#14231f]"
          >
            <span>+ New Flow</span>
          </button>

          {/* Deploy / Save Flow Button */}
          <button
            type="button"
            onClick={() => saveFlowData({})}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#118778] to-[#0c6b5e] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition hover:brightness-110 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <svg className="size-3.5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <path d="M17 21v-8H7v8M7 3v5h8" />
                </svg>
                <span>Deploy Workflow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveBanner && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 shadow-2xs">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* FULL STUDIO WORKSPACE CANVAS */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        {/* LEFT PALETTE: TOOLBOX & BLOCKS (3 cols) */}
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-3xl border border-[#dfe7e4] bg-white p-4 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71817d]">
                Step Component Toolbox
              </span>
              <p className="text-[11px] text-[#60716c]">
                Click any step component to add it to your workflow canvas.
              </p>
            </div>

            {/* Palette Categories */}
            <div className="space-y-4">
              {NODE_PALETTE.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#84938f] pl-1">
                    {cat.category}
                  </span>
                  <div className="space-y-1.5">
                    {cat.items.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddNode(item.type, item.title, item.desc)}
                        className="group flex w-full items-start gap-2.5 rounded-2xl border border-[#e5ece9] bg-[#fafcfb] p-2.5 text-left transition hover:border-[#118778] hover:bg-white hover:shadow-xs"
                      >
                        <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-white shadow-2xs text-sm border border-[#e2ece8]">
                          {item.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-bold text-[#14231f] group-hover:text-[#118778]">
                            {item.title}
                          </span>
                          <span className="block text-[10px] text-[#71817d] line-clamp-1">
                            {item.desc}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#84938f] group-hover:text-[#118778] transition">
                          +
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: INFINITE-FEELING FLOW CANVAS (6 to 9 cols depending on inspector) */}
        <div className={`${inspectorOpen ? "lg:col-span-6" : "lg:col-span-9"} space-y-4`}>
          <div className="relative min-h-[640px] overflow-hidden rounded-3xl border border-[#dfe7e4] bg-[#f8faf9] [background-image:radial-gradient(#c7d7d1_1.2px,transparent_1.2px)] [background-size:22px_22px] shadow-sm">
            {/* Top Canvas Bar */}
            <div className="flex items-center justify-between border-b border-[#e2ede8] bg-white/80 px-4 py-2.5 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-xs">
                <span className="size-2 rounded-full bg-[#118778]" />
                <span className="font-bold text-[#14231f]">{selectedFlow?.name}</span>
                <span className="text-[#71817d]">({activeNodes.length} Sequence Nodes)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddNode("message")}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#c6d4d0] bg-white px-2.5 py-1 text-[11px] font-bold text-[#14231f] shadow-2xs hover:bg-[#f4f7f6]"
                >
                  <span>+ Add Step</span>
                </button>
              </div>
            </div>

            {/* Flow Graph Nodes Stream */}
            <div
              className="p-6 space-y-5 transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            >
              {activeNodes.map((node, index) => {
                const style = getNodeStyle(node.type);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <div key={node.id} className="relative flex flex-col items-center">
                    {/* Directional Connector Cable with animated flow arrow */}
                    {index > 0 && (
                      <div className="my-1 flex flex-col items-center">
                        <div className="h-6 w-0.5 bg-gradient-to-b from-[#118778] to-[#25D366] shadow-[0_0_8px_rgba(37,211,102,0.4)]" />
                        <div className="grid size-4.5 place-items-center rounded-full bg-[#118778] text-[8px] text-white shadow-xs">
                          ▼
                        </div>
                      </div>
                    )}

                    {/* NODE CARD */}
                    <div
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        if (!inspectorOpen) setInspectorOpen(true);
                      }}
                      className={`group relative w-full max-w-md cursor-pointer rounded-2xl border bg-white p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-[#118778] shadow-md ring-2 ring-[#118778]/25"
                          : "border-[#dfe7e4] hover:border-[#b8cfc8] hover:shadow-xs"
                      }`}
                    >
                      {/* Left Color Accent Bar */}
                      <div
                        className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full bg-gradient-to-b ${style.gradient}`}
                      />

                      {/* Card Top: Step, Type, Title, Actions */}
                      <div className="flex items-center justify-between gap-3 pl-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`grid size-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${style.gradient} text-white shadow-2xs text-xs font-bold`}
                          >
                            {style.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-md px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider ${style.badge}`}
                              >
                                Step {index + 1}: {node.type}
                              </span>
                            </div>
                            <h3 className="truncate text-xs font-bold text-[#14231f]">
                              {node.title}
                            </h3>
                          </div>
                        </div>

                        {/* Card Hover Action Buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateNode(node);
                            }}
                            className="rounded-lg p-1 text-[#71817d] hover:bg-[#f4f7f6] hover:text-[#14231f]"
                            title="Duplicate Node"
                          >
                            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNode(node.id);
                            }}
                            className="rounded-lg p-1 text-[#71817d] hover:bg-rose-50 hover:text-rose-600"
                            title="Delete Node"
                          >
                            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Content Preview Box */}
                      <div className="mt-2 rounded-xl bg-[#f9fbfa] p-2.5 text-xs text-[#445550] border border-[#e8efec] pl-2.5">
                        <p className="line-clamp-2 leading-relaxed">{node.description}</p>
                      </div>

                      {/* Dynamic Branching / Action Indicators */}
                      {node.type === "message" && (
                        <div className="mt-2 flex flex-wrap gap-1 pl-1">
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-800 border border-emerald-200">
                            🔘 Quick Reply Options
                          </span>
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-800 border border-emerald-200">
                            🔘 Call to Action ↗
                          </span>
                        </div>
                      )}

                      {node.type === "condition" && (
                        <div className="mt-2 grid grid-cols-2 gap-1.5 text-[9px] pl-1 font-semibold">
                          <div className="rounded bg-emerald-50 p-1.5 border border-emerald-200 text-emerald-800">
                            ✓ If Match ➔ Next Step
                          </div>
                          <div className="rounded bg-amber-50 p-1.5 border border-amber-200 text-amber-800">
                            ✕ Else ➔ Fallback
                          </div>
                        </div>
                      )}

                      {node.type === "action" && (
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] pl-1 font-semibold text-rose-700">
                          <span>⚡ Outbound Action:</span>
                          <span className="underline">Instant Voice Agent Callback</span>
                        </div>
                      )}

                      {/* Output Port Handle */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-3.5 rounded-full bg-white border-2 border-[#118778] shadow-xs flex items-center justify-center">
                        <span className="size-1 rounded-full bg-[#118778]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: NODE INSPECTOR DRAWER (3 cols when open) */}
        {inspectorOpen && (
          <div className="space-y-4 lg:col-span-3">
            <div className="rounded-3xl border border-[#dfe7e4] bg-white p-4.5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#edf2f0] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#14231f]">Step Inspector</span>
                  {selectedNode && (
                    <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                      {selectedNode.type}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setInspectorOpen(false)}
                  className="rounded-lg p-1 text-[#84938f] hover:bg-[#f4f7f6]"
                >
                  ✕
                </button>
              </div>

              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#445550]">
                      Step Type
                    </label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as WhatsAppFlowNode["type"])}
                      className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3 py-2 text-xs font-medium text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                    >
                      <option value="message">💬 Message & Interactive Buttons</option>
                      <option value="condition">🔀 Decision / Branching Logic</option>
                      <option value="form">📄 Meta In-Chat Lead Form</option>
                      <option value="action">🚀 Automated Action (Voice Call / CRM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#445550]">
                      Step Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="e.g. Confirm Appointment"
                      className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3 py-2 text-xs font-bold text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#445550]">
                        Message Body / Action Logic
                      </label>
                      <span className="text-[10px] text-[#118778] font-semibold">
                        Supports `{"{{name}}"}`
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Enter the message copy or automation action details..."
                      className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] p-3 text-xs leading-relaxed text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Variable Inserters Shortcut */}
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-[#84938f]">
                      Insert Dynamic Tags:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {["{{name}}", "{{phone}}", "{{date}}", "{{time}}"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setEditDesc((prev) => `${prev} ${tag}`)}
                          className="rounded-md bg-[#edf5f2] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#118778] hover:bg-[#deede9]"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#edf2f0] pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDeleteNode(selectedNode.id)}
                      className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Delete Step
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNodeEdits}
                      className="rounded-xl bg-[#118778] px-4 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0d6e62]"
                    >
                      Update Step
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#84938f]">
                  Click on any node in the canvas to inspect and edit its parameters.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: CREATE NEW WORKFLOW MODAL */}
      {showCreateFlowModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl border border-[#dbe4e1] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf2f0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#14231f]">Create WhatsApp Automated Workflow</h3>
                <p className="text-xs text-[#71817d]">
                  Choose an industry preset template or start from a blank canvas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateFlowModal(false)}
                className="rounded-lg p-1 text-[#84938f] hover:bg-[#f4f7f6]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewFlow} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                  Choose Starting Blueprint or General Flow
                </label>
                <div className="mt-1.5 space-y-2 max-h-52 overflow-y-auto pr-1">
                  {/* Option 0: Blank General Flow */}
                  <div
                    onClick={() => {
                      setPresetIndex(null);
                      setNewFlowName("General Inbound & Routing Flow");
                      setNewFlowDesc("General purpose customer welcome and automated routing flow");
                      setNewFlowKeyword("START");
                    }}
                    className={`cursor-pointer rounded-2xl border p-3 transition ${
                      presetIndex === null
                        ? "border-[#118778] bg-[#f0f8f5] ring-2 ring-[#118778]/25"
                        : "border-[#dfe7e4] bg-white hover:border-[#b8cfc8]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="grid size-6 place-items-center rounded-lg bg-teal-100 text-teal-800 text-xs font-bold">
                          ✨
                        </span>
                        <span className="text-xs font-bold text-[#14231f]">
                          Blank General Flow (Build from Scratch)
                        </span>
                      </div>
                      <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[9px] font-bold text-teal-800">
                        Universal Starter
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#60716c]">
                      Flexible open canvas: start with an inbound trigger and drag & drop any message, decision, form, or Voice AI action.
                    </p>
                  </div>

                  {/* Preset Blueprints */}
                  {PRESET_WORKFLOWS.map((tmpl, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setPresetIndex(idx);
                        setNewFlowName(tmpl.name);
                        setNewFlowDesc(tmpl.description);
                        setNewFlowKeyword(tmpl.triggerKeyword);
                      }}
                      className={`cursor-pointer rounded-2xl border p-3 transition ${
                        presetIndex === idx
                          ? "border-[#118778] bg-[#f0f8f5] ring-2 ring-[#118778]/25"
                          : "border-[#dfe7e4] bg-white hover:border-[#b8cfc8]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#14231f]">{tmpl.name}</span>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                          {tmpl.nodes.length} Steps
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#60716c] line-clamp-1">{tmpl.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                  Workflow Name
                </label>
                <input
                  type="text"
                  required
                  value={newFlowName}
                  onChange={(e) => setNewFlowName(e.target.value)}
                  placeholder="e.g. Clinic Appointment & Confirmation Flow"
                  className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2 text-xs font-medium text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                  Trigger Keyword
                </label>
                <input
                  type="text"
                  required
                  value={newFlowKeyword}
                  onChange={(e) => setNewFlowKeyword(e.target.value)}
                  placeholder="e.g. BOOK, START, HELP"
                  className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2 text-xs font-bold uppercase text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-[#edf2f0] pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateFlowModal(false)}
                  className="rounded-xl border border-[#c6d4d0] px-4 py-2 text-xs font-semibold text-[#52645f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#118778] px-5 py-2 text-xs font-bold text-white hover:bg-[#0e7467] disabled:opacity-50"
                >
                  {isSaving ? "Creating..." : "Create Workflow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TEST FLOW ON REAL PHONE */}
      {showTestPhoneModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#dbe4e1] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf2f0] pb-3">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                <h3 className="text-sm font-bold text-[#14231f]">Test Workflow on Real Phone</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowTestPhoneModal(false);
                  setTestNotice(null);
                }}
                className="rounded-lg p-1 text-[#84938f] hover:bg-[#f4f7f6]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTestFlowOnPhone} className="mt-4 space-y-4">
              <p className="text-xs text-[#60716c]">
                Sends the kickoff WhatsApp message for{" "}
                <span className="font-bold text-[#14231f]">{selectedFlow?.name}</span> directly to your personal phone number via Meta Cloud API.
              </p>

              {testNotice && (
                <div
                  className={`rounded-xl p-3 text-xs ${
                    testNotice.ok
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border border-rose-200 bg-rose-50 text-rose-800"
                  }`}
                >
                  {testNotice.msg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#445550]">
                  Your Mobile Number (with country code)
                </label>
                <input
                  type="tel"
                  required
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+91 98765 43210 or +1 555 123 4567"
                  className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-[#edf2f0] pt-3">
                <button
                  type="button"
                  onClick={() => setShowTestPhoneModal(false)}
                  className="rounded-xl border border-[#c6d4d0] px-4 py-2 text-xs font-semibold text-[#52645f]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#118778] px-5 py-2 text-xs font-bold text-white hover:bg-[#0e7467] disabled:opacity-50"
                >
                  {isSaving ? "Dispatching..." : "Send Test Trigger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
