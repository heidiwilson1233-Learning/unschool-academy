# Kids Quest Schema

Quests are the atomic learning unit of Unschool Kids. Each quest is one JSON file under `content/kids/quests/<id>.json`, rendered by `/kids/quest/[id]`.

## Fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique, e.g. `KB-001-Q1`. Book-based: `<book_id>-Q<n>`. Original: `ORIG-Q<n>`. |
| `book_id` | string \| null | Links to `books-500.json`. Null for original quests. |
| `quest_type` | string | One of: `read-aloud`, `vocabulary`, `comprehension`, `value-quest`, `math-in-story`, `wonder-quest`, `create-quest`. |
| `subject` | string | One of: `words`, `numbers`, `world`, `values`, `create`. |
| `track` | string | One of: `school-starters` (5–6), `adventure-club` (6–8), `quest-makers` (8–10), `young-explorers` (10–11). |
| `character` | string | `momo` \| `tara` \| `bobo`. |
| `title` | string | Child-facing title. |
| `objective` | string | One learning objective (parent/educator facing). |
| `difficulty` | 1 \| 2 \| 3 | Smart-learning level. 3 correct in a row → up; struggle → hint + easier. |
| `story_beats` | array | Narrative frames. `{ text, art_note? }`. Read aloud by the character. |
| `interactions` | array | The playable moments. Types: `tap-choice` (big options), `count-tap` (tap N objects), `order` (sequence cards), `speak-repeat` (say it aloud), `draw` (free draw prompt). |
| `feedback` | object | `{ correct, retry }` — warm, specific, never a red X. |
| `off_screen` | string | The invitation to continue offline when the quest ends. |
| `parent_note` | string | What the child practiced (feeds the weekly parent report). |
| `status` | string | `draft-pending-educator-review` until a human educator reviews. |

## Rules

- One quest = one learning objective. Never two.
- Audio-first: every text has a spoken equivalent (character voice).
- No fail states. Wrong answers get hints and retries, never penalties.
- Every quest ends: celebration beat → off-screen invitation → session closes.
- All quests ship `draft-pending-educator-review`.
