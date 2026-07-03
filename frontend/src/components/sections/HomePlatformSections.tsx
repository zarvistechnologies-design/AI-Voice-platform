const proofStats = [
  ["1M+", "monthly calls ready"],
  ["99.9%", "target uptime"],
  ["80%", "routine call automation"],
  ["0", "missed after-hours leads"],
];

const workflowSteps = [
  {
    title: "Build",
    body: "Create phone agents from prompts, call scripts, knowledge files, business rules, and escalation policies.",
    detail: "Agent studio",
  },
  {
    title: "Test",
    body: "Run simulated calls for edge cases, compliance language, transfer rules, and customer objections.",
    detail: "Call QA",
  },
  {
    title: "Launch",
    body: "Connect numbers, campaigns, CRMs, calendars, helpdesks, and webhooks without rebuilding your stack.",
    detail: "Telephony",
  },
  {
    title: "Learn",
    body: "Monitor outcomes, transcripts, summaries, sentiment, costs, and next actions from every conversation.",
    detail: "Analytics",
  },
];

const useCases = [
  ["Home services", "Book repair visits, dispatch urgent jobs, and answer calls after business hours."],
  ["Healthcare", "Collect intake details, remind patients, and route urgent concerns to the right team."],
  ["Insurance", "Qualify claims, renewal questions, policy updates, and callback requests with guardrails."],
  ["Financial services", "Verify intent, schedule consultations, and hand off sensitive workflows safely."],
  ["Retail and D2C", "Answer order questions, returns, product guidance, and high-volume seasonal calls."],
  ["Logistics", "Automate delivery updates, exception calls, driver hiring, and customer status checks."],
  ["Real estate", "Qualify buyers, book property viewings, and follow up on missed inbound enquiries."],
  ["Debt collection", "Run compliant reminder calls, capture promises to pay, and escalate exceptions."],
];

const integrationNames = [
  "Twilio",
  "Vobiz",
  "HubSpot",
  "Salesforce",
  "Google Calendar",
  "Freshdesk",
  "Slack",
  "Zapier",
  "Make",
  "n8n",
  "Webhooks",
  "REST API",
];

const securityItems = [
  ["Role controls", "Give teams the right access for agents, numbers, campaigns, billing, and analytics."],
  ["Human handoff", "Escalate risky, urgent, or high-value calls with transcript and caller context attached."],
  ["Consent flows", "Add opening disclosures, DNC rules, voicemail behavior, retries, and campaign limits."],
  ["Audit trail", "Review call recordings, summaries, tool actions, routing decisions, and worker errors."],
];

const pricingPlans = [
  {
    name: "Launch",
    price: "Start free",
    body: "For teams building their first production-ready phone agent.",
    features: ["Agent builder", "Inbound and outbound test calls", "Call transcripts", "Basic analytics"],
    cta: "Try for free",
    href: "/dashboard",
  },
  {
    name: "Scale",
    price: "Usage based",
    body: "For growing teams automating support, lead qualification, and bookings.",
    features: ["Campaign calling", "CRM and calendar workflows", "Concurrent calling", "Post-call analysis"],
    cta: "Contact sales",
    href: "#contact",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    body: "For regulated, high-volume teams with strict reliability and governance needs.",
    features: ["Dedicated rollout support", "Advanced security review", "Custom integrations", "Priority capacity"],
    cta: "Plan rollout",
    href: "#contact",
  },
];

const faqs = [
  ["Can agents handle inbound and outbound calls?", "Yes. You can run inbound reception flows, outbound follow-ups, bulk campaigns, scheduled calls, and human transfers from the same workspace."],
  ["Can we keep our existing phone number?", "Yes. Connect imported numbers, purchased numbers, or provider-backed trunks depending on the telephony setup your team uses."],
  ["Does the platform support Indian languages?", "Yes. Agents can be configured for English, Hindi, Hinglish, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Punjabi, Malayalam, and more."],
  ["What happens when the AI should not answer?", "You can define guardrails, disallowed topics, fallback messages, transfer rules, and review workflows for sensitive calls."],
];

function SectionIntro({
  eyebrow,
  title,
  body,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  inverse?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className={`m-0 text-sm font-extrabold ${inverse ? "text-cyan-200" : "text-cyan-700"}`}>{eyebrow}</p>
      <h2 className={`m-0 mt-4 text-4xl font-semibold leading-tight sm:text-5xl ${inverse ? "text-white" : "text-slate-950"}`}>
        {title}
      </h2>
      <p className={`m-0 mt-5 text-base leading-7 sm:text-lg ${inverse ? "text-slate-300" : "text-slate-600"}`}>
        {body}
      </p>
    </div>
  );
}

function ProofStrip() {
  return (
    <section className="bg-[#111827] px-4 pb-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
        {proofStats.map(([value, label]) => (
          <div className="border-b border-white/10 p-6 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0" key={label}>
            <strong className="block text-4xl font-semibold text-white">{value}</strong>
            <span className="mt-2 block text-sm font-semibold text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section className="bg-[#f7fafc] px-4 py-20 text-slate-950 sm:px-6 lg:px-8" id="platform">
      <SectionIntro
        eyebrow="Voice agent lifecycle"
        title="Build, test, launch, and improve every call flow."
        body="A production voice agent is more than a prompt. It needs telephony, testing, workflow actions, monitoring, and guardrails in one operating surface."
      />

      <div className="mx-auto mt-12 grid max-w-[1240px] gap-4 lg:grid-cols-4">
        {workflowSteps.map((step, index) => (
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" key={step.title}>
            <span className="grid size-11 place-items-center rounded-lg bg-[#111827] text-sm font-extrabold text-cyan-200">
              0{index + 1}
            </span>
            <p className="m-0 mt-6 text-xs font-extrabold text-cyan-700">{step.detail}</p>
            <h3 className="m-0 mt-2 text-2xl font-semibold text-slate-950">{step.title}</h3>
            <p className="m-0 mt-4 text-sm leading-6 text-slate-600">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function OperationsVisual() {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0b1120] p-4 shadow-[0_26px_90px_rgba(0,0,0,0.28)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="m-0 text-sm font-semibold text-white">Campaign operations</p>
          <p className="m-0 mt-1 text-xs text-slate-400">Live queue, pacing, outcomes, and handoffs</p>
        </div>
        <span className="rounded-lg bg-emerald-300 px-3 py-1.5 text-xs font-extrabold text-slate-950">Running</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["12,480", "contacts loaded"],
          ["84%", "valid leads"],
          ["34", "calls active"],
        ].map(([value, label]) => (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={label}>
            <strong className="block text-2xl font-semibold text-white">{value}</strong>
            <span className="mt-1 block text-xs text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
        {[
          ["Lead qualification", "1,240/2,000", "62%", "CRM synced"],
          ["Appointment booking", "780/920", "85%", "Calendar updated"],
          ["Payment reminders", "430/1,100", "39%", "Retry window"],
          ["Support overflow", "2,760/3,000", "92%", "Handoff ready"],
        ].map(([name, volume, progress, action]) => (
          <div className="grid gap-3 border-b border-white/10 bg-white/[0.03] p-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_110px_1fr_120px] sm:items-center" key={name}>
            <strong className="text-sm font-semibold text-white">{name}</strong>
            <span className="text-xs text-slate-400">{volume}</span>
            <span className="h-2 rounded-full bg-white/10">
              <span className="block h-full rounded-full bg-cyan-300" style={{ width: progress }} />
            </span>
            <span className="text-xs font-semibold text-cyan-200">{action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OperationsSection() {
  return (
    <section className="bg-[#111827] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <p className="m-0 text-sm font-extrabold text-cyan-200">One workspace</p>
          <h2 className="m-0 mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            Operate agents, numbers, campaigns, and call records together.
          </h2>
          <p className="m-0 mt-6 text-lg leading-8 text-slate-300">
            Give sales, support, and operations teams a shared console for live calls, agent readiness, call recordings, cost visibility, and automated follow-up.
          </p>
          <div className="mt-8 grid gap-3">
            {["Realtime call monitoring", "Bulk campaign controls", "Post-call summaries", "Human handoff with context"].map((item) => (
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-200" key={item}>
                <span className="size-2 rounded-full bg-cyan-300" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <OperationsVisual />
      </div>
    </section>
  );
}

function UseCaseSection() {
  return (
    <section className="bg-white px-4 py-20 text-slate-950 sm:px-6 lg:px-8" id="business">
      <SectionIntro
        eyebrow="For business teams"
        title="Launch agents for the calls that decide revenue and trust."
        body="The platform is built around real phone workflows: booking, qualification, support, reminders, dispatch, intake, collections, and follow-up."
      />

      <div className="mx-auto mt-12 grid max-w-[1240px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {useCases.map(([title, body], index) => (
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-5" key={title}>
            <span className={`grid size-10 place-items-center rounded-lg text-sm font-extrabold ${
              index % 4 === 0
                ? "bg-cyan-100 text-cyan-800"
                : index % 4 === 1
                  ? "bg-sky-100 text-sky-800"
                  : index % 4 === 2
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
            }`}>
              {title.slice(0, 2)}
            </span>
            <h3 className="m-0 mt-5 text-xl font-semibold text-slate-950">{title}</h3>
            <p className="m-0 mt-3 text-sm leading-6 text-slate-600">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function IntegrationSection() {
  return (
    <section className="bg-[#eef7f8] px-4 py-20 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div>
          <p className="m-0 text-sm font-extrabold text-cyan-800">Integrations</p>
          <h2 className="m-0 mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            Connect calls to the tools already running your business.
          </h2>
          <p className="m-0 mt-6 text-lg leading-8 text-slate-600">
            Voice agents can read context, trigger workflows, update records, book calendar slots, send alerts, and keep humans in the loop.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {integrationNames.map((name) => (
            <div className="rounded-lg border border-cyan-100 bg-white p-4 shadow-sm" key={name}>
              <span className="grid size-10 place-items-center rounded-lg bg-[#111827] text-xs font-extrabold text-cyan-200">
                {name.slice(0, 2)}
              </span>
              <strong className="mt-4 block text-sm font-semibold text-slate-950">{name}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LanguageSection() {
  return (
    <section className="bg-white px-4 py-20 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-10 rounded-lg border border-slate-200 bg-[#111827] p-6 text-white sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
        <div>
          <p className="m-0 text-sm font-extrabold text-cyan-200">Multilingual voice AI</p>
          <h2 className="m-0 mt-4 text-4xl font-semibold leading-tight">
            Speak to customers in the language they naturally use.
          </h2>
          <p className="m-0 mt-6 text-base leading-7 text-slate-300">
            Configure agents for English, Hindi, Hinglish, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Punjabi, Malayalam, and global customer conversations.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {["English", "Hindi", "Hinglish", "Tamil", "Telugu", "Kannada", "Marathi", "Bengali"].map((language) => (
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4" key={language}>
              <span className="text-sm font-semibold text-cyan-200">{language}</span>
              <p className="m-0 mt-2 text-xs leading-5 text-slate-400">Support, sales, reminders, and booking flows.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  return (
    <section className="bg-[#111827] px-4 py-20 text-white sm:px-6 lg:px-8">
      <SectionIntro
        eyebrow="Governance"
        title="Production guardrails for real phone operations."
        body="Deploy with controls for roles, compliance language, DNC suppression, retries, human escalation, and reviewable call evidence."
        inverse
      />

      <div className="mx-auto mt-12 grid max-w-[1240px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {securityItems.map(([title, body]) => (
          <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5" key={title}>
            <span className="block h-1 w-12 rounded-full bg-cyan-300" />
            <h3 className="m-0 mt-5 text-xl font-semibold text-white">{title}</h3>
            <p className="m-0 mt-3 text-sm leading-6 text-slate-400">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="bg-[#f7fafc] px-4 py-20 text-slate-950 sm:px-6 lg:px-8" id="pricing">
      <SectionIntro
        eyebrow="Pricing"
        title="Start with one agent. Scale to every call line."
        body="Use the platform for real call workflows, then grow volume, campaigns, integrations, and governance as your team expands."
      />

      <div className="mx-auto mt-12 grid max-w-[1120px] gap-4 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <article
            className={`rounded-lg border p-6 shadow-sm ${
              plan.featured
                ? "border-cyan-300 bg-[#111827] text-white"
                : "border-slate-200 bg-white text-slate-950"
            }`}
            key={plan.name}
          >
            <p className={`m-0 text-sm font-extrabold ${plan.featured ? "text-cyan-200" : "text-cyan-700"}`}>{plan.name}</p>
            <strong className="mt-4 block text-4xl font-semibold">{plan.price}</strong>
            <p className={`m-0 mt-4 min-h-16 text-sm leading-6 ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>{plan.body}</p>
            <div className="mt-6 grid gap-3">
              {plan.features.map((feature) => (
                <span className="flex items-center gap-3 text-sm font-semibold" key={feature}>
                  <span className={`size-2 rounded-full ${plan.featured ? "bg-cyan-300" : "bg-cyan-600"}`} />
                  {feature}
                </span>
              ))}
            </div>
            <a
              className={`mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-lg px-5 text-sm font-extrabold ${
                plan.featured
                  ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                  : "border border-slate-200 bg-white text-slate-950 hover:border-cyan-300"
              }`}
              href={plan.href}
            >
              {plan.cta}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="bg-white px-4 py-20 text-slate-950 sm:px-6 lg:px-8">
      <SectionIntro
        eyebrow="Questions"
        title="What teams ask before they go live."
        body="A fast pilot should still answer the important operational questions: numbers, language, handoff, safety, and business fit."
      />

      <div className="mx-auto mt-12 grid max-w-[980px] gap-3">
        {faqs.map(([question, answer]) => (
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-5" key={question}>
            <h3 className="m-0 text-lg font-semibold text-slate-950">{question}</h3>
            <p className="m-0 mt-3 text-sm leading-6 text-slate-600">{answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-[#111827] px-4 py-20 text-white sm:px-6 lg:px-8" id="contact">
      <div className="mx-auto max-w-[1120px] rounded-lg border border-cyan-300/20 bg-[#08b8c8] p-8 text-center text-slate-950 shadow-[0_26px_90px_rgba(8,184,200,0.22)] sm:p-12">
        <p className="m-0 text-sm font-extrabold">Ready for production voice agents?</p>
        <h2 className="m-0 mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          Launch a phone agent that answers, acts, and improves with every call.
        </h2>
        <p className="m-0 mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-800">
          Talk with us about your call volume, use cases, numbers, integrations, and rollout plan.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#111827] px-7 text-sm font-extrabold text-white" href="/dashboard">
            Try for free
          </a>
          <a className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-900/20 bg-white px-7 text-sm font-extrabold text-slate-950" href="mailto:hello@aivoiceplatform.com">
            Contact sales
          </a>
        </div>
      </div>
    </section>
  );
}

export function HomePlatformSections() {
  return (
    <>
      <ProofStrip />
      <WorkflowSection />
      <OperationsSection />
      <UseCaseSection />
      <IntegrationSection />
      <LanguageSection />
      <SecuritySection />
      <PricingSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
