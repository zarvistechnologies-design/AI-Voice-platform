"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { customerReviews } from "@/config/customerReviews";

import styles from "./HomeDesignFour.module.css";
import "./HomeDesignFourGrid.css";
import "./HomeDesignFourHero.css";
import "./HomeDesignFourSections.css";
import "./HomeDesignFourEnding.css";

const voiceLanguages = [
  { label: "English", voice: "Liza", detail: "Female (Voice)" },
  { label: "Hindi", voice: "Amit", detail: "Male (Voice)" },
  { label: "ગુજરાતી", voice: "Nisha", detail: "Female (Voice)" },
  { label: "ಕನ್ನಡ", voice: "Rohan", detail: "Male (Voice)" },
  { label: "বাংলা", voice: "Ishani", detail: "Female (Voice)" },
  { label: "मराठी", voice: "Aarav", detail: "Male (Voice)" },
  { label: "தமிழ்", voice: "Kavya", detail: "Female (Voice)" },
  { label: "తెలుగు", voice: "Arjun", detail: "Male (Voice)" },
  { label: "Français", voice: "Camille", detail: "Female (Voice)" },
  { label: "Español", voice: "Sofia", detail: "Female (Voice)" },
] as const;

const steps = [
  { number: "01", title: "Configure the agent", copy: "Build call flows with a no-code editor, set handoff rules, and connect your business knowledge." },
  { number: "02", title: "Choose the model", copy: "Pick the right AI model for your use case. Use leading models or bring your own." },
  { number: "03", title: "Pick the voice", copy: "Choose natural voices, languages, and a consistent brand identity for every conversation." },
  { number: "04", title: "Deploy everywhere", copy: "Launch across phone, web, mobile, WhatsApp, and your existing business tools." },
] as const;

const industries = [
  { title: "Banking & Finance", tab: "Banking & Finance", image: "/images/1.png" },
  { title: "Healthcare", tab: "Healthcare", image: "/images/2.png" },
  { title: "Hospitality", tab: "Hospitality", image: "/images/3.png" },
  { title: "Education & EdTech", tab: "Education & EdTech", image: "/images/4.png" },
  { title: "B2B Goods and Services", tab: "B2B Goods & Services", image: "/images/5.png" },
] as const;

const insights = [
  { title: "Customer Sentiment", meta: "MAY 15, 2026  •", tone: "coral" },
  { title: "Conversation Quality", meta: "FEBRUARY 20, 2026  •  8 MIN", tone: "blue" },
  { title: "Intent Detection", meta: "JANUARY 16, 2026  •  6 MIN", tone: "aqua" },
  { title: "Conversation Trends", meta: "JANUARY 12, 2026  •", tone: "peach" },
] as const;

const faqs = [
  ["Can I test Vozon for free?", "Yes. You can create an account, configure an agent and experience the platform before choosing a production plan."],
  ["How does voice AI work?", "Vozon combines speech recognition, language models, natural voice synthesis and your connected business tools in one realtime conversation."],
  ["Which languages are supported?", "Vozon supports Indian and global languages, with voices and models chosen to suit each use case."],
  ["What happens if a call needs a human?", "Vozon can transfer the conversation to the right team member with the caller's context and collected details intact."],
  ["Can Vozon connect with our existing tools?", "Yes. Use native integrations, APIs and webhooks to connect CRMs, calendars, knowledge sources and internal workflows."],
  ["Is Vozon built for enterprise?", "Yes. Enterprise controls include protected access, configurable data handling, auditability and flexible deployment options."],
] as const;

function Arrow() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
}

type WorkflowIconName = "analytics" | "book" | "chat" | "chip" | "claude" | "code" | "cube" | "flow" | "globe" | "handoff" | "integrations" | "meta" | "microphone" | "mobile" | "openai" | "phone" | "server" | "settings" | "sliders" | "sparkles" | "team" | "user" | "whatsapp";

function WorkflowIcon({ name }: { name: WorkflowIconName }) {
  const props = { "aria-hidden": true, className: `design-four-workflow-icon is-${name}`, viewBox: "0 0 24 24" } as const;
  if (name === "phone") return <svg {...props}><path d="M6.6 3.5 9 7.2 7.4 9a14.3 14.3 0 0 0 7.6 7.6l1.8-1.6 3.7 2.4-.8 2.1c-.3.8-1.1 1.2-1.9 1.1A17 17 0 0 1 3.4 6.2c-.1-.8.3-1.6 1.1-1.9l2.1-.8Z" /></svg>;
  if (name === "sparkles") return <svg {...props}><path d="m12 2 1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></svg>;
  if (name === "chat") return <svg {...props}><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></svg>;
  if (name === "handoff") return <svg {...props}><circle cx="12" cy="7" r="3" /><path d="M6 20v-2a6 6 0 0 1 12 0v2M3 12h4m-2-2 2 2-2 2M21 12h-4m2-2-2 2 2 2" /></svg>;
  if (name === "flow") return <svg {...props}><circle cx="12" cy="4" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><path d="M12 6v5M5 17v-3h14v3M12 11H5v3M12 11h7v3" /></svg>;
  if (name === "book") return <svg {...props}><path d="M3 5.5A5.5 5.5 0 0 1 12 8v12a5.5 5.5 0 0 0-9-2.5v-12ZM21 5.5A5.5 5.5 0 0 0 12 8v12a5.5 5.5 0 0 1 9-2.5v-12Z" /></svg>;
  if (name === "openai") return <svg aria-hidden="true" className="design-four-workflow-icon is-openai" viewBox="118.557 119.958 484.139 479.818"><path d="M304.246 294.611V249.028c0-3.839 1.441-6.719 4.798-8.636l91.648-52.78c12.475-7.197 27.35-10.554 42.702-10.554 57.577 0 94.046 44.624 94.046 92.124 0 3.358 0 7.197-.481 11.036l-95.005-55.66c-5.757-3.357-11.517-3.357-17.274 0l-120.434 70.053Zm213.999 177.534V363.224c0-6.719-2.881-11.517-8.637-14.875l-120.434-70.053 39.345-22.553c3.358-1.917 6.238-1.917 9.596 0l91.647 52.78c26.392 15.356 44.143 47.982 44.143 79.648 0 36.465-21.59 70.054-55.66 83.97v.004ZM275.937 376.182l-39.345-23.03c-3.357-1.917-4.798-4.798-4.798-8.637V238.956c0-51.339 39.345-90.207 92.606-90.207 20.155 0 38.864 6.719 54.702 18.714l-94.524 54.701c-5.756 3.357-8.636 8.155-8.636 14.875v139.147l-.005-.004Zm84.689 48.94-56.38-31.667v-67.172l56.38-31.667 56.376 31.667v67.172l-56.376 31.667Zm36.226 145.867c-20.154 0-38.863-6.719-54.701-18.713l94.523-54.702c5.757-3.357 8.637-8.155 8.637-14.875V343.552l39.827 23.03c3.357 1.917 4.798 4.797 4.798 8.637v105.559c0 51.339-39.827 90.207-93.084 90.207v.004ZM283.134 463.99l-91.648-52.779c-26.392-15.357-44.143-47.982-44.143-79.649 0-36.946 22.072-70.053 56.137-83.969v109.398c0 6.719 2.881 11.517 8.637 14.875l119.957 69.571-39.345 22.553c-3.357 1.917-6.238 1.917-9.595 0Zm-5.275 78.69c-54.22 0-94.046-40.785-94.046-91.166 0-3.839.481-7.678.958-11.517l94.524 54.701c5.756 3.358 11.517 3.358 17.273 0l120.434-69.571v45.583c0 3.839-1.44 6.719-4.798 8.636l-91.647 52.78c-12.476 7.197-27.351 10.554-42.703 10.554h.005Zm118.993 57.096c58.059 0 106.518-41.263 117.558-95.964 53.739-13.916 88.286-64.297 88.286-115.636 0-33.589-14.393-66.214-40.304-89.726 2.399-10.077 3.839-20.154 3.839-30.226 0-68.613-55.66-119.957-119.957-119.957-12.952 0-25.428 1.917-37.904 6.238-21.595-21.113-51.344-34.547-83.97-34.547-58.058 0-106.517 41.262-117.557 95.963-53.739 13.916-88.286 64.297-88.286 115.636 0 33.589 14.393 66.214 40.304 89.726-2.399 10.077-3.839 20.154-3.839 30.227 0 68.613 55.66 119.956 119.956 119.956 12.953 0 25.429-1.917 37.905-6.238 21.59 21.113 51.339 34.548 83.969 34.548Z" /></svg>;
  if (name === "claude") return <svg {...props}><text x="3" y="17">AI</text></svg>;
  if (name === "meta") return <svg {...props}><path d="M3 12c2.4-4.5 4.4-6 6.4-6 4.1 0 5.2 12 9.2 12 2 0 3.4-2.5 3.4-6s-1.4-6-3.4-6c-4 0-5.1 12-9.2 12-2 0-4-1.5-6.4-6Z" /></svg>;
  if (name === "cube") return <svg {...props}><path d="m12 2 9 5-9 5-9-5 9-5ZM3 7v10l9 5 9-5V7M12 12v10" /></svg>;
  if (name === "chip") return <svg {...props}><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3M9 9h6v6H9z" /></svg>;
  if (name === "server") return <svg {...props}><rect x="4" y="3" width="16" height="7" rx="2" /><rect x="4" y="14" width="16" height="7" rx="2" /><path d="M8 6.5h.01M8 17.5h.01M12 6.5h5M12 17.5h5" /></svg>;
  if (name === "globe") return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>;
  if (name === "microphone") return <svg {...props}><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7" /></svg>;
  if (name === "sliders") return <svg {...props}><path d="M4 7h10M18 7h2M4 17h2M10 17h10M9 4v6M15 14v6" /></svg>;
  if (name === "whatsapp") return <svg {...props}><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z" /><path d="M9 8.5c.7 2.8 2 4.1 4.8 4.8" /></svg>;
  if (name === "mobile") return <svg {...props}><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M10 18h4" /></svg>;
  if (name === "code") return <svg {...props}><path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 3l-4 18" /></svg>;
  if (name === "integrations") return <svg {...props}><circle cx="12" cy="5" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><path d="m11 7-5 9m7-9 5 9M7 18h10" /></svg>;
  if (name === "analytics") return <svg {...props}><path d="M5 20v-6M10 20V8M15 20V4M20 20V11" /></svg>;
  if (name === "team") return <svg {...props}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M14 14.5a5 5 0 0 1 7 4.5v1" /></svg>;
  if (name === "user") return <svg {...props}><circle cx="12" cy="7" r="3" /><path d="M5 21v-2a7 7 0 0 1 14 0v2H5Z" /></svg>;
  if (name === "settings") return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /></svg>;
  return null;
}

function StepMiniVisual({ index }: { index: number }) {
  if (index === 0) return <div className="design-four-step-visual design-four-flow"><div className="design-four-flow-grid"><span><i className="green"><WorkflowIcon name="phone" /></i><b>Incoming Call<small>Customer calls</small></b></span><span><i className="purple"><WorkflowIcon name="sparkles" /></i><b>Check Intent<small>Understand request</small></b></span><span><i className="blue"><WorkflowIcon name="chat" /></i><b>AI Response<small>Handle with AI</small></b></span><span><i className="orange"><WorkflowIcon name="user" /></i><b>Human Handoff<small>Transfer to human</small></b></span></div><div className="design-four-card-tools"><span><WorkflowIcon name="flow" /><small>Flow builder</small></span><span><WorkflowIcon name="book" /><small>Knowledge base</small></span><span><WorkflowIcon name="user" /><small>Handoff rules</small></span></div></div>;
  if (index === 1) return <div className="design-four-step-visual design-four-models"><div className="design-four-model-list"><span><i><WorkflowIcon name="openai" /></i><b>OpenAI<small>GPT-4o</small></b><em className="selected" /></span><span><i><WorkflowIcon name="claude" /></i><b>Claude<small>Claude 3.5</small></b><em /></span><span><i><WorkflowIcon name="meta" /></i><b>Llama<small>Llama 3</small></b><em /></span><span><i><WorkflowIcon name="cube" /></i><b>Custom Model<small>Bring your own</small></b><em /></span></div><div className="design-four-card-tools"><span><WorkflowIcon name="chip" /><small>Latest models</small></span><span><WorkflowIcon name="server" /><small>Self-hosted</small></span><span><WorkflowIcon name="cube" /><small>Custom models</small></span></div></div>;
  if (index === 2) return (
    <div className="design-four-step-visual design-four-voice">
      <div className="design-four-voice-controls">
        <b aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></b>
        <button aria-label="Play voice" type="button"><span aria-hidden="true" /></button>
      </div>
      <div className="design-four-voice-choice"><span>Aria (Natural)</span><i aria-hidden="true" /></div>
      <div className="design-four-voice-flags" aria-label="Available languages">
        <i className="is-us" title="English (US)" /><i className="is-gb" title="English (UK)" /><i className="is-in" title="Hindi" /><i className="is-es" title="Spanish" /><i className="is-fr" title="French" />
        <button aria-label="View more languages" type="button">+</button>
      </div>
      <div className="design-four-card-tools">
        <span><WorkflowIcon name="globe" /><small>40+ languages</small></span>
        <span><WorkflowIcon name="microphone" /><small>Natural voices</small></span>
        <span><WorkflowIcon name="sliders" /><small>Voice cloning</small></span>
      </div>
    </div>
  );
  return <div className="design-four-step-visual design-four-deploy"><div className="design-four-deploy-grid"><span><b><WorkflowIcon name="phone" /></b><i>Phone</i></span><span><b><WorkflowIcon name="globe" /></b><i>Web</i></span><span><b className="green-icon"><WorkflowIcon name="whatsapp" /></b><i>WhatsApp</i></span><span><b className="purple-icon"><WorkflowIcon name="mobile" /></b><i>Mobile</i></span><span><b><WorkflowIcon name="code" /></b><i>SDK</i></span><span><b className="orange-icon"><WorkflowIcon name="integrations" /></b><i>Integrations</i></span></div><div className="design-four-card-tools"><span><WorkflowIcon name="analytics" /><small>Analytics</small></span><span><WorkflowIcon name="team" /><small>Team access</small></span><span><WorkflowIcon name="settings" /><small>Enterprises</small></span></div></div>;
}

export function HomeDesignFour() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const selectedIndustry = industries[activeIndustry];
  const selectedVoice = voiceLanguages[activeLanguage];
  const previousVoice = voiceLanguages[(activeLanguage - 1 + voiceLanguages.length) % voiceLanguages.length];
  const nextVoice = voiceLanguages[(activeLanguage + 1) % voiceLanguages.length];

  return (
    <div className={`${styles.page} home-design-four`}>
      <SiteHeader />

      <main>
        <section className={`${styles.hero} home-design-four__hero`}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className="design-four-hero__features" aria-label="Platform capabilities">
            <span><i>✓</i>Natural conversations</span>
            <span><i>✓</i>Multilingual speech</span>
            <span><i>✓</i>Flexible voice stack</span>
          </div>
          <h1>One platform. Every niche. Voice<br className="design-four-desktop-break" /> agents that already speak your <strong>Industrial language.</strong></h1>
          <form
            className="design-four-phone"
            onSubmit={(event) => {
              event.preventDefault();
              window.location.href = phoneNumber ? `/contact?phone=${encodeURIComponent(phoneNumber)}` : "/contact";
            }}
          >
            <span className="design-four-india-flag" aria-label="India" />
            <input aria-label="Phone number" onChange={(event) => setPhoneNumber(event.target.value)} placeholder="Phone Number" type="tel" value={phoneNumber} />
            <button type="submit">Try an agent</button>
          </form>
          <div className="design-four-trust-pill">Trusted by <strong>100+</strong> teams building the future of <strong>customer conversations</strong></div>
          <div className="design-four-hero__ambient" aria-hidden="true">
            <i /><i /><i />
          </div>
        </section>

        <section className={`${styles.logoStrip} home-design-four__logos`} aria-label="Companies using modern voice workflows">
          <div className="design-four-client-marquee-track">
            <div className="design-four-client-marquee-group">
            <b className="design-four-client-logo is-deloitte" aria-label="Deloitte">Deloitte<span>.</span></b>
            <b className="design-four-client-logo is-appsmith" aria-label="Appsmith">appsmith_</b>
            <b className="design-four-client-logo is-vigilant" aria-label="Vigilant">Vigilant</b>
            <b className="design-four-client-logo is-edison" aria-label="Edison">
              <svg aria-hidden="true" viewBox="0 0 28 28"><rect x="1" y="2" width="22" height="6" rx="1" /><rect x="1" y="11" width="16" height="6" rx="1" /><rect x="1" y="20" width="22" height="6" rx="1" /></svg>
              <em>ed.is.on</em>
            </b>
            <b className="design-four-client-logo is-kobe" aria-label="Kobe Creations">
              <svg aria-hidden="true" viewBox="0 0 34 34"><path d="M17 3c5 3 7 7 5 12-2 4-6 5-10 3 3-2 4-5 3-8-1-2 0-5 2-7Z" /><path d="M30 19c-1 6-4 9-10 9-4 0-7-3-7-7 3 2 6 1 8-1 2-2 5-3 9-1Z" /><path d="M7 29c-4-4-5-9-2-13 2-4 6-5 10-3-3 2-4 5-3 8 1 3-1 6-5 8Z" /></svg>
              <em>Kobe<br />Creations</em>
            </b>
            <b className="design-four-client-logo is-simplamo" aria-label="Simplamo">
              <svg aria-hidden="true" viewBox="0 0 36 32"><circle cx="13" cy="12" r="9" /><circle cx="21" cy="18" r="9" /><path d="M4 25c7 5 18 5 27-1" /></svg>
              <em>Simplamo<sup>®</sup></em>
            </b>
            <b className="design-four-client-logo is-soulpage" aria-label="Soulpage">
              <svg aria-hidden="true" viewBox="0 0 24 28"><path d="M2 2h18v9H11v3h9v12H2v-9h9v-3H2V2Z" /></svg>
              <em>SOULPAGE</em>
            </b>
            <b className="design-four-client-logo is-hubspot">HubSpot</b>
            <b className="design-four-client-logo is-shopify">Shopify</b>
            <b className="design-four-client-logo is-zendesk">zendesk</b>
            <b className="design-four-client-logo is-digitalbot" aria-label="DigitalBot">DigitalBot</b>
            </div>
            <div aria-hidden="true" className="design-four-client-marquee-group">
              <b className="design-four-client-logo is-deloitte">Deloitte<span>.</span></b>
              <b className="design-four-client-logo is-appsmith">appsmith_</b>
              <b className="design-four-client-logo is-vigilant">Vigilant</b>
              <b className="design-four-client-logo is-edison">
                <svg aria-hidden="true" viewBox="0 0 28 28"><rect x="1" y="2" width="22" height="6" rx="1" /><rect x="1" y="11" width="16" height="6" rx="1" /><rect x="1" y="20" width="22" height="6" rx="1" /></svg>
                <em>ed.is.on</em>
              </b>
              <b className="design-four-client-logo is-kobe">
                <svg aria-hidden="true" viewBox="0 0 34 34"><path d="M17 3c5 3 7 7 5 12-2 4-6 5-10 3 3-2 4-5 3-8-1-2 0-5 2-7Z" /><path d="M30 19c-1 6-4 9-10 9-4 0-7-3-7-7 3 2 6 1 8-1 2-2 5-3 9-1Z" /><path d="M7 29c-4-4-5-9-2-13 2-4 6-5 10-3-3 2-4 5-3 8 1 3-1 6-5 8Z" /></svg>
                <em>Kobe<br />Creations</em>
              </b>
              <b className="design-four-client-logo is-simplamo">
                <svg aria-hidden="true" viewBox="0 0 36 32"><circle cx="13" cy="12" r="9" /><circle cx="21" cy="18" r="9" /><path d="M4 25c7 5 18 5 27-1" /></svg>
                <em>Simplamo<sup>&reg;</sup></em>
              </b>
              <b className="design-four-client-logo is-soulpage">
                <svg aria-hidden="true" viewBox="0 0 24 28"><path d="M2 2h18v9H11v3h9v12H2v-9h9v-3H2V2Z" /></svg>
                <em>SOULPAGE</em>
              </b>
              <b className="design-four-client-logo is-hubspot">HubSpot</b>
              <b className="design-four-client-logo is-shopify">Shopify</b>
              <b className="design-four-client-logo is-zendesk">zendesk</b>
              <b className="design-four-client-logo is-digitalbot">DigitalBot</b>
            </div>
          </div>
        </section>

        <section className="design-four-voice-section" id="platform">
          <div className="design-four-language-tabs" role="tablist" aria-label="Voice languages">
            {voiceLanguages.map((language, index) => <button aria-selected={activeLanguage === index} className={activeLanguage === index ? "is-active" : ""} key={language.label} onClick={() => setActiveLanguage(index)} role="tab" type="button">{language.label}</button>)}
            <Link href="/services/text-to-speech">View all 15 languages</Link>
          </div>
          <div className="design-four-voice-layout">
            <div className="design-four-voice-copy">
              <h2 className="leading-tight tracking-tight">Vozon.ai named a next generation<br className="hidden md:block" />platform for Enterprise Voice AI,<br className="hidden md:block" />transforming conversations into<br className="hidden md:block" />business outcomes</h2>
              <p>Build intelligent voice agents, connect your business systems, and automate customer conversations with Vozon.</p>
              <Link href="/product" className="rounded-lg bg-[#108D82] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#108D82]">Explore Vozon</Link>
            </div>
            <div className="design-four-voice-player">
              <button aria-label={voicePlaying ? "Pause voice preview" : "Play voice preview"} className={`design-four-voice-disc${voicePlaying ? " is-playing" : ""}`} onClick={() => setVoicePlaying((playing) => !playing)} type="button"><span>{voicePlaying ? "Ⅱ" : "▶"}</span></button>
              <div className="design-four-voice-selector">
                <div className="design-four-voice-neighbor" aria-hidden="true"><b>{previousVoice.voice}</b><span>{previousVoice.detail}</span></div>
                <button aria-label="Previous voice" onClick={() => setActiveLanguage((activeLanguage - 1 + voiceLanguages.length) % voiceLanguages.length)} type="button">‹</button>
                <div className="design-four-voice-current"><b>{selectedVoice.voice}</b><span>{selectedVoice.detail}</span></div>
                <button aria-label="Next voice" onClick={() => setActiveLanguage((activeLanguage + 1) % voiceLanguages.length)} type="button">›</button>
                <div className="design-four-voice-neighbor" aria-hidden="true"><b>{nextVoice.voice}</b><span>{nextVoice.detail}</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="design-four-launch-section">
          <div className="design-four-launch-heading">
            <div><span>Launch Workflow</span><h2>Go live in four clear<br />implementation steps.</h2></div>
            <Link href="/docs">Learn More</Link>
          </div>
          <div className="design-four-step-grid">
            {steps.map((step, index) => (
              <article key={step.number}>
                <b className="design-four-step-number">{step.number}</b><h3>{step.title}</h3><p>{step.copy}</p><StepMiniVisual index={index} />
              </article>
            ))}
          </div>
          <p className="design-four-launch-note">Configure your agent, choose the right model and voice, then deploy it across your preferred channels.</p>
        </section>

        <section className="design-four-outcomes-section">
          <h2>Everyday Calls. Extraordinary Outcomes.</h2>
          <div className="design-four-metrics">
            <div><strong>1 Billion</strong><span>calls supported</span></div><div><strong>99.9%</strong><span>uptime for enterprise<br />clients</span></div><div><strong>2.5M+</strong><span>agents launched</span></div><div><strong>750K+</strong><span>developers</span></div><div><strong>&lt;500ms</strong><span>average latency</span></div>
          </div>
          <div className="design-four-agent-banner">
            <div><small>The Vozon.ai Voice AI Agent Platform</small><h3><strong>Vozon</strong> Voice Agents</h3><p>From the first hello to the final action, Vozon agents understand conversations, access your systems, and complete workflows in real time.</p></div>
            <Link href="/services/voice-agents" aria-label="Explore voice agents"><Arrow /></Link>
          </div>
        </section>

        <section className="design-four-industry-section" id="industries">
          <div className="design-four-industry-copy">
            <h2>Built for<br /><strong>businesses</strong> that run<br />on <strong>conversations</strong></h2>
            <p>From financial services to healthcare and commerce, Vozon helps teams automate high-volume conversations without losing the human experience.</p>
            <div><Link href="/contact">Talk to Sales</Link><Link href="/contact">Request A Demo</Link></div>
          </div>
          <div className="design-four-industry-experience">
            <div className="design-four-industry-tabs" role="tablist" aria-label="Choose an industry">
              {industries.map((industry, index) => (
                <button aria-controls="industry-panel" aria-selected={activeIndustry === index} className={activeIndustry === index ? "is-active" : ""} id={`industry-tab-${index}`} key={industry.title} onClick={() => setActiveIndustry(index)} role="tab" type="button">{industry.tab}</button>
              ))}
            </div>
            <article aria-labelledby={`industry-tab-${activeIndustry}`} className="design-four-industry-panel" id="industry-panel" key={selectedIndustry.title} role="tabpanel">
              <Image alt={`${selectedIndustry.title} business solutions`} fill priority={activeIndustry === 0} sizes="(max-width: 760px) 100vw, 66vw" src={selectedIndustry.image} />
            </article>
          </div>
        </section>

        <section className="design-four-testimonials-section">
          <div className="design-four-testimonial-heading">
            <span>Trusted Clients says</span><h2>What our customers say</h2><p><strong>4.5/5.0</strong> <b>★★★★★</b> (Trusted by 100+ companies)</p>
          </div>
          <div className="design-four-review-grid">
            {customerReviews.slice(0, 6).map((item) => (
              <article key={item.name}><blockquote>{item.quote}</blockquote><footer><span>{item.name.slice(0,1)}</span><div><b>{item.name}</b><small>{item.role}</small></div><i>𝕏</i></footer></article>
            ))}
          </div>
          <Link className="design-four-review-button" href="/reviews">View all Reviews</Link>
        </section>

        <section className={`${styles.insights} home-design-four__section design-four-insights-section`} id="insights">
          <div className={`${styles.insightHeader} design-four-insights-header`}>
            <h2>AI Insights</h2>
            <Link className={`${styles.secondaryButton} design-four-insights-more`} href="/resources/blog">View More</Link>
          </div>
          <div className={`${styles.insightGrid} design-four-insights-grid`}>
            <Link className={`${styles.featuredInsight} design-four-featured-insight`} href="/resources/blog">
              <div className={`${styles.abstractArt} design-four-insight-art`} aria-hidden="true"><span /><i /><b /></div>
              <div className="design-four-featured-caption"><small>MAY 15, 2026&nbsp;&nbsp;•</small><h3>Understand what your<br />customers are really saying.</h3></div>
            </Link>
            <div className={`${styles.insightList} design-four-insight-list`}>{insights.map((item) => <Link className="design-four-insight-item" href="/resources/blog" key={item.title}><span className={`${styles.miniArt} ${styles[item.tone]} design-four-insight-thumb is-${item.tone}`} aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.meta}</p></div><Arrow /></Link>)}</div>
          </div>
        </section>

        <section className="design-four-support-section" id="faq">
          <div className="design-four-security-row">
            <div><h2>Scale with security</h2><p>Built with the reliability, privacy, and controls modern businesses expect from their voice infrastructure.</p><div><Link href="/contact">Talk to Sales</Link><Link href="/resources/trust-center">View Security</Link></div></div>
            <div className="design-four-compliance" aria-label="Security and compliance certifications"><span><small>Information Security Management</small><b>ISO</b><i>27001</i></span><span><small>HIPAA Compliance</small><b>⚕</b><i>HIPAA</i></span><span><small>European Union</small><b>GDPR</b><i>READY</i></span><span><small>AICPA</small><b>SOC 2</b><i>TYPE II</i></span></div>
          </div>
          <div className="design-four-faq-row">
            <div className="design-four-faq-intro"><span>Common questions</span><h2>Frequently<br />asked <strong>questions</strong></h2><aside><i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 13v-2a8 8 0 0 1 16 0v2" /><path d="M6 12H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1v-6ZM18 12h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v-6Z" /><path d="M19 18v.25A2.75 2.75 0 0 1 16.25 21H14" /><circle cx="13" cy="21" r="1" /></svg></i><b>Can’t find your answer?</b><Link href="/contact">Contact us</Link></aside></div>
            <div className="design-four-faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 1}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
          </div>
        </section>

        <section className="design-four-integrations-section" id="integrations">
          <div className="design-four-integration-copy"><span>Integrations</span><h2>Don’t replace.<br /><strong>Integrate.</strong></h2><Link href="/dashboard">Get Started</Link></div>
          <div className="design-four-integration-icons" aria-label="Supported integrations">
            <span className="calendar"><Image alt="Google Calendar" height={65} src="/images/integrations/google-calendar.svg" width={65} /></span>
            <span className="crm">CRM</span>
            <span aria-label="Facebook" className="facebook"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14.5 8H19l-.7 5h-3.8v10H9V13H6V8h3V5.2C9 1.4 11.3 0 15.1 0c1.5 0 3 .2 3.9.4V5h-2.7c-1.3 0-1.8.7-1.8 1.7V8Z" /></svg></span>
            <span aria-label="Twilio" className="twilio"><svg aria-hidden="true" viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" /><circle cx="23" cy="23" r="7" /><circle cx="41" cy="23" r="7" /><circle cx="23" cy="41" r="7" /><circle cx="41" cy="41" r="7" /></svg></span>
            <span className="gmail"><Image alt="Gmail" height={72} src="/images/integrations/gmail.svg" width={72} /></span>
            <span aria-label="Salesforce" className="salesforce"><svg aria-hidden="true" viewBox="0 0 110 78"><path d="M44 16a22 22 0 0 1 35 7 18 18 0 1 1 7 35H27a20 20 0 1 1 6-39 23 23 0 0 1 11-3Z" /><text x="20" y="48">salesforce</text></svg></span>
            <span aria-label="Instagram" className="instagram"><svg aria-hidden="true" viewBox="0 0 64 64"><defs><radialGradient id="design-four-instagram" cx="25%" cy="100%" r="115%"><stop offset="0" stopColor="#ffd600" /><stop offset=".35" stopColor="#ff7a00" /><stop offset=".62" stopColor="#ff0169" /><stop offset="1" stopColor="#7a37c9" /></radialGradient></defs><rect width="64" height="64" rx="16" fill="url(#design-four-instagram)" /><rect x="14" y="14" width="36" height="36" rx="11" fill="none" stroke="#fff" strokeWidth="4" /><circle cx="32" cy="32" r="9" fill="none" stroke="#fff" strokeWidth="4" /><circle cx="45" cy="19" r="3" fill="#fff" /></svg></span>
            <span aria-label="WhatsApp" className="whatsapp"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg></span>
            <span className="hubspot"><svg aria-hidden="true" viewBox="0 0 64 64"><path d="M31 21v14m0 0 12 7M31 35 20 46M39 16l4-5" fill="none" stroke="#f45112" strokeWidth="6" strokeLinecap="round"/><circle cx="31" cy="18" r="6" fill="#f45112"/><circle cx="47" cy="45" r="7" fill="#f45112"/><circle cx="17" cy="49" r="7" fill="#f45112"/><circle cx="46" cy="8" r="4" fill="#f45112"/></svg></span>
            <span aria-label="Slack" className="slack"><svg aria-hidden="true" viewBox="0 0 64 64"><rect x="27" y="5" width="11" height="25" rx="5.5" fill="#2eb67d" /><rect x="34" y="27" width="25" height="11" rx="5.5" fill="#ecb22e" /><rect x="26" y="34" width="11" height="25" rx="5.5" fill="#e01e5a" /><rect x="5" y="26" width="25" height="11" rx="5.5" fill="#36c5f0" /><circle cx="21" cy="21" r="5.5" fill="#36c5f0" /><circle cx="43" cy="21" r="5.5" fill="#2eb67d" /><circle cx="43" cy="43" r="5.5" fill="#ecb22e" /><circle cx="21" cy="43" r="5.5" fill="#e01e5a" /></svg></span>
          </div>
          <div className="design-four-integration-arrow" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 5v20M8 17l8 8 8-8" /></svg></div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
