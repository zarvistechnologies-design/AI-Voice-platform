import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { articlePages } from "@/config/seoPages";
import "@/app/business/industries/healthcare/healthcare.css";
import "@/components/company/CompanyEditorial.css";

export const metadata: Metadata = {
  title: "Guides and Insights | Vozon",
  description:
    "Practical guides to planning, launching, and improving customer conversation workflows and AI voice agents.",
  alternates: { canonical: "/resources/blog" },
};

export default function BlogPage() {
  const [featured, ...articles] = articlePages;

  return (
    <div className="hcr-site sln-site">
      <SiteHeader />

      <main className="hcr-page cmp-page">
        {/* ==================================================================
            1. 2-COLUMN EDITORIAL HERO (Compact Headings + Featured Guide Ledger)
            ================================================================== */}
        <section className="cmp-hero hcr-wrap">
          <div className="hcr-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Blog &amp; Insights</span>
          </div>

          <div className="cmp-hero-stage">
            <div className="cmp-hero-grid">
              <div className="cmp-hero-left">
                <p className="hcr-kicker">VOZON / INSIGHTS &amp; FIELD GUIDES</p>
                <h1>Ideas for better customer conversations.</h1>
                <p className="cmp-hero-lead">
                  Practical guides for teams planning voice AI, designing low-latency workflows, and
                  making every customer call count.
                </p>
                <div className="cmp-hero-actions">
                  <Link href={`/resources/blog/${featured.slug}`} className="cmp-btn-primary">
                    Read featured guide <span aria-hidden="true">&#8599;</span>
                  </Link>
                  <a href="#article-library" className="cmp-btn-secondary">
                    Browse all guides <span aria-hidden="true">&#8595;</span>
                  </a>
                </div>
              </div>

              <div className="cmp-ledger" aria-label="Featured articles">
                <div className="cmp-ledger-head">
                  <span>FEATURED &amp; POPULAR</span>
                  <span className="cmp-ledger-badge">
                    <i aria-hidden="true" /> {articlePages.length} Guides
                  </span>
                </div>
                <Link href={`/resources/blog/${featured.slug}`} className="cmp-ledger-link">
                  <div>
                    <strong>{featured.title}</strong>
                    <small>Featured · {featured.kicker}</small>
                  </div>
                  <span>Read &rarr;</span>
                </Link>
                {articles.slice(0, 3).map((article) => (
                  <Link
                    key={article.slug}
                    href={`/resources/blog/${article.slug}`}
                    className="cmp-ledger-link"
                  >
                    <div>
                      <strong>{article.title}</strong>
                      <small>{article.kicker}</small>
                    </div>
                    <span>Read &rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            2. ARTICLE LIBRARY (3-Column Clean Cards)
            ================================================================== */}
        <section className="hcr-platform hcr-wrap" id="article-library" style={{ paddingTop: "24px" }}>
          <p className="hcr-kicker">EXPLORE THE LIBRARY</p>
          <h2>Find your next useful answer.</h2>

          <div className="hcr-platform-grid">
            {articlePages.map((article, index) => (
              <Link key={article.slug} href={`/resources/blog/${article.slug}`}>
                <span>{String(index + 1).padStart(2, "0")} · {article.kicker}</span>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <strong>READ GUIDE &#8599;</strong>
              </Link>
            ))}
          </div>
        </section>

        {/* ==================================================================
            3. LAUNCH SPLIT
            ================================================================== */}
        <section className="hcr-launch hcr-wrap">
          <div>
            <p className="hcr-kicker">PUT THE IDEAS TO WORK</p>
            <h2>Have a conversation workflow in mind?</h2>
          </div>
          <div className="hcr-launch-options">
            <div>
              <span>TALK TO SOLUTIONS</span>
              <h3>Design your voice workflow with our team</h3>
              <p>
                Share your call volume, languages, and CRM tools—we will help you map a sub-88ms
                production rollout.
              </p>
              <Link href="/contact">
                Talk to our team <span aria-hidden="true">&#8599;</span>
              </Link>
            </div>
            <div>
              <span>TRY IT LIVE</span>
              <h3>Explore the AI Voice Agent platform</h3>
              <p>
                See how Vozon handles inbound calls, appointment booking, and instant WhatsApp
                confirmations.
              </p>
              <Link href="/product/ai-voice-agent">
                Explore products <span aria-hidden="true">&#8599;</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
