import { notFound } from "next/navigation";

import { ProductServicePage } from "@/components/layout/ProductServicePage";
import { VoiceAgentsProductPageV2 } from "@/components/product/VoiceAgentsProductPageV2";
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
    title: `${service.title} | Vozon`,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);
  const experience = productServiceExperiences[slug];

  if (!service || !experience) {
    notFound();
  }

  if (slug === "voice-agents") {
    return <VoiceAgentsProductPageV2 />;
  }

  return <ProductServicePage experience={experience} service={service} />;
}
