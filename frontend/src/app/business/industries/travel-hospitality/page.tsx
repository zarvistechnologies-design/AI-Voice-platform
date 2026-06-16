import { generateIndustryMetadata, IndustryPage } from "../IndustryPage";

export const metadata = generateIndustryMetadata("travel-hospitality");

export default function TravelHospitalityPage() {
  return <IndustryPage slug="travel-hospitality" />;
}
