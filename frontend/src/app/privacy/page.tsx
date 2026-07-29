import type { Metadata } from "next";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | vozon.ai",
  description:
    "Learn how vozon.ai collects, uses, protects, and manages personal information across its AI voice platform and services.",
};

const privacySections = [
  {
    id: "scope",
    number: "01",
    title: "Scope of this policy",
    content: (
      <>
        <p>
          This Privacy Policy explains how vozon.ai collects, uses, discloses, and protects
          personal information when you visit our website, create an account, contact us, or use
          our AI voice platform and related services.
        </p>
        <p>
          When an organization uses vozon.ai to handle calls or other conversations, that
          organization determines why the information is processed and is responsible for its
          notices, permissions, and instructions. In those situations, vozon.ai processes the
          information on the organization&apos;s behalf.
        </p>
      </>
    ),
  },
  {
    id: "information",
    number: "02",
    title: "Information we collect",
    content: (
      <>
        <p>We may collect the following categories of information:</p>
        <ul>
          <li>
            <strong>Account and contact information:</strong> name, email address, organization,
            login details, and the information you provide when requesting support or a demo.
          </li>
          <li>
            <strong>Voice and conversation information:</strong> call audio, transcripts,
            summaries, caller details, prompts, responses, and call outcomes when these features
            are enabled by the customer.
          </li>
          <li>
            <strong>Configuration and connected-service data:</strong> agent settings, knowledge
            sources, integration details, and records required to perform customer-authorized
            actions.
          </li>
          <li>
            <strong>Usage and technical information:</strong> device and browser details, IP
            address, timestamps, feature activity, diagnostic data, and security events.
          </li>
          <li>
            <strong>Transaction information:</strong> subscription, billing, and payment status.
            Payment card details may be handled directly by a payment provider rather than stored
            by vozon.ai.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    number: "03",
    title: "How we use information",
    content: (
      <>
        <p>We use information to:</p>
        <ul>
          <li>Provide, operate, maintain, and support the platform.</li>
          <li>Process calls and complete actions configured by our customers.</li>
          <li>Authenticate users, administer accounts, and manage billing.</li>
          <li>Monitor reliability, prevent abuse, investigate incidents, and protect the service.</li>
          <li>Understand product performance and improve features and user experience.</li>
          <li>Respond to enquiries and send service, security, and administrative communications.</li>
          <li>Comply with applicable law and enforce our agreements.</li>
        </ul>
        <p>
          Where required, we rely on an appropriate legal basis such as performance of a contract,
          legitimate interests, consent, or compliance with a legal obligation.
        </p>
      </>
    ),
  },
  {
    id: "voice-data",
    number: "04",
    title: "Voice data and call recordings",
    content: (
      <>
        <p>
          Voice conversations can contain personal or sensitive information. Customers control
          whether calls are recorded, which information an agent may request, how the agent uses
          connected systems, and how long conversation records are retained within their
          configuration.
        </p>
        <p>
          Customers must provide any legally required call-recording or AI notices, obtain
          appropriate consent, limit collection to information needed for the stated purpose, and
          avoid submitting information they are not authorized to process.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    number: "05",
    title: "How information is shared",
    content: (
      <>
        <p>We may share information only as reasonably necessary with:</p>
        <ul>
          <li>Service providers that support hosting, communications, security, analytics, billing, and customer support.</li>
          <li>Integrations and destinations selected or configured by the customer.</li>
          <li>Professional advisers, regulators, courts, or authorities when required by law or necessary to protect rights and safety.</li>
          <li>A successor or relevant party in connection with a merger, financing, reorganization, or sale of all or part of the business.</li>
        </ul>
        <p>We do not sell personal information for monetary consideration.</p>
      </>
    ),
  },
  {
    id: "retention",
    number: "06",
    title: "Retention and deletion",
    content: (
      <>
        <p>
          We retain personal information only for as long as needed to provide the services,
          maintain legitimate business and security records, resolve disputes, and meet legal
          obligations. Retention periods depend on the type of information, the customer&apos;s
          configuration, contractual requirements, and applicable law.
        </p>
        <p>
          When information is no longer required, we delete or anonymize it, subject to limited
          backups, legal holds, fraud-prevention records, and other lawful exceptions.
        </p>
      </>
    ),
  },
  {
    id: "security",
    number: "07",
    title: "Security",
    content: (
      <>
        <p>
          We use administrative, technical, and organizational safeguards designed to protect
          information against unauthorized access, loss, misuse, or alteration. These measures
          include access controls, monitoring, secure development practices, and protections for
          data in transit and at rest where appropriate.
        </p>
        <p>
          No system can guarantee absolute security. Customers should use strong authentication,
          restrict workspace access, review integration permissions, and promptly report suspected
          misuse.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    number: "08",
    title: "International data transfers",
    content: (
      <p>
        Our services and providers may process information in countries other than the country
        where it was collected. Where applicable, we use contractual and other safeguards intended
        to provide an appropriate level of protection for cross-border transfers.
      </p>
    ),
  },
  {
    id: "rights",
    number: "09",
    title: "Your rights and choices",
    content: (
      <>
        <p>
          Depending on your location, you may have rights to access, correct, delete, restrict, or
          object to certain processing of your personal information, or to request a portable copy.
          You may also withdraw consent where processing is based on consent.
        </p>
        <p>
          If your information was collected through a voice agent operated by one of our customers,
          contact that organization first. We will support the customer in responding to valid
          requests. For information controlled directly by vozon.ai, contact us using the details
          below. We may verify your identity before completing a request.
        </p>
      </>
    ),
  },
  {
    id: "children",
    number: "10",
    title: "Children's privacy",
    content: (
      <p>
        The services are intended for business use and are not directed to children. We do not
        knowingly collect personal information from children through accounts created for the
        platform. If you believe a child has provided personal information to us, please contact us
        so we can review and take appropriate action.
      </p>
    ),
  },
  {
    id: "updates",
    number: "11",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this Privacy Policy as our services, practices, or legal obligations change.
        We will post the revised policy on this page and update the date shown above. Where required,
        we will provide additional notice of material changes.
      </p>
    ),
  },
] as const;

const sectionAccents = [
  "border-[#5eead4]/30 bg-[#5eead4]/[0.07] text-[#72f2df]",
  "border-[#9d8cff]/30 bg-[#9d8cff]/[0.07] text-[#c4b5fd]",
  "border-[#fb923c]/30 bg-[#fb923c]/[0.07] text-[#ffb37d]",
  "border-[#facc15]/25 bg-[#facc15]/[0.06] text-[#f6db75]",
] as const;

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen overflow-hidden bg-black text-white">
        <section className="relative border-b border-white/[0.07] bg-black px-[clamp(1.25rem,5vw,4.75rem)] pt-32 pb-20 sm:pt-36 lg:pt-40 lg:pb-24">
          <div aria-hidden="true" className="absolute top-0 right-0 left-0 flex h-1.5">
            <span className="flex-[1.4] bg-[#5eead4]" />
            <span className="flex-1 bg-[#9d8cff]" />
            <span className="flex-[0.7] bg-[#ffad73]" />
            <span className="flex-[0.45] bg-[#f6db75]" />
          </div>

          <div className="relative mx-auto max-w-[1240px]">
            <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-2 text-xs font-semibold tracking-normal text-white/40 uppercase">
              <Link className="transition hover:text-[#72f2df]" href="/">Home</Link>
              <span aria-hidden="true" className="text-white/20">/</span>
              <span className="text-[#72f2df]">Legal</span>
              <span aria-hidden="true" className="text-white/20">/</span>
              <span className="text-white/70">Privacy</span>
            </nav>

            <div className="mx-auto max-w-[780px] text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-lg border border-[#5eead4]/25 bg-[#5eead4]/[0.08] text-[#72f2df] shadow-[0_18px_45px_rgba(94,234,212,0.12)]">
                <svg aria-hidden="true" className="size-8" fill="none" viewBox="0 0 24 24">
                  <path d="M12 3 5 6v5c0 4.8 2.8 8.3 7 10 4.2-1.7 7-5.2 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m9 12 2 2 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </span>
              <h1 className="mt-7 text-5xl leading-none font-semibold tracking-normal sm:text-6xl">
                <span className="text-[#72f2df]">Privacy</span> Policy
              </h1>
              <p className="mt-4 text-lg font-semibold text-[#c4b5fd]">vozon.ai</p>
              <p className="mt-4 inline-flex items-center justify-center gap-2 text-sm text-white/45">
                <svg aria-hidden="true" className="size-4 text-[#ffb37d]" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 7.5V12l3 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
                Last updated: July 28, 2026
              </p>
            </div>
          </div>
        </section>

        <section className="bg-black px-[clamp(1.25rem,5vw,4.75rem)] pb-10">
          <div className="mx-auto max-w-[1040px] space-y-5">
            <div className="flex flex-col gap-5 rounded-lg border border-white/10 border-l-[#5eead4] bg-[#080b0f] p-6 shadow-[0_22px_55px_rgba(0,0,0,0.3)] sm:flex-row sm:items-start sm:p-8">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-[#5eead4]/20 bg-[#5eead4]/[0.08] text-[#72f2df]">
                <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                  <path d="m12 3-1 4.2a2.4 2.4 0 0 1-1.8 1.8L5 10l4.2 1a2.4 2.4 0 0 1 1.8 1.8l1 4.2 1-4.2a2.4 2.4 0 0 1 1.8-1.8l4.2-1-4.2-1A2.4 2.4 0 0 1 13 7.2L12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </span>
              <p className="text-[15px] leading-7 text-white/62 sm:text-base sm:leading-8">
                Welcome to vozon.ai. We are committed to handling personal information
                transparently and responsibly. This Privacy Policy explains how we collect, use,
                protect, and manage information when you use our website, AI voice platform, and
                related services.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-[#ffad73]/35 bg-[#ffad73]/[0.07] p-6 sm:flex-row sm:items-start">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#ffad73]/25 bg-[#ffad73]/10 text-[#ffb37d]">
                <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                  <path d="M3 12s3.4-5 9-5 9 5 9 5-3.4 5-9 5-9-5-9-5Z" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-semibold text-[#ffb37d]">Important notice</h2>
                <p className="mt-2 text-sm leading-7 text-white/58 sm:text-[15px]">
                  When a voice agent is operated by one of our customers, that customer determines why
                  call information is processed and is responsible for required recording or AI notices.
                  Contact that organization first for requests about those conversations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black px-[clamp(1.25rem,5vw,4.75rem)] pt-4 pb-24 sm:pb-28">
          <div className="mx-auto max-w-[1040px] space-y-6">
            {privacySections.map((section, index) => (
              <article
                className="privacy-policy-section scroll-mt-28 rounded-lg border border-white/10 bg-[#07090d] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.26)] sm:p-8"
                id={section.id}
                key={section.id}
              >
                <div className="flex items-center gap-4">
                  <span className={`inline-flex size-11 shrink-0 items-center justify-center rounded-lg border text-xs font-bold tracking-normal ${sectionAccents[index % sectionAccents.length]}`}>
                    {section.number}
                  </span>
                  <h2 className="text-xl leading-snug font-semibold tracking-normal text-white/92 sm:text-3xl">
                    {section.title}
                  </h2>
                </div>
                <div
                  className="privacy-policy-copy mt-6 rounded-lg border border-white/[0.07] bg-white/[0.025] p-5 text-[15px] leading-7 text-white/60 sm:p-6 sm:text-base sm:leading-8"
                  style={{ borderLeftColor: ["#5eead4", "#9d8cff", "#ffad73", "#f6db75"][index % 4], borderLeftWidth: 3 }}
                >
                  {section.content}
                </div>
              </article>
            ))}

            <section className="scroll-mt-28 rounded-lg border border-[#9d8cff]/20 bg-[#0b0911] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.26)] sm:p-8" id="contact">
              <div className="flex items-center gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#9d8cff]/30 bg-[#9d8cff]/[0.08] text-xs font-bold text-[#c4b5fd]">12</span>
                <div>
                  <p className="text-xs font-bold text-[#c4b5fd] uppercase">Privacy requests</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-normal sm:text-3xl">Contact us about your information</h2>
                </div>
              </div>
              <div className="mt-6 rounded-lg border border-white/[0.07] border-l-[#9d8cff] bg-white/[0.025] p-5 sm:p-6">
                <p className="max-w-[760px] text-[15px] leading-7 text-white/60 sm:text-base sm:leading-8">
                  For privacy questions or requests, email us with enough detail to identify your
                  account or interaction. Do not include passwords, payment card details, or
                  unnecessary sensitive information.
                </p>
                <a
                  className="group mt-6 inline-flex min-h-12 items-center gap-4 rounded-lg bg-[#5eead4] px-5 text-sm font-bold text-[#03110f] transition hover:-translate-y-0.5 hover:bg-[#8ff8e9]"
                  href="mailto:hello@vozon.ai?subject=Privacy%20request"
                >
                  hello@vozon.ai
                  <span aria-hidden="true" className="text-base transition group-hover:translate-x-0.5">&rarr;</span>
                </a>
              </div>
            </section>

            <p className="px-2 pt-3 text-center text-xs leading-6 text-white/30">
              This policy is intended to explain our privacy practices clearly. It does not replace
              any data processing agreement or other contract between vozon.ai and a customer.
            </p>
          </div>
        </section>

        <style>{`
          .privacy-policy-copy strong {
            color: rgba(255, 255, 255, 0.82);
            font-weight: 600;
          }

          .privacy-policy-copy ul {
            display: grid;
            gap: 0.65rem;
            margin: 1.25rem 0;
            padding: 0;
            list-style: none;
          }

          .privacy-policy-copy li {
            position: relative;
            padding-left: 1.4rem;
          }

          .privacy-policy-copy li::before {
            position: absolute;
            top: 0.72rem;
            left: 0;
            width: 0.35rem;
            height: 0.35rem;
            border-radius: 999px;
            background: #5eead4;
            content: "";
          }

          @media (prefers-reduced-motion: reduce) {
            .privacy-policy-copy *,
            .privacy-policy-copy *::before,
            .privacy-policy-copy *::after {
              scroll-behavior: auto !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
    </SiteLayout>
  );
}
