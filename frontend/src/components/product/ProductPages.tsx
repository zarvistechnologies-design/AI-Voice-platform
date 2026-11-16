import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getProduct, productCatalog, type Product } from "@/config/productCatalog";
import { SolutionLandingPage, type SolutionLandingContent } from "@/components/layout/SolutionLandingPage";
import { WhatsAppPhoneExperience } from "./WhatsAppPhoneExperience";
import "@/app/business/industries/healthcare/healthcare.css";
import "./ProductPages.css";

const groups = [
  { title: "Voice", description: "Make a natural conversation the start of a useful outcome.", slugs: ["ai-voice-agent", "voice-cloning"] },
  { title: "Messaging and web", description: "Meet customers on the channels they already use.", slugs: ["whatsapp-api", "whatsapp-bot", "web-chatbot"] },
  { title: "Connections and automation", description: "Carry the conversation into your tools and the next action.", slugs: ["vozon-mcp", "workflows", "create-workflows", "end-to-end-automation"] },
];

function Arrow() {
  return <span aria-hidden="true">&#8599;</span>;
}

function ProductLayout({ children }: { children: React.ReactNode }) {
  return <div className="marketing-site hcr-site sln-site vp-site"><SiteHeader /><main className="hcr-page">{children}</main><SiteFooter /></div>;
}

function ProductMark({ slug }: { slug: string }) {
  const marks: Record<string, string> = {
    "ai-voice-agent": "≋", "whatsapp-api": "API", "whatsapp-bot": "WA", "web-chatbot": "⌘",
    "voice-cloning": "≈", "vozon-mcp": "{ }", "workflows": "↗", "create-workflows": "+", "end-to-end-automation": "∞",
  };
  return <span aria-hidden="true" className="vp-mark">{marks[slug]}</span>;
}

export function ProductHubPage() {
  return (
    <ProductLayout>
      <div className="vp-page">
        <section className="vp-hub-hero vp-wrap">
          <p className="vp-kicker">THE VOZON PLATFORM / PRODUCTS</p>
          <h1>Every conversation<br /><em>can lead somewhere.</em></h1>
          <p className="vp-hub-intro">Talk to customers by voice, WhatsApp, or web chat. Connect what they say to the people, tools, and workflows that move the request forward.</p>
          <div className="vp-hero-actions"><Link className="vp-button vp-button-dark" href="/contact">Talk to our team <Arrow /></Link><a className="vp-text-link" href="#explore-products">Explore the products <span aria-hidden="true">â†“</span></a></div>
          <div className="vp-hero-rail" aria-label="Product journey"><span>01 / CONVERSE</span><i /><span>02 / UNDERSTAND</span><i /><span>03 / ACT</span></div>
        </section>

        <section className="vp-hub-products vp-wrap" id="explore-products">
          <div className="vp-section-head"><p className="vp-kicker">EXPLORE WHAT VOZON CAN DO</p><h2>One platform. The right product for each step.</h2><p>Start with the channel your customers use, then add the connections and automation your team needs.</p></div>
          {groups.map((group, groupIndex) => (
            <div className="vp-group" key={group.title}>
              <div className="vp-group-heading"><span>0{groupIndex + 1} / {group.title.toUpperCase()}</span><p>{group.description}</p></div>
              <div className="vp-product-list">
                {group.slugs.map((slug) => {
                  const product = getProduct(slug)!;
                  return <Link className="vp-product-row" href={`/product/${product.slug}`} key={slug}>
                    <ProductMark slug={product.slug} />
                    <span className="vp-product-row-copy"><strong>{product.name}</strong><small>{product.summary}</small></span>
                    <span className="vp-product-row-arrow" aria-hidden="true">â†—</span>
                  </Link>;
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="vp-journey-band"><div className="vp-wrap vp-journey-inner"><div><p className="vp-kicker">HOW IT FITS TOGETHER</p><h2>From the first hello<br />to the next action.</h2></div><div className="vp-journey-steps"><div><b>01</b><strong>Reach</strong><span>A call, WhatsApp message, or website question starts the conversation.</span></div><div><b>02</b><strong>Understand</strong><span>An agent gathers the context needed to answer or decide what comes next.</span></div><div><b>03</b><strong>Move forward</strong><span>A workflow updates a tool, sends a follow-up, or brings in your team.</span></div></div></div></section>
      </div>
    </ProductLayout>
  );
}

const productHeroImages: Record<string, string | null> = {
  "ai-voice-agent": "/images/ai_voice.png",
  "voice-cloning": "/images/ai_voice2.gif",
  "whatsapp-api": null,
  "whatsapp-bot": null,
  "web-chatbot": "/images/one_platform.png",
  "vozon-mcp": "/images/dashboard.png",
  workflows: "/images/one_platform.png",
  "create-workflows": "/images/one_platform.png",
  "end-to-end-automation": "/images/dashboard.png",
};

const productWorkflowLinks: Record<string, string[]> = {
  Voice: ["Phone calls", "WhatsApp", "Team workflows", "CRM"],
  Messaging: ["WhatsApp", "Voice agents", "Customer records", "Workflows"],
  Web: ["Website", "Live handoff", "Customer records", "Workflows"],
  Automation: ["Voice", "Messaging", "Your tools", "Team handoffs"],
  Connect: ["AI agents", "Connected tools", "Workflows", "Your systems"],
};

function toSolutionContent(product: Product): SolutionLandingContent {
  const applications = product.applications.map((item, index) => ({
    eyebrow: `WHERE IT HELPS ${String(index + 1).padStart(2, "0")}`,
    title: item.title,
    body: item.body,
    steps: product.steps.map((step) => step.title),
  }));
  const implementation = product.steps.slice(0, 2).map((step, index) => ({
    eyebrow: `HOW IT WORKS ${String(index + 1).padStart(2, "0")}`,
    title: step.title,
    body: step.body,
    steps: product.steps.map((item) => item.title),
  }));

  return {
    title: product.name,
    category: `Product / ${product.category}`,
    breadcrumbHref: "/product",
    breadcrumbLabel: "Products",
    heroKicker: `${product.category.toUpperCase()} / VOZON PRODUCTS`,
    headline: product.headline,
    summary: product.summary,
    heroImage: product.slug in productHeroImages ? productHeroImages[product.slug] : "/images/ai_voice.png",
    heroAlt: `${product.name} for connected customer conversations`,
    heroWidgetLabel: `VOZON AI · ${product.category.toUpperCase()}`,
    heroPrompt: product.name,
    heroNote: product.value,
    heroInput: `Explore ${product.name}`,
    heroReady: "Ready to connect",
    highlights: product.steps.map((step) => step.title),
    stories: [...applications, ...implementation],
    integrations: productWorkflowLinks[product.category] ?? productWorkflowLinks.Automation,
    faqs: product.questions,
    relatedProducts: product.related.map((slug) => {
      const item = getProduct(slug);
      return item ? { title: item.name, summary: item.summary, href: `/product/${item.slug}` } : null;
    }).filter((item): item is { title: string; summary: string; href: string } => item !== null),
    videoHeadline: `${product.name}, from conversation to outcome.`,
    videoDescription: product.description,
    pricingKicker: "START WITH THE WORK THAT MATTERS",
    pricingHeadline: `Find the right starting point for ${product.name}.`,
    rollout: { focused: product.value, expanded: product.description },
    platformHeadline: `${product.name} fits into your wider workflow.`,
    platformCards: product.steps.map((step, index) => ({
      title: step.title,
      body: step.body,
      label: `STEP ${String(index + 1).padStart(2, "0")}`,
    })),
    launchHeadline: `Put ${product.name} to work.`,
    launchOptions: { first: product.steps[0].body, second: product.steps[1].body },
    faqHeadline: `Questions about ${product.name}.`,
    sample: {
      caller: product.applications[0]?.title ?? product.name,
      agent: product.applications[0]?.body ?? product.summary,
      outcome: product.value,
    },
  };
}

export function ProductDetailPage({ product }: { product: Product }) {
  const isWhatsAppBot = product.slug === "whatsapp-bot";
  return <SolutionLandingPage content={toSolutionContent(product)} heroVisual={isWhatsAppBot ? <WhatsAppPhoneExperience /> : undefined} />;
}

export { productCatalog };
