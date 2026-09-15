import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/layout/DetailPage";
import { comparisonPages } from "@/config/seoPages";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return comparisonPages.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; const page = comparisonPages.find((item) => item.slug === slug); if (!page) return {};
  return { title: `${page.title} | Vozon`, description: page.description, alternates: { canonical: `/compare/${slug}` } };
}
export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params; const page = comparisonPages.find((item) => item.slug === slug); if (!page) notFound();
  return <DetailPage kicker={page.kicker} title={page.title} heroTitle={page.title} summary={page.description} highlights={page.highlights} sections={page.sections} primaryAction={{ href: "/contact", label: "Evaluate Vozon" }} secondaryAction={page.secondaryAction!} />;
}
