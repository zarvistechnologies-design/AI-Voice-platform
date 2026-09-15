"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

import { defaultBrand, type BrandConfig } from "@/lib/brand";

const BrandContext = createContext<BrandConfig>(defaultBrand);

export function BrandProvider({ brand, children }: { brand: BrandConfig; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.brandSource = brand.source;
    document.documentElement.style.setProperty("--brand-primary", brand.colors.primary);
    document.documentElement.style.setProperty("--brand-secondary", brand.colors.secondary);
    document.documentElement.style.setProperty("--brand-accent", brand.colors.accent);
    document.documentElement.style.setProperty("--brand-surface", brand.colors.surface);
  }, [brand]);
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  return useContext(BrandContext);
}

