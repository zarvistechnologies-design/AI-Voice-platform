"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSession } from "@/lib/auth";

const sections: Record<string, string> = {
  agents: "Voice agents", analytics: "Analytics", campaign: "Campaigns",
  knowledge: "Knowledge base", calls: "Call logs", billing: "Billing",
  integrations: "Integrations", developers: "Developers", profile: "Profile & security",
  settings: "Workspace settings", "phone-number": "Phone numbers", "white-label": "White label",
};

export function WorkspaceBar({ expanded, onNavigate }: { expanded: boolean; onNavigate: (href: string) => boolean }) {
  const session = getSession();
  const pathname = usePathname();
  const section = sections[pathname.split("/")[2]] || "Workspace";
  return (
    <div className={`workspace-bar ${expanded ? "is-expanded" : ""}`}>
      <div className="workspace-breadcrumb">
        <span className="workspace-mark" aria-hidden="true">{(session?.organization?.name || session?.name || "W").slice(0, 1).toUpperCase()}</span>
        <span className="workspace-name">{session?.organization?.name || `${session?.name?.split(" ")[0] || "My"}'s workspace`}</span>
        <span className="workspace-divider" aria-hidden="true">/</span>
        <span className="workspace-current">{section}</span>
      </div>
      <div className="workspace-shortcuts">
        <Link href="/docs" className="workspace-help" onClick={(event) => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && !onNavigate('/docs')) event.preventDefault(); }}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 16.5v.5"/></svg><span>Help & docs</span></Link>
        <span className="workspace-shortcut-divider" />
        <Link href="/dashboard/settings" className="workspace-settings" aria-label="Workspace settings" onClick={(event) => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && !onNavigate('/dashboard/settings')) event.preventDefault(); }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 17h16"/><rect x="8" y="4" width="4" height="6" rx="1"/><rect x="14" y="14" width="4" height="6" rx="1"/></svg></Link>
      </div>
    </div>
  );
}
