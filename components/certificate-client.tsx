"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Badge, Card } from "@/components/ui";
import CredentialCard from "@/components/credential-card";
import {
  CREDENTIAL_EXAM,
  CREDENTIAL_KINDS,
  CREDENTIAL_KIND_ORDER,
  deriveCredentialId,
  issuedFor,
  newestEligibleAttempt,
  readIssued,
  saveIssued,
  type AttemptLite,
  type CredentialKind,
  type CredentialPayload,
  type IssuedCredential,
} from "@/lib/credentials";

function readAttempts(): AttemptLite[] {
  try {
    const raw = JSON.parse(localStorage.getItem("ua-attempts") ?? "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

const ms = (iso: string) => new Date(iso).getTime();

interface Row {
  kind: CredentialKind;
  /** Claimable right now (never issued, or re-earned since). */
  claimable: boolean;
  /** ISO completed-at for the claim, when claimable. */
  claimAt: string | null;
  /** Question count for the claim, when claimable. */
  claimTotal: number;
  /** Latest issued credential, if any. */
  done: IssuedCredential | null;
  /** Issued before, but a newer completion exists. */
  reEarnable: boolean;
  /** Why this kind isn't claimable yet (how-to-earn copy). */
  locked: boolean;
}

function buildRows(attempts: AttemptLite[], issued: IssuedCredential[]): Row[] {
  const doneFor = (kind: CredentialKind) => issuedFor(kind, CREDENTIAL_EXAM.slug);
  return CREDENTIAL_KIND_ORDER.map((kind) => {
    const info = CREDENTIAL_KINDS[kind];
    const done = doneFor(kind);
    if (info.requires) {
      const reqs = info.requires.map(doneFor);
      const claimable = reqs.every(Boolean);
      const claimAt = claimable
        ? reqs.reduce((a, b) => (ms(a!.completedAt) >= ms(b!.completedAt) ? a : b))!.completedAt
        : null;
      const reEarnable =
        !!done && claimable && reqs.some((r) => ms(r!.issuedAt) > ms(done.issuedAt));
      return {
        kind,
        claimable: claimable && (!done || reEarnable),
        claimAt,
        claimTotal: 0,
        done,
        reEarnable,
        locked: !claimable,
      };
    }
    const eligible = newestEligibleAttempt(kind, attempts);
    const reEarnable = !!done && !!eligible && ms(eligible.at) > ms(done.completedAt);
    return {
      kind,
      claimable: !!eligible && (!done || reEarnable),
      claimAt: eligible ? new Date(eligible.at).toISOString() : null,
      claimTotal: eligible ? eligible.total : 0,
      done,
      reEarnable,
      locked: !eligible,
    };
  });
}

export default function CertificateClient() {
  const searchParams = useSearchParams();
  const preselect = searchParams.get("kind") as CredentialKind | null;

  const [attempts, setAttempts] = useState<AttemptLite[] | null>(null);
  const [issued, setIssued] = useState<IssuedCredential[]>([]);
  const [name, setName] = useState("");
  const [issuing, setIssuing] = useState<CredentialKind | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const issuedHeadingRefs = useRef<Record<string, HTMLHeadingElement | null>>({});

  useEffect(() => {
    setAttempts(readAttempts());
    setIssued(readIssued());
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
    try {
      setName(localStorage.getItem("ua-credential-name") ?? "");
    } catch {
      /* ignore */
    }
  }, []);

  const rows = useMemo(
    () => (attempts === null ? null : buildRows(attempts, issued)),
    [attempts, issued]
  );

  const firstClaimable = rows?.find((r) => r.claimable) ?? null;

  /** Live preview: the actual credential document, name typed straight onto it. */
  const preview: CredentialPayload | null =
    firstClaimable && firstClaimable.claimAt
      ? {
          v: 1,
          id: deriveCredentialId({
            kind: firstClaimable.kind,
            examSlug: CREDENTIAL_EXAM.slug,
            completedAt: firstClaimable.claimAt,
            name: name.trim() || "Your name",
          }),
          kind: firstClaimable.kind,
          examSlug: CREDENTIAL_EXAM.slug,
          examTitle: CREDENTIAL_EXAM.title,
          name: name.trim() || "Your name",
          completedAt: firstClaimable.claimAt,
          detail: CREDENTIAL_KINDS[firstClaimable.kind].detailFor(
            firstClaimable.claimTotal,
            firstClaimable.claimAt
          ),
          issuedAt: new Date().toISOString(),
        }
      : null;

  function fail(message: string) {
    setError(message);
    // Announce + bring the error into view: the claim button may be far below.
    requestAnimationFrame(() => {
      errorRef.current?.scrollIntoView({ block: "center" });
      nameInputRef.current?.focus({ preventScroll: true });
    });
  }

  async function issue(row: Row) {
    const clean = name.trim().replace(/\s+/g, " ");
    if (clean.length < 2 || clean.length > 60) {
      fail("Enter your name (2–60 characters) as it should appear on the credential.");
      return;
    }
    if (/[<>]/.test(clean)) {
      fail("The name cannot contain < or >.");
      return;
    }
    if (!row.claimAt) return;
    setError(null);
    setIssuing(row.kind);
    try {
      const res = await fetch("/api/credentials/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clean,
          kind: row.kind,
          examSlug: CREDENTIAL_EXAM.slug,
          examTitle: CREDENTIAL_EXAM.title,
          completedAt: row.claimAt,
          total: row.claimTotal,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not issue the credential.");
      const credential: IssuedCredential = {
        v: 1,
        id: deriveCredentialId({
          kind: row.kind,
          examSlug: CREDENTIAL_EXAM.slug,
          completedAt: row.claimAt,
          name: clean,
        }),
        kind: row.kind,
        examSlug: CREDENTIAL_EXAM.slug,
        examTitle: CREDENTIAL_EXAM.title,
        name: clean,
        completedAt: row.claimAt,
        detail: CREDENTIAL_KINDS[row.kind].detailFor(row.claimTotal, row.claimAt),
        issuedAt: new Date().toISOString(),
        token: data.token,
        url: data.url,
      };
      setIssued(saveIssued(credential));
      try {
        localStorage.setItem("ua-credential-name", clean);
      } catch {
        /* ignore */
      }
      // Move focus to the issued credential so keyboard/SR users land on the outcome.
      requestAnimationFrame(() => {
        issuedHeadingRefs.current[row.kind]?.focus({ preventScroll: false });
      });
    } catch (e) {
      fail(e instanceof Error ? e.message : "Could not issue the credential.");
    } finally {
      setIssuing(null);
    }
  }

  async function copy(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000);
    } catch {
      /* clipboard unavailable — the link is still visible */
    }
  }

  async function share(c: IssuedCredential, title: string) {
    try {
      await navigator.share({
        title: `${c.name} — ${title}`,
        text: `My Unschool Academy practice credential: ${title}`,
        url: c.url,
      });
    } catch {
      /* dismissed — nothing to do */
    }
  }

  if (rows === null) {
    return (
      <div aria-busy="true" className="space-y-4">
        <p className="sr-only">Loading your credentials</p>
        <div className="h-40 rounded-2xl bg-border/40" />
        <div className="h-64 rounded-2xl bg-border/40" />
      </div>
    );
  }

  return (
    <div>
      {/* Issuing is a ceremony: the live document first, the form on it. */}
      {preview && firstClaimable && (
        <section aria-label="Credential preview" className="mb-10">
          <CredentialCard payload={preview} />
          <div className="mt-5 max-w-md">
            <label htmlFor="credential-name" className="block text-sm font-bold text-ink">
              Your name, as it should appear on the credential
            </label>
            <p className="mt-1 text-sm text-slate">
              Type it straight onto the document above. Shown exactly as you type it —
              we don&apos;t verify identity in the pilot.
            </p>
            <input
              id="credential-name"
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              autoComplete="name"
              placeholder="e.g. Aarav Sharma"
              className="mt-3 w-full rounded-xl border border-border bg-paper px-4 py-3 text-ink placeholder:text-slate/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal-dark"
            />
          </div>
        </section>
      )}

      {error && (
        <div
          ref={errorRef}
          role="alert"
          className="mb-6 rounded-xl border border-amber-300/70 bg-amber-50 p-5"
        >
          <p className="font-bold text-ink">Could not issue the credential</p>
          <p className="mt-1 text-[15px] text-slate">{error}</p>
        </div>
      )}

      <ul className="space-y-6">
        {rows.map((row) => {
          const info = CREDENTIAL_KINDS[row.kind];
          const highlighted = preselect === row.kind;
          return (
            <li
              key={row.kind}
              className={`rounded-2xl border px-6 py-6 ${
                highlighted ? "border-academy-teal/50 bg-academy-teal/[0.03]" : "border-border bg-paper"
              }`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-extrabold tracking-tight text-ink">{info.title}</h2>
                {row.done ? (
                  <Badge tone="success">Issued</Badge>
                ) : row.claimable ? (
                  <Badge tone="info">Ready to claim</Badge>
                ) : (
                  <Badge>Not earned yet</Badge>
                )}
              </div>

              {row.done && (
                <div className="mt-5">
                  <h3
                    ref={(el) => {
                      issuedHeadingRefs.current[row.kind] = el;
                    }}
                    tabIndex={-1}
                    className="sr-only focus-visible:outline-none"
                  >
                    {info.title} — issued
                  </h3>
                  <CredentialCard payload={row.done} verifyUrl={row.done.url} compact />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button href={`/credentials/${row.done.token}`} variant="secondary">
                      Open verification page
                    </Button>
                    <button
                      onClick={() => copy(row.done!.url, row.done!.id)}
                      className="rounded-xl border border-border bg-paper px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-academy-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal-dark active:translate-y-[1px]"
                      aria-live="polite"
                    >
                      {copiedId === row.done.id ? "Link copied" : "Copy verification link"}
                    </button>
                    {canShare && (
                      <button
                        onClick={() => share(row.done!, info.title)}
                        className="rounded-xl border border-border bg-paper px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-academy-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal-dark active:translate-y-[1px]"
                      >
                        Share…
                      </button>
                    )}
                  </div>
                </div>
              )}

              {row.claimable && (
                <div className={row.done ? "mt-6 border-t border-border pt-5" : "mt-4"}>
                  {row.reEarnable && (
                    <p className="text-[15px] text-slate leading-relaxed max-w-xl">
                      You&apos;ve completed this milestone again since the credential above was
                      issued — claim a fresh one for the newer date. Your earlier credential
                      keeps working.
                    </p>
                  )}
                  {!row.done && (
                    <p className="text-[15px] text-slate leading-relaxed max-w-xl">
                      {row.claimAt &&
                        info.detailFor(row.claimTotal, row.claimAt)}
                      . Free, and yours to share.
                    </p>
                  )}
                  <div className="mt-4">
                    <Button onClick={() => issue(row)} disabled={issuing === row.kind}>
                      {issuing === row.kind ? "Issuing…" : `Claim · ${info.title}`}
                    </Button>
                  </div>
                </div>
              )}

              {row.locked && (
                <p className="mt-3 text-[15px] text-slate leading-relaxed max-w-xl">
                  {row.kind === "diagnostic" ? (
                    <>
                      Finish the free 10-question diagnostic to earn this.{" "}
                      <Link
                        href="/exams/jft-basic/diagnostic"
                        className="font-semibold text-academy-teal-dark hover:underline"
                      >
                        Start the diagnostic
                      </Link>
                    </>
                  ) : row.kind === "full-mock" ? (
                    <>
                      Complete the 50-question, 60-minute full mock to earn this.{" "}
                      <Link
                        href="/exams/jft-basic/mock-tests"
                        className="font-semibold text-academy-teal-dark hover:underline"
                      >
                        See the mock tests
                      </Link>
                    </>
                  ) : (
                    <>
                      Earn both the diagnostic and the full-mock credentials above to
                      unlock the full practice-set record.
                    </>
                  )}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <Card className="mt-10 !shadow-none">
        <h2 className="text-lg font-extrabold text-ink">What this credential is — and isn&apos;t</h2>
        <ul className="mt-3 space-y-2 text-[15px] text-slate leading-relaxed list-disc pl-5">
          <li>
            It records <strong className="text-ink">completion</strong>: you finished the
            milestone on this device. It is not a score, a rank, or a
            proficiency certificate.
          </li>
          <li>
            The verification link proves the record was issued by Unschool Academy and
            hasn&apos;t been altered — it does not verify your identity, and the
            underlying attempt lives in this browser&apos;s practice log.
          </li>
          <li>
            These are pilot practice credentials. They carry no official standing with the
            Japan Foundation or any exam body.
          </li>
        </ul>
      </Card>

      <p className="mt-6 text-sm text-slate">
        <Link href="/app/exams" className="font-semibold text-academy-teal-dark hover:underline">
          <span aria-hidden>←</span> Back to my progress
        </Link>
      </p>
    </div>
  );
}
