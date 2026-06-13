import { VoicePreview } from "@/components/sections/VoicePreview";

export function HeroSection() {
  return (
    <section
      className="mx-auto grid min-h-[92vh] w-full max-w-[1280px] content-center gap-12 px-5 pt-28 pb-10 sm:px-8 lg:px-12"
      id="product"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
        <div className="grid max-w-3xl gap-6">
          <p className="m-0 text-xs font-black uppercase text-fuchsia-300">
            Human-like AI voices in seconds
          </p>
          <h1 className="m-0 text-[clamp(3rem,7vw,6.8rem)] leading-[0.93] font-black">
            Create, clone, and deploy production-ready voice AI.
          </h1>
          <p className="m-0 max-w-2xl text-base leading-8 text-[#dcc6f2] sm:text-lg">
            Generate natural speech, run live voice demos, and ship multilingual
            agents with reliable APIs built for customer conversations, content
            teams, and product workflows.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 font-black text-[#26063b] transition hover:-translate-y-0.5 hover:bg-[#f1e5ff]"
              href="#demo"
            >
              Try Free
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              href="#features"
            >
              Explore Voices
            </a>
          </div>

          <div
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-[#dcc6f2]"
            aria-label="Platform promises"
          >
            {["No credit card needed", "140+ languages", "Realtime preview"].map(
              (item) => (
                <span className="inline-flex items-center gap-2" key={item}>
                  <span className="size-1.5 rounded-full bg-fuchsia-300" />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        <VoicePreview />
      </div>

      <div
        className="grid overflow-hidden rounded-lg border border-white/15 bg-black/20 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Platform stats"
      >
        <article className="border-b border-white/10 p-5 sm:border-r lg:border-b-0">
          <strong className="block text-2xl font-black">500K+</strong>
          <span className="text-sm text-[#dcc6f2]">Creators</span>
        </article>
        <article className="border-b border-white/10 p-5 lg:border-r lg:border-b-0">
          <strong className="block text-2xl font-black">3,000+</strong>
          <span className="text-sm text-[#dcc6f2]">AI voices</span>
        </article>
        <article className="border-b border-white/10 p-5 sm:border-r sm:border-b-0">
          <strong className="block text-2xl font-black">140+</strong>
          <span className="text-sm text-[#dcc6f2]">Languages</span>
        </article>
        <article className="p-5">
          <strong className="block text-2xl font-black">99.9%</strong>
          <span className="text-sm text-[#dcc6f2]">Uptime</span>
        </article>
      </div>
    </section>
  );
}
