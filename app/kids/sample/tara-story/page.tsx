import type { Metadata } from "next";
import StoryQuest from "@/components/story-quest";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Free Quest — Tara's Four-Card Story (Grades 1–2)",
  description:
    "Play a complete free Unschool Kids quest: order Tara's mixed-up story cards and choose the perfect title.",
};

export default function StoryQuestPage() {
  return (
    <div className="bg-kids-cream min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs trail={[
          { label: "Home", href: "/" },
          { label: "Kids", href: "/kids" },
          { label: "Grades 1–2", href: "/kids/grades/1-2" },
          { label: "The Four-Card Story" },
        ]} />
        <StoryQuest />
      </div>
    </div>
  );
}
