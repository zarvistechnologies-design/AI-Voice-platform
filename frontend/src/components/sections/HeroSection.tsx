import { VoicePreview } from "@/components/sections/VoicePreview";

export function HeroSection() {
  return (
    <section className="hero-section" id="product">
      <div className="hero">
        <div className="hero-content">
          <p className="eyebrow">Human-like AI voices in seconds</p>
          <h1>Create, clone, and deploy production-ready voice AI.</h1>
          <p className="hero-copy">
            Generate natural speech, run live voice demos, and ship multilingual
            agents with reliable APIs built for customer conversations, content
            teams, and product workflows.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#demo">
              Try Free
            </a>
            <a className="secondary-button" href="#features">
              Explore Voices
            </a>
          </div>

          <div className="hero-promise" aria-label="Platform promises">
            <span>No credit card needed</span>
            <span>140+ languages</span>
            <span>Realtime preview</span>
          </div>
        </div>

        <VoicePreview />
      </div>

      <div className="hero-stats" aria-label="Platform stats">
        <article>
          <strong>500K+</strong>
          <span>Creators</span>
        </article>
        <article>
          <strong>3,000+</strong>
          <span>AI voices</span>
        </article>
        <article>
          <strong>140+</strong>
          <span>Languages</span>
        </article>
        <article>
          <strong>99.9%</strong>
          <span>Uptime</span>
        </article>
      </div>
    </section>
  );
}
