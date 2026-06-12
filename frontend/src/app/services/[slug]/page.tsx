import { notFound } from "next/navigation";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { servicePages } from "@/config/site";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return servicePages.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);

  if (!service) {
    return {
      title: "Service not found",
    };
  }

  return {
    title: `${service.title} | AI Voice Platform`,
    description: service.summary,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <SiteLayout>
      <section className="service-page-hero">
        <div className="service-page-copy">
          <p className="section-kicker">{service.kicker}</p>
          <h1>{service.title}</h1>
          <p>{service.summary}</p>
          <div className="service-page-actions">
            <Link className="primary-button" href="/#contact">
              Contact Sales
            </Link>
            <Link className="secondary-button" href="/#demo">
              Try Demo
            </Link>
          </div>
        </div>

        <div className="service-page-panel" aria-label={`${service.title} highlights`}>
          <div className="service-page-wave" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="service-page-metrics">
            {service.highlights.map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="service-page-details" aria-label={`${service.title} details`}>
        {service.sections.map((section, index) => (
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
