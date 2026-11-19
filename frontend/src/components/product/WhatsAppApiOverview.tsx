import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentOverview.css";

const features = [
  {
    icon: "webhook" as const,
    title: "Connected channel API",
    body: "Link your business WhatsApp account to the workflows, agents, and systems that manage customer conversations.",
  },
  {
    icon: "message" as const,
    title: "Approved template dispatch",
    body: "Send timely confirmations, order updates, and follow-ups using structured templates and parameters.",
  },
  {
    icon: "branch" as const,
    title: "Two-way event routing",
    body: "Receive incoming messages, delivery receipts, and customer replies in real time to trigger the right next step.",
  },
  {
    icon: "shield" as const,
    title: "Opt-in & window controls",
    body: "Keep messaging aligned with customer permissions, 24-hour service windows, and business account rules.",
  },
];

const connectedApps = [
  { name: "WhatsApp", icon: "/images/integrations/whatsapp.svg" },
  { name: "Meta", icon: "/images/company-logos/meta.svg" },
  { name: "Shopify", icon: "/images/company-logos/shopify.svg" },
  { name: "Salesforce", icon: "/images/integrations/salesforce.svg" },
  { name: "HubSpot", icon: "/images/company-logos/hubspot.svg" },
  { name: "Webhooks", icon: "/images/integrations/webhooks.svg" },
] as const;

export function WhatsAppApiOverview() {
  return (
    <div className="vc-overview">
      <section className="vc-features hcr-wrap" aria-labelledby="wa-api-features-title">
        <span className="vc-overview-kicker">BUILT FOR CONNECTED MESSAGING</span>
        <h2 id="wa-api-features-title">One channel API. Connected to every journey.</h2>
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

      <section className="vc-deploy hcr-wrap" aria-labelledby="wa-api-deploy-title">
        <span className="vc-overview-kicker">FROM ACCOUNT LINK TO LIVE TRAFFIC</span>
        <h2 id="wa-api-deploy-title">Set up your WhatsApp connection.</h2>
        <div className="vc-deploy-grid">
          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-template-visual" aria-hidden="true">
              <div className="vc-template-row is-current">
                <span className="vc-template-symbol"><Icon name="phone" /></span>
                <div>
                  <strong>Connect business number</strong>
                  <small>Link eligible WhatsApp Business account</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="file" /></span>
                <div>
                  <strong>Sync message templates</strong>
                  <small>Approved utility & follow-up formats</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="webhook" /></span>
                <div>
                  <strong>Configure webhook events</strong>
                  <small>Inbound replies & delivery status</small>
                </div>
                <i>↗</i>
              </div>
            </div>
            <h3>Connect your channel</h3>
            <p>Link your WhatsApp Business setup and choose which customer events and replies your workflow should handle.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-language-visual" aria-hidden="true">
              <div className="vc-language-top">
                <span>TEMPLATE EVENTS</span>
                <i />
                <span>PARAMETERS</span>
              </div>
              <div className="vc-language-chips">
                <span>Call Follow-Up</span>
                <span>Booking Pass</span>
                <span>Order Status</span>
                <span>Verification Code</span>
                <span>Support Update</span>
                <span>Payment Link</span>
              </div>
              <small>Pass dynamic context from calls and tools into messages.</small>
            </div>
            <h3>Define message events</h3>
            <p>Trigger structured WhatsApp messages from call outcomes, bookings, or external system events.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-apps-visual" aria-hidden="true">
              <div className="vc-app-icons">
                {connectedApps.map((app) => (
                  <span key={app.name} title={app.name}>
                    <Image src={app.icon} alt="" width={27} height={27} />
                  </span>
                ))}
              </div>
              <div className="vc-apps-caption">CONNECTED BUSINESS STACK</div>
            </div>
            <h3>Route and record</h3>
            <p>Send incoming replies to a Vozon bot, a workflow, or your team, and keep the customer record updated.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
