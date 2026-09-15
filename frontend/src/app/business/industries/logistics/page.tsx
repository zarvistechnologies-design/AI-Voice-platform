import { generateIndustryMetadata, IndustryPage } from "../IndustryPage";

export const metadata = generateIndustryMetadata("logistics");

export default function LogisticsPage() {
  return <IndustryPage slug="logistics" />;
}
