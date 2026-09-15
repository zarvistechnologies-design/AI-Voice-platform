import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { customerReviews } from "@/config/customerReviews";

export const metadata: Metadata = {
  title: "Customer Reviews | Vozon",
  description: "Read how teams use Vozon AI voice agents to improve customer conversations and automate routine work.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-white text-[#171719]">
        <section className="px-4 pb-8 pt-32 sm:px-7 sm:pb-10 sm:pt-40 lg:px-10">
          <div className="mx-auto max-w-[1180px] text-center">
            <h1 className="text-balance text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">What our customers say</h1>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-7 sm:pb-24 lg:px-10">
          <div className="mx-auto grid max-w-[1180px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {customerReviews.map((review, index) => (
              <article className="flex min-w-0 flex-col rounded-2xl border border-[#e0e1ec] bg-white p-6 shadow-[0_14px_38px_rgba(45,44,80,0.07)] sm:p-7" key={review.name}>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm tracking-[0.16em] text-[#ee9a00]" aria-hidden="true">★★★★★</span>
                  <span className="text-xs font-bold text-[#9a9baa]">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <blockquote className="mt-6 flex-1 text-[15px] leading-7 text-[#444550] sm:text-base">
                  “{review.quote}”
                </blockquote>
                <footer className="mt-7 flex items-center gap-3 border-t border-[#ececf2] pt-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(145deg,#252534,#9b715c)] text-sm font-bold text-white">
                    {review.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0 text-left">
                    <strong className="block truncate text-sm">{review.name}</strong>
                    <span className="mt-1 block text-xs text-[#777885]">{review.role}</span>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
