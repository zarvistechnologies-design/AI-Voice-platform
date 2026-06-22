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
  "app-control-text min-h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10";

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
  return /^\+?[1-9]\d{7,14}$/.test(phone);
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
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
      setAgents(agentResult.agents);
      setNumbers(numberResult.numbers);
      setSelectedAgentId((current) => current || agentResult.agents[0]?._id || "");
      setSelectedPhoneId((current) => current || numberResult.numbers.find((number) => number.direction !== "Inbound")?._id || "");
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
  const invalidLeadCount = leads.filter((lead) => !isDialable(lead.phone)).length;
  const readyChecks = [
    { label: "Campaign name", ready: Boolean(campaignName.trim()) },
    { label: "Caller ID selected", ready: Boolean(selectedPhone) },
    { label: "Assistant selected", ready: Boolean(selectedAgent) },
    { label: "CSV contacts uploaded", ready: leads.length > 0 },
    { label: "All phone numbers dialable", ready: leads.length > 0 && invalidLeadCount === 0 },
    { label: "Compliance guardrails on", ready: respectDnc && requireConsentLine },
    { label: "Schedule selected", ready: sendMode === "now" || Boolean(scheduledAt) },
  ];
  const canPrepare = readyChecks.every((check) => check.ready);
  const estimatedBatches = Math.max(1, Math.ceil(leads.length / Math.max(1, dailyLimit)));
  const previewLeads = leads.slice(0, 8);

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

  function prepareCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setError("");
    if (!canPrepare) {
      setError("Complete the campaign readiness checks before preparing this campaign.");
      return;
    }
    setNotice(
      `${campaignName.trim()} is ready as a ${sendMode === "now" ? "send-now" : "scheduled"} campaign draft for ${leads.length} contacts. Backend campaign queue is not connected yet, so no calls were placed.`,
    );
  }

  if (!session) {
    return <main className="app-strong grid min-h-screen place-items-center bg-[#f7f8fb]">Loading campaigns</main>;
  }

  return (
    <main className="grid min-h-screen bg-[#f7f8fb] text-[#111827] lg:h-screen lg:grid-cols-[64px_minmax(0,1fr)] lg:overflow-hidden">
      <DashboardSidebar
        activeLabel="Campaigns"
        userInitials={initials(session.name)}
        onLogout={() => { void logoutSession().then(() => router.replace("/login")); }}
      />

      <section className="min-w-0 overflow-y-auto">
        <header className="border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="app-page-title m-0">New campaign</h1>
              <p className="app-caption mt-1 mb-0">Upload a lead CSV, choose a caller ID and assistant, then prepare an outbound campaign safely.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#dbeafe] bg-[#eff6ff] px-3 py-2 text-[#2563eb]">
              <Icon icon="shield" />
              <span className="app-label text-[#1d4ed8]">Preflight mode</span>
            </div>
          </div>
        </header>

        <form className="mx-auto grid w-full max-w-[1440px] gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8" onSubmit={prepareCampaign}>
          <section className="grid content-start gap-4">
            {notice ? <Notice tone="success" message={notice} onClose={() => setNotice("")} /> : null}
            {error ? <Notice tone="error" message={error} onClose={() => setError("")} /> : null}

            <section className="rounded-xl border border-[#dfe3ea] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="app-section-title m-0">Campaign details</h2>
                  <p className="app-caption mt-1 mb-0">Name the campaign and pick the exact voice stack that will make the calls.</p>
                </div>
                <span className="grid size-10 place-items-center rounded-lg bg-[#eff6ff] text-[#2563eb]"><Icon icon="spark" /></span>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="app-label grid gap-2 lg:col-span-2">
                  Campaign Name
                  <input className={controlClass} placeholder="June renewal follow-up" value={campaignName} onChange={(event) => setCampaignName(event.target.value)} />
                </label>
                <label className="app-label grid gap-2">
                  Phone Number
                  <select className={controlClass} value={selectedPhoneId} onChange={(event) => setSelectedPhoneId(event.target.value)}>
                    <option value="">Select</option>
                    {callableNumbers.map((number) => (
                      <option key={number._id} value={number._id}>
                        {number.number} · {number.provider} · {number.status}
                      </option>
                    ))}
                  </select>
                  {selectedPhone?.status === "Needs setup" ? (
                    <span className="app-caption font-normal text-[#d97706]">This number still needs inbound routing setup. Outbound campaign caller ID may need provider verification.</span>
                  ) : null}
                </label>
                <label className="app-label grid gap-2">
                  Assistant
                  <select className={controlClass} value={selectedAgentId} onChange={(event) => setSelectedAgentId(event.target.value)}>
                    <option value="">Select</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name} · {agent.status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-[#dbeafe] bg-[#eff6ff] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="app-section-title m-0 text-[#1e40af]">Best Practices</h2>
                  <p className="app-caption mt-1 mb-0 text-[#1e40af]">Avoid spam flagging by pacing calls, using trusted caller IDs, respecting opt-outs, and calling during local business hours.</p>
                </div>
                <a
                  className={`${buttonClass} border border-[#bfdbfe] bg-white px-3 text-[#2563eb] hover:bg-[#f8fbff]`}
                  href="https://docs.vapi.ai/calls/outbound-calling#trusted-calling-and-caller-id"
                  rel="noreferrer"
                  target="_blank"
                >
                  Spam flagging best practices
                </a>
              </div>
            </section>

            <section className="rounded-xl border border-[#dfe3ea] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="app-section-title m-0">Upload CSV</h2>
                  <p className="app-caption mt-1 mb-0">Required column: phone or phone_number. Optional: name, email, company, and custom fields.</p>
                </div>
                <span className="app-caption rounded-full bg-[#f1f5f9] px-2.5 py-1">{csvFile ? `${csvFile.name} · ${formatFileSize(csvFile.size)}` : "No file chosen"}</span>
              </div>

              <label
                className="grid min-h-[190px] cursor-pointer place-items-center rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-6 text-center transition hover:border-[#93c5fd] hover:bg-[#eff6ff]"
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
              >
                <input className="sr-only" type="file" accept=".csv,text/csv" onChange={(event) => void handleCsv(event.target.files?.[0])} />
                <span>
                  <span className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-white text-[#2563eb] shadow-sm"><Icon icon="upload" className="size-5" /></span>
                  <strong className="app-strong block">Drag and drop a CSV file here or click to select file locally</strong>
                  <span className="app-caption mt-1 block">Maximum file size: 5MB</span>
                </span>
              </label>

              {leads.length ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-[#e5e7eb]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e7eb] bg-[#f8fafc] px-4 py-3">
                    <span className="app-section-title">{leads.length} contacts loaded</span>
                    <span className={`app-label rounded-full px-2.5 py-1 ${invalidLeadCount ? "bg-[#fff7ed] text-[#d97706]" : "bg-[#ecfdf5] text-[#047857]"}`}>
                      {invalidLeadCount ? `${invalidLeadCount} invalid phones` : "All numbers look dialable"}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left">
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
                          <tr key={`${lead.row}-${lead.phone}`}>
                            <td className="app-body px-4 py-3 text-[#64748b]">{lead.row}</td>
                            <td className={`app-strong px-4 py-3 ${isDialable(lead.phone) ? "" : "text-[#dc2626]"}`}>{lead.phone}</td>
                            <td className="app-body px-4 py-3 text-[#475569]">{lead.name || "—"}</td>
                            <td className="app-body px-4 py-3 text-[#475569]">{lead.company || "—"}</td>
                            <td className="app-caption px-4 py-3">{Object.keys(lead.customFields).length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </section>

            <section className="rounded-xl border border-[#dfe3ea] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4">
                <h2 className="app-section-title m-0">Choose when to send</h2>
                <p className="app-caption mt-1 mb-0">Schedule timing and pacing before campaign launch.</p>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <button
                  className={`rounded-xl border p-4 text-left transition ${sendMode === "now" ? "border-[#1438f5] bg-[#eef2ff] ring-2 ring-[#1438f5]/10" : "border-[#e5e7eb] bg-white hover:border-[#c7d2fe]"}`}
                  onClick={() => setSendMode("now")}
                  type="button"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-lg bg-white text-[#2563eb]"><Icon icon="play" /></span>
                    <span><strong className="app-strong block">Send Now</strong><span className="app-caption">Prepare campaign for immediate launch</span></span>
                  </span>
                </button>
                <button
                  className={`rounded-xl border p-4 text-left transition ${sendMode === "schedule" ? "border-[#1438f5] bg-[#eef2ff] ring-2 ring-[#1438f5]/10" : "border-[#e5e7eb] bg-white hover:border-[#c7d2fe]"}`}
                  onClick={() => setSendMode("schedule")}
                  type="button"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-lg bg-white text-[#2563eb]"><Icon icon="calendar" /></span>
                    <span><strong className="app-strong block">Schedule for later</strong><span className="app-caption">Pick date, timezone, and call window</span></span>
                  </span>
                </button>
              </div>

              {sendMode === "schedule" ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
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

            <section className="grid gap-4 xl:grid-cols-2">
              <section className="rounded-xl border border-[#dfe3ea] bg-white p-4 shadow-sm sm:p-5">
                <h2 className="app-section-title m-0">Calling strategy</h2>
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
              </section>

              <section className="rounded-xl border border-[#dfe3ea] bg-white p-4 shadow-sm sm:p-5">
                <h2 className="app-section-title m-0">Campaign instructions</h2>
                <div className="mt-4 grid gap-4">
                  <label className="app-label grid gap-2">
                    Goal
                    <textarea className="app-control-text min-h-24 resize-y rounded-lg border border-[#dfe3ea] bg-white p-3 text-[#111827] outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10" placeholder="Example: confirm appointment interest and capture preferred callback time." value={campaignGoal} onChange={(event) => setCampaignGoal(event.target.value)} />
                  </label>
                  <label className="app-label grid gap-2">
                    Success criteria
                    <input className={controlClass} placeholder="Booked demo, qualified lead, payment reminder accepted..." value={successCriteria} onChange={(event) => setSuccessCriteria(event.target.value)} />
                  </label>
                </div>
              </section>
            </section>
          </section>

          <aside className="grid content-start gap-4">
            <section className="rounded-xl border border-[#dfe3ea] bg-white p-4 shadow-sm">
              <h2 className="app-section-title m-0">Readiness checks</h2>
              <div className="mt-4 grid gap-3">
                {readyChecks.map((check) => (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-[#e5e7eb] px-3 py-2" key={check.label}>
                    <span className="app-body text-[#475569]">{check.label}</span>
                    <span className={`grid size-6 place-items-center rounded-full ${check.ready ? "bg-[#dcfce7] text-[#059669]" : "bg-[#fef3c7] text-[#d97706]"}`}>
                      <Icon icon={check.ready ? "check" : "info"} className="size-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#dfe3ea] bg-white p-4 shadow-sm">
              <h2 className="app-section-title m-0">Guardrails</h2>
              <div className="mt-4 grid gap-3">
                <ToggleRow title="Respect DNC / opt-out list" detail="Required before launch." enabled={respectDnc} onChange={setRespectDnc} />
                <ToggleRow title="Voicemail detection" detail="Skip or mark voicemail outcomes." enabled={detectVoicemail} onChange={setDetectVoicemail} />
                <ToggleRow title="Consent opening line" detail="Assistant identifies itself and the purpose of the call." enabled={requireConsentLine} onChange={setRequireConsentLine} />
              </div>
            </section>

            <section className="rounded-xl border border-[#dfe3ea] bg-white p-4 shadow-sm">
              <h2 className="app-section-title m-0">Launch summary</h2>
              <dl className="mt-4 grid gap-3">
                {[
                  ["Contacts", leads.length.toLocaleString("en-IN")],
                  ["Invalid phones", invalidLeadCount.toLocaleString("en-IN")],
                  ["Estimated batches", estimatedBatches.toLocaleString("en-IN")],
                  ["Caller ID", selectedPhone?.number ?? "Not selected"],
                  ["Assistant", selectedAgent?.name ?? "Not selected"],
                  ["Mode", sendMode === "now" ? "Send now" : "Scheduled"],
                ].map(([label, value]) => (
                  <div className="flex justify-between gap-3" key={label}>
                    <dt className="app-caption">{label}</dt>
                    <dd className="app-strong m-0 max-w-[190px] truncate text-right">{value}</dd>
                  </div>
                ))}
              </dl>
              <button className={`${buttonClass} mt-5 w-full bg-[#1438f5] text-white shadow-sm hover:bg-[#102fcf]`} disabled={loading || !canPrepare} type="submit">
                <Icon icon="play" /> Create campaign draft
              </button>
              <p className="app-caption mt-3 mb-0 text-center">No calls are placed from this screen yet.</p>
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
      <span className={`relative h-6 w-11 rounded-full transition ${enabled ? "bg-[#1438f5]" : "bg-[#cbd5e1]"}`}>
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
