"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, ArrowUpRight } from "lucide-react";
import { FAQAccordion, EmptyState, Button } from "@/components/ui";
import { TABS, TAB_SLUGS, FAQS, type FaqTab, type FaqItem } from "@/app/faq/data";

type Hit = { tab: FaqTab; index: number; item: FaqItem };

const slugToTab = Object.fromEntries(TABS.map((t) => [TAB_SLUGS[t], t])) as Record<string, FaqTab>;

export function FaqInteractive() {
  const [tab, setTab] = useState<FaqTab>("Exams");
  const [query, setQuery] = useState("");
  // undefined = uncontrolled (first item open by default, reset per tab via key);
  // a number = controlled, set when a search result jumps to a specific answer.
  const [jumpOpen, setJumpOpen] = useState<number | null | undefined>(undefined);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Deep-link: #exams / #kids / #payments / #policies on first load
  useEffect(() => {
    const h = window.location.hash.replace("#", "").toLowerCase();
    if (h in slugToTab) setTab(slugToTab[h]);
  }, []);

  const selectTab = (t: FaqTab, focusTab = false) => {
    setTab(t);
    setJumpOpen(undefined);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${TAB_SLUGS[t]}`);
    }
    if (focusTab) tabRefs.current[TABS.indexOf(t)]?.focus();
  };

  const onTabKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next !== null) {
      e.preventDefault();
      selectTab(TABS[next], true);
    }
  };

  const hits: Hit[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: Hit[] = [];
    for (const t of TABS) {
      FAQS[t].forEach((item, index) => {
        if (item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)) {
          out.push({ tab: t, index, item });
        }
      });
    }
    return out;
  }, [query]);
  const searching = query.trim().length >= 2;

  const jumpToHit = (hit: Hit) => {
    setQuery("");
    setTab(hit.tab);
    setJumpOpen(hit.index);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${TAB_SLUGS[hit.tab]}`);
    }
    // Let React paint the new panel before scrolling.
    requestAnimationFrame(() => {
      document
        .getElementById(`faq-${TAB_SLUGS[hit.tab]}-item-${hit.index}`)
        ?.scrollIntoView({ block: "nearest" });
    });
  };

  const total = TABS.reduce((n, t) => n + FAQS[t].length, 0);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Search — plain string matching, 14 questions: no library, no debounce needed */}
      <div role="search" className="relative mb-10">
        <label htmlFor="faq-search" className="sr-only">
          Search all {total} answers
        </label>
        <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />
        <input
          ref={inputRef}
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setQuery("");
          }}
          placeholder={`Search all ${total} answers — try "refund" or "ads"`}
          className="w-full rounded-2xl border border-border bg-paper pl-12 pr-11 py-4 text-[16px] text-ink placeholder:text-slate/70 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal active:scale-[0.995] transition-transform duration-200 ease-[var(--ease-signature)]"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-slate hover:text-ink hover:bg-canvas active:scale-90 transition-[color,background-color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-academy-teal"
          >
            <X aria-hidden className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search results (cross-tab) */}
      {searching ? (
        <div>
          <p className="text-sm text-slate mb-6" role="status">
            <strong className="text-ink">{hits.length}</strong> {hits.length === 1 ? "answer" : "answers"}
            {" "}for “{query.trim()}”
          </p>
          {hits.length > 0 ? (
            <ul className="divide-y divide-border border-y border-border">
              {hits.map((hit) => (
                <li key={`${hit.tab}-${hit.index}`}>
                  <button
                    type="button"
                    onClick={() => jumpToHit(hit)}
                    className="w-full flex items-start justify-between gap-4 py-5 text-left group active:scale-[0.995] transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal rounded-lg"
                  >
                    <span>
                      <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-academy-teal-dark mb-1.5">
                        {hit.tab}
                      </span>
                      <span className="font-semibold text-ink text-base md:text-lg group-hover:text-academy-blue transition-colors duration-150">
                        {hit.item.q}
                      </span>
                    </span>
                    <ArrowUpRight aria-hidden className="shrink-0 mt-1 w-5 h-5 text-slate group-hover:text-academy-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[color,transform] duration-150" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No answers match that search"
              body={
                <>
                  Try different words, or ask us directly — a human replies within 2 business days.
                </>
              }
              action={
                <Button variant="primary" href="/contact">
                  Contact us
                </Button>
              }
            />
          )}
        </div>
      ) : (
        <>
          {/* Editorial tab rail: mono numerals + counts, hairline active underline */}
          <div
            role="tablist"
            aria-label="FAQ categories"
            className="flex gap-1 md:gap-2 border-b border-border mb-10 overflow-x-auto"
          >
            {TABS.map((t, i) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`faq-tab-${TAB_SLUGS[t]}`}
                  aria-selected={active}
                  aria-controls={`faq-panel-${TAB_SLUGS[t]}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectTab(t)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={`relative shrink-0 flex items-baseline gap-2 px-4 md:px-5 py-3.5 font-semibold text-[15px] md:text-base whitespace-nowrap active:scale-[0.98] transition-[color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal ${
                    active ? "text-ink" : "text-slate hover:text-ink"
                  }`}
                >
                  <span aria-hidden className="font-mono text-[11px] text-slate/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t}
                  <span className="font-mono text-[11px] text-slate/70" aria-hidden>
                    {FAQS[t].length}
                  </span>
                  <span
                    aria-hidden
                    className={`absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-academy-teal origin-left transition-transform duration-300 ease-[var(--ease-signature)] ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Panel — heading comes from the tab itself via aria-labelledby */}
          <div
            role="tabpanel"
            id={`faq-panel-${TAB_SLUGS[tab]}`}
            aria-labelledby={`faq-tab-${TAB_SLUGS[tab]}`}
          >
            <FAQAccordion
              key={TAB_SLUGS[tab]}
              idPrefix={`faq-${TAB_SLUGS[tab]}`}
              items={FAQS[tab]}
              open={jumpOpen}
              onOpenChange={setJumpOpen}
            />
          </div>
        </>
      )}

    </div>
  );
}
