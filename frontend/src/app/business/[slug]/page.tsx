import { notFound } from "next/navigation";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { businessPages } from "@/config/site";

type BusinessPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return businessPages.map((business) => ({
    slug: business.slug,
  }));
}

export async function generateMetadata({ params }: BusinessPageProps) {
  const { slug } = await params;
  const business = businessPages.find((item) => item.slug === slug);

  if (!business) {
    return {
      title: "Business page not found",
    };
  }

  return {
    title: `${business.title} | AI Voice Platform`,
    description: business.summary,
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const business = businessPages.find((item) => item.slug === slug);

  if (!business) {
    notFound();
  }

  return (
    <SiteLayout>
      <section className="service-page-hero">
        <div className="service-page-copy">
          <p className="section-kicker">{business.kicker}</p>
          <h1>{business.title}</h1>
          <p>{business.summary}</p>
          <div className="service-page-actions">
            <Link className="primary-button" href="/#contact">
              Contact Sales
            </Link>
            <Link className="secondary-button" href="/#demo">
              Try Demo
            </Link>
          </div>
        </div>

        <div className="service-page-panel" aria-label={`${business.title} highlights`}>
          <div className="service-page-wave" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="service-page-metrics">
            {business.highlights.map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="service-page-details" aria-label={`${business.title} details`}>
        {business.sections.map((section, index) => (
          <article key={section.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
