import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs, PageHero, EmptyState } from "@/components/ui";

export const metadata: Metadata = {
  title: "Exams — Published Preparation Programs",
  description:
    "Browse Unschool Academy's verified exam preparation programs. Only reviewed, live programs are listed — our research catalogue stays internal until verified.",
};

export default function ExamsPage() {
  return (
    <>
      <PageHero
        eyebrow="Unschool Exams"
        tone="exam"
        title="One exam done well beats fifty done thinly"
        sub="Every program below is verified, reviewed, and actually built. Our 500-exam research catalogue stays internal — nothing appears here until it passes verification and content review."
      >
        <Button href="/exams/jft-basic/diagnostic" size="lg">Try the free diagnostic</Button>
      </PageHero>

      <Section>
        <SectionHeading
          align="left"
          eyebrow="Live programs"
          title="Published exam preparation"
          sub="Filter by what exists today. Research-stage exams are never listed as purchasable products."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card hover className="!p-0 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-br from-academy-blue to-academy-teal p-6 text-white">
              <Badge tone="success"><span className="text-academy-teal-dark">●</span> Live pilot</Badge>
              <h2 className="mt-3 text-2xl font-extrabold">JFT-Basic</h2>
              <p className="text-white/80 text-sm mt-1">Everyday Japanese · Japan Foundation</p>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-slate text-[15px] leading-relaxed flex-1">
                Practice for the JFT-Basic test of everyday Japanese needed for daily life in Japan.
                Free 10-question diagnostic, topic practice with explanations, and timed mocks.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-slate/10 text-slate font-semibold">Free diagnostic</span>
                <span className="px-2.5 py-1 rounded-full bg-slate/10 text-slate font-semibold">4 topics</span>
                <span className="px-2.5 py-1 rounded-full bg-slate/10 text-slate font-semibold">EN + 日本語 support</span>
              </div>
              <div className="mt-6 flex gap-3">
                <Button href="/exams/jft-basic" size="sm">View program</Button>
                <Button href="/exams/jft-basic/diagnostic" size="sm" variant="ghost">Free diagnostic →</Button>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col justify-center !bg-canvas">
            <EmptyState
              title="More programs in research"
              body="JLPT N5/N4 and other exams are being evaluated one at a time — on syllabus stability, licensing, reviewer availability and real demand. We publish only what we've built and reviewed."
              action={<Button href="/exams/japanese" variant="secondary" size="sm">Japanese learning hub</Button>}
            />
          </Card>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Exams" }]} />
        </div>
        <Card className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-ink mb-2">Our publishing promise</h2>
          <p className="text-slate leading-relaxed text-[15px]">
            An exam appears in this catalogue only after: official facts verified against the
            organizer&apos;s pages, a reviewed syllabus map, original practice content with
            subject-expert signoff, and a working free sample. Until then it stays in our internal
            research catalogue — never as a thin public page.
          </p>
        </Card>
      </Section>
    </>
  );
}
