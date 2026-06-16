import { generateIndustryMetadata, IndustryPage } from "../IndustryPage";

export const metadata = generateIndustryMetadata("home-services");

export default function HomeServicesPage() {
  return <IndustryPage slug="home-services" />;
}
