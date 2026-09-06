"use client";

import type {
  WhiteLabelModelAccess,
  WhiteLabelModelCatalog,
  WhiteLabelModelCategory,
} from "@/lib/whiteLabel";

const categories: Array<{ key: WhiteLabelModelCategory; label: string; description: string }> = [
  { key: "stt", label: "STT models", description: "Speech-to-text models available in pipeline agents." },
  { key: "llm", label: "LLM and realtime models", description: "Language models plus native realtime voice models." },
  { key: "tts", label: "TTS models", description: "Text-to-speech models available in pipeline agents." },
];

export function ModelAccessPicker({
  catalog,
  value,
  onChange,
  disabled = false,
  tone = "dark",
}: {
  catalog: WhiteLabelModelCatalog;
  value: WhiteLabelModelAccess;
  onChange(value: WhiteLabelModelAccess): void;
  disabled?: boolean;
  tone?: "dark" | "light";
}) {
  function setCategory(category: WhiteLabelModelCategory, keys: string[]) {
    onChange({ ...value, [category]: keys });
  }

  return <div className="grid gap-4">
    {categories.map((category) => {
      const options = catalog[category.key] ?? [];
      const selected = new Set(value[category.key] ?? []);
      return <section className={`rounded-xl border p-4 ${tone === "light" ? "border-[#dce7e3] bg-[#f8fbfa]" : "border-white/[0.08] bg-black/20"}`} key={category.key}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h4 className={`text-sm font-black ${tone === "light" ? "text-[#29423b]" : "text-white"}`}>{category.label}</h4><p className={`mt-1 text-xs ${tone === "light" ? "text-[#71817d]" : "text-white/40"}`}>{category.description}</p></div>
          <div className="flex gap-2"><button className={`text-xs font-bold disabled:opacity-40 ${tone === "light" ? "text-[#118778]" : "text-[var(--brand-accent)]"}`} disabled={disabled} onClick={() => setCategory(category.key, options.map((item) => item.key))} type="button">Select all</button><button className={`text-xs font-bold disabled:opacity-40 ${tone === "light" ? "text-[#71817d]" : "text-white/45"}`} disabled={disabled} onClick={() => setCategory(category.key, [])} type="button">Clear</button></div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {options.map((option) => <label className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-xs ${tone === "light" ? "border-[#dfe7e4] bg-white text-[#60716c]" : "border-white/[0.07] bg-white/[0.025] text-white/65"}`} key={option.key}><input checked={selected.has(option.key)} className="mt-0.5 accent-[var(--brand-primary)]" disabled={disabled} onChange={(event) => setCategory(category.key, event.target.checked ? [...selected, option.key] : [...selected].filter((key) => key !== option.key))} type="checkbox" /><span><strong className={`block ${tone === "light" ? "text-[#29423b]" : "text-white/80"}`}>{option.model}</strong><span className={`mt-1 block capitalize ${tone === "light" ? "text-[#84938f]" : "text-white/35"}`}>{option.provider}{option.kind === "realtime" ? " · realtime" : ""}</span></span></label>)}
          {!options.length ? <p className={`text-xs ${tone === "light" ? "text-[#946816]" : "text-amber-200/70"}`}>No configured models are available in this category.</p> : null}
        </div>
      </section>;
    })}
  </div>;
}
