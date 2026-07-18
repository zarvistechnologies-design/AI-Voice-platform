import { notFound } from "next/navigation";

import { UseCaseExperiencePage } from "@/components/layout/UseCaseExperiencePage";
import { businessPages } from "@/config/site";
import { useCaseExperiences } from "@/config/useCaseExperiences";

type BusinessPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const useCasePages = businessPages.filter((business) => business.kicker === "Use Cases");

export function generateStaticParams() {
  return useCasePages.map((business) => ({
    slug: business.slug,
  }));
}

export async function generateMetadata({ params }: BusinessPageProps) {
  const { slug } = await params;
  const business = useCasePages.find((item) => item.slug === slug);

  if (!business) {
    return {
      title: "Business page not found",
    };
  }

  return {
    title: `${business.title} | vozon.ai`,
    description: business.summary,
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const business = useCasePages.find((item) => item.slug === slug);
  const experience = useCaseExperiences[slug];

  if (!business || !experience) {
    notFound();
  }

  return <UseCaseExperiencePage business={business} experience={experience} />;
}
