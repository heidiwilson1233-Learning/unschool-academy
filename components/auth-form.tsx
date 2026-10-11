"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, MailCheck } from "lucide-react";
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
  /* Which field (if any) a visible error belongs to: the shared `error` state alone
     marked the email input invalid even for password-length errors. errorFor pins
     the banner to the offending field ("form" = non-field errors). */
  const [errorFor, setErrorFor] = useState<"email" | "password" | "form" | null>(null);
  const [done, setDone] = useState<string | null>(null);
  /* Show/hide password toggle state (run 64, A-P0/B-P1: signup's highest-friction
     field is invisible by default; a typo'd new password becomes a dead account). */
  const [showPassword, setShowPassword] = useState(false);
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
    signup: "Start learning for free",
    forgot: "Reset your password",
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      setError("Please enter a valid email address.");
      setErrorFor("email");
      setDone(null);
      return;
    }
    if (mode !== "forgot" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      setErrorFor("password");
      setDone(null);
      return;
    }
    if (!CONFIGURED) {
      setError(
        mode === "forgot"
          ? "Password reset isn't connected yet. Accounts open with the Exams beta, so nothing was sent."
          : "Accounts aren't connected yet. This build doesn't create sessions, and your details weren't sent anywhere."
      );
      setErrorFor("form");
      setDone(null);
      return;
    }
    setError(null);
    setErrorFor(null);
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
        setDone("Account created. Check your email to verify, then sign in.");
      } else {
        const { error } = await sb.auth.resetPasswordForEmail(clean, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        setSentTo(clean);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setErrorFor("form");
    } finally {
      setBusy(false);
    }
  };

  const field = "w-full rounded-xl border border-border px-4 py-3 text-base focus:border-academy-blue bg-paper";

  const emailId = "auth-email";

  /* aria-describedby composition for the password input: the signup-mode hint is
     always present (WCAG 3.3.2 — show requirements upfront), the error id is
     appended when an error is pinned to the field. */
  const passwordDescribedBy =
    [
      mode === "signup" ? "auth-pass-hint" : null,
      errorFor === "password" || errorFor === "form" ? "auth-error" : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

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
              Check your inbox, and the spam folder.
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
              {mode === "signup" && "Create an account to save your diagnostic results, streaks, and mastery, free. The free diagnostic and sample quests need no account."}
              {mode === "login" && "Pilot sign-in for learner and parent accounts. The free diagnostic and practice need no account."}
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
                  aria-invalid={errorFor === "email" ? true : undefined}
                  aria-describedby={errorFor === "email" || errorFor === "form" ? "auth-error" : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorFor === "email" || errorFor === "form") {
                      setError(null);
                      setErrorFor(null);
                    }
                  }}
                />
              </div>
              {mode !== "forgot" && (
                <div>
                  <label htmlFor="auth-pass" className="block font-semibold text-ink mb-1.5 text-sm">Password</label>
                  <div className="relative">
                    <input
                      id="auth-pass"
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      className={`${field} pr-12`}
                      value={password}
                      aria-invalid={errorFor === "password" ? true : undefined}
                      aria-describedby={passwordDescribedBy}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorFor === "password" || errorFor === "form") {
                          setError(null);
                          setErrorFor(null);
                        }
                      }}
                    />
                    {/* Show/hide toggle — the page's signature micro-interaction
                        (run 64 premium pattern): keyboard-focusable button with
                        brand focus ring, 180ms :active squish, GPU-only,
                        reduced-motion-safe. */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-pressed={showPassword}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate hover:text-ink hover:bg-ink/5 active:scale-95 motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {/* Visible requirement hint, signup mode only — the rule is shown
                      upfront rather than revealed by a failed submit (WCAG 3.3.2).
                      Single-line satisfied state (A+B, run 64). */}
                  {mode === "signup" && (
                    <p
                      id="auth-pass-hint"
                      className={`text-xs mt-1.5 transition-colors duration-200 motion-reduce:transition-none ${password.length >= 8 ? "text-academy-teal font-semibold" : "text-slate"}`}
                    >
                      {password.length >= 8 ? "Good. 8+ characters." : "At least 8 characters."}
                    </p>
                  )}
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
              {/* Busy-state announcement (run 64, B+C): the submit button is disabled
                  while busy, so a disabled button's label change is not reliably
                  announced — a dedicated polite live region covers it. */}
              {busy && (
                <p className="sr-only" role="status">
                  Working. Please wait.
                </p>
              )}
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? "Working…" : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
              </Button>
            </form>
            {!CONFIGURED && (
              <div className="mt-4">
                <Callout title="Accounts not connected yet" tone="info">
                  Sign-in is staged until a Supabase project is connected. Forms validate honestly and create nothing.
                  No fake sessions, no stored credentials.
                </Callout>
              </div>
            )}
            <div className="mt-4 text-center text-sm text-slate space-x-4">
              {mode === "login" && (<><Link href="/signup" className="text-academy-blue hover:underline font-semibold">Create account</Link><Link href="/forgot-password" className="text-academy-blue hover:underline">Forgot password?</Link></>)}
              {mode === "signup" && (<Link href="/login" className="text-academy-blue hover:underline font-semibold">Sign in instead</Link>)}
              {mode === "forgot" && (<Link href="/login" className="text-academy-blue hover:underline font-semibold">Back to sign in</Link>)}
            </div>
            {/* Login-mode frictionless-entry rail (portal move 8): accounts are staged
               stubs and the free diagnostic/practice need no account, so /login must
               not be a dead-end wall — one escape link routes confused visitors
               around the stub instead of into it. noindex makes link-farm risk nil. */}
            {mode === "login" && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-center text-sm text-slate">
                  Not ready to sign in?{" "}
                  <Link href="/free-practice" className="text-academy-blue hover:underline font-semibold">
                    Try the free diagnostic
                  </Link>{" "}
                  No account needed.
                </p>
              </div>
            )}
            {/* Signup-mode frictionless-entry rail (portal move 8, A+B run 64): the
               login run shipped this escape target, signup only ever had the
               non-linked honesty sentence — a visitor landing here gets a real
               way around the staged stub instead of into it. noindex makes
               link-farm risk nil (run-60 precedent). */}
            {mode === "signup" && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-center text-sm text-slate">
                  Not sure you need an account yet?{" "}
                  <Link href="/free-practice" className="text-academy-blue hover:underline font-semibold">
                    Try the free diagnostic
                  </Link>{" "}
                  No account needed.
                </p>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
