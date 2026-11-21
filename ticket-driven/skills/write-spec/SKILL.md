---
name: write-spec
description: Writes a feature, plan or idea in a specifications.md
---

## Preparation

This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user; just synthesize what you already know.

`specifications.md` lives at `docs/features/<name>/specifications.md`. If the feature folder doesn't exist yet, ask the user for a feature name and create it.

Write it in the documentation language set in CLAUDE.md/AGENTS.md (default: English).

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Read `CONTEXT.md`, or the relevant file via `CONTEXT-MAP.md` in a multi-context repo, for the area's domain vocabulary, and use it throughout the spec. Respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations.

If the user agrees write or adjust the specifications.md of the current feature.

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Relevant Conventions

All the conventions that already exist in the codebase relevant to this feature. State the convention, why it exists, and where to see it used.
<convention-example>
Cancel actions reuse the shared BackButton component instead of a plain button, since it also resets the flow's in-progress state.
</convention-example>
<convention-example>
API routes report failures through respondWithError() instead of throwing, so the client's global error handler can format them consistently.
</convention-example>

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>
