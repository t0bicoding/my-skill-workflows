---
name: write-scope
description: Writes implementation/slice-<nn>/scope.md from the slice's roadmap entry, the spec and the slice's interview files. Used by slice and fast-lane.
user-invocable: false
---

# Write Scope

Write `implementation/slice-<nn>/scope.md` from [templates/scope.md](templates/scope.md).

- Read: the slice's entry in `roadmap.md`; from `specifications.md` only the `F` and `AC` under its "Covers"; the interview `README.md` and the topic files that matter for this slice; the context from the calling skill. Interview files: the slice's `interview/`; from `fast-lane` the shared `implementation/interview/` (links then go to `../interview/`).
- "Covers" links to the `F` and `AC` of the spec.
- Slice criteria `SC-n` are testable and point to an `AC`.
- "Not part of this slice" names what is left out and which slice takes it.
- "Decisions" links the interview `README.md` and the topic files that matter for this slice, each with a one-line summary.
- "How to try it" gives the user concrete steps.

Show the scope to the user and adjust it with them. Until the slice's implementation starts, the scope may still be adjusted (e.g. a fast-lane scope after the previous slice's handoff). After that, `scope.md` is not changed; deviations go into `handoff.md`.
