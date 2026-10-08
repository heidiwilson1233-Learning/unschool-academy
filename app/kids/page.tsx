import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs } from "@/components/ui";
import { Momo, Tara, Bobo, CHARACTERS } from "@/components/characters";
import { AGE_TRACKS, VILLAGE_LOCATIONS, QUEST_BRIEFS } from "@/lib/kids";

export const metadata: Metadata = {
  title: "Unschool Kids — A Storybook World That Teaches",
  description:
    "Momo, Tara and Bobo guide children ages 2 through Grade 5 through real interactive quests. Parent-owned, ad-free, and built around doing — not watching.",
};

const CharArt = { momo: Momo, tara: Tara, bobo: Bobo };

export default function KidsHomePage() {
  return (
    <>
      {/* Storybook hero */}
      <div className="bg-kids-cream border-b border-kids-orange/20 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-14 pb-10 md:pt-20 md:pb-14">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Kids" }]} />
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-kids-orange-deep mb-4">
                Unschool Kids · Ages 2 through Grade 5
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
                A village where learning is an adventure
              </h1>
              <p className="mt-5 text-lg text-slate leading-relaxed max-w-xl">
                Three friends — <strong className="text-ink">Momo</strong>, <strong className="text-ink">Tara</strong> and{" "}
                <strong className="text-ink">Bobo</strong> — invite your child to solve little problems in their
                colourful world: counting mangoes, ordering stories, testing ideas. Real actions, kind
                feedback, and something to try away from the screen.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Button href="/kids/sample/momo-mangoes" size="lg" variant="kids">Play a free quest</Button>
                <Button href="/kids/for-parents" size="lg" variant="secondary">For parents</Button>
              </div>
              <p className="mt-4 text-sm text-slate">No ads · No purchases in child mode · Parent-owned accounts</p>
            </div>
            <div className="relative flex justify-center items-end gap-2 md:gap-4" aria-hidden>
              <Momo className="w-32 h-32 md:w-44 md:h-44 animate-floaty" />
              <Tara className="w-36 h-36 md:w-52 md:h-52 animate-floaty" />
              <Bobo className="w-32 h-32 md:w-44 md:h-44 animate-floaty" />
            </div>
          </div>
        </div>
      </div>

      {/* Age tracks */}
      <Section>
        <SectionHeading
          tone="kids"
          eyebrow="Six tracks"
          title="The right world for every age"
          sub="Each track has its own look, pace and challenges — a 3-year-old and a 5th-grader never see the same game."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGE_TRACKS.map((t) => {
            const Art = CharArt[t.character];
            return (
              <Link key={t.slug} href={t.route} className="group">
                <Card hover className="h-full !p-6">
                  <div className="flex items-start justify-between">
                    <Art className="w-16 h-16" />
                    <Badge tone="kids">{t.audience}</Badge>
                  </div>
                  <h3 className="mt-3 text-xl font-extrabold text-ink group-hover:text-kids-orange-deep transition-colors">
                    {t.name}
                  </h3>
                  <p className="mt-2 text-slate text-[15px] leading-relaxed">{t.description}</p>
                  <p className="mt-3 text-xs font-semibold text-slate">⏱ {t.segment}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Characters */}
      <Section className="bg-paper border-y border-border">
        <SectionHeading
          tone="kids"
          eyebrow="The guides"
          title="Meet Momo, Tara & Bobo"
          sub="Familiar friends, not generic tutors. Each one teaches in their own way — and never makes a child feel small."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {Object.values(CHARACTERS).map((c) => {
            const Art = c.Component;
            return (
              <Card key={c.name} hover className="text-center">
                <Art className="w-28 h-28 mx-auto animate-idle" />
                <h3 className="mt-4 text-xl font-extrabold text-ink">{c.name} <span className="text-slate font-medium text-base">· {c.species}</span></h3>
                <p className="text-kids-orange-deep font-semibold text-sm mt-1">{c.domain}</p>
                <p className="mt-3 text-slate italic text-[15px]">“{c.catchphrase}”</p>
              </Card>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Button href="/kids/characters" variant="secondary">Meet the characters</Button>
        </div>
      </Section>

      {/* Village */}
      <Section>
        <SectionHeading
          tone="kids"
          eyebrow="The village"
          title="Six places to explore"
          sub="Every quest happens somewhere real in the village — and the whole village is getting ready for a festival."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VILLAGE_LOCATIONS.map((v) => {
            const Art = CharArt[v.guide];
            return (
              <div key={v.name} className="flex items-center gap-4 bg-paper border border-border rounded-2xl p-4">
                <Art className="w-14 h-14 shrink-0" />
                <div>
                  <p className="font-bold text-ink">{v.name}</p>
                  <p className="text-sm text-slate">{v.purpose}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Button href="/kids/world" variant="secondary">Explore the village</Button>
        </div>
      </Section>

      {/* Prototype quests */}
      <Section className="!pt-0">
        <SectionHeading
          tone="kids"
          eyebrow="Prototype quests"
          title="Playable now, honestly labelled"
          sub="Quests marked playable are real interactive prototypes (staged, pending educator review). The rest are in our build backlog — not fake play buttons."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUEST_BRIEFS.map((qb) => {
            const Art = CharArt[qb.character];
            const inner = (
              <>
                <div className="flex items-center justify-between mb-2">
                  <Badge tone={qb.playable ? "success" : "neutral"}>{qb.playable ? "▶ Playable prototype" : "Backlog"}</Badge>
                  <span className="text-xs font-bold text-slate">{qb.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Art className="w-12 h-12 shrink-0" />
                  <div>
                    <p className="font-bold text-ink">{qb.title}</p>
                    <p className="text-xs text-slate">{qb.track} · {qb.location}</p>
                  </div>
                </div>
                <p className="text-sm text-slate mt-2">{qb.objective}</p>
              </>
            );
            return qb.playable && qb.route ? (
              <Link key={qb.id} href={qb.route}>
                <Card hover className="h-full !border-academy-teal/40">{inner}</Card>
              </Link>
            ) : (
              <Card key={qb.id} className="h-full opacity-75">{inner}</Card>
            );
          })}
        </div>
      </Section>

      {/* Parent reassurance */}
      <Section className="!pt-0">
        <Card className="!p-10 md:!p-12 !bg-kids-cream !border-kids-orange/30">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <SectionHeading
                align="left"
                tone="kids"
                eyebrow="For parents"
                title="You stay in charge. Always."
                sub="Child profiles live under your account. You see what was tried independently vs with help, manage consent and data, and control billing — from one Parent Hub."
              />
              <div className="flex flex-wrap gap-4">
                <Button href="/kids/for-parents" variant="kids">Parent guide</Button>
                <Button href="/parent" variant="secondary">Parent Hub</Button>
              </div>
            </div>
            <ul className="space-y-3 text-slate">
              <li className="flex gap-3"><span className="text-kids-leaf-deep font-bold">✓</span> No ads, purchases, or external links in child mode</li>
              <li className="flex gap-3"><span className="text-kids-leaf-deep font-bold">✓</span> No open-ended AI chat, no social features, no leaderboards</li>
              <li className="flex gap-3"><span className="text-kids-leaf-deep font-bold">✓</span> Evidence reports: independent vs hinted vs demonstrated attempts</li>
              <li className="flex gap-3"><span className="text-kids-leaf-deep font-bold">✓</span> Every quest ends with an off-screen activity and a clear stop</li>
            </ul>
          </div>
        </Card>
      </Section>
    </>
  );
}
