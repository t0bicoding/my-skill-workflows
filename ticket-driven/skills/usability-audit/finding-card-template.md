# Finding Card Template

One card per turn, about one screen. It explains a finding so the user can decide it without
opening the code: where it is, what happens today, why that's hard, and what could be done instead.

## Rules

- Write from the user's seat: the words on screen and the steps they take, not component or
  function names. Code appears only as the link in **Where**.
- **Today** tells the task as numbered steps and ends with `→` at the step where it gets hard,
  quoting the label, message, or what's missing.
- **Why it's hard** names the cost in the user's terms — the wrong guess and what follows, the
  extra steps (counted), the waiting, the dead end — and how often the task runs.
- **Options**: two to four, each keeping the function, each with what changes for the user and its
  effort (small, medium, large). Prefer options that differ in kind, not three shades of one idea.
- The options always end with the fixed fallback **🧪 P: settle it in a prototype**, naming which
  options the prototype would compare — so the user never has to force a decision from text. When
  whether it's easier depends on how it looks or feels, recommend `P`.
- **Watch out** carries what could interfere: a deliberate friction nearby, a UI convention an
  option breaks, tests that assert today's text, an overlapping open feature. Leave the line out
  when there is nothing.
- A sketch only when placement is the point, in the form of
  [ui-sketch-template.md](../brainstorming/ui-sketch-template.md): today and the recommendation.
- Labels in the chat language; the signs stay as they are.

<finding-card-template>

🧭 **Finding <n>/<N> – <title>** · <hurdle class> · <severity>

📍 **Where:** <view or dialog as the user names it> — [<file>:<line>](<path>#L<line>)

🔁 **Today:** <the task in one line>
1. <step — what the user clicks or types, what they see>
2. <step>
→ <the step where it gets hard, quoting the label or message>

😕 **Why it's hard:** <the cost for the user, and how often the task runs>

**Options** — the function stays the same in each:
➡️ A: <option> — <what changes for the user> · Effort <small | medium | large>
➡️ B: <option> — <what changes for the user> · Effort <small | medium | large>
🧪 P: Settle it in a prototype — <options> side by side in the real view; decided in a
prototype ticket
⚠️ **Watch out:** <what could interfere>
⭐ **Recommendation: <letter | P>** — <why, in one or two sentences>

Answer with a letter, **P** if you can't decide from the text, your own variant, **leave it**,
or **think it over** (brainstorming ticket).

✅ <n> decided · ↪ <n> handed off · ⏭ <n> left · ▢ <n> to go

</finding-card-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

🧭 **Finding 2/8 – Project has to be picked again for every entry** · Effort · Frequent friction

📍 **Where:** Timesheet › New entry — [EntryForm.tsx:57](src/timesheet/EntryForm.tsx#L57)

🔁 **Today:** Log the day's work, usually five to eight entries on the same project
1. Clicks "New entry"
2. Picks the project from a list of about 40, types hours and a note
3. Clicks "Save" — the form opens empty again
→ the project field is back on "– choose –" for every further entry

😕 **Why it's hard:** On a typical day the project gets picked seven times instead of once, each
time scrolling a list of 40. Logging time is the daily task of every user (README › Typical day).

**Options** — the function stays the same in each:
➡️ A: The project of the last entry is preselected — the user changes it only when it changes ·
Effort small
➡️ B: A "Save and next" button that keeps project and date, next to "Save" — the user chooses
per entry · Effort medium
➡️ C: The project list starts with the five projects used most recently, then all others —
picking gets faster, but still once per entry · Effort medium
🧪 P: Settle it in a prototype — A and B side by side in the real timesheet; decided in a
prototype ticket
⚠️ **Watch out:** The project stays a required field (deliberate friction: "no time without a
project", ADR-0004) — it gets preselected, never left out. `EntryForm.test.tsx` asserts the
empty form after saving and gets updated on purpose.
⭐ **Recommendation: A** — removes six of seven picks with the smallest change, and a wrong
preselection is visible right in the form before saving.

Answer with a letter, **P** if you can't decide from the text, your own variant, **leave it**,
or **think it over** (brainstorming ticket).

✅ 1 decided · ↪ 0 handed off · ⏭ 0 left · ▢ 7 to go
