---
name: feature
description: Plans a feature from the user's point of view - what it should and should not do, its functions and user stories - in interview rounds, then writes specifications.md and the feature roadmap (roadmap.md). No technical decisions. Usage - /feature <feature name>
disable-model-invocation: true
---

# Feature

Plans *what* the feature does. Coding and testing decisions are not made here; they belong to `/slice`. If technical points come up, note them as open questions for a slice instead of deciding them.

Shared rules: [Rules for skills](../feature-structure/SKILL.md#rules-for-skills), only that section. Runs on the default branch (switch if needed, see "Right branch first" there).

## 1. Where does the planning stand?

Find `docs/features/<feature>/planning/` (if no name is given, list the open features and ask). Check what exists, without reading the contents yet: `idea.md`, `interview/` and its `progress.md`, `specifications.md`, `roadmap.md`. Each step reads what it needs.

| State | Continue with |
|---|---|
| no spec, `interview/progress.md` exists | 2. Interview, continued from `progress.md` |
| no spec, interview files without `progress.md` | 3. Spec (the interview is done) |
| no spec, no `interview/` | 2. Interview |
| spec, no feature roadmap | 4. Feature roadmap |
| spec and roadmap | Tell the user planning is done and give the next step (see 4. Feature roadmap). Offer to change spec or roadmap if they want. |

If `idea.md` is still the placeholder, ask the user to fill it or describe the idea in the chat.

## 2. Interview

1. Use the `interview` skill with `idea.md`, `idea-assets/`, on a restart `interview/progress.md`, and from the project roadmap (if there is one) only: the feature's row and section in `ROADMAP.md`, the rows of the features it depends on and of its neighbours, and the topic file on this feature in `docs/interview/project-roadmap/`. They show what belongs to this feature and what to another one. Topics: problem and goal, what is out of scope, functions, user stories, edge cases, acceptance criteria. Its folder is `planning/interview/`.
2. Points that are open but don't block the spec (e.g. technical questions for a slice) may stay open; the interview records them under "Left open" in `interview/README.md`.

At the end, `interview` writes the decisions by topic into `planning/interview/` and lets the user review them.

## 3. Spec

- When the interview files are reviewed, recommend writing the spec. The user may also decide this at any time.
- Use the `write-spec` skill **only after the user explicitly confirms.**
- Then use the `maintain-roadmap` skill (spec written). What the spec puts out of scope because another roadmap feature covers it is named there with that feature.

## 4. Feature roadmap

Use the `roadmap` skill (the slices of this feature). Then offer a commit of the planning files on the default branch, e.g. `docs(<feature>): plan feature`.

Next step for the user, as full commands (see "Rules for skills" in [feature-structure](../feature-structure/SKILL.md#rules-for-skills)), with a recommendation:

- `/slice <feature> slice-01`: an interview per slice, most overview. For complex or risky features.
- `/fast-lane <feature>`: one short interview for all slices, then all scopes at once, and `/implement <feature> all` can build them in one run. For features with clear slices and few technical decisions.
