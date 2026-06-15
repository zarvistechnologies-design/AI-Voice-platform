import { Suspense } from "react";
import { AuthRecoveryShell } from "@/components/auth/AuthRecoveryShell";

export default function ResetPasswordPage() {
  return <Suspense><AuthRecoveryShell mode="reset" /></Suspense>;
}
