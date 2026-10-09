import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs, PageHero, EmptyState } from "@/components/ui";

export const metadata: Metadata = {
  title: "Exams — Published Preparation Programs",
  description:
    "Browse Unschool Academy's verified exam preparation programs. Only reviewed, live programs are listed — our 500-exam research catalogue is research-labeled, never listed as live, until verified.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
    { "@type": "ListItem", position: 2, name: "Exams", item: "https://unschool.academy/exams" },
  ],
};

export default function ExamsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PageHero
        eyebrow="Unschool Exams"
        tone="exam"
        title="Pass the JFT-Basic with practice that shows its work"
        sub="Every program below is verified, reviewed, and actually built — you can start it right now. Our 500-exam research catalogue is research-labeled and never listed as live until each program earns its place here."
        art="/img/card-exams.webp"
        artAlt="An open passport, certificate scroll, pencil and reading glasses arranged on warm paper"
      >
        <Button href="/exams/jft-basic/diagnostic" size="lg">Try the free diagnostic</Button>
        <p className="w-full text-sm text-slate mt-1">Free · 10 questions · 5 minutes · no account needed</p>
      </PageHero>

      <Section className="!pt-8 !pb-0">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Exams" }]} />
        </div>
      </Section>

      <Section>
        <SectionHeading
          align="left"
          eyebrow="Live programs"
          title="Published exam preparation"
          sub="What exists today — verified, reviewed, and ready to start. Research-stage exams are never listed as purchasable products."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card hover className="!p-0 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-br from-academy-blue to-academy-teal p-6 text-white">
              <Badge tone="success"><span className="text-academy-teal-dark" aria-hidden="true">●</span> Live pilot</Badge>
              <h2 className="mt-3 text-2xl font-extrabold">JFT-Basic</h2>
              <p className="text-white text-sm mt-1">Everyday Japanese · Japan Foundation</p>
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
                <Button href="/exams/jft-basic/diagnostic" size="sm">Free diagnostic</Button>
                <Button href="/exams/jft-basic" size="sm" variant="ghost">View program →</Button>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col justify-center !bg-canvas">
            <EmptyState
              title="The next program is being earned"
              body="JLPT N5/N4 and other exams are evaluated one at a time — on syllabus stability, licensing, reviewer availability and real demand. We publish only what we've built and reviewed, never what we've merely listed."
              action={<Button href="/exams/japanese" variant="secondary" size="sm">Japanese learning hub</Button>}
            />
          </Card>
        </div>
      </Section>

      <Section className="!pt-0">
        <Card className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-ink mb-2">Our publishing promise</h2>
          <p className="text-slate leading-relaxed text-[15px]">
            An exam appears in this catalogue only after: official facts verified against the
            organizer&apos;s pages, a reviewed syllabus map, original practice content with
            subject-expert signoff, and a working free sample. Until then it stays in our
            research-labeled catalogue — never presented as a live program.
          </p>
          <div className="mt-5">
            <Button href="/exams/catalog" variant="secondary" size="sm">
              Browse the 500-exam research catalogue →
            </Button>
          </div>
        </Card>
      </Section>

      <Section className="!pt-0">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-academy-blue to-academy-teal rounded-3xl p-10 md:p-14">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Find out where your Japanese stands — in 5 minutes
          </h2>
          <p className="mt-3 text-white text-[15px]">
            Free diagnostic, instant topic breakdown. No account, no catch.
          </p>
          <div className="mt-6">
            <Button href="/exams/jft-basic/diagnostic" size="lg" variant="secondary">
              Start the free diagnostic
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
