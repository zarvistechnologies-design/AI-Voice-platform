"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
    getServerSession,
    getSession,
    logoutSession,
    subscribeToSession,
    validateStoredSession,
} from "@/lib/auth";
import { publicVoiceMessage, voiceApi, type AgentSummary, type CallRecord } from "@/lib/voice";

const loadCallDetailDrawer = () => import("@/components/dashboard/CallDetailDrawer");
const CallDetailDrawer = dynamic(
  () => loadCallDetailDrawer().then((module) => module.CallDetailDrawer),
  { ssr: false },
);

function preloadCallDetailDrawer() {
  void loadCallDetailDrawer().catch(() => undefined);
}

const statusOptions = ["", "initiated", "ringing", "active", "completed", "failed", "cancelled"] as const;
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

function money(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Math.abs(value) < 1 ? 4 : 2,
    maximumFractionDigits: Math.abs(value) < 1 ? 4 : 2,
  }).format(value);
}

function formatRoomPhone(digits: string, destinationDigits = "") {
  if (!digits) return "";
  if (destinationDigits.startsWith("91") && digits.length === 11 && digits.startsWith("0")) {
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
  const callerDigits = [...suffix.matchAll(/\d{7,15}/g)]
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

  const inferredInboundNumbers = call.direction === "inbound" ? inboundRoomNumbers(call.livekitRoomName) : { callerNumber: "", calledNumber: "" };
  const from = call.callerNumber || inferredInboundNumbers.callerNumber;
  const fromSource = call.callerNumberSource || (!call.callerNumber && inferredInboundNumbers.callerNumber ? "room_name" : "recorded");
  const toSource = call.calledNumberSource || (!call.calledNumber && inferredInboundNumbers.calledNumber ? "room_name" : "recorded");
  return {
    from,
    fromSource,
    fromMissing: call.direction === "inbound" && !from,
    to: call.calledNumber || inferredInboundNumbers.calledNumber || (call.direction === "outbound" ? "Dialed number" : "Assigned number"),
    toSource,
  };
}

function CallRoute({ call, compact = false }: { call: CallRecord; compact?: boolean }) {
  const route = callRoute(call);
  const numberClass = compact
    ? "max-w-44 truncate rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs font-semibold text-slate-900"
    : "min-w-0 truncate rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-sm font-semibold text-slate-950";
  return (
    <div className={`grid gap-1.5 ${compact ? "min-w-56" : ""}`}>
      <div className="grid min-w-0 grid-cols-[44px_minmax(0,1fr)] items-center gap-2">
        <span className="rounded-md bg-cyan-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-cyan-700">From</span>
        {route.fromMissing ? (
          <span className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            Caller ID not sent
          </span>
        ) : (
          <span className={numberClass} title={route.from}>
            {route.from}{route.fromSource === "room_name" ? <span className="ml-1 font-sans text-[10px] font-bold uppercase text-amber-600">inferred</span> : null}
          </span>
        )}
      </div>
      <div className="grid min-w-0 grid-cols-[44px_minmax(0,1fr)] items-center gap-2">
        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">To</span>
        <span className={numberClass} title={route.to}>
          {route.to}{route.toSource === "room_name" ? <span className="ml-1 font-sans text-[10px] font-bold uppercase text-amber-600">inferred</span> : null}
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
  if (status === "completed") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "failed" || status === "cancelled") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (status === "active") return "bg-cyan-50 text-cyan-700 ring-cyan-200";
  return "bg-amber-50 text-amber-700 ring-amber-200";
}

const filterInputClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-cyan-500";

export function CallLogsShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [agentId, setAgentId] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("");
  const [direction, setDirection] = useState<(typeof directionOptions)[number]>("");
  const [sentiment, setSentiment] = useState<(typeof sentimentOptions)[number]>("");
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
  const [showUserSidebar, setShowUserSidebar] = useState(false);
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
  }, [agentId, debouncedPhoneNumber, debouncedSearch, direction, endTime, minDuration, page, sentiment, startTime, status]);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/calls");
      return;
    }
    void validateStoredSession();
    void voiceApi.agentSummaries().then((result) => setAgents(result.agents)).catch(() => setAgents([]));
  }, [router, session]);

  useEffect(() => {
    if (!session) return;
    const filtersSettled = search === debouncedSearch && phoneNumber === debouncedPhoneNumber;
    const refreshVisibleCalls = () => {
      if (filtersSettled && document.visibilityState === "visible") void loadCalls();
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
  }, [debouncedPhoneNumber, debouncedSearch, loadCalls, phoneNumber, search, session]);

  const metrics = useMemo(() => {
    const completed = calls.filter((call) => call.status === "completed").length;
    const active = calls.filter((call) => call.status === "active").length;
    const charged = calls.reduce((sum, call) => sum + (call.billing?.estimatedChargeCredits ?? call.billing?.chargedCredits ?? 0), 0);
    const averageDuration = calls.length
      ? Math.round(calls.reduce((sum, call) => sum + call.durationSeconds, 0) / calls.length)
      : 0;
    return { completed, active, averageDuration, charged };
  }, [calls]);

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
    setPage(1);
  }

  if (!session) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-700">Loading call records</main>;
  }

  return (
    <main className={`grid min-h-screen bg-[#f4f7fb] text-slate-950 ${
      showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
    }`}>
      <DashboardSidebar
        activeLabel="Call Logs"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => void logoutSession().then(() => router.replace("/login"))}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />
      <section className="min-w-0 p-4">
        <div className="mx-auto grid max-w-1500px gap-6">
          <header className="border-b border-[#99f6e8] bg-white pb-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00b8c4]">Conversation operations</span>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Call logs</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Every browser, inbound, and outbound call is captured here with its status, timing, latency, and transcript.</p>
              </div>
              <div className="flex gap-2">
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50" type="button" onClick={() => void loadCalls()}>
                Refresh
              </button>
              <button className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-600" type="button" onClick={() => void exportCsv()}>
                Export CSV
              </button>
              </div>
            </div>
          </header>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ["Total calls", total, "All persisted call records"],
              ["Completed", metrics.completed, "On this page"],
              ["Active now", metrics.active, "Live conversations"],
              ["Avg duration", formatDuration(metrics.averageDuration), "On this page"],
              ["Provider cost", money(metrics.charged), "Visible page total"],
            ].map(([label, value, detail]) => (
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={label}>
                <span className="text-xs font-medium text-slate-500">{label}</span>
                <strong className="mt-2 block text-2xl font-semibold tracking-tight text-slate-950">{value}</strong>
                <span className="mt-1 block text-xs text-slate-500">{detail}</span>
              </article>
            ))}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-3 border-b border-slate-200 p-4">
              <div className="flex flex-wrap gap-2">
                <input className="min-w-56 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500" placeholder="Search transcript or tag" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
                <select className={filterInputClass} value={agentId} onChange={(event) => { setAgentId(event.target.value); setPage(1); }}>
                  <option value="">All agents</option>
                  {agents.map((agent) => <option key={agent._id} value={agent._id}>{agent.name}</option>)}
                </select>
                <select className={filterInputClass} value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(1); }}>
                  {statusOptions.map((item) => <option key={item || "all"} value={item}>{item ? titleCase(item) : "All statuses"}</option>)}
                </select>
                <select className={filterInputClass} value={direction} onChange={(event) => { setDirection(event.target.value as typeof direction); setPage(1); }}>
                  {directionOptions.map((item) => <option key={item || "all"} value={item}>{item ? titleCase(item) : "All directions"}</option>)}
                </select>
                <select className={filterInputClass} value={sentiment} onChange={(event) => { setSentiment(event.target.value as typeof sentiment); setPage(1); }}>
                  {sentimentOptions.map((item) => <option key={item || "all"} value={item}>{item ? titleCase(item) : "All sentiment"}</option>)}
                </select>
                <select className={filterInputClass} value={minDuration} onChange={(event) => { setMinDuration(Number(event.target.value)); setPage(1); }}>
                  <option value={0}>Any duration</option><option value={30}>30+ seconds</option><option value={60}>1+ minute</option><option value={300}>5+ minutes</option>
                </select>
                <input className={filterInputClass} placeholder="Phone number" value={phoneNumber} onChange={(event) => { setPhoneNumber(event.target.value); setPage(1); }} />
                <input className={filterInputClass} aria-label="Start time" type="datetime-local" value={startTime} onChange={(event) => { setStartTime(event.target.value); setPage(1); }} />
                <input className={filterInputClass} aria-label="End time" type="datetime-local" value={endTime} onChange={(event) => { setEndTime(event.target.value); setPage(1); }} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <button className="text-sm font-semibold text-slate-500 hover:text-slate-950" type="button" onClick={resetFilters}>
                  Clear filters
                </button>
                <span className="text-xs font-medium text-slate-500">{loading ? "Updating..." : `${total} records`}</span>
              </div>
            </div>

            {notice ? <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{notice}</div> : null}

            <div className="overflow-x-auto">
              <table className="w-full min-w-1050px border-collapse text-left">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    {["Agent", "Direction", "From / To", "Started", "Ended", "Duration", "Cost", "Status"].map((heading) => <th className="px-4 py-3" key={heading}>{heading}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calls.map((call) => (
                    <tr className="cursor-pointer transition hover:bg-cyan-50/60" key={call._id} onClick={() => void openCall(call._id)} onPointerDown={preloadCallDetailDrawer} onPointerEnter={preloadCallDetailDrawer}>
                      <td className="px-4 py-4"><strong className="block text-sm text-slate-950">{agentName(call)}</strong></td>
                      <td className="px-4 py-4 text-sm font-medium capitalize text-slate-700">{call.direction}</td>
                      <td className="px-4 py-4 text-sm text-slate-700"><CallRoute call={call} compact /></td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatDate(call.startedAt ?? call.createdAt)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {call.endedAt
                          ? formatDate(call.endedAt)
                          : call.status === "active"
                            ? <span className="font-semibold text-cyan-600">Live</span>
                            : "—"}
                      </td>
                      <td className="px-4 py-4 font-mono text-sm font-medium text-slate-700">{formatDuration(call.durationSeconds)}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-950">{money(call.billing?.estimatedChargeCredits ?? call.billing?.chargedCredits ?? 0, call.billing?.currency)}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(call.status)}`}>{titleCase(call.status)}</span>
                        {call.endReason ? <span className="mt-1 block max-w-[130px] truncate text-[11px] text-slate-500">{call.endReason}</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && !calls.length ? <div className="grid min-h-56 place-items-center border-t border-slate-100 p-8 text-center text-sm text-slate-500">No calls match these filters. Start a browser or phone call and it will appear here.</div> : null}
            </div>

            <footer className="flex items-center justify-between border-t border-slate-200 p-4">
              <span className="text-xs font-medium text-slate-500">Page {page} of {pages}</span>
              <div className="flex gap-2">
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-40" type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-40" type="button" disabled={page >= pages} onClick={() => setPage((current) => current + 1)}>Next</button>
              </div>
            </footer>
          </section>
        </div>
      </section>
      {selectedCall ? <CallDetailDrawer call={selectedCall} onClose={() => setSelectedCall(null)} /> : null}
    </main>
  );
}
