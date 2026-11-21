# Must-read Template

The must-read turn comes right after the overview, before the first spot: the user reads every
change the run's commits made inside a must-read zone, as a raw diff, before any spotter or
explainer has framed it. It is the one place in the walk where the user looks without a guide —
so it carries no explanation, only what to open and why it matters.

## Rules

- **One block per zone hit**, in the order of the zone file, numbered `M1`, `M2`, … — the `M`
  keeps them apart from the spots' numbers in a reply. A zone the run didn't touch is not shown.
- **Why** is the zone file's Why, verbatim, and its Rule pointer if it has one — nothing else.
  No summary of the diff, no hint what to look for: that would anchor the reading this turn exists
  to keep free.
- **Files** — every matching file as a clickable link, with the commits (short hash) and ticket
  numbers that changed it.
- **Diff** — one link per zone to its diff file `.review/<feature>/M<n>.diff` (see *Write the
  Diffs* in the skill): exactly the zone's changes, opened in the editor as a colored tab, from its
  top — the zone has no single line to jump to. No hint which part of it matters.
- **Spots inside** — spotter spots located in one of the zone's files, by number, so the user
  knows they come back later with an explanation. Leave it out when there are none.
- Close with the reply line and the [agenda](agenda-template.md).
- Labels in the chat language.

<must-read-template>

📕 **Must-read** · <n> zones touched — read each diff yourself before the spots

**M1 · <zone>** — <why> · <rule pointer, if any>
- [<file>](<path>) — <hash> (ticket <NN>), <hash> (ticket <NN>)
- [<file>](<path>) — <hash> (ticket <NN>)
- **Diff:** [M1.diff](.review/<feature>/M1.diff)

Spots inside: 📍<n>, 📍<n>

**M2 · <zone>** — …

➡️ Per zone: **read** · a finding in your words, with what should happen instead · a question
(answered once you've read) · **skip** — e.g. `read` for all, or `M1 read, M2 finding: …`

</must-read-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

📕 **Must-read** · 2 zones touched — read each diff yourself before the spots

**M1 · Migrations** — change stored data, no undo
- [3f2a_order_archive.py](db/migrations/3f2a_order_archive.py) — a1b2c3d (ticket 06)
- **Diff:** [M1.diff](.review/delete-order/M1.diff)

**M2 · Test assertions** — a weakened test is the change its author least likely flags
- [test_orders.py](tests/test_orders.py) — a1b2c3d (ticket 06), e4f5a6b (ticket 07)
- **Diff:** [M2.diff](.review/delete-order/M2.diff)

Spots inside: 📍3

➡️ Per zone: **read** · a finding in your words, with what should happen instead · a question
(answered once you've read) · **skip** — e.g. `read` for all, or `M1 read, M2 finding: …`
