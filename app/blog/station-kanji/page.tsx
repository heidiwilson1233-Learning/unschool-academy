import type { Metadata } from "next";
import { Section, Breadcrumbs, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "4 Station Kanji That Unlock the Whole Station",
  description: "Learn 出口, 入口, 改札, and 乗換 as pairs — the four kanji compounds that make Japanese stations navigable.",
};

export default function StationKanjiPost() {
  return (
    <>
      <PageHero eyebrow="Japanese learning" title="4 station kanji that unlock the whole station" sub="October 2026 · 4 min read · Reviewed draft" />
      <Section>
        <article className="max-w-3xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Station kanji" }]} />
          <div className="space-y-5 text-slate leading-relaxed text-[17px]">
            <p>Japanese stations look intimidating until you realize most signs reuse the same handful of kanji compounds. Learn four as <em>pairs</em> — each with its opposite — and the station starts reading itself to you.</p>
            <h2 className="text-2xl font-bold text-ink pt-4">1. <span className="jp">出口</span> (deguchi) — exit, vs <span className="jp">入口</span> (iriguchi) — entrance</h2>
            <p>出 means “go out”, 入 means “go in”, and 口 is “mouth/opening”. Together: the way out, the way in. You'll see these on every door, gate, and platform.</p>
            <h2 className="text-2xl font-bold text-ink pt-4">2. <span className="jp">改札</span> (kaisatsu) — ticket gate</h2>
            <p>The barrier where you tap your IC card. 改 means “inspect”, 札 means “ticket”. When announcements say 改札を出て (kaisatsu wo dete), they mean “after exiting the ticket gate”.</p>
            <h2 className="text-2xl font-bold text-ink pt-4">3. <span className="jp">乗換</span> (norikae) — transfer</h2>
            <p>乗る (noru, to ride) + 換える (kaeru, to change) = changing trains. 乗換案内 (norikae annai) signs point you to transfer information.</p>
            <h2 className="text-2xl font-bold text-ink pt-4">How to practise</h2>
            <p>Don't memorize strokes in isolation. Next time you see a station photo, cover the romaji and read the kanji first. Then check yourself against our <a href="/exams/jft-basic/topics" className="text-academy-blue font-semibold hover:underline">Reading Comprehension practice topic</a> — it tests exactly these compounds in realistic notices.</p>
            <p className="text-sm border-t border-border pt-4">Status: reviewed draft — pending Japanese SME review, like all our content.</p>
          </div>
        </article>
      </Section>
    </>
  );
}
