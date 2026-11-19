import Image from "next/image";

import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentConnectedSection.css";

const phoneProviders = [
  { name: "Twilio", icon: "/images/integrations/twilio.svg" },
  { name: "Exotel", icon: "/images/integrations/exotel.png" },
  { name: "Vobiz", icon: "/images/integrations/vobiz.svg" },
  { name: "Custom SIP", icon: "/images/integrations/sip-trunking.svg" },
] as const;

export function VoiceAgentConnectedSection() {
  return <section className="vc-connections" aria-labelledby="vc-connections-title">
    <div className="hcr-wrap">
      <div className="vc-connections-heading">
        <span>ONE AGENT, CONNECTED TO YOUR WORK</span>
        <h2 id="vc-connections-title">From a good answer to the right action.</h2>
        <p>Give your voice agent the tools, knowledge, and phone setup it needs for the calls you want it to handle.</p>
      </div>

      <div className="vc-connection-stack">
        <article className="vc-connection-card">
          <div className="vc-connection-copy"><span>01 / TOOLS</span><h3>Every tool within reach</h3><p>Check details, book a time, send a confirmation, or bring in your team while the conversation is still moving.</p><div className="vc-connection-note"><Icon name="bolt" /> One request, several useful actions.</div></div>
          <div className="vc-connection-visual vc-tools-visual" aria-label="Illustrative flow from caller request to calendar booking and WhatsApp confirmation" role="img">
            <div className="vc-tool-entry"><span><Icon name="phone" /></span><div><small>CALLER REQUEST</small><strong>“Can we meet on Wednesday?”</strong></div></div>
            <div className="vc-tool-flow"><div><span><Icon name="calendar" /></span><strong>Find & book</strong><small>Calendar</small></div><i /><div><span><Icon name="message" /></span><strong>Confirm</strong><small>WhatsApp</small></div><i /><div><span><Icon name="users" /></span><strong>Share</strong><small>Your team</small></div></div>
            <div className="vc-tool-outcome"><Icon name="check" /> Wednesday at 2:30 PM is confirmed.</div>
          </div>
        </article>

        <article className="vc-connection-card">
          <div className="vc-connection-copy"><span>02 / KNOWLEDGE</span><h3>Answers from what you know</h3><p>Add approved FAQs, documents, and links so the agent can answer with the information your business uses.</p><div className="vc-connection-note"><Icon name="file" /> Business context travels into the call.</div></div>
          <div className="vc-connection-visual vc-knowledge-visual" aria-label="Illustrative flow from a caller question through approved business documents to a useful answer" role="img">
            <div className="vc-knowledge-question"><span><Icon name="phone" /></span><div><small>CALLER ASKS</small><strong>“What should I bring to my appointment?”</strong></div></div>
            <div className="vc-knowledge-source"><div><Icon name="file" /><span><strong>visit_guide.pdf</strong><small>Approved information</small></span></div><div><Icon name="globe" /><span><strong>Help articles</strong><small>Up to date answers</small></span></div></div>
            <div className="vc-knowledge-answer"><Icon name="spark" /><span><small>AGENT ANSWERS</small><strong>With the right details, in the moment.</strong></span></div>
          </div>
        </article>

        <article className="vc-connection-card">
          <div className="vc-connection-copy"><span>03 / TELEPHONY</span><h3>Use the calling setup you have</h3><p>Connect a supported provider or SIP trunk, then route calls to the right Vozon agent and team.</p><div className="vc-connection-note"><Icon name="branch" /> A clear path from ring to result.</div></div>
          <div className="vc-connection-visual vc-telephony-visual" aria-label="Illustrative call route from a business number through Vozon AI to a team, with example telephony providers" role="img">
            <div className="vc-phone-route"><div><span><Icon name="phone" /></span><strong>Your number</strong></div><i /><div><span><Icon name="spark" /></span><strong>Vozon AI</strong></div><i /><div><span><Icon name="headset" /></span><strong>Your team</strong></div></div>
            <div className="vc-provider-label">CONNECT THE PROVIDER YOU USE</div>
            <div className="vc-provider-grid">{phoneProviders.map((provider) => <div key={provider.name}><Image alt="" src={provider.icon} width={24} height={24} /><strong>{provider.name}</strong></div>)}</div>
          </div>
        </article>
      </div>
    </div>
  </section>;
}
