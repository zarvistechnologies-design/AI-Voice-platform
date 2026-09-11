import Link from "next/link";

export function SitePreFooterCta() {
  return (
    <section aria-labelledby="site-pre-footer-title" className="design-four-footer-cta site-pre-footer-cta">
      <h2 id="site-pre-footer-title">Build your AI voice agent</h2>
      <div>
        <Link href="/dashboard">Try for free</Link>
        <Link href="/contact">Get a demo</Link>
      </div>
    </section>
  );
}
