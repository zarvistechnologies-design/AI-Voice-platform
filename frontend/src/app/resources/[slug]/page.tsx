import { notFound } from "next/navigation";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { resourcePages } from "@/config/site";

type ResourcePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return resourcePages.map((resource) => ({
    slug: resource.slug,
  }));
}

export async function generateMetadata({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = resourcePages.find((item) => item.slug === slug);

  if (!resource) {
    return {
      title: "Resource page not found",
    };
  }

  return {
    title: `${resource.title} | AI Voice Platform`,
    description: resource.summary,
  };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = resourcePages.find((item) => item.slug === slug);

  if (!resource) {
    notFound();
  }

  return (
    <SiteLayout>
      <section className="service-page-hero">
        <div className="service-page-copy">
          <p className="section-kicker">{resource.kicker}</p>
          <h1>{resource.title}</h1>
          <p>{resource.summary}</p>
          <div className="service-page-actions">
            <Link className="primary-button" href="/#contact">
              Contact Sales
            </Link>
            <Link className="secondary-button" href="/resources/blog">
              Visit Blog
            </Link>
          </div>
        </div>

        <div className="service-page-panel" aria-label={`${resource.title} highlights`}>
          <div className="service-page-wave" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="service-page-metrics">
            {resource.highlights.map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="service-page-details" aria-label={`${resource.title} details`}>
        {resource.sections.map((section, index) => (
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
