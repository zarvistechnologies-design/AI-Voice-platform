import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentConnectedSection.css";

const canvasTools = [
  { name: "Google Calendar", icon: "/images/integrations/google-calendar.svg" },
  { name: "WhatsApp", icon: "/images/integrations/whatsapp.svg" },
  { name: "Salesforce", icon: "/images/integrations/salesforce.svg" },
  { name: "Slack", icon: "/images/integrations/slack.svg" },
] as const;

export function CreateWorkflowsConnectedSection() {
  return (
    <section className="vc-connections" aria-labelledby="create-wf-connections-title">
      <div className="hcr-wrap">
        <div className="vc-connections-heading">
          <span>ONE CANVAS, SHARED BY YOUR TEAM</span>
          <h2 id="create-wf-connections-title">See how every branch works before you launch.</h2>
          <p>
            Give your team a clear, shared picture of what the agent handles automatically and what still routes to a person.
          </p>
        </div>

        <div className="vc-connection-stack">
          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>01 / VISUAL FLOW</span>
              <h3>From trigger to outcome on one screen</h3>
              <p>
                Connect your starting event, AI conversation, and follow-up actions visually so everyone can trace how a request moves forward.
              </p>
              <div className="vc-connection-note">
                <Icon name="grid" /> Every step and branch stays visible.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-tools-visual"
              role="img"
              aria-label="Visual workflow builder connecting trigger, agent, and outcome"
            >
              <div className="vc-tool-entry">
                <span><Icon name="bolt" /></span>
                <div>
                  <small>STARTING TRIGGER</small>
                  <strong>“New lead enquiry submitted on your website”</strong>
                </div>
              </div>
              <div className="vc-tool-flow">
                <div>
                  <span><Icon name="phone" /></span>
                  <strong>Voice Step</strong>
                  <small>Qualify lead</small>
                </div>
                <i />
                <div>
                  <span><Icon name="branch" /></span>
                  <strong>Branch</strong>
                  <small>Check outcome</small>
                </div>
                <i />
                <div>
                  <span><Icon name="calendar" /></span>
                  <strong>Next Action</strong>
                  <small>Book & notify</small>
                </div>
              </div>
              <div className="vc-tool-outcome">
                <Icon name="check" /> Workflow ready for customer calls
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>02 / TEST & REVIEW</span>
              <h3>Check every branch before going live</h3>
              <p>
                Review what happens when a caller books a slot, asks for a callback, or needs a human specialist so there are no dead ends.
              </p>
              <div className="vc-connection-note">
                <Icon name="play" /> Test with your team before using with customers.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-knowledge-visual"
              role="img"
              aria-label="Pre-launch branch testing and review"
            >
              <div className="vc-knowledge-question">
                <span><Icon name="play" /></span>
                <div>
                  <small>PRE-LAUNCH REVIEW</small>
                  <strong>Test both routine bookings and specialist escalations</strong>
                </div>
              </div>
              <div className="vc-knowledge-source">
                <div>
                  <Icon name="calendar" />
                  <span>
                    <strong>Booking path</strong>
                    <small>Confirmed & logged</small>
                  </span>
                </div>
                <div>
                  <Icon name="headset" />
                  <span>
                    <strong>Escalation path</strong>
                    <small>Summary attached</small>
                  </span>
                </div>
              </div>
              <div className="vc-knowledge-answer">
                <Icon name="spark" />
                <span>
                  <small>VERIFIED SETUP</small>
                  <strong>Every branch leads to a clear, owned next step.</strong>
                </span>
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>03 / CONNECTED OUTCOMES</span>
              <h3>Plug outcomes directly into your tools</h3>
              <p>
                Link each branch on the canvas to your calendar, WhatsApp channel, CRM, or team notifications.
              </p>
              <div className="vc-connection-note">
                <Icon name="branch" /> Built to fit the way your team already works.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-telephony-visual"
              role="img"
              aria-label="Canvas branches connected to business tools"
            >
              <div className="vc-phone-route">
                <div>
                  <span><Icon name="grid" /></span>
                  <strong>Canvas Node</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="spark" /></span>
                  <strong>Vozon Builder</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="users" /></span>
                  <strong>Your Systems</strong>
                </div>
              </div>
              <div className="vc-provider-label">CONNECT OUTCOMES TO YOUR TOOLS</div>
              <div className="vc-provider-grid">
                {canvasTools.map((tool) => (
                  <div key={tool.name}>
                    <Image alt="" src={tool.icon} width={18} height={18} />
                    <strong>{tool.name}</strong>
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
