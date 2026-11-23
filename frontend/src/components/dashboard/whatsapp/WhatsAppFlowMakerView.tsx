"use client";

import { useEffect, useRef, useState } from "react";
import type { WhatsAppFlow, WhatsAppFlowEdge, WhatsAppFlowNode } from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";

interface WhatsAppFlowMakerViewProps {
  flows: WhatsAppFlow[];
  onRefresh: () => void;
}

const NODE_PALETTE = [
  {
    category: "Messaging",
    items: [
      {
        type: "message" as const,
        title: "Send WhatsApp Message",
        code: "MSG",
        desc: "Text message with dynamic variables & media",
      },
      {
        type: "message" as const,
        title: "Interactive Buttons",
        code: "BTN",
        desc: "Quick replies and call-to-action link buttons",
      },
      {
        type: "form" as const,
        title: "Meta In-Chat Form",
        code: "FRM",
        desc: "Native lead capture form without leaving chat",
      },
    ],
  },
  {
    category: "Logic & Branching",
    items: [
      {
        type: "condition" as const,
        title: "Decision / Branch",
        code: "IF",
        desc: "Split flow based on customer reply or tag",
      },
      {
        type: "condition" as const,
        title: "Smart Wait & Delay",
        code: "DLY",
        desc: "Pause execution for minutes, hours, or days",
      },
    ],
  },
  {
    category: "Actions & Automations",
    items: [
      {
        type: "action" as const,
        title: "Trigger Voice AI Call",
        code: "CALL",
        desc: "Initiate instant AI voice call to customer",
      },
      {
        type: "action" as const,
        title: "Live Agent Handover",
        code: "HUM",
        desc: "Switch conversation to human specialist inbox",
      },
      {
        type: "action" as const,
        title: "CRM Tag & Webhook",
        code: "API",
        desc: "Sync lead data to CRM or trigger webhook API",
      },
    ],
  },
  {
    category: "Integrations & Payments",
    items: [
      {
        type: "action" as const,
        title: "Razorpay Payment Link (INR 999)",
        code: "PAY",
        desc: "Generate live Razorpay payment link & send in chat",
      },
      {
        type: "action" as const,
        title: "Book Google Calendar / Calendly",
        code: "CAL",
        desc: "Book slot on Calendar & share Calendly link",
      },
      {
        type: "action" as const,
        title: "Sync CRM & Google Sheets",
        code: "CRM",
        desc: "Push lead to HubSpot, Zoho, Salesforce & Sheets",
      },
      {
        type: "action" as const,
        title: "Send Slack Team Alert",
        code: "SLK",
        desc: "Post instant notification to Slack channel",
      },
      {
        type: "action" as const,
        title: "Create Support Case (CASE-XXXX)",
        code: "CASE",
        desc: "Open a tracked support case & notify customer",
      },
    ],
  },
];

const PRESET_WORKFLOWS = [
  {
    name: "General Business Inbound & AI Welcome",
    description:
      "Universal customer welcome flow: auto-greets on keyword, presents interactive options, answers with AI, captures leads, and escalates to human live chat.",
    triggerKeyword: "HELLO",
    nodes: [
      {
        id: "node-1",
        type: "trigger" as const,
        title: "Inbound Trigger: 'HELLO' / 'START'",
        description:
          'Runs automatically when customer texts "HELLO", "HI", "START", or sends their first inbound message.',
      },
      {
        id: "node-2",
        type: "message" as const,
        title: "Interactive Welcome & Main Menu",
        description:
          "Welcome! How can we assist you today?\n1. Explore Services & Pricing\n2. Speak with a Team Member\n3. Office Hours & Location\n4. Ask a Question (AI Assistant)",
      },
      {
        id: "node-3",
        type: "condition" as const,
        title: "Customer Intent Router",
        description:
          "Option 1 -> Services details; Option 2 -> Live agent escalation; Option 3 -> Hours & address; Option 4 -> AI assistant.",
      },
      {
        id: "node-4",
        type: "form" as const,
        title: "Contact & Lead Details Form",
        description: "Quick 2-question capture: Full name & email address for follow-ups.",
      },
      {
        id: "node-5",
        type: "action" as const,
        title: "Live Chat Handover & CRM Sync",
        description: "Logs inquiry into CRM, tags contact as 'Inbound Lead', and alerts Live Chat.",
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
    description:
      "Inbound triage that greets patients, offers clinical departments, collects appointment timing, and triggers an AI voice confirmation call.",
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
        description:
          "Welcome to City Clinic AI Care. Please select your clinical department to check doctor availability.",
      },
      {
        id: "node-3",
        type: "condition" as const,
        title: "Urgent vs Routine Triage",
        description:
          "If Emergency -> Route to on-duty specialist; If Routine -> Show appointment calendar slots.",
      },
      {
        id: "node-4",
        type: "form" as const,
        title: "Patient Medical Intake Form",
        description: "Collects full name, date of birth, and visit reason inside WhatsApp.",
      },
      {
        id: "node-5",
        type: "action" as const,
        title: "Voice AI Call Dispatch",
        description:
          "Triggers outbound Voice AI Agent call within 30 seconds to confirm appointment.",
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
    name: "24/7 Support Bot & Live Human Handover",
    description:
      "Conversational FAQ bot with automated order lookups and instant takeover by live support agents.",
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
        description:
          "How can our team assist you today? 1. Track Order, 2. Billing & Refund, 3. Talk to Live Agent.",
      },
      {
        id: "node-3",
        type: "condition" as const,
        title: "Route Request",
        description:
          "If 'Talk to Live Agent' -> Trigger Handover; Else -> Provide automated instant answer.",
      },
      {
        id: "node-4",
        type: "action" as const,
        title: "Live Chat Takeover",
        description: "Switches chat mode to 'Human' and notifies support team.",
      },
    ],
    edges: [
      { from: "node-1", to: "node-2" },
      { from: "node-2", to: "node-3" },
      { from: "node-3", to: "node-4" },
    ],
  },
  {
    name: "Razorpay Payment + Calendar + CRM Autopilot",
    description: "End-to-end WhatsApp commerce flow: qualifies the customer, generates a live Razorpay payment link, books Google Calendar / Calendly, syncs to CRM & Sheets, and alerts Slack.",
    triggerKeyword: "PAY",
    nodes: [
      {
        id: "node-1",
        type: "trigger" as const,
        title: "Payment & Booking Trigger: 'PAY'",
        description: 'Runs automatically when customer texts "PAY", "BUY", or "ORDER".',
      },
      {
        id: "node-2",
        type: "message" as const,
        title: "Send Confirmation & Payment Details",
        description: "Thanks {{name}}! We are generating your Razorpay checkout link and calendar invite right now.",
      },
      {
        id: "node-3",
        type: "action" as const,
        title: "Razorpay Payment Link (999 INR)",
        description: "Create live Razorpay payment link for 999 and book Google Calendar / Calendly consultation.",
      },
      {
        id: "node-4",
        type: "action" as const,
        title: "Sync HubSpot / Zoho / Google Sheet + Slack Alert",
        description: "Sync customer lead to CRM and Sheets, and post Slack alert to the sales channel.",
      },
    ],
    edges: [
      { from: "node-1", to: "node-2" },
      { from: "node-2", to: "node-3" },
      { from: "node-3", to: "node-4" },
    ],
  },
  {
    name: "Case-Based Support Desk & Multi-Branch Router",
    description: "True case-based chatbot: greets with 3 Quick Reply cases, routes Case 1 (Book Appointment), Case 2 (Support Case Ticket CASE-XXXX), and Else (Live Human Handover).",
    triggerKeyword: "SUPPORT",
    nodes: [
      {
        id: "node-1",
        type: "trigger" as const,
        title: "Support & Case Trigger: 'SUPPORT'",
        description: 'Runs automatically when customer texts "SUPPORT", "CASE", or "ISSUE".',
      },
      {
        id: "node-2",
        type: "message" as const,
        title: "Interactive 3-Case Menu",
        description: "Hi {{name}}! How can we assist you today?\n1️⃣ Book Demo / Appointment\n2️⃣ Open Support Case Ticket\n3️⃣ Talk to Live Specialist",
      },
      {
        id: "node-3",
        type: "condition" as const,
        title: "Multi-Case Choice Router",
        description: "Branches customer reply to Case 1 (Calendar), Case 2 (Support Case), or Case 3 (Human Agent).",
      },
      {
        id: "node-4",
        type: "action" as const,
        title: "Case 1: Book Google Calendar / Calendly",
        description: "Auto-book Google Calendar slot & share Calendly link in WhatsApp.",
      },
      {
        id: "node-5",
        type: "action" as const,
        title: "Case 2: Create Support Case (CASE-XXXX)",
        description: "Open a tracked Support Case ticket, log to CRM/Sheets, alert Slack, and reply with Case ID.",
      },
      {
        id: "node-6",
        type: "action" as const,
        title: "Case 3 / Else: Live Human Handover",
        description: "Switch conversation to Human mode and alert support team on Slack.",
      },
    ],
    edges: [
      { from: "node-1", to: "node-2" },
      { from: "node-2", to: "node-3" },
      { from: "node-3", to: "node-4", caseLabel: "Case 1: Book Slot", matchKeywords: "1, book, demo, appointment" },
      { from: "node-3", to: "node-5", caseLabel: "Case 2: Open Ticket", matchKeywords: "2, case, ticket, issue, support" },
      { from: "node-3", to: "node-6", caseLabel: "Else: Live Agent", matchKeywords: "default" },
    ],
  },
];

export function WhatsAppFlowMakerView({ flows, onRefresh }: WhatsAppFlowMakerViewProps) {
  const [selectedFlow, setSelectedFlow] = useState<WhatsAppFlow | null>(flows[0] || null);

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

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);

  const [showCreateFlowModal, setShowCreateFlowModal] = useState<boolean>(false);
  const [showTestPhoneModal, setShowTestPhoneModal] = useState<boolean>(false);
  const [testPhone, setTestPhone] = useState<string>("");
  const [testNotice, setTestNotice] = useState<{ ok: boolean; msg: string } | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveBanner, setSaveBanner] = useState<string>("");

  const activeNodes: WhatsAppFlowNode[] = selectedFlow?.nodes || [];
  const selectedNode = activeNodes.find((n) => n.id === selectedNodeId) || activeNodes[0] || null;

  const [editTitle, setEditTitle] = useState<string>("");
  const [editDesc, setEditDesc] = useState<string>("");
  const [editType, setEditType] = useState<WhatsAppFlowNode["type"]>("message");
  const [editBranches, setEditBranches] = useState<WhatsAppFlowEdge[]>([]);

  useEffect(() => {
    if (selectedNode) {
      setEditTitle(selectedNode.title || "");
      setEditDesc(selectedNode.description || "");
      setEditType(selectedNode.type || "message");
      setEditBranches((selectedFlow?.edges || []).filter((e) => e.from === selectedNode.id));
    }
  }, [selectedNode?.id, selectedFlow?._id]);

  const [newFlowName, setNewFlowName] = useState("");
  const [newFlowDesc, setNewFlowDesc] = useState("");
  const [newFlowKeyword, setNewFlowKeyword] = useState("START");
  const [presetIndex, setPresetIndex] = useState<number | null>(null);

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
    let updatedEdges = selectedFlow.edges || [];
    if (editType === "condition") {
      const otherEdges = updatedEdges.filter((e) => e.from !== selectedNode.id);
      const cleanBranches = editBranches.filter((b) => b.to);
      updatedEdges = [...otherEdges, ...cleanBranches];
    }

    saveFlowData({ nodes: updatedNodes, edges: updatedEdges });
  }

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

  function handleDeleteNode(nodeId: string) {
    if (!selectedFlow || activeNodes.length <= 1) {
      alert("A workflow must have at least one step.");
      return;
    }
    const updatedNodes = activeNodes.filter((n) => n.id !== nodeId);
    const updatedEdges = (selectedFlow.edges || []).filter(
      (e) => e.from !== nodeId && e.to !== nodeId,
    );
    saveFlowData({ nodes: updatedNodes, edges: updatedEdges }, updatedNodes[0]?.id);
  }

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
        setSaveBanner("Workflow saved and deployed.");
        setTimeout(() => setSaveBanner(""), 3000);
        onRefresh();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update workflow");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateNewFlow(e: React.FormEvent) {
    e.preventDefault();
    if (!newFlowName.trim()) return;

    setIsSaving(true);
    try {
      const preset = presetIndex !== null ? PRESET_WORKFLOWS[presetIndex] : null;

      const res = await whatsappApi.saveFlow({
        name: newFlowName.trim(),
        description:
          newFlowDesc.trim() || preset?.description || "Automated WhatsApp conversation flow",
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
            description:
              "Thanks for reaching out! How can our automated assistant help you today?",
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

  async function handleTestFlowOnPhone(e: React.FormEvent) {
    e.preventDefault();
    if (!testPhone.trim() || !selectedFlow) return;
    setIsSaving(true);
    setTestNotice(null);

    try {
      const firstMsg =
        activeNodes[1]?.description ||
        activeNodes[0]?.description ||
        "Welcome to our WhatsApp Flow!";
      const text = `[Meta Flow Test: ${selectedFlow.name}]\nTrigger: "${selectedFlow.triggerKeyword || "START"}"\n\n${firstMsg}`;
      const res = await whatsappApi.sendTestMessage(testPhone.trim(), text);
      if (res.ok) {
        setTestNotice({ ok: true, msg: "Test message delivered via Meta Cloud API." });
      } else {
        setTestNotice({ ok: false, msg: res.error || "Failed to trigger test flow." });
      }
    } catch (err) {
      setTestNotice({ ok: false, msg: err instanceof Error ? err.message : "Network error" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="whatsapp-flows space-y-4">
      {/* Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-lg border border-[#eaeaea] bg-white p-3">
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <div ref={flowMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setFlowMenuOpen((prev) => !prev)}
              className="inline-flex h-8 items-center gap-2 rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-semibold text-[#171717] hover:bg-[#fafafa]"
            >
              <span className="truncate max-w-[220px]">{selectedFlow?.name || "Select Flow"}</span>
              <span className="rounded bg-[#f4f4f5] px-1.5 py-0.5 text-[10.5px] font-medium text-[#52525b]">
                {selectedFlow?.nodes?.length || 0} steps
              </span>
              <svg
                className="size-3.5 text-[#71717a]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </button>

            {flowMenuOpen && (
              <div className="absolute left-0 top-full z-40 mt-1 w-72 rounded-lg border border-[#eaeaea] bg-white p-1.5 shadow-lg">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#71717a]">
                  Switch Flow
                </div>
                <div className="max-h-60 space-y-0.5 overflow-y-auto">
                  {flows.map((flow) => {
                    const isSelected = flow._id === selectedFlow?._id;
                    return (
                      <button
                        key={flow._id}
                        type="button"
                        onClick={() => {
                          setSelectedFlow(flow);
                          setSelectedNodeId(flow.nodes?.[0]?.id || null);
                          setFlowMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12px] transition ${
                          isSelected
                            ? "bg-[#f4f4f5] font-semibold text-[#171717]"
                            : "text-[#52525b] hover:bg-[#fafafa] hover:text-[#171717]"
                        }`}
                      >
                        <span className="truncate pr-2">{flow.name}</span>
                        <span className="shrink-0 font-mono text-[10.5px] text-[#71717a]">
                          {flow.triggerKeyword || flow.triggerType}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {selectedFlow && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  saveFlowData({ status: selectedFlow.status === "active" ? "draft" : "active" })
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-[#eaeaea] bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#171717] hover:bg-[#fafafa]"
              >
                <span
                  className={`size-1.5 rounded-full ${
                    selectedFlow.status === "active" ? "bg-[#171717]" : "bg-[#a1a1aa]"
                  }`}
                />
                {selectedFlow.status === "active" ? "Active" : "Draft"}
              </button>

              <span className="rounded border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 font-mono text-[11px] text-[#52525b]">
                Trigger: {selectedFlow.triggerKeyword || selectedFlow.triggerType}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setInspectorOpen((prev) => !prev)}
            className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] font-medium text-[#52525b] hover:bg-[#fafafa] hover:text-[#171717]"
          >
            {inspectorOpen ? "Hide Inspector" : "Show Inspector"}
          </button>

          <button
            type="button"
            onClick={() => setShowTestPhoneModal(true)}
            className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] font-medium text-[#171717] hover:bg-[#fafafa]"
          >
            Test on Phone
          </button>

          <button
            type="button"
            onClick={() => setShowCreateFlowModal(true)}
            className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] font-medium text-[#171717] hover:bg-[#fafafa]"
          >
            + New Flow
          </button>

          <button
            type="button"
            onClick={() => saveFlowData({})}
            disabled={isSaving}
            className="inline-flex h-8 items-center rounded-md bg-[#00a884] px-3.5 text-[12px] font-medium text-white hover:bg-[#008069] disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Deploy Flow"}
          </button>
        </div>
      </div>

      {saveBanner && (
        <div className="flex items-center gap-2 rounded-md border border-[#eaeaea] bg-white px-3.5 py-2 text-[12px] text-[#171717]">
          <span className="size-1.5 rounded-full bg-[#171717]" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        {/* Left Step Palette */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-[#eaeaea] bg-white p-3.5 space-y-3.5">
            <div>
              <h3 className="text-[12.5px] font-semibold text-[#171717]">Step Toolbox</h3>
              <p className="text-[11px] text-[#71717a]">Click a step to append it to the flow.</p>
            </div>

            <div className="space-y-3">
              {NODE_PALETTE.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-[#71717a]">
                    {cat.category}
                  </span>
                  <div className="space-y-1">
                    {cat.items.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddNode(item.type, item.title, item.desc)}
                        className="group flex w-full items-center justify-between gap-2 rounded-md border border-[#eaeaea] bg-[#fafafa] px-2.5 py-2 text-left transition hover:border-[#171717] hover:bg-white"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="rounded border border-[#eaeaea] bg-white px-1 py-0.2 font-mono text-[9.5px] font-semibold text-[#171717]">
                              {item.code}
                            </span>
                            <span className="truncate text-[12px] font-medium text-[#171717]">
                              {item.title}
                            </span>
                          </div>
                          <span className="mt-0.5 block truncate text-[10.5px] text-[#71717a]">
                            {item.desc}
                          </span>
                        </div>
                        <span className="text-[12px] font-semibold text-[#71717a] group-hover:text-[#171717]">
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

        {/* Center Sequence Canvas (Automation Workflow Workspace Style) */}
        <div className={inspectorOpen ? "lg:col-span-6" : "lg:col-span-9"}>
          <div className="whatsapp-flow-canvas overflow-hidden rounded-xl border border-[#eaeaea] min-h-[560px] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#eaeaea] bg-white px-4 py-2.5">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="size-2 rounded-full bg-[#00a884]" />
                <span className="font-semibold text-[#171717]">{selectedFlow?.name}</span>
                <span className="rounded-full bg-[#f4f4f5] px-2 py-0.5 text-[11px] text-[#52525b]">
                  {activeNodes.length} steps
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleAddNode("message")}
                className="inline-flex h-7 items-center rounded-md border border-[#eaeaea] bg-white px-2.5 text-[11.5px] font-medium text-[#171717] hover:border-[#00a884] hover:text-[#008069]"
              >
                + Add Step
              </button>
            </div>

            <div className="flex-1 p-6 space-y-1">
              {activeNodes.map((node, index) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div key={node.id} className="flex flex-col items-center">
                    {index > 0 && (
                      <div className="flex flex-col items-center py-0.5">
                        <div className="h-4 w-0.5 bg-[#cbd5e1]" />
                        <span className="size-1.5 rounded-full bg-[#00a884]" />
                        <div className="h-2 w-0.5 bg-[#cbd5e1]" />
                      </div>
                    )}

                    <div
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        if (!inspectorOpen) setInspectorOpen(true);
                      }}
                      className={`group w-full max-w-md cursor-pointer rounded-xl border bg-white p-4 shadow-2xs transition ${
                        isSelected
                          ? "border-[#00a884] ring-2 ring-[#00a884]/20"
                          : "border-[#eaeaea] hover:border-[#00a884]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#00a884] text-[10.5px] font-semibold text-white">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="truncate block text-[13px] font-semibold text-[#171717]">
                              {node.title}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="rounded-md border border-[#eaeaea] bg-[#fafafa] px-1.5 py-0.5 font-mono text-[10px] uppercase text-[#52525b]">
                            {node.type}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateNode(node);
                            }}
                            className="rounded p-1 text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#171717]"
                            title="Duplicate"
                          >
                            ⧉
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNode(node.id);
                            }}
                            className="rounded p-1 text-[#71717a] hover:bg-rose-50 hover:text-rose-600"
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <p className="mt-2.5 rounded-lg border border-[#f0f0f0] bg-[#fafafa] px-3 py-2 text-[11.5px] leading-relaxed text-[#52525b] line-clamp-2">
                        {node.description}
                      </p>

                      {node.type === "condition" && (() => {
                        const branches = (selectedFlow?.edges || []).filter((e) => e.from === node.id);
                        return (
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[9.5px] font-semibold">
                            {branches.length > 0 ? (
                              branches.map((br, bIdx) => {
                                const targetNode = activeNodes.find((n) => n.id === br.to);
                                const isDefault = (br.matchKeywords || "").toLowerCase() === "default";
                                return (
                                  <div
                                    key={bIdx}
                                    className={`rounded-md p-1.5 border ${
                                      isDefault
                                        ? "bg-amber-50 border-amber-200 text-amber-800"
                                        : "bg-emerald-50 border-emerald-200 text-emerald-800"
                                    }`}
                                  >
                                    <div className="truncate">
                                      {br.caseLabel || (isDefault ? "Else Fallback" : `Case ${bIdx + 1}`)}: &quot;{br.matchKeywords || "any"}&quot;
                                    </div>
                                    <div className="text-[8.5px] opacity-80 truncate">➔ {targetNode?.title || br.to}</div>
                                  </div>
                                );
                              })
                            ) : (
                              <>
                                <div className="rounded-md bg-emerald-50 p-1.5 border border-emerald-200 text-emerald-800">
                                  ✓ If Match ➔ Next Step
                                </div>
                                <div className="rounded-md bg-amber-50 p-1.5 border border-amber-200 text-amber-800">
                                  ✕ Else ➔ Fallback
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })()}

                      {node.type === "action" && (() => {
                        const lower = `${node.title} ${node.description}`.toLowerCase();
                        const label =
                          lower.includes("support case") || lower.includes("open case") || lower.includes("ticket")
                            ? "🎫 Live Action: Create Support Case (CASE-XXXX)"
                            : lower.includes("razorpay") || lower.includes("payment")
                              ? "💳 Live Integration: Razorpay Payment Link"
                              : lower.includes("calendar") || lower.includes("calendly") || lower.includes("book")
                                ? "📅 Live Integration: Google Calendar / Calendly"
                                : lower.includes("crm") || lower.includes("hubspot") || lower.includes("zoho") || lower.includes("sheet")
                                  ? "📊 Live Integration: CRM & Google Sheets Sync"
                                  : lower.includes("slack")
                                    ? "🔔 Live Integration: Slack Team Alert"
                                    : lower.includes("handover") || lower.includes("human")
                                      ? "👤 Live Action: Human Agent Handover"
                                      : "📞 Outbound Action: Instant Voice Agent Callback";
                        return (
                          <div className="mt-2 flex items-center gap-1.5 text-[10.5px] font-semibold text-[#171717]">
                            <span>⚡</span>
                            <span className="underline">{label}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Node Inspector */}
        {inspectorOpen && (
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-[#eaeaea] bg-white p-4 space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#eaeaea] pb-2.5">
                <span className="text-[13px] font-semibold text-[#171717]">Step Inspector</span>
                {selectedNode && (
                  <span className="rounded border border-[#eaeaea] bg-[#fafafa] px-1.5 py-0.5 font-mono text-[10px] uppercase text-[#52525b]">
                    {selectedNode.type}
                  </span>
                )}
              </div>

              {selectedNode ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#71717a]">
                      Step Type
                    </label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as WhatsAppFlowNode["type"])}
                      className="mt-1 h-8 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] text-[#171717] focus:border-[#171717] focus:outline-none"
                    >
                      <option value="trigger">Trigger</option>
                      <option value="message">Message & Buttons</option>
                      <option value="condition">Decision / Branch</option>
                      <option value="form">Meta In-Chat Form</option>
                      <option value="action">Action (Voice Call / CRM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#71717a]">
                      Step Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mt-1 h-8 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] text-[#171717] focus:border-[#171717] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#71717a]">
                      Message Body / Logic
                    </label>
                    <textarea
                      rows={5}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="mt-1 w-full rounded-md border border-[#eaeaea] bg-white p-2.5 text-[12px] leading-relaxed text-[#171717] focus:border-[#171717] focus:outline-none"
                    />
                  </div>

                  {/* Multi-Case Branching Rules for Condition Nodes */}
                  {editType === "condition" && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-2.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                          Case Branch Rules ({editBranches.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const fallbackTarget = activeNodes.find((n) => n.id !== selectedNode.id)?.id || "";
                            setEditBranches((prev) => [
                              ...prev,
                              {
                                from: selectedNode.id,
                                to: fallbackTarget,
                                caseLabel: `Case ${prev.length + 1}`,
                                matchKeywords: `${prev.length + 1}`,
                              },
                            ]);
                          }}
                          className="rounded-md bg-[#171717] px-2 py-0.5 text-[10px] font-semibold text-white hover:bg-black"
                        >
                          + Add Case
                        </button>
                      </div>
                      {editBranches.length === 0 && (
                        <p className="text-[10px] text-amber-800">
                          Add case branches so customer replies (e.g. &quot;1, book&quot; vs &quot;2, support&quot; vs &quot;default&quot;) route to different steps.
                        </p>
                      )}
                      {editBranches.map((br, idx) => (
                        <div key={idx} className="rounded-md border border-[#eaeaea] bg-white p-2 space-y-1.5 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={br.caseLabel || ""}
                              onChange={(e) =>
                                setEditBranches((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, caseLabel: e.target.value } : item)),
                                )
                              }
                              placeholder="Case Label"
                              className="w-1/2 rounded border border-[#eaeaea] px-2 py-1 text-[11px]"
                            />
                            <input
                              type="text"
                              value={br.matchKeywords || ""}
                              onChange={(e) =>
                                setEditBranches((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, matchKeywords: e.target.value } : item)),
                                )
                              }
                              placeholder='Keywords or "default"'
                              className="w-1/2 rounded border border-[#eaeaea] px-2 py-1 text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={() => setEditBranches((prev) => prev.filter((_, i) => i !== idx))}
                              className="text-rose-600 px-1 font-bold"
                              title="Remove branch"
                            >
                              ✕
                            </button>
                          </div>
                          <select
                            value={br.to}
                            onChange={(e) =>
                              setEditBranches((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, to: e.target.value } : item)),
                              )
                            }
                            className="w-full rounded border border-[#eaeaea] bg-[#fafafa] px-2 py-1 text-[11px]"
                          >
                            <option value="">Choose Target Step...</option>
                            {activeNodes
                              .filter((n) => n.id !== selectedNode.id)
                              .map((n) => (
                                <option key={n.id} value={n.id}>
                                  ➔ {n.title}
                                </option>
                              ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Integration Quick-Fill Chips for Action Steps */}
                  {editType === "action" && (
                    <div>
                      <span className="block text-[10.5px] font-medium text-[#71717a]">
                        Quick Live Integration Action
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {[
                          { label: "💳 Razorpay ₹999", title: "Razorpay Payment Link (999 INR)", desc: "Create and send live Razorpay payment link for 999 on WhatsApp." },
                          { label: "📅 Calendar / Calendly", title: "Book Google Calendar / Calendly", desc: "Auto-book Google Calendar slot & share Calendly link in chat." },
                          { label: "📊 CRM & Sheets", title: "Sync CRM & Google Sheets", desc: "Sync lead to HubSpot, Zoho CRM, Salesforce, HighLevel, Freshsales & Google Sheets." },
                          { label: "🔔 Slack Alert", title: "Send Slack Team Alert", desc: "Send instant alert notification to connected Slack channel." },
                          { label: "🎫 Support Case", title: "Create Support Case (CASE-XXXX)", desc: "Open a tracked Support Case ticket, log to CRM/Sheets, and send Case ID in chat." },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setEditTitle(preset.title);
                              setEditDesc(preset.desc);
                            }}
                            className="rounded-md border border-[#eaeaea] bg-[#fafafa] px-2 py-1 text-[10.5px] font-medium text-[#171717] hover:bg-[#f4f4f5]"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="block text-[10.5px] font-medium text-[#71717a]">
                      Insert Variable
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {["{{name}}", "{{phone}}", "{{date}}", "{{time}}", "{{paymentLink}}", "{{calendlyLink}}", "{{caseNumber}}"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setEditDesc((prev) => `${prev} ${tag}`)}
                          className="rounded border border-[#eaeaea] bg-[#fafafa] px-1.5 py-0.5 font-mono text-[10.5px] text-[#171717] hover:bg-[#f4f4f5]"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#eaeaea] pt-3">
                    <button
                      type="button"
                      onClick={() => handleDeleteNode(selectedNode.id)}
                      className="h-8 rounded-md border border-[#eaeaea] bg-white px-2.5 text-[11.5px] font-medium text-[#52525b] hover:bg-[#fafafa] hover:text-[#171717]"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNodeEdits}
                      className="h-8 rounded-md bg-[#171717] px-3.5 text-[12px] font-medium text-white hover:bg-black"
                    >
                      Update Step
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-[12px] text-[#71717a]">
                  Select a step on the canvas to edit.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Flow Modal */}
      {showCreateFlowModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3">
              <h3 className="text-[14px] font-semibold text-[#171717]">
                Create Automated Workflow
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateFlowModal(false)}
                className="rounded-md p-1 text-[#71717a] hover:bg-[#f4f4f5]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewFlow} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11.5px] font-medium text-[#171717]">
                  Starting Blueprint
                </label>
                <div className="mt-1.5 space-y-1.5 max-h-48 overflow-y-auto">
                  <div
                    onClick={() => {
                      setPresetIndex(null);
                      setNewFlowName("General Inbound & Routing Flow");
                      setNewFlowDesc("General purpose customer welcome and routing flow");
                      setNewFlowKeyword("START");
                    }}
                    className={`cursor-pointer rounded-md border p-2.5 transition ${
                      presetIndex === null
                        ? "border-[#171717] bg-[#fafafa]"
                        : "border-[#eaeaea] bg-white hover:bg-[#fafafa]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-[#171717]">
                        Blank Flow (Start from Scratch)
                      </span>
                      <span className="text-[10.5px] text-[#71717a]">2 steps</span>
                    </div>
                  </div>

                  {PRESET_WORKFLOWS.map((tmpl, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setPresetIndex(idx);
                        setNewFlowName(tmpl.name);
                        setNewFlowDesc(tmpl.description);
                        setNewFlowKeyword(tmpl.triggerKeyword);
                      }}
                      className={`cursor-pointer rounded-md border p-2.5 transition ${
                        presetIndex === idx
                          ? "border-[#171717] bg-[#fafafa]"
                          : "border-[#eaeaea] bg-white hover:bg-[#fafafa]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#171717]">
                          {tmpl.name}
                        </span>
                        <span className="text-[10.5px] text-[#71717a]">
                          {tmpl.nodes.length} steps
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-[#71717a] line-clamp-1">
                        {tmpl.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-medium text-[#171717]">
                  Workflow Name
                </label>
                <input
                  type="text"
                  required
                  value={newFlowName}
                  onChange={(e) => setNewFlowName(e.target.value)}
                  placeholder="e.g. Clinic Appointment Flow"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-medium text-[#171717]">
                  Trigger Keyword
                </label>
                <input
                  type="text"
                  required
                  value={newFlowKeyword}
                  onChange={(e) => setNewFlowKeyword(e.target.value.toUpperCase())}
                  placeholder="e.g. BOOK, START, HELP"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 font-mono text-[12.5px] uppercase text-[#171717] focus:border-[#171717] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateFlowModal(false)}
                  className="h-8 rounded-md border border-[#eaeaea] bg-white px-3.5 text-[12px] font-medium text-[#52525b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-8 rounded-md bg-[#171717] px-4 text-[12px] font-medium text-white hover:bg-black disabled:opacity-50"
                >
                  {isSaving ? "Creating..." : "Create Workflow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Flow on Phone Modal */}
      {showTestPhoneModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3">
              <h3 className="text-[14px] font-semibold text-[#171717]">Test Workflow on Phone</h3>
              <button
                type="button"
                onClick={() => {
                  setShowTestPhoneModal(false);
                  setTestNotice(null);
                }}
                className="rounded-md p-1 text-[#71717a] hover:bg-[#f4f4f5]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTestFlowOnPhone} className="mt-3.5 space-y-3.5">
              <p className="text-[12px] text-[#52525b]">
                Sends the kickoff message for{" "}
                <span className="font-semibold text-[#171717]">{selectedFlow?.name}</span> to your
                phone via Meta Cloud API.
              </p>

              {testNotice && (
                <div className="rounded-md border border-[#eaeaea] bg-[#fafafa] p-2.5 text-[12px] text-[#171717]">
                  {testNotice.msg}
                </div>
              )}

              <div>
                <label className="block text-[11.5px] font-medium text-[#171717]">
                  Mobile Number (with country code)
                </label>
                <input
                  type="tel"
                  required
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3">
                <button
                  type="button"
                  onClick={() => setShowTestPhoneModal(false)}
                  className="h-8 rounded-md border border-[#eaeaea] bg-white px-3.5 text-[12px] font-medium text-[#52525b]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-8 rounded-md bg-[#171717] px-4 text-[12px] font-medium text-white hover:bg-black disabled:opacity-50"
                >
                  {isSaving ? "Sending..." : "Send Test Trigger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
