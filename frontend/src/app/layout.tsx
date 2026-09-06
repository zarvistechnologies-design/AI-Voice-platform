import type { Metadata } from "next";
import { Geist_Mono, Roboto } from "next/font/google";
import type { CSSProperties } from "react";

import { BrandProvider } from "@/components/branding/BrandProvider";
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
};

export async function generateMetadata(): Promise<Metadata> {
  const brand = await requestBrandConfig();
  if (brand.source === "platform") return platformMetadata;
  return {
    metadataBase: new URL(`https://${brand.hostname}`),
    title: { default: `${brand.productName} | AI Voice Platform`, template: `%s | ${brand.productName}` },
    description: "Build multilingual AI phone agents for inbound and outbound calls, lead qualification, appointment booking, customer support, and workflow automation.",
    applicationName: brand.productName,
    icons: brand.iconUrl ? { icon: [{ url: brand.iconUrl }], apple: [{ url: brand.iconUrl }] } : undefined,
    keywords: ["AI voice agent", "AI phone agent", "voice AI platform", "automated phone calls", "AI receptionist", "call automation"],
    authors: [{ name: brand.companyName, url: brand.support.websiteUrl || undefined }],
    creator: brand.companyName,
    publisher: brand.companyName,
    openGraph: { type: "website", locale: "en_US", url: "/", siteName: brand.productName, title: `${brand.productName} AI Voice Platform`, description: "Build and operate production AI voice agents." },
    twitter: { card: "summary_large_image", title: `${brand.productName} AI Voice Platform`, description: "Build multilingual AI phone agents for production workflows." },
    robots: { index: false, follow: false, nocache: true },
    category: "technology",
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const brand = await requestBrandConfig();
  const fontClasses = `${roboto.variable} ${geistMono.variable} h-full scroll-smooth antialiased`;
  if (brand.source === "platform") {
    return (
      <html lang="en" data-scroll-behavior="smooth" className={fontClasses}>
        <body className="flex min-h-full flex-col bg-background text-foreground">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: platformStructuredData() }} />
          {children}
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
  return (
    <html lang="en" data-brand-source="white_label" data-scroll-behavior="smooth" className={fontClasses}>
      <body className="flex min-h-full flex-col bg-background text-foreground" style={brandStyle}>
        <BrandProvider brand={brand}>{children}</BrandProvider>
      </body>
    </html>
  );
}
