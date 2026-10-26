"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { IntegrationProvider } from "@/lib/integrations";

type RequestedIntegration = {
  name: string;
  category: string;
  use: string;
  nativeId?: "google_calendar" | "google_sheets" | "slack";
  webhook?: boolean;
};

const requestedIntegrations: RequestedIntegration[] = [
  { name: "Atlassian", category: "Work management", use: "Projects and collaboration" },
  { name: "Razorpay API", category: "Payments", use: "Merchant payment actions" },
  { name: "Zapier", category: "Automation", use: "Call event triggers", webhook: true },
  { name: "Zoho CRM", category: "CRM", use: "Lead and customer records" },
  { name: "Asana", category: "Work management", use: "Tasks and projects" },
  { name: "ClickUp", category: "Work management", use: "Tasks and projects" },
  { name: "Freshsales", category: "CRM", use: "Lead and contact records" },
  { name: "Google Calendar", category: "Scheduling", use: "Availability and appointments", nativeId: "google_calendar" },
  { name: "Google Docs", category: "Documents", use: "Document access" },
  { name: "Google Drive", category: "Documents", use: "File access" },
  { name: "Google Sheets", category: "Automation", use: "Call result export", nativeId: "google_sheets" },
  { name: "Gmail", category: "Messaging", use: "Email workflows" },
  { name: "Linear", category: "Work management", use: "Issues and projects" },
  { name: "monday.com", category: "Work management", use: "Boards and updates" },
  { name: "Notion", category: "Documents", use: "Pages and workspace knowledge" },
  { name: "Prospeo", category: "Sales", use: "Prospect data" },
  { name: "Razorpay OAuth", category: "Payments", use: "Merchant account authorization" },
  { name: "Salesforce", category: "CRM", use: "Lead and customer records" },
  { name: "Slack", category: "Messaging", use: "Call notifications", nativeId: "slack" },
  { name: "Jira", category: "Work management", use: "Issues and projects" },
];

function connectionState(entry: RequestedIntegration, providers: IntegrationProvider[]) {
  if (entry.nativeId) {
    const id = entry.nativeId === "slack" ? "slack" : "google";
    const connected = providers.some((provider) => provider.id === id && provider.connected);
    return {
      label: connected ? "Connected for listed use" : "Ready to connect",
      detail: entry.nativeId === "slack"
        ? "Existing Slack connection sends call notifications."
        : entry.nativeId === "google_sheets"
          ? "Existing Google connection exports call results to a selected sheet."
          : "Existing Google connection supports appointment actions for enabled agents.",
      href: `#integration-${entry.nativeId}`,
      action: connected ? "Manage" : "Connect",
      tone: connected ? "connected" : "ready",
    } as const;
  }
  if (entry.webhook) {
    return {
      label: "Webhook route available",
      detail: "Send signed call events to a Zapier webhook. Zapier account sign-in is not built in.",
      href: "/dashboard/developers",
      action: "View webhooks",
      tone: "ready",
    } as const;
  }
  return {
    label: "Not available yet",
    detail: "Provider authorization and actions still need to be built and tested.",
    href: "",
    action: "",
    tone: "pending",
  } as const;
}

export function RequestedIntegrationsSection({ providers }: { providers: IntegrationProvider[] }) {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const search = query.trim().toLowerCase();
    return search
      ? requestedIntegrations.filter((entry) => `${entry.name} ${entry.category} ${entry.use}`.toLowerCase().includes(search))
      : requestedIntegrations;
  }, [query]);

  return (
    <section id="requested-integrations" className="overflow-hidden rounded-2xl border border-[#dce8e4] bg-white shadow-[0_12px_36px_rgba(13,75,63,.06)]">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5eeea] bg-[#f7fbf9] p-5 sm:p-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#0e786b]">Provider directory</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Integrations you requested</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            All 20 are listed here. Three have limited native actions, Zapier can receive signed call events through webhooks, and the remaining 16 need a dedicated connection and action flow.
          </p>
        </div>
        <label className="w-full sm:w-64">
          <span className="sr-only">Search requested integrations</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search integrations"
            className="w-full rounded-xl border border-[#ccded7] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#0e786b] focus:ring-2 focus:ring-[#d8f1e9]"
          />
        </label>
      </div>
      <div className="divide-y divide-[#e9efec]">
        {matches.map((entry) => {
          const state = connectionState(entry, providers);
          return (
            <div key={entry.name} className="grid gap-3 px-5 py-4 transition hover:bg-[#f9fcfa] sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)_auto] sm:items-center sm:px-6">
              <div className="min-w-0">
                <p className="font-semibold text-slate-950">{entry.name}</p>
                <p className="text-xs text-slate-500">{entry.category} · {entry.use}</p>
              </div>
              <div className="min-w-0">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${state.tone === "connected" ? "bg-emerald-50 text-emerald-800" : state.tone === "ready" ? "bg-teal-50 text-teal-800" : "bg-slate-100 text-slate-600"}`}>
                  {state.label}
                </span>
                <p className="mt-1 text-xs leading-5 text-slate-600">{state.detail}</p>
              </div>
              {state.href ? (
                <Link href={state.href} className="w-fit rounded-lg border border-[#b8d9cf] px-3 py-2 text-xs font-semibold text-[#0e6f62] transition hover:bg-[#eff8f4]">
                  {state.action}
                </Link>
              ) : <span className="text-xs text-slate-400">—</span>}
            </div>
          );
        })}
        {!matches.length && <p className="px-6 py-8 text-center text-sm text-slate-500">No integrations match your search.</p>}
      </div>
    </section>
  );
}
