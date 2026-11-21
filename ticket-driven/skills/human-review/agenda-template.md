# Agenda Template

The agenda closes every spot turn and shows where the walk stands: what is judged, what is next,
what still waits under the cap. It is one line, because the overview already listed every spot
with its name and the current spot's head names it again; lines below it say only what the last
verdict changed.

## Rules

- **Walk order, numbers stable.** Spots stand in the order of the walk and keep their number for
  the whole run; a spot pulled in from under the cap keeps its number and moves into the line at
  its walk position.
- **Must-read zones** stand first, as `📕 M<n>` with their verdict sign. Leave them out when no zone
  was hit.
- Each spot is its sign and number. `▶` marks the spot shown in this turn, in bold; an open spot
  has no sign. A short note in italics only where it helps: `(touches <n>)` when a verdict on that
  spot may settle this one, `(try it)` when the user will set a value.
- `···` closes the line with the spots under the cap and how to pull them in; leave it out when the
  cap took nothing.
- **After a verdict**, one line each, only lines that apply: `🎫` the chosen option and the target
  in a few words, `🔗` a later spot the verdict may settle, `➕` a spot pulled in. An `ok` needs no
  line — its sign says it.
- Labels in the chat language.

## Legend

| Sign | Meaning |
|---|---|
| `📕` | must-read zone — read as a raw diff before the spots |
| `▶` | shown in this turn |
| `✅` | ok — today stays (a zone: read) |
| `🎫` | finding — becomes a ticket |
| `⊘` | deselected (a zone: skipped) |
| `⏸` | waits for a lookup the user asked for |
| `➕` | pulled in from under the cap |
| `🔗` | a verdict here may settle that spot |
| `···` | under the cap, not in the walk |

<agenda-template>

📋 📕 M<n> <sign> · <sign> <n> · ▶ **<n>** · <n> *(touches <n>)* · <n> *(try it)* · ··· <n>–<n> under the cap — "show <n>–<n>"
🎫 <n>. <option> — <the target in a few words>
🔗 <n>. <why a verdict here may settle it>
➕ <n>. pulled in

</agenda-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

📋 📕 M1 ✅ · ✅ 1 · 🎫 2 · ▶ **3** · 4 *(touches 1)* · 5 · ··· 11–12 under the cap — "show 11–12"
🎫 2. B — "Undo" stays for 6 seconds
🔗 4. counts what spot 1 asks about — its verdict may already settle it
