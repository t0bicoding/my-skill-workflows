# Agenda Template

The agenda tree is the steering of a brainstorming session: it shows every open point, which point
blocks which, and why the next point comes next. It closes every turn in place of a flat list.

## Priority

Only a point whose prerequisites are settled can be worked — the roots of the tree. Among those:

1. the point that blocks the most other points,
2. then the point with the most expensive worst case,
3. cosmetics last.

A point waiting for a scout is skipped until the scout reports.

## Rules

- **Numbers are stable.** A point keeps its number for the whole session, so `❓ Point <n>` in a
  sequence, table or sketch stays valid. A new point gets the next free number, never a reused one.
- A point that depends on another sits under it in the tree. A point blocked by two others sits
  under the one decided last, with `(also <n>)`.
- `▶` marks the point worked next, with a few words on why it comes first.
- After each decision, list what changed — one line each, only lines that apply:
  `🔓` unblocked, `➕` new (and which answer opened it), `✂` dropped (and why it became moot).
- Decided points leave the tree; the header counts them.
- Labels in the chat language.

## Legend

| Sign | Meaning |
|---|---|
| `▶` | worked next |
| `├─` `└─` | waits for the point above |
| `⏸` | waits for a scout |
| `↪` | handed off to a clarification ticket |
| `🔓` | unblocked by the last decision |
| `➕` | new point |
| `✂` | dropped, moot |

<agenda-template>

📋 **Agenda** (✅ <n> decided · ↪ <m> handed off)
```
▶ <n>. <title> — <why it comes first>
   ├─ <n>. <title>
   │   └─ <n>. <title>
   └─ <n>. <title>
  <n>. <title>  ⏸ Scout: <question>
  <n>. <title>  (also <n>)
  <n>. <title>  (cosmetic)
```
🔓 <n>. <title>
➕ <n>. <title> — <which answer opened it>
✂ <title> — <why moot>

</agenda-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

📋 **Agenda** (✅ 3 decided · ↪ 1 handed off)
```
▶ 5. Who may delete an attachment — every later point depends on it
   ├─ 6. What the others see while it is deleted
   └─ 7. Undo after deleting
  4. Maximum file size  ⏸ Scout: what does the server accept today?
  8. Icon per file type  (cosmetic)
```
🔓 5. Who may delete an attachment
➕ 7. Undo after deleting — from "deleting removes the file right away"
✂ Recycle bin — moot, attachments are removed for good
