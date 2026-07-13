"use client";

import { useEffect, useState } from "react";

import { publicVoiceMessage, voiceApi, type CallRecord, type CostPricingDetail } from "@/lib/voice";

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

function formatTime(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", { timeStyle: "medium" }).format(new Date(value));
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

function isRealtimeAudioCall(call: CallRecord) {
  const stack = [call.llmProvider, call.llmModel].filter(Boolean).join(" ").toLowerCase();
  return stack.includes("realtime") || stack.includes("live");
}

function configuredCallStack(call: CallRecord) {
  if (call.pipelineMode === "realtime" || isRealtimeAudioCall(call)) {
    return `Realtime: ${configuredStack(call.llmProvider, call.llmModel)}`;
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

function CallRoute({ call }: { call: CallRecord }) {
  const route = callRoute(call);
  const numberClass = "min-w-0 truncate rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-sm font-semibold text-slate-950";
  return (
    <div className="grid gap-1.5">
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

function statusTone(status: CallRecord["status"]) {
  if (status === "completed") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "failed" || status === "cancelled") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (status === "active") return "bg-cyan-50 text-cyan-700 ring-cyan-200";
  return "bg-amber-50 text-amber-700 ring-amber-200";
}

export function CallDetailDrawer({ call, onClose }: { call: CallRecord; onClose: () => void }) {
  const billing = call.billing;
  const charged = billing?.estimatedChargeCredits ?? billing?.chargedCredits ?? 0;
  const cost = call.costBreakdown;
  const hasStructuredOutput = call.structuredOutput && Object.keys(call.structuredOutput).length > 0;
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
        ["Realtime", configuredStack(call.llmProvider, call.llmModel), llmUsage, cost?.pricing?.llm, cost?.llm ?? 0],
      ]
    : [
        ["LLM", configuredStack(call.llmProvider, call.llmModel), llmUsage, cost?.pricing?.llm, cost?.llm ?? 0],
        ["STT", configuredStack(call.sttProvider, call.sttModel), sttUsage, cost?.pricing?.stt, cost?.stt ?? 0],
        ["TTS", configuredTtsStack(call), ttsUsage, cost?.pricing?.tts, cost?.tts ?? 0],
      ]) as readonly (readonly [string, string, string, CostPricingDetail | undefined, number])[];
  const costItems = providerCostItems;

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
            <p className="mt-1 text-sm text-slate-500">
              Started {formatDate(call.startedAt ?? call.createdAt)}
              {call.endedAt ? <> &middot; Ended {formatDate(call.endedAt)}</> : null}
            </p>
          </div>
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="grid gap-6 p-6">
          <section className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {[
              ["Duration", formatDuration(call.durationSeconds)],
              ["Latency", call.avgResponseLatencyMs ? `${call.avgResponseLatencyMs} ms` : "—"],
              ["Sentiment", call.sentimentLabel ? titleCase(call.sentimentLabel) : "—"],
              ["Language", call.language || "—"],
              ["Provider cost", money(charged, billing?.currency)],
              ["Balance after", billing?.balanceAfterCredits != null ? money(billing.balanceAfterCredits, billing.currency) : "—"],
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
            <div><span className="block text-xs font-medium text-slate-500">End reason</span><strong className="mt-1 block text-sm">{call.endReason || "—"}</strong></div>
            {call.voicemailDetected ? <div className="col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2"><strong className="block text-xs font-semibold text-amber-700">Voicemail detected</strong><span className="mt-0.5 block text-xs text-amber-600">The agent left a voicemail message and ended the call.</span></div> : null}
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
                <audio className="w-full rounded-lg" controls src={recordingPlayerHref} />
                <div className="flex gap-3">
                  <a className="text-sm font-semibold text-cyan-700 hover:text-cyan-900" href={recordingPlayerHref} target="_blank" rel="noreferrer">
                    Open in new tab
                  </a>
                  <a className="text-sm font-semibold text-slate-600 hover:text-slate-950" href={recordingPlayerHref} download>
                    ↓ Download
                  </a>
                </div>
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
                <h3 className="m-0 text-sm font-semibold text-slate-950">Provider cost breakdown</h3>
                <p className="mt-1 text-xs text-slate-500">Total equals the selected provider/model cost only.</p>
              </div>
              <div className="grid gap-1 text-right text-xs">
                <span className="text-slate-500">Provider total: <strong className="text-emerald-700">{money(cost?.providerCost ?? billing?.providerCost ?? charged ?? 0, billing?.currency || cost?.currency)}</strong></span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-760px text-left text-sm">
                <thead className="bg-white text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    {["Component", "Provider / Model", "Usage", "Rate used", "Cost"].map((item) => <th className="px-4 py-3" key={item}>{item}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {costItems.map(([label, provider, usage, pricing, providerCost]) => (
                    <tr key={label}>
                      <td className="px-4 py-3 font-semibold text-slate-950">{label}</td>
                      <td className="px-4 py-3 text-slate-600">{provider}</td>
                      <td className="px-4 py-3 text-slate-600">{usage}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-600" title={rateTitle(pricing)}>{rateLabel(pricing)}</td>
                      <td className="px-4 py-3 text-slate-700">{money(providerCost, cost?.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {hasStructuredOutput ? (
            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="m-0 mb-3 text-sm font-semibold text-slate-950">Extracted data</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(call.structuredOutput!).map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">{key.replace(/_/g, " ")}</span>
                    <strong className="mt-0.5 block truncate text-sm text-slate-950">
                      {value === null || value === undefined ? "—" : typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </strong>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

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
                    <span className={`mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider ${item.role === "user" ? "text-slate-400" : "opacity-60"}`}>
                      <span>{item.role === "assistant" ? agentName(call) : titleCase(item.role)}</span>
                      {item.timestamp ? <span className="font-normal normal-case opacity-70">{formatTime(item.timestamp)}</span> : null}
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
