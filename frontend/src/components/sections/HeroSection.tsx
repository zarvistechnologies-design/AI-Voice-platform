const customerNames = [
  "FixFlow",
  "Prime HVAC",
  "RooterOne",
  "SparkPro",
  "CleanNest",
  "Roofline",
  "LocalCrew",
  "Pipewise",
  "HomeOps",
];

const heroSignals = [
  ["5/5", "G2 rating"],
  ["24/7", "call coverage"],
  ["140+", "languages"],
  ["<500ms", "voice latency"],
];

const liveCallRows = [
  { caller: "Maya Patel", intent: "Book service visit", status: "Qualified", time: "00:48" },
  { caller: "Sam Rivera", intent: "After-hours repair", status: "Escalated", time: "01:12" },
  { caller: "Nora Kim", intent: "Pricing question", status: "Follow-up", time: "02:04" },
];

function AudioBars() {
  return (
    <span className="flex h-6 items-center gap-1" aria-hidden="true">
      {[10, 18, 24, 14, 21, 12, 19].map((height, index) => (
        <span
          className="hero-audio-bar w-1 rounded-full bg-cyan-300"
          key={`${height}-${index}`}
          style={{ height, animationDelay: `${index * 80}ms` }}
        />
      ))}
    </span>
  );
}

function HeroConsole() {
  return (
    <div className="relative hidden min-h-[440px] lg:block" aria-label="Live voice agent operations preview">
      <div className="absolute inset-x-0 top-6 grid grid-cols-3 gap-x-10 gap-y-14">
        {customerNames.map((name) => (
          <span className="text-center text-2xl font-extrabold text-slate-500/75" key={name}>
            {name}
          </span>
        ))}
      </div>

      <div className="absolute right-4 bottom-2 w-[420px] rounded-lg border border-white/12 bg-[#0a1020]/80 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
          <div>
            <p className="m-0 text-sm font-semibold text-white">Live call queue</p>
            <p className="m-0 mt-1 text-xs text-slate-400">Agent is handling customer calls now</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">
            <span className="size-2 rounded-full bg-emerald-300" />
            Online
          </span>
        </div>

        <div className="mt-4 grid gap-3">
          {liveCallRows.map((row) => (
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-md border border-white/8 bg-white/[0.04] p-3" key={row.caller}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <AudioBars />
                  <strong className="truncate text-sm font-semibold text-white">{row.caller}</strong>
                </div>
                <p className="m-0 mt-2 truncate text-xs text-slate-400">{row.intent}</p>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-cyan-300/12 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                  {row.status}
                </span>
                <p className="m-0 mt-2 text-xs text-slate-500">{row.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id="product"
      className="relative overflow-hidden bg-[#111827] px-4 pb-14 pt-32 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-40"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,27,0.30)_0%,rgba(17,24,39,0.00)_55%,rgba(17,24,39,1)_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative mx-auto grid w-full min-w-0 max-w-[1500px] gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(520px,1.05fr)] lg:items-center">
        <div className="min-w-0 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-300">
            <span>5/5 in G2</span>
            <span className="text-cyan-300" aria-hidden="true">*****</span>
          </div>

          <h1 className="m-0 mt-10 max-w-full text-4xl font-semibold leading-tight text-white sm:text-6xl sm:leading-none 2xl:text-7xl">
            AI Phone Agents for
            <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-teal-200 to-sky-400 bg-clip-text text-transparent">
              <span className="block sm:inline">Every Customer</span>
              <span className="block sm:inline"> Call</span>
            </span>
          </h1>

          <p className="m-0 mt-8 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Book appointments, qualify leads, answer after-hours calls, route urgent requests, and sync call outcomes into your workflow without missing valuable conversations.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              className="inline-flex min-h-14 items-center justify-center rounded-lg bg-[#08b8c8] px-8 text-base font-extrabold text-slate-950 shadow-[0_18px_48px_rgba(8,184,200,0.24)] hover:bg-cyan-300"
              href="/dashboard"
            >
              Try for free
            </a>
            <a
              className="inline-flex min-h-14 items-center justify-center rounded-lg border border-white/16 bg-white/5 px-8 text-base font-extrabold text-white hover:bg-white/10"
              href="#contact"
            >
              Contact sales
            </a>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {heroSignals.map(([value, label]) => (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={label}>
                <strong className="block text-2xl font-extrabold text-white">{value}</strong>
                <span className="mt-1 block text-xs font-semibold text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <HeroConsole />
      </div>

      <div className="relative mx-auto mt-14 grid max-w-[1500px] gap-3 border-t border-white/10 pt-5 sm:grid-cols-2 lg:hidden">
        {customerNames.slice(0, 6).map((name) => (
          <span className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-lg font-extrabold text-slate-400" key={name}>
            {name}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes hero-audio-pulse {
          0%, 100% { transform: scaleY(0.55); opacity: 0.45; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        .hero-audio-bar {
          animation: hero-audio-pulse 1.1s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </section>
  );
}
