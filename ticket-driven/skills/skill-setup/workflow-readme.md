# Workflow

This project uses a skill-driven workflow to carry features from idea to completion.

**New to the project, or back after a while?** Start with `/compass`. It shows which features are open and what each one does, where each one stands, what blocks or contradicts what, and in which order to go on — with the next command to paste. It only reads and changes nothing.

## Flow

```
/skill-setup  (once)
      │  scaffolds docs/, runs the Configuration Wizard
      ▼
/new-feature <idea>
      │  spec + first clarification tickets
      ▼
clarification tickets  ◄──────────────┐
      │                               │ still open
      ▼                               │
/clarify-ticket <feature NN> ─────────┘
      │  folds the decision into specifications.md
      ▼
/approval <feature>
      │  breaks the spec into implementation tickets
      ▼
implementation tickets  ◄─────────────┐
      │                               │ still open
      ▼                               │
/implement <feature NN | NN-NN | all> ┘
      │  build subagent + two parallel review subagents
      ▼
/human-review <feature>  (optional)
      │  walks through the spots only a human can judge;
      │  findings become implementation tickets → back to /implement
      ▼
/close-feature <feature>
      │  verifies tickets closed, summarizes, prunes docs/
      ▼
feature shipped
```

`/hunt-bugs <area>` is an alternate entry point beside `/new-feature`: instead of an idea, it starts from evidenced bugs found in the standing code and produces the same kind of feature folder, but skips `/approval` — its implementation tickets are already broken into tracer-bullet slices, one per finding, so it rejoins the diagram straight at "implementation tickets".

`/security-audit <area>` is a third entry point, same shape as `/hunt-bugs` but hunting security vulnerabilities (injection, broken access control, sensitive data exposure, …) instead of general bug classes. It also skips `/approval` and rejoins the diagram at "implementation tickets".

`/performance-audit <area | feature>` is a fourth entry point, same shape again, but hunting evidenced performance problems (query patterns, roundtrips, blocking calls, render load, …) under a fixed priority: function, then quality, then speed. Before the hunt it lists the slowness the project's rules and ADRs deliberately accept and the data sizes that are realistic; a fix touching either is a trade-off, not a finding. Each ticket pins today's behavior in a test before it optimizes. It also skips `/approval` and rejoins the diagram at "implementation tickets".

`/refactor-audit <area | feature>` is a fifth entry point, same shape again, but hunting structural problems (overloaded files, long units, pass-through interfaces, duplication, tangled dependencies, test misfit) under a fixed priority: behavior, then safety net, then structure. Size alone is no finding — a finding needs a change cost the git history evidences, measured by a hotspot script (lines × changes, change coupling, test fit). Before the hunt it lists the refactor rules every cut follows and the places the project deliberately keeps in one spot; a cut that splits one is a trade-off. Each ticket pins behavior in tests before anything moves, and the tests move with the code — no test case gets lost. A cut whose shape is still open starts as a clarification ticket; settled cuts skip `/approval` and rejoin the diagram at "implementation tickets".

`/evaluate-project [path]` is a sixth entry point, but a read-only one at first: it takes stock of the project — statistics, a rating along seven fixed dimensions, evidenced weaknesses and at most five adjustable recommendations — always in the same report form, so reports months apart can be compared. Only if the user then picks recommendations does it create a feature folder: with clarification tickets where questions are still open (rejoining the diagram at "clarification tickets"), or with implementation tickets where none are (rejoining at "implementation tickets"). Started by the user only.

`/quick <description>` is a fast lane beside the diagram, for a small change that's already clear: no interview, spec, `/approval`, or feature folder, but the same build subagent and two reviewers as `/implement`. A size gate sends anything with an open decision, a migration, or more than one slice back to `/new-feature`.

Kept current automatically along the way — run by `/skill-setup` and `/close-feature`, nothing to invoke by hand:

- `/context-maintainer` → `CONTEXT.md` / `CONTEXT-MAP.md`
- `/agents-maintainer` → `CLAUDE.md` / `AGENTS.md`
- `/readme-maintainer` → `README.md`

Likewise, but run by `/human-review` at its end (and by hand when wanted):

- `/review-maintainer` → `docs/workflow/must-read-zones.md` — the code areas whose every change the user reads as a raw diff in `/human-review`. Repairs what a rename left stale, asks whether a zone candidate from the review belongs on the list, and offers a first set when the file doesn't exist yet. The list never grows or shrinks without the user's word.

## Steps

1. `/new-feature <idea>` — clarifies via interview or brainstorming (chosen at the start), creates the feature folder, writes `specifications.md` and the first clarification tickets.
2. `/hunt-bugs <area>` — alternative entry point: hunts the standing codebase for evidenced bugs and writes `specifications.md` plus implementation tickets directly into a new feature folder, skipping `/approval` since each finding's trigger is already its test case. Genuine open questions still get a clarification ticket.
3. `/security-audit <area>` — alternative entry point: same idea as `/hunt-bugs`, but hunts for evidenced security vulnerabilities (injection, broken access control, sensitive data exposure, …) instead of general bug classes. Also skips `/approval`.
4. `/performance-audit <area | feature>` — alternative entry point: same idea as `/hunt-bugs`, but hunts for evidenced performance problems, always putting function and quality before speed. First lists the slowness the project deliberately accepts (rules, ADRs, a default list) and the realistic data sizes, and has the user confirm both; findings need a scale and a cost, a fix that touches protected slowness is reported as a trade-off. Each ticket pins behavior first, then the cost (query, roundtrip, or render count — no wall-clock assertions). Also skips `/approval`.
5. `/refactor-audit <area | feature>` — alternative entry point: same idea as `/hunt-bugs`, but hunts for overloaded files and tangled structure whose change cost the git history evidences. First lists the refactor rules and the deliberate concentrations (rules, ADRs, a default list) plus the hotspot map, and has the user confirm them; findings need a change cost with an example commit, a cut sketch and a safety net. Each ticket pins behavior first, moves the tests along without losing a case, and names a target checkable in the diff. Open cuts get a Prototype or Brainstorming ticket first; settled cuts skip `/approval`.
6. `/evaluate-project [path]` — alternative entry point: evaluates the whole repository (or one subtree) read-only and posts a fixed-form report — facts, scores on seven dimensions, evidenced weaknesses, up to five recommendations with a smallest and a fuller variant. Afterwards it asks what should happen with them: leave it at the report, or turn chosen recommendations into a feature with clarification tickets (open questions) or implementation tickets (nothing open). Started by the user only — the model never invokes it on its own.
7. `/clarify-ticket <feature NN>` — resolves one clarification ticket (Brainstorming, Prototype, Research, or ADR) and folds the decision into `specifications.md`.
8. `/approval <feature>` — breaks the settled `specifications.md` into implementation tickets: vertical tracer-bullet slices with blocking edges.
9. `/implement <feature NN | NN-NN | all> [--after <feature>]` — builds each implementation ticket via a build subagent, then two parallel review subagents (Standards, Spec). With `--after`, the run first waits until the named feature's implementation tickets are all closed and committed, so several features can be queued in separate chats.
10. `/human-review <feature>` — optional: reads the commits of the closed implementation tickets (one subagent per ticket) and walks the user through at most ten spots only a human can judge — silent decisions, domain logic, user experience, weakened tests, hard-to-reverse changes. First a map of the feature (its flow from trigger to result, drawn from today's code) and an overview, then the raw diffs of every must-read zone the feature touched — read without explanation — then one spot per turn, short enough for one screen: a head with its name, kind, severity, location, a link to its ticket's diff and the ticket, a flow diagram from the user's action through the linked functions to the spot's line, what the line decides, what the plan says and what can go wrong, and one to three questions with answer options and a recommendation — or, for how something feels, a short guide to try values yourself. Findings become implementation tickets for `/implement`; `human-review.md` in the feature folder records what was looked at, so a second run reviews only what's new. At the end, `/review-maintainer` checks the zones and asks about new ones. Changes no code itself.
11. `/close-feature <feature>` — verifies every ticket is closed, summarizes what the feature delivers (with one line on the human review, even when it didn't run), refreshes `CONTEXT.md`/`CONTEXT-MAP.md`, `CLAUDE.md`/`AGENTS.md`, and `README.md` if anything changed, and moves the feature to `docs/features/closed/`.

Also available:

- `/quick <description>` — builds one small, already-clear change without the feature pipeline. Checks the size first (an open decision, a migration, more than one slice, or an ADR-worthy call → `/new-feature`), asks at most one question, shows a mini-ticket for one okay, writes it to `docs/quick/`, then runs the build and review loop from `/implement`. Once both reviewers report clean, the ticket moves to `docs/quick/closed/` and the change is committed; a stopped run leaves the ticket open.
- `/interview <topic>` — question rounds to clarify, standalone or invoked from another skill.
- `/brainstorming <topic>` — conversational alternative to `/interview`: one point per turn with risks, worst cases and a recommendation, standalone or invoked from another skill.
- `/write-spec` — writes or updates `specifications.md` straight from the conversation context.
- `/adr` — decides whether a decision just made is worth recording as an ADR; `/write-adr` creates it.
- `/tdd` — reference for test-driven work, used by the implementer subagent.
- `/skill-setup` — creates this folder structure and this file, and runs the Configuration Wizard (repo shape, documentation language, project description), once.
- `/wizard` — generates a throwaway bash script that walks a human through a manual step the agent can't do itself (provisioning infrastructure, credentials or CI secrets, an unfamiliar third-party dashboard, a one-off migration). Not part of the feature pipeline — reach for it whenever a ticket hits a step only a human can perform.
- `/resolving-merge-conflicts` — resolves an in-progress git merge/rebase conflict. Not part of the feature pipeline — reach for it whenever a merge or rebase leaves conflicts to sort out.
- `/compass [feature]` — a bearing over all open work in `docs/`: which features (and leftover quick tickets) are open, what each one does for the user in a sentence, its stage (clarifying, ready to cut, building, ready to close) and what blocks it — hard edges (`⛔`: *Blocked by*, open clarification tickets, a feature a source says waits for another) with their source, soft ones (`⚠`: two open items name the same file) marked as derived. Plus the conflicts between features (`⚡`), numbered and quoting both sides: contradiction, pulled rug (one reshapes or removes what the other's tickets build on), duplicate work, scope gap — weighted blocking, costly or unsure, each with how to settle it, never settled itself; a blocking conflict holds both sides' tickets until it is settled. From that, a recommended order with a reason per step, lanes that can run in parallel chats (`/implement … --after …`), what waits for the user's judgment, and oddities such as a closed ticket in an open folder. With a feature name, the same for that feature's tickets. Useful at any point in the flow, above all before the next `/implement`. Project-independent and read-only: changes no code and no docs, moves no ticket, remembers nothing. The model may start it on its own too.
- `/docs-maintainer` — prunes `docs/`: checks every doc, closed features included, against today's code and keeps only what still earns its place. Never touches open features, open quick tickets, or `docs/adr/`. Started by the user only — no skill calls it and the model never invokes it on its own.
- `/tool-speed-audit [--sessions N | --days D]` — measures from this project's Claude Code session transcripts where tool-call time goes (heavy builds and tests in the loop, permission waits, the auto-mode classifier, failed attempts and retries, sleeps, hooks, slow search and file I/O, environment drag) and proposes changes that make future sessions faster. Read-only until the report: a fixed-form report in the chat plus an HTML page with the time split, the slowest command groups and the proposals. Then the user names in a plain chat reply which proposals to apply — no question dialog; only those get applied, machine-level steps are only described. Project-independent; started by the user only.
- `/agents-context-audit [--sessions N | --days D]` — measures from the same transcripts why the context fills up or carries a heavy load: the start load (skill and agent listings, `CLAUDE.md` and imports, MCP servers), big tool results, files read twice, large skill texts, long subagent reports, sessions that run on — and proposes changes that keep future sessions lean. Same shape: read-only report in the chat plus an HTML page with the context curve per session and the make-up of the start load, then the user confirms in the chat which proposals to apply. Project-independent; started by the user only.

## E2E in the flow

If a project has an end-to-end suite, it takes part at four points — without any skill knowing anything about the project. The project explains its suite in an `E2E` section in `AGENTS.md` (in `CLAUDE.md` for a single-file setup), right next to the gates; the skills read only that section:

- `/approval` — the implementation ticket gets an optional "E2E scenario" field: which scenario is new or extended, and what it proves from the user's point of view. Filled only if the section exists **and** the ticket delivers a user flow that crosses layers.
- `/implement` — if the ticket names a scenario, the build subagent writes or extends it and runs it on its own; the spec-axis review subagent checks that it exists, covers the ticket's behaviour, and runs green.
- `/close-feature` — runs the full suite as the final proof before moving the feature to `closed/`. On red, the skill asks whether to close anyway, like it does for open tickets.
- `/agents-maintainer` — recognizes a suite by common traces (a config file of an E2E tool, an `e2e` or `test:e2e` script in a `package.json`), creates the section, keeps it current, and removes it when the suite goes away.

The section is the contract between project and skills, with four fields whose names stay stable:

| Field | Meaning |
|---|---|
| Command | The full suite, as the final proof (`Befehl` in a German project) |
| Single scenario | One scenario, with a placeholder for file or title (`Szenario einzeln`) |
| Location | Where the scenarios live (`Ort`) |
| Prerequisites | What must be in place once on a developer machine (`Voraussetzungen`) |

A project meets the contract if its four fields carry these meanings. **If the section is missing, every skill skips it silently:** no E2E step, no question, no hint. The section is not a project ADR, it is part of the workflow wiring.

## Clarification ticket types

| Type | Purpose | Skill |
|---|---|---|
| Brainstorming | Open points need the user's judgment | `/brainstorming` |
| Prototype | A UI or logic question needs to be tried out | `/prototype` |
| Research | A factual question has a discoverable answer | `/research` |
| ADR | The decision is hard to reverse and worth recording | `/adr` |

Implementation tickets are a separate type: they come from `/approval`, `/hunt-bugs`, `/security-audit`, `/performance-audit`, `/refactor-audit`, `/evaluate-project`, or `/human-review`, and are built via `/implement`, not `/clarify-ticket`.

## Folder structure

```
docs/
  adr/        project-wide architecture decisions
  features/   feature efforts, open ones directly inside
    closed/   closed features (moved there by /close-feature)
  quick/      quick tickets from /quick, open ones directly inside
    closed/   built and reviewed clean (moved there by /quick)
  workflow/   this doc, and must-read-zones.md once /review-maintainer has written it
```

Per feature (`docs/features/<name>/`):

- `specifications.md`
- `tickets/clarification/` — open clarification tickets
- `tickets/clarification/closed/` — clarification tickets once closed and folded into the spec (moved there by `/clarify-ticket`)
- `tickets/implementation/` — open implementation tickets
- `tickets/implementation/closed/` — implementation tickets once closed and reviewed clean (moved there by `/implement`)
- `human-review.md` — only if `/human-review` ran: the tickets reviewed per run, the zones read and the verdict per spot

Project-wide configuration (documentation language, repo shape) isn't set up yet.
