"use client";

import { type ReactNode } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "@/components/layout/WebsiteContentTheme.css";

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="marketing-site min-h-screen overflow-x-hidden bg-white text-[#111113]">
      <SiteHeader />
      <main className="website-content min-h-screen">{children}</main>
      <SiteFooter />
    </div>
  );
}
