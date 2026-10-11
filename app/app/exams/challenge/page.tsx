import type { Metadata } from "next";
import Link from "next/link";
import ChallengeRunner from "@/components/challenge-runner";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Today's challenge · JFT-Basic practice",
  description:
    "Five JFT-Basic practice questions, reshuffled at your local midnight. The same set for everyone on the same day.",
  // Learner-app surface: noindex (defense in depth over the /app layout rule).
  robots: { index: false, follow: false },
};

export default function ChallengePage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 md:py-14">
      <p className="text-sm">
        <Link
          href="/app/exams"
          className="font-semibold text-academy-teal-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal-dark rounded"
        >
          <span aria-hidden>←</span> My progress
        </Link>
      </p>
      <p className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-slate">
        Daily habit
      </p>
      <h1
        className="mt-2 font-display font-bold tracking-[-0.03em] text-ink text-balance"
        style={{ fontSize: "clamp(2.25rem, 6vw, 3.75rem)" }}
      >
        Today&apos;s challenge.
      </h1>
      <p className="mt-4 text-slate leading-relaxed max-w-xl">
        Five questions, reshuffled at your local midnight — the same set for everyone on the
        same day. Answering them counts toward your daily goal and keeps your streak alive.
      </p>
      <p className="mt-3">
        <Badge tone="warning">Draft — pending Japanese SME review</Badge>
      </p>
      <div className="mt-8">
        <ChallengeRunner />
      </div>
    </main>
  );
}
