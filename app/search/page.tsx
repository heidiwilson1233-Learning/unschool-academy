"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Section, Card, Breadcrumbs, PageHero } from "@/components/ui";

/** Searchable index: ONLY published public pages. Research-catalogue exams never appear here. */
const INDEX: { title: string; href: string; section: string; keywords: string }[] = [
  { title: "JFT-Basic practice", href: "/exams/jft-basic", section: "Exams", keywords: "jft basic japanese test everyday japan foundation practice" },
  { title: "Free JFT-Basic diagnostic", href: "/exams/jft-basic/diagnostic", section: "Exams", keywords: "free diagnostic 10 questions quiz score topics" },
  { title: "Practice by topic", href: "/exams/jft-basic/topics", section: "Exams", keywords: "practice topic vocabulary conversation listening reading signs hints" },
  { title: "Timed mock tests", href: "/exams/jft-basic/mock-tests", section: "Exams", keywords: "mock test timed exam simulation 30 minutes" },
  { title: "My exam progress", href: "/app/exams", section: "Exams", keywords: "progress dashboard history study plan sessions" },
  { title: "Japanese learning hub — JFT vs JLPT", href: "/exams/japanese", section: "Exams", keywords: "jlpt n5 n4 japanese qualification comparison" },
  { title: "How practice works", href: "/exams/how-practice-works", section: "Exams", keywords: "method scoring mock practice pedagogy" },
  { title: "Published exams", href: "/exams", section: "Exams", keywords: "catalog exam list programs" },
  { title: "Kids overview", href: "/kids", section: "Kids", keywords: "children kids learning world ages" },
      { title: "School Starters · Ages 5–6", href: "/kids/tracks/school-starters", section: "Kids", keywords: "school starters 5 6 smart learning" },
  { title: "Adventure Club · Grades 1–2", href: "/kids/tracks/adventure-club", section: "Kids", keywords: "grade 1 2 adventure club reading maths" },
  { title: "Quest Makers · Grades 3–4", href: "/kids/tracks/quest-makers", section: "Kids", keywords: "grade 3 4 quest makers fractions" },
  { title: "Young Explorers · Grade 5", href: "/kids/tracks/young-explorers", section: "Kids", keywords: "grade 5 young explorers decimals volume" },
  { title: "Kids Book Library · 500 Books", href: "/kids/library", section: "Kids", keywords: "books library stories reading 500" },
  { title: "Kids Subjects · Words Numbers World Values Create", href: "/kids", section: "Kids", keywords: "subjects words numbers world values create" },
  { title: "Meet Momo, Tara & Bobo", href: "/kids/characters", section: "Kids", keywords: "characters momo tara bobo elephant squirrel tortoise" },
  { title: "Explore the village", href: "/kids/world", section: "Kids", keywords: "village world locations mango garden story tree pond" },
  { title: "For parents", href: "/kids/for-parents", section: "Kids", keywords: "parents safety privacy controls" },
  { title: "Kids family pricing", href: "/kids/pricing", section: "Kids", keywords: "kids pricing family plan cost" },
  { title: "Free quest — Momo's three mangoes", href: "/kids/sample/momo-mangoes", section: "Kids", keywords: "free quest sample mango counting playable" },
  { title: "Free quest — Tara's four-card story", href: "/kids/sample/tara-story", section: "Kids", keywords: "free quest sample tara story order cards playable" },
  { title: "Parent Hub", href: "/parent", section: "Kids", keywords: "parent hub dashboard controls profiles billing" },
  { title: "How it works", href: "/how-it-works", section: "Company", keywords: "how it works method loop" },
  { title: "Free practice", href: "/free-practice", section: "Company", keywords: "free practice sampler" },
  { title: "Pricing", href: "/pricing", section: "Company", keywords: "pricing plans cost pass" },
  { title: "Resources", href: "/resources", section: "Company", keywords: "resources guides kanji vocabulary listening" },
  { title: "FAQ", href: "/faq", section: "Company", keywords: "faq questions help" },
  { title: "Contact", href: "/contact", section: "Company", keywords: "contact support help ticket" },
  { title: "About", href: "/about", section: "Company", keywords: "about method review standards team" },
];

function SearchUI() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    return INDEX.filter((e) =>
      `${e.title} ${e.section} ${e.keywords}`.toLowerCase().includes(query)
    );
  }, [q]);

  return (
    <>
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="flex gap-3 max-w-2xl"
      >
        <label htmlFor="search-input" className="sr-only">Search Unschool Academy</label>
        <input
          id="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “diagnostic”, “mango”, “pricing”…"
          className="flex-1 rounded-xl border border-border px-4 py-3 text-base focus:border-academy-blue bg-paper"
        />
      </form>

      <div className="mt-8" aria-live="polite">
        {q.trim().length >= 2 && results.length === 0 && (
          <Card>
            <h2 className="font-bold text-ink text-lg">No published results for “{q.trim()}”</h2>
            <p className="text-slate mt-2 text-[15px]">
              Search covers only our published pages. Exam programs still in research don&apos;t
              appear here until they&apos;re verified and built. Try “diagnostic”, “kids”, or “pricing”.
            </p>
          </Card>
        )}
        {results.length > 0 && (
          <>
            <p className="text-sm text-slate mb-4">{results.length} result{results.length === 1 ? "" : "s"}</p>
            <div className="space-y-3">
              {results.map((r) => (
                <Link key={r.href} href={r.href}>
                  <Card hover className="!p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-academy-teal">{r.section}</p>
                    <p className="font-bold text-ink text-lg mt-1 hover:text-academy-blue">{r.title}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <>
      <PageHero eyebrow="Search" title="Search published content" sub="Only verified, live pages appear here — never research-stage exams." />
      <Section>
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          <Suspense fallback={<p className="text-slate">Loading search…</p>}>
            <SearchUI />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
