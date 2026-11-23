import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";
import type { SeoPage } from "@/config/seoPages";
import "@/components/company/CompanyPages.css";

export function ArticleDetailPage({ article }: { article: SeoPage }) {
  return (
    <SiteLayout>
      <article className="company-page company-article-page">
        <div className="company-wrap company-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/resources/blog">Blog &amp; Insights</Link><span>/</span><span>{article.kicker}</span></div>
        <header className="company-wrap company-article-hero"><div><p className="company-kicker">{article.kicker}</p><h1>{article.title}</h1><p className="company-lead">{article.description}</p><Link className="company-text-link" href="/resources/blog">← All guides</Link></div><aside><span>IN THIS GUIDE</span>{article.highlights.map((highlight, index) => <p key={highlight}><b>{String(index + 1).padStart(2, "0")}</b>{highlight}</p>)}</aside></header>
        <div className="company-article-band"><div className="company-wrap"><span>VOZON / FIELD GUIDE</span><strong>From idea to useful customer outcome.</strong></div></div>
        <section className="company-wrap company-article-body"><div className="company-article-intro"><p className="company-kicker">THE PRACTICAL FRAMEWORK</p><h2>What you need to know.</h2><p>Use these points to evaluate the topic and plan your next step.</p></div><div className="company-article-sections">{article.sections.map((section, index) => <section key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{section.title}</h2><p>{section.body}</p></div></section>)}</div></section>
        <section className="company-wrap company-cta"><div><p className="company-kicker">PUT THE GUIDE TO WORK</p><h2>Ready to discuss your use case?</h2></div><Link className="company-button company-button-light" href="/contact">Talk to our team <span aria-hidden="true">↗</span></Link></section>
      </article>
    </SiteLayout>
  );
}
