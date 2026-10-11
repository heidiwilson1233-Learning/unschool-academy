"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Tara's first scene-led teaching interaction (demo, ages 5+).        */
/*                                                                    */
/* Journey: demonstration → interaction → helpful retry (no fail        */
/* states) → feedback → completion → off-screen invitation.           */
/* Accessibility: full keyboard operation, visible focus, polite       */
/* status announcements, and a reduced-motion variant that keeps the   */
/* learning signal (static highlight instead of animation).            */
/* ------------------------------------------------------------------ */

type Phase = "intro" | "demo" | "play" | "readback" | "done";

interface StoryCard {
  id: string;
  title: string;
  text: string;
  art: "jar" | "tree" | "nuts" | "moon";
}

const STORY: StoryCard[] = [
  {
    id: "wake",
    title: "Wake up",
    text: "Tara wakes up. Her nut jar is empty — oh no!",
    art: "jar",
  },
  {
    id: "tree",
    title: "Climb",
    text: "Tara climbs the tall oak tree to look for nuts.",
    art: "tree",
  },
  {
    id: "share",
    title: "Share",
    text: "Tara finds nuts and shares one with her friend.",
    art: "nuts",
  },
  {
    id: "home",
    title: "Home",
    text: "Back home — the jar is full. Sleepy, happy Tara.",
    art: "moon",
  },
];

const CORRECT_CHEERS = [
  "Yes! Tara claps her little paws — that's right!",
  "You got it! Tara does a happy wiggle.",
  "That's the one! Tara knew you could do it.",
];

const MISS_FIRST = [
  "Hmm, not quite. Take another look — try again!",
  "Not this one — no worries. Try again!",
  "Close! Tara is thinking too. Try again!",
];

const PROMPTS = ["Which happened first?", "What happened next?", "What happened next?", "What happened last?"];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* Hand-drawn orange squirrel — Tara, the words guide. */
function TaraArt({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label="Tara, an orange squirrel"
      className="shrink-0"
    >
      <ellipse cx="68" cy="62" rx="20" ry="30" fill="#F5A742" transform="rotate(18 68 62)" />
      <ellipse cx="66" cy="58" rx="11" ry="20" fill="#F8C179" transform="rotate(18 66 58)" />
      <ellipse cx="40" cy="66" rx="20" ry="24" fill="#F5A742" />
      <ellipse cx="40" cy="70" rx="11" ry="15" fill="#FBE3BC" />
      <circle cx="36" cy="50" r="15" fill="#F5A742" />
      <polygon points="26,40 22,24 34,32" fill="#F5A742" />
      <polygon points="46,40 50,24 38,32" fill="#F5A742" />
      <polygon points="28,36 26,28 32,32" fill="#FBE3BC" />
      <polygon points="44,36 46,28 40,32" fill="#FBE3BC" />
      <circle cx="31" cy="49" r="3" fill="#3B2A1A" />
      <circle cx="41" cy="49" r="3" fill="#3B2A1A" />
      <circle cx="32" cy="48" r="1" fill="#FFF7EA" />
      <circle cx="42" cy="48" r="1" fill="#FFF7EA" />
      <ellipse cx="36" cy="57" rx="3" ry="2.4" fill="#3B2A1A" />
      <path d="M36 59 q0 4 -4 5 M36 59 q0 4 4 5" stroke="#3B2A1A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M24 62 q-8 6 -6 14 M56 62 q8 6 6 14" stroke="#E08A2D" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="48" cy="72" r="7" fill="#F5A742" />
      <circle cx="32" cy="72" r="7" fill="#F5A742" />
      <ellipse cx="44" cy="70" rx="6" ry="4" fill="#8A5A2B" />
      <path d="M44 66 q-3 -5 1 -9" stroke="#5E3E1C" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* Simple hand-drawn spot illustrations for each story card. */
function CardArt({ art }: { art: StoryCard["art"] }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" role="img" aria-hidden="true" className="shrink-0">
      {art === "jar" && (
        <>
          <circle cx="52" cy="16" r="10" fill="#F6C453" />
          <rect x="18" y="34" width="26" height="28" rx="6" fill="#FBE3BC" stroke="#8A5A2B" strokeWidth="2.5" />
          <rect x="18" y="42" width="26" height="4" fill="#8A5A2B" opacity="0.25" />
          <text x="31" y="60" textAnchor="middle" fontSize="13" fill="#8A5A2B">∅</text>
        </>
      )}
      {art === "tree" && (
        <>
          <rect x="32" y="40" width="8" height="24" rx="3" fill="#8A5A2B" />
          <ellipse cx="36" cy="26" rx="22" ry="18" fill="#7FB069" />
          <ellipse cx="24" cy="32" rx="10" ry="9" fill="#9CC184" />
          <circle cx="44" cy="22" r="3.5" fill="#8A5A2B" />
          <circle cx="44" cy="22" r="1.6" fill="#C68B4E" />
        </>
      )}
      {art === "nuts" && (
        <>
          <ellipse cx="26" cy="46" rx="10" ry="12" fill="#8A5A2B" />
          <path d="M26 34 q-2 -8 4 -12" stroke="#5E3E1C" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="48" cy="46" rx="10" ry="12" fill="#C68B4E" />
          <path d="M48 34 q-2 -8 4 -12" stroke="#5E3E1C" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M34 30 q4 -6 0 -12 M38 30 q4 -6 0 -12" stroke="#E08A2D" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      {art === "moon" && (
        <>
          <path d="M46 8 a18 18 0 1 0 12 30 A14 14 0 1 1 46 8" fill="#F6E3B4" stroke="#C99A3C" strokeWidth="2" />
          <rect x="12" y="40" width="24" height="24" rx="6" fill="#F5A742" stroke="#8A5A2B" strokeWidth="2.5" />
          <circle cx="20" cy="48" r="3" fill="#8A5A2B" />
          <circle cx="28" cy="48" r="3" fill="#8A5A2B" />
          <circle cx="24" cy="56" r="3" fill="#8A5A2B" />
        </>
      )}
    </svg>
  );
}

const btnPrimary =
  "inline-flex items-center justify-center rounded-full bg-kids-orange px-6 py-3 text-base font-bold text-white shadow-sm transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kids-orange-ink active:scale-[0.98]";
const btnGhost =
  "inline-flex items-center justify-center rounded-full border-2 border-kids-orange/50 bg-paper px-5 py-2.5 text-sm font-bold text-kids-orange-ink transition-colors hover:bg-kids-orange/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kids-orange-ink";
const btnCard =
  "flex w-full items-center gap-4 rounded-2xl border-2 border-kids-orange/25 bg-paper p-4 text-left shadow-sm transition-all hover:border-kids-orange/60 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kids-orange-ink";

function VisuallyHiddenStatus({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}

export default function TaraScene() {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [demoIndex, setDemoIndex] = useState(0);
  const [pool, setPool] = useState<StoryCard[]>([]);
  const [placed, setPlaced] = useState<StoryCard[]>([]);
  const [misses, setMisses] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [tries, setTries] = useState(0);

  const step = placed.length;
  const remaining = useMemo(() => pool.filter((c) => !placed.some((p) => p.id === c.id)), [pool, placed]);

  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, [phase]);

  const startPlay = () => {
    setPool(shuffle(STORY));
    setPlaced([]);
    setMisses(0);
    setShowHint(false);
    setTries(0);
    setFeedback("Tara mixed the cards up. Pick them in story order — you can do this!");
    setPhase("play");
  };

  const startDemo = () => {
    setDemoIndex(0);
    setFeedback("Tara is showing you the story in order. Watch first — then you'll try!");
    setPhase("demo");
  };

  const pick = (card: StoryCard) => {
    const correct = STORY[step];
    if (card.id === correct.id) {
      const cheer = CORRECT_CHEERS[step % CORRECT_CHEERS.length];
      setFeedback(cheer);
      setPlaced((p) => [...p, card]);
      setMisses(0);
      setShowHint(false);
      if (step + 1 === STORY.length) {
        setFeedback(`${cheer} That's the whole story, in order!`);
        setPhase("readback");
      }
    } else {
      const n = misses + 1;
      setMisses(n);
      setTries((t) => t + 1);
      const msg =
        n === 1
          ? MISS_FIRST[step % MISS_FIRST.length]
          : "Still not quite — and that's okay. Tara has a hint for you below.";
      setFeedback(msg);
      if (n >= 2) setShowHint(true);
    }
  };

  const restart = () => {
    setDemoIndex(0);
    setPlaced([]);
    setMisses(0);
    setShowHint(false);
    setFeedback("");
    setTries(0);
    setPhase("intro");
  };

  const motionCls = reducedMotion ? "" : "transition-all duration-500";

  return (
    <div className="rounded-3xl border border-kids-orange/25 bg-kids-cream/60 p-6 md:p-10">
      {/* Persistent controls: replay + help reachable in every phase */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <TaraArt size={64} />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-kids-orange-ink">Tara · Words guide</p>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-extrabold text-ink focus:outline-none md:text-2xl"
            >
              {phase === "intro" && "Tara's story game"}
              {phase === "demo" && "Watch first: Tara shows the story"}
              {phase === "play" && PROMPTS[step]}
              {phase === "readback" && "The story, in your order"}
              {phase === "done" && "You finished the story!"}
            </h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" className={btnGhost} onClick={startDemo} aria-label="Replay the story demonstration">
            Replay story
          </button>
          <button
            type="button"
            className={btnGhost}
            onClick={() => setHelpOpen((o) => !o)}
            aria-expanded={helpOpen}
            aria-controls="tara-help-panel"
          >
            {helpOpen ? "Close help" : "Help"}
          </button>
        </div>
      </div>

      {helpOpen && (
        <div
          id="tara-help-panel"
          role="region"
          aria-label="How to play"
          className="mb-6 rounded-2xl border border-border bg-paper p-5 text-sm text-slate"
        >
          <p className="font-bold text-ink">How to play</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>First, Tara shows you a short story with 4 picture cards, in order.</li>
            <li>Then the cards get mixed up. Tap or press Enter on the card you think comes next.</li>
            <li>There are no wrong answers here — Tara gives hints if you need them.</li>
            <li>A grown-up can sit with you. When you finish, try telling the story out loud at home!</li>
          </ul>
        </div>
      )}

      <VisuallyHiddenStatus message={feedback} />

      {/* Visible feedback strip (mirrors the status announcement) */}
      {feedback && phase !== "intro" && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-kids-orange/30 bg-paper p-4">
          <TaraArt size={44} />
          <p className="text-base font-medium text-ink" aria-hidden="true">
            {feedback}
          </p>
        </div>
      )}

      {/* ---------------- INTRO ---------------- */}
      {phase === "intro" && (
        <div className="flex flex-col items-center gap-6 text-center">
          <TaraArt size={120} />
          <div className="max-w-md">
            <p className="text-lg text-ink">
              Hi! I'm <strong>Tara</strong>. I love words and stories. Let's learn how a story goes —{" "}
              <strong>beginning, middle, end</strong>.
            </p>
            <p className="mt-2 text-sm text-slate">
              First I'll show you my story. Then the cards get all mixed up, and <em>you</em> put them back in
              order. Ready?
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" className={btnPrimary} onClick={startDemo}>
              Watch the story
            </button>
            <button type="button" className={btnGhost} onClick={startPlay}>
              Skip to the game
            </button>
          </div>
        </div>
      )}

      {/* ---------------- DEMO ---------------- */}
      {phase === "demo" && (
        <div>
          <ol className="grid gap-4 sm:grid-cols-2" aria-label="Story in order">
            {STORY.map((card, i) => {
              const shown = i <= demoIndex;
              return (
                <li
                  key={card.id}
                  className={`${btnCard} ${motionCls} ${shown ? "opacity-100" : "opacity-40"}`}
                  aria-current={i === demoIndex ? "step" : undefined}
                >
                  <CardArt art={card.art} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-kids-orange-ink">
                      {shown ? `Part ${i + 1} of 4` : "…"}
                    </p>
                    <p className="font-bold text-ink">{shown ? card.title : "?"}</p>
                    <p className="text-sm text-slate">{shown ? card.text : "Keep watching…"}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            {demoIndex < STORY.length - 1 ? (
              <button
                type="button"
                className={btnPrimary}
                onClick={() => {
                  setDemoIndex((i) => i + 1);
                  setFeedback(`Part ${demoIndex + 2} of 4: ${STORY[demoIndex + 1].text}`);
                }}
              >
                Next part
              </button>
            ) : (
              <button type="button" className={btnPrimary} onClick={startPlay}>
                Mix the cards — my turn!
              </button>
            )}
            <button type="button" className={btnGhost} onClick={() => setDemoIndex(0)}>
              Start the story over
            </button>
          </div>
        </div>
      )}

      {/* ---------------- PLAY ---------------- */}
      {phase === "play" && (
        <div>
          {/* placed-so-far strip */}
          {placed.length > 0 && (
            <div className="mb-5" aria-label="Cards placed so far">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-kids-orange-ink">Your story so far</p>
              <ol className="flex flex-wrap gap-2">
                {placed.map((card, i) => (
                  <li
                    key={card.id}
                    className="rounded-full border border-kids-orange/40 bg-paper px-4 py-1.5 text-sm font-bold text-ink"
                  >
                    {i + 1}. {card.title}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div role="group" aria-label={PROMPTS[step]} className="grid gap-4 sm:grid-cols-2">
            {remaining.map((card) => (
              <button key={card.id} type="button" className={btnCard} onClick={() => pick(card)}>
                <CardArt art={card.art} />
                <div>
                  <p className="font-bold text-ink">{card.title}</p>
                  <p className="text-sm text-slate">{card.text}</p>
                </div>
              </button>
            ))}
          </div>

          {showHint && step < STORY.length && (
            <div className="mt-5 rounded-2xl border-2 border-dashed border-kids-orange/50 bg-paper p-4">
              <p className="text-sm font-bold text-ink">Tara's hint</p>
              <p className="mt-1 text-sm text-slate">
                Look for the card where <strong>{STORY[step].title.toLowerCase()}</strong> happens:{" "}
                {STORY[step].text}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ---------------- READBACK ---------------- */}
      {phase === "readback" && (
        <div>
          <p className="mb-4 text-base text-ink">
            Listen — here is <strong>your</strong> story, all in order:
          </p>
          <ol className="grid gap-4 sm:grid-cols-2" aria-label="Completed story in order">
            {placed.map((card, i) => (
              <li key={card.id} className={`${btnCard} cursor-default border-kids-orange/50`}>
                <CardArt art={card.art} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-kids-orange-ink">Part {i + 1} of 4</p>
                  <p className="font-bold text-ink">{card.title}</p>
                  <p className="text-sm text-slate">{card.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <button type="button" className={btnPrimary} onClick={() => setPhase("done")}>
              We did it!
            </button>
          </div>
        </div>
      )}

      {/* ---------------- DONE ---------------- */}
      {phase === "done" && (
        <div className="flex flex-col items-center gap-5 text-center">
          <div aria-hidden="true" className="flex gap-2">
            {["#F5A742", "#7FB069", "#F6C453", "#E08A2D", "#9CC184", "#F8C179"].map((c, i) => (
              <span
                key={i}
                className={`inline-block h-4 w-4 rounded-full ${reducedMotion ? "" : "animate-bounce"}`}
                style={{ backgroundColor: c, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
          <TaraArt size={110} />
          <div className="max-w-md">
            <p className="text-xl font-extrabold text-ink">You told the whole story in order!</p>
            <p className="mt-2 text-base text-ink">
              Beginning, middle, end — you did every part{` after ${tries === 0 ? "no" : tries} ${tries === 1 ? "try" : "tries"}`}.
              Tara is so proud.
            </p>
            <div className="mt-5 rounded-2xl border-2 border-dashed border-kids-orange/50 bg-paper p-5 text-left">
              <p className="font-bold text-ink">An invitation for later (no screen needed)</p>
              <p className="mt-1 text-sm text-slate">
                Tonight, tell this story to someone at home — a parent, grandparent, or friend. Be the
                storyteller: <em>wake up… climb… share… home.</em> You can draw the four cards on paper too!
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" className={btnPrimary} onClick={restart}>
              Play again
            </button>
            <button type="button" className={btnGhost} onClick={startDemo}>
              Watch the story again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
