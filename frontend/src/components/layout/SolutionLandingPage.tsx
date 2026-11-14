import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { VozonVoiceMark } from "@/components/ui/VozonVoiceMark";
import "@/app/business/industries/healthcare/healthcare.css";

export type SolutionStory = {
  eyebrow: string;
  title: string;
  body: string;
  steps?: readonly string[];
  example?: { caller: string; agent: string };
};

export type SolutionLandingContent = {
  title: string;
  category: string;
  heroKicker?: string;
  breadcrumbHref?: string;
  breadcrumbLabel?: string;
  summary: string;
  headline?: string;
  videoHeadline?: string;
  videoDescription?: string;
  launchHeadline?: string;
  faqHeadline?: string;
  audiences?: { heading: string; items: readonly { title: string; body: string }[] };
  rollout?: { focused: string; expanded: string };
  platformCards?: readonly { title: string; body: string; label: string }[];
  launchOptions?: { first: string; second: string };
  heroImage?: string | null;
  heroAlt?: string;
  heroWidgetLabel?: string;
  heroPrompt?: string;
  heroNote?: string;
  heroInput?: string;
  heroReady?: string;
  pricingKicker?: string;
  pricingHeadline?: string;
  platformHeadline?: string;
  highlights: readonly string[];
  stories: readonly SolutionStory[];
  integrations: readonly string[];
  faqs: readonly { question: string; answer: string }[];
  sample?: { caller: string; agent: string; outcome: string };
  relatedProducts?: readonly { title: string; summary: string; href: string }[];
};

function StoryVisual({ story, index, sample }: { story: SolutionStory; index: number; sample?: SolutionLandingContent["sample"] }) {
  if (index === 4) {
    return <div className="hcr-story-visual hcr-language-visual"><div className="hcr-language-orb"><VozonVoiceMark /></div><span>Hello</span><span>नमस्ते</span><span>Bonjour</span><span>வணக்கம்</span><span>Hola</span></div>;
  }
  if (index % 4 === 0) {
    return <div className="hcr-story-visual hcr-audio-visual"><div className="hcr-audio-card"><div><span>VOICE CONVERSATION</span><b>{sample?.caller ?? story.title}</b></div><div className="sln-call-wave" aria-hidden="true">{Array.from({ length: 34 }, (_, i) => <i key={i} style={{ height: `${12 + ((i * 17) % 31)}px` }} />)}</div><p className="sln-sample-reply">{sample?.agent ?? story.body}</p></div></div>;
  }
  if (index % 4 === 1) {
    return <div className="hcr-story-visual hcr-reminder-visual"><div className="hcr-reminder-flow"><span>CONNECTED WORKFLOW</span><strong>A clear next step.</strong>{(story.steps?.length ? story.steps : ["Call answered", "Details captured", "Team updated"]).slice(0, 3).map((step, i) => <div key={step}><i>{i + 1}</i><p>{step}</p></div>)}</div></div>;
  }
  if (index % 4 === 2) {
    return <div className="hcr-story-visual hcr-phone-visual"><div className="hcr-phone"><div className="hcr-phone-status"><span>9:41</span><span>LTE</span></div><div className="hcr-phone-head"><span><VozonVoiceMark /></span><div><b>Vozon AI</b><small>Voice and messaging</small></div><span>☎</span></div><div className="hcr-phone-date">TODAY</div><div className="hcr-bubble">{story.example?.caller ?? "I need help with this request."}</div><div className="hcr-bubble is-patient">Checking the right details now.</div><div className="hcr-bubble">{story.example?.agent ?? "I can help with the next step and keep your team updated."}</div><div className="hcr-phone-input">Message <span>➤</span></div></div></div>;
  }
  return <div className="hcr-story-visual hcr-intake-visual"><div className="hcr-intake-list"><span>CONVERSATION OUTCOME</span><strong>The right team has the context.</strong>{(story.steps?.length ? story.steps : ["Request understood", "Next action recorded", "Handoff ready"]).slice(0, 3).map((step, i) => <div key={step}><b>{i === 2 ? "↗" : "✓"}</b>{step}</div>)}</div></div>;
}

export function SolutionLandingPage({ content }: { content: SolutionLandingContent }) {
  const noun = content.category === "Industries" ? content.title.toLowerCase() : content.title.toLowerCase();
  return <div className="hcr-site sln-site"><SiteHeader /><main className="hcr-page">
    <section className="hcr-hero hcr-wrap"><div className="hcr-breadcrumb"><Link href={content.breadcrumbHref ?? "/business"}>{content.breadcrumbLabel ?? "Solutions"}</Link><span>/</span><span>{content.title}</span></div><div className="hcr-hero-copy"><p className="hcr-kicker">{content.heroKicker ?? `${content.category.toUpperCase()} / VOICE AGENTS`}</p><h1>{content.headline ?? `AI voice agents for ${noun}.`}</h1><p>{content.summary}</p><Link className="hcr-text-link" href="/contact">Talk to our team <span aria-hidden="true">↗</span></Link></div><div className={`hcr-hero-stage${content.heroImage ? " has-hero-image" : " is-pattern-only"}`}>{content.heroImage ? <Image src={content.heroImage} alt={content.heroAlt ?? ""} fill priority sizes="(max-width: 700px) 100vw, 90vw"/> : null}<div className="hcr-hero-dots" aria-hidden="true"/><div className="hcr-agent-widget"><span>{content.heroWidgetLabel ?? `VOZON AI · ${content.title.toUpperCase()}`}</span><h2>{content.heroPrompt ?? "How can I help today?"}</h2><p>{content.heroNote ?? content.highlights.join(" · ")}</p><div className="hcr-widget-input">{content.heroInput ?? "Tell me what you need"} <span>↗</span></div><div className="hcr-widget-footer"><span>● {content.heroReady ?? "Voice ready"}</span><span>Human handoff available</span></div></div></div></section>
    <section className="hcr-proof"><div className="hcr-wrap"><div className="hcr-proof-grid">{[...content.highlights, "Human handoff"].slice(0, 4).map((item, i) => <div key={item}><strong>{String(i + 1).padStart(2, "0")}</strong><span>{item}</span></div>)}</div><div className="hcr-proof-tools"><span>CONNECT YOUR WORKFLOW WITH</span>{content.integrations.slice(0, 4).map(tool => <b key={tool}>{tool}</b>)}</div></div></section>
    {content.audiences ? <section className="sln-audiences hcr-wrap"><p className="hcr-kicker">WHO IT&apos;S FOR</p><h2>{content.audiences.heading}</h2><div className="sln-audience-grid">{content.audiences.items.map((item, i) => <div key={item.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.body}</p></div>)}</div></section> : null}
    <section className="hcr-stories hcr-wrap" aria-label={`${content.title} voice agent use cases`}>{content.stories.slice(0, 5).map((story, i) => <div className="hcr-story" key={`${story.eyebrow}-${i}`}><div className="hcr-story-copy"><p className="hcr-kicker">{String(i + 1).padStart(2, "0")} / {story.eyebrow.toUpperCase()}</p><h2>{story.title}</h2><p>{story.body}</p><Link href="/contact">Explore this workflow <span aria-hidden="true">↗</span></Link></div><StoryVisual story={story} index={i} sample={content.sample}/></div>)}</section>
    <section className="hcr-video-section hcr-wrap"><p className="hcr-kicker">SEE VOZON IN ACTION</p><h2>{content.videoHeadline ?? "One platform. Every conversation."}</h2><p>{content.videoDescription ?? "See how a voice agent can listen, respond, and keep the next action connected."}</p><div className="hcr-video-frame"><video aria-label="Vozon AI platform introduction" controls playsInline poster="/images/healthcare/vozon-video-poster.svg" preload="metadata"><source src="/videos/vozon-ai-intro.mp4" type="video/mp4" />Your browser does not support video.</video></div></section>
    <section className="hcr-pricing hcr-wrap"><p className="hcr-kicker">{content.pricingKicker ?? "PRICING"}</p><h2>{content.pricingHeadline ?? "Start with the calls that matter most."}</h2><div className="hcr-pricing-grid"><div><span>01 / GET STARTED</span><h3>Focused rollout</h3><p>{content.rollout?.focused ?? `Begin with one clear ${noun} journey and the handoff rules your team needs.`}</p><ul><li>One priority use case</li><li>Agent and call flow setup</li><li>Test calls and review</li></ul><Link href="/pricing">Explore pricing <span aria-hidden="true">↗</span></Link></div><div><span>02 / EXPAND</span><h3>Connected operations</h3><p>{content.rollout?.expanded ?? "Add more conversations, languages, and approved tool connections as your team grows."}</p><ul><li>Multiple customer journeys</li><li>Connected tools and workflows</li><li>Team review and escalation</li></ul><Link href="/contact">Contact sales <span aria-hidden="true">↗</span></Link></div></div></section>
    <section className="hcr-platform hcr-wrap"><p className="hcr-kicker">THE VOZON PLATFORM</p><h2>{content.platformHeadline ?? "Built for connected conversations."}</h2><div className="hcr-platform-grid">{(content.platformCards ?? [{ title: "Ready for changing demand", body: "Plan call routing and follow-up around everyday volume and busy periods.", label: "CALL OPERATIONS" }, { title: "Context that travels", body: "Keep the call summary and next action together across teams and approved tools.", label: "CONNECTED JOURNEYS" }, { title: "Controls that matter", body: "Set information boundaries, access, review, and staff escalation for each workflow.", label: "TEAM OVERSIGHT" }]).map((item, i) => <div key={item.title}><span>{["↗", "◷", "✓"][i]}</span><h3>{item.title}</h3><p>{item.body}</p><strong>{item.label}</strong></div>)}</div></section>
    <section className="hcr-launch hcr-wrap"><div><p className="hcr-kicker">START BUILDING</p><h2>{content.launchHeadline ?? `Launch a ${noun} voice agent.`}</h2></div><div className="hcr-launch-options"><div><span>01 / NO-CODE SETUP</span><h3>Start with a conversation.</h3><p>{content.launchOptions?.first ?? "Choose the call type, approved answers, next steps, and human handoff. Test with your team before launch."}</p><Link href="/contact">Get started <span aria-hidden="true">↗</span></Link></div><div><span>02 / CONNECT YOUR SYSTEMS</span><h3>Build with APIs and workflows.</h3><p>{content.launchOptions?.second ?? "Connect supported telephony and tools to keep every outcome visible to the right team."}</p><Link href="/docs/api">Explore the API <span aria-hidden="true">↗</span></Link></div></div></section>
    <section className="hcr-faq hcr-wrap"><p className="hcr-kicker">FREQUENTLY ASKED QUESTIONS</p><h2>{content.faqHeadline ?? `Questions about ${noun} voice agents.`}</h2><div className="hcr-faq-list">{content.faqs.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>
    {content.relatedProducts?.length ? <section className="hcr-platform hcr-wrap"><p className="hcr-kicker">EXPLORE RELATED PRODUCTS</p><h2>Keep the next step connected.</h2><div className="hcr-platform-grid">{content.relatedProducts.map(item => <Link href={item.href} key={item.title}><h3>{item.title}</h3><p>{item.summary}</p><strong>EXPLORE PRODUCT <span aria-hidden="true">?</span></strong></Link>)}</div></section> : null}
  </main><SiteFooter /></div>;
}
