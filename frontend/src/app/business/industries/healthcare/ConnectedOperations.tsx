"use client";

import { useState } from "react";

type IconName = "calendar" | "database" | "webhook" | "phone" | "person" | "note" | "bell";

const operations = [
  {
    icon: "calendar" as const,
    title: "Scheduling",
    detail: "Availability and bookings",
    workflow: "Appointment reschedule",
    status: "Completed",
    agentTitle: "Scheduling assistant",
    agentDetail: "Availability + approved booking rules",
    steps: [
      { icon: "calendar" as const, title: "Availability", detail: "Checked" },
      { icon: "note" as const, title: "Booking", detail: "Updated" },
      { icon: "bell" as const, title: "Confirmation", detail: "Queued" },
    ],
    outcome: "Appointment moved",
    summary: "New slot saved · patient confirmation queued · team notified",
  },
  {
    icon: "database" as const,
    title: "Patient systems",
    detail: "Permissioned records",
    workflow: "Patient record update",
    status: "Synced",
    agentTitle: "Patient system connection",
    agentDetail: "Approved context + structured write-back",
    steps: [
      { icon: "person" as const, title: "Identity", detail: "Matched" },
      { icon: "database" as const, title: "Record", detail: "Permissioned" },
      { icon: "note" as const, title: "Call summary", detail: "Added" },
    ],
    outcome: "Record updated",
    summary: "Patient matched · approved fields updated · call notes attached",
  },
  {
    icon: "webhook" as const,
    title: "Workflow tools",
    detail: "Webhooks and follow-ups",
    workflow: "Post-call automation",
    status: "Triggered",
    agentTitle: "Workflow orchestration",
    agentDetail: "Call outcome + configured follow-up actions",
    steps: [
      { icon: "webhook" as const, title: "Webhook", detail: "Sent" },
      { icon: "note" as const, title: "Task", detail: "Created" },
      { icon: "bell" as const, title: "Follow-up", detail: "Scheduled" },
    ],
    outcome: "Workflow started",
    summary: "Webhook delivered · follow-up task created · owner notified",
  },
];

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18M8 14h3M8 17h7" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
    webhook: <><path d="M18 16.5a4 4 0 0 1-6.5 3M6 7.5A4 4 0 0 1 12.5 4M8 19H5a3 3 0 0 1-2.6-4.5l4.5-8" /><path d="m14 13 4.5 7.5M10 11h9a3 3 0 0 0 2.6-4.5L20 4" /></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" />,
    person: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    note: <><path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M8 13h8M8 17h6" /></>,
    bell: <><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 22h4" /></>,
  };
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">{paths[name]}</svg>;
}

function Arrow() {
  return <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20"><path d="M3.5 10h13m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>;
}

function Check() {
  return <span className="grid size-5 shrink-0 place-items-center rounded-full bg-teal-100 text-teal-800"><svg aria-hidden="true" className="size-3" fill="none" viewBox="0 0 12 12"><path d="m2.5 6 2.1 2.1L9.5 3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></svg></span>;
}

export function ConnectedOperations() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = operations[activeIndex];

  return (
    <div className="grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700">Connected operations</p>
        <h2 className="mt-4 text-[clamp(2rem,2.8vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-slate-950">The call becomes part of your workflow.</h2>
        <p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-900">With the right permissions, call outcomes can move into scheduling, patient, and operational tools—without another round of manual entry.</p>
        <div className="mt-8 space-y-3" role="tablist" aria-label="Connected operations">
          {operations.map((item, index) => {
            const selected = activeIndex === index;
            return (
              <button
                aria-controls="connected-operation-panel"
                aria-selected={selected}
                className={`group flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${selected ? "border-teal-400 shadow-[0_10px_28px_rgba(13,148,136,.12)]" : "border-slate-200 hover:border-teal-200 hover:shadow-lg"}`}
                id={`connected-operation-${index}`}
                key={item.title}
                onClick={() => setActiveIndex(index)}
                role="tab"
                type="button"
              >
                <span className={`grid size-11 place-items-center rounded-xl ${selected ? "bg-teal-100 text-teal-800" : "bg-teal-50 text-teal-700"}`}><Icon name={item.icon} /></span>
                <span><span className="block text-sm font-semibold text-slate-950">{item.title}</span><span className="mt-1 block text-xs text-slate-700">{item.detail}</span></span>
                <span className={`ml-auto ${selected ? "text-teal-700" : "text-teal-600"}`}><Arrow /></span>
              </button>
            );
          })}
        </div>
      </div>

      <div aria-labelledby={`connected-operation-${activeIndex}`} className="relative w-full max-w-[610px] justify-self-end rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,.09)] sm:p-6" id="connected-operation-panel" role="tabpanel">
        <div className="absolute inset-0 overflow-hidden rounded-[26px]"><div className="healthcare-grid absolute inset-0 opacity-25" /></div>
        <div className="relative flex items-center justify-between gap-4">
          <div><p className="text-sm font-semibold text-slate-950">Live workflow</p><p className="mt-1 text-xs text-slate-500">{active.workflow}</p></div>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">{active.status}</span>
        </div>
        <div className="relative mt-6 flex flex-col items-center">
          <div className="grid size-16 place-items-center rounded-full bg-teal-100 text-teal-800 shadow-[0_12px_30px_rgba(13,148,136,.14)] ring-6 ring-teal-50"><Icon name={active.icon === "webhook" ? "webhook" : active.icon === "database" ? "database" : "phone"} className="size-6" /></div>
          <p className="mt-3 text-sm font-bold text-slate-950">{active.agentTitle}</p>
          <p className="mt-1 text-center text-xs text-slate-500">{active.agentDetail}</p>
          <div className="my-3 h-6 w-px bg-gradient-to-b from-teal-300 to-teal-100" />
          <div className="grid w-full gap-3 sm:grid-cols-3">
            {active.steps.map((step) => <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm" key={step.title}><span className="mx-auto grid size-8 place-items-center rounded-lg bg-teal-50 text-teal-700"><Icon name={step.icon} className="size-4" /></span><p className="mt-2 text-xs font-bold text-slate-800">{step.title}</p><p className="mt-0.5 text-[10px] text-slate-500">{step.detail}</p></div>)}
          </div>
          <div className="mt-4 w-full rounded-xl border border-teal-100 bg-teal-50/80 p-3.5">
            <div className="flex items-center gap-3"><Check /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3 text-xs"><strong className="text-slate-800">{active.outcome}</strong><span className="text-slate-500">Just now</span></div><p className="mt-1 truncate text-xs text-slate-600">{active.summary}</p></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
