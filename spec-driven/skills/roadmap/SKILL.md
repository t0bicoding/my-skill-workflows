---
name: roadmap
description: Splits a feature into vertical slices (tracer bullets) and writes planning/roadmap.md. Used by feature.
user-invocable: false
---

# Roadmap

Write `docs/features/<feature>/planning/roadmap.md` from [templates/roadmap.md](templates/roadmap.md), based on `specifications.md`.

Slices:

- **Vertical:** every slice cuts through all layers it needs (tracer bullet). No "backend first, UI later" slices.
- **Testable:** every slice delivers something the user can try or see, where possible.
- **Sized by review effort, not by number of parts:** a slice is as big as the user can still think through and review comfortably. Every slice costs a round of `/slice`, `/implement` and `/close-slice` (with `/fast-lane` less, but still a commit, a handoff and a review), so don't split without need.
  - **Small, medium or routine features** (e.g. basic components, a simple form, a settings page): few slices, often one to three. Bundle routine parts that need little thought or review into one slice.
  - **Complex or risky features:** more and smaller slices, split where there is real thinking, review effort or risk.
- The first slice is the thinnest path that works end to end.
- Every `F` and `AC` of the spec is covered by at least one slice.
- All slices start as `open`.

Show the roadmap to the user with a short reason for the number of slices, and adjust it with them. Later changes go under "Changes" with date and reason.
