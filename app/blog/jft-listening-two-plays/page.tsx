import type { Metadata } from "next";
import Link from "next/link";
import { Section, Breadcrumbs, Button } from "@/components/ui";

/* Read time: ceil(visible words / 200), recomputed whenever the copy changes.
   Keep app/blog/page.tsx's entry for this post in sync. */
const READ_TIME = "2 min read";

export const metadata: Metadata = {
  title: "The Two Plays You Get: How JFT Listening Actually Works",
  description:
    "JFT-Basic listening gives you two plays of the audio and no way back. Here's how to use both plays well — general technique, not leaked content.",
  alternates: { canonical: "/blog/jft-listening-two-plays" },
  openGraph: {
    type: "article",
    url: "/blog/jft-listening-two-plays",
    title: "The Two Plays You Get: How JFT Listening Actually Works",
    description:
      "JFT-Basic listening gives you two plays of the audio and no way back. Here's how to use both plays well — general technique, not leaked content.",
    publishedTime: "2026-10",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Two Plays You Get: How JFT Listening Actually Works",
    description:
      "Two plays, no going back. How to split the work: the situation on play one, the turn on play two.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://unschool.academy/blog" },
        {
          "@type": "ListItem",
          position: 3,
          name: "The two plays you get",
          item: "https://unschool.academy/blog/jft-listening-two-plays",
        },
      ],
    },
    {
      "@type": "BlogPosting",
      headline: "The Two Plays You Get: How JFT Listening Actually Works",
      datePublished: "2026-10",
      inLanguage: "en",
      author: { "@type": "Organization", name: "Unschool Academy content team" },
      publisher: { "@type": "Organization", name: "Unschool Academy" },
      mainEntityOfPage: "https://unschool.academy/blog/jft-listening-two-plays",
    },
  ],
};

export default function ListeningPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Authored masthead — breadcrumbs above the h1, type as the hero. */}
      <Section className="pt-10 md:pt-14 pb-2">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs
            trail={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: "The two plays you get" },
            ]}
          />
          <p className="mt-6 text-[11px] font-mono uppercase tracking-[0.2em] text-academy-teal-dark">
            Listening · JFT-Basic strategy
          </p>
          <h1 className="mt-3 font-display font-bold text-ink tracking-[-0.04em] text-balance text-[clamp(2.75rem,7vw,5rem)] leading-[1.02]">
            The two plays you get
          </h1>
          <p className="mt-5 text-slate text-[15px]">
            <time dateTime="2026-10">October 2026</time> · {READ_TIME} ·{" "}
            <span>By the Unschool Academy content team</span>
          </p>
        </div>
      </Section>

      <Section>
        <article className="max-w-3xl mx-auto">
          <div className="space-y-5 text-slate leading-relaxed text-[17px]">
            <p>
              Here is a small, verified fact about the JFT-Basic that changes how you should
              prepare: in the Listening Comprehension section, each audio plays{" "}
              <strong className="text-ink">at most twice</strong>, and you{" "}
              <strong className="text-ink">cannot go back</strong> to an earlier question once
              you move on. This is straight from the{" "}
              <a
                href="https://www.jpf.go.jp/jft-basic/e/about/index.html"
                className="text-academy-blue font-semibold hover:underline"
              >
                Japan Foundation&apos;s official test description
              </a>
              .
            </p>
            <p>
              Most learners waste the first play trying to catch every word. Then they panic on
              the second play because they still don&apos;t know what the question wants. There
              is a better division of labour.
            </p>
            <h2 className="text-2xl font-bold text-ink pt-4">
              First play: what&apos;s actually happening?
            </h2>
            <p>
              The questions are shown in English on screen, so read the question before you
              press play. That gives your first play a target. Then listen for only three
              things: <strong className="text-ink">who</strong> is speaking,{" "}
              <strong className="text-ink">where</strong> they are, and{" "}
              <strong className="text-ink">what decision</strong> is being made. Is it a
              customer and a shopkeeper? A colleague asking for a schedule change? Everyday
              Japanese listening is almost always a small real-world transaction: once you know
              which transaction, half the vocabulary becomes predictable.
            </p>
            <h2 className="text-2xl font-bold text-ink pt-4">Second play: where does it turn?</h2>
            <p>
              On the second play, listen for the <strong className="text-ink">turn</strong>:
              the moment the situation changes. &ldquo;The meeting is at 3… <em>actually</em>,
              can we make it 4?&rdquo; The question almost always hinges on what happens{" "}
              <em>after</em> the turn, not before it. Train your ear to perk up at{" "}
              <span lang="ja" className="jp">
                でも
              </span>
              ,{" "}
              <span lang="ja" className="jp">
                ちょっと
              </span>
              , and{" "}
              <span lang="ja" className="jp">
                じつは
              </span>
              : the little words that signal &ldquo;everything I just said is about to
              change.&rdquo;
            </p>
            <h2 className="text-2xl font-bold text-ink pt-4">
              What&apos;s the fastest way to waste both plays?
            </h2>
            <p>
              Don&apos;t try to translate sentence by sentence in your head. You&apos;ll fall
              two sentences behind and never catch up. Don&apos;t fixate on one unknown word;
              everyday dialogues are designed so the meaning survives without it. And don&apos;t
              spend your second play re-confirming what you already understood on the first.
            </p>
            <p>
              None of this is secret exam content. It&apos;s how listening works when you only
              get two chances. In our practice player you can replay the audio as often as you
              like, so discipline yourself there: two plays, question read first, then answer.
              The habit transfers.
            </p>
          </div>

          {/* Discovery: real relationships, editorial rows. */}
          <nav aria-label="Keep reading" className="mt-12">
            <h2 className="text-2xl font-bold text-ink">Keep reading</h2>
            <ul className="mt-4 border-t border-border">
              <li className="border-b border-border">
                <Link
                  href="/exams/jft-basic/diagnostic"
                  className="group flex items-baseline gap-4 py-4"
                >
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">01</span>
                  <span>
                    <span className="block font-bold text-ink group-hover:underline">
                      Test the technique
                    </span>
                    <span className="block text-[15px]">
                      The free diagnostic includes two listening items. Ten questions, five
                      minutes.
                    </span>
                  </span>
                </Link>
              </li>
              <li className="border-b border-border">
                <Link href="/free-practice" className="group flex items-baseline gap-4 py-4">
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">02</span>
                  <span>
                    <span className="block font-bold text-ink group-hover:underline">
                      Practise the turn
                    </span>
                    <span className="block text-[15px]">
                      Free sample questions, answered live. No account needed.
                    </span>
                  </span>
                </Link>
              </li>
              <li className="border-b border-border">
                <Link
                  href="/exams/how-practice-works"
                  className="group flex items-baseline gap-4 py-4"
                >
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">03</span>
                  <span>
                    <span className="block font-bold text-ink group-hover:underline">
                      How practice is designed here
                    </span>
                    <span className="block text-[15px]">
                      Retrieval, feedback, and why a sample question teaches.
                    </span>
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </article>
      </Section>

      {/* Frictionless close: the product sells itself before any account. */}
      <Section>
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-paper p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-ink">Put the habit into practice</h2>
            <p className="mt-2 text-slate text-[16px]">
              The free diagnostic includes two listening items. Ten questions, five minutes, no
              account needed.
            </p>
          </div>
          <Button href="/exams/jft-basic/diagnostic" className="shrink-0">
            Take the free diagnostic
          </Button>
        </div>
      </Section>
    </>
  );
}
