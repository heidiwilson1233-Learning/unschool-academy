import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unschool Academy — Learn by doing",
  description: "A warm learning studio. Fresh start — rebuilding beautifully, one piece at a time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
