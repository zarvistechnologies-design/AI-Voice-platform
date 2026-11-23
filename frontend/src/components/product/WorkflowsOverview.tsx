import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentOverview.css";

const features = [
  {
    icon: "bolt" as const,
    title: "Start from any event",
    body: "Begin a journey from an incoming call, a new lead, a WhatsApp message, or an external webhook.",
  },
  {
    icon: "branch" as const,
    title: "Branch by call outcome",
    body: "Route a booked meeting, a callback request, and an unresolved question down separate, clear paths.",
  },
  {
    icon: "message" as const,
    title: "Cross-channel follow-up",
    body: "Continue a phone conversation on WhatsApp or email while keeping the details already gathered.",
  },
  {
    icon: "users" as const,
    title: "Bring in your team",
    body: "Pass the conversation summary and next action to the right person whenever human judgment is needed.",
  },
];

const workflowApps = [
  { name: "WhatsApp", icon: "/images/integrations/whatsapp.svg" },
  { name: "Google Calendar", icon: "/images/integrations/google-calendar.svg" },
  { name: "Salesforce", icon: "/images/integrations/salesforce.svg" },
  { name: "HubSpot", icon: "/images/company-logos/hubspot.svg" },
  { name: "Slack", icon: "/images/integrations/slack.svg" },
  { name: "Gmail", icon: "/images/integrations/gmail.svg" },
] as const;

export function WorkflowsOverview() {
  return (
    <div className="vc-overview">
      <section className="vc-features hcr-wrap" aria-labelledby="workflows-features-title">
        <span className="vc-overview-kicker">BUILT FOR CONNECTED JOURNEYS</span>
        <h2 id="workflows-features-title">Turn every conversation result into the right next action.</h2>
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

      <section className="vc-deploy hcr-wrap" aria-labelledby="workflows-deploy-title">
        <span className="vc-overview-kicker">FROM STARTING EVENT TO FOLLOW-UP</span>
        <h2 id="workflows-deploy-title">Shape the steps around the conversation.</h2>
        <div className="vc-deploy-grid">
          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-template-visual" aria-hidden="true">
              <div className="vc-template-row is-current">
                <span className="vc-template-symbol"><Icon name="phone" /></span>
                <div>
                  <strong>New enquiry & qualification</strong>
                  <small>Start call, capture intent, and route</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="calendar" /></span>
                <div>
                  <strong>Appointment & reminder flow</strong>
                  <small>Confirm slot and send WhatsApp pass</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="headset" /></span>
                <div>
                  <strong>Support triage & escalation</strong>
                  <small>Resolve or hand off with summary</small>
                </div>
                <i>↗</i>
              </div>
            </div>
            <h3>Start with an event</h3>
            <p>Choose the lead, call, message, or webhook event that should begin the customer journey.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-language-visual" aria-hidden="true">
              <div className="vc-language-top">
                <span>CALL OUTCOMES</span>
                <i />
                <span>BRANCHES</span>
              </div>
              <div className="vc-language-chips">
                <span>Meeting Booked</span>
                <span>Callback Requested</span>
                <span>Needs Specialist</span>
                <span>Quote Sent</span>
                <span>Voicemail Left</span>
                <span>Issue Resolved</span>
              </div>
              <small>Each result follows its own clear next step.</small>
            </div>
            <h3>Branch by outcome</h3>
            <p>Set separate paths for different results so every conversation receives the appropriate follow-up.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-apps-visual" aria-hidden="true">
              <div className="vc-app-icons">
                {workflowApps.map((app) => (
                  <span key={app.name} title={app.name}>
                    <Image src={app.icon} alt="" width={27} height={27} />
                  </span>
                ))}
              </div>
              <div className="vc-apps-caption">CONNECTED CHANNELS & TOOLS</div>
            </div>
            <h3>Connect your tools</h3>
            <p>Send the outcome to calendars, CRMs, WhatsApp, and team channels automatically.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
