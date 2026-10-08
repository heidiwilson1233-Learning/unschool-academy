import type { Metadata } from "next";
import { Section, SectionHeading, Card, Breadcrumbs, PageHero, Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "About — Method, Review Standards & Honesty",
  description:
    "About Unschool Academy: our learn-by-doing method, content review pipeline, and what we refuse to claim.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="We help you learn by doing"
        sub="Unschool Academy is a browser-first practice and learning platform: focused exam preparation for adult learners, imaginative real learning for young children."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <SectionHeading align="left" eyebrow="Method" title="Doing beats reading" />
            <p className="text-slate leading-relaxed">
              Every module answers five questions: who needs this, which skill improves, what the
              learner actually interacts with, what the source of correctness is, and what progress
              can legitimately be reported. If a lesson can't answer those, it doesn't ship.
            </p>
            <p className="text-slate leading-relaxed mt-4">
              We are online-first by design: discovery, practice, checkout, delivery and support all
              work remotely. That doesn't mean we're hands-off — content gets expert review, support
              gets human replies, and children's safety gets legal review.
            </p>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Review pipeline" title="How content earns publication" />
            <ol className="space-y-3">
              {["Drafted by our content team", "Fact and language check", "Subject-expert review (drafter never self-approves)", "Accessibility check", "QA in staging", "Published — then monitored"].map((s, i) => (
                <li key={s} className="flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-full bg-academy-blue/10 text-academy-blue font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="text-slate pt-1">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>
      <Section className="bg-paper border-y border-border">
        <SectionHeading align="left" eyebrow="What we are not" title="Plain about our limits" />
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
          {[
            "Not an accredited school, certifying authority, or official exam provider.",
            "Not affiliated with any examination body unless specifically stated.",
            "Not a promise of scores, admissions, visas, or accelerated child development.",
            "Not a fully autonomous AI teacher — AI assists production; humans review and approve.",
          ].map((t) => (
            <Card key={t} className="!p-5"><p className="text-slate text-[15px]">✗ {t}</p></Card>
          ))}
        </div>
        <div className="mt-8">
          <Button href="/legal/exam-trademarks" variant="secondary">Trademark & affiliation notice</Button>
        </div>
      </Section>
    </>
  );
}
