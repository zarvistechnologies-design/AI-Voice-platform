import type { Metadata } from "next";
import { HomeDesignFour } from "@/components/sections/HomeDesignFour";
import { EnquiryChatbot } from "@/components/sections/EnquiryChatbot";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <HomeDesignFour />
      <EnquiryChatbot />
    </>
  );
}
