import { generateIndustryMetadata, IndustryPage } from "../IndustryPage";

export const metadata = generateIndustryMetadata("financial-services");

export default function FinancialServicesPage() {
  return <IndustryPage slug="financial-services" />;
}
