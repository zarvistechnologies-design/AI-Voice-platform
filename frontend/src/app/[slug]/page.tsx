import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DetailPage } from "@/components/layout/DetailPage";
import { commercialPages } from "@/config/seoPages";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return commercialPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = commercialPages.find((item) => item.slug === slug);
  if (!page) return {};
  return {
    title: `${page.title} | Vozon`,
    description: page.description,
    alternates: { canonical: `/${slug}` },
    openGraph: { title: `${page.title} | Vozon`, description: page.description, url: `/${slug}` },
  };
}

export default async function CommercialSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = commercialPages.find((item) => item.slug === slug);
  if (!page) notFound();
  return <DetailPage kicker={page.kicker} title={page.title} heroTitle={page.title} summary={page.description} highlights={page.highlights} sections={page.sections} primaryAction={page.primaryAction ?? { href: "/contact", label: "Plan your voice agent" }} secondaryAction={page.secondaryAction ?? { href: "/pricing", label: "See pricing" }} />;
}
