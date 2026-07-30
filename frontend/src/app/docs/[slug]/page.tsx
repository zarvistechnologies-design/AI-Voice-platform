import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsArticle } from "@/components/docs/DocsArticle";
import { docsTopic, docsTopics } from "@/lib/docsContent";

export function generateStaticParams() {
  return docsTopics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = docsTopic(slug);
  return topic ? { title: `${topic.title} | Vozon Documentation`, description: topic.description } : {};
}

export default async function DocsTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = docsTopic(slug);
  if (!topic) notFound();
  return <DocsArticle topic={topic} />;
}
