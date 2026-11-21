---
name: write-spec
description: Writes planning/specifications.md of a feature from the interview files in planning/interview/ and idea.md. Used by feature, only after the user confirmed.
user-invocable: false
---

# Write Spec

Write `docs/features/<feature>/planning/specifications.md` from [templates/specifications.md](templates/specifications.md).

- Read: the interview files in `planning/interview/` (start with `README.md`), `idea.md`, `idea-assets/`.
- "Left open" in `interview/README.md` goes into "Open questions" of the spec.
- Describe *what*, not *how*: no code structure, technologies or data schemas.
- IDs: `US-n` (user story), `F-n` (function), `AC-n` (acceptance criterion). Every `F` points to a `US`, every `AC` to an `F`.
- Acceptance criteria are testable statements about observable behaviour.
- Leave out sections without content.
- English, regardless of the conversation language.

Show the user the result and adjust it with them. Later changes go under "Changes" with date and reason.
