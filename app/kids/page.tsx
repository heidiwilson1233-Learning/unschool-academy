import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs, Callout } from "@/components/ui";
import { Momo, Tara, Bobo, CHARACTERS } from "@/components/characters";
import { AGE_TRACKS, KID_SUBJECTS, SMART_LEARNING, ENDLESS_MODEL, BOOK_QUEST_TYPES } from "@/lib/kids";

export const metadata: Metadata = {
  title: "Unschool Kids — Smart Learning from Age 5",
  description:
    "Momo, Tara and Bobo guide children ages 5 through Grade 5 through quests grown from 500 beloved books. 5 subjects, adaptive difficulty, parent-owned and ad-free.",
  alternates: { canonical: "/kids" },
  openGraph: {
    title: "Unschool Kids — Smart Learning from Age 5",
    description: "Quests grown from 500 books. 5 subjects. Three friends who adapt to your child.",
    type: "website",
    url: "/kids",
  },
};

const CharArt = { momo: Momo, tara: Tara, bobo: Bobo };

const SUBJECT_EMOJI: Record<string, string> = {
  words: "📖",
  numbers: "🔢",
  world: "🔍",
  values: "💛",
  create: "🎨",
};

function questCount(): number {
  try {
    const dir = path.join(process.cwd(), "content", "kids", "quests");
    return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).length;
  } catch {
    return 0;
  }
}

export default function KidsPage() {
  const live = questCount();

  return (
    <>
      {/* HERO */}
      <div className="bg-kids-cream border-b border-kids-orange/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Kids" }]} />
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <Badge tone="kids">Ages 5 → Grade 5</Badge>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-ink leading-[1.05]">
                Smart learning,<br />grown from <span className="text-kids-orange-deep">500 books.</span>
              </h1>
              <p className="mt-5 text-lg text-slate max-w-xl leading-relaxed">
                Momo, Tara and Bobo turn beloved stories into quests across 5 subjects.
                The quest adapts to your child — harder when they're rolling, gentler when they struggle.
                Never a test. Never a fail.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Button href="/kids/tracks/school-starters" size="lg" variant="kids">▶ Start at age 5</Button>
                <Button href="/kids/library" size="lg" variant="secondary">📚 The book library</Button>
              </div>
              <p className="mt-4 text-sm text-slate">{live} quests live now · ~4,000 growing · 1 new book every week</p>
            </div>
            <div className="hidden lg:flex gap-2">
              <Momo className="w-36 h-36" /><Tara className="w-36 h-36" /><Bobo className="w-36 h-36" />
            </div>
          </div>
        </div>
      </div>

      {/* SUBJECTS */}
      <Section>
        <SectionHeading
          eyebrow="Subject-wise"
          title="Five subjects, three guides"
          sub="Every quest belongs to a subject. Pick the subject — the character guides the way."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {KID_SUBJECTS.map((s) => (
            <Link key={s.slug} href={`/kids/subjects/${s.slug}`}>
              <Card className="!p-6 h-full hover:scale-[1.02] transition-transform text-center">
                <p className="text-4xl">{SUBJECT_EMOJI[s.slug]}</p>
                <p className="mt-3 text-xl font-extrabold text-ink">{s.name}</p>
                <p className="mt-1 text-sm text-slate">{s.tagline}</p>
                <p className="mt-3 text-sm font-bold text-emerald-700">Explore →</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* SMART LEARNING */}
      <Section>
        <SectionHeading
          eyebrow="How 5-year-olds get smart here"
          title="Smart learning, not screen time"
          sub="No tests. No fail states. The characters adapt silently underneath — your child just plays."
        />
        <div className="grid md:grid-cols-2 gap-4">
          {SMART_LEARNING.principles.map((p, i) => (
            <Card key={i} className="!p-6">
              <p className="text-ink leading-relaxed"><span className="font-extrabold text-kids-orange-deep mr-2">{i + 1}.</span>{p}</p>
            </Card>
          ))}
        </div>
        <Callout title="The 15-minute promise" tone="kids">
          One quest chain per session (~15 min) → celebration → an off-screen invitation. Then it ends.
          Characters never guilt children for leaving. There are no streaks, leaderboards or daily pressure — by design.
        </Callout>
      </Section>

      {/* TRACKS */}
      <Section>
        <SectionHeading eyebrow="Grows with them" title="Four tracks, ages 5 to Grade 5" sub="Start at 5. Graduate at Grade 5 — straight into exam prep when ready." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AGE_TRACKS.map((t) => {
            const Art = CharArt[t.character];
            return (
              <Link key={t.slug} href={t.route}>
                <Card className="!p-6 h-full hover:scale-[1.02] transition-transform">
                  <Art className="w-16 h-16" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate">{t.audience}</p>
                  <p className="text-xl font-extrabold text-ink">{t.name}</p>
                  <p className="mt-2 text-sm text-slate line-clamp-3">{t.description}</p>
                  <p className="mt-3 text-sm font-bold text-emerald-700">Enter →</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ENDLESS */}
      <Section>
        <SectionHeading
          eyebrow="Never runs out"
          title="Content that feels endless"
          sub="500 books × 7 quest kinds = ~4,000 quests. Parametric variants make practice endless. One new book unlocks every week."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="!p-6 text-center"><p className="text-3xl font-extrabold text-ink">500</p><p className="text-sm text-slate mt-1">curated books</p></Card>
          <Card className="!p-6 text-center"><p className="text-3xl font-extrabold text-ink">7</p><p className="text-sm text-slate mt-1">quest kinds per book</p></Card>
          <Card className="!p-6 text-center"><p className="text-3xl font-extrabold text-ink">~4K</p><p className="text-sm text-slate mt-1">quests at full library</p></Card>
          <Card className="!p-6 text-center"><p className="text-3xl font-extrabold text-ink">1/wk</p><p className="text-sm text-slate mt-1">new book unlocks</p></Card>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {BOOK_QUEST_TYPES.map((q) => (
            <span key={q.type} className="rounded-full bg-white border border-line px-4 py-2 text-sm font-medium text-ink">{q.blurb}</span>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button href="/kids/library" size="lg" variant="kids">📚 Open the library</Button>
        </div>
      </Section>

      {/* CHARACTERS */}
      <Section>
        <SectionHeading eyebrow="The guides" title="Three friends, zero pressure" />
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(CHARACTERS).map(([key, c]) => {
            const Art = CharArt[key as keyof typeof CharArt];
            return (
              <Card key={key} className="!p-6 text-center">
                <Art className="w-24 h-24 mx-auto" />
                <p className="mt-3 text-xl font-extrabold text-ink">{c.name}</p>
                <p className="text-sm text-slate">{c.species}</p>
                <p className="mt-2 text-sm text-slate italic">“{c.catchphrase}”</p>
                <p className="mt-2 text-sm font-medium text-ink">{c.domain}</p>
              </Card>
            );
          })}
        </div>
        <div className="mt-8 text-center flex flex-wrap justify-center gap-4">
          <Button href="/kids/for-parents" variant="secondary" size="lg">For parents</Button>
          <Button href="/kids/tracks/school-starters" variant="kids" size="lg">▶ Begin at age 5</Button>
        </div>
      </Section>
    </>
  );
}
