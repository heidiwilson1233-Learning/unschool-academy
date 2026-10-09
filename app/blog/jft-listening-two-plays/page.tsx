import type { Metadata } from "next";
import { Section, Breadcrumbs, PageHero, Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "The Two Plays You Get: How JFT Listening Actually Works",
  description:
    "JFT-Basic listening gives you two plays of the audio and no way back. Here's how to use both plays well — general technique, not leaked content.",
};

export default function ListeningPost() {
  return (
    <>
      <PageHero eyebrow="Japanese learning" title="The two plays you get" sub="October 2026 · 2 min read" />
      <Section>
        <article className="max-w-3xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "The two plays you get" }]} />
          <div className="space-y-5 text-slate leading-relaxed text-[17px]">
            <p>
              Here is a small, verified fact about the JFT-Basic that changes how you should
              prepare: in the Listening Comprehension section, each audio plays <strong className="text-ink">at most
              twice</strong>, and you <strong className="text-ink">cannot go back</strong> to an earlier question once
              you move on. (We verified this against the Japan Foundation&apos;s official JFT-Basic
              pages on 2026-10-08.)
            </p>
            <p>
              Most learners waste the first play trying to catch every word — then panic on the
              second play because they still don&apos;t know what the question wants. There is a
              better division of labour.
            </p>
            <h2 className="text-2xl font-bold text-ink pt-4">Play one: the situation, not the words</h2>
            <p>
              On the first play, listen for only three things: <strong className="text-ink">who</strong> is
              speaking, <strong className="text-ink">where</strong> they are, and <strong className="text-ink">what
              decision</strong> is being made. Is it a customer and a shopkeeper? A colleague asking
              for a schedule change? Everyday Japanese listening is almost always a small real-world
              transaction — once you know which transaction, half the vocabulary becomes predictable.
            </p>
            <h2 className="text-2xl font-bold text-ink pt-4">Play two: the turn</h2>
            <p>
              On the second play, listen for the <strong className="text-ink">turn</strong> — the moment the
              situation changes. “The meeting is at 3… <em>actually</em>, can we make it 4?” The
              question almost always hinges on what happens <em>after</em> the turn, not before it.
              Train your ear to perk up at でも, ちょっと, and じつは — the little words that signal
              “everything I just said is about to change.”
            </p>
            <h2 className="text-2xl font-bold text-ink pt-4">What not to do</h2>
            <p>
              Don&apos;t try to translate sentence by sentence in your head — you&apos;ll fall two
              sentences behind and never catch up. Don&apos;t fixate on one unknown word; everyday
              dialogues are designed so the meaning survives without it. And don&apos;t spend your
              second play re-confirming what you already understood on the first.
            </p>
            <p>
              None of this is secret exam content — it&apos;s how listening works when you only get
              two chances. Our practice audio follows the same rule (replay with transcript after
              you answer), so the habit transfers. Try it in the{" "}
              <a href="/exams/jft-basic/diagnostic" className="text-academy-blue font-semibold hover:underline">
                free diagnostic
              </a>
              .
            </p>
          </div>
          <div className="mt-10 text-center">
            <Button href="/exams/jft-basic/diagnostic" size="lg">Practise listening now</Button>
          </div>
        </article>
      </Section>
    </>
  );
}
