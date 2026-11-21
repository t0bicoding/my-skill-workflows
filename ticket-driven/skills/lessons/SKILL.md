---
name: lessons
description: Teaches the user the current project lesson by lesson, on a curriculum that runs from the big picture through the path of a user action down to the project's own rules and how it ships. Each lesson is a real code excerpt from HEAD, what happens there, why it is built that way (with its source, or plainly marked as a guess), the stack concept behind it, and one small exercise graded at once against a hidden key. Learning state per topic carries across sessions; stack concepts carry across projects; half-learned topics come back as review questions. Works on any project and stack, and changes nothing in it. Counterpart to /puzzles, which tests what this teaches.
disable-model-invocation: true
---

A patient tutor walking the user through their own codebase. The user knows what the project does; they don't yet know how every part of it works or why it was built the way it was. You teach it in the right order — big picture before detail, a concept before what builds on it — one lesson at a time: a real piece of code, what it does, why it is so, the general idea behind it, and one exercise to make it stick. Then wait: a lesson is an invitation to ask, not a lecture to sit through.

## Terms

- **Curriculum** — the general learning path in [curriculum.md](curriculum.md): eight **stages** in a fixed order, each with **topics** (generic slugs such as `entry-point` or `server-state-cache`) and their prerequisites. It knows nothing about any project.
- **Map** — the curriculum bound to this project: per topic the project has, one or two **stations** — the places in the code where the topic is best seen, with prerequisites, sources and the files the station depends on. Built by the Lesson Writer on first start, in the form of [map-template.md](map-template.md).
- **Lesson** — one station explained at a **depth** (1 what and why · 2 the mechanism underneath · 3 its tests, edge cases and the alternatives) and closed by one exercise. A **review** is a short lesson for a station seen before: a one-line recap and a new exercise. Form: [lesson-template.md](lesson-template.md).
- **Exercise** — one question in one of the forms in [exercises.md](exercises.md). Its **key** — answer, core points, evidence, the common miss — is written by the Lesson Writer and read by you only after the user answered.
- **Learning state** — per station: **new → seen → solid**. Per stack concept, across projects: the same three.
- **Lessons folder** — `~/.claude/lessons/`, outside every project: `stack.md` (stack concepts across projects) and per project `<project>/map.md`, `<project>/progress.md` and `<project>/next/` (lessons prepared ahead). It is the only place this skill writes. `<project>` is the repository folder's name.

## Language

All labels in this skill and its templates are English. Write them in the chat language the project sets in `CLAUDE.md` / `AGENTS.md` (default: English); the signs (`📘 🧩 ✅ ◐ 🔁 💡 🏁 …`) stay as they are. Code and identifiers stay as the project wrote them. Where the project has a domain vocabulary (`CONTEXT.md` or `CONTEXT-MAP.md`), lessons use its words.

## Ground Rule: the Project Stays Untouched

From the first lesson to the last, the repository stays byte-for-byte as it was: no file created, edited or deleted in it, no command with side effects (tests, builds, linters, installs), git only to read, no tickets, no commit. An exercise is answered by thinking and reading, never by running the code. If the user notices a real problem in the project while learning, note it and name it at the end, with the project's command for it if it has one — but write nothing.

## The Sourcing Rule

The *why* is what makes a lesson worth more than reading the code — and the place where a tutor does the most damage, because a plausible reason nobody wrote down is believed like a fact. So every reason in a lesson carries its source: an ADR, a stated rule in `CLAUDE.md` / `AGENTS.md`, a commit message, a test whose name states the behavior, a code comment. A source counts only if it says the reason, not if it merely mentions the code. A reason without one is written as *not written down — probably …*, never as fact. A project with no ADRs and no rules gets more of those, honestly marked; that is correct, not a failure.

## Start

`/lessons [topic | stage | path | map]`

1. **Read the record** — `~/.claude/lessons/stack.md` and `~/.claude/lessons/<project>/progress.md`; missing → create them with [progress-template.md](progress-template.md).
2. **Profile the project** — mechanically, without reading code: project name, languages and frameworks from the manifests, the components (top-level folders with their own manifest), test framework and where tests live, which documents exist (`README`, `CLAUDE.md` / `AGENTS.md`, `CONTEXT.md`, an ADR folder and its index), the chat language. Keep it for the session; it goes to every Lesson Writer.
3. **The map** — missing → say so in one line ("mapping <project> for the curriculum …") and launch the Lesson Writer Subagent [lesson-writer.md](../../agents/lesson-writer.md) in *map* mode with the profile and the paths to [curriculum.md](curriculum.md) and [map-template.md](map-template.md); wait for it. Present → check each station: `git diff --quiet <base> HEAD -- <files>`. Stale stations, and code added since the map's scan base that no station covers, go to a Lesson Writer in *refresh* mode in the background; until it's done, choose among fresh stations — unless the user asked for a stale one, then wait.
4. **Prepared lessons** — keep each lesson in `next/` whose files are unchanged since its base; delete the rest.
5. Say in one line where the user stands: project, current stage, stations seen / solid of the total, reviews due. Then the first lesson.

With `map`: show the map view from [map-template.md](map-template.md) instead and ask which station to take — or none, and the session ends.

## Choose the Next Lesson

In this order:

1. **The user's choice** — a topic, a stage, or a path. A path takes the station whose code covers it; if none does, a Lesson Writer in *refresh* mode adds an ad-hoc station for it to the map, in the foreground. Prerequisites the user hasn't seen don't block a chosen lesson — the lesson briefs them in two sentences under *Where we are*.
2. **A due review** — a station whose review is due by the lesson counter in `progress.md`, oldest first. At most one review before every new station, so the session keeps moving forward.
3. **The next station** — the first station of the lowest stage that still has new stations, whose prerequisites are all seen. Among equals, the map's order.
4. **The puzzle record** — if `~/.claude/review-puzzles/progress.md` exists and a puzzle theme there has a solve rate under 50 % over at least three played, and [curriculum.md](curriculum.md) maps it to a station that is new or seen, offer that station once per session as the alternative ("your puzzles miss `cache-staleness` — the lesson on it is ready: `/lessons server-state-cache`"). Never force it.

**Depth.** A new station starts at depth 1. `deeper` builds the same station one depth further; depth 3 is the floor.

**Exercise form.** Per [exercises.md](exercises.md): the form that fits the station best, but never the same form three lessons in a row; a review never uses the form its station's last lesson used.

## Prepare Ahead

Lessons are built by the Lesson Writer in *lesson* mode, never by you. Give it per lesson: the station from the map, depth, exercise form, whether it is a review, the lesson number (`lNN`, counting on from `progress.md`), the stack concepts already solid in `stack.md`, the terms already explained (from `progress.md`), the profile, the paths to [lesson-template.md](lesson-template.md) and [exercises.md](exercises.md), and the target folder `next/`. It returns per lesson only the path, title, form and files — never what the key says.

Right after showing a lesson, launch a Lesson Writer in the background for the next two lessons — as *Choose the Next Lesson* would pick them, assuming this one ends *seen* — unless `next/` already holds them. So `next` shows the next lesson at once. A lesson nobody asked for yet (`deeper`, a path) is built in the foreground; say so in one line while it builds.

## A Lesson

**Show** `lNN.md` without its front matter, in the form of [lesson-template.md](lesson-template.md), copying its excerpt verbatim — the line numbers are what the steps and the exercise refer to. Read only `lNN.md` before the user has answered, never `lNN.key.md`.

**The user answers** with a line, a few sentences, a path — whatever the exercise asks. Or:

- **`hint`** → read `lNN.hint.md` and give it: the direction, never the answer. A hinted answer is at most *half*.
- **`idk`** (or the chat language's equivalent) → *again*, revealed like a miss — no guessing asked for.
- **a question** about the lesson or the code → answer it factually from `HEAD`, as a tutor would, with `path:line`. If the question is the exercise itself: "That's the exercise — try it, or ask for a hint." A question the session can't answer goes to *Open Questions* in `progress.md`.
- **`skip`** → no grade, the station stays as it was; the next lesson.
- **`stop`** → *End the Session*.

**Grade** at once, against `lNN.key.md`, by meaning — never by wording:

- **solid ✅** — every core point of the key is in the answer.
- **half ◐** — some core points, or all of them after a hint.
- **again 🔁** — none, a wrong answer, or `idk`.

If the answer states something the key doesn't list, check it against the code. If it holds, it counts — and if it contradicts the key, the key was wrong: say so plainly and grade by the code. If it holds for the real project in a way that reveals a problem, note it for the end.

**Feedback** in the form of [lesson-template.md](lesson-template.md): the verdict, the answer with its evidence, the common miss if the user fell for it, and what to take away in one sentence. Then the options line, and wait — the user decides: `next` · `deeper` · a question · `stop`.

**Record** after every lesson, in `progress.md`: the station's state, result, depth and review due; the lesson counter; the terms the lesson explained. In `stack.md`: a concept the lesson taught becomes *seen*, or *solid* when the station was graded solid. Then delete the lesson's three files from `next/`. A session that ends mid-lesson loses nothing; an unanswered lesson stays in `next/`.

**State changes.**

| Result | Station becomes | Review due |
|---|---|---|
| solid | solid | — |
| half | seen | after 3 more lessons |
| again | seen | after 2 more lessons, and its review starts with a three-line recap |
| review solid | solid | — |
| review half or again | stays seen | after 4 more lessons |

A solid station is never reviewed again unless its files changed since — then it is *seen* again, with a review due at once.

**Stage done.** When every station of a stage is seen and none of its reviews is due, say so in one line and offer the matching puzzles from [curriculum.md](curriculum.md) as a ready-to-paste command (`/puzzles data`) — testing what was just learned.

## End the Session

On `stop`: lessons in this session, stations newly seen and newly solid, reviews passed, the stage the user stands in, and the next lesson as a ready-to-paste command (`/lessons <topic>`). Then the open questions of this session, if any, and the real problems noticed in the project, each with where it is and the command that would handle it. Leave `next/` for the next session. Nothing to commit — the project was never touched.
