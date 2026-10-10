import type { Metadata } from "next";
import Link from "next/link";
import { Section, Breadcrumbs, Button, Badge } from "@/components/ui";

/* Read time: ceil(visible words / 200), recomputed whenever the copy changes.
   Keep app/blog/page.tsx's entry for this post in sync. */
const READ_TIME = "2 min read";

export const metadata: Metadata = {
  title: "4 Station Kanji That Make Any Japanese Station Readable",
  description:
    "Learn 出口, 入口, 改札, and 乗換 as pairs. The four kanji compounds that make Japanese stations navigable.",
  alternates: { canonical: "/blog/station-kanji" },
  openGraph: {
    type: "article",
    url: "/blog/station-kanji",
    title: "4 Station Kanji That Make Any Japanese Station Readable",
    description:
      "Learn 出口, 入口, 改札, and 乗換 as pairs. The four kanji compounds that make Japanese stations navigable.",
    publishedTime: "2026-10",
  },
  twitter: {
    card: "summary_large_image",
    title: "4 Station Kanji That Make Any Japanese Station Readable",
    description:
      "出口 vs 入口. Four kanji as pairs, and the station starts reading itself to you.",
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
          name: "Station kanji",
          item: "https://unschool.academy/blog/station-kanji",
        },
      ],
    },
    {
      "@type": "BlogPosting",
      headline: "4 Station Kanji That Make Any Japanese Station Readable",
      datePublished: "2026-10",
      inLanguage: "en",
      author: { "@type": "Organization", name: "Unschool Academy content team" },
      publisher: { "@type": "Organization", name: "Unschool Academy" },
      mainEntityOfPage: "https://unschool.academy/blog/station-kanji",
    },
  ],
};

function KanjiRow({
  kanji,
  kicker,
  question,
  children,
}: {
  kanji: string;
  kicker: string;
  question: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,11rem)_1fr] md:gap-10 py-8 md:py-10 border-b border-border">
      <p
        lang="ja"
        className="jp font-display leading-none text-ink text-[clamp(3rem,9vw,4.25rem)]"
        aria-label={kanji}
      >
        {kanji}
      </p>
      <div>
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-academy-teal-dark">
          {kicker}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink text-balance">{question}</h2>
        <div className="mt-3 space-y-3 text-slate leading-relaxed text-[17px]">{children}</div>
      </div>
    </div>
  );
}

export default function StationKanjiPost() {
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
              { label: "Station kanji" },
            ]}
          />
          <p className="mt-6 text-[11px] font-mono uppercase tracking-[0.2em] text-academy-teal-dark">
            Vocabulary · JFT-Basic strategy
          </p>
          <h1 className="mt-3 font-display font-bold text-ink tracking-[-0.04em] text-balance text-[clamp(2.75rem,7vw,5rem)] leading-[1.02]">
            Station kanji, decoded.
          </h1>
          <p className="mt-5 text-slate text-[15px]">
            <time dateTime="2026-10">October 2026</time> · {READ_TIME} ·{" "}
            <span>By the Unschool Academy content team</span>
          </p>
        </div>
      </Section>

      <Section>
        <article className="max-w-3xl mx-auto">
          <Badge tone="warning">Draft: pending expert review</Badge>

          <div className="mt-6 space-y-5 text-slate leading-relaxed text-[17px]">
            <p>
              Most station signs reuse the same few kanji compounds. Learn four of them, the first
              two as an opposite pair, and the signs stop looking like walls of ink.
            </p>
          </div>

          <div className="mt-6 border-t border-border">
            <KanjiRow
              kanji="出口 入口"
              kicker="Deguchi · Iriguchi · exit / entrance"
              question="Which kanji tell you where to get in and get out?"
            >
              <p>
                出 means “go out”, 入 means “go in”, and 口 is “mouth/opening”. Together: the
                way out, the way in. Watch for them on doors, gates, and platforms. For
                example,{" "}
                <span lang="ja" className="jp">
                  出口は こちら
                </span>{" "}
                (deguchi wa kochira) means “the exit is this way”.
              </p>
            </KanjiRow>
            <KanjiRow
              kanji="改札"
              kicker="Kaisatsu · ticket gate"
              question="Which kanji marks the ticket gate you tap through?"
            >
              <p>
                The barrier where you tap your IC card. 改 means “inspect”, 札 means “ticket”.
                When announcements say{" "}
                <span lang="ja" className="jp">
                  改札を出て
                </span>{" "}
                (kaisatsu wo dete), they mean “after exiting the ticket gate”.
              </p>
            </KanjiRow>
            <KanjiRow
              kanji="乗換"
              kicker="Norikae · transfer"
              question="Which kanji points you to the right transfer?"
            >
              <p>
                <span lang="ja" className="jp">
                  乗る
                </span>{" "}
                (noru, to ride) plus{" "}
                <span lang="ja" className="jp">
                  換える
                </span>{" "}
                (kaeru, to change) gives you changing trains.{" "}
                <span lang="ja" className="jp">
                  乗換案内
                </span>{" "}
                (norikae annai) signs point to transfer information.
              </p>
            </KanjiRow>
          </div>

          <h2 className="text-2xl font-bold text-ink pt-8">
            How to practise without memorizing strokes
          </h2>
          <div className="mt-3 space-y-5 text-slate leading-relaxed text-[17px]">
            <p>
              Do not memorize strokes in isolation. Next time you see a station photo, cover
              the romaji and read the kanji first. Then check yourself against our{" "}
              <Link
                href="/exams/jft-basic/topics"
                className="text-academy-blue font-semibold hover:underline"
              >
                Reading Comprehension practice topic
              </Link>
              : reading kanji like these in realistic notices.
            </p>
          </div>

          {/* Active recall, not a summary: reveal to check. */}
          <div className="mt-8 rounded-2xl border border-border bg-paper p-5 md:p-6">
            <h2 className="font-bold text-ink text-xl">
              Test yourself: can you read these three signs?
            </h2>
            <p className="mt-1 text-[15px] text-slate">
              Try before you peek. Reveal each sign to check your answer.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <details className="rounded-xl border border-border p-4">
                <summary className="cursor-pointer list-none text-center focus-visible:rounded focus-visible:ring-2 focus-visible:ring-academy-teal-dark focus-visible:outline-none">
                  <span lang="ja" className="jp block text-3xl text-ink">
                    改札
                  </span>
                  <span className="mt-2 block text-xs font-semibold uppercase tracking-wide text-slate">
                    Reveal the answer
                  </span>
                </summary>
                <p className="mt-2 text-center text-[15px] text-slate">
                  <strong className="text-ink">Ticket gate (kaisatsu).</strong> The barrier you
                  tap your IC card through.
                </p>
              </details>
              <details className="rounded-xl border border-border p-4">
                <summary className="cursor-pointer list-none text-center focus-visible:rounded focus-visible:ring-2 focus-visible:ring-academy-teal-dark focus-visible:outline-none">
                  <span lang="ja" className="jp block text-3xl text-ink">
                    乗換
                  </span>
                  <span className="mt-2 block text-xs font-semibold uppercase tracking-wide text-slate">
                    Reveal the answer
                  </span>
                </summary>
                <p className="mt-2 text-center text-[15px] text-slate">
                  <strong className="text-ink">Transfer (norikae).</strong> Changing trains, not
                  stations.
                </p>
              </details>
              <details className="rounded-xl border border-border p-4">
                <summary className="cursor-pointer list-none text-center focus-visible:rounded focus-visible:ring-2 focus-visible:ring-academy-teal-dark focus-visible:outline-none">
                  <span lang="ja" className="jp block text-3xl text-ink">
                    出口
                  </span>
                  <span className="mt-2 block text-xs font-semibold uppercase tracking-wide text-slate">
                    Reveal the answer
                  </span>
                </summary>
                <p className="mt-2 text-center text-[15px] text-slate">
                  <strong className="text-ink">Exit (deguchi).</strong> 出 is “go out”, 口 is the
                  opening.
                </p>
              </details>
            </div>
          </div>

          {/* Discovery: real relationships, editorial rows. */}
          <nav aria-label="More to read" className="mt-12">
            <h2 className="text-2xl font-bold text-ink">Keep reading</h2>
            <ul className="mt-4 border-t border-border">
              <li className="border-b border-border">
                <Link
                  href="/exams/jft-basic/topics"
                  className="group flex items-baseline gap-4 py-4"
                >
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">01</span>
                  <span>
                    <span className="block font-bold text-ink group-hover:underline">
                      Practise these compounds
                    </span>
                    <span className="block text-[15px]">
                      Reading Comprehension questions on kanji like these.
                    </span>
                  </span>
                </Link>
              </li>
              <li className="border-b border-border">
                <Link
                  href="/exams/jft-basic/diagnostic"
                  className="group flex items-baseline gap-4 py-4"
                >
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">02</span>
                  <span>
                    <span className="block font-bold text-ink group-hover:underline">
                      Test the technique
                    </span>
                    <span className="block text-[15px]">
                      Ten questions, five minutes, no account needed.
                    </span>
                  </span>
                </Link>
              </li>
              <li className="border-b border-border">
                <Link href="/free-practice" className="group flex items-baseline gap-4 py-4">
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">03</span>
                  <span>
                    <span className="block font-bold text-ink group-hover:underline">
                      Practise free
                    </span>
                    <span className="block text-[15px]">
                      Free sample questions, answered live. No account needed.
                    </span>
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </article>
      </Section>

      {/* Frictionless close: the diagnostic is the canonical zero-friction entry —
          one close, one destination (sibling-post convention). */}
      <Section>
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-paper p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-ink">Take the free diagnostic</h2>
            <p className="mt-2 text-slate text-[16px]">
              Ten questions, five minutes, no account needed.
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
