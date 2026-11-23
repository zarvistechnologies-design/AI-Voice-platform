import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentOverview.css";

const features = [
  {
    icon: "file" as const,
    title: "Grounded in your content",
    body: "Choose the pages, help articles, and documents the chatbot should rely on so answers stay accurate.",
  },
  {
    icon: "calendar" as const,
    title: "Guide visitors to action",
    body: "Help visitors compare options, collect the details your team needs, and point them to a booking.",
  },
  {
    icon: "code" as const,
    title: "Simple website embed",
    body: "Add the chatbot to your site and tailor its greeting, appearance, and boundaries to match your brand.",
  },
  {
    icon: "users" as const,
    title: "Hand off with context",
    body: "Pass qualified enquiries and the full conversation summary to your team or connected workflow.",
  },
];

const knowledgeAndTools = [
  { name: "Notion", icon: "/images/company-logos/notion.svg" },
  { name: "Google Docs", icon: "/images/integrations/googledocs.svg" },
  { name: "Google Calendar", icon: "/images/integrations/google-calendar.svg" },
  { name: "HubSpot", icon: "/images/company-logos/hubspot.svg" },
  { name: "Slack", icon: "/images/integrations/slack.svg" },
  { name: "Zendesk", icon: "/images/company-logos/zendesk.svg" },
] as const;

export function WebChatbotOverview() {
  return (
    <div className="vc-overview">
      <section className="vc-features hcr-wrap" aria-labelledby="web-chat-features-title">
        <span className="vc-overview-kicker">BUILT FOR HELPFUL WEBSITE CONVERSATIONS</span>
        <h2 id="web-chat-features-title">Answer questions clearly. Capture what matters.</h2>
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

      <section className="vc-deploy hcr-wrap" aria-labelledby="web-chat-deploy-title">
        <span className="vc-overview-kicker">FROM SETUP TO FIRST VISITOR CHAT</span>
        <h2 id="web-chat-deploy-title">Put a helpful assistant on your site.</h2>
        <div className="vc-deploy-grid">
          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-template-visual" aria-hidden="true">
              <div className="vc-template-row is-current">
                <span className="vc-template-symbol"><Icon name="file" /></span>
                <div>
                  <strong>Approved help & product pages</strong>
                  <small>Grounded answers from your content</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="calendar" /></span>
                <div>
                  <strong>Demo & booking qualification</strong>
                  <small>Collect team size, need, and timing</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="headset" /></span>
                <div>
                  <strong>Specialist escalation path</strong>
                  <small>Pass complex questions to your team</small>
                </div>
                <i>↗</i>
              </div>
            </div>
            <h3>Add your knowledge</h3>
            <p>Select the pages, FAQs, and business information the chatbot is approved to use when answering visitors.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-language-visual" aria-hidden="true">
              <div className="vc-language-top">
                <span>VISITOR ROLES</span>
                <i />
                <span>BOUNDARIES</span>
              </div>
              <div className="vc-language-chips">
                <span>Product Discovery</span>
                <span>Pricing Questions</span>
                <span>Demo Booking</span>
                <span>Order Lookup</span>
                <span>Support Triage</span>
                <span>Live Handoff</span>
              </div>
              <small>Decide what it answers and when a person steps in.</small>
            </div>
            <h3>Set its role</h3>
            <p>Choose whether the bot should answer common questions, qualify interest, or guide visitors to a booking.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-apps-visual" aria-hidden="true">
              <div className="vc-app-icons">
                {knowledgeAndTools.map((app) => (
                  <span key={app.name} title={app.name}>
                    <Image src={app.icon} alt="" width={27} height={27} />
                  </span>
                ))}
              </div>
              <div className="vc-apps-caption">KNOWLEDGE & TEAM TOOLS</div>
            </div>
            <h3>Connect the outcome</h3>
            <p>Send qualified enquiries, bookings, and conversation summaries straight into your CRM or team channels.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
