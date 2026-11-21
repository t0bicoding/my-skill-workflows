---
name: feature-light
description: Plans a mid-sized change — too big for /quick, too clear for /new-feature — in one chat round: restates what it understood, names the side effects the user likely missed, recommends how to build it and how to cut it into tickets, waits for the user's "go" in the chat, then writes a light feature folder with a short spec and implementation tickets ready for /implement. Builds nothing itself.
disable-model-invocation: true
---

The middle lane between `/quick` and `/new-feature`: no interview, no clarification tickets, no `/approval` — one round in the chat settles the plan, and the result is an ordinary feature folder that `/implement`, `/human-review`, `/close-feature` and `/compass` handle like any other. What it saves is the clarifying ceremony, not the planning: the user still sees every side effect and every recommendation before anything is written.

## Preparation

`/feature-light <description>`
If the user hasn't described the change, ask.

Read once: `CLAUDE.md` / `AGENTS.md` (chat language, documentation language, rules), `CONTEXT.md` or the relevant file via `CONTEXT-MAP.md` for the area's domain vocabulary, and the ADRs in the area the change touches.

## Scope

Read the code the change touches — Grep to locate it, then Read with offset/limit for a file over ~300 lines — enough to restate the change in the project's terms, find what else it affects, and cut tickets. Follow the change one step past its obvious edges: who else reads or writes the data it changes, which rules in `CLAUDE.md`/`AGENTS.md` or ADRs apply, what concurrent users, deletion, storage or existing data do with it. That is where the points the user hasn't considered come from. Everything you read stays in your context for the whole run.

## Size Gate

Check the description and what the code showed against both bounds. If one hits, say which and why and recommend the other skill. Nothing is written.

- **Too small → `/quick`**: one slice, no open decision, nothing the user would want to weigh in on — the plan round would only cost time.
- **Too big → `/new-feature`**:
  - more than about four implementation tickets;
  - an **ADR-worthy** decision — hard to reverse or non-obvious;
  - open questions one chat round can't settle — they need research, a prototype, or more than one round of the user's judgment.

The user may override either bound. A schema change or migration is allowed, but always gets its own ticket at Effort Extra High. A change that touches a zone in `docs/workflow/must-read-zones.md` (if the file exists) isn't stopped, but name the zone in the plan and set Effort to at least Extra High on the tickets that touch it.

## The Plan

Present the plan in the chat, in the chat language, in this order:

1. **What I understood** — the change in two to four sentences, from the user's perspective, in the project's domain vocabulary.
2. **Flow before → after** — only if the change alters how the user works through something: the steps today and the steps afterwards, side by side (a table or two short numbered lists). Leave the section out when there's no flow to compare.
3. **What else it touches** — numbered: the side effects and edge cases the user most likely didn't have in mind, each in one or two lines, each grounded in the code or a rule you actually read. No filler: if there are only two real points, list two.
4. **How I'd build it** — the recommended approach in a few bullets, and for every point under 3 the recommended answer, referenced by its number. Mark each recommendation so the user can override it by number.
5. **Tickets** — the proposed cut into implementation tickets, following [approval](../approval/SKILL.md) › *Draft vertical slices* (tracer bullets, coarsest slice that still holds, split only on a split-trigger). For each ticket: title, what it delivers, blocked by, proposed Model and Effort (heuristics in [approval](../approval/SKILL.md) › *Quiz the user*). If one ticket is enough, say so; if several are sensible, show the alternatives (e.g. A: one ticket, B: two) with your recommendation and why. Several tickets run one after the other via `/implement <feature> all`, in blocking-edge order.
6. **Feature name** — the proposed folder name `light-<slug>`, slug short, English, kebab-case, ASCII.

Close by asking the user to change points by their number or to answer with **go**. Wait for the answer **in the chat** — no AskUserQuestion dialog.

## Iterate

If the user changes points, fold them in and show only what changed (the affected points and, if the cut moved, the ticket list) — not the whole plan again. Repeat until the user says go. If a correction pushes the change over a bound of the Size Gate, say so and recommend `/new-feature`; the plan so far can serve as its starting idea.

## Write

Only after the go:

1. Create `docs/features/light-<slug>/` — the same root `/new-feature` creates, so every later skill finds it.
2. Write `specifications.md` from [light-spec-template.md](light-spec-template.md) — the agreed plan, nothing new. Title prefix `Light – `.
3. Write the implementation tickets into `tickets/implementation/` with [implementation-ticket-template.md](../approval/implementation-ticket-template.md), numbered `NN`, title prefix `Light – `, the agreed Model and Effort in their fields, blocking edges as agreed. Fill the `E2E scenario` section only under the condition in [approval](../approval/SKILL.md) › *Draft vertical slices*; otherwise remove it. Each ticket must stand on its own: state any rule, threshold or decision it relies on in the ticket itself instead of pointing to the spec.

Write both in the documentation language set in CLAUDE.md/AGENTS.md (default: English). No clarification tickets — anything still open would have failed the Size Gate.

## Final Step

Commit the feature folder on the current branch: stage it by **explicit path** — never `git add -A` or `git add .`, the user may be working in the tree alongside — check `git diff --cached --stat`, and commit with a conventional message (`docs(<feature>): …`). Never push — pushing is the user's call alone.

In the chat, list each ticket with its Model and Effort in one line, then give the ready-to-paste command for the next chat: `/implement light-<slug> all` (or `/implement light-<slug> 01` for a single ticket).
