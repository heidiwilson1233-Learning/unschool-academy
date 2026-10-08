import type { Metadata } from "next";

/* Personal dashboard rendered from this device's localStorage: no content for
   search engines (mirrors app/exams/jft-basic/mock-tests/take noindex). */
export const metadata: Metadata = {
  title: "My exam progress — Unschool Academy",
  robots: { index: false, follow: false },
};

export default function AppExamsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
