import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentConnectedSection.css";

const workflowProviders = [
  { name: "WhatsApp", icon: "/images/integrations/whatsapp.svg" },
  { name: "Google Calendar", icon: "/images/integrations/google-calendar.svg" },
  { name: "Slack", icon: "/images/integrations/slack.svg" },
  { name: "HubSpot", icon: "/images/company-logos/hubspot.svg" },
] as const;

export function WorkflowsConnectedSection() {
  return (
    <section className="vc-connections" aria-labelledby="workflows-connections-title">
      <div className="hcr-wrap">
        <div className="vc-connections-heading">
          <span>ONE WORKFLOW, ACROSS CHANNELS AND TEAMS</span>
          <h2 id="workflows-connections-title">From the end of a call to the next action.</h2>
          <p>
            Link your voice and messaging conversations to the calendars, messages, and team handoffs that move the request forward.
          </p>
        </div>

        <div className="vc-connection-stack">
          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>01 / QUALIFY & BOOK</span>
              <h3>Carry a qualified call into a confirmed slot</h3>
              <p>
                When an agent qualifies a lead on a call, the workflow books the time, sends a WhatsApp confirmation, and updates your sales team.
              </p>
              <div className="vc-connection-note">
                <Icon name="calendar" /> One conversation triggers the complete booking flow.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-tools-visual"
              role="img"
              aria-label="Qualified call triggers calendar booking, WhatsApp confirmation, and sales update"
            >
              <div className="vc-tool-entry">
                <span><Icon name="phone" /></span>
                <div>
                  <small>QUALIFIED CALL</small>
                  <strong>“We need a 12-person plan starting next month.”</strong>
                </div>
              </div>
              <div className="vc-tool-flow">
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
                <i />
                <div>
                  <span><Icon name="users" /></span>
                  <strong>Share</strong>
                  <small>Sales Team</small>
                </div>
              </div>
              <div className="vc-tool-outcome">
                <Icon name="check" /> Meeting booked & summary sent to sales
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>02 / CONDITIONAL BRANCHING</span>
              <h3>Different outcomes follow different paths</h3>
              <p>
                Set clear branches so a booked meeting, a callback request, and a complex support case each trigger the right follow-up.
              </p>
              <div className="vc-connection-note">
                <Icon name="branch" /> Every result has a defined owner and next step.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-knowledge-visual"
              role="img"
              aria-label="Conversation outcome branches into booking or specialist handoff"
            >
              <div className="vc-knowledge-question">
                <span><Icon name="branch" /></span>
                <div>
                  <small>OUTCOME DECISION</small>
                  <strong>Evaluate call result and customer preference</strong>
                </div>
              </div>
              <div className="vc-knowledge-source">
                <div>
                  <Icon name="calendar" />
                  <span>
                    <strong>Time chosen</strong>
                    <small>Send booking pass</small>
                  </span>
                </div>
                <div>
                  <Icon name="headset" />
                  <span>
                    <strong>Needs specialist</strong>
                    <small>Route with summary</small>
                  </span>
                </div>
              </div>
              <div className="vc-knowledge-answer">
                <Icon name="spark" />
                <span>
                  <small>RIGHT PATH SELECTED</small>
                  <strong>No conversation ends without a clear next step.</strong>
                </span>
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>03 / TEAM & TOOL SYNC</span>
              <h3>Keep your channels and systems aligned</h3>
              <p>
                Connect voice, WhatsApp, calendars, and team notifications so everyone works from the same conversation result.
              </p>
              <div className="vc-connection-note">
                <Icon name="bolt" /> Connected across the tools your team already uses.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-telephony-visual"
              role="img"
              aria-label="Workflow routing across channels and tools"
            >
              <div className="vc-phone-route">
                <div>
                  <span><Icon name="bolt" /></span>
                  <strong>Trigger Event</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="branch" /></span>
                  <strong>Vozon Workflow</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="users" /></span>
                  <strong>Next Action</strong>
                </div>
              </div>
              <div className="vc-provider-label">CONNECT CHANNELS & WORKSPACE TOOLS</div>
              <div className="vc-provider-grid">
                {workflowProviders.map((provider) => (
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
