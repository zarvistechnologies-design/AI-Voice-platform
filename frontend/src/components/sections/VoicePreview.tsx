export function VoicePreview() {
  const waveHeights = [
    "h-8",
    "h-14",
    "h-20",
    "h-11",
    "h-24",
    "h-16",
    "h-28",
    "h-12",
    "h-20",
    "h-10",
    "h-16",
    "h-24",
    "h-14",
    "h-20",
    "h-11",
    "h-16",
    "h-10",
    "h-7",
  ];

  return (
    <div
      className="grid min-h-[440px] gap-6 rounded-lg border border-[#374151] bg-[#111827]/90 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-7"
      aria-label="Voice platform preview"
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 text-sm text-[#dcc6f2]">
        <span className="size-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/15" />
        <span>Live voice session</span>
        <strong className="text-white">00:42</strong>
      </div>

      <div
        className="flex min-h-40 items-center justify-center gap-1.5 overflow-hidden rounded-lg border border-white/10 bg-black/25 px-4"
        aria-hidden="true"
      >
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            className={`block w-1.5 rounded-full bg-gradient-to-t from-cyan-700 to-cyan-300 ${waveHeights[index]}`}
            key={index}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Voice settings">
        {["Aria - Warm", "English", "1.0x"].map((item) => (
          <span
            className="inline-flex min-h-8 items-center rounded-full border border-white/15 bg-white/5 px-3 text-xs font-bold text-[#dcc6f2]"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="grid gap-3">
        <p className="m-0 rounded-lg bg-white/5 p-3.5 leading-6 text-[#dcc6f2]">
          <strong className="text-white">Customer:</strong> Can I reschedule my appointment?
        </p>
        <p className="m-0 rounded-lg bg-cyan-600/15 p-3.5 leading-6 text-cyan-50">
          <strong className="text-white">AI Agent:</strong> Absolutely. I found three open times for
          you today.
        </p>
      </div>
    </div>
  );
}
