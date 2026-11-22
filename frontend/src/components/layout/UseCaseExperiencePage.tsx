import { SolutionExperienceTemplate } from "@/components/layout/SolutionExperienceTemplate";
import type { UseCaseExperience } from "@/config/useCaseExperiences";

type BusinessUseCase = {
  slug: string;
  title: string;
  summary: string;
  highlights: readonly string[];
  sections: ReadonlyArray<{ title: string; body: string }>;
};

const useCaseHeroImages: Record<string, string> = {
  "lead-qualification": "/images/usecaseimages/lead_1.png",
  "customer-support": "/images/usecaseimages/customer_support_1.png",
  receptionists: "/images/usecaseimages/receptionist_1.png",
  "dispatch-service": "/images/usecaseimages/dispatch_1.png",
};

export function UseCaseExperiencePage({ business, experience }: { business: BusinessUseCase; experience: UseCaseExperience }) {
  return (
    <SolutionExperienceTemplate
      content={{
        id: `use-case-${business.slug}`,
        category: experience.label,
        title: business.title,
        summary: business.summary,
        heroImage: useCaseHeroImages[business.slug] ?? "/images/ai_voice.png",
        heroAlt: `${business.title} team using an AI voice workflow`,
        highlights: business.highlights,
        showcase: experience.scenarios.map((scenario) => ({
          title: scenario.title,
          body: scenario.body,
          outcome: scenario.outcome,
        })),
        capabilities: experience.capabilities,
        journey: experience.workflow,
        integrations: experience.integrations,
        faqs: experience.faqs,
        proof: experience.proof,
      }}
    />
  );
}
