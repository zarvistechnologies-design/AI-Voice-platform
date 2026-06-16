import { generateIndustryMetadata, IndustryPage } from "../IndustryPage";

export const metadata = generateIndustryMetadata("insurance");

export default function InsurancePage() {
  return <IndustryPage slug="insurance" />;
}
