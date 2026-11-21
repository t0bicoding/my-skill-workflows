# Report Template

The fixed form of every `/compass` report. Labels are translated into the chat language; signs stay. Leave out a section that would be empty, except *Order* — with nothing to order, it says so in one line.

<report-template>

🧭 **Compass** — <project name>, as of <date> · `<HEAD short hash>`

<One sentence: N open features (x clarifying, y ready to cut, z building, w ready to close), Q open quick tickets; T open tickets in all (c clarification, i implementation); K conflicts (b blocking).>

### Open work

| Feature | What it does | Stage | Tickets | Blocked by |
|---|---|---|---|---|
| [<feature>](<path to specifications.md>) | <one sentence, in the user's words> | <stage> | <open clar.> 🙋 · <open impl.> · <closed> ✅ | <`⛔ <item>` / `⚡ <item>` / `⚠ <item>` / —> |
| [quick: <title>](<path>) | <one sentence> | open quick ticket | — | <…> |

### Dependencies

<Only when there is at least one cross-item edge or overlap. One line per edge, hard first:>

```
<A>  ──⛔──▶  <B>     <A> must be done before <B> can start
<C>  ┄┄⚠┄┄▶  <D>     both touch <file/module> — serialize
```

- ⛔ <A> → <B>: <reason in a few words> — [<source>](<file#Lline>)
- ⚠ <C> ↔ <D>: <derived: both touch `<file>`> / <what the source says> — [<source>](<file#Lline>)

### Conflicts

<Only when there are any. Blocking first, then costly, then unsure. Numbered, so the user can answer `conflict <n>`.>

**⚡1 · <kind> · <blocking | costly | unsure>** — <A> ↔ <B>, at <shared point: term, file, endpoint, rule>
- <A> says: „<short quote>" — [<source>](<file#Lline>)
- <B> says: „<short quote>" — [<source>](<file#Lline>)
- Built both as written: <what goes wrong, one sentence>
- To settle: <which side gives, how> → `<command>` <for unsure: the question that settles it>

**⚡2 · …**

### Order

1. **<feature> NN – <ticket title>** — <reason, naming its rule: hard edge / conflict / started / unblocks n / stated risk / overlap / small and ready> → `<command>`
2. …
- ⏸ **<feature> NN – <ticket title>** — held until ⚡<n> is settled

<At most ten steps; more → "then: <feature>, <feature> (in this order)" in one line.>

**Lanes** — can run in parallel chats:
- Lane 1: <feature> → <feature> — `/implement <feature> all` then `/implement <feature> all --after <feature>`
- Lane 2: …

**🙋 Waits for you** — can be done while a lane builds:
- settle ⚡<n> — `<command>` — <what it unblocks>
- `<command>` — <what it decides, what it unblocks>

### Oddities

<Only when there are any. One line each, with the place and who fixes it — never fixed here.>
- ⚠ <ticket> has `Status: closed` but lies outside `closed/` — [<path>](<path>)
- ⚠ <ticket> is blocked by `<NN>`, which doesn't exist
- ⚠ every ticket of <feature> is closed, the feature is not — `/close-feature <feature>`
- ⚠ cycle: <A> ⛔ <B> ⛔ <A>

➡️ **Next:** `<the one command to paste now>` — <why this one>

<reply line:> Reply with a feature name for its tickets in detail · `why <step>` · `conflict <n>` · a ticket to explain (→ `/explain-me`).

</report-template>

## Notes

- *What it does* is the feature's effect for the user, not its tickets: "an oscilloscope image no longer vanishes when the app closes mid-save", not "12 bug fixes".
- *Tickets* counts per feature: open clarification tickets (with 🙋, they need the user), open implementation tickets, and closed ones (with ✅). A ticket `in-progress` is shown as `▶`.
- In a narrowed report (`/compass <feature>`), *Open work* lists that feature's tickets instead of features — `NN – title | what it delivers | status | model/effort | blocked by` — and *Dependencies* and *Conflicts* keep only what this feature is part of.
- A conflict's quotes are short — the words that clash, not the paragraph; `conflict <n>` gives the full passages.
- With no conflicts found, *Conflicts* is left out and the summary line says "no conflicts" — so the user knows the check ran.
- Commands use the skills the project has; a step without a skill is described in words.
