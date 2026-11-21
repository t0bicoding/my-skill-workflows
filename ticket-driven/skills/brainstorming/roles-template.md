# Roles Template

A roles matrix shows who may do what: actors in the rows, actions in the columns, and for every
cell allowed, forbidden or allowed only under a condition. Its outcome feeds the spec's
**Implementation Decisions** and the actors of its **User Stories**.

## When to draw one

- More than one actor touches the same thing — different roles, an owner and the others, a person
  and an automatic process.
- A point asks "who may …?", "what does someone else see?" or "can X undo what Y did?".

Even a project without permissions can need one: "allowed" then means "the system lets it
happen", for example only the one holding a lock may edit.

## Rules

- Actors are roles, not persons (owner, other user, admin, automatic job). Include the system
  itself when it acts on its own.
- Only the actions the point is about, in the user's words; labels in the chat
  language.
- Every `◐` gets its condition in a footnote below the table.
- For every `✖`, decide what that actor experiences: the action is hidden, disabled with a reason,
  or refused with a message. Put it in the **On ✖** line.
- Same markers as the sequence: `❓ Point <n>` open, `✅` decided, `⚠️` something outside can
  interfere.

## Legend

| Sign | Meaning |
|---|---|
| `✔` | may |
| `✖` | may not |
| `◐¹` | may, only under condition ¹ |

<roles-template>

| Actor | <action 1> | <action 2> | <action 3> |
|---|---|---|---|
| <actor 1> | ✔ | ✔ | ◐¹ |
| <actor 2> | ✔ | ✖ | ✖ ❓ Point <n> |
| <system> | — | ◐² | ✔ |

¹ <condition>
² <condition>

On ✖: <hidden / disabled with reason / refused with message>

</roles-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

| Actor | View | Edit | Delete |
|---|---|---|---|
| Author | ✔ | ✔ | ✔ |
| Other user | ✔ | ◐¹ | ✖ ❓ Point 4 |
| Cleanup job | — | — | ◐² |

¹ only while the author has no open edit
² only drafts untouched for 30 days

On ✖: button disabled, tooltip names the author ✅
