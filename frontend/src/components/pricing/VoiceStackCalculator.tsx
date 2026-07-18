"use client";

import { useMemo, useState } from "react";

import {
  estimatedModelCostPerMinute,
  formatEstimatedMinuteCost,
  minutePricingAssumptions,
  modelPricingCategories,
  type ModelPriceCategory,
} from "@/config/modelPricing";

type StackLayer = Extract<ModelPriceCategory["id"], "llm" | "stt" | "tts">;

const layers: readonly { id: StackLayer; label: string; helper: string; accent: string }[] = [
  { id: "llm", label: "Language model (LLM)", helper: "Understands and responds", accent: "#45ddce" },
  { id: "stt", label: "Speech to text (STT)", helper: "Transcribes the caller", accent: "#67e8f9" },
  { id: "tts", label: "Text to speech (TTS)", helper: "Generates the agent voice", accent: "#a78bfa" },
] as const;

const defaults: Record<StackLayer, string> = {
  llm: "OpenAI::gpt-4.1-mini",
  stt: "OpenAI::gpt-4o-mini-transcribe",
  tts: "OpenAI::gpt-4o-mini-tts",
};

function categoryById(id: StackLayer) {
  return modelPricingCategories.find((category) => category.id === id)!;
}

function selectedModel(layer: StackLayer, value: string) {
  const category = categoryById(layer);
  for (const provider of category.providers) {
    const model = provider.models.find((item) => `${provider.name}::${item.name}` === value);
    if (model) return { provider, model };
  }
  return { provider: category.providers[0], model: category.providers[0].models[0] };
}

function ModelDropdown({
  layer,
  value,
  onChange,
}: {
  layer: (typeof layers)[number];
  value: string;
  onChange: (value: string) => void;
}) {
  const category = categoryById(layer.id);
  const selected = selectedModel(layer.id, value);
  const estimate = estimatedModelCostPerMinute(layer.id, selected.model);

  return (
    <label className="group grid gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 transition focus-within:border-white/25 sm:p-5">
      <span className="flex items-start justify-between gap-4">
        <span>
          <span className="block text-sm font-semibold text-white/80">{layer.label}</span>
          <span className="mt-1 block text-[11px] text-white/35">{layer.helper}</span>
        </span>
        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundColor: `${layer.accent}14`, color: layer.accent }}>
          {formatEstimatedMinuteCost(estimate)}
        </span>
      </span>

      <span className="relative block">
        <select
          className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-[#020b09] px-4 pr-11 text-sm font-semibold text-white outline-none transition hover:border-white/20 focus:border-[#45ddce]/50"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {category.providers.map((provider) => (
            <optgroup label={provider.name} key={provider.name}>
              {provider.models.map((model) => {
                const modelEstimate = estimatedModelCostPerMinute(layer.id, model);
                return (
                  <option value={`${provider.name}::${model.name}`} key={model.name}>
                    {model.name} — {formatEstimatedMinuteCost(modelEstimate)}
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/40" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      </span>

      <span className="flex items-center justify-between gap-3 text-[11px]">
        <span className="truncate text-white/35">{selected.provider.name}</span>
        <span className="text-right text-white/50">{selected.model.rate}</span>
      </span>
    </label>
  );
}

export function VoiceStackCalculator() {
  const [selection, setSelection] = useState<Record<StackLayer, string>>(defaults);

  const breakdown = useMemo(
    () =>
      layers.map((layer) => {
        const selected = selectedModel(layer.id, selection[layer.id]);
        return {
          ...layer,
          ...selected,
          cost: estimatedModelCostPerMinute(layer.id, selected.model),
        };
      }),
    [selection],
  );

  const total = breakdown.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="mt-10 overflow-hidden rounded-[24px] border border-[#67e8f9]/15 bg-[radial-gradient(circle_at_95%_0%,rgba(139,92,246,0.14),transparent_32%),linear-gradient(145deg,#07110f,#050908)] shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
      <div className="grid gap-5 border-b border-white/10 px-5 py-6 sm:px-7 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#f6c76e]">Build your voice stack</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.025em]">LLM + STT + TTS cost per minute</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">Open each dropdown, choose a model, and see the combined provider cost instantly.</p>
        </div>
        <div className="rounded-2xl border border-[#45ddce]/20 bg-[#45ddce]/[0.07] px-5 py-4 text-left lg:min-w-56 lg:text-right">
          <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-[#75fff0]/65">Model stack subtotal</span>
          <strong className="mt-1 block text-3xl font-semibold tracking-[-0.04em] text-[#9ffaf1]">{formatEstimatedMinuteCost(total)}</strong>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:p-7 lg:grid-cols-3">
        {layers.map((layer) => (
          <ModelDropdown
            key={layer.id}
            layer={layer}
            value={selection[layer.id]}
            onChange={(value) => setSelection((current) => ({ ...current, [layer.id]: value }))}
          />
        ))}
      </div>

      <div className="grid gap-5 border-t border-white/10 bg-black/20 px-5 py-5 sm:px-7 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid gap-2">
          {breakdown.map((item) => (
            <div className="flex items-center justify-between gap-5 text-xs" key={item.id}>
              <span className="flex min-w-0 items-center gap-2 text-white/45">
                <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.accent }} aria-hidden="true" />
                <span className="truncate">{item.model.name}</span>
              </span>
              <strong className="shrink-0 text-white/70">{formatEstimatedMinuteCost(item.cost)}</strong>
            </div>
          ))}
        </div>
        <p className="text-[11px] leading-5 text-white/35">
          Estimate assumes {minutePricingAssumptions.llmInputTokens.toLocaleString()} LLM input and {minutePricingAssumptions.llmOutputTokens.toLocaleString()} output tokens, plus about {minutePricingAssumptions.ttsCharacters} spoken characters per connected minute. INR rates use an indicative ₹{minutePricingAssumptions.inrPerUsd}/USD conversion. Platform, telephony, taxes, cached context, and add-ons are not included.
        </p>
      </div>
    </div>
  );
}
