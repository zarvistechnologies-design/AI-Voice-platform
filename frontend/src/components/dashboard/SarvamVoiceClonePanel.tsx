"use client";

import { useState, type FormEvent } from "react";
import {
  publicVoiceMessage,
  voiceApi,
  type VoiceProfile,
} from "@/lib/voice";

type Props = {
  configured: boolean;
  language: string;
  onCloned: (profile: VoiceProfile) => void;
};

export function SarvamVoiceClonePanel({ configured, language, onCloned }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [confirmRights, setConfirmRights] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || submitting) return;

    setSubmitting(true);
    setMessage("");
    try {
      const result = await voiceApi.registerSarvamVoice({
        voiceId: voiceId.trim(),
        name: name.trim(),
        language,
        confirmRights,
      });
      onCloned(result.profile);
      setName("");
      setVoiceId("");
      setConfirmRights(false);
      setExpanded(false);
      setMessage("Sarvam cloned voice registered and selected. Save the agent to use it for calls.");
    } catch (error) {
      setMessage(publicVoiceMessage(error, "Could not register this Sarvam voice."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-[#cfe3de] bg-gradient-to-b from-[#f4fbf9] to-[#edf7f4] p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#118778] text-white shadow-sm">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="app-section-title m-0">Sarvam Voice Cloning</h4>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                Enterprise
              </span>
            </div>
            <p className="app-caption mb-0 mt-1">
              Create a multilingual clone in Sarvam Content Studio, then add its speaker ID to this workspace.
            </p>
          </div>
        </div>
        <button
          className="app-button-text min-h-10 shrink-0 rounded-lg bg-[#118778] px-4 font-semibold text-white shadow transition hover:bg-[#0e6f62] disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={!configured}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Close" : "Add Sarvam Clone"}
        </button>
      </div>

      {!configured ? (
        <p className="mb-0 mt-3 text-sm font-medium text-amber-800">
          Connect a Sarvam API key on the backend to use custom Sarvam voices.
        </p>
      ) : null}

      {expanded ? (
        <form className="mt-4 grid gap-4 border-t border-[#cfe3de] pt-4" onSubmit={submit}>
          <div className="rounded-lg border border-[#cfe3de] bg-white p-3 text-sm text-slate-600">
            Sarvam currently creates reusable voice clones in Content Studio. Record about 10 seconds of clear speech there, save the clone, and copy the exact speaker ID or cloned voice name.
            <a
              className="ml-1 font-semibold text-[#0e6f62] underline underline-offset-2"
              href="https://dashboard.sarvam.ai/"
              target="_blank"
              rel="noreferrer"
            >
              Open Sarvam Content Studio
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="app-label grid gap-2">
              <span>Display name *</span>
              <input
                className="app-control-text min-h-10 rounded-lg border border-[#dbe4e1] bg-white px-3 text-black outline-none focus:border-[#118778]"
                required
                minLength={2}
                maxLength={100}
                value={name}
                placeholder="e.g. Founder Hindi Voice"
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="app-label grid gap-2">
              <span>Sarvam speaker ID or exact clone name *</span>
              <input
                className="app-control-text min-h-10 rounded-lg border border-[#dbe4e1] bg-white px-3 text-black outline-none focus:border-[#118778]"
                required
                maxLength={128}
                value={voiceId}
                placeholder="Paste from your Sarvam voice library"
                onChange={(event) => setVoiceId(event.target.value)}
              />
            </label>
          </div>

          <label className="flex items-start gap-3 text-sm font-semibold text-[#334155]">
            <input
              className="mt-0.5 size-4 accent-[#118778]"
              type="checkbox"
              required
              checked={confirmRights}
              onChange={(event) => setConfirmRights(event.target.checked)}
            />
            I confirm I have the speaker&apos;s permission and the rights required to clone and use this voice.
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="app-button-text min-h-10 rounded-lg bg-[#118778] px-5 font-semibold text-white shadow-sm transition hover:bg-[#0e6f62] disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={submitting || !name.trim() || !voiceId.trim() || !confirmRights}
            >
              {submitting ? "Registering Sarvam voice..." : "Register and Select Voice"}
            </button>
            <span className="app-caption">Custom clones use Sarvam Bulbul v3.</span>
          </div>
        </form>
      ) : null}

      {message ? (
        <p className="mb-0 mt-3 rounded-lg border border-[#cfe3de] bg-white px-3 py-2 text-sm font-medium text-[#0e6f62]" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
