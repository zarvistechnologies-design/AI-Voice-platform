import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroSection } from "@/components/sections/HeroSection";
import { HomePlatformSections } from "@/components/sections/HomePlatformSections";

export default function Home() {
  return (
    <SiteLayout>
      <div className="home-page-background min-h-screen text-slate-950">
        <HeroSection />
        <HomePlatformSections />
      </div>
    </SiteLayout>
  );
}
