import type { Metadata } from "next";
import Link from "next/link";
import { Section, Breadcrumbs, Callout, Button, Badge } from "@/components/ui";
import CatalogBrowser from "@/components/catalog-browser";
import {
  CATEGORY_META,
  categoryUrl,
  getCatalogStatusCounts,
  getCategoryStatusCounts,
  getCatalogRows,
  getPracticeReadyEntries,
} from "@/lib/catalog";

/* Sibling hero recipe (run 28): inline-SVG grain + ambient radial glows,
   light surfaces only — never a gradient wash. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/* Honest numbers: computed from the live catalog at build time, never typed by hand. */
const counts = getCatalogStatusCounts();
const rows = getCatalogRows();
const practiceReady = getPracticeReadyEntries();

export const metadata: Metadata = {
  title: `Exam Catalog — ${counts.total} Research Entries, Honestly Labelled`,
  description: `Browse ${counts.total} exam tracks by category, region and status. ${counts.verified} facts verified, ${counts.retired} retired or renamed — every research entry labeled as what it is.`,
  alternates: { canonical: "/exams/catalog" },
  openGraph: {
    title: `Exam Catalog — ${counts.total} Research Entries, Honestly Labelled`,
    description: `${counts.total} exam and preparation tracks cataloged by category, region and status. An entry is a research target — not a promise.`,
    type: "website",
    url: "/exams/catalog",
  },
  twitter: {
    card: "summary",
    title: `Exam Catalog — ${counts.total} Research Entries, Honestly Labelled`,
    description: `${counts.total} research entries by category, region and status — honestly labeled, never sold as available programs.`,
  },
};

/* JSON-LD is exactly parallel to the rendered content. */
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
    { "@type": "ListItem", position: 2, name: "Exams", item: "https://unschool.academy/exams" },
    { "@type": "ListItem", position: 3, name: "Exam catalog", item: "https://unschool.academy/exams/catalog" },
  ],
};

const categoryItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Exam catalog categories",
  numberOfItems: CATEGORY_META.length,
  itemListElement: CATEGORY_META.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    url: `https://unschool.academy/exams/catalog/category/${c.slug}`,
  })),
};

function pluralize(n: number, one: string, many: string) {
  return n === 1 ? `1 ${one}` : `${n} ${many}`;
}

export default function CatalogHubPage() {
  const practiceLine =
    counts.practiceReady === 1 && practiceReady.length === 1
      ? `Exactly one entry qualifies so far: ${practiceReady[0].name} (${practiceReady[0].id}).`
      : `${counts.practiceReady} entries qualify so far.`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryItemListJsonLd) }}
      />

      {/* ---------- Authored hero: type carries it ---------- */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(52rem 26rem at 12% -10%, rgba(49,91,135,0.14), transparent 60%), radial-gradient(44rem 24rem at 88% 8%, rgba(20,125,117,0.12), transparent 60%)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <Breadcrumbs
            trail={[
              { label: "Home", href: "/" },
              { label: "Exams", href: "/exams" },
              { label: "Exam catalog" },
            ]}
          />
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal">
            Exam catalog · Research made visible
          </p>
          <h1
            className="mt-4 font-display text-balance text-ink"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 4.75rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {counts.total} exams, cataloged honestly.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
            Our research backlog, made visible: {counts.total} exam and preparation tracks across{" "}
            {CATEGORY_META.length} categories. An entry is a research target, not a promise.
            Exactly one so far, JFT-Basic (EX-299), has real practice on this site.{" "}
            <Link href="/how-it-works" className="font-semibold text-academy-blue hover:underline">
              See how we verify
              <span aria-hidden="true"> →</span>
            </Link>
          </p>
          {/* Honest inventory strip: every number computed from lib/catalog */}
          <p className="mt-8 font-mono text-xs sm:text-sm text-slate" aria-label="Catalog inventory">
            <span className="font-bold text-ink">{counts.total} entries</span>
            <span aria-hidden="true"> · </span>
            {counts.verified} facts verified
            <span aria-hidden="true"> · </span>
            {counts.research} research
            <span aria-hidden="true"> · </span>
            {counts.retired} retired/renamed
            <span aria-hidden="true"> · </span>
            <span className="font-bold text-academy-teal">
              {counts.practiceReady} practice available
            </span>
          </p>
          <p className="mt-4 text-sm text-slate">
            The catalog is only half the story.{" "}
            <Link href="/exams/tiers" className="font-semibold text-academy-blue hover:underline">
              See the tier plan: which 50 exams we build first
              <span aria-hidden="true"> →</span>
            </Link>
          </p>
          <div className="mt-6">
            <Button href="#practice-now" variant="secondary" size="sm">
              Start with the one live program
            </Button>
          </div>
        </div>
      </div>

      {/* ---------- The one live program (portal move 8: one tap to real practice) ---------- */}
      <Section id="practice-now" aria-label="The one live program">
        <div className="border-y border-border py-8 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal">
                01 live program · Practice available
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-ink" style={{ letterSpacing: "-0.02em" }}>
                JFT-Basic
              </h2>
              <p className="mt-2 text-slate">
                Japan Foundation Test for Basic Japanese — the only entry with real practice,
                diagnostics and mocks on this site.
              </p>
              <p className="mt-3 font-mono text-xs text-slate">
                10 questions · about 5 minutes · no account required
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <Button href="/exams/jft-basic/diagnostic" size="lg">
                Take the free diagnostic
                <span aria-hidden="true"> →</span>
              </Button>
              <Link href="/exams/jft-basic" className="text-sm font-semibold text-academy-blue hover:underline">
                View the JFT-Basic program
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <Callout title="How to read this catalog" tone="info">
          <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            <div>
              <dt className="inline font-bold text-ink">Research entry — </dt>
              <dd className="inline">we are still verifying the facts: no practice, no mocks, no purchase.</dd>
            </div>
            <div>
              <dt className="inline font-bold text-ink">Facts verified — </dt>
              <dd className="inline">the exam details passed our verification checklist.</dd>
            </div>
            <div>
              <dt className="inline font-bold text-ink">Practice available — </dt>
              <dd className="inline">reviewed practice actually exists on this site. {practiceLine}</dd>
            </div>
            <div>
              <dt className="inline font-bold text-ink">Retired / renamed — </dt>
              <dd className="inline">the exam was discontinued or renamed by its issuer. Kept for the record, not offered.</dd>
            </div>
          </dl>
          <p className="mt-3">We never invent rankings, fees, or pass guarantees.</p>
        </Callout>

        <div className="mt-8">
          <CatalogBrowser rows={rows} />
        </div>
      </Section>

      <Section className="!pt-0">
        <h2 className="text-xl font-extrabold text-ink mb-2">Browse by category</h2>
        <p className="text-sm text-slate mb-6">
          Ten research verticals. Counts are the live inventory, not marketing.
        </p>
        <ul className="divide-y divide-border border-y border-border">
          {CATEGORY_META.map((c, i) => {
            const cc = getCategoryStatusCounts(c.name);
            const micro: string[] = [pluralize(cc.total, "entry", "entries")];
            if (cc.verified > 0) micro.push(`${cc.verified} facts verified`);
            if (cc.retired > 0) micro.push(`${cc.retired} retired/renamed`);
            if (cc.practiceReady > 0) micro.push("practice available");
            return (
              <li key={c.slug}>
                <Link
                  href={categoryUrl(c.slug)}
                  aria-label={`Browse ${c.name}: ${cc.total} entries`}
                  className="group flex items-baseline gap-4 sm:gap-6 py-4 transition-colors hover:bg-canvas/60 focus-visible:outline-none"
                >
                  <span aria-hidden="true" className="font-mono text-xs text-slate w-7 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block">
                      <h3 className="inline font-bold text-ink group-hover:text-academy-blue transition-colors">
                        {c.name}
                      </h3>
                      {cc.practiceReady > 0 && (
                        <span className="ml-2 align-middle inline-flex">
                          <Badge tone="success">Practice available</Badge>
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate">{c.tagline}</span>
                  </span>
                  <span className="font-mono text-xs text-slate shrink-0 text-right">
                    {micro.join(" · ")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
