import type { Metadata } from "next";
import { Geist_Mono, Roboto } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vozon.ai"),
  title: "AI Voice Agent Platform for Phone Call Automation | Vozon",
  description: "Build multilingual AI phone agents for inbound and outbound calls, lead qualification, appointment booking, customer support, and workflow automation.",
  applicationName: "Vozon",
  keywords: ["AI voice agent", "AI phone agent", "voice AI platform", "automated phone calls", "AI receptionist", "call automation"],
  authors: [{ name: "Vozon", url: "https://www.vozon.ai" }],
  creator: "Vozon",
  publisher: "Vozon",
  openGraph: { type: "website", locale: "en_US", url: "/", siteName: "Vozon", title: "AI Voice Agent Platform for Phone Call Automation | Vozon", description: "Build multilingual AI phone agents that answer calls, qualify leads, book appointments, and automate customer workflows.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Vozon AI voice agent platform" }] },
  twitter: { card: "summary_large_image", title: "AI Voice Agent Platform for Phone Call Automation | Vozon", description: "Build multilingual AI phone agents that answer calls, qualify leads, book appointments, and automate customer workflows.", images: ["/opengraph-image"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${roboto.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.vozon.ai/#organization",
                  name: "Vozon",
                  url: "https://www.vozon.ai/",
                  logo: "https://www.vozon.ai/images/logo_2.svg",
                  email: "hello@vozon.ai",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.vozon.ai/#website",
                  url: "https://www.vozon.ai/",
                  name: "Vozon",
                  description: "AI voice agents for inbound and outbound phone call automation.",
                  publisher: { "@id": "https://www.vozon.ai/#organization" },
                  inLanguage: "en",
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
