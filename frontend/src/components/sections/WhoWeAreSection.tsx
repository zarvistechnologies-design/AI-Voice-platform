import Image from "next/image";

const evolutionCards = [
  {
    title: "Before AI Voice",
    copy: "Teams handled every call manually, with long waits, missed calls, and slow follow-ups.",
  },
  {
    title: "Using Voice AI",
    copy: "Voice agents answer naturally, book appointments, support customers, and update CRM 24/7.",
  },
  {
    title: "Business Impact",
    copy: "Teams handle more calls, respond faster, and reduce repetitive phone work.",
  },
];

const industryTags = [
  "Real estate",
  "Education",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Restaurants",
];

const platformSignals = [
  { label: "Always-on", value: "24/7" },
  { label: "Voice workflows", value: "CRM" },
  { label: "Human handoff", value: "Live" },
];

const workflowPills = ["Answer", "Understand", "Book", "Follow up"];

export function WhoWeAreSection() {
  const flowHeights = [
    "h-4",
    "h-8",
    "h-12",
    "h-6",
    "h-10",
    "h-16",
    "h-8",
    "h-14",
    "h-6",
    "h-12",
    "h-16",
    "h-9",
    "h-14",
    "h-7",
    "h-12",
    "h-16",
    "h-8",
    "h-13",
    "h-6",
    "h-10",
    "h-8",
    "h-4",
  ];

  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-8 lg:px-12" id="company">
      <div className="grid gap-12">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-8 rounded-lg border border-white/15 bg-white/5 p-5 sm:p-8">
            <div>
              <p className="m-0 text-xs font-black uppercase text-fuchsia-300">Company</p>
              <h2 className="mt-3 mb-0 text-[clamp(2.4rem,5vw,4.5rem)] leading-none font-black">
                Who We Are
              </h2>
            </div>

            <div className="grid gap-5">
              <p className="m-0 text-lg leading-8 text-[#dcc6f2]">
                We are an AI Voice Platform company helping businesses turn
                every customer call into a faster, warmer, and more intelligent
                conversation.
              </p>
              <div className="flex flex-wrap gap-2" aria-label="Industries we serve">
                {industryTags.map((tag) => (
                  <span
                    className="rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-xs font-bold text-[#dcc6f2]"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8 rounded-lg border border-white/15 bg-[#10071d]/65 p-5 sm:p-8">
            <div>
              <p className="m-0 text-xs font-black uppercase text-fuchsia-300">Platform</p>
              <h2 className="mt-3 mb-0 text-[clamp(2.4rem,5vw,4.5rem)] leading-none font-black">
                What We Do
              </h2>
            </div>

            <div className="grid gap-5">
              <p className="m-0 text-lg leading-8 text-[#dcc6f2]">
                We provide AI-powered voice agents that answer calls, manage
                bookings, support customers, and follow up automatically while
                your team stays focused on the moments that need a human touch.
              </p>
              <div className="grid grid-cols-3 gap-2" aria-label="Platform strengths">
                {platformSignals.map((signal) => (
                  <span
                    className="grid gap-1 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-[#dcc6f2]"
                    key={signal.label}
                  >
                    <strong className="text-lg text-white">{signal.value}</strong>
                    {signal.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="grid items-center gap-8 rounded-lg border border-white/15 bg-black/25 p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]"
          aria-label="AI voice workflow"
        >
          <div>
            <p className="m-0 text-xs font-black uppercase text-fuchsia-300">Call flow</p>
            <h3 className="mt-3 mb-0 text-3xl leading-tight font-black">
              From first ring to completed action.
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {workflowPills.map((step, index) => (
              <span
                className="grid gap-1 rounded-lg border border-white/10 bg-white/5 p-3 text-sm font-bold"
                key={step}
              >
                <strong className="text-xs text-fuchsia-300">
                  {String(index + 1).padStart(2, "0")}
                </strong>
                {step}
              </span>
            ))}
          </div>
          <div
            className="flex h-20 items-center justify-center gap-1 overflow-hidden lg:col-span-2"
            aria-hidden="true"
          >
            {Array.from({ length: 22 }).map((_, index) => (
              <span
                className={`block w-1.5 rounded-full bg-gradient-to-t from-purple-700 to-fuchsia-300 ${flowHeights[index]}`}
                key={index}
              />
            ))}
          </div>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(380px,1.1fr)]">
          <div>
            <p className="m-0 text-xs font-black uppercase text-fuchsia-300">Evolution</p>
            <h2 className="mt-3 mb-8 text-[clamp(2.3rem,5vw,4.5rem)] leading-none font-black">
              AI Voice Technology changed how businesses handle calls.
            </h2>

            <div className="grid gap-3" aria-label="Voice technology stages">
              {evolutionCards.map((card, index) => (
                <article
                  className="grid grid-cols-[42px_1fr] gap-x-3 rounded-lg border border-white/15 bg-white/5 p-4"
                  key={card.title}
                >
                  <span className="row-span-2 text-sm font-black text-fuchsia-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 text-lg font-black">{card.title}</h3>
                  <p className="m-0 mt-1 leading-6 text-[#dcc6f2]">{card.copy}</p>
                </article>
              ))}
            </div>
          </div>

          <div
            className="relative grid min-h-[500px] content-end overflow-hidden rounded-lg border border-white/15 bg-black/30 p-5 sm:p-8"
            aria-label="Evolution of AI voice technology"
          >
            <Image
              src="/images/ai_voice2.gif"
              className="absolute inset-x-1/2 top-1/2 w-[600px] max-w-none -translate-x-1/2 -translate-y-[58%] scale-[1.55] mix-blend-lighten"
              alt="AI voice platform preview"
              width={600}
              height={600}
              unoptimized
            />
            <div className="relative z-10 mb-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-[#dcc6f2]">
              <span className="rounded-full bg-black/40 px-2 py-2">Manual calls</span>
              <span className="rounded-full bg-black/40 px-2 py-2">Rigid IVR</span>
              <span className="rounded-full bg-fuchsia-500/20 px-2 py-2 text-white">
                AI voice agents
              </span>
            </div>
            <strong className="relative z-10 text-2xl font-black">Voice AI Evolution</strong>
            <p className="relative z-10 mt-2 mb-0 leading-7 text-[#dcc6f2]">
              From missed calls and manual updates to always-on intelligent conversations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
