import type { Metadata } from "next";
import { LegalPage, H2, P } from "@/components/legal";

export const metadata: Metadata = { title: "Children's Privacy" };

export default function ChildPrivacyPage() {
  return (
    <LegalPage title="Children's Privacy" updated="October 2026 (draft)">
      <H2>1. Parent-owned by design</H2>
      <P>Children do not create accounts. A verified adult creates the family account, gives consent, and manages every child profile. Consent procedures follow jurisdiction-specific legal review (India DPDP, US COPPA where applicable) — a checkbox alone is not assumed sufficient.</P>
      <H2>2. Minimal data</H2>
      <P>Child profiles hold: a generated ID, nickname or avatar, age band, language, and learning activity. We do not ask for or store full names, dates of birth, schools, addresses, photos, voice recordings, or biometrics.</P>
      <H2>3. No commercial pressure</H2>
      <P>Child mode contains no ads, no purchases, no external links, no social features, and no open-ended AI chat. No behavioural advertising to children, ever.</P>
      <H2>4. Learning evidence, not surveillance</H2>
      <P>We record what was attempted and whether it was independent, hinted, or demonstrated — to show parents real evidence. We do not compute ability scores, rankings, or developmental diagnoses.</P>
      <H2>5. Parent controls</H2>
      <P>From the Parent Hub you can review activity, set session boundaries, export your family's data, revoke consent, and request deletion. Deletion removes child records and is confirmed in writing.</P>
      <H2>6. Questions</H2>
      <P>Contact us about children's privacy any time. During the pilot: support@unschool.academy (to be configured).</P>
    </LegalPage>
  );
}
