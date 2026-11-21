---
name: human-review
description: Optional guided code review of an implemented slice in the chat - picks the code spots worth a human look, asks about each one in question rounds with diff, context, link and options with a recommendation, records the result in review/review.md and, if changes are wanted, writes review/review-scope.md for a fix run with implement. Usage - /human-review [feature] [slice-nn]
disable-model-invocation: true
---

# Human Review

Goal: the user understands what was built, keeps the overview of the codebase and decides on the spots that matter. Not a raw diff and not a document to work through alone, but a conversation about selected spots.

Shared rules: [Rules for skills](../feature-structure/SKILL.md#rules-for-skills), only that section.

## 1. Preparation

- Find the feature and the slice: the slice `in progress` with a `handoff.md`. After `implement all` there can be several; take the one given, otherwise ask. Work on the feature branch (switch if needed, see "Right branch first" in [feature-structure](../feature-structure/SKILL.md#rules-for-skills)).
- Read `handoff.md`, `scope.md` and the diff of the slice. Interview topic files (the slice's `interview/`, after `fast-lane` `implementation/interview/`) only where a stop needs the "why"; find them via the interview `README.md`. The slice starts after the last commit `feat(<feature>): slice-…` or `docs(<feature>): fast-lane plan`, or at the merge base with the default branch for the first slice. After `implement all`, the slice is exactly its commit `feat(<feature>): slice-<nn> …`.
- **Review folder:** `implementation/slice-<nn>/review/`.
  - `review.md` with status `in progress` exists: an interrupted review. Continue from it.
  - `review.md` is `done`, and fixes from `review-scope.md` were built since: a re-check (see 6).

## 2. Pick the stops

Go through the diff and pick the spots worth a human look. Group hunks that belong together into one stop.

**Always a stop** (one is enough):

1. **Deviation:** every open `D-n` from `handoff.md`, and any spot that contradicts `scope.md` or an interview decision.
2. **Your uncertainty:** a deliberate compromise, a workaround, an assumption you could not verify.
3. **Hard to reverse:** data model, storage format on disk, contracts between processes or modules (e.g. IPC), public interfaces, new dependencies.
4. **Risk:** writing or deleting files, what is exposed across a security boundary, error handling that may swallow errors, possible data loss.
5. **Test gap:** an `SC` only partly covered, or a test that checks the implementation instead of the behaviour.

**A stop when two of these apply:**

- **New pattern:** introduced for the first time; later code will copy it.
- **Core logic:** a rule or state handling the user must know to keep the overview.
- **Taste, visible:** texts, layout, interactions, defaults that no test can judge.
- **Complexity:** async flows, race conditions, non-obvious edge cases.
- **New terms in code:** names that belong in the glossary.

**No stop:** mechanical changes (renames, formatting, lock files, generated code), code that follows an existing pattern 1:1 and is covered by tests, boilerplate, test helpers, configuration without a real choice.

Usually 3–8 stops per slice. Many more means the slice was too big; say so.

## 3. Overview

Before the first question, one message:

- what was built (from `handoff.md`, 2–3 sentences) and how to try it (from "How to try it" in `scope.md`),
- the planned stops in logical order (e.g. data → logic → UI), each with title and the criterion that makes it a stop,
- in one line, what you left out on purpose (e.g. "renames in `notes/`, test helpers").

The user can add or drop stops. Then create `review/review.md` from [templates/review.md](templates/review.md) with status `in progress` and the list of stops.

## 4. Rounds

- **One stop per round,** in the order of the overview. Wait for the answer before the next one.
- Per stop the user can pick an option, describe their own change or ask about the spot. Clarify questions, then ask again.
- **Recommend honestly:** if the spot is good as it is, recommend keeping it (⭐ on "Keep as is").
- **Deviation stops:** the options are accept or fix. On accept, set the `D-n` in `handoff.md` to `accepted`; if it affects an ADR, add the change to the interview files' `adrs.md` (create it if missing) and use the `write-adr` skill after the review.
- **After every round,** add the stop's decision to `review.md`.
- **`// REVIEW:` comments:** the user may also leave comments in the code (in the comment syntax of the language) while looking around. Before the end, collect them as extra stops in the same format, and remove the comments.

## Question format

As short as the spot allows. The diff is the only part that may make a question longer than a screen.

- **Order:** title, situation, context, diff, link, visual aid (optional), your assessment, question, options, recommendation.
- **Title:** `R-<n> · <short title>`, `<n>` = number of the stop. Add ⚠ when you are unsure about the spot.
- **Situation (📍):** how the code is reached, from the user's or the program's point of view, as a flow (e.g. `close window` → `main: 'close' event` → `flushPending()`). Steps as inline code chips joined by `→`, a few words each, 2–4 steps.
- **Context (🧭):** one sentence why the spot exists, with a link to the `SC` in `scope.md` or the interview decision.
- **Diff:** only the decisive hunk as a `diff` code block, at most about 15 lines. If more is needed, summarize it in one sentence and rely on the link or a visual aid.
- **Link (📄):** `[file.ts:12-48](path/file.ts#L12-L48)`, path relative to the project root, so it opens in VS Code.
- **Assessment (💬):** one or two sentences: what you notice, what the risk is, or why it is fine.
- **Options:** same start, different outcome. Under each option, `├─` with the flow from the situation on (what happens after the change; don't repeat the situation) and `└─` with `➕ … · ➖ …` in one line.
- **Purely structural spots** (types, names, module boundaries): no flow; instead a short code snippet per option or one sentence.
- Mark the recommended option with ⭐ and give the reason in one sentence at the end.
- The chat strips leading spaces, so the tree prefixes do the indenting.

````markdown
🔶 **R-<n> · <Short title>** ⚠

📍 `<step>` → `<step>` → `<code reached>`
🧭 <why the spot exists> ([SC-<n>](<path to scope.md>))

```diff
+ <changed lines>
```
📄 [<file>:<from>-<to>](<path>#L<from>-L<to>)
📎 [Visual aid: <what it shows>](<path>)

💬 <what you notice>

❓ **<The question, one sentence>**

**A · Keep as is**
├─ `<step>` → `<result>`
└─ ➕ <pro> · ➖ <con>

**B · <Change>** ⭐
├─ `<step>` → `<result>`
└─ ➕ <pro> · ➖ <con>

⭐ **B**: <why, one sentence>
````

## Visual aid

When a spot is more complex and every option has bigger consequences (e.g. another storage format, a restructuring across several files), explain the options in a file and keep the chat question short.

- **File:** `review/r<n>-<slug>.md` (e.g. `r3-autosave-close.md`); in the chat the `📎` line between link and assessment.
- **Content:** title `R-<n> · <short title>` as in the chat; one section per option with the same letter, ⭐ and `➕ … · ➖ …` line; every option in the same form (code per option, flow, data shape), so only the difference stands out; optionally what would have to be touched later for a concrete change. Mermaid is allowed.
- **Temporary:** deleted at the end (see 5); the chosen variant is written concretely into `review.md` and `review-scope.md`.

## 5. Finish

1. **Summary:** list the decisions per stop in the chat and wait for the user's confirmation.
2. **Clean up:** delete the visual aids `review/r<n>-*.md`.
3. **`review.md`:** fill in the result and the acceptance criteria with their tests, set the status to `done`.
4. **Changes wanted:** write `review/review-scope.md` from [templates/review-scope.md](templates/review-scope.md): one entry per change, with the `R-n` of its stop, concrete enough to build without the chat, with "done when". If a change contradicts the spec or a later slice's scope, say so and agree on it first.
5. **Next step** (full commands):
   - with changes: `/implement <feature> slice-<nn>` (fix run from `review-scope.md`),
   - without changes: `/close-slice <feature> slice-<nn>`.

## 6. Re-check after fixes

After the fix run, the user may run `/human-review` again to look at the result.

- Diff: only the fix commits since the review.
- Stops only for fixes that need a look (the change turned out different than described, or the user wanted to see it); confirm the rest in one line.
- Same rounds and format. Add a section "Re-check" to `review.md`. New changes get new `R-n` in `review-scope.md` (numbering continues) and go through `/implement` again.

## In one-shot

Same picking, overview and rounds in the chat, but without review folder and files. Changes are fixed directly with builder and reviewers.
