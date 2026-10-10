"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";
import { Button, Card, Callout } from "@/components/ui";
import { AcademyLogo } from "@/components/chrome";

type Mode = "login" | "signup" | "forgot";

const CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/* Supabase is loaded only when the user actually submits (dynamic import keeps
   ~67KB gz of supabase-js out of the initial client chunk; run 44). */
async function supabaseBrowser() {
  return (await import("@/lib/supabase")).supabaseBrowser();
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  /* Forgot-mode only: successful request swaps the form for a confirmation
     panel (industry-standard "check your email" state). Never set in the
     unconfigured stub path — showing it there would imply a link was sent. */
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);

  /* Focus ownership: sighted keyboard users are moved to new messages (run 44
     a11y P0). Banners carry tabIndex=-1 so they receive focus without entering
     the tab order; role=alert/status keeps screen-reader announcements. */
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);
  useEffect(() => {
    if (sentTo) sentRef.current?.focus();
  }, [sentTo]);

  const titles: Record<Mode, string> = {
    login: "Welcome back",
    signup: "Start learning free",
    forgot: "Reset your password",
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      setError("Please enter a valid email address.");
      setDone(null);
      return;
    }
    if (mode !== "forgot" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      setDone(null);
      return;
    }
    if (!CONFIGURED) {
      setError(
        mode === "forgot"
          ? "Password reset isn't connected yet. Accounts open with the Exams beta, so nothing was sent."
          : "Accounts aren't connected yet. This build doesn't create sessions, and your details weren't sent anywhere."
      );
      setDone(null);
      return;
    }
    setError(null);
    setDone(null);
    setBusy(true);
    try {
      const sb = await supabaseBrowser();
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email: clean, password });
        if (error) throw error;
        router.push("/account");
        router.refresh();
      } else if (mode === "signup") {
        const { error } = await sb.auth.signUp({ email: clean, password });
        if (error) throw error;
        setDone("Account created — check your email to verify, then sign in.");
      } else {
        const { error } = await sb.auth.resetPasswordForEmail(clean, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        setSentTo(clean);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const field = "w-full rounded-xl border border-border px-4 py-3 text-base focus:border-academy-blue bg-paper";

  const emailId = "auth-email";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md !p-8">
        <div className="flex justify-center mb-6"><AcademyLogo /></div>
        {mode === "forgot" && sentTo ? (
          <div ref={sentRef} tabIndex={-1} role="status" className="faq-reveal outline-none">
            <div className="flex justify-center mb-4">
              <span
                aria-hidden="true"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border bg-paper"
              >
                <MailCheck className="h-7 w-7 text-academy-teal" />
              </span>
            </div>
            <h1 className="font-display text-2xl tracking-tight text-ink text-center text-balance">
              Check your email
            </h1>
            <p className="text-sm text-slate text-center mt-3">
              If <strong className="text-ink">{sentTo}</strong> is registered, you&apos;ll receive a
              reset link shortly.
            </p>
            <p className="text-sm text-slate text-center mt-2">
              Check your inbox — and the spam folder.
            </p>
            <div className="mt-6 space-y-3">
              <Button href="/login" variant="secondary" className="w-full">
                Back to sign in
              </Button>
              <p className="text-sm text-slate text-center">
                Didn&apos;t get it?{" "}
                <button
                  type="button"
                  onClick={() => setSentTo(null)}
                  className="text-academy-blue hover:underline font-semibold"
                >
                  Try a different email
                </button>
                <br />
                No longer have that inbox?{" "}
                <Link href="/contact" className="text-academy-blue hover:underline font-semibold">
                  Contact support
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-ink text-center">{titles[mode]}</h1>
            <p className="text-sm text-slate text-center mt-2">
              {mode === "signup" && "Free diagnostic and sample quests need no account — this is for saving progress later."}
              {mode === "login" && "Learner and parent accounts."}
              {mode === "forgot" && "Enter the email your account uses."}
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor={emailId} className="block font-semibold text-ink mb-1.5 text-sm">Email</label>
                <input
                  id={emailId}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className={field}
                  value={email}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "auth-error" : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                />
              </div>
              {mode !== "forgot" && (
                <div>
                  <label htmlFor="auth-pass" className="block font-semibold text-ink mb-1.5 text-sm">Password</label>
                  <input id="auth-pass" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} className={field} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              )}
              {error && (
                <p
                  ref={errorRef}
                  tabIndex={-1}
                  id="auth-error"
                  role="alert"
                  className="text-sm font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 outline-none"
                >
                  {error}
                </p>
              )}
              {done && (
                <p
                  ref={doneRef}
                  tabIndex={-1}
                  id="auth-done"
                  role="status"
                  className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 outline-none"
                >
                  {done}
                </p>
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
          </>
        )}
      </Card>
    </div>
  );
}
