"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Badge, EmptyState } from "@/components/ui";
import type { CatalogRow, PublicStatus } from "@/lib/catalog";

/* NOTE: this component receives precomputed CatalogRow[] as RSC props.
   It must never import from "@/lib/catalog" beyond types — the full
   500-entry dataset + validation.json stay server-side (run 42 perf). */

const STATUS_TONES: Record<PublicStatus, "success" | "info" | "neutral" | "warning"> = {
  "practice-ready": "success",
  "verified": "info",
  "retired": "warning",
  research: "neutral",
};

const PAGE_SIZE = 24;

export default function CatalogBrowser({ rows }: { rows: CatalogRow[] }) {
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState<"" | PublicStatus>("");
  const [page, setPage] = useState(1);
  const [, startTransition] = useTransition();

  // Debounce search so filtering (and the live-region count) only runs on settled input.
  useEffect(() => {
    const t = setTimeout(() => {
      startTransition(() => {
        setQuery(queryInput);
        setPage(1);
      });
    }, 150);
    return () => clearTimeout(t);
  }, [queryInput, startTransition]);

  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const r of rows) if (!seen.includes(r.categoryName)) seen.push(r.categoryName);
    return seen;
  }, [rows]);
  const regions = useMemo(() => {
    const seen: string[] = [];
    for (const r of rows) if (!seen.includes(r.region)) seen.push(r.region);
    return seen.sort();
  }, [rows]);
  const kinds = useMemo(() => {
    const seen: string[] = [];
    for (const r of rows) if (!seen.includes(r.kind)) seen.push(r.kind);
    return seen.sort();
  }, [rows]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (category && r.categoryName !== category) return false;
      if (region && r.region !== region) return false;
      if (kind && r.kind !== kind) return false;
      if (status && r.status !== status) return false;
      if (q) {
        const hay = `${r.id} ${r.name} ${r.issuingBody} ${r.examFamily} ${r.categoryName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, query, category, region, kind, status]);

  const clearAll = () => {
    setQueryInput("");
    setQuery("");
    setCategory("");
    setRegion("");
    setKind("");
    setStatus("");
    setPage(1);
  };
  const hasFilters = queryInput || category || region || kind || status;

  // Pagination: keep the DOM light and give "showing X–Y of N" wayfinding.
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const rangeStart = results.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, results.length);

  const gotoPage = (p: number) => {
    startTransition(() => setPage(Math.min(Math.max(1, p), totalPages)));
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document
      .getElementById("catalog-results")
      ?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
    // Move focus to the results so keyboard/screen-reader users land with the new list.
    document.getElementById("catalog-results-heading")?.focus({ preventScroll: true });
  };

  // Windowed page numbers: 1 … current±2 … last
  const pageNumbers = (): (number | "…")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const out: (number | "…")[] = [1];
    const lo = Math.max(2, safePage - 2);
    const hi = Math.min(totalPages - 1, safePage + 2);
    if (lo > 2) out.push("…");
    for (let i = lo; i <= hi; i++) out.push(i);
    if (hi < totalPages - 1) out.push("…");
    out.push(totalPages);
    return out;
  };

  const selectCls =
    "w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-academy-blue/40";

  return (
    <div>
      <h2 className="sr-only">Search and filter the catalog</h2>
      {/* Search + filters — pinned to the page like an index card from the studio pinboard (A13 craft pass). */}
      <div className="craft-paper-card p-4 sm:p-5 shadow-sm">
        <span
          aria-hidden="true"
          className="washi-tape -top-3.5 left-8"
          style={{ ["--tape" as string]: "rgba(20,125,117,0.5)", transform: "rotate(-4deg)" }}
        />
        <label htmlFor="catalog-search" className="sr-only">
          Search by exam name, ID (EX-299), or issuer
        </label>
        <input
          id="catalog-search"
          type="search"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="Search by exam name, ID (EX-299), issuer…"
          className="w-full rounded-xl border border-border bg-canvas px-4 py-3 text-[15px] text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-academy-blue/40"
        />
        <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <select aria-label="Filter by category" className={selectCls} value={category} onChange={(e) => startTransition(() => { setCategory(e.target.value); setPage(1); })}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select aria-label="Filter by region" className={selectCls} value={region} onChange={(e) => startTransition(() => { setRegion(e.target.value); setPage(1); })}>
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select aria-label="Filter by track type" className={selectCls} value={kind} onChange={(e) => startTransition(() => { setKind(e.target.value); setPage(1); })}>
            <option value="">All track types</option>
            {kinds.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            className={selectCls}
            value={status}
            onChange={(e) => startTransition(() => { setStatus(e.target.value as "" | PublicStatus); setPage(1); })}
          >
            <option value="">All statuses</option>
            <option value="practice-ready">Practice available</option>
            <option value="verified">Facts verified</option>
            <option value="retired">Retired / renamed</option>
            <option value="research">Research entry</option>
          </select>
        </div>
      </div>

      {/* Result count — the ledger line: mono counts, hand-written tip (decorative duplicate of the search label). */}
      <div className="mt-6 flex items-center justify-between gap-3" id="catalog-results">
        <h2 id="catalog-results-heading" tabIndex={-1} className="sr-only outline-none">
          Results
        </h2>
        <p className="text-sm text-slate" role="status" aria-live="polite">
          Showing <strong className="text-ink">{rangeStart}–{rangeEnd}</strong> of{" "}
          <strong className="text-ink">{results.length}</strong> entries
        </p>
        <p aria-hidden="true" className="font-hand text-[15px] text-academy-teal hidden sm:block -rotate-2 select-none">
          tip: every ID is searchable — try EX-299
        </p>
        {hasFilters && (
          <button onClick={clearAll} className="text-sm text-academy-blue font-semibold hover:underline">
            Clear all filters
          </button>
        )}
      </div>

      {/* Results: ledger rows on warm paper — index chips, craft hover, and the
          one practice-ready entry carries a teal ledger tab. Status badges and
          all labels are the truthful ones from lib/catalog (never rewritten). */}
      {results.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No entries match those filters"
            body={
              <>
                Try fewer filters, or a shorter search term. Every entry is found by name,
                ID, issuer, or category. Or skip the catalog — the one program with real
                practice is ready now:{" "}
                <Link href="/exams/jft-basic/diagnostic" className="font-semibold text-academy-blue hover:underline">
                  take the free JFT-Basic diagnostic
                </Link>
                .
              </>
            }
            action={
              <button onClick={clearAll} className="text-academy-blue font-semibold hover:underline">
                Clear all filters <span aria-hidden="true">→</span>
              </button>
            }
          />
        </div>
      ) : (
        <>
          <ul className="mt-4 divide-y divide-border border-y border-border" aria-label="Catalog entries">
            {pageItems.map((r) => (
              <li key={r.id}>
                <Link
                  href={r.href}
                  aria-label={`${r.name}, ${r.statusLabel}`}
                  className="group relative flex flex-wrap items-center gap-x-3 gap-y-1.5 px-2 sm:px-3 py-3.5 transition-colors hover:bg-[#fdf8ec] active:bg-[#f8f1de] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-academy-blue/50"
                >
                  {/* Ledger tab on the single live program — decorative; the badge says what it is. */}
                  {r.status === "practice-ready" && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-full bg-academy-teal/80"
                    />
                  )}
                  {/* Stamped index chip: the catalog ID, warm paper. */}
                  <span
                    aria-hidden="true"
                    className="shrink-0 rounded-md border border-[#e2d7ba] bg-[#f8f1de] px-1.5 py-0.5 font-mono text-[11px] font-bold tracking-wide text-[#8a6f4d]"
                  >
                    {r.id}
                  </span>
                  <span className="min-w-0 flex-1 basis-44">
                    <span className="block font-bold text-ink leading-snug group-hover:text-academy-blue transition-colors">
                      {r.name}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-slate">
                      {r.issuingBody}
                      {r.issuingBody !== r.examFamily ? ` · ${r.examFamily}` : ""}
                      <span className="sm:hidden"> · {r.kind}</span>
                    </span>
                  </span>
                  <span className="hidden sm:block shrink-0 text-xs font-semibold text-slate">
                    {r.kind}
                  </span>
                  <span className="ml-auto sm:ml-0">
                    <Badge tone={STATUS_TONES[r.status]}>{r.statusLabel}</Badge>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <nav aria-label="Catalog pages" className="mt-8 flex items-center justify-center gap-1.5 flex-wrap">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => gotoPage(safePage - 1)}
                aria-label="Previous page"
                className="min-w-10 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-ink hover:border-academy-blue hover:text-academy-blue transition-colors disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink"
              >
                ← Prev
              </button>
              {pageNumbers().map((p, i) =>
                p === "…" ? (
                  <span key={`e${i}`} aria-hidden className="px-1 text-sm text-slate">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => gotoPage(p)}
                    aria-label={`Page ${p}`}
                    aria-current={p === safePage ? "page" : undefined}
                    className={`min-w-10 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                      p === safePage
                        ? "border-academy-blue bg-academy-blue text-white"
                        : "border-border bg-white text-ink hover:border-academy-blue hover:text-academy-blue"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => gotoPage(safePage + 1)}
                aria-label="Next page"
                className="min-w-10 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-ink hover:border-academy-blue hover:text-academy-blue transition-colors disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink"
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
