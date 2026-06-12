import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata = {
  title: "Careers | AI Voice Platform",
  description: "Join AI Voice Platform and help build the future of voice AI.",
};

const careerValues = [
  {
    title: "Build practical AI",
    body: "Work on voice experiences that help teams answer, understand, and improve real customer conversations.",
  },
  {
    title: "Move with ownership",
    body: "Shape product decisions closely with engineering, design, support, and business teams.",
  },
  {
    title: "Care about the caller",
    body: "Create automation that feels clear, respectful, and useful for the people on both sides of every call.",
  },
];

export default function CareerPage() {
  return (
    <SiteLayout>
      <section className="service-page-hero">
        <div className="service-page-copy">
          <p className="section-kicker">Careers</p>
          <h1>Build the future of voice AI with us</h1>
          <p>
            Join a team creating smarter, more human voice experiences for support, sales,
            operations, and product teams.
          </p>
          <div className="service-page-actions">
            <Link className="primary-button" href="/#contact">
              Contact Us
            </Link>
            <Link className="secondary-button" href="/">
              Back Home
            </Link>
          </div>
        </div>

        <div className="service-page-panel" aria-label="Careers highlights">
          <div className="service-page-wave" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="service-page-metrics">
            <span>Product-minded team</span>
            <span>Voice AI systems</span>
            <span>Customer-first work</span>
          </div>
        </div>
      </section>

      <section className="service-page-details" aria-label="Career values">
        {careerValues.map((value, index) => (
          <article key={value.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{value.title}</h2>
            <p>{value.body}</p>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
