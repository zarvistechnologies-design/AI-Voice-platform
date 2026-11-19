import type { Metadata } from "next";
import { SolutionShowcasePage } from "@/components/solutions/SolutionShowcasePage";
import { solutionPagesCatalog } from "@/config/solutionPagesCatalog";

export const metadata: Metadata = {
  title: "AI Voice Agents for Healthcare & Patient Calls | Vozon",
  description:
    "See how Vozon AI voice agents help healthcare teams handle appointment calls, refill reminders, patient questions, intake, and staff handoffs.",
  alternates: { canonical: "/business/industries/healthcare" },
  openGraph: {
    title: "Healthcare AI Voice Agents | Vozon",
    description: "A clearer path from every patient call to the next step.",
    type: "website",
  },
};

export default function HealthcarePage() {
  return <SolutionShowcasePage data={solutionPagesCatalog.healthcare} />;
}
