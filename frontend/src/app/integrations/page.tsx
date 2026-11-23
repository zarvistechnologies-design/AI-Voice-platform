import type { Metadata } from "next";
import Link from "next/link";

import { IntegrationDirectory } from "@/components/integrations/IntegrationDirectory";
import { SiteLayout } from "@/components/layout/SiteLayout";
import "@/app/business/industries/healthcare/healthcare.css";
import "@/components/company/CompanyEditorial.css";

export const metadata: Metadata = {
  title: "AI Voice Agent Integrations & Ecosystem | Vozon",
  description:
    "Explore 50+ Vozon integrations for telephony, AI models, CRM, scheduling, WhatsApp, and automation.",
  alternates: { canonical: "/integrations" },
};

const integrationCategories = [
  {
    name: "Enterprise CRMs",
    detail: "Salesforce, HubSpot, Zoho, LeadSquared",
    count: "12 tools →",
  },
  {
    name: "Telephony & SIP",
    detail: "Twilio, Exotel, Plivo, FreeSWITCH",
    count: "8 tools →",
  },
  {
    name: "Messaging & Channels",
    detail: "WhatsApp Business, SMS, Web Chat, Email",
    count: "6 tools →",
  },
  {
    name: "Calendars & Scheduling",
    detail: "Google Calendar, Cal.com, Calendly",
    count: "5 tools →",
  },
  {
    name: "Automation & Webhooks",
    detail: "Zapier, Make, Custom REST & Webhooks",
    count: "15+ tools →",
  },
];

export default function IntegrationsPage() {
  return (
    <SiteLayout>
      <div id="integrations-page" className="min-h-screen bg-[#f8f9f9] text-[#171719] cmp-page">
        {/* Editorial Hero Stage */}
        <section className="cmp-hero hcr-wrap">
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }} className="mb-4 text-xs text-zinc-500">
            <Link href="/" className="text-zinc-600 hover:text-black hover:underline transition">Home</Link>
            <span className="text-zinc-400">/</span>
            <span className="font-semibold text-zinc-900">Integrations</span>
          </div>

          <div className="cmp-hero-stage">
            <div className="cmp-hero-grid">
              <div className="cmp-hero-left">
                <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase m-0 mb-2">VOZON ECOSYSTEM &amp; INTEGRATIONS</p>
                <h1 className="!text-[clamp(20px,2vw,28px)] !font-semibold !leading-[1.25] !tracking-[-0.03em] text-slate-900 !max-w-[480px] !m-0 !mb-3 !text-left">
                  Connect the tools behind every conversation.
                </h1>
                <p className="cmp-hero-lead !text-[14px] !leading-[1.6] !text-slate-600 !max-w-[480px] !m-0 !mb-6 !text-left">
                  Browse 50+ verified platforms and connection paths for Vozon. Route calls through
                  your SIP carrier, trigger WhatsApp messages, sync live customer data with your
                  CRM, and invoke custom webhooks with zero latency.
                </p>
                <div className="cmp-hero-actions">
                  <a href="#integration-directory" className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-black px-4 text-xs font-semibold text-white transition hover:bg-zinc-800 shadow-sm">
                    Browse integrations <span aria-hidden="true">&#8595;</span>
                  </a>
                  <Link href="/contact" className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                    Plan custom integration <span aria-hidden="true">&#8599;</span>
                  </Link>
                </div>
              </div>

              <div className="cmp-ledger" aria-label="Verified integrations overview">
                <div className="cmp-ledger-head">
                  <span>VERIFIED INTEGRATIONS</span>
                  <span className="cmp-ledger-badge">
                    <i aria-hidden="true" /> 50+ Live Tools
                  </span>
                </div>
                {integrationCategories.map((item) => (
                  <a key={item.name} href="#integration-directory" className="cmp-ledger-link">
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.detail}</small>
                    </div>
                    <span>{item.count}</span>
                  </a>
                ))}
              </div>
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
                Talk to an integration architect <span aria-hidden="true">&#8599;</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
