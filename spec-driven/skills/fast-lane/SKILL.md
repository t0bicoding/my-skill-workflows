---
name: fast-lane
description: Shortcut through the slice process of a planned feature - one short technical interview for the whole feature (with prototypes only where they really pay off), adjusts the spec to what the prototypes showed, then writes the scope of every open slice at once. Usage - /fast-lane [feature]
disable-model-invocation: true
---

# Fast Lane

The alternative to running `/slice` for every slice: one interview for the whole feature, then all scopes at once. Afterwards `/implement <feature> all` can build every slice in one run.

Fits features whose slices are clear and need few technical decisions. For complex or risky features, `/slice` per slice keeps more overview; say so if the feature looks like that, the user decides.

Shared rules: [Rules for skills](../feature-structure/SKILL.md#rules-for-skills), only that section.

## 1. Check

- Find the feature (if unclear, ask). `specifications.md` and `roadmap.md` must exist; otherwise the next step is `/feature <feature>`.
- Fast-lane covers every slice that is `open` and has no `scope.md` yet. If slices already ran with `/slice`, it covers only the remaining ones; say so.
- Feature branch: create it or switch to it as in step 2 of [slice](../slice/SKILL.md), including the offer to update it from the default branch.

## 2. Interview

1. Collect the context: `specifications.md` and `roadmap.md` (here in full, all slices are planned together), "Left open" in `planning/interview/README.md`, from the last finished slice's `handoff.md` (if any) only "Notes for the next slice" and "Postponed", `ARCHITECTURE.md`, from `GLOSSARY.md` the terms of the area, ADRs in `docs/adrs/` that touch the area (pick them by title), and the code the slices will touch. On a restart: `implementation/interview/progress.md`.
2. **Decide as much as possible yourself.** Ask only what is important: real trade-offs that shape several slices, decisions the user sees or experiences, things that are hard to reverse. Everything else goes under "Decided by me".
3. Use the `interview` skill with the context. Topics come from what the open slices need together, e.g. structure, data, logic, UI, testing, glossary, ADRs. Its folder is `implementation/interview/`. If nothing important is open, there are no question rounds: show your decisions in the summary for confirmation, and the interview still writes its files, because builders and scopes rely on them.
4. **Prototypes only where they pay off:** add "build a prototype" as an answer option only when a decision can't be judged on paper *and* matters a lot (e.g. the core flow of the feature, the look of a central element). If the user picks it, use the `prototype` skill right after the round; its branch is `<feature>-proto-<topic>`. Questions that depend on it wait; the others go on.
5. **ADR candidates:** same criteria as in step 3 of [slice](../slice/SKILL.md). Agreed ADRs go into `implementation/interview/adrs.md`.

At the end, `interview` writes the decisions by topic into `implementation/interview/` and lets the user review them.

## 3. Spec, roadmap and ADRs

- **Spec:** if the interview or a prototype changed *what* the feature does (a behaviour, a function, an acceptance criterion), propose the changes to `specifications.md`. After the user's OK, apply them following [write-spec](../write-spec/SKILL.md), with an entry under "Changes" (date, reason, link to the interview topic file).
- **Roadmap:** if the cut of the slices changes (e.g. a prototype showed a slice is bigger than thought), propose it the same way; changes go under "Changes" in `roadmap.md`.
- **ADRs:** use the `write-adr` skill for the ADRs in `implementation/interview/adrs.md`, if there are any.

## 4. Scopes

- Recommend writing the scopes. Use the `write-scope` skill **only after the user explicitly confirms**, once per covered slice in roadmap order. Its interview files are `implementation/interview/`.
- **One review moment for all scopes:** list them with links and give the user time to read them. Adjust until the user is happy.
- The slices stay `open`; `implement` sets each one to `in progress` when it starts.
- Squash your own work-in-progress commits (e.g. before a prototype) and the new documents into one commit on the feature branch, e.g. `docs(<feature>): fast-lane plan`. Show the message first.

Next step for the user (full commands): `/implement <feature> all` to build every prepared slice in one run, or `/implement <feature> slice-<nn>` for the first covered slice only.
