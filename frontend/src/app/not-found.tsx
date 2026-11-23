import type { Metadata } from "next";

import { NotFound } from "@/components/ui/not-found";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "Page not found | Vozon",
  description: "The page you requested could not be found. Explore Vozon or contact our team.",
};

export default function NotFoundPage() {
  return (
    <SiteLayout>
      <NotFound />
    </SiteLayout>
  );
}
