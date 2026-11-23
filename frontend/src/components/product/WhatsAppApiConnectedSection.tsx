import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentConnectedSection.css";

const integrations = [
  { name: "WhatsApp", icon: "/images/integrations/whatsapp.svg" },
  { name: "Shopify", icon: "/images/company-logos/shopify.svg" },
  { name: "Salesforce", icon: "/images/integrations/salesforce.svg" },
  { name: "HubSpot", icon: "/images/company-logos/hubspot.svg" },
] as const;

export function WhatsAppApiConnectedSection() {
  return (
    <section className="vc-connections" aria-labelledby="wa-api-connections-title">
      <div className="hcr-wrap">
        <div className="vc-connections-heading">
          <span>ONE CHANNEL, CONNECTED TO YOUR SYSTEMS</span>
          <h2 id="wa-api-connections-title">Make every message part of the wider journey.</h2>
          <p>
            Connect WhatsApp events to your voice agents, business tools, and support team so context travels with the customer.
          </p>
        </div>

        <div className="vc-connection-stack">
          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>01 / AFTER-CALL CONTINUITY</span>
              <h3>Follow a voice call with a message</h3>
              <p>
                When a caller books a time or asks for written details, trigger an approved WhatsApp follow-up automatically from the call outcome.
              </p>
              <div className="vc-connection-note">
                <Icon name="bolt" /> Spoken agreement becomes a written confirmation.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-tools-visual"
              role="img"
              aria-label="Call outcome triggers WhatsApp template and updates CRM"
            >
              <div className="vc-tool-entry">
                <span><Icon name="phone" /></span>
                <div>
                  <small>CALL OUTCOME</small>
                  <strong>“Send me the appointment details on WhatsApp.”</strong>
                </div>
              </div>
              <div className="vc-tool-flow">
                <div>
                  <span><Icon name="webhook" /></span>
                  <strong>Call Webhook</strong>
                  <small>Outcome captured</small>
                </div>
                <i />
                <div>
                  <span><Icon name="message" /></span>
                  <strong>WhatsApp API</strong>
                  <small>Template sent</small>
                </div>
                <i />
                <div>
                  <span><Icon name="database" /></span>
                  <strong>CRM Record</strong>
                  <small>Status logged</small>
                </div>
              </div>
              <div className="vc-tool-outcome">
                <Icon name="check" /> Confirmation delivered & recorded
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>02 / TWO-WAY ROUTING</span>
              <h3>Turn inbound replies into guided conversations</h3>
              <p>
                When a customer replies to an update or sends a new enquiry, route the webhook event to a Vozon bot or specialist with the full history.
              </p>
              <div className="vc-connection-note">
                <Icon name="branch" /> One continuous thread across notifications and support.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-knowledge-visual"
              role="img"
              aria-label="Customer reply routed to bot and support team"
            >
              <div className="vc-knowledge-question">
                <span><Icon name="message" /></span>
                <div>
                  <small>INBOUND WHATSAPP EVENT</small>
                  <strong>“Can I move my Friday delivery to Monday morning?”</strong>
                </div>
              </div>
              <div className="vc-knowledge-source">
                <div>
                  <Icon name="spark" />
                  <span>
                    <strong>Vozon Bot</strong>
                    <small>Checks delivery slots</small>
                  </span>
                </div>
                <div>
                  <Icon name="headset" />
                  <span>
                    <strong>Team Handoff</strong>
                    <small>Full thread attached</small>
                  </span>
                </div>
              </div>
              <div className="vc-knowledge-answer">
                <Icon name="check" />
                <span>
                  <small>ROUTE COMPLETE</small>
                  <strong>Monday slot confirmed in the same chat.</strong>
                </span>
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>03 / BUSINESS INTEGRATIONS</span>
              <h3>Keep customer records in sync</h3>
              <p>
                Connect your WhatsApp channel with the store, CRM, and workflow tools your team already relies on every day.
              </p>
              <div className="vc-connection-note">
                <Icon name="shield" /> Governed by your messaging permissions and rules.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-telephony-visual"
              role="img"
              aria-label="WhatsApp API connected to business systems"
            >
              <div className="vc-phone-route">
                <div>
                  <span><Icon name="message" /></span>
                  <strong>WhatsApp Channel</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="spark" /></span>
                  <strong>Vozon API</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="users" /></span>
                  <strong>Your Systems</strong>
                </div>
              </div>
              <div className="vc-provider-label">CONNECT WITH YOUR STACK</div>
              <div className="vc-provider-grid">
                {integrations.map((item) => (
                  <div key={item.name}>
                    <Image alt="" src={item.icon} width={18} height={18} />
                    <strong>{item.name}</strong>
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
