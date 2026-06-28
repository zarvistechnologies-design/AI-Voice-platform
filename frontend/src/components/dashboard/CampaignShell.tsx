"use client";

import { type DragEvent, type FormEvent, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import { voiceApi, type BackendAgent, type BackendPhoneNumber } from "@/lib/voice";

type IconName = "calendar" | "check" | "close" | "file" | "info" | "phone" | "play" | "shield" | "spark" | "upload" | "user";
type CampaignLead = {
  row: number;
  phone: string;
  name: string;
  email: string;
  company: string;
  customFields: Record<string, string>;
};
type SendMode = "now" | "schedule";

const maxCsvSize = 5 * 1024 * 1024;
const buttonClass =
  "app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 transition disabled:cursor-not-allowed disabled:opacity-50";
const controlClass =
  "app-control-text min-h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#00b8c4] focus:ring-4 focus:ring-[#00b8c4]/10";

function Icon({ icon, className = "size-4" }: { icon: IconName; className?: string }) {
  const props = {
    className: `${className} fill-none stroke-current stroke-2`,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  if (icon === "calendar") return <svg {...props}><path d="M7 3v4M17 3v4M4 9h16" /><rect x="4" y="5" width="16" height="16" rx="3" /></svg>;
  if (icon === "check") return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  if (icon === "close") return <svg {...props}><path d="M6 6 18 18M18 6 6 18" /></svg>;
  if (icon === "file") return <svg {...props}><path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M8 13h8M8 17h5" /></svg>;
  if (icon === "info") return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 10v6M12 7h.01" /></svg>;
  if (icon === "phone") return <svg {...props}><path d="M6.6 4.8 9 7.2a2 2 0 0 1 .4 2.2l-.8 1.7a12 12 0 0 0 5.3 5.3l1.7-.8a2 2 0 0 1 2.2.4l2.4 2.4a1.8 1.8 0 0 1-.2 2.7c-1 .7-2.2 1-3.6.8C9.4 20.7 3.3 14.6 2.1 7.6 1.9 6.2 2.2 5 2.9 4a1.8 1.8 0 0 1 2.7-.2Z" /></svg>;
  if (icon === "play") return <svg {...props}><path d="M8 5v14l11-7L8 5Z" /></svg>;
  if (icon === "shield") return <svg {...props}><path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" /><path d="m9 12 2 2 4-5" /></svg>;
  if (icon === "spark") return <svg {...props}><path d="m12 3 1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9L12 3Z" /></svg>;
  if (icon === "upload") return <svg {...props}><path d="M12 15V3m0 0 4 4m-4-4-4 4" /><path d="M4 17v3h16v-3" /></svg>;
  return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The request could not be completed.";
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function parseCsvRows(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "\"") {
      if (quoted && next === "\"") {
        cell += "\"";
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function parseCampaignCsv(text: string): CampaignLead[] {
  const rows = parseCsvRows(text);
  if (rows.length < 2) throw new Error("CSV needs a header row and at least one contact.");

  const rawHeaders = rows[0];
  const headers = rawHeaders.map(normalizeHeader);
  const phoneIndex = headers.findIndex((header) => ["phone", "phonenumber", "mobile", "mobilenumber", "number", "contact"].includes(header));
  if (phoneIndex < 0) throw new Error("CSV must include a phone or phone_number column.");

  const nameIndex = headers.findIndex((header) => ["name", "fullname", "customername", "leadname"].includes(header));
  const emailIndex = headers.findIndex((header) => ["email", "emailaddress"].includes(header));
  const companyIndex = headers.findIndex((header) => ["company", "business", "organization"].includes(header));

  return rows.slice(1).map((row, index) => {
    const customFields: Record<string, string> = {};
    rawHeaders.forEach((header, headerIndex) => {
      if ([phoneIndex, nameIndex, emailIndex, companyIndex].includes(headerIndex)) return;
      const value = row[headerIndex]?.trim();
      if (header && value) customFields[header.trim()] = value;
    });

    return {
      row: index + 2,
      phone: (row[phoneIndex] ?? "").replace(/[^\d+]/g, ""),
      name: nameIndex >= 0 ? row[nameIndex] ?? "" : "",
      email: emailIndex >= 0 ? row[emailIndex] ?? "" : "",
      company: companyIndex >= 0 ? row[companyIndex] ?? "" : "",
      customFields,
    };
  }).filter((lead) => lead.phone);
}

function isDialable(phone: string) {
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function phoneAgentId(number: BackendPhoneNumber | null) {
  return number?.agentId && typeof number.agentId === "object" ? number.agentId._id : "";
}

function metadataKey(value: string) {
  const key = value.trim().replace(/[^a-zA-Z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 70);
  if (!key) return "";
  return /^[a-zA-Z]/.test(key) ? key : `Field_${key}`;
}

function metadataValue(value: string) {
  return value.trim().slice(0, 500);
}

function plural(count: number, singular: string, pluralName = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralName}`;
}

export function CampaignShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [agents, setAgents] = useState<BackendAgent[]>([]);
  const [numbers, setNumbers] = useState<BackendPhoneNumber[]>([]);
  const [campaignName, setCampaignName] = useState("");
  const [selectedPhoneId, setSelectedPhoneId] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [sendMode, setSendMode] = useState<SendMode>("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [dailyLimit, setDailyLimit] = useState(250);
  const [concurrency, setConcurrency] = useState(3);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [retryGapHours, setRetryGapHours] = useState(24);
  const [windowStart, setWindowStart] = useState("10:00");
  const [windowEnd, setWindowEnd] = useState("18:00");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");
  const [respectDnc, setRespectDnc] = useState(true);
  const [detectVoicemail, setDetectVoicemail] = useState(true);
  const [requireConsentLine, setRequireConsentLine] = useState(true);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [leads, setLeads] = useState<CampaignLead[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/campaign");
      return;
    }

    let cancelled = false;
    void (async () => {
      const validatedSession = await validateStoredSession();
      if (!validatedSession) {
        if (!cancelled) router.replace("/login?next=/dashboard/campaign");
        return;
      }
      const [agentResult, numberResult] = await Promise.all([
        voiceApi.agents(),
        voiceApi.phoneNumbers(),
      ]);
      if (cancelled) return;
      const firstAgentId = agentResult.agents[0]?._id || "";
      const firstReadyCallerId = numberResult.numbers.find(
        (number) => number.direction !== "Inbound" && number.status === "Ready" && phoneAgentId(number) === firstAgentId,
      );
      const firstCallerId = firstReadyCallerId ?? numberResult.numbers.find((number) => number.direction !== "Inbound");
      setAgents(agentResult.agents);
      setNumbers(numberResult.numbers);
      setSelectedAgentId((current) => current || firstAgentId);
      setSelectedPhoneId((current) => current || firstCallerId?._id || "");
      setError("");
    })()
      .catch((caught) => {
        if (!cancelled) setError(errorMessage(caught));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [router, session]);

  const selectedAgent = useMemo(() => agents.find((agent) => agent._id === selectedAgentId) ?? null, [agents, selectedAgentId]);
  const selectedPhone = useMemo(() => numbers.find((number) => number._id === selectedPhoneId) ?? null, [numbers, selectedPhoneId]);
  const callableNumbers = numbers.filter((number) => number.direction !== "Inbound");
  const selectedPhoneReady = Boolean(
    selectedPhone
      && selectedPhone.status === "Ready"
      && selectedPhone.direction !== "Inbound"
      && phoneAgentId(selectedPhone) === selectedAgentId,
  );
  const normalizedDailyLimit = Math.max(1, Number.isFinite(dailyLimit) ? Math.floor(dailyLimit) : 1);
  const normalizedConcurrency = Math.max(1, Math.min(20, Number.isFinite(concurrency) ? Math.floor(concurrency) : 1));
  const invalidLeadCount = leads.filter((lead) => !isDialable(lead.phone)).length;
  const readyChecks = [
    { label: "Campaign name", ready: Boolean(campaignName.trim()) },
    { label: "Ready caller ID assigned", ready: selectedPhoneReady },
    { label: "Assistant is Live", ready: selectedAgent?.status === "Live" },
    { label: "CSV contacts uploaded", ready: leads.length > 0 },
    { label: "All phone numbers E.164", ready: leads.length > 0 && invalidLeadCount === 0 },
    { label: "Compliance guardrails on", ready: respectDnc && requireConsentLine },
    { label: "Schedule selected", ready: sendMode === "now" || Boolean(scheduledAt) },
  ];
  const canPrepare = readyChecks.every((check) => check.ready);
  const completedReadyChecks = readyChecks.filter((check) => check.ready).length;
  const estimatedBatches = Math.max(1, Math.ceil(leads.length / normalizedDailyLimit));
  const previewLeads = leads.slice(0, 8);
  const campaignMetricTone = "border-[#99f6e8] bg-[#ecfeff] text-[#008996]";
  const campaignMetrics = [
    { label: "Audience", value: leads.length.toLocaleString("en-IN"), tone: campaignMetricTone },
    { label: "Ready checks", value: `${completedReadyChecks}/${readyChecks.length}`, tone: campaignMetricTone },
    { label: "Concurrency", value: normalizedConcurrency.toLocaleString("en-IN"), tone: campaignMetricTone },
    { label: "Daily limit", value: normalizedDailyLimit.toLocaleString("en-IN"), tone: campaignMetricTone },
  ];

  async function handleCsv(file: File | undefined) {
    if (!file) return;
    setNotice("");
    setError("");
    if (file.size > maxCsvSize) {
      setError("CSV file is too large. Maximum file size is 5MB.");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Upload a CSV file.");
      return;
    }
    try {
      const parsed = parseCampaignCsv(await file.text());
      if (!parsed.length) throw new Error("No contacts found in the CSV.");
      setCsvFile(file);
      setLeads(parsed);
      setNotice(`${parsed.length} contacts loaded from ${file.name}.`);
    } catch (caught) {
      setCsvFile(null);
      setLeads([]);
      setError(errorMessage(caught));
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    void handleCsv(event.dataTransfer.files[0]);
  }

  function metadataForLead(lead: CampaignLead) {
    const metadata: Record<string, string | number | boolean> = {
      CampaignName: campaignName.trim(),
      LeadRow: lead.row,
      LeadPhone: lead.phone,
    };
    const goal = metadataValue(campaignGoal);
    const criteria = metadataValue(successCriteria);
    const leadName = metadataValue(lead.name);
    const email = metadataValue(lead.email);
    const company = metadataValue(lead.company);
    if (goal) metadata.CampaignGoal = goal;
    if (criteria) metadata.SuccessCriteria = criteria;
    if (leadName) metadata.LeadName = leadName;
    if (email) metadata.LeadEmail = email;
    if (company) metadata.LeadCompany = company;

    for (const [rawKey, rawValue] of Object.entries(lead.customFields)) {
      const key = metadataKey(rawKey);
      const value = metadataValue(rawValue);
      if (key && value && !(key in metadata)) metadata[key] = value;
    }
    return metadata;
  }

  async function launchSendNowCampaign(contacts: CampaignLead[]) {
    let nextIndex = 0;
    const launched: { lead: CampaignLead; callId: string; roomName: string }[] = [];
    const failed: { lead: CampaignLead; message: string }[] = [];

    async function worker() {
      while (nextIndex < contacts.length) {
        const lead = contacts[nextIndex];
        nextIndex += 1;
        try {
          const call = await voiceApi.outboundCall(selectedAgentId, lead.phone, {
            phoneNumberId: selectedPhoneId,
            metadata: metadataForLead(lead),
          });
          launched.push({ lead, callId: call.callId, roomName: call.roomName });
        } catch (caught) {
          failed.push({ lead, message: errorMessage(caught) });
        }
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(normalizedConcurrency, contacts.length) }, () => worker()),
    );
    return { launched, failed };
  }

  async function prepareCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setError("");
    if (!canPrepare) {
      setError("Complete the campaign readiness checks before preparing this campaign.");
      return;
    }
    if (sendMode === "schedule") {
      setNotice(
        `${campaignName.trim()} is ready as a scheduled campaign draft for ${plural(leads.length, "contact")}. Scheduled campaign queue is not connected yet, so no calls were placed.`,
      );
      return;
    }

    const contactsToLaunch = leads.slice(0, normalizedDailyLimit);
    const skippedCount = Math.max(0, leads.length - contactsToLaunch.length);
    setLaunching(true);
    setNotice(`Starting ${plural(contactsToLaunch.length, "call")} for ${campaignName.trim()}...`);
    try {
      const { launched, failed } = await launchSendNowCampaign(contactsToLaunch);
      const skippedText = skippedCount
        ? ` ${plural(skippedCount, "contact")} remain because the daily limit is ${normalizedDailyLimit.toLocaleString("en-IN")}.`
        : "";
      setNotice(
        launched.length
          ? `${campaignName.trim()} launched ${plural(launched.length, "call")}.${skippedText} Track results in Call Logs.`
          : "",
      );
      if (failed.length) {
        const firstFailure = failed[0];
        setError(
          `${plural(failed.length, "contact")} could not be called. First failure: row ${firstFailure.lead.row} (${firstFailure.lead.phone}) - ${firstFailure.message}`,
        );
      }
    } finally {
      setLaunching(false);
    }
  }

  if (!session) {
    return <main className="app-strong grid min-h-screen place-items-center bg-[#f6f8fc]">Loading campaigns</main>;
  }

  return (
    <main className={`grid min-h-screen bg-[#f6f8fc] text-[#111827] lg:h-screen lg:overflow-hidden ${
      showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
    }`}>
      <DashboardSidebar
        activeLabel="Campaigns"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => { void logoutSession().then(() => router.replace("/login")); }}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />

      <section className="min-w-0 overflow-y-auto">
        <header className="border-b border-[#99f6e8] bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-1500px flex-wrap items-center justify-between gap-4">
            <div>
              <span className="app-label text-[#00b8c4]">Campaigns</span>
              <h1 className="m-0 text-xl font-semibold leading-7 text-[#0f172a]">Outbound launchpad</h1>
              <p className="app-caption mt-1 mb-0 text-[#475569]">Audience, routing, pacing, launch.</p>
            </div>
            <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-4">
              {campaignMetrics.map((metric) => (
                <div className={`rounded-lg border px-3 py-2 ${metric.tone}`} key={metric.label}>
                  <span className="app-caption block text-current">{metric.label}</span>
                  <strong className="block text-sm font-semibold leading-5">{metric.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </header>

        <form className="mx-auto grid w-full max-w-1500px gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-8" onSubmit={prepareCampaign}>
          <section className="grid min-w-0 content-start gap-4">
            {notice ? <Notice tone="success" message={notice} onClose={() => setNotice("")} /> : null}
            {error ? <Notice tone="error" message={error} onClose={() => setError("")} /> : null}

            <section className="overflow-hidden rounded-lg border border-[#dbe2ea] bg-white shadow-sm">
              <div className="grid border-b border-[#e5e7eb] bg-[#fbfdff] sm:grid-cols-5">
                {[
                  ["Details", "bg-[#22d3c8]"],
                  ["Audience", "bg-[#22d3c8]"],
                  ["Timing", "bg-[#22d3c8]"],
                  ["Strategy", "bg-[#22d3c8]"],
                  ["Review", "bg-[#22d3c8]"],
                ].map(([label, color]) => (
                  <div className="flex items-center gap-2 border-b border-[#e5e7eb] px-4 py-3 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0" key={label}>
                    <span className={`size-2 rounded-full ${color}`} />
                    <span className="app-label text-[#334155]">{label}</span>
                  </div>
                ))}
              </div>

              <section className="grid gap-5 border-b border-[#99f6e8] bg-[#ecfeff] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-[#ecfeff] text-[#0891b2]">
                    <Icon icon="spark" />
                  </span>
                  <div>
                    <h2 className="app-section-title m-0">Campaign details</h2>
                    <p className="app-caption mt-1 mb-0">Name, caller ID, and assistant.</p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="app-label grid gap-2 lg:col-span-2">
                    Campaign name
                    <input className={controlClass} placeholder="June renewal follow-up" value={campaignName} onChange={(event) => setCampaignName(event.target.value)} />
                  </label>
                  <label className="app-label grid gap-2">
                    Phone number
                    <select className={controlClass} value={selectedPhoneId} onChange={(event) => setSelectedPhoneId(event.target.value)}>
                      <option value="">Select</option>
                      {callableNumbers.map((number) => (
                        <option key={number._id} value={number._id}>
                          {number.number} - {number.provider} - {number.status}
                          {phoneAgentId(number) === selectedAgentId ? "" : " - different assistant"}
                        </option>
                      ))}
                    </select>
                    {selectedPhone && !selectedPhoneReady ? (
                      <span className="app-caption font-normal text-[#d97706]">Choose a Ready outbound caller ID assigned to this assistant.</span>
                    ) : null}
                  </label>
                  <label className="app-label grid gap-2">
                    Assistant
                    <select className={controlClass} value={selectedAgentId} onChange={(event) => setSelectedAgentId(event.target.value)}>
                      <option value="">Select</option>
                      {agents.map((agent) => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name} - {agent.status}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <section className="grid gap-5 border-b border-[#99f6e8] bg-[#ecfeff] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-[#ecfeff] text-[#00b8c4]">
                      <Icon icon="upload" />
                    </span>
                    <div>
                      <h2 className="app-section-title m-0">Audience CSV</h2>
                      <p className="app-caption mt-1 mb-0">Required: phone or phone_number in E.164 format.</p>
                    </div>
                  </div>
                  <span className="app-caption rounded-lg bg-[#f1f5f9] px-2.5 py-1">{csvFile ? `${csvFile.name} - ${formatFileSize(csvFile.size)}` : "No file chosen"}</span>
                </div>

                <label
                  className="grid min-h-170px cursor-pointer place-items-center rounded-lg border border-dashed border-[#5eead4] bg-white p-6 text-center shadow-sm transition hover:border-[#22d3c8] hover:bg-[#ecfeff]"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                >
                  <input className="sr-only" type="file" accept=".csv,text/csv" onChange={(event) => void handleCsv(event.target.files?.[0])} />
                  <span>
                    <span className="mx-auto mb-3 grid size-11 place-items-center rounded-lg bg-white text-[#00b8c4] shadow-sm"><Icon icon="file" /></span>
                    <strong className="app-strong block">Drop CSV or choose file</strong>
                    <span className="app-caption mt-1 block">Up to 5MB. Optional columns: name, email, company, custom fields.</span>
                  </span>
                </label>

                <div className="rounded-lg border border-[#99f6e8] bg-[#ecfeff] px-3 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="app-caption m-0 text-[#9a3412]">Pace calls, use trusted caller IDs, respect opt-outs, and call inside local business hours.</p>
                    <a
                      className="app-label inline-flex min-h-9 items-center rounded-lg bg-white px-3 text-[#008996] ring-1 ring-[#5eead4] transition hover:bg-[#fffbeb]"
                      href="https://docs.vapi.ai/calls/outbound-calling#trusted-calling-and-caller-id"
                      rel="noreferrer"
                      target="_blank"
                    >
                      Spam guidance
                    </a>
                  </div>
                </div>

                {leads.length ? (
                  <div className="overflow-hidden rounded-lg border border-[#e5e7eb]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e7eb] bg-[#fbfdff] px-4 py-3">
                      <span className="app-section-title">{leads.length} contacts loaded</span>
                      <span className={`app-label rounded-lg px-2.5 py-1 ${invalidLeadCount ? "bg-[#fff7ed] text-[#d97706]" : "bg-[#ecfdf5] text-[#047857]"}`}>
                        {invalidLeadCount ? `${invalidLeadCount} invalid phones` : "All numbers are E.164"}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-720px text-left">
                        <thead className="bg-white text-[#64748b]">
                          <tr className="app-label">
                            <th className="px-4 py-3 font-medium">Row</th>
                            <th className="px-4 py-3 font-medium">Phone</th>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Company</th>
                            <th className="px-4 py-3 font-medium">Custom fields</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#edf0f4]">
                          {previewLeads.map((lead) => (
                            <tr className="hover:bg-[#fbfdff]" key={`${lead.row}-${lead.phone}`}>
                              <td className="app-body px-4 py-3 text-[#64748b]">{lead.row}</td>
                              <td className={`app-strong px-4 py-3 ${isDialable(lead.phone) ? "" : "text-[#dc2626]"}`}>{lead.phone}</td>
                              <td className="app-body px-4 py-3 text-[#475569]">{lead.name || "-"}</td>
                              <td className="app-body px-4 py-3 text-[#475569]">{lead.company || "-"}</td>
                              <td className="app-caption px-4 py-3">{Object.keys(lead.customFields).length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="grid gap-5 border-b border-[#99f6e8] bg-[#ecfeff] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-[#fffbeb] text-[#d97706]">
                    <Icon icon="calendar" />
                  </span>
                  <div>
                    <h2 className="app-section-title m-0">Timing</h2>
                    <p className="app-caption mt-1 mb-0">Launch mode and local calling window.</p>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <button
                    className={`rounded-lg border p-4 text-left transition ${sendMode === "now" ? "border-[#00b8c4] bg-[#ecfeff] ring-2 ring-[#00b8c4]/10" : "border-[#e5e7eb] bg-white hover:border-[#5eead4]"}`}
                    onClick={() => setSendMode("now")}
                    type="button"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-lg bg-white text-[#00b8c4]"><Icon icon="play" /></span>
                      <span><strong className="app-strong block">Send now</strong><span className="app-caption">Launch immediately</span></span>
                    </span>
                  </button>
                  <button
                    className={`rounded-lg border p-4 text-left transition ${sendMode === "schedule" ? "border-[#22d3c8] bg-[#ecfeff] ring-2 ring-[#22d3c8]/10" : "border-[#e5e7eb] bg-white hover:border-[#99f6e8]"}`}
                    onClick={() => setSendMode("schedule")}
                    type="button"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-lg bg-white text-[#7c3aed]"><Icon icon="calendar" /></span>
                      <span><strong className="app-strong block">Schedule</strong><span className="app-caption">Create draft</span></span>
                    </span>
                  </button>
                </div>

                {sendMode === "schedule" ? (
                  <div className="grid gap-4 lg:grid-cols-3">
                    <label className="app-label grid gap-2">
                      Start time
                      <input className={controlClass} type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
                    </label>
                    <label className="app-label grid gap-2">
                      Timezone
                      <select className={controlClass} value={timezone} onChange={(event) => setTimezone(event.target.value)}>
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </label>
                    <label className="app-label grid gap-2">
                      Local call window
                      <span className="grid grid-cols-2 gap-2">
                        <input className={controlClass} type="time" value={windowStart} onChange={(event) => setWindowStart(event.target.value)} />
                        <input className={controlClass} type="time" value={windowEnd} onChange={(event) => setWindowEnd(event.target.value)} />
                      </span>
                    </label>
                  </div>
                ) : null}
              </section>

              <section className="grid gap-5 bg-[#f8fcff] p-4 sm:p-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-[#ecfeff] text-[#00b8c4]">
                      <Icon icon="phone" />
                    </span>
                    <div>
                      <h2 className="app-section-title m-0">Calling strategy</h2>
                      <p className="app-caption mt-1 mb-0">Volume, retries, and concurrency.</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="app-label grid gap-2">
                      Daily limit
                      <input className={controlClass} min={1} max={10000} type="number" value={dailyLimit} onChange={(event) => setDailyLimit(Number(event.target.value))} />
                    </label>
                    <label className="app-label grid gap-2">
                      Concurrent calls
                      <input className={controlClass} min={1} max={20} type="number" value={concurrency} onChange={(event) => setConcurrency(Number(event.target.value))} />
                    </label>
                    <label className="app-label grid gap-2">
                      Max attempts
                      <input className={controlClass} min={1} max={5} type="number" value={maxAttempts} onChange={(event) => setMaxAttempts(Number(event.target.value))} />
                    </label>
                    <label className="app-label grid gap-2">
                      Retry gap hours
                      <input className={controlClass} min={1} max={168} type="number" value={retryGapHours} onChange={(event) => setRetryGapHours(Number(event.target.value))} />
                    </label>
                  </div>
                </div>

                <div className="border-t border-[#edf0f4] pt-5 xl:border-t-0 xl:border-l xl:pl-5 xl:pt-0">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-[#fff1f2] text-[#e11d48]">
                      <Icon icon="info" />
                    </span>
                    <div>
                      <h2 className="app-section-title m-0">Campaign instructions</h2>
                      <p className="app-caption mt-1 mb-0">Goal and success signal.</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4">
                    <label className="app-label grid gap-2">
                      Goal
                      <textarea className="app-control-text min-h-24 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 text-[#111827] outline-none focus:border-[#00b8c4] focus:ring-4 focus:ring-[#00b8c4]/10" placeholder="Confirm appointment interest and capture preferred callback time." value={campaignGoal} onChange={(event) => setCampaignGoal(event.target.value)} />
                    </label>
                    <label className="app-label grid gap-2">
                      Success criteria
                      <input className={controlClass} placeholder="Booked demo, qualified lead, reminder accepted..." value={successCriteria} onChange={(event) => setSuccessCriteria(event.target.value)} />
                    </label>
                  </div>
                </div>
              </section>
            </section>
          </section>

          <aside className="min-w-0">
            <section className="overflow-hidden rounded-lg border border-[#dbe2ea] bg-white shadow-sm lg:sticky lg:top-6">
              <div className="border-b border-[#edf0f4] bg-[#fbfdff] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="app-section-title m-0">Launch console</h2>
                    <p className="app-caption mt-1 mb-0">{canPrepare ? "Ready to launch." : "Complete preflight."}</p>
                  </div>
                  <span className={`grid size-10 place-items-center rounded-lg ${canPrepare ? "bg-[#dcfce7] text-[#059669]" : "bg-[#fef3c7] text-[#d97706]"}`}>
                    <Icon icon={canPrepare ? "check" : "shield"} />
                  </span>
                </div>
              </div>

              <div className="border-b border-[#edf0f4] p-4">
                <h3 className="app-section-title m-0">Readiness</h3>
                <div className="mt-4 grid gap-2.5">
                  {readyChecks.map((check) => (
                    <div className="flex items-center justify-between gap-3" key={check.label}>
                      <span className="app-body text-[#475569]">{check.label}</span>
                      <span className={`grid size-6 place-items-center rounded-full ${check.ready ? "bg-[#dcfce7] text-[#059669]" : "bg-[#fef3c7] text-[#d97706]"}`}>
                        <Icon icon={check.ready ? "check" : "info"} className="size-3.5" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b border-[#edf0f4] p-4">
                <h3 className="app-section-title m-0">Guardrails</h3>
                <div className="mt-4 grid gap-3">
                  <ToggleRow title="Respect opt-outs" detail="Required" enabled={respectDnc} onChange={setRespectDnc} />
                  <ToggleRow title="Voicemail detection" detail="Outcome tagging" enabled={detectVoicemail} onChange={setDetectVoicemail} />
                  <ToggleRow title="Consent opening" detail="Identity and purpose" enabled={requireConsentLine} onChange={setRequireConsentLine} />
                </div>
              </div>

              <div className="p-4">
                <h3 className="app-section-title m-0">Summary</h3>
                <dl className="mt-4 grid gap-3">
                  {[
                    ["Contacts", leads.length.toLocaleString("en-IN")],
                    ["Invalid phones", invalidLeadCount.toLocaleString("en-IN")],
                    ["Batches", estimatedBatches.toLocaleString("en-IN")],
                    ["Caller ID", selectedPhone?.number ?? "Not selected"],
                    ["Assistant", selectedAgent?.name ?? "Not selected"],
                    ["Mode", sendMode === "now" ? "Send now" : "Scheduled"],
                  ].map(([label, value]) => (
                    <div className="flex justify-between gap-3" key={label}>
                      <dt className="app-caption">{label}</dt>
                      <dd className="app-strong m-0 max-w-180px truncate text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
                <button className={`${buttonClass} mt-5 w-full bg-[#00b8c4] text-white shadow-sm hover:bg-[#008996]`} disabled={loading || launching || !canPrepare} type="submit">
                  <Icon icon="play" /> {launching ? "Launching..." : sendMode === "now" ? "Start calls now" : "Create scheduled draft"}
                </button>
                <p className="app-caption mt-3 mb-0 text-center">
                  {sendMode === "now" ? "Outbound route starts immediately." : "Scheduled drafts wait for the queue."}
                </p>
              </div>
            </section>
          </aside>
        </form>
      </section>
    </main>
  );
}

function ToggleRow({ detail, enabled, onChange, title }: {
  detail: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  title: string;
}) {
  return (
    <button
      className="flex items-center justify-between gap-4 rounded-lg border border-[#e5e7eb] bg-white px-3 py-3 text-left transition hover:bg-[#f8fafc]"
      onClick={() => onChange(!enabled)}
      type="button"
    >
      <span>
        <strong className="app-strong block">{title}</strong>
        <span className="app-caption block">{detail}</span>
      </span>
      <span className={`relative h-6 w-11 rounded-full transition ${enabled ? "bg-[#00b8c4]" : "bg-[#cbd5e1]"}`}>
        <span className={`absolute top-1 size-4 rounded-full bg-white shadow transition ${enabled ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}

function Notice({ message, onClose, tone }: { message: string; onClose: () => void; tone: "error" | "success" }) {
  const success = tone === "success";
  return (
    <div className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 ${success ? "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]" : "border-[#fecaca] bg-[#fff1f2] text-[#b91c1c]"}`}>
      <span className="app-body">{message}</span>
      <button className="grid size-6 shrink-0 place-items-center rounded-md hover:bg-black/5" onClick={onClose} type="button" aria-label="Dismiss">
        <Icon icon="close" className="size-3.5" />
      </button>
    </div>
  );
}
