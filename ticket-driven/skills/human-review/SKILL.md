---
name: human-review
description: Walks the developer through the few spots in a finished feature where a human's judgment adds value — silent decisions, domain logic, user experience, weakened tests, hard-to-reverse changes — a map of the feature and an overview first, then the raw diffs of every must-read zone the feature touched, then one explained spot per turn with an agenda of the walk, turns findings into implementation tickets, and hands zone candidates to /review-maintainer. Optional step between /implement and /close-feature; needs the docs/features workflow. With --area <area> it walks a part of the standing code instead — code that never had a walk — measured against the project's rules, ADRs and the tickets in its history. Not a bug hunt (that's /hunt-bugs) and not a review of an arbitrary diff (that's the built-in /code-review).
disable-model-invocation: true
---

The reviewer subagents inside `/implement` have already checked every ticket against the project's standards and its spec. This skill does what they can't: it finds the spots only a human can judge and puts each one in front of the user with everything needed to judge it on the spot. You read and guide; the code changes in a later `/implement` run against the tickets this run writes.

## Terms

- **Judgment spot** — a place in the feature's code where a human's verdict adds value an AI reviewer can't. It has a **name** — what happens there, in a few of the user's words — and always carries one to three concrete **questions** to the user, each with answer options, one of which is what the code does today; a spot without one ("check the error handling") is not a spot. A spot about how something feels may instead let the user **try values** themselves.
- **Silent decision** — something the code decides that its ticket left open: a default, an edge case, an order, a text the user sees, what happens on failure, what happens to existing data. Nobody has judged it yet, which makes it the most valuable kind.
- **Deviation** — the code does something other than the ticket or `specifications.md` plan, whether or not the ticket's implementation note documents it. The reviewers inside `/implement` let a documented deviation pass; whether it was the right call is the user's to judge.
- **Map** — the feature's flow from trigger to result in the user's words, drawn from the code as it stands today, with every spot placed on one of its steps. It gives the walk its bearings: each spot says where on the map it sits.
- **Evidence** — per map step, the tests that would fail were the step broken, or none. A step without one is where the tests don't reach, and so where the user's eye counts most — whether or not a spotter reported a spot there.
- **Door** — per feature, what can't be walked back by a revert once it has shipped and run (a migration, rewritten stored data, a stored format or file layout, a public interface), each with its **reach**: who is hit when it is wrong. Everything else is a two-way door.
- **Explanation** — what a spot carries besides its questions: a **flow** diagram from the user's action through the linked functions to the spot's line and its result, then what the line **decides**, what the **plan** says about it and what **can go wrong** — so the user judges the code instead of trusting a summary of it, and does so in one screen.
- **Agenda** — one line closing every spot turn: the walk's spots by number with their verdict signs, so the user always sees where the walk stands.
- **Must-read zone** — a code area listed in `docs/workflow/must-read-zones.md` (kept by `/review-maintainer`) whose every change the user reads as a raw diff, before the spots and without an explanation. The spotters decide where the user looks; a zone is where that choice isn't left to them.
- **Review trail** — `<feature folder>/human-review.md`, written with [trail-template.md](trail-template.md): which tickets were reviewed, which zones were read, and the user's verdict per spot. It lets a second run review only what's new, lets an interrupted walk resume, and stays with the feature in `closed/` as the record of what a human looked at.

## Language

All labels in this skill and its templates are written in English. Write them in the chat language the project sets in `CLAUDE.md` / `AGENTS.md` (default: English) — headings, table columns and markers' words alike; the signs (`🗺️ 🔎 📕 📍 ✅ ◻ 🚪 🧭 👤 🖥️ ⚙️ 🎯 ❓ ⚠ ⭐ ➡️ 📋 🎫 …`) stay as they are. The review trail and any tickets go in the documentation language set there (default: English).

## Preparation

`/human-review <feature>` · `/human-review --area <area>`
If the user has given neither, ask. With `--area`, follow *Area Mode* below — it replaces the steps from here through *Send the Spotters and the Cartographer* and names what else changes.

The feature folder is `docs/features/<feature>/`. If it doesn't exist, or its `tickets/implementation/closed/` holds no ticket, say so in one sentence and stop — this skill needs the workflow's closed tickets as its yardstick and has nothing to review without them. Point to `--area` if what the user wants reviewed has no closed tickets.

## Area Mode

`/human-review --area <area>` walks a part of the standing code instead of a feature's tickets — code that never had a walk: built before this skill existed, through `/quick`, or in a feature closed without one. The walk is the same — kinds, severity, threshold, cap, map, explainer, cross-check, overview, spot turns, zone maintenance. What follows replaces the feature-bound steps; everything it doesn't name runs as described in the rest of this skill, with `<slug>` wherever it says `<feature>`, and the area's yardstick (see *Find the history*) wherever a kind, a template or a reader says "ticket" or "plan".

**Pin the area.** If the user gives the slug of an existing trail under `docs/reviews/`, its last run's file list is the proposal, plus any file that has since appeared in the same folders, marked as new. Otherwise the user names the area in words ("locking", "deleting with consequences") or as paths. Resolve it to a list of production files yourself, by name only — file and folder names, route and module names, the globs of a must-read zone that carries the name — never by reading the code. Tests stay off the list; the readers find them. Show the list with a proposed **slug** (short, English, kebab-case, ASCII) and get both confirmed. More than about 25 files → propose a narrower cut first, one flow per run: the walk caps at ten spots either way, and a wide area just leaves more under the cap.

**Find the history.** Without a ticket, the plan is what the project wrote down about the area. Collect it mechanically:

```sh
git log --format='commit %H' --name-only -- <files>
```

Per commit, keep the ticket and plan files it added or changed under `docs/` (closed implementation tickets, closed quick tickets, specifications, archived plans) — with `git show --format= --name-only <hash> -- docs/`. That list is the area's **history**: places to look up, never reading to do up front, for you as for the readers. Together with the Rules in `CLAUDE.md`/`AGENTS.md`, the ADRs and `CONTEXT.md` it is the yardstick.

**The trail** lives at `docs/reviews/<slug>.md` — there is no feature folder yet — written with [trail-template.md](trail-template.md) in its area form. If it exists, read it: a run with spots still `open` → offer to **resume** it, as for a feature. Otherwise the new run covers the whole area again, but drop every candidate an earlier run already judged (any verdict but `open`) at the same location whose snippet still stands verbatim in `HEAD` — those lines haven't changed since someone looked. Count what was dropped; the overview names it in one line.

**Send the readers.** Cut the file list into **slices** — one flow or one module each, about eight files at most. In a single message, so they run in parallel, launch:

- one Spotter [spotter.md](../../agents/spotter.md) per slice, **in area mode**: its files, the history entries that touch them, the paths to `CLAUDE.md`/`AGENTS.md`, `CONTEXT.md` (or `CONTEXT-MAP.md`), `docs/adr/` and any `specifications.md` in the history, and the kinds and the severity scale verbatim;
- one Cartographer [cartographer.md](../../agents/cartographer.md) **in area mode**, with the whole file list in place of commits, the slug, and the same paths.

Then *Merge* as for a feature. Severity matters more here than anywhere: standing code holds many settled decisions, and the cap keeps the walk to the ones that cost the most when wrong.

**No must-read turn.** There is no diff to read raw. A zone the area overlaps is named in the overview's must-read line instead: `📕 Must-read: none in area mode · overlaps M<n> <zone>`.

**The origin of a spot** is the commit that last shaped its line: `git blame -w -M -C --porcelain -L <n>,<n> HEAD -- <file>`. Its ticket is the closed ticket that commit added, if any — the head then links it as usual; otherwise the head's **Ticket** field reads `no ticket — <short hash> <subject>`. Give the explainer that commit as the spot's origin, with the history entries of the spot's file. *Write the Diffs* takes that commit like an origin ticket's, into `.review/<slug>/spot-<n>.diff`.

**Findings need a feature.** After the walk, list the planned tickets as usual. Once the user confirms — and also when the only result is a clarification ticket — create the **fix feature** `docs/features/review-<slug>-<YYYY-MM-DD>/` — dated, so a later run on the same area never collides with it, open or closed — the way `/hunt-bugs` does in its *Create the Feature*: `specifications.md` with `/write-spec` (Problem Statement: what the verdicts found, from the user's side; User Stories: per finding, the behavior once it's fixed; Out of Scope: the rest of the area; Further Notes: a link to the trail), then the tickets into it as *Findings Become Tickets* says. The trail records each finding as `finding → <fix feature> ticket NN`. No finding → no feature folder; the trail alone is committed.

**Final step** as for a feature, with `.review/<slug>/`. The next command: tickets written → `/implement <fix feature> NN-NN`, and once built, `/human-review <fix feature>` reviews the fixes like any feature, before `/close-feature <fix feature>`; a clarification ticket written → `/clarify-ticket <fix feature> <NN>`; spots still open → `/human-review --area <slug>` resumes; otherwise nothing — the trail is the record.

## Collect the Scope

The scope is exactly the commits that closed the feature's implementation tickets: `/implement` moves each ticket into `closed/` in the same commit as its code, so those commits are the feature's code — even when other features' commits are interleaved on the same branch, and without any uncommitted work lying around the tree.

```sh
git log --format='commit %H' --diff-filter=A --name-only -- '<feature folder>/tickets/implementation/closed/'
```

Each `commit` line is followed by the ticket file(s) it closed. One commit closing several tickets is reviewed as one unit.

If `human-review.md` exists, read it:

- A run with zones or spots still `open` was interrupted. Offer to **resume** it — match the zones again for its tickets (see *Match the Must-read Zones*), re-anchor its open spots (see *Merge*), send only the cartographer, place and explain the open spots again (the trail keeps verdicts, not explanations), and continue the walk at the must-read turn if a zone is still `open`, otherwise at the first open spot — instead of starting a new run.
- Otherwise drop every ticket already listed under a run's "Tickets reviewed". If none is left, report "nothing new to review" and stop.

## Match the Must-read Zones

If `docs/workflow/must-read-zones.md` exists, match its zones against the remaining commits — mechanically, by file name, never by reading the diffs:

- **Paths** — `git show --format= --name-only <commit> -- ':(glob)<glob>' …` with all the zone's globs;
- **Patterns** — `git show --format= --name-only -G'<regex>' <commit>`, followed by `-- ':(glob)<glob>' …` when the zone also has paths.

A zone is **hit** when any commit yields a file; record per hit zone its files and, per file, the commits and tickets that changed it. The match is the only judge: never add a file the zone doesn't match or leave one out that it does — a file you think belongs is a zone candidate for *Maintain the Zones*, not a hit. Without the zone file there is nothing to match; *Maintain the Zones* lets `/review-maintainer` offer a first set.

## Send the Spotters and the Cartographer

In a single message, so they all run in parallel — they read only, no worktree, same tree — launch:

- one instance of the Spotter Subagent [spotter.md](../../agents/spotter.md) per remaining commit, and
- one instance of the Cartographer Subagent [cartographer.md](../../agents/cartographer.md) for the whole feature. Give it the feature name, **all** the commits that closed the feature's implementation tickets (not only the remaining ones — the map shows the whole feature), and the paths to `specifications.md`, `CLAUDE.md`/`AGENTS.md` and `CONTEXT.md` (or `CONTEXT-MAP.md`).

The map and the spots come from different readers on purpose: where they disagree, the walk shows it instead of one reader smoothing it over.

Give each one:

- its commit hash and ticket file path(s),
- the titles of **all** the feature's implementation tickets, open and closed, with their numbers — so it can tell "a later ticket rewrites this" or "this builds on ticket X" without reading them,
- the paths to `specifications.md`, `CLAUDE.md`/`AGENTS.md`, `CONTEXT.md` (or `CONTEXT-MAP.md`) and `docs/adr/`, as places to look up, not as reading to do up front,
- the kinds and the severity scale below, verbatim.

Never read the diffs yourself: the walk runs over many turns, and whatever you read now rides along in every one of them. The only code you read is the few lines each spot points at, to anchor and cross-check it.

### Kinds

- **Silent decision** — the code decides something its ticket left open.
- **Deviation** — the code does something other than the ticket or the spec plan, documented or not.
- **Domain logic** — a rule or calculation that can be wrong yet internally consistent: tests pass, reviewers find nothing, and only someone who knows the domain sees it.
- **User experience** — how something feels in use: focus, order, wording, feedback, what the user sees while waiting or after an error.
- **Weakened test** — a test deleted, loosened, skipped, or rewritten to match the code instead of the requirement.
- **Hard to reverse** — something that becomes fixed once shipped: a data format, a schema or migration, a public interface, stored data being changed or removed.
- **Other** — worth a human look but none of the above. If "Other" becomes the usual case, the kinds are cut wrong — tell the user.

### Severity — damage if wrong

1. **Data loss** — a record disappears or is silently overwritten.
2. **Wrong result** — what's shown or stored differs from what was entered or computed.
3. **Blocker** — the user is stuck (crash, hung lock, dead button).
4. **Nuisance** — they get past it, but it grates.

If the consequence would be **hard to reverse** (shipped data format, schema, public interface, stored data), the spot rises one step. Below the threshold is only **Nuisance and easy to reverse** — everything else is a candidate.

## Merge

Spotter reports are candidates, not spots. Yourself:

1. **Anchor every candidate in `HEAD`.** A later ticket may have rewritten or removed the code. Check the location against today's file: gone → drop the candidate; moved → set the new line. A spot always points at code that exists now.
2. **Merge duplicates.** Two tickets touching the same spot from two directions are one spot with both tickets as origin.
3. **Drop** what is below the threshold.
4. **Sort** by severity, then by kind in the order listed above.
5. **Cap at 10.** The rest stays visible as one line each under the cap — never dropped silently.
6. **Place each spot on the map** by its location: the cartographer lists the files and functions under each step. A spot whose function is under no step is placed "outside the flow" — visible, never forced onto a step.
7. **Note zone files.** A spot located in a file of a hit zone is listed under that zone's *Spots inside* in the must-read turn. It stays in the walk like any other — the user reads the zone raw first and gets the explanation later.

**No judgment spot is a valid result.** Report it honestly; never pad the list to look thorough. The map is shown anyway — it is what the user looked at.

## Explain the Spots

Launch one instance of the Explainer Subagent [explainer.md](../../agents/explainer.md) for all the walk's spots together, so they read alike and each term is explained only once. Give it the spots in walk order, per spot: its number, its location in `HEAD` with the verbatim snippet, kind, severity, the spotter's context and question, its origin ticket file(s) and commit hash, and the map step it was placed on. Give it the map once, the paths to `specifications.md`, `CLAUDE.md`/`AGENTS.md` and `CONTEXT.md` (or `CONTEXT-MAP.md`), and the path to [spot-template.md](spot-template.md) — it fixes the sections and their variants. A spot the user pulls in from under the cap later gets the same treatment before it is shown.

Then **cross-check** every explanation against the code — the explainer can misread, and the user will trust what it says. Read each spot's line range in `HEAD`, only those lines, and the plan passages its *Plan* quotes:

- a function link or a line reference in the **flow** (`⚠ L<n>`, a function's `path:line`) that points at the wrong line → set it right; that is mechanical;
- the **Decides** line, a step of the **flow** or a case under **Can go wrong** that doesn't match its lines → mark it `⚠ check explanation`; never rewrite it silently into what you think is right;
- a **Plan** whose quote isn't in the named source, or whose "no reason written down" overlooks a reason in the implementation note → `⚠ check explanation` on it;
- a **Map disagrees** from the explainer → shown under the flow as `⚠ map and code disagree`, both sides quoted;
- a **Try it** → its file line verbatim and its "today" value the one in the code; a mismatch is fixed, since the user will edit that line;
- an option marked "today" that isn't what the code does → `⚠ check explanation` on the question.

## Write the Diffs

Every spot and every hit zone links its own diff, so the user reads what the ticket changed beside the explanation — a chat can't open the editor's diff view, but it can open a file, and the editor colors a `.diff` file and jumps to its line. Per spot, mechanically, without reading the diff:

1. **The folder** — `.review/<feature>/` at the repository root. Make sure `.review/` stands in `.git/info/exclude` (append it if not): ignored locally, so it never shows in `git status` — never touch `.gitignore` for it.
2. **The file** — `git show -U8 --format='commit %h %s' <origin hash> … -- <files> > .review/<feature>/spot-<n>.diff`: the spot's origin commit(s) in commit order, limited to the files of the spot's flow (the function links and the spot's own file). Only what the ticket changed, never later commits — the link to the file in `HEAD` shows today.
3. **The line** — find the spot's verbatim snippet in the file (`grep -nF`), preferring an added `+` line; that line number goes into the **Diff** field of the head. Not among the changed lines → link the first hunk of the spot's own file and add `(line unchanged — the decision lies in what stayed)`: then the spot is decided by what the ticket left as it was, and the user should know not to look for it in red and green.

Write a pulled-in spot's diff before it is shown. The folder is derived — a resumed run writes it again.

**Every hit zone** gets its own file the same way, `.review/<feature>/M<n>.diff`: `git show --format='commit %h %s' <hash> … -- <file> …` with the zone's commits in commit order and its matched files — for a zone that matched by pattern, with `-G'<regex>'` added. No line to find: the must-read turn opens it from the top.

Before showing anything, write the run into `human-review.md` with [trail-template.md](trail-template.md) — every hit zone and every spot `open` with the explainer's name and final questions, the ones under the cap listed as such. Should the session end mid-walk, the next run resumes from there.

## Overview

Show the map, the zones the feature touched, then all spots at once, with [overview-template.md](overview-template.md), so the user knows what the feature does, how big the walk is and what matters most. The map carries each step's evidence and the feature's doors as the cartographer reported them — cross-check only what you link: a test's link points at its line in `HEAD`, and a test name that isn't there is dropped and its step marked `◻ no test`, never kept on faith. Its table names every spot once; from the first spot on, the one-line agenda carries the walk. The user may **deselect** spots and **pull in** spots from under the cap — only explicitly; nothing leaves the walk without a word from them. Record both in the trail. A deselected spot's terms move to the next spot that uses them.

## Must-read

If any zone was hit, the first turn after the overview is the must-read turn, with [must-read-template.md](must-read-template.md): per hit zone its Why, its files as links and the link to its diff file, which shows exactly its changes. No explanation, no summary of the diff, no hint what to look for — this is the one turn where the user reads without a guide.

After the user's reply, per zone:

- **read** → record `read`.
- **finding** in their own words → record it; if it doesn't say what should happen instead, ask once and stay on the turn.
- **question** → answer it now — they have read the diff, so an explanation no longer frames it — look things up yourself or via a read-only subagent, and stay on the turn.
- **skip** → record `skipped`. Only on the user's word; a zone left unanswered stays `open`.

A zone with no reply stays `open` and the turn is shown again with only those zones; the user can always say `skip`. Then update the trail and show spot 1. Without a zone hit, there is no must-read turn.

## The Walk

One spot per turn, like a brainstorming point — with [spot-template.md](spot-template.md), so the user can judge without searching. Every spot has the same sections in the same order — head, flow, the spot, question, reply line — and closes with the one-line [agenda](agenda-template.md); a spot fits one screen. No code excerpt: the clickable location opens the file at the spot's `⚠` line, the diff link opens what its ticket changed, and the flow links each function it names.

After each user reply:

- **an option per question** (`1 A, 2 B`; a single question needs no number) → the option marked "today" is `ok`; any other option is a finding whose target is that option. Confirm in one line, record per question, show the next spot. A question left unanswered stays on the spot.
- **ok** → "today" on every question; confirm in one line, record `ok`, show the next spot.
- **a value after a try-it** — one of the options or one of their own → as an option. Unless they said they did, remind them in the same line to set the line back to today's value.
- **finding** in their own words → record it. If the reply doesn't say what should happen instead, ask once and stay on the spot; a finding without a target can't become a ticket.
- **question or doubt** → answer it — look things up yourself or via a read-only subagent, never ask the user for a fact you could find — and stay on the spot.
- **deselect** → record `deselected`, show the next spot.
- **stop** → leave the remaining spots `open` in the trail and go to the Final Step; the next run resumes there.

Update the trail after every verdict, not at the end. Then update the agenda — the verdict, what it may settle, what was pulled in — and show it under the next spot.

## Findings Become Tickets

When the walk is through, list the planned tickets in one line each and write them once the user confirms — findings from the must-read turn alongside those from the spots:

- **One implementation ticket per finding** into `<feature folder>/tickets/implementation/`, with [implementation-ticket-template.md](../approval/implementation-ticket-template.md). Number on from the highest number in `tickets/implementation/` and its `closed/`. The spot (or the zone's file) and the user's verdict fill "What to build" and the acceptance criteria — a chosen option or value is the target, verbatim; "Blocked by" defaults to "None (can start immediately)". Leave `Model` and `Effort` empty — `/implement` judges them, as for tickets from `/hunt-bugs`.
- **Several small findings in the same file** (a name, a text, a missing assertion) go into **one** ticket.
- **A finding that is really an open question** ("is this even wrong, or intended?") goes into a clarification ticket of type Brainstorming via `/write-clarification-tickets` instead.

Record each finding's ticket number in the trail. Never fix code in this skill — a fix goes through `/implement` so it is built test-first and reviewed like the rest of the feature.

## Maintain the Zones

Collect the run's **zone candidates** — each a location no zone covers, with its evidence (location, kind, severity, verdict, who found it):

- **a finding the spotters didn't report** — the user raised it themselves, about code neither a zone nor a spot pointed at: the clearest sign of a blind spot;
- **a finding of severity Data loss, or raised for being hard to reverse**, outside every zone;
- **a place the user asked to read every time** ("always show me this").

Then run the /review-maintainer skill with the zone file path and the candidates. It checks the zones against today's tree in any case, asks the user about each candidate, and offers a first set when the file doesn't exist yet. Record in the trail what came of each candidate.

## Final Step

If the walk had a try-it, check its files with `git diff` first. A value still changed is the user's edit: name it and ask whether to set it back — never commit it, never restore it unasked.

Delete `.review/<feature>/` — the diffs are derived and a resumed run writes them again; leave `.review/` itself and its line in `.git/info/exclude`.

Commit the trail, any new tickets and the zone file if `/review-maintainer` changed it, on the current branch. Stage only the files this run wrote, by path — the user may be working elsewhere in the tree. Never push — pushing is the user's call alone.

Report the result per zone (read / skipped / finding → ticket NN / still open) and per spot (ok / deselected / finding → ticket NN / still open), and what changed in the zone file. Give the user the ready-to-paste command for the next chat:

- tickets written → `/implement <feature NN-NN>`; once they are built, `/human-review <feature>` again reviews only what they changed, before `/close-feature <feature>`,
- a clarification ticket written → `/clarify-ticket <feature> <NN>`,
- zones or spots still open → `/human-review <feature>` resumes the walk,
- otherwise → `/close-feature <feature>`.
