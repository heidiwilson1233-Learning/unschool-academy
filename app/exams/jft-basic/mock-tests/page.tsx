import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs, PageHero, Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "JFT-Basic Mock Tests — Timed Practice",
  description:
    "Timed JFT-Basic mock tests: 20 original questions, 30 minutes, hidden answers until submit, server-enforced timing. Unofficial practice.",
};

export default function MockTestsPage() {
  return (
    <>
      <PageHero
        eyebrow="JFT-Basic"
        tone="exam"
        title="Mock tests, under real conditions"
        sub="20 original questions. 30 minutes. No hints, no explanations until you submit — and the timer is enforced on our server, not just your screen."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Exams", href: "/exams" }, { label: "JFT-Basic", href: "/exams/jft-basic" }, { label: "Mock tests" }]} />
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card hover className="!border-2 !border-academy-blue">
            <div className="flex items-center justify-between mb-3">
              <Badge tone="info">Mock 1</Badge>
              <span className="text-sm font-bold text-slate">⏱ 30 min · 20 questions</span>
            </div>
            <h2 className="text-2xl font-extrabold text-ink">Everyday Japanese — full set</h2>
            <p className="text-slate text-[15px] mt-2 leading-relaxed">
              All four topics in one sitting: vocabulary, conversation, listening, and reading signs.
              Answers stay hidden until you submit. Auto-submits when time runs out.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-slate">
              <li>✓ Server-enforced 30-minute limit</li>
              <li>✓ Topic breakdown after submit</li>
              <li>✓ Reviewed explanations for every question</li>
            </ul>
            <div className="mt-6"><Button href="/exams/jft-basic/mock-tests/take" size="lg">Start mock 1</Button></div>
          </Card>
          <Card className="flex flex-col justify-center !bg-canvas">
            <h2 className="font-bold text-ink text-lg">Mock 2 — in review</h2>
            <p className="text-slate text-[15px] mt-2">
              The second mock is being drafted and reviewed. We publish mocks only when every
              question has passed review — never as filler.
            </p>
            <div className="mt-4"><Button href="/exams/jft-basic/topics" variant="secondary" size="sm">Practice by topic meanwhile</Button></div>
          </Card>
        </div>
        <Callout title="Unofficial, always" tone="warning">
          Mock scores are unofficial practice measures. They cannot predict an official JFT-Basic
          result. If anyone sells you a “guaranteed pass” mock, walk away.
        </Callout>
      </Section>
    </>
  );
}
