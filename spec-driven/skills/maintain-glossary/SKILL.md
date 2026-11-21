---
name: maintain-glossary
description: Takes the terms from an interview's glossary.md (slice or one-shot) or other new terms into GLOSSARY.md or an area glossary and keeps GLOSSARY-MAP.md up to date. Used by close-slice and one-shot.
user-invocable: false
---

# Maintain Glossary

**Read:** `GLOSSARY.md`, `GLOSSARY-MAP.md`, and as source `interview/glossary.md` of the slice; in a one-shot `glossary.md` of its interview folder (`docs/interview/<topic>/`) or the new terms from the chat. Templates: [templates/glossary.md](templates/glossary.md), [templates/glossary-map.md](templates/glossary-map.md).

## Rules

- **Always English.**
- **Make a clear choice.** Several words for the same concept: pick the best, the others go under `_Avoid_`.
- **Short definitions.** One or two sentences: what the term *is*, not what it does.
- **Only domain terms of the project.** No general programming terms (timeouts, error types, helper patterns), even if the project uses them a lot.
- **Group** when natural groups emerge, otherwise a flat list.
- **Global or area:** project-wide terms go into the global `GLOSSARY.md` in the project root. An area (e.g. `src/billing/`) gets its own `GLOSSARY.md` only when it has terms that don't belong to the whole project; then list it under "Areas" in `GLOSSARY-MAP.md`.
- **Relationships:** if areas share terms, events or types, record it under "Relationships" in `GLOSSARY-MAP.md`.
- **Unclear area:** ask the user.
- **Changed meaning** ("Changed terms" in `glossary.md`): replace the definition, don't add to it.
- Remove the "nothing yet" note once the first real entry exists.

Show the changes briefly; apply them after the user's OK.
