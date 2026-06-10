import { VoicePreview } from "@/components/sections/VoicePreview";

export function HeroSection() {
  return (
    <section className="hero" id="product">
      <div className="hero-content">
        <p className="eyebrow">Realtime speech intelligence</p>
        <h1>Build natural AI voice experiences for every customer conversation.</h1>
        <p className="hero-copy">
          AI Voice Platform helps teams create responsive voice agents,
          automate calls, transcribe conversations, and turn spoken
          interactions into useful business insight.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#pricing">
            View Pricing
          </a>
          <a className="secondary-button" href="#business">
            Explore Business Tools
          </a>
        </div>
      </div>

      <VoicePreview />
    </section>
  );
}
