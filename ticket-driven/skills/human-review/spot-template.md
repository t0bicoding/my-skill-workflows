# Spot Template

One judgment spot per turn of the walk. Every spot has the same four sections in the same order,
then the reply line and the agenda — short enough to fit one screen. The head says what the spot is
about, the flow shows where in the code it happens, the spot section says what is at stake, the
question asks for the verdict. The code itself stays in the user's editor: every function, the
spot's line and the ticket's diff are links.

## Sections

| # | Section | What it gives the user |
|---|---|---|
| 1 | Head | what the spot is about — name, kind, severity, location, diff, ticket |
| 2 | 🧭 Flow | how it runs today, from the user's action through the functions to the spot and its result |
| 3 | 🎯 The spot | what the line decides, what the plan says about it, what can go wrong |
| 4 | ❓ Question | one to three questions, option A is today, ⭐ a recommendation |
| – | ➡️ Reply line + 📋 Agenda | how to answer, where the walk stands |

Sections are separated by `---` and carry their sign and name as a heading.

## General Rules

- **Links in the host's format.** In an IDE chat a markdown link `[file.py:140](path/file.py#L140)`,
  in a terminal `path/file.py:140`. Every location and every function points at its line in `HEAD`.
- **No code excerpt.** The links open the file. The one exception is the weakened test: its
  *before* is no longer in the file, so the flow shows it.
- **The user's words.** Labels in the chat language, the domain vocabulary from `CONTEXT.md` (or
  `CONTEXT-MAP.md`) where the project has one. Code identifiers only as link texts of functions and
  in a try-it's file line.
- **Today, not the plan.** The flow and *Decides* describe what the code in `HEAD` does; what the
  plan wanted stands in *Plan*.
- **Cross-check marks.** A statement that doesn't match its lines keeps its text and carries
  `⚠ check explanation`; a disagreement with the map stands under the flow as
  `⚠ map and code disagree`, both sides quoted.

## 1 · Head

- **Name** — the spot in a few words of the user's, as a title: what happens, not what to check
  ("Order without line items deleted unasked", not "Check deletion"). The same name stands in the
  overview, the agenda and the trail.
- **Kind** and **Severity** as the skill names them.
- **Location** — the spot's line in `HEAD`, as a link.
- **Diff** — the link to the spot's diff file (`.review/<feature>/spot-<n>.diff`), at the line that
  holds the spot's line — see *Write the Diffs* in the skill. The editor shows it colored, with
  what the origin ticket changed in the files of the flow. When the spot's line isn't among the
  changed lines, the link points at the first change in its file and says so:
  `(line unchanged — the decision lies in what stayed)`.
- **Ticket** — number and title of the origin ticket, linked to its file in `closed/`; several
  tickets separated by commas.
- The fields stand as a list — lines directly below each other would run together into one.

## 2 · 🧭 Flow

A flow diagram from the trigger to the result, as the code runs **today**.

- **Plain markdown paragraphs, never a code block** — a code block can't hold links. One paragraph
  per step, a paragraph holding only `↓` between two steps.
- **Steps**, each starting with its sign:
  - `👤` the user acts, or sees something — or `⏱️` the system starts it (startup, a schedule, a
    migration, an incoming request) where no user acts;
  - `🖥️` code on the user's side (UI, client), `⚙️` code behind it (server, service, job, library)
    — a project with one layer uses `⚙️` only. The function name as a link to its line, then half
    a sentence: what it does and what it hands on to;
  - `⚠` the spot's own line — **exactly once**, bold, linked as `L<n>`, with what it decides. The
    other branch stands right below it in the same paragraph: `otherwise → …`.
- **The last step** is `👤 User sees:` and/or `💾 Stored afterwards:`.
- **Terms** — a domain or technical word the user may not know is explained in brackets where it
  first appears, and only on the first spot of the walk that uses it. If that spot was deselected,
  the explanation moves to the next spot that uses the word.
- **About eight steps at most**, from where the spot's input comes in to where its result shows or
  is stored. A step that adds nothing to judging the spot is left out.
- Optional marks at the end of a step: `✅ <test or criterion>` — pinned already;
  `⚠️ <what>` — something outside this path can interfere (another user, a lost connection).

**Exceptions** — two kinds of spot that a flow can't show:

- **Weakened test** → *Test before/now*: the assertions verbatim, from the origin commit's parent
  and from `HEAD`, then **No longer checked:** the behavior that lost its guard, in the user's
  words.
- **Two users, processes or installations interleaving** → *Two columns*: one column per actor in a
  code block, time running down, the spot's step marked `⚠ L<n>`. The functions stand as a link
  list under the drawing, since the block can't hold links.

## 3 · 🎯 The spot

- **Decides:** one or two sentences: what the spot's line decides, conditions written out in full
  ("if the order has no line items — whatever else it holds —", not "if it is empty").
- **Plan:** what the origin ticket and `specifications.md` (or an ADR they name) say about it, with
  the source (`spec L48`, `ticket › Implementation Decisions`), quoted or closely paraphrased — or
  "plan silent". Then the reason, if one is written down, and where (implementation note, code
  comment, commit message) — otherwise "no reason written down". A deviation the implementation
  note documents is still named: documented is not judged.
- **Can go wrong:** up to three cases that can happen on this code path, most expensive first, one
  line each: situation → what the user sees or what is stored afterwards. `⚠` marks the spot's
  own case, `✅ <test or criterion>` a case that is already pinned. On a *hard to reverse* spot,
  one case says what undoing it takes once shipped. A precondition that makes a case rare stands
  in brackets at its end ("only if the lock lapsed").

## 4 · ❓ Question

- **One to three questions**, more than one only when the spot really holds independent decisions —
  never to split one decision into parts. Numbered only when there are several.
- **The question** is one line in the user's words naming the situation and what is to be decided:
  *"An order with data but no line items: delete at once, or ask?"* — not "Check the deletion
  logic". Where nothing shows in the app (a migration, a weakened test), aim it at the data or at
  what is no longer checked.
- **Option A is always what the code does today**, marked as such. Picking A is `ok`; picking any
  other option is a finding whose target is already named.
- Each option's consequence and worst case are said **once**, in its own line.
- `⭐` recommends one option, with its reason in one sentence.
- The reply line comes once, after the last question.

**Variants** — *today first* is the default; the other two only where they fit:

| The question … | Variant |
|---|---|
| has two or three plain options | Today first |
| turns on what several people see, or on what ends up stored | Outcome per option |
| is about how something feels, and that hinges on one value in one place | Try it |

A try-it counts towards the three questions. Without a single value to change (focus, order,
wording in several places), ask a question instead.

## Reply Line and Agenda

The reply line names the spot's options, then the rest:
`➡️ <options, e.g. 1 A, 2 B> · own suggestion · question · deselect · stop` — `ok` keeps today on
every question. The [agenda](agenda-template.md) closes the turn.

<spot-template>

🔎 **Spot <n>/<total> · <name>**
- **Kind:** <kind> · **Severity:** <severity>
- **Location:** <location, linked>
- **Diff:** <link: spot-<n>.diff:<line>> <only if so: (line unchanged — the decision lies in what stayed)>
- **Ticket:** <link: NN – title>

---

### 🧭 Flow

👤 **User** <what they do>

↓

🖥️ <link: function> <what it does, what it hands on to>

↓

⚙️ <link: function> <what it does, what it hands on to>

↓

⚠ **<link: L<n>> <what the line decides>**
otherwise → <the other branch>

↓

👤 **User sees:** <result> · 💾 **Stored afterwards:** <only if it differs from what they see>

---

### 🎯 The spot

**Decides:** <conditions written out in full>

**Plan:** <source> says <…> — or: plan silent. <Reason, and where — or: no reason written down.>

**Can go wrong:**
- <situation> → <what is seen or stored afterwards> ⚠
- <situation> → <…> ✅ <test or criterion>

---

### ❓ Question

<per question, its variant — see below>

➡️ <options> · own suggestion · question · deselect · stop

---

<the agenda — see agenda-template.md>

</spot-template>

<today-first-template>

**<n.> <question>**

- **A (today):** <what happens today> — <its consequence>
- **B:** <option>. ⚠ <its worst case or cost>
- **C:** <option>. ⚠ <its worst case or cost>

⭐ **<option>** — <reason>

</today-first-template>

<outcome-per-option-template>

**<n.> <question>**

| Option | <party 1> sees | <party 2> sees | Stored afterwards | Worst case |
|---|---|---|---|---|
| **A** (today) <option> | <…> | <…> | <…> | <…> |
| **B** <option> | <…> | <…> | <…> | <…> |

⭐ **<option>** — <reason>

</outcome-per-option-template>

Pick the party columns the question turns on; always keep *Stored afterwards* and *Worst case*.

<try-it-template>

🎛️ **Try it**
1. Start: `<start command from CLAUDE.md/AGENTS.md>` — <or: already running; the change shows without a restart>
2. Open <link: file:line> — `<the line, verbatim>`
3. Try: `<value>` <what it feels like> · `<value>` (today) · `<value>` <what it feels like>
4. In the app: <steps to see it> — watch for <what to feel>
5. Afterwards set it back to `<today's value>` — the change itself comes through a ticket.

**<n.> Which value feels right?**
A: `<today's value>` (today) · B: `<value>` · C: `<value>`
⭐ **<option>** — <reason>

</try-it-template>

<test-before-now-template>

| | Before | Now |
|---|---|---|
| Test | `<test name>` | `<test name>` — or "deleted" |
| Checks | `<assertion, verbatim>` | `<assertion, verbatim>` — or "—" |

**No longer checked:** <the behavior that lost its guard, in the user's words>

</test-before-now-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

🔎 **Spot 1/3 · Order without line items deleted unasked**
- **Kind:** Silent decision · **Severity:** Data loss
- **Location:** [order_service.py:140](src/orders/order_service.py#L140)
- **Diff:** [spot-1.diff:31](.review/delete-order/spot-1.diff#L31)
- **Ticket:** [06 – Delete an order with counted consequences](docs/features/orders/tickets/implementation/closed/06-delete-order.md)

---

### 🧭 Flow

👤 **User** clicks "Delete" on an order

↓

🖥️ [`OrderList › onDelete`](src/orders/order-list.tsx#L40) sends the deletion to the server and
opens the confirmation if counts come back

↓

⚙️ [`delete_order(order_id, confirmed)`](src/orders/order_service.py#L131) loads the order and has
it counted

↓

⚙️ [`count_impact(order)`](src/orders/order_service.py#L88) counts **line items** (the product rows
of an order) and invoices

↓

⚠ [**L140**](src/orders/order_service.py#L140) **no line items → deleted at once, no confirmation**
otherwise → the confirmation shows the counts, deleted only after confirming

↓

👤 **User sees:** the order disappears · 💾 **Stored afterwards:** address, notes and invoices are
gone with it

---

### 🎯 The spot

**Decides:** if the order has no line items — whatever else it holds (address, notes, invoices) —
it is deleted at once, without a confirmation.

**Plan:** spec L48 says "a deletion that takes more along than the order asks first" — invoices
are counted, but don't count against "empty". No reason written down.

**Can go wrong:**
- order with an invoice, no line items → **invoice gone** ⚠
- order with an address, no line items → address gone ⚠
- clicked twice → "Order not found" ✅ `test_delete_twice`

---

### ❓ Question

**An order with data but no line items: delete at once, or ask?**

- **A (today):** delete at once — one click less, but entered data is gone without a word.
- **B:** ask like any other order. ⚠ One more click for orders that really are empty.
- **C:** "empty" means no line items, no address and no invoice. ⚠ Every new field of an order has
  to be added to that check.

⭐ **B** — someone entered that data; one click is cheap against it.

➡️ A · B · C · own suggestion · question · deselect · stop

---

📋 ▶ **1** · 2 · 3 *(try it)*
