"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useRef, useState } from "react";

import { FooterSoundWave } from "@/components/layout/FooterSoundWave";
import { SitePreFooterCta } from "@/components/layout/SitePreFooterCta";
import "@/components/sections/HomeDesignFourEnding.css";

type FooterTag = {
  label: string;
  icon: string;
  tone?: "green" | "orange" | "pink" | "purple" | "white";
};

const footerTags: readonly FooterTag[] = [
  { label: "Media", icon: "◆" }, { label: "Freelancing", icon: "⚡" },
  { label: "Podcast", icon: "▥" }, { label: "Media", icon: "◆" },
  { label: "Investing", icon: "$", tone: "pink" }, { label: "Partnership", icon: "◈", tone: "white" },
  { label: "Deal", icon: "$" }, { label: "Agencies", icon: "▦" },
  { label: "Contractors", icon: "▦" }, { label: "VCs", icon: "▰" },
  { label: "Sales", icon: "◆", tone: "green" }, { label: "Real Estate", icon: "▥" },
  { label: "Recruiting", icon: "▣", tone: "purple" }, { label: "Fundraisings", icon: "◈", tone: "orange" },
  { label: "Consulting", icon: "▥" }, { label: "CRM", icon: "▦" },
  { label: "Leads", icon: "≋" }, { label: "Deal", icon: "$" },
  { label: "Agencies", icon: "▦" }, { label: "Contractors", icon: "▦" },
];

export function SiteFooter() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.08 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const scrollTermsToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/terms") return;

    event.preventDefault();
    window.history.replaceState(null, "", "/terms");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const footerContent = (
    <>
      <SitePreFooterCta demoHref={pathname === "/contact" ? "#contact-form" : "/contact"} />
      <footer className={`design-four-footer${visible ? " is-visible" : ""}`} ref={footerRef}>
        <div className="design-four-footer-main">
        <div className="design-four-footer-brand">
          <div className="design-four-footer-intro"><span>VOZON · VOICE, WHATSAPP &amp; AGENTIC AI</span><h2>Voice &amp; WhatsApp agents built to act.</h2></div>
          <p>Deploy AI voice agents, WhatsApp automation, and autonomous workflows that answer customers, call live tools, and turn conversations into outcomes.</p>
          <div className="design-four-footer-socials">
            <a aria-label="Twitter / X" href="https://x.com/vozonai_" rel="noreferrer" target="_blank">X</a>
            <a aria-label="LinkedIn" href="https://linkedin.com/company/vozon-ai-india/" rel="noreferrer" target="_blank">in</a>
            <a aria-label="Instagram" href="https://www.instagram.com/vozonai"target="_blank"rel="noreferrer">
            <svg width="24"height="24"viewBox="0 0 24 24"fill="none"xmlns="http://www.w3.org/2000/svg"><rect x="2.5"y="2.5"width="19"height="19"rx="5.5"stroke="currentColor"strokeWidth="2.5"/><circle cx="12"cy="12"r="4.25"stroke="currentColor"strokeWidth="2.5"/><circle cx="17.5"cy="6.5"r="1.25"fill="currentColor" /></svg></a>
            <a aria-label="Call +91 84236 55336" href="tel:+918423655336">&#9742;</a>
            <a aria-label="Email hello@vozon.ai" href="mailto:hello@vozon.ai">&#9993;</a>
          </div>
        </div>
        <nav aria-label="Footer navigation">
          <div><b>Product</b><Link href="/product/ai-voice-agent">AI Voice Agent</Link><Link href="/product/whatsapp-api">WhatsApp API</Link><Link href="/product/whatsapp-bot">WhatsApp Bot</Link><Link href="/product/web-chatbot">Web Chatbot</Link><Link href="/product/voice-cloning">Voice Cloning</Link><Link href="/product/vozon-mcp">Vozon MCP</Link><Link href="/product/workflows">Workflows</Link><Link href="/product/create-workflows">Create Workflows</Link><Link href="/product/end-to-end-automation">End-to-End Automation</Link></div>
          <div><b>Resources</b><Link href="/#faq">FAQ</Link><Link href="/resources/blog">Blog</Link><Link href="/about">About us</Link><Link href="/resources/help-center">Support</Link><Link href="/docs/api">Download</Link><Link href="/terms" onClick={scrollTermsToTop}>Terms &amp; Conditions</Link><Link href="/privacy">Privacy policy</Link><Link href="/partners">Affiliate program</Link></div>
          <div><b>Company</b><Link href="/career">We&apos;re hiring</Link><Link href="/pricing">Pricing</Link><Link href="/resources/changelog">Changelog</Link><Link href="/contact">Contact us</Link></div>
          <div>
            <b>Contact US</b>
            <a href="mailto:hello@vozon.ai">hello@vozon.ai</a>
            <a className="design-four-footer-phone" href="tel:+918423655336">+91 84236 55336</a>
            <Link href="/contact#office-locations">Our Office Locations</Link>
            <Link className="design-four-footer-demo" href="/contact">Book a free demo</Link>
          </div>
        </nav>
      </div>
        <div className="design-four-footer-wordmark">
          <Link href="/" aria-label="Vozon home"><Image src="/images/vozon-mark.svg" alt="Vozon" width={370} height={350} /></Link>
          <FooterSoundWave />
        </div>
        <div className="design-four-footer-tags" aria-hidden="true">
          {[...footerTags,
            { label: "Voice AI", icon: "AI", tone: "purple" as const },
            { label: "Automation", icon: "+", tone: "green" as const },
            { label: "Customer Support", icon: "*", tone: "orange" as const },
          ].map((tag, index) => <span className={tag.tone ? `is-${tag.tone}` : undefined} key={`${tag.label}-${index}`}><i>{tag.icon}</i><b>{tag.label}</b></span>)}
        </div>
      </footer>
    </>
  );

  return pathname !== "/" ? <div className="home-design-four footer-home-shell">{footerContent}</div> : footerContent;
}
