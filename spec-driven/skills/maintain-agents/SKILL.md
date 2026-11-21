---
name: maintain-agents
description: Keeps AGENTS.md up to date - commands, dependencies, conventions, gotchas. Used by close-slice (pitfalls only), close-feature, one-shot and project-setup.
user-invocable: false
---

# Maintain AGENTS.md

**Read:** `AGENTS.md`, and depending on the caller:

- `close-slice`: "Notes for the next slice" of the slice's `handoff.md`.
- `close-feature`: "Notes for the next slice" of all handoffs, and the diff of package and config files over the feature (e.g. `git diff <base> -- package.json '*.config.*'`), not the full code diff.
- `one-shot`: its change.
- `project-setup`: `setup-plan.md` and the checks that were run.

- Add what agents need and can't see in the project files: new commands, required env vars, setup steps (dependencies, files like `.env`), conventions the tools don't enforce, unusual patterns or gotchas.
- Run every new command once before it goes in.
- Remove what is outdated.
- Don't copy what lives elsewhere: link to `GLOSSARY.md`, `ARCHITECTURE.md`, `docs/adrs/`.
- Keep it short. English.
- Nothing changed → no edit.

Show the changes briefly; apply them after the user's OK.
