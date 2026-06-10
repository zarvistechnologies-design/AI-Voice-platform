import { SiteLayout } from "@/components/layout/SiteLayout";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HeroSection } from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <SiteLayout>
      <HeroSection />
      <FeaturesSection />
    </SiteLayout>
  );
}
