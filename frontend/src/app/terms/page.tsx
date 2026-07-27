import type { Metadata } from "next";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "Terms of Service | vozon.ai",
  description:
    "Terms governing access to and use of the vozon.ai AI voice-agent platform, APIs, integrations, and related services.",
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance and eligibility",
    content: (
      <>
        <p>These Terms of Service (&ldquo;Terms&rdquo;) govern access to and use of the Vozon website, dashboard, APIs, voice-agent services, integrations, and related offerings (collectively, the &ldquo;Service&rdquo;). By creating an account, accepting an order, or using the Service, you agree to these Terms.</p>
        <p>If you use the Service for an organization, you represent that you have authority to bind that organization, and &ldquo;you&rdquo; includes the organization. You must be at least 18 years old and legally capable of entering into a binding agreement.</p>
      </>
    ),
  },
  {
    id: "service",
    title: "2. The Service",
    content: (
      <>
        <p>Vozon provides tools for configuring and operating AI voice agents, including inbound and outbound calling, speech processing, workflows, knowledge sources, analytics, phone-number management, integrations, and automated actions.</p>
        <p>Features may depend on third-party providers, supported countries, telecommunications availability, account plan, and technical configuration. We may improve, modify, or discontinue features. Where a change materially reduces paid functionality, we will provide reasonable notice when practicable.</p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "3. Accounts and authorized users",
    content: (
      <>
        <ul>
          <li>You must provide accurate account information and keep it current.</li>
          <li>You are responsible for account credentials, API keys, connected accounts, authorized users, roles, and all activity under your workspace.</li>
          <li>You must promptly notify us at <a href="mailto:hello@vozon.ai">hello@vozon.ai</a> if you suspect unauthorized access.</li>
          <li>You may not share individual login credentials or bypass plan, security, rate, usage, or access restrictions.</li>
        </ul>
      </>
    ),
  },
  {
    id: "customer-responsibilities",
    title: "4. Customer responsibilities",
    content: (
      <>
        <p>You control how your voice agents are configured and used. You are responsible for:</p>
        <ul>
          <li>prompts, knowledge, contact lists, phone numbers, recordings, integrations, tools, messages, and other content supplied to the Service;</li>
          <li>testing agents, tools, routing, disclosures, escalation paths, and failure handling before production use;</li>
          <li>reviewing automated outputs and maintaining appropriate human oversight;</li>
          <li>ensuring that you have a lawful basis to collect, use, record, transcribe, analyse, and share personal information;</li>
          <li>providing legally required notices and obtaining legally required consents, including call-recording and automated-communication consent;</li>
          <li>honouring opt-outs, do-not-call requests, suppression lists, calling-hour restrictions, and applicable consumer-protection requirements; and</li>
          <li>complying with telecommunications, privacy, employment, healthcare, financial-services, marketing, and other laws applicable to your use case and operating regions.</li>
        </ul>
        <p>Vozon is not a substitute for legal, medical, financial, emergency, or other licensed professional advice. You must not deploy an agent as the sole decision-maker for decisions producing legal or similarly significant effects on an individual without appropriate review and lawful safeguards.</p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "5. Acceptable use",
    content: (
      <>
        <p>You may not use the Service to:</p>
        <ul>
          <li>violate law, regulation, court order, contractual obligation, or another person&apos;s rights;</li>
          <li>conduct fraud, impersonation, phishing, deceptive caller identification, harassment, threats, hate, exploitation, or unlawful surveillance;</li>
          <li>place spam calls or unlawful robocalls, contact people without required permission, or evade consent and opt-out requirements;</li>
          <li>collect authentication credentials, payment-card data, government identifiers, health information, or other sensitive data unless your plan and configuration expressly support it and you have implemented lawful safeguards;</li>
          <li>interfere with, probe, reverse engineer, overload, disrupt, or gain unauthorized access to the Service or related systems;</li>
          <li>introduce malware or use the Service to develop or distribute harmful code;</li>
          <li>resell, sublicense, or provide the Service as a bureau service except under an agreement that permits it; or</li>
          <li>misrepresent an AI agent as a human where disclosure is required by law or reasonably necessary to avoid deception.</li>
        </ul>
        <p>We may investigate suspected violations and suspend activity that presents a security, legal, fraud, or safety risk.</p>
      </>
    ),
  },
  {
    id: "ai",
    title: "6. AI and voice-service limitations",
    content: (
      <>
        <p>AI-generated speech, transcripts, summaries, classifications, extracted information, and tool decisions may be inaccurate, incomplete, delayed, or inappropriate. Speech recognition may be affected by language, accent, noise, connectivity, and caller behaviour.</p>
        <p>You must evaluate outputs for your use case, provide clear instructions and approved knowledge, restrict tool permissions, and use human review where errors could cause harm. You should not represent outputs as guaranteed facts without independent verification.</p>
        <p>The Service is not an emergency calling service and must not be used to contact emergency services or relied upon for urgent life-safety communication.</p>
      </>
    ),
  },
  {
    id: "integrations",
    title: "7. Third-party services and integrations",
    content: (
      <>
        <p>The Service may connect with telephony carriers, AI and speech providers, payment processors, Google services, customer relationship systems, calendars, messaging services, webhooks, and other third-party products. Your use of those products may be governed by separate terms and privacy policies.</p>
        <p>You authorize Vozon to access and exchange data with connected services as required to perform your configured actions. You are responsible for connection permissions and third-party accounts. We do not control and are not responsible for third-party availability, changes, actions, or data practices.</p>
      </>
    ),
  },
  {
    id: "content",
    title: "8. Customer content and permissions",
    content: (
      <>
        <p>You retain ownership of content you submit to the Service. You grant Vozon a limited, non-exclusive right to host, copy, transmit, process, display, and otherwise use that content only as necessary to provide, secure, support, and improve the Service, comply with law, and enforce these Terms.</p>
        <p>You represent that you have the rights and permissions necessary for the content and instructions you provide. You must not upload content that infringes intellectual-property, privacy, publicity, confidentiality, or other rights.</p>
        <p>Feedback and suggestions may be used by Vozon without restriction or obligation, provided we do not publicly identify you as the source without permission.</p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "9. Privacy and data protection",
    content: (
      <>
        <p>Our <Link href="/privacy">Privacy Policy</Link> describes how Vozon collects, uses, stores, shares, and protects information. Where Vozon processes personal data on behalf of a business customer, the customer determines the purposes and means of that processing and remains responsible for its instructions and lawful basis.</p>
        <p>You must not instruct Vozon to process personal information in violation of applicable law. Additional data-processing terms may apply under an order form or separate agreement.</p>
      </>
    ),
  },
  {
    id: "fees",
    title: "10. Fees, credits, and taxes",
    content: (
      <>
        <p>Paid features are charged according to the pricing, plan, usage rates, order form, or checkout information presented when you purchase them. Usage may include call time, model usage, telephony, recordings, integrations, platform fees, and other metered services.</p>
        <p>You authorize applicable charges and are responsible for taxes other than taxes based on Vozon&apos;s net income. Unless required by law or stated in an applicable order, purchases and consumed usage are non-refundable. We may suspend paid functionality if amounts are overdue or available credits are insufficient.</p>
        <p>We may update pricing prospectively. Changes will not retroactively alter charges already incurred.</p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "11. Vozon intellectual property",
    content: (
      <p>Vozon and its licensors own the Service, software, interfaces, designs, documentation, trademarks, and related intellectual property, excluding customer content. Subject to these Terms and payment of applicable fees, we grant you a limited, revocable, non-exclusive, non-transferable right to use the Service for your internal business purposes during the subscription or account term.</p>
    ),
  },
  {
    id: "suspension",
    title: "12. Suspension and termination",
    content: (
      <>
        <p>You may stop using the Service at any time and may request account closure. Subscription cancellation and remaining credits are handled according to the applicable plan or order.</p>
        <p>We may suspend or restrict access when reasonably necessary to address non-payment, security threats, unlawful activity, acceptable-use violations, material breach, risk to third parties, or legal requirements. Where practicable, we will provide notice and an opportunity to cure.</p>
        <p>Upon termination, your right to use the Service ends. Provisions that by their nature should survive—including payment obligations, intellectual property, disclaimers, limitations, indemnity, and dispute provisions—will survive. Data is handled according to the Privacy Policy and applicable contractual retention commitments.</p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "13. Disclaimers",
    content: (
      <p>To the maximum extent permitted by law, the Service is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; Vozon disclaims implied warranties of merchantability, fitness for a particular purpose, non-infringement, and uninterrupted or error-free operation. We do not warrant that calls will always connect, that AI outputs will be accurate, or that third-party services will remain available. Nothing in these Terms excludes warranties or rights that cannot lawfully be excluded.</p>
    ),
  },
  {
    id: "liability",
    title: "14. Limitation of liability",
    content: (
      <>
        <p>To the maximum extent permitted by law, neither party will be liable for indirect, incidental, special, exemplary, punitive, or consequential damages, or for lost profits, revenue, goodwill, business opportunities, or data, arising from these Terms or the Service, even if advised of the possibility.</p>
        <p>To the maximum extent permitted by law, Vozon&apos;s total aggregate liability arising from these Terms or the Service will not exceed the amount you paid to Vozon for the Service during the three months immediately preceding the event giving rise to the claim. These limitations do not apply where liability cannot be limited under applicable law.</p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "15. Indemnity",
    content: (
      <p>To the extent permitted by law, you will defend and indemnify Vozon and its personnel against third-party claims, damages, penalties, and reasonable costs arising from your customer content, agent configuration, calling campaigns, violation of law, infringement of third-party rights, or material breach of these Terms.</p>
    ),
  },
  {
    id: "law",
    title: "16. Governing law and disputes",
    content: (
      <>
        <p>These Terms are governed by the laws of India, without regard to conflict-of-law principles. Courts of competent jurisdiction in India will have jurisdiction over disputes, subject to any different dispute-resolution terms in an applicable signed order or agreement.</p>
        <p>Before filing a claim, each party agrees to make a good-faith effort to resolve the dispute by providing written notice and allowing at least 30 days for discussion, unless urgent injunctive relief is reasonably necessary.</p>
      </>
    ),
  },
  {
    id: "general",
    title: "17. General terms",
    content: (
      <p>These Terms, the Privacy Policy, applicable order forms, and any incorporated policies form the agreement between you and Vozon concerning the Service. If an order form conflicts with these Terms, the order form controls for that order. You may not assign the agreement without our written consent, except in connection with a permitted reorganization or sale of substantially all relevant assets. If a provision is unenforceable, the remaining provisions remain effective. Failure to enforce a provision is not a waiver. Neither party is liable for delay caused by events beyond its reasonable control.</p>
    ),
  },
  {
    id: "changes",
    title: "18. Changes to these Terms",
    content: (
      <p>We may update these Terms as the Service or law changes. We will publish the revised Terms and update the effective date. If a change materially affects your rights, we will provide reasonable notice where required. Continued use after the effective date constitutes acceptance of the revised Terms.</p>
    ),
  },
  {
    id: "contact",
    title: "19. Contact",
    content: (
      <address>
        <strong>vozon.ai</strong><br />
        Email: <a href="mailto:hello@vozon.ai">hello@vozon.ai</a><br />
        Website: <Link href="/">https://vozon.ai</Link>
      </address>
    ),
  },
] as const;

export default function TermsPage() {
  return (
    <SiteLayout>
      <div className="bg-[#f7faf9] text-[#10201c]">
        <header className="border-b border-[#d9e6e2] bg-[#061410] px-5 pb-16 pt-36 text-white sm:px-8 sm:pt-40 lg:px-12">
          <div className="mx-auto max-w-[1080px]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">Legal</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">Terms of Service</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/60">
              These Terms explain the rules and responsibilities that apply when a business uses the vozon.ai voice-agent platform and connected services.
            </p>
            <p className="mt-7 text-sm font-medium text-white/45">Effective date: July 28, 2026</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1080px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-0 lg:py-20">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0a8f80]">On this page</p>
            <nav aria-label="Terms of Service sections" className="mt-4 grid gap-2">
              {sections.map((section) => (
                <a className="text-sm text-[#526660] transition hover:text-[#087e71]" href={`#${section.id}`} key={section.id}>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="min-w-0 rounded-3xl border border-[#d9e6e2] bg-white px-6 py-4 shadow-[0_22px_70px_rgba(11,44,36,0.07)] sm:px-10">
            {sections.map((section) => (
              <section className="scroll-mt-28 border-b border-[#e2ece9] py-9 last:border-b-0" id={section.id} key={section.id}>
                <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#10201c]">{section.title}</h2>
                <div className="mt-5 grid gap-4 text-[15px] leading-7 text-[#526660] [&_a]:font-semibold [&_a]:text-[#087e71] [&_a]:underline [&_a]:underline-offset-4 [&_address]:not-italic [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-[#203c34] [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5">
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
