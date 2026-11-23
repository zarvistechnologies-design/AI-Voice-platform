import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailPage } from "@/components/product/ProductPages";
import { getProduct, productCatalog } from "@/config/productCatalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productCatalog.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Vozon`,
    description: product.summary,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title: `${product.name} | Vozon`, description: product.summary, type: "website" },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductDetailPage product={product} />;
}
