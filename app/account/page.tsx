import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Section, Button, Badge, Breadcrumbs, Callout } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase";
import { currentUser } from "@/lib/supabase-server";
import { SignOutButton } from "@/components/sign-out-button";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Your Unschool Academy profile, learning data, sessions, and account deletion settings.",
  // Auth-gated page, not content: noindex (mirrors app/app/exams/layout.tsx).
  // No canonical/OG/JSON-LD — structured data on a non-indexable page is moot.
  robots: { index: false, follow: false },
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/** Mono micro-label honesty badge — staged stubs are plans, not features. */
function StagedBadge() {
  return (
    <span className="ml-3 inline-block rounded border border-border px-2 py-0.5 align-middle font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate">
      Staged — arrives with accounts
    </span>
  );
}

/** One hairline-ruled dossier row: mono label left, value right. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li className="flex flex-col gap-1 border-t border-border py-4 first:border-t-0 first:pt-1 last:pb-1 sm:flex-row sm:items-baseline sm:gap-6">
      <span className="shrink-0 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate sm:w-44">
        {label}
      </span>
      <div className="flex-1 text-[15px] leading-relaxed text-ink">{children}</div>
    </li>
  );
}

const SECTIONS = [
  { id: "identity", label: "Identity" },
  { id: "sessions", label: "Sessions" },
  { id: "learning-data", label: "Learning data" },
  { id: "billing", label: "Plans & billing" },
  { id: "delete", label: "Delete my account" },
];

export default async function AccountPage() {
  const configured = isSupabaseConfigured();
  const user = await currentUser();
  if (configured && !user) redirect("/login");

  const verified = Boolean(user?.email_confirmed_at);
  const statusLine = !configured
    ? "Auth — staged · no real profiles yet"
    : verified
      ? "Auth — active · email verified"
      : "Auth — active · email verification pending";

  // Jittered entrance delays (52/91/140/190ms) — masked clip wipes, never fade-up.
  const delays = ["0ms", "52ms", "91ms", "140ms", "190ms"];

  return (
    <>
      {/* Authored dossier header: breadcrumbs first, type-as-hero h1, live status strip. */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 30rem at 12% 0%, rgba(49,91,135,0.10), transparent 60%), radial-gradient(50rem 26rem at 88% 20%, rgba(20,125,117,0.08), transparent 60%)",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.18]" style={{ backgroundImage: GRAIN }} />
        <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 md:pb-16 md:pt-14 lg:px-8">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Account" }]} />
          <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-academy-teal-dark">
            {statusLine}
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-[-0.03em] text-ink text-balance md:text-6xl">
            Account
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate">
            Your profile, your learning data, your sessions, and account deletion. All in one place.
          </p>
        </div>
      </div>

      <Section className="py-10 md:py-14">
        <div className="mx-auto max-w-5xl" {...(!configured ? { "aria-describedby": "staged-notice" } : {})}>
          {!configured && (
            <div id="staged-notice" className="mb-10">
              <Callout title="Accounts aren't live yet" tone="info">
                Sign-in is still being set up, so nothing here manages a real profile today. Each
                section below shows what your account will hold, plainly labeled.
              </Callout>
            </div>
          )}

          <div className="grid gap-10 lg:grid-cols-6">
            {/* Main dossier column */}
            <div className="space-y-8 lg:col-span-4">
              <section
                id="identity"
                aria-labelledby="identity-h"
                className="guide-reveal rounded-2xl border border-border bg-paper p-6 md:p-8"
                style={{ animationDelay: delays[0] }}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <h2 id="identity-h" className="font-display text-2xl font-bold tracking-[-0.01em] text-ink">
                    Identity
                  </h2>
                  {configured && <SignOutButton />}
                </div>
                <ul>
                  <Row label="Email">
                    {configured ? (
                      <span className="flex flex-wrap items-center gap-3">
                        <span className="font-semibold">{user!.email}</span>
                        <Badge tone={verified ? "success" : "warning"}>
                          {verified ? "Verified" : "Verification pending"}
                        </Badge>
                      </span>
                    ) : (
                      "Added when accounts launch."
                    )}
                  </Row>
                  <Row label="Name">
                    {configured ? "Shown here once set." : "Added when accounts launch."}
                  </Row>
                  <Row label="Password">
                    Change your password any time from here
                    {!configured && " — once accounts are live."}
                  </Row>
                  <Row label="Language & region">
                    Choose your display language and region
                    {!configured && " — once accounts are live."}
                  </Row>
                </ul>
                {!configured && (
                  <p className="mt-4 text-sm text-slate">
                    Child profiles are managed separately, under the Parent Hub.
                  </p>
                )}
              </section>

              <section
                id="sessions"
                aria-labelledby="sessions-h"
                className="guide-reveal rounded-2xl border border-border bg-paper p-6 md:p-8"
                style={{ animationDelay: delays[1] }}
              >
                <h2 id="sessions-h" className="font-display text-2xl font-bold tracking-[-0.01em] text-ink">
                  Sessions
                  <StagedBadge />
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-slate">
                  See every device signed in to your account, and sign out the ones you don't
                  recognise. This view arrives with accounts.
                </p>
                <p className="mt-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">
                  Preview — illustrative, not real data
                </p>
                <ul className="mt-2">
                  <Row label="This browser">
                    Active now
                  </Row>
                </ul>
              </section>

              <section
                id="learning-data"
                aria-labelledby="learning-data-h"
                className="guide-reveal rounded-2xl border border-border bg-paper p-6 md:p-8"
                style={{ animationDelay: delays[2] }}
              >
                <h2 id="learning-data-h" className="font-display text-2xl font-bold tracking-[-0.01em] text-ink">
                  Learning data
                  <StagedBadge />
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-slate">
                  Download everything the site has recorded about your learning, as a
                  machine-readable file. Available once accounts are live.
                </p>
                <p className="mt-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">
                  Your export will contain — planned
                </p>
                <ul className="mt-2">
                  <Row label="attempts.csv">Every practice answer, timestamped.</Row>
                  <Row label="scores.json">Per-exam score breakdowns.</Row>
                  <Row label="quest-history.json">Kids quest progress.</Row>
                </ul>
                <p className="mt-4 text-sm text-slate">
                  Formats are planned and may change before launch.
                </p>
              </section>

              <section
                id="billing"
                aria-labelledby="billing-h"
                className="guide-reveal rounded-2xl border border-border bg-paper p-6 md:p-8"
                style={{ animationDelay: delays[3] }}
              >
                <h2 id="billing-h" className="font-display text-2xl font-bold tracking-[-0.01em] text-ink">
                  Plans &amp; billing
                  <StagedBadge />
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-slate">
                  Checkout runs in test mode during the pilot, so there are no real charges or
                  receipts yet. When accounts launch, your plan, receipts, and cancellation live
                  here.
                </p>
                <div className="mt-5">
                  <Button variant="secondary" size="sm" href="/pricing">
                    See current plans
                  </Button>
                </div>
              </section>

              <section
                id="delete"
                aria-labelledby="delete-h"
                className="guide-reveal rounded-2xl border border-border bg-paper p-6 md:p-8"
                style={{ animationDelay: delays[4] }}
              >
                <h2 id="delete-h" className="font-display text-2xl font-bold tracking-[-0.01em] text-ink">
                  Delete my account
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-slate">
                  This permanently deletes your profile, attempts, scores, and quest history.
                  Export your data first if you want to keep it. You will get written confirmation
                  once deletion is complete.
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-slate">
                  To delete a child's data, go to Parent Hub, then Privacy.
                </p>
                <div className="mt-5">
                  <Button variant="secondary" size="sm" href="/contact">
                    Contact us to request deletion
                  </Button>
                </div>
              </section>
            </div>

            {/* Sticky trust rail */}
            <aside className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <nav aria-label="Account sections" className="mb-6">
                  <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
                    On this page
                  </p>
                  <ul className="flex flex-wrap gap-2 lg:block lg:space-y-1 lg:gap-0">
                    {SECTIONS.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="inline-block rounded-lg px-3 py-2 text-sm font-semibold text-slate transition-colors hover:bg-academy-blue/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal lg:block"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="rounded-2xl border border-border bg-canvas p-5">
                  <p className="font-bold text-ink">Your data, in writing</p>
                  <ul className="mt-3 space-y-3 text-sm leading-relaxed text-slate">
                    <li className="border-t border-border pt-3">
                      Exports are machine-readable files you can keep.
                    </li>
                    <li className="border-t border-border pt-3">
                      Deletion is confirmed in writing.
                    </li>
                    <li className="border-t border-border pt-3">
                      Checkout runs in test mode during the pilot.
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Section>
    </>
  );
}
