# Light Spec Template

A trimmed [write-spec](../write-spec/SKILL.md) template: the plan the user agreed to in one chat round, written down so `/implement`'s Spec reviewer, `/human-review` and `/close-feature` have a `specifications.md` to read. No user-story list and no open questions — a light feature has none left.

<light-spec-template>

# Light – <Feature title>

## Problem Statement

What the user wants changed and why, from the user's perspective, in one short paragraph.

## Solution

The agreed change from the user's perspective.

## Flow before → after

<!-- Optional. Drop this whole section if the change doesn't alter how the user works through something. -->

The steps today and the steps afterwards, as agreed in the plan.

## Side Effects Considered

Each point from "What else it touches" with the answer the user agreed to — the recommendation or the user's override.

## Relevant Conventions

<!-- Optional. Drop this whole section unless the change touches a rule in CLAUDE.md/AGENTS.md or an ADR. -->

The rule or ADR the change must respect, why it exists, and why it applies here.

## Implementation Decisions

The modules touched, interfaces changed, schema or API decisions — no file paths or code snippets.

## Testing Decisions

What a good test proves here, which modules get tested, and prior art in the codebase.

## Out of Scope

What this change deliberately leaves alone.

## Further Notes

One line recording how the plan came about, in the documentation language: `Planned via /feature-light (<n> points agreed, <m> changed by the user).`

</light-spec-template>
