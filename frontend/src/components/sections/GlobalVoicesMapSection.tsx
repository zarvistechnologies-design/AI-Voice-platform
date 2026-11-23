import Image from "next/image";
import "./GlobalVoicesMapSection.css";

export function GlobalVoicesMapSection() {
  return (
    <section aria-labelledby="global-voices-map-title" className="global-voices-map-section">
      <div className="global-voices-map-inner">
        <div className="global-voices-map-heading">
          <span className="global-voices-map-eyebrow"><i aria-hidden="true" /> GLOBAL &amp; INDIC VOICES</span>
          <h2 id="global-voices-map-title">Speak their language, wherever they are.</h2>
          <p>Human-like conversational voice agents across 22+ Indic languages and 76 global dialects with sub-500ms latency.</p>
        </div>
        <div className="global-voices-map-visual">
          <Image
            alt="Dotted globe with English, Spanish, French, Hindi, and Tamil voice highlights"
            className="global-voices-map-image"
            height={1024}
            sizes="(max-width: 1200px) 100vw, 1200px"
            src="/images/dotted-globe-transparent.png"
            width={1536}
          />
        </div>
      </div>
    </section>
  );
}
