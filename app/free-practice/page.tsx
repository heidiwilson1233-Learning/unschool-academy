import type { Metadata } from "next";
import { Section, SectionHeading, Button, Breadcrumbs, PageHero } from "@/components/ui";
import { JftSampler, KidsSampler } from "@/components/samplers";

export const metadata: Metadata = {
  title: "Free Practice — Try Before Anything Else",
  description:
    "Free Unschool Academy practice: the JFT-Basic diagnostic sampler and a Momo kids quest sampler. Real interactions, no account, no paywall.",
};

export default function FreePracticePage() {
  return (
    <>
      <PageHero
        eyebrow="Free forever"
        title="Practice first. Decide later."
        sub="Everything below is genuinely free — no trial timers, no result paywalls. If the free experience doesn't convince you, nothing we sell will."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Free Practice" }]} />
        <SectionHeading
          align="left"
          eyebrow="Exams"
          title="JFT-Basic free practice"
          sub="A question from the pilot, then the full 10-question diagnostic with server scoring and reviewed explanations."
        />
        <div className="max-w-2xl">
          <JftSampler />
        </div>
        <div className="mt-6">
          <Button href="/exams/jft-basic/diagnostic" size="lg">Take the full diagnostic</Button>
        </div>
      </Section>
      <Section className="bg-paper border-y border-border">
        <SectionHeading
          align="left"
          tone="kids"
          eyebrow="Kids"
          title="A moment from Momo's quest"
          sub="The real counting interaction from our ages 3–5 prototype — then the full quest with hints and a transfer challenge."
        />
        <div className="max-w-2xl">
          <KidsSampler />
        </div>
      </Section>
    </>
  );
}
