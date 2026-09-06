import { notFound } from "next/navigation";

import { PartnerWhiteLabelConsole } from "@/components/white-label/PartnerWhiteLabelConsole";
import { whiteLabelFrontendEnabled } from "@/lib/platformHosts";

export default function WhiteLabelPage() {
  if (!whiteLabelFrontendEnabled()) notFound();
  return <PartnerWhiteLabelConsole />;
}
