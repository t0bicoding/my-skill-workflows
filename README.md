# my-skill-workflows

A collection of two development workflows for [Claude Code](https://claude.com/claude-code), built from skills (and subagents). Both take a piece of work in a structured way from idea through planning and implementation to completion, keeping the project documentation up to date along the way.

## Workflows

### `spec-driven/`

A workflow that plans and builds features through a specification and vertical slices.

- **Planning:** A feature is described from the user's point of view in interview rounds (`/feature`) and turned into a specification and a roadmap of slices.
- **Implementation:** For each slice, the technical decisions are settled and a scope is written (`/slice`), then built by a builder and reviewer subagents (`/implement`).
- **Completion:** Slices and features are closed and merged, and the project documents (README, AGENTS, architecture, glossary, roadmap, ADRs) are brought up to date.
- **Shortcuts:** `/fast-lane` for a whole feature at once, `/one-shot` for small changes and bug fixes.

### `ticket-driven/`

A workflow that breaks features down into clarification and implementation tickets and works through them.

- **Planning:** A feature is worked out into a specification via brainstorming/interview; open points are resolved as clarification tickets (brainstorming, prototype, research, ADR).
- **Implementation:** The settled specification is split into implementation tickets with dependencies and built in a build-and-review loop.
- **Shortcuts:** `/quick` for small, clear changes, `/feature-light` for mid-sized changes.
- **Additionally:** Audits (bugs, security, performance, refactoring, usability), aids for understanding the code (explanations, lessons, review puzzles) and maintenance of the project documentation. The included subagents are in `agents/`.

## Structure

```
spec-driven/
  skills/        # skills of the spec-driven workflow
ticket-driven/
  skills/        # skills of the ticket-driven workflow
  agents/        # related subagents
```

## Usage

Copy the skills of one workflow (and the agents, if any) into the `.claude/skills/` or `.claude/agents/` directory of a project or of your user. Then run `/skill-setup` once in the project to prepare it for the workflow.
