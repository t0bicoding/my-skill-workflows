---
name: codebase-design
description: Shared vocabulary and principles for designing a module's interface. Use to design a new module's interface, find a deepening opportunity in an existing shallow one, decide where a seam belongs, or make code more testable — or when another skill needs this vocabulary.
---

A **module** is anything with an interface separate from its implementation: a function, a class, a service. Its **interface** is what a caller must know to use it; its **implementation** is everything behind that interface a caller never sees. A **seam** is a real boundary where one implementation can be swapped for another without touching the caller — a **port** is the interface at that boundary, an **adapter** one implementation behind it.

**Depth** is how much an interface hides relative to how much it exposes: a deep module does a lot behind a small interface, a shallow one exposes almost as much as it hides. Depth pays off twice — **leverage** for the caller (more done per method learned) and **locality** for the maintainer (a change stays inside the module instead of rippling through callers).

## Design principles

Apply these whenever shaping or reshaping an interface:

1. **Shrink the interface.** Fewer methods, fewer parameters, fewer things the caller must get right.
2. **Hide behavior, not just data.** The interface states *what*, never *how*.
3. **Inject dependencies, don't construct them.** A module that builds its own dependencies can't be given a different one in a test or a different environment.
4. **Prefer return values over side effects.** A caller can react to a return value; a side effect it has to know to look for.
5. **Validate with the deletion test.** Could the module be deleted and rebuilt from nothing but its own interface, with no caller changing? If yes, the seam is real.

## Process

1. **Name the question.** Designing a new interface, deepening an existing shallow module, placing a seam, or improving testability — state which.
2. **Apply the principles above** to a first draft.
3. **Decide whether one draft is enough:**
   - An existing dependency needs wrapping or a seam needs placing → [DEEPENING.md](DEEPENING.md).
   - The interface is genuinely new, no existing convention fits, and there's a real trade-off between shapes → [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md).
   - Otherwise the principles above already settle it — skip both.

## Final Step

If invoked from a ticket, write the chosen interface shape and its rationale into the ticket's Decisions section, and any alternatives considered (with their trade-offs) into Findings — in plain language, so `/clarify-ticket` can fold the decision straight into `specifications.md`.

If invoked outside a ticket (from `/approval`'s prefactoring step, or mid-build by the implementer), report the chosen shape and rationale directly.
