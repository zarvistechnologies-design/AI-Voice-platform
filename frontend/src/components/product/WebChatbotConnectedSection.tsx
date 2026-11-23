import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentConnectedSection.css";

const webTools = [
  { name: "HubSpot", icon: "/images/company-logos/hubspot.svg" },
  { name: "Salesforce", icon: "/images/integrations/salesforce.svg" },
  { name: "Slack", icon: "/images/integrations/slack.svg" },
  { name: "Zendesk", icon: "/images/company-logos/zendesk.svg" },
] as const;

export function WebChatbotConnectedSection() {
  return (
    <section className="vc-connections" aria-labelledby="web-chat-connections-title">
      <div className="hcr-wrap">
        <div className="vc-connections-heading">
          <span>ONE WIDGET, CONNECTED TO YOUR TEAM</span>
          <h2 id="web-chat-connections-title">From a website question to a clear next step.</h2>
          <p>
            Give your website chatbot approved knowledge, calendar access, and a clean handoff path to your sales and support teams.
          </p>
        </div>

        <div className="vc-connection-stack">
          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>01 / QUALIFY & BOOK</span>
              <h3>Turn visitor interest into a meeting</h3>
              <p>
                Instead of sending everyone to a static form, let the chatbot understand what they need, capture key details, and offer an available slot.
              </p>
              <div className="vc-connection-note">
                <Icon name="calendar" /> A helpful conversation before the handoff.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-tools-visual"
              role="img"
              aria-label="Website visitor question leads to qualification, calendar booking, and CRM record"
            >
              <div className="vc-tool-entry">
                <span><Icon name="globe" /></span>
                <div>
                  <small>WEBSITE VISITOR</small>
                  <strong>“Can we schedule a walkthrough for our 15-person team?”</strong>
                </div>
              </div>
              <div className="vc-tool-flow">
                <div>
                  <span><Icon name="message" /></span>
                  <strong>Qualify</strong>
                  <small>Team & timing</small>
                </div>
                <i />
                <div>
                  <span><Icon name="calendar" /></span>
                  <strong>Book Slot</strong>
                  <small>Calendar</small>
                </div>
                <i />
                <div>
                  <span><Icon name="users" /></span>
                  <strong>Notify Team</strong>
                  <small>CRM & Slack</small>
                </div>
              </div>
              <div className="vc-tool-outcome">
                <Icon name="check" /> Walkthrough booked for Wednesday at 2:30 PM
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>02 / APPROVED KNOWLEDGE</span>
              <h3>Answers grounded in what you publish</h3>
              <p>
                Connect your help articles, product pages, and policies so visitors get clear, accurate answers without leaving the page.
              </p>
              <div className="vc-connection-note">
                <Icon name="file" /> Every reply stays within your approved content.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-knowledge-visual"
              role="img"
              aria-label="Visitor question answered from approved documentation and pricing pages"
            >
              <div className="vc-knowledge-question">
                <span><Icon name="globe" /></span>
                <div>
                  <small>VISITOR ASKS</small>
                  <strong>“How do we connect our existing Twilio number or SIP trunk?”</strong>
                </div>
              </div>
              <div className="vc-knowledge-source">
                <div>
                  <Icon name="file" />
                  <span>
                    <strong>Telephony docs</strong>
                    <small>Setup & SIP guide</small>
                  </span>
                </div>
                <div>
                  <Icon name="shield" />
                  <span>
                    <strong>Approved policy</strong>
                    <small>Verified scope</small>
                  </span>
                </div>
              </div>
              <div className="vc-knowledge-answer">
                <Icon name="spark" />
                <span>
                  <small>CHATBOT ANSWERS</small>
                  <strong>With the exact setup steps and a direct link.</strong>
                </span>
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>03 / TEAM HANDOFF</span>
              <h3>Bring in a person with the full thread</h3>
              <p>
                When a visitor needs a specialist, pass the conversation summary and collected details straight to your CRM or support desk.
              </p>
              <div className="vc-connection-note">
                <Icon name="headset" /> Your team sees what the visitor asked before replying.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-telephony-visual"
              role="img"
              aria-label="Website chat routed to team tools"
            >
              <div className="vc-phone-route">
                <div>
                  <span><Icon name="globe" /></span>
                  <strong>Website Chat</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="spark" /></span>
                  <strong>Vozon AI</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="headset" /></span>
                  <strong>Your Team</strong>
                </div>
              </div>
              <div className="vc-provider-label">CONNECT WITH YOUR CRM & HELPDESK</div>
              <div className="vc-provider-grid">
                {webTools.map((tool) => (
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
