import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentOverview.css";

const features = [
  {
    icon: "grid" as const,
    title: "One visual canvas",
    body: "Put your starting trigger, AI conversation, and follow-up paths on a single canvas your whole team can read.",
  },
  {
    icon: "branch" as const,
    title: "Visible outcome branches",
    body: "Make separate paths for bookings, callbacks, and human handoffs so nothing gets lost after a call.",
  },
  {
    icon: "play" as const,
    title: "Test before launch",
    body: "Walk through each branch and review how the agent handles routine and edge-case requests before going live.",
  },
  {
    icon: "users" as const,
    title: "Shared team ownership",
    body: "Give operations, support, and sales a clear picture of what the agent does and when a person steps in.",
  },
];

const builderApps = [
  { name: "WhatsApp", icon: "/images/integrations/whatsapp.svg" },
  { name: "Google Calendar", icon: "/images/integrations/google-calendar.svg" },
  { name: "Salesforce", icon: "/images/integrations/salesforce.svg" },
  { name: "HubSpot", icon: "/images/company-logos/hubspot.svg" },
  { name: "Slack", icon: "/images/integrations/slack.svg" },
  { name: "Webhooks", icon: "/images/integrations/webhooks.svg" },
] as const;

export function CreateWorkflowsOverview() {
  return (
    <div className="vc-overview">
      <section className="vc-features hcr-wrap" aria-labelledby="create-wf-features-title">
        <span className="vc-overview-kicker">BUILT FOR CLEAR PROCESS DESIGN</span>
        <h2 id="create-wf-features-title">Design the journey before the first call rings.</h2>
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

      <section className="vc-deploy hcr-wrap" aria-labelledby="create-wf-deploy-title">
        <span className="vc-overview-kicker">FROM FIRST NODE TO LIVE WORKFLOW</span>
        <h2 id="create-wf-deploy-title">Put your process on one canvas.</h2>
        <div className="vc-deploy-grid">
          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-template-visual" aria-hidden="true">
              <div className="vc-template-row is-current">
                <span className="vc-template-symbol"><Icon name="bolt" /></span>
                <div>
                  <strong>01 · Pick a starting point</strong>
                  <small>New lead, incoming call, or message</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="spark" /></span>
                <div>
                  <strong>02 · Lay out the conversation</strong>
                  <small>Select agent, questions, and scope</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="branch" /></span>
                <div>
                  <strong>03 · Connect each outcome</strong>
                  <small>Booking, follow-up, or escalation</small>
                </div>
                <i>↗</i>
              </div>
            </div>
            <h3>Pick a starting point</h3>
            <p>Begin with a lead, an incoming message, or another event your team wants to respond to consistently.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-language-visual" aria-hidden="true">
              <div className="vc-language-top">
                <span>CANVAS STEPS</span>
                <i />
                <span>OUTCOMES</span>
              </div>
              <div className="vc-language-chips">
                <span>Trigger Node</span>
                <span>Voice Agent</span>
                <span>WhatsApp Step</span>
                <span>Decision Branch</span>
                <span>Calendar Slot</span>
                <span>Human Handoff</span>
              </div>
              <small>Test every branch with your team before launch.</small>
            </div>
            <h3>Lay out the conversation</h3>
            <p>Add the agent step and define the information or decision it should produce during the exchange.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-apps-visual" aria-hidden="true">
              <div className="vc-app-icons">
                {builderApps.map((app) => (
                  <span key={app.name} title={app.name}>
                    <Image src={app.icon} alt="" width={27} height={27} />
                  </span>
                ))}
              </div>
              <div className="vc-apps-caption">CONNECTED OUTCOME ACTIONS</div>
            </div>
            <h3>Connect each outcome</h3>
            <p>Create separate paths for booking, follow-up, escalation, and requests that need a person.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
