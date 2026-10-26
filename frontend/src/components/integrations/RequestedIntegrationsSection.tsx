import Image from "next/image";
import Link from "next/link";

type AdditionalIntegration = {
  name: string;
  category: string;
  description: string;
  logo: string;
  webhook?: boolean;
};

// Calendar, Sheets, and Slack already have functional cards in IntegrationsShell.
const additionalIntegrations: AdditionalIntegration[] = [
  { name: "Atlassian", category: "Work management", description: "Bring project and team activity into voice workflows.", logo: "/images/integrations/atlassian.svg" },
  { name: "Razorpay API", category: "Payments", description: "Look up payments and merchant activity during calls.", logo: "/images/integrations/razorpay.png" },
  { name: "Zapier", category: "Automation", description: "Send signed call events to a Zapier webhook to start automations.", logo: "/images/integrations/zapier.png", webhook: true },
  { name: "Zoho CRM", category: "CRM", description: "Use lead and customer records in your call workflows.", logo: "/images/integrations/zoho.svg" },
  { name: "Asana", category: "Work management", description: "Create and track follow-up tasks from conversations.", logo: "/images/integrations/asana.svg" },
  { name: "ClickUp", category: "Work management", description: "Turn call outcomes into tasks and project updates.", logo: "/images/integrations/clickup.svg" },
  { name: "Freshsales", category: "CRM", description: "Keep lead and contact records in sync with calls.", logo: "/images/integrations/freshsales.ico" },
  { name: "Google Docs", category: "Documents", description: "Access documents and keep call notes in one place.", logo: "/images/integrations/googledocs.svg" },
  { name: "Google Drive", category: "Documents", description: "Find files that help agents answer customer questions.", logo: "/images/integrations/googledrive.svg" },
  { name: "Gmail", category: "Messaging", description: "Follow up with callers through email workflows.", logo: "/images/integrations/gmail.svg" },
  { name: "Linear", category: "Work management", description: "Capture product issues and next steps from calls.", logo: "/images/integrations/linear.svg" },
  { name: "monday.com", category: "Work management", description: "Update boards and track work that starts in a call.", logo: "/images/integrations/monday.ico" },
  { name: "Notion", category: "Knowledge", description: "Use workspace pages as context for voice agents.", logo: "/images/company-logos/notion.svg" },
  { name: "Prospeo", category: "Sales", description: "Enrich prospect details before sales follow-ups.", logo: "/images/integrations/prospeo.png" },
  { name: "Razorpay OAuth", category: "Payments", description: "Authorize a merchant account for payment workflows.", logo: "/images/integrations/razorpay.png" },
  { name: "Salesforce", category: "CRM", description: "Bring lead and customer activity into voice workflows.", logo: "/images/integrations/salesforce.svg" },
  { name: "Jira", category: "Work management", description: "Create issues and track follow-ups from conversations.", logo: "/images/integrations/jira.svg" },
];

export function RequestedIntegrationsSection() {
  return (
    <>
      {additionalIntegrations.map((entry) => (
        <article
          key={entry.name}
          className="min-h-[300px] overflow-hidden rounded-xl border border-[#dfe7e4] bg-white transition hover:border-[#9fcfc3] hover:shadow-[0_14px_34px_rgba(17,62,53,.08)]"
        >
          <div className="flex h-full flex-col p-5">
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-12 min-w-12 place-items-start">
                <Image
                  alt={`${entry.name} logo`}
                  className="h-12 w-auto max-w-28 object-contain object-left"
                  height={48}
                  src={entry.logo}
                  unoptimized={entry.logo.endsWith(".ico")}
                  width={112}
                />
              </span>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${entry.webhook ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {entry.webhook ? "Webhook available" : "Coming soon"}
              </span>
            </div>
            <span className="mt-5 text-[10px] font-bold uppercase tracking-[.14em] text-[#71817d]">
              {entry.category}
            </span>
            <h2 className="mt-1 text-xl font-semibold tracking-[-.02em] text-slate-950">
              {entry.name}
            </h2>
            <p className="mt-1 min-h-12 text-sm leading-6 text-slate-600">
              {entry.description}
            </p>
            {entry.webhook ? (
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Outbound webhooks only; Zapier sign-in is not available yet.
              </p>
            ) : null}
            <div className="mt-auto pt-5">
              {entry.webhook ? (
                <Link
                  href="/dashboard/developers"
                  className="inline-flex min-h-10 items-center rounded-lg bg-[#118778] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d6f63]"
                >
                  Set up webhook
                </Link>
              ) : (
                <button
                  disabled
                  type="button"
                  className="inline-flex min-h-10 cursor-not-allowed items-center rounded-lg border border-[#dfe7e4] bg-[#f5f8f7] px-4 py-2 text-sm font-semibold text-slate-500"
                >
                  Coming soon
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </>
  );
}
