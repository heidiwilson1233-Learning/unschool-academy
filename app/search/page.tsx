import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/ui";
import SearchUI from "@/components/search-ui";
import { SEARCH_INDEX } from "@/lib/search-index";

/**
 * Utility page, not content: noindex (run-27 convention). follow:true is a
 * deliberate exception here (run 62) — the page's only SEO value is as a
 * link hub to real indexable content. Title + robots only, no canonical/OG/JSON-LD.
 */
export const metadata: Metadata = {
  title: "Search",
  description:
    "Search published Unschool Academy pages — only verified, live content appears here.",
  robots: { index: false, follow: true },
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/** Reads the query under Suspense — the cacheComponents-safe way to use searchParams. */
async function SearchFromParams({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <SearchUI initialQ={typeof q === "string" ? q : ""} />;
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {

  return (
    <>
      {/* Authored hero (server-rendered): type-as-hero, grain + ambient glows, no gradient hero */}
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
              "radial-gradient(42rem 20rem at 18% 0%, rgba(45,127,158,0.14), transparent 70%), radial-gradient(36rem 18rem at 88% 30%, rgba(47,111,181,0.10), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-12 md:pb-16">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal mb-4">
            Search · {SEARCH_INDEX.length} published pages
          </p>
          <h1
            className="font-display text-ink text-balance"
            style={{
              fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            Find your way around the academy.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate leading-relaxed">
            Everything below is a page you can open right now. Exams still in
            research stay out until they are verified and built.
          </p>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Suspense fallback={<SearchUI initialQ="" />}>
              <SearchFromParams searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
