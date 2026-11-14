import type { SolutionLandingContent } from "@/components/layout/SolutionLandingPage";

type IndustryStoryContent = Pick<SolutionLandingContent, "headline" | "videoHeadline" | "launchHeadline" | "stories" | "sample">;

export const industryLandingContent: Record<string, IndustryStoryContent> = {
  "financial-services": {
    headline: "Financial calls, handled with clarity.",
    videoHeadline: "One platform. Every client conversation.",
    launchHeadline: "Launch a financial services voice agent.",
    sample: { caller: "Could I speak with someone about opening an account?", agent: "I can help arrange that. What time works for a consultation?", outcome: "Advisor consultation requested" },
    stories: [
      { eyebrow: "Consultations", title: "Book the right conversation on the first call.", body: "Help new and existing clients reach the right advisor. With a connected calendar, an agent can collect the reason for the call, offer available times, and pass the details to your team.", steps: ["Caller need understood", "Availability checked", "Advisor receives context"] },
      { eyebrow: "Follow-ups", title: "Keep important client follow-ups on schedule.", body: "Use approved outreach for document reminders, service updates, or a requested callback. Record the response so staff can see what happened before taking the next step.", steps: ["Follow-up scheduled", "Client response captured", "Team task updated"] },
      { eyebrow: "Service questions", title: "Answer routine questions without losing the personal touch.", body: "Give callers clear information about office hours, required documents, or the status of a connected request. Questions about advice, eligibility, or exceptions move to an authorized specialist.", steps: ["Question answered", "Request checked", "Specialist involved when needed"], example: { caller: "Which documents should I bring?", agent: "I can share the approved checklist for your appointment." } },
      { eyebrow: "Intake & handoff", title: "Give advisors the context before they pick up.", body: "Collect basic contact and request details within the boundaries you set. A concise summary helps a person continue the conversation without asking the client to start over.", steps: ["Contact details captured", "Purpose of call recorded", "Advisor handoff prepared"] },
      { eyebrow: "Language", title: "Meet clients in a language they know.", body: "Configure the languages and voices that fit your customers. Review important financial terms and escalation paths so conversations remain clear across regions." },
    ],
  },
  insurance: {
    headline: "Insurance calls, handled with confidence.",
    videoHeadline: "One platform. Every policyholder conversation.",
    launchHeadline: "Launch an insurance voice agent.",
    sample: { caller: "I need to report damage to my car.", agent: "I can collect the first details and connect you with the claims team.", outcome: "Claim intake sent for review" },
    stories: [
      { eyebrow: "Claims intake", title: "Start a claim with the details your team needs.", body: "Guide a caller through the first facts of an incident, confirm key information, and pass a structured intake record to the claims team. Coverage and claim decisions stay with authorized staff.", steps: ["Incident details gathered", "Information confirmed", "Claims team notified"] },
      { eyebrow: "Renewals", title: "Remind policyholders before a renewal is missed.", body: "Make approved reminder calls, answer basic process questions, and record whether the customer wants to speak with an agent. The next step stays visible to your team.", steps: ["Renewal reminder sent", "Response captured", "Agent callback assigned"] },
      { eyebrow: "Policy questions", title: "Give clear answers from approved information.", body: "Help with policy documents, payment dates, contact details, and service hours when the right information is connected. Route coverage interpretations and unusual cases to a licensed person.", steps: ["Question understood", "Approved information checked", "Specialist handoff if needed"], example: { caller: "Where can I find my policy documents?", agent: "I can explain how to access them or connect you with support." } },
      { eyebrow: "Documents & follow-up", title: "Keep each case moving after the call.", body: "Collect missing document details, note a promised callback, and keep the conversation outcome with the case. Staff can review the record before contacting the customer.", steps: ["Missing item identified", "Follow-up recorded", "Case owner updated"] },
      { eyebrow: "Language", title: "Support policyholders across languages.", body: "Choose voices and languages that serve your customers. Test policy terms, names, and escalation instructions so the experience remains easy to understand." },
    ],
  },
  logistics: {
    headline: "Delivery calls, handled in motion.",
    videoHeadline: "One platform. Every delivery conversation.",
    launchHeadline: "Launch a logistics voice agent.",
    sample: { caller: "My delivery is due today. Can I change the address?", agent: "I can check the shipment and capture the new details for your dispatch team.", outcome: "Delivery change request recorded" },
    stories: [
      { eyebrow: "Delivery updates", title: "Answer status calls with current information.", body: "When connected to your tracking system, an agent can explain the latest available shipment status and expected next step. It can flag gaps or unusual updates for an operations teammate.", steps: ["Shipment located", "Latest update shared", "Exception flagged if needed"] },
      { eyebrow: "Proactive contact", title: "Reach customers before a delivery is missed.", body: "Use approved calls to confirm a delivery window, request access instructions, or arrange another attempt. Capture each response for dispatch and customer support.", steps: ["Customer contacted", "Instructions captured", "Route updated"] },
      { eyebrow: "Driver coordination", title: "Move urgent information to the right person.", body: "Collect location, order reference, and the reason for a driver's call. Route a breakdown, failed handoff, or access problem with enough context for dispatch to act.", steps: ["Driver identified", "Issue classified", "Dispatcher notified"], example: { caller: "I cannot reach the delivery address.", agent: "I can capture your location and alert dispatch now." } },
      { eyebrow: "Exception handling", title: "Turn an exception call into an action.", body: "Record damaged parcels, missed deliveries, and address changes in a consistent format. Share a summary and next task with the team responsible for resolution.", steps: ["Issue documented", "Priority assigned", "Next action created"] },
      { eyebrow: "Language", title: "Keep routes clear across regions.", body: "Serve recipients and field teams in supported languages. Test addresses, local place names, and delivery instructions before rollout." },
    ],
  },
  "home-services": {
    headline: "Every service call, answered well.",
    videoHeadline: "One platform. Every job conversation.",
    launchHeadline: "Launch a home services voice agent.",
    sample: { caller: "My heating has stopped working. Is someone available today?", agent: "I can take the details, check availability, and flag this for the on-call team.", outcome: "Urgent job request routed" },
    stories: [
      { eyebrow: "Job bookings", title: "Book the job while the caller is ready.", body: "Ask what work is needed, where it is needed, and when the customer is available. With a connected schedule, the agent can offer suitable appointment times and send the job details to your team.", steps: ["Service need captured", "Availability checked", "Job request created"] },
      { eyebrow: "Reminders", title: "Keep visits and maintenance on track.", body: "Confirm upcoming appointments, collect access notes, and remind customers about planned maintenance. Record changes so technicians have the latest information.", steps: ["Visit reminder sent", "Customer reply captured", "Technician notes updated"] },
      { eyebrow: "Service questions", title: "Answer common questions at any hour.", body: "Share approved information about service areas, hours, appointment preparation, and the booking process. When a question needs a technician, pass it through with the caller's details.", steps: ["Service area checked", "Question answered", "Specialist callback if needed"], example: { caller: "Do you cover my neighborhood?", agent: "I can check your address against our service area." } },
      { eyebrow: "Urgent dispatch", title: "Get urgent requests to the on-call team.", body: "Collect the address, issue, and safety context before escalating. Your rules decide which calls need immediate human review and which can be scheduled normally.", steps: ["Urgency assessed", "Location confirmed", "On-call team alerted"] },
      { eyebrow: "Language", title: "Make service easier for every household.", body: "Offer the languages and voices your customers use. Test local addresses, service terms, and handoff rules to help callers explain the problem clearly." },
    ],
  },
  "retail-consumer": {
    headline: "Shopper questions, answered with care.",
    videoHeadline: "One platform. Every shopper conversation.",
    launchHeadline: "Launch a retail voice agent.",
    sample: { caller: "Can you tell me where my order is?", agent: "I can check the latest order update and help with the next step.", outcome: "Order update shared" },
    stories: [
      { eyebrow: "Order support", title: "Give shoppers an answer on the first call.", body: "Check connected order and delivery information to answer status questions. If a shipment is late or missing, capture the issue and route it to the support team.", steps: ["Order located", "Status shared", "Exception sent to support"] },
      { eyebrow: "Follow-ups", title: "Keep customers informed after a purchase.", body: "Send approved updates about delivery, pickup, or a requested callback. Record the response so the next team member sees the full conversation.", steps: ["Update scheduled", "Response captured", "Customer record updated"] },
      { eyebrow: "Product & store questions", title: "Help customers find the right information.", body: "Answer approved questions about store hours, product availability, delivery options, and policies. Connect product-specific or sensitive requests with a knowledgeable teammate.", steps: ["Intent understood", "Approved answer shared", "Store team involved if needed"], example: { caller: "Is this item available for pickup?", agent: "I can check current availability at your chosen store." } },
      { eyebrow: "Returns & exchanges", title: "Make the next step clear when something goes wrong.", body: "Collect an order reference and the reason for a return or exchange. Explain approved steps and pass exceptions to a person for review.", steps: ["Order reference captured", "Reason recorded", "Return path shared"] },
      { eyebrow: "Language", title: "Speak to shoppers wherever they are.", body: "Choose the languages and voices that fit your market. Review product names, policy wording, and local delivery terms before launch." },
    ],
  },
  "travel-hospitality": {
    headline: "Guest conversations, made effortless.",
    videoHeadline: "One platform. Every guest conversation.",
    launchHeadline: "Launch a hospitality voice agent.",
    sample: { caller: "Can I move my check-in time and ask about parking?", agent: "I can note your arrival time and check the property's parking information.", outcome: "Guest request sent to the front desk" },
    stories: [
      { eyebrow: "Reservations", title: "Help guests book or change a stay.", body: "Answer booking questions, collect stay dates and preferences, and use a connected reservation system to check available options. Pass special requests to the right person.", steps: ["Stay details gathered", "Options checked", "Reservation team updated"] },
      { eyebrow: "Pre-arrival", title: "Make arrivals smoother before guests reach you.", body: "Send approved confirmation or reminder calls for check-in, transport, or arrival details. Capture changes early so the front desk can prepare.", steps: ["Arrival confirmed", "Preferences captured", "Front desk notified"] },
      { eyebrow: "Itinerary questions", title: "Answer useful questions in the moment.", body: "Share approved details about hours, amenities, directions, and itinerary steps. A human teammate can take over when a guest needs a tailored recommendation or exception.", steps: ["Question understood", "Property details shared", "Concierge handoff if needed"], example: { caller: "What time does the airport shuttle leave?", agent: "I can check the current schedule for your stay." } },
      { eyebrow: "Guest requests", title: "Keep every request connected to the team.", body: "Record a room request, service issue, or callback with the guest's context. The responsible team can see the request and the promised next action.", steps: ["Guest identified", "Request logged", "Team task assigned"] },
      { eyebrow: "Language", title: "Welcome guests in their own language.", body: "Offer multilingual calls for travelers. Test property names, local directions, and important instructions so guests know what happens next." },
    ],
  },
  "debt-collection": {
    headline: "Sensitive calls, handled respectfully.",
    videoHeadline: "One platform. Every account conversation.",
    launchHeadline: "Launch a collections voice agent.",
    sample: { caller: "I received a reminder and need to talk about my account.", agent: "I can explain the next steps and connect you with an authorized team member.", outcome: "Callback requested for account review" },
    stories: [
      { eyebrow: "Reminders", title: "Make approved reminders clear and considerate.", body: "Use scripts, calling windows, and contact rules approved by your team. Record whether the person wants information, a callback, or another path so staff can follow up appropriately.", steps: ["Approved reminder placed", "Response recorded", "Next step assigned"] },
      { eyebrow: "Callback requests", title: "Bring the right person into the conversation.", body: "When someone asks to discuss an account, capture a preferred time and reason for contact. Route sensitive questions or disputed details to authorized staff.", steps: ["Callback requested", "Preference captured", "Specialist notified"] },
      { eyebrow: "Account questions", title: "Explain the process without overstepping.", body: "Share approved payment channels, office hours, and document steps after the appropriate verification. Keep negotiations, disputes, and legal questions with trained people.", steps: ["Identity step completed", "Approved information shared", "Human review when required"], example: { caller: "How can I speak to someone about my account?", agent: "I can connect you with an authorized team member." } },
      { eyebrow: "Disputes & outcomes", title: "Give the team a precise record of what happened.", body: "Capture a dispute or inability-to-pay request without making a decision on the call. Document the stated concern and place the next action with an authorized team member.", steps: ["Concern documented", "Case marked for review", "Follow-up assigned"] },
      { eyebrow: "Language", title: "Keep essential information understandable.", body: "Select languages and voices appropriate for your customers. Review mandated wording, disclosures, and opt-out handling before any live outreach." },
    ],
  },
};
