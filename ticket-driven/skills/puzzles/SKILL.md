---
name: puzzles
description: Code-review puzzles in the spirit of chess puzzles — rounds of short cases cut from the current project's real code, each a small change with one flaw to spot (a gamed test, a boundary slip, a broken house rule) or none at all, answered in a line, graded at once against a hidden key, with a puzzle rating that rises and falls and adapts the next puzzle. After every 10 rounds the user sees the series' tally and chooses to play on or stop. Adapts to the project's stack and rules and to the user's weak themes across sessions. Changes nothing in the project. Not a review of real changes (that's /human-review or the built-in /code-review).
disable-model-invocation: true
---

Like a chess puzzle: one position, one move to find, an instant verdict, the next position. Here the position is a small change from this project's code, and the move is the line where the reviewer has to stop it — or `ok` when nothing is wrong. You set the puzzles, keep the answer hidden until the user has played it, grade it at once, and move on. Speed and rhythm matter: a round is one short message from you and one short line from the user.

## Terms

- **Puzzle** — one small change (a diff of at most ~25 lines, numbered) with a one-sentence intent, as its author would state it. It has exactly **one answer**: the line of its flaw and the reason it is wrong — or `ok` for a **clean** puzzle. Its **theme** is a category from [catalog.md](catalog.md); its **puzzle rating** says how hard it is.
- **Key** — per puzzle, the answer line, the accepted reasons, the evidence, the heuristic, and the decoys. Written by the setter, read by you only after the user answered.
- **Decoy** — a line that looks suspicious but is correct. Clean puzzles live on them; harder puzzles carry them beside the flaw.
- **Heuristic** — the review question that catches a theme, in one sentence ("Would this test have failed before the fix?"). Shown with every miss; the ones the user misses are kept.
- **Rating** — the user's review rating, Elo-like, starting at 1000. It moves after every puzzle and decides how hard the next one is.
- **Series** — 10 rounds. After each series: the tally, then play on or stop.
- **Puzzle folder** — `~/.claude/review-puzzles/`, outside every project: `progress.md` (the user's record across projects and sessions), `series/` (the series in play) and `next/` (the next series, prepared in the background). It is the only place this skill writes.

## Language

All labels in this skill and its templates are English. Write them in the chat language the project sets in `CLAUDE.md` / `AGENTS.md` (default: English); the signs (`🧩 ✅ ◐ ❌ 🔥 💡 📈 📉 🏁 …`) stay as they are. `progress.md` follows the chat language of the session that created it. Code in a puzzle stays as the project wrote it.

## Ground Rule: the Project Stays Untouched

From the first round to the last, the repository stays byte-for-byte as it was: no file created, edited or deleted in it, no command with side effects (tests, builds, linters, installs), git only to read, no tickets, no commit. If the user notices a real problem in the project's code while playing, note it and name it at the end with the command that would handle it (`/quick`, `/hunt-bugs <area>`) — but write nothing.

## Start

`/puzzles [theme | group]`

Without an argument the series mixes themes by the user's record. With a theme or a group from [catalog.md](catalog.md) (`tests`, `boundary`, `house-rules`, …) every puzzle of the series comes from it.

1. **Read the record** — `~/.claude/review-puzzles/progress.md`; missing → create it with [progress-template.md](progress-template.md), rating 1000.
2. **Profile the project** — mechanically, without reading code: project name (repository folder), languages and frameworks from the manifests, test framework and where tests live, where `CLAUDE.md` / `AGENTS.md` rules and ADRs are, whether the history has fix commits (`git log --oneline -i -E --grep='^fix|bug|fehler' -n 30`). Keep it for the session; it goes to every setter.
3. **Reuse a prepared series** — if `next/` holds one for this project whose files are unchanged since it was built (`git diff --quiet <base commit> HEAD -- <its files>`), move it to `series/`. Otherwise empty both folders and *Plan the Series*.
4. Say in one line: project, rating, theme focus if any. Then the first puzzle.

## Plan the Series

Ten slots, each with a theme, a target rating, and whether it is clean:

- **Themes** — the focus, if given. Otherwise: themes never played first, in catalog order; then the lowest solve rates; ties to the theme played longest ago. At least three groups per series, and at least three slots from group `tests` unless the focus says otherwise. Skip themes the profile rules out (no database → no SQL injection). One or two slots from group `house-rules` when the project writes rules down.
- **Clean** — one or two slots, at positions drawn with `echo $((RANDOM % 10))`, so the user can't count on a flaw.
- **History** — when the profile found fix commits, one slot may be a real bug from the history (its theme is whatever the fix repaired).
- **Target ratings** — spread around the user's rating: two at −300, three at −100, three at +100, two at +300, rounded to 50; never below 400.

Launch two instances of the Puzzle Setter Subagent [puzzle-setter.md](../../agents/puzzle-setter.md) in one message, so they run in parallel — slots 1–5 and 6–10. Give each its slots, the project profile, the paths to [catalog.md](catalog.md) and [puzzle-template.md](puzzle-template.md), the target folder, and the files puzzles of this session have already used. Each returns only, per slot, the puzzle file, its theme, its rating and its files — never the answer.

While they build, say so in one line ("building 10 puzzles from <project> …").

## A Round

**Order.** Play the built puzzles adaptively, as a chess site does: after a solve, take the unplayed puzzle whose rating is the next above the user's current rating; after a miss, the next below. A clean puzzle is played in the round its drawn position names, whatever came before.

**Show** the puzzle with [round-template.md](round-template.md): the round number, the puzzle's rating, its intent, the numbered change inline as a code block — no file to open, the whole position on one screen — and the reply line. Read only `pNN.md`, never `pNN.key.md` before the user answered. Never name the theme before the answer: in chess it gives the move away, here too.

**The user answers** with a line number and a few words why (`L7 tolerance hides the wrong value`) — or `ok`.

- **`hint`** → read `pNN.hint.md` and give it: the region, never the line. A hinted puzzle scores at most half.
- **a question about the code** (what does this function do, who calls it) → answer it factually from `HEAD`. Whether a line is wrong is the puzzle: "That's your move."
- **`skip`** → a miss, revealed like one.
- **`stop`** → the round is not scored; go to *End the Session*.

**Grade** at once, against `pNN.key.md`:

- **solved ✅** — the key's line (or a line the key accepts) and a reason among its accepted reasons; for clean, `ok`.
- **half ◐** — right line, reason missing or wrong; or solved after a hint.
- **missed ❌** — wrong line, `ok` on a flawed puzzle, or a line on a clean one.

If the user's line is wrong but their reason names a real flaw the key doesn't list, check it against the code; if it holds, count it as solved and say so — the key was incomplete, not the user. If it holds for the *real* project code, note it for the end.

**Rate.** Score s = 1 / 0.5 / 0; expected E = 1 / (1 + 10^((puzzle − user) / 400)); new rating = user + 32 · (s − E), rounded. A missed puzzle that was far below the user's rating costs more than one far above it — that's the point.

**Reveal and move on, in the same message** ([round-template.md](round-template.md)): verdict, rating change, the theme, the answer line with one sentence of evidence and one of consequence, the heuristic on a miss or a half, the decoy explained if the user fell for it, the streak — then directly the next puzzle. No waiting for "next".

Update `progress.md` after every round — rating, theme row, streak — so a session that ends mid-series loses nothing.

**Prepare the next series.** After round 7, start *Plan the Series* again in the background (setters with `run_in_background`, target folder `next/`, target ratings around the current rating), so playing on starts at once. If the user stops, it stays in `next/` for the next session.

## After 10 Rounds

Show the series with [series-template.md](series-template.md): solved / half / missed, rating then and now, the best streak, the themes that went well and the ones that didn't, and the heuristics missed in this series. Add whatever the record shows across series: a theme missed again, a theme that now holds.

Then ask with the `AskUserQuestion` tool — one question, two options: **play on** (another 10 rounds, the prepared series, its themes leaning on what was just missed) and **stop**. If the tool isn't available, ask in one line with `weiter` / `stop` in the chat language. Play on → move `next/` to `series/` (waiting for the setters if they aren't done) and show round 1 of the new series.

## End the Session

On stop — after a series or mid-series: rating at start and now, rounds played, the session's heuristics to keep, the theme the record suggests next as a ready-to-paste command (`/puzzles <theme>`). Then, if any were noted, the real problems seen in the project, each with where it is and the command that would handle it. Empty `series/`; leave `next/` for the next session. Nothing to commit — the project was never touched.
