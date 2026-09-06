"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/ui/BrandLogo";
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

  return (
    <footer className={`design-four-footer${visible ? " is-visible" : ""}`} ref={footerRef}>
      <div className="design-four-footer-cta">
        <h2>Build your AI voice agent</h2>
        <div><Link href="/dashboard">Try for free</Link><Link href="/contact">Get a demo</Link></div>
      </div>
      <div className="design-four-footer-main">
        <div className="design-four-footer-brand">
          <BrandLogo showWebsiteLogo />
          <p>Building intelligent voice experiences that help businesses create better conversations, automate meaningful work, and connect people with outcomes.</p>
          <div><a href="https://x.com" target="_blank" rel="noreferrer">♥</a><a href="https://facebook.com" target="_blank" rel="noreferrer">f</a><a href="https://linkedin.com" target="_blank" rel="noreferrer">in</a><a href="https://youtube.com" target="_blank" rel="noreferrer">▶</a></div>
        </div>
        <nav aria-label="Footer navigation">
          <div><b>Product</b><Link href="/services/voice-agents">Voice Agents</Link><Link href="/services/voice-cloning">Voice Cloning</Link><Link href="/services/realtime-tts">Realtime TTS</Link><Link href="/services/api-access">API Access</Link><Link href="/services/team-workflows">Team Workflows</Link><Link href="/services/speech-analytics">Speech Analytics</Link><Link href="/services/quality-controls">Quality Controls</Link><Link href="/services/multilingual-speech">Multilingual Speech</Link><Link href="/services/conversation-insights">Conversation Insights</Link></div>
          <div><b>Resources</b><Link href="/#faq">FAQ</Link><Link href="/resources/blog">Blog</Link><Link href="/about">About us</Link><Link href="/resources/help-center">Support</Link><Link href="/docs">Download</Link><Link href="/terms">Terms of use</Link><Link href="/privacy">Privacy policy</Link><Link href="/partners">Affiliate program</Link></div>
          <div><b>Company</b><Link href="/career">We&apos;re hiring</Link><Link href="/pricing">Pricing</Link><Link href="/resources/changelog">Changelog</Link><Link href="/contact">Contact us</Link></div>
          <div><b>Contact US</b><a href="mailto:info@vozon.ai">info@vozon.ai</a><a className="design-four-footer-phone" href="tel:+918065652545">+91-80-65652545</a><Link className="design-four-footer-demo" href="/contact">Book a free demo</Link></div>
        </nav>
      </div>
      <div className="design-four-footer-tags" aria-hidden="true">
        {footerTags.map((tag, index) => <span className={tag.tone ? `is-${tag.tone}` : undefined} key={`${tag.label}-${index}`}><i>{tag.icon}</i><b>{tag.label}</b></span>)}
      </div>
    </footer>
  );
}
