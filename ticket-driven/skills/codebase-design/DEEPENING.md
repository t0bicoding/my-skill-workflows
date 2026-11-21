# Deepening

Deepening an existing shallow module means moving behavior *into* it so callers do less. Where the seam goes depends on what kind of dependency sits behind it.

## Dependency categories

1. **In-process** — same codebase, no I/O, no separate deploy. Merge it into the module freely; no seam needed.
2. **Local-substitutable** — you can run a real instance in tests (an embeddable database, a fake in-memory queue). Test against the real thing; no adapter needed.
3. **Remote-owned** — a service your own team operates, but out-of-process (your own API, your own queue). Wrap it behind a port: one adapter for production, one fake or stub adapter for tests.
4. **True external** — a third-party service outside your control. Same port-and-adapter treatment as remote-owned, with the added benefit that the port also isolates callers from that API's shape changing later.

## Seam heuristic

**One adapter is a hypothetical seam. Two adapters is a real one.** Don't build a port for a dependency that only ever has one implementation — that's speculative abstraction. Build it once a second implementation genuinely exists, and a test fake counts as one.

## Testing rule

Tests move to the deepened module's new interface. Delete the old shallow-module tests rather than keep both layers under test — a passing test at the wrong layer hides regressions instead of catching them.
