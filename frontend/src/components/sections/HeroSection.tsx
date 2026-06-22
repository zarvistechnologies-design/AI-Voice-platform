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

const scaleMetrics = [
  { value: "24/7", label: "answering" },
  { value: "10k+", label: "call capacity" },
  { value: "<2s", label: "handoff" },
];

const orbitDots = [
  "top-0 left-1/2 -translate-x-1/2",
  "top-[14%] right-[16%]",
  "top-1/2 right-0 -translate-y-1/2",
  "right-[16%] bottom-[14%]",
  "bottom-0 left-1/2 -translate-x-1/2",
  "bottom-[14%] left-[16%]",
  "top-1/2 left-0 -translate-y-1/2",
  "top-[14%] left-[16%]",
];

export function HeroSection() {
  return (
    <section
      className="mx-auto grid w-full max-w-[1360px] gap-6 px-4 pt-24 pb-8 sm:px-6 lg:px-8"
      id="product"
    >
      <div className="relative min-h-[580px] overflow-hidden rounded-[22px] border border-[#374151] bg-[radial-gradient(circle_at_12%_12%,#5eead455_0,transparent_32%),radial-gradient(circle_at_46%_88%,#00ADB56b_0,transparent_34%),radial-gradient(circle_at_90%_16%,#0f766e73_0,transparent_30%),linear-gradient(135deg,#111827_0%,#1f2937_46%,#111827_100%)] px-5 py-10 shadow-[0_28px_90px_rgba(0,0,0,0.34)] sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,#02061799_78%)]" />
        <div className="relative z-10 grid min-h-[500px] content-between">
          <div className="mx-auto grid max-w-3xl justify-items-center gap-8 pt-10 text-center sm:pt-14">
            <p className="m-0 text-[0.7rem] font-black uppercase tracking-[0.08em] text-white/90 sm:text-xs">
              #1 AI Voice Agent Platform For Automating Calls
            </p>
            <h1 className="m-0 max-w-3xl font-serif text-[clamp(2.35rem,5.1vw,4.7rem)] font-normal leading-[0.98] tracking-normal text-white">
              Meet your AI call center
              <br />
              from the future.
            </h1>
          </div>

          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.75fr)_auto]">
            <div className="max-w-md">
              <div className="mb-4 inline-flex items-center gap-1 rounded bg-white/20 px-2.5 py-1 text-xs font-bold text-white shadow-sm backdrop-blur">
                <span>G2</span>
                <span aria-hidden="true">*****</span>
                <span className="text-white/80">4.8</span>
              </div>
              <p className="m-0 text-sm font-bold leading-6 text-white sm:text-base sm:leading-7">
                Build, deploy, and manage next-generation AI voice agents that
                sound human, execute tasks, and scale effortlessly.
              </p>
            </div>

            <a
              className="group inline-flex items-center gap-3 justify-self-start text-base font-black text-white transition hover:text-cyan-200 lg:justify-self-end"
              href="#demo"
            >
              <span>Try Our Live Demo</span>
              <span className="grid size-10 place-items-center overflow-hidden rounded-md bg-white p-1">
                <span className="block size-full rounded-lg bg-[radial-gradient(circle_at_68%_28%,#0891b2_0,transparent_35%),radial-gradient(circle_at_32%_76%,#7c3aed_0,transparent_40%),linear-gradient(135deg,#f8fafc,#bfdbfe)] transition group-hover:scale-105" />
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border-y border-white/10 py-7" aria-label="Companies using AI Voice Platform">
        <div className="home-company-marquee flex w-max items-center gap-4">
          {[...companyNames, ...companyNames].map((company, index) => (
            <span
              className="inline-flex min-h-11 min-w-max items-center rounded-full border border-[#00ADB5]/25 bg-white/[0.04] px-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              key={`${company}-${index}`}
            >
              {company}
            </span>
          ))}
        </div>
      </div>

      <div
        className="grid min-h-[240px] items-center gap-7 overflow-hidden rounded-[18px] border border-[#71349b]/45 bg-[radial-gradient(circle_at_50%_50%,#00ADB526_0,transparent_32%),radial-gradient(circle_at_15%_20%,#6a00a84a_0,transparent_34%),linear-gradient(135deg,#111827_0%,#1f2937_52%,#111827_100%)] px-5 py-8 text-white shadow-[0_22px_65px_rgba(0,0,0,0.26)] sm:px-7 lg:grid-cols-[minmax(0,1fr)_180px_minmax(0,1fr)] lg:gap-9 lg:px-9"
        aria-label="AI voice automation at scale"
      >
        <div className="grid content-center justify-items-center gap-3 text-center lg:min-h-[170px] lg:justify-items-start lg:text-left">
          <p className="m-0 text-xs font-black uppercase text-[#0f766e]">
            AI voice infrastructure
          </p>
          <h2 className="m-0 font-serif text-[clamp(1.65rem,3.8vw,3rem)] leading-none font-normal tracking-normal">
            Every Call
          </h2>
          <p className="mx-auto m-0 max-w-xs text-xs leading-5 font-semibold text-[#dcc6f2] lg:mx-0">
            Your AI agents answer, qualify, book, update records, and hand off
            the moments that need a human.
          </p>
        </div>

        <div className="relative mx-auto grid size-[150px] place-items-center self-center sm:size-[180px]">
          <div className="absolute inset-5 rounded-full border border-[#00ADB5]/25 shadow-[0_0_28px_rgba(0,173,181,0.14)]" />
          <div className="scale-orbit absolute inset-0 rounded-full">
            {orbitDots.map((position, index) => (
              <span
                className={`scale-dot absolute size-5 rounded-full bg-gradient-to-br from-[#d08cff] to-[#00ADB5] shadow-[0_8px_22px_rgba(0,173,181,0.22)] sm:size-6 ${position}`}
                key={index}
                style={{ animationDelay: `${index * 0.14}s` }}
              />
            ))}
          </div>
          <div className="scale-orbit-reverse absolute inset-8 rounded-full border border-dashed border-[#d08cff]/35" />
          <div className="scale-core relative grid size-20 place-items-center rounded-full border border-[#00ADB5]/35 bg-[#111827] shadow-[0_18px_45px_rgba(0,173,181,0.18)] sm:size-24">
            <div className="flex items-end gap-1" aria-hidden="true">
              {[18, 34, 24, 44, 28].map((height, index) => (
                <span
                  className="scale-wave-bar w-2 rounded-full bg-gradient-to-t from-[#0f766e] to-[#00ADB5]"
                  key={index}
                  style={{ height }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid content-center justify-items-center gap-3 text-center lg:min-h-[170px] lg:justify-items-end lg:text-right">
          <p className="m-0 text-xs font-black uppercase text-[#00ADB5]">
            Realtime workflows
          </p>
          <h2 className="m-0 font-serif text-[clamp(1.65rem,3.8vw,3rem)] leading-none font-normal tracking-normal">
            Handled Smarter.
          </h2>
          <div className="grid w-full max-w-[330px] grid-cols-3 gap-2">
            {scaleMetrics.map((metric) => (
              <div
                className="grid gap-1 rounded-lg border border-white/10 bg-white/5 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                key={metric.label}
              >
                <strong className="text-base font-black text-white">{metric.value}</strong>
                <span className="text-[0.68rem] font-bold uppercase text-[#dcc6f2]">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes home-company-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .home-company-marquee {
          animation: home-company-marquee 28s linear infinite;
        }

        @keyframes scale-orbit {
          from {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.04);
          }
          to {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes scale-orbit-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes scale-dot {
          0%,
          100% {
            opacity: 0.72;
            transform: scale(0.88);
          }
          50% {
            opacity: 1;
            transform: scale(1.18);
          }
        }

        @keyframes scale-core {
          0%,
          100% {
            box-shadow: 0 18px 45px rgba(0, 173, 181, 0.18);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 18px 60px rgba(208, 140, 255, 0.28);
            transform: scale(1.04);
          }
        }

        @keyframes scale-wave {
          0%,
          100% {
            transform: scaleY(0.62);
          }
          50% {
            transform: scaleY(1.18);
          }
        }

        .scale-orbit {
          animation: scale-orbit 13s ease-in-out infinite;
        }

        .scale-orbit-reverse {
          animation: scale-orbit-reverse 18s linear infinite;
        }

        .scale-dot {
          animation: scale-dot 1.9s ease-in-out infinite;
        }

        .scale-core {
          animation: scale-core 2.8s ease-in-out infinite;
        }

        .scale-wave-bar {
          animation: scale-wave 1.2s ease-in-out infinite;
          transform-origin: bottom;
        }

        .scale-wave-bar:nth-child(2) {
          animation-delay: 0.1s;
        }

        .scale-wave-bar:nth-child(3) {
          animation-delay: 0.2s;
        }

        .scale-wave-bar:nth-child(4) {
          animation-delay: 0.3s;
        }

        .scale-wave-bar:nth-child(5) {
          animation-delay: 0.4s;
        }
      `}</style>
    </section>
  );
}
