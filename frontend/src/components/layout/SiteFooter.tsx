"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import styles from "./SiteFooter.module.css";

// Modern stylized geometric 'V' mark SVG inspired by the reference design
function VozonSymbolV({ className = "", size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vozonVGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B00" />
          <stop offset="100%" stopColor="#FF4500" />
        </linearGradient>
        <linearGradient id="vozonVGradSecondary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8533" />
          <stop offset="100%" stopColor="#FF5500" />
        </linearGradient>
      </defs>
      {/* Left facet of the stylized geometric V */}
      <path
        d="M6 8 L18 8 L10 24 L6 18 Z"
        fill="url(#vozonVGradPrimary)"
        opacity="0.9"
      />
      {/* Main dynamic fold */}
      <path
        d="M17 8 L29 8 L20 34 L12 28 Z"
        fill="url(#vozonVGradSecondary)"
      />
      {/* Angular highlight accent fold */}
      <path
        d="M27 8 L35 8 L22 34 L18 34 Z"
        fill="url(#vozonVGradPrimary)"
      />
    </svg>
  );
}

// Giant watermark SVG of the V symbol for background depth
function GiantWatermarkV() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.watermarkSymbolV}
      aria-hidden="true"
    >
      <path
        d="M15 18 L45 18 L25 58 L15 42 Z"
        fill="url(#watermarkVGrad)"
        opacity="0.6"
      />
      <path
        d="M42 18 L72 18 L50 82 L30 68 Z"
        fill="url(#watermarkVGrad)"
      />
      <path
        d="M68 18 L88 18 L55 82 L45 82 Z"
        fill="url(#watermarkVGrad)"
        opacity="0.8"
      />
      <defs>
        <linearGradient id="watermarkVGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B00" />
          <stop offset="100%" stopColor="#FF3300" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className={styles.footerContainer} aria-label="Site Footer">
      {/* Background Ambience & Watermarks: 'V' symbol & 'VOZON' watermark */}
      <div className={styles.watermarkWrapper} aria-hidden="true">
        <div className={styles.ambientGlow} />
        <GiantWatermarkV />
        <div className={styles.watermarkTextVozon}>VOZON</div>
      </div>

      <div className={styles.footerInner}>
        {/* Top Section: Brand Identity + Newsletter Subscription */}
        <div className={styles.topSection}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandLogoWrap} aria-label="Vozon Home">
              <span className={styles.brandLogoIcon}>
                <VozonSymbolV size={40} />
              </span>
              <span className={styles.brandLogoText}>
                vozon<span style={{ color: "#FF5500" }}>.ai</span>
              </span>
            </Link>

            <p className={styles.brandTagline}>
              Carrier-grade voice infrastructure for the AI era.
            </p>

            <p className={styles.companyMeta}>
              Vozon AI India Private Limited • Vozon, Inc.
            </p>

            {/* Social Icons row matching the reference screenshot */}
            <div className={styles.socialRow}>
              {/* GitHub */}
              <a
                href="https://github.com/zarvistechnologies-design"
                target="_blank"
                rel="noreferrer"
                className={styles.socialBtn}
                aria-label="GitHub"
                title="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@vozonai"
                target="_blank"
                rel="noreferrer"
                className={styles.socialBtn}
                aria-label="YouTube"
                title="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/company/vozon-ai-india/"
                target="_blank"
                rel="noreferrer"
                className={styles.socialBtn}
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/vozonai_"
                target="_blank"
                rel="noreferrer"
                className={styles.socialBtn}
                aria-label="X (Twitter)"
                title="X"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Contact / Email */}
              <a
                href="mailto:hello@vozon.ai"
                className={styles.socialBtn}
                aria-label="Email Vozon"
                title="hello@vozon.ai"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Newsletter Subscribe */}
          <div className={styles.newsletterCol}>
            <p className={styles.newsletterHeading}>
              Stay up to date. Subscribe to our Newsletter
            </p>
            <form onSubmit={handleSubmit} className={styles.newsletterForm}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                className={styles.newsletterInput}
                aria-label="Email address"
              />
              <button type="submit" className={styles.newsletterBtn}>
                <span>Submit</span>
                <span aria-hidden="true">&gt;</span>
              </button>
            </form>
            {subscribed && (
              <p className={styles.newsletterSuccess}>
                ✓ Thanks for subscribing to Vozon updates!
              </p>
            )}
          </div>
        </div>

        {/* Middle Section: 5 Detailed Link Columns Matching Screenshot */}
        <div className={styles.linksGrid}>
          {/* Column 1: PLATFORM */}
          <div className={styles.navColumn}>
            <span className={styles.columnHeader}>Platform</span>
            <span className={styles.subCategory}>Voice</span>
            <ul className={styles.columnLinks}>
              <li><Link href="/services/voice-agents" className={styles.columnLink}>Overview</Link></li>
              <li><Link href="/services/telephony" className={styles.columnLink}>SIP Trunking</Link></li>
              <li><Link href="/services/phone-numbers" className={styles.columnLink}>Phone numbers</Link></li>
              <li><Link href="/services/api-access" className={styles.columnLink}>Voice API</Link></li>
              <li><Link href="/services/webrtc" className={styles.columnLink}>WebRTC</Link></li>
            </ul>

            <span className={styles.subCategory}>Messaging</span>
            <ul className={styles.columnLinks}>
              <li><Link href="/services/sms-rcs" className={styles.columnLink}>SMS &amp; RCS</Link></li>
              <li><Link href="/services/whatsapp" className={styles.columnLink}>WhatsApp</Link></li>
            </ul>
          </div>

          {/* Column 2: COMPLIANCE & TRUST */}
          <div className={styles.navColumn}>
            <span className={styles.columnHeader}>Compliance &amp; Trust</span>
            <ul className={styles.columnLinks}>
              <li><Link href="/resources/trust-center" className={styles.columnLink}>Security</Link></li>
              <li><Link href="/privacy" className={styles.columnLink}>Privacy Policy</Link></li>
              <li><Link href="/terms" className={styles.columnLink}>Terms of Use</Link></li>
              <li><Link href="/acceptable-use" className={styles.columnLink}>Acceptable Use Policy</Link></li>
              <li><Link href="/cookie-policy" className={styles.columnLink}>Cookie Policy</Link></li>
              <li><button type="button" onClick={() => window.alert("Cookies are optimized for your session.")} className={styles.columnLink} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>Cookie Preferences</button></li>
            </ul>
          </div>

          {/* Column 3: RESOURCES */}
          <div className={styles.navColumn}>
            <span className={styles.columnHeader}>Resources</span>
            <ul className={styles.columnLinks}>
              <li><Link href="/about" className={styles.columnLink}>About us</Link></li>
              <li><Link href="/docs" className={styles.columnLink}>Documentation</Link></li>
              <li><Link href="/resources/blog" className={styles.columnLink}>Blogs</Link></li>
              <li><Link href="/events" className={styles.columnLink}>Events</Link></li>
              <li><Link href="/newsroom" className={styles.columnLink}>Newsroom</Link></li>
              <li><Link href="/newsletter" className={styles.columnLink}>Newsletter</Link></li>
              <li><Link href="/#faq" className={styles.columnLink}>FAQ&apos;s</Link></li>
            </ul>
          </div>

          {/* Column 4: DEVELOPERS */}
          <div className={styles.navColumn}>
            <span className={styles.columnHeader}>Developers</span>
            <ul className={styles.columnLinks}>
              <li><Link href="/docs/api" className={styles.columnLink}>API Reference</Link></li>
              <li><Link href="/docs/openapi" className={styles.columnLink}>OpenAPI Specification</Link></li>
              <li><Link href="/docs/mcp-server" className={`${styles.columnLink} ${styles.columnLinkFeatured}`}>MCP Server</Link></li>
              <li><Link href="/dashboard/developers" className={styles.columnLink}>Developer Console</Link></li>
              <li><Link href="/integrations" className={styles.columnLink}>Integrations</Link></li>
              <li><Link href="/status" className={styles.columnLink}>Status</Link></li>
              <li><a href="https://github.com/zarvistechnologies-design" target="_blank" rel="noreferrer" className={styles.columnLink}>GitHub — SDKs &amp; Examples</a></li>
              <li><Link href="/agent-skills" className={styles.columnLink}>Agent Skills</Link></li>
              <li><Link href="/docs/nodejs-sdk" className={styles.columnLink}>Node.js SDK</Link></li>
            </ul>
          </div>

          {/* Column 5: USEFUL LINKS */}
          <div className={styles.navColumn}>
            <span className={styles.columnHeader}>Useful Links</span>
            <ul className={styles.columnLinks}>
              <li><Link href="/pricing" className={styles.columnLink}>Pricing</Link></li>
              <li><Link href="/contact" className={styles.columnLink}>Contact us</Link></li>
              <li><Link href="/partners" className={styles.columnLink}>Partner Program</Link></li>
              <li><Link href="/career" className={styles.columnLink}>Careers</Link></li>
              <li><Link href="/reviews" className={styles.columnLink}>Customer Stories</Link></li>
              <li><Link href="/services/voice-cloning" className={styles.columnLink}>Voice Cloning Studio</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, System Status & Country */}
        <div className={styles.bottomBar}>
          <div>
            © {new Date().getFullYear()} Vozon, Inc. All rights reserved.
          </div>

          <div className={styles.statusIndicator}>
            <span className={styles.statusDot} />
            <span>All Systems Operational</span>
          </div>

          <div className={styles.regionTag}>
            <span>🌐</span>
            <span>India / Global (EN/IN)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
