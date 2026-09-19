import type { Metadata } from "next";

import { DocsExperience } from "@/components/docs/DocsExperience";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "Documentation & Guides | Vozon AI Voice Platform",
  description: "Build, launch, and monitor production voice agents with Vozon.",
  alternates: { canonical: "/docs" },
};

export default function DocsPage() {
  return (
    <SiteLayout showFooter={false}>
      <DocsExperience />
    </SiteLayout>
  );
}
