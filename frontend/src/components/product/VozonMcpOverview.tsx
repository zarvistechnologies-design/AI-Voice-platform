import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentOverview.css";

const features = [
  {
    icon: "cpu" as const,
    title: "Structured tool interface",
    body: "Use Model Context Protocol to give your agent a clean, defined way to discover and use approved business tools.",
  },
  {
    icon: "shield" as const,
    title: "Scoped access boundaries",
    body: "Decide exactly which fields an agent may read, which actions it can run, and when a person must approve.",
  },
  {
    icon: "database" as const,
    title: "Current business context",
    body: "Look up booking availability, order status, or account details during the conversation instead of relying on static scripts.",
  },
  {
    icon: "activity" as const,
    title: "Traceable tool outcomes",
    body: "Keep every tool lookup and action visible so your team can review what happened and why.",
  },
];

const mcpConnectors = [
  { name: "Salesforce", icon: "/images/integrations/salesforce.svg" },
  { name: "Google Calendar", icon: "/images/integrations/google-calendar.svg" },
  { name: "HubSpot", icon: "/images/company-logos/hubspot.svg" },
  { name: "Shopify", icon: "/images/company-logos/shopify.svg" },
  { name: "Slack", icon: "/images/integrations/slack.svg" },
  { name: "Custom API", icon: "/images/integrations/custom-api.svg" },
] as const;

export function VozonMcpOverview() {
  return (
    <div className="vc-overview">
      <section className="vc-features hcr-wrap" aria-labelledby="vozon-mcp-features-title">
        <span className="vc-overview-kicker">BUILT FOR CONNECTED AGENT ACTIONS</span>
        <h2 id="vozon-mcp-features-title">Let your agent look up context and take approved steps.</h2>
        <div className="vc-feature-grid">
          {features.map((feature) => (
            <article key={feature.title}>
              <Icon name={feature.icon} />
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="vc-deploy hcr-wrap" aria-labelledby="vozon-mcp-deploy-title">
        <span className="vc-overview-kicker">FROM TOOL SELECTION TO LIVE CONVERSATIONS</span>
        <h2 id="vozon-mcp-deploy-title">Connect a tool in three steps.</h2>
        <div className="vc-deploy-grid">
          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-template-visual" aria-hidden="true">
              <div className="vc-template-row is-current">
                <span className="vc-template-symbol"><Icon name="calendar" /></span>
                <div>
                  <strong>Calendar availability & booking</strong>
                  <small>Read open slots & confirm times</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="database" /></span>
                <div>
                  <strong>Customer & order lookup</strong>
                  <small>Fetch approved account status</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="users" /></span>
                <div>
                  <strong>Record & team handoff</strong>
                  <small>Send summary to CRM or Slack</small>
                </div>
                <i>↗</i>
              </div>
            </div>
            <h3>Choose a tool</h3>
            <p>Identify the specific lookup or action your agent needs during a call or chat.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-language-visual" aria-hidden="true">
              <div className="vc-language-top">
                <span>ACCESS RULES</span>
                <i />
                <span>APPROVALS</span>
              </div>
              <div className="vc-language-chips">
                <span>Read-Only Lookup</span>
                <span>Scoped Fields</span>
                <span>Booking Window</span>
                <span>Human Review Gate</span>
                <span>Audit Logged</span>
                <span>Safe Fallback</span>
              </div>
              <small>Start with a narrow action and review before expanding.</small>
            </div>
            <h3>Set clear boundaries</h3>
            <p>Define what the agent may access automatically and which requests require a person.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-apps-visual" aria-hidden="true">
              <div className="vc-app-icons">
                {mcpConnectors.map((item) => (
                  <span key={item.name} title={item.name}>
                    <Image src={item.icon} alt="" width={27} height={27} />
                  </span>
                ))}
              </div>
              <div className="vc-apps-caption">APPROVED MCP CONNECTORS</div>
            </div>
            <h3>Use the result</h3>
            <p>Bring the tool response straight back into the conversation or pass it to the next workflow step.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
