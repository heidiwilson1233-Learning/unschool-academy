import type { Metadata } from "next";
import { LegalPage, H2, P } from "@/components/legal";

export const metadata: Metadata = { title: "Exam Trademarks & Unofficial Status" };

export default function ExamTrademarksPage() {
  return (
    <LegalPage title="Exam Trademarks & Unofficial Status" updated="October 2026 (draft)">
      <H2>1. Independent service</H2>
      <P>Unschool Academy is an independent practice and learning service. We are not affiliated with, endorsed by, or sponsored by any examination body, including the Japan Foundation (JFT-Basic), the JLPT organizers, or any other test owner named in our research.</P>
      <H2>2. Trademarks</H2>
      <P>Exam names, logos, and program names belong to their respective owners and are used here only to describe what our practice prepares you for — nominative fair use, no endorsement implied.</P>
      <H2>3. Unofficial practice</H2>
      <P>All questions are original. Practice scores are unofficial and cannot predict official results. We never reproduce official past papers or claim official status.</P>
      <H2>4. Corrections</H2>
      <P>If you represent an examination body and believe any content misrepresents your program, contact us and we will review and correct promptly.</P>
    </LegalPage>
  );
}
