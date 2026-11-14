import { SolutionLandingPage } from "@/components/layout/SolutionLandingPage";
import type { UseCaseExperience } from "@/config/useCaseExperiences";
import { useCaseOperations } from "@/config/useCaseOperations";

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

const useCaseHeadlines: Record<string, string> = {
  "lead-qualification": "Lead calls, turned into next steps.",
  "customer-support": "Support calls, handled with context.",
  receptionists: "Every caller gets a helpful first answer.",
  "dispatch-service": "Urgent calls, routed with clarity.",
};

const useCaseVideoHeadlines: Record<string, string> = {
  "lead-qualification": "One platform. Every lead conversation.",
  "customer-support": "One platform. Every support conversation.",
  receptionists: "One platform. Every front desk conversation.",
  "dispatch-service": "One platform. Every dispatch conversation.",
};

const useCaseLaunchHeadlines: Record<string, string> = {
  "lead-qualification": "Launch a lead qualification agent.",
  "customer-support": "Launch a customer support agent.",
  receptionists: "Launch an AI receptionist.",
  "dispatch-service": "Launch a dispatch voice agent.",
};

const useCaseFaqHeadlines: Record<string, string> = {
  "lead-qualification": "Questions about AI lead qualification.",
  "customer-support": "Questions about AI customer support.",
  receptionists: "Questions about AI receptionists.",
  "dispatch-service": "Questions about AI dispatch calls.",
};

const languageStories: Record<string, { title: string; body: string }> = {
  "lead-qualification": { title: "Qualify leads in the language they prefer.", body: "Configure the languages and voices your prospects use. Review product names, qualification questions, and sales handoffs before launch." },
  "customer-support": { title: "Make support easier across languages.", body: "Choose languages that fit your customer base. Test help content, account terms, and escalation wording so every caller understands the next step." },
  receptionists: { title: "Welcome callers in a familiar language.", body: "Set up the languages and greetings your front desk needs. Test names, locations, and transfer instructions with your team." },
  "dispatch-service": { title: "Keep dispatch instructions clear across regions.", body: "Support callers and field staff in the languages they use. Test addresses, local place names, and urgent handoff instructions before rollout." },
};

export function UseCaseExperiencePage({ business, experience }: { business: BusinessUseCase; experience: UseCaseExperience }) {
  return <SolutionLandingPage content={{
        ...useCaseOperations[business.slug],
        category: "Use Cases",
        title: business.title,
        headline: useCaseHeadlines[business.slug],
        videoHeadline: useCaseVideoHeadlines[business.slug],
        launchHeadline: useCaseLaunchHeadlines[business.slug],
        faqHeadline: useCaseFaqHeadlines[business.slug],
        summary: business.summary,
        heroImage: useCaseHeroImages[business.slug] ?? "/images/ai_voice.png",
        heroAlt: `${business.title} team using an AI voice workflow`,
        highlights: business.highlights,
        stories: [
          ...experience.capabilities.map((item) => ({ eyebrow: item.eyebrow, title: item.title, body: item.body, steps: item.points })),
          { eyebrow: "Next step", title: business.sections[1].title, body: business.sections[1].body, steps: experience.workflow.slice(0, 3).map((item) => item.title) },
          { eyebrow: "Language", ...languageStories[business.slug] },
        ],
        integrations: experience.integrations,
        faqs: experience.faqs,
        sample: { caller: experience.demo.caller, agent: experience.demo.agent, outcome: experience.demo.action },
      }} />;
}
