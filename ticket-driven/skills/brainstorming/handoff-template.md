# Handoff Template

A handoff parks a point that can't be decided in the chat and names the clarification ticket type
that will decide it — so the open point doesn't end up as a vague "still unclear" but as a ticket
someone can pick up. It feeds the clarification tickets that `/write-clarification-tickets`
writes.

## When to hand off

| The point … | Ticket type |
|---|---|
| has to be tried out before anyone can judge it — how a UI feels, whether a logic holds | Prototype |
| needs a fact that takes more than a quick scout — library behavior, an external limit | Research |
| touches an area with existing patterns whose fit is unclear | Convention |
| is the interface of a new module with no pattern to follow, and its shape is a real trade-off | Design |
| is hard to reverse and needs more than this conversation to settle | ADR |

A point the user can judge right now is never handed off — decide it here. A decision made here
that is hard to reverse stays decided, and is marked **ADR candidate** in the summary instead.

## Rules

- Handing off is a decision like any other: propose it with the reason, wait for the user, confirm
  with ✅.
- **Question** is the exact question the ticket must answer — one question, answerable on its own.
- **Known** lists what is already settled that the ticket can rely on, so it doesn't reopen it.
- **Blocks** lists the points that wait for the answer; they stay in the agenda marked `↪`, or
  move into the handoff when they can't be worked without it.
- Labels in the chat language.

<handoff-template>

↪ **Point <n> – <title>** → <Prototype | Research | Convention | Design | ADR> ticket
- **Question:** <the exact question the ticket must answer>
- **Why not here:** <why the chat can't settle it>
- **Known:** <decisions the ticket can rely on>
- **Blocks:** <points that wait for it, or "nothing">

</handoff-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

↪ **Point 6 – Reordering attachments** → Prototype ticket
- **Question:** Does drag & drop in the attachment list work, or is "move up / down" clearer?
- **Why not here:** whether dragging feels right in a short list can't be judged on paper.
- **Known:** order is per task ✅, everybody sees the same order ✅
- **Blocks:** 9. Keyboard shortcuts for reordering
