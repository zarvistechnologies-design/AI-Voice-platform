"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getSession, refreshStoredSession } from "@/lib/auth";
import { organizationApi } from "@/lib/organizations";
import { useBrand } from "@/components/branding/BrandProvider";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function InviteAccept({ token }: { token: string }) {
  const brand = useBrand();
  const router = useRouter();
  const [message, setMessage] = useState("Accepting your organization invitation...");

  useEffect(() => {
    if (!getSession()) {
      router.replace(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
      return;
    }
    void organizationApi
      .acceptInvitation(token)
      .then(async () => {
        await refreshStoredSession();
        setMessage("Invitation accepted. Opening your new workspace...");
        router.replace("/dashboard");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Could not accept invitation."));
  }, [router, token]);

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--brand-surface)] p-6 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur">
        <div className="mb-5 flex justify-center"><BrandLogo showWebsiteLogo /></div>
        <h1 className="m-0 text-xl font-semibold">{brand.productName} invitation</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{message}</p>
      </section>
    </main>
  );
}
