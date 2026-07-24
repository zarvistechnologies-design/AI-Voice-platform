"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { API_URL } from "@/lib/apiBase";
import styles from "./EnquiryChatbot.module.css";

const services = [
  "AI Voice Agents",
  "Customer Support Automation",
  "Sales & Lead Qualification",
  "Appointment Booking",
  "Outbound Campaigns",
  "Voice API & Integrations",
  "Enterprise Solution",
  "Other",
];
const serviceReplies: Record<string, string> = {
  "AI Voice Agents": "Excellent choice! Vozon AI Voice Agents can answer, qualify, book, and support customers with natural conversations.",
  "Customer Support Automation": "Great choice! Vozon can automate routine support calls while smoothly handing complex cases to your team.",
  "Sales & Lead Qualification": "Great choice! Vozon can qualify leads, capture intent, and connect high-value prospects to your sales team.",
  "Appointment Booking": "Excellent! Vozon can book, confirm, and reschedule appointments automatically over calls.",
  "Outbound Campaigns": "Great choice! Vozon can run personalized outbound campaigns and track every customer outcome.",
  "Voice API & Integrations": "Excellent! Our team can connect Vozon voice automation with your CRM, workflows, and existing systems.",
  "Enterprise Solution": "Great choice! Our enterprise team can design a secure, scalable voice automation solution for your operation.",
  "Other": "Absolutely! Tell our solutions team what you need and we’ll help you find the right Vozon setup.",
};
type Step = "service" | "name" | "phone" | "sending" | "done";

function Time() {
  return <small className={styles.time}>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>;
}
function AryaMessage({ children }: { children: React.ReactNode }) {
  return <div className={styles.messageBlock}><span className={styles.sender}>Arya</span><div className={styles.botRow}><span className={styles.miniAvatar}><Image src="/images/support-agent.png" alt="" fill sizes="30px" /></span><div className={styles.botBubble}>{children}</div></div><Time /></div>;
}
function UserMessage({ children }: { children: React.ReactNode }) {
  return <div className={styles.userBlock}><div className={styles.userBubble}>{children}</div><Time /></div>;
}

export function EnquiryChatbot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [error, setError] = useState("");

  function selectService(value: string) {
    setService(value);
    setError("");
    setStep("name");
  }
  function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim().length < 2) return setError("Please enter your name.");
    setError("");
    setStep("phone");
  }
  async function submitPhone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7) return setError("Please enter a valid phone number.");
    setError("");
    setStep("sending");
    try {
      const response = await fetch(API_URL + "/api/public/customer-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "service",
          name: name.trim(),
          phone: phone.trim(),
          service,
          message: "Customer requested information about " + service + ".",
          sourcePage: window.location.href,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to submit your enquiry.");
      setCaseNumber(result.caseNumber);
      setStep("done");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Please try again.");
      setStep("phone");
    }
  }
  function restart() {
    setStep("service"); setService(""); setName(""); setPhone(""); setCaseNumber(""); setError("");
  }

  return <div className={styles.root}>
    {open ? <section className={styles.card} aria-label="Chat with Arya from Vozon">
      <header><div className={styles.identity}><span className={styles.avatar}><Image src="/images/support-agent.png" alt="Arya, Vozon AI assistant" fill sizes="48px" /></span><span><strong>Arya</strong><small><i /> Online · Vozon AI Assistant</small></span></div><button className={styles.close} onClick={() => setOpen(false)} aria-label="Close chat">×</button></header>
      <div className={styles.chat}>
        <AryaMessage>Hi there! 👋 I&apos;m Arya, your AI assistant at Vozon. I help businesses automate customer conversations with AI.<br /><br />What Vozon service are you interested in?</AryaMessage>
        {service ? <UserMessage>{service}</UserMessage> : null}
        {step !== "service" ? <AryaMessage>{serviceReplies[service]} 🚀<br /><br />Let me connect you with our team. Could you share your name?</AryaMessage> : null}
        {name && step !== "name" ? <UserMessage>{name}</UserMessage> : null}
        {step === "phone" || step === "sending" || step === "done" ? <AryaMessage>Nice to meet you, {name.trim()}! 🙏<br /><br />Please share your phone number so our team can reach you.</AryaMessage> : null}
        {phone && (step === "sending" || step === "done") ? <UserMessage>{phone}</UserMessage> : null}
        {step === "sending" ? <AryaMessage><span className={styles.typing}><i /><i /><i /></span></AryaMessage> : null}
        {step === "done" ? <AryaMessage>Thank you, {name.trim()}! ✅<br /><br />We&apos;ve received your request for <strong>“{service}”</strong>. Our team will contact you shortly at {phone}.<br /><br />Is there anything else I can help you with?<small className={styles.caseNo}>{caseNumber}</small></AryaMessage> : null}
      </div>
      <div className={styles.actions}>
        {step === "service" ? <div className={styles.options}>{services.map(item => <button key={item} onClick={() => selectService(item)}>{item}</button>)}</div> : null}
        {step === "name" ? <form onSubmit={saveName}><input autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="Type your name..." maxLength={80} /><button aria-label="Send name">→</button></form> : null}
        {step === "phone" ? <form onSubmit={submitPhone}><input autoFocus value={phone} onChange={event => setPhone(event.target.value)} placeholder="Type your phone number..." inputMode="tel" maxLength={20} /><button aria-label="Send phone">→</button></form> : null}
        {step === "done" ? <button className={styles.restart} onClick={restart}>Explore another service</button> : null}
        {error ? <div className={styles.error}>{error}</div> : null}
      </div>
    </section> : null}
    <button className={styles.launcher} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label="Chat with Arya"><span className={styles.launchAvatar}><Image src="/images/support-agent.png" alt="" fill sizes="54px" /></span>{!open ? <span className={styles.launchText}><small>Need help?</small><strong>Chat with Arya</strong></span> : <span className={styles.launchText}><strong>Close chat</strong></span>}<i className={styles.online} /></button>
  </div>;
}
