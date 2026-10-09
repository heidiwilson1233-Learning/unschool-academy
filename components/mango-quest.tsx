"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui";
import { Momo } from "@/components/characters";
import {
  Volume2,
  VolumeX,
  Lightbulb,
  X,
  Check,
  ShoppingBasket,
  Leaf,
} from "lucide-react";

/* ---------- tiny SVG assets (flat kids register; contact shadow baked in as SVG — GPU-cheap) ---------- */

function MangoSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <ellipse cx="30" cy="52" rx="14" ry="5" fill="#000" opacity="0.08" />
      <path d="M30 8 C 44 8, 54 22, 50 38 C 46 52, 34 56, 24 50 C 12 42, 12 22, 30 8 Z" fill="#F5A623" />
      <path d="M30 8 C 38 10, 44 16, 46 24" fill="none" stroke="#E8894A" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="28" cy="12" rx="8" ry="4" fill="#3F7D5C" transform="rotate(-24 28 12)" />
      <circle cx="24" cy="28" r="4" fill="#FFD98E" opacity="0.8" />
    </svg>
  );
}

function LeafSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <ellipse cx="30" cy="52" rx="14" ry="5" fill="#000" opacity="0.08" />
      <path d="M30 6 C 48 18, 52 38, 30 54 C 8 38, 12 18, 30 6 Z" fill="#3F7D5C" />
      <path d="M30 10 L30 50" stroke="#2C5A42" strokeWidth="3" />
      <path d="M30 22 L40 18 M30 34 L42 30 M30 22 L20 18 M30 34 L18 30" stroke="#2C5A42" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- speech ---------- */

function speak(text: string, enabled: boolean) {
  if (!enabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-IN";
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

/* ---------- dialog focus management: move focus in, trap Tab, Escape, restore ---------- */

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

/* ---------- quest ---------- */

type Phase = "pick" | "counting" | "transfer" | "done";

const MANGOES = [
  { id: "m1", x: "8%", y: "12%" },
  { id: "m2", x: "38%", y: "6%" },
  { id: "m3", x: "66%", y: "14%" },
  { id: "m4", x: "20%", y: "52%" },
  { id: "m5", x: "52%", y: "48%" },
  { id: "m6", x: "78%", y: "54%" },
];

const LEAVES = [
  { id: "l1", x: "6%", y: "18%" },
  { id: "l2", x: "30%", y: "8%" },
  { id: "l3", x: "56%", y: "16%" },
  { id: "l4", x: "78%", y: "10%" },
  { id: "l5", x: "42%", y: "58%" },
];

const HINTS = [
  "Tap three mangoes to fill the basket. Tap one again to take it out.",
  "Count with me: point at each mango you chose. One… two… How many is that?",
  "Watch! Momo picks one mango to start you off.",
];

const TRANSFER_HINT = "Pick any three leaves. Touch each one as you count: one, two, three.";

const COUNT_WORDS = ["One", "Two", "Three"];

const PHASES: Phase[] = ["pick", "counting", "transfer", "done"];
const PHASE_LABELS: Record<Phase, string> = {
  pick: "Pick",
  counting: "Count",
  transfer: "Transfer",
  done: "Done",
};

type AttemptLog = { hintsUsed: number; demonstrated: boolean; transferDone: boolean };

/* Chunky 4-node quest trail — progress feedback for ages 3–5. Zero runtime cost: pure markup + CSS. */
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
                  <span className="sr-only">
                    {isCurrent ? " (current step)" : isDone ? " (completed)" : ""}
                  </span>
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
      <p className="sr-only">Step {idx + 1} of 4</p>
    </nav>
  );
}

/* CSS-only celebration confetti — ~24 pieces, transform/opacity keyframes, hidden under reduced motion. */
const CONFETTI_COLORS = ["#F5A623", "#3F7D5C", "#B9A7E6", "#2AA198"];

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

/* Parent log + off-screen bridge + CTAs, shared by the takeover and the compact inline done card. */
function DoneContent({
  independent,
  log,
  onPlayAgain,
}: {
  independent: boolean;
  log: AttemptLog;
  onPlayAgain: () => void;
}) {
  return (
    <>
      <div className="bg-paper rounded-2xl p-6 text-left max-w-md mx-auto border border-border">
        <p className="text-xs font-bold uppercase tracking-widest text-slate mb-2">For parents: what happened</p>
        <ul className="text-sm text-slate space-y-1.5">
          <li>
            Mangoes:{" "}
            {independent
              ? "picked without any hints"
              : `picked with ${log.hintsUsed} hint${log.hintsUsed === 1 ? "" : "s"}${
                  log.demonstrated ? " (Momo showed one pick)" : ""
                }`}
          </li>
          <li>Leaves: {log.transferDone ? "three leaves picked on their own" : "not finished yet"}</li>
          <li>Counting to three: {log.transferDone ? "completed with Momo's count-along" : "still practicing"}</li>
        </ul>
        <p className="text-xs text-slate mt-3">
          Prototype log. In production this will save to the child&apos;s profile under the parent account.
        </p>
      </div>
      <div className="mt-6 bg-kids-orange/10 border border-kids-orange/30 rounded-2xl p-5 max-w-md mx-auto text-left">
        <p className="font-bold text-ink flex items-center gap-2">
          <Leaf aria-hidden className="w-5 h-5 text-kids-leaf-deep" /> Try off-screen
        </p>
        <p className="text-sm text-slate mt-1">
          With a grown-up, find three safe objects in your room and count them together. Then find three of something else!
        </p>
      </div>
      <div className="mt-6 flex gap-3 justify-center flex-wrap">
        <Button variant="kids" onClick={onPlayAgain}>
          Play again
        </Button>
        <Button variant="secondary" href="/kids/ages/3-5">
          Back to Play Garden
        </Button>
      </div>
    </>
  );
}

export default function MangoQuest() {
  const [phase, setPhase] = useState<Phase>("pick");
  const [selected, setSelected] = useState<string[]>([]);
  const [transferSelected, setTransferSelected] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [transferHintShown, setTransferHintShown] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [countTaps, setCountTaps] = useState<string[]>([]);
  const [lastTapped, setLastTapped] = useState<string | null>(null);
  const [justFilled, setJustFilled] = useState(false);
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);
  const [log, setLog] = useState<AttemptLog>({ hintsUsed: 0, demonstrated: false, transferDone: false });
  const [showExit, setShowExit] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const say = useCallback((t: string) => speak(t, soundOn), [soundOn]);

  /* Unmount: clear pending timers and stop speech so nothing leaks onto the next page. */
  useEffect(() => {
    const stash = timers.current;
    return () => {
      stash.forEach(clearTimeout);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const closeExit = useCallback(() => setShowExit(false), []);
  const closeCelebration = useCallback(() => setCelebrationDismissed(true), []);
  const { dialogRef: exitDialogRef, titleRef: exitTitleRef } = useDialogFocus(showExit, closeExit);
  const { dialogRef: doneDialogRef, titleRef: doneTitleRef } = useDialogFocus(
    phase === "done" && !celebrationDismissed,
    closeCelebration
  );
  const exitTitleId = useId();
  const doneTitleId = useId();

  const toggleMango = (id: string) => {
    setNotice(null);
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : selected.length >= 3
        ? selected
        : [...selected, id];
    setSelected(next);
    if (next.length === 3 && selected.length !== 3) {
      setJustFilled(true);
      say("Three! The basket is full.");
      timers.current.push(setTimeout(() => setJustFilled(false), 900));
    }
  };

  const giveToMomo = () => {
    if (selected.length !== 3) {
      setNotice("Let's count each one together. Tap mangoes until the basket shows three.");
      say("Let's count each one. How many mangoes are in the basket?");
      return;
    }
    setPhase("counting");
    setCountTaps([]);
    setLastTapped(null);
    say("Tap each mango with Momo. One mango, one number.");
  };

  /* Tap-along counting: the child touches each mango — one-to-one correspondence,
     not passive watching. Speech is gesture-gated, so it cannot be autoplay-blocked. */
  const tapCount = (id: string) => {
    if (countTaps.includes(id)) return;
    const next = [...countTaps, id];
    setCountTaps(next);
    setLastTapped(id);
    timers.current.push(setTimeout(() => setLastTapped(null), 350));
    if (next.length < 3) {
      say(COUNT_WORDS[next.length - 1]);
    } else {
      say("Three! Three mangoes for the picnic!");
      timers.current.push(
        setTimeout(() => {
          setPhase("transfer");
          say("Now a new challenge. Can you pick three leaves?");
        }, 1400)
      );
    }
  };

  const useHint = () => {
    const next = Math.min(hintLevel + 1, 3);
    setHintLevel(next);
    setLog((l) => ({ ...l, hintsUsed: l.hintsUsed + 1 }));
    say(HINTS[next - 1]);
    if (next === 3 && selected.length === 0) {
      // partial example: Momo demonstrates one pick
      setSelected(["m1"]);
      setLog((l) => ({ ...l, demonstrated: true }));
    }
  };

  const toggleLeaf = (id: string) => {
    setTransferSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 3 ? s : [...s, id]));
  };

  const finishTransfer = () => {
    if (transferSelected.length !== 3) {
      say("Almost! We need three leaves. Count them with me.");
      return;
    }
    setLog((l) => ({ ...l, transferDone: true }));
    setPhase("done");
    setCelebrationDismissed(false);
    say("Wonderful! You did it all by yourself with the leaves too. Time for a real-world adventure!");
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setPhase("pick");
    setSelected([]);
    setTransferSelected([]);
    setHintLevel(0);
    setTransferHintShown(false);
    setNotice(null);
    setCountTaps([]);
    setLastTapped(null);
    setJustFilled(false);
    setCelebrationDismissed(false);
    setLog({ hintsUsed: 0, demonstrated: false, transferDone: false });
  };

  const independent = log.hintsUsed === 0 && !log.demonstrated;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Quest header */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Momo className="w-14 h-14 animate-idle" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-kids-orange-ink">K04 · Momo&apos;s Mango Garden</p>
            {/* h2 kept (not h1): this quest is also embedded in the /kids hero, which owns that page's h1 */}
            <h2 className="text-xl font-extrabold text-ink text-balance">Three Mangoes for the Picnic</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSoundOn((v) => !v)}
            aria-pressed={soundOn}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-b-[3px] border-border bg-paper text-sm font-bold text-slate hover:text-ink active:translate-y-[2px] active:border-b-2 transition-[transform,colors] duration-200"
          >
            {soundOn ? <Volume2 aria-hidden className="w-4 h-4" /> : <VolumeX aria-hidden className="w-4 h-4" />}
            {soundOn ? "Sound on" : "Sound off"}
          </button>
          <button
            type="button"
            onClick={() => setShowExit(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-b-[3px] border-border bg-paper text-sm font-bold text-slate hover:text-ink active:translate-y-[2px] active:border-b-2 transition-[transform,colors] duration-200"
          >
            <X aria-hidden className="w-4 h-4" /> Exit
          </button>
        </div>
      </div>

      <PhaseTrail phase={phase} />

      {showExit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={exitTitleId}
          ref={exitDialogRef}
        >
          <div className="absolute inset-0 bg-ink/40" onClick={closeExit} aria-hidden />
          <div className="relative bg-paper rounded-2xl p-8 max-w-sm text-center quest-pop border-2 border-border">
            <Momo className="w-16 h-16 mx-auto mb-3" />
            <h2 id={exitTitleId} ref={exitTitleRef} tabIndex={-1} className="font-bold text-ink text-lg">
              Take a break?
            </h2>
            <p className="text-slate text-sm mt-1">Momo will keep the mangoes safe. Come back whenever you like.</p>
            <div className="mt-5 flex gap-3 justify-center">
              <Button size="sm" variant="secondary" onClick={closeExit}>
                Keep playing
              </Button>
              <Button size="sm" href="/kids/ages/3-5">
                Back to Play Garden
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Scene — hidden once the celebration takes over */}
      {phase !== "done" && (
      <div className="bg-kids-cream border border-kids-orange/30 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden
          style={{ background: "radial-gradient(circle at 20% 80%, #8DC6A7 0%, transparent 40%), radial-gradient(circle at 80% 20%, #F2A66C 0%, transparent 35%)" }} />

        {phase === "pick" && (
          <div className="relative">
            <div className="bg-paper/80 rounded-2xl px-5 py-4 mb-4 inline-block">
              <p className="font-semibold text-ink">“We need <span className="text-kids-orange-ink font-extrabold">three</span> mangoes for our picnic. Can you choose three?”</p>
              <button type="button" onClick={() => say("We need three mangoes for our picnic. Can you choose three?")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-kids-orange-ink hover:underline mt-1">
                <Volume2 aria-hidden className="w-4 h-4" /> Hear Momo
              </button>
            </div>
            <div className="relative h-64 md:h-72" role="group" aria-label="Mangoes to choose from">
              {MANGOES.map((m) => {
                const isSel = selected.includes(m.id);
                const isHinted = hintLevel === 2 && !isSel && m.id === "m2";
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMango(m.id)}
                    aria-pressed={isSel}
                    aria-label={`Mango ${m.id.replace("m", "")}${isSel ? ", selected" : ""}`}
                    className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 ${
                      isSel ? "-translate-y-3 scale-110" : "hover:scale-105"
                    } ${isHinted ? "animate-pulse ring-4 ring-kids-orange-deep" : ""}`}
                    style={{ left: m.x, top: m.y }}
                  >
                    <MangoSVG className={`w-full h-full ${isSel ? "opacity-40 grayscale-[0.3]" : ""}`} />
                    {isSel && (
                      <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-academy-teal text-white flex items-center justify-center" aria-hidden>
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
              <div className="flex items-center gap-3 bg-paper rounded-2xl px-5 py-3 border border-border">
                <ShoppingBasket aria-hidden className="w-8 h-8 text-kids-orange-ink" />
                <p className="font-extrabold text-ink text-lg" aria-live="polite">
                  <span key={selected.length} className={justFilled ? "inline-block mango-pop" : "inline-block"}>
                    {selected.length} of 3 mangoes
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                {hintLevel < 3 && (
                  <button type="button" onClick={useHint} className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-b-4 border-kids-orange/60 text-kids-orange-ink font-bold hover:bg-kids-orange/10 min-h-[56px] active:translate-y-[2px] active:border-b-2 transition-[transform,colors] duration-200">
                    <Lightbulb aria-hidden className="w-5 h-5" /> Hint
                  </button>
                )}
                <Button variant="kids" size="lg" onClick={giveToMomo}>Give to Momo</Button>
              </div>
            </div>
            <div className="mt-3 min-h-[1.75rem] text-center">
              {notice && (
                <p className="font-semibold text-kids-orange-ink quest-pop" role="status">{notice}</p>
              )}
            </div>
            {hintLevel > 0 && (
              <p className="mt-3 text-sm text-slate bg-paper/70 rounded-xl px-4 py-2 inline-flex items-center gap-2" role="status">
                <Lightbulb aria-hidden className="w-4 h-4 shrink-0 text-kids-orange-ink" />
                <span>Hint {hintLevel}: {HINTS[hintLevel - 1]}</span>
              </p>
            )}
          </div>
        )}

        {phase === "counting" && (
          <div className="relative text-center py-8">
            <div className="bg-paper/80 rounded-2xl px-5 py-4 mb-6 inline-block">
              <p className="font-semibold text-ink">“Tap each mango with Momo. One mango, one number.”</p>
              <button type="button" onClick={() => say("Tap each mango with Momo. One mango, one number.")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-kids-orange-ink hover:underline mt-1">
                <Volume2 aria-hidden className="w-4 h-4" /> Hear Momo
              </button>
            </div>
            <div className="flex justify-center gap-4" role="group" aria-label="Tap each mango to count it">
              {["c1", "c2", "c3"].map((id) => {
                const tapped = countTaps.includes(id);
                const num = countTaps.indexOf(id) + 1;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => tapCount(id)}
                    aria-pressed={tapped}
                    aria-label={tapped ? `Mango ${num}, counted` : "Mango, tap to count"}
                    className={`w-24 h-24 md:w-28 md:h-28 rounded-3xl border-2 bg-paper relative flex items-center justify-center transition-[transform,opacity,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 ${
                      tapped ? "border-academy-teal" : "border-border hover:border-kids-orange-deep"
                    }`}
                  >
                    <span className={`block w-16 h-16 md:w-20 md:h-20 ${lastTapped === id ? "mango-pop" : ""}`}>
                      <MangoSVG className={`w-full h-full ${tapped ? "" : "opacity-70"}`} />
                    </span>
                    {tapped && (
                      <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-academy-teal text-white text-base font-extrabold flex items-center justify-center" aria-hidden>
                        {num}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-6 text-6xl md:text-7xl font-extrabold text-ink tracking-tight" aria-live="polite" aria-atomic="true">
              <span key={countTaps.length} className="inline-block quest-pop">
                {countTaps.length === 0 ? (
                  <span aria-hidden="true">…</span>
                ) : (
                  <>
                    {COUNT_WORDS[countTaps.length - 1]}
                    <span aria-hidden="true">{countTaps.length === 3 ? "!" : "…"}</span>
                  </>
                )}
              </span>
            </p>
            <p className="text-slate mt-2">Tap each mango. Momo counts with you.</p>
          </div>
        )}

        {phase === "transfer" && (
          <div className="relative">
            <div className="bg-paper/80 rounded-2xl px-5 py-4 mb-4 inline-block">
              <p className="font-semibold text-ink">“Now a new challenge! Can you pick <span className="text-kids-leaf-deep font-extrabold">three leaves</span>?”</p>
              <button type="button" onClick={() => say("Now a new challenge! Can you pick three leaves?")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-kids-leaf-deep hover:underline mt-1">
                <Volume2 aria-hidden className="w-4 h-4" /> Hear Momo
              </button>
            </div>
            <div className="relative h-56 md:h-64" role="group" aria-label="Leaves to choose from">
              {LEAVES.map((l) => {
                const isSel = transferSelected.includes(l.id);
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => toggleLeaf(l.id)}
                    aria-pressed={isSel}
                    aria-label={`Leaf ${l.id.replace("l", "")}${isSel ? ", selected" : ""}`}
                    className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 ${isSel ? "-translate-y-3 scale-110" : "hover:scale-105"}`}
                    style={{ left: l.x, top: l.y }}
                  >
                    <LeafSVG className={`w-full h-full ${isSel ? "opacity-40" : ""}`} />
                    {isSel && (
                      <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-academy-teal text-white flex items-center justify-center" aria-hidden>
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
              <p className="font-extrabold text-ink text-lg bg-paper rounded-2xl px-5 py-3 border border-border" aria-live="polite">
                {transferSelected.length} of 3 leaves
              </p>
              <div className="flex gap-2">
                {!transferHintShown && (
                  <button type="button" onClick={() => { setTransferHintShown(true); say(TRANSFER_HINT); }} className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-b-4 border-kids-leaf/60 text-kids-leaf-deep font-bold hover:bg-kids-leaf/10 min-h-[56px] active:translate-y-[2px] active:border-b-2 transition-[transform,colors] duration-200">
                    <Lightbulb aria-hidden className="w-5 h-5" /> Need help?
                  </button>
                )}
                <Button variant="kids" size="lg" onClick={finishTransfer}>Done!</Button>
              </div>
            </div>
            {transferHintShown && (
              <p className="mt-3 text-sm text-slate bg-paper/70 rounded-xl px-4 py-2 quest-pop" role="status">
                {TRANSFER_HINT}
              </p>
            )}
          </div>
        )}
      </div>
      )}
      {/* Celebration takeover: full-screen, CSS-only confetti, dialog semantics. */}
      {phase === "done" && !celebrationDismissed && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-kids-cream"
          role="dialog"
          aria-modal="true"
          aria-labelledby={doneTitleId}
          ref={doneDialogRef}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at 18% 15%, rgba(242,166,108,0.35) 0%, transparent 42%), radial-gradient(circle at 82% 75%, rgba(185,167,230,0.35) 0%, transparent 42%)",
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
              <Momo className="w-24 h-24 animate-idle" />
              <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-kids-orange-ink">
                K04 · Quest complete
              </p>
              <h2
                id={doneTitleId}
                ref={doneTitleRef}
                tabIndex={-1}
                className="mt-2 text-5xl md:text-6xl font-extrabold text-ink tracking-tight text-balance"
              >
                You did it!
              </h2>
              <p className="mt-3 text-lg font-semibold text-slate">Three mangoes for the picnic, counted one by one.</p>
            </div>
            <div className="mt-8 w-full quest-pop" style={{ animationDelay: "120ms" }}>
              <DoneContent independent={independent} log={log} onPlayAgain={reset} />
            </div>
          </div>
        </div>
      )}

      {/* Compact inline done card, shown if the celebration is dismissed. */}
      {phase === "done" && celebrationDismissed && (
        <div className="relative text-center py-8 quest-pop">
          <Momo className="w-16 h-16 mx-auto animate-idle" />
          <h2 className="text-2xl font-extrabold text-ink mt-3 text-balance">
            Three mangoes, three leaves. Beautifully counted!
          </h2>
          <div className="mt-6">
            <DoneContent independent={independent} log={log} onPlayAgain={reset} />
          </div>
        </div>
      )}

      <p className="text-xs text-slate mt-3 text-center">
        Prototype quest · staging asset. Pending educator review.
      </p>
    </div>
  );
}
