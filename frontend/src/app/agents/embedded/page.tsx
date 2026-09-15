import { Suspense } from "react";

import { EmbeddedVoiceWidget } from "./EmbeddedVoiceWidget";

export default function EmbeddedAgentPage() {
  return (
    <Suspense fallback={null}>
      <EmbeddedVoiceWidget />
    </Suspense>
  );
}
