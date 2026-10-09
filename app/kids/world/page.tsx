import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Button, Breadcrumbs } from "@/components/ui";
import { Art, StagingNote } from "@/components/site-art";
import { Momo, Tara, Bobo } from "@/components/characters";
import { StorybookVillageMap } from "@/components/village-map";
import { VILLAGE_LOCATIONS } from "@/lib/kids";

const PAGE_TITLE = "Explore the Village — Six Storybook Locations for Kids";
const PAGE_DESC =
  "Explore the Unschool Kids village with Momo, Tara and Bobo: six storybook learning places for ages 2 to Grade 5. Two quests are playable now.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/kids/world" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
    url: "/kids/world",
  },
  twitter: {
    card: "summary",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Kids", href: "/kids" },
  { label: "Village" },
];

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

/* Name-level only: the six locations have no dedicated routes, so no item URLs.
   No Product/Course schema — these are content areas, not products or courses. */
const locationsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Unschool Kids village locations",
  itemListElement: VILLAGE_LOCATIONS.map((v, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `${v.name} — ${v.purpose}`,
  })),
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const CharArt = { momo: Momo, tara: Tara, bobo: Bobo };
const GUIDE_NAME = { momo: "Momo", tara: "Tara", bobo: "Bobo" } as const;
const GUIDE_TINT = {
  momo: "bg-kids-lavender/15 border-kids-lavender-deep/40",
  tara: "bg-kids-orange/15 border-kids-orange-deep/40",
  bobo: "bg-kids-leaf/15 border-kids-leaf-deep/40",
} as const;

/* Playable state derived from QUEST_BRIEFS (lib/kids.ts): only K04 (Mango Garden)
   and K13 (Story Tree) are playable:true. Every other location is an
   honestly-labelled concept — no dead "play" buttons anywhere on this page. */
const QUEST_FOR_LOCATION: Record<string, { title: string; route: string }> = {
  "mango-garden": { title: "Three Mangoes for the Picnic", route: "/kids/sample/momo-mangoes" },
  "story-tree": { title: "The Four-Card Story", route: "/kids/sample/tara-story" },
};

/* Bento spans: playable dossiers get room, the parent-trust cell closes the grid. */
const CARD_SPAN: Record<string, string> = {
  "mango-garden": "md:col-span-4",
  "story-tree": "md:col-span-2",
  "discovery-pond": "md:col-span-2",
  "shape-workshop": "md:col-span-2",
  "little-market": "md:col-span-2",
  "kindness-corner": "md:col-span-4",
};

export default function WorldPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationsJsonLd) }}
      />

      {/* ---------- Authored hero: type-as-hero on kids-cream, grain + ambient light ---------- */}
      <header className="relative overflow-hidden bg-kids-cream border-b border-[#e7dcc3]">
        <div aria-hidden className="absolute inset-0 opacity-30" style={{ backgroundImage: GRAIN }} />
        <div aria-hidden className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-kids-orange/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full bg-kids-lavender/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-14 pb-12 md:pt-20 md:pb-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-kids-orange-ink mb-4">
                The village
              </p>
              <h1 className="max-w-4xl text-balance font-extrabold text-ink leading-[0.95] tracking-[-0.03em] text-[clamp(2.75rem,7vw,5.25rem)]">
                Six storybook places where children learn by{" "}
                <span className="text-kids-orange-deep">helping out</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
                The whole village is getting ready for a joyful festival, and every
                quest pitches in. Each place is a real teaching setting with its own
                guide. Two quests are playable today; the rest of the village is
                still being built, and the village never rushes anyone.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button href="/kids/sample/momo-mangoes" variant="kids" size="lg">
                  Play the mango quest
                </Button>
                <Link
                  href="/kids/sample/tara-story"
                  className="font-bold text-kids-orange-ink underline decoration-2 underline-offset-4 hover:text-kids-orange-deep"
                >
                  Start at Tara&rsquo;s Story Tree
                </Link>
              </div>
            </div>
            <div>
              <Art
                src="/img/discovery-pond.webp"
                alt="Bobo's Discovery Pond: a sparkling pond with lily pads where Bobo the tortoise peers through a magnifying glass at a frog"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <StagingNote />
            </div>
          </div>
        </div>
      </header>

      <Section>
        <Breadcrumbs trail={TRAIL} />

        {/* ---------- The village map: one wow, zero JS ---------- */}
        <div className="mt-10">
          <SectionHeading
            align="left"
            tone="kids"
            eyebrow="The map"
            title="One festival, six places to pitch in"
            sub="The dashed path is the festival trail. Choose a place on the map to jump to its details."
          />
        </div>
        <div className="village-reveal overflow-x-auto rounded-3xl border-2 border-[#e7dcc3] bg-[#fffdf8]">
          <StorybookVillageMap locations={VILLAGE_LOCATIONS} />
        </div>
        <p className="mt-3 text-sm text-[#6b6252]">
          Places marked <strong className="text-ink">Playable</strong> already have a quest your child can try today.
        </p>

        {/* ---------- The six places: bento list, honest badges ---------- */}
        <div className="mt-16">
          <SectionHeading
            align="left"
            tone="kids"
            eyebrow="The six places"
            title="Every place teaches something real"
          />
        </div>
        <ul className="mt-2 grid grid-cols-1 md:grid-cols-6 gap-5">
          {VILLAGE_LOCATIONS.map((v) => {
            const Art = CharArt[v.guide];
            const quest = QUEST_FOR_LOCATION[v.slug];
            return (
              <li key={v.slug} id={`loc-${v.slug}`} className={`scroll-mt-28 ${CARD_SPAN[v.slug]}`}>
                <article
                  aria-labelledby={`${v.slug}-name`}
                  className={`h-full rounded-2xl border-2 p-6 ${GUIDE_TINT[v.guide]}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Art decorative className="w-16 h-16 shrink-0" />
                    {quest ? (
                      <span className="inline-flex items-center rounded-full bg-kids-orange px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#3d2a10]">
                        Playable now
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-[#efe9d8] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6b6252]">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <h3 id={`${v.slug}-name`} className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
                    {v.name}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-kids-orange-ink">{v.purpose}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate">{v.detail}</p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#6b6252]">
                    {v.skills.join(" · ")}
                  </p>
                  <p className="mt-3 text-sm text-[#6b6252]">
                    Guided by <strong className="text-ink">{GUIDE_NAME[v.guide]}</strong>
                  </p>
                  <div className="mt-5">
                    {quest ? (
                      <Button href={quest.route} variant="kids" size="sm">
                        Play: {quest.title}
                      </Button>
                    ) : (
                      <p className="text-sm font-semibold text-[#6b6252]">
                        Concept — awaiting educator review
                      </p>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
          {/* ---------- Parent-trust cell closes the bento ---------- */}
          <li className="md:col-span-2">
            <aside
              aria-label="For parents"
              className="h-full rounded-2xl border-2 border-dashed border-kids-orange-deep/50 bg-[#fbf3e2] p-6"
            >
              <h3 className="text-lg font-extrabold text-ink">For parents</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate">
                No scores, no streaks, no daily pressure. When a child leaves,
                the village simply waves goodbye.
              </p>
            </aside>
          </li>
        </ul>

        {/* ---------- Start-here CTA band ---------- */}
        <div className="mt-16 border-t-2 border-[#e7dcc3] pt-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
            Ready to help the festival?
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate">
            Start where the festival needs you most: counting mangoes with Momo,
            or spinning a tale under Tara&rsquo;s Story Tree.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href="/kids/sample/momo-mangoes" variant="kids" size="lg">
              Play the mango quest
            </Button>
            <Link
              href="/kids/sample/tara-story"
              className="font-bold text-kids-orange-ink underline decoration-2 underline-offset-4 hover:text-kids-orange-deep"
            >
              Try the story quest
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
