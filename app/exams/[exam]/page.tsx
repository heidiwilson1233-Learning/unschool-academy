import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Section,
  SectionHeading,
  Button,
  Badge,
  Breadcrumbs,
  FAQAccordion,
  Callout,
} from "@/components/ui";
import {
  getExamPageData,
  listExamSlugs,
  type ExamPageData,
} from "@/lib/exam-template";

/**
 * Exam page template — ONE template renders every exam from course.json.
 * Doctrine doc 12: identical template for all exams, no exam gets special UI.
 * Every section below is data-gated: a missing course.json field omits the
 * section instead of inventing copy. All question counts are drafts pending
 * subject-expert review; only counts (never answer keys) reach the client.
 */

export function generateStaticParams() {
  const slugs = listExamSlugs();
  return slugs.map((exam) => ({ exam }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ exam: string }>;
}): Promise<Metadata> {
  const { exam } = await params;
  const data = getExamPageData(exam);
  if (!data) return { title: "Exam not found" };
  const countBits = [
    data.questionCount > 0 ? `${data.questionCount} draft practice questions` : null,
    data.units.length > 0 ? `${data.units.length} study units` : null,
    data.videoCount > 0 ? `${data.videoCount} curated videos` : null,
  ].filter((b): b is string => b !== null);
  const base = data.description || `${data.title} preparation on Unschool Academy.`;
  const description = `${base} ${countBits.join(" · ")}${countBits.length ? "." : ""}`.slice(0, 155);
  return {
    title: data.title,
    description,
    alternates: { canonical: `/exams/${data.slug}` },
    openGraph: {
      title: data.title,
      description,
      type: "website",
      url: `/exams/${data.slug}`,
    },
    twitter: { card: "summary_large_image", title: data.title, description },
    // Thin exams (no authored questions yet) are not SEO landing pages.
    ...(data.thin ? { robots: { index: false, follow: true } } : {}),
  };
}

/* Inline SVG grain (light surfaces only) — same recipe as sibling pages. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/** "L1–L3", or just "L2" when the bank covers a single level. */
function levelRange(levels: string[]): string {
  if (levels.length <= 1) return levels[0] ?? "";
  return `${levels[0]}–${levels[levels.length - 1]}`;
}

function shortNameOf(data: ExamPageData): string {
  if (data.catalog) return data.catalog.name;
  return data.title.split("—")[0]?.trim() || data.title;
}

/* Feature cells: only routes that exist on disk are offered. */
function featureCells(data: ExamPageData): {
  key: string;
  name: string;
  payoff: string;
  href: string;
}[] {
  const f = data.features;
  const cells = [];
  if (f.diagnostic)
    cells.push({
      key: "diagnostic",
      name: "Free diagnostic",
      payoff: `${data.diagnosticCount} questions · about 5 minutes · no account`,
      href: `/exams/${data.slug}/diagnostic`,
    });
  if (f.practice)
    cells.push({
      key: "practice",
      name: "Topic practice",
      payoff: `${data.questionCount} draft questions with explanations`,
      href: `/exams/${data.slug}/practice`,
    });
  if (f.answers)
    cells.push({
      key: "answers",
      name: "Answers & explanations",
      payoff: `${data.questionCount} draft explanations with hints, searchable by skill`,
      href: `/exams/${data.slug}/answers`,
    });
  if (f.topics)
    cells.push({
      key: "topics",
      name: "Topic index",
      payoff: `${data.skillCount} skills mapped to the syllabus`,
      href: `/exams/${data.slug}/topics`,
    });
  if (f.mockTests)
    cells.push({
      key: "mockTests",
      name: "Timed mocks",
      payoff: "Exam-pattern timing, instant scoring",
      href: `/exams/${data.slug}/mock-tests`,
    });
  if (f.syllabus)
    cells.push({
      key: "syllabus",
      name: "Syllabus map",
      payoff: "Official syllabus broken into study units",
      href: `/exams/${data.slug}/syllabus`,
    });
  return cells;
}

/* Known official-test facts, rendered in a fixed honest order. Unknown keys
   are ignored — the template never invents labels for data it doesn't know. */
function patternRows(data: ExamPageData): { label: string; value: string }[] {
  const p = data.examPattern;
  if (!p) return [];
  const rows: { label: string; value: string }[] = [];
  const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : null);
  const format = str(p.format);
  if (format) rows.push({ label: "Format", value: format });
  const questions = str(p.questions);
  if (questions) rows.push({ label: "Questions", value: questions });
  const duration = str(p.duration) ?? (typeof p.duration_minutes === "number" ? `${p.duration_minutes} minutes` : null);
  if (duration) rows.push({ label: "Duration", value: duration });
  if (Array.isArray(p.sections) && p.sections.length > 0) {
    const names = p.sections
      .map((s) =>
        typeof s === "string" ? s : typeof s === "object" && s !== null && "name" in s ? String((s as { name: unknown }).name) : null
      )
      .filter((s): s is string => !!s);
    if (names.length > 0)
      rows.push({ label: "Sections", value: `${names.length} — ${names.join("; ")}` });
  }
  const scoring = str(p.scoring) ?? str(p.score_scale) ?? str(p.passing_score);
  if (scoring) rows.push({ label: "Scoring", value: scoring });
  const fee = str(p.fee_usd) ?? str(p.fee);
  if (fee) rows.push({ label: "Listed fee", value: fee });
  return rows;
}

export default async function ExamTemplatePage({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  const data = getExamPageData(exam);
  if (!data) notFound();

  const shortName = shortNameOf(data);
  const cells = featureCells(data);
  const rows = patternRows(data);
  const hasPrepare = cells.length > 0;
  const hasUnits = data.units.length > 0;
  const hasOfficial = rows.length > 0;
  const primary = cells[0] ?? null;

  const freeRail: string[] = [];
  if (data.features.diagnostic) freeRail.push(`${data.diagnosticCount}-question diagnostic`);
  if (data.features.practice) freeRail.push(`${data.questionCount} draft practice questions`);
  if (data.features.answers) freeRail.push("Answer index with hints");
  if (data.features.mockTests) freeRail.push("Timed mock");
  if (data.features.topics) freeRail.push("Topic index");
  if (data.features.syllabus) freeRail.push("Syllabus map");
  const hasPricing = data.offers.length > 0 || freeRail.length > 0;

  const trail = [
    { label: "Home", href: "/" },
    { label: "Exams", href: "/exams" },
    { label: shortName },
  ];

  const subnav: [string, string][] = [];
  if (hasPrepare) subnav.push(["Ways to prepare", "#prepare"]);
  if (hasUnits) subnav.push(["Syllabus", "#syllabus"]);
  if (hasOfficial) subnav.push(["The official test", "#official-test"]);
  if (hasPricing) subnav.push(["Pricing", "#pricing"]);
  subnav.push(["FAQs", "#faqs"]);

  /* Parameterized honesty FAQs — built from the same array the accordion
     renders, so visible copy and structured data cannot drift apart. */
  const faqs: { q: string; a: string }[] = [];
  if (data.catalog)
    faqs.push({
      q: `Is this an official ${shortName} product?`,
      a: `No. Unschool Academy is independent and not affiliated with ${data.catalog.issuingBody}. Our questions are original practice items written for this exam. They are not official past papers, and we never reproduce those.`,
    });
  if (data.features.diagnostic)
    faqs.push({
      q: "Will my diagnostic score predict my official result?",
      a: `No. Anyone who says otherwise is selling you something. Your score measures performance on our ${data.diagnosticCount} original practice questions. It shows which topics need work. It cannot predict an official ${shortName} result.`,
    });
  faqs.push({
    q: "What does “draft pending expert review” mean?",
    a: "Every question is researched from official syllabi and standard sources, then written as a draft. A qualified subject expert reviews each batch. Until that review, everything on this page is a draft — including the counts above.",
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
      { "@type": "ListItem", position: 2, name: "Exams", item: "https://unschool.academy/exams" },
      { "@type": "ListItem", position: 3, name: shortName, item: `https://unschool.academy/exams/${data.slug}` },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const kicker = data.catalog
    ? `${data.catalog.category} · ${data.statusLabel}`
    : data.statusLabel;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header: type-as-hero carries the page — no per-exam imagery to maintain
          across 506 exams. Grain + ambient radials on a paper surface. */}
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
          <Breadcrumbs trail={trail} />
          <p className="guide-reveal text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal mb-4 font-mono">
            {kicker}
          </p>
          <h1 className="guide-reveal font-display text-[clamp(2.75rem,6vw,5rem)] leading-[1.02] tracking-[-0.03em] text-ink text-balance max-w-4xl">
            {data.title}
          </h1>
          {data.description && (
            <p className="guide-reveal mt-5 text-lg text-slate max-w-2xl leading-relaxed">
              {data.description}
            </p>
          )}

          {/* Honest count strip: computed from the curriculum bank, never hardcoded. */}
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-border pt-6 text-sm">
            {data.features.diagnostic && data.diagnosticCount > 0 && (
              <div className="flex items-baseline gap-3">
                <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">Diagnostic</dt>
                <dd className="font-bold text-ink tabular-nums">{data.diagnosticCount} questions · free</dd>
              </div>
            )}
            <div className="flex items-baseline gap-3">
              <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">Practice</dt>
              <dd className="font-bold text-ink tabular-nums">
                {data.questionCount} draft questions
              </dd>
            </div>
            {data.skillCount > 0 && (
              <div className="flex items-baseline gap-3">
                <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">Skills</dt>
                <dd className="font-bold text-ink tabular-nums">{data.skillCount}</dd>
              </div>
            )}
            {data.levels.length > 0 && (
              <div className="flex items-baseline gap-3">
                <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">Levels</dt>
                <dd className="font-bold text-ink tabular-nums">
                  {levelRange(data.levels)}
                </dd>
              </div>
            )}
            {data.videoCount > 0 && (
              <div className="flex items-baseline gap-3">
                <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">Videos</dt>
                <dd className="font-bold text-ink tabular-nums">{data.videoCount} curated</dd>
              </div>
            )}
            {data.estimatedHours !== null && (
              <div className="flex items-baseline gap-3">
                <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">Study time</dt>
                <dd className="font-bold text-ink tabular-nums">~{data.estimatedHours} hours</dd>
              </div>
            )}
          </dl>

          <p className="mt-4 text-xs text-slate">
            All counts are drafts pending subject-expert review. They grow as questions are written and reviewed.
          </p>

          {/* One dominant CTA (the diagnostic funnel); everything else is a quiet link. */}
          {primary && (
            <div className="mt-8">
              <Button href={primary.href} size="lg">
                {primary.key === "diagnostic" ? "Start the free diagnostic" : primary.name}
              </Button>
              <p className="mt-3 text-xs font-mono uppercase tracking-[0.18em] text-slate">
                {primary.payoff}
              </p>
            </div>
          )}
          <p className="mt-6 text-sm text-slate">
            {data.levels.length > 0 ? (
              <>
                Sequenced {levelRange(data.levels)} per{" "}
                <a href="/how-it-works" className="font-semibold text-academy-blue hover:underline">
                  the Unschool Method
                </a>
                .
              </>
            ) : (
              <>
                <a href="/how-it-works" className="font-semibold text-academy-blue hover:underline">
                  How learning works here: the Unschool Method
                </a>
                .
              </>
            )}
            {data.catalog?.officialUrl && (
              <>
                {" "}Official information:{" "}
                <a
                  href={data.catalog.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-academy-blue hover:underline"
                >
                  {data.catalog.issuingBody} <span aria-hidden="true">↗</span>
                </a>
                <span className="sr-only"> (opens in new tab)</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Sticky subnav — only sections that actually rendered. */}
      {subnav.length > 1 && (
        <nav aria-label={`${shortName} sections`} className="sticky top-[72px] z-30 bg-paper border-b border-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto thin-scroll">
            {subnav.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="px-4 py-3 text-sm font-semibold text-slate hover:text-academy-blue whitespace-nowrap transition-colors duration-200 ease-[var(--ease-signature)] active:text-academy-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* The diagnostic value exchange: what the free minutes buy you. */}
      {data.features.diagnostic && (
        <Section id="diagnostic-value">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal mb-3 font-mono">
            The diagnostic
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance mb-10 md:mb-12 max-w-3xl">
            See where you stand, topic by topic
          </h2>
          <ol className="grid sm:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                n: "01",
                title: `Answer ${data.diagnosticCount} original questions`,
                body: "About five minutes. No timer, no account, no fake result gate.",
              },
              {
                n: "02",
                title: "See your gap map",
                body: `Your score broken down across ${data.units.length > 0 ? `the ${data.units.length} sections` : "every section"}, weakest first.`,
              },
              {
                n: "03",
                title: "Follow the starter plan",
                body: "A concrete next step for each weak area, in practice order.",
              },
            ].map((s) => (
              <li key={s.n} className="border-t-2 border-ink pt-5">
                <p className="font-mono text-xs font-bold tracking-[0.2em] text-academy-teal" aria-hidden="true">
                  {s.n}
                </p>
                <h3 className="mt-2 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-[15px] text-slate leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Ways to prepare: bento ladder of real routes, never placeholder cards. */}
      {hasPrepare && (
        <Section id="prepare" className="bg-paper border-y border-border">
          <SectionHeading
            align="left"
            eyebrow="Ways to prepare"
            title="Start where you are"
            sub="Every route below is live on this site right now. Nothing on this page is a mockup."
          />
          <div className="grid grid-cols-6 gap-5">
            {cells.map((c, i) => (
              <a
                key={c.key}
                href={c.href}
                className={`faq-reveal group border-t-2 ${i === 0 ? "border-ink" : "border-border"} pt-5 pb-2 ${
                  i === 0 ? "col-span-6 md:col-span-4" : "col-span-6 sm:col-span-3 md:col-span-2"
                }`}
                style={{ animationDelay: `${[0, 52, 91, 140][Math.min(i, 3)]}ms` }}
              >
                <p className="font-mono text-xs font-bold tracking-[0.2em] text-academy-teal" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink group-hover:text-academy-blue transition-colors duration-200 ease-[var(--ease-signature)]">
                  {c.name}
                </h3>
                <p className="mt-1.5 text-[15px] text-slate leading-relaxed">{c.payoff}</p>
                <p className="mt-3 text-sm font-bold text-academy-blue">
                  {i === 0 ? "Start now" : "Open"} <span aria-hidden="true">→</span>
                </p>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Syllabus: hairline-ruled unit rows with real counts. */}
      {hasUnits && (
        <Section id="syllabus">
          <SectionHeading
            align="left"
            eyebrow="Syllabus"
            title="What the course covers"
            sub={`${data.units.length} units · ${data.questionCount} draft practice questions · sequenced ${data.levels.length > 0 ? levelRange(data.levels) : "foundation to exam level"}.`}
          />
          <ul className="border-t border-border">
            {data.units.map((u, i) => (
              <li
                key={u.id}
                className="faq-reveal grid gap-2 md:grid-cols-12 md:gap-6 py-6 border-b border-border"
                style={{ animationDelay: `${[0, 52, 91, 140][Math.min(i, 3)]}ms` }}
              >
                <p className="md:col-span-1 font-mono text-xs font-bold tracking-[0.2em] text-academy-teal pt-1" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="md:col-span-7">
                  <h3 className="text-lg font-bold text-ink">{u.title}</h3>
                  {u.description && (
                    <p className="mt-1.5 text-[15px] text-slate leading-relaxed max-w-2xl">{u.description}</p>
                  )}
                  {u.skills.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Skills in ${u.title}`}>
                      {u.skills.map((s) => (
                        <li
                          key={s.id}
                          className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate border border-border rounded-full px-2.5 py-1"
                        >
                          {s.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="md:col-span-4 md:text-right">
                  <p className="text-sm font-bold text-ink tabular-nums">
                    {u.questionCount} draft questions
                  </p>
                  {u.levels.length > 0 && (
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
                      {u.levels.join(" · ")}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Official test facts: verbatim from course.json, with the source line. */}
      {hasOfficial && (
        <Section id="official-test" className="bg-paper border-y border-border">
          <div className="max-w-3xl">
            <SectionHeading
              align="left"
              eyebrow="The official test"
              title={`About the ${shortName}`}
            />
            <dl className="border-t border-border">
              {rows.map((r) => (
                <div key={r.label} className="py-4 border-b border-border grid sm:grid-cols-12 gap-1 sm:gap-6">
                  <dt className="sm:col-span-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate pt-1">
                    {r.label}
                  </dt>
                  <dd className="sm:col-span-9 text-[15px] text-ink leading-relaxed">{r.value}</dd>
                </div>
              ))}
            </dl>
            {data.sources.length > 0 && (
              <p className="mt-5 text-sm text-slate leading-relaxed">
                Researched from: {data.sources.join(" · ")}
              </p>
            )}
          </div>
        </Section>
      )}

      {/* Pricing: offers are MD-backed prices declared in course.json; the free
          rail is computed from live routes. Never invented. */}
      {hasPricing && (
        <Section id="pricing">
          <SectionHeading
            align="left"
            eyebrow={data.offers.length > 0 ? "Pilot pricing (illustrative)" : "Pricing"}
            title="Free to start"
            sub={
              data.offers.length > 0
                ? "Pilot prices while the program is in review. Every plan states exactly what it unlocks."
                : `Everything on this page is free while the program is ${data.statusLabel.toLowerCase()}.`
            }
          />
          {data.offers.length > 0 && (
            <div className="grid lg:grid-cols-6 gap-8 max-w-5xl">
              <div className="lg:col-span-4 border-t-2 border-ink pt-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-extrabold tracking-tight text-ink">{data.offers[0].name}</h3>
                  <Badge tone="info">{data.statusLabel} · test mode</Badge>
                </div>
                <p className="mt-3 text-5xl font-extrabold tracking-[-0.03em] text-ink">
                  {data.offers[0].price}
                  <span className="ml-3 align-middle text-sm font-semibold tracking-normal text-slate">
                    one-time · illustrative
                  </span>
                </p>
                <p className="mt-4 text-[15px] text-slate leading-relaxed max-w-xl">{data.offers[0].note}</p>
                <div className="mt-6">
                  <Button href="/signup">Join the pilot — no payment yet</Button>
                </div>
              </div>
              <div className="lg:col-span-2 border-t-2 border-border pt-6">
                <h3 className="text-xl font-extrabold tracking-tight text-ink">Free</h3>
                <p className="mt-3 text-5xl font-extrabold tracking-[-0.03em] text-ink" aria-label="₹0, free">
                  ₹0
                </p>
                <ul className="mt-6 space-y-2.5 text-[15px] text-slate">
                  {freeRail.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-academy-teal font-bold" aria-hidden="true">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {primary && (
                  <div className="mt-6">
                    <Button href={primary.href} variant="secondary">{primary.name}</Button>
                  </div>
                )}
              </div>
            </div>
          )}
          {data.offers.length === 0 && (
            <ul className="mt-2 space-y-2.5 text-[15px] text-slate max-w-2xl">
              {freeRail.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-academy-teal font-bold" aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
          {data.offers.slice(1).map((o) => (
            <div key={o.name} className="mt-10 max-w-5xl border-t border-border pt-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-ink">
                  {o.name} · {o.price}{" "}
                  <span className="text-sm font-semibold text-slate">one-time · illustrative</span>
                </h3>
                <p className="mt-1.5 text-[15px] text-slate leading-relaxed max-w-md">{o.note}</p>
              </div>
              <Button href="/signup" variant="secondary">Get early access</Button>
            </div>
          ))}
          {data.offers.length > 0 && (
            <p className="text-sm text-slate mt-8 max-w-2xl leading-relaxed">
              Prices shown are illustrative pilot prices: unvalidated test hypotheses, not final
              pricing. We will confirm final prices before any real payment. Checkout is in test
              mode during the pilot. No real charges.
            </p>
          )}
        </Section>
      )}

      {/* Honesty, in one place. */}
      <Section id="honesty" className={hasPricing ? "bg-paper border-t border-border !py-12 md:!py-16" : ""}>
        <div className="max-w-3xl">
          <Callout title="Independent preparation" tone="info">
            {data.catalog ? (
              <>
                Unschool Academy is not affiliated with {data.catalog.issuingBody}.{" "}
              </>
            ) : null}
            All {data.questionCount} practice questions on this page are original drafts pending
            subject-expert review. They are not official past papers, and we never reproduce those.
          </Callout>
        </div>
      </Section>

      {/* Related exams in the same category — discovery, server-rendered. */}
      {data.related.length > 0 && (
        <Section id="related" className="!pt-0">
          <div className="max-w-3xl">
            <SectionHeading
              align="left"
              eyebrow="Keep exploring"
              title={`More ${data.catalog?.category ?? "exam"} prep`}
            />
            <ul className="border-t border-border">
              {data.related.map((r) => (
                <li key={r.slug} className="border-b border-border">
                  <a
                    href={`/exams/${r.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
                  >
                    <span className="text-[15px] font-bold text-ink group-hover:text-academy-blue transition-colors duration-200 ease-[var(--ease-signature)]">
                      {r.title}
                    </span>
                    <span aria-hidden="true" className="text-academy-blue font-bold">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* FAQs */}
      <Section id="faqs" className="!pt-0">
        <div className="max-w-3xl mx-auto">
          <SectionHeading eyebrow="FAQ" title="Questions about this page, answered" />
          <FAQAccordion items={faqs} idPrefix={`faq-${data.slug}`} />
        </div>
      </Section>
    </>
  );
}
