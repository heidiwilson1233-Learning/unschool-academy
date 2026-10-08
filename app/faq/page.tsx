"use client";

import { useState } from "react";
import { Section, SectionHeading, FAQAccordion, Breadcrumbs, PageHero } from "@/components/ui";

const TABS = ["Exams", "Kids", "Payments", "Policies"] as const;

const FAQS: Record<(typeof TABS)[number], { q: string; a: string }[]> = {
  Exams: [
    { q: "Is the diagnostic really free?", a: "Yes — 10 original questions, instant topic feedback, reviewed explanations. No account, no paywall, forever." },
    { q: "Are your questions official JFT-Basic questions?", a: "No. All questions are original practice items. We never reproduce official past papers." },
    { q: "Will practice guarantee I pass?", a: "No — and anyone who promises that is misleading you. Practice builds skill; only the official test measures the official result." },
    { q: "Which exams do you support?", a: "JFT-Basic is our live pilot. JLPT N5/N4 and others are in research until verified and reviewed." },
  ],
  Kids: [
    { q: "What ages is Unschool Kids for?", a: "Ages 2 through Grade 5, across six tracks from parent-guided Little Explorers (2–3) to Young Explorers (Grade 5)." },
    { q: "Will my child see ads or purchase prompts?", a: "Never. Child mode has no ads, purchases, external links, social features, or open-ended AI chat." },
    { q: "How is progress reported?", a: "As observed evidence: independent, hinted, or demonstrated attempts, plus transfer to new examples. No scores, ranks, or developmental labels." },
    { q: "Can I delete my child's data?", a: "Yes — export or delete any time from Parent Hub → Privacy, with confirmation and an audit trail." },
  ],
  Payments: [
    { q: "When will I actually be charged?", a: "Checkout is in test mode during the pilot — no real charges. Live billing activates only after payment integration completes, and we'll announce it clearly." },
    { q: "Can I cancel?", a: "Yes, anytime from your account or Parent Hub billing page. Finite passes simply expire; subscriptions stop renewing." },
    { q: "What is your refund policy?", a: "See our refund policy page for the full terms. In short: unused time on finite passes is refundable within the stated window." },
  ],
  Policies: [
    { q: "Is Unschool Academy affiliated with exam boards?", a: "No. We are independent. Exam names belong to their owners; no affiliation or endorsement unless specifically stated." },
    { q: "How do you handle children's privacy?", a: "Minimal data, parent-owned accounts, jurisdiction-aware consent, and no child data in marketing. See the Children's Privacy page." },
    { q: "Who reviews your content?", a: "Subject experts for exams, educators for kids — through a draft → check → review → QA → publish pipeline. Drafts are labelled as drafts." },
  ],
};

export default function FaqPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Exams");
  return (
    <>
      <PageHero eyebrow="Help" title="Frequently asked questions" sub="Straight answers, organized by topic." />
      <Section>
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
          <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="FAQ categories">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-[15px] transition-colors ${
                  tab === t ? "bg-academy-blue text-white" : "bg-paper border border-border text-ink hover:border-academy-blue"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <SectionHeading align="left" title={`${tab} questions`} />
          <FAQAccordion items={FAQS[tab]} />
        </div>
      </Section>
    </>
  );
}
