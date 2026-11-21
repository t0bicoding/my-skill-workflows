---
name: review-maintainer
description: Maintains docs/workflow/must-read-zones.md, the code areas whose every change the user reads as a raw diff in /human-review — checks zones against today's tree, repairs stale paths, asks about new candidates. Called by /human-review; can be run by hand.
---

The spotters inside `/human-review` decide where the user looks — what they miss, the user doesn't see either. A must-read zone takes that choice away from them for the few places where a miss is expensive: every change there is read by the user, in full, as it is. This skill keeps that list true for today's code and short enough to stay worth reading, and never lets the list grow or shrink without the user's word.

## Terms

- **Must-read zone** — a code area, given by path globs and/or line patterns, whose every change the user reads as a raw diff in `/human-review`. It earns its place only if both hold: a miss there is expensive (data loss, a wrong stored result, something hard to reverse, a broken trust chain), and its diffs are typically small enough to read in full.
- **Zone file** — `docs/workflow/must-read-zones.md`, the one list of zones. `/human-review` reads it; only this skill writes it.
- **Zone candidate** — a suggestion for a new zone or for widening an existing one, handed in by `/human-review` or named by the user, with the evidence that prompted it.
- **Declined** — a candidate the user turned down, kept in the zone file so the same suggestion isn't asked again without new evidence.

## Language

This skill is written in English. The zone file is written in the documentation language set in `CLAUDE.md`/`AGENTS.md` (default: English) — its headings, column names and prose alike; globs and patterns stay as they are. Talk to the user in the chat language set there.

## Structure

<zones-template>

# Must-read zones

<One or two sentences: every change in a zone below is read by the user as a raw diff in `/human-review`, before the spots; maintained by `/review-maintainer`.>

| Zone | Paths | Patterns | Why | Rule |
|---|---|---|---|---|
| <short name> | `<glob>`, `<glob>` | `<regex>` | <what a miss costs, one line> | <pointer to a rule or ADR, or —> |

## Declined

- <YYYY-MM-DD> · `<glob or regex>` — <the user's reason, in a few words>

</zones-template>

- **Paths** — repo-relative globs in git pathspec glob syntax (`**` crosses folders), comma-separated, each in backticks. A changed file matches if it matches any of them. `—` if the zone has none.
- **Patterns** — extended regular expressions, each in backticks, matched against the **added and removed lines** of a diff (`git show -G`). `—` if the zone has none.
- A zone with only Paths matches any change to those files; with only Patterns, any changed line that matches, anywhere; with both, a changed line that matches inside those files — that narrows a broad area (all tests) to what matters (their assertions).
- **Rule** points at a standing rule or ADR that already gives the reason — a rule label, an ADR file — instead of restating it. One place per fact.
- **Keep it short.** Aim for no more than eight zones. Past that the user reads nearly everything again, and the point of zones — reading a little, fully — is gone.
- Leave **Declined** out while it's empty.

## Modes

Every run does **Check**. Then, depending on what it was given:

- called by `/human-review` with candidates → **Candidates**;
- called by `/human-review` without candidates → nothing more;
- run by hand with a suggestion from the user ("always read X") → that suggestion is a candidate → **Candidates**;
- run by hand, or called by `/human-review`, while the zone file doesn't exist → **Seed** instead of Check.

## Check

For every zone, against today's tree:

1. **Each path glob** — `git ls-files -- ':(glob)<glob>'`. No file → stale.
2. **Each pattern** — `git grep -nE -e '<regex>'`, limited to the zone's paths if it has any. No hit → stale-suspect: the pattern may be waiting for code that doesn't exist yet, so it is never repaired or removed without asking.
3. **The rule reference** — the rule label still exists in `CLAUDE.md`/`AGENTS.md`, the ADR file still exists and isn't marked superseded.

Repair only where the successor is certain:

- **A glob gone by rename** — `git log -1 -M --diff-filter=R --name-status --format= -- ':(glob)<glob>'` shows the files that last left the glob; if they were all renamed to one new place, rewrite the glob to cover it. That's mechanical; report it.
- **An ADR superseded** — point to the ADR it names as its successor; report it.
- **A rule label renamed** — only if exactly one label in the same rule group covers the same subject; otherwise ask.

Everything else stale — a glob whose files were deleted, a pattern that matches nothing, two candidate successors — goes to the user as a question with options, one of which is what the file says today:

```
⚠ <zone> · <glob/regex/rule> matches nothing today
A: keep as it is (code may come back) · B: <proposed replacement> · C: remove from the zone
```

A zone left with neither paths nor patterns is removed only on the user's word. **Never remove a zone, a path or a pattern without the user's word.**

Then check the list as a whole: two zones covering the same files → offer to merge them; more than eight zones → say so once.

## Candidates

Each candidate comes with its evidence — from `/human-review`, the spot or finding that prompted it: location, kind, severity, verdict, and whether a spotter reported it or the user found it themselves. Before showing it:

1. **Already covered?** Run the candidate's location through the existing zones as `/human-review` would. Covered → drop it and tell the user in one line which zone already covers it. Next to an existing zone (same folder, same concern) → propose **widening** that zone instead of a new one.
2. **Declined before?** Matches an entry under Declined → show it only if the new evidence is stronger than when it was declined (a finding the spotters missed, or severity Data loss), and quote the earlier reason. Otherwise drop it and say so in one line.
3. **Earns its place?** Both conditions of a must-read zone must hold. A candidate whose files change in large diffs is better served by a sharper spotter — say so, and propose it anyway only if the user asked for it by hand.
4. **Draft the row** — the narrowest globs that cover the evidence and the code that will plausibly change with it; a pattern only where a path would catch far too much; Why as what a miss costs; Rule as a pointer if one exists.

Show all remaining candidates in one message, numbered, each with its row, its evidence and the question:

```
🧭 <n>. <zone name> — <new zone | widens "<zone>">
   | <Zone> | <Paths> | <Patterns> | <Why> | <Rule> |
   Evidence: <location> · <kind> · <severity> · <reported by the spotter | found by you>
   Belongs on the list?  A: yes, as drafted · B: yes, changed: … · C: no, because: …
```

The user answers per candidate (`1 A, 2 C <reason>`). A → add the row. B → add it with their changes. C → add the candidate's globs or pattern to Declined with today's date and their reason (ask once for a reason if none was given; "none" is an answer). A candidate the user doesn't answer is dropped without a trace — it will come back with the next evidence.

## Seed

When the zone file doesn't exist, propose a first set — never more than eight zones — drawn from what the project already says is expensive to get wrong:

- the standing rules in `CLAUDE.md`/`AGENTS.md` and its subtree files, and the ADRs under `docs/adr/`, wherever they guard stored data, deletion, persistence paths, identity or permissions, concurrency, or a trust chain (signing, updates);
- schema migrations, wherever the project keeps them;
- test files, narrowed by a pattern to their assertions — a weakened test is the change an AI reviewer that wrote it is least likely to flag.

Draft each zone as in *Candidates* step 4, with globs checked against today's tree before they are shown, and ask the same way. Then write the zone file with the accepted rows. If the user accepts none, write it anyway with an empty table — the file's existence says the question was asked, so later runs check instead of seeding again.

## Final Step

Report in a few lines: what was repaired and why, what the user decided on stale entries and candidates, what was added or declined. If nothing needed a change, say so.

Called by another skill, leave committing to it — it stages the zone file with its own work. Run by hand, commit the zone file alone on the current branch, staged by path; the user may be working elsewhere in the tree. Never push — pushing is the user's call alone.
