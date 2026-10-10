import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnswer, answerIds, trySimilar, ANSWER_COUNT } from "@/lib/answers";
import { Breadcrumbs, Badge } from "@/components/ui";
import { SimilarQuiz } from "@/components/similar-quiz";

/* Title/description templates — MUST match scripts/validate-answers.mjs
   exactly (the build gate asserts uniqueness across all pages). */
const shortStem = (stem: string) => stem.split(/\s+/).slice(0, 7).join(" ");
const pageTitle = (stem: string) => `Q: ${shortStem(stem)} — JFT-Basic explained`;
const firstSentence = (t: string) => t.split(/(?<=[.!?])\s/)[0].slice(0, 140);
const pageDescription = (explanation: string) =>
  `${firstSentence(explanation)} — draft pending SME review`;

const TOPIC_SLUGS: Record<string, string> = {
  "Script and Vocabulary": "vocabulary",
  "Conversation and Expression": "conversation",
  "Listening Comprehension": "listening",
  "Reading Comprehension": "reading",
};

export function generateStaticParams() {
  return answerIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const a = getAnswer(id);
  /* notFound() here (as well as in the component) so unknown ids 404
     during metadata resolution — before the PPR shell can stream a 200. */
  if (!a) notFound();
  const title = pageTitle(a.stem);
  const description = pageDescription(a.explanation);
  return {
    title,
    description,
    alternates: { canonical: `/exams/jft-basic/answers/${id}` },
    /* Draft explanations: not indexed until SME review passes (house honesty). */
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/exams/jft-basic/answers/${id}`,
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function AnswerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = getAnswer(id);
  if (!a) notFound();

  const trail = [
    { label: "Home", href: "/" },
    { label: "Exams", href: "/exams" },
    { label: "JFT-Basic", href: "/exams/jft-basic" },
    { label: "Answers explained", href: "/exams/jft-basic/answers" },
    { label: `Question ${a.id}` },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.label,
      ...(t.href ? { item: `https://unschool.academy${t.href}` } : {}),
    })),
  };

  /* Client-safe projection for the re-attempt quiz: stems and options only.
     No correct flags, no explanations — answers are validated server-side. */
  const quizItems = trySimilar(id, 3).map((q) => ({
    id: q.id,
    skillLabel: q.skillLabel,
    stem: q.stem,
    stemJp: q.stemJp,
    options: q.options.map((o) => ({ id: o.id, text: o.text, textJp: o.textJp })),
  }));

  const practiceSlug = TOPIC_SLUGS[a.topic] ?? "vocabulary";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <Breadcrumbs trail={trail} />

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate font-mono">
          {a.skillLabel} · {a.topic}
        </p>

        {/* h1 = the question itself (B's heading order) */}
        <h1 className="mt-3 text-2xl md:text-[2rem] font-extrabold tracking-tight text-ink leading-snug text-balance">
          {a.stem}
        </h1>
        {a.stemJp && a.stemJp !== a.stem && (
          <p lang="ja" className="jp mt-3 text-lg text-slate leading-relaxed">
            {a.stemJp}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge tone="warning">Draft — pending SME review</Badge>
          <span className="font-mono text-xs text-slate">ID {a.id}</span>
        </div>

        {/* How-this-page-works step bar (hint-before-answer, made explicit) */}
        <ol className="mt-8 grid sm:grid-cols-3 gap-3 list-none" aria-label="How to use this page">
          {[
            ["01", "Try it from memory", "Answer in your head before scrolling."],
            ["02", "Take the hint", "A nudge first. Never the answer straight away."],
            ["03", "Read why", "The reasoning behind the correct answer."],
          ].map(([n, title, body]) => (
            <li key={n} className="border border-border rounded-xl px-4 py-3.5 bg-paper">
              <p className="font-mono text-[11px] font-bold text-academy-teal-dark">{n}</p>
              <p className="mt-1 text-[15px] font-bold text-ink">{title}</p>
              <p className="mt-0.5 text-sm text-slate leading-relaxed">{body}</p>
            </li>
          ))}
        </ol>

        {/* Step 2 — hint first, answer below (never the reverse) */}
        <section aria-labelledby="hint-h" className="mt-10">
          <h2 id="hint-h" className="text-lg font-extrabold text-ink tracking-tight">
            Try a hint first
          </h2>
          <details className="mt-3 border border-border rounded-xl bg-paper group">
            <summary className="cursor-pointer px-5 py-4 font-semibold text-academy-blue list-none [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue rounded-xl">
              <span className="group-open:hidden">Need a nudge first? Show the hint</span>
              <span className="hidden group-open:inline">Hide the hint</span>
            </summary>
            <p className="px-5 pb-5 text-[15px] text-slate leading-relaxed">{a.hint}</p>
          </details>
        </section>

        {/* Answer choices — <ol>, visible labels, never color-only */}
        <section aria-labelledby="choices-h" className="mt-10">
          <h2 id="choices-h" className="text-lg font-extrabold text-ink tracking-tight">
            Answer choices
          </h2>
          <ol className="mt-4 border-y border-border divide-y divide-border">
            {a.options.map((o) => (
              <li key={o.id} className="py-4 flex items-start gap-4">
                <span
                  className={`mt-0.5 shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full ${
                    o.correct
                      ? "bg-academy-teal/15 text-academy-teal-dark"
                      : "bg-slate/10 text-slate"
                  }`}
                >
                  <span className="sr-only">{o.correct ? "Correct answer: " : "Not the answer: "}</span>
                  {o.correct ? "Correct" : "Not the answer"}
                </span>
                <span className="text-[15px] md:text-base text-ink leading-relaxed">
                  {o.textJp && o.textJp !== o.text ? (
                    <>
                      <span lang="ja" className="jp font-semibold">
                        {o.textJp}
                      </span>
                      <span className="block text-sm text-slate mt-0.5">{o.text}</span>
                    </>
                  ) : (
                    <span className="font-semibold">{o.text}</span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Why — honest heading: one paragraph, not per-distractor claims */}
        <section aria-labelledby="why-h" className="mt-10">
          <h2 id="why-h" className="text-lg font-extrabold text-ink tracking-tight">
            Why this is the answer
          </h2>
          <p className="mt-3 text-[15px] md:text-base text-slate leading-relaxed">{a.explanation}</p>
          <p className="mt-4 text-sm text-slate border-l-2 border-border pl-4">
            Draft explanation — written by our content team, pending review by a
            Japanese subject-matter expert. Source: {a.source}
          </p>
        </section>

        {/* Re-attempt loop — explain → attempt → clear (doctrine move 2) */}
        <section aria-labelledby="similar-h" className="mt-12" id="try-similar">
          <h2 id="similar-h" className="text-lg font-extrabold text-ink tracking-tight">
            More like this
          </h2>
          <p className="mt-2 text-[15px] text-slate leading-relaxed">
            Reading is not practice. Try three similar {a.skillLabel.toLowerCase()} questions
            right here. Getting one right clears it from your review deck.
          </p>
          <div className="mt-5">
            <SimilarQuiz items={quizItems} />
          </div>
          <div className="mt-6">
            <Link
              href={`/exams/jft-basic/practice/${practiceSlug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-academy-teal px-5 py-3 font-bold text-white transition-transform duration-200 ease-signature hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal-dark"
            >
              Practice {a.skillLabel.toLowerCase()} properly <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <nav aria-label="More answers" className="mt-12 border-t border-border pt-6">
          <Link href="/exams/jft-basic/answers" className="font-semibold text-academy-blue hover:underline">
            <span aria-hidden="true">←</span> All {ANSWER_COUNT} explanations
          </Link>
        </nav>
      </div>
    </>
  );
}
