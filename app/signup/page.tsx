import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Start learning for free",
  /* Staged-stub auth page: zero indexable value (run-60 convention on /login);
     flagged in run 60 for the signup run's own turn. */
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
