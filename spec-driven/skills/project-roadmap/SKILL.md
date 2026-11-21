---
name: project-roadmap
description: Plans the project roadmap ROADMAP.md with the user in an interview - the first picture of the project and the features it should get, later new features or bigger changes. Plans only as far ahead as makes sense; details stay in the feature workflow. Used by skill-setup, or directly - /project-roadmap
---

# Project Roadmap

Plans `ROADMAP.md`, the project roadmap in the project root: which features the project should get, in which order and with which dependencies. It points the way; requirements and technical decisions are made later in `/feature` and `/slice`.

Format and rules of `ROADMAP.md`: [maintain-roadmap](../maintain-roadmap/SKILL.md). That skill keeps it up to date during the workflow; this one plans it with the user.

## 1. Inventory

- **`ROADMAP.md` missing:** first draft. **Exists:** change mode: the user wants to add features or change the direction.
- Read `AGENTS.md` (only the project description and the planned stack), the folder names in `docs/features/` and `docs/features/closed/` (they become rows with status `in progress` or `done`; don't read their documents) and `docs/interview/project-roadmap/` (decisions of earlier runs).
- Called by `skill-setup`: use its inventory instead of collecting again.
- Work on the default branch (switch if needed, see "Right branch first" in [feature-structure](../feature-structure/SKILL.md#rules-for-skills)).

## 2. Interview

Use the `interview` skill with the inventory. Its folder is `docs/interview/project-roadmap/`; later runs update these files.

Topics for a first draft:

| Topic | What has to be decided |
|---|---|
| Purpose and users | what the project is, for whom, which problem it solves |
| First usable version | the features it needs at least (horizon `now`) |
| After that | the next features (`next`); further ideas only as one line each (`later`) |
| Not planned | deliberate non-goals |
| Order | dependencies between the features |

In change mode: what the user wants to change or add, and how it affects dependencies and horizons.

- **Feature size:** one entry = one run of the feature workflow (`/new-feature`). Too big: split it. Too small: merge it into another feature, or it is a `/one-shot` and not a roadmap entry.
- **Stay shallow:** when answers go into requirements, screens or technology, don't decide them. Note them in the interview files under the feature's topic, so `/feature` finds them later.
- **Recommend `later`** for anything the first usable version doesn't need.
- Never drop features that are `in progress` or `done` without the user saying so.

At the end, `interview` writes its files and lets the user review them.

## 3. Write

- Write or update `ROADMAP.md` following [maintain-roadmap](../maintain-roadmap/SKILL.md). In change mode, show what changes in a few lines.
- Adjust until the user is happy.
- Called by the user: offer a commit on the default branch, e.g. `docs: plan project roadmap`. Called by `skill-setup`: its commit covers it.

Next step: called by `skill-setup`, continue there. Called by the user: if no feature runs yet, `/new-feature <first now feature>` (full command); otherwise no next step.
