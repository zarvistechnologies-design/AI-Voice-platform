import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { businessPages } from "@/config/site";

type IndustrySlug =
  | "financial-services"
  | "insurance"
  | "logistics"
  | "home-services"
  | "retail-consumer"
  | "travel-hospitality"
  | "debt-collection";

type IndustryPreset = {
  accent: string;
  accentSoft: string;
  logos: string[];
  photoCards: Array<{ title: string; image: string }>;
  workflows: Array<{
    eyebrow: string;
    title: string;
    button: string;
    visual: "routing" | "ivr" | "calendar";
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

function getIndustry(slug: string) {
  return businessPages.find(
    (business) => business.kicker === "Industries" && business.slug === slug,
  );
}

export function generateIndustryMetadata(slug: string) {
  const industry = getIndustry(slug);

  if (!industry) {
    return {
      title: "Industry page not found",
    };
  }

  return {
    title: `${industry.title} | vozon.ai`,
    description: industry.summary,
  };
}

const presets: Record<IndustrySlug, IndustryPreset> = {
  "financial-services": {
    accent: "#00ADB5",
    accentSoft: "#ccfbf1",
    logos: ["NOVA BANK", "Ledgerly", "Harbor", "Finwise", "MintPath", "Oakline", "Cobalt", "TrustVest", "Apex"],
    photoCards: [
      {
        title: "Client Onboarding",
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Advisor Scheduling",
        image:
          "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Verification Calls",
        image:
          "https://images.unsplash.com/photo-1554224154-26032fced8bd?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Escalation Support",
        image:
          "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=900&q=80",
      },
    ],
    workflows: [
      {
        eyebrow: "Qualification",
        title: "Guide callers through consultation and account questions",
        button: "Check Qualification Feature",
        visual: "routing",
        points: [
          {
            title: "Collect intent before handoff",
            body: "Capture the caller's goal, account type, and preferred next step before routing them to your team.",
          },
          {
            title: "Book advisor consultations",
            body: "Schedule meetings with the right specialist while keeping context attached to the call summary.",
          },
        ],
      },
      {
        eyebrow: "Controls",
        title: "Protect sensitive workflows with clear escalation rules",
        button: "Check Escalation Feature",
        visual: "ivr",
        reverse: true,
        points: [
          {
            title: "Verify before discussing details",
            body: "Prompt for approved verification details and move uncertain calls to a human teammate.",
          },
          {
            title: "Keep answers inside policy",
            body: "Define which questions agents can answer and which requests must be reviewed by staff.",
          },
        ],
      },
      {
        eyebrow: "Follow-Up",
        title: "Turn each conversation into a clean next step",
        button: "Check Follow-Up Feature",
        visual: "calendar",
        points: [
          {
            title: "Create CRM-ready notes",
            body: "Summaries, caller needs, and next actions can flow into your financial services workflow.",
          },
          {
            title: "Reduce back-and-forth",
            body: "Give advisors useful call context before they return the call or join a scheduled consultation.",
          },
        ],
      },
    ],
    integrations: ["Salesforce", "HubSpot", "Plaid", "Calendly", "DocuSign", "Zendesk", "Intercom", "Slack"],
    faqs: [
      "Can AI phone agents qualify financial services callers?",
      "How do voice agents handle sensitive financial questions?",
      "Can calls be routed to specific advisors or departments?",
      "Can summaries be sent to CRM or support tools?",
    ],
    reviewBenefits: [
      {
        title: "Faster Client Intake",
        body: "Financial teams can qualify callers, collect account context, and book consultations before an advisor steps in.",
      },
      {
        title: "Policy-Aware Conversations",
        body: "Routine answers stay inside approved guidance while sensitive financial questions move to the right specialist.",
      },
      {
        title: "Advisor-Ready Handoffs",
        body: "Every escalation includes caller goals, verification notes, and next steps so advisors do not start cold.",
      },
    ],
    quote: {
      primary:
        "Our advisors start each call with context instead of a blank screen, which changed the pace of our client intake.",
      primaryName: "Elena Brooks",
      primaryRole: "Client Operations Lead, Harbor Finance",
      secondary:
        "The agent handles repetitive routing while our team stays focused on the conversations that need judgment.",
      secondaryName: "Marcus Chen",
      secondaryRole: "Director of Service, Cobalt Capital",
    },
  },
  insurance: {
    accent: "#00ADB5",
    accentSoft: "#ccfbf1",
    logos: ["PolicyWorks", "Coverly", "NEST", "BrightClaim", "Aegis", "SurePath", "Northstar", "Riskline", "Verity"],
    photoCards: [
      {
        title: "Claims Intake",
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Policy Support",
        image:
          "https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Renewal Follow-Up",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Licensed Handoffs",
        image:
          "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=900&q=80",
      },
    ],
    workflows: [
      {
        eyebrow: "Claims",
        title: "Capture claim details before your team takes over",
        button: "Check Claims Intake Feature",
        visual: "routing",
        points: [
          {
            title: "Gather structured information",
            body: "Collect incident details, contact information, and urgency signals in a consistent format.",
          },
          {
            title: "Send clean summaries",
            body: "Route call summaries into the claim workflow so staff can act without replaying recordings.",
          },
        ],
      },
      {
        eyebrow: "Policy Support",
        title: "Answer routine questions and escalate licensed work",
        button: "Check Policy Support Feature",
        visual: "ivr",
        reverse: true,
        points: [
          {
            title: "Keep common calls moving",
            body: "Handle status questions, document requests, and simple routing without creating a queue.",
          },
          {
            title: "Protect regulated conversations",
            body: "Move advice, coverage interpretation, and exceptions to the right licensed staff member.",
          },
        ],
      },
      {
        eyebrow: "Renewals",
        title: "Reduce missed follow-ups and renewal delays",
        button: "Check Renewal Feature",
        visual: "calendar",
        points: [
          {
            title: "Confirm details by phone",
            body: "Reach policyholders with reminders, confirmations, and next-step prompts.",
          },
          {
            title: "Prioritize high-value cases",
            body: "Flag urgent renewals and complex claims for fast human follow-up.",
          },
        ],
      },
    ],
    integrations: ["Guidewire", "Applied Epic", "Duck Creek", "Salesforce", "HubSpot", "Zendesk", "DocuSign", "Slack"],
    faqs: [
      "Can AI agents help with insurance claims intake?",
      "Can policy questions be escalated to licensed staff?",
      "Can voice automation support renewal reminders?",
      "Can call outcomes sync with insurance workflows?",
    ],
    reviewBenefits: [
      {
        title: "Cleaner Claims Intake",
        body: "Insurance teams receive structured incident details, caller information, and urgency signals before review begins.",
      },
      {
        title: "Licensed Staff Protection",
        body: "Coverage interpretation, advice, and exceptions are escalated to licensed team members instead of being handled loosely.",
      },
      {
        title: "Renewal Follow-Up Support",
        body: "Policyholders get timely reminders and confirmations while complex renewals stay visible to your team.",
      },
    ],
    quote: {
      primary:
        "Claims calls arrive with the core facts already organized, which gives adjusters a faster first move.",
      primaryName: "Priya Raman",
      primaryRole: "Claims Operations Manager, BrightClaim",
      secondary:
        "We use AI phone agents for follow-up and routing while keeping licensed conversations with licensed people.",
      secondaryName: "Jon Ellis",
      secondaryRole: "Agency Principal, SurePath",
    },
  },
  logistics: {
    accent: "#00ADB5",
    accentSoft: "#ccfbf1",
    logos: ["RoutePeak", "ShipGrid", "FleetOps", "CargoLane", "NorthDock", "Dispatchly", "ParcelPro", "Trek", "Loadwise"],
    photoCards: [
      {
        title: "Delivery Updates",
        image:
          "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Driver Coordination",
        image:
          "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Exception Routing",
        image:
          "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Dispatch Support",
        image:
          "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=900&q=80",
      },
    ],
    workflows: [
      {
        eyebrow: "Status Calls",
        title: "Answer delivery questions while operations keep moving",
        button: "Check Delivery Update Feature",
        visual: "routing",
        points: [
          {
            title: "Share status consistently",
            body: "Handle ETA, pickup, and delivery questions with clear call flows and current context.",
          },
          {
            title: "Route exceptions quickly",
            body: "Escalate delays, failed deliveries, and urgent customer issues to dispatch.",
          },
        ],
      },
      {
        eyebrow: "Dispatch",
        title: "Coordinate drivers and customers without manual note taking",
        button: "Check Dispatch Feature",
        visual: "ivr",
        reverse: true,
        points: [
          {
            title: "Collect location and issue details",
            body: "Capture structured information that helps dispatch teams decide the next move.",
          },
          {
            title: "Notify the right person",
            body: "Use routing rules to alert local teams, account owners, or operations managers.",
          },
        ],
      },
      {
        eyebrow: "Action",
        title: "Turn logistics calls into tasks and alerts",
        button: "Check Operations Feature",
        visual: "calendar",
        points: [
          {
            title: "Create summaries automatically",
            body: "Send call outcomes into the tools your operations team already checks.",
          },
          {
            title: "Reduce retyping",
            body: "Keep dispatchers focused on exceptions instead of rebuilding call notes from scratch.",
          },
        ],
      },
    ],
    integrations: ["ShipStation", "Onfleet", "Samsara", "project44", "Zendesk", "HubSpot", "Slack", "Zapier"],
    faqs: [
      "Can AI phone agents answer delivery status calls?",
      "Can calls be routed to dispatch teams?",
      "Can logistics exceptions trigger alerts?",
      "Can call summaries be sent into operations tools?",
    ],
    reviewBenefits: [
      {
        title: "Fewer Repetitive ETA Calls",
        body: "Customers get consistent pickup, delivery, and status updates while dispatchers stay focused on exceptions.",
      },
      {
        title: "Sharper Dispatch Context",
        body: "Callers can share location, delivery issue, and urgency details before the right operations team is alerted.",
      },
      {
        title: "Actionable Shift Notes",
        body: "Summaries, tasks, and alerts help logistics teams keep work moving across busy handoffs.",
      },
    ],
    quote: {
      primary:
        "Our dispatch team spends less time answering repetitive ETA calls and more time solving real exceptions.",
      primaryName: "Nadia Ford",
      primaryRole: "Operations Director, RoutePeak",
      secondary:
        "Every call now leaves a clean trail for the next person, which matters a lot in a fast-moving shift.",
      secondaryName: "Mateo Cruz",
      secondaryRole: "Regional Dispatch Lead, FleetOps",
    },
  },
  "home-services": {
    accent: "#00ADB5",
    accentSoft: "#ccfbf1",
    logos: ["FixFlow", "Prime HVAC", "RooterOne", "SparkPro", "CleanNest", "Roofline", "LocalCrew", "Pipewise", "HomeOps"],
    photoCards: [
      {
        title: "Job Booking",
        image:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "After-Hours Answering",
        image:
          "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Urgent Dispatch",
        image:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Local Lead Capture",
        image:
          "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80",
      },
    ],
    workflows: [
      {
        eyebrow: "Booking",
        title: "Book service jobs while your crews are in the field",
        button: "Check Job Booking Feature",
        visual: "routing",
        points: [
          {
            title: "Collect job details",
            body: "Ask the right questions about location, service type, urgency, and availability.",
          },
          {
            title: "Capture every local lead",
            body: "Answer calls during busy hours, evenings, and weekends without letting valuable work go to voicemail.",
          },
        ],
      },
      {
        eyebrow: "Dispatch",
        title: "Prioritize emergencies and high-value requests",
        button: "Check Dispatch Feature",
        visual: "ivr",
        reverse: true,
        points: [
          {
            title: "Detect urgent calls",
            body: "Flag leaks, outages, lockouts, and safety concerns for immediate escalation.",
          },
          {
            title: "Route to the right technician",
            body: "Use service area, job type, and availability rules to send calls to the correct workflow.",
          },
        ],
      },
      {
        eyebrow: "Scheduling",
        title: "Keep calendars moving without front-desk overload",
        button: "Check Scheduling Feature",
        visual: "calendar",
        points: [
          {
            title: "Offer next available slots",
            body: "Help callers choose appointment windows and confirm the details before the visit.",
          },
          {
            title: "Send clear follow-ups",
            body: "Create summaries and notifications so teams know what was promised on the call.",
          },
        ],
      },
    ],
    integrations: ["ServiceTitan", "Housecall Pro", "Jobber", "FieldEdge", "Calendly", "HubSpot", "Zapier", "Slack"],
    faqs: [
      "Can AI agents answer after-hours home service calls?",
      "Can urgent jobs be routed to dispatch?",
      "Can callers book appointments by phone?",
      "Can call notes sync with field service tools?",
    ],
    reviewBenefits: [
      {
        title: "More Booked Jobs",
        body: "Local service businesses can capture job details, service area, and availability even when crews are in the field.",
      },
      {
        title: "After-Hours Coverage",
        body: "Evening and weekend callers get a real response instead of voicemail, protecting valuable local leads.",
      },
      {
        title: "Emergency Dispatch Context",
        body: "Urgent leaks, outages, lockouts, and safety issues are flagged with the details technicians need.",
      },
    ],
    quote: {
      primary:
        "The biggest win is simple: fewer missed calls while our technicians are busy on actual jobs.",
      primaryName: "Rachel Owens",
      primaryRole: "Owner, Prime HVAC",
      secondary:
        "Emergency calls get flagged fast, and ordinary booking calls no longer pile up at the front desk.",
      secondaryName: "Dev Singh",
      secondaryRole: "Operations Manager, FixFlow",
    },
  },
  "retail-consumer": {
    accent: "#00ADB5",
    accentSoft: "#ccfbf1",
    logos: ["MODA", "Cartwell", "Luma", "KindGoods", "Shophouse", "NOVA Home", "Bloom", "Everyday", "Verv"],
    photoCards: [
      {
        title: "Order Support",
        image:
          "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Product Guidance",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Returns Triage",
        image:
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Campaign Calls",
        image:
          "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=900&q=80",
      },
    ],
    workflows: [
      {
        eyebrow: "Support",
        title: "Answer shopper questions without making them wait",
        button: "Check Order Support Feature",
        visual: "routing",
        points: [
          {
            title: "Resolve repetitive questions",
            body: "Handle order status, return steps, store details, and product availability with a polished voice experience.",
          },
          {
            title: "Escalate high-touch issues",
            body: "Move damaged orders, VIP customers, and complex requests to the right human team.",
          },
        ],
      },
      {
        eyebrow: "Guidance",
        title: "Give product help that stays aligned with your brand",
        button: "Check Product Guidance Feature",
        visual: "ivr",
        reverse: true,
        points: [
          {
            title: "Recommend next steps",
            body: "Guide customers through sizing, availability, compatibility, or store pickup questions.",
          },
          {
            title: "Keep campaign scripts consistent",
            body: "Use approved messaging for launches, promotions, and proactive customer calls.",
          },
        ],
      },
      {
        eyebrow: "Insights",
        title: "Learn from customer demand across every call",
        button: "Check Insights Feature",
        visual: "calendar",
        points: [
          {
            title: "Spot recurring issues",
            body: "Find patterns in product questions, fulfillment delays, returns, and customer sentiment.",
          },
          {
            title: "Close the support loop",
            body: "Send useful call outcomes into customer support, commerce, and marketing workflows.",
          },
        ],
      },
    ],
    integrations: ["Shopify", "Klaviyo", "Gorgias", "Zendesk", "HubSpot", "Salesforce", "Intercom", "Zapier"],
    faqs: [
      "Can AI phone agents answer retail order questions?",
      "Can callers get product guidance by phone?",
      "Can returns be triaged automatically?",
      "Can call insights show recurring shopper issues?",
    ],
    reviewBenefits: [
      {
        title: "Instant Order Support",
        body: "Shoppers can ask about orders, returns, store details, and availability without waiting in a support queue.",
      },
      {
        title: "Brand-Aligned Guidance",
        body: "Product help, campaign messaging, and launch scripts stay consistent with the customer experience you want.",
      },
      {
        title: "Useful Demand Signals",
        body: "Retail teams can spot repeated questions, fulfillment issues, and product feedback across phone conversations.",
      },
    ],
    quote: {
      primary:
        "Routine order calls get answered immediately, and our support team has more room for complex customer care.",
      primaryName: "Avery Kim",
      primaryRole: "Customer Experience Lead, MODA",
      secondary:
        "We can hear what shoppers keep asking about, which gives our merchandising team practical feedback.",
      secondaryName: "Lena Ortiz",
      secondaryRole: "Head of Ecommerce, KindGoods",
    },
  },
  "travel-hospitality": {
    accent: "#00ADB5",
    accentSoft: "#ccfbf1",
    logos: ["STAY", "Voyago", "HarborInn", "Roamly", "SuiteOps", "Tripline", "Guestly", "NorthKey", "Locale"],
    photoCards: [
      {
        title: "Guest Requests",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Booking Support",
        image:
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Itinerary Updates",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Multilingual Calls",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
      },
    ],
    workflows: [
      {
        eyebrow: "Guests",
        title: "Serve common guest requests in the moment",
        button: "Check Guest Request Feature",
        visual: "routing",
        points: [
          {
            title: "Answer booking and stay questions",
            body: "Handle confirmations, amenities, policies, and local information with a consistent guest voice.",
          },
          {
            title: "Escalate service issues",
            body: "Route urgent room, travel, or itinerary problems to the team that can solve them quickly.",
          },
        ],
      },
      {
        eyebrow: "Localization",
        title: "Support travelers across languages and time zones",
        button: "Check Multilingual Feature",
        visual: "ivr",
        reverse: true,
        points: [
          {
            title: "Use localized scripts",
            body: "Offer consistent instructions and routing for guests who prefer another language.",
          },
          {
            title: "Cover busy desk hours",
            body: "Handle overflow calls while front-desk and reservation teams focus on in-person hospitality.",
          },
        ],
      },
      {
        eyebrow: "Bookings",
        title: "Confirm reservations, changes, and follow-ups by phone",
        button: "Check Booking Feature",
        visual: "calendar",
        points: [
          {
            title: "Manage confirmations",
            body: "Remind guests about bookings, collect missing details, and send call outcomes to staff.",
          },
          {
            title: "Keep itineraries clear",
            body: "Communicate schedule changes or next steps in a calm, consistent voice.",
          },
        ],
      },
    ],
    integrations: ["Cloudbeds", "Mews", "Opera", "Guesty", "Zendesk", "HubSpot", "WhatsApp", "Zapier"],
    faqs: [
      "Can AI phone agents answer guest requests?",
      "Can voice agents support multiple languages?",
      "Can booking confirmations be automated?",
      "Can urgent guest issues be escalated to staff?",
    ],
    reviewBenefits: [
      {
        title: "Faster Guest Responses",
        body: "Travelers get quick answers about bookings, amenities, policies, and stay details without waiting at the front desk.",
      },
      {
        title: "Multilingual Service Coverage",
        body: "Guests can be supported across languages and time zones with consistent scripts and routing.",
      },
      {
        title: "Calmer Escalations",
        body: "Urgent room, itinerary, and service issues reach staff with the context needed to solve them quickly.",
      },
    ],
    quote: {
      primary:
        "Guests get answers faster, and our desk team can stay present with the people standing in front of them.",
      primaryName: "Mina Shah",
      primaryRole: "General Manager, HarborInn",
      secondary:
        "Multilingual call coverage helped us create a more consistent experience for international travelers.",
      secondaryName: "Theo Martin",
      secondaryRole: "Guest Experience Director, Voyago",
    },
  },
  "debt-collection": {
    accent: "#00ADB5",
    accentSoft: "#ccfbf1",
    logos: ["CollectIQ", "ResolvePay", "LedgerCare", "NorthBridge", "PayPath", "ClearDue", "FinRecover", "ToneWorks", "Summit"],
    photoCards: [
      {
        title: "Outbound Reminders",
        image:
          "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Payment Follow-Up",
        image:
          "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Review Workflows",
        image:
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Sensitive Handoffs",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      },
    ],
    workflows: [
      {
        eyebrow: "Outreach",
        title: "Run consistent reminders with careful tone controls",
        button: "Check Reminder Feature",
        visual: "routing",
        points: [
          {
            title: "Use approved scripts",
            body: "Keep high-volume outreach consistent with controlled language, timing, and escalation paths.",
          },
          {
            title: "Capture intent and outcome",
            body: "Record whether the caller needs a payment link, a callback, a dispute workflow, or a human review.",
          },
        ],
      },
      {
        eyebrow: "Compliance",
        title: "Route sensitive conversations to trained staff",
        button: "Check Compliance Feature",
        visual: "ivr",
        reverse: true,
        points: [
          {
            title: "Respect handoff rules",
            body: "Escalate disputes, hardship signals, wrong-party responses, and complex questions.",
          },
          {
            title: "Keep every outcome visible",
            body: "Summaries and dispositions help teams understand what happened and what should happen next.",
          },
        ],
      },
      {
        eyebrow: "Follow-Up",
        title: "Organize next steps after every call",
        button: "Check Follow-Up Feature",
        visual: "calendar",
        points: [
          {
            title: "Schedule callback windows",
            body: "Help callers choose follow-up times while keeping reminders attached to the account workflow.",
          },
          {
            title: "Prioritize human review",
            body: "Flag conversations that require supervisor attention, special handling, or documentation.",
          },
        ],
      },
    ],
    integrations: ["Salesforce", "HubSpot", "Zendesk", "DocuSign", "Twilio", "Zapier", "Slack", "Google Sheets"],
    faqs: [
      "Can AI agents run outbound payment reminders?",
      "Can sensitive debt collection calls be escalated?",
      "Can teams control scripts and call tone?",
      "Can call outcomes be logged for review?",
    ],
    reviewBenefits: [
      {
        title: "Consistent Reminder Calls",
        body: "Outbound payment reminders follow approved scripts, timing rules, and tone controls across high-volume outreach.",
      },
      {
        title: "Sensitive Call Handling",
        body: "Disputes, hardship signals, wrong-party responses, and complex questions are routed to trained staff.",
      },
      {
        title: "Clear Outcome Tracking",
        body: "Each call can leave a disposition, summary, and next step so collection teams know what to review.",
      },
    ],
    quote: {
      primary:
        "The value is consistency. Every reminder follows the approved path and every outcome is easy to review.",
      primaryName: "Jordan Miles",
      primaryRole: "Operations Lead, ResolvePay",
      secondary:
        "Our staff now focus on conversations that need care instead of spending the day repeating the same reminders.",
      secondaryName: "Sara Bennett",
      secondaryRole: "Collections Manager, ClearDue",
    },
  },
};

function CheckIcon({ color }: { color: string }) {
  return (
    <span
      className="grid size-9 shrink-0 place-items-center rounded-full border border-dashed bg-white/5 text-sm font-bold"
      style={{ borderColor: color, color }}
    >
      &#10003;
    </span>
  );
}

function Pill({ children, color }: { children: string; color: string }) {
  return (
    <span
      className="inline-flex rounded-full border px-4 py-2 text-sm font-medium shadow-sm"
      style={{ borderColor: `${color}55`, backgroundColor: `${color}18`, color }}
    >
      {children}
    </span>
  );
}

function WorkflowVisual({
  type,
  color,
  softColor,
}: {
  type: IndustryPreset["workflows"][number]["visual"];
  color: string;
  softColor: string;
}) {
  return (
    <div
      className="relative min-h-[420px] overflow-hidden rounded-[28px] p-8 shadow-sm"
      style={{
        background: `radial-gradient(circle at 22% 18%, ${softColor} 0, ${color} 24%, transparent 42%), radial-gradient(circle at 82% 26%, ${color} 0, #0f172a 32%, transparent 56%), linear-gradient(135deg, #111827, #1f2937 45%, ${color})`,
      }}
    >
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle,#fff_1px,transparent_1px)] [background-size:4px_4px]" />
      {type === "routing" ? (
        <div className="relative mx-auto mt-16 grid max-w-sm place-items-center gap-8 text-sm">
          <div className="rounded-full px-5 py-2 font-medium text-slate-950 shadow-xl" style={{ backgroundColor: color }}>
            phone customer call in
          </div>
          <div className="rounded-xl bg-white px-5 py-4 text-slate-950 shadow-xl">
            <strong>Introduction</strong>
            <p className="text-xs text-slate-500">Ask their inquiry</p>
          </div>
          <div className="self-start rounded-full px-5 py-2 font-medium text-slate-950 shadow-xl" style={{ backgroundColor: color }}>
            User has specific request
          </div>
          <div className="self-start rounded-xl bg-white px-6 py-4 text-slate-950 shadow-xl">
            <strong>Route</strong>
            <p className="text-xs text-slate-500">Send to right workflow</p>
          </div>
        </div>
      ) : null}
      {type === "ivr" ? (
        <div className="relative mx-auto mt-20 max-w-md rounded-xl bg-white p-5 text-slate-950 shadow-2xl">
          <p className="mb-4 text-sm font-semibold text-slate-700">Escalation Rule</p>
          <label className="grid gap-2 text-sm">
            Name
            <span className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600">
              Route complex request
            </span>
          </label>
          <label className="mt-3 grid gap-2 text-sm">
            Description
            <span className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600">
              Transfer caller with summary and context.
            </span>
          </label>
          <div className="absolute -right-20 -top-16 hidden w-40 rounded-[28px] bg-white p-4 shadow-2xl sm:block">
            <div className="mb-5 h-4 rounded-full" style={{ backgroundColor: color }} />
            <div className="grid grid-cols-3 gap-3 text-center">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
                <span className="grid size-9 place-items-center rounded-full bg-slate-200" key={key}>
                  {key}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {type === "calendar" ? (
        <div className="relative mx-auto mt-16 max-w-md rounded-xl bg-white p-5 text-slate-950 shadow-2xl">
          <p className="mb-4 text-sm font-semibold">Schedule Follow-Up</p>
          {["Call summary", "Owner", "Next action", "Timezone"].map((item) => (
            <div className="mb-3" key={item}>
              <p className="mb-1 text-xs text-slate-500">{item}</p>
              <div className="h-9 rounded-lg border border-slate-200 bg-white" />
            </div>
          ))}
          <div className="absolute -right-16 top-14 hidden rounded-xl bg-white p-5 shadow-2xl sm:block">
            <p className="mb-3 text-center text-sm font-semibold">November 2023</p>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
              {Array.from({ length: 35 }, (_, index) => (
                <span
                  className="grid size-7 place-items-center rounded-md"
                  key={index}
                  style={index === 10 ? { backgroundColor: color, color: "#020617" } : undefined}
                >
                  {index + 1 > 30 ? index - 29 : index + 1}
                </span>
              ))}
            </div>
          </div>
          <div
            className="absolute -right-10 -top-4 rounded-xl px-4 py-3 text-sm font-medium text-slate-950 shadow-xl"
            style={{ backgroundColor: softColor }}
          >
            A new follow-up has been scheduled.
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function IndustryPage({ slug }: { slug: string }) {
  const industry = getIndustry(slug);

  if (!industry) {
    notFound();
  }

  const preset = presets[industry.slug as IndustrySlug];

  if (!preset) {
    notFound();
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-[linear-gradient(180deg,#111827_0%,#1f2937_48%,#111827_100%)] text-slate-50">
        <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-16 px-6 pb-20 pt-32 lg:grid-cols-[0.95fr_1fr] lg:px-8">
          <div>
            <div className="mb-7 text-sm font-medium text-slate-400">
              5/5 in G2{" "}
              <span className="ml-2" style={{ color: preset.accent }}>
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </span>
            </div>
            <h1 className="max-w-3xl text-5xl font-light leading-tight tracking-normal text-white md:text-6xl">
              AI Phone Agents for{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${preset.accent}, ${preset.accentSoft}, #38bdf8)`,
                }}
              >
                {industry.title}
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">{industry.summary}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-12 items-center rounded-lg px-6 text-sm font-bold text-slate-950 shadow-sm transition hover:-translate-y-0.5"
                href="/#demo"
                style={{ backgroundColor: preset.accent }}
              >
                TRY FOR FREE
              </Link>
              <Link
                className="inline-flex min-h-12 items-center rounded-lg border border-[#374151] bg-[#1f2937] px-6 text-sm font-bold text-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#374151]"
                href="/#contact"
              >
                CONTACT SALES
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-12 text-center text-2xl font-bold text-slate-400 lg:pl-10">
            {preset.logos.map((logo) => (
              <span className="opacity-80" key={logo}>
                {logo}
              </span>
            ))}
          </div>
        </section>

        <section className="overflow-hidden bg-[#111827] pb-28" aria-label={`${industry.title} use cases`}>
          <div className="industry-marquee flex w-max gap-8">
            {[...preset.photoCards, ...preset.photoCards].map((card, index) => (
              <article
                className="relative h-72 w-[560px] overflow-hidden rounded-lg bg-slate-200"
                key={`${card.title}-${index}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                <div className="absolute inset-0 bg-slate-950/20" />
                <h2 className="absolute bottom-10 left-10 max-w-[460px] text-5xl font-light text-white">
                  {card.title}
                </h2>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#1f2937]">
          <div className="mx-auto grid max-w-7xl items-stretch gap-10 px-6 py-24 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:px-8">
            <div>
              <Pill color={preset.accent}>Reviews</Pill>
              <h2 className="mt-6 max-w-[11ch] text-5xl font-light leading-tight md:text-6xl">
                See What Customers
                <br />
                Say About Us
              </h2>
              <div className="mt-16 grid gap-9">
                {preset.reviewBenefits.map((benefit) => (
                  <div className="flex gap-6" key={benefit.title}>
                    <CheckIcon color={preset.accent} />
                    <div>
                      <h3 className="text-2xl font-bold">{benefit.title}</h3>
                      <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">{benefit.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid w-full max-w-[760px] auto-rows-fr gap-7 self-center justify-self-end sm:grid-cols-2">
              <article className="flex aspect-square h-full flex-col justify-between rounded-lg p-8 text-slate-950 lg:p-9" style={{ backgroundColor: preset.accent }}>
                <p className="text-xl font-medium leading-8 md:text-[1.35rem] md:leading-9">
                  &quot;{preset.quote.primary}&quot;
                </p>
                <div className="border-t border-slate-950/20 pt-6">
                  <h3 className="text-xl font-bold md:text-2xl">{preset.quote.primaryName}</h3>
                  <p className="mt-1 text-slate-800">{preset.quote.primaryRole}</p>
                </div>
              </article>
              <article className="flex aspect-square h-full flex-col justify-between rounded-lg border border-dashed border-[#374151] bg-[#111827] p-8 lg:p-9">
                <p className="text-xl font-medium leading-8 md:text-[1.35rem] md:leading-9">
                  &quot;{preset.quote.secondary}&quot;
                </p>
                <div className="border-t border-[#374151] pt-6">
                  <h3 className="text-xl font-bold md:text-2xl">{preset.quote.secondaryName}</h3>
                  <p className="mt-1 text-slate-300">{preset.quote.secondaryRole}</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[#111827]">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <h2 className="max-w-5xl text-5xl font-light leading-tight md:text-6xl">
              Enhance {industry.title} Service And Offload Tasks With AI Phone Agents.
            </h2>
            <div className="mt-20 grid gap-24">
              {preset.workflows.map((section) => (
                <div
                  className={`grid items-center gap-14 lg:grid-cols-2 ${
                    section.reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                  key={section.title}
                >
                  <WorkflowVisual type={section.visual} color={preset.accent} softColor={preset.accentSoft} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: preset.accent }}>
                      {section.eyebrow}
                    </p>
                    <h3 className="mt-4 max-w-xl text-3xl font-medium leading-snug">{section.title}</h3>
                    <div className="mt-8 border-t border-[#374151] pt-8">
                      <div className="grid gap-9">
                        {section.points.map((point) => (
                          <div className="flex gap-6" key={point.title}>
                            <CheckIcon color={preset.accent} />
                            <div>
                              <h4 className="text-2xl font-bold leading-snug">{point.title}</h4>
                              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">{point.body}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Link
                      className="mt-10 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-[#374151] bg-[#1f2937] px-6 text-sm font-bold shadow-sm hover:bg-[#374151]"
                      href="/#demo"
                      style={{ color: preset.accent }}
                    >
                      {section.button}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1f2937]">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <Pill color={preset.accent}>Integrations</Pill>
            <h2 className="mt-6 text-5xl font-light leading-tight md:text-6xl">
              Integrate With Your Existing Stack
            </h2>
            <p className="mt-6 max-w-6xl text-lg leading-8 text-slate-300">
              Connect call summaries, routing outcomes, and follow-up tasks to the tools your {industry.title.toLowerCase()} team already uses.
            </p>
            <div className="mt-16 overflow-hidden">
              <div className="industry-integration-marquee flex w-max gap-5">
                {[...preset.integrations, ...preset.integrations].map((integration, index) => (
                  <div
                    className="flex min-h-24 w-72 shrink-0 items-center gap-4 rounded-xl border border-[#374151] bg-[#111827] px-6 shadow-sm"
                    key={`${integration}-${index}`}
                  >
                    <span
                      className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#1f2937] text-sm font-bold shadow-sm"
                      style={{ color: preset.accent }}
                    >
                      {integration.slice(0, 2)}
                    </span>
                    <strong className="text-2xl leading-tight">{integration}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-20 rounded-2xl border border-[#374151] bg-[#111827] p-10">
              <h3 className="max-w-xl text-3xl font-bold leading-tight">
                Don&apos;t have developer resources? Find a certified partner to help.
              </h3>
              <Link
                className="mt-8 inline-flex min-h-14 items-center rounded-lg px-8 text-sm font-bold tracking-[0.2em] text-slate-950"
                href="/#contact"
                style={{ backgroundColor: preset.accent }}
              >
                FIND A PARTNER
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#111827]">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <Pill color={preset.accent}>Pricing</Pill>
            <h2 className="mt-6 text-5xl font-light leading-tight md:text-6xl">
              Cut Costs By 90% With AI Phone Agents
            </h2>
            <p className="mt-6 max-w-5xl text-base leading-7 text-slate-300">
              Scale phone coverage for routine calls, after-hours demand, and follow-up work without compromising service quality.
            </p>
            <div className="mt-28 grid gap-8 rounded-[28px] border border-[#374151] bg-[#1f2937] p-8 lg:grid-cols-2">
              <article className="p-8">
                <h3 className="mt-10 text-2xl font-bold">Pay as you go</h3>
                <p className="mt-4 text-slate-300">$0 to start.</p>
                <ul className="mt-12 grid gap-6 text-lg">
                  {[
                    "$0.07-$0.12 per minute - Pay only for what you use.",
                    "60 mins of free access.",
                    "20 concurrent calls.",
                    "10 Free Knowledge Bases.",
                  ].map((item) => (
                    <li className="flex gap-4" key={item}>
                      <span
                        className="grid size-5 place-items-center rounded-full text-xs text-slate-950"
                        style={{ backgroundColor: preset.accent }}
                      >
                        &#10003;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  className="mt-12 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-[#374151] bg-[#111827] text-sm font-bold hover:bg-[#374151]"
                  href="/#demo"
                  style={{ color: preset.accent }}
                >
                  Get Started
                </Link>
              </article>
              <article className="rounded-xl p-10 text-slate-950" style={{ backgroundColor: preset.accent }}>
                <div className="grid size-12 place-items-center rounded-lg bg-slate-950 text-white">$</div>
                <h3 className="mt-8 text-2xl font-medium">Enterprise Plan</h3>
                <p className="mt-3 max-w-md leading-7 text-slate-800">
                  For companies with large call volumes, custom workflow needs, or dedicated support requirements.
                </p>
                <ul className="mt-10 grid gap-7 font-medium leading-7">
                  {[
                    "White glove service for your use case.",
                    "Premium support with dedicated solution engineer teams.",
                    "Custom pricing and concurrent calls based on your needs.",
                  ].map((item) => (
                    <li className="flex gap-4" key={item}>
                      <span className="grid size-5 place-items-center rounded-full bg-slate-950 text-xs text-white">
                        &#10003;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  className="mt-12 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white"
                  href="/#contact"
                >
                  Talk To Sales
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[#1f2937]">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-[0.8fr_1fr] lg:px-8">
            <div>
              <Pill color={preset.accent}>F.A.Q</Pill>
              <h2 className="mt-6 text-5xl font-light leading-tight md:text-6xl">Questions & Answers</h2>
              <p className="mt-6 text-slate-300">All accounts include a 60-minute free trial.</p>
            </div>
            <div className="grid gap-2">
              {preset.faqs.map((faq) => (
                <details className="group rounded-xl border border-[#374151] bg-[#111827] p-6" key={faq}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
                    {faq}
                    <span className="transition group-open:rotate-180" style={{ color: preset.accent }}>
                      v
                    </span>
                  </summary>
                  <p className="mt-4 leading-7 text-slate-300">
                    vozon.ai can automate routine {industry.title.toLowerCase()} calls, collect context,
                    and hand off complex requests to your team with clear summaries and routing rules.
                  </p>
                </details>
              ))}
              <p className="mt-5 text-sm text-slate-300">
                More questions? Visit our{" "}
                <Link
                  className="rounded-md bg-[#111827] px-2 py-1 font-bold"
                  href="/#resources"
                  style={{ color: preset.accent }}
                >
                  docs
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
      <style>{`
        @keyframes industry-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .industry-marquee {
          animation: industry-marquee 30s linear infinite;
        }

        .industry-integration-marquee {
          animation: industry-marquee 38s linear infinite;
        }
      `}</style>
    </SiteLayout>
  );
}
