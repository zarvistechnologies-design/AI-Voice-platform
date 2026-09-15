"use client";

import { useId, useState } from "react";

export type ConnectedOperation = {
  title: string;
  detail: string;
  workflow: string;
  status: string;
  agentTitle: string;
  agentDetail: string;
  steps: Array<{ title: string; detail: string }>;
  outcome: string;
  summary: string;
};

function OperationIcon({ index, className = "size-5" }: { index: number; className?: string }) {
  const paths = [
    <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18M8 14h3M8 17h7" /></>,
    <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
    <><path d="M18 16.5a4 4 0 0 1-6.5 3M6 7.5A4 4 0 0 1 12.5 4M8 19H5a3 3 0 0 1-2.6-4.5l4.5-8" /><path d="m14 13 4.5 7.5M10 11h9a3 3 0 0 0 2.6-4.5L20 4" /></>,
  ];
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">{paths[index % paths.length]}</svg>;
}

function Arrow() {
  return <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20"><path d="M3.5 10h13m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>;
}

function Check() {
  return <span className="grid size-5 shrink-0 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">&#10003;</span>;
}

export function ConnectedOperationsPanel({ title, summary, operations }: { title: string; summary: string; operations: ConnectedOperation[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId().replace(/:/g, "");
  const active = operations[activeIndex] ?? operations[0];

  if (!active) return null;

  return (
    <div className="grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700">Connected operations</p>
        <h2 className="mt-4 text-[clamp(2rem,2.8vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-slate-950">The call becomes part of your workflow.</h2>
        <p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-900">{summary}</p>
        <div className="mt-8 space-y-3" role="tablist" aria-label={`${title} connected operations`}>
          {operations.map((item, index) => {
            const selected = activeIndex === index;
            return (
              <button aria-controls={`${baseId}-panel`} aria-selected={selected} className={`group flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${selected ? "border-teal-400 shadow-[0_10px_28px_rgba(13,148,136,.12)]" : "border-slate-200 hover:border-teal-200 hover:shadow-lg"}`} id={`${baseId}-tab-${index}`} key={item.title} onClick={() => setActiveIndex(index)} role="tab" type="button">
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${selected ? "bg-teal-100 text-teal-800" : "bg-teal-50 text-teal-700"}`}><OperationIcon index={index} /></span>
                <span><span className="block text-sm font-semibold text-slate-950">{item.title}</span><span className="mt-1 block text-xs text-slate-700">{item.detail}</span></span>
                <span className="ml-auto text-teal-700"><Arrow /></span>
              </button>
            );
          })}
        </div>
      </div>

      <div aria-labelledby={`${baseId}-tab-${activeIndex}`} className="relative w-full max-w-[610px] justify-self-end overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,.09)] sm:p-6" id={`${baseId}-panel`} role="tabpanel">
        <div aria-hidden="true" className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(15,118,110,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,.055)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-slate-950">Live workflow</p><p className="mt-1 text-xs text-slate-500">{active.workflow}</p></div><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">{active.status}</span></div>
        <div className="relative mt-6 flex flex-col items-center">
          <div className="grid size-16 place-items-center rounded-full bg-teal-100 text-teal-800 shadow-[0_12px_30px_rgba(13,148,136,.14)] ring-6 ring-teal-50"><OperationIcon className="size-6" index={activeIndex} /></div>
          <p className="mt-3 text-sm font-bold text-slate-950">{active.agentTitle}</p>
          <p className="mt-1 max-w-md text-center text-xs text-slate-500">{active.agentDetail}</p>
          <div className="my-3 h-6 w-px bg-gradient-to-b from-teal-300 to-teal-100" />
          <div className="grid w-full gap-3 sm:grid-cols-3">{active.steps.slice(0, 3).map((step, index) => <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm" key={`${step.title}-${index}`}><span className="mx-auto grid size-8 place-items-center rounded-lg bg-teal-50 text-teal-700"><OperationIcon className="size-4" index={index} /></span><p className="mt-2 text-xs font-bold text-slate-800">{step.title}</p><p className="mt-0.5 text-[10px] text-slate-500">{step.detail}</p></div>)}</div>
          <div className="mt-4 w-full rounded-xl border border-teal-100 bg-teal-50/80 p-3.5"><div className="flex items-center gap-3"><Check /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3 text-xs"><strong className="text-slate-800">{active.outcome}</strong><span className="text-slate-500">Just now</span></div><p className="mt-1 truncate text-xs text-slate-600">{active.summary}</p></div></div></div>
        </div>
      </div>
    </div>
  );
}
