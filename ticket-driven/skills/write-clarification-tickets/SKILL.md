---
name: write-clarification-tickets
description: Breaks a feature's open questions into clarification tickets (brainstorming, prototype, research, or ADR), each resolvable on its own before implementation tickets are drafted. Use once specifications.md exists but still has open or unsure points.
---

## What is a clarification ticket?

A clarification ticket isolates one open question — or, for a brainstorming ticket, one cluster of related open points — from the feature's `specifications.md` so it can be resolved in its own pass, then folded back into the spec. This is a different object from an **implementation ticket** (drafted by `/approval`, built by `/implement`): a clarification ticket produces a *decision*, an implementation ticket produces *working code*. Keep the two apart — do not write implementation tickets here.

## Where clarification tickets live

Every clarification ticket goes into `<feature folder>/tickets/clarification/`. Create the folder if it doesn't exist.

Write each ticket in the documentation language set in CLAUDE.md/AGENTS.md (default: English).

## Ticket types

Each clarification ticket names exactly one of these skills in its `Skills:` field, so `/clarify-ticket` knows how to resolve it:

1. **Brainstorming**: open points need the user's judgment. Resolved with the `/brainstorming` skill — one point per turn, with risks, worst cases and a recommendation. If the project has no `/brainstorming` skill, name `/interview` instead.
2. **Prototype**: a state model or UI needs to be felt out before committing. Resolved with the `/prototype` skill.
3. **Research**: a factual question needs investigation (library behavior, an external constraint, how existing code behaves). Resolved with the `/research` skill.
4. **ADR**: a decision is hard to reverse and worth recording. Resolved with the `/adr` skill.

### Brainstorming tickets

Brainstorming works through an agenda, so one ticket may carry several points — but only points that hang together: they touch the same part of the feature, or deciding one changes the others. Unrelated topics get separate tickets, so each ticket stays resolvable on its own.

In the ticket, list each point under **What to clarify** as a seed for the brainstorming agenda: the question, why it is open, and what it blocks. Put what is already settled under **Context / Options**, so the brainstorming doesn't reopen it.

## Ticket naming

`<NN - Ticket Type - Ticket Name>`. Ticket 01 carries the most value or urgency; each following number the next-highest.

## Process

1. Read the plan, conversation, and `specifications.md` of the given feature.
2. Close information gaps you can close yourself: dispatch one Scout subagent per gap (the project's `scout` agent, if it defines one; otherwise a read-only search subagent), rather than guessing or asking the user something you could look up.
3. Find the questions still open or unsure, and decide, per question, which of the four ticket types resolves it. A UI or logic question that's hard to reason about on paper needs a prototype, not brainstorming; a question with a discoverable answer needs research, not brainstorming — but whether to adopt or deviate from what research found is the user's call, so it's brainstorming.
4. Group the questions that need the user's judgment into brainstorming tickets, as described under *Brainstorming tickets* above.
5. Order the resulting tickets by value or priority.
6. Write each ticket with [clarification-ticket-template.md](clarification-ticket-template.md).

## Final Step

List every ticket created and its purpose. Give the user the ready-to-paste command for the next chat: `/clarify-ticket <feature> <NN>` (first ticket). Once every clarification ticket is resolved — or none were needed — the next step is `/approval <feature>`; any ticket still open at that point, `/approval` will offer to delegate to the AI instead of resolving it itself.
