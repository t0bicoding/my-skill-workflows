---
name: hunt-bugs
description: Hunts the standing codebase for evidenced bugs and turns the findings into a new feature — spec plus implementation tickets, ready for /implement. Use to search an area or the whole codebase for bugs; not for fixing them (that's a later /implement run) and not for reviewing a diff (that's the reviewer subagents inside /implement).
disable-model-invocation: true
---

You read and document; the code itself changes in a separate run (`/implement` against the feature this skill produces, `/clarify-ticket` first for any open question). This run ends with a feature folder holding the findings — not a fix.

A **finding** is a bug with a **trigger**: the concrete input or state where the code provably does the wrong thing, plus file and line. Without a trigger it's a **suspicion** — collected and listed separately. Keep the line sharp: a list where one suspicion sits as a finding is a list nobody trusts again.

## Preparation

`/hunt-bugs <area>`
If the user names an area ("hunt bugs in the import path"), every beat below lives inside it. If they name nothing, the whole codebase is in scope.

Read the ADRs under `docs/adr/` that touch the area, and the rules in CLAUDE.md/AGENTS.md — the *Broken Promise* class lives on these, and the hunters get no other access to them. Also read `CONTEXT.md`, or the relevant file via `CONTEXT-MAP.md` in a multi-context repo, for the area's domain vocabulary.

## Stake Out the Beats

A **beat** is an area times one bug class, sized to a single context window — the server's domain logic times *Concurrency* is one beat, the UI times *Surface* a second. Cut so each hunter carries one class in mind, not all six.

Write the beats as a numbered list before sending anyone out. This list is your completion criterion: **the hunt is done when every beat has its report** — not when enough bugs are in hand.

## Bug Classes

The fixed set beats get cut from. Each class reads as _what to look for_ → _how to recognize it_; hand the hunter their class verbatim.

- **Concurrency**: two users, processes, or requests against the same record. → Lost update with no lock, a check and a write outside one transaction, an assumption about which of two requests lands first.
- **Lifecycle**: something is created and never released. → A lock surviving a hard kill, a session or file with no `close`, a React effect with no cleanup, a timer outliving the unmount.
- **Data edge cases**: empty, `None`, `0`, negative, very long, non-ASCII, duplicate. → Division, indexing, `[0]`, format strings, and sorting that don't see the edge case; `0` treated as "nothing."
- **Error path**: the branch no test enters. → A swallowed exception, `except: pass`, a failure reported to the user as success, a status code that doesn't match reality, state half-written and never rolled back.
- **Surface**: what the user experiences as a glitch. → Flicker from rendering in a loop, scroll or focus jumping after a click, a stale cache after a mutation, a double-submittable button, a loading state that never ends.
- **Broken Promise**: a promise from CLAUDE.md/AGENTS.md or an ADR under `docs/adr/` that the code no longer keeps today. → Customer data in a log, a documented order the code reverses, a new path around a boundary an ADR draws, a configuration against the one described. Quote the promise.

## Send the Hunters

Launch one instance of the Hunter Subagent [hunter.md](../../agents/hunter.md) per beat, all **in a single message** so they run in parallel. It reads only — no worktree, same tree.

Give each one its beat: the paths and the **one** class, verbatim from Bug Classes, plus the promises from Preparation that touch it. Let each report.

## Cross-Check

Hunter reports are raw material, not findings. Launch one instance of the Verifier Subagent [verifier.md](../../agents/verifier.md) per reported finding, all **in a single message** so they run in parallel — give each only that finding's Title, Trigger, and Location, never the hunter's own reasoning. A downgraded verdict makes the finding a suspicion instead of dropping it.

Then, yourself:

- **Merge duplicates.** Two beats hitting the same spot from two directions is one finding with two angles.
- **Check it against the tests.** A green test that should already cover that spot means either the finding is wrong or the test is blind — say which.

You're done when **every reported finding** has been through a verifier and the two checks above.

## Present the Findings

Sort by severity, in this order:

1. **Data loss** — a record disappears or is silently overwritten.
2. **Wrong result** — what's shown or stored differs from what was entered or computed.
3. **Blocker** — the user is stuck (crash, hung lock, dead button).
4. **Nuisance** — they get past it, but it grates.

Present the list, the suspicions below it in one line each, plus the coverage ("beats searched: …"). Propose the feature's **slug** — short, English, kebab-case, ASCII — and get it confirmed together with which findings go in: the user decides.

**No finding is a valid result too.** Report the coverage and the suspicions, and create **no** feature.

## Create the Feature

Create the feature folder `docs/features/<slug>/`, exactly like `/new-feature` — minus its interview and user-story rounds: the findings are already evidenced, there's nothing left to ask.

Write `specifications.md` with the `/write-spec` skill. The findings fill it as:

- **Problem Statement** — what happens to the user today, from their perspective, not the code's.
- **User Stories** — per finding, the behavior that holds once it's fixed.
- **Out of Scope** — what's explicitly not part of this feature, especially any refactor beyond the individual fix.
- **Further Notes** — the suspicions and the hunt's coverage.

Then write the implementation tickets straight into `tickets/implementation/` (create the folder if it doesn't exist) with [implementation-ticket-template.md](../approval/implementation-ticket-template.md), one ticket per finding, in the tracer-bullet cut from `/approval`: a vertical slice per ticket, the finding's trigger is its test case, the one the slice turns green on. Each finding's ticket is independent unless one finding's fix genuinely depends on another's — default "Blocked by" to "None (can start immediately)". Write both `specifications.md` and the tickets in the documentation language set in CLAUDE.md/AGENTS.md (default: English).

If a finding raises a genuine open question ("is this even wrong, or intended?"), it goes **first** into a clarification ticket of type Brainstorming via `/write-clarification-tickets` — not into an implementation ticket.

## Final Step

Commit the new feature on the current branch. Never push — pushing is the user's call alone.
Report where the feature landed and list the tickets created. If clarification tickets exist, give the user the ready-to-paste command for the next chat: `/clarify-ticket <feature> <NN>` (first open ticket); otherwise give them `/implement <feature NN | NN-NN | all>`.
