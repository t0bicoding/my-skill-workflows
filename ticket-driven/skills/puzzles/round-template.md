# Round

One message per round: the reveal of the last puzzle (from round 2 on) and the next puzzle, so the user never has to ask for it. Labels in the chat language; signs unchanged. Short — the rhythm is the point.

## Reveal

```markdown
<✅ Solved | ◐ Half | ❌ Missed> · rating <old> → <new> (<+n | −n>) · 🔥 <streak, only from 3 on>
**<theme slug>** · answer L<n>: <evidence, one sentence> — <consequence, one sentence>
<on half or miss:> 💡 *<heuristic>*
<if the user named a decoy:> L<n> was a decoy: <why it's correct>
<if a valid extra counted as solved:> Your line holds too: <why> — counted as solved.
```

For a clean puzzle: `answer ok — nothing to stop here.` and, on a miss, why the line the user named is correct.

## Puzzle

```markdown
---
### 🧩 <round>/10 · rating <puzzle rating>

**Intent:** <from pNN.md>
<context line, if pNN.md has one>

<the diff block from pNN.md, verbatim>

`L<n> <why>` · `ok` · `hint` · `skip` · `stop`
```

Rules:

- Never the theme, never whether the puzzle is clean, never a count — all of that is the answer.
- The diff block is copied verbatim from `pNN.md`; never retype or shorten it, the numbers are what the user answers with.
- A history puzzle gets one line under the intent: `Real commit from this project's history.`
