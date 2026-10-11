# Kids content-status contract + count arithmetic (UA-003)

Honesty rule for every Kids surface: today's inventory and the planned scale are
shown separately, never blended. Counts on pages are generated from the inventory
files at build time (`app/kids/_inventory.ts`); planned numbers live only in
explicitly labelled plan/roadmap sections.

## The four public states (blueprint row 32 — one vocabulary everywhere)

| State       | Meaning                                                              | Example on-site today                                   |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------------------- |
| `brief`     | A plan, not a product. Prototype briefs in `prototype-plan.json`.   | The 15 briefs on `/kids/roadmap`                        |
| `draft`     | Authored content, not yet playable/claimable. Quest JSONs with `review_status: draft-pending-educator-review`. Nothing here counts as "live". | All 16 quest files in `content/kids/quests/` |
| `demo`      | A playable sample track, always labelled **demo**. Complete but small; not a full quest. | `/kids/sample/momo-mangoes`, `/kids/sample/tara-story` |
| `published` | Educator-reviewed and launched.                                      | None yet — the column stays at 0 until a human signs off |

Quest JSON `review_status` values map: `draft-pending-educator-review` → `draft`;
any `…demo…` value → `demo`; `published`/`playable` → `published`. AI review never
counts as educator signoff — the published column moves only on genuine human review.

## The arithmetic (blueprint row 31)

- **500 books × 7 quest kinds = 3,500 authored base quests** at full library.
  The 7 kinds: read-aloud, vocabulary, comprehension, value-quest, math-in-story,
  wonder-quest, create-quest (`lib/kids.ts` `BOOK_QUEST_TYPES`).
- The old on-site claim of "~4,000" was wrong arithmetic: 500 × 7 is 3,500, not 4,000.
- **Parametric variants** (e.g. one counting quest × object sets × number ranges) generate
  near-endless practice *from* a base quest. Variants are NOT counted as unique quests
  in the 3,500. "Endless" = 3,500 authored quests + parametric variants, stated separately.

## Inventory snapshot (2026-10-12, verified by `scripts/validate-kids-quests.mjs`)

- Quest files: **16** (`KB-*` × 9, `ORIG-Q1`–`ORIG-Q7`) — **16 draft, 0 demo, 0 published**.
- Books: **50 curated of 500 planned** (`books-500.json` seed list, `target: 500`).
- Playable today: **2 demo tracks** (samples above). Everything else is draft or brief.

## Where each number may appear

- Today's inventory (`16 quests authored · all awaiting educator review`, `50 of 500 books
  curated`, `2 playable demo tracks`) — anywhere, always generated from inventory.
- Planned scale (500 books, 7 kinds, 3,500 quests, 1 new book/week cadence) — ONLY in
  sections explicitly labelled as the plan (e.g. `/kids` "The plan — still being built",
  `/kids/roadmap`, the library's "the plan" stat).
