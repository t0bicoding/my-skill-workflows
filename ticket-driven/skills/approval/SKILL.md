---
name: approval
description: Break a feature's settled specifications.md into implementation tickets — tracer-bullet vertical slices, each declaring the tickets that block it. Use once every clarification ticket for the feature is resolved or delegated (or none were needed).
disable-model-invocation: true
---

An **implementation ticket** is a unit of buildable, verifiable work — a different object from a **clarification ticket** (an open question, resolved by `/clarify-ticket` before this skill runs, or delegated to this skill — see step 2). This skill only produces implementation tickets, into `<feature folder>/tickets/implementation/`. Create the folder if it doesn't exist. Write them in the documentation language set in CLAUDE.md/AGENTS.md (default: English).

## Process

### 1. Preparation

`/approval <Feature title>`
If the user hasn't given a feature title, ask.

### 2. Gather context

Read the feature's `specifications.md`. If any clarification tickets exist for this feature, read their Decisions sections too, so settled answers aren't re-litigated.

List every clarification ticket still `open` or `in-progress`. If any remain, show them to the user and ask whether each should be **delegated**: the question stays unresolved by the user, and this skill decides it itself while drafting the tickets below, recording the call as an Implementation Decision in the resulting ticket(s). For every ticket the user delegates: set its Status to `delegated`, move it into `tickets/clarification/delegated/` (create the folder if needed), and write the decision you land on into its Decisions section. A ticket the user does not delegate stays open — resolve it with `/clarify-ticket` before continuing.

If you have not already explored the codebase, do so to understand the current state of the code. Read `CONTEXT.md`, or the relevant file via `CONTEXT-MAP.md` in a multi-context repo, for the area's domain vocabulary. Ticket titles and descriptions should use that vocabulary, and respect ADRs in the area you're touching.

Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the work into **tracer bullet** tickets.

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer (schema, API, UI, tests): vertical, NOT a horizontal slice of one layer
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window
- Any prefactoring should be done first
- Default to the **coarsest** slice that still satisfies the rules above. A chain of layers (DB → API → UI) split into separate tickets just because each layer is independently testable is a horizontal slice in vertical-slice clothing — the tell is that no single ticket in the chain is demoable on its own. Merge such a chain into one ticket unless a split trigger below applies.

<split-triggers>

Split a slice only when one of these applies — otherwise merge it back:

- It doesn't fit a single fresh context window.
- A sub-part sits on a meaningfully different risk/model tier than the rest of the slice (e.g. a mechanical rename bundled into an otherwise ambiguous slice). Carve the mechanical part into its own ticket so it can run on the cheaper model instead of dragging the whole ticket up.
- Sub-parts need independent demoing, review, or merging.

</split-triggers>

</vertical-slice-rules>

**E2E scenario.** Only if CLAUDE.md/AGENTS.md has an "E2E" section (the project's contract for its end-to-end suite: command, single scenario, location, prerequisites) **and** a ticket delivers a user flow that crosses layers, propose the scenario that ticket adds or extends and what it proves from the user's point of view. A ticket without such a flow gets no E2E scenario field at all. Without the section: no E2E step, no question, no hint.

Give each ticket its **blocking edges**: the other tickets that must complete before it can start. A ticket with no blockers can start immediately.

**Wide refactors are the exception to vertical slicing.** A **wide refactor** is one mechanical change (rename a column, retype a shared symbol) whose **blast radius** fans across the whole codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. Don't force it into a tracer bullet; sequence it as **expand–contract**. First expand: add the new form beside the old so nothing breaks. Then migrate the call sites over in batches sized by blast radius (per package, per directory), each batch its own ticket blocked by the expand, keeping CI green batch to batch because the old form still exists. Finally contract: delete the old form once no caller remains, in a ticket blocked by every migrate batch. When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify ticket; green is promised only there.

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each ticket, show:

- **Title**: short descriptive name
- **Blocked by**: which other tickets (if any) must complete first
- **What it delivers**: the end-to-end behaviour this ticket makes work
- **E2E scenario**: the proposed scenario and what it proves — only for a ticket that meets the condition above; otherwise omit this line.
- **Proposed model**: the model the Build Subagent should use in `/implement` — **haiku** for mechanical, narrow-risk work (a single expand/migrate/contract batch, a rename, a config change), **sonnet** (default) for a typical tracer-bullet slice with ordinary logic, **opus** for high ambiguity or risk (many Implementation Decisions, cross-cutting changes, tricky concurrency or data-shape work)
- **Proposed effort**: how much reasoning the Build Subagent should spend in `/implement`, independent of the model — **Medium** when the ticket spells out the path and the work is following it (a rename, a migrate batch, a slice that copies an existing pattern), **High** (default) when the builder has to make ordinary design calls along the way, **Extra High** when correctness hinges on thinking through cases the tests may not catch (concurrency, locking, migrations on live data, deletion cascades, several interacting Implementation Decisions). Model and effort are separate axes: a mechanical but wide ticket can be haiku/Medium, a small but subtle one sonnet/Extra High.

Ask the user:

- Granularity: check each slice against the split-triggers above — merge where none apply, split where one does.
- Are the blocking edges correct: does each ticket only depend on tickets that genuinely gate it?
- Does each proposed model and effort fit, or should any be raised or lowered?

Iterate until the user approves the breakdown.

### 5. Create the tickets

Create the tickets with [implementation-ticket-template.md](implementation-ticket-template.md), recording each ticket's agreed model in its `Model` field and its agreed effort in its `Effort` field. Fill the template's `E2E scenario` section only for a ticket that meets the condition in step 3, with the scenario agreed in step 4; in every other ticket remove the section.

Each ticket must stand on its own: the Build Subagent works from the ticket, not from the spec. Where a ticket relies on a formula, rule, threshold or definition from `specifications.md`, a clarification ticket or a probe, state it in the ticket itself instead of pointing to the source.

## Final Step

Commit the approved feature plan on the current branch. Never push — pushing is the user's call alone.
Estimate the approximate time each implementation ticket will need.
Give the user the ready-to-paste command for the next chat: `/implement <feature NN | NN-NN | all>`.
