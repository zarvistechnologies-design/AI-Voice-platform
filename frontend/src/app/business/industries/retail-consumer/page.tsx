import { generateIndustryMetadata, IndustryPage } from "../IndustryPage";

export const metadata = generateIndustryMetadata("retail-consumer");

export default function RetailConsumerPage() {
  return <IndustryPage slug="retail-consumer" />;
}
