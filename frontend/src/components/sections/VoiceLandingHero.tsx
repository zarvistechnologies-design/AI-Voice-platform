import Link from "next/link";
import styles from "./VoiceLandingHero.module.css";

export function VoiceLandingHero() {
  return (
    <section className={styles.hero} aria-labelledby="voice-landing-title">
      <div className={styles.container}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>A human touch. Powered by voice AI.</span>
        </div>

        <h1 id="voice-landing-title" className={styles.headline}>
          Every call. A better <span>connection.</span>
        </h1>

        <p className={styles.tagline}>
          Meet the voice agents that answer, qualify, and book—in your customers’ language and your brand’s voice.
        </p>

        <div className={styles.actions}>
          <Link className={styles.primary} href="/dashboard">
            Build your voice agent <span aria-hidden="true">↗</span>
          </Link>
          <a className={styles.secondary} href="#showcase-section">
            <span aria-hidden="true">▷</span> Hear it in action
          </a>
        </div>
      </div>
    </section>
  );
}
