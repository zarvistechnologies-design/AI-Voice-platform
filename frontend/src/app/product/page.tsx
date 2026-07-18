import type { Metadata } from "next";

import { ProductOverviewPage } from "@/components/layout/ProductOverviewPage";

export const metadata: Metadata = {
  title: "AI Voice Product | AI Voice Platform",
  description: "Build, deploy, and monitor production AI voice agents from one connected platform.",
};

export default function ProductPage() {
  return <ProductOverviewPage />;
}
