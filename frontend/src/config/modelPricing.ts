export type ModelPrice = {
  name: string;
  rate: string;
  unit: string;
  detail?: string;
  badge?: "Recommended" | "Preview" | "Legacy";
};

export type ModelPriceProvider = {
  name: string;
  shortName: string;
  accent: string;
  sourceUrl: string;
  models: readonly ModelPrice[];
};

export type ModelPriceCategory = {
  id: "llm" | "stt" | "tts" | "realtime";
  label: string;
  eyebrow: string;
  description: string;
  providers: readonly ModelPriceProvider[];
};

const pricedModels = (
  names: readonly string[],
  rate: string,
  unit: string,
  options: Pick<ModelPrice, "detail" | "badge"> = {},
): ModelPrice[] => names.map((name) => ({ name, rate, unit, ...options }));

const OPENAI_PRICING = "https://developers.openai.com/api/docs/pricing";
const GEMINI_PRICING = "https://ai.google.dev/gemini-api/docs/pricing";
const SARVAM_PRICING = "https://docs.sarvam.ai/api/getting-started/pricing";
const ELEVENLABS_PRICING = "https://elevenlabs.io/pricing/api";
const DEEPGRAM_PRICING = "https://deepgram.com/pricing";

export const modelPricingCategories: readonly ModelPriceCategory[] = [
  {
    id: "llm",
    label: "Language models",
    eyebrow: "Reasoning and responses",
    description: "Standard text-token rates for the language models available when building a pipeline agent.",
    providers: [
      {
        name: "OpenAI",
        shortName: "OA",
        accent: "#45ddce",
        sourceUrl: OPENAI_PRICING,
        models: [
          { name: "gpt-5.4", rate: "$2.50 in · $15.00 out", unit: "per 1M tokens", badge: "Recommended" },
          { name: "gpt-5.3-chat-latest", rate: "$1.75 in · $14.00 out", unit: "per 1M tokens", badge: "Legacy" },
          { name: "gpt-5.2", rate: "$1.75 in · $14.00 out", unit: "per 1M tokens" },
          { name: "gpt-5.2-chat-latest", rate: "$1.75 in · $14.00 out", unit: "per 1M tokens", badge: "Legacy" },
          { name: "gpt-5.1", rate: "$1.25 in · $10.00 out", unit: "per 1M tokens" },
          { name: "gpt-5.1-chat-latest", rate: "$1.25 in · $10.00 out", unit: "per 1M tokens" },
          { name: "gpt-5", rate: "$1.25 in · $10.00 out", unit: "per 1M tokens" },
          { name: "gpt-5-mini", rate: "$0.25 in · $2.00 out", unit: "per 1M tokens" },
          { name: "gpt-5-nano", rate: "$0.05 in · $0.40 out", unit: "per 1M tokens" },
          { name: "gpt-4.1", rate: "$2.00 in · $8.00 out", unit: "per 1M tokens" },
          { name: "gpt-4.1-mini", rate: "$0.40 in · $1.60 out", unit: "per 1M tokens", badge: "Recommended" },
          { name: "gpt-4.1-nano", rate: "$0.10 in · $0.40 out", unit: "per 1M tokens" },
          { name: "gpt-4o", rate: "$2.50 in · $10.00 out", unit: "per 1M tokens" },
          { name: "gpt-4o-mini", rate: "$0.15 in · $0.60 out", unit: "per 1M tokens" },
          { name: "gpt-4-turbo", rate: "$10.00 in · $30.00 out", unit: "per 1M tokens", badge: "Legacy" },
          { name: "gpt-4", rate: "$30.00 in · $60.00 out", unit: "per 1M tokens", badge: "Legacy" },
          { name: "gpt-3.5-turbo", rate: "$0.50 in · $1.50 out", unit: "per 1M tokens", badge: "Legacy" },
        ],
      },
      {
        name: "Google Gemini",
        shortName: "G",
        accent: "#67e8f9",
        sourceUrl: GEMINI_PRICING,
        models: [
          { name: "gemini-3.5-flash", rate: "$1.50 in · $9.00 out", unit: "per 1M tokens", badge: "Recommended" },
          { name: "gemini-3.1-pro-preview", rate: "$2.00 in · $12.00 out", unit: "per 1M tokens", detail: "Prompts up to 200K tokens", badge: "Preview" },
          { name: "gemini-3.1-flash-lite", rate: "$0.25 in · $1.50 out", unit: "per 1M tokens" },
          { name: "gemini-3-flash-preview", rate: "$0.50 in · $3.00 out", unit: "per 1M tokens", badge: "Preview" },
          { name: "gemini-2.5-flash", rate: "$0.30 in · $2.50 out", unit: "per 1M tokens", badge: "Recommended" },
          { name: "gemini-2.5-pro", rate: "$1.25 in · $10.00 out", unit: "per 1M tokens", detail: "Prompts up to 200K tokens" },
          { name: "gemini-2.5-flash-lite", rate: "$0.10 in · $0.40 out", unit: "per 1M tokens" },
          { name: "gemini-2.0-flash-001", rate: "$0.10 in · $0.40 out", unit: "per 1M tokens", badge: "Legacy" },
          { name: "gemini-2.0-flash", rate: "$0.10 in · $0.40 out", unit: "per 1M tokens", badge: "Legacy" },
          { name: "gemini-2.0-flash-lite", rate: "$0.075 in · $0.30 out", unit: "per 1M tokens", badge: "Legacy" },
          { name: "gemini-1.5-flash", rate: "$0.075 in · $0.30 out", unit: "per 1M tokens", badge: "Legacy" },
          { name: "gemini-1.5-pro", rate: "$1.25 in · $5.00 out", unit: "per 1M tokens", badge: "Legacy" },
        ],
      },
      {
        name: "Sarvam AI",
        shortName: "S",
        accent: "#f6c76e",
        sourceUrl: SARVAM_PRICING,
        models: [
          { name: "sarvam-30b", rate: "₹2.50 in · ₹10.00 out", unit: "per 1M tokens", badge: "Recommended" },
          { name: "sarvam-105b", rate: "₹4.00 in · ₹16.00 out", unit: "per 1M tokens" },
        ],
      },
    ],
  },
  {
    id: "stt",
    label: "Speech to text",
    eyebrow: "Live transcription",
    description: "Audio transcription rates. Per-hour rates are also shown as an easy-to-compare per-minute equivalent.",
    providers: [
      {
        name: "OpenAI",
        shortName: "OA",
        accent: "#45ddce",
        sourceUrl: OPENAI_PRICING,
        models: [
          { name: "gpt-4o-transcribe", rate: "$0.006", unit: "per audio minute" },
          { name: "gpt-4o-mini-transcribe", rate: "$0.003", unit: "per audio minute", badge: "Recommended" },
          { name: "gpt-realtime-whisper", rate: "$0.017", unit: "per audio minute" },
          { name: "whisper-1", rate: "$0.006", unit: "per audio minute", badge: "Legacy" },
        ],
      },
      {
        name: "Sarvam AI",
        shortName: "S",
        accent: "#f6c76e",
        sourceUrl: SARVAM_PRICING,
        models: [
          { name: "saaras:v3", rate: "₹0.50", unit: "per audio minute (₹30/hour)", detail: "Billed per second", badge: "Recommended" },
          { name: "saaras:v2.5", rate: "₹0.50", unit: "per audio minute (₹30/hour)", detail: "Billed per second", badge: "Legacy" },
          { name: "saarika:v2.5", rate: "₹0.50", unit: "per audio minute (₹30/hour)", detail: "Billed per second", badge: "Legacy" },
        ],
      },
      {
        name: "ElevenLabs",
        shortName: "11",
        accent: "#a78bfa",
        sourceUrl: ELEVENLABS_PRICING,
        models: [
          { name: "scribe_v2_realtime", rate: "$0.0065", unit: "per audio minute ($0.39/hour)", badge: "Recommended" },
          { name: "scribe_v2", rate: "$0.0037", unit: "per audio minute ($0.22/hour)" },
          { name: "scribe_v1", rate: "$0.0037", unit: "per audio minute ($0.22/hour)", badge: "Legacy" },
        ],
      },
      {
        name: "Deepgram",
        shortName: "DG",
        accent: "#39db8d",
        sourceUrl: DEEPGRAM_PRICING,
        models: [
          { name: "flux-general-en", rate: "$0.0065", unit: "per audio minute", badge: "Recommended" },
          { name: "flux-general-multi", rate: "$0.0078", unit: "per audio minute" },
          ...pricedModels(["nova-3", "nova-3-general", "nova-3-medical"], "from $0.0048", "per audio minute", { badge: "Recommended" }),
          ...pricedModels(
            [
              "nova-2-general", "nova-2-meeting", "nova-2-phonecall", "nova-2-finance",
              "nova-2-conversationalai", "nova-2-voicemail", "nova-2-video", "nova-2-medical",
              "nova-2-drivethru", "nova-2-automotive", "nova-general", "nova-phonecall", "nova-meeting",
            ],
            "$0.0058",
            "per audio minute",
            { badge: "Legacy" },
          ),
          ...pricedModels(
            ["enhanced-general", "enhanced-meeting", "enhanced-phonecall", "enhanced-finance"],
            "$0.0165",
            "per audio minute",
            { badge: "Legacy" },
          ),
          ...pricedModels(
            ["base", "meeting", "phonecall", "finance", "conversationalai", "voicemail", "video"],
            "$0.0145",
            "per audio minute",
            { badge: "Legacy" },
          ),
          ...pricedModels(
            ["whisper-tiny", "whisper-base", "whisper-small", "whisper-medium", "whisper-large"],
            "$0.0048",
            "per audio minute",
            { badge: "Legacy" },
          ),
        ],
      },
    ],
  },
  {
    id: "tts",
    label: "Text to speech",
    eyebrow: "Voice generation",
    description: "Voice-generation rates use the billing unit published by each provider: characters, audio tokens, or estimated minutes.",
    providers: [
      {
        name: "OpenAI",
        shortName: "OA",
        accent: "#45ddce",
        sourceUrl: OPENAI_PRICING,
        models: [
          { name: "gpt-4o-mini-tts", rate: "~$0.015", unit: "per generated minute", badge: "Recommended" },
          { name: "tts-1", rate: "$15.00", unit: "per 1M characters", badge: "Legacy" },
          { name: "tts-1-hd", rate: "$30.00", unit: "per 1M characters", badge: "Legacy" },
        ],
      },
      {
        name: "Google Gemini",
        shortName: "G",
        accent: "#67e8f9",
        sourceUrl: GEMINI_PRICING,
        models: [
          { name: "gemini-2.5-flash-preview-tts", rate: "$0.50 text in · $10.00 audio out", unit: "per 1M tokens", badge: "Preview" },
          { name: "gemini-3.1-flash-tts-preview", rate: "$1.00 text in · $20.00 audio out", unit: "per 1M tokens", badge: "Preview" },
          { name: "gemini-2.5-flash-tts", rate: "$0.50 text in · $10.00 audio out", unit: "per 1M tokens" },
          { name: "gemini-2.5-flash-lite-preview-tts", rate: "$0.50 text in · $10.00 audio out", unit: "per 1M tokens", badge: "Preview" },
          { name: "gemini-2.5-pro-tts", rate: "$1.00 text in · $20.00 audio out", unit: "per 1M tokens" },
          { name: "gemini-2.5-pro-preview-tts", rate: "$1.00 text in · $20.00 audio out", unit: "per 1M tokens", badge: "Preview" },
        ],
      },
      {
        name: "Sarvam AI",
        shortName: "S",
        accent: "#f6c76e",
        sourceUrl: SARVAM_PRICING,
        models: [
          { name: "bulbul:v3", rate: "₹30.00", unit: "per 10K characters", badge: "Recommended" },
          { name: "bulbul:v2", rate: "₹15.00", unit: "per 10K characters", badge: "Legacy" },
        ],
      },
      {
        name: "ElevenLabs",
        shortName: "11",
        accent: "#a78bfa",
        sourceUrl: ELEVENLABS_PRICING,
        models: [
          { name: "eleven_flash_v2_5", rate: "$0.05", unit: "per 1K characters", badge: "Recommended" },
          { name: "eleven_turbo_v2_5", rate: "$0.05", unit: "per 1K characters" },
          { name: "eleven_multilingual_v2", rate: "$0.10", unit: "per 1K characters" },
        ],
      },
    ],
  },
  {
    id: "realtime",
    label: "Realtime voice",
    eyebrow: "Native speech to speech",
    description: "Native audio models combine listening, reasoning, and speech generation. Audio input and output are metered separately.",
    providers: [
      {
        name: "OpenAI Realtime",
        shortName: "OA",
        accent: "#45ddce",
        sourceUrl: OPENAI_PRICING,
        models: [
          { name: "gpt-realtime-2.1", rate: "$32.00 audio in · $64.00 audio out", unit: "per 1M audio tokens", badge: "Recommended", detail: "$4.00 text in · $24.00 text out per 1M tokens" },
          { name: "gpt-realtime-2.1-mini", rate: "$10.00 audio in · $20.00 audio out", unit: "per 1M audio tokens", detail: "$0.60 text in · $2.40 text out per 1M tokens" },
        ],
      },
      {
        name: "Gemini Live",
        shortName: "G",
        accent: "#67e8f9",
        sourceUrl: GEMINI_PRICING,
        models: [
          { name: "gemini-3.1-flash-live-preview", rate: "~$0.005 audio in · ~$0.018 audio out", unit: "per audio minute", badge: "Recommended", detail: "Preview; token-based billing" },
          ...pricedModels(
            [
              "gemini-live-2.5-flash-native-audio",
              "gemini-2.5-flash-native-audio-preview-12-2025",
              "gemini-live-2.5-flash-preview-native-audio-09-2025",
              "gemini-live-2.5-flash-preview-native-audio",
            ],
            "$3.00 audio in · $12.00 audio out",
            "per 1M audio tokens",
            { badge: "Preview" },
          ),
        ],
      },
    ],
  },
] as const;

export const minutePricingAssumptions = {
  llmInputTokens: 1_000,
  llmOutputTokens: 300,
  ttsCharacters: 750,
  ttsTextTokens: 200,
  ttsAudioTokens: 1_500,
  realtimeAudioInputTokens: 600,
  realtimeAudioOutputTokens: 1_200,
  inrPerUsd: 96.33,
} as const;

function numericRates(rate: string) {
  return (rate.match(/[\d,.]+/g) ?? [])
    .map((value) => Number(value.replaceAll(",", "")))
    .filter(Number.isFinite);
}

export function estimatedModelCostPerMinute(categoryId: ModelPriceCategory["id"], model: ModelPrice) {
  const rates = numericRates(model.rate);
  if (!rates.length) return 0;

  const currencyDivisor = model.rate.includes("₹") ? minutePricingAssumptions.inrPerUsd : 1;

  if (categoryId === "llm") {
    const [inputRate = 0, outputRate = inputRate] = rates;
    return (
      (inputRate * minutePricingAssumptions.llmInputTokens +
        outputRate * minutePricingAssumptions.llmOutputTokens) /
      1_000_000 /
      currencyDivisor
    );
  }

  if (categoryId === "stt") return rates[0] / currencyDivisor;

  if (categoryId === "tts") {
    if (model.unit.includes("generated minute")) return rates[0] / currencyDivisor;
    if (model.unit.includes("1M characters")) {
      return (rates[0] * minutePricingAssumptions.ttsCharacters) / 1_000_000 / currencyDivisor;
    }
    if (model.unit.includes("10K characters")) {
      return (rates[0] * minutePricingAssumptions.ttsCharacters) / 10_000 / currencyDivisor;
    }
    if (model.unit.includes("1K characters")) {
      return (rates[0] * minutePricingAssumptions.ttsCharacters) / 1_000 / currencyDivisor;
    }
    if (model.unit.includes("1M tokens")) {
      const [textRate = 0, audioRate = textRate] = rates;
      return (
        (textRate * minutePricingAssumptions.ttsTextTokens +
          audioRate * minutePricingAssumptions.ttsAudioTokens) /
        1_000_000 /
        currencyDivisor
      );
    }
  }

  if (categoryId === "realtime") {
    const [inputRate = 0, outputRate = inputRate] = rates;
    if (model.unit.includes("audio minute")) return (inputRate + outputRate) / currencyDivisor;
    return (
      (inputRate * minutePricingAssumptions.realtimeAudioInputTokens +
        outputRate * minutePricingAssumptions.realtimeAudioOutputTokens) /
      1_000_000 /
      currencyDivisor
    );
  }

  return 0;
}

export function formatEstimatedMinuteCost(value: number) {
  const digits = value < 0.001 ? 5 : value < 0.1 ? 4 : 3;
  return `$${value.toFixed(digits)}/min`;
}
