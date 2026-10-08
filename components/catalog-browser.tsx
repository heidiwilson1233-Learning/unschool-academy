"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Card, Badge, EmptyState } from "@/components/ui";
import {
  getAllExams,
  getCategories,
  getRegions,
  getKinds,
  getPublicStatus,
  statusLabel,
  kindLabel,
  examUrl,
  getCategoryByName,
  type PublicStatus,
} from "@/lib/catalog";

const STATUS_TONES: Record<PublicStatus, "success" | "info" | "neutral" | "warning"> = {
  "practice-ready": "success",
  "verified": "info",
  "retired": "warning",
  research: "neutral",
};

const PAGE_SIZE = 24;

export default function CatalogBrowser() {
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

  const exams = useMemo(() => getAllExams(), []);
  const categories = useMemo(() => getCategories(), []);
  const regions = useMemo(() => getRegions(), []);
  const kinds = useMemo(() => getKinds(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exams.filter((e) => {
      if (category && e.category !== category) return false;
      if (region && e.region !== region) return false;
      if (kind && e.kind !== kind) return false;
      if (status && getPublicStatus(e) !== status) return false;
      if (q) {
        const hay = `${e.id} ${e.exam_or_track} ${e.issuing_body} ${e.exam_family} ${e.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [exams, query, category, region, kind, status]);

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
    document.getElementById("catalog-results")?.scrollIntoView({ block: "start", behavior: "smooth" });
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
      {/* Search + filters */}
      <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-sm">
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
                {kindLabel(k)}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            className={selectCls}
            value={status}
            onChange={(e) => startTransition(() => { setStatus(e.target.value as "" | PublicStatus); setPage(1); })}
          >
            <option value="">Any status</option>
            <option value="practice-ready">Practice available</option>
            <option value="verified">Facts verified</option>
            <option value="retired">Retired / renamed</option>
            <option value="research">Research entry</option>
          </select>
        </div>
      </div>

      <h2 className="sr-only">Results</h2>

      {/* Result count */}
      <div className="mt-6 flex items-center justify-between" id="catalog-results">
        <p className="text-sm text-slate" role="status" aria-live="polite">
          Showing <strong className="text-ink">{rangeStart}–{rangeEnd}</strong> of{" "}
          <strong className="text-ink">{results.length}</strong> entries
        </p>
        {hasFilters && (
          <button onClick={clearAll} className="text-sm text-academy-blue font-semibold hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No entries match"
            body="Try a shorter search term or clear a filter. Every entry is found by name, ID, issuer or category."
            action={
              <button onClick={clearAll} className="text-academy-blue font-semibold hover:underline">
                Clear all filters →
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageItems.map((e) => {
              const st = getPublicStatus(e);
              const cat = getCategoryByName(e.category);
              return (
                <a key={e.id} href={examUrl(e.id)} className="group">
                  <Card hover className="h-full flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-slate">{e.id}</span>
                      <Badge tone={STATUS_TONES[st]}>{statusLabel(st)}</Badge>
                    </div>
                  <h3 className="mt-2 font-bold text-ink leading-snug group-hover:text-academy-blue transition-colors">
                    {e.exam_or_track}
                  </h3>
                  <p className="mt-1 text-sm text-slate">
                    {e.issuing_body}
                    {e.issuing_body !== e.exam_family ? ` · ${e.exam_family}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-academy-blue/10 text-academy-blue font-semibold">
                      {cat?.name ?? e.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate/10 text-slate font-semibold">{e.region}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate/10 text-slate font-semibold">{kindLabel(e.kind)}</span>
                  </div>
                </Card>
              </a>
            );
          })}
          </div>
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
