"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { loginWithGoogle, validateStoredSession } from "@/lib/auth";

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleIdentity = {
  accounts: {
    id: {
      initialize(input: {
        client_id: string;
        callback(response: GoogleCredentialResponse): void;
        cancel_on_tap_outside?: boolean;
      }): void;
      renderButton(element: HTMLElement, options: Record<string, unknown>): void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const googleScriptId = "google-identity-services";
const googleClientId =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim()
  || "754509312565-fin7bh1v5eielo3s8qjds3cjdh0ib7v6.apps.googleusercontent.com";

function loadGoogleIdentityScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.google?.accounts.id) {
      resolve();
      return;
    }
    const existing = document.getElementById(googleScriptId) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google sign-in could not be loaded.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = googleScriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google sign-in could not be loaded."));
    document.head.appendChild(script);
  });
}

export function GoogleSignInButton({
  nextPath,
  disabled,
  onError,
}: {
  nextPath: string;
  disabled: boolean;
  onError(message: string): void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        await loadGoogleIdentityScript();
        if (cancelled || !containerRef.current || !window.google?.accounts.id) return;

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          cancel_on_tap_outside: true,
          callback: async ({ credential }) => {
            if (!credential) {
              onError("Google did not return a sign-in credential.");
              return;
            }
            try {
              await loginWithGoogle(credential);
              const session = await validateStoredSession();
              if (!session) throw new Error("Google sign-in completed, but the session could not be verified.");
              router.push(nextPath);
            } catch (error) {
              onError(error instanceof Error ? error.message : "Could not sign in with Google.");
            }
          },
        });
        containerRef.current.replaceChildren();
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: Math.min(420, containerRef.current.clientWidth || 420),
        });
        setReady(true);
      } catch (error) {
        if (!cancelled) onError(error instanceof Error ? error.message : "Google sign-in is not available.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [nextPath, onError, router]);

  return (
    <div className={`grid gap-3 transition ${disabled ? "pointer-events-none opacity-60" : ""}`}>
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/28">or</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <div className={`relative grid min-h-11 place-items-center overflow-hidden rounded-xl ${ready ? "" : "border border-white/10 bg-white/[0.035]"}`}>
        <div aria-label="Continue with Google" className="grid w-full place-items-center" ref={containerRef} />
        {!ready ? <span className="pointer-events-none absolute text-xs font-semibold text-white/40">Loading Google sign-in…</span> : null}
      </div>
    </div>
  );
}
