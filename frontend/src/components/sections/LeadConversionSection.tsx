import Image from "next/image";
import "./LeadConversionSection.css";

function PhoneStatus({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`lead-device-status${dark ? " is-dark" : ""}`}>
      <span>9:41</span>
      <span className="lead-device-island" />
      <span className="lead-device-signals" aria-hidden="true">
        <svg viewBox="0 0 25 12"><path d="M1 9h2v2H1zm4-3h2v5H5zm4-3h2v8H9zm4-2h2v10h-2z" fill="currentColor" /><path d="M18 4c2-2 4-2 6 0m-5 2c1.5-1.5 3-1.5 4 0m-2 2h.1" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
        <i />
      </span>
    </div>
  );
}

function PhoneGlyph({ end = false }: { end?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.8 3.8c-.5-.5-1.3-.5-1.8 0L3.8 5c-.7.7-.9 1.7-.6 2.6 2.1 6.2 7 11.1 13.2 13.2.9.3 1.9.1 2.6-.6l1.2-1.2c.5-.5.5-1.3 0-1.8l-3.1-3.1c-.4-.4-1.1-.5-1.6-.2l-1.8 1.1a16.2 16.2 0 0 1-4.7-4.7l1.1-1.8c.3-.5.2-1.2-.2-1.6L6.8 3.8Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" transform={end ? "rotate(135 12 12)" : undefined} /></svg>;
}

function ChatPhone() {
  return (
    <div className="lead-device lead-chat-device" aria-hidden="true">
      <div className="lead-device-screen lead-chat-screen">
        <PhoneStatus />
        <div className="lead-chat-header">
          <span className="lead-chat-back">‹</span>
          <span className="lead-chat-avatar"><Image src="/images/vozon-footer-v.svg" alt="" width={21} height={21} /></span>
          <span className="lead-chat-person"><strong>Vozon AI</strong><small>Business account</small></span>
          <span className="lead-chat-header-call"><PhoneGlyph /></span>
        </div>
        <div className="lead-chat-conversation">
          <span className="lead-chat-day">TODAY</span>
          <div className="lead-chat-message is-agent">Hi Samira! I can help book a demo for your team.<small>10:42</small></div>
          <div className="lead-chat-message is-customer">Tomorrow afternoon works.<small>10:43 <b>✓✓</b></small></div>
          <div className="lead-chat-message is-agent">Perfect. I&apos;ve reserved 2:30 PM and sent you the details.<small>10:43</small></div>
        </div>
        <div className="lead-chat-composer"><span>＋</span><span>Message</span><span>➤</span></div>
        <span className="lead-device-home" />
      </div>
    </div>
  );
}

function CallPhone() {
  return (
    <div className="lead-device lead-call-device" aria-hidden="true">
      <div className="lead-device-screen lead-call-screen">
        <PhoneStatus dark />
        <div className="lead-call-main">
          <Image className="lead-call-logo" src="/images/logo_2.svg" alt="Vozon" width={154} height={47} />
          <span className="lead-call-eyebrow">VOICE AGENT</span>
          <strong>Vozon AI</strong>
          <small>00:07 · Connected</small>
          <div className="lead-call-wave" aria-hidden="true">{[7, 15, 24, 14, 31, 19, 11, 27, 17, 8, 22, 13, 6].map((height, index) => <i key={index} style={{ height }} />)}</div>
        </div>
        <div className="lead-call-controls">
          <span><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4m-4 0h8" /></svg><small>Mute</small></span>
          <span><svg viewBox="0 0 24 24"><path d="M5 5h2m5 0h.1M17 5h2M5 12h2m5 0h.1m5 0h2M5 19h2m5 0h.1m5 0h2" strokeWidth="3" /></svg><small>Keypad</small></span>
          <span><svg viewBox="0 0 24 24"><path d="M4 10h4l5-4v12l-5-4H4zM16 9c2 1 2 5 0 6m2-9c4 3 4 9 0 12" /></svg><small>Speaker</small></span>
          <span className="lead-call-end"><PhoneGlyph end /><small>End call</small></span>
        </div>
        <span className="lead-device-home" />
      </div>
    </div>
  );
}

export function LeadConversionSection() {
  return (
    <section className="lead-conversion" aria-labelledby="lead-conversion-title">
      <div className="lead-conversion-inner">
        <div className="lead-conversion-copy">
          <h2 id="lead-conversion-title">One agent. Every channel.</h2>
        </div>
        <div className="lead-conversion-visual" role="group" aria-label="Vozon conversation example">
          <CallPhone />
          <ChatPhone />
          <div className="lead-result-browser" aria-label="Example conversation result">
            <div className="lead-result-browser-bar">
              <span className="lead-result-browser-dots" aria-hidden="true"><i /><i /><i /></span>
              <span>app.vozon.ai</span>
              <span aria-hidden="true">↗</span>
            </div>
            <div className="lead-outcome-panel">
              <div className="lead-outcome-heading">
                <div>
                  <span className="lead-outcome-eyebrow">CONVERSATION RESULT</span>
                  <h3>Samira Rao</h3>
                  <p>Voice agent · 43-second call</p>
                </div>
                <span className="lead-outcome-pill"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8" /></svg>Qualified</span>
              </div>
              <div className="lead-outcome-booking">
                <span className="lead-outcome-booking-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg></span>
                <div><strong>Demo booked</strong><span>Tomorrow at 2:30 PM</span></div>
              </div>
              <div className="lead-outcome-summary">
                <span>CALL SUMMARY</span>
                <p>Samira is interested in voice agents for her team. She confirmed a demo, and the details were sent on WhatsApp.</p>
              </div>
              <div className="lead-outcome-next">
                <div><span>NEXT STEP</span><strong>Team demo · Tomorrow, 2:30 PM</strong></div>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
