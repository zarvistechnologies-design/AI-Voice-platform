import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { VozonVoiceMark } from "@/components/ui/VozonVoiceMark";
import { VoiceAgentUseCaseVisual } from "@/components/product/VoiceAgentUseCaseVisual";
import { WhatsAppBotUseCaseVisual } from "@/components/product/WhatsAppBotUseCaseVisual";
import { ProductUseCaseVisual } from "@/components/product/ProductUseCaseVisual";
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
  rolloutBullets?: { focused: readonly string[]; expanded: readonly string[] };
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

function StoryVisual({ story, index, sample, voiceSpecific, whatsAppSpecific, productSlug }: { story: SolutionStory; index: number; sample?: SolutionLandingContent["sample"]; voiceSpecific?: boolean; whatsAppSpecific?: boolean; productSlug?: string }) {
  if (voiceSpecific && index < 5) return <VoiceAgentUseCaseVisual kind={(["lead", "appointment", "support", "define", "connect"] as const)[index]} />;
  if (whatsAppSpecific && index < 5) return <WhatsAppBotUseCaseVisual kind={(["cart", "campaign", "support", "entry", "guide"] as const)[index]} />;
  if (productSlug && productSlug !== "voice" && productSlug !== "whatsapp") {
    return <ProductUseCaseVisual productSlug={productSlug} index={index} storyTitle={story.title} storyBody={story.body} />;
  }
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

export function SolutionLandingPage({ content, heroVisual, heroVariant, afterHero }: { content: SolutionLandingContent; heroVisual?: React.ReactNode; heroVariant?: string; afterHero?: React.ReactNode }) {
  const noun = content.category === "Industries" ? content.title.toLowerCase() : content.title.toLowerCase();
  const heroSectionClass = heroVisual ? (heroVariant === "whatsapp" ? " wa-hero-section" : " vc-hero-section") : "";
  const heroStageClass = heroVisual ? (heroVariant === "whatsapp" ? " wa-hero-stage" : " vc-hero-stage") : "";
  return <div className="hcr-site sln-site"><SiteHeader /><main className="hcr-page">
    <section className={`hcr-hero hcr-wrap${heroSectionClass}`}>
      {heroVariant ? null : <>
        <div className="hcr-breadcrumb"><Link href={content.breadcrumbHref ?? "/business"}>{content.breadcrumbLabel ?? "Solutions"}</Link><span>/</span><span>{content.title}</span></div>
        <div className="hcr-hero-copy"><p className="hcr-kicker">{content.heroKicker ?? `${content.category.toUpperCase()} / VOICE AGENTS`}</p><h1>{content.headline ?? `AI voice agents for ${noun}.`}</h1><p>{content.summary}</p><Link className="hcr-text-link" href="/contact">Talk to our team <span aria-hidden="true">↗</span></Link></div>
      </>}
      <div className={`hcr-hero-stage${content.heroImage ? " has-hero-image" : " is-pattern-only"}${heroStageClass}`}>{content.heroImage ? <Image src={content.heroImage} alt={content.heroAlt ?? ""} fill priority sizes="(max-width: 700px) 100vw, 90vw"/> : null}<div className="hcr-hero-dots" aria-hidden="true"/>{heroVisual ?? <div className="hcr-agent-widget"><span>{content.heroWidgetLabel ?? `VOZON AI · ${content.title.toUpperCase()}`}</span><h2>{content.heroPrompt ?? "How can I help today?"}</h2><p>{content.heroNote ?? content.highlights.join(" · ")}</p><div className="hcr-widget-input">{content.heroInput ?? "Tell me what you need"} <span>↗</span></div><div className="hcr-widget-footer"><span>● {content.heroReady ?? "Voice ready"}</span><span>Human handoff available</span></div></div>}</div>
    </section>
    {afterHero ?? <section className="hcr-proof"><div className="hcr-wrap"><div className="hcr-proof-grid">{[...content.highlights, "Human handoff"].slice(0, 4).map((item, i) => <div key={item}><strong>{String(i + 1).padStart(2, "0")}</strong><span>{item}</span></div>)}</div><div className="hcr-proof-tools"><span>CONNECT YOUR WORKFLOW WITH</span>{content.integrations.slice(0, 4).map(tool => <b key={tool}>{tool}</b>)}</div></div></section>}
    {content.audiences ? <section className="sln-audiences hcr-wrap"><p className="hcr-kicker">WHO IT&apos;S FOR</p><h2>{content.audiences.heading}</h2><div className="sln-audience-grid">{content.audiences.items.map((item, i) => <div key={item.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.body}</p></div>)}</div></section> : null}
    {(heroVariant === "voice" || heroVariant === "whatsapp") ? (
      <section className={`hcr-stories hcr-wrap vc-stories`} aria-label={`${content.title} use cases`}>
        {heroVariant === "voice" ? (
          <div className="vc-stories-intro"><p className="hcr-kicker">FROM THE FIRST WORD TO THE NEXT STEP</p><h2>See what a call can set in motion.</h2><p>Explore three everyday conversations, then see how to shape the agent behind them.</p></div>
        ) : (
          <div className="vc-stories-intro"><p className="hcr-kicker">FROM FIRST MESSAGE TO NEXT STEP</p><h2>See what a WhatsApp conversation can set in motion.</h2><p>Explore three customer moments, then see how to shape the bot behind them.</p></div>
        )}
        {content.stories.slice(0, 4).map((story, i) => (
          <div className="hcr-story" key={`${story.eyebrow}-${i}`}>
            <div className="hcr-story-copy">
              <p className="hcr-kicker">{String(i + 1).padStart(2, "0")} / {story.eyebrow.toUpperCase()}</p>
              <h2>{story.title}</h2>
              <p>{story.body}</p>
              <Link href="/contact">Explore this workflow <span aria-hidden="true">↗</span></Link>
            </div>
            <StoryVisual story={story} index={i} sample={content.sample} voiceSpecific={heroVariant === "voice"} whatsAppSpecific={heroVariant === "whatsapp"} productSlug={heroVariant} />
          </div>
        ))}
      </section>
    ) : null}
    <section className="hcr-faq hcr-wrap"><p className="hcr-kicker">FREQUENTLY ASKED QUESTIONS</p><h2>{content.faqHeadline ?? `Questions about ${noun} voice agents.`}</h2><div className="hcr-faq-list">{content.faqs.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>
  </main><SiteFooter /></div>;
}
