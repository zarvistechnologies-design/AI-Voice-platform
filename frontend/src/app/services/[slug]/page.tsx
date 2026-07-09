import { notFound } from "next/navigation";

import { DetailPage } from "@/components/layout/DetailPage";
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
    title: `${service.title} | vozon.ai`,
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
    <DetailPage
      kicker={service.kicker}
      title={service.title}
      summary={service.summary}
      highlights={service.highlights}
      sections={service.sections}
      primaryAction={{ href: "/#contact", label: "Contact Sales" }}
      secondaryAction={{ href: "/#demo", label: "Try Demo" }}
    />
  );
}
