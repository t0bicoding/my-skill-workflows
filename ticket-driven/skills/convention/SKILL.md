---
name: convention
description: Searches the codebase for existing patterns and conventions relevant to a feature, then asks the user, per convention, whether to adopt it in this feature or deliberately deviate. Use when a feature touches an area of the codebase that already has established patterns which may or may not still fit.
---

## Process

### 1. Scope the search

Identify which parts of the codebase this feature touches (modules, layers, domains).

### 2. Find the conventions

Launch one Scout Subagent [scout.md](../../agents/scout.md) per area, in parallel, each asked what naming, error handling, component structure, data access, or testing-shape patterns that area already follows — anything a future reader would expect this feature to match. For each convention a scout reports, note it, where it's used (file/line examples), and why it seems to exist.

### 3. Clarify with the user

Present each convention found and ask: adopt it in this feature, or deviate? A deviation that's hard to reverse or non-obvious is a candidate for the `/adr` skill — flag it, don't silently note it.

## Convention Structure

❓ **C1** - **<Convention title>**: <Convention body, might be multiple paragraphs>
➡️ A: <Implement in current feature>
➡️ B: <Alternative Options>
⭐ <Recommended Answer> — <why do you recommend it>

---

❓ **C2** - **<Convention title>**: <Convention body, might be multiple paragraphs>
➡️ A: <Implement in current feature>
➡️ B: <Alternative Options>
⭐ <Recommended Answer> — <why do you recommend it>

---

## Final Step

Write the adopted conventions into the ticket's Decisions section, in the same shape as `specifications.md`'s "Relevant Conventions" section (state the convention, why it exists, where it's used) so `/clarify-ticket` can fold them straight in. Record deviations too, with the reason for departing.
