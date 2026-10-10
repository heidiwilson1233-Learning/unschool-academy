import type { Metadata } from "next";
import Link from "next/link";
import { Section, Button, Breadcrumbs } from "@/components/ui";
import { getCatalogStatusCounts } from "@/lib/catalog";
import {
  TIER_DEFINITIONS,
  VOLUME_TARGETS,
  HONEST_RATE,
  assertTier1Integrity,
  groupTier1ByCategory,
  tier1StatusCounts,
} from "@/lib/tiers";

const SITE = "https://unschool.academy";

/* Build-time data: 50 Tier-1 rows resolved against the catalog, integrity
   asserted. Any dangling id fails the build instead of rendering a lie. */
const tier1Rows = assertTier1Integrity();
const tier1Groups = groupTier1ByCategory(tier1Rows);
const tier1Counts = tier1StatusCounts(tier1Rows);
const catalogCounts = getCatalogStatusCounts();

const metaTitle = "Exam Tiers — 506-Exam Rollout Plan";
const metaDescription =
  "How Unschool Academy builds its exam programs: Tier 1's 50 exams, one practice-ready program today, and the honest plan for Tiers 2 and 3.";

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  alternates: { canonical: "/exams/tiers" },
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    type: "website",
    url: "/exams/tiers",
  },
  twitter: {
    card: "summary",
    title: metaTitle,
    description: metaDescription,
  },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Exams", href: "/exams" },
  { label: "Tiers" },
];

/* JSON-LD mirrors exactly what the page renders: positions + names, url only
   where a real exam-page destination exists (C honesty rule). Counts are
   computed from the same data as the render, so metadata can never drift. */
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: TRAIL.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.label,
    ...(t.href ? { item: `${SITE}${t.href}` } : {}),
  })),
};

const tier1ItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Tier-1 exam rollout list",
  description:
    "The 50 exams Unschool Academy chose to build first, grouped by category. Tier membership is a build sequence, not a demand ranking.",
  numberOfItems: tier1Rows.length,
  itemListElement: tier1Rows.map((r, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: r.entry.exam_or_track,
    ...(r.hasExamPage ? { item: `${SITE}${r.href}` } : {}),
  })),
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const STATUS_STYLE: Record<string, string> = {
  "practice-ready": "text-academy-teal-dark",
  verified: "text-ink",
  research: "text-slate",
  retired: "text-slate",
};

const STATUS_LABEL: Record<string, string> = {
  "practice-ready": "Practice available",
  verified: "Facts verified",
  research: "Research entry",
  retired: "Retired / renamed",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${STATUS_STYLE[status] ?? "text-slate"}`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export default function TiersPage() {
  const tier1 = TIER_DEFINITIONS["1"];
  const tier2 = TIER_DEFINITIONS["2"];
  const tier3 = TIER_DEFINITIONS["3"];
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tier1ItemListJsonLd) }}
      />

      {/* ---------- Hero ---------- */}
      <Section aria-label="Introduction" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: GRAIN,
            opacity: 0.16,
            mixBlendMode: "multiply",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-[-10%] h-[420px] w-[620px] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, rgba(20,125,117,0.14), rgba(20,125,117,0))",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-30%] left-[-8%] h-[380px] w-[520px] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,183,77,0.16), rgba(255,183,77,0))",
          }}
        />
        <div className="relative">
          <Breadcrumbs trail={TRAIL} />
          <p className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal-dark">
            The rollout plan
          </p>
          <p
            aria-hidden="true"
            className="font-display mt-2 text-[clamp(5rem,16vw,12rem)] leading-[0.95] tracking-[-0.04em] text-ink"
          >
            50
          </p>
          <h1 className="mt-2 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink text-balance">
            Which exams we build first, in the open.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
            {catalogCounts.total} exams is too many to build at once. This page publishes the
            order: the 50 exams in Tier 1, what each one gets, and what actually exists today.
          </p>

          {/* Honest inventory strip: every number computed from lib data */}
          <dl
            className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3"
            aria-label="Where Tier 1 stands today"
          >
            <div className="bg-canvas p-5">
              <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                Practice live today
              </dt>
              <dd className="mt-2">
                <span className="font-display text-4xl text-ink">{tier1Counts.practiceReady}</span>
                <span className="mt-1 block text-sm text-slate">JFT-Basic, full practice</span>
              </dd>
            </div>
            <div className="bg-canvas p-5">
              <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                Facts verified
              </dt>
              <dd className="mt-2">
                <span className="font-display text-4xl text-ink">{tier1Counts.verified}</span>
                <span className="mt-1 block text-sm text-slate">
                  official facts checked, no practice yet
                </span>
              </dd>
            </div>
            <div className="bg-canvas p-5">
              <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                Research entries
              </dt>
              <dd className="mt-2">
                <span className="font-display text-4xl text-ink">{tier1Counts.research}</span>
                <span className="mt-1 block text-sm text-slate">
                  mapped, awaiting per-track review
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* ---------- Tier 1: the list ---------- */}
      <Section aria-label="Tier 1: the 50 exams" className="pt-4">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal-dark">
          Tier 1
        </p>
        <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.02em] text-ink text-balance">
          The Tier-1 list
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate">
          {tier1.criteria}. Every Tier-1 exam gets{" "}
          <strong className="font-semibold text-ink">
            {tier1.per_exam.questions} questions, {tier1.per_exam.lessons} lessons,{" "}
            {tier1.per_exam.mocks} mock tests, plus a PYQ set
          </strong>{" "}
          when its program ships. Listed by category, not ranked: row order is not a demand
          ranking.
        </p>

        <div className="mt-8 overflow-x-auto border border-border bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">Tier-1 exams, grouped by category</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate">
                  Exam
                </th>
                <th scope="col" className="px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate">
                  Issuing body
                </th>
                <th scope="col" className="px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate">
                  Status
                </th>
              </tr>
            </thead>
            {tier1Groups.map((group) => (
              <tbody key={group.category}>
                <tr className="border-y border-border bg-canvas">
                  <th scope="rowgroup" colSpan={3} className="px-5 py-2.5">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-academy-teal-dark">
                      {group.category}
                    </span>
                    <span className="ml-3 font-mono text-[11px] text-slate">{group.rows.length}</span>
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.id} className="border-b border-border/60 last:border-b-0">
                    <th scope="row" className="px-5 py-3.5 font-normal">
                      <Link
                        href={row.href}
                        className="font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academy-teal"
                        aria-label={`${row.entry.exam_or_track} — ${STATUS_LABEL[row.status]} — ${
                          row.hasExamPage ? "view exam page" : "view in catalog"
                        }`}
                      >
                        {row.entry.exam_or_track}
                      </Link>
                    </th>
                    <td className="px-5 py-3.5 text-sm text-slate">
                      {row.entry.issuing_body || <span className="sr-only">not listed</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
        <p className="mt-4 text-sm text-slate">
          The rest of the {catalogCounts.total}-exam catalog stays in the{" "}
          <Link href="/exams/catalog" className="font-semibold text-academy-blue hover:underline">
            research catalog<span aria-hidden="true"> →</span>
          </Link>{" "}
          until a program is verified and built.
        </p>
      </Section>

      {/* ---------- Tier 2 / Tier 3 plans ---------- */}
      <Section aria-label="Tier 2 and Tier 3 plans" className="pt-4">
        <div className="grid gap-6 lg:grid-cols-6">
          <div className="border border-border bg-white p-7 md:p-9 lg:col-span-3 step-reveal">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal-dark">
              Tier 2
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-ink">
              {tier2.exams} exams, next
            </h2>
            <p className="mt-4 leading-relaxed text-slate">{tier2.criteria}.</p>
            <dl className="mt-6 space-y-3 border-t border-border pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-slate">Per exam</dt>
                <dd className="font-mono text-sm font-bold text-ink">
                  {tier2.per_exam.questions} questions · {tier2.per_exam.lessons} lessons ·{" "}
                  {tier2.per_exam.mocks} mocks
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-slate">Volume target</dt>
                <dd className="font-mono text-sm font-bold text-ink">
                  {VOLUME_TARGETS.tier2_questions.toLocaleString("en-IN")} questions
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-slate">Exam assignments</dt>
                <dd className="text-sm text-slate">not yet published</dd>
              </div>
            </dl>
          </div>
          <div className="border border-border bg-white p-7 md:p-9 lg:col-span-3 step-reveal">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal-dark">
              Tier 3
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-ink">
              {tier3.exams} exams, full coverage
            </h2>
            <p className="mt-4 leading-relaxed text-slate">{tier3.criteria}.</p>
            <dl className="mt-6 space-y-3 border-t border-border pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-slate">Per exam</dt>
                <dd className="font-mono text-sm font-bold text-ink">
                  {tier3.per_exam.questions} questions · {tier3.per_exam.lessons} ·{" "}
                  {tier3.per_exam.mocks} mock
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-slate">Volume target</dt>
                <dd className="font-mono text-sm font-bold text-ink">
                  {VOLUME_TARGETS.tier3_questions.toLocaleString("en-IN")} questions
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-slate">Exam assignments</dt>
                <dd className="text-sm text-slate">not yet published</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-slate">
              A plan footnote: the strategy table lists 300 Tier-3 exams, but its own volume
              math uses 306 (50 + 150 + 306 = 506). This page uses 306 so the totals add up.
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl leading-relaxed text-slate">
          Tier 2 and Tier 3 have no start dates. Our sequencing rule:{" "}
          <strong className="font-semibold text-ink">
            one exam to full depth before spreading thin
          </strong>
          . Tier 1&apos;s 50 come first.
        </p>
      </Section>

      {/* ---------- Pipeline math (the wow: oversized MD-verbatim numerals) ---------- */}
      <Section aria-label="The full volume target" className="pt-4">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal-dark">
          Targets, not inventory
        </p>
        <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.02em] text-ink text-balance">
          What &ldquo;all 506 exams&rdquo; actually means
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {[
            { n: VOLUME_TARGETS.tier1_questions, label: "Tier 1 questions", sub: "50 exams × 500" },
            { n: VOLUME_TARGETS.tier2_questions, label: "Tier 2 questions", sub: "150 exams × 200" },
            { n: VOLUME_TARGETS.tier3_questions, label: "Tier 3 questions", sub: "306 exams × 50" },
          ].map((m) => (
            <div key={m.label} className="relative">
              <p className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-[-0.03em] text-ink step-reveal">
                {m.n.toLocaleString("en-IN")}
              </p>
              <div
                aria-hidden="true"
                className="loop-fill-x mt-3 h-px w-full origin-left bg-academy-teal/60"
              />
              <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                {m.label}
              </p>
              <p className="mt-1 text-sm text-slate">{m.sub}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-3xl leading-relaxed text-slate">
          {VOLUME_TARGETS.total_questions.toLocaleString("en-IN")} questions: the target, not the
          inventory. At our current honest rate of about {HONEST_RATE.questions_per_day}{" "}
          researched questions a day, Tier 1&apos;s questions take roughly{" "}
          {HONEST_RATE.tier1_question_weeks} weeks. Lessons, mocks and videos run on parallel
          tracks. All of this is an estimate, not a date.
        </p>
      </Section>

      {/* ---------- Honest diagnostic CTA ---------- */}
      <Section aria-label="Start with the one live program" className="pt-4">
        <div className="border border-border bg-canvas p-7 md:p-10">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink text-balance">
            The diagnostic is live for JFT-Basic today.
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate">
            Ten skill-tagged questions, a real gap map, and a study plan in about five minutes.
            Each Tier-1 exam gets its own diagnostic when its practice ships.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button href="/exams/jft-basic/diagnostic" size="lg">
              Take the JFT-Basic diagnostic
            </Button>
            <Button href="/how-it-works" variant="secondary" size="lg">
              How the tiers fit the method
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
