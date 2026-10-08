import Link from "next/link";
import { Section, Button, Card, Badge, Breadcrumbs, Callout } from "@/components/ui";
import { Momo, Tara, Bobo } from "@/components/characters";
import { AGE_TRACKS, QUEST_BRIEFS, type AgeTrack } from "@/lib/kids";

const CharArt = { momo: Momo, tara: Tara, bobo: Bobo };

export function TrackPage({ track }: { track: AgeTrack }) {
  const Art = CharArt[track.character];
  const quests = QUEST_BRIEFS.filter(
    (q) => q.track === track.audience.replace("Ages ", "").replace(" · Kindergarten", "").replace("Grades ", "")
  );
  const siblings = AGE_TRACKS.filter((t) => t.slug !== track.slug);

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
              <p className="mt-3 text-sm font-semibold text-slate">⏱ Typical quest: {track.segment} (design target, not a screen-time rule)</p>
              <div className="mt-6 flex flex-wrap gap-4">
                {track.slug === "3-5" ? (
                  <Button href="/kids/sample/momo-mangoes" size="lg" variant="kids">Play the free quest</Button>
                ) : (
                  <Button href="/kids/sample/momo-mangoes" size="lg" variant="kids">Try a sample quest</Button>
                )}
                <Button href="/kids/for-parents" size="lg" variant="secondary">For parents</Button>
              </div>
            </div>
            <Art className="w-40 h-40 md:w-56 md:h-56 animate-idle hidden sm:block" />
          </div>
        </div>
      </div>

      <Section>
        <h2 className="text-2xl font-extrabold text-ink mb-6">What children practise here</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {track.skills.map((s) => (
            <Card key={s} className="!p-5">
              <p className="font-semibold text-ink">✓ {s}</p>
            </Card>
          ))}
        </div>

        <Callout title="Developmentally honest" tone="kids">
          Ages and grades are approximate design targets — not developmental norms, diagnoses, or
          recommended screen time. Parents choose the track; observed difficulty guides adjustments.
          {track.slug === "2-3" && " For ages 2–3, an adult operates the device while the child points, names, and moves."}
        </Callout>

        {quests.length > 0 && (
          <>
            <h2 className="text-2xl font-extrabold text-ink mt-12 mb-6">Quests for this track</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {quests.map((qb) => (
                <Card key={qb.id} className={qb.playable ? "!border-academy-teal/40" : "opacity-75"}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge tone={qb.playable ? "success" : "neutral"}>{qb.playable ? "▶ Playable prototype" : "Backlog"}</Badge>
                    <span className="text-xs font-bold text-slate">{qb.id}</span>
                  </div>
                  <p className="font-bold text-ink text-lg">{qb.title}</p>
                  <p className="text-sm text-slate mt-1">{qb.objective} · {qb.location}</p>
                  {qb.playable && qb.route && (
                    <div className="mt-4"><Button href={qb.route} size="sm" variant="kids">Play now</Button></div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}

        <h2 className="text-2xl font-extrabold text-ink mt-12 mb-6">Other tracks</h2>
        <div className="flex flex-wrap gap-3">
          {siblings.map((s) => (
            <Link
              key={s.slug}
              href={s.route}
              className="px-4 py-2.5 rounded-xl border border-border bg-paper font-semibold text-sm text-ink hover:border-kids-orange hover:text-kids-orange-deep transition-colors"
            >
              {s.audience} · {s.name}
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
