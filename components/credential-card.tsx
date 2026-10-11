import type { CredentialPayload } from "@/lib/credentials";
import { CREDENTIAL_KINDS } from "@/lib/credentials";
import { Badge } from "./ui";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

function fmtLong(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * The credential itself — issuer → recipient → achievement → date → verification.
 * One visual register everywhere it appears (claim preview, verify page, OG).
 */
export default function CredentialCard({
  payload,
  verifyUrl,
  compact = false,
}: {
  payload: CredentialPayload;
  verifyUrl?: string;
  compact?: boolean;
}) {
  const info = CREDENTIAL_KINDS[payload.kind];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />
      {/* top rule in brand teal — the one committed accent */}
      <div aria-hidden className="h-1.5 bg-academy-teal" />
      <div className={`relative ${compact ? "px-6 py-6" : "px-6 py-8 md:px-10 md:py-10"}`}>
        <div className="flex items-start justify-between gap-4">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal-dark">
            Unschool Academy · Practice credential
          </p>
          <Badge tone="info">Pilot</Badge>
        </div>

        <p
          className={`mt-6 font-display font-bold tracking-[-0.02em] text-ink text-balance ${
            compact ? "text-2xl" : "text-3xl md:text-4xl"
          }`}
        >
          {info.title}
        </p>

        {/* The recipient's name is the largest text on the card after the title. */}
        <p
          className={`mt-4 font-display italic text-ink ${
            compact ? "text-3xl" : "text-4xl md:text-5xl"
          } tracking-[-0.01em]`}
        >
          {payload.name}
        </p>

        <p className="mt-4 text-slate leading-relaxed max-w-xl">
          {payload.examTitle} · {payload.detail}. Issued by Unschool Academy as a practice
          milestone — not an official exam certification.
        </p>

        <dl className="mt-8 grid gap-x-8 gap-y-4 border-t border-border pt-6 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate">
              Program
            </dt>
            <dd className="mt-1 text-sm font-semibold text-ink">{info.programLine}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate">
              Completed
            </dt>
            <dd className="mt-1 text-sm font-semibold text-ink">{fmtLong(payload.completedAt)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate">
              Credential ID
            </dt>
            <dd className="mt-1 font-mono text-sm font-bold text-ink">{payload.id}</dd>
          </div>
        </dl>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-slate leading-relaxed max-w-md">
            {verifyUrl ? (
              <>
                Verify at{" "}
                <span className="font-mono font-semibold text-academy-teal-dark break-all">
                  {verifyUrl.replace(/^https?:\/\//, "")}
                </span>
              </>
            ) : (
              "Share the verification link that came with this credential to let anyone confirm it."
            )}
          </p>
          {/* Seal: a committed monogram, not a stock badge. */}
          <div
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-academy-teal/40 bg-academy-teal/5 font-display text-lg font-bold text-academy-teal-dark"
          >
            UA
          </div>
        </div>
      </div>
    </div>
  );
}
