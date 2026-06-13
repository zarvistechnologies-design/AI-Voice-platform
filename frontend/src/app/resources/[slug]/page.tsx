import { notFound } from "next/navigation";

import { DetailPage } from "@/components/layout/DetailPage";
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
    <DetailPage
      kicker={resource.kicker}
      title={resource.title}
      summary={resource.summary}
      highlights={resource.highlights}
      sections={resource.sections}
      primaryAction={{ href: "/#contact", label: "Contact Sales" }}
      secondaryAction={{ href: "/resources/blog", label: "Visit Blog" }}
    />
  );
}
