import Image from "next/image";
import "./GlobalVoicesMapSection.css";

export function GlobalVoicesMapSection() {
  return (
    <section aria-labelledby="global-voices-map-title" className="global-voices-map-section">
      <div className="global-voices-map-visual">
        <h2 id="global-voices-map-title">Speak their language, wherever they are.</h2>
        <Image
          alt="Dotted globe with English, Spanish, French, Hindi, and Tamil voice highlights"
          className="global-voices-map-image"
          height={1024}
          sizes="(max-width: 1080px) 100vw, 1080px"
          src="/images/dotted-globe-transparent.png"
          width={1536}
        />
      </div>
    </section>
  );
}
