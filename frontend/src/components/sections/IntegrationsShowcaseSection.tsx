"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./IntegrationsShowcaseSection.css";

const appSets = [
  [
    { name: "Google Sheets", detail: "Read and update sheets after calls.", icon: "/images/integrations/google-sheets.svg", tone: "sheets" },
    { name: "Typeform", detail: "Turn form responses into calls.", icon: null, tone: "typeform" },
    { name: "Shopify", detail: "Track orders and answer by voice.", icon: "/images/company-logos/shopify.svg", tone: "shopify" },
    { name: "Calendly", detail: "Book and update meetings on a call.", icon: "/images/integrations/calendly.svg", tone: "calendly" },
    { name: "Notion", detail: "Bring your team’s knowledge into calls.", icon: "/images/company-logos/notion.svg", tone: "notion" },
    { name: "HubSpot", detail: "Capture enquiries and keep leads in sync.", icon: "/images/company-logos/hubspot.svg", tone: "hubspot" },
  ],
  [
    { name: "Google Calendar", detail: "Book time while you’re on a call.", icon: "/images/integrations/google-calendar.svg", tone: "calendar" },
    { name: "WhatsApp", detail: "Continue the conversation in chat.", icon: "/images/integrations/whatsapp.svg", tone: "whatsapp" },
    { name: "Gmail", detail: "Send helpful follow-up emails.", icon: "/images/integrations/gmail.svg", tone: "gmail" },
    { name: "Salesforce", detail: "Keep customer records up to date.", icon: "/images/integrations/salesforce.svg", tone: "salesforce" },
    { name: "Slack", detail: "Share outcomes with your team.", icon: "/images/integrations/slack.svg", tone: "slack" },
    { name: "Google Drive", detail: "Bring useful documents into reach.", icon: "/images/integrations/googledrive.svg", tone: "drive" },
  ],
  [
    { name: "Freshsales", detail: "Pass qualified leads to your sales team.", icon: "/images/integrations/freshsales.ico", tone: "freshsales" },
    { name: "ClickUp", detail: "Turn call outcomes into team tasks.", icon: "/images/integrations/clickup.svg", tone: "clickup" },
    { name: "Asana", detail: "Keep follow-up work organized.", icon: "/images/integrations/asana.svg", tone: "asana" },
    { name: "Zoho", detail: "Connect customer details to conversations.", icon: "/images/integrations/zoho.svg", tone: "zoho" },
    { name: "Zapier", detail: "Connect with more of your tools.", icon: "/images/integrations/zapier.png", tone: "zapier" },
    { name: "Google Docs", detail: "Find answers in your team’s documents.", icon: "/images/integrations/googledocs.svg", tone: "docs" },
  ],
];

function AppMark({ tone }: { tone: string }) {
  if (tone === "typeform") return <span className="integrations-app-typeform" aria-hidden="true"><i /><b /></span>;
  return null;
}

export function IntegrationsShowcaseSection() {
  const [activeSet, setActiveSet] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSet((current) => (current + 1) % appSets.length), 1500);
    return () => window.clearInterval(timer);
  }, []);

  const apps = appSets[activeSet];

  return (
    <section className="integrations-showcase" aria-labelledby="integrations-showcase-title">
      <div className="integrations-showcase-heading">
        <span>CONNECTED TO YOUR WORK</span>
        <h2 id="integrations-showcase-title">One intelligent layer<br />for the apps you use.</h2>
        <p>Let your voice agents work with the tools your team already relies on.</p>
      </div>
      <div className="integrations-showcase-grid" aria-live="polite" aria-atomic="true">
        {apps.map((app, index) => <article className="integrations-app-card" key={`${activeSet}-${app.name}`} style={{ animationDelay: `${index * 55}ms` }}>
          <span className={`integrations-app-icon is-${app.tone}`}>
            {app.icon ? <Image alt="" src={app.icon} width={27} height={27} /> : <AppMark tone={app.tone} />}
          </span>
          <h3>{app.name}</h3>
          <p>{app.detail}</p>
        </article>)}
      </div>
      <div className="integrations-showcase-pagination" aria-label="Integration groups">
        <span>Explore connections</span>
        {appSets.map((set, index) => <button aria-label={`Show integration group ${index + 1}`} aria-current={activeSet === index ? "true" : undefined} className={activeSet === index ? "is-active" : ""} key={set[0].name} onClick={() => setActiveSet(index)} type="button" />)}
      </div>
      <Link className="integrations-showcase-link" href="/integrations">Explore integrations <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
