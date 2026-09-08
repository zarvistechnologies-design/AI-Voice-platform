export type VoiceConnectionCredentials = { serverUrl: string; participantToken: string };

/** Own startup resources until publication succeeds or the attempt is abandoned. */
export async function startVoiceConnection<
  Credentials extends VoiceConnectionCredentials,
  Microphone extends { stop(): void },
>(options: {
  signal: AbortSignal;
  unlockAudio: () => Promise<void>;
  prepareMicrophone: () => Promise<Microphone>;
  getCredentials: (signal: AbortSignal) => Promise<Credentials>;
  connect: (credentials: Credentials) => Promise<unknown>;
  publishMicrophone: (microphone: Microphone) => Promise<unknown>;
  disconnect: () => Promise<unknown>;
  onCredentials?: (credentials: Credentials) => void;
}): Promise<Credentials> {
  const { signal } = options;
  signal.throwIfAborted();
  let microphone: Microphone | undefined;
  let abandoned = false;
  let connectionStarted = false;
  const disconnect = () => { void options.disconnect().catch(() => undefined); };
  const cleanup = () => {
    abandoned = true;
    microphone?.stop();
    microphone = undefined;
    if (connectionStarted) disconnect();
  };
  let rejectAbort!: (reason: unknown) => void;
  const aborted = new Promise<never>((_, reject) => { rejectAbort = reject; });
  const onAbort = () => {
    cleanup();
    rejectAbort(signal.reason);
  };
  signal.addEventListener("abort", onAbort, { once: true });

  try {
    // Permission and playback unlock both start within the original click.
    const [credentials, prepared] = await Promise.race([
      Promise.all([
        options.getCredentials(signal),
        options.prepareMicrophone().then((track) => {
          if (abandoned) track.stop();
          else microphone = track;
          return track;
        }),
        options.unlockAudio(),
      ]),
      aborted,
    ]);
    signal.throwIfAborted();
    options.onCredentials?.(credentials);
    signal.throwIfAborted();
    connectionStarted = true;
    const connection = options.connect(credentials).then(() => {
      // A connect implementation can settle after its disconnect was requested.
      if (abandoned) disconnect();
    });
    await Promise.race([connection, aborted]);
    signal.throwIfAborted();
    const publication = options.publishMicrophone(prepared).then(() => {
      if (abandoned) disconnect();
    });
    await Promise.race([publication, aborted]);
    signal.throwIfAborted();
    microphone = undefined; // The connected room now owns the published track.
    return credentials;
  } catch (error) {
    cleanup();
    throw error;
  } finally {
    signal.removeEventListener("abort", onAbort);
  }
}
