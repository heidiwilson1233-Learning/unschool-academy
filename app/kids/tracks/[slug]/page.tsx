import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { Section, SectionHeading, Card, Badge, Breadcrumbs, Button } from "@/components/ui";
import { Momo, Tara, Bobo } from "@/components/characters";
import { AGE_TRACKS, trackBySlug, type KidQuest } from "@/lib/kids";

const CharArt = { momo: Momo, tara: Tara, bobo: Bobo };

function loadQuests(track: string): KidQuest[] {
  const dir = path.join(process.cwd(), "content", "kids", "quests");
  try {
    const files = fs.readdirSync(dir);
    const quests: KidQuest[] = [];
    for (const f of files) {
      const q = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as KidQuest;
      if (q.track === track) quests.push(q);
    }
    return quests.sort((a, b) => a.difficulty - b.difficulty);
  } catch {
    return [];
  }
}

export function generateStaticParams(): { slug: string }[] {
  return AGE_TRACKS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = trackBySlug(slug);
  if (!t) return { title: "Track not found | Unschool Kids" };
  return { title: `${t.name} — ${t.audience} | Unschool Kids`, description: t.description };
}

export default function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const track = trackBySlug(slug);
  if (!track) notFound();
  const quests = loadQuests(slug);
  const Art = CharArt[track.character];

  return (
    <>
      <div className="bg-kids-cream border-b border-kids-orange/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Kids", href: "/kids" }, { label: track.name }]} />
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <Badge tone="kids">{track.audience}</Badge>
              <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-ink">{track.name}</h1>
              <p className="mt-4 text-lg text-slate leading-relaxed max-w-2xl">{track.description}</p>
              <p className="mt-3 text-sm font-semibold text-slate">Typical quest: {track.segment} — then off-screen play</p>
              <div className="mt-6 flex flex-wrap gap-4">
                {quests.length > 0 && (
                  <Button href={`/kids/quest/${quests[0].id}`} size="lg" variant="kids">▶ Start the first quest</Button>
                )}
                <Button href="/kids/for-parents" size="lg" variant="secondary">For parents</Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {track.skills.map((s) => (
                  <span key={s} className="rounded-full bg-white border border-line px-3 py-1.5 text-sm font-medium text-ink">{s}</span>
                ))}
              </div>
            </div>
            <Art className="w-40 h-40 md:w-56 md:h-56 hidden sm:block" />
          </div>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow="Quests for this age" title={`Play now — ${track.audience}`} sub="Every quest adapts as your child plays. Three right in a row and it gently gets harder; a struggle brings hints, never failure." />
        {quests.length === 0 ? (
          <Card className="!p-8 text-center">
            <p className="text-lg font-semibold text-ink">Quests growing 🌱</p>
            <p className="mt-2 text-slate">New quests for {track.name} unlock every week.</p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quests.map((q) => (
              <Link key={q.id} href={`/kids/quest/${q.id}`}>
                <Card className="!p-5 h-full hover:scale-[1.01] transition-transform">
                  <div className="flex items-center justify-between">
                    <Badge tone="kids">{q.subject} · Level {q.difficulty}</Badge>
                  </div>
                  <p className="mt-3 font-bold text-ink leading-snug">{q.title}</p>
                  <p className="mt-1 text-sm text-slate line-clamp-2">{q.objective}</p>
                  <p className="mt-3 text-sm font-bold text-emerald-700">▶ Play quest</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
