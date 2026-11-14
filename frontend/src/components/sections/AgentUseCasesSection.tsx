"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./AgentUseCasesSection.css";

type Example = { title: string; industry: string; description: string; agent: string; channel: "voice" | "whatsapp"; outcome: string; messages: string[] };
const appointmentRecording = [
  { role: "assistant", at: 0, text: "नमस्ते! मैं रिया बोल रही हूं भारद्वाज हॉस्पिटल, लहरतारा से। बताइए, मैं आपकी कैसे मदद कर सकती हूं?" },
  { role: "user", at: 10.65, text: "अपॉइंटमेंट लेना है।" },
  { role: "assistant", at: 10.67, text: "ज़रूर! आप किस दिन और किस समय आना चाहेंगे?" },
  { role: "user", at: 20.16, text: "कल डॉक्टर कब से कब तक मिलेंगे?" },
  { role: "assistant", at: 20.17, text: "कल रविवार है, तो डॉ. अरुण सिंह सुबह 10:00 बजे से दोपहर 2:00 बजे तक उपलब्ध रहेंगे। क्या आप इस दौरान कोई अपॉइंटमेंट बुक करना चाहेंगे?" },
  { role: "user", at: 34.1, text: "जी मैं साढ़े दस बजे।" },
  { role: "assistant", at: 37.9, text: "एक मिनट, उपलब्धता चेक कर रही हूं। जी, वो स्लॉट अवेलेबल है। आपका नाम बता दीजिए?" },
];
const examples: Record<string, Example[]> = {
  Activate: [
    { title: "Turn an enquiry into an appointment", industry: "Healthcare", description: "Answer the first question, find a suitable slot, and help customers book while the conversation is still warm.", agent: "Appointment assistant", channel: "voice", outcome: "Appointment confirmed", messages: ["Hi Priya! I’m the Vozon assistant. Would you like help booking your consultation?", "Yes, is there anything tomorrow morning?", "There’s an opening at 11:30 AM. Would that work for you?", "That’s perfect. Please book it.", "You’re booked for tomorrow at 11:30 AM. I’ll send your confirmation now."] },
    { title: "Find the leads ready for a next step", industry: "Sales", description: "Understand the customer’s needs and timing, then hand your sales team a conversation with context.", agent: "Lead qualification agent", channel: "voice", outcome: "Qualified for sales", messages: ["Thanks for your interest! What would you like to automate?", "Inbound enquiries for our real estate team.", "Understood. Are you looking to get started this month?", "Yes, we’d like to see a demo this week.", "Great. I’ll share your requirements with our team so we can tailor your demo."] },
    { title: "Turn travel enquiries into bookings", industry: "Travel & hospitality", description: "Help travellers explore destinations, discover tour packages, and take the next step in WhatsApp.", agent: "Travel assistant", channel: "whatsapp", outcome: "Help travellers choose their next trip", messages: ["Welcome! How can I help plan your next trip?", "I’d like to explore tour packages.", "Of course. Which destination are you interested in?", "Manali, please.", "Let’s find a tour package that works for you."] },
  ],
  Retain: [
    { title: "Keep every follow-up moving", industry: "Services", description: "Continue the conversation after a visit and help customers find the next appointment that fits their schedule.", agent: "Customer care assistant", channel: "whatsapp", outcome: "Follow-up scheduled", messages: ["Hi Priya! Would you like help arranging your follow-up visit?", "Yes, sometime next week please.", "I can help with that. Is Tuesday afternoon convenient?", "Tuesday works for me.", "Perfect. I’ll help confirm your slot and send the details here."] },
    { title: "Make renewals feel effortless", industry: "Subscriptions", description: "Give customers a timely reminder and clear answers before their subscription is due to renew.", agent: "Renewal assistant", channel: "voice", outcome: "Renewal link shared", messages: ["Hi Sam, your subscription is due for renewal soon. Can I help with your options?", "Can I keep my current plan?", "Absolutely. You can continue with the same plan.", "Great, send me the renewal details.", "I’ll send your secure renewal link so you can review and continue."] },
    { title: "Reconnect with past customers", industry: "Sales", description: "Reach out with a relevant conversation and help interested customers pick up where they left off.", agent: "Re-engagement assistant", channel: "whatsapp", outcome: "Interest reactivated", messages: ["Hi Alex, still exploring options for your team? I’m happy to help.", "Actually, yes. We’re revisiting this now.", "Good timing. Has anything changed in what you need?", "We now need support for WhatsApp as well.", "Got it. I’ll pass that context to the team for your next conversation."] },
  ],
  Support: [
    { title: "Keep customers informed about orders", industry: "Commerce", description: "Handle common delivery questions and help customers get the right information without waiting in a queue.", agent: "Order support assistant", channel: "whatsapp", outcome: "Customer updated", messages: ["Hello! How can I help with your order today?", "Could you check my delivery? Order 2048.", "Thanks. Your order is on its way and scheduled for tomorrow.", "Can you send me the tracking link?", "Of course. I’ll share your tracking details here so you can follow the delivery."] },
    { title: "Give common questions a quick answer", industry: "Customer care", description: "Guide customers through everyday requests and pass complex questions to a person with the context attached.", agent: "Customer support agent", channel: "voice", outcome: "Question resolved", messages: ["Welcome! What can I help you with today?", "How do I update my billing address?", "Open your account settings, choose Billing, then select Edit address.", "Found it. Thanks for your help!", "You’re welcome. Is there anything else I can help with?"] },
    { title: "Help customers change their plans", industry: "Services", description: "Understand the request and help customers reschedule with fewer calls and less back-and-forth.", agent: "Rescheduling assistant", channel: "whatsapp", outcome: "Visit rescheduled", messages: ["Hi! Do you need help with your upcoming visit?", "I can’t make it on Friday.", "No problem. Would Monday at 10 AM work instead?", "Yes, thank you.", "You’re all set for Monday at 10 AM. I’ll send your updated confirmation."] },
  ],
};

const businessProfiles: Record<string, { name: string; initials: string; color: string; background: string }[]> = {
  Activate: [
    { name: "Bhardwaj Hospital", initials: "BH", color: "#237f86", background: "#e1f4f3" },
    { name: "Horizon Realty", initials: "HR", color: "#b36d2e", background: "#fbeddc" },
    { name: "Wanderlust Travels", initials: "WT", color: "#2675b9", background: "#e0effb" },
  ],
  Retain: [
    { name: "Bloom Care", initials: "BC", color: "#b5687a", background: "#f9e8ec" },
    { name: "Orbit Fitness", initials: "OF", color: "#467d4b", background: "#e7f2df" },
    { name: "Evergreen Estates", initials: "EE", color: "#286d59", background: "#dff0e9" },
  ],
  Support: [
    { name: "The Everyday Store", initials: "ES", color: "#b46632", background: "#fcebdc" },
    { name: "Northstar Connect", initials: "NC", color: "#506994", background: "#e6ecf8" },
    { name: "Urban Home Services", initials: "UH", color: "#4e7e7a", background: "#e0efeb" },
  ],
};

function PhoneIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m7 3 3 4-2 3a14 14 0 0 0 6 6l3-2 4 3-1 3c-.3 1-1.3 1.3-2.2 1C10 19 5 14 3 6.2 2.7 5.3 3 4.3 4 4l3-1Z" /></svg>; }

export function AgentUseCasesSection() {
  const [category, setCategory] = useState("Activate");
  const [selected, setSelected] = useState(2);
  const [visible, setVisible] = useState(1);
  const [playing, setPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const example = examples[category][selected];
  const business = businessProfiles[category][selected];
  const isRecorded = category === "Activate" && selected === 0;
  const messages = isRecorded ? appointmentRecording.map(turn => turn.text) : example.messages;
  useEffect(() => {
    const chat = chatRef.current;
    if (chat) chat.scrollTop = chat.scrollHeight;
  }, [visible, example]);
  useEffect(() => {
    if (isRecorded || !playing || visible >= example.messages.length) return;
    const timer = window.setTimeout(() => setVisible(count => count + 1), 2400);
    return () => window.clearTimeout(timer);
  }, [playing, visible, example, isRecorded]);
  function choose(nextCategory: string, index: number) { audioRef.current?.pause(); setCategory(nextCategory); setSelected(index); setVisible(1); setPlaying(!(nextCategory === "Activate" && index === 0)); }
  return <section className="agent-use-cases" aria-labelledby="agent-use-cases-title">
    <div className="agent-use-cases-layout">
      <div className="use-case-phone-stage">
        <span className="use-case-stage-label"><span /> A CONVERSATION IN ACTION</span>
        <div className="use-case-iphone">
          <div className={`use-case-phone-screen${example.channel === "whatsapp" ? " is-whatsapp" : ""}`}>
            <div className="use-case-status"><b>9:41</b><span className="use-case-island" /><svg viewBox="0 0 52 16" aria-hidden="true"><path d="M1 12v2h3v-2zm5-3v5h3V9zm5-3v8h3V6zm5-4v12h3V2z" fill="currentColor"/><path d="M23 5q7-7 14 0m-12 3q5-5 10 0m-7 3 2 2 2-2" fill="none" stroke="currentColor" strokeWidth="1.6"/><rect x="40" y="3" width="10" height="10" rx="2" fill="currentColor"/><path d="M51 6v4" stroke="currentColor"/></svg></div>
            <div className="use-case-phone-header"><span className="use-case-back" aria-hidden="true">‹</span><span className="use-case-agent-avatar" style={{ background: business.background, color: business.color }}><svg viewBox="0 0 40 40" role="img" aria-label={`${business.name} profile`}><text x="20" y="25" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700">{business.initials}</text></svg></span><div><strong className="use-case-business-name"><span>{business.name}</span><svg viewBox="0 0 24 24" role="img" aria-label="Illustrative verified business badge"><path fill="#2697ee" d="m12 1 3 2 3.5.5 1 3.5 2.5 2.5-1 3.5.5 3.5-3 2-2 3-3.5-.5-3.5 1L7 20l-3.5-1L3 15.5 1 12l2-3 .5-3.5L7 4l2-3z"/><path d="m7.5 12 3 3 6-6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></strong><small><i /> {isRecorded ? "Recorded call" : "Business account · Demo"}</small></div><PhoneIcon /></div>
            <div className="use-case-chat" key={`${category}-${selected}`} ref={chatRef}>
              <span className="use-case-chat-date">{isRecorded ? "Hindi · Appointment enquiry" : "Conversation preview"}</span>
              {messages.slice(0, visible).map((message, index) => { const customer = isRecorded ? appointmentRecording[index].role === "user" : index % 2 === 1; return <div className={`use-case-message${customer ? " is-customer" : ""}`} key={index}><small>{customer ? "CUSTOMER" : business.name}</small><p>{message}</p><span>9:41 {customer ? "✓✓" : ""}</span></div>; })}
              {!isRecorded && visible < messages.length && <div className="use-case-typing" aria-label={playing ? "Conversation continues" : "Preview paused"}><i /><i /><i /></div>}
            </div>
            <div className="use-case-phone-bottom">{isRecorded ? <><audio ref={audioRef} controls preload="metadata" src="/audio/vozon-appointment-preview-v2.mp3" aria-label="Play Vozon Hindi appointment recording" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onTimeUpdate={event => setVisible(Math.max(1, appointmentRecording.filter(turn => turn.at <= event.currentTarget.currentTime).length))} /><span>Real call excerpt · Hindi · 43 seconds</span></> : example.channel === "whatsapp" ? <><div className="use-case-wa-compose" aria-hidden="true"><b>+</b><span>Message</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M6 11a6 6 0 0 0 12 0m-6 6v4m-3 0h6"/></svg></div><span>WhatsApp conversation preview</span></> : <><span className={`use-case-wave${playing && visible < messages.length ? " is-playing" : ""}`} aria-hidden="true">{Array.from({ length: 30 }, (_, index) => <i key={index} style={{ height: 5 + ((index * 13) % 21), animationDelay: `${index * -.09}s` }} />)}</span><span>Illustrative voice conversation</span></>}</div>
            <span className="use-case-home-indicator" />
          </div>
        </div>
        <div className="use-case-preview-controls">{!isRecorded && <button type="button" aria-label={playing ? "Pause conversation preview" : "Resume conversation preview"} onClick={() => setPlaying(value => !value)}>{playing ? "Ⅱ" : "▶"}</button>}<button type="button" onClick={() => { setVisible(1); if (isRecorded && audioRef.current) { audioRef.current.currentTime = 0; void audioRef.current.play().catch(() => setPlaying(false)); } else { setPlaying(true); } }}>↻ <span>Replay</span></button><span>{isRecorded ? "Recorded call excerpt" : "Illustrative conversation"}</span></div>
      </div>
      <div className="use-case-content">
        <span className="use-case-eyebrow">BUILT FOR THE CONVERSATIONS THAT MATTER</span>
        <h2 id="agent-use-cases-title">One assistant.<br /><span>So many possibilities.</span></h2>
        <p className="use-case-intro">From the first enquiry to the next happy customer. See how Vozon helps at every stage.</p>
        <div className="use-case-tabs" role="tablist" aria-label="Explore agent use cases">{Object.keys(examples).map(tab => <button type="button" role="tab" aria-selected={category === tab} aria-controls="use-case-options" id={`use-case-tab-${tab}`} key={tab} onClick={() => choose(tab, 0)}>{tab}</button>)}</div>
        <div className="use-case-options" role="tabpanel" id="use-case-options" aria-labelledby={`use-case-tab-${category}`}>
          {examples[category].map((item, index) => <div className={`use-case-option${selected === index ? " is-selected" : ""}`} key={item.title}><button type="button" aria-expanded={selected === index} aria-controls={`use-case-detail-${index}`} onClick={() => choose(category, index)}><span className="use-case-option-number">0{index + 1}</span><span>{item.title}</span><b aria-hidden="true">{selected === index ? "−" : "+"}</b></button>{selected === index && <div id={`use-case-detail-${index}`} className="use-case-option-details"><span className="use-case-industry">{item.industry}</span><p>{item.description}</p><span className="use-case-result"><i>✓</i> {item.outcome}</span></div>}</div>)}
        </div>
        <Link className="use-case-cta" href="/contact">Find your use case <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  </section>;
}
