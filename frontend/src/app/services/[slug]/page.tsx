import { notFound } from "next/navigation";

import { ProductServicePage } from "@/components/layout/ProductServicePage";
import { productServiceExperiences } from "@/config/productServiceExperiences";
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
  const experience = productServiceExperiences[slug];

  if (!service || !experience) {
    notFound();
  }

  return <ProductServicePage experience={experience} service={service} />;
}
