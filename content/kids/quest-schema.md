# Kids Quest Schema (v2)

Quests are the atomic learning unit of Unschool Kids. Each quest is one JSON file under `content/kids/quests/<id>.json`, rendered by `/kids/quest/[id]`.

Source of truth for the fields below: `lib/quest-engine.ts` (types + validator SSOT). The prebuild gate `scripts/validate-kids-quests.mjs` enforces this document on every build. Blueprint: `docs/03_KIDS_LEARNING_WORLD.md` §6 (activity declarations), §7 (7-step flow), §13 (prototype release), §15 (acceptance).

## Fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique, equals the filename. Book-based: `<book_id>-Q<n>`. Original: `ORIG-Q<n>`. |
| `book_id` | string \| null | Links to `books-500.json`. Null for original quests. |
| `quest_type` | string | One of the 7 kinds in `lib/kids.ts` `BOOK_QUEST_TYPES`. |
| `subject` | string | One of the 5 `KID_SUBJECTS` slugs. |
| `track` | string | One of the 4 `AGE_TRACKS` slugs (= doc 03 §6 `age_track`). |
| `character` | string | `momo` \| `tara` \| `bobo`. |
| `title` | string | Child-facing title. |
| `objective_id` | string | Skill-objective code, e.g. `numbers.counting.to20` (= doc 03 §6 `objective_id`). |
| `objective` | string | One learning objective (parent/educator facing). |
| `difficulty` | 1 \| 2 \| 3 | Smart-learning level. 3 correct in a row → up; struggle → hint + easier. |
| `prerequisites` | string[] | Quest ids that should come first. Empty = entry quest. |
| `assets` | `{ art: string[], audio: string[] }` | Production assets. Empty until produced and reviewed. |
| `primary_language` | `"en"` | Narration language today. |
| `secondary_language` | string \| null | Null until a second language version is authored and reviewed. |
| `narration` | `{ mode, voice_reviewed }` | `live-tts` = browser speech synthesis at play time (NOT reviewed audio). `cached-audio` = reviewed voice clips. Honest about which. |
| `story_beats` | array | Narrative frames. `{ text, art_note? }`. Read aloud by the character. |
| `interactions` | array | The playable moments. Each declares `type`, `template` (one of the 4 reusable templates, or null for open creation), and `answer_rule`. |
| `hint_sequence` | string[] | Layered help, weakest-first: repeat → point → partial example (doc 03 §7 step 5). Never a red X. |
| `transfer_question` | string | The changed-example check with different objects/values (doc 03 §7 step 6). |
| `feedback` | object | `{ correct, retry }` — warm, specific, never a red X. |
| `off_screen` | string | The invitation to continue offline when the quest ends (= doc 03 §6 `offscreen_activity`). |
| `parent_note` | string | What the child practiced (feeds the weekly parent report). |
| `duration_target` | number | Minutes. A target, not a measurement. 1–20. |
| `content_reviewer` | object \| null | `{ name, role, date }`. Null until a human educator reviews. Never invent a name. |
| `review_status` | string | `draft-pending-educator-review` → `in-educator-review` → `reviewed`. |
| `published_version` | number | Immutable content version. `0` = unpublished draft. Only reviewed quests may publish. |

## The 4 reusable templates (doc 03 §13 — built before authoring the rest)

| Template | Exercises | Contract |
|---|---|---|
| `select-objects` | tap-choice, count-tap | tap-choice: 2–4 options + correct index · count-tap: target_count + options + correct index |
| `sort` | tap-choice (classify-one) | options are candidate groups + correct group index. Dedicated drag-free multi-sort widget: wave 2. |
| `sequence` | order | options[] listed in the correct order (renderer shuffles at display), ≥2 cards |
| `distribute` | count-tap (share variant) | target_count = total shared; prompt names the groups. Dedicated share widget: wave 2. |

`speak-repeat` and `draw` are open creation: `template: null`, `answer_rule.kind: "open"`.

## Rules

- One quest = one learning objective. Never two.
- Audio-first: every text has a spoken equivalent. `narration.mode` says honestly whether it is reviewed audio or live TTS.
- No fail states. Wrong answers get the `hint_sequence` and retries, never penalties.
- Every quest ends: celebration beat → off-screen invitation → session closes.
## Review honesty

- `review_status`: `draft-pending-educator-review` → `in-educator-review` → `reviewed`.
- The validator enforces: `reviewed` requires a named `content_reviewer` (never invent a name); `published_version > 0` requires `reviewed`.
- A prototype-plan brief may be marked `playable` only when its `quest_id` file exists with `review_status: "reviewed"`, a named `content_reviewer`, and `published_version > 0` (doc 03 §15 acceptance). The happy path is defined before it is needed.
- All quests ship `draft-pending-educator-review` until a human educator reviews them.
