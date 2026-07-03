import { platformFeatures } from "@/config/site";

const workflowSteps = [
  {
    title: "Write",
    body: "Paste a script or stream text from your product.",
  },
  {
    title: "Tune",
    body: "Choose voice, pacing, language, and emotion.",
  },
  {
    title: "Preview",
    body: "Generate low-latency speech and review the transcript.",
  },
  {
    title: "Deploy",
    body: "Export audio or call the API from your workflow.",
  },
];

const useCases = [
  {
    title: "For Support Teams",
    body: "Resolve routine calls with voice agents that understand context, detect urgency, and hand off cleanly when a human should step in.",
  },
  {
    title: "For Creators",
    body: "Produce narration, ads, lessons, and localized clips with consistent tone across every language and channel.",
  },
  {
    title: "For Developers",
    body: "Connect text-to-speech, voice cloning, and live preview workflows through stable APIs with clear usage controls.",
  },
];

export function FeaturesSection() {
  const miniWaveHeights = [
    "h-3",
    "h-6",
    "h-4",
    "h-8",
    "h-5",
    "h-7",
    "h-4",
    "h-8",
    "h-5",
    "h-6",
    "h-4",
    "h-3",
  ];

  return (
    <div className="mx-auto grid w-full max-w-[1280px] gap-20 px-5 py-20 sm:px-8 lg:px-12">
      <section
        className="grid items-center gap-8 rounded-lg border border-white/15 bg-black/20 p-5 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)]"
        id="demo"
        aria-label="Live voice demo"
      >
        <div>
          <p className="m-0 text-xs font-black uppercase text-cyan-300">Live voice demo</p>
          <h2 className="mt-3 mb-0 text-[clamp(2rem,5vw,4rem)] leading-none font-black">
            Turn any script into polished audio before you ship.
          </h2>
        </div>
        <form className="grid gap-4 rounded-lg border border-white/15 bg-[#10071d]/80 p-4">
          <div className="grid gap-2">
            <label className="text-sm font-black" htmlFor="demo-text">Script</label>
            <input
              className="min-h-12 rounded-lg border border-white/15 bg-black/20 px-3.5 text-white outline-none placeholder:text-white/40 focus:border-cyan-300"
              id="demo-text"
              type="text"
              placeholder="Type any text here..."
              defaultValue="Welcome back. Your appointment is confirmed for tomorrow at 10 AM."
            />
          </div>
          <button
            className="min-h-11 rounded-lg border-0 bg-white font-black text-[#26063b]"
            type="button"
          >
            Generate
          </button>
          <div className="flex h-10 items-center justify-center gap-1" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, index) => (
              <span
                className={`block w-1 rounded-full bg-cyan-300 ${miniWaveHeights[index]}`}
                key={index}
              />
            ))}
          </div>
        </form>
      </section>

      <section className="grid gap-8" id="features">
        <div className="max-w-3xl">
          <p className="m-0 text-xs font-black uppercase text-cyan-300">Features</p>
          <h2 className="mt-3 mb-0 text-[clamp(2rem,5vw,4rem)] leading-none font-black">
            Everything needed to build clear, natural voice experiences.
          </h2>
        </div>

        <div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Platform highlights"
        >
          {platformFeatures.map((feature) => (
            <article
              className="grid content-start gap-3 rounded-lg border border-white/15 bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/10"
              key={feature.title}
            >
              <span
                className="grid size-10 place-items-center rounded-lg bg-cyan-300 font-black text-slate-950"
                aria-hidden="true"
              >
                {feature.icon}
              </span>
              <h3 className="m-0 text-xl font-black">{feature.title}</h3>
              <p className="m-0 leading-7 text-[#dcc6f2]">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8" aria-label="How it works">
        <div className="max-w-3xl">
          <p className="m-0 text-xs font-black uppercase text-cyan-300">How it works</p>
          <h2 className="mt-3 mb-0 text-[clamp(2rem,5vw,4rem)] leading-none font-black">
            From text to finished voice in four simple moves.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step, index) => (
            <article className="border-t border-white/20 py-5" key={step.title}>
              <strong className="text-sm text-cyan-300">
                {String(index + 1).padStart(2, "0")}
              </strong>
              <h3 className="my-3 text-xl font-black">{step.title}</h3>
              <p className="m-0 leading-7 text-[#dcc6f2]">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="grid gap-8 rounded-lg bg-white px-5 py-10 text-[#171321] sm:px-8"
        id="business"
      >
        <div className="max-w-3xl">
          <p className="m-0 text-xs font-black uppercase text-cyan-700">Built for teams</p>
          <h2 className="mt-3 mb-0 text-[clamp(2rem,5vw,4rem)] leading-none font-black">
            One voice layer for every workflow that needs to speak.
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <article className="border-t border-[#ded6f2] py-5" key={useCase.title}>
              <h3 className="mt-0 mb-3 text-xl font-black">{useCase.title}</h3>
              <p className="m-0 leading-7 text-[#6d647d]">{useCase.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="grid items-center gap-8 border-y border-white/15 py-14 lg:grid-cols-2"
        id="developers"
      >
        <div>
          <p className="m-0 text-xs font-black uppercase text-cyan-300">API access</p>
          <h2 className="mt-3 mb-4 text-[clamp(2rem,5vw,4rem)] leading-none font-black">
            Ship voice into your product with controls your team can trust.
          </h2>
          <p className="m-0 leading-7 text-[#dcc6f2]">
            Manage voices, generate speech, review usage, and embed previews in
            your app while keeping performance and privacy settings visible.
          </p>
        </div>
        <div
          className="grid gap-4 overflow-x-auto rounded-lg border border-white/15 bg-black/40 p-5 font-mono text-sm"
          aria-label="API example"
        >
          <span className="font-black text-cyan-300">POST /v1/audio/speech</span>
          <code className="text-[#dcc6f2]">{`{ voice: "aria", language: "en", speed: 1.0 }`}</code>
        </div>
      </section>
    </div>
  );
}
