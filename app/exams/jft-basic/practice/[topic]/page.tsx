import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PracticePlayer from "@/components/practice-player";
import { Breadcrumbs, Section } from "@/components/ui";
import { practiceByTopic } from "@/lib/practice";

const SLUG_TO_TOPIC: Record<string, string> = {
  "vocabulary": "Script and Vocabulary",
  "conversation": "Conversation and Expression",
  "listening": "Listening Comprehension",
  "reading": "Reading Comprehension",
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

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

  const questions = practiceByTopic(topicName);
  const skillCount = new Set(questions.map((q) => q.skill)).size;

  return (
    <>
      {/* ---------- Editorial hero: type carries it, ambient light + grain behind it ---------- */}
      <div className="relative overflow-hidden border-b border-border bg-canvas">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-36 right-[-8%] h-[440px] w-[440px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(20,125,117,0.10), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-28 left-[-6%] h-[360px] w-[360px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(49,91,135,0.12), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pt-14 md:pb-16">
          <Breadcrumbs trail={[
            { label: "Home", href: "/" },
            { label: "Exams", href: "/exams" },
            { label: "JFT-Basic", href: "/exams/jft-basic" },
            { label: "Topics", href: "/exams/jft-basic/topics" },
            { label: topicName },
          ]} />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-4">
            JFT-Basic practice · {questions.length} questions · {skillCount} skills
          </p>
          <h1 className="font-display text-5xl md:text-6xl tracking-[-0.03em] leading-[1.02] text-ink text-balance max-w-3xl">
            {topicName}
          </h1>
          <p className="mt-5 text-lg text-slate leading-relaxed max-w-2xl">
            Check each answer as you go and use hints freely. Wrong answers here are the cheapest
            lessons you will ever buy — this is for learning, not testing.
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
            Original drafts · pending Japanese SME review
          </p>
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
