"use client";

import Image from "next/image";
import { useState } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  AnimatedStoryFlowShowcase,
  type FlowDiagramVariant,
} from "@/components/product/ProductFloatingShowcase";
import { VoiceAgentVisualIcon as Icon } from "@/components/product/VoiceAgentVisualIcon";
import type { SolutionPageData } from "@/config/solutionPagesCatalog";
import "@/app/business/industries/healthcare/healthcare.css";
import "@/components/product/VoiceAgentCallExperience.css";
import "@/components/product/VoiceAgentOverview.css";
import "@/components/product/VoiceAgentConnectedSection.css";
import "@/components/product/VoiceAgentUseCaseVisual.css";
import "@/components/product/ProductLaptopFrame.css";
import "@/components/product/ProductUseCaseVisual.css";

const defaultApps = [
  { name: "WhatsApp", icon: "/images/integrations/whatsapp.svg" },
  { name: "Zoho CRM", icon: "/images/integrations/zoho.svg" },
  { name: "Google Calendar", icon: "/images/integrations/google-calendar.svg" },
  { name: "Salesforce", icon: "/images/integrations/salesforce.svg" },
  { name: "HubSpot", icon: "/images/company-logos/hubspot.svg" },
  { name: "Twilio", icon: "/images/integrations/twilio.svg" },
] as const;

const solutionVariantMap: Record<string, FlowDiagramVariant> = {
  healthcare: "branch-right",
  "financial-services": "pipeline-split",
  insurance: "hub-orchestrator",
  logistics: "hub-orchestrator",
  "home-services": "pipeline-split",
  "retail-consumer": "dual-entry",
  "travel-hospitality": "dual-entry",
  "debt-collection": "pipeline-split",
  "lead-qualification": "branch-right",
  "customer-support": "dual-entry",
  receptionists: "branch-right",
  "dispatch-service": "hub-orchestrator",
};

const variantCycle: FlowDiagramVariant[] = [
  "branch-right",
  "dual-entry",
  "pipeline-split",
  "hub-orchestrator",
];

export function SolutionShowcasePage({ data }: { data: SolutionPageData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scenario = data.scenarios[activeIndex] ?? data.scenarios[0];
  const baseVariant = solutionVariantMap[data.slug] ?? "branch-right";
  const baseIdx = variantCycle.indexOf(baseVariant);
  const activeVariant = variantCycle[(baseIdx + activeIndex) % variantCycle.length];

  const primaryKpi = scenario.kpis[0] ?? {
    value: "98%",
    label: "Accuracy",
    pct: 98,
    color: "#2457d6",
  };

  const p1 = scenario.pipeline[0];
  const p2 = scenario.pipeline[1];
  const p3 = scenario.pipeline[2];

  return (
    <div className="hcr-site sln-site">
      <SiteHeader />

      <main className="hcr-page">
        {/* 1. Unified Landing Hero (Small single-line tagline on top + Left scenario pills + Full-width Call -> Vozon AI -> WhatsApp / Calendar / Zoho CRM flow) */}
        <section className="hcr-hero hcr-wrap vc-hero-section">
          <div className="hcr-hero-stage is-pattern-only vc-hero-stage">
            <div className="hcr-hero-dots" aria-hidden="true" />

            <div
              className="vc-experience is-laptop-layout"
              aria-label={`Interactive ${data.title} voice agent workflow`}
            >
              <div className="vc-hero-intro">
                <span>VOZON / {data.title.toUpperCase()}</span>
                <h1>{data.headline}</h1>
              </div>

              {/* Left Column: Scenario Pill Selector */}
              <div className="vc-industries" role="group" aria-label={`Choose a ${data.title} scenario`}>
                {data.scenarios.map((item, index) => (
                  <button
                    key={item.tabLabel}
                    type="button"
                    aria-pressed={activeIndex === index}
                    className={activeIndex === index ? "is-active" : ""}
                    onClick={() => setActiveIndex(index)}
                  >
                    {item.tabLabel}
                  </button>
                ))}
              </div>

              {/* Right Full-Width Column: Left-to-Right Connected Workflow (Call -> Vozon AI -> WhatsApp / Calendar / Zoho CRM) */}
              <AnimatedStoryFlowShowcase
                key={`stage-${scenario.tabLabel}`}
                variant={activeVariant}
                windowTitle={`${data.title} · ${scenario.tabLabel}`}
                liveBadge={scenario.callStatus}
                step1={{
                  kicker: p1?.step ?? "01 · INBOUND / OUTBOUND CALL",
                  title: `${scenario.callerName} · ${p1?.title ?? scenario.callerBadge}`,
                  detail: p1?.detail ?? scenario.callerBadge,
                  logo: "/images/integrations/twilio.svg",
                  tag: p1?.status ?? "Verified",
                  tagTone: "emerald",
                }}
                step2={{
                  kicker: p2?.step ?? "02 · VOZON AI AGENT",
                  title: p2?.title ?? scenario.boardTitle,
                  detail: `“${scenario.dialogue.agent2}”`,
                  icon: p2?.icon ?? "spark",
                  badge: p2?.badge ?? "icon-badge-violet",
                }}
                outcomes={[
                  {
                    kicker: p3?.step ?? "SCHEDULE & ACTION",
                    title: p3?.title ?? "Confirmed & synced",
                    logo: scenario.partnerLogo,
                    isPrimary: true,
                  },
                  {
                    kicker: "EXTRACTED CONTEXT",
                    title: scenario.extractedTags[0]?.label ?? scenario.boardTitle,
                    icon: scenario.extractedTags[0]?.icon ?? "check",
                    badge: scenario.extractedTags[0]?.badge ?? "icon-badge-blue",
                  },
                ]}
                footerMetricValue={primaryKpi.value}
                footerMetricTitle={primaryKpi.label}
                footerMetricDetail={scenario.boardSubtitle}
              />
            </div>
          </div>
        </section>

        {/* 2. Unified Overview Section (4 Features + 3 Deploy Visual Cards, matching VoiceAgentOverview) */}
        <div className="vc-overview">
          <section className="vc-features hcr-wrap" aria-labelledby="sol-features-title">
            <span className="vc-overview-kicker">BUILT FOR {data.title.toUpperCase()} CONVERSATIONS</span>
            <h2 id="sol-features-title">{data.pillarsHeading}</h2>
            <div className="vc-feature-grid">
              {data.pillars.map((pillar) => (
                <article key={pillar.title}>
                  <span
                    className={pillar.badge}
                    style={{
                      display: "grid",
                      width: "40px",
                      height: "40px",
                      placeItems: "center",
                      borderRadius: "11px",
                    }}
                  >
                    <Icon name={pillar.icon} />
                  </span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="vc-deploy hcr-wrap" aria-labelledby="sol-deploy-title">
            <span className="vc-overview-kicker">FROM SETUP TO FIRST CALL</span>
            <h2 id="sol-deploy-title">Start with one clear {data.title.toLowerCase()} workflow.</h2>
            <div className="vc-deploy-grid">
              <article className="vc-deploy-card">
                <div className="vc-deploy-visual vc-template-visual" aria-hidden="true">
                  {data.stories.slice(0, 3).map((story, idx) => (
                    <div
                      key={story.title}
                      className={`vc-template-row${idx === 0 ? " is-current" : ""}`}
                    >
                      <span className="vc-template-symbol">0{idx + 1}</span>
                      <div>
                        <strong>{story.eyebrow}</strong>
                        <small>{story.outcomeText}</small>
                      </div>
                      <i>↗</i>
                    </div>
                  ))}
                </div>
                <h3>Shape the call flow</h3>
                <p>
                  Start with your highest-volume {data.title.toLowerCase()} calls, then set the approved answers, intake questions, and handoff rules.
                </p>
              </article>

              <article className="vc-deploy-card">
                <div className="vc-deploy-visual vc-language-visual" aria-hidden="true">
                  <div className="vc-language-top">
                    <span>ENGLISH</span>
                    <i />
                    <span>हिन्दी</span>
                  </div>
                  <div className="vc-language-chips">
                    <span>English</span>
                    <span>हिन्दी</span>
                    <span>ગુજરાતી</span>
                    <span>ಕನ್ನಡ</span>
                    <span>বাংলা</span>
                    <span>मराठी</span>
                    <span>தமிழ்</span>
                    <span>తెలుగు</span>
                  </div>
                  <small>Choose a voice. Hear it before launch.</small>
                </div>
                <h3>Make it sound like you</h3>
                <p>
                  Select a supported language and voice that suit your callers, local terminology, and brand tone.
                </p>
              </article>

              <article className="vc-deploy-card">
                <div className="vc-deploy-visual vc-apps-visual" aria-hidden="true">
                  <div className="vc-app-icons">
                    {defaultApps.map((app) => (
                      <span key={app.name}>
                        <Image alt="" src={app.icon} width={30} height={30} />
                      </span>
                    ))}
                  </div>
                  <span className="vc-apps-caption">YOUR TOOLS, CONNECTED</span>
                </div>
                <h3>Connect the next action</h3>
                <p>
                  Send outcomes directly to your calendars, customer records, and team workflows in real time.
                </p>
              </article>
            </div>
          </section>
        </div>

        {/* 3. Unified Connected Section (Alternating Light/Dark Flow Cards, matching VoiceAgentConnectedSection) */}
        <section className="vc-connections" aria-labelledby="sol-connections-title">
          <div className="hcr-wrap">
            <div className="vc-connections-heading">
              <span>ONE AGENT, CONNECTED TO YOUR WORK</span>
              <h2 id="sol-connections-title">{data.storiesHeading}</h2>
              <p>{data.storiesSubtitle}</p>
            </div>

            <div className="vc-connection-stack">
              {data.stories.map((story, idx) => {
                const isDark = idx % 2 === 1;
                return (
                  <article key={story.title} className="vc-connection-card">
                    <div className="vc-connection-copy">
                      <span>
                        0{idx + 1} / {story.eyebrow.toUpperCase()}
                      </span>
                      <h3>{story.title}</h3>
                      <p>{story.body}</p>
                      <div className="vc-connection-note">
                        <Icon name={story.topIcon} /> {story.outcomeText}
                      </div>
                    </div>

                    {isDark ? (
                      <div
                        className="vc-connection-visual hcr-story-visual prod-scene is-dark-card"
                        role="img"
                        aria-label={`${story.topLabel} flow`}
                      >
                        <div className="prod-scene-kicker">
                          <span>{story.topLabel}</span>
                          <span className="prod-scene-kicker-badge">
                            <Icon name="bolt" /> Live Flow
                          </span>
                        </div>

                        <div className="prod-dark-header">
                          <span className={`prod-entry-icon ${story.topBadge}`}>
                            <Icon name={story.topIcon} />
                          </span>
                          <div className="prod-dark-header-copy">
                            <small>{story.eyebrow.toUpperCase()}</small>
                            <strong>{story.topQuote}</strong>
                          </div>
                          <span className="prod-dark-logo">
                            <Image src={story.logo} alt="" width={19} height={19} />
                          </span>
                        </div>

                        <div className="prod-dark-flow-row">
                          {story.steps.map((step, stepIdx) => (
                            <div key={step.title} style={{ display: "contents" }}>
                              {stepIdx > 0 ? <i className="prod-dark-flow-line" aria-hidden="true" /> : null}
                              <div className="prod-dark-step-card">
                                <div className="prod-dark-step-top">
                                  <span className={`prod-flow-icon ${step.badge}`}>
                                    <Icon name={step.icon} />
                                  </span>
                                  <span className="prod-dark-step-num">0{stepIdx + 1}</span>
                                </div>
                                <strong>{step.title}</strong>
                                <small>{step.detail}</small>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="prod-dark-answer">
                          <span className="prod-entry-icon icon-badge-blue">
                            <Icon name="spark" />
                          </span>
                          <div className="prod-dark-answer-copy">
                            <small>RIGHT PATH SELECTED</small>
                            <strong>{story.outcomeText}</strong>
                          </div>
                          <span className="prod-dark-answer-tag">Synced</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="vc-connection-visual hcr-story-visual prod-scene"
                        role="img"
                        aria-label={`${story.topLabel} flow`}
                      >
                        <div className="prod-scene-kicker">
                          <span>{story.topLabel}</span>
                          <span className="prod-scene-kicker-badge">Automated Flow</span>
                        </div>

                        <div className="prod-entry-card">
                          <span className={`prod-entry-icon ${story.topBadge}`}>
                            <Icon name={story.topIcon} />
                          </span>
                          <div className="prod-entry-copy">
                            <small>{story.eyebrow.toUpperCase()}</small>
                            <strong>{story.topQuote}</strong>
                          </div>
                          <span className="prod-entry-logo">
                            <Image src={story.logo} alt="" width={19} height={19} />
                          </span>
                        </div>

                        <div className="prod-step-path" aria-hidden="true">
                          {story.steps.map((step, stepIdx) => (
                            <div key={step.title} style={{ display: "contents" }}>
                              {stepIdx > 0 ? <i /> : null}
                              <span>
                                0{stepIdx + 1} <b>{step.title}</b>
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="prod-flow-row">
                          {story.steps.map((step, stepIdx) => (
                            <div key={step.title} style={{ display: "contents" }}>
                              {stepIdx > 0 ? <i className="prod-flow-line" aria-hidden="true" /> : null}
                              <div className="prod-flow-card">
                                <span className={`prod-flow-icon ${step.badge}`}>
                                  <Icon name={step.icon} />
                                </span>
                                <strong>{step.title}</strong>
                                <small>{step.detail}</small>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="prod-outcome-pill">
                          <Icon name="check" />
                          <span>{story.outcomeText}</span>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Service-Specific FAQ Section */}
        <section className="hcr-faq hcr-wrap">
          <p className="hcr-kicker">FREQUENTLY ASKED QUESTIONS</p>
          <h2>{data.faqHeadline}</h2>
          <div className="hcr-faq-list">
            {data.faqs.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
