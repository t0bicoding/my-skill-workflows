---
name: interview
description: Interviews the user in question rounds - each question with answer options and a recommendation - until there is a shared understanding, then writes the decisions by topic into an interview/ folder. Use to clarify anything, on its own or from another skill.
---

# Interview

## Preparation

- **Called by a skill:** work with the context, files and topics it passes in.
- **Called by the user:** take the context from the chat or the file the user names. If there is none, ask for a short description.

Read only the code that the questions touch. Finding facts is your job; don't ask the user for anything you can look up.

### Interview folder

Every interview has its own `interview/` folder. Everything it writes goes there:

| Called from | Folder |
|---|---|
| a slice | `docs/features/<feature>/implementation/slice-<nn>/interview/` |
| feature planning | `docs/features/<feature>/planning/interview/` |
| without a feature (directly, `one-shot`, `project-setup`, `project-roadmap`) | `docs/interview/<topic>/`, with `<topic>` a short kebab-case name (e.g. `backup-strategy`; in a one-shot its topic name; from `project-setup` or `project-roadmap` the skill's name), chosen at the start |

- **`progress.md` exists:** an interrupted interview. Continue from it (topics, decisions, open points, next question) instead of starting over.
- **Topic files exist from an earlier interview:** read them. New decisions update these files at the end; don't write a second set.

## Rounds

- **One question per round**, so the user can focus on it. Later questions build on earlier answers.
- **Order of topics:** take the topics that still need a decision (leave out what the passed files already decide), topics others depend on first. Adapt when answers open new topics.
- Wait for the answer before the next round.
- The user can ask back at any time: when they don't understand a question, the options don't fit or your understanding is wrong. Clarify, then continue.
- The important decisions are the user's. Recommend, never decide them.
- **After every round,** update `progress.md` (see Progress).

## Clear decisions

Ask only what really needs the user. Decide the rest yourself and show it, so the user can still object.

| Ask the user | Decide yourself |
|---|---|
| real alternatives with trade-offs | only one sensible option |
| affects what the user sees or experiences | follows from the spec, ADRs, existing conventions or the codebase |
| hard to reverse | easy to change later |
| depends on the user's taste or priorities | common practice nobody would question |

When in doubt, ask. Collect your own decisions in `progress.md` and show them in the summary at the end (see Finish), so the user can still object:

✔️ **Decided by me** (say if you want to change one):
- <Decision> — <why it's clear>

## Question format

A question must fit into the chat window without scrolling. Keep every line short.

- **Order:** title, situation, question, options, recommendation.
- **Situation, always (📍):** a flow of how the user gets into the situation the question is about (e.g. `Showcase open` → `click or Tab into "Title"` → `field has focus`). Background (spec item, earlier decision) goes into the options where it matters.
- **Flow per option:** under each option, what happens from the situation on (`├─` line). Don't repeat the situation.
- **Flow style (situation and options):** steps are inline code chips joined by `→`, a few words each, no emojis inside the flow, 2–4 steps.
- **Same start, different outcome:** every option continues the same situation, so the difference shows directly.
- **Concrete:** real screens and features of the project, real example data, no abstract terms.
- **Pros and cons in one line** per option: `➕ … · ➖ …`.
- **Purely technical questions** (nobody sees or does anything different): leave out the flow and show a short code snippet per option instead, or one sentence.
- Mark the recommended option with ⭐ in its heading and give the reason in one sentence at the end.
- **Tree prefix** for the lines under each option: `├─` before the flow, `└─` before the pros and cons. The chat strips leading spaces, so the tree does the indenting.

```markdown
🔶 **Q<n> · <Short title>**

📍 `<step>` → `<step>` → `<situation reached>`

❓ **<The question, one sentence>**

**A · <Answer option>**
├─ `<step>` → `<result>`
└─ ➕ <pro> · ➖ <con>

**B · <Answer option>** ⭐
├─ `<step>` → `<result>`
└─ ➕ <pro> · ➖ <con>

⭐ **B**: <why, one sentence>
```

## Visual aid

Some options can only be compared when you see them, and that doesn't fit into the chat. In that case, write the visual part into a Markdown file in the interview folder and keep the chat question short.

- **When:** an option needs more than about three lines to show, for example:
  - folder and file trees
  - screen layouts as ASCII wireframes
  - data shapes (types, JSON, tables of fields)
  - flows and states with many steps or branches
  - longer code per option
  - comparisons over many rows
- **Not when:** the flow line or a short snippet in the chat is enough. Most questions need no file.
- **Chat:** the question format stays the same. Add only one line between 📍 and ❓: `📎 [Visual aid: <what it shows>](<path>)`, with the path relative to the project root so it can be clicked.
- **File:** `<interview folder>/q<n>-<slug>.md`.
- **Content:**
  - Title `Q<n> · <Short title>`, the same as in the chat.
  - One section per option, with the same letter, the ⭐ and the `➕ … · ➖ …` line as in the chat, so chat and file match.
  - Show every option in the same form (same tree depth, same wireframe frame, same example data), so only the difference stands out.
  - Mark what is new or changed (e.g. `+` / `~` in a tree) and explain the markers in one line at the top.
  - Optionally a short comparison at the end, e.g. what you would have to touch later for a concrete change.
  - Patterns for trees, wireframes, flows and data: [VISUALS.md](VISUALS.md).
- **Temporary:** once the question is answered, the file has done its job. All `q<n>-*.md` files are deleted at the end (see Finish).

## Progress

`<interview folder>/progress.md`, from [templates/progress.md](templates/progress.md). Created with the first round, updated after every round: topics with their state, decisions as one-liners, your own decisions, open points, next question.

It lets the interview continue in a new chat. Short, no shadow of the topic files. Deleted at the end (see Finish).

## Finish

When there is a shared understanding:

1. **Summary:** summarize the decisions in the chat, including the ones you made yourself, and wait for the user's confirmation.
2. **Clean up:** delete all visual aids `q<n>-*.md`. The questions are settled.
3. **Topic files:** write the interview files (see below) from the confirmed decisions. Then delete `progress.md`.
4. **Review:** list the files with links and give the user time to read them. They can give changes in the chat or edit the files directly (re-read them afterwards). Adjust until the user is happy.
5. **Continue:**
   - Called by a skill: continue with that skill.
   - Called by the user: point to `README.md` of the interview folder; the interview is done.

## Interview files

The record of the interview, sorted by topic, so the user finds a decision directly where they would look for it.

```
interview/
  README.md        always: overview with one line and a link per topic
  <topic>.md       one file per topic, names chosen freely
  adrs.md          only when ADRs were agreed
  glossary.md      only when terms were introduced or sharpened
  assets/          only when there are screenshots (e.g. from a prototype)
```

- **Topics are free.** Choose them from what was decided, the way the user would look for it, e.g. `editor-layout.md`, `saving.md`, `user-stories.md`, `error-handling.md`. Kebab-case, named after the topic, not after the question. Usually 2–6 files; one topic per file.
- **Two fixed names,** because other skills read them: agreed ADRs always go into `adrs.md` (read by `write-adr` and `close-slice`), new or changed terms always into `glossary.md` (read by `maintain-glossary`). Templates: [templates/adrs.md](templates/adrs.md), [templates/glossary.md](templates/glossary.md).
- **`README.md`** from [templates/readme.md](templates/readme.md): what was clarified, a table of the topics, your own decisions as one-liners with links, and what was deliberately left open.
- **Topic file** from [templates/topic.md](templates/topic.md): every decision with its reason and the rejected alternative in one line.
- **Factual and short.** Plain language, no filler. A topic file fits on one or two screens (about 100 lines at most); if it gets longer, split the topic.
- **Visual where it helps:** a Mermaid flow for flows, states and dependencies, an ASCII wireframe or a screenshot for layouts, a tree for folders, a table for rules and edge cases. Patterns in [VISUALS.md](VISUALS.md). No visual where a sentence is enough.
- **Only what was decided.** No shadow spec or scope: link to the spec, ADRs or other topic files instead of copying.
- **Mermaid** renders in the VS Code Markdown preview with a Mermaid extension (e.g. `bierner.markdown-mermaid`).
- All interview files in English, regardless of the conversation language.
