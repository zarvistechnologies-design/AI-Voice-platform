"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { publicVoiceMessage, voiceApi, type VoiceProfile } from "@/lib/voice";

type Props = {
  configured: boolean;
  language: string;
  onCloned: (profile: VoiceProfile) => void;
};

export function ElevenLabsVoiceClonePanel({ configured, language, onCloned }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [accent, setAccent] = useState("");
  const [gender, setGender] = useState("");
  const [inputMode, setInputMode] = useState<"upload" | "record">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [removeBackgroundNoise, setRemoveBackgroundNoise] = useState(false);
  const [confirmRights, setConfirmRights] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Microphone recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    };
  }, [audioPreviewUrl]);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(newFiles.slice(0, 5));
    if (newFiles[0]) {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
      const url = URL.createObjectURL(newFiles[0]);
      setAudioPreviewUrl(url);
      if (!name) {
        setName(newFiles[0].name.replace(/\.[^/.]+$/, "").slice(0, 40));
      }
    }
  };

  const startRecording = async () => {
    try {
      setMessage("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setRecordedBlob(blob);
        if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
        const url = URL.createObjectURL(blob);
        setAudioPreviewUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      setMessage("Microphone permission was denied. Please allow microphone access or upload an audio file.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || submitting) return;

    if (inputMode === "upload" && files.length === 0) {
      setMessage("Please add at least one clean voice audio file.");
      return;
    }
    if (inputMode === "record" && !recordedBlob) {
      setMessage("Please record an audio sample from your microphone first.");
      return;
    }

    const body = new FormData();
    body.set("name", name.trim());
    if (description.trim()) body.set("description", description.trim());
    if (accent.trim()) body.set("accent", accent.trim());
    if (gender) body.set("gender", gender);
    body.set("labels", JSON.stringify({ language, ...(accent ? { accent: accent.trim() } : {}), ...(gender ? { gender } : {}) }));
    body.set("removeBackgroundNoise", String(removeBackgroundNoise));
    body.set("confirmRights", String(confirmRights));

    if (inputMode === "upload") {
      for (const file of files) body.append("files", file, file.name);
    } else if (recordedBlob) {
      body.append("files", recordedBlob, "microphone_recording.webm");
    }

    setSubmitting(true);
    setMessage("");
    try {
      const result = await voiceApi.cloneVoice(body);
      onCloned(result.profile);
      setName("");
      setDescription("");
      setAccent("");
      setGender("");
      setFiles([]);
      setRecordedBlob(null);
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
        setAudioPreviewUrl(null);
      }
      setRemoveBackgroundNoise(false);
      setConfirmRights(false);
      setExpanded(false);
      setMessage(
        result.requiresVerification
          ? "Voice created successfully! Complete any requested verification in ElevenLabs before using it."
          : "Voice cloned and ready! It is now selected for this agent.",
      );
    } catch (error) {
      setMessage(publicVoiceMessage(error, "Could not clone this voice."));
    } finally {
      setSubmitting(false);
    }
  }

  const hasAudioSource = inputMode === "upload" ? files.length > 0 : Boolean(recordedBlob);

  return (
    <section className="rounded-xl border border-[#cfe3de] bg-gradient-to-b from-[#f4fbf9] to-[#edf7f4] p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#118778] text-white shadow-sm">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="app-section-title m-0">Instant Voice Cloning</h4>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                ElevenLabs Studio
              </span>
            </div>
            <p className="app-caption mt-1 mb-0">
              Clone your voice or an executive voice in seconds using an audio file or direct microphone recording.
            </p>
          </div>
        </div>
        <button
          className="app-button-text min-h-10 shrink-0 rounded-lg bg-[#118778] px-4 font-semibold text-white shadow transition hover:bg-[#0e6f62] disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={!configured}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Close Studio" : "✨ Clone a Voice"}
        </button>
      </div>

      {!configured ? (
        <p className="mt-3 mb-0 text-sm font-medium text-amber-800">
          Connect an ElevenLabs API key on the backend to enable voice cloning.
        </p>
      ) : null}

      {expanded ? (
        <form className="mt-4 grid gap-4 border-t border-[#cfe3de] pt-4" onSubmit={submit}>
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept="audio/mpeg,audio/wav,audio/mp4,audio/aac,audio/ogg,audio/webm,.mp3,.wav,.m4a,.aac,.ogg,.webm"
            multiple
            onChange={(event) => {
              handleFilesSelected(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />

          {/* Input mode selector */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setInputMode("upload");
                fileInputRef.current?.click();
              }}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                inputMode === "upload"
                  ? "bg-[#118778] text-white shadow-sm"
                  : "bg-white text-slate-700 border border-[#dbe4e1] hover:bg-slate-50"
              }`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Audio File
            </button>
            <button
              type="button"
              onClick={() => setInputMode("record")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                inputMode === "record"
                  ? "bg-[#118778] text-white shadow-sm"
                  : "bg-white text-slate-700 border border-[#dbe4e1] hover:bg-slate-50"
              }`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
              Record Microphone
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="app-label grid gap-2">
              <span>Voice name *</span>
              <input
                className="app-control-text min-h-10 rounded-lg border border-[#dbe4e1] bg-white px-3 text-black outline-none focus:border-[#118778]"
                required
                minLength={2}
                maxLength={100}
                value={name}
                placeholder="e.g. Rachel Founder Voice, Sarah Concierge"
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="app-label grid gap-2">
              <span>Accent (optional)</span>
              <input
                className="app-control-text min-h-10 rounded-lg border border-[#dbe4e1] bg-white px-3 text-black outline-none focus:border-[#118778]"
                value={accent}
                placeholder="e.g. Indian English, American, British"
                onChange={(event) => setAccent(event.target.value)}
              />
            </label>
            <label className="app-label grid gap-2 sm:col-span-2">
              <span>Description (optional)</span>
              <input
                className="app-control-text min-h-10 rounded-lg border border-[#dbe4e1] bg-white px-3 text-black outline-none focus:border-[#118778]"
                maxLength={500}
                value={description}
                placeholder="e.g. Warm, conversational tone for enterprise client support"
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
            <label className="app-label grid gap-2">
              <span>Voice gender (optional)</span>
              <select
                className="app-control-text min-h-10 rounded-lg border border-[#dbe4e1] bg-white px-3 text-black outline-none focus:border-[#118778]"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="">Not specified</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>

            {/* Audio Source Input Block */}
            {inputMode === "upload" ? (
              <div className="grid gap-2 sm:col-span-2">
                <span className="app-label">Audio samples *</span>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.length) {
                      handleFilesSelected(Array.from(e.dataTransfer.files));
                    }
                  }}
                  className="group flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#b8cbc5] bg-white p-5 text-center cursor-pointer transition hover:border-[#118778] hover:bg-[#f6faf8]"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-[#edf7f4] text-[#0e6f62] group-hover:bg-[#118778] group-hover:text-white transition">
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </span>
                    <span className="text-sm font-semibold text-[#0e6f62]">
                      {files.length ? "Choose Different Audio Samples" : "Click to Browse or Drop Audio Files"}
                    </span>
                  </div>
                  <span className="app-caption text-xs">
                    {files.length
                      ? `${files.length} sample(s) selected: ${files.map(f => f.name).join(", ")}`
                      : "MP3, WAV, M4A, AAC, OGG, or WEBM (up to 15 MB) · 1 to 5 samples"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <span className="app-label">Record Sample *</span>
                <div className="flex items-center gap-3 rounded-lg border border-[#dbe4e1] bg-white p-2.5">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white transition ${
                      isRecording
                        ? "bg-rose-600 hover:bg-rose-700 animate-pulse"
                        : "bg-[#118778] hover:bg-[#0e6f62]"
                    }`}
                  >
                    <span className={`size-2.5 rounded-full ${isRecording ? "bg-white" : "bg-rose-400"}`} />
                    {isRecording ? `Stop (${formatTime(recordingSeconds)})` : "Start Recording"}
                  </button>
                  <span className="text-xs text-slate-500">
                    {isRecording
                      ? "Recording audio sample from microphone..."
                      : recordedBlob
                      ? "Sample recorded successfully!"
                      : "Record 15-60 seconds of clear speech"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Audio Player Preview */}
          {audioPreviewUrl ? (
            <div className="flex items-center gap-3 rounded-lg border border-[#cfe3de] bg-white p-3">
              <span className="text-xs font-semibold text-[#0e6f62] shrink-0">Sample Preview:</span>
              <audio src={audioPreviewUrl} controls className="h-8 w-full accent-[#118778]" />
            </div>
          ) : null}

          <label className="flex items-start gap-3 text-sm font-medium text-[#475569]">
            <input
              className="mt-0.5 size-4 accent-[#118778]"
              type="checkbox"
              checked={removeBackgroundNoise}
              onChange={(event) => setRemoveBackgroundNoise(event.target.checked)}
            />
            Remove background noise (leave off for clean studio audio).
          </label>
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

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              className="app-button-text min-h-10 rounded-lg bg-[#118778] px-5 font-semibold text-white transition hover:bg-[#0e6f62] disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
              type="submit"
              disabled={submitting || !name.trim() || !hasAudioSource || !confirmRights}
            >
              {submitting ? "Cloning voice with ElevenLabs..." : "Create Cloned Voice"}
            </button>
            <span className="app-caption">
              Compatible across all models: Eleven Flash v2.5, Turbo v2.5, Multilingual v2, and Eleven v3.
            </span>
          </div>
        </form>
      ) : null}

      {message ? (
        <p className="mt-3 mb-0 rounded-lg border border-[#cfe3de] bg-white px-3 py-2 text-sm font-medium text-[#0e6f62]" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
