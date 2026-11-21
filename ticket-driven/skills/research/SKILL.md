---
name: research
description: Investigates a factual question — library behavior, an external constraint, how existing code behaves — via a background research agent and reports the finding. Use when a question has a discoverable answer rather than one that needs the user's judgment; for a judgment call, use /interview, and for "should we adopt or deviate from an existing convention," use /convention instead.
---

## Process

1. State the question in one sentence: what fact or behavior is being confirmed.
2. Dispatch the Scout Subagent [scout.md](../../agents/scout.md) with that question.
3. Let it report back with its answer, evidence, and confidence.

## Final Step

Write the finding into the invoking ticket's Findings section, in plain language, with the evidence cited. If invoked outside a ticket, report the finding directly to the user.
