import type { Metadata } from "next";

import { ProductOverviewPage } from "@/components/layout/ProductOverviewPage";

export const metadata: Metadata = {
  title: "AI Voice Agent Platform | Vozon",
  description: "Build, deploy, and monitor production AI voice agents from one connected platform.",
  alternates: { canonical: "/product" },
};

export default function ProductPage() {
  return <ProductOverviewPage />;
}
