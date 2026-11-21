---
name: compass
description: Shows all open work in the project's docs — open features and quick tickets, their stage, blockers, clashes between features and the order to work them off, with the next command. Read-only. Use for "what's open?", "what next?", "in which order?", "status of the features", "do any features clash?". Not for one ticket in depth — that's /explain-me.
---

A navigator, not a driver. The user has several features in flight and wants to know where they stand and which way to go. You read the docs as they are, draw the map — open work, blockers, order — and stop. You never move a ticket, edit a status or start a skill.

## Terms

- **Work item** — something open in the docs: an **open feature** (a feature folder outside `closed/`) or an **open quick ticket** (left behind by an aborted quick run).
- **Stage** — where an open feature stands, derived from its folder, never from what its spec claims:
  - **clarifying** — clarification tickets still `open` or `in-progress`, no implementation tickets yet → next is the clarify skill;
  - **ready to cut** — a spec, no open clarification tickets, no implementation tickets → next is the approval skill;
  - **building** — open implementation tickets (clarification tickets may still be open beside them, as an audit skill leaves them) → next is the implement skill;
  - **ready to close** — every implementation ticket closed, folder not yet under `closed/` → next is human review (optional) or the close skill;
  - **spec only / unclear** — no spec, or a folder the workflow doesn't describe → name it as such.
- **Blocker** — something that must happen before a work item or ticket can start. Two strengths:
  - **hard** (`⛔`) — a source says so: a ticket's *Blocked by*, an open clarification ticket that states what it blocks, the stage gate (no implementation before the clarifications are settled), a spec or ticket that says this one waits for another.
  - **soft** (`⚠`) — nothing forbids starting, but starting now costs: two open items name the same file, module or symbol (merge conflicts, one rewriting what the other just built), or a source asks to coordinate ("whoever builds second keeps both promises").
- **Conflict** (`⚡`) — two open work items whose plans don't fit together, so building both as written leaves one of them wrong. Overlap says *they touch the same place*; a conflict says *what they do there clashes*. Four kinds:
  - **contradiction** — they promise opposite behavior for the same thing (one asks before deleting, the other deletes directly; one keeps a field, the other drops it), or settle the same question differently;
  - **pulled rug** — one removes, renames, moves or reshapes code, a rule or an ADR that the other's tickets build on or cite, so the other's tickets go stale once the first lands;
  - **duplicate** — both plan the same change (the same fix, the same function, the same test), so whoever builds second does it twice or fights the first;
  - **scope gap** — one counts on the other for a piece the other declares out of scope (or both declare it out of scope), so nobody builds it.
- **Lane** — a chain of work items that touch nothing in common with other lanes, so it can run in its own chat in parallel.

## Language

All labels in this skill and its template are English. Write them in the chat language the project sets in `CLAUDE.md` / `AGENTS.md` (default: English); the signs (`🧭 ⛔ ⚠ ⚡ ✅ ▶ ⏸ 🙋 ➡️`) stay as they are. Feature names, ticket titles and identifiers stay as the docs wrote them. Where the project has a domain vocabulary (`CONTEXT.md` or `CONTEXT-MAP.md`), the summaries use its words.

## Ground Rules

- **Nothing changes.** No file created, edited, moved or deleted in the repository, no command with side effects (tests, builds, linters, installs, migrations), git only to read. No ticket status fixed, no commit, no memory, no note. The report lives in the chat.
- **The folders decide, not the prose.** A ticket's state is where it lies (`closed/` or not) together with its `Status:` field. Where the two disagree, report it under *Oddities* — never decide which one is right, never repair it.
- **Never invent a blocker or a conflict.** Every `⛔` names its source (`file:line` or the ticket's *Blocked by*). A blocker you inferred from overlapping code is `⚠` and says *derived: both touch `<file>`*. Every `⚡` quotes **both** sides with their sources — what A says, what B says. Where the two texts allow a reading in which they fit, the conflict is marked *unsure* and phrased as the question that settles it. A connection you only suspect without two passages to show stays out.
- **Name the conflict, don't resolve it.** Say which side would have to give and which skill settles it — never edit a spec or ticket, never pick the winner silently.
- **Recommend, don't command.** The order is a recommendation; each step carries its reason. Hard edges are never broken by it — a step that would break one is not a choice, it's a mistake.
- **Short.** The report fits about two screens. One row per feature, one line per step. Depth is what the follow-up questions are for.

## Start

`/compass [<feature>]`

- No argument → every open work item.
- A feature name or folder → the same report narrowed to that feature: its tickets one by one, their order, and only the cross-feature relations and conflicts it is part of — the conflict check still compares it against every other open item.
- A name that matches no open feature → say so, list the open ones, stop. A name under `closed/` → say it is closed; `/explain-me` explains closed work.

## 1. Find the workflow

Read once per session: `CLAUDE.md` / `AGENTS.md` (chat language), `CONTEXT.md` or `CONTEXT-MAP.md`, and the workflow description if the project has one (e.g. `docs/workflow/README.md`) — it says where features, tickets and quick tickets live and which skills move them.

Without such a description, assume the common layout and check it exists:

```
docs/features/<feature>/specifications.md
docs/features/<feature>/tickets/clarification/[closed/|delegated/]
docs/features/<feature>/tickets/implementation/[closed/]
docs/features/closed/                       finished features
docs/quick/  (+ closed/)                    quick tickets
```

Nothing of the kind found → look for folders holding a `specifications.md` or ticket files with a `Status:` line; still nothing → say the project has no open work in a form this skill can read, and stop.

Name the next-step skills only if they exist in `.claude/skills/` (or the project's skill folder); otherwise describe the step in words.

## 2. Gather

Read only what the report needs.

**Per open feature**
- `specifications.md`: the title, and from the problem statement and solution enough for **one sentence** of what the feature does for the user; any stated severity or priority (e.g. "High", "W1, Medium"); every mention of another feature, quick ticket or ADR-in-progress.
- Every ticket file outside `closed/`: the header (`Ticket`, `Status`, `Model`, `Effort`), the *Blocked by* section; for a clarification ticket also what it says it blocks.
- The count of tickets under `closed/` and `delegated/` — for progress, not read in full.
- The code locations each open ticket names (backticked paths, `module › symbol`, "Fundstelle"/"Location" lines) — reduced to file or module, for the overlap check. A feature without implementation tickets contributes the locations its spec names.
- For the conflict check, per feature: the spec's solution, decisions and out-of-scope list, the rules and ADRs it cites or plans to change, and the domain terms it changes (renames, removes, redefines). Read a ticket's *What to build*, *Implementation Decisions* and *Out of Scope* in full only where step 4 asks for it.

**Open quick tickets** — header and title; they usually mean a quick run was aborted.

**Scale** — up to about eight open features, read them yourself. More → one `Explore` subagent per batch of features, each returning per feature exactly the fields above (title, one-sentence purpose, stage inputs, ticket headers with *Blocked by*, mentions of other items, named code locations, conflict inputs) — never file dumps.

## 3. Work out the blockers

1. **Ticket edges** — each open ticket's *Blocked by*. A blocker that is closed is satisfied; one that doesn't exist is an oddity.
2. **Stage gate** — a feature in *clarifying* is blocked by its open clarification tickets; they need the user (`🙋`). In *building* with clarification tickets still open, a clarification ticket blocks only the implementation tickets it names or plainly concerns; one that names none blocks nothing hard — say that it is open beside the build.
3. **Cross-feature** — every mention of another open item found in step 2: read the sentence. Says one waits for the other, builds on it or must come after it → `⛔`. Says to coordinate, touches the same path, "whoever builds second" → `⚠`. A mere reference → nothing. A mention of a closed feature → satisfied, leave it out.
4. **Overlap** — two open items from different features (or a feature and a quick ticket) naming the same file or module → `⚠ derived`. Same layer or same folder alone is not overlap.
5. **Cycles** — a cycle of hard edges can't be ordered: report it under *Oddities* with its edges, and order around it.

## 4. Find the conflicts

Comparing every feature with every other in full is too much; narrow first, then read closely.

1. **Candidate pairs** — two open items are a candidate when any of these holds:
   - they overlap (step 3.4) or mention each other (step 3.3);
   - they name the same domain term, endpoint, table, setting, rule or ADR;
   - one plans to remove, rename, move or reshape something (a file, symbol, term, rule, ADR) the other names;
   - one's out-of-scope list names something the other's solution touches, or the other way round.
2. **Read each pair closely** — for both items, the passages at the shared point: the spec's solution and decisions, the tickets' *What to build*, *Implementation Decisions*, *Out of Scope*, and the decisions of closed clarification tickets. Ask four questions, one per kind:
   - Do they promise different behavior for the same thing, or settle the same question differently? → **contradiction**
   - Does one take away or reshape what the other's tickets build on or cite, by name? → **pulled rug**
   - Do they plan the same change? → **duplicate**
   - Does a piece fall between them — one relies on it, the other excludes it, or both exclude it? → **scope gap**
   No to all four → plain overlap, already a `⚠`; not a conflict.
3. **Check against `HEAD`** where a conflict hinges on the code as it is — a symbol one side relies on that the other removes is only a pulled rug if the first side really uses it. A quick read, no command with side effects.
4. **Weigh it** — **blocking**: building both as written leaves wrong behavior or a broken build (contradiction, pulled rug on a ticket not yet built, duplicate of the same lines); **costly**: it works out, but one side redoes work or a ticket goes stale; **unsure**: the texts allow a reading in which they fit.
5. **Say how it is settled** — per conflict, the side that would most naturally give, and how: one feature's spec adjusts (the spec or brainstorming skill), a clarification ticket on one side (the clarification-ticket skill), a hard edge so they land in order, or one drops the duplicate. Never settle it here.

**Scale** — more than about six candidate pairs → one `Explore` subagent per pair, given both items' paths and the shared point, returning: kind or *none*, both quoted passages with `file:line`, weight, and the side that would give — never file dumps.

## 5. Work out the order

Build the order in this sequence of rules; each step's reason names the rule that placed it.

1. **Hard edges first** — topological order over all `⛔`. Never broken.
2. **Settle blocking conflicts before building into them** — a ticket on either side of a *blocking* `⚡` is held (`⏸ conflict`) until the conflict is settled; settling it goes to the top of *Waits for you*. A *costly* conflict orders the pair instead. For a pulled rug there are two ways: the reshaping side first and the relying side's tickets revised after, or the relying side first and the reshaping side carries its new code along — pick the one with less rework (usually: the side with fewer open tickets at the shared point goes second) and say which.
3. **Finish what's started** — a ticket `in-progress` comes first, marked `▶ running?`: another chat may be building it; recommend checking before starting it twice.
4. **Unblock the most** — among what can start, the item whose completion frees the most others.
5. **Weight by stated risk** — what the specs themselves rank higher (severity, data loss, security, correctness) before tooling, performance and refactoring. Only a rank a spec states counts; never rank by your own reading of importance.
6. **Serialize overlaps** — two items with `⚠` overlap go one after the other, not in parallel. Which first: the one a source names as first; otherwise fixes with user impact before a restructuring of the same area, and a restructuring before new features in that area ("make the change easy, then make the easy change"). Say which way you went and why — this is the place the user is most likely to overrule.
7. **Small and ready, as the last tie-break** — few tickets, `Medium` effort, nothing to clarify: clears the board.

Then split the result into what runs without the user and what needs them:

- **Lanes** — chains with no overlap and no conflict between them; each can run in its own chat. Give the commands, chaining a lane's later feature with the implement skill's wait option if it has one (`/implement <B> all --after <A>`).
- **Waits for you** (`🙋`) — settling blocking conflicts, clarification tickets, approvals and reviews: they need the user's judgment, and can be done while a lane builds. Blocking conflicts first, then the one that unblocks the most.

## 6. Write the report

Per [report-template.md](report-template.md). Then stop.

## After the Report

The user may answer:

- **a feature name** → the narrowed report for that feature.
- **`why <step>`** or a question about the order → answer from the sources, in a few sentences, with links.
- **`conflict <n>`** → that conflict in full: both passages quoted at length, what building both as written would do, and the ways to settle it with their cost — still without settling it.
- **a ticket or feature to understand** → point to `/explain-me <target>` if it exists; don't explain in depth here.
- **an oddity to fix** → name the skill that owns it (the implement skill for a ticket in the wrong folder after a run, the close skill for a finished feature, …) or that it is a hand edit — never fix it yourself.
- anything else → the conversation goes on normally; this skill has ended.
