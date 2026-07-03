"use client";

import { type ReactNode } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#111827] text-white">
      <SiteHeader />
      <main className="min-h-screen">{children}</main>
      <SiteFooter />
    </div>
  );
}
