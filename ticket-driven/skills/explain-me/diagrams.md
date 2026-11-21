# Diagrams

Every card holds exactly one picture. It is the part the user takes in first, so it shows the real
mechanism of the target — the path, the change, the states — not a decoration. Choose its form by
what the target is about, not by its kind alone.

## General Rules

- **One picture, one idea.** About eight boxes or steps at depth 1, ten at depth 2. What doesn't
  help judge the target is left out; a side path gets one line under *Not covered*, not a branch.
- **The user's words** on boxes and arrows; a function name only where the step is that function.
- **Today, not the plan** — except in *before → after* and *plan*, where the plan is the subject
  and is labeled as such.
- **Plain text art** that reads in any terminal or chat: boxes and lines from `┌ ┐ └ ┘ ─ │ ├ ┤ ┬ ┴ ▶ ▼`,
  arrows `→ ↓`. No colors, no Mermaid — it doesn't render everywhere.
- **Links.** The *flow* is written as markdown paragraphs so its steps can carry links. Every other
  form is a code block; the functions it names follow under it as a link list.
- **Numbers that matter** go into the picture (`40 → 20 file lookups`, `timeout 5 s`), with where
  they come from in *How it runs*.
- With `--page`, the same picture as an inline SVG — same boxes, same labels, nothing added.

## Choose the Form

| The target is about … | Form | Typical kind |
|---|---|---|
| how something runs from a trigger to a result | **Flow** | code location, question |
| a change — what is different afterwards | **Before → after** | open ticket, closed ticket |
| two actors talking or overlapping in time | **Two columns** | client/server, two users, a race |
| something that moves between states | **States** | lock, status, job, wizard |
| what data exists and how it hangs together | **Data boxes** | model, schema, migration |
| where parts sit and who talks to whom | **Map** | feature, area, "where is …" |
| what has to happen in which order | **Plan** | feature not yet built |

Two forms fit → take the one the user's question is about. A ticket that adds a state takes
*States* with the new state marked, not *Before → after*.

## Flow

Markdown paragraphs, one per step, a paragraph holding only `↓` between them. Each step starts
with its sign:

- `👤` the user acts or sees something — or `⏱️` the system starts it (startup, a schedule, an
  incoming request) where no user acts;
- `🖥️` code on the user's side, `⚙️` code behind it — a project with one layer uses `⚙️` only.
  The function as a link, then half a sentence: what it does, what it hands on;
- `◆` a decision that matters for the target: what it checks, then `otherwise → …` in the same
  paragraph;
- the last step `👤 User sees:` and/or `💾 Stored afterwards:`.

A step may end with `⚠️ <what>` when something outside the path can interfere (another user, a
lost connection).

## Before → after

```
  Before                                   After
  ──────                                   ─────
  List of 20 orders                        List of 20 orders
    └─ per order:                            └─ per order:
       look up folder  (1–3 disk calls)         read path from database
       read file date  (1 disk call)            read file date  (1 disk call)
  = up to 80 disk calls                    = 20 disk calls

  Stays the same: the URL, what the user sees, every write path
```

Left today, right afterwards, the changed lines aligned. The cost or behavior that changes goes in
the last row of each side. *Stays the same* is always the last line.

## Two columns

```
  Station A                     Station B
  ─────────                     ─────────
  opens order 17
  takes lock ✔
                                opens order 17
                                takes lock ✘ → "held by A"
  saves
  releases lock
                                retries → takes lock ✔
```

Time runs down. One column per actor, at most three. The step that decides the outcome marked
`✔`/`✘` or `◆`.

## States

```
               take
  ┌──────┐ ─────────────▶ ┌──────┐ ──┐
  │ free │                │ held │   │ refresh (own lock only)
  └──────┘ ◀───────────── └──────┘ ◀─┘
          release / expire
```

Each state a box, each transition an arrow labeled with what triggers it. A transition that is
forbidden but tempting goes in a note under the picture (`✘ refresh never revives a released lock`).
New or changed parts of a ticket marked `*new*`.

## Data boxes

```
  ┌────────────┐ 1     n ┌────────────┐ 1     0..1 ┌─────────┐
  │ Order      │────────▶│ Line       │────────────▶│ Image   │
  │ status     │         │ quantity   │             │ path    │
  └────────────┘         └────────────┘             └─────────┘
        deleting an order deletes its lines (cascade)
```

Only the entities and fields the target is about. Cardinality on the lines. What happens on delete
in one line under the picture when it matters.

## Map

```
  ┌─ Desktop app ──────────────┐      ┌─ Shared folder ──┐
  │  UI  ──REST──▶  Server     │─────▶│  database file   │
  │                 │          │      │  stored files    │
  │                 ▼          │      └──────────────────┘
  │             instrument USB │
  └────────────────────────────┘
       ★ = touched by this feature
```

Parts as boxes, nested where one contains the other; connections labeled with how they talk. For
a feature, the parts it touches marked `★`.

## Plan

```
  01 data model ──▶ 02 list view ──▶ 04 export
        │
        └────────▶ 03 edit dialog
  ✔ closed   ○ open   ◐ in progress
```

Tickets by number and a short name, arrows from blocker to blocked, status sign per ticket. Under
it, one line on what the user can do once the first path through is done.
