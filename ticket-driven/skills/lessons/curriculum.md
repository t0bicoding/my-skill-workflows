# Curriculum

The general learning path — the same for every project. Eight stages in a fixed order: the big picture first, then the path of one action through the system, then each layer that path crossed, then what cuts across all of them, then how the project is kept right and how it reaches its users. Each topic has a **slug** (used in the map and in `progress.md`), what it **teaches**, how to **recognize** it in a project, its **prerequisites** (topic slugs), and the **stack concepts** it usually teaches.

The Lesson Writer binds each topic the project has to one or two stations. A topic the project doesn't have is skipped; a stage with no topic left is skipped, and the map says why ("no UI — stage 5 skipped"). Prerequisites that point at a skipped topic are dropped.

## Stage 1 — `overview`: the Big Picture

| Slug | Teaches | Recognize it by | Prerequisites |
|---|---|---|---|
| `purpose-and-parts` | what the project is for, its components and processes, and which talks to which | `README`, manifests, top-level folders with their own manifest, `CLAUDE.md` / `AGENTS.md` architecture sections | — |
| `layout` | where what lives: the folder conventions inside a component, and the naming that tells layers apart | the source tree of the main component; recurring folder names (`routers`, `services`, `features`, `lib`, …) | `purpose-and-parts` |
| `entry-point` | where execution starts per component, and what happens at startup in which order | `main` functions, app factories, `bin` entries, framework bootstrap files | `purpose-and-parts` |

## Stage 2 — `request-path`: the Path of One Action

| Slug | Teaches | Recognize it by | Prerequisites |
|---|---|---|---|
| `component-boundary` | how two components or processes find and talk to each other — protocol, address, framing, who starts whom | HTTP clients and servers, IPC, CLI arguments, queues, ports, health checks | `entry-point` |
| `read-path` | one everyday action that reads: from the trigger through every layer to what the user sees | a list or detail view and its fetch; a command that prints | `component-boundary`, `layout` |
| `write-path` | one everyday action that writes: to storage and back, and what the user sees afterwards | a form submit, a save, a delete | `read-path` |

## Stage 3 — `interfaces`: Contracts at the Edges

| Slug | Teaches | Recognize it by | Prerequisites |
|---|---|---|---|
| `routing` | how a request or command finds its handler | route decorators, router tables, command dispatch | `read-path` |
| `dependency-injection` | how a handler gets what it needs per call — sessions, the caller, guards that refuse | `Depends`, providers, middleware, context objects | `routing` |
| `validation` | where input is checked, what is checked where, and what reading and writing models differ in | request schemas, form schemas, parsers, DB constraints | `routing` |
| `error-handling` | how a failure becomes a response, a message, a log line — and what the user is told | exception handlers, error boundaries, result types | `routing` |

## Stage 4 — `data`: State That Lasts

| Slug | Teaches | Recognize it by | Prerequisites |
|---|---|---|---|
| `data-model` | the entities, their relations, what is unique, and what goes when something is deleted | ORM models, schema files, migrations' first revision | `write-path` |
| `sessions-and-transactions` | the unit of work: where a transaction opens, commits, rolls back, and what belongs together | session factories, `commit`, `with` blocks, transaction decorators | `data-model` |
| `migrations` | how the schema evolves, when migrations run, and what happens to existing rows | migration folders, upgrade calls at startup | `data-model` |
| `queries` | how data is fetched: filtering, ordering, loading related rows, and the cost of each | repository or service query code | `data-model` |
| `files-and-storage` | data outside the database: where files live, how paths are stored and resolved | storage helpers, upload handlers, path joins | `data-model` |

## Stage 5 — `ui-state`: the User's Side

Only for projects with a user interface.

| Slug | Teaches | Recognize it by | Prerequisites |
|---|---|---|---|
| `component-model` | how the UI is composed: components, props, local state, effects, rendering | the UI framework's components in a feature folder | `read-path` |
| `server-state-cache` | how the UI fetches and caches what the server holds, and when it fetches again | query clients and hooks (TanStack Query, SWR, Apollo, …), stores synced with an API | `component-model` |
| `client-state` | state that lives only in the UI: forms, drafts, selections, global stores | form libraries, stores, context providers | `component-model` |
| `navigation` | screens and routes, and what a URL or a screen change keeps | router config, route components | `component-model` |

## Stage 6 — `cross-cutting`: What Every Layer Shares

| Slug | Teaches | Recognize it by | Prerequisites |
|---|---|---|---|
| `concurrency` | what happens when two users, processes or threads act at once — locks, races, waits and their limits | locks, timeouts, retries, transactions under contention, async code | `sessions-and-transactions` |
| `identity-and-auth` | who the caller is, where that is decided, and what they may do | auth middleware, identity helpers, permission checks | `dependency-injection` |
| `time-and-locale` | how time is stored, compared and shown; time zones; formats | clock helpers, datetime handling, formatting utilities | `data-model` |
| `configuration` | where settings come from, in which precedence, and what is fixed at build time | settings modules, env reads, config files | `entry-point` |
| `logging-and-diagnostics` | what is logged, where it goes, and what must never be in it | logger setup, log calls, diagnostic exports | `error-handling` |
| `security-boundaries` | which input is untrusted, and where it is bounded — paths, queries, markup, secrets | sanitizers, path guards, escaping, secret handling | `validation` |
| `<project>/rule-<name>` | one stated rule of the project: what it demands, why, and the code that keeps it | a rule in `CLAUDE.md` / `AGENTS.md`, an ADR, a documented convention — with a place in the code | the topics its code lives in |

House-rule topics are the project's own: the Lesson Writer adds one per stated rule that has a home in the code, at most ten — the rules the most code depends on first. A project without written rules has none.

## Stage 7 — `quality`: How It Is Kept Right

| Slug | Teaches | Recognize it by | Prerequisites |
|---|---|---|---|
| `test-strategy` | which kinds of tests exist, what each covers, where they live, and how one reads | test folders, fixtures, test configuration | `write-path` |
| `test-seams` | how tests replace the outside world — fakes, test databases, env switches — and where those seams sit in production code | fixtures, dependency overrides, mocks, test-only switches | `test-strategy`, `dependency-injection` |
| `gates-and-ci` | the checks a change must pass, where they run, and what each catches | CI workflows, hooks, lint and type configs | `test-strategy` |

## Stage 8 — `delivery`: How It Reaches Its Users

| Slug | Teaches | Recognize it by | Prerequisites |
|---|---|---|---|
| `build-and-packaging` | how source becomes what is shipped — bundlers, compilers, installers, what goes in the bundle | build scripts, packaging specs, installer configs | `entry-point` |
| `deploy-and-update` | how a new version reaches running installations, and what keeps that safe | release scripts, update checks, signatures, deploy configs | `build-and-packaging` |
| `runtime-environment` | where it runs and what that place imposes — OS, paths, network, permissions | platform-specific code, path helpers, environment checks | `configuration` |

## Stack Concepts

A lesson names the general concepts it teaches as slugs `<technology>/<concept>` — `fastapi/depends`, `tanstack-query/stale-time`, `sqlalchemy/session`, `sqlite/journal-mode`, `rust/async-commands` — or `general/<concept>` for ideas that belong to no single technology (`general/dependency-injection`, `general/optimistic-vs-pessimistic-locking`, `general/idempotency`). The Lesson Writer coins the slug; reuse one that `stack.md` already has for the same idea. These carry across projects in `stack.md`.

## From Puzzles to Lessons

When the user's `/puzzles` record shows a weak theme, the station of the matching topic is offered. After a stage is done, its puzzle group is suggested.

| Puzzle theme | Lesson topic |
|---|---|
| group `tests` (any theme), `weakened-gate` | `test-strategy`, `test-seams`, `gates-and-ci` |
| `boundary`, `inverted-logic`, `null-empty` | `validation` |
| `numbers-and-time` | `time-and-locale` |
| `async-misuse` | `component-boundary`, `server-state-cache` |
| `ordering-assumption` | `queries` |
| `lost-update`, `unbounded-wait` | `concurrency` |
| `transaction-boundary`, `resource-leak` | `sessions-and-transactions` |
| `destructive-migration` | `migrations` |
| `cascade-reach` | `data-model` |
| `cache-staleness` | `server-state-cache` |
| `not-idempotent` | `write-path` |
| `injection`, `path-traversal` | `security-boundaries`, `files-and-storage` |
| `missing-authz`, `trusted-input` | `identity-and-auth` |
| `leaking-data` | `logging-and-diagnostics` |
| `error-hidden`, `misleading-message` | `error-handling` |
| `<project>/rule-<name>` | `<project>/rule-<name>` |

| Stage done | Suggest |
|---|---|
| 2 `request-path`, 3 `interfaces` | `/puzzles correctness` |
| 4 `data` | `/puzzles data` |
| 5 `ui-state` | `/puzzles cache-staleness` |
| 6 `cross-cutting` | `/puzzles house-rules` (or `/puzzles security` without written rules) |
| 7 `quality` | `/puzzles tests` |
| 8 `delivery` | `/puzzles operations` |
