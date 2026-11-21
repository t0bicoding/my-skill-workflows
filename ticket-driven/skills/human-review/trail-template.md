# Trail Template

The review trail `<feature folder>/human-review.md` is the lasting record of a feature's human
review. A second run reads it to review only tickets not yet listed; an interrupted run resumes at
its first `open` spot; `/close-feature` reads it for its summary line. It moves with the feature
into `closed/`.

## Rules

- One section per run, newest last; earlier runs are never rewritten, except their open spots'
  verdicts when that run is resumed.
- **Tickets reviewed** by file name, never by commit hash — names survive a rebase, hashes don't.
- Write the run before the overview is shown, with every spot `open`; update it after every
  verdict.
- **Spot** is the spot's name as the walk showed it.
- **Question** holds all the spot's questions, numbered when there are several, each with its
  options in brackets, A being today's (`(A today: … · B: … · C: …)`); a try-it is
  recorded as its question "Which value feels right?" with the values tried.
- **Must-read** lists every zone the run hit, by the zone file's name, with its files and a verdict:
  `open`, `read`, `skipped`, `finding → ticket NN`. Leave the table out when no zone was hit.
- **Zone candidates** — one line each: what was proposed to `/review-maintainer` and what the user
  decided (`added`, `widened <zone>`, `declined`). Leave it out when there were none.
- **Verdict** is one of: `open`, `ok`, `deselected`, `finding → ticket NN`,
  `finding → clarification NN` — per question when there are several (`1 ok, 2 finding → ticket
  NN`). Spots under the cap are `under cap`, or `pulled in` once the user
  takes them into the walk (then they get a verdict like any other).
- Written in the documentation language set in `CLAUDE.md`/`AGENTS.md`.

**Area form** — for `--area`, the trail is `docs/reviews/<slug>.md`, outlives every feature and is
read by the next run on the same area. It differs in three places: the title is
`# Human review – area <slug>`; **Tickets reviewed** gives way to **Area** (the confirmed file
list, one line, comma-separated) and **Reviewed at** (the short `HEAD` hash and its date) — the
next run proposes that list again; and when candidates were dropped as already judged, one line
says how many. Findings point at the fix feature: `finding → <fix feature> ticket NN`.

<trail-template>

# Human review – <feature>

## Run <n> – <YYYY-MM-DD>

Tickets reviewed: <file name>, <file name>, …
<!-- area form instead: -->
<!-- Area: <path>, <path>, … -->
<!-- Reviewed at: <short HEAD hash> (<YYYY-MM-DD>) -->
<!-- Already judged, dropped: <n> -->

<!-- only if a zone was hit -->
| Zone | Files | Verdict |
|---|---|---|
| M<n> <zone> | <path>, <path> | <verdict> |

| # | Spot | Location | Kind | Severity | Question | Verdict |
|---|---|---|---|---|---|---|
| 1 | <name> | <path:line> | <kind> | <severity> | <full question(s)> | <verdict, per question if several> |

<!-- only if a spot became a finding: one line each, the user's verdict in their words -->
**Findings**
- <#>: <what is wrong and what should happen instead> → <ticket>

<!-- only if there were zone candidates -->
**Zone candidates**
- <glob or regex> (<evidence: spot # or M<n>>) → <added | widened <zone> | declined>

</trail-template>
