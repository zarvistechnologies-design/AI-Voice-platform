"use client";

import { useEffect, useRef, useState } from "react";
import "./WhatsAppPhoneExperience.css";

type ChatEvent = { from: "customer" | "vozon"; type: "text" | "brochure" | "booking" | "payment"; text: string };
type Scenario = {
  label: string;
  contact: string;
  agent: string;
  description: string;
  brochure: string;
  booking: string;
  amount: string;
  events: ChatEvent[];
};

const scenarios: Scenario[] = [
  {
    label: "Insurance", contact: "Insurance support", agent: "Lead qualification agent",
    description: "Answers policy questions, shares a coverage guide, books an advisor call, and keeps the next step in one chat.",
    brochure: "Family cover guide.pdf", booking: "Advisor call · Fri, 3:00 PM", amount: "₹7,500",
    events: [
      { from: "customer", type: "text", text: "Hi, I saw your family cover plan online. Can you help?" },
      { from: "vozon", type: "text", text: "Of course. I can answer your questions and share the plan details." },
      { from: "customer", type: "text", text: "Please send the brochure first." },
      { from: "vozon", type: "brochure", text: "Here’s the coverage guide and plan overview." },
      { from: "customer", type: "text", text: "Can I speak with an advisor on Friday?" },
      { from: "vozon", type: "booking", text: "Yes, your advisor call is booked." },
      { from: "customer", type: "text", text: "I’ve completed the sample payment." },
      { from: "vozon", type: "payment", text: "Received. Your confirmation is here." },
    ],
  },
  {
    label: "Healthcare", contact: "Care desk", agent: "Appointment assistant",
    description: "Helps patients find information, sends a care guide, confirms a visit, and shares a payment receipt.",
    brochure: "Patient visit guide.pdf", booking: "Consultation · Fri, 3:00 PM", amount: "₹500",
    events: [
      { from: "customer", type: "text", text: "Hi, I’d like to book a consultation." },
      { from: "vozon", type: "text", text: "I can help. Is Friday afternoon convenient?" },
      { from: "customer", type: "text", text: "Yes. Can you send the clinic details too?" },
      { from: "vozon", type: "brochure", text: "Here is the patient guide with the visit details." },
      { from: "customer", type: "text", text: "Friday at 3 works for me." },
      { from: "vozon", type: "booking", text: "Your visit is confirmed." },
      { from: "customer", type: "text", text: "I’ve paid the sample booking fee." },
      { from: "vozon", type: "payment", text: "Thank you. The receipt is ready here." },
    ],
  },
  {
    label: "E-commerce", contact: "Shop support", agent: "Shopping assistant",
    description: "Answers product questions, sends a product guide, arranges a demo, and confirms a sample payment.",
    brochure: "Product details.pdf", booking: "Product demo · Fri, 3:00 PM", amount: "₹1,999",
    events: [
      { from: "customer", type: "text", text: "Hi, I saw your new headset. What does it include?" },
      { from: "vozon", type: "text", text: "I can share the features, pricing details, and available options." },
      { from: "customer", type: "text", text: "Please send the product guide." },
      { from: "vozon", type: "brochure", text: "Here’s the guide with the full product details." },
      { from: "customer", type: "text", text: "Can I see a demo on Friday?" },
      { from: "vozon", type: "booking", text: "Done. Your product demo is confirmed." },
      { from: "customer", type: "text", text: "I’ve made the sample payment." },
      { from: "vozon", type: "payment", text: "Payment received. Your receipt is below." },
    ],
  },
];

function EventCard({ event, scenario }: { event: ChatEvent; scenario: Scenario }) {
  if (event.type === "brochure") return <div className="wa-ios-file"><span className="wa-ios-file-icon">PDF</span><span className="wa-ios-card-copy"><strong>{scenario.brochure}</strong><small>Brochure · Details included</small></span></div>;
  if (event.type === "booking") return <div className="wa-ios-booking"><span className="wa-ios-card-label">APPOINTMENT CONFIRMED</span><strong>{scenario.booking}</strong><small>Confirmation sent in this chat</small></div>;
  if (event.type === "payment") return <div className="wa-ios-payment"><span className="wa-ios-paid">PAYMENT RECEIVED · SAMPLE</span><strong>{scenario.amount}</strong><small>Receipt shared · Ref VZ-2084</small></div>;
  return null;
}

export function WhatsAppPhoneExperience() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [characters, setCharacters] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const experienceRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const scenario = scenarios[scenarioIndex];
  const current = scenario.events[eventIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = experienceRef.current;
    if (!element) return;
    if (!window.IntersectionObserver) {
      const timer = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !inView || !current) return;
    const typing = current.type === "text" && characters < current.text.length;
    const timer = window.setTimeout(() => {
      if (typing) setCharacters((value) => value + 1);
      else { setEventIndex((value) => value + 1); setCharacters(0); }
    }, typing ? 22 : current.type === "text" ? 600 : 1100);
    return () => window.clearTimeout(timer);
  }, [characters, current, eventIndex, inView, reducedMotion, scenarioIndex]);

  useEffect(() => {
    const chat = chatRef.current;
    if (chat) chat.scrollTop = chat.scrollHeight;
  }, [characters, eventIndex, reducedMotion, scenarioIndex]);

  const visibleEvents = reducedMotion ? scenario.events : scenario.events.slice(0, eventIndex + 1);
  const replay = () => { setEventIndex(0); setCharacters(0); };

  return <div className="wa-experience" ref={experienceRef} aria-label="Interactive WhatsApp bot example">
    <div className="wa-experience-tabs" role="group" aria-label="Choose an industry">
      {scenarios.map((item, index) => <button aria-pressed={index === scenarioIndex} className={`wa-experience-tab${index === scenarioIndex ? " is-active" : ""}`} key={item.label} onClick={() => { setScenarioIndex(index); setEventIndex(0); setCharacters(0); }} type="button">{item.label}</button>)}
    </div>
    <div className="wa-experience-phone-col">
      <div className="wa-iphone" role="img" aria-label={`${scenario.label} WhatsApp conversation showing a brochure, appointment confirmation, and sample payment receipt`}>
        <div className="wa-iphone-screen">
          <div className="wa-ios-status"><span>09:41</span><span className="wa-ios-signal">▥ ◉ <i /></span></div>
          <div className="wa-ios-chat-header"><span className="wa-ios-back" aria-hidden="true">‹</span><span className="wa-ios-avatar" aria-hidden="true">V</span><span className="wa-ios-contact"><strong>{scenario.contact}</strong><small>Vozon AI · Online</small></span><span className="wa-ios-call" aria-hidden="true">☎</span></div>
          <div className="wa-ios-chat" ref={chatRef} aria-hidden="true"><span className="wa-ios-day">TODAY</span>{visibleEvents.map((event, index) => {
            const isCurrent = !reducedMotion && index === eventIndex;
            const typing = isCurrent && event.type === "text" && characters === 0;
            return <div className={`wa-ios-message ${event.from === "customer" ? "is-customer" : "is-bot"}`} key={`${scenarioIndex}-${index}`}>
              {typing ? <span className="wa-ios-typing"><i /><i /><i /></span> : <span className="wa-ios-message-text">{isCurrent && event.type === "text" ? event.text.slice(0, characters) : event.text}{isCurrent && event.type === "text" ? <span className="wa-ios-caret" /> : null}</span>}
              <EventCard event={event} scenario={scenario} />
              <span className="wa-ios-message-time">17:{String(4 + index).padStart(2, "0")}{event.from === "customer" ? " ✓✓" : ""}</span>
            </div>;
          })}</div>
          <div className="wa-ios-compose"><span className="wa-ios-plus" aria-hidden="true">+</span><span className="wa-ios-input">Message <span>◎</span></span><span className="wa-ios-mic" aria-hidden="true">●</span></div>
          <div className="wa-ios-keyboard" aria-hidden="true">
            <div className="wa-ios-suggestions"><span>⌄</span><span>The</span><span>I&apos;m</span><span>♧</span></div>
            {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, rowIndex) => <div className="wa-ios-key-row" key={row}>
              {rowIndex === 2 ? <span className="wa-ios-key is-special">⇧</span> : null}
              {row.split("").map((letter) => <span className="wa-ios-key" key={letter}>{letter}</span>)}
              {rowIndex === 2 ? <span className="wa-ios-key is-special">⌫</span> : null}
            </div>)}
            <div className="wa-ios-key-row"><span className="wa-ios-key is-special">123</span><span className="wa-ios-key is-space">space</span><span className="wa-ios-key is-special">↵</span></div>
            <div className="wa-ios-bottom"><span>◎</span><span>EN</span><span>⌄</span></div>
          </div>
          <span className="wa-ios-home" aria-hidden="true" />
        </div>
      </div>
    </div>
    <div className="wa-agent-panel"><div className="wa-agent-card"><h3>{scenario.agent}</h3><p>{scenario.description}</p><a className="wa-agent-phone" href="tel:+917892518414"><span className="wa-flag-india" aria-hidden="true" /> +91 78925 18414</a><button aria-label={`Replay the ${scenario.label} WhatsApp demo`} className="wa-agent-replay" onClick={replay} type="button">Try the agent</button></div></div>
    <span className="wa-experience-transcript">{scenario.events.map((event) => `${event.from === "customer" ? "Customer" : "Vozon"}: ${event.text}`).join(" ")}</span>
  </div>;
}
