import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhoWeAreSection } from "@/components/sections/WhoWeAreSection";

export default function Home() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_82%_12%,#00ADB530_0,transparent_34%),radial-gradient(circle_at_14%_88%,#0f766e4d_0,transparent_38%),linear-gradient(180deg,#111827_0%,#1f2937_48%,#111827_100%)] text-slate-50">
        <HeroSection />
        <WhoWeAreSection />
      </div>
    </SiteLayout>
  );
}
