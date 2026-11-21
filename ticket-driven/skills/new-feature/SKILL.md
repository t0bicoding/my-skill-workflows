---
name: new-feature
description: Initial plan of a new feature.
disable-model-invocation: true
---

## Preparation

Before anything else, ask the user with AskUserQuestion which clarification mode to use:

- **Interview** (/interview) — question rounds, the whole frontier of open decisions at once.
- **Brainstorming** (/brainstorming) — a conversation, one point per turn, with risks and worst cases.

Give no recommendation; both modes are being compared.

Then take the context of the current chat, an file or markdown a user told you or if there isn't a context then ask the user for a description.

## Clarification Step

Run the chosen skill: /interview or /brainstorming.

## Specifications

Decide on a name for the new feature and present it the user.
When the user agrees then create the feature folder `docs/features/<name>/`. This is the root every later skill in the workflow reads from and writes into: `specifications.md` directly inside it, clarification tickets under `tickets/clarification/`, implementation tickets under `tickets/implementation/`.
Write the specifications.md with the /write-spec skill. Points the clarification step left open go into the spec as open questions.
Under "Further Notes" add one line recording the mode, so both modes can be compared later: `Geklärt per /<interview|brainstorming> (<n> Entscheidungen, <m> offen).`

## Tickets

Write clarification tickets with the /write-clarification-tickets skill, so every open question in the spec gets its own resolvable ticket.
Use tickets only if needed, if a feature is small enough and doesn't need further investigation then don't create tickets.

## Final Step

Commit the new added Feature plan on the current branch. Never push — pushing is the user's call alone.
In the chat list every created ticket and their purpose.
If clarification tickets were created, give the user the ready-to-paste command for the next chat: `/clarify-ticket <feature> <NN>` (first open ticket).

If none were created, hand on to approval first: give them the ready-to-paste `/approval <feature>`. Below it, show the four ticket types so the user can tell at a glance what each one settles — in the chat's language, in this form:

1. **Interview**: an open question needs the user's judgment.
2. **Prototype**: a state model or UI needs to be felt out before committing.
3. **Research**: a factual question needs investigation (library behavior, an external constraint, how existing code behaves).
4. **ADR**: a decision is hard to reverse and worth recording.

Then offer the tickets that could still be written if the user wants more certainty after all — a short list, one line each with the ticket type and the question it would settle. Only list candidates the spec or the clarification step actually gives reason for; if there are none, say so in one line instead of inventing some. Close with how to get them: answer here with the numbers to write — or name a type and a question of their own — and they are created via /write-clarification-tickets, committed, and the next command becomes `/clarify-ticket <feature> <NN>`.
