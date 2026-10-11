import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign In",
  // Utility auth page, not content: noindex (run-27 convention — title + robots only).
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
