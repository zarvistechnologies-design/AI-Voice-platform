"use client";

import { useMemo, useState, type CSSProperties } from "react";

import {
  estimatedModelCostPerMinute,
  formatEstimatedMinuteCost,
  minutePricingAssumptions,
  modelPricingCategories,
  type ModelPriceCategory,
} from "@/config/modelPricing";

type StackLayer = Extract<ModelPriceCategory["id"], "llm" | "stt" | "tts">;

const layers: readonly { id: StackLayer; label: string; helper: string; accent: string }[] = [
  { id: "llm", label: "Language model (LLM)", helper: "Understands and responds", accent: "#118778" },
  { id: "stt", label: "Speech to text (STT)", helper: "Transcribes the caller", accent: "#d95d88" },
  { id: "tts", label: "Text to speech (TTS)", helper: "Generates the agent voice", accent: "#c58a25" },
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

function LayerIcon({ layer }: { layer: StackLayer }) {
  if (layer === "llm") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5.2A3.4 3.4 0 0 0 4.5 8.4a3.3 3.3 0 0 0 .7 5.3A3.5 3.5 0 0 0 9 18.8c1.2-.1 2.2-.8 3-1.8V7c-.8-1-1.8-1.7-3-1.8ZM15 5.2a3.4 3.4 0 0 1 4.5 3.2 3.3 3.3 0 0 1-.7 5.3 3.5 3.5 0 0 1-3.8 5.1c-1.2-.1-2.2-.8-3-1.8V7c.8-1 1.8-1.7 3-1.8Z"/><path d="M9 10h3m0 0h3m-3 0v7M7.2 13h1.3m8.3 0h-1.3"/></svg>;
  if (layer === "stt") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v4m-3 0h6"/></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 12h2m3-5v10m4-14v18m4-14v10m3-5h2"/></svg>;
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
    <label className="pricing-model-dropdown group">
      <span className="pricing-model-label">
        <span className={`pricing-model-icon ${layer.id}`}><LayerIcon layer={layer.id} /></span>
        <span>
          <span className="block text-sm font-semibold">{layer.label}</span>
          <span className="mt-1 block text-[13px]">{layer.helper}</span>
        </span>
        <span className="pricing-stack-rate rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ "--stack-accent": layer.accent } as CSSProperties}>
          {formatEstimatedMinuteCost(estimate)}
        </span>
      </span>

      <span className="relative block">
        <select
          className="h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-11 text-sm font-semibold text-[#17233a] outline-none transition"
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
        <svg className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#355064]" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      </span>

      <span className="pricing-model-provider">
        <span className="truncate">◉ &nbsp;{selected.provider.name}</span>
        <span className="text-right">{selected.model.rate}</span>
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
    <div className="pricing-stack-card mt-10">
      <div className="pricing-stack-subtotal">
        <span className="pricing-stack-layers" aria-hidden="true">▱</span>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-[#0e6f62]">Model stack subtotal</span>
          <strong>{formatEstimatedMinuteCost(total)}</strong>
          <small>Updated instantly as you make changes</small>
        </div>
      </div>

      <div className="pricing-model-grid">
        {layers.map((layer) => (
          <ModelDropdown
            key={layer.id}
            layer={layer}
            value={selection[layer.id]}
            onChange={(value) => setSelection((current) => ({ ...current, [layer.id]: value }))}
          />
        ))}
      </div>

      <div className="pricing-stack-summary">
        <div className="pricing-stack-total"><span>↗</span><div><small>Combined cost per minute</small><strong>{formatEstimatedMinuteCost(total)}</strong><em>All selected providers combined</em></div></div>
        <div className="pricing-stack-benefits">
          <span>Transparent provider costs</span><span>Update in real time</span><span>Mix and match the best models</span><span>Scale from prototype to production</span>
        </div>
        <div className="pricing-stack-assumptions"><strong>▤ &nbsp; Cost estimate details</strong><p>Estimate assumes {minutePricingAssumptions.llmInputTokens.toLocaleString()} LLM input and {minutePricingAssumptions.llmOutputTokens.toLocaleString()} output tokens, plus about {minutePricingAssumptions.ttsCharacters} spoken characters per connected minute. INR rates use an indicative ₹{minutePricingAssumptions.inrPerUsd}/USD conversion. Platform, telephony, taxes, cached context, and add-ons are not included.</p></div>
      </div>
    </div>
  );
}
