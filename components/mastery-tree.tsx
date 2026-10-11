"use client";

/**
 * Mastery tree — the student per-skill mastery view (portal-doctrine move 3).
 *
 * Reads "ua-attempts" from this device's localStorage (diagnostic v2 and the
 * practice players record per-skill results there) and renders the curriculum
 * skill list as a Khan-style mastery ladder: not-started -> attempted ->
 * familiar -> proficient -> mastered. No account, no server, no sign-in.
 *
 * The skill list itself arrives as props from the server page, which reads
 * content/curriculum JSON — answer keys never enter this client bundle.
 */
import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import {
  computeMastery,
  tallySkills,
  nextBestSkill,
  masterySummary,
  attemptsToNext,
  levelFor,
  MASTERY_LEVEL_NAMES,
  type MasteryLevel,
  type MasterySkillInput,
  type SkillMastery,
  type StoredAttempt,
} from "@/lib/mastery";

const LEVEL_ORDER: MasteryLevel[] = ["attempted", "familiar", "proficient", "mastered"];

const DOT_STYLE: Record<MasteryLevel, string> = {
  "not-started": "border-border bg-transparent",
  attempted: "border-slate bg-slate",
  familiar: "border-academy-blue bg-academy-blue",
  proficient: "border-academy-teal bg-academy-teal",
  mastered: "border-academy-teal-dark bg-academy-teal-dark",
};

const LEVEL_MEANING: Record<MasteryLevel, string> = {
  "not-started": "No attempts yet on this device.",
  attempted: "You have tried this skill.",
  familiar: "3+ attempts, 60%+ correct.",
  proficient: "5+ attempts, 80%+ correct.",
  mastered: "8+ attempts, 80%+ correct.",
};

/**
 * The dot ladder is decorative: the skill level is already named in the
 * adjacent text, and doubly-announcing it (role=img + aria-label + visible
 * text) made screen readers repeat it on every row.
 */
function LevelLadder({ level }: { level: MasteryLevel }) {
  const rank = LEVEL_ORDER.indexOf(level);
  return (
    <span className="flex items-center gap-1.5" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full border-2 ${
            i <= rank ? DOT_STYLE[LEVEL_ORDER[i]] : "border-border bg-transparent"
          }`}
        />
      ))}
    </span>
  );
}

function SkillRow({
  skill,
  mastery,
  isNext,
}: {
  skill: MasterySkillInput;
  mastery: SkillMastery;
  isNext: boolean;
}) {
  const accuracy = mastery.accuracy;
  const next = attemptsToNext(mastery);
  return (
    <li className="flex items-center gap-4 py-3.5 border-b border-border last:border-b-0">
      <LevelLadder level={mastery.level} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink text-[15px]">
          {skill.label}
          {isNext && (
            <span className="ml-2 align-middle">
              <Badge tone="info">Up next</Badge>
            </span>
          )}
        </p>
        <p className="text-sm text-slate">
          {MASTERY_LEVEL_NAMES[mastery.level]}
          {accuracy !== null && (
            <>
              {" · "}
              {Math.round(accuracy * 100)}% correct across {mastery.total}{" "}
              {mastery.total === 1 ? "attempt" : "attempts"}
            </>
          )}
          {next && (
            <span className="block text-[13px]">
              {next.remaining === 0
                ? `Within reach of ${MASTERY_LEVEL_NAMES[next.level]}`
                : `${next.remaining} more strong ${next.remaining === 1 ? "attempt" : "attempts"} to ${MASTERY_LEVEL_NAMES[next.level]}`}
            </span>
          )}
        </p>
      </div>
      <Link
        href={`/exams/jft-basic/practice/${skill.practiceSlug}`}
        className="shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold text-academy-teal-dark border border-academy-teal/40 hover:bg-academy-teal/10 focus-visible:outline-3 focus-visible:outline-academy-teal transition-colors active:translate-y-px"
        aria-label={`Practice ${skill.label}`}
      >
        Practice
      </Link>
    </li>
  );
}

export default function MasteryTree({ skills }: { skills: MasterySkillInput[] }) {
  const [mastery, setMastery] = useState<Record<string, SkillMastery> | null>(null);
  const [sessionCount, setSessionCount] = useState(0);

  /* useLayoutEffect: localStorage is synchronous, so reading it before paint
     avoids a skeleton-flash layout shift on every load (the sibling dashboard
     keeps the same convention). */
  useLayoutEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("ua-attempts") ?? "[]");
      const attempts: StoredAttempt[] = Array.isArray(raw) ? raw : [];
      setMastery(computeMastery(tallySkills(attempts)));
      setSessionCount(attempts.filter((a) => a.skills && a.skills.length > 0).length);
    } catch {
      setMastery({});
    }
  }, []);

  if (mastery === null) {
    return (
      <div aria-busy="true">
        <p className="sr-only">Loading your skill map</p>
        <div aria-hidden className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-border/40 motion-safe:animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const ids = skills.map((s) => s.id);
  const { mastered, attempted, total } = masterySummary(mastery, ids);
  const next = nextBestSkill(skills, mastery);
  const groups = new Map<string, MasterySkillInput[]>();
  for (const s of skills) {
    const g = groups.get(s.section) ?? [];
    g.push(s);
    groups.set(s.section, g);
  }

  return (
    <div>
      {/* The doctrine-mandated progress header: "X of Y skills mastered",
          set as an editorial numeral lockup. */}
      <div className="mb-8 border-b border-border pb-8">
        <p className="font-display text-6xl md:text-7xl tracking-tight text-ink">
          {mastered}
          <span className="text-3xl md:text-4xl text-slate/70"> / {total}</span>
        </p>
        <p className="mt-2 text-slate">
          skills mastered
          {attempted > 0 &&
            ` · ${sessionCount} ${sessionCount === 1 ? "session" : "sessions"} on this device`}
        </p>
      </div>

      {/* Next-best-skill banner — the frictionless "what do I do next" (doctrine move 8). */}
      {next ? (
        <div className="rounded-xl border border-border bg-paper p-5 sm:p-6 mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
            Your next best move
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink text-balance">
            {next.skill.label}
          </h2>
          <p className="mt-2 text-slate max-w-2xl leading-relaxed">{next.reason}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href={`/exams/jft-basic/practice/${next.skill.practiceSlug}`}>
              Practice {next.skill.label}
            </Button>
            <Button href="/exams/jft-basic/diagnostic" variant="ghost">
              Re-take the diagnostic
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-academy-teal/40 bg-academy-teal/[0.06] p-5 sm:p-6 mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-academy-teal-dark">
            Full mastery
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink text-balance">
            Every skill mastered — genuinely impressive.
          </h2>
          <p className="mt-2 text-slate max-w-2xl leading-relaxed">
            Re-take the diagnostic or keep practicing to hold these levels; a
            string of misses can still bring a skill back down. That is the
            honesty of the map.
          </p>
        </div>
      )}

      {/* The tree: official exam sections, skills in curriculum study order. */}
      {attempted === 0 && (
        <div className="rounded-xl border border-border bg-paper p-6 mb-8">
          <h2 className="text-lg font-bold text-ink">This map is empty — for now.</h2>
          <p className="mt-2 text-slate leading-relaxed max-w-2xl">
            Ten free questions, five minutes, and every skill below lights up
            with a starting level. The diagnostic writes the first data point;
            practice sessions write the rest.
          </p>
          <div className="mt-4">
            <Button href="/exams/jft-basic/diagnostic">Take the free diagnostic</Button>
          </div>
        </div>
      )}

      {[...groups.entries()].map(([section, groupSkills]) => (
        <section key={section} aria-labelledby={`sec-${groupSkills[0].id}`} className="mb-8">
          <h2
            id={`sec-${groupSkills[0].id}`}
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate mb-2"
          >
            {section}
          </h2>
          <ul className="rounded-xl border border-border bg-paper px-4 sm:px-5">
            {groupSkills.map((skill) => {
              const m: SkillMastery = mastery[skill.id] ?? {
                level: levelFor(0, 0),
                rank: 0,
                correct: 0,
                total: 0,
                accuracy: null,
              };
              return (
                <SkillRow
                  key={skill.id}
                  skill={skill}
                  mastery={m}
                  isNext={next?.skill.id === skill.id}
                />
              );
            })}
          </ul>
        </section>
      ))}

      {/* Honesty legend — every level defined, thresholds disclosed. */}
      <section aria-labelledby="mastery-how" className="mt-10 border-t border-border pt-8">
        <h2 id="mastery-how" className="text-lg font-bold text-ink">
          How mastery is measured
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {(Object.keys(LEVEL_MEANING) as MasteryLevel[]).map((level) => (
            <li key={level} className="flex items-start gap-3 text-sm">
              <span
                aria-hidden
                className={`mt-0.5 h-3 w-3 rounded-full border-2 ${DOT_STYLE[level]}`}
              />
              <span className="text-slate">
                <strong className="font-semibold text-ink">{MASTERY_LEVEL_NAMES[level]}</strong>
                {" — "}
                {LEVEL_MEANING[level]}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate max-w-3xl leading-relaxed">
          Computed only from your diagnostic and practice sessions on this
          device. No account, nothing leaves your browser. Levels recompute
          from every attempt, so a run of misses can move a skill back down;
          the map never flatters.
        </p>
        <div className="mt-4">
          <Badge tone="warning">Levels are estimates from draft content — pending expert review</Badge>
        </div>
      </section>
    </div>
  );
}
