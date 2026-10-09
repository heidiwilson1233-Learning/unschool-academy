"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, PartyPopper, ShoppingBasket, X } from "lucide-react";
import { Button } from "./ui";
import { Momo } from "./characters";

/* ---------- JFT-Basic sampler ---------- */

const JFT_OPTIONS = [
  { id: "a", jp: "おはよう", en: "good morning" },
  { id: "b", jp: "こんばんは", en: "good evening" },
  { id: "c", jp: "さようなら", en: "goodbye" },
] as const;
const JFT_CORRECT = "b";

/* Factual, in-scope tips for wrong picks — no new exam facts, just this question. */
const JFT_TIPS: Record<string, string> = {
  a: "おはよう (ohayō) is the morning greeting — but it's 8pm.",
  c: "さようなら (sayōnara) is for parting — and you've just met.",
};

function DraftBadge() {
  return (
    <span className="ml-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 align-middle text-[11px] font-bold uppercase tracking-wide text-amber-800">
      Draft — pending expert review
    </span>
  );
}

/* One-question JFT sampler: real interaction, real feedback */
export function JftSampler() {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === JFT_CORRECT;
  const wrong = picked !== null && !correct;

  return (
    <div className="rounded-xl border border-border bg-canvas p-5 md:p-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-academy-teal-dark mb-4">
        Try it — JFT-Basic sample
      </h3>
      <fieldset>
        <legend className="mb-4">
          <span className="block font-semibold text-ink text-lg leading-snug">
            It is 8pm. You meet your neighbour. What do you say?
          </span>
          <span className="mt-1 block text-sm text-slate">
            Choose the natural everyday phrase.
          </span>
        </legend>
        <div className="space-y-2">
          {JFT_OPTIONS.map((o) => {
            const isPicked = picked === o.id;
            const showCorrect = picked !== null && o.id === JFT_CORRECT;
            const showWrong = isPicked && o.id !== JFT_CORRECT;
            return (
              <label
                key={o.id}
                className={`flex cursor-pointer flex-col gap-0.5 rounded-xl border-2 px-4 py-3 transition-[border-color,background-color,transform] duration-200 ease-[var(--ease-signature)] active:scale-[0.99] has-[input:focus-visible]:outline-[3px] has-[input:focus-visible]:outline-academy-teal has-[input:focus-visible]:outline-offset-2 sm:flex-row sm:items-center sm:gap-3 ${
                  showCorrect
                    ? "border-academy-teal bg-academy-teal/10"
                    : showWrong
                      ? "border-red-400 bg-red-50"
                      : isPicked
                        ? "border-academy-blue bg-academy-blue/5"
                        : "border-border bg-paper hover:border-academy-blue/50"
                }`}
              >
                <input
                  type="radio"
                  name="jft-sampler"
                  value={o.id}
                  checked={isPicked}
                  onChange={() => setPicked(o.id)}
                  className="sr-only"
                />
                <span className="jp text-lg font-semibold text-ink">
                  {o.jp}
                </span>
                <span className="text-sm text-slate sm:ml-1">
                  &ldquo;{o.en}&rdquo;
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Feedback is announced — the whole point of the sampler. */}
      <div role="status" aria-live="polite" className="mt-4">
        {correct && (
          <p key="correct" className="quest-pop flex items-start gap-2 text-sm text-slate">
            <span
              aria-hidden
              className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-academy-teal text-white"
            >
              <Check className="h-3 w-3" strokeWidth={3.5} />
            </span>
            <span>
              <span className="font-semibold text-ink">Correct. </span>
              <span className="font-semibold text-ink">Why:</span> こんばんは
              (konbanwa) is the standard evening greeting. おはよう is for
              mornings, さようなら when parting.
              <DraftBadge />
            </span>
          </p>
        )}
        {wrong && (
          <p key="wrong" className="quest-pop flex items-start gap-2 text-sm text-slate">
            <span
              aria-hidden
              className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white"
            >
              <X className="h-3 w-3" strokeWidth={3.5} />
            </span>
            <span>
              <span className="font-semibold text-ink">Not quite. </span>
              {JFT_TIPS[picked as string]} No penalty here — try another.
            </span>
          </p>
        )}
      </div>

      {/* Progress promise — Khan pattern: this is Q1 of a real 10-step path. */}
      <div className="mt-5 border-t border-border pt-4">
        <div
          className="flex flex-wrap items-center gap-x-2 gap-y-2"
          role="img"
          aria-label={
            picked
              ? "Sample question answered — this was question 1 of 10 in the free diagnostic"
              : "This sample is question 1 of 10 in the free diagnostic"
          }
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              className={`h-2 w-2 rounded-full ${
                i === 0 && picked ? "bg-academy-teal" : "bg-border"
              }`}
            />
          ))}
          <span className="ml-1 text-xs font-semibold text-slate">
            Q1 of 10 · the other 9 are in the free diagnostic
          </span>
        </div>
      </div>

      {/* Completion CTA lives at the completion moment, inside the card. */}
      {correct && (
        <div key="cta" className="quest-pop mt-4">
          <Button href="/exams/jft-basic/diagnostic" size="lg">
            Keep going — Q2 of 10 in the free diagnostic
          </Button>
          <p className="mt-2 text-xs text-slate">Free · no account</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Kids sampler ---------- */

const CONFETTI_COLORS = ["#f2a66c", "#147d75", "#c97a2e", "#6f9440"];

/* Art-directed mango: filled = collected, dashed slot = waiting. */
function Mango({ filled, pop }: { filled: boolean; pop: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className={`h-9 w-9 ${pop ? "mango-pop" : ""}`}
    >
      {filled ? (
        <>
          <ellipse cx="24" cy="27" rx="14" ry="12.5" fill="#f2a66c" />
          <ellipse
            cx="18.5"
            cy="22.5"
            rx="5.5"
            ry="4"
            fill="#f9c98f"
            opacity="0.85"
          />
          <path
            d="M24 15c1.5-4.5 5-7.5 10-8.5"
            stroke="#5d7a2a"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M33 6.5c-4.5.5-7.5 2.5-9 5.5 3.5-.5 6.5-2.5 9-5.5z"
            fill="#6f9440"
          />
        </>
      ) : (
        <ellipse
          cx="24"
          cy="27"
          rx="14"
          ry="12.5"
          fill="none"
          stroke="#c97a2e"
          strokeOpacity="0.45"
          strokeWidth="2.5"
          strokeDasharray="5 4"
        />
      )}
    </svg>
  );
}

/* One-step kids sampler: real counting interaction */
export function KidsSampler() {
  const [count, setCount] = useState(0);
  const target = 3;
  const done = count === target;
  const basketRef = useRef<HTMLButtonElement>(null);
  const questBtnRef = useRef<HTMLAnchorElement>(null);

  /* Keyboard users keep their place: on completion, focus the quest CTA. */
  useEffect(() => {
    if (done) questBtnRef.current?.focus();
  }, [done]);

  const startOver = () => {
    setCount(0);
    basketRef.current?.focus();
  };

  return (
    <div className="rounded-xl border-2 border-kids-orange/40 bg-paper p-5 md:p-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-kids-orange-ink mb-4">
        Try it — Momo&rsquo;s counting game
      </h3>
      <div className="flex items-center gap-4">
        <Momo decorative className="w-20 h-20 shrink-0 animate-idle" />
        <p className="font-semibold text-ink">
          Momo needs{" "}
          <span className="text-kids-orange-ink font-extrabold">
            {target} mangoes
          </span>{" "}
          for the picnic. Tap the basket to add one!
        </p>
      </div>

      <button
        ref={basketRef}
        type="button"
        onClick={() => setCount((c) => Math.min(c + 1, target))}
        disabled={done}
        aria-label={`Add a mango. ${count} of ${target} added.`}
        className="mt-4 flex min-h-[104px] w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-b-4 border-dashed border-kids-orange-deep/60 bg-kids-cream transition-[transform,border-color] duration-150 ease-[var(--ease-signature)] hover:border-kids-orange-ink active:translate-y-[3px] active:border-b-2 disabled:cursor-default disabled:opacity-70"
      >
        <ShoppingBasket
          aria-hidden
          className="h-9 w-9 shrink-0 text-kids-orange-ink"
        />
        <span aria-hidden className="flex gap-1.5">
          {Array.from({ length: target }).map((_, i) => (
            <Mango key={i} filled={i < count} pop={i === count - 1} />
          ))}
        </span>
        {!done && count === 0 && (
          <span className="text-base text-slate font-medium">Tap me!</span>
        )}
      </button>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="font-bold text-ink" aria-live="polite">
          {count} of {target} mangoes
        </p>
        {count > 0 && !done && (
          <button
            type="button"
            onClick={startOver}
            className="text-sm font-semibold text-slate hover:text-ink underline"
          >
            Start over
          </button>
        )}
      </div>

      {/* Celebration takeover (in-card) — Duolingo register, GPU-only, reduced-motion-safe. */}
      {done && (
        <div className="quest-pop relative mt-4 overflow-hidden rounded-2xl border-2 border-kids-orange-deep/50 bg-kids-cream p-6 text-center">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="confetti-piece rounded-[2px]"
                style={
                  {
                    left: `${(i * 67) % 100}%`,
                    width: 8,
                    height: 8,
                    backgroundColor: CONFETTI_COLORS[i % 4],
                    "--dx": `${((i * 41) % 80) - 40}px`,
                    "--delay": `${(i * 113) % 600}ms`,
                    "--dur": `${2200 + ((i * 53) % 900)}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <div className="relative">
            <PartyPopper
              aria-hidden
              className="mx-auto h-10 w-10 text-kids-orange-ink"
            />
            <p className="mt-3 text-xl font-extrabold text-ink">
              Three mangoes — well counted!
            </p>
            <p className="mt-1 text-sm text-slate">
              Momo&rsquo;s picnic basket is full.
            </p>
            <Button
              ref={questBtnRef}
              variant="kids"
              size="lg"
              href="/kids/sample/momo-mangoes"
              className="mt-4"
            >
              Play the full quest with hints
            </Button>
            <p className="mt-3 text-xs text-slate">
              Parents: the full quest includes hints and a transfer challenge
              (same skill, new scene).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
