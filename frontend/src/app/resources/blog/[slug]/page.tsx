import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetailPage } from "@/components/resources/ArticleDetailPage";
import { articlePages } from "@/config/seoPages";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return articlePages.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; const page = articlePages.find((item) => item.slug === slug); if (!page) return {};
  return { title: `${page.title} | Vozon`, description: page.description, alternates: { canonical: `/resources/blog/${slug}` }, openGraph: { type: "article", title: page.title, description: page.description, url: `/resources/blog/${slug}` } };
}
export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params; const page = articlePages.find((item) => item.slug === slug); if (!page) notFound();
  return <ArticleDetailPage article={page} />;
}
