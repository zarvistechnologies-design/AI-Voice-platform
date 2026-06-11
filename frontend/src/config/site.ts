export const siteConfig = {
  name: "AI Voice Platform",
  description: "Realtime speech intelligence for AI voice experiences.",
  headerLinks: [
    { href: "#product", label: "Product", hasMenu: true },
    { href: "#pricing", label: "Pricing" },
    { href: "#business", label: "For Business", hasMenu: true },
    { href: "#developers", label: "For Developers", hasMenu: true },
    { href: "#resources", label: "Resources", hasMenu: true },
    { href: "#company", label: "Company", hasMenu: true },
  ],
  headerActions: [
    { href: "#login", label: "Login", variant: "ghost" },
    { href: "#contact", label: "Contact Sales", variant: "secondary" },
  ],
  footerLinks: [
    {
      title: "Product",
      links: [
        { href: "#product", label: "Voice Agents" },
        { href: "#product", label: "Speech Analytics" },
        { href: "#pricing", label: "Pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "#business", label: "For Business" },
        { href: "#company", label: "About" },
        { href: "#resources", label: "Resources" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "mailto:hello@aivoiceplatform.com", label: "Contact" },
        { href: "#resources", label: "Documentation" },
        { href: "#company", label: "Privacy" },
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
