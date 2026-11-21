# Implementation Ticket Template

<implementation-ticket-template>

---

Ticket: <NN - Ticket type - Ticket title>
Status: <open | in-progress | closed>
Model: <haiku | sonnet | opus>
Effort: <Medium | High | Extra High>

---

## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective, not layer-by-layer implementation — or, for an expand/migrate/contract batch, the mechanical change and its blast radius.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- A reference to each blocking ticket, or "None (can start immediately)".

## Relevant Conventions

Same shape as `specifications.md`'s "Relevant Conventions" section (see [write-spec](../write-spec/SKILL.md)'s template): state the convention, why it exists, and where it's used.

## Implementation Decisions

Same shape as `specifications.md`'s "Implementation Decisions" section: the modules/interfaces touched, architectural and schema decisions, API contracts. No file paths or code snippets, except a prototype-derived snippet that encodes a decision more precisely than prose can.

## Testing Decisions

Same shape as `specifications.md`'s "Testing Decisions" section: what makes a good test here, which modules get tested, and prior art in the codebase.

## E2E scenario

<!-- Optional. Drop this whole section unless the project has an "E2E" section in CLAUDE.md/AGENTS.md AND this ticket delivers a user flow that crosses layers. -->

The scenario this ticket adds or extends, and what it proves from the user's point of view.

## Out of Scope

A description of the things that are out of scope for this spec.

</implementation-ticket-template>
