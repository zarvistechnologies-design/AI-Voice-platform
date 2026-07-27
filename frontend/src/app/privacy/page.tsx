import type { Metadata } from "next";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | vozon.ai",
  description:
    "Learn how vozon.ai collects, uses, stores, shares, and protects personal information, including Google user data.",
};

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information we collect",
    content: (
      <>
        <p>We collect information in the following categories:</p>
        <ul>
          <li><strong>Account and workspace information:</strong> name, email address, organization details, authentication information, team memberships, account preferences, and billing-related records.</li>
          <li><strong>Voice-agent configuration:</strong> prompts, knowledge sources, phone-number settings, tool configurations, workflows, and integration preferences that you provide.</li>
          <li><strong>Call and communication data:</strong> phone numbers, call timestamps, duration, direction, status, recordings when enabled, transcripts, summaries, extracted fields, tool activity, and call outcomes.</li>
          <li><strong>Integration data:</strong> authorization tokens, account identifiers, selected resources, and data retrieved from or written to third-party services at your direction.</li>
          <li><strong>Usage and technical data:</strong> IP address, browser and device information, application events, diagnostic logs, error reports, security events, and feature usage.</li>
          <li><strong>Support communications:</strong> information you provide when contacting us for assistance, demonstrations, or other enquiries.</li>
        </ul>
        <p>Customers are responsible for providing any notices and obtaining any consents required before recording calls or submitting personal information to the service.</p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "2. How we use information",
    content: (
      <>
        <p>We use information to:</p>
        <ul>
          <li>provide, operate, secure, maintain, and improve the Vozon platform;</li>
          <li>authenticate users and administer organizations, permissions, billing, and support;</li>
          <li>place, receive, route, transcribe, analyse, and document calls according to customer configuration;</li>
          <li>perform actions requested through connected tools, such as checking availability, creating appointments, or recording call outcomes;</li>
          <li>monitor reliability, prevent misuse, investigate incidents, and enforce our terms;</li>
          <li>comply with applicable law and respond to valid legal requests; and</li>
          <li>communicate service, security, support, and administrative information.</li>
        </ul>
        <p>We do not sell personal information. We do not use customer call content or Google user data for advertising.</p>
      </>
    ),
  },
  {
    id: "google-user-data",
    title: "3. Google user data",
    content: (
      <>
        <p>If you connect a Google account, Vozon requests access only after you initiate the connection and approve the permissions shown on Google&apos;s consent screen.</p>
        <h3>Google Calendar</h3>
        <p>Vozon may access calendar identity, availability, time-zone, and event information so an authorised voice agent can check availability and create or manage appointments in the calendar selected by you. Event details may include a title, start and end time, description, and attendee email that a user instructs the agent to add.</p>
        <h3>Google Sheets</h3>
        <p>Vozon may access a spreadsheet selected by you to verify its name and sheet tabs and to append information that you instruct an agent to record, such as a timestamp, customer details, call outcome, notes, and call identifier. Vozon does not scan unrelated spreadsheets.</p>
        <h3>Storage and sharing of Google data</h3>
        <p>Google OAuth access and refresh tokens are stored in encrypted form. We store the Google account identifier and the calendar, spreadsheet, and sheet-tab selections required to provide the configured integration. Calendar or spreadsheet content may be temporarily processed to complete the action requested by you, but we do not sell Google user data or share it for advertising.</p>
        <p>We share Google user data only with infrastructure and service providers acting on our behalf where necessary to operate and secure the service, when you direct us to transmit it, or when disclosure is required by law. Our use and transfer of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" rel="noreferrer" target="_blank">Google API Services User Data Policy</a>, including its Limited Use requirements.</p>
        <h3>Your control</h3>
        <p>You can disable an integration for an individual agent or disconnect Google from the Integrations page. Disconnecting removes the stored Google authorization from Vozon and attempts to revoke the token with Google. You may also revoke access through your Google Account security settings.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "4. When we share information",
    content: (
      <>
        <p>We may disclose information to:</p>
        <ul>
          <li><strong>Service providers:</strong> hosting, database, telephony, speech-processing, artificial-intelligence, storage, email, payment, monitoring, and security providers that process data to deliver the service.</li>
          <li><strong>Connected services:</strong> third-party applications that a customer deliberately connects or invokes through a tool or webhook.</li>
          <li><strong>Workspace users:</strong> authorised members of the customer organization according to their assigned permissions.</li>
          <li><strong>Authorities and other parties:</strong> where reasonably necessary to comply with law, protect rights and safety, investigate abuse, or respond to valid legal process.</li>
          <li><strong>Business transferees:</strong> as part of a merger, financing, acquisition, reorganization, or sale of assets, subject to appropriate confidentiality protections.</li>
        </ul>
        <p>Service providers are permitted to process information only for the services they provide to us and under applicable contractual and legal obligations.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "5. Data retention and deletion",
    content: (
      <>
        <p>We retain information for as long as reasonably necessary to provide the service, maintain security and audit records, resolve disputes, comply with legal obligations, and enforce agreements. Retention depends on the type of information, customer configuration, contractual requirements, and applicable law.</p>
        <p>Customers may delete supported records through the product or request account and personal-data deletion by emailing <a href="mailto:hello@vozon.ai">hello@vozon.ai</a>. After verifying the request and considering legal retention requirements, we will delete or de-identify applicable information from active systems. Residual copies may remain in encrypted backups until they are overwritten through normal backup cycles.</p>
        <p>Disconnecting Google removes the connection credentials from Vozon. Data previously written to a customer&apos;s Google Calendar or Google Sheet remains in that Google account until the customer deletes it there.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "6. Security",
    content: (
      <p>We use administrative, technical, and organizational safeguards designed to protect information, including access controls, encrypted transport, encryption of stored integration credentials, logging, and restricted production access. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.</p>
    ),
  },
  {
    id: "international",
    title: "7. International processing",
    content: (
      <p>Vozon and its service providers may process information in countries other than the country where it was collected. Where required, we use appropriate safeguards for international transfers and process information in accordance with applicable data-protection law.</p>
    ),
  },
  {
    id: "rights",
    title: "8. Your choices and rights",
    content: (
      <>
        <p>Depending on your location, you may have rights to request access, correction, deletion, restriction, portability, or objection concerning your personal information. You may also withdraw consent where processing is based on consent.</p>
        <p>To submit a request, contact <a href="mailto:hello@vozon.ai">hello@vozon.ai</a>. We may need to verify your identity and authority. If Vozon processes information on behalf of a customer organization, we may direct your request to that organization.</p>
      </>
    ),
  },
  {
    id: "children",
    title: "9. Children",
    content: (
      <p>The service is intended for businesses and is not directed to children under 18. We do not knowingly collect personal information directly from children. If you believe a child has provided personal information to us, contact us so we can investigate and take appropriate action.</p>
    ),
  },
  {
    id: "changes",
    title: "10. Changes to this policy",
    content: (
      <p>We may update this Privacy Policy to reflect changes in the service, law, or our data practices. We will publish the revised policy on this page and update the effective date. Where required, we will provide additional notice or request consent.</p>
    ),
  },
  {
    id: "contact",
    title: "11. Contact us",
    content: (
      <>
        <p>For privacy questions, requests, or complaints, contact:</p>
        <address>
          <strong>vozon.ai Privacy Team</strong><br />
          Email: <a href="mailto:hello@vozon.ai">hello@vozon.ai</a><br />
          Website: <Link href="/">https://vozon.ai</Link>
        </address>
      </>
    ),
  },
] as const;

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <div className="bg-[#f7faf9] text-[#10201c]">
        <header className="border-b border-[#d9e6e2] bg-[#061410] px-5 pb-16 pt-36 text-white sm:px-8 sm:pt-40 lg:px-12">
          <div className="mx-auto max-w-[1080px]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">Legal</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">Privacy Policy</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/60">
              This policy explains how vozon.ai collects, uses, stores, shares, and protects information when businesses use our AI voice-agent platform and connected services.
            </p>
            <p className="mt-7 text-sm font-medium text-white/45">Effective date: July 28, 2026</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1080px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-0 lg:py-20">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0a8f80]">On this page</p>
            <nav aria-label="Privacy policy sections" className="mt-4 grid gap-2">
              {sections.map((section) => (
                <a className="text-sm text-[#526660] transition hover:text-[#087e71]" href={`#${section.id}`} key={section.id}>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="min-w-0 rounded-3xl border border-[#d9e6e2] bg-white px-6 py-4 shadow-[0_22px_70px_rgba(11,44,36,0.07)] sm:px-10">
            <div className="border-b border-[#e2ece9] py-8 text-sm leading-7 text-[#526660]">
              <p>
                This Privacy Policy applies to the Vozon website, dashboard, APIs, voice-agent services, and integrations (collectively, the &ldquo;Service&rdquo;). In this policy, &ldquo;Vozon,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; and &ldquo;our&rdquo; refer to vozon.ai.
              </p>
            </div>
            {sections.map((section) => (
              <section className="scroll-mt-28 border-b border-[#e2ece9] py-9 last:border-b-0" id={section.id} key={section.id}>
                <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#10201c]">{section.title}</h2>
                <div className="mt-5 grid gap-4 text-[15px] leading-7 text-[#526660] [&_a]:font-semibold [&_a]:text-[#087e71] [&_a]:underline [&_a]:underline-offset-4 [&_address]:not-italic [&_h3]:mt-3 [&_h3]:font-semibold [&_h3]:text-[#203c34] [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-[#203c34] [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5">
                  {section.content}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </SiteLayout>
  );
}
