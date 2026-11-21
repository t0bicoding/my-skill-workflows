# Options Template

An options comparison lays more than two ways, or ways that differ on several criteria, side by
side, so the user decides on what each way costs instead of on a gut feeling. Its outcome feeds
the spec's **Implementation Decisions**.

## When to draw one

- A point has three or four real options, or two options that win on different criteria.
- The user asks "what's the difference?" about options from a short question.

Don't draw one when one option clearly wins — a short question with ⭐ is enough then.

## Rules

- 2–4 options, 3–5 criteria. Pick the criteria per point — the ones this decision actually
  turns on — and always include **Reversibility**: how expensive it is to switch later.
- Include "leave it as it is" as an option when not doing it is a real choice.
- Rate in words or with `++ / + / o / – / ––`, each cell with a few words of reason; no weighted
  scores — they pretend a precision nobody has.
- Mark a knockout criterion with `⛔` in its row: an option that fails it is out, whatever its
  other cells say.
- Labels in the chat language, in the user's words.
- Below the table: the worst case per option in one line each, then the recommendation.

<options-template>

| Criterion | ➡️ A: <option> | ➡️ B: <option> | ➡️ C: <option> |
|---|---|---|---|
| <criterion 1> | <rating — reason> | <rating — reason> | <rating — reason> |
| <criterion 2> | <rating — reason> | <rating — reason> | <rating — reason> |
| ⛔ <knockout criterion> | <rating — reason> | <rating — reason> | <rating — reason> |
| Reversibility | <rating — reason> | <rating — reason> | <rating — reason> |

⚠️ **Worst Case:**
- A: <what goes wrong and what it costs>
- B: <what goes wrong and what it costs>
- C: <what goes wrong and what it costs>

⭐ <Recommended option> — <why, naming the criterion that decides it>

</options-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

| Criterion | ➡️ A: Export as CSV | ➡️ B: Export as Excel file | ➡️ C: Copy to clipboard |
|---|---|---|---|
| Effort | ++ standard library | o extra dependency | ++ a few lines |
| Opens in the user's tool | + Excel asks about separators | ++ opens directly | – paste only |
| ⛔ Works for 10 000 rows | ++ streams | + fine | –– clipboard limit |
| Reversibility | ++ adding B later is cheap | + | ++ |

⚠️ **Worst Case:**
- A: Excel misreads decimal commas — numbers turn into dates.
- B: The dependency breaks an update — export gone until fixed.
- C: Large tables are silently cut off.

⭐ A — the knockout rules out C, and A keeps B open later at no cost.
