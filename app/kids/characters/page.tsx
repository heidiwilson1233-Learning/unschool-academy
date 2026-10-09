import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs, PageHero } from "@/components/ui";
import { Art, StagingNote } from "@/components/site-art";

export const metadata: Metadata = {
  title: "Meet Momo, Tara & Bobo — Our Learning Guides",
  description:
    "Meet the three original Unschool Kids characters: Momo the elephant (numbers), Tara the squirrel (language), Bobo the tortoise (science).",
  alternates: { canonical: "/kids/characters" },
  openGraph: {
    title: "Meet Momo, Tara & Bobo — Our Learning Guides",
    description:
      "Meet the three original Unschool Kids characters: Momo the elephant (numbers), Tara the squirrel (language), Bobo the tortoise (science).",
    type: "website",
    url: "/kids/characters",
  },
  twitter: {
    card: "summary",
    title: "Meet Momo, Tara & Bobo — Our Learning Guides",
    description:
      "Meet the three original Unschool Kids characters: Momo the elephant (numbers), Tara the squirrel (language), Bobo the tortoise (science).",
  },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Kids", href: "/kids" },
  { label: "Characters" },
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

/* Name-level only: no fabricated per-character URLs, no Product/Course schema.
   Character art is a staging prototype, so structured data stays at the naming level. */
const charactersJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Unschool Kids learning guides",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Momo — Numbers, patterns & mathematics" },
    { "@type": "ListItem", position: 2, name: "Tara — Language, reading & creativity" },
    { "@type": "ListItem", position: 3, name: "Bobo — Science, discovery & reasoning" },
  ],
};

/* Bento cells: one authored treatment per character — dense dossier, tall quiet rail,
   horizontal pull-quote. Grid: Momo span-4 | Bobo span-2 row-span-2 / Tara span-4 | honesty strip span-6. */
export default function CharactersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(charactersJsonLd) }}
      />
      <PageHero
        eyebrow="The guides"
        tone="kids"
        title={
          <>
            Meet <span className="text-kids-lavender-deep">Momo</span>,{" "}
            <span className="text-kids-orange-ink">Tara</span> &{" "}
            <span className="text-kids-leaf-deep">Bobo</span>
          </>
        }
        sub="Three original friends, each with their own way of teaching. The same familiar faces from age 2 to Grade 5, never replaced by a trendier mascot."
      />
      <Section>
        <Breadcrumbs trail={TRAIL} />
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* ---------- Momo: dense dossier cell (hero span) ---------- */}
          <article
            aria-labelledby="momo-name"
            className="md:col-span-4 rounded-3xl border-2 border-kids-lavender-deep/30 bg-white p-6 md:p-8"
          >
            <div className="grid gap-6 sm:grid-cols-[auto_1fr] items-start">
              <figure className="text-center">
                <Art
                  src="/img/char-momo.webp"
                  alt="Momo, a warm lavender elephant in teal dungarees with a yellow satchel, holding a mango in her trunk"
                  ratio="portrait"
                  className="max-w-[240px] mx-auto"
                />
                <StagingNote className="text-center" />
                <figcaption className="mt-3">
                  <h2 id="momo-name" className="text-2xl font-extrabold text-kids-lavender-deep">
                    Momo
                  </h2>
                  <p className="text-sm text-slate">lavender elephant</p>
                </figcaption>
              </figure>
              <div>
                <Badge tone="kids">Numbers, patterns & mathematics</Badge>
                <p className="mt-3 text-slate leading-relaxed">
                  Patient, playful and practical. Momo moves objects with his trunk, waits for
                  your child to decide, and sometimes makes a plausible mistake. That way,
                  children get to explain the reasoning.
                </p>
                <p className="mt-2 text-sm text-slate">
                  <span className="font-semibold text-ink">Look:</span> Warm lavender elephant ·
                  large floppy ears · teal dungarees · small yellow satchel
                </p>
                <blockquote className="mt-4 rounded-xl border-2 border-kids-lavender-deep/40 bg-kids-cream p-5">
                  <span aria-hidden className="text-kids-lavender-deep text-2xl leading-none">
                    “
                  </span>
                  <p className="mt-1 text-ink font-medium">
                    “We need three mangoes. Can you help me choose them?”
                  </p>
                  <footer className="not-italic text-sm text-slate mt-2">
                    Catchphrase: <cite>“Let&apos;s find out together!”</cite>
                  </footer>
                </blockquote>
                <div className="mt-5">
                  <Button href="/kids/sample/momo-mangoes" variant="kids">
                    Play with Momo now
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* ---------- Bobo: tall quiet rail (asymmetry cell) ---------- */}
          <article
            aria-labelledby="bobo-name"
            className="md:col-span-2 md:row-span-2 rounded-3xl border-2 border-kids-leaf-deep/30 bg-white p-6 flex flex-col"
          >
            <figure className="text-center">
              <Art
                src="/img/char-bobo.webp"
                alt="Bobo, a mint-green tortoise with a golden-yellow shell with three geometric patches, holding a magnifying glass"
                ratio="portrait"
                className="max-w-[200px] mx-auto"
              />
              <StagingNote className="text-center" />
              <figcaption className="mt-3">
                <h2 id="bobo-name" className="text-2xl font-extrabold text-kids-leaf-deep">
                  Bobo
                </h2>
                <p className="text-sm text-slate">mint-green tortoise</p>
              </figcaption>
            </figure>
            <Badge tone="kids">Science, discovery & reasoning</Badge>
            <p className="mt-3 text-slate leading-relaxed text-[15px]">
              Curious, observant and inventive. Bobo asks “What do you notice?”, tries
              predictions, and pauses for your child. His considered pace is a strength, never
              a joke.
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-kids-leaf-deep">
              What do you notice?
            </p>
            <div className="mt-auto pt-5">
              <Button href="/kids/world" variant="kids" size="sm">
                Visit Bobo&apos;s Discovery Pond
              </Button>
            </div>
          </article>

          {/* ---------- Tara: horizontal pull-quote cell ---------- */}
          <article
            aria-labelledby="tara-name"
            className="md:col-span-4 rounded-3xl border-2 border-kids-orange-deep/30 bg-white p-6 md:p-8"
          >
            <p
              className="font-extrabold tracking-tight text-kids-orange-ink text-balance"
              style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)" }}
            >
              “What happens next?”
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-slate">
              Tara&apos;s catchphrase
            </p>
            <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_auto] items-start">
              <div>
                <h2 id="tara-name" className="text-xl font-extrabold text-kids-orange-deep">
                  Tara
                </h2>
                <p className="text-sm text-slate">cinnamon-orange squirrel</p>
                <div className="mt-3">
                  <Badge tone="kids">Language, reading & creativity</Badge>
                </div>
                <p className="mt-3 text-slate leading-relaxed">
                  Expressive, imaginative and attentive. Tara opens her sketchbook and asks “What
                  happens next?” Your child&apos;s choices change the picture or the story.
                </p>
                <p className="mt-2 text-sm text-slate">
                  <span className="font-semibold text-ink">Look:</span> Cinnamon-orange squirrel ·
                  curled tail · turquoise scarf · cream tummy · purple sketchbook
                </p>
                <div className="mt-5">
                  <Button href="/kids/sample/tara-story" variant="kids">
                    Play Tara&apos;s story quest
                  </Button>
                </div>
              </div>
              <figure className="text-center">
                <Art
                  src="/img/char-tara.webp"
                  alt="Tara, a cinnamon-orange squirrel with a turquoise scarf, holding an open purple sketchbook"
                  ratio="portrait"
                  className="max-w-[220px] mx-auto"
                />
                <StagingNote className="text-center" />
              </figure>
            </div>
          </article>

          {/* ---------- Honesty strip: full-width, hairline, no CTA pressure ---------- */}
          <div className="md:col-span-6 rounded-2xl border border-border bg-kids-cream/60 px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <p className="text-sm text-slate">
              Character art shown is a staging prototype — final illustrations require
              illustrator review and IP signoff.
            </p>
            <Link
              href="/kids"
              className="shrink-0 text-sm font-bold text-kids-orange-ink underline underline-offset-4 hover:no-underline"
            >
              See them in a real quest
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
