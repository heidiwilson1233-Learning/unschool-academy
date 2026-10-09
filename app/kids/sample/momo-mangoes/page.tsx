import type { Metadata } from "next";
import { Check } from "lucide-react";
import MangoQuest from "@/components/mango-quest";
import { Breadcrumbs } from "@/components/ui";
import { Art, StagingNote } from "@/components/site-art";

const CANONICAL = "https://unschool.academy/kids/sample/momo-mangoes";

export const metadata: Metadata = {
  title: "Free Quest: Momo's Three Mangoes (Ages 3–5) — Unschool Academy",
  description:
    "A complete free Unschool Kids sample quest. Help Momo count exactly three mangoes for the picnic, then prove the skill with leaves. No account, no card.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Free Quest: Momo's Three Mangoes (Ages 3–5) — Unschool Academy",
    description:
      "Help Momo count exactly three mangoes for the picnic. A complete free sample quest for ages 3–5.",
    type: "website",
    url: CANONICAL,
  },
  twitter: {
    card: "summary",
    title: "Free Quest: Momo's Three Mangoes (Ages 3–5) — Unschool Academy",
    description:
      "Help Momo count exactly three mangoes for the picnic. A complete free sample quest for ages 3–5.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
    { "@type": "ListItem", position: 2, name: "Kids", item: "https://unschool.academy/kids" },
    { "@type": "ListItem", position: 3, name: "Ages 3–5", item: "https://unschool.academy/kids/ages/3-5" },
    { "@type": "ListItem", position: 4, name: "Three Mangoes for the Picnic", item: CANONICAL },
  ],
};

const PRACTICES = [
  "Counting to three, one object per number",
  "A three-step hint ladder when they get stuck",
  "A transfer challenge: the same skill, new objects",
  "A parent log and an off-screen counting game",
];

const FACTS: Array<[string, string]> = [
  ["Skill", "One-to-one counting to 3"],
  ["Time", "A few minutes"],
  ["Play with", "Child + grown-up"],
  ["Cost", "Free · no account · no card"],
];

export default function MangoQuestPage() {
  return (
    <div className="bg-kids-cream min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Kids", href: "/kids" },
            { label: "Ages 3–5", href: "/kids/ages/3-5" },
            { label: "Three Mangoes for the Picnic" },
          ]}
        />

        {/* Parent intro rail — what this quest is, before the game starts */}
        <section
          aria-labelledby="quest-heading"
          className="relative overflow-hidden rounded-3xl border border-kids-orange/25 bg-paper/60 px-6 py-8 md:px-10 md:py-10 mb-8"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at 15% 20%, rgba(242,166,108,0.28) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(185,167,230,0.25) 0%, transparent 40%)",
            }}
          />
          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-kids-orange-ink">
                Free sample quest · Ages 3–5 · K04
              </p>
              <h1
                id="quest-heading"
                className="mt-3 text-4xl md:text-5xl font-extrabold text-ink tracking-tight text-balance"
              >
                Three Mangoes for the Picnic
              </h1>
              <p className="mt-4 text-lg text-slate max-w-xl">
                Momo needs exactly three mangoes for the picnic. Your child picks them, counts them one by
                one with Momo, then proves the skill on leaves. A complete quest, free to play.
              </p>
              <ul className="mt-6 space-y-2.5">
                {PRACTICES.map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check aria-hidden className="w-5 h-5 mt-0.5 shrink-0 text-academy-teal" strokeWidth={3} />
                    <span className="font-medium text-ink">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="md:col-span-1" aria-label="Quest facts">
              <div className="rounded-2xl border border-border bg-kids-cream/70 p-6">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate">
                  Quest facts
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  {FACTS.map(([term, value]) => (
                    <div key={term} className="flex justify-between gap-3">
                      <dt className="text-slate">{term}</dt>
                      <dd className="font-bold text-ink text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 inline-block rounded-full border border-kids-orange/40 bg-kids-orange/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-kids-orange-ink">
                  Sample under educator review
                </p>
              </div>
            </aside>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Art
            src="/img/mango-garden.webp"
            alt="Momo's Mango Garden: round mango trees heavy with ripe mangoes, woven baskets on soft grass, morning sunlight"
            sizes="(max-width: 1024px) 100vw, 80vw"
          />
          <StagingNote />
        </div>

        <MangoQuest />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </div>
  );
}
