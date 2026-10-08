import type { Metadata } from "next";
import MockPlayer from "@/components/mock-player";
import { Breadcrumbs, Callout, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mock 1 — Timed JFT-Basic Practice",
  description: "Take timed JFT-Basic Mock 1: 20 original questions in 30 minutes.",
};

export default function MockTakePage() {
  return (
    <>
      <div className="bg-gradient-to-b from-academy-blue/10 to-canvas border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumbs trail={[
            { label: "Home", href: "/" },
            { label: "Exams", href: "/exams" },
            { label: "JFT-Basic", href: "/exams/jft-basic" },
            { label: "Mock tests", href: "/exams/jft-basic/mock-tests" },
            { label: "Mock 1" },
          ]} />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">Mock 1 — 20 questions, 30 minutes</h1>
          <Callout title="Before you start" tone="info">
            Find a quiet 30 minutes. The timer starts when questions load and auto-submits at zero.
            No hints, no explanations until you submit.
          </Callout>
        </div>
      </div>
      <Section className="!py-10">
        <div className="max-w-4xl mx-auto">
          <MockPlayer />
        </div>
      </Section>
    </>
  );
}
