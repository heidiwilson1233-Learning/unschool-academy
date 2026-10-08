"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Callout } from "@/components/ui";
import { AcademyLogo } from "@/components/chrome";

type Mode = "login" | "signup" | "forgot";

export function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const titles: Record<Mode, string> = {
    login: "Welcome back",
    signup: "Start learning free",
    forgot: "Reset your password",
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (mode !== "forgot" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError(null);
    // No auth backend in this staged build — honest state, no fake session.
    setError(
      mode === "forgot"
        ? "Password reset will be available when accounts launch with the Exams beta. Nothing was sent."
        : "Accounts open with the Exams beta. This staged build doesn't create sessions yet — your details weren't sent anywhere."
    );
  };

  const field = "w-full rounded-xl border border-border px-4 py-3 text-base focus:border-academy-blue bg-paper";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md !p-8">
        <div className="flex justify-center mb-6"><AcademyLogo /></div>
        <h1 className="text-2xl font-extrabold text-ink text-center">{titles[mode]}</h1>
        <p className="text-sm text-slate text-center mt-2">
          {mode === "signup" && "Free diagnostic and sample quests need no account — this is for saving progress later."}
          {mode === "login" && "Learner and parent accounts."}
          {mode === "forgot" && "We'll email you a reset link."}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="auth-email" className="block font-semibold text-ink mb-1.5 text-sm">Email</label>
            <input id="auth-email" type="email" autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {mode !== "forgot" && (
            <div>
              <label htmlFor="auth-pass" className="block font-semibold text-ink mb-1.5 text-sm">Password</label>
              <input id="auth-pass" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} className={field} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">{error}</p>
          )}
          <Button type="submit" size="lg" className="w-full">
            {mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </Button>
        </form>
        <Callout title="Staged build" tone="info">
          Authentication is not live in this build. Forms validate honestly and create nothing —
          no fake sessions, no stored credentials.
        </Callout>
        <div className="mt-4 text-center text-sm text-slate space-x-4">
          {mode === "login" && (<><Link href="/signup" className="text-academy-blue hover:underline font-semibold">Create account</Link><Link href="/forgot-password" className="text-academy-blue hover:underline">Forgot password?</Link></>)}
          {mode === "signup" && (<><Link href="/login" className="text-academy-blue hover:underline font-semibold">Sign in instead</Link></>)}
          {mode === "forgot" && (<Link href="/login" className="text-academy-blue hover:underline font-semibold">Back to sign in</Link>)}
        </div>
      </Card>
    </div>
  );
}
