import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentOverview.css";

const features = [
  {
    icon: "layers" as const,
    title: "Agents and workflows together",
    body: "Combine voice agents, WhatsApp bots, web chat, and connected workflows into one coherent customer journey.",
  },
  {
    icon: "database" as const,
    title: "Shared context across steps",
    body: "Carry what a customer said on a call directly into the follow-up message, tool action, or team handoff.",
  },
  {
    icon: "cpu" as const,
    title: "Approved system actions",
    body: "Let the journey check availability, book slots, and update records within the boundaries your team sets.",
  },
  {
    icon: "users" as const,
    title: "Clear human ownership",
    body: "Ensure every unresolved or sensitive request reaches the right person with the context needed to act.",
  },
];

const journeyApps = [
  { name: "Twilio", icon: "/images/integrations/twilio.svg" },
  { name: "WhatsApp", icon: "/images/integrations/whatsapp.svg" },
  { name: "Google Calendar", icon: "/images/integrations/google-calendar.svg" },
  { name: "Salesforce", icon: "/images/integrations/salesforce.svg" },
  { name: "HubSpot", icon: "/images/company-logos/hubspot.svg" },
  { name: "Slack", icon: "/images/integrations/slack.svg" },
] as const;

export function EndToEndAutomationOverview() {
  return (
    <div className="vc-overview">
      <section className="vc-features hcr-wrap" aria-labelledby="e2e-features-title">
        <span className="vc-overview-kicker">BUILT FOR COMPLETE CUSTOMER JOURNEYS</span>
        <h2 id="e2e-features-title">From the first enquiry to the final action.</h2>
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

      <section className="vc-deploy hcr-wrap" aria-labelledby="e2e-deploy-title">
        <span className="vc-overview-kicker">FROM FIRST TOUCHPOINT TO OUTCOME</span>
        <h2 id="e2e-deploy-title">Connect one repeatable journey at a time.</h2>
        <div className="vc-deploy-grid">
          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-template-visual" aria-hidden="true">
              <div className="vc-template-row is-current">
                <span className="vc-template-symbol"><Icon name="phone" /></span>
                <div>
                  <strong>Lead to booked meeting</strong>
                  <small>Respond, qualify, and confirm slot</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="message" /></span>
                <div>
                  <strong>Call to WhatsApp follow-up</strong>
                  <small>Send written summary & next steps</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="headset" /></span>
                <div>
                  <strong>Question to specialist resolution</strong>
                  <small>Answer routine or hand off with context</small>
                </div>
                <i>↗</i>
              </div>
            </div>
            <h3>Map the journey</h3>
            <p>List your common entry points and define what a useful outcome looks like for both the customer and your team.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-language-visual" aria-hidden="true">
              <div className="vc-language-top">
                <span>TOUCHPOINTS</span>
                <i />
                <span>OUTCOMES</span>
              </div>
              <div className="vc-language-chips">
                <span>Voice Agent</span>
                <span>WhatsApp Bot</span>
                <span>Web Chatbot</span>
                <span>Vozon MCP</span>
                <span>Workflows</span>
                <span>Team Handoff</span>
              </div>
              <small>Every step carries the conversation context forward.</small>
            </div>
            <h3>Connect agents and tools</h3>
            <p>Combine voice, messaging, web chat, and approved tool actions where they genuinely help the customer.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-apps-visual" aria-hidden="true">
              <div className="vc-app-icons">
                {journeyApps.map((app) => (
                  <span key={app.name} title={app.name}>
                    <Image src={app.icon} alt="" width={27} height={27} />
                  </span>
                ))}
              </div>
              <div className="vc-apps-caption">CONNECTED CHANNELS & SYSTEMS</div>
            </div>
            <h3>Review every handoff</h3>
            <p>Make sure an unresolved request always reaches a person with a clear record and clear responsibility.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
