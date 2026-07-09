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
});

export const metadata: Metadata = {
  title: "vozon.ai",
  description: "AI voice agents for sales, support, scheduling, and customer follow-up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
