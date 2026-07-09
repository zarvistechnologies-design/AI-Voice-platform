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
import { publicVoiceMessage, voiceApi, type AgentSummary, type CallRecord, type CostPricingDetail } from "@/lib/voice";

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

function configuredStack(provider: string, model: string) {
  return [provider, model].filter(Boolean).join(" / ") || "-";
}

function configuredTtsStack(call: CallRecord) {
  return [configuredStack(call.ttsProvider, call.ttsModel), call.ttsVoice].filter((item) => item && item !== "-").join(" / ") || "-";
}

function configuredRealtimeStack(call: CallRecord) {
  return configuredStack(call.realtimeProvider || call.llmProvider, call.realtimeModel || call.llmModel);
}

function configuredCallStack(call: CallRecord) {
  if (call.pipelineMode === "realtime" || isRealtimeAudioCall(call)) {
    return `Realtime: ${configuredRealtimeStack(call)}`;
  }
  return `${configuredStack(call.llmProvider, call.llmModel)} / ${configuredStack(call.sttProvider, call.sttModel)} / ${configuredTtsStack(call)}`;
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

function isRealtimeAudioCall(call: CallRecord) {
  const stack = [call.realtimeProvider, call.realtimeModel, call.llmProvider, call.llmModel].filter(Boolean).join(" ").toLowerCase();
  return stack.includes("realtime") || stack.includes("live");
}

function displaySttSeconds(call: CallRecord) {
  if (call.sttSeconds > 0) return { seconds: call.sttSeconds, estimated: Boolean(call.costBreakdown?.pricing?.stt?.estimated) };
  if (
    (call.status === "completed" || call.status === "failed") &&
    call.durationSeconds > 0 &&
    call.sttProvider &&
    call.sttModel &&
    !isRealtimeAudioCall(call)
  ) {
    return { seconds: call.durationSeconds, estimated: true };
  }
  return { seconds: 0, estimated: false };
}

function sourceLabel(source?: CostPricingDetail["source"]) {
  if (source === "override") return "Override";
  if (source === "account") return "Account";
  if (source === "unpriced") return "Unpriced";
  if (source === "not_applicable") return "N/A";
  if (source === "mixed") return "Mixed";
  return "Catalog";
}

function rate(value: number, suffix: string) {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 4 })}${suffix}`;
}

function rateLabel(detail?: CostPricingDetail) {
  if (!detail) return "-";
  if (detail.models?.length) return `${sourceLabel(detail.source)}: ${detail.models.length} model rates`;
  const parts = [
    detail.inputPerMillionTokens !== undefined ? rate(detail.inputPerMillionTokens, "/M in") : "",
    detail.cachedInputPerMillionTokens !== undefined ? rate(detail.cachedInputPerMillionTokens, "/M cached") : "",
    detail.outputPerMillionTokens !== undefined ? rate(detail.outputPerMillionTokens, "/M out") : "",
    detail.inputAudioPerMillionTokens !== undefined ? rate(detail.inputAudioPerMillionTokens, "/M audio in") : "",
    detail.outputAudioPerMillionTokens !== undefined ? rate(detail.outputAudioPerMillionTokens, "/M audio out") : "",
    detail.perMinute !== undefined ? rate(detail.perMinute, "/min") : "",
    detail.perMillionCharacters !== undefined ? rate(detail.perMillionCharacters, "/M chars") : "",
    detail.perMillionAudioTokens !== undefined ? rate(detail.perMillionAudioTokens, "/M audio tokens") : "",
  ].filter(Boolean);
  const multiplier = detail.voiceMultiplier ? ` x${detail.voiceMultiplier}` : "";
  const estimated = detail.estimated ? " est." : "";
  return `${sourceLabel(detail.source)}: ${parts.join(", ") || detail.unit || detail.key || "-"}${multiplier}${estimated}`;
}

function rateTitle(detail?: CostPricingDetail) {
  if (!detail) return "";
  const models = detail.models?.map((item) => `${item.provider || ""}/${item.model || ""} ${rateLabel(item)}`).join("\n");
  return [detail.key, detail.note, models].filter(Boolean).join("\n");
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

function CallDetail({ call, onClose }: { call: CallRecord; onClose: () => void }) {
  const billing = call.billing;
  const charged = billing?.chargedCredits || billing?.estimatedChargeCredits || 0;
  const cost = call.costBreakdown;
  const [recordingObjectUrl, setRecordingObjectUrl] = useState({ callId: "", url: "" });
  const [recordingLoadState, setRecordingLoadState] = useState({ callId: "", loading: false, error: "" });
  const transcript = [...call.transcript].sort(
    (left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime(),
  );
  const privateRecording = Boolean(call.recordingKey && !call.recordingKey.startsWith("http"));
  const recordingHref = privateRecording
    ? ""
    : call.recordingUrl.startsWith("http")
      ? call.recordingUrl
      : call.recordingKey.startsWith("http")
        ? call.recordingKey
        : "";
  const recordingPlayerHref = recordingObjectUrl.callId === call._id ? recordingObjectUrl.url || recordingHref : recordingHref;
  const recordingLoading = recordingLoadState.callId === call._id && recordingLoadState.loading;
  const recordingLoadError = recordingLoadState.callId === call._id ? recordingLoadState.error : "";
  const llmUsage = call.llmInputTokens || call.llmOutputTokens
    ? `${call.llmInputTokens.toLocaleString("en-US")} in / ${call.llmOutputTokens.toLocaleString("en-US")} out`
    : call.llmTokens ? `${call.llmTokens.toLocaleString("en-US")} tokens` : "0 tokens";
  const sttDisplay = displaySttSeconds(call);
  const sttSecondsLabel = sttDisplay.seconds
    ? `${Math.round(sttDisplay.seconds)} sec${sttDisplay.estimated ? " est." : ""}`
    : "0 sec";
  const sttUsage = [
    sttSecondsLabel,
    call.sttInputTokens || call.sttOutputTokens
      ? `${call.sttInputTokens.toLocaleString("en-US")} in / ${call.sttOutputTokens.toLocaleString("en-US")} out`
      : "",
  ].filter(Boolean).join(" / ");
  const ttsUsage = [
    call.ttsCharacters ? `${call.ttsCharacters.toLocaleString("en-US")} chars` : "0 chars",
    call.ttsInputTokens || call.ttsOutputTokens
      ? `${call.ttsInputTokens.toLocaleString("en-US")} in / ${call.ttsOutputTokens.toLocaleString("en-US")} out`
      : "",
    call.ttsAudioSeconds ? `${Math.round(call.ttsAudioSeconds)} sec audio` : "",
  ].filter(Boolean).join(" / ");
  const callErrorMessage = call.errorMessage
    ? publicVoiceMessage(call.errorMessage, "Call ended before the agent could finish.")
    : "";
  const providerCostItems = (call.pipelineMode === "realtime" || isRealtimeAudioCall(call)
    ? [
        ["Realtime", configuredRealtimeStack(call), llmUsage, cost?.pricing?.llm, cost?.llm ?? 0, billing?.breakdown.chargedLlm ?? 0],
        ["Carrier", call.direction, `${Math.ceil(call.durationSeconds / 60)} min`, cost?.pricing?.telephony, cost?.telephony ?? 0, billing?.breakdown.chargedTelephony ?? 0],
      ]
    : [
        ["LLM", configuredStack(call.llmProvider, call.llmModel), llmUsage, cost?.pricing?.llm, cost?.llm ?? 0, billing?.breakdown.chargedLlm ?? 0],
        ["STT", configuredStack(call.sttProvider, call.sttModel), sttUsage, cost?.pricing?.stt, cost?.stt ?? 0, billing?.breakdown.chargedStt ?? 0],
        ["TTS", configuredTtsStack(call), ttsUsage, cost?.pricing?.tts, cost?.tts ?? 0, billing?.breakdown.chargedTts ?? 0],
        ["Carrier", call.direction, `${Math.ceil(call.durationSeconds / 60)} min`, cost?.pricing?.telephony, cost?.telephony ?? 0, billing?.breakdown.chargedTelephony ?? 0],
      ]) as readonly (readonly [string, string, string, CostPricingDetail | undefined, number, number])[];
  const costItems = [
    ...providerCostItems,
    [
      "Platform fee",
      "AI Voice Platform",
      `₹${cost?.platformFeeInrPerMinute ?? 1}/min × ${(call.durationSeconds / 60).toFixed(2)} min`,
      cost?.pricing?.platformFee,
      0,
      billing?.breakdown.chargedPlatformFee ?? cost?.platformFee ?? 0,
    ],
  ] as readonly (readonly [string, string, string, CostPricingDetail | undefined, number, number])[];

  useEffect(() => {
    let active = true;
    let objectUrl = "";
    if (!privateRecording) {
      return undefined;
    }

    void (async () => {
      await Promise.resolve();
      if (!active) return;
      setRecordingObjectUrl({ callId: "", url: "" });
      setRecordingLoadState({ callId: call._id, loading: true, error: "" });

      let lastError = "";
      const retryDelaysMs = [0, 1500, 3500, 7000];
      for (const delayMs of retryDelaysMs) {
        if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs));
        if (!active) return;
        try {
          const blob = await voiceApi.callRecordingBlob(call._id);
          if (!active) return;
          objectUrl = URL.createObjectURL(blob);
          setRecordingObjectUrl({ callId: call._id, url: objectUrl });
          setRecordingLoadState({ callId: call._id, loading: false, error: "" });
          return;
        } catch (error) {
          lastError = publicVoiceMessage(error, "Could not load the call recording.");
        }
      }
      if (active) setRecordingLoadState({ callId: call._id, loading: false, error: lastError });
    })();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [call._id, privateRecording]);

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

          {callErrorMessage ? (
            <section className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              <strong className="block">Call error</strong>
              {callErrorMessage}
            </section>
          ) : null}

          {cost?.pricingStatus === "unpriced" ? (
            <section className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              <strong className="block">Billing paused: exact pricing unavailable</strong>
              {(cost.missingPricing ?? []).map((item) => `${item.provider}/${item.model}`).join(", ") || "A provider/model rate is missing."}
            </section>
          ) : null}

          <section className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
            <div><span className="mb-2 block text-xs font-medium text-slate-500">From / To</span><CallRoute call={call} /></div>
            <div><span className="block text-xs font-medium text-slate-500">Usage</span><strong className="mt-1 block text-sm">{llmUsage} / {sttSecondsLabel} STT / {ttsUsage}</strong></div>
            <div><span className="block text-xs font-medium text-slate-500">Configured stack</span><strong className="mt-1 block text-sm">{configuredCallStack(call)}</strong></div>
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
                <a className="text-sm font-semibold text-cyan-700 hover:text-cyan-900" href={recordingPlayerHref} target="_blank" rel="noreferrer">
                  Open recording
                </a>
              </div>
            ) : recordingLoading ? (
              <div className="rounded-xl border border-dashed border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-700">
                Loading recording...
              </div>
            ) : recordingLoadError ? (
              <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
                The recording is saved but temporarily unavailable. {recordingLoadError}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                {call.recordingStatus === "failed"
                  ? "Recording could not be created for this call."
                  : call.recordingKey
                    ? "The recording is saved but temporarily unavailable."
                    : "No recording is available for this call."}
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="m-0 text-sm font-semibold text-slate-950">Cost and charge breakdown</h3>
                <p className="mt-1 text-xs text-slate-500">Customer charge = exact provider cost + prorated ₹1/min platform fee.</p>
              </div>
              <div className="grid gap-1 text-right text-xs">
                <span className="text-slate-500">Real provider cost: <strong className="text-slate-950">{money(cost?.providerCost ?? billing?.providerCost ?? 0, cost?.currency)}</strong></span>
                <span className="text-slate-500">Platform fee: <strong className="text-slate-950">{money(cost?.platformFee ?? billing?.platformFee ?? 0, cost?.currency)}</strong></span>
                <span className="text-slate-500">Customer total: <strong className="text-emerald-700">{money(charged || cost?.customerCost || 0, billing?.currency || cost?.currency)}</strong></span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-760px text-left text-sm">
                <thead className="bg-white text-xs uppercase tracking-wider text-slate-500">
                <tr>{["Component", "Configured provider / model", "Usage", "Rate used", "Provider cost", "Customer charge"].map((item) => <th className="px-4 py-3" key={item}>{item}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {costItems.map(([label, provider, usage, pricing, providerCost, chargedCost]) => (
                    <tr key={label}>
                      <td className="px-4 py-3 font-semibold text-slate-950">{label}</td>
                      <td className="px-4 py-3 text-slate-600">{provider}</td>
                      <td className="px-4 py-3 text-slate-600">{usage}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-600" title={rateTitle(pricing)}>{rateLabel(pricing)}</td>
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
            </div>
            <div className="grid gap-3">
              {transcript.length ? (
                transcript.map((item) => (
                  <article
                    className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                      item.role === "assistant"
                        ? "justify-self-start rounded-bl-md bg-cyan-50 text-cyan-950"
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
  const [agents, setAgents] = useState<AgentSummary[]>([]);
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
  const [showUserSidebar, setShowUserSidebar] = useState(false);

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
      setNotice(publicVoiceMessage(error, "Could not load call records."));
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
    void voiceApi.agentSummaries().then((result) => setAgents(result.agents)).catch(() => setAgents([]));
  }, [router, session]);

  useEffect(() => {
    if (!session) return;
    const refreshVisibleCalls = () => {
      if (document.visibilityState === "visible") void loadCalls();
    };
    const initialLoad = window.setTimeout(refreshVisibleCalls, 0);
    const timer = window.setInterval(refreshVisibleCalls, 10000);
    window.addEventListener("focus", refreshVisibleCalls);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshVisibleCalls);
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
                    {["Agent", "Direction", "Model", "From / To", "Started", "Duration", "Real provider cost", "Customer cost", "Status"].map((heading) => <th className="px-4 py-3" key={heading}>{heading}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calls.map((call) => (
                    <tr className="cursor-pointer transition hover:bg-cyan-50/60" key={call._id} onClick={() => void openCall(call._id)}>
                      <td className="px-4 py-4"><strong className="block text-sm text-slate-950">{agentName(call)}</strong></td>
                      <td className="px-4 py-4 text-sm font-medium capitalize text-slate-700">{call.direction}</td>
                      <td className="max-w-64 px-4 py-4 text-sm font-semibold text-slate-700" title={configuredCallStack(call)}>
                        <span className="block truncate">{configuredCallStack(call)}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700"><CallRoute call={call} compact /></td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatDate(call.startedAt ?? call.createdAt)}</td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-700">{formatDuration(call.durationSeconds)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{money(call.costBreakdown?.providerCost ?? call.billing?.providerCost ?? 0, call.costBreakdown?.currency)}</td>
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
