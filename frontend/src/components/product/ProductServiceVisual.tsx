import type { ReactNode } from "react";

import type { ProductServiceExperience } from "@/config/productServiceExperiences";
import type { ProductPageDesign } from "@/config/productPageDesigns";

type ProductServiceVisualProps = {
  slug: string;
  experience: ProductServiceExperience;
  design: ProductPageDesign;
};

const voiceBars = [16, 30, 22, 44, 28, 54, 34, 68, 40, 58, 26, 48, 32, 64, 38, 50, 24, 42, 30, 18];
const streamBars = [28, 48, 36, 70, 52, 82, 42, 64, 92, 58, 76, 46, 66, 38, 54, 30];

function StatusDot() {
  return <span className="product-visual-live size-1.5 rounded-full bg-[var(--service-accent)]" />;
}

function VisualShell({
  design,
  children,
  footer,
}: {
  design: ProductPageDesign;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="product-visual-shell relative mx-auto w-full min-w-0 max-w-[650px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#080b12] shadow-[0_32px_90px_rgba(0,0,0,0.5)]">
      <div className="product-visual-sheen pointer-events-none absolute inset-0" />
      <div className="relative flex items-center justify-between gap-4 border-b border-white/[0.08] px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.045]">
            <span className="size-2 rounded-sm bg-[var(--service-accent)] shadow-[0_0_16px_rgba(var(--service-accent-rgb),0.85)]" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-black uppercase tracking-[0.13em] text-[var(--service-accent-soft)]">
              {design.visualLabel}
            </p>
            <p className="mt-0.5 text-xs font-semibold leading-5 text-white/72">{design.visualTitle}</p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white/50">
          <StatusDot /> Live
        </span>
      </div>
      <div className="relative min-h-[354px] p-4 sm:min-h-[390px] sm:p-5">{children}</div>
      {footer && <div className="relative border-t border-white/[0.07] px-4 py-3 sm:px-5">{footer}</div>}
    </div>
  );
}

function ProofFooter({ experience }: { experience: ProductServiceExperience }) {
  return (
    <div className="grid grid-cols-3 divide-x divide-white/[0.07]">
      {experience.proof.map((item) => (
        <div className="min-w-0 px-2 first:pl-0 last:pr-0 sm:px-4" key={item.label}>
          <strong className="block truncate text-[11px] font-bold text-[var(--service-accent-soft)] sm:text-xs">{item.value}</strong>
          <span className="mt-1 block text-[8px] leading-3 text-white/32 sm:text-[9px]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function VoiceCloningVisual() {
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/28">Voice fingerprint</p>
            <p className="mt-1.5 text-sm font-semibold text-white/82">Warm · Clear · Assured</p>
          </div>
          <span className="rounded-full border border-[rgba(var(--service-accent-rgb),0.2)] bg-[rgba(var(--service-accent-rgb),0.08)] px-2.5 py-1 text-[9px] font-bold text-[var(--service-accent-soft)]">
            Authorized
          </span>
        </div>
        <div className="mt-7 flex h-24 items-center justify-center gap-1" aria-label="Voice profile waveform">
          {voiceBars.map((height, index) => (
            <span
              className="product-voice-bar w-1 rounded-full bg-[linear-gradient(to_top,var(--service-secondary),var(--service-accent))]"
              key={`${height}-${index}`}
              style={{ animationDelay: `${index * -55}ms`, height }}
            />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
          <span className="text-[9px] text-white/30">Sample quality</span>
          <span className="text-[10px] font-bold text-emerald-300">Excellent · 98%</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["Support", "Ready"],
          ["Narration", "Ready"],
          ["Campaign", "Review"],
        ].map(([name, status], index) => (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3" key={name}>
            <span className="grid size-6 place-items-center rounded-md bg-[rgba(var(--service-accent-rgb),0.09)] text-[9px] font-black text-[var(--service-accent-soft)]">
              0{index + 1}
            </span>
            <p className="mt-3 text-[10px] font-semibold text-white/70">{name}</p>
            <p className="mt-1 text-[8px] text-white/30">{status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RealtimeTtsVisual() {
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-white/[0.08] bg-[#090d15] p-4 sm:p-5">
        <div className="flex items-center justify-between text-[9px]">
          <span className="font-bold uppercase tracking-[0.12em] text-white/28">Stream timeline</span>
          <span className="font-semibold text-[var(--service-accent-soft)]">First audio · 186ms</span>
        </div>
        <div className="mt-7 flex h-28 items-end gap-1.5">
          {streamBars.map((height, index) => (
            <span className="product-stream-bar flex-1 rounded-t-sm bg-[rgba(var(--service-accent-rgb),0.55)]" key={`${height}-${index}`} style={{ height: `${height}%`, animationDelay: `${index * -80}ms` }} />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[8px] text-white/24">
          <span>Text received</span><span>Playback started</span><span>Streaming</span>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(var(--service-accent-rgb),0.15)] bg-[rgba(var(--service-accent-rgb),0.045)] p-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.11em] text-[var(--service-accent-soft)]">Now speaking</p>
        <p className="mt-2 text-xs leading-5 text-white/64">
          “I found your order. It is scheduled to arrive tomorrow between…”
          <span className="ml-1 inline-block h-3 w-px animate-pulse bg-[var(--service-accent)] align-middle" />
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[["24 kHz", "Audio"], ["0", "Underruns"], ["1.0×", "Pace"]].map(([value, label]) => (
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] py-2.5" key={label}>
            <strong className="block text-[10px] text-white/72">{value}</strong><span className="mt-0.5 block text-[8px] text-white/26">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MultilingualVisual() {
  const languages = [
    ["EN", "English", "Active"],
    ["HI", "हिन्दी", "Ready"],
    ["ES", "Español", "Ready"],
    ["FR", "Français", "Ready"],
    ["DE", "Deutsch", "Review"],
    ["JA", "日本語", "Review"],
  ];

  return (
    <div className="relative">
      <div className="product-language-orbit pointer-events-none absolute left-1/2 top-28 size-52 -translate-x-1/2 rounded-full border border-[rgba(var(--service-accent-rgb),0.12)]" />
      <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-3">
        {languages.map(([code, language, status], index) => (
          <div className={`rounded-xl border p-3.5 ${index === 0 ? "border-[rgba(var(--service-accent-rgb),0.3)] bg-[rgba(var(--service-accent-rgb),0.09)]" : "border-white/[0.07] bg-[#0b0e15]"}`} key={code}>
            <div className="flex items-center justify-between">
              <span className="grid size-7 place-items-center rounded-md bg-white/[0.05] text-[9px] font-black text-[var(--service-accent-soft)]">{code}</span>
              <span className={`size-1.5 rounded-full ${status === "Review" ? "bg-amber-300" : "bg-emerald-300"}`} />
            </div>
            <p className="mt-3 text-[11px] font-semibold text-white/72">{language}</p>
            <p className="mt-1 text-[8px] text-white/28">{status}</p>
          </div>
        ))}
      </div>
      <div className="relative mt-4 rounded-xl border border-white/[0.08] bg-[#0b0e15] p-4">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black text-[var(--service-accent-soft)]">EN</span>
          <span className="h-px flex-1 bg-[linear-gradient(90deg,var(--service-accent),var(--service-secondary))]" />
          <span className="text-[9px] font-black text-[var(--service-secondary)]">HI</span>
        </div>
        <p className="mt-3 text-[10px] leading-5 text-white/48">Brand terms preserved · Dates localized · Voice matched</p>
      </div>
    </div>
  );
}

function ApiVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#060911] font-mono">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="size-2 rounded-full bg-[#ff6b6b]/75" /><span className="size-2 rounded-full bg-[#f6db75]/75" /><span className="size-2 rounded-full bg-[#5eead4]/75" />
        <span className="ml-auto text-[8px] text-white/24">request.ts</span>
      </div>
      <div className="p-4 text-[10px] leading-6 sm:p-5 sm:text-[11px]">
        <p><span className="text-[#ff9fb7]">const</span> <span className="text-[#8dd7ff]">speech</span> <span className="text-white/42">=</span> <span className="text-[#ff9fb7]">await</span> <span className="text-white/74">vozon.voice.create</span><span className="text-white/42">{"({"}</span></p>
        <p className="pl-5"><span className="text-[#b8a9ff]">voice</span><span className="text-white/42">:</span> <span className="text-[#f6db75]">&quot;maya_support&quot;</span><span className="text-white/42">,</span></p>
        <p className="pl-5"><span className="text-[#b8a9ff]">text</span><span className="text-white/42">:</span> <span className="text-[#f6db75]">&quot;Your booking is confirmed.&quot;</span><span className="text-white/42">,</span></p>
        <p className="pl-5"><span className="text-[#b8a9ff]">stream</span><span className="text-white/42">:</span> <span className="text-[#5eead4]">true</span></p>
        <p className="text-white/42">{"});"}</p>
      </div>
      <div className="border-t border-white/[0.07] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-[9px] font-bold text-emerald-300"><StatusDot /> 200 OK</span>
          <span className="text-[9px] text-white/28">req_7fd28 · 214ms</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[["auth", "verified"], ["audio", "streaming"], ["event", "delivered"]].map(([key, value]) => (
            <div className="rounded-lg border border-white/[0.06] bg-black/20 p-2.5" key={key}>
              <p className="text-[8px] text-white/25">{key}</p><p className="mt-1 text-[8px] text-[var(--service-accent-soft)]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamWorkflowVisual() {
  const stages = [
    { title: "Draft", items: ["Greeting updated", "CRM fields mapped"] },
    { title: "Review", items: ["Policy checked", "Handoff tested"] },
    { title: "Approval", items: ["Final sign-off"] },
  ];

  return (
    <div className="grid min-h-[350px] grid-cols-1 gap-3 sm:grid-cols-3">
      {stages.map((stage, stageIndex) => (
        <div className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 sm:p-3.5" key={stage.title}>
          <div className="flex min-w-0 items-center justify-between gap-2">
            <p className="min-w-0 break-words text-[9px] font-bold uppercase tracking-[0.1em] text-white/42">{stage.title}</p>
            <span className="shrink-0 rounded-full bg-white/[0.05] px-1.5 py-0.5 text-[7px] text-white/30">{stage.items.length}</span>
          </div>
          <div className="mt-3 grid gap-2.5 sm:mt-4">
            {stage.items.map((item, itemIndex) => (
              <div className="min-w-0 rounded-lg border border-white/[0.07] bg-[#0b0e15] p-3" key={item}>
                <span className="block h-1 w-8 rounded-full" style={{ background: stageIndex === 0 ? "var(--service-secondary)" : stageIndex === 1 ? "var(--service-tertiary)" : "var(--service-accent)" }} />
                <p className="mt-3 whitespace-normal break-words text-[10px] font-semibold leading-4 text-white/68">{item}</p>
                <div className="mt-3 flex -space-x-1">
                  {[0, 1].slice(0, itemIndex + 1).map((avatar) => <span className="size-4 rounded-full border border-[#0b0e15] bg-white/10" key={avatar} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="col-span-1 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgba(var(--service-accent-rgb),0.14)] bg-[rgba(var(--service-accent-rgb),0.05)] px-4 py-3 sm:col-span-3">
        <div className="min-w-0"><p className="text-[9px] font-bold leading-4 text-[var(--service-accent-soft)]">2 of 3 reviewers approved</p><p className="mt-1 text-[8px] leading-3 text-white/32">Final review before production</p></div>
        <span className="rounded-lg bg-[var(--service-accent)] px-3 py-2 text-[8px] font-black text-[#06100d]">REVIEW</span>
      </div>
    </div>
  );
}

function SpeechAnalyticsVisual() {
  const chart = [38, 52, 46, 70, 58, 82, 74, 91, 76, 88, 68, 96];
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-[9px] uppercase tracking-[0.11em] text-white/28">Resolved calls</p><p className="mt-1 text-2xl font-semibold text-white">78.4%</p></div>
          <span className="text-[9px] font-bold text-emerald-300">+12.6%</span>
        </div>
        <div className="mt-6 flex h-28 items-end gap-2">
          {chart.map((height, index) => <span className="flex-1 rounded-t-sm bg-[linear-gradient(to_top,rgba(var(--service-accent-rgb),0.22),var(--service-accent))]" key={index} style={{ height: `${height}%`, opacity: 0.55 + index * 0.035 }} />)}
        </div>
        <div className="mt-2 flex justify-between text-[8px] text-white/20"><span>Week 1</span><span>Week 4</span></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[["Delivery delay", "31%"], ["Refund status", "24%"], ["Wrong item", "16%"]].map(([topic, value], index) => (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3" key={topic}>
            <span className="text-[8px] text-white/24">0{index + 1}</span><strong className="mt-2 block text-[10px] text-white/66">{value}</strong><p className="mt-1 text-[8px] leading-3 text-white/28">{topic}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SentimentVisual() {
  const segments = [
    { label: "Neutral", width: "24%", color: "#8dd7ff" },
    { label: "Concern", width: "30%", color: "#f6db75" },
    { label: "Frustration", width: "46%", color: "#ff9f8f" },
  ];
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
        <div className="flex items-center justify-between"><p className="text-[9px] font-bold uppercase tracking-[0.11em] text-white/28">Signal over time</p><span className="text-[9px] font-bold text-[var(--service-accent-soft)]">Escalation suggested</span></div>
        <div className="mt-8 flex h-3 overflow-hidden rounded-full bg-white/[0.04]">
          {segments.map((segment) => <span key={segment.label} style={{ background: segment.color, width: segment.width }} />)}
        </div>
        <div className="mt-3 flex justify-between">
          {segments.map((segment) => <span className="text-[8px] text-white/30" key={segment.label}>{segment.label}</span>)}
        </div>
        <div className="relative mt-8 h-24 border-b border-l border-white/[0.08]">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 100">
            <defs><linearGradient id="sentiment-line" x1="0" x2="1"><stop stopColor="#8dd7ff" /><stop offset=".55" stopColor="#f6db75" /><stop offset="1" stopColor="#ff9f8f" /></linearGradient></defs>
            <path d="M0 72 C45 68,65 74,95 61 S145 50,178 57 S230 68,252 40 S315 55,340 25 S375 19,400 10" fill="none" stroke="url(#sentiment-line)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-[rgba(var(--service-accent-rgb),0.2)] bg-[rgba(var(--service-accent-rgb),0.055)] p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[rgba(var(--service-accent-rgb),0.12)] text-sm text-[var(--service-accent-soft)]">!</span>
        <div><p className="text-[10px] font-semibold text-white/72">Repeated-contact phrase detected</p><p className="mt-1 text-[8px] text-white/30">Route: Priority support · Context attached</p></div>
      </div>
    </div>
  );
}

function ConversationInsightsVisual() {
  const themes = [
    { label: "Weekend delivery", count: "38 calls", size: "col-span-2", color: "var(--service-accent)" },
    { label: "Plan changes", count: "24 calls", size: "", color: "var(--service-secondary)" },
    { label: "Setup help", count: "19 calls", size: "", color: "var(--service-tertiary)" },
    { label: "Invoice clarity", count: "16 calls", size: "col-span-2", color: "#f6db75" },
  ];
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-2.5">
        {themes.map((theme, index) => (
          <div className={`${theme.size} group min-h-28 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3.5`} key={theme.label}>
            <div className="flex items-center justify-between"><span className="size-2 rounded-full" style={{ background: theme.color, boxShadow: `0 0 16px ${theme.color}` }} /><span className="text-[8px] text-white/22">0{index + 1}</span></div>
            <p className="mt-5 text-[10px] font-semibold text-white/68 sm:text-[11px]">{theme.label}</p><p className="mt-1 text-[8px] text-white/28">{theme.count}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between"><p className="text-[9px] text-white/30">Emerging pattern</p><span className="text-[9px] font-bold text-emerald-300">2.4× increase</span></div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.04]"><span className="block h-full w-[76%] rounded-full bg-[linear-gradient(90deg,var(--service-secondary),var(--service-accent))]" /></div>
      </div>
    </div>
  );
}

function QualityControlsVisual() {
  const checks = [
    ["Knowledge scope", "Passed"],
    ["Restricted actions", "Passed"],
    ["Human handoff", "Passed"],
    ["Adversarial set", "48 / 50"],
  ];
  return (
    <div className="grid gap-3">
      {checks.map(([label, status], index) => (
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 sm:p-4" key={label}>
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-[rgba(var(--service-accent-rgb),0.2)] bg-[rgba(var(--service-accent-rgb),0.08)] text-xs font-bold text-[var(--service-accent-soft)]">✓</span>
          <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold text-white/68">{label}</p><div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]"><span className="block h-full rounded-full bg-[var(--service-accent)]" style={{ width: index === 3 ? "96%" : "100%" }} /></div></div>
          <span className="text-[8px] font-bold text-emerald-300">{status}</span>
        </div>
      ))}
      <div className="mt-1 flex items-center justify-between rounded-xl border border-[rgba(var(--service-tertiary-rgb),0.18)] bg-[rgba(var(--service-tertiary-rgb),0.05)] p-4">
        <div><p className="text-[10px] font-semibold text-white/72">Release recommendation</p><p className="mt-1 text-[8px] text-white/30">2 edge cases assigned for review</p></div>
        <span className="rounded-lg bg-[var(--service-accent)] px-3 py-2 text-[8px] font-black text-[#06100d]">APPROVE</span>
      </div>
    </div>
  );
}

function ProductVisualBody({ slug }: { slug: string }) {
  if (slug === "voice-cloning") return <VoiceCloningVisual />;
  if (slug === "realtime-tts") return <RealtimeTtsVisual />;
  if (slug === "multilingual-speech") return <MultilingualVisual />;
  if (slug === "api-access") return <ApiVisual />;
  if (slug === "team-workflows") return <TeamWorkflowVisual />;
  if (slug === "speech-analytics") return <SpeechAnalyticsVisual />;
  if (slug === "sentiment-detection") return <SentimentVisual />;
  if (slug === "conversation-insights") return <ConversationInsightsVisual />;
  return <QualityControlsVisual />;
}

export function ProductServiceVisual({ slug, experience, design }: ProductServiceVisualProps) {
  return (
    <>
      <VisualShell design={design} footer={<ProofFooter experience={experience} />}>
        <ProductVisualBody slug={slug} />
      </VisualShell>
      <style>{`
        .product-visual-shell {
          isolation: isolate;
          background:
           #000000;
        }

        .product-visual-sheen {
          z-index: -1;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: linear-gradient(to bottom, black, transparent 82%);
        }

        .product-visual-live {
          animation: product-visual-live 1.5s ease-in-out infinite;
          box-shadow: 0 0 12px rgba(var(--service-accent-rgb), 0.8);
        }

        .product-voice-bar,
        .product-stream-bar {
          transform-origin: center;
          animation: product-visual-wave 0.8s ease-in-out infinite alternate;
        }

        .product-stream-bar {
          animation-duration: 1.2s;
        }

        .product-language-orbit {
          box-shadow:
            0 0 0 34px rgba(var(--service-accent-rgb), 0.018),
            0 0 0 68px rgba(var(--service-secondary-rgb), 0.014);
        }

        @keyframes product-visual-live {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }

        @keyframes product-visual-wave {
          from { transform: scaleY(0.55); opacity: 0.55; }
          to { transform: scaleY(1); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-visual-shell *,
          .product-visual-shell *::before,
          .product-visual-shell *::after {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
