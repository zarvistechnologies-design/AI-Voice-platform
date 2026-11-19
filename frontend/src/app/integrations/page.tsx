import type { Metadata } from "next";
import Link from "next/link";

import { IntegrationDirectory } from "@/components/integrations/IntegrationDirectory";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "AI Voice Agent Integrations & Ecosystem | Vozon",
  description:
    "Explore 50+ Vozon integrations for telephony, AI models, CRM, scheduling, WhatsApp, and automation.",
  alternates: { canonical: "/integrations" },
};

export default function IntegrationsPage() {
  return (
    <SiteLayout>
      <div id="integration-page" className="min-h-screen bg-[#f8f9f9] text-[#171719]">
        {/* Premium Product & Solution Style Hero */}
        <section className="border-b border-[#e2e8f0] bg-white px-5 pb-16 pt-36 sm:px-7 sm:pb-20 sm:pt-40">
          <div className="mx-auto max-w-[1340px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#2563eb]">
              <span aria-hidden="true" className="size-2 rounded-full bg-[#2563eb]" />
              VOZON ECOSYSTEM &amp; INTEGRATIONS
            </span>
            <h1 className="mt-5 max-w-[840px] text-[clamp(2.8rem,5.2vw,5.2rem)] font-medium leading-[1.04] tracking-[-0.055em] text-[#0f172a]">
              Connect the tools behind every conversation.
            </h1>
            <p className="mt-5 max-w-[660px] text-[16px] leading-7 text-[#64748b]">
              Browse 50+ verified platforms and connection paths for Vozon. Route calls through your SIP carrier, trigger WhatsApp messages, sync live customer data with your CRM, and invoke custom webhooks with zero latency.
            </p>

            {/* Workflow Progression Strip */}
            <div aria-label="A connected customer workflow" className="integration-hero-flow mt-8">
              <div>
                <span>01</span>
                <strong>Customer Conversation</strong>
                <small>Voice Call · WhatsApp · Web Chat</small>
              </div>
              <i aria-hidden="true" />
              <div>
                <span>02</span>
                <strong>Vozon AI Agent</strong>
                <small>Intent · Triage · Synthesis</small>
              </div>
              <i aria-hidden="true" />
              <div>
                <span>03</span>
                <strong>Connected Systems</strong>
                <small>Salesforce · Zoho · Twilio · Calendars</small>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex min-h-11 items-center rounded-full bg-[#0f172a] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
                href="#integration-directory"
              >
                Browse integrations <span aria-hidden="true" className="ml-2">&darr;</span>
              </Link>
              <Link
                className="inline-flex min-h-11 items-center rounded-full border border-[#cbd5e1] bg-white px-6 text-sm font-semibold text-[#0f172a] transition hover:border-[#0f172a]"
                href="/contact"
              >
                Plan custom integration <span aria-hidden="true" className="ml-2">&#8599;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Directory with Modern Filter & Search */}
        <IntegrationDirectory />

        {/* Pre-footer Callout Banner */}
        <section className="border-t border-[#e2e8f0] bg-white px-5 py-14 sm:px-7 sm:py-16">
          <div className="mx-auto max-w-[850px] text-center">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#2563eb]">
              CUSTOM ARCHITECTURE &amp; APIS
            </span>
            <h2 className="mt-4 text-[clamp(2rem,3.8vw,3.2rem)] font-medium leading-[1.08] tracking-[-0.05em] text-[#0f172a]">
              Need a custom integration for your stack?
            </h2>
            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-7 text-[#64748b]">
              Tell our engineering team which internal APIs, ERP, or proprietary databases your AI agents need to read or update. We will build and test the connector with you.
            </p>
            <div className="mt-7 flex justify-center gap-3">
              <Link
                className="inline-flex min-h-11 items-center rounded-full bg-[#0f172a] px-7 text-sm font-semibold text-white transition hover:bg-black"
                href="/contact"
              >
                Talk to an integration architect <span aria-hidden="true" className="ml-2">&#8599;</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
