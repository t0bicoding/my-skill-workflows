---
name: implement
description: Implement a specific ticket or a set of tickets.
disable-model-invocation: true
---

## Preparation

/implement <Featurename NN | NN-NN | all> [--after <predecessor feature> [--max-wait <duration>]]
If the user hasn't written the feature name and feature number then ask the user.

Implementation tickets live in `<feature folder>/tickets/implementation/`. Build them in blocking-edge order: a ticket only starts once every ticket in its "Blocked by" is closed.

If `--after` is given, finish "Waiting for a predecessor" below before reading any ticket.

## Waiting for a predecessor (`--after`)

`--after <predecessor feature>` queues this run behind another feature whose `/implement` is running in a different chat, so the user can line up several features without watching for each to finish. A chain is just each run naming its direct predecessor. Without `--after`, skip this section.

1. **Resolve the predecessor's folder**: `<features dir>/<predecessor>/` or, once closed, `<features dir>/closed/<predecessor>/`. If neither exists, stop and report it (most likely a typo). Never wait on a folder that doesn't exist.
2. **"Done" means**, checked from the repository alone, with no queue file or other shared state:
   - the folder sits under `closed/`, or
   - its `tickets/implementation/closed/` holds at least one ticket, no ticket file sits directly in `tickets/implementation/` any more, **and** `git status --porcelain -- <predecessor folder>` is empty, so the commit of its last ticket has landed.

   Check only the predecessor's folder, never the whole working tree: unrelated uncommitted files would otherwise block the wait forever.
3. **Already done** → say so and start right away.
4. **Otherwise wait in a background shell loop**, never by polling in your own turns: every turn re-reads the whole context, while a background command costs nothing until it returns. Check every 3 minutes. If the harness caps how long a background command may run, give the loop its own deadline just below that cap and restart it whenever it returns without the predecessor being done, keeping a running total against `--max-wait`. Before the first wait, tell the user what you're waiting on and until when at the latest.
5. **Upper bound**: `--max-wait` (e.g. `6h`, `90m`), default `12h`. If it runs out, stop without building anything and report how far the predecessor got: which of its tickets are still open, whether its folder has uncommitted changes. A predecessor stuck on a question or a failing review is the usual cause.
6. **While waiting, read nothing else**: no tickets, no code. Whatever you read now goes stale and sits in the context for the whole build. Once the predecessor is done, start at "Process" with a fresh read of the tickets.

A loop sketch in POSIX sh. Adapt the paths, and give the deadline in seconds:

```sh
pred="<features dir>/<predecessor>"
deadline=$(( $(date +%s) + <seconds> ))
is_done() {
  [ -d "<features dir>/closed/<predecessor>" ] && return 0
  ls "$pred"/tickets/implementation/closed/*.md >/dev/null 2>&1 || return 1
  ls "$pred"/tickets/implementation/*.md >/dev/null 2>&1 && return 1
  [ -z "$(git status --porcelain -- "$pred")" ]
}
until is_done; do
  [ "$(date +%s)" -ge "$deadline" ] && { echo "still waiting"; exit 1; }
  sleep 180
done
echo "predecessor done"
```

## Process

Take each ticket one at a time.
Every ticket is built by a subagent and then reviewed by another subagent.
Your job is to orchestrate each subagent and read its reports.

## Build Subagent

Read the ticket's `Model` field and use it for the Build Subagent. `/approval` sets this field together with the user, so the choice is normally already made.

If the field is missing or empty — e.g. a ticket from `/hunt-bugs`, which skips `/approval` — judge the complexity yourself:

- **haiku** — mechanical, narrow-risk work: one expand/migrate/contract batch, a rename, a config change, a ticket whose "What to build" is one clear sentence with few Implementation Decisions.
- **sonnet** (default) — a typical tracer-bullet slice touching a few layers with ordinary logic.
- **opus** — high ambiguity or risk: many Implementation Decisions, cross-cutting changes, tricky concurrency or data-shape work, or anything you'd hesitate to hand to a junior dev unsupervised.

When unsure, default to sonnet rather than guessing at the extremes.

Then read the ticket's `Effort` field — how much reasoning the Build Subagent spends, independent of the model. `/approval` sets it together with the user as well. If it is missing or empty, judge it yourself:

- **Medium** — the ticket spells out the path and the work is following it: a rename, a migrate batch, a slice that copies an existing pattern.
- **High** (default) — the builder has to make ordinary design calls along the way.
- **Extra High** — correctness hinges on thinking through cases the tests may not catch: concurrency, locking, migrations on live data, deletion cascades, several interacting Implementation Decisions.

The Agent tool can override a subagent's model but not its effort — effort comes from the agent definition's frontmatter. So the effort picks the agent type:

| Effort     | Agent type          |
| ---------- | ------------------- |
| Medium     | `implementer-medium` |
| High       | `implementer`        |
| Extra High | `implementer-xhigh`  |

Use that Build Subagent (all three follow [implementer.md](../../agents/implementer.md)), overriding its model with the chosen model. Say which model and effort you launched it with.
Give it a clear implementation task based on the current ticket. The ticket is its source: point it at the ticket file, and name further documents (spec, ADRs, clarification tickets, probes) only by the section the ticket refers to — never as reading to do up front. Whatever the builder reads stays in its context for every later step.
If the ticket has an `E2E scenario` section, point the Build Subagent at it and at the project's "E2E" section in CLAUDE.md/AGENTS.md — never hand it a command yourself. A ticket without that section (e.g. from `/hunt-bugs`) names no scenario. Without the section: no E2E step, no question, no hint.
Never ask the Build Subagent for the full E2E suite or list it among its gates — it runs the single scenario only; `/close-feature` runs the full suite once as the final proof.
Let it report when it's done.
When it's done, check the implementation with the reviewer subagents.

## Reviewer Subagents

Launch two instances of the Reviewer Subagent [reviewer.md](../../agents/reviewer.md) **in parallel**, via the Agent tool — one told to review the **Standards** axis, one the **Spec** axis — each given the current ticket and the diff to check. Let both report, then present their findings under `## Standards` and `## Spec` headings, verbatim or lightly cleaned. Don't merge or rerank findings across axes; see [reviewer.md](../../agents/reviewer.md) for why.

If either axis reports findings, send them back to the Build Subagent to fix, then review again (both axes).
When both report clean, mark the ticket closed, move its file from `tickets/implementation/` into `tickets/implementation/closed/` (create the folder if it doesn't exist), and repeat on the next ticket.
Commit after every ticket on the current branch. Never push — pushing is the user's call alone.

## Final Step

If all tickets are done then report the result to the user.
End the report with a **Numbers, facts, data** block (see below).
Give them the ready-to-paste commands for the next chat: optionally `/human-review <feature>` first — it walks them through the spots of the feature where a human's judgment adds value — then `/close-feature <feature>`.

### Numbers, facts, data

A short table that lets the user judge the run without reading the diff. Every number comes from a command or a report of this run — never estimated; what you can't measure, leave out. Before the first ticket starts, note `HEAD` as the base commit.

- **Fixed rows:**
  - Tests before → after: *before* is the test count each builder collects before its first change, without running the suite (the runner's collect/list mode, e.g. `pytest --collect-only -q`, `npx vitest list`); *after* comes from its last full run of each affected suite (a drop needs a named reason).
  - Reviews: rounds per ticket and findings per axis.
  - Diff size from the base commit, split into production and test code (`git diff --numstat -M <base> HEAD`, only the paths the tickets touched).
  - Commits with their short hashes.
- **Per ticket, a target measure** when the ticket names a goal checkable in code (an acceptance criterion like "Goal reached (checkable in the diff)"): count the thing it names at the base commit and at `HEAD` — props of a component, duplicated lines, import edges between two areas, test cases in a file. Diff size alone is not a target measure.
- If counting shows a claim from the report went too far, correct the claim in the same report.
