---
name: quick
description: Builds one small, already-clear change through the /implement build-and-review loop, skipping brainstorming, spec, approval and the feature folder. Not for anything that needs a decision, a migration, or more than one slice — that's /new-feature.
disable-model-invocation: true
---

The fast lane beside the feature pipeline: no interview, no `specifications.md`, no feature folder — but the same build subagent and the same two reviewers as `/implement`, so a quick change gets no less checking than a ticketed one. What it saves is the clarifying, not the building.

## Preparation

`/quick <description>`
If the user hasn't described the change, ask.

## Size Gate

Check the description against these criteria **before** reading code beyond what it takes to judge them. If one hits, stop: say which one and why, and recommend `/new-feature <idea>` (or `/hunt-bugs <area>` when the change is really a bug hunt). Nothing is written, nothing committed.

- **Open decision** — there are several sensible ways to do it and the choice is the user's, not an implementation detail.
- **Schema or migration** — the database schema changes or a migration is needed. No override.
- **More than one slice** — it takes more than one vertical slice, or introduces a new module interface.
- **ADR-worthy** — the change settles something hard to reverse or non-obvious.

The user may override every criterion except the migration. A change that touches a zone in `docs/workflow/must-read-zones.md` (if the file exists) isn't stopped, but warn about it and set Effort to at least Extra High.

If the description reads two ways, ask **one** question to settle it — no interview, no rounds. If one question doesn't settle it, the change isn't quick: recommend `/new-feature`.

## Scope

Read only the code the change touches — Grep to locate it, then Read with offset/limit for a file over ~300 lines — enough to write sharp acceptance criteria and pick Model and Effort. Everything you read stays in your context for the whole run.

If the code shows the change is bigger than the description suggested, go back to the Size Gate.

## Mini-Ticket

Draft the ticket from [quick-ticket-template.md](quick-ticket-template.md). Pick Model and Effort with the heuristics in [implement](../implement/SKILL.md) › *Build Subagent* — a quick change is usually haiku or sonnet at Medium or High.

Show the ticket in the chat and get one okay or correction from the user. Then write it to `docs/quick/<YYYY-MM-DD>-<slug>.md` (create the folder if it doesn't exist) — slug short, English, kebab-case, ASCII; the ticket in the documentation language set in CLAUDE.md/AGENTS.md (default: English).

## Build and Review

Follow [implement](../implement/SKILL.md) › *Build Subagent* and *Reviewer Subagents* for this one ticket, with exactly these differences:

- **No spec file.** Tell the Spec reviewer the ticket is the whole specification; there is no `specifications.md` to read.
- **Closing.** When both axes report clean, set the ticket's `Status` to closed and move it from `docs/quick/` into `docs/quick/closed/` (create the folder if it doesn't exist).
- **Commit.** Stage the changed code and the ticket file by **explicit path** — never `git add -A` or `git add .`, the user may be working in the tree alongside — and check `git diff --cached --stat` before committing. A conventional commit message. Never push — pushing is the user's call alone.

## Escalation

Stop without committing if the Build Subagent reports blocked, if the Spec axis is still red after two fix rounds, or if the change turns out bigger than the ticket. Leave the ticket open in `docs/quick/`, report how far it got and what's in the working tree, and recommend `/new-feature` — the ticket can serve as the starting idea.

## Final Step

Report in a few lines: what was built, the Model and Effort used, both review verdicts, and the commit hash.
