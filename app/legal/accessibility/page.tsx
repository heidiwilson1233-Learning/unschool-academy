import type { Metadata } from "next";
import { LegalPage, H2, P } from "@/components/legal";

export const metadata: Metadata = { title: "Accessibility Statement" };

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility Statement" updated="October 2026 (draft)">
      <H2>1. Our commitment</H2>
      <P>Unschool Academy aims to be usable by everyone, including learners using keyboards, screen readers, and reduced-motion settings. Accessibility is a release gate, not an afterthought.</P>
      <H2>2. What we build in</H2>
      <P>Keyboard-navigable navigation, question players, and kids' scenes; visible focus indicators; captions and transcripts for all audio; audio never required to complete a task; non-drag alternatives for every drag interaction; respect for prefers-reduced-motion; colour never the only signal.</P>
      <H2>3. Known limits</H2>
      <P>Some interactive scenes are visual-first; we provide text alternatives and work to close gaps. If you hit a barrier, tell us — accessibility reports go to the top of our fix queue.</P>
      <H2>4. Feedback</H2>
      <P>Report accessibility issues via the contact form with the topic “Accessibility”. We aim to acknowledge within 2 business days.</P>
    </LegalPage>
  );
}
