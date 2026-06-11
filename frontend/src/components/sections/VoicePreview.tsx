export function VoicePreview() {
  return (
    <div className="voice-panel" aria-label="Voice platform preview">
      <div className="panel-top">
        <span className="status-dot" />
        <span>Live voice session</span>
        <strong>00:42</strong>
      </div>

      <div className="waveform" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="voice-meta" aria-label="Voice settings">
        <span>Aria - Warm</span>
        <span>English</span>
        <span>1.0x</span>
      </div>

      <div className="transcript">
        <p>
          <strong>Customer:</strong> Can I reschedule my appointment?
        </p>
        <p>
          <strong>AI Agent:</strong> Absolutely. I found three open times for
          you today.
        </p>
      </div>
    </div>
  );
}
