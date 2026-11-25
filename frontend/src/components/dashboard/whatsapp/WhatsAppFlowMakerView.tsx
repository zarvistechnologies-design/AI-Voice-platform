"use client";

import { useEffect, useRef, useState } from "react";
import type { WhatsAppAccountItem, WhatsAppFlow, WhatsAppFlowEdge, WhatsAppFlowNode } from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";

interface WhatsAppFlowMakerViewProps {
  flows: WhatsAppFlow[];
  accounts: WhatsAppAccountItem[];
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
  {
    name: "Support Desk Starter (Recommended)",
    description: "A ready-to-run support menu for case intake, status checks, and urgent escalation, with a one-hour SLA.",
    triggerKeyword: "SUPPORT",
    nodes: [
      { id: "node-1", type: "trigger" as const, title: "Support request received", description: 'Starts when a customer messages "SUPPORT".' },
      { id: "node-2", type: "message" as const, title: "Choose a support option", description: "Hi {{name}}! Choose an option below and we’ll take it from there.", buttons: ["Create a case", "Check status", "Escalate"] },
      { id: "node-3", type: "condition" as const, title: "Route support choice", description: "Routes each button reply to the matching support action.", conditionMode: "reply" as const },
      { id: "node-4", type: "form" as const, title: "Collect issue details", description: "Please briefly describe the issue so our support team can help." },
      { id: "node-5", type: "action" as const, title: "Create support case", description: "Create a tracked case and send the case number to the customer.", caseAction: "create" as const, caseSubject: "Support request: {{message}}", caseCategory: "Support", casePriority: "medium" as const, caseSlaMinutes: 60 },
      { id: "node-6", type: "action" as const, title: "Look up latest case", description: "Find the customer’s latest support case and send its current status.", caseAction: "lookup" as const },
      { id: "node-7", type: "action" as const, title: "Escalate to a specialist", description: "Raise the case to urgent and alert the connected support channel.", caseAction: "escalate" as const },
      { id: "node-8", type: "action" as const, title: "Talk to a support agent", description: "Hand the conversation over to a human support agent." },
    ],
    edges: [
      { from: "node-1", to: "node-2" },
      { from: "node-2", to: "node-3" },
      { from: "node-3", to: "node-4", caseLabel: "Create a case", matchKeywords: "create a case, new case, create" },
      { from: "node-3", to: "node-6", caseLabel: "Check status", matchKeywords: "check status, status, check" },
      { from: "node-3", to: "node-7", caseLabel: "Escalate", matchKeywords: "escalate, urgent" },
      { from: "node-3", to: "node-8", caseLabel: "Other request", matchKeywords: "default" },
      { from: "node-4", to: "node-5" },
    ],
  },
];

function getFlowReadinessIssues(flow: WhatsAppFlow, accounts: WhatsAppAccountItem[]): string[] {
  const issues: string[] = [];
  if (accounts.length === 0) issues.push("Connect a WhatsApp number before activating this flow.");
  if (!flow.triggerKeyword?.trim()) issues.push("Add a trigger keyword.");
  if (!flow.nodes.some((node) => node.type === "trigger")) issues.push("Add a Trigger step.");

  for (const node of flow.nodes) {
    if (node.mediaType && !node.mediaUrl?.trim()) {
      issues.push(`Add a public media URL to “${node.title}” or change it to text only.`);
    }
    if ((node.buttons?.length ?? 0) > 3) {
      issues.push(`Reduce the quick reply buttons in “${node.title}” to three or fewer.`);
    } else if (node.buttons?.some((button) => button.trim().length > 20)) {
      issues.push(`Shorten the quick reply button labels in “${node.title}” to 20 characters or fewer.`);
    }
    if (node.type === "condition") {
      const outgoing = flow.edges.filter((edge) => edge.from === node.id);
      if (outgoing.length === 0) issues.push(`Connect at least one branch from “${node.title}”.`);
      if (!outgoing.some((edge) => [edge.matchKeywords, edge.caseLabel].some((value) => ["default", "else", "*"].includes(String(value || "").trim().toLowerCase())))) {
        issues.push(`Add a Default branch to “${node.title}” for replies that don’t match another case.`);
      }
      for (const edge of outgoing) {
        if (!flow.nodes.some((target) => target.id === edge.to)) {
          issues.push(`Choose a target step for every branch from “${node.title}”.`);
          break;
        }
      }
    }
  }
  return [...new Set(issues)];
}

export function WhatsAppFlowMakerView({ flows, accounts, onRefresh }: WhatsAppFlowMakerViewProps) {
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
  const [createFlowError, setCreateFlowError] = useState("");
  const [showTestPhoneModal, setShowTestPhoneModal] = useState<boolean>(false);
  const [testPhone, setTestPhone] = useState<string>("");
  const [testNotice, setTestNotice] = useState<{ ok: boolean; msg: string } | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveBanner, setSaveBanner] = useState<string>("");

  const activeNodes: WhatsAppFlowNode[] = selectedFlow?.nodes || [];
  const selectedNode = activeNodes.find((n) => n.id === selectedNodeId) || activeNodes[0] || null;
  const flowReadinessIssues = selectedFlow ? getFlowReadinessIssues(selectedFlow, accounts) : [];
  const [editTriggerKeyword, setEditTriggerKeyword] = useState(selectedFlow?.triggerKeyword || "");

  useEffect(() => {
    setEditTriggerKeyword(selectedFlow?.triggerKeyword || "");
  }, [selectedFlow?._id, selectedFlow?.triggerKeyword]);

  const [editTitle, setEditTitle] = useState<string>("");
  const [editDesc, setEditDesc] = useState<string>("");
  const [editType, setEditType] = useState<WhatsAppFlowNode["type"]>("message");
  const [editMediaType, setEditMediaType] = useState<"none" | "image" | "document">("none");
  const [editMediaUrl, setEditMediaUrl] = useState("");
  const [editButtons, setEditButtons] = useState("");
  const [editConditionMode, setEditConditionMode] = useState<"reply" | "case_status" | "case_priority">("reply");
  const [editCaseAction, setEditCaseAction] = useState<"" | "create" | "lookup" | "update_status" | "escalate">("");
  const [editCaseSubject, setEditCaseSubject] = useState("Customer support request");
  const [editCaseCategory, setEditCaseCategory] = useState("Support");
  const [editCaseSlaMinutes, setEditCaseSlaMinutes] = useState("60");
  const [editCasePriority, setEditCasePriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [editCaseStatus, setEditCaseStatus] = useState<"open" | "in_progress" | "resolved">("in_progress");
  const [editBranches, setEditBranches] = useState<WhatsAppFlowEdge[]>([]);

  useEffect(() => {
    if (selectedNode) {
      setEditTitle(selectedNode.title || "");
      setEditDesc(selectedNode.description || "");
      setEditType(selectedNode.type || "message");
      setEditMediaType(selectedNode.mediaType || "none");
      setEditMediaUrl(selectedNode.mediaUrl || "");
      setEditButtons((selectedNode.buttons || []).join("\n"));
      setEditConditionMode(selectedNode.conditionMode || "reply");
      setEditCaseAction(selectedNode.caseAction || "");
      setEditCaseSubject(selectedNode.caseSubject || "Customer support request");
      setEditCaseCategory(selectedNode.caseCategory || "Support");
      setEditCaseSlaMinutes(String(selectedNode.caseSlaMinutes ?? 60));
      setEditCasePriority(selectedNode.casePriority || "medium");
      setEditCaseStatus(selectedNode.caseStatus || "in_progress");
      setEditBranches((selectedFlow?.edges || []).filter((e) => e.from === selectedNode.id));
    }
  }, [selectedNode?.id, selectedFlow?._id]);

  const [newFlowName, setNewFlowName] = useState("");
  const [newFlowDesc, setNewFlowDesc] = useState("");
  const [newFlowKeyword, setNewFlowKeyword] = useState("START");
  const [newFlowPhoneNumberId, setNewFlowPhoneNumberId] = useState(
    () => accounts.find((account) => account.isPrimary)?.phoneNumberId || accounts[0]?.phoneNumberId || "",
  );
  const [presetIndex, setPresetIndex] = useState<number | null>(null);

  function handleSaveNodeEdits() {
    if (!selectedFlow || !selectedNode) return;
    if (editType === "condition") {
      if (editBranches.length === 0) {
        setSaveBanner("Add at least one branch, then choose its matching reply and destination.");
        return;
      }
      if (editBranches.some((branch) => !branch.to)) {
        setSaveBanner("Choose a destination step for every branch before saving.");
        return;
      }
      if (editBranches.some((branch) => !branch.matchKeywords?.trim() && !["default", "else", "*"].includes(String(branch.caseLabel || "").trim().toLowerCase()))) {
        setSaveBanner('Add reply keywords to each branch. Use "default" for the fallback branch.');
        return;
      }
      if (!editBranches.some((branch) => [branch.matchKeywords, branch.caseLabel].some((value) => ["default", "else", "*"].includes(String(value || "").trim().toLowerCase())))) {
        setSaveBanner('Add a fallback branch by setting its match keywords to "default".');
        return;
      }
    }
    const updatedNodes = activeNodes.map((n) =>
      n.id === selectedNode.id
        ? {
            ...n,
            title: editTitle.trim() || n.title,
            description: editDesc.trim() || n.description,
            type: editType,
            mediaType: editMediaType === "none" ? undefined : editMediaType,
            mediaUrl: editMediaUrl.trim() || undefined,
            buttons: editButtons
              .split("\n")
              .map((button) => button.trim())
              .filter(Boolean)
              .slice(0, 3),
            conditionMode: editType === "condition" ? editConditionMode : undefined,
            caseAction: editType === "action" && editCaseAction ? editCaseAction : undefined,
            caseSubject: editCaseSubject.trim() || "Customer support request",
            caseCategory: editCaseCategory.trim() || "Support",
            caseSlaMinutes: Math.max(0, Number(editCaseSlaMinutes) || 0),
            casePriority: editCasePriority,
            caseStatus: editCaseStatus,
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
      setSaveBanner("Keep at least one step in the flow.");
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
    const nextStatus = data.status || selectedFlow.status;
    if (nextStatus === "active") {
      const issues = getFlowReadinessIssues({ ...selectedFlow, ...data }, accounts);
      if (issues.length > 0) {
        setSaveBanner(`Before activation: ${issues.join(" ")}`);
        return;
      }
    }
    setIsSaving(true);
    setSaveBanner("");

    try {
      const payload: Partial<WhatsAppFlow> = {
        _id: selectedFlow._id,
        name: selectedFlow.name,
        description: selectedFlow.description,
        triggerType: selectedFlow.triggerType,
        triggerKeyword: selectedFlow.triggerKeyword,
        phoneNumberId: selectedFlow.phoneNumberId || "",
        status: selectedFlow.status,
        nodes: data.nodes || activeNodes,
        edges: data.edges || selectedFlow.edges || [],
        ...data,
      };

      const res = await whatsappApi.saveFlow(payload);
      if (res.ok && res.flow) {
        setSelectedFlow(res.flow);
        if (selectNodeIdAfter) setSelectedNodeId(selectNodeIdAfter);
        setSaveBanner(res.flow.status === "active" ? "Flow saved and active." : "Flow saved as a draft.");
        setTimeout(() => setSaveBanner(""), 3000);
        onRefresh();
      }
    } catch (err) {
      setSaveBanner(err instanceof Error ? err.message : "Failed to update workflow.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateNewFlow(e: React.FormEvent) {
    e.preventDefault();
    if (!newFlowName.trim()) return;

    setCreateFlowError("");
    setIsSaving(true);
    try {
      const preset = presetIndex !== null ? PRESET_WORKFLOWS[presetIndex] : null;

      const res = await whatsappApi.saveFlow({
        name: newFlowName.trim(),
        description:
          newFlowDesc.trim() || preset?.description || "Automated WhatsApp conversation flow",
        triggerType: "keyword",
        triggerKeyword: newFlowKeyword.trim().toUpperCase() || "START",
        phoneNumberId: newFlowPhoneNumberId,
        status: "draft",
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
        setNewFlowPhoneNumberId(
          accounts.find((account) => account.isPrimary)?.phoneNumberId || accounts[0]?.phoneNumberId || "",
        );
        setPresetIndex(null);
        onRefresh();
      }
    } catch (err) {
      setCreateFlowError(err instanceof Error ? err.message : "Could not create flow.");
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

              <label className="flex items-center gap-1.5 text-[10px] font-medium text-[#71717a]">
                Trigger keyword
                <input
                  aria-label="Flow trigger keyword"
                  value={editTriggerKeyword}
                  onChange={(event) => setEditTriggerKeyword(event.target.value.toUpperCase())}
                  onBlur={() => {
                    if (editTriggerKeyword.trim() !== (selectedFlow.triggerKeyword || "")) {
                      void saveFlowData({ triggerKeyword: editTriggerKeyword.trim() });
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                  className="h-8 w-28 rounded-md border border-[#eaeaea] bg-white px-2 font-mono text-[10.5px] text-[#171717]"
                />
              </label>
              <label className="flex items-center gap-1.5 text-[10px] font-medium text-[#71717a]">
                Number
                <select
                  aria-label="WhatsApp number for this flow"
                  value={selectedFlow.phoneNumberId || ""}
                  onChange={(e) => void saveFlowData({ phoneNumberId: e.target.value })}
                  disabled={accounts.length === 0 || isSaving}
                  className="h-8 max-w-52 rounded-md border border-[#eaeaea] bg-white px-2 text-[10.5px] text-[#171717] disabled:bg-[#f4f4f5]"
                >
                  <option value="">All connected numbers</option>
                  {accounts.map((account) => <option key={account.phoneNumberId} value={account.phoneNumberId}>
                    {(account.label || account.verifiedName || "WhatsApp") + " · " + account.displayPhoneNumber}
                  </option>)}
                </select>
              </label>
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
            Send Preview
          </button>

          <button
            type="button"
            onClick={() => {
              setCreateFlowError("");
              const recommendedIndex = PRESET_WORKFLOWS.findIndex((template) => template.name.includes("(Recommended)"));
              const recommendedTemplate = PRESET_WORKFLOWS[recommendedIndex];
              setPresetIndex(recommendedIndex >= 0 ? recommendedIndex : null);
              setNewFlowName(recommendedTemplate?.name.replace(" (Recommended)", "") || "");
              setNewFlowDesc(recommendedTemplate?.description || "");
              setNewFlowKeyword(recommendedTemplate?.triggerKeyword || "START");
              setNewFlowPhoneNumberId(
                accounts.find((account) => account.isPrimary)?.phoneNumberId || accounts[0]?.phoneNumberId || "",
              );
              setShowCreateFlowModal(true);
            }}
            className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] font-medium text-[#171717] hover:bg-[#fafafa]"
          >
            + New Flow
          </button>

          <button
            type="button"
            onClick={() => void saveFlowData({ status: "active" })}
            disabled={isSaving || !selectedFlow}
            className="inline-flex h-8 items-center rounded-md bg-[#00a884] px-3.5 text-[12px] font-medium text-white hover:bg-[#008069] disabled:opacity-50"
          >
            {isSaving ? "Saving..." : selectedFlow?.status === "active" ? "Save & Deploy" : "Activate Flow"}
          </button>
        </div>
      </div>

      {saveBanner && (
        <div className="flex items-center gap-2 rounded-md border border-[#eaeaea] bg-white px-3.5 py-2 text-[12px] text-[#171717]">
          <span className="size-1.5 rounded-full bg-[#171717]" />
          <span>{saveBanner}</span>
        </div>
      )}

      {selectedFlow && (
        <div className={`rounded-xl border p-4 ${flowReadinessIssues.length ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${flowReadinessIssues.length ? "bg-amber-500" : "bg-emerald-600"}`} />
                <h3 className="text-[12.5px] font-semibold text-[#171717]">
                  {flowReadinessIssues.length ? "Setup checklist" : selectedFlow.status === "active" ? "Flow is live" : "Ready to activate"}
                </h3>
              </div>
              <p className="mt-1 text-[11px] text-[#52525b]">
                {flowReadinessIssues.length
                  ? "Fix these items before turning the flow on. New flows stay in draft until you activate them."
                  : selectedFlow.status === "active"
                    ? "Your trigger, WhatsApp connection, and branch targets are ready. The flow is listening for incoming messages."
                    : "Your trigger, WhatsApp connection, and branch targets are ready. Activate the flow when you’re ready."}
              </p>
            </div>
            {accounts.length === 0 && (
              <a href="/dashboard/whatsapp" className="text-[11px] font-semibold text-[#008069] underline underline-offset-2">Connect WhatsApp</a>
            )}
          </div>
          {flowReadinessIssues.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[10.5px] text-amber-900">
              {flowReadinessIssues.map((issue) => <li key={issue}>{issue}</li>)}
            </ul>
          )}
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

                      {(node.mediaType || (node.buttons?.length ?? 0) > 0) && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {node.mediaType && (
                            <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[9.5px] font-semibold text-sky-800">
                              {node.mediaType === "image" ? "Image attached" : "Document attached"}
                            </span>
                          )}
                          {(node.buttons?.length ?? 0) > 0 && (
                            <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[9.5px] font-semibold text-violet-800">
                              {node.buttons?.length} quick {node.buttons?.length === 1 ? "reply" : "replies"}
                            </span>
                          )}
                        </div>
                      )}
                      {node.caseAction === "create" && (node.caseSlaMinutes ?? 0) > 0 && (
                        <span className="mt-2 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9.5px] font-semibold text-amber-800">
                          SLA · {node.caseSlaMinutes} min
                        </span>
                      )}

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
                          node.caseAction === "create"
                            ? "🎫 Create support case"
                            : node.caseAction === "lookup"
                              ? "🔎 Look up customer case"
                              : node.caseAction === "update_status"
                                ? `📝 Update case to ${node.caseStatus?.replace("_", " ") || "in progress"}`
                                : node.caseAction === "escalate"
                                  ? "🚨 Escalate case to urgent"
                                  : lower.includes("support case") || lower.includes("open case") || lower.includes("ticket")
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

                  {editType === "message" && (
                    <div className="space-y-2.5 rounded-lg border border-[#eaeaea] bg-[#fafafa] p-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#52525b]">Message format</label>
                        <select
                          value={editMediaType}
                          onChange={(event) => setEditMediaType(event.target.value as "none" | "image" | "document")}
                          className="mt-1 h-8 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] text-[#171717]"
                        >
                          <option value="none">Text only</option>
                          <option value="image">Image attachment + message</option>
                          <option value="document">Document attachment + message</option>
                        </select>
                      </div>
                      {editMediaType !== "none" && (
                        <div>
                          <label className="block text-[11px] font-medium text-[#52525b]">Public media URL</label>
                          <input
                            type="url"
                            value={editMediaUrl}
                            onChange={(event) => setEditMediaUrl(event.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="mt-1 h-8 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[11px] text-[#171717]"
                          />
                          <p className="mt-1 text-[10px] leading-relaxed text-[#71717a]">Use a public HTTPS file URL that Meta can fetch. The message text is sent separately.</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-[11px] font-medium text-[#52525b]">Quick reply buttons (up to 3)</label>
                        <textarea
                          rows={3}
                          value={editButtons}
                          onChange={(event) => setEditButtons(event.target.value)}
                          placeholder={"Book an appointment\nOpen a support case\nTalk to an agent"}
                          className="mt-1 w-full rounded-md border border-[#eaeaea] bg-white p-2 text-[11px] text-[#171717]"
                        />
                        <p className="mt-1 text-[10px] leading-relaxed text-[#71717a]">Add one button per line, up to 3. Button titles are limited to 20 characters. Match replies with keywords on the next Decision step.</p>
                      </div>
                    </div>
                  )}

                  {/* Multi-Case Branching Rules for Condition Nodes */}
                  {editType === "condition" && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-2.5 space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-900">Branch on</label>
                        <select
                          value={editConditionMode}
                          onChange={(event) => setEditConditionMode(event.target.value as "reply" | "case_status" | "case_priority")}
                          className="mt-1 h-8 w-full rounded-md border border-amber-200 bg-white px-2 text-[11px] text-[#171717]"
                        >
                          <option value="reply">Customer reply / button</option>
                          <option value="case_status">Current case status</option>
                          <option value="case_priority">Current case priority</option>
                        </select>
                        {editConditionMode !== "reply" && (
                          <p className="mt-1 text-[10px] text-amber-800">Add branch keywords that match the case field, such as open, in_progress, resolved, high, or urgent.</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                          Case Branch Rules ({editBranches.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditBranches((prev) => [
                              ...prev,
                              {
                                from: selectedNode.id,
                                to: "",
                                caseLabel: `Case ${prev.length + 1}`,
                                matchKeywords: "",
                              },
                            ]);
                          }}
                          className="rounded-md bg-emerald-700 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-emerald-800"
                        >
                          + Add Branch
                        </button>
                      </div>
                      <p className="text-[10px] leading-relaxed text-amber-900">
                        Each branch needs a reply match and a destination step. Add one branch with match keyword <strong>default</strong> to catch all other replies.
                      </p>
                      {editBranches.length === 0 && (
                        <p className="text-[10px] text-amber-800">
                          Add branches for customer replies, case status, or priority. Use &quot;default&quot; as a fallback branch.
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
                              placeholder='Reply keywords, comma separated'
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
                      <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50/50 p-2.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-900">Support case operation</label>
                        <select
                          value={editCaseAction}
                          onChange={(event) => setEditCaseAction(event.target.value as "" | "create" | "lookup" | "update_status" | "escalate")}
                          className="mt-1 h-8 w-full rounded-md border border-amber-200 bg-white px-2 text-[11px] text-[#171717]"
                        >
                          <option value="">No case action</option>
                          <option value="create">Create a new case</option>
                          <option value="lookup">Look up this customer’s case</option>
                          <option value="update_status">Update case status</option>
                          <option value="escalate">Escalate case as urgent</option>
                        </select>
                        {editCaseAction === "create" && (
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            <input
                              value={editCaseSubject}
                              onChange={(event) => setEditCaseSubject(event.target.value)}
                              placeholder="Case subject ({{message}} supported)"
                              className="h-8 rounded-md border border-[#eaeaea] bg-white px-2 text-[10.5px] text-[#171717] sm:col-span-2"
                            />
                            <input
                              value={editCaseCategory}
                              onChange={(event) => setEditCaseCategory(event.target.value)}
                              placeholder="Category"
                              className="h-8 rounded-md border border-[#eaeaea] bg-white px-2 text-[10.5px] text-[#171717]"
                            />
                            <select
                              value={editCasePriority}
                              onChange={(event) => setEditCasePriority(event.target.value as "low" | "medium" | "high" | "urgent")}
                              className="h-8 rounded-md border border-[#eaeaea] bg-white px-2 text-[10.5px] text-[#171717]"
                            >
                              <option value="low">Low priority</option>
                              <option value="medium">Medium priority</option>
                              <option value="high">High priority</option>
                              <option value="urgent">Urgent priority</option>
                            </select>
                            <select
                              value={editCaseSlaMinutes}
                              onChange={(event) => setEditCaseSlaMinutes(event.target.value)}
                              className="h-8 rounded-md border border-[#eaeaea] bg-white px-2 text-[10.5px] text-[#171717]"
                            >
                              <option value="0">No SLA timer</option>
                              <option value="15">Escalate after 15 minutes</option>
                              <option value="30">Escalate after 30 minutes</option>
                              <option value="60">Escalate after 1 hour</option>
                              <option value="240">Escalate after 4 hours</option>
                              <option value="1440">Escalate after 24 hours</option>
                            </select>
                          </div>
                        )}
                        {editCaseAction === "update_status" && (
                          <div className="mt-2">
                            <label className="block text-[10px] font-medium text-[#52525b]">Set status</label>
                            <select
                              value={editCaseStatus}
                              onChange={(event) => setEditCaseStatus(event.target.value as "open" | "in_progress" | "resolved")}
                              className="mt-1 h-8 w-full rounded-md border border-[#eaeaea] bg-white px-2 text-[10.5px] text-[#171717]"
                            >
                              <option value="open">Open</option>
                              <option value="in_progress">In progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>
                        )}
                        {(editCaseAction === "lookup" || editCaseAction === "update_status") && (
                          <p className="mt-1.5 text-[10px] leading-relaxed text-amber-900">Uses a case number mentioned in the customer’s reply, or the customer’s latest open case.</p>
                        )}
                        {editCaseAction === "escalate" && (
                          <p className="mt-1.5 text-[10px] leading-relaxed text-amber-900">Sets the case to urgent, alerts the connected Slack channel, and updates active case automations.</p>
                        )}
                      </div>
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
                              setEditCaseAction(preset.label.includes("Support Case") ? "create" : "");
                            }}
                            className="rounded-md border border-[#eaeaea] bg-[#fafafa] px-2 py-1 text-[10.5px] font-medium text-[#171717] hover:bg-[#f4f4f5]"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                      <a
                        href="/dashboard/integrations"
                        className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-semibold text-blue-700 underline underline-offset-2"
                      >
                        Connect Razorpay in Integrations ↗
                      </a>
                    </div>
                  )}
                  <div>
                    <span className="block text-[10.5px] font-medium text-[#71717a]">
                      Insert Variable
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {["{{name}}", "{{phone}}", "{{message}}", "{{date}}", "{{time}}", "{{paymentLink}}", "{{calendlyLink}}", "{{caseNumber}}", "{{caseStatus}}", "{{casePriority}}", "{{caseSubject}}"].map((tag) => (
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
              {createFlowError && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-800">{createFlowError}</div>}
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

                  {PRESET_WORKFLOWS.map((tmpl, idx) => ({ tmpl, idx }))
                    .sort((left, right) => Number(right.tmpl.name.includes("(Recommended)")) - Number(left.tmpl.name.includes("(Recommended)")))
                    .map(({ tmpl, idx }) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setPresetIndex(idx);
                        setNewFlowName(tmpl.name.replace(" (Recommended)", ""));
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
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="truncate text-[12px] font-semibold text-[#171717]">
                            {tmpl.name.replace(" (Recommended)", "")}
                          </span>
                          {tmpl.name.includes("(Recommended)") && <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">Recommended</span>}
                        </div>
                        <span className="shrink-0 text-[10.5px] text-[#71717a]">
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

              <div>
                <label htmlFor="new-flow-phone-number" className="block text-[11.5px] font-medium text-[#171717]">
                  Connect to WhatsApp Number
                </label>
                <select
                  id="new-flow-phone-number"
                  value={newFlowPhoneNumberId}
                  onChange={(event) => setNewFlowPhoneNumberId(event.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12px] text-[#171717]"
                >
                  <option value="">All connected numbers</option>
                  {accounts.map((account) => (
                    <option key={account.phoneNumberId} value={account.phoneNumberId}>
                      {(account.label || account.verifiedName || "WhatsApp") + " · " + account.displayPhoneNumber}
                      {account.isPrimary ? " (Primary)" : ""}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10.5px] text-[#71717a]">
                  Incoming messages on this number will trigger this flow.
                </p>
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
              <h3 className="text-[14px] font-semibold text-[#171717]">Send a Preview Message</h3>
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
                Sends a sample of the first message for{" "}
                <span className="font-semibold text-[#171717]">{selectedFlow?.name}</span> to your
                phone. This preview does not run the workflow; to test it, send the trigger keyword
                from WhatsApp to the connected business number.
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
                  {isSaving ? "Sending..." : "Send Preview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
