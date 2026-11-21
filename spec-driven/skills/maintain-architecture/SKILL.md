---
name: maintain-architecture
description: Keeps ARCHITECTURE.md up to date after a slice or one-shot - modules, data flow, key decisions. Used by close-slice and one-shot.
user-invocable: false
---

# Maintain Architecture

**Read:** `ARCHITECTURE.md`, the diff (the file list first, details only where the structure changed), the slice's interview topics about code structure (if any, see the interview `README.md`), new ADRs in `docs/adrs/`.

- Update only what changed: new or changed modules (one-line responsibility), the typical data flow, links under "Key decisions" to ADRs that concern the architecture.
- Add a section the first time it has real content (e.g. "Modules" once there is real code).
- It's a map, not documentation: 1–2 pages, no file-by-file listing.
- English.
- No structural change → no edit.

Show the changes briefly; apply them after the user's OK.
