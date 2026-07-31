export type ProductPageDesign = {
  accent: string;
  accentSoft: string;
  accentRgb: string;
  secondary: string;
  secondaryRgb: string;
  tertiary: string;
  tertiaryRgb: string;
  visualLabel: string;
  visualTitle: string;
  blueprintLabel: string;
  blueprintTitle: string;
  blueprintIntro: string;
  workflowLabel: string;
  workflowTitle: string;
  workflowIntro: string;
  useCaseLabel: string;
  useCaseTitle: string;
  integrationsTitle: string;
  faqTitle: string;
  ctaTitle: string;
};

export const productPageDesigns: Record<string, ProductPageDesign> = {
  "voice-agents": {
    accent: "#35fbe0",
    accentSoft: "#75fff0",
    accentRgb: "53, 251, 224",
    secondary: "#67e8f9",
    secondaryRgb: "103, 232, 249",
    tertiary: "#a99cff",
    tertiaryRgb: "169, 156, 255",
    visualLabel: "Agent control center",
    visualTitle: "Live Customer Conversation",
    blueprintLabel: "What you're building",
    blueprintTitle: "Every agent is made of three connected capabilities.",
    blueprintIntro:
      "Identity, approved knowledge, and connected actions define how an agent represents your business and completes useful work.",
    workflowLabel: "How you build it",
    workflowTitle: "A guided process, from first setup to going live.",
    workflowIntro:
      "Move through each stage in order, or return whenever the workflow changes. Every decision stays visible and easy to refine.",
    useCaseLabel: "Where agents help",
    useCaseTitle: "One agent foundation, adapted to the calls your team handles.",
    integrationsTitle: "Connect agents to the systems that power each customer workflow.",
    faqTitle: "What teams ask before launching a voice agent.",
    ctaTitle: "Let's improve every customer call.",
  },
  "voice-cloning": {
    accent: "#ff9fb7",
    accentSoft: "#ffc3d2",
    accentRgb: "255, 159, 183",
    secondary: "#9d8cff",
    secondaryRgb: "157, 140, 255",
    tertiary: "#5eead4",
    tertiaryRgb: "94, 234, 212",
    visualLabel: "Authorized voice studio",
    visualTitle: "Authorized Brand Voice",
    blueprintLabel: "Inside a voice profile",
    blueprintTitle: "A recognizable voice, built from controlled ingredients.",
    blueprintIntro:
      "A production voice is more than a recording. Source quality, delivery controls, and publishing permissions work together to keep every generated line consistent and authorized.",
    workflowLabel: "From sample to library",
    workflowTitle: "Create once, review carefully, then reuse with confidence.",
    workflowIntro:
      "Move from an approved recording to a governed voice profile your teams can use across changing scripts and channels.",
    useCaseLabel: "Where it fits",
    useCaseTitle: "One voice identity across every message.",
    integrationsTitle: "Connect the studio to the places your voice is used.",
    faqTitle: "What teams ask before creating a voice.",
    ctaTitle: "Create an approved brand voice for your next real script.",
  },
  "realtime-tts": {
    accent: "#67e8f9",
    accentSoft: "#b4f4fb",
    accentRgb: "103, 232, 249",
    secondary: "#5eead4",
    secondaryRgb: "94, 234, 212",
    tertiary: "#9d8cff",
    tertiaryRgb: "157, 140, 255",
    visualLabel: "Live speech stream",
    visualTitle: "Live Speech Streaming",
    blueprintLabel: "Inside the speech pipeline",
    blueprintTitle: "Every millisecond between text and speech has a job.",
    blueprintIntro:
      "Fast voice experiences depend on more than synthesis speed. Text handling, delivery controls, and resilient streaming must work as one responsive pipeline.",
    workflowLabel: "From text to playback",
    workflowTitle: "A streaming path tuned for natural turn-taking.",
    workflowIntro:
      "Prepare the voice, send text incrementally, begin playback early, and monitor the full path so conversations stay responsive.",
    useCaseLabel: "Built for live moments",
    useCaseTitle: "Speech that starts while the experience is still moving.",
    integrationsTitle: "Stream speech into the products and channels you already run.",
    faqTitle: "What builders ask about realtime synthesis.",
    ctaTitle: "Put low-latency speech into one live product experience.",
  },
  "multilingual-speech": {
    accent: "#f6db75",
    accentSoft: "#fff0a9",
    accentRgb: "246, 219, 117",
    secondary: "#5eead4",
    secondaryRgb: "94, 234, 212",
    tertiary: "#ff9fb7",
    tertiaryRgb: "255, 159, 183",
    visualLabel: "Language routing",
    visualTitle: "Global Language Experience",
    blueprintLabel: "Inside a localized experience",
    blueprintTitle: "Language, pronunciation, and local context move together.",
    blueprintIntro:
      "Reliable multilingual speech preserves intent while adapting the words, voice delivery, and regional details customers expect in their market.",
    workflowLabel: "From source to locale",
    workflowTitle: "Localize the workflow, not only the sentence.",
    workflowIntro:
      "Choose priority markets, prepare approved terminology, test representative speech, and keep every locale aligned as the source experience changes.",
    useCaseLabel: "Across markets",
    useCaseTitle: "One operating model, adapted for every audience.",
    integrationsTitle: "Bring localized speech to every customer touchpoint.",
    faqTitle: "What global teams ask before rollout.",
    ctaTitle: "Launch one customer workflow in the languages it needs.",
  },
  "api-access": {
    accent: "#b8a9ff",
    accentSoft: "#d9d2ff",
    accentRgb: "184, 169, 255",
    secondary: "#67e8f9",
    secondaryRgb: "103, 232, 249",
    tertiary: "#5eead4",
    tertiaryRgb: "94, 234, 212",
    visualLabel: "Developer console",
    visualTitle: "Voice API Integration",
    blueprintLabel: "Inside a production request",
    blueprintTitle: "Clear primitives at the edge. Strong controls underneath.",
    blueprintIntro:
      "Authentication, voice endpoints, and observable events give developers a predictable path from the first request to production traffic.",
    workflowLabel: "From key to production",
    workflowTitle: "A developer path that stays clear as usage grows.",
    workflowIntro:
      "Create scoped credentials, make the first request, handle events and failures, then monitor the complete integration in production.",
    useCaseLabel: "What teams build",
    useCaseTitle: "Voice capabilities that feel native to your product.",
    integrationsTitle: "Connect API events to the rest of your application stack.",
    faqTitle: "What developers ask before integration.",
    ctaTitle: "Ship one voice workflow through the API.",
  },
  "team-workflows": {
    accent: "#a7f3d0",
    accentSoft: "#d1fae5",
    accentRgb: "167, 243, 208",
    secondary: "#9d8cff",
    secondaryRgb: "157, 140, 255",
    tertiary: "#ffb37d",
    tertiaryRgb: "255, 179, 125",
    visualLabel: "Release workspace",
    visualTitle: "Team Review and Release Workflow",
    blueprintLabel: "Inside a shared workspace",
    blueprintTitle: "Contributors, reviewers, and owners stay in one release loop.",
    blueprintIntro:
      "Reusable standards, explicit approvals, and scoped visibility let teams move quickly without losing ownership of what reaches production.",
    workflowLabel: "From draft to release",
    workflowTitle: "Every change has an owner, a review, and a visible outcome.",
    workflowIntro:
      "Start from an approved pattern, adapt it for the team, test the affected paths, and publish a version everyone can trace.",
    useCaseLabel: "Across teams",
    useCaseTitle: "A shared operating layer for every voice workflow.",
    integrationsTitle: "Keep the workspace connected to the systems teams depend on.",
    faqTitle: "What operations teams ask about ownership.",
    ctaTitle: "Bring one cross-functional voice workflow into a shared workspace.",
  },
  "speech-analytics": {
    accent: "#8dd7ff",
    accentSoft: "#c5ebff",
    accentRgb: "141, 215, 255",
    secondary: "#9d8cff",
    secondaryRgb: "157, 140, 255",
    tertiary: "#5eead4",
    tertiaryRgb: "94, 234, 212",
    visualLabel: "Call intelligence",
    visualTitle: "Actionable Call Analytics",
    blueprintLabel: "Inside the analysis layer",
    blueprintTitle: "Every call becomes searchable evidence, not another recording.",
    blueprintIntro:
      "Transcripts, workflow-specific fields, and trend views turn unstructured audio into information teams can verify and act on.",
    workflowLabel: "From call to action",
    workflowTitle: "Structure the conversation, validate the pattern, close the loop.",
    workflowIntro:
      "Capture the right data, extract useful fields, inspect the source conversations, and route findings back to the teams that own the outcome.",
    useCaseLabel: "Questions it answers",
    useCaseTitle: "See what is happening across calls, teams, and time.",
    integrationsTitle: "Move structured call data into your reporting and customer systems.",
    faqTitle: "What data teams ask before analyzing calls.",
    ctaTitle: "Turn one high-volume call workflow into measurable data.",
  },
  "sentiment-detection": {
    accent: "#ff9f8f",
    accentSoft: "#ffc6bd",
    accentRgb: "255, 159, 143",
    secondary: "#f6db75",
    secondaryRgb: "246, 219, 117",
    tertiary: "#9d8cff",
    tertiaryRgb: "157, 140, 255",
    visualLabel: "Conversation signal",
    visualTitle: "Context-Aware Sentiment Detection",
    blueprintLabel: "Inside a sentiment signal",
    blueprintTitle: "Tone, language, and context combine before a workflow reacts.",
    blueprintIntro:
      "Sentiment is most useful as evidence. Conversation changes, customer context, and calibrated thresholds work together to support the right human response.",
    workflowLabel: "From signal to response",
    workflowTitle: "Detect carefully, respond proportionately, review continuously.",
    workflowIntro:
      "Choose meaningful signals, combine them with context, define safe actions, and compare predictions with human-reviewed conversations.",
    useCaseLabel: "Moments worth noticing",
    useCaseTitle: "Focus attention where care and judgment matter most.",
    integrationsTitle: "Send meaningful signals into routing, QA, and support workflows.",
    faqTitle: "What teams ask about sentiment accuracy.",
    ctaTitle: "Add context-aware sentiment signals to one customer workflow.",
  },
  "conversation-insights": {
    accent: "#c4b5fd",
    accentSoft: "#e1d9ff",
    accentRgb: "196, 181, 253",
    secondary: "#ff9fb7",
    secondaryRgb: "255, 159, 183",
    tertiary: "#8dd7ff",
    tertiaryRgb: "141, 215, 255",
    visualLabel: "Pattern discovery",
    visualTitle: "Customer Conversation Trends",
    blueprintLabel: "Inside an insight",
    blueprintTitle: "A useful finding stays connected to the conversations behind it.",
    blueprintIntro:
      "Theme discovery, meaningful comparison, and source evidence turn thousands of customer calls into a clear decision teams can trust.",
    workflowLabel: "From question to finding",
    workflowTitle: "Discover the pattern, validate the evidence, assign the response.",
    workflowIntro:
      "Start with a business question, compare a representative call set, inspect examples, and give every accepted finding an owner.",
    useCaseLabel: "Decisions it supports",
    useCaseTitle: "Hear what customers repeat before it becomes obvious elsewhere.",
    integrationsTitle: "Bring customer themes into product, revenue, and operations tools.",
    faqTitle: "What teams ask before using conversation insights.",
    ctaTitle: "Find the first actionable pattern in your customer calls.",
  },
  "quality-controls": {
    accent: "#5eead4",
    accentSoft: "#a7f3e7",
    accentRgb: "94, 234, 212",
    secondary: "#f6db75",
    secondaryRgb: "246, 219, 117",
    tertiary: "#ff9f8f",
    tertiaryRgb: "255, 159, 143",
    visualLabel: "Policy control center",
    visualTitle: "Production Quality Controls",
    blueprintLabel: "Inside a controlled workflow",
    blueprintTitle: "Boundaries, testing, and evidence travel with every release.",
    blueprintIntro:
      "Production quality comes from defined behavior limits, realistic pre-launch tests, and focused human oversight after calls begin.",
    workflowLabel: "From risk to release",
    workflowTitle: "Set the boundary, test the difficult path, monitor the evidence.",
    workflowIntro:
      "Classify sensitive actions, constrain the agent, run representative and adversarial tests, then turn review findings into controlled improvements.",
    useCaseLabel: "Where controls matter",
    useCaseTitle: "Keep automation useful without letting it outrun oversight.",
    integrationsTitle: "Connect quality evidence to access, review, and reporting systems.",
    faqTitle: "What risk and quality teams ask before launch.",
    ctaTitle: "Put explicit quality controls around one production workflow.",
  },
};
