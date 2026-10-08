import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, Breadcrumbs, PageHero } from "@/components/ui";
import { Momo, Tara, Bobo } from "@/components/characters";
import { VILLAGE_LOCATIONS } from "@/lib/kids";

export const metadata: Metadata = {
  title: "Explore the Village — Six Storybook Locations",
  description:
    "Explore the Unschool Kids village: Momo's Mango Garden, Tara's Story Tree, Bobo's Discovery Pond, and three more storybook locations.",
};

const Art = { momo: Momo, tara: Tara, bobo: Bobo };

const PLACE_DETAIL: Record<string, string> = {
  "Momo's Mango Garden": "Count mangoes, share fruit equally, build AB patterns, and explore fractions with real objects.",
  "Tara's Story Tree": "Order story cards, play with first sounds, build vocabulary, and tell your own tales.",
  "Bobo's Discovery Pond": "Observe pond life, sort by what you notice, predict and test with safe materials.",
  "Shape Workshop": "Build pictures from shapes, explore symmetry, and reason with simple tools.",
  "Little Market": "Compare quantities, count token money, and — for older children — plan a budget.",
  "Kindness Corner": "Practise taking turns, noticing feelings, and asking for help in gentle stories.",
};

export default function WorldPage() {
  return (
    <>
      <PageHero
        eyebrow="The village"
        tone="kids"
        title="Six places, one festival to prepare"
        sub="The whole village is getting ready for a joyful celebration — and every quest helps. Each location is a teaching setting, not a separate app."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Kids", href: "/kids" }, { label: "Village" }]} />
        <div className="grid md:grid-cols-2 gap-6">
          {VILLAGE_LOCATIONS.map((v) => {
            const A = Art[v.guide];
            return (
              <Card key={v.name} hover className="!p-6 flex gap-5 items-start">
                <A className="w-20 h-20 shrink-0" />
                <div>
                  <h2 className="text-xl font-extrabold text-ink">{v.name}</h2>
                  <p className="text-sm font-semibold text-kids-orange-deep">{v.purpose}</p>
                  <p className="text-slate text-[15px] mt-2 leading-relaxed">{PLACE_DETAIL[v.name]}</p>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Button href="/kids/sample/momo-mangoes" variant="kids" size="lg">Visit the Mango Garden</Button>
        </div>
      </Section>
    </>
  );
}
