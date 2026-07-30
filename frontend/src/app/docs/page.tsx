import type { Metadata } from "next";

import { DocsExperience } from "@/components/docs/DocsExperience";

export const metadata: Metadata = {
  title: "Documentation | Vozon",
  description: "Build, launch, and monitor production voice agents with Vozon.",
};

export default function DocsPage() {
  return <DocsExperience />;
}
