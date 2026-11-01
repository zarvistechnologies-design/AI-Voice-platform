import type { Metadata } from "next";
import { Geist_Mono, Roboto } from "next/font/google";
import Script from "next/script";
import type { CSSProperties } from "react";

import { BrandProvider } from "@/components/branding/BrandProvider";
import { brandMonogramFavicon } from "@/lib/brand";
import { requestBrandConfig } from "@/lib/brandServer";

import "./globals.css";

const roboto = Roboto({
  variable: "--font-site-sans",
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-commit-mono",
  subsets: ["latin"],
  preload: false,
});

const platformMetadata: Metadata = {
  metadataBase: new URL("https://www.vozon.ai"),
  title: {
    default: "Vozon | AI Voice Agent Platform",
    template: "%s | Vozon",
  },
  description: "Build multilingual AI phone agents for inbound and outbound calls, lead qualification, appointment booking, customer support, and workflow automation.",
  applicationName: "Vozon",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/vozon-mark-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/vozon-mark-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icons/vozon-mark-180.png", type: "image/png", sizes: "180x180" },
    ],
  },
  keywords: ["AI voice agent", "AI phone agent", "voice AI platform", "automated phone calls", "AI receptionist", "call automation"],
  authors: [{ name: "Vozon", url: "https://www.vozon.ai" }],
  creator: "Vozon",
  publisher: "Vozon",
  openGraph: { type: "website", locale: "en_US", url: "/", siteName: "Vozon", title: "AI Voice Agent Platform for Phone Call Automation | Vozon", description: "Build multilingual AI phone agents that answer calls, qualify leads, book appointments, and automate customer workflows.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Vozon AI voice agent platform" }] },
  twitter: { card: "summary_large_image", title: "AI Voice Agent Platform for Phone Call Automation | Vozon", description: "Build multilingual AI phone agents that answer calls, qualify leads, book appointments, and automate customer workflows.", images: ["/opengraph-image"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "technology",
  other: {
    "facebook-domain-verification": "hs7xv0aby3bor2uybe6y440jg6wnkk",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const brand = await requestBrandConfig();
  if (brand.source === "platform") return platformMetadata;
  return {
    metadataBase: new URL(`https://${brand.hostname}`),
    title: { default: `${brand.productName} | AI Voice Platform`, template: `%s | ${brand.productName}` },
    description: "Build multilingual AI phone agents for inbound and outbound calls, lead qualification, appointment booking, customer support, and workflow automation.",
    icons: (() => {
      const rawIcon = brand.iconUrl || brand.logoDarkUrl || brand.logoUrl;
      const isVozon = Boolean(rawIcon && (rawIcon.includes("logo_2.svg") || rawIcon.includes("vozon-mark") || rawIcon.includes("favicon.ico")));
      const effectiveIcon = (!isVozon && rawIcon) ? rawIcon : brandMonogramFavicon(brand.productName, brand.colors.primary);
      return {
        icon: [{ url: effectiveIcon }],
        apple: [{ url: effectiveIcon }],
        shortcut: [{ url: effectiveIcon }],
      };
    })(),
    keywords: ["AI voice agent", "AI phone agent", "voice AI platform", "automated phone calls", "AI receptionist", "call automation"],
    authors: [{ name: brand.companyName, url: brand.support.websiteUrl || undefined }],
    creator: brand.companyName,
    publisher: brand.companyName,
    openGraph: { type: "website", locale: "en_US", url: "/", siteName: brand.productName, title: `${brand.productName} AI Voice Platform`, description: "Build and operate production AI voice agents." },
    twitter: { card: "summary_large_image", title: `${brand.productName} AI Voice Platform`, description: "Build multilingual AI phone agents for production workflows." },
    robots: { index: false, follow: false, nocache: true },
    category: "technology",
    other: {
      "facebook-domain-verification": "hs7xv0aby3bor2uybe6y440jg6wnkk",
    },
  };
}

function platformStructuredData() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": "https://www.vozon.ai/#organization", name: "Vozon", url: "https://www.vozon.ai/", logo: "https://www.vozon.ai/images/logo_2.svg", email: "hello@vozon.ai" },
      { "@type": "WebSite", "@id": "https://www.vozon.ai/#website", url: "https://www.vozon.ai/", name: "Vozon", description: "AI voice agents for inbound and outbound phone call automation.", publisher: { "@id": "https://www.vozon.ai/#organization" }, inLanguage: "en" },
    ],
  }).replace(/</g, "\\u003c");
}

function MetaPixel() {
  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1394172395546382');
fbq('track', 'PageView');`,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1394172395546382&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </>
  );
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const brand = await requestBrandConfig();
  const fontClasses = `${roboto.variable} ${geistMono.variable} h-full scroll-smooth antialiased`;
  if (brand.source === "platform") {
    return (
      <html lang="en" data-scroll-behavior="smooth" className={fontClasses}>
        <head>
          <meta name="facebook-domain-verification" content="hs7xv0aby3bor2uybe6y440jg6wnkk" />
          <script
            id="brand-early-favicon-init"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var raw = localStorage.getItem("ai_voice_platform_session");
                    if (!raw) return;
                    var s = JSON.parse(raw);
                    var org = s && s.organization;
                    var isWL = Boolean((org && (org.whiteLabelAccountId || org.whiteLabelOwnerAccountId)) || (s && s.whiteLabel));
                    var brand = (org && org.brand) || (s && s.whiteLabel && s.whiteLabel.brand);
                    if (!isWL && !brand) return;
                    var icon = brand && (brand.iconUrl || brand.logoDarkUrl || brand.logoUrl);
                    if (!icon || icon.indexOf("logo_2.svg") !== -1 || icon.indexOf("vozon-mark") !== -1 || icon.indexOf("favicon.ico") !== -1) {
                      var name = (brand && brand.productName) || (org && org.name) || "P";
                      var char = (name || "P").trim().charAt(0).toUpperCase() || "P";
                      var col = (brand && brand.colors && brand.colors.primary) || "#118778";
                      var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="' + col + '"/><text x="32" y="44" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle">' + char + '</text></svg>';
                      icon = "data:image/svg+xml," + encodeURIComponent(svg);
                    }
                    if (icon) {
                      var old = document.querySelectorAll("link[rel*='icon'], link[rel='apple-touch-icon']");
                      for (var i = 0; i < old.length; i++) {
                        if (old[i].parentNode) old[i].parentNode.removeChild(old[i]);
                      }
                      var el = document.createElement("link");
                      el.rel = "icon";
                      el.href = icon;
                      document.head.appendChild(el);
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
        </head>
        <body className="flex min-h-full flex-col bg-background text-foreground">
          <MetaPixel />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: platformStructuredData() }} />
          <BrandProvider brand={brand}>{children}</BrandProvider>
        </body>
      </html>
    );
  }

  const brandStyle = {
    "--brand-primary": brand.colors.primary,
    "--brand-secondary": brand.colors.secondary,
    "--brand-accent": brand.colors.accent,
    "--brand-surface": brand.colors.surface,
  } as CSSProperties;
  const iconTarget = brand.iconUrl || brand.logoDarkUrl || brand.logoUrl;
  const isVozonIcon = Boolean(iconTarget && (iconTarget.includes("logo_2.svg") || iconTarget.includes("vozon-mark") || iconTarget.includes("favicon.ico")));
  const effectiveIconTarget = (!isVozonIcon && iconTarget) ? iconTarget : brandMonogramFavicon(brand.productName, brand.colors.primary);

  return (
    <html lang="en" data-brand-source="white_label" data-scroll-behavior="smooth" className={fontClasses}>
      <head>
        <meta name="facebook-domain-verification" content="hs7xv0aby3bor2uybe6y440jg6wnkk" />
        <link rel="icon" href={effectiveIconTarget} />
        <link rel="shortcut icon" href={effectiveIconTarget} />
        <link rel="apple-touch-icon" href={effectiveIconTarget} />
          <script
            id="brand-early-favicon-init"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var raw = localStorage.getItem("ai_voice_platform_session");
                    if (!raw) return;
                    var s = JSON.parse(raw);
                    var org = s && s.organization;
                    var isWL = Boolean((org && (org.whiteLabelAccountId || org.whiteLabelOwnerAccountId)) || (s && s.whiteLabel));
                    var brand = (org && org.brand) || (s && s.whiteLabel && s.whiteLabel.brand);
                    if (!isWL && !brand) return;
                    var icon = brand && (brand.iconUrl || brand.logoDarkUrl || brand.logoUrl);
                    if (!icon || icon.indexOf("logo_2.svg") !== -1 || icon.indexOf("vozon-mark") !== -1 || icon.indexOf("favicon.ico") !== -1) {
                      var name = (brand && brand.productName) || (org && org.name) || "P";
                      var char = (name || "P").trim().charAt(0).toUpperCase() || "P";
                      var col = (brand && brand.colors && brand.colors.primary) || "#118778";
                      var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="' + col + '"/><text x="32" y="44" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle">' + char + '</text></svg>';
                      icon = "data:image/svg+xml," + encodeURIComponent(svg);
                    }
                    if (icon) {
                      var old = document.querySelectorAll("link[rel*='icon'], link[rel='apple-touch-icon']");
                      for (var i = 0; i < old.length; i++) {
                        if (old[i].parentNode) old[i].parentNode.removeChild(old[i]);
                      }
                      var el = document.createElement("link");
                      el.rel = "icon";
                      el.href = icon;
                      document.head.appendChild(el);
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground" style={brandStyle}>
        <MetaPixel />
        <BrandProvider brand={brand}>{children}</BrandProvider>
      </body>
    </html>
  );
}
