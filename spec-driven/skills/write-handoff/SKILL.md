---
name: write-handoff
description: Writes implementation/slice-<nn>/handoff.md - what was built and where it deviates from scope.md - and extends it after every fix run. Used by implement (slices and fix runs).
user-invocable: false
---

# Write Handoff

## After implement

Write `implementation/slice-<nn>/handoff.md` from [templates/handoff.md](templates/handoff.md).

- Read: builder and reviewer reports, the diff of the run, `scope.md`.
- "Acceptance criteria": every `SC` with result and the test that covers it.
- "Deviations": every difference from `scope.md` or the interview files as `D-n`, with reason and status `open`.
- "Postponed", "Open problems", "Notes for the next slice": only if there is something to say.
- Leave out empty sections.

## After a fix run

- Add the fixes under "Fixes", each with the `R-n` (from `review/review-scope.md`) or `D-n` it resolves.
- Set the status of fixed deviations to `fixed`, accepted ones to `accepted`.
- Add new deviations that came up during the fixes as `D-n` with status `open`.
