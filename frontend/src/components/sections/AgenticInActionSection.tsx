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
    <section id="agentic-in-action" aria-labelledby="scenario-title" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-semibold mb-3">
            <span className="size-2 rounded-full bg-[#9F3DA8]" />
            Real-World Scenario Breakdown
          </span>

          <h2 id="scenario-title" className="zippee-title-underline text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1D1D1F] tracking-tight mt-2">
            &ldquo;Agentic in <span className="text-[#9F3DA8]">Action</span>&rdquo;
          </h2>

          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            Show your enterprise prospects what happens inside the agent&apos;s brain during a 60-second call. Witness real-time reasoning, dynamic constraints, live database queries, and instant WhatsApp location dispatch.
          </p>

          {/* View Mode Toggle */}
          <div className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/90 p-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("walkthrough")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "walkthrough" ? "bg-[#9F3DA8] text-white shadow-xs" : "text-gray-700 hover:text-[#9F3DA8]"
              }`}
              aria-pressed={viewMode === "walkthrough"}
            >
              <span>✦</span>
              <span>Step-by-Step Replay</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("flowchart")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "flowchart" ? "bg-[#9F3DA8] text-white shadow-xs" : "text-gray-700 hover:text-[#9F3DA8]"
              }`}
              aria-pressed={viewMode === "flowchart"}
            >
              <span>⇄</span>
              <span>Sequence Flowchart</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("full")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "full" ? "bg-[#9F3DA8] text-white shadow-xs" : "text-gray-700 hover:text-[#9F3DA8]"
              }`}
              aria-pressed={viewMode === "full"}
            >
              <span>☰</span>
              <span>Full Telemetry Log</span>
            </button>
          </div>
        </div>

        {/* MODE 1: STEP-BY-STEP REPLAY */}
        {viewMode === "walkthrough" && (
          <div className="mt-12 space-y-6">
            {/* Stepper Progress Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {scenarioSteps.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className={`zippee-pill font-mono text-xs cursor-pointer ${
                      isActive ? "zippee-pill-active" : ""
                    }`}
                  >
                    <span>[{step.timestamp}]</span>
                    <span className="font-bold">
                      {step.type === "caller" ? "Caller" : step.type === "brain" ? "Brain" : "Agent"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main Inspection Stage */}
            <div className="zippee-card p-6 sm:p-10 shadow-xl border border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="size-8 rounded-lg bg-[#9F3DA8] text-white font-mono text-xs font-bold grid place-items-center">
                    {currentStep.timestamp}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1F]">{currentStep.title}</h3>
                    <p className="text-xs text-gray-500 font-mono">Elapsed: {currentStep.seconds}s of call session</p>
                  </div>
                </div>
                <span className="zippee-pill bg-purple-50 text-purple-900 border-purple-200 font-bold">
                  {currentStep.type === "caller" ? "Inbound Audio" : currentStep.type === "brain" ? "Autonomous Telemetry" : "Synthesized Output"}
                </span>
              </div>

              {/* Event Body */}
              <div className="mt-6">
                {currentStep.type === "caller" && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-6 space-y-3">
                    <span className="zippee-pill text-xs font-mono font-bold bg-white text-gray-700">Caller Voice Input</span>
                    <blockquote className="text-lg font-bold text-[#1D1D1F]">
                      &ldquo;{currentStep.text}&rdquo;
                    </blockquote>
                    <div className="flex flex-wrap gap-3 font-mono text-xs text-gray-400 pt-2 border-t border-gray-200/60">
                      <span>STT Latency: ~140ms</span>
                      <span>•</span>
                      <span>Audio VAD: Active</span>
                      <span>•</span>
                      <span>Language: English (Indic Accent)</span>
                    </div>
                  </div>
                )}

                {currentStep.type === "brain" && currentStep.brainData && (
                  <div className="grid gap-6 lg:grid-cols-12 items-start">
                    <div className="lg:col-span-7 zippee-dark-card p-6 space-y-4 shadow-xl">
                      <div className="flex justify-between items-center border-b border-white/10 pb-3 font-mono text-xs">
                        <span className="text-[#c084fc] font-bold">✦ {currentStep.brainData.stepType}</span>
                        <span className="text-emerald-400">Cognitive Latency: &lt;180ms</span>
                      </div>

                      {currentStep.brainData.goal && (
                        <div>
                          <span className="text-[11px] font-mono uppercase text-gray-400 block mb-1">Extracted Goal:</span>
                          <p className="text-xs text-purple-200 font-mono">{currentStep.brainData.goal}</p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <span className="text-[11px] font-mono uppercase text-gray-400 block">Live Tool Execution:</span>
                        {currentStep.brainData.toolCalls.map((tc, tIdx) => (
                          <div key={tIdx} className="rounded-xl bg-black/60 p-3 font-mono text-xs border border-white/10 space-y-1">
                            <div className="flex justify-between text-purple-300 font-bold">
                              <span>{tc.name}</span>
                              <span className="text-emerald-400">● 200 OK</span>
                            </div>
                            <p className="text-gray-300 font-semibold">{tc.code}</p>
                            {tc.result && <p className="text-emerald-300 text-[11px]">↳ {tc.result}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {currentStep.image && (
                      <div className="lg:col-span-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-white shadow-sm mb-3">
                          <Image
                            src={currentStep.image}
                            alt={currentStep.imageAlt || currentStep.title}
                            fill
                            className="object-contain p-2"
                            priority
                          />
                        </div>
                        <p className="text-xs text-gray-500 italic text-center">{currentStep.imageCaption}</p>
                      </div>
                    )}
                  </div>
                )}

                {currentStep.type === "agent" && (
                  <div className="grid gap-6 lg:grid-cols-12 items-center">
                    <div className="lg:col-span-7 rounded-2xl border border-purple-200 bg-[#FDF4FF] p-6 space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-[#9F3DA8] font-bold">Vozon Voice Agent Speaks</span>
                        <span className="text-purple-600 font-bold">Streaming TTS (24kHz HD)</span>
                      </div>
                      <blockquote className="text-lg font-bold text-purple-950">
                        &ldquo;{currentStep.text}&rdquo;
                      </blockquote>
                      <div className="flex flex-wrap gap-3 font-mono text-xs text-purple-800/70 pt-2 border-t border-purple-200/50">
                        <span>Turnaround: &lt;450ms</span>
                        <span>•</span>
                        <span>Barge-in: Enabled</span>
                        <span>•</span>
                        <span>Tone: Helpful</span>
                      </div>
                    </div>

                    {currentStep.image && (
                      <div className="lg:col-span-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-white shadow-sm mb-3">
                          <Image
                            src={currentStep.image}
                            alt={currentStep.imageAlt || currentStep.title}
                            fill
                            className="object-contain p-2"
                            priority
                          />
                        </div>
                        <p className="text-xs text-gray-500 italic text-center">{currentStep.imageCaption}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step Navigation Controls */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="zippee-btn-secondary text-xs px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Previous Second
                </button>
                <span className="font-mono text-xs text-gray-500 font-bold">
                  Step {activeStepIndex + 1} of {scenarioSteps.length}
                </span>
                <button
                  type="button"
                  disabled={activeStepIndex === scenarioSteps.length - 1}
                  onClick={() => setActiveStepIndex((prev) => Math.min(scenarioSteps.length - 1, prev + 1))}
                  className="zippee-btn-primary text-xs px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next Second →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: SEQUENCE FLOWCHART */}
        {viewMode === "flowchart" && (
          <div className="mt-12 space-y-8">
            <div className="zippee-card p-6 sm:p-10 shadow-xl border border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
                <div>
                  <span className="zippee-pill bg-purple-50 text-purple-900 font-bold text-xs">3-Lane Cognitive Sequence</span>
                  <h3 className="text-xl font-bold text-[#1D1D1F] mt-1">Caller vs. Agent Brain vs. Agent Speaks</h3>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-gray-400" /> Caller</span>
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#9F3DA8]" /> Thinking</span>
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500" /> Tool Calls</span>
                </div>
              </div>

              <div className="relative aspect-2/1 w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                <Image
                  src="/images/scenario/agentic-in-action-timeline.png"
                  alt="Agentic in Action 3-lane sequence flowchart: Caller vs Agent Brain vs Agent Speaks"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  priority
                />
              </div>
              <p className="mt-4 text-xs text-gray-500 text-center italic">
                Gray: Caller input • Purple: Agent reasoning and voice output • Emerald: Real-time autonomous tool calls.
              </p>
            </div>

            {/* Generated Artifacts Side-by-Side */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="zippee-card p-5">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3">
                  <Image src="/images/scenario/doctor-schedule-calendar.jpg" alt="Doctor Schedule Availability Calendar" fill className="object-contain" priority />
                </div>
                <p className="font-mono text-xs font-bold text-[#9F3DA8]">Tool: execute_tool(&apos;check_doctor_schedule&apos;)</p>
                <p className="text-xs text-gray-500 mt-1">↳ Result: 5:30 PM &amp; 6:15 PM openings identified</p>
              </div>

              <div className="zippee-card p-5">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3">
                  <Image src="/images/scenario/whatsapp-clinic-confirmation.jpg" alt="WhatsApp message and clinic location map" fill className="object-contain" priority />
                </div>
                <p className="font-mono text-xs font-bold text-emerald-600">Tool: execute_tool(&apos;send_whatsapp_location&apos;)</p>
                <p className="text-xs text-gray-500 mt-1">↳ Result: Verified clinic map delivered to caller&apos;s phone</p>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: FULL LOG */}
        {viewMode === "full" && (
          <div className="mt-12 space-y-4">
            {scenarioSteps.map((step) => (
              <div key={step.id} className="zippee-card p-5 space-y-2">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-xs font-mono">
                  <span className="font-bold text-[#9F3DA8]">[{step.timestamp}] {step.speaker || step.title}</span>
                  <span className="zippee-pill text-[10px] uppercase font-bold">{step.type}</span>
                </div>
                {step.text && <p className="text-sm font-semibold text-[#1D1D1F]">&ldquo;{step.text}&rdquo;</p>}
                {step.brainData && (
                  <div className="text-xs font-mono space-y-1 text-purple-900">
                    {step.brainData.goal && <p>- Goal: {step.brainData.goal}</p>}
                    {step.brainData.toolCalls.map((tc, tIdx) => (
                      <p key={tIdx}>- {tc.name}: {tc.code} {tc.result && `-> ${tc.result}`}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Proof Strip */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 pt-10 border-t border-gray-100">
          <div className="zippee-card p-4 text-center">
            <span className="text-2xl font-black text-[#9F3DA8] block">&lt;500ms</span>
            <span className="text-xs text-gray-500 font-semibold">End-to-End Latency</span>
          </div>
          <div className="zippee-card p-4 text-center">
            <span className="text-2xl font-black text-[#9F3DA8] block">100%</span>
            <span className="text-xs text-gray-500 font-semibold">Real-Time Tool Execution</span>
          </div>
          <div className="zippee-card p-4 text-center">
            <span className="text-2xl font-black text-[#9F3DA8] block">Multi-Tool</span>
            <span className="text-xs text-gray-500 font-semibold">Parallel API Planning</span>
          </div>
          <div className="zippee-card p-4 text-center">
            <span className="text-2xl font-black text-[#9F3DA8] block">Omnichannel</span>
            <span className="text-xs text-gray-500 font-semibold">WhatsApp + CRM Sync</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AgenticInActionSection;