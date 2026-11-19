import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentConnectedSection.css";

const e2eProviders = [
  { name: "WhatsApp", icon: "/images/integrations/whatsapp.svg" },
  { name: "Google Calendar", icon: "/images/integrations/google-calendar.svg" },
  { name: "Salesforce", icon: "/images/integrations/salesforce.svg" },
  { name: "Slack", icon: "/images/integrations/slack.svg" },
] as const;

export function EndToEndAutomationConnectedSection() {
  return (
    <section className="vc-connections" aria-labelledby="e2e-connections-title">
      <div className="hcr-wrap">
        <div className="vc-connections-heading">
          <span>ONE JOURNEY, CONNECTED END TO END</span>
          <h2 id="e2e-connections-title">Carry context from the first hello to the final action.</h2>
          <p>
            Use Vozon agents and workflows together so customers experience fewer dead ends and your team receives a clear record.
          </p>
        </div>

        <div className="vc-connection-stack">
          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>01 / LEAD TO MEETING</span>
              <h3>Respond, qualify, and confirm in one flow</h3>
              <p>
                A new enquiry can start a conversation, the agent can understand what the customer needs, and the workflow can prepare the booked next step.
              </p>
              <div className="vc-connection-note">
                <Icon name="calendar" /> From first interest to a confirmed slot.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-tools-visual"
              role="img"
              aria-label="New enquiry leads to voice qualification, calendar booking, and WhatsApp confirmation"
            >
              <div className="vc-tool-entry">
                <span><Icon name="globe" /></span>
                <div>
                  <small>NEW ENQUIRY</small>
                  <strong>“We want to set up voice and WhatsApp for 12 teammates.”</strong>
                </div>
              </div>
              <div className="vc-tool-flow">
                <div>
                  <span><Icon name="phone" /></span>
                  <strong>Qualify</strong>
                  <small>Voice Agent</small>
                </div>
                <i />
                <div>
                  <span><Icon name="calendar" /></span>
                  <strong>Book Time</strong>
                  <small>Calendar</small>
                </div>
                <i />
                <div>
                  <span><Icon name="message" /></span>
                  <strong>Confirm</strong>
                  <small>WhatsApp</small>
                </div>
              </div>
              <div className="vc-tool-outcome">
                <Icon name="check" /> Wednesday · 2:30 PM confirmed & logged in CRM
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>02 / SHARED CONTEXT</span>
              <h3>No copying details between channels</h3>
              <p>
                Keep the intent, collected answers, and tool results attached as the conversation moves from a call to a message or a person.
              </p>
              <div className="vc-connection-note">
                <Icon name="layers" /> Context travels with the customer.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-knowledge-visual"
              role="img"
              aria-label="Context carried across voice, tools, and team handoff"
            >
              <div className="vc-knowledge-question">
                <span><Icon name="phone" /></span>
                <div>
                  <small>CONVERSATION RECORD</small>
                  <strong>Order #2048 · Delivery address update requested</strong>
                </div>
              </div>
              <div className="vc-knowledge-source">
                <div>
                  <Icon name="database" />
                  <span>
                    <strong>Order verified</strong>
                    <small>Store lookup</small>
                  </span>
                </div>
                <div>
                  <Icon name="headset" />
                  <span>
                    <strong>Team handoff</strong>
                    <small>Summary included</small>
                  </span>
                </div>
              </div>
              <div className="vc-knowledge-answer">
                <Icon name="spark" />
                <span>
                  <small>CLEAR RESPONSIBILITY</small>
                  <strong>Your team acts immediately without asking again.</strong>
                </span>
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>03 / HUMAN IN THE LOOP</span>
              <h3>Keep people where judgment matters</h3>
              <p>
                Include human review and warm handoffs wherever a decision needs a specialist or falls outside the agent&apos;s scope.
              </p>
              <div className="vc-connection-note">
                <Icon name="users" /> Automation and human oversight working together.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-telephony-visual"
              role="img"
              aria-label="End-to-end journey connecting channels, workflows, and teams"
            >
              <div className="vc-phone-route">
                <div>
                  <span><Icon name="phone" /></span>
                  <strong>Customer Channel</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="layers" /></span>
                  <strong>Vozon Journey</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="headset" /></span>
                  <strong>Your Team</strong>
                </div>
              </div>
              <div className="vc-provider-label">CONNECTED ACROSS YOUR BUSINESS TOOLS</div>
              <div className="vc-provider-grid">
                {e2eProviders.map((provider) => (
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
