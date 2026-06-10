import { platformFeatures } from "@/config/site";

export function FeaturesSection() {
  return (
    <section className="feature-grid" aria-label="Platform highlights">
      {platformFeatures.map((feature) => (
        <article key={feature.title}>
          <h2>{feature.title}</h2>
          <p>{feature.body}</p>
        </article>
      ))}
    </section>
  );
}
