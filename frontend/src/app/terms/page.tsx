import type { Metadata } from "next";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "Terms and Conditions | vozon.ai",
  description:
    "Terms and conditions governing the vozon.ai AI voice-agent platform, automated calls, voice services, APIs, integrations, and related services.",
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance and eligibility",
    content: (
      <>
        <p>These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of the Vozon website, dashboard, APIs, AI voice agents, calling features, integrations, and related offerings (the &ldquo;Service&rdquo;). By creating an account or using the Service, you agree to these Terms.</p>
        <p>If you act for an organization, you confirm that you can bind it to these Terms. You must be at least 18 and legally able to enter this agreement.</p>
      </>
    ),
  },
  {
    id: "service",
    title: "2. The Service",
    content: (
      <>
        <p>Vozon provides tools for operating AI voice agents, including calling, speech processing, workflows, knowledge sources, analytics, phone numbers, integrations, and automated actions. The Service may process synthetic speech, recordings, transcripts, summaries, and connected-tool actions.</p>
        <p>Features depend on your plan, configuration, region, telecommunications availability, and third-party providers. We may modify features and will provide reasonable notice when a change materially reduces paid functionality.</p>
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
          <li>You are responsible for credentials, API keys, authorized users, connected accounts, and workspace activity.</li>
          <li>You must promptly notify us at <a href="mailto:hello@vozon.ai">hello@vozon.ai</a> if you suspect unauthorized access.</li>
          <li>You may not share individual logins or bypass security, plan, rate, usage, or access restrictions.</li>
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
          <li>all prompts, knowledge, contacts, numbers, recordings, integrations, and other content you provide;</li>
          <li>testing agents, tools, routing, disclosures, escalation paths, and failure handling before launch;</li>
          <li>reviewing automated outputs and maintaining appropriate human oversight;</li>
          <li>disclosing AI use when legally required or necessary to avoid misleading callers;</li>
          <li>having a lawful basis, required notices, and consent for calls, recordings, and personal-data processing; and</li>
          <li>honouring opt-outs, do-not-call preferences, calling hours, and laws applicable to your use case and regions.</li>
        </ul>
        <p>Vozon is not professional or emergency advice. Do not use an agent as the sole decision-maker for legally significant decisions without appropriate review and safeguards.</p>
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
          <li>break laws, contracts, court orders, or another person&apos;s rights;</li>
          <li>commit fraud, impersonation, phishing, harassment, exploitation, or unlawful surveillance;</li>
          <li>place spam or unlawful automated calls, ignore consent or opt-outs, or use misleading caller identification;</li>
          <li>disregard applicable do-not-call preferences, calling hours, sender registration, or campaign rules;</li>
          <li>collect sensitive data without a supported configuration, lawful purpose, and suitable safeguards;</li>
          <li>probe, reverse engineer, overload, disrupt, or gain unauthorized access to related systems;</li>
          <li>distribute malware, resell the Service without permission, or deceptively present an AI agent as human.</li>
        </ul>
        <p>We may investigate violations and suspend activity presenting legal, security, fraud, or safety risks.</p>
      </>
    ),
  },
  {
    id: "ai",
    title: "6. AI and voice-service limitations",
    content: (
      <>
        <p>AI speech, transcripts, summaries, extracted information, and tool decisions may be inaccurate or delayed. Recognition quality varies with language, accent, noise, connectivity, and caller behaviour.</p>
        <p>Use approved knowledge, limited tool permissions, human review, and confirmation steps before consequential actions. Do not present unverified outputs as guaranteed facts.</p>
        <p>The Service is not an emergency calling service and must not be relied upon for urgent life-safety communication.</p>
      </>
    ),
  },
  {
    id: "integrations",
    title: "7. Third-party services and integrations",
    content: (
      <>
        <p>The Service may connect with carriers, AI providers, payment services, CRMs, calendars, messaging tools, webhooks, and other third parties governed by their own terms.</p>
        <p>You authorize required data exchange with connected services and remain responsible for their permissions and accounts. Vozon does not control third-party availability or data practices.</p>
      </>
    ),
  },
  {
    id: "content",
    title: "8. Customer content, recordings, and voice rights",
    content: (
      <>
        <p>You retain ownership of submitted prompts, knowledge, scripts, contacts, recordings, and authorized voice assets. You permit Vozon to process that content only to provide, secure, support, and improve the Service, comply with law, and enforce these Terms.</p>
        <p>You must hold the necessary rights for every recording, sample, voice profile, cloned voice, and contact you provide. Do not clone or deploy another person&apos;s voice without valid authorization.</p>
        <p>Synthetic voices may not be used for impersonation, false endorsement, fraud, or infringement of privacy, publicity, intellectual-property, or other rights.</p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "9. Privacy and data protection",
    content: (
      <>
        <p>Our <Link href="/privacy">Privacy Policy</Link> explains how Vozon handles information. When Vozon processes personal data for a customer, that customer remains responsible for its purpose, instructions, and lawful basis.</p>
        <p>You must provide required notices, limit collection, honour applicable rights, and configure suitable access and retention. Additional data-processing terms may apply.</p>
      </>
    ),
  },
  {
    id: "fees",
    title: "10. Fees, credits, and taxes",
    content: (
      <>
        <p>Paid features are charged under the pricing, plan, usage rates, order form, or checkout terms you accept. Metered usage may include calls, models, telephony, recordings, integrations, and platform fees.</p>
        <p>You authorize applicable charges and taxes. Unless law or an order states otherwise, consumed usage is non-refundable. We may suspend paid features for overdue amounts or insufficient credits and may change pricing prospectively.</p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "11. Vozon intellectual property",
    content: (
      <p>Vozon and its licensors own the Service, software, designs, documentation, trademarks, and related rights, excluding customer content. We grant you a limited, revocable, non-transferable right to use the Service for internal business purposes while your account is active and paid.</p>
    ),
  },
  {
    id: "suspension",
    title: "12. Suspension and termination",
    content: (
      <>
        <p>You may stop using the Service or request account closure at any time. Cancellation and remaining credits follow your plan or order.</p>
        <p>We may suspend access for non-payment, security threats, unlawful use, material breach, third-party risk, or legal requirements. When practicable, we will provide notice and a chance to cure.</p>
        <p>After termination, your access ends. Payment, ownership, disclaimers, liability, indemnity, and dispute terms survive, while data remains subject to the Privacy Policy and retention commitments.</p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "13. Disclaimers",
    content: (
      <p>To the extent permitted by law, the Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without implied warranties. Vozon does not guarantee connected calls, accurate AI outputs, uninterrupted operation, or third-party availability. Rights that cannot legally be excluded remain unaffected.</p>
    ),
  },
  {
    id: "liability",
    title: "14. Limitation of liability",
    content: (
      <>
        <p>To the extent permitted by law, neither party is liable for indirect, special, punitive, or consequential loss, including lost profits, revenue, goodwill, opportunities, or data.</p>
        <p>Vozon&apos;s aggregate liability will not exceed the amount paid for the Service during the three months before the claim arose. This does not limit liability that cannot legally be limited.</p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "15. Indemnity",
    content: (
      <p>To the extent permitted by law, you will indemnify Vozon and its personnel against third-party claims and reasonable costs arising from your content, agent configuration, calling campaigns, legal violations, rights infringement, or material breach of these Terms.</p>
    ),
  },
  {
    id: "law",
    title: "16. Governing law and disputes",
    content: (
      <>
        <p>These Terms are governed by Indian law. Courts of competent jurisdiction in India will hear disputes unless a signed order provides otherwise.</p>
        <p>Before filing a claim, each party will provide written notice and allow 30 days for good-faith resolution, except where urgent relief is reasonably necessary.</p>
      </>
    ),
  },
  {
    id: "general",
    title: "17. General terms",
    content: (
      <p>These Terms, the Privacy Policy, applicable orders, and incorporated policies form the agreement. An order controls if it conflicts with these Terms. Unenforceable provisions do not affect the remainder; non-enforcement is not a waiver; and neither party is liable for delays beyond reasonable control.</p>
    ),
  },
  {
    id: "changes",
    title: "18. Changes to these Terms",
    content: (
      <p>We may update these Terms as the Service or law changes. We will publish a new effective date and provide notice of material changes where required. Continued use after that date means you accept the revised Terms.</p>
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
      <div className="min-h-screen bg-black text-white" style={{ backgroundColor: "#000000" }}>
        <header className="border-b border-white/[0.09] bg-black px-5 pb-14 pt-32 sm:px-8 sm:pb-16 sm:pt-36 lg:px-12 lg:pt-40" style={{ backgroundColor: "#000000" }}>
          <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/34">
                <Link className="transition hover:text-[#75fff0]" href="/">Home</Link>
                <span aria-hidden="true">/</span>
                <span className="text-[#75fff0]">Legal agreement</span>
              </nav>
              <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#75fff0]">Vozon platform agreement</p>
              <h1 className="mt-4 max-w-[760px] text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
                Terms &amp; Conditions
              </h1>
              <p className="mt-6 max-w-[690px] text-base leading-8 text-white/52 sm:text-lg">
                The agreement governing access to vozon.ai and the responsible use of its AI
                voice agents, calling features, APIs, integrations, and connected services.
              </p>
            </div>

            <dl className="divide-y divide-white/[0.08] border-y border-white/[0.1] text-sm">
              <div className="flex items-center justify-between gap-6 py-4">
                <dt className="text-white/36">Document</dt>
                <dd className="font-semibold text-white/78">Terms &amp; Conditions</dd>
              </div>
              <div className="flex items-center justify-between gap-6 py-4">
                <dt className="text-white/36">Effective</dt>
                <dd className="font-semibold text-white/78">July 28, 2026</dd>
              </div>
              <div className="flex items-center justify-between gap-6 py-4">
                <dt className="text-white/36">Status</dt>
                <dd className="inline-flex items-center gap-2 font-semibold text-[#75fff0]">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_8px_#45ddce]" />
                  Current
                </dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1440px] gap-6 bg-black px-4 py-12 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:px-6 lg:py-16 xl:px-4" style={{ backgroundColor: "#000000" }}>
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="border-t border-[#45ddce]/50 pt-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75fff0]">Agreement index</p>
              <p className="mt-3 text-sm leading-6 text-white/38">Select a clause to move directly to that part of the agreement.</p>
            </div>
            <nav aria-label="Terms and Conditions sections" className="mt-6 grid max-h-[58vh] gap-1.5 overflow-y-auto pr-3">
              {sections.map((section) => (
                <a className="border-l border-white/10 py-0.5 pl-3 text-[13px] leading-5 text-white/38 transition hover:border-[#45ddce] hover:text-white/82" href={`#${section.id}`} key={section.id}>
                  {section.title}
                </a>
              ))}
            </nav>
            <div className="mt-8 border-t border-white/[0.08] pt-5">
              <p className="text-xs text-white/32">Questions about this agreement?</p>
              <a className="mt-2 inline-block text-sm font-semibold text-[#75fff0] hover:underline" href="mailto:hello@vozon.ai">
                hello@vozon.ai
              </a>
            </div>
          </aside>

          <article className="relative min-w-0 overflow-hidden rounded-xl border border-white/[0.12] bg-[#050706] shadow-[0_28px_90px_rgba(0,0,0,0.46),0_0_30px_rgba(69,221,206,0.035)]">
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#75fff0]/75 to-transparent" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[2px] bg-gradient-to-b from-[#75fff0]/85 via-[#45ddce]/20 to-transparent" />

            <header className="flex flex-col gap-6 border-b border-white/[0.1] bg-[linear-gradient(120deg,rgba(69,221,206,0.055),transparent_38%)] px-6 py-7 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:py-9">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#75fff0]">Official agreement</p>
                <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-white/88 sm:text-2xl">AI voice-agent terms</h2>
                <p className="mt-2 max-w-[560px] text-sm leading-6 text-white/38">
                  Read this document together with any applicable order form and our{" "}
                  <Link className="font-semibold text-[#75fff0] hover:underline" href="/privacy">Privacy Policy</Link>.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-white/34">
                <span className="font-mono">19 CLAUSES</span>
                <span aria-hidden="true" className="h-3 w-px bg-white/15" />
                <span className="font-mono">28 JUL 2026</span>
              </div>
            </header>

            <div className="px-6 sm:px-10">
              {sections.map((section, index) => {
                const clauseTitle = section.title.replace(/^\d+\.\s*/, "");

                return (
                  <section className="relative scroll-mt-28 border-b border-white/[0.09] py-10 last:border-b-0 sm:grid sm:grid-cols-[58px_minmax(0,1fr)] sm:gap-7 sm:py-12" id={section.id} key={section.id}>
                    <span aria-hidden="true" className="mb-5 inline-flex size-9 items-center justify-center border border-[#45ddce]/25 bg-[#45ddce]/[0.055] font-mono text-[11px] font-semibold tracking-[0.08em] text-[#75fff0] sm:mb-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white/92 sm:text-[1.75rem]">{clauseTitle}</h2>
                      <div className="mt-6 grid gap-5 text-justify text-[15px] leading-7 text-white/54 marker:text-[#45ddce] [hyphens:auto] sm:text-base sm:leading-8 [&_a]:font-semibold [&_a]:text-[#75fff0] [&_a]:underline [&_a]:decoration-[#45ddce]/40 [&_a]:underline-offset-4 [&_address]:not-italic [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-white/82 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2.5 [&_ul]:pl-5">
                        {section.content}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            <footer className="flex flex-col gap-3 border-t border-white/[0.1] bg-white/[0.018] px-6 py-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <span>End of Terms &amp; Conditions</span>
              <span className="font-mono uppercase tracking-[0.12em]">vozon.ai · Legal</span>
            </footer>
          </article>
        </div>
      </div>
    </SiteLayout>
  );
}
