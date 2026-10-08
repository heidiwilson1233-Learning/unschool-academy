"use client";

import { useMemo, useState } from "react";
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

const STATUS_TONES: Record<PublicStatus, "success" | "info" | "neutral"> = {
  "practice-ready": "success",
  "verified": "info",
  research: "neutral",
};

export default function CatalogBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState<"" | PublicStatus>("");

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
    setQuery("");
    setCategory("");
    setRegion("");
    setKind("");
    setStatus("");
  };
  const hasFilters = query || category || region || kind || status;

  const selectCls =
    "w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-academy-blue/40";

  return (
    <div>
      {/* Search + filters */}
      <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-sm">
        <label htmlFor="catalog-search" className="sr-only">
          Search the exam catalog
        </label>
        <input
          id="catalog-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by exam name, ID (EX-299), issuer…"
          className="w-full rounded-xl border border-border bg-canvas px-4 py-3 text-[15px] text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-academy-blue/40"
        />
        <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <select aria-label="Filter by category" className={selectCls} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select aria-label="Filter by region" className={selectCls} value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select aria-label="Filter by track type" className={selectCls} value={kind} onChange={(e) => setKind(e.target.value)}>
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
            onChange={(e) => setStatus(e.target.value as "" | PublicStatus)}
          >
            <option value="">Any status</option>
            <option value="practice-ready">Practice available</option>
            <option value="verified">Facts verified</option>
            <option value="research">Research entry</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-slate" role="status" aria-live="polite">
          <strong className="text-ink">{results.length}</strong> of {exams.length} research entries
          {hasFilters && (
            <button onClick={clearAll} className="ml-3 text-academy-blue font-semibold hover:underline">
              Clear filters
            </button>
          )}
        </p>
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
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((e) => {
            const st = getPublicStatus(e);
            const cat = getCategoryByName(e.category);
            return (
              <a key={e.id} href={examUrl(e.id)} className="group">
                <Card hover className="h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-slate/70">{e.id}</span>
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
      )}
    </div>
  );
}
