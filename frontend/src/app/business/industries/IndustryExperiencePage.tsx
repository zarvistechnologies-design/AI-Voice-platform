import {
  SolutionExperienceTemplate,
  type SolutionFaq,
} from "@/components/layout/SolutionExperienceTemplate";

type Industry = {
  title: string;
  summary: string;
  highlights: readonly string[];
  sections: ReadonlyArray<{ readonly title: string; readonly body: string }>;
};

export type IndustryExperiencePreset = {
  accent: string;
  accentSoft: string;
  logos: string[];
  photoCards: Array<{ title: string; image: string }>;
  workflows: Array<{
    eyebrow: string;
    title: string;
    button: string;
    visual: "routing" | "ivr" | "calendar";
    image?: string;
    reverse?: boolean;
    points: Array<{ title: string; body: string }>;
  }>;
  integrations: string[];
  faqs: string[];
  reviewBenefits: Array<{ title: string; body: string }>;
  quote: {
    primary: string;
    primaryName: string;
    primaryRole: string;
    secondary: string;
    secondaryName: string;
    secondaryRole: string;
  };
};

function answerIndustryFaq(question: string, industry: Industry) {
  const topic = industry.title.toLowerCase();
  const normalized = question.toLowerCase();

  if (normalized.includes("integrat") || normalized.includes("sync") || normalized.includes("tool")) {
    return `Supported integrations, APIs, and webhooks can send structured call outcomes, summaries, and follow-up tasks into the systems your ${topic} team already uses.`;
  }
  if (normalized.includes("route") || normalized.includes("dispatch") || normalized.includes("advisor")) {
    return "Routing can use the caller's intent, location, urgency, account context, and team availability. Human recipients can receive the details collected before transfer.";
  }
  if (normalized.includes("sensitive") || normalized.includes("licensed") || normalized.includes("policy")) {
    return `Your team controls approved information, permitted actions, and escalation rules. The final ${topic} workflow should be reviewed against the privacy, compliance, and operating requirements that apply to your organization.`;
  }
  if (normalized.includes("reminder") || normalized.includes("outbound") || normalized.includes("renewal")) {
    return "Outbound workflows can follow approved scripts, calling windows, retry rules, and opt-out handling, while recording a clear disposition for staff follow-up.";
  }
  if (normalized.includes("status") || normalized.includes("delivery")) {
    return "When connected to an approved data source, the agent can provide current status, capture exceptions, and route time-sensitive issues to the appropriate operations team.";
  }
  return `AI voice agents can handle repeatable ${topic} calls, collect structured context, complete approved actions, and transfer conversations that require human judgment.`;
}

export function IndustryExperiencePage({ industry, preset }: { industry: Industry; preset: IndustryExperiencePreset }) {
  const faqs: SolutionFaq[] = preset.faqs.map((question) => ({ question, answer: answerIndustryFaq(question, industry) }));

  return (
    <SolutionExperienceTemplate
      content={{
        id: `industry-${industry.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        category: `AI voice agents for ${industry.title}`,
        title: industry.title,
        summary: industry.summary,
        heroImage: preset.photoCards[0].image,
        heroAlt: `${industry.title} team supporting a customer workflow`,
        highlights: industry.highlights,
        showcase: preset.photoCards.map((card, index) => ({
          title: card.title,
          body: industry.sections[index % industry.sections.length]?.body ?? industry.summary,
          image: card.image,
        })),
        capabilities: preset.workflows.map((workflow) => ({
          eyebrow: workflow.eyebrow,
          title: workflow.title,
          body: workflow.points.map((point) => point.body).join(" "),
          points: workflow.points.map((point) => point.title),
        })),
        journey: preset.workflows.map((workflow) => ({ title: workflow.eyebrow, body: workflow.title })),
        integrations: preset.integrations,
        faqs,
        proof: [
          { value: "24/7", label: `${industry.title} call coverage` },
          { value: "Clear", label: "Structured call outcomes" },
          { value: "Human", label: "Handoffs for exceptions" },
        ],
        reviews: [
          { quote: preset.quote.primary, name: preset.quote.primaryName, role: preset.quote.primaryRole },
          { quote: preset.quote.secondary, name: preset.quote.secondaryName, role: preset.quote.secondaryRole },
        ],
      }}
    />
  );
}
