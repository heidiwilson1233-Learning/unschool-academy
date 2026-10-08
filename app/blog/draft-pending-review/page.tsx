import type { Metadata } from "next";
import { Section, Breadcrumbs, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "What 'Draft Pending Review' Actually Means",
  description:
    "Every Unschool Academy question starts as a draft and earns publication through review. Here's what happens between those two states — and why we label drafts openly.",
};

const STAGES = [
  {
    title: "1. Drafted in-house",
    body: "A content writer creates the question for a specific skill — say, distinguishing お先に失礼します from おつかれさまでした. The draft includes the question, four options, the correct answer, and a full explanation. At this point it is a hypothesis: we think this tests what we claim it tests.",
  },
  {
    title: "2. Fact and language check",
    body: "A second person verifies the facts (is this how the phrase is actually used?) and the language (is the Japanese natural, the English clear?). Most drafts change here — a distractor that's accidentally also correct, an explanation that assumes too much.",
  },
  {
    title: "3. Subject-expert review",
    body: "A qualified reviewer — for JFT-Basic, a Japanese-language expert — reads the item cold, as a learner would. They check nuance, register, and whether the question genuinely measures the skill. The drafter never approves their own work. Items fail here, and that's the system working.",
  },
  {
    title: "4. Accessibility and QA",
    body: "We check that the question works for everyone: readable contrast, keyboard navigation, screen-reader labels, audio transcripts. Then it runs in staging exactly as learners will see it.",
  },
  {
    title: "5. Published — then monitored",
    body: "Publication isn't the end. We watch for error reports and confusing explanations, and every item carries a version number — so improving a question never rewrites your past results.",
  },
];

export default function DraftReviewPost() {
  return (
    <>
      <PageHero eyebrow="How we build" title="What “draft pending review” actually means" sub="October 2026 · 4 min read" />
      <Section>
        <article className="max-w-3xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Draft pending review" }]} />
          <div className="space-y-5 text-slate leading-relaxed text-[17px]">
            <p>
              You&apos;ll see the label <strong className="text-ink">“draft pending review”</strong> on
              our practice questions during the pilot. Some sites would hide that. We put it in a
              warning box, because we think you deserve to know exactly where our content stands —
              and because the distance between a draft and a published question is the whole reason
              to trust the published one.
            </p>
            <p>Here is the journey every question takes:</p>
          </div>
          <div className="mt-8 space-y-4">
            {STAGES.map((s) => (
              <div key={s.title} className="bg-paper border border-border rounded-2xl p-6">
                <h2 className="text-lg font-extrabold text-ink">{s.title}</h2>
                <p className="mt-2 text-slate leading-relaxed text-[16px]">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-5 text-slate leading-relaxed text-[17px]">
            <h2 className="text-2xl font-bold text-ink pt-4">Why label the drafts at all?</h2>
            <p>
              Because a draft is still useful — it tests the right skill, it has a real explanation —
              but it hasn&apos;t yet survived a hostile expert read. Telling you that is the difference
              between a platform that respects your intelligence and one that hopes you won&apos;t ask.
            </p>
            <p>
              If you ever spot something off in a question — a debatable answer, a confusing
              explanation — tell us through <a href="/contact" className="text-academy-blue font-semibold hover:underline">contact</a>.
              Error reports go straight to the content team, and fixed items get a new version number.
              That loop is how drafts become trustworthy.
            </p>
          </div>
        </article>
      </Section>
    </>
  );
}
