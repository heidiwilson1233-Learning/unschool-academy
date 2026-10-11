import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Badge, Breadcrumbs } from "@/components/ui";
import CredentialCard from "@/components/credential-card";
import { verifyToken } from "@/lib/credential-sign";

export const metadata: Metadata = {
  title: "Verify a credential · Unschool Academy",
  description:
    "Check whether an Unschool Academy practice credential is genuine — issued by us and unaltered.",
  // Pilot privacy posture: the link works for anyone who has it, but we don't
  // feed learner names to crawlers.
  robots: { index: false, follow: false },
};

// Tokens are minted at claim time — unbounded, never pre-renderable.
// `instant = false` allows the blocking per-request render (Cache Components);
// connection() ties the dynamic render to the incoming request.
export const instant = false;

export default async function VerifyPage({ params }: { params: Promise<{ token: string }> }) {
  await connection();
  const { token } = await params;
  const payload = verifyToken(decodeURIComponent(token));

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 md:py-14">
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Verify a credential" }]} />

      {payload ? (
        <>
          <p className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-slate">
            Credential verification
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.02em] text-ink">
              Verified genuine.
            </h1>
            <Badge tone="success">Signature valid</Badge>
          </div>
          <p className="mt-4 text-slate leading-relaxed max-w-2xl">
            This credential was issued by Unschool Academy and none of its details have
            been altered since. What it claims — and what it doesn&apos;t — is stated
            below.
          </p>

          <div className="mt-8">
            <CredentialCard payload={payload} />
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-paper px-6 py-5">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-ink">
              What verification means here
            </h2>
            <ul className="mt-3 space-y-2 text-[15px] text-slate leading-relaxed list-disc pl-5">
              <li>
                The credential ID <span className="font-mono font-bold text-ink">{payload.id}</span>{" "}
                matches our issuance signature — the name, date, and details are exactly as
                issued.
              </li>
              <li>
                This is a <strong className="text-ink">practice record</strong>: it confirms
                the milestone was completed and recorded on the learner&apos;s device.
                It is not a score, a rank, or an official exam certification.
              </li>
              <li>
                The signature proves the record is unaltered since issuance — it does not
                prove the underlying attempt, which lives in the learner&apos;s browser
                practice log, and the name is shown as the learner typed it.
              </li>
            </ul>
          </div>

          {/* A credential link arriving in a chat is demonstrated value — give the
              visitor the same first step the earner took (doctrine move 8). */}
          <div className="mt-8 rounded-2xl border border-academy-teal/40 bg-academy-teal/5 px-6 py-6">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal-dark">
              Earn your own
            </p>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
              Records like this start with the free diagnostic
            </h2>
            <p className="mt-2 text-[15px] text-slate leading-relaxed max-w-xl">
              Ten questions, five minutes, no account. Finish it and your completion
              record is ready to claim.
            </p>
            <div className="mt-4">
              <Link
                href={`/exams/${payload.examSlug}`}
                className="inline-block rounded-xl bg-academy-teal-dark px-5 py-3 text-sm font-bold text-white transition-transform hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal-dark active:translate-y-[1px]"
              >
                Start the free diagnostic
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-slate">
            Credential verification
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-[-0.02em] text-ink">
            Could not be verified.
          </h1>
          <p className="mt-4 text-slate leading-relaxed max-w-2xl">
            This link doesn&apos;t match any credential we issued — it may be mistyped,
            truncated, or altered. Genuine verification links look like{" "}
            <span className="font-mono text-[15px]">unschool.academy/credentials/</span>{" "}
            followed by a long code, issued from this site&apos;s own address. If someone
            sent you a short or edited link, ask them for the original.
          </p>
          <p className="mt-6">
            <Link
              href="/"
              className="font-semibold text-academy-teal-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal-dark rounded"
            >
              <span aria-hidden>←</span> Back to Unschool Academy
            </Link>
          </p>
        </>
      )}
    </main>
  );
}
