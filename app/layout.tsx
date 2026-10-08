import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_JP } from "next/font/google";
import { SiteHeader } from "@/components/chrome";
import { GlobalFooter } from "@/components/chrome";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-noto-sans",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: {
    default: "Unschool Academy — Practice until it makes sense",
    template: "%s | Unschool Academy",
  },
  description:
    "Unschool Academy helps you learn by doing — focused exam practice for adult learners, imaginative real learning for young children ages 2 through Grade 5.",
  metadataBase: new URL("https://unschool.academy"),
  openGraph: {
    type: "website",
    siteName: "Unschool Academy",
    title: "Unschool Academy — Practice until it makes sense",
    description:
      "Focused exam preparation and joyful learning for ages 2 through Grade 5 — built around things learners can actually do.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} ${notoSansJP.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <GlobalFooter />
      </body>
    </html>
  );
}
