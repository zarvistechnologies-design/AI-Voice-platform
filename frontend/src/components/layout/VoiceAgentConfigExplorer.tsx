"use client";

import { useEffect, useState } from "react";

export type ProductConfigurationItem = {
  title: string;
  shortTitle: string;
  microcopy: string;
  description: string;
  options: readonly string[];
};

const configurationItems: readonly ProductConfigurationItem[] = [
  {
    title: "Name, voice, and personality",
    shortTitle: "Voice & personality",
    microcopy: "Voice, tone, and behavior",
    description: "Define how your agent introduces itself, sounds, and behaves so every conversation reflects your business.",
    options: ["Voice & accent", "Tone of voice", "Speaking speed", "Personality"],
  },
  {
    title: "Greeting and closing message",
    shortTitle: "Greeting & closing",
    microcopy: "Opening and closing moments",
    description: "Shape the first and final moments of every call with messages that feel clear, natural, and consistent.",
    options: ["Opening greeting", "Closing message", "Returning callers", "Business hours"],
  },
  {
    title: "Supported languages (40+, including cloned voices)",
    shortTitle: "Supported languages",
    microcopy: "Languages, accents, and voices",
    description: "Choose how your agent detects and speaks each supported language while maintaining a consistent voice.",
    options: ["40+ languages", "Cloned voices", "Regional accents", "Language detection"],
  },
  {
    title: "Knowledge sources: FAQs, documents, policies",
    shortTitle: "Knowledge sources",
    microcopy: "Approved business information",
    description: "Connect approved business information so every answer remains accurate, useful, and grounded.",
    options: ["FAQs", "Documents", "Policies", "Pricing"],
  },
  {
    title: "Calendar and CRM connections",
    shortTitle: "Calendar & CRM",
    microcopy: "Scheduling and customer records",
    description: "Link the systems your agent needs to check availability, schedule appointments, and update customer records.",
    options: ["Calendar booking", "CRM updates", "Availability", "Contact records"],
  },
  {
    title: "Fallback response when it doesn't know an answer",
    shortTitle: "Fallback response",
    microcopy: "Safe unknown-answer handling",
    description: "Control how the agent responds when information is missing, unclear, or outside its approved knowledge.",
    options: ["Fallback message", "Clarification", "Safe limits", "Escalation"],
  },
  {
    title: "Rules for transferring a call to you",
    shortTitle: "Call transfer rules",
    microcopy: "Human handoff conditions",
    description: "Set when, where, and how a conversation moves smoothly to the right person on your team.",
    options: ["Transfer conditions", "Team routing", "Business hours", "Context handoff"],
  },
  {
    title: "Where it's deployed: phone number, web widget, or app",
    shortTitle: "Deployment channels",
    microcopy: "Phone, web, app, and API",
    description: "Choose where customers can reach your agent and maintain one consistent experience across every channel.",
    options: ["Phone number", "Web widget", "Mobile app", "API or embed"],
  },
] as const;

function ConfigurationIcon({ index }: { index: number }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.6,
  };

  const paths = [
    <g key="identity">
      <circle {...common} cx="12" cy="8" r="3" />
      <path {...common} d="M5.5 19c.9-3.4 3-5 6.5-5s5.6 1.6 6.5 5" />
    </g>,
    <g key="greeting">
      <path {...common} d="M4 5.5h16v10H9l-4 3v-3H4z" />
      <path {...common} d="M8 9h8M8 12h5" />
    </g>,
    <g key="language">
      <circle {...common} cx="12" cy="12" r="8" />
      <path {...common} d="M4 12h16M12 4c2 2.2 3 4.9 3 8s-1 5.8-3 8M12 4c-2 2.2-3 4.9-3 8s1 5.8 3 8" />
    </g>,
    <g key="knowledge">
      <path {...common} d="M4.5 5.5c3.3-.8 5.8-.2 7.5 1.6v12c-1.7-1.8-4.2-2.4-7.5-1.6zM19.5 5.5c-3.3-.8-5.8-.2-7.5 1.6v12c1.7-1.8 4.2-2.4 7.5-1.6z" />
    </g>,
    <g key="calendar">
      <rect {...common} x="4" y="6" width="16" height="14" rx="2" />
      <path {...common} d="M8 4v4M16 4v4M4 10h16M8 14h2M14 14h2M8 17h2" />
    </g>,
    <g key="fallback">
      <path {...common} d="M12 4 3.8 19h16.4zM12 9v4M12 16.5h.01" />
    </g>,
    <g key="handoff">
      <path {...common} d="M8 5H5v3M5.2 7.8a7 7 0 0 1 11.5-1.9M16 19h3v-3M18.8 16.2a7 7 0 0 1-11.5 1.9" />
      <path {...common} d="M9.5 9.5h5v5h-5z" />
    </g>,
    <g key="deployment">
      <rect {...common} x="3.5" y="5" width="17" height="11" rx="2" />
      <path {...common} d="M9 20h6M12 16v4" />
    </g>,
  ];

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {paths[index]}
    </svg>
  );
}

type VoiceAgentConfigExplorerProps = {
  items?: readonly ProductConfigurationItem[];
  label?: string;
};

export function VoiceAgentConfigExplorer({
  items = configurationItems,
  label = "Voice agent configuration explorer",
}: VoiceAgentConfigExplorerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] ?? items[0];
  const isCompact = items.length <= 3;

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [activeIndex, items.length]);

  return (
    <div
      aria-label={label}
      className={`voice-config-explorer voice-config-tone-${(activeIndex % 8) + 1} ${isCompact ? "voice-config-explorer-compact" : ""}`}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          showPrevious();
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          showNext();
        }
      }}
      role="region"
    >
      <div className="voice-config-explorer-main">
        <article className="voice-config-detail" aria-live="polite" id="voice-config-panel" role="tabpanel">
          <div className="voice-config-detail-body">
            <div className="voice-config-detail-copy">
              <div className="voice-config-detail-progress">
                <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
                <span>/ {String(items.length).padStart(2, "0")}</span>
                <span className="voice-config-progress-track" aria-hidden="true">
                  <span style={{ width: `${((activeIndex + 1) / items.length) * 100}%` }} />
                </span>
              </div>

              <div className="voice-config-title-row">
                <span className="voice-config-detail-icon">
                  <ConfigurationIcon index={activeIndex % 8} />
                </span>
                <h3>{activeItem.title}</h3>
              </div>
              <p>{activeItem.description}</p>
            </div>

            <div className="voice-config-bar-chart">
              {activeItem.options.map((option, optionIndex) => (
                <div className="voice-config-chart-row" key={option}>
                  <div className="voice-config-chart-label">
                    <span>{option}</span>
                    <small>{String(optionIndex + 1).padStart(2, "0")}</small>
                  </div>
                  <span className="voice-config-chart-track" aria-hidden="true">
                    <span
                      style={{
                        width: `${[88, 72, 94, 80][(activeIndex + optionIndex) % 4]}%`,
                      }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      <div className="voice-config-tabs" role="tablist" aria-label="Configuration options">
        {items.map((item, index) => (
          <button
            aria-controls="voice-config-panel"
            aria-selected={index === activeIndex}
            className={index === activeIndex ? "is-active" : ""}
            key={item.title}
            onClick={() => setActiveIndex(index)}
            role="tab"
            type="button"
          >
            <span className="voice-config-tab-icon">
              <ConfigurationIcon index={index % 8} />
            </span>
            <span>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <strong>{item.shortTitle}</strong>
              <em>{item.microcopy}</em>
            </span>
          </button>
        ))}
      </div>

      <style>{`
        .voice-config-explorer {
          --active-config-color: #35fbe0;
          --active-config-rgb: 53, 251, 224;
          position: relative;
          width: 100%;
          max-width: 1360px;
          margin: 1.75rem auto 0;
          overflow: hidden;
          border: 1px solid rgba(117, 255, 240, 0.26);
          border-radius: 1.45rem;
          background: #050a0d;
          box-shadow:
            0 28px 70px rgba(0, 0, 0, 0.32),
            0 0 40px rgba(53, 251, 224, 0.035),
            inset 0 1px 0 rgba(255, 255, 255, 0.045);
        }

        .voice-config-explorer-compact {
          max-width: 1040px;
        }

        .voice-config-explorer-compact .voice-config-tabs {
          grid-auto-columns: minmax(0, 1fr);
        }

        .voice-config-explorer-compact .voice-config-tabs > button {
          min-height: 92px;
          padding: 0.75rem 1rem;
        }

        .voice-config-tone-2 {
          --active-config-color: #75baff;
          --active-config-rgb: 117, 186, 255;
        }

        .voice-config-tone-3 {
          --active-config-color: #a99cff;
          --active-config-rgb: 169, 156, 255;
        }

        .voice-config-tone-4 {
          --active-config-color: #f080d0;
          --active-config-rgb: 240, 128, 208;
        }

        .voice-config-tone-5 {
          --active-config-color: #ffad5c;
          --active-config-rgb: 255, 173, 92;
        }

        .voice-config-tone-6 {
          --active-config-color: #ff6f91;
          --active-config-rgb: 255, 111, 145;
        }

        .voice-config-tone-7 {
          --active-config-color: #72f6a1;
          --active-config-rgb: 114, 246, 161;
        }

        .voice-config-tone-8 {
          --active-config-color: #69e5ff;
          --active-config-rgb: 105, 229, 255;
        }

        .voice-config-explorer-main {
          position: relative;
          overflow: hidden;
          border: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
          background:
            linear-gradient(115deg, rgba(53, 251, 224, 0.055), transparent 32%),
            #050a0d;
        }

        .voice-config-detail {
          min-width: 0;
          padding: clamp(2.15rem, 4.2vw, 3.5rem);
        }

        .voice-config-detail-progress {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: rgba(255, 255, 255, 0.35);
          font-family: monospace;
          font-size: 0.78rem;
        }

        .voice-config-detail-progress strong {
          color: var(--active-config-color);
          font-size: 1rem;
        }

        .voice-config-progress-track {
          position: relative;
          display: block;
          height: 3px;
          flex: 1;
          margin-left: 0.9rem;
          overflow: hidden;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.075);
        }

        .voice-config-progress-track > span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: var(--active-config-color);
          box-shadow: 0 0 8px rgba(var(--active-config-rgb), 0.32);
          transition: width 360ms ease;
        }

        .voice-config-detail-body {
          display: grid;
          align-items: center;
          gap: clamp(2.5rem, 5vw, 5.5rem);
        }

        .voice-config-detail-copy {
          position: relative;
          min-width: 0;
        }

        .voice-config-detail-icon {
          display: grid;
          width: 3.4rem;
          height: 3.4rem;
          flex: 0 0 auto;
          place-items: center;
          border-left: 2px solid var(--active-config-color);
          background: linear-gradient(90deg, rgba(var(--active-config-rgb), 0.12), transparent);
          color: var(--active-config-color);
        }

        .voice-config-detail-icon svg {
          width: 1.95rem;
          height: 1.95rem;
        }

        .voice-config-title-row {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-top: 1.55rem;
        }

        .voice-config-detail h3 {
          max-width: 32rem;
          margin: 0;
          color: white;
          font-size: clamp(1.65rem, 2.5vw, 2.25rem);
          font-weight: 650;
          line-height: 1.12;
          letter-spacing: -0.035em;
        }

        .voice-config-detail p {
          max-width: 30rem;
          margin-top: 0.85rem;
          color: #94a3b8;
          font-size: 0.96rem;
          line-height: 1.72rem;
        }

        .voice-config-bar-chart {
          position: relative;
          display: grid;
          gap: 1.2rem;
          min-width: 0;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 0.95rem;
          background:
            linear-gradient(135deg, rgba(var(--active-config-rgb), 0.045), transparent 54%),
            rgba(255, 255, 255, 0.014);
          padding: 1.85rem 2rem;
        }

        .voice-config-bar-chart::before {
          content: none;
        }

        .voice-config-chart-row {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(112px, 34%) minmax(0, 1fr);
          align-items: center;
          gap: 1rem;
        }

        .voice-config-chart-label {
          display: flex;
          position: relative;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding-left: 0.8rem;
          color: rgba(255, 255, 255, 0.82);
          font-size: 0.8rem;
          line-height: 1.25;
        }

        .voice-config-chart-label::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          width: 4px;
          height: 12px;
          border-radius: 1px;
          background: var(--chart-color);
          box-shadow: 0 0 8px rgba(var(--chart-rgb), 0.36);
          transform: translateY(-50%);
        }

        .voice-config-chart-label small {
          color: var(--chart-color);
          font-family: monospace;
          font-size: 0.55rem;
          opacity: 0.72;
        }

        .voice-config-chart-track {
          position: relative;
          display: block;
          height: 0.98rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.045);
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.055);
        }

        .voice-config-chart-track > span {
          position: relative;
          display: block;
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, rgba(var(--chart-rgb), 0.48), var(--chart-color));
          box-shadow: 0 0 10px rgba(var(--chart-rgb), 0.2);
          transition: width 420ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .voice-config-chart-track > span::after {
          content: none;
        }

        .voice-config-chart-row:nth-child(1) { --chart-color: #35fbe0; --chart-rgb: 53, 251, 224; }
        .voice-config-chart-row:nth-child(2) { --chart-color: #75baff; --chart-rgb: 117, 186, 255; }
        .voice-config-chart-row:nth-child(3) { --chart-color: #a99cff; --chart-rgb: 169, 156, 255; }
        .voice-config-chart-row:nth-child(4) { --chart-color: #f080d0; --chart-rgb: 240, 128, 208; }

        .voice-config-tabs {
          display: grid;
          width: 100%;
          grid-auto-flow: column;
          grid-auto-columns: minmax(135px, 1fr);
          margin-top: 0;
          overflow-x: auto;
          border-top: 0;
          border-bottom: 0;
          background: rgba(3, 8, 11, 0.86);
          scrollbar-width: thin;
        }

        .voice-config-tabs > button {
          display: grid;
          min-height: 124px;
          grid-template-columns: 1.55rem minmax(0, 1fr);
          align-items: center;
          gap: 0.55rem;
          padding: 1.1rem 0.9rem;
          border: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.045);
          background: transparent;
          color: #94a3b8;
          text-align: left;
          cursor: pointer;
          transition:
            background-color 220ms ease,
            color 220ms ease,
            box-shadow 220ms ease;
        }

        .voice-config-tabs > button:last-child {
          border-right: 0;
        }

        .voice-config-tabs > button.is-active {
          background: linear-gradient(to bottom, color-mix(in srgb, var(--tab-color) 9%, transparent), transparent);
          color: white;
          box-shadow: inset 0 2px var(--tab-color);
        }

        .voice-config-tab-icon {
          display: grid;
          width: 1.55rem;
          height: 1.55rem;
          place-items: center;
          color: var(--tab-color);
        }

        .voice-config-tab-icon svg {
          width: 1.3rem;
          height: 1.3rem;
        }

        .voice-config-tabs small {
          display: block;
          color: var(--tab-color);
          font-family: monospace;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .voice-config-tabs strong {
          display: block;
          margin-top: 0.2rem;
          color: inherit;
          font-size: 0.78rem;
          font-weight: 650;
          line-height: 1.25;
        }

        .voice-config-tabs em {
          display: block;
          margin-top: 0.3rem;
          color: rgba(148, 163, 184, 0.72);
          font-size: 0.63rem;
          font-style: normal;
          font-weight: 400;
          line-height: 1.35;
        }

        .voice-config-tabs > button:focus-visible {
          outline: 2px solid #75fff0;
          outline-offset: 3px;
        }

        .voice-config-tabs > button:nth-child(1) { --tab-color: #35fbe0; }
        .voice-config-tabs > button:nth-child(2) { --tab-color: #75baff; }
        .voice-config-tabs > button:nth-child(3) { --tab-color: #a99cff; }
        .voice-config-tabs > button:nth-child(4) { --tab-color: #f080d0; }
        .voice-config-tabs > button:nth-child(5) { --tab-color: #ffad5c; }
        .voice-config-tabs > button:nth-child(6) { --tab-color: #ff6f91; }
        .voice-config-tabs > button:nth-child(7) { --tab-color: #72f6a1; }
        .voice-config-tabs > button:nth-child(8) { --tab-color: #69e5ff; }

        @media (min-width: 768px) {
          .voice-config-detail {
            height: 340px;
          }

          .voice-config-detail-body {
            grid-template-columns: minmax(0, 0.82fr) minmax(400px, 1.18fr);
          }

          .voice-config-explorer-compact .voice-config-detail {
            height: 260px;
            padding: 2rem 2.5rem;
          }

          .voice-config-explorer-compact .voice-config-detail-body {
            gap: 3rem;
            grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
          }
        }

        @media (min-width: 1200px) {
          .voice-config-detail {
            padding: 3.25rem 3.75rem;
          }

          .voice-config-tabs {
            overflow: hidden;
            grid-auto-columns: minmax(0, 1fr);
          }

          .voice-config-tabs > button {
            min-height: 124px;
          }

          .voice-config-explorer-compact .voice-config-tabs > button {
            min-height: 92px;
          }
        }

        @media (max-width: 639px) {
          .voice-config-explorer {
            margin-top: 1.75rem;
          }

          .voice-config-detail h3 {
            font-size: 1.45rem;
          }

          .voice-config-bar-chart {
            margin-top: 0.4rem;
          }

          .voice-config-chart-row {
            grid-template-columns: minmax(105px, 42%) minmax(0, 1fr);
            gap: 0.7rem;
          }

        }

        @media (prefers-reduced-motion: reduce) {
          .voice-config-tabs > button,
          .voice-config-progress-track > span,
          .voice-config-chart-track > span {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
