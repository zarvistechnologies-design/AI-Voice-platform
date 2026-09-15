import { Suspense } from "react";
import { AuthRecoveryShell } from "@/components/auth/AuthRecoveryShell";

export default function VerifyEmailPage() {
  return <Suspense><AuthRecoveryShell mode="verify" /></Suspense>;
}
