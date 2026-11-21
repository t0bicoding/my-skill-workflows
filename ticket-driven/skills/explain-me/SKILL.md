---
name: explain-me
description: Explains one thing — a code location, a codebase question, a ticket or a feature — as one one-screen card with the gist, one diagram, how it runs with line links, why it is built so (with sources) and what matters for a verdict. Read-only. Use for "explain me …", "what does … do", "how does … work", "what does this ticket change", walk-throughs and overviews. Not for external libraries (/research) or a learning path (/lessons).
---

A colleague at the whiteboard. The user wants to understand one thing well enough to judge it — before approving a spec, picking up a ticket, answering a review question, or just because a piece of code puzzles them. You give them the overview in one picture and a few sentences, from the code as it stands, and stop. More only when they ask for it.

## Terms

- **Target** — what is explained, one of four **kinds**: a **code location** (a file, a `path:line`, a function, the user's editor selection), a **question** (free text about how the project works), a **ticket** (a ticket file, or feature and number), a **feature** (a feature folder or its name).
- **Card** — the one fixed form every explanation takes, in [card-template.md](card-template.md).
- **Diagram** — exactly one picture per card, its form chosen from [diagrams.md](diagrams.md).
- **Depth** — 1 the overview (default) · 2 the mechanism underneath · 3 its tests, edge cases and the alternatives that were or weren't taken.

## Language

All labels in this skill and its templates are English. Write them in the chat language the project sets in `CLAUDE.md` / `AGENTS.md` (default: English); the signs (`🎯 🗺️ ⚙️ ❓ ⚖️ 🚫 ➡️ ✅ ◻ ⚠`) stay as they are. Code and identifiers stay as the project wrote them. Where the project has a domain vocabulary (`CONTEXT.md` or `CONTEXT-MAP.md`), the card uses its words.

## Ground Rules

- **The project stays untouched.** No file created, edited or deleted in the repository, no command with side effects (tests, builds, linters, installs, migrations), git only to read. No ticket, no commit, no note. The card lives in the chat; only `--page` writes, and only outside the project.
- **What the code does, not what it's meant to do.** The diagram and *How it runs* describe `HEAD`. What a spec or ticket planned stands as plan, marked as such. Conditions are written out in full: "if the fetch fails — whatever the reason —", not "if there is no value". Where plan and code disagree, say so under *For a verdict* — that's often what the user needs to know.
- **Never guess.** An origin you can't trace is "origin unclear"; a consequence you can't derive is "unclear whether …".
- **Short.** The card fits about one screen. Leave out every step, case or sentence that doesn't help the user judge the target. Depth is what `deeper` is for.
- **Explain, don't fix.** If you notice a real problem while reading, name it in one line under *For a verdict*, marked `⚠`, with the project's skill for it if one exists (`/quick`, `/hunt-bugs`, …) — never start it, never change code.

## The Sourcing Rule

A plausible reason nobody wrote down is believed like a fact — so every *why* carries its source: an ADR, a rule in `CLAUDE.md` / `AGENTS.md`, a spec or ticket passage, a commit message, a test whose name states the behavior, a code comment. A source counts only if it states the reason, not if it merely mentions the code. A reason without one is written as *not written down — probably …*. A project with no ADRs and no rules gets more of those, honestly marked; that is correct.

## Start

`/explain-me <target> [--deeper] [--page]`

1. **Recognize the target.**
   - A path, a `path:line`, a symbol name → *code location*. A symbol with several definitions → the one the user's open file or selection points at; otherwise ask.
   - A path into a feature's tickets, or a feature name plus a number → *ticket*.
   - A feature folder or a feature's name (open or under `closed/`) → *feature*.
   - Anything else → *question*.
   - No target given → the user's editor selection, if there is one; else ask.
   - Truly ambiguous ("locks" — the code, the feature, or the ADR?) → **one** question with two or three options, then go.
   - A question about an external library or tool, not this project's code → say that `/research` answers it, and stop.
2. **Read the project's frame** — once per session: `CLAUDE.md` / `AGENTS.md` (chat language, rules, where tests live), `CONTEXT.md` or `CONTEXT-MAP.md`, the ADR index if there is one. Use what exists, skip what doesn't, silently.
3. **Gather** per kind, below.
4. **Choose the diagram** from [diagrams.md](diagrams.md).
5. **Write the card** per [card-template.md](card-template.md), at the depth asked (1 unless `--deeper`).
6. With `--page`: *The Page*, below.

## Gather per Kind

Read only what the card needs; the user is waiting.

**Code location**
- The location and its surroundings in `HEAD`: the enclosing function, what it calls one level down.
- Its callers (search for the name), up to where its input comes in — usually a user's action, a request or a startup.
- The tests that would fail were it broken: search the test locations for its name or the route, hook or component that reaches it; read their few lines — a test that merely runs past it doesn't count.
- For *why*: the commits that shaped its lines (`git blame -L <start>,<end> <file>`, then `git show -s --format='%h %s%n%b' <hash>`), a code comment, a rule or ADR that names the area.

**Question**
- Narrow, answerable from a handful of files → find the files yourself, then gather as for a code location.
- Wide (spans layers or many files) → launch an `Explore` subagent (breadth `medium`) with the question; it returns the locations, you read the few that carry the answer. Never put its file dumps into the card.
- The answer is the card's *In one sentence*; the diagram shows the path that makes it true.

**Ticket**
- The ticket file: *What to build*, acceptance criteria, *Blocked by*, an implementation note if closed.
- The feature's `specifications.md` passages the ticket points to, and an ADR either names.
- **Open ticket** — the code locations it names, as they are in `HEAD`: the card shows *before → after* of what it will change, and what stays the same.
- **Closed ticket** — the commit that closed it (`git log --format='%h %s' -- <ticket path>`; the commit that moved it to `closed/`, and the commits before it with the ticket number in the message). The card shows what it changed, from `git show --stat` and the code in `HEAD` — a later ticket may have rewritten it.
- Tickets that block it or that it blocks, by number and title.

**Feature**
- Its `specifications.md` (goal, user stories, out of scope), the list of its tickets with status and `Blocked by`.
- **Not built yet** (all tickets open) → the plan: what it will let the user do, and the tickets as a dependency picture.
- **Built** (closed, or tickets closed) → launch the `cartographer` subagent if the project has one (`.claude/agents/cartographer.md`), with the commits that closed the feature's tickets; else gather the same yourself: trigger → steps → result, tests per step, what can't be walked back. Use its report for the card — the card stays shorter than the report.
- **Partly built** → the built part as above, the open tickets as what's still ahead.

## Depth

- **1 — overview.** The card as the template sets it.
- **2 — mechanism.** The same card, *How it runs* one level down: the functions inside the steps, the data handed between them, the branches the overview left out. The diagram may grow to the full step limit.
- **3 — guarantees.** The same card plus what pins it: tests per step (`✅` / `◻ no test`), edge cases and what happens in them, and the alternatives — ones the sources say were rejected, with their reason; ones nobody wrote down only if the user asks.

`deeper` after a card goes one depth further on the same target; 3 is the floor.

## After the Card

Close with the reply line from the template. The user may answer:

- **`deeper`** → the next depth on the same target.
- **a question** about the card or the code → answer it factually from `HEAD`, with links, in a few sentences — not a new card, unless the question names a new target.
- **a new target** → a new card.
- **`page`** → *The Page* for the card just shown.
- anything else → the conversation goes on normally; this skill has ended.

## The Page

`--page` (or `page`) builds the card as a standalone HTML page: the same sections, the diagram as an inline SVG instead of text art — useful for a feature, a wide flow, or a picture to keep beside the code.

- If the host can publish an HTML page (an Artifact tool or similar), follow its instructions — load its design skill first if it names one — write the page into the session's scratch directory, publish it and give the link.
- Otherwise write it to the system's temporary directory and give its path.
- Never inside the project. The page holds exactly what the card holds — no more detail, no code excerpts beyond what the card quotes.

## Next Steps

*Next* on the card names at most two follow-ups that fit the situation — only skills that exist in this project (`.claude/skills/`), never started by you:

| Situation | Follow-up |
|---|---|
| a feature whose spec still has open points | `/clarify-ticket`, `/brainstorming` |
| a spec that is settled but not cut | `/approval` |
| an open ticket the user understands now | `/implement` |
| built code nobody has judged | `/human-review` (or `--area` for standing code) |
| a factual question the card couldn't answer | `/research` |
| a problem noticed (`⚠`) | `/quick`, `/hunt-bugs` |
| the user wants to learn the area properly | `/lessons` |

None fits → leave the follow-up out; `deeper` and a question are always offered.
