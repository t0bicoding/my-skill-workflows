---
name: merge
description: Brings the closed slices of a feature to the default branch (rebase + fast-forward, one commit per slice), or only updates the feature branch from the default branch. Helps resolve conflicts. Usage - /merge [feature] [update]
disable-model-invocation: true
---

# Merge

The user decides when to merge: after one slice or after several. Also used by `close-slice`, `close-feature` and `one-shot`.

Start on the feature branch ("Right branch first" in [feature-structure](../feature-structure/SKILL.md#rules-for-skills)). If there are uncommitted changes, ask the user first: commit them, stash them or stop.

If there is a remote, first bring the local default branch up to date: `git fetch origin <default>:<default>`. If that fails because the two have diverged, report it and decide with the user.

## Modes

Ask which mode the user wants, unless it's clear.

### Merge (only after the user's OK)

1. Show which slice commits go to the default branch (`git log --oneline <default>..<feature>`). Only closed slices go: up to the commit `feat(<feature>): slice-…` of the last slice that is `done` in `roadmap.md`. Work-in-progress commits of an open slice, and slice commits that are not closed yet (after `implement all`), stay in the branch.
2. Rebase the feature branch onto the default branch.
3. Resolve conflicts (see below).
4. Run lint, typecheck and tests from `AGENTS.md`. If something fails, don't merge; report and decide with the user.
5. Fast-forward the default branch to the commit of the last `done` slice: `git switch <default>`, `git merge --ff-only <commit>`.
6. If there is a remote, offer to push the default branch.
7. Switch back to the feature branch; it stays as long as the feature runs.
8. Next step (full command): `/slice <feature> slice-<nn>` for the next open slice (`/implement <feature> slice-<nn>` if it already has a `scope.md` from `fast-lane`), or `/close-feature <feature>` if all slices are done. Not when called from `close-feature` or `one-shot`.

### Update only

Steps 2–4 without merging. The feature gets changes from other features or one-shots early, and conflicts come in small portions.

After a rebase (both modes): if the feature branch is on the remote, its history changed. Offer to push it with `--force-with-lease`.

## Conflicts

Resolve together with the user:

| Spot | What to do |
|---|---|
| `GLOSSARY.md`, `GLOSSARY-MAP.md`, `ARCHITECTURE.md`, `AGENTS.md`, `README.md` | Usually both sides added something: propose keeping both, the user confirms. |
| `ROADMAP.md` | Keep both sides' rows and sections; for the status of a feature, the further one wins (`done` over `in progress` over `idea`). |
| ADR numbers in `docs/adrs/` | Git reports no conflict, but a number can be taken twice. Check after the rebase; renumber the feature's ADRs and update all links (also in the slices' `interview/adrs.md`). |
| Lock files | Don't resolve by hand, regenerate. |
| Code | Show both sides, the user decides. |
| Logical conflicts | Git merges cleanly but the code doesn't fit anymore. Caught by the checks in step 4. |
