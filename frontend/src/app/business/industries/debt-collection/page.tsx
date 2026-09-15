import { generateIndustryMetadata, IndustryPage } from "../IndustryPage";

export const metadata = generateIndustryMetadata("debt-collection");

export default function DebtCollectionPage() {
  return <IndustryPage slug="debt-collection" />;
}
