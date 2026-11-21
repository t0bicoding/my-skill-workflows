---
name: maintain-roadmap
description: Keeps the project roadmap ROADMAP.md up to date - status and links of the features, postponed points as new ideas, and at the end of a feature the proposed next steps. Owns the format of ROADMAP.md. Used by new-feature, feature, close-feature and project-roadmap.
user-invocable: false
---

# Maintain Roadmap

`ROADMAP.md` in the project root is the **project roadmap**: which features the project should get, in which direction, and what depends on what. Not to be confused with a **feature roadmap** (`docs/features/<feature>/planning/roadmap.md`, the slices of one feature).

This skill keeps it up to date; `project-roadmap` plans it with the user. If there is no `ROADMAP.md`, change nothing and mention once that `/project-roadmap` can create it.

**Read:** for a status event only the feature's row and section. After a feature: `ROADMAP.md`, "Out of scope" of the feature's spec, "Built" and "Postponed" of its handoffs.

## Format

From [templates/roadmap.md](templates/roadmap.md).

- **Points the way, decides nothing in detail.** No requirements, no technical decisions; those belong to `/feature` and `/slice`.
- **Feature name** = the later folder name in `docs/features/` (kebab-case).
- **Horizon:** `now` and `next` get a section with at most three points of rough boundary; `later` has only its table row.
- **Depends on:** names of features that must be done first, `–` if none.
- **One place per fact:** once a feature has a spec, its section is replaced by one line linking to `specifications.md`. Done features keep their table row with a link to `docs/features/closed/<feature>/`; their section goes.
- **Short:** one or two screens. English.

## Status

| Event | Called by | Change |
|---|---|---|
| feature folder created | `new-feature` | `idea` → `in progress`, link to `docs/features/<feature>/`. Not in the roadmap yet: add a row, ask for the horizon. |
| spec written | `feature` | section → one line linking to the spec |
| feature closed | `close-feature` | `done`, link to `docs/features/closed/<feature>/`; then "After a feature" |

These changes follow from the event: make them without asking and mention them in one line. Everything else only after the user's OK.

## After a feature

Called by `close-feature`. The end of a feature is when the most has been learned; use it to look ahead.

1. Set the feature to `done` (see Status).
2. **Postponed points** the user decided to turn into a new feature: add them as `idea` rows, horizon `later` unless the user says otherwise.
3. **What the feature taught:** compare "Out of scope" of its spec and "Built" and "Postponed" of its handoffs with the roadmap. Was something built that another entry plans? Did a dependency fall away or come up? Did a boundary move? Turn each finding into a concrete proposal.
4. **Next steps:** list the features whose dependencies are now all `done`. Propose what moves from `later` to `next` or from `next` to `now`, and sharpen moved entries to at most three points.
5. Show the proposals compactly, one line each. The user confirms, changes or drops them. If they want to replan more than these proposals cover (a new direction, several new features), recommend `/project-roadmap` instead of planning it here.
6. Hand back the feature that comes next, so the caller can give the next step `/new-feature <feature>`.
