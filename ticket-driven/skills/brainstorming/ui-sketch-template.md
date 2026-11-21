# UI Sketch Template

A UI sketch is an ASCII wireframe in the chat: where something sits, what the user sees and what
they can click. It decides layout and content, not looks. Its outcome feeds the spec's
**User Stories**.

## When to draw one

- A point is about where something goes, what a view or dialog contains, or how the user gets
  there.
- Two layout variants compete — draw both.

Don't draw one when the question is how it *feels* (animation, drag, live feedback) — that can't
be decided on paper; route the point to a prototype clarification ticket instead.

## Rules

- In a plain code block, at most ~80 characters wide. Two variants side by side if they fit,
  otherwise one below the other, labelled A and B.
- Show only the part that changes, plus enough of its surroundings to find it (window title,
  neighbouring element).
- Name the trigger above the sketch: what the user did to get here.
- Number the elements a point is about with `①②③` and explain them below the sketch, one line
  each.
- Show empty, error or loading states only when they are the point.
- Use the project's existing UI words and elements where there are some (look them up first);
  labels in the chat language.
- Same markers as the sequence: `❓ Point <n>` open, `✅` decided, `⚠️` something outside can
  interfere.

## Legend

| Sign | Meaning |
|---|---|
| `┌─┐ └─┘` | window, dialog, panel |
| `[ Text ]` | button |
| `[______]` | text field |
| `[Value ▾]` | dropdown |
| `[x]` `[ ]` | checkbox |
| `(•)` `( )` | radio button |
| `≡` | list / table rows |
| `①②③` | element explained below |

<ui-sketch-template>

Trigger: <what the user did to get here>

```
┌─ <window / dialog title> ─────────────────────┐
│                                               │
│  <label>   [______________]  ①                │
│  <label>   [<value> ▾]                        │
│                                               │
│  ≡ <row>                                      │
│  ≡ <row>                                ②     │
│                                               │
│                    [ <secondary> ] [ <main> ] │
└───────────────────────────────────────────────┘
```

① <what it is and what happens on use>
② <what it is and what happens on use> ❓ Point <n>

</ui-sketch-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

Trigger: user clicks "Export" in the table toolbar

```
A: dialog                            B: menu at the button
┌─ Export ─────────────────┐         [ Export ▾ ]
│ Format  [CSV ▾]       ①  │         ├ CSV (;)        ②
│ [x] only filtered rows   │         ├ CSV (,)
│                          │         └ only filtered rows [x]
│     [ Cancel ] [ Export ]│
└──────────────────────────┘
```

① format choice stays for the next export ✅
② one click less, but options get cramped as formats grow ❓ Point 6
