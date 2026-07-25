import type { Metadata } from "next";

import { ContactExperience } from "@/components/contact/ContactExperience";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "Contact Sales | vozon.ai",
  description:
    "Talk to the vozon.ai team about voice agents, enterprise rollouts, pricing, integrations, and your customer conversation workflows.",
};

export default function ContactPage() {
  return (
    <SiteLayout>
      <ContactExperience />
    </SiteLayout>
  );
}
