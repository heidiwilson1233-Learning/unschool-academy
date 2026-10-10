import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { SYLLABUS_UPSC } from "@/lib/syllabus-upsc";
import { getExamPageData } from "@/lib/exam-template";

/**
 * UPSC CSE syllabus map — the official 3-stage structure rendered as a study
 * map, overlaid with the units we have actually built. Doctrine doc 12:
 * identical template discipline as the JFT-Basic map, no exam gets special UI.
 *
 * Every count below is computed from the live curriculum bank. Nothing is
 * hardcoded: adding a question batch or a unit changes this page on the
 * next build.
 */

const CURRICULUM = path.join(process.cwd(), "content", "curriculum", "upsc-cse", "units");

/** Live per-skill question counts, straight from the batch files. */
function countBySkill(): Map<string, number> {
  const m = new Map<string, number>();
  let dirs: string[] = [];
  try {
    dirs = readdirSync(CURRICULUM, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return m;
  }
  for (const d of dirs) {
    let files: string[] = [];
    try {
      files = readdirSync(path.join(CURRICULUM, d));
    } catch {
      continue;
    }
    for (const f of files) {
      if (!/^questions-.*\.json$/.test(f)) continue;
      try {
        const batch = JSON.parse(readFileSync(path.join(CURRICULUM, d, f), "utf8"));
        const arr = Array.isArray(batch) ? batch : batch?.questions ?? [];
        for (const q of arr) {
          if (q && typeof q.skill === "string")
            m.set(q.skill, (m.get(q.skill) ?? 0) + 1);
        }
      } catch {
        /* unreadable batch — the prebuild validator reports it; the page stays honest */
        console.warn(`[upsc-syllabus] unreadable batch file: ${f}`);
      }
    }
  }
  return m;
}

const COUNTS = countBySkill();
const countFor = (skill: string) => COUNTS.get(skill) ?? 0;
const plural = (n: number) => (n === 1 ? "question" : "questions");
const EXAM_DATA = getExamPageData("upsc-cse");
/* Written papers only: the Interview is a personality test, not a paper (2 + 9 = 11). */
const TOTAL_PAPERS = SYLLABUS_UPSC.stages
  .filter((s) => s.stageKey !== "interview")
  .reduce((n, s) => n + s.papers.length, 0);

export const metadata: Metadata = {
  title: "UPSC CSE Syllabus: Stage-by-Stage Study Map",
  description:
    "UPSC CSE as a study map: 3 stages, 11 papers, and where our Polity course fits. Independent preparation; all questions are drafts pending expert review.",
  alternates: { canonical: "/exams/upsc-cse/syllabus" },
  openGraph: {
    title: "UPSC CSE Syllabus: Stage-by-Stage Study Map",
    description:
      "The official UPSC Civil Services structure mapped to study units and skills, with live practice counts per skill. Independent preparation, not affiliated with the UPSC.",
    type: "website",
    url: "/exams/upsc-cse/syllabus",
  },
  twitter: {
    card: "summary_large_image",
    title: "UPSC CSE Syllabus: Stage-by-Stage Study Map",
    description:
      "The official UPSC structure mapped to study units and skills, with live practice counts per skill.",
  },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Exams", href: "/exams" },
  { label: "UPSC CSE", href: "/exams/upsc-cse" },
  { label: "Syllabus map" },
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

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export default function UpscSyllabusPage() {
  const totalQuestions = EXAM_DATA?.questionCount ?? 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ---------- Hero ---------- */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(42rem 30rem at 12% -8%, rgba(20,125,117,0.10), transparent 60%), radial-gradient(36rem 26rem at 88% 12%, rgba(49,91,135,0.10), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate">
              {TRAIL.map((t, i) => (
                <li key={t.label} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className="text-border">
                      /
                    </span>
                  )}
                  {t.href ? (
                    <Link
                      href={t.href}
                      className="hover:text-academy-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
                    >
                      {t.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-semibold text-ink">
                      {t.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="guide-reveal text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal mb-4 font-mono">
            EX-501 · Tier 1 · Draft pending expert review
          </p>
          <h1 className="guide-reveal font-display text-[clamp(2.75rem,6vw,5rem)] leading-[1.02] tracking-[-0.03em] text-ink text-balance max-w-4xl">
            The UPSC syllabus, mapped.
          </h1>
          <p className="guide-reveal mt-5 text-lg text-slate max-w-2xl leading-relaxed">
            Three stages, eleven papers, one very long reading list. This page
            maps the official structure to the course we are actually building,
            skill by skill, with honest counts of what exists today.
          </p>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
                Stages
              </dt>
              <dd className="text-2xl font-extrabold text-ink tabular-nums">3</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
                Papers
              </dt>
              <dd className="text-2xl font-extrabold text-ink tabular-nums">
                {TOTAL_PAPERS}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
                Decided by
              </dt>
              <dd className="text-2xl font-extrabold text-ink">
                Mains + interview
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
                Draft questions
              </dt>
              <dd className="text-2xl font-extrabold text-ink tabular-nums">
                {totalQuestions}
              </dd>
            </div>
          </dl>
          <div className="mt-8">
            <Link
              href="#study-order"
              className="inline-flex items-center gap-2 rounded-xl bg-academy-teal px-6 py-3.5 font-bold text-white transition-colors duration-200 hover:bg-academy-teal-dark active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-academy-teal min-h-[44px]"
            >
              See the study order <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Study order ---------- */}
        <section
          id="study-order"
          aria-labelledby="study-order-h2"
          className="py-14 md:py-20 border-b border-border scroll-mt-24"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-3">
            Beginner to advanced
          </p>
          <h2
            id="study-order-h2"
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance max-w-3xl"
          >
            Study in this order
          </h2>
          <p className="mt-3 text-slate text-[15px] leading-relaxed max-w-2xl">
            Our recommended order for the five Polity skills on the map,
            sequenced so each one builds on the previous. Counts are live from
            the question bank; skills with no questions yet are being written
            now. Practice routes for these skills are still being built, so
            nothing below is playable yet. The roadmap after this section shows
            what comes next.
          </p>
          <ol className="mt-10 border-t border-border">
            {SYLLABUS_UPSC.studyOrder.map((s) => {
              const n = countFor(s.id);
              return (
                <li
                  key={s.id}
                  className="grid gap-2 md:grid-cols-12 md:gap-6 py-6 border-b border-border"
                >
                  <p
                    aria-hidden
                    className="md:col-span-1 font-mono text-sm font-bold tracking-[0.18em] text-academy-teal-dark pt-1"
                  >
                    {String(s.sequence).padStart(2, "0")}
                  </p>
                  <div className="md:col-span-7">
                    <h3 className="text-lg md:text-xl font-bold text-ink">
                      {s.label}
                      <span className="sr-only">
                        , step {s.sequence} of {SYLLABUS_UPSC.studyOrder.length},{" "}
                        {s.level} {s.levelName}
                      </span>
                    </h3>
                    <p className="mt-1.5 text-slate text-[15px] leading-relaxed max-w-xl">
                      {s.why}
                    </p>
                  </div>
                  <div className="md:col-span-4 md:text-right">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                      {s.level} · {s.levelName}
                    </p>
                    <p className="mt-1.5 text-sm font-bold text-ink tabular-nums">
                      {n > 0 ? (
                        <>
                          {n} {plural(n)}{" "}
                          <span className="font-semibold text-slate">· draft</span>
                        </>
                      ) : (
                        <span className="font-semibold text-slate">
                          Being written
                        </span>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ---------- Capability roadmap: honest about what is playable ---------- */}
        <section
          aria-labelledby="roadmap-h2"
          className="py-14 md:py-20 border-b border-border"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-3">
            What comes next
          </p>
          <h2
            id="roadmap-h2"
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance max-w-3xl"
          >
            The course, as it gets built
          </h2>
          <p className="mt-3 text-slate text-[15px] leading-relaxed max-w-2xl">
            This page maps the territory. The study tools arrive in this order,
            and each one goes live only when it is real.
          </p>
          <ol className="mt-10 border-t border-border">
            {[
              {
                n: "01",
                name: "Practice",
                status: "In progress",
                body: `${totalQuestions} draft Polity questions are written and under expert review. The practice player routes come next, one unit at a time.`,
              },
              {
                n: "02",
                name: "Diagnostic",
                status: "Planned",
                body: "A free 10-question diagnostic that maps your gaps across the skills above, once the first units are playable.",
              },
              {
                n: "03",
                name: "Mock tests",
                status: "Planned",
                body: "Full-pattern timed mocks with instant analytics, after practice ships.",
              },
            ].map((r) => (
              <li
                key={r.n}
                className="grid gap-2 md:grid-cols-12 md:gap-6 py-6 border-b border-border"
              >
                <p
                  aria-hidden
                  className="md:col-span-1 font-mono text-sm font-bold tracking-[0.18em] text-academy-teal-dark pt-1"
                >
                  {r.n}
                </p>
                <div className="md:col-span-7">
                  <h3 className="text-lg md:text-xl font-bold text-ink">
                    {r.name}
                  </h3>
                  <p className="mt-1.5 text-slate text-[15px] leading-relaxed max-w-xl">
                    {r.body}
                  </p>
                </div>
                <div className="md:col-span-4 md:text-right">
                  <p className="inline-block rounded-full border border-border px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                    {r.status}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- Stage bento: the official structure, our coverage overlaid ---------- */}
        <section
          aria-labelledby="stages-h2"
          className="py-14 md:py-20 border-b border-border"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-3">
            The official structure
          </p>
          <h2
            id="stages-h2"
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance max-w-3xl"
          >
            Three stages, {TOTAL_PAPERS} papers
          </h2>
          <p className="mt-3 text-slate text-[15px] leading-relaxed max-w-2xl">
            Paper names, marks, and qualifying rules follow the UPSC
            notification. The teal cell is ours: the one unit we have built so
            far, sitting on the papers it feeds.
          </p>

          <div className="mt-10 grid gap-5 lg:grid-cols-6">
            {SYLLABUS_UPSC.stages
              .filter((s) => s.stageKey === "prelims")
              .map((stage) => (
                <div
                  key={stage.stage}
                  className="lg:col-span-2 rounded-xl border border-border bg-paper p-6 md:p-7"
                >
                  <p
                    aria-hidden
                    className="font-mono text-xs font-bold tracking-[0.2em] text-academy-teal-dark"
                  >
                    01
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
                    {stage.stage}
                  </h3>
                  <p className="mt-2 text-sm text-slate leading-relaxed">
                    {stage.role}
                  </p>
                  <ul className="mt-5 border-t border-border">
                    {stage.papers.map((pp) => (
                      <li key={pp.name} className="py-4 border-b border-border">
                        <p className="font-bold text-ink text-[15px]">{pp.name}</p>
                        <p className="mt-0.5 font-mono text-xs font-bold text-slate tabular-nums">
                          {pp.marks} marks
                        </p>
                        <p className="mt-1 text-sm text-slate leading-relaxed">
                          {pp.detail}
                        </p>
                        {pp.scoring && (
                          <p className="mt-1 text-sm text-slate leading-relaxed">
                            {pp.scoring}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  {stage.syllabusTopics && (
                    <div className="mt-5">
                      <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                        Official GS Paper I topics
                      </h4>
                      <ul className="mt-2.5 space-y-1.5 text-sm text-slate leading-relaxed">
                        {stage.syllabusTopics.map((t) => (
                          <li key={t} className="flex gap-2.5">
                            <span aria-hidden className="text-academy-teal-dark font-bold">
                              ·
                            </span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

            {SYLLABUS_UPSC.stages
              .filter((s) => s.stageKey === "mains")
              .map((stage) => (
                <div
                  key={stage.stage}
                  className="lg:col-span-4 lg:row-span-2 rounded-xl border border-border bg-paper p-6 md:p-7"
                >
                  <p
                    aria-hidden
                    className="font-mono text-xs font-bold tracking-[0.2em] text-academy-teal-dark"
                  >
                    02
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
                    {stage.stage}
                  </h3>
                  <p className="mt-2 text-sm text-slate leading-relaxed max-w-xl">
                    {stage.role}
                  </p>
                  <ul className="mt-5 border-t border-border sm:columns-2 sm:gap-8">
                    {stage.papers.map((pp) => (
                      <li
                        key={pp.name}
                        className="py-4 border-b border-border break-inside-avoid"
                      >
                        <p className="font-bold text-ink text-[15px]">{pp.name}</p>
                        <p className="mt-0.5 font-mono text-xs font-bold text-slate tabular-nums">
                          {pp.marks} marks
                        </p>
                        <p className="mt-1 text-sm text-slate leading-relaxed">
                          {pp.detail}
                        </p>
                        {pp.coverage && (
                          <p className="mt-1 text-sm text-slate leading-relaxed">
                            <span className="font-semibold text-ink">Covers:</span>{" "}
                            {pp.coverage}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            {/* Our coverage: the one live unit, on the papers it feeds */}
            {SYLLABUS_UPSC.units.map((u) => (
              <div
                key={u.unit}
                className="lg:col-span-2 rounded-xl border-2 border-academy-teal-dark/60 bg-paper p-6 md:p-7"
              >
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-academy-teal-dark">
                  Our coverage · live
                </p>
                <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
                  {u.unitTitle}
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-slate leading-relaxed">
                  {u.mapsTo.map((m) => (
                    <li key={m} className="flex gap-2.5">
                      <span aria-hidden className="text-academy-teal-dark font-bold">
                        →
                      </span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-5 border-t border-border pt-4 space-y-2.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                      Skills mapped
                    </dt>
                    <dd className="text-lg font-extrabold text-ink tabular-nums">
                      {u.skills.length}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                      Draft questions
                    </dt>
                    <dd className="text-lg font-extrabold text-ink tabular-nums">
                      {u.skills.reduce((n, s) => n + countFor(s.id), 0)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                      Levels
                    </dt>
                    <dd className="text-sm font-bold text-ink">
                      {(() => {
                        const order = ["L1", "L2", "L3", "L4"];
                        const present = [
                          ...new Set(u.skills.map((s) => s.level)),
                        ].sort(
                          (a, b) => order.indexOf(a) - order.indexOf(b)
                        );
                        return present.length > 1
                          ? `${present[0]}–${present[present.length - 1]}`
                          : (present[0] ?? "");
                      })()}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm text-slate leading-relaxed">
                  Next units join this cell as they are written and reviewed.
                </p>
              </div>
            ))}

            {SYLLABUS_UPSC.stages
              .filter((s) => s.stageKey === "interview")
              .map((stage) => (
                <div
                  key={stage.stage}
                  className="lg:col-span-6 rounded-xl border border-border bg-paper p-6 md:p-7 md:flex md:items-center md:gap-10"
                >
                  <div className="md:flex-1">
                    <p
                      aria-hidden
                      className="font-mono text-xs font-bold tracking-[0.2em] text-academy-teal-dark"
                    >
                      03
                    </p>
                    <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
                      {stage.stage}
                    </h3>
                    <p className="mt-2 text-sm text-slate leading-relaxed max-w-2xl">
                      {stage.role}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 md:text-right shrink-0">
                    <p className="font-mono text-sm font-bold text-ink tabular-nums">
                      {stage.papers[0]?.marks}{" "}
                      <span className="font-semibold text-slate">marks</span>
                    </p>
                    <p className="mt-1 text-sm text-slate">
                      {stage.papers[0]?.detail}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ---------- How the real test works ---------- */}
        <section
          aria-labelledby="rules-h2"
          className="py-14 md:py-20 border-b border-border"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-3">
            Exam day
          </p>
          <h2
            id="rules-h2"
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance max-w-3xl"
          >
            How the real test works
          </h2>
          <dl className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-8 max-w-4xl">
            <div className="border-t border-border pt-4">
              <dt className="font-bold text-ink">Screening versus merit</dt>
              <dd className="mt-1 text-slate text-[15px] leading-relaxed">
                Prelims filters the field; the Mains written score plus the
                interview decide the rank. Only those two count toward the final
                2025.
              </dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="font-bold text-ink">Negative marking</dt>
              <dd className="mt-1 text-slate text-[15px] leading-relaxed">
                One-third of the marks for a wrong answer in both Prelims
                papers. The Mains, being descriptive, has no negative marking.
              </dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="font-bold text-ink">CSAT is qualifying</dt>
              <dd className="mt-1 text-slate text-[15px] leading-relaxed">
                Paper II needs 33% to stay in the race. It never adds to your
                score.
              </dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="font-bold text-ink">Language papers are qualifying</dt>
              <dd className="mt-1 text-slate text-[15px] leading-relaxed">
                Paper A and Paper B need 25% each. Their 600 marks never touch
                the merit list.
              </dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="font-bold text-ink">The interview</dt>
              <dd className="mt-1 text-slate text-[15px] leading-relaxed">
                275 marks for a conversation with no fixed syllabus: the board
                tests personality, communication, and awareness.
              </dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="font-bold text-ink">Independent preparation</dt>
              <dd className="mt-1 text-slate text-[15px] leading-relaxed">
                We are not affiliated with the UPSC. Stage names, paper names,
                and marks follow the official notification; everything else on
                this page is ours.
              </dd>
            </div>
          </dl>
        </section>

        {/* ---------- Page-level draft disclosure ---------- */}
        <div
          role="note"
          className="my-14 md:my-20 rounded-xl border border-border bg-paper p-6 md:p-8"
        >
          <h2 className="text-xl font-extrabold text-ink">
            About our practice questions
          </h2>
          <p className="mt-2 text-slate text-[15px] leading-relaxed max-w-3xl">
            Every count on this page is computed from our live question bank.
            Our practice questions are original drafts, written for practice
            and pending review by a subject-matter expert. They are not
            official UPSC items, and nothing here predicts an official result.
          </p>
          <p className="mt-3 text-slate text-[15px] leading-relaxed max-w-3xl">
            Stage names, paper names, and marks follow the official UPSC Civil
            Services notification (
            <a
              href="https://upsc.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-academy-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
            >
              upsc.gov.in <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            ). Everything else on this page is ours.
          </p>
        </div>

        {/* ---------- Close ---------- */}
        <div className="border border-border rounded-xl bg-paper p-6 md:p-8 mb-14 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="md:flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-3">
                The course so far
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
                One unit live: Polity Fundamentals
              </h2>
              <p className="mt-3 text-slate leading-relaxed">
                Five skills, {totalQuestions} draft questions, mapped to the
                Polity portions of Prelims GS I and Mains GS II. More units
                join the map as they are written and reviewed.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/exams/upsc-cse"
                className="inline-flex items-center gap-2 rounded-xl bg-academy-teal px-6 py-3.5 font-bold text-white transition-colors duration-200 hover:bg-academy-teal-dark active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-academy-teal min-h-[44px]"
              >
                Open the course page <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
