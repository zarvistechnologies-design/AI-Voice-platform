"use client";

import {
  type DragEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";

import {
  DashboardSidebar,
  getDashboardSidebarInitialState,
} from "@/components/dashboard/DashboardSidebar";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
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
  type BackendPhoneNumber,
} from "@/lib/voice";

type IconName =
  | "activity"
  | "bolt"
  | "calendar"
  | "check"
  | "clock"
  | "close"
  | "file"
  | "info"
  | "phone"
  | "play"
  | "plus"
  | "shield"
  | "spark"
  | "target"
  | "upload"
  | "user"
  | "users"
  | "warning";
type CampaignLead = {
  row: number;
  phone: string;
  name: string;
  email: string;
  company: string;
  customFields: Record<string, string>;
};
type CampaignCsvWorkerResponse =
  { ok: true; leads: CampaignLead[] } | { ok: false; message: string };
type SendMode = "now" | "schedule";
type CampaignAction = "pause" | "resume" | "cancel";

const maxCsvSize = 25 * 1024 * 1024;
const maxCampaignLeads = 100_000;
const campaignSteps = ["Setup", "Audience", "Timing", "Instructions", "Review"];
const buttonClass =
  "app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 transition disabled:cursor-not-allowed disabled:opacity-50";
const controlClass =
  "app-control-text min-h-11 w-full rounded-lg border border-white/10 bg-[#ffffff] px-3 text-white outline-none transition placeholder:text-white/45 focus:border-[#118778] focus:ring-4 focus:ring-[#118778]/10";

function Icon({
  icon,
  className = "size-4",
}: {
  icon: IconName;
  className?: string;
}) {
  const props = {
    className: `${className} fill-none stroke-current stroke-2`,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  if (icon === "activity")
    return (
      <svg {...props}>
        <path d="M4 14h3l2-6 4 12 2-6h5" />
      </svg>
    );
  if (icon === "bolt")
    return (
      <svg {...props}>
        <path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z" />
      </svg>
    );
  if (icon === "calendar")
    return (
      <svg {...props}>
        <path d="M7 3v4M17 3v4M4 9h16" />
        <rect x="4" y="5" width="16" height="16" rx="3" />
      </svg>
    );
  if (icon === "check")
    return (
      <svg {...props}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  if (icon === "clock")
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  if (icon === "close")
    return (
      <svg {...props}>
        <path d="M6 6 18 18M18 6 6 18" />
      </svg>
    );
  if (icon === "file")
    return (
      <svg {...props}>
        <path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5M8 13h8M8 17h5" />
      </svg>
    );
  if (icon === "info")
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10v6M12 7h.01" />
      </svg>
    );
  if (icon === "phone")
    return (
      <svg {...props}>
        <path d="M6.6 4.8 9 7.2a2 2 0 0 1 .4 2.2l-.8 1.7a12 12 0 0 0 5.3 5.3l1.7-.8a2 2 0 0 1 2.2.4l2.4 2.4a1.8 1.8 0 0 1-.2 2.7c-1 .7-2.2 1-3.6.8C9.4 20.7 3.3 14.6 2.1 7.6 1.9 6.2 2.2 5 2.9 4a1.8 1.8 0 0 1 2.7-.2Z" />
      </svg>
    );
  if (icon === "play")
    return (
      <svg {...props}>
        <path d="M8 5v14l11-7L8 5Z" />
      </svg>
    );
  if (icon === "plus")
    return (
      <svg {...props}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  if (icon === "shield")
    return (
      <svg {...props}>
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  if (icon === "spark")
    return (
      <svg {...props}>
        <path d="m12 3 1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9L12 3Z" />
      </svg>
    );
  if (icon === "target")
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </svg>
    );
  if (icon === "upload")
    return (
      <svg {...props}>
        <path d="M12 15V3m0 0 4 4m-4-4-4 4" />
        <path d="M4 17v3h16v-3" />
      </svg>
    );
  if (icon === "users")
    return (
      <svg {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  if (icon === "warning")
    return (
      <svg {...props}>
        <path d="m12 3 10 18H2L12 3Z" />
        <path d="M12 9v5M12 17h.01" />
      </svg>
    );
  return (
    <svg {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "The request could not be completed.";
}

function parseCampaignCsvInWorker(buffer: ArrayBuffer, signal: AbortSignal) {
  return new Promise<CampaignLead[]>((resolve, reject) => {
    const worker = new Worker(
      new URL("./CampaignCsv.worker.ts", import.meta.url),
      { type: "module" },
    );
    let settled = false;

    const cleanup = () => {
      signal.removeEventListener("abort", abort);
      worker.terminate();
    };

    const rejectAndTerminate = (error: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };

    const abort = () =>
      rejectAndTerminate(
        new DOMException("CSV parsing was replaced.", "AbortError"),
      );
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) {
      abort();
      return;
    }

    worker.onmessage = (event: MessageEvent<CampaignCsvWorkerResponse>) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (event.data.ok) {
        resolve(event.data.leads);
      } else {
        reject(new Error(event.data.message));
      }
    };
    worker.onerror = (event) => {
      event.preventDefault();
      rejectAndTerminate(
        new Error(event.message || "The request could not be completed."),
      );
    };
    worker.onmessageerror = () => {
      rejectAndTerminate(new Error("The request could not be completed."));
    };

    try {
      worker.postMessage({ buffer }, [buffer]);
    } catch (error) {
      rejectAndTerminate(
        error instanceof Error
          ? error
          : new Error("The request could not be completed."),
      );
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
  return number?.agentId && typeof number.agentId === "object"
    ? number.agentId._id
    : "";
}

function plural(count: number, singular: string, pluralName = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralName}`;
}

function zonedLocalDateTimeToIso(value: string, timezone: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error("Choose a valid campaign start time.");
  const targetUtc = Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
  );
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
      })
        .formatToParts(new Date(result))
        .map((part) => [part.type, part.value]),
    );
    const representedUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
    );
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
  if (status === "running")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "scheduled") return "border-sky-200 bg-sky-50 text-sky-700";
  if (status === "paused") return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "completed")
    return "border-slate-200 bg-slate-100 text-slate-700";
  if (status === "cancelled") return "border-rose-200 bg-rose-50 text-rose-700";
  if (status === "failed") return "border-red-200 bg-red-50 text-red-700";
  return "border-white/10 bg-[#ffffff] text-white/60";
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
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  return Number(parts.hour) * 60 + Number(parts.minute);
}

function isInsideCallWindow(
  now: Date,
  timezone: string,
  start: string,
  end: string,
) {
  const current = localMinutesForDate(now, timezone);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  if (startMinutes === endMinutes) return true;
  if (startMinutes < endMinutes)
    return current >= startMinutes && current < endMinutes;
  return current >= startMinutes || current < endMinutes;
}

export function CampaignShell() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );
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
  const [detectVoicemail, setDetectVoicemail] = useState(false);
  const [requireConsentLine, setRequireConsentLine] = useState(true);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [leads, setLeads] = useState<CampaignLead[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [showUserSidebar, setShowUserSidebar] = useState(
    getDashboardSidebarInitialState,
  );
  const [now, setNow] = useState(() => new Date());
  const [idempotencyKey, setIdempotencyKey] = useState(
    () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
  );
  const csvParseAbortRef = useRef<AbortController | null>(null);
  const csvParseSequenceRef = useRef(0);

  useEffect(() => () => csvParseAbortRef.current?.abort(), []);

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
        (number) =>
          number.direction !== "Inbound" &&
          number.status === "Ready" &&
          phoneAgentId(number) === firstAgentId,
      );
      const firstCallerId =
        firstReadyCallerId ??
        numberResult.numbers.find((number) => number.direction !== "Inbound");
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

    return () => {
      cancelled = true;
    };
  }, [router, session]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    let refreshing = false;
    const refresh = () => {
      if (cancelled || refreshing || document.visibilityState !== "visible")
        return;
      refreshing = true;
      void voiceApi
        .campaigns()
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

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent._id === selectedAgentId) ?? null,
    [agents, selectedAgentId],
  );
  const selectedPhone = useMemo(
    () => numbers.find((number) => number._id === selectedPhoneId) ?? null,
    [numbers, selectedPhoneId],
  );
  const callableNumbers = numbers.filter(
    (number) => number.direction !== "Inbound",
  );
  const selectedPhoneReady = Boolean(
    selectedPhone &&
    selectedPhone.status === "Ready" &&
    selectedPhone.direction !== "Inbound" &&
    phoneAgentId(selectedPhone) === selectedAgentId,
  );
  const normalizedDailyLimit = Math.max(
    1,
    Number.isFinite(dailyLimit) ? Math.floor(dailyLimit) : 1,
  );
  const normalizedConcurrency = Math.max(
    1,
    Math.min(100, Number.isFinite(concurrency) ? Math.floor(concurrency) : 1),
  );
  const invalidLeadCount = leads.filter(
    (lead) => !isDialable(lead.phone),
  ).length;
  const readyChecks = [
    { label: "Campaign name", ready: Boolean(campaignName.trim()) },
    { label: "Ready caller ID assigned", ready: selectedPhoneReady },
    { label: "Assistant is Live", ready: selectedAgent?.status === "Live" },
    { label: "CSV contacts uploaded", ready: leads.length > 0 },
    {
      label: "All phone numbers E.164",
      ready: leads.length > 0 && invalidLeadCount === 0,
    },
    {
      label: "Compliance guardrails on",
      ready: respectDnc && requireConsentLine,
    },
    {
      label: "Schedule selected",
      ready: sendMode === "now" || Boolean(scheduledAt),
    },
  ];
  const canPrepare = readyChecks.every((check) => check.ready);
  const currentStepReady =
    createStep === 1
      ? Boolean(
          campaignName.trim() &&
          selectedAgent?.status === "Live" &&
          selectedPhoneReady,
        )
      : createStep === 2
        ? leads.length > 0 && invalidLeadCount === 0
        : createStep === 3
          ? sendMode === "now" || Boolean(scheduledAt)
          : createStep === 4
            ? respectDnc && requireConsentLine
            : canPrepare;
  const stepRequirement =
    createStep === 1
      ? "Enter a campaign name, select a Live assistant, and choose its Ready outbound number."
      : createStep === 2
        ? "Upload a CSV containing valid E.164 phone numbers before continuing."
        : createStep === 3
          ? "Choose a start date and time when scheduling the campaign."
          : "Keep opt-out handling and the consent opening enabled.";
  const estimatedBatches = Math.max(
    1,
    Math.ceil(leads.length / normalizedDailyLimit),
  );
  const callWindowOpen = isInsideCallWindow(
    now,
    timezone,
    windowStart,
    windowEnd,
  );
  const launchModeSummary =
    sendMode === "now"
      ? callWindowOpen
        ? "Immediate launch"
        : `Waits for ${windowStart}-${windowEnd}`
      : schedulePreview(scheduledAt, timezone);
  async function handleCsv(file: File | undefined) {
    if (!file) return;
    const sequence = ++csvParseSequenceRef.current;
    csvParseAbortRef.current?.abort();
    csvParseAbortRef.current = null;
    setCsvFile(null);
    setLeads([]);
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
    const controller = new AbortController();
    csvParseAbortRef.current = controller;
    try {
      const parsed = await parseCampaignCsvInWorker(
        await file.arrayBuffer(),
        controller.signal,
      );
      if (sequence !== csvParseSequenceRef.current || controller.signal.aborted)
        return;
      if (!parsed.length) throw new Error("No contacts found in the CSV.");
      setCsvFile(file);
      setLeads(parsed);
      setNotice(`${parsed.length} contacts loaded from ${file.name}.`);
    } catch (caught) {
      if (sequence !== csvParseSequenceRef.current || controller.signal.aborted)
        return;
      setCsvFile(null);
      setLeads([]);
      setError(errorMessage(caught));
    } finally {
      if (sequence === csvParseSequenceRef.current)
        csvParseAbortRef.current = null;
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
      setError(
        "Complete the campaign readiness checks before preparing this campaign.",
      );
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
        await voiceApi.addCampaignLeads(
          created.campaign._id,
          leads.slice(index, index + batchSize),
        );
        setNotice(
          `Uploaded ${Math.min(index + batchSize, leads.length).toLocaleString("en-IN")} of ${leads.length.toLocaleString("en-IN")} contacts...`,
        );
      }
      const launched = await voiceApi.launchCampaign(created.campaign._id, {
        mode: sendMode,
        ...(sendMode === "schedule"
          ? { scheduledAt: zonedLocalDateTimeToIso(scheduledAt, timezone) }
          : {}),
      });
      setCampaigns((current) => [
        launched.campaign,
        ...current.filter((item) => item._id !== launched.campaign._id),
      ]);
      setNotice(
        sendMode === "schedule"
          ? `${campaignName.trim()} is scheduled. Calls will run automatically, even if you close this page.`
          : `${campaignName.trim()} is live. Calls will continue automatically, even if you close this page.`,
      );
      setShowCreateCampaign(false);
      setCreateStep(1);
      setIdempotencyKey(
        globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      );
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLaunching(false);
    }
  }

  async function controlCampaign(
    campaign: BackendCampaign,
    action: CampaignAction,
  ) {
    setError("");
    try {
      if (action === "cancel") {
        const result = await voiceApi.cancelCampaign(campaign._id);
        setCampaigns((current) =>
          current.map((item) =>
            item._id === campaign._id ? result.campaign : item,
          ),
        );
        setNotice(result.message || "Campaign cancelled.");
        return;
      }
      const result =
        action === "pause"
          ? await voiceApi.pauseCampaign(campaign._id)
          : await voiceApi.resumeCampaign(campaign._id);
      setCampaigns((current) =>
        current.map((item) =>
          item._id === campaign._id ? result.campaign : item,
        ),
      );
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }

  if (!session) {
    return (
      <main className="app-strong grid min-h-screen place-items-center bg-[#f7f9f8] px-6 text-[#71817d]">
        <div className="rounded-lg border border-white/10 bg-[#ffffff] px-6 py-5 text-center shadow-sm">
          <span className="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-[#edf7f4] text-[#0e6f62]">
            <Icon icon="spark" />
          </span>
          <p className="app-strong m-0">Loading campaigns</p>
          <p className="app-caption mt-1 mb-0">
            Checking your session and campaign workspace.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`dashboard-home-theme grid min-h-dvh bg-[#f7f9f8] text-[#14231f] lg:h-dvh lg:overflow-hidden ${
        showUserSidebar
          ? "lg:grid-cols-[248px_minmax(0,1fr)]"
          : "lg:grid-cols-[64px_minmax(0,1fr)]"
      }`}
    >
      <DashboardSidebar
        activeLabel="Campaigns"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => {
          void logoutSession().then(() => router.replace("/login"));
        }}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />

      <section className="min-w-0 overflow-y-auto overscroll-contain bg-[#f7f9f8]">
        <DashboardPageHeader
          eyebrow="Outbound operations"
          title="Outbound campaigns"
          description="Create campaigns, upload leads, control pacing, and monitor delivery."
          actions={
            <button
              className={`${buttonClass} border border-[#118778] ${showCreateCampaign ? "bg-white text-[#0e6f62]" : "bg-[#118778] text-white hover:bg-[#0e6f62]"}`}
              type="button"
              onClick={() => {
                setCreateStep(1);
                setDetectVoicemail(false);
                setShowCreateCampaign(true);
                setError("");
              }}
            >
              <Icon icon="plus" />
              Create campaign
            </button>
          }
        />

        <div className="dashboard-page-content w-full py-0">
          {!showCreateCampaign && notice ? (
            <Notice
              tone="success"
              message={notice}
              onClose={() => setNotice("")}
            />
          ) : null}
          {!showCreateCampaign && error ? (
            <Notice tone="error" message={error} onClose={() => setError("")} />
          ) : null}

          {showCreateCampaign ? (
            <div
              aria-modal="true"
              className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/35 p-3 backdrop-blur-[6px] sm:p-5"
              role="dialog"
              onMouseDown={() => {
                if (!launching) {
                  setShowCreateCampaign(false);
                  setCreateStep(1);
                }
              }}
            >
              <form
                className="grid max-h-[calc(100dvh-1.5rem)] w-full max-w-[720px] overflow-y-auto rounded-xl border border-[#dbe4e1] bg-white px-5 pb-5 sm:max-h-[calc(100dvh-2.5rem)] sm:px-7"
                onMouseDown={(event) => event.stopPropagation()}
                onSubmit={prepareCampaign}
              >
                <div className="sticky top-0 z-20 -mx-5 grid gap-4 border-b border-[#dbe4e1] bg-white px-5 py-4 sm:-mx-7 sm:px-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="app-label text-[#0e6f62]">
                        New campaign · Step {createStep} of{" "}
                        {campaignSteps.length}
                      </span>
                      <h2 className="app-page-title mt-1 mb-0">
                        {campaignSteps[createStep - 1]}
                      </h2>
                      <p className="app-caption mt-1 mb-0">
                        Complete one clear step at a time.
                      </p>
                    </div>
                    <button
                      aria-label="Close campaign form"
                      className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#dbe4e1] bg-white text-[#52645f] hover:border-[#118778] hover:text-[#0e6f62] disabled:opacity-50"
                      disabled={launching}
                      type="button"
                      onClick={() => {
                        setShowCreateCampaign(false);
                        setCreateStep(1);
                      }}
                    >
                      <Icon icon="close" />
                    </button>
                  </div>
                  <ol
                    className="grid grid-cols-5 gap-2"
                    aria-label="Campaign creation steps"
                  >
                    {campaignSteps.map((step, index) => {
                      const number = index + 1;
                      const active = number === createStep;
                      const complete = number < createStep;
                      return (
                        <li className="min-w-0" key={step}>
                          <span
                            className={`block h-1.5 rounded-full ${active || complete ? "bg-[#118778]" : "bg-[#dbe4e1]"}`}
                          />
                          <span
                            className={`mt-1 hidden truncate text-[10px] font-semibold sm:block ${active ? "text-[#0e6f62]" : "text-[#71817d]"}`}
                          >
                            {step}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
                <div className="grid gap-3 pt-4">
                  {notice ? (
                    <Notice
                      tone="success"
                      message={notice}
                      onClose={() => setNotice("")}
                    />
                  ) : null}
                  {error ? (
                    <Notice
                      tone="error"
                      message={error}
                      onClose={() => setError("")}
                    />
                  ) : null}
                </div>
                <section className="grid min-w-0 content-start gap-0">
                  {createStep === 1 ? (
                    <Panel>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="app-label grid gap-2 lg:col-span-2">
                          Campaign name
                          <input
                            className={controlClass}
                            placeholder="June renewal follow-up"
                            value={campaignName}
                            onChange={(event) =>
                              setCampaignName(event.target.value)
                            }
                          />
                        </label>

                        <label className="app-label grid gap-2">
                          Assistant
                          <select
                            className={controlClass}
                            value={selectedAgentId}
                            onChange={(event) =>
                              setSelectedAgentId(event.target.value)
                            }
                          >
                            <option value="">Select assistant</option>
                            {agents.map((agent) => (
                              <option key={agent._id} value={agent._id}>
                                {agent.name} - {agent.status}
                              </option>
                            ))}
                          </select>
                          {selectedAgent && selectedAgent.status !== "Live" ? (
                            <span className="app-caption font-medium text-amber-700">
                              This assistant must be Live before launch.
                            </span>
                          ) : null}
                        </label>

                        <label className="app-label grid gap-2">
                          Outbound caller ID
                          <select
                            className={controlClass}
                            value={selectedPhoneId}
                            onChange={(event) =>
                              setSelectedPhoneId(event.target.value)
                            }
                          >
                            <option value="">Select phone number</option>
                            {callableNumbers.map((number) => (
                              <option key={number._id} value={number._id}>
                                {number.number} - {number.provider} -{" "}
                                {number.status}
                                {phoneAgentId(number) === selectedAgentId
                                  ? ""
                                  : " - different assistant"}
                              </option>
                            ))}
                          </select>
                          {selectedPhone && !selectedPhoneReady ? (
                            <span className="app-caption font-medium text-amber-700">
                              Choose a Ready outbound caller ID assigned to this
                              assistant.
                            </span>
                          ) : null}
                        </label>
                      </div>
                    </Panel>
                  ) : null}

                  {createStep === 2 ? (
                    <Panel>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <p className="app-caption m-0">
                          Upload a CSV with a phone or phone_number column.
                        </p>
                        <span className="border-l border-white/15 px-3 py-1.5 text-xs font-semibold text-white/50">
                          {csvFile
                            ? `${csvFile.name} - ${formatFileSize(csvFile.size)}`
                            : "No file chosen"}
                        </span>
                      </div>

                      <label
                        className="mt-5 grid min-h-[150px] cursor-pointer place-items-center rounded-xl border border-dashed border-[#118778]/35 bg-[radial-gradient(circle_at_50%_0%,rgba(17,135,120,0.10),transparent_52%),linear-gradient(135deg,#ffffff_0%,#ffffff_100%)] p-5 text-center transition hover:border-[#118778]/55"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleDrop}
                      >
                        <input
                          className="sr-only"
                          type="file"
                          accept=".csv,text/csv"
                          onChange={(event) =>
                            void handleCsv(event.target.files?.[0])
                          }
                        />
                        <span className="max-w-md">
                          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-[#118778]/10 text-[#0e6f62] shadow-[0_14px_30px_rgba(17,135,120,0.12)]">
                            <Icon icon="file" className="size-6" />
                          </span>
                          <strong className="block text-base font-semibold text-slate-950">
                            Drop CSV or choose file
                          </strong>
                          <span className="mt-2 block text-sm leading-6 text-slate-500">
                            Up to 25MB and{" "}
                            {maxCampaignLeads.toLocaleString("en-IN")} contacts.
                            Required column: phone or phone_number. Optional:
                            name, email, company, and custom fields.
                          </span>
                        </span>
                      </label>

                      {leads.length ? (
                        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-[#dbe4e1] px-4 py-3">
                          <span className="text-sm font-semibold text-slate-950">
                            {numberFormat(leads.length)} contacts loaded
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${invalidLeadCount ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}
                          >
                            {invalidLeadCount
                              ? `${invalidLeadCount} invalid`
                              : "Ready"}
                          </span>
                        </div>
                      ) : null}
                    </Panel>
                  ) : null}

                  {createStep === 3 ? (
                    <Panel>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <ModeCard
                          active={sendMode === "now"}
                          icon="play"
                          title="Send now"
                          onClick={() => setSendMode("now")}
                        />
                        <ModeCard
                          active={sendMode === "schedule"}
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
                              <input
                                className={controlClass}
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(event) =>
                                  setScheduledAt(event.target.value)
                                }
                              />
                            </label>
                            <label className="app-label grid gap-2">
                              Timezone
                              <select
                                className={controlClass}
                                value={timezone}
                                onChange={(event) =>
                                  setTimezone(event.target.value)
                                }
                              >
                                <option value="Asia/Kolkata">
                                  Asia/Kolkata
                                </option>
                                <option value="America/New_York">
                                  America/New_York
                                </option>
                                <option value="America/Los_Angeles">
                                  America/Los_Angeles
                                </option>
                                <option value="Europe/London">
                                  Europe/London
                                </option>
                                <option value="UTC">UTC</option>
                              </select>
                            </label>
                          </>
                        ) : (
                          <label className="app-label grid gap-2 lg:col-span-2">
                            Timezone
                            <select
                              className={controlClass}
                              value={timezone}
                              onChange={(event) =>
                                setTimezone(event.target.value)
                              }
                            >
                              <option value="Asia/Kolkata">Asia/Kolkata</option>
                              <option value="America/New_York">
                                America/New_York
                              </option>
                              <option value="America/Los_Angeles">
                                America/Los_Angeles
                              </option>
                              <option value="Europe/London">
                                Europe/London
                              </option>
                              <option value="UTC">UTC</option>
                            </select>
                          </label>
                        )}
                        <label className="app-label grid gap-2">
                          Local call window
                          <span className="grid grid-cols-2 gap-2">
                            <input
                              className={controlClass}
                              type="time"
                              value={windowStart}
                              onChange={(event) =>
                                setWindowStart(event.target.value)
                              }
                            />
                            <input
                              className={controlClass}
                              type="time"
                              value={windowEnd}
                              onChange={(event) =>
                                setWindowEnd(event.target.value)
                              }
                            />
                          </span>
                        </label>
                      </div>

                      <div className="mt-6 grid gap-4 border-y border-white/10 py-5 sm:grid-cols-2 xl:grid-cols-4">
                        <label className="app-label grid gap-2">
                          Daily limit
                          <input
                            className={controlClass}
                            min={1}
                            max={100000}
                            type="number"
                            value={dailyLimit}
                            onChange={(event) =>
                              setDailyLimit(Number(event.target.value))
                            }
                          />
                        </label>
                        <label className="app-label grid gap-2">
                          Concurrent calls
                          <input
                            className={controlClass}
                            min={1}
                            max={100}
                            type="number"
                            value={concurrency}
                            onChange={(event) =>
                              setConcurrency(Number(event.target.value))
                            }
                          />
                        </label>
                        <label className="app-label grid gap-2">
                          Max attempts
                          <input
                            className={controlClass}
                            min={1}
                            max={5}
                            type="number"
                            value={maxAttempts}
                            onChange={(event) =>
                              setMaxAttempts(Number(event.target.value))
                            }
                          />
                        </label>
                        <label className="app-label grid gap-2">
                          Retry gap hours
                          <input
                            className={controlClass}
                            min={1}
                            max={168}
                            type="number"
                            value={retryGapHours}
                            onChange={(event) =>
                              setRetryGapHours(Number(event.target.value))
                            }
                          />
                        </label>
                      </div>
                    </Panel>
                  ) : null}

                  {createStep === 4 ? (
                    <Panel>
                      <section className="rounded-xl bg-[#f7f9f8] p-4 sm:p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <span className="app-label text-[#0e6f62]">
                              Required safeguards
                            </span>
                            <h3 className="app-section-title mt-1 mb-0">
                              Safety and compliance
                            </h3>
                            <p className="app-caption mt-1 mb-0">
                              Review these controls before defining the campaign instructions.
                            </p>
                          </div>
                          <span className="w-fit rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0e6f62]">
                            Review first
                          </span>
                        </div>

                        <div className="mt-4 grid divide-y divide-[#dfe7e4] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                          <ToggleRow
                            title="Respect opt-outs"
                            detail="Required"
                            enabled={respectDnc}
                            onChange={setRespectDnc}
                          />
                          <ToggleRow
                            title="Voicemail detection"
                            detail={detectVoicemail ? "Enabled" : "Off by default"}
                            enabled={detectVoicemail}
                            onChange={setDetectVoicemail}
                          />
                          <ToggleRow
                            title="Consent opening"
                            detail="Required"
                            enabled={requireConsentLine}
                            onChange={setRequireConsentLine}
                          />
                        </div>

                        {detectVoicemail ? (
                          <div
                            className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm leading-5 text-amber-900"
                            role="alert"
                          >
                            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-amber-200 font-bold" aria-hidden="true">
                              !
                            </span>
                            <span>
                              <strong className="block">Voicemail detection is enabled</strong>
                              It can occasionally classify a live person as voicemail. Test it with your provider and campaign language before launch.
                            </span>
                          </div>
                        ) : null}
                      </section>

                      <div className="mt-5 grid gap-4">
                        <label className="app-label grid gap-2">
                          Goal
                          <textarea
                            className="app-control-text min-h-36 resize-y rounded-2xl border border-white/10 bg-[#ffffff] p-4 text-white shadow-[0_1px_0_rgba(0,0,0,0.18)] outline-none transition placeholder:text-white/45 hover:border-white/20 focus:border-[#118778] focus:ring-4 focus:ring-[#118778]/10"
                            placeholder="Confirm appointment interest and capture preferred callback time."
                            value={campaignGoal}
                            onChange={(event) =>
                              setCampaignGoal(event.target.value)
                            }
                          />
                        </label>
                        <label className="app-label grid gap-2">
                          Success criteria
                          <input
                            className={controlClass}
                            placeholder="Booked demo, qualified lead, reminder accepted..."
                            value={successCriteria}
                            onChange={(event) =>
                              setSuccessCriteria(event.target.value)
                            }
                          />
                        </label>
                      </div>
                    </Panel>
                  ) : null}
                </section>

                {createStep === 5 ? (
                  <aside className="min-w-0">
                    <div className="grid gap-5">
                      <Panel compact>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="app-label text-[#0e6f62]">
                              Launch console
                            </span>
                            <h2 className="mt-1 mb-0 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                              {canPrepare
                                ? "Ready to launch"
                                : "Preflight in progress"}
                            </h2>
                          </div>
                          <span
                            className={`grid size-12 place-items-center rounded-2xl ${canPrepare ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            <Icon
                              icon={canPrepare ? "check" : "shield"}
                              className="size-5"
                            />
                          </span>
                        </div>

                        <div className="mt-4 border-t border-slate-200 pt-4">
                          <h3 className="app-section-title m-0">
                            Launch summary
                          </h3>
                          <dl className="mt-4 grid gap-3">
                            <SummaryRow
                              label="Contacts"
                              value={numberFormat(leads.length)}
                            />
                            <SummaryRow
                              label="Invalid phones"
                              value={numberFormat(invalidLeadCount)}
                              warn={invalidLeadCount > 0}
                            />
                            <SummaryRow
                              label="Batches"
                              value={numberFormat(estimatedBatches)}
                            />
                            <SummaryRow
                              label="Caller ID"
                              value={selectedPhone?.number ?? "Not selected"}
                            />
                            <SummaryRow
                              label="Assistant"
                              value={selectedAgent?.name ?? "Not selected"}
                            />
                            <SummaryRow
                              label="Launch"
                              value={launchModeSummary}
                            />
                          </dl>
                          <button
                            className={`${buttonClass} mt-5 w-full bg-[#118778] text-white shadow-sm hover:bg-[#0e6f62]`}
                            disabled={loading || launching || !canPrepare}
                            type="submit"
                          >
                            <Icon icon="play" />{" "}
                            {launching
                              ? "Launching..."
                              : sendMode === "now"
                                ? callWindowOpen
                                  ? "Start calls now"
                                  : "Queue until call window"
                                : "Schedule campaign"}
                          </button>
                          <p className="app-caption mt-3 mb-0 text-center">
                            {sendMode === "now"
                              ? callWindowOpen
                                ? "Calls start immediately after launch."
                                : `Calls start when the ${windowStart}-${windowEnd} local window opens.`
                              : "Calls start at the scheduled time."}
                          </p>
                        </div>
                      </Panel>
                    </div>
                  </aside>
                ) : null}

                {createStep < campaignSteps.length && !currentStepReady ? (
                  <p className="m-0 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-800">
                    {stepRequirement}
                  </p>
                ) : null}

                <div className="sticky bottom-0 z-20 -mx-5 flex items-center justify-between gap-3 border-t border-[#dbe4e1] bg-white px-5 py-4 sm:-mx-7 sm:px-7">
                  <button
                    className={`${buttonClass} border border-[#c6d4d0] bg-white text-[#52645f] hover:border-[#118778] disabled:opacity-40`}
                    disabled={createStep === 1 || launching}
                    type="button"
                    onClick={() => {
                      setCreateStep((current) => Math.max(1, current - 1));
                      setError("");
                    }}
                  >
                    Back
                  </button>
                  <span className="app-caption hidden sm:block">
                    {campaignSteps[createStep - 1]}
                  </span>
                  {createStep < campaignSteps.length ? (
                    <button
                      className={`${buttonClass} bg-[#118778] text-white hover:bg-[#0e6f62]`}
                      disabled={!currentStepReady || launching}
                      type="button"
                      onClick={() => {
                        setCreateStep((current) =>
                          Math.min(campaignSteps.length, current + 1),
                        );
                        setError("");
                      }}
                    >
                      Continue
                    </button>
                  ) : (
                    <span className="w-[92px]" />
                  )}
                </div>
              </form>
            </div>
          ) : null}
          <CampaignOperationsSection
            campaigns={campaigns}
            onControl={controlCampaign}
          />
        </div>
      </section>
    </main>
  );
}

function Panel({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`overflow-hidden ${compact ? "py-4" : "py-5"}`}>
      {children}
    </section>
  );
}

function ModeCard({
  active,
  icon,
  onClick,
  title,
}: {
  active: boolean;
  icon: IconName;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      className={`rounded-lg border px-4 py-3 text-left transition ${
        active
          ? "border-[#118778] bg-[#edf7f4] text-[#0e6f62]"
          : "border-[#dbe4e1] bg-white text-[#52645f] hover:border-[#118778]/50"
      }`}
      onClick={onClick}
      type="button"
      aria-pressed={active}
    >
      <span className="flex items-center gap-3">
        <span
          className={`grid size-9 place-items-center rounded-lg ${active ? "bg-white text-[#0e6f62]" : "bg-[#f6f6f8] text-[#71817d]"}`}
        >
          <Icon icon={icon} />
        </span>
        <strong className="block text-sm font-semibold text-current">
          {title}
        </strong>
      </span>
    </button>
  );
}

function ProgressBar({
  className = "",
  value,
}: {
  className?: string;
  value: number;
}) {
  return (
    <div
      className={`h-2 overflow-hidden rounded-full bg-slate-200 ${className}`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#118778] via-[#25b39f] to-[#0e6f62] transition-all"
        style={{ width: `${progressValue(value)}%` }}
      />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  warn = false,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="app-caption">{label}</dt>
      <dd
        className={`m-0 max-w-[210px] truncate text-right text-sm font-semibold ${warn ? "text-amber-300" : "text-white"}`}
      >
        {value}
      </dd>
    </div>
  );
}

function CampaignOperationsSection({
  campaigns,
  onControl,
}: {
  campaigns: BackendCampaign[];
  onControl: (
    campaign: BackendCampaign,
    action: CampaignAction,
  ) => void | Promise<void>;
}) {
  return (
    <section className="dashboard-flat-panel mt-0 overflow-hidden bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dbe4e1] px-5 py-4">
        <div>
          <h2 className="app-section-title m-0">Campaigns</h2>
          <p className="app-caption mt-1 mb-0">
            {numberFormat(campaigns.length)} total
          </p>
        </div>
      </div>

      {campaigns.length ? (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-[#ffffff] text-white/50">
                <tr className="text-xs font-semibold uppercase tracking-[0.12em]">
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Results</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f4]">
                {campaigns.map((campaign) => (
                  <tr
                    className="align-top transition hover:bg-[#fbfdff]"
                    key={campaign._id}
                  >
                    <td className="px-4 py-4">
                      <strong className="block max-w-[220px] truncate text-sm font-semibold text-[#0f172a]">
                        {campaign.name}
                      </strong>
                      <span className="app-caption mt-1 block">
                        Created{" "}
                        {formatDateTime(campaign.createdAt, campaign.timezone)}
                      </span>
                      <span className="app-caption mt-1 block">
                        {numberFormat(
                          campaign.totalLeads || campaign.stats.total,
                        )}{" "}
                        leads · {numberFormat(campaign.concurrency)} concurrent
                        · {numberFormat(campaign.dailyLimit)}/day
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill status={campaign.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="min-w-[150px]">
                        <div className="mb-2 flex justify-between gap-3 text-xs font-semibold text-[#475569]">
                          <span>{campaign.stats.progressPercent}%</span>
                          <span>
                            {numberFormat(campaign.stats.processed)}/
                            {numberFormat(campaign.stats.total)}
                          </span>
                        </div>
                        <ProgressBar value={campaign.stats.progressPercent} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="grid gap-1 text-xs font-medium text-[#475569]">
                        <span>
                          <strong className="text-[#047857]">
                            {numberFormat(campaign.stats.completed)}
                          </strong>{" "}
                          completed
                        </span>
                        <span>
                          <strong className="text-[#dc2626]">
                            {numberFormat(campaign.stats.failed)}
                          </strong>{" "}
                          failed ·{" "}
                          <strong className="text-[#d97706]">
                            {numberFormat(campaign.stats.suppressed)}
                          </strong>{" "}
                          suppressed
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="block text-sm font-semibold text-[#0f172a]">
                        {campaign.windowStart}-{campaign.windowEnd}
                      </span>
                      <span className="app-caption">
                        {campaign.scheduledAt
                          ? formatDateTime(
                              campaign.scheduledAt,
                              campaign.timezone,
                            )
                          : campaign.timezone}
                      </span>
                      {campaign.lastWorkerError ? (
                        <p className="mt-2 max-w-[220px] rounded-lg bg-[#fff1f2] px-2 py-1 text-xs font-medium text-[#dc2626]">
                          {campaign.lastWorkerError}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <CampaignActions
                        campaign={campaign}
                        onControl={(action) => onControl(campaign, action)}
                        align="end"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 py-4 lg:hidden">
            {campaigns.map((campaign) => (
              <CampaignCard
                campaign={campaign}
                key={campaign._id}
                onControl={(action) => onControl(campaign, action)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="py-6">
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
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTheme(status)}`}
    >
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
  const canPause =
    campaign.status === "running" || campaign.status === "scheduled";
  const canResume = campaign.status === "paused";
  const canCancel = ["running", "scheduled", "paused"].includes(
    campaign.status,
  );
  if (!canPause && !canResume && !canCancel) {
    return <span className="app-caption block text-right">No actions</span>;
  }

  return (
    <div
      className={`flex flex-wrap gap-2 ${align === "end" ? "justify-end" : ""}`}
    >
      {canPause ? (
        <CampaignActionButton tone="neutral" onClick={() => onControl("pause")}>
          Pause
        </CampaignActionButton>
      ) : null}
      {canResume ? (
        <CampaignActionButton
          tone="success"
          onClick={() => onControl("resume")}
        >
          Resume
        </CampaignActionButton>
      ) : null}
      {canCancel ? (
        <CampaignActionButton tone="danger" onClick={() => onControl("cancel")}>
          Cancel
        </CampaignActionButton>
      ) : null}
    </div>
  );
}

function CampaignCard({
  campaign,
  onControl,
}: {
  campaign: BackendCampaign;
  onControl: (action: CampaignAction) => void;
}) {
  const canPause =
    campaign.status === "running" || campaign.status === "scheduled";
  const canResume = campaign.status === "paused";
  const canCancel = ["running", "scheduled", "paused"].includes(
    campaign.status,
  );

  return (
    <div className="border-b border-white/10 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <strong className="block truncate text-sm font-semibold text-slate-950">
            {campaign.name}
          </strong>
          <span className="app-caption mt-1 block">
            {numberFormat(campaign.stats.processed)}/
            {numberFormat(campaign.stats.total)} processed
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
        <p className="app-caption mt-3 mb-0">
          Scheduled: {formatDateTime(campaign.scheduledAt, campaign.timezone)}
        </p>
      ) : null}
      {campaign.lastWorkerError ? (
        <p className="mt-3 mb-0 rounded-2xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {campaign.lastWorkerError}
        </p>
      ) : null}
      {canPause || canResume || canCancel ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {canPause ? (
            <CampaignActionButton
              tone="neutral"
              onClick={() => onControl("pause")}
            >
              Pause
            </CampaignActionButton>
          ) : null}
          {canResume ? (
            <CampaignActionButton
              tone="success"
              onClick={() => onControl("resume")}
            >
              Resume
            </CampaignActionButton>
          ) : null}
          {canCancel ? (
            <CampaignActionButton
              tone="danger"
              onClick={() => onControl("cancel")}
            >
              Cancel
            </CampaignActionButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <span className="border-l border-white/10 px-2 py-2">
      <span className="block text-[11px] font-medium text-slate-400">
        {label}
      </span>
      <strong className="block text-xs font-semibold text-slate-800">
        {value}
      </strong>
    </span>
  );
}

function CampaignActionButton({
  children,
  onClick,
  tone,
}: {
  children: ReactNode;
  onClick: () => void;
  tone: "danger" | "neutral" | "success";
}) {
  const toneClass =
    tone === "danger"
      ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100";
  return (
    <button
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${toneClass}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function EmptyState({
  description,
  icon,
  title,
}: {
  description: string;
  icon: IconName;
  title: string;
}) {
  return (
    <div className="border-y border-dashed border-white/15 py-8 text-center">
      <span className="mx-auto grid size-11 place-items-center text-white/50">
        <Icon icon={icon} />
      </span>
      <strong className="mt-3 block text-sm font-semibold text-slate-950">
        {title}
      </strong>
      <p className="app-caption mt-1 mb-0">{description}</p>
    </div>
  );
}

function ToggleRow({
  detail,
  enabled,
  onChange,
  title,
}: {
  detail: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  title: string;
}) {
  return (
    <button
      className="flex items-center justify-between gap-4 px-3 py-3 text-left transition hover:bg-white/70 sm:first:pr-5 sm:last:pl-5 sm:[&:not(:first-child):not(:last-child)]:px-5"
      onClick={() => onChange(!enabled)}
      type="button"
      aria-pressed={enabled}
    >
      <span>
        <strong className="block text-sm font-semibold text-slate-950">
          {title}
        </strong>
        <span className="app-caption mt-1 block">{detail}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled ? "bg-[#118778]" : "bg-[#cbd5e1]"}`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-[#ffffff] shadow transition ${enabled ? "left-6" : "left-1"}`}
        />
      </span>
    </button>
  );
}

function Notice({
  message,
  onClose,
  tone,
}: {
  message: string;
  onClose: () => void;
  tone: "error" | "success";
}) {
  const success = tone === "success";
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 shadow-sm ${success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}
    >
      <span className="text-sm font-medium leading-6">{message}</span>
      <button
        className="grid size-7 shrink-0 place-items-center rounded-lg hover:bg-black/5"
        onClick={onClose}
        type="button"
        aria-label="Dismiss"
      >
        <Icon icon="close" className="size-3.5" />
      </button>
    </div>
  );
}
