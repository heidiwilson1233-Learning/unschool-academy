import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Card, Badge, Breadcrumbs, PageHero, Callout } from "@/components/ui";
import { PRACTICE_TOPICS, practiceByTopic } from "@/lib/practice";
import { TOPIC_INFO } from "@/lib/exams";

export const metadata: Metadata = {
  title: "JFT-Basic Topics — Practice by Topic",
  description:
    "Practice JFT-Basic by topic: vocabulary, conversation, listening, and reading signs. Instant feedback with reviewed explanations.",
};

const SLUGS: Record<string, string> = {
  "Script and Vocabulary": "vocabulary",
  "Conversation and Expression": "conversation",
  "Listening Comprehension": "listening",
  "Reading Comprehension": "reading",
};

export default function TopicsPage() {
  return (
    <>
      <PageHero
        eyebrow="JFT-Basic practice"
        tone="exam"
        title="Practice by topic"
        sub="Five original questions per topic with instant feedback, hints, and reviewed explanations. Practice mode — answers are revealed as you learn."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Exams", href: "/exams" }, { label: "JFT-Basic", href: "/exams/jft-basic" }, { label: "Topics" }]} />
        <div className="grid sm:grid-cols-2 gap-5">
          {PRACTICE_TOPICS.map((t) => (
            <Link key={t} href={`/exams/jft-basic/practice/${SLUGS[t]}`}>
              <Card hover className="h-full">
                <div className="flex items-center justify-between mb-2">
                  <Badge tone="info">{practiceByTopic(t).length} questions</Badge>
                  <span className="text-xs font-bold text-slate">Practice mode</span>
                </div>
                <h2 className="text-xl font-extrabold text-ink">{t}</h2>
                <p className="text-slate text-[15px] mt-2">{TOPIC_INFO[t]}</p>
                <p className="mt-4 font-semibold text-academy-blue">Start practicing →</p>
              </Card>
            </Link>
          ))}
        </div>
        <Callout title="Draft content" tone="warning">
          All practice questions are original drafts pending Japanese SME review. Ready for exam
          conditions? Try a <a href="/exams/jft-basic/mock-tests" className="font-semibold text-academy-blue hover:underline">timed mock test</a> instead.
        </Callout>
      </Section>
    </>
  );
}
