"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

import { brandMonogramFavicon, defaultBrand, type BrandConfig } from "@/lib/brand";
import { getSession, getServerSession, subscribeToSession } from "@/lib/auth";
import { API_URL } from "@/lib/apiBase";

const BrandContext = createContext<BrandConfig>(defaultBrand);

export function BrandProvider({ brand, children }: { brand: BrandConfig; children: ReactNode }) {
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [remoteBrand, setRemoteBrand] = useState<BrandConfig | null>(null);

  const isWhiteLabelDomain = brand.source === "white_label";
  const isWhiteLabelPartner = Boolean(session?.organization?.whiteLabelOwnerAccountId);
  const isWhiteLabelCustomer = Boolean(session?.organization?.whiteLabelAccountId);
  const isPartnerOrCustomer = isWhiteLabelPartner || isWhiteLabelCustomer;

  // Listen for live brand updates ONLY when on white-label domains
  useEffect(() => {
    if (!isWhiteLabelDomain) return;
    function handleBrandUpdate(event: Event) {
      const customEvent = event as CustomEvent<BrandConfig>;
      if (customEvent.detail) {
        setRemoteBrand(customEvent.detail);
      }
    }
    window.addEventListener("brand-updated", handleBrandUpdate);
    return () => window.removeEventListener("brand-updated", handleBrandUpdate);
  }, [isWhiteLabelDomain]);

  // Fetch current organization brand ONLY when on white-label domains
  useEffect(() => {
    if (!isWhiteLabelDomain || remoteBrand || !session?.organization?.id) return;

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
          setRemoteBrand(data.brand);
        }
      } catch {
        // Keep fallback
      }
    }
    void loadBrand();
    return () => {
      cancelled = true;
    };
  }, [isWhiteLabelDomain, session?.organization?.id, session?.token, remoteBrand]);

  const effectiveBrand = useMemo<BrandConfig>(() => {
    // If the domain is the official platform (vozon.ai), ALWAYS keep platform branding (Vozon)!
    if (brand.source === "platform") {
      return brand;
    }

    if (remoteBrand) return remoteBrand;
    if (session?.organization?.brand) return session.organization.brand;
    if (brand.source === "white_label") return brand;

    if (isPartnerOrCustomer) {
      const name = session?.organization?.name || "Voice Platform";
      return {
        ...brand,
        source: "white_label",
        productName: name,
        companyName: name,
        logoUrl: "",
        logoDarkUrl: "",
        iconUrl: "",
        poweredBy: { visible: false, text: "" },
      };
    }

    return brand;
  }, [brand, remoteBrand, session?.organization?.brand, session?.organization?.name, isPartnerOrCustomer]);

  useEffect(() => {
    document.documentElement.dataset.brandSource = effectiveBrand.source;
    document.documentElement.style.setProperty("--brand-primary", effectiveBrand.colors.primary);
    document.documentElement.style.setProperty("--brand-secondary", effectiveBrand.colors.secondary);
    document.documentElement.style.setProperty("--brand-accent", effectiveBrand.colors.accent);
    document.documentElement.style.setProperty("--brand-surface", effectiveBrand.colors.surface);

    // Apply custom favicon and title scrubbing ONLY on white_label domains!
    if (effectiveBrand.source === "white_label") {
      // Scrub any accidental "Vozon" from browser tab title safely after React renders
      let titleTimer: ReturnType<typeof setTimeout> | null = null;
      const cleanTitle = () => {
        try {
          if (document.title && document.title.includes("Vozon")) {
            const nextTitle = document.title
              .replace(/\s*\|\s*Vozon/g, "")
              .replace(/Vozon/g, effectiveBrand.productName);
            if (document.title !== nextTitle) {
              document.title = nextTitle;
            }
          }
        } catch {
          // ignore
        }
      };

      titleTimer = setTimeout(cleanTitle, 0);

      const titleEl = document.querySelector("title");
      let observer: MutationObserver | null = null;
      if (titleEl) {
        observer = new MutationObserver(() => {
          if (titleTimer) clearTimeout(titleTimer);
          titleTimer = setTimeout(cleanTitle, 50);
        });
        observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
      }

      // Update all browser tab favicon links dynamically to partner brand logo/icon without removing nodes from DOM
      const rawIcon = effectiveBrand.iconUrl || effectiveBrand.logoDarkUrl || effectiveBrand.logoUrl;
      const isVozonAsset = Boolean(
        rawIcon && (rawIcon.includes("logo_2.svg") || rawIcon.includes("vozon-mark") || rawIcon.includes("favicon.ico")),
      );
      const activeFavicon = (!isVozonAsset && rawIcon)
        ? rawIcon
        : brandMonogramFavicon(effectiveBrand.productName || session?.organization?.name || "Voice Platform", effectiveBrand.colors?.primary);

      const existingIcons = document.querySelectorAll<HTMLLinkElement>(
        "link[rel*='icon'], link[rel='apple-touch-icon']"
      );
      if (existingIcons.length > 0) {
        existingIcons.forEach((el) => {
          if (el.href !== activeFavicon) {
            el.href = activeFavicon;
          }
        });
      } else {
        let dynamicLink = document.getElementById("brand-dynamic-favicon") as HTMLLinkElement | null;
        if (!dynamicLink) {
          dynamicLink = document.createElement("link");
          dynamicLink.id = "brand-dynamic-favicon";
          dynamicLink.rel = "icon";
          document.head.appendChild(dynamicLink);
        }
        dynamicLink.type = activeFavicon.startsWith("data:image/svg") ? "image/svg+xml" : "image/x-icon";
        dynamicLink.href = activeFavicon;
      }

      return () => {
        if (observer) observer.disconnect();
        if (titleTimer) clearTimeout(titleTimer);
      };
    }
  }, [effectiveBrand, session?.organization?.name]);

  return <BrandContext.Provider value={effectiveBrand}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  return useContext(BrandContext);
}

export default BrandProvider;
