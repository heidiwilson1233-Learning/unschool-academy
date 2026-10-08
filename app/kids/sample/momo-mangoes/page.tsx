import type { Metadata } from "next";
import MangoQuest from "@/components/mango-quest";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Free Quest — Momo's Three Mangoes (Ages 3–5)",
  description:
    "Play a complete free Unschool Kids quest: help Momo count exactly three mangoes, with hints, a transfer challenge, and an off-screen activity.",
};

export default function MangoQuestPage() {
  return (
    <div className="bg-kids-cream min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs trail={[
          { label: "Home", href: "/" },
          { label: "Kids", href: "/kids" },
          { label: "Ages 3–5", href: "/kids/ages/3-5" },
          { label: "Three Mangoes for the Picnic" },
        ]} />
        <MangoQuest />
      </div>
    </div>
  );
}
