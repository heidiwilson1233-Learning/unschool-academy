"use client";

import { useCallback, useRef, useState } from "react";
import { Button, Badge } from "@/components/ui";
import { Momo } from "@/components/characters";

/* ---------- tiny SVG assets ---------- */

function MangoSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
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
  "Momo needs exactly three mangoes. Tap a mango to put it in the basket — tap again to take it out.",
  "Count with me: point at each mango you chose. One… two… How many is that?",
  "Watch Momo choose one mango to start you off.",
];

export default function MangoQuest() {
  const [phase, setPhase] = useState<Phase>("pick");
  const [selected, setSelected] = useState<string[]>([]);
  const [transferSelected, setTransferSelected] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [countStep, setCountStep] = useState(0);
  const [log, setLog] = useState({ hintsUsed: 0, demonstrated: false, transferDone: false });
  const [showExit, setShowExit] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const say = useCallback((t: string) => speak(t, soundOn), [soundOn]);

  const toggleMango = (id: string) => {
    setNotice(null);
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 3 ? s : [...s, id]));
  };

  const giveToMomo = () => {
    if (selected.length !== 3) {
      setNotice("Let's count each one together. Tap mangoes until the basket shows 3.");
      say("Let's count each one. How many mangoes are in the basket?");
      return;
    }
    setPhase("counting");
    setCountStep(0);
    say("One… two… three! Three mangoes for our picnic!");
    const steps = [1, 2, 3];
    steps.forEach((n, i) => {
      timers.current.push(setTimeout(() => setCountStep(n), 700 * (i + 1)));
    });
    timers.current.push(
      setTimeout(() => {
        setPhase("transfer");
        say("Now let's try something new. Can you pick three leaves?");
      }, 700 * 4)
    );
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
    say("Wonderful! You did it all by yourself with the leaves too. Time for a real-world adventure!");
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setPhase("pick");
    setSelected([]);
    setTransferSelected([]);
    setHintLevel(0);
    setNotice(null);
    setCountStep(0);
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
            <p className="text-xs font-bold uppercase tracking-widest text-kids-orange-deep">K04 · Momo&apos;s Mango Garden</p>
            <h2 className="text-xl font-extrabold text-ink">Three Mangoes for the Picnic</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSoundOn((v) => !v)}
            aria-pressed={soundOn}
            className="px-3 py-2 rounded-xl border border-border text-sm font-semibold text-slate hover:text-ink"
          >
            {soundOn ? "🔊 Sound on" : "🔇 Muted"}
          </button>
          <button
            type="button"
            onClick={() => setShowExit(true)}
            className="px-3 py-2 rounded-xl border border-border text-sm font-semibold text-slate hover:text-ink"
          >
            ✕ Exit
          </button>
        </div>
      </div>

      {showExit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Exit quest">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setShowExit(false)} />
          <div className="relative bg-paper rounded-2xl p-8 max-w-sm text-center animate-fade-up">
            <Momo className="w-16 h-16 mx-auto mb-3" />
            <p className="font-bold text-ink text-lg">Take a break?</p>
            <p className="text-slate text-sm mt-1">Momo will keep the mangoes safe. This needs a grown-up to continue.</p>
            <div className="mt-5 flex gap-3 justify-center">
              <Button size="sm" variant="secondary" onClick={() => setShowExit(false)}>Keep playing</Button>
              <Button size="sm" href="/kids/ages/3-5">Grown-up exit</Button>
            </div>
          </div>
        </div>
      )}

      {/* Scene */}
      <div className="bg-kids-cream border border-kids-orange/30 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden
          style={{ background: "radial-gradient(circle at 20% 80%, #8DC6A7 0%, transparent 40%), radial-gradient(circle at 80% 20%, #F2A66C 0%, transparent 35%)" }} />

        {phase === "pick" && (
          <div className="relative">
            <div className="bg-paper/80 rounded-2xl px-5 py-4 mb-4 inline-block">
              <p className="font-semibold text-ink">“We need <span className="text-kids-orange-deep font-extrabold">three</span> mangoes for our picnic. Can you choose three?”</p>
              <button type="button" onClick={() => say("We need three mangoes for our picnic. Can you choose three?")} className="text-sm font-semibold text-kids-orange-deep hover:underline mt-1">
                🔊 Hear Momo
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
                    className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-200 focus-visible:outline-none ${
                      isSel ? "-translate-y-3 scale-110" : "hover:scale-105"
                    } ${isHinted ? "animate-pulse ring-4 ring-kids-orange" : ""}`}
                    style={{ left: m.x, top: m.y }}
                  >
                    <MangoSVG className={`w-full h-full drop-shadow ${isSel ? "opacity-40 grayscale-[0.3]" : ""}`} />
                    {isSel && (
                      <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-academy-teal text-white text-sm font-bold flex items-center justify-center" aria-hidden>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
              <div className="flex items-center gap-3 bg-paper rounded-2xl px-5 py-3 border border-border">
                <span className="text-3xl" aria-hidden>🧺</span>
                <p className="font-extrabold text-ink text-lg" aria-live="polite">
                  {selected.length} of 3 mangoes
                </p>
              </div>
              <div className="flex gap-2">
                {hintLevel < 3 && (
                  <button type="button" onClick={useHint} className="px-4 py-3 rounded-2xl border-2 border-kids-orange/60 text-kids-orange-deep font-bold hover:bg-kids-orange/10 min-h-[56px]">
                    💡 Hint
                  </button>
                )}
                <Button variant="kids" size="lg" onClick={giveToMomo}>Give to Momo</Button>
              </div>
            </div>
            {notice && (
              <p className="mt-3 text-center font-semibold text-kids-orange-deep animate-fade-up" role="status">{notice}</p>
            )}
            {hintLevel > 0 && (
              <p className="mt-3 text-sm text-slate bg-paper/70 rounded-xl px-4 py-2" role="status">
                💡 Hint {hintLevel}: {HINTS[hintLevel - 1]}
              </p>
            )}
          </div>
        )}

        {phase === "counting" && (
          <div className="relative text-center py-10">
            <Momo className="w-24 h-24 mx-auto animate-idle" />
            <div className="flex justify-center gap-4 mt-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className={`w-20 h-20 rounded-2xl bg-paper border-2 flex items-center justify-center transition-all duration-300 ${countStep >= n ? "border-academy-teal scale-110" : "border-border opacity-40"}`}>
                  <MangoSVG className="w-14 h-14" />
                </div>
              ))}
            </div>
            <p className="mt-6 text-2xl font-extrabold text-ink" aria-live="polite">
              {countStep === 0 ? "…" : ["One…", "Two…", "Three!"][countStep - 1]}
            </p>
            <p className="text-slate mt-2">Momo is counting your mangoes into the picnic basket.</p>
          </div>
        )}

        {phase === "transfer" && (
          <div className="relative">
            <div className="bg-paper/80 rounded-2xl px-5 py-4 mb-4 inline-block">
              <p className="font-semibold text-ink">“Now a new challenge! Can you pick <span className="text-kids-leaf-deep font-extrabold">three leaves</span>?”</p>
              <button type="button" onClick={() => say("Now a new challenge! Can you pick three leaves?")} className="text-sm font-semibold text-kids-leaf-deep hover:underline mt-1">
                🔊 Hear Momo
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
                    className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-200 ${isSel ? "-translate-y-3 scale-110" : "hover:scale-105"}`}
                    style={{ left: l.x, top: l.y }}
                  >
                    <LeafSVG className={`w-full h-full drop-shadow ${isSel ? "opacity-40" : ""}`} />
                    {isSel && (
                      <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-academy-teal text-white text-sm font-bold flex items-center justify-center" aria-hidden>
                        ✓
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
              <Button variant="kids" size="lg" onClick={finishTransfer}>Done!</Button>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="relative text-center py-8 animate-fade-up">
            <Momo className="w-24 h-24 mx-auto animate-idle" />
            <Badge tone="kids">Quest complete</Badge>
            <h3 className="text-2xl font-extrabold text-ink mt-3">Three mangoes, three leaves — beautifully counted!</h3>
            <div className="mt-6 bg-paper rounded-2xl p-6 text-left max-w-md mx-auto border border-border">
              <p className="text-xs font-bold uppercase tracking-widest text-slate mb-2">For parents — what happened</p>
              <ul className="text-sm text-slate space-y-1.5">
                <li>• Mangoes: {independent ? "chosen independently, no hints" : `completed with ${log.hintsUsed} hint${log.hintsUsed === 1 ? "" : "s"}${log.demonstrated ? " (Momo demonstrated once)" : ""}`}</li>
                <li>• Transfer (leaves): {log.transferDone ? "completed — skill transferred to new objects" : "not completed"}</li>
                <li>• Objective: one-to-one counting to 3 — {log.transferDone ? "observed ✓" : "in progress"}</li>
              </ul>
              <p className="text-xs text-slate mt-3">Prototype log — in production this saves to the child&apos;s profile under your parent account.</p>
            </div>
            <div className="mt-6 bg-kids-orange/10 border border-kids-orange/30 rounded-2xl p-5 max-w-md mx-auto text-left">
              <p className="font-bold text-ink">🌿 Try off-screen</p>
              <p className="text-sm text-slate mt-1">With a grown-up, find three safe objects in your room and count them together. Then find three of something else!</p>
            </div>
            <div className="mt-6 flex gap-3 justify-center flex-wrap">
              <Button variant="kids" onClick={reset}>Play again</Button>
              <Button variant="secondary" href="/kids/ages/3-5">Back to Play Garden</Button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate mt-3 text-center">
        Prototype quest · Staging asset — pending educator review before any child account sees it.
      </p>
    </div>
  );
}
