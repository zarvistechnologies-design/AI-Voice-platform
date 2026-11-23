"use client";

import { useState } from "react";
import { VoiceAgentVisualIcon as Icon, type IconName } from "./VoiceAgentVisualIcon";
import "./CreateWorkflowsExperience.css";

type BuilderScenario = {
  title: string;
  status: string;
  checksCount: number;
  stepsCount: number;
  connectionsCount: number;
  startNode: { title: string; subtitle: string };
  callNode: { title: string; subtitle: string };
  decisionNode: { title: string; subtitle: string; branches: [string, string, string, string] };
  branchNodes: {
    top1: { title: string; subtitle: string };
    top1End: { title: string; subtitle: string };
    top2: { title: string; subtitle: string };
    top2End: { title: string; subtitle: string };
    bot1: { title: string; subtitle: string };
    bot2: { title: string; subtitle: string };
  };
};

const scenarios: BuilderScenario[] = [
  {
    title: "Qualify new leads",
    status: "Draft",
    checksCount: 7,
    stepsCount: 11,
    connectionsCount: 11,
    startNode: { title: "Start when", subtitle: "Manual / API event" },
    callNode: { title: "First call", subtitle: "Choose an agent" },
    decisionNode: {
      title: "How did the call go?",
      subtitle: "Route by call outcome",
      branches: ["Interested", "Callback later", "Not interested", "Unknown"],
    },
    branchNodes: {
      top1: { title: "Send the details", subtitle: "Choose a template" },
      top1End: { title: "Qualified", subtitle: "qualified" },
      top2: { title: "Wait a day", subtitle: "1440 min delay" },
      top2End: { title: "Follow-up call", subtitle: "Choose an agent" },
      bot1: { title: "Not interested", subtitle: "not_interested" },
      bot2: { title: "Needs review", subtitle: "needs_review" },
    },
  },
  {
    title: "Unanswered call retry",
    status: "Draft",
    checksCount: 3,
    stepsCount: 9,
    connectionsCount: 9,
    startNode: { title: "Start when", subtitle: "Inbound lead form" },
    callNode: { title: "Outbound call", subtitle: "Vozon Sales Agent" },
    decisionNode: {
      title: "Did customer answer?",
      subtitle: "Route by line status",
      branches: ["Answered", "Voicemail", "Busy line", "Invalid number"],
    },
    branchNodes: {
      top1: { title: "Send WhatsApp", subtitle: "Callback time picker" },
      top1End: { title: "Slot booked", subtitle: "calendar_confirmed" },
      top2: { title: "Wait 2 hours", subtitle: "120 min delay" },
      top2End: { title: "Retry call", subtitle: "Second attempt" },
      bot1: { title: "Mark unreachable", subtitle: "no_response" },
      bot2: { title: "Alert rep", subtitle: "crm_task_created" },
    },
  },
  {
    title: "Support triage & handoff",
    status: "Verified",
    checksCount: 0,
    stepsCount: 12,
    connectionsCount: 13,
    startNode: { title: "Start when", subtitle: "Support call or chat" },
    callNode: { title: "Triage agent", subtitle: "Check order & policy" },
    decisionNode: {
      title: "Resolution path?",
      subtitle: "Route by complexity",
      branches: ["Resolved", "Needs replacement", "Billing dispute", "Urgent"],
    },
    branchNodes: {
      top1: { title: "Send WhatsApp", subtitle: "Tracking summary" },
      top1End: { title: "Resolved", subtitle: "ticket_closed" },
      top2: { title: "Create ticket", subtitle: "Attach call summary" },
      top2End: { title: "Warm handoff", subtitle: "Specialist queue" },
      bot1: { title: "Billing team", subtitle: "finance_queue" },
      bot2: { title: "Priority escalation", subtitle: "on_call_lead" },
    },
  },
  {
    title: "Appointment reminders",
    status: "Draft",
    checksCount: 2,
    stepsCount: 10,
    connectionsCount: 10,
    startNode: { title: "Start when", subtitle: "24h before visit" },
    callNode: { title: "Reminder call", subtitle: "Attendance check" },
    decisionNode: {
      title: "Customer response?",
      subtitle: "Route by attendance",
      branches: ["Confirmed", "Reschedule", "Cancelled", "No answer"],
    },
    branchNodes: {
      top1: { title: "Send pass", subtitle: "WhatsApp confirmation" },
      top1End: { title: "Confirmed", subtitle: "slot_locked" },
      top2: { title: "Offer new slots", subtitle: "Google Calendar" },
      top2End: { title: "Rebooked", subtitle: "updated_slot" },
      bot1: { title: "Release slot", subtitle: "calendar_freed" },
      bot2: { title: "Send SMS backup", subtitle: "sms_reminder" },
    },
  },
];

const paletteBlocks: { icon: IconName; badge: string; label: string }[] = [
  { icon: "spark", badge: "icon-badge-cyan", label: "Start when" },
  { icon: "phone", badge: "icon-badge-blue", label: "Call" },
  { icon: "message", badge: "icon-badge-emerald", label: "Send WhatsApp" },
  { icon: "spark", badge: "icon-badge-violet", label: "AI decides" },
  { icon: "branch", badge: "icon-badge-violet", label: "Conditional" },
  { icon: "clock", badge: "icon-badge-amber", label: "Wait" },
  { icon: "check", badge: "icon-badge-blue", label: "End" },
  { icon: "file", badge: "icon-badge-amber", label: "Send SMS" },
];

export function CreateWorkflowsExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scenario = scenarios[activeIndex];

  return (
    <div className="vc-experience is-builder-showcase" aria-label="Interactive Vozon Create Workflows studio">
      <div className="vc-hero-intro">
        <span>VOZON / CREATE WORKFLOWS</span>
        <h1>Create workflows that turn conversations into action.</h1>
      </div>

      <div className="vc-industries" role="group" aria-label="Choose a workflow canvas template">
        {scenarios.map((item, index) => (
          <button
            key={item.title}
            type="button"
            aria-pressed={activeIndex === index}
            className={activeIndex === index ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="cw-builder-shell" key={`builder-${scenario.title}`}>
        {/* Top Navigation Bar */}
        <div className="cw-builder-topbar">
          <div className="cw-topbar-left">
            <span className="cw-back-link">← Workflows</span>
            <span className="cw-slash">/</span>
            <strong className="cw-workflow-title">{scenario.title}</strong>
            <span className="cw-draft-pill">{scenario.status}</span>
          </div>

          <div className="cw-topbar-right">
            <span className="cw-topbar-item">
              <Icon name="sliders" /> Settings
            </span>
            <span className="cw-topbar-item">
              <Icon name="layers" /> Runs
            </span>
            <span className="cw-topbar-item is-builder-tab">
              <Icon name="grid" /> Builder
            </span>
            {scenario.checksCount > 0 ? (
              <span className="cw-topbar-check-warn">{scenario.checksCount} to check</span>
            ) : (
              <span className="cw-topbar-check-warn" style={{ color: "#059669" }}>All checks passed</span>
            )}
            <span className="cw-topbar-save">Save</span>
            <span className="cw-publish-btn">Publish v1</span>
          </div>
        </div>

        {/* 3-Column Builder Body */}
        <div className="cw-builder-body">
          {/* Left Palette: BLOCKS */}
          <div className="cw-sidebar-left">
            <div>
              <div className="cw-sidebar-head">
                <span>BLOCKS</span>
                <small>Drag your journey together</small>
              </div>

              <div className="cw-block-list">
                {paletteBlocks.map((block) => (
                  <div key={block.label} className="cw-block-item">
                    <span className={`cw-block-icon ${block.badge}`}>
                      <Icon name={block.icon} />
                    </span>
                    <strong>{block.label}</strong>
                    <span className="cw-block-plus">+</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Interactive Canvas */}
          <div className="cw-canvas-wrap">
            {/* Top-right floating Tidy Up / Fit bar */}
            <div className="cw-canvas-toolbar">
              <span>
                <Icon name="spark" /> Tidy up
              </span>
              <span className="cw-toolbar-muted">↶</span>
              <span className="cw-toolbar-muted">↷</span>
              <span>Fit</span>
            </div>

            {/* SVG Bezier Curves connecting nodes */}
            <svg className="cw-canvas-edges" viewBox="0 0 820 455" preserveAspectRatio="none" aria-hidden="true">
              {/* Node 1 -> Node 2 */}
              <path d="M 164 225 C 185 225, 188 225, 205 225" fill="none" stroke="#94a3b8" strokeWidth="1.6" />
              {/* Node 2 -> Node 3 */}
              <path d="M 349 220 C 370 220, 374 220, 392 220" fill="none" stroke="#94a3b8" strokeWidth="1.6" />
              <path d="M 349 235 C 370 235, 374 235, 392 230" fill="none" stroke="#94a3b8" strokeWidth="1.4" />

              {/* Node 3 -> Top 1 (Send the details) */}
              <path d="M 536 218 C 562 218, 554 102, 585 102" fill="none" stroke="#8b5cf6" strokeWidth="1.6" />
              {/* Top 1 -> Top 1 End (Qualified) */}
              <path d="M 729 102 C 742 102, 745 102, 756 102" fill="none" stroke="#94a3b8" strokeWidth="1.6" />

              {/* Node 3 -> Top 2 (Wait a day) */}
              <path d="M 536 232 C 560 232, 558 205, 585 205" fill="none" stroke="#8b5cf6" strokeWidth="1.6" />
              {/* Top 2 -> Top 2 End (Follow-up call) */}
              <path d="M 729 205 C 742 205, 745 205, 756 205" fill="none" stroke="#94a3b8" strokeWidth="1.6" />

              {/* Node 3 -> Bot 1 (Not interested) */}
              <path d="M 536 246 C 560 246, 558 302, 585 302" fill="none" stroke="#8b5cf6" strokeWidth="1.6" />

              {/* Node 3 -> Bot 2 (Needs review) */}
              <path d="M 536 260 C 562 260, 554 385, 585 385" fill="none" stroke="#8b5cf6" strokeWidth="1.6" />
            </svg>

            <div className="cw-nodes-stage">
              {/* Edge Labels */}
              <span className="cw-edge-tag" style={{ left: "540px", top: "145px" }}>
                {scenario.decisionNode.branches[0]}
              </span>
              <span className="cw-edge-tag" style={{ left: "540px", top: "212px" }}>
                Call failed
              </span>
              <span className="cw-edge-tag" style={{ left: "538px", top: "272px" }}>
                {scenario.decisionNode.branches[2]}
              </span>
              <span className="cw-edge-tag" style={{ left: "540px", top: "326px" }}>
                {scenario.decisionNode.branches[3]}
              </span>

              {/* Node 1: Start when */}
              <div className="cw-node is-teal" style={{ left: "20px", top: "178px" }}>
                <div className="cw-node-head">
                  <span className="cw-node-dot icon-badge-cyan">
                    <Icon name="spark" />
                  </span>
                  <strong>{scenario.startNode.title}</strong>
                </div>
                <span className="cw-node-sub">{scenario.startNode.subtitle}</span>
                <div className="cw-node-ports">
                  <div className="cw-node-port">
                    <span>Next</span>
                    <i className="cw-port-handle is-teal" />
                  </div>
                </div>
              </div>

              {/* Node 2: First call */}
              <div className="cw-node is-coral" style={{ left: "205px", top: "172px" }}>
                <div className="cw-node-head">
                  <span className="cw-node-dot icon-badge-blue">
                    <Icon name="phone" />
                  </span>
                  <strong>{scenario.callNode.title}</strong>
                </div>
                <span className="cw-node-sub">{scenario.callNode.subtitle}</span>
                <div className="cw-node-ports">
                  <div className="cw-node-port">
                    <span>Next</span>
                    <i className="cw-port-handle is-coral" />
                  </div>
                  <div className="cw-node-port">
                    <span>Call failed</span>
                    <i className="cw-port-handle is-coral" />
                  </div>
                </div>
              </div>

              {/* Node 3: How did the call go? */}
              <div className="cw-node is-violet" style={{ left: "392px", top: "165px" }}>
                <div className="cw-node-head">
                  <span className="cw-node-dot icon-badge-violet">
                    <Icon name="spark" />
                  </span>
                  <strong>{scenario.decisionNode.title}</strong>
                </div>
                <span className="cw-node-sub">{scenario.decisionNode.subtitle}</span>
                <div className="cw-node-ports">
                  {scenario.decisionNode.branches.map((branch) => (
                    <div key={branch} className="cw-node-port">
                      <span>{branch}</span>
                      <i className="cw-port-handle is-violet" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Branch 1: Send the details */}
              <div className="cw-node is-coral" style={{ left: "585px", top: "55px" }}>
                <div className="cw-node-head">
                  <span className="cw-node-dot icon-badge-emerald">
                    <Icon name="message" />
                  </span>
                  <strong>{scenario.branchNodes.top1.title}</strong>
                </div>
                <span className="cw-node-sub">{scenario.branchNodes.top1.subtitle}</span>
                <div className="cw-node-ports">
                  <div className="cw-node-port">
                    <span>Next</span>
                    <i className="cw-port-handle is-teal" />
                  </div>
                </div>
              </div>

              {/* Right Branch 1 Terminal: Qualified */}
              <div className="cw-node is-slate" style={{ left: "752px", top: "55px", width: "110px" }}>
                <div className="cw-node-head">
                  <span className="cw-node-dot icon-badge-blue">
                    <Icon name="check" />
                  </span>
                  <strong>{scenario.branchNodes.top1End.title}</strong>
                </div>
                <span className="cw-node-sub" style={{ borderBottom: 0, paddingBottom: 0 }}>
                  {scenario.branchNodes.top1End.subtitle}
                </span>
              </div>

              {/* Right Branch 2: Wait a day */}
              <div className="cw-node is-amber" style={{ left: "585px", top: "162px" }}>
                <div className="cw-node-head">
                  <span className="cw-node-dot icon-badge-amber">
                    <Icon name="clock" />
                  </span>
                  <strong>{scenario.branchNodes.top2.title}</strong>
                </div>
                <span className="cw-node-sub">{scenario.branchNodes.top2.subtitle}</span>
                <div className="cw-node-ports">
                  <div className="cw-node-port">
                    <span>Next</span>
                    <i className="cw-port-handle is-amber" />
                  </div>
                </div>
              </div>

              {/* Right Branch 2 Terminal: Follow-up call */}
              <div className="cw-node is-coral" style={{ left: "752px", top: "162px", width: "110px" }}>
                <div className="cw-node-head">
                  <span className="cw-node-dot icon-badge-blue">
                    <Icon name="phone" />
                  </span>
                  <strong>{scenario.branchNodes.top2End.title}</strong>
                </div>
                <span className="cw-node-sub">{scenario.branchNodes.top2End.subtitle}</span>
                <div className="cw-node-ports">
                  <div className="cw-node-port">
                    <span>Next</span>
                  </div>
                </div>
              </div>

              {/* Right Branch 3: Not interested */}
              <div className="cw-node is-slate" style={{ left: "585px", top: "268px" }}>
                <div className="cw-node-head">
                  <span className="cw-node-dot icon-badge-blue">
                    <Icon name="check" />
                  </span>
                  <strong>{scenario.branchNodes.bot1.title}</strong>
                </div>
                <span className="cw-node-sub" style={{ borderBottom: 0, paddingBottom: 0 }}>
                  {scenario.branchNodes.bot1.subtitle}
                </span>
              </div>

              {/* Right Branch 4: Needs review */}
              <div className="cw-node is-slate" style={{ left: "585px", top: "348px" }}>
                <div className="cw-node-head">
                  <span className="cw-node-dot icon-badge-rose">
                    <Icon name="headset" />
                  </span>
                  <strong>{scenario.branchNodes.bot2.title}</strong>
                </div>
                <span className="cw-node-sub" style={{ borderBottom: 0, paddingBottom: 0 }}>
                  {scenario.branchNodes.bot2.subtitle}
                </span>
              </div>
            </div>

            {/* Bottom-left Minimap */}
            <div className="cw-canvas-minimap" aria-hidden="true">
              <span className="cw-mini-block" style={{ gridColumn: "1", gridRow: "2", background: "#14b8a6" }} />
              <span className="cw-mini-block" style={{ gridColumn: "2", gridRow: "2", background: "#6366f1" }} />
              <span className="cw-mini-block" style={{ gridColumn: "3", gridRow: "1", background: "#22c55e" }} />
              <span className="cw-mini-block" style={{ gridColumn: "4", gridRow: "1", background: "#94a3b8" }} />
              <span className="cw-mini-block" style={{ gridColumn: "3", gridRow: "2", background: "#8b5cf6" }} />
              <span className="cw-mini-block" style={{ gridColumn: "4", gridRow: "2", background: "#f59e0b" }} />
              <span className="cw-mini-block" style={{ gridColumn: "5", gridRow: "2", background: "#3b82f6" }} />
              <span className="cw-mini-block" style={{ gridColumn: "3", gridRow: "3", background: "#94a3b8" }} />
              <span className="cw-mini-block" style={{ gridColumn: "3", gridRow: "4", background: "#94a3b8" }} />
            </div>

            {/* Bottom-right Zoom Pill */}
            <div className="cw-canvas-zoom" aria-hidden="true">
              <span>+</span>
              <span>40%</span>
              <span>−</span>
            </div>
          </div>

          {/* Right Inspector: WORKFLOW */}
          <div className="cw-sidebar-right">
            <span className="cw-sidebar-right-kicker">WORKFLOW</span>
            <p className="cw-sidebar-right-desc">
              Select a step to configure it. Use the coloured handles to connect the journey.
            </p>

            <div className="cw-stat-list">
              <div className="cw-stat-row">
                <strong>{scenario.stepsCount}</strong>
                <span>Steps</span>
              </div>
              <div className="cw-stat-row">
                <strong>{scenario.connectionsCount}</strong>
                <span>Connections</span>
              </div>
              <div className="cw-stat-row">
                <strong>{scenario.checksCount}</strong>
                <span>Checks to resolve</span>
              </div>
            </div>

            <button type="button" className="cw-checks-btn">
              View publish checks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
