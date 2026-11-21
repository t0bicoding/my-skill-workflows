---
name: readme-maintainer
description: Maintains README.md — the human-facing quickstart (setup, dev, test, build commands) so a new developer can get the project running without reading AGENTS.md, asking an AI, or digging through configs. Use after a feature ships and something changed (a new setup step, a new run/test/build command, a new external dependency); not for AI-facing docs, that's /agents-maintainer.
---

## Structure

```md
# {Project Name}

{One or two sentence description — human-friendly, may reuse AGENTS.md's project description.}

## Prerequisites

{One-time setup: clone, install dependencies per component, create a venv, external tools —
actual copy-pasteable commands, in order.}

## Running

{How to run the project in dev mode — copy-pasteable commands. One block per run mode if they
differ (e.g. full desktop app vs. backend/frontend started separately).}

## Tests & Lint

{Exact commands, per component.}

## Build

{How to produce a release build/installer, including ordering gotchas.}
```

Leave out any section with nothing to say (e.g. no separate "Build" section for a library with no
installer) — an empty placeholder left "for later" just goes stale.

## Rules

- **Audience is humans, not AI.** Where `/agents-maintainer` deliberately omits what a
  `package.json`/`pyproject.toml`/`Makefile` already answers, README.md exists *because* a human
  doesn't want to open those files first — restate the actual runnable commands, spelled out and
  copy-pasteable, even where that duplicates AGENTS.md or a config file.
- **Order matters.** If one step must run before another (e.g. "build the sidecar binary before
  `tauri build`, or the release bundles a stale one"), say so explicitly and say why — that's
  exactly the kind of mistake a human makes once and then wants written down.
- **Keep it a quickstart, not a manual.** One command block per concern, minimal prose. Link to
  `docs/` (or `CLAUDE.md`/`AGENTS.md`, `CONTEXT.md`, `docs/adr/`) for anything that needs more than
  a paragraph — architecture rationale, domain vocabulary, ADRs — rather than inlining it.
- **Discover commands from the source, not from what an older README said.** Read the actual
  project files (`package.json` scripts, `pyproject.toml`, CI workflow, pre-push hook) — commands
  drift as tooling changes. When several components exist (e.g. backend/frontend), cover each
  one's setup, dev, test, and lint/format commands separately.
- **Language**: the skill itself, this file, stays English — same as every skill. The generated
  `README.md`, like `docs/workflow/README.md`, is written in the project's documentation language
  (see `CLAUDE.md`/`AGENTS.md` › Language): translate the structure above, headings included, into
  that language (as-is if it's English). If the Language section doesn't yet list README.md among
  the documents written in that language, add it there.

## Location

Always a single `README.md` at the repository root, regardless of single- vs. multi-context repo
shape (that distinction only affects `CONTEXT.md`/`CONTEXT-MAP.md`).

- `README.md` exists → it's the source of truth; update it in place.
- `README.md` doesn't exist yet → create it once there's an actual setup/run/test/build story to
  tell (i.e. not during a documentation-only or infrastructure-free feature).

## Final Step

Report what was updated and why. If nothing needed a change, say so.
