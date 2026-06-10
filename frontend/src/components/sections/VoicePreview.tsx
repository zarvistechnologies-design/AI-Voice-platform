export function VoicePreview() {
  return (
    <div className="voice-panel" aria-label="Voice platform preview">
      <div className="panel-top">
        <span className="status-dot" />
        <span>Live voice session</span>
      </div>

      <div className="waveform" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} />
        ))}
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
