"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Room, RoomEvent, Track, setLogLevel } from "livekit-client";
import { API_URL } from "@/lib/apiBase";

setLogLevel("silent");

type WidgetAgent = {
  id: string;
  name: string;
  theme: "light" | "dark" | "auto";
  position: "bottom-right" | "bottom-left" | "inline";
  buttonText: string;
  accentColor: string;
};

type TokenResponse = {
  callId: string;
  roomName: string;
  dispatchId: string;
  serverUrl: string;
  participantToken: string;
};

function safeJson(value: string) {
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function readableError(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function EmbeddedVoiceWidget() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get("id") ?? "";
  const publicKey = searchParams.get("k") ?? "";
  const parentOrigin = searchParams.get("parent_origin") ?? "";
  const queryTheme = searchParams.get("theme") as WidgetAgent["theme"] | null;
  const queryPosition = searchParams.get("position") as WidgetAgent["position"] | null;
  const queryAccent = searchParams.get("accent") ?? "";
  const metadata = useMemo(() => safeJson(searchParams.get("metadata") ?? "{}"), [searchParams]);
  const inline = queryPosition === "inline";

  const roomRef = useRef<Room | null>(null);
  const audioElementsRef = useRef<HTMLMediaElement[]>([]);
  const waitingTimerRef = useRef<number | null>(null);
  const [agent, setAgent] = useState<WidgetAgent | null>(null);
  const [expanded, setExpanded] = useState(inline);
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Loading");
  const [muted, setMuted] = useState(false);
  const displayStatus = !agentId || !publicKey ? "Widget key missing" : status;

  const theme = agent?.theme ?? queryTheme ?? "auto";
  const isDark = theme === "dark" || (theme === "auto" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const accentColor = agent?.accentColor || queryAccent || "#1438f5";
  const buttonText = agent?.buttonText || "Talk to us";

  const postSize = useCallback((open: boolean) => {
    window.parent?.postMessage({
      type: "voice-agent-widget-resize",
      expanded: open,
      inline,
      width: inline ? "100%" : open ? 380 : 76,
      height: inline ? 540 : open ? 540 : 76,
    }, "*");
  }, [inline]);

  const disconnect = useCallback(() => {
    if (waitingTimerRef.current) {
      window.clearTimeout(waitingTimerRef.current);
      waitingTimerRef.current = null;
    }
    audioElementsRef.current.forEach((element) => element.remove());
    audioElementsRef.current = [];
    roomRef.current?.disconnect();
    roomRef.current = null;
    setActive(false);
    setMuted(false);
    setStatus("Call ended");
  }, []);

  useEffect(() => {
    postSize(expanded);
  }, [expanded, postSize]);

  useEffect(() => {
    let cancelled = false;
    if (!agentId || !publicKey) {
      return;
    }

    const query = new URLSearchParams({
      k: publicKey,
      parentOrigin,
      origin: parentOrigin,
    });
    fetch(`${API_URL}/api/widget/agents/${encodeURIComponent(agentId)}?${query.toString()}`)
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as { agent?: WidgetAgent; message?: string } | null;
        if (!response.ok) throw new Error(data?.message ?? "Widget is unavailable");
        if (!data?.agent) throw new Error("Widget is unavailable");
        if (!cancelled) {
          setAgent(data.agent);
          setStatus("Ready");
        }
      })
      .catch((error) => {
        if (!cancelled) setStatus(readableError(error, "Widget is unavailable"));
      });

    return () => {
      cancelled = true;
      disconnect();
    };
  }, [agentId, disconnect, parentOrigin, publicKey]);

  async function startCall() {
    if (!agentId || !publicKey || busy) return;
    setBusy(true);
    setStatus("Connecting");
    setExpanded(true);
    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;
    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind !== Track.Kind.Audio) return;
      if (waitingTimerRef.current) {
        window.clearTimeout(waitingTimerRef.current);
        waitingTimerRef.current = null;
      }
      const element = track.attach();
      element.autoplay = true;
      element.style.display = "none";
      document.body.appendChild(element);
      audioElementsRef.current.push(element);
      void element.play().catch(() => {
        setStatus("Browser audio playback was blocked. End the call and start it again, then allow sound.");
      });
      setStatus(`Connected to ${agent?.name ?? "assistant"}`);
    });
    room.on(RoomEvent.ParticipantConnected, (participant) => {
      setStatus(`${participant.name || "Assistant"} joined. Speak now.`);
    });
    room.on(RoomEvent.Disconnected, () => {
      setActive(false);
      setStatus("Call ended");
    });

    try {
      // Unlock audio during the user gesture so agent audio can play after the room connects.
      await room.startAudio();
      const response = await fetch(`${API_URL}/api/widget/call-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          publicKey,
          parentOrigin,
          origin: parentOrigin,
          metadata,
        }),
      });
      const token = (await response.json().catch(() => null)) as TokenResponse & { message?: string } | null;
      if (!response.ok || !token?.participantToken) {
        throw new Error(token?.message ?? "Could not start the voice session");
      }

      await room.connect(token.serverUrl, token.participantToken);
      try {
        await room.localParticipant.setMicrophoneEnabled(true, {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        });
      } catch {
        throw new Error("Microphone permission is required. Allow microphone access and try again.");
      }
      setActive(true);
      setMuted(false);
      setStatus(room.remoteParticipants.size ? "Connected. Speak now." : "Connected. Waiting for assistant.");
      waitingTimerRef.current = window.setTimeout(() => {
        if (roomRef.current === room && room.remoteParticipants.size === 0) {
          setStatus("The assistant is still connecting. Voice and knowledge will be available when ready.");
        } else if (roomRef.current === room && audioElementsRef.current.length === 0) {
          setStatus("Assistant is ready. Speak now.");
        }
      }, 8000);
    } catch (error) {
      disconnect();
      setExpanded(true);
      setStatus(readableError(error, "Could not start the voice session"));
    } finally {
      setBusy(false);
    }
  }

  async function toggleMute() {
    const room = roomRef.current;
    if (!room) return;
    const nextMuted = !muted;
    await room.localParticipant.setMicrophoneEnabled(!nextMuted);
    setMuted(nextMuted);
  }

  const surfaceClass = isDark
    ? "border-white/10 bg-[#111827] text-white shadow-[0_18px_60px_rgba(0,0,0,0.36)]"
    : "border-[#dbe4f0] bg-white text-[#111827] shadow-[0_18px_60px_rgba(15,23,42,0.18)]";
  const mutedClass = isDark
    ? "border-white/15 bg-white/10 text-white"
    : "border-[#d5d8df] bg-white text-[#334155]";

  if (!expanded && !inline) {
    return (
      <button
        aria-label={buttonText}
        className="grid size-[64px] place-items-center rounded-full text-white shadow-[0_14px_42px_rgba(15,23,42,0.25)] transition hover:scale-[1.03]"
        style={{ background: accentColor }}
        type="button"
        onClick={() => setExpanded(true)}
      >
        <svg className="size-7 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.6 4.8 9 7.2a2 2 0 0 1 .4 2.2l-.8 1.7a12 12 0 0 0 5.3 5.3l1.7-.8a2 2 0 0 1 2.2.4l2.4 2.4a1.8 1.8 0 0 1-.2 2.7c-1 .7-2.2 1-3.6.8C9.4 20.7 3.3 14.6 2.1 7.6 1.9 6.2 2.2 5 2.9 4a1.8 1.8 0 0 1 2.7-.2Z" />
        </svg>
      </button>
    );
  }

  return (
    <main className={`${inline ? "min-h-[520px]" : "h-[520px]"} rounded-2xl border ${surfaceClass}`}>
      <header className="flex items-center justify-between gap-3 border-b border-current/10 p-4">
        <span className="min-w-0">
          <strong className="block truncate text-sm font-semibold">{agent?.name ?? "Voice assistant"}</strong>
          <span className="block truncate text-xs opacity-70">{displayStatus}</span>
        </span>
        {!inline ? (
          <button
            aria-label="Close widget"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-current/70 transition hover:bg-current/10 hover:text-current"
            type="button"
            onClick={() => setExpanded(false)}
          >
            x
          </button>
        ) : null}
      </header>

      <section className="grid h-[calc(100%-65px)] content-between gap-5 p-4">
        <div className="grid place-items-center gap-4 pt-6 text-center">
          <span className="grid size-20 place-items-center rounded-full text-white" style={{ background: accentColor }}>
            <svg className="size-9 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v10" />
              <path d="M8 8a4 4 0 0 1 8 0v5a4 4 0 0 1-8 0V8Z" />
              <path d="M5 11v2a7 7 0 0 0 14 0v-2M12 20v1" />
            </svg>
          </span>
          <div>
            <strong className="block text-lg font-semibold">{active ? "You are connected" : buttonText}</strong>
            <span className="mt-1 block text-sm opacity-70">{active ? "Speak naturally through your microphone." : "Start a live voice conversation."}</span>
          </div>
        </div>

        <div className="grid gap-2">
          {active ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`min-h-11 rounded-xl border px-4 text-sm font-semibold transition ${mutedClass}`}
                type="button"
                onClick={() => void toggleMute()}
              >
                {muted ? "Unmute" : "Mute"}
              </button>
              <button
                className="min-h-11 rounded-xl bg-[#dc2626] px-4 text-sm font-semibold text-white transition hover:bg-[#b91c1c]"
                type="button"
                onClick={disconnect}
              >
                End
              </button>
            </div>
          ) : (
            <button
              className="min-h-11 rounded-xl px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: accentColor }}
              disabled={busy || !agent}
              type="button"
              onClick={() => void startCall()}
            >
              {busy ? "Connecting..." : buttonText}
            </button>
          )}
          <span className="min-h-5 text-center text-xs opacity-60">{active ? "Microphone is live while connected." : displayStatus}</span>
        </div>
      </section>
    </main>
  );
}
