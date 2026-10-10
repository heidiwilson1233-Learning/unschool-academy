import type { Metadata } from "next";
import Link from "next/link";
import { SYLLABUS } from "@/lib/syllabus";
import { JFT_PROGRAM } from "@/lib/exams";
import { PRACTICE_QUESTIONS } from "@/lib/practice";

/** Build-time per-skill practice counts — real numbers from the curriculum bank. */
const COUNT_BY_SKILL: Map<string, number> = (() => {
  const m = new Map<string, number>();
  for (const q of PRACTICE_QUESTIONS) m.set(q.skill, (m.get(q.skill) ?? 0) + 1);
  return m;
})();

const countFor = (skill: string) => COUNT_BY_SKILL.get(skill) ?? 0;
const plural = (n: number) => (n === 1 ? "question" : "questions");

export const metadata: Metadata = {
  title: "JFT-Basic Syllabus: Section-by-Section Study Map",
  description:
    "JFT-Basic format as a study map: 4 sections, 11 skills, live practice counts. Sourced from the Japan Foundation; content is draft pending SME review.",
  alternates: { canonical: "/exams/jft-basic/syllabus" },
  openGraph: {
    title: "JFT-Basic Syllabus: Section-by-Section Study Map",
    description:
      "The official JFT-Basic format mapped to study units and skills, with live practice counts per skill. Independent preparation, not affiliated with the Japan Foundation.",
    type: "website",
    url: "/exams/jft-basic/syllabus",
  },
  twitter: {
    card: "summary_large_image",
    title: "JFT-Basic Syllabus: Section-by-Section Study Map",
    description:
      "The official JFT-Basic format mapped to study units and skills, with live practice counts per skill.",
  },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Exams", href: "/exams" },
  { label: "JFT-Basic", href: "/exams/jft-basic" },
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

/* Snaking L1 to L4 study trail. Pure SVG, zero JS, aria-hidden (the ordered
   list below carries the same content for screen readers and crawlers). */
const TRAIL_NODES = SYLLABUS.studyOrder.map((s, i) => ({
  x: 60 + i * 100,
  y: 140,
  seq: s.sequence,
  level: s.level,
}));

function TrailSvg() {
  return (
    <svg
      viewBox="0 0 1200 280"
      className="w-full h-auto"
      aria-hidden="true"
      role="presentation"
    >
      <path
        d="M 40,140 C 90,80 110,200 160,140 S 210,80 260,140 S 310,200 360,140 S 410,80 460,140 S 510,200 560,140 S 610,80 660,140 S 710,200 760,140 S 810,80 860,140 S 910,200 960,140 S 1010,80 1060,140 S 1110,200 1160,140"
        fill="none"
        stroke="#147d75"
        strokeWidth="2"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      {TRAIL_NODES.map((n) => (
        <g key={n.seq}>
          <circle
            cx={n.x}
            cy={n.y}
            r="30"
            fill={n.level === "L1" ? "#147d75" : "#fbf9f4"}
            stroke="#15223b"
            strokeWidth="2"
          />
          <text
            x={n.x}
            y={n.y + 6}
            textAnchor="middle"
            fontSize="17"
            fontWeight="800"
            fill={n.level === "L1" ? "#ffffff" : "#15223b"}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          >
            {String(n.seq).padStart(2, "0")}
          </text>
          <text
            x={n.x}
            y={n.y + 56}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="#59677c"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            letterSpacing="0.12em"
          >
            {n.level}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function SyllabusPage() {
  const facts = JFT_PROGRAM.officialFacts;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ---------- Hero: type carries it, ambient light + grain behind it ---------- */}
      <div className="relative overflow-hidden border-b border-border bg-canvas">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-36 right-[-8%] h-[440px] w-[440px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(20,125,117,0.10), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-28 left-[-6%] h-[360px] w-[360px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(49,91,135,0.12), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-14 md:pb-20">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate">
              {TRAIL.map((t, i) => (
                <li key={t.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="text-slate/60">/</span>}
                  {t.href ? (
                    <Link href={t.href} className="hover:text-ink hover:underline">
                      {t.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-ink font-medium">
                      {t.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-5">
            JFT-Basic · Syllabus map
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-[-0.03em] leading-[1.02] text-ink text-balance max-w-4xl">
            The whole map, no surprises.
          </h1>
          <p className="mt-6 text-lg text-slate leading-relaxed max-w-2xl">
            Every skill the JFT-Basic tests, where it sits in the exam, and
            exactly how much practice we have for it.
          </p>
          <p className="mt-4 text-[15px] text-slate leading-relaxed max-w-2xl">
            Mapped from the Japan Foundation&apos;s{" "}
            <Link
              href="https://www.jpf.go.jp/jft-basic/e/about/index.html"
              className="text-academy-blue font-semibold hover:underline"
            >
              official JFT-Basic overview (external)
            </Link>
            , paraphrased in our own words. Our skill labels group their
            categories; the study order below is ours, not theirs.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-border pt-6">
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
                  Questions
                </dt>
                <dd className="text-2xl font-extrabold text-ink tabular-nums">~50</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
                  Time
                </dt>
                <dd className="text-2xl font-extrabold text-ink tabular-nums">60 min</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
                  Sections
                </dt>
                <dd className="text-2xl font-extrabold text-ink tabular-nums">4</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
                  Format
                </dt>
                <dd className="text-2xl font-extrabold text-ink">CBT</dd>
              </div>
            </dl>
            <Link
              href="/exams/jft-basic/diagnostic"
              className="inline-flex items-center gap-2 rounded-xl bg-academy-teal px-6 py-3.5 font-bold text-white transition-colors duration-200 hover:bg-academy-teal-dark active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-academy-teal min-h-[44px]"
            >
              Take the free diagnostic <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Study order: the L1 to L4 trail ---------- */}
        <section aria-labelledby="study-order-h2" className="py-14 md:py-20 border-b border-border">
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
            Our recommended study order, from Foundation (L1) to Exam mastery
            (L4). This is not the official exam order: the exam runs
            script, then conversation, then listening, then reading.
          </p>
          <div className="mt-10 mb-12">
            <TrailSvg />
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-7">
            {SYLLABUS.studyOrder.map((s) => (
              <li key={s.id} className="border-t border-border pt-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-academy-teal-dark">
                  {String(s.sequence).padStart(2, "0")} · {s.level} {s.levelName}
                </p>
                <p className="mt-1.5 font-bold text-ink">{s.label}</p>
                <p className="text-slate text-[15px] leading-relaxed">{s.why}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- Unit bands: official section, our skills ---------- */}
        {SYLLABUS.sections.map((sec, i) => (
          <section
            key={sec.unit}
            aria-labelledby={`unit-${sec.unit}-h2`}
            className="py-14 md:py-20 border-b border-border grid lg:grid-cols-6 gap-8 lg:gap-12"
          >
            <div className="lg:col-span-2">
              <p
                aria-hidden
                className="text-5xl font-extrabold tabular-nums text-academy-blue/25 select-none"
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2
                id={`unit-${sec.unit}-h2`}
                className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-ink"
              >
                {sec.section}
              </h2>
              <p className="mt-3 text-slate text-[15px] leading-relaxed">
                {sec.purpose}{" "}
                <span className="font-mono text-[13px] font-bold">
                  {sec.officialQuestions} questions on the real test.
                </span>
              </p>
              {sec.example && (
                <p className="mt-4 text-[15px] text-slate">
                  Example:{" "}
                  <span lang="ja" className="jp font-bold text-ink">
                    {sec.example.jp}
                  </span>{" "}
                  <span className="text-slate/80">({sec.example.en})</span>
                </p>
              )}
              {sec.ruleNote && (
                <p className="mt-4 inline-block rounded-lg border border-border bg-paper px-3 py-2 text-[13px] font-semibold text-slate">
                  {sec.ruleNote}
                </p>
              )}
            </div>
            <div className="lg:col-span-4">
              <ul className="border-t border-border">
                {sec.skills.map((s) => {
                  const n = countFor(s.id);
                  const hasPractice = n > 0;
                  return (
                    <li
                      key={s.id}
                      className="relative border-b border-border"
                    >
                      {hasPractice ? (
                        <Link
                          href={`/exams/jft-basic/practice/${s.practiceSlug}`}
                          aria-label={`Practice ${s.label}, ${n} ${plural(n)}`}
                          className="group flex items-center gap-4 md:gap-6 py-5 md:py-6 px-2 md:px-4 -mx-2 md:-mx-4 rounded-xl transition-colors duration-200 ease-signature hover:bg-paper active:scale-[0.995] min-h-[64px] after:absolute after:inset-0 after:content-['']"
                        >
                          <span className="flex-1 min-w-0 relative">
                            <span className="block">
                              <h3 className="text-lg md:text-xl font-bold text-ink">
                                {s.label}
                              </h3>
                            </span>
                            <span className="block text-slate text-[15px] mt-0.5 leading-relaxed">
                              {s.purpose}
                            </span>
                            <span className="block mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
                              {n} {plural(n)} ·{" "}
                              <span aria-hidden="true">draft</span>
                            </span>
                          </span>
                          <span className="shrink-0 hidden sm:inline-flex items-center gap-2 font-semibold text-academy-blue whitespace-nowrap relative">
                            Practice
                            <span
                              aria-hidden
                              className="inline-block transition-transform duration-200 ease-signature group-hover:translate-x-1"
                            >
                              →
                            </span>
                          </span>
                        </Link>
                      ) : (
                        <div className="py-5 md:py-6 px-2 md:px-4 opacity-80">
                          <h3 className="text-lg md:text-xl font-bold text-ink">
                            {s.label}
                          </h3>
                          <p className="text-slate text-[15px] mt-0.5 leading-relaxed">
                            {s.purpose}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              disabled
                              aria-disabled="true"
                              className="inline-flex items-center rounded-xl border border-border bg-paper px-4 py-2.5 text-sm font-bold text-slate cursor-not-allowed min-h-[44px]"
                            >
                              Coming soon
                            </button>
                            <p className="text-sm text-slate">
                              No practice questions yet for this skill. It is on
                              the roadmap.
                            </p>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ))}

        {/* ---------- How the real test works ---------- */}
        <section aria-labelledby="rules-h2" className="py-14 md:py-20 border-b border-border">
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
              <dt className="font-bold text-ink">Time</dt>
              <dd className="mt-1 text-slate text-[15px] leading-relaxed">
                60 minutes total, with no per-section time limit.
              </dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="font-bold text-ink">Moving between sections</dt>
              <dd className="mt-1 text-slate text-[15px] leading-relaxed">
                Once you finish a section you cannot go back to it.
              </dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="font-bold text-ink">Listening</dt>
              <dd className="mt-1 text-slate text-[15px] leading-relaxed">
                {facts.listeningRules}
              </dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="font-bold text-ink">Scoring</dt>
              <dd className="mt-1 text-slate text-[15px] leading-relaxed">
                {facts.scoring}. Levels: A1 for 145 to 174, A2.1 for 175 to 199,
                A2.2 for 200 to 250.
              </dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="font-bold text-ink">Results</dt>
              <dd className="mt-1 text-slate text-[15px] leading-relaxed">
                {facts.results}
              </dd>
            </div>
          </dl>
          <p className="mt-8 text-sm text-slate max-w-3xl">
            Exam facts above follow the Japan Foundation&apos;s official
            JFT-Basic overview. Independent preparation: we are not affiliated
            with the Japan Foundation.
          </p>
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
            Every question count on this page is computed from our live question
            bank. Our practice questions are original drafts, written for
            practice and pending review by a Japanese subject-matter expert.
            They are not official JFT-Basic items, and nothing here predicts an
            official result.
          </p>
        </div>

        {/* ---------- Diagnostic close ---------- */}
        <div className="border border-border rounded-xl bg-paper p-6 md:p-8 mb-14 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="md:flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-3">
                Not sure where to start?
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
                Let the diagnostic place you on the map
              </h2>
              <p className="mt-3 text-slate leading-relaxed">
                Ten original everyday-Japanese questions, about five minutes, no
                account. It ranks your skills and tells you which step of the
                study order to begin with.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/exams/jft-basic/diagnostic"
                className="inline-flex items-center gap-2 rounded-xl bg-academy-teal px-6 py-3.5 font-bold text-white transition-colors duration-200 hover:bg-academy-teal-dark active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-academy-teal min-h-[44px]"
              >
                Start the diagnostic <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
