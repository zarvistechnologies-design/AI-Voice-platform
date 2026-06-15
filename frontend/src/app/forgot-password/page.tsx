import { Suspense } from "react";
import { AuthRecoveryShell } from "@/components/auth/AuthRecoveryShell";

export default function ForgotPasswordPage() {
  return <Suspense><AuthRecoveryShell mode="forgot" /></Suspense>;
}
