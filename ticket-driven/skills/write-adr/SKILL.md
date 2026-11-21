---
name: write-adr
description: Writes an ADR into docs/adr/ from an already-settled decision. Use once a decision has been confirmed as ADR-worthy (usually via /adr), not to decide whether something deserves one.
---

# ADR Format

ADRs live in `docs/adr/` and use sequential numbering: `0001-slug.md`, `0002-slug.md`, etc.
Create the `docs/adr/` directory lazily: only when the first ADR is needed.
ADRs are always written in English, regardless of the project's documentation-language setting for `docs/features/`.

## Template

See [adr-template.md](adr-template.md)

## Optional sections

Only include these when they add genuine value. Most ADRs won't need them.

- **Considered Options**: only when the rejected alternatives are worth remembering
- **Consequences**: only when non-obvious downstream effects need to be called out

## Numbering

Scan `docs/adr/` for the highest existing number and increment by one.
