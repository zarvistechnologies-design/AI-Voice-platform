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
    title: "Acceptance and eligibility",
    content: (
      <>
        <p>
          These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of
          the Vozon website, dashboard, APIs, AI voice agents, calling features,
          integrations, and related offerings (the &ldquo;Service&rdquo;). By
          creating an account or using the Service, you agree to these Terms.
        </p>

        <p>
          If you act for an organization, you confirm that you can bind it to
          these Terms. You must be at least 18 and legally able to enter this
          agreement.
        </p>
      </>
    ),
  },
  {
    id: "service",
    title: "The Service",
    content: (
      <>
        <p>
          Vozon provides tools for operating AI voice agents, including calling,
          speech processing, workflows, knowledge sources, analytics, phone
          numbers, integrations, and automated actions. The Service may process
          synthetic speech, recordings, transcripts, summaries, and
          connected-tool actions.
        </p>

        <p>
          Features depend on your plan, configuration, region,
          telecommunications availability, and third-party providers. We may
          modify features and will provide reasonable notice when a change
          materially reduces paid functionality.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Accounts and authorized users",
    content: (
      <>
        <ul>
          <li>
            You must provide accurate account information and keep it current.
          </li>

          <li>
            You are responsible for credentials, API keys, authorized users,
            connected accounts, and workspace activity.
          </li>

          <li>
            You must promptly notify us at{" "}
            <a href="mailto:hello@vozon.ai">hello@vozon.ai</a> if you suspect
            unauthorized access.
          </li>

          <li>
            You may not share individual logins or bypass security, plan, rate,
            usage, or access restrictions.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "customer-responsibilities",
    title: "Customer responsibilities",
    content: (
      <>
        <p>
          You control how your voice agents are configured and used. You are
          responsible for:
        </p>

        <ul>
          <li>
            all prompts, knowledge, contacts, numbers, recordings, integrations,
            and other content you provide;
          </li>

          <li>
            testing agents, tools, routing, disclosures, escalation paths, and
            failure handling before launch;
          </li>

          <li>
            reviewing automated outputs and maintaining appropriate human
            oversight;
          </li>

          <li>
            disclosing AI use when legally required or necessary to avoid
            misleading callers;
          </li>

          <li>
            having a lawful basis, required notices, and consent for calls,
            recordings, and personal-data processing; and
          </li>

          <li>
            honouring opt-outs, do-not-call preferences, calling hours, and laws
            applicable to your use case and regions.
          </li>
        </ul>

        <p>
          Vozon is not professional or emergency advice. Do not use an agent as
          the sole decision-maker for legally significant decisions without
          appropriate review and safeguards.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>You may not use the Service to:</p>

        <ul>
          <li>
            break laws, contracts, court orders, or another person&apos;s
            rights;
          </li>

          <li>
            commit fraud, impersonation, phishing, harassment, exploitation, or
            unlawful surveillance;
          </li>

          <li>
            place spam or unlawful automated calls, ignore consent or opt-outs,
            or use misleading caller identification;
          </li>

          <li>
            disregard applicable do-not-call preferences, calling hours, sender
            registration, or campaign rules;
          </li>

          <li>
            collect sensitive data without a supported configuration, lawful
            purpose, and suitable safeguards;
          </li>

          <li>
            probe, reverse engineer, overload, disrupt, or gain unauthorized
            access to related systems;
          </li>

          <li>
            distribute malware, resell the Service without permission, or
            deceptively present an AI agent as human.
          </li>
        </ul>

        <p>
          We may investigate violations and suspend activity presenting legal,
          security, fraud, or safety risks.
        </p>
      </>
    ),
  },
  {
    id: "ai",
    title: "AI and voice-service limitations",
    content: (
      <>
        <p>
          AI speech, transcripts, summaries, extracted information, and tool
          decisions may be inaccurate or delayed. Recognition quality varies
          with language, accent, noise, connectivity, and caller behaviour.
        </p>

        <p>
          Use approved knowledge, limited tool permissions, human review, and
          confirmation steps before consequential actions. Do not present
          unverified outputs as guaranteed facts.
        </p>

        <p>
          The Service is not an emergency calling service and must not be relied
          upon for urgent life-safety communication.
        </p>
      </>
    ),
  },
  {
    id: "integrations",
    title: "Third-party services and integrations",
    content: (
      <>
        <p>
          The Service may connect with carriers, AI providers, payment services,
          CRMs, calendars, messaging tools, webhooks, and other third parties
          governed by their own terms.
        </p>

        <p>
          You authorize required data exchange with connected services and
          remain responsible for their permissions and accounts. Vozon does not
          control third-party availability or data practices.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "Customer content, recordings, and voice rights",
    content: (
      <>
        <p>
          You retain ownership of submitted prompts, knowledge, scripts,
          contacts, recordings, and authorized voice assets. You permit Vozon to
          process that content only to provide, secure, support, and improve the
          Service, comply with law, and enforce these Terms.
        </p>

        <p>
          You must hold the necessary rights for every recording, sample, voice
          profile, cloned voice, and contact you provide. Do not clone or deploy
          another person&apos;s voice without valid authorization.
        </p>

        <p>
          Synthetic voices may not be used for impersonation, false endorsement,
          fraud, or infringement of privacy, publicity, intellectual-property,
          or other rights.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy and data protection",
    content: (
      <>
        <p>
          Our <Link href="/privacy">Privacy Policy</Link> explains how Vozon
          handles information. When Vozon processes personal data for a
          customer, that customer remains responsible for its purpose,
          instructions, and lawful basis.
        </p>

        <p>
          You must provide required notices, limit collection, honour applicable
          rights, and configure suitable access and retention. Additional
          data-processing terms may apply.
        </p>
      </>
    ),
  },
  {
    id: "fees",
    title: "Fees, credits, and taxes",
    content: (
      <>
        <p>
          Paid features are charged under the pricing, plan, usage rates, order
          form, or checkout terms you accept. Metered usage may include calls,
          models, telephony, recordings, integrations, and platform fees.
        </p>

        <p>
          You authorize applicable charges and taxes. Unless law or an order
          states otherwise, consumed usage is non-refundable. We may suspend
          paid features for overdue amounts or insufficient credits and may
          change pricing prospectively.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Vozon intellectual property",
    content: (
      <p>
        Vozon and its licensors own the Service, software, designs,
        documentation, trademarks, and related rights, excluding customer
        content. We grant you a limited, revocable, non-transferable right to
        use the Service for internal business purposes while your account is
        active and paid.
      </p>
    ),
  },
  {
    id: "suspension",
    title: "Suspension and termination",
    content: (
      <>
        <p>
          You may stop using the Service or request account closure at any time.
          Cancellation and remaining credits follow your plan or order.
        </p>

        <p>
          We may suspend access for non-payment, security threats, unlawful use,
          material breach, third-party risk, or legal requirements. When
          practicable, we will provide notice and a chance to cure.
        </p>

        <p>
          After termination, your access ends. Payment, ownership, disclaimers,
          liability, indemnity, and dispute terms survive, while data remains
          subject to the Privacy Policy and retention commitments.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    content: (
      <p>
        To the extent permitted by law, the Service is provided &ldquo;as
        is&rdquo; and &ldquo;as available&rdquo; without implied warranties.
        Vozon does not guarantee connected calls, accurate AI outputs,
        uninterrupted operation, or third-party availability. Rights that cannot
        legally be excluded remain unaffected.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <>
        <p>
          To the extent permitted by law, neither party is liable for indirect,
          special, punitive, or consequential loss, including lost profits,
          revenue, goodwill, opportunities, or data.
        </p>

        <p>
          Vozon&apos;s aggregate liability will not exceed the amount paid for
          the Service during the three months before the claim arose. This does
          not limit liability that cannot legally be limited.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    content: (
      <p>
        To the extent permitted by law, you will indemnify Vozon and its
        personnel against third-party claims and reasonable costs arising from
        your content, agent configuration, calling campaigns, legal violations,
        rights infringement, or material breach of these Terms.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    content: (
      <>
        <p>
          These Terms are governed by Indian law. Courts of competent
          jurisdiction in India will hear disputes unless a signed order
          provides otherwise.
        </p>

        <p>
          Before filing a claim, each party will provide written notice and
          allow 30 days for good-faith resolution, except where urgent relief is
          reasonably necessary.
        </p>
      </>
    ),
  },
  {
    id: "general",
    title: "General terms",
    content: (
      <p>
        These Terms, the Privacy Policy, applicable orders, and incorporated
        policies form the agreement. An order controls if it conflicts with
        these Terms. Unenforceable provisions do not affect the remainder;
        non-enforcement is not a waiver; and neither party is liable for delays
        beyond reasonable control.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these Terms",
    content: (
      <p>
        We may update these Terms as the Service or law changes. We will publish
        a new effective date and provide notice of material changes where
        required. Continued use after that date means you accept the revised
        Terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <address>
        <strong>vozon.ai</strong>
        <br />
        Email: <a href="mailto:hello@vozon.ai">hello@vozon.ai</a>
        <br />
        Website: <Link href="/">https://vozon.ai</Link>
      </address>
    ),
  },
] as const;

export default function TermsPage() {
  return (
    <SiteLayout>
      <div className="relative isolate min-h-screen overflow-hidden bg-[#FAF9FF] text-black">
        {/* =========================================================
             HERO / DOCUMENT HEADER
         ========================================================= */}
        <header className="relative z-10 px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pb-20 lg:pt-36">
          <div className="mx-auto grid w-full max-w-[1690px] gap-10 lg:grid-cols-[minmax(0,1fr)_560px] lg:items-center">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#5E6E88]"
              >
                <Link
                  href="/"
                  className="rounded-full bg-[#F0F3FF] px-4 py-2 text-[#5578E8] transition duration-200 hover:bg-[#E7ECFF]"
                >
                  Home
                </Link>

                <span
                  aria-hidden="true"
                  className="text-[16px] font-normal text-[#9AA6B9]"
                >
                  ›
                </span>

                <span className="text-[#52627D]">Legal Agreement</span>
              </nav>

              <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#5879E8]">
                Vozon Platform Agreement
              </p>

              <h1 className="mt-4 max-w-[850px] text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#101B32] sm:text-6xl md:text-7xl lg:text-[76px]">
                Terms &amp; Conditions
              </h1>

              <p className="mt-7 max-w-[760px] text-base leading-8 text-[#536987] sm:text-lg">
                The agreement governing access to vozon.ai and the responsible
                use of its AI voice agents, calling features, APIs,
                integrations, and connected services.
              </p>
            </div>

            <div className="w-full max-w-[560px] justify-self-end overflow-hidden rounded-xl border border-[#DCE1EC] bg-white/70 px-6 py-2 shadow-[0_18px_50px_rgba(77,98,160,0.08)] backdrop-blur-[12px]">
              <dl className="divide-y divide-[#E2E6EF]">
                {/* DOCUMENT */}
                <div className="flex min-h-[72px] items-center justify-between gap-5">
                  <dt className="flex items-center gap-4 text-[17px] text-[#71819C]">
                    <span
                      aria-hidden="true"
                      className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[#647FE0]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-[16px]"
                      >
                        <path
                          d="M7 3.5h7l3.5 3.5V20H7V3.5Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 3.5V7h3.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.5 11h5M9.5 14h5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    Document
                  </dt>
                  <dd className="text-right text-[16px] font-semibold text-[#17233B]">
                    Terms &amp; Conditions
                  </dd>
                </div>

                {/* EFFECTIVE */}
                <div className="flex min-h-[72px] items-center justify-between gap-5">
                  <dt className="flex items-center gap-4 text-[17px] text-[#71819C]">
                    <span
                      aria-hidden="true"
                      className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[#5879E8]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-[16px]"
                      >
                        <rect
                          x="5"
                          y="5"
                          width="14"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M8 3.5v3M16 3.5v3M8 9.5h8"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <path d="M9 13h2v2H9z" fill="currentColor" />
                      </svg>
                    </span>
                    Effective
                  </dt>
                  <dd className="text-right text-[16px] font-semibold text-[#17233B]">
                    July 28, 2026
                  </dd>
                </div>

                {/* STATUS */}
                <div className="flex min-h-[72px] items-center justify-between gap-5">
                  <dt className="flex items-center gap-4 text-[17px] text-[#71819C]">
                    <span
                      aria-hidden="true"
                      className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[#5379FF]"
                    >
                      <span className="size-3 rounded-full bg-current" />
                    </span>
                    Status
                  </dt>

                  <dd className="text-right text-[16px] font-semibold text-[#17233B]">
                    Current
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        {/* =========================================================
            CONTENT AREA
        ========================================================== */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:px-6 lg:py-16 xl:px-4">
          {/* =======================================================
              SIDEBAR (Glassmorphic Accent)
          ======================================================== */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="overflow-hidden rounded-xl border border-[#DCE1EC] bg-white/70 shadow-[0_4px_18px_rgba(80,100,160,0.04)] backdrop-blur-[12px]">
              {/* TABLE OF CONTENTS */}
              <div className="px-3.5 pb-4 pt-3.5 sm:px-4">
                <p className="text-[9px] font-bold leading-4 uppercase text-[#26344D]">
                  Agreement index
                </p>
                <p className="text-[9px] font-semibold leading-4 text-[#26344D]">
                  Select a clause to move directly to that part of the agreement
                </p>

                <nav
                  aria-label="Terms and Conditions sections"
                  className="mt-3"
                >
                  <div className="grid gap-0.5">
                    {sections.map((section, index) => (
                      <a
                        href={`#${section.id}`}
                        key={section.id}
                        className="group relative flex min-h-[25px] items-center gap-2 px-1.5 py-1 text-[12px] leading-4 text-[#697892] transition-colors duration-200 hover:text-[#17233B]"
                      >
                        {/* BLUE ACTIVE SIDE LINE */}
                        {index === 0 && (
                          <span className="absolute -left-[16px] top-1/2 h-[14px] w-[2px] -translate-y-1/2 rounded-r-full bg-[#617FEF]" />
                        )}

                        {/* NUMBER */}
                        <span
                          className={`flex size-[15px] shrink-0 items-center justify-center rounded-full text-[7px] font-bold ${
                            index === 0
                              ? "bg-[#101B32] text-white"
                              : "bg-transparent text-[#77849A]"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* TITLE */}
                        <span
                          className={`${index === 0 ? "font-medium text-[#26344D]" : ""}`}
                        >
                          {section.title}
                        </span>
                      </a>
                    ))}
                  </div>
                </nav>
              </div>

              {/* DIVIDER */}
              <div className="mx-3.5 border-t border-[#EEF0F6]" />

              {/* QUESTIONS */}
              <div className="px-3.5 pb-3.5 pt-4 sm:px-4">
                <div className="flex size-[22px] items-center justify-center rounded-full bg-[#F0F3FF] text-[#5C7BEA]">
                  <svg viewBox="0 0 24 24" fill="none" className="size-[11px]">
                    <path
                      d="M12 5.5a6.5 6.5 0 0 0-6.5 6.5c0 1.6.58 3.07 1.54 4.2L6 19l3.1-.8c.88.5 1.86.8 2.9.8a6.5 6.5 0 1 0 0-13.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.7 10.3a2.35 2.35 0 1 1 4.25 1.4c-.57.76-1.55 1.05-1.55 1.9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="12.4" cy="15.9" r=".7" fill="currentColor" />
                  </svg>
                </div>

                <p className="text-xs text-black">
                  Questions about this agreement?
                </p>

                <a
                  className="mt-2 inline-block text-sm font-semibold text-black underline underline-offset-4 transition hover:opacity-60"
                  href="mailto:hello@vozon.ai"
                >
                  hello@vozon.ai
                </a>
              </div>
            </div>
          </aside>

          {/* =======================================================
              MAIN AGREEMENT CARD (Glassmorphic Container)
          ======================================================== */}
          <article className="relative min-w-0 overflow-hidden rounded-2xl border border-[#DCE1EC] bg-white/70 shadow-[0_18px_50px_rgba(77,98,160,0.06)] backdrop-blur-[12px]">
            {/* DOCUMENT HEADER */}
            <header className="flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:py-9">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4F68C4]">
                  Official agreement
                </p>

                <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-[#17233B] sm:text-2xl">
                  AI voice-agent terms
                </h2>

                <p className="mt-2 max-w-[560px] text-sm leading-6 text-[#526482]">
                  Read this document together with any applicable order form and
                  our{" "}
                  <Link
                    className="font-semibold text-black underline underline-offset-4 transition hover:opacity-60"
                    href="/privacy"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 text-xs text-[#526482]">
                <span className="font-mono">19 CLAUSES</span>

                <span aria-hidden="true" className="h-3 w-px bg-[#D5D5D5]" />

                <span className="font-mono">28 JUL 2026</span>
              </div>
            </header>

            {/* =====================================================
                CLAUSES
            ====================================================== */}
            <div className="px-6 sm:px-10">
              {sections.map((section, index) => {
                const clauseTitle = section.title.replace(/^\d+\.\s*/, "");

                return (
                  <section
                    className="scroll-mt-28 border-b border-[#EEF0F4] py-10 last:border-b-0 sm:grid sm:grid-cols-[42px_minmax(0,1fr)] sm:gap-7 sm:py-11 lg:grid-cols-[42px_minmax(0,820px)] lg:gap-7"
                    id={section.id}
                    key={section.id}
                  >
                    <span
                      aria-hidden="true"
                      className="mb-4 inline-flex size-8 items-center justify-center rounded-lg bg-[#EEF2FF] font-mono text-[10px] font-semibold tracking-[0.04em] text-[#4165D6] sm:mb-0"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0">
                      <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.025em] text-[#17233B] sm:text-2xl">
                        {clauseTitle}
                      </h2>

                      <div className="terms-copy mt-4 grid gap-3 text-[14px] leading-[1.75] text-[#536580] sm:mt-5 sm:text-sm sm:leading-7">
                        {section.content}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* =====================================================
                FOOTER
            ====================================================== */}
            <footer className="flex flex-col gap-3 border-t border-[#EEF0F4] bg-white/50 px-6 py-6 text-xs text-[#526482] sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <span>End of Terms &amp; Conditions</span>

              <span className="font-mono uppercase tracking-[0.12em]">
                vozon.ai · Legal
              </span>
            </footer>
          </article>
        </div>

        {/* =========================================================
            LOCAL STYLES
        ========================================================== */}
        <style>{`
          .terms-copy p + p {
            margin-top: 1.25rem;
          }

          .terms-copy strong {
            color: #101B32;
            font-weight: 700;
          }

          .terms-copy ul {
            display: grid;
            gap: 0.65rem;
            margin: 1.25rem 0;
            padding-left: 1.35rem;
            list-style-type: disc;
          }

          .terms-copy li {
            padding-left: 0.25rem;
          }

          .terms-copy a {
            color: #4165D6;
            font-weight: 600;
            text-decoration: underline;
            text-decoration-color: #A5B4FC;
            text-underline-offset: 4px;
            transition: all 0.2s ease;
          }

          .terms-copy a:hover {
            opacity: 0.8;
            text-decoration-color: #4165D6;
          }

          .terms-copy address {
            color: #101B32;
            font-style: normal;
            line-height: 2;
          }

          @media (prefers-reduced-motion: reduce) {
            .terms-copy *,
            .terms-copy *::before,
            .terms-copy *::after {
              scroll-behavior: auto !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
    </SiteLayout>
  );
}
