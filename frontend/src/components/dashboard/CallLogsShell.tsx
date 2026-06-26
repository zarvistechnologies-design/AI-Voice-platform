"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import { voiceApi, type BackendAgent, type CallRecord } from "@/lib/voice";

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
  return typeof call.agentId === "object" ? call.agentId.name : "Voice agent";
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
  if (!value) return "Waiting to start";
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

function queryDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function statusTone(status: CallRecord["status"]) {
  if (status === "completed") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "failed" || status === "cancelled") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (status === "active") return "bg-blue-50 text-blue-700 ring-blue-200";
  return "bg-amber-50 text-amber-700 ring-amber-200";
}

const filterInputClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-blue-500";

function CallDetail({ call, onClose }: { call: CallRecord; onClose: () => void }) {
  const billing = call.billing;
  const charged = billing?.chargedCredits || billing?.estimatedChargeCredits || 0;
  const cost = call.costBreakdown;
  const [recordingObjectUrl, setRecordingObjectUrl] = useState({ callId: "", url: "" });
  const transcript = [...call.transcript].sort(
    (left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime(),
  );
  const recordingHref = call.recordingUrl || (call.recordingKey.startsWith("http") ? call.recordingKey : "");
  const recordingPlayerHref = recordingObjectUrl.callId === call._id ? recordingObjectUrl.url || recordingHref : recordingHref;
  const costItems = [
    ["LLM", call.llmProvider || "-", call.llmTokens ? `${call.llmTokens.toLocaleString("en-US")} tokens` : "0 tokens", cost?.llm ?? 0, billing?.breakdown.chargedLlm ?? 0],
    ["STT", call.sttProvider || "-", call.sttSeconds ? `${Math.round(call.sttSeconds)} sec` : "0 sec", cost?.stt ?? 0, billing?.breakdown.chargedStt ?? 0],
    ["TTS", call.ttsProvider || "-", call.ttsCharacters ? `${call.ttsCharacters.toLocaleString("en-US")} chars` : "0 chars", cost?.tts ?? 0, billing?.breakdown.chargedTts ?? 0],
    ["Carrier", call.direction, `${Math.ceil(call.durationSeconds / 60)} min`, cost?.telephony ?? 0, billing?.breakdown.chargedTelephony ?? 0],
  ] as const;

  useEffect(() => {
    let active = true;
    let objectUrl = "";
    if (!call.recordingKey.startsWith("web/")) return undefined;

    void voiceApi.callRecordingBlob(call._id)
      .then((blob) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setRecordingObjectUrl({ callId: call._id, url: objectUrl });
      })
      .catch(() => undefined);

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [call._id, call.recordingKey]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-sm" onClick={onClose}>
      <aside
        className="h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-6 backdrop-blur">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(call.status)}`}>
                {titleCase(call.status)}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{call.direction}</span>
            </div>
            <h2 className="m-0 text-xl font-semibold text-slate-950">{agentName(call)}</h2>
            <p className="mt-1 text-sm text-slate-500">{formatDate(call.startedAt ?? call.createdAt)}</p>
          </div>
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="grid gap-6 p-6">
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Duration", formatDuration(call.durationSeconds)],
              ["Latency", call.avgResponseLatencyMs ? `${call.avgResponseLatencyMs} ms` : "-"],
              ["Sentiment", call.sentimentLabel ? titleCase(call.sentimentLabel) : "-"],
              ["Charged", money(charged, billing?.currency)],
            ].map(([label, value]) => (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3" key={label}>
                <span className="block text-xs font-medium text-slate-500">{label}</span>
                <strong className="mt-1 block truncate text-sm text-slate-950">{value}</strong>
              </div>
            ))}
          </section>

          {call.errorMessage ? (
            <section className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              <strong className="block">Call error</strong>
              {call.errorMessage}
            </section>
          ) : null}

          <section className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
            <div><span className="block text-xs font-medium text-slate-500">Caller / Called</span><strong className="mt-1 block text-sm">{call.callerNumber || "Browser"} / {call.calledNumber || "Agent"}</strong></div>
            <div><span className="block text-xs font-medium text-slate-500">Usage</span><strong className="mt-1 block text-sm">{call.llmTokens ?? 0} tokens / {Math.round(call.sttSeconds ?? 0)}s STT / {call.ttsCharacters ?? 0} TTS chars</strong></div>
            <div><span className="block text-xs font-medium text-slate-500">Providers</span><strong className="mt-1 block text-sm">{call.llmProvider || "-"} / {call.sttProvider || "-"} / {call.ttsProvider || "-"}</strong></div>
            <div><span className="block text-xs font-medium text-slate-500">Tags</span><strong className="mt-1 block text-sm">{call.tags.length ? call.tags.join(", ") : "No tags"}</strong></div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="m-0 text-sm font-semibold text-slate-950">Recording</h3>
                <p className="mt-1 text-xs text-slate-500">{call.recordingStatus ? titleCase(call.recordingStatus) : "Not recorded"}</p>
              </div>
              {call.recordingDuration ? <span className="text-xs font-semibold text-slate-500">{formatDuration(call.recordingDuration)}</span> : null}
            </div>
            {recordingPlayerHref ? (
              <div className="grid gap-3">
                <audio className="w-full" controls src={recordingPlayerHref} />
                <a className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={recordingPlayerHref} target="_blank" rel="noreferrer">
                  Open recording
                </a>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                {call.recordingError || (call.recordingKey ? `Recording saved as ${call.recordingKey}, but no public URL is available.` : "No recording is available for this call.")}
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="m-0 text-sm font-semibold text-slate-950">Cost and charge breakdown</h3>
                <p className="mt-1 text-xs text-slate-500">Provider cost is raw vendor spend. Charged is customer wallet debit.</p>
              </div>
              <div className="grid gap-1 text-right text-xs">
                <span className="text-slate-500">Provider total: <strong className="text-slate-950">{money(cost?.total ?? 0, cost?.currency)}</strong></span>
                <span className="text-slate-500">Charged total: <strong className="text-emerald-700">{money(charged, billing?.currency)}</strong></span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-white text-xs uppercase tracking-wider text-slate-500">
                  <tr>{["Component", "Provider", "Usage", "Provider cost", "Charged"].map((item) => <th className="px-4 py-3" key={item}>{item}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {costItems.map(([label, provider, usage, providerCost, chargedCost]) => (
                    <tr key={label}>
                      <td className="px-4 py-3 font-semibold text-slate-950">{label}</td>
                      <td className="px-4 py-3 text-slate-600">{provider}</td>
                      <td className="px-4 py-3 text-slate-600">{usage}</td>
                      <td className="px-4 py-3 text-slate-700">{money(providerCost, cost?.currency)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-950">{money(chargedCost, billing?.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="m-0 text-sm font-semibold text-slate-950">Conversation transcript</h3>
                <p className="mt-1 text-xs text-slate-500">{transcript.length} captured messages</p>
              </div>
              <span className="max-w-[220px] truncate rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">{call.livekitRoomName}</span>
            </div>
            <div className="grid gap-3">
              {transcript.length ? (
                transcript.map((item) => (
                  <article
                    className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                      item.role === "assistant"
                        ? "justify-self-start rounded-bl-md bg-blue-50 text-blue-950"
                        : item.role === "user"
                          ? "justify-self-end rounded-br-md bg-slate-900 text-white"
                          : "justify-self-center bg-amber-50 text-amber-900"
                    }`}
                    key={item.itemId}
                  >
                    <span className={`mb-1 block text-[11px] font-semibold uppercase tracking-wider ${item.role === "user" ? "text-slate-600" : "opacity-60"}`}>
                      {item.role === "assistant" ? agentName(call) : titleCase(item.role)}
                    </span>
                    <p className="m-0 text-sm leading-6">{item.text}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Transcript messages will appear here while the agent and caller speak.
                </div>
              )}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

export function CallLogsShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [agents, setAgents] = useState<BackendAgent[]>([]);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [agentId, setAgentId] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("");
  const [direction, setDirection] = useState<(typeof directionOptions)[number]>("");
  const [sentiment, setSentiment] = useState<(typeof sentimentOptions)[number]>("");
  const [search, setSearch] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [minDuration, setMinDuration] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const loadCalls = useCallback(async () => {
    setLoading(true);
    try {
      const result = await voiceApi.calls({
        agentId,
        status,
        direction,
        sentiment,
        search,
        phoneNumber,
        from: queryDate(startTime),
        to: queryDate(endTime),
        minDuration,
        page,
        limit: 20,
      });
      setCalls(result.calls);
      setPages(Math.max(1, result.pagination.pages));
      setTotal(result.pagination.total);
      setNotice("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load call records.");
    } finally {
      setLoading(false);
    }
  }, [agentId, direction, endTime, minDuration, page, phoneNumber, search, sentiment, startTime, status]);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/calls");
      return;
    }
    void validateStoredSession();
    void voiceApi.agents().then((result) => setAgents(result.agents)).catch(() => setAgents([]));
  }, [router, session]);

  useEffect(() => {
    if (!session) return;
    const initialLoad = window.setTimeout(() => void loadCalls(), 0);
    const timer = window.setInterval(() => void loadCalls(), 10000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(timer);
    };
  }, [loadCalls, session]);

  const metrics = useMemo(() => {
    const completed = calls.filter((call) => call.status === "completed").length;
    const active = calls.filter((call) => call.status === "active").length;
    const charged = calls.reduce((sum, call) => sum + (call.billing?.chargedCredits || call.billing?.estimatedChargeCredits || 0), 0);
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
      setNotice(error instanceof Error ? error.message : "Could not load the call.");
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
      setNotice(error instanceof Error ? error.message : "Could not export calls.");
    }
  }

  function resetFilters() {
    setAgentId("");
    setStatus("");
    setDirection("");
    setSentiment("");
    setSearch("");
    setPhoneNumber("");
    setStartTime("");
    setEndTime("");
    setMinDuration(0);
    setPage(1);
  }

  if (!session) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-700">Loading call records</main>;
  }

  return (
    <main className="grid min-h-screen bg-[#f4f7fb] text-slate-950 lg:grid-cols-[64px_minmax(0,1fr)]">
      <DashboardSidebar
        activeLabel="Call Logs"
        userInitials={initials(session.name)}
        onLogout={() => void logoutSession().then(() => router.replace("/login"))}
      />
      <section className="min-w-0 p-4">
        <div className="mx-auto grid max-w-[1500px] gap-6">
          <header className="border-b border-[#dbeafe] bg-white pb-4">
            <div className="h-1 bg-[#38bdf8]" aria-hidden="true" />
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0284c7]">Conversation operations</span>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Call logs</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Every browser, inbound, and outbound call is captured here with its status, timing, latency, and transcript.</p>
              </div>
              <div className="flex gap-2">
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50" type="button" onClick={() => void loadCalls()}>
                Refresh
              </button>
              <button className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-700" type="button" onClick={() => void exportCsv()}>
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
              ["Charged", money(metrics.charged), "Visible page total"],
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
                <input className="min-w-56 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Search transcript or tag" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
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
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    {["Agent", "Direction", "Contact", "Started", "Duration", "Provider cost", "Charged", "Status"].map((heading) => <th className="px-4 py-3" key={heading}>{heading}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calls.map((call) => (
                    <tr className="cursor-pointer transition hover:bg-blue-50/60" key={call._id} onClick={() => void openCall(call._id)}>
                      <td className="px-4 py-4"><strong className="block text-sm text-slate-950">{agentName(call)}</strong><span className="text-xs text-slate-500">{call.livekitRoomName}</span></td>
                      <td className="px-4 py-4 text-sm font-medium capitalize text-slate-700">{call.direction}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{call.callerNumber || call.calledNumber || "Browser caller"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatDate(call.startedAt ?? call.createdAt)}</td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-700">{formatDuration(call.durationSeconds)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{money(call.costBreakdown?.total ?? 0, call.costBreakdown?.currency)}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-950">{money(call.billing?.chargedCredits || call.billing?.estimatedChargeCredits || 0, call.billing?.currency)}</td>
                      <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(call.status)}`}>{titleCase(call.status)}</span></td>
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
      {selectedCall ? <CallDetail call={selectedCall} onClose={() => setSelectedCall(null)} /> : null}
    </main>
  );
}
