---
name: skill-setup
description: One-time setup that scaffolds the docs/ workflow folder and records project-wide configuration (repo shape, documentation language, project description) in CLAUDE.md/AGENTS.md. Run once per project, before `/new-feature` is used for the first time.
disable-model-invocation: true
---

## Scaffold the Workflow Folder

Create, only where missing — skip and leave untouched anything that already exists:

- `docs/`
- `docs/features/` — feature folders (`specifications.md`, `tickets/clarification/`, `tickets/implementation/`, and their `closed/` subfolders for closed tickets) get created lazily per feature by `/new-feature`, `/write-clarification-tickets`, `/approval`, `/clarify-ticket`, and `/implement`, and moved to `docs/features/closed/<name>/` by `/close-feature`; nothing to seed here.
- `docs/quick/` — not seeded either: `/quick` creates it, and its `closed/` subfolder, with its first ticket.
- `docs/adr/` — project-wide ADRs, also created lazily by `/write-adr` if this step is skipped.
- `docs/workflow/`

## Configuration Wizard

Start an interview with the /interview skill covering these decisions:

- **Repo shape**: single vs. multi-context. Explain the difference (one `CONTEXT.md` vs. several plus a `CONTEXT-MAP.md`) and recommend single for a new project — it's changeable later.
- **Documentation language**: should `docs/features/` and this workflow's own files in `docs/workflow/` (`README.md`, later `must-read-zones.md`) be written in a language other than English? `CLAUDE.md`/`AGENTS.md`, `CONTEXT.md`/`CONTEXT-MAP.md`, and `docs/adr/` always stay in English regardless of this choice.
- **Project description**: only ask if neither the conversation nor an existing codebase already makes it obvious.

## Apply the Decisions

- **Repo shape** → run the /context-maintainer skill to add `CONTEXT.md` (single) or `CONTEXT-MAP.md` (multi) at the project root.
- **Language and project description** → run the /agents-maintainer skill with the project description and the language decision; if a codebase already exists, it also picks up Build/Test/Lint commands and workflow conventions.
- **Workflow README** → write `docs/workflow/README.md` from [workflow-readme.md](workflow-readme.md), translated into the decided documentation language (as-is if that's English). Replace its "Project-wide configuration" placeholder line with a pointer to where the decisions now live (`CLAUDE.md`/`AGENTS.md` for language and description, `CONTEXT.md`/`CONTEXT-MAP.md` for repo shape) instead of restating the values.
- **Project README** → run the /readme-maintainer skill with the language decision; if a codebase already exists, it also picks up actual setup/run/test/build commands, all written in the decided documentation language. With no codebase yet, it has no setup story to tell — leave `README.md` for a later `/close-feature` to create.

## Final Step

List what was created and what was already there. Give the user the ready-to-paste command for the next chat: `/new-feature <idea>`.
