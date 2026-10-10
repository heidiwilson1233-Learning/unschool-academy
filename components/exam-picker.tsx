/**
 * ExamGoalPicker — the homepage's signature interaction (portal-feature run 43).
 *
 * Portal-doctrine moves 8 + 10 (frictionless entry, discovery at scale):
 * one pinned "Live pilot" program (JFT-Basic, the only practiceReady exam)
 * above honest category tabs for the research pipeline.
 *
 * A11y: full APG tablist (arrow-key roving, Home/End, aria-selected/controls),
 * every exam row a real <ul>/<li> with real links, status as visible text
 * (never color-alone), aria-live result count, 44px touch targets,
 * reduced-motion safe. All panels are server-rendered; the client only
 * toggles `hidden` + ARIA — no client-only content, no fetch waterfalls.
 *
 * Honesty: research rows NEVER link a diagnostic/practice/mock — only the
 * exam's research-entry page (or the catalog directory). "Notify me when
 * live" is a device-local interest list (localStorage); it promises no
 * priority, no date, no email.
 */
"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { PickerData } from "@/lib/picker";

const STORAGE_KEY = "unschool-goal-interest";

function readInterests(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function writeInterests(slugs: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    /* private mode etc: the toggle simply won't persist */
  }
}

function NotifyToggle({ slug, title }: { slug: string; title: string }) {
  /* SSR-safe: localStorage is read only after mount, so the server HTML and the
     first client render always agree — no hydration mismatch for returning
     visitors who already saved an interest. */
  const [saved, setSaved] = useState<boolean>(false);
  useEffect(() => {
    setSaved(readInterests().includes(slug));
  }, [slug]);
  const toggle = () => {
    const current = readInterests();
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    writeInterests(next);
    setSaved(next.includes(slug));
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Stop watching ${title} (saved on this device)` : `Notify me when ${title} goes live (saved on this device)`}
      className="min-h-[44px] inline-flex items-center rounded-lg border border-border bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-slate transition-[color,background-color,border-color] duration-150 ease-[var(--ease-signature)] hover:border-academy-teal hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal active:scale-[0.98]"
    >
      {saved ? "Watching" : "Notify me when live"}
    </button>
  );
}

export function ExamGoalPicker({ data, headingId = "exam-goal-picker-heading" }: { data: PickerData; headingId?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [active, setActive] = useState(0);
  const categories = data.categories;
  const activeCat = categories[active];

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % categories.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + categories.length) % categories.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = categories.length - 1;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      document.getElementById(`picker-tab-${uid}-${next}`)?.focus();
    }
  };

  return (
    <div>
      <h2 id={headingId} className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-ink">
        Find your exam
      </h2>

      {/* Pinned live pilot — the only exam with a real diagnostic today.
          Hairline rules (editorial), never a colored rail. */}
      <div className="mt-4 border-y border-border py-4">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-academy-teal-dark">
          <span className="sr-only">Status: </span>Live pilot
        </p>
        <h3 className="mt-1 text-lg font-extrabold tracking-tight text-ink">
          <Link
            href={data.live.href}
            className="rounded hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
          >
            {data.live.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-slate">
          <Link
            href="/exams/jft-basic/diagnostic"
            className="font-semibold text-academy-blue underline underline-offset-4 decoration-academy-blue/40 hover:decoration-academy-blue rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
          >
            Check where you stand
          </Link>
          <span className="text-slate"> — 10 free questions, about five minutes, no account. Your gaps, topic by topic, with a starter plan.</span>
        </p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-slate">
          Practice + mocks — in staged review
        </p>
      </div>

      {/* Research pipeline tabs. Keyboard users get an sr-only hint for the APG keys. */}
      <p id={`picker-keys-${uid}`} className="sr-only">
        Use the left and right arrow keys to move between exam categories.
      </p>
      <div
        role="tablist"
        aria-label="Exam categories in research"
        aria-describedby={`picker-keys-${uid}`}
        className="mt-4 flex gap-1 overflow-x-auto border-b border-border"
      >
        {categories.map((cat, i) => (
          <button
            key={cat.label}
            type="button"
            role="tab"
            id={`picker-tab-${uid}-${i}`}
            aria-selected={i === active}
            aria-controls={`picker-panel-${uid}-${i}`}
            aria-label={`${cat.label}, ${cat.exams.length} ${cat.exams.length === 1 ? "exam" : "exams"} in research`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`min-h-[44px] shrink-0 border-b-2 px-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-[color,border-color] duration-150 ease-[var(--ease-signature)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-academy-teal ${
              i === active
                ? "border-academy-teal text-ink"
                : "border-transparent text-slate hover:text-ink"
            }`}
          >
            {cat.label}
            <span aria-hidden className="ml-1.5 text-slate/70">{cat.exams.length}</span>
          </button>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {activeCat.exams.length} {activeCat.exams.length === 1 ? "exam" : "exams"} in {activeCat.label}.
      </p>

      <div className="min-h-[180px]">
        {categories.map((cat, i) => (
          <div
            key={cat.label}
            role="tabpanel"
            id={`picker-panel-${uid}-${i}`}
            aria-labelledby={`picker-tab-${uid}-${i}`}
            hidden={i !== active}
            /* Masked wipe on panel enter (GPU-only clip-path, never fade-up).
               The animation re-runs each time a panel leaves display:none. */
            className={i === active ? "tab-panel-wipe" : undefined}
          >
            <ul className="divide-y divide-border">
              {cat.exams.map((exam) => (
                <li key={exam.slug} className="py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-bold leading-snug text-ink">{exam.title}</h3>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-slate">
                        {exam.code ? `${exam.code} · ` : ""}Research in progress · {exam.draftQuestions} draft questions
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <Link
                      href={exam.href}
                      className="min-h-[44px] inline-flex items-center gap-1.5 rounded-lg px-1 py-2 text-sm font-semibold text-academy-blue underline underline-offset-4 decoration-academy-blue/40 hover:decoration-academy-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
                      aria-label={`${exam.title}: view research entry`}
                    >
                      Research entry <span aria-hidden>→</span>
                    </Link>
                    <NotifyToggle slug={exam.slug} title={exam.title} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-2 border-t border-border pt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate">
        All research counts are draft questions, labelled draft pending expert review.
      </p>
    </div>
  );
}
