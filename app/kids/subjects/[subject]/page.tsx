import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { Section, SectionHeading, Card, Badge, Breadcrumbs, Button } from "@/components/ui";
import { Momo, Tara, Bobo } from "@/components/characters";
import { KID_SUBJECTS, subjectBySlug, type KidQuest } from "@/lib/kids";

const CharArt = { momo: Momo, tara: Tara, bobo: Bobo };

function loadQuests(subject: string): KidQuest[] {
  const dir = path.join(process.cwd(), "content", "kids", "quests");
  try {
    const files = fs.readdirSync(dir);
    const quests: KidQuest[] = [];
    for (const f of files) {
      const q = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as KidQuest;
      if (q.subject === subject) quests.push(q);
    }
    return quests.sort((a, b) => a.difficulty - b.difficulty);
  } catch {
    return [];
  }
}

export function generateStaticParams(): { subject: string }[] {
  return KID_SUBJECTS.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params;
  const s = subjectBySlug(subject);
  if (!s) return { title: "Subject not found | Unschool Kids" };
  return { title: `${s.name} for Kids | Unschool Kids`, description: s.tagline };
}

export default function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = use(params);
  const s = subjectBySlug(subject);
  if (!s) notFound();
  const quests = loadQuests(subject);
  const Art = s.character === "all" ? null : CharArt[s.character];

  return (
    <>
      <div className="bg-kids-cream border-b border-kids-orange/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Kids", href: "/kids" }, { label: s.name }]} />
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <Badge tone="kids">{s.tagline}</Badge>
              <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-ink">{s.name}</h1>
              <p className="mt-4 text-lg text-slate max-w-2xl">
                {s.character === "tara" && "Tara guides every Words quest — phonics, vocabulary and stories from the 500-book library."}
                {s.character === "momo" && "Momo guides every Numbers quest — counting, shapes and patterns, always with real things to touch and count."}
                {s.character === "bobo" && "Bobo guides every World quest — animals, plants and seasons, starting with 'What do you notice?'"}
                {s.character === "all" && "All three friends guide these quests together — kindness, feelings and big imaginations."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.skills.map((sk) => (
                  <span key={sk} className="rounded-full bg-white border border-line px-3 py-1.5 text-sm font-medium text-ink">{sk}</span>
                ))}
              </div>
            </div>
            {Art && <Art className="w-40 h-40 md:w-52 md:h-52 hidden sm:block" />}
          </div>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow="Play now" title={`${s.name} quests`} sub="Start anywhere — the quest adapts to your child. No fail states, no timers." />
        {quests.length === 0 ? (
          <Card className="!p-8 text-center">
            <p className="text-lg font-semibold text-ink">Quests are growing here 🌱</p>
            <p className="mt-2 text-slate">New {s.name.toLowerCase()} quests unlock every week from the book library.</p>
            <Button href="/kids/library" variant="kids" className="mt-4">Browse the library</Button>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quests.map((q) => (
              <Link key={q.id} href={`/kids/quest/${q.id}`}>
                <Card className="!p-5 h-full hover:scale-[1.01] transition-transform">
                  <div className="flex items-center justify-between">
                    <Badge tone="kids">Level {q.difficulty}</Badge>
                    <span className="text-xs text-slate">{q.track}</span>
                  </div>
                  <p className="mt-3 font-bold text-ink leading-snug">{q.title}</p>
                  <p className="mt-1 text-sm text-slate line-clamp-2">{q.objective}</p>
                  <p className="mt-3 text-sm font-bold text-emerald-700">▶ Play quest</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-8">
          <p className="font-bold text-ink mb-3">Explore other subjects</p>
          <div className="flex flex-wrap gap-2">
            {KID_SUBJECTS.filter((x) => x.slug !== s.slug).map((x) => (
              <Link key={x.slug} href={`/kids/subjects/${x.slug}`} className="rounded-full bg-white border border-line px-4 py-2 text-sm font-semibold hover:border-amber-300">
                {x.name}
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
