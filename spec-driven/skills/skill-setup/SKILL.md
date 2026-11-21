---
name: skill-setup
description: One-time setup that prepares a project for the spec-driven workflow - creates README.md, CLAUDE.md, AGENTS.md, GLOSSARY.md, GLOSSARY-MAP.md, ARCHITECTURE.md, docs/adrs/ and docs/workflow/README.md, plans ROADMAP.md with project-roadmap, verifies the lint/typecheck/test commands and, for a brand-new project, records the planned stack and points to project-setup. Safe to re-run - only adds what is missing, never overwrites.
disable-model-invocation: true
---

# Skill Setup

Prepare the project once so every later skill finds the same documents. Only the setup lives here; keeping the documents up to date belongs to the rest of the workflow.

## Ground rules

- **Never overwrite.** Create only what is missing. Extend an existing file only after showing the change and getting confirmation.
- **No project skeleton:** no scaffolding and no stack setup; that belongs to `/project-setup`.
- **No side effects without confirmation:** no dependency installs, no commits, no changes to GitHub/GitLab settings.
- **No empty placeholders.** Leave out any section that has nothing real to say yet; it gets added when there is. Exception: `GLOSSARY.md` and `GLOSSARY-MAP.md` keep their sections with a one-line "nothing yet" note, so their structure is visible from the start.
- **All created documents are in English**, regardless of the conversation language. Talk to the user in their language.
- Do not create `docs/features/` or area-level `GLOSSARY.md` files. They are created when first needed.

## 1. Inventory (no questions yet)

Collect everything that can be discovered before asking anything:

- **Git:** is this a repository? If not, offer `git init`. Detect the default branch (`main`, `master`, …) instead of assuming `main`. Warn if the working tree has uncommitted changes.
- **Existing documents:** `README.md`, `CLAUDE.md`, `AGENTS.md`, `GLOSSARY.md`, `GLOSSARY-MAP.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `docs/adrs/`, `docs/workflow/README.md`.
- **Codebase:** language, package manager and frameworks, from the project files of any stack: `package.json`, `*.sln` / `*.csproj`, `pyproject.toml` / `requirements.txt`, `Cargo.toml`, `go.mod`, `pom.xml` / `build.gradle*`, `CMakeLists.txt`, `pubspec.yaml`, …
- **New project:** the project counts as new when there is no project file and no source code. Only documents, `.git`, `.gitignore` or a license may exist. A planned stack in an existing `AGENTS.md` (from an earlier run) counts as a proposal for the interview.
- **Checks:** lint/format, typecheck/build, test, from the stack's usual places: `package.json` scripts, `Makefile`, CI config, and the stack's own tools (e.g. `dotnet build` / `dotnet test`, `ruff` / `pytest`, `cargo clippy` / `cargo test`, `go vet` / `go test`).

## 2. Project roadmap

- **`ROADMAP.md` missing:** use the `project-roadmap` skill with the inventory. It goes through the first picture of the project with the user and writes `ROADMAP.md`: the features the project should get, with horizons and dependencies. For a new project, recommend it strongly: `/project-setup` relies on it. For an existing codebase, offer it; the user may skip it.
- **`ROADMAP.md` exists:** leave it as it is. Mention that `/project-roadmap` changes it.

## 3. Interview

Ask in one or two rounds of up to 5 questions. Show discovered values as proposals instead of asking for them, each with a recommendation the user can simply confirm.

| Question | Recommendation | Ask when |
|---|---|---|
| Project description (1–2 sentences) | derived from `ROADMAP.md`, README or codebase | not obvious |
| README audience: end users or developers | app → end users, library/tool → developers | not obvious |
| Kind of project: web app, desktop app, mobile app, CLI, library, service/API, … | derived from `ROADMAP.md` | new project |
| Language and stack (framework, package manager) | the most common choice for that kind of project, matching the roadmap and what the user already mentioned | new project |
| Set up missing checks? | lint/format + test tools that fit the stack | existing project and lint, typecheck or test is missing |

For a new project, keep asking until language and stack are settled. If the user is unsure, explain two or three options in plain words with their trade-offs, then recommend one.

## 4. Planned stack (new projects only)

Skip this step for an existing codebase.

The project skeleton (scaffolding, dependencies, tools) is not set up here; that is the job of `/project-setup`, which plans it with the user. Record the settled stack in `AGENTS.md` under "Development Environment", e.g. "Planned stack: React + TypeScript with Vite. Not set up yet; run `/project-setup`." `/project-setup` reads it from there.

## 5. Create the documents

Use the templates in [templates/](templates/). Fill placeholders with real content and drop sections that would stay empty.

| File | Missing | Already exists |
|---|---|---|
| `README.md` | from [readme.md](templates/readme.md) | don't rewrite; offer to add missing sections (e.g. "Development") |
| `CLAUDE.md` | from [claude.md](templates/claude.md) | add `@AGENTS.md` at the top if missing. If it holds project content, propose moving it into `AGENTS.md` |
| `AGENTS.md` | from [agents.md](templates/agents.md) | add missing sections, keep existing content |
| `GLOSSARY.md` | from [glossary.md](templates/glossary.md) | check the structure and report deviations |
| `GLOSSARY-MAP.md` | from [glossary-map.md](templates/glossary-map.md) | check that the global `GLOSSARY.md` is listed as the first area |
| `ARCHITECTURE.md` | from [architecture.md](templates/architecture.md) | leave untouched |
| `docs/adrs/` | create with `.gitkeep` | leave untouched |
| `docs/workflow/README.md` | copy [workflow-readme.md](templates/workflow-readme.md) as is | replace only after showing the diff and getting confirmation |
| `.vscode/extensions.json` | only if the project is edited in VS Code: offer it with `bierner.markdown-mermaid` in `recommendations` | offer to add `bierner.markdown-mermaid` if missing |

The workflow documents (interview files, reviews) use Mermaid diagrams; the extension makes the VS Code Markdown preview show them.

### README.md

The README is the only document for people who don't know the project. Write it so they understand it on first read:

- Plain language, short sentences. Explain any technical or domain term, or leave it out.
- Most important first: what it is, what it's for, how to start.
- Every command is copy-pasteable and has been run once before it goes in.
- Keep it short. Details live in the linked documents.
- **New project:** only title, description, "Status" (e.g. "Early stage, nothing to run yet.") and the workflow part of "Development". `/project-setup` adds "Getting started" once there is something to start; "Usage" waits until there is something to use.

### AGENTS.md

The template's section texts describe what belongs there; replace them with real content and drop the section if there is none yet.

- "Development Environment" and "Testing Instructions": the commands for lint/format, build/typecheck and test, plus only what isn't obvious from the project files: required env vars, ordering, unusual flags. Don't copy plain script lists; they go stale.
- "Code Style Guidelines": only what the stack's tools don't already enforce.
- "Project Context": keep the links to `GLOSSARY.md`, `GLOSSARY-MAP.md`, `docs/adrs/` and `docs/workflow/README.md`.

### ARCHITECTURE.md

- **New project:** title and overview paragraph only; the other sections appear once there is real code. A scaffold alone doesn't count.
- **Existing codebase:** draft it from the code: overview, modules with one-line responsibilities, a typical data flow. It's a map, not documentation: 1–2 pages, no file-by-file listing. Show the draft and let the user confirm or correct it before writing.

### GLOSSARY.md and GLOSSARY-MAP.md

Create both from the templates with their "nothing yet" notes. The global `GLOSSARY.md` in the project root is always the first area in the map. Do **not** mine terms from the code; terms are resolved later in the workflow, with the user.

### docs/adrs/

Create it empty (with `.gitkeep`). ADRs are written later by the workflow.

### docs/workflow/README.md

Copy [workflow-readme.md](templates/workflow-readme.md) unchanged; it has no placeholders. It describes the workflow itself, not the project, so it is the same in every project. On a re-run, an outdated copy (the template changed since) is updated only after showing the diff and getting confirmation.

## 6. Verify the checks

- **New project:** skip this step; there are no checks yet. `/project-setup` sets them up.
- Run each lint / typecheck / test command once. Report failures; don't fix anything outside the setup.
- **Missing checks** (existing project): set up the tools agreed in the interview, then run them once.
- Make sure every command that works is recorded in `AGENTS.md`.

## 7. Finish

- Report in four groups: **created**, **extended**, **unchanged**, **warnings**.
- **New project:** the next step is `/project-setup`, which plans the project skeleton (dependencies, libraries, tools) for the features in `ROADMAP.md` with the user and sets it up after their confirmation.
- **Existing project:** the next step is `/new-feature` (with the first `now` feature from `ROADMAP.md`, if there is one).
- Offer one commit on the default branch: `chore: set up project`. Commit only after confirmation.

A re-run with nothing to do reports exactly that and changes no file.
