import { notFound } from "next/navigation";

import { PlatformWhiteLabelConsole } from "@/components/white-label/PlatformWhiteLabelConsole";
import { whiteLabelFrontendEnabled } from "@/lib/platformHosts";

export default function PlatformWhiteLabelPage() {
  if (!whiteLabelFrontendEnabled()) notFound();
  return <PlatformWhiteLabelConsole />;
}
