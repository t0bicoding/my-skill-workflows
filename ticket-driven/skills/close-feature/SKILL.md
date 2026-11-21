---
name: close-feature
description: Closes out a feature once every implementation ticket is built and reviewed clean — verifies nothing was left open, summarizes what shipped, and moves it to docs/features/closed/.
disable-model-invocation: true
---

## Preparation

`/close-feature <Featurename>`
If the user hasn't given the feature name, ask.

## Process

1. Check `<feature folder>/tickets/implementation/` (excluding its `closed/` subfolder). Closed tickets are moved into `closed/` by `/implement`, so anything still sitting outside it is unfinished — report which ones and ask the user whether to close the feature anyway.
2. Check `<feature folder>/tickets/clarification/` (excluding its `closed/` subfolder). Closed tickets are moved into `closed/` by `/clarify-ticket`, so anything still outside it usually means a decision never made it into `specifications.md` — flag it the same way.
3. If CLAUDE.md/AGENTS.md has an "E2E" section, run its "Command" field (the full suite) once as the final proof. Name the result in the summary. On red, ask the user whether to close the feature anyway, as in step 1. Without the section: no E2E step, no question, no hint.
4. Summarize what the feature delivers, drawing from `specifications.md` and the "What to build" sections of the tickets now in `<feature folder>/tickets/implementation/closed/`. Read only those sections, e.g. `awk '/^## What to build/{p=1;print;next} /^## /{p=0} p' <ticket>`, and of specifications.md only what the summary needs — never whole tickets or the whole spec via `cat`. Include the E2E result from step 3, if there was one. Add one line on the human review from `<feature folder>/human-review.md`, written by the optional `/human-review`: the number of spots across all runs and how many became findings — or "not run" if the file doesn't exist. Never ask about it; the review is optional, the line only keeps its absence visible. End the summary with a **Numbers, facts, data** block (see below).
5. With the /context-maintainer skill read the CONTEXT.md and modify if needed.
6. With the /agents-maintainer skill check CLAUDE.md/AGENTS.md and update if the feature changed the project's Build/Test/Lint commands, workflow conventions, or overall scope.
7. With the /readme-maintainer skill check README.md and update if the feature added or changed a setup, run, test, lint, or build step a new developer would need.
8. Move the feature folder from `docs/features/<name>/` to `docs/features/closed/<name>/` (create `closed/` if it doesn't exist). That move is what marks a feature closed for every later skill.

### Numbers, facts, data

The feature's balance as a short table. Every number comes from a command — never estimated; what you can't measure, leave out.

- **Find the ticket commits** via the closed ticket files — each `/implement` commit moves one there, so this finds them even when other features' commits lie in between: `git log --format=%h -- <feature folder>/tickets/implementation/closed/`. Take the numbers from these commits only, before the folder move of step 8.
- **Fixed rows:**
  - Ticket and commit count.
  - Time span from the first to the last ticket commit.
  - Diff size summed over the ticket commits, split into production code, test code and docs (`git show --numstat -M <commit>`).
  - Test cases added and removed, counted from the test-definition lines in those diffs (`it(`/`test(`, `def test_`, `#[test]` — whatever the project uses).
  - The E2E result from step 3, if there was one.
  - The human-review line from step 4.
- **Per ticket, a target measure** when the ticket names a goal checkable in code: count the thing it names before the ticket's first commit and today — props of a component, import edges between two areas, lines of a file, cases in a test file. Diff size alone is not a target measure.
- If a count contradicts a sentence of the summary, fix the sentence.

## Final Step

Commit the closed feature on the current branch. Never push — pushing is the user's call alone.
Report the summary, including its numbers block, to the user. If any ADRs were written during this feature, list them so the user can see what's now on record.
