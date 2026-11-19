import Image from "next/image";
import Link from "next/link";
import "./LeadConversionSection.css";

const highlights = [
  "Voice AI + WhatsApp + Web Chat unified",
  "Autonomous tool calls & live CRM sync",
  "22+ Indic & 76 global languages",
  "Production-ready multi-tenant workflows",
] as const;

export function LeadConversionSection() {
  return (
    <section className="lead-conversion" aria-labelledby="lead-conversion-title">
      <div className="lead-conversion-inner">
        <div className="lead-showcase-card">
          <div className="lead-showcase-copy">
            <div className="lead-showcase-brand">
              <span className="lead-showcase-brand-mark" aria-hidden="true">
                <Image alt="" height={13} src="/images/vozon-footer-v.svg" width={13} />
              </span>
              <span>Vozon Platform</span>
            </div>

            <h2 id="lead-conversion-title">
              One agentic core.<br />Built for Voice &amp; WhatsApp.
            </h2>

            <p className="lead-showcase-tagline">
              Monitor live calls, inspect agentic workflows, and act on every customer conversation from one unified workspace.
            </p>

            <ul className="lead-showcase-list">
              {highlights.map((item) => (
                <li key={item}>
                  <span className="lead-showcase-check" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="m3.5 8.2 3 3 6-6.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="lead-showcase-badges">
              <Link className="lead-showcase-pill" href="/dashboard">
                Launch Agentic Workspace ↗
              </Link>
            </div>
          </div>

          <div className="lead-showcase-visual">
            <Image
              alt="Vozon WhatsApp Business chatbot and Voice AI Agent mobile preview"
              className="lead-showcase-image"
              height={1136}
              src="/images/vozon-showcase-phones-v4.jpg"
              width={1024}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
