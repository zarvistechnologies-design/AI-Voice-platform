"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { DashboardSidebar, getDashboardSidebarInitialState } from "@/components/dashboard/DashboardSidebar";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { getServerSession, getSession, logoutSession, subscribeToSession } from "@/lib/auth";
import { automationsApi, type Automation, type AutomationRun, type AutomationVersion, type BlockType, type Branch, type FlowGraph, type FlowIssue, type FlowNode } from "@/lib/automations";
import { voiceApi, type AgentSummary, type BackendPhoneNumber, type BackendCampaign } from "@/lib/voice";
import { whatsappApi, type WhatsAppAccountItem, type WhatsAppTemplate } from "@/lib/whatsapp";

const palette: Array<{ type: BlockType; name: string; icon: string; detail: string }> = [
  { type: "trigger", name: "Start when", icon: "✦", detail: "WhatsApp, Call, Lead, or API" },
  { type: "call", name: "AI Voice Call", icon: "☎", detail: "Autonomous AI agent call" },
  { type: "whatsapp", name: "Send WhatsApp", icon: "◉", detail: "Template or AI dynamic chat" },
  { type: "decision", name: "AI Agent Router", icon: "✧", detail: "Autonomous Call + Chat routing" },
  { type: "condition", name: "Conditional", icon: "⑂", detail: "Branch on reply, tag, or status" },
  { type: "wait", name: "Smart Wait", icon: "◷", detail: "Delay the next step" },
  { type: "payment", name: "Razorpay Payment", icon: "₹", detail: "Generate & send link" },
  { type: "calendar", name: "Book on Calendar", icon: "▦", detail: "Google Calendar & Calendly" },
  { type: "crm", name: "Sync to CRM", icon: "▥", detail: "HubSpot, Zoho, Sheets & more" },
  { type: "sms", name: "Instant Alert", icon: "▤", detail: "Slack team alert & notify" },
  { type: "end", name: "End Journey", icon: "✓", detail: "Complete & log outcome" },
];
const branches = (type: BlockType): Branch[] => type === "decision" ? ["interested", "callback", "not_interested", "unknown"] : type === "condition" ? ["yes", "no"] : type === "call" ? ["default", "failed"] : type === "end" ? [] : ["default"];
const branchLabel = (branch: Branch) => ({ default: "Next", interested: "Interested", callback: "Call back later", not_interested: "Not interested", unknown: "Unknown", yes: "Yes", no: "No", failed: "Call failed" })[branch];
const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
const nodeWidth = 226;

type Tab = "builder" | "runs" | "settings";
type DragState = { kind: "node"; nodeId: string; startX: number; startY: number; originX: number; originY: number; before: FlowGraph } | { kind: "pan"; startX: number; startY: number; originX: number; originY: number };

export function AutomationBuilder({ automationId }: { automationId: string }) {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [showSidebar, setShowSidebar] = useState(getDashboardSidebarInitialState);
  const [flow, setFlow] = useState<Automation | null>(null);
  const [graph, setGraph] = useState<FlowGraph | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [issues, setIssues] = useState<FlowIssue[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState<Tab>("builder");
  const [testOutcome, setTestOutcome] = useState("qualified");
  const [testSteps, setTestSteps] = useState<Array<{ nodeId: string; title: string; type: string; detail: string }>>([]);
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [versions, setVersions] = useState<AutomationVersion[]>([]);
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [numbers, setNumbers] = useState<BackendPhoneNumber[]>([]);
  const [campaigns, setCampaigns] = useState<BackendCampaign[]>([]);
  const [whatsAppTemplates, setWhatsAppTemplates] = useState<WhatsAppTemplate[]>([]);
  const [whatsAppAccounts, setWhatsAppAccounts] = useState<WhatsAppAccountItem[]>([]);
  const [showAiCopilot, setShowAiCopilot] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [connecting, setConnecting] = useState<{ source: string; handle: Branch } | null>(null);
  const [zoom, setZoom] = useState(.8);
  const [pan, setPan] = useState({ x: 36, y: 68 });
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [showChecks, setShowChecks] = useState(false);
  const [undo, setUndo] = useState<FlowGraph[]>([]);
  const [redo, setRedo] = useState<FlowGraph[]>([]);
  const dragRef = useRef<DragState | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<FlowGraph | null>(null);
  const pendingRunRef = useRef<{ phone: string; eventId: string } | null>(null);
  graphRef.current = graph;

  useEffect(() => {
    if (!session) return;
    let active = true;
    automationsApi.get(automationId).then(({ flow }) => {
      if (!active) return;
      setFlow(flow); setGraph(flow.draft); setName(flow.name); setDescription(flow.description);
    }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Could not load workflow."); });
    void Promise.allSettled([voiceApi.agentSummaries(), voiceApi.phoneNumbers(), voiceApi.campaigns(), whatsappApi.listTemplates(), whatsappApi.getStatus()]).then(([agentResult, numberResult, campaignResult, templateResult, waStatusResult]) => {
      if (!active) return;
      if (agentResult.status === "fulfilled") setAgents(agentResult.value.agents);
      if (numberResult.status === "fulfilled") setNumbers(numberResult.value.numbers);
      if (campaignResult.status === "fulfilled") setCampaigns(campaignResult.value.campaigns);
      if (templateResult.status === "fulfilled" && templateResult.value.ok) setWhatsAppTemplates(templateResult.value.templates);
      if (waStatusResult.status === "fulfilled" && waStatusResult.value.accounts) setWhatsAppAccounts(waStatusResult.value.accounts);
      if (agentResult.status === "rejected" || numberResult.status === "rejected") {
        setNotice("Some agent or phone number options could not be loaded. Refresh before configuring a call step.");
      }
    });
    return () => { active = false; };
  }, [automationId, session]);

  useEffect(() => {
    if (!graph || !flow) return;
    let active = true;
    const timer = window.setTimeout(() => {
      void automationsApi.validate(flow._id, graph).then(({ issues }) => { if (active) setIssues(issues); }).catch(() => undefined);
    }, 400);
    return () => { active = false; window.clearTimeout(timer); };
  }, [graph, flow]);

  useEffect(() => {
    if (tab !== "runs" || !flow) return;
    let active = true;
    const refresh = () => void automationsApi.runs(flow._id).then(({ runs }) => { if (active) setRuns(runs); }).catch(() => undefined);
    refresh();
    const timer = window.setInterval(refresh, 7000);
    return () => { active = false; window.clearInterval(timer); };
  }, [tab, flow]);

  useEffect(() => {
    if (tab !== "settings" || !flow) return;
    let active = true;
    void automationsApi.versions(flow._id).then(({ versions }) => { if (active) setVersions(versions); }).catch(() => undefined);
    return () => { active = false; };
  }, [tab, flow]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const commit = useCallback((next: FlowGraph) => {
    const previous = graphRef.current;
    if (previous) setUndo((items) => [...items.slice(-29), previous]);
    setRedo([]); setGraph(next); setDirty(true); setNotice("");
  }, []);

  function patchNode(id: string, patch: Partial<FlowNode>) {
    if (!graph) return;
    commit({ ...graph, nodes: graph.nodes.map((node) => node.id === id ? { ...node, ...patch } : node) });
  }
  function patchConfig(id: string, key: string, value: string) {
    const target = graph?.nodes.find((node) => node.id === id);
    if (target) patchNode(id, { config: { ...target.config, [key]: value } });
  }
  function addNode(type: BlockType, position?: { x: number; y: number }) {
    if (!graph) return;
    if (type === "trigger" && graph.nodes.some((node) => node.type === "trigger")) { setNotice("This workflow already has a start trigger."); return; }
    const id = crypto.randomUUID();
    const block = palette.find((item) => item.type === type)!;
    const maxX = Math.max(0, ...graph.nodes.map((node) => node.x));
    const next: FlowNode = {
      id,
      type,
      title: block.name,
      x: Math.max(0, Math.min(position?.x ?? maxX + 300, 9500)),
      y: Math.max(0, Math.min(position?.y ?? 180 + (graph.nodes.length % 4) * 145, 9500)),
      config: type === "wait"
        ? { minutes: "60" }
        : type === "trigger"
          ? { event: "manual" }
          : type === "payment"
            ? { amount: "999", currency: "INR", sendWhatsApp: "true", description: "Order payment for {{name}}" }
            : {},
    };
    commit({ ...graph, nodes: [...graph.nodes, next] }); setSelectedId(id); setLibraryOpen(false); setTab("builder");
  }
  function connect(target: string) {
    if (!graph || !connecting) return;
    if (connecting.source === target) { setConnecting(null); return; }
    const edges = graph.edges.filter((edge) => !(edge.source === connecting.source && edge.sourceHandle === connecting.handle));
    edges.push({ id: crypto.randomUUID(), source: connecting.source, target, sourceHandle: connecting.handle });
    commit({ ...graph, edges }); setConnecting(null);
  }
  function deleteSelected() {
    if (!graph || !selectedId) return;
    commit({ ...graph, nodes: graph.nodes.filter((node) => node.id !== selectedId), edges: graph.edges.filter((edge) => edge.source !== selectedId && edge.target !== selectedId) });
    setSelectedId("");
  }
  function undoGraph() { if (!graph || !undo.length) return; const previous = undo[undo.length - 1]; setRedo((items) => [...items, graph]); setUndo((items) => items.slice(0, -1)); setGraph(previous); setDirty(true); }
  function redoGraph() { if (!graph || !redo.length) return; const next = redo[redo.length - 1]; setUndo((items) => [...items, graph]); setRedo((items) => items.slice(0, -1)); setGraph(next); setDirty(true); }
  function tidy() {
    if (!graph) return;
    const levels = new Map<string, number>();
    const trigger = graph.nodes.find((node) => node.type === "trigger");
    if (trigger) { levels.set(trigger.id, 0); const queue = [trigger.id]; while (queue.length) { const source = queue.shift()!; for (const edge of graph.edges.filter((item) => item.source === source)) if (!levels.has(edge.target)) { levels.set(edge.target, (levels.get(source) ?? 0) + 1); queue.push(edge.target); } } }
    const rows = new Map<number, number>();
    commit({ ...graph, nodes: graph.nodes.map((node) => { const level = levels.get(node.id) ?? 0; const row = rows.get(level) ?? 0; rows.set(level, row + 1); return { ...node, x: 60 + level * 310, y: 120 + row * 185 }; }) });
    setPan({ x: 36, y: 68 }); setZoom(.8);
  }
  function autoConfigureGraph() {
    if (!graph) return;
    const liveAgent = agents.find((a) => a.status === "Live") || agents[0];
    const readyOutbound = numbers.find((n) => n.status === "Ready" && ["Outbound", "Both"].includes(n.direction)) || numbers[0];
    const readyInbound = numbers.find((n) => n.status === "Ready" && ["Inbound", "Both"].includes(n.direction)) || readyOutbound;
    const primaryWa = whatsAppAccounts.find((a) => a.isPrimary) || whatsAppAccounts[0];
    const defaultTmpl = whatsAppTemplates[0]?.name || "appointment_confirmation_v1";

    const nextNodes = graph.nodes.map((node) => {
      if (node.type === "trigger") {
        return {
          ...node,
          config: {
            ...node.config,
            event: node.config.event || "manual",
            consentConfirmed: "true",
            ...(node.config.event === "contact_added" && !node.config.campaignId ? { campaignId: "all" } : {}),
            ...(node.config.event === "missed_call" && !node.config.phoneNumberId && readyInbound ? { phoneNumberId: readyInbound._id } : {}),
          },
        };
      }
      if (node.type === "call") {
        return {
          ...node,
          config: {
            ...node.config,
            agentId: node.config.agentId || liveAgent?._id || "auto",
            phoneNumberId: node.config.phoneNumberId || readyOutbound?._id || "auto",
            windowStart: node.config.windowStart || "09:00",
            windowEnd: node.config.windowEnd || "20:00",
            timezone: node.config.timezone || "Asia/Kolkata",
          },
        };
      }
      if (node.type === "whatsapp") {
        return {
          ...node,
          config: {
            ...node.config,
            messageMode: node.config.messageMode || "template",
            templateName: node.config.templateName || defaultTmpl,
            language: node.config.language || "en",
            bodyVariables: node.config.bodyVariables || "{{name}}, {{phone}}",
            ...(primaryWa && !node.config.senderPhoneNumberId ? { senderPhoneNumberId: primaryWa.accountId } : {}),
          },
        };
      }
      if (node.type === "decision") {
        return {
          ...node,
          config: {
            ...node.config,
            decisionType: node.config.decisionType || "agentic",
          },
        };
      }
      if (node.type === "condition") {
        return {
          ...node,
          config: {
            ...node.config,
            conditionType: node.config.conditionType || "outcome",
            value: node.config.value || "qualified",
          },
        };
      }
      if (node.type === "wait") {
        return {
          ...node,
          config: {
            ...node.config,
            minutes: node.config.minutes || "30",
          },
        };
      }
      if (node.type === "payment") {
        return {
          ...node,
          config: {
            ...node.config,
            amount: node.config.amount || "999",
            currency: node.config.currency || "INR",
            description: node.config.description || "Order payment for {{name}}",
            sendWhatsApp: node.config.sendWhatsApp || "true",
            senderPhoneNumberId: node.config.senderPhoneNumberId || primaryWa?.accountId || "auto",
          },
        };
      }
      if (node.type === "crm") {
        return {
          ...node,
          config: {
            ...node.config,
            crmStage: node.config.crmStage || "Qualified",
            crmTag: node.config.crmTag || "AI-Qualified",
          },
        };
      }
      if (node.type === "calendar") {
        return {
          ...node,
          config: {
            ...node.config,
            calendarTitle: node.config.calendarTitle || "AI Consultation Call",
            durationMinutes: node.config.durationMinutes || "30",
          },
        };
      }
      if (node.type === "sms") {
        return {
          ...node,
          config: {
            ...node.config,
            messageText: node.config.messageText || "Hi {{name}}, thank you for connecting with us! Our AI specialist has logged your request.",
          },
        };
      }
      if (node.type === "end") {
        return {
          ...node,
          config: {
            ...node.config,
            outcome: node.config.outcome || "Completed",
          },
        };
      }
      return node;
    });

    commit({ ...graph, nodes: nextNodes });
    setNotice("⚡ All steps auto-configured with your workspace agents, numbers, and WhatsApp templates!");
  }
  async function generateWithAi(customPrompt?: string) {
    const promptToRun = (customPrompt ?? aiPrompt).trim();
    if (!promptToRun || promptToRun.length < 10) {
      setError("Describe your workflow goal in at least 10 characters.");
      return;
    }
    setBusy(true); setError("");
    try {
      const { draft, issues: nextIssues } = await automationsApi.generate(promptToRun);
      commit(draft.graph);
      setName(draft.name || name);
      setDescription(draft.description || description);
      setIssues(nextIssues);
      setShowAiCopilot(false);
      setNotice("✨ AI Agentic Architect built and wired your workflow! Click Save or Publish when ready.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not generate workflow.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const input = event.target instanceof HTMLElement && Boolean(event.target.closest("input,textarea,select,[contenteditable]"));
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); void save(); }
      if (input) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); undoGraph(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") { event.preventDefault(); redoGraph(); }
      if (event.key === "Escape") setConnecting(null);
      if (event.key === "Delete" || event.key === "Backspace") deleteSelected();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      if (drag.kind === "pan") setPan({ x: drag.originX + event.clientX - drag.startX, y: drag.originY + event.clientY - drag.startY });
      else setGraph((current) => current ? { ...current, nodes: current.nodes.map((node) => node.id === drag.nodeId ? { ...node, x: Math.max(0, Math.round(drag.originX + (event.clientX - drag.startX) / zoom)), y: Math.max(0, Math.round(drag.originY + (event.clientY - drag.startY) / zoom)) } : node) } : current);
    };
    const onUp = () => { const drag = dragRef.current; if (drag?.kind === "node" && graphRef.current && JSON.stringify(drag.before) !== JSON.stringify(graphRef.current)) { setUndo((items) => [...items.slice(-29), drag.before]); setRedo([]); setDirty(true); } dragRef.current = null; };
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [zoom]);

  async function save() {
    if (!flow || !graph || busy) return false;
    setBusy(true); setError("");
    try {
      const snapshot = JSON.stringify({ name, description, graph });
      const result = await automationsApi.save(flow._id, { name, description, graph, revision: flow.revision });
      setFlow(result.flow);
      if (snapshot === JSON.stringify({ name, description, graph: graphRef.current })) setDirty(false);
      setNotice("Draft saved."); return true;
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save workflow."); return false; }
    finally { setBusy(false); }
  }
  async function publish() {
    if (!flow || busy) return;
    const saved = dirty ? await save() : true;
    if (!saved) return;
    setBusy(true); setError("");
    try { const { flow: next } = await automationsApi.publish(flow._id); setFlow(next); setIssues([]); setNotice(`Version ${next.publishedVersion} is live.`); }
    catch (cause) { const issueError = cause as Error & { issues?: FlowIssue[] }; if (issueError.issues) { setIssues(issueError.issues); setShowChecks(true); setSelectedId(""); setTab("builder"); } setError(issueError.message); }
    finally { setBusy(false); }
  }
  async function test() {
    if (!flow || busy) return;
    const saved = dirty ? await save() : true;
    if (!saved) return;
    setBusy(true); setError("");
    try { const result = await automationsApi.test(flow._id, testOutcome); setTestSteps(result.steps); setNotice("Dry run completed. No calls or messages were sent."); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Dry run failed."); }
    finally { setBusy(false); }
  }
  async function toggleStatus() {
    if (!flow) return;
    setBusy(true); setError("");
    try { const result = await automationsApi.setStatus(flow._id, flow.status === "live" ? "paused" : "live"); setFlow(result.flow); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update status."); }
    finally { setBusy(false); }
  }
  async function startRun() {
    if (!flow) return;
    setBusy(true); setError("");
    const pending = pendingRunRef.current?.phone === phone ? pendingRunRef.current : { phone, eventId: crypto.randomUUID() };
    pendingRunRef.current = pending;
    try { await automationsApi.start(flow._id, phone, contactName, pending.eventId); pendingRunRef.current = null; setConsentConfirmed(false); setNotice("Run started. Watch its progress below."); const result = await automationsApi.runs(flow._id); setRuns(result.runs); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not start run."); }
    finally { setBusy(false); }
  }
  async function cancelRun(runId: string) {
    if (!flow || busy) return;
    setBusy(true); setError("");
    try {
      await automationsApi.cancelRun(flow._id, runId);
      setRuns((items) => items.map((item) => item._id === runId ? { ...item, status: "cancelled" } : item));
      setNotice("Run cancelled. No further workflow steps will run.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not cancel the run."); }
    finally { setBusy(false); }
  }
  async function restore(version: number) {
    if (!flow || !window.confirm(`Restore version ${version} as a new published version? Unsaved draft changes will be replaced.`)) return;
    setBusy(true); setError("");
    try {
      const result = await automationsApi.restore(flow._id, version);
      setFlow(result.flow); setGraph(result.flow.draft); setName(result.flow.name); setDescription(result.flow.description);
      setDirty(false); setUndo([]); setRedo([]); setSelectedId("");
      setNotice(`Version ${version} restored as v${result.flow.publishedVersion}.`);
      const history = await automationsApi.versions(flow._id); setVersions(history.versions);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not restore version."); }
    finally { setBusy(false); }
  }
  async function removeFlow() {
    if (!flow || !window.confirm(`Delete “${flow.name}”? This cannot be undone.`)) return;
    setBusy(true); setError("");
    try { await automationsApi.remove(flow._id); router.push("/dashboard/automations"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not delete workflow."); setBusy(false); }
  }

  const selected = graph?.nodes.find((node) => node.id === selectedId);
  const role = session?.organization?.role;
  const isReadOnly = role === "viewer";
  const canPublish = !isReadOnly;
  const canRun = !isReadOnly;
  const issueMap = useMemo(() => new Map(issues.map((item) => [item.nodeId, (issues.filter((entry) => entry.nodeId === item.nodeId)).length])), [issues]);
  if (!session) return <main className="automation-loading">Loading workflow…</main>;
  if (!canRun) return <main className="automation-loading"><div><p>Workflow editing is available to workspace owners, admins, and members.</p><Link href="/dashboard/automations">Back to workflows</Link></div></main>;
  return <main className={`automation-layout dashboard-home-theme ${showSidebar ? "automation-sidebar-open" : ""}`}>
    <DashboardSidebar activeLabel="Automation Workflow" userInitials={initials(session.name)} userName={session.name} userEmail={session.email} onLogout={() => void logoutSession().then(() => router.replace("/login"))} showUserSidebar={showSidebar} setShowUserSidebar={setShowSidebar} />
    <section className="automation-builder-shell"><DashboardPageHeader workspaceBarOnly />
      {!flow || !graph ? <div className="automation-loading">{error || "Loading canvas…"}</div> : <>
        <div className="automation-builder-top"><div className="automation-builder-identity"><Link href="/dashboard/automations">← Workflows</Link><span className="automation-divider">/</span><input aria-label="Workflow name" value={name} onChange={(event) => { setName(event.target.value); setDirty(true); }} /><span className={`automation-status automation-status-${flow.status}`}>{flow.status}</span><small>{dirty ? "Unsaved changes" : `Saved draft · v${flow.revision}`}</small></div><div className="automation-builder-actions"><button type="button" onClick={() => setShowAiCopilot(!showAiCopilot)}>✨ AI Architect</button><button type="button" onClick={autoConfigureGraph} title="Automatically assign your live Voice Agent, Phone Number, and WhatsApp Template across all steps">⚡ Auto-Configure</button><button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>⚙ Settings</button><button className={tab === "runs" ? "active" : ""} onClick={() => setTab("runs")}>☷ Runs</button><button className={tab === "builder" ? "active" : ""} onClick={() => setTab("builder")}>▦ Builder</button><button onClick={() => { setTab("builder"); setSelectedId(""); setShowChecks(!showChecks); }}>{issues.length ? <span className="automation-check-count">{issues.length} to check</span> : <span className="automation-ready">✓ Ready</span>}</button><button disabled={busy || !dirty} onClick={() => void save()}>Save</button>{canPublish && <button className="automation-primary" disabled={busy} onClick={() => void publish()}>{busy ? "Working…" : `Publish v${flow.publishedVersion + 1}`}</button>}</div></div>
        {showAiCopilot && (
          <div style={{ background: "#f4faf8", borderBottom: "1px solid #cde0dc", padding: "12px 20px", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flex: "1 1 420px", gap: "8px", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: "12px", color: "#0e6f62", whiteSpace: "nowrap" }}>✨ Agentic AI Builder:</span>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe any goal: e.g. When a lead messages on WhatsApp, send welcome template, place AI qualification call, book calendar & sync CRM..."
                style={{ flex: 1, minWidth: "240px", borderRadius: "8px", border: "1px solid #b8d4cd", padding: "7px 12px", fontSize: "12px", background: "#fff" }}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => void generateWithAi()}
                className="automation-primary"
                style={{ padding: "7px 14px", fontSize: "12px", whiteSpace: "nowrap" }}
              >
                {busy ? "Building…" : "Generate Flow"}
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
              <small style={{ fontSize: "11px", color: "#52645f", fontWeight: 600 }}>1-Click Blueprints:</small>
              <button
                type="button"
                disabled={busy}
                onClick={() => void generateWithAi("When a lead messages on WhatsApp, send welcome WhatsApp template, place an AI Voice Qualification Call, route interested leads to Calendar Booking and CRM Sync, and follow up callbacks after 60 minutes.")}
                style={{ borderRadius: "6px", border: "1px solid #cde0dc", background: "#fff", padding: "5px 10px", fontSize: "11px", fontWeight: 600, color: "#14231f", cursor: "pointer" }}
              >
                🤖 Omnichannel Lead Qualifier
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void generateWithAi("When a missed inbound call occurs, immediately send a WhatsApp message, wait 15 minutes, place an AI callback, and if interested book on calendar and sync to CRM.")}
                style={{ borderRadius: "6px", border: "1px solid #cde0dc", background: "#fff", padding: "5px 10px", fontSize: "11px", fontWeight: 600, color: "#14231f", cursor: "pointer" }}
              >
                📞 Missed Call AI Recovery
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void generateWithAi("When a campaign lead is imported, place an AI Voice Call, use AI Agentic Router to qualify, book appointment on calendar, tag VIP in CRM, and send WhatsApp confirmation.")}
                style={{ borderRadius: "6px", border: "1px solid #cde0dc", background: "#fff", padding: "5px 10px", fontSize: "11px", fontWeight: 600, color: "#14231f", cursor: "pointer" }}
              >
                🚀 Outbound Sales Autopilot
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void generateWithAi("When an inbound WhatsApp message arrives, book an appointment on Google Calendar/Calendly, sync the lead to CRM & Google Sheets, create a ₹999 Razorpay payment link and send it via WhatsApp, and notify Slack.")}
                style={{ borderRadius: "6px", border: "1px solid #cde0dc", background: "#fff", padding: "5px 10px", fontSize: "11px", fontWeight: 600, color: "#14231f", cursor: "pointer" }}
              >
                💳 Razorpay + Calendar + CRM
              </button>
            </div>
          </div>
        )}
        {error && <div className="automation-alert" role="alert">{error}</div>}{notice && <div className="automation-success" role="status">{notice}</div>}
        {tab === "builder" ? <div className="automation-workspace">
          <aside className={`automation-library ${libraryOpen ? "open" : ""}`}><div className="automation-panel-title">BLOCKS <button className="automation-library-close" onClick={() => setLibraryOpen(false)} aria-label="Close blocks">×</button></div><p>Drag your journey together</p>{palette.map((block) => <button key={block.type} draggable className={`automation-library-item automation-type-${block.type}`} onDragStart={(event) => event.dataTransfer.setData("application/vozon-block", block.type)} onClick={() => addNode(block.type)}><span>{block.icon}</span><span><strong>{block.name}</strong><small>{block.detail}</small></span><b>＋</b></button>)}</aside>
          <div className="automation-canvas-wrap"><div className="automation-canvas-toolbar"><button onClick={() => setLibraryOpen(true)} className="automation-mobile-blocks">＋ Blocks</button><button onClick={() => setShowAiCopilot(!showAiCopilot)}>✨ AI Architect</button><button onClick={autoConfigureGraph}>⚡ Auto-Configure</button><button onClick={tidy}>✧ Tidy up</button><button disabled={!undo.length} onClick={undoGraph} title="Undo">↶</button><button disabled={!redo.length} onClick={redoGraph} title="Redo">↷</button><button onClick={() => { setPan({ x: 36, y: 68 }); setZoom(.8); }}>Fit</button></div>
            <div ref={canvasRef} className={`automation-canvas ${dragRef.current?.kind === "pan" ? "panning" : ""}`} onDragOver={(event) => { if (event.dataTransfer.types.includes("application/vozon-block")) event.preventDefault(); }} onDrop={(event) => { const type = event.dataTransfer.getData("application/vozon-block") as BlockType; if (!palette.some((item) => item.type === type)) return; event.preventDefault(); const rect = canvasRef.current?.getBoundingClientRect(); if (rect) addNode(type, { x: Math.round((event.clientX - rect.left - pan.x) / zoom), y: Math.round((event.clientY - rect.top - pan.y) / zoom) }); }} onPointerDown={(event) => { if (event.target === event.currentTarget || (event.target instanceof Element && event.target.closest(".automation-canvas-surface"))) { dragRef.current = { kind: "pan", startX: event.clientX, startY: event.clientY, originX: pan.x, originY: pan.y }; setSelectedId(""); } }}>
              <div className="automation-canvas-surface" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                <svg className="automation-edges" width="10000" height="10000" aria-hidden="true"><defs><marker id="automation-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1 1 L7 4 L1 7" fill="none" stroke="#94a7bf" strokeWidth="1.5" /></marker></defs>{graph.edges.map((edge) => { const from = graph.nodes.find((node) => node.id === edge.source); const to = graph.nodes.find((node) => node.id === edge.target); if (!from || !to) return null; const ports = branches(from.type); const index = ports.indexOf(edge.sourceHandle); const sy = from.y + 68 + Math.max(0, index) * 27; const ty = to.y + 80; const sx = from.x + nodeWidth; const tx = to.x; const dx = Math.max(70, Math.abs(tx - sx) / 2); return <g key={edge.id} className={`automation-edge automation-edge-${from.type}`}><path d={`M${sx} ${sy} C${sx + dx} ${sy},${tx - dx} ${ty},${tx} ${ty}`} markerEnd="url(#automation-arrow)" /><text x={(sx + tx) / 2} y={(sy + ty) / 2 - 8}>{edge.sourceHandle !== "default" ? branchLabel(edge.sourceHandle) : ""}</text></g>; })}</svg>
                {graph.nodes.map((node) => <div key={node.id} className={`automation-node automation-type-${node.type} ${selectedId === node.id ? "selected" : ""} ${issueMap.has(node.id) ? "has-issue" : ""}`} style={{ left: node.x, top: node.y, width: nodeWidth }} onPointerDown={(event) => event.stopPropagation()} onClick={() => { setSelectedId(node.id); if (connecting && connecting.source !== node.id) connect(node.id); }}><button className="automation-input-port" title={connecting ? "Connect here" : "Input"} onClick={(event) => { event.stopPropagation(); if (connecting) connect(node.id); }} aria-label={`Connect to ${node.title}`} /><div className="automation-node-head" onPointerDown={(event) => { if (event.button !== 0) return; event.preventDefault(); dragRef.current = { kind: "node", nodeId: node.id, startX: event.clientX, startY: event.clientY, originX: node.x, originY: node.y, before: graph }; setSelectedId(node.id); }}><span>{palette.find((item) => item.type === node.type)?.icon}</span><strong>{node.title}</strong><small>{issueMap.has(node.id) ? `${issueMap.get(node.id)} !` : ""}</small></div><div className="automation-node-body">{node.type === "trigger" ? ({ manual: "Manual / API event", contact_added: "Campaign lead imported", missed_call: "Missed inbound call", whatsapp_inbound: "WhatsApp message received", whatsapp_form_submitted: "WhatsApp form submitted" }[node.config.event] || "Choose a start event") : node.type === "call" ? (node.config.agentId === "auto" ? "⚡ Auto-Select Live Agent" : agents.find((item) => item._id === node.config.agentId)?.name || "⚡ Auto-Select Live Agent") : node.type === "whatsapp" ? (node.config.messageMode === "ai_dynamic" ? "✨ AI Dynamic WhatsApp" : node.config.templateName || "Choose a template") : node.type === "wait" ? `${node.config.minutes || "?"} min delay` : node.type === "decision" ? (node.config.decisionType === "agentic" ? "🤖 AI Agentic Router" : node.config.decisionType === "whatsapp" ? "Route by WhatsApp sentiment" : "Route by call outcome") : node.type === "condition" ? ({ outcome: `Call outcome = ${node.config.value || "?"}`, whatsapp_status: `WhatsApp status = ${node.config.value || "?"}`, whatsapp_reply_contains: `Reply has "${node.config.value || "?"}"`, whatsapp_reply_equals: `Reply == "${node.config.value || "?"}"`, has_replied: "Customer replied", contact_tag: `Tag = ${node.config.value || "?"}` }[node.config.conditionType || "outcome"] || `Outcome = ${node.config.value || "?"}`) : node.type === "payment" ? `Razorpay ${node.config.currency || "INR"} ${node.config.amount || "999"}` : node.type === "crm" ? `Stage: ${node.config.crmStage || "Qualified"}` : node.type === "calendar" ? `${node.config.calendarTitle || "AI Consultation"} (${node.config.durationMinutes || "30"}m)` : node.type === "sms" ? (node.config.messageText ? node.config.messageText.slice(0, 28) + "…" : "Slack / Instant Alert") : node.type === "end" ? node.config.outcome || "Journey complete" : "Configure this step"}</div><div className="automation-node-ports">{branches(node.type).map((branch) => <button key={branch} title={`Connect ${branchLabel(branch)} branch`} className={connecting?.source === node.id && connecting.handle === branch ? "connecting" : ""} onClick={(event) => { event.stopPropagation(); setConnecting({ source: node.id, handle: branch }); setSelectedId(node.id); }}>{branchLabel(branch)}<span className="automation-output-port" /></button>)}</div></div>)}
              </div>
              {connecting && <div className="automation-connect-hint">Select a target step for “{branchLabel(connecting.handle)}” <button onClick={() => setConnecting(null)}>Cancel</button></div>}
              <div className="automation-zoom"><button aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(1.4, +(value + .1).toFixed(2)))}>＋</button><span>{Math.round(zoom * 100)}%</span><button aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(.35, +(value - .1).toFixed(2)))}>−</button></div>
              <div className="automation-minimap" aria-label="Workflow minimap">{graph.nodes.map((node) => <span key={node.id} className={`automation-type-${node.type}`} style={{ left: `${Math.min(90, node.x / 28)}%`, top: `${Math.min(85, node.y / 14)}%` }} />)}</div>
            </div>
          </div>
          <aside className="automation-inspector"><div className="automation-panel-title">{selected ? "STEP SETTINGS" : showChecks ? "PUBLISH CHECKS" : "WORKFLOW"}</div>{selected ? <><div className={`automation-inspector-icon automation-type-${selected.type}`}>{palette.find((item) => item.type === selected.type)?.icon}</div><label className="automation-field">Step name<input value={selected.title} onChange={(event) => patchNode(selected.id, { title: event.target.value })} /></label><p className="automation-inspector-help">{palette.find((item) => item.type === selected.type)?.detail}</p>
            {selected.type === "trigger" && <><label className="automation-field">Start event<select value={selected.config.event || "manual"} onChange={(event) => patchConfig(selected.id, "event", event.target.value)}><option value="manual">Manual / API event</option><option value="contact_added">Campaign lead imported</option><option value="missed_call">Missed inbound call</option><option value="whatsapp_inbound">WhatsApp message received</option><option value="whatsapp_form_submitted">WhatsApp form submitted</option></select></label>
              {selected.config.event === "contact_added" && <><label className="automation-field">Campaign<select value={selected.config.campaignId || ""} onChange={(event) => patchConfig(selected.id, "campaignId", event.target.value)}><option value="">Choose campaign</option><option value="all">All campaigns</option>{campaigns.map((campaign) => <option key={campaign._id} value={campaign._id}>{campaign.name}</option>)}</select></label><p className="automation-inspector-help">Only newly imported leads with confirmed workflow consent will start. A campaign may also call these leads separately.</p></>}
              {selected.config.event === "missed_call" && <><label className="automation-field">Inbound number<select value={selected.config.phoneNumberId || ""} onChange={(event) => patchConfig(selected.id, "phoneNumberId", event.target.value)}><option value="">Choose number</option>{numbers.filter((number) => number.status === "Ready" && ["Inbound", "Both"].includes(number.direction)).map((number) => <option key={number._id} value={number._id}>{number.number}</option>)}</select></label><label className="automation-consent"><input type="checkbox" checked={selected.config.consentConfirmed === "true"} onChange={(event) => patchConfig(selected.id, "consentConfirmed", String(event.target.checked))} /> I confirm inbound callers may receive this follow-up.</label><p className="automation-inspector-help">Starts after an inbound call ends without a conversation. Existing opt-outs are excluded.</p></>}
              {selected.config.event === "whatsapp_inbound" && <><label className="automation-field">Keyword filter (optional)<input value={selected.config.keyword || ""} onChange={(event) => patchConfig(selected.id, "keyword", event.target.value)} placeholder="e.g. BOOK, HI, CALL (leave blank for any message)" /></label><label className="automation-consent"><input type="checkbox" checked={selected.config.consentConfirmed === "true"} onChange={(event) => patchConfig(selected.id, "consentConfirmed", String(event.target.checked))} /> I confirm inbound WhatsApp contacts may receive workflow follow-up.</label><p className="automation-inspector-help">Starts when a customer messages your WhatsApp business number or types this keyword.</p></>}
              {selected.config.event === "whatsapp_form_submitted" && <><label className="automation-field">Form ID / Keyword filter (optional)<input value={selected.config.keyword || ""} onChange={(event) => patchConfig(selected.id, "keyword", event.target.value)} placeholder="e.g. ENTERPRISE or BOOK" /></label><label className="automation-consent"><input type="checkbox" checked={selected.config.consentConfirmed === "true"} onChange={(event) => patchConfig(selected.id, "consentConfirmed", String(event.target.checked))} /> I confirm form respondents may receive workflow follow-up.</label><p className="automation-inspector-help">Starts when a lead fills an in-chat WhatsApp form or Meta Lead Form.</p></>}
            </>}
            {selected.type === "call" && <><label className="automation-field">Voice agent<select value={selected.config.agentId || "auto"} onChange={(event) => patchNode(selected.id, { config: { ...selected.config, agentId: event.target.value, phoneNumberId: selected.config.phoneNumberId || "auto" } })}><option value="auto">⚡ Auto-Select Primary Live Agent</option>{agents.map((agent) => <option key={agent._id} value={agent._id}>{agent.name} ({agent.status})</option>)}</select></label><label className="automation-field">Outbound number<select value={selected.config.phoneNumberId || "auto"} onChange={(event) => patchConfig(selected.id, "phoneNumberId", event.target.value)}><option value="auto">⚡ Auto-Select Ready Outbound Number</option>{numbers.filter((item) => ["Outbound", "Both"].includes(item.direction)).map((number) => <option key={number._id} value={number._id}>{number.number} ({number.status})</option>)}</select></label><div className="automation-field-row"><label className="automation-field">From<input type="time" value={selected.config.windowStart || "09:00"} onChange={(event) => patchConfig(selected.id, "windowStart", event.target.value)} /></label><label className="automation-field">Until<input type="time" value={selected.config.windowEnd || "20:00"} onChange={(event) => patchConfig(selected.id, "windowEnd", event.target.value)} /></label></div><label className="automation-field">Time zone<input value={selected.config.timezone || "Asia/Kolkata"} onChange={(event) => patchConfig(selected.id, "timezone", event.target.value)} /></label></>}
            {selected.type === "whatsapp" && <>
              {whatsAppAccounts.length > 0 && (
                <label className="automation-field">Send From WhatsApp Number
                  <select value={selected.config.senderPhoneNumberId || "auto"} onChange={(event) => patchConfig(selected.id, "senderPhoneNumberId", event.target.value)}>
                    <option value="auto">⚡ Default / Sticky Line</option>
                    {whatsAppAccounts.map((acc) => (
                      <option key={acc.accountId} value={acc.accountId}>
                        {acc.displayPhoneNumber} — {acc.label || acc.verifiedName} {acc.isPrimary ? "(Default)" : ""}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="automation-field">Message Mode
                <select value={selected.config.messageMode || "template"} onChange={(event) => patchConfig(selected.id, "messageMode", event.target.value)}>
                  <option value="template">Approved WhatsApp Template</option>
                  <option value="ai_dynamic">✨ AI Dynamic Contextual Message</option>
                </select>
              </label>
              {selected.config.messageMode === "ai_dynamic" ? (
                <label className="automation-field">AI Message Prompt / Context
                  <textarea rows={3} value={selected.config.aiPrompt || ""} onChange={(event) => patchConfig(selected.id, "aiPrompt", event.target.value)} placeholder="e.g. Thank {{name}} for their time, summarize {{summary}}, and share the booking link." />
                </label>
              ) : (
                <>
                  <label className="automation-field">Approved template name
                    {whatsAppTemplates.length > 0 ? (
                      <select value={selected.config.templateName || ""} onChange={(event) => {
                        const tmpl = whatsAppTemplates.find((t) => t.name === event.target.value);
                        patchNode(selected.id, { config: { ...selected.config, templateName: event.target.value, language: tmpl?.language || selected.config.language || "en" } });
                      }}>
                        <option value="">Choose an approved template</option>
                        {whatsAppTemplates.map((t) => <option key={t._id} value={t.name}>{t.name} ({t.category})</option>)}
                      </select>
                    ) : (
                      <input value={selected.config.templateName || ""} onChange={(event) => patchConfig(selected.id, "templateName", event.target.value)} placeholder="appointment_confirmation_v1" />
                    )}
                  </label>
                  <label className="automation-field">Language code<input value={selected.config.language || "en"} onChange={(event) => patchConfig(selected.id, "language", event.target.value)} placeholder="en" /></label>
                  <label className="automation-field">Body variables, comma separated<input value={selected.config.bodyVariables || ""} onChange={(event) => patchConfig(selected.id, "bodyVariables", event.target.value)} placeholder="{{name}}, {{phone}}, {{outcome}}, {{summary}}" /></label>
                </>
              )}
              <p className="automation-inspector-help">Supports multiple WhatsApp numbers, approved templates, or AI-generated contextual messages using {"{{name}}"}, {"{{phone}}"}, {"{{outcome}}"}, {"{{summary}}"}, {"{{paymentLink}}"}, {"{{calendlyLink}}"}, {"{{calendarTime}}"}, and {"{{crmStage}}"}.</p>
            </>}
            {selected.type === "condition" && <><label className="automation-field">Condition type
              <select value={selected.config.conditionType || "outcome"} onChange={(event) => patchConfig(selected.id, "conditionType", event.target.value)}>
                <option value="outcome">Call Outcome (qualified, follow_up, not_interested, failed)</option>
                <option value="whatsapp_status">WhatsApp Delivery Status (delivered, read, failed)</option>
                <option value="whatsapp_reply_contains">WhatsApp Reply Contains (e.g. YES, BOOK, HELP)</option>
                <option value="whatsapp_reply_equals">WhatsApp Reply Equals</option>
                <option value="has_replied">Customer Has Replied (Yes/No)</option>
                <option value="contact_tag">Customer Has Tag (e.g. VIP)</option>
              </select>
            </label>
              {selected.config.conditionType !== "has_replied" && (
                <label className="automation-field">Value to compare
                  <input value={selected.config.value || ""} onChange={(event) => patchConfig(selected.id, "value", event.target.value)} placeholder={selected.config.conditionType === "whatsapp_reply_contains" ? "e.g. YES" : selected.config.conditionType === "whatsapp_status" ? "read" : "qualified"} />
                </label>
              )}
              <p className="automation-inspector-help">Branches to <strong>Yes</strong> if this condition matches, or <strong>No</strong> otherwise.</p></>}
            {selected.type === "wait" && <label className="automation-field">Minutes to wait<input type="number" min="1" max="43200" value={selected.config.minutes || ""} onChange={(event) => patchConfig(selected.id, "minutes", event.target.value)} /></label>}
            {selected.type === "crm" && <>
              <label className="automation-field">CRM Lead Stage
                <select value={selected.config.crmStage || "Qualified"} onChange={(event) => patchConfig(selected.id, "crmStage", event.target.value)}>
                  <option value="Qualified">Qualified Lead</option>
                  <option value="Hot Lead">Hot Lead / High Intent</option>
                  <option value="Appointment Booked">Appointment Booked</option>
                  <option value="Follow-up">Follow-up Needed</option>
                  <option value="Customer">Converted Customer</option>
                </select>
              </label>
              <label className="automation-field">Contact Tag
                <input value={selected.config.crmTag || "AI-Qualified"} onChange={(event) => patchConfig(selected.id, "crmTag", event.target.value)} placeholder="e.g. VIP-Lead, Hot-Prospect" />
              </label>
              <label className="automation-field">Google Spreadsheet ID (optional)
                <input value={selected.config.spreadsheetId || ""} onChange={(event) => patchConfig(selected.id, "spreadsheetId", event.target.value)} placeholder="Optional Sheets ID (leave blank to use default)" />
              </label>
              <label className="automation-field">Outbound Webhook URL (optional)
                <input value={selected.config.webhookUrl || ""} onChange={(event) => patchConfig(selected.id, "webhookUrl", event.target.value)} placeholder="https://your-crm.com/webhook" />
              </label>
              <p className="automation-inspector-help">Updates Vozon CRM stage & tags and live-syncs to all connected integrations (HubSpot, Zoho CRM, Salesforce, HighLevel, Freshsales, Google Sheets) plus optional webhook.</p>
            </>}
            {selected.type === "payment" && <>
              <div className="automation-field-row">
                <label className="automation-field">Amount
                  <input type="number" min="1" value={selected.config.amount || "999"} onChange={(event) => patchConfig(selected.id, "amount", event.target.value)} placeholder="999" />
                </label>
                <label className="automation-field">Currency
                  <select value={selected.config.currency || "INR"} onChange={(event) => patchConfig(selected.id, "currency", event.target.value)}>
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </label>
              </div>
              <label className="automation-field">Payment Description
                <input value={selected.config.description || ""} onChange={(event) => patchConfig(selected.id, "description", event.target.value)} placeholder="Order payment for {{name}}" />
              </label>
              {whatsAppAccounts.length > 0 && (
                <label className="automation-field">Send via WhatsApp Number
                  <select value={selected.config.senderPhoneNumberId || "auto"} onChange={(event) => patchConfig(selected.id, "senderPhoneNumberId", event.target.value)}>
                    <option value="auto">⚡ Default / Sticky Line</option>
                    {whatsAppAccounts.map((acc) => (
                      <option key={acc.accountId} value={acc.accountId}>
                        {acc.displayPhoneNumber} — {acc.label || acc.verifiedName} {acc.isPrimary ? "(Default)" : ""}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="automation-consent">
                <input type="checkbox" checked={selected.config.sendWhatsApp !== "false"} onChange={(event) => patchConfig(selected.id, "sendWhatsApp", String(event.target.checked))} />
                Auto-send Razorpay Payment Link on WhatsApp &amp; log in Live Chat
              </label>
              <p className="automation-inspector-help">Uses your workspace&apos;s connected Razorpay account to create a live payment link, sets {"{{paymentLink}}"} for later steps, and optionally sends it straight to the customer on WhatsApp.</p>
            </>}
            {selected.type === "calendar" && <>
              <label className="automation-field">Appointment / Meeting Title
                <input value={selected.config.calendarTitle || "AI Consultation Call"} onChange={(event) => patchConfig(selected.id, "calendarTitle", event.target.value)} placeholder="Product Demo & Consultation" />
              </label>
              <label className="automation-field">Duration (minutes)
                <select value={selected.config.durationMinutes || "30"} onChange={(event) => patchConfig(selected.id, "durationMinutes", event.target.value)}>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </label>
              <p className="automation-inspector-help">Books on your connected Google Calendar, creates a Calendly scheduling link (sets {"{{calendlyLink}}"} &amp; {"{{calendarTime}}"}), and tags the contact as Appointment-Booked.</p>
            </>}
            {selected.type === "sms" && <>
              <label className="automation-field">Notification / Slack Alert Text
                <textarea rows={3} value={selected.config.messageText || ""} onChange={(event) => patchConfig(selected.id, "messageText", event.target.value)} placeholder="Hi {{name}}, thank you for connecting with us! Your outcome: {{outcome}}." />
              </label>
              <p className="automation-inspector-help">Posts to your connected Slack channel and dispatches team alerts using {"{{name}}"}, {"{{phone}}"}, {"{{outcome}}"}, and {"{{paymentLink}}"}.</p>
            </>}
            {selected.type === "end" && <label className="automation-field">Outcome label<input value={selected.config.outcome || ""} onChange={(event) => patchConfig(selected.id, "outcome", event.target.value)} placeholder="Completed" /></label>}
            {selected.type === "decision" && <>
              <label className="automation-field">Decision Mode
                <select value={selected.config.decisionType || "agentic"} onChange={(event) => patchConfig(selected.id, "decisionType", event.target.value)}>
                  <option value="agentic">🤖 Autonomous AI Agent (Voice Call + WhatsApp + Context)</option>
                  <option value="call">Voice Call Outcome Only</option>
                  <option value="whatsapp">WhatsApp Reply Sentiment Only</option>
                </select>
              </label>
              <label className="automation-field">Agent Routing Goal (optional)
                <textarea rows={2} value={selected.config.agentGoal || ""} onChange={(event) => patchConfig(selected.id, "agentGoal", event.target.value)} placeholder="e.g. Route to Interested if customer asked for pricing/demo, Callback if busy..." />
              </label>
              <p className="automation-inspector-help">Autonomously evaluates both Voice Call outcomes and WhatsApp replies to route the contact to Interested, Callback, Not Interested, or Unknown.</p>
            </>}
            {issueMap.has(selected.id) && <div className="automation-node-issues">{issues.filter((item) => item.nodeId === selected.id).map((item, index) => <p key={index}>⚠ {item.message}</p>)}</div>}
            <button className="automation-delete-step" onClick={deleteSelected}>Delete step</button>
          </> : showChecks ? <><p className="automation-inspector-help">Resolve these before publishing, or click ⚡ Auto-Configure.</p>{issues.length ? <><button className="automation-primary" style={{ marginBottom: "10px", width: "100%" }} onClick={autoConfigureGraph}>⚡ Auto-Configure All Steps</button>{issues.map((item, index) => <button key={index} className="automation-check-item" onClick={() => { if (item.nodeId) setSelectedId(item.nodeId); }}>{item.nodeId ? "⚠" : "!"} {item.message}</button>)}</> : <div className="automation-good">✓ All checks pass. Save and publish when ready.</div>}</> : <><p className="automation-inspector-help">Select a step to configure it, or use ✨ AI Architect to build and wire an entire agentic journey.</p><div className="automation-inspector-stat"><strong>{graph.nodes.length}</strong><span>Steps</span></div><div className="automation-inspector-stat"><strong>{graph.edges.length}</strong><span>Connections</span></div><div className="automation-inspector-stat"><strong>{issues.length}</strong><span>Checks to resolve</span></div><button className="automation-primary" style={{ marginBottom: "8px" }} onClick={autoConfigureGraph}>⚡ Auto-Configure Resources</button><button className="automation-secondary" onClick={() => setShowChecks(true)}>View publish checks</button></>}</aside>
        </div> : tab === "runs" ? <div className="automation-secondary-page"><div className="automation-secondary-head"><div><span className="automation-kicker">EXECUTION HISTORY</span><h2>Runs</h2><p>Each run follows the workflow version that started it.</p></div><span className={`automation-status automation-status-${flow.status}`}>{flow.status}</span></div>{flow.published?.nodes.find((node) => node.type === "trigger")?.config.event !== "manual" && flow.published && <div className="automation-run-form" style={{ marginBottom: "12px" }}><div><h3>⚡ Autonomous Event Trigger Active</h3><p>New matching events ({flow.published?.nodes.find((node) => node.type === "trigger")?.config.event?.replaceAll("_", " ")}) start runs automatically while this workflow is live. You can also launch an on-demand run below.</p></div></div>}<div className="automation-run-form"><div><h3>Start a live run</h3><p>Uses the published workflow. Calls, WhatsApp messages, CRM updates, and bookings will execute for this contact.</p></div><input aria-label="Contact name" placeholder="Contact name" value={contactName} onChange={(event) => setContactName(event.target.value)} /><input aria-label="Contact phone" placeholder="+919876543210" value={phone} onChange={(event) => setPhone(event.target.value)} /><label className="automation-consent"><input type="checkbox" checked={consentConfirmed} onChange={(event) => setConsentConfirmed(event.target.checked)} /> I confirm this contact may be called or messaged.</label>{canRun && <button className="automation-primary" disabled={busy || !consentConfirmed || flow.status !== "live" || !/^\+[1-9]\d{7,14}$/.test(phone)} onClick={() => void startRun()}>Start run</button>}</div><div className="automation-run-list">{runs.length ? runs.map((run) => <details key={run._id} className="automation-run-card"><summary><span className={`automation-run-dot automation-run-${run.status}`} /><strong>{run.contactName || run.contactPhone}</strong><span>{run.contactPhone}</span><span className={`automation-status automation-status-${run.status}`}>{run.status}</span><small>{new Date(run.createdAt).toLocaleString()}</small><b>⌄</b></summary><div className="automation-run-details"><p>Published version {run.version} · Event {run.eventId}</p>{canRun && ["queued", "waiting"].includes(run.status) && <button className="automation-secondary automation-cancel-run" disabled={busy} onClick={() => void cancelRun(run._id)}>Cancel run</button>}{run.steps.map((step, index) => <div key={index}><span className={`automation-run-dot automation-run-${step.status}`} /><strong>{step.title}</strong><span>{step.detail}</span><small>{new Date(step.at).toLocaleString()}</small></div>)}{run.error && <p className="automation-alert">{run.error}</p>}</div></details>) : <div className="automation-empty"><h3>No runs yet</h3><p>Publish the workflow, then start a run with an eligible contact.</p></div>}</div></div> : <div className="automation-secondary-page"><div className="automation-secondary-head"><div><span className="automation-kicker">WORKFLOW CONTROL</span><h2>Settings & test</h2><p>Define the workflow and test its route before going live.</p></div></div><div className="automation-settings-grid"><div className="automation-settings-card"><h3>Workflow details</h3><label className="automation-field">Name<input value={name} onChange={(event) => { setName(event.target.value); setDirty(true); }} /></label><label className="automation-field">Description<textarea value={description} onChange={(event) => { setDescription(event.target.value); setDirty(true); }} /></label><button className="automation-secondary" disabled={busy || !dirty} onClick={() => void save()}>Save draft</button></div><div className="automation-settings-card"><h3>Dry run</h3><p>Simulate the journey without placing calls or sending messages.</p><label className="automation-field">Sample call outcome<select value={testOutcome} onChange={(event) => setTestOutcome(event.target.value)}><option value="qualified">Qualified / interested</option><option value="follow_up">Follow up / callback</option><option value="not_interested">Not interested</option><option value="unknown">Unknown</option><option value="missed">Missed</option></select></label><button className="automation-primary" disabled={busy} onClick={() => void test()}>▶ Run dry test</button>{testSteps.length > 0 && <div className="automation-test-steps">{testSteps.map((step, index) => <div key={index}><b>{index + 1}</b><span><strong>{step.title}</strong><small>{step.detail}</small></span></div>)}</div>}</div><div className="automation-settings-card"><h3>Published version</h3><p>{flow.publishedVersion ? `Version ${flow.publishedVersion} published ${flow.publishedAt ? new Date(flow.publishedAt).toLocaleString() : ""}.` : "This workflow is still a draft."}</p>{canPublish && flow.publishedVersion > 0 && <button className="automation-secondary" disabled={busy} onClick={() => void toggleStatus()}>{flow.status === "live" ? "Pause new runs" : "Resume new runs"}</button>}<p className="automation-inspector-help">Pausing prevents new runs. Existing runs continue on their original version.</p>{versions.length > 0 && <div className="automation-version-list"><strong>Version history</strong>{versions.map((version) => <div key={version._id}><span>v{version.version} · {new Date(version.createdAt).toLocaleDateString()}</span>{canPublish && <button disabled={busy || version.version === flow.publishedVersion} onClick={() => void restore(version.version)}>Restore</button>}</div>)}</div>}</div><div className="automation-settings-card"><h3>Danger zone</h3><p>Deleting removes the workflow definition. Active runs must finish first.</p>{canPublish && <button className="automation-delete-step" disabled={busy} onClick={() => void removeFlow()}>Delete workflow</button>}</div></div></div>}
      </>}
    </section>
  </main>;
}
