import type { Metadata } from "next";
import { Section, Breadcrumbs, PageHero, Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Why Your Child Doesn't Need a Score",
  description:
    "Scores rank children; evidence informs parents. How Unschool Kids reports what a child actually did — independently, with hints, or by demonstration — instead of a number.",
};

export default function NoScorePost() {
  return (
    <>
      <PageHero eyebrow="For parents" title="Why your child doesn't need a score" sub="October 2026 · 3 min read" />
      <Section>
        <article className="max-w-3xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "No scores for children" }]} />
          <div className="space-y-5 text-slate leading-relaxed text-[17px]">
            <p>
              Imagine two children finish the same counting quest. One taps three mangoes confidently.
              The other tries, uses two hints, gets it wrong once, then gets it right — and beams.
              A score says the first child is “better.” A parent watching knows the second child just
              did the harder, braver thing.
            </p>
            <p>
              That&apos;s why Unschool Kids has no scores, no stars, no leaderboards, no
              “your child is in the 40th percentile.” Numbers like that don&apos;t describe learning;
              they describe ranking. And ranking a four-year-old helps nobody — least of all the
              four-year-old.
            </p>
            <h2 className="text-2xl font-bold text-ink pt-4">What we record instead</h2>
            <p>
              After each quest, the Parent Hub records plain observations — the kind a good teacher
              would jot in a notebook:
            </p>
            <ul className="space-y-3 list-none pl-0">
              <li className="flex gap-3"><span className="font-bold text-kids-leaf-deep">●</span><span><strong className="text-ink">Practised independently</strong> — solved with no help. The skill is settling in.</span></li>
              <li className="flex gap-3"><span className="font-bold text-kids-leaf-deep">●</span><span><strong className="text-ink">Used a hint</strong> — which hint level, and what it taught. Hints are teaching, not cheating.</span></li>
              <li className="flex gap-3"><span className="font-bold text-kids-leaf-deep">●</span><span><strong className="text-ink">Needed a demonstration</strong> — the character showed the way first. Useful information, not failure.</span></li>
              <li className="flex gap-3"><span className="font-bold text-kids-leaf-deep">●</span><span><strong className="text-ink">Transfer observed</strong> — applied the skill to a brand-new example. This is the real prize.</span></li>
            </ul>
            <h2 className="text-2xl font-bold text-ink pt-4">What this changes for you</h2>
            <p>
              Instead of “she got 7/10,” you see <em>where</em> the struggle lived: did she need a
              hint on the first try and then fly solo? Did the skill transfer to the new example, or
              only work in the familiar one? That tells you what to practise together far better than
              any number — and every quest ends with an off-screen activity so the learning leaves
              the device.
            </p>
            <p>
              We built it this way on purpose: children should feel proud of effort and curious about
              mistakes. The moment a number starts grading their play, the play stops being play.
            </p>
          </div>
          <div className="mt-10 text-center">
            <Button href="/kids/for-parents" variant="kids" size="lg">Read the parent guide</Button>
          </div>
        </article>
      </Section>
    </>
  );
}
