"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui";
import {
  CREDENTIAL_EXAM,
  CREDENTIAL_KINDS,
  issuedFor,
  newestEligibleAttempt,
  type AttemptLite,
  type CredentialKind,
} from "@/lib/credentials";

/**
 * Nudge shown on diagnostic / full-mock results.
 * - Eligible and unclaimed → "claim" CTA.
 * - Already issued → quiet "view your credential" pointer (revisit-to-share
 *   is the credential's job; results pages are where pride lives).
 * - Otherwise renders nothing.
 */
export default function CredentialClaimCard({ kind }: { kind: CredentialKind }) {
  const [state, setState] = useState<"loading" | "eligible" | "issued" | "done">("loading");

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("ua-attempts") ?? "[]");
      const attempts: AttemptLite[] = Array.isArray(raw) ? raw : [];
      const eligible = newestEligibleAttempt(kind, attempts);
      const issued = issuedFor(kind, CREDENTIAL_EXAM.slug);
      if (issued && (!eligible || new Date(issued.completedAt).getTime() >= new Date(eligible.at).getTime())) {
        setState("issued");
      } else if (eligible) {
        setState("eligible");
      } else {
        setState("done");
      }
    } catch {
      setState("done");
    }
  }, [kind]);

  if (state === "loading" || state === "done") return null;
  const info = CREDENTIAL_KINDS[kind];

  if (state === "issued") {
    return (
      <div className="mt-8 rounded-2xl border border-border bg-paper px-6 py-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="flex-1 min-w-52 text-[15px] text-ink leading-relaxed">
          <span className="font-bold">Credential issued</span>
          <span className="text-slate">
            {" "}— your {info.title.toLowerCase()} record, with its verification link.
          </span>
        </p>
        <Button href="/app/exams/certificate" variant="secondary">
          View my credential
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-academy-teal/40 bg-academy-teal/5 px-6 py-6">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal-dark">
        Milestone earned
      </p>
      <h2 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
        Your {kind === "full-mock" ? "full-mock" : info.title.toLowerCase().replace(" complete", "")} record is ready
      </h2>
      <p className="mt-2 text-[15px] text-slate leading-relaxed max-w-xl">
        Turn this session into a named, verifiable practice credential — free, takes ten
        seconds, and you can share the verification link anywhere.
      </p>
      <div className="mt-4">
        <Button href={`/app/exams/certificate?kind=${kind}`} variant="secondary">
          Claim my credential
        </Button>
      </div>
    </div>
  );
}
