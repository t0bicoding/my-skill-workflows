---
name: write-adr
description: Creates or updates ADRs in docs/adrs/ from the list in an interview's adrs.md (slice, fast-lane, one-shot or project-setup) or a decision agreed in the chat. Used by slice, fast-lane, close-slice, one-shot and project-setup.
user-invocable: false
---

# Write ADR

Read: the file names in `docs/adrs/` (for the number), an existing ADR only when it changes, and as source `interview/adrs.md` of the slice, i.e. the ADRs agreed with the user. After `fast-lane`: `implementation/interview/adrs.md`. In `one-shot` and `project-setup`: `adrs.md` of its interview folder (`docs/interview/<topic>/`), or the decision agreed in the chat.

ADRs live only in `docs/adrs/`, so later features find them after the feature folder moved to `closed/`.

## New ADR

- From [templates/adr.md](templates/adr.md). Short: 1–3 sentences on context, decision and reason. "Considered Options" and "Consequences" only when they add real value.
- File: `docs/adrs/<NNNN>-<slug>.md`, number = highest existing number + 1 (e.g. `0003-store-sessions-in-database.md`).
- English.

## Change an existing ADR

| Case | What to do |
|---|---|
| Small clarification, decision stays | edit the ADR directly |
| Changed decision | new ADR; the old one gets status `Replaced by <NNNN>` and is otherwise left as is |
| No longer valid, no successor | status `Inactive` |

## Afterwards

- Add the link to the ADR in `adrs.md`, if there is one.
- If the ADR concerns the architecture, list it in `ARCHITECTURE.md` under "Key decisions".
