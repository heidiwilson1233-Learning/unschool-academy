import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PracticePlayer from "@/components/practice-player";
import { Breadcrumbs, Section } from "@/components/ui";

const SLUG_TO_TOPIC: Record<string, string> = {
  "vocabulary": "Script and Vocabulary",
  "conversation": "Conversation and Expression",
  "listening": "Listening Comprehension",
  "reading": "Reading Comprehension",
};

export function generateStaticParams() {
  return Object.keys(SLUG_TO_TOPIC).map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const name = SLUG_TO_TOPIC[topic];
  return {
    title: name ? `${name} — Practice` : "Practice",
    description: name ? `Practice JFT-Basic ${name} with instant answer checks, one hint per question, and draft explanations pending review by a Japanese subject-matter expert.` : "Practice",
  };
}

export default async function PracticeTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const topicName = SLUG_TO_TOPIC[topic];
  if (!topicName) notFound();

  return (
    <>
      <div className="bg-gradient-to-b from-academy-teal/10 to-canvas border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumbs trail={[
            { label: "Home", href: "/" },
            { label: "Exams", href: "/exams" },
            { label: "JFT-Basic", href: "/exams/jft-basic" },
            { label: "Topics", href: "/exams/jft-basic/topics" },
            { label: topicName },
          ]} />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">{topicName}</h1>
          <p className="mt-3 text-slate text-lg">Practice mode: check each answer as you go, use hints freely. Wrong answers here are the cheapest lessons you&apos;ll ever buy — this is for learning, not testing.</p>
        </div>
      </div>
      <Section className="!py-10">
        <div className="max-w-4xl mx-auto">
          <PracticePlayer topic={topicName} />
        </div>
      </Section>
    </>
  );
}
