# As-Is Template

An as-is comparison puts today's behavior — looked up, not remembered — next to the planned
behavior, so the change is visible in one place and nobody plans against a system that doesn't
exist. Its outcome feeds the spec's **Problem Statement** (today) and **Solution** (planned).

## When to draw one

- The feature changes behavior that already exists.
- The user describes today's behavior and it's unclear whether the code really does that.

Don't draw one for something entirely new — there is no "today" to compare with.

## Rules

- The **Today** column comes from the code or a scout, never from memory or assumption. Each
  line carries its evidence (`file:line`, a test, observed behavior). What couldn't be verified
  is marked `?` and gets looked up before the point is decided.
- Evidence belongs in the chat only — the spec doesn't take file paths.
- One row per aspect that changes; aspects that stay the same are left out, unless the user
  expects them to change.
- **Who notices** names who notices the change: users used to the old behavior, existing data,
  other features, other installations.
- A row where the change breaks something for existing users or data carries `⚠️` and needs a
  decision on how to bridge it (migration, notice, transition period).
- Labels in the chat language, in the user's words.

<as-is-template>

| Aspect | Today (verified) | Planned | Who notices |
|---|---|---|---|
| <aspect> | <behavior> — <evidence> | <planned behavior> | <who> |
| <aspect> | <behavior> ? | <planned behavior> ❓ Point <n> | <who> |
| <aspect> | <behavior> — <evidence> | <planned behavior> | ⚠️ <who, and what breaks> |

</as-is-template>

## Example

Illustrative only, labels shown in English — in a session they follow the chat language.

| Aspect | Today (verified) | Planned | Who notices |
|---|---|---|---|
| Search scope | titles only — `search_service.py:42` | titles and descriptions | all users, more hits ✅ |
| Sort order | newest first — `test_search_sorts_by_date` | best match first ❓ Point 2 | users who scan by date |
| Saved searches | stored as raw text ? | stored as a filter object | ⚠️ existing saved searches must be converted |
