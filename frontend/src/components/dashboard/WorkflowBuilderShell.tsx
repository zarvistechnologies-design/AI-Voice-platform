"use client";

import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type DragEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSidebar, getDashboardSidebarInitialState } from "@/components/dashboard/DashboardSidebar";
import { getServerSession, getSession, logoutSession, subscribeToSession } from "@/lib/auth";
import {
  voiceApi,
  type AgentSummary,
  type AgentWorkflow,
  type WorkflowEdge as ApiWorkflowEdge,
  type WorkflowNode as ApiWorkflowNode,
  type WorkflowNodeType,
  type WorkflowRun,
  type WorkflowSummary,
  type WorkflowValidation,
} from "@/lib/voice";

type CanvasNode = Node<ApiWorkflowNode["data"], WorkflowNodeType>;
type Snapshot = { nodes: CanvasNode[]; edges: Edge[] };
type NodePreset = { label: string; description: string; config: Record<string, unknown> };
type PaletteItem = { type: WorkflowNodeType; label: string; description: string; color: string; icon: IconName };
type IconName = "trigger" | "agent" | "condition" | "tool" | "action" | "handoff" | "wait" | "end" | "plus" | "save" | "play" | "publish" | "check" | "trash" | "layout" | "close" | "copy" | "pause";

const PALETTE: PaletteItem[] = [
  { type: "trigger", label: "Trigger", description: "Call, webhook, schedule, or event", color: "#0e8b79", icon: "trigger" },
  { type: "agent", label: "AI agent", description: "Understand, speak, and decide", color: "#6558d3", icon: "agent" },
  { type: "condition", label: "Condition", description: "Branch using rules or intent", color: "#ca7a10", icon: "condition" },
  { type: "tool", label: "Tool / API", description: "Read or write connected data", color: "#147cb3", icon: "tool" },
  { type: "action", label: "WhatsApp / Action", description: "WhatsApp, SMS, email, CRM, or webhook", color: "#d04f86", icon: "action" },
  { type: "handoff", label: "Human handoff", description: "Transfer with full context", color: "#d75b45", icon: "handoff" },
  { type: "wait", label: "Wait", description: "Pause until time or event", color: "#687986", icon: "wait" },
  { type: "end", label: "Outcome", description: "Close with a measured result", color: "#258d4f", icon: "end" },
];

const PALETTE_BY_TYPE = Object.fromEntries(PALETTE.map((item) => [item.type, item])) as Record<WorkflowNodeType, PaletteItem>;

function id(prefix: string) {
  return `${prefix}-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
}

function Icon({ name, className = "size-4" }: { name: IconName; className?: string }) {
  const props = { className: `${className} fill-none stroke-current stroke-[1.9]`, viewBox: "0 0 24 24", "aria-hidden": true };
  if (name === "trigger") return <svg {...props}><path d="M13 2 4 14h7l-1 8 9-12h-7Z" /></svg>;
  if (name === "agent") return <svg {...props}><path d="M7 9h10a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3ZM12 9V5M9 5h6M8 14h.01M16 14h.01" /></svg>;
  if (name === "condition") return <svg {...props}><path d="M6 3v5a4 4 0 0 0 4 4h8M6 21v-5a4 4 0 0 1 4-4M15 9l3 3-3 3" /></svg>;
  if (name === "tool") return <svg {...props}><path d="m14.7 6.3 3-3a5 5 0 0 1-6.4 6.4L5.7 15.3a2.1 2.1 0 0 0 3 3l5.6-5.6a5 5 0 0 1 6.4-6.4l-3 3" /></svg>;
  if (name === "action") return <svg {...props}><path d="M4 5h16v12H8l-4 4ZM8 9h8M8 13h5" /></svg>;
  if (name === "handoff") return <svg {...props}><path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a6 6 0 0 1 12 0M15 8h7M19 4l4 4-4 4" /></svg>;
  if (name === "wait") return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
  if (name === "end") return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg>;
  if (name === "plus") return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
  if (name === "save") return <svg {...props}><path d="M5 3h12l2 2v16H5ZM8 3v6h8V3M8 21v-7h8v7" /></svg>;
  if (name === "play") return <svg {...props}><path d="m8 5 11 7-11 7Z" /></svg>;
  if (name === "publish") return <svg {...props}><path d="M12 16V3M7 8l5-5 5 5M5 13v7h14v-7" /></svg>;
  if (name === "check") return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  if (name === "trash") return <svg {...props}><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></svg>;
  if (name === "layout") return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><path d="M10 6h2a5 5 0 0 1 5 5v3" /></svg>;
  if (name === "close") return <svg {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === "copy") return <svg {...props}><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>;
  return <svg {...props}><path d="M7 5h10v14H7ZM4 9h3M17 9h3M4 15h3M17 15h3" /></svg>;
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function WorkflowCanvasNode({ data, type, selected }: NodeProps<CanvasNode>) {
  const item = PALETTE_BY_TYPE[type];
  return (
    <div className={`group min-w-[188px] rounded-xl border bg-white shadow-[0_7px_22px_rgba(29,48,43,.09)] transition ${selected ? "border-[#118778] ring-4 ring-[#118778]/10" : "border-[#dbe4e1] hover:border-[#a9bcb6]"}`}>
      {type !== "trigger" ? <Handle type="target" position={Position.Left} className="!size-3 !border-2 !border-white !bg-[#82918d]" /> : null}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg text-white" style={{ backgroundColor: item.color }}><Icon name={item.icon} className="size-3.5" /></span>
        <span className="min-w-0 flex-1"><span className="block text-[9px] font-extrabold uppercase tracking-[.13em]" style={{ color: item.color }}>{item.label}</span><strong className="mt-0.5 block truncate text-sm text-[#17231f]">{data.label}</strong></span>
      </div>
      {data.description ? <p className="border-t border-[#edf1f0] px-3 py-1.5 text-[9px] leading-4 text-[#71817d]">{data.description}</p> : null}
      {type !== "end" ? <Handle type="source" position={Position.Right} className="!size-3 !border-2 !border-white" style={{ backgroundColor: item.color }} /> : null}
    </div>
  );
}

const nodeTypes: NodeTypes = {
  trigger: WorkflowCanvasNode,
  agent: WorkflowCanvasNode,
  condition: WorkflowCanvasNode,
  tool: WorkflowCanvasNode,
  action: WorkflowCanvasNode,
  handoff: WorkflowCanvasNode,
  wait: WorkflowCanvasNode,
  end: WorkflowCanvasNode,
};

const appointmentTemplate = {
  id: "appointment",
  name: "Appointment automation",
  description: "Answer a patient, check availability, book the appointment, and confirm on WhatsApp.",
  nodes: [
    node("trigger-1", "trigger", 40, 160, "Incoming call", "Starts when a patient calls", { event: "inbound_call" }),
    node("agent-1", "agent", 330, 160, "Understand patient", "Collect intent and required details", { goal: "Understand the reason for the call and collect the minimum required patient details." }),
    node("condition-1", "condition", 630, 160, "Urgent request?", "Separate urgent care from routine booking", { expression: "intent == urgent" }),
    node("handoff-1", "handoff", 940, 30, "Urgent handoff", "Transfer to the care team with context", { team: "Care desk" }),
    node("tool-1", "tool", 940, 255, "Check availability", "Read live provider slots", { integration: "DigitalBot", operation: "doctor_availability" }),
    node("action-1", "action", 1240, 255, "Book appointment", "Create the appointment in the connected system", { channel: "crm", operation: "create_appointment" }),
    node("action-2", "action", 1530, 255, "WhatsApp confirmation", "Send appointment details and confirmation", { channel: "whatsapp", operation: "send_appointment_confirmation" }),
    node("end-1", "end", 1820, 255, "Booking confirmed", "Measured outcome: appointment_created", { outcome: "appointment_created" }),
  ],
  edges: [edge("e1", "trigger-1", "agent-1"), edge("e2", "agent-1", "condition-1"), edge("e3", "condition-1", "handoff-1", "Yes"), edge("e4", "condition-1", "tool-1", "No"), edge("e5", "tool-1", "action-1"), edge("e6", "action-1", "action-2"), edge("e7", "action-2", "end-1")],
};

const leadTemplate = {
  id: "lead",
  name: "Lead management",
  description: "Qualify callers, save the lead, route high-intent prospects, and automate WhatsApp follow-up.",
  nodes: [
    node("trigger-1", "trigger", 40, 160, "New enquiry", "Inbound call or web lead", { event: "inbound_call" }),
    node("agent-1", "agent", 330, 160, "Qualify lead", "Ask budget, timeline, location, and need", { goal: "Qualify the lead conversationally." }),
    node("condition-1", "condition", 630, 160, "Sales ready?", "Route using qualification score", { expression: "lead_score >= 70" }),
    node("handoff-1", "handoff", 940, 40, "Live sales transfer", "Send summary before transfer", { team: "Sales" }),
    node("action-1", "action", 940, 270, "Save lead", "Create or update the CRM lead", { channel: "crm", operation: "create_lead" }),
    node("action-2", "action", 1250, 160, "WhatsApp follow-up", "Send the correct sales follow-up automatically", { channel: "whatsapp", operation: "send_lead_follow_up" }),
    node("end-1", "end", 1540, 160, "Lead captured", "Measured outcome: qualified_lead", { outcome: "qualified_lead" }),
  ],
  edges: [edge("e1", "trigger-1", "agent-1"), edge("e2", "agent-1", "condition-1"), edge("e3", "condition-1", "handoff-1", "Yes"), edge("e4", "condition-1", "action-1", "No"), edge("e5", "handoff-1", "action-2"), edge("e6", "action-1", "action-2"), edge("e7", "action-2", "end-1")],
};

const CREATE_TEMPLATES = [leadTemplate, appointmentTemplate];

function node(nodeId: string, type: WorkflowNodeType, x: number, y: number, label: string, description: string, config: Record<string, unknown>): ApiWorkflowNode {
  return { id: nodeId, type, position: { x, y }, data: { label, description, config } };
}

function edge(edgeId: string, source: string, target: string, label = ""): ApiWorkflowEdge {
  return { id: edgeId, source, target, label };
}

function decorateEdge(item: ApiWorkflowEdge): Edge {
  return { ...item, type: "smoothstep", animated: false, markerEnd: { type: MarkerType.ArrowClosed, color: "#82918d" }, style: { stroke: "#82918d", strokeWidth: 1.8 }, labelStyle: { fill: "#52645f", fontWeight: 700, fontSize: 10 }, labelBgStyle: { fill: "#ffffff", fillOpacity: 0.94 } };
}

function toSummary(workflow: AgentWorkflow): WorkflowSummary {
  return { _id: workflow._id, name: workflow.name, description: workflow.description, status: workflow.status, version: workflow.version, publishedVersion: workflow.publishedVersion, lastPublishedAt: workflow.lastPublishedAt, createdAt: workflow.createdAt, updatedAt: workflow.updatedAt, nodeCount: workflow.nodes.length, edgeCount: workflow.edges.length, runCount: workflow.runs.length };
}

export function WorkflowBuilderShell() {
  return <ReactFlowProvider><WorkflowBuilder /></ReactFlowProvider>;
}

function WorkflowBuilder() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const flow = useReactFlow<CanvasNode, Edge>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showUserSidebar, setShowUserSidebar] = useState(getDashboardSidebarInitialState);
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [current, setCurrent] = useState<AgentWorkflow | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<CanvasNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [validation, setValidation] = useState<WorkflowValidation | null>(null);
  const [testRun, setTestRun] = useState<WorkflowRun | null>(null);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [historyAvailability, setHistoryAvailability] = useState({ canUndo: false, canRedo: false });
  const historyRef = useRef<{ past: Snapshot[]; future: Snapshot[] }>({ past: [], future: [] });

  useEffect(() => {
    if (!session) { router.replace("/login?next=/dashboard/workflows"); return; }
    let active = true;
    Promise.all([voiceApi.workflows(), voiceApi.agentSummaries()]).then(([workflowResult, agentResult]) => {
      if (!active) return;
      setWorkflows(workflowResult.workflows);
      setAgents(agentResult.agents);
      if (workflowResult.workflows[0]) void openWorkflow(workflowResult.workflows[0]._id);
    }).catch((error: unknown) => { if (active) setNotice(error instanceof Error ? error.message : "Could not load workflows."); });
    return () => { active = false; };
    // openWorkflow intentionally uses the initial stable API client.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, session]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!createMenuOpen) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setCreateMenuOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [createMenuOpen]);

  const selectedNode = nodes.find((item) => item.id === selectedNodeId) ?? null;

  function loadWorkflow(workflow: AgentWorkflow) {
    setCurrent(workflow);
    setNodes(workflow.nodes as CanvasNode[]);
    setEdges(workflow.edges.map(decorateEdge));
    setSelectedNodeId(null);
    setValidation(null);
    setTestRun(null);
    setDirty(false);
    historyRef.current = { past: [], future: [] };
    setHistoryAvailability({ canUndo: false, canRedo: false });
    window.setTimeout(() => flow.fitView({ padding: 0.18, duration: 450 }), 50);
  }

  async function openWorkflow(workflowId: string) {
    if (dirty && !window.confirm("Discard your unsaved workflow changes?")) return;
    setBusy("loading"); setNotice("");
    try { const result = await voiceApi.workflow(workflowId); loadWorkflow(result.workflow); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not open workflow."); }
    finally { setBusy(""); }
  }

  function showCreateMenu() {
    setCreateMenuOpen(true);
  }

  function snapshot() {
    historyRef.current.past.push({ nodes: structuredClone(nodes), edges: structuredClone(edges) });
    historyRef.current.past = historyRef.current.past.slice(-30);
    historyRef.current.future = [];
    setHistoryAvailability({ canUndo: true, canRedo: false });
  }

  function undo() {
    const previous = historyRef.current.past.pop();
    if (!previous) return;
    historyRef.current.future.push({ nodes: structuredClone(nodes), edges: structuredClone(edges) });
    setNodes(previous.nodes); setEdges(previous.edges); setDirty(true);
    setHistoryAvailability({ canUndo: historyRef.current.past.length > 0, canRedo: true });
  }

  function redo() {
    const next = historyRef.current.future.pop();
    if (!next) return;
    historyRef.current.past.push({ nodes: structuredClone(nodes), edges: structuredClone(edges) });
    setNodes(next.nodes); setEdges(next.edges); setDirty(true);
    setHistoryAvailability({ canUndo: true, canRedo: historyRef.current.future.length > 0 });
  }

  const serialize = useCallback(() => ({
    name: current?.name || "Untitled workflow",
    description: current?.description || "",
    nodes: nodes.map((item) => ({ id: item.id, type: item.type as WorkflowNodeType, position: item.position, data: item.data })),
    edges: edges.map((item) => ({ id: item.id, source: item.source, target: item.target, sourceHandle: item.sourceHandle ?? undefined, targetHandle: item.targetHandle ?? undefined, label: typeof item.label === "string" ? item.label : "" })),
    variables: current?.variables || {},
  }), [current, edges, nodes]);

  async function createFromTemplate(template: typeof appointmentTemplate | null) {
    if (dirty && !window.confirm("Discard your unsaved workflow changes?")) return;
    setCreateMenuOpen(false);
    setBusy("create"); setNotice("");
    try {
      const result = await voiceApi.createWorkflow({ name: template?.name || "Untitled workflow", description: template?.description || "Design an agentic workflow from scratch.", nodes: template?.nodes || [], edges: template?.edges || [], variables: {} });
      setWorkflows((items) => [toSummary(result.workflow), ...items]);
      loadWorkflow(result.workflow);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not create workflow."); }
    finally { setBusy(""); }
  }

  async function saveDraft(silent = false) {
    if (!current) return null;
    setBusy("save"); if (!silent) setNotice("");
    try {
      const result = await voiceApi.updateWorkflow(current._id, serialize());
      setCurrent(result.workflow); setValidation(result.validation); setDirty(false);
      setWorkflows((items) => items.map((item) => item._id === result.workflow._id ? toSummary(result.workflow) : item));
      if (!silent) setNotice("Draft saved.");
      return result.workflow;
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save workflow."); return null; }
    finally { setBusy(""); }
  }

  async function validate() {
    setBusy("validate"); setNotice("");
    try { const result = await voiceApi.validateWorkflow({ nodes: serialize().nodes, edges: serialize().edges }); setValidation(result.validation); setNotice(result.validation.valid ? "Workflow structure is valid." : "Fix validation errors before publishing."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not validate workflow."); }
    finally { setBusy(""); }
  }

  async function test() {
    const saved = dirty ? await saveDraft(true) : current;
    if (!saved) return;
    setBusy("test"); setNotice("");
    try { const result = await voiceApi.testWorkflow(saved._id, { caller_name: "Test caller", intent: "appointment" }); setTestRun(result.run); setValidation(null); setSelectedNodeId(null); setNotice(`Test completed through ${result.run.timeline.length} steps.`); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Test run failed."); }
    finally { setBusy(""); }
  }

  async function publish() {
    const saved = dirty ? await saveDraft(true) : current;
    if (!saved) return;
    setBusy("publish"); setNotice("");
    try { const result = await voiceApi.publishWorkflow(saved._id); setCurrent(result.workflow); setValidation(result.validation); setWorkflows((items) => items.map((item) => item._id === saved._id ? toSummary(result.workflow) : item)); setNotice("Workflow published and live."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not publish workflow."); }
    finally { setBusy(""); }
  }

  async function pause() {
    if (!current) return;
    setBusy("pause");
    try { const result = await voiceApi.pauseWorkflow(current._id); setCurrent(result.workflow); setWorkflows((items) => items.map((item) => item._id === result.workflow._id ? toSummary(result.workflow) : item)); setNotice("Workflow paused."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not pause workflow."); }
    finally { setBusy(""); }
  }

  async function removeWorkflow() {
    if (!current || !window.confirm(`Delete ${current.name}? This cannot be undone.`)) return;
    setBusy("delete"); setNotice("");
    try {
      await voiceApi.deleteWorkflow(current._id);
      const remaining = workflows.filter((item) => item._id !== current._id);
      setWorkflows(remaining); setCurrent(null); setNodes([]); setEdges([]); setSelectedNodeId(null); setDirty(false);
      historyRef.current = { past: [], future: [] };
      setHistoryAvailability({ canUndo: false, canRedo: false });
      if (remaining[0]) {
        const result = await voiceApi.workflow(remaining[0]._id);
        loadWorkflow(result.workflow);
      } else setNotice("Workflow deleted.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not delete workflow."); }
    finally { setBusy(""); }
  }

  function addNode(type: WorkflowNodeType, position?: { x: number; y: number }, preset?: NodePreset) {
    snapshot();
    const item = PALETTE_BY_TYPE[type];
    const defaultConfig = type === "action" ? { channel: "whatsapp", operation: "send_message" } : {};
    const newNode: CanvasNode = { id: id(type), type, position: position || { x: 160 + nodes.length * 24, y: 120 + nodes.length * 18 }, data: { label: preset?.label || item.label, description: preset?.description || item.description, config: preset?.config || defaultConfig } };
    setNodes((items) => [...items, newNode]); setSelectedNodeId(newNode.id); setDirty(true);
  }

  const onConnect = useCallback((connection: Connection) => {
    snapshot();
    setEdges((items) => addEdge({ ...connection, id: id("edge"), type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed, color: "#82918d" }, style: { stroke: "#82918d", strokeWidth: 1.8 } }, items));
    setDirty(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges, nodes, setEdges]);

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/vozon-workflow-node") as WorkflowNodeType;
    if (!PALETTE_BY_TYPE[type]) return;
    const position = flow.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const rawPreset = event.dataTransfer.getData("application/vozon-workflow-preset");
    let preset: NodePreset | undefined;
    if (rawPreset) {
      try {
        const parsed = JSON.parse(rawPreset) as Partial<NodePreset>;
        if (typeof parsed.label === "string" && typeof parsed.description === "string" && parsed.config && typeof parsed.config === "object") preset = parsed as NodePreset;
      } catch { /* Ignore malformed drag data and add the base component. */ }
    }
    addNode(type, position, preset);
  }

  function updateSelectedNode(patch: Partial<ApiWorkflowNode["data"]>) {
    if (!selectedNodeId) return;
    setNodes((items) => items.map((item) => item.id === selectedNodeId ? { ...item, data: { ...item.data, ...patch } } : item));
    setDirty(true);
  }

  function updateConfig(key: string, value: unknown) {
    if (!selectedNode) return;
    updateSelectedNode({ config: { ...selectedNode.data.config, [key]: value } });
  }

  function deleteSelected() {
    if (!selectedNodeId) return;
    snapshot();
    setNodes((items) => items.filter((item) => item.id !== selectedNodeId));
    setEdges((items) => items.filter((item) => item.source !== selectedNodeId && item.target !== selectedNodeId));
    setSelectedNodeId(null); setDirty(true);
  }

  function duplicateSelected() {
    if (!selectedNode) return;
    snapshot();
    const clone = { ...structuredClone(selectedNode), id: id(selectedNode.type || "node"), position: { x: selectedNode.position.x + 40, y: selectedNode.position.y + 40 }, selected: false };
    setNodes((items) => [...items, clone]); setSelectedNodeId(clone.id); setDirty(true);
  }

  function autoLayout() {
    snapshot();
    const trigger = nodes.find((item) => item.type === "trigger");
    const ordered: CanvasNode[] = [];
    const visited = new Set<string>();
    const queue = trigger ? [trigger] : [...nodes];
    while (queue.length) {
      const item = queue.shift();
      if (!item || visited.has(item.id)) continue;
      visited.add(item.id); ordered.push(item);
      edges.filter((edgeItem) => edgeItem.source === item.id).forEach((edgeItem) => { const target = nodes.find((nodeItem) => nodeItem.id === edgeItem.target); if (target) queue.push(target); });
    }
    nodes.filter((item) => !visited.has(item.id)).forEach((item) => ordered.push(item));
    setNodes(ordered.map((item, index) => ({ ...item, position: { x: 80 + (index % 4) * 310, y: 100 + Math.floor(index / 4) * 190 } })));
    setDirty(true); window.setTimeout(() => flow.fitView({ padding: 0.18, duration: 400 }), 30);
  }

  if (!session) return <main className="grid min-h-screen place-items-center bg-[#f7f9f8] text-sm font-semibold text-[#71817d]">Opening workflow builder…</main>;

  return (
    <main className={`dashboard-home-theme grid h-screen min-h-[720px] w-full min-w-0 overflow-hidden bg-[#f5f8f7] text-[#14231f] ${showUserSidebar ? "lg:grid-cols-[248px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"}`}>
      <DashboardSidebar activeLabel="Agentic Workflows" userInitials={initials(session.name)} userName={session.name} userEmail={session.email} onLogout={() => void logoutSession().then(() => router.replace("/login"))} onBeforeNavigate={() => !dirty || window.confirm("Discard your unsaved workflow changes?")} showUserSidebar={showUserSidebar} setShowUserSidebar={setShowUserSidebar} />
      <section className="flex min-h-0 min-w-0 flex-col">
        <DashboardPageHeader compact eyebrow="Agentic automation" title={current ? <input aria-label="Workflow name" className="w-full max-w-xl border-0 bg-transparent p-0 text-xl font-semibold tracking-[-.02em] text-[#171821] outline-none" value={current.name} onChange={(event) => { setCurrent({ ...current, name: event.target.value }); setDirty(true); }} /> : "Create your first workflow"} description={current ? <span className="flex flex-wrap items-center gap-2"><span>{current.status === "live" ? current.version > current.publishedVersion ? `Live v${current.publishedVersion} · Draft v${current.version}` : `Live · Version ${current.version}` : `${current.status === "paused" ? "Paused" : "Draft"} · Version ${current.version}`}{dirty ? " · Unsaved changes" : current.status === "live" && current.version > current.publishedVersion ? " · Changes not published" : ""}</span><span className="text-[#b7c3c0]">|</span><input aria-label="Workflow description" className="min-w-[280px] flex-1 border-0 bg-transparent p-0 text-xs text-[#60716c] outline-none" value={current.description} onChange={(event) => { setCurrent({ ...current, description: event.target.value }); setDirty(true); }} placeholder="Describe what this workflow accomplishes" /></span> : "Choose lead management, appointment automation, or a blank flow."} actions={current ? <><button type="button" onClick={showCreateMenu} disabled={Boolean(busy)} className="inline-flex items-center gap-2 border border-[#d4dfdc] bg-white px-3 text-xs font-bold text-[#43534f]"><Icon name="plus" /> New</button><button type="button" onClick={() => void removeWorkflow()} disabled={Boolean(busy)} title="Delete workflow" aria-label="Delete workflow" className="grid size-9 place-items-center border border-rose-200 bg-rose-50 text-rose-700 disabled:opacity-45"><Icon name="trash" /></button><button type="button" onClick={() => void saveDraft()} disabled={Boolean(busy) || !dirty} className="inline-flex items-center gap-2 border border-[#d4dfdc] bg-white px-3 text-xs font-bold text-[#43534f] disabled:opacity-45"><Icon name="save" /> Save</button><button type="button" onClick={() => void test()} disabled={Boolean(busy)} className="inline-flex items-center gap-2 border border-[#c9dcd7] bg-[#edf7f4] px-3 text-xs font-bold text-[#0e6f62] disabled:opacity-45"><Icon name="play" /> Test</button>{current.status === "live" && current.version === current.publishedVersion && !dirty ? <button type="button" onClick={() => void pause()} disabled={Boolean(busy)} className="inline-flex items-center gap-2 border border-amber-200 bg-amber-50 px-3 text-xs font-bold text-amber-700"><Icon name="pause" /> Pause</button> : <button type="button" onClick={() => void publish()} disabled={Boolean(busy)} className="inline-flex items-center gap-2 border border-[#118778] bg-[#118778] px-4 text-xs font-bold text-white shadow-sm"><Icon name="publish" /> Publish</button>}</> : <button type="button" onClick={showCreateMenu} className="inline-flex items-center gap-2 border border-[#118778] bg-[#118778] px-4 text-xs font-bold text-white"><Icon name="plus" /> Create workflow</button>} />

        {notice ? <div className="flex min-h-10 items-center justify-between gap-4 border-b border-[#dbe4e1] bg-white px-4 text-xs font-semibold text-[#52645f]"><span>{notice}</span><button type="button" onClick={() => setNotice("")} className="text-[#84938f]"><Icon name="close" /></button></div> : null}

        {createMenuOpen ? <>
          <button type="button" aria-label="Close new workflow menu" onClick={() => setCreateMenuOpen(false)} className="fixed inset-0 z-40 cursor-default bg-[#13251f]/15 backdrop-blur-[1px]" />
          <CreateWorkflowMenu busy={Boolean(busy)} compactSidebar={!showUserSidebar} onClose={() => setCreateMenuOpen(false)} onBlank={() => void createFromTemplate(null)} onTemplate={(template) => void createFromTemplate(template)} />
        </> : null}

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[195px_minmax(0,1fr)]">
          <aside className="hidden min-h-0 border-r border-[#dbe4e1] bg-white lg:flex lg:flex-col">
            <div className="flex items-center justify-between border-b border-[#e6ecea] px-4 py-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#0e6f62]">Workspace</p><h2 className="mt-1 text-sm font-bold">Your workflows</h2></div><button type="button" onClick={showCreateMenu} disabled={Boolean(busy)} className="grid size-8 place-items-center rounded-lg bg-[#118778] text-white" title="Create a workflow" aria-expanded={createMenuOpen}><Icon name="plus" /></button></div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {workflows.length ? workflows.map((item) => <button key={item._id} type="button" onClick={() => void openWorkflow(item._id)} className={`mb-1 w-full rounded-xl px-3 py-2.5 text-left transition ${current?._id === item._id ? "bg-[#edf7f4] ring-1 ring-[#b9d8d0]" : "hover:bg-[#f5f8f7]"}`}><span className="flex items-center justify-between gap-2"><strong className="truncate text-xs">{item.name}</strong><i className={`size-2 rounded-full ${item.status === "live" ? "bg-emerald-500" : item.status === "paused" ? "bg-amber-500" : "bg-slate-300"}`} /></span><span className="mt-1 block text-[10px] text-[#82918d]">{item.nodeCount} nodes · v{item.version}</span></button>) : <p className="px-3 py-6 text-center text-xs text-[#82918d]">No saved workflows yet.</p>}
            </div>
            <button type="button" onClick={showCreateMenu} className="m-3 flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#bfd8d2] bg-[#edf7f4] text-xs font-bold text-[#0e6f62]"><Icon name="plus" /> New workflow</button>
          </aside>

          {!current ? <EmptyWorkflowState busy={Boolean(busy)} onCreate={showCreateMenu} /> : <section className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)]">
            <div className="flex min-h-10 items-center justify-end gap-1.5 border-b border-[#dbe4e1] bg-white px-3">
              <button type="button" onClick={undo} disabled={!historyAvailability.canUndo} className="rounded-lg px-2 py-1.5 text-xs font-bold text-[#52645f] disabled:opacity-35">Undo</button><button type="button" onClick={redo} disabled={!historyAvailability.canRedo} className="rounded-lg px-2 py-1.5 text-xs font-bold text-[#52645f] disabled:opacity-35">Redo</button><button type="button" onClick={autoLayout} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-[#52645f]"><Icon name="layout" /> Arrange</button><button type="button" onClick={() => void validate()} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-[#0e6f62]"><Icon name="check" /> Validate</button>
            </div>

            <div className="grid min-h-0 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_270px]">
              <div ref={wrapperRef} className="vozon-flow min-h-[520px] bg-[#f7faf9]" onDrop={onDrop} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }}>
                <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={(changes) => { onNodesChange(changes); if (changes.some((change) => change.type !== "select")) setDirty(true); }} onEdgesChange={(changes) => { onEdgesChange(changes); if (changes.some((change) => change.type !== "select")) setDirty(true); }} onConnect={onConnect} onNodeClick={(_, selected) => { setSelectedNodeId(selected.id); setValidation(null); }} onPaneClick={() => setSelectedNodeId(null)} onNodeDragStart={snapshot} fitView fitViewOptions={{ padding: 0.2 }} minZoom={0.25} maxZoom={1.7} snapToGrid snapGrid={[16, 16]} deleteKeyCode={["Backspace", "Delete"]} defaultEdgeOptions={{ type: "smoothstep" }}>
                  <Background color="#cad8d4" gap={22} size={1} /><Controls position="bottom-left" /><MiniMap position="bottom-right" pannable zoomable style={{ width: 160, height: 104 }} nodeColor={(item) => PALETTE_BY_TYPE[item.type as WorkflowNodeType]?.color || "#82918d"} maskColor="rgba(244,248,247,.72)" />
                </ReactFlow>
              </div>

              <aside className="min-h-0 overflow-y-auto border-l border-[#dbe4e1] bg-white">
                {selectedNode ? <Inspector node={selectedNode} agents={agents} outgoing={edges.filter((item) => item.source === selectedNode.id)} onChange={updateSelectedNode} onConfig={updateConfig} onEdgeLabel={(edgeId, label) => { setEdges((items) => items.map((item) => item.id === edgeId ? { ...item, label } : item)); setDirty(true); }} onDelete={deleteSelected} onDuplicate={duplicateSelected} onClose={() => setSelectedNodeId(null)} /> : null}
                {!selectedNode && validation ? <ValidationPanel validation={validation} onClose={() => setValidation(null)} /> : null}
                {!selectedNode && !validation && testRun ? <RunPanel run={testRun} onClose={() => setTestRun(null)} /> : null}
                {!selectedNode && !validation && !testRun ? <NodePalette onAdd={(type, preset) => addNode(type, undefined, preset)} /> : null}
              </aside>
            </div>
          </section>}
        </div>
      </section>
    </main>
  );
}

function EmptyWorkflowState({ busy, onCreate }: { busy: boolean; onCreate: () => void }) {
  return <section className="grid min-h-0 place-items-center bg-[#f7faf9] p-6"><div className="max-w-md text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e6f5f1] text-[#0e6f62]"><Icon name="agent" className="size-7" /></span><h2 className="mt-5 text-2xl font-semibold tracking-[-.03em]">Build your first automation</h2><p className="mt-3 text-sm leading-6 text-[#64746f]">Start with lead management, appointment automation, or a blank workflow.</p><button type="button" onClick={onCreate} disabled={busy} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#118778] px-5 text-sm font-bold text-white disabled:opacity-50"><Icon name="plus" /> Create workflow</button></div></section>;
}

function CreateWorkflowMenu({ busy, compactSidebar, onClose, onBlank, onTemplate }: { busy: boolean; compactSidebar: boolean; onClose: () => void; onBlank: () => void; onTemplate: (template: typeof appointmentTemplate) => void }) {
  return <section role="dialog" aria-modal="true" aria-labelledby="create-workflow-title" className={`fixed inset-x-4 top-24 z-50 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-[#d7e2df] bg-white p-4 shadow-[0_24px_70px_rgba(21,49,42,.24)] sm:left-auto sm:right-6 sm:w-[390px] lg:right-auto lg:top-[130px] ${compactSidebar ? "lg:left-[271px]" : "lg:left-[455px]"}`}>
    <header className="flex items-start justify-between gap-4 border-b border-[#e8efed] pb-4"><div><p className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[#0e796b]">New workflow</p><h2 id="create-workflow-title" className="mt-1 text-lg font-bold text-[#17231f]">Choose how to start</h2><p className="mt-1 text-xs leading-5 text-[#71817d]">Templates include voice, CRM, and WhatsApp automation.</p></div><button type="button" onClick={onClose} aria-label="Close" className="grid size-8 shrink-0 place-items-center rounded-lg text-[#71817d] hover:bg-[#f2f6f5]"><Icon name="close" /></button></header>
    <div className="mt-4 grid gap-2.5">
      {CREATE_TEMPLATES.map((template, index) => <button key={template.id} type="button" onClick={() => onTemplate(template)} disabled={busy} className="group flex items-center gap-3 rounded-xl border border-[#dfe7e4] bg-white p-3.5 text-left transition hover:border-[#98beb5] hover:bg-[#f7fbfa] disabled:opacity-50"><span className={`grid size-11 shrink-0 place-items-center rounded-xl ${index === 0 ? "bg-violet-50 text-violet-700" : "bg-teal-50 text-teal-700"}`}><Icon name={index === 0 ? "condition" : "action"} className="size-5" /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-[#17231f]">{template.name}</strong><span className="mt-1 block text-[11px] leading-4 text-[#71817d]">{template.description}</span><span className="mt-1.5 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">WhatsApp included</span></span><span className="text-[#118778]">→</span></button>)}
      <button type="button" onClick={onBlank} disabled={busy} className="group flex items-center gap-3 rounded-xl border border-dashed border-[#b9d0ca] bg-[#fbfdfc] p-3.5 text-left transition hover:border-[#118778] disabled:opacity-50"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#edf7f4] text-[#0e6f62]"><Icon name="plus" className="size-5" /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-[#17231f]">Blank workflow</strong><span className="mt-1 block text-[11px] leading-4 text-[#71817d]">Create a new automation from an empty canvas.</span></span><span className="text-[#118778]">→</span></button>
    </div>
  </section>;
}

const AUTOMATION_PRESETS: NodePreset[] = [
  { label: "WhatsApp message", description: "Send a template or conversational WhatsApp message", config: { channel: "whatsapp", operation: "send_message" } },
  { label: "CRM update", description: "Create or update a CRM record", config: { channel: "crm", operation: "update_record" } },
  { label: "SMS notification", description: "Send an automated SMS notification", config: { channel: "sms", operation: "send_message" } },
  { label: "Email automation", description: "Send an automated email", config: { channel: "email", operation: "send_email" } },
  { label: "Calendar booking", description: "Create or update an appointment", config: { channel: "calendar", operation: "create_booking" } },
  { label: "Automated call", description: "Start an automated voice call", config: { channel: "voice", operation: "start_call" } },
  { label: "Webhook action", description: "Call another system through a webhook", config: { channel: "webhook", operation: "post_event" } },
];

const AUTOMATION_APPEARANCE: Record<string, { color: string; icon: IconName }> = {
  whatsapp: { color: "#20a66a", icon: "action" },
  crm: { color: "#6558d3", icon: "tool" },
  sms: { color: "#1689b8", icon: "action" },
  email: { color: "#d04f86", icon: "action" },
  calendar: { color: "#ca7a10", icon: "wait" },
  voice: { color: "#0e8b79", icon: "agent" },
  webhook: { color: "#687986", icon: "tool" },
};

function NodePalette({ onAdd }: { onAdd: (type: WorkflowNodeType, preset?: NodePreset) => void }) {
  return <div>
    <header className="sticky top-0 z-10 border-b border-[#e5ecea] bg-white px-3 py-2.5"><p className="text-[8px] font-extrabold uppercase tracking-[.15em] text-[#0e6f62]">Workflow components</p><div className="mt-0.5 flex items-baseline justify-between gap-2"><h3 className="text-xs font-bold">Add a step</h3><span className="text-[9px] text-[#82918d]">Drag or click</span></div></header>
    <div className="grid gap-1.5 p-2.5">
      {PALETTE.map((item) => <button key={item.type} draggable onDragStart={(event) => { event.dataTransfer.setData("application/vozon-workflow-node", item.type); event.dataTransfer.effectAllowed = "move"; }} onClick={() => onAdd(item.type)} type="button" className="group flex min-h-[54px] items-center gap-2.5 rounded-xl border border-[#dfe7e4] bg-white p-2.5 text-left transition hover:-translate-y-0.5 hover:border-[#a9bcb6] hover:bg-[#fafcfb] hover:shadow-sm"><span className="grid size-8 shrink-0 place-items-center rounded-lg text-white shadow-sm" style={{ backgroundColor: item.color }}><Icon name={item.icon} className="size-3.5" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-[11px] text-[#25332f]">{item.label}</strong><span className="mt-0.5 block truncate text-[9px] leading-3 text-[#71817d]">{item.description}</span></span><span className="text-[#a8b5b1] transition group-hover:text-[#118778]">+</span></button>)}
      <section className="mt-1 border-t border-[#e5ecea] pt-2.5">
        <p className="px-1 text-[8px] font-extrabold uppercase tracking-[.15em] text-[#82918d]">Quick automations</p>
        <div className="mt-1.5 grid gap-1.5">{AUTOMATION_PRESETS.map((preset) => {
          const appearance = AUTOMATION_APPEARANCE[String(preset.config.channel)] || AUTOMATION_APPEARANCE.webhook;
          return <button key={preset.label} type="button" draggable onDragStart={(event) => { event.dataTransfer.setData("application/vozon-workflow-node", "action"); event.dataTransfer.setData("application/vozon-workflow-preset", JSON.stringify(preset)); event.dataTransfer.effectAllowed = "move"; }} onClick={() => onAdd("action", preset)} className="group flex min-h-[54px] items-center gap-2.5 rounded-xl border border-[#dfe7e4] bg-white p-2.5 text-left transition hover:-translate-y-0.5 hover:border-[#a9bcb6] hover:bg-[#fafcfb] hover:shadow-sm"><span className="grid size-8 shrink-0 place-items-center rounded-lg text-white shadow-sm" style={{ backgroundColor: appearance.color }}><Icon name={appearance.icon} className="size-3.5" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-[11px] text-[#25332f]">{preset.label}</strong><span className="mt-0.5 block truncate text-[9px] leading-3 text-[#71817d]">{preset.description}</span></span><span className="text-[#a8b5b1] transition group-hover:text-[#118778]">+</span></button>;
        })}</div>
      </section>
    </div>
  </div>;
}

function Inspector({ node: selected, agents, outgoing, onChange, onConfig, onEdgeLabel, onDelete, onDuplicate, onClose }: { node: CanvasNode; agents: AgentSummary[]; outgoing: Edge[]; onChange: (patch: Partial<ApiWorkflowNode["data"]>) => void; onConfig: (key: string, value: unknown) => void; onEdgeLabel: (edgeId: string, label: string) => void; onDelete: () => void; onDuplicate: () => void; onClose: () => void }) {
  const item = PALETTE_BY_TYPE[selected.type as WorkflowNodeType];
  const config = selected.data.config;
  return <div><header className="sticky top-0 z-10 flex items-start justify-between border-b border-[#e5ecea] bg-white px-4 py-4"><div className="flex gap-3"><span className="grid size-9 place-items-center rounded-xl text-white" style={{ backgroundColor: item.color }}><Icon name={item.icon} /></span><div><p className="text-[9px] font-extrabold uppercase tracking-[.15em]" style={{ color: item.color }}>{item.label}</p><h3 className="mt-1 text-sm font-bold">Configure node</h3></div></div><button type="button" onClick={onClose} className="text-[#82918d]"><Icon name="close" /></button></header><div className="grid gap-4 p-4"><Field label="Name"><input className="workflow-input" value={selected.data.label} onChange={(event) => onChange({ label: event.target.value })} /></Field><Field label="Description"><textarea className="workflow-input min-h-20 resize-y" value={selected.data.description} onChange={(event) => onChange({ description: event.target.value })} /></Field><NodeConfig type={selected.type as WorkflowNodeType} config={config} agents={agents} onConfig={onConfig} />{outgoing.length ? <section className="grid gap-2 border-t border-[#e5ecea] pt-4"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#82918d]">Outgoing paths</p>{outgoing.map((edgeItem) => <Field key={edgeItem.id} label={`To ${edgeItem.target}`}><input className="workflow-input" value={typeof edgeItem.label === "string" ? edgeItem.label : ""} onChange={(event) => onEdgeLabel(edgeItem.id, event.target.value)} placeholder={selected.type === "condition" ? "Yes / No / condition" : "Optional path label"} /></Field>)}</section> : null}<div className="grid grid-cols-2 gap-2 border-t border-[#e5ecea] pt-4"><button type="button" onClick={onDuplicate} className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#dbe4e1] text-xs font-bold text-[#52645f]"><Icon name="copy" /> Duplicate</button><button type="button" onClick={onDelete} className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 text-xs font-bold text-rose-700"><Icon name="trash" /> Delete</button></div></div></div>;
}

function NodeConfig({ type, config, agents, onConfig }: { type: WorkflowNodeType; config: Record<string, unknown>; agents: AgentSummary[]; onConfig: (key: string, value: unknown) => void }) {
  if (type === "trigger") return <><Field label="Event"><select className="workflow-input" value={String(config.event || "inbound_call")} onChange={(event) => onConfig("event", event.target.value)}><option value="inbound_call">Inbound call</option><option value="whatsapp_message">WhatsApp message received</option><option value="outbound_campaign">Outbound campaign</option><option value="webhook">Webhook</option><option value="schedule">Schedule</option><option value="manual">Manual</option></select></Field><Field label="Filter"><input className="workflow-input" value={String(config.filter || "")} onChange={(event) => onConfig("filter", event.target.value)} placeholder="Optional event filter" /></Field></>;
  if (type === "agent") return <><Field label="Voice agent"><select className="workflow-input" value={String(config.agentId || "")} onChange={(event) => onConfig("agentId", event.target.value)}><option value="">Choose an agent</option>{agents.map((agent) => <option key={agent._id} value={agent._id}>{agent.name} · {agent.status}</option>)}</select></Field><Field label="Goal"><textarea className="workflow-input min-h-24" value={String(config.goal || "")} onChange={(event) => onConfig("goal", event.target.value)} placeholder="What should the agent accomplish?" /></Field></>;
  if (type === "condition") return <><Field label="Expression"><input className="workflow-input font-mono text-xs" value={String(config.expression || "")} onChange={(event) => onConfig("expression", event.target.value)} placeholder="lead_score >= 70" /></Field><Field label="Fallback path"><input className="workflow-input" value={String(config.fallback || "No")} onChange={(event) => onConfig("fallback", event.target.value)} /></Field></>;
  if (type === "tool") return <><Field label="Integration"><input className="workflow-input" value={String(config.integration || "")} onChange={(event) => onConfig("integration", event.target.value)} placeholder="DigitalBot, Salesforce, custom API…" /></Field><Field label="Operation"><input className="workflow-input font-mono text-xs" value={String(config.operation || "")} onChange={(event) => onConfig("operation", event.target.value)} placeholder="check_availability" /></Field><Field label="Failure behavior"><select className="workflow-input" value={String(config.onFailure || "retry")} onChange={(event) => onConfig("onFailure", event.target.value)}><option value="retry">Retry then continue</option><option value="handoff">Human handoff</option><option value="stop">Stop workflow</option></select></Field></>;
  if (type === "action") return <><Field label="Channel"><select className="workflow-input" value={String(config.channel || "whatsapp")} onChange={(event) => onConfig("channel", event.target.value)}><option value="whatsapp">WhatsApp</option><option value="sms">SMS</option><option value="email">Email</option><option value="crm">CRM update</option><option value="calendar">Calendar / appointment</option><option value="voice">Automated voice call</option><option value="webhook">Webhook</option></select></Field><Field label="Action"><input className="workflow-input" value={String(config.operation || "")} onChange={(event) => onConfig("operation", event.target.value)} placeholder="send_message, update_record…" /></Field><Field label="Recipient or record"><input className="workflow-input font-mono text-xs" value={String(config.target || "")} onChange={(event) => onConfig("target", event.target.value)} placeholder="{{contact.phone}}" /></Field>{String(config.channel || "whatsapp") === "whatsapp" ? <Field label="WhatsApp template"><input className="workflow-input" value={String(config.template || "")} onChange={(event) => onConfig("template", event.target.value)} placeholder="appointment_confirmation" /></Field> : null}<Field label="Message or payload"><textarea className="workflow-input min-h-24" value={String(config.message || "")} onChange={(event) => onConfig("message", event.target.value)} placeholder="Use variables such as {{contact.name}}" /></Field></>;
  if (type === "handoff") return <><Field label="Team or queue"><input className="workflow-input" value={String(config.team || "")} onChange={(event) => onConfig("team", event.target.value)} placeholder="Sales, care desk, tier 2…" /></Field><Field label="Phone number"><input className="workflow-input" value={String(config.phone || "")} onChange={(event) => onConfig("phone", event.target.value)} placeholder="+91…" /></Field><Field label="Transfer message"><textarea className="workflow-input min-h-20" value={String(config.message || "")} onChange={(event) => onConfig("message", event.target.value)} /></Field></>;
  if (type === "wait") return <><Field label="Wait type"><select className="workflow-input" value={String(config.waitType || "duration")} onChange={(event) => onConfig("waitType", event.target.value)}><option value="duration">For a duration</option><option value="event">Until an event</option><option value="schedule">Until scheduled time</option></select></Field><Field label="Duration (minutes)"><input className="workflow-input" type="number" min="1" value={String(config.minutes || 5)} onChange={(event) => onConfig("minutes", Number(event.target.value))} /></Field></>;
  if (type === "end") return <><Field label="Outcome key"><input className="workflow-input font-mono text-xs" value={String(config.outcome || "")} onChange={(event) => onConfig("outcome", event.target.value)} placeholder="appointment_created" /></Field><Field label="Success"><select className="workflow-input" value={String(config.success ?? "true")} onChange={(event) => onConfig("success", event.target.value === "true")}><option value="true">Successful outcome</option><option value="false">Unsuccessful outcome</option></select></Field></>;
  return null;
}

function ValidationPanel({ validation, onClose }: { validation: WorkflowValidation; onClose: () => void }) {
  return <div><PanelHeader eyebrow="Quality check" title={validation.valid ? "Ready to publish" : "Needs attention"} onClose={onClose} /><div className="grid gap-4 p-4"><div className={`rounded-xl border p-4 ${validation.valid ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}><p className="text-sm font-bold">{validation.valid ? "No blocking errors" : `${validation.errors.length} blocking issue${validation.errors.length === 1 ? "" : "s"}`}</p></div>{validation.errors.length ? <IssueList title="Errors" items={validation.errors} tone="text-rose-700" /> : null}{validation.warnings.length ? <IssueList title="Warnings" items={validation.warnings} tone="text-amber-700" /> : null}{!validation.warnings.length && validation.valid ? <p className="text-xs leading-5 text-[#64746f]">Every connection points to a valid node and the workflow has one clear trigger.</p> : null}</div></div>;
}

function RunPanel({ run, onClose }: { run: WorkflowRun; onClose: () => void }) {
  return <div><PanelHeader eyebrow="Test execution" title={`${run.timeline.length} steps completed`} onClose={onClose} /><div className="p-4"><div className="relative grid gap-0">{run.timeline.map((step, index) => <div key={`${step.nodeId}-${index}`} className="relative flex gap-3 pb-5"><span className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Icon name="check" className="size-3.5" /></span>{index < run.timeline.length - 1 ? <span className="absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-px bg-[#dbe4e1]" /> : null}<div><p className="text-xs font-bold text-[#25332f]">{step.label}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-[#82918d]">{step.type}</p><p className="mt-1 text-xs leading-5 text-[#64746f]">{step.detail}</p></div></div>)}</div></div></div>;
}

function PanelHeader({ eyebrow, title, onClose }: { eyebrow: string; title: string; onClose: () => void }) {
  return <header className="sticky top-0 z-10 flex items-start justify-between border-b border-[#e5ecea] bg-white px-4 py-4"><div><p className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#0e6f62]">{eyebrow}</p><h3 className="mt-1 text-sm font-bold">{title}</h3></div><button type="button" onClick={onClose} className="text-[#82918d]"><Icon name="close" /></button></header>;
}

function IssueList({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return <section><p className={`text-[10px] font-extrabold uppercase tracking-[.14em] ${tone}`}>{title}</p><ul className="mt-2 grid gap-2">{items.map((item) => <li key={item} className="rounded-lg border border-[#e3eae8] px-3 py-2 text-xs leading-5 text-[#52645f]">{item}</li>)}</ul></section>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1.5 text-[11px] font-bold text-[#52645f]"><span>{label}</span>{children}</label>;
}
