"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getSession } from "@/lib/auth";
import { organizationApi } from "@/lib/organizations";

export function InviteAccept({ token }: { token: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("Accepting your organization invitation...");

  useEffect(() => {
    if (!getSession()) {
      router.replace(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
      return;
    }
    void organizationApi
      .acceptInvitation(token)
      .then(() => {
        setMessage("Invitation accepted. Opening your new workspace...");
        router.replace("/dashboard/settings");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Could not accept invitation."));
  }, [router, token]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur">
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-blue-500 text-xl font-semibold">AI</span>
        <h1 className="m-0 text-xl font-semibold">Organization invitation</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{message}</p>
      </section>
    </main>
  );
}
