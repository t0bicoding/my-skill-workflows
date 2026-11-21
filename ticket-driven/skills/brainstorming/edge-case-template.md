# Edge Case Template

An edge case table plays the worst cases through: for each case what the system does, what the
user sees and what is left of the data afterwards. Every decided row is a ready acceptance
criterion and test case — its outcome feeds the spec's **User Stories** acceptance criteria and
**Testing Decisions**.

## When to draw one

- The happy path is settled and the point is "what if it goes wrong?".
- A risk from the **Situation** needs deciding behavior, not just naming.

Don't draw one before the happy path is settled — the cases hang off its steps.

## Rules

- Go through the checklist below and keep only the cases that can really happen in this feature;
  don't fill the table for completeness.
- One row per case, most expensive consequence first.
- **Data afterwards** is always filled: what is saved, what is lost, what is half-done. A row whose
  answer is "lost" needs a reason or an undo.
- A row whose behavior is still undecided carries `❓ Point <n>`; settle it in that point with a
  short question or an options comparison.
- Labels in the chat language, in the user's words.

## Checklist

| Case | Question |
|---|---|
| Empty | Nothing there yet, nothing selected, empty input? |
| Too much | Very many items, very large file, very long text? |
| Twice | Clicked twice, submitted twice, same thing created twice? |
| Interrupted | Crash, closed window, lost connection in the middle of a step? |
| At the same time | Two users or processes on the same thing at once? |
| Stale | The user acts on a view that someone else has changed meanwhile? |
| Invalid | Wrong format, foreign file, value out of range? |
| Existing data | Old records that don't fit the new rules? |
| Undo | The user regrets it — can they get back? |

<edge-case-template>

| Case | What the system does | User sees | Data afterwards |
|---|---|---|---|
| <case> | <behavior> | <message / view> | <saved / lost / half-done> |
| <case> | <behavior> ❓ Point <n> | <message / view> | <saved / lost / half-done> |

</edge-case-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

| Case | What the system does | User sees | Data afterwards |
|---|---|---|---|
| Connection lost while uploading | aborts, keeps nothing | "Upload failed, try again" | nothing saved, no half file |
| Same file uploaded twice | ❓ Point 5 | — | — |
| File larger than 100 MB | refuses before uploading | "File too large (max 100 MB)" | nothing saved |
| Two users upload to the same folder | both are saved | both files in the list | both saved ✅ |
