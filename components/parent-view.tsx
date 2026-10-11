"use client";

/**
 * Pilot parent view — client renderer for /app/exams/parent.
 *
 * Reads "ua-attempts" from this device's localStorage (the same store as the
 * student dashboard) and presents it in parent language: activity recency,
 * recent scores, plain-word skill groups, and an auto-generated monthly
 * report with a shareable text summary.
 *
 * Institutional editorial register (parents are adults): type-as-hero
 * numbers, hairline-rule ledgers, mono micro-labels. The monthly report is
 * the page's one authored moment — a school report-card artifact. Copy is
 * encouragement-first: patterns, never guilt.
 */
import { useLayoutEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Section, Card, Button, Badge, Callout } from "@/components/ui";
import {
  parseAttempts,
  attemptDate,
  sessionLabel,
  relativeTime,
  activeDayKeys,
  lastSevenDays,
  groupByMonth,
  fmtDate,
  parentSkillGroups,
  buildSummaryText,
  tallySkills,
  computeMastery,
  nextBestSkill,
  MASTERY_LEVEL_NAMES,
} from "@/lib/parent";
import { attemptsToNext } from "@/lib/mastery";
import type { MasterySkillInput } from "@/lib/mastery";

const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.2em] text-slate";

export default function ParentView({ skills }: { skills: MasterySkillInput[] }) {
  const [attempts, setAttempts] = useState<ReturnType<typeof parseAttempts> | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  /* Synchronous read before paint: no skeleton flash, no CLS (run-57 pattern). */
  useLayoutEffect(() => {
    try {
      setAttempts(parseAttempts(JSON.parse(localStorage.getItem("ua-attempts") ?? "[]")));
    } catch {
      setAttempts([]);
    }
  }, []);

  const data = useMemo(() => {
    if (attempts === null) return null;
    const sorted = [...attempts].sort((a, b) => attemptDate(b).getTime() - attemptDate(a).getTime());
    const now = new Date();
    const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const sessionsThisWeek = attempts.filter((a) => attemptDate(a).getTime() >= weekAgo).length;
    const dayStrip = lastSevenDays(activeDayKeys(attempts), now);
    const months = groupByMonth(attempts);
    const current = months[0];
    const archive = months.slice(1, 4);
    const labelFor = (id: string) => skills.find((s) => s.id === id)?.label ?? id;
    const mastery = computeMastery(tallySkills(attempts));
    const groups = parentSkillGroups(skills, mastery);
    const attempted = groups.strong.length + groups.building.length;
    return { sorted, now, sessionsThisWeek, dayStrip, current, archive, labelFor, mastery, groups, attempted };
  }, [attempts, skills]);

  if (attempts === null || data === null) {
    return (
      <Section>
        <div aria-busy="true" className="mx-auto max-w-6xl">
          <p className="sr-only">Loading the parent view</p>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-6 md:col-span-4 h-56 rounded-2xl bg-border/40" />
            <div className="col-span-6 md:col-span-2 h-56 rounded-2xl bg-border/40" />
            <div className="col-span-6 h-72 rounded-2xl bg-border/40" />
          </div>
        </div>
      </Section>
    );
  }

  const { sorted, now, sessionsThisWeek, dayStrip, current, archive, labelFor, mastery, groups, attempted } = data;
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  if (attempts.length === 0) {
    return (
      <Section>
        <div className="mx-auto max-w-6xl">
          <Card className="!shadow-none max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              Nothing to show yet.
            </h2>
            <p className="mt-3 text-slate leading-relaxed">
              Sessions appear here after the learner finishes a diagnostic, a practice
              session, or a mock on this device. Once that happens, this page becomes
              the monthly report you can keep or share.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/exams/jft-basic/diagnostic">Start the free diagnostic</Button>
              <Button href="/free-practice" variant="secondary">Try a free sample first</Button>
            </div>
          </Card>
        </div>
      </Section>
    );
  }

  const lastActive = relativeTime(attemptDate(sorted[0]), now);
  const nextMove = nextBestSkill(skills, mastery);
  const completionPct = Math.round((attempted / skills.length) * 100);

  /* Plain-language next step (B-5): "practice rounds", never "strong attempts". */
  let nextStepText: string;
  let nextStepLink: { href: string; label: string } | null = null;
  if (nextMove) {
    const m = nextMove.mastery;
    const gap = m ? attemptsToNext(m) : null;
    const nextName = gap ? MASTERY_LEVEL_NAMES[gap.level] : "Attempted";
    const remaining = gap ? gap.remaining : 1;
    nextStepText = `${nextMove.skill.label}: about ${remaining} more practice ${
      remaining === 1 ? "round" : "rounds"
    } with most answers right to reach ${nextName}.`;
    if (nextMove.skill.practiceSlug) {
      nextStepLink = {
        href: `/exams/jft-basic/practice/${nextMove.skill.practiceSlug}`,
        label: `Practice ${nextMove.skill.label.split(" ")[0].toLowerCase()} next`,
      };
    }
  } else {
    nextStepText = "Every skill is at Mastered. Time for a new exam or a harder tier.";
  }

  /* Strongest skill this month (needs at least 3 questions to count). */
  let strongest: { label: string; accuracy: number; total: number } | null = null;
  for (const [id, t] of Object.entries(current.skillTallies)) {
    if (t.total >= 3) {
      const acc = t.correct / t.total;
      if (!strongest || acc > strongest.accuracy) {
        strongest = { label: labelFor(id), accuracy: acc, total: t.total };
      }
    }
  }

  const summary = buildSummaryText({
    month: current,
    skillCounts: { attempted, strong: groups.strong.length, total: skills.length },
    strongest,
    nextStep: nextStepText,
    lastActive,
    sessionsThisWeek,
    labelFor,
  });

  const copyViaClipboard = async () => {
    await navigator.clipboard.writeText(summary);
  };

  const shareOrCopy = async () => {
    try {
      if (canShare) {
        await navigator.share({ text: summary });
        return; // user completed the native share sheet
      }
      await copyViaClipboard();
    } catch (err) {
      if (err && (err as Error).name === "AbortError") return; // sheet dismissed — no alarm
      /* Clipboard (or share) failed: one last fallback, then an honest error. */
      try {
        const ta = document.createElement("textarea");
        ta.value = summary;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      } catch {
        setCopyMsg("Copy did not work — select the text manually.");
        return;
      }
    }
    setCopied(true);
    setCopyMsg("Copied. Keep it, forward it, or print it.");
    window.setTimeout(() => {
      setCopied(false);
      setCopyMsg(null);
    }, 4000);
  };

  return (
    <Section>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-6 gap-4 md:gap-5">
          {/* ---------- Activity dossier ---------- */}
          <Card className="col-span-6 lg:col-span-4 !shadow-none">
            <h2 className={EYEBROW}>Activity</h2>
            <p className="mt-3 text-5xl font-extrabold tracking-tight text-ink">
              {sessionsThisWeek}
              <span className="text-base font-semibold text-slate">
                {" "}
                {sessionsThisWeek === 1 ? "session this week" : "sessions this week"}
              </span>
            </p>
            <p className="mt-1 text-sm text-slate">
              Last session {lastActive}.{" "}
              {sessionsThisWeek === 0
                ? "A quiet week is normal."
                : "Consistent, even in small doses."}
            </p>
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate" id="week-dots">
                Last 7 days
              </p>
              <ul aria-labelledby="week-dots" className="mt-3 flex items-center gap-3">
                {dayStrip.map((d) => (
                  <li key={d.key} className="flex flex-col items-center gap-1.5">
                    <span aria-hidden className="flex h-5 w-5 items-center justify-center">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          d.active
                            ? "bg-academy-teal ring-2 ring-academy-teal/40 ring-offset-1 ring-offset-paper"
                            : "border-2 border-slate/60"
                        }`}
                      />
                    </span>
                    <span className="sr-only">
                      {d.active ? "Active" : "No activity"} on {d.fullDay}
                    </span>
                    <span aria-hidden className="text-[11px] font-medium uppercase text-slate">
                      {d.day}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 border-t border-border pt-5">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                  Course completion
                </p>
                <p className="text-sm font-semibold text-ink tabular-nums">
                  {attempted} of {skills.length} skills · {completionPct}%
                </p>
              </div>
              <div
                className="mt-2 h-2 rounded-full bg-border/60"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completionPct}
                aria-label={`Course completion: ${attempted} of ${skills.length} skills attempted`}
              >
                <div
                  className="h-full rounded-full bg-academy-teal"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate">
                “Attempted” means the learner has tried at least one session on the skill.
              </p>
            </div>
          </Card>

          {/* ---------- Consistency rail ---------- */}
          <Card className="col-span-6 lg:col-span-2 !shadow-none">
            <h2 className={EYEBROW}>This month</h2>
            <p className="mt-3 text-4xl font-extrabold tracking-tight text-ink">
              {current.activeDays}
              <span className="text-base font-semibold text-slate">
                {" "}
                {current.activeDays === 1 ? "active day" : "active days"}
              </span>
            </p>
            <p className="mt-1 text-sm text-slate">
              {current.sessions} {current.sessions === 1 ? "session" : "sessions"} ·{" "}
              {current.questions} questions
            </p>
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-sm text-slate leading-relaxed">
                Steady beats intense. Look for patterns across weeks, not single scores.
                One bad day is noise; a rising week is the signal.
              </p>
            </div>
          </Card>

          {/* ---------- Recent scores ---------- */}
          <Card className="col-span-6 lg:col-span-4 !shadow-none">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-extrabold text-ink">Recent scores</h2>
              <Badge tone="warning">Draft content · pending expert review</Badge>
            </div>
            <ul className="mt-4 divide-y divide-border/70" aria-label="Six most recent sessions">
              {sorted.slice(0, 6).map((a, i) => {
                const score = a.score ?? 0;
                const total = a.total ?? 0;
                const pct = total > 0 ? Math.round((score / total) * 100) : 0;
                return (
                  <li
                    key={`${a.at}-${i}`}
                    className="flex items-baseline justify-between gap-4 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-ink text-[15px]">{sessionLabel(a)}</p>
                      <p className="mt-0.5 text-xs text-slate">{fmtDate(attemptDate(a))}</p>
                    </div>
                    <p className="shrink-0 text-right">
                      <span className="text-lg font-extrabold tabular-nums text-ink">
                        {score}/{total}
                      </span>{" "}
                      <span className="text-sm text-slate tabular-nums">{pct}%</span>
                    </p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 border-t border-border pt-4 text-sm text-slate">
              Concerned about a trend?{" "}
              <a
                href="/contact"
                className="font-semibold text-academy-teal-dark hover:underline"
              >
                Ask the content team
              </a>{" "}
              for help: they reply within 2 business days during the pilot.
            </p>
          </Card>

          {/* ---------- How to read rail ---------- */}
          <Card className="col-span-6 lg:col-span-2 !shadow-none">
            <h2 className={EYEBROW}>How to read this</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate leading-relaxed">
              <li>
                <span className="font-semibold text-ink">Scores</span> are against practice
                questions, not the real exam. Treat them as direction, not verdicts.
              </li>
              <li>
                <span className="font-semibold text-ink">Skills</span> move one rung at a
                time. A skill dropping a level after a rough session is the map staying
                honest, not failure.
              </li>
              <li>
                <span className="font-semibold text-ink">Everything</span> is stored in this
                browser. If practice happens on another device, this page won&rsquo;t see it
                yet.
              </li>
            </ul>
          </Card>

          {/* ---------- Skills in plain language ---------- */}
          <Card className="col-span-6 !shadow-none">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h2 className="text-xl font-extrabold text-ink">Skills</h2>
              <a
                href="/app/exams/mastery"
                className="text-sm font-semibold text-academy-teal-dark hover:underline"
              >
                Open the full skill map
              </a>
            </div>
            <dl className="mt-4 grid gap-0 sm:grid-cols-3 sm:gap-6">
              <div className="border-t-2 border-academy-teal pt-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                  Strong · {groups.strong.length}
                </dt>
                <dd className="mt-2 text-sm text-ink leading-relaxed">
                  {groups.strong.length > 0
                    ? groups.strong.map((s) => s.label).join(" · ")
                    : "None yet. That is fine: strength is built, not expected."}
                </dd>
              </div>
              <div className="border-t-2 border-academy-blue pt-3 mt-6 sm:mt-0">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                  Building · {groups.building.length}
                </dt>
                <dd className="mt-2 text-sm text-ink leading-relaxed">
                  {groups.building.length > 0
                    ? groups.building.map((s) => s.label).join(" · ")
                    : "Nothing mid-climb right now."}
                </dd>
              </div>
              <div className="border-t-2 border-border pt-3 mt-6 sm:mt-0">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                  Not started yet · {groups.notStarted.length}
                </dt>
                <dd className="mt-2 text-sm text-slate leading-relaxed">
                  {groups.notStarted.length > 0
                    ? groups.notStarted.map((s) => s.label).join(" · ")
                    : "Everything has been tried at least once."}
                </dd>
              </div>
            </dl>
            <p className="mt-6 border-t border-border pt-4 text-sm text-slate leading-relaxed">
              <span className="font-semibold text-ink">The next milestone. </span>
              {nextStepText}{" "}
              {nextStepLink && (
                <a
                  href={nextStepLink.href}
                  className="font-semibold text-academy-teal-dark hover:underline"
                >
                  {nextStepLink.label} <span aria-hidden>→</span>
                </a>
              )}
            </p>
          </Card>

          {/* ---------- Monthly report: the report-card artifact ---------- */}
          <Card className="col-span-6 !shadow-none !bg-[#fffdf7] ring-1 ring-inset ring-border/70">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
                Monthly report · auto-generated
              </p>
              <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-slate">
                Generated on this device
              </p>
            </div>
            <h2 className="mt-2 text-3xl md:text-4xl font-normal tracking-tight text-ink" style={{ fontFamily: "var(--font-display)" }}>
              {current.label}
            </h2>
            <div className="mt-4 border-t-4 border-double border-border" aria-hidden />
            <dl className="mt-2 divide-y divide-border/70" aria-label={`${current.label} statistics`}>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm font-semibold text-ink">Practice sessions</dt>
                <dd className="text-2xl font-extrabold tabular-nums text-ink">{current.sessions}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm font-semibold text-ink">Questions answered</dt>
                <dd className="text-2xl font-extrabold tabular-nums text-ink">{current.questions}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm font-semibold text-ink">Accuracy</dt>
                <dd className="text-2xl font-extrabold tabular-nums text-ink">
                  {current.accuracy === null ? "—" : `${Math.round(current.accuracy * 100)}%`}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm font-semibold text-ink">Active days</dt>
                <dd className="text-2xl font-extrabold tabular-nums text-ink">{current.activeDays}</dd>
              </div>
            </dl>
            {strongest && (
              <p className="mt-2 text-sm text-slate leading-relaxed">
                <span className="font-semibold text-ink">Strongest this month: </span>
                {strongest.label}: {Math.round(strongest.accuracy * 100)}% over {strongest.total}{" "}
                questions.
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Button variant="secondary" onClick={shareOrCopy}>
                {copied ? "Summary copied" : canShare ? "Share this month's summary" : "Copy this month's summary"}
              </Button>
              <p className="text-sm text-slate">Plain text: activity, scores, skills, next step.</p>
              <p aria-live="polite" className="text-sm text-slate">
                {copyMsg}
              </p>
            </div>
            {archive.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                  Previous months
                </h3>
                <p className="mt-1 text-xs text-slate">Showing the last 3 months.</p>
                <div className="mt-3 space-y-2">
                  {archive.map((m) => (
                    <details
                      key={m.key}
                      className="group rounded-xl border border-border bg-canvas/60 px-4"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-3 py-3 font-semibold text-ink text-[15px]">
                        <span>
                          {m.label}
                          <span className="ml-2 font-normal text-slate text-sm">
                            {m.sessions} {m.sessions === 1 ? "session" : "sessions"}
                            {m.accuracy !== null && ` · ${Math.round(m.accuracy * 100)}%`}
                          </span>
                        </span>
                        <ChevronDown
                          aria-hidden
                          className="h-4 w-4 shrink-0 text-slate transition-transform duration-200 group-open:rotate-180"
                        />
                      </summary>
                      <dl className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 pb-4 text-sm">
                        <div>
                          <dt className="text-xs text-slate uppercase tracking-wide">Questions</dt>
                          <dd className="font-bold text-ink tabular-nums">{m.questions}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate uppercase tracking-wide">Active days</dt>
                          <dd className="font-bold text-ink tabular-nums">{m.activeDays}</dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="text-xs text-slate uppercase tracking-wide">Latest scores</dt>
                          <dd className="font-semibold text-ink">
                            {m.latestByKind.length > 0
                              ? m.latestByKind.map((l) => `${l.kind} ${l.score}/${l.total}`).join(" · ")
                              : "—"}
                          </dd>
                        </div>
                      </dl>
                    </details>
                  ))}
                </div>
              </div>
            )}
            <p className="mt-6 text-xs text-slate leading-relaxed">
              Auto-generated from sessions stored in this browser. Scores and skill levels are
              computed from draft practice content, pending expert review.
            </p>
          </Card>
        </div>

        <Callout tone="info" title="For the learner's own dashboard">
          This is the read-only parent view.{" "}
          <a href="/app/exams" className="font-semibold underline">
            My exam progress
          </a>{" "}
          is where practice actually happens.
        </Callout>
      </div>
    </Section>
  );
}
