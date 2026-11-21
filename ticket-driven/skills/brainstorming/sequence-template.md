# Sequence Template

A sequence is a visual flow diagram that clarifies a feature's flow for the user right in the chat
during brainstorming — modeled on the flow in the project's `docs/workflow/README.md`, but its
steps are what the user does and what the system answers, not skills. Its outcome feeds the
spec's **User Stories**.

## When to draw one

- In the **Situation**, when the idea is a flow (several steps, branches, or more than one actor).
- In a **point**, when the decision is about order, a branch, a repetition, or who does what.
- After a decision changed the flow: redraw it once, the decided step marked ✅.

Don't draw one for a point that is a single yes/no without a flow around it.

## Rules

- Always inside a plain code block, at most ~80 characters wide and ~15 steps — split a longer
  flow into a main flow and a sub-flow.
- Labels in the chat language and in the user's words — the
  vocabulary from `CONTEXT.md` (or `CONTEXT-MAP.md`) if the project has one; no code identifiers,
  endpoints or file names.
- A step is either something an actor does or something the system visibly answers; the indented
  `│  …` line underneath says what happens meanwhile (saved, sent, checked).
- Every step that is still undecided carries `❓ Point <n>` — the agenda point that settles it.
- Mark with `⚠️` where something outside this flow can interfere: another user, a concurrent
  process, an external system, a lost connection. Look up in the project's docs and ADRs which
  of these apply.
- Always end in a named end state, one per branch: what the user sees and what lasts.

## Legend

| Sign | Meaning |
|---|---|
| `│` `▼` | next step |
| `│  text` | what happens during the step |
| `◄──┐ … ──┘` | repetition back to an earlier step, condition on the edge |
| `├── <condition> ──►` | branch off the main flow |
| `❓ Point <n>` | still open, settled by agenda point n |
| `✅` | decided in this brainstorming |
| `⚠️` | something outside this flow can interfere here |

<sequence-template>

```
<Trigger: who starts what, where>
      │  <precondition that is assumed>
      ▼
<Step 1: actor's action>
      │  <what the system does meanwhile>
      ▼
<Step 2>  ◄─────────────────────────┐
      │                             │ <condition for repeating>
      ▼                             │
<Step 3> ───────────────────────────┘
      │
      ├── <condition A> ──► <branch A> ──► <end state A>
      │
      ▼  <condition B>
<Step 4>  ❓ Point <n>
      │  <what is still open here>
      ▼
<Step 5>  ⚠️ <what can interfere here>
      │
      ▼
<End state: what the user sees, what lasts>
```

Optional, when two actors interleave — one column per actor, time runs downwards:

```
<Actor A>                       <Actor B>
    │                               │
<Action A1> ───────────────────►    │
    │                          <Reaction B1>
    │    ◄──────────────────────────┤
<Action A2>                         │
    ▼                               ▼
<End state A>                   <End state B>
```

</sequence-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

```
User opens a shared document
      │  nobody else is editing it
      ▼
User edits a paragraph  ✅
      │  draft is saved automatically
      ▼
User keeps typing  ◄────────────────┐
      │                             │ further change
      ▼                             │
Change is saved ────────────────────┘
      │
      ├── save fails ──► notice "not saved" ──► draft kept locally
      │                  ⚠️ connection lost
      ▼  save succeeds
User closes the document  ❓ Point 3
      │  release the edit right immediately or after a timeout?
      ▼
Changes visible to everyone, document free again
```
