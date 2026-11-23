"use client";

import { useEffect, useRef, useState } from "react";
import "./WhatsAppPhoneExperience.css";

type ChatEvent = { from: "customer" | "vozon"; type: "text" | "cart" | "broadcast" | "handoff"; text: string; detail?: string };
type Scenario = {
  label: string;
  contact: string;
  agent: string;
  description: string;
  events: ChatEvent[];
};

const scenarios: Scenario[] = [
  {
    label: "Cart recovery", contact: "Shop support", agent: "Shopping assistant",
    description: "A sample cart reminder opens a two-way chat. The bot answers the shopper's question and points them back to their saved cart.",
    events: [
      { from: "vozon", type: "text", text: "Hi Samira! You left Studio Headphones in your cart. Can I help?" },
      { from: "vozon", type: "cart", text: "Studio Headphones · Blue", detail: "Saved cart · Continue when ready" },
      { from: "customer", type: "text", text: "Is the blue color still available?" },
      { from: "vozon", type: "text", text: "I can help with that and show you the item in your cart." },
      { from: "vozon", type: "text", text: "Your cart link is ready whenever you want to continue." },
    ],
  },
  {
    label: "Campaign broadcast", contact: "Product updates", agent: "Campaign reply agent",
    description: "An approved campaign message reaches its audience. When someone replies, the bot continues as an individual conversation.",
    events: [
      { from: "vozon", type: "broadcast", text: "New arrivals this week", detail: "Sample campaign · Approved audience" },
      { from: "vozon", type: "text", text: "Hi! Our new headset range is here. Want a quick overview?" },
      { from: "customer", type: "text", text: "Tell me about the new headset." },
      { from: "vozon", type: "text", text: "Of course. I can share the available options and help you choose." },
      { from: "customer", type: "text", text: "Please send me the details." },
    ],
  },
  {
    label: "Support handoff", contact: "Customer care", agent: "Support triage agent",
    description: "The bot collects the order number and passes the full WhatsApp conversation to the right support teammate.",
    events: [
      { from: "customer", type: "text", text: "Where is my delivery?" },
      { from: "vozon", type: "text", text: "I can help. Could you share your order number?" },
      { from: "customer", type: "text", text: "It's 2084." },
      { from: "vozon", type: "text", text: "Thanks. I'll pass this to our support team with the details." },
      { from: "vozon", type: "handoff", text: "Support handoff ready", detail: "Order 2084 · Chat summary attached" },
    ],
  },
];

function EventCard({ event }: { event: ChatEvent }) {
  if (event.type === "cart") return <div className="wa-ios-file"><span className="wa-ios-file-icon">BAG</span><span className="wa-ios-card-copy"><strong>{event.text}</strong><small>{event.detail}</small></span></div>;
  if (event.type === "broadcast") return <div className="wa-ios-booking"><span className="wa-ios-card-label">CAMPAIGN MESSAGE · SAMPLE</span><strong>{event.text}</strong><small>{event.detail}</small></div>;
  if (event.type === "handoff") return <div className="wa-ios-payment"><span className="wa-ios-paid">TEAM HANDOFF</span><strong>{event.text}</strong><small>{event.detail}</small></div>;
  return null;
}

export function WhatsAppPhoneExperience() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [characters, setCharacters] = useState(scenarios[0].events[0].text.length);
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
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !inView || !current) return;
    const typing = current.type === "text" && characters < current.text.length;
    const timer = window.setTimeout(() => {
      if (typing) setCharacters((value) => value + 1);
      else { setEventIndex((value) => value + 1); setCharacters(0); }
    }, typing ? 22 : current.type === "text" ? 650 : 1100);
    return () => window.clearTimeout(timer);
  }, [characters, current, eventIndex, inView, reducedMotion, scenarioIndex]);

  useEffect(() => {
    const chat = chatRef.current;
    if (chat) chat.scrollTop = chat.scrollHeight;
  }, [characters, eventIndex, reducedMotion, scenarioIndex]);

  const visibleEvents = reducedMotion ? scenario.events : scenario.events.slice(0, eventIndex + 1);

  return <div className="wa-experience" ref={experienceRef} aria-label="Interactive WhatsApp bot examples">
    <div className="wa-hero-intro"><span>VOZON / WHATSAPP BOT</span><h1>Every message can lead to a better conversation.</h1></div>
    <div className="wa-experience-tabs" role="group" aria-label="Choose a WhatsApp flow">
      {scenarios.map((item, index) => <button aria-pressed={index === scenarioIndex} className={`wa-experience-tab${index === scenarioIndex ? " is-active" : ""}`} key={item.label} onClick={() => { setScenarioIndex(index); setEventIndex(0); setCharacters(item.events[0].text.length); }} type="button">{item.label}</button>)}
    </div>
    <div className="wa-experience-phone-col">
      <div className="wa-iphone" role="img" aria-label={`Illustrative ${scenario.label} WhatsApp conversation`}>
        <div className="wa-iphone-screen">
          <div className="wa-ios-status"><span>09:41</span><span className="wa-ios-signal">▥ ◉ <i /></span></div>
          <div className="wa-ios-chat-header"><span className="wa-ios-back" aria-hidden="true">‹</span><span className="wa-ios-avatar" aria-hidden="true">V</span><span className="wa-ios-contact"><strong>Vozon AI <span className="wa-verified" aria-label="Verified business">✓</span></strong><small>{scenario.contact}</small></span><span className="wa-ios-call" aria-hidden="true">☎</span></div>
          <div className="wa-ios-chat" ref={chatRef} aria-hidden="true"><span className="wa-ios-day">TODAY</span>{visibleEvents.map((event, index) => {
            const isCurrent = !reducedMotion && index === eventIndex;
            const typing = isCurrent && event.type === "text" && characters === 0;
            return <div className={`wa-ios-message ${event.from === "customer" ? "is-customer" : "is-bot"}`} key={`${scenarioIndex}-${index}`}>
              {event.type === "text" ? typing ? <span className="wa-ios-typing"><i /><i /><i /></span> : <span className="wa-ios-message-text">{isCurrent ? event.text.slice(0, characters) : event.text}{isCurrent ? <span className="wa-ios-caret" /> : null}</span> : <EventCard event={event} />}
              <span className="wa-ios-message-time">17:{String(4 + index).padStart(2, "0")}{event.from === "customer" ? " ✓✓" : ""}</span>
            </div>;
          })}</div>
          <div className="wa-ios-compose"><span className="wa-ios-plus" aria-hidden="true">+</span><span className="wa-ios-input">Message <span>◉</span></span><span className="wa-ios-mic" aria-hidden="true">●</span></div>
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
    <div className="wa-flow-transcript" key={scenario.label} aria-live="polite">
      <div className="wa-flow-heading"><span>EXAMPLE WHATSAPP FLOW</span><strong>{scenario.label}</strong></div>
      {scenario.events.map((event, index) => <p className={event.from === "customer" ? "is-customer" : event.type === "text" ? "is-agent" : "is-event"} key={`${index}-${event.text}`}><span>{event.type === "cart" ? "Saved cart: " : event.type === "broadcast" ? "Approved campaign: " : event.type === "handoff" ? "Team handoff: " : ""}{event.text}</span></p>)}
      <div className="wa-flow-foot"><i /><span>{scenario.description}</span></div>
    </div>
    <span className="wa-experience-transcript">{scenario.events.map((event) => `${event.from === "customer" ? "Customer" : "Vozon"}: ${event.text}`).join(" ")}</span>
  </div>;
}
