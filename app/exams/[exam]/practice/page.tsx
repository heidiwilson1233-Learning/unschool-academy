import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Section } from "@/components/ui";
import PracticeSmartPick, { type SmartPickUnit } from "@/components/practice-smart-pick";
import { getExamPracticeMeta, listPracticeExams } from "@/lib/exam-banks";

/**
 * Generic practice index — one route serves every exam with a question bank
 * (portal-doctrine move 9: content as versioned data). The JFT-Basic concrete
 * route `app/exams/jft-basic/practice/[topic]` shadows the generic topic
 * page for JFT, but this picker has no JFT competitor, so it renders for
 * JFT-Basic too — with unit-id links that the JFT topic page accepts as
 * aliases alongside its legacy slugs.
 *
 * Only counts reach the client; questions stay behind the API (answer keys
 * never leave the server except via /check, after an answer).
 */

export function generateStaticParams() {
  return listPracticeExams().map((exam) => ({ exam }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ exam: string }>;
}): Promise<Metadata> {
  const { exam } = await params;
  const meta = getExamPracticeMeta(exam);
  if (!meta) return { title: "Practice" };
  const base = "https://unschool.academy";
  return {
    title: `${meta.examTitle} practice by topic`,
    description: `Practice ${meta.examTitle} by topic — ${meta.questionCount} draft questions with hints and instant explanations. All sets are drafts pending SME review.`,
    alternates: { canonical: `${base}/exams/${exam}/practice` },
    openGraph: {
      title: `${meta.examTitle} practice by topic`,
      description: `Draft practice questions with hints and instant explanations — pending SME review.`,
      url: `${base}/exams/${exam}/practice`,
      type: "website",
    },
  };
}

function estMinutes(n: number) {
  return Math.max(5, Math.round(n * 1.5));
}

export default async function ExamPracticePage({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  const meta = getExamPracticeMeta(exam);
  if (!meta) notFound();

  const units: (SmartPickUnit & {
    questionCount: number;
    skillCount: number;
    skills: { id: string; label: string; count: number }[];
  })[] = meta.units.map((u) => ({
    id: u.id,
    title: u.title,
    href: `/exams/${exam}/practice/${u.id}`,
    questionCount: u.questionCount,
    skillCount: u.skillCount,
    skills: u.skills,
  }));

  const base = "https://unschool.academy";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Exams", item: `${base}/exams` },
      { "@type": "ListItem", position: 3, name: meta.examTitle, item: `${base}/exams/${exam}` },
      { "@type": "ListItem", position: 4, name: "Practice" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ---------- Editorial hero: no blob recipe, type + hairline carry it ---------- */}
      <div className="border-b border-border bg-canvas">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-10 md:pt-14 md:pb-12">
          <Breadcrumbs
            trail={[
              { label: "Home", href: "/" },
              { label: "Exams", href: "/exams" },
              { label: meta.examTitle, href: `/exams/${exam}` },
              { label: "Practice" },
            ]}
          />
          <p className="mt-6 text-sm font-bold text-academy-teal-dark">{meta.examTitle} practice</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl tracking-[-0.03em] leading-[1.02] text-ink text-balance max-w-3xl">
            Practice by topic
          </h1>
          <p className="mt-5 text-lg text-slate leading-relaxed max-w-2xl">
            Pick a unit below. Every set scores instantly, hints are free, and
            explanations appear after you answer.
          </p>
          <p className="mt-4 text-[15px] text-slate">
            <span className="font-semibold text-ink">{meta.questionCount} questions</span>
            {" "}across {meta.units.length} {meta.units.length === 1 ? "unit" : "units"}
            {" "}— all original drafts ({meta.reviewStatus}).
          </p>
        </div>
      </div>

      <Section className="!py-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-6">
            <div className="md:col-span-2 md:row-span-2">
              <PracticeSmartPick exam={exam} units={units} />
            </div>
            {units.map((u) => {
              const maxSkill = Math.max(1, ...u.skills.map((s) => s.count));
              return (
                <article
                  key={u.id}
                  className="relative md:col-span-2 rounded-2xl border border-border bg-paper p-6 shadow-sm transition-[box-shadow,transform] duration-200 ease-[var(--ease-signature)] hover:shadow-md hover:-translate-y-0.5"
                >
                  <h2 className="text-xl font-bold text-ink leading-snug">
                    <Link
                      href={u.href}
                      className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue rounded"
                    >
                      {u.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-slate">
                    {u.questionCount} draft questions · {u.skillCount}{" "}
                    {u.skillCount === 1 ? "skill" : "skills"} · about {estMinutes(u.questionCount)} min
                  </p>
                  <ul className="mt-4 space-y-2" aria-label={`Skill mix in ${u.title}`}>
                    {u.skills.slice(0, 4).map((s) => (
                      <li key={s.id} className="flex items-center gap-3">
                        <span className="w-32 shrink-0 truncate text-[13px] text-slate">{s.label}</span>
                        <span
                          className="h-1.5 flex-1 rounded-full bg-border/60 overflow-hidden"
                          role="img"
                          aria-label={`${s.label}: ${s.count} questions`}
                        >
                          <span
                            className="block h-full rounded-full bg-academy-teal"
                            style={{ width: `${Math.round((s.count / maxSkill) * 100)}%` }}
                          />
                        </span>
                        <span className="w-6 shrink-0 text-right text-[13px] font-bold text-slate tabular-nums">
                          {s.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[15px] font-semibold text-academy-blue" aria-hidden="true">
                    Start practicing <span aria-hidden="true">→</span>
                  </p>
                </article>
              );
            })}
          </div>

          <p className="mt-10 text-[15px] text-slate">
            New here?{" "}
            <Link
              href="/exams/how-practice-works"
              className="font-semibold text-academy-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue rounded"
            >
              See how practice works
            </Link>{" "}
            — or go back to the{" "}
            <Link
              href={`/exams/${exam}`}
              className="font-semibold text-academy-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue rounded"
            >
              {meta.examTitle} overview
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
