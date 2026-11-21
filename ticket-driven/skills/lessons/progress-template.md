# Progress Templates

Two records, both created on first need with the skeletons below and updated after every lesson. Labels in the chat language of the session that creates them.

## `~/.claude/lessons/<project>/progress.md`

```markdown
# Lessons — <project>

Lessons: 0 · Current stage: 1 · Started: <date> · Last: <date>

## Stations

| Station | State | Lessons | Last result | Depth | Review due at lesson | Last |
|---|---|---|---|---|---|---|

## Explained Terms

<!-- comma-separated: the words lessons have already explained, so later ones don't repeat it -->

## Open Questions

<!-- one line each, newest first: the question · the date · the station it came up in -->

## Sessions

| Date | Lessons | Newly seen | Newly solid | Reviews passed |
|---|---|---|---|---|
```

Rules:

- **Lessons** counts every graded lesson and review of this project; *review due at lesson* is a value of that counter. A skipped lesson doesn't count.
- A station row appears with its first lesson; state is `seen` or `solid` (a station without a row is `new`). *Depth* is the deepest depth taught.
- *Current stage* is the lowest stage with a new station.
- *Sessions* gets one line per session, at its end — never rewritten, only appended.

## `~/.claude/lessons/stack.md`

```markdown
# Lessons — Stack Concepts

| Concept | State | Learned in | Last |
|---|---|---|---|
```

Rules:

- One row per concept slug (`<technology>/<concept>` or `general/<concept>`, see [curriculum.md](curriculum.md)); *Learned in* lists the projects, comma-separated.
- A concept becomes `seen` with the first lesson that teaches it, `solid` when a station teaching it is graded solid. It never falls back — a project's own use of it is that project's station.
