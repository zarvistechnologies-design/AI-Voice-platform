"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

import { defaultBrand, type BrandConfig } from "@/lib/brand";
import { getSession, getServerSession, subscribeToSession } from "@/lib/auth";
import { API_URL } from "@/lib/apiBase";

const BrandContext = createContext<BrandConfig>(defaultBrand);

export function BrandProvider({ brand, children }: { brand: BrandConfig; children: ReactNode }) {
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [remoteBrandState, setRemoteBrandState] = useState<{ organizationId: string; brand: BrandConfig } | null>(null);
  const organizationId = session?.organization?.id ?? "";
  const remoteBrand = remoteBrandState?.organizationId === organizationId ? remoteBrandState.brand : null;

  const isWhiteLabelPartner = Boolean(session?.organization?.whiteLabelOwnerAccountId);
  const isWhiteLabelCustomer = Boolean(session?.organization?.whiteLabelAccountId);
  const isPartnerOrCustomer = isWhiteLabelPartner || isWhiteLabelCustomer || brand.source === "white_label";

  // Listen for live brand updates (e.g. after editing in White Label console)
  useEffect(() => {
    function handleBrandUpdate(event: Event) {
      const customEvent = event as CustomEvent<BrandConfig>;
      if (customEvent.detail && organizationId) {
        setRemoteBrandState({ organizationId, brand: customEvent.detail });
      }
    }
    window.addEventListener("brand-updated", handleBrandUpdate);
    return () => window.removeEventListener("brand-updated", handleBrandUpdate);
  }, [organizationId]);

  // Fetch current organization brand if authenticated as partner or customer
  useEffect(() => {
    if (!isPartnerOrCustomer || remoteBrand || !organizationId) return;

    let cancelled = false;
    async function loadBrand() {
      try {
        const token = session?.token;
        const res = await fetch(`${API_URL}/api/organizations/current/brand`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) return;
        const data = (await res.json()) as { brand?: BrandConfig };
        if (!cancelled && data?.brand) {
          setRemoteBrandState({ organizationId, brand: data.brand });
        }
      } catch {
        // Keep fallback
      }
    }
    void loadBrand();
    return () => {
      cancelled = true;
    };
  }, [isPartnerOrCustomer, organizationId, session?.token, remoteBrand]);

  const effectiveBrand = useMemo<BrandConfig>(() => {
    if (remoteBrand) return remoteBrand;
    if (session?.organization?.brand) {
      const organizationBrand = session.organization.brand;
      if (organizationBrand.source === "platform") {
        return {
          ...organizationBrand,
          logoUrl: brand.logoUrl,
          logoDarkUrl: brand.logoDarkUrl,
          iconUrl: brand.iconUrl,
        };
      }
      return organizationBrand;
    }
    if (brand.source === "white_label") return brand;

    if (isPartnerOrCustomer) {
      const name = session?.organization?.name || "Voice Platform";
      return {
        ...brand,
        source: "white_label",
        productName: name,
        companyName: name,
        logoUrl: "", // NEVER fallback to Vozon logo for white-label partners or clients!
        logoDarkUrl: "",
        iconUrl: "",
        poweredBy: { visible: false, text: "" },
      };
    }

    return brand;
  }, [brand, remoteBrand, session?.organization?.brand, session?.organization?.name, isPartnerOrCustomer]);

  const isWhiteLabel = isPartnerOrCustomer || effectiveBrand.source === "white_label";
  // If explicitly set or resolved by backend brand, use that:
  // Existing white-label users -> Classic Green theme
  // New white-label onboarding -> Recent modern monochrome theme
  const themeStyle = effectiveBrand.themeStyle || "recent";

  useEffect(() => {
    document.documentElement.dataset.brandSource = isWhiteLabel ? "white_label" : "platform";
    document.documentElement.dataset.brandTheme = themeStyle;
    document.documentElement.style.setProperty("--brand-primary", effectiveBrand.colors.primary);
    document.documentElement.style.setProperty("--brand-secondary", effectiveBrand.colors.secondary);
    document.documentElement.style.setProperty("--brand-accent", effectiveBrand.colors.accent);
    document.documentElement.style.setProperty("--brand-surface", effectiveBrand.colors.surface);

    if (isPartnerOrCustomer || effectiveBrand.source === "white_label") {
      // Scrub any accidental "Vozon" from browser tab title immediately and on dynamic page changes
      const cleanTitle = () => {
        if (document.title.includes("Vozon")) {
          document.title = document.title
            .replace(/\s*\|\s*Vozon/g, "")
            .replace(/Vozon/g, effectiveBrand.productName);
        }
      };
      cleanTitle();

      const titleEl = document.querySelector("title");
      let observer: MutationObserver | null = null;
      if (titleEl) {
        observer = new MutationObserver(cleanTitle);
        observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
      }

      // Update all browser tab favicon links dynamically to partner brand logo/icon
      const iconTarget = effectiveBrand.iconUrl || effectiveBrand.logoDarkUrl || effectiveBrand.logoUrl;
      if (iconTarget && !iconTarget.includes("logo_2.svg") && !iconTarget.includes("vozon-logo.svg") && !iconTarget.includes("vozon-mark")) {
        const iconLinks = document.querySelectorAll<HTMLLinkElement>(
          "link[rel~='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']",
        );
        if (iconLinks.length > 0) {
          iconLinks.forEach((el) => {
            el.removeAttribute("sizes");
            el.href = iconTarget;
          });
        } else {
          const newLink = document.createElement("link");
          newLink.rel = "icon";
          newLink.href = iconTarget;
          document.head.appendChild(newLink);
        }
      }

      return () => {
        if (observer) observer.disconnect();
      };
    }
  }, [effectiveBrand, isPartnerOrCustomer, isWhiteLabel, themeStyle]);

  return <BrandContext.Provider value={effectiveBrand}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  return useContext(BrandContext);
}

export default BrandProvider;

