# Scope Template

A scope cut sorts everything the feature could do into **In**, **Later** and **Never**, so the
feature stays small enough to ship and nothing gets lost silently. Its outcome feeds the spec's
**Solution** (In) and **Out of Scope** (Later, Never).

## When to draw one

- The agenda keeps growing, or ideas pile up that aren't needed for the first version.
- The user asks "do we need that now?".
- Once near the end, as a check before the summary.

## Rules

- One line per item, each with a few words of reason.
- **In** alone must be usable end to end — a version the user would actually use, not a layer
  without its counterpart.
- **Later** names what In must keep open so the item stays cheap later (a field, an
  extension point, no decision that rules it out). Nothing to keep open → say so.
- **Never** names why — so the idea doesn't come back in the next feature without the reason.
- Moving an item between columns is a decision: confirm it with ✅, like any other point.
- Labels in the chat language, in the user's words.

<scope-template>

✅ **In**

- <item> — <why it's needed now>

⏳ **Later**

- <item> — <why later> · keep open: <what In must not rule out>

🚫 **Never**

- <item> — <why not>

</scope-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

✅ **In**

- Export the current table as CSV — the actual need
- Choose the separator — Excel in German needs `;`

⏳ **Later**

- Scheduled export by e-mail — nobody asked yet · keep open: export logic separate from the button
- Export as Excel file — CSV is enough for now · keep open: nothing

🚫 **Never**

- Export of other users' private views — would leak data they didn't share
