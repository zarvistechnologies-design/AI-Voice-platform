"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface TimelineStep {
  id: string;
  timestamp: string;
  seconds: number;
  type: "caller" | "brain" | "agent";
  title: string;
  speaker?: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  brainData?: {
    stepType: "Reasoning Step" | "Multi-Tool Planning";
    goal?: string;
    toolCalls: Array<{
      name: string;
      code: string;
      result?: string;
    }>;
  };
}

export const scenarioSteps: TimelineStep[] = [
  {
    id: "step-1",
    timestamp: "00:02",
    seconds: 2,
    type: "caller",
    title: "Caller Speaks (Constraint Input)",
    speaker: "Caller",
    text: "Hey, I need to reschedule my dental surgery tomorrow, but only if Dr. Sharma is available after 5 PM.",
  },
  {
    id: "step-2",
    timestamp: "00:03",
    seconds: 3,
    type: "brain",
    title: "Agent Brain (Reasoning Step)",
    image: "/images/scenario/doctor-schedule-calendar.jpg",
    imageAlt: "Dr. Sharma Dental Surgery Availability Calendar query result showing 5:30 PM and 6:15 PM slots",
    imageCaption: "Live Backend Query: Dr. Sharma's availability retrieved in <180ms without interrupting caller.",
    brainData: {
      stepType: "Reasoning Step",
      goal: "Reschedule appointment with constraint (Provider: Dr. Sharma, Time: > 17:00, Date: Tomorrow).",
      toolCalls: [
        {
          name: "Tool Call 1",
          code: "execute_tool('check_doctor_schedule', { doctor: 'Dr. Sharma', after: '17:00' })",
          result: "[17:30 PM available, 18:15 PM available]",
        },
      ],
    },
  },
  {
    id: "step-3",
    timestamp: "00:04",
    seconds: 4,
    type: "agent",
    title: "Agent Speaks (Contextual Solution)",
    speaker: "Agent Speaks",
    text: "Dr. Sharma has two openings tomorrow evening: one at 5:30 PM and another at 6:15 PM. Which one suits you best?",
  },
  {
    id: "step-4",
    timestamp: "00:10",
    seconds: 10,
    type: "caller",
    title: "Caller Speaks (Decision & Secondary Request)",
    speaker: "Caller",
    text: "Let's do 5:30. Oh, and can you text me the clinic address?",
  },
  {
    id: "step-5",
    timestamp: "00:11",
    seconds: 11,
    type: "brain",
    title: "Agent Brain (Multi-Tool Planning)",
    image: "/images/scenario/whatsapp-clinic-confirmation.jpg",
    imageAlt: "WhatsApp Business confirmation message and Indiranagar clinic Google Maps pin dispatched in real time",
    imageCaption: "Multi-Tool Dispatch: WhatsApp location card dispatched during the call while booking slot 17:30.",
    brainData: {
      stepType: "Multi-Tool Planning",
      toolCalls: [
        {
          name: "Tool Call 2",
          code: "execute_tool('reschedule_appointment', { slot: '17:30' })",
          result: "Booking updated: Dr. Sharma, Tomorrow 17:30 (Status: Confirmed)",
        },
        {
          name: "Tool Call 3",
          code: "execute_tool('send_whatsapp_location', { template: 'clinic_directions' })",
          result: "WhatsApp dispatched: +91-XXXXXXXXXX (Status: Delivered)",
        },
      ],
    },
  },
  {
    id: "step-6",
    timestamp: "00:13",
    seconds: 13,
    type: "agent",
    title: "Agent Speaks (Outcome & Omnichannel Confirmation)",
    speaker: "Agent Speaks",
    image: "/images/scenario/whatsapp-clinic-confirmation.jpg",
    imageAlt: "Delivered WhatsApp message with verified badge and directions",
    imageCaption: "Omnichannel Outcome: Live call finalized with instant WhatsApp confirmation & clinic map delivered.",
    text: "All set! Your surgery is moved to tomorrow at 5:30 PM with Dr. Sharma, and I've just sent the location directly to your WhatsApp. Anything else I can assist with?",
  },
];

export function AgenticInActionSection() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"walkthrough" | "flowchart" | "full">("walkthrough");

  const currentStep = scenarioSteps[activeStepIndex];

  return (
    <section
      id="agentic-in-action"
      className="relative overflow-hidden bg-paper-2/80 py-20 md:py-28 border-t border-line text-ink scroll-mt-24"
      aria-labelledby="scenario-title"
    >
      {/* Ambient Radial Highlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 12%, rgba(129, 161, 11, 0.1) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="eyebrow text-cobalt font-semibold tracking-wider uppercase">
            Real-World Scenario Breakdown
          </p>

          <h2
            id="scenario-title"
            className="display-lg mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            &ldquo;Agentic in <span className="text-cobalt">Action</span>&rdquo;
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base font-normal">
            Show your enterprise prospects what happens inside the agent&apos;s brain during a 60-second call. Witness real-time reasoning, dynamic constraints, live database queries, and instant WhatsApp location dispatch.
          </p>

          {/* View Mode Toggle: Interactive Walkthrough vs Flowchart vs Full Telemetry Feed */}
          <div className="mt-8 inline-flex items-center rounded-full bg-paper border border-line p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("walkthrough")}
              className={`rounded-full px-4 sm:px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                viewMode === "walkthrough"
                  ? "bg-ink text-[#d4ff3f] shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
              aria-pressed={viewMode === "walkthrough"}
            >
              <span>✦</span>
              <span>Step-by-Step Replay</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("flowchart")}
              className={`rounded-full px-4 sm:px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                viewMode === "flowchart"
                  ? "bg-ink text-[#d4ff3f] shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
              aria-pressed={viewMode === "flowchart"}
            >
              <span>⇄</span>
              <span>Sequence Flowchart</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("full")}
              className={`rounded-full px-4 sm:px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                viewMode === "full"
                  ? "bg-ink text-[#d4ff3f] shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
              aria-pressed={viewMode === "full"}
            >
              <span>☰</span>
              <span>Full Telemetry Log</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            MODE 1: INTERACTIVE STEP-BY-STEP REPLAY WALKTHROUGH
            ======================================================== */}
        {viewMode === "walkthrough" && (
          <div className="mt-12 mx-auto max-w-6xl">
            {/* Timeline Progress Stepper */}
            <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-3 border-b border-line">
              {scenarioSteps.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                const isPassed = activeStepIndex > idx;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-ink text-[#d4ff3f] shadow-sm font-bold"
                        : isPassed
                        ? "bg-paper text-ink border border-line"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <span className="font-bold">[{step.timestamp}]</span>
                    <span className="hidden md:inline font-sans font-medium text-[11.5px]">
                      {step.type === "caller"
                        ? "Caller"
                        : step.type === "brain"
                        ? "Brain Reasoning"
                        : "Agent Speaks"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main Stage: Call Inspector Display */}
            <div className="mt-6 rounded-3xl border border-line bg-paper p-6 sm:p-10 shadow-md">
              {/* Event Badge Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-ink text-[#d4ff3f] font-mono text-xs font-bold shadow-sm">
                    {currentStep.timestamp}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">
                      {currentStep.title}
                    </h3>
                    <p className="font-mono text-[11px] text-muted">
                      Elapsed Time: {currentStep.seconds}s of call session
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${
                    currentStep.type === "caller"
                      ? "bg-rose-100 text-rose-800"
                      : currentStep.type === "brain"
                      ? "bg-[#0e0e0c] text-[#d4ff3f]"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {currentStep.type === "caller"
                    ? "Inbound Audio"
                    : currentStep.type === "brain"
                    ? "Autonomous Telemetry"
                    : "Synthesized Output"}
                </span>
              </div>

              {/* Event Body */}
              <div className="mt-7">
                {/* 1. Caller Speech Bubble */}
                {currentStep.type === "caller" && (
                  <div className="rounded-2xl border border-line bg-paper-2 p-6 sm:p-8">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-muted uppercase tracking-wider">
                      <span className="size-2 rounded-full bg-rose-500" />
                      <span>Caller Voice Input</span>
                    </div>
                    <blockquote className="mt-4 font-display text-xl sm:text-2xl font-bold text-ink leading-relaxed">
                      &ldquo;{currentStep.text}&rdquo;
                    </blockquote>
                    <div className="mt-5 flex items-center gap-4 text-xs font-mono text-muted border-t border-line pt-4">
                      <span>STT Latency: ~140ms</span>
                      <span>•</span>
                      <span>Audio VAD: Active</span>
                      <span>•</span>
                      <span>Language: English (Indic Accent)</span>
                    </div>
                  </div>
                )}

                {/* 2. Agent Brain Reasoning Card with Dynamic System Mockup */}
                {currentStep.type === "brain" && currentStep.brainData && (
                  <div className="grid gap-6 lg:grid-cols-12 items-stretch">
                    {/* Left: Reasoning & Tool Code */}
                    <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0e0e0c] p-6 sm:p-8 text-zinc-100 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#d4ff3f]">
                            <span className="grid size-4 place-items-center rounded-full bg-white/10 text-[10px]">✦</span>
                            <span>{currentStep.brainData.stepType}</span>
                          </div>
                          <span className="font-mono text-[11px] text-zinc-400">
                            Cognitive Latency: &lt;180ms
                          </span>
                        </div>

                        {/* Extracted Goal & Constraints */}
                        {currentStep.brainData.goal && (
                          <div className="mt-5 rounded-xl bg-white/5 border border-white/10 p-4">
                            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                              Extracted Goal &amp; Dynamic Constraints:
                            </span>
                            <p className="font-mono text-xs sm:text-[13px] text-zinc-200 leading-relaxed">
                              - {currentStep.brainData.goal}
                            </p>
                          </div>
                        )}

                        {/* Tool Calls */}
                        <div className="mt-5 space-y-4">
                          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#d4ff3f] block">
                            Live Tool Execution:
                          </span>
                          {currentStep.brainData.toolCalls.map((tc, tIdx) => (
                            <div
                              key={tIdx}
                              className="rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs sm:text-[13px]"
                            >
                              <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/10">
                                <span className="font-bold text-[#d4ff3f]">{tc.name}</span>
                                <span className="text-[11px] text-emerald-400">● Status: 200 OK</span>
                              </div>
                              <div className="mt-2.5 overflow-x-auto py-1 text-zinc-100 font-mono">
                                <span className="text-zinc-500 mr-2">&gt;</span>
                                <span className="text-[#d4ff3f]">{tc.code}</span>
                              </div>
                              {tc.result && (
                                <div className="mt-2.5 text-xs text-zinc-300 border-t border-white/10 pt-2 flex items-start gap-2">
                                  <span className="text-zinc-500 shrink-0 font-bold">↳ Result:</span>
                                  <span className="text-emerald-300 font-semibold">{tc.result}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Visual Generated Artifact (Doctor Schedule / WhatsApp Mockup) */}
                    {currentStep.image && (
                      <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0e0e0c] p-5 text-zinc-100 shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#d4ff3f] flex items-center gap-1.5">
                              <span className="size-2 rounded-full bg-[#d4ff3f] animate-pulse" />
                              Real-Time Execution Artifact
                            </span>
                            <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-zinc-300">
                              [{currentStep.timestamp}]
                            </span>
                          </div>

                          <div className="relative mt-4 w-full aspect-[16/10] bg-black/60 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                            <Image
                              src={currentStep.image}
                              alt={currentStep.imageAlt || currentStep.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 450px"
                              className="object-contain p-1"
                              priority
                            />
                          </div>
                        </div>

                        <p className="mt-3 font-mono text-xs text-zinc-300 text-center border-t border-white/10 pt-2.5">
                          {currentStep.imageCaption}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Agent Speaks Output with Visual Artifact */}
                {currentStep.type === "agent" && (
                  <div className="grid gap-6 lg:grid-cols-12 items-stretch">
                    {/* Speech Box */}
                    <div
                      className={`rounded-2xl border border-emerald-500/20 bg-emerald-50/60 p-6 sm:p-8 flex flex-col justify-between ${
                        currentStep.image ? "lg:col-span-7" : "lg:col-span-12"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-900 uppercase tracking-wider">
                            <span className="size-2 rounded-full bg-emerald-600 animate-ping" />
                            <span>Vozon Voice Agent Speaks</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-700">
                            <span className="inline-block size-1.5 rounded-full bg-emerald-600" />
                            <span>Streaming TTS (24kHz HD)</span>
                          </div>
                        </div>
                        <blockquote className="mt-4 font-display text-xl sm:text-2xl font-bold text-emerald-950 leading-relaxed">
                          &ldquo;{currentStep.text}&rdquo;
                        </blockquote>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-emerald-800 border-t border-emerald-200/80 pt-4">
                        <span>Total Turnaround: &lt;450ms</span>
                        <span>•</span>
                        <span>Natural Barge-in: Enabled</span>
                        <span>•</span>
                        <span>Emotion: Calm &amp; Helpful</span>
                      </div>
                    </div>

                    {/* WhatsApp Delivered Confirmation Mockup on Step 6 */}
                    {currentStep.image && (
                      <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0e0e0c] p-5 text-zinc-100 shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#d4ff3f] flex items-center gap-1.5">
                              <span className="size-2 rounded-full bg-[#d4ff3f] animate-pulse" />
                              WhatsApp Delivery Verified
                            </span>
                            <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400">
                              ● Delivered
                            </span>
                          </div>

                          <div className="relative mt-4 w-full aspect-[16/10] bg-black/60 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                            <Image
                              src={currentStep.image}
                              alt={currentStep.imageAlt || currentStep.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 450px"
                              className="object-contain p-1"
                              priority
                            />
                          </div>
                        </div>

                        <p className="mt-3 font-mono text-xs text-zinc-300 text-center border-t border-white/10 pt-2.5">
                          {currentStep.imageCaption}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step Navigation Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
                <button
                  type="button"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 sm:px-4 py-2 font-display text-xs font-semibold text-ink shadow-xs transition-colors ${
                    activeStepIndex === 0
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:border-ink cursor-pointer"
                  }`}
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Previous Second</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                <div className="font-mono text-xs text-muted">
                  Step {activeStepIndex + 1} of {scenarioSteps.length}
                </div>

                <button
                  type="button"
                  disabled={activeStepIndex === scenarioSteps.length - 1}
                  onClick={() =>
                    setActiveStepIndex((prev) => Math.min(scenarioSteps.length - 1, prev + 1))
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 sm:px-4 py-2 font-display text-xs font-semibold text-ink shadow-xs transition-colors ${
                    activeStepIndex === scenarioSteps.length - 1
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:border-ink cursor-pointer"
                  }`}
                >
                  <span className="hidden sm:inline">Next Second</span>
                  <span className="sm:hidden">Next</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODE 2: SEQUENCE FLOWCHART (USER'S DIAGRAM & ARTIFACTS)
            ======================================================== */}
        {viewMode === "flowchart" && (
          <div className="mt-12 mx-auto max-w-6xl space-y-8">
            {/* Top Card: User-Provided 3-Lane Architecture Diagram */}
            <div className="rounded-3xl border border-white/10 bg-[#0e0e0c] p-6 sm:p-10 shadow-2xl text-zinc-100">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="eyebrow text-[#d4ff3f] font-semibold tracking-wider">
                    3-Lane Cognitive Sequence
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                    Caller vs. Agent Brain vs. Agent Speaks
                  </h3>
                </div>

                {/* Color Legend matching uploaded diagram */}
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="size-2.5 rounded-full bg-zinc-500" />
                    <span>Caller</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-300">
                    <span className="size-2.5 rounded-full bg-purple-600" />
                    <span>Thinking &amp; Speaking</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-teal-300">
                    <span className="size-2.5 rounded-full bg-teal-600" />
                    <span>Tool Calls</span>
                  </span>
                </div>
              </div>

              {/* Uploaded Sequence Diagram Image */}
              <div className="relative mt-6 w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[560px] bg-black/60 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
                <Image
                  src="/images/scenario/agentic-in-action-timeline.png"
                  alt="Agentic in Action 3-lane sequence flowchart: Caller vs Agent Brain vs Agent Speaks"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  className="object-contain p-2"
                  priority
                />
              </div>

              <p className="mt-4 text-center font-mono text-xs text-zinc-400">
                Gray: Caller input • Purple: Agent reasoning and voice output • Teal: Real-time autonomous tool calls.
              </p>
            </div>

            {/* Generated Real-World Artifacts: WhatsApp Message & Doctor Calendar Side-by-Side */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Doctor Schedule Live Query */}
              <div className="rounded-3xl border border-white/10 bg-[#0e0e0c] p-6 text-zinc-100 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#d4ff3f] flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#d4ff3f] animate-pulse" />
                      Live Calendar Query Result
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">[00:03]</span>
                  </div>

                  <div className="relative mt-4 w-full aspect-[16/10] bg-black/60 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                    <Image
                      src="/images/scenario/doctor-schedule-calendar.jpg"
                      alt="Doctor Schedule Availability Calendar"
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-contain p-2"
                      priority
                    />
                  </div>
                </div>

                <div className="mt-4 font-mono text-xs text-zinc-300 border-t border-white/10 pt-3">
                  <p className="font-bold text-white">Tool: execute_tool(&apos;check_doctor_schedule&apos;)</p>
                  <p className="text-emerald-400 mt-1">↳ Result: 5:30 PM &amp; 6:15 PM openings identified</p>
                </div>
              </div>

              {/* WhatsApp Message & Location Card */}
              <div className="rounded-3xl border border-white/10 bg-[#0e0e0c] p-6 text-zinc-100 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#d4ff3f] flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#d4ff3f] animate-pulse" />
                      WhatsApp Location &amp; Confirmation
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">[00:11 - 00:13]</span>
                  </div>

                  <div className="relative mt-4 w-full aspect-[16/10] bg-black/60 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                    <Image
                      src="/images/scenario/whatsapp-clinic-confirmation.jpg"
                      alt="WhatsApp message and clinic location map"
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-contain p-2"
                      priority
                    />
                  </div>
                </div>

                <div className="mt-4 font-mono text-xs text-zinc-300 border-t border-white/10 pt-3">
                  <p className="font-bold text-white">Tool: execute_tool(&apos;send_whatsapp_location&apos;)</p>
                  <p className="text-emerald-400 mt-1">↳ Result: Verified clinic map delivered to caller&apos;s phone</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODE 3: FULL CALL TELEMETRY LOG (ALL 60-SEC EVENTS)
            ======================================================== */}
        {viewMode === "full" && (
          <div className="mt-12 mx-auto max-w-5xl space-y-6">
            {scenarioSteps.map((step) => (
              <div
                key={step.id}
                className="rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-xs"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-xl bg-ink text-[#d4ff3f] font-mono text-xs font-bold">
                      {step.timestamp}
                    </span>
                    <span className="font-display text-base font-bold text-ink">
                      {step.speaker || step.title}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10.5px] font-bold uppercase ${
                      step.type === "caller"
                        ? "bg-rose-100 text-rose-800"
                        : step.type === "brain"
                        ? "bg-[#0e0e0c] text-[#d4ff3f]"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {step.type}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-4">
                  {step.text && (
                    <p
                      className={`text-sm sm:text-base leading-relaxed ${
                        step.type === "agent"
                          ? "font-bold text-emerald-950"
                          : "font-medium text-ink"
                      }`}
                    >
                      &ldquo;{step.text}&rdquo;
                    </p>
                  )}

                  {step.brainData && (
                    <div className="rounded-2xl border border-white/10 bg-[#0e0e0c] p-5 text-zinc-100 space-y-3 font-mono text-xs">
                      {step.brainData.goal && (
                        <p className="text-zinc-300">
                          <span className="text-zinc-500">- Goal:</span> {step.brainData.goal}
                        </p>
                      )}
                      {step.brainData.toolCalls.map((tc, tIdx) => (
                        <div key={tIdx} className="space-y-1">
                          <p className="text-[#d4ff3f] font-bold">
                            - {tc.name}: <span className="font-normal text-white">{tc.code}</span>
                          </p>
                          {tc.result && (
                            <p className="text-emerald-400 pl-4">
                              - Result: {tc.result}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Visual Artifact in Log View if present */}
                  {step.image && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-[#0e0e0c] p-4 text-zinc-100">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#d4ff3f] block mb-2">
                        Artifact Generated at [{step.timestamp}]:
                      </span>
                      <div className="relative w-full aspect-[16/9] max-w-md bg-black/60 rounded-xl overflow-hidden border border-white/5">
                        <Image
                          src={step.image}
                          alt={step.imageAlt || step.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-contain p-2"
                        />
                      </div>
                      <p className="mt-2 font-mono text-[11px] text-zinc-400">
                        {step.imageCaption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Bottom Proof Strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="rounded-2xl border border-line bg-paper p-3.5 sm:p-4">
            <span className="font-display text-lg sm:text-2xl font-bold text-cobalt truncate block">&lt;500ms</span>
            <span className="block font-mono text-[10px] sm:text-[11px] text-muted mt-0.5">End-to-End Latency</span>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-3.5 sm:p-4">
            <span className="font-display text-lg sm:text-2xl font-bold text-cobalt truncate block">100%</span>
            <span className="block font-mono text-[10px] sm:text-[11px] text-muted mt-0.5">Real-Time Tool Execution</span>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-3.5 sm:p-4">
            <span className="font-display text-lg sm:text-2xl font-bold text-cobalt truncate block">Multi-Tool</span>
            <span className="block font-mono text-[10px] sm:text-[11px] text-muted mt-0.5">Parallel API Planning</span>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-3.5 sm:p-4">
            <span className="font-display text-lg sm:text-2xl font-bold text-cobalt truncate block">Omnichannel</span>
            <span className="block font-mono text-[10px] sm:text-[11px] text-muted mt-0.5">WhatsApp + CRM Sync</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default AgenticInActionSection;
