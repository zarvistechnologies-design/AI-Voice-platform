import Link from "next/link";
import styles from "./VoiceOperationsShowcase.module.css";

function VoiceMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 52 44" fill="none" aria-hidden="true">
      <path d="M3 5h12l13 25L39 5h10L31 40h-9L3 5Z" fill="currentColor" />
      <path d="M24 6v8m5-12v17m5-12v7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// The exact same device artwork is used at both scales.
function VoicePhone() {
  return (
    <div className={styles.phone} aria-hidden="true">
      <div className={styles.phoneSide} />
      <div className={styles.phoneScreen}>
        <div className={styles.notch} />
        <div className={styles.phoneStatus}><span>9:41</span><span>••• ▰</span></div>
        <span className={styles.phoneBrand}>vozon</span>
        <VoiceMark className={styles.phoneMark} />
        <div className={styles.phoneGreeting}>
          <span>YOUR PERSONAL VOICE AGENT</span>
          <p>How can I<br />help you today?</p>
        </div>
        <div className={styles.phoneControls}>
          <span className={styles.micIcon}>♪</span>
          <span className={styles.voiceSphere} />
          <span className={styles.micIcon}>•••</span>
        </div>
        <span className={styles.phoneHome} />
      </div>
    </div>
  );
}

function VoiceTags() {
  return (
    <div className={styles.tags}>
      <p>Voice <span>AI</span></p>
      <div><span>Inbound Support</span><span>Lead Qualification</span></div>
      <div><span>Appointment Booking</span><span>Outbound Calls</span></div>
      <div><span>Hindi &amp; 40+ Langs</span><span>CRM Sync</span></div>
    </div>
  );
}

export function VoiceOperationsShowcase() {
  return (
    <section className={styles.showcase} aria-label="Vozon voice agents on phone and web">
      <div className={styles.scene}>
        <div className={styles.orbits} aria-hidden="true" />
        <div className={styles.desktop}>
          <div className={styles.topbar}>
            <span className={styles.brand}><VoiceMark /> Vozon</span>
            <span className={styles.category}><i /> AI voice agents</span>
            <Link href="#platform" className={styles.smallLink}>Get in touch ↗</Link>
          </div>

          <h2 className={styles.heading}>Your voice agents,<br /><span>always ready</span><br /><span>for a conversation.</span></h2>
          <div className={styles.intro}>
            <p>Turn every call into a helpful conversation. Let your AI agents answer, book, and support—in your customers’ language.</p>
            <Link href="#platform">Hear an agent ↗</Link>
          </div>

          <div className={styles.wordmark} aria-hidden="true">Voice Agent.<br /><span>Speaks human.</span></div>
          <div className={styles.centerPhone}><VoicePhone /></div>
          <div className={styles.desktopTags}><VoiceTags /></div>

          <div className={styles.caption}>
            <p>A natural voice.<br />A human experience.</p>
            <span>Built around your business.</span>
          </div>
        </div>

        <div className={styles.mobile} aria-hidden="true">
          <div className={styles.mobileHeader}>
            <span className={styles.brand}><VoiceMark /> Vozon</span>
            <span className={styles.mobileContact}>Get in touch ↗</span>
          </div>
          <div className={styles.mobileNav}><span>• Voice agents</span><span>‹ <i /> <i /> <i /> <i /> ›</span></div>
          <p className={styles.mobileHeading}>Your voice agents,<br />always ready<br />for a conversation.</p>
          <div className={styles.mobileIntro}>
            <p>Helpful conversations.<br />In every language.<br />On every call.</p>
            <span>Hear an agent ↗</span>
          </div>
          <div className={styles.mobileWordmark}>AI Voice.<br /><span>Always on.</span></div>
          <div className={styles.miniPhone}><VoicePhone /></div>
          <div className={styles.mobileTags}><VoiceTags /></div>
        </div>
      </div>
    </section>
  );
}
