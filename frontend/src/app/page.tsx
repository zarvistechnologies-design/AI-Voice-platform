import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhoWeAreSection } from "@/components/sections/WhoWeAreSection";

export default function Home() {
  return (
    <SiteLayout>
      <HeroSection />
      <WhoWeAreSection />
    </SiteLayout>
  );
}
