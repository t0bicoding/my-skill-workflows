---
name: brainstorming
description: Works through an idea as a back-and-forth conversation — one clarification point per turn, each in the form that fits it (short question, sequence, options comparison, state model, edge cases, scope cut, UI sketch, data model, as-is comparison, roles matrix, glossary card), with risks, worst cases and a recommendation — until saturation or the user calls it good enough. Conversational alternative to /interview.
---

## Preparation

**User invoked:**
Take the context of the current chat, a file or markdown the user told you, or if there isn't a context then ask the user for a description.

**Skill invoked:**
If skill invoked, take the context which is given to you and the context of the current session.

## Language

All labels in this skill and its templates are written in English. Write them in the chat language the project sets in `CLAUDE.md` / `AGENTS.md` (default: English) — headings, table columns and markers' words alike; the signs (`❓ ✅ ⚠️ ▶ ↪ …`) stay as they are.

## Opening

Finding facts is your job, never the user's. Before answering, look up what the idea depends on (code, ADRs, existing behavior, `CONTEXT.md` or `CONTEXT-MAP.md`) yourself or via the Scout Subagent [scout.md](../../agents/scout.md); don't ask the user for anything you could look up.

Answer the user's description once with:

- **Situation** — what you understood, in 2–3 sentences; ideas or alternatives worth considering; the biggest risks and worst-case scenarios at a glance. If the idea is a flow, add a [sequence](sequence-template.md) of the happy path; if it changes existing behavior, an [as-is comparison](as-is-template.md).
- **Agenda** — the open points as an [agenda tree](agenda-template.md), highest priority first.

Then work the `▶` point in the same message, in the format below.

## Tools

Every point takes the form that fits it. Pick exactly one tool per point; a point that needs two is two points. A small point — one decision, plain options — always gets the short question; a tool is there to make a point clearer, not longer. Read a tool's file before using it for the first time in a session.

| The point is about … | Tool | File |
|---|---|---|
| one decision with plain options | Short question | format below |
| order, branches, repetition, who does what | Sequence | [sequence-template.md](sequence-template.md) |
| three or more options, or a trade-off on several criteria | Options comparison | [options-template.md](options-template.md) |
| the lifecycle or status of a thing | State model | [state-template.md](state-template.md) |
| what happens when it goes wrong | Edge case table | [edge-case-template.md](edge-case-template.md) |
| what is needed now and what can wait | Scope cut | [scope-template.md](scope-template.md) |
| where something sits on screen, what a view contains | UI sketch | [ui-sketch-template.md](ui-sketch-template.md) |
| stored things, their relations, deletion, existing data | Data model sketch | [data-model-template.md](data-model-template.md) |
| a change to behavior that exists today | As-is comparison | [as-is-template.md](as-is-template.md) |
| several actors and who may do what | Roles matrix | [roles-template.md](roles-template.md) |
| a new or ambiguous domain term | Glossary card | [glossary-template.md](glossary-template.md) |
| something the chat can't settle | Handoff | [handoff-template.md](handoff-template.md) |

All tools share the markers `❓ Point <n>` (open, settled by point n), `✅` (decided) and `⚠️` (something outside the flow can interfere), and refer to points by their stable agenda number.

## Turns

Work exactly one point per turn — the `▶` point of the [agenda tree](agenda-template.md), whose priority rules decide what comes next.

Every point has the following frame:

🧭 **Point <n> – <Title>** · <Tool>: <why it matters and what's at stake, might be multiple paragraphs>
<the tool's body — for a short question:>
➡️ A: <Answer option> — <consequence>
➡️ B: <Answer option> — <consequence>
⚠️ **Risks / worst case:** <what can go wrong, and the consequence of each path>
⭐ <Recommended Answer> — <why do you recommend it>

<the agenda tree>

Leave out a line of the frame that the tool's body already carries (the options comparison brings its own worst cases and ⭐).

After each user reply:

- **Choice** → confirm it in one line (✅ <decision>) and move on. If the decision changed a sequence, state model or sketch shown earlier, redraw it once with the decision marked ✅.
- **Counter-proposal** → challenge it honestly before adopting it: consequences, risks, conflicts with earlier decisions. Don't simply agree. If it holds up, adopt it.
- **Question or doubt** → answer it and stay on the same point.

Then update the agenda tree: mark what the answer unblocked, add the points it opened up, drop the points it made moot, re-prioritize, and present the next point.

A point that needs a fact not yet known waits for the scout (`⏸`); work another point meanwhile. A point the chat can't settle is proposed for a [handoff](handoff-template.md). The decisions are the user's: put each to them and wait.

## Final Step

End when either:

- you see saturation (agenda empty or only trivial points left) — give the user the summary and ask whether anything is still open; or
- the user says the plan is good enough — give the summary and list the remaining agenda points as **open**.

The summary groups the decisions by where they go in the spec, so `/write-spec` can take them over directly:

- **Problem / solution** — what today looks like and what changes (as-is comparison, scope "In").
- **Flows & UI** — sequences, UI sketches → User Stories.
- **Implementation decisions** — options, state models, data model, roles → Implementation Decisions.
- **Edge cases** — edge case rows → acceptance criteria and Testing Decisions.
- **Out of scope** — scope "Later" and "Never" → Out of Scope.
- **Terms** — glossary cards → `CONTEXT.md` (or `CONTEXT-MAP.md`) via `/context-maintainer`.
- **Handed off** — each handoff with its ticket type and question.
- **ADR candidates** — decisions made here that are hard to reverse.
- **Open** — agenda points not decided.

Leave out a group with nothing in it. Wait until the user confirms the summary.

**User invoked:**
If user invoked, then ask the user if they want the decisions recorded somewhere in the project.

**Skill invoked:**
If skill invoked, then continue with the next steps of the skill. Handed-off points become clarification tickets of the named type; open points stay open and the calling skill turns them into clarification tickets.
