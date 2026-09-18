"use client";

import styles from "./EnterpriseArchitectureSection.module.css";

const pipelineSteps = [
  {
    num: "01",
    title: "Streaming ASR",
    speed: "~90ms",
    desc: "Realtime phoneme recognition with background noise filtration and accent adaptation.",
  },
  {
    num: "02",
    title: "LLM Reasoning",
    speed: "~160ms",
    desc: "First-token time-to-first-byte (TTFT) response with dynamic intent & guardrails check.",
  },
  {
    num: "03",
    title: "Zero-Latency TTS",
    speed: "~95ms",
    desc: "Expressive neural voice synthesis chunked directly into streaming audio buffers.",
  },
  {
    num: "04",
    title: "WebRTC Transport",
    speed: "~35ms",
    desc: "Sub-50ms ultra-reliable audio packet delivery over distributed LiveKit global edge nodes.",
  },
];

const telephonyProviders = [
  "Twilio",
  "Exotel",
  "Plivo",
  "Vonage",
  "Tata Tele",
  "SIP Trunking",
  "WebRTC In-App",
];

const crmIntegrations = [
  "Salesforce",
  "HubSpot",
  "Zendesk",
  "Zoho CRM",
  "LeadSquared",
  "Intercom",
  "Custom Webhooks",
];

export function EnterpriseArchitectureSection() {
  return (
    <section id="enterprise-architecture" className={styles.architectureSection} aria-labelledby="architecture-title">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Enterprise Voice Engine</span>
          <h2 id="architecture-title" className={styles.title}>
            Built For Sub-Second Latency &amp; Massive Concurrency.
          </h2>
          <p className={styles.subtitle}>
            Traditional phone bots make callers wait 2–4 seconds between sentences. 
            Vozon’s distributed streaming audio pipeline responds in under 400ms—faster than human conversational reaction time.
          </p>
        </div>

        {/* Latency Pipeline Breakdown */}
        <div className={styles.pipelineCard}>
          <div className={styles.pipelineTitleRow}>
            <div>
              <h3>Real-Time Streaming Voice Pipeline</h3>
              <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
                Optimized from microphone packet to caller speaker with zero buffering delay.
              </p>
            </div>
            <div className={styles.totalBadge}>
              <span>⚡ Total End-to-End: &lt;380ms Avg</span>
            </div>
          </div>

          <div className={styles.pipelineGrid}>
            {pipelineSteps.map((step) => (
              <div key={step.num} className={styles.stepCard}>
                <span className={styles.stepNum}>STEP {step.num}</span>
                <h4 className={styles.stepHeader}>{step.title}</h4>
                <span className={styles.stepSpeed}>{step.speed}</span>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        <div className={styles.integrationsGrid}>
          <div className={styles.integrationBox}>
            <h4>
              <span className={styles.boxIcon}>📞</span>
              <span>Telephony &amp; Carrier Stack</span>
            </h4>
            <p>
              Connect your existing phone numbers, bring your own SIP trunks, or purchase local Indian &amp; international virtual numbers in minutes.
            </p>
            <div className={styles.pillsRow}>
              {telephonyProviders.map((tel) => (
                <span key={tel} className={styles.pillTag}>{tel}</span>
              ))}
            </div>
          </div>

          <div className={styles.integrationBox}>
            <h4>
              <span className={styles.boxIcon}>⚡</span>
              <span>CRM &amp; Workflow Automations</span>
            </h4>
            <p>
              Bi-directional sync pushes caller data, recording transcripts, sentiment scores, and booked appointments directly into your business tools.
            </p>
            <div className={styles.pillsRow}>
              {crmIntegrations.map((crm) => (
                <span key={crm} className={styles.pillTag}>{crm}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Comparison Stats */}
        <div className={styles.comparisonStrip}>
          <div className={styles.metricStat}>
            <div className={styles.metricVal}>&lt;400ms</div>
            <div className={styles.metricLabel}>Real-Time Latency</div>
            <div className={styles.metricSub}>Indistinguishable from human interaction</div>
          </div>

          <div className={styles.metricStat}>
            <div className={styles.metricVal}>10,000+</div>
            <div className={styles.metricLabel}>Concurrent Line Capacity</div>
            <div className={styles.metricSub}>Never send a customer to a busy signal again</div>
          </div>

          <div className={styles.metricStat}>
            <div className={styles.metricVal}>80%</div>
            <div className={styles.metricLabel}>Cost Reduction</div>
            <div className={styles.metricSub}>Compared to traditional human call centers</div>
          </div>
        </div>
      </div>
    </section>
  );
}
