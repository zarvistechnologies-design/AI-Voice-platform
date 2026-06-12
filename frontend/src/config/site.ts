export const siteConfig = {
  name: "AI Voice Platform",
  description: "Realtime speech intelligence for AI voice experiences.",
  headerLinks: [
    { href: "/#product", label: "Product", hasMenu: true },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#business", label: "For Business", hasMenu: true },
    { href: "/#developers", label: "For Developers", hasMenu: true },
    { href: "/#resources", label: "Resources", hasMenu: true },
    { href: "/#company", label: "Company", hasMenu: true },
  ],
  headerActions: [
    { href: "/#login", label: "Login", variant: "ghost" },
    { href: "/#contact", label: "Contact Sales", variant: "secondary" },
  ],
  productMenu: {
    featured: {
      href: "/#pricing",
      title: "See Pricing",
      body: "See how AI Voice Platform helps support and sales teams automate calls at scale without losing quality.",
    },
    groups: [
      {
        title: "Build",
        links: [
          { href: "/services/voice-agents", label: "Voice Agents" },
          { href: "/services/voice-cloning", label: "Voice Cloning" },
          { href: "/services/realtime-tts", label: "Realtime TTS" },
          { href: "/services/multilingual-speech", label: "Multilingual Speech" },
        ],
      },
      {
        title: "Deploy",
        links: [
          { href: "/services/api-access", label: "API Access" },
          { href: "/services/team-workflows", label: "Team Workflows" },
          { href: "/services/speech-analytics", label: "Speech Analytics" },
        ],
      },
      {
        title: "Monitor",
        links: [
          { href: "/services/sentiment-detection", label: "Sentiment Detection" },
          { href: "/services/conversation-insights", label: "Conversation Insights" },
          { href: "/services/quality-controls", label: "Quality Controls" },
        ],
      },
    ],
    cta: { href: "/#pricing", label: "See Pricing" },
  },
  businessMenu: {
    featured: {
      href: "/#contact",
      title: "Certified Partner",
      body: "See how AI Voice Platform helps support and sales teams automate calls at scale without losing quality.",
    },
    columns: [
      {
        title: "Industries",
        links: [
          { href: "/business/healthcare", label: "Healthcare" },
          { href: "/business/financial-services", label: "Financial Services" },
          { href: "/business/insurance", label: "Insurance" },
          { href: "/business/logistics", label: "Logistics" },
          { href: "/business/home-services", label: "Home Services" },
          { href: "/business/retail-consumer", label: "Retail & Consumer" },
          { href: "/business/travel-hospitality", label: "Travel & Hospitality" },
          { href: "/business/debt-collection", label: "Debt Collection" },
        ],
      },
      {
        title: "Use Cases",
        links: [
          { href: "/business/lead-qualification", label: "Lead Qualification" },
          { href: "/business/customer-support", label: "Customer Support" },
          { href: "/business/receptionists", label: "Receptionists" },
          { href: "/business/dispatch-service", label: "Dispatch Service" },
        ],
      },
    ],
    story: {
      href: "/#resources",
      title: "Customer Stories",
      body: "See how leading teams use AI Voice Platform to transform customer calls and drive real results.",
    },
    cta: { href: "/#contact", label: "Certified Partner" },
  },
  developersMenu: {
    featured: {
      href: "/#developers",
      title: "Documentation",
      body: "See what makes AI Voice Platform unique from how it works to what it can do for your team.",
    },
    columns: [
      {
        title: "Integrations",
        links: [
          { href: "/#developers", label: "Make", icon: "M" },
          { href: "/#developers", label: "Twilio", icon: "◎" },
          { href: "/#developers", label: "Vonage", icon: "V" },
          { href: "/#developers", label: "Go High Level", icon: "H" },
          { href: "/#developers", label: "n8n", icon: "n8n" },
          { href: "/#developers", label: "HubSpot", icon: "H" },
        ],
      },
    ],
    story: {
      href: "/#resources",
      title: "Status Page",
      body: "See how leading teams use AI Voice Platform to transform customer calls and drive real results.",
    },
    cta: { href: "/#developers", label: "App Partners" },
  },
  resourcesMenu: {
    featured: {
      href: "/resources/comparison-overview",
      title: "Comparison Overview",
      body: "See how AI Voice Platform helps support and sales teams automate calls at scale without losing quality.",
    },
    columns: [
      {
        title: "Quick Links",
        links: [
          { href: "/resources/blog", label: "Blog" },
          { href: "/resources/changelog", label: "Changelog" },
          { href: "/resources/trust-center", label: "Trust Center" },
          { href: "/resources/community", label: "Community" },
          { href: "/resources/logos", label: "Logos" },
        ],
      },
      {
        title: "Partners",
        links: [
          { href: "/resources/solution-partner-program", label: "Solution Partner Program" },
          { href: "/resources/solution-partner-directory", label: "Solution Partner Directory" },
          { href: "/resources/creator-partner-program", label: "Creator Partner Program" },
          { href: "/resources/app-partner-directory", label: "App Partner Directory" },
        ],
      },
    ],
    story: {
      href: "/resources/events",
      title: "Events",
      body: "Meet us at upcoming conferences and live demos to explore the power of AI Voice Platform in action.",
    },
    cta: { href: "/resources/blog", label: "Visit Our Blog" },
  },
  companyMenu: {
    featured: {
      href: "/#company",
      title: "About Us",
      body: "See how leading teams use AI Voice Platform to transform customer calls and drive real results.",
    },
    columns: [],
    story: {
      href: "/career",
      title: "Careers",
      body: "Join our growing team and help build the future of voice AI where every call gets smarter.",
    },
  },
  footerLinks: [
    {
      title: "Product",
      links: [
        { href: "/services/voice-agents", label: "Voice Agents" },
        { href: "/services/speech-analytics", label: "Speech Analytics" },
        { href: "/#pricing", label: "Pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/#business", label: "For Business" },
        { href: "/#company", label: "About" },
        { href: "/#resources", label: "Resources" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "mailto:hello@aivoiceplatform.com", label: "Contact" },
        { href: "/#resources", label: "Documentation" },
        { href: "/#company", label: "Privacy" },
      ],
    },
  ],
};

export const platformFeatures = [
  {
    title: "Voice Agents",
    icon: "VA",
    body: "Launch AI assistants that answer calls, qualify leads, and route urgent requests.",
  },
  {
    title: "Speech Analytics",
    icon: "SA",
    body: "Detect sentiment, key topics, and action items from every voice conversation.",
  },
  {
    title: "Business Ready",
    icon: "BR",
    body: "Manage teams, workflows, integrations, and privacy controls from one workspace.",
  },
  {
    title: "Voice Cloning",
    icon: "VC",
    body: "Create consistent branded voices for campaigns, training, and global product content.",
  },
  {
    title: "Multilingual",
    icon: "ML",
    body: "Localize scripts across 140+ languages while preserving pace, emotion, and clarity.",
  },
  {
    title: "Realtime TTS",
    icon: "RT",
    body: "Preview, tune, and regenerate speech quickly with low-latency text-to-speech tools.",
  },
];

export const businessPages = [
  {
    slug: "healthcare",
    title: "Healthcare",
    kicker: "Industries",
    summary:
      "Handle appointment questions, intake calls, reminders, and follow-ups with voice agents designed for high-trust patient conversations.",
    highlights: ["Patient intake", "Appointment reminders", "Care team handoffs"],
    sections: [
      {
        title: "Support patients faster",
        body: "Answer common questions, collect intake details, and route urgent needs so staff can focus on care that requires a person.",
      },
      {
        title: "Keep conversations accountable",
        body: "Use transcripts, summaries, and review flows to keep patient communication visible and consistent across teams.",
      },
    ],
  },
  {
    slug: "financial-services",
    title: "Financial Services",
    kicker: "Industries",
    summary:
      "Qualify callers, schedule consultations, and provide consistent voice support for financial teams with careful escalation controls.",
    highlights: ["Consultation booking", "Caller verification", "Escalation controls"],
    sections: [
      {
        title: "Guide callers clearly",
        body: "Collect the right context before a human conversation so advisors and service teams can respond with less back-and-forth.",
      },
      {
        title: "Protect sensitive workflows",
        body: "Define what agents can answer, when they should hand off, and how conversations are reviewed before follow-up.",
      },
    ],
  },
  {
    slug: "insurance",
    title: "Insurance",
    kicker: "Industries",
    summary:
      "Automate policy questions, claims intake, renewals, and follow-up calls while keeping customers connected to the right team.",
    highlights: ["Claims intake", "Policy support", "Renewal follow-up"],
    sections: [
      {
        title: "Capture claim details",
        body: "Gather structured information from callers and send clean summaries into the workflows your team already uses.",
      },
      {
        title: "Reduce missed follow-ups",
        body: "Use voice automation to remind customers, confirm details, and route complex cases to licensed staff.",
      },
    ],
  },
  {
    slug: "logistics",
    title: "Logistics",
    kicker: "Industries",
    summary:
      "Coordinate delivery updates, dispatch conversations, and exception handling with voice agents built for fast-moving operations.",
    highlights: ["Delivery updates", "Driver coordination", "Exception routing"],
    sections: [
      {
        title: "Keep operations moving",
        body: "Answer status calls, collect issue details, and notify the right people when deliveries need attention.",
      },
      {
        title: "Turn calls into action",
        body: "Convert voice conversations into summaries, tasks, and alerts so dispatch teams can act without retyping notes.",
      },
    ],
  },
  {
    slug: "home-services",
    title: "Home Services",
    kicker: "Industries",
    summary:
      "Book jobs, qualify service requests, answer after-hours calls, and dispatch urgent work without missing valuable leads.",
    highlights: ["Job booking", "After-hours answering", "Urgent dispatch"],
    sections: [
      {
        title: "Never miss a local lead",
        body: "Let voice agents answer calls, collect job details, and schedule next steps even when your team is on site.",
      },
      {
        title: "Prioritize urgent work",
        body: "Route emergency calls and high-value requests faster with clear rules for escalation and notifications.",
      },
    ],
  },
  {
    slug: "retail-consumer",
    title: "Retail & Consumer",
    kicker: "Industries",
    summary:
      "Support shoppers with order questions, product guidance, returns, and campaign calls using responsive AI voice workflows.",
    highlights: ["Order support", "Product guidance", "Returns triage"],
    sections: [
      {
        title: "Answer shoppers at scale",
        body: "Resolve repetitive questions quickly while preserving a polished, brand-aligned voice experience.",
      },
      {
        title: "Learn from demand",
        body: "Use conversation insights to spot recurring product questions, fulfillment issues, and support trends.",
      },
    ],
  },
  {
    slug: "travel-hospitality",
    title: "Travel & Hospitality",
    kicker: "Industries",
    summary:
      "Manage booking questions, guest requests, confirmations, and itinerary updates with multilingual voice support.",
    highlights: ["Guest requests", "Booking support", "Multilingual calls"],
    sections: [
      {
        title: "Serve guests in the moment",
        body: "Handle common requests and booking questions quickly so teams can focus on in-person hospitality.",
      },
      {
        title: "Localize every interaction",
        body: "Support travelers across languages with consistent scripts, routing, and follow-up workflows.",
      },
    ],
  },
  {
    slug: "debt-collection",
    title: "Debt Collection",
    kicker: "Industries",
    summary:
      "Run consistent outbound reminders, payment conversations, and follow-up workflows with careful tone and compliance controls.",
    highlights: ["Outbound reminders", "Payment follow-up", "Review workflows"],
    sections: [
      {
        title: "Standardize sensitive calls",
        body: "Use approved scripts and handoff rules to keep conversations consistent across high-volume outreach.",
      },
      {
        title: "Track every outcome",
        body: "Summarize call results, next steps, and escalation needs so teams can manage follow-up clearly.",
      },
    ],
  },
  {
    slug: "lead-qualification",
    title: "Lead Qualification",
    kicker: "Use Cases",
    summary:
      "Qualify inbound and outbound leads with natural voice conversations that capture intent, timing, fit, and next steps.",
    highlights: ["Intent capture", "CRM-ready notes", "Sales handoffs"],
    sections: [
      {
        title: "Ask the right questions",
        body: "Collect budget, timeline, need, and contact details so sales teams can focus on the most promising conversations.",
      },
      {
        title: "Move leads forward",
        body: "Trigger follow-up tasks, bookings, and notifications when a caller is ready for a human conversation.",
      },
    ],
  },
  {
    slug: "customer-support",
    title: "Customer Support",
    kicker: "Use Cases",
    summary:
      "Resolve routine support calls, capture issue context, and escalate urgent requests with full conversation history.",
    highlights: ["Issue triage", "Call summaries", "Escalation rules"],
    sections: [
      {
        title: "Reduce repetitive load",
        body: "Let agents answer common questions and gather context before a support teammate joins the conversation.",
      },
      {
        title: "Improve handoffs",
        body: "Send clear summaries and action items into your support workflow so customers do not need to repeat themselves.",
      },
    ],
  },
  {
    slug: "receptionists",
    title: "Receptionists",
    kicker: "Use Cases",
    summary:
      "Give every caller a helpful first response with AI receptionists that answer, route, schedule, and take messages.",
    highlights: ["Call routing", "Message taking", "Calendar booking"],
    sections: [
      {
        title: "Create a better front desk",
        body: "Answer calls immediately, understand why people are calling, and route them to the right team or workflow.",
      },
      {
        title: "Cover busy hours",
        body: "Handle overflow, lunch hours, and after-hours calls without letting important requests fall through.",
      },
    ],
  },
  {
    slug: "dispatch-service",
    title: "Dispatch Service",
    kicker: "Use Cases",
    summary:
      "Route urgent requests, coordinate field teams, and keep dispatch workflows moving with structured voice automation.",
    highlights: ["Urgency detection", "Field alerts", "Job details"],
    sections: [
      {
        title: "Capture what dispatch needs",
        body: "Collect location, urgency, availability, and job details before alerting the right person or team.",
      },
      {
        title: "Respond faster",
        body: "Use escalation rules and notifications to keep time-sensitive calls moving without manual triage.",
      },
    ],
  },
] as const;

export const resourcePages = [
  {
    slug: "comparison-overview",
    title: "Comparison Overview",
    kicker: "Resources",
    summary:
      "Compare AI Voice Platform with traditional call automation, IVR tools, and voice AI workflows so your team can choose with clarity.",
    highlights: ["Platform comparison", "Buying criteria", "Team readiness"],
    sections: [
      {
        title: "Understand the options",
        body: "Review the differences between scripted call trees, standalone speech tools, and full voice automation workflows.",
      },
      {
        title: "Choose for your use case",
        body: "Match capabilities like latency, analytics, integrations, and handoffs to the way your team actually handles calls.",
      },
    ],
  },
  {
    slug: "blog",
    title: "Blog",
    kicker: "Quick Links",
    summary:
      "Read practical ideas, product thinking, and customer workflow guidance for building better AI voice experiences.",
    highlights: ["Product insights", "Workflow guides", "Voice AI strategy"],
    sections: [
      {
        title: "Learn what works",
        body: "Explore articles on call automation, speech design, analytics, and the operational choices behind reliable voice AI.",
      },
      {
        title: "Keep teams informed",
        body: "Share clear guidance with support, sales, operations, and technical teams as your voice workflows mature.",
      },
    ],
  },
  {
    slug: "changelog",
    title: "Changelog",
    kicker: "Quick Links",
    summary:
      "Track platform updates, new workflow capabilities, integration improvements, and quality-of-life changes for voice teams.",
    highlights: ["Product updates", "Release notes", "Integration changes"],
    sections: [
      {
        title: "Follow product progress",
        body: "See what has changed across agents, speech generation, analytics, team workflows, and platform controls.",
      },
      {
        title: "Plan adoption",
        body: "Use release notes to decide when new capabilities are ready for your team, customers, or production workflows.",
      },
    ],
  },
  {
    slug: "trust-center",
    title: "Trust Center",
    kicker: "Quick Links",
    summary:
      "Review the security, privacy, reliability, and governance practices behind AI Voice Platform.",
    highlights: ["Security posture", "Privacy controls", "Reliability practices"],
    sections: [
      {
        title: "Build with confidence",
        body: "Understand the safeguards, access controls, and operational practices that support sensitive voice workflows.",
      },
      {
        title: "Prepare for review",
        body: "Give stakeholders a focused place to evaluate platform readiness before moving voice automation into production.",
      },
    ],
  },
  {
    slug: "community",
    title: "Community",
    kicker: "Quick Links",
    summary:
      "Connect with builders, operators, partners, and teams exploring better ways to use AI voice in real customer workflows.",
    highlights: ["Builder discussions", "Workflow examples", "Shared learning"],
    sections: [
      {
        title: "Learn from peers",
        body: "Find examples, questions, and practical lessons from teams designing and scaling AI voice experiences.",
      },
      {
        title: "Share what you build",
        body: "Bring feedback, patterns, and product ideas back into the community as your workflows evolve.",
      },
    ],
  },
  {
    slug: "logos",
    title: "Logos",
    kicker: "Quick Links",
    summary:
      "Access brand marks, usage guidance, and partner-ready assets for AI Voice Platform.",
    highlights: ["Brand assets", "Usage guidance", "Partner materials"],
    sections: [
      {
        title: "Use the brand consistently",
        body: "Find the right logo assets and simple rules for presentations, partner pages, and co-marketing materials.",
      },
      {
        title: "Prepare polished materials",
        body: "Keep customer-facing decks, launch pages, and partner announcements aligned with current platform branding.",
      },
    ],
  },
  {
    slug: "solution-partner-program",
    title: "Solution Partner Program",
    kicker: "Partners",
    summary:
      "Partner with AI Voice Platform to design, launch, and manage voice automation solutions for customers.",
    highlights: ["Implementation partners", "Customer delivery", "Enablement"],
    sections: [
      {
        title: "Deliver voice workflows",
        body: "Help customers map call processes, configure agents, connect systems, and roll out automation safely.",
      },
      {
        title: "Grow with enablement",
        body: "Use partner resources, training, and shared go-to-market support to expand your voice AI services.",
      },
    ],
  },
  {
    slug: "solution-partner-directory",
    title: "Solution Partner Directory",
    kicker: "Partners",
    summary:
      "Find trusted solution partners who can help plan, implement, and optimize AI voice workflows.",
    highlights: ["Certified partners", "Implementation help", "Workflow expertise"],
    sections: [
      {
        title: "Find the right fit",
        body: "Explore partners by capability, industry focus, and implementation experience for your customer call needs.",
      },
      {
        title: "Move faster",
        body: "Work with experienced teams that can help translate business goals into working voice automation.",
      },
    ],
  },
  {
    slug: "creator-partner-program",
    title: "Creator Partner Program",
    kicker: "Partners",
    summary:
      "Collaborate on education, templates, demos, and practical content that helps teams understand AI voice workflows.",
    highlights: ["Creator education", "Template content", "Demo support"],
    sections: [
      {
        title: "Teach with clarity",
        body: "Create useful examples that show how voice agents, analytics, and workflows solve real operational problems.",
      },
      {
        title: "Reach the right audience",
        body: "Share resources with builders, operators, and customer-facing teams who want practical voice AI guidance.",
      },
    ],
  },
  {
    slug: "app-partner-directory",
    title: "App Partner Directory",
    kicker: "Partners",
    summary:
      "Discover apps and integration partners that connect AI Voice Platform with the tools your team already uses.",
    highlights: ["Integration partners", "Connected workflows", "App ecosystem"],
    sections: [
      {
        title: "Connect your stack",
        body: "Explore tools that help send call outcomes, summaries, tasks, and customer data into existing systems.",
      },
      {
        title: "Extend the platform",
        body: "Use partner apps to customize voice workflows for sales, support, operations, and analytics teams.",
      },
    ],
  },
  {
    slug: "events",
    title: "Events",
    kicker: "Resources",
    summary:
      "Meet the AI Voice Platform team at demos, webinars, conferences, and live sessions about the future of voice automation.",
    highlights: ["Live demos", "Webinars", "Conference sessions"],
    sections: [
      {
        title: "See the platform live",
        body: "Join sessions that show how voice agents, speech tools, and analytics work together in real workflows.",
      },
      {
        title: "Ask better questions",
        body: "Use events to compare approaches, learn implementation patterns, and bring practical ideas back to your team.",
      },
    ],
  },
] as const;

export const servicePages = [
  {
    slug: "voice-agents",
    title: "Voice Agents",
    kicker: "Build",
    summary:
      "Launch natural AI callers that answer, qualify, route, and follow up without making customers feel trapped in a script.",
    highlights: ["24/7 call handling", "Lead qualification", "Human handoff rules"],
    sections: [
      {
        title: "Always-on conversations",
        body: "Give your team AI agents that can greet callers, understand intent, collect details, and route urgent requests to the right person.",
      },
      {
        title: "Built for real workflows",
        body: "Connect agents to booking, CRM, support, and notification flows so every call creates a useful next step.",
      },
    ],
  },
  {
    slug: "voice-cloning",
    title: "Voice Cloning",
    kicker: "Build",
    summary:
      "Create consistent branded voices for demos, training, campaigns, and multilingual customer communication.",
    highlights: ["Brand voice matching", "Reusable voice library", "Governed access"],
    sections: [
      {
        title: "Consistent voice identity",
        body: "Keep narration, support prompts, and product audio aligned with the same recognizable tone across every channel.",
      },
      {
        title: "Control before release",
        body: "Review generated speech, manage approved voices, and keep cloning workflows visible to the right stakeholders.",
      },
    ],
  },
  {
    slug: "realtime-tts",
    title: "Realtime TTS",
    kicker: "Build",
    summary:
      "Generate low-latency speech from text for previews, live agents, IVR flows, and product experiences.",
    highlights: ["Low-latency speech", "Script preview", "Voice tuning"],
    sections: [
      {
        title: "Fast enough to iterate",
        body: "Preview scripts quickly, compare voice options, and adjust pacing before audio reaches production.",
      },
      {
        title: "Ready for live use",
        body: "Stream speech into apps and call flows with stable controls for language, speed, and tone.",
      },
    ],
  },
  {
    slug: "multilingual-speech",
    title: "Multilingual Speech",
    kicker: "Build",
    summary:
      "Localize voice experiences across languages while preserving clarity, emotion, and customer intent.",
    highlights: ["140+ languages", "Localized scripts", "Natural pronunciation"],
    sections: [
      {
        title: "Speak to every market",
        body: "Turn one voice workflow into localized conversations for global support, sales, and content teams.",
      },
      {
        title: "Keep the meaning intact",
        body: "Preserve tone and pace so translated speech still feels polished, helpful, and on brand.",
      },
    ],
  },
  {
    slug: "api-access",
    title: "API Access",
    kicker: "Deploy",
    summary:
      "Embed speech generation, voice workflows, and usage controls directly into your own product stack.",
    highlights: ["Speech endpoints", "Usage controls", "Developer-friendly docs"],
    sections: [
      {
        title: "Ship voice into products",
        body: "Call the platform from your app, workflow tool, or backend service with clean primitives for speech and agents.",
      },
      {
        title: "Govern production usage",
        body: "Keep usage, authentication, and environment controls visible as voice features move from prototype to launch.",
      },
    ],
  },
  {
    slug: "team-workflows",
    title: "Team Workflows",
    kicker: "Deploy",
    summary:
      "Coordinate scripts, agents, approvals, handoffs, and reporting from one shared voice workspace.",
    highlights: ["Role-based workspaces", "Approval steps", "Shared templates"],
    sections: [
      {
        title: "Keep teams aligned",
        body: "Give sales, support, operations, and leadership a common place to manage how voice automation behaves.",
      },
      {
        title: "Move faster with templates",
        body: "Reuse approved call flows and prompts so new campaigns and teams launch with less manual setup.",
      },
    ],
  },
  {
    slug: "speech-analytics",
    title: "Speech Analytics",
    kicker: "Deploy",
    summary:
      "Turn conversations into searchable insights about topics, objections, sentiment, quality, and follow-up actions.",
    highlights: ["Topic detection", "Action items", "Call summaries"],
    sections: [
      {
        title: "Understand every call",
        body: "Summarize conversations and surface patterns your team can use to improve scripts, service, and sales motions.",
      },
      {
        title: "Close the loop",
        body: "Send insights into the tools your team already uses so calls become data, not disconnected recordings.",
      },
    ],
  },
  {
    slug: "sentiment-detection",
    title: "Sentiment Detection",
    kicker: "Monitor",
    summary:
      "Detect customer emotion and urgency so teams know when a conversation needs care, escalation, or recovery.",
    highlights: ["Emotion signals", "Escalation triggers", "Quality review"],
    sections: [
      {
        title: "Spot risk early",
        body: "Identify frustrated, confused, or high-intent callers while the conversation still has room to improve.",
      },
      {
        title: "Coach with context",
        body: "Use sentiment trends to improve agent prompts, human coaching, and support playbooks.",
      },
    ],
  },
  {
    slug: "conversation-insights",
    title: "Conversation Insights",
    kicker: "Monitor",
    summary:
      "Reveal trends from customer calls so teams can learn what people ask, need, resist, and value most.",
    highlights: ["Trend dashboards", "Intent clustering", "Operational reporting"],
    sections: [
      {
        title: "Find the recurring themes",
        body: "Group conversations by questions, issues, objections, and outcomes to see what deserves attention first.",
      },
      {
        title: "Make calls actionable",
        body: "Convert unstructured voice conversations into practical intelligence for product, support, and revenue teams.",
      },
    ],
  },
  {
    slug: "quality-controls",
    title: "Quality Controls",
    kicker: "Monitor",
    summary:
      "Set rules, reviews, and safeguards that keep voice automation reliable, compliant, and aligned with your team.",
    highlights: ["Review workflows", "Fallback rules", "Call guardrails"],
    sections: [
      {
        title: "Protect the experience",
        body: "Define when agents should answer, pause, escalate, or hand off so automation stays within approved boundaries.",
      },
      {
        title: "Review what matters",
        body: "Track quality signals across calls and focus review time on conversations that need human attention.",
      },
    ],
  },
] as const;
