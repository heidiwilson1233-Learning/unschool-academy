import type { Metadata } from "next";
import { answerMetaList } from "@/lib/answers";
import { Breadcrumbs, Badge } from "@/components/ui";
import { ReviewDeck } from "@/components/review-deck";

export const metadata: Metadata = {
  title: "Your review deck — JFT-Basic",
  description:
    "Questions you missed in JFT-Basic practice, kept for a second look. Saved on this device only.",
  alternates: { canonical: "/exams/jft-basic/answers/review" },
  /* Personal localStorage data — zero crawl value, never indexed. */
  robots: { index: false, follow: false },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Exams", href: "/exams" },
  { label: "JFT-Basic", href: "/exams/jft-basic" },
  { label: "Answers explained", href: "/exams/jft-basic/answers" },
  { label: "Your review deck" },
];

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Breadcrumbs trail={TRAIL} />
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate font-mono">
        Error log · JFT-Basic
      </p>
      <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance">
        Your review deck
      </h1>
      <p className="mt-4 text-slate leading-relaxed max-w-2xl">
        Questions you missed, kept here for a second look. Getting them right next time is
        the whole point — no rush, no scoreboard.
      </p>
      <div className="mt-4">
        <Badge tone="info">Private to this browser</Badge>
      </div>
      <div className="mt-8">
        <ReviewDeck meta={answerMetaList()} />
      </div>
    </div>
  );
}
