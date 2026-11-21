# Puzzle Files

Per slot, the Puzzle Setter writes three files into its target folder, named by slot: `pNN.md` (shown), `pNN.hint.md` (on request), `pNN.key.md` (after the answer).

## pNN.md

~~~~markdown
---
slot: <NN>
rating: <puzzle rating>
base: <HEAD commit hash the puzzle was cut from; for history: the introducing commit>
files: <repository-relative paths the puzzle shows, comma-separated>
---

**Intent:** <one sentence, as the change's author would say it — believing it is right>
<optional, at 1700 and up or for duplicate-helper / untouched-caller: one context line — "`fn()` in path:line already does …", "Rule: …", "Called from …">

```diff
@@ <repository-relative path> @@
   1 │ <context line>
-  2 │ <removed line>
+  3 │ <added line>
   4 │ <context line>
@@ <second path, if any> @@
   5 │ …
```
~~~~

Rules for the change:

- **Numbering** — every line, removed ones too, numbered from 1 through the whole puzzle; file headers are not numbered. The sign comes first so the editor colors it; then the number, padded; then `│`. The user answers with these numbers.
- **Size** — as the rating band in [catalog.md](catalog.md) allows; never more than ~25 numbered lines. Cut to the lines the puzzle needs, with two or three context lines around each hunk.
- **Real code** — context lines verbatim from `HEAD` (history: from the introducing commit's parent); added lines in the project's style, plausible enough to compile and pass its linters.
- **No tell** — no comment pointing at the flaw, no odd formatting, no name like `tmp` or `hack` around it.

## pNN.hint.md

One line: the region to look at — a range of lines or "the test" / "the condition" — never the line itself.

## pNN.key.md

```markdown
Theme: <slug> · Clean: <yes | no> · History: <no | introducing <hash>, fix <hash>>
Source: <the real file(s) and function(s) the puzzle was cut from>

Answer: L<n>   (also accepted: L<n>, … — only lines that show the same flaw)
Accepted reasons: <what counts as naming it — the consequence or the broken rule, in a few words each>
Evidence: <one sentence: what in the shown lines, or in the context line, proves it>
Consequence: <one sentence: who gets what wrong, in the domain's words>
Heuristic: <the theme's question from catalog.md, or a sharper one for this case>

Decoys:
- L<n>: <looks like which theme> — <why it's correct>
```

A clean key has `Answer: ok`, no reasons, and its decoys. The key must be unambiguous: if two good reviewers could argue whether the answer line is wrong, or whether another line is just as wrong, rework the puzzle.
