# Overview Template

The overview opens the walk: first the map, so the user knows what the feature does, where each
spot sits in it, which steps a test pins and what can't be taken back once shipped; then the must-read zones it touched; then every spot at once, so the user sees how
big the walk is and what matters most before the first turn — and can deselect or pull in spots
explicitly.

## Rules

- **Map** from the cartographer's report: *Built*, the flow, *Not touched*, *Door*. Its file and
  function lists stay out — they are for placing the spots, not for the user.
- Every step a spot was placed on carries `📍<n>`; a step may carry several, a spot may sit on
  several steps. Spots placed "outside the flow" get their own line under the flow.
- **Evidence** closes every step, from the cartographer's *Evidence*: `✅` with the most telling
  test as a link to its line, `+<n>` for the others, and the cartographer's bracket when the test
  covers only part of the step — or `◻ no test`. An unpinned step is where tests don't reach and the
  user's eye counts most; never soften it, and never drop the mark for lack of space.
- **Not touched** is always shown — what the feature leaves alone tells the user where they can
  relax and, when a sensitive area *is* touched, where they can't.
- **Door** is always shown, from the cartographer's *Door*: every one-way door with its reach in
  the user's words, then "two-way: the rest" — or "two-way only". A one-way door is what the walk
  can't take back after shipping; it stands here even when no spot sits on it.
- **Must-read** — one line: the hit zones by number and name with their file count, read in the
  next turn. No zone hit → "no zone touched"; no zone file → "no zones defined yet —
  `/review-maintainer` offers a first set at the end".
- **Area mode** — the map's title reads `Map – area <slug>`, the review line
  `<n> spots from <m> files of the area` in place of the tickets, the must-read line
  `none in area mode`, followed by the zones the area overlaps; when candidates were dropped as
  already judged, one line under the table: `Already judged in earlier runs, unchanged: <n>`.
- Spots in walk order: severity first, then kind.
- **Spot** is the spot's name, the same that heads its turn later; `(+n)` when it carries more than
  one question, `(try it)` when the user will set a value themselves.
- **Under the cap** lists every candidate above the threshold that didn't make the 10, one line
  each, numbered on — so nothing drops out of sight. Leave the section out when it's empty.
- If there are no spots at all, show the map and say so in one sentence instead of the table, and
  name which tickets were looked at.
- Labels in the chat language.

<overview-template>

🗺️ **Map – <feature>**

**Built:** <one or two sentences: what the feature lets its user do>

1. <step in the user's words>   ✅ <link: test name> +<n>
2. <step>   📍<n>   ◻ no test
3. <step>   📍<n> 📍<n>   ✅ <link: test name> (<what it leaves out>)
4. <step>   ✅ <link: test name>
<only if any:> Outside the flow: 📍<n> — <one line why>

**Not touched:** <areas> · **Touched:** <sensitive areas it does touch, or "none">

🚪 **Door:** one-way — <what> (<reach>) · one-way — <what> (<reach>) · two-way: the rest
— or: 🚪 **Door:** two-way only

📕 **Must-read:** M1 <zone> (<n> files) · M2 <zone> (<n> files) — next turn, before the spots

🔎 **Human review – <feature>** · <n> spots from tickets <NN, NN, …>

| # | Spot | Kind | Severity | Location |
|---|---|---|---|---|
| 1 | <name> | <kind> | <severity> | <location> |
| 2 | … | … | … | … |

**Under the cap** (<m>, not in the walk):
- <n+1>. <name> · <kind> · <severity> · <location>

➡️ Start with the must-read zones (or spot 1, if none) — or deselect / pull in by number first.

</overview-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

🗺️ **Map – delete-order**

**Built:** An order can be deleted; when deleting takes more along than the order itself, the
confirmation names the counted consequences first.

1. The user clicks "Delete" on an order   ✅ [delete opens the confirmation](src/orders/order-list.test.tsx#L22)
2. The app asks the server what deleting would take along   📍1   ✅ [test_preview_counts_items](tests/test_orders.py#L40) (only orders with line items)
3. The confirmation shows the counts; confirming is locked while counting   ◻ no test
4. The server deletes the order and everything counted   📍2   ✅ [test_preview_matches_the_real_deletion](tests/test_orders.py#L71) +1

**Not touched:** user accounts, file storage · **Touched:** stored orders and their line items

🚪 **Door:** one-way — a migration adds a deletion date to every stored order (every installation
on the shared database, older versions included) · two-way: the rest

📕 **Must-read:** M1 Deletion (2 files) — next turn, before the spots

🔎 **Human review – delete-order** · 2 spots from tickets 06, 07

| # | Spot | Kind | Severity | Location |
|---|---|---|---|---|
| 1 | Order without line items deleted unasked | Silent decision | Data loss | order_service.py:140 |
| 2 | "Undo" gone before it's noticed (try it) | User experience | Data loss | order-list.tsx:58 |

➡️ Start with the must-read zones (or spot 1, if none) — or deselect / pull in by number first.
