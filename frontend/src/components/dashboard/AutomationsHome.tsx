"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { DashboardSidebar, getDashboardSidebarInitialState } from "@/components/dashboard/DashboardSidebar";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { getServerSession, getSession, logoutSession, subscribeToSession } from "@/lib/auth";
import { automationsApi, type AutomationSummary, type FlowGraph } from "@/lib/automations";
import { blankFlow, flowTemplates } from "@/lib/automationTemplates";

const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export function AutomationsHome() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [showSidebar, setShowSidebar] = useState(getDashboardSidebarInitialState);
  const [flows, setFlows] = useState<AutomationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!session) return;
    let active = true;
    automationsApi.list().then(({ flows }) => { if (active) setFlows(flows); }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Could not load workflows."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [session]);

  const visible = useMemo(() => flows.filter((flow) =>
    (filter === "all" || flow.status === filter) && `${flow.name} ${flow.description}`.toLowerCase().includes(query.toLowerCase()),
  ), [flows, filter, query]);

  async function create(name: string, description: string, graph: FlowGraph) {
    setBusy(true); setError("");
    try {
      const { flow } = await automationsApi.create({ name, description, graph });
      router.push(`/dashboard/automations/${flow._id}`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not create workflow."); }
    finally { setBusy(false); }
  }

  async function buildFromPrompt() {
    setBusy(true); setError("");
    try {
      const { draft } = await automationsApi.generate(prompt);
      const { flow } = await automationsApi.create(draft);
      router.push(`/dashboard/automations/${flow._id}`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not build a workflow from that description."); }
    finally { setBusy(false); }
  }

  const canCreate = ["owner", "admin", "member"].includes(session?.organization?.role ?? "");
  if (!session) return <main className="automation-loading">Loading workflows…</main>;
  return <main className={`automation-layout dashboard-home-theme ${showSidebar ? "automation-sidebar-open" : ""}`}>
    <DashboardSidebar activeLabel="Automation Workflow" userInitials={initials(session.name)} userName={session.name} userEmail={session.email} onLogout={() => void logoutSession().then(() => router.replace("/login"))} showUserSidebar={showSidebar} setShowUserSidebar={setShowSidebar} />
    <section className="automation-home">
      <DashboardPageHeader eyebrow="Automations" title="Workflows" description="Build connected journeys across voice, messaging and follow-up." actions={canCreate ? <button className="automation-primary" onClick={() => setCreateOpen(true)}>＋ Create workflow</button> : undefined} />
      <div className="automation-home-body">
        <div className="automation-home-hero"><div><span className="automation-kicker">YOUR WORKSPACE, IN MOTION</span><h2>Make every next step happen.</h2><p>Turn customer moments into clear, repeatable journeys. Start with a template or build your own flow.</p>{canCreate && <button className="automation-primary" onClick={() => setCreateOpen(true)}>Create your first workflow <span>↗</span></button>}</div><div className="automation-hero-art" aria-hidden="true"><span>START</span><i></i><span>CALL</span><i></i><span>DECIDE</span><i></i><span>FOLLOW UP</span></div></div>
        <div className="automation-list-head"><div><h2>All workflows</h2><p>{flows.length} workflow{flows.length === 1 ? "" : "s"} in this workspace</p></div><div className="automation-list-tools"><input aria-label="Search workflows" placeholder="Search workflows" value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Filter workflows" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All statuses</option><option value="draft">Draft</option><option value="live">Live</option><option value="paused">Paused</option></select></div></div>
        {error && <div className="automation-alert" role="alert">{error}</div>}
        {loading ? <div className="automation-empty">Loading workflows…</div> : visible.length ? <div className="automation-flow-grid">{visible.map((flow, index) => <Link className="automation-flow-card" href={`/dashboard/automations/${flow._id}`} key={flow._id}><div className={`automation-flow-icon automation-flow-icon-${index % 4}`}>✦</div><div className="automation-flow-info"><strong>{flow.name}</strong><p>{flow.description || "Open the canvas to configure this journey."}</p><div><span className={`automation-status automation-status-${flow.status}`}>{flow.status}</span><small>Updated {new Date(flow.updatedAt).toLocaleDateString()}</small><small>{flow.publishedVersion ? `v${flow.publishedVersion} published` : "Not published"}</small></div></div><span className="automation-card-arrow">↗</span></Link>)}</div> : <div className="automation-empty"><div className="automation-empty-mark">✦</div><h3>{query || filter !== "all" ? "No workflows match" : "Your canvas is ready"}</h3><p>{query || filter !== "all" ? "Try a different search or status." : "Create a workflow to connect your customer conversations."}</p>{canCreate && !query && filter === "all" && <button className="automation-primary" onClick={() => setCreateOpen(true)}>Create workflow</button>}</div>}
      </div>
    </section>
    {canCreate && createOpen && <div className="automation-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false); }}><div className="automation-create-modal" role="dialog" aria-modal="true" aria-labelledby="automation-create-heading"><div className="automation-modal-head"><div><span className="automation-kicker">NEW AUTOMATION</span><h2 id="automation-create-heading">Create a workflow</h2></div><button aria-label="Close" className="automation-icon-button" onClick={() => setCreateOpen(false)}>×</button></div><div className="automation-prompt-box"><label htmlFor="automation-prompt">✦ Describe it, and AI builds a draft</label><textarea id="automation-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Call every new lead. If they're interested, send the brochure on WhatsApp. If they ask for a callback, call again tomorrow." /><div className="automation-prompt-actions"><span>Review and configure every step before publishing.</span><button className="automation-primary" disabled={busy || prompt.trim().length < 15} onClick={() => void buildFromPrompt()}>{busy ? "Building…" : "✦ Build it"}</button></div></div><h3 className="automation-template-heading">Or start from a template</h3><div className="automation-template-grid">{flowTemplates.map((template, index) => <button key={template.id} disabled={busy} className="automation-template-card" onClick={() => void create(template.name, template.description, template.graph)}><span className={`automation-template-icon automation-flow-icon-${index % 4}`}>{["✦", "↶", "◷", "◆", "▣", "♥"][index]}</span><strong>{template.name}</strong><small>{template.description}</small></button>)}<button disabled={busy} className="automation-template-card automation-blank-card" onClick={() => void create("Untitled workflow", "", blankFlow())}><span className="automation-template-icon">＋</span><strong>Start from a blank canvas</strong><small>Shape every step yourself.</small></button></div>{error && <p className="automation-alert" role="alert">{error}</p>}</div></div>}
  </main>;
}
