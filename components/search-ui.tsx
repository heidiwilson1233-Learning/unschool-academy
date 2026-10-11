"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { SEARCH_INDEX, searchIndex, countResults } from "@/lib/search-index";

/** One-tap entry points (portal move 8): the page is useful before a keystroke. */
const POPULAR: { label: string; href: string }[] = [
  { label: "Free diagnostic", href: "/exams/jft-basic/diagnostic" },
  { label: "Mock tests", href: "/exams/jft-basic/mock-tests" },
  { label: "Free kids quest", href: "/kids/sample/momo-mangoes" },
  { label: "Exam tiers", href: "/exams/tiers" },
  { label: "Pricing", href: "/pricing" },
];

/** Query setters for the zero-results recovery state. */
const TRY_WORDS = ["diagnostic", "mango", "pricing"];

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wrap matched query tokens in <mark> — zero runtime cost, real wayfinding. */
function highlight(text: string, query: string) {
  const tokenSet = new Set(
    query.trim().toLowerCase().split(/[^a-z0-9]+/u).filter((t) => t.length > 1)
  );
  if (tokenSet.size === 0) return text;
  const pattern = new RegExp(
    `(${[...tokenSet].map(escapeRegExp).sort((a, b) => b.length - a.length).join("|")})`,
    "gi"
  );
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    tokenSet.has(part.toLowerCase()) ? (
      <mark key={i} className="bg-academy-teal/15 text-inherit rounded-[3px] px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function SearchUI({ initialQ }: { initialQ: string }) {
  const [q, setQ] = useState(initialQ);
  const inputRef = useRef<HTMLInputElement>(null);
  const searching = q.trim().length >= 2;
  const groups = useMemo(() => (searching ? searchIndex(q) : []), [q, searching]);
  const total = countResults(groups);

  const tryWord = (word: string) => {
    setQ(word);
    inputRef.current?.focus();
  };

  return (
    <div>
      {/* GET form: Enter commits ?q= to the URL — shareable, bookmarkable, back-button-correct, zero JS. */}
      <form action="/search" method="GET" role="search">
        <label htmlFor="search-input" className="sr-only">
          Search Unschool Academy
        </label>
        <div className="relative">
          <Search aria-hidden className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate" />
          <input
            ref={inputRef}
            id="search-input"
            name="q"
            type="search"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pages, exams, topics…"
            className="w-full rounded-2xl border-2 border-border bg-paper py-4 pl-13 pr-5 text-lg text-ink placeholder:text-slate/70 focus:border-academy-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal active:scale-[0.995] transition-transform duration-150 ease-[var(--ease-signature)] motion-reduce:transition-none"
          />
        </div>
      </form>

      {/* Cold-start discovery rail: value before input (portal move 8). */}
      {!searching && (
        <div className="mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate">
            Popular right now
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {POPULAR.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="inline-block rounded-full border border-border bg-paper px-4 py-2 text-[15px] font-semibold text-ink transition-[border-color,transform] duration-150 ease-[var(--ease-signature)] hover:border-academy-teal hover:text-academy-teal-dark active:translate-y-px motion-reduce:transition-none"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate">
            Only live pages are listed here. Exams still in research stay out until
            they are verified and built.
          </p>
        </div>
      )}

      {/* Status line is the ONLY live region — result rows stay silent (WCAG 4.1.3). */}
      {searching && (
        <h2 role="status" className="mt-10 text-sm text-slate">
          {total > 0 ? (
            <>
              <span className="sr-only">Results: </span>
              {total} result{total === 1 ? "" : "s"} for &ldquo;{q.trim()}&rdquo;
            </>
          ) : (
            <>No matches for &ldquo;{q.trim()}&rdquo;</>
          )}
        </h2>
      )}

      {searching && total > 0 && (
        <div className="mt-2">
          {groups.map((g) => (
            <section key={g.section} aria-labelledby={`search-sec-${g.section}`} className="mt-8 first:mt-4">
              <h3
                id={`search-sec-${g.section}`}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate"
              >
                {g.section} · {g.entries.length}
              </h3>
              <ul className="mt-1 border-b border-border">
                {g.entries.map((r) => (
                  <li key={r.href} className="border-t border-border">
                    <Link
                      href={r.href}
                      aria-label={r.title}
                      className="group flex items-center justify-between gap-4 py-4 transition-transform duration-200 ease-[var(--ease-signature)] hover:translate-x-1 motion-reduce:transition-none motion-reduce:hover:translate-x-0"
                    >
                      <span className="min-w-0">
                        <span className="block text-[17px] font-bold text-ink group-hover:text-academy-teal-dark">
                          {highlight(r.title, q)}
                        </span>
                        <span className="mt-0.5 block text-[15px] text-slate">
                          {highlight(r.blurb, q)}
                        </span>
                      </span>
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 text-border transition-[transform,color] duration-200 ease-[var(--ease-signature)] group-hover:translate-x-0.5 group-hover:text-academy-teal motion-reduce:transition-none"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {/* Zero-results recovery: query echo lives in the status line; this card is the path forward. */}
      {searching && total === 0 && (
        <div className="mt-6 rounded-2xl border border-border bg-paper p-6 md:p-8">
          <h3 className="text-lg font-bold text-ink">Try a different word</h3>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-slate">
            Only live pages are listed here. Try a shorter word, or one of these:
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {TRY_WORDS.map((w) => (
              <li key={w}>
                <button
                  type="button"
                  onClick={() => tryWord(w)}
                  className="rounded-full border border-border bg-canvas px-4 py-2 text-[15px] font-semibold text-ink transition-[border-color,transform] duration-150 ease-[var(--ease-signature)] hover:border-academy-teal hover:text-academy-teal-dark active:translate-y-px motion-reduce:transition-none"
                >
                  {w}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[15px] text-slate">
            Still stuck?{" "}
            <Link href="/contact" className="font-semibold text-academy-teal-dark underline underline-offset-4 hover:text-academy-teal">
              Ask the team
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
