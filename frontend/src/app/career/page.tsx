import { DetailPage } from "@/components/layout/DetailPage";

export const metadata = {
  title: "Careers | vozon.ai",
  description: "Join vozon.ai and help build the future of voice AI.",
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
    <DetailPage
      kicker="Careers"
      title="Build the future of voice AI with us"
      summary="Join a team creating smarter, more human voice experiences for support, sales, operations, and product teams."
      highlights={["Product-minded team", "Voice AI systems", "Customer-first work"]}
      sections={careerValues}
      primaryAction={{ href: "/#contact", label: "Contact Us" }}
      secondaryAction={{ href: "/", label: "Back Home" }}
    />
  );
}
