import type { Metadata } from "next";
import Link from "next/link";
import MangoQuest from "@/components/mango-quest";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs } from "@/components/ui";
import { Art, StagingNote } from "@/components/site-art";
import { Momo, Tara, Bobo, CHARACTERS } from "@/components/characters";
import { AGE_TRACKS, VILLAGE_LOCATIONS, QUEST_BRIEFS } from "@/lib/kids";

export const metadata: Metadata = {
  title: "Unschool Kids — Learning Through Play",
  description:
    "Momo, Tara and Bobo guide children ages 2 through Grade 5 through real interactive quests. Parent-owned, ad-free, and built around doing — not watching.",
  alternates: { canonical: "/kids" },
  openGraph: {
    title: "Unschool Kids — Learning Through Play",
    description:
      "Three friends guide children ages 2 through Grade 5 through real interactive quests. Try one live on the page.",
    type: "website",
    url: "/kids",
  },
  twitter: {
    card: "summary",
    title: "Unschool Kids — Learning Through Play",
    description:
      "Momo, Tara and Bobo guide children ages 2 through Grade 5 through real interactive quests. Parent-owned and ad-free.",
  },
};

const TRAIL = [{ label: "Home", href: "/" }, { label: "Kids" }];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: TRAIL.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.label,
    ...(t.href ? { item: `https://unschool.academy${t.href}` } : {}),
  })),
};

const tracksJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Unschool Kids age tracks",
  itemListElement: AGE_TRACKS.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `${t.name} — ${t.audience}`,
    item: `https://unschool.academy${t.route}`,
  })),
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const CharArt = { momo: Momo, tara: Tara, bobo: Bobo };

const TRACK_TINT: Record<string, string> = {
  momo: "bg-kids-lavender/25 border-kids-lavender-deep/60",
  tara: "bg-kids-orange/20 border-kids-orange-deep/60",
  bobo: "bg-kids-leaf/25 border-kids-leaf-deep/60",
};

/* Tracks that already have a live prototype quest a child can play. */
const PLAYABLE_BY_TRACK: Record<string, string> = { "3-5": "K04", "1-2": "K13" };

const TEACHING_STYLE: Record<string, string> = {
  momo: "Moves objects with the trunk and waits for your child to act — never rushes, never shows off.",
  tara: "Opens her sketchbook, asks “What happens next?” — then shows what follows from your child's idea.",
  bobo: "Asks “What do you notice?”, tries a prediction, and pauses so your child reasons first.",
};

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5 V8 L10.5 9.5" strokeLinecap="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" aria-hidden fill="currentColor">
      <path d="M3 1.8v8.4c0 .6.7 1 1.2.7l6.3-4.2c.4-.3.4-1 0-1.3L4.2 1.1c-.5-.3-1.2 0-1.2.7z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-5 h-5 shrink-0 text-kids-leaf-deep mt-0.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M2.5 8.5l4 4 7-8.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function KidsHomePage() {
  const playables = QUEST_BRIEFS.filter((q) => q.playable);
  const backlog = QUEST_BRIEFS.filter((q) => !q.playable);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tracksJsonLd) }}
      />

      {/* ---------- Storybook hero: type carries it, characters as illustration ---------- */}
      <div className="relative overflow-hidden bg-kids-cream border-b border-kids-orange/20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-6%] h-[480px] w-[480px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(242,166,108,0.35), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-30%] left-[-8%] h-[420px] w-[420px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(141,198,167,0.30), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-16 md:pb-20">
          <Breadcrumbs trail={TRAIL} />
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-kids-orange-ink mb-5">
                Unschool Kids · Ages 2 through Grade 5
              </p>
              <h1 className="text-[clamp(2.9rem,7vw,5.25rem)] font-extrabold tracking-[-0.035em] leading-[0.95] text-ink text-balance">
                Three friends. Real quests.
              </h1>
              <p className="mt-6 text-lg text-slate leading-relaxed max-w-xl">
                <strong className="text-ink">Momo</strong>, <strong className="text-ink">Tara</strong> and{" "}
                <strong className="text-ink">Bobo</strong> invite your child into their village to solve
                little problems that matter there: counting the mangoes for a festival, putting a
                runaway story back in order. Real taps, real thinking, kind feedback — and something
                to try away from the screen when the quest ends.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Button href="/kids/sample/momo-mangoes" size="lg" variant="kids">Play a free quest</Button>
                <Link
                  href="/kids/for-parents"
                  className="font-semibold text-academy-blue hover:text-academy-blue-dark underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal rounded"
                >
                  For parents
                </Link>
              </div>
              <p className="mt-5 text-sm text-slate">No ads · No purchases in child mode · Parent-owned accounts</p>
            </div>
            <div>
              <Art
                src="/img/kids-world.webp"
                alt="The Unschool Kids village panorama: Momo's mango garden, Tara's story tree with its treehouse, and Bobo's discovery pond under festival bunting"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <StagingNote />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Live quest: the real product, playable on this page ---------- */}
      <Section>
        <SectionHeading
          tone="kids"
          eyebrow="Not a promise — the actual thing"
          title="Tap three mangoes. Right now."
          sub="This is a real prototype quest running live on this page. It is staged and pending educator review — what you see is exactly what children can do today."
        />
        <div className="rounded-2xl border border-border bg-paper shadow-lg overflow-hidden">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3 bg-canvas/70">
            <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-kids-orange/70" />
            <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-kids-leaf/80" />
            <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-kids-lavender/80" />
            <span className="ml-3 text-xs font-semibold text-slate">Mango Garden — live prototype</span>
            <span className="ml-auto"><Badge tone="warning">Staged · pending educator review</Badge></span>
          </div>
          <div className="p-4 md:p-8 bg-kids-cream/50">
            <MangoQuest />
          </div>
        </div>
      </Section>

      {/* ---------- Age tracks: a learning-path trail, not a card grid ---------- */}
      <Section className="bg-paper border-y border-border">
        <SectionHeading
          tone="kids"
          align="left"
          eyebrow="Find your child's starting point"
          title="One path, six starting points"
          sub="Each track has its own look, pace and challenges. The 3–8 tracks draw on India's NCF Foundational Stage play-based principles. Walk the trail and pick the node that fits your child."
        />
        <ul className="relative mt-4">
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full hidden md:block"
            viewBox="0 0 100 600"
            preserveAspectRatio="none"
          >
            <path
              d="M50 0 C 22 90, 78 140, 50 230 C 22 320, 78 370, 50 460 L 50 600"
              fill="none"
              stroke="#f2a66c"
              strokeOpacity="0.5"
              strokeWidth="3"
              strokeDasharray="12 10"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {AGE_TRACKS.map((t, i) => {
            const Art = CharArt[t.character];
            const playableId = PLAYABLE_BY_TRACK[t.slug];
            const reverse = i % 2 === 1;
            return (
              <li
                key={t.slug}
                className={`relative flex flex-col md:flex-row items-center gap-5 md:gap-10 py-9 ${reverse ? "md:flex-row-reverse md:text-right" : ""}`}
              >
                <Link
                  href={t.route}
                  aria-label={`${t.name}, ${t.audience}, typical session ${t.segment}`}
                  className={`group relative shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-b-4 ${TRACK_TINT[t.character]} flex items-center justify-center transition-transform duration-300 ease-[var(--ease-signature)] group-hover:-translate-y-1 group-active:translate-y-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kids-orange-deep`}
                >
                  {playableId && (
                    <span className="absolute -top-1 -right-1 z-10 motion-safe:animate-ping w-5 h-5 rounded-full bg-kids-leaf-deep/40 motion-reduce:animate-none" aria-hidden />
                  )}
                  <Art decorative className="w-20 h-20 md:w-24 md:h-24" />
                </Link>
                <div className="flex-1 max-w-xl">
                  <div className={`flex flex-wrap items-center gap-3 ${reverse ? "md:justify-end" : ""}`}>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate">{t.audience}</span>
                    {t.slug === "2-3" && (
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-kids-orange-ink bg-kids-orange/20 rounded-full px-2.5 py-1">
                        Co-play with a parent
                      </span>
                    )}
                    {playableId && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-kids-leaf-deep bg-kids-leaf/25 rounded-full px-2.5 py-1">
                        <PlayIcon /> Live quest {playableId}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-[-0.02em] text-ink">
                    <Link href={t.route} className="hover:text-kids-orange-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kids-orange-deep rounded">
                      {t.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-slate leading-relaxed">{t.description}</p>
                  <div className={`mt-4 flex flex-wrap items-center gap-4 ${reverse ? "md:justify-end" : ""}`}>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate">
                      <ClockIcon />
                      <span className="sr-only">Typical session: </span>{t.segment}
                    </span>
                    <Button href={t.route} variant="kids" size="sm">Start here</Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* ---------- Guides + village: one bento, festival through-line restored ---------- */}
      <Section>
        <SectionHeading
          tone="kids"
          eyebrow="The guides and their village"
          title="Meet the village that teaches"
          sub="The whole village is getting ready for a joyful festival — every quest is a small, real contribution to it. Familiar friends, not faceless tutors."
        />
        <div className="grid md:grid-cols-6 gap-5">
          <div className="md:col-span-4 bg-paper border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-extrabold text-ink tracking-tight">Six places to explore</h3>
            <ul className="mt-4 divide-y divide-border">
              {VILLAGE_LOCATIONS.map((v) => {
                const Art = CharArt[v.guide];
                return (
                  <li key={v.name} className="flex items-center gap-4 py-3.5">
                    <span className="w-12 h-12 rounded-full bg-kids-cream border border-kids-orange/30 flex items-center justify-center shrink-0">
                      <Art decorative className="w-9 h-9" />
                    </span>
                    <div>
                      <p className="font-bold text-ink">{v.name}</p>
                      <p className="text-sm text-slate">{v.purpose}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6">
              <Button href="/kids/world" variant="secondary">Explore the village</Button>
            </div>
          </div>
          {Object.values(CHARACTERS).map((c) => {
            const Art = c.Component;
            return (
              <div key={c.name} className="md:col-span-2 bg-paper border border-border rounded-2xl p-6 shadow-sm flex flex-col">
                <Art decorative className="w-20 h-20 animate-idle" />
                <h3 className="mt-4 text-xl font-extrabold text-ink tracking-tight">
                  {c.name} <span className="text-slate font-medium text-sm">· {c.species}</span>
                </h3>
                <p className="text-kids-orange-ink font-semibold text-sm mt-1">{c.domain}</p>
                <p className="mt-3 text-slate text-[15px] leading-relaxed">{TEACHING_STYLE[c.name.toLowerCase()]}</p>
                <p className="mt-3 text-ink italic text-[15px]">“{c.catchphrase}”</p>
              </div>
            );
          })}
          <div className="md:col-span-6 bg-kids-cream border border-kids-orange/30 rounded-2xl px-6 py-5 md:px-8 flex flex-col md:flex-row md:items-center gap-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kids-orange-ink shrink-0">The festival through-line</p>
            <p className="text-slate leading-relaxed">
              Characters never guilt children for leaving — there are no streaks, rankings or daily pressure.
              A quest ends with something the village can actually use: mangoes counted for the feast, a story finished in time.
            </p>
            <div className="md:ml-auto shrink-0">
              <Button href="/kids/characters" variant="secondary">Meet the characters</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Quests: playable and backlog live in separate, honestly labelled views ---------- */}
      <Section className="bg-paper border-y border-border">
        <SectionHeading
          tone="kids"
          eyebrow="Playable now"
          title="Real prototypes, honestly labelled"
          sub="Staged and pending educator review — what you see is what children can actually do today. Everything else waits in the build backlog below, not behind a fake play button."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {playables.map((qb) => {
            const Art = CharArt[qb.character];
            return (
              <Card key={qb.id} className="h-full !border-academy-teal/40 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <Badge tone="success"><PlayIcon /> Playable prototype</Badge>
                  <span className="text-xs font-bold text-slate">{qb.id}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Art decorative className="w-16 h-16 shrink-0" />
                  <div>
                    <p className="text-xl font-extrabold text-ink tracking-tight">{qb.title}</p>
                    <p className="text-sm text-slate">{qb.track} · {qb.location}</p>
                  </div>
                </div>
                <p className="text-slate mt-3 leading-relaxed">{qb.objective}</p>
                <div className="mt-5 pt-1">
                  {qb.route && <Button href={qb.route} variant="kids">Play now</Button>}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-14">
          <h3 className="text-xl font-extrabold text-ink tracking-tight">On the build backlog</h3>
          <p className="mt-2 text-slate max-w-2xl">
            These quests are designed but not built yet. They are listed here so nothing looks further
            along than it is — no demo buttons until there is a demo.
          </p>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {backlog.map((qb) => (
              <li key={qb.id} className="py-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-xs font-bold text-slate w-10">{qb.id}</span>
                <span className="font-bold text-ink">{qb.title}</span>
                <span className="text-sm text-slate">{qb.track} · {qb.location} — {qb.objective}</span>
                <span className="ml-auto text-xs font-bold uppercase tracking-[0.15em] text-slate">Not built yet</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---------- Parent reassurance ---------- */}
      <Section>
        <Card className="!p-8 md:!p-12 !bg-kids-cream !border-kids-orange/30">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
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
            <div>
              <ul className="space-y-3.5 text-slate">
                <li className="flex gap-3"><CheckIcon /> No ads, purchases, or external links in child mode</li>
                <li className="flex gap-3"><CheckIcon /> No open-ended AI chat, no social features, no leaderboards</li>
                <li className="flex gap-3"><CheckIcon /> Evidence reports: independent vs hinted vs demonstrated attempts</li>
                <li className="flex gap-3"><CheckIcon /> Every quest ends with an off-screen activity and a clear stop</li>
              </ul>
              <div className="mt-7 rounded-xl border border-border bg-paper p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate mb-3">
                  Sample — what the Parent Hub shows
                </p>
                <ul className="divide-y divide-border text-[15px]">
                  <li className="py-2.5 flex justify-between gap-4">
                    <span className="text-ink font-semibold">Three Mangoes for the Picnic</span>
                    <span className="text-kids-leaf-deep font-semibold text-right">Finished with no help</span>
                  </li>
                  <li className="py-2.5 flex justify-between gap-4">
                    <span className="text-ink font-semibold">The Four-Card Story</span>
                    <span className="text-kids-orange-ink font-semibold text-right">Used 1 hint</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
