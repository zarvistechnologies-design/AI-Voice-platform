import Image from "next/image";

const voiceAgentPhoto = {
  title: "Customer support",
  description: "Real service teams backed by faster, more consistent call handling.",
  image: "/images/voice-agents/real-customer-support.jpg",
  alt: "Customer support specialists working at their desks",
} as const;

export function VoiceAgentHeroSlider() {
  return (
    <div className="voice-hero-slider">
      <div className="voice-hero-slider-glow" aria-hidden="true" />

      <div className="voice-hero-slider-track">
        <figure className="voice-hero-slide is-active">
          <Image
            alt={voiceAgentPhoto.alt}
            className="voice-hero-slide-image"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 650px"
            src={voiceAgentPhoto.image}
          />
          <span className="voice-hero-slide-shade" aria-hidden="true" />
          <figcaption className="voice-hero-slide-copy">
            <strong>{voiceAgentPhoto.title}</strong>
            <span>{voiceAgentPhoto.description}</span>
          </figcaption>
        </figure>
      </div>

      <style>{`
        .voice-hero-slider {
          position: relative;
          isolation: isolate;
          width: 100%;
          min-width: 0;
          padding: 1.25rem 0 2rem;
        }

        .voice-hero-slider-glow {
          position: absolute;
          z-index: -1;
          right: 4%;
          bottom: 3%;
          width: 72%;
          height: 38%;
          border-radius: 50%;
          background: rgba(53, 251, 224, 0.18);
          filter: blur(70px);
          opacity: 0.55;
        }

        .voice-hero-slider-track {
          display: flex;
          width: 100%;
          height: clamp(360px, 30vw, 430px);
          gap: 0.55rem;
        }

        .voice-hero-slide {
          position: relative;
          flex: 0.34 1 0;
          min-width: 0;
          overflow: hidden;
          margin: 0;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 1.25rem;
          background: #07100f;
          color: white;
          cursor: default;
          box-shadow: 0 22px 56px rgba(0, 0, 0, 0.38);
          transition:
            flex 620ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 240ms ease,
            box-shadow 240ms ease,
            transform 240ms ease;
        }

        .voice-hero-slide.is-active {
          z-index: 2;
          flex: 3.25 1 0;
          border-color: rgba(53, 251, 224, 0.36);
          box-shadow:
            0 28px 72px rgba(0, 0, 0, 0.52),
            0 0 44px rgba(53, 251, 224, 0.08);
        }

        .voice-hero-slide:not(.is-active):hover {
          border-color: rgba(117, 255, 240, 0.34);
          transform: translateY(-4px);
        }

        .voice-hero-slide:focus-visible,
        .voice-hero-slider-dots button:focus-visible {
          outline: 2px solid #75fff0;
          outline-offset: 3px;
        }

        .voice-hero-slide-image {
          object-fit: cover;
          object-position: 50% 50%;
          filter: saturate(0.82) brightness(0.76);
          transform: scale(1.035);
          transition:
            filter 520ms ease,
            transform 820ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .voice-hero-slide.is-active .voice-hero-slide-image {
          filter: saturate(0.98) brightness(0.86);
          transform: scale(1);
        }

        .voice-hero-slide-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to top, rgba(2, 7, 8, 0.96), rgba(2, 7, 8, 0.08) 58%),
            linear-gradient(110deg, rgba(53, 251, 224, 0.06), transparent 48%);
        }

        .voice-hero-slide-copy {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          min-width: 0;
          align-items: flex-start;
          flex-direction: column;
          padding: 1.15rem;
          text-align: left;
        }

        .voice-hero-slide-copy strong {
          display: block;
          color: white;
          font-size: 0.82rem;
          font-weight: 700;
          line-height: 1.25;
          white-space: nowrap;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          transition: transform 300ms ease;
        }

        .voice-hero-slide-copy > span {
          display: none;
          max-width: 24rem;
          margin-top: 0.7rem;
          color: rgba(226, 232, 240, 0.76);
          font-size: 0.76rem;
          line-height: 1.35rem;
          opacity: 0;
        }

        .voice-hero-slide.is-active .voice-hero-slide-copy {
          padding: 1.4rem;
        }

        .voice-hero-slide.is-active .voice-hero-slide-copy strong {
          font-size: 1.25rem;
          line-height: 1.2;
          white-space: normal;
          writing-mode: horizontal-tb;
          transform: none;
        }

        .voice-hero-slide.is-active .voice-hero-slide-copy > span {
          display: block;
          opacity: 1;
          animation: voice-slide-copy-in 420ms 160ms both;
        }

        .voice-hero-slider-dots {
          position: absolute;
          bottom: 0;
          left: 50%;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transform: translateX(-50%);
        }

        .voice-hero-slider-dots button {
          width: 0.38rem;
          height: 0.38rem;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.24);
          cursor: pointer;
          transition:
            width 260ms ease,
            background-color 260ms ease;
        }

        .voice-hero-slider-dots button.is-active {
          width: 1.5rem;
          background: #35fbe0;
        }

        @keyframes voice-slide-copy-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 639px) {
          .voice-hero-slider {
            padding-top: 0.5rem;
          }

          .voice-hero-slider-track {
            height: 360px;
            gap: 0.42rem;
          }

          .voice-hero-slide {
            flex-basis: 0;
            border-radius: 1rem;
          }

          .voice-hero-slide.is-active {
            flex-grow: 4.2;
          }

          .voice-hero-slide-copy {
            padding: 0.75rem 0.55rem;
          }

          .voice-hero-slide-copy strong {
            font-size: 0.66rem;
          }

          .voice-hero-slide.is-active .voice-hero-slide-copy {
            padding: 1.15rem;
          }

          .voice-hero-slide.is-active .voice-hero-slide-copy strong {
            font-size: 1.05rem;
          }

          .voice-hero-slide.is-active .voice-hero-slide-copy > span {
            font-size: 0.7rem;
            line-height: 1.2rem;
          }

        }

        @media (min-width: 1024px) {
          .voice-hero-slider {
            max-width: 650px;
            margin-left: auto;
          }
        }

        .voice-hero-slider-track {
          position: relative;
          display: block;
        }

        .voice-hero-slide,
        .voice-hero-slide:not(.is-active) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateX(20px) scale(0.985);
          transition:
            opacity 620ms ease,
            visibility 620ms ease,
            transform 760ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 240ms ease,
            box-shadow 240ms ease;
        }

        .voice-hero-slide.is-active {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .voice-hero-slide,
          .voice-hero-slide-image,
          .voice-hero-slider-dots button {
            transition: none;
          }

          .voice-hero-slide.is-active .voice-hero-slide-copy > span {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
