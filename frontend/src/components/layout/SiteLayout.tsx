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
    <div className={`app-shell${resolvedTheme === "dark" ? " dark-mode" : ""}`}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <ThemeSwitcher
        preference={preference}
        onPreferenceChange={setThemePreference}
      />
    </div>
  );
}
