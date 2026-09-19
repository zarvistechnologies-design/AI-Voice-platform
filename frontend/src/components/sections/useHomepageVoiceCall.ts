"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track } from "livekit-client";

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
  const roomRef = useRef<Room | null>(null);
  const audioRef = useRef<HTMLMediaElement[]>([]);
  const busyRef = useRef(false);
  const mountedRef = useRef(true);
  const callCounterRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Checking voice availability…");
  const [error, setError] = useState("");
  const [speakingLanguage, setSpeakingLanguage] = useState("");

  const disconnect = useCallback(() => {
    callCounterRef.current++;
    const room = roomRef.current;
    roomRef.current = null;
    room?.disconnect();
    for (const element of audioRef.current) element.remove();
    audioRef.current = [];
    busyRef.current = false;
    if (mountedRef.current) {
      setBusy(false);
      setActive(false);
      setSpeakingLanguage("");
      setStatus("Call ended. Click any language or press play to start again.");
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
        setStatus("Voice agent ready. Click any language to talk.");
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
    if (!ready) return;

    // Disconnect existing call first if active or connecting
    const currentRoom = roomRef.current;
    if (currentRoom) {
      roomRef.current = null;
      try {
        currentRoom.disconnect();
      } catch {
        // ignore disconnect error
      }
      for (const element of audioRef.current) element.remove();
      audioRef.current = [];
    }

    const sessionId = ++callCounterRef.current;
    busyRef.current = true;
    setBusy(true);
    setError("");
    setSpeakingLanguage(preferredLanguage);
    setStatus(`Connecting to agent in ${preferredLanguage}…`);

    try {
      if (!mountedRef.current || sessionId !== callCounterRef.current) return;
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      roomRef.current = room;

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind !== Track.Kind.Audio) return;
        const element = track.attach();
        element.autoplay = true;
        element.style.display = "none";
        document.body.appendChild(element);
        audioRef.current.push(element);
        void element.play().catch(() => setError("Browser audio was blocked. Allow sound and start again."));
        if (mountedRef.current && sessionId === callCounterRef.current) {
          setStatus(`Connected. Speaking ${preferredLanguage}.`);
        }
      });

      room.on(RoomEvent.Disconnected, () => {
        if (roomRef.current === room) disconnect();
      });

      // Request token and warm audio in parallel for zero latency
      const origin = window.location.origin;
      const [tokenResult] = await Promise.all([
        fetch(`${API_URL}/api/widget/call-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId: websiteVoiceAgent.id,
            publicKey: websiteVoiceAgent.publicKey,
            parentOrigin: origin,
            metadata: { Source: "Vozon homepage", PreferredLanguage: preferredLanguage },
          }),
        }).then(async (res) => (await res.json().catch(() => null)) as TokenResponse | null),
        room.startAudio(),
      ]);

      if (!mountedRef.current || sessionId !== callCounterRef.current) {
        room.disconnect();
        return;
      }

      if (!tokenResult?.serverUrl || !tokenResult?.participantToken) {
        throw new Error(tokenResult?.message || "Could not start the voice session.");
      }

      await room.connect(tokenResult.serverUrl, tokenResult.participantToken);
      if (!mountedRef.current || roomRef.current !== room || sessionId !== callCounterRef.current) {
        room.disconnect();
        return;
      }

      setActive(true);
      setSpeakingLanguage(preferredLanguage);
      setStatus(`Connected. Speaking ${preferredLanguage}.`);

      try {
        await room.localParticipant.setMicrophoneEnabled(true, {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        });
      } catch {
        throw new Error("Allow microphone access to speak with the voice agent.");
      }
    } catch (caught) {
      if (mountedRef.current && sessionId === callCounterRef.current) {
        disconnect();
        setError(errorMessage(caught));
        setStatus("The voice call could not connect.");
      }
    } finally {
      if (sessionId === callCounterRef.current) {
        busyRef.current = false;
        if (mountedRef.current) setBusy(false);
      }
    }
  }, [disconnect, ready]);

  return { ready, active, busy, status, error, speakingLanguage, start, disconnect };
}
