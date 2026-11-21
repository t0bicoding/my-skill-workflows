# Card Template

Every explanation of `/explain-me` takes this one form, whatever its target. Same sections, same
order, so the user knows where to look.

| # | Section | Holds |
|---|---|---|
| – | Head | what is explained, its kind, depth |
| 1 | 🎯 In one sentence | the gist |
| 2 | 🗺️ Picture | exactly one diagram |
| 3 | ⚙️ How it runs | the steps, each linked to its line |
| 4 | ❓ Why so | the reasons, each with its source |
| 5 | ⚖️ For a verdict | what is decided, open, one-way, tested |
| 6 | 🚫 Not covered | what the card leaves out or couldn't resolve |
| – | ➡️ Next | reply line and at most two follow-ups |

Sections carry their sign and name as a heading. No `---` rules between them; the card is short.

## General Rules

- **About one screen at depth 1.** Each section a few lines. A section with nothing to say is
  left out, except *For a verdict* — it always stands, even as a single line.
- **Links in the host's format.** In an IDE chat a markdown link `[file.py:140](path/file.py#L140)`,
  in a terminal `path/file.py:140`. Every location and every function points at its line in `HEAD`.
- **No code excerpts** at depth 1 and 2 — the links open the file. At depth 3 at most one short
  excerpt, when an edge case hangs on its exact wording.
- **The user's words.** Labels in the chat language, the domain vocabulary from `CONTEXT.md` (or
  `CONTEXT-MAP.md`). Code identifiers only as link texts and inside the diagram's steps.
- **Terms.** A domain or technical word the user may not know is explained in brackets where it
  first appears in the session — once.

## Head

One line, bold title plus kind and depth:

**<Title>** · <kind> · depth <n>

The title says what happens, in the user's words ("How a reading reaches the database", not
"measurement_service.py"). Under it, for a ticket or feature, one line with its status and a link
to its file.

## 1 · 🎯 In one sentence

One sentence, two at most: what it is and what it is for — for a question, the answer itself. A
reader who stops here should have the right idea, if not the details.

## 2 · 🗺️ Picture

Exactly one diagram, its form chosen and drawn per [diagrams.md](diagrams.md). Under it, only if
the form is a code block, the functions it names as a link list — a code block can't hold links.

## 3 · ⚙️ How it runs

Three to six numbered steps in the order things happen, one line each: what happens, in the
user's words, then the link to the function or line that does it. For an open ticket: what it
will change, step by step, and under a last line **Stays the same:** what it explicitly leaves
alone. For a feature not yet built: what the user will be able to do, in the order the tickets
deliver it.

At depth 2 the steps go one level down (up to about ten). At depth 3 each step ends with
`✅ <test name>` or `◻ no test`.

## 4 · ❓ Why so

One to three reasons, each one line, each ending with its source in brackets: `(ADR-0008)`,
`(CLAUDE.md › Rules › Lock)`, `(spec › Implementation Decisions)`, `(commit a1b2c3d)`,
`(test test_refresh_does_not_revive_a_released_lock)`. A reason without a source is written
*not written down — probably …*. Nothing to say → leave the section out rather than invent.

## 5 · ⚖️ For a verdict

What the user needs to judge it — up to four lines, each starting with its sign:

- `✔` **decided** — a choice that is settled, and where.
- `?` **open** — a question the plan leaves open, or where plan and code disagree (both sides
  named).
- `⇥` **one-way** — what can't be walked back by a revert once shipped (stored data, a schema, a
  file layout, an interface others call), with who it reaches.
- `✅` / `◻` **tested** — what tests pin, and the important part they don't.
- `⚠` **noticed** — a real problem seen while reading, with the skill for it.

Most expensive or most surprising first. If none applies: one line saying it is a two-way door
and settled.

## 6 · 🚫 Not covered

One line: what the card leaves out on purpose (a side path, a second trigger), and anything that
stayed "unclear". Left out when there is nothing.

## ➡️ Next

> `deeper` · a question · a new target · `page` — <follow-up skill and why, if one fits>

## Example (shape only)

**How an order is cancelled** · question · depth 1

### 🎯 In one sentence
An order is cancelled by setting its status, never by deleting it — its lines stay for the
invoice history.

### 🗺️ Picture
👤 **User** clicks *Cancel* on the order page

↓

🖥️ [cancelOrder](web/orders.ts#L88) sends the cancel request with the order's version

↓

⚙️ [cancel_order](api/orders.py#L140) checks the version, sets status `cancelled`

↓

💾 **Stored afterwards:** order with status `cancelled`, lines untouched

### ⚙️ How it runs
1. The button is only shown while the order is not shipped — [OrderActions](web/orders.ts#L60)
2. …

### ❓ Why so
- Orders are never deleted because invoices point at their lines (ADR-0004).

### ⚖️ For a verdict
- `?` open: the spec says shipped orders can be cancelled by an admin; the code refuses for
  everyone ([cancel_order](api/orders.py#L146)).
- `✅` / `◻` the version check is tested; cancelling a shipped order has no test.

### ➡️ Next
> `deeper` · a question · a new target · `page` — `/clarify-ticket` for the admin case
