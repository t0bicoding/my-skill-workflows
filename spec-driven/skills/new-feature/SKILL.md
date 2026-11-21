---
name: new-feature
description: Starts a new feature - agrees on a name with the user and creates docs/features/<feature>/planning/ with idea.md and idea-assets/.
disable-model-invocation: true
---

# New Feature

Shared rules: [Rules for skills](../feature-structure/SKILL.md#rules-for-skills), only that section.

## 1. Short interview

- **From the project roadmap:** if `ROADMAP.md` exists and no feature is named, read its feature table (only the table) and propose the next one: status `idea`, horizon `now` (otherwise `next`), all dependencies `done`. Its roadmap name is the feature name. The user may pick another entry or something new.
- Otherwise ask what the feature is about, in one or two sentences, unless the chat already says it, and propose a feature name: kebab-case, short, descriptive (e.g. `user-login`). The user decides.
- Check that the name is not taken in `docs/features/` or `docs/features/closed/`.

## 2. Create the folder

Work on the default branch (switch if needed, see "Right branch first" in [feature-structure](../feature-structure/SKILL.md#rules-for-skills)).

```
docs/features/<feature>/planning/
  idea.md
  idea-assets/.gitkeep
```

- `idea.md`: a small placeholder, e.g.
  ```
  # {Feature title}

  Describe your idea here, in any form. Put screenshots, sketches or other material into [idea-assets/](idea-assets/).
  ```
  If the user already described the idea in the chat, offer to put their text in verbatim. If the feature comes from `ROADMAP.md`, offer to add a link to its entry (`../../../../ROADMAP.md#<feature>`).
- `idea-assets/`: empty (only `.gitkeep`).
- **Project roadmap:** use the `maintain-roadmap` skill (feature folder created). A feature that is not in `ROADMAP.md` yet gets a row there.

The planning interview of `/feature` adds `interview/` later.

`idea.md` and `idea-assets/` belong to the user. Skills read them, never change them.

## 3. Finish

- Offer a commit on the default branch: `docs(<feature>): add feature` (with the change to `ROADMAP.md`).
- Next step for the user: write the idea into `idea.md`, then run `/feature <feature>` (with the real name, e.g. `/feature user-login`).
