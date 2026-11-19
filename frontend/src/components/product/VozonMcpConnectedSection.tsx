import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentConnectedSection.css";

const mcpProviders = [
  { name: "Salesforce", icon: "/images/integrations/salesforce.svg" },
  { name: "HubSpot", icon: "/images/company-logos/hubspot.svg" },
  { name: "Google Calendar", icon: "/images/integrations/google-calendar.svg" },
  { name: "Custom API", icon: "/images/integrations/custom-api.svg" },
] as const;

export function VozonMcpConnectedSection() {
  return (
    <section className="vc-connections" aria-labelledby="vozon-mcp-connections-title">
      <div className="hcr-wrap">
        <div className="vc-connections-heading">
          <span>ONE PROTOCOL, CONNECTED TO YOUR TOOLS</span>
          <h2 id="vozon-mcp-connections-title">From a customer request to a verified action.</h2>
          <p>
            Give your agent a safe, structured bridge to look up information, update records, and trigger workflows.
          </p>
        </div>

        <div className="vc-connection-stack">
          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>01 / LOOK UP CONTEXT</span>
              <h3>Check details while the conversation moves</h3>
              <p>
                Retrieve approved customer, order, or booking details during the call so the customer does not have to repeat what your systems already know.
              </p>
              <div className="vc-connection-note">
                <Icon name="database" /> Real-time lookup within your access rules.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-tools-visual"
              role="img"
              aria-label="Caller question triggers MCP lookup, access rule check, and verified response"
            >
              <div className="vc-tool-entry">
                <span><Icon name="phone" /></span>
                <div>
                  <small>CALLER REQUEST</small>
                  <strong>“Can you check the status of my order #2048?”</strong>
                </div>
              </div>
              <div className="vc-tool-flow">
                <div>
                  <span><Icon name="cpu" /></span>
                  <strong>MCP Lookup</strong>
                  <small>Order #2048</small>
                </div>
                <i />
                <div>
                  <span><Icon name="shield" /></span>
                  <strong>Access Rule</strong>
                  <small>Read-only</small>
                </div>
                <i />
                <div>
                  <span><Icon name="message" /></span>
                  <strong>Agent Reply</strong>
                  <small>Status shared</small>
                </div>
              </div>
              <div className="vc-tool-outcome">
                <Icon name="check" /> Arriving Friday before 4:00 PM confirmed
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>02 / SCOPED BOUNDARIES</span>
              <h3>Control what the agent may access and do</h3>
              <p>
                Define allowed tools, read/write permissions, and human review gates for each use case before putting an action into production.
              </p>
              <div className="vc-connection-note">
                <Icon name="shield" /> Every action stays inside your team&apos;s rules.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-knowledge-visual"
              role="img"
              aria-label="MCP permission rules and approval gates"
            >
              <div className="vc-knowledge-question">
                <span><Icon name="shield" /></span>
                <div>
                  <small>TOOL GOVERNANCE</small>
                  <strong>“Book Wednesday at 2:30 PM on the sales calendar”</strong>
                </div>
              </div>
              <div className="vc-knowledge-source">
                <div>
                  <Icon name="calendar" />
                  <span>
                    <strong>Allowed scope</strong>
                    <small>Sales booking slots</small>
                  </span>
                </div>
                <div>
                  <Icon name="users" />
                  <span>
                    <strong>Review rule</strong>
                    <small>Exceptions to team</small>
                  </span>
                </div>
              </div>
              <div className="vc-knowledge-answer">
                <Icon name="spark" />
                <span>
                  <small>VERIFIED ACTION</small>
                  <strong>Slot reserved and summary logged.</strong>
                </span>
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>03 / CONNECTED SYSTEMS</span>
              <h3>Use the business systems you already run</h3>
              <p>
                Connect calendars, CRMs, helpdesks, and internal APIs through a consistent protocol interface.
              </p>
              <div className="vc-connection-note">
                <Icon name="branch" /> One interface across voice, chat, and workflows.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-telephony-visual"
              role="img"
              aria-label="Vozon MCP connecting agents to business tools"
            >
              <div className="vc-phone-route">
                <div>
                  <span><Icon name="phone" /></span>
                  <strong>Vozon Agent</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="cpu" /></span>
                  <strong>Vozon MCP</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="database" /></span>
                  <strong>Your Tools</strong>
                </div>
              </div>
              <div className="vc-provider-label">CONNECT THE TOOLS YOU USE</div>
              <div className="vc-provider-grid">
                {mcpProviders.map((provider) => (
                  <div key={provider.name}>
                    <Image alt="" src={provider.icon} width={18} height={18} />
                    <strong>{provider.name}</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
