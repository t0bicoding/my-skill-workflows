---
name: close-feature
description: Closes a feature - checks the feature roadmap, resolves postponed points from the slice handoffs, updates AGENTS.md, README.md and the project roadmap with the next steps, moves the feature folder to closed/, does the last merge and deletes the feature branch. Usage - /close-feature [feature]
disable-model-invocation: true
---

# Close Feature

Runs on the feature branch (switch if needed, see "Right branch first" in [feature-structure](../feature-structure/SKILL.md#rules-for-skills)).

1. **Check:** are all slices in the feature roadmap `roadmap.md` `done`? If not, say which, and the user decides whether to close anyway.
2. **Postponed points:** list everything under "Postponed" and "Open problems" in the slices' `handoff.md`. Per point the user decides: new feature, `/one-shot` or drop. Nothing disappears unnoticed into `closed/`.
3. **Project documents:** `maintain-agents`, `maintain-readme`.
4. **Project roadmap:** use the `maintain-roadmap` skill ("After a feature"), with the postponed points that became new features. It proposes the next steps; the user confirms.
5. **Move:** `git mv docs/features/<feature> docs/features/closed/<feature>`. Nothing in `closed/` is changed afterwards. Commit, e.g. `docs(<feature>): close feature`.
6. **Last merge:** follow [merge](../merge/SKILL.md), this time including the closing commit, and stay on the default branch afterwards.
7. **Clean up** after the user's OK: delete the feature branch (`git branch -d <feature>`) and any leftover prototype branches (`<feature>-slice-*-proto-*`, and `<feature>-proto-*` from `fast-lane`). If the feature branch is on the remote, offer to delete it there too.

Next step for the user: `/new-feature <feature>` with the feature `maintain-roadmap` handed back (full command).

Moving the folder loses nothing later features need: ADRs live in `docs/adrs/`, glossary and architecture are updated per slice.
