import type { Metadata } from "next";
import { LegalPage, H2, P } from "@/components/legal";

export const metadata: Metadata = { title: "Refund & Cancellation Policy" };

export default function RefundsPage() {
  return (
    <LegalPage title="Refund & Cancellation Policy" updated="October 2026 (draft)">
      <H2>1. Free products</H2>
      <P>The diagnostic and sample quests are free forever. Nothing to refund, nothing to cancel.</P>
      <H2>2. Finite passes (e.g., 60-day exam pass, quest packs)</H2>
      <P>Full refund within 7 days of purchase if you have not started paid content. After that, refunds are pro-rated for unused time at our discretion — just ask.</P>
      <H2>3. Subscriptions (e.g., Kids family monthly)</H2>
      <P>Cancel anytime from billing settings; you keep access until the end of the paid period and are not charged again. Refunds for the current period are considered case-by-case within 7 days of renewal.</P>
      <H2>4. How to request</H2>
      <P>From your account or Parent Hub billing page, or via the contact form. We respond within 5 business days and issue refunds to the original payment method.</P>
      <H2>5. Pilot note</H2>
      <P>Checkout is in test mode — no real charges are being made. This policy takes full effect when live billing launches.</P>
    </LegalPage>
  );
}
