"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui";
import { Tara } from "@/components/characters";
import {
  Volume2,
  VolumeX,
  Lightbulb,
  X,
  Check,
  RotateCcw,
  BookOpenText,
  Bean,
  CloudRain,
  Sprout,
  Flower2,
} from "lucide-react";

/* ---------- speech ---------- */

function speak(text: string, enabled: boolean) {
  if (!enabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-IN";
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

/* ---------- dialog focus management (shared pattern with mango-quest) ---------- */

function useDialogFocus(open: boolean, onEscape: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.hasAttribute("disabled"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onEscape]);
  return { dialogRef, titleRef };
}

/* ---------- celebration confetti (shared pattern with mango-quest) ---------- */

const CONFETTI_COLORS = ["#F2A66C", "#147D75", "#8DC6A7", "#8A5418"];

function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    left: `${(i * 37 + 11) % 100}%`,
    size: 8 + ((i * 13) % 8),
    round: i % 3 === 0,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    dx: `${((i * 53) % 240) - 120}px`,
    rot: `${((i * 137) % 720) - 360}deg`,
    delay: `${(i * 41) % 600}ms`,
    dur: `${2300 + ((i * 29) % 900)}ms`,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.round ? p.size : p.size * 0.5,
              background: p.color,
              borderRadius: p.round ? "50%" : "2px",
              "--dx": p.dx,
              "--rot": p.rot,
              "--delay": p.delay,
              "--dur": p.dur,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ---------- data ---------- */

type CardT = {
  id: string;
  icon: typeof Bean;
  iconColor: string;
  iconBg: string;
  caption: string;
  order: number;
  word: string;
};

const CARDS: CardT[] = [
  { id: "c1", icon: Bean, iconColor: "text-kids-orange-ink", iconBg: "bg-kids-orange/15", caption: "Tara plants a tiny seed", order: 1, word: "First" },
  { id: "c2", icon: CloudRain, iconColor: "text-academy-teal-dark", iconBg: "bg-academy-teal/10", caption: "Rain falls all afternoon", order: 2, word: "Next" },
  { id: "c3", icon: Sprout, iconColor: "text-kids-leaf-deep", iconBg: "bg-kids-leaf/15", caption: "A green sprout pushes up", order: 3, word: "Then" },
  { id: "c4", icon: Flower2, iconColor: "text-kids-orange-deep", iconBg: "bg-kids-orange/15", caption: "A tall sunflower blooms", order: 4, word: "Last" },
];

// Presented shuffled (fixed shuffle so it's deterministic and reviewable)
const SHUFFLED = [CARDS[2], CARDS[0], CARDS[3], CARDS[1]];

const TITLES = [
  { id: "t1", text: "Tara's Patient Garden", correct: true },
  { id: "t2", text: "The Talking Umbrella", correct: false },
  { id: "t3", text: "A Race in the Rain", correct: false },
];

const HINTS = [
  "Stories have a beginning, a middle, and an end. Which picture must come FIRST?",
  "The seed must be planted before anything can grow. Find the planting picture.",
  "Watch Tara place the first card, then you finish the rest.",
];

const PHASES = ["order", "title", "done"] as const;
type Phase = (typeof PHASES)[number];
const PHASE_LABELS: Record<Phase, string> = { order: "Order", title: "Name it", done: "Done" };

type LogT = { hintsUsed: number; demonstrated: boolean; attempts: number };

/* Chunky 3-node quest trail — progress feedback for grades 1–2. Pure markup + CSS. */
function PhaseTrail({ phase }: { phase: Phase }) {
  const idx = PHASES.indexOf(phase);
  return (
    <nav aria-label="Quest progress" className="mb-5">
      <ol className="flex items-center gap-1 sm:gap-2">
        {PHASES.map((p, i) => {
          const isDone = i < idx;
          const isCurrent = i === idx;
          return (
            <li key={p} className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 last:flex-none">
              <span className="flex items-center gap-2 shrink-0">
                <span
                  aria-hidden
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-extrabold text-sm ${
                    isDone
                      ? "bg-academy-teal border-academy-teal text-white"
                      : isCurrent
                        ? "bg-kids-orange border-kids-orange-deep text-ink node-pulse"
                        : "bg-paper border-border text-slate"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
                </span>
                <span className={`text-xs sm:text-sm font-bold truncate ${isCurrent ? "text-ink" : "text-slate"}`}>
                  {PHASE_LABELS[p]}
                  <span className="sr-only">{isCurrent ? " (current step)" : isDone ? " (completed)" : ""}</span>
                </span>
              </span>
              {i < PHASES.length - 1 && (
                <svg className="flex-1 h-2 mx-1 min-w-4" aria-hidden preserveAspectRatio="none" viewBox="0 0 40 8">
                  <line
                    x1="0" y1="4" x2="40" y2="4"
                    stroke={i < idx ? "var(--color-academy-teal)" : "var(--color-border)"}
                    strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
      <p className="sr-only">Step {idx + 1} of 3</p>
    </nav>
  );
}

/* Parent log + off-screen bridge + CTAs, shared by the takeover and the compact inline done card. */
function DoneContent({
  independent,
  log,
  onPlayAgain,
}: {
  independent: boolean;
  log: LogT;
  onPlayAgain: () => void;
}) {
  return (
    <div className="w-full">
      <section
        aria-labelledby="parent-log-heading"
        className="bg-paper rounded-2xl p-6 text-left max-w-md mx-auto border border-border"
      >
        <h3 id="parent-log-heading" className="text-xs font-bold uppercase tracking-widest text-slate mb-2">
          For parents: what happened
        </h3>
        <ul className="text-sm text-slate space-y-1.5 list-disc pl-5 marker:text-kids-orange-deep">
          <li>
            Story ordering:{" "}
            {independent
              ? "sequenced independently"
              : `${log.attempts} attempt${log.attempts === 1 ? "" : "s"}, ${log.hintsUsed} hint${
                  log.hintsUsed === 1 ? "" : "s"
                }${log.demonstrated ? " (Tara demonstrated the first card)" : ""}`}
          </li>
          <li>Title choice: matched title to story content</li>
          <li>Objective: narrative sequencing + title inference — observed</li>
        </ul>
        <p className="text-xs text-slate mt-3">
          Prototype log — in production this saves to the child&apos;s profile under your parent account.
        </p>
      </section>
      <section
        aria-labelledby="offscreen-heading"
        className="mt-4 bg-kids-orange/10 border border-kids-orange/30 rounded-2xl p-5 max-w-md mx-auto text-left"
      >
        <h3 id="offscreen-heading" className="font-bold text-ink">
          Try off-screen
        </h3>
        <p className="text-sm text-slate mt-1">
          Draw three pictures of your day — morning, afternoon, evening — and tell a grown-up the
          story in order.
        </p>
      </section>
      <div className="mt-6 flex gap-3 justify-center flex-wrap">
        <Button variant="kids" onClick={onPlayAgain}>
          Play again
        </Button>
        <Button variant="secondary" href="/kids/grades/1-2">
          Back to Adventure Club
        </Button>
      </div>
    </div>
  );
}

/* ---------- quest ---------- */

export default function StoryQuest() {
  const [phase, setPhase] = useState<Phase>("order");
  const [picked, setPicked] = useState<string[]>([]);
  const [orderChecked, setOrderChecked] = useState<null | boolean>(null);
  const [titlePick, setTitlePick] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [log, setLog] = useState<LogT>({ hintsUsed: 0, demonstrated: false, attempts: 0 });
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);

  /* Timers are tracked so reset()/unmount can clear them — no stale phase flips. */
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const doneTitleId = useId();
  const closeCelebration = useCallback(() => setCelebrationDismissed(true), []);
  const { dialogRef, titleRef } = useDialogFocus(phase === "done" && !celebrationDismissed, closeCelebration);

  const say = (t: string) => speak(t, soundOn);

  const toggleCard = (id: string) => {
    setOrderChecked(null);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 4 ? p : [...p, id]));
  };

  const checkOrder = () => {
    if (picked.length !== 4) {
      say("Tap all four cards first, in the order the story happens.");
      return;
    }
    const correct = picked.every((id, i) => SHUFFLED.find((c) => c.id === id)!.order === i + 1);
    setOrderChecked(correct);
    setLog((l) => ({ ...l, attempts: l.attempts + 1 }));
    if (correct) {
      say("Wonderful! The story makes sense from beginning to end. Now, what should we call it?");
      later(() => setPhase("title"), 900);
    } else {
      say("Hmm, let's look again. Does each picture follow sensibly from the one before?");
    }
  };

  const useHint = () => {
    const next = Math.min(hintLevel + 1, 3);
    setHintLevel(next);
    setLog((l) => ({ ...l, hintsUsed: l.hintsUsed + 1 }));
    say(HINTS[next - 1]);
    if (next === 3 && picked.length === 0) {
      setPicked(["c1"]);
      setLog((l) => ({ ...l, demonstrated: true }));
    }
  };

  /* Oral retelling payoff: hear the finished story read back in story order. */
  const orderedCards = [...SHUFFLED].sort((a, b) => a.order - b.order);
  const hearStory = () => {
    say(orderedCards.map((c) => `${c.word}: ${c.caption}`).join(". ") + ".");
  };

  const chooseTitle = (id: string) => {
    setTitlePick(id);
    const t = TITLES.find((x) => x.id === id)!;
    if (t.correct) {
      say("A perfect title! Tara is writing it in her sketchbook right now.");
      later(() => setPhase("done"), 900);
    } else {
      say("A fun title — but does it match OUR story about the garden? Try another.");
    }
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("order");
    setPicked([]);
    setOrderChecked(null);
    setTitlePick(null);
    setHintLevel(0);
    setLog({ hintsUsed: 0, demonstrated: false, attempts: 0 });
    setCelebrationDismissed(false);
  };

  const independent = log.hintsUsed === 0 && !log.demonstrated;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Tara className="w-14 h-14 animate-idle" />
          <p className="text-xs font-bold uppercase tracking-widest text-kids-orange-ink">
            K13 · Tara&apos;s Story Tree
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSoundOn((v) => !v)}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Mute Tara's voice" : "Unmute Tara's voice"}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-border bg-paper text-sm font-bold text-slate hover:text-ink hover:border-kids-orange-deep active:translate-y-[1px] transition-[transform,border-color,colors] duration-200"
        >
          {soundOn ? <Volume2 aria-hidden className="w-4 h-4" /> : <VolumeX aria-hidden className="w-4 h-4" />}
          {soundOn ? "Sound on" : "Muted"}
        </button>
      </div>

      <PhaseTrail phase={phase} />

      {phase !== "done" && (
        <div className="relative overflow-hidden bg-kids-cream border border-kids-orange/30 rounded-3xl p-6 md:p-8">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at 15% 10%, rgba(242,166,108,0.25) 0%, transparent 40%), radial-gradient(circle at 85% 90%, rgba(141,198,167,0.22) 0%, transparent 40%)",
            }}
          />
          <div className="relative">
            {phase === "order" && (
              <section aria-label="Order the story cards">
                <h2 className="text-2xl font-extrabold text-ink tracking-tight">Order the story</h2>
                <div className="bg-paper/80 rounded-2xl px-5 py-4 mt-4 mb-5 inline-block">
                  <p className="font-semibold text-ink">
                    “My story cards got all mixed up! Tap them in the order the story happens.”
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      say("My story cards got all mixed up! Tap them in the order the story happens.")
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-kids-orange-ink hover:underline mt-1"
                  >
                    <Volume2 aria-hidden className="w-4 h-4" /> Hear Tara
                  </button>
                </div>

                <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 list-none p-0 m-0">
                  {SHUFFLED.map((c) => {
                    const pos = picked.indexOf(c.id);
                    const isPicked = pos !== -1;
                    const Icon = c.icon;
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => toggleCard(c.id)}
                          aria-pressed={isPicked}
                          aria-label={`${c.caption}${isPicked ? `, chosen as number ${pos + 1}` : ""}`}
                          className={`relative w-full rounded-2xl border-2 border-b-4 bg-paper p-4 min-h-[172px] flex flex-col items-center justify-center gap-2 active:translate-y-[2px] active:border-b-2 transition-[transform,border-color,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isPicked
                              ? "border-kids-orange-deep bg-kids-orange/10 -translate-y-1"
                              : "border-border hover:border-kids-orange-deep/60"
                          }`}
                        >
                          <span className={`w-16 h-16 rounded-full ${c.iconBg} flex items-center justify-center`} aria-hidden>
                            <Icon className={`w-8 h-8 ${c.iconColor}`} strokeWidth={2} />
                          </span>
                          <span className="text-sm font-medium text-slate text-center">{c.caption}</span>
                          {isPicked && (
                            <>
                              <span
                                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-academy-teal text-white font-extrabold flex items-center justify-center border-2 border-paper"
                                aria-hidden
                              >
                                {pos + 1}
                              </span>
                              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-kids-orange-ink" aria-hidden>
                                {c.word}
                              </span>
                            </>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {picked.length > 0 && (
                  <div className="mt-4 flex items-center gap-2 flex-wrap" aria-live="polite">
                    <span className="text-sm font-semibold text-slate">Your order:</span>
                    {picked.map((id, i) => {
                      const c = SHUFFLED.find((x) => x.id === id)!;
                      return (
                        <span
                          key={id}
                          className="text-sm bg-paper border border-border rounded-lg px-2.5 py-1 font-medium"
                        >
                          {i + 1}. {c.word}: {c.caption}
                        </span>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setPicked([]);
                        setOrderChecked(null);
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-slate hover:text-ink underline underline-offset-2"
                    >
                      <RotateCcw aria-hidden className="w-4 h-4" /> Start over
                    </button>
                  </div>
                )}

                {orderChecked === false && (
                  <p className="mt-4 text-center font-semibold text-kids-orange-ink quest-pop" role="status">
                    Not quite. Read your order like a story: does each picture follow from the one
                    before?
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3 items-center">
                  <Button variant="kids" size="lg" onClick={checkOrder}>
                    Check my story
                  </Button>
                  {hintLevel < 3 && (
                    <button
                      type="button"
                      onClick={useHint}
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-b-4 border-kids-orange/60 text-kids-orange-ink font-bold hover:bg-kids-orange/10 min-h-[56px] active:translate-y-[2px] active:border-b-2 transition-[transform,colors,background-color] duration-200"
                    >
                      <Lightbulb aria-hidden className="w-5 h-5" /> Hint
                    </button>
                  )}
                </div>
                {hintLevel > 0 && (
                  <p
                    className="mt-3 text-sm text-slate bg-paper/70 rounded-xl px-4 py-2 inline-flex items-center gap-2"
                    role="status"
                  >
                    <Lightbulb aria-hidden className="w-4 h-4 shrink-0 text-kids-orange-ink" />
                    <span>
                      Hint {hintLevel}: {HINTS[hintLevel - 1]}
                    </span>
                  </p>
                )}
              </section>
            )}

            {phase === "title" && (
              <section aria-label="Choose the story title" className="quest-pop">
                <h2 className="text-2xl font-extrabold text-ink tracking-tight">Name the story</h2>
                <div className="bg-paper/80 rounded-2xl px-5 py-4 mt-4 mb-5 inline-block">
                  <p className="font-semibold text-ink">
                    “The story flows beautifully! Now, what should we <em>call</em> it?”
                  </p>
                  <button
                    type="button"
                    onClick={hearStory}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-kids-orange-ink hover:underline mt-1"
                  >
                    <BookOpenText aria-hidden className="w-4 h-4" /> Hear my story
                  </button>
                </div>
                <div className="space-y-3" role="radiogroup" aria-label="Choose the story title">
                  {TITLES.map((t) => {
                    const chosen = titlePick === t.id;
                    const wrong = chosen && !t.correct;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={chosen && t.correct}
                        onClick={() => chooseTitle(t.id)}
                        disabled={t.correct && chosen}
                        className={`w-full text-left px-5 py-4 rounded-2xl border-2 border-b-4 bg-paper font-semibold text-lg active:translate-y-[2px] active:border-b-2 transition-[transform,border-color,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          chosen && t.correct
                            ? "border-academy-teal bg-academy-teal/10"
                            : wrong
                              ? "border-red-300 bg-red-50"
                              : "border-border hover:border-kids-orange-deep/60"
                        }`}
                      >
                        “{t.text}”
                        {chosen && t.correct && (
                          <Check aria-hidden className="inline-block ml-3 w-5 h-5 text-academy-teal-dark" strokeWidth={3} />
                        )}
                        {wrong && (
                          <span className="ml-3 text-red-600 text-sm">Fun, but not our story. Try another!</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* Celebration takeover: full-screen, CSS-only confetti, dialog semantics. */}
      {phase === "done" && !celebrationDismissed && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-kids-cream"
          role="dialog"
          aria-modal="true"
          aria-labelledby={doneTitleId}
          ref={dialogRef}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at 18% 15%, rgba(242,166,108,0.35) 0%, transparent 42%), radial-gradient(circle at 82% 75%, rgba(141,198,167,0.35) 0%, transparent 42%)",
            }}
          />
          <Confetti />
          <button
            type="button"
            onClick={closeCelebration}
            aria-label="Close celebration"
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full border-2 border-b-[3px] border-border bg-paper inline-flex items-center justify-center text-slate hover:text-ink active:translate-y-[2px] active:border-b-2 transition-[transform,colors]"
          >
            <X aria-hidden className="w-5 h-5" />
          </button>
          <div className="relative min-h-full flex flex-col items-center justify-center text-center px-4 py-14 max-w-2xl mx-auto">
            <div className="quest-pop flex flex-col items-center">
              <Tara className="w-24 h-24 animate-idle" />
              <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-kids-orange-ink">
                K13 · Quest complete
              </p>
              <h2
                id={doneTitleId}
                ref={titleRef}
                tabIndex={-1}
                className="mt-2 text-5xl md:text-6xl font-extrabold text-ink tracking-tight text-balance"
              >
                A story well told!
              </h2>
              <p className="mt-3 text-lg font-semibold text-slate">
                “Tara&apos;s Patient Garden”, told in order from seed to sunflower.
              </p>
            </div>
            <div className="mt-8 w-full quest-pop" style={{ animationDelay: "120ms" }}>
              <DoneContent independent={independent} log={log} onPlayAgain={reset} />
            </div>
          </div>
        </div>
      )}

      {/* Compact inline done card, shown if the celebration is dismissed. */}
      {phase === "done" && celebrationDismissed && (
        <section aria-label="Quest complete" className="text-center py-4 quest-pop">
          <Tara className="w-16 h-16 mx-auto animate-idle" />
          <h2 className="text-2xl font-extrabold text-ink mt-3 text-balance">
            “Tara&apos;s Patient Garden.” A story well told!
          </h2>
          <div className="mt-6">
            <DoneContent independent={independent} log={log} onPlayAgain={reset} />
          </div>
        </section>
      )}

      <p className="text-xs text-slate mt-3 text-center">
        Prototype quest · staging asset. Pending educator review.
      </p>
    </div>
  );
}
