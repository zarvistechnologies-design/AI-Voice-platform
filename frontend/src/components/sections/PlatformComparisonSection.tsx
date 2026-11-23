import "./PlatformComparisonSection.css";

type CellValue = "Yes" | "No" | "Limited";

const comparisonRows: {
  feature: string;
  cpaas: CellValue;
  pointBots: CellValue;
  vozon: CellValue;
}[] = [
  {
    feature: "AI-Optimized Low-Latency Voice",
    cpaas: "No",
    pointBots: "Limited",
    vozon: "Yes",
  },
  {
    feature: "Native Voice AI + WhatsApp + Web Chat",
    cpaas: "No",
    pointBots: "No",
    vozon: "Yes",
  },
  {
    feature: "Autonomous Agentic Tool Calling & APIs",
    cpaas: "No",
    pointBots: "Limited",
    vozon: "Yes",
  },
  {
    feature: "Real-Time Audio Streaming & Barge-In",
    cpaas: "Yes",
    pointBots: "Limited",
    vozon: "Yes",
  },
  {
    feature: "22+ Indic & 76 Global Languages",
    cpaas: "No",
    pointBots: "Limited",
    vozon: "Yes",
  },
  {
    feature: "End-to-End Agentic Workflow Builder",
    cpaas: "No",
    pointBots: "No",
    vozon: "Yes",
  },
  {
    feature: "India + International Numbers, One Platform",
    cpaas: "No",
    pointBots: "No",
    vozon: "Yes",
  },
  {
    feature: "Embeddable Multi-Tenant API & White-Label",
    cpaas: "No",
    pointBots: "No",
    vozon: "Yes",
  },
  {
    feature: "Live Call & Tool-Call Observability",
    cpaas: "No",
    pointBots: "Limited",
    vozon: "Yes",
  },
  {
    feature: "Compliance by Design (SOC 2, ISO 27001, Private Cloud)",
    cpaas: "Limited",
    pointBots: "No",
    vozon: "Yes",
  },
];

function StatusCell({ value, highlight = false }: { value: CellValue; highlight?: boolean }) {
  if (value === "Yes") {
    return (
      <span className={`compare-badge ${highlight ? "is-vozon-yes" : "is-yes"}`}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m3.5 8.2 3 3 6-6.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Yes
      </span>
    );
  }
  if (value === "Limited") {
    return (
      <span className="compare-badge is-partial">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 8h8" strokeLinecap="round" />
        </svg>
        Limited
      </span>
    );
  }
  return (
    <span className="compare-badge is-no">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="m4.5 4.5 7 7m0-7-7 7" strokeLinecap="round" />
      </svg>
      No
    </span>
  );
}

export function PlatformComparisonSection() {
  return (
    <section className="platform-comparison" aria-labelledby="platform-comparison-title">
      <div className="platform-comparison-inner">
        <div className="platform-comparison-header">
          <span className="platform-comparison-eyebrow">PLATFORM COMPARISON</span>
          <h2 id="platform-comparison-title">
            Built for the agentic Voice AI era
          </h2>
          <p>
            Autonomous voice, WhatsApp, and live tool execution—not bolted-on legacy telephony.
          </p>
        </div>

        <div className="platform-comparison-card">
          <div className="platform-comparison-scroll">
            <table className="platform-comparison-table" aria-label="Feature comparison of CPaaS, single-channel bot tools, and Vozon">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">CPaaS &amp; Local Telcos</th>
                  <th scope="col">Single-Channel Bot Tools</th>
                  <th scope="col" className="is-vozon">Vozon</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature}>
                    <td className="is-feature">{row.feature}</td>
                    <td>
                      <StatusCell value={row.cpaas} />
                    </td>
                    <td>
                      <StatusCell value={row.pointBots} />
                    </td>
                    <td className="is-vozon">
                      <StatusCell value={row.vozon} highlight />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
