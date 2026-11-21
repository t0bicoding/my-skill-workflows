# Glossary Template

A glossary card pins down one domain term: what it means, what it is not, and which words to stop
using for it. Settling the word early keeps the spec, the tickets and the code speaking one
language. Its outcome feeds the project's `CONTEXT.md` (or `CONTEXT-MAP.md`) via
`/context-maintainer`, and the wording of the whole spec.

## When to draw one

- A new domain term surfaces in the conversation.
- The user and the project use different words for the same thing, or one word for two things.
- A term already in `CONTEXT.md` is about to change its meaning.

Don't draw one for a technical term that only developers use — it belongs in the code, not in
the domain vocabulary.

## Rules

- Look the term up in `CONTEXT.md` / `CONTEXT-MAP.md` and in the code first. If it already
  exists, show the current definition next to the proposed one.
- One term per concept; offer 1–3 candidate words when the word itself is open, with a ⭐.
- **Meaning** in one sentence, in the user's words.
- **Not to be confused with** names the closest neighbouring term and the difference.
- **Instead of** lists the words to stop using for this concept.
- The word is the user's decision; confirm it with ✅ like any other point.
- Labels in the chat language.

<glossary-template>

📖 **<term>**
- **Meaning:** <one sentence>
- **So far in `CONTEXT.md`:** <current definition, or "new">
- **Not to be confused with:** <neighbouring term> — <difference>
- **Instead of:** <words to avoid>

Candidates (if the word itself is open):
➡️ A: <word> — <how it reads>
➡️ B: <word> — <how it reads>
⭐ <word> — <why>

</glossary-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

📖 **Revision**
- **Meaning:** A saved, numbered state of a document that can be restored.
- **So far in `CONTEXT.md`:** new
- **Not to be confused with:** Draft — a draft is unsaved and has no number.
- **Instead of:** version, snapshot, backup

Candidates:
➡️ A: Revision — matches the "Rev." on the printed documents
➡️ B: Version — familiar, but clashes with the app's own version number
⭐ Revision — the users already say it, and it doesn't clash.
