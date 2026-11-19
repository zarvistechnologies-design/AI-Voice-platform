import Image from "next/image";

import "./VoiceAgentOverview.css";

type FeatureIconName = "speech" | "speed" | "globe" | "context";

const features: { icon: FeatureIconName; title: string; body: string }[] = [
  { icon: "speech", title: "Hear the details", body: "Turn a spoken request into a clear transcript, so the agent and your team have the context they need." },
  { icon: "speed", title: "Keep the call moving", body: "Respond naturally, handle interruptions, and let callers explain what they need in their own words." },
  { icon: "globe", title: "Sound familiar, anywhere", body: "Choose a supported voice and language that feels right for the customers you serve." },
  { icon: "context", title: "Carry context forward", body: "Keep the intent, details, and next action together when a conversation moves to a person or tool." },
];

const apps = [
  { name: "Google Calendar", icon: "/images/integrations/google-calendar.svg" },
  { name: "Salesforce", icon: "/images/integrations/salesforce.svg" },
  { name: "HubSpot", icon: "/images/company-logos/hubspot.svg" },
  { name: "Slack", icon: "/images/integrations/slack.svg" },
  { name: "WhatsApp", icon: "/images/integrations/whatsapp.svg" },
  { name: "Gmail", icon: "/images/integrations/gmail.svg" },
] as const;

function FeatureIcon({ name }: { name: FeatureIconName }) {
  if (name === "speech") return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 8a7 7 0 0 1 7-5h1a6 6 0 0 1 6 6v2a6 6 0 0 1-6 6h-1l-4 4v-5a7 7 0 0 1-3-8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 10h1m3 0h1m3 0h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
  if (name === "speed") return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m13 2-8 11h6l-1 9 9-12h-6V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
  if (name === "globe") return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z" stroke="currentColor" strokeWidth="1.5"/></svg>;
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="8.5" y="15" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M10 7.5h4M6.5 11v2.5h5.5m5.5-2.5v2.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

export function VoiceAgentOverview() {
  return <div className="vc-overview">
    <section className="vc-features hcr-wrap" aria-labelledby="vc-features-title">
      <span className="vc-overview-kicker">BUILT FOR REAL CONVERSATIONS</span>
      <h2 id="vc-features-title">Speak naturally. Work globally.</h2>
      <div className="vc-feature-grid">{features.map((feature) => <article key={feature.title}><FeatureIcon name={feature.icon} /><h3>{feature.title}</h3><p>{feature.body}</p></article>)}</div>
    </section>

    <section className="vc-deploy hcr-wrap" aria-labelledby="vc-deploy-title">
      <span className="vc-overview-kicker">FROM SETUP TO FIRST CALL</span>
      <h2 id="vc-deploy-title">Start with one clear job.</h2>
      <div className="vc-deploy-grid">
        <article className="vc-deploy-card">
          <div className="vc-deploy-visual vc-template-visual" aria-hidden="true">
            <div className="vc-template-row is-current"><span className="vc-template-symbol">01</span><div><strong>Appointment booking</strong><small>Find a time and confirm the next step</small></div><i>↗</i></div>
            <div className="vc-template-row"><span className="vc-template-symbol">02</span><div><strong>Lead qualification</strong><small>Collect the details your team needs</small></div><i>↗</i></div>
            <div className="vc-template-row"><span className="vc-template-symbol">03</span><div><strong>Customer support</strong><small>Answer, route, and follow up</small></div><i>↗</i></div>
          </div>
          <h3>Shape the call flow</h3><p>Start with a common use case, then set the answers, questions, and handoff rules for your team.</p>
        </article>

        <article className="vc-deploy-card">
          <div className="vc-deploy-visual vc-language-visual" aria-hidden="true">
            <div className="vc-language-top"><span>ENGLISH</span><i /><span>हिन्दी</span></div>
            <div className="vc-language-chips"><span>English</span><span>हिन्दी</span><span>ગુજરાતી</span><span>ಕನ್ನಡ</span><span>বাংলা</span><span>मराठी</span><span>தமிழ்</span><span>తెలుగు</span></div>
            <small>Choose a voice. Hear it before launch.</small>
          </div>
          <h3>Make it sound like you</h3><p>Select a supported language and voice that suit your callers and your brand.</p>
        </article>

        <article className="vc-deploy-card">
          <div className="vc-deploy-visual vc-apps-visual" aria-hidden="true">
            <div className="vc-app-icons">{apps.map((app) => <span key={app.name}><Image alt="" src={app.icon} width={30} height={30} /></span>)}</div>
            <span className="vc-apps-caption">YOUR TOOLS, CONNECTED</span>
          </div>
          <h3>Connect the next action</h3><p>Send outcomes to your approved calendars, customer records, and team workflows.</p>
        </article>
      </div>
    </section>
  </div>;
}
