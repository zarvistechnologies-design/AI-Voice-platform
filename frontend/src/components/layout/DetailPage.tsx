import Link from "next/link";
import Image from "next/image";

import { SiteLayout } from "@/components/layout/SiteLayout";

type DetailSection = { title: string; body: string };
type DetailPageProps = {
  kicker: string;
  title: string;
  summary: string;
  highlights: readonly string[];
  sections: readonly DetailSection[];
  primaryAction: { href: string; label: string };
  secondaryAction: { href: string; label: string };
  heroTitle?: string;
};

const waveform = [10, 18, 24, 14, 28, 16, 32, 20, 26, 12, 22, 16, 30, 18, 12];

const visualContent: Record<string, { image: string; alt: string; eyebrow: string; title: string; body: string; points: string[] }> = {
  "Voice Agents": {
    image: "/service-images/team-workflow.jpg",
    alt: "Customer operations team collaborating around a laptop",
    eyebrow: "Natural conversations, useful outcomes",
    title: "Give callers an answer, not another queue.",
    body: "Voice agents combine conversational understanding with the business context and tools required to complete the request while the caller is still on the line.",
    points: ["Understand interruptions and natural speech", "Take approved actions across connected systems", "Transfer complex calls with the full context attached"],
  },
  "Voice Cloning": {
    image: "/service-images/voice-studio.jpg",
    alt: "Professional microphone in a voice recording studio",
    eyebrow: "A consistent voice identity",
    title: "Create speech that sounds recognizably yours.",
    body: "Develop an approved voice library for customer calls, product experiences, campaigns, and localized content without recording every line manually.",
    points: ["Review samples before publishing", "Control access to approved voice profiles", "Reuse the same identity across languages and channels"],
  },
  "Realtime TTS": {
    image: "/service-images/voice-studio.jpg",
    alt: "Studio microphone prepared for realtime audio production",
    eyebrow: "Speech built for live interaction",
    title: "Generate expressive audio at conversation speed.",
    body: "Stream clear speech with the pacing and responsiveness needed for live agents, interactive products, script previews, and changing customer context.",
    points: ["Start playback with low perceived latency", "Tune pace, pronunciation, and delivery", "Preview changes before they reach production"],
  },
  "Multilingual Speech": {
    image: "/service-images/team-workflow.jpg",
    alt: "International team collaborating in a modern workspace",
    eyebrow: "One workflow, many markets",
    title: "Meet customers in the language they use naturally.",
    body: "Localize customer conversations while keeping approved meaning, escalation rules, and business actions consistent across regions.",
    points: ["Support global and Indian languages", "Preserve names, terms, and brand pronunciation", "Route language-specific calls to the right team"],
  },
  "API Access": {
    image: "/service-images/developer-api.jpg",
    alt: "Developer workspace showing application code",
    eyebrow: "Composable by design",
    title: "Bring production voice into your own stack.",
    body: "Use straightforward APIs and webhooks to create agents, start calls, generate speech, receive events, and connect outcomes to your application.",
    points: ["Build with stable voice primitives", "Separate test and production environments", "Observe usage, failures, and call events"],
  },
  "Team Workflows": {
    image: "/service-images/team-workflow.jpg",
    alt: "Product team working together around a shared table",
    eyebrow: "A shared operating model",
    title: "Keep every team aligned on how agents behave.",
    body: "Turn scripts, prompts, approvals, escalation rules, and reporting into a visible workflow that can evolve without losing control.",
    points: ["Reuse approved agent templates", "Assign clear review and publishing roles", "Share call outcomes across departments"],
  },
  "Speech Analytics": {
    image: "/service-images/voice-analytics.jpg",
    alt: "Analytics dashboard with charts and performance data",
    eyebrow: "Every call becomes structured data",
    title: "See what customers ask, need, and do next.",
    body: "Turn recordings and transcripts into searchable themes, summaries, outcomes, and follow-up actions your teams can use immediately.",
    points: ["Track topics and call outcomes", "Surface objections and recurring questions", "Send next actions into the systems teams use"],
  },
  "Sentiment Detection": {
    image: "/service-images/voice-analytics.jpg",
    alt: "Business performance analytics displayed on a screen",
    eyebrow: "Understand the moment",
    title: "Detect when a conversation needs more care.",
    body: "Use tone and conversation context to flag frustration, urgency, confusion, or high intent while there is still time to respond well.",
    points: ["Trigger escalation from live signals", "Prioritize calls for quality review", "Measure sentiment trends across workflows"],
  },
  "Conversation Insights": {
    image: "/service-images/voice-analytics.jpg",
    alt: "Digital dashboard used to examine customer trends",
    eyebrow: "Patterns beyond a single call",
    title: "Find the themes hiding across thousands of conversations.",
    body: "Group customer needs, objections, questions, and outcomes so leaders can decide where scripts, products, and operations should improve next.",
    points: ["Cluster conversations by intent", "Compare performance across agents and campaigns", "Turn trends into prioritized operational work"],
  },
  "Quality Controls": {
    image: "/service-images/team-workflow.jpg",
    alt: "Team reviewing work together in an office",
    eyebrow: "Governance inside the workflow",
    title: "Keep automation inside the boundaries you approve.",
    body: "Define what an agent can say and do, test the difficult paths, and focus human review on conversations where risk or uncertainty is highest.",
    points: ["Set fallback and transfer conditions", "Review flagged calls with complete evidence", "Publish changes through an approval process"],
  },
};

const defaultVisual = {
  image: "/service-images/team-workflow.jpg",
  alt: "Business team collaborating on a customer workflow",
  eyebrow: "Designed around the work",
  title: "Connect customer conversations to a clear next step.",
  body: "Combine reliable phone coverage with the business rules, customer context, and human escalation paths your team already uses.",
  points: ["Capture the right context on every call", "Automate routine actions immediately", "Bring people in with a complete handoff"],
};

const pagePhotography: Record<string, readonly { image: string; alt: string; label: string }[]> = {
  "AI Phone Agent": [
    {
      image: "/images/seo-pages/ai-phone-agent-team.jpg",
      alt: "Customer support team working across a live call center",
      label: "Always-on call operations",
    },
    {
      image: "/images/seo-pages/ai-phone-agent-specialist.jpg",
      alt: "Customer service specialist speaking through a headset",
      label: "Focused customer support",
    },
    {
      image: "/images/seo-pages/ai-phone-agent-workstation.jpg",
      alt: "Phone support professional working from a laptop and headset",
      label: "Connected voice workspace",
    },
  ],
  "AI Receptionist": [
    {
      image: "/images/seo-pages/ai-receptionist-team.jpg",
      alt: "Customer service team coordinating calls from a professional office",
      label: "Coordinated front-desk support",
    },
    {
      image: "/images/seo-pages/ai-receptionist-landline.jpg",
      alt: "Reception professional answering a landline at an office desk",
      label: "Professional call answering",
    },
    {
      image: "/images/seo-pages/ai-receptionist-exclusive.jpg",
      alt: "Office receptionist handling a customer call while working on a laptop",
      label: "Responsive customer assistance",
    },
  ],
  "Outbound AI Calling": [
    {
      image: "/images/seo-pages/outbound-calling-floor.jpg",
      alt: "Outbound call team working from a dedicated operations floor",
      label: "Coordinated calling campaigns",
    },
    {
      image: "/images/seo-pages/outbound-calling-team.jpg",
      alt: "Sales representatives managing phone conversations from an office",
      label: "Team-based outreach",
    },
    {
      image: "/images/seo-pages/outbound-calling-agent.jpg",
      alt: "Outbound calling specialist speaking with a customer by telephone",
      label: "Focused customer follow-up",
    },
  ],
};

export function DetailPage({ kicker, title, summary, highlights, sections, primaryAction, secondaryAction, heroTitle }: DetailPageProps) {
  const photography = pagePhotography[title];
  const visual = visualContent[title] ?? (photography ? { ...defaultVisual, image: photography[0].image, alt: photography[0].alt } : defaultVisual);

  return (
    <SiteLayout>
      <div className="bg-black text-white">
        <section className="relative overflow-hidden bg-black px-4 pt-36 pb-20 sm:px-6 lg:px-8 lg:pt-40">
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(69,221,206,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(69,221,206,0.12)_1px,transparent_1px)] [background-size:64px_64px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(69,221,206,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(167,139,250,0.12),transparent_26%),linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.72)_72%,#000_100%)]" />
          <div className="relative mx-auto grid min-h-[540px] max-w-[1500px] gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(460px,1.05fr)] lg:items-center">
            <div className="max-w-3xl">
              <p className="m-0 text-sm font-extrabold text-[#75fff0]">{kicker} / AI Voice Platform</p>
              <h1 className="m-0 mt-8 bg-gradient-to-r from-white via-[#d9fffb] to-[#75fff0] bg-clip-text text-4xl leading-tight font-semibold text-transparent sm:text-6xl sm:leading-none 2xl:text-7xl">
                {heroTitle ?? `${title} for every customer call.`}
              </h1>
              <p className="m-0 mt-8 max-w-2xl text-lg leading-8 text-white/58 sm:text-xl">{summary}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link className="inline-flex min-h-14 items-center rounded-xl bg-[#45ddce] px-8 font-extrabold text-[#02110d] shadow-[0_18px_48px_rgba(69,221,206,0.22)] transition hover:bg-[#75fff0]" href={primaryAction.href}>{primaryAction.label}</Link>
                <Link className="inline-flex min-h-14 items-center rounded-xl border border-white/15 bg-white/[0.04] px-8 font-extrabold transition hover:border-[#45ddce]/40 hover:bg-[#45ddce]/[0.06]" href={secondaryAction.href}>{secondaryAction.label}</Link>
              </div>
            </div>

            <div className="rounded-3xl border border-[#45ddce]/18 bg-[#071713]/90 p-4 shadow-[0_26px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div><p className="m-0 text-sm font-semibold">Live customer call</p><p className="m-0 mt-1 text-xs text-slate-400">Agent is listening and taking action</p></div>
                <span className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-xs font-extrabold text-emerald-200">Connected 02:14</span>
              </div>
              <div className="flex h-32 items-center justify-center gap-1.5" aria-label="Live audio waveform">
                {waveform.map((height, index) => <span className="w-1.5 rounded-full bg-cyan-300" key={`${height}-${index}`} style={{ height }} />)}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {highlights.slice(0, 2).map((highlight, index) => (
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={highlight}>
                    <span className="text-xs font-extrabold text-cyan-200">0{index + 1}</span>
                    <strong className="mt-2 block text-sm">{highlight}</strong>
                    <span className="mt-2 block text-xs text-slate-500">Ready in this workflow</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <span className="text-sm font-semibold">Next action prepared</span>
                <span className="text-xs font-bold text-emerald-300">Workflow synced</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-2xl border border-[#45ddce]/15 bg-[#45ddce]/[0.035] sm:grid-cols-3">
            {highlights.map((highlight, index) => (
              <div className="border-b border-white/10 p-6 last:border-0 sm:border-r sm:border-b-0" key={highlight}>
                <strong className="block text-3xl font-semibold text-[#75fff0]">0{index + 1}</strong>
                <span className="mt-2 block font-semibold text-white/68">{highlight}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="m-0 text-sm font-extrabold text-[#75fff0]">Designed for outcomes</p>
            <h2 className="m-0 mt-4 text-4xl leading-tight font-semibold sm:text-5xl">Every conversation moves the work forward.</h2>
            <p className="m-0 mt-5 text-lg leading-7 text-white/48">Configure the experience around your policies, systems, and escalation rules while your team keeps control.</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-[1000px] gap-4 sm:grid-cols-2">
            {sections.map((section, index) => (
              <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_48px_rgba(0,0,0,0.22)] transition hover:border-[#45ddce]/30 hover:bg-[#45ddce]/[0.05]" key={section.title}>
                <span className="grid size-11 place-items-center rounded-xl bg-[#45ddce]/12 text-sm font-extrabold text-[#75fff0]">0{index + 1}</span>
                <h3 className="m-0 mt-6 text-2xl font-semibold">{section.title}</h3>
                <p className="m-0 mt-4 leading-7 text-white/48">{section.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-[#071713]">
              <Image className="object-cover" src={visual.image} alt={visual.alt} fill sizes="(max-width: 1024px) 100vw, 56vw" />
            </div>
            <div>
              <p className="m-0 text-sm font-extrabold text-[#75fff0]">{visual.eyebrow}</p>
              <h2 className="m-0 mt-4 text-4xl leading-tight font-semibold sm:text-5xl">{visual.title}</h2>
              <p className="m-0 mt-6 text-lg leading-8 text-white/48">{visual.body}</p>
              <div className="mt-8 grid gap-3">
                {visual.points.map((point) => (
                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4 text-sm font-semibold text-white/68" key={point}>
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-[#45ddce]" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {photography ? (
          <section className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1240px]">
              <div className="max-w-3xl">
                <p className="m-0 text-sm font-extrabold text-[#75fff0]">Real customer operations</p>
                <h2 className="m-0 mt-4 text-4xl leading-tight font-semibold sm:text-5xl">
                  Designed for the people behind every conversation.
                </h2>
                <p className="m-0 mt-5 text-base leading-7 text-white/48 sm:text-lg">
                  Bring call handling, team coordination, and measurable outcomes into one connected workflow.
                </p>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {photography.slice(1).map((photo) => (
                  <figure className="group relative m-0 aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-[#071713]" key={photo.image}>
                    <Image
                      alt={photo.alt}
                      className="object-cover transition duration-500 group-hover:scale-[1.025]"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      src={photo.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
                    <figcaption className="absolute right-5 bottom-5 left-5 text-sm font-bold text-white">
                      {photo.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-black px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="m-0 text-sm font-extrabold text-[#75fff0]">One connected workflow</p>
              <h2 className="m-0 mt-4 text-4xl leading-tight font-semibold sm:text-5xl">From first hello to the next action.</h2>
              <p className="m-0 mt-6 text-lg leading-8 text-white/48">Build the conversation, connect your tools, test edge cases, and measure outcomes from the same operating surface.</p>
            </div>
            <div className="rounded-2xl border border-[#45ddce]/15 bg-[#071713] p-4">
              {highlights.map((highlight, index) => (
                <div className="grid grid-cols-[44px_1fr_auto] items-center gap-4 border-b border-white/10 p-4 last:border-0" key={highlight}>
                  <span className="grid size-10 place-items-center rounded-xl bg-[#45ddce] text-sm font-extrabold text-[#02110d]">0{index + 1}</span>
                  <div><strong className="block">{highlight}</strong><span className="mt-1 block text-xs text-slate-500">Configured and observable</span></div>
                  <span className="text-xs font-bold text-emerald-300">Ready</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="m-0 text-sm font-extrabold text-[#75fff0]">Integrations</p>
            <h2 className="m-0 mt-4 text-4xl font-semibold sm:text-5xl">Works with the tools already running your business.</h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-[1000px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {["CRM", "Calendar", "Helpdesk", "Telephony", "Webhooks", "Analytics"].map((item) => (
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5 text-center font-semibold text-white/68 transition hover:border-[#45ddce]/35 hover:text-[#75fff0]" key={item}>{item}</div>
            ))}
          </div>
        </section>

        <section className="bg-black px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1120px] rounded-3xl border border-[#45ddce]/20 bg-[radial-gradient(circle_at_15%_20%,rgba(69,221,206,0.16),transparent_36%),linear-gradient(135deg,#091a17,#050807)] p-8 text-center text-white shadow-[0_26px_90px_rgba(69,221,206,0.1)] sm:p-12">
            <p className="m-0 text-sm font-extrabold text-[#75fff0]">Ready to launch {title.toLowerCase()}?</p>
            <h2 className="m-0 mx-auto mt-4 max-w-3xl text-4xl leading-tight font-semibold sm:text-5xl">Start with one workflow. Improve with every call.</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link className="inline-flex min-h-12 items-center rounded-xl bg-[#45ddce] px-7 font-extrabold text-[#02110d] transition hover:bg-[#75fff0]" href="/dashboard">Try for free</Link>
              <Link className="inline-flex min-h-12 items-center rounded-xl border border-white/15 bg-white/[0.05] px-7 font-extrabold text-white transition hover:border-[#45ddce]/40" href={primaryAction.href}>Contact sales</Link>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
