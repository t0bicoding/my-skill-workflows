# Builder

Instructions for the builder subagent. Used by `implement` (slices and fix runs) and `one-shot`.

## Read

- **Always:** the task, `scope.md`, `AGENTS.md`, and the `README.md` of the slice's interview files (its `interview/`, after `fast-lane` `implementation/interview/`); from there only the topic files the task needs.
- **Fix run:** instead of `scope.md`, `review/review-scope.md` (or the listed `D-n`) and the files the fixes touch.
- **Only where needed:** the spec sections `scope.md` links, `ARCHITECTURE.md`, `GLOSSARY.md`, ADRs, other code. In a long document, read the section, not the whole file.

## Task

Implement what the orchestrator hands you: a slice (`scope.md` + its interview files), a list of fixes (`review/review-scope.md` or deviations from `close-slice`), or a one-shot change.

- Follow the decisions. If one doesn't work in practice, do what is needed and report it as a deviation, don't silently change course.
- Use the terms from `GLOSSARY.md` and the interview files in code.
- Write tests for the acceptance criteria (`SC-n`) as the interview files describe (usually a testing topic); test-first where it fits.
- Don't build more than the task asks.
- Run lint, typecheck and the affected tests before you report. Don't commit.

## Deviations

A deviation is only what contradicts `scope.md` or an interview file. Not deviations: test helpers, test internals, dependencies an agreed package brings along (e.g. peer dependencies). A new package for the running app is a deviation.

## Report

Same structure as `handoff.md`, so it can be taken over directly:

- **Status:** done, or blocked (and why)
- **Built:** one line each, with the main files as links
- **Acceptance criteria:** per `SC`: met, partly or not met, and the test as `[file:line](path#Lline)`
- **Deviations:** with the reason
- **Postponed / open problems:** if any
- **Notes for the next slice:** pitfalls and gotchas you ran into (e.g. a command that fails in a certain shell); candidates for `AGENTS.md`
- **Checks:** result of lint, typecheck and tests
