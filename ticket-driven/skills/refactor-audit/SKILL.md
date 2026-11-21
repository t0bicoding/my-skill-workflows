---
name: refactor-audit
description: Audits the standing codebase — an area, a feature, or all of it — for overloaded files and tangled structure whose change cost the git history evidences, and turns the findings into a new feature — spec plus clarification and implementation tickets, ready for /clarify-ticket and /implement. Behavior never changes and no test case gets lost — every cut is pinned by tests first and its tests move with it. Use to find what to split, extract, or untangle; not for doing the refactor (that's a later /implement run), not for reviewing a diff, not for a broad project overview (/evaluate-project), and not for bugs (/hunt-bugs) or slowness (/performance-audit).
disable-model-invocation: true
---

You read, measure the history, and document; the code itself changes in a separate run (`/implement` against the feature this skill produces, `/clarify-ticket` first for any open question). This run ends with a feature folder holding the findings — not a refactor.

## The Priority

**Behavior, then safety net, then structure.** This order decides every doubt in this run:

- A refactor changes structure only. Results, order, error handling, side effects, and the interface for callers outside the cut stay as they are — or the callers that change are listed by name.
- No cut without a safety net: tests pin the behavior through the public interface **before** anything moves. Where none exist, writing them is the cut's first step.
- Tests move with the code. They follow the behavior to its new interface; no test case gets lost, loosened, or skipped on the way.
- Every cut follows the Refactor Rules. A cut that splits a Deliberate Concentration is a trade-off, not a finding.
- In doubt, it's not a finding: a suspicion or a clarification ticket is cheaper than a cut that moves a bug or splits what belongs together.

A **finding** is a structural problem with five parts:

- **Smell** — exactly one class from Smell Classes.
- **Change cost** — evidence that it makes changes expensive: commits in the window, co-change partners, parameters or props only forwarded, call sites, duplicated lines, plus at least one real commit that paid the cost.
- **Cut sketch** — one sentence: the smallest split, extraction, or move that removes the cost, and where the pieces land.
- **Safety net** — the tests that pin today's behavior through the public interface, or "none".
- **Location** — file and line range.

**Size alone is not a finding.** A thousand-line file nobody touches costs nothing. Without change cost it's a **suspicion** — collected and listed separately. Keep the line sharp: a list where one suspicion sits as a finding is a list nobody trusts again.

## Preparation

`/refactor-audit <area | feature>`
If the user names an area ("audit the import path", a path), every beat below lives inside it. If they name a feature, its folder under `docs/features/` (or `docs/features/closed/`) and the commits of its tickets define the area: the files it touched. If they name nothing, the whole codebase is in scope.

Read the ADRs under `docs/adr/` that touch the area, and the rules in CLAUDE.md/AGENTS.md — the Refactor Rules and the Deliberate Concentrations live on these, and the hunters get no other access to them. Also read `CONTEXT.md`, or the relevant file via `CONTEXT-MAP.md` in a multi-context repo, for the area's domain vocabulary — new modules get named in it.

Then build four things before cutting any beat.

### Refactor Rules

Every rule a cut has to follow: layering and the allowed direction of dependencies, module and folder layout, naming, where tests live and how they're cut, size or complexity limits the project sets, and the project's own patterns for splitting (a state store, a context, a service layer, an index file per module). Per entry: the rule quoted and its source. Look in `docs/features/closed/` for earlier refactor features too — a cut they settled is a precedent; name it.

Where the project is silent, these hold by default:

- the design principles of the `/codebase-design` skill — shrink the interface, hide behavior not just data, validate with the deletion test; and from its [DEEPENING.md](../codebase-design/DEEPENING.md): one adapter is a hypothetical seam, two adapters a real one
- tests through public interfaces, never against internals — the `/tdd` skill's [tests.md](../tdd/tests.md)
- a new module gets a name from the domain vocabulary, not `utils`, `helpers`, or `misc`
- no new layer of indirection without a second user of it

### Deliberate Concentrations

Every place the project keeps in one spot on purpose, so that a split would scatter a guarantee: a rule or ADR that says "only X does Y", a single source of truth, a registry or list that must be complete, the one choke point for a check. Per entry: the promise quoted, its source, and the code it governs.

Where rules and ADRs are silent, these count as concentrated by default:

- security checks and the single path every access goes through (authorization, path normalization, signature verification, escaping)
- transaction and lock boundaries
- registries, dispatch tables, and dependency lists that must stay complete
- public interfaces outside the codebase — wire formats, API routes, database schema, file formats; changing them isn't a refactor
- migration history and generated files — never refactored

### Hotspot Map

Run the hotspot script from the repository root:

```bash
bash <this skill's folder>/collect-hotspots.sh [path] [months]
```

It reads only git and tracked files and prints the size distribution, the hotspots (lines × changes in the window), large files nobody changed, change coupling (file pairs changed together), the test fit of the top production hotspots (tests by name and by co-change), and the largest test files. Its numbers are the change cost's raw material — copy them, don't re-count by hand. Default window: 12 months; a young or very active project may want fewer. Size is relative: "large" means large against this project's own distribution, unless a Refactor Rule sets a limit.

Not a git repository, or a history too short to say anything → there is no change cost to read; say so, and every result of this run stays a suspicion.

### Means of Testing

The test and coverage commands CLAUDE.md/AGENTS.md document. Only those — install nothing.

Show the user the Refactor Rules, the Deliberate Concentrations, and the top of the Hotspot Map **in one message**. They may add or strike entries; their word stands. Then cut the beats.

## Stake Out the Beats

A **beat** is an area times one smell class, sized to a single context window — the client's main workspace times *Pass-through Interface* is one beat, the server's services times *Overloaded File* a second. Cut so each hunter carries one class in mind, not all six.

The Hotspot Map decides where to look: beats cover the hotspots and their co-change partners. An area in scope without a hotspot gets no beat — name it in the coverage as calm. A smell class the stack doesn't have gets no beat either.

Write the beats as a numbered list before sending anyone out. This list is your completion criterion: **the audit is done when every beat has its report** — not when enough findings are in hand.

## Smell Classes

The fixed set beats get cut from. Each class reads as _what to look for_ → _how to recognize it_; hand the hunter their class verbatim.

- **Overloaded File**: one file carries several responsibilities that change for different reasons. → Groups of functions or components that share no state and import different things, section comments splitting the file, a name too general for its content, commits from unrelated features all landing in it, a file far above the project's size distribution that keeps changing.
- **Long Unit**: one function, method, or component does many steps in sequence. → A function spanning screens, many local variables or hooks, deep nesting, comment-headed blocks inside one body, a component that fetches, transforms, decides, and renders at once.
- **Pass-through Interface**: a module exposes almost as much as it hides. → Parameters or props handed on unchanged through two or more layers, a wrapper that only forwards, a long parameter list where most callers pass the same values, a new field that has to be threaded through several files to reach where it's used.
- **Duplication**: the same knowledge lives in several places that have to change together. → Near-identical blocks or functions, the same mapping, validation, or constant in client and server or in two features, a co-change pair with no shared module between them.
- **Tangled Dependencies**: modules know too much about each other. → An import cycle, a dependency against the project's layering, one feature reaching into another's internals instead of its public entry, a co-change pair across module boundaries with no reason in the domain.
- **Test Misfit**: the tests make the cut expensive or blind. → A test file mirroring an overloaded file one to one and growing with it, tests that mock internal collaborators, test private functions, or assert on call order (they break on a refactor that keeps behavior), the same behavior tested on two layers, a hotspot whose behavior no test pins at the interface a cut would need. Report the last one as the cut's risk, not as a hunt for coverage gaps.

## Send the Hunters

Launch one instance of the Hunter Subagent [hunter.md](../../agents/hunter.md) per beat, all **in a single message** so they run in parallel. It reads only — no worktree, same tree.

Give each one its beat: the paths and the **one** class, verbatim from Smell Classes; the Refactor Rules and Deliberate Concentrations that touch those paths; the Hotspot Map rows for those paths (lines, changes, co-change partners, test fit); and these extra instructions, verbatim:

> For this audit, a finding is a structural problem, not a bug. Its **Trigger** is the change it makes expensive: the files a typical change has to touch together (from the co-change rows you were given), or the chain a new parameter has to travel. It additionally needs **Change cost** (counts from the rows you were given or counted in the code: changes in the window, co-change partners, parameters or props only forwarded, call sites, duplicated lines), a **Cut sketch** (one sentence: the smallest split, extraction, or move that removes the cost, and where the pieces land under the refactor rules), and a **Safety net** (the test files that exercise this code through its public interface, or "none found"). Size alone is not a finding. A cut that splits one of the deliberate concentrations is not a finding — report it as a **trade-off**, one line, naming the entry. If the cut sketch changes behavior, an interface outside the area, a wire format or schema, or needs a choice between several shapes, mark it **open cut**.

Let each report.

## Cross-Check

Hunter reports are raw material, not findings. Launch one instance of the Verifier Subagent [verifier.md](../../agents/verifier.md) per reported finding, all **in a single message** so they run in parallel — give each only that finding's Title, Trigger, Location, Change cost, and Cut sketch, never the hunter's own reasoning, plus these two questions, verbatim, with the entries filled in:

> 1. Does the change cost hold in the code — does the file really carry several responsibilities, is the parameter really forwarded unchanged, is the code really duplicated, do the counts match?
> 2. Would the cut sketch change observable behavior or an interface outside the area, break one of these refactor rules: <rules>, or split one of these deliberate concentrations: <entries>? If yes, say which.

A downgraded verdict on question 1 makes the finding a suspicion instead of dropping it. A yes on question 2 makes it a trade-off when a rule or concentration is hit, and an **open cut** when behavior or an outside interface is.

Then, yourself:

- **Merge duplicates.** One cause is one finding: five pass-through props from the same missing context, or two beats hitting the same file from two directions, are one finding with several angles.
- **Prove the cost in the history.** Per finding, run `git log` on its location over the window and name one or two commits that paid the cost — a change that had to touch the co-change partners, a field threaded through several files. A finding whose history shows no such commit becomes a suspicion.
- **Find the safety net.** Name the tests that pin the behavior the cut moves, by reading them — the script's test fit is a lead, not proof. If none does, the finding's ticket writes characterization tests first — see Create the Feature.
- **Measure, where the means exist.** If a coverage command is documented, run it for the finding's area and record the coverage of its location as the baseline. Output goes to the scratchpad, never into the repo.
- **Check for overlap.** An open feature under `docs/features/` that touches the same files gets named with the finding — two refactors of one spot in parallel are worse than none.

You're done when **every reported finding** has been through a verifier and the five checks above.

## Present the Findings

Sort by what the next change pays, in this order:

1. **Bottleneck** — most features have to pass through it; changes pile up, conflicts and regressions cluster there.
2. **Risky change** — it changes often and nothing pins its behavior; every change is a gamble.
3. **Friction** — a change takes noticeably more files or steps than it needs, on a path that does change.
4. **Cosmetic** — it reads badly but rarely changes. Recommend leaving it unless the cut is small and obviously safe.

Per finding: Change cost with the example commit, Cut sketch, Safety net, the **open cut** mark where set, and:

- **Value** — what the next developer gains once the cut is in, in their terms, not the code's: which kind of change then stays local (and in how many files instead of how many today), which recurring double work or breakage disappears, which open feature under `docs/features/` builds on the cut. Derive it from the change cost — a value the evidence doesn't carry is not claimed.
- **Scope** — how big the cut is: the tickets it takes (clarification tickets plus the expected implementation tickets), the lines that move or disappear, the callers and test patch targets that change, whether production code moves or only tests, and the risk class (pure move, shared helper, new module, wide refactor). Counts come from the verifier and your own greps; an estimate is marked as one ("~", "voraussichtlich").

Below the list:

- **Trade-offs**, one line each with the rule or concentration they touch. They never become tickets in this run — revisiting a rule is a decision for `/adr`.
- **Suspicions**, one line each — including large files without change cost.
- **Coverage** — "beats searched: …", the calm areas without a beat, the classes skipped and why, and the history window.

Close with a **recommendation**: per finding, take it or leave it, each with its Value and Scope in one or two sentences — why it pays off, or why it doesn't (yet). Then the **total scope** of the recommended set: how many clarification and implementation tickets, which of them can start at once, and the order against any overlapping open feature. The user decides on this basis, so it comes before the question, not after it.

Propose the feature's **slug** — short, English, kebab-case, ASCII — and get it confirmed together with which findings go in: the user decides.

**No finding is a valid result too.** Report the coverage, the trade-offs, and the suspicions, and create **no** feature.

## Create the Feature

Create the feature folder `docs/features/<slug>/`, exactly like `/new-feature` — minus its interview and user-story rounds: the findings are already evidenced, there's nothing left to ask.

Write `specifications.md` with the `/write-spec` skill. The findings fill it as:

- **Problem Statement** — what the next developer pays today: which kind of change, how often in the window, how many files it drags along — from their perspective, not the code's.
- **User Stories** — per finding, the change that stays local once it's done ("as a developer adding a new mode, I touch only …"), and that users notice nothing.
- **Relevant Conventions** — the Refactor Rules and precedents the cuts follow.
- **Out of Scope** — always: no behavior change, no new feature, no change to a Refactor Rule or a Deliberate Concentration, no change to an interface outside the codebase, nothing beyond the chosen cuts.
- **Further Notes** — the Deliberate Concentrations nearby, the hotspot numbers with window and commit, the coverage baselines, a table of Value and Scope per chosen finding as agreed with the user, the trade-offs, the suspicions, and the audit's coverage.

Then the tickets, per finding:

- **Open cut**, or a genuine open question ("is this split intended?") → **first** a clarification ticket via `/write-clarification-tickets`: type Prototype when the shape of the cut needs trying out, Brainstorming when it needs the user's judgment. Its implementation tickets come later, from `/approval` once the cut is settled. With refactors this is often the norm, not the exception — don't guess a shape to save a ticket.
- **Settled cut** → write the implementation tickets straight into `tickets/implementation/` (create the folder if it doesn't exist) with [implementation-ticket-template.md](../approval/implementation-ticket-template.md), one cut per ticket. A cut whose blast radius fans across many call sites follows the **wide refactor** sequence from `/approval` — expand, migrate in batches, contract — instead of one ticket.

Each implementation ticket's acceptance criteria hold these four, in this order:

1. **Behavior pinned** — the tests that pin the moved behavior through its public interface are named and green **before** the first move; where none exist, characterization tests are written first, asserting today's behavior, not the hoped-for one.
2. **Tests move along** — every test case at the old location has a named new home at the new interface, or is deleted because a test at the new interface now covers the same behavior (the testing rule from [DEEPENING.md](../codebase-design/DEEPENING.md)). No test is loosened, skipped, or rewritten to pass; a measured coverage baseline is not undercut.
3. **Unchanged** — observable behavior; the interface for callers outside the cut, or the callers that change listed by name; the Deliberate Concentrations nearby.
4. **Target reached** — the state that's checkable in the diff: the file's responsibilities named and each in its own module, the forwarded parameters down to a stated count, a dependency direction restored (an import that no longer exists — pinned by a dependency test where the project has one), the duplicate gone.

Each finding's tickets are independent unless one cut genuinely depends on another's — default "Blocked by" to "None (can start immediately)". Write both `specifications.md` and the tickets in the documentation language set in CLAUDE.md/AGENTS.md (default: English).

## Final Step

Commit the new feature on the current branch — stage only its folder, never `git add -A`. Never push — pushing is the user's call alone.
Report where the feature landed and list the tickets created, each with its finding's Value and Scope in one line, and the total scope. If clarification tickets exist, give the user the ready-to-paste command for the next chat: `/clarify-ticket <feature> <NN>` (first open ticket); otherwise give them `/implement <feature NN | NN-NN | all>`.
