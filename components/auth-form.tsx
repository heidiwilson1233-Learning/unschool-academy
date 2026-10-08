"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Callout } from "@/components/ui";
import { AcademyLogo } from "@/components/chrome";
import { supabaseBrowser } from "@/lib/supabase";

type Mode = "login" | "signup" | "forgot";

const CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const titles: Record<Mode, string> = {
    login: "Welcome back",
    signup: "Start learning free",
    forgot: "Reset your password",
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (mode !== "forgot" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!CONFIGURED) {
      setError(
        mode === "forgot"
          ? "Password reset isn't connected yet — accounts open with the Exams beta. Nothing was sent."
          : "Accounts aren't connected yet — this build doesn't create sessions. Your details weren't sent anywhere."
      );
      return;
    }
    setError(null);
    setDone(null);
    setBusy(true);
    try {
      const sb = supabaseBrowser();
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/account");
        router.refresh();
      } else if (mode === "signup") {
        const { error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        setDone("Account created — check your email to verify, then sign in.");
      } else {
        const { error } = await sb.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        setDone("If an account exists for this email, a reset link is on its way.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
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
          {done && (
            <p role="status" className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">{done}</p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Working…" : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </Button>
        </form>
        {!CONFIGURED && (
          <div className="mt-4">
            <Callout title="Accounts not connected yet" tone="info">
              Sign-in is staged until a Supabase project is connected. Forms validate honestly and create nothing —
              no fake sessions, no stored credentials.
            </Callout>
          </div>
        )}
        <div className="mt-4 text-center text-sm text-slate space-x-4">
          {mode === "login" && (<><Link href="/signup" className="text-academy-blue hover:underline font-semibold">Create account</Link><Link href="/forgot-password" className="text-academy-blue hover:underline">Forgot password?</Link></>)}
          {mode === "signup" && (<Link href="/login" className="text-academy-blue hover:underline font-semibold">Sign in instead</Link>)}
          {mode === "forgot" && (<Link href="/login" className="text-academy-blue hover:underline font-semibold">Back to sign in</Link>)}
        </div>
      </Card>
    </div>
  );
}
