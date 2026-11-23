import Image from "next/image";

import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentOverview.css";
import "./WhatsAppBotOverview.css";

const features = [
  { icon: "message", title: "Reach the right moment", body: "Start with an incoming question or an approved reminder when a customer has a reason to reply." },
  { icon: "spark", title: "Answer the reply", body: "Understand what each person asks and respond with information your business has approved." },
  { icon: "branch", title: "Guide the next step", body: "Help someone return to a cart, learn about an offer, or share the details needed for support." },
  { icon: "users", title: "Keep your team close", body: "Pass the chat and its context to a person when the request needs human attention." },
] as const;

function WhatsAppMark() { return <Image alt="" src="/images/integrations/whatsapp.svg" width={22} height={22} />; }

export function WhatsAppBotOverview() {
  return <div className="vc-overview wa-overview">
    <section className="vc-features hcr-wrap" aria-labelledby="wa-features-title">
      <span className="vc-overview-kicker">BUILT FOR REAL WHATSAPP CONVERSATIONS</span>
      <h2 id="wa-features-title">A reply should go somewhere useful.</h2>
      <div className="vc-feature-grid">{features.map((feature) => <article key={feature.title}><Icon name={feature.icon} /><h3>{feature.title}</h3><p>{feature.body}</p></article>)}</div>
    </section>

    <section className="vc-deploy hcr-wrap" aria-labelledby="wa-deploy-title">
      <span className="vc-overview-kicker">FROM FIRST MESSAGE TO FIRST RESULT</span>
      <h2 id="wa-deploy-title">Start with one clear conversation.</h2>
      <div className="vc-deploy-grid">
        <article className="vc-deploy-card"><div className="vc-deploy-visual wa-entry-visual" aria-hidden="true">
          <div className="wa-entry-row is-current"><span><Icon name="file" /></span><div><strong>Cart left behind</strong><small>Approved reminder starts the chat</small></div><i>↗</i></div>
          <div className="wa-entry-row"><span><Icon name="users" /></span><div><strong>Campaign reply</strong><small>One response becomes one conversation</small></div><i>↗</i></div>
          <div className="wa-entry-row"><span><Icon name="message" /></span><div><strong>Incoming question</strong><small>Customer asks for help directly</small></div><i>↗</i></div>
        </div><h3>Choose the entry point</h3><p>Begin with a customer message, a campaign response, or an approved follow-up.</p></article>

        <article className="vc-deploy-card"><div className="vc-deploy-visual wa-reply-visual" aria-hidden="true">
          <div className="wa-reply-head"><WhatsAppMark /><span><strong>Vozon AI</strong><small>Business conversation</small></span><Icon name="check" /></div>
          <div className="wa-reply-bubble">Is the blue headset still available?</div>
          <div className="wa-reply-bubble is-bot">I can help you find it and return to your saved cart.</div>
          <div className="wa-reply-status"><Icon name="spark" /> Answered with approved information</div>
        </div><h3>Shape the answers</h3><p>Set the information, questions, and boundaries the bot should use in each chat.</p></article>

        <article className="vc-deploy-card"><div className="vc-deploy-visual wa-action-visual" aria-hidden="true">
          <div className="wa-action-step"><span><WhatsAppMark /></span><strong>Customer chat</strong></div><i /><div className="wa-action-step is-selected"><span><Icon name="branch" /></span><strong>Right next step</strong></div><i />
          <div className="wa-action-results"><span><Icon name="file" /> Saved cart</span><span><Icon name="users" /> Your team</span></div>
        </div><h3>Connect the outcome</h3><p>Guide the customer to a relevant action or hand the full context to your team.</p></article>
      </div>
    </section>
  </div>;
}
