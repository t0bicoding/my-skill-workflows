---
name: evaluate-project
description: Takes stock of a project — collects statistics and facts, gives an evidence-backed assessment along fixed dimensions, lists its weaknesses and closes with a short, adjustable set of the recommendations with the most value — always in the same report form. The evaluation is read-only; only afterwards, and only if the user picks it, chosen recommendations become a feature folder with clarification or implementation tickets. Use for an overview of where a codebase stands; not for finding bugs or vulnerabilities in depth, and not for fixing anything.
disable-model-invocation: true
---

You look and report. The evaluation ends with one report in the chat — in the form of [evaluation-template.md](evaluation-template.md) — and no other trace. Only then, in the [Hand-off](#7-hand-off), you ask whether recommendations should become a feature; nothing gets written without that answer.

## Ground Rule: Read-Only

Up to and including the report (steps 1–6), the project stays byte-for-byte as it was. That rules out:

- editing, creating or deleting any file in the project — including a report file, unless the user explicitly asks to save the report and names where;
- anything that writes as a side effect: running tests, builds, linters, formatters, type checkers, package installs or audits — they create caches, lockfile changes and build folders;
- git commands that change state (commit, checkout, stash, fetch, tag …);
- network access.

Reading files, `git log`/`show`/`ls-files`/`grep`, and the stats script are fine. What can't be learned without breaking the rule — "do the tests pass?" — goes into section 5 as **not checked**, with the reason. Say what the CI config *would* run; don't run it.

**No consequences** before the Hand-off also means: no tickets, no feature folder, no code change. Weaknesses are described, not solved; the only proposals are the recommendations of section 6 — suggestions to adapt, never carried out by this skill. The Hand-off is the single exception to the ground rule, and it writes docs only (feature folder, spec, tickets) — never code.

## Scope

`/evaluate-project [path]`
No path: the whole repository. With a path: statistics and assessment cover only that subtree — say so in the report header.

## 1. Collect the Statistics

Run the stats script from the repository root:

```bash
bash <this skill's folder>/collect-stats.sh [path]
```

It reads only git and tracked files and prints sections for repository, activity, contributors, commit messages, size, largest files, hotspots, debt markers, suppressions, infrastructure files, documentation and secret-like file names. Its numbers are the facts of section 2 — copy them, don't re-count by hand. If it fails (no git repository, no bash), collect what you can with read-only commands and note the gap in section 5.

Not a git repository → the activity figures are **not collected**; the rest still applies.

## 2. Read for Facts

The stats count; they don't explain. Read, in this order, as far as present:

1. `README*`, `CLAUDE.md` / `AGENTS.md` and other agent docs — purpose, architecture, commands, stated rules.
2. Every manifest the stats listed (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `*.csproj` …) — frameworks with versions, direct and dev dependency counts, scripts, whether versions are pinned and a lockfile exists.
3. CI config and local hooks — what actually runs as a gate, and on which parts.
4. Test, lint, type-check and format configs — strictness settings (`strict`, rule sets, coverage thresholds).
5. ADR index / architecture docs, `CHANGELOG`.

These fill sections 1 and 2's "Quality infrastructure". Everything there is a fact with a source; nothing judged yet.

## 3. Look at the Code

Statistics show where to look; reading shows what's there. Assess along the **seven fixed dimensions** of the template — always all seven, so reports stay comparable:

- **Architecture & structure** — module boundaries, layering, direction of dependencies, whether the folder layout matches the stated architecture.
- **Code quality & maintainability** — size of the largest files and functions, duplication, naming, error handling, the debt markers and suppressions in context.
- **Tests & quality gates** — what is tested and how (unit/integration/E2E), test-to-production ratio, what CI and hooks enforce, skipped tests.
- **Documentation & knowledge** — can a newcomer start, are decisions recorded, do the docs match the code.
- **Dependencies & delivery** — count, age of major versions, pinning, lockfiles, build and release path.
- **Activity & process** — commit cadence, bus factor (contributor share), commit discipline, hotspots that churn.
- **Security & operations hygiene** — secret-like files, config handling, logging of sensitive data, error exposure. A light pass, not an audit; say so.

Sample deliberately: the hotspots, the largest files, the entry points, and one typical file per main area. Read each sample fully rather than skimming many.

**Larger codebases** (roughly over 30,000 production lines or more than three main areas): fan out read-only exploration subagents — one per dimension or per area, all **in a single message** so they run in parallel. Give each the stats output, its dimension's description verbatim, and the instruction to change nothing and return observations with `path:line` evidence only. Their reports are raw material; you rate.

## 4. Rate and Name the Weaknesses

Score each dimension on the template's 1–5 scale. Each score cites at least one fact; without one, give `–` and say what's missing.

A **weakness** is an observation with **evidence** — a `path:line`, a number from the stats, a file — plus an **impact**: what it costs or risks. Without evidence it is a **suspicion** and goes into the separate one-line list. Keep the line sharp: a report where one guess sits among the weaknesses gets doubted as a whole.

- Ten weaknesses at most, sorted by the template's severity. If more qualify, keep the ten with the widest impact and mention the count of the rest in section 5.
- One weakness per cause: five oversized files from the same missing split are one weakness, with the five as evidence.
- A number is not a weakness by itself. "48 lint suppressions" becomes one only once you've looked at them and can say what they hide.
- Don't count what the project deliberately decided — an ADR or documented rule that explains it — as a weakness; at most note its cost.
- Strengths are listed too (three at most) — an evaluation that only finds faults is as skewed as one that only praises.

## 5. Recommend

Close with what's worth doing — the few changes with the most value, not a to-do list of every weakness.

- **Five at most**, rated on the template's value and effort scales and sorted by value, then by lower effort. Value comes from the weaknesses a recommendation resolves; one that resolves several weaknesses with one cause beats several narrow ones.
- **Every recommendation names its weaknesses** (`W1`, `W3`). No weakness behind it → it doesn't belong in this report.
- **Make each one adjustable:** give the smallest version that already pays off and a fuller one, each with its effort, and what it depends on or would conflict with. The user tailors the recommendation; you don't choose for them.
- **Respect what the project decided.** A recommendation that would overturn an ADR or a documented rule says so in its knob — it's a decision to revisit, not a quick fix.
- **Name what's still open.** Every recommendation fills its **Open** line: the questions that must be answered before building it, each with its kind (Brainstorming, Prototype, Research, ADR) — or "none". This line decides the route in the Hand-off, so don't hide a real question to make a recommendation look ready.
- Weaknesses left without a recommendation go into "Left out" with the reason, so none drops silently.

## 6. Report

Fill [evaluation-template.md](evaluation-template.md) completely and post it in the chat. Labels in the chat language the project sets in `CLAUDE.md` / `AGENTS.md` (default: English), structure exactly as the template, every section present.

The recommendations close the report. Then continue with the Hand-off — in the same answer, right below the report.

## 7. Hand-off

Ask in the chat what should happen with the recommendations. Give your suggested route per recommendation — from its **Open** line — and let the user choose:

1. **Leave it at the report** — nothing is written; the run ends here. This is always an option and the answer to silence.
2. **Feature with clarification tickets** — for recommendations with open questions. Folder, `specifications.md`, one clarification ticket per open question; building comes after `/clarify-ticket` and `/approval`.
3. **Feature with implementation tickets** — for recommendations whose Open line says "none". Folder, `specifications.md`, implementation tickets ready for `/implement`.
4. **Hand over to `/refactor-audit <area>`** — for recommendations that split, extract, or untangle code (weaknesses in *Architecture & structure* or *Code quality & maintainability*). Nothing is written here; it evidences the change cost per file in the history, finds the cut, and pins the tests before anything moves. Give the ready-to-paste command with the area the weakness names.

Ask with it, in the same question round:

- **Which recommendations** (`R1`, `R3` …) and **which variant** of each — smallest or fuller, or the user's own adjustment. A knob the user leaves unset is an open question, not your choice: it turns route 3 into route 2 for that recommendation.
- **The slug** — propose one per feature, short, English, kebab-case, ASCII. Default to one feature per recommendation; recommendations that resolve the same weakness or touch the same area may share one — propose it, the user confirms.

Mixed answers are fine: one feature can take route 2, another route 3, a third recommendation route 4. Nothing gets written before the user has answered.

### Create the Feature

Create `docs/features/<slug>/` exactly like `/new-feature` — minus its interview and user-story rounds: the evaluation already holds the evidence. Write `specifications.md` with the `/write-spec` skill, filled from the report:

- **Problem Statement** — the weaknesses the recommendation resolves, with their evidence and impact, from the perspective of whoever bears the cost today.
- **User Stories** — the state that holds once the chosen variant is done.
- **Out of Scope** — the parts of the fuller variant the user didn't pick, and anything beyond the recommendation itself.
- **Further Notes** — the report's date and commit, the dimension scores this touches, and related suspicions.

Then, per route:

- **Route 2:** write one clarification ticket per open question with `/write-clarification-tickets`, kind as in the Open line. Already settled parts go straight into the spec, not into a ticket.
- **Route 3:** write the implementation tickets straight into `tickets/implementation/` with [implementation-ticket-template.md](../approval/implementation-ticket-template.md), in the tracer-bullet cut from `/approval` — vertical slices, prefactoring first, coarsest slice that still fits, blocking edges between them. If a question surfaces while cutting, the feature falls back to route 2 for that question: clarification ticket, no guessed decision.

Spec and tickets in the documentation language set in `CLAUDE.md` / `AGENTS.md` (default: English).

### Final Step

Commit the new feature folder(s) on the current branch — stage only those paths, never `git add -A`. Never push; pushing is the user's call alone. Report where each feature landed and list its tickets. Then give the ready-to-paste command for the next chat: `/clarify-ticket <feature> <NN>` (first open ticket) if clarification tickets exist, otherwise `/implement <feature NN | NN-NN | all>`. For each recommendation on route 4, add `/refactor-audit <area>`.
