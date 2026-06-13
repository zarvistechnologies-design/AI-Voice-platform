import { notFound } from "next/navigation";

import { DetailPage } from "@/components/layout/DetailPage";
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
    <DetailPage
      kicker={business.kicker}
      title={business.title}
      summary={business.summary}
      highlights={business.highlights}
      sections={business.sections}
      primaryAction={{ href: "/#contact", label: "Contact Sales" }}
      secondaryAction={{ href: "/#demo", label: "Try Demo" }}
    />
  );
}
