import Image from "next/image";
import { IndianLanguageVoiceSection } from "./IndianLanguageVoiceSection";

const agentUseCases = [
  "Lead Qualification Calls",
  "AI Receptionist",
  "Appointment Booking",
  "Inbound Support",
  "Outbound Follow-ups",
  "Call Summaries",
  "Sentiment Detection",
  "CRM Updates",
  "Dispatch Routing",
  "Payment Reminders",
  "Patient Intake",
  "Sales Handoffs",
];

const platformCards = [
  {
    title: "Orchestrate voice workflows from one workspace",
    body: "Turn every call into a structured workflow with transcripts, summaries, intent, routing, and follow-up actions.",
    large: true,
  },
  {
    title: "Blend AI agents with human handoffs",
    body: "Let agents handle routine conversations 24/7 while escalating sensitive or high-value calls with full context.",
  },
  {
    title: "Personalize every call with customer context",
    body: "Use caller history, funnel stage, and intent signals so each voice conversation feels relevant and useful.",
  },
  {
    title: "Convert more leads with automated callbacks",
    body: "Trigger follow-ups, reminders, booking flows, and sales notifications based on conversation outcomes.",
  },
  {
    title: "Turn voice conversations into insights",
    body: "Capture topics, objections, action items, and sentiment so teams learn from every customer call.",
  },
  {
    title: "Connect calls to the tools your team uses",
    body: "Send summaries and next steps into CRM, helpdesk, calendar, notification, and analytics workflows.",
  },
];

const cardStyles = [
  "bg-[linear-gradient(135deg,#00FFFF,#d9f99d)]",
  "bg-[linear-gradient(135deg,#fef3c7,#fed7aa)]",
  "bg-[linear-gradient(135deg,#dbeafe,#c7d2fe)]",
  "bg-[linear-gradient(135deg,#fce7f3,#e9d5ff)]",
  "bg-[linear-gradient(135deg,#dcfce7,#ccfbf1)]",
  "bg-[linear-gradient(135deg,#fee2e2,#cffafe)]",
];

const roleCards = [
  {
    title: "Sales Teams",
    body: "Qualify inbound leads, book meetings, and send clear call notes to your CRM without manual follow-up.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Support Teams",
    body: "Resolve repetitive calls, detect urgency, and hand off complex issues with transcripts and summaries.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Operations",
    body: "Route dispatch, booking, reminders, and status calls into the right workflow as soon as customers speak.",
    image:
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Customer Experience",
    body: "Keep every caller heard with natural responses, multilingual support, and consistent escalation rules.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
  },
];

const resources = [
  {
    title: "From Call Scripts to AI Voice Agents",
    body: "Explore how voice agents transform real customer calls into useful actions and insights.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "How AI Agents Improve Support Operations",
    body: "Discover how AI voice agents reduce missed calls, speed up triage, and improve team efficiency.",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "What Makes a Voice Agent Feel Natural?",
    body: "Learn the patterns behind helpful voice workflows, clean handoffs, and better customer experiences.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
  },
];

function AutomateAgents() {
  return (
    <section className="overflow-hidden bg-white py-16 text-center">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto mb-6 flex w-fit gap-1 text-4xl font-black text-cyan-500">...</div>
        <h2 className="m-0 text-[clamp(1.9rem,4vw,3.15rem)] leading-tight font-black text-slate-950">
          <span className="bg-cyan-100 px-4 text-cyan-700">Automate every customer interaction</span>
          <br />
          with AI Voice Platform agents
        </h2>
        <p className="mx-auto mt-4 mb-0 max-w-3xl text-base leading-7 text-slate-700">
          Turn everyday phone conversations into helpful, measurable workflows for sales,
          support, operations, and service teams.
        </p>
        <div className="relative mx-auto mt-14 h-32 max-w-md">
          <div className="absolute left-0 top-8 h-24 w-[45%] rounded-tl-[36px] border-t-8 border-l-8 border-cyan-200" />
          <div className="absolute right-0 top-8 h-24 w-[45%] rounded-tr-[36px] border-t-8 border-r-8 border-cyan-200" />
          <span className="absolute left-1/2 top-0 grid size-20 -translate-x-1/2 place-items-center rounded-full border-8 border-white bg-[#00FFFF] text-4xl text-slate-950 shadow-[0_20px_42px_rgba(0,180,190,0.28)]">
            *
          </span>
        </div>
      </div>
      <div className="mt-6 grid gap-6 bg-[linear-gradient(180deg,transparent,#eaffff_35%,#ffffff)] py-8">
        <div className="home-chip-row flex w-max gap-4">
          {[...agentUseCases, ...agentUseCases].map((item, index) => (
            <span className="rounded-full border border-cyan-100 bg-white px-6 py-4 text-base font-medium text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.08)]" key={`${item}-${index}`}>
              AI {item}
            </span>
          ))}
        </div>
        <div className="home-chip-row-reverse flex w-max gap-4">
          {[...agentUseCases.slice().reverse(), ...agentUseCases.slice().reverse()].map((item, index) => (
            <span className="rounded-full border border-cyan-100 bg-white px-6 py-4 text-base font-medium text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.08)]" key={`${item}-${index}`}>
              AI {item}
            </span>
          ))}
        </div>
      </div>
      <a className="mt-4 inline-flex rounded-full bg-slate-950 px-7 py-4 text-base font-black text-white" href="#platform">
        Explore AI Agents -&gt;
      </a>
    </section>
  );
}

function ChannelAccess() {
  return (
    <section className="mx-auto max-w-[1220px] px-4 py-12">
      <div className="relative min-h-[430px] overflow-hidden rounded-[30px] bg-[#f2ffff] p-8 shadow-[0_18px_52px_rgba(0,180,190,0.12)] ring-1 ring-cyan-100">
        <span className="absolute top-10 left-0 h-12 w-1.5 rounded-r-full bg-[#00FFFF]" />
        <h2 className="relative z-10 max-w-sm text-3xl leading-tight font-black text-slate-950">
          <span className="text-cyan-700">24/7 Voice Access</span> Across Every Call Channel
        </h2>
        <div className="absolute left-14 right-14 top-1/2 h-4 rounded-full bg-[linear-gradient(90deg,#00FFFF,#94f7ff,#00FFFF)]" />
        <div className="absolute left-[16%] top-[46%] grid size-28 place-items-center rounded-full border-8 border-white bg-cyan-100 text-3xl shadow-xl">
          AI
        </div>
        <div className="absolute right-[10%] top-[38%] grid size-24 place-items-center rounded-full border-8 border-white bg-cyan-400 text-white shadow-xl">
          CX
        </div>
        {["Phone", "Web", "CRM", "IVR", "SMS"].map((channel, index) => (
          <div
            className="absolute grid size-16 place-items-center rounded-2xl bg-white text-sm font-black text-cyan-700 shadow-[0_14px_32px_rgba(15,23,42,0.14)]"
            key={channel}
            style={{
              left: `${44 + (index % 2) * 9}%`,
              top: `${18 + index * 13}%`,
            }}
          >
            {channel.slice(0, 2)}
          </div>
        ))}
        <div className="absolute left-[26%] top-[28%] rounded-lg bg-white px-5 py-4 text-slate-700 shadow-lg">
          Can you help me book an appointment?
        </div>
        <div className="absolute left-[32%] bottom-[12%] max-w-xs rounded-lg bg-white px-5 py-4 text-slate-700 shadow-lg">
          I need to speak with the right support team.
        </div>
        <div className="absolute right-[14%] bottom-[24%] rounded-lg bg-white px-5 py-4 text-slate-700 shadow-lg">
          I found your account and created a summary.
        </div>
      </div>
    </section>
  );
}

function PlatformCards() {
  return (
    <section className="mx-auto max-w-[1220px] px-4 py-16" id="platform">
      <div className="text-center">
        <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-bold text-cyan-800">
          AI Voice Platform
        </span>
        <h2 className="mx-auto mt-8 mb-0 max-w-4xl text-[clamp(1.9rem,4vw,3.15rem)] leading-tight font-black text-slate-950">
          The purpose-built platform for the voice AI era
        </h2>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {platformCards.map((card, index) => (
          <article
            className={`relative flex min-h-[280px] flex-col overflow-hidden rounded-[20px] p-8 text-slate-950 shadow-[0_18px_48px_rgba(15,23,42,0.10)] ring-1 ring-white/70 ${cardStyles[index]}`}
            key={card.title}
          >
            <div className="relative z-10">
              <h3 className="m-0 max-w-lg text-2xl leading-tight font-black">
                {card.title}
              </h3>
              <p className="mt-5 mb-0 max-w-xl text-base leading-7 text-slate-700">
                {card.body}
              </p>
            </div>

            <div className="relative z-10 mt-auto pt-8">
              <div className="h-20 rounded-t-[44px] border-t-8 border-cyan-200/80" />
              <div className="relative -mt-14 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white/95 px-5 py-4 text-sm font-bold text-slate-700 shadow-[0_14px_30px_rgba(15,23,42,0.12)] ring-1 ring-white/80">
                  {index % 2 === 0 ? "Customer intent found" : "Send call summary"}
                </div>
                <div className="rounded-lg bg-white/95 px-5 py-4 text-sm font-bold text-slate-700 shadow-[0_14px_30px_rgba(15,23,42,0.12)] ring-1 ring-white/80">
                  {index % 2 === 0 ? "AI Powered Action" : "Call Trigger"}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function GlobalProof() {
  return (
    <section className="relative mt-10 bg-[#00FFFF] py-20 text-slate-950">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-cyan-800">
            Leading Conversations Globally
          </span>
          <h2 className="mt-8 mb-0 text-[clamp(1.9rem,4vw,3.15rem)] leading-tight font-black">
            A voice AI engine for teams that want every call answered, understood, and actioned.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-7 rounded-[28px] bg-white/55 p-8 text-center shadow-[0_20px_56px_rgba(15,23,42,0.12)]">
          {[
            ["24/7", "AI voice coverage"],
            ["5 min", "to create an agent"],
            ["140+", "languages supported"],
            ["100%", "call summaries captured"],
          ].map(([value, label]) => (
            <div className="grid gap-2" key={label}>
              <strong className="text-5xl font-black">{value}</strong>
              <span className="text-lg leading-6 text-slate-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-[900px] gap-6 px-4 md:grid-cols-2">
        <div className="rounded-[24px] border-8 border-white bg-cyan-50 p-8 shadow-xl">
          <p className="m-0 leading-7 text-slate-700">
            By leveraging AI voice agents, teams reduce missed calls, improve follow-ups, and keep every conversation visible.
          </p>
          <div className="mt-12 rounded-lg bg-white p-5 font-black">AI Voice Platform - Customer Team</div>
        </div>
        <div className="rounded-[24px] bg-white p-8 shadow-xl">
          <div className="grid grid-cols-2 gap-8 text-center">
            {["Meta", "Juniper", "Gartner", "Everest"].map((award) => (
              <strong className="text-2xl text-slate-700" key={award}>{award}</strong>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleSection() {
  return (
    <section className="mx-auto max-w-[1160px] px-4 py-20 text-center" id="business">
      <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-bold text-cyan-800">
        Built for every team
      </span>
      <h2 className="mx-auto mt-8 mb-0 max-w-4xl text-[clamp(1.9rem,4vw,3.15rem)] leading-tight font-black text-slate-950">
        <span className="text-cyan-700">Teams use voice agents</span> to answer faster and follow up with more context
      </h2>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {roleCards.map((role) => (
          <article className="overflow-hidden rounded-lg border border-cyan-100 bg-white text-left shadow-[0_14px_34px_rgba(15,23,42,0.08)]" key={role.title}>
            <div className="relative h-36">
              <Image src={role.image} alt={role.title} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="min-h-44 p-5">
              <h3 className="m-0 text-xl font-black text-slate-950">{role.title}</h3>
              <p className="mt-4 mb-0 leading-6 text-slate-600">{role.body}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mx-auto mt-14 max-w-xl text-base leading-7 text-slate-700">
        <strong>Didn&apos;t see your workflow here?</strong> Get connected to our team to find out how voice automation can support your customer calls.
      </p>
      <a className="mt-8 inline-flex rounded-full border border-cyan-500 px-7 py-4 font-black text-cyan-800" href="#contact">
        Talk to an expert -&gt;
      </a>
    </section>
  );
}

function ResourcesSection() {
  return (
    <section className="mx-auto max-w-[980px] px-4 py-16 text-center" id="resources">
      <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-bold text-cyan-800">
        Resources
      </span>
      <h2 className="mx-auto mt-8 mb-0 max-w-4xl text-[clamp(1.9rem,4vw,3.15rem)] leading-tight font-black text-slate-950">
        Learn how teams design better voice agents and customer call workflows
      </h2>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {resources.map((resource) => (
          <article className="overflow-hidden rounded-lg border border-cyan-100 bg-white text-left shadow-[0_14px_34px_rgba(15,23,42,0.08)]" key={resource.title}>
            <div className="relative h-44">
              <Image src={resource.image} alt={resource.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="p-6">
              <span className="rounded-full border border-cyan-500 px-3 py-1 text-xs font-bold text-cyan-700">
                Blog
              </span>
              <h3 className="mt-5 mb-0 text-xl leading-7 font-black text-slate-950">{resource.title}</h3>
              <p className="mt-4 mb-0 leading-6 text-slate-600">{resource.body}</p>
              <a className="mt-8 inline-flex font-bold text-cyan-700" href="#">
                Find out more
              </a>
            </div>
          </article>
        ))}
        <article className="grid content-center gap-8 rounded-lg border border-cyan-100 bg-white p-8 text-left shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
          {[
            ["10", "Webinars"],
            ["12", "PDF guides"],
            ["40", "Customer stories"],
          ].map(([value, label]) => (
            <div className="flex items-center gap-6" key={label}>
              <span className="grid size-16 place-items-center rounded-xl bg-cyan-100 text-2xl font-black text-cyan-800">
                {value}
              </span>
              <span className="text-lg font-bold text-slate-950">{label}</span>
            </div>
          ))}
          <a className="w-fit rounded-full border border-cyan-500 px-6 py-3 font-black text-cyan-800" href="#">
            View all resources -&gt;
          </a>
        </article>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-[1080px] px-4 py-20" id="contact">
      <div className="relative overflow-hidden rounded-[28px] bg-[#00FFFF] px-6 py-24 text-center text-slate-950 shadow-[0_24px_70px_rgba(0,180,190,0.22)]">
        <div className="absolute top-0 left-1/2 h-8 w-32 -translate-x-1/2 rounded-b-[28px] bg-white" />
        <h2 className="m-0 text-[clamp(1.9rem,4vw,3.15rem)] font-black">Ready to start a smarter voice conversation?</h2>
        <p className="mx-auto mt-5 mb-0 max-w-xl text-base leading-7 text-slate-700">
          Get connected to see how AI Voice Platform can support your calls, agents, analytics, and customer workflows.
        </p>
        <a className="mt-10 inline-flex rounded-full bg-white px-7 py-4 font-black text-cyan-800 shadow-lg" href="mailto:hello@aivoiceplatform.com">
          Let&apos;s talk -&gt;
        </a>
      </div>
    </section>
  );
}

export function HomePlatformSections() {
  return (
    <div className="bg-white">
      <AutomateAgents />
      <ChannelAccess />
      <IndianLanguageVoiceSection />
      <PlatformCards />
      <GlobalProof />
      <RoleSection />
      <ResourcesSection />
      <FinalCta />
      <style>{`
        @keyframes home-chip-row {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes home-chip-row-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        .home-chip-row {
          animation: home-chip-row 34s linear infinite;
        }

        .home-chip-row-reverse {
          animation: home-chip-row-reverse 38s linear infinite;
        }
      `}</style>
    </div>
  );
}
