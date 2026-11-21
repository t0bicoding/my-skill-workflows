# Progress Template

`~/.claude/review-puzzles/progress.md` — the user's record across all projects. Created by the first session with the skeleton below; updated after every round. Labels in the chat language of the session that creates it.

```markdown
# Review Puzzles — Progress

Rating: 1000 · Best: 1000 · Puzzles: 0 · Best streak: 0 · Current streak: 0

## Themes

| Theme | Played | Solved | Half | Missed | Last played |
|---|---|---|---|---|---|

## Heuristics to Keep

<!-- one line each, newest first: the question · the theme · the dates it was missed -->

## Series

| Date | Project | # | Focus | ✅ | ◐ | ❌ | Rating |
|---|---|---|---|---|---|---|---|
```

Rules:

- A theme row appears when it is first played, slug as in [catalog.md](catalog.md); house-rule themes are prefixed with the project: `<project>/rule-<name>`. Clean puzzles count under the theme `clean`.
- Solve rate = (solved + half / 2) / played. Planning uses it; it is not stored as a column.
- *Heuristics to Keep* holds each question once; a second miss moves it to the top and adds the date.
- *Series* gets one line per finished or stopped series, rating at its end — never rewritten, only appended.
