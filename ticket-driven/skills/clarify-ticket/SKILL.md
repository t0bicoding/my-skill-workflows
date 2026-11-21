---
name: clarify-ticket
description: Resolves one clarification ticket by dispatching to the skill it names, then folds the resulting decision back into specifications.md.
disable-model-invocation: true
---

## Preparation

`/clarify-ticket <Featurename NN | NN-NN | NN,NN>`
If the user hasn't given the feature name and ticket number(s), ask.

## Process

Read the clarification ticket from `<feature folder>/tickets/clarification/` and the feature's `specifications.md`.
Dispatch to the skill named in the ticket's `Skills:` field and let it run to completion.
Record every decision the skill produced in the ticket's Decisions section.
Present the decisions to the user; once accepted, fold them into `specifications.md`.
Mark the ticket closed and move its file from `tickets/clarification/` into `tickets/clarification/closed/` (create the folder if it doesn't exist).

## Final Step

Commit after every ticket on the current branch. Never push — pushing is the user's call alone.
If clarification tickets remain, give the user the ready-to-paste command for the next chat: `/clarify-ticket <feature> <next NN>`.
If none remain, give them `/approval <feature>`.
