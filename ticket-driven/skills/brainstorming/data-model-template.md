# Data Model Template

A data model sketch shows the things a feature stores and how they hang together — what belongs
to what, what goes when something is deleted, and what becomes of the data that already exists.
It stays in the user's words: things and relations, not tables and column types. Its outcome
feeds the spec's **Implementation Decisions** (schema changes).

## When to draw one

- The feature introduces a new thing that is stored, or a new relation between existing ones.
- A point asks "what belongs to what?", "what happens to X when Y is deleted?" or "what about
  the old data?".

Don't draw one for a single new field on an existing thing — a short question is enough then.

## Rules

- Only the things that change, plus their direct neighbours so the change can be placed.
- Things in the user's words (vocabulary from `CONTEXT.md` or `CONTEXT-MAP.md` if the project
  has one), labels in the chat language; no table names, column types or IDs.
- Under each changed thing, list the few facts it holds that the point is about.
- Every new relation gets a deletion row: what happens to the other side.
- The **Existing records** line is mandatory as soon as an existing thing is touched: what existing
  records become, and whether anything has to be filled in for them.
- Same markers as the sequence: `❓ Point <n>` open, `✅` decided, `⚠️` something outside can
  interfere.

## Legend

| Sign | Meaning |
|---|---|
| `[ Thing ]` | a stored thing |
| `+[ Thing ]` | new in this feature |
| `~[ Thing ]` | existing, changed in this feature |
| `1 ──── 1` | one to one |
| `1 ───< n` | one to many |
| `n >───< n` | many to many |
| `· fact` | a fact the thing holds |

<data-model-template>

```
[ <thing A> ] 1 ───< n +[ <thing B> ]
                         · <fact>
                         · <fact>  ❓ Point <n>
                         │ n
                         │
                         ┴ 1
                     ~[ <thing C> ]
                         · <new fact>
```

| When deleting | goes along | stays | Deletion blocked while |
|---|---|---|---|
| <thing A> | <thing B> | — | — |
| <thing C> | — | <thing B>, link becomes empty | — ❓ Point <n> |

Existing records: <what existing records become, what must be filled in for them>

</data-model-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

```
[ Project ] 1 ───< n +[ Attachment ]
                         · file name
                         · uploaded by, uploaded at
                         · visible to customer  ❓ Point 2
                         │ n
                         │
                         ┴ 1
                     ~[ Task ]
                         · + attachments shown in the task view
```

| When deleting | goes along | stays | Deletion blocked while |
|---|---|---|---|
| Project | all its attachments ✅ | — | — |
| Task | — | attachment, link becomes empty | — ❓ Point 3 |

Existing records: existing tasks have no attachments — nothing to fill in.
