# Lesson Files

Per lesson, the Lesson Writer writes three files into `next/`, named by lesson number: `lNN.md` (shown), `lNN.hint.md` (on request), `lNN.key.md` (after the answer). Labels in the chat language; signs unchanged.

## lNN.md

~~~~markdown
---
lesson: <NN>
station: <station slug from the map>
topic: <topic slug>
stage: <n>
depth: <1 | 2 | 3>
form: <exercise form>
review: <no | yes>
base: <HEAD commit hash the lesson was written from>
files: <repository-relative paths the lesson shows or relies on, comma-separated>
concepts: <stack concept slugs it teaches, comma-separated>
---
### 📘 <title — what happens here, in the user's words> · stage <n> <stage name> · depth <d>

**Where we are** — <one or two sentences tying this to stations already seen; prerequisites the user hasn't seen, briefed in two sentences>

```text
<small diagram of the components and the path through them, with ▶ at this station; the map's architecture diagram, cut to what matters here>
```

**The code** — [<path>:<from>-<to>](<path>#L<from>-L<to>)

```<language>
<from> │ <line, verbatim from HEAD>
   …   │ <… n lines left out — only where a cut keeps it on one screen>
 <to>  │ <line>
```

**What happens**

1. **L<n>** — <what this line or block does, conditions written out in full>
2. **L<n>–<m>** — <…>

**Why it's built this way**

- <reason> — *source: <ADR-NNNN title | CLAUDE.md › Rules › <label> | commit <short hash> "<subject>" | test `<name>` | comment at L<n>>*
- <reason> — *not written down — probably <…>*
- **Without it:** <what would go wrong, concretely, in the domain's words>

**Stack concept: <name>** — <two to four sentences on the general idea, valid outside this project; or, when `stack.md` has it solid: one line — "known from <project>: <one-sentence reminder>">

---
**🧩 Exercise · <form label>** — <the question>
<for trace: the lettered steps, one per line>

`<answer>` · `hint` · `idk` · `stop`
~~~~

Rules:

- **One screen.** About 30 lines of code at most; cut what doesn't serve the station.
- **Verbatim.** Code lines and their numbers exactly as in `HEAD`, so the user can lay the file beside the lesson.
- **Every reason sourced** — per the Sourcing Rule in [SKILL.md](SKILL.md). The source must say the reason, not merely mention the code.
- **Words explained once.** A technical or domain word the user may not know gets a few words in brackets where it first appears — unless it is in the explained terms the caller passes.
- **Depth.** 1: what this code does and why. 2: one level down — the functions it calls, the cases it handles, the branch not taken. 3: the tests that pin it, the edge cases, and the alternative the project didn't take and why.

### Review

A review is shorter: the title with `· review`, *Where we are* as one line with the station's link, then the exercise. After an *again* result, *Where we are* is a three-line recap instead. No new code beyond a line or two the exercise needs.

## lNN.hint.md

One or two lines: the direction — which line to look at, which case to think through, which folder to search — never the answer.

## lNN.key.md

```markdown
Form: <form> · Station: <slug> · Depth: <d>

Answer: <the answer, short>
Core points:
- <what an answer must contain, 1–3 points, each a few words>
Also accepted: <other right answers or phrasings that might look wrong, if any>
Evidence: <path:line — what in the code proves the answer>
Common miss: <the plausible wrong answer, and why it is wrong>
Take away: <one sentence the user should keep>
```

## Feedback

Shown right after the user answered, ending on the options line; then wait — the user decides what comes next.

```markdown
<✅ Solid | ◐ Half | 🔁 Again> · <station title>
**Answer:** <the key's answer> — <evidence, one sentence, with path:line>
<if the user gave the common miss:> <why it looks right and isn't>
<if the user's extra holds:> Your point holds too: <why> — counted.
<if the key was wrong:> The key was wrong here: <what the code really does> — graded by the code.
💡 <take away>
<on half or again:> 🔁 This comes back in <n> lessons.

`next` · `deeper` · <ask anything> · `stop`
```
