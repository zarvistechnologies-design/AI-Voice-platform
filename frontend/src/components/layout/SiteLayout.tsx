"use client";

import { type ReactNode } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useTheme } from "@/hooks/useTheme";

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  const { preference, resolvedTheme, setThemePreference } = useTheme();

  return (
    <div
      className={`min-h-screen overflow-x-hidden text-[#f6f1ff] transition-colors ${
        resolvedTheme === "dark"
          ? "bg-[linear-gradient(180deg,#000_0%,#10071d_35%,#26063b_100%)]"
          : "bg-[linear-gradient(180deg,#000_0%,#170020_30%,#6a00a8_100%)]"
      }`}
    >
      <SiteHeader />
      <main className="min-h-screen">{children}</main>
      <SiteFooter />
      <ThemeSwitcher
        preference={preference}
        onPreferenceChange={setThemePreference}
      />
    </div>
  );
}
