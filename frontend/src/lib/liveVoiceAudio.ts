import {
  AudioPresets,
  Room,
  Track,
  createLocalAudioTrack,
  type AudioCaptureOptions,
  type TrackPublishOptions,
} from "livekit-client";
import { startVoiceConnection, type VoiceConnectionCredentials } from "./voiceConnection";

export const voiceAudioCaptureOptions = {
  autoGainControl: true,
  channelCount: { ideal: 1 },
  echoCancellation: true,
  latency: { ideal: 0.02 },
  noiseSuppression: true,
  sampleRate: { ideal: 48_000 },
  voiceIsolation: true,
} satisfies AudioCaptureOptions;

const voiceAudioPublishOptions = {
  audioPreset: AudioPresets.music,
  dtx: true,
  forceStereo: false,
  red: true,
  source: Track.Source.Microphone,
} satisfies TrackPublishOptions;

export function createVoiceRoom() {
  return new Room({
    adaptiveStream: true,
    audioCaptureDefaults: voiceAudioCaptureOptions,
    dynacast: true,
    publishDefaults: {
      audioPreset: voiceAudioPublishOptions.audioPreset,
      dtx: voiceAudioPublishOptions.dtx,
      forceStereo: voiceAudioPublishOptions.forceStereo,
      red: voiceAudioPublishOptions.red,
    },
  });
}

export function connectVoiceRoom<T extends VoiceConnectionCredentials>(
  room: Room,
  getCredentials: (signal: AbortSignal) => Promise<T>,
  signal: AbortSignal,
  onCredentials?: (credentials: T) => void,
) {
  return startVoiceConnection({
    signal,
    getCredentials,
    onCredentials,
    unlockAudio: () => room.startAudio(),
    prepareMicrophone: () => createLocalAudioTrack(voiceAudioCaptureOptions),
    connect: (credentials) => room.connect(credentials.serverUrl, credentials.participantToken),
    publishMicrophone: (microphone) => room.localParticipant.publishTrack(microphone, voiceAudioPublishOptions),
    disconnect: () => room.disconnect(),
  });
}
