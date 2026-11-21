---
name: project-setup
description: Plans and sets up the skeleton of a new project for the chosen stack - goes through dependencies, libraries and tools with the user in an interview, shows the complete setup plan for final decisions and only after the user's confirmation scaffolds, installs and verifies it. Usage - /project-setup
disable-model-invocation: true
---

# Project Setup

Plans the skeleton of a new project with the user, then builds it. Nothing is installed or created before the user confirms the plan.

Usually runs right after `/skill-setup`, which recommends it when there is no project skeleton yet.

## 1. Check

- **Skeleton already there?** The project counts as new when there is no project file (e.g. `package.json`, `*.csproj`, `pyproject.toml`, `Cargo.toml`, `go.mod`) and no source code. If there is one, say so: adding libraries or tools to an existing project is a `/one-shot` or a feature, not this skill.
- **Workflow documents:** if `AGENTS.md` or `docs/workflow/README.md` is missing, recommend `/skill-setup` first. The user decides.
- **Planned stack:** read "Development Environment" in `AGENTS.md` (`/skill-setup` records the planned stack there) and the titles of existing ADRs in `docs/adrs/`.
- **Project roadmap:** read the feature table of `ROADMAP.md` and the sections of the `now` and `next` features. They decide what the skeleton needs from the start. If there is none, offer `/project-roadmap` first; without it, ask briefly in the interview what the first version must do.
- **Branch:** work on the default branch (detect it, don't assume `main`). Warn if the working tree has uncommitted changes.

## 2. Research

Before asking anything, find out what is current for the stack, with the tools themselves, not from memory: the official scaffolding tool and its templates and flags (e.g. `npm create vite@latest -- --help`, `dotnet new list`, `uv init --help`), current versions of candidate packages (e.g. `npm view <package> version`), and the stack's common default tools for lint, format, typecheck and test.

## 3. Interview

Use the `interview` skill with the planned stack, the kind of project, the features in `ROADMAP.md` and the research results. Its folder is `docs/interview/project-setup/`.

Topics, only as far as they fit the kind of project:

| Topic | What has to be decided |
|---|---|
| Stack | confirm the planned stack, or choose it if none is recorded |
| Scaffold | scaffolding tool and template, language options (e.g. TypeScript strict mode) |
| Libraries | what the project needs from the start: UI, styling, state, routing, data and persistence, … |
| Quality tools | formatter, linter, typecheck, test runner (unit; e2e only if needed now) |
| Build and distribution | build tool, packaging, target platforms |
| Developer tooling | editor settings, git hooks, scripts; CI only if wanted |

- **Few and common:** recommend well-maintained, widely used defaults that fit the stack. Every dependency gets a one-line purpose.
- **"Later" is an answer:** for libraries that only a `later` feature of `ROADMAP.md` (or no planned feature) needs, offer "add it when the feature needs it" and recommend it unless there is a reason to decide now. Every dependency added now has to be kept up to date.
- Decide yourself what follows from the stack and nobody would question (e.g. the stack's standard `.gitignore`), and show it under "Decided by me".
- **ADR candidates:** choices with lock-in (e.g. the framework, the persistence approach) are typical ADRs. Use the criteria from step 3 of [slice](../slice/SKILL.md); agreed ADRs go into `docs/interview/project-setup/adrs.md`.

At the end, `interview` writes the decisions by topic into `docs/interview/project-setup/` and lets the user review them.

## 4. Setup plan

Write the complete plan into `docs/interview/project-setup/setup-plan.md` and show a short version in the chat:

- the commands in the order they run,
- files and folders that get created, and what happens to existing files (nothing is overwritten),
- dependencies, split into runtime and development, each with version and purpose,
- scripts (e.g. `dev`, `build`, `lint`, `format`, `typecheck`, `test`) and config files,
- how the result is verified (see 5).

**Final decisions:** the user can still change, add or drop anything in the plan. Adjust it until they are happy. Then ask explicitly for the go. **Only after the user's confirmation** continue with 5; without it, nothing is installed or created.

## 5. Set up

Follow the confirmed plan. If a step fails or the plan doesn't work as written, stop, explain it and agree on the change with the user; don't change course silently.

- Scaffold with the official tool into the project root. If it refuses a non-empty folder, scaffold into a temporary folder and move the files over. Never overwrite existing files; report conflicts and ask.
- Add or extend `.gitignore` for the stack.
- Install the dependencies from the plan, nothing more.
- Set up the quality tools with one passing example test.
- Run lint, typecheck, test and build once, and start the project once to confirm it runs.
- Update `setup-plan.md` where the result differs from the plan, so it shows what was actually set up.

## 6. Documents

- `maintain-agents`: the real commands replace the planned stack in "Development Environment" and "Testing Instructions", plus gotchas found during the setup.
- `maintain-readme`: "Getting started" with the commands to install and start; update "Status".
- `write-adr` for the ADRs in `adrs.md`, if there are any.
- `ARCHITECTURE.md` stays as it is; a scaffold is not yet architecture.

## 7. Finish

- Report what was set up, the check results and any differences from the plan.
- Offer one commit on the default branch, e.g. `chore: set up project skeleton`. Commit only after confirmation.
- Next step for the user: `/new-feature <feature>` with the first `now` feature from `ROADMAP.md` (full command).
