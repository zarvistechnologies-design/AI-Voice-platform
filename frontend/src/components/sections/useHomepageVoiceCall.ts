"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Room as LiveKitRoom } from "livekit-client";

import { websiteVoiceAgent } from "@/config/websiteVoiceAgent";
import { API_URL } from "@/lib/apiBase";

type TokenResponse = {
  serverUrl?: string;
  participantToken?: string;
  message?: string;
};

function errorMessage(error: unknown) {
  return error instanceof Error && error.message ? error.message : "The voice call could not start. Please try again.";
}

export function useHomepageVoiceCall() {
  const roomRef = useRef<LiveKitRoom | null>(null);
  const audioRef = useRef<HTMLMediaElement[]>([]);
  const busyRef = useRef(false);
  const mountedRef = useRef(true);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Checking voice availability…");
  const [error, setError] = useState("");

  const disconnect = useCallback(() => {
    const room = roomRef.current;
    roomRef.current = null;
    room?.disconnect();
    for (const element of audioRef.current) element.remove();
    audioRef.current = [];
    busyRef.current = false;
    if (mountedRef.current) {
      setBusy(false);
      setActive(false);
      setStatus("Call ended. Select play to start again.");
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const abort = new AbortController();
    const query = new URLSearchParams({ k: websiteVoiceAgent.publicKey, parent_origin: window.location.origin });
    fetch(`${API_URL}/api/widget/agents/${websiteVoiceAgent.id}?${query}`, { signal: abort.signal })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as { agent?: { id: string }; message?: string } | null;
        if (!response.ok || data?.agent?.id !== websiteVoiceAgent.id) {
          throw new Error(data?.message || "The live voice agent is unavailable.");
        }
        if (!mountedRef.current) return;
        setReady(true);
        setStatus("Voice agent ready. Select play to start a live call.");
      })
      .catch((caught) => {
        if (abort.signal.aborted || !mountedRef.current) return;
        setError(errorMessage(caught));
        setStatus("Voice agent unavailable.");
      });

    return () => {
      mountedRef.current = false;
      abort.abort();
      disconnect();
    };
  }, [disconnect]);

  const start = useCallback(async (preferredLanguage: string) => {
    if (!ready || busyRef.current || roomRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    setStatus("Connecting to your voice agent…");

    try {
      const { Room, RoomEvent, Track } = await import("livekit-client");
      if (!mountedRef.current) return;
      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;
      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind !== Track.Kind.Audio) return;
        const element = track.attach();
        element.autoplay = true;
        element.style.display = "none";
        document.body.appendChild(element);
        audioRef.current.push(element);
        void element.play().catch(() => setError("Browser audio was blocked. Allow sound and start again."));
        setStatus("Connected. Speak naturally in your chosen language.");
      });
      room.on(RoomEvent.Disconnected, () => {
        if (roomRef.current === room) disconnect();
      });

      await room.startAudio();
      const origin = window.location.origin;
      const response = await fetch(`${API_URL}/api/widget/call-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: websiteVoiceAgent.id,
          publicKey: websiteVoiceAgent.publicKey,
          parentOrigin: origin,
          metadata: { Source: "Vozon homepage", PreferredLanguage: preferredLanguage },
        }),
      });
      const credentials = (await response.json().catch(() => null)) as TokenResponse | null;
      if (!response.ok || !credentials?.serverUrl || !credentials.participantToken) {
        throw new Error(credentials?.message || "Could not start the voice session.");
      }
      if (!mountedRef.current || roomRef.current !== room) return;

      await room.connect(credentials.serverUrl, credentials.participantToken);
      try {
        await room.localParticipant.setMicrophoneEnabled(true, {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        });
      } catch {
        throw new Error("Allow microphone access to speak with the voice agent.");
      }
      if (!mountedRef.current || roomRef.current !== room) return;
      setActive(true);
      setStatus("Connected. Speak naturally; you can change language during the call.");
    } catch (caught) {
      if (mountedRef.current) {
        disconnect();
        setError(errorMessage(caught));
        setStatus("The voice call could not connect.");
      }
    } finally {
      busyRef.current = false;
      if (mountedRef.current) setBusy(false);
    }
  }, [disconnect, ready]);

  return { ready, active, busy, status, error, start, disconnect };
}
