"use client";

import { useState } from "react";

const views = [
  {
    id: "launch",
    label: "Launch control",
    eyebrow: "Launch readiness",
    title: "Everything required to go live",
    description: "Complete the core white-label setup before inviting your first customer.",
    items: ["Brand published", "Custom domain active", "Customer plan published"],
    status: "3 of 3 ready",
  },
  {
    id: "brand",
    label: "Brand",
    eyebrow: "Customer-facing brand",
    title: "Your identity on every workspace",
    description: "Control the product identity your customers see across the platform.",
    items: ["Product name, logo and icon", "Colours and default theme", "Support, legal and email details"],
    status: "Published",
  },
  {
    id: "domains",
    label: "Domains",
    eyebrow: "Branded destinations",
    title: "Connect domains your customers trust",
    description: "Configure branded destinations with guided ownership and routing checks.",
    items: ["Customer application domain", "Public links domain", "DNS ownership and TLS verification"],
    status: "Verified",
  },
  {
    id: "plans",
    label: "Pricing plans",
    eyebrow: "Commercial control",
    title: "Package the service your way",
    description: "Create customer plans within your partner contract and publish stable versions.",
    items: ["Recurring price, trial and setup fee", "Included minutes and usage pricing", "Features, model access and account limits"],
    status: "Plan published",
  },
  {
    id: "customers",
    label: "Customers",
    eyebrow: "Customer ownership",
    title: "Provision isolated client workspaces",
    description: "Give every customer a secure organisation with the right brand and plan.",
    items: ["Dedicated customer organisation", "Owner activation and branded access", "Plan snapshot and subscription state"],
    status: "Active",
  },
  {
    id: "billing",
    label: "Billing",
    eyebrow: "Partner economics",
    title: "Keep the commercial picture clear",
    description: "Review the operating numbers behind your white-label voice AI service.",
    items: ["Recurring revenue projection", "Customer usage and wholesale cost", "Partner contribution and invoices"],
    status: "Current",
  },
] as const;

function CheckIcon() {
  return (
    <svg className="size-3" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m5 10.2 3.1 3.1L15.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PartnerConsolePreview() {
  const [activeId, setActiveId] = useState<(typeof views)[number]["id"]>("launch");
  const activeView = views.find((view) => view.id === activeId) ?? views[0];

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="relative overflow-hidden rounded-[28px] border border-[#cfe2dd] bg-[#118778] p-[3px] shadow-[0_28px_70px_rgba(17,135,120,.14)]">
        <div className="rounded-[25px] bg-white p-3 sm:p-4">
          <div className="rounded-[21px] border border-[#dce7e3] bg-[#f7faf9] p-3 text-[#18312a] sm:p-4">
            <div className="flex items-center justify-between border-b border-[#dce7e3] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-[#173e35] text-xs font-black text-white">YB</span>
                <div><strong className="block text-xs">YourBrand AI</strong><span className="block text-[9px] text-slate-500">Partner control centre</span></div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-bold text-emerald-700">Live</span>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:hidden">
              {views.map((view) => (
                <button
                  className={`shrink-0 rounded-full border px-3 py-2 text-[9px] font-semibold transition ${activeId === view.id ? "border-teal-200 bg-[#e8f5f1] text-teal-800" : "border-[#dce7e3] bg-white text-slate-500"}`}
                  key={view.id}
                  onClick={() => setActiveId(view.id)}
                  type="button"
                >
                  {view.label}
                </button>
              ))}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-[.36fr_.64fr]">
              <nav aria-label="Partner console preview" className="hidden rounded-xl border border-[#dce7e3] bg-white p-3 sm:block">
                {views.map((view) => (
                  <button
                    aria-pressed={activeId === view.id}
                    className={`mb-1.5 block w-full rounded-lg px-3 py-2 text-left text-[9px] font-semibold transition last:mb-0 ${activeId === view.id ? "bg-[#e8f5f1] text-teal-800" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                    key={view.id}
                    onClick={() => setActiveId(view.id)}
                    type="button"
                  >
                    {view.label}
                  </button>
                ))}
              </nav>

              <div className="rounded-xl border border-[#dce7e3] bg-white p-4" aria-live="polite">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-[.15em] text-teal-700">{activeView.eyebrow}</span>
                    <h2 className="mt-2 text-sm font-semibold leading-5 tracking-[-.02em] text-[#18312a]">{activeView.title}</h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-700">{activeView.status}</span>
                </div>
                <p className="mt-2 text-[10px] leading-4 text-slate-500">{activeView.description}</p>
                <div className="mt-4 space-y-2">
                  {activeView.items.map((item) => (
                    <div className="flex items-center gap-2 rounded-lg border border-[#edf2f0] bg-[#fbfdfc] px-2.5 py-2 text-[9px] font-medium text-slate-600" key={item}>
                      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-teal-100 text-teal-700"><CheckIcon /></span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
