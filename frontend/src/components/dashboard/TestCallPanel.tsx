"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track } from "livekit-client";

import { voiceApi } from "@/lib/voice";

type Props = {
  agentId: string;
  agentName: string;
  onClose: () => void;
  onRegionChange: (region: string) => void;
};

export function TestCallPanel({ agentId, agentName, onClose, onRegionChange }: Props) {
  const roomRef = useRef<Room | null>(null);
  const audioElementsRef = useRef<HTMLMediaElement[]>([]);
  const dispatchTimerRef = useRef<number | null>(null);
  const [mode, setMode] = useState<"web" | "phone">("web");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("Ready to connect");
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [remoteCount, setRemoteCount] = useState(0);
  const [audioCount, setAudioCount] = useState(0);

  const stopDispatchPolling = useCallback(() => {
    if (dispatchTimerRef.current) {
      window.clearInterval(dispatchTimerRef.current);
      dispatchTimerRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    stopDispatchPolling();
    roomRef.current?.disconnect();
    roomRef.current = null;
    audioElementsRef.current.forEach((element) => element.remove());
    audioElementsRef.current = [];
    setActive(false);
    setRemoteCount(0);
    setAudioCount(0);
    setStatus("Call ended");
  }, [stopDispatchPolling]);

  useEffect(() => disconnect, [disconnect]);

  function startDispatchPolling(roomName: string, dispatchId = "") {
    stopDispatchPolling();
    let checks = 0;
    const check = async () => {
      checks += 1;
      try {
        const health = await voiceApi.agentDispatchStatus({ roomName, dispatchId });
        if (health.region) onRegionChange(health.region);
        if (!roomRef.current && mode === "web") {
          stopDispatchPolling();
          return;
        }
        if (health.state === "failed") {
          setStatus(health.message);
          stopDispatchPolling();
          return;
        }
        if (health.state === "running") {
          setStatus((current) =>
            current.includes("Receiving audio") ? current : "AI worker accepted the call. Waiting for audio...",
          );
        } else if (health.state === "pending" || health.state === "waiting") {
          setStatus(health.message);
        } else if (health.state === "missing" && checks > 2) {
          setStatus(health.message);
        }
        if (checks >= 20) stopDispatchPolling();
      } catch {
        if (checks >= 3) stopDispatchPolling();
      }
    };

    void check();
    dispatchTimerRef.current = window.setInterval(() => void check(), 2500);
  }

  async function startWebCall() {
    setBusy(true);
    setStatus("Creating browser voice room...");
    try {
      const credentials = await voiceApi.webCallToken(agentId);
      setStatus(credentials.dispatch.message);
      startDispatchPolling(credentials.roomName, credentials.dispatchId);
      const room = new Room({ adaptiveStream: true, dynacast: true });
      let subscribedAudioTracks = 0;
      const refreshParticipants = () => setRemoteCount(room.remoteParticipants.size);
      roomRef.current = room;

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind !== Track.Kind.Audio) return;
        const element = track.attach();
        element.autoplay = true;
        document.body.appendChild(element);
        audioElementsRef.current.push(element);
        subscribedAudioTracks += 1;
        setAudioCount(subscribedAudioTracks);
        stopDispatchPolling();
        setStatus(`Receiving audio from ${agentName}`);
      });
      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        if (track.kind !== Track.Kind.Audio) return;
        subscribedAudioTracks = Math.max(0, subscribedAudioTracks - 1);
        setAudioCount(subscribedAudioTracks);
      });
      room.on(RoomEvent.ParticipantConnected, (participant) => {
        refreshParticipants();
        setStatus(`${participant.name || "AI agent"} joined. Waiting for audio...`);
      });
      room.on(RoomEvent.ParticipantDisconnected, () => {
        refreshParticipants();
        setStatus("AI participant left the room");
      });
      room.on(RoomEvent.Disconnected, () => {
        setActive(false);
        setRemoteCount(0);
        setAudioCount(0);
        setStatus("Call ended");
      });

      await room.connect(credentials.serverUrl, credentials.participantToken);
      if (room.serverInfo?.region) onRegionChange(room.serverInfo.region);
      await room.localParticipant.setMicrophoneEnabled(true, {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });
      await room.startAudio();
      setActive(true);
      refreshParticipants();
      setStatus(room.remoteParticipants.size ? `Connected to ${agentName}` : `Connected. Waiting for ${agentName} to join...`);
      window.setTimeout(() => {
        if (roomRef.current === room && room.remoteParticipants.size === 0) {
          setStatus("Still waiting for the AI agent. Check the backend agent worker logs.");
        }
      }, 8000);
    } catch (error) {
      disconnect();
      setStatus(error instanceof Error ? error.message : "Could not start the web call.");
    } finally {
      setBusy(false);
    }
  }

  async function startPhoneCall() {
    setBusy(true);
    setStatus("Dialing phone. Answer the incoming call to connect...");
    try {
      const call = await voiceApi.outboundCall(agentId, phoneNumber.trim());
      setActive(true);
      if (call.dispatch.region) onRegionChange(call.dispatch.region);
      setStatus(call.dispatch.message || `Phone call connected. Room: ${call.roomName}`);
      startDispatchPolling(call.roomName, call.dispatchId);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not start the phone call.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid overflow-y-auto bg-[#0f172a]/60 p-3 backdrop-blur-sm sm:place-items-center sm:p-4">
      <section className="my-auto max-h-[calc(100dvh-1.5rem)] w-full min-w-0 max-w-lg overflow-y-auto rounded-2xl border border-white/20 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.35)] sm:max-h-[calc(100dvh-2rem)]">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#dbeafe] bg-white/95 p-4 backdrop-blur">
          <div className="min-w-0">
            <h2 className="app-section-title m-0 truncate" title={`Test ${agentName}`}>Test {agentName}</h2>
            <span className="app-caption">AI Voice Platform realtime session</span>
          </div>
          <button className="app-button-text shrink-0 rounded-lg border border-[#d5d8df] bg-white px-3 py-2 transition hover:bg-[#f8fafc]" type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="grid min-w-0 gap-4 p-4 sm:gap-5 sm:p-5">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#f1f5f9] p-1">
            {(["web", "phone"] as const).map((item) => (
              <button
                className={`app-button-text flex-1 rounded-md px-3 py-2 ${mode === item ? "bg-white text-[#1438f5] shadow-sm" : "text-[#64748b]"}`}
                key={item}
                type="button"
                onClick={() => setMode(item)}
                disabled={active}
              >
                {item === "web" ? "Browser microphone" : "Phone call"}
              </button>
            ))}
          </div>

          <div className="relative grid min-h-44 min-w-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#111827] via-[#1d4ed8] to-[#0f766e] p-4 text-white shadow-inner sm:p-5">
            <span className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-cyan-300/15 blur-2xl" />
            <span className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-blue-300/15 blur-2xl" />
            <div className="relative grid min-w-0 max-w-full place-items-center gap-4 text-center">
              <div className={`relative grid size-20 place-items-center rounded-full bg-white/15 ${active ? "ring-8 ring-white/10" : ""}`}>
                {active ? <span className="absolute inset-0 animate-ping rounded-full bg-cyan-200/20" /> : null}
                <span className="text-xl font-bold">AI</span>
              </div>
              <div className="flex h-8 items-center gap-1" aria-label={active ? "Call audio active" : "Call audio inactive"}>
                {[16, 28, 20, 32, 24, 30, 18].map((height, index) => (
                  <span
                    className={`w-1.5 rounded-full bg-cyan-100 ${active ? "animate-pulse" : "opacity-40"}`}
                    key={`${height}-${index}`}
                    style={{ height, animationDelay: `${index * 90}ms` }}
                  />
                ))}
              </div>
              <p className="m-0 max-w-full break-words text-sm leading-5 text-white/85">{status}</p>
              <div className="flex flex-wrap justify-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                <span>{remoteCount} remote participant{remoteCount === 1 ? "" : "s"}</span>
                <span>{audioCount} audio track{audioCount === 1 ? "" : "s"}</span>
              </div>
            </div>
          </div>

          {mode === "phone" && !active ? (
            <label className="app-label grid gap-2">
              <span>Destination number</span>
              <input
                className="app-control-text min-h-11 rounded-lg border border-[#dfe3ea] px-3 text-black outline-none focus:border-[#2563eb]"
                placeholder="+12525550123"
                inputMode="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
              />
            </label>
          ) : null}

          <button
            className={`app-button-text min-h-11 rounded-lg px-4 text-white ${active ? "bg-[#dc2626]" : "bg-[#1438f5]"}`}
            type="button"
            disabled={busy}
            onClick={active ? disconnect : mode === "web" ? startWebCall : startPhoneCall}
          >
            {busy ? "Connecting..." : active ? "End call" : mode === "web" ? "Start web call" : "Call phone"}
          </button>
        </div>
      </section>
    </div>
  );
}
