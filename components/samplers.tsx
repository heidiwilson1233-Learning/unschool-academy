"use client";

import { useState } from "react";
import Link from "next/link";
import { Momo } from "./characters";

/* One-question JFT sampler: real interaction, real feedback */
export function JftSampler() {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = "b";
  const options = [
    { id: "a", jp: "おはよう", en: "good morning" },
    { id: "b", jp: "こんばんは", en: "good evening" },
    { id: "c", jp: "さようなら", en: "goodbye" },
  ];
  return (
    <div className="bg-paper border border-border rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-academy-teal mb-2">
        Try it — JFT-Basic sample
      </p>
      <p className="font-semibold text-ink mb-1">
        It is 8pm. You meet your neighbour. What do you say?
      </p>
      <p className="text-sm text-slate mb-4">Choose the natural everyday phrase.</p>
      <div className="space-y-2" role="radiogroup" aria-label="Sample question options">
        {options.map((o) => {
          const isPicked = picked === o.id;
          const showCorrect = picked && o.id === correct;
          const showWrong = isPicked && o.id !== correct;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={isPicked}
              onClick={() => setPicked(o.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                showCorrect
                  ? "border-academy-teal bg-academy-teal/10"
                  : showWrong
                    ? "border-red-400 bg-red-50"
                    : isPicked
                      ? "border-academy-blue bg-academy-blue/5"
                      : "border-border hover:border-academy-blue/50"
              }`}
            >
              <span className="jp text-lg font-semibold text-ink">{o.jp}</span>
              <span className="text-sm text-slate ml-3">“{o.en}”</span>
              {showCorrect && <span className="ml-3 text-sm font-bold text-academy-teal-dark">✓ Correct</span>}
              {showWrong && <span className="ml-3 text-sm font-bold text-red-600">✗ Try again</span>}
            </button>
          );
        })}
      </div>
      {picked === correct && (
        <p className="mt-4 text-sm text-slate animate-fade-up">
          <span className="font-semibold text-ink">Why:</span> こんばんは (konbanwa) is the
          standard evening greeting. おはよう is for mornings, さようなら when parting.
        </p>
      )}
      <Link href="/exams/jft-basic/diagnostic" className="mt-5 inline-flex font-semibold text-academy-blue hover:underline">
        Take the full 10-question diagnostic →
      </Link>
    </div>
  );
}

/* One-step kids sampler: real counting interaction */
export function KidsSampler() {
  const [count, setCount] = useState(0);
  const target = 3;
  const done = count === target;
  return (
    <div className="bg-kids-cream border border-kids-orange/30 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-kids-orange-deep mb-2">
        Try it — Momo's counting game
      </p>
      <div className="flex items-center gap-4">
        <Momo className="w-20 h-20 shrink-0 animate-idle" />
        <p className="font-semibold text-ink">
          Momo needs <span className="text-kids-orange-deep font-extrabold">{target} mangoes</span> for
          the picnic. Tap the basket to add one!
        </p>
      </div>
      <button
        type="button"
        onClick={() => setCount((c) => Math.min(c + 1, 6))}
        disabled={done}
        aria-label={`Add a mango. ${count} of ${target} added.`}
        className="mt-4 w-full min-h-[88px] rounded-2xl border-2 border-dashed border-kids-orange/50 bg-paper flex items-center justify-center gap-2 text-4xl hover:border-kids-orange disabled:cursor-default transition-colors"
      >
        <span aria-hidden>{done ? "🧺" : "🧺"}</span>
        <span aria-hidden>{"🥭".repeat(count)}</span>
        {!done && count === 0 && <span className="text-base text-slate font-medium">Tap me!</span>}
      </button>
      <div className="mt-3 flex items-center justify-between">
        <p className="font-bold text-ink" aria-live="polite">
          {done ? "🎉 Three mangoes — well counted!" : `${count} of ${target} mangoes`}
        </p>
        {count > 0 && !done && (
          <button type="button" onClick={() => setCount(0)} className="text-sm font-semibold text-slate hover:text-ink underline">
            Start over
          </button>
        )}
      </div>
      {done && (
        <Link href="/kids/sample/momo-mangoes" className="mt-4 inline-flex font-semibold text-kids-orange-deep hover:underline">
          Play the full quest with hints →
        </Link>
      )}
    </div>
  );
}
