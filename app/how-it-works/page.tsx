import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, Breadcrumbs, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "How It Works — The Unschool Academy Method",
  description:
    "Explore, try, learn, see progress: the Unschool Academy learning loop for exam candidates and young children, with honest review standards.",
};

const LOOP = [
  {
    n: "01",
    title: "Explore",
    exams: "Browse verified exam programs. Read the official syllabus summary, the format, and exactly what's included — before you spend anything.",
    kids: "Browse age tracks with your child. Read what each track practises and how long quests take — no developmental promises.",
  },
  {
    n: "02",
    title: "Try",
    exams: "Take the free 10-question diagnostic. Real questions, server-side scoring, instant topic feedback. No account, no paywall.",
    kids: "Play a complete sample quest together. Real interactions with Momo, Tara or Bobo — hints, encouragement, and a gentle ending.",
  },
  {
    n: "03",
    title: "Learn",
    exams: "Follow a topic-by-topic plan: original practice with reviewed explanations, then timed mocks when you're ready.",
    kids: "Work through reviewed quests at your child's pace. Every quest has one learning objective and an off-screen activity.",
  },
  {
    n: "04",
    title: "See progress",
    exams: "Topic-level scores across attempts, with versioned history — what improved, what needs work, what to do next.",
    kids: "Parent Hub shows observed evidence: independent, hinted, or demonstrated attempts, and transfer to new examples.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Method"
        title="One honest loop, two kinds of learners"
        sub="Explore → Try → Learn → See progress. The same cycle drives a JFT-Basic candidate and a 4-year-old — tuned to each."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "How it Works" }]} />
        <div className="space-y-6">
          {LOOP.map((s) => (
            <Card key={s.n} className="!p-8">
              <div className="flex items-start gap-6">
                <p className="text-5xl font-extrabold text-academy-blue/20 shrink-0" aria-hidden>{s.n}</p>
                <div className="flex-1">
                  <h2 className="text-2xl font-extrabold text-ink mb-4">{s.title}</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-canvas rounded-xl p-5 border border-border">
                      <p className="text-xs font-bold uppercase tracking-widest text-academy-teal mb-2">Exams</p>
                      <p className="text-slate text-[15px] leading-relaxed">{s.exams}</p>
                    </div>
                    <div className="bg-kids-cream rounded-xl p-5 border border-kids-orange/30">
                      <p className="text-xs font-bold uppercase tracking-widest text-kids-orange-deep mb-2">Kids</p>
                      <p className="text-slate text-[15px] leading-relaxed">{s.kids}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center flex flex-wrap gap-4 justify-center">
          <Button href="/exams/jft-basic/diagnostic" size="lg">Try the diagnostic</Button>
          <Button href="/kids/sample/momo-mangoes" size="lg" variant="kids">Play a kids quest</Button>
        </div>
      </Section>
    </>
  );
}
