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
import {
  voiceApi,
  type AgentSummary,
  type BackendCampaign,
  type BackendCampaignLead,
  type BackendPhoneNumber,
  type CampaignAuditLogEntry,
  type CampaignLeadStatus,
  type CampaignOperationsHealth,
  type CampaignPagination,
  type PricingGuide,
} from "@/lib/voice";

type IconName = "activity" | "bolt" | "calendar" | "check" | "clock" | "close" | "file" | "info" | "phone" | "play" | "shield" | "spark" | "target" | "upload" | "user" | "users" | "warning";
type CampaignLead = {
  row: number;
  phone: string;
  name: string;
  email: string;
  company: string;
  doNotCall: boolean;
  customFields: Record<string, string>;
};
type SendMode = "now" | "schedule";
type CampaignAction = "pause" | "resume" | "cancel";
type CsvMapping = Record<"phone" | "name" | "email" | "company" | "doNotCall", string>;
type ComplianceCertification = {
  consentBasis: boolean;
  optOutSuppression: boolean;
  callerIdentity: boolean;
  quietHours: boolean;
};

const maxCsvSize = 25 * 1024 * 1024;
const emptyCsvMapping: CsvMapping = { phone: "", name: "", email: "", company: "", doNotCall: "" };
const emptyPagination: CampaignPagination = { page: 1, limit: 25, total: 0, pages: 1 };
const leadStatuses: Array<CampaignLeadStatus | ""> = ["", "queued", "leased", "active", "retry_wait", "completed", "failed", "suppressed", "cancelled"];
const buttonClass =
  "app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 transition disabled:cursor-not-allowed disabled:opacity-50";
const controlClass =
  "app-control-text min-h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#00b8c4] focus:ring-4 focus:ring-[#00b8c4]/10";

function createIdempotencyKey() {
  return globalThis.crypto?.randomUUID?.() ?? `${new Date().getTime()}-${Math.random().toString(36).slice(2)}`;
}

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

function inferCsvMapping(headers: string[]): CsvMapping {
  const normalized = headers.map(normalizeHeader);
  const find = (names: string[]) => {
    const index = normalized.findIndex((header) => names.includes(header));
    return index >= 0 ? String(index) : "";
  };
  return {
    phone: find(["phone", "phonenumber", "mobile", "mobilenumber", "number", "contact"]),
    name: find(["name", "fullname", "customername", "leadname"]),
    email: find(["email", "emailaddress"]),
    company: find(["company", "business", "organization"]),
    doNotCall: find(["dnc", "donotcall", "optout", "optedout", "unsubscribed"]),
  };
}

function truthyCell(value: string) {
  return ["1", "true", "yes", "y", "optout", "optedout", "do not call", "dnc", "unsubscribed"].includes(value.trim().toLowerCase());
}

function csvLeadsFromMapping(headers: string[], rows: string[][], mapping: CsvMapping): CampaignLead[] {
  const phoneIndex = Number(mapping.phone);
  if (!Number.isInteger(phoneIndex) || phoneIndex < 0) return [];
  const mappedIndices = new Set(
    Object.values(mapping)
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 0),
  );
  const indexValue = (row: string[], value: string) => {
    const index = Number(value);
    return Number.isInteger(index) && index >= 0 ? row[index]?.trim() ?? "" : "";
  };

  return rows.map((row, index) => {
    const customFields: Record<string, string> = {};
    headers.forEach((header, headerIndex) => {
      if (mappedIndices.has(headerIndex)) return;
      const value = row[headerIndex]?.trim();
      if (value) customFields[header?.trim() || `Column ${headerIndex + 1}`] = value;
    });
    return {
      row: index + 2,
      phone: indexValue(row, mapping.phone).replace(/[^\d+]/g, ""),
      name: indexValue(row, mapping.name),
      email: indexValue(row, mapping.email),
      company: indexValue(row, mapping.company),
      doNotCall: truthyCell(indexValue(row, mapping.doNotCall)),
      customFields,
    };
  }).filter((lead) => lead.phone);
}

function estimateCampaignCredits(input: {
  leads: number;
  maxAttempts: number;
  averageMinutes: number;
  pricing: PricingGuide | null;
}) {
  const pricing = input.pricing ?? {
    currency: "USD",
    llmPerMillionTokens: 0.4,
    sttPerMinute: 0.006,
    ttsPerMillionCharacters: 15,
    telephonyPerMinute: 0.012,
    markupMultiplier: 2.5,
  };
  const llmCostPerMinute = (pricing.llmPerMillionTokens * 1_200) / 1_000_000;
  const ttsCostPerMinute = (pricing.ttsPerMillionCharacters * 900) / 1_000_000;
  const providerPerMinute = pricing.telephonyPerMinute + pricing.sttPerMinute + llmCostPerMinute + ttsCostPerMinute;
  const attempts = Math.max(1, Math.floor(input.maxAttempts));
  const minutes = Math.max(0.25, input.averageMinutes);
  return Math.round(input.leads * attempts * minutes * providerPerMinute * pricing.markupMultiplier * 100) / 100;
}

function defaultSpendLimitCredits(input: {
  leads: number;
  maxAttempts: number;
  averageMinutes: number;
  pricing: PricingGuide | null;
}) {
  const estimate = estimateCampaignCredits(input);
  return estimate ? Math.ceil(estimate * 1.2 * 100) / 100 : 0;
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

function leadStatusCopy(status: CampaignLeadStatus | "") {
  return status ? status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ") : "All";
}

function leadStatusTheme(status: CampaignLeadStatus) {
  if (status === "completed") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "active" || status === "leased") return "border-sky-200 bg-sky-50 text-sky-700";
  if (status === "retry_wait") return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "failed" || status === "cancelled") return "border-red-200 bg-red-50 text-red-700";
  if (status === "suppressed") return "border-orange-200 bg-orange-50 text-orange-700";
  return "border-slate-200 bg-white text-slate-600";
}

function progressValue(value: number) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
}

function numberFormat(value: number) {
  return value.toLocaleString("en-IN");
}

function moneyFormat(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatDuration(seconds: number) {
  if (!seconds) return "0s";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return minutes ? `${minutes}m ${rest}s` : `${rest}s`;
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
  const [campaignPagination, setCampaignPagination] = useState<CampaignPagination>(emptyPagination);
  const [campaignPage, setCampaignPage] = useState(1);
  const [campaignSearch, setCampaignSearch] = useState("");
  const [campaignStatus, setCampaignStatus] = useState<BackendCampaign["status"] | "">("");
  const [operationsHealth, setOperationsHealth] = useState<CampaignOperationsHealth | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [selectedPhoneId, setSelectedPhoneId] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [sendMode, setSendMode] = useState<SendMode>("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [pricingGuide, setPricingGuide] = useState<PricingGuide | null>(null);
  const [dailyLimit, setDailyLimit] = useState(250);
  const [concurrency, setConcurrency] = useState(3);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [retryGapHours, setRetryGapHours] = useState(24);
  const [averageCallMinutes, setAverageCallMinutes] = useState(3);
  const [spendLimitCredits, setSpendLimitCredits] = useState(0);
  const [spendLimitTouched, setSpendLimitTouched] = useState(false);
  const [windowStart, setWindowStart] = useState("10:00");
  const [windowEnd, setWindowEnd] = useState("18:00");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");
  const [respectDnc, setRespectDnc] = useState(true);
  const [detectVoicemail, setDetectVoicemail] = useState(true);
  const [requireConsentLine, setRequireConsentLine] = useState(true);
  const [certification, setCertification] = useState<ComplianceCertification>({
    consentBasis: false,
    optOutSuppression: false,
    callerIdentity: false,
    quietHours: false,
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvMapping, setCsvMapping] = useState<CsvMapping>(emptyCsvMapping);
  const [leads, setLeads] = useState<CampaignLead[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [leadRows, setLeadRows] = useState<BackendCampaignLead[]>([]);
  const [leadPagination, setLeadPagination] = useState<CampaignPagination>({ ...emptyPagination, limit: 50 });
  const [leadPage, setLeadPage] = useState(1);
  const [leadStatus, setLeadStatus] = useState<CampaignLeadStatus | "">("");
  const [leadSearch, setLeadSearch] = useState("");
  const [auditLogs, setAuditLogs] = useState<CampaignAuditLogEntry[]>([]);
  const [leadLoading, setLeadLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [idempotencyKey, setIdempotencyKey] = useState(createIdempotencyKey);

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
        voiceApi.campaigns({ page: campaignPage, status: campaignStatus, search: campaignSearch }),
        voiceApi.campaignOperationsHealth(),
        voiceApi.config(),
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
      const [agentResult, numberResult, campaignResult, healthResult, configResult] = dataResult.value;
      if (cancelled) return;
      const firstAgentId = agentResult.agents[0]?._id || "";
      const firstReadyCallerId = numberResult.numbers.find(
        (number) => number.direction !== "Inbound" && number.status === "Ready" && phoneAgentId(number) === firstAgentId,
      );
      const firstCallerId = firstReadyCallerId ?? numberResult.numbers.find((number) => number.direction !== "Inbound");
      setAgents(agentResult.agents);
      setNumbers(numberResult.numbers);
      setCampaigns(campaignResult.campaigns);
      setCampaignPagination(campaignResult.pagination);
      setOperationsHealth(healthResult);
      setPricingGuide(configResult.pricing);
      setSelectedCampaignId((current) => (
        campaignResult.campaigns.some((campaign) => campaign._id === current)
          ? current
          : campaignResult.campaigns[0]?._id || ""
      ));
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
  }, [campaignPage, campaignSearch, campaignStatus, router, session]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    const refresh = () => {
      void Promise.all([
        voiceApi.campaigns({ page: campaignPage, status: campaignStatus, search: campaignSearch }),
        voiceApi.campaignOperationsHealth(),
      ]).then(([campaignResult, healthResult]) => {
        if (!cancelled) {
          setCampaigns(campaignResult.campaigns);
          setCampaignPagination(campaignResult.pagination);
          setOperationsHealth(healthResult);
          setSelectedCampaignId((current) => (
            campaignResult.campaigns.some((campaign) => campaign._id === current)
              ? current
              : campaignResult.campaigns[0]?._id || ""
          ));
        }
      }).catch(() => undefined);
    };
    const timer = window.setInterval(refresh, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [campaignPage, campaignSearch, campaignStatus, session]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!session || !selectedCampaignId) {
      return;
    }
    let cancelled = false;
    void Promise.all([
      voiceApi.campaignLeads(selectedCampaignId, { page: leadPage, status: leadStatus, search: leadSearch }),
      voiceApi.campaignAuditLog(selectedCampaignId, { page: 1, limit: 8 }),
    ]).then(([leadResult, auditResult]) => {
      if (cancelled) return;
      setLeadRows(leadResult.leads);
      setLeadPagination(leadResult.pagination);
      setAuditLogs(auditResult.auditLogs);
    }).catch((caught) => {
      if (!cancelled) setError(errorMessage(caught));
    }).finally(() => {
      if (!cancelled) setLeadLoading(false);
    });
    return () => { cancelled = true; };
  }, [leadPage, leadSearch, leadStatus, selectedCampaignId, session]);

  const selectedAgent = useMemo(() => agents.find((agent) => agent._id === selectedAgentId) ?? null, [agents, selectedAgentId]);
  const selectedPhone = useMemo(() => numbers.find((number) => number._id === selectedPhoneId) ?? null, [numbers, selectedPhoneId]);
  const selectedCampaign = useMemo(() => campaigns.find((campaign) => campaign._id === selectedCampaignId) ?? null, [campaigns, selectedCampaignId]);
  const callableNumbers = numbers.filter((number) => number.direction !== "Inbound");
  const selectedPhoneReady = Boolean(
    selectedPhone
      && selectedPhone.status === "Ready"
      && selectedPhone.direction !== "Inbound"
      && phoneAgentId(selectedPhone) === selectedAgentId,
  );
  const normalizedDailyLimit = Math.max(1, Number.isFinite(dailyLimit) ? Math.floor(dailyLimit) : 1);
  const normalizedConcurrency = Math.max(1, Math.min(100, Number.isFinite(concurrency) ? Math.floor(concurrency) : 1));
  const normalizedMaxAttempts = Math.max(1, Math.min(10, Number.isFinite(maxAttempts) ? Math.floor(maxAttempts) : 1));
  const normalizedAverageCallMinutes = Math.max(0.25, Math.min(120, Number.isFinite(averageCallMinutes) ? averageCallMinutes : 3));
  const invalidLeadCount = leads.filter((lead) => !isDialable(lead.phone)).length;
  const optedOutImportCount = leads.filter((lead) => lead.doNotCall).length;
  const phoneColumnMapped = csvMapping.phone !== "";
  const certificationComplete = Object.values(certification).every(Boolean);
  const estimatedCostCredits = estimateCampaignCredits({
    leads: leads.length,
    maxAttempts: normalizedMaxAttempts,
    averageMinutes: normalizedAverageCallMinutes,
    pricing: pricingGuide,
  });
  const normalizedSpendLimitCredits = Math.max(0, Number.isFinite(spendLimitCredits) ? Math.round(spendLimitCredits * 100) / 100 : 0);
  const readyChecks = [
    { label: "Campaign name", ready: Boolean(campaignName.trim()) },
    { label: "Ready caller ID assigned", ready: selectedPhoneReady },
    { label: "Assistant is Live", ready: selectedAgent?.status === "Live" },
    { label: "CSV contacts uploaded", ready: leads.length > 0 },
    { label: "Phone column mapped", ready: phoneColumnMapped },
    { label: "All phone numbers E.164", ready: leads.length > 0 && invalidLeadCount === 0 },
    { label: "Compliance guardrails on", ready: respectDnc && requireConsentLine },
    { label: "Compliance certification", ready: certificationComplete },
    { label: "Spending limit set", ready: normalizedSpendLimitCredits > 0 },
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
      const rows = parseCsvRows(await file.text());
      if (rows.length < 2) throw new Error("CSV needs a header row and at least one contact.");
      const headers = rows[0];
      const bodyRows = rows.slice(1);
      const mapping = inferCsvMapping(headers);
      const parsed = csvLeadsFromMapping(headers, bodyRows, mapping);
      setCsvFile(file);
      setCsvHeaders(headers);
      setCsvRows(bodyRows);
      setCsvMapping(mapping);
      setLeads(parsed);
      setSpendLimitTouched(false);
      setSpendLimitCredits(defaultSpendLimitCredits({
        leads: parsed.length,
        maxAttempts: normalizedMaxAttempts,
        averageMinutes: normalizedAverageCallMinutes,
        pricing: pricingGuide,
      }));
      setNotice(
        mapping.phone
          ? `${parsed.length} contacts loaded from ${file.name}. Review the column mapping before launch.`
          : `${file.name} is loaded. Map the phone column before launch.`,
      );
    } catch (caught) {
      setCsvFile(null);
      setCsvHeaders([]);
      setCsvRows([]);
      setCsvMapping(emptyCsvMapping);
      setLeads([]);
      setError(errorMessage(caught));
    }
  }

  function updateCsvMapping(key: keyof CsvMapping, value: string) {
    const next = { ...csvMapping, [key]: value };
    const parsed = csvLeadsFromMapping(csvHeaders, csvRows, next);
    setCsvMapping(next);
    setLeads(parsed);
    if (!spendLimitTouched) {
      setSpendLimitCredits(defaultSpendLimitCredits({
        leads: parsed.length,
        maxAttempts: normalizedMaxAttempts,
        averageMinutes: normalizedAverageCallMinutes,
        pricing: pricingGuide,
      }));
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
    setConfirmOpen(true);
  }

  async function executeCampaignLaunch() {
    setConfirmOpen(false);
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
        maxAttempts: normalizedMaxAttempts,
        retryGapSeconds: Math.max(60, Math.floor(retryGapHours * 3600)),
        goal: campaignGoal.trim(),
        successCriteria: successCriteria.trim(),
        respectDnc,
        requireConsentLine,
        detectVoicemail,
        estimatedCostCredits,
        spendLimitCredits: normalizedSpendLimitCredits,
        estimatedCallSeconds: Math.round(normalizedAverageCallMinutes * 60),
      });
      const batchSize = 500;
      for (let index = 0; index < leads.length; index += batchSize) {
        await voiceApi.addCampaignLeads(created.campaign._id, leads.slice(index, index + batchSize));
        setNotice(`Uploaded ${Math.min(index + batchSize, leads.length).toLocaleString("en-IN")} of ${leads.length.toLocaleString("en-IN")} contacts...`);
      }
      const launched = await voiceApi.launchCampaign(created.campaign._id, {
        mode: sendMode,
        ...(sendMode === "schedule" ? { scheduledAt: zonedLocalDateTimeToIso(scheduledAt, timezone) } : {}),
        confirmLaunch: true,
        complianceCertification: {
          consentBasis: true,
          optOutSuppression: true,
          callerIdentity: true,
          quietHours: true,
        },
      });
      setCampaigns((current) => [launched.campaign, ...current.filter((item) => item._id !== launched.campaign._id)]);
      setSelectedCampaignId(launched.campaign._id);
      setNotice(
        sendMode === "schedule"
          ? `${campaignName.trim()} is scheduled. Calls will run automatically, even if you close this page.`
          : `${campaignName.trim()} is live. Calls will continue automatically, even if you close this page.`,
      );
      setIdempotencyKey(createIdempotencyKey());
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLaunching(false);
    }
  }

  async function exportSelectedLeads() {
    if (!selectedCampaignId) return;
    setExporting(true);
    setError("");
    try {
      const blob = await voiceApi.exportCampaignLeadsCsv(selectedCampaignId, { status: leadStatus, search: leadSearch });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const campaign = campaigns.find((item) => item._id === selectedCampaignId);
      link.href = url;
      link.download = `${campaign?.name?.replace(/[^a-z0-9_-]+/gi, "_") || "campaign"}-leads.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setExporting(false);
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

                {csvHeaders.length ? (
                  <div className="mt-5 rounded-[1.5rem] border border-[#dbe2ea] bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="app-label text-[#008996]">Column mapping</span>
                        <p className="app-caption mt-1 mb-0">Map CSV columns before upload. Unmapped columns are kept as custom fields.</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${phoneColumnMapped ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                        {phoneColumnMapped ? "Phone mapped" : "Phone required"}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                      <MappingSelect headers={csvHeaders} label="Phone" required value={csvMapping.phone} onChange={(value) => updateCsvMapping("phone", value)} />
                      <MappingSelect headers={csvHeaders} label="Name" value={csvMapping.name} onChange={(value) => updateCsvMapping("name", value)} />
                      <MappingSelect headers={csvHeaders} label="Email" value={csvMapping.email} onChange={(value) => updateCsvMapping("email", value)} />
                      <MappingSelect headers={csvHeaders} label="Company" value={csvMapping.company} onChange={(value) => updateCsvMapping("company", value)} />
                      <MappingSelect headers={csvHeaders} label="Opt-out" value={csvMapping.doNotCall} onChange={(value) => updateCsvMapping("doNotCall", value)} />
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <MiniStat label="Rows parsed" value={numberFormat(leads.length)} />
                      <MiniStat label="Invalid phones" value={numberFormat(invalidLeadCount)} />
                      <MiniStat label="Import opt-outs" value={numberFormat(optedOutImportCount)} />
                    </div>
                  </div>
                ) : null}

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
                            <th className="px-4 py-3">Opt-out</th>
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
                              <td className="px-4 py-3">
                                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${lead.doNotCall ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>
                                  {lead.doNotCall ? "Yes" : "No"}
                                </span>
                              </td>
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
                    <input
                      className={controlClass}
                      min={1}
                      max={5}
                      type="number"
                      value={maxAttempts}
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        setMaxAttempts(next);
                        if (!spendLimitTouched) {
                          setSpendLimitCredits(defaultSpendLimitCredits({
                            leads: leads.length,
                            maxAttempts: next,
                            averageMinutes: normalizedAverageCallMinutes,
                            pricing: pricingGuide,
                          }));
                        }
                      }}
                    />
                  </label>
                  <label className="app-label grid gap-2">
                    Retry gap hours
                    <input className={controlClass} min={1} max={168} type="number" value={retryGapHours} onChange={(event) => setRetryGapHours(Number(event.target.value))} />
                  </label>
                </div>

                <div className="mt-5 grid gap-4 rounded-[1.75rem] border border-[#dff7fb] bg-[#f4fdff] p-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
                  <div>
                    <span className="app-label text-[#008996]">Cost guardrail</span>
                    <p className="mt-1 mb-0 text-sm font-semibold text-slate-950">
                      Estimated ${estimatedCostCredits.toFixed(2)} for {numberFormat(leads.length)} leads
                    </p>
                    <p className="app-caption mt-1 mb-0">The backend enforces the hard limit and pauses the campaign before leasing more calls.</p>
                  </div>
                  <label className="app-label grid gap-2">
                    Avg call minutes
                    <input
                      className={controlClass}
                      min={0.25}
                      max={120}
                      step={0.25}
                      type="number"
                      value={averageCallMinutes}
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        setAverageCallMinutes(next);
                        if (!spendLimitTouched) {
                          setSpendLimitCredits(defaultSpendLimitCredits({
                            leads: leads.length,
                            maxAttempts: normalizedMaxAttempts,
                            averageMinutes: next,
                            pricing: pricingGuide,
                          }));
                        }
                      }}
                    />
                  </label>
                  <label className="app-label grid gap-2">
                    Hard spend limit
                    <input
                      className={controlClass}
                      min={1}
                      step={0.01}
                      type="number"
                      value={spendLimitCredits}
                      onChange={(event) => {
                        setSpendLimitTouched(true);
                        setSpendLimitCredits(Number(event.target.value));
                      }}
                    />
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
                    <div className="mt-4 grid gap-2.5 rounded-2xl border border-slate-200 bg-white p-3">
                      <CertificationCheck
                        checked={certification.consentBasis}
                        label="Consent or lawful basis verified"
                        onChange={(checked) => setCertification((current) => ({ ...current, consentBasis: checked }))}
                      />
                      <CertificationCheck
                        checked={certification.optOutSuppression}
                        label="Opt-out and DNC sources reviewed"
                        onChange={(checked) => setCertification((current) => ({ ...current, optOutSuppression: checked }))}
                      />
                      <CertificationCheck
                        checked={certification.callerIdentity}
                        label="Opening identifies business and purpose"
                        onChange={(checked) => setCertification((current) => ({ ...current, callerIdentity: checked }))}
                      />
                      <CertificationCheck
                        checked={certification.quietHours}
                        label="Calling window follows local rules"
                        onChange={(checked) => setCertification((current) => ({ ...current, quietHours: checked }))}
                      />
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-5">
                    <h3 className="app-section-title m-0">Launch summary</h3>
                    <dl className="mt-4 grid gap-3">
                      <SummaryRow label="Contacts" value={numberFormat(leads.length)} />
                      <SummaryRow label="Invalid phones" value={numberFormat(invalidLeadCount)} warn={invalidLeadCount > 0} />
                      <SummaryRow label="Import opt-outs" value={numberFormat(optedOutImportCount)} />
                      <SummaryRow label="Batches" value={numberFormat(estimatedBatches)} />
                      <SummaryRow label="Estimated cost" value={`$${estimatedCostCredits.toFixed(2)}`} />
                      <SummaryRow label="Spend limit" value={`$${normalizedSpendLimitCredits.toFixed(2)}`} warn={normalizedSpendLimitCredits < estimatedCostCredits} />
                      <SummaryRow label="Caller ID" value={selectedPhone?.number ?? "Not selected"} />
                      <SummaryRow label="Assistant" value={selectedAgent?.name ?? "Not selected"} />
                      <SummaryRow label="Launch" value={launchModeSummary} />
                    </dl>
                    <button className={`${buttonClass} mt-5 w-full bg-[#00b8c4] text-white shadow-sm hover:bg-[#008996]`} disabled={loading || launching || !canPrepare} type="submit">
                      <Icon icon="play" /> {launching ? "Launching..." : "Review and confirm"}
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
          <CampaignOperationsSection
            campaignPage={campaignPage}
            campaignPagination={campaignPagination}
            campaignSearch={campaignSearch}
            campaignStatus={campaignStatus}
            campaigns={campaigns}
            health={operationsHealth}
            selectedCampaignId={selectedCampaignId}
            onCampaignPageChange={setCampaignPage}
            onCampaignSearchChange={(value) => {
              setCampaignPage(1);
              setCampaignSearch(value);
            }}
            onCampaignStatusChange={(value) => {
              setCampaignPage(1);
              setCampaignStatus(value);
            }}
            onControl={controlCampaign}
            onInspect={(campaign) => {
              setLeadLoading(true);
              setSelectedCampaignId(campaign._id);
              setLeadPage(1);
            }}
          />
          <CampaignLeadOperationsPanel
            auditLogs={auditLogs}
            campaign={selectedCampaign}
            exporting={exporting}
            leadLoading={leadLoading}
            leadPage={leadPage}
            leadPagination={leadPagination}
            leadRows={leadRows}
            leadSearch={leadSearch}
            leadStatus={leadStatus}
            onExport={() => void exportSelectedLeads()}
            onLeadPageChange={(page) => {
              setLeadLoading(true);
              setLeadPage(page);
            }}
            onLeadSearchChange={(value) => {
              setLeadLoading(true);
              setLeadPage(1);
              setLeadSearch(value);
            }}
            onLeadStatusChange={(value) => {
              setLeadLoading(true);
              setLeadPage(1);
              setLeadStatus(value);
            }}
          />
        </div>
      </section>

      {confirmOpen ? (
        <LaunchConfirmModal
          averageCallMinutes={normalizedAverageCallMinutes}
          campaignName={campaignName.trim()}
          contacts={leads.length}
          estimatedCostCredits={estimatedCostCredits}
          invalidLeadCount={invalidLeadCount}
          launchModeSummary={launchModeSummary}
          optedOutImportCount={optedOutImportCount}
          routeSummary={routeSummary}
          spendLimitCredits={normalizedSpendLimitCredits}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => void executeCampaignLaunch()}
        />
      ) : null}
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

function MappingSelect({
  headers,
  label,
  onChange,
  required = false,
  value,
}: {
  headers: string[];
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="app-label grid gap-2">
      {label}{required ? " *" : ""}
      <select className={controlClass} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Do not map</option>
        {headers.map((header, index) => (
          <option key={`${header}-${index}`} value={String(index)}>
            {header || `Column ${index + 1}`}
          </option>
        ))}
      </select>
    </label>
  );
}

function CertificationCheck({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm font-medium text-slate-700">
      <input className="mt-1 size-4 rounded border-slate-300 accent-[#00b8c4]" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function HealthStat({ detail, label, tone, value }: { detail: string; label: string; tone: "danger" | "neutral" | "warning"; value: string }) {
  const toneClass = tone === "danger"
    ? "border-red-200 bg-red-50 text-red-800"
    : tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-slate-200 bg-slate-50 text-slate-800";
  return (
    <div className={`rounded-lg border px-3 py-2 ${toneClass}`}>
      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] opacity-70">{label}</span>
      <strong className="mt-1 block text-sm font-semibold">{value}</strong>
      <span className="mt-1 block truncate text-xs opacity-80">{detail}</span>
    </div>
  );
}

function PaginationBar({
  className = "",
  onPageChange,
  page,
  pagination,
}: {
  className?: string;
  onPageChange: (page: number) => void;
  page: number;
  pagination: CampaignPagination;
}) {
  const start = pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const end = Math.min(pagination.total, pagination.page * pagination.limit);
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <span className="app-caption">
        Showing {numberFormat(start)}-{numberFormat(end)} of {numberFormat(pagination.total)}
      </span>
      <div className="flex items-center gap-2">
        <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40" disabled={page <= 1} type="button" onClick={() => onPageChange(Math.max(1, page - 1))}>
          Previous
        </button>
        <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
          {numberFormat(pagination.page)} / {numberFormat(pagination.pages)}
        </span>
        <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40" disabled={page >= pagination.pages} type="button" onClick={() => onPageChange(Math.min(pagination.pages, page + 1))}>
          Next
        </button>
      </div>
    </div>
  );
}

function CampaignOperationsSection({
  campaignPage,
  campaignPagination,
  campaignSearch,
  campaignStatus,
  campaigns,
  health,
  selectedCampaignId,
  onCampaignPageChange,
  onCampaignSearchChange,
  onCampaignStatusChange,
  onControl,
  onInspect,
}: {
  campaignPage: number;
  campaignPagination: CampaignPagination;
  campaignSearch: string;
  campaignStatus: BackendCampaign["status"] | "";
  campaigns: BackendCampaign[];
  health: CampaignOperationsHealth | null;
  selectedCampaignId: string;
  onCampaignPageChange: (page: number) => void;
  onCampaignSearchChange: (value: string) => void;
  onCampaignStatusChange: (value: BackendCampaign["status"] | "") => void;
  onControl: (campaign: BackendCampaign, action: CampaignAction) => void | Promise<void>;
  onInspect: (campaign: BackendCampaign) => void;
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

      <div className="grid gap-3 border-b border-[#edf0f4] bg-white px-4 py-4 sm:px-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <HealthStat label="Worker" value={health?.worker.running ? "Running" : "Idle"} detail={health?.worker.lastCompletedAt ? `Last ${formatDateTime(health.worker.lastCompletedAt)}` : "No run yet"} tone={health?.worker.lastError ? "danger" : "neutral"} />
          <HealthStat label="Failed 24h" value={numberFormat(health?.failedCalls24h ?? 0)} detail={`${numberFormat(health?.providerErrors24h ?? 0)} provider errors`} tone={(health?.failedCalls24h ?? 0) > 0 ? "warning" : "neutral"} />
          <HealthStat label="Retry wait" value={numberFormat(health?.leads.retry_wait ?? 0)} detail={`${numberFormat(health?.staleLeases ?? 0)} stale leases`} tone={(health?.staleLeases ?? 0) > 0 ? "warning" : "neutral"} />
          <HealthStat label="Queued" value={numberFormat(health?.leads.queued ?? 0)} detail={`${numberFormat(health?.leads.active ?? 0)} active calls`} tone="neutral" />
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_170px]">
          <label className="app-label grid gap-2">
            Search campaigns
            <input className={controlClass} placeholder="Campaign name" value={campaignSearch} onChange={(event) => onCampaignSearchChange(event.target.value)} />
          </label>
          <label className="app-label grid gap-2">
            Status
            <select className={controlClass} value={campaignStatus} onChange={(event) => onCampaignStatusChange(event.target.value as BackendCampaign["status"] | "")}>
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="running">Running</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="failed">Failed</option>
            </select>
          </label>
        </div>
      </div>

      {campaigns.length ? (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1220px] text-left">
              <thead className="bg-white text-[#64748b]">
                <tr className="text-xs font-semibold uppercase tracking-[0.12em]">
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Leads</th>
                  <th className="px-4 py-3">Results</th>
                  <th className="px-4 py-3">Pacing</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f4]">
                {campaigns.map((campaign) => (
                  <tr className={`align-top transition hover:bg-[#fbfdff] ${selectedCampaignId === campaign._id ? "bg-[#f0fdff]" : ""}`} key={campaign._id}>
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
                      <span className="block text-sm font-semibold text-[#0f172a]">${campaign.cost.spentCredits.toFixed(2)}</span>
                      <span className="app-caption">limit ${campaign.cost.spendLimitCredits.toFixed(2)}</span>
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
                      <div className="grid justify-items-end gap-2">
                        <button className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-100" type="button" onClick={() => onInspect(campaign)}>
                          View leads
                        </button>
                        <CampaignActions campaign={campaign} onControl={(action) => onControl(campaign, action)} align="end" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 p-4 lg:hidden">
            {campaigns.map((campaign) => (
              <CampaignCard campaign={campaign} key={campaign._id} selected={selectedCampaignId === campaign._id} onInspect={() => onInspect(campaign)} onControl={(action) => onControl(campaign, action)} />
            ))}
          </div>

          <PaginationBar
            className="border-t border-[#edf0f4] px-4 py-3 sm:px-5"
            page={campaignPage}
            pagination={campaignPagination}
            onPageChange={onCampaignPageChange}
          />
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

function CampaignLeadOperationsPanel({
  auditLogs,
  campaign,
  exporting,
  leadLoading,
  leadPage,
  leadPagination,
  leadRows,
  leadSearch,
  leadStatus,
  onExport,
  onLeadPageChange,
  onLeadSearchChange,
  onLeadStatusChange,
}: {
  auditLogs: CampaignAuditLogEntry[];
  campaign: BackendCampaign | null;
  exporting: boolean;
  leadLoading: boolean;
  leadPage: number;
  leadPagination: CampaignPagination;
  leadRows: BackendCampaignLead[];
  leadSearch: string;
  leadStatus: CampaignLeadStatus | "";
  onExport: () => void;
  onLeadPageChange: (page: number) => void;
  onLeadSearchChange: (value: string) => void;
  onLeadStatusChange: (status: CampaignLeadStatus | "") => void;
}) {
  return (
    <section className="mt-5 overflow-hidden rounded-lg border border-[#dbe2ea] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f4] bg-[#fbfdff] px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <span className="app-label text-[#00b8c4]">Lead operations</span>
          <h2 className="app-section-title mt-1 mb-0 truncate">{campaign ? campaign.name : "Select a campaign"}</h2>
          <p className="app-caption mt-1 mb-0">Search leads, inspect retry state, export filtered rows, and review call outcomes.</p>
        </div>
        <button className={`${buttonClass} border border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100`} disabled={!campaign || exporting} type="button" onClick={onExport}>
          <Icon icon="file" /> {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {campaign ? (
        <>
          <div className="grid gap-3 border-b border-[#edf0f4] px-4 py-4 sm:grid-cols-[minmax(0,1fr)_180px] sm:px-5">
            <label className="app-label grid gap-2">
              Search leads
              <input className={controlClass} placeholder="Phone, name, email, company, error" value={leadSearch} onChange={(event) => onLeadSearchChange(event.target.value)} />
            </label>
            <label className="app-label grid gap-2">
              Lead status
              <select className={controlClass} value={leadStatus} onChange={(event) => onLeadStatusChange(event.target.value as CampaignLeadStatus | "")}>
                {leadStatuses.map((status) => (
                  <option key={status || "all"} value={status}>{leadStatusCopy(status)}</option>
                ))}
              </select>
            </label>
          </div>

          {leadLoading ? (
            <div className="p-5">
              <EmptyState icon="clock" title="Loading leads" description="Refreshing lead rows, retry state, and call history." />
            </div>
          ) : leadRows.length ? (
            <>
              <div className="hidden overflow-x-auto xl:block">
                <table className="w-full min-w-[1180px] text-left">
                  <thead className="bg-white text-[#64748b]">
                    <tr className="text-xs font-semibold uppercase tracking-[0.12em]">
                      <th className="px-4 py-3">Lead</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Attempts</th>
                      <th className="px-4 py-3">Retry</th>
                      <th className="px-4 py-3">Latest call</th>
                      <th className="px-4 py-3">Outcome history</th>
                      <th className="px-4 py-3">Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf0f4]">
                    {leadRows.map((lead) => (
                      <LeadTableRow lead={lead} key={lead._id} timezone={campaign.timezone} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 xl:hidden">
                {leadRows.map((lead) => (
                  <LeadCard lead={lead} key={lead._id} timezone={campaign.timezone} />
                ))}
              </div>

              <PaginationBar
                className="border-t border-[#edf0f4] px-4 py-3 sm:px-5"
                page={leadPage}
                pagination={leadPagination}
                onPageChange={onLeadPageChange}
              />
            </>
          ) : (
            <div className="p-5">
              <EmptyState icon="users" title="No leads found" description="Adjust search or status filters to find campaign leads." />
            </div>
          )}

          <div className="border-t border-[#edf0f4] bg-[#fbfdff] px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="app-label text-[#00b8c4]">Audit trail</span>
                <h3 className="app-section-title mt-1 mb-0">Recent campaign events</h3>
              </div>
              <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-600">{numberFormat(auditLogs.length)} shown</span>
            </div>
            <div className="mt-3 grid gap-2">
              {auditLogs.length ? auditLogs.map((entry) => (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2" key={entry._id}>
                  <span>
                    <strong className="block text-sm font-semibold text-slate-900">{entry.action.replace("campaign.", "").replace("_", " ")}</strong>
                    <span className="app-caption">{entry.actorEmail || "System"} - {formatDateTime(entry.createdAt, campaign.timezone)}</span>
                  </span>
                  {entry.after ? <span className="max-w-[420px] truncate text-xs font-medium text-slate-500">{JSON.stringify(entry.after)}</span> : null}
                </div>
              )) : (
                <p className="app-caption mb-0 rounded-lg border border-dashed border-slate-300 bg-white p-3">No campaign audit events yet.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="p-5">
          <EmptyState icon="users" title="No campaign selected" description="Choose View leads from a campaign row to inspect lead-level operations." />
        </div>
      )}
    </section>
  );
}

function LeadTableRow({ lead, timezone }: { lead: BackendCampaignLead; timezone: string }) {
  const latestCall = lead.callHistory[0];
  return (
    <tr className="align-top transition hover:bg-[#fbfdff]">
      <td className="px-4 py-4">
        <strong className="block text-sm font-semibold text-slate-950">{lead.name || lead.phone}</strong>
        <span className="app-caption mt-1 block">{lead.phone}</span>
        {lead.email ? <span className="app-caption block">{lead.email}</span> : null}
      </td>
      <td className="px-4 py-4"><LeadStatusPill status={lead.status} /></td>
      <td className="px-4 py-4">
        <span className="text-sm font-semibold text-slate-950">{numberFormat(lead.attemptCount)}</span>
        <span className="app-caption block">Row {numberFormat(lead.row)}</span>
      </td>
      <td className="px-4 py-4">
        <span className="app-caption">{lead.nextAttemptAt ? formatDateTime(lead.nextAttemptAt, timezone) : "Not scheduled"}</span>
      </td>
      <td className="px-4 py-4">
        {latestCall ? (
          <span>
            <strong className="block text-sm font-semibold text-slate-950">{latestCall.status}</strong>
            <span className="app-caption block">{formatDuration(latestCall.durationSeconds)} - {moneyFormat(latestCall.costCredits)}</span>
            <span className="app-caption block">{latestCall.startedAt ? formatDateTime(latestCall.startedAt, timezone) : "No start time"}</span>
          </span>
        ) : <span className="app-caption">No call yet</span>}
      </td>
      <td className="px-4 py-4">
        <div className="grid max-w-[280px] gap-1">
          {lead.callHistory.length ? lead.callHistory.map((call) => (
            <span className="truncate text-xs font-medium text-slate-600" key={call._id}>
              {call.status}: {call.endReason || call.errorMessage || "No outcome"}
            </span>
          )) : <span className="app-caption">Waiting for first attempt</span>}
        </div>
      </td>
      <td className="px-4 py-4">
        {lead.lastError || lead.suppressionReason ? (
          <p className="m-0 max-w-[260px] rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-700">{lead.lastError || lead.suppressionReason}</p>
        ) : <span className="app-caption">None</span>}
      </td>
    </tr>
  );
}

function LeadCard({ lead, timezone }: { lead: BackendCampaignLead; timezone: string }) {
  const latestCall = lead.callHistory[0];
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <strong className="block truncate text-sm font-semibold text-slate-950">{lead.name || lead.phone}</strong>
          <span className="app-caption mt-1 block">{lead.phone}</span>
        </span>
        <LeadStatusPill status={lead.status} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <MiniStat label="Attempts" value={numberFormat(lead.attemptCount)} />
        <MiniStat label="Calls" value={numberFormat(lead.callHistory.length)} />
        <MiniStat label="Row" value={numberFormat(lead.row)} />
      </div>
      {latestCall ? (
        <p className="app-caption mt-3 mb-0">
          Latest {latestCall.status}, {formatDuration(latestCall.durationSeconds)}, {latestCall.startedAt ? formatDateTime(latestCall.startedAt, timezone) : "no start time"}
        </p>
      ) : null}
      {lead.nextAttemptAt ? <p className="app-caption mt-2 mb-0">Next retry: {formatDateTime(lead.nextAttemptAt, timezone)}</p> : null}
      {lead.lastError || lead.suppressionReason ? (
        <p className="mt-3 mb-0 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{lead.lastError || lead.suppressionReason}</p>
      ) : null}
    </div>
  );
}

function LeadStatusPill({ status }: { status: CampaignLeadStatus }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${leadStatusTheme(status)}`}>
      {leadStatusCopy(status)}
    </span>
  );
}

function LaunchConfirmModal({
  averageCallMinutes,
  campaignName,
  contacts,
  estimatedCostCredits,
  invalidLeadCount,
  launchModeSummary,
  optedOutImportCount,
  onCancel,
  onConfirm,
  routeSummary,
  spendLimitCredits,
}: {
  averageCallMinutes: number;
  campaignName: string;
  contacts: number;
  estimatedCostCredits: number;
  invalidLeadCount: number;
  launchModeSummary: string;
  optedOutImportCount: number;
  onCancel: () => void;
  onConfirm: () => void;
  routeSummary: string;
  spendLimitCredits: number;
}) {
  const limitBelowEstimate = spendLimitCredits < estimatedCostCredits;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 py-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 bg-[#fbfdff] px-5 py-4">
          <span className="app-label text-[#00b8c4]">Final confirmation</span>
          <h2 className="mt-1 mb-0 text-xl font-semibold text-slate-950">Launch {campaignName}</h2>
          <p className="app-caption mt-1 mb-0">This creates the campaign, imports leads, records compliance certification, and starts or schedules calls.</p>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <SummaryTile label="Contacts" value={numberFormat(contacts)} detail={`${numberFormat(optedOutImportCount)} import opt-outs suppressed`} />
          <SummaryTile label="Route" value={routeSummary} detail={launchModeSummary} />
          <SummaryTile label="Estimated cost" value={moneyFormat(estimatedCostCredits)} detail={`${averageCallMinutes} minute average call assumption`} />
          <SummaryTile label="Hard spend limit" value={moneyFormat(spendLimitCredits)} detail={limitBelowEstimate ? "Limit is below estimate; campaign may pause early." : "Worker pauses at this cap."} warn={limitBelowEstimate} />
        </div>
        {invalidLeadCount ? (
          <div className="mx-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {numberFormat(invalidLeadCount)} invalid phone numbers must be fixed before launch.
          </div>
        ) : null}
        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button className={`${buttonClass} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`} type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className={`${buttonClass} bg-[#00b8c4] text-white hover:bg-[#008996]`} disabled={invalidLeadCount > 0} type="button" onClick={onConfirm}>
            <Icon icon="play" /> Confirm launch
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ detail, label, value, warn = false }: { detail: string; label: string; value: string; warn?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${warn ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"}`}>
      <span className="app-caption block">{label}</span>
      <strong className={`mt-2 block text-sm font-semibold ${warn ? "text-amber-900" : "text-slate-950"}`}>{value}</strong>
      <p className={`app-caption mt-1 mb-0 ${warn ? "text-amber-800" : ""}`}>{detail}</p>
    </div>
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

function CampaignCard({
  campaign,
  onControl,
  onInspect,
  selected,
}: {
  campaign: BackendCampaign;
  onControl: (action: CampaignAction) => void;
  onInspect: () => void;
  selected: boolean;
}) {
  const canPause = campaign.status === "running" || campaign.status === "scheduled";
  const canResume = campaign.status === "paused";
  const canCancel = ["running", "scheduled", "paused"].includes(campaign.status);

  return (
    <div className={`rounded-[1.35rem] border p-3.5 shadow-sm ${selected ? "border-cyan-300 bg-cyan-50/70" : "border-slate-200 bg-white"}`}>
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
      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <MiniStat label="Spent" value={`$${campaign.cost.spentCredits.toFixed(2)}`} />
        <MiniStat label="Limit" value={`$${campaign.cost.spendLimitCredits.toFixed(2)}`} />
      </div>
      {campaign.scheduledAt ? (
        <p className="app-caption mt-3 mb-0">Scheduled: {formatDateTime(campaign.scheduledAt, campaign.timezone)}</p>
      ) : null}
      {campaign.lastWorkerError ? (
        <p className="mt-3 mb-0 rounded-2xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{campaign.lastWorkerError}</p>
      ) : null}
      <div className="mt-3">
        <CampaignActionButton tone="neutral" onClick={onInspect}>View leads</CampaignActionButton>
      </div>
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

