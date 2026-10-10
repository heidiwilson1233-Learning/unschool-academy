import type { Metadata } from "next";
import Link from "next/link";
import { Section, Breadcrumbs, Button } from "@/components/ui";

/* Read time: ceil(visible words / 200). Currently ~285 visible words -> 2 min.
   Keep app/blog/page.tsx's entry for this post in sync. */
const READ_TIME = "2 min read";

const TITLE = "Why Your Child Doesn't Need a Score";
const DESCRIPTION =
  "Scores rank children; evidence informs parents. How Unschool Kids reports what a child did (hinted, independent, transfer) instead of a number.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog/why-no-scores-kids" },
  openGraph: {
    type: "article",
    url: "/blog/why-no-scores-kids",
    title: TITLE,
    description: DESCRIPTION,
    publishedTime: "2026-10",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "No scores, no stars, no percentiles. What we record instead, and why.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://unschool.academy/blog" },
        {
          "@type": "ListItem",
          position: 3,
          name: "Why no scores for children",
          item: "https://unschool.academy/blog/why-no-scores-kids",
        },
      ],
    },
    {
      "@type": "BlogPosting",
      headline: TITLE,
      datePublished: "2026-10",
      inLanguage: "en",
      author: { "@type": "Organization", name: "Unschool Academy content team" },
      publisher: { "@type": "Organization", name: "Unschool Academy" },
      mainEntityOfPage: "https://unschool.academy/blog/why-no-scores-kids",
    },
  ],
};

/* Inline SVG grain (light surfaces only) — same recipe as sibling pages. */
const GRAIN =
  "url(\\\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\\\")\"";

/* The four evidence levels, verbatim from the kids product vocabulary
   (verified against /kids/for-parents EVIDENCE_ROWS). Colon fragments replace
   the original em-dash chains; labels keep draft-pending honesty out of copy
   since this is editorial, not exam content. */
const EVIDENCE = [
  { label: "Practised independently", body: "Solved with no help. The skill is settling in." },
  { label: "Used a hint", body: "Which hint level, and what it taught. Hints are teaching, not cheating." },
  { label: "Needed a demonstration", body: "The character showed the way first. Useful information, not failure." },
  { label: "Transfer observed", body: "Applied the skill to a brand-new example. This is the real prize." },
];

const KEEP_READING = [
  {
    href: "/kids/for-parents",
    title: "Read the parent guide",
    sub: "How Parent Hub observations work, and the off-screen activities each quest ends with.",
  },
  {
    href: "/parent",
    title: "See the Parent Hub plans",
    sub: "Activity summaries, privacy controls, and what is arriving in staged rollout.",
  },
  {
    href: "/blog/why-no-percentiles",
    title: "Why we don't do percentiles",
    sub: "The sibling rule, written for older learners.",
  },
];

export default function NoScorePost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Authored masthead — breadcrumbs above the h1, type as the hero. */}
      <Section className="relative overflow-hidden pt-10 md:pt-14 pb-2">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: GRAIN, opacity: 0.16, mixBlendMode: "multiply" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(42rem 22rem at 12% -8%, rgba(20,125,117,0.10), transparent 60%), radial-gradient(36rem 20rem at 88% 12%, rgba(63,125,92,0.10), transparent 60%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <Breadcrumbs
            trail={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: "No scores for children" },
            ]}
          />
          <p className="mt-6 text-[11px] font-mono uppercase tracking-[0.2em] text-kids-leaf-deep">
            The Unschool Method · For parents
          </p>
          <h1 className="mt-3 font-display font-bold text-ink tracking-[-0.04em] text-balance text-[clamp(2.75rem,7vw,5rem)] leading-[1.02]">
            Why Your Child Doesn&rsquo;t Need a Score
          </h1>
          <p className="mt-5 font-display italic text-ink text-[clamp(1.25rem,3vw,1.75rem)] leading-snug text-balance">
            A number ranks a child. A note informs a parent.
          </p>
          <p className="mt-5 text-slate text-[15px]">
            <time dateTime="2026-10">October 2026</time> · {READ_TIME} ·{" "}
            <span>By the Unschool Academy content team</span>
          </p>
        </div>
      </Section>

      <Section>
        <article className="max-w-3xl mx-auto">
          <div className="space-y-5 text-slate leading-relaxed text-[17px]">
            <p>
              Imagine two children finish the same counting quest. One taps three mangoes
              confidently. The other tries, uses two hints, gets it wrong once, then gets it
              right, and beams. A score says the first child is &ldquo;better.&rdquo; A parent
              watching knows the second child just did the harder, braver thing.
            </p>
            <p>
              That&rsquo;s why Unschool Kids is built without scores, stars, leaderboards, or
              &ldquo;your child is in the 40th percentile.&rdquo; Numbers like that don&rsquo;t
              describe learning; they describe ranking. Ranking a four-year-old helps nobody.
              It helps the four-year-old least of all.
            </p>
          </div>

          {/* The page's one wow: the actual artifact the argument is about —
              a Parent Hub observation entry, rendered as a light editorial figure.
              Zero JS; labeled illustrative so nothing invents a live feature. */}
          <figure className="my-8 overflow-hidden rounded-2xl border border-border bg-paper">
            <div className="flex items-baseline justify-between gap-4 border-b border-border px-6 py-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-kids-leaf-deep">
                Parent Hub · Observation log
              </p>
              <p className="text-[11px] font-mono text-slate">Momo&rsquo;s mangoes</p>
            </div>
            <ul className="px-6 py-2">
              <li className="flex items-baseline justify-between gap-4 border-b border-border py-3">
                <span className="text-ink font-medium">Practised independently</span>
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-kids-leaf-deep">
                  Observed
                </span>
              </li>
              <li className="flex items-baseline justify-between gap-4 border-b border-border py-3">
                <span className="text-slate">Used a hint</span>
              </li>
              <li className="flex items-baseline justify-between gap-4 border-b border-border py-3">
                <span className="text-slate">Needed a demonstration</span>
              </li>
              <li className="flex items-baseline justify-between gap-4 py-3">
                <span className="text-slate">Transfer observed</span>
              </li>
            </ul>
            <figcaption className="border-t border-border px-6 py-4 text-[13px] italic text-slate">
              Illustrative specimen, not a real child&rsquo;s data. No score, no rank: the
              notebook a good teacher would keep.
            </figcaption>
          </figure>

          <div className="space-y-5 text-slate leading-relaxed text-[17px]">
            <h2 className="text-2xl font-bold text-ink pt-4">What we record instead</h2>
            <p>
              After each quest, the{" "}
              <Link
                href="/parent"
                className="text-kids-leaf-deep font-semibold hover:underline"
              >
                Parent Hub
              </Link>{" "}
              will record plain observations, the kind a good teacher would jot in a notebook:
            </p>
            <ul className="border-t border-border">
              {EVIDENCE.map((item, i) => (
                <li
                  key={item.label}
                  className="flex items-baseline gap-4 border-b border-border py-3"
                >
                  <span className="font-mono text-sm font-bold text-kids-leaf-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink">
                    <strong>{item.label}</strong>: {item.body}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-[15px]">
              The hub is in staged rollout, so treat the four rows above as the vocabulary it
              is being built to speak.
            </p>

            <h2 className="text-2xl font-bold text-ink pt-4">What this changes for you</h2>
            <p>
              Instead of &ldquo;she got 7/10,&rdquo; you see <em>where</em> the struggle lived:
              did she need a hint on the first try and then fly solo? Did the skill transfer to
              the new example, or only work in the familiar one? That tells you what to
              practise together far better than any number. Every quest ends with an off-screen
              activity, so the learning leaves the device.
            </p>
            <p>
              We built it this way on purpose: children should feel proud of effort and curious
              about mistakes. The moment a number starts grading their play, the play stops
              being play.
            </p>
          </div>

          {/* Discovery: real relationships, editorial rows. */}
          <nav aria-label="More to read" className="mt-12">
            <h2 className="text-2xl font-bold text-ink">Keep reading</h2>
            <ul className="mt-4 border-t border-border">
              {KEEP_READING.map((row, i) => (
                <li key={row.href} className="border-b border-border">
                  <Link
                    href={row.href}
                    className="group flex items-baseline gap-4 py-4"
                  >
                    <span className="font-mono text-sm font-bold text-kids-leaf-deep">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-bold text-ink group-hover:underline">
                        {row.title}
                      </span>
                      <span className="block text-[15px] text-slate">{row.sub}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </Section>

      {/* Frictionless close: the parent guide is the honest match for a
          kids/parents post — one close, one destination. */}
      <Section>
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-paper p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-ink">Read the parent guide</h2>
            <p className="mt-2 text-slate text-[16px]">
              Observations, not scores: how the Parent Hub notebook works, and the off-screen
              activity that follows every quest.
            </p>
          </div>
          <Button href="/kids/for-parents" variant="kids" size="lg" className="shrink-0">
            Read the parent guide
          </Button>
        </div>
      </Section>
    </>
  );
}
