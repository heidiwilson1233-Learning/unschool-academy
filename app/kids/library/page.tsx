import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Section, SectionHeading, Card, Badge, Breadcrumbs } from "@/components/ui";
import { ENDLESS_MODEL } from "@/lib/kids";

export const metadata: Metadata = {
  title: "The 500-Book Library | Unschool Kids",
  description:
    "500 children's books — Indian classics, folk tales and global favourites. Every book becomes read-alouds, vocabulary quests, comprehension, values, maths and science.",
  alternates: { canonical: "/kids/library" },
};

type Book = { id: string; title: string; author?: string; age: string; origin: string; themes: string[] };

function loadBooks(): { books: Book[]; target: number } {
  const p = path.join(process.cwd(), "content", "kids", "books-500.json");
  const raw = fs.readFileSync(p, "utf-8");
  const data = JSON.parse(raw);
  return { books: data.books, target: data.target };
}

function questCountForBook(bookId: string): number {
  const dir = path.join(process.cwd(), "content", "kids", "quests");
  try {
    const files = fs.readdirSync(dir);
    let n = 0;
    for (const f of files) {
      const q = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
      if (q.book_id === bookId) n++;
    }
    return n;
  } catch {
    return 0;
  }
}

const QUEST_KINDS = ["Read-aloud", "Vocabulary", "Comprehension", "Value quest", "Math-in-story", "Wonder quest", "Create"];

export default function LibraryPage() {
  const { books, target } = loadBooks();
  const counts = books.map((b) => questCountForBook(b.id));

  return (
    <>
      <div className="bg-kids-cream border-b border-kids-orange/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Kids", href: "/kids" }, { label: "Library" }]} />
          <Badge tone="kids">📚 The book library</Badge>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-ink">500 books. Endless quests.</h1>
          <p className="mt-4 text-lg text-slate max-w-2xl leading-relaxed">
            Every book becomes up to 7 kinds of quests — read-alouds, vocabulary, comprehension, values, maths-in-story,
            wonder-quests and creative retellings. One new book unlocks every week, so the library never runs out.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl bg-white border border-line px-5 py-3">
              <p className="text-2xl font-extrabold text-ink">{books.length}<span className="text-slate/50 text-lg">/{target}</span></p>
              <p className="text-xs text-slate">books curated</p>
            </div>
            <div className="rounded-2xl bg-white border border-line px-5 py-3">
              <p className="text-2xl font-extrabold text-ink">~{ENDLESS_MODEL.baseTotal.toLocaleString()}</p>
              <p className="text-xs text-slate">quests at full library</p>
            </div>
            <div className="rounded-2xl bg-white border border-line px-5 py-3">
              <p className="text-2xl font-extrabold text-ink">1/week</p>
              <p className="text-xs text-slate">new book unlocks</p>
            </div>
          </div>
        </div>
      </div>

      <Section>
        <SectionHeading
          eyebrow="How a book becomes learning"
          title="One book, seven adventures"
          sub="Each book is mined for everything a 5–11 year old can learn from it — words, ideas, values, numbers and wonder."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUEST_KINDS.map((k) => (
            <Card key={k} className="!p-5"><p className="font-semibold text-ink">✨ {k}</p></Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="The shelves" title="Books on the shelf now" sub="Curated Indian classics, folk tales and global favourites. Every book is human-reviewed before quests are built from it." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((b, i) => (
            <Card key={b.id} className="!p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-ink leading-snug">{b.title}</p>
                  <p className="mt-1 text-sm text-slate">{b.author ?? b.origin} · Ages {b.age}</p>
                </div>
                {counts[i] > 0 && <Badge tone="kids">{counts[i]} quests</Badge>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {b.themes.map((t) => (
                  <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate">{t}</span>
                ))}
              </div>
              {counts[i] === 0 && (
                <p className="mt-3 text-xs text-slate/70">Quests growing — unlocks soon 🌱</p>
              )}
            </Card>
          ))}
        </div>
        <p className="mt-8 text-center text-slate">
          …and {target - books.length} more being curated.
        </p>
        <p className="mt-3 text-center">
          <Link href="/kids/roadmap" className="font-semibold text-ink underline">
            See the 15-quest prototype plan
          </Link>
          <span className="mx-2 text-slate/40" aria-hidden>
            ·
          </span>
          <Link href="/kids" className="font-semibold text-ink underline">
            Back to Kids
          </Link>
        </p>
      </Section>
    </>
  );
}
