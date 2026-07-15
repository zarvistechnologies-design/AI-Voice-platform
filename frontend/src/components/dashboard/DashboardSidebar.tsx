"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { announceDashboardNavigation } from "@/components/dashboard/DashboardNavigationFeedback";

type SidebarItem = {
  label: string;
  href: string;
  icon: "agent" | "phone" | "campaign" | "knowledge" | "logs" | "billing" | "integrations" | "developers";
};

type SidebarIconName = SidebarItem["icon"];

const sidebarGroups: { label: string; items: SidebarItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { label: "Voice Agents", href: "/dashboard/agents", icon: "agent" },
      { label: "Phone Number", href: "/dashboard/phone-number", icon: "phone" },
      { label: "Campaigns", href: "/dashboard/campaign", icon: "campaign" },
    ],
  },
  {
    label: "Knowledge & activity",
    items: [
      { label: "Knowledge Base", href: "/dashboard/knowledge", icon: "knowledge" },
      { label: "Call Logs", href: "/dashboard/calls", icon: "logs" },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Billing", href: "/dashboard/billing", icon: "billing" },
      { label: "Integrations", href: "/dashboard/integrations", icon: "integrations" },
      { label: "Developers", href: "/dashboard/developers", icon: "developers" },
    ],
  },
];

const prefetchedDashboardRoutes = new Set<string>();

const accountMenuItems = [
  { label: "Profile & security", detail: "Email, sessions and account", href: "/dashboard/profile", icon: "profile" },
  { label: "Team & workspace", detail: "Members, roles and invitations", href: "/dashboard/settings#team", icon: "team" },
] as const;

function AccountMenuIcon({ icon }: { icon: (typeof accountMenuItems)[number]["icon"] }) {
  const iconClass = "size-4.5 fill-none stroke-current stroke-[1.9]";
  if (icon === "profile") {
    return <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
  }
  return <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}

function SidebarIcon({ icon }: { icon: SidebarIconName }) {
  const iconClass = "size-5 fill-none stroke-current stroke-[2.1]";

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

  if (icon === "integrations") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 12h8M7 8V5M17 8V5M7 19v-3M17 19v-3" />
        <rect x="4" y="8" width="16" height="8" rx="3" />
      </svg>
    );
  }

  if (icon === "developers") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />
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
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onBeforeNavigate?: (href: string) => boolean;
  showUserSidebar: boolean;
  setShowUserSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

export function DashboardSidebar({
  activeLabel = "Voice Agents",
  userInitials,
  userName,
  userEmail,
  onLogout,
  onBeforeNavigate,
  showUserSidebar,
  setShowUserSidebar,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedPreference = localStorage.getItem("showUserSidebar");
      if (savedPreference !== null) setShowUserSidebar(savedPreference === "1");
    } catch {
      /* local storage may be unavailable */
    }
  }, [setShowUserSidebar]);

  useEffect(() => {
    if (!accountMenuOpen) return undefined;
    function closeAccountMenu(event: PointerEvent) {
      if (!accountMenuRef.current?.contains(event.target as Node)) setAccountMenuOpen(false);
    }
    function closeAccountMenuWithKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") setAccountMenuOpen(false);
    }
    document.addEventListener("pointerdown", closeAccountMenu);
    document.addEventListener("keydown", closeAccountMenuWithKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeAccountMenu);
      document.removeEventListener("keydown", closeAccountMenuWithKeyboard);
    };
  }, [accountMenuOpen]);

  function beginNavigation(href: string) {
    const targetPathname = href.split(/[?#]/, 1)[0];
    if (targetPathname !== pathname && onBeforeNavigate && !onBeforeNavigate(href)) return false;
    if (targetPathname !== pathname) announceDashboardNavigation(href, pathname);
    return true;
  }

  function prefetchDashboardRoute(href: string) {
    if (!prefetchedDashboardRoutes.has(href)) {
      prefetchedDashboardRoutes.add(href);
      router.prefetch(href);
    }
    void import("@/lib/dashboardDataPrefetch")
      .then(({ prefetchDashboardData }) => prefetchDashboardData(href))
      .catch(() => undefined);
  }

  function toggleSidebar() {
    setShowUserSidebar((current) => {
      const next = !current;
      try {
        localStorage.setItem("showUserSidebar", next ? "1" : "0");
      } catch {
        /* local storage may be unavailable */
      }
      return next;
    });
  }

  return (
    <>
      <aside
        className={`z-40 flex min-w-0 items-center gap-2 border-b border-white/[0.07] bg-[#07110f] px-2 py-2 text-white shadow-[0_12px_35px_rgba(0,0,0,0.28)] lg:fixed lg:inset-y-0 lg:left-0 lg:h-dvh lg:flex-col lg:items-stretch lg:border-r lg:border-b-0 lg:bg-[radial-gradient(circle_at_15%_0%,rgba(69,221,206,0.08),transparent_30%)] lg:px-2.5 lg:py-3 lg:transition-[width] lg:duration-300 ${
          showUserSidebar ? "lg:w-[272px]" : "lg:w-16"
        }`}
      >
        <div className={`flex h-11 shrink-0 items-center ${showUserSidebar ? "lg:px-1" : "lg:justify-center"}`}>
          <Link
            className="group flex min-w-0 items-center overflow-hidden rounded-xl outline-none ring-cyan-300/50 transition focus-visible:ring-2"
            href="/dashboard/agents"
            title="Vozon Voice Platform"
            aria-label="Vozon Voice Platform"
            onClick={(event) => {
              if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
              if (!beginNavigation("/dashboard/agents")) event.preventDefault();
            }}
            onFocus={() => prefetchDashboardRoute("/dashboard/agents")}
            onMouseEnter={() => prefetchDashboardRoute("/dashboard/agents")}
            onPointerDown={() => prefetchDashboardRoute("/dashboard/agents")}
          >
            <span className={`relative block h-10 shrink-0 overflow-hidden ${showUserSidebar ? "w-[148px]" : "w-10"}`}>
              <Image
                alt=""
                className="absolute left-0 top-1/2 h-auto w-[148px] max-w-none -translate-y-1/2 object-contain object-left transition group-hover:brightness-110"
                height={350}
                priority
                src="/images/logo_2.svg"
                width={1160}
              />
            </span>
          </Link>

          {showUserSidebar ? (
            <span className="ml-auto hidden rounded-full border border-[#45ddce]/20 bg-[#45ddce]/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#82fff2] lg:block">
              Console
            </span>
          ) : null}
        </div>

        <nav
          className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-4 lg:block lg:overflow-x-visible lg:overflow-y-auto"
          aria-label="Dashboard navigation"
        >
          {sidebarGroups.map((group) => (
            <div className="contents lg:mb-5 lg:block" key={group.label}>
              {showUserSidebar ? (
                <p className="app-label mb-2 hidden px-3 text-[10px] uppercase tracking-[0.18em] text-white/50 lg:block">
                  {group.label}
                </p>
              ) : null}
              <div className="contents lg:grid lg:gap-1">
                {group.items.map((item) => {
                  const isActive = item.label === activeLabel;
                  return (
                    <Link
                      className={`group/item relative flex size-10 shrink-0 items-center justify-center rounded-xl outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-cyan-300/60 lg:h-11 lg:w-full ${
                        showUserSidebar ? "lg:justify-start lg:gap-3 lg:px-3" : "lg:justify-center"
                      } ${
                        isActive
                          ? "bg-[#45ddce]/10 text-white shadow-[inset_0_0_0_1px_rgba(69,221,206,0.12),0_8px_22px_rgba(69,221,206,0.08)]"
                          : "text-white hover:bg-white/[0.06]"
                      }`}
                      href={item.href}
                      key={item.label}
                      title={showUserSidebar ? undefined : item.label}
                      onFocus={() => prefetchDashboardRoute(item.href)}
                      onMouseEnter={() => prefetchDashboardRoute(item.href)}
                      onPointerDown={() => prefetchDashboardRoute(item.href)}
                      onClick={(event) => {
                        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                        if (!beginNavigation(item.href)) event.preventDefault();
                      }}
                      aria-label={item.label}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {isActive ? <span className="absolute inset-y-2 left-0 hidden w-0.5 rounded-full bg-[#45ddce] shadow-[0_0_8px_#45ddce] lg:block" /> : null}
                      <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${isActive ? "bg-[#45ddce]/10" : ""}`}>
                        <SidebarIcon icon={item.icon} />
                      </span>
                      {showUserSidebar ? <span className="app-body hidden truncate font-medium text-white lg:block">{item.label}</span> : null}
                      {!showUserSidebar ? (
                        <span className="app-label pointer-events-none absolute left-[calc(100%+12px)] z-50 hidden min-w-max translate-x-1 rounded-lg border border-white/10 bg-[#0b1220] px-2.5 py-1.5 text-white opacity-0 shadow-2xl transition group-hover/item:translate-x-0 group-hover/item:opacity-100 lg:block">
                          {item.label}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={`relative ml-auto flex shrink-0 items-center gap-2 lg:ml-0 lg:border-t lg:border-white/[0.07] lg:pt-3 ${showUserSidebar ? "lg:px-1" : "lg:flex-col"}`} ref={accountMenuRef}>
          <button
            className={`group/account flex min-w-0 items-center rounded-xl text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[#45ddce]/60 ${accountMenuOpen ? "bg-white/[0.07] ring-1 ring-white/[0.08]" : "hover:bg-white/[0.05]"} ${showUserSidebar ? "gap-3 p-1 lg:flex-1" : "p-0"}`}
            type="button"
            aria-label="Open account menu"
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
            onClick={() => setAccountMenuOpen((current) => !current)}
          >
            <span className="app-label grid size-9 shrink-0 place-items-center rounded-xl bg-[#45ddce] text-[#03110e] shadow-[0_8px_20px_rgba(69,221,206,0.18)] transition group-hover/account:brightness-110">
              {userInitials}
            </span>
            {showUserSidebar ? (
              <span className="hidden min-w-0 flex-1 lg:block">
                <span className="app-body block truncate font-semibold text-white">{userName}</span>
                <span className="app-caption block truncate text-white/55">{userEmail}</span>
              </span>
            ) : null}
            {showUserSidebar ? (
              <svg className={`hidden size-4 shrink-0 fill-none stroke-current stroke-2 text-white/30 transition-transform lg:block ${accountMenuOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            ) : null}
          </button>

          <button
            className="grid size-9 shrink-0 place-items-center rounded-xl text-[#ffb15f] transition hover:bg-[#f28d45]/10 hover:text-[#ffc078] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f28d45]/50"
            onClick={onLogout}
            type="button"
            title="Log out"
            aria-label="Log out"
          >
            <svg className="size-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 17l5-5-5-5M15 12H3" />
              <path d="M13 3h5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-5" />
            </svg>
          </button>

          {accountMenuOpen ? (
            <div
              className={`absolute right-0 top-[calc(100%+10px)] z-[70] w-[290px] overflow-hidden rounded-[20px] border border-[#29443e] bg-[radial-gradient(circle_at_15%_0%,rgba(69,221,206,0.13),transparent_42%),linear-gradient(145deg,#0b1b18_0%,#08130f_100%)] p-2.5 text-white shadow-[0_28px_80px_rgba(0,0,0,0.58)] ring-1 ring-black/20 backdrop-blur-2xl lg:top-auto lg:bottom-[calc(100%+12px)] ${
                showUserSidebar ? "lg:left-1 lg:right-1 lg:w-auto" : "lg:right-auto lg:left-[calc(100%+14px)] lg:w-[280px]"
              }`}
              role="menu"
            >
              <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.045] p-3">
                <span className="pointer-events-none absolute -right-7 -top-8 size-24 rounded-full bg-[#45ddce]/[0.07] blur-xl" />
                <div className="relative flex min-w-0 items-center gap-3">
                  <span className="app-label grid size-10 shrink-0 place-items-center rounded-xl bg-[#45ddce] font-black text-[#03110e] shadow-[0_8px_22px_rgba(69,221,206,0.18)]">
                    {userInitials}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#82fff2]/55">Signed in as</span>
                    <span className="mt-0.5 block truncate text-sm font-bold text-white/90">{userName}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-white/35">{userEmail}</span>
                  </span>
                </div>
              </div>
              <p className="mb-1 mt-3 px-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/25">Account shortcuts</p>
              <div className="grid gap-1.5">
                {accountMenuItems.map((item) => {
                  const itemPath = item.href.split("#", 1)[0];
                  const isActive = pathname === itemPath && (item.href === "/dashboard/profile" || item.href.startsWith("/dashboard/settings"));
                  return (
                    <Link
                      className={`group/menu flex min-w-0 items-center gap-3 rounded-xl border px-3 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-[#45ddce]/50 ${isActive ? "border-[#45ddce]/20 bg-[#45ddce]/10 text-[#82fff2] shadow-[inset_0_0_0_1px_rgba(69,221,206,0.04)]" : "border-transparent bg-white/[0.025] text-white/65 hover:border-white/[0.08] hover:bg-white/[0.06] hover:text-white"}`}
                      href={item.href}
                      key={item.label}
                      role="menuitem"
                      onClick={(event) => {
                        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                        if (!beginNavigation(item.href)) {
                          event.preventDefault();
                          return;
                        }
                        setAccountMenuOpen(false);
                      }}
                    >
                      <span className={`grid size-9 shrink-0 place-items-center rounded-xl border transition ${isActive ? "border-[#45ddce]/20 bg-[#45ddce]/15 text-[#82fff2]" : "border-white/[0.07] bg-white/[0.04] text-white/55 group-hover/menu:text-[#82fff2]"}`}>
                        <AccountMenuIcon icon={item.icon} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold">{item.label}</span>
                        <span className="mt-1 block truncate text-[10px] font-medium text-white/30">{item.detail}</span>
                      </span>
                      <svg aria-hidden="true" className="size-3.5 shrink-0 fill-none stroke-current stroke-2 text-white/20 transition group-hover/menu:translate-x-0.5 group-hover/menu:text-[#82fff2]" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <button
          className="absolute right-0 top-[68px] hidden size-7 translate-x-1/2 place-items-center rounded-full border border-white/10 bg-[#07110f] text-white/45 shadow-lg transition hover:border-[#45ddce]/40 hover:bg-[#0c211d] hover:text-[#82fff2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45ddce]/60 lg:grid"
          type="button"
          title={showUserSidebar ? "Collapse sidebar" : "Expand sidebar"}
          aria-label={showUserSidebar ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={showUserSidebar}
          onClick={toggleSidebar}
        >
          <svg className={`size-4 fill-none stroke-current stroke-2 transition-transform ${showUserSidebar ? "" : "rotate-180"}`} viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </aside>

      <div
        className={`hidden lg:block lg:h-dvh ${
          showUserSidebar ? "lg:w-[272px]" : "lg:w-16"
        }`}
        aria-hidden="true"
      />
    </>
  );
}
