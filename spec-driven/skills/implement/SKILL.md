---
name: implement
description: Builds the current slice - or, after fast-lane, all prepared slices in one run, or the fixes from a human review - on the feature branch with a builder subagent and reviewer subagents (spec + scope, standards), then writes or extends handoff.md per slice. Usage - /implement [feature] [slice-nn | all]
disable-model-invocation: true
---

# Implement

You are the orchestrator. Subagents build and review; you hand out tasks, read their reports and keep the user informed.

**Read yourself only:** the status table of `roadmap.md`, which files exist in the slice folder, `scope.md` (or `review/review-scope.md` in a fix run) and the subagents' reports. Spec, interview files and code are read by the subagents; you pass them paths.

The build and review steps live in [BUILDER.md](BUILDER.md) and [REVIEWER.md](REVIEWER.md). `one-shot` uses the same steps; `close-slice` hands its fixes to the fix run here.

## 1. Preparation

- **Fix run first:** if a slice `in progress` has a `review/review-scope.md` with entries still `open`, this run builds those fixes; see "Fixes".
- Otherwise find the slice to build: the slice `in progress` in `roadmap.md`, with `scope.md` and without `handoff.md`, or else the first `open` slice that already has a `scope.md` (prepared by `fast-lane`); set it to `in progress`. If unclear, ask.
- **All or one:** if several slices have a `scope.md` and no `handoff.md` (after `fast-lane`), offer both: only this slice, or all of them in one run (see "All slices"). `all` as argument chooses the run directly.
- Work on the feature branch `<feature>` (switch if needed, see "Right branch first" in [feature-structure](../feature-structure/SKILL.md#rules-for-skills)).
- Note `HEAD` as the base of this run.

## 2. Model, effort and review

Propose model and effort for builder and reviewers, and the review setup, in one line with a short reason. Wait for the user's OK or change. Example:

> Builder: sonnet, effort high (typical slice with ordinary design calls). Review: two reviewers, sonnet, effort medium. OK?

| | When |
|---|---|
| **haiku** | mechanical work: a rename, configuration, one small clearly described step |
| **sonnet** (default) | a typical slice across a few layers with ordinary logic |
| **opus** | much ambiguity or risk: cross-cutting changes, tricky data shapes, concurrency |
| **effort medium** | the path is laid out, e.g. copying an existing pattern |
| **effort high** (default) | the builder makes ordinary design calls along the way |
| **effort xhigh** | correctness hinges on cases tests easily miss: migrations, deletion cascades, concurrency |
| **two reviewers** (default) | one per axis (spec + scope, standards), so neither hides the other |
| **one combined reviewer** | small slice without tricky risk; cheaper, but the axes are no longer separated |

Pass the agreed values as `model` and `effort` to every builder and reviewer run of this skill.

For all slices, propose once, as a small table with one row per slice, instead of asking before every slice:

> | Slice | Builder | Review |
> |---|---|---|
> | slice-01 | sonnet, high | two reviewers, sonnet, medium |
> | slice-02 | haiku, medium | one combined reviewer, sonnet, medium |

## 3. Build

Spawn a builder subagent (Agent tool) with the instructions from [BUILDER.md](BUILDER.md). Task: implement `scope.md` following the interview files of the slice (its `interview/`, or `implementation/interview/` after `fast-lane`).

Pass paths, not contents, and point only to what is needed: from the previous slice's `handoff.md` only "Notes for the next slice", from the spec only what `scope.md` links, from the interview files the `README.md` (the builder picks the topics it needs from there).

A larger slice may be built in several steps, one builder run each.

## 4. Check

- Commit the builder's result on the feature branch, e.g. `wip(<feature>): slice-<nn>`. `close-slice` squashes the slice into one commit later. Don't push; `close-slice` offers it.
- Run lint, typecheck and tests from `AGENTS.md` once yourself. If something fails, send it back to the builder.
- Write the diff once to a file outside the tracked files, without lock files, e.g. `git diff <base> HEAD -- . ':!package-lock.json' > .git/review.diff`.

## 5. Review

Spawn the reviewers as agreed, with the instructions from [REVIEWER.md](REVIEWER.md): two **in parallel** (spec + scope, standards) or one combined. Pass the diff file, the check results and the slice paths.

- Findings → send them to a builder to fix, then step 4 again and a new review.
- If findings keep coming back after a few rounds, or a finding needs a decision, ask the user.

## 6. Handoff

Use the `write-handoff` skill with the builder and reviewer reports.

Report to the user: what was built, which `SC` are met, the deviations. Next step (full commands): optionally `/human-review <feature> slice-<nn>`, then `/close-slice <feature> slice-<nn>`.

## All slices

After `fast-lane`, all prepared slices can be built in one run, one after another in roadmap order. Per slice, steps 3–6 as above, with these differences:

- **Before each slice:** set it to `in progress`. From the second slice on, read the previous `handoff.md`. If a deviation or note there affects this slice's `scope.md`, stop and propose the change; with the user's OK adjust the scope (allowed, because its implementation has not started yet).
- **One commit per slice right away:** commit the builder's result as `feat(<feature>): slice-<nn> <short title>` instead of `wip`, and amend fixes from the review and the `handoff.md` into it. Slices that are not closed yet must not pile up as `wip` commits, so `close-slice` can work on each slice by its commit.
- **Base per slice:** the diff for the review starts at the commit before the slice.
- **Keep going** unless a slice is blocked, or a finding or deviation needs a decision that affects later slices. Then stop and ask. Other deviations stay `open` in the handoffs for `close-slice`.
- **After each slice,** one short line to the user: slice, `SC` met, number of deviations.

At the end, report a table: per slice what was built, `SC` met, deviations. Next step (full commands): optionally `/human-review <feature> slice-<nn>` for single slices, then `/close-slice <feature> all`.

## Fixes

A fix run builds a list of changes for a slice that is already implemented: the open entries of `review/review-scope.md` (after `human-review`), or the deviations `close-slice` collected for fixing.

1. Model, effort and review as in step 2, usually smaller than for the slice.
2. Builder (step 3) with the list as the task: pass the path of `review-scope.md` (or the `D-n` with the requested change), plus `scope.md` and the interview files as background.
3. Check and review (steps 4–5). The reviewers check against "Done when" of each entry instead of the whole scope, plus the standards.
4. **Commits:**
   - slice still open as `wip` commits: commit as `wip(<feature>): slice-<nn> fixes`; `close-slice` squashes later.
   - slice already one commit `feat(<feature>): slice-<nn> …` (after `implement all`): commit as `git commit --fixup=<that commit>`, then fold it in with `git rebase --autosquash <commit before the first not yet merged slice>` (Git 2.44 or newer; older: `GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash <same commit>`). Run lint, typecheck and tests after the rebase.
5. Set the built entries in `review-scope.md` to `fixed`. Use the `write-handoff` skill to extend `handoff.md` ("After a fix run").

Report what was fixed. Next step (full commands): optionally `/human-review <feature> slice-<nn>` to check the result (re-check), then `/close-slice <feature> slice-<nn>`. Called from `close-slice`: go back there.
