import type { Metadata } from "next";
import { LegalPage, H2, P } from "@/components/legal";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 2026 (draft)">
      <H2>1. Data we collect</H2>
      <P>Account data (name, email), learning activity (attempts, answers, quest progress), purchase records, and support messages. For children: only a nickname/avatar, age band, language, and learning activity — never full names, birthdays, schools, photos, or voice.</P>
      <H2>2. What we never do</H2>
      <P>We never sell personal data. Children's data is never used for marketing segmentation or behavioural advertising. We never collect card numbers — payments go through our gateway provider.</P>
      <H2>3. Why we process data</H2>
      <P>To provide the service (accounts, scoring, progress), process payments, offer support, and improve content in aggregate. Marketing emails are opt-in only, with one-click unsubscribe.</P>
      <H2>4. Your rights</H2>
      <P>Request export or deletion of your data from Account settings (adults) or Parent Hub → Privacy (families). We respond within 30 days and keep an audit trail of deletion.</P>
      <H2>5. Retention</H2>
      <P>Learning data is kept while your account is active and for a defined period after closure for support and legal obligations, then deleted or anonymized. Child data has the shortest retention schedule.</P>
      <H2>6. Security</H2>
      <P>Encrypted in transit and at rest, server-side authorization checks on every protected resource, and no secrets in client code. No system is perfect; we disclose breaches as required by law.</P>
      <H2>7. Cookies</H2>
      <P>Essential cookies keep you signed in and remember preferences. Analytics cookies are consent-based. You can change cookie choices any time; child-mode pages run without advertising trackers.</P>
    </LegalPage>
  );
}
