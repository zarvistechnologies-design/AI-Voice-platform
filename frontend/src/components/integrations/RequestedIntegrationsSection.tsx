import Image from "next/image";
import Link from "next/link";

type AdditionalIntegration = {
  name: string;
  category: string;
  description: string;
  logo: string;
};

// Calendar, Sheets, and Slack already have functional cards in IntegrationsShell.
const additionalIntegrations: AdditionalIntegration[] = [
  { name: "Zapier", category: "Automation", description: "Send signed call events to a Zapier webhook to start automations.", logo: "/images/integrations/zapier.png" },
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
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                Webhook available
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
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Use a Zapier Catch Hook URL as the destination for signed Vozon call events.
            </p>
            <div className="mt-auto pt-5">
              <Link
                href="/dashboard/developers"
                className="inline-flex min-h-10 items-center rounded-lg bg-[#118778] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d6f63]"
              >
                Set up webhook
              </Link>
            </div>
          </div>
        </article>
      ))}
    </>
  );
}
