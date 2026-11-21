---
name: slice
description: Prepares the next slice of a feature's roadmap on the feature branch - makes the technical decisions with the user (e.g. structure, data, logic, UI, testing, glossary, ADRs) in an interview, clarifies uncertain ones with prototypes and writes scope.md. Usage - /slice [feature] [slice-nn]
disable-model-invocation: true
---

# Slice

The counterpart of `/feature`: `/feature` decided *what*, `/slice` decides *how* for one slice.

Shared rules: [Rules for skills](../feature-structure/SKILL.md#rules-for-skills), only that section.

## 1. Which slice?

Find the feature (if unclear, ask). The slice is the one in `roadmap.md` that is `in progress`, otherwise the first `open` one. The user may name another.

If the slice already has a `scope.md` from `fast-lane`, it is prepared: say so and give the next step `/implement <feature> slice-<nn>` (or `/implement <feature> all`).

## 2. Feature branch

- **Missing (first slice):** create it from the default branch in the project folder: `git switch -c <feature> <default>`.
- **Exists:** switch to it if needed ("Right branch first" in [feature-structure](../feature-structure/SKILL.md#rules-for-skills)). If the default branch has commits the feature branch doesn't have, say so and offer "update only" from [merge](../merge/SKILL.md).

Then set the slice to `in progress` in `roadmap.md`.

## 3. Interview

1. Collect the context, and only this: the slice's entry in `roadmap.md`; from `specifications.md` only the `F` and `AC` the entry lists under "Covers"; "Left open" in `planning/interview/README.md` (points deferred to a slice); from the previous slice's `handoff.md` only "Notes for the next slice" and "Postponed"; an existing `interview/` of this slice (on a restart: `interview/progress.md`); `ARCHITECTURE.md`; from `GLOSSARY.md` the terms of the area; ADRs in `docs/adrs/` that touch the area (pick them by title).
2. Use the `interview` skill with the context. Topics come only from what this slice needs, e.g. structure, data, logic, UI, testing, glossary, ADRs. Its folder is `implementation/slice-<nn>/interview/`.
3. If a decision is hard to judge on paper (often UI or a flow), add "build a prototype" as an answer option to that question, with ⭐ if you recommend it. If the user picks it, use the `prototype` skill right after the round. Questions that depend on this decision wait until the prototype has settled it; the others go on. The result counts as the answer to the question (note it in `progress.md`, screenshots in `interview/assets/`). Example:
   ```
   🔶 **Q3 · Login form layout**
   📍 `start the app` → `login screen opens` → `empty form`
   ❓ **Where do the field labels go?**
   …
   **C · Build a prototype and try both variants** ⭐
   ├─ `both layouts on a temporary branch` → `try them in the app`
   └─ ➕ judged in the real app · ➖ one more step

   ⭐ **C**: the difference is hard to judge on paper
   ```
4. **ADR candidates:** a decision becomes an ADR only if all three apply:
   1. **Hard to reverse:** changing it later costs noticeably.
   2. **Surprising without context:** a later reader asks "why did they do it like this?"
   3. **Result of a real trade-off:** there were real alternatives, one was picked for specific reasons.

   Typical candidates: architecture shape, integration patterns between areas, technologies with lock-in, boundaries and ownership, deliberate deviations from the obvious path, constraints not visible in the code, non-obvious rejected alternatives. Per candidate, name the criteria it meets and weigh benefit and risk. The user decides. Agreed ADRs go into `interview/adrs.md`.

## 4. Interview files and ADRs

At the end, `interview` writes the decisions by topic into `implementation/slice-<nn>/interview/` and lets the user review them. Topics come from what the slice decided, e.g. structure, data, logic, UI, testing; the user should find each decision where they would look for it.

When the user is happy with the files, use the `write-adr` skill for the ADRs in `interview/adrs.md`, if there are any.

## 5. Scope

- When the user is happy with the interview files, recommend writing the scope.
- Use the `write-scope` skill **only after the user explicitly confirms.**
- Next step for the user: `/implement <feature> slice-<nn>` (full command).
