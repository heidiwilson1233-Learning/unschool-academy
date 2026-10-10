"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AnswerMeta, SkillGroup } from "@/lib/answers";

type Attempt = { misses?: string[] };

function norm(s: string) {
  return s.toLowerCase();
}

function matches(m: AnswerMeta, q: string) {
  const needle = norm(q.trim());
  if (!needle) return true;
  return (
    norm(m.stem).includes(needle) ||
    norm(m.skillLabel).includes(needle) ||
    norm(m.topic).includes(needle) ||
    norm(m.id).includes(needle)
  );
}

/** Bento tile: the learner's miss-cluster, from this device's attempts. */
function WeakestSkillTile({ meta }: { meta: AnswerMeta[] }) {
  const [top, setTop] = useState<{ skill: string; skillLabel: string; n: number } | null>(null);

  useEffect(() => {
    try {
      const attempts: Attempt[] = JSON.parse(localStorage.getItem("ua-attempts") ?? "[]");
      const bySkill = new Map<string, { skillLabel: string; n: number }>();
      const metaById = new Map(meta.map((m) => [m.id, m]));
      for (const a of attempts) {
        for (const id of a.misses ?? []) {
          const m = metaById.get(id);
          if (!m) continue;
          const g = bySkill.get(m.skill) ?? { skillLabel: m.skillLabel, n: 0 };
          g.n += 1;
          bySkill.set(m.skill, g);
        }
      }
      let best: { skill: string; skillLabel: string; n: number } | null = null;
      for (const [skill, g] of bySkill) {
        if (!best || g.n > best.n) best = { skill, skillLabel: g.skillLabel, n: g.n };
      }
      setTop(best && best.n > 0 ? best : null);
    } catch {
      setTop(null);
    }
  }, [meta]);

  if (!top) return null;
  return (
    <div className="border border-academy-teal/30 bg-academy-teal/5 rounded-2xl p-6 md:p-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-academy-teal-dark font-mono">
        Start here: your misses
      </p>
      <p className="mt-2 text-lg font-bold text-ink">
        Your misses cluster in {top.skillLabel}.
        <span className="text-slate font-semibold"> {top.n} waiting for a second look.</span>
      </p>
      <Link
        href={`#skill-${top.skill}`}
        className="mt-3 inline-flex items-center gap-1 font-semibold text-academy-blue hover:underline"
      >
        Browse their explanations <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

function Row({ m }: { m: AnswerMeta }) {
  return (
    <li>
      <Link
        href={`/exams/jft-basic/answers/${m.id}`}
        aria-label={`${m.stem} — explanation`}
        className="group flex items-baseline gap-4 py-4 px-2 -mx-2 rounded-lg transition-colors duration-200 ease-signature hover:bg-paper active:scale-[0.998]"
      >
        <span className="flex-1 min-w-0 text-[15px] md:text-base text-ink leading-relaxed">
          <span className="group-hover:underline underline-offset-4">{m.stem}</span>
        </span>
        <span className="shrink-0 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] font-mono">
          <span className="text-amber-800">Draft</span>
          <span className="text-slate">{m.id}</span>
        </span>
      </Link>
    </li>
  );
}

export function AnswersIndexClient({
  meta,
  skills,
  total,
}: {
  meta: AnswerMeta[];
  skills: SkillGroup[];
  total: number;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => meta.filter((m) => matches(m, query)), [meta, query]);
  const searching = query.trim().length > 0;

  return (
    <>
      <div className="grid grid-cols-6 gap-4 md:gap-5">
        <div className="col-span-6 md:col-span-4">
          <WeakestSkillTile meta={meta} />
        </div>
        <div className="col-span-6 md:col-span-2 border border-border rounded-2xl p-6 md:p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
            How this works
          </p>
          <ol className="mt-3 space-y-2.5 text-[15px] text-slate leading-relaxed list-none">
            <li>
              <span className="font-mono text-academy-teal-dark font-bold mr-2">01</span>
              Try the question from memory first.
            </li>
            <li>
              <span className="font-mono text-academy-teal-dark font-bold mr-2">02</span>
              Take the hint before you peek.
            </li>
            <li>
              <span className="font-mono text-academy-teal-dark font-bold mr-2">03</span>
              Read why the answer works.
            </li>
          </ol>
        </div>
      </div>

      {/* Search — client-side over stems, zero server cost, page stays static */}
      <div className="mt-10">
        <label htmlFor="answers-search" className="block text-sm font-bold text-ink">
          Search explanations
        </label>
        <input
          id="answers-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “kanji”, “particle”, “shop”…"
          autoComplete="off"
          className="mt-2 w-full max-w-xl rounded-xl border-2 border-border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-slate/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue"
        />
        <p className="mt-2 text-sm text-slate" aria-live="polite">
          {searching
            ? `${results.length} of ${total} explanations match`
            : `Showing all ${total} explanations`}
        </p>
      </div>

      {/* Skill filter chips — anchor links, zero JS */}
      <nav aria-label="Filter by skill" className="mt-6">
        <ul className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <li key={s.skill}>
              <a
                href={`#skill-${s.skill}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-slate hover:border-academy-blue hover:text-academy-blue transition-colors duration-200 ease-signature active:scale-[0.97]"
              >
                {s.skillLabel}
                <span className="font-mono text-xs tabular-nums">{s.count}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {searching ? (
        <section aria-label="Search results" className="mt-8">
          <ul className="border-y border-border divide-y divide-border">
            {results.map((m) => (
              <Row key={m.id} m={m} />
            ))}
          </ul>
          {results.length === 0 && (
            <p className="py-10 text-slate">
              Nothing matches. Try a skill name like “grammar” or a word from a question.
            </p>
          )}
        </section>
      ) : (
        <div className="mt-10 space-y-12">
          {skills.map((s) => {
            const rows = meta.filter((m) => m.skill === s.skill);
            return (
              <section key={s.skill} id={`skill-${s.skill}`} aria-labelledby={`h-${s.skill}`} className="scroll-mt-24">
                <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3">
                  <h2 id={`h-${s.skill}`} className="text-xl md:text-2xl font-extrabold text-ink tracking-tight">
                    {s.skillLabel}
                  </h2>
                  <p className="font-mono text-sm tabular-nums text-slate">
                    {s.count} {s.count === 1 ? "explanation" : "explanations"}
                  </p>
                </div>
                <ul className="divide-y divide-border">
                  {rows.map((m) => (
                    <Row key={m.id} m={m} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
