---
name: agents-maintainer
description: Maintains CLAUDE.md and AGENTS.md — project description, language, Build/Test/Lint commands, and workflow conventions — so they stay accurate as the project evolves. Use after a feature ships and something changed (a new command, a new convention, a broader project scope); not for the one-time initial setup, that's /skill-setup.
---

## Structure

```md
# {Project Name}

{One or two sentence project description.}

## Language

Documentation in `docs/features/` and `docs/workflow/` (its `README.md` and `must-read-zones.md`) is written in {language}. `CLAUDE.md`/`AGENTS.md` itself, `CONTEXT.md`/`CONTEXT-MAP.md`, `docs/adr/`, code, and skills always stay in English.

## Build & Test

{Commands and anything a plain script list wouldn't tell you — required env vars, setup steps, order dependencies.}

## E2E

{Only if the project has an end-to-end suite. Four fields, named in the language of the rest of the file (English default: Command, Single scenario, Location, Prerequisites):
- **Command:** the full suite.
- **Single scenario:** the command for one scenario, with a placeholder for file or title.
- **Location:** where the scenarios live.
- **Prerequisites:** what must be in place once on a developer machine.}

## Workflow

{Git conventions, PR process, deployment steps.}
```

Leave out any section with nothing to say — an empty placeholder left "for later" just goes stale.

## Rules

- **Project description**: rewrite only when the project's actual scope changed, not after every feature. A shipped feature that extends what the project fundamentally does earns a rewrite; one that's just "more of the same" doesn't.
- **Build & Test**: don't restate what one look at `package.json` / `Makefile` / CI config already answers — that's the environment's job, and a copied command just goes stale. Write down only what isn't obvious from looking: required env vars, ordering, a flag nobody would guess.
- **E2E**: recognize an end-to-end suite by common traces: `playwright.config.*`, `cypress.config.*`, `wdio.conf.*`, or an `e2e` / `test:e2e` script in any `package.json`. If one is found and the section is missing, create it with the four fields; if it exists, bring it in line with the suite as it is now (command, location, prerequisites); if the suite is gone, remove the section. The section goes into the file that carries the gates. The project's "E2E" section is the contract the workflow skills read, so keep the four fields and their meaning stable. Other than this list of traces, name no concrete tool, command, or folder of any project in this skill. Without a suite and without the section: do nothing, ask nothing, mention nothing.
- **Workflow**: capture Git conventions, PR process, and deployment steps as they're established or changed — these usually live only in people's heads, so they're worth caching here.
- **Language**: decided once during `/skill-setup`; only touch it if the user explicitly changes the decision. It only ever governs `docs/features/` and `docs/workflow/` (its `README.md` and `must-read-zones.md`) — never rewrite `CLAUDE.md`/`AGENTS.md`, `CONTEXT.md`/`CONTEXT-MAP.md`, `docs/adr/`, code, or skills into another language.

## CLAUDE.md vs. AGENTS.md

**Split (most projects)**: `AGENTS.md` holds the structure above, `CLAUDE.md` only references it.

**Single file**: if `CLAUDE.md` already carries the project description with no `AGENTS.md` next to it, keep it that way — write updates into `CLAUDE.md` directly.

The skill infers which applies:

- `AGENTS.md` exists → it's the source of truth; update it, and check `CLAUDE.md`'s reference still points at it.
- Only `CLAUDE.md` exists → update it directly.
- Neither exists → create lazily with whatever is already decided (project description, language) or discoverable in the codebase; default to the split form.

## Final Step

Report what was updated and why. If nothing needed a change, say so.
