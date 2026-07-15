"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track, setLogLevel } from "livekit-client";

import { voiceApi } from "@/lib/voice";

setLogLevel("silent");

type Props = {
  agentId: string;
  agentName: string;
  knowledgeCount: number;
  recordingEnabled: boolean;
  onClose: () => void;
  onRegionChange: (region: string) => void;
};

type WindowWithWebkitAudioContext = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

function preferredRecordingMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  return [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ].find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? "";
}

function knowledgeStatus(count: number) {
  return count > 0 ? `${count} knowledge ${count === 1 ? "file" : "files"} attached` : "No knowledge files attached";
}

function recordingTrackId(track: MediaStreamTrack) {
  return track.id || `${track.kind}:${track.label}`;
}

export function TestCallPanel({ agentId, agentName, knowledgeCount, recordingEnabled, onClose, onRegionChange }: Props) {
  const roomRef = useRef<Room | null>(null);
  const audioElementsRef = useRef<HTMLMediaElement[]>([]);
  const dispatchTimerRef = useRef<number | null>(null);
  const webCallIdRef = useRef("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingFinishPromiseRef = useRef<Promise<void> | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef(0);
  const recordingUploadStartedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recordingDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const recordingSourcesRef = useRef<MediaStreamAudioSourceNode[]>([]);
  const recordingTrackClonesRef = useRef<MediaStreamTrack[]>([]);
  const recordingTrackIdsRef = useRef<Set<string>>(new Set());
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

  const cleanupBrowserRecordingGraph = useCallback(() => {
    recordingSourcesRef.current.forEach((source) => source.disconnect());
    recordingSourcesRef.current = [];
    recordingTrackClonesRef.current.forEach((track) => track.stop());
    recordingTrackClonesRef.current = [];
    recordingTrackIdsRef.current.clear();
    recordingDestinationRef.current?.stream.getTracks().forEach((track) => track.stop());
    recordingDestinationRef.current = null;
    const audioContext = audioContextRef.current;
    audioContextRef.current = null;
    if (audioContext && audioContext.state !== "closed") {
      void audioContext.close().catch(() => undefined);
    }
  }, []);

  const addTrackToBrowserRecording = useCallback((mediaStreamTrack?: MediaStreamTrack | null) => {
    const audioContext = audioContextRef.current;
    const destination = recordingDestinationRef.current;
    if (!audioContext || !destination || !mediaStreamTrack || mediaStreamTrack.readyState === "ended") return;

    try {
      const trackId = recordingTrackId(mediaStreamTrack);
      if (recordingTrackIdsRef.current.has(trackId)) return;
      recordingTrackIdsRef.current.add(trackId);
      const trackClone = mediaStreamTrack.clone();
      recordingTrackClonesRef.current.push(trackClone);
      const source = audioContext.createMediaStreamSource(new MediaStream([trackClone]));
      source.connect(destination);
      recordingSourcesRef.current.push(source);
      if (audioContext.state === "suspended") void audioContext.resume().catch(() => undefined);
    } catch {
      // Some browsers can reject tracks during fast disconnects.
    }
  }, []);

  const startBrowserRecording = useCallback(async (room: Room, callId: string) => {
    if (!recordingEnabled) {
      cleanupBrowserRecordingGraph();
      mediaRecorderRef.current = null;
      recordingChunksRef.current = [];
      recordingStartedAtRef.current = 0;
      recordingUploadStartedRef.current = false;
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setStatus("Connected. Browser recording is not supported in this browser.");
      return;
    }

    const AudioContextClass = window.AudioContext || (window as WindowWithWebkitAudioContext).webkitAudioContext;
    if (!AudioContextClass) {
      setStatus("Connected. Browser audio recording is not supported in this browser.");
      return;
    }

    cleanupBrowserRecordingGraph();
    webCallIdRef.current = callId;
    recordingChunksRef.current = [];
    recordingStartedAtRef.current = Date.now();
    recordingUploadStartedRef.current = false;

    try {
      const audioContext = new AudioContextClass();
      const destination = audioContext.createMediaStreamDestination();
      audioContextRef.current = audioContext;
      recordingDestinationRef.current = destination;

      room.localParticipant.audioTrackPublications.forEach((publication) => {
        addTrackToBrowserRecording(publication.track?.mediaStreamTrack);
      });
      room.remoteParticipants.forEach((participant) => {
        participant.audioTrackPublications.forEach((publication) => {
          addTrackToBrowserRecording(publication.track?.mediaStreamTrack);
        });
      });

      const mimeType = preferredRecordingMimeType();
      const recorder = new MediaRecorder(destination.stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordingChunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        setStatus("Recording stopped unexpectedly. The call can continue.");
      };
      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      await audioContext.resume().catch(() => undefined);
    } catch {
      mediaRecorderRef.current = null;
      cleanupBrowserRecordingGraph();
      setStatus("Connected. Browser recording could not start.");
    }
  }, [addTrackToBrowserRecording, cleanupBrowserRecordingGraph, recordingEnabled]);

  const finishBrowserRecording = useCallback(() => {
    if (recordingFinishPromiseRef.current) return recordingFinishPromiseRef.current;

    const finishPromise = (async () => {
      const recorder = mediaRecorderRef.current;
      const callId = webCallIdRef.current;

      if (!recorder) {
        webCallIdRef.current = "";
        recordingChunksRef.current = [];
        recordingStartedAtRef.current = 0;
        cleanupBrowserRecordingGraph();
        return;
      }
      if (recordingUploadStartedRef.current) return;

      recordingUploadStartedRef.current = true;
      const startedAt = recordingStartedAtRef.current || Date.now();
      const mimeType = recorder.mimeType || preferredRecordingMimeType() || "audio/webm";

      try {
        if (recorder.state !== "inactive") {
          await new Promise<void>((resolve) => {
            recorder.onstop = () => resolve();
            recorder.onerror = () => resolve();
            try {
              if (recorder.state === "recording") recorder.requestData();
              recorder.stop();
            } catch {
              resolve();
            }
          });
        }

        const chunks = recordingChunksRef.current;
        const blob = chunks.length ? new Blob(chunks, { type: mimeType }) : null;
        if (callId && blob?.size) {
          await voiceApi.uploadWebCallRecording(callId, blob, Date.now() - startedAt);
          setStatus("Call ended. Recording saved.");
        } else {
          setStatus("Call ended");
        }
      } catch {
        setStatus("Call ended. Recording upload failed. Please try again.");
      } finally {
        mediaRecorderRef.current = null;
        webCallIdRef.current = "";
        recordingChunksRef.current = [];
        recordingStartedAtRef.current = 0;
        cleanupBrowserRecordingGraph();
      }
    })();

    recordingFinishPromiseRef.current = finishPromise;
    void finishPromise.finally(() => {
      if (recordingFinishPromiseRef.current === finishPromise) {
        recordingFinishPromiseRef.current = null;
      }
    });
    return finishPromise;
  }, [cleanupBrowserRecordingGraph]);

  const disconnect = useCallback(() => {
    stopDispatchPolling();
    const wasRecording = Boolean(mediaRecorderRef.current);
    roomRef.current?.disconnect();
    roomRef.current = null;
    audioElementsRef.current.forEach((element) => element.remove());
    audioElementsRef.current = [];
    setActive(false);
    setRemoteCount(0);
    setAudioCount(0);
    setStatus(wasRecording ? "Call ended. Saving recording..." : "Call ended");
    void finishBrowserRecording();
  }, [finishBrowserRecording, stopDispatchPolling]);

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
          setStatus("The AI agent could not join this call.");
          stopDispatchPolling();
          return;
        }
        if (health.state === "running") {
          setStatus((current) =>
            current.includes("Receiving audio") ? current : `AI agent connected. ${knowledgeStatus(knowledgeCount)}. Waiting for audio...`,
          );
        } else if (health.state === "pending" || health.state === "waiting") {
          setStatus(checks <= 2 ? "Connecting the AI agent for this call..." : "The AI agent is still connecting.");
        } else if (health.state === "missing" && checks > 2) {
          setStatus("The AI agent has not joined yet. Voice and knowledge will be available when it connects.");
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
    setStatus("Starting browser voice call...");
    const room = new Room({ adaptiveStream: true, dynacast: true });
    let subscribedAudioTracks = 0;
    const refreshParticipants = () => setRemoteCount(room.remoteParticipants.size);
    roomRef.current = room;

    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind !== Track.Kind.Audio) return;
      addTrackToBrowserRecording(track.mediaStreamTrack);
      const element = track.attach();
      element.autoplay = true;
      document.body.appendChild(element);
      audioElementsRef.current.push(element);
      void element.play().catch(() => {
        setStatus("Browser audio playback was blocked. End the call and start it again, then allow sound.");
      });
      subscribedAudioTracks += 1;
      setAudioCount(subscribedAudioTracks);
      stopDispatchPolling();
      setStatus(`Receiving audio from ${agentName}`);
    });
    room.on(RoomEvent.TrackUnsubscribed, (track) => {
      if (track.kind !== Track.Kind.Audio) return;
      track.detach().forEach((element) => {
        element.remove();
        audioElementsRef.current = audioElementsRef.current.filter((item) => item !== element);
      });
      subscribedAudioTracks = Math.max(0, subscribedAudioTracks - 1);
      setAudioCount(subscribedAudioTracks);
    });
    room.on(RoomEvent.ParticipantConnected, (participant) => {
      refreshParticipants();
      setStatus(`${participant.name || "AI agent"} joined. ${knowledgeStatus(knowledgeCount)}.`);
    });
    room.on(RoomEvent.ParticipantDisconnected, () => {
      refreshParticipants();
      setStatus("AI agent left the call");
    });
    room.on(RoomEvent.Disconnected, () => {
      setActive(false);
      setRemoteCount(0);
      setAudioCount(0);
      setStatus(mediaRecorderRef.current ? "Call ended. Saving recording..." : "Call ended");
      void finishBrowserRecording();
    });

    try {
      // Browser audio permission must be unlocked during the button click, before network awaits.
      await room.startAudio();
      const credentials = await voiceApi.webCallToken(agentId);
      webCallIdRef.current = credentials.callId;
      setStatus("Connecting the AI agent for this call...");
      startDispatchPolling(credentials.roomName, credentials.dispatchId);
      await room.connect(credentials.serverUrl, credentials.participantToken);
      if (room.serverInfo?.region) onRegionChange(room.serverInfo.region);
      await room.localParticipant.setMicrophoneEnabled(true, {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });
      await startBrowserRecording(room, credentials.callId);
      setActive(true);
      refreshParticipants();
      setStatus(room.remoteParticipants.size ? `Connected to ${agentName}` : `Connected. Waiting for ${agentName} to join...`);
      window.setTimeout(() => {
        if (roomRef.current === room && room.remoteParticipants.size === 0) {
          setStatus("The AI agent is still connecting. Voice and knowledge will be available when it joins.");
        }
      }, 8000);
    } catch {
      disconnect();
      setStatus("Could not start the web call.");
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
      setStatus("Phone call is connecting to the agent.");
      startDispatchPolling(call.roomName, call.dispatchId);
    } catch {
      setStatus("Could not start the phone call.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid overflow-hidden overscroll-none bg-black/80 p-3 backdrop-blur-md sm:place-items-center sm:p-4">
      <section
        className="test-call-theme my-auto min-h-0 max-h-[calc(100dvh-1.5rem)] w-full min-w-0 max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#07110f] text-white shadow-[0_30px_100px_rgba(0,0,0,0.58)] [scrollbar-gutter:stable] sm:max-h-[calc(100dvh-2rem)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="test-call-title"
        aria-describedby="test-call-status"
        aria-busy={busy}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-[radial-gradient(circle_at_12%_0%,rgba(69,221,206,0.13),transparent_42%),#07110f]/95 p-4 backdrop-blur-xl">
          <div className="min-w-0">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#82fff2]/55">Realtime voice session</span>
            <h2 className="mt-1 truncate text-base font-bold text-white" id="test-call-title" title={`Test ${agentName}`}>Test {agentName}</h2>
          </div>
          <button autoFocus aria-label={active ? "Close and end test call" : "Close test call"} className="app-button-text min-h-10 shrink-0 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-white/65 transition hover:bg-white/[0.10] hover:text-white active:translate-y-px" type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="grid min-w-0 gap-4 p-4 sm:gap-5 sm:p-5">
          <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#061b18] p-1" role="group" aria-label="Test call type">
            {(["web", "phone"] as const).map((item) => (
              <button
                className={`app-button-text flex-1 rounded-lg px-3 py-2 transition active:translate-y-px disabled:opacity-50 ${mode === item ? "bg-[#45ddce] text-[#04231f] shadow-[0_6px_18px_rgba(69,221,206,0.16)]" : "text-white/56 hover:bg-white/[0.05] hover:text-white/78"}`}
                key={item}
                type="button"
                aria-pressed={mode === item}
                onClick={() => setMode(item)}
                disabled={active}
              >
                {item === "web" ? "Browser microphone" : "Phone call"}
              </button>
            ))}
          </div>

          <div className="relative grid min-h-52 min-w-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_70%_0%,rgba(69,221,206,0.20),transparent_46%),linear-gradient(145deg,#000_0%,#061b18_62%,#07110f_100%)] p-4 text-white shadow-inner sm:p-5">
            <span className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-[#45ddce]/10 blur-2xl" />
            <span className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-[#45ddce]/[0.07] blur-2xl" />
            <div className="relative grid min-w-0 max-w-full place-items-center gap-4 text-center">
              <div className={`relative grid size-20 place-items-center rounded-full border border-[#45ddce]/25 bg-[#45ddce]/10 text-[#82fff2] ${active ? "ring-8 ring-[#45ddce]/[0.07]" : ""}`}>
                {active ? <span className="absolute inset-0 animate-ping rounded-full bg-[#45ddce]/15 motion-reduce:animate-none" /> : null}
                <span className="text-xl font-black">AI</span>
              </div>
              <div className="flex h-8 items-center gap-1" role="img" aria-label={active ? "Call audio active" : "Call audio inactive"}>
                {[16, 28, 20, 32, 24, 30, 18].map((height, index) => (
                  <span
                    className={`w-1.5 rounded-full bg-[#82fff2] ${active ? "animate-pulse motion-reduce:animate-none" : "opacity-30"}`}
                    key={`${height}-${index}`}
                    style={{ height, animationDelay: `${index * 90}ms` }}
                  />
                ))}
              </div>
              <p className="m-0 max-w-full break-words text-sm font-semibold leading-5 text-white/85" id="test-call-status" role="status" aria-live="polite" aria-atomic="true">{status}</p>
              <div className="flex flex-wrap justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-white/45" role="group" aria-label="Call diagnostics">
                <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-2.5 py-1">{remoteCount} participant{remoteCount === 1 ? "" : "s"}</span>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-2.5 py-1">{audioCount} audio track{audioCount === 1 ? "" : "s"}</span>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-2.5 py-1">{knowledgeStatus(knowledgeCount)}</span>
              </div>
            </div>
          </div>

          {mode === "phone" && !active ? (
            <label className="grid gap-2 text-xs font-bold text-white/56">
              <span>Destination number</span>
              <input
                className="app-control-text min-h-11 rounded-xl border border-white/10 bg-[#061b18] px-3 text-white outline-none transition placeholder:text-white/32 focus:border-[#45ddce] focus:ring-3 focus:ring-[#45ddce]/15"
                placeholder="+12525550123"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
              />
            </label>
          ) : null}

          <button
            className={`app-button-text min-h-12 rounded-xl px-4 font-extrabold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${active ? "border border-rose-400/25 bg-rose-400/15 text-rose-200 hover:bg-rose-400/20" : "bg-[#45ddce] text-[#04231f] shadow-[0_12px_30px_rgba(69,221,206,0.18)] hover:bg-[#75fff0]"}`}
            type="button"
            disabled={busy}
            aria-busy={busy}
            aria-describedby="test-call-status"
            onClick={active ? disconnect : mode === "web" ? startWebCall : startPhoneCall}
          >
            {busy ? "Connecting..." : active ? "End call" : mode === "web" ? "Start web call" : "Call phone"}
          </button>
        </div>
      </section>
    </div>
  );
}
