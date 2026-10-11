import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PracticePlayer from "@/components/practice-player";
import { Breadcrumbs, Section } from "@/components/ui";
import { getExamPageData } from "@/lib/exam-template";
import { getExamBank, getExamPracticeMeta, listPracticeExams } from "@/lib/exam-banks";

/**
 * Generic practice player page — one route serves every exam with a question
 * bank. (For JFT-Basic the concrete `app/exams/jft-basic/practice/[topic]`
 * route shadows this one; JFT keeps its curated page.)
 *
 * Server component: computes counts from the bank, then hands the player
 * only `exam` + `topic` strings. Question objects — which carry correctId
 * and explanations — never cross into the client as props; the player
 * fetches the safe DTO from /api/practice/questions.
 *
 * Indexed deliberately (consistent with the JFT practice topic pages, which
 * carry the same editorial hero): this is a content landing page with real
 * copy and honest counts, not a bare app shell.
 */

export function generateStaticParams() {
  const params: { exam: string; topic: string }[] = [];
  for (const exam of listPracticeExams()) {
    const meta = getExamPracticeMeta(exam);
    for (const u of meta?.units ?? []) params.push({ exam, topic: u.id });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ exam: string; topic: string }>;
}): Promise<Metadata> {
  const { exam, topic } = await params;
  const meta = getExamPracticeMeta(exam);
  const unit = meta?.units.find((u) => u.id === topic);
  if (!meta || !unit) return { title: "Practice" };
  const base = "https://unschool.academy";
  return {
    title: `${unit.title} — ${meta.examTitle} practice`,
    description: `${unit.title} practice for ${meta.examTitle}: ${unit.questionCount} draft questions with hints and instant answer checks. Pending SME review.`,
    alternates: { canonical: `${base}/exams/${exam}/practice/${unit.id}` },
    openGraph: {
      title: `${unit.title} — ${meta.examTitle} practice`,
      description: `Draft questions with hints and instant explanations — pending SME review.`,
      url: `${base}/exams/${exam}/practice/${unit.id}`,
      type: "website",
    },
  };
}

export default async function ExamPracticeTopicPage({
  params,
}: {
  params: Promise<{ exam: string; topic: string }>;
}) {
  const { exam, topic } = await params;
  const bank = getExamBank(exam);
  const meta = getExamPracticeMeta(exam);
  const unit = meta?.units.find((u) => u.id === topic);
  if (!bank || !meta || !unit) notFound();

  /* Exam-relative deep links: only where the surface actually exists. */
  const features = getExamPageData(exam)?.features;
  const diagnosticHref = features?.diagnostic ? `/exams/${exam}/diagnostic` : null;
  const answersBase = features?.answers ? `/exams/${exam}/answers` : null;

  const base = "https://unschool.academy";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Exams", item: `${base}/exams` },
      { "@type": "ListItem", position: 3, name: meta.examTitle, item: `${base}/exams/${exam}` },
      {
        "@type": "ListItem",
        position: 4,
        name: "Practice",
        item: `${base}/exams/${exam}/practice`,
      },
      { "@type": "ListItem", position: 5, name: unit.title },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ---------- Editorial hero: type carries it, no blob recipe ---------- */}
      <div className="border-b border-border bg-canvas">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10 pb-10 md:pt-14 md:pb-12">
          <Breadcrumbs
            trail={[
              { label: "Home", href: "/" },
              { label: "Exams", href: "/exams" },
              { label: meta.examTitle, href: `/exams/${exam}` },
              { label: "Practice", href: `/exams/${exam}/practice` },
              { label: unit.title },
            ]}
          />
          <p className="mt-6 text-sm font-bold text-academy-teal-dark">
            {meta.examTitle} practice · {unit.questionCount} questions · {unit.skillCount}{" "}
            {unit.skillCount === 1 ? "skill" : "skills"}
          </p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl tracking-[-0.03em] leading-[1.02] text-ink text-balance max-w-3xl">
            {unit.title}
          </h1>
          <p className="mt-5 text-lg text-slate leading-relaxed max-w-2xl">
            Check each answer as you go and use hints freely. Wrong answers here
            are the cheapest lessons you will ever buy — this is for learning,
            not testing.
          </p>
          <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-slate">
            Original drafts · {meta.reviewStatus}
          </p>
        </div>
      </div>
      <Section className="!py-10">
        <div className="mx-auto max-w-4xl">
          <PracticePlayer
            exam={exam}
            topic={unit.id}
            diagnosticHref={diagnosticHref}
            answersBase={answersBase}
          />
        </div>
      </Section>
    </>
  );
}
