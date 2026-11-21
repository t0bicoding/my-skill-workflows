---
name: feature-structure
description: Reference for the feature folder structure under docs/features/ - what each folder and file is for, when it is written and what goes in it. Use when writing or changing a workflow skill that creates, reads or updates feature documents (planning, roadmap, slices, interview files, handoff).
user-invocable: false
---

# Feature Structure

The single source of truth for where feature documents live. Every workflow skill that reads or writes feature documents follows this structure and links here instead of repeating it.

## Tree

```
docs/
  interview/
    <topic>/                  # interviews without a feature (direct, one-shot, project-setup, project-roadmap)
  features/
    closed/
    <feature>/
      planning/
        idea.md
        idea-assets/
        interview/            # decisions of the planning interview, by topic
        specifications.md
        roadmap.md
      implementation/
        interview/            # fast-lane only: decisions for all its slices, by topic
        slice-<nn>/
          interview/          # decisions of the slice interview, by topic (not after fast-lane)
          scope.md
          handoff.md
          review/             # optional, only after human-review
            review.md
            review-scope.md   # only when the review asked for changes
```

## Folders

| Path | Purpose |
|---|---|
| `docs/features/` | One folder per feature. Created by the first skill that needs it, not during setup. |
| `closed/` | Finished features. The whole `<feature>/` folder is moved here by `close-feature`, after postponed points from the slice handoffs have been resolved. Nothing in `closed/` is edited afterwards. |
| `<feature>/` | Name in kebab-case, short and descriptive, e.g. `user-login`, `csv-export`. |
| `planning/` | Everything decided before implementation starts: what the feature is and in which order it gets built. |
| `implementation/` | Everything that happens while building: one folder per slice. |
| `slice-<nn>/` | One deliverable increment of the feature. Two-digit number (`slice-01`, `slice-02`, …) in roadmap order. |
| `interview/` | In `planning/` and in every slice that had an interview; directly in `implementation/` when the slices were prepared with `fast-lane` (one interview for all of them). The decisions of the interview, sorted by topic. Written by `interview` at the end; see "Interview files" below. **A slice's interview files** are its own `slice-<nn>/interview/`, or `implementation/interview/` after `fast-lane`. |
| `docs/interview/<topic>/` | Same as `interview/`, for interviews without a feature: called directly or from `one-shot`, `project-setup` or `project-roadmap`. |

## Planning files

| File | Purpose | Written |
|---|---|---|
| `idea.md` | The user's raw input, as given. Owned by the user: no template, free form, the user decides how it looks. Skills only read it; it is never rewritten or "improved". It records where the feature started. | First, at feature creation |
| `idea-assets/` | Screenshots, sketches, mockups, links and other material that belongs to the idea. Referenced from `idea.md`. | With `idea.md` |
| `specifications.md` | What the whole feature must do: requirements, behaviour, edge cases, acceptance criteria. Describes *what*, not *how*. Written from `interview/`, `idea.md` and `idea-assets/`. | Only after the user explicitly confirms that the feature is clarified enough (on their own or following the AI's recommendation) |
| `roadmap.md` | Ordered list of slices, each with a one-line goal and a status (`open`, `in progress`, `done`). The only place where slice status is tracked. Updated from each `handoff.md`. | After `specifications.md` is confirmed; updated after every slice |

## Slice files

| File | Purpose | Written |
|---|---|---|
| `scope.md` | Which part of `specifications.md` this slice delivers (with references to the spec sections), acceptance criteria for the slice, and what is explicitly not part of it. Written from the slice's interview files, `specifications.md` and `roadmap.md`. May be adjusted until the slice's implementation starts; not changed afterwards, deviations go into `handoff.md`. | Before implementation of the slice; with `fast-lane` for all its slices at once |
| `handoff.md` | What actually happened: what was built, deviations from `scope.md`, what was postponed, open problems, hints for the next slice. Each deviation is marked as accepted or fixed (in `human-review` or `close-slice`); fix runs add their fixes to this file. A slice counts as done only when this file exists and every deviation is accepted or fixed. | At the end of the implementation; extended after every fix run |
| `review/review.md` | Optional. Record of the human review, which runs in the chat: the stops the AI picked (with the reason), the user's decision per stop with clickable code links, acceptance criteria with their tests, and a re-check after fixes. Updated after every round, so an interrupted review can continue. | Only when the user runs `human-review`, between implementation and closing the slice |
| `review/review-scope.md` | Only when the review asked for changes: one `R-n` per change with "done when". The task of the fix run with `implement`, which sets each entry to `fixed`. While the review runs, `review/` also holds temporary visual aids `r<n>-<slug>.md`, deleted at the end. | At the end of `human-review` |

## Interview files

Written by the `interview` skill at the end of every interview (format and templates there). The same structure in `planning/interview/`, `slice-<nn>/interview/` and `docs/interview/<topic>/`.

| File | Purpose |
|---|---|
| `README.md` | Always. Entry point: what was clarified, one line and a link per topic, the decisions the AI made itself, what was deliberately left open. |
| `<topic>.md` | One file per topic. Topics are chosen freely from what was decided (e.g. `editor-layout.md`, `saving.md`, `user-stories.md`), not from a fixed list. Every decision with reason and rejected alternative, visual (flow, wireframe, tree, table, screenshot) where it helps. Factual and short. |
| `adrs.md` | Fixed name, only when ADRs were agreed. Not the ADRs themselves: the list of ADRs to create or change, each with a one-line reason. Once the user agrees, `write-adr` creates or updates them in `docs/adrs/`, the only place where ADRs live. |
| `glossary.md` | Fixed name, only when terms were introduced or sharpened. `maintain-glossary` takes them into `GLOSSARY.md`. |
| `assets/` | Screenshots and images the topic files link to, e.g. results of a UI or design prototype. Created only when there are images. |

**While the interview runs** the folder also holds temporary files: `progress.md` (where the interview stands, so it can continue in a new chat) and `q<n>-<slug>.md` (visual aids for single questions). Both are deleted at the end; only the files above remain.

In feature planning, the topics are about *what* the feature does (no `adrs.md`, technical points stay open for a slice). In a slice, they are about *how*: e.g. structure, data, logic, UI, testing, as far as the slice needs them.

## Prototypes

Prototypes are throwaway code and do not live in `docs/` or on the feature branch. Each one is built in the real code on its own temporary branch, branched from the feature branch: `<feature>-slice-<nn>-proto-<topic>` from a slice, `<feature>-proto-<topic>` from `fast-lane`. What a prototype settled is recorded in the interview files (with screenshots in `assets/` of the interview folder), so the decision survives when the branch is deleted: slice prototypes at `close-slice`, fast-lane prototypes at `close-feature`.

## Rules for skills

- **Project roadmap:** `ROADMAP.md` in the project root lists the features of the project with horizon, dependencies and status. A feature's folder name is its roadmap name. Planned by `project-roadmap`, kept up to date by `maintain-roadmap`. Only `new-feature`, `feature` and `close-feature` touch it; slice skills never read it. Not to be confused with the feature roadmap `planning/roadmap.md`.
- **One place per fact.** Before writing, check which file owns the content. Link to it instead of copying.
- **Read only what the step needs.** Each skill names what it reads; read nothing else. In long documents read only the named sections. Check a state by existence (does `scope.md` exist, what does the status table say), not by reading contents. Subagents get paths, not contents. Overview for skill authors: "Who reads what" below.
- **Plan stays plan.** `idea.md` and `scope.md` are not rewritten to match what happened; reality goes into `handoff.md` and `roadmap.md`. Only a scope whose slice has not started yet may still be adjusted (e.g. after `/fast-lane`).
- **Where files are written:** `planning/` on the default branch. `docs/interview/<topic>/` on the branch the interview runs on (in a one-shot: committed with the one-shot; from `project-setup` or `project-roadmap`: on the default branch). Everything under `implementation/` on the feature branch `<feature>` (created by the first `slice`), which reaches the default branch when the user runs `merge`. Once slices run (or `fast-lane` started), status updates and changes to `roadmap.md` and `specifications.md` are also made on the feature branch.
- **Branches, no worktrees:** everything happens in the one project folder; skills switch branches there. Detect the default branch instead of assuming `main`.
- **Right branch first:** before working, check the current branch. Planning skills need the default branch, slice skills the feature branch `<feature>`. If it's the wrong one, say so and offer to switch. Uncommitted changes are committed (e.g. as `wip`) or stashed first, as the user decides. If packages differ between the branches, reinstall dependencies after switching.
- **Next step as a full command:** when a skill tells the user what to run next, give the complete command ready to copy, with feature name and slice number, e.g. `/implement user-login slice-02`. For a new slice, take the next open slice from `roadmap.md`; if it already has a `scope.md` (from `fast-lane`), the next step is `/implement`, not `/slice`.
- **Push only with the user's OK.** GitHub (or another remote) is the backup; skills offer pushing at fixed points (`close-slice`, `merge`), never on their own.
- **No empty files.** Create a file only when it has real content. This applies especially to `interview/`.
- **All documents in English**, regardless of the conversation language.

## Who reads what

Reference for writing and changing skills; skills don't read this section. Each skill's own instructions name its reads. "Section" means only that part of the file.

| Skill | Reads |
|---|---|
| `skill-setup` | all project documents and project files (it creates them) |
| `project-roadmap` | `ROADMAP.md`, `AGENTS.md` (project description, planned stack), feature folder names with spec yes/no, `docs/interview/project-roadmap/` |
| `project-setup` | `AGENTS.md` (planned stack), `ROADMAP.md` (table, `now`/`next` sections), ADR titles |
| `new-feature` | `ROADMAP.md` (table only) |
| `feature` | state by existence; `idea.md`, `idea-assets/`, `planning/interview/`; from `ROADMAP.md` its row and section plus the rows of dependencies and neighbours; its notes in `docs/interview/project-roadmap/` |
| `write-spec` | `planning/interview/`, `idea.md`, `idea-assets/` |
| `roadmap` | `specifications.md` |
| `slice` | its roadmap entry; spec only the `F`/`AC` under "Covers"; "Left open"; previous handoff only "Notes for the next slice" and "Postponed"; `ARCHITECTURE.md`; glossary terms and ADRs of the area |
| `fast-lane` | whole spec and feature roadmap; otherwise as `slice` |
| `write-scope` | its roadmap entry, the covered spec sections, interview `README.md` and the matching topics |
| `implement` | roadmap status table, which slice files exist, `scope.md`, subagent reports; passes paths |
| `BUILDER` | task, `scope.md`, `AGENTS.md`, interview `README.md` and the topics the task needs; spec, architecture, glossary, ADRs only where needed. Fix run: `review-scope.md` and the touched files |
| `REVIEWER` | spec + scope: `scope.md`, linked spec sections, behaviour topics. Standards: `AGENTS.md`, structure topics, ADRs and glossary of the area |
| `write-handoff` | reports, diff, `scope.md` |
| `human-review` | `handoff.md`, `scope.md`, diff; interview topics only where a stop needs the "why" |
| `close-slice` | open `D-n` in `handoff.md`, status in `review-scope.md` |
| `maintain-glossary` | the interview's `glossary.md`, `GLOSSARY.md`, `GLOSSARY-MAP.md` |
| `maintain-architecture` | `ARCHITECTURE.md`, diff, structure topics, new ADRs |
| `maintain-agents` | `AGENTS.md`; "Notes for the next slice"; at `close-feature` also the diff of package and config files |
| `maintain-readme` | `README.md`; spec only "Goal" and function names |
| `maintain-roadmap` | its row in `ROADMAP.md`; after a feature: `ROADMAP.md`, spec "Out of scope", handoffs "Built" and "Postponed" |
| `close-feature` | feature roadmap status, handoffs "Postponed" and "Open problems" |
| `merge` | feature roadmap status, `git log` |
| `write-adr` | `adrs.md`, ADR file names; an existing ADR only when it changes |
