import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs, PageHero } from "@/components/ui";
import { CHARACTERS } from "@/components/characters";

export const metadata: Metadata = {
  title: "Meet Momo, Tara & Bobo — Our Learning Guides",
  description:
    "Meet the three original Unschool Kids characters: Momo the elephant (numbers), Tara the squirrel (language), Bobo the tortoise (science).",
};

const DETAILS = [
  {
    key: "momo" as const,
    role: "Numbers, patterns & mathematics",
    personality: "Patient, playful and practical. Momo moves objects with his trunk, waits for your child to decide, and sometimes makes a plausible mistake — so children get to explain the reasoning.",
    visual: "Warm lavender elephant · large floppy ears · teal dungarees · small yellow satchel",
    sample: "“We need three mangoes. Can you help me choose three?”",
  },
  {
    key: "tara" as const,
    role: "Language, reading & creativity",
    personality: "Expressive, imaginative and attentive. Tara opens her sketchbook and asks “What happens next?” — your child's choices change the picture or the story.",
    visual: "Cinnamon-orange squirrel · curled tail · turquoise scarf · cream tummy · purple sketchbook",
    sample: "“Look at these three pictures. Which one begins our story?”",
  },
  {
    key: "bobo" as const,
    role: "Science, discovery & reasoning",
    personality: "Curious, observant and inventive. Bobo asks “What do you notice?”, tries predictions, and pauses for your child. His considered pace is a strength — never a joke.",
    visual: "Mint-green tortoise · golden-yellow shell with three geometric patches · backpack · magnifier",
    sample: "“Which object could help us build a bridge for this toy?”",
  },
];

export default function CharactersPage() {
  return (
    <>
      <PageHero
        eyebrow="The guides"
        tone="kids"
        title="Meet Momo, Tara & Bobo"
        sub="Three original friends who teach in their own ways — present across every age track, never locked behind a purchase."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Kids", href: "/kids" }, { label: "Characters" }]} />
        <div className="space-y-8">
          {DETAILS.map((d, i) => {
            const c = CHARACTERS[d.key];
            const Art = c.Component;
            return (
              <Card key={d.key} className={`!p-8 md:!p-10 grid md:grid-cols-[auto_1fr] gap-8 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="text-center">
                  <Art className="w-40 h-40 md:w-52 md:h-52 mx-auto animate-idle" />
                  <p className="mt-3 text-lg font-extrabold text-ink">{c.name}</p>
                  <p className="text-sm text-slate">{c.species}</p>
                </div>
                <div>
                  <Badge tone="kids">{d.role}</Badge>
                  <p className="mt-3 text-slate leading-relaxed">{d.personality}</p>
                  <p className="mt-3 text-sm text-slate"><span className="font-semibold text-ink">Look:</span> {d.visual}</p>
                  <blockquote className="mt-4 border-l-4 border-kids-orange/50 pl-4 italic text-ink font-medium">
                    {d.sample}
                    <span className="block not-italic text-sm text-slate mt-1">Catchphrase: “{c.catchphrase}”</span>
                  </blockquote>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <p className="text-sm text-slate mb-4">Character art shown is a staging prototype — final illustrations require illustrator review and IP signoff.</p>
          <Button href="/kids/sample/momo-mangoes" variant="kids" size="lg">Play with Momo now</Button>
        </div>
      </Section>
    </>
  );
}
