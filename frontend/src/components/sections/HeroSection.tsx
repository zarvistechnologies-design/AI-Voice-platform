const companyNames = [
  "CAPSULE",
  "doxy.me",
  "gifthealth",
  "PINE PARK HEALTH",
  "waymark",
  "NOVA BANK",
  "RoutePeak",
  "PolicyWorks",
  "STAY",
  "CollectIQ",
];

const metrics = [
  ["24/7", "agent coverage"],
  ["140+", "languages"],
  ["<2s", "handoff"],
  ["100%", "call summaries"],
];

const waveDots = Array.from({ length: 220 }, (_, index) => {
  const columns = 44;
  const column = index % columns;
  const row = Math.floor(index / columns);
  const wave = Math.sin(column * 0.34 + row * 0.72);
  const drift = Math.cos(column * 0.16 + row * 0.5);
  const size = 2 + ((index * 7) % 5);

  return {
    left: `${(column / (columns - 1)) * 100 + drift * 1.2}%`,
    top: `${18 + row * 12 + wave * 8}%`,
    width: `${size}px`,
    height: `${size}px`,
    opacity: `${0.32 + ((index * 11) % 45) / 100}`,
    animationDelay: `${-((index * 0.11) % 3.5)}s`,
    animationDuration: `${4.8 + ((index * 13) % 28) / 10}s`,
  };
});

const orbitDots = Array.from({ length: 28 }, (_, index) => ({
  left: `${8 + ((index * 17) % 84)}%`,
  top: `${8 + ((index * 23) % 78)}%`,
  width: `${4 + ((index * 5) % 8)}px`,
  height: `${4 + ((index * 5) % 8)}px`,
  animationDelay: `${-((index * 0.21) % 5)}s`,
  animationDuration: `${7 + ((index * 3) % 6)}s`,
}));

function FloatingDotHero() {
  return (
    <div className="relative min-h-[460px] overflow-hidden rounded-[32px] border border-cyan-100 bg-white shadow-[0_24px_80px_rgba(0,184,196,0.14)]">
      <div className="absolute inset-0">
        <div className="absolute inset-x-[-8%] top-[4%] h-[78%]">
          {waveDots.map((dot, index) => (
            <span
              className="home-wave-dot absolute rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(0,184,196,0.38)]"
              key={`wave-${index}`}
              style={dot}
            />
          ))}
        </div>
        {orbitDots.map((dot, index) => (
          <span
            className="home-orbit-dot absolute rounded-full bg-white shadow-[0_0_0_1px_rgba(0,184,196,0.18),0_0_24px_rgba(0,184,196,0.28)]"
            key={`orbit-${index}`}
            style={dot}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.72)_30%,rgba(255,255,255,0.18)_60%,rgba(255,255,255,0)_100%)]" />
      </div>

      <div className="relative z-10 grid min-h-[460px] content-center justify-items-center px-5 py-12 text-center sm:px-8">
        <div className="inline-flex items-center gap-3 rounded-full border border-cyan-100 bg-white/90 px-4 py-2 shadow-[0_12px_32px_rgba(0,184,196,0.10)]">
          <span className="grid size-10 place-items-center rounded-full bg-cyan-400 text-sm font-black text-white shadow-[0_10px_28px_rgba(0,184,196,0.24)]">
            AI
          </span>
          <span className="text-sm font-black tracking-[0.18em] text-cyan-700">AI VOICE PLATFORM</span>
        </div>

        <div className="relative mt-10 w-full max-w-[780px]">
          <div className="absolute left-1/2 top-6 h-40 w-[72%] -translate-x-1/2 rounded-full bg-cyan-200/35 blur-3xl" />
          <div className="relative mx-auto grid max-w-[620px] gap-4 rounded-[26px] border border-cyan-100 bg-white/88 p-5 text-left shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">Live agent builder</span>
                <h2 className="m-0 mt-2 text-xl font-black text-slate-950">Customer Support Agent</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Live</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {["Listen", "Understand", "Action"].map((item, index) => (
                <div className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-4" key={item}>
                  <span className="grid size-9 place-items-center rounded-xl bg-white text-sm font-black text-cyan-700 shadow-sm">
                    {index + 1}
                  </span>
                  <strong className="mt-4 block text-sm font-black text-slate-900">{item}</strong>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {index === 0 ? "Realtime voice" : index === 1 ? "Intent and context" : "CRM and handoff"}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-white p-4">
              <div className="flex h-20 items-center justify-center gap-1.5">
                {[30, 46, 62, 78, 54, 88, 68, 50, 72, 42, 58, 36].map((height, index) => (
                  <span
                    className="home-audio-bar w-2 rounded-full bg-cyan-400"
                    key={`${height}-${index}`}
                    style={{ height, animationDelay: `${index * 90}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-2 top-20 hidden w-44 rounded-2xl border border-cyan-100 bg-white/92 p-4 text-left shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:block">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Next action</span>
            <strong className="mt-2 block text-sm text-slate-900">Book appointment</strong>
            <span className="mt-2 block text-xs leading-5 text-slate-500">Calendar slot found</span>
          </div>

          <div className="pointer-events-none absolute -left-2 bottom-8 hidden w-44 rounded-2xl border border-cyan-100 bg-white/92 p-4 text-left shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:block">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Call summary</span>
            <strong className="mt-2 block text-sm text-slate-900">Ready in CRM</strong>
            <span className="mt-2 block text-xs leading-5 text-slate-500">Transcript attached</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricsStrip() {
  return (
    <div className="grid overflow-hidden rounded-lg border border-cyan-100 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.08)] sm:grid-cols-4">
      {metrics.map(([value, label]) => (
        <div className="border-b border-cyan-100 px-5 py-5 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0" key={label}>
          <strong className="block text-2xl font-black text-slate-950">{value}</strong>
          <span className="text-sm font-bold text-slate-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

function CompanyStrip() {
  return (
    <section className="py-10 text-center" aria-label="Companies using AI Voice Platform">
      <h2 className="m-0 text-2xl font-black text-slate-950">
        Trusted by teams building better customer conversations
      </h2>
      <div className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-3">
        {companyNames.map((company) => (
          <span
            className="inline-flex min-h-11 min-w-max items-center rounded-full border border-cyan-100 bg-white px-5 text-xs font-black uppercase text-slate-700 shadow-sm"
            key={company}
          >
            {company}
          </span>
        ))}
      </div>
    </section>
  );
}

export function HeroSection() {
  return (
    <section id="product" className="relative mx-auto grid w-full max-w-[1540px] gap-8 overflow-hidden px-4 pt-28 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="relative mx-auto grid w-full max-w-[1320px] gap-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(520px,1.15fr)] lg:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-cyan-100 bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-cyan-700 shadow-sm">
              Voice AI for every call
            </span>
            <h1 className="mt-6 mb-0 text-[clamp(2.45rem,5.8vw,5.8rem)] leading-[0.98] font-black text-slate-950">
              AI voice agents that answer, understand, and act.
            </h1>
            <p className="mt-6 mb-0 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Build multilingual agents for support, sales, scheduling, reminders, and customer follow-ups from one clean workspace.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                className="rounded-full bg-cyan-400 px-7 py-4 text-sm font-black text-white shadow-[0_16px_36px_rgba(0,184,196,0.26)] hover:bg-cyan-500"
                href="/dashboard"
              >
                Build an agent
              </a>
              <a
                className="rounded-full border border-cyan-200 bg-white px-7 py-4 text-sm font-black text-cyan-800 shadow-sm hover:bg-cyan-50"
                href="#platform"
              >
                Explore platform
              </a>
            </div>
          </div>

          <FloatingDotHero />
        </div>

        <MetricsStrip />
        <CompanyStrip />
      </div>

      <style>{`
        @keyframes home-wave-float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, -14px, 0) scale(1.35); }
        }

        @keyframes home-orbit-float {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.65; }
          50% { transform: translate3d(10px, -18px, 0); opacity: 1; }
        }

        @keyframes home-audio-pulse {
          0%, 100% { transform: scaleY(0.58); opacity: 0.55; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        .home-wave-dot {
          animation: home-wave-float var(--duration, 6s) ease-in-out infinite;
        }

        .home-orbit-dot {
          animation: home-orbit-float var(--duration, 8s) ease-in-out infinite;
        }

        .home-audio-bar {
          animation: home-audio-pulse 1.2s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </section>
  );
}
