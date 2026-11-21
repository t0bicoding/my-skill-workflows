# State Template

A state model shows the lifecycle of one thing — which states it can be in, which transitions
lead between them, who triggers each and what forbids it. Where a sequence follows one run through
the flow, the state model shows every run at once. Its outcome feeds the spec's
**Implementation Decisions**.

## When to draw one

- A thing in the feature has a status (draft, open, done, archived …) that changes over time.
- A point asks "can it go back?", "who may close it?" or "what happens to it when …?".

Don't draw one for a thing with only two states and one way between them — a short question is
enough then.

## Rules

- One model per thing. States are nouns or adjectives in the user's words (vocabulary from
  `CONTEXT.md` or `CONTEXT-MAP.md` if the project has one), labels in the chat language.
- Every state is reachable from the start and either has a way out or is marked as an end state.
- Every arrow names its trigger; who triggers it and what must hold go into the transition table.
- Forbidden transitions the user might expect go into the table too, marked `⛔`.
- If the thing already exists in the project, say what happens to existing records: which state
  they land in.
- Same markers as the sequence: `❓ Point <n>` open, `✅` decided, `⚠️` something outside can
  interfere.

## Legend

| Sign | Meaning |
|---|---|
| `( state )` | a state |
| `(( state ))` | end state |
| `●` | start |
| `──trigger──►` | transition and its trigger |
| `⛔` | transition that is deliberately not allowed |

<state-template>

```
   ●
   │ <how it comes into being>
   ▼
( <state 1> ) ──<trigger>──► ( <state 2> ) ──<trigger>──► (( <end state> ))
   ▲                            │
   └──────────<trigger>─────────┘
```

| From | To | Trigger | Who | Only if |
|---|---|---|---|---|
| <state 1> | <state 2> | <trigger> | <actor> | <condition> |
| <state 2> | <state 1> | <trigger> | <actor> | <condition> ❓ Point <n> |
| <end state> | <state 1> | ⛔ <why not> | — | — |

Existing records: <which state existing records land in, or "none — new thing">

</state-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

```
   ●
   │ user creates an order
   ▼
( draft ) ──submit──► ( submitted ) ──ship──► (( shipped ))
   ▲                      │
   └───────revise─────────┘
```

| From | To | Trigger | Who | Only if |
|---|---|---|---|---|
| draft | submitted | submit | customer | at least one item ✅ |
| submitted | draft | revise | customer | not yet picked ❓ Point 4 |
| submitted | shipped | ship | warehouse | paid ⚠️ payment provider may lag |
| shipped | draft | ⛔ a shipped order is a new order | — | — |

Existing records: all old orders become *shipped*.
