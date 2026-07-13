"use client";

import { type DragEvent, type FormEvent, type ReactNode, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import { voiceApi, type AgentSummary, type BackendCampaign, type BackendPhoneNumber } from "@/lib/voice";

type IconName = "activity" | "bolt" | "calendar" | "check" | "clock" | "close" | "file" | "info" | "phone" | "play" | "shield" | "spark" | "target" | "upload" | "user" | "users" | "warning";
type CampaignLead = {
  row: number;
  phone: string;
  name: string;
  email: string;
  company: string;
  customFields: Record<string, string>;
};
type CampaignCsvWorkerResponse =
  | { ok: true; leads: CampaignLead[] }
  | { ok: false; message: string };
type SendMode = "now" | "schedule";
type CampaignAction = "pause" | "resume" | "cancel";

const maxCsvSize = 25 * 1024 * 1024;
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
  if (icon === "activity") return <svg {...props}><path d="M4 14h3l2-6 4 12 2-6h5" /></svg>;
  if (icon === "bolt") return <svg {...props}><path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z" /></svg>;
  if (icon === "calendar") return <svg {...props}><path d="M7 3v4M17 3v4M4 9h16" /><rect x="4" y="5" width="16" height="16" rx="3" /></svg>;
  if (icon === "check") return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  if (icon === "clock") return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
  if (icon === "close") return <svg {...props}><path d="M6 6 18 18M18 6 6 18" /></svg>;
  if (icon === "file") return <svg {...props}><path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M8 13h8M8 17h5" /></svg>;
  if (icon === "info") return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 10v6M12 7h.01" /></svg>;
  if (icon === "phone") return <svg {...props}><path d="M6.6 4.8 9 7.2a2 2 0 0 1 .4 2.2l-.8 1.7a12 12 0 0 0 5.3 5.3l1.7-.8a2 2 0 0 1 2.2.4l2.4 2.4a1.8 1.8 0 0 1-.2 2.7c-1 .7-2.2 1-3.6.8C9.4 20.7 3.3 14.6 2.1 7.6 1.9 6.2 2.2 5 2.9 4a1.8 1.8 0 0 1 2.7-.2Z" /></svg>;
  if (icon === "play") return <svg {...props}><path d="M8 5v14l11-7L8 5Z" /></svg>;
  if (icon === "shield") return <svg {...props}><path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" /><path d="m9 12 2 2 4-5" /></svg>;
  if (icon === "spark") return <svg {...props}><path d="m12 3 1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9L12 3Z" /></svg>;
  if (icon === "target") return <svg {...props}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>;
  if (icon === "upload") return <svg {...props}><path d="M12 15V3m0 0 4 4m-4-4-4 4" /><path d="M4 17v3h16v-3" /></svg>;
  if (icon === "users") return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
  if (icon === "warning") return <svg {...props}><path d="m12 3 10 18H2L12 3Z" /><path d="M12 9v5M12 17h.01" /></svg>;
  return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The request could not be completed.";
}

function parseCampaignCsvInWorker(text: string) {
  return new Promise<CampaignLead[]>((resolve, reject) => {
    const worker = new Worker(new URL("./CampaignCsv.worker.ts", import.meta.url), { type: "module" });
    let settled = false;

    const rejectAndTerminate = (error: Error) => {
      if (settled) return;
      settled = true;
      worker.terminate();
      reject(error);
    };

    worker.onmessage = (event: MessageEvent<CampaignCsvWorkerResponse>) => {
      if (settled) return;
      settled = true;
      worker.terminate();
      if (event.data.ok) {
        resolve(event.data.leads);
      } else {
        reject(new Error(event.data.message));
      }
    };
    worker.onerror = (event) => {
      event.preventDefault();
      rejectAndTerminate(new Error(event.message || "The request could not be completed."));
    };
    worker.onmessageerror = () => {
      rejectAndTerminate(new Error("The request could not be completed."));
    };

    try {
      worker.postMessage({ text });
    } catch (error) {
      rejectAndTerminate(error instanceof Error ? error : new Error("The request could not be completed."));
    }
  });
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

function plural(count: number, singular: string, pluralName = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralName}`;
}

function zonedLocalDateTimeToIso(value: string, timezone: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error("Choose a valid campaign start time.");
  const targetUtc = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]));
  let result = targetUtc;
  for (let pass = 0; pass < 2; pass += 1) {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date(result)).map((part) => [part.type, part.value]),
    );
    const representedUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute));
    result += targetUtc - representedUtc;
  }
  return new Date(result).toISOString();
}

function formatDateTime(value: string | null, timezone = "Asia/Kolkata") {
  if (!value) return "Not set";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: timezone,
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function statusCopy(status: BackendCampaign["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
}

function statusTheme(status: BackendCampaign["status"]) {
  if (status === "running") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "scheduled") return "border-sky-200 bg-sky-50 text-sky-700";
  if (status === "paused") return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "completed") return "border-slate-200 bg-slate-100 text-slate-700";
  if (status === "cancelled") return "border-rose-200 bg-rose-50 text-rose-700";
  if (status === "failed") return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-white text-slate-600";
}

function progressValue(value: number) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
}

function numberFormat(value: number) {
  return value.toLocaleString("en-IN");
}

function schedulePreview(value: string, timezone: string) {
  if (!value) return "Schedule pending";
  try {
    return formatDateTime(zonedLocalDateTimeToIso(value, timezone), timezone);
  } catch {
    return "Choose a valid start time";
  }
}

function timeToMinutes(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function localMinutesForDate(date: Date, timezone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date).map((part) => [part.type, part.value]),
  );
  return Number(parts.hour) * 60 + Number(parts.minute);
}

function isInsideCallWindow(now: Date, timezone: string, start: string, end: string) {
  const current = localMinutesForDate(now, timezone);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  if (startMinutes === endMinutes) return true;
  if (startMinutes < endMinutes) return current >= startMinutes && current < endMinutes;
  return current >= startMinutes || current < endMinutes;
}

function formatLocalTime(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeStyle: "short",
    timeZone: timezone,
  }).format(date);
}

export function CampaignShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [numbers, setNumbers] = useState<BackendPhoneNumber[]>([]);
  const [campaigns, setCampaigns] = useState<BackendCampaign[]>([]);
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
  const [now, setNow] = useState(() => new Date());
  const [idempotencyKey, setIdempotencyKey] = useState(() => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/campaign");
      return;
    }

    let cancelled = false;
    void (async () => {
      const dataPromise = Promise.all([
        voiceApi.agentSummaries(),
        voiceApi.phoneNumbers(),
        voiceApi.campaigns(),
      ]).then(
        (value) => ({ value, error: null }),
        (caught: unknown) => ({ value: null, error: caught }),
      );
      const [validatedSession, dataResult] = await Promise.all([
        validateStoredSession(),
        dataPromise,
      ]);
      if (!validatedSession) {
        if (!cancelled) router.replace("/login?next=/dashboard/campaign");
        return;
      }
      if (!dataResult.value) {
        throw dataResult.error ?? new Error("Could not load campaign data.");
      }
      const [agentResult, numberResult, campaignResult] = dataResult.value;
      if (cancelled) return;
      const firstAgentId = agentResult.agents[0]?._id || "";
      const firstReadyCallerId = numberResult.numbers.find(
        (number) => number.direction !== "Inbound" && number.status === "Ready" && phoneAgentId(number) === firstAgentId,
      );
      const firstCallerId = firstReadyCallerId ?? numberResult.numbers.find((number) => number.direction !== "Inbound");
      setAgents(agentResult.agents);
      setNumbers(numberResult.numbers);
      setCampaigns(campaignResult.campaigns);
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

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    let refreshing = false;
    const refresh = () => {
      if (cancelled || refreshing || document.visibilityState !== "visible") return;
      refreshing = true;
      void voiceApi.campaigns()
        .then((result) => {
          if (!cancelled) setCampaigns(result.campaigns);
        })
        .catch(() => undefined)
        .finally(() => {
          refreshing = false;
        });
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const timer = window.setInterval(refresh, 5000);
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [session]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

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
  const normalizedConcurrency = Math.max(1, Math.min(100, Number.isFinite(concurrency) ? Math.floor(concurrency) : 1));
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
  const readinessPercent = Math.round((completedReadyChecks / readyChecks.length) * 100);
  const estimatedBatches = Math.max(1, Math.ceil(leads.length / normalizedDailyLimit));
  const previewLeads = leads.slice(0, 8);
  const activeCampaigns = campaigns.filter((campaign) => ["running", "scheduled", "paused"].includes(campaign.status)).length;
  const processedAcrossCampaigns = campaigns.reduce((total, campaign) => total + campaign.stats.processed, 0);
  const totalAcrossCampaigns = campaigns.reduce((total, campaign) => total + campaign.stats.total, 0);
  const routeSummary = selectedAgent && selectedPhone ? `${selectedAgent.name} via ${selectedPhone.number}` : "Choose assistant and caller ID";
  const callWindowOpen = isInsideCallWindow(now, timezone, windowStart, windowEnd);
  const launchModeSummary = sendMode === "now"
    ? callWindowOpen ? "Immediate launch" : `Waits for ${windowStart}-${windowEnd}`
    : schedulePreview(scheduledAt, timezone);
  const campaignMetrics = [
    { label: "Audience loaded", value: numberFormat(leads.length), detail: invalidLeadCount ? `${invalidLeadCount} need fixing` : "Validated CSV rows", icon: "users" as const },
    { label: "Readiness", value: `${readinessPercent}%`, detail: `${completedReadyChecks}/${readyChecks.length} checks complete`, icon: "shield" as const },
    { label: "Active campaigns", value: numberFormat(activeCampaigns), detail: `${numberFormat(processedAcrossCampaigns)}/${numberFormat(totalAcrossCampaigns)} processed`, icon: "activity" as const },
    { label: "Call pacing", value: `${numberFormat(normalizedConcurrency)}x`, detail: `${numberFormat(normalizedDailyLimit)} max/day`, icon: "bolt" as const },
  ];

  async function handleCsv(file: File | undefined) {
    if (!file) return;
    setNotice("");
    setError("");
    if (file.size > maxCsvSize) {
      setError("CSV file is too large. Maximum file size is 25MB.");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Upload a CSV file.");
      return;
    }
    try {
      const parsed = await parseCampaignCsvInWorker(await file.text());
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

  async function prepareCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setError("");
    if (!canPrepare) {
      setError("Complete the campaign readiness checks before preparing this campaign.");
      return;
    }
    setLaunching(true);
    setNotice(`Preparing campaign for ${plural(leads.length, "contact")}...`);
    try {
      const created = await voiceApi.createCampaign({
        idempotencyKey,
        name: campaignName.trim(),
        agentId: selectedAgentId,
        phoneNumberId: selectedPhoneId,
        timezone,
        windowStart,
        windowEnd,
        dailyLimit: normalizedDailyLimit,
        concurrency: normalizedConcurrency,
        maxAttempts: Math.max(1, Math.min(10, Math.floor(maxAttempts))),
        retryGapSeconds: Math.max(60, Math.floor(retryGapHours * 3600)),
        goal: campaignGoal.trim(),
        successCriteria: successCriteria.trim(),
        respectDnc,
        requireConsentLine,
        detectVoicemail,
      });
      const batchSize = 500;
      for (let index = 0; index < leads.length; index += batchSize) {
        await voiceApi.addCampaignLeads(created.campaign._id, leads.slice(index, index + batchSize));
        setNotice(`Uploaded ${Math.min(index + batchSize, leads.length).toLocaleString("en-IN")} of ${leads.length.toLocaleString("en-IN")} contacts...`);
      }
      const launched = await voiceApi.launchCampaign(created.campaign._id, {
        mode: sendMode,
        ...(sendMode === "schedule" ? { scheduledAt: zonedLocalDateTimeToIso(scheduledAt, timezone) } : {}),
      });
      setCampaigns((current) => [launched.campaign, ...current.filter((item) => item._id !== launched.campaign._id)]);
      setNotice(
        sendMode === "schedule"
          ? `${campaignName.trim()} is scheduled. Calls will run automatically, even if you close this page.`
          : `${campaignName.trim()} is live. Calls will continue automatically, even if you close this page.`,
      );
      setIdempotencyKey(globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLaunching(false);
    }
  }

  async function controlCampaign(campaign: BackendCampaign, action: CampaignAction) {
    setError("");
    try {
      const result = action === "pause"
        ? await voiceApi.pauseCampaign(campaign._id)
        : action === "resume"
          ? await voiceApi.resumeCampaign(campaign._id)
          : await voiceApi.cancelCampaign(campaign._id);
      setCampaigns((current) => current.map((item) => item._id === campaign._id ? result.campaign : item));
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }

  if (!session) {
    return (
      <main className="app-strong grid min-h-screen place-items-center bg-[#f6f8fc] px-6">
        <div className="rounded-lg border border-[#dbe2ea] bg-white px-6 py-5 text-center shadow-sm">
          <span className="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-[#ecfeff] text-[#008996]">
            <Icon icon="spark" />
          </span>
          <p className="app-strong m-0">Loading campaigns</p>
          <p className="app-caption mt-1 mb-0">Checking your session and campaign workspace.</p>
        </div>
      </main>
    );
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
        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dbe2ea] bg-white px-4 py-4 shadow-sm sm:px-5">
            <div>
              <span className="app-label text-[#00b8c4]">Campaigns</span>
              <h1 className="m-0 text-xl font-semibold leading-7 text-[#0f172a]">Outbound campaigns</h1>
              <p className="app-caption mt-1 mb-0 text-[#475569]">Create campaigns, upload leads, control pacing, and monitor delivery.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-lg px-3 py-2 text-xs font-semibold ${selectedPhoneReady ? "bg-[#ecfdf5] text-[#047857]" : "bg-[#fff7ed] text-[#d97706]"}`}>
                {selectedPhoneReady ? "Route ready" : "Route needs setup"}
              </span>
              <span className="max-w-[360px] truncate rounded-lg bg-[#f1f5f9] px-3 py-2 text-xs font-semibold text-[#475569]">
                {routeSummary}
              </span>
            </div>
          </header>

          <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {campaignMetrics.map((metric) => (
              <MetricCard detail={metric.detail} icon={metric.icon} key={metric.label} label={metric.label} value={metric.value} />
            ))}
          </section>

          <form className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]" onSubmit={prepareCampaign}>
            <section className="grid min-w-0 content-start gap-5">
              {notice ? <Notice tone="success" message={notice} onClose={() => setNotice("")} /> : null}
              {error ? <Notice tone="error" message={error} onClose={() => setError("")} /> : null}

              <Panel>
                <SectionHeader
                  eyebrow="Step 01"
                  icon="target"
                  title="Campaign blueprint"
                  description="Name the campaign and choose the live assistant plus outbound caller ID that will carry the traffic."
                />

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <label className="app-label grid gap-2 lg:col-span-2">
                    Campaign name
                    <input className={controlClass} placeholder="June renewal follow-up" value={campaignName} onChange={(event) => setCampaignName(event.target.value)} />
                  </label>

                  <label className="app-label grid gap-2">
                    Assistant
                    <select className={controlClass} value={selectedAgentId} onChange={(event) => setSelectedAgentId(event.target.value)}>
                      <option value="">Select assistant</option>
                      {agents.map((agent) => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name} - {agent.status}
                        </option>
                      ))}
                    </select>
                    {selectedAgent && selectedAgent.status !== "Live" ? (
                      <span className="app-caption font-medium text-amber-700">This assistant must be Live before launch.</span>
                    ) : null}
                  </label>

                  <label className="app-label grid gap-2">
                    Outbound caller ID
                    <select className={controlClass} value={selectedPhoneId} onChange={(event) => setSelectedPhoneId(event.target.value)}>
                      <option value="">Select phone number</option>
                      {callableNumbers.map((number) => (
                        <option key={number._id} value={number._id}>
                          {number.number} - {number.provider} - {number.status}
                          {phoneAgentId(number) === selectedAgentId ? "" : " - different assistant"}
                        </option>
                      ))}
                    </select>
                    {selectedPhone && !selectedPhoneReady ? (
                      <span className="app-caption font-medium text-amber-700">Choose a Ready outbound caller ID assigned to this assistant.</span>
                    ) : null}
                  </label>
                </div>

                <div className="mt-5 grid gap-3 rounded-3xl border border-[#dff7fb] bg-[#f4fdff] p-4 sm:grid-cols-3">
                  <InfoPill icon="user" label="Assistant" value={selectedAgent?.name ?? "Not selected"} />
                  <InfoPill icon="phone" label="Caller ID" value={selectedPhone?.number ?? "Not selected"} />
                  <InfoPill icon="shield" label="Route status" value={selectedPhoneReady ? "Ready for outbound" : "Needs attention"} />
                </div>
              </Panel>

              <Panel>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <SectionHeader
                    eyebrow="Step 02"
                    icon="upload"
                    title="Audience intelligence"
                    description="Drop in a CSV, preview the rows, and catch invalid phone numbers before they enter the campaign queue."
                  />
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {csvFile ? `${csvFile.name} - ${formatFileSize(csvFile.size)}` : "No file chosen"}
                  </span>
                </div>

                <label
                  className="mt-6 grid min-h-[220px] cursor-pointer place-items-center rounded-[1.75rem] border border-dashed border-[#7dd3fc] bg-gradient-to-br from-white to-[#ecfeff] p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] transition hover:-translate-y-0.5 hover:border-[#00b8c4] hover:shadow-[0_20px_50px_rgba(14,165,233,0.12)]"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                >
                  <input className="sr-only" type="file" accept=".csv,text/csv" onChange={(event) => void handleCsv(event.target.files?.[0])} />
                  <span className="max-w-md">
                    <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-white text-[#00a6b4] shadow-[0_14px_30px_rgba(14,165,233,0.16)]">
                      <Icon icon="file" className="size-6" />
                    </span>
                    <strong className="block text-base font-semibold text-slate-950">Drop CSV or choose file</strong>
                    <span className="mt-2 block text-sm leading-6 text-slate-500">Up to 25MB. Required column: phone or phone_number. Optional: name, email, company, and custom fields.</span>
                  </span>
                </label>

                <div className={`mt-5 grid gap-3 rounded-3xl border p-4 sm:grid-cols-[auto_minmax(0,1fr)] ${
                  callWindowOpen ? "border-emerald-200 bg-emerald-50/80" : "border-amber-200 bg-amber-50/80"
                }`}>
                  <span className={`grid size-10 place-items-center rounded-2xl bg-white shadow-sm ${callWindowOpen ? "text-emerald-600" : "text-amber-600"}`}>
                    <Icon icon={callWindowOpen ? "check" : "warning"} />
                  </span>
                  <div className={callWindowOpen ? "text-emerald-900" : "text-amber-900"}>
                    <p className="app-body m-0 text-current">
                      {callWindowOpen
                        ? "The selected local call window is open now. Campaigns will still enforce opt-outs, caller ID readiness, pacing, and daily limits."
                        : `The selected local call window is closed now. Current ${timezone} time is ${formatLocalTime(now, timezone)}, so calls will wait for ${windowStart}-${windowEnd}.`}
                    </p>
                    {!callWindowOpen ? (
                      <button
                        className="mt-3 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:-translate-y-0.5 hover:bg-amber-100"
                        type="button"
                        onClick={() => {
                          setWindowStart("00:00");
                          setWindowEnd("23:59");
                        }}
                      >
                        Use 24-hour test window
                      </button>
                    ) : null}
                  </div>
                </div>

                {leads.length ? (
                  <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[#e2e8f0] bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e8f0] bg-slate-50/80 px-4 py-3">
                      <div>
                        <span className="text-sm font-semibold text-slate-950">{numberFormat(leads.length)} contacts loaded</span>
                        <p className="app-caption mt-1 mb-0">Showing first {previewLeads.length} rows for verification.</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${invalidLeadCount ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>
                        {invalidLeadCount ? `${invalidLeadCount} invalid phones` : "All numbers are E.164"}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px] text-left">
                        <thead className="bg-white text-[#64748b]">
                          <tr className="text-xs font-semibold uppercase tracking-[0.12em]">
                            <th className="px-4 py-3">Row</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Company</th>
                            <th className="px-4 py-3">Custom fields</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#edf0f4]">
                          {previewLeads.map((lead) => (
                            <tr className="transition hover:bg-[#f8fafc]" key={`${lead.row}-${lead.phone}`}>
                              <td className="app-body px-4 py-3 text-[#64748b]">{lead.row}</td>
                              <td className={`px-4 py-3 text-sm font-semibold ${isDialable(lead.phone) ? "text-slate-950" : "text-red-600"}`}>{lead.phone}</td>
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
              </Panel>

              <Panel>
                <SectionHeader
                  eyebrow="Step 03"
                  icon="clock"
                  title="Timing and pacing"
                  description="Decide when the campaign starts, which local window it can call inside, and how aggressively it should dial."
                />

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <ModeCard
                    active={sendMode === "now"}
                    description="Launch the campaign and start calling immediately."
                    icon="play"
                    title="Send now"
                    onClick={() => setSendMode("now")}
                  />
                  <ModeCard
                    active={sendMode === "schedule"}
                    description="Queue it for a specific local date and time."
                    icon="calendar"
                    title="Schedule"
                    onClick={() => setSendMode("schedule")}
                  />
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {sendMode === "schedule" ? (
                    <>
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
                    </>
                  ) : (
                    <div className="rounded-3xl border border-[#dff7fb] bg-[#f4fdff] p-4 lg:col-span-2">
                      <span className="app-label text-[#008996]">Launch mode</span>
                      <p className="mt-1 mb-0 text-sm font-semibold text-slate-950">
                        {callWindowOpen ? "Immediate launch after campaign creation" : "Launch now, call when the window opens"}
                      </p>
                      <p className="app-caption mt-1 mb-0">Calls still respect business hours, concurrency, daily caps, and suppression rules.</p>
                      {!callWindowOpen ? (
                        <button
                          className="mt-3 rounded-full border border-[#67e8f9] bg-white px-3 py-1.5 text-xs font-semibold text-[#008996] transition hover:-translate-y-0.5 hover:bg-[#ecfeff]"
                          type="button"
                          onClick={() => {
                            setWindowStart("00:00");
                            setWindowEnd("23:59");
                          }}
                        >
                          Call immediately for test
                        </button>
                      ) : null}
                    </div>
                  )}
                  <label className="app-label grid gap-2">
                    Local call window
                    <span className="grid grid-cols-2 gap-2">
                      <input className={controlClass} type="time" value={windowStart} onChange={(event) => setWindowStart(event.target.value)} />
                      <input className={controlClass} type="time" value={windowEnd} onChange={(event) => setWindowEnd(event.target.value)} />
                    </span>
                  </label>
                </div>

                <div className="mt-6 grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-2 xl:grid-cols-4">
                  <label className="app-label grid gap-2">
                    Daily limit
                    <input className={controlClass} min={1} max={100000} type="number" value={dailyLimit} onChange={(event) => setDailyLimit(Number(event.target.value))} />
                  </label>
                  <label className="app-label grid gap-2">
                    Concurrent calls
                    <input className={controlClass} min={1} max={100} type="number" value={concurrency} onChange={(event) => setConcurrency(Number(event.target.value))} />
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
              </Panel>

              <Panel>
                <SectionHeader
                  eyebrow="Step 04"
                  icon="spark"
                  title="Conversation objective"
                  description="Give the assistant campaign-specific context so every call has the right goal and success signal."
                />

                <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                  <label className="app-label grid gap-2">
                    Goal
                    <textarea
                      className="app-control-text min-h-36 resize-y rounded-2xl border border-[#d8e0eb] bg-white/95 p-4 text-[#0f172a] shadow-[0_1px_0_rgba(15,23,42,0.02)] outline-none transition placeholder:text-[#94a3b8] hover:border-[#b7c4d7] focus:border-[#00b8c4] focus:ring-4 focus:ring-[#00b8c4]/10"
                      placeholder="Confirm appointment interest and capture preferred callback time."
                      value={campaignGoal}
                      onChange={(event) => setCampaignGoal(event.target.value)}
                    />
                  </label>
                  <div className="grid gap-4">
                    <label className="app-label grid gap-2">
                      Success criteria
                      <input className={controlClass} placeholder="Booked demo, qualified lead, reminder accepted..." value={successCriteria} onChange={(event) => setSuccessCriteria(event.target.value)} />
                    </label>
                    <div className="rounded-3xl border border-cyan-200 bg-cyan-50/80 p-4">
                      <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm">
                        <Icon icon="target" />
                      </span>
                      <p className="mt-3 mb-0 text-sm font-semibold text-cyan-950">These instructions are applied to every call in this campaign.</p>
                      <p className="app-caption mt-1 mb-0 text-cyan-800">That keeps the base assistant reusable while each campaign carries its own mission.</p>
                    </div>
                  </div>
                </div>
              </Panel>
            </section>

            <aside className="min-w-0">
              <div className="grid gap-5 xl:sticky xl:top-8">
                <Panel compact>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="app-label text-[#008996]">Launch console</span>
                      <h2 className="mt-1 mb-0 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                        {canPrepare ? "Ready to launch" : "Preflight in progress"}
                      </h2>
                    </div>
                    <span className={`grid size-12 place-items-center rounded-2xl ${canPrepare ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      <Icon icon={canPrepare ? "check" : "shield"} className="size-5" />
                    </span>
                  </div>

                  <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-slate-700">Readiness score</span>
                      <span className="text-sm font-bold text-slate-950">{readinessPercent}%</span>
                    </div>
                    <ProgressBar value={readinessPercent} className="mt-3" />
                    <p className="app-caption mt-3 mb-0">{completedReadyChecks} of {readyChecks.length} checks completed.</p>
                  </div>

                  <div className="mt-5 grid gap-2.5">
                    {readyChecks.map((check) => (
                      <ReadinessRow key={check.label} label={check.label} ready={check.ready} />
                    ))}
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-5">
                    <h3 className="app-section-title m-0">Compliance guardrails</h3>
                    <div className="mt-3 grid gap-3">
                      <ToggleRow title="Respect opt-outs" detail="Required for launch" enabled={respectDnc} onChange={setRespectDnc} />
                      <ToggleRow title="Voicemail detection" detail="Outcome tagging" enabled={detectVoicemail} onChange={setDetectVoicemail} />
                      <ToggleRow title="Consent opening" detail="Identity and purpose" enabled={requireConsentLine} onChange={setRequireConsentLine} />
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-5">
                    <h3 className="app-section-title m-0">Launch summary</h3>
                    <dl className="mt-4 grid gap-3">
                      <SummaryRow label="Contacts" value={numberFormat(leads.length)} />
                      <SummaryRow label="Invalid phones" value={numberFormat(invalidLeadCount)} warn={invalidLeadCount > 0} />
                      <SummaryRow label="Batches" value={numberFormat(estimatedBatches)} />
                      <SummaryRow label="Caller ID" value={selectedPhone?.number ?? "Not selected"} />
                      <SummaryRow label="Assistant" value={selectedAgent?.name ?? "Not selected"} />
                      <SummaryRow label="Launch" value={launchModeSummary} />
                    </dl>
                    <button className={`${buttonClass} mt-5 w-full bg-[#00b8c4] text-white shadow-sm hover:bg-[#008996]`} disabled={loading || launching || !canPrepare} type="submit">
                      <Icon icon="play" /> {launching ? "Launching..." : sendMode === "now" ? callWindowOpen ? "Start calls now" : "Queue until call window" : "Schedule campaign"}
                    </button>
                    <p className="app-caption mt-3 mb-0 text-center">
                      {sendMode === "now"
                        ? callWindowOpen ? "Calls start immediately after launch." : `Calls start when the ${windowStart}-${windowEnd} local window opens.`
                        : "Calls start at the scheduled time."}
                    </p>
                  </div>
                </Panel>

              </div>
            </aside>
          </form>
          <CampaignOperationsSection campaigns={campaigns} onControl={controlCampaign} />
        </div>
      </section>
    </main>
  );
}

function Panel({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <section className={`overflow-hidden rounded-lg border border-[#dbe2ea] bg-white shadow-sm ${compact ? "p-4 sm:p-5" : "p-5 sm:p-6"}`}>
      {children}
    </section>
  );
}

function SectionHeader({ description, eyebrow, icon, title }: { description: string; eyebrow: string; icon: IconName; title: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#ecfeff] text-[#008996]">
        <Icon icon={icon} className="size-5" />
      </span>
      <div className="min-w-0">
        <span className="app-label text-[#008996]">{eyebrow}</span>
        <h2 className="app-section-title mt-1 mb-0">{title}</h2>
        <p className="app-body mt-1 mb-0 max-w-3xl text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function MetricCard({ detail, icon, label, value }: { detail: string; icon: IconName; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#dbe2ea] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="app-caption block">{label}</span>
          <strong className="app-value mt-2 block">{value}</strong>
        </div>
        <span className="grid size-10 place-items-center rounded-lg bg-[#ecfeff] text-[#008996]">
          <Icon icon={icon} />
        </span>
      </div>
      <p className="app-caption mt-3 mb-0">{detail}</p>
    </div>
  );
}

function InfoPill({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ecfeff] text-[#008996]">
        <Icon icon={icon} className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="app-caption block">{label}</span>
        <strong className="block truncate text-sm font-semibold text-slate-950">{value}</strong>
      </span>
    </div>
  );
}

function ModeCard({ active, description, icon, onClick, title }: {
  active: boolean;
  description: string;
  icon: IconName;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      className={`rounded-[1.5rem] border p-4 text-left transition hover:-translate-y-0.5 ${
        active
          ? "border-[#00b8c4] bg-[#ecfeff] shadow-[0_18px_42px_rgba(0,184,196,0.13)] ring-4 ring-[#00b8c4]/10"
          : "border-slate-200 bg-white hover:border-[#7dd3fc] hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)]"
      }`}
      onClick={onClick}
      type="button"
      aria-pressed={active}
    >
      <span className="flex items-center gap-3">
        <span className={`grid size-11 place-items-center rounded-2xl ${active ? "bg-white text-[#008996]" : "bg-slate-100 text-slate-500"}`}>
          <Icon icon={icon} />
        </span>
        <span>
          <strong className="block text-sm font-semibold text-slate-950">{title}</strong>
          <span className="app-caption mt-1 block">{description}</span>
        </span>
      </span>
    </button>
  );
}

function ProgressBar({ className = "", value }: { className?: string; value: number }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-slate-200 ${className}`}>
      <div className="h-full rounded-full bg-gradient-to-r from-[#00b8c4] via-[#22d3ee] to-[#7c3aed] transition-all" style={{ width: `${progressValue(value)}%` }} />
    </div>
  );
}

function ReadinessRow({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className={`grid size-7 shrink-0 place-items-center rounded-full ${ready ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
        <Icon icon={ready ? "check" : "info"} className="size-3.5" />
      </span>
    </div>
  );
}

function SummaryRow({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="app-caption">{label}</dt>
      <dd className={`m-0 max-w-[210px] truncate text-right text-sm font-semibold ${warn ? "text-amber-700" : "text-slate-950"}`}>{value}</dd>
    </div>
  );
}

function CampaignOperationsSection({
  campaigns,
  onControl,
}: {
  campaigns: BackendCampaign[];
  onControl: (campaign: BackendCampaign, action: CampaignAction) => void | Promise<void>;
}) {
  return (
    <section className="mt-5 overflow-hidden rounded-lg border border-[#dbe2ea] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f4] bg-[#fbfdff] px-4 py-4 sm:px-5">
        <div>
          <span className="app-label text-[#00b8c4]">Live operations</span>
          <h2 className="app-section-title mt-1 mb-0">Recent campaigns</h2>
          <p className="app-caption mt-1 mb-0">Track status, progress, call results, pacing, and actions for each campaign.</p>
        </div>
        <span className="rounded-lg bg-[#f1f5f9] px-3 py-2 text-xs font-semibold text-[#475569]">
          {numberFormat(campaigns.length)} total
        </span>
      </div>

      {campaigns.length ? (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="bg-white text-[#64748b]">
                <tr className="text-xs font-semibold uppercase tracking-[0.12em]">
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Leads</th>
                  <th className="px-4 py-3">Results</th>
                  <th className="px-4 py-3">Pacing</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f4]">
                {campaigns.slice(0, 10).map((campaign) => (
                  <tr className="align-top transition hover:bg-[#fbfdff]" key={campaign._id}>
                    <td className="px-4 py-4">
                      <strong className="block max-w-[220px] truncate text-sm font-semibold text-[#0f172a]">{campaign.name}</strong>
                      <span className="app-caption mt-1 block">Created {formatDateTime(campaign.createdAt, campaign.timezone)}</span>
                    </td>
                    <td className="px-4 py-4"><StatusPill status={campaign.status} /></td>
                    <td className="px-4 py-4">
                      <div className="min-w-[150px]">
                        <div className="mb-2 flex justify-between gap-3 text-xs font-semibold text-[#475569]">
                          <span>{campaign.stats.progressPercent}%</span>
                          <span>{numberFormat(campaign.stats.processed)}/{numberFormat(campaign.stats.total)}</span>
                        </div>
                        <ProgressBar value={campaign.stats.progressPercent} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="block text-sm font-semibold text-[#0f172a]">{numberFormat(campaign.totalLeads || campaign.stats.total)}</span>
                      <span className="app-caption">queued {numberFormat(campaign.stats.queued + campaign.stats.retry_wait)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="grid gap-1 text-xs font-medium text-[#475569]">
                        <span>Completed: <strong className="text-[#047857]">{numberFormat(campaign.stats.completed)}</strong></span>
                        <span>Failed: <strong className="text-[#dc2626]">{numberFormat(campaign.stats.failed)}</strong></span>
                        <span>Suppressed: <strong className="text-[#d97706]">{numberFormat(campaign.stats.suppressed)}</strong></span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="block text-sm font-semibold text-[#0f172a]">{numberFormat(campaign.concurrency)} concurrent</span>
                      <span className="app-caption">{numberFormat(campaign.dailyLimit)} per day</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="block text-sm font-semibold text-[#0f172a]">{campaign.windowStart}-{campaign.windowEnd}</span>
                      <span className="app-caption">{campaign.scheduledAt ? formatDateTime(campaign.scheduledAt, campaign.timezone) : campaign.timezone}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="app-caption">{formatDateTime(campaign.updatedAt, campaign.timezone)}</span>
                      {campaign.lastWorkerError ? <p className="mt-2 max-w-[220px] rounded-lg bg-[#fff1f2] px-2 py-1 text-xs font-medium text-[#dc2626]">{campaign.lastWorkerError}</p> : null}
                    </td>
                    <td className="px-4 py-4">
                      <CampaignActions campaign={campaign} onControl={(action) => onControl(campaign, action)} align="end" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 p-4 lg:hidden">
            {campaigns.slice(0, 10).map((campaign) => (
              <CampaignCard campaign={campaign} key={campaign._id} onControl={(action) => onControl(campaign, action)} />
            ))}
          </div>
        </>
      ) : (
        <div className="p-4">
          <EmptyState
            icon="calendar"
            title="No campaigns yet"
            description="Your launched and scheduled campaigns will appear here with progress, results, and controls."
          />
        </div>
      )}
    </section>
  );
}

function StatusPill({ status }: { status: BackendCampaign["status"] }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTheme(status)}`}>
      {statusCopy(status)}
    </span>
  );
}

function CampaignActions({
  align = "start",
  campaign,
  onControl,
}: {
  align?: "end" | "start";
  campaign: BackendCampaign;
  onControl: (action: CampaignAction) => void | Promise<void>;
}) {
  const canPause = campaign.status === "running" || campaign.status === "scheduled";
  const canResume = campaign.status === "paused";
  const canCancel = ["running", "scheduled", "paused"].includes(campaign.status);
  if (!canPause && !canResume && !canCancel) {
    return <span className="app-caption block text-right">No actions</span>;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${align === "end" ? "justify-end" : ""}`}>
      {canPause ? <CampaignActionButton tone="neutral" onClick={() => onControl("pause")}>Pause</CampaignActionButton> : null}
      {canResume ? <CampaignActionButton tone="success" onClick={() => onControl("resume")}>Resume</CampaignActionButton> : null}
      {canCancel ? <CampaignActionButton tone="danger" onClick={() => onControl("cancel")}>Cancel</CampaignActionButton> : null}
    </div>
  );
}

function CampaignCard({ campaign, onControl }: { campaign: BackendCampaign; onControl: (action: CampaignAction) => void }) {
  const canPause = campaign.status === "running" || campaign.status === "scheduled";
  const canResume = campaign.status === "paused";
  const canCancel = ["running", "scheduled", "paused"].includes(campaign.status);

  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <strong className="block truncate text-sm font-semibold text-slate-950">{campaign.name}</strong>
          <span className="app-caption mt-1 block">
            {numberFormat(campaign.stats.processed)}/{numberFormat(campaign.stats.total)} processed
          </span>
        </div>
        <StatusPill status={campaign.status} />
      </div>
      <ProgressBar value={campaign.stats.progressPercent} className="mt-3" />
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <MiniStat label="Done" value={numberFormat(campaign.stats.completed)} />
        <MiniStat label="Failed" value={numberFormat(campaign.stats.failed)} />
        <MiniStat label="DNC" value={numberFormat(campaign.stats.suppressed)} />
      </div>
      {campaign.scheduledAt ? (
        <p className="app-caption mt-3 mb-0">Scheduled: {formatDateTime(campaign.scheduledAt, campaign.timezone)}</p>
      ) : null}
      {campaign.lastWorkerError ? (
        <p className="mt-3 mb-0 rounded-2xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{campaign.lastWorkerError}</p>
      ) : null}
      {canPause || canResume || canCancel ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {canPause ? <CampaignActionButton tone="neutral" onClick={() => onControl("pause")}>Pause</CampaignActionButton> : null}
          {canResume ? <CampaignActionButton tone="success" onClick={() => onControl("resume")}>Resume</CampaignActionButton> : null}
          {canCancel ? <CampaignActionButton tone="danger" onClick={() => onControl("cancel")}>Cancel</CampaignActionButton> : null}
        </div>
      ) : null}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-2xl bg-slate-50 px-2 py-2">
      <span className="block text-[11px] font-medium text-slate-400">{label}</span>
      <strong className="block text-xs font-semibold text-slate-800">{value}</strong>
    </span>
  );
}

function CampaignActionButton({ children, onClick, tone }: { children: ReactNode; onClick: () => void; tone: "danger" | "neutral" | "success" }) {
  const toneClass = tone === "danger"
    ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
    : tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100";
  return (
    <button className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${toneClass}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function EmptyState({ description, icon, title }: { description: string; icon: IconName; title: string }) {
  return (
    <div className="rounded-[1.35rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
      <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-white text-slate-500 shadow-sm">
        <Icon icon={icon} />
      </span>
      <strong className="mt-3 block text-sm font-semibold text-slate-950">{title}</strong>
      <p className="app-caption mt-1 mb-0">{description}</p>
    </div>
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
      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
      onClick={() => onChange(!enabled)}
      type="button"
      aria-pressed={enabled}
    >
      <span>
        <strong className="block text-sm font-semibold text-slate-950">{title}</strong>
        <span className="app-caption mt-1 block">{detail}</span>
      </span>
      <span className={`relative h-6 w-11 rounded-full transition ${enabled ? "bg-[#00b8c4]" : "bg-slate-300"}`}>
        <span className={`absolute top-1 size-4 rounded-full bg-white shadow transition ${enabled ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}

function Notice({ message, onClose, tone }: { message: string; onClose: () => void; tone: "error" | "success" }) {
  const success = tone === "success";
  return (
    <div className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 shadow-sm ${success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
      <span className="text-sm font-medium leading-6">{message}</span>
      <button className="grid size-7 shrink-0 place-items-center rounded-lg hover:bg-black/5" onClick={onClose} type="button" aria-label="Dismiss">
        <Icon icon="close" className="size-3.5" />
      </button>
    </div>
  );
}

