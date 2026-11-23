"use client";

import { type ReactNode } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "@/app/business/industries/healthcare/healthcare.css";
import "@/components/layout/WebsiteContentTheme.css";
import "@/components/layout/PublicPageRefresh.css";

type SiteLayoutProps = {
  children: ReactNode;
  showFooter?: boolean;
};

export function SiteLayout({ children, showFooter = true }: SiteLayoutProps) {
  return (
    <div className="marketing-site hcr-site sln-site min-h-screen [overflow-x:clip] bg-[#f8f9f9] text-[#171719]">
      <SiteHeader />
      <main className="website-content hcr-page min-h-screen bg-[#f8f9f9]">{children}</main>
      {showFooter && <SiteFooter />}
    </div>
  );
}
