/* FAQ content for /faq — single source of truth shared by the server page
   (metadata + JSON-LD) and the client tab/search component. Must stay plain
   serializable data: no JSX, no functions. Copy follows the honesty rules —
   all explanations are labelled draft pending expert review. */

export const TABS = ["Exams", "Kids", "Payments", "Policies"] as const;
export type FaqTab = (typeof TABS)[number];

export const TAB_SLUGS: Record<FaqTab, string> = {
  Exams: "exams",
  Kids: "kids",
  Payments: "payments",
  Policies: "policies",
};

export type FaqLink = { label: string; href: string };
export type FaqItem = { q: string; a: string; link?: FaqLink };

export const FAQS: Record<FaqTab, FaqItem[]> = {
  Exams: [
    {
      q: "Is the diagnostic really free?",
      a: "Yes. 10 original questions, instant topic feedback, and explanations labelled draft pending expert review. No account, no paywall, forever.",
      link: { label: "Start the free diagnostic", href: "/exams/jft-basic/diagnostic" },
    },
    {
      q: "Are your questions official JFT-Basic questions?",
      a: "No. All questions are original practice items. We never reproduce official past papers.",
    },
    {
      q: "Will practice guarantee I pass?",
      a: "No, and anyone who promises that is misleading you. Practice builds skill. Only the official test measures the official result.",
    },
    {
      q: "Which exams do you support?",
      a: "JFT-Basic is our live pilot. JLPT N5/N4 and others are in research until verified and reviewed.",
    },
  ],
  Kids: [
    {
      q: "What ages is Unschool Kids for?",
      a: "For ages 2 through Grade 5, in six tracks from parent-guided Little Explorers (ages 2–3) to Young Explorers (Grade 5).",
    },
    {
      q: "Will my child see ads or purchase prompts?",
      a: "Never. Child mode has no ads, purchases, external links, social features, or open-ended AI chat.",
    },
    {
      q: "How is progress reported?",
      a: "As observed evidence: attempts done independently, with hints, or demonstrated by your child, plus transfer to new examples. No scores, ranks, or developmental labels.",
    },
    {
      q: "Can I delete my child's data?",
      a: "Yes. Export or delete any time from Parent Hub → Privacy, with confirmation and an audit trail.",
    },
  ],
  Payments: [
    {
      q: "When will I actually be charged?",
      a: "Checkout is in test mode during the pilot. No real charges. Live billing activates only after payment integration completes, and we'll announce it clearly.",
    },
    {
      q: "Can I cancel?",
      a: "Yes, anytime from your account or Parent Hub billing page. Finite passes simply expire; subscriptions stop renewing.",
    },
    {
      q: "What is your refund policy?",
      a: "In short: unused time on finite passes is refundable within the stated window.",
      link: { label: "Read the full refund policy", href: "/legal/refunds" },
    },
  ],
  Policies: [
    {
      q: "Is Unschool Academy affiliated with exam boards?",
      a: "No. We are independent. Exam names belong to their owners; no affiliation or endorsement unless specifically stated.",
    },
    {
      q: "How do you handle children's privacy?",
      a: "Minimal data, parent-owned accounts, jurisdiction-aware consent, and no child data in marketing.",
      link: { label: "Read the Children's Privacy page", href: "/legal/child-privacy" },
    },
    {
      q: "Who reviews your content?",
      a: "Subject experts for exams, educators for kids, through a draft → check → review → QA → publish pipeline. Drafts are labelled as drafts.",
    },
  ],
};
