---
name: docs-maintainer
description: Prunes docs/ down to what still holds for today's code and still earns its place — checks every file, closed features included, corrects or trims what went stale, deletes what's redundant or pure process record. Never touches open features or ADRs. Run only when the user invokes /docs-maintainer.
disable-model-invocation: true
---

Docs rot quietly: a spec describes behavior the code dropped two features ago, a ticket repeats what the code now says better, a plan outlives its purpose. This skill keeps `docs/` to what a future reader still needs — and acts only where that judgment is certain.

## Scope

In scope: every file under `docs/`, except the protected ones.

**Protected — never edit, move, or delete:**

- **`docs/adr/`**, all of it. ADRs are the record of decisions; superseding one is `/write-adr`'s job. They still count as evidence (see below).
- **Open features**: every folder directly under `docs/features/` other than `closed/`. A feature is closed once `/close-feature` has moved it to `docs/features/closed/<name>/`; until then, everything in it is work in progress, however stale it looks.
- **Open quick tickets**: every file directly in `docs/quick/`. `/quick` moves a ticket to `docs/quick/closed/` once it's built; one still outside is a stopped run waiting for the user. Closed quick tickets are in scope like closed features.
- **`docs/reviews/`**, all of it — the area trails of `/human-review --area`. The next run on an area reads its trail to skip what a human already judged; pruning one would send them through the same spots again.
- **`docs/workflow/must-read-zones.md`** — kept by `/review-maintainer`, which checks it against the code and changes it only on the user's word.
- **Non-text assets** (images, PDFs, sample data) outside `docs/features/closed/` — whether a sample file still serves someone can't be read from the code.

Files outside `docs/` (`CLAUDE.md`/`AGENTS.md`, `CONTEXT.md`, `README.md`, code) have their own maintainers. Touch them only to repoint a reference to a doc this run moves or deletes.

## What Earns Its Place

A passage stays only if all three hold:

1. **True for today's code** — checked against the code itself, not against what another doc claims.
2. **Not already said elsewhere** — by the code, its tests or comments, an ADR, `CLAUDE.md`/`AGENTS.md`, `CONTEXT.md`, `README.md`, or another doc that survives this run. One place per fact.
3. **Needed by someone later** — the *why* behind a design and the alternatives rejected with their reason, measured facts and external constraints (a library's, OS's, or device's behavior), operating procedures, a trap that already bit once, the product's intent.

What goes:

- **Process record** — ticket status, review rounds, build logs, worked-through checklists, plans whose result is now the code. Git history keeps all of it.
- **Behavior the code no longer has**, or never got.
- **Duplicates** of a surviving source.
- **Throwaway probes and prototypes** of a closed feature, once their result lives in a spec, ADR, or the code. A prototype **stage** stays: an area folder's `STAGE.md` with its scripts and `.gitignore` (under the root in `AGENTS.md › Prototypes`) is kept for the next prototype in that area, whatever feature built it.

A closed feature usually shrinks to its `specifications.md`, cut down to the rationale and constraints the code can't tell — or disappears entirely when nothing of that kind is left.

## Certainty

Act only where the verdict is certain. Every *stale* or *redundant* verdict carries **evidence**: file:line in the code that contradicts the passage, or the path of the surviving doc that already says it. No evidence, or evidence that reads two ways → **unsure**: leave the file untouched and list it in the report.

Correct a stale statement only when the current state is read straight from the code; otherwise cut it or mark it unsure. A stale paragraph left in place and listed costs little; a live one deleted costs knowledge nobody knows is missing.

## Inbound References

Before deleting or trimming anything, search the whole repository — code, configs, `CLAUDE.md`/`AGENTS.md`, READMEs, other docs — for the file's path and name. A referenced passage goes only if its content moves to a surviving place (or the reference itself has become obsolete) and every reference is repointed in the same run. Otherwise the referenced part stays.

## Process

1. **Inventory.** List every in-scope file and cut it into **batches**, each sized to one context window: one closed feature per batch; other folders by folder, splitting large ones. This list is your completion criterion — the run is done when every batch has its report.
2. **Collect what already speaks.** Read `CLAUDE.md`/`AGENTS.md`, `CONTEXT.md`, `README.md`, and the ADR titles under `docs/adr/`, so redundancy can be judged against them.
3. **Send the auditors.** Launch one instance of the Docs-Auditor Subagent [docs-auditor.md](../../agents/docs-auditor.md) per batch, all **in a single message** so they run in parallel. Give each its file list, the sections *What Earns Its Place* and *Certainty* verbatim, and the list of places that already speak.
4. **Cross-check.** Auditor reports are raw material, not decisions. Yourself:
   - Open the cited evidence of every *delete* and *correct* verdict. If it doesn't hold, downgrade the verdict to unsure.
   - **Resolve chains.** A passage judged redundant with B stays if B is itself slated to go — or its content moves into a place that survives.
   - Run the inbound-reference search for every file that loses content.
5. **Present the plan**, grouped by action — delete, trim, correct, unsure — one line of reason and evidence each, a folder collapsed into one line when all of it goes. The user confirms or strikes items; nothing is deleted before that.
6. **Apply** the confirmed plan: delete, trim, correct, repoint references, remove folders left empty, and fix any index or link list inside `docs/` that pointed at removed files. Write in the documentation language set in `CLAUDE.md`/`AGENTS.md` › Language (default: English).

Something worth keeping that belongs elsewhere — a decision that deserves an ADR, a standing rule for `CLAUDE.md`/`AGENTS.md`, a domain term for `CONTEXT.md` — is reported as a hint, not written: that's `/adr`, `/agents-maintainer`, and `/context-maintainer`'s job.

## Final Step

Report what was deleted, trimmed, and corrected (counts plus notable items), the unsure list with what would settle each, and the hints. If nothing needed a change, say so.

Commit on the current branch. Never push — pushing is the user's call alone.
