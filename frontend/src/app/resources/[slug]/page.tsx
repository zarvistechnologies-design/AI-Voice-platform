import { notFound } from "next/navigation";

import { DetailPage } from "@/components/layout/DetailPage";
import { BlogPage } from "@/components/resources/BlogPage";
import { CaseStudiesPage } from "@/components/resources/CaseStudiesPage";
import { ChangelogPage } from "@/components/resources/ChangelogPage";
import { HelpCenterPage } from "@/components/resources/HelpCenterPage";
import { TrustCenterPage } from "@/components/resources/TrustCenterPage";
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
    title: `${resource.title} | vozon.ai`,
    description: resource.summary,
  };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = resourcePages.find((item) => item.slug === slug);

  if (!resource) {
    notFound();
  }

  if (resource.slug === "blog") {
    return <BlogPage />;
  }

  if (resource.slug === "case-studies") {
    return <CaseStudiesPage />;
  }

  if (resource.slug === "changelog") {
    return <ChangelogPage />;
  }

  if (resource.slug === "help-center") {
    return <HelpCenterPage />;
  }

  if (resource.slug === "trust-center") {
    return <TrustCenterPage />;
  }

  return (
    <DetailPage
      kicker={resource.kicker}
      title={resource.title}
      summary={resource.summary}
      highlights={resource.highlights}
      sections={resource.sections}
      primaryAction={{ href: "/contact", label: "Contact Sales" }}
      secondaryAction={{ href: "/resources/blog", label: "Visit Blog" }}
    />
  );
}
