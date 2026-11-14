"use client";

import Image from "next/image";
import { useState } from "react";
import "./WorkflowCanvasSection.css";

const languages = [
  { key: "en", label: "English" },
  { key: "hi", label: "हिंदी" },
  { key: "es", label: "Español" },
] as const;

type LanguageKey = (typeof languages)[number]["key"];

const workflows = [
  {
    key: "commerce",
    label: "Commerce",
    trigger: { app: "Shopify", icon: "/images/company-logos/shopify.svg", event: "Abandoned checkout", action: "Start recovery call" },
    assistant: { goal: "Help with an unfinished order", window: "09:00 – 20:00", retry: "After 2 hours" },
    message: {
      en: "Hi, I can help you finish your order.",
      hi: "नमस्ते, मैं आपका ऑर्डर पूरा करने में मदद कर सकता हूँ।",
      es: "Hola, puedo ayudarte a completar tu pedido.",
    },
    condition: { first: "intent = purchase", second: "confidence ≥ 80%" },
    yes: { app: "Calendly", icon: "/images/integrations/calendly.svg", action: "Book follow-up" },
    no: { action: "Save call outcome", endpoint: "POST /leads/update" },
  },
  {
    key: "bookings",
    label: "Bookings",
    trigger: { app: "Calendly", icon: "/images/integrations/calendly.svg", event: "New appointment", action: "Start confirmation call" },
    assistant: { goal: "Confirm appointment details", window: "08:00 – 19:00", retry: "After 1 hour" },
    message: {
      en: "Hi, I'm calling to confirm your appointment.",
      hi: "नमस्ते, मैं आपकी अपॉइंटमेंट की पुष्टि के लिए कॉल कर रहा हूँ।",
      es: "Hola, llamo para confirmar tu cita.",
    },
    condition: { first: "needs reschedule", second: "new time provided" },
    yes: { app: "Calendly", icon: "/images/integrations/calendly.svg", action: "Update appointment" },
    no: { action: "Sync confirmed booking", endpoint: "POST /bookings/sync" },
  },
  {
    key: "sales",
    label: "Sales",
    trigger: { app: "HubSpot", icon: "/images/company-logos/hubspot.svg", event: "New lead created", action: "Start qualification call" },
    assistant: { goal: "Qualify the new lead", window: "09:00 – 18:00", retry: "Next business day" },
    message: {
      en: "Hi, I'd love to hear what you're looking for.",
      hi: "नमस्ते, मैं जानना चाहूँगा कि आप क्या ढूँढ रहे हैं।",
      es: "Hola, me gustaría saber qué estás buscando.",
    },
    condition: { first: "lead score ≥ 70", second: "intent = interested" },
    yes: { app: "Calendly", icon: "/images/integrations/calendly.svg", action: "Book a demo" },
    no: { action: "Save lead notes", endpoint: "POST /leads/notes" },
  },
] as const;

function AppIdentity({ icon, name, detail }: { icon: string; name: string; detail: string }) {
  return (
    <div className="workflow-canvas-app">
      <span><Image src={icon} alt="" width={24} height={24} loading="eager" /></span>
      <div><strong>{name}</strong><small>{detail}</small></div>
    </div>
  );
}

export function WorkflowCanvasSection() {
  const [active, setActive] = useState(0);
  const [language, setLanguage] = useState<LanguageKey>("en");
  const workflow = workflows[active];

  return (
    <section className="workflow-canvas-section" aria-labelledby="workflow-canvas-title">
      <div className="workflow-canvas-inner">
        <div className="workflow-canvas-copy">
          <span className="workflow-canvas-eyebrow">WORKFLOWS, MADE SIMPLE</span>
          <h2 id="workflow-canvas-title">One workflow.<br /><span>Every language.</span></h2>
          <p>Start with an event, let your agent handle the conversation, then route the outcome to the right place.</p>
          <div className="workflow-canvas-tabs" aria-label="Workflow examples">
            {workflows.map((item, index) => (
              <button
                aria-pressed={active === index}
                className={active === index ? "is-active" : ""}
                key={item.key}
                onClick={() => setActive(index)}
                type="button"
              >{item.label}</button>
            ))}
          </div>
        </div>

        <div className="workflow-canvas-stage" aria-label={`${workflow.label} example workflow`}>
          <span className="workflow-canvas-example-label">EXAMPLE WORKFLOW</span>
          <div className="workflow-canvas-flow" key={workflow.key}>
            <article className="workflow-canvas-node workflow-canvas-trigger">
              <div className="workflow-canvas-node-header">{workflow.trigger.app}</div>
              <div className="workflow-canvas-node-body">
                <AppIdentity icon={workflow.trigger.icon} name={workflow.trigger.app} detail="New activity" />
                <div className="workflow-canvas-field"><span>EVENT</span><strong>{workflow.trigger.event}</strong></div>
                <div className="workflow-canvas-field"><span>ACTION</span><strong>{workflow.trigger.action}</strong></div>
              </div>
            </article>

            <span className="workflow-canvas-connector" aria-hidden="true" />

            <article className="workflow-canvas-node workflow-canvas-assistant">
              <div className="workflow-canvas-node-header">Assistant</div>
              <div className="workflow-canvas-node-body">
                <div className="workflow-canvas-mode"><span className="is-active">Call</span><span>Chat</span><b>Vozon AI</b></div>
                <div className="workflow-canvas-field"><span>GOAL</span><strong>{workflow.assistant.goal}</strong></div>
                <div className="workflow-canvas-field-row">
                  <div className="workflow-canvas-field"><span>CALL WINDOW</span><strong>{workflow.assistant.window}</strong></div>
                  <div className="workflow-canvas-field"><span>RETRY</span><strong>{workflow.assistant.retry}</strong></div>
                </div>
                <div className="workflow-canvas-message-preview">
                  <div className="workflow-canvas-message-heading">
                    <span>AGENT SAYS</span>
                    <div className="workflow-canvas-languages" role="group" aria-label="Message language">
                      {languages.map((item) => (
                        <button
                          aria-label={`Preview in ${item.label}`}
                          aria-pressed={language === item.key}
                          className={language === item.key ? "is-active" : ""}
                          key={item.key}
                          onClick={() => setLanguage(item.key)}
                          type="button"
                        >{item.label}</button>
                      ))}
                    </div>
                  </div>
                  <p lang={language} aria-live="polite">{workflow.message[language]}</p>
                </div>
              </div>
            </article>

            <span className="workflow-canvas-connector" aria-hidden="true" />

            <article className="workflow-canvas-node workflow-canvas-condition">
              <div className="workflow-canvas-node-header">If condition</div>
              <div className="workflow-canvas-node-body">
                <div className="workflow-canvas-expression"><code>{workflow.condition.first}</code><span>AND</span><code>{workflow.condition.second}</code></div>
              </div>
            </article>

            <span className="workflow-canvas-connector workflow-canvas-branch-connector" aria-hidden="true" />

            <div className="workflow-canvas-branches">
              <div className="workflow-canvas-branch">
                <span className="workflow-canvas-branch-label">✓ TRUE</span>
                <article className="workflow-canvas-node workflow-canvas-outcome">
                  <div className="workflow-canvas-node-header">{workflow.yes.app}</div>
                  <div className="workflow-canvas-node-body">
                    <AppIdentity icon={workflow.yes.icon} name={workflow.yes.app} detail="Next step" />
                    <div className="workflow-canvas-field"><span>ACTION</span><strong>{workflow.yes.action}</strong></div>
                  </div>
                </article>
              </div>
              <div className="workflow-canvas-branch">
                <span className="workflow-canvas-branch-label">× FALSE</span>
                <article className="workflow-canvas-node workflow-canvas-outcome">
                  <div className="workflow-canvas-node-header">API request</div>
                  <div className="workflow-canvas-node-body">
                    <AppIdentity icon="/images/integrations/custom-api.svg" name="Custom API" detail="Update your tools" />
                    <div className="workflow-canvas-field"><span>ACTION</span><strong>{workflow.no.action}</strong></div>
                    <code className="workflow-canvas-endpoint">{workflow.no.endpoint}</code>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
