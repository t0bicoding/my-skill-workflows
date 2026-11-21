# Design It Twice

Your first idea is unlikely to be the best one. When an interface is genuinely new and no existing convention fits, compare independent alternatives before committing.

## Process

### 1. Frame the problem

State the question in one sentence, then the constraints, the dependencies involved, and a short sketch of the calling code as it exists (or would exist) today.

### 2. Dispatch alternatives in parallel

Launch 3+ subagents in a single message, each given exactly one constraint:

- **Minimal** — fewest methods and parameters, maximum leverage per call.
- **Flexible** — supports the widest range of foreseeable use cases, even at the cost of a slightly larger interface.
- **Caller-optimized** — shaped around the single most common caller, even if that limits generality elsewhere.
- **Ports & adapters** — isolates any cross-boundary dependency behind a port, per [DEEPENING.md](DEEPENING.md).

Each subagent returns: the interface spec, a usage example against the real calling code, an implementation sketch, its dependency strategy, and its trade-offs — what it makes easy, what it makes awkward.

### 3. Present and recommend

Show the designs to the user one at a time, not as a single wall of text. Close with an opinionated recommendation — a hybrid if one design's strength patches another's weakness.

**Done** when the user has picked, or approved a hybrid of, one design.
