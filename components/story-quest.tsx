"use client";

import { useState } from "react";
import { Button, Badge } from "@/components/ui";
import { Tara } from "@/components/characters";

function speak(text: string, enabled: boolean) {
  if (!enabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-IN";
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

type CardT = { id: string; emoji: string; caption: string; order: number };

const CARDS: CardT[] = [
  { id: "c1", emoji: "🌱", caption: "Tara plants a tiny seed", order: 1 },
  { id: "c2", emoji: "🌧️", caption: "Rain falls all afternoon", order: 2 },
  { id: "c3", emoji: "🌿", caption: "A green sprout pushes up", order: 3 },
  { id: "c4", emoji: "🌻", caption: "A tall sunflower blooms", order: 4 },
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

export default function StoryQuest() {
  const [phase, setPhase] = useState<"order" | "title" | "done">("order");
  const [picked, setPicked] = useState<string[]>([]);
  const [orderChecked, setOrderChecked] = useState<null | boolean>(null);
  const [titlePick, setTitlePick] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [log, setLog] = useState({ hintsUsed: 0, demonstrated: false, attempts: 0 });

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
      say("Wonderful! The story makes sense from beginning to end. Now — what should we call it?");
      setTimeout(() => setPhase("title"), 900);
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

  const chooseTitle = (id: string) => {
    setTitlePick(id);
    const t = TITLES.find((x) => x.id === id)!;
    if (t.correct) {
      say("A perfect title! Tara is writing it in her sketchbook right now.");
      setTimeout(() => setPhase("done"), 900);
    } else {
      say("A fun title — but does it match OUR story about the garden? Try another.");
    }
  };

  const reset = () => {
    setPhase("order");
    setPicked([]);
    setOrderChecked(null);
    setTitlePick(null);
    setHintLevel(0);
    setLog({ hintsUsed: 0, demonstrated: false, attempts: 0 });
  };

  const independent = log.hintsUsed === 0 && !log.demonstrated;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Tara className="w-14 h-14 animate-idle" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-kids-orange-deep">K13 · Tara&apos;s Story Tree</p>
            <h2 className="text-xl font-extrabold text-ink">The Four-Card Story</h2>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSoundOn((v) => !v)}
          aria-pressed={soundOn}
          className="px-3 py-2 rounded-xl border border-border text-sm font-semibold text-slate hover:text-ink"
        >
          {soundOn ? "🔊 Sound on" : "🔇 Muted"}
        </button>
      </div>

      <div className="bg-kids-cream border border-kids-orange/30 rounded-3xl p-6 md:p-8">
        {phase === "order" && (
          <div>
            <div className="bg-paper/80 rounded-2xl px-5 py-4 mb-5 inline-block">
              <p className="font-semibold text-ink">“My story cards got all mixed up! Tap them in the order the story happens.”</p>
              <button type="button" onClick={() => say("My story cards got all mixed up! Tap them in the order the story happens.")} className="text-sm font-semibold text-kids-orange-deep hover:underline mt-1">
                🔊 Hear Tara
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="group" aria-label="Story cards — tap in story order">
              {SHUFFLED.map((c) => {
                const pos = picked.indexOf(c.id);
                const isPicked = pos !== -1;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCard(c.id)}
                    aria-pressed={isPicked}
                    aria-label={`${c.caption}${isPicked ? `, chosen as number ${pos + 1}` : ""}`}
                    className={`relative rounded-2xl border-2 bg-paper p-4 min-h-[150px] flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.03] ${
                      isPicked ? "border-kids-orange shadow-md -translate-y-1" : orderChecked === false ? "border-border" : "border-border"
                    }`}
                  >
                    <span className="text-5xl" aria-hidden>{c.emoji}</span>
                    <span className="text-sm font-medium text-slate text-center">{c.caption}</span>
                    {isPicked && (
                      <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-kids-orange text-white font-extrabold flex items-center justify-center" aria-hidden>
                        {pos + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {picked.length > 0 && (
              <div className="mt-4 flex items-center gap-2 flex-wrap" aria-live="polite">
                <span className="text-sm font-semibold text-slate">Your order:</span>
                {picked.map((id, i) => (
                  <span key={id} className="text-sm bg-paper border border-border rounded-lg px-2.5 py-1 font-medium">
                    {i + 1}. {SHUFFLED.find((c) => c.id === id)!.caption}
                  </span>
                ))}
                <button type="button" onClick={() => { setPicked([]); setOrderChecked(null); }} className="text-sm font-semibold text-slate underline hover:text-ink">
                  Start over
                </button>
              </div>
            )}

            {orderChecked === false && (
              <p className="mt-4 text-center font-semibold text-kids-orange-deep animate-fade-up" role="status">
                Not quite — read your order like a story. Does each picture follow from the one before?
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3 items-center">
              <Button variant="kids" size="lg" onClick={checkOrder}>Check my story</Button>
              {hintLevel < 3 ? (
                <button type="button" onClick={useHint} className="px-4 py-3 rounded-2xl border-2 border-kids-orange/60 text-kids-orange-deep font-bold hover:bg-kids-orange/10 min-h-[56px]">
                  💡 Hint
                </button>
              ) : null}
            </div>
            {hintLevel > 0 && (
              <p className="mt-3 text-sm text-slate bg-paper/70 rounded-xl px-4 py-2" role="status">
                💡 Hint {hintLevel}: {HINTS[hintLevel - 1]}
              </p>
            )}
          </div>
        )}

        {phase === "title" && (
          <div className="animate-fade-up">
            <div className="bg-paper/80 rounded-2xl px-5 py-4 mb-5 inline-block">
              <p className="font-semibold text-ink">“The story flows beautifully! Now — what should we <em>call</em> it?”</p>
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
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 bg-paper font-semibold text-lg transition-all ${
                      chosen && t.correct
                        ? "border-academy-teal bg-academy-teal/10"
                        : wrong
                          ? "border-red-300 bg-red-50"
                          : "border-border hover:border-kids-orange"
                    }`}
                  >
                    “{t.text}”
                    {chosen && t.correct && <span className="ml-3 text-academy-teal-dark">✓</span>}
                    {wrong && <span className="ml-3 text-red-600 text-sm">— fun, but not our story. Try another!</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="text-center py-6 animate-fade-up">
            <Tara className="w-24 h-24 mx-auto animate-idle" />
            <Badge tone="kids">Quest complete</Badge>
            <h3 className="text-2xl font-extrabold text-ink mt-3">“Tara&apos;s Patient Garden” — a story well told!</h3>
            <div className="mt-6 bg-paper rounded-2xl p-6 text-left max-w-md mx-auto border border-border">
              <p className="text-xs font-bold uppercase tracking-widest text-slate mb-2">For parents — what happened</p>
              <ul className="text-sm text-slate space-y-1.5">
                <li>• Story ordering: {independent ? "sequenced independently" : `${log.attempts} attempt${log.attempts === 1 ? "" : "s"}, ${log.hintsUsed} hint${log.hintsUsed === 1 ? "" : "s"}${log.demonstrated ? " (Tara demonstrated the first card)" : ""}`}</li>
                <li>• Title choice: matched title to story content ✓</li>
                <li>• Objective: narrative sequencing + title inference — observed ✓</li>
              </ul>
              <p className="text-xs text-slate mt-3">Prototype log — in production this saves to the child&apos;s profile under your parent account.</p>
            </div>
            <div className="mt-6 bg-kids-orange/10 border border-kids-orange/30 rounded-2xl p-5 max-w-md mx-auto text-left">
              <p className="font-bold text-ink">🌿 Try off-screen</p>
              <p className="text-sm text-slate mt-1">Draw three pictures of your day — morning, afternoon, evening — and tell a grown-up the story in order.</p>
            </div>
            <div className="mt-6 flex gap-3 justify-center flex-wrap">
              <Button variant="kids" onClick={reset}>Play again</Button>
              <Button variant="secondary" href="/kids/grades/1-2">Back to Adventure Club</Button>
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
