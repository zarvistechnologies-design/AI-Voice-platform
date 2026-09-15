import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { integrationPages } from "@/config/seoPages";

export const metadata: Metadata = {
  title: "AI Voice Agent Integrations | Vozon",
  description:
    "Connect vozon.ai voice agents with CRM, scheduling, telephony, email, and custom business workflows.",
  alternates: { canonical: "/integrations" },
};

const integrations = [
  {
    name: "HubSpot",
    category: "CRM",
    logo: "/images/company-logos/hubspot.svg",
    description:
      "Keep customer conversations connected to your CRM by creating contacts and recording call summaries, outcomes, and follow-up context.",
    capabilities: ["Contact creation", "Call notes", "Customer follow-up"],
  },
  {
    name: "Salesforce",
    category: "CRM",
    mark: "SF",
    description:
      "Send qualified caller details and structured conversation outcomes into the Salesforce workflows used by sales and service teams.",
    capabilities: ["Lead updates", "Activity records", "Workflow triggers"],
  },
  {
    name: "Google Calendar",
    category: "Scheduling",
    logo: "/images/integrations/google-calendar.svg",
    description:
      "Let approved voice agents check calendar availability and create appointments while a customer is still on the call.",
    capabilities: ["Live availability", "Appointment booking", "Calendar selection"],
  },
  {
    name: "Twilio",
    category: "Telephony",
    mark: "TW",
    description:
      "Bring owned Twilio phone numbers into Vozon for inbound and outbound voice-agent conversations.",
    capabilities: ["Number import", "Inbound calls", "Outbound calls"],
  },
  {
    name: "Zoho",
    category: "CRM",
    logo: "/images/integrations/zoho.svg",
    description:
      "Connect qualified leads and structured call results with Zoho CRM through controlled integration workflows.",
    capabilities: ["Lead capture", "CRM updates", "Call outcomes"],
  },
  {
    name: "Custom CRM",
    category: "Business systems",
    mark: "CRM",
    description:
      "Use scoped APIs, agent tools, and webhooks to connect the CRM or internal system your team already operates.",
    capabilities: ["Custom fields", "Secure actions", "Event webhooks"],
  },
  {
    name: "Calendly",
    category: "Scheduling",
    logo: "/images/integrations/calendly.svg",
    description:
      "Allow agents to discover the right event type and create a one-time booking link during a conversation.",
    capabilities: ["Event types", "Booking links", "Call-time scheduling"],
  },
  {
    name: "Exotel",
    category: "Telephony",
    mark: "EXO",
    description:
      "Import an Exotel number, assign it to a voice agent, and use it in your approved calling workflows.",
    capabilities: ["Number import", "Agent assignment", "Call routing"],
  },
  {
    name: "Gmail",
    category: "Communication",
    logo: "/images/integrations/gmail.svg",
    description:
      "Move call summaries and next-step details into approved email workflows so teams can follow up with full context.",
    capabilities: ["Follow-up context", "Team notifications", "Email workflows"],
  },
] as const;

const connectionMethods = [
  {
    number: "01",
    title: "Native connectors",
    body: "Authorize supported services inside Vozon and choose the resources an agent is allowed to use.",
  },
  {
    number: "02",
    title: "Telephony setup",
    body: "Import or purchase a phone number, verify ownership, and assign it to the correct voice agent.",
  },
  {
    number: "03",
    title: "APIs and webhooks",
    body: "Connect custom systems with scoped credentials, explicit actions, structured events, and observable failures.",
  },
] as const;

export default function IntegrationsPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-black px-5 pb-20 pt-36 sm:px-8 sm:pb-24 sm:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(69,221,206,0.17),transparent_30%),radial-gradient(circle_at_82%_15%,rgba(103,232,249,0.1),transparent_26%)]" />
        <div className="relative mx-auto max-w-6xl">
          <span className="inline-flex rounded-full border border-[#45ddce]/25 bg-[#45ddce]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#8ff7ec]">
            Integrations
          </span>
          <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Connect every conversation to the tools that move work forward.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
            Vozon connects voice agents with CRM, calendars, telephony, email, and custom business systems so a call can create a useful next step—not another manual task.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link className="rounded-xl bg-[#45ddce] px-6 py-3.5 text-sm font-black text-[#02110d] transition hover:bg-[#73eee2]" href="/contact">
              Plan an integration
            </Link>
            <Link className="rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.09]" href="/docs">
              Read API documentation
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#45ddce]">Connected platforms</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Integrations across your favorite platforms
            </h2>
            <p className="mt-5 text-base leading-8 text-white/48">
              These are the platforms shown in our integration network. Each connection is designed around a clear business action, controlled access, and a visible outcome.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {integrations.map((integration) => (
              <article className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-[#45ddce]/35 hover:bg-[#45ddce]/[0.055]" key={integration.name}>
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white p-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
                    {"logo" in integration ? (
                      <Image alt={`${integration.name} logo`} height={40} src={integration.logo} width={40} />
                    ) : (
                      <span className="text-sm font-black tracking-[-0.04em] text-[#073d38]">{integration.mark}</span>
                    )}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/42">
                    {integration.category}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{integration.name}</h3>
                <p className="mt-3 min-h-24 text-sm leading-7 text-white/48">{integration.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {integration.capabilities.map((capability) => (
                    <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/58" key={capability}>
                      {capability}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#45ddce]">Integration guides</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Plan each connection with confidence.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/48">
              Explore practical connection patterns, supported outcomes, testing considerations, and safe failure handling for popular platforms.
            </p>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {integrationPages.map((page) => (
              <Link
                className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#45ddce]/35 hover:bg-[#45ddce]/[0.055]"
                href={`/integrations/${page.slug}`}
                key={page.slug}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#45ddce]">Integration guide</span>
                <h3 className="mt-2 text-lg font-semibold text-white">{page.title.replace(" Voice AI Integration", "")}</h3>
                <p className="mt-2 text-sm leading-6 text-white/48">{page.description}</p>
                <span className="mt-4 inline-flex text-sm font-bold text-[#8ff7ec] transition group-hover:translate-x-1">Read guide →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#45ddce]">Connection methods</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">A clear path for every system.</h2>
              <p className="mt-5 text-sm leading-7 text-white/48">
                The exact setup depends on the platform and your workflow. We keep permissions narrow and make every external action observable.
              </p>
            </div>
            <div className="grid gap-3">
              {connectionMethods.map((method) => (
                <article className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:grid-cols-[58px_1fr] sm:p-6" key={method.number}>
                  <span className="grid size-12 place-items-center rounded-xl bg-[#45ddce]/12 text-sm font-black text-[#8ff7ec]">{method.number}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{method.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/48">{method.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[#45ddce]/20 bg-[radial-gradient(circle_at_15%_20%,rgba(69,221,206,0.15),transparent_36%),#091a17] p-7 sm:p-12">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#45ddce]">Build your workflow</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Have another platform in your stack?
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50">
            Tell us what your agents need to read, update, or trigger. We’ll help map the right native connector, telephony setup, API action, or webhook flow.
          </p>
          <Link className="mt-8 inline-flex rounded-xl bg-[#45ddce] px-6 py-3.5 text-sm font-black text-[#02110d] transition hover:bg-[#73eee2]" href="/contact">
            Talk to our team
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
