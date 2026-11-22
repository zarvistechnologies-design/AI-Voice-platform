import type { Metadata } from "next";
import Link from "next/link";

import { IntegrationDirectory } from "@/components/integrations/IntegrationDirectory";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "AI Voice Agent Integrations | Vozon",
  description:
    "Explore Vozon integrations for telephony, voice and speech providers, AI models, CRM, scheduling, messaging, automation, payments, and APIs.",
  alternates: { canonical: "/integrations" },
};

export default function IntegrationsPage() {
  return (
    <SiteLayout>
      <div className="bg-white text-[#111312]">
        <section className="border-b border-[#e3ebe8] bg-white px-5 pb-8 pt-20 sm:px-7 sm:pb-10 sm:pt-24">
          <div className="mx-auto max-w-[1340px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dbe4e1] bg-[#f7f9f8] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f8777]">
              <span aria-hidden="true" className="size-2 rounded-full bg-[#0f8777]" />
              Vozon integrations
            </span>
            <h1 className="mt-6 max-w-[780px] text-[clamp(1.85rem,3.8vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.05em]">
              Connect the tools behind every voice conversation.
            </h1>
            <p className="mt-6 max-w-[650px] text-[15px] leading-7 text-[#53605d] sm:text-base">
              Browse the platforms and connection paths listed for Vozon. Choose a category or search by name, then open an integration to see its use cases and setup guidance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-12 items-center rounded-full bg-[#0f8777] px-6 text-sm font-bold text-white transition hover:bg-[#0a685c]" href="#integration-directory">
                Browse integrations <span aria-hidden="true" className="ml-2">&rarr;</span>
              </Link>
              <Link className="inline-flex min-h-12 items-center rounded-full border border-[#dbe4e1] bg-white px-6 text-sm font-bold text-[#173b35] transition hover:border-[#0f8777]" href="/contact">
                Talk to our team
              </Link>
            </div>
          </div>
        </section>

        <IntegrationDirectory />

        <section className="border-t border-[#e3ebe8] bg-white px-5 py-12 sm:px-7 sm:py-14">
          <div className="mx-auto max-w-[850px] text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f8777]">Build your workflow</p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.055em]">
              Need a connection for your business?
            </h2>
            <p className="mx-auto mt-4 max-w-[650px] text-[15px] leading-7 text-[#5b6964] sm:text-base">
              Tell us which systems your agent needs to read or update. We&apos;ll help plan the right connector, API action, or webhook flow.
            </p>
            <Link className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#0f8777] px-7 text-sm font-bold text-white transition hover:bg-[#0a685c]" href="/contact">
              Plan an integration <span aria-hidden="true" className="ml-2">&rarr;</span>
            </Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
