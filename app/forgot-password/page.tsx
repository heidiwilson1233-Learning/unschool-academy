import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Reset Password",
  // Utility auth page, not content: noindex (house rule, run 27 — title + robots only).
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" />;
}
