import Image from "next/image";

import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentConnectedSection.css";
import "./WhatsAppBotConnectedSection.css";

function WhatsAppMark() { return <Image alt="" src="/images/integrations/whatsapp.svg" width={21} height={21} />; }

export function WhatsAppBotConnectedSection() {
  return <section className="vc-connections wa-connections" aria-labelledby="wa-connections-title">
    <div className="hcr-wrap">
      <div className="vc-connections-heading"><span>ONE CHAT, CONNECTED TO THE NEXT STEP</span><h2 id="wa-connections-title">A message is only the beginning.</h2><p>Give the bot an approved starting point, useful knowledge, and a way to bring your team into the conversation.</p></div>

      <div className="vc-connection-stack">
        <article className="vc-connection-card"><div className="vc-connection-copy"><span>01 / TIMELY MESSAGES</span><h3>Reach out when it matters</h3><p>Use an approved reminder after a customer leaves a cart, then let their reply become a conversation.</p><div className="vc-connection-note"><Icon name="message" /> A follow-up with room for a real question.</div></div>
          <div className="vc-connection-visual wa-trigger-visual" role="img" aria-label="Saved cart event leads to an approved WhatsApp reminder and a customer reply"><div className="wa-trigger-event"><Icon name="file" /><span><small>STORE EVENT</small><strong>Cart saved, checkout unfinished</strong></span><b>01</b></div><div className="wa-trigger-path"><i /><span>Approved follow-up</span><i /></div><div className="wa-trigger-message"><WhatsAppMark /><span><small>WHATSAPP MESSAGE</small><strong>Your cart is ready. Need help before checkout?</strong></span></div><div className="wa-trigger-reply"><Icon name="arrow" /> Customer asks about the item and returns to the cart.</div></div>
        </article>

        <article className="vc-connection-card"><div className="vc-connection-copy"><span>02 / APPROVED ANSWERS</span><h3>Answer the question behind the reply</h3><p>Use the product information and policies your team approves, so the bot can help in the same chat.</p><div className="vc-connection-note"><Icon name="file" /> Helpful answers, grounded in your content.</div></div>
          <div className="vc-connection-visual wa-knowledge-visual" role="img" aria-label="Customer asks a WhatsApp question, the bot checks approved information, and answers in the same chat"><div className="wa-knowledge-question"><WhatsAppMark /><span><small>CUSTOMER REPLIES</small><strong>“Is the blue headset available?”</strong></span></div><div className="wa-knowledge-sources"><div><Icon name="file" /><span><strong>Product details</strong><small>Approved catalogue</small></span></div><div><Icon name="shield" /><span><strong>Reply rules</strong><small>Your business policy</small></span></div></div><div className="wa-knowledge-answer"><Icon name="spark" /><span><small>BOT ANSWERS</small><strong>With a useful next step in this chat.</strong></span></div></div>
        </article>

        <article className="vc-connection-card"><div className="vc-connection-copy"><span>03 / HUMAN HANDOFF</span><h3>Pass the thread to a person</h3><p>Collect the order number and reason for the request, then give the next teammate the chat context.</p><div className="vc-connection-note"><Icon name="users" /> The customer does not have to start over.</div></div>
          <div className="vc-connection-visual wa-handoff-visual" role="img" aria-label="WhatsApp conversation about order 2084 is summarized and passed to a support teammate"><div className="wa-handoff-chat"><div><WhatsAppMark /><strong>Vozon AI</strong><small>Customer care</small></div><p>Where is my delivery?</p><p>Could you share your order number?</p><p>It&apos;s 2084.</p></div><div className="wa-handoff-arrow"><Icon name="arrow" /></div><div className="wa-handoff-summary"><span><Icon name="headset" /></span><div><small>TEAM HANDOFF</small><strong>Order 2084 · Delivery update</strong><p>Question and conversation summary attached</p></div><Icon name="check" /></div></div>
        </article>
      </div>
    </div>
  </section>;
}
