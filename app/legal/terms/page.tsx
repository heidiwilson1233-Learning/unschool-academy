import type { Metadata } from "next";
import { LegalPage, H2, P } from "@/components/legal";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="October 2026 (draft)">
      <H2>1. What Unschool Academy is</H2>
      <P>Unschool Academy provides online practice and learning content: exam preparation for adult learners and interactive learning quests for children under parent-owned accounts. We are not an accredited school, certifying authority, or official exam provider.</P>
      <H2>2. Accounts</H2>
      <P>Exam learner accounts are for individuals 16+ (or the age of digital consent in your jurisdiction). Kids profiles are created and managed only by a verified parent or guardian; we do not contract directly with children.</P>
      <H2>3. Acceptable use</H2>
      <P>Do not scrape, redistribute, or resell our content; do not attempt to access other users' data, manipulate scoring, or interfere with the service. We may suspend accounts that abuse the platform.</P>
      <H2>4. Payments</H2>
      <P>Paid plans are described on the pricing page with scope, duration, and cancellation terms. Checkout is in test mode during the pilot; live billing terms will be published before any real charge.</P>
      <H2>5. Content and IP</H2>
      <P>All practice questions, quests, characters, and artwork are original works of Unschool Academy (or licensed to us). Exam names belong to their respective owners; see our trademark notice.</P>
      <H2>6. Limitation of liability</H2>
      <P>Practice scores are unofficial and educational only. To the maximum extent permitted by law, we are not liable for exam outcomes, admissions, immigration decisions, or developmental claims.</P>
      <H2>7. Changes</H2>
      <P>We may update these terms with notice on this page. Continued use after changes take effect constitutes acceptance.</P>
    </LegalPage>
  );
}
