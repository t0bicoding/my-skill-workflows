---
name: close-slice
description: Closes the current slice - or, after implement all, all implemented slices together - offers a human review, clarifies the remaining deviations from handoff.md, hands fixes to implement, updates ADRs, glossary and architecture, keeps one commit per slice and asks whether to merge now. Usage - /close-slice [feature] [slice-nn | all]
disable-model-invocation: true
---

# Close Slice

Runs on the feature branch (switch if needed, see "Right branch first" in [feature-structure](../feature-structure/SKILL.md#rules-for-skills)). Find the feature and the slice: the slice `in progress` with a `handoff.md`. If several slices are like that (after `implement all`), or `all` is given, close them together; see "All slices" at the end.

## 1. Human review?

- If there is no `review/review.md` yet, ask whether the user wants a review first. If yes, follow [human-review](../human-review/SKILL.md). If it ends with changes, the fix run with `implement` comes first; the user comes back here afterwards.
- If `review/review-scope.md` still has `open` entries, stop: the next step is `/implement <feature> slice-<nn>`.

## 2. Deviations

Go through every `D-n` that is still `open` in `handoff.md` (the review may already have decided some) with the user, in the question format of [interview](../interview/SKILL.md). Per point the user decides:

- **Accept:** set the status in `handoff.md` to `accepted`. `scope.md` stays as it is (plan stays plan). If the deviation affects an ADR, add the change to the slice's `interview/adrs.md` (after `fast-lane`: `implementation/interview/adrs.md`; create it if missing) and use the `write-adr` skill.
- **Fix:** collect it for the fix run.

## 3. Fixes

If there is something to fix: run a fix run as in "Fixes" of [implement](../implement/SKILL.md) with the collected `D-n` as the list. It extends `handoff.md`; then go through the remaining open points with the user again.

## 4. Project documents

When everything is clarified and the user is happy:

- `maintain-glossary` (if the slice's interview files have a `glossary.md` or new terms came up),
- `maintain-architecture`,
- `maintain-agents`, only for commands and pitfalls from "Notes for the next slice" that later slices need (e.g. a command that fails in a certain shell). The rest waits for `close-feature`.

## 5. Wrap up

- Set the slice to `done` in `roadmap.md`. If the handoff suggests changes to later slices, propose them and record agreed changes under "Changes".
- Ask whether the prototype branches of the slice (`<feature>-slice-<nn>-proto-…`) should be deleted.
- **One commit per slice:** squash all commits of the slice into one, e.g. `feat(user-login): slice-02 form validation`. The slice starts after the last commit `feat(<feature>): slice-…` or `docs(<feature>): fast-lane plan`, or at the merge base with the default branch for the first slice (`git reset --soft <start>`, then commit). Show the message first.
- If there is a remote, offer to push the feature branch as a backup. If it was pushed before, the squash changed its history: push with `--force-with-lease` and say so.
- Ask: "Merge now or continue with the next slice?" Merge now → follow [merge](../merge/SKILL.md). Otherwise the next step is `/slice <feature> slice-<nn+1>` (next open slice from `roadmap.md`), or `/close-feature <feature>` if all slices are done.

## All slices

After `implement all`, several slices are implemented but not closed, each as one commit `feat(<feature>): slice-<nn> …`. Close them in one pass, steps 1–5 with these differences:

- **Human review:** ask once for which slices the user wants a review (none, some, all); one `review/` per chosen slice, one after another. Fix runs from reviews happen before this pass continues.
- **Deviations:** go through all `D-n` still `open`, grouped by slice.
- **Fixes:** fix runs as in step 3, one per slice; for slices that are already one commit, "Fixes" in [implement](../implement/SKILL.md) folds them into that commit.
- **Project documents:** once for all slices together.
- **Wrap up:** set all closed slices to `done` and commit the document changes of this pass as a fixup of the last slice's commit, so there stays one commit per slice; no squash beyond that. Prototype branches: the slices' ones as in step 5; fast-lane prototypes (`<feature>-proto-*`) wait for `close-feature`.
