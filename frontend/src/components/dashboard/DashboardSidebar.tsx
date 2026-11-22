"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useOptimistic, useRef, useState, useSyncExternalStore } from "react";

import { useBrand } from "@/components/branding/BrandProvider";
import { announceDashboardNavigation } from "@/components/dashboard/DashboardNavigationFeedback";
import { getServerSession, getSession, subscribeToSession } from "@/lib/auth";

type SidebarItem = {
  label: string;
  href: string;
  icon:
  | "agent"
  | "assistant"
  | "phone"
  | "campaign"
  | "automation"
  | "analytics"
  | "knowledge"
  | "logs"
  | "billing"
  | "integrations"
  | "developers"
  | "shield"
  | "whitelabel";
};

type SidebarIconName = SidebarItem["icon"];

const sidebarGroups: { label: string; items: SidebarItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard/analytics", icon: "analytics" },
      { label: "Voice Agents", href: "/dashboard/agents", icon: "agent" },
      { label: "Ask Vozon", href: "/dashboard/assistant", icon: "assistant" },
      {
        label: "Phone Numbers",
        href: "/dashboard/phone-number",
        icon: "phone",
      },
      { label: "Campaigns", href: "/dashboard/campaign", icon: "campaign" },
      { label: "Automation Workflow", href: "/dashboard/automations", icon: "automation" },
      {
        label: "Knowledge Base",
        href: "/dashboard/knowledge",
        icon: "knowledge",
      },
      { label: "Call Logs", href: "/dashboard/calls", icon: "logs" },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Billing", href: "/dashboard/billing", icon: "billing" },
      {
        label: "Integrations",
        href: "/dashboard/integrations",
        icon: "integrations",
      },
      {
        label: "Developers",
        href: "/dashboard/developers",
        icon: "developers",
      },
    ],
  },
];

const prefetchedDashboardRoutes = new Set<string>();
let dashboardSidebarExpanded = true;

export function getDashboardSidebarInitialState() {
  return dashboardSidebarExpanded;
}

const accountMenuItems = [
  {
    label: "Profile & security",
    detail: "Email, sessions and account",
    href: "/dashboard/profile",
    icon: "profile",
  },
  {
    label: "Team & workspace",
    detail: "Members, roles and invitations",
    href: "/dashboard/settings#team",
    icon: "team",
  },
] as const;

function AccountMenuIcon({
  icon,
}: {
  icon: (typeof accountMenuItems)[number]["icon"];
}) {
  const iconClass = "size-4.5 fill-none stroke-current stroke-[1.9]";
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SidebarIcon({ icon }: { icon: SidebarIconName }) {
  const iconClass = "size-4.5 fill-none stroke-current stroke-[1.8]";

  if (icon === "agent") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10h10a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3Z" />
        <path d="M12 10V6M9 6h6M8.5 15h.01M15.5 15h.01" />
      </svg>
    );
  }

  if (icon === "assistant") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5 13.9 9l5.6 2-5.6 1.9-1.9 5.6-2-5.6L4.5 11l5.5-2Z" />
        <path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9Z" />
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

  if (icon === "automation") {
    return <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="3" width="7" height="6" rx="1.5" /><rect x="15" y="3" width="7" height="6" rx="1.5" /><rect x="9" y="15" width="7" height="6" rx="1.5" /><path d="M9 6h6M18.5 9v2a4 4 0 0 1-4 4M5.5 9v2a4 4 0 0 0 4 4" /></svg>;
  }

  if (icon === "analytics") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
        <path d="m4 7 6-4 6 6 5-4" />
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

  if (icon === "shield") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 4.5 6v5.2c0 4.8 3 8.1 7.5 9.8 4.5-1.7 7.5-5 7.5-9.8V6L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  if (icon === "whitelabel") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 2 7l10 5 10-5-10-5Z" />
        <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
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

export type WhatsAppSubItem = {
  label: string;
  href: string;
  icon:
  | "templates"
  | "contact-groups"
  | "whatsapp-campaigns"
  | "whatsapp-agents"
  | "live-chat"
  | "meta-forms"
  | "flow-maker";
};

export const whatsAppSubItems: WhatsAppSubItem[] = [
  { label: "Templates", href: "/dashboard/whatsapp/templates", icon: "templates" },
  { label: "Contact Groups", href: "/dashboard/whatsapp/contact-groups", icon: "contact-groups" },
  { label: "Campaigns", href: "/dashboard/whatsapp/campaigns", icon: "whatsapp-campaigns" },
  { label: "Agents", href: "/dashboard/whatsapp/agents", icon: "whatsapp-agents" },
  { label: "Live Chat", href: "/dashboard/whatsapp/live-chat", icon: "live-chat" },
  { label: "Meta Forms", href: "/dashboard/whatsapp/meta-forms", icon: "meta-forms" },
  { label: "Flow Maker", href: "/dashboard/whatsapp/flow-maker", icon: "flow-maker" },
];

function WhatsAppBrandIcon({ className = "size-4.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.9A11.82 11.82 0 0 0 12.05 0Zm0 21.78a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.88 9.88 0 1 1 8.37 4.63Z" />
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.28.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

function WhatsAppSubIcon({ icon }: { icon: WhatsAppSubItem["icon"] }) {
  const iconClass = "size-4.5 fill-none stroke-current stroke-[1.8]";
  if (icon === "templates") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  if (icon === "contact-groups") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (icon === "whatsapp-campaigns") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3 11 18-5v12L3 14v-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    );
  }
  if (icon === "whatsapp-agents") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <rect width="18" height="12" x="3" y="8" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v6" />
        <circle cx="12" cy="2" r="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14h.01M16 14h.01M9 17h6" />
      </svg>
    );
  }
  if (icon === "live-chat") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 9a2 2 0 0 1-2 2H6l-3 3V4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9h2a2 2 0 0 1 2 2v10l-3-3h-7a2 2 0 0 1-2-2v-2" />
      </svg>
    );
  }
  if (icon === "meta-forms") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline strokeLinecap="round" strokeLinejoin="round" points="14 2 14 8 20 8" />
        <line strokeLinecap="round" strokeLinejoin="round" x1="16" y1="13" x2="8" y2="13" />
        <line strokeLinecap="round" strokeLinejoin="round" x1="16" y1="17" x2="8" y2="17" />
        <polyline strokeLinecap="round" strokeLinejoin="round" points="10 9 9 9 8 9" />
      </svg>
    );
  }
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v3" />
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
  const brand = useBrand();
  const pathname = usePathname();
  const router = useRouter();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [optimisticPathname, setOptimisticPathname] = useOptimistic(pathname);
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const isSuperAdmin = session?.platformRole === "super_admin";
  const isWhiteLabelPartner = Boolean(session?.organization?.whiteLabelOwnerAccountId);
  const isWhiteLabelCustomer = Boolean(session?.organization?.whiteLabelAccountId);
  const isPartnerOrCustomer = isWhiteLabelPartner || isWhiteLabelCustomer || brand.source === "white_label";
  const showPlatformAdministration = isSuperAdmin && !isPartnerOrCustomer;
  const hideCustomerAutomationAndWhatsApp = isWhiteLabelCustomer;

  const effectiveProductName = isPartnerOrCustomer
    ? (brand.source === "white_label" ? brand.productName : (session?.organization?.name || "Voice Platform"))
    : brand.productName;

  const rawLogo = brand.source === "white_label" ? (brand.logoDarkUrl || brand.logoUrl) : (isPartnerOrCustomer ? "" : brand.logoUrl);
  const effectiveLogoUrl = isPartnerOrCustomer && rawLogo.includes("logo_2.svg") ? "" : rawLogo;

  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [bugSubmitting, setBugSubmitting] = useState(false);
  const [bugSubmitted, setBugSubmitted] = useState(false);

  async function handleBugSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!bugDescription.trim()) return;
    setBugSubmitting(true);
    try {
      try {
        const key = "vozon_bug_reports";
        const existing = JSON.parse(localStorage.getItem(key) || "[]") as unknown[];
        existing.unshift({
          title: bugTitle.trim() || "Bug report",
          description: bugDescription.trim(),
          page: pathname,
          userEmail,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 20)));
      } catch {
        /* localStorage may be unavailable */
      }
      setBugSubmitted(true);
      setBugTitle("");
      setBugDescription("");
    } finally {
      setBugSubmitting(false);
    }
  }

  const isWhatsAppRoute = optimisticPathname.startsWith("/dashboard/whatsapp");
  const [whatsAppExpanded, setWhatsAppExpanded] = useState(true);

  const isSettingsRoute =
    optimisticPathname === "/dashboard/profile" ||
    optimisticPathname.startsWith("/dashboard/settings");
  const [settingsExpanded, setSettingsExpanded] = useState(isSettingsRoute);

  useEffect(() => {
    if (optimisticPathname.startsWith("/dashboard/whatsapp")) {
      setWhatsAppExpanded(true);
    }
    if (
      optimisticPathname === "/dashboard/profile" ||
      optimisticPathname.startsWith("/dashboard/settings")
    ) {
      setSettingsExpanded(true);
    }
  }, [optimisticPathname]);

  const effectiveSidebarGroups = useMemo(() => {
    return [
      ...sidebarGroups.map((group) => ({
        ...group,
        items: hideCustomerAutomationAndWhatsApp
          ? group.items.filter((item) => item.href !== "/dashboard/automations")
          : group.items,
      })),
      ...(showPlatformAdministration || isWhiteLabelPartner
        ? [
          {
            label: "Administration",
            items: [
              ...(isWhiteLabelPartner
                ? [
                  {
                    label: "White Label",
                    href: "/dashboard/white-label",
                    icon: "whitelabel" as const,
                  },
                ]
                : []),
              ...(showPlatformAdministration
                ? [
                  {
                    label: "Accounts & Payments",
                    href: "/admin",
                    icon: "shield" as const,
                  },
                  {
                    label: "Platform Admin",
                    href: "/platform-admin/white-label",
                    icon: "shield" as const,
                  },
                ]
                : []),
            ],
          },
        ]
        : []),
    ];
  }, [hideCustomerAutomationAndWhatsApp, showPlatformAdministration, isWhiteLabelPartner]);

  useEffect(() => {
    const preloadTimer = window.setTimeout(() => {
      for (const group of effectiveSidebarGroups) {
        for (const item of group.items) {
          if (prefetchedDashboardRoutes.has(item.href)) continue;
          prefetchedDashboardRoutes.add(item.href);
          router.prefetch(item.href);
        }
      }
      if (!hideCustomerAutomationAndWhatsApp) {
        for (const item of whatsAppSubItems) {
          if (prefetchedDashboardRoutes.has(item.href)) continue;
          prefetchedDashboardRoutes.add(item.href);
          router.prefetch(item.href);
        }
      }
    }, 250);
    return () => window.clearTimeout(preloadTimer);
  }, [router, effectiveSidebarGroups, hideCustomerAutomationAndWhatsApp]);

  useEffect(() => {
    try {
      const savedPreference = localStorage.getItem("showUserSidebar");
      if (savedPreference !== null) {
        dashboardSidebarExpanded = savedPreference === "1";
        setShowUserSidebar(dashboardSidebarExpanded);
      }
    } catch {
      /* local storage may be unavailable */
    }
  }, [setShowUserSidebar]);

  useEffect(() => {
    if (!accountMenuOpen) return undefined;
    function closeAccountMenu(event: PointerEvent) {
      if (!accountMenuRef.current?.contains(event.target as Node))
        setAccountMenuOpen(false);
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
    if (targetPathname === pathname && !href.includes("#")) return false;
    if (
      targetPathname !== pathname &&
      onBeforeNavigate &&
      !onBeforeNavigate(href)
    )
      return false;
    if (targetPathname !== pathname) {
      startTransition(() => setOptimisticPathname(targetPathname));
      announceDashboardNavigation(href, pathname);
    }
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
      dashboardSidebarExpanded = next;
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
        className={`dashboard-sidebar dashboard-sidebar-shell z-40 flex min-w-0 items-center gap-2 border-b border-[#eaeaea] bg-white px-2 py-2 text-[#52525b] lg:fixed lg:inset-y-0 lg:left-0 lg:h-dvh lg:flex-col lg:items-stretch lg:border-b-0 lg:border-r lg:border-[#eaeaea] lg:px-2.5 lg:py-3 lg:shadow-none lg:transition-[width] lg:duration-300 motion-reduce:transition-none ${showUserSidebar ? "lg:w-[248px]" : "lg:w-16"
          }`}
        data-expanded={showUserSidebar}
      >
        <div
          className={`dashboard-sidebar-brand flex h-12 shrink-0 items-center ${showUserSidebar ? "justify-between px-2.5" : "justify-center"}`}
        >
          {showUserSidebar ? (
            <Link
              className="dashboard-sidebar-brand-link group flex min-w-0 items-center rounded-md outline-none ring-blue-500/20 transition focus-visible:ring-2"
              href="/dashboard/agents"
              title={`${effectiveProductName} Voice Platform`}
              aria-label={`${effectiveProductName} Voice Platform`}
              onClick={(event) => {
                if (
                  event.ctrlKey ||
                  event.metaKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                if (!beginNavigation("/dashboard/agents")) event.preventDefault();
              }}
              onFocus={() => prefetchDashboardRoute("/dashboard/agents")}
              onMouseEnter={() => prefetchDashboardRoute("/dashboard/agents")}
              onPointerDown={() => prefetchDashboardRoute("/dashboard/agents")}
            >
              <span className="dashboard-sidebar-brand-copy flex min-w-0 items-center">
                <span className="dashboard-sidebar-logo-frame relative block h-[30px] w-[104px] shrink-0 overflow-hidden">
                  {effectiveLogoUrl ? (
                    effectiveLogoUrl.startsWith("/") ? (
                      <Image
                        alt={`${effectiveProductName} logo`}
                        className="dashboard-sidebar-logo object-contain object-left transition group-hover:opacity-85"
                        fill
                        priority
                        sizes="104px"
                        src={effectiveLogoUrl}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={`${effectiveProductName} logo`}
                        className="dashboard-sidebar-logo h-full w-full object-contain object-left transition group-hover:opacity-85"
                        src={effectiveLogoUrl}
                      />
                    )
                  ) : (
                    <span className="flex h-full items-center gap-2">
                      <span className="grid size-5 shrink-0 place-items-center rounded bg-[#171717] text-[10px] font-bold text-white">
                        {effectiveProductName.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="truncate text-[13px] font-semibold tracking-tight text-[#171717]">
                        {effectiveProductName}
                      </span>
                    </span>
                  )}
                </span>
              </span>
            </Link>
          ) : null}

          <button
            className="dashboard-sidebar-toggle hidden size-7 touch-manipulation select-none cursor-pointer place-items-center rounded-md text-[#71717a] transition hover:bg-[#f4f4f5] hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 motion-reduce:transition-none lg:grid"
            type="button"
            title={showUserSidebar ? "Collapse sidebar" : "Expand sidebar"}
            aria-label={showUserSidebar ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={showUserSidebar}
            onClick={toggleSidebar}
          >
            <svg
              className="pointer-events-none size-4 fill-none stroke-current stroke-[1.8]"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d={showUserSidebar ? "M15 4v16" : "M9 4v16"} />
            </svg>
          </button>
        </div>

        <nav
          className="dashboard-sidebar-nav-container flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:mt-2 lg:block lg:overflow-x-hidden lg:overflow-y-auto"
          aria-label="Dashboard navigation"
        >
          {effectiveSidebarGroups.map((group, groupIndex) => (
            <div className="contents lg:block" key={group.label}>
              <div className="dashboard-sidebar-group contents lg:mb-4 lg:block">
                {showUserSidebar ? (
                  <p className="dashboard-sidebar-group-label app-label mb-1 hidden px-2.5 text-[9px] font-medium uppercase tracking-[0.08em] text-[#a1a1aa] lg:block">
                    {group.label}
                  </p>
                ) : null}
                <div className="contents lg:grid lg:gap-0.5">
                  {group.items.map((item) => {
                    const isActive = optimisticPathname === "/dashboard"
                      ? item.label === activeLabel
                      : item.href === "/dashboard/agents"
                        ? optimisticPathname.startsWith(item.href)
                        : item.href === "/dashboard/automations"
                          ? optimisticPathname === item.href || optimisticPathname.startsWith(`${item.href}/`)
                          : optimisticPathname === item.href;
                    return (
                      <Link
                        className={`dashboard-sidebar-nav group/item relative flex size-9 shrink-0 items-center justify-center rounded-md outline-none transition duration-150 focus-visible:ring-2 focus-visible:ring-black/20 lg:h-9 lg:w-full ${showUserSidebar
                          ? item.icon === "automation"
                            ? "lg:justify-start lg:gap-2 lg:px-2.5"
                            : "lg:justify-start lg:gap-2.5 lg:px-2.5"
                          : "lg:justify-center"
                          } ${isActive
                            ? "bg-blue-600 text-white"
                            : "text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#171717]"
                          }`}
                        href={item.href}
                        key={item.label}
                        title={showUserSidebar ? undefined : item.label}
                        onFocus={() => prefetchDashboardRoute(item.href)}
                        onMouseEnter={() => prefetchDashboardRoute(item.href)}
                        onPointerDown={() => prefetchDashboardRoute(item.href)}
                        onClick={(event) => {
                          if (
                            event.ctrlKey ||
                            event.metaKey ||
                            event.shiftKey ||
                            event.altKey
                          )
                            return;
                          if (!beginNavigation(item.href)) event.preventDefault();
                        }}
                        aria-label={item.label}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span
                          className={`dashboard-sidebar-icon grid size-6 shrink-0 place-items-center rounded-md ${isActive ? "text-white" : "text-[#52525b] group-hover/item:text-[#171717]"}`}
                        >
                          <SidebarIcon icon={item.icon} />
                        </span>
                        {showUserSidebar ? (
                          <span
                            className={`dashboard-sidebar-label app-body hidden truncate whitespace-nowrap text-[13px] font-medium lg:block ${isActive ? "text-white" : "text-[#52525b] group-hover/item:text-[#171717]"}`}
                          >
                            {item.label}
                          </span>
                        ) : null}
                        {!showUserSidebar ? (
                          <span className="app-label pointer-events-none absolute left-[calc(100%+10px)] z-50 hidden min-w-max translate-x-1 rounded-md border border-[#eaeaea] bg-white px-2.5 py-1 text-[12px] text-[#171717] opacity-0 shadow-md transition group-hover/item:translate-x-0 group-hover/item:opacity-100 lg:block">
                            {item.label}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                  {/* Settings inside Manage Group */}
                  {group.label === "Manage" && (
                    <>
                      {showUserSidebar ? (
                        <div className="hidden lg:block">
                          <button
                            type="button"
                            onClick={() => setSettingsExpanded((prev) => !prev)}
                            className="group/settings flex h-8 w-full items-center justify-between rounded-md px-2.5 text-left text-[13px] font-medium text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#171717] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                            aria-expanded={settingsExpanded}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="dashboard-sidebar-icon grid size-6 shrink-0 place-items-center text-[#52525b] group-hover/settings:text-[#171717]">
                                <svg className="size-4.5 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                                  <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.3 7A2 2 0 0 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" />
                                </svg>
                              </span>
                              <span className="truncate text-[13px] font-medium">
                                Settings
                              </span>
                            </div>
                            <svg
                              className={`size-3.5 text-[#71717a] transition-transform duration-200 ${settingsExpanded ? "" : "rotate-180"}`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="m18 15-6-6-6 6" />
                            </svg>
                          </button>

                          {settingsExpanded && (
                            <div className="mt-0.5 ml-3.5 pl-3 border-l border-[#eaeaea] space-y-0.5">
                              {accountMenuItems.map((subItem) => {
                                const itemPath = subItem.href.split("#", 1)[0];
                                const isSubActive = optimisticPathname === itemPath;
                                return (
                                  <Link
                                    key={subItem.label}
                                    href={subItem.href}
                                    onClick={(event) => {
                                      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                                      if (!beginNavigation(subItem.href)) event.preventDefault();
                                    }}
                                    onFocus={() => prefetchDashboardRoute(subItem.href)}
                                    onMouseEnter={() => prefetchDashboardRoute(subItem.href)}
                                    onPointerDown={() => prefetchDashboardRoute(subItem.href)}
                                    className={`dashboard-sidebar-subitem group/sub flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[12.5px] transition-colors ${isSubActive
                                      ? "bg-blue-600 text-white font-medium"
                                      : "text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#171717]"
                                      }`}
                                    aria-current={isSubActive ? "page" : undefined}
                                  >
                                    <span
                                      className={`grid size-4.5 shrink-0 place-items-center transition ${isSubActive
                                        ? "text-white"
                                        : "text-[#71717a] group-hover/sub:text-[#171717]"
                                        }`}
                                    >
                                      <AccountMenuIcon icon={subItem.icon} />
                                    </span>
                                    <span className="truncate">{subItem.label}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="group/settings-mini relative hidden lg:flex justify-center">
                          <Link
                            href="/dashboard/settings"
                            onClick={(event) => {
                              if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                              if (!beginNavigation("/dashboard/settings")) event.preventDefault();
                            }}
                            className={`relative grid size-9 place-items-center rounded-md transition duration-150 ${isSettingsRoute
                              ? "bg-blue-600 text-white"
                              : "text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#171717]"
                              }`}
                            aria-label="Settings"
                            title="Settings"
                          >
                            <svg className="size-4.5 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.3 7A2 2 0 0 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" />
                            </svg>
                            <span className="app-label pointer-events-none absolute left-[calc(100%+10px)] z-50 hidden min-w-max translate-x-1 rounded-md border border-[#eaeaea] bg-white px-2.5 py-1 text-[12px] text-[#171717] opacity-0 shadow-md transition group-hover/settings-mini:translate-x-0 group-hover/settings-mini:opacity-100 lg:block">
                              Settings
                            </span>
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Dedicated WhatsApp Business Suite Section */}
              {groupIndex === 0 && !hideCustomerAutomationAndWhatsApp && (
                <>
                  {/* Mobile WhatsApp Pill */}
                  <Link
                    href="/dashboard/whatsapp/campaigns"
                    onClick={(event) => {
                      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                      if (!beginNavigation("/dashboard/whatsapp/campaigns")) event.preventDefault();
                    }}
                    className={`dashboard-sidebar-nav relative flex size-9 shrink-0 items-center justify-center rounded-md outline-none transition duration-150 lg:hidden ${isWhatsAppRoute
                      ? "bg-blue-600 text-white"
                      : "text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#171717]"
                      }`}
                    aria-label="WhatsApp Suite"
                  >
                    <span className="grid size-6 shrink-0 place-items-center">
                      <WhatsAppBrandIcon className="size-4.5" />
                    </span>
                  </Link>

                  {/* Desktop WhatsApp Dedicated Suite Section */}
                  {showUserSidebar ? (
                    <div className="hidden lg:block lg:mb-4 lg:mt-1">
                      <button
                        type="button"
                        onClick={() => setWhatsAppExpanded((prev) => !prev)}
                        className="group/wa flex h-9 w-full items-center justify-between rounded-md px-2.5 text-left text-[13px] font-medium text-[#171717] hover:bg-[#f4f4f5] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                        aria-expanded={whatsAppExpanded}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="grid size-6 shrink-0 place-items-center text-[#25D366]">
                            <WhatsAppBrandIcon className="size-4.5 shrink-0" />
                          </span>
                          <span className="truncate text-[13px] font-medium text-[#171717]">
                            WhatsApp
                          </span>
                        </div>
                        <svg
                          className={`size-3.5 text-[#71717a] transition-transform duration-200 ${whatsAppExpanded ? "" : "rotate-180"
                            }`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m18 15-6-6-6 6" />
                        </svg>
                      </button>

                      {/* Sub-items with connecting vertical line and clean active pill */}
                      {whatsAppExpanded && (
                        <div className="mt-0.5 ml-3.5 pl-3 border-l border-[#eaeaea] space-y-0.5">
                          {whatsAppSubItems.map((subItem) => {
                            const isSubActive =
                              optimisticPathname === subItem.href ||
                              (subItem.href === "/dashboard/whatsapp/campaigns" &&
                                optimisticPathname === "/dashboard/whatsapp");
                            return (
                              <Link
                                key={subItem.label}
                                href={subItem.href}
                                onClick={(event) => {
                                  if (
                                    event.ctrlKey ||
                                    event.metaKey ||
                                    event.shiftKey ||
                                    event.altKey
                                  )
                                    return;
                                  if (!beginNavigation(subItem.href)) event.preventDefault();
                                }}
                                onFocus={() => prefetchDashboardRoute(subItem.href)}
                                onMouseEnter={() => prefetchDashboardRoute(subItem.href)}
                                onPointerDown={() => prefetchDashboardRoute(subItem.href)}
                                className={`dashboard-sidebar-subitem group/sub flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[12.5px] transition-colors ${isSubActive
                                  ? "bg-blue-600 text-white font-medium"
                                  : "text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#171717]"
                                  }`}
                                aria-current={isSubActive ? "page" : undefined}
                              >
                                <span
                                  className={`grid size-4.5 shrink-0 place-items-center transition ${isSubActive
                                    ? "text-white"
                                    : "text-[#71717a] group-hover/sub:text-[#171717]"
                                    }`}
                                >
                                  <WhatsAppSubIcon icon={subItem.icon} />
                                </span>
                                <span className="truncate">{subItem.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Mini-sidebar Mode for WhatsApp */
                    <div className="group/wa-mini relative hidden lg:flex justify-center mb-4">
                      <Link
                        href="/dashboard/whatsapp/campaigns"
                        onClick={(event) => {
                          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
                            return;
                          if (!beginNavigation("/dashboard/whatsapp/campaigns"))
                            event.preventDefault();
                        }}
                        className={`relative grid size-9 place-items-center rounded-md transition duration-150 ${isWhatsAppRoute
                          ? "bg-blue-600 text-white"
                          : "text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#171717]"
                          }`}
                        aria-label="WhatsApp"
                        title="WhatsApp"
                      >
                        <WhatsAppBrandIcon className="size-4.5" />
                        <span className="app-label pointer-events-none absolute left-[calc(100%+10px)] z-50 hidden min-w-max translate-x-1 rounded-md border border-[#eaeaea] bg-white px-2.5 py-1 text-[12px] text-[#171717] opacity-0 shadow-md transition group-hover/wa-mini:translate-x-0 group-hover/wa-mini:opacity-100 lg:block">
                          WhatsApp
                        </span>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:block lg:pt-2.5">
          <button
            type="button"
            onClick={() => {
              setBugSubmitted(false);
              setBugModalOpen(true);
            }}
            title="Report a bug"
            aria-label="Report a bug"
            className={`group/bug flex h-8.5 w-full items-center rounded-md bg-[#171717] text-[12.5px] font-medium text-white transition hover:bg-black dark:border dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white ${showUserSidebar ? "justify-start gap-2.5 px-2.5" : "justify-center"}`}
          >
            <span className="grid size-5 shrink-0 place-items-center text-white">
              <svg className="size-4 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 2l1.88 1.88M14.12 3.88L16 2" />
                <path d="M9 7.13v-1a3 3 0 1 1 6 0v1" />
                <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6Z" />
                <path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M6 17l-3 1M17.47 9c1.93-.2 3.53-1.9 3.53-4M18 13h4M18 17l3 1" />
              </svg>
            </span>
            {showUserSidebar ? <span className="truncate">Report a bug</span> : null}
          </button>
        </div>
      </aside>

      {bugModalOpen ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bug-report-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setBugModalOpen(false);
          }}
        >
          <div className="w-full max-w-[440px] rounded-xl border border-[#eaeaea] bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-3 border-b border-[#f0f0f0] pb-3.5 dark:border-zinc-800">
              <div>
                <h2 id="bug-report-title" className="m-0 text-[15px] font-semibold text-[#171717] dark:text-white">
                  Report a bug
                </h2>
                <p className="mt-0.5 mb-0 text-[12px] text-[#71717a] dark:text-zinc-400">
                  Tell us what went wrong on <span className="font-mono text-[#171717] dark:text-zinc-200">{pathname}</span>
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setBugModalOpen(false)}
                className="grid size-7 place-items-center rounded-md text-[#71717a] transition hover:bg-[#f4f4f5] hover:text-[#171717] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                ×
              </button>
            </div>

            {bugSubmitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white">
                  <svg className="size-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <strong className="block text-[14px] font-semibold text-[#171717] dark:text-white">
                  Bug report submitted
                </strong>
                <p className="mt-1 text-[12.5px] text-[#71717a] dark:text-zinc-400">
                  Thanks for helping us improve Vozon.
                </p>
                <button
                  type="button"
                  onClick={() => setBugModalOpen(false)}
                  className="mt-4 inline-flex h-8 items-center justify-center rounded-md bg-black px-4 text-[12.5px] font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Done
                </button>
              </div>
            ) : (
              <form className="mt-4 grid gap-3.5" onSubmit={(e) => void handleBugSubmit(e)}>
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-medium text-[#171717] dark:text-zinc-200">Summary</span>
                  <input
                    type="text"
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                    placeholder="e.g., Button alignment or missing data"
                    className="h-9 rounded-lg border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] placeholder-[#a1a1aa] outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-white"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-[12px] font-medium text-[#171717] dark:text-zinc-200">
                    What happened? <span className="text-rose-600">*</span>
                  </span>
                  <textarea
                    required
                    rows={4}
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    placeholder="Describe the issue and how to reproduce it..."
                    className="rounded-lg border border-[#eaeaea] bg-white p-3 text-[13px] text-[#171717] placeholder-[#a1a1aa] outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-white"
                  />
                </label>

                <div className="mt-1 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBugModalOpen(false)}
                    className="h-8 rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#52525b] transition hover:bg-[#f4f4f5] hover:text-[#171717] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bugSubmitting || !bugDescription.trim()}
                    className="h-8 rounded-md bg-black px-4 text-[12.5px] font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
                  >
                    {bugSubmitting ? "Submitting..." : "Submit report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}

      <div
        className={`dashboard-page-edge pointer-events-none fixed inset-y-0 z-[35] hidden w-px border-l border-[#eaeaea] transition-[left] duration-300 motion-reduce:transition-none lg:block ${showUserSidebar ? "left-[248px]" : "left-16"
          }`}
        aria-hidden="true"
      />

      <div
        className={`hidden lg:block lg:h-dvh ${showUserSidebar ? "lg:w-[248px]" : "lg:w-16"
          }`}
        aria-hidden="true"
      />
    </>
  );
}
