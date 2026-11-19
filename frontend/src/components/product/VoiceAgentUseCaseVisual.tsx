import Image from "next/image";

import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentUseCaseVisual.css";

type Kind = "lead" | "appointment" | "support" | "define" | "connect";

const wave = Array.from({ length: 23 }, (_, i) => 9 + ((i * 13 + 7) % 27));

export function VoiceAgentUseCaseVisual({ kind }: { kind: Kind }) {
  if (kind === "lead") return <div className="hcr-story-visual vc-scene vc-scene-lead" role="img" aria-label="Example lead qualification: a caller asks about a team plan, the agent captures requirements, and sales receives a summary">
    <div className="vc-scene-label">LIVE CALL / LEAD QUALIFICATION</div>
    <div className="vc-lead-call"><span className="vc-scene-round"><Icon name="phone" /></span><div><small>Vozon AI is listening</small><strong>What does your team need?</strong></div><div className="vc-lead-wave" aria-hidden="true">{wave.map((height, i) => <i key={i} style={{ height }} />)}</div></div>
    <div className="vc-lead-quote">“We need a plan for 12 people next month.”</div>
    <div className="vc-lead-capture"><div className="vc-lead-trace"><i /><i /><i /></div><span><Icon name="users" /> 12 people</span><span><Icon name="clock" /> Next month</span></div>
    <div className="vc-lead-result"><span className="vc-scene-round"><Icon name="arrow" /></span><div><small>SALES HANDOFF</small><strong>A useful lead, ready to follow up.</strong></div><b>Ready</b></div>
  </div>;

  if (kind === "appointment") return <div className="hcr-story-visual vc-scene vc-scene-appointment" role="img" aria-label="Example booking flow: the caller asks for Wednesday afternoon, the agent checks available times, books 2:30 PM, and sends confirmation">
    <div className="vc-scene-label">FROM REQUEST TO CONFIRMED TIME</div>
    <div className="vc-appt-request"><span className="vc-appt-icon"><Icon name="phone" /></span><div><small>CALLER SAYS</small><strong>“Wednesday afternoon works for me.”</strong></div></div>
    <div className="vc-appt-path" aria-hidden="true"><span>01 <b>Request</b></span><i /><span>02 <b>Find a time</b></span><i /><span>03 <b>Book</b></span></div>
    <div className="vc-appt-calendar"><div className="vc-appt-calendar-head"><div><small>AVAILABLE SLOTS</small><strong>Wednesday afternoon</strong></div><Image src="/images/integrations/google-calendar.svg" alt="" width={28} height={28} /></div><div className="vc-appt-slots"><span>11:00 AM</span><span className="is-picked">2:30 PM <Icon name="check" /></span><span>4:00 PM</span></div></div>
    <div className="vc-appt-confirm"><span className="vc-appt-confirm-mark"><Icon name="check" /></span><div><small>APPOINTMENT BOOKED</small><strong>Wednesday · 2:30 PM</strong><span><Image src="/images/integrations/whatsapp.svg" alt="" width={15} height={15} /> Confirmation sent to the caller</span></div></div>
  </div>;

  if (kind === "support") return <div className="hcr-story-visual vc-scene vc-scene-support" role="img" aria-label="Example customer support flow: the agent understands a delivery question, checks the order, and passes the case with context to a specialist">
    <div className="vc-scene-label">CUSTOMER SUPPORT / ONE CONTINUOUS STORY</div>
    <div className="vc-support-dialogue"><div className="vc-support-caller"><span><Icon name="phone" /></span><p>“Where is my delivery?”</p></div><div className="vc-support-agent"><span><Icon name="spark" /></span><p>I’ll check your order and find the right update.</p></div></div>
    <div className="vc-support-bridge"><span><Icon name="database" /> Order details found</span><i /><span><Icon name="shield" /> Needs specialist</span></div>
    <div className="vc-support-handoff"><div className="vc-support-handoff-icon"><Icon name="headset" /></div><div><small>HANDOFF WITH CONTEXT</small><strong>Support team picks up where the agent left off.</strong><p>Delivery question · Order status · Call summary</p></div><Icon name="arrow" /></div>
  </div>;

  if (kind === "define") return <div className="hcr-story-visual vc-scene vc-scene-define" role="img" aria-label="Example setup flow: choose what the voice agent answers, the details it collects, and when it transfers to a person">
    <div className="vc-scene-label">DESIGN THE CONVERSATION</div>
    <div className="vc-define-root"><span><Icon name="branch" /></span><div><small>VOICE AGENT</small><strong>What should happen on a call?</strong></div></div>
    <div className="vc-define-line" aria-hidden="true" />
    <div className="vc-define-branches"><div><span><Icon name="message" /></span><strong>Answer</strong><small>Approved questions</small></div><div><span><Icon name="file" /></span><strong>Collect</strong><small>Details that matter</small></div><div><span><Icon name="headset" /></span><strong>Transfer</strong><small>When a person is needed</small></div></div>
    <div className="vc-define-foot"><Icon name="check" /> One clear job. A useful next step.</div>
  </div>;

  return <div className="hcr-story-visual vc-scene vc-scene-connect" role="img" aria-label="Example connected voice agent: business knowledge supports the answer, calendar books a time, and the team receives the call outcome">
    <div className="vc-scene-label">THE CONVERSATION, CONNECTED</div>
    <div className="vc-connect-map"><div className="vc-connect-source"><span><Icon name="file" /></span><div><strong>Knowledge</strong><small>Approved answers</small></div></div><div className="vc-connect-source"><span><Icon name="calendar" /></span><div><strong>Calendar</strong><small>Available times</small></div></div><div className="vc-connect-hub"><div className="vc-connect-pulse"><Icon name="phone" /></div><strong>Vozon AI</strong><small>Understands the caller</small></div><div className="vc-connect-source"><span><Icon name="message" /></span><div><strong>Follow-up</strong><small>Confirmation sent</small></div></div><div className="vc-connect-source"><span><Icon name="users" /></span><div><strong>Your team</strong><small>Outcome shared</small></div></div></div>
    <div className="vc-connect-caption"><Icon name="bolt" /> The right information goes where it is needed.</div>
  </div>;
}
