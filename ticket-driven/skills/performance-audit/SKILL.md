---
name: performance-audit
description: Audits the standing codebase — an area, a feature, or all of it — for evidenced performance problems (slow paths, wasted work, blocking calls) and turns the findings into a new feature — spec plus implementation tickets, ready for /implement. Function and quality always outrank speed — a fix that changes behavior, weakens a project rule, or costs readability is not a finding. Use to search for slowness; not for fixing it (that's a later /implement run), not for reviewing a diff, and not for bugs (/hunt-bugs) or vulnerabilities (/security-audit).
disable-model-invocation: true
---

You read, measure where the project allows it, and document; the code itself changes in a separate run (`/implement` against the feature this skill produces, `/clarify-ticket` first for any open question). This run ends with a feature folder holding the findings — not a fix.

## The Priority

**Function, then quality, then performance.** This order decides every doubt in this run:

- A fix leaves observable behavior unchanged — same results, same order, same error handling, same freshness of data that others write — and keeps the existing tests green without loosening them.
- A fix doesn't make the code markedly harder to read or change. A plain loop beats a clever one that's a little faster.
- Slowness a project rule or ADR deliberately accepts is not a finding (see Protected Slowness).
- In doubt, it's not a finding: a suspicion or a clarification ticket is cheaper than a fix that trades correctness for speed.

A **finding** is a performance problem with four parts:

- **Trigger** — the concrete action, request, or input that takes the slow path.
- **Scale** — the size at which it bites (records, users, file size, latency), and that this size is realistic for the project.
- **Cost** — what it costs there: a count of queries, roundtrips, renders, or calls; a complexity class; or a measured time.
- **Location** — file and line.

Without a realistic scale or a cost it's a **suspicion** — collected and listed separately. "Could be faster" alone is a suspicion at best. Keep the line sharp: a list where one suspicion sits as a finding is a list nobody trusts again.

## Preparation

`/performance-audit <area | feature>`
If the user names an area ("audit the import path", a path), every beat below lives inside it. If they name a feature, its folder under `docs/features/` (or `docs/features/closed/`) and the commits of its tickets define the area: the files it touched and the flows it built. If they name nothing, the whole codebase is in scope.

Read the ADRs under `docs/adr/` that touch the area, and the rules in CLAUDE.md/AGENTS.md — Protected Slowness lives on these, and the hunters get no other access to them. Also read `CONTEXT.md`, or the relevant file via `CONTEXT-MAP.md` in a multi-context repo, for the area's domain vocabulary and data sizes.

Then build three things before cutting any beat.

### Protected Slowness

Every place where the project deliberately pays speed for correctness: a rule or ADR that demands refetching, forbids or limits caching, sets a timeout, retries, serializes, locks, validates, re-reads from disk, forbids a faster mode, or caps polling. Per entry: the promise quoted, its source, and the code it governs.

Where rules and ADRs are silent — or the project has none — these count as protected by default, unless a rule explicitly frees them:

- locks, transactions and their isolation, ordering guarantees
- validation and authorization checks
- freshness of data other users or processes write (cache lifetimes, refetch on focus or reconnect)
- timeouts, retries, backoff
- security checks (path normalization, signature verification, escaping)
- logging and diagnostics a rule requires
- durability: backups, safety copies, flush/fsync

### Realistic Scale

The typical and the upper size the code meets in use: data volumes per entity, concurrent users, file sizes, where the data lives (memory, local disk, network share, remote service), target hardware. Sources: CONTEXT.md, docs, ADRs, test fixtures, seed data, configured limits. Without a scale, nothing becomes a finding except what is slow at any size.

### Means of Measuring

The commands CLAUDE.md/AGENTS.md document for tests, benchmarks, or profiling. Only those — install nothing.

Show the user Protected Slowness and Realistic Scale **in one message**, and ask in the same message for whatever scale you couldn't find. They may add or strike entries; their word stands. Then cut the beats.

## Stake Out the Beats

A **beat** is an area times one performance class, sized to a single context window — the server's data access times *Query Patterns* is one beat, the UI's list views times *Render Load* a second. Cut so each hunter carries one class in mind, not all seven. A class the stack doesn't have (no database, no UI) gets no beat — name it in the coverage as skipped.

Write the beats as a numbered list before sending anyone out. This list is your completion criterion: **the audit is done when every beat has its report** — not when enough findings are in hand.

## Performance Classes

The fixed set beats get cut from. Each class reads as _what to look for_ → _how to recognize it_; hand the hunter their class verbatim.

- **Query Patterns**: the database is asked more often or for more than the result needs. → A query inside a loop (N+1), a relation lazy-loaded per row, every column loaded where few are used, filtering or sorting in application code what the query could do, a missing index on a column used in WHERE, JOIN, or ORDER BY, counting by loading all rows.
- **Roundtrips & I/O**: the code crosses a slow boundary — network, disk, network share, external process, device — more often than needed. → A file opened or stat'ed per item in a loop, the same file read twice in one request, many small writes instead of one, independent calls made one after another, polling where one read would do.
- **Blocking**: work that stalls a thread others wait on. → Synchronous I/O or CPU-heavy work inside an async handler or event loop, a long computation on the UI thread, a lock held across slow I/O, a synchronous call to a device or external service with no offload.
- **Client Waterfall**: the client loads in steps that could be one, or loads what it doesn't show. → Request B starts only after A though it doesn't need A's result, the same resource fetched separately by several components, a full list loaded to show a count, an unbounded list without pagination, a refetch triggered by every render.
- **Render Load**: the UI does more work per interaction than the change needs. → State high in the tree re-rendering a large subtree on every keystroke, fresh object or function identities defeating memoization on a hot path, long lists rendered without virtualization, expensive computation in render without memoization, layout thrash (reading layout right after writing styles, in a loop).
- **Algorithm & Memory**: the work grows faster than the input. → Nested loops over the same collection where a lookup map would do, sorting or copying inside a loop, a whole file or result set held in memory to use a part of it, a cache or list that grows without bound over a session, quadratic string building.
- **Startup & Cold Path**: the time until the app is usable. → Heavy imports or initialization done eagerly though only one path needs them, startup work that could wait for first use, scans or migrations that run on every start though nothing changed, independent startup steps run one after another.

## Send the Hunters

Launch one instance of the Hunter Subagent [hunter.md](../../agents/hunter.md) per beat, all **in a single message** so they run in parallel. It reads only — no worktree, same tree.

Give each one its beat: the paths and the **one** class, verbatim from Performance Classes; the Protected Slowness entries that touch those paths; the Realistic Scale; and these extra instructions, verbatim:

> For this audit, a finding additionally needs **Scale** (the realistic size at which it bites, from the scale you were given), **Cost** (a count of queries, roundtrips, renders, or calls; a complexity class; or an estimate marked as such), and a **Fix sketch** (one sentence: the smallest change that removes the cost). Function and quality outrank speed. A slow spot that a protected entry covers is not a finding — report it as a **trade-off**, one line, naming the entry. If the fix sketch changes behavior, loosens a test, or adds a cache, denormalization, or concurrency, mark it **costly fix**.

Let each report.

## Cross-Check

Hunter reports are raw material, not findings. Launch one instance of the Verifier Subagent [verifier.md](../../agents/verifier.md) per reported finding, all **in a single message** so they run in parallel — give each only that finding's Title, Trigger, Location, Scale, and Fix sketch, never the hunter's own reasoning, plus these two questions, verbatim, with the protected entries filled in:

> 1. Does the cost hold at the stated scale — is the path really taken that often, is the data really that large, isn't it already batched, cached, or bounded elsewhere?
> 2. Would the fix sketch change observable behavior (results, order, error handling, freshness of data others write) or touch one of these protected entries: <entries>? If yes, say which.

A downgraded verdict on question 1 makes the finding a suspicion instead of dropping it. A yes on question 2 makes it a trade-off.

Then, yourself:

- **Merge duplicates.** Two beats hitting the same spot from two directions is one finding with two angles.
- **Find the safety net.** Name the test that pins the behavior the fix would touch. If none does, the finding's ticket writes that test first — see Create the Feature.
- **Measure, where the means exist.** For a confirmed finding that the documented commands can reach, take a baseline: count the queries or calls in a test, or time the path against data at the realistic scale. Throwaway scripts go to the scratchpad, never into the repo; never against production data. A measurement that shows the cost negligible at realistic scale makes the finding a suspicion. A measurement that confirms it goes into the ticket as its baseline.

You're done when **every reported finding** has been through a verifier and the three checks above.

## Present the Findings

Sort by what the user feels at realistic scale, in this order:

1. **Stall** — the user waits so long they think it hangs, or a timeout or lock wait hits (frozen UI, request timing out, other users blocked).
2. **Noticeable wait, main flow** — an action done many times a day takes visibly long (roughly over a second, or stutter while typing or scrolling).
3. **Noticeable wait, side flow** — the same on a rare path (export, import, startup, administration).
4. **Waste** — measurable extra work nobody feels yet, growing with the data. Recommend leaving it unless the fix is small and reads at least as well as today's code.

Per finding: Scale, Cost, Fix sketch, and the **costly fix** mark where set. Below the list:

- **Trade-offs**, one line each with the promise they touch. They never become tickets in this run — revisiting a promise is a decision for `/adr`.
- **Suspicions**, one line each.
- **Coverage** — "beats searched: …", plus the classes skipped and why.

Propose the feature's **slug** — short, English, kebab-case, ASCII — and get it confirmed together with which findings go in: the user decides.

**No finding is a valid result too.** Report the coverage, the trade-offs, and the suspicions, and create **no** feature.

## Create the Feature

Create the feature folder `docs/features/<slug>/`, exactly like `/new-feature` — minus its interview and user-story rounds: the findings are already evidenced, there's nothing left to ask.

Write `specifications.md` with the `/write-spec` skill. The findings fill it as:

- **Problem Statement** — what the user waits for today, where, and at what size — from their perspective, not the code's.
- **User Stories** — per finding, the action that is faster once it's fixed, and that everything else about it stays as it is.
- **Out of Scope** — anything beyond the individual fix; explicitly no change to a Protected Slowness entry, no new caching layer a finding doesn't name, and no refactor for speed alone.
- **Further Notes** — Protected Slowness, the Realistic Scale assumed, the baselines measured, the trade-offs, the suspicions, and the audit's coverage.

Then write the implementation tickets straight into `tickets/implementation/` (create the folder if it doesn't exist) with [implementation-ticket-template.md](../approval/implementation-ticket-template.md), one ticket per finding, in the tracer-bullet cut from `/approval`: a vertical slice per ticket, its trigger at realistic scale is its test case. Each ticket's acceptance criteria hold these three, in this order:

1. **Behavior pinned** — a test asserts today's observable behavior on the path: the existing one, named, or a new one written and green **before** the optimization.
2. **Cost pinned** — where the cost is countable, a test asserts it: query count, roundtrip count, render count, call count, or growth under scaled input. No wall-clock assertions — they flake; a measured time goes into the ticket as a baseline, not as a test.
3. **Unchanged** — what must not change: results, order, error handling, freshness, the protected entries nearby; existing tests stay as they are.

Each finding's ticket is independent unless one finding's fix genuinely depends on another's — default "Blocked by" to "None (can start immediately)". Write both `specifications.md` and the tickets in the documentation language set in CLAUDE.md/AGENTS.md (default: English).

A finding marked **costly fix**, or one that raises a genuine open question ("is this slowness intended?"), goes **first** into a clarification ticket of type Brainstorming via `/write-clarification-tickets` — not into an implementation ticket.

## Final Step

Commit the new feature on the current branch. Never push — pushing is the user's call alone.
Report where the feature landed and list the tickets created. If clarification tickets exist, give the user the ready-to-paste command for the next chat: `/clarify-ticket <feature> <NN>` (first open ticket); otherwise give them `/implement <feature NN | NN-NN | all>`.
