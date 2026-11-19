"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import "./AgentUseCasesSection.css";

const agentTasks = [
  { label: "Answer customer inquiries", status: "In progress", tone: "progress" },
  { label: "Qualify WhatsApp & voice leads", status: "Completed", tone: "completed" },
  { label: "Assist with order processing", status: "Completed", tone: "completed" },
  { label: "Handle customer complaints", status: "Consent required", tone: "consent" },
] as const;

function TaskStatusIcon({ tone }: { tone: "progress" | "completed" | "consent" }) {
  if (tone === "progress") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="8" cy="8" r="5.5" strokeDasharray="4 2.5" />
      </svg>
    );
  }
  if (tone === "completed") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="8" cy="8" r="5.5" />
        <path d="m5.5 8.1 1.7 1.7 3.4-3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 5.4v3.2M8 10.7h.01" strokeLinecap="round" />
    </svg>
  );
}

function LiveWaveCoreCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let startTime = performance.now();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 280;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const lineCount = 26;
    const steps = 96;
    const padX = 24;
    const spanX = size - padX * 2;
    const centerY = size * 0.5;

    const drawFrame = (now: number) => {
      const t = (now - startTime) * 0.0014;
      ctx.clearRect(0, 0, size, size);

      // Ambient cyan & magenta radial glows matching the reference wave
      const leftGlow = ctx.createRadialGradient(size * 0.16, centerY, 4, size * 0.16, centerY, size * 0.48);
      leftGlow.addColorStop(0, "rgba(34, 211, 238, 0.24)");
      leftGlow.addColorStop(1, "rgba(34, 211, 238, 0)");
      ctx.fillStyle = leftGlow;
      ctx.fillRect(0, 0, size, size);

      const rightGlow = ctx.createRadialGradient(size * 0.84, centerY, 4, size * 0.84, centerY, size * 0.48);
      rightGlow.addColorStop(0, "rgba(236, 72, 153, 0.24)");
      rightGlow.addColorStop(1, "rgba(236, 72, 153, 0)");
      ctx.fillStyle = rightGlow;
      ctx.fillRect(0, 0, size, size);

      const strokeGrad = ctx.createLinearGradient(padX, 0, size - padX, 0);
      strokeGrad.addColorStop(0, "#67e8f9");
      strokeGrad.addColorStop(0.28, "#38bdf8");
      strokeGrad.addColorStop(0.55, "#6366f1");
      strokeGrad.addColorStop(0.8, "#d946ef");
      strokeGrad.addColorStop(1, "#f472b6");

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let l = 0; l < lineCount; l++) {
        const ratio = l / (lineCount - 1); // 0 -> 1 across ribbon depth
        const depthOffset = (ratio - 0.5) * 2; // -1 -> 1
        ctx.beginPath();

        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const x = padX + u * spanX;
          // Smooth pinch envelope at both ends so the ribbon tapers to a glowing point
          const envelope = Math.pow(Math.sin(Math.PI * u), 1.35);

          const primaryWave =
            Math.sin(u * Math.PI * 2.6 - t * 1.45 + ratio * 1.35) * 26 +
            Math.sin(u * Math.PI * 4.4 + t * 0.95 - ratio * 0.8) * 11;

          const secondaryTwist =
            Math.cos(u * Math.PI * 2.1 + t * 1.15 + ratio * 2.1) * 16 * depthOffset;

          const y = centerY + (primaryWave + secondaryTwist) * envelope;

          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = 0.9 + (1 - Math.abs(depthOffset)) * 0.65;
        ctx.globalAlpha = 0.22 + (1 - Math.abs(depthOffset)) * 0.52;
        ctx.stroke();
      }

      ctx.restore();

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    rafId = window.requestAnimationFrame(drawFrame);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return <canvas ref={canvasRef} className="agentic-core-canvas" aria-hidden="true" />;
}

function WaveCoreImage({ className, size }: { className?: string; size: number }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={className}
      height={size}
      src="/images/agentic-wave-core.jpg"
      width={size}
    />
  );
}

export function AgentUseCasesSection() {
  return (
    <section className="agentic-showcase" aria-labelledby="agent-use-cases-title">
      <div className="agentic-showcase-inner">
        <div className="agentic-showcase-header">
          <span className="agentic-showcase-eyebrow">
            <i aria-hidden="true" /> AGENTIC CORE · VOICE &amp; WHATSAPP
          </span>
          <h2 id="agent-use-cases-title">
            One agentic core for every task
          </h2>
          <p>
            Answer calls and WhatsApp chats while agents update orders, calendars, and CRMs automatically.
          </p>
        </div>

        <div className="agentic-bento">
          {/* Left Card: Agent Tasks */}
          <article className="agentic-card agentic-tasks-card">
            <h3>Agent Tasks</h3>
            <p className="agentic-tasks-sub">
              Overview of all the tasks the agent is currently running
            </p>
            <div className="agentic-task-list">
              {agentTasks.map((task) => (
                <div className="agentic-task-row" key={task.label}>
                  <span className="agentic-task-name">{task.label}</span>
                  <span className={`agentic-task-pill is-${task.tone}`}>
                    <TaskStatusIcon tone={task.tone} />
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </article>

          {/* Center Core Tile */}
          <div className="agentic-core-tile" aria-hidden="true">
            <LiveWaveCoreCanvas />
          </div>

          {/* Right Card: Voice AI Agent */}
          <article className="agentic-card">
            <div className="agentic-agent-head">
              <div className="agentic-agent-identity">
                <span className="agentic-agent-avatar" aria-hidden="true">
                  <WaveCoreImage size={34} />
                </span>
                <h3>Voice AI Agent</h3>
              </div>
              <span className="agentic-channel-badge">Voice + WhatsApp</span>
            </div>

            <span className="agentic-sublabel">Agent Tools</span>
            <div className="agentic-tools-row" aria-label="Connected agent tools">
              <span className="agentic-tool-tile" title="Instant webhooks">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M11 2.5 5 11h5l-1 6.5 6-8.5h-5l1-6.5Z" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="agentic-tool-tile" title="Custom API tools">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="m12.8 4.2 3 3-8.6 8.6-3.4.4.4-3.4 8.6-8.6Z" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="agentic-tool-tile" title="Agentic workflows">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="8" y="2.5" width="4" height="3.5" rx="0.8" />
                  <rect x="2.5" y="13.5" width="4" height="3.5" rx="0.8" />
                  <rect x="13.5" y="13.5" width="4" height="3.5" rx="0.8" />
                  <path d="M10 6v3.5m0 0H4.5v4m5.5-4h5.5v4" />
                </svg>
              </span>
              <span className="agentic-tool-tile" title="WhatsApp">
                <Image alt="WhatsApp" src="/images/integrations/whatsapp.svg" width={16} height={16} />
              </span>
              <span className="agentic-tool-tile" title="Google Calendar">
                <Image alt="Google Calendar" src="/images/integrations/google-calendar.svg" width={16} height={16} />
              </span>
              <span className="agentic-tool-tile" title="Slack">
                <Image alt="Slack" src="/images/integrations/slack.svg" width={16} height={16} />
              </span>
            </div>

            <span className="agentic-sublabel">Key Statistics</span>
            <div className="agentic-stats-grid">
              <div className="agentic-stat-box agentic-stat-main">
                <div>
                  <span className="agentic-stat-title">Response Accuracy</span>
                  <div className="agentic-stat-value">99%</div>
                </div>
                <span className="agentic-stat-delta">↗ 68%</span>
                <svg className="agentic-sparkline" viewBox="0 0 120 72" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="agenticSparkFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 64 C 24 62, 34 46, 54 42 C 74 38, 86 14, 108 16 L 120 18 L 120 72 L 0 72 Z"
                    fill="url(#agenticSparkFill)"
                  />
                  <path
                    d="M0 64 C 24 62, 34 46, 54 42 C 74 38, 86 14, 108 16 L 120 18"
                    fill="none"
                    stroke="#f472b6"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="agentic-stat-stack">
                <div className="agentic-stat-box">
                  <span className="agentic-stat-title">Customer Satisfaction</span>
                  <div className="agentic-stat-small-val">96%</div>
                </div>
                <div className="agentic-stat-box">
                  <span className="agentic-stat-title">Task Completion Rate</span>
                  <div className="agentic-stat-small-val">91%</div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
