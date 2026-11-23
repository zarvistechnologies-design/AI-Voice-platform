import Image from "next/image";

import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentUseCaseVisual.css";
import "./WhatsAppBotUseCaseVisual.css";

type Kind = "cart" | "campaign" | "support" | "entry" | "guide";

function WhatsAppMark() { return <Image alt="" src="/images/integrations/whatsapp.svg" width={20} height={20} />; }

export function WhatsAppBotUseCaseVisual({ kind }: { kind: Kind }) {
  if (kind === "cart") return <div className="hcr-story-visual wa-scene wa-scene-cart" role="img" aria-label="Cart recovery: saved cart prompts an approved WhatsApp reminder, customer asks about availability, and bot guides them back to checkout">
    <div className="wa-scene-label">CART RECOVERY / FROM REMINDER TO REPLY</div>
    <div className="wa-cart-item"><span><Icon name="file" /></span><div><small>SAVED CART</small><strong>Studio Headphones · Blue</strong></div><b>1 item</b></div>
    <div className="wa-cart-route"><i /><span><WhatsAppMark /> Approved reminder sent</span></div>
    <div className="wa-cart-dialogue"><p>Hi Samira! Your cart is ready. Need help?</p><p>Is the blue color still available?</p><p>I can show you the item in your saved cart.</p></div>
    <div className="wa-cart-result"><Icon name="arrow" /><div><small>NEXT STEP</small><strong>Return to the saved cart</strong></div></div>
  </div>;

  if (kind === "campaign") return <div className="hcr-story-visual wa-scene wa-scene-campaign" role="img" aria-label="Campaign broadcast: approved WhatsApp message goes to an audience and an individual reply becomes a one-to-one bot conversation">
    <div className="wa-scene-label">CAMPAIGN / ONE MESSAGE, MANY INDIVIDUAL CHATS</div>
    <div className="wa-campaign-composer"><div><WhatsAppMark /><span><small>APPROVED MESSAGE</small><strong>New arrivals this week</strong></span></div><p>Our new headset range is here. Want a quick overview?</p><footer><Icon name="users" /> Intended audience <span>Send →</span></footer></div>
    <div className="wa-campaign-reach"><span>01</span><span>02</span><span>03</span><i /><b>Each reply becomes its own chat</b></div>
    <div className="wa-campaign-reply"><Icon name="message" /><div><small>CUSTOMER REPLIES</small><strong>“Tell me about the new headset.”</strong></div></div>
    <div className="wa-campaign-bot"><Icon name="spark" /> The bot answers one person at a time.</div>
  </div>;

  if (kind === "support") return <div className="hcr-story-visual wa-scene wa-scene-support" role="img" aria-label="Support handoff: customer asks about delivery, bot collects order 2084, then passes the full chat summary to support">
    <div className="wa-scene-label">SUPPORT / KEEP THE THREAD TOGETHER</div>
    <div className="wa-support-chat"><div><WhatsAppMark /><strong>Vozon AI</strong><small>Business account</small></div><p>Where is my delivery?</p><p>I can help. Could you share your order number?</p><p>It&apos;s 2084.</p></div>
    <div className="wa-support-context"><span><Icon name="file" /> Order 2084</span><i /><span><Icon name="message" /> Delivery question</span></div>
    <div className="wa-support-result"><span><Icon name="headset" /></span><div><small>READY FOR YOUR TEAM</small><strong>A teammate receives the chat and its context.</strong></div><Icon name="arrow" /></div>
  </div>;

  if (kind === "entry") return <div className="hcr-story-visual wa-scene wa-scene-entry" role="img" aria-label="WhatsApp bot setup: choose whether an incoming question, campaign reply, or approved follow-up begins the conversation">
    <div className="wa-scene-label">DESIGN THE STARTING POINT</div>
    <div className="wa-entry-root"><WhatsAppMark /><div><small>WHATSAPP BOT</small><strong>What starts the conversation?</strong></div></div>
    <div className="wa-entry-line" aria-hidden="true" />
    <div className="wa-entry-branches"><div><Icon name="message" /><strong>Incoming chat</strong><small>A customer asks</small></div><div><Icon name="users" /><strong>Campaign reply</strong><small>Interest turns into a chat</small></div><div><Icon name="file" /><strong>Approved follow-up</strong><small>A customer responds</small></div></div>
    <div className="wa-entry-foot"><Icon name="check" /> One clear purpose for each conversation.</div>
  </div>;

  return <div className="hcr-story-visual wa-scene wa-scene-guide" role="img" aria-label="Connected WhatsApp bot: approved knowledge, customer reply, cart and team handoff all connect through a single conversation">
    <div className="wa-scene-label">THE CONVERSATION, CONNECTED</div>
    <div className="wa-guide-map"><div className="wa-guide-source"><Icon name="file" /><span><strong>Knowledge</strong><small>Approved answers</small></span></div><div className="wa-guide-source"><Icon name="users" /><span><strong>Campaign</strong><small>Approved audience</small></span></div><div className="wa-guide-hub"><WhatsAppMark /><strong>Vozon AI</strong><small>One useful chat</small></div><div className="wa-guide-source"><Icon name="arrow" /><span><strong>Saved cart</strong><small>Checkout link</small></span></div><div className="wa-guide-source"><Icon name="headset" /><span><strong>Your team</strong><small>Context included</small></span></div></div>
    <div className="wa-guide-caption"><Icon name="bolt" /> The right next step stays connected to the chat.</div>
  </div>;
}
