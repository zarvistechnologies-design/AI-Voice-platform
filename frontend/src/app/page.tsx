import { SiteLayout } from "@/components/layout/SiteLayout";
import { HomePlatformSections } from "@/components/sections/HomePlatformSections";
import { EnquiryChatbot } from "@/components/sections/EnquiryChatbot";

export default function Home() {
  return (
    <SiteLayout>
      <HomePlatformSections />
      <EnquiryChatbot />
    </SiteLayout>
  );
}

