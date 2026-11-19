import "./EnterpriseScaleSection.css";

type IconName = "calls" | "uptime" | "coverage" | "indic" | "global" | "insights" | "api";

const metrics: { label: string; value: string; icon: IconName }[] = [
  { label: "Daily calling minutes", value: "1 lakh+", icon: "calls" },
  { label: "Platform uptime", value: "99.9%", icon: "uptime" },
  { label: "Call coverage", value: "24/7", icon: "coverage" },
  { label: "Indic languages", value: "22+", icon: "indic" },
  { label: "Global languages", value: "76", icon: "global" },
  { label: "Conversation insights", value: "Live", icon: "insights" },
  { label: "Workflow connections", value: "API", icon: "api" },
];

function MetricIcon({ name }: { name: IconName }) {
  const paths = {
    calls: <><path d="M5.2 3.8 8 6.5 6.6 9c1.6 3.4 3.9 5.7 7.4 7.4l2.5-1.4 2.7 2.8-1.4 2.2c-.6.8-1.7 1.1-2.7.8C9.7 19.1 4.9 14.3 3.2 8.8c-.3-1 .1-2.1.8-2.7l1.2-2.3Z" /><path d="M13.8 4.5c2.5.4 4.4 2.3 4.8 4.8M13.9 1.8c4 .5 7.1 3.6 7.6 7.6" /></>,
    uptime: <><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="m8 12.2 2.5 2.5 5.5-5.6" /></>,
    coverage: <><circle cx="12" cy="12" r="8.5" /><path d="M12 6.5V12l3.5 2M12 1v2M21 12h2" /></>,
    indic: <><path d="M4 6.5h16M8 6.5v11M16 6.5v11M5 17.5h14" /><path d="M11.5 9.5c.3 2.2 1.5 3.9 4.5 4.8" /></>,
    global: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c-2.5 2.5-3.7 5.5-3.7 9s1.2 6.5 3.7 9M12 3c2.5 2.5 3.7 5.5 3.7 9S14.5 18.5 12 21" /></>,
    insights: <><path d="M3 19.5h18M4.5 16l4.4-5 3.2 2.7 6.9-7.3" /><path d="M15.5 6.4H19v3.5" /></>,
    api: <><path d="m8 5-6 7 6 7m8-14 6 7-6 7M14.5 3l-5 18" /></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function EnterpriseScaleSection() {
  return (
    <section className="enterprise-scale" aria-labelledby="enterprise-scale-title">
      <div className="enterprise-scale-inner">
        <div className="enterprise-scale-heading">
          <span className="enterprise-scale-eyebrow">VOZON VOICE &amp; AGENTIC PLATFORM</span>
          <h2 id="enterprise-scale-title">Built for enterprise scale.</h2>
          <p>High-volume voice calling, instant WhatsApp automation, and autonomous workflows running 24/7.</p>
        </div>
        <div className="enterprise-scale-grid" aria-label="Vozon platform highlights">
          {metrics.map((metric) => (
            <div className="enterprise-scale-metric" key={metric.label}>
              <MetricIcon name={metric.icon} />
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
