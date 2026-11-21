# Map

`~/.claude/lessons/<project>/map.md` — the curriculum bound to one project. Built by the Lesson Writer on first start, refreshed station by station when code changes. Labels in the chat language.

## map.md

~~~~markdown
# Lessons Map — <project>

Built: <date> · Scan base: <HEAD hash at the last full or refresh scan> · Stack: <languages and frameworks>
Sources found: <what exists, e.g. README · CLAUDE.md · AGENTS.md · CONTEXT.md · docs/adr (29) · commit messages with bodies>
Skipped: <stage or topic — reason, e.g. "stage 5 ui-state — no user interface">

## Architecture

```text
<one overview diagram: the components, how they connect, where data lives — the base every lesson's diagram is cut from>
```

## Stations

### <NN> `<station slug>` — <title in the user's words>

Topic: `<topic slug>` · Stage: <n> · Prerequisites: <station slugs, or —>
Code: <path:from-to>, <path:from-to>
Sources: <ADR-NNNN, CLAUDE.md › Rules › <label>, commit <hash>, test `<name>` — or "none written down">
Concepts: <stack concept slugs>
Files: <repository-relative paths whose change makes this station stale>
Base: <commit hash the station was mapped at>
~~~~

Rules:

- **Station slugs** are the topic slug, or `<topic>-<qualifier>` when a topic has two stations (`write-path-upload`, `write-path-measurement`).
- **Order** of the stations is the learning order: by stage, inside a stage by prerequisites, then the station with the most domain meaning first.
- **One or two stations per topic** — the places where the topic is most visible and where a reason is written down; never a station that is pure glue.
- **Files** is what the lesson's truth depends on: the station's code, and the document a source lives in if it is part of the repository.
- An **ad-hoc station** (from `/lessons <path>`) is appended to its topic's stage with `(ad hoc)` after the title.

## Map View

Shown on `/lessons map`. Built from `map.md` and `progress.md`, never stored.

```markdown
### 🗺️ <project> · <seen>/<total> seen · <solid> solid · 🔁 <due> due

| Stage | Stations |
|---|---|
| 1 overview | ✅ purpose-and-parts · 👁 layout · ⬜ entry-point |
| 2 request-path | ⬜ component-boundary · ⬜ read-path · ⬜ write-path |
| … | … |

⬜ new · 👁 seen · ✅ solid · 🔁 review due · ⏳ being refreshed
Next: `/lessons <slug>` — <title>
```
