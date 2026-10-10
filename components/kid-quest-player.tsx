"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button, Card, Badge, Breadcrumbs } from "@/components/ui";
import { Momo, Tara, Bobo } from "@/components/characters";
import type { KidQuest } from "@/lib/kids";

const CharArt = { momo: Momo, tara: Tara, bobo: Bobo };

function speak(text: string, enabled: boolean) {
  if (!enabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-IN";
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

type Phase =
  | { kind: "story"; beat: number }
  | { kind: "interaction"; index: number }
  | { kind: "done" };

export function KidQuestPlayer({ quest }: { quest: KidQuest }) {
  const [phase, setPhase] = useState<Phase>({ kind: "story", beat: 0 });
  const [sound, setSound] = useState(true);
  const [streak, setStreak] = useState(0);
  const [hintShown, setHintShown] = useState(false);
  const [stars, setStars] = useState(0);
  const Art = CharArt[quest.character];

  const advance = useCallback(() => {
    setHintShown(false);
    setPhase((p) => {
      if (p.kind === "story") {
        if (p.beat + 1 < quest.story_beats.length) return { kind: "story", beat: p.beat + 1 };
        return quest.interactions.length > 0 ? { kind: "interaction", index: 0 } : { kind: "done" };
      }
      if (p.kind === "interaction") {
        if (p.index + 1 < quest.interactions.length) return { kind: "interaction", index: p.index + 1 };
        return { kind: "done" };
      }
      return p;
    });
  }, [quest]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (correct) {
        const s = streak + 1;
        setStreak(s);
        setStars((n) => n + 1);
        speak(quest.feedback.correct, sound);
        // Smart learning: 3 in a row → the character notices (difficulty would step up in a longer chain)
        setTimeout(advance, 1400);
      } else {
        setStreak(0);
        setHintShown(true);
        speak(quest.feedback.retry, sound);
      }
    },
    [streak, sound, quest, advance]
  );

  if (phase.kind === "done") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Art className="w-32 h-32 mx-auto animate-bounce" />
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight">You did it! 🎉</h1>
        <p className="mt-3 text-lg text-slate">You earned {stars} star{stars === 1 ? "" : "s"}!</p>
        <Card className="mt-8 !p-6 text-left">
          <p className="font-bold text-ink">🌳 Try this off-screen:</p>
          <p className="mt-2 text-slate">{quest.off_screen}</p>
        </Card>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href={`/kids/subjects/${quest.subject}`} variant="kids" size="lg">More {quest.subject} quests</Button>
          <Button href="/kids/library" variant="secondary" size="lg">Pick another book</Button>
        </div>
        <p className="mt-6 text-xs text-slate/70">Quest complete — time for a break! {quest.character === "momo" ? "Momo" : quest.character === "tara" ? "Tara" : "Bobo"} will remember what you learned.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs trail={[
        { label: "Home", href: "/" },
        { label: "Kids", href: "/kids" },
        { label: quest.title },
      ]} />
      <div className="mt-4 flex items-center gap-4">
        <Art className="w-20 h-20 shrink-0" />
        <div className="flex-1">
          <Badge tone="kids">{quest.subject} · {quest.track}</Badge>
          <h1 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight">{quest.title}</h1>
        </div>
        <button
          onClick={() => setSound((s) => !s)}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold"
          aria-label={sound ? "Mute voice" : "Unmute voice"}
        >
          {sound ? "🔊" : "🔇"}
        </button>
      </div>
      {/* progress dots */}
      <div className="mt-4 flex gap-2">
        {quest.story_beats.map((_, i) => (
          <div key={`s${i}`} className={`h-2 flex-1 rounded-full ${phase.kind === "story" && phase.beat >= i ? "bg-amber-400" : "bg-line"}`} />
        ))}
        {quest.interactions.map((_, i) => (
          <div key={`q${i}`} className={`h-2 flex-1 rounded-full ${phase.kind === "interaction" && phase.index >= i ? "bg-emerald-400" : "bg-line"}`} />
        ))}
      </div>

      <Card className="mt-6 !p-8">
        {phase.kind === "story" && (
          <div>
            <p className="text-xl md:text-2xl leading-relaxed">{quest.story_beats[phase.beat].text}</p>
            <div className="mt-6 flex gap-3">
              <Button onClick={() => speak(quest.story_beats[(phase as { beat: number }).beat].text, true)} variant="secondary">🔊 Read to me</Button>
              <Button onClick={advance} variant="kids">
                {phase.beat + 1 < quest.story_beats.length ? "Next" : quest.interactions.length > 0 ? "Let's play!" : "Finish"}
              </Button>
            </div>
          </div>
        )}

        {phase.kind === "interaction" && (
          <InteractionView
            interaction={quest.interactions[phase.index]}
            hintShown={hintShown}
            onAnswer={handleAnswer}
            onSpeak={() => speak(quest.interactions[(phase as { index: number }).index].prompt, sound)}
          />
        )}
      </Card>

      <p className="mt-4 text-center text-sm text-slate/70">
        {streak >= 2 ? "You're on a roll! ⭐" : "Take your time — there's no rush here."}
      </p>
    </div>
  );
}

function InteractionView({
  interaction,
  hintShown,
  onAnswer,
  onSpeak,
}: {
  interaction: KidQuest["interactions"][number];
  hintShown: boolean;
  onAnswer: (correct: boolean) => void;
  onSpeak: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  if (interaction.type === "tap-choice") {
    return (
      <div>
        <p className="text-xl font-bold">{interaction.prompt}</p>
        <button onClick={onSpeak} className="mt-2 text-sm font-semibold text-sky-700">🔊 Read the question</button>
        <div className="mt-6 grid gap-3">
          {interaction.options!.map((opt, i) => (
            <button
              key={i}
              onClick={() => { setPicked(i); onAnswer(i === interaction.correct); }}
              className={`rounded-2xl border-2 px-6 py-4 text-left text-lg font-semibold transition-all ${
                picked === i
                  ? i === interaction.correct
                    ? "border-emerald-400 bg-emerald-50 scale-[1.02]"
                    : "border-rose-300 bg-rose-50"
                  : "border-line bg-white hover:border-amber-300 hover:scale-[1.01]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {hintShown && picked !== interaction.correct && (
          <p className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-amber-900">
            💡 Good try! Listen again, then pick another one — you've got this!
          </p>
        )}
      </div>
    );
  }

  if (interaction.type === "count-tap") {
    return (
      <div className="text-center">
        <p className="text-xl font-bold">{interaction.prompt}</p>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-full bg-amber-100 border-4 border-amber-300 text-5xl font-extrabold active:scale-95 transition-transform"
          aria-label="Tap to count"
        >
          {count}
        </button>
        <p className="mt-3 text-slate">Tap the big circle each time you count one!</p>
        <div className="mt-6 grid gap-3 text-left">
          {interaction.options!.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(i === interaction.correct)}
              className="rounded-2xl border-2 border-line bg-white px-6 py-4 text-lg font-semibold hover:border-amber-300"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (interaction.type === "order") {
    const [order, setOrder] = useState<string[]>([]);
    const remaining = interaction.options!.filter((o) => !order.includes(o));
    return (
      <div>
        <p className="text-xl font-bold">{interaction.prompt}</p>
        <p className="mt-2 text-sm text-slate">Tap the cards in the right order.</p>
        <div className="mt-4 flex min-h-[3.5rem] flex-wrap gap-2 rounded-xl bg-slate-50 border border-dashed border-line p-3">
          {order.map((o, i) => (
            <span key={i} className="rounded-lg bg-ink text-white px-3 py-2 text-sm font-bold">{i + 1}. {o}</span>
          ))}
          {order.length === 0 && <span className="text-slate/60 text-sm px-2 py-2">Your order appears here…</span>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {remaining.map((o) => (
            <button key={o} onClick={() => {
              const next = [...order, o];
              setOrder(next);
              if (next.length === interaction.options!.length) {
                const correctOrder = interaction.options!;
                onAnswer(next.every((v, idx) => v === correctOrder[idx]));
                if (!next.every((v, idx) => v === correctOrder[idx])) setTimeout(() => setOrder([]), 1600);
              }
            }} className="rounded-xl border-2 border-line bg-white px-4 py-3 font-semibold hover:border-amber-300">
              {o}
            </button>
          ))}
        </div>
        {order.length > 0 && (
          <button onClick={() => setOrder([])} className="mt-3 text-sm font-semibold text-slate underline">Start over</button>
        )}
      </div>
    );
  }

  if (interaction.type === "speak-repeat") {
    return (
      <div className="text-center">
        <p className="text-xl font-bold">{interaction.prompt}</p>
        <button onClick={onSpeak} className="mt-4 rounded-full border-2 border-line px-6 py-3 text-lg font-bold hover:border-amber-300">🔊 Hear it first</button>
        <div className="mt-6">
          <Button onClick={() => onAnswer(true)} variant="kids" size="lg">I said it! ⭐</Button>
        </div>
        <p className="mt-3 text-sm text-slate">Say it out loud — there are no wrong answers here.</p>
      </div>
    );
  }

  // draw
  return (
    <div className="text-center">
      <p className="text-xl font-bold">{interaction.prompt}</p>
      <div className="mx-auto mt-6 h-64 rounded-2xl border-4 border-dashed border-amber-300 bg-amber-50/50 flex items-center justify-center">
        <p className="text-slate px-8">🖍️ Grab paper and crayons and draw it!<br /><span className="text-sm">(Drawing happens off-screen — the best kind!)</span></p>
      </div>
      <div className="mt-6">
        <Button onClick={() => onAnswer(true)} variant="kids" size="lg">I drew it! 🎨</Button>
      </div>
    </div>
  );
}
