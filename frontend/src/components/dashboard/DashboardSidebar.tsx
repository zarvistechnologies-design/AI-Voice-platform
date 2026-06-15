"use client";

import Link from "next/link";

type SidebarItem = {
  label: string;
  href: string;
  icon: "agent" | "phone" | "analytics" | "campaign" | "knowledge" | "logs" | "billing" | "integrations" | "developer" | "profile" | "settings";
};

const sidebarItems: SidebarItem[] = [
  { label: "Voice Agents", href: "/dashboard", icon: "agent" },
  { label: "Phone Number", href: "/dashboard/phone-number", icon: "phone" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "analytics" },
  { label: "Agent Knowledge", href: "/dashboard", icon: "knowledge" },
  { label: "Call Logs", href: "/dashboard/calls", icon: "logs" },
  { label: "Billing", href: "/dashboard/billing", icon: "billing" },
  { label: "Integrations", href: "/dashboard/integrations", icon: "integrations" },
  { label: "Developer", href: "/dashboard/developer", icon: "developer" },
  { label: "Profile", href: "/dashboard/profile", icon: "profile" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

function SidebarIcon({ icon }: { icon: SidebarItem["icon"] | "mic" }) {
  const iconClass = "size-5 fill-none stroke-current stroke-[2.1]";

  if (icon === "mic") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 15a4 4 0 0 0 4-4V6a4 4 0 1 0-8 0v5a4 4 0 0 0 4 4Z" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v4M9 22h6" />
      </svg>
    );
  }

  if (icon === "agent") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10h10a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3Z" />
        <path d="M12 10V6M9 6h6M8.5 15h.01M15.5 15h.01" />
      </svg>
    );
  }

  if (icon === "phone") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.6 4.8 9 7.2a2 2 0 0 1 .4 2.2l-.8 1.7a12 12 0 0 0 5.3 5.3l1.7-.8a2 2 0 0 1 2.2.4l2.4 2.4a1.8 1.8 0 0 1-.2 2.7c-1 .7-2.2 1-3.6.8C9.4 20.7 3.3 14.6 2.1 7.6 1.9 6.2 2.2 5 2.9 4a1.8 1.8 0 0 1 2.7-.2Z" />
      </svg>
    );
  }

  if (icon === "campaign") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10v4h3l6 4V6l-6 4H4Z" />
        <path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a7.5 7.5 0 0 1 0 11" />
      </svg>
    );
  }

  if (icon === "analytics") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 20V10M12 20V4M19 20v-7" />
        <path d="M3 20h18" />
      </svg>
    );
  }

  if (icon === "knowledge") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5M8 13h8M8 17h5" />
      </svg>
    );
  }

  if (icon === "logs") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 6h11M7 12h11M7 18h7" />
        <path d="M4 6h.01M4 12h.01M4 18h.01" />
      </svg>
    );
  }

  if (icon === "billing") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M3 10h18M7 15h4" />
      </svg>
    );
  }

  if (icon === "developer") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
      </svg>
    );
  }

  if (icon === "integrations") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 12h8M7 8V5M17 8V5M7 19v-3M17 19v-3" />
        <rect x="4" y="8" width="16" height="8" rx="3" />
      </svg>
    );
  }

  if (icon === "profile") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.3 7A2 2 0 0 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  );
}

type DashboardSidebarProps = {
  activeLabel?: string;
  userInitials: string;
  onLogout: () => void;
};

export function DashboardSidebar({
  activeLabel = "Voice Agents",
  userInitials,
  onLogout,
}: DashboardSidebarProps) {
  return (
    <aside className="flex gap-1.5 border-b border-[#e5e7eb] bg-white px-2 py-1.5 lg:sticky lg:top-0 lg:h-screen lg:flex-col lg:items-center lg:border-r lg:border-b-0 lg:px-0 lg:py-2.5">
      <Link
        className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#0f172a] text-white shadow-[0_10px_22px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5"
        href="/dashboard"
        title="Voice Platform"
        aria-label="Voice Platform"
      >
        <SidebarIcon icon="mic" />
      </Link>

      <nav
        className="flex flex-1 gap-1.5 overflow-x-auto lg:mt-3 lg:flex-col lg:items-center lg:overflow-visible"
        aria-label="Dashboard navigation"
      >
        {sidebarItems.map((item) => {
          const isActive = item.label === activeLabel;

          return (
            <Link
              className={`group relative grid size-9 shrink-0 place-items-center rounded-lg transition ${
                isActive
                  ? "bg-[#e9efff] text-[#2563eb]"
                  : "text-[#747b88] hover:bg-[#f1f5f9] hover:text-[#111827]"
              }`}
              href={item.href}
              key={item.label}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <SidebarIcon icon={item.icon} />
              <span className="app-label pointer-events-none absolute left-[calc(100%+10px)] z-20 hidden min-w-max rounded-md bg-[#111827] px-2 py-1 text-white opacity-0 shadow-xl transition group-hover:opacity-100 lg:block">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <button
        className="app-label ml-auto grid size-9 shrink-0 place-items-center rounded-full border border-[#c8cbd2] bg-[#2d2f34] text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.16)] transition hover:-translate-y-0.5 lg:mt-auto lg:ml-0"
        type="button"
        title="Logout"
        aria-label="Logout"
        onClick={onLogout}
      >
        {userInitials}
      </button>
    </aside>
  );
}
