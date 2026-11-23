"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import styles from "./not-found.module.css";

interface NotFoundProps {
  title?: string;
  description?: string;
}

const destinations = [
  { label: "Home", href: "/", keywords: "start overview" },
  { label: "Product", href: "/product", keywords: "voice platform agents" },
  { label: "Pricing", href: "/pricing", keywords: "plans cost" },
  { label: "Business solutions", href: "/business", keywords: "industries use cases" },
  { label: "Integrations", href: "/integrations", keywords: "connect crm" },
  { label: "Documentation", href: "/docs", keywords: "docs guides api" },
  { label: "Contact", href: "/contact", keywords: "sales support help" },
];

export function Illustration(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 362 145" fill="currentColor" {...props}>
      <path d="M62.6 142c-2.133 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2L58.2 4c.8-1.333 2.067-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .667.533 1 1.267 1 2.2v21.2c0 .933-.333 1.733-1 2.4-.667.533-1.467.8-2.4.8H93v20.8c0 2.133-1.067 3.2-3.2 3.2H62.6zM33 90.4h26.4V51.2L33 90.4zM181.67 144.6c-7.333 0-14.333-1.333-21-4-6.666-2.667-12.866-6.733-18.6-12.2-5.733-5.467-10.266-13-13.6-22.6-3.333-9.6-5-20.667-5-33.2 0-12.533 1.667-23.6 5-33.2 3.334-9.6 7.867-17.133 13.6-22.6 5.734-5.467 11.934-9.533 18.6-12.2 6.667-2.8 13.667-4.2 21-4.2 7.467 0 14.534 1.4 21.2 4.2 6.667 2.667 12.8 6.733 18.4 12.2 5.734 5.467 10.267 13 13.6 22.6 3.334 9.6 5 20.667 5 33.2 0 12.533-1.666 23.6-5 33.2-3.333 9.6-7.866 17.133-13.6 22.6-5.6 5.467-11.733 9.533-18.4 12.2-6.666 2.667-13.733 4-21.2 4zm0-31c9.067 0 15.6-3.733 19.6-11.2 4.134-7.6 6.2-17.533 6.2-29.8s-2.066-22.2-6.2-29.8c-4.133-7.6-10.666-11.4-19.6-11.4-8.933 0-15.466 3.8-19.6 11.4-4 7.6-6 17.533-6 29.8s2 22.2 6 29.8c4.134 7.467 10.667 11.2 19.6 11.2zM316.116 142c-2.134 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2l56.6-84.6c.8-1.333 2.066-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .666.533 1 1.267 1 2.2v21.2c0 .933-.334 1.733-1 2.4-.667.533-1.467.8-2.4.8h-11.2v20.8c0 2.133-1.067 3.2-3.2 3.2h-27.2zm-29.6-51.6h26.4V51.2l-26.4 39.2z" />
    </svg>
  );
}

export function NotFound({
  title = "Page not found",
  description = "Lost, this page is. In another system, it may be.",
}: NotFoundProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const matches = useMemo(() => {
    const words = query.trim().toLowerCase();
    if (!words) return [];
    return destinations.filter((destination) =>
      `${destination.label} ${destination.keywords}`.toLowerCase().includes(words),
    );
  }, [query]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (matches[0]) {
      router.push(matches[0].href);
      return;
    }
    setFeedback(query.trim() ? "No matching pages yet. Try product, pricing, docs, or contact." : "Enter a topic to find a page.");
  }

  return (
    <main className={styles.root}>
      <div className={styles.content}>
        <div className={styles.artStage}>
          <Illustration className={styles.illustration} />
          <h1 className={styles.title}>{title}</h1>
        </div>
        <p className={styles.description}>{description}</p>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <label className={styles.searchField}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.searchIcon} fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5" strokeLinecap="round"/></svg>
            <span className="sr-only">Search Vozon pages</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setFeedback(""); }} placeholder="Search product, pricing, docs..." className={styles.searchInput} />
          </label>
          <button type="submit" className={styles.searchButton}>Search</button>
        </form>
        {matches.length > 0 && (
          <div className={styles.results} aria-label="Matching pages">
            {matches.slice(0, 4).map((destination) => (
              <Link key={destination.href} href={destination.href} className={styles.resultLink}>
                {destination.label}<span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        )}
        <p aria-live="polite" className={styles.feedback}>{feedback}</p>

        <div className={styles.actions}>
          <button type="button" onClick={() => { if (window.history.length > 1) router.back(); else router.push("/"); }} className={styles.backButton}>
            <svg aria-hidden="true" viewBox="0 0 20 20" className={styles.backIcon} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M16 10H4m0 0 5-5m-5 5 5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Go back
          </button>
          <Link href="/" className={styles.homeButton}>Take me home</Link>
        </div>
      </div>
    </main>
  );
}
