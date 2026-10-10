import type { Metadata } from "next";
import Link from "next/link";
import { ANSWER_COUNT, answerSkills, answerMetaList } from "@/lib/answers";
import { Breadcrumbs, Badge } from "@/components/ui";
import { AnswersIndexClient } from "@/components/answers-index";

export const metadata: Metadata = {
  title: "JFT-Basic Answers Explained — Unschool Academy",
  description: `Every JFT-Basic practice question, explained: ${ANSWER_COUNT} draft explanations with hints, searchable by skill. Draft pending SME review.`,
  alternates: { canonical: "/exams/jft-basic/answers" },
  openGraph: {
    title: "JFT-Basic Answers Explained — Unschool Academy",
    description: `${ANSWER_COUNT} practice questions, each with a hint and a full explanation. Draft content pending expert review.`,
    type: "website",
    url: "/exams/jft-basic/answers",
  },
  twitter: {
    card: "summary_large_image",
    title: "JFT-Basic Answers Explained — Unschool Academy",
    description: `${ANSWER_COUNT} practice questions, each with a hint and a full explanation.`,
  },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Exams", href: "/exams" },
  { label: "JFT-Basic", href: "/exams/jft-basic" },
  { label: "Answers explained" },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: TRAIL.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.label,
    ...(t.href ? { item: `https://unschool.academy${t.href}` } : {}),
  })),
};

/* ItemList over the skill sections — real anchor destinations, never fake
   Course/Product schema. Question pages carry their own BreadcrumbList. */
const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "JFT-Basic answers explained, by skill",
  numberOfItems: answerSkills().length,
  itemListElement: answerSkills().map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `${s.skillLabel} — ${s.count} explained questions`,
    url: `https://unschool.academy/exams/jft-basic/answers#skill-${s.skill}`,
  })),
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export default function AnswersIndexPage() {
  const skills = answerSkills();
  const meta = answerMetaList();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* Hero — the page's one wow: type-as-hero + giant honest count */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-6%] h-[420px] w-[420px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(20,125,117,0.10), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-24 left-[-8%] h-[380px] w-[380px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(49,91,135,0.10), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pt-14 md:pb-16">
          <Breadcrumbs trail={TRAIL} />
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate font-mono">
            Explanation index · JFT-Basic
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-x-10 gap-y-6">
            <h1
              className="font-display font-extrabold tracking-[-0.04em] text-ink leading-[0.95] text-balance"
              style={{ fontSize: "clamp(2.75rem, 8vw, 6rem)" }}
            >
              Every question,
              <br />
              explained.
            </h1>
            <p
              className="font-display font-extrabold tabular-nums text-academy-teal-dark leading-none"
              style={{ fontSize: "clamp(4rem, 12vw, 9rem)" }}
              aria-label={`${ANSWER_COUNT} questions explained`}
            >
              {ANSWER_COUNT}
            </p>
          </div>
          <p className="mt-6 max-w-2xl text-slate leading-relaxed">
            Each practice question gets a hint to try first, then the answer and a
            full explanation of why it works. Answers are never revealed without a
            hint being offered first.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge tone="warning">Draft — pending SME review</Badge>
            <span className="text-sm text-slate">
              Written by our content team; a Japanese subject-matter expert has not
              reviewed these yet.
            </span>
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate font-mono">
            Searches {ANSWER_COUNT} JFT-Basic practice explanations · skills below
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <AnswersIndexClient meta={meta} skills={skills} total={ANSWER_COUNT} />

        <nav aria-label="Related JFT-Basic pages" className="mt-14 border-t border-border pt-8">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] font-semibold">
            <li>
              <Link href="/exams/jft-basic/practice/vocabulary" className="text-academy-blue hover:underline">
                Practice by topic
              </Link>
            </li>
            <li>
              <Link href="/exams/jft-basic/topics" className="text-academy-blue hover:underline">
                Topic index
              </Link>
            </li>
            <li>
              <Link href="/exams/jft-basic/syllabus" className="text-academy-blue hover:underline">
                Syllabus map
              </Link>
            </li>
            <li>
              <Link href="/exams/jft-basic/answers/review" className="text-academy-blue hover:underline">
                Your review deck
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
