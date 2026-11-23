"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

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
import { billingApi } from "@/lib/billing";
import {
  publicVoiceMessage,
  voiceApi,
  type AgentSummary,
  type CallRecord,
} from "@/lib/voice";

const loadCallDetailDrawer = () =>
  import("@/components/dashboard/CallDetailDrawer");
const CallDetailDrawer = dynamic(
  () => loadCallDetailDrawer().then((module) => module.CallDetailDrawer),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 text-sm font-semibold text-white">
        Loading call details...
      </div>
    ),
  },
);

function preloadCallDetailDrawer() {
  void loadCallDetailDrawer().catch(() => undefined);
}

const statusOptions = [
  "",
  "initiated",
  "ringing",
  "active",
  "completed",
  "failed",
  "cancelled",
] as const;
const directionOptions = ["", "web", "inbound", "outbound"] as const;
const sentimentOptions = ["", "positive", "neutral", "negative"] as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function agentName(call: CallRecord) {
  return call.agentId && typeof call.agentId === "object" && call.agentId.name
    ? call.agentId.name
    : "Voice agent";
}

function titleCase(value: string) {
  return value ? value[0].toUpperCase() + value.slice(1) : "All";
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function money(value: number, currency = "USD", inrPerUsd = 96.5) {
  const rupees = currency?.toUpperCase() === "INR" ? value : value * inrPerUsd;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: Math.abs(rupees) < 1 ? 4 : 2,
    maximumFractionDigits: Math.abs(rupees) < 1 ? 4 : 2,
  }).format(rupees);
}

function formatRoomPhone(digits: string, destinationDigits = "") {
  if (!digits) return "";
  if (
    destinationDigits.startsWith("91") &&
    digits.length === 11 &&
    digits.startsWith("0")
  ) {
    return `+91${digits.slice(1)}`;
  }
  if (destinationDigits.startsWith("91") && digits.length === 10) {
    return `+91${digits}`;
  }
  return digits.length >= 11 ? `+${digits}` : digits;
}

function inboundRoomNumbers(roomName: string) {
  const match = /^inbound-(\d{7,15})-(.*)$/.exec(roomName);
  if (!match) return { callerNumber: "", calledNumber: "" };
  const destinationDigits = match[1] ?? "";
  const suffix = match[2] ?? "";
  const callerDigits =
    [...suffix.matchAll(/\d{7,15}/g)]
      .map((item) => item[0])
      .find((digits) => digits !== destinationDigits) ?? "";
  return {
    callerNumber: formatRoomPhone(callerDigits, destinationDigits),
    calledNumber: formatRoomPhone(destinationDigits),
  };
}

function callRoute(call: CallRecord) {
  if (call.direction === "web") {
    return {
      from: "Browser caller",
      fromSource: "recorded",
      fromMissing: false,
      to: "Voice agent",
      toSource: "recorded",
    };
  }

  const inferredInboundNumbers =
    call.direction === "inbound"
      ? inboundRoomNumbers(call.livekitRoomName)
      : { callerNumber: "", calledNumber: "" };
  const from = call.callerNumber || inferredInboundNumbers.callerNumber;
  const fromSource =
    call.callerNumberSource ||
    (!call.callerNumber && inferredInboundNumbers.callerNumber
      ? "room_name"
      : "recorded");
  const toSource =
    call.calledNumberSource ||
    (!call.calledNumber && inferredInboundNumbers.calledNumber
      ? "room_name"
      : "recorded");
  return {
    from,
    fromSource,
    fromMissing: call.direction === "inbound" && !from,
    to:
      call.calledNumber ||
      inferredInboundNumbers.calledNumber ||
      (call.direction === "outbound" ? "Dialed number" : "Assigned number"),
    toSource,
  };
}

function CallRoute({
  call,
  compact = false,
}: {
  call: CallRecord;
  compact?: boolean;
}) {
  const route = callRoute(call);
  const numberClass = compact
    ? "max-w-44 truncate rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-sans text-[13px] font-medium leading-4 tabular-nums text-slate-900"
    : "min-w-0 truncate rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-sm font-semibold text-slate-950";
  return (
    <div className={`grid gap-1.5 ${compact ? "min-w-56" : ""}`}>
      <div className="grid min-w-0 grid-cols-[44px_minmax(0,1fr)] items-center gap-2">
        <span className="rounded border border-[#eaeaea] bg-[#f4f4f5] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#171717]">
          From
        </span>
        {route.fromMissing ? (
          <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
            Caller ID not sent
          </span>
        ) : (
          <span className={numberClass} title={route.from}>
            {route.from}
            {route.fromSource === "room_name" ? (
              <span className="ml-1 font-sans text-[10px] font-bold uppercase text-amber-600">
                inferred
              </span>
            ) : null}
          </span>
        )}
      </div>
      <div className="grid min-w-0 grid-cols-[44px_minmax(0,1fr)] items-center gap-2">
        <span className="rounded border border-[#eaeaea] bg-[#f4f4f5] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#71717a]">
          To
        </span>
        <span className={numberClass} title={route.to}>
          {route.to}
          {route.toSource === "room_name" ? (
            <span className="ml-1 font-sans text-[10px] font-bold uppercase text-amber-600">
              inferred
            </span>
          ) : null}
        </span>
      </div>
    </div>
  );
}

function queryDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function statusTone(status: CallRecord["status"]) {
  if (status === "completed")
    return "bg-[#fafafa] text-[#171717] ring-1 ring-[#eaeaea]";
  if (status === "failed" || status === "cancelled")
    return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  if (status === "active") return "bg-blue-600 text-white ring-1 ring-blue-600 dark:bg-blue-500 dark:ring-blue-500";
  return "bg-[#f4f4f5] text-[#52525b] ring-1 ring-[#eaeaea]";
}

const filterInputClass =
  "h-8 rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] font-medium text-[#52525b] outline-none focus:border-black";

export function CallLogsShell() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [agentId, setAgentId] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("");
  const [direction, setDirection] =
    useState<(typeof directionOptions)[number]>("");
  const [sentiment, setSentiment] =
    useState<(typeof sentimentOptions)[number]>("");
  const [search, setSearch] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedPhoneNumber, setDebouncedPhoneNumber] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [minDuration, setMinDuration] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [inrPerUsd, setInrPerUsd] = useState(96.5);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(
    getDashboardSidebarInitialState,
  );
  const callRequestSequenceRef = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedPhoneNumber(phoneNumber);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [phoneNumber, search]);

  const loadCalls = useCallback(async () => {
    const requestSequence = ++callRequestSequenceRef.current;
    setLoading(true);
    try {
      const result = await voiceApi.calls({
        agentId,
        status,
        direction,
        sentiment,
        search: debouncedSearch,
        phoneNumber: debouncedPhoneNumber,
        from: queryDate(startTime),
        to: queryDate(endTime),
        minDuration,
        page,
        limit: 20,
      });
      if (requestSequence !== callRequestSequenceRef.current) return;
      setCalls(result.calls);
      setPages(Math.max(1, result.pagination.pages));
      setTotal(result.pagination.total);
      setNotice("");
    } catch (error) {
      if (requestSequence !== callRequestSequenceRef.current) return;
      setNotice(publicVoiceMessage(error, "Could not load call records."));
    } finally {
      if (requestSequence === callRequestSequenceRef.current) setLoading(false);
    }
  }, [
    agentId,
    debouncedPhoneNumber,
    debouncedSearch,
    direction,
    endTime,
    minDuration,
    page,
    sentiment,
    startTime,
    status,
  ]);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/calls");
      return;
    }
    void validateStoredSession();
    void voiceApi
      .agentSummaries()
      .then((result) => setAgents(result.agents))
      .catch(() => setAgents([]));
    void billingApi.summary()
      .then((summary) => setInrPerUsd(summary.inrPerUsd ?? 96.5))
      .catch(() => undefined);
  }, [router, session]);

  useEffect(() => {
    if (!session) return;
    const filtersSettled =
      search === debouncedSearch && phoneNumber === debouncedPhoneNumber;
    const refreshVisibleCalls = () => {
      if (filtersSettled && document.visibilityState === "visible")
        void loadCalls();
    };
    const initialLoad = window.setTimeout(refreshVisibleCalls, 0);
    const timer = window.setInterval(refreshVisibleCalls, 10000);
    window.addEventListener("focus", refreshVisibleCalls);
    return () => {
      callRequestSequenceRef.current += 1;
      window.clearTimeout(initialLoad);
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshVisibleCalls);
    };
  }, [
    debouncedPhoneNumber,
    debouncedSearch,
    loadCalls,
    phoneNumber,
    search,
    session,
  ]);

  const advancedFilterCount =
    [sentiment, phoneNumber, startTime, endTime].filter(Boolean).length +
    (minDuration ? 1 : 0);
  const activeFilterCount =
    [
      agentId,
      status,
      direction,
      sentiment,
      search,
      phoneNumber,
      startTime,
      endTime,
    ].filter(Boolean).length + (minDuration ? 1 : 0);

  async function openCall(callId: string) {
    try {
      const result = await voiceApi.call(callId);
      setSelectedCall(result.call);
    } catch (error) {
      setNotice(publicVoiceMessage(error, "Could not load the call."));
    }
  }

  async function exportCsv() {
    try {
      const blob = await voiceApi.exportCallsCsv();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `calls-${new Date().toISOString().slice(0, 10)}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setNotice(publicVoiceMessage(error, "Could not export calls."));
    }
  }

  function resetFilters() {
    setAgentId("");
    setStatus("");
    setDirection("");
    setSentiment("");
    setSearch("");
    setPhoneNumber("");
    setDebouncedSearch("");
    setDebouncedPhoneNumber("");
    setStartTime("");
    setEndTime("");
    setMinDuration(0);
    setShowAdvancedFilters(false);
    setPage(1);
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-700">
        Loading call records
      </main>
    );
  }

  return (
    <main
      className={`dashboard-home-theme grid min-h-screen bg-white text-slate-950 ${
        showUserSidebar
          ? "lg:grid-cols-[248px_minmax(0,1fr)]"
          : "lg:grid-cols-[64px_minmax(0,1fr)]"
      }`}
    >
      <DashboardSidebar
        activeLabel="Call Logs"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() =>
          void logoutSession().then(() => router.replace("/login"))
        }
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />
      <section className="min-w-0">
        <DashboardPageHeader
          eyebrow="Conversation operations"
          title="Call logs"
          description="Every browser, inbound, and outbound call is captured here with its status, timing, outcome, and transcript."
          actions={
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12px] font-medium text-[#171717] hover:border-blue-300 hover:bg-blue-50"
                type="button"
                onClick={() => void loadCalls()}
              >
                Refresh
              </button>
              <button
                className="inline-flex h-8 items-center rounded-md bg-[#2563eb] px-3 text-[12px] font-medium text-white hover:bg-[#1d4ed8]"
                type="button"
                onClick={() => void exportCsv()}
              >
                Export CSV
              </button>
            </div>
          }
        />
        <div className="dashboard-page-content call-logs-page-content grid w-full py-0">
          <section className="dashboard-flat-panel overflow-hidden rounded-lg border border-[#eaeaea] bg-white">
            <div className="dashboard-filter-bar grid gap-2.5 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  className="h-8 min-w-[220px] flex-1 rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] text-[#171717] outline-none placeholder:text-[#71717a] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  placeholder="Search transcript, tag, or outcome"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                />
                <select
                  className={filterInputClass}
                  value={agentId}
                  onChange={(event) => {
                    setAgentId(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All agents</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
                <select
                  className={filterInputClass}
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value as typeof status);
                    setPage(1);
                  }}
                >
                  {statusOptions.map((item) => (
                    <option key={item || "all"} value={item}>
                      {item ? titleCase(item) : "All statuses"}
                    </option>
                  ))}
                </select>
                <select
                  className={filterInputClass}
                  value={direction}
                  onChange={(event) => {
                    setDirection(event.target.value as typeof direction);
                    setPage(1);
                  }}
                >
                  {directionOptions.map((item) => (
                    <option key={item || "all"} value={item}>
                      {item ? titleCase(item) : "All directions"}
                    </option>
                  ))}
                </select>
                <button
                  className={`inline-flex h-8 items-center rounded-md border px-2.5 text-[12px] font-medium transition ${showAdvancedFilters || advancedFilterCount ? "border-blue-200 bg-blue-50 text-blue-700" : "border-[#eaeaea] bg-white text-[#52525b] hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"}`}
                  type="button"
                  onClick={() => setShowAdvancedFilters((current) => !current)}
                >
                  More filters
                  {advancedFilterCount ? ` · ${advancedFilterCount}` : ""}
                </button>
              </div>
              {showAdvancedFilters ? (
                <div className="grid gap-2 rounded-lg border border-[#eaeaea] bg-[#fafafa] p-3 sm:grid-cols-2 xl:grid-cols-5">
                  <select
                    className={filterInputClass}
                    value={sentiment}
                    onChange={(event) => {
                      setSentiment(event.target.value as typeof sentiment);
                      setPage(1);
                    }}
                  >
                    {sentimentOptions.map((item) => (
                      <option key={item || "all"} value={item}>
                        {item ? titleCase(item) : "All sentiment"}
                      </option>
                    ))}
                  </select>
                  <select
                    className={filterInputClass}
                    value={minDuration}
                    onChange={(event) => {
                      setMinDuration(Number(event.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={0}>Any duration</option>
                    <option value={30}>30+ seconds</option>
                    <option value={60}>1+ minute</option>
                    <option value={300}>5+ minutes</option>
                  </select>
                  <input
                    className={filterInputClass}
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(event) => {
                      setPhoneNumber(event.target.value);
                      setPage(1);
                    }}
                  />
                  <input
                    className={filterInputClass}
                    aria-label="Start time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(event) => {
                      setStartTime(event.target.value);
                      setPage(1);
                    }}
                  />
                  <input
                    className={filterInputClass}
                    aria-label="End time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(event) => {
                      setEndTime(event.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-3">
                <button
                  className="text-sm font-semibold text-slate-500 hover:text-slate-950 disabled:cursor-default disabled:opacity-40"
                  disabled={!activeFilterCount}
                  type="button"
                  onClick={resetFilters}
                >
                  Clear {activeFilterCount ? `${activeFilterCount} ` : ""}
                  filters
                </button>
                <span className="text-xs font-medium text-slate-500">
                  {loading ? "Updating..." : `${total} records`}
                </span>
              </div>
            </div>

            {notice ? (
              <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {notice}
              </div>
            ) : null}

            <div className="overflow-x-auto">
              <table className="dashboard-data-table w-full min-w-[1050px] border-collapse text-left">
                <thead className="border-b border-[#eaeaea] bg-[#fafafa] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#71717a]">
                  <tr>
                    {[
                      "Agent",
                      "Direction",
                      "From / To",
                      "Started",
                      "Ended",
                      "Duration",
                      "Cost",
                      "Status",
                    ].map((heading) => (
                      <th className="px-4 py-2.5" key={heading}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaeaea]">
                  {calls.map((call) => (
                    <tr
                      className="cursor-pointer transition hover:bg-[#fafafa]"
                      key={call._id}
                      onClick={() => void openCall(call._id)}
                      onPointerDown={preloadCallDetailDrawer}
                      onPointerEnter={preloadCallDetailDrawer}
                    >
                      <td className="px-4 py-3">
                        <strong className="block text-[13px] font-medium text-[#171717]">
                          {agentName(call)}
                        </strong>
                      </td>
                      <td className="px-4 py-3 text-[12px] font-medium capitalize text-[#52525b]">
                        {call.direction}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#52525b]">
                        <CallRoute call={call} compact />
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#71717a]">
                        {formatDate(call.startedAt ?? call.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#71717a]">
                        {call.endedAt ? (
                          formatDate(call.endedAt)
                        ) : call.status === "active" ? (
                          <span className="font-semibold text-[#171717]">
                            Live
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] text-[#171717]">
                        {formatDuration(call.durationSeconds)}
                      </td>
                      <td className="px-4 py-3 text-[12px] font-medium text-[#171717]">
                        {money(
                          call.billing?.estimatedChargeCredits ??
                            call.billing?.chargedCredits ??
                            0,
                          call.billing?.currency,
                          inrPerUsd,
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone(call.status)}`}
                        >
                          {titleCase(call.status)}
                        </span>
                        {call.endReason ? (
                          <span className="mt-0.5 block max-w-[130px] truncate text-[10px] text-[#a1a1aa]">
                            {call.endReason}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && !calls.length ? (
                <div className="grid min-h-56 place-items-center border-t border-[#eaeaea] p-8 text-center text-xs text-[#71717a]">
                  No calls match these filters. Start a browser or phone call
                  and it will appear here.
                </div>
              ) : null}
            </div>

            <footer className="flex items-center justify-between border-t border-[#eaeaea] p-3 text-xs text-[#71717a]">
              <span>
                Page {page} of {pages}
              </span>
              <div className="flex gap-2">
                <button
                  className="rounded-md border border-[#eaeaea] bg-white px-2.5 py-1 text-[12px] font-medium text-[#171717] hover:bg-[#f4f4f5] disabled:opacity-40"
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </button>
                <button
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-40"
                  type="button"
                  disabled={page >= pages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </button>
              </div>
            </footer>
          </section>
        </div>
      </section>
      {selectedCall ? (
        <CallDetailDrawer
          call={selectedCall}
          inrPerUsd={inrPerUsd}
          onClose={() => setSelectedCall(null)}
        />
      ) : null}
    </main>
  );
}
