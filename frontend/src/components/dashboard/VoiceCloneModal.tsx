"use client";

import { useState, useRef, useEffect } from "react";
import { cloneVoice, type VoiceProfile } from "@/lib/voice";

interface VoiceCloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceCloned: (profile: VoiceProfile) => void;
}

export function VoiceCloneModal({
  isOpen,
  onClose,
  onVoiceCloned,
}: VoiceCloneModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState<"female" | "male" | "">("");
  const [accent, setAccent] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileAudioUrl, setFileAudioUrl] = useState<string | null>(null);

  // Microphone recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setName("");
      setDescription("");
      setGender("");
      setAccent("");
      setSelectedFile(null);
      setFileAudioUrl(null);
      setRecordedBlob(null);
      setRecordedAudioUrl(null);
      setIsRecording(false);
      setRecordingDuration(0);
      setError(null);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (fileAudioUrl) URL.revokeObjectURL(fileAudioUrl);
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    };
  }, [fileAudioUrl, recordedAudioUrl]);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    if (fileAudioUrl) URL.revokeObjectURL(fileAudioUrl);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setFileAudioUrl(url);
    setError(null);
    if (!name) {
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      setName(baseName.slice(0, 40));
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setRecordedBlob(audioBlob);
        if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      setError("Microphone permission denied or audio device not found.");
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

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Please provide a name for the cloned voice.");
      return;
    }

    let fileToUpload: File | Blob | null = null;
    let fileName = "voice_sample.mp3";

    if (activeTab === "upload") {
      if (!selectedFile) {
        setError("Please choose or upload an audio sample.");
        return;
      }
      fileToUpload = selectedFile;
      fileName = selectedFile.name;
    } else {
      if (!recordedBlob) {
        setError("Please record an audio sample before submitting.");
        return;
      }
      fileToUpload = recordedBlob;
      fileName = "microphone_recording.webm";
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (description.trim()) {
        formData.append("description", description.trim());
      }
      if (gender) {
        formData.append("gender", gender);
      }
      if (accent.trim()) {
        formData.append("accent", accent.trim());
      }
      formData.append("file", fileToUpload, fileName);

      const result = await cloneVoice(formData);
      if (result.success && result.profile) {
        onVoiceCloned(result.profile);
        onClose();
      } else {
        throw new Error("Voice cloning did not complete. Please try again.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to clone voice with ElevenLabs.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[#2a3834] bg-[#111917] shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#22312d] bg-[#141f1c] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/20">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Instant Voice Clone
              </h3>
              <p className="text-xs text-emerald-400/80">
                Powered by ElevenLabs AI Voice Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#1a2824] hover:text-white transition"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-sm text-rose-200">
              <svg className="size-5 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Voice Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Voice Name <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rachel Executive, David Founder, Dr. Sharma"
                required
                className="w-full rounded-xl border border-[#2a3834] bg-[#162320] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Warm conversational tone for customer sales"
                className="w-full rounded-xl border border-[#2a3834] bg-[#162320] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "female" | "male" | "")}
                  className="w-full rounded-xl border border-[#2a3834] bg-[#162320] px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Unspecified</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Accent
                </label>
                <input
                  type="text"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  placeholder="e.g. American, British, Indian"
                  className="w-full rounded-xl border border-[#2a3834] bg-[#162320] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Audio Source Tabs */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Voice Sample Audio <span className="text-emerald-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#162320] p-1 border border-[#22312d]">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition ${
                  activeTab === "upload"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Audio File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("record")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition ${
                  activeTab === "record"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                Record Microphone
              </button>
            </div>
          </div>

          {/* Tab 1: Upload */}
          {activeTab === "upload" && (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
                className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#2f423d] bg-[#131d1a] p-6 text-center hover:border-emerald-500 hover:bg-[#162320] transition cursor-pointer"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/mp3,audio/wav,audio/m4a,audio/mp4,audio/ogg,audio/webm,.mp3,.wav,.m4a,.ogg,.webm"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                <div className="flex size-12 items-center justify-center rounded-full bg-[#1b2b27] text-emerald-400 group-hover:scale-110 transition">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="mt-3 text-sm font-medium text-white">
                  {selectedFile ? selectedFile.name : "Click to select or drag audio file"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  WAV, MP3, M4A, or OGG · 1 to 3 minutes recommended (max 15MB)
                </p>
              </div>

              {fileAudioUrl && (
                <div className="rounded-xl border border-[#22312d] bg-[#162320] p-3 flex items-center gap-3">
                  <span className="text-xs font-medium text-emerald-400 shrink-0">
                    Sample Preview:
                  </span>
                  <audio src={fileAudioUrl} controls className="h-8 w-full accent-emerald-500" />
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Record */}
          {activeTab === "record" && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#2a3834] bg-[#131d1a] p-6 text-center space-y-4">
              <div className="relative">
                {isRecording && (
                  <div className="absolute -inset-2 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
                )}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`relative flex size-16 items-center justify-center rounded-full shadow-lg transition ${
                    isRecording
                      ? "bg-rose-600 text-white hover:bg-rose-700 ring-4 ring-rose-500/30"
                      : "bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105"
                  }`}
                >
                  {isRecording ? (
                    <div className="size-6 rounded-md bg-white" />
                  ) : (
                    <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                  )}
                </button>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {isRecording
                    ? `Recording... ${formatTimer(recordingDuration)}`
                    : recordedBlob
                    ? "Recording Ready!"
                    : "Tap microphone to record sample"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Speak clearly into your microphone for 15-60 seconds in a quiet room.
                </p>
              </div>

              {recordedAudioUrl && (
                <div className="w-full rounded-xl border border-[#22312d] bg-[#162320] p-3 flex items-center gap-3">
                  <span className="text-xs font-medium text-emerald-400 shrink-0">
                    Your Recording:
                  </span>
                  <audio src={recordedAudioUrl} controls className="h-8 w-full accent-emerald-500" />
                </div>
              )}
            </div>
          )}

          {/* ElevenLabs Info Note */}
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3.5 text-xs text-emerald-300/90 flex items-start gap-2.5">
            <svg className="size-4 shrink-0 mt-0.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Your cloned voice will be available immediately for agent calls across all models including <strong>Eleven Flash v2.5</strong>, <strong>Turbo v2.5</strong>, and <strong>Multilingual v2</strong>.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-[#2f423d] bg-[#162320] px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-[#1d2d29] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (activeTab === "upload" && !selectedFile) || (activeTab === "record" && !recordedBlob)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Cloning Voice with ElevenLabs...</span>
                </>
              ) : (
                <>
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span>Clone Voice Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
