"use client";

import { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track } from "livekit-client";

import { voiceApi } from "@/lib/voice";

type Props = {
  agentId: string;
  agentName: string;
  onClose: () => void;
};

export function TestCallPanel({ agentId, agentName, onClose }: Props) {
  const roomRef = useRef<Room | null>(null);
  const audioElementsRef = useRef<HTMLMediaElement[]>([]);
  const [mode, setMode] = useState<"web" | "phone">("web");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("Ready to connect");
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [remoteCount, setRemoteCount] = useState(0);
  const [audioCount, setAudioCount] = useState(0);

  function disconnect() {
    roomRef.current?.disconnect();
    roomRef.current = null;
    audioElementsRef.current.forEach((element) => element.remove());
    audioElementsRef.current = [];
    setActive(false);
    setRemoteCount(0);
    setAudioCount(0);
    setStatus("Call ended");
  }

  useEffect(() => disconnect, []);

  async function startWebCall() {
    setBusy(true);
    setStatus("Creating browser voice room...");
    try {
      const credentials = await voiceApi.webCallToken(agentId);
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
      setStatus(`Phone call connected. Room: ${call.roomName}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not start the phone call.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0f172a]/55 p-4 backdrop-blur-sm">
      <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-[#e5e7eb] p-4">
          <div>
            <h2 className="app-section-title m-0">Test {agentName}</h2>
            <span className="app-caption">AI Voice Platform realtime session</span>
          </div>
          <button className="app-button-text rounded-lg border border-[#d5d8df] px-3 py-2" type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="grid gap-5 p-5">
          <div className="flex gap-1 rounded-lg bg-[#f1f5f9] p-1">
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

          <div className="grid min-h-44 place-items-center rounded-2xl bg-gradient-to-br from-[#111827] via-[#1d4ed8] to-[#0f766e] p-5 text-white">
            <div className="grid place-items-center gap-4 text-center">
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
              <p className="m-0 text-sm text-white/85">{status}</p>
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
