import type { Metadata } from "next";
import Link from "next/link";
import { Section, Badge, Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Blog — Notes from the content team",
  description:
    "Original articles from the Unschool Academy content team: Japanese learning guides and honest notes on how we build.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Notes from the content team",
    description:
      "Original pieces from the Unschool Academy content team — each one reviewed before publication.",
    type: "website",
    url: "/blog",
  },
  twitter: {
    card: "summary",
    title: "Blog — Notes from the content team",
    description: "Original pieces, reviewed before publication.",
  },
};

/* Inline SVG grain (light surfaces only) — same recipe as sibling pages. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const TRAIL = [{ label: "Home", href: "/" }, { label: "Blog" }];

/* Month-level dates only — no exact-day fabrication. Read times computed from
   the actual post files' word counts (see run-25 notes), never hand-written. */
const POSTS: {
  slug: string;
  badge: string;
  title: string;
  excerptText: string;
  excerpt: React.ReactNode;
  readTime: string;
}[] = [
  {
    slug: "why-no-percentiles",
    badge: "How we build",
    title: "Why We Don't Do Percentiles",
    excerptText:
      "A practice score of “top 12%” sounds impressive and means nothing. Here's what honest scoring looks like instead.",
    excerpt: (
      <>
        A practice score of “top 12%” sounds impressive and means nothing. Here’s
        what honest scoring looks like instead.
      </>
    ),
    readTime: "1 min read",
  },
  {
    slug: "station-kanji",
    badge: "Japanese learning",
    title: "4 Station Kanji That Make Any Japanese Station Readable",
    excerptText:
      "出口, 入口, 改札, 乗換: learn these four as pairs and any Japanese station starts reading itself to you.",
    excerpt: (
      <>
        <span lang="ja" className="jp">
          出口
        </span>
        ,{" "}
        <span lang="ja" className="jp">
          入口
        </span>
        ,{" "}
        <span lang="ja" className="jp">
          改札
        </span>
        ,{" "}
        <span lang="ja" className="jp">
          乗換
        </span>
        : learn these four as pairs and any Japanese station starts reading
        itself to you.
      </>
    ),
    readTime: "2 min read",
  },
  {
    slug: "jft-listening-two-plays",
    badge: "Japanese learning",
    title: "The Two Plays You Get: How JFT Listening Actually Works",
    excerptText:
      "Two plays, no going back. How to split the work: the situation on play one, the turn on play two.",
    excerpt: (
      <>
        Two plays, no going back. How to split the work: the situation on play
        one, the turn on play two.
      </>
    ),
    readTime: "2 min read",
  },
  {
    slug: "draft-pending-review",
    badge: "How we build",
    title: "What “draft pending review” actually means",
    excerptText:
      "The five stages every question travels — and why we label drafts openly instead of hiding them.",
    excerpt: (
      <>
        The five stages every question travels — and why we label drafts openly
        instead of hiding them.
      </>
    ),
    readTime: "3 min read",
  },
  {
    slug: "why-no-scores-kids",
    badge: "For parents",
    title: "Why Your Child Doesn't Need a Score",
    excerptText:
      "Scores rank children; evidence informs parents. What we record instead of a number.",
    excerpt: (
      <>
        Scores rank children; evidence informs parents. What we record instead
        of a number.
      </>
    ),
    readTime: "2 min read",
  },
];

const [LEAD, ...REST] = POSTS;

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://unschool.academy/blog" },
  ],
};

/* Honest schema: 5 real posts, real slugs, month-level dates (ISO-8601 allows
   year-month; no exact days invented), author = the organisation, never a
   fabricated person. Blog/BlogPosting buys semantic understanding, not a
   rich-result promise. */
const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Unschool Academy Blog",
  url: "https://unschool.academy/blog",
  publisher: {
    "@type": "Organization",
    name: "Unschool Academy",
    url: "https://unschool.academy",
  },
  blogPost: POSTS.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerptText,
    url: `https://unschool.academy/blog/${p.slug}`,
    datePublished: "2026-10",
    author: {
      "@type": "Organization",
      name: "Unschool Academy",
      url: "https://unschool.academy",
    },
  })),
};

/* Single shared link style: accessible name = the post title; the arrow is
   decorative (aria-hidden), not a second "Read article →" announcement. */
function TitleLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group/link rounded-sm outline-none transition-colors duration-200 ease-[var(--ease-signature)] hover:text-academy-blue focus-visible:ring-2 focus-visible:ring-academy-teal focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      {children}{" "}
      <span
        aria-hidden="true"
        className="inline-block translate-x-0 text-academy-teal transition-transform duration-200 ease-[var(--ease-signature)] group-hover/link:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}

export default function BlogPage() {
  return (
    <>
      {/* Authored editorial masthead (server-rendered): type-as-hero, grain +
          ambient glows, breadcrumbs above the h1 per house convention. */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: GRAIN,
            opacity: 0.16,
            mixBlendMode: "multiply",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(42rem 22rem at 12% -8%, rgba(20,125,117,0.10), transparent 60%), radial-gradient(36rem 20rem at 88% 12%, rgba(49,91,135,0.10), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pt-14 md:pb-16">
          <Breadcrumbs trail={TRAIL} />
          <div className="mt-8 grid gap-10 lg:grid-cols-6 lg:items-center">
            <div className="lg:col-span-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-academy-teal">
                Blog — original editorial
              </p>
              <h1 className="font-display mt-4 text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] tracking-[-0.02em] text-ink text-balance">
                Notes from the content team.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate leading-relaxed">
                Original pieces from the Unschool Academy content team — each
                one reviewed before publication.
              </p>
            </div>
            {/* MD conversion action: the blog's primary action is "Try practice." */}
            <div className="lg:col-span-2 lg:border-l lg:border-border lg:pl-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
                From the articles
              </p>
              <p className="font-display mt-3 text-xl leading-snug text-ink">
                Read about honest scoring — then see it in your own results.
              </p>
              <Link
                href="/free-practice"
                className="mt-5 inline-block rounded-md bg-academy-blue px-5 py-3 font-semibold text-white transition-transform duration-150 ease-[var(--ease-signature)] hover:bg-academy-blue-dark active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academy-teal focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                Try practice <span aria-hidden="true">→</span>
              </Link>
              <p className="mt-3 text-sm text-slate">Free sampler, on the page.</p>
            </div>
          </div>
        </div>
      </div>

      <Section aria-labelledby="blog-list-heading">
        <h2 id="blog-list-heading" className="sr-only">
          All articles
        </h2>

        {/* Lead cell: the brand-thesis piece, editorial weight. */}
        <article
          aria-labelledby="blog-lead-title"
          className="faq-reveal border-b border-border pb-10 md:pb-12"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-academy-teal">
              01
            </span>
            <Badge tone="info">{LEAD.badge}</Badge>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
              <time dateTime="2026-10">October 2026</time> · {LEAD.readTime}
            </span>
          </div>
          <h3
            id="blog-lead-title"
            className="font-display mt-4 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-ink text-balance"
          >
            <TitleLink href={`/blog/${LEAD.slug}`}>{LEAD.title}</TitleLink>
          </h3>
          <p className="mt-4 max-w-2xl text-lg text-slate leading-relaxed">
            {LEAD.excerpt}
          </p>
          <p className="mt-4 text-sm text-slate">
            By the Unschool Academy content team
          </p>
          <p className="mt-6">
            <Link
              href={`/blog/${LEAD.slug}`}
              aria-hidden="true"
              tabIndex={-1}
              className="inline-flex items-center gap-2 rounded-md border border-academy-blue/30 px-4 py-2 font-semibold text-academy-blue transition-colors duration-200 ease-[var(--ease-signature)] hover:bg-academy-blue/5 focus-visible:outline-none"
            >
              Read the piece <span aria-hidden="true">→</span>
            </Link>
          </p>
        </article>

        {/* Date-led archive: hairline-ruled numbered rows, not identical cards. */}
        <ul>
          {REST.map((p, i) => (
            <li
              key={p.slug}
              className="faq-reveal border-b border-border"
              style={{ animationDelay: `${[52, 104, 156, 208][i] ?? 208}ms` }}
            >
              <article
                aria-labelledby={`blog-post-${p.slug}`}
                className="grid gap-3 py-7 md:grid-cols-12 md:py-8"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate md:col-span-1 md:pt-1.5">
                  0{i + 2}
                </p>
                <div className="md:col-span-11">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-academy-teal">
                      {p.badge}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
                      <time dateTime="2026-10">October 2026</time> · {p.readTime}
                    </span>
                  </div>
                  <h3
                    id={`blog-post-${p.slug}`}
                    className="font-display mt-2 text-2xl leading-snug text-ink text-balance md:text-[1.7rem]"
                  >
                    <TitleLink href={`/blog/${p.slug}`}>{p.title}</TitleLink>
                  </h3>
                  <p className="mt-2 max-w-3xl text-slate leading-relaxed">
                    {p.excerpt}
                  </p>
                  <p className="mt-2 text-sm text-slate">
                    By the Unschool Academy content team
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
    </>
  );
}
