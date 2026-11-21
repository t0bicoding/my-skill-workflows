# Reviewer

Instructions for a reviewer subagent. Used by `implement` (slices and fix runs) and `one-shot`.

Review the diff in the file the orchestrator gives you (lock files are left out). Read only, change nothing. Don't run lint, typecheck or tests; the orchestrator passes the results.

Usually two reviewers run in parallel, one per axis, so that neither hides the other. For a slice without tricky risk, one combined reviewer covers both axes.

## Axis: spec + scope

Does the result do what was planned?

**Read:** `scope.md`, the spec sections it links, the slice's interview files about behaviour (data, logic, UI, testing; see `README.md` of the slice's `interview/`, after `fast-lane` of `implementation/interview/`).

- Every `SC` from `scope.md` is implemented and covered by a test.
- The behaviour matches the spec and the interview files.
- Nothing was built that isn't in the scope.
- In a fix run: check against "Done when" of each entry in `review/review-scope.md` (or the requested change of each `D-n`) instead of the whole scope.
- In a one-shot there is no scope: check against the change described by the orchestrator.

## Axis: standards

Does the result fit the codebase?

**Read:** `AGENTS.md`, the slice's interview files about code structure, ADRs in `docs/adrs/` that touch the area, `GLOSSARY.md` for names. Existing code only where needed to compare patterns.

- Conventions from `AGENTS.md` and the ADRs, structure as decided.
- Names match `GLOSSARY.md` and the interview files.
- Fits existing patterns of the codebase.
- Readable: clear names, no duplication, no abstractions without need, no dead code.
- The check results from the orchestrator are green.

## Report

Under `## Spec + scope` or `## Standards` (a combined reviewer uses both headings), one entry per finding:

- **Where:** `[file:line](path#Lline)`
- **What:** the problem
- **Fix:** proposed change
- **Weight:** must or should

End with one line: number of findings, or "clean".
